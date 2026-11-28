<?php

namespace App\Filament\Resources;

use App\Filament\Forms\Components\MediaPicker;
use App\Filament\ManagedResource;
use App\Filament\Resources\BlogPostResource\Pages;
use App\Filament\Traits\HasScheduledPublishing;
use App\Models\AuditLog;
use App\Models\BlogPost;
use App\Models\Setting;
use App\Models\User;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
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
use Illuminate\Database\Eloquent\Builder;
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

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with(['seo', 'featuredMedia']);
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(['default' => 1, 'lg' => 12])->schema([
                // ── MAIN EDITORIAL STUDIO + LIVE SEO STUDIO PRO (8 COLUMNS) ─────────
                Group::make()->columnSpan(['default' => 1, 'lg' => 8])->schema([
                    ViewField::make('content')
                        ->hiddenLabel()
                        ->default('')
                        ->required()
                        ->view('filament.forms.components.getintofeed-editor')
                        ->columnSpanFull(),

                    // Entangled Core & SEO Studio State Fields (safe defaults for new & legacy posts)
                    Hidden::make('title')->default('')->required(),
                    Hidden::make('slug')->default('')->required(),
                    Hidden::make('excerpt')->default(''),
                    Hidden::make('editor_mode')->default('classic'),
                    Hidden::make('content_blocks')->default([])->dehydrateStateUsing(fn ($state) => is_array($state) ? $state : []),
                    Hidden::make('focus_keyphrase')->default(''),
                    Hidden::make('secondary_keyphrases')->default([])->dehydrateStateUsing(fn ($state) => is_array($state) ? array_values(array_filter(array_map('strval', $state))) : []),
                    Hidden::make('seo_title')->default(''),
                    Hidden::make('meta_description')->default(''),
                    Hidden::make('canonical_url')->default(''),
                    Hidden::make('schema_type')->default('BlogPosting'),
                    Hidden::make('robots_index')->default(true)->dehydrateStateUsing(fn ($state) => $state === null ? true : (bool) $state),
                    Hidden::make('robots_follow')->default(true)->dehydrateStateUsing(fn ($state) => $state === null ? true : (bool) $state),
                    Hidden::make('faq_items')->default([])->dehydrateStateUsing(fn ($state) => is_array($state) ? array_values($state) : []),
                    Hidden::make('og_title')->default(''),
                    Hidden::make('og_description')->default(''),
                    Hidden::make('seo_score')->default(0)->dehydrateStateUsing(fn ($state) => max(0, min(100, (int) ($state ?? 0)))),
                    Hidden::make('readability_score')->default(0)->dehydrateStateUsing(fn ($state) => max(0, min(100, (int) ($state ?? 0)))),
                    Hidden::make('word_count')->default(0)->dehydrateStateUsing(fn ($state) => max(0, (int) ($state ?? 0))),
                    Hidden::make('reading_time')->default(0)->dehydrateStateUsing(fn ($state) => max(0, (int) ($state ?? 0))),
                    Hidden::make('visibility')->default('public'),
                    Hidden::make('version')->default(1)->dehydrateStateUsing(fn ($state) => max(1, (int) ($state ?? 1))),
                    Hidden::make('content_json')->default(null),
                ]),

                // ── STICKY DOCUMENT SIDEBAR (4 COLUMNS) ─────────────────────────────
                Group::make()
                    ->columnSpan(['default' => 1, 'lg' => 4])
                    ->extraAttributes(['class' => 'gif-sticky-sidebar'])
                    ->schema([
                        // 1. Publish & Status Card
                        ViewField::make('wp_publish_box')
                            ->hiddenLabel()
                            ->view('filament.forms.wp-publish-box')
                            ->extraAttributes(['class' => 'gif-sidebar-section gif-sidebar-publish'])
                            ->columnSpanFull(),

                        Hidden::make('status')->default('draft'),
                        Hidden::make('published_at'),
                        Hidden::make('scheduled_for'),
                        Hidden::make('is_featured')->default(false),

                        // 2. Featured Image + SEO Alt Text Card
                        Section::make('Featured Image')
                            ->icon('heroicon-o-photo')
                            ->extraAttributes(['class' => 'gif-sidebar-section gif-sidebar-media'])
                            ->schema([
                                MediaPicker::make('featured_media_id', 'Set featured image'),
                                TextInput::make('featured_image_alt')
                                    ->label('Featured Image SEO Alt Text')
                                    ->placeholder('Descriptive alt text including focus keyphrase...')
                                    ->maxLength(255)
                                    ->helperText('Improves Google Images ranking & screen-reader accessibility.'),
                            ]),

                        // 3. Categories Card
                        Section::make('Categories')
                            ->icon('heroicon-o-folder')
                            ->extraAttributes(['class' => 'gif-sidebar-section gif-sidebar-publish'])
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

                        // 4. Tags Card
                        Section::make('Tags')
                            ->icon('heroicon-o-tag')
                            ->extraAttributes(['class' => 'gif-sidebar-section gif-sidebar-publish'])
                            ->schema([
                                TagsInput::make('tags')
                                    ->label('')
                                    ->placeholder('Add or search tags...')
                                    ->suggestions(function (): array {
                                        try {
                                            return BlogPost::query()
                                                ->whereNotNull('tags')
                                                ->pluck('tags')
                                                ->flatten()
                                                ->filter(fn ($tag) => is_string($tag) && trim($tag) !== '')
                                                ->map(fn ($tag) => trim((string) $tag))
                                                ->unique()
                                                ->sort()
                                                ->values()
                                                ->toArray();
                                        } catch (\Throwable $e) {
                                            return [];
                                        }
                                    })
                                    ->helperText('Autocomplete from existing tags or press Enter to create a new tag.'),
                            ]),

                        // 5. Author & Reading Time Card
                        Section::make('Author & Reading Time')
                            ->icon('heroicon-o-user')
                            ->collapsible()
                            ->collapsed()
                            ->extraAttributes(['class' => 'gif-sidebar-section gif-sidebar-publish'])
                            ->schema([
                                Select::make('author_id')
                                    ->label('CMS Author Account')
                                    ->options(fn () => User::query()->orderBy('name')->pluck('name', 'id')->toArray())
                                    ->searchable()
                                    ->nullable(),

                                TextInput::make('author_name')
                                    ->label('Author Name')
                                    ->placeholder('e.g. Ashish')
                                    ->default('Ashish'),

                                TextInput::make('author_role')
                                    ->label('Author Role')
                                    ->placeholder('e.g. VP of Search Architecture')
                                    ->default('Growth Collective'),

                                TextInput::make('read_time')
                                    ->label('Estimated Reading Time')
                                    ->default('5 min read'),
                            ]),

                        // 6. Live Article Outline (TOC)
                        ViewField::make('article_outline_toc')
                            ->hiddenLabel()
                            ->view('filament.forms.article-outline-toc')
                            ->extraAttributes(['class' => 'gif-sidebar-section gif-sidebar-publish'])
                            ->columnSpanFull(),
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

                TextColumn::make('seo_score')
                    ->label('SEO Score')
                    ->badge()
                    ->getStateUsing(function (BlogPost $record): string {
                        $score = $record->effectiveSeoScore();

                        return $score > 0 ? "{$score}/100" : 'Not Audited';
                    })
                    ->color(function (BlogPost $record): string {
                        $score = $record->effectiveSeoScore();

                        return match (true) {
                            $score >= 80 => 'success',
                            $score >= 55 => 'warning',
                            $score > 0 => 'danger',
                            default => 'gray',
                        };
                    })
                    ->sortable(),

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
                    ->color('gray')
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
                        $copy->canonical_url = null;
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
