<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Lead;
use App\Models\Media;
use App\Models\Service;
use App\Models\Subscriber;
use App\Models\SystemBackup;
use App\Models\TeamMember;
use App\Models\Testimonial;
use Filament\Widgets\Widget;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardWelcomeWidget extends Widget
{
    protected static string $view = 'filament.widgets.dashboard-welcome';

    protected static bool $isLazy = false;

    protected static ?int $sort = -10;

    protected int|string|array $columnSpan = 'full';

    public function getUserName(): string
    {
        $user = Auth::user();
        if (! $user) {
            return 'Ashish';
        }
        $parts = explode(' ', trim($user->name));

        return $parts[0] ?: 'Ashish';
    }

    public function getCounts(): array
    {
        $leadQuery = Lead::production();
        $testimonialsPublished = Testimonial::where('is_published', true);
        $testimonialsCount = $testimonialsPublished->count();
        $avgRating = $testimonialsCount > 0 ? round((float) $testimonialsPublished->avg('rating'), 1) : 0.0;

        return [
            'leads' => (clone $leadQuery)->count(),
            'new_leads' => (clone $leadQuery)->whereIn('status', ['new', 'New', 'unread'])->count(),
            'crm_synced' => (clone $leadQuery)->where('crm_sync_status', 'synced')->count(),
            'crm_pending' => (clone $leadQuery)->where('crm_sync_status', 'pending')->count(),
            'crm_failed' => (clone $leadQuery)->where('crm_sync_status', 'failed')->count(),
            'services' => Service::count(),
            'case_studies' => CaseStudy::count(),
            'blog_posts' => BlogPost::count(),
            'testimonials' => $testimonialsCount,
            'testimonials_avg' => $avgRating,
            'team_members' => TeamMember::count(),
            'subscribers' => Subscriber::count(),
            'media' => Media::count(),
        ];
    }

    public function getSystemHealth(): array
    {
        $dbConnected = false;
        $dbDriver = config('database.default', 'sqlite');
        $dbLatencyMs = 0;
        try {
            $start = microtime(true);
            DB::connection()->getPdo();
            $dbLatencyMs = round((microtime(true) - $start) * 1000, 1);
            $dbConnected = true;
        } catch (\Throwable $e) {
            $dbConnected = false;
        }

        $queueDepth = 0;
        $failedJobsCount = 0;
        try {
            if (Schema::hasTable('jobs')) {
                $queueDepth = DB::table('jobs')->count();
            }
            if (Schema::hasTable('failed_jobs')) {
                $failedJobsCount = DB::table('failed_jobs')->count();
            }
        } catch (\Throwable $e) {
        }

        $lastBackupAt = null;
        try {
            if (Schema::hasTable('system_backups')) {
                $lastBackup = SystemBackup::latest()->first();
                $lastBackupAt = $lastBackup?->created_at?->diffForHumans();
            }
        } catch (\Throwable $e) {
        }

        return [
            'db_connected' => $dbConnected,
            'db_driver' => strtoupper($dbDriver),
            'db_latency_ms' => $dbLatencyMs,
            'queue_depth' => $queueDepth,
            'failed_jobs' => $failedJobsCount,
            'last_backup' => $lastBackupAt ?: 'None recorded',
            'checked_at' => now()->format('h:i:s A'),
        ];
    }

    public function getRecentLeads(): Collection
    {
        return Lead::production()->latest()->take(6)->get();
    }

    public function getRecentSubscribers(): Collection
    {
        return Subscriber::latest('subscribed_at')->take(5)->get();
    }

    public function getServices(): Collection
    {
        return Service::orderBy('sort_order')->take(6)->get();
    }

    public function getRecentBlogPosts(): Collection
    {
        return BlogPost::latest()->take(3)->get();
    }

    public function getRecentCaseStudies(): Collection
    {
        return CaseStudy::latest()->take(3)->get();
    }

    public function getGreeting(): string
    {
        $hour = (int) now()->format('G');

        return match (true) {
            $hour < 12 => 'Good morning',
            $hour < 17 => 'Good afternoon',
            default => 'Good evening',
        };
    }
}
