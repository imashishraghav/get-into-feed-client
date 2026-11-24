<?php

namespace App\Filament\Resources\ServiceResource\Pages;

use App\Filament\Resources\ServiceResource;
use App\Models\AuditLog;
use App\Models\Revision;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditService extends EditRecord
{
    protected static string $resource = ServiceResource::class;

    protected ?array $previousValues = null;

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
                'schema_type' => $seo->schema_type ?? 'Service',
            ];
        }

        return $data;
    }

    protected function beforeSave(): void
    {
        $this->previousValues = $this->record->toArray();
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
                    'canonical_url' => $seoData['canonical_url'] ?? null,
                    'backlinks' => $seoData['backlinks'] ?? [],
                    'robots_index' => $seoData['robots_index'] ?? true,
                    'robots_follow' => $seoData['robots_follow'] ?? true,
                    'og_title' => $seoData['og_title'] ?? null,
                    'og_description' => $seoData['og_description'] ?? null,
                    'og_media_id' => $seoData['og_media_id'] ?? null,
                    'schema_type' => $seoData['schema_type'] ?? 'Service',
                ]
            );
        }

        // 2. Log Audit
        AuditLog::log('UPDATE', $this->record, $this->previousValues, $this->record->toArray());

        // 3. Store Revision Version
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
                ->url(fn () => "https://getintofeed.com/services/{$this->record->slug}", true),
            Action::make('revisions')
                ->label('Revisions')
                ->icon('heroicon-o-clock')
                ->color('gray')
                ->modalHeading('Revision History')
                ->modalDescription('Historical snapshots recorded for this service offering:')
                ->modalContent(function () {
                    $revs = Revision::where('revisable_type', get_class($this->record))
                        ->where('revisable_id', $this->record->id)
                        ->latest()
                        ->take(10)
                        ->get();

                    return view('filament.widgets.revisions-modal', ['revisions' => $revs]);
                }),
            DeleteAction::make(),
        ];
    }
}
