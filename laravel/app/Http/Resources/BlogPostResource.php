<?php

namespace App\Http\Resources;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BlogPost */
class BlogPostResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'status' => $this->status,
            'visibility' => $this->visibility ?? 'public',
            'version' => (int) ($this->version ?: 1),
            'content_html' => $this->content_html ?? $this->content,
            'content_json' => $this->content_json,
            'content' => $this->content ?? $this->content_html,
            'editor_mode' => $this->editor_mode ?? 'tiptap',
            'category' => $this->category,
            'tags' => $this->tags ?? [],
            'featured_media_id' => $this->featured_media_id,
            'featured_image_alt' => $this->featured_image_alt ?: $this->featuredMedia?->alt_text,
            'featured_media' => new MediaResource($this->whenLoaded('featuredMedia')),
            'reading_time' => $this->reading_time,
            'word_count' => $this->word_count,
            'read_time' => $this->read_time,
            'readability_score' => $this->readability_score,
            'seo_score' => $this->effectiveSeoScore(),
            'meta_title' => $this->meta_title ?? $this->seo_title,
            'seo_title' => $this->seo_title ?? $this->meta_title,
            'meta_description' => $this->meta_description,
            'canonical_url' => $this->canonical_url,
            'og_title' => $this->og_title,
            'og_description' => $this->og_description,
            'og_image' => $this->og_image,
            'focus_keyphrase' => $this->focus_keyphrase,
            'secondary_keyphrases' => $this->secondary_keyphrases ?? [],
            'schema_type' => $this->schema_type ?? 'BlogPosting',
            'faq_json' => $this->faq_json ?? ($this->faq_items ?? []),
            'schema_json' => $this->schema_json,
            'robots_index' => (bool) ($this->robots_index ?? true),
            'robots_follow' => (bool) ($this->robots_follow ?? true),
            'is_featured' => (bool) $this->is_featured,
            'published_at' => $this->published_at?->toIso8601String(),
            'scheduled_at' => ($this->scheduled_at ?? $this->scheduled_for)?->toIso8601String(),
            'author' => $this->whenLoaded('author', fn () => $this->author ? [
                'id' => $this->author->id,
                'name' => $this->author->name,
                'role' => $this->author->role,
            ] : [
                'id' => $this->author_id,
                'name' => $this->author_name,
                'role' => $this->author_role,
            ]),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'deleted_at' => $this->deleted_at?->toIso8601String(),
        ];
    }
}
