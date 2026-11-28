<?php

namespace App\Filament\Resources\CaseStudyResource\Pages;

use App\Filament\Resources\CaseStudyResource;
use App\Models\AuditLog;
use App\Models\Revision;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditCaseStudy extends EditRecord
{
    protected static string $resource = CaseStudyResource::class;

    protected ?array $previousValues = null;

    protected function beforeSave(): void
    {
        $this->previousValues = $this->record->toArray();
    }

    protected function afterSave(): void
    {
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
                ->url(fn () => "https://getintofeed.com/case-studies/{$this->record->slug}", true),
            Action::make('revisions')
                ->label('Revisions')
                ->icon('heroicon-o-clock')
                ->color('gray')
                ->modalHeading('Revision History')
                ->modalDescription('Historical snapshots recorded for this case study:')
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
