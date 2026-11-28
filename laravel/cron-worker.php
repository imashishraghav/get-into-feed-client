<?php

/**
 * GetIntoFeed Enterprise CMS — Hostinger Queue Worker Runner
 *
 * Executable via Hostinger hPanel CLI Cron (every minute):
 * /usr/bin/php /home/u221467171/domains/getintofeed.com/laravel/cron-worker.php
 *
 * Or via Artisan:
 * /usr/bin/php /home/u221467171/domains/getintofeed.com/laravel/artisan queue:work --stop-when-empty --tries=3
 */

// Strict Security: Strictly allow CLI execution only (prevents HTTP execution or token computing)
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Forbidden: Hostinger CLI execution only.']);
    exit(1);
}

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use Carbon\Carbon;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Artisan;

$timezone = config('app.timezone', 'Asia/Kolkata');
$now = Carbon::now($timezone);

$exitCode = Artisan::call('queue:work', [
    '--queue' => 'lead-alerts,default',
    '--stop-when-empty' => true,
    '--tries' => 3,
    '--timeout' => 60,
    '--memory' => 128,
]);
$output = Artisan::output();

$logPath = __DIR__.'/storage/logs/queue-worker.log';
$logEntry = '['.$now->format('Y-m-d H:i:s')." {$timezone}] Executed queue:work (Exit: {$exitCode})\n"
          .trim($output)."\n"
          .str_repeat('-', 60)."\n";

@file_put_contents($logPath, $logEntry, FILE_APPEND);

if (php_sapi_name() === 'cli') {
    echo $output;
    exit($exitCode);
} else {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => $exitCode === 0 ? 'SUCCESS' : 'FAILED',
        'exit_code' => $exitCode,
        'timestamp' => $now->toIso8601String(),
        'output' => $output,
    ]);
}
