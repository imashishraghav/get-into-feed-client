<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SystemHealthResource;
use App\Models\Lead;
use App\Models\SystemBackup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class HealthController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $configuredToken = (string) config('cms.health_token', '');
        $providedToken = (string) $request->header('X-Health-Token', '');
        $hasValidToken = $configuredToken !== '' && $providedToken !== '' && hash_equals($configuredToken, $providedToken);

        $user = $request->user();
        $isAdmin = $user && $user->isAdminOrHigher();

        if (! $isAdmin && ! $hasValidToken) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized.',
            ], 401);
        }

        $dbConnected = true;
        $dbStatus = 'connected';
        try {
            DB::connection()->getPdo();
            DB::select('SELECT 1');
        } catch (\Throwable $e) {
            $dbConnected = false;
            $dbStatus = 'unreachable';
        }

        $cacheOk = true;
        try {
            $probeKey = 'health_probe_'.bin2hex(random_bytes(4));
            Cache::put($probeKey, '1', 5);
            $cacheOk = Cache::get($probeKey) === '1';
            Cache::forget($probeKey);
        } catch (\Throwable $e) {
            $cacheOk = false;
        }

        $pendingJobs = 0;
        $failedJobs = 0;
        try {
            if (Schema::hasTable('jobs')) {
                $pendingJobs = DB::table('jobs')->count();
            }
            if (Schema::hasTable('failed_jobs')) {
                $failedJobs = DB::table('failed_jobs')->count();
            }
        } catch (\Throwable $e) {
        }

        $crmStats = Schema::hasTable('crm_leads')
            ? [
                'synced' => Lead::production()->where('crm_sync_status', 'synced')->count(),
                'pending' => Lead::production()->where('crm_sync_status', 'pending')->count(),
                'failed' => Lead::production()->where('crm_sync_status', 'failed')->count(),
            ]
            : [];

        $lastBackup = Schema::hasTable('system_backups')
            ? SystemBackup::latest()->first(['filename', 'status', 'created_at'])
            : null;

        $payload = [
            'ok' => $dbConnected && $cacheOk,
            'database' => $dbStatus,
            'cache' => $cacheOk ? 'ok' : 'degraded',
            'queue' => [
                'pending_jobs' => $pendingJobs,
                'failed_jobs' => $failedJobs,
            ],
            'telemetry' => [
                'queue_driver' => config('queue.default', 'database'),
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'crm_sync' => $crmStats,
                'last_backup' => $lastBackup ? [
                    'filename' => $lastBackup->filename,
                    'status' => $lastBackup->status,
                    'created_at' => $lastBackup->created_at?->toIso8601String(),
                ] : null,
            ],
            'timestamp' => now()->toIso8601String(),
        ];

        return (new SystemHealthResource($payload))->response()->setStatusCode($dbConnected ? 200 : 503);
    }
}
