<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Redirect;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SeoDeliveryService
{
    protected const DEFAULT_TITLE = 'GetIntoFeed | Creative Marketing & Performance Growth Agency';

    protected const DEFAULT_DESC = 'Premier creative performance marketing studio in India. We engineer thumb-stopping reels, high-converting funnels, and paid media for ambitious brands.';

    protected const DEFAULT_IMAGE = 'https://getintofeed.com/agency-hero.jpg';

    protected const SITE_NAME = 'GetIntoFeed';

    protected const TWITTER_HANDLE = '@getintofeed';

    /**
     * Resolve and render server-side SEO metadata injected into React SPA.
     */
    public function render(Request $request): Response|RedirectResponse
    {
        $path = '/'.trim($request->path(), '/');
        if ($path === '//') {
            $path = '/';
        }

        // 1. Check redirects
        $redirectResponse = $this->checkRedirects($path, $request);
        if ($redirectResponse) {
            return $redirectResponse;
        }

        // 2. Resolve metadata for the requested URL
        $seoData = $this->resolveMetadata($path, $request);

        // 3. Load React SPA HTML template
        $template = $this->loadTemplateHtml();

        // 4. Inject metadata into HTML
        $renderedHtml = $this->injectMetadata($template, $seoData);

        // 5. Return HTTP response with true status code
        $statusCode = $seoData['status_code'] ?? 200;

        return response($renderedHtml, $statusCode)
            ->header('Content-Type', 'text/html; charset=UTF-8')
            ->header('X-Robots-Tag', $seoData['robots'] ?? 'index, follow')
            ->header('Cache-Control', $statusCode === 200 ? 'public, max-age=300, stale-while-revalidate=600' : 'no-cache, no-store, must-revalidate');
    }

    /**
     * Check redirects table and permanent legacy aliases.
     */
    protected function checkRedirects(string $path, Request $request): ?RedirectResponse
    {
        $rawPath = trim($path, '/');

        // Static permanent aliases
        $staticAliases = [
            'work' => '/case-studies',
            'feed-notes' => '/blog',
            'privacy-policy' => '/privacy',
            'terms-and-conditions' => '/terms',
            'terms-of-service' => '/terms',
            'how-metas-advantage-plus-changes-ecommerce' => '/blog/meta-advantage-plus-ecommerce-scaling',
            'how-metas-advantage-plus-algorithm-changes-ecommerce-scaling-in-2026' => '/blog/meta-advantage-plus-ecommerce-scaling',
            'advantage-plus' => '/blog/meta-advantage-plus-ecommerce-scaling',
            '7-ways-to-increase-form-field-conversion-rate' => '/blog/increase-form-conversions-and-generate-more-leads',
            'blog/7-ways-to-increase-form-field-conversion-rate' => '/blog/increase-form-conversions-and-generate-more-leads',
            'how-to-increase-form-conversions-generate-more-leads-in-2027' => '/blog/increase-form-conversions-and-generate-more-leads',
            'blog/how-to-increase-form-conversions-generate-more-leads-in-2027' => '/blog/increase-form-conversions-and-generate-more-leads',
            'how-to-increase-form-conversions-generate-more-leads' => '/blog/increase-form-conversions-and-generate-more-leads',
            'blog/how-to-increase-form-conversions-generate-more-leads' => '/blog/increase-form-conversions-and-generate-more-leads',
            'ways-to-increase-form-field-conversion-rate' => '/blog/increase-form-conversions-and-generate-more-leads',
            'form-field-conversion-rate' => '/blog/increase-form-conversions-and-generate-more-leads',
            'how-to-increase-form-conversions' => '/blog/increase-form-conversions-and-generate-more-leads',
            'services/performance-marketing-delhi-ncr' => '/services/google-ads-services-delhi-ncr',
            'services/performance-marketing' => '/services/google-ads-services-delhi-ncr',
            'services/ads-campaign' => '/services/google-ads-services-delhi-ncr',
            'services/google-ads' => '/services/google-ads-services-delhi-ncr',
            'services/meta-ads' => '/services/meta-ads-services-delhi-ncr',
            'services/seo' => '/services/seo-services-delhi-ncr',
            'services/social-media' => '/services/social-media-marketing-delhi-ncr',
            'services/web-development' => '/services/website-design-delhi-ncr',
            'services/web-development-delhi-ncr' => '/services/website-design-delhi-ncr',
            'services/website-design' => '/services/website-design-delhi-ncr',
            'services/short-form-video-reels-delhi-ncr' => '/services/reels-video-editing-delhi-ncr',
            'services/reels' => '/services/reels-video-editing-delhi-ncr',
            'services/videos' => '/services/reels-video-editing-delhi-ncr',
            'services/content-marketing' => '/services/content-creative-services-delhi-ncr',
            'services/brand-strategy-delhi-ncr' => '/services/content-creative-services-delhi-ncr',
            'services/influencer-marketing-delhi-ncr' => '/services/social-media-marketing-delhi-ncr',
            'services/analytics-reporting-delhi-ncr' => '/services/google-ads-services-delhi-ncr',
            'services/graphics-design' => '/services/graphic-design-services-delhi-ncr',
            'services/graphic-design' => '/services/graphic-design-services-delhi-ncr',
        ];

        if (isset($staticAliases[$rawPath])) {
            return redirect($staticAliases[$rawPath], 301);
        }

        if (str_starts_with($rawPath, 'work/')) {
            return redirect('/case-studies/'.substr($rawPath, 5), 301);
        }

        if (str_starts_with($rawPath, 'feed-notes/')) {
            return redirect('/blog/'.substr($rawPath, 11), 301);
        }

        // Database redirects
        try {
            $dbRedirect = Redirect::where('is_active', true)
                ->where(function ($q) use ($path, $rawPath) {
                    $q->where('source_url', $path)
                        ->orWhere('source_url', '/'.$rawPath)
                        ->orWhere('source_url', $rawPath);
                })
                ->first();

            if ($dbRedirect) {
                $dbRedirect->increment('hits');
                $target = $dbRedirect->target_url;
                $code = $dbRedirect->status_code ?: 301;

                return redirect($target, $code);
            }
        } catch (\Throwable $e) {
            Log::warning('[SeoDeliveryService] Redirect check skipped: '.$e->getMessage());
        }

        return null;
    }

    /**
     * Resolve metadata for the current path.
     */
    protected function resolveMetadata(string $path, Request $request): array
    {
        $rawPath = trim($path, '/');
        $segments = explode('/', $rawPath);
        $firstSegment = $segments[0] ?? '';

        // Case 1: Homepage
        if ($rawPath === '' || $path === '/') {
            return $this->resolveHomepageMetadata();
        }

        // Case 2: Services
        if ($firstSegment === 'services' || $firstSegment === 'service') {
            $slug = $segments[1] ?? '';
            if (empty($slug)) {
                return $this->resolveServicesHubMetadata();
            }

            return $this->resolveServiceDetailMetadata($slug);
        }

        // Case 3: Blog Posts
        if ($firstSegment === 'blog') {
            $slug = $segments[1] ?? '';
            if (empty($slug)) {
                return $this->resolveBlogHubMetadata();
            }

            return $this->resolveBlogDetailMetadata($slug);
        }

        // Case 4: Case Studies
        if ($firstSegment === 'case-studies') {
            $slug = $segments[1] ?? '';
            if (empty($slug)) {
                return $this->resolveCaseStudiesHubMetadata();
            }

            return $this->resolveCaseStudyDetailMetadata($slug);
        }

        // Case 5: Dynamic CMS Pages & Static Routes
        return $this->resolvePageMetadata($rawPath);
    }

    /**
     * Homepage metadata.
     */
    protected function resolveHomepageMetadata(): array
    {
        $siteTitle = Setting::get('site_title', self::DEFAULT_TITLE);
        $siteDesc = Setting::get('site_description', self::DEFAULT_DESC);
        $canonical = 'https://getintofeed.com/';

        return [
            'status_code' => 200,
            'title' => $siteTitle,
            'description' => $siteDesc,
            'canonical' => $canonical,
            'robots' => 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'og_type' => 'website',
            'og_title' => $siteTitle,
            'og_description' => $siteDesc,
            'og_image' => self::DEFAULT_IMAGE,
            'og_url' => $canonical,
            'twitter_title' => $siteTitle,
            'twitter_description' => $siteDesc,
            'twitter_image' => self::DEFAULT_IMAGE,
            'json_ld' => $this->buildHomepageJsonLd(),
            'fallback_html' => $this->buildHomepageFallbackHtml(),
        ];
    }

    /**
     * Services Hub metadata.
     */
    protected function resolveServicesHubMetadata(): array
    {
        $title = 'Our Services — Performance Marketing, SEO & Creative Media | GetIntoFeed';
        $desc = 'Explore GetIntoFeed services: Algorithmic Paid Ads, Enterprise SEO, High-Converting Web Architecture, Video Reels Production, and Influencer Marketing.';
        $canonical = 'https://getintofeed.com/services';

        return [
            'status_code' => 200,
            'title' => $title,
            'description' => $desc,
            'canonical' => $canonical,
            'robots' => 'index, follow',
            'og_type' => 'website',
            'og_title' => $title,
            'og_description' => $desc,
            'og_image' => self::DEFAULT_IMAGE,
            'og_url' => $canonical,
            'twitter_title' => $title,
            'twitter_description' => $desc,
            'twitter_image' => self::DEFAULT_IMAGE,
            'json_ld' => [
                '@context' => 'https://schema.org',
                '@type' => 'CollectionPage',
                'name' => $title,
                'description' => $desc,
                'url' => $canonical,
                'breadcrumb' => $this->buildBreadcrumbs([
                    ['name' => 'Home', 'url' => 'https://getintofeed.com/'],
                    ['name' => 'Services', 'url' => $canonical],
                ]),
            ],
            'fallback_html' => $this->buildServicesHubFallbackHtml(),
        ];
    }

    /**
     * Service Detail metadata.
     */
    protected function resolveServiceDetailMetadata(string $slug): array
    {
        $serviceAliases = [
            'performance-marketing-delhi-ncr' => 'google-ads-services-delhi-ncr',
            'performance-marketing' => 'google-ads-services-delhi-ncr',
            'ads-campaign' => 'google-ads-services-delhi-ncr',
            'google-ads' => 'google-ads-services-delhi-ncr',
            'meta-ads' => 'meta-ads-services-delhi-ncr',
            'seo' => 'seo-services-delhi-ncr',
            'social-media' => 'social-media-marketing-delhi-ncr',
            'web-development' => 'website-design-delhi-ncr',
            'web-development-delhi-ncr' => 'website-design-delhi-ncr',
            'website-design' => 'website-design-delhi-ncr',
            'short-form-video-reels-delhi-ncr' => 'reels-video-editing-delhi-ncr',
            'reels' => 'reels-video-editing-delhi-ncr',
            'videos' => 'reels-video-editing-delhi-ncr',
            'content-marketing' => 'content-creative-services-delhi-ncr',
            'brand-strategy-delhi-ncr' => 'content-creative-services-delhi-ncr',
            'influencer-marketing-delhi-ncr' => 'social-media-marketing-delhi-ncr',
            'analytics-reporting-delhi-ncr' => 'google-ads-services-delhi-ncr',
            'graphics-design' => 'graphic-design-services-delhi-ncr',
            'graphic-design' => 'graphic-design-services-delhi-ncr',
        ];

        $targetSlug = $serviceAliases[$slug] ?? $slug;

        $service = Service::query()
            ->where(function ($q) use ($slug, $targetSlug) {
                $q->where('slug', $slug)
                    ->orWhere('slug', $targetSlug);
            })
            ->where('status', 'published')
            ->with(['seo.ogMedia', 'seo.twitterMedia', 'heroMedia'])
            ->first();

        if (! $service) {
            return $this->resolveNotFoundMetadata('/services/'.$slug);
        }

        $seo = $service->seo;
        $title = $seo?->seo_title ?: ($service->name.' — Growth Services | GetIntoFeed');
        $rawDesc = $seo?->meta_description ?: ($service->short_description ?: $service->description);
        $desc = $this->formatMetaDescription($rawDesc, 155);
        $canonical = $seo?->canonical_url ?: "https://getintofeed.com/services/{$service->slug}";

        $imageUrl = $this->resolveImageUrl([
            $seo?->ogMedia?->url,
            $service->heroMedia?->url,
        ]);

        $robots = $this->resolveRobotsDirectives($seo);

        return [
            'status_code' => 200,
            'title' => $title,
            'description' => $desc,
            'canonical' => $canonical,
            'robots' => $robots,
            'og_type' => 'website',
            'og_title' => $seo?->og_title ?: $title,
            'og_description' => $seo?->og_description ?: $desc,
            'og_image' => $imageUrl,
            'og_url' => $canonical,
            'twitter_title' => $seo?->twitter_title ?: $title,
            'twitter_description' => $seo?->twitter_description ?: $desc,
            'twitter_image' => $this->resolveImageUrl([$seo?->twitterMedia?->url, $imageUrl]),
            'json_ld' => [
                '@context' => 'https://schema.org',
                '@type' => 'Service',
                'name' => $service->name,
                'description' => $desc,
                'provider' => [
                    '@type' => 'Organization',
                    'name' => self::SITE_NAME,
                    'url' => 'https://getintofeed.com/',
                ],
                'areaServed' => ['India', 'Global'],
                'url' => $canonical,
                'breadcrumb' => $this->buildBreadcrumbs([
                    ['name' => 'Home', 'url' => 'https://getintofeed.com/'],
                    ['name' => 'Services', 'url' => 'https://getintofeed.com/services'],
                    ['name' => $service->name, 'url' => $canonical],
                ]),
            ],
            'fallback_html' => $this->buildServiceDetailFallbackHtml($service, $title, $desc, $canonical),
        ];
    }

    /**
     * Blog Hub metadata.
     */
    protected function resolveBlogHubMetadata(): array
    {
        $title = 'Feed Notes & Growth Insights — Performance Marketing Playbooks | GetIntoFeed';
        $desc = 'Deep dives on Meta Advantage+ scaling, algorithm updates, TikTok/Reels creative architecture, and performance marketing unit economics.';
        $canonical = 'https://getintofeed.com/blog';

        return [
            'status_code' => 200,
            'title' => $title,
            'description' => $desc,
            'canonical' => $canonical,
            'robots' => 'index, follow',
            'og_type' => 'website',
            'og_title' => $title,
            'og_description' => $desc,
            'og_image' => self::DEFAULT_IMAGE,
            'og_url' => $canonical,
            'twitter_title' => $title,
            'twitter_description' => $desc,
            'twitter_image' => self::DEFAULT_IMAGE,
            'json_ld' => [
                '@context' => 'https://schema.org',
                '@type' => 'Blog',
                'name' => $title,
                'description' => $desc,
                'url' => $canonical,
                'breadcrumb' => $this->buildBreadcrumbs([
                    ['name' => 'Home', 'url' => 'https://getintofeed.com/'],
                    ['name' => 'Blog', 'url' => $canonical],
                ]),
            ],
            'fallback_html' => $this->buildBlogHubFallbackHtml(),
        ];
    }

    /**
     * Blog Detail metadata.
     */
    protected function resolveBlogDetailMetadata(string $slug): array
    {
        $aliases = [
            '7-ways-to-increase-form-field-conversion-rate' => 'increase-form-conversions-and-generate-more-leads',
            'ways-to-increase-form-field-conversion-rate' => 'increase-form-conversions-and-generate-more-leads',
            'form-field-conversion-rate' => 'increase-form-conversions-and-generate-more-leads',
            'how-to-increase-form-conversions' => 'increase-form-conversions-and-generate-more-leads',
            'how-to-increase-form-conversions-generate-more-leads-in-2027' => 'increase-form-conversions-and-generate-more-leads',
            'how-to-increase-form-conversions-generate-more-leads' => 'increase-form-conversions-and-generate-more-leads',
            'increase-form-conversions-and-generate-more-leads' => 'increase-form-conversions-and-generate-more-leads',
            'form-conversions-2027' => 'increase-form-conversions-and-generate-more-leads',
        ];
        $targetSlug = $aliases[$slug] ?? $slug;

        $blog = BlogPost::query()
            ->where(function ($q) use ($slug, $targetSlug) {
                $q->where('slug', $slug)
                    ->orWhere('slug', $targetSlug);
            })
            ->where('status', 'published')
            ->with(['seo.ogMedia', 'seo.twitterMedia', 'featuredMedia', 'author'])
            ->first();

        if (! $blog) {
            return $this->resolveNotFoundMetadata('/blog/'.$slug);
        }

        $seo = $blog->seo;
        $title = trim((string) ($blog->seo_title ?: $seo?->seo_title ?: ($blog->title.' — Feed Notes | GetIntoFeed')));

        $explicitMetaDesc = trim((string) ($blog->meta_description ?: $seo?->meta_description ?: ''));
        if ($explicitMetaDesc !== '') {
            $desc = Str::limit(Str::squish($explicitMetaDesc), 160, '');
        } else {
            $desc = $this->formatMetaDescription($blog->excerpt ?: $blog->content, 155);
        }

        $canonical = trim((string) ($blog->canonical_url ?: $seo?->canonical_url ?: "https://getintofeed.com/blog/{$blog->slug}"));

        $imageUrl = $this->resolveImageUrl([
            $seo?->ogMedia?->url,
            $blog->featuredMedia?->url,
        ]);
        $imageAlt = trim((string) ($blog->featured_image_alt ?: $blog->featuredMedia?->alt_text ?: $blog->title));

        $robotsIndex = $blog->robots_index !== null
            ? (bool) $blog->robots_index
            : ($seo ? (bool) ($seo->robots_index ?? true) : true);
        $robotsFollow = $blog->robots_follow !== null
            ? (bool) $blog->robots_follow
            : ($seo ? (bool) ($seo->robots_follow ?? true) : true);
        $robots = ($robotsIndex ? 'index' : 'noindex').', '.($robotsFollow ? 'follow' : 'nofollow').', max-image-preview:large';

        $publishedAt = $blog->published_at ? date('c', strtotime((string) $blog->published_at)) : date('c');
        $modifiedAt = $blog->updated_at ? date('c', strtotime((string) $blog->updated_at)) : $publishedAt;

        $ogTitle = trim((string) ($blog->og_title ?: $seo?->og_title ?: $title));
        $ogDesc = trim((string) ($blog->og_description ?: $seo?->og_description ?: $desc));

        $selectedSchema = trim((string) ($blog->schema_type ?: $seo?->schema_type ?: 'BlogPosting'));
        $allowedSchemas = ['BlogPosting', 'NewsArticle', 'HowTo', 'FAQPage', 'Article', 'TechArticle'];
        if (! in_array($selectedSchema, $allowedSchemas, true)) {
            $selectedSchema = 'BlogPosting';
        }

        $publisherNode = [
            '@type' => 'Organization',
            '@id' => 'https://getintofeed.com/#organization',
            'name' => self::SITE_NAME,
            'url' => 'https://getintofeed.com/',
            'logo' => [
                '@type' => 'ImageObject',
                'url' => 'https://getintofeed.com/favicon.svg',
            ],
        ];

        $authorNode = [
            '@type' => 'Person',
            'name' => $blog->author_name ?: ($blog->author?->name ?: 'GetIntoFeed Collective'),
            'jobTitle' => $blog->author_role ?: 'Growth Strategist',
        ];

        if ($selectedSchema === 'HowTo') {
            $primaryNode = [
                '@type' => 'HowTo',
                '@id' => $canonical.'#howto',
                'name' => $blog->title,
                'description' => $desc,
                'image' => [$imageUrl],
                'url' => $canonical,
                'datePublished' => $publishedAt,
                'dateModified' => $modifiedAt,
                'author' => $authorNode,
                'publisher' => $publisherNode,
            ];
            if (($blog->reading_time ?? 0) > 0) {
                $primaryNode['totalTime'] = 'PT'.((int) $blog->reading_time).'M';
            }
        } else {
            $articleType = $selectedSchema === 'FAQPage' ? 'BlogPosting' : $selectedSchema;
            $primaryNode = [
                '@type' => $articleType,
                '@id' => $canonical.'#article',
                'headline' => $blog->title,
                'description' => $desc,
                'image' => [$imageUrl],
                'url' => $canonical,
                'datePublished' => $publishedAt,
                'dateModified' => $modifiedAt,
                'articleSection' => $blog->category ?: 'Performance Marketing',
                'author' => $authorNode,
                'publisher' => $publisherNode,
                'mainEntityOfPage' => [
                    '@type' => 'WebPage',
                    '@id' => $canonical,
                ],
            ];
            if (($blog->word_count ?? 0) > 0) {
                $primaryNode['wordCount'] = (int) $blog->word_count;
            }
        }

        $graph = [
            $primaryNode,
            array_merge(
                ['@id' => $canonical.'#breadcrumb'],
                $this->buildBreadcrumbs([
                    ['name' => 'Home', 'url' => 'https://getintofeed.com/'],
                    ['name' => 'Blog', 'url' => 'https://getintofeed.com/blog'],
                    ['name' => $blog->title, 'url' => $canonical],
                ])
            ),
        ];

        $rawFaqs = is_array($blog->faq_items) ? $blog->faq_items : [];
        $faqEntities = [];
        foreach ($rawFaqs as $faq) {
            if (! is_array($faq)) {
                continue;
            }
            $question = trim((string) ($faq['q'] ?? ($faq['question'] ?? '')));
            $answer = trim((string) ($faq['a'] ?? ($faq['answer'] ?? '')));
            if ($question !== '' && $answer !== '') {
                $faqEntities[] = [
                    '@type' => 'Question',
                    'name' => $question,
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => $answer,
                    ],
                ];
            }
        }

        if ($faqEntities !== []) {
            $graph[] = [
                '@type' => 'FAQPage',
                '@id' => $canonical.'#faq',
                'mainEntity' => $faqEntities,
            ];
        }

        return [
            'status_code' => 200,
            'title' => $title,
            'description' => $desc,
            'canonical' => $canonical,
            'robots' => $robots,
            'og_type' => 'article',
            'og_title' => $ogTitle,
            'og_description' => $ogDesc,
            'og_image' => $imageUrl,
            'og_image_alt' => $imageAlt,
            'og_url' => $canonical,
            'article_published_time' => $publishedAt,
            'article_modified_time' => $modifiedAt,
            'article_author' => $blog->author_name ?: 'GetIntoFeed Growth Team',
            'article_section' => $blog->category ?: 'Performance Marketing',
            'twitter_card' => 'summary_large_image',
            'twitter_title' => trim((string) ($seo?->twitter_title ?: $ogTitle)),
            'twitter_description' => trim((string) ($seo?->twitter_description ?: $ogDesc)),
            'twitter_image' => $this->resolveImageUrl([$seo?->twitterMedia?->url, $imageUrl]),
            'twitter_image_alt' => $imageAlt,
            'json_ld' => [
                '@context' => 'https://schema.org',
                '@graph' => $graph,
            ],
            'fallback_html' => $this->buildBlogDetailFallbackHtml($blog, $title, $desc, $canonical),
        ];
    }

    /**
     * Case Studies Hub metadata.
     */
    protected function resolveCaseStudiesHubMetadata(): array
    {
        $title = 'Client Case Studies & Growth Proof — Verified Scaling Data | GetIntoFeed';
        $desc = 'Verified client results and performance metrics: +380% qualified pipeline, 4.8x blended ROAS, and 28,000+ new customer acquisitions.';
        $canonical = 'https://getintofeed.com/case-studies';

        return [
            'status_code' => 200,
            'title' => $title,
            'description' => $desc,
            'canonical' => $canonical,
            'robots' => 'index, follow',
            'og_type' => 'website',
            'og_title' => $title,
            'og_description' => $desc,
            'og_image' => self::DEFAULT_IMAGE,
            'og_url' => $canonical,
            'twitter_title' => $title,
            'twitter_description' => $desc,
            'twitter_image' => self::DEFAULT_IMAGE,
            'json_ld' => [
                '@context' => 'https://schema.org',
                '@type' => 'CollectionPage',
                'name' => $title,
                'description' => $desc,
                'url' => $canonical,
                'breadcrumb' => $this->buildBreadcrumbs([
                    ['name' => 'Home', 'url' => 'https://getintofeed.com/'],
                    ['name' => 'Case Studies', 'url' => $canonical],
                ]),
            ],
            'fallback_html' => $this->buildCaseStudiesHubFallbackHtml(),
        ];
    }

    /**
     * Case Study Detail metadata.
     */
    protected function resolveCaseStudyDetailMetadata(string $slug): array
    {
        $case = CaseStudy::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['seo.ogMedia', 'seo.twitterMedia', 'heroMedia'])
            ->first();

        if (! $case) {
            return $this->resolveNotFoundMetadata('/case-studies/'.$slug);
        }

        $seo = $case->seo;
        $title = $seo?->seo_title ?: ($case->project_name.' ('.$case->client_name.') — Case Study | GetIntoFeed');
        $desc = $seo?->meta_description ?: ($case->hero_description ?: ($case->challenge ?: "Client performance marketing case study for {$case->client_name} by GetIntoFeed."));
        $desc = mb_substr(trim(preg_replace('/\s+/', ' ', $desc)), 0, 160);
        $canonical = $seo?->canonical_url ?: "https://getintofeed.com/case-studies/{$slug}";

        $imageUrl = $this->resolveImageUrl([
            $seo?->ogMedia?->url,
            $case->heroMedia?->url,
        ]);

        $robots = $this->resolveRobotsDirectives($seo);

        return [
            'status_code' => 200,
            'title' => $title,
            'description' => $desc,
            'canonical' => $canonical,
            'robots' => $robots,
            'og_type' => 'article',
            'og_title' => $seo?->og_title ?: $title,
            'og_description' => $seo?->og_description ?: $desc,
            'og_image' => $imageUrl,
            'og_url' => $canonical,
            'twitter_title' => $seo?->twitter_title ?: $title,
            'twitter_description' => $seo?->twitter_description ?: $desc,
            'twitter_image' => $this->resolveImageUrl([$seo?->twitterMedia?->url, $imageUrl]),
            'json_ld' => [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $case->project_name,
                'description' => $desc,
                'image' => [$imageUrl],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => self::SITE_NAME,
                    'url' => 'https://getintofeed.com/',
                ],
                'about' => [
                    '@type' => 'Organization',
                    'name' => $case->client_name,
                ],
                'breadcrumb' => $this->buildBreadcrumbs([
                    ['name' => 'Home', 'url' => 'https://getintofeed.com/'],
                    ['name' => 'Case Studies', 'url' => 'https://getintofeed.com/case-studies'],
                    ['name' => $case->project_name, 'url' => $canonical],
                ]),
            ],
            'fallback_html' => $this->buildCaseStudyDetailFallbackHtml($case, $title, $desc, $canonical),
        ];
    }

    /**
     * Dynamic CMS Pages & Known Static Routes.
     */
    protected function resolvePageMetadata(string $slug): array
    {
        // 1. Check database CMS pages
        $page = Page::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['seo.ogMedia', 'seo.twitterMedia', 'featuredMedia'])
            ->first();

        if ($page) {
            $seo = $page->seo;
            $title = $seo?->seo_title ?: ($page->title.' — GetIntoFeed');
            $rawDesc = $seo?->meta_description ?: $page->content;
            $desc = $this->formatMetaDescription($rawDesc, 155);
            $canonical = $seo?->canonical_url ?: "https://getintofeed.com/{$slug}";
            $imageUrl = $this->resolveImageUrl([$seo?->ogMedia?->url, $page->featuredMedia?->url]);
            $robots = $this->resolveRobotsDirectives($seo);

            return [
                'status_code' => 200,
                'title' => $title,
                'description' => $desc,
                'canonical' => $canonical,
                'robots' => $robots,
                'og_type' => 'website',
                'og_title' => $seo?->og_title ?: $title,
                'og_description' => $seo?->og_description ?: $desc,
                'og_image' => $imageUrl,
                'og_url' => $canonical,
                'twitter_title' => $seo?->twitter_title ?: $title,
                'twitter_description' => $seo?->twitter_description ?: $desc,
                'twitter_image' => $imageUrl,
                'json_ld' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebPage',
                    'name' => $page->title,
                    'description' => $desc,
                    'url' => $canonical,
                    'breadcrumb' => $this->buildBreadcrumbs([
                        ['name' => 'Home', 'url' => 'https://getintofeed.com/'],
                        ['name' => $page->title, 'url' => $canonical],
                    ]),
                ],
                'fallback_html' => $this->buildPageFallbackHtml($page, $slug, $title, $desc),
            ];
        }

        // 2. Known static routes
        $staticPages = [
            'about' => [
                'title' => 'About Us — GetIntoFeed Performance Marketing & Creative Studio',
                'description' => 'Discover GetIntoFeed: founded by seasoned performance marketers and creative directors to replace slow agency models with high-velocity creative testing and paid growth.',
            ],
            'pricing' => [
                'title' => 'Pricing & Growth Sprints — Transparent Retainers | GetIntoFeed',
                'description' => 'Explore transparent engagement models: Full-Funnel Growth Retainer, Creative Reels Studio, Paid Ads Management, and Performance SEO.',
            ],
            'contact' => [
                'title' => 'Contact Us — Book a 30-Minute Growth Strategy Call | GetIntoFeed',
                'description' => 'Reach out to our growth directors in New Delhi. Submit your inquiry or call +91-8810356950 to unlock high-performing ad creatives and paid funnel growth.',
            ],
            'privacy' => [
                'title' => 'Privacy Policy — GetIntoFeed Digital Growth Studio',
                'description' => 'Read our transparent privacy policy, data collection standards, cookie practices, and compliance commitments at GetIntoFeed.',
            ],
            'terms' => [
                'title' => 'Terms of Service — GetIntoFeed Growth Agency',
                'description' => 'Terms of service, client engagement agreements, intellectual property guidelines, and conditions for GetIntoFeed services.',
            ],
            'careers' => [
                'title' => 'Careers | Join GetIntoFeed Growth Agency',
                'description' => 'Build high-converting campaigns and thumb-stopping video reels with India\'s elite creative performance team. View open positions.',
            ],
            'audit' => [
                'title' => 'Free Performance Marketing Audit — Instant Growth Analysis | GetIntoFeed',
                'description' => 'Get a comprehensive audit of your Meta & Google ad accounts, funnel drop-offs, and creative fatigue score in 24 hours.',
            ],
            'thank-you' => [
                'title' => 'Thank You | Consultation Request Received — GetIntoFeed',
                'description' => 'Thank you for requesting a growth consultation with GetIntoFeed. A senior performance strategist will contact you within 2-4 business hours.',
                'robots' => 'noindex, follow',
            ],
            'thankyou' => [
                'title' => 'Thank You | Consultation Request Received — GetIntoFeed',
                'description' => 'Thank you for requesting a growth consultation with GetIntoFeed. A senior performance strategist will contact you within 2-4 business hours.',
                'robots' => 'noindex, follow',
            ],
        ];

        if (isset($staticPages[$slug])) {
            $info = $staticPages[$slug];
            $canonical = "https://getintofeed.com/{$slug}";

            return [
                'status_code' => 200,
                'title' => $info['title'],
                'description' => $info['description'],
                'canonical' => $canonical,
                'robots' => $info['robots'] ?? 'index, follow',
                'og_type' => 'website',
                'og_title' => $info['title'],
                'og_description' => $info['description'],
                'og_image' => self::DEFAULT_IMAGE,
                'og_url' => $canonical,
                'twitter_title' => $info['title'],
                'twitter_description' => $info['description'],
                'twitter_image' => self::DEFAULT_IMAGE,
                'json_ld' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebPage',
                    'name' => $info['title'],
                    'description' => $info['description'],
                    'url' => $canonical,
                    'breadcrumb' => $this->buildBreadcrumbs([
                        ['name' => 'Home', 'url' => 'https://getintofeed.com/'],
                        ['name' => ucfirst($slug), 'url' => $canonical],
                    ]),
                ],
                'fallback_html' => $this->buildPageFallbackHtml(null, $slug, $info['title'], $info['description']),
            ];
        }

        // 3. Not found -> Real HTTP 404
        return $this->resolveNotFoundMetadata('/'.$slug);
    }

    /**
     * HTTP 404 Not Found metadata.
     */
    protected function resolveNotFoundMetadata(string $requestedPath): array
    {
        $title = 'Page Not Found (404) | GetIntoFeed';
        $desc = 'The requested resource could not be found on GetIntoFeed. Explore our services, client results, and latest growth insights.';
        $canonical = 'https://getintofeed.com/404';

        return [
            'status_code' => 404,
            'title' => $title,
            'description' => $desc,
            'canonical' => $canonical,
            'robots' => 'noindex, nofollow',
            'og_type' => 'website',
            'og_title' => $title,
            'og_description' => $desc,
            'og_image' => self::DEFAULT_IMAGE,
            'og_url' => $canonical,
            'twitter_title' => $title,
            'twitter_description' => $desc,
            'twitter_image' => self::DEFAULT_IMAGE,
            'json_ld' => [
                '@context' => 'https://schema.org',
                '@type' => 'WebPage',
                'name' => $title,
                'description' => $desc,
                'url' => $canonical,
            ],
            'fallback_html' => $this->buildNotFoundFallbackHtml(),
        ];
    }

    /**
     * Ensure image URLs are valid absolute HTTPS URLs.
     */
    public function resolveImageUrl(array $candidates): string
    {
        foreach ($candidates as $url) {
            if (empty($url)) {
                continue;
            }

            $url = trim($url);
            if (str_starts_with($url, 'https://')) {
                return $url;
            }
            if (str_starts_with($url, 'http://')) {
                return 'https://'.substr($url, 7);
            }
            if (str_starts_with($url, '//')) {
                return 'https:'.$url;
            }

            return 'https://getintofeed.com/'.ltrim($url, '/');
        }

        return self::DEFAULT_IMAGE;
    }

    /**
     * Clean and format SEO meta description with proper tag spacing and word-boundary limit.
     */
    public function formatMetaDescription(?string $content, int $limit = 155): string
    {
        if (empty($content)) {
            return self::DEFAULT_DESC;
        }

        // 1. Ensure whitespace exists around HTML block elements before stripping
        $spaced = preg_replace('/<\/(h[1-6]|p|div|li|article|section|tr|td)>/i', ' ', (string) $content);
        $spaced = preg_replace('/<(br|hr)\s*\/?>/i', ' ', $spaced);
        $clean = strip_tags($spaced);

        // 2. Decode HTML entities and normalize all whitespace
        $clean = html_entity_decode($clean, ENT_QUOTES, 'UTF-8');
        $squished = Str::squish($clean);

        // 3. Clean word-boundary truncation (max 155 chars)
        return Str::limit($squished, $limit, '...');
    }

    /**
     * Resolve robots meta tag.
     */
    protected function resolveRobotsDirectives(?object $seo): string
    {
        if (! $seo) {
            return 'index, follow, max-image-preview:large';
        }

        $index = ($seo->robots_index ?? true) ? 'index' : 'noindex';
        $follow = ($seo->robots_follow ?? true) ? 'follow' : 'nofollow';

        return "{$index}, {$follow}, max-image-preview:large";
    }

    /**
     * Build standard BreadcrumbList structured data.
     */
    protected function buildBreadcrumbs(array $items): array
    {
        $list = [];
        foreach ($items as $idx => $item) {
            $list[] = [
                '@type' => 'ListItem',
                'position' => $idx + 1,
                'name' => $item['name'],
                'item' => $item['url'],
            ];
        }

        return [
            '@type' => 'BreadcrumbList',
            'itemListElement' => $list,
        ];
    }

    /**
     * Build homepage Organization, WebSite, and FAQ schema.
     */
    protected function buildHomepageJsonLd(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'Organization',
                    '@id' => 'https://getintofeed.com/#organization',
                    'name' => 'GetIntoFeed',
                    'url' => 'https://getintofeed.com/',
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => 'https://getintofeed.com/favicon.svg',
                    ],
                    'contactPoint' => [
                        '@type' => 'ContactPoint',
                        'telephone' => '+91-8810356950',
                        'contactType' => 'sales',
                        'areaServed' => ['IN', 'US', 'GB', 'AE'],
                        'availableLanguage' => ['English', 'Hindi'],
                    ],
                ],
                [
                    '@type' => 'WebSite',
                    '@id' => 'https://getintofeed.com/#website',
                    'url' => 'https://getintofeed.com/',
                    'name' => 'GetIntoFeed',
                    'publisher' => ['@id' => 'https://getintofeed.com/#organization'],
                ],
                [
                    '@type' => 'WebPage',
                    '@id' => 'https://getintofeed.com/#webpage',
                    'url' => 'https://getintofeed.com/',
                    'name' => self::DEFAULT_TITLE,
                    'description' => self::DEFAULT_DESC,
                    'isPartOf' => ['@id' => 'https://getintofeed.com/#website'],
                    'about' => ['@id' => 'https://getintofeed.com/#organization'],
                ],
            ],
        ];
    }

    /**
     * Load the base Vite React SPA index.html.
     */
    protected function loadTemplateHtml(): string
    {
        $candidates = [
            base_path('../index.html'),
            base_path('../public_html/index.html'),
            public_path('index.html'),
            base_path('resources/views/index.html'),
        ];

        foreach ($candidates as $path) {
            if (file_exists($path)) {
                return file_get_contents($path);
            }
        }

        // Fallback minimal skeleton if index.html is missing
        return '<!doctype html><html lang="en"><head><title>GetIntoFeed</title></head><body><div id="root"></div></body></html>';
    }

    /**
     * Replace the first matching head tag and strip any duplicate matches,
     * or insert the tag cleanly before </head> if not yet present.
     */
    protected function upsertHeadTag(string $html, string $pattern, string $tagHtml): string
    {
        $count = 0;
        $updated = preg_replace_callback($pattern, function () use (&$count, $tagHtml): string {
            $count++;

            return $count === 1 ? $tagHtml : '';
        }, $html);

        if ($count > 0 && is_string($updated)) {
            return $updated;
        }

        if (str_contains($html, '</head>')) {
            return str_replace('</head>', "    {$tagHtml}\n  </head>", $html);
        }

        return $html;
    }

    /**
     * Inject dynamic metadata tags into HTML template with zero duplicate tags.
     */
    public function injectMetadata(string $html, array $data): string
    {
        $rawTitle = (string) ($data['title'] ?? self::DEFAULT_TITLE);
        $rawDesc = (string) ($data['description'] ?? self::DEFAULT_DESC);
        $rawCanonical = (string) ($data['canonical'] ?? 'https://getintofeed.com/');
        $rawRobots = (string) ($data['robots'] ?? 'index, follow, max-image-preview:large');
        $rawOgType = (string) ($data['og_type'] ?? 'website');
        $rawOgTitle = (string) ($data['og_title'] ?? $rawTitle);
        $rawOgDesc = (string) ($data['og_description'] ?? $rawDesc);
        $rawOgImage = (string) ($data['og_image'] ?? self::DEFAULT_IMAGE);
        $rawOgImageAlt = (string) ($data['og_image_alt'] ?? 'GetIntoFeed — Creative Growth Studio');
        $rawTwCard = (string) ($data['twitter_card'] ?? 'summary_large_image');
        $rawTwTitle = (string) ($data['twitter_title'] ?? $rawOgTitle);
        $rawTwDesc = (string) ($data['twitter_description'] ?? $rawOgDesc);
        $rawTwImage = (string) ($data['twitter_image'] ?? $rawOgImage);
        $rawTwImageAlt = (string) ($data['twitter_image_alt'] ?? $rawOgImageAlt);

        $esc = fn (string $v): string => htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        $title = $esc($rawTitle);
        $desc = $esc($rawDesc);
        $canonical = $esc($rawCanonical);
        $robots = $esc($rawRobots);
        $ogType = $esc($rawOgType);
        $ogTitle = $esc($rawOgTitle);
        $ogDesc = $esc($rawOgDesc);
        $ogImage = $esc($rawOgImage);
        $ogImageAlt = $esc($rawOgImageAlt);
        $twCard = $esc($rawTwCard);
        $twTitle = $esc($rawTwTitle);
        $twDesc = $esc($rawTwDesc);
        $twImage = $esc($rawTwImage);
        $twImageAlt = $esc($rawTwImageAlt);

        // Primary SEO tags (deduplicated)
        $html = $this->upsertHeadTag($html, '/<title>.*?<\/title>/is', "<title>{$title}</title>");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*name=["\']description["\'][^>]*>/is', "<meta name=\"description\" content=\"{$desc}\" />");
        $html = $this->upsertHeadTag($html, '/<link\s+[^>]*rel=["\']canonical["\'][^>]*>/is', "<link rel=\"canonical\" href=\"{$canonical}\" id=\"canonical-tag\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*name=["\']robots["\'][^>]*>/is', "<meta name=\"robots\" content=\"{$robots}\" />");

        // Open Graph tags (deduplicated)
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*property=["\']og:type["\'][^>]*>/is', "<meta property=\"og:type\" content=\"{$ogType}\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*property=["\']og:title["\'][^>]*>/is', "<meta property=\"og:title\" content=\"{$ogTitle}\" id=\"og-title\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*property=["\']og:description["\'][^>]*>/is', "<meta property=\"og:description\" content=\"{$ogDesc}\" id=\"og-desc\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*property=["\']og:url["\'][^>]*>/is', "<meta property=\"og:url\" content=\"{$canonical}\" id=\"og-url\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*property=["\']og:image["\'][^>]*>/is', "<meta property=\"og:image\" content=\"{$ogImage}\" id=\"og-image\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*property=["\']og:image:alt["\'][^>]*>/is', "<meta property=\"og:image:alt\" content=\"{$ogImageAlt}\" />");

        // Twitter / X Card tags (deduplicated)
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*name=["\']twitter:card["\'][^>]*>/is', "<meta name=\"twitter:card\" content=\"{$twCard}\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*name=["\']twitter:title["\'][^>]*>/is', "<meta name=\"twitter:title\" content=\"{$twTitle}\" id=\"tw-title\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*name=["\']twitter:description["\'][^>]*>/is', "<meta name=\"twitter:description\" content=\"{$twDesc}\" id=\"tw-desc\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*name=["\']twitter:image["\'][^>]*>/is', "<meta name=\"twitter:image\" content=\"{$twImage}\" />");
        $html = $this->upsertHeadTag($html, '/<meta\s+[^>]*name=["\']twitter:image:alt["\'][^>]*>/is', "<meta name=\"twitter:image:alt\" content=\"{$twImageAlt}\" />");

        // Strip any pre-existing article:* tags before upserting
        $html = preg_replace('/\s*<meta\s+[^>]*property=["\']article:(?:published_time|modified_time|author|section)["\'][^>]*>/is', '', $html);
        if (! empty($data['article_published_time'])) {
            $articleMeta = '    <meta property="article:published_time" content="'.$esc((string) $data['article_published_time']).'" />'
                         ."\n    <meta property=\"article:modified_time\" content=\"".$esc((string) ($data['article_modified_time'] ?? $data['article_published_time'])).'" />'
                         ."\n    <meta property=\"article:author\" content=\"".$esc((string) ($data['article_author'] ?? 'GetIntoFeed')).'" />'
                         ."\n    <meta property=\"article:section\" content=\"".$esc((string) ($data['article_section'] ?? 'Marketing')).'" />';
            $html = str_replace('</head>', "{$articleMeta}\n  </head>", $html);
        }

        // Replace JSON-LD (deduplicated, safe against </script> injection)
        if (! empty($data['json_ld'])) {
            $jsonString = json_encode(
                $data['json_ld'],
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_PRETTY_PRINT
            );
            $jsonTag = "<script type=\"application/ld+json\">\n{$jsonString}\n    </script>";
            $html = $this->upsertHeadTag($html, '/<script\s+[^>]*type=["\']application\/ld\+json["\'][^>]*>.*?<\/script>/is', $jsonTag);
        }

        // Inject Route-Specific Server-Rendered Semantic Body HTML directly into #root and <noscript id="seo-fallback-content">
        if (! empty($data['fallback_html'])) {
            $ssrBlock = '<div id="root">'."\n".$data['fallback_html']."\n    </div>";
            if (str_contains($html, '<div id="root"><!-- SSR_CONTENT_INJECTION --></div>')) {
                $html = str_replace('<div id="root"><!-- SSR_CONTENT_INJECTION --></div>', $ssrBlock, $html);
            } elseif (str_contains($html, '<div id="root"></div>')) {
                $html = str_replace('<div id="root"></div>', $ssrBlock, $html);
            } else {
                $html = preg_replace('/<div id="root">.*?<\/div>/is', $ssrBlock, $html, 1);
            }

            // Target specifically the non-JS crawler semantic fallback by unique ID (preserves Google Fonts noscript in <head> and GTM noscript in <body>)
            $fallbackNoscript = "<noscript id=\"seo-fallback-content\">\n".$data['fallback_html']."\n    </noscript>";
            if (preg_match('/<noscript\s+[^>]*id=["\']seo-fallback-content["\'][^>]*>.*?<\/noscript>/is', $html)) {
                $html = preg_replace('/<noscript\s+[^>]*id=["\']seo-fallback-content["\'][^>]*>.*?<\/noscript>/is', $fallbackNoscript, $html, 1);
            }
        }

        return $html;
    }

    /**
     * Homepage fallback HTML.
     */
    protected function buildHomepageFallbackHtml(): string
    {
        return <<<'HTML'
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/case-studies">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <h1>Your business is online. But is it getting noticed?</h1>
        <p>Digital marketing services in Delhi NCR for businesses ready to get noticed. We handle Google Ads, SEO, social media and web design without the big-agency overhead.</p>
        <section>
          <h2>Core Services</h2>
          <ul>
            <li><a href="/services/google-ads-services-delhi-ncr">Google Ads Management</a></li>
            <li><a href="/services/meta-ads-services-delhi-ncr">Meta Ads &amp; Performance Marketing</a></li>
            <li><a href="/services/seo-services-delhi-ncr">SEO &amp; Local Search Optimization</a></li>
            <li><a href="/services/social-media-marketing-delhi-ncr">Social Media Marketing</a></li>
            <li><a href="/services/website-design-delhi-ncr">Website Design &amp; Development</a></li>
            <li><a href="/services/content-creative-services-delhi-ncr">Content &amp; Creative Strategy</a></li>
            <li><a href="/services/reels-video-editing-delhi-ncr">Reels &amp; Short-Form Video Editing</a></li>
            <li><a href="/services/graphic-design-services-delhi-ncr">Graphic Design &amp; Brand Identity</a></li>
          </ul>
        </section>
        <section>
          <h2>Book a Consultation</h2>
          <p>Call or WhatsApp: <a href="https://wa.me/918810356950">+91-8810356950</a> | <a href="/contact">Start a Project</a></p>
        </section>
      </main>
      <footer>
        <nav aria-label="Legal Navigation">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
HTML;
    }

    /**
     * Services Hub fallback HTML.
     */
    protected function buildServicesHubFallbackHtml(): string
    {
        $services = Service::query()->where('status', 'published')->orderBy('id')->get();
        $itemsHtml = '';
        foreach ($services as $s) {
            $sName = htmlspecialchars($s->name, ENT_QUOTES, 'UTF-8');
            $sDesc = htmlspecialchars($s->short_description ?: strip_tags($s->description ?? ''), ENT_QUOTES, 'UTF-8');
            $itemsHtml .= "<li><h3><a href=\"/services/{$s->slug}\">{$sName}</a></h3><p>{$sDesc}</p></li>\n";
        }

        return <<<HTML
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/case-studies">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <span>Services</span>
        </nav>
        <h1>Growth &amp; Performance Marketing Services in Delhi NCR</h1>
        <p>Comprehensive creative performance marketing, SEO, video reels, and full-funnel paid ad campaigns for ambitious brands.</p>
        <section>
          <h2>Our Core Disciplines</h2>
          <ul>
            {$itemsHtml}
          </ul>
        </section>
        <section>
          <h2>Why Brands Choose GetIntoFeed</h2>
          <p>Zero agency bloat. Direct access to senior growth operators, transparent weekly reporting, and performance-driven campaign execution.</p>
        </section>
        <section>
          <h2>Ready to Scale?</h2>
          <p><a href="/contact">Book a Free Consultation</a> | <a href="https://wa.me/918810356950">Chat on WhatsApp (+91-8810356950)</a></p>
        </section>
      </main>
      <footer>
        <nav aria-label="Legal Navigation">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
HTML;
    }

    /**
     * Service Detail fallback HTML.
     */
    protected function buildServiceDetailFallbackHtml(Service $service, string $title, string $desc, string $canonical): string
    {
        $features = is_array($service->features) ? $service->features : (json_decode($service->features ?? '[]', true) ?: []);
        $featuresHtml = '';
        if (! empty($features)) {
            $featuresHtml .= '<ul>';
            foreach ($features as $f) {
                $featureTitle = htmlspecialchars(is_array($f) ? ($f['title'] ?? $f['name'] ?? '') : (string) $f, ENT_QUOTES, 'UTF-8');
                $featureDesc = is_array($f) && ! empty($f['description']) ? ' — '.htmlspecialchars($f['description'], ENT_QUOTES, 'UTF-8') : '';
                if (! empty($featureTitle)) {
                    $featuresHtml .= "<li><strong>{$featureTitle}</strong>{$featureDesc}</li>";
                }
            }
            $featuresHtml .= '</ul>';
        }

        $serviceName = htmlspecialchars($service->name, ENT_QUOTES, 'UTF-8');
        $descHtml = htmlspecialchars($desc, ENT_QUOTES, 'UTF-8');

        return <<<HTML
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/case-studies">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/services">Services</a> / <span>{$serviceName}</span>
        </nav>
        <h1>{$serviceName} Services in Delhi NCR</h1>
        <p class="service-intro">{$descHtml}</p>
        <section>
          <h2>Key Deliverables &amp; Capabilities</h2>
          {$featuresHtml}
        </section>
        <section>
          <h2>Why Choose GetIntoFeed for {$serviceName}</h2>
          <p>We combine senior growth strategy, algorithmic paid advertising, and thumb-stopping creative engineering to scale qualified inbound pipeline.</p>
        </section>
        <section>
          <h2>Start Your Growth Consultation</h2>
          <p>Direct contact with our growth operators: <a href="/contact">Book 30-Minute Call</a> | <a href="https://wa.me/918810356950">WhatsApp +91-8810356950</a></p>
        </section>
      </main>
      <footer>
        <nav aria-label="Legal Navigation">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
HTML;
    }

    /**
     * Blog Hub fallback HTML.
     */
    protected function buildBlogHubFallbackHtml(): string
    {
        $blogs = BlogPost::query()->where('status', 'published')->orderBy('published_at', 'desc')->take(10)->get();
        $articlesHtml = '';
        foreach ($blogs as $b) {
            $bTitle = htmlspecialchars($b->title, ENT_QUOTES, 'UTF-8');
            $bSummary = htmlspecialchars($b->excerpt ?: '', ENT_QUOTES, 'UTF-8');
            $articlesHtml .= "<li><h3><a href=\"/blog/{$b->slug}\">{$bTitle}</a></h3><p>{$bSummary}</p></li>\n";
        }

        return <<<HTML
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/case-studies">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <span>Blog</span>
        </nav>
        <h1>Feed Notes &amp; Growth Insights — Performance Marketing Playbooks</h1>
        <p>In-depth breakdowns on Meta Advantage+ scaling, algorithm updates, TikTok/Reels creative architecture, and unit economics.</p>
        <section>
          <h2>Recent Articles</h2>
          <ul>
            {$articlesHtml}
          </ul>
        </section>
      </main>
      <footer>
        <nav aria-label="Legal Navigation">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
HTML;
    }

    /**
     * Blog Detail fallback HTML.
     */
    protected function buildBlogDetailFallbackHtml(BlogPost $blog, string $title, string $desc, string $canonical): string
    {
        $bTitle = htmlspecialchars($blog->title, ENT_QUOTES, 'UTF-8');
        $bAuthor = htmlspecialchars($blog->author_name ?: 'GetIntoFeed Growth Team', ENT_QUOTES, 'UTF-8');
        $bDate = htmlspecialchars($blog->published_at ? date('F j, Y', strtotime($blog->published_at)) : date('F j, Y'), ENT_QUOTES, 'UTF-8');
        $bCategory = htmlspecialchars($blog->category ?: 'Performance Marketing', ENT_QUOTES, 'UTF-8');
        $bContent = nl2br(htmlspecialchars(mb_substr(strip_tags($blog->content ?? ''), 0, 1000), ENT_QUOTES, 'UTF-8'));

        return <<<HTML
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/case-studies">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/blog">Blog</a> / <span>{$bTitle}</span>
        </nav>
        <article>
          <h1>{$bTitle}</h1>
          <div class="article-meta">
            <span>By {$bAuthor}</span> | <span>Published: {$bDate}</span> | <span>Category: {$bCategory}</span>
          </div>
          <div class="article-body">
            <p class="summary"><strong>Summary:</strong> {$desc}</p>
            <div class="excerpt">{$bContent}...</div>
          </div>
        </article>
        <section>
          <h2>Scale Your Marketing With GetIntoFeed</h2>
          <p>Looking for a dedicated growth partner? <a href="/contact">Get in touch with our team</a> or WhatsApp <a href="https://wa.me/918810356950">+91-8810356950</a>.</p>
        </section>
      </main>
      <footer>
        <nav aria-label="Legal Navigation">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
HTML;
    }

    /**
     * Case Studies Hub fallback HTML.
     */
    protected function buildCaseStudiesHubFallbackHtml(): string
    {
        $cases = CaseStudy::query()->where('status', 'published')->orderBy('id')->get();
        $casesHtml = '';
        foreach ($cases as $c) {
            $cTitle = htmlspecialchars($c->project_name ?: $c->title, ENT_QUOTES, 'UTF-8');
            $cClient = htmlspecialchars($c->client_name ?: '', ENT_QUOTES, 'UTF-8');
            $cDesc = htmlspecialchars($c->hero_description ?: strip_tags($c->challenge ?? ''), ENT_QUOTES, 'UTF-8');
            $casesHtml .= "<li><h3><a href=\"/case-studies/{$c->slug}\">{$cTitle} ({$cClient})</a></h3><p>{$cDesc}</p></li>\n";
        }

        return <<<HTML
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/case-studies">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <span>Case Studies</span>
        </nav>
        <h1>Client Case Studies &amp; Growth Proof — Verified Scaling Data</h1>
        <p>Verified client results and performance metrics: +380% qualified pipeline, 4.8x blended ROAS, and 28,000+ new customer acquisitions.</p>
        <section>
          <h2>Featured Case Studies</h2>
          <ul>
            {$casesHtml}
          </ul>
        </section>
      </main>
      <footer>
        <nav aria-label="Legal Navigation">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
HTML;
    }

    /**
     * Case Study Detail fallback HTML.
     */
    protected function buildCaseStudyDetailFallbackHtml(CaseStudy $case, string $title, string $desc, string $canonical): string
    {
        $cTitle = htmlspecialchars($case->project_name ?: $case->title, ENT_QUOTES, 'UTF-8');
        $cClient = htmlspecialchars($case->client_name ?: '', ENT_QUOTES, 'UTF-8');
        $cDesc = htmlspecialchars($desc, ENT_QUOTES, 'UTF-8');

        return <<<HTML
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/case-studies">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/case-studies">Case Studies</a> / <span>{$cTitle}</span>
        </nav>
        <h1>{$cTitle} — {$cClient} Case Study</h1>
        <p class="intro">{$cDesc}</p>
        <section>
          <h2>Client Growth Results</h2>
          <p>Delivered measurable revenue growth, lower customer acquisition costs, and predictable pipeline scaling.</p>
        </section>
        <section>
          <h2>Start Your Project</h2>
          <p><a href="/contact">Book a Growth Strategy Session</a> | <a href="https://wa.me/918810356950">WhatsApp +91-8810356950</a></p>
        </section>
      </main>
      <footer>
        <nav aria-label="Legal Navigation">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
HTML;
    }

    /**
     * Static Page fallback HTML.
     */
    protected function buildPageFallbackHtml(?Page $page, string $slug, string $title, string $desc): string
    {
        $cleanTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
        $cleanDesc = htmlspecialchars($desc, ENT_QUOTES, 'UTF-8');

        $bodyContent = '';
        if ($slug === 'about') {
            $bodyContent = <<<HTML
        <h1>About GetIntoFeed — Creative Performance Growth Agency</h1>
        <p class="intro">{$cleanDesc}</p>
        <section>
          <h2>Who We Are</h2>
          <p>Founded in New Delhi, GetIntoFeed is an elite creative performance marketing studio. We replace bloated, slow agency retainers with high-velocity creative sprints and algorithmic paid media execution.</p>
          <ul>
            <li><strong>28,000+</strong> Customer Acquisitions</li>
            <li><strong>+380%</strong> Average Pipeline Growth</li>
            <li><strong>4.8x</strong> Blended ROAS Across Paid Portfolios</li>
          </ul>
        </section>
        <section>
          <h2>Contact Founders</h2>
          <p>Office: New Delhi, India — 110001 | Phone: <a href="https://wa.me/918810356950">+91-8810356950</a> | Email: hello@getintofeed.com</p>
        </section>
HTML;
        } elseif ($slug === 'pricing') {
            $bodyContent = <<<HTML
        <h1>Pricing &amp; Growth Sprints — Transparent Retainers</h1>
        <p class="intro">{$cleanDesc}</p>
        <section>
          <h2>Growth Sprints &amp; Packages</h2>
          <ul>
            <li>
              <h3>Tier 1: Performance Marketing Sprint</h3>
              <p>Starting from ₹24,999/month. Meta &amp; Google Ads setup, 10 custom creatives, CAPI attribution, target 3.5x - 5x ROAS.</p>
            </li>
            <li>
              <h3>Tier 2: Creative Video Reels Studio</h3>
              <p>Starting from ₹29,999/month. 12 high-retention vertical reels, full scripting, sound design, and hook testing.</p>
            </li>
            <li>
              <h3>Tier 3: Full-Funnel Growth Retainer</h3>
              <p>Starting from ₹49,999/month. Omnichannel paid media, landing page engineering, CRO, and dedicated strategist.</p>
            </li>
          </ul>
        </section>
        <section>
          <h2>Custom Quotations</h2>
          <p>Have custom requirements? <a href="/contact">Request a Custom Proposal</a></p>
        </section>
HTML;
        } elseif ($slug === 'contact') {
            $bodyContent = <<<HTML
        <h1>Contact GetIntoFeed — Book a 30-Minute Growth Strategy Call</h1>
        <p class="intro">{$cleanDesc}</p>
        <section>
          <h2>Direct Contact Channels</h2>
          <ul>
            <li><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/918810356950">+91-8810356950</a></li>
            <li><strong>Email:</strong> <a href="mailto:hello@getintofeed.com">hello@getintofeed.com</a></li>
            <li><strong>Studio Headquarters:</strong> New Delhi, Delhi, India — 110001</li>
            <li><strong>Operating Hours:</strong> Monday – Friday, 09:00 – 19:00 IST</li>
          </ul>
        </section>
        <section>
          <h2>Schedule an Inquiry</h2>
          <p>Fill out our inbound inquiry form on this page or message us directly on WhatsApp to get started within 24 hours.</p>
        </section>
HTML;
        } elseif ($slug === 'thank-you' || $slug === 'thankyou') {
            $bodyContent = <<<HTML
        <h1>Thank You! Your Growth Consultation Is Scheduled</h1>
        <p class="intro">{$cleanDesc}</p>
        <section>
          <h2>Next Steps in Your Growth Sprint</h2>
          <ol>
            <li><strong>Step 1: Account &amp; Funnel Audit</strong> — We inspect search visibility, ad fatigue, and conversion bottlenecks.</li>
            <li><strong>Step 2: Direct Discovery Call</strong> — A 20-minute strategy call to align on target CAC and KPIs.</li>
            <li><strong>Step 3: Agile Execution Plan</strong> — Defined sprint milestones with zero locked-in retainers.</li>
          </ol>
        </section>
        <section>
          <h2>Urgent Inquiries</h2>
          <p>Need urgent assistance? <a href="https://wa.me/918810356950">Chat with our strategy lead on WhatsApp (+91-8810356950)</a></p>
        </section>
HTML;
        } else {
            $pageHeading = htmlspecialchars($page?->title ?: ucfirst(str_replace('-', ' ', $slug)), ENT_QUOTES, 'UTF-8');
            $bodyContent = <<<HTML
        <h1>{$pageHeading}</h1>
        <p>{$cleanDesc}</p>
HTML;
        }

        return <<<HTML
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/case-studies">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <span>{$cleanTitle}</span>
        </nav>
        {$bodyContent}
      </main>
      <footer>
        <nav aria-label="Legal Navigation">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
HTML;
    }

    /**
     * 404 fallback HTML.
     */
    protected function buildNotFoundFallbackHtml(): string
    {
        return <<<'HTML'
      <header>
        <nav aria-label="Main Navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/case-studies">Work</a>
          <a href="/pricing">Pricing</a>
          <a href="/about">About Us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <main id="main-content">
        <h1>Page Not Found (404)</h1>
        <p>The requested resource could not be found on GetIntoFeed. Explore our core services and playbooks:</p>
        <ul>
          <li><a href="/">Homepage</a></li>
          <li><a href="/services">Growth Services</a></li>
          <li><a href="/case-studies">Client Case Studies</a></li>
          <li><a href="/pricing">Sprint Pricing</a></li>
          <li><a href="/blog">Growth Insights &amp; Playbooks</a></li>
          <li><a href="/contact">Contact Our Team</a></li>
        </ul>
      </main>
HTML;
    }
}
