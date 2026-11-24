<?php

namespace App\Filament\Resources\RedirectResource\Pages;

use App\Filament\Resources\RedirectResource;
use App\Models\AuditLog;
use Filament\Resources\Pages\CreateRecord;

class CreateRedirect extends CreateRecord
{
    protected static string $resource = RedirectResource::class;

    protected function afterCreate(): void
    {
        AuditLog::log('CREATE', $this->record, null, $this->record->toArray());
    }
}
