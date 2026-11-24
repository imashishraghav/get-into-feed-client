<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Media;
use App\Models\Page;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        return $this->respondForSlug($slug, true);
    }

    public function preview(string $slug): JsonResponse
    {
        abort_unless(
            auth()->user()?->hasCmsPermission('pages.view') || auth()->user()?->hasCmsPermission('pages.manage'),
            403
        );

        return $this->respondForSlug($slug, false);
    }

    private function respondForSlug(string $slug, bool $publishedOnly): JsonResponse
    {
        $query = Page::with(['featuredMedia', 'seo.ogMedia', 'seo.twitterMedia'])
            ->where('slug', $slug);

        if ($publishedOnly) {
            $query->where('status', 'published');
        }

        $page = $query->first();

        if (! $page) {
            return response()->json([
                'status' => 'error',
                'message' => "Page '{$slug}' not found",
            ], 404);
        }

        $blocks = collect($page->content_blocks ?? [])->map(function (array $block) use ($page): array {
            $data = $block['data'] ?? [];
            $mediaIds = array_filter(array_merge(
                isset($data['media_id']) ? [$data['media_id']] : [],
                isset($data['avatar_media_id']) ? [$data['avatar_media_id']] : [],
                is_array($data['media_ids'] ?? null) ? $data['media_ids'] : [],
                is_array($data['cards'] ?? null) ? collect($data['cards'])->pluck('media_id')->all() : []
            ));
            $media = Media::whereIn('id', $mediaIds)->get()->keyBy('id');

            if (isset($data['media_id']) && $media->has($data['media_id'])) {
                $selectedMedia = $media->get($data['media_id']);
                $data['media_url'] = $selectedMedia->url;
                $data['media_alt'] = $data['alt_override'] ?? $selectedMedia->alt_text;
            }

            if (isset($data['cards']) && is_array($data['cards'])) {
                $data['cards'] = array_map(function (array $card) use ($media): array {
                    if (isset($card['media_id']) && $media->has($card['media_id'])) {
                        $card['media_url'] = $media->get($card['media_id'])->url;
                    }

                    return $card;
                }, $data['cards']);
            }

            if (isset($data['avatar_media_id']) && $media->has($data['avatar_media_id'])) {
                $data['avatar_url'] = $media->get($data['avatar_media_id'])->url;
            }

            if (($block['type'] ?? null) === 'hero' && empty($data['media_url']) && $page->featuredMedia) {
                $data['media_url'] = $page->featuredMedia->url;
                $data['media_alt'] = $page->featuredMedia->alt_text;
            }

            if (isset($data['media_ids']) && is_array($data['media_ids'])) {
                $data['media_items'] = collect($data['media_ids'])
                    ->map(fn ($id) => $media->get($id))
                    ->filter()
                    ->map(fn ($item) => ['url' => $item->url, 'alt' => $item->alt_text, 'caption' => $item->caption])
                    ->values();
            }

            if (! empty($data['selected_faq_ids'])) {
                $data['items'] = Faq::whereIn('id', $data['selected_faq_ids'])
                    ->where('status', 'published')
                    ->orderBy('sort_order')
                    ->get(['question', 'answer']);
            }

            if (! empty($data['selected_testimonial_ids'])) {
                $data['items'] = Testimonial::with('avatar')
                    ->whereIn('id', $data['selected_testimonial_ids'])
                    ->where('status', 'published')
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn ($item) => [
                        'quote' => $item->quote,
                        'author' => $item->client_name,
                        'role' => $item->client_role,
                        'company' => $item->company,
                        'avatar_url' => $item->avatar?->url,
                    ]);
            }

            return [...$block, 'data' => $data];
        })->values();

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'template' => $page->template,
                'editor_mode' => $page->editor_mode ?? 'classic',
                'content' => $page->content,
                'content_blocks' => $blocks,
                'featured_image' => $page->featuredMedia?->url,
                'seo' => [
                    'title' => $page->seo?->seo_title ?? $page->title,
                    'description' => $page->seo?->meta_description,
                    'canonical' => $page->seo?->canonical_url,
                    'og_image' => $page->seo?->ogMedia?->url ?? $page->featuredMedia?->url,
                    'og_title' => $page->seo?->og_title,
                    'og_description' => $page->seo?->og_description,
                    'twitter_title' => $page->seo?->twitter_title,
                    'twitter_description' => $page->seo?->twitter_description,
                    'twitter_image' => $page->seo?->twitterMedia?->url,
                    'robots_index' => $page->seo?->robots_index ?? true,
                    'robots_follow' => $page->seo?->robots_follow ?? true,
                    'schema_type' => $page->seo?->schema_type,
                    'custom_schema' => $page->seo?->custom_schema_json,
                ],
                'published_at' => $page->published_at?->toIso8601String(),
            ],
        ]);
    }
}
