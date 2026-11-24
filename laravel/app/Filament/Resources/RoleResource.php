<?php

namespace App\Filament\Resources;

use App\Filament\ManagedResource;
use App\Filament\Resources\RoleResource\Pages\CreateRole;
use App\Filament\Resources\RoleResource\Pages\EditRole;
use App\Filament\Resources\RoleResource\Pages\ListRoles;
use App\Models\Role;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RoleResource extends ManagedResource
{
    protected static ?string $model = Role::class;

    protected static ?string $navigationGroup = 'Settings & Operations';

    protected static ?string $navigationIcon = 'heroicon-o-shield-check';

    protected static ?string $navigationLabel = 'Roles & Permissions';

    protected static ?int $navigationSort = 71;

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(2)->schema([
                TextInput::make('label')->required()->placeholder('Content Manager'),
                TextInput::make('name')->required()->unique(ignoreRecord: true)->placeholder('content_manager'),
            ]),

            Textarea::make('description')->rows(2)->columnSpanFull(),

            Section::make('Assigned Permissions')
                ->schema([
                    CheckboxList::make('permissions')
                        ->relationship('permissions', 'label')
                        ->columns(3)
                        ->gridDirection('row'),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label')->searchable()->sortable()->weight('bold'),
                TextColumn::make('name')->fontFamily('mono')->color('gray'),
                TextColumn::make('description')->limit(50),
                TextColumn::make('permissions_count')->counts('permissions')->label('Permissions'),
                TextColumn::make('created_at')->date()->sortable(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRoles::route('/'),
            'create' => CreateRole::route('/create'),
            'edit' => EditRole::route('/{record}/edit'),
        ];
    }
}
