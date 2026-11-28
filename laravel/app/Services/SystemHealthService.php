<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class SystemHealthService
{
    /**
     * Format byte sizes into readable strings.
     */
    protected function formatBytes(int|float $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision).' '.$units[$pow];
    }

    /**
     * Real-time server and PHP runtime metrics.
     */
    public function getServerMetrics(): array
    {
        $basePath = base_path();
        $diskFree = @disk_free_space($basePath) ?: 0;
        $diskTotal = @disk_total_space($basePath) ?: 1;
        $diskUsed = $diskTotal - $diskFree;
        $diskUsagePercent = round(($diskUsed / $diskTotal) * 100, 1);

        $memUsage = memory_get_usage(true);
        $memPeak = memory_get_peak_usage(true);
        $memLimit = ini_get('memory_limit');

        return [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Hostinger Cloud / LiteSpeed',
            'os' => PHP_OS.' ('.php_uname('m').')',
            'memory_usage' => $this->formatBytes($memUsage),
            'memory_peak' => $this->formatBytes($memPeak),
            'memory_limit' => $memLimit,
            'max_execution_time' => ini_get('max_execution_time').'s',
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'disk_free' => $this->formatBytes($diskFree),
            'disk_total' => $this->formatBytes($diskTotal),
            'disk_used' => $this->formatBytes($diskUsed),
            'disk_usage_percent' => $diskUsagePercent,
            'server_time_utc' => now('UTC')->toDateTimeString(),
            'server_time_kolkata' => now('Asia/Kolkata')->format('d M Y, h:i:s A T'),
        ];
    }

    /**
     * Database Health, engine metrics, and integrity check (supports MySQL, MariaDB, and SQLite).
     */
    public function getDatabaseMetrics(): array
    {
        $driver = config('database.default', 'mysql');
        $dbConnected = false;
        $dbSize = 0;
        $walSize = 0;
        $shmSize = 0;
        $journalMode = 'UNKNOWN';
        $quickCheck = 'unknown';
        $fkViolations = 0;
        $tablesCount = 0;
        $totalRows = 0;
        $dbPath = '';

        try {
            DB::connection()->getPdo();
            $dbConnected = true;

            if ($driver === 'sqlite') {
                $dbPath = config('database.connections.sqlite.database');
                $walPath = $dbPath.'-wal';
                $shmPath = $dbPath.'-shm';

                $dbExists = file_exists($dbPath);
                $dbSize = $dbExists ? filesize($dbPath) : 0;
                $walSize = file_exists($walPath) ? filesize($walPath) : 0;
                $shmSize = file_exists($shmPath) ? filesize($shmPath) : 0;

                $jmResult = DB::select('PRAGMA journal_mode');
                $journalMode = $jmResult[0]->journal_mode ?? 'WAL';

                $qcResult = DB::select('PRAGMA quick_check');
                $quickCheck = $qcResult[0]->quick_check ?? 'ok';

                $fkResult = DB::select('PRAGMA foreign_key_check');
                $fkViolations = count($fkResult);

                $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
                $tablesCount = count($tables);

                foreach ($tables as $t) {
                    $tableName = $t->name;
                    $cnt = (int) DB::table($tableName)->count();
                    $totalRows += $cnt;
                }
            } else {
                // MySQL / MariaDB Database Connection
                $dbName = DB::getDatabaseName();
                $dbPath = 'MySQL ('.$dbName.')';

                // Real Database Size in Bytes from information_schema
                try {
                    $sizeRes = DB::select('SELECT SUM(data_length + index_length) AS size FROM information_schema.TABLES WHERE table_schema = ?', [$dbName]);
                    $dbSize = (int) ($sizeRes[0]->size ?? 0);
                } catch (\Throwable $e) {
                    $dbSize = 0;
                }

                // Database Engine / Version
                try {
                    $verRes = DB::select('SELECT VERSION() AS ver');
                    $dbVer = $verRes[0]->ver ?? 'MariaDB';
                    $journalMode = str_contains(strtolower($dbVer), 'mariadb') ? 'MariaDB '.$dbVer : 'MySQL '.$dbVer;
                } catch (\Throwable $e) {
                    $journalMode = 'MySQL / MariaDB InnoDB';
                }

                // Tables Count & Total Rows
                try {
                    $tablesRes = DB::select('SELECT table_name AS name, IFNULL(table_rows, 0) AS rows_cnt FROM information_schema.TABLES WHERE table_schema = ?', [$dbName]);
                    $tablesCount = count($tablesRes);
                    $totalRows = 0;
                    foreach ($tablesRes as $tbl) {
                        $totalRows += (int) $tbl->rows_cnt;
                    }
                } catch (\Throwable $e) {
                    $tablesCount = 0;
                    $totalRows = 0;
                }

                // Check connectivity probe
                $ping = DB::select('SELECT 1 AS ping');
                if (! empty($ping) && ($ping[0]->ping ?? 0) == 1) {
                    $quickCheck = 'ok';
                } else {
                    $quickCheck = 'Database ping failed';
                }
                $fkViolations = 0;
            }
        } catch (\Throwable $e) {
            $quickCheck = 'Error: '.$e->getMessage();
        }

        $contentCounts = [
            'services' => [
                'published' => Service::where('status', 'published')->count(),
                'scheduled' => Service::where('status', 'scheduled')->count(),
                'draft' => Service::where('status', 'draft')->count(),
                'total' => Service::count(),
            ],
            'blog_posts' => [
                'published' => BlogPost::where('status', 'published')->count(),
                'scheduled' => BlogPost::where('status', 'scheduled')->count(),
                'draft' => BlogPost::where('status', 'draft')->count(),
                'total' => BlogPost::count(),
            ],
            'case_studies' => [
                'published' => CaseStudy::where('status', 'published')->count(),
                'scheduled' => CaseStudy::where('status', 'scheduled')->count(),
                'draft' => CaseStudy::where('status', 'draft')->count(),
                'total' => CaseStudy::count(),
            ],
            'pages' => [
                'published' => Page::where('status', 'published')->count(),
                'scheduled' => Page::where('status', 'scheduled')->count(),
                'draft' => Page::where('status', 'draft')->count(),
                'total' => Page::count(),
            ],
            'media' => DB::table('media')->count(),
            'users' => DB::table('users')->count(),
            'settings' => DB::table('settings')->count(),
        ];

        return [
            'connected' => $dbConnected,
            'driver' => $driver,
            'path' => $dbPath,
            'size' => $this->formatBytes($dbSize),
            'wal_size' => $driver === 'sqlite' ? $this->formatBytes($walSize) : 'InnoDB',
            'shm_size' => $this->formatBytes($shmSize),
            'journal_mode' => $journalMode,
            'integrity' => $quickCheck === 'ok' ? 'Healthy (OK)' : $quickCheck,
            'is_healthy' => ($dbConnected && $quickCheck === 'ok' && $fkViolations === 0),
            'fk_violations' => $fkViolations,
            'tables_count' => $tablesCount,
            'total_rows' => $totalRows,
            'content_counts' => $contentCounts,
        ];
    }

    /**
     * Cache read/write probe and latency.
     */
    public function getCacheHealth(): array
    {
        $driver = config('cache.default', 'file');
        $testKey = '_health_probe_'.uniqid();
        $testVal = 'ok_'.microtime(true);

        $start = microtime(true);
        $writeSuccess = Cache::put($testKey, $testVal, 10);
        $readVal = Cache::get($testKey);
        Cache::forget($testKey);
        $durationMs = round((microtime(true) - $start) * 1000, 2);

        $isHealthy = ($writeSuccess && $readVal === $testVal);

        return [
            'driver' => strtoupper($driver),
            'status' => $isHealthy ? 'Operational' : 'Degraded',
            'is_healthy' => $isHealthy,
            'latency_ms' => $durationMs,
        ];
    }

    /**
     * Scheduled Publishing & Cron status.
     */
    public function getScheduledPublishingStatus(): array
    {
        $nowKolkata = Carbon::now('Asia/Kolkata');

        // Look for pending scheduled content
        $pendingServices = Service::where('status', 'scheduled')->where('published_at', '>', $nowKolkata)->count();
        $pendingBlogs = BlogPost::where('status', 'scheduled')->where('published_at', '>', $nowKolkata)->count();
        $pendingCases = CaseStudy::where('status', 'scheduled')->where('published_at', '>', $nowKolkata)->count();
        $pendingPages = Page::where('status', 'scheduled')->where('published_at', '>', $nowKolkata)->count();
        $totalPending = $pendingServices + $pendingBlogs + $pendingCases + $pendingPages;

        // Find the next scheduled item
        $nextItems = collect();
        $nextService = Service::where('status', 'scheduled')->where('published_at', '>', $nowKolkata)->orderBy('published_at')->first();
        if ($nextService) {
            $nextItems->push(['type' => 'Service', 'title' => $nextService->title, 'at' => Carbon::parse($nextService->published_at, 'Asia/Kolkata')]);
        }

        $nextBlog = BlogPost::where('status', 'scheduled')->where('published_at', '>', $nowKolkata)->orderBy('published_at')->first();
        if ($nextBlog) {
            $nextItems->push(['type' => 'Blog Post', 'title' => $nextBlog->title, 'at' => Carbon::parse($nextBlog->published_at, 'Asia/Kolkata')]);
        }

        $nextCase = CaseStudy::where('status', 'scheduled')->where('published_at', '>', $nowKolkata)->orderBy('published_at')->first();
        if ($nextCase) {
            $nextItems->push(['type' => 'Case Study', 'title' => $nextCase->title, 'at' => Carbon::parse($nextCase->published_at, 'Asia/Kolkata')]);
        }

        $nextPage = Page::where('status', 'scheduled')->where('published_at', '>', $nowKolkata)->orderBy('published_at')->first();
        if ($nextPage) {
            $nextItems->push(['type' => 'Page', 'title' => $nextPage->title, 'at' => Carbon::parse($nextPage->published_at, 'Asia/Kolkata')]);
        }

        $earliest = $nextItems->sortBy('at')->first();

        // Check last cron run time
        $lastCronHeartbeat = Cache::get('cms:cron_heartbeat');
        $lastCronTime = null;
        $isCronHealthy = false;

        if ($lastCronHeartbeat) {
            $lastCronTime = Carbon::parse($lastCronHeartbeat, 'Asia/Kolkata');
            $diffMinutes = $nowKolkata->diffInMinutes($lastCronTime);
            $isCronHealthy = ($diffMinutes <= 15);
        } else {
            // Check scheduled publish log or audit log
            $lastAudit = AuditLog::whereIn('action', ['SCHEDULED_PUBLISH', 'SCHEDULED_PUBLISH_CHECK'])->latest()->first();
            if ($lastAudit) {
                $lastCronTime = Carbon::parse($lastAudit->created_at, 'Asia/Kolkata');
                $diffMinutes = $nowKolkata->diffInMinutes($lastCronTime);
                $isCronHealthy = ($diffMinutes <= 15);
            }
        }

        return [
            'total_pending' => $totalPending,
            'pending_by_type' => [
                'services' => $pendingServices,
                'blog_posts' => $pendingBlogs,
                'case_studies' => $pendingCases,
                'pages' => $pendingPages,
            ],
            'next_item' => $earliest ? [
                'type' => $earliest['type'],
                'title' => $earliest['title'],
                'scheduled_for' => $earliest['at']->format('d M Y, h:i A T'),
                'countdown' => $earliest['at']->diffForHumans($nowKolkata, ['syntax' => Carbon::DIFF_RELATIVE_AUTO]),
            ] : null,
            'last_run_at' => $lastCronTime ? $lastCronTime->format('d M Y, h:i:s A T') : 'No recent execution recorded',
            'last_run_diff' => $lastCronTime ? $lastCronTime->diffForHumans($nowKolkata) : 'Unknown',
            'is_cron_healthy' => $isCronHealthy,
            'cron_interval' => 'Every 5 Minutes (Hostinger CLI Cron)',
        ];
    }

    /**
     * API health probe of primary endpoints.
     */
    public function getApiHealth(): array
    {
        $endpoints = [
            'Services API' => 'https://getintofeed.com/api/v1/services',
            'Blog Posts API' => 'https://getintofeed.com/api/v1/blog',
            'Case Studies API' => 'https://getintofeed.com/api/v1/case-studies',
            'Settings API' => 'https://getintofeed.com/api/v1/settings',
        ];

        $results = [];

        foreach ($endpoints as $label => $uri) {
            $start = microtime(true);
            try {
                $path = parse_url($uri, PHP_URL_PATH);
                $request = Request::create($uri, 'GET', [], [], [], [
                    'HTTP_HOST' => 'getintofeed.com',
                    'HTTP_ACCEPT' => 'application/json',
                ]);
                $response = app()->handle($request);
                $status = $response->getStatusCode();
                $latency = round((microtime(true) - $start) * 1000, 2);
                $results[] = [
                    'name' => $label,
                    'endpoint' => $path,
                    'status_code' => $status,
                    'is_healthy' => ($status === 200),
                    'latency_ms' => $latency,
                ];
            } catch (\Throwable $e) {
                $results[] = [
                    'name' => $label,
                    'endpoint' => parse_url($uri, PHP_URL_PATH),
                    'status_code' => 500,
                    'is_healthy' => false,
                    'latency_ms' => round((microtime(true) - $start) * 1000, 2),
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Recent errors from laravel.log.
     */
    public function getErrorLogs(int $limit = 40): array
    {
        $logPath = storage_path('logs/laravel.log');
        if (! File::exists($logPath)) {
            return [];
        }

        $lines = file($logPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (! $lines) {
            return [];
        }

        $recent = array_slice($lines, -$limit * 3);
        $entries = [];

        foreach (array_reverse($recent) as $line) {
            if (preg_match('/^\[(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}[^\]]*)\]\s+([a-zA-Z0-9_\-]+)\.([A-Z]+):\s+(.*)$/', $line, $matches)) {
                $entries[] = [
                    'timestamp' => $matches[1],
                    'environment' => $matches[2],
                    'level' => $matches[3],
                    'message' => $matches[4],
                ];
                if (count($entries) >= $limit) {
                    break;
                }
            }
        }

        return $entries;
    }

    /**
     * Recent publishing execution logs.
     */
    public function getPublishingLogs(int $limit = 30): array
    {
        $logPath = storage_path('logs/scheduled-publishing.log');
        $fileLogs = [];

        if (File::exists($logPath)) {
            $lines = file($logPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines) {
                $recent = array_slice($lines, -$limit);
                foreach (array_reverse($recent) as $line) {
                    $fileLogs[] = $line;
                }
            }
        }

        $auditLogs = AuditLog::whereIn('action', ['SCHEDULED_PUBLISH', 'SCHEDULED_PUBLISH_FAILED'])
            ->latest()
            ->take($limit)
            ->get();

        return [
            'file_tail' => $fileLogs,
            'audit_records' => $auditLogs,
        ];
    }
}
