<?php

namespace App\Filament\Resources\BlogPostResource\Pages;

use App\Filament\Resources\BlogPostResource;
use App\Models\AuditLog;
use App\Services\BlogPostService;
use App\Services\HtmlSanitizerService;
use Filament\Resources\Pages\CreateRecord;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class CreateBlogPost extends CreateRecord
{
    protected static string $resource = BlogPostResource::class;

    public function getMaxContentWidth(): MaxWidth|string|null
    {
        return MaxWidth::Full;
    }

    public function getBreadcrumbs(): array
    {
        return [];
    }

    public function getTitle(): string|Htmlable
    {
        return new HtmlString('
            <div class="flex items-center gap-3">
                <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">Add New Post</span>
                <span class="gif-studio-pill">Editorial Studio + SEO PRO</span>
            </div>
        ');
    }

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (! auth()->user()?->hasCmsPermission('blog.publish')) {
            $data['status'] = 'draft';
            $data['published_at'] = null;
            $data['scheduled_for'] = null;
        }

        $data['author_id'] = $data['author_id'] ?? auth()->id();
        $data['slug'] = ! empty($data['slug']) ? Str::slug((string) $data['slug']) : Str::slug((string) ($data['title'] ?? ''));

        $plain = trim(strip_tags((string) ($data['content'] ?? '')));
        $computedWords = $plain !== '' ? str_word_count($plain) : 0;
        $data['word_count'] = max($computedWords, (int) ($data['word_count'] ?? 0));
        $data['reading_time'] = max(1, (int) ceil($data['word_count'] / 200));
        if (empty($data['read_time']) || preg_match('/^\d+\s+min\s+read$/i', (string) $data['read_time'])) {
            $data['read_time'] = $data['reading_time'].' min read';
        }

        $data['secondary_keyphrases'] = is_array($data['secondary_keyphrases'] ?? null)
            ? array_values(array_filter(array_map('trim', $data['secondary_keyphrases'])))
            : [];

        $data['faq_items'] = self::normalizeFaqItems($data['faq_items'] ?? []);
        $data['schema_type'] = $data['schema_type'] ?: 'BlogPosting';
        $data['robots_index'] = $data['robots_index'] === null ? true : (bool) $data['robots_index'];
        $data['robots_follow'] = $data['robots_follow'] === null ? true : (bool) $data['robots_follow'];
        $data['seo_score'] = max(0, min(100, (int) ($data['seo_score'] ?? 0)));
        $data['readability_score'] = max(0, min(100, (int) ($data['readability_score'] ?? 0)));
        $data['visibility'] = in_array($data['visibility'] ?? 'public', ['public', 'unlisted', 'private'], true)
            ? ($data['visibility'] ?? 'public')
            : 'public';
        $data['version'] = 1;

        $sanitizedContent = app(HtmlSanitizerService::class)->sanitize((string) ($data['content'] ?? ''));
        $data['content'] = $sanitizedContent;
        $data['content_html'] = $sanitizedContent;
        $data['meta_title'] = $data['seo_title'] ?? '';
        $data['faq_json'] = $data['faq_items'];
        $data['scheduled_at'] = $data['scheduled_for'] ?? null;

        return $data;
    }

    protected function afterCreate(): void
    {
        $record = $this->record;
        $service = app(BlogPostService::class);
        $service->syncSeoAndSchema($record);
        $service->captureRevision($record, auth()->user(), $record->status === 'published' ? 'publish' : 'manual', 'Initial creation');

        Cache::forget('api_blog_public_list');
        AuditLog::log('CREATE', $record, null, $record->toArray());
    }

    /**
     * @return array<int, array{q: string, a: string}>
     */
    protected static function normalizeFaqItems(mixed $items): array
    {
        if (! is_array($items)) {
            return [];
        }

        $clean = [];
        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }
            $q = trim((string) ($item['q'] ?? ($item['question'] ?? '')));
            $a = trim((string) ($item['a'] ?? ($item['answer'] ?? '')));
            if ($q !== '' || $a !== '') {
                $clean[] = ['q' => $q, 'a' => $a];
            }
        }

        return $clean;
    }
}
