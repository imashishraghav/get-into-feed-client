<?php

namespace App\Filament\Resources;

use App\Filament\ManagedResource;
use App\Filament\Resources\RedirectResource\Pages\CreateRedirect;
use App\Filament\Resources\RedirectResource\Pages\EditRedirect;
use App\Filament\Resources\RedirectResource\Pages\ListRedirects;
use App\Models\Redirect;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RedirectResource extends ManagedResource
{
    protected static ?string $model = Redirect::class;

    protected static ?string $navigationGroup = 'Settings & Operations';

    protected static ?string $navigationIcon = 'heroicon-o-arrow-top-right-on-square';

    protected static ?string $navigationLabel = 'URL Redirects';

    protected static ?int $navigationSort = 32;

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(2)->schema([
                TextInput::make('source_url')
                    ->required()
                    ->placeholder('/old-service-url')
                    ->unique(ignoreRecord: true)
                    ->helperText('Relative path (e.g. /old-path) or external URL to redirect from.'),

                TextInput::make('target_url')
                    ->required()
                    ->placeholder('/services/enterprise-seo')
                    ->helperText('Destination relative path or absolute URL.'),
            ]),

            Grid::make(3)->schema([
                Select::make('status_code')
                    ->options([
                        301 => '301 - Permanent Redirect (SEO Friendly)',
                        302 => '302 - Temporary Redirect',
                        307 => '307 - Temporary Redirect (Strict Method)',
                        308 => '308 - Permanent Redirect (Strict Method)',
                    ])
                    ->default(301)
                    ->required(),

                Toggle::make('is_active')
                    ->label('Active Redirect')
                    ->default(true),

                TextInput::make('hits')
                    ->numeric()
                    ->default(0)
                    ->readOnly()
                    ->helperText('Total times this redirect was triggered.'),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('source_url')->searchable()->sortable()->weight('bold')->fontFamily('mono'),
                TextColumn::make('target_url')->searchable()->fontFamily('mono')->color('gray'),
                BadgeColumn::make('status_code')
                    ->colors([
                        'success' => 301,
                        'warning' => 302,
                    ]),
                TextColumn::make('hits')->sortable(),
                IconColumn::make('is_active')->boolean(),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRedirects::route('/'),
            'create' => CreateRedirect::route('/create'),
            'edit' => EditRedirect::route('/{record}/edit'),
        ];
    }
}
