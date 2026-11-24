<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Redirect;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SeoDeliveryService
{
    protected const DEFAULT_TITLE = 'GetIntoFeed | Creative Marketing & Performance Growth Agency';
    protected const DEFAULT_DESC = 'Premier creative performance marketing studio in India. We engineer thumb-stopping video reels, high-converting funnels, and algorithmic paid media for ambitious brands.';
    protected const DEFAULT_IMAGE = 'https://getintofeed.com/agency-hero.png';
    protected const SITE_NAME = 'GetIntoFeed';
    protected const TWITTER_HANDLE = '@getintofeed';

    /**
     * Resolve and render server-side SEO metadata injected into React SPA.
     */
    public function render(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $path = '/' . trim($request->path(), '/');
        if ($path === '//') $path = '/';

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
    protected function checkRedirects(string $path, Request $request): ?\Illuminate\Http\RedirectResponse
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
            return redirect('/case-studies/' . substr($rawPath, 5), 301);
        }

        if (str_starts_with($rawPath, 'feed-notes/')) {
            return redirect('/blog/' . substr($rawPath, 11), 301);
        }

        // Database redirects
        try {
            $dbRedirect = Redirect::where('is_active', true)
                ->where(function ($q) use ($path, $rawPath) {
                    $q->where('source_url', $path)
                      ->orWhere('source_url', '/' . $rawPath)
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
            Log::warning("[SeoDeliveryService] Redirect check skipped: " . $e->getMessage());
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
            return $this->resolveNotFoundMetadata('/services/' . $slug);
        }

        $seo = $service->seo;
        $title = $seo?->seo_title ?: ($service->name . ' — Growth Services | GetIntoFeed');
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
                    ->orWhere('slug', $targetSlug)
                    ->orWhere('slug', 'increase-form-conversions-and-generate-more-leads')
                    ->orWhere('slug', 'how-to-increase-form-conversions-generate-more-leads');
            })
            ->where('status', 'published')
            ->with(['seo.ogMedia', 'seo.twitterMedia', 'featuredMedia'])
            ->first();

        if (! $blog) {
            return $this->resolveNotFoundMetadata('/blog/' . $slug);
        }

        $seo = $blog->seo;
        $title = $seo?->seo_title ?: ($blog->title . ' — Feed Notes | GetIntoFeed');
        $rawDesc = $seo?->meta_description ?: ($blog->summary ?: $blog->content);
        $desc = $this->formatMetaDescription($rawDesc, 155);
        $canonical = $seo?->canonical_url ?: "https://getintofeed.com/blog/{$slug}";

        $imageUrl = $this->resolveImageUrl([
            $seo?->ogMedia?->url,
            $blog->featuredMedia?->url,
        ]);

        $robots = $this->resolveRobotsDirectives($seo);
        $publishedAt = $blog->published_at ? date('c', strtotime($blog->published_at)) : date('c');
        $modifiedAt = $blog->updated_at ? date('c', strtotime($blog->updated_at)) : $publishedAt;

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
            'article_published_time' => $publishedAt,
            'article_modified_time' => $modifiedAt,
            'article_author' => $blog->author_name ?: 'GetIntoFeed Growth Team',
            'article_section' => $blog->category ?: 'Performance Marketing',
            'twitter_title' => $seo?->twitter_title ?: $title,
            'twitter_description' => $seo?->twitter_description ?: $desc,
            'twitter_image' => $this->resolveImageUrl([$seo?->twitterMedia?->url, $imageUrl]),
            'json_ld' => [
                '@context' => 'https://schema.org',
                '@type' => 'BlogPosting',
                'headline' => $blog->title,
                'description' => $desc,
                'image' => [$imageUrl],
                'datePublished' => $publishedAt,
                'dateModified' => $modifiedAt,
                'author' => [
                    '@type' => 'Person',
                    'name' => $blog->author_name ?: 'GetIntoFeed Collective',
                    'jobTitle' => $blog->author_role ?: 'Growth Strategist',
                ],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => self::SITE_NAME,
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => 'https://getintofeed.com/favicon.svg',
                    ],
                ],
                'mainEntityOfPage' => [
                    '@type' => 'WebPage',
                    '@id' => $canonical,
                ],
                'breadcrumb' => $this->buildBreadcrumbs([
                    ['name' => 'Home', 'url' => 'https://getintofeed.com/'],
                    ['name' => 'Blog', 'url' => 'https://getintofeed.com/blog'],
                    ['name' => $blog->title, 'url' => $canonical],
                ]),
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
            return $this->resolveNotFoundMetadata('/case-studies/' . $slug);
        }

        $seo = $case->seo;
        $title = $seo?->seo_title ?: ($case->project_name . ' (' . $case->client_name . ') — Case Study | GetIntoFeed');
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
            $title = $seo?->seo_title ?: ($page->title . ' — GetIntoFeed');
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
        ];

        if (isset($staticPages[$slug])) {
            $info = $staticPages[$slug];
            $canonical = "https://getintofeed.com/{$slug}";

            return [
                'status_code' => 200,
                'title' => $info['title'],
                'description' => $info['description'],
                'canonical' => $canonical,
                'robots' => 'index, follow',
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
        return $this->resolveNotFoundMetadata('/' . $slug);
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
            if (empty($url)) continue;

            $url = trim($url);
            if (str_starts_with($url, 'https://')) {
                return $url;
            }
            if (str_starts_with($url, 'http://')) {
                return 'https://' . substr($url, 7);
            }
            if (str_starts_with($url, '//')) {
                return 'https:' . $url;
            }
            return 'https://getintofeed.com/' . ltrim($url, '/');
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
            return 'index, follow';
        }

        $index = ($seo->robots_index ?? true) ? 'index' : 'noindex';
        $follow = ($seo->robots_follow ?? true) ? 'follow' : 'nofollow';

        return "{$index}, {$follow}";
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
     * Inject dynamic metadata tags into HTML template.
     */
    public function injectMetadata(string $html, array $data): string
    {
        $title = htmlspecialchars($data['title'] ?? self::DEFAULT_TITLE, ENT_QUOTES, 'UTF-8');
        $desc = htmlspecialchars($data['description'] ?? self::DEFAULT_DESC, ENT_QUOTES, 'UTF-8');
        $canonical = htmlspecialchars($data['canonical'] ?? 'https://getintofeed.com/', ENT_QUOTES, 'UTF-8');
        $robots = htmlspecialchars($data['robots'] ?? 'index, follow', ENT_QUOTES, 'UTF-8');
        $ogType = htmlspecialchars($data['og_type'] ?? 'website', ENT_QUOTES, 'UTF-8');
        $ogTitle = htmlspecialchars($data['og_title'] ?? $data['title'] ?? self::DEFAULT_TITLE, ENT_QUOTES, 'UTF-8');
        $ogDesc = htmlspecialchars($data['og_description'] ?? $data['description'] ?? self::DEFAULT_DESC, ENT_QUOTES, 'UTF-8');
        $ogImage = htmlspecialchars($data['og_image'] ?? self::DEFAULT_IMAGE, ENT_QUOTES, 'UTF-8');
        $twTitle = htmlspecialchars($data['twitter_title'] ?? $ogTitle, ENT_QUOTES, 'UTF-8');
        $twDesc = htmlspecialchars($data['twitter_description'] ?? $ogDesc, ENT_QUOTES, 'UTF-8');
        $twImage = htmlspecialchars($data['twitter_image'] ?? $ogImage, ENT_QUOTES, 'UTF-8');

        // Replace Title
        $html = preg_replace('/<title>.*?<\/title>/is', "<title>{$title}</title>", $html, 1);

        // Replace Meta Description
        $html = preg_replace('/<meta name="description" content=".*?"\s*\/?>/is', "<meta name=\"description\" content=\"{$desc}\" />", $html, 1);

        // Replace Canonical
        $html = preg_replace('/<link rel="canonical" href=".*?"(?:\s+id="canonical-tag")?\s*\/?>/is', "<link rel=\"canonical\" href=\"{$canonical}\" id=\"canonical-tag\" />", $html, 1);

        // Replace Robots
        $html = preg_replace('/<meta name="robots" content=".*?"\s*\/?>/is', "<meta name=\"robots\" content=\"{$robots}\" />", $html, 1);

        // Replace Open Graph
        $html = preg_replace('/<meta property="og:type" content=".*?"\s*\/?>/is', "<meta property=\"og:type\" content=\"{$ogType}\" />", $html, 1);
        $html = preg_replace('/<meta property="og:title" content=".*?"(?:\s+id="og-title")?\s*\/?>/is', "<meta property=\"og:title\" content=\"{$ogTitle}\" id=\"og-title\" />", $html, 1);
        $html = preg_replace('/<meta property="og:description" content=".*?"(?:\s+id="og-desc")?\s*\/?>/is', "<meta property=\"og:description\" content=\"{$ogDesc}\" id=\"og-desc\" />", $html, 1);
        $html = preg_replace('/<meta property="og:url" content=".*?"(?:\s+id="og-url")?\s*\/?>/is', "<meta property=\"og:url\" content=\"{$canonical}\" id=\"og-url\" />", $html, 1);
        $html = preg_replace('/<meta property="og:image" content=".*?"(?:\s+id="og-image")?\s*\/?>/is', "<meta property=\"og:image\" content=\"{$ogImage}\" id=\"og-image\" />", $html, 1);

        // Replace Twitter Cards
        $html = preg_replace('/<meta name="twitter:title" content=".*?"(?:\s+id="tw-title")?\s*\/?>/is', "<meta name=\"twitter:title\" content=\"{$twTitle}\" id=\"tw-title\" />", $html, 1);
        $html = preg_replace('/<meta name="twitter:description" content=".*?"(?:\s+id="tw-desc")?\s*\/?>/is', "<meta name=\"twitter:description\" content=\"{$twDesc}\" id=\"tw-desc\" />", $html, 1);
        $html = preg_replace('/<meta name="twitter:image" content=".*?"\s*\/?>/is', "<meta name=\"twitter:image\" content=\"{$twImage}\" />", $html, 1);

        // Replace or Append Article Metadata if present
        if (!empty($data['article_published_time'])) {
            $articleMeta = "\n    <meta property=\"article:published_time\" content=\"" . htmlspecialchars($data['article_published_time'], ENT_QUOTES, 'UTF-8') . "\" />"
                         . "\n    <meta property=\"article:modified_time\" content=\"" . htmlspecialchars($data['article_modified_time'], ENT_QUOTES, 'UTF-8') . "\" />"
                         . "\n    <meta property=\"article:author\" content=\"" . htmlspecialchars($data['article_author'] ?? 'GetIntoFeed', ENT_QUOTES, 'UTF-8') . "\" />"
                         . "\n    <meta property=\"article:section\" content=\"" . htmlspecialchars($data['article_section'] ?? 'Marketing', ENT_QUOTES, 'UTF-8') . "\" />";
            $html = str_replace('</head>', "{$articleMeta}\n  </head>", $html);
        }

        // Replace JSON-LD
        if (!empty($data['json_ld'])) {
            $jsonString = json_encode($data['json_ld'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            // Replace existing application/ld+json script if present, otherwise append before </head>
            if (preg_match('/<script type="application\/ld\+json">.*?<\/script>/is', $html)) {
                $html = preg_replace('/<script type="application\/ld\+json">.*?<\/script>/is', "<script type=\"application/ld+json\">\n{$jsonString}\n    </script>", $html, 1);
            } else {
                $html = str_replace('</head>', "    <script type=\"application/ld+json\">\n{$jsonString}\n    </script>\n  </head>", $html);
            }
        }

        // Inject Route-Specific Server-Rendered Semantic Body HTML directly into #root
        if (!empty($data['fallback_html'])) {
            $ssrBlock = '<div id="root">' . "\n" . $data['fallback_html'] . "\n    </div>";
            if (str_contains($html, '<div id="root"><!-- SSR_CONTENT_INJECTION --></div>')) {
                $html = str_replace('<div id="root"><!-- SSR_CONTENT_INJECTION --></div>', $ssrBlock, $html);
            } elseif (str_contains($html, '<div id="root"></div>')) {
                $html = str_replace('<div id="root"></div>', $ssrBlock, $html);
            } else {
                $html = preg_replace('/<div id="root">.*?<\/div>/is', $ssrBlock, $html, 1);
            }
        }

        return $html;
    }

    /**
     * Homepage fallback HTML.
     */
    protected function buildHomepageFallbackHtml(): string
    {
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
        if (!empty($features)) {
            $featuresHtml .= '<ul>';
            foreach ($features as $f) {
                $featureTitle = htmlspecialchars(is_array($f) ? ($f['title'] ?? $f['name'] ?? '') : (string)$f, ENT_QUOTES, 'UTF-8');
                $featureDesc = is_array($f) && !empty($f['description']) ? ' — ' . htmlspecialchars($f['description'], ENT_QUOTES, 'UTF-8') : '';
                if (!empty($featureTitle)) {
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
            $bSummary = htmlspecialchars($b->summary ?: '', ENT_QUOTES, 'UTF-8');
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
