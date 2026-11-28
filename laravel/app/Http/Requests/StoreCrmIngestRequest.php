<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCrmIngestRequest extends FormRequest
{
    /**
     * Public website lead ingestion endpoint (temporary bridge until feedos-api Phase 3).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Strict validation rules with mandatory explicit DPDP consent.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:120',
            'email' => 'required_without_all:phone,mobile,contact|nullable|email:filter|max:180',
            'phone' => 'required_without_all:email,user_email,mobile,contact|nullable|string|max:30',
            'mobile' => 'nullable|string|max:30',
            'contact' => 'nullable|string|max:30',
            'user_email' => 'nullable|email:filter|max:180',
            'whatsapp' => 'nullable|string|max:30',
            'company' => 'nullable|string|max:150',
            'business_name' => 'nullable|string|max:150',
            'website' => 'nullable|string|max:255',
            'what_they_sell' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'service' => 'nullable|string|max:150',
            'service_interest' => 'nullable|string|max:150',
            'interested_service' => 'nullable|string|max:150',
            'budget' => 'nullable|string|max:100',
            'budget_range' => 'nullable|string|max:100',
            'message' => 'nullable|string|max:2000',
            'primary_bottleneck' => 'nullable|string|max:2000',
            'landing_page' => 'nullable|string|max:500',
            'page_url' => 'nullable|string|max:500',
            'page_title' => 'nullable|string|max:255',
            'referrer' => 'nullable|string|max:500',
            'utm_source' => 'nullable|string|max:100',
            'utm_medium' => 'nullable|string|max:100',
            'utm_campaign' => 'nullable|string|max:100',
            'utm_term' => 'nullable|string|max:100',
            'utm_content' => 'nullable|string|max:100',
            'gclid' => 'nullable|string|max:120',
            'fbclid' => 'nullable|string|max:120',
            'device' => 'nullable|string|in:mobile,desktop,tablet',
            'consent' => 'required|accepted',
            'consent_notice_version' => 'nullable|string|max:50',
            'consent_notice_text' => 'nullable|string|max:500',
            'consent_timestamp' => 'nullable|date',
            // Honeypot trap fields inspected silently in CrmIngestController
            'website_hp' => 'nullable|string|max:500',
            'honeypot' => 'nullable|string|max:500',
            'middle_name' => 'nullable|string|max:500',
            'hp_field' => 'nullable|string|max:500',
            'bot_check' => 'nullable|string|max:500',
            'website_url_check' => 'nullable|string|max:500',
        ];
    }

    /**
     * Plain-language validation messages without exposing internals.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'consent.required' => 'Explicit consent is required under DPDP Act compliance.',
            'consent.accepted' => 'Explicit consent must be accepted before submitting.',
            'email.required_without_all' => 'Please provide a valid email address or phone number.',
            'phone.required_without_all' => 'Please provide a phone number or valid email address.',
        ];
    }
}
