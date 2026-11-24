<?php

namespace App\Filament\Resources;

use App\Filament\ManagedResource;
use App\Filament\Resources\UserResource\Pages\CreateUser;
use App\Filament\Resources\UserResource\Pages\EditUser;
use App\Filament\Resources\UserResource\Pages\ListUsers;
use App\Models\Media;
use App\Models\User;
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
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserResource extends ManagedResource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationGroup = 'Settings & Operations';

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationLabel = 'Admin Users';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(2)->schema([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required()->unique(ignoreRecord: true),
            ]),

            Grid::make(2)->schema([
                TextInput::make('password')
                    ->password()
                    ->maxLength(128)
                    ->nullable()
                    ->rules([Password::min(16)])
                    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $context): bool => $context === 'create')
                    ->label(fn (string $context): string => $context === 'create' ? 'Password' : 'Change Password (leave blank to keep)'),

                Select::make('role')
                    ->options(fn () => auth()->user()?->isSuperAdmin()
                        ? [
                            'superadmin' => 'Superadmin (Full Access)',
                            'admin' => 'Admin',
                            'content_manager' => 'Content Manager',
                            'seo_manager' => 'SEO Specialist',
                            'sales_crm' => 'Sales / CRM Executive',
                            'editor' => 'Content Editor',
                            'viewer' => 'Read-Only Viewer',
                        ]
                        : [
                            'admin' => 'Admin',
                            'content_manager' => 'Content Manager',
                            'seo_manager' => 'SEO Specialist',
                            'sales_crm' => 'Sales / CRM Executive',
                            'editor' => 'Content Editor',
                            'viewer' => 'Read-Only Viewer',
                        ])
                    ->default('editor')
                    ->required(),
            ]),

            Grid::make(2)->schema([
                Select::make('avatar_media_id')
                    ->label('Profile Avatar (Media Library)')
                    ->options(fn () => Media::pluck('file_name', 'id'))
                    ->searchable(),

                Toggle::make('is_active')
                    ->label('Account Active')
                    ->default(true),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable()->sortable()->weight('bold'),
                TextColumn::make('email')->searchable()->sortable()->copyable(),
                BadgeColumn::make('role')
                    ->colors([
                        'danger' => 'superadmin',
                        'warning' => 'admin',
                        'primary' => 'content_manager',
                        'info' => 'seo_manager',
                        'success' => 'sales_crm',
                        'gray' => 'viewer',
                    ]),
                IconColumn::make('is_active')->boolean(),
                TextColumn::make('last_login_at')->dateTime()->sortable(),
                TextColumn::make('created_at')->date()->sortable(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function canEdit(Model $record): bool
    {
        $actor = auth()->user();

        return parent::canEdit($record)
            && ($record->role !== 'superadmin' || $actor?->isSuperAdmin());
    }

    public static function canDelete(Model $record): bool
    {
        $actor = auth()->user();

        return parent::canDelete($record)
            && $record->id !== $actor?->id
            && ($record->role !== 'superadmin' || $actor?->isSuperAdmin());
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
