<?php

namespace App\Filament\Resources;

use App\Filament\Forms\Components\MediaPicker;
use App\Filament\Forms\Components\SeoFields;
use App\Filament\ManagedResource;
use App\Filament\Resources\BlogPostResource\Pages;
use App\Filament\Traits\HasScheduledPublishing;
use App\Models\BlogPost;
use App\Models\Setting;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ViewField;
use Filament\Forms\Form;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\ForceDeleteAction;
use Filament\Tables\Actions\ForceDeleteBulkAction;
use Filament\Tables\Actions\RestoreAction;
use Filament\Tables\Actions\RestoreBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class BlogPostResource extends ManagedResource
{
    use HasScheduledPublishing;

    protected static ?string $model = BlogPost::class;

    protected static ?string $navigationGroup = 'Content Studio';

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationLabel = 'All Posts';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        return null;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(['default' => 1, 'lg' => 3])->schema([
                // ── MAIN CONTENT CANVAS (2 COLUMNS) ──────────────────────
                Group::make()->columnSpan(['default' => 1, 'lg' => 2])->schema([
                    // 1. Classic WordPress Post Editor Suite (Exact Match to Screenshot)
                    ViewField::make('wp_editor_header')
                        ->view('filament.forms.wp-editor-header')
                        ->columnSpanFull(),

                    Hidden::make('title')->required(),
                    Hidden::make('slug')->required(),
                    Hidden::make('content')->required(),
                    Hidden::make('editor_mode')->default('classic'),
                    Hidden::make('content_blocks')->dehydrateStateUsing(fn ($state) => $state ?? []),

                    // Excerpt Card (Collapsible)
                    Section::make('Excerpt')
                        ->collapsible()
                        ->collapsed()
                        ->schema([
                            Textarea::make('excerpt')
                                ->label('')
                                ->placeholder('Write an excerpt (optional short teaser displayed on blog hub & search snippets)...')
                                ->rows(2),
                        ]),

                    // ── YOAST SEO SUITE (FULL WIDTH UNDER WRITING CANVAS) ──
                    SeoFields::makeYoastBox('Article'),
                ]),

                // ── DOCUMENT SIDEBAR (1 COLUMN - WORDPRESS STYLE BOXES) ──
                Group::make()->columnSpan(['default' => 1, 'lg' => 1])->schema([
                    // 1. WordPress / Yoast Classic Publish Box
                    ViewField::make('wp_publish_box')
                        ->hiddenLabel()
                        ->view('filament.forms.wp-publish-box')
                        ->columnSpanFull(),

                    Hidden::make('status')->default('draft'),
                    Hidden::make('published_at'),
                    Hidden::make('scheduled_for'),
                    Hidden::make('is_featured')->default(false),

                    // 2. Categories Card
                    Section::make('Categories')
                        ->schema([
                            Select::make('category')
                                ->label('')
                                ->placeholder('Select or create category')
                                ->options(function () {
                                    $defaults = [
                                        'Growth Playbook' => 'Growth Playbook',
                                        'Paid Performance' => 'Paid Performance',
                                        'AI & GEO Search' => 'AI & GEO Search',
                                        'SEO & AI Search' => 'SEO & AI Search',
                                        'Creative Strategy' => 'Creative Strategy',
                                        'Web & CRO' => 'Web & CRO',
                                        'Brand Positioning' => 'Brand Positioning',
                                    ];
                                    try {
                                        $fromRegistry = [];
                                        $raw = Setting::get('blog_categories_registry', []);
                                        if (is_array($raw)) {
                                            foreach ($raw as $c) {
                                                if (! empty($c['name'])) {
                                                    $fromRegistry[$c['name']] = $c['name'];
                                                }
                                            }
                                        }
                                        $existing = BlogPost::query()
                                            ->whereNotNull('category')
                                            ->where('category', '!=', '')
                                            ->distinct()
                                            ->pluck('category', 'category')
                                            ->toArray();

                                        return array_unique(array_merge($defaults, $fromRegistry, $existing));
                                    } catch (\Throwable $e) {
                                        return $defaults;
                                    }
                                })
                                ->searchable()
                                ->createOptionForm([
                                    TextInput::make('name')
                                        ->label('New Category Name')
                                        ->required()
                                        ->maxLength(100)
                                        ->placeholder('e.g. Social Media Marketing, Case Studies'),
                                ])
                                ->createOptionUsing(function (array $data): string {
                                    $name = trim($data['name']);
                                    try {
                                        $raw = Setting::get('blog_categories_registry', []);
                                        if (! is_array($raw)) {
                                            $raw = [];
                                        }
                                        $raw[] = [
                                            'name' => $name,
                                            'slug' => Str::slug($name),
                                            'description' => 'Added from blog editor.',
                                        ];
                                        Setting::set('cms', 'blog_categories_registry', array_values($raw), true);
                                    } catch (\Throwable $e) {
                                    }

                                    return $name;
                                })
                                ->createOptionAction(function ($action) {
                                    return $action
                                        ->modalHeading('Create New Category')
                                        ->modalButton('Add Category')
                                        ->modalWidth('md');
                                })
                                ->default('Growth Playbook')
                                ->required()
                                ->native(false),
                        ]),

                    // 3. Tags Card
                    Section::make('Tags')
                        ->schema([
                            TagsInput::make('tags')
                                ->label('')
                                ->placeholder('Add new tag')
                                ->helperText('Separate tags with commas or press Enter.'),
                        ]),

                    // 4. Featured Image Card
                    Section::make('Featured image')
                        ->schema([
                            MediaPicker::make('featured_media_id', 'Set featured image'),
                        ]),

                    // 5. Author & Reading Time Card
                    Section::make('Author & Reading Time')
                        ->collapsible()
                        ->collapsed()
                        ->schema([
                            TextInput::make('author_name')
                                ->label('Author Name')
                                ->placeholder('e.g. Rahul Saxena')
                                ->default('Ashish'),

                            TextInput::make('author_role')
                                ->label('Author Role')
                                ->placeholder('e.g. VP of Search Architecture')
                                ->default('Growth Collective'),

                            TextInput::make('read_time')
                                ->label('Estimated Reading Time')
                                ->default('5 min read'),
                        ]),
                ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->poll('30s')
            ->columns([
                TextColumn::make('title')
                    ->label('Article')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold')
                    ->limit(40),

                TextColumn::make('category')
                    ->label('Category')
                    ->badge()
                    ->color('gray')
                    ->default('—')
                    ->searchable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state): string => match ($state) {
                        'published' => 'success',
                        'scheduled' => 'info',
                        'review' => 'warning',
                        'approved' => 'primary',
                        default => 'danger',
                    })
                    ->formatStateUsing(fn ($state): string => match ($state) {
                        'published' => 'Published',
                        'scheduled' => 'Scheduled',
                        'review' => 'Pending Review',
                        'approved' => 'Approved',
                        default => ucfirst($state ?: 'Draft'),
                    })
                    ->sortable(),

                static::getPublishingScheduleTableColumn(),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->date('d M Y')
                    ->sortable()
                    ->color('gray'),

                TextColumn::make('seo_health')
                    ->label('SEO')
                    ->badge()
                    ->getStateUsing(function ($record) {
                        $seo = $record->seo;
                        if (! $seo || empty($seo->seo_title) || empty($seo->meta_description)) {
                            return $seo ? '⚠ Incomplete' : '✕ Missing';
                        }

                        return '✓ Optimal';
                    })
                    ->color(fn ($state) => match (true) {
                        str_contains((string) $state, 'Optimal') => 'success',
                        str_contains((string) $state, 'Incomplete') => 'warning',
                        default => 'danger',
                    }),

                TextColumn::make('author_name')
                    ->label('Author')
                    ->default('Ashish')
                    ->color('gray'),
            ])
            ->filters([
                static::getStatusTableFilter(),
                SelectFilter::make('category'),
                TrashedFilter::make(),
            ])
            ->actions([
                EditAction::make(),
                ...static::getScheduledPublishingActions('blog.publish'),
                Action::make('duplicate')
                    ->label('Duplicate')
                    ->icon('heroicon-o-square-2-stack')
                    ->requiresConfirmation()
                    ->visible(fn () => auth()->user()?->hasCmsPermission('blog.create'))
                    ->action(function (BlogPost $record): void {
                        abort_unless(auth()->user()?->hasCmsPermission('blog.create'), 403);

                        $copy = $record->replicate();
                        $copy->title = $record->title.' (Copy)';
                        $baseSlug = Str::slug($copy->title);
                        $copy->slug = $baseSlug;
                        $suffix = 2;
                        while (BlogPost::withTrashed()->where('slug', $copy->slug)->exists()) {
                            $copy->slug = $baseSlug.'-'.$suffix++;
                        }
                        $copy->status = 'draft';
                        $copy->published_at = null;
                        $copy->scheduled_for = null;
                        $copy->author_id = auth()->id();
                        $copy->views_count = 0;
                        $copy->is_featured = false;
                        $copy->save();

                        if ($record->seo) {
                            $seoCopy = $record->seo->replicate();
                            $seoCopy->canonical_url = null;
                            $copy->seo()->save($seoCopy);
                        }

                        AuditLog::log('DUPLICATE', $copy, null, $copy->toArray());
                    })
                    ->successNotificationTitle('Article duplicated as a draft'),
                Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn ($record) => "https://getintofeed.com/blog/{$record->slug}", true),
                DeleteAction::make()->label('Delete / Archive')
                    ->requiresConfirmation()
                    ->modalHeading('Delete Article')
                    ->modalDescription('Are you sure you want to delete this article? It will immediately disappear from the live blog.')
                    ->successNotificationTitle('Article deleted and frontend updated!'),
                RestoreAction::make(),
                ForceDeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->requiresConfirmation()
                        ->successNotificationTitle('Selected articles deleted!'),
                    RestoreBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBlogPosts::route('/'),
            'create' => Pages\CreateBlogPost::route('/create'),
            'edit' => Pages\EditBlogPost::route('/{record}/edit'),
        ];
    }
}
