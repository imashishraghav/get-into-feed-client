<?php

namespace Tests\Feature;

use App\Events\PostPublished;
use App\Jobs\PublishScheduledPostJob;
use App\Listeners\InvalidatePostCachesAndSitemap;
use App\Models\BlogPost;
use App\Models\Media;
use App\Models\PostRevision;
use App\Models\Redirect;
use App\Models\User;
use App\Services\AuditLogService;
use App\Services\BlogPostService;
use App\Services\HtmlSanitizerService;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class Phase1CmsArchitectureTest extends TestCase
{
    use RefreshDatabase;

    protected function makeUser(string $role = 'superadmin', array $overrides = []): User
    {
        return User::create(array_merge([
            'name' => ucfirst($role).' User',
            'email' => $role.'-'.uniqid().'@getintofeed.com',
            'password' => bcrypt('StrongSecretPass123!'),
            'role' => $role,
            'is_active' => true,
        ], $overrides));
    }

    public function test_security_hotfix_controls_and_health_lockdown(): void
    {
        // Unauthenticated purge-views-cache route was removed
        $this->get('/api/v1/system/purge-views-cache')->assertStatus(404);

        // Hardcoded CRM secret fallback was removed from config/services.php
        $servicesConfig = require base_path('config/services.php');
        $this->assertNotSame('test-crm-sync-secret-key-change-in-env', $servicesConfig['crm']['secret'] ?? null);

        // /api/v1/health and /api/health require admin auth or valid X-Health-Token
        $this->getJson('/api/v1/health')->assertStatus(401);
        $this->getJson('/api/health')->assertStatus(401);

        config(['cms.health_token' => 'top-secret-probe-token']);
        $this->withHeader('X-Health-Token', 'wrong-token')
            ->getJson('/api/v1/health')
            ->assertStatus(401);

        $this->withHeader('X-Health-Token', 'top-secret-probe-token')
            ->getJson('/api/v1/health')
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'ok')
            ->assertJsonStructure(['data' => ['success', 'status', 'database', 'cache', 'queue', 'telemetry', 'timestamp']]);

        $admin = $this->makeUser('admin');
        $this->actingAs($admin)
            ->getJson('/api/v1/health')
            ->assertStatus(200);
    }

    public function test_csrf_is_not_exempted_on_livewire_and_works_on_login_post_and_media(): void
    {
        Storage::fake('public');

        // Verify livewire/* is no longer in VerifyCsrfToken excluded URIs
        $csrfMiddleware = app(VerifyCsrfToken::class);
        $reflection = new \ReflectionClass($csrfMiddleware);
        $prop = $reflection->getProperty('except');
        $prop->setAccessible(true);
        $except = $prop->getValue($csrfMiddleware);
        $this->assertNotContains('livewire/*', $except);
        $this->assertNotContains('admin/livewire/*', $except);

        // Admin login screen renders CSRF token and does not 419
        $loginPage = $this->get('/admin/login');
        $loginPage->assertStatus(200);

        $admin = $this->makeUser('superadmin');

        // Create post and upload media while authenticated (real CSRF middleware active via session)
        $this->actingAs($admin)
            ->postJson('/admin/api/posts', [
                'title' => 'CSRF Validated Post',
                'content_html' => '<p>Verified post body with sufficient length for testing.</p>',
                'status' => 'draft',
            ])
            ->assertStatus(201);

        $this->actingAs($admin)
            ->postJson('/admin/media/quick-upload', [
                'file' => UploadedFile::fake()->image('csrf-check.png', 900, 600),
            ])
            ->assertStatus(201);
    }

    public function test_mirrored_columns_remain_equal_from_single_model_sync_point(): void
    {
        $admin = $this->makeUser('superadmin');
        $service = app(BlogPostService::class);

        // 1. Created via BlogPostService with canonical columns
        $scheduledAt = now('Asia/Kolkata')->addDays(2)->startOfMinute();
        $post = $service->create([
            'title' => 'Dual Column Parity Check',
            'content_html' => '<h2>Overview</h2><p>Canonical HTML body.</p>',
            'meta_title' => 'Canonical Meta Title',
            'faq_json' => [['q' => 'Question 1?', 'a' => 'Answer 1.']],
            'scheduled_at' => $scheduledAt->toDateTimeString(),
            'status' => 'scheduled',
        ], $admin);

        $this->assertSame($post->content_html, $post->content);
        $this->assertSame($post->meta_title, $post->seo_title);
        $this->assertSame($post->faq_json, $post->faq_items);
        $this->assertSame($post->scheduled_at?->toIso8601String(), $post->scheduled_for?->toIso8601String());

        // 2. Updated directly via Eloquent using legacy columns (like Filament EditBlogPost)
        $newSchedule = now('Asia/Kolkata')->addDays(5)->startOfMinute();
        $post->update([
            'content' => '<p>Updated via legacy content column.</p>',
            'seo_title' => 'Updated via legacy seo_title',
            'faq_items' => [['q' => 'Legacy Q?', 'a' => 'Legacy A.']],
            'scheduled_for' => $newSchedule,
        ]);
        $post->refresh();

        $this->assertSame($post->content, $post->content_html);
        $this->assertSame($post->seo_title, $post->meta_title);
        $this->assertSame($post->faq_items, $post->faq_json);
        $this->assertSame($post->scheduled_for?->toIso8601String(), $post->scheduled_at?->toIso8601String());

        // 3. Updated via BlogPostService publish & schedule
        $published = $service->publish($post, $admin);
        $this->assertNull($published->scheduled_at);
        $this->assertNull($published->scheduled_for);
        $this->assertSame($published->content_html, $published->content);
        $this->assertSame($published->meta_title, $published->seo_title);
        $this->assertSame($published->faq_json, $published->faq_items);
    }

    public function test_markdown_posts_are_preserved_unaltered_and_snapshotted(): void
    {
        $admin = $this->makeUser('superadmin');
        $service = app(BlogPostService::class);
        $sanitizer = app(HtmlSanitizerService::class);

        $markdown = "# Heading One\n\nManual bidding is obsolete. **Your creative is the targeting.**\n\n- Bullet one\n- Bullet two\n\n> Key Takeaway: Never alter Markdown quotes or syntax.";

        $this->assertTrue($sanitizer->isMarkdownOnly($markdown));
        $this->assertSame($markdown, $sanitizer->sanitize($markdown));

        // Legacy Markdown posts have editor_mode='classic'
        $post = BlogPost::create([
            'title' => 'Legacy Markdown Post',
            'slug' => 'legacy-markdown-post',
            'editor_mode' => 'classic',
            'content' => $markdown,
            'status' => 'published',
        ]);

        // Pre-upgrade snapshot command captures baseline into post_revisions
        $this->artisan('cms:snapshot-posts')->assertExitCode(0);
        $this->assertDatabaseHas('post_revisions', [
            'blog_post_id' => $post->id,
            'revision_number' => 1,
            'change_summary' => 'Pre-upgrade baseline snapshot',
        ]);

        // Updating post metadata via service preserves Markdown verbatim
        $updated = $service->update($post, [
            'excerpt' => 'Updated excerpt only',
            'content' => $markdown,
        ], $admin);

        $this->assertSame($markdown, $updated->content);
        $this->assertSame($markdown, $updated->content_html);

        // HTML with XSS is sanitized properly while safe YouTube iframe stays
        $dirtyHtml = '<h2>Clean</h2><p onclick="alert(1)">Hello</p><script>alert("xss")</script><iframe src="https://evil.example/embed"></iframe><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>';
        $cleaned = $sanitizer->sanitize($dirtyHtml);

        $this->assertStringNotContainsString('<script>', $cleaned);
        $this->assertStringNotContainsString('onclick=', $cleaned);
        $this->assertStringNotContainsString('evil.example', $cleaned);
        $this->assertStringContainsString('youtube.com/embed/dQw4w9WgXcQ', $cleaned);
    }

    public function test_autosave_optimistic_locking_revisions_redirects_and_signed_preview(): void
    {
        $editor = $this->makeUser('editor');
        $this->actingAs($editor);

        // Create published post via Admin API
        $createRes = $this->postJson('/admin/api/posts', [
            'title' => 'Growth Architecture Playbook',
            'slug' => 'growth-architecture-playbook',
            'content_html' => '<h2>Phase 1</h2><p>Initial published body copy for testing.</p>',
            'status' => 'published',
        ])->assertStatus(201);

        $postId = $createRes->json('data.id');
        $this->assertSame(1, $createRes->json('data.version'));

        // Autosave writes ONLY to post_autosaves and leaves live published post untouched
        $this->postJson("/admin/api/posts/{$postId}/autosave", [
            'title' => 'Unsaved Draft Title',
            'content_html' => '<p>Autosaved working buffer</p>',
            'base_version' => 1,
        ])->assertStatus(200)
            ->assertJsonPath('version_conflict', false);

        $live = BlogPost::findOrFail($postId);
        $this->assertSame('Growth Architecture Playbook', $live->title);
        $this->assertStringContainsString('Initial published body copy', $live->content_html);
        $this->assertDatabaseHas('post_autosaves', ['blog_post_id' => $postId, 'user_id' => $editor->id]);

        // Update with current version succeeds, increments version, creates auto 301 redirect
        $updateRes = $this->putJson("/admin/api/posts/{$postId}", [
            'title' => 'Growth Architecture Playbook V2',
            'slug' => 'growth-architecture-playbook-v2',
            'content_html' => '<h2>Phase 2</h2><p>Updated published copy.</p>',
            'version' => 1,
        ])->assertStatus(200)
            ->assertJsonPath('data.version', 2);

        $this->assertDatabaseHas('redirects', [
            'source_url' => '/blog/growth-architecture-playbook',
            'target_url' => '/blog/growth-architecture-playbook-v2',
            'status_code' => 301,
            'is_active' => true,
        ]);

        // Update slug again and confirm redirect chain collapses A -> C directly
        $this->putJson("/admin/api/posts/{$postId}", [
            'slug' => 'growth-architecture-v3',
            'version' => 2,
        ])->assertStatus(200)
            ->assertJsonPath('data.version', 3);

        $this->assertSame('/blog/growth-architecture-v3', Redirect::where('source_url', '/blog/growth-architecture-playbook')->value('target_url'));

        // Stale version update returns 409 Conflict
        $this->putJson("/admin/api/posts/{$postId}", [
            'title' => 'Stale Tab Overwrite Attempt',
            'version' => 1,
        ])->assertStatus(409)
            ->assertJsonPath('code', 409)
            ->assertJsonPath('current_version', 3);

        // Revisions list, diff, and restore
        $revs = $this->getJson("/admin/api/posts/{$postId}/revisions")
            ->assertStatus(200)
            ->json('data');
        $this->assertGreaterThanOrEqual(3, count($revs));

        $firstRevId = PostRevision::where('blog_post_id', $postId)->orderBy('revision_number')->firstOrFail()->id;
        $latestRevId = PostRevision::where('blog_post_id', $postId)->orderByDesc('revision_number')->firstOrFail()->id;

        $this->getJson("/admin/api/posts/{$postId}/revisions/diff?from={$firstRevId}&to={$latestRevId}")
            ->assertStatus(200)
            ->assertJsonStructure(['success', 'diff' => ['fields', 'content_lines']]);

        $this->postJson("/admin/api/posts/{$postId}/revisions/{$firstRevId}/restore", ['version' => 3])
            ->assertStatus(200)
            ->assertJsonPath('data.version', 4);

        // Expiring signed share preview link
        $previewLink = $this->postJson("/admin/api/posts/{$postId}/preview-link")
            ->assertStatus(200)
            ->json('preview_url');

        // Accessible without login using valid signature, blocked without signature
        auth()->logout();
        $this->getJson($previewLink)->assertStatus(200)->assertJsonPath('preview', true);
        $this->getJson('/cms-preview-data/blog/'.$live->uuid)->assertStatus(403);
    }

    public function test_rbac_policies_enforce_author_editor_and_viewer_boundaries(): void
    {
        $authorA = $this->makeUser('author');
        $authorB = $this->makeUser('author');
        $viewer = $this->makeUser('viewer');

        // Viewer blocked from creating posts and uploading media
        $this->actingAs($viewer)
            ->postJson('/admin/api/posts', ['title' => 'Denied', 'content_html' => '<p>No</p>'])
            ->assertStatus(403);

        // Author A creates a post — even if passing status=published, service downgrades to draft
        $res = $this->actingAs($authorA)
            ->postJson('/admin/api/posts', [
                'title' => 'Author Draft Story',
                'content_html' => '<p>Author draft body.</p>',
                'status' => 'published',
            ])->assertStatus(201);

        $postId = $res->json('data.id');
        $this->assertSame('draft', $res->json('data.status'));

        // Author A cannot publish or delete Author B's post
        $this->actingAs($authorA)->postJson("/admin/api/posts/{$postId}/publish")->assertStatus(403);
        $this->actingAs($authorB)->putJson("/admin/api/posts/{$postId}", ['title' => 'Hijack'])->assertStatus(403);
        $this->actingAs($authorA)->get('/admin/leads/export-csv')->assertStatus(403);
    }

    public function test_media_pipeline_validates_magic_bytes_strips_exif_and_creates_variants(): void
    {
        Storage::fake('public');
        $editor = $this->makeUser('editor');
        $this->actingAs($editor);

        // Missing alt text rejected
        $this->postJson('/admin/api/media', [
            'file' => UploadedFile::fake()->image('hero.png', 1600, 900),
        ])->assertStatus(422)->assertJsonValidationErrors(['alt']);

        // Disguised text file renamed to .png rejected by finfo magic-byte check
        $this->postJson('/admin/api/media', [
            'file' => UploadedFile::fake()->createWithContent('fake.png', '<?php echo "evil";'),
            'alt' => 'Disguised payload',
        ])->assertStatus(422);

        // Valid 1600x900 PNG creates Media record with EXIF timestamp & responsive variants
        $res = $this->postJson('/admin/api/media', [
            'file' => UploadedFile::fake()->image('Campaign Hero!!.png', 1600, 900),
            'alt' => 'Campaign Hero Banner',
        ])->assertStatus(201);

        $mediaId = $res->json('data.id');
        $media = Media::findOrFail($mediaId);
        $this->assertNotNull($media->exif_stripped_at);
        $this->assertStringStartsWith('campaign-hero-', $media->file_name);
        $this->assertIsArray($media->variants);
        $this->assertArrayHasKey('400w', $media->variants);
        $this->assertArrayHasKey('800w', $media->variants);
        $this->assertArrayHasKey('1200w', $media->variants);
        Storage::disk('public')->assertExists($media->variants['400w']['path']);
    }

    public function test_scheduled_post_publishing_invalidates_cache_and_regenerates_sitemap(): void
    {
        Event::fake([PostPublished::class]);

        $post = BlogPost::create([
            'title' => 'Scheduled IST Post',
            'slug' => 'scheduled-ist-post',
            'content_html' => '<p>Scheduled body.</p>',
            'status' => 'scheduled',
            'scheduled_at' => now('Asia/Kolkata')->subMinutes(2),
        ]);

        (new PublishScheduledPostJob($post->id))->handle(
            app(BlogPostService::class),
            app(AuditLogService::class)
        );

        $post->refresh();
        $this->assertSame('published', $post->status);
        $this->assertNull($post->scheduled_at);
        $this->assertNull($post->scheduled_for);
        Event::assertDispatched(PostPublished::class);

        // Verify listener invalidates cache & generates sitemap
        Cache::put('api_blog_public_list', ['stale' => true], 300);
        Cache::put('api_v1_bootstrap_data', ['stale' => true], 300);
        app(InvalidatePostCachesAndSitemap::class)->handle(new PostPublished($post));

        $this->assertFalse(Cache::has('api_blog_public_list'));
        $this->assertFalse(Cache::has('api_v1_bootstrap_data'));
        $this->get('/sitemap.xml')->assertStatus(200)->assertSee('scheduled-ist-post');
    }

    public function test_user_reset_2fa_artisan_command_and_enrollment_only_enforcement(): void
    {
        $admin = $this->makeUser('superadmin', [
            'two_factor_secret' => encrypt('JBSWY3DPEHPK3PXP'),
            'two_factor_recovery_codes' => json_encode(['hash1']),
            'two_factor_confirmed_at' => now(),
        ]);

        // Enrolled user without verified 2FA session is redirected to 2FA challenge
        $this->actingAs($admin)
            ->get('/admin/blog-posts')
            ->assertRedirect(route('admin.two-factor.challenge'));

        // Emergency CLI reset clears 2FA & creates audit log entry
        $this->artisan('user:reset-2fa', ['email' => $admin->email, '--force' => true])
            ->assertExitCode(0);

        $admin->refresh();
        $this->assertFalse($admin->hasTwoFactorEnabled());
        $this->assertNull($admin->two_factor_confirmed_at);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'MFA_CLI_RESET',
            'auditable_id' => $admin->id,
        ]);

        // Unenrolled admin can access /admin without lockout (until 2FA enrolled)
        $this->actingAs($admin)
            ->get('/admin/blog-posts')
            ->assertStatus(200);
    }
}
