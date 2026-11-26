<?php

namespace App\Console\Commands;

use App\Jobs\PublishScheduledPostJob;
use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Service;
use App\Services\SitemapService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PublishScheduledContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:publish-scheduled
                            {--force : Force execution ignoring active lock}
                            {--dry-run : Simulate publishing without altering database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically publish pages, services, articles, and case studies whose scheduled time has arrived in Asia/Kolkata timezone';

    /**
     * Supported CMS content models.
     *
     * @var array<string, string>
     */
    protected array $models = [
        'Blog Posts' => BlogPost::class,
        'Services' => Service::class,
        'Pages' => Page::class,
        'Case Studies' => CaseStudy::class,
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $timezone = config('app.timezone', 'Asia/Kolkata');
        $now = Carbon::now($timezone);
        $nowStr = $now->format('Y-m-d H:i:s');
        $isDryRun = (bool) $this->option('dry-run');

        // Record cron heartbeat for System Health monitoring
        Cache::put('cms:cron_heartbeat', $now->toIso8601String(), 86400);

        $this->info('=======================================================');
        $this->info(' GetIntoFeed CMS — Automated Scheduled Publisher');
        $this->info(" Evaluation Time (IST): {$now->format('Y-m-d H:i:s')} [{$timezone}]");
        if ($isDryRun) {
            $this->warn(' MODE: DRY RUN (No database modifications will be performed)');
        }
        $this->info('=======================================================');

        $totalEvaluated = 0;
        $totalPublished = 0;
        $totalFailed = 0;
        $totalSkipped = 0;
        $summaryTable = [];

        foreach ($this->models as $label => $modelClass) {
            $dueQuery = $modelClass::query()
                ->where('status', 'scheduled')
                ->whereNotNull('scheduled_for')
                ->where('scheduled_for', '<=', $nowStr)
                ->orderBy('scheduled_for', 'asc');

            $dueCount = (clone $dueQuery)->count();
            $totalEvaluated += $dueCount;

            $modelPublished = 0;
            $modelFailed = 0;
            $modelSkipped = 0;

            if ($dueCount === 0) {
                $summaryTable[] = [$label, 0, 0, 0, 0, 'No due items'];

                continue;
            }

            $items = $dueQuery->get();

            foreach ($items as $item) {
                $itemId = $item->getKey();
                $itemTitle = $item->title ?? $item->name ?? $item->client_name ?? ("#{$itemId}");
                $scheduledAt = Carbon::parse($item->scheduled_for, $timezone)->format('Y-m-d H:i:s');

                if ($isDryRun) {
                    $this->line("  [DRY-RUN] Would publish {$label} #{$itemId} ('{$itemTitle}'), scheduled for {$scheduledAt} IST");
                    $modelPublished++;

                    continue;
                }

                $beforeState = [
                    'status' => $item->status,
                    'scheduled_for' => (string) $item->scheduled_for,
                    'published_at' => (string) $item->published_at,
                ];

                try {
                    if ($modelClass === BlogPost::class) {
                        PublishScheduledPostJob::dispatch($itemId);
                        $modelPublished++;
                        $totalPublished++;
                        $this->info("  ✓ Queued PublishScheduledPostJob for Blog Post #{$itemId} ('{$itemTitle}')");

                        continue;
                    }

                    // Atomic transition to prevent duplicate processing by concurrent runs
                    // Only update if status is STRICTLY 'scheduled'
                    $affected = $modelClass::query()
                        ->where('id', $itemId)
                        ->where('status', 'scheduled')
                        ->update([
                            'status' => 'published',
                            'published_at' => $item->scheduled_for ?: $nowStr,
                            'updated_at' => $nowStr,
                        ]);

                    if ($affected === 1) {
                        $modelPublished++;
                        $totalPublished++;

                        // Retrieve refreshed record for logging & hooks
                        $fresh = $modelClass::find($itemId);

                        AuditLog::log('SCHEDULED_PUBLISH', $fresh, $beforeState, [
                            'status' => 'published',
                            'published_at' => (string) $fresh->published_at,
                            'scheduled_for' => $scheduledAt,
                            'published_via' => 'cms:publish-scheduled',
                            'timezone' => $timezone,
                            'execution_time_ist' => $nowStr,
                        ]);

                        Log::info("[CMS Scheduler] Successfully auto-published {$label} #{$itemId} ('{$itemTitle}') at {$nowStr} IST (scheduled for {$scheduledAt}).");
                        $this->info("  ✓ Published {$label} #{$itemId} ('{$itemTitle}')");
                        Cache::forget('api_v1_bootstrap_data');
                        app(SitemapService::class)->regenerate();
                    } else {
                        // Another concurrent worker transitioned this record
                        $modelSkipped++;
                        $totalSkipped++;
                        Log::warning("[CMS Scheduler] Race condition averted: {$label} #{$itemId} was already transitioned by another worker.");
                        $this->comment("  — Skipped {$label} #{$itemId} (handled by concurrent run)");
                    }
                } catch (\Throwable $e) {
                    $modelFailed++;
                    $totalFailed++;

                    Log::error("[CMS Scheduler] Failed to publish {$label} #{$itemId} ('{$itemTitle}'): ".$e->getMessage(), [
                        'exception' => $e,
                        'model' => $modelClass,
                        'id' => $itemId,
                        'scheduled_for' => $item->scheduled_for,
                        'now_ist' => $nowStr,
                    ]);

                    AuditLog::log('SCHEDULED_PUBLISH_FAILED', $item, $beforeState, [
                        'error' => $e->getMessage(),
                        'trace' => substr($e->getTraceAsString(), 0, 1000),
                        'scheduled_for' => $scheduledAt,
                        'attempted_at_ist' => $nowStr,
                        'timezone' => $timezone,
                    ]);

                    $this->error("  ✗ Error publishing {$label} #{$itemId}: ".$e->getMessage());
                }
            }

            $summaryTable[] = [
                $label,
                $dueCount,
                $modelPublished,
                $modelSkipped,
                $modelFailed,
                $modelFailed > 0 ? 'Errors encountered' : ($modelPublished > 0 ? 'Published' : 'Clean'),
            ];
        }

        $this->newLine();
        $this->table(
            ['Content Type', 'Due', 'Published', 'Skipped', 'Failed', 'Status'],
            $summaryTable
        );

        $this->info("Summary: {$totalPublished} published, {$totalSkipped} skipped, {$totalFailed} failed out of {$totalEvaluated} due items.");

        return $totalFailed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
