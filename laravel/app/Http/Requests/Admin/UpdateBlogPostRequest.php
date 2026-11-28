<?php

namespace App\Http\Requests\Admin;

use App\Models\BlogPost;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogPostRequest extends FormRequest
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
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:2000'],
            'content_html' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'content_json' => ['nullable', 'array'],
            'status' => ['nullable', 'in:draft,review,scheduled,published,trashed'],
            'visibility' => ['nullable', 'in:public,unlisted,private'],
            'published_at' => ['nullable', 'date'],
            'scheduled_at' => ['nullable', 'date'],
            'scheduled_for' => ['nullable', 'date'],
            'category' => ['nullable', 'string', 'max:120'],
            'tags' => ['nullable', 'array', 'max:30'],
            'tags.*' => ['string', 'max:60'],
            'featured_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'featured_image_alt' => ['nullable', 'string', 'max:255'],
            'author_name' => ['nullable', 'string', 'max:120'],
            'author_role' => ['nullable', 'string', 'max:120'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:500'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'focus_keyphrase' => ['nullable', 'string', 'max:255'],
            'secondary_keyphrases' => ['nullable', 'array', 'max:30'],
            'secondary_keyphrases.*' => ['string', 'max:120'],
            'schema_type' => ['nullable', 'in:BlogPosting,NewsArticle,HowTo,FAQPage,Article,TechArticle'],
            'faq_json' => ['nullable', 'array'],
            'faq_items' => ['nullable', 'array'],
            'robots_index' => ['nullable', 'boolean'],
            'robots_follow' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'seo_score' => ['nullable', 'integer', 'min:0', 'max:100'],
            'editor_mode' => ['nullable', 'in:tiptap,classic,markdown,blocks'],
            'version' => ['nullable', 'integer', 'min:1'],
            'change_summary' => ['nullable', 'string', 'max:255'],
        ];
    }
}
