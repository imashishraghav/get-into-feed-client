<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Public inbound leads are submitted by prospective clients without prior login.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'email' => 'required_without:phone|nullable|email:filter|max:255',
            'phone' => 'required_without:email|nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'business' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'industry' => 'nullable|string|max:100',
            'website' => 'nullable|string|max:255',
            'service' => 'nullable|string|max:255',
            'interested_service' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:5000',
            'note' => 'nullable|string|max:5000',
            'requirements' => 'nullable|string|max:5000',
            'budget' => 'nullable|string|max:100',
            'source' => 'nullable|string|max:255',
            'form_type' => 'nullable|string|max:255',
            'page_url' => 'nullable|string|max:1000',
            'page_title' => 'nullable|string|max:255',
            'referrer' => 'nullable|string|max:1000',
            'utm_source' => 'nullable|string|max:100',
            'utm_medium' => 'nullable|string|max:100',
            'utm_campaign' => 'nullable|string|max:100',
            'utm_term' => 'nullable|string|max:100',
            'utm_content' => 'nullable|string|max:100',
            'gclid' => 'nullable|string|max:100',
            'fbclid' => 'nullable|string|max:100',
            'consent' => 'nullable',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required_without' => 'Please provide either a valid business email or phone number.',
            'phone.required_without' => 'Please provide either a phone number or email address to receive your plan.',
            'email.email' => 'Please enter a valid email address format (e.g. name@company.com).',
            'message.max' => 'Your project summary cannot exceed 5,000 characters.',
        ];
    }
}
