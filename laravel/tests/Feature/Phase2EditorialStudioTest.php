<?php

namespace Tests\Feature;

use App\Filament\Resources\BlogPostResource\Pages\CreateBlogPost;
use App\Filament\Resources\BlogPostResource\Pages\EditBlogPost;
use App\Models\BlogPost;
use App\Models\PostRevision;
use App\Models\User;
use App\Services\BlogPostService;
use App\Services\HtmlSanitizerService;
use App\Services\ReadabilityService;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Livewire\Livewire;
use Tests\TestCase;

class Phase2EditorialStudioTest extends TestCase
{
    use RefreshDatabase;

    protected function makeUser(string $role = 'superadmin'): User
    {
        return User::create([
            'name' => ucfirst($role).' User',
            'email' => $role.'-'.uniqid().'@getintofeed.com',
            'password' => bcrypt('StrongSecretPass123!'),
            'role' => $role,
            'is_active' => true,
        ]);
    }

    public function test_html_sanitizer_preserves_tiptap_blocks_and_blocks_xss_bypass_vectors(): void
    {
        $sanitizer = app(HtmlSanitizerService::class);

        $html = <<<'HTML'
<h2 id="intro" class="gif-align-center">Intro Heading</h2>
<p>Marked <mark>key point</mark>, <u>underlined</u>, and <s>struck</s>.</p>
<div class="gif-callout gif-callout-tip" data-callout="true" data-type="tip"><p>Actionable tip</p></div>
<div class="gif-cta-block" data-cta="button"><p><strong>Scale faster</strong></p><a class="gif-cta-btn" data-cta="true" href="https://getintofeed.com/contact" target="_blank">Book Audit</a></div>
<div class="gif-faq-block" data-faq="true"><div class="gif-faq-item"><h4>What is CRO?</h4><p>Conversion Rate Optimization.</p></div></div>
<div class="gif-toc-block" data-toc="true"><ul><li><a href="#intro">Intro Heading</a></li></ul></div>
<div class="gif-table-scroll"><table><thead><tr><th>Plan</th><th>Impact</th></tr></thead><tbody><tr><td>Growth</td><td>+40%</td></tr></tbody></table></div>
<figure class="gif-image-figure"><img src="/storage/media/sample.webp" alt="Sample visual" loading="lazy" onerror="alert(1)" /><figcaption>Caption text</figcaption></figure>
<figure class="gif-video-embed" data-video-embed="true"><iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Demo" loading="lazy"></iframe></figure>
<figure class="gif-video-embed" data-video-embed="true"><iframe src="https://evil.example/embed/phish"></iframe></figure>
<svg onload="alert(1)"><circle cx="10" cy="10" r="5"></circle></svg>
<a href="javascript:alert(1)">Bad JS link</a>
<a href="data:text/html,<script>alert(1)</script>">Bad Data link</a>
<style>body { display: none; }</style>
<div onmouseover="alert(2)">Hover trap</div>
<script>alert("xss")</script>
HTML;

        $cleaned = $sanitizer->sanitize($html);

        $this->assertStringContainsString('data-callout="true"', $cleaned);
        $this->assertStringContainsString('data-type="tip"', $cleaned);
        $this->assertStringContainsString('data-cta="button"', $cleaned);
        $this->assertStringContainsString('data-faq="true"', $cleaned);
        $this->assertStringContainsString('data-toc="true"', $cleaned);
        $this->assertStringContainsString('gif-table-scroll', $cleaned);
        $this->assertStringContainsString('<mark>key point</mark>', $cleaned);
        $this->assertStringContainsString('gif-align-center', $cleaned);
        $this->assertStringContainsString('<figcaption>Caption text</figcaption>', $cleaned);
        $this->assertStringContainsString('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', $cleaned);
        $this->assertStringNotContainsString('evil.example', $cleaned);
        $this->assertStringNotContainsString('<script', $cleaned);
        $this->assertStringNotContainsString('<svg', $cleaned);
        $this->assertStringNotContainsString('<style', $cleaned);
        $this->assertStringNotContainsString('onerror=', $cleaned);
        $this->assertStringNotContainsString('onmouseover=', $cleaned);
        $this->assertStringNotContainsString('onload=', $cleaned);
        $this->assertStringNotContainsString('javascript:', $cleaned);
        $this->assertStringNotContainsString('data:text/html', $cleaned);
        $this->assertStringContainsString('noopener', $cleaned);
    }

    public function test_mixed_markdown_and_html_classification_preserves_markdown_while_sanitizing_xss(): void
    {
        $sanitizer = app(HtmlSanitizerService::class);
        $admin = $this->makeUser('superadmin');

        $pureMarkdown = "## Revenue Operations\n\n- Pipeline attribution\n- **Conversion rate** audits";
        $mixedWithBreak = "## CRO Checklist\n\nLine one<br>Line two\n\n- Keep forms short";
        $mixedWithTable = "## Pricing Comparison\n\n<table><tr><th>Plan</th></tr><tr><td>Growth</td></tr></table>\n\n- Priority support";
        $mixedWithImg = "## Visual Guide\n\n<img src=\"/storage/chart.webp\" alt=\"Chart\" onerror=\"alert(1)\" />\n\n1. First step";
        $mixedWithIframe = "## Demo Walkthrough\n\n<iframe src=\"https://www.youtube-nocookie.com/embed/abc123\"></iframe>\n<iframe src=\"https://evil.example/payload\"></iframe>";

        $this->assertSame('markdown', $sanitizer->classifyContent($pureMarkdown));
        $this->assertSame('mixed', $sanitizer->classifyContent($mixedWithBreak));
        $this->assertSame('mixed', $sanitizer->classifyContent($mixedWithTable));
        $this->assertSame('mixed', $sanitizer->classifyContent($mixedWithImg));
        $this->assertSame('mixed', $sanitizer->classifyContent($mixedWithIframe));
        $this->assertSame('html', $sanitizer->classifyContent('<h2>Visual Post</h2><p>Paragraph text.</p>'));

        $sanitizedMixed = $sanitizer->sanitize($mixedWithImg."\n<script>alert(9)</script>");
        $this->assertStringContainsString('## Visual Guide', $sanitizedMixed);
        $this->assertStringContainsString('1. First step', $sanitizedMixed);
        $this->assertStringNotContainsString('onerror=', $sanitizedMixed);
        $this->assertStringNotContainsString('<script', $sanitizedMixed);

        $sanitizedIframe = $sanitizer->sanitize($mixedWithIframe);
        $this->assertStringContainsString('https://www.youtube-nocookie.com/embed/abc123', $sanitizedIframe);
        $this->assertStringNotContainsString('evil.example', $sanitizedIframe);

        $post = BlogPost::create([
            'title' => 'Mixed Markdown Post',
            'slug' => 'mixed-markdown-post',
            'content' => $mixedWithTable,
            'editor_mode' => 'classic',
            'status' => 'published',
            'author_id' => $admin->id,
        ]);

        $this->actingAs($admin);
        Livewire::test(EditBlogPost::class, ['record' => $post->getRouteKey()])
            ->fillForm(['title' => 'Mixed Markdown Post Revised'])
            ->call('save')
            ->assertHasNoFormErrors();

        $fresh = $post->fresh();
        $this->assertSame($mixedWithTable, $fresh->content);
        $this->assertSame($mixedWithTable, $fresh->content_html);
    }

    public function test_public_blog_api_and_spa_css_support_tiptap_and_converted_markdown_blocks(): void
    {
        $admin = $this->makeUser('superadmin');

        $tiptapHtml = <<<'HTML'
<h2 id="section-1">Growth Architecture</h2>
<div class="gif-toc-block" data-toc="true"><ul><li class="gif-toc-html-h2"><a href="#section-1">Growth Architecture</a></li></ul></div>
<div class="gif-callout gif-callout-tip" data-callout="true" data-type="tip"><p>Optimize Core Web Vitals first.</p></div>
<div class="gif-table-scroll"><table><thead><tr><th>Metric</th><th>Target</th></tr></thead><tbody><tr><td>CVR</td><td>4.5%</td></tr></tbody></table></div>
<figure class="gif-image-figure"><img src="/storage/hero.webp" alt="Growth Funnel Diagram" loading="lazy" /><figcaption>Funnel flow diagram</figcaption></figure>
<figure class="gif-video-embed" data-video-embed="true"><iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Walkthrough" loading="lazy"></iframe></figure>
<div class="gif-faq-block" data-faq="true"><div class="gif-faq-item"><h4>How long to rank?</h4><p>8 to 12 weeks typically.</p></div></div>
<div class="gif-cta-block" data-cta="button"><p><strong>Need a custom audit?</strong></p><a class="gif-cta-btn" data-cta="true" href="https://getintofeed.com/contact">Book Audit</a></div>
HTML;

        $post = BlogPost::create([
            'title' => 'TipTap Public Rendering Verification',
            'slug' => 'tiptap-public-rendering-verification',
            'content' => $tiptapHtml,
            'editor_mode' => 'visual',
            'status' => 'published',
            'visibility' => 'public',
            'published_at' => now(),
            'author_id' => $admin->id,
        ]);

        $response = $this->getJson('/api/blog/'.$post->slug)->assertOk();
        $payloadContent = (string) $response->json('post.content');
        $payloadContentHtml = (string) $response->json('post.content_html');

        $this->assertSame($payloadContent, $payloadContentHtml);
        foreach (['gif-toc-block', 'data-callout="true"', 'gif-table-scroll', 'gif-image-figure', 'data-video-embed="true"', 'data-faq="true"', 'gif-cta-block'] as $marker) {
            $this->assertStringContainsString($marker, $payloadContent);
        }

        // Verify public SPA stylesheet (frontend + mirrored src) defines all custom TipTap block classes
        $frontendCss = file_get_contents(base_path('../frontend/src/styles.css'));
        $mirroredCss = file_get_contents(base_path('../src/styles.css'));
        $this->assertSame($frontendCss, $mirroredCss);
        foreach (['.gif-callout', '.gif-cta-block', '.gif-cta-btn', '.gif-faq-block', '.gif-toc-block', '.gif-table-scroll', '.gif-image-figure', '.gif-video-embed'] as $cssSelector) {
            $this->assertStringContainsString($cssSelector, $frontendCss);
        }
    }

    public function test_large_5000_word_and_20_image_article_processes_cleanly_within_budget(): void
    {
        $admin = $this->makeUser('superadmin');
        $post = BlogPost::create([
            'title' => 'Long-form Performance Pillar Guide',
            'slug' => 'long-form-performance-pillar',
            'content' => '<p>Initial stub</p>',
            'status' => 'draft',
            'author_id' => $admin->id,
        ]);

        $paragraph = '<p>Strategic performance marketing integrates attribution discipline, creative testing velocity, landing page clarity, technical search engine optimization, conversion rate experimentation, and customer retention loops across enterprise funnels in competitive digital markets. </p>';
        $body = '<h2>Performance Section</h2>';
        for ($i = 1; $i <= 185; $i++) {
            $body .= $paragraph;
            if ($i % 9 === 0) {
                $idx = (int) ($i / 9);
                $body .= "<figure class=\"gif-image-figure\"><img src=\"/storage/media/perf-{$idx}.webp\" alt=\"Performance chart {$idx}\" loading=\"lazy\" /><figcaption>Chart {$idx}</figcaption></figure>";
            }
        }

        $service = app(BlogPostService::class);
        $readability = app(ReadabilityService::class);

        $start = microtime(true);
        $updated = $service->update($post, [
            'content_html' => $body,
            'focus_keyphrase' => 'performance marketing',
        ], $admin, 1);
        $analysis = $readability->analyze((string) $updated->content_html);
        $elapsed = microtime(true) - $start;

        $this->assertGreaterThanOrEqual(5000, $updated->word_count);
        $this->assertSame(20, substr_count((string) $updated->content_html, '<img '));
        $this->assertSame(0, $analysis['missing_alt_images']);
        $this->assertLessThan(5.0, $elapsed);
    }

    public function test_signed_preview_defaults_to_24_hours_and_rejects_expired_or_tampered_links(): void
    {
        $admin = $this->makeUser('superadmin');
        $post = BlogPost::create([
            'title' => 'Draft Shareable Article',
            'slug' => 'draft-shareable-article',
            'excerpt' => 'Private preview summary.',
            'content' => '<h2 id="overview">Overview</h2><p>Secret draft content before publish.</p>',
            'status' => 'draft',
            'visibility' => 'unlisted',
            'author_id' => $admin->id,
        ]);

        $this->assertSame(1440, (int) config('cms.blog.preview_ttl_minutes'));

        $this->actingAs($admin);
        $linkResponse = $this->postJson(route('admin.api.posts.preview-link', ['post' => $post->id]))
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('expires_in_minutes', 1440);

        $previewUrl = $linkResponse->json('preview_url');
        $this->assertNotEmpty($previewUrl);

        $htmlRes = $this->get($previewUrl);
        $htmlRes->assertOk();
        $htmlRes->assertHeader('X-Robots-Tag', 'noindex, nofollow');
        $htmlRes->assertSee('Draft Shareable Article');
        $htmlRes->assertSee('Secret draft content before publish.');

        $this->getJson($previewUrl)
            ->assertOk()
            ->assertJsonPath('preview', true)
            ->assertJsonPath('data.slug', 'draft-shareable-article');

        // Tampered signature must return 403
        $tamperedUrl = preg_replace('/signature=[a-f0-9]+/i', 'signature='.str_repeat('0', 64), $previewUrl);
        $this->get($tamperedUrl)->assertStatus(403);

        // Expired signature must return 403
        $expiredUrl = URL::temporarySignedRoute('admin.posts.signed-preview', now()->subMinute(), ['uuid' => $post->uuid]);
        $this->get($expiredUrl)->assertStatus(403);
    }

    public function test_autosave_enforces_auth_policy_csrf_and_rate_limiting(): void
    {
        $authorOne = $this->makeUser('author');
        $authorTwo = $this->makeUser('author');
        $post = BlogPost::create([
            'title' => 'Author One Post',
            'slug' => 'author-one-post',
            'content' => '<p>Owned draft</p>',
            'status' => 'draft',
            'author_id' => $authorOne->id,
        ]);

        $autosaveUrl = route('admin.api.posts.autosave', ['post' => $post->id]);

        // 1. Unauthenticated rejected with 401
        $this->postJson($autosaveUrl, ['title' => 'Hacked'])->assertStatus(401);

        // 2. Different author rejected by BlogPostPolicy::update with 403
        $this->actingAs($authorTwo)
            ->postJson($autosaveUrl, ['title' => 'Unauthorized Edit'])
            ->assertStatus(403);

        // 3. CSRF protection active via web middleware group with zero exclusions + throttle + auth
        $route = Route::getRoutes()->getByName('admin.api.posts.autosave');
        $this->assertNotNull($route);
        $middleware = $route->gatherMiddleware();
        $this->assertTrue(in_array('web', $middleware, true));
        $this->assertTrue(in_array('auth', $middleware, true));
        $this->assertTrue(in_array('throttle:120,1', $middleware, true));

        $csrfMiddleware = app(VerifyCsrfToken::class);
        $this->assertSame([], $csrfMiddleware->getExcludedPaths());
    }

    public function test_mcp_endpoint_rejects_requests_when_mcp_api_key_is_unconfigured(): void
    {
        config(['cms.mcp_api_key' => '', 'services.mcp.key' => '']);

        $derivedAppKeyDigest = hash('sha256', (string) config('app.key'));

        $this->withHeaders(['Authorization' => 'Bearer '.$derivedAppKeyDigest])
            ->postJson('/api/v1/mcp/tools/create_growth_lead', ['email' => 'probe@example.com'])
            ->assertStatus(401);

        $rpcResponse = $this->withHeaders(['Authorization' => 'Bearer '.$derivedAppKeyDigest])
            ->postJson('/api/v1/mcp', [
                'jsonrpc' => '2.0',
                'id' => 1,
                'method' => 'tools/call',
                'params' => [
                    'name' => 'create_growth_lead',
                    'arguments' => ['email' => 'probe@example.com'],
                ],
            ]);
        $this->assertNotNull($rpcResponse->json('error'));
    }

    public function test_filament_editor_renders_tiptap_ui_seo_panel_aria_and_optimistic_lock(): void
    {
        $this->assertFileExists(public_path('build/editor/tiptap-studio.js'));
        $this->assertFileExists(public_path('build/editor/tiptap-studio.css'));

        $admin = $this->makeUser('superadmin');
        $this->actingAs($admin);

        Livewire::test(CreateBlogPost::class)
            ->assertOk()
            ->assertSee('tiptap-studio.js', false)
            ->assertSee('gif-mobile-tabs-bar', false)
            ->assertSee('role="tablist"', false)
            ->assertSee('role="tab"', false)
            ->assertSee('aria-modal="true"', false)
            ->assertSee('Primary Focus Keyphrase')
            ->assertSee('Google SERP')
            ->assertSee('Social Cards')
            ->assertSee('Internal Link')
            ->assertSee('Mobile 375px')
            ->assertSee('Tablet 768px');

        $post = BlogPost::create([
            'title' => 'TipTap Interactive Post',
            'slug' => 'tiptap-interactive-post',
            'content' => '<h2>Section One</h2><p>Initial body paragraph.</p>',
            'editor_mode' => 'visual',
            'status' => 'draft',
            'visibility' => 'public',
            'version' => 1,
            'author_id' => $admin->id,
        ]);

        Livewire::test(EditBlogPost::class, ['record' => $post->getRouteKey()])
            ->assertOk()
            ->assertSee('Revision History', false)
            ->fillForm([
                'title' => 'TipTap Interactive Post V2',
                'content' => '<h2>Section One</h2><p>Updated body paragraph with <strong>bold</strong>.</p>',
                'visibility' => 'unlisted',
                'seo_title' => 'TipTap Interactive Post Guide',
                'version' => 1,
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $fresh = $post->fresh();
        $this->assertSame(2, (int) $fresh->version);
        $this->assertSame('unlisted', $fresh->visibility);
        $this->assertSame('TipTap Interactive Post Guide', $fresh->seo_title);
        $this->assertSame('TipTap Interactive Post Guide', $fresh->meta_title);
        $this->assertGreaterThanOrEqual(1, PostRevision::where('blog_post_id', $post->id)->count());

        Livewire::test(EditBlogPost::class, ['record' => $post->getRouteKey()])
            ->set('data.version', 1)
            ->set('data.title', 'Stale Overwrite Attempt')
            ->call('save')
            ->assertNotified('Save Conflict Detected');

        $this->assertSame('TipTap Interactive Post V2', $post->fresh()->title);
    }
}
