<?php

namespace App\Filament\Traits;

use App\Models\AuditLog;
use Carbon\Carbon;
use Filament\Forms\Components\DateTimePicker;
use Filament\Notifications\Notification;
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;

trait HasScheduledPublishing
{
    /**
     * Get standardized Status badge table column.
     */
    public static function getStatusTableColumn(): TextColumn
    {
        return TextColumn::make('status')
            ->label('Status')
            ->badge()
            ->color(fn ($state): string => match ($state) {
                'published' => 'success',
                'scheduled' => 'info',
                'review' => 'warning',
                'approved' => 'primary',
                default => 'danger',
            })
            ->formatStateUsing(fn ($state): string => match ($state) {
                'published' => 'Published',
                'scheduled' => 'Scheduled',
                'review' => 'Pending Review',
                'approved' => 'Approved',
                default => ucfirst($state ?: 'Draft'),
            })
            ->sortable();
    }

    /**
     * Get standardized Publishing Schedule / Status countdown table column.
     */
    public static function getPublishingScheduleTableColumn(): TextColumn
    {
        return TextColumn::make('publishing_schedule')
            ->label('Schedule / Live (IST)')
            ->getStateUsing(fn ($record): string => static::formatPublishingSchedule($record))
            ->badge()
            ->color(fn ($state): string => match (true) {
                str_starts_with((string) $state, '⏳') => 'info',
                str_starts_with((string) $state, '✓') => 'success',
                str_starts_with((string) $state, '🔍') => 'warning',
                str_starts_with((string) $state, '⭐') => 'primary',
                default => 'gray',
            })
            ->sortable(query: function ($query, string $direction) {
                return $query->orderBy('scheduled_for', $direction)->orderBy('published_at', $direction);
            });
    }

    /**
     * Format schedule / live text with IST timestamp and dynamic countdown.
     */
    public static function formatPublishingSchedule($record): string
    {
        $timezone = config('app.timezone', 'Asia/Kolkata');
        $now = Carbon::now($timezone);

        if ($record->status === 'scheduled') {
            if (! empty($record->scheduled_for)) {
                $scheduledAt = Carbon::parse($record->scheduled_for, $timezone);
                $countdown = $scheduledAt->isPast()
                    ? 'Due now (next cycle)'
                    : $scheduledAt->diffForHumans($now);

                return '⏳ '.$scheduledAt->format('d M Y, h:i A').' ('.$countdown.')';
            }

            return '⏳ Scheduled (Pending time)';
        }

        if ($record->status === 'published') {
            if (! empty($record->published_at)) {
                return '✓ Live: '.Carbon::parse($record->published_at, $timezone)->format('d M Y');
            }

            return '✓ Live (Published)';
        }

        if ($record->status === 'review') {
            return '🔍 Under Review';
        }

        if ($record->status === 'approved') {
            return '⭐ Approved (Ready)';
        }

        return '— Draft';
    }

    /**
     * Get standardized Status filter with Scheduled option.
     */
    public static function getStatusTableFilter(): SelectFilter
    {
        return SelectFilter::make('status')
            ->label('Publication Status')
            ->options([
                'published' => 'Published (Live)',
                'scheduled' => 'Scheduled (Automated)',
                'draft' => 'Draft (Unpublished)',
                'review' => 'In Review',
                'approved' => 'Approved',
            ]);
    }

    /**
     * Get standardized table actions for scheduling, cancelling schedule, and immediate publishing.
     */
    public static function getScheduledPublishingActions(?string $permission = null): array
    {
        return [
            Action::make('schedule_publication')
                ->label('Schedule')
                ->icon('heroicon-o-clock')
                ->color('info')
                ->visible(fn ($record) => $permission ? (auth()->user()?->hasCmsPermission($permission) ?? true) : true)
                ->modalHeading('Schedule Publication (Asia/Kolkata)')
                ->modalDescription('Specify the exact date and time (IST) when this content will automatically be published.')
                ->form([
                    DateTimePicker::make('scheduled_for')
                        ->label('Scheduled Publication Date & Time (IST)')
                        ->timezone('Asia/Kolkata')
                        ->default(function ($record) {
                            $timezone = config('app.timezone', 'Asia/Kolkata');

                            return ! empty($record->scheduled_for)
                                ? Carbon::parse($record->scheduled_for, $timezone)
                                : Carbon::now($timezone)->addHour();
                        })
                        ->minDate(fn () => Carbon::now('Asia/Kolkata'))
                        ->native(false)
                        ->required()
                        ->helperText('Configured for Asia/Kolkata (IST, UTC+5:30). The Hostinger cron publishes due content every 5 minutes automatically.'),
                ])
                ->action(function ($record, array $data): void {
                    $timezone = config('app.timezone', 'Asia/Kolkata');
                    $scheduledIso = Carbon::parse($data['scheduled_for'], $timezone)->format('Y-m-d H:i:s');
                    $before = [
                        'status' => $record->status,
                        'scheduled_for' => (string) $record->scheduled_for,
                        'published_at' => (string) $record->published_at,
                    ];

                    $record->status = 'scheduled';
                    $record->scheduled_for = $scheduledIso;
                    $record->save();

                    AuditLog::log('SCHEDULE_UPDATED', $record, $before, [
                        'status' => 'scheduled',
                        'scheduled_for' => $scheduledIso,
                        'timezone' => $timezone,
                        'scheduled_by' => auth()->user()?->email ?? 'admin',
                    ]);

                    Notification::make()
                        ->title('Content Scheduled')
                        ->body('Scheduled for publication on '.Carbon::parse($scheduledIso, $timezone)->format('d M Y, h:i A').' IST.')
                        ->success()
                        ->send();
                }),

            Action::make('cancel_schedule')
                ->label('Cancel Schedule')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->visible(function ($record) use ($permission) {
                    if ($record->status !== 'scheduled') {
                        return false;
                    }

                    return $permission ? (auth()->user()?->hasCmsPermission($permission) ?? true) : true;
                })
                ->requiresConfirmation()
                ->modalHeading('Cancel Scheduled Publication')
                ->modalDescription('Are you sure you want to cancel the scheduled publication? The content will be reverted to Draft status and will not be published automatically.')
                ->action(function ($record): void {
                    $before = [
                        'status' => $record->status,
                        'scheduled_for' => (string) $record->scheduled_for,
                    ];

                    $record->status = 'draft';
                    $record->scheduled_for = null;
                    $record->save();

                    AuditLog::log('SCHEDULE_CANCELLED', $record, $before, [
                        'status' => 'draft',
                        'scheduled_for' => null,
                        'cancelled_by' => auth()->user()?->email ?? 'admin',
                    ]);

                    Notification::make()
                        ->title('Schedule Cancelled')
                        ->body('Publication schedule removed. Content reverted to Draft.')
                        ->warning()
                        ->send();
                }),

            Action::make('publish_now')
                ->label('Publish Now')
                ->icon('heroicon-o-bolt')
                ->color('success')
                ->visible(function ($record) use ($permission) {
                    if ($record->status === 'published') {
                        return false;
                    }

                    return $permission ? (auth()->user()?->hasCmsPermission($permission) ?? true) : true;
                })
                ->requiresConfirmation()
                ->modalHeading('Publish Content Immediately')
                ->modalDescription('Are you sure you want to publish this content now? It will instantly go live on the public website and become accessible to visitors.')
                ->action(function ($record): void {
                    $timezone = config('app.timezone', 'Asia/Kolkata');
                    $nowStr = Carbon::now($timezone)->format('Y-m-d H:i:s');
                    $before = [
                        'status' => $record->status,
                        'scheduled_for' => (string) $record->scheduled_for,
                        'published_at' => (string) $record->published_at,
                    ];

                    $record->status = 'published';
                    $record->published_at = $nowStr;
                    $record->scheduled_for = null;
                    $record->save();

                    AuditLog::log('MANUAL_PUBLISH', $record, $before, [
                        'status' => 'published',
                        'published_at' => $nowStr,
                        'published_by' => auth()->user()?->email ?? 'admin',
                        'timezone' => $timezone,
                    ]);

                    Notification::make()
                        ->title('Published Successfully')
                        ->body('Content is now live on GetIntoFeed.com.')
                        ->success()
                        ->send();
                }),
        ];
    }
}
