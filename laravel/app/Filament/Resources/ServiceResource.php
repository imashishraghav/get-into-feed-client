<?php

namespace App\Filament\Resources;

use App\Filament\Forms\Components\DualEditor;
use App\Filament\Forms\Components\MediaPicker;
use App\Filament\Forms\Components\SeoFields;
use App\Filament\ManagedResource;
use App\Filament\Resources\ServiceResource\Pages;
use App\Filament\Traits\HasScheduledPublishing;
use App\Models\Service;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
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
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class ServiceResource extends ManagedResource
{
    use HasScheduledPublishing;

    protected static ?string $model = Service::class;

    protected static ?string $navigationGroup = 'Content Studio';

    protected static ?string $navigationIcon = 'heroicon-o-sparkles';

    protected static ?string $navigationLabel = 'Services';

    protected static ?string $modelLabel = 'Service';

    protected static ?string $pluralModelLabel = 'Services';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(['default' => 1, 'lg' => 3])->schema([
                // ── MAIN CONTENT CANVAS (2 COLUMNS) ──────────────────────
                Group::make()->columnSpan(['default' => 1, 'lg' => 2])->schema([
                    // Top Card: Service Name & Permalink Header Box
                    Section::make()->schema([
                        TextInput::make('name')
                            ->label('Service Name')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state).'-services-delhi-ncr'))
                            ->placeholder('e.g. Google Ads')
                            ->extraInputAttributes(['class' => 'gutenberg-title-input text-xl font-bold']),

                        TextInput::make('slug')
                            ->label('Permalink / Slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->prefix('getintofeed.com/services/'),
                    ]),

                    // ── 3 EXECUTIVE TABS ──────────────────────────────────
                    Tabs::make('ServiceEditorTabs')->tabs([
                        // TAB 1: Content & Overview
                        Tabs\Tab::make('Content & Overview')
                            ->icon('heroicon-o-pencil-square')
                            ->schema([
                                Textarea::make('short_description')
                                    ->label('Short Introduction / Card Summary')
                                    ->placeholder('Brief summary displayed in service grids and client proposals...')
                                    ->rows(2)
                                    ->required(),

                                DualEditor::make('content', 'content_blocks', 'editor_mode', 'Service Description & Content'),
                            ]),

                        // TAB 2: Inner Page Sections (Frontend Blocks)
                        Tabs\Tab::make('Inner Page Sections')
                            ->icon('heroicon-o-squares-2x2')
                            ->schema([
                                // 1. Hero Dark Banner
                                Section::make('1. Hero Dark Banner & Value Proposition')
                                    ->collapsible()
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('hero_badge')
                                                ->label('Hero Eyebrow Badge')
                                                ->placeholder('e.g. SEARCH ADS'),

                                            TextInput::make('focus_metric')
                                                ->label('Focus Metric Pill')
                                                ->placeholder('e.g. Delhi NCR & Pan-India'),
                                        ]),

                                        TextInput::make('hero_heading')
                                            ->label('Hero Headline')
                                            ->placeholder('e.g. Affordable Google Ads Services in Delhi NCR'),

                                        Textarea::make('hero_description')
                                            ->label('Hero Subtitle / Value Proposition')
                                            ->placeholder('Practical Google Search Ads support for businesses that need better enquiries...')
                                            ->rows(2),

                                        Grid::make(2)->schema([
                                            TextInput::make('cta_label')
                                                ->label('CTA Button Text')
                                                ->default('Talk about Google Ads'),

                                            TextInput::make('cta_url')
                                                ->label('CTA Target URL')
                                                ->default('/contact'),
                                        ]),

                                        MediaPicker::make('hero_media_id', 'Hero Background / Visual Media'),
                                    ]),

                                // 2. The Real Problem & Solution Approach
                                Section::make('2. The Real Problem & Solution Approach')
                                    ->collapsible()
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('problem_tag')
                                                ->label('Problem Tag / Eyebrow')
                                                ->default('THE REAL PROBLEM'),

                                            TextInput::make('problem_heading')
                                                ->label('Problem Headline')
                                                ->placeholder('Paying for clicks but hardly getting calls?'),
                                        ]),

                                        Textarea::make('problem_summary')
                                            ->label('Problem Summary')
                                            ->placeholder('We focus on useful search terms, clear ad copy, location settings...')
                                            ->rows(2),

                                        TextInput::make('how_deal_heading')
                                            ->label('Solution Approach Headline')
                                            ->default('How we deal with the problem'),

                                        Textarea::make('how_deal_content')
                                            ->label('Solution Approach Narrative')
                                            ->placeholder('Affordable Google Ads services in Delhi NCR should help you understand...')
                                            ->rows(3),
                                    ]),

                                // 3. What Can Be Included (Deliverables)
                                Section::make('3. What Can Be Included (Deliverables)')
                                    ->collapsible()
                                    ->schema([
                                        TagsInput::make('deliverables')
                                            ->label('Core Deliverables (Bullets / Pills)')
                                            ->placeholder('Add deliverable (press enter)...')
                                            ->helperText('Key deliverables shown on the service page.'),

                                        Textarea::make('included_disclaimer')
                                            ->label('Deliverables Disclaimer / Policy Note')
                                            ->placeholder('Final deliverables, timelines and pricing are agreed in writing...')
                                            ->rows(2),

                                        TagsInput::make('what_we_do')
                                            ->label('Execution Pillars (What We Do)')
                                            ->placeholder('Add execution pillar (press enter)...'),
                                    ]),

                                // 4. Our Simple Working Process
                                Section::make('4. Our Simple Working Process (4 Strategic Steps)')
                                    ->collapsible()
                                    ->schema([
                                        Repeater::make('process_steps')
                                            ->label('Sequential Working Process Steps')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    TextInput::make('step')
                                                        ->label('Step #')
                                                        ->placeholder('01')
                                                        ->columnSpan(1)
                                                        ->required(),

                                                    TextInput::make('title')
                                                        ->label('Step Title')
                                                        ->placeholder('Understand your offer and service area')
                                                        ->columnSpan(2)
                                                        ->required(),
                                                ]),

                                                Textarea::make('description')
                                                    ->label('Step Description')
                                                    ->placeholder('Audit commercial margins, ideal client profile...')
                                                    ->rows(2)
                                                    ->required(),
                                            ])
                                            ->itemLabel(fn (array $state): ?string => ($state['step'] ?? 'Step').' — '.($state['title'] ?? ''))
                                            ->collapsible()
                                            ->cloneable()
                                            ->reorderable()
                                            ->addActionLabel('+ Add Process Step'),
                                    ]),

                                // 5. Who This Is For & Target Locations
                                Section::make('5. Who This Is For & Geographic Locations')
                                    ->collapsible()
                                    ->schema([
                                        TextInput::make('who_for_heading')
                                            ->label('Target Heading')
                                            ->default('Who this is for'),

                                        Textarea::make('who_for_desc')
                                            ->label('Target Audience Description')
                                            ->placeholder('Businesses whose customers already search for their product or service...')
                                            ->rows(2),

                                        TagsInput::make('locations')
                                            ->label('Target Locations (Delhi NCR / Pan-India)')
                                            ->placeholder('Add location (press enter)...')
                                            ->helperText('e.g. New Delhi, Noida & Greater Noida, Gurugram, Ghaziabad, Faridabad, Pan-India Remote'),
                                    ]),

                                // 6. Commercial Sidebar Scope Card
                                Section::make('6. Commercial Sidebar Scope Card')
                                    ->collapsible()
                                    ->schema([
                                        TextInput::make('sidebar_heading')
                                            ->label('Sidebar Card Heading')
                                            ->default('Start with a clear scope.'),

                                        Textarea::make('sidebar_desc')
                                            ->label('Scope Description')
                                            ->placeholder('Tell us what you sell, where you work and what you want to improve...')
                                            ->rows(2),

                                        TagsInput::make('sidebar_checks')
                                            ->label('Value Checkpoints (Pills / Checkmarks)')
                                            ->placeholder('Add checkpoint (press enter)...')
                                            ->helperText('e.g. Remote team, Delhi NCR focus, Discuss scope before price, Your accounts stay yours, No guaranteed outcomes'),
                                    ]),

                                // 7. Problems We Help Solve
                                Section::make('7. Problems We Help Solve (3 Issue Cards)')
                                    ->collapsible()
                                    ->schema([
                                        Repeater::make('issues')
                                            ->label('Issues Breakdown')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    TextInput::make('num')
                                                        ->label('Issue #')
                                                        ->placeholder('ISSUE 01')
                                                        ->columnSpan(1)
                                                        ->required(),

                                                    TextInput::make('title')
                                                        ->label('Issue Title')
                                                        ->placeholder('Budget goes fast')
                                                        ->columnSpan(2)
                                                        ->required(),
                                                ]),

                                                Textarea::make('desc')
                                                    ->label('Resolution Description')
                                                    ->placeholder('We review broad keywords, irrelevant searches and negative keywords...')
                                                    ->rows(2)
                                                    ->required(),
                                            ])
                                            ->itemLabel(fn (array $state): ?string => ($state['num'] ?? 'Issue').' — '.($state['title'] ?? ''))
                                            ->collapsible()
                                            ->cloneable()
                                            ->addActionLabel('+ Add Issue'),
                                    ]),

                                // 8. Frequently Asked Questions (FAQs)
                                Section::make('8. Frequently Asked Questions (FAQs)')
                                    ->collapsible()
                                    ->schema([
                                        Repeater::make('faqs')
                                            ->label('Service FAQs')
                                            ->schema([
                                                TextInput::make('q')
                                                    ->label('Question')
                                                    ->placeholder('e.g. Are your Google Ads services affordable?')
                                                    ->required(),

                                                Textarea::make('a')
                                                    ->label('Answer')
                                                    ->placeholder('Direct, honest answer...')
                                                    ->rows(2)
                                                    ->required(),
                                            ])
                                            ->itemLabel(fn (array $state): ?string => $state['q'] ?? 'FAQ')
                                            ->collapsible()
                                            ->cloneable()
                                            ->addActionLabel('+ Add FAQ Item'),
                                    ]),
                            ]),

                        // TAB 3: Professional On-Page SEO Suite (Yoast / RankMath Full Width)
                        Tabs\Tab::make('On-Page SEO (Yoast / RankMath)')
                            ->icon('heroicon-o-magnifying-glass')
                            ->schema([
                                SeoFields::makeYoastBox('Service'),
                            ]),
                    ]),
                ]),

                // ── DOCUMENT SIDEBAR (1 COLUMN) ──────────────────────────
                Group::make()->columnSpan(['default' => 1, 'lg' => 1])->schema([
                    // Document Publishing Card
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
                            ->default('published')
                            ->required()
                            ->live()
                            ->native(false),

                        DateTimePicker::make('published_at')
                            ->label('Publish Date')
                            ->default(now())
                            ->native(false),

                        DateTimePicker::make('scheduled_for')
                            ->label('Scheduled Date (IST)')
                            ->timezone('Asia/Kolkata')
                            ->visible(fn ($get) => $get('status') === 'scheduled')
                            ->native(false)
                            ->helperText('Scheduled in Indian Standard Time (IST). Automatically published by scheduler.'),

                        TextInput::make('pricing_tier')
                            ->label('Pricing Tier')
                            ->placeholder('e.g. From ₹10,999*'),

                        Select::make('category')
                            ->label('Category')
                            ->options([
                                'Paid Ads' => 'Paid Ads (Search & Social)',
                                'SEO & Search' => 'SEO & Search (Google Visibility)',
                                'Websites' => 'Websites (Landing Pages & CRO)',
                                'Creative & Video' => 'Creative & Video (Creatives, Reels, Video)',
                                'Social Media' => 'Social Media (Organic Growth)',
                            ])
                            ->required()
                            ->native(false),

                        TextInput::make('sort_order')
                            ->label('Menu Order')
                            ->numeric()
                            ->default(1),
                    ]),

                    // Quick SEO Health Widget
                    Section::make('SEO Quick Health')->schema([
                        Placeholder::make('quick_seo_health')
                            ->label('')
                            ->content(function ($record) {
                                $score = $record?->seo?->seo_score ?? 98;
                                $kw = $record?->seo?->focus_keyword ?? ($record ? strtolower($record->name).' services delhi ncr' : 'Keyword not set');

                                return new HtmlString("
                                    <div style='background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px; text-align:center;'>
                                        <div style='display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:#dcfce7; border:3px solid #22c55e; color:#15803d; font-size:22px; font-weight:800; margin-bottom:8px;'>
                                            {$score}
                                        </div>
                                        <div style='font-size:12px; font-weight:800; color:#166534; text-transform:uppercase; letter-spacing:0.05em;'>Optimal SEO Score</div>
                                        <div style='font-size:12px; color:#4b5563; margin-top:6px; word-break:break-all;'><strong>Focus:</strong> {$kw}</div>
                                    </div>
                                ");
                            }),
                    ]),

                    // Related Proof & Case Studies
                    Section::make('Related Proof & Case Studies')
                        ->collapsible()
                        ->collapsed()
                        ->schema([
                            Select::make('caseStudies')
                                ->label('Related Case Studies')
                                ->multiple()
                                ->relationship('caseStudies', 'project_name')
                                ->preload(),
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
                TextColumn::make('name')
                    ->label('Service')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),

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
                SelectFilter::make('category')
                    ->options([
                        'Paid Advertising' => 'Paid Advertising',
                        'Organic SEO' => 'Organic SEO',
                        'Web & CRO' => 'Web & CRO',
                        'Creative & Social' => 'Creative & Social',
                        'Analytics & Tracking' => 'Analytics & Tracking',
                    ]),
                TrashedFilter::make(),
            ])
            ->actions([
                EditAction::make(),
                ...static::getScheduledPublishingActions('services.manage'),
                Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn ($record) => "https://getintofeed.com/services/{$record->slug}", true),
                DeleteAction::make()
                    ->requiresConfirmation()
                    ->modalHeading('Delete Service')
                    ->modalDescription('Are you sure you want to delete this service? It will immediately disappear from the live frontend in real time.')
                    ->successNotificationTitle('Service deleted and frontend updated!'),
                RestoreAction::make(),
                ForceDeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->requiresConfirmation()
                        ->successNotificationTitle('Selected services deleted!'),
                    RestoreBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}
