<?php

namespace App\Http\Requests\Admin;

use App\Models\Redirect;
use Illuminate\Foundation\Http\FormRequest;

class StoreRedirectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Redirect::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'source_url' => ['required', 'string', 'max:255'],
            'target_url' => ['required', 'string', 'max:500', 'different:source_url'],
            'status_code' => ['nullable', 'integer', 'in:301,302,307,308'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
