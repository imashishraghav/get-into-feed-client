<?php

namespace App\Filament\Resources;

use App\Filament\ManagedResource;
use App\Filament\Resources\AuditLogResource\Pages\ListAuditLogs;
use App\Filament\Resources\AuditLogResource\Pages\ViewAuditLog;
use App\Models\AuditLog;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AuditLogResource extends ManagedResource
{
    protected static ?string $model = AuditLog::class;

    protected static ?string $navigationGroup = 'Settings & Operations';

    protected static ?string $navigationIcon = 'heroicon-o-finger-print';

    protected static ?string $navigationLabel = 'Audit Logs';

    protected static ?int $navigationSort = 70;

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Event Identity')
                ->schema([
                    Grid::make(3)->schema([
                        TextInput::make('action')->readOnly(),
                        TextInput::make('user_email')->label('Actor Email')->readOnly(),
                        TextInput::make('ip_address')->readOnly(),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('auditable_type')->label('Target Entity')->readOnly(),
                        TextInput::make('auditable_id')->label('Target Record ID')->readOnly(),
                    ]),
                    Textarea::make('user_agent')->readOnly()->rows(2),
                ]),

            Section::make('Data Delta (Audit Trail)')
                ->schema([
                    KeyValue::make('old_values')->label('Previous State')->readOnly(),
                    KeyValue::make('new_values')->label('Updated State')->readOnly(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->poll('30s')
            ->columns([
                TextColumn::make('created_at')->dateTime()->sortable()->label('Timestamp'),
                BadgeColumn::make('action')
                    ->colors([
                        'success' => 'CREATE',
                        'warning' => 'UPDATE',
                        'danger' => 'DELETE',
                        'info' => 'LOGIN',
                        'secondary' => 'LOGOUT',
                    ]),
                TextColumn::make('user_email')->label('User')->searchable(),
                TextColumn::make('auditable_type')->label('Entity')->searchable()->formatStateUsing(fn ($state) => class_basename($state)),
                TextColumn::make('auditable_id')->label('Record ID'),
                TextColumn::make('ip_address')->label('IP'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('action')->options([
                    'CREATE' => 'CREATE',
                    'UPDATE' => 'UPDATE',
                    'DELETE' => 'DELETE',
                    'LOGIN' => 'LOGIN',
                ]),
            ])
            ->actions([
                ViewAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAuditLogs::route('/'),
            'view' => ViewAuditLog::route('/{record}'),
        ];
    }
}
