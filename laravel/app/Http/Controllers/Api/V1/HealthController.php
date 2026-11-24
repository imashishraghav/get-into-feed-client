<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        $dbStatus = 'connected';
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $dbStatus = 'unreachable: '.$e->getMessage();
        }

        $queueDriver = config('queue.default', 'sync');
        $pendingJobs = 0;
        $failedJobs = 0;
        try {
            if (Schema::hasTable('jobs')) {
                $pendingJobs = DB::table('jobs')->count();
            }
            if (Schema::hasTable('failed_jobs')) {
                $failedJobs = DB::table('failed_jobs')->count();
            }
        } catch (\Throwable $qe) {
        }

        $latestDeliveries = [];
        try {
            if (Schema::hasTable('lead_notification_deliveries')) {
                $latestDeliveries = DB::table('lead_notification_deliveries')->latest('id')->take(3)->get();
            }
        } catch (\Throwable $de) {
        }

        $mailConfig = [
            'mailer' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'encryption' => config('mail.mailers.smtp.encryption'),
            'from' => config('mail.from.address'),
            'alerts_enabled' => config('lead-alerts.enabled'),
            'alerts_email_to' => config('lead-alerts.email_to'),
            'whatsapp_enabled' => config('lead-alerts.whatsapp_enabled'),
        ];

        return response()->json([
            'agency' => 'Get Into Feed Media Pvt. Ltd.',
            'status' => 'ok',
            'service' => 'get-into-feed-laravel-cms',
            'version' => '1.0.0',
            'runtime' => 'Laravel 12 (PHP '.PHP_VERSION.')',
            'database' => $dbStatus,
            'mail_and_alerts' => $mailConfig,
            'latest_deliveries' => $latestDeliveries,
            'queue' => [
                'driver' => $queueDriver,
                'pending_jobs' => $pendingJobs,
                'failed_jobs' => $failedJobs,
            ],
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
