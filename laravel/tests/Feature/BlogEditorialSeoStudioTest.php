<?php

namespace Tests\Feature;

use App\Filament\Resources\BlogPostResource;
use App\Filament\Resources\BlogPostResource\Pages\CreateBlogPost;
use App\Filament\Resources\BlogPostResource\Pages\EditBlogPost;
use App\Models\BlogPost;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class BlogEditorialSeoStudioTest extends TestCase
{
    use RefreshDatabase;

    protected function makeAdminUser(string $role = 'superadmin'): User
    {
        return User::create([
            'name' => 'Editor Admin',
            'email' => 'editor-'.uniqid().'@getintofeed.com',
            'password' => bcrypt('SecretPass123!'),
            'role' => $role,
            'is_active' => true,
        ]);
    }

    public function test_blog_posts_table_has_all_seo_studio_columns(): void
    {
        $expectedColumns = [
            'featured_image_alt',
            'focus_keyphrase',
            'secondary_keyphrases',
            'seo_title',
            'meta_description',
            'canonical_url',
            'schema_type',
            'robots_index',
            'robots_follow',
            'faq_items',
            'og_title',
            'og_description',
            'seo_score',
            'word_count',
            'reading_time',
        ];

        foreach ($expectedColumns as $column) {
            $this->assertTrue(
                Schema::hasColumn('blog_posts', $column),
                "Expected blog_posts table to have column [{$column}]."
            );
        }
    }

    public function test_editor_image_upload_validates_converts_to_webp_and_resizes(): void
    {
        Storage::fake('public');
        $admin = $this->makeAdminUser('superadmin');

        // Unauthenticated should be blocked
        $this->postJson('/admin/editor/upload-image')->assertStatus(401);

        // Viewer role should receive 403
        $viewer = $this->makeAdminUser('viewer');
        $this->actingAs($viewer)
            ->postJson('/admin/editor/upload-image', [
                'image' => UploadedFile::fake()->image('hero.png', 800, 400),
            ])
            ->assertStatus(403);

        // Oversized (>5120 KB) should fail validation
        $this->actingAs($admin)
            ->postJson('/admin/editor/upload-image', [
                'image' => UploadedFile::fake()->create('huge.png', 6000, 'image/png'),
            ])
            ->assertStatus(422);

        // Valid 1800x900 PNG should resize to 1400x700 and convert to WebP
        $response = $this->actingAs($admin)
            ->postJson('/admin/editor/upload-image', [
                'image' => UploadedFile::fake()->image('performance-chart.png', 1800, 900),
                'alt' => 'Performance marketing chart',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'width' => 1400,
                'height' => 700,
                'alt' => 'Performance marketing chart',
            ])
            ->assertJsonStructure(['url', 'width', 'height', 'size', 'media_id']);

        $media = Media::find($response->json('media_id'));
        $this->assertNotNull($media);
        $this->assertSame('image/webp', $media->mime_type);
        $this->assertStringStartsWith('blog/content/'.date('Y').'/'.date('m').'/', $media->file_path);
        $this->assertStringEndsWith('.webp', $media->file_path);
        Storage::disk('public')->assertExists($media->file_path);
    }

    public function test_internal_links_endpoint_returns_matching_published_posts_only(): void
    {
        $admin = $this->makeAdminUser('superadmin');

        $publishedMatch = BlogPost::create([
            'title' => 'Meta Advantage Plus Scaling Guide',
            'slug' => 'meta-advantage-plus-scaling-guide',
            'focus_keyphrase' => 'meta advantage plus',
            'category' => 'Paid Performance',
            'status' => 'published',
            'published_at' => now(),
        ]);

        BlogPost::create([
            'title' => 'Meta Advantage Plus Draft',
            'slug' => 'meta-advantage-plus-draft',
            'status' => 'draft',
        ]);

        $otherPublished = BlogPost::create([
            'title' => 'B2B SEO Architecture',
            'slug' => 'b2b-seo-architecture',
            'category' => 'SEO & AI Search',
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/admin/editor/internal-links?q=Advantage&exclude_id='.$otherPublished->id);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $posts = $response->json('posts');
        $this->assertCount(1, $posts);
        $this->assertSame($publishedMatch->id, $posts[0]['id']);
        $this->assertSame('https://getintofeed.com/blog/meta-advantage-plus-scaling-guide', $posts[0]['url']);
    }

    public function test_frontend_blog_route_injects_seo_meta_and_graph_json_ld_without_duplicates(): void
    {
        $post = BlogPost::create([
            'title' => 'Technical SEO Checklist for 2027',
            'slug' => 'technical-seo-checklist-2027',
            'excerpt' => 'A practical checklist to improve crawlability and rankings.',
            'featured_image_alt' => 'Technical SEO audit dashboard',
            'focus_keyphrase' => 'technical seo checklist',
            'secondary_keyphrases' => ['crawl budget', 'core web vitals'],
            'seo_title' => 'Technical SEO Checklist 2027 | GetIntoFeed',
            'meta_description' => 'Follow this technical SEO checklist to boost crawl efficiency, indexation, and Core Web Vitals rankings.',
            'canonical_url' => 'https://getintofeed.com/blog/technical-seo-checklist-2027',
            'schema_type' => 'HowTo',
            'robots_index' => false,
            'robots_follow' => true,
            'faq_items' => [
                ['q' => 'What is technical SEO?', 'a' => 'Technical SEO optimizes crawling, indexing, and site speed.'],
                ['q' => 'How often should you run an audit?', 'a' => 'Run a comprehensive technical audit every quarter.'],
            ],
            'og_title' => 'Technical SEO Checklist — Social Card',
            'og_description' => 'Boost Core Web Vitals and indexation with our 2027 guide.',
            'seo_score' => 94,
            'word_count' => 1150,
            'reading_time' => 6,
            'content' => '<h2>Introduction</h2><p>Follow this technical seo checklist.</p>',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->get('/blog/'.$post->slug);
        $response->assertStatus(200);

        $html = $response->getContent();

        $this->assertSame(1, preg_match_all('/<title>.*?<\/title>/is', $html));
        $this->assertStringContainsString('<title>Technical SEO Checklist 2027 | GetIntoFeed</title>', $html);

        $this->assertSame(1, preg_match_all('/<meta\s+[^>]*name=["\']description["\'][^>]*>/i', $html));
        $this->assertSame(1, preg_match_all('/<link\s+[^>]*rel=["\']canonical["\'][^>]*>/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\s+[^>]*name=["\']robots["\'][^>]*>/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\s+[^>]*property=["\']og:title["\'][^>]*>/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\s+[^>]*property=["\']og:description["\'][^>]*>/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\s+[^>]*property=["\']og:image["\'][^>]*>/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\s+[^>]*name=["\']twitter:card["\'][^>]*>/i', $html));
        $this->assertSame(1, preg_match_all('/<script\s+[^>]*type=["\']application\/ld\+json["\'][^>]*>/i', $html));

        $this->assertStringContainsString('content="noindex, follow, max-image-preview:large"', $html);
        $this->assertStringContainsString('property="og:type" content="article"', $html);
        $this->assertStringContainsString('property="og:image:alt" content="Technical SEO audit dashboard"', $html);

        preg_match('/<script\s+[^>]*type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/is', $html, $matches);
        $this->assertNotEmpty($matches[1] ?? '');

        $jsonLd = json_decode(trim($matches[1]), true);
        $this->assertIsArray($jsonLd);
        $this->assertArrayHasKey('@graph', $jsonLd);

        $types = array_column($jsonLd['@graph'], '@type');
        $this->assertContains('HowTo', $types);
        $this->assertContains('BreadcrumbList', $types);
        $this->assertContains('FAQPage', $types);
    }

    public function test_legacy_post_without_seo_columns_renders_clean_fallbacks_and_unknown_slug_404s(): void
    {
        BlogPost::create([
            'title' => 'Legacy Growth Article',
            'slug' => 'legacy-growth-article',
            'content' => '<p>This is a legacy post with no SEO columns populated.</p>',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $ok = $this->get('/blog/legacy-growth-article');
        $ok->assertStatus(200);
        $this->assertStringContainsString('Legacy Growth Article — Feed Notes | GetIntoFeed', $ok->getContent());
        $this->assertStringContainsString('index, follow, max-image-preview:large', $ok->getContent());

        $missing = $this->get('/blog/does-not-exist-anywhere');
        $missing->assertStatus(404);
    }

    public function test_filament_blog_post_resource_pages_render_without_blade_or_php_errors(): void
    {
        $admin = $this->makeAdminUser('superadmin');
        $post = BlogPost::create([
            'title' => 'Filament Studio Smoke Test',
            'slug' => 'filament-studio-smoke-test',
            'content' => '<h2>Section One</h2><p>Sample editorial content.</p>',
            'status' => 'draft',
        ]);

        $this->actingAs($admin)
            ->get(BlogPostResource::getUrl('index'))
            ->assertStatus(200)
            ->assertSee('Filament Studio Smoke Test');

        $this->actingAs($admin)
            ->get(BlogPostResource::getUrl('create'))
            ->assertStatus(200)
            ->assertSee('GetIntoFeed SEO Studio PRO')
            ->assertSee('Article Outline (TOC)');

        $this->actingAs($admin)
            ->get(BlogPostResource::getUrl('edit', ['record' => $post]))
            ->assertStatus(200)
            ->assertSee('GetIntoFeed SEO Studio PRO')
            ->assertSee('Filament Studio Smoke Test');
    }

    public function test_livewire_create_and_edit_syncs_seo_studio_columns_and_polymorphic_seo_metadata(): void
    {
        $admin = $this->makeAdminUser('superadmin');
        $this->actingAs($admin);

        Livewire::test(CreateBlogPost::class)
            ->fillForm([
                'title' => 'How to Scale B2B SaaS Organic Traffic',
                'slug' => 'scale-b2b-saas-organic-traffic',
                'content' => '<h2>Core Strategy</h2><p>Learn how to scale b2b saas organic traffic efficiently with programmatic hubs.</p>',
                'excerpt' => 'A practical B2B SaaS SEO playbook.',
                'category' => 'SEO & AI Search',
                'status' => 'published',
                'focus_keyphrase' => 'b2b saas organic traffic',
                'secondary_keyphrases' => ['programmatic seo', 'topic clusters'],
                'seo_title' => 'Scale B2B SaaS Organic Traffic | GetIntoFeed',
                'meta_description' => 'Discover proven frameworks to scale B2B SaaS organic traffic using topic clusters and technical SEO.',
                'canonical_url' => 'https://getintofeed.com/blog/scale-b2b-saas-organic-traffic',
                'schema_type' => 'BlogPosting',
                'robots_index' => true,
                'robots_follow' => true,
                'faq_items' => [
                    ['q' => 'How long does SaaS SEO take?', 'a' => 'Expect compounding organic pipeline traction within 90 to 120 days.'],
                ],
                'og_title' => 'B2B SaaS Organic Traffic Playbook',
                'og_description' => 'Step-by-step organic growth guide for SaaS founders.',
                'seo_score' => 91,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $created = BlogPost::where('slug', 'scale-b2b-saas-organic-traffic')->first();
        $this->assertNotNull($created);
        $this->assertSame('b2b saas organic traffic', $created->focus_keyphrase);
        $this->assertSame(['programmatic seo', 'topic clusters'], $created->secondary_keyphrases);
        $this->assertSame(91, $created->seo_score);
        $this->assertGreaterThan(0, $created->word_count);
        $this->assertGreaterThan(0, $created->reading_time);
        $this->assertNotNull($created->seo);
        $this->assertSame('Scale B2B SaaS Organic Traffic | GetIntoFeed', $created->seo->seo_title);

        // Verify JSON API exposes upgraded SEO & FAQ fields cleanly
        $this->getJson('/api/v1/blog/scale-b2b-saas-organic-traffic')
            ->assertStatus(200)
            ->assertJsonPath('post.seo.seo_score', 91)
            ->assertJsonPath('post.seo.schema_type', 'BlogPosting')
            ->assertJsonPath('post.faq_items.0.q', 'How long does SaaS SEO take?');

        // Verify EditBlogPost hydrates legacy post from SeoMetadata when blog_posts columns are null
        $legacy = BlogPost::create([
            'title' => 'Legacy Post Hydration',
            'slug' => 'legacy-post-hydration',
            'content' => '<h2>Legacy</h2><p>Legacy content body.</p>',
            'status' => 'draft',
        ]);
        $legacy->seo()->create([
            'seo_title' => 'Legacy SEO Title | GetIntoFeed',
            'meta_description' => 'Legacy meta description preserved cleanly.',
            'focus_keyword' => 'legacy keyword',
            'target_keywords' => ['legacy lsi'],
            'robots_index' => true,
            'robots_follow' => false,
            'schema_type' => 'NewsArticle',
        ]);

        Livewire::test(EditBlogPost::class, ['record' => $legacy->getRouteKey()])
            ->assertFormSet([
                'seo_title' => 'Legacy SEO Title | GetIntoFeed',
                'focus_keyphrase' => 'legacy keyword',
                'secondary_keyphrases' => ['legacy lsi'],
                'schema_type' => 'NewsArticle',
                'robots_follow' => false,
            ]);
    }
}
