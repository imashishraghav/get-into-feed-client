<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Tabs\Tab;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\ViewField;
use Illuminate\Support\HtmlString;

class SeoFields
{
    public static function makeYoastBox(string $defaultSchema = 'Article'): Section
    {
        return Section::make()
            ->heading(new HtmlString('
                <span class="flex items-center gap-3">
                    <span class="relative flex items-center justify-center w-8 h-8 rounded-lg shadow-sm" style="background: linear-gradient(135deg, #a4286a 0%, #791c4d 100%); box-shadow: 0 4px 10px -2px rgba(164, 40, 106, 0.35);">
                        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2l2.4 5 5.6.8-4 4 1 5.5-5-2.7-5 2.7 1-5.5-4-4 5.6-.8z"/>
                        </svg>
                        <span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                        </span>
                    </span>
                    <span class="flex items-center gap-2">
                        <span style="font-family: Georgia, \'Times New Roman\', serif; font-weight: 900; font-size: 20px; color: #a4286a; letter-spacing: -0.4px; line-height: 1;">yoast</span>
                        <span class="text-slate-900 dark:text-white font-extrabold text-base tracking-tight leading-none">SEO</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/60 dark:to-pink-950/60 text-[#a4286a] dark:text-pink-300 border border-purple-200/80 dark:border-purple-800 shadow-2xs">PREMIUM AI</span>
                    </span>
                </span>
            '))
            ->description(new HtmlString('
                <span class="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span class="font-medium text-slate-600 dark:text-slate-300">Intelligent Search Engine Optimization & Real-Time Content Discovery Engine</span>
                    <span class="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                    <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Real-time Audit
                    </span>
                    <span class="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
                    <span class="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        SERP + AI Assistants Ready
                    </span>
                </span>
            '))
            ->collapsible()
            ->extraAttributes([
                'class' => 'yoast-seo-suite-section',
            ])
            ->schema([
                ViewField::make('yoast_brand_header')
                    ->view('filament.forms.yoast-brand-header'),

                Tabs::make('YoastTabs')
                    ->tabs([
                        // 1. Core SEO Tab
                        Tab::make('SEO')
                            ->icon('heroicon-m-magnifying-glass')
                            ->badge('Yoast')
                            ->schema([
                                Section::make('Focus keyphrase')
                                    ->collapsible()
                                    ->schema([
                                        TextInput::make('seo.focus_keyword')
                                            ->label('Focus keyphrase')
                                            ->placeholder('Type here e.g. performance marketing agency')
                                            ->live(debounce: 500)
                                            ->helperText('The primary word or phrase you want this content found for across search engines.'),

                                        TagsInput::make('seo.target_keywords')
                                            ->label('Secondary / Related Keyphrases')
                                            ->placeholder('Add synonym or long-tail query & press enter')
                                            ->helperText('Add secondary keywords, LSI synonyms, and related search queries to rank across multiple search variations.'),
                                    ]),

                                Section::make('Search appearance')
                                    ->description('Determine how your post should look in the Google search results.')
                                    ->collapsible()
                                    ->schema([
                                        ViewField::make('serp_preview')
                                            ->view('filament.forms.serp-preview'),

                                        TextInput::make('seo.seo_title')
                                            ->label('SEO title')
                                            ->placeholder('Page Title | GetIntoFeed')
                                            ->maxLength(60)
                                            ->live(debounce: 500)
                                            ->helperText('Recommended: up to 60 characters.'),

                                        Textarea::make('seo.meta_description')
                                            ->label('Meta description')
                                            ->placeholder('Please provide a meta description. If empty, search engines will generate one from your post content.')
                                            ->rows(3)
                                            ->maxLength(160)
                                            ->live(debounce: 500)
                                            ->helperText('Recommended: up to 160 characters.'),

                                        TextInput::make('seo.canonical_url')
                                            ->label('Canonical URL')
                                            ->placeholder('https://getintofeed.com/...'),
                                    ]),

                                Section::make('SEO analysis')
                                    ->collapsible()
                                    ->schema([
                                        ViewField::make('seo_checklist')
                                            ->view('filament.forms.seo-checklist'),
                                    ]),
                            ]),

                        // 2. Readability Tab
                        Tab::make('Readability')
                            ->icon('heroicon-m-book-open')
                            ->badge('Editor')
                            ->schema([
                                Section::make('Readability Analysis')
                                    ->description('Content flow, word count, sentence length, and reading comfort.')
                                    ->schema([
                                        ViewField::make('reading_analysis')
                                            ->view('filament.forms.readability-analysis'),
                                    ]),
                            ]),

                        // 3. Schema Structured Data Tab
                        Tab::make('Schema')
                            ->icon('heroicon-m-code-bracket')
                            ->badge('JSON-LD')
                            ->schema([
                                Section::make('Schema.org Structured Data')
                                    ->description('Semantic structured data markup for Google Rich Results.')
                                    ->schema([
                                        Select::make('seo.schema_type')
                                            ->label('Schema Type')
                                            ->options([
                                                'Article' => 'Article (Blog Post)',
                                                'NewsArticle' => 'NewsArticle',
                                                'TechArticle' => 'TechArticle / Technical Guide',
                                                'WebPage' => 'WebPage (Standard Page)',
                                                'Service' => 'Service (Agency Service)',
                                                'Organization' => 'Organization',
                                                'FAQPage' => 'FAQPage',
                                            ])
                                            ->default($defaultSchema),

                                        Placeholder::make('jsonld_preview')
                                            ->label('Generated JSON-LD')
                                            ->content(function ($get) use ($defaultSchema) {
                                                $type = $get('seo.schema_type') ?: $defaultSchema;
                                                $title = $get('seo.seo_title') ?: ($get('name') ?: ($get('title') ?: 'GetIntoFeed'));
                                                $desc = $get('seo.meta_description') ?: 'GetIntoFeed Growth Studio';
                                                $data = [
                                                    '@context' => 'https://schema.org',
                                                    '@type' => $type,
                                                    'name' => $title,
                                                    'description' => $desc,
                                                    'url' => 'https://getintofeed.com/'.($get('slug') ?? ''),
                                                ];

                                                return new HtmlString('<pre class="p-3 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono overflow-x-auto">'.json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).'</pre>');
                                            }),
                                    ]),
                            ]),

                        // 4. Social Networks Tab
                        Tab::make('Social')
                            ->icon('heroicon-m-share')
                            ->badge('OpenGraph')
                            ->schema([
                                Section::make('Social Share Previews')
                                    ->description('Card previews for Facebook, Twitter/X, and LinkedIn.')
                                    ->schema([
                                        ViewField::make('social_preview')
                                            ->view('filament.forms.social-preview'),

                                        Grid::make(2)->schema([
                                            TextInput::make('seo.og_title')
                                                ->label('Facebook & LinkedIn Title Override')
                                                ->placeholder('Defaults to SEO Title if empty'),

                                            TextInput::make('seo.twitter_title')
                                                ->label('Twitter / X Title Override')
                                                ->placeholder('Defaults to Social Title if empty'),
                                        ]),

                                        Grid::make(2)->schema([
                                            Textarea::make('seo.og_description')
                                                ->label('Facebook / LinkedIn Description Override')
                                                ->rows(2)
                                                ->placeholder('Defaults to Meta Description if empty'),

                                            Textarea::make('seo.twitter_description')
                                                ->label('Twitter / X Description Override')
                                                ->rows(2)
                                                ->placeholder('Defaults to Social Description if empty'),
                                        ]),

                                        MediaPicker::make('seo.og_media_id', 'Social Share Image (Media Library)'),
                                    ]),
                            ]),

                        // 5. AI & Search Assistants Tab (GEO)
                        Tab::make('AI & Assistants')
                            ->icon('heroicon-m-sparkles')
                            ->badge('GEO')
                            ->schema([
                                Placeholder::make('ai_info')
                                    ->label('')
                                    ->content(new HtmlString('
                                        <div class="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-200/80 dark:border-purple-800/60 flex items-start gap-3.5 mb-2">
                                            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                            </div>
                                            <div>
                                                <h4 class="text-sm font-bold text-slate-900 dark:text-white">Generative Engine Optimization (GEO) & AI Search Discovery</h4>
                                                <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">Ensure this content is accurately crawled, synthesized, and cited by AI engines including SearchGPT, Perplexity AI, Claude, and Apple Intelligence.</p>
                                                <div class="flex flex-wrap gap-2 mt-2.5">
                                                    <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-zinc-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-zinc-700">✓ Perplexity Citation Ready</span>
                                                    <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-zinc-800 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-zinc-700">✓ SearchGPT Compliant</span>
                                                    <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-zinc-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-zinc-700">✓ Applebot Structured</span>
                                                </div>
                                            </div>
                                        </div>
                                    ')),

                                Section::make('AI Crawler Directives')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            Toggle::make('seo.robots_index')
                                                ->label('Allow AI Search Engines to Index & Synthesize')
                                                ->default(true)
                                                ->helperText('Enables AI crawlers (PerplexityBot, GPTBot, ClaudeBot, Applebot) to index content for answering searchers.'),

                                            Toggle::make('seo.robots_follow')
                                                ->label('Allow AI Bots to Follow Reference Links')
                                                ->default(true)
                                                ->helperText('Permits AI assistants to trace and endorse your external authority citations.'),
                                        ]),
                                    ]),
                            ]),

                        // 6. Advanced Crawl & Indexing Directives Tab
                        Tab::make('Advanced')
                            ->icon('heroicon-m-cog-6-tooth')
                            ->schema([
                                Section::make('Search Engine Crawl & Index Directives')
                                    ->description('Granular directives for Googlebot, Bingbot, and robots meta tags.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            Select::make('seo.robots_index')
                                                ->label('Allow search engines to show this in search results?')
                                                ->options([
                                                    1 => 'Yes (Index - recommended)',
                                                    0 => 'No (Noindex - hide from Google)',
                                                ])
                                                ->default(1)
                                                ->native(false)
                                                ->helperText('Setting to "No" tells search engines not to index this post.'),

                                            Select::make('seo.robots_follow')
                                                ->label('Should search engines follow links on this content?')
                                                ->options([
                                                    1 => 'Yes (Follow links)',
                                                    0 => 'No (Nofollow - don\'t follow links)',
                                                ])
                                                ->default(1)
                                                ->native(false)
                                                ->helperText('Setting to "No" tells search engines not to endorse external links on this page.'),
                                        ]),
                                    ]),

                                Section::make('XML Sitemap Settings')
                                    ->description('Customize visibility and crawler re-check frequency in your XML sitemap.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            Toggle::make('seo.in_sitemap')
                                                ->label('Include in XML Sitemap')
                                                ->default(true)
                                                ->helperText('Keep enabled for fast discovery.'),

                                            Select::make('seo.sitemap_priority')
                                                ->label('Sitemap Priority')
                                                ->options([
                                                    '1.0' => '1.0 (Critical / Pillar)',
                                                    '0.8' => '0.8 (High - Standard Article)',
                                                    '0.6' => '0.6 (Medium)',
                                                    '0.4' => '0.4 (Low)',
                                                ])
                                                ->default('0.8')
                                                ->native(false),

                                            Select::make('seo.sitemap_changefreq')
                                                ->label('Change Frequency')
                                                ->options([
                                                    'always' => 'Always',
                                                    'hourly' => 'Hourly',
                                                    'daily' => 'Daily',
                                                    'weekly' => 'Weekly',
                                                    'monthly' => 'Monthly',
                                                    'yearly' => 'Yearly',
                                                    'never' => 'Never',
                                                ])
                                                ->default('weekly')
                                                ->native(false),
                                        ]),
                                    ]),
                            ]),

                        // 7. Backlinks & Authority Citations Tab
                        Tab::make('Backlinks')
                            ->icon('heroicon-m-link')
                            ->schema([
                                Repeater::make('seo.backlinks')
                                    ->label('Authority Citations & Backlinks')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('anchor')->label('Anchor Text')->placeholder('e.g. Google Search Central')->required(),
                                            TextInput::make('url')->label('Target URL')->url()->placeholder('https://...')->required(),
                                        ]),
                                    ])
                                    ->itemLabel(fn (array $state): ?string => ($state['anchor'] ?? 'Backlink').' ('.($state['url'] ?? '').')')
                                    ->collapsible()
                                    ->cloneable()
                                    ->addActionLabel('+ Add Backlink / Citation')
                                    ->helperText('Manage internal links and external authority citations for search engine trust.'),
                            ]),
                    ]),
            ]);
    }

    public static function make(): Section
    {
        return Section::make('SEO & Social Settings')
            ->collapsible()
            ->schema([
                TextInput::make('seo.seo_title')
                    ->label('SEO Title')
                    ->placeholder('Page Title | GetIntoFeed')
                    ->maxLength(60)
                    ->live(debounce: 500)
                    ->helperText('Recommended: up to 60 characters.'),

                Textarea::make('seo.meta_description')
                    ->label('Meta Description')
                    ->placeholder('Concise summary displayed in search snippets...')
                    ->rows(2)
                    ->maxLength(160)
                    ->live(debounce: 500)
                    ->helperText('Recommended: up to 160 characters.'),

                TextInput::make('seo.focus_keyword')
                    ->label('Focus Keyword')
                    ->placeholder('e.g. performance marketing agency'),

                TagsInput::make('seo.target_keywords')
                    ->label('Related / Secondary Keyphrases')
                    ->placeholder('Type keyword & press enter'),

                TextInput::make('seo.canonical_url')
                    ->label('Canonical URL')
                    ->placeholder('https://getintofeed.com/...'),

                Repeater::make('seo.backlinks')
                    ->label('Backlinks & Authority Citations')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('anchor')->label('Anchor Text')->placeholder('e.g. Google Official Documentation')->required(),
                            TextInput::make('url')->label('Target URL')->url()->placeholder('https://...')->required(),
                        ]),
                    ])
                    ->itemLabel(fn (array $state): ?string => ($state['anchor'] ?? 'Backlink').' ('.($state['url'] ?? '').')')
                    ->collapsible()
                    ->cloneable()
                    ->addActionLabel('+ Add Backlink / Citation')
                    ->helperText('Manage authority backlink citations and internal links for On-Page SEO ranking.'),

                Grid::make(2)->schema([
                    Toggle::make('seo.robots_index')
                        ->label('Index (Robots)')
                        ->default(true),

                    Toggle::make('seo.robots_follow')
                        ->label('Follow (Robots)')
                        ->default(true),
                ]),

                ViewField::make('serp_preview')
                    ->view('filament.forms.serp-preview'),

                ViewField::make('seo_checklist')
                    ->view('filament.forms.seo-checklist'),

                Section::make('Social Share Previews')
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        ViewField::make('social_preview')
                            ->view('filament.forms.social-preview'),

                        TextInput::make('seo.og_title')
                            ->label('Social Title Override'),

                        Textarea::make('seo.og_description')
                            ->label('Social Description Override')
                            ->rows(2),

                        MediaPicker::make('seo.og_media_id', 'Social Share Image (Media Library)'),
                    ]),

                Section::make('Schema.org Structured Data')
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        Select::make('seo.schema_type')
                            ->label('Schema Type')
                            ->options([
                                'WebPage' => 'WebPage (Standard Page)',
                                'Service' => 'Service (Agency Service)',
                                'Article' => 'Article (Blog Post)',
                                'Organization' => 'Organization',
                                'FAQPage' => 'FAQPage',
                            ])
                            ->default('WebPage'),

                        Placeholder::make('jsonld_preview')
                            ->label('Generated JSON-LD')
                            ->content(function ($get) {
                                $type = $get('seo.schema_type') ?: 'WebPage';
                                $title = $get('seo.seo_title') ?: ($get('name') ?: ($get('title') ?: 'GetIntoFeed'));
                                $desc = $get('seo.meta_description') ?: 'GetIntoFeed Growth Studio';
                                $data = [
                                    '@context' => 'https://schema.org',
                                    '@type' => $type,
                                    'name' => $title,
                                    'description' => $desc,
                                    'url' => 'https://getintofeed.com/'.($get('slug') ?? ''),
                                ];

                                return new HtmlString('<pre class="p-2.5 bg-slate-50 text-slate-800 rounded border border-slate-200 text-xs font-mono overflow-x-auto">'.json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).'</pre>');
                            }),
                    ]),
            ]);
    }
}
