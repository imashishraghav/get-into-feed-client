<?php

namespace App\Filament\Resources;

use App\Filament\Forms\Components\DualEditor;
use App\Filament\Forms\Components\MediaPicker;
use App\Filament\Forms\Components\SeoFields;
use App\Filament\ManagedResource;
use App\Filament\Resources\CaseStudyResource\Pages;
use App\Filament\Traits\HasScheduledPublishing;
use App\Models\CaseStudy;
use App\Models\Media;
use App\Models\Testimonial;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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

class CaseStudyResource extends ManagedResource
{
    use HasScheduledPublishing;

    protected static ?string $model = CaseStudy::class;

    protected static ?string $navigationGroup = 'Content Studio';

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';

    protected static ?string $navigationLabel = 'Case Studies';

    protected static ?int $navigationSort = 4;

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
                    // Title & Headline Card
                    Section::make()->schema([
                        TextInput::make('project_name')
                            ->label('Project Title / Case Headline')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state)))
                            ->placeholder('e.g. Scaling UrbanThreads Co. to ₹2.1Cr/mo')
                            ->extraInputAttributes(['class' => 'gutenberg-title-input text-xl font-bold']),

                        TextInput::make('slug')
                            ->label('Permalink / Slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->prefix('getintofeed.com/case-studies/'),

                        Grid::make(3)->schema([
                            TextInput::make('headline_prefix')->label('Headline Prefix')->placeholder('Scaling UrbanThreads to '),
                            TextInput::make('headline_highlight')->label('Highlight Phrase')->placeholder('₹2.1Cr Monthly Revenue'),
                            TextInput::make('headline_suffix')->label('Headline Suffix')->placeholder(' in 90 Days'),
                        ]),

                        Textarea::make('hero_description')
                            ->label('Hero Description')
                            ->placeholder('High-level overview of the growth transformation...')
                            ->rows(2),
                    ]),

                    // Challenge & Objectives Block
                    Section::make('The Challenge & Obstacles')
                        ->collapsible()
                        ->schema([
                            Textarea::make('challenge')
                                ->label('Core Challenge Narrative')
                                ->placeholder('The core bottleneck before partnering with GetIntoFeed...')
                                ->rows(3),

                            Repeater::make('challenge_paragraphs')
                                ->label('Detailed Challenge Paragraphs')
                                ->simple(Textarea::make('p')->rows(2)->required())
                                ->collapsible()
                                ->addActionLabel('+ Add Paragraph'),

                            Repeater::make('obstacles')
                                ->label('Observed Bottlenecks / Obstacles')
                                ->simple(TextInput::make('obstacle')->required())
                                ->collapsible()
                                ->addActionLabel('+ Add Bottleneck'),
                        ]),

                    // Strategy & Execution Pillars Block
                    Section::make('Strategy & Execution Pillars')
                        ->collapsible()
                        ->schema([
                            Repeater::make('strategy_pillars')
                                ->label('Execution Pillars')
                                ->schema([
                                    Grid::make(3)->schema([
                                        TextInput::make('step')->placeholder('01')->columnSpan(1)->required(),
                                        TextInput::make('title')->placeholder('Creative Testing Loop')->columnSpan(2)->required(),
                                    ]),
                                    Textarea::make('desc')->rows(2)->placeholder('Strategic execution detail...')->required(),
                                ])
                                ->itemLabel(fn (array $state): ?string => ($state['step'] ?? 'Pillar').' — '.($state['title'] ?? ''))
                                ->collapsible()
                                ->cloneable()
                                ->reorderable()
                                ->addActionLabel('+ Add Strategic Pillar'),

                            Select::make('execution_gallery')
                                ->label('Creative Execution Gallery (Select from Media Library)')
                                ->multiple()
                                ->options(fn () => Media::pluck('file_name', 'id'))
                                ->searchable()
                                ->preload(),
                        ]),

                    // Results & Proof Metrics Block
                    Section::make('Results & Verified Metrics')
                        ->collapsible()
                        ->schema([
                            Repeater::make('results_metrics')
                                ->label('Key Growth Proof Points')
                                ->schema([
                                    Grid::make(3)->schema([
                                        TextInput::make('val')->label('Metric Value')->placeholder('+380%')->required(),
                                        TextInput::make('label')->label('Metric Description')->placeholder('ROAS Increase')->required(),
                                        Toggle::make('highlight')->label('Highlight')->default(true),
                                    ]),
                                ])
                                ->collapsible()
                                ->cloneable()
                                ->addActionLabel('+ Add Metric'),

                            Select::make('testimonial_id')
                                ->label('Linked Client Testimonial')
                                ->options(fn () => Testimonial::pluck('client_name', 'id'))
                                ->searchable()
                                ->preload(),
                        ]),

                    // Clean Executive Rich Text Editor
                    DualEditor::make('content', 'content_blocks', 'editor_mode', 'Case Study Content'),
                ]),

                // ── DOCUMENT SIDEBAR (1 COLUMN) ──────────────────────────
                Group::make()->columnSpan(['default' => 1, 'lg' => 1])->schema([
                    // Document Settings Card
                    Section::make('Document Settings')->schema([
                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'draft' => 'Draft',
                                'review' => 'In Review',
                                'approved' => 'Approved',
                                'scheduled' => 'Scheduled',
                                'published' => 'Published',
                            ])
                            ->default('draft')
                            ->required()
                            ->live()
                            ->native(false),

                        DateTimePicker::make('published_at')
                            ->label('Publish Date')
                            ->native(false),

                        DateTimePicker::make('scheduled_for')
                            ->label('Scheduled Date (IST)')
                            ->timezone('Asia/Kolkata')
                            ->visible(fn ($get) => $get('status') === 'scheduled')
                            ->native(false)
                            ->helperText('Scheduled in Indian Standard Time (IST). Automatically published by scheduler.'),

                        TextInput::make('client_name')
                            ->label('Client Brand')
                            ->placeholder('UrbanThreads Co.')
                            ->required(),

                        TextInput::make('category')
                            ->label('Industry Category')
                            ->placeholder('D2C Fashion'),

                        TextInput::make('year')
                            ->label('Project Year')
                            ->default('2026'),

                        TextInput::make('sub_tag')
                            ->label('Sub-Tag')
                            ->placeholder('E-Commerce Scaling'),

                        TextInput::make('sort_order')
                            ->label('Menu Order')
                            ->numeric()
                            ->default(0),
                    ]),

                    // Featured Image Card
                    Section::make('Featured Image')->collapsible()->schema([
                        MediaPicker::make('hero_media_id', 'Hero Cover Media'),
                    ]),

                    // ── YOAST SEO SUITE (FULL WIDTH UNDER CONTENT CANVAS) ──
                    SeoFields::makeYoastBox('Article'),
                ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->poll('30s')
            ->columns([
                TextColumn::make('client_name')
                    ->label('Client')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),

                TextColumn::make('project_name')
                    ->label('Project Title')
                    ->searchable()
                    ->limit(40),

                static::getStatusTableColumn(),
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
                    ->colors([
                        'success' => fn ($state) => str_contains($state, 'Optimal'),
                        'warning' => fn ($state) => str_contains($state, 'Incomplete'),
                        'danger' => fn ($state) => str_contains($state, 'Missing'),
                    ]),

                TextColumn::make('author')
                    ->label('Author')
                    ->default('Ashish')
                    ->color('gray'),
            ])
            ->filters([
                static::getStatusTableFilter(),
                SelectFilter::make('client_industry')
                    ->label('Industry / Category'),
                TrashedFilter::make(),
            ])
            ->actions([
                EditAction::make(),
                ...static::getScheduledPublishingActions('case_studies.manage'),
                Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn ($record) => "https://getintofeed.com/case-studies/{$record->slug}", true),
                DeleteAction::make()
                    ->requiresConfirmation()
                    ->modalHeading('Delete Case Study')
                    ->modalDescription('Are you sure you want to delete this case study? It will immediately disappear from the live website.')
                    ->successNotificationTitle('Case study deleted and live site updated!'),
                RestoreAction::make(),
                ForceDeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->requiresConfirmation()
                        ->successNotificationTitle('Selected case studies deleted!'),
                    RestoreBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCaseStudies::route('/'),
            'create' => Pages\CreateCaseStudy::route('/create'),
            'edit' => Pages\EditCaseStudy::route('/{record}/edit'),
        ];
    }
}
