<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\LeadResource;
use App\Models\Lead;
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentLeadsWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->poll('15s')
            ->query(Lead::production()->latest()->limit(5))
            ->columns([
                TextColumn::make('created_at')
                    ->label('Received')
                    ->since()
                    ->sortable(),

                TextColumn::make('name')
                    ->label('Contact')
                    ->searchable()
                    ->weight('bold')
                    ->description(fn (Lead $record) => $record->company ?: ($record->phone ?: '')),

                TextColumn::make('email')
                    ->label('Email')
                    ->copyable()
                    ->icon('heroicon-o-envelope'),

                TextColumn::make('interested_service')
                    ->label('Service')
                    ->badge()
                    ->color('info')
                    ->limit(25),

                TextColumn::make('crm_sync_status')
                    ->label('CRM Sync')
                    ->badge()
                    ->colors([
                        'success' => 'synced',
                        'warning' => 'pending',
                        'danger' => 'failed',
                    ])
                    ->icons([
                        'heroicon-o-check-circle' => 'synced',
                        'heroicon-o-clock' => 'pending',
                        'heroicon-o-x-circle' => 'failed',
                    ]),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'danger' => 'New',
                        'primary' => 'Contacted',
                        'warning' => 'Qualified',
                        'success' => 'Won',
                        'gray' => 'Lost',
                    ]),
            ])
            ->actions([
                Action::make('whatsapp')
                    ->label('WhatsApp')
                    ->icon('heroicon-o-chat-bubble-left-ellipsis')
                    ->color('success')
                    ->url(function (Lead $record): ?string {
                        $phone = preg_replace('/[^0-9]/', '', $record->whatsapp ?: $record->phone);
                        if (! $phone) {
                            return null;
                        }
                        if (strlen($phone) === 10) {
                            $phone = '91'.$phone;
                        }
                        $greeting = rawurlencode("Hi {$record->name}, thank you for reaching out to GetIntoFeed! Regarding your enquiry for ".($record->interested_service ?: 'growth services').' — how can we help?');

                        return "https://wa.me/{$phone}?text={$greeting}";
                    }, shouldOpenInNewTab: true)
                    ->visible(fn (Lead $record) => ! empty($record->phone) || ! empty($record->whatsapp)),

                Action::make('view')
                    ->label('View Enquiry')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->url(fn (Lead $record) => LeadResource::getUrl('edit', ['record' => $record])),
            ])
            ->headerActions([
                Action::make('view_all')
                    ->label('View All Form Enquiries')
                    ->icon('heroicon-o-arrow-right')
                    ->url(fn () => LeadResource::getUrl('index')),
            ])
            ->heading('Recent Inbound Form Enquiries');
    }
}
