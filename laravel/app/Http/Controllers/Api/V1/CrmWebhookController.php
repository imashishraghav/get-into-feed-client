<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CrmWebhookController extends Controller
{
    /**
     * Handle inbound webhook callback from external CRM to update lead status.
     */
    public function handleStatusUpdate(Request $request): JsonResponse
    {
        $timestamp = (int) $request->header('X-Timestamp');
        $signature = $request->header('X-Signature');
        $secret = config('services.crm.secret');

        // 1. Signature & header presence check
        if (empty($signature) || empty($timestamp) || empty($secret)) {
            return response()->json(['error' => 'Missing authentication signature or timestamp'], 401);
        }

        // 2. 5-minute replay window defense (300 seconds)
        if (abs(time() - $timestamp) > 300) {
            return response()->json(['error' => 'Webhook timestamp expired (replay defense)'], 401);
        }

        // 3. Verify HMAC signature
        $rawContent = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $timestamp.'.'.$rawContent, $secret);

        if (! hash_equals($expectedSignature, $signature)) {
            Log::warning('[CrmWebhookController] Invalid HMAC signature received for CRM status webhook.');

            return response()->json(['error' => 'Invalid HMAC signature'], 403);
        }

        // 4. Process status update
        $leadUuid = $request->input('idempotency_key') ?? $request->input('uuid');
        $leadCode = $request->input('lead_code');
        $newStatus = $request->input('status');
        $crmLeadId = $request->input('crm_lead_id');

        $lead = null;
        if ($leadUuid) {
            $lead = Lead::where('uuid', $leadUuid)->first();
        }
        if (! $lead && $leadCode) {
            $lead = Lead::where('lead_code', $leadCode)->first();
        }

        if (! $lead) {
            return response()->json(['error' => 'Enquiry record not found'], 404);
        }

        $updates = [];
        if (! empty($newStatus)) {
            $updates['status'] = $newStatus;
        }
        if (! empty($crmLeadId) && empty($lead->crm_lead_id)) {
            $updates['crm_lead_id'] = (string) $crmLeadId;
        }

        if (! empty($updates)) {
            $lead->update($updates);
        }

        return response()->json([
            'success' => true,
            'message' => 'Enquiry status synchronized successfully',
            'lead_code' => $lead->lead_code,
            'status' => $lead->status,
        ]);
    }
}
