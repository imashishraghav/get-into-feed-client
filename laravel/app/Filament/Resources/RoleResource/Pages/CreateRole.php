<?php

namespace App\Filament\Resources\RoleResource\Pages;

use App\Filament\Resources\RoleResource;
use App\Models\AuditLog;
use Filament\Resources\Pages\CreateRecord;

class CreateRole extends CreateRecord
{
    protected static string $resource = RoleResource::class;

    protected function afterCreate(): void
    {
        AuditLog::log('CREATE', $this->record, null, $this->record->toArray());
    }
}
