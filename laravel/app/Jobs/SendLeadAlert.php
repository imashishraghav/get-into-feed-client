<?php

namespace App\Jobs;

use App\Mail\NewLeadAlert;
use App\Models\LeadNotificationDelivery;
use App\Services\WhatsAppCloudApi;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class SendLeadAlert implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 4;

    /** @var array<int, int> */
    public array $backoff = [60, 180, 600];

    public int $timeout = 40;

    public int $uniqueFor = 86400;

    public function __construct(
        public string $leadKey,
        public string $channel,
        public array $lead
    ) {
        // A queued alert must not run before the CRM lead transaction commits.
        $this->afterCommit();
        $this->onQueue('lead-alerts');
    }

    public function uniqueId(): string
    {
        return "{$this->channel}:{$this->leadKey}";
    }

    public function handle(WhatsAppCloudApi $whatsApp): void
    {
        if (! in_array($this->channel, ['email', 'whatsapp'], true)) {
            throw new RuntimeException('Unsupported lead alert channel.');
        }

        $delivery = DB::transaction(function (): ?LeadNotificationDelivery {
            $row = LeadNotificationDelivery::query()->firstOrCreate(
                ['lead_key' => $this->leadKey, 'channel' => $this->channel],
                ['status' => 'pending', 'attempts' => 0]
            );

            $row = LeadNotificationDelivery::query()
                ->whereKey($row->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            // A repeated dispatch must not send a second alert after success.
            if ($row->status === 'sent') {
                return null;
            }

            $row->status = 'sending';
            $row->attempts++;
            $row->last_error = null;
            $row->save();

            return $row;
        });

        if ($delivery === null) {
            return;
        }

        try {
            $providerMessageId = null;

            if ($this->channel === 'email') {
                $recipient = (string) config('lead-alerts.email_to');

                if (! filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
                    throw new RuntimeException('LEAD_ALERT_EMAIL_TO is missing or invalid.');
                }

                Mail::to($recipient)->send(new NewLeadAlert($this->lead));
            } else {
                $providerMessageId = $whatsApp->sendLeadAlert($this->lead);
            }

            $delivery->forceFill([
                'status' => 'sent',
                'provider_message_id' => $providerMessageId,
                'last_error' => null,
                'sent_at' => now(),
            ])->save();
        } catch (Throwable $exception) {
            $delivery->forceFill([
                'status' => 'failed',
                'last_error' => Str::limit($exception->getMessage(), 2000),
            ])->save();

            Log::error('GetIntoFeed lead alert delivery failed.', [
                'lead_key' => $this->leadKey,
                'channel' => $this->channel,
                'exception' => $exception::class,
                // Avoid logging the lead payload or provider credentials.
            ]);

            throw $exception; // Laravel queue retries according to $tries/$backoff.
        }
    }

    public function failed(?Throwable $exception): void
    {
        LeadNotificationDelivery::query()
            ->where('lead_key', $this->leadKey)
            ->where('channel', $this->channel)
            ->where('status', '!=', 'sent')
            ->update([
                'status' => 'failed',
                'last_error' => Str::limit($exception?->getMessage() ?? 'Queue job failed.', 2000),
                'updated_at' => now(),
            ]);
    }
}
