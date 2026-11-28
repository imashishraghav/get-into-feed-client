<?php

namespace App\Filament\Resources;

use App\Filament\ManagedResource;
use App\Filament\Resources\MediaResource\Pages\CreateMedia;
use App\Filament\Resources\MediaResource\Pages\EditMedia;
use App\Filament\Resources\MediaResource\Pages\ListMedia;
use App\Models\Award;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Media;
use App\Models\MediaFolder;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Services\MediaService;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaResource extends ManagedResource
{
    protected static ?string $model = Media::class;

    protected static ?string $navigationGroup = 'Media Library';

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationLabel = 'Media Library';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Asset File & Upload')
                ->schema([
                    FileUpload::make('file_path')
                        ->label('Media File (Image / Document / Vector)')
                        ->disk('public')
                        ->directory('media')
                        ->visibility('public')
                        ->maxSize(25600)
                        ->acceptedFileTypes([
                            'image/jpeg',
                            'image/png',
                            'image/webp',
                            'image/avif',
                            'image/gif',
                            'image/svg+xml',
                            'application/pdf',
                        ])
                        ->image()
                        ->imageEditor()
                        ->helperText('Supported formats: JPG, PNG, WebP, AVIF, GIF, SVG, PDF up to 25MB.')
                        ->required(fn (string $operation) => $operation === 'create'),

                    Grid::make(2)->schema([
                        TextInput::make('file_name')
                            ->required()
                            ->label('File Name')
                            ->placeholder('e.g. hero-growth-sprint.webp'),

                        Select::make('folder_id')
                            ->label('Folder / Collection')
                            ->options(fn () => MediaFolder::treeOptions())
                            ->searchable()
                            ->placeholder('Select or create folder...')
                            ->createOptionForm([
                                TextInput::make('name')
                                    ->required()
                                    ->label('Folder Name')
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                                TextInput::make('slug')->required()->label('Slug'),
                                Select::make('parent_id')
                                    ->label('Parent Folder (Optional)')
                                    ->options(fn () => MediaFolder::treeOptions()),
                            ]),
                    ]),
                ]),

            Section::make('SEO Alt Tags & Metadata')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('title')
                            ->label('Asset Title')
                            ->placeholder('Descriptive title for internal search'),

                        TextInput::make('alt_text')
                            ->label('Alt Text (Crucial for Google Image SEO)')
                            ->placeholder('Describe the image context clearly for search bots & screen readers')
                            ->helperText('Optimal Alt Text improves image search rank & accessibility.'),
                    ]),

                    Textarea::make('caption')
                        ->rows(2)
                        ->label('Display Caption (Optional frontend description)'),

                    Textarea::make('description')
                        ->rows(2)
                        ->label('Internal Description / Licensing Details'),
                ]),

            Section::make('Technical Inspection & Embed Codes')
                ->collapsible()
                ->collapsed(fn (string $operation) => $operation === 'create')
                ->schema([
                    Grid::make(3)->schema([
                        TextInput::make('file_size')
                            ->label('File Size')
                            ->formatStateUsing(fn ($record) => $record?->formatted_size)
                            ->disabled()
                            ->dehydrated(false),

                        TextInput::make('dimensions')
                            ->label('Dimensions')
                            ->formatStateUsing(fn ($record) => $record?->dimensions ?: 'Scalable / Document')
                            ->disabled()
                            ->dehydrated(false),

                        TextInput::make('mime_type')
                            ->label('MIME Type')
                            ->disabled()
                            ->dehydrated(false),
                    ]),

                    Grid::make(2)->schema([
                        TextInput::make('file_hash')
                            ->label('SHA-256 Checksum')
                            ->disabled()
                            ->dehydrated(false)
                            ->helperText('Used for automatic duplicate detection.'),

                        TextInput::make('optimization_summary')
                            ->label('WebP Optimization')
                            ->formatStateUsing(fn ($record) => $record?->webp_path ? "⚡ WebP Active (-{$record->savings_percentage}% saved)" : 'Standard / Unconverted')
                            ->disabled()
                            ->dehydrated(false),
                    ]),

                    Section::make('Copyable Embed Codes')
                        ->schema([
                            TextInput::make('url_preview')
                                ->label('Direct Public CDN / Storage URL')
                                ->formatStateUsing(fn ($record) => $record?->url)
                                ->disabled()
                                ->dehydrated(false),

                            TextInput::make('html_preview')
                                ->label('HTML <img> Tag')
                                ->formatStateUsing(fn ($record) => $record?->html_embed)
                                ->disabled()
                                ->dehydrated(false),

                            TextInput::make('md_preview')
                                ->label('Markdown Embed Tag')
                                ->formatStateUsing(fn ($record) => $record?->markdown_embed)
                                ->disabled()
                                ->dehydrated(false),
                        ]),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('file_path')
                    ->disk('public')
                    ->square()
                    ->size(52)
                    ->label('Thumbnail'),

                TextColumn::make('file_name')
                    ->label('Asset Details')
                    ->description(fn (Media $record) => $record->dimensions ? "{$record->dimensions} • {$record->formatted_size}" : $record->formatted_size)
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('title')
                    ->label('Title & Alt Text')
                    ->description(fn (Media $record) => $record->alt_text ? "Alt: {$record->alt_text}" : '⚠️ Missing Alt Text')
                    ->searchable()
                    ->limit(32),

                TextColumn::make('folder.name')
                    ->label('Folder')
                    ->badge()
                    ->color('primary')
                    ->sortable(),

                TextColumn::make('mime_type')
                    ->label('Type')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'image/webp', 'image/avif' => 'success',
                        'image/svg+xml' => 'info',
                        'application/pdf' => 'warning',
                        default => 'gray',
                    }),

                TextColumn::make('optimization_status')
                    ->label('Optimization')
                    ->badge()
                    ->getStateUsing(function (Media $record) {
                        if ($record->webp_path) {
                            $pct = $record->savings_percentage;

                            return $pct ? "⚡ WebP (-{$pct}%)" : '⚡ WebP';
                        }
                        if (in_array($record->mime_type, ['image/jpeg', 'image/png'])) {
                            return 'Unoptimized';
                        }

                        return 'Standard';
                    })
                    ->colors([
                        'success' => fn ($state) => str_starts_with($state, '⚡ WebP'),
                        'warning' => fn ($state) => $state === 'Unoptimized',
                        'gray' => fn ($state) => $state === 'Standard',
                    ]),

                TextColumn::make('usages')
                    ->label('Used In')
                    ->badge()
                    ->getStateUsing(fn (Media $record) => count($record->getUsages(false)).' places')
                    ->colors([
                        'gray' => fn ($state) => $state === '0 places',
                        'success' => fn ($state) => $state !== '0 places',
                    ]),

                TextColumn::make('created_at')
                    ->label('Uploaded')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('mime_type')
                    ->label('Filter by Format')
                    ->options([
                        'image/jpeg' => 'JPEG Images (.jpg, .jpeg)',
                        'image/png' => 'PNG Images (.png)',
                        'image/webp' => 'WebP Modern (.webp)',
                        'image/svg+xml' => 'SVG Vectors (.svg)',
                        'application/pdf' => 'PDF Documents (.pdf)',
                    ]),

                SelectFilter::make('folder_id')
                    ->label('Filter by Folder')
                    ->options(fn () => MediaFolder::treeOptions()),

                Filter::make('missing_alt')
                    ->label('⚠️ Missing Alt Text')
                    ->query(fn (Builder $query) => $query->whereNull('alt_text')->orWhere('alt_text', '')),

                Filter::make('unoptimized')
                    ->label('⚡ Unoptimized Images')
                    ->query(fn (Builder $query) => $query->whereIn('mime_type', ['image/jpeg', 'image/png'])->whereNull('webp_path')),
            ])
            ->actions([
                Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-o-eye')
                    ->color('gray')
                    ->modalHeading(fn (Media $record) => "Asset Inspector: {$record->file_name}")
                    ->modalContent(fn (Media $record) => view('filament.widgets.media-preview-modal', ['media' => $record])),

                Action::make('quick_webp')
                    ->label('⚡ WebP')
                    ->icon('heroicon-o-sparkles')
                    ->color('success')
                    ->visible(fn (Media $record) => in_array($record->mime_type, ['image/jpeg', 'image/png']) && ! $record->webp_path)
                    ->action(function (Media $record) {
                        $ok = MediaService::convertToWebp($record);
                        if ($ok) {
                            $pct = $record->savings_percentage;
                            Notification::make()
                                ->success()
                                ->title('WebP Generated')
                                ->body("Compressed by {$pct}%.")
                                ->send();
                        } else {
                            Notification::make()
                                ->danger()
                                ->title('Optimization Failed')
                                ->body('Could not generate WebP.')
                                ->send();
                        }
                    }),

                Action::make('usages')
                    ->label('Usages')
                    ->icon('heroicon-o-link')
                    ->color('info')
                    ->modalHeading(fn (Media $record) => "Active References: #{$record->id} ({$record->file_name})")
                    ->modalContent(fn (Media $record) => view('filament.widgets.media-usages-modal', ['usages' => $record->getUsages(true)])),

                EditAction::make(),

                DeleteAction::make()
                    ->modalHeading('Delete Media Asset')
                    ->modalDescription('Are you sure you want to delete this media asset? Physical files and active references will be cleanly unlinked.')
                    ->before(function (Media $record) {
                        try {
                            $disk = Storage::disk($record->disk ?: 'public');
                            if ($record->file_path && $disk->exists($record->file_path)) {
                                $disk->delete($record->file_path);
                            }
                            if ($record->webp_path && $disk->exists($record->webp_path)) {
                                $disk->delete($record->webp_path);
                            }
                            if ($record->avif_path && $disk->exists($record->avif_path)) {
                                $disk->delete($record->avif_path);
                            }
                        } catch (\Throwable $e) {
                        }

                        try {
                            Service::where('hero_media_id', $record->id)->update(['hero_media_id' => null]);
                            CaseStudy::where('hero_media_id', $record->id)->update(['hero_media_id' => null]);
                            BlogPost::where('featured_media_id', $record->id)->update(['featured_media_id' => null]);
                            if (class_exists(TeamMember::class)) {
                                TeamMember::where('avatar_media_id', $record->id)->update(['avatar_media_id' => null]);
                            }
                            if (class_exists(Testimonial::class)) {
                                Testimonial::where('avatar_media_id', $record->id)->update(['avatar_media_id' => null]);
                            }
                            if (class_exists(Award::class)) {
                                Award::where('badge_media_id', $record->id)->update(['badge_media_id' => null]);
                            }
                        } catch (\Throwable $e) {
                        }
                    }),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->requiresConfirmation()
                        ->modalHeading('Delete Selected Media Assets')
                        ->modalDescription('Are you sure you want to permanently delete all selected media assets? Associated storage files and usages will be cleanly unlinked.')
                        ->action(function (Collection $records) {
                            $count = $records->count();
                            foreach ($records as $record) {
                                try {
                                    $disk = Storage::disk($record->disk ?: 'public');
                                    if ($record->file_path && $disk->exists($record->file_path)) {
                                        $disk->delete($record->file_path);
                                    }
                                    if ($record->webp_path && $disk->exists($record->webp_path)) {
                                        $disk->delete($record->webp_path);
                                    }
                                    if ($record->avif_path && $disk->exists($record->avif_path)) {
                                        $disk->delete($record->avif_path);
                                    }
                                } catch (\Throwable $e) {
                                }

                                try {
                                    Service::where('hero_media_id', $record->id)->update(['hero_media_id' => null]);
                                    CaseStudy::where('hero_media_id', $record->id)->update(['hero_media_id' => null]);
                                    BlogPost::where('featured_media_id', $record->id)->update(['featured_media_id' => null]);
                                    if (class_exists(TeamMember::class)) {
                                        TeamMember::where('avatar_media_id', $record->id)->update(['avatar_media_id' => null]);
                                    }
                                    if (class_exists(Testimonial::class)) {
                                        Testimonial::where('avatar_media_id', $record->id)->update(['avatar_media_id' => null]);
                                    }
                                    if (class_exists(Award::class)) {
                                        Award::where('badge_media_id', $record->id)->update(['badge_media_id' => null]);
                                    }
                                } catch (\Throwable $e) {
                                }

                                $record->forceDelete();
                            }

                            Notification::make()
                                ->success()
                                ->title('Media Assets Deleted')
                                ->body("Successfully deleted {$count} selected media assets from storage and database.")
                                ->send();
                        })
                        ->deselectRecordsAfterCompletion(),

                    BulkAction::make('convert_selected_webp')
                        ->label('⚡ Convert Selected to WebP')
                        ->icon('heroicon-o-sparkles')
                        ->color('success')
                        ->action(function (Collection $records) {
                            $converted = 0;
                            foreach ($records as $record) {
                                if (in_array($record->mime_type, ['image/jpeg', 'image/png']) && ! $record->webp_path) {
                                    if (MediaService::convertToWebp($record)) {
                                        $converted++;
                                    }
                                }
                            }
                            Notification::make()
                                ->success()
                                ->title('WebP Conversion Complete')
                                ->body("{$converted} images were successfully converted to modern WebP format.")
                                ->send();
                        })
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->emptyStateHeading('No media assets found')
            ->emptyStateDescription('Upload high-resolution graphics, hero visuals, client logos, or case study proof screenshots.')
            ->emptyStateIcon('heroicon-o-photo');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMedia::route('/'),
            'create' => CreateMedia::route('/create'),
            'edit' => EditMedia::route('/{record}/edit'),
        ];
    }
}
