<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'media';

    protected $fillable = [
        'folder_id',
        'disk',
        'file_name',
        'file_path',
        'file_size',
        'file_hash',
        'mime_type',
        'width',
        'height',
        'title',
        'alt_text',
        'caption',
        'description',
        'webp_path',
        'avif_path',
        'variants',
        'optimized_size',
        'exif_stripped_at',
        'uploaded_by_user_id',
    ];

    protected $casts = [
        'variants' => 'array',
        'exif_stripped_at' => 'datetime',
        'file_size' => 'integer',
        'optimized_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    protected $appends = ['url', 'formatted_size', 'dimensions', 'webp_url'];

    protected static function booted(): void
    {
        static::deleting(function (Media $media): void {
            // Unlink any content referencing this media asset to prevent broken queries
            try {
                Service::where('hero_media_id', $media->id)->update(['hero_media_id' => null]);
                CaseStudy::where('hero_media_id', $media->id)->update(['hero_media_id' => null]);
                BlogPost::where('featured_media_id', $media->id)->update(['featured_media_id' => null]);
                if (class_exists(TeamMember::class)) {
                    TeamMember::where('avatar_media_id', $media->id)->update(['avatar_media_id' => null]);
                }
                if (class_exists(Testimonial::class)) {
                    Testimonial::where('avatar_media_id', $media->id)->update(['avatar_media_id' => null]);
                }
                if (class_exists(Award::class)) {
                    Award::where('badge_media_id', $media->id)->update(['badge_media_id' => null]);
                }
                if (class_exists(Page::class)) {
                    Page::where('featured_media_id', $media->id)->update(['featured_media_id' => null]);
                }
                if (class_exists(SeoMetadata::class)) {
                    SeoMetadata::where('og_media_id', $media->id)->orWhere('twitter_media_id', $media->id)->update(['og_media_id' => null, 'twitter_media_id' => null]);
                }
            } catch (\Throwable $e) {
            }

            // Cleanup storage files if force deleted
            try {
                $disk = Storage::disk($media->disk ?: 'public');
                if ($media->file_path && $disk->exists($media->file_path)) {
                    $disk->delete($media->file_path);
                }
                if ($media->webp_path && $disk->exists($media->webp_path)) {
                    $disk->delete($media->webp_path);
                }
                if ($media->avif_path && $disk->exists($media->avif_path)) {
                    $disk->delete($media->avif_path);
                }
                if (is_array($media->variants)) {
                    foreach ($media->variants as $variant) {
                        $variantPath = $variant['path'] ?? null;
                        if ($variantPath && $disk->exists($variantPath)) {
                            $disk->delete($variantPath);
                        }
                    }
                }
            } catch (\Throwable $e) {
            }
        });
    }

    public function folder()
    {
        return $this->belongsTo(MediaFolder::class, 'folder_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by_user_id');
    }

    public function getUrlAttribute(): string
    {
        if (str_starts_with($this->file_path, 'http://') || str_starts_with($this->file_path, 'https://')) {
            return $this->file_path;
        }

        return Storage::disk($this->disk ?: 'public')->url($this->file_path);
    }

    public function getWebpUrlAttribute(): ?string
    {
        if (! $this->webp_path) {
            return null;
        }

        return Storage::disk($this->disk ?: 'public')->url($this->webp_path);
    }

    /**
     * Build public URL map for responsive WebP image variants.
     *
     * @return array<string, array<string, mixed>>
     */
    public function getVariantUrlsAttribute(): array
    {
        if (! is_array($this->variants)) {
            return [];
        }

        $disk = Storage::disk($this->disk ?: 'public');
        $resolved = [];

        foreach ($this->variants as $key => $variant) {
            $path = $variant['path'] ?? null;
            if (! $path) {
                continue;
            }
            $resolved[$key] = [
                'url' => $disk->url($path),
                'width' => (int) ($variant['width'] ?? 0),
                'height' => (int) ($variant['height'] ?? 0),
                'size' => (int) ($variant['size'] ?? 0),
            ];
        }

        return $resolved;
    }

    public function getSrcsetAttribute(): ?string
    {
        $urls = $this->variant_urls;
        if ($urls === []) {
            return null;
        }

        $parts = [];
        foreach ($urls as $item) {
            if (! empty($item['url']) && ! empty($item['width'])) {
                $parts[] = $item['url'].' '.$item['width'].'w';
            }
        }

        return $parts !== [] ? implode(', ', $parts) : null;
    }

    public function getFormattedSizeAttribute(): string
    {
        $bytes = (int) $this->file_size;
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 1).' MB';
        }
        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 1).' KB';
        }

        return $bytes.' B';
    }

    public function getDimensionsAttribute(): ?string
    {
        if ($this->width && $this->height) {
            return "{$this->width} × {$this->height} px";
        }

        return null;
    }

    public function getSavingsPercentageAttribute(): ?int
    {
        if ($this->file_size && $this->optimized_size && $this->optimized_size < $this->file_size) {
            return (int) round((1 - ($this->optimized_size / $this->file_size)) * 100);
        }

        return null;
    }

    public function getHtmlEmbedAttribute(): string
    {
        $src = e($this->url);
        $alt = e($this->alt_text ?: $this->title ?: $this->file_name);

        return "<img src=\"{$src}\" alt=\"{$alt}\" loading=\"lazy\" />";
    }

    public function getMarkdownEmbedAttribute(): string
    {
        $alt = $this->alt_text ?: $this->title ?: $this->file_name;

        return "![{$alt}]({$this->url})";
    }

    public function getUsages(bool $includeDeepBlockScan = false): array
    {
        $usages = [];
        foreach (Service::where('hero_media_id', $this->id)->pluck('name') as $name) {
            $usages[] = "Service: {$name}";
        }
        foreach (CaseStudy::where('hero_media_id', $this->id)->pluck('client_name') as $name) {
            $usages[] = "Case Study: {$name}";
        }
        foreach (BlogPost::where('featured_media_id', $this->id)->pluck('title') as $title) {
            $usages[] = "Blog: {$title}";
        }
        foreach (TeamMember::where('avatar_media_id', $this->id)->pluck('name') as $name) {
            $usages[] = "Team: {$name}";
        }
        foreach (Testimonial::where('avatar_media_id', $this->id)->pluck('client_name') as $name) {
            $usages[] = "Testimonial: {$name}";
        }
        foreach (Award::where('badge_media_id', $this->id)->pluck('title') as $title) {
            $usages[] = "Award: {$title}";
        }
        foreach (Page::where('featured_media_id', $this->id)->pluck('title') as $title) {
            $usages[] = "Page: {$title}";
        }
        foreach (SeoMetadata::where('og_media_id', $this->id)->orWhere('twitter_media_id', $this->id)->get(['id', 'seoble_type', 'seoble_id']) as $seo) {
            $usages[] = "SEO share image: {$seo->seoble_type} #{$seo->seoble_id}";
        }

        if ($includeDeepBlockScan) {
            // Check content_blocks across Pages, Services, Case Studies
            foreach (Page::whereNotNull('content_blocks')->get(['id', 'title', 'content_blocks']) as $page) {
                foreach ($page->content_blocks ?? [] as $block) {
                    $data = $block['data'] ?? [];
                    if (($data['media_id'] ?? null) == $this->id || ($data['avatar_media_id'] ?? null) == $this->id || in_array($this->id, $data['media_ids'] ?? [], false)) {
                        $usages[] = "Page block: {$page->title}";
                        break;
                    }
                }
            }
            foreach (Service::whereNotNull('content_blocks')->get(['id', 'name', 'content_blocks']) as $svc) {
                foreach ($svc->content_blocks ?? [] as $block) {
                    $data = $block['data'] ?? [];
                    if (($data['media_id'] ?? null) == $this->id || in_array($this->id, $data['media_ids'] ?? [], false)) {
                        $usages[] = "Service block: {$svc->name}";
                        break;
                    }
                }
            }
        }

        return array_unique($usages);
    }
}
