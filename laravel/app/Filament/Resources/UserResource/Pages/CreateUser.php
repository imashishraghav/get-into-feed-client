<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use App\Models\AuditLog;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Validation\ValidationException;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (($data['role'] ?? null) === 'superadmin' && ! auth()->user()?->isSuperAdmin()) {
            throw ValidationException::withMessages([
                'data.role' => 'Only a super administrator can create another super administrator.',
            ]);
        }

        return $data;
    }

    protected function afterCreate(): void
    {
        $payload = $this->record->toArray();
        unset($payload['password']);
        AuditLog::log('CREATE', $this->record, null, $payload);
    }
}
