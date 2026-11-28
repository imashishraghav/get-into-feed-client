<?php

namespace App\Http\Requests\Admin;

use App\Models\BlogPost;
use Illuminate\Foundation\Http\FormRequest;

class AutosaveBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = $this->route('post');
        if (! $post instanceof BlogPost) {
            return false;
        }

        return $this->user()?->can('update', $post) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:2000'],
            'content_html' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'content_json' => ['nullable', 'array'],
            'category' => ['nullable', 'string', 'max:120'],
            'tags' => ['nullable', 'array', 'max:30'],
            'visibility' => ['nullable', 'in:public,unlisted,private'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'focus_keyphrase' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'string', 'max:500'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'faq_json' => ['nullable', 'array'],
            'faq_items' => ['nullable', 'array'],
            'featured_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'featured_image_alt' => ['nullable', 'string', 'max:255'],
            'base_version' => ['nullable', 'integer', 'min:1'],
            'version' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
