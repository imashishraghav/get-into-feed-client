<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'blog_posts';

    protected $attributes = [
        'status' => 'draft',
        'visibility' => 'public',
        'version' => 1,
    ];

    protected $fillable = [
        'uuid',
        'title',
        'slug',
        'excerpt',
        'featured_media_id',
        'featured_image_alt',
        'author_id',
        'author_name',
        'author_role',
        'category',
        'tags',
        'focus_keyphrase',
        'secondary_keyphrases',
        'seo_title',
        'meta_title',
        'meta_description',
        'canonical_url',
        'schema_type',
        'robots_index',
        'robots_follow',
        'faq_items',
        'faq_json',
        'schema_json',
        'og_title',
        'og_description',
        'og_image',
        'seo_score',
        'readability_score',
        'word_count',
        'reading_time',
        'editor_mode',
        'content',
        'content_html',
        'content_json',
        'content_blocks',
        'read_time',
        'is_featured',
        'status',
        'visibility',
        'published_at',
        'scheduled_for',
        'scheduled_at',
        'views_count',
        'version',
    ];

    protected $casts = [
        'tags' => 'array',
        'secondary_keyphrases' => 'array',
        'faq_items' => 'array',
        'faq_json' => 'array',
        'schema_json' => 'array',
        'content_json' => 'array',
        'content_blocks' => 'array',
        'is_featured' => 'boolean',
        'robots_index' => 'boolean',
        'robots_follow' => 'boolean',
        'seo_score' => 'integer',
        'readability_score' => 'integer',
        'word_count' => 'integer',
        'reading_time' => 'integer',
        'published_at' => 'datetime',
        'scheduled_for' => 'datetime',
        'scheduled_at' => 'datetime',
        'views_count' => 'integer',
        'version' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (BlogPost $post): void {
            if (empty($post->uuid)) {
                $post->uuid = (string) Str::uuid();
            }
            if (empty($post->visibility)) {
                $post->visibility = 'public';
            }
            if (empty($post->version) || (int) $post->version < 1) {
                $post->version = 1;
            }
            $post->syncDualArchitectureColumns();
        });

        static::updating(function (BlogPost $post): void {
            $post->syncDualArchitectureColumns(onUpdate: true);
        });
    }

    /**
     * Single source of truth for keeping normalized schema columns synchronized
     * with legacy aliases (content/content_html, seo_title/meta_title,
     * faq_items/faq_json, scheduled_for/scheduled_at).
     */
    public function syncDualArchitectureColumns(bool $onUpdate = false): void
    {
        $pairs = [
            ['canonical' => 'content_html', 'legacy' => 'content'],
            ['canonical' => 'scheduled_at', 'legacy' => 'scheduled_for'],
            ['canonical' => 'meta_title', 'legacy' => 'seo_title'],
            ['canonical' => 'faq_json', 'legacy' => 'faq_items'],
        ];

        foreach ($pairs as ['canonical' => $canonical, 'legacy' => $legacy]) {
            if (! $onUpdate) {
                $canonicalVal = $this->{$canonical};
                $legacyVal = $this->{$legacy};

                if (! empty($canonicalVal) && empty($legacyVal)) {
                    $this->{$legacy} = $canonicalVal;
                } elseif (! empty($legacyVal) && empty($canonicalVal)) {
                    $this->{$canonical} = $legacyVal;
                } elseif (! empty($canonicalVal) && $canonicalVal !== $legacyVal) {
                    $this->{$legacy} = $canonicalVal;
                }

                continue;
            }

            $canonicalDirty = $this->isDirty($canonical);
            $legacyDirty = $this->isDirty($legacy);

            if ($canonicalDirty && ! $legacyDirty) {
                $this->{$legacy} = $this->{$canonical};
            } elseif ($legacyDirty && ! $canonicalDirty) {
                $this->{$canonical} = $this->{$legacy};
            } elseif ($canonicalDirty && $legacyDirty && $this->{$canonical} !== $this->{$legacy}) {
                $this->{$legacy} = $this->{$canonical};
            }
        }
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function scopePubliclyListed(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->where(function (Builder $q): void {
                $q->where('visibility', 'public')->orWhereNull('visibility');
            });
    }

    public function scopeAccessiblePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->where(function (Builder $q): void {
                $q->whereIn('visibility', ['public', 'unlisted'])->orWhereNull('visibility');
            });
    }

    public function scopeWithEditorialRelations(Builder $query): Builder
    {
        return $query->with(['featuredMedia', 'author', 'seo.ogMedia', 'seo.twitterMedia']);
    }

    public function featuredMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_media_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function seo(): MorphOne
    {
        return $this->morphOne(SeoMetadata::class, 'seoble');
    }

    public function revisions(): MorphMany
    {
        return $this->morphMany(Revision::class, 'revisable');
    }

    public function postRevisions(): HasMany
    {
        return $this->hasMany(PostRevision::class, 'blog_post_id')->orderByDesc('revision_number');
    }

    public function autosaves(): HasMany
    {
        return $this->hasMany(PostAutosave::class, 'blog_post_id');
    }

    /**
     * Resolve effective SEO score with safe fallback for legacy posts.
     */
    public function effectiveSeoScore(): int
    {
        if (($this->seo_score ?? 0) > 0) {
            return (int) $this->seo_score;
        }

        $seo = $this->seo;
        if ($seo && ($seo->seo_score ?? 0) > 0) {
            return (int) $seo->seo_score;
        }

        $effectiveTitle = $this->meta_title ?: $this->seo_title;
        if ($seo && ! empty($seo->seo_title) && ! empty($seo->meta_description)) {
            return ! empty($seo->focus_keyword) ? 82 : 68;
        }

        if (! empty($effectiveTitle) && ! empty($this->meta_description)) {
            return ! empty($this->focus_keyphrase) ? 82 : 68;
        }

        return ($seo || ! empty($effectiveTitle) || ! empty($this->meta_description)) ? 45 : 0;
    }
}
