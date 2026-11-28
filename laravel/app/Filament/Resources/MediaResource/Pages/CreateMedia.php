<?php

namespace App\Filament\Resources\MediaResource\Pages;

use App\Filament\Resources\MediaResource;
use App\Models\AuditLog;
use App\Services\MediaService;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreateMedia extends CreateRecord
{
    protected static string $resource = MediaResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['uploaded_by_user_id'] = auth()->id();
        $data['disk'] = 'public';

        if (! empty($data['file_path'])) {
            $meta = MediaService::extractMetadata('public', $data['file_path']);
            $data['file_size'] = $meta['file_size'] ?? 0;
            $data['mime_type'] = $meta['mime_type'] ?? 'application/octet-stream';
            $data['width'] = $meta['width'] ?? null;
            $data['height'] = $meta['height'] ?? null;
            $data['file_hash'] = $meta['file_hash'] ?? null;

            if (empty($data['file_name'])) {
                $data['file_name'] = basename($data['file_path']);
            }
            if (empty($data['title'])) {
                $data['title'] = ucwords(str_replace(['-', '_'], ' ', pathinfo($data['file_name'], PATHINFO_FILENAME)));
            }

            // Check duplicate
            if (! empty($data['file_hash'])) {
                $dup = MediaService::findDuplicate($data['file_hash']);
                if ($dup) {
                    Notification::make()
                        ->warning()
                        ->title('Potential Duplicate Asset')
                        ->body("An identical file already exists: #{$dup->id} ({$dup->file_name}). Reusing existing media is recommended to save storage.")
                        ->persistent()
                        ->send();
                }
            }
        }

        return $data;
    }

    protected function afterCreate(): void
    {
        // Automatically attempt WebP optimization if image is JPEG or PNG
        if (in_array($this->record->mime_type, ['image/jpeg', 'image/png'])) {
            MediaService::convertToWebp($this->record);
        }

        AuditLog::log('CREATE', $this->record, null, $this->record->toArray());
    }
}
