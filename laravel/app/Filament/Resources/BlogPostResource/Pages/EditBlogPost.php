<?php

namespace App\Filament\Resources\BlogPostResource\Pages;

use App\Filament\Resources\BlogPostResource;
use App\Models\AuditLog;
use App\Models\Revision;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\HtmlString;

class EditBlogPost extends EditRecord
{
    protected static string $resource = BlogPostResource::class;

    protected ?array $previousValues = null;

    public function getBreadcrumbs(): array
    {
        return [];
    }

    public function getTitle(): string|Htmlable
    {
        $createUrl = BlogPostResource::getUrl('create');

        return new HtmlString('
            <div style="display: inline-flex; align-items: center; gap: 12px;">
                <span style="font-size: 22px; font-weight: 400; color: #1d2327; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen-Sans, Ubuntu, Cantarell, \'Helvetica Neue\', sans-serif;">Edit Post</span>
                <a href="'.$createUrl.'" style="display: inline-flex; align-items: center; justify-content: center; height: 26px; padding: 0 10px; font-size: 13px; font-weight: 400; line-height: 1; border: 1px solid #2271b1; border-radius: 3px; background: #ffffff; color: #2271b1; text-decoration: none; cursor: pointer; transition: all 0.15s ease-in-out; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen-Sans, Ubuntu, Cantarell, \'Helvetica Neue\', sans-serif;" onmouseover="this.style.background=\'#f0f6fc\'" onmouseout="this.style.background=\'#ffffff\'">
                    Add New
                </a>
            </div>
        ');
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $seo = $this->record->seo;
        if ($seo) {
            $data['seo'] = [
                'seo_title' => $seo->seo_title,
                'meta_description' => $seo->meta_description,
                'focus_keyword' => $seo->focus_keyword,
                'canonical_url' => $seo->canonical_url,
                'backlinks' => $seo->backlinks ?? [],
                'robots_index' => $seo->robots_index ?? true,
                'robots_follow' => $seo->robots_follow ?? true,
                'og_title' => $seo->og_title,
                'og_description' => $seo->og_description,
                'og_media_id' => $seo->og_media_id,
                'twitter_title' => $seo->twitter_title,
                'twitter_description' => $seo->twitter_description,
                'twitter_media_id' => $seo->twitter_media_id,
                'schema_type' => $seo->schema_type ?? 'Article',
                'target_keywords' => $seo->target_keywords ?? [],
                'seo_score' => $seo->seo_score ?? 95,
                'in_sitemap' => $seo->in_sitemap ?? true,
                'sitemap_priority' => (string) ($seo->sitemap_priority ?? '0.8'),
                'sitemap_changefreq' => $seo->sitemap_changefreq ?? 'weekly',
            ];
        }

        return $data;
    }

    protected function beforeSave(): void
    {
        $this->previousValues = $this->record->toArray();
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (! auth()->user()?->hasCmsPermission('blog.publish')) {
            $data['status'] = $this->record->status;
            $data['published_at'] = $this->record->published_at;
            $data['scheduled_for'] = $this->record->scheduled_for;
        }

        return $data;
    }

    protected function afterSave(): void
    {
        // 1. Sync Polymorphic SEO Metadata
        $seoData = $this->data['seo'] ?? null;
        if (is_array($seoData)) {
            $this->record->seo()->updateOrCreate(
                [
                    'seoble_type' => get_class($this->record),
                    'seoble_id' => $this->record->id,
                ],
                [
                    'seo_title' => $seoData['seo_title'] ?? null,
                    'meta_description' => $seoData['meta_description'] ?? null,
                    'focus_keyword' => $seoData['focus_keyword'] ?? null,
                    'target_keywords' => $seoData['target_keywords'] ?? [],
                    'canonical_url' => $seoData['canonical_url'] ?? null,
                    'backlinks' => $seoData['backlinks'] ?? [],
                    'robots_index' => (bool) ($seoData['robots_index'] ?? true),
                    'robots_follow' => (bool) ($seoData['robots_follow'] ?? true),
                    'in_sitemap' => (bool) ($seoData['in_sitemap'] ?? true),
                    'sitemap_priority' => $seoData['sitemap_priority'] ?? 0.8,
                    'sitemap_changefreq' => $seoData['sitemap_changefreq'] ?? 'weekly',
                    'og_title' => $seoData['og_title'] ?? null,
                    'og_description' => $seoData['og_description'] ?? null,
                    'og_media_id' => $seoData['og_media_id'] ?? null,
                    'twitter_title' => $seoData['twitter_title'] ?? null,
                    'twitter_description' => $seoData['twitter_description'] ?? null,
                    'twitter_media_id' => $seoData['twitter_media_id'] ?? null,
                    'schema_type' => $seoData['schema_type'] ?? 'Article',
                ]
            );
        }

        // 2. Log Audit
        AuditLog::log('UPDATE', $this->record, $this->previousValues, $this->record->toArray());

        $version = Revision::where('revisable_type', get_class($this->record))
            ->where('revisable_id', $this->record->id)
            ->count() + 1;

        Revision::create([
            'revisable_type' => get_class($this->record),
            'revisable_id' => $this->record->id,
            'user_id' => auth()->id(),
            'version_number' => $version,
            'payload' => $this->record->toArray(),
        ]);
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
}
