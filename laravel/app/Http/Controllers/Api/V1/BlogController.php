<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\SeoMetadata;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        $search = trim((string) ($request->query('search') ?: $request->query('q')));
        $isDefault = empty($category) && empty($search) && ! $request->has('page');

        if ($isDefault) {
            $cached = Cache::remember('api_blog_public_list', 300, function () use ($request) {
                return $this->fetchPosts($request);
            });

            return response()->json($cached);
        }

        return response()->json($this->fetchPosts($request));
    }

    protected function fetchPosts(Request $request): array
    {
        $query = BlogPost::withEditorialRelations()
            ->publiclyListed()
            ->orderBy('published_at', 'desc');

        $category = $request->query('category');
        if (! empty($category) && $category !== 'All Topics' && $category !== 'all') {
            if ($category === 'Lead Gen.' || $category === 'Lead Gen' || $category === 'Lead Generation') {
                $query->where(function ($q) {
                    $q->where('category', 'like', '%Lead%')
                        ->orWhere('category', 'Lead Gen.');
                });
            } elseif ($category === 'Paid Media') {
                $query->where(function ($q) {
                    $q->where('category', 'Paid Media')
                        ->orWhere('category', 'Paid Performance');
                });
            } elseif ($category === 'SEO & Search') {
                $query->where(function ($q) {
                    $q->where('category', 'like', '%SEO%')
                        ->orWhere('category', 'like', '%Search%');
                });
            } elseif ($category === 'Creative Strategy') {
                $query->where('category', 'like', '%Creative%');
            } elseif ($category === 'Web & CRO') {
                $query->where(function ($q) {
                    $q->where('category', 'like', '%Web%')
                        ->orWhere('category', 'like', '%CRO%');
                });
            } else {
                $query->where('category', $category);
            }
        }

        $search = trim((string) ($request->query('search') ?: $request->query('q')));
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        $total = $query->count();
        $perPage = max(1, min(50, (int) ($request->query('per_page') ?: $request->query('limit', 12))));
        if ($request->has('page')) {
            $page = max(1, (int) $request->query('page', 1));
            $rawPosts = $query->forPage($page, $perPage)->get();
        } else {
            $rawPosts = $query->get();
        }

        $posts = $rawPosts->map(function ($b) {
            return [
                'id' => $b->id,
                'uuid' => $b->uuid,
                'title' => $b->title,
                'slug' => $b->slug,
                'excerpt' => $b->excerpt,
                'visibility' => $b->visibility ?? 'public',
                'image' => $b->featuredMedia?->url ?: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1600&auto=format&fit=crop',
                'cover_image' => $b->featuredMedia?->url ?: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1600&auto=format&fit=crop',
                'srcset' => $b->featuredMedia?->srcset,
                'featured_image_alt' => $b->featured_image_alt ?: $b->featuredMedia?->alt_text ?: $b->title,
                'author' => $b->author_name,
                'authorRole' => $b->author_role,
                'category' => $b->category,
                'tags' => $b->tags ?? [],
                'readTime' => $b->read_time,
                'reading_time' => $b->reading_time,
                'word_count' => $b->word_count,
                'readability_score' => $b->readability_score,
                'date' => $b->published_at ? $b->published_at->format('M d, Y') : 'Recent',
                'published_at' => $b->published_at?->toIso8601String(),
                'is_featured' => $b->is_featured,
                'editor_mode' => $b->editor_mode ?? 'classic',
                'content' => $b->content ?? $b->content_html,
                'content_html' => $b->content_html ?? $b->content,
                'content_json' => $b->content_json,
                'content_blocks' => $b->content_blocks,
                'faq_items' => $b->faq_items ?? ($b->faq_json ?? []),
                'faq_json' => $b->faq_json ?? ($b->faq_items ?? []),
                'schema_json' => $b->schema_json,
                'seo' => $this->seoPayload($b, $b->seo, $b->title, $b->featuredMedia?->url),
            ];
        });

        return [
            'success' => true,
            'count' => $posts->count(),
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $request->has('page') ? (int) $request->query('page', 1) : 1,
            'last_page' => max(1, (int) ceil($total / $perPage)),
            'posts' => $posts, // Compatibility key consumed by App.jsx
            'articles' => $posts,
        ];
    }

    public function show(string $slug): JsonResponse
    {
        $aliases = [
            'how-to-increase-form-conversions-generate-more-leads-in-2027' => 'how-to-increase-form-conversions-generate-more-leads',
            'form-conversions-2027' => 'how-to-increase-form-conversions-generate-more-leads',
            '7-ways-to-increase-form-field-conversion-rate' => 'how-to-increase-form-conversions-generate-more-leads',
            'ways-to-increase-form-field-conversion-rate' => 'how-to-increase-form-conversions-generate-more-leads',
            'form-field-conversion-rate' => 'how-to-increase-form-conversions-generate-more-leads',
            'increase-form-field-conversion-rate' => 'how-to-increase-form-conversions-generate-more-leads',
            'how-to-increase-form-conversions' => 'how-to-increase-form-conversions-generate-more-leads',
            'increase-form-conversions' => 'how-to-increase-form-conversions-generate-more-leads',
        ];
        $targetSlug = $aliases[$slug] ?? $slug;

        $b = BlogPost::withEditorialRelations()
            ->where(function ($q) use ($slug, $targetSlug) {
                $q->where('slug', $slug)->orWhere('slug', $targetSlug);
            })
            ->accessiblePublished()
            ->first();

        if (! $b) {
            return response()->json([
                'success' => false,
                'error' => 'Article not found',
            ], 404);
        }

        $data = [
            'id' => $b->id,
            'uuid' => $b->uuid,
            'title' => $b->title,
            'slug' => $b->slug,
            'excerpt' => $b->excerpt,
            'visibility' => $b->visibility ?? 'public',
            'image' => $b->featuredMedia?->url ?: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1600&auto=format&fit=crop',
            'cover_image' => $b->featuredMedia?->url ?: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1600&auto=format&fit=crop',
            'srcset' => $b->featuredMedia?->srcset,
            'featured_image_alt' => $b->featured_image_alt ?: $b->featuredMedia?->alt_text ?: $b->title,
            'author' => $b->author_name,
            'authorRole' => $b->author_role,
            'category' => $b->category,
            'tags' => $b->tags ?? [],
            'readTime' => $b->read_time,
            'reading_time' => $b->reading_time,
            'word_count' => $b->word_count,
            'readability_score' => $b->readability_score,
            'date' => $b->published_at ? $b->published_at->format('M d, Y') : 'Recent',
            'published_at' => $b->published_at?->toIso8601String(),
            'editor_mode' => $b->editor_mode ?? 'classic',
            'content' => $b->content ?? $b->content_html,
            'content_html' => $b->content_html ?? $b->content,
            'content_json' => $b->content_json,
            'content_blocks' => $b->content_blocks,
            'faq_items' => $b->faq_items ?? ($b->faq_json ?? []),
            'faq_json' => $b->faq_json ?? ($b->faq_items ?? []),
            'schema_json' => $b->schema_json,
            'views_count' => $b->views_count,
            'seo' => $this->seoPayload($b, $b->seo, $b->title, $b->featuredMedia?->url),
        ];

        return response()->json([
            'success' => true,
            'post' => $data,
            'article' => $data,
        ]);
    }

    public function engagement(string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)->where('status', 'published')->firstOrFail();

        return response()->json([
            'success' => true,
            'likes' => null,
            'views' => $post->views_count,
            'comments' => [],
        ]);
    }

    public function like(string $slug): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Article reactions are not enabled.',
        ], 501);
    }

    public function comment(Request $request, string $slug): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Article comments are not enabled.',
        ], 501);
    }

    private function seoPayload(BlogPost $post, ?SeoMetadata $seo, string $fallbackTitle, ?string $fallbackImage): array
    {
        return [
            'seo_title' => $post->seo_title ?: ($seo?->seo_title ?? $fallbackTitle),
            'meta_description' => $post->meta_description ?: $seo?->meta_description,
            'focus_keyphrase' => $post->focus_keyphrase ?: $seo?->focus_keyword,
            'secondary_keyphrases' => $post->secondary_keyphrases ?? ($seo?->target_keywords ?? []),
            'canonical_url' => $post->canonical_url ?: $seo?->canonical_url,
            'robots_index' => $post->robots_index !== null ? (bool) $post->robots_index : ($seo?->robots_index ?? true),
            'robots_follow' => $post->robots_follow !== null ? (bool) $post->robots_follow : ($seo?->robots_follow ?? true),
            'og_title' => $post->og_title ?: $seo?->og_title,
            'og_description' => $post->og_description ?: $seo?->og_description,
            'og_image' => $seo?->ogMedia?->url ?? $fallbackImage,
            'twitter_title' => $seo?->twitter_title ?: ($post->og_title ?: $seo?->og_title),
            'twitter_description' => $seo?->twitter_description ?: ($post->og_description ?: $seo?->og_description),
            'twitter_image' => $seo?->twitterMedia?->url ?? ($seo?->ogMedia?->url ?? $fallbackImage),
            'schema_type' => $post->schema_type ?: ($seo?->schema_type ?? 'BlogPosting'),
            'faq_items' => $post->faq_items ?? [],
            'seo_score' => $post->effectiveSeoScore(),
            'custom_schema_json' => $seo?->custom_schema_json,
        ];
    }
}
