<?php

namespace App\Filament\Resources\SubscriberResource\Pages;

use App\Filament\Resources\SubscriberResource;
use App\Models\AuditLog;
use Filament\Resources\Pages\CreateRecord;

class CreateSubscriber extends CreateRecord
{
    protected static string $resource = SubscriberResource::class;

    protected function afterCreate(): void
    {
        AuditLog::log('CREATE', $this->record, null, $this->record->toArray());
    }
}
