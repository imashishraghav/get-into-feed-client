<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SectionTemplate extends Model
{
    use HasFactory;

    protected $table = 'section_templates';

    protected $fillable = [
        'name',
        'category',
        'description',
        'block_type',
        'block_payload',
        'preview_image',
        'usage_count',
        'is_active',
    ];

    protected $casts = [
        'block_payload' => 'array',
        'is_active' => 'boolean',
        'usage_count' => 'integer',
    ];

    public static function seedDefaultTemplates(): void
    {
        $defaults = [
            [
                'name' => 'Hero High-Conversion Sprint',
                'category' => 'Hero',
                'description' => 'Dark high-impact agency hero banner with dual CTAs and trust metric pill.',
                'block_type' => 'hero',
                'block_payload' => [
                    'kicker' => 'GROWTH PERFORMANCE STUDIO',
                    'title' => 'Google Ads, SEO & High-Velocity Funnels',
                    'subtitle' => 'Senior strategist-led growth sprints designed for Delhi NCR & high-growth brands.',
                    'cta_label' => 'Start a Project',
                    'cta_url' => '/contact',
                    'secondary_cta_label' => 'Explore Pricing',
                    'secondary_cta_url' => '/pricing',
                ],
            ],
            [
                'name' => 'Deliverables Grid (30-Day Sprint)',
                'category' => 'Features',
                'description' => 'Four core deliverables checklist with scope badges.',
                'block_type' => 'deliverables',
                'block_payload' => [
                    'heading' => 'What We Ship in 30 Days',
                    'items' => [
                        ['title' => 'Full Funnel Teardown', 'description' => 'Pixel, tracking & competitor keyword audit.'],
                        ['title' => 'Ad Creative Production', 'description' => '10 scripted reels and high-converting static hooks.'],
                        ['title' => 'Landing Page Optimization', 'description' => 'Split-tested copy and lightning mobile load speed.'],
                        ['title' => 'Weekly Transparent Reporting', 'description' => 'Live Looker dashboard showing actual CAC and ROAS.'],
                    ],
                ],
            ],
            [
                'name' => 'Metrics & Results Outlier Bar',
                'category' => 'Proof & Metrics',
                'description' => 'Three proof cards showing blended ROAS, CAC reduction and pipeline growth.',
                'block_type' => 'metrics',
                'block_payload' => [
                    'heading' => 'Verified Client Outliers',
                    'items' => [
                        ['value' => '4.8x', 'label' => 'Average Blended ROAS'],
                        ['value' => '-42%', 'label' => 'Customer Acquisition Cost'],
                        ['value' => '₹18.4 Cr', 'label' => 'Client Pipeline Generated'],
                    ],
                ],
            ],
            [
                'name' => 'FAQ Accordion (Schema-Ready)',
                'category' => 'FAQ',
                'description' => 'Collapsible Q&A accordion ready for Google FAQPage JSON-LD rich snippets.',
                'block_type' => 'faq_accordion',
                'block_payload' => [
                    'heading' => 'Frequently Asked Questions',
                    'items' => [
                        ['question' => 'How quickly can campaigns launch?', 'answer' => 'Sprint onboarding takes 3–5 business days, with live campaign launch by Day 7.'],
                        ['question' => 'Do you lock clients into long-term retainers?', 'answer' => 'No. We work in 30-day performance sprints with zero forced lock-in.'],
                        ['question' => 'Who owns the advertising accounts and assets?', 'answer' => 'You own 100% of your Google Ads, Meta Ads and analytics accounts at all times.'],
                    ],
                ],
            ],
            [
                'name' => 'High-Conversion CTA Banner',
                'category' => 'CTA',
                'description' => 'Vibrant lime-green background call to action banner.',
                'block_type' => 'cta_banner',
                'block_payload' => [
                    'heading' => 'Ready to build something people cannot scroll past?',
                    'subheading' => 'Book a 20-minute strategic growth session. Direct feedback, no sales fluff.',
                    'button_text' => 'Book Strategy Session →',
                    'button_url' => '/contact',
                ],
            ],
        ];

        foreach ($defaults as $tpl) {
            static::firstOrCreate(
                ['name' => $tpl['name']],
                $tpl
            );
        }
    }
}
