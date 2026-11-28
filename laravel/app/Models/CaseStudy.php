<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CaseStudy extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'case_studies';

    protected $fillable = [
        'client_name',
        'project_name',
        'slug',
        'category',
        'sub_tag',
        'filter_categories',
        'year',
        'headline_prefix',
        'headline_highlight',
        'headline_suffix',
        'hero_description',
        'hero_media_id',
        'editor_mode',
        'content',
        'content_blocks',
        'challenge',
        'challenge_paragraphs',
        'obstacles',
        'strategy_pillars',
        'execution_gallery',
        'results_metrics',
        'testimonial_id',
        'status',
        'sort_order',
        'published_at',
        'scheduled_for',
    ];

    protected $casts = [
        'content_blocks' => 'array',
        'filter_categories' => 'array',
        'challenge_paragraphs' => 'array',
        'obstacles' => 'array',
        'strategy_pillars' => 'array',
        'execution_gallery' => 'array',
        'results_metrics' => 'array',
        'published_at' => 'datetime',
        'scheduled_for' => 'datetime',
        'sort_order' => 'integer',
    ];

    public function heroMedia()
    {
        return $this->belongsTo(Media::class, 'hero_media_id');
    }

    public function testimonial()
    {
        return $this->belongsTo(Testimonial::class, 'testimonial_id');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'case_study_services', 'case_study_id', 'service_id');
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
