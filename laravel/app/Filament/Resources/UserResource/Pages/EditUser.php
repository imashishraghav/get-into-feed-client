<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use App\Models\AuditLog;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Validation\ValidationException;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected ?array $previousValues = null;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (($data['role'] ?? null) === 'superadmin' && ! auth()->user()?->isSuperAdmin()) {
            throw ValidationException::withMessages([
                'data.role' => 'Only a super administrator can assign the super administrator role.',
            ]);
        }

        return $data;
    }

    protected function beforeSave(): void
    {
        $this->previousValues = $this->record->toArray();
        unset($this->previousValues['password']);
    }

    protected function afterSave(): void
    {
        $payload = $this->record->toArray();
        unset($payload['password']);
        AuditLog::log('UPDATE', $this->record, $this->previousValues, $payload);
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
