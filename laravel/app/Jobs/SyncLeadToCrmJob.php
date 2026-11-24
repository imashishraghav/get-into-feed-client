<?php

namespace App\Jobs;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SyncLeadToCrmJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Lead $lead;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;

    /**
     * Calculate the number of seconds to wait before retrying the job.
     * Exponential backoff: 30s, 120s, 600s
     *
     * @var array<int, int>
     */
    public $backoff = [30, 120, 600];

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
        $lead = $this->lead->fresh() ?? $this->lead;

        if ($lead->crm_sync_status === 'synced') {
            return;
        }

        $attempts = ($lead->crm_sync_attempts ?? 0) + 1;
        $lead->crm_sync_attempts = $attempts;

        $payload = [
            'idempotency_key' => $lead->uuid,
            'lead_code' => $lead->lead_code,
            'name' => $lead->name,
            'email' => $lead->email,
            'phone' => $lead->phone,
            'whatsapp' => $lead->whatsapp,
            'company' => $lead->company,
            'city' => $lead->city,
            'industry' => $lead->industry,
            'website' => $lead->website,
            'service' => $lead->interested_service,
            'message' => $lead->message,
            'budget' => $lead->budget,
            'source' => $lead->source ?: 'Website Form',
            'page_url' => $lead->page_url,
            'referrer' => $lead->referrer,
            'form_type' => $lead->form_type ?: 'contact_form',
            'utm_source' => $lead->utm_source,
            'utm_medium' => $lead->utm_medium,
            'utm_campaign' => $lead->utm_campaign,
            'utm_term' => $lead->utm_term,
            'utm_content' => $lead->utm_content,
            'gclid' => $lead->gclid,
            'fbclid' => $lead->fbclid,
            'consent_at' => $lead->consent_at?->toIso8601String(),
            'is_test' => (bool) $lead->is_test,
            'submitted_at' => $lead->created_at?->toIso8601String(),
        ];

        $timestamp = time();
        $payloadJson = json_encode($payload, JSON_UNESCAPED_SLASHES);
        $secret = config('services.crm.secret', '');
        $signature = hash_hmac('sha256', $timestamp.'.'.$payloadJson, $secret);

        $endpoint = config('services.crm.endpoint', 'https://crm.getintofeed.com/api/v1/inbound-leads');
        $timeout = (int) config('services.crm.timeout', 10);

        try {
            $response = Http::timeout($timeout)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'Idempotency-Key' => $lead->uuid,
                    'X-Timestamp' => (string) $timestamp,
                    'X-Signature' => $signature,
                ])
                ->post($endpoint, $payload);

            // Both 2xx and 409 Conflict (idempotent duplicate already saved) represent success
            if ($response->successful() || $response->status() === 409) {
                $crmLeadId = $response->json('lead_id')
                    ?? $response->json('data.id')
                    ?? $response->json('id');

                $lead->update([
                    'crm_sync_status' => 'synced',
                    'crm_synced_at' => now(),
                    'crm_sync_error' => null,
                    'crm_sync_attempts' => $attempts,
                    'crm_lead_id' => $crmLeadId ? (string) $crmLeadId : $lead->crm_lead_id,
                ]);

                Log::info("[SyncLeadToCrmJob] Lead {$lead->id} ({$lead->lead_code}) successfully synced to external CRM.");

                return;
            }

            $errorMsg = "HTTP {$response->status()}: ".Str::limit($response->body(), 200);
            $lead->update([
                'crm_sync_status' => 'pending',
                'crm_sync_error' => $errorMsg,
                'crm_sync_attempts' => $attempts,
            ]);

            throw new \RuntimeException("External CRM sync failed with response: {$errorMsg}");
        } catch (\Throwable $e) {
            $errorMessage = Str::limit($e->getMessage(), 250);
            $lead->update([
                'crm_sync_status' => 'pending',
                'crm_sync_error' => $errorMessage,
                'crm_sync_attempts' => $attempts,
            ]);

            Log::warning("[SyncLeadToCrmJob] Attempt {$attempts} failed for Lead {$lead->id}: {$errorMessage}");
            throw $e;
        }
    }

    /**
     * Handle a job failure after all retries are exhausted.
     */
    public function failed(?\Throwable $exception): void
    {
        $lead = $this->lead->fresh();
        if ($lead) {
            $lead->update([
                'crm_sync_status' => 'failed',
                'crm_sync_error' => 'Max sync retries exceeded: '.Str::limit($exception?->getMessage() ?? 'Unknown error', 200),
            ]);
        }

        Log::error("[SyncLeadToCrmJob] Permanently failed to sync Lead {$this->lead->id} to external CRM after {$this->tries} attempts.");
    }
}
