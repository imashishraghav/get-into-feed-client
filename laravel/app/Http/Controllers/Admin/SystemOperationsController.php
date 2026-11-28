<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AuditLogService;
use App\Services\SitemapService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SystemOperationsController extends Controller
{
    public function __construct(
        private readonly AuditLogService $audit,
        private readonly SitemapService $sitemap,
    ) {}

    public function purgeCache(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user || ! $user->isAdminOrHigher()) {
            abort(403, 'Administrator privileges required.');
        }

        Artisan::call('cache:clear');
        Artisan::call('view:clear');
        Cache::forget('api_blog_public_list');
        Cache::forget('api_v1_bootstrap_data');
        $this->sitemap->regenerate();

        $this->audit->record('SYSTEM_CACHE_PURGED', null, null, [
            'triggered_at' => now()->toIso8601String(),
        ], $user);

        return response()->json([
            'success' => true,
            'message' => 'Application caches, compiled views, and sitemap refreshed.',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    public function queueStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user || ! $user->isAdminOrHigher()) {
            abort(403, 'Administrator privileges required.');
        }

        $pending = Schema::hasTable('jobs') ? DB::table('jobs')->count() : 0;
        $failedJobs = Schema::hasTable('failed_jobs')
            ? DB::table('failed_jobs')
                ->orderByDesc('failed_at')
                ->limit(25)
                ->get(['id', 'uuid', 'connection', 'queue', 'failed_at', 'exception'])
                ->map(fn ($row) => [
                    'id' => $row->id,
                    'uuid' => $row->uuid,
                    'queue' => $row->queue,
                    'failed_at' => $row->failed_at,
                    'summary' => strtok((string) $row->exception, "\n") ?: 'Failed job',
                ])
            : collect();

        return response()->json([
            'success' => true,
            'driver' => config('queue.default', 'database'),
            'pending_jobs' => $pending,
            'failed_jobs_count' => $failedJobs->count(),
            'failed_jobs' => $failedJobs,
        ]);
    }

    public function retryFailedJob(Request $request, string $uuidOrAll): JsonResponse
    {
        $user = $request->user();
        if (! $user || ! $user->isAdminOrHigher()) {
            abort(403, 'Administrator privileges required.');
        }

        if ($uuidOrAll === 'all') {
            Artisan::call('queue:retry', ['id' => ['all']]);
        } else {
            Artisan::call('queue:retry', ['id' => [$uuidOrAll]]);
        }

        $this->audit->record('QUEUE_JOBS_RETRIED', null, null, [
            'target' => $uuidOrAll,
        ], $user);

        return response()->json([
            'success' => true,
            'target' => $uuidOrAll,
            'output' => trim(Artisan::output()),
        ]);
    }
}
