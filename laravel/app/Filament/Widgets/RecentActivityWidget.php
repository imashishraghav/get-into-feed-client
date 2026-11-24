<?php

namespace App\Filament\Widgets;

use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\Service;
use Filament\Widgets\Widget;

class RecentActivityWidget extends Widget
{
    protected static string $view = 'filament.widgets.recent-activity';

    protected static bool $isLazy = false;

    protected static ?int $sort = -4;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'lg' => 1,
    ];

    public static function canView(): bool
    {
        return false;
    }

    public function getActivities(): array
    {
        $activities = [];

        // 1. Audit logs
        $logs = AuditLog::latest()->take(5)->get();
        foreach ($logs as $log) {
            $type = class_basename($log->auditable_type ?? 'Record');
            $activities[] = [
                'action' => "{$type} {$log->action}",
                'user' => $log->user_email ? explode('@', $log->user_email)[0] : 'Ashish',
                'time' => $log->created_at?->diffForHumans() ?? 'Recently',
                'date' => $log->created_at?->format('d M') ?? '',
            ];
        }

        // 2. Fallback to updated content models if logs are empty
        if (count($activities) < 5) {
            $recentServices = Service::latest('updated_at')->take(2)->get();
            foreach ($recentServices as $s) {
                $activities[] = [
                    'action' => "Service '{$s->name}' updated",
                    'user' => 'Ashish',
                    'time' => $s->updated_at?->diffForHumans() ?? 'Recently',
                    'date' => $s->updated_at?->format('d M') ?? '',
                ];
            }

            $recentBlogs = BlogPost::latest('updated_at')->take(2)->get();
            foreach ($recentBlogs as $b) {
                $activities[] = [
                    'action' => "Blog '{$b->title}' saved",
                    'user' => $b->author_name ?: 'Ashish',
                    'time' => $b->updated_at?->diffForHumans() ?? 'Recently',
                    'date' => $b->updated_at?->format('d M') ?? '',
                ];
            }
        }

        return array_slice($activities, 0, 5);
    }
}
