<?php

namespace App\Filament\Resources\BlogPostResource\Pages;

use App\Filament\Resources\BlogPostResource;
use App\Models\AuditLog;
use App\Models\PostAutosave;
use App\Models\Revision;
use App\Services\BlogPostService;
use App\Services\HtmlSanitizerService;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class EditBlogPost extends EditRecord
{
    protected static string $resource = BlogPostResource::class;

    protected ?array $previousValues = null;

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
        $createUrl = BlogPostResource::getUrl('create');

        return new HtmlString('
            <div class="flex flex-wrap items-center gap-3">
                <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">Edit Post</span>
                <span class="gif-studio-pill">Editorial Studio + SEO PRO</span>
                <a href="'.$createUrl.'" class="gif-add-new-btn">
                    + Add New
                </a>
            </div>
        ');
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $seo = $this->record->seo;
        $hasDirectSeo = ! empty($data['seo_title'])
            || ! empty($data['meta_title'])
            || ! empty($data['meta_description'])
            || ! empty($data['focus_keyphrase']);

        // Safe fallbacks from legacy polymorphic SeoMetadata when new blog_posts columns are null
        $data['title'] = (string) ($data['title'] ?? '');
        $data['slug'] = (string) ($data['slug'] ?? '');
        $data['content'] = (string) ($data['content'] ?: ($data['content_html'] ?? ''));
        $data['excerpt'] = (string) ($data['excerpt'] ?? '');
        $data['featured_image_alt'] = (string) ($data['featured_image_alt'] ?: ($this->record->featuredMedia?->alt_text ?? ''));
        $data['focus_keyphrase'] = (string) ($data['focus_keyphrase'] ?: ($seo?->focus_keyword ?? ''));

        $secondary = $data['secondary_keyphrases'] ?? null;
        if (! is_array($secondary) || $secondary === []) {
            $secondary = is_array($seo?->target_keywords) ? $seo->target_keywords : [];
        }
        $data['secondary_keyphrases'] = array_values(array_filter(array_map('strval', $secondary)));

        $data['seo_title'] = (string) ($data['seo_title'] ?: ($data['meta_title'] ?: ($seo?->seo_title ?? '')));
        $data['meta_description'] = (string) ($data['meta_description'] ?: ($seo?->meta_description ?? ''));
        $data['canonical_url'] = (string) ($data['canonical_url'] ?: ($seo?->canonical_url ?? ''));
        $data['schema_type'] = $hasDirectSeo
            ? (string) ($data['schema_type'] ?: ($seo?->schema_type ?? 'BlogPosting'))
            : (string) ($seo?->schema_type ?: ($data['schema_type'] ?? 'BlogPosting'));
        $data['robots_index'] = $hasDirectSeo
            ? ($data['robots_index'] ?? ($seo?->robots_index ?? true))
            : ($seo?->robots_index ?? ($data['robots_index'] ?? true));
        $data['robots_follow'] = $hasDirectSeo
            ? ($data['robots_follow'] ?? ($seo?->robots_follow ?? true))
            : ($seo?->robots_follow ?? ($data['robots_follow'] ?? true));
        $rawFaqs = $data['faq_items'] ?? ($data['faq_json'] ?? []);
        $data['faq_items'] = is_array($rawFaqs) ? $rawFaqs : [];
        $data['og_title'] = (string) ($data['og_title'] ?: ($seo?->og_title ?? ''));
        $data['og_description'] = (string) ($data['og_description'] ?: ($seo?->og_description ?? ''));
        $data['seo_score'] = (int) ($data['seo_score'] ?? ($seo?->seo_score ?? 0));
        $data['readability_score'] = (int) ($data['readability_score'] ?? 0);
        $data['word_count'] = (int) ($data['word_count'] ?? 0);
        $data['reading_time'] = (int) ($data['reading_time'] ?? 0);
        $data['visibility'] = (string) ($data['visibility'] ?: 'public');
        $data['version'] = max(1, (int) ($data['version'] ?? 1));
        $data['scheduled_for'] = $data['scheduled_for'] ?? $data['scheduled_at'] ?? null;

        return $data;
    }

    protected function beforeSave(): void
    {
        $this->previousValues = $this->record->toArray();
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $submittedVersion = isset($data['version']) ? (int) $data['version'] : null;
        $currentVersion = max(1, (int) ($this->record->version ?: 1));
        if ($submittedVersion !== null && $submittedVersion !== $currentVersion) {
            Notification::make()
                ->title('Save Conflict Detected')
                ->body("This article was updated on another device (server version v{$currentVersion}, your tab has v{$submittedVersion}). Refresh before saving to avoid overwriting newer edits.")
                ->danger()
                ->persistent()
                ->send();

            $this->halt();
        }

        if (! auth()->user()?->hasCmsPermission('blog.publish')) {
            $data['status'] = $this->record->status;
            $data['published_at'] = $this->record->published_at;
            $data['scheduled_for'] = $this->record->scheduled_for;
        }

        $data['slug'] = ! empty($data['slug']) ? Str::slug((string) $data['slug']) : $this->record->slug;

        $sanitizedContent = app(HtmlSanitizerService::class)->sanitize((string) ($data['content'] ?? ''));
        $data['content'] = $sanitizedContent;
        $data['content_html'] = $sanitizedContent;

        $plain = trim(strip_tags($sanitizedContent));
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
        $data['faq_json'] = $data['faq_items'];
        $data['meta_title'] = $data['seo_title'] ?? '';
        $data['scheduled_at'] = $data['scheduled_for'] ?? null;
        $data['schema_type'] = $data['schema_type'] ?: 'BlogPosting';
        $data['robots_index'] = $data['robots_index'] === null ? true : (bool) $data['robots_index'];
        $data['robots_follow'] = $data['robots_follow'] === null ? true : (bool) $data['robots_follow'];
        $data['seo_score'] = max(0, min(100, (int) ($data['seo_score'] ?? 0)));
        $data['readability_score'] = max(0, min(100, (int) ($data['readability_score'] ?? 0)));
        $data['visibility'] = in_array($data['visibility'] ?? ($this->record->visibility ?? 'public'), ['public', 'unlisted', 'private'], true)
            ? ($data['visibility'] ?? ($this->record->visibility ?? 'public'))
            : 'public';
        $data['version'] = $currentVersion + 1;

        return $data;
    }

    protected function afterSave(): void
    {
        $record = $this->record;
        $service = app(BlogPostService::class);
        $service->syncSeoAndSchema($record);

        if (auth()->id()) {
            PostAutosave::query()
                ->where('blog_post_id', $record->id)
                ->where('user_id', auth()->id())
                ->delete();
        }

        $revType = ($record->status === 'published' && ($this->previousValues['status'] ?? null) !== 'published')
            ? 'publish'
            : 'manual';
        $service->captureRevision($record, auth()->user(), $revType, 'Saved in Editorial Studio');

        Cache::forget('api_blog_public_list');
        AuditLog::log('UPDATE', $record, $this->previousValues, $record->toArray());
    }

    public function restoreRevision(int $revisionId): void
    {
        $rev = Revision::where('revisable_type', get_class($this->record))
            ->where('revisable_id', $this->record->id)
            ->findOrFail($revisionId);

        $payload = $rev->payload;
        unset($payload['id'], $payload['created_at']);
        $this->record->update($payload);
        $this->fillForm();

        Notification::make()
            ->title("Restored to Revision #{$rev->version_number}")
            ->success()
            ->send();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('preview')
                ->label('Live Preview')
                ->icon('heroicon-o-arrow-top-right-on-square')
                ->color('gray')
                ->url(fn () => "https://getintofeed.com/blog/{$this->record->slug}", true),
            Action::make('revisions')
                ->label('Revisions')
                ->icon('heroicon-o-clock')
                ->color('gray')
                ->modalHeading('Revision History')
                ->modalDescription('Historical snapshots recorded for this blog article:')
                ->modalContent(function () {
                    $revs = Revision::where('revisable_type', get_class($this->record))
                        ->where('revisable_id', $this->record->id)
                        ->latest()
                        ->take(10)
                        ->get();

                    return view('filament.widgets.revisions-modal', ['revisions' => $revs]);
                }),
            DeleteAction::make()->label('Archive'),
        ];
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
