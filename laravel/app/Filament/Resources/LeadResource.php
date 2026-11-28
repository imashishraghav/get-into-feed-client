<?php

namespace App\Filament\Resources;

use App\Filament\ManagedResource;
use App\Filament\Resources\LeadResource\Pages\CreateLead;
use App\Filament\Resources\LeadResource\Pages\EditLead;
use App\Filament\Resources\LeadResource\Pages\ListLeads;
use App\Jobs\SyncLeadToCrmJob;
use App\Models\Lead;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Infolists\Components\Grid as InfoGrid;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\Section as InfoSection;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Notifications\Notification;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class LeadResource extends ManagedResource
{
    protected static ?string $model = Lead::class;

    protected static ?string $navigationGroup = 'Audience & Inquiries';

    protected static ?string $navigationIcon = 'heroicon-o-inbox';

    protected static ?string $navigationLabel = 'Form Enquiries';

    protected static ?string $modelLabel = 'Form Enquiry';

    protected static ?string $pluralModelLabel = 'Form Enquiries';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $newCount = Lead::production()->where('status', 'New')->count();

        return $newCount > 0 ? (string) $newCount : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Contact & Enquiry Details')
                ->description('Details received directly from the website form submission')
                ->schema([
                    Grid::make(3)->schema([
                        TextInput::make('lead_code')
                            ->label('Enquiry Code')
                            ->default(fn () => 'ENQ-'.strtoupper(Str::random(8)))
                            ->readOnly()
                            ->required(),
                        TextInput::make('name')
                            ->label('Contact Name')
                            ->required(),
                        TextInput::make('email')
                            ->label('Work Email')
                            ->email()
                            ->nullable(),
                    ]),

                    Grid::make(3)->schema([
                        TextInput::make('phone')
                            ->label('Phone Number')
                            ->tel()
                            ->nullable()
                            ->placeholder('+91 98765 43210'),
                        TextInput::make('whatsapp')
                            ->label('WhatsApp Number')
                            ->tel()
                            ->nullable()
                            ->placeholder('+91 98765 43210'),
                        TextInput::make('company')
                            ->label('Company / Brand Name'),
                    ]),

                    Grid::make(3)->schema([
                        TextInput::make('city')
                            ->label('City / Location')
                            ->placeholder('e.g. Delhi NCR, Mumbai, Bengaluru'),
                        TextInput::make('industry')
                            ->label('Industry / Business Category')
                            ->placeholder('e.g. D2C, E-Commerce, B2B SaaS'),
                        TextInput::make('website')
                            ->label('Website URL')
                            ->url()
                            ->placeholder('https://example.com'),
                    ]),

                    Grid::make(2)->schema([
                        TextInput::make('interested_service')
                            ->label('Service Requested')
                            ->placeholder('e.g. Paid Ads, SEO, Full Growth Suite'),
                        TextInput::make('budget')
                            ->label('Budget Indication')
                            ->placeholder('e.g. ₹50,000 - ₹1,00,000 / mo'),
                    ]),

                    Textarea::make('message')
                        ->label('Client Message / Project Scope')
                        ->rows(4)
                        ->columnSpanFull(),
                ]),

            Section::make('Enquiry Status')
                ->schema([
                    Grid::make(3)->schema([
                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'New' => 'New Inbound',
                                'Contacted' => 'Contacted / Followed Up',
                                'Qualified' => 'Qualified Lead',
                                'Won' => 'Closed Won',
                                'Lost' => 'Closed Lost',
                                'Spam' => 'Spam / Invalid',
                            ])
                            ->default('New')
                            ->required(),

                        Select::make('priority')
                            ->label('Priority')
                            ->options([
                                'Urgent' => 'Urgent (High Intent)',
                                'High' => 'High',
                                'Medium' => 'Medium',
                                'Low' => 'Low',
                            ])
                            ->default('Medium')
                            ->required(),

                        TextInput::make('lost_reason')
                            ->label('Reason (if Lost / Disqualified)')
                            ->placeholder('e.g. Budget mismatch'),
                    ]),
                ]),

            Section::make('Form Source & Attribution')
                ->collapsible()
                ->collapsed()
                ->schema([
                    Grid::make(3)->schema([
                        TextInput::make('form_type')
                            ->label('Form Type / Source Form')
                            ->readOnly(),
                        TextInput::make('page_title')
                            ->label('Origin Page Title')
                            ->readOnly(),
                        TextInput::make('page_url')
                            ->label('Origin Page URL')
                            ->readOnly(),
                    ]),

                    Grid::make(3)->schema([
                        TextInput::make('source')
                            ->label('Traffic Source')
                            ->readOnly(),
                        TextInput::make('referrer')
                            ->label('Referrer')
                            ->readOnly(),
                        TextInput::make('ip_address')
                            ->label('IP Address')
                            ->readOnly(),
                    ]),

                    Grid::make(3)->schema([
                        TextInput::make('utm_source')->label('UTM Source')->readOnly(),
                        TextInput::make('utm_medium')->label('UTM Medium')->readOnly(),
                        TextInput::make('utm_campaign')->label('UTM Campaign')->readOnly(),
                    ]),

                    Grid::make(2)->schema([
                        TextInput::make('gclid')->label('Google Click ID (GCLID)')->readOnly(),
                        TextInput::make('fbclid')->label('Facebook Click ID (FBCLID)')->readOnly(),
                    ]),
                ]),

            Section::make('CRM Outbound Sync Telemetry')
                ->collapsible()
                ->collapsed()
                ->schema([
                    Grid::make(3)->schema([
                        TextInput::make('uuid')
                            ->label('Idempotency UUID')
                            ->readOnly(),
                        TextInput::make('crm_sync_status')
                            ->label('Sync Status')
                            ->readOnly(),
                        TextInput::make('crm_lead_id')
                            ->label('Remote CRM Lead ID')
                            ->readOnly(),
                    ]),

                    Grid::make(2)->schema([
                        TextInput::make('crm_sync_attempts')
                            ->label('Sync Attempts')
                            ->readOnly(),
                        DateTimePicker::make('crm_synced_at')
                            ->label('Last Synced At')
                            ->readOnly(),
                    ]),

                    Textarea::make('crm_sync_error')
                        ->label('Last Sync Error / Response')
                        ->readOnly()
                        ->columnSpanFull(),
                ]),
        ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            InfoSection::make('Contact & Project Overview')
                ->icon('heroicon-o-user')
                ->schema([
                    InfoGrid::make(3)->schema([
                        TextEntry::make('lead_code')->label('Reference Code')->badge()->color('gray'),
                        TextEntry::make('name')->label('Contact Name')->weight('bold'),
                        TextEntry::make('company')->label('Company / Brand')->placeholder('—'),
                    ]),
                    InfoGrid::make(3)->schema([
                        TextEntry::make('email')->label('Email')->copyable()->icon('heroicon-o-envelope')->placeholder('—'),
                        TextEntry::make('phone')->label('Phone')->copyable()->icon('heroicon-o-phone')->placeholder('—'),
                        TextEntry::make('whatsapp')->label('WhatsApp')->copyable()->placeholder('—'),
                    ]),
                    InfoGrid::make(3)->schema([
                        TextEntry::make('interested_service')->label('Requested Service')->badge()->color('info')->placeholder('—'),
                        TextEntry::make('budget')->label('Budget Indication')->placeholder('—'),
                        TextEntry::make('city')->label('City / Location')->placeholder('—'),
                    ]),
                    TextEntry::make('message')
                        ->label('Message / Scope')
                        ->columnSpanFull()
                        ->placeholder('No specific message provided.'),
                ]),

            InfoSection::make('Marketing Attribution & Tracking')
                ->icon('heroicon-o-chart-bar')
                ->collapsible()
                ->schema([
                    InfoGrid::make(3)->schema([
                        TextEntry::make('form_type')->label('Form Identifier')->badge()->color('gray')->placeholder('—'),
                        TextEntry::make('source')->label('Traffic Source')->placeholder('Website Inbound'),
                        TextEntry::make('ip_address')->label('Visitor IP')->placeholder('—'),
                    ]),
                    InfoGrid::make(2)->schema([
                        TextEntry::make('page_url')->label('Origin Page URL')->url(fn ($record) => $record->page_url, true)->placeholder('—'),
                        TextEntry::make('referrer')->label('Referrer URL')->placeholder('Direct / None'),
                    ]),
                    InfoGrid::make(3)->schema([
                        TextEntry::make('utm_source')->label('UTM Source')->placeholder('—'),
                        TextEntry::make('utm_medium')->label('UTM Medium')->placeholder('—'),
                        TextEntry::make('utm_campaign')->label('UTM Campaign')->placeholder('—'),
                    ]),
                    InfoGrid::make(2)->schema([
                        TextEntry::make('gclid')->label('Google Click ID (GCLID)')->placeholder('—'),
                        TextEntry::make('fbclid')->label('Facebook Click ID (FBCLID)')->placeholder('—'),
                    ]),
                ]),

            InfoSection::make('Compliance & Consent (DPDP Act)')
                ->icon('heroicon-o-shield-check')
                ->schema([
                    InfoGrid::make(3)->schema([
                        TextEntry::make('consent_at')
                            ->label('Consent Timestamp')
                            ->dateTime('d M Y, h:i:s A T')
                            ->placeholder('Implicit / Prior to DPDP tracking'),
                        TextEntry::make('consent_ip')
                            ->label('Consent IP Address')
                            ->placeholder('—'),
                        IconEntry::make('is_test')
                            ->label('Environment')
                            ->boolean()
                            ->trueIcon('heroicon-o-beaker')
                            ->falseIcon('heroicon-o-check-badge')
                            ->trueColor('warning')
                            ->falseColor('success'),
                    ]),
                ]),

            InfoSection::make('CRM Outbound Sync Status')
                ->icon('heroicon-o-arrow-path-rounded-square')
                ->schema([
                    InfoGrid::make(3)->schema([
                        TextEntry::make('crm_sync_status')
                            ->label('Sync State')
                            ->badge()
                            ->colors([
                                'success' => 'synced',
                                'warning' => 'pending',
                                'danger' => 'failed',
                            ]),
                        TextEntry::make('crm_lead_id')->label('Remote CRM ID')->placeholder('Not yet assigned'),
                        TextEntry::make('crm_sync_attempts')->label('Delivery Attempts'),
                    ]),
                    InfoGrid::make(2)->schema([
                        TextEntry::make('uuid')->label('Idempotency UUID')->copyable(),
                        TextEntry::make('crm_synced_at')
                            ->label('Last Synced At')
                            ->dateTime('d M Y, h:i:s A T')
                            ->placeholder('Pending sync delivery'),
                    ]),
                    TextEntry::make('crm_sync_error')
                        ->label('Sync Error Details')
                        ->color('danger')
                        ->columnSpanFull()
                        ->placeholder('No errors reported.'),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->poll('30s')
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime('d M Y, h:i A')
                    ->sortable()
                    ->description(fn (Lead $record) => $record->created_at ? $record->created_at->diffForHumans() : ''),

                TextColumn::make('name')
                    ->label('Contact')
                    ->searchable()
                    ->weight('bold')
                    ->description(fn (Lead $record) => $record->company ?: ($record->city ?: '')),

                TextColumn::make('phone')
                    ->label('Phone / WhatsApp')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-o-phone'),

                TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
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
                    ])
                    ->description(fn (Lead $record) => $record->crm_sync_error ?: ($record->crm_synced_at ? 'Synced '.$record->crm_synced_at->diffForHumans() : 'Pending')),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'danger' => 'New',
                        'primary' => 'Contacted',
                        'warning' => 'Qualified',
                        'success' => 'Won',
                        'gray' => 'Lost',
                        'secondary' => 'Spam',
                    ]),

                TextColumn::make('is_test')
                    ->label('Env')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state ? 'TEST' : 'PROD')
                    ->color(fn ($state) => $state ? 'warning' : 'gray')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('crm_sync_status')
                    ->label('CRM Sync Status')
                    ->options([
                        'pending' => 'Pending Sync',
                        'synced' => 'Synced with CRM',
                        'failed' => 'Sync Failed / Error',
                    ]),

                SelectFilter::make('status')
                    ->options([
                        'New' => 'New Inbound',
                        'Contacted' => 'Contacted',
                        'Qualified' => 'Qualified',
                        'Won' => 'Closed Won',
                        'Lost' => 'Closed Lost',
                        'Spam' => 'Spam',
                    ]),

                TernaryFilter::make('is_test')
                    ->label('Data Environment')
                    ->placeholder('Production Enquiries Only')
                    ->trueLabel('Test Leads Only')
                    ->falseLabel('Production Enquiries Only')
                    ->queries(
                        true: fn (Builder $query) => $query->where('is_test', true),
                        false: fn (Builder $query) => $query->where('is_test', false),
                        blank: fn (Builder $query) => $query->where('is_test', false),
                    ),
            ])
            ->actions([
                ViewAction::make()
                    ->slideOver()
                    ->label('Details')
                    ->icon('heroicon-o-eye'),

                Action::make('retry_sync')
                    ->label('Retry Sync')
                    ->icon('heroicon-o-arrow-path')
                    ->color('warning')
                    ->visible(fn (Lead $record) => $record->crm_sync_status !== 'synced')
                    ->action(function (Lead $record): void {
                        SyncLeadToCrmJob::dispatch($record);
                        Notification::make()
                            ->title('CRM Sync Job Dispatched')
                            ->body("Outbound sync queued for {$record->name} (UUID: {$record->uuid})")
                            ->success()
                            ->send();
                    }),

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

                EditAction::make()->label('Edit Status'),

                DeleteAction::make(),
            ])
            ->headerActions([
                Action::make('export_csv')
                    ->label('Export CSV')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('gray')
                    ->url('/admin/leads/export-csv', shouldOpenInNewTab: true),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    BulkAction::make('retry_sync_bulk')
                        ->label('Retry CRM Sync')
                        ->icon('heroicon-o-arrow-path')
                        ->action(function (Collection $records): void {
                            $records->filter(fn ($r) => $r->crm_sync_status !== 'synced')->each(function ($record) {
                                SyncLeadToCrmJob::dispatch($record);
                            });
                            Notification::make()
                                ->title('Queued CRM Sync')
                                ->body('Queued outbound sync for selected enquiries.')
                                ->success()
                                ->send();
                        }),

                    BulkAction::make('mark_as_contacted')
                        ->label('Mark as Contacted')
                        ->icon('heroicon-o-check-circle')
                        ->action(function (Collection $records): void {
                            $records->each->update([
                                'status' => 'Contacted',
                                'first_response_at' => now(),
                            ]);
                            Notification::make()
                                ->title('Selected enquiries marked as Contacted')
                                ->success()
                                ->send();
                        }),

                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLeads::route('/'),
            'create' => CreateLead::route('/create'),
            'edit' => EditLead::route('/{record}/edit'),
        ];
    }
}
