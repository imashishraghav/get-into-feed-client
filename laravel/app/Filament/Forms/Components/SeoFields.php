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
    public static function makeLlmSeoStudioBox(string $defaultSchema = 'Article'): Section
    {
        return Section::make()
            ->heading(new HtmlString('
                <span class="flex items-center gap-3">
                    <span class="relative flex items-center justify-center w-8 h-8 rounded-lg shadow-sm" style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.4);">
                        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
                            <path d="M12 12L2.5 7.5"/>
                            <path d="M12 12v10"/>
                        </svg>
                        <span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                    </span>
                    <span class="flex items-center gap-2">
                        <span class="text-slate-900 dark:text-white font-extrabold text-base tracking-tight leading-none">GetIntoFeed SEO & LLMs Studio</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/60 dark:to-indigo-950/60 text-blue-700 dark:text-indigo-300 border border-blue-200/80 dark:border-indigo-800 shadow-2xs">GEO & AI Citable</span>
                    </span>
                </span>
            '))
            ->description(new HtmlString('
                <span class="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span class="font-medium text-slate-600 dark:text-slate-300">Generative Engine Optimization (GEO) • LLM Parseability & AI Citation Readiness • Rich SERP Simulator</span>
                    <span class="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                    <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Real-time AI Audit
                    </span>
                    <span class="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
                    <span class="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Perplexity & ChatGPT Ready
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

                Tabs::make('AiSeoTabs')
                    ->tabs([
                        // 1. LLM Readability & AI Citations Tab (PRIMARY TAB)
                        Tab::make('LLM Readability & AI Citations')
                            ->icon('heroicon-m-sparkles')
                            ->badge('LLM / GEO')
                            ->schema([
                                Section::make('AI Parseability, Flesch Score & Direct Answer Readiness')
                                    ->description('Optimize content structure for Perplexity, ChatGPT Search, Claude, and Google AI Overviews.')
                                    ->schema([
                                        ViewField::make('reading_analysis')
                                            ->view('filament.forms.readability-analysis'),
                                    ]),
                            ]),

                        // 2. Focus Keyphrase & Semantic Entities Tab
                        Tab::make('Keywords & Semantic Entities')
                            ->icon('heroicon-m-magnifying-glass')
                            ->badge('Topical')
                            ->schema([
                                Section::make('Focus Keyphrase & Semantic Graph')
                                    ->collapsible()
                                    ->schema([
                                        TextInput::make('seo.focus_keyword')
                                            ->label('Focus Keyphrase')
                                            ->placeholder('Type primary keyphrase e.g. performance marketing agency')
                                            ->live(debounce: 500)
                                            ->helperText('The core topical entity and primary search query you want this page ranked for.'),

                                        TagsInput::make('seo.target_keywords')
                                            ->label('Secondary / LSI Keyphrases')
                                            ->placeholder('Add synonym or long-tail entity & press enter')
                                            ->helperText('Semantic entities, LSI synonyms, and subtopic variations that strengthen topical authority.'),
                                    ]),

                                Section::make('14-Point Search Engine Health Audit')
                                    ->collapsible()
                                    ->schema([
                                        ViewField::make('seo_checklist')
                                            ->view('filament.forms.seo-checklist'),
                                    ]),
                            ]),

                        // 3. Google & AI Search SERP Simulator Tab
                        Tab::make('Google & AI Search SERP')
                            ->icon('heroicon-m-globe-alt')
                            ->badge('SERP')
                            ->schema([
                                Section::make('Search & Citation Appearance')
                                    ->description('Simulate how this article appears in Google Search and AI Overview citation boxes.')
                                    ->collapsible()
                                    ->schema([
                                        ViewField::make('serp_preview')
                                            ->view('filament.forms.serp-preview'),

                                        TextInput::make('seo.seo_title')
                                            ->label('SEO Title')
                                            ->placeholder('Page Title | GetIntoFeed')
                                            ->maxLength(60)
                                            ->live(debounce: 500)
                                            ->helperText('Recommended: up to 60 characters.'),

                                        Textarea::make('seo.meta_description')
                                            ->label('Meta Description')
                                            ->placeholder('Please provide a compelling meta description for search snippets and AI answer generation.')
                                            ->rows(3)
                                            ->maxLength(160)
                                            ->live(debounce: 500)
                                            ->helperText('Recommended: up to 160 characters.'),

                                        TextInput::make('seo.canonical_url')
                                            ->label('Canonical URL')
                                            ->placeholder('https://getintofeed.com/...'),
                                    ]),
                            ]),

                        // 4. Schema Structured Data Tab
                        Tab::make('Schema.org Structured Data')
                            ->icon('heroicon-m-code-bracket')
                            ->badge('JSON-LD')
                            ->schema([
                                Section::make('Semantic Structured Data Markup')
                                    ->description('Machine-readable JSON-LD schema for Google Rich Results and AI knowledge graphs.')
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

                        // 5. Social Share Cards Tab
                        Tab::make('Social Share Previews')
                            ->icon('heroicon-m-share')
                            ->badge('OpenGraph')
                            ->schema([
                                Section::make('Social Media Card Overrides')
                                    ->description('Card previews and overrides for Facebook, LinkedIn, and X/Twitter.')
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

                        // 6. AI Crawl Directives & XML Sitemap Tab
                        Tab::make('AI Crawl & Index Directives')
                            ->icon('heroicon-m-cpu-chip')
                            ->badge('Robots')
                            ->schema([
                                Section::make('AI Search Engine Directives')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            Toggle::make('seo.robots_index')
                                                ->label('Allow AI Search Engines & Google to Index')
                                                ->default(true)
                                                ->helperText('Enables AI crawlers (PerplexityBot, GPTBot, ClaudeBot, Googlebot) to index and synthesize content.'),

                                            Toggle::make('seo.robots_follow')
                                                ->label('Allow Crawlers to Follow Citations')
                                                ->default(true)
                                                ->helperText('Permits AI assistants to trace and endorse your external authority citations.'),
                                        ]),
                                    ]),

                                Section::make('XML Sitemap Settings')
                                    ->description('Customize visibility and crawler re-check frequency in your XML sitemap.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            Toggle::make('seo.in_sitemap')
                                                ->label('Include in XML Sitemap')
                                                ->default(true),

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

                        // 7. Authority Citations & Backlinks Tab
                        Tab::make('Authority Citations & Backlinks')
                            ->icon('heroicon-m-link')
                            ->schema([
                                Repeater::make('seo.backlinks')
                                    ->label('Authority Citations & References')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('anchor')->label('Anchor Text')->placeholder('e.g. Google Search Central')->required(),
                                            TextInput::make('url')->label('Target URL')->url()->placeholder('https://...')->required(),
                                        ]),
                                    ])
                                    ->itemLabel(fn (array $state): ?string => ($state['anchor'] ?? 'Citation').' ('.($state['url'] ?? '').')')
                                    ->collapsible()
                                    ->cloneable()
                                    ->addActionLabel('+ Add Citation Reference')
                                    ->helperText('Manage internal links and external authority citations for search engine and LLM trust flow.'),
                            ]),
                    ]),
            ]);
    }

    public static function makeYoastBox(string $defaultSchema = 'Article'): Section
    {
        return static::makeLlmSeoStudioBox($defaultSchema);
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
