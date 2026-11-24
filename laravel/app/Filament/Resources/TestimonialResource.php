<?php

namespace App\Filament\Resources;

use App\Filament\ManagedResource;
use App\Filament\Resources\TestimonialResource\Pages;
use App\Models\Testimonial;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class TestimonialResource extends ManagedResource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $navigationGroup = 'Content Studio';

    protected static ?string $navigationIcon = 'heroicon-o-star';

    protected static ?string $navigationLabel = 'Client Reviews';

    protected static ?int $navigationSort = 5;

    public static function getNavigationBadge(): ?string
    {
        return null;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Client & Review Details')->schema([
                Grid::make(3)->schema([
                    TextInput::make('client_name')
                        ->label('Client Name')
                        ->placeholder('e.g. Vikramaditya Singhania')
                        ->required()
                        ->maxLength(255),

                    TextInput::make('company')
                        ->label('Company / Brand')
                        ->placeholder('e.g. LuxeLiving Realty')
                        ->required()
                        ->maxLength(255),

                    TextInput::make('client_role')
                        ->label('Client Designation / Role')
                        ->placeholder('e.g. Managing Director / Founder')
                        ->maxLength(255),
                ]),

                Grid::make(4)->schema([
                    Select::make('rating')
                        ->label('Review Rating')
                        ->options([
                            5 => '★★★★★ (5 Stars - Exceptional)',
                            4 => '★★★★☆ (4 Stars - Great)',
                            3 => '★★★☆☆ (3 Stars - Average)',
                            2 => '★★☆☆☆ (2 Stars - Fair)',
                            1 => '★☆☆☆☆ (1 Star - Poor)',
                        ])
                        ->default(5)
                        ->required(),

                    TextInput::make('service_tag')
                        ->label('Service Received')
                        ->placeholder('e.g. Paid Performance & Video')
                        ->maxLength(255),

                    TextInput::make('result_metric')
                        ->label('Result Metric Badge')
                        ->placeholder('e.g. +380% ROI or ₹42Cr Pipeline')
                        ->maxLength(255),

                    Select::make('status')
                        ->label('Publishing Status')
                        ->options([
                            'published' => 'Published (Live on Website)',
                            'draft' => 'Draft (Internal Only)',
                        ])
                        ->default('published')
                        ->required(),
                ]),

                TextInput::make('sort_order')
                    ->label('Sort Priority (Lower numbers appear first)')
                    ->numeric()
                    ->default(0),

                Textarea::make('quote')
                    ->label('Client Review / Testimonial Quote')
                    ->placeholder('Enter the client testimonial statement or review feedback...')
                    ->rows(5)
                    ->required()
                    ->columnSpanFull(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('client_name')
                    ->label('Client Name')
                    ->weight('bold')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('company')
                    ->label('Company')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('client_role')
                    ->label('Role')
                    ->color('gray')
                    ->toggleable(),

                TextColumn::make('rating')
                    ->label('Rating')
                    ->formatStateUsing(fn ($state) => str_repeat('★', (int) $state))
                    ->color('warning')
                    ->sortable(),

                TextColumn::make('service_tag')
                    ->label('Service Tag')
                    ->badge()
                    ->color('info')
                    ->toggleable(),

                TextColumn::make('result_metric')
                    ->label('Outcome / Metric')
                    ->badge()
                    ->color('success')
                    ->toggleable(),

                BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'success' => 'published',
                        'warning' => 'draft',
                    ]),

                TextColumn::make('sort_order')
                    ->label('Sort')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Added')
                    ->dateTime('d M Y')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order', 'asc')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'published' => 'Published',
                        'draft' => 'Draft',
                    ]),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}
