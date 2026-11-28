<?php

namespace App\Http\Resources;

use App\Models\PostRevision;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PostRevision */
class PostRevisionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'revision_number' => $this->revision_number,
            'type' => $this->type,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content_html' => $this->content_html,
            'meta_snapshot' => $this->meta_snapshot ?? [],
            'change_summary' => $this->change_summary,
            'version_at_capture' => $this->version_at_capture,
            'author' => $this->whenLoaded('user', fn () => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
