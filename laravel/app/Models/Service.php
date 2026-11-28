<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'short_description',
        'pricing_tier',
        'timeline',
        'icon_name',
        'hero_badge',
        'focus_metric',
        'overview',
        'editor_mode',
        'content',
        'content_blocks',
        'what_we_do',
        'deliverables',
        'included_disclaimer',
        'process_steps',
        'faqs',
        'problem_tag',
        'problem_heading',
        'problem_summary',
        'how_deal_heading',
        'how_deal_content',
        'who_for_heading',
        'who_for_desc',
        'locations',
        'issues',
        'sidebar_heading',
        'sidebar_desc',
        'sidebar_checks',
        'backlinks',
        'hero_heading',
        'hero_description',
        'hero_media_id',
        'cta_label',
        'cta_url',
        'status',
        'sort_order',
        'published_at',
        'scheduled_for',
    ];

    protected $casts = [
        'content_blocks' => 'array',
        'deliverables' => 'array',
        'what_we_do' => 'array',
        'process_steps' => 'array',
        'faqs' => 'array',
        'locations' => 'array',
        'issues' => 'array',
        'sidebar_checks' => 'array',
        'backlinks' => 'array',
        'published_at' => 'datetime',
        'scheduled_for' => 'datetime',
        'sort_order' => 'integer',
    ];

    public function heroMedia()
    {
        return $this->belongsTo(Media::class, 'hero_media_id');
    }

    public function caseStudies()
    {
        return $this->belongsToMany(CaseStudy::class, 'case_study_services', 'service_id', 'case_study_id');
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
