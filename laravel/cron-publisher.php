<?php

/**
 * GetIntoFeed Enterprise CMS — Hostinger Scheduled Publisher Runner
 *
 * Executable via Hostinger hPanel CLI Cron:
 * /usr/bin/php /home/u221467171/domains/getintofeed.com/laravel/cron-publisher.php
 *
 * Or via Artisan:
 * /usr/bin/php /home/u221467171/domains/getintofeed.com/laravel/artisan cms:publish-scheduled
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

$exitCode = Artisan::call('cms:publish-scheduled');
$output = Artisan::output();

$logPath = __DIR__.'/storage/logs/scheduled-publishing.log';
$logEntry = '['.$now->format('Y-m-d H:i:s')." {$timezone}] Executed cms:publish-scheduled (Exit: {$exitCode})\n"
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
        'executed_at_ist' => $now->format('Y-m-d H:i:s'),
        'timezone' => $timezone,
        'output' => trim($output),
        'log_file' => $logPath,
        'log_size_bytes' => file_exists($logPath) ? filesize($logPath) : 0,
    ], JSON_PRETTY_PRINT);
}
