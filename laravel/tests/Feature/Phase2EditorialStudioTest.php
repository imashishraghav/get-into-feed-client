<?php

namespace Tests\Feature;

use App\Filament\Resources\BlogPostResource\Pages\CreateBlogPost;
use App\Filament\Resources\BlogPostResource\Pages\EditBlogPost;
use App\Models\BlogPost;
use App\Models\PostRevision;
use App\Models\User;
use App\Services\HtmlSanitizerService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class Phase2EditorialStudioTest extends TestCase
{
    use RefreshDatabase;

    protected function makeAdmin(): User
    {
        return User::create([
            'name' => 'Editorial Admin',
            'email' => 'admin-'.uniqid().'@getintofeed.com',
            'password' => bcrypt('StrongSecretPass123!'),
            'role' => 'superadmin',
            'is_active' => true,
        ]);
    }

    public function test_html_sanitizer_preserves_tiptap_blocks_and_strips_xss(): void
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
<figure class="gif-image-figure"><img src="/storage/media/sample.webp" alt="Sample visual" loading="lazy" onclick="alert(1)" /><figcaption>Caption text</figcaption></figure>
<figure class="gif-video-embed" data-video-embed="true"><iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Demo" loading="lazy"></iframe></figure>
<figure class="gif-video-embed" data-video-embed="true"><iframe src="https://evil.example/embed/phish"></iframe></figure>
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
        $this->assertStringNotContainsString('<script>', $cleaned);
        $this->assertStringNotContainsString('onclick=', $cleaned);
        $this->assertStringContainsString('noopener', $cleaned);
    }

    public function test_markdown_posts_remain_unmodified_through_sanitizer_and_filament_save(): void
    {
        $admin = $this->makeAdmin();
        $markdown = "## Why Revenue Marketing Beats Vanity Metrics\n\n- Pipeline attribution\n- CAC payback discipline\n\n**Bottom line:** focus on SQL velocity.";

        $post = BlogPost::create([
            'title' => 'Markdown Legacy Post',
            'slug' => 'markdown-legacy-post',
            'content' => $markdown,
            'editor_mode' => 'classic',
            'status' => 'published',
            'author_id' => $admin->id,
        ]);

        $this->actingAs($admin);

        Livewire::test(EditBlogPost::class, ['record' => $post->getRouteKey()])
            ->fillForm([
                'title' => 'Markdown Legacy Post Updated',
                'content' => $markdown,
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $fresh = $post->fresh();
        $this->assertSame($markdown, $fresh->content);
        $this->assertSame($markdown, $fresh->content_html);
        $this->assertSame('Markdown Legacy Post Updated', $fresh->title);
    }

    public function test_signed_preview_renders_responsive_html_for_browser_and_json_for_api(): void
    {
        $admin = $this->makeAdmin();
        $post = BlogPost::create([
            'title' => 'Draft Shareable Article',
            'slug' => 'draft-shareable-article',
            'excerpt' => 'Private preview summary.',
            'content' => '<h2 id="overview">Overview</h2><p>Secret draft content before publish.</p>',
            'status' => 'draft',
            'visibility' => 'unlisted',
            'author_id' => $admin->id,
        ]);

        $this->actingAs($admin);

        $linkResponse = $this->postJson(route('admin.api.posts.preview-link', ['post' => $post->id]))
            ->assertOk()
            ->assertJsonPath('success', true);

        $previewUrl = $linkResponse->json('preview_url');
        $this->assertNotEmpty($previewUrl);

        // Browser request renders HTML view with X-Robots-Tag noindex
        $htmlRes = $this->get($previewUrl);
        $htmlRes->assertOk();
        $htmlRes->assertHeader('X-Robots-Tag', 'noindex, nofollow');
        $htmlRes->assertSee('Draft Shareable Article');
        $htmlRes->assertSee('Secret draft content before publish.');

        // JSON API request continues returning BlogPostResource payload
        $this->getJson($previewUrl)
            ->assertOk()
            ->assertJsonPath('preview', true)
            ->assertJsonPath('data.slug', 'draft-shareable-article');
    }

    public function test_filament_editor_renders_tiptap_ui_and_enforces_optimistic_lock(): void
    {
        $this->assertFileExists(public_path('build/editor/tiptap-studio.js'));
        $this->assertFileExists(public_path('build/editor/tiptap-studio.css'));

        $admin = $this->makeAdmin();
        $this->actingAs($admin);

        Livewire::test(CreateBlogPost::class)
            ->assertOk()
            ->assertSee('tiptap-studio.js', false)
            ->assertSee('gif-mobile-tabs-bar', false)
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

        // Stale version attempt (sending version=1 when DB is at version=2) must be halted
        Livewire::test(EditBlogPost::class, ['record' => $post->getRouteKey()])
            ->set('data.version', 1)
            ->set('data.title', 'Stale Overwrite Attempt')
            ->call('save')
            ->assertNotified('Save Conflict Detected');

        $this->assertSame('TipTap Interactive Post V2', $post->fresh()->title);
    }
}
