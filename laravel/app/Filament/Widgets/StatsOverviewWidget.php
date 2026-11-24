<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Lead;
use App\Models\Service;
use App\Models\Subscriber;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $newLeads = Lead::where('status', 'New')->count();
        $totalLeads = Lead::count();
        $publishedServices = Service::where('status', 'published')->count();
        $publishedCaseStudies = CaseStudy::where('status', 'published')->count();
        $publishedPosts = BlogPost::where('status', 'published')->count();
        $activeSubscribers = Subscriber::where('status', 'subscribed')->count();

        return [
            Stat::make('Inbound Leads', $totalLeads)
                ->description("{$newLeads} new leads awaiting review")
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color($newLeads > 0 ? 'warning' : 'success'),

            Stat::make('Published Services', $publishedServices)
                ->description('Active agency service offerings')
                ->descriptionIcon('heroicon-m-briefcase')
                ->color('primary'),

            Stat::make('Verified Case Studies', $publishedCaseStudies)
                ->description('Proven client ROI metrics')
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('success'),

            Stat::make('Knowledge Base Posts', $publishedPosts)
                ->description('Growth playbooks & articles')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('primary'),

            Stat::make('Subscribers', $activeSubscribers)
                ->description('Newsletter readership')
                ->descriptionIcon('heroicon-m-envelope')
                ->color('info'),
        ];
    }
}
