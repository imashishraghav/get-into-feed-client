<?php

namespace App\Filament\Widgets;

use App\Models\CaseStudy;
use App\Models\Lead;
use App\Models\Service;
use Filament\Widgets\Widget;

class ContentAttentionWidget extends Widget
{
    protected static string $view = 'filament.widgets.content-attention';

    protected static bool $isLazy = false;

    protected static ?int $sort = -4;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'lg' => 1,
    ];

    public function getAttentionItems(): array
    {
        $items = [];

        // 1. New leads needing response
        $newLeads = Lead::where('status', 'New')->count();
        if ($newLeads > 0) {
            $items[] = [
                'type' => 'critical',
                'title' => "{$newLeads} new inbound leads awaiting contact",
                'desc' => 'High-intent client inquiries submitted via website form.',
                'link' => '/admin/leads?tableFilters[status][value]=New',
                'action' => 'Review Leads',
            ];
        }

        // 2. Draft services awaiting review or publish
        $draftServices = Service::whereIn('status', ['draft', 'review'])->count();
        if ($draftServices > 0) {
            $items[] = [
                'type' => 'warning',
                'title' => "{$draftServices} services in draft or review status",
                'desc' => 'Services prepared but not yet live to website visitors.',
                'link' => '/admin/services',
                'action' => 'Review Services',
            ];
        }

        // 3. Case studies in draft or review
        $draftCases = CaseStudy::whereIn('status', ['draft', 'review'])->count();
        if ($draftCases > 0) {
            $items[] = [
                'type' => 'warning',
                'title' => "{$draftCases} case studies pending review",
                'desc' => 'Proof stories waiting for validation before release.',
                'link' => '/admin/case-studies',
                'action' => 'Inspect',
            ];
        }

        // 4. Missing SEO check
        $missingSeoServices = Service::whereDoesntHave('seo')->count();
        if ($missingSeoServices > 0) {
            $items[] = [
                'type' => 'info',
                'title' => "{$missingSeoServices} services without custom SEO tags",
                'desc' => 'Using fallback title/meta descriptions.',
                'link' => '/admin/services',
                'action' => 'Optimize',
            ];
        }

        // 5. Missing featured media check
        $missingMediaServices = Service::whereNull('hero_media_id')->count();
        if ($missingMediaServices > 0) {
            $items[] = [
                'type' => 'info',
                'title' => "{$missingMediaServices} services missing hero media",
                'desc' => 'Hero section media not selected from Media Library.',
                'link' => '/admin/services',
                'action' => 'Assign Media',
            ];
        }

        // If all items clear, provide verified health state
        if (empty($items)) {
            $items[] = [
                'type' => 'success',
                'title' => 'All published content health checks passed',
                'desc' => 'Zero drafts pending, all services have verified metadata.',
                'link' => '/admin/services',
                'action' => 'View Services',
            ];
        }

        return $items;
    }
}
