<?php

namespace App\Http\Resources;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Media */
class MediaResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->file_name,
            'file_name' => $this->file_name,
            'url' => $this->url,
            'webp_url' => $this->webp_url,
            'variants' => $this->variant_urls,
            'srcset' => $this->srcset,
            'alt' => $this->alt_text ?: $this->file_name,
            'alt_text' => $this->alt_text,
            'title' => $this->title,
            'caption' => $this->caption,
            'mime_type' => $this->mime_type,
            'file_size' => $this->file_size,
            'size' => $this->formatted_size,
            'optimized_size' => $this->optimized_size,
            'width' => $this->width,
            'height' => $this->height,
            'dimensions' => $this->dimensions,
            'exif_stripped_at' => $this->exif_stripped_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
