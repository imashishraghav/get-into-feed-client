<?php

namespace App\Http\Requests\Admin;

use App\Models\BlogPost;
use Illuminate\Foundation\Http\FormRequest;

class RestoreRevisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = $this->route('post');
        if (! $post instanceof BlogPost) {
            return false;
        }

        return $this->user()?->can('restoreRevision', $post) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'version' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
