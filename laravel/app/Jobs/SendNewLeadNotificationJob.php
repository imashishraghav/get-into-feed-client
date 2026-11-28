<?php

namespace App\Jobs;

use App\Mail\NewLeadNotificationMail;
use App\Models\AuditLog;
use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendNewLeadNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Lead $lead;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var array<int, int>
     */
    public array $backoff = [10, 30, 60];

    /**
     * Create a new job instance.
     */
    public function __construct(Lead $lead)
    {
        $this->lead = $lead;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // 1. Idempotency Check: Do not resend if notification was already delivered
        if ($this->lead->notification_sent_at !== null) {
            Log::info("Lead notification already sent for {$this->lead->lead_code}. Skipping duplicate send.");

            return;
        }

        $recipient = config('lead-alerts.recipient', config('mail.from.address', 'hello@getintofeed.com'));

        try {
            Mail::to($recipient)->send(new NewLeadNotificationMail($this->lead));

            // 2. Mark lead notification as successfully delivered
            $this->lead->forceFill([
                'notification_sent_at' => now(),
                'notification_error' => null,
                'notification_attempts' => ($this->lead->notification_attempts ?? 0) + 1,
            ])->saveQuietly();

            // 3. Log audit event
            AuditLog::create([
                'user_id' => null,
                'user_email' => 'system@getintofeed.com',
                'action' => 'LEAD_NOTIFICATION_SENT',
                'auditable_type' => Lead::class,
                'auditable_id' => $this->lead->id,
                'new_values' => [
                    'lead_code' => $this->lead->lead_code,
                    'recipient' => $recipient,
                    'sent_at' => now()->toIso8601String(),
                ],
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Laravel-Queue-Worker',
            ]);

            Log::info("✅ Lead notification successfully dispatched for {$this->lead->lead_code} to {$recipient}");

        } catch (Throwable $e) {
            $this->lead->forceFill([
                'notification_error' => substr($e->getMessage(), 0, 1000),
                'notification_attempts' => ($this->lead->notification_attempts ?? 0) + 1,
            ])->saveQuietly();

            Log::error("❌ Failed sending lead notification for {$this->lead->lead_code}: ".$e->getMessage());

            // Re-throw so Laravel's queue worker registers the attempt and triggers backoff
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(?Throwable $exception): void
    {
        $errMsg = $exception ? $exception->getMessage() : 'Unknown queue job failure';

        $this->lead->forceFill([
            'notification_error' => 'PERMANENT FAILURE: '.substr($errMsg, 0, 950),
        ])->saveQuietly();

        AuditLog::create([
            'user_id' => null,
            'user_email' => 'system@getintofeed.com',
            'action' => 'LEAD_NOTIFICATION_PERMANENTLY_FAILED',
            'auditable_type' => Lead::class,
            'auditable_id' => $this->lead->id,
            'new_values' => [
                'lead_code' => $this->lead->lead_code,
                'error' => $errMsg,
            ],
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Laravel-Queue-Worker',
        ]);

        Log::critical("🔥 Lead notification job permanently failed for {$this->lead->lead_code}: {$errMsg}");
    }
}
