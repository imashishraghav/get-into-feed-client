<?php

namespace App\Filament\Resources\SettingResource\Pages;

use App\Filament\Resources\SettingResource;
use App\Models\AuditLog;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSetting extends EditRecord
{
    protected static string $resource = SettingResource::class;

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
