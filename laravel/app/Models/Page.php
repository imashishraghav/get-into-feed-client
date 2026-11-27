<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'template',
        'editor_mode',
        'content',
        'content_blocks',
        'featured_media_id',
        'status',
        'published_at',
        'scheduled_for',
        'author_id',
    ];

    protected $casts = [
        'content_blocks' => 'array',
        'published_at' => 'datetime',
        'scheduled_for' => 'datetime',
    ];

    public function featuredMedia()
    {
        return $this->belongsTo(Media::class, 'featured_media_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function seo()
    {
        return $this->morphOne(SeoMetadata::class, 'seoble');
    }

    public function revisions()
    {
        return $this->morphMany(Revision::class, 'revisable');
    }
}
