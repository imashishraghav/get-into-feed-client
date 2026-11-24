<?php

namespace App\Filament\Resources\ServiceResource\Pages;

use App\Filament\Resources\ServiceResource;
use App\Models\AuditLog;
use Filament\Resources\Pages\CreateRecord;

class CreateService extends CreateRecord
{
    protected static string $resource = ServiceResource::class;

    protected function afterCreate(): void
    {
        $seoData = $this->data['seo'] ?? null;
        if (is_array($seoData)) {
            $this->record->seo()->create([
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
            ]);
        }

        AuditLog::log('CREATE', $this->record, null, $this->record->toArray());
    }
}
