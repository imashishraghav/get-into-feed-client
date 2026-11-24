<?php

namespace App\Filament\Resources\RedirectResource\Pages;

use App\Filament\Resources\RedirectResource;
use App\Models\AuditLog;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRedirect extends EditRecord
{
    protected static string $resource = RedirectResource::class;

    protected ?array $previousValues = null;

    protected function beforeSave(): void
    {
        $this->previousValues = $this->record->toArray();
    }

    protected function afterSave(): void
    {
        AuditLog::log('UPDATE', $this->record, $this->previousValues, $this->record->toArray());
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
