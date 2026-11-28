<?php

namespace App\Support;

use App\Jobs\SendLeadAlert;
use Illuminate\Support\Str;
use InvalidArgumentException;

class LeadAlertDispatcher
{
    /**
     * Call this AFTER the existing CRM lead has been saved.
     * $leadKey must be stable, e.g. "crm_leads:123".
     */
    public function dispatch(string|int $leadId, array $lead, string $source = 'Website'): void
    {
        if (! config('lead-alerts.enabled')) {
            return;
        }

        $leadId = trim((string) $leadId);

        if ($leadId === '') {
            throw new InvalidArgumentException('A saved CRM lead ID is required for notification deduplication.');
        }

        $payload = [
            'name' => $this->clean($lead['name'] ?? null, 'Not provided', 120),
            'email' => $this->clean($lead['email'] ?? null, 'Not provided', 180),
            'phone' => $this->clean($lead['phone'] ?? null, 'Not provided', 40),
            'service' => $this->clean($lead['service'] ?? null, 'Not specified', 160),
            'message' => $this->clean($lead['message'] ?? null, 'No message', 900),
            'source' => $this->clean($source, 'Website', 100),
            'created_at' => now()->format('d M Y, h:i A'),
        ];

        SendLeadAlert::dispatch("crm_leads:{$leadId}", 'email', $payload);

        if (config('lead-alerts.whatsapp_enabled')) {
            SendLeadAlert::dispatch("crm_leads:{$leadId}", 'whatsapp', $payload);
        }
    }

    private function clean(mixed $value, string $fallback, int $limit): string
    {
        $value = trim(strip_tags((string) $value));

        return Str::limit($value !== '' ? $value : $fallback, $limit, '…');
    }
}
