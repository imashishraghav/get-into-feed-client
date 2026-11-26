<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCrmIngestRequest;
use App\Jobs\SyncLeadToCrmJob;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Hardened public website lead ingest bridge.
 * Temporary endpoint until feedos-api (/api/v1) goes live in Phase 3.
 * Enforces: rate limiting (route middleware), honeypot interception,
 * FormRequest payload validation, required DPDP consent, and zero PII logging.
 */
class CrmIngestController extends Controller
{
    private const HONEYPOT_FIELDS = [
        'website_hp',
        'honeypot',
        'middle_name',
        'hp_field',
        'bot_check',
        'website_url_check',
    ];

    public function store(StoreCrmIngestRequest $request): JsonResponse
    {
        // 1. Silent honeypot trap: return opaque success without persisting or logging PII
        foreach (self::HONEYPOT_FIELDS as $trapField) {
            if (! empty($request->input($trapField))) {
                return response()->json([
                    'success' => true,
                    'lead_code' => 'ENQ-'.strtoupper(Str::random(8)),
                    'message' => 'Thank you! Your enquiry has been received.',
                ], 201);
            }
        }

        $validated = $request->validated();
        $rawPhone = $validated['phone'] ?? $validated['mobile'] ?? $validated['contact'] ?? null;
        $rawEmail = $validated['email'] ?? $validated['user_email'] ?? null;
        $normalizedPhone = $this->normalizeIndianPhone($rawPhone);
        $normalizedEmail = ! empty($rawEmail) ? strtolower(trim($rawEmail)) : null;

        // 2. Deduplicate rapid repeat submissions within 5 minutes
        if ($normalizedEmail || $normalizedPhone) {
            $duplicate = Lead::where('created_at', '>=', now()->subSeconds(300))
                ->where(function ($query) use ($normalizedEmail, $normalizedPhone) {
                    if ($normalizedEmail && $normalizedPhone) {
                        $query->where('email', $normalizedEmail)->orWhere('phone', $normalizedPhone);
                    } elseif ($normalizedEmail) {
                        $query->where('email', $normalizedEmail);
                    } else {
                        $query->where('phone', $normalizedPhone);
                    }
                })
                ->first();

            if ($duplicate) {
                return response()->json([
                    'success' => true,
                    'lead_code' => $duplicate->lead_code,
                    'message' => 'Thank you! Your enquiry is already under review.',
                ], 200);
            }
        }

        $leadCode = 'ENQ-'.strtoupper(Str::random(8));
        $serviceInterest = $validated['service_interest']
            ?? $validated['service']
            ?? $validated['interested_service']
            ?? 'General Growth Consultation';

        $lead = Lead::create([
            'lead_code' => $leadCode,
            'name' => trim($validated['name'] ?? '') ?: 'Inbound Visitor',
            'email' => $normalizedEmail,
            'phone' => $normalizedPhone,
            'whatsapp' => ! empty($validated['whatsapp'])
                ? $this->normalizeIndianPhone($validated['whatsapp'])
                : $normalizedPhone,
            'company' => trim($validated['company'] ?? $validated['business_name'] ?? '') ?: null,
            'city' => $validated['city'] ?? null,
            'industry' => $validated['what_they_sell'] ?? null,
            'website' => $validated['website'] ?? null,
            'interested_service' => $serviceInterest,
            'message' => $validated['primary_bottleneck'] ?? $validated['message'] ?? null,
            'budget' => $validated['budget_range'] ?? $validated['budget'] ?? null,
            'source' => 'Website FeedCapture',
            'page_url' => $validated['landing_page'] ?? $validated['page_url'] ?? 'https://getintofeed.com',
            'page_title' => $validated['page_title'] ?? null,
            'referrer' => $validated['referrer'] ?? null,
            'form_type' => 'feed-capture',
            'ip_address' => null, // Minimise PII storage on temporary website bridge
            'user_agent' => $validated['device'] ?? null,
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
            'utm_term' => $validated['utm_term'] ?? null,
            'utm_content' => $validated['utm_content'] ?? null,
            'gclid' => $validated['gclid'] ?? null,
            'fbclid' => $validated['fbclid'] ?? null,
            'consent_at' => now(),
            'consent_ip' => null, // Avoid logging raw client IP on ingest logs
            'status' => 'New',
            'stage' => 'New',
            'is_test' => false,
            'crm_sync_status' => 'pending',
            'score' => 0,
            'priority' => 'Medium',
            'sla_due_at' => now()->addMinutes(5),
        ]);

        // Zero PII logging: only log opaque lead_code & exception class if queue dispatch fails
        try {
            SyncLeadToCrmJob::dispatch($lead);
        } catch (\Throwable $e) {
            Log::warning('[CrmIngest] Async sync dispatch failed', [
                'lead_code' => $lead->lead_code,
                'exception' => get_class($e),
            ]);
        }

        // Response intentionally omits PII
        return response()->json([
            'success' => true,
            'lead_code' => $lead->lead_code,
            'message' => 'Thank you! Your enquiry has been received.',
        ], 201);
    }

    private function normalizeIndianPhone(?string $phone): ?string
    {
        if (empty($phone)) {
            return null;
        }

        $digits = preg_replace('/[^0-9]/', '', trim($phone));
        if (empty($digits)) {
            return null;
        }

        if (str_starts_with($digits, '00')) {
            return '+'.substr($digits, 2);
        }

        if (strlen($digits) >= 10) {
            $last10 = substr($digits, -10);
            if (strlen($digits) === 10 || (strlen($digits) === 11 && str_starts_with($digits, '0')) || (strlen($digits) === 12 && str_starts_with($digits, '91'))) {
                return '+91'.$last10;
            }
        }

        return '+'.$digits;
    }
}
