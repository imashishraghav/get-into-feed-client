<?php

namespace App\Filament\Resources;

use App\Filament\ManagedResource;
use App\Filament\Resources\SubscriberResource\Pages\CreateSubscriber;
use App\Filament\Resources\SubscriberResource\Pages\EditSubscriber;
use App\Filament\Resources\SubscriberResource\Pages\ListSubscribers;
use App\Models\Subscriber;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SubscriberResource extends ManagedResource
{
    protected static ?string $model = Subscriber::class;

    protected static ?string $navigationGroup = 'Audience & Inquiries';

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $navigationLabel = 'Subscribers';

    protected static ?string $slug = 'newsletter-subscribers';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(2)->schema([
                TextInput::make('email')->email()->required(),
                TextInput::make('name'),
            ]),

            Grid::make(3)->schema([
                TextInput::make('source')->default('Website Footer'),
                TextInput::make('page_url')->label('Origin Page URL')->url(),
                TextInput::make('page_title')->label('Page Title'),
            ]),

            Grid::make(3)->schema([
                Select::make('status')
                    ->options([
                        'subscribed' => 'Subscribed',
                        'unsubscribed' => 'Unsubscribed',
                    ])
                    ->default('subscribed')
                    ->required(),
                TextInput::make('ip_address')->label('Subscriber IP')->readOnly(),
                TextInput::make('referrer')->label('Referrer URL')->readOnly(),
            ]),

            Grid::make(2)->schema([
                DateTimePicker::make('subscribed_at')->default(now()),
                DateTimePicker::make('unsubscribed_at'),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->poll('30s')
            ->columns([
                TextColumn::make('email')->searchable()->sortable()->weight('bold')->copyable(),
                TextColumn::make('name')->searchable(),
                TextColumn::make('page_url')
                    ->label('Origin Page')
                    ->formatStateUsing(function ($state, Subscriber $record) {
                        if (empty($state)) {
                            return $record->source ?: 'Direct';
                        }
                        $parsed = parse_url($state, PHP_URL_PATH);

                        return $parsed && $parsed !== '/' ? $parsed : 'Homepage (/)';
                    })
                    ->description(fn (Subscriber $record): string => $record->source ?: 'Newsletter Form')
                    ->tooltip(fn (Subscriber $record): string => $record->page_url ?: $record->source ?: '')
                    ->copyable()
                    ->searchable(),
                TextColumn::make('ip_address')->label('Visitor IP')->color('gray')->searchable(),
                BadgeColumn::make('status')
                    ->colors([
                        'success' => 'subscribed',
                        'danger' => 'unsubscribed',
                    ]),
                TextColumn::make('subscribed_at')
                    ->label('Subscribed At')
                    ->dateTime('d M Y, h:i A')
                    ->since()
                    ->sortable(),
            ])
            ->defaultSort('subscribed_at', 'desc')
            ->filters([
                SelectFilter::make('status')->options([
                    'subscribed' => 'Subscribed',
                    'unsubscribed' => 'Unsubscribed',
                ]),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSubscribers::route('/'),
            'create' => CreateSubscriber::route('/create'),
            'edit' => EditSubscriber::route('/{record}/edit'),
        ];
    }
}
