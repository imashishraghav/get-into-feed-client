<?php

namespace App\Filament\Resources\MediaResource\Pages;

use App\Filament\Resources\MediaResource;
use App\Models\Media;
use App\Models\MediaFolder;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ListMedia extends ListRecords
{
    protected static string $resource = MediaResource::class;

    protected static string $view = 'filament.resources.media-resource.pages.list-media';

    public string $viewMode = 'list';

    public ?int $activeFolderId = null;

    public function getHeading(): string
    {
        return 'Media';
    }

    public function getSubheading(): ?string
    {
        $count = Media::count();

        return "{$count} assets. Keep titles and alt text complete for SEO and accessibility.";
    }

    public function getBreadcrumb(): ?string
    {
        return $this->viewMode === 'grid' ? 'Grid' : 'List';
    }

    public function setViewMode(string $mode): void
    {
        $this->viewMode = in_array($mode, ['list', 'grid'], true) ? $mode : 'list';
    }

    public function selectFolder(?int $folderId): void
    {
        $this->activeFolderId = $folderId;
        $this->resetPage();
    }

    public function getFolderTreeProperty(): Collection
    {
        return MediaFolder::query()
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->withCount('media')->orderBy('name')])
            ->withCount('media')
            ->orderBy('name')
            ->get();
    }

    public function getTotalMediaCountProperty(): int
    {
        return Media::count();
    }

    public function copyUrlToClipboard(string $url, string $fileName): void
    {
        $this->dispatch('copy-to-clipboard', text: $url);

        Notification::make()
            ->success()
            ->title('URL Copied')
            ->body("Copied URL for {$fileName}.")
            ->send();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create_folder')
                ->label('New folder')
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
                ->label('Upload media')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('primary'),
        ];
    }
}
