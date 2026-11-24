<?php

namespace App\Filament\Resources\MediaResource\Pages;

use App\Filament\Resources\MediaResource;
use App\Models\AuditLog;
use App\Models\Award;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Services\MediaService;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditMedia extends EditRecord
{
    protected static string $resource = MediaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('optimize_webp')
                ->label(fn () => $this->record->webp_path ? '⚡ Re-generate WebP' : '⚡ Convert to WebP')
                ->icon('heroicon-o-sparkles')
                ->color('success')
                ->visible(fn () => in_array($this->record->mime_type, ['image/jpeg', 'image/png', 'image/webp']))
                ->action(function () {
                    $success = MediaService::convertToWebp($this->record);
                    if ($success) {
                        $this->refreshFormData(['webp_path', 'optimized_size']);
                        $savings = $this->record->savings_percentage;
                        Notification::make()
                            ->success()
                            ->title('WebP Asset Generated')
                            ->body('High-efficiency WebP file generated successfully. '.($savings ? "Reduced file size by {$savings}%!" : ''))
                            ->send();
                    } else {
                        Notification::make()
                            ->danger()
                            ->title('WebP Optimization Failed')
                            ->body('Could not read source image or GD WebP is not supported for this file.')
                            ->send();
                    }
                }),

            Action::make('view_usages')
                ->label('View Usages')
                ->icon('heroicon-o-link')
                ->color('info')
                ->modalHeading(fn () => "Content Referencing #{$this->record->id} ({$this->record->file_name})")
                ->modalContent(fn () => view('filament.widgets.media-usages-modal', ['usages' => $this->record->getUsages()])),

            DeleteAction::make()
                ->modalHeading('Delete Media Asset')
                ->modalDescription('Are you sure you want to delete this media asset? Physical files and active references will be cleanly unlinked.')
                ->before(function () {
                    $record = $this->record;
                    try {
                        $disk = Storage::disk($record->disk ?: 'public');
                        if ($record->file_path && $disk->exists($record->file_path)) {
                            $disk->delete($record->file_path);
                        }
                        if ($record->webp_path && $disk->exists($record->webp_path)) {
                            $disk->delete($record->webp_path);
                        }
                        if ($record->avif_path && $disk->exists($record->avif_path)) {
                            $disk->delete($record->avif_path);
                        }
                    } catch (\Throwable $e) {
                    }

                    try {
                        Service::where('hero_media_id', $record->id)->update(['hero_media_id' => null]);
                        CaseStudy::where('hero_media_id', $record->id)->update(['hero_media_id' => null]);
                        BlogPost::where('featured_media_id', $record->id)->update(['featured_media_id' => null]);
                        if (class_exists(TeamMember::class)) {
                            TeamMember::where('avatar_media_id', $record->id)->update(['avatar_media_id' => null]);
                        }
                        if (class_exists(Testimonial::class)) {
                            Testimonial::where('avatar_media_id', $record->id)->update(['avatar_media_id' => null]);
                        }
                        if (class_exists(Award::class)) {
                            Award::where('badge_media_id', $record->id)->update(['badge_media_id' => null]);
                        }
                    } catch (\Throwable $e) {
                    }
                }),
        ];
    }

    protected function afterSave(): void
    {
        AuditLog::log('UPDATE', $this->record, null, $this->record->toArray());
    }
}
