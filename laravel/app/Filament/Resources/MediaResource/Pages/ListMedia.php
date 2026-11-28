<?php

namespace App\Filament\Resources\MediaResource\Pages;

use App\Filament\Resources\MediaResource;
use App\Models\MediaFolder;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Str;

class ListMedia extends ListRecords
{
    protected static string $resource = MediaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create_folder')
                ->label('+ New Folder / Subfolder')
                ->icon('heroicon-o-folder-plus')
                ->color('gray')
                ->form([
                    TextInput::make('name')
                        ->label('Folder Name')
                        ->required()
                        ->placeholder('e.g. Case Study Proofs')
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                    TextInput::make('slug')
                        ->label('Slug')
                        ->required()
                        ->unique(MediaFolder::class, 'slug'),
                    Select::make('parent_id')
                        ->label('Parent Folder (Optional for Subfolders)')
                        ->options(fn () => MediaFolder::treeOptions())
                        ->placeholder('Root (No parent)')
                        ->searchable(),
                ])
                ->action(function (array $data) {
                    MediaFolder::create($data);
                    Notification::make()
                        ->success()
                        ->title('Folder Created')
                        ->body("Folder '{$data['name']}' is now available for organizing media assets.")
                        ->send();
                }),

            CreateAction::make()
                ->label('+ Upload Media Asset')
                ->icon('heroicon-o-arrow-up-tray'),
        ];
    }
}
