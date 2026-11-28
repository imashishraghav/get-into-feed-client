<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoMetadata extends Model
{
    use HasFactory;

    protected $table = 'seo_metadata';

    protected $fillable = [
        'seoble_type',
        'seoble_id',
        'seo_title',
        'meta_description',
        'focus_keyword',
        'canonical_url',
        'backlinks',
        'target_keywords',
        'seo_score',
        'robots_index',
        'robots_follow',
        'og_title',
        'og_description',
        'og_media_id',
        'twitter_title',
        'twitter_description',
        'twitter_media_id',
        'schema_type',
        'custom_schema_json',
        'in_sitemap',
        'sitemap_priority',
        'sitemap_changefreq',
    ];

    protected $casts = [
        'robots_index' => 'boolean',
        'robots_follow' => 'boolean',
        'in_sitemap' => 'boolean',
        'sitemap_priority' => 'decimal:2',
        'custom_schema_json' => 'array',
        'backlinks' => 'array',
        'target_keywords' => 'array',
        'seo_score' => 'integer',
    ];

    public function seoble()
    {
        return $this->morphTo();
    }

    public function ogMedia()
    {
        return $this->belongsTo(Media::class, 'og_media_id');
    }

    public function twitterMedia()
    {
        return $this->belongsTo(Media::class, 'twitter_media_id');
    }
}
