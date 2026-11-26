<?php

namespace App\Services;

use App\Models\BlogPost;
use Illuminate\Support\Str;

class SeoSchemaService
{
    /**
     * Build machine-readable JSON-LD structured data graph for a BlogPost.
     *
     * @return array<string, mixed>
     */
    public function buildForBlogPost(BlogPost $post): array
    {
        $canonical = trim((string) ($post->canonical_url ?: "https://getintofeed.com/blog/{$post->slug}"));
        $title = trim((string) ($post->meta_title ?: $post->seo_title ?: $post->title));
        $desc = trim((string) ($post->meta_description ?: Str::limit(strip_tags((string) ($post->excerpt ?: $post->content_html ?: $post->content)), 155, '')));
        $image = trim((string) ($post->og_image ?: $post->featuredMedia?->url ?: 'https://getintofeed.com/agency-hero.jpg'));
        $schemaType = in_array($post->schema_type, ['BlogPosting', 'NewsArticle', 'HowTo', 'FAQPage', 'Article', 'TechArticle'], true)
            ? $post->schema_type
            : 'BlogPosting';

        $graph = [
            [
                '@type' => $schemaType === 'FAQPage' ? 'BlogPosting' : $schemaType,
                '@id' => $canonical.'#article',
                'headline' => $title ?: $post->title,
                'description' => $desc,
                'image' => [$image],
                'url' => $canonical,
                'datePublished' => ($post->published_at ?? $post->created_at ?? now())->toIso8601String(),
                'dateModified' => ($post->updated_at ?? now())->toIso8601String(),
                'wordCount' => (int) ($post->word_count ?? 0),
                'author' => [
                    '@type' => 'Person',
                    'name' => $post->author_name ?: ($post->author?->name ?: 'GetIntoFeed Collective'),
                    'jobTitle' => $post->author_role ?: 'Growth Strategist',
                ],
                'publisher' => [
                    '@type' => 'Organization',
                    '@id' => 'https://getintofeed.com/#organization',
                    'name' => 'GetIntoFeed',
                    'url' => 'https://getintofeed.com/',
                ],
            ],
        ];

        $faqItems = is_array($post->faq_json) && $post->faq_json !== []
            ? $post->faq_json
            : (is_array($post->faq_items) ? $post->faq_items : []);

        $mainEntity = [];
        foreach ($faqItems as $item) {
            if (! is_array($item)) {
                continue;
            }
            $q = trim((string) ($item['q'] ?? ($item['question'] ?? '')));
            $a = trim((string) ($item['a'] ?? ($item['answer'] ?? '')));
            if ($q !== '' && $a !== '') {
                $mainEntity[] = [
                    '@type' => 'Question',
                    'name' => $q,
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => $a,
                    ],
                ];
            }
        }

        if ($mainEntity !== []) {
            $graph[] = [
                '@type' => 'FAQPage',
                '@id' => $canonical.'#faq',
                'mainEntity' => $mainEntity,
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@graph' => $graph,
        ];
    }
}
