<?php

namespace App\Filament\Widgets;

use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Service;
use Filament\Widgets\Widget;

class ContentActivityTimelineWidget extends Widget
{
    protected static string $view = 'filament.widgets.content-activity-timeline';

    protected static bool $isLazy = false;

    protected static ?int $sort = -3;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'lg' => 1,
    ];

    public function getActivities(): array
    {
        $activities = [];

        // 1. Fetch real audit logs if available
        $logs = AuditLog::latest()->take(6)->get();
        foreach ($logs as $log) {
            $type = class_basename($log->auditable_type ?? 'Content');
            $activities[] = [
                'title' => "{$type} {$log->action}",
                'user' => $log->user_email ?: 'Administrator',
                'time' => $log->created_at->diffForHumans(),
                'icon' => 'heroicon-o-bolt',
            ];
        }

        // 2. Fallback to latest content modifications if audit log is sparse
        if (count($activities) < 6) {
            $recentServices = Service::latest('updated_at')->take(2)->get();
            foreach ($recentServices as $s) {
                $activities[] = [
                    'title' => "Service '{$s->name}' updated",
                    'user' => 'Editor Team',
                    'time' => $s->updated_at?->diffForHumans() ?? 'recently',
                    'icon' => 'heroicon-o-sparkles',
                ];
            }

            $recentCases = CaseStudy::latest('updated_at')->take(2)->get();
            foreach ($recentCases as $c) {
                $activities[] = [
                    'title' => "Case Study '{$c->client_name}' refreshed",
                    'user' => 'Editor Team',
                    'time' => $c->updated_at?->diffForHumans() ?? 'recently',
                    'icon' => 'heroicon-o-presentation-chart-line',
                ];
            }

            $recentBlogs = BlogPost::latest('updated_at')->take(2)->get();
            foreach ($recentBlogs as $b) {
                $activities[] = [
                    'title' => "Blog post '{$b->title}' published",
                    'user' => 'Editor Team',
                    'time' => $b->updated_at?->diffForHumans() ?? 'recently',
                    'icon' => 'heroicon-o-document-text',
                ];
            }
        }

        return array_slice($activities, 0, 6);
    }
}
