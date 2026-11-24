<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SeoMetadata;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        $search = trim((string) ($request->query('search') ?: $request->query('q')));
        $isDefault = empty($category) && empty($search) && ! $request->has('page');

        if ($isDefault) {
            $cached = Cache::remember('api_services_public_list', 300, function () use ($request) {
                return $this->fetchServices($request);
            });

            return response()->json($cached);
        }

        return response()->json($this->fetchServices($request));
    }

    protected function fetchServices(Request $request): array
    {
        $query = Service::with(['heroMedia', 'seo'])
            ->where('status', 'published')
            ->orderBy('sort_order', 'asc');

        $category = $request->query('category');
        if (! empty($category) && $category !== 'All Services' && $category !== 'all') {
            if ($category === 'Paid Ads' || $category === 'Paid Media') {
                $query->where(function ($q) {
                    $q->where('category', 'like', '%Paid%')
                        ->orWhere('category', 'like', '%Performance%')
                        ->orWhere('category', 'like', '%Ad%');
                });
            } elseif ($category === 'SEO & Search' || $category === 'SEO') {
                $query->where(function ($q) {
                    $q->where('category', 'like', '%SEO%')
                        ->orWhere('category', 'like', '%Search%');
                });
            } elseif ($category === 'Web & CRO' || $category === 'Web') {
                $query->where(function ($q) {
                    $q->where('category', 'like', '%Web%')
                        ->orWhere('category', 'like', '%CRO%');
                });
            } elseif ($category === 'Creative & Reels' || $category === 'Video') {
                $query->where(function ($q) {
                    $q->where('category', 'like', '%Creative%')
                        ->orWhere('category', 'like', '%Video%')
                        ->orWhere('category', 'like', '%Reel%');
                });
            } elseif ($category === 'Social & Influencer' || $category === 'Social') {
                $query->where(function ($q) {
                    $q->where('category', 'like', '%Social%')
                        ->orWhere('category', 'like', '%Influencer%');
                });
            } else {
                $query->where('category', $category);
            }
        }

        $search = trim((string) ($request->query('search') ?: $request->query('q')));
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('overview', 'like', "%{$search}%")
                    ->orWhere('hero_heading', 'like', "%{$search}%")
                    ->orWhere('hero_description', 'like', "%{$search}%")
                    ->orWhere('problem_summary', 'like', "%{$search}%")
                    ->orWhere('problem_heading', 'like', "%{$search}%");
            });
        }

        $total = $query->count();
        $perPage = max(1, min(50, (int) ($request->query('per_page') ?: $request->query('limit', 12))));
        if ($request->has('page')) {
            $page = max(1, (int) $request->query('page', 1));
            $rawServices = $query->forPage($page, $perPage)->get();
        } else {
            $rawServices = $query->get();
        }

        $services = $rawServices->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'title' => $s->name, // Compatibility alias
                'slug' => $s->slug,
                'category' => $s->category,
                'short_description' => $s->short_description,
                'shortDesc' => $s->short_description, // Compatibility alias
                'pricing_tier' => $s->pricing_tier,
                'pricingTier' => $s->pricing_tier, // Compatibility alias
                'timeline' => $s->timeline,
                'icon' => $s->icon_name,
                'hero_badge' => $s->hero_badge,
                'focus_metric' => $s->focus_metric,
                'overview' => $s->overview,
                'editor_mode' => $s->editor_mode ?? 'classic',
                'content' => $s->content,
                'content_blocks' => $s->content_blocks,
                'hero_heading' => $s->hero_heading,
                'hero_description' => $s->hero_description,
                'hero_image' => $s->heroMedia?->url,
                'deliverables' => $s->deliverables ?? [],
                'included_disclaimer' => $s->included_disclaimer,
                'what_we_do' => $s->what_we_do ?? [],
                'process_steps' => $s->process_steps ?? [],
                'faqs' => $s->faqs ?? [],
                'problem_tag' => $s->problem_tag,
                'problem_heading' => $s->problem_heading,
                'problem_summary' => $s->problem_summary,
                'how_deal_heading' => $s->how_deal_heading,
                'how_deal_content' => $s->how_deal_content,
                'who_for_heading' => $s->who_for_heading,
                'who_for_desc' => $s->who_for_desc,
                'locations' => $s->locations ?? [],
                'issues' => $s->issues ?? [],
                'sidebar_heading' => $s->sidebar_heading,
                'sidebar_desc' => $s->sidebar_desc,
                'sidebar_checks' => $s->sidebar_checks ?? [],
                'backlinks' => $s->backlinks ?? [],
                'sort_order' => $s->sort_order,
                'seo' => $s->seo,
            ];
        });

        return [
            'success' => true,
            'count' => $services->count(),
            'services' => $services,
        ];
    }

    public function show(string $slug): JsonResponse
    {
        $aliases = [
            'google-ads' => 'google-ads-services-delhi-ncr',
            'meta-ads' => 'meta-ads-services-delhi-ncr',
            'seo' => 'seo-services-delhi-ncr',
            'social-media' => 'social-media-marketing-delhi-ncr',
            'social-media-marketing' => 'social-media-marketing-delhi-ncr',
            'website-design' => 'website-design-delhi-ncr',
            'web-design' => 'website-design-delhi-ncr',
            'content-marketing' => 'content-creative-services-delhi-ncr',
            'content-creative' => 'content-creative-services-delhi-ncr',
            'reels' => 'reels-video-editing-delhi-ncr',
            'reels-video-editing' => 'reels-video-editing-delhi-ncr',
            'reels-video' => 'reels-video-editing-delhi-ncr',
            'graphic-design' => 'graphic-design-services-delhi-ncr',
        ];
        $targetSlug = $aliases[$slug] ?? $slug;

        $service = Service::with(['heroMedia', 'caseStudies.heroMedia', 'seo.ogMedia', 'seo.twitterMedia'])
            ->where(function ($q) use ($slug, $targetSlug) {
                $q->where('slug', $targetSlug)
                    ->orWhere('slug', $slug)
                    ->orWhere('slug', str_replace('-services-delhi-ncr', '', $slug))
                    ->orWhere('slug', $slug.'-services-delhi-ncr');
            })
            ->where('status', 'published')
            ->first();

        if (! $service) {
            return response()->json([
                'success' => false,
                'error' => 'Service not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'title' => $service->name,
                'slug' => $service->slug,
                'category' => $service->category,
                'short_description' => $service->short_description,
                'pricing_tier' => $service->pricing_tier,
                'timeline' => $service->timeline,
                'icon' => $service->icon_name,
                'hero_badge' => $service->hero_badge,
                'focus_metric' => $service->focus_metric,
                'overview' => $service->overview,
                'editor_mode' => $service->editor_mode ?? 'classic',
                'content' => $service->content,
                'content_blocks' => $service->content_blocks,
                'what_we_do' => $service->what_we_do ?? [],
                'deliverables' => $service->deliverables ?? [],
                'included_disclaimer' => $service->included_disclaimer,
                'process_steps' => $service->process_steps ?? [],
                'faqs' => $service->faqs ?? [],
                'problem_tag' => $service->problem_tag,
                'problem_heading' => $service->problem_heading,
                'problem_summary' => $service->problem_summary,
                'how_deal_heading' => $service->how_deal_heading,
                'how_deal_content' => $service->how_deal_content,
                'who_for_heading' => $service->who_for_heading,
                'who_for_desc' => $service->who_for_desc,
                'locations' => $service->locations ?? [],
                'issues' => $service->issues ?? [],
                'sidebar_heading' => $service->sidebar_heading,
                'sidebar_desc' => $service->sidebar_desc,
                'sidebar_checks' => $service->sidebar_checks ?? [],
                'backlinks' => $service->backlinks ?? [],
                'hero_heading' => $service->hero_heading,
                'hero_description' => $service->hero_description,
                'hero_image' => $service->heroMedia?->url,
                'cta_label' => $service->cta_label,
                'cta_url' => $service->cta_url,
                'case_studies' => $service->caseStudies,
                'seo' => $this->seoPayload($service->seo, $service->name, $service->heroMedia?->url),
            ],
        ]);
    }

    private function seoPayload(?SeoMetadata $seo, string $fallbackTitle, ?string $fallbackImage): array
    {
        return [
            'seo_title' => $seo?->seo_title ?? $fallbackTitle,
            'meta_description' => $seo?->meta_description,
            'focus_keyword' => $seo?->focus_keyword,
            'target_keywords' => $seo?->target_keywords ?? [],
            'canonical_url' => $seo?->canonical_url,
            'backlinks' => $seo?->backlinks ?? [],
            'seo_score' => $seo?->seo_score ?? 92,
            'robots_index' => $seo?->robots_index ?? true,
            'robots_follow' => $seo?->robots_follow ?? true,
            'og_title' => $seo?->og_title,
            'og_description' => $seo?->og_description,
            'og_image' => $seo?->ogMedia?->url ?? $fallbackImage,
            'twitter_title' => $seo?->twitter_title,
            'twitter_description' => $seo?->twitter_description,
            'twitter_image' => $seo?->twitterMedia?->url,
            'schema_type' => $seo?->schema_type,
            'custom_schema_json' => $seo?->custom_schema_json,
        ];
    }
}
