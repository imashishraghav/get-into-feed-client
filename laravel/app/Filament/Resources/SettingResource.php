<?php

namespace App\Filament\Resources;

use App\Filament\ManagedResource;
use App\Filament\Resources\SettingResource\Pages\CreateSetting;
use App\Filament\Resources\SettingResource\Pages\EditSetting;
use App\Filament\Resources\SettingResource\Pages\ListSettings;
use App\Models\Setting;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SettingResource extends ManagedResource
{
    protected static ?string $model = Setting::class;

    protected static ?string $navigationGroup = 'Settings & Operations';

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Site Settings & SEO';

    protected static ?int $navigationSort = 1;

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(2)->schema([
                Select::make('group')
                    ->options([
                        'general' => 'General Information',
                        'branding' => 'Branding & Identity',
                        'header' => 'Header & Navigation',
                        'footer' => 'Footer & Legal Links',
                        'contact' => 'Contact Coordinates & Address',
                        'social' => 'Social Media Links',
                        'email' => 'Email & SMTP',
                        'notifications' => 'Notifications & Webhooks',
                        'integrations' => 'Third-Party Integrations',
                        'api' => 'API Configuration',
                    ])
                    ->required(),

                TextInput::make('key')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->placeholder('site_name, phone_number, etc.')
                    ->extraInputAttributes(['class' => 'font-mono']),
            ]),

            Textarea::make('value')
                ->rows(4)
                ->columnSpanFull()
                ->helperText('String or valid JSON string for structured configuration.'),

            Toggle::make('is_public')
                ->label('Publicly Accessible via /api/v1/settings')
                ->default(false)
                ->helperText('When enabled, frontend components can read this setting publicly.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                BadgeColumn::make('group')->sortable()->color('primary'),
                TextColumn::make('key')->searchable()->sortable()->weight('bold')->fontFamily('mono'),
                TextColumn::make('value')->limit(50)->color('gray'),
                IconColumn::make('is_public')->boolean()->label('Public API'),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->filters([
                SelectFilter::make('group')->options([
                    'general' => 'General',
                    'branding' => 'Branding',
                    'contact' => 'Contact',
                    'social' => 'Social',
                    'footer' => 'Footer',
                    'integrations' => 'Integrations',
                ]),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSettings::route('/'),
            'create' => CreateSetting::route('/create'),
            'edit' => EditSetting::route('/{record}/edit'),
        ];
    }
}
