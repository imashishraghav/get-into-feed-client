<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeadRequest;
use App\Jobs\SyncLeadToCrmJob;
use App\Models\Lead;
use App\Support\LeadAlertDispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LeadController extends Controller
{
    public function store(StoreLeadRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // 1. Honeypot anti-spam check (bots filling hidden fields)
        if (! empty($request->input('hp_field')) || ! empty($request->input('bot_check')) || ! empty($request->input('website_url_check'))) {
            return response()->json([
                'success' => true,
                'message' => 'Thank you! Your growth enquiry has been submitted. Our team will contact you shortly.',
                'leadId' => 'LEAD-'.strtoupper(Str::random(8)),
                'lead_code' => 'LEAD-'.strtoupper(Str::random(8)),
            ], 201);
        }

        // 2. Normalization
        $clientName = trim($validated['name'] ?? '') ?: 'Inbound Client';
        $clientEmail = ! empty($validated['email']) ? strtolower(trim($validated['email'])) : null;
        $normalizedPhone = $this->normalizePhoneNumber($validated['phone'] ?? null);

        // 3. Prevent duplicate rapid submissions within 5 minutes (300 seconds)
        if ($clientEmail || $normalizedPhone) {
            $duplicateQuery = Lead::where('created_at', '>=', now()->subSeconds(300));
            $duplicateQuery->where(function ($q) use ($clientEmail, $normalizedPhone) {
                if ($clientEmail && $normalizedPhone) {
                    $q->where('email', $clientEmail)->orWhere('phone', $normalizedPhone);
                } elseif ($clientEmail) {
                    $q->where('email', $clientEmail);
                } elseif ($normalizedPhone) {
                    $q->where('phone', $normalizedPhone);
                }
            });

            $recentDuplicate = $duplicateQuery->first();
            if ($recentDuplicate) {
                return response()->json([
                    'success' => true,
                    'message' => 'Thank you! We have already received your enquiry. Our team is actively reviewing it.',
                    'leadId' => $recentDuplicate->lead_code,
                    'lead_code' => $recentDuplicate->lead_code,
                ], 200);
            }
        }

        $leadCode = 'LEAD-'.strtoupper(Str::random(8));

        // Format message from notes/requirements if needed
        $messageContent = $validated['message'] ?? $validated['note'] ?? $validated['requirements'] ?? null;

        // Clean company/business name (eliminate fake fallback labels)
        $companyVal = null;
        if (! empty($validated['company']) && ! in_array(strtolower($validated['company']), ['direct web inquiry', 'direct client', 'contact page form'])) {
            $companyVal = trim($validated['company']);
        } elseif (! empty($validated['business']) && ! in_array(strtolower($validated['business']), ['direct web inquiry', 'direct client', 'contact page form'])) {
            $companyVal = trim($validated['business']);
        }

        // Clean budget (eliminate fake fallback labels)
        $budgetVal = null;
        if (! empty($validated['budget']) && ! in_array(strtolower($validated['budget']), ['direct inbound', 'inbound consultation'])) {
            $budgetVal = trim($validated['budget']);
        }

        // Extract real-time origin metadata
        $pageUrl = $request->input('page_url') ?: $request->header('referer') ?: 'https://getintofeed.com';
        $pageTitle = $request->input('page_title') ?: 'GetIntoFeed Website';
        $referrer = $request->input('referrer') ?: $request->header('referer') ?: 'Direct Traffic';
        $formType = $request->input('form_type') ?: $request->input('source') ?: 'Inbound Lead Form';

        // DPDP Consent verification
        $hasConsent = filter_var($request->input('consent', true), FILTER_VALIDATE_BOOLEAN);

        // Intelligent Lead Scoring & Priority Calculation
        [$score, $priority] = $this->calculateLeadScore($validated, $normalizedPhone, $clientEmail);

        $lead = Lead::create([
            'lead_code' => $leadCode,
            'name' => $clientName,
            'email' => $clientEmail,
            'phone' => $normalizedPhone,
            'whatsapp' => ! empty($validated['whatsapp']) ? $this->normalizePhoneNumber($validated['whatsapp']) : $normalizedPhone,
            'company' => $companyVal,
            'city' => $validated['city'] ?? null,
            'industry' => $validated['industry'] ?? null,
            'website' => $validated['website'] ?? null,
            'interested_service' => $validated['service'] ?? $validated['interested_service'] ?? 'General Growth Consultation',
            'message' => $messageContent,
            'budget' => $budgetVal,
            'source' => $validated['source'] ?? $formType,
            'page_url' => $pageUrl,
            'page_title' => $pageTitle,
            'referrer' => $referrer,
            'form_type' => $formType,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
            'utm_term' => $validated['utm_term'] ?? null,
            'utm_content' => $validated['utm_content'] ?? null,
            'gclid' => $validated['gclid'] ?? null,
            'fbclid' => $validated['fbclid'] ?? null,
            'consent_at' => $hasConsent ? now() : null,
            'consent_ip' => $hasConsent ? $request->ip() : null,
            'status' => 'New',
            'stage' => 'New',
            'crm_sync_status' => 'pending',
            'score' => $score,
            'priority' => $priority,
            'sla_due_at' => now()->addMinutes(15),
        ]);

        // Dispatch asynchronous queued job to sync lead to external CRM (crm.getintofeed.com)
        try {
            SyncLeadToCrmJob::dispatch($lead);
        } catch (\Throwable $syncEx) {
            Log::warning("[LeadController] Failed to dispatch SyncLeadToCrmJob for {$lead->lead_code}: ".$syncEx->getMessage());
        }

        // Lead Alert Dispatcher (Email + WhatsApp with deduplication & delivery tracking)
        try {
            app(LeadAlertDispatcher::class)->dispatch(
                (string) $lead->getKey(),
                [
                    'name' => $lead->name,
                    'email' => $lead->email ?? 'N/A',
                    'phone' => $lead->phone ?? 'N/A',
                    'service' => $lead->interested_service,
                    'message' => $lead->message,
                ],
                $lead->source ?? 'Website Lead Form'
            );
        } catch (\Throwable $dispatchEx) {
            Log::warning("Failed to dispatch lead alerts for {$lead->lead_code}: ".$dispatchEx->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Thank you! Your growth enquiry has been submitted. Our team will contact you within 15 minutes.',
            'leadId' => $lead->lead_code,
            'lead_code' => $lead->lead_code,
            'score' => $score,
            'priority' => $priority,
        ], 201);
    }

    /**
     * Normalizes phone numbers to standard E.164 international format.
     */
    protected function normalizePhoneNumber(?string $phone): ?string
    {
        if (empty($phone)) {
            return null;
        }

        $trimmed = trim($phone);
        $hasPlus = str_starts_with($trimmed, '+');
        $digits = preg_replace('/[^0-9]/', '', $trimmed);

        if (empty($digits)) {
            return null;
        }

        // Handle double zero international prefix 00...
        if (str_starts_with($digits, '00')) {
            return '+'.substr($digits, 2);
        }

        // Standard Indian mobile (10 digits)
        if (strlen($digits) === 10) {
            return '+91'.$digits;
        }

        // 11 digits starting with 0 (e.g. 09876543210 in India)
        if (strlen($digits) === 11 && str_starts_with($digits, '0')) {
            return '+91'.substr($digits, 1);
        }

        // 12 digits starting with 91
        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            return '+'.$digits;
        }

        return '+'.$digits;
    }

    /**
     * Calculates data-driven lead quality score and response priority.
     */
    protected function calculateLeadScore(array $data, ?string $normalizedPhone, ?string $email): array
    {
        $score = 15; // Base inbound intent score

        // 1. Contactability
        if (! empty($normalizedPhone) && strlen($normalizedPhone) >= 10) {
            $score += 20;
        }

        if (! empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com', 'icloud.com'];
            $domain = strtolower(substr(strrchr($email, '@'), 1));
            if (! in_array($domain, $freeDomains)) {
                $score += 25; // High-value verified corporate domain
            } else {
                $score += 15;
            }
        }

        // 2. Firmographics / Company Presence
        if (! empty($data['company']) || ! empty($data['business']) || ! empty($data['website'])) {
            $score += 15;
        }

        // 3. Clear Commercial Budget Intent
        if (! empty($data['budget']) && ! in_array(strtolower($data['budget']), ['not sure', 'exploring', 'direct inbound', 'inbound consultation'])) {
            $score += 15;
        }

        // 4. Strategic High-Value Service Focus
        $service = strtolower($data['service'] ?? $data['interested_service'] ?? '');
        if (str_contains($service, 'growth') || str_contains($service, 'ads') || str_contains($service, 'meta') || str_contains($service, 'google') || str_contains($service, 'funnel')) {
            $score += 10;
        }

        // Determine Priority Tier
        if ($score >= 70) {
            $priority = 'Urgent';
        } elseif ($score >= 50) {
            $priority = 'High';
        } elseif ($score >= 30) {
            $priority = 'Medium';
        } else {
            $priority = 'Low';
        }

        return [$score, $priority];
    }
}
