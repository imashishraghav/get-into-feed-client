<?php

namespace App\Filament\Pages;

use App\Models\AuditLog;
use App\Models\Revision;
use App\Models\SectionTemplate;
use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Tabs\Tab;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Cache;

class WebsiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationGroup = 'Settings & Operations';

    protected static ?string $navigationLabel = 'Website Settings';

    protected static ?string $title = 'Enterprise Website Settings & Branding';

    protected static ?int $navigationSort = 1;

    protected static string $view = 'filament.pages.website-settings';

    public ?array $data = [];

    public function mount(): void
    {
        // Ensure default templates are seeded
        SectionTemplate::seedDefaultTemplates();

        // Load all settings into dictionary
        $all = Setting::allAsDictionary();

        $defaultNav = [
            ['label' => 'Services', 'url' => '/services', 'is_highlight' => false],
            ['label' => 'Pricing', 'url' => '/pricing', 'is_highlight' => false],
            ['label' => 'Work', 'url' => '/work', 'is_highlight' => false],
            ['label' => 'About', 'url' => '/about', 'is_highlight' => false],
            ['label' => 'Blog', 'url' => '/blog', 'is_highlight' => false],
            ['label' => 'Contact', 'url' => '/contact', 'is_highlight' => true],
        ];

        $defaultFooterColumns = [
            [
                'title' => 'Find your way',
                'links' => [
                    ['label' => 'Home', 'url' => '/'],
                    ['label' => 'Services', 'url' => '/services'],
                    ['label' => 'About us', 'url' => '/about'],
                    ['label' => 'Blog', 'url' => '/blog'],
                    ['label' => 'Contact us', 'url' => '/contact'],
                    ['label' => 'Pricing', 'url' => '/pricing'],
                ],
            ],
            [
                'title' => 'Popular services',
                'links' => [
                    ['label' => 'Google Ads', 'url' => '/services/google-ads-services-delhi-ncr'],
                    ['label' => 'Meta Ads', 'url' => '/services/meta-ads-services-delhi-ncr'],
                    ['label' => 'SEO', 'url' => '/services/seo-services-delhi-ncr'],
                    ['label' => 'Website design', 'url' => '/services/website-design-delhi-ncr'],
                ],
            ],
            [
                'title' => 'Talk directly',
                'links' => [
                    ['label' => 'hello@getintofeed.com', 'url' => 'mailto:hello@getintofeed.com'],
                    ['label' => '+91 88103 56950', 'url' => 'tel:+918810356950'],
                    ['label' => 'Privacy note', 'url' => '/privacy-policy'],
                    ['label' => 'Terms of service', 'url' => '/terms-of-service'],
                ],
            ],
        ];

        $this->form->fill([
            // 1. General
            'site_name' => $all['site_name'] ?? 'GetIntoFeed',
            'agency_name' => $all['agency_name'] ?? 'GetIntoFeed Growth Studio',
            'tagline' => $all['tagline'] ?? "India's Elite Performance & Growth Marketing Agency",
            'site_url' => $all['site_url'] ?? 'https://getintofeed.com',
            'logo_text' => $all['logo_text'] ?? 'GETINTOFEED',
            'logo_url' => $all['logo_url'] ?? null,
            'alt_logo_url' => $all['alt_logo_url'] ?? null,
            'favicon_url' => $all['favicon_url'] ?? '/favicon.svg',
            'contact_phone' => $all['contact_phone'] ?? $all['phone_primary'] ?? '+91 8810356950',
            'contact_whatsapp' => $all['contact_whatsapp'] ?? '+91 8810356950',
            'contact_email' => $all['contact_email'] ?? $all['email_primary'] ?? 'hello@getintofeed.com',
            'contact_address' => $all['contact_address'] ?? $all['address'] ?? 'New Delhi, Delhi NCR, India',
            'starter_pricing' => $all['starter_pricing'] ?? '₹10,999*',
            'growth_pricing' => $all['growth_pricing'] ?? '₹24,999*',

            // 2. Header & Nav
            'announcement_enabled' => isset($all['announcement_enabled']) ? (bool) $all['announcement_enabled'] : true,
            'announcement_text' => $all['announcement_text'] ?? 'GET SEEN ONLINE ✳ Google Ads · SEO · Websites · Social',
            'announcement_link' => $all['announcement_link'] ?? '/pricing',
            'announcement_link_label' => $all['announcement_link_label'] ?? 'Starter support from ₹10,999* →',
            'header_cta_label' => $all['header_cta_label'] ?? 'Start a Project',
            'header_cta_url' => $all['header_cta_url'] ?? '/contact',
            'navigation_items' => ! empty($all['navigation_items']) && is_array($all['navigation_items']) ? $all['navigation_items'] : $defaultNav,

            // 3. Footer & Legal
            'footer_description' => $all['footer_description'] ?? 'Google Ads, SEO, websites and creative work for businesses ready to build a stronger online presence.',
            'footer_subtext' => $all['footer_subtext'] ?? 'An independent, remote-first freelance team serving Delhi NCR and beyond.',
            'copyright_text' => $all['copyright_text'] ?? '© 2026 GetIntoFeed · Independent digital marketing team',
            'footer_bottom_note' => $all['footer_bottom_note'] ?? 'Independent freelancers · No made-up results · Your accounts stay yours',
            'footer_columns' => ! empty($all['footer_columns']) && is_array($all['footer_columns']) ? $all['footer_columns'] : $defaultFooterColumns,
            'instagram_url' => $all['instagram_url'] ?? 'https://instagram.com/getintofeed',
            'linkedin_url' => $all['linkedin_url'] ?? 'https://linkedin.com/company/getintofeed',
            'twitter_url' => $all['twitter_url'] ?? 'https://x.com/getintofeed',
            'youtube_url' => $all['youtube_url'] ?? '',
            'github_url' => $all['github_url'] ?? '',

            // 4. Branding & Appearance
            'primary_color' => $all['primary_color'] ?? '#d4ff00',
            'dark_color' => $all['dark_color'] ?? '#111714',
            'blue_accent' => $all['blue_accent'] ?? '#3155f4',
            'font_family' => $all['font_family'] ?? 'Space Grotesk',
            'button_radius' => $all['button_radius'] ?? 'rounded-xl',

            // 5. Global SEO
            'default_meta_title' => $all['default_meta_title'] ?? 'GetIntoFeed | Top Performance Marketing, Google Ads & SEO Agency Delhi NCR',
            'default_meta_description' => $all['default_meta_description'] ?? 'Scale pipeline with GetIntoFeed performance marketing, SEO, Google Ads, and custom high-converting web engineering in Delhi NCR.',
            'default_share_image' => $all['default_share_image'] ?? 'https://getintofeed.com/agency-hero.png',
            'organization_name' => $all['organization_name'] ?? 'GetIntoFeed Growth Studio',
            'organization_schema_type' => $all['organization_schema_type'] ?? 'Organization',
            'robots_default' => $all['robots_default'] ?? 'index, follow',

            // 6. Analytics & Integrations
            'gtm_id' => $all['gtm_id'] ?? 'GTM-PHJF6JHM',
            'ga4_id' => $all['ga4_id'] ?? 'G-LHVZY6EFW1',
            'meta_pixel_id' => $all['meta_pixel_id'] ?? '',
            'custom_head_scripts' => $all['custom_head_scripts'] ?? '',
            'custom_footer_scripts' => $all['custom_footer_scripts'] ?? '',
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Tabs::make('WebsiteSettingsTabs')
                    ->tabs([
                        // TAB 1: GENERAL SETTINGS
                        Tab::make('General Settings')
                            ->icon('heroicon-o-building-office')
                            ->schema([
                                Section::make('Brand Identity & URLs')
                                    ->description('Core corporate credentials and canonical web properties.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('site_name')->label('Website Short Name')->required(),
                                            TextInput::make('agency_name')->label('Official Agency Name')->required(),
                                            TextInput::make('site_url')->label('Canonical Base URL')->url()->required(),
                                        ]),
                                        TextInput::make('tagline')->label('Brand Tagline / Slogan')->columnSpanFull(),
                                        Grid::make(3)->schema([
                                            TextInput::make('logo_text')->label('Header Logo Text Mark (e.g. GETINTOFEED)')->required(),
                                            TextInput::make('logo_url')->label('Primary Logo Image URL (Optional)')->placeholder('/assets/logo.png'),
                                            TextInput::make('favicon_url')->label('Favicon URL')->placeholder('/favicon.svg'),
                                        ]),
                                    ]),

                                Section::make('Contact Coordinates')
                                    ->description('Public customer communication channels displayed on header and contact modules.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('contact_phone')->label('Direct Phone')->tel()->required(),
                                            TextInput::make('contact_whatsapp')->label('WhatsApp Contact Number')->required(),
                                            TextInput::make('contact_email')->label('Primary Inbound Email')->email()->required(),
                                            TextInput::make('contact_address')->label('Physical / Studio Address')->required(),
                                        ]),
                                        Grid::make(2)->schema([
                                            TextInput::make('starter_pricing')->label('Starter Sprint Pill Text')->default('₹10,999*'),
                                            TextInput::make('growth_pricing')->label('Scale Sprint Pill Text')->default('₹24,999*'),
                                        ]),
                                    ]),
                            ]),

                        // TAB 2: HEADER & NAVIGATION
                        Tab::make('Header & Navigation')
                            ->icon('heroicon-o-bars-3')
                            ->schema([
                                Section::make('Top Announcement Banner')
                                    ->description('High-visibility marketing bar above main navigation.')
                                    ->schema([
                                        Toggle::make('announcement_enabled')->label('Show Announcement Bar')->default(true),
                                        Grid::make(3)->schema([
                                            TextInput::make('announcement_text')->label('Announcement Copy')->columnSpan(2)->required(),
                                            TextInput::make('announcement_link')->label('Target Link URL')->default('/pricing')->required(),
                                        ]),
                                        TextInput::make('announcement_link_label')->label('Link Action Text')->default('Starter support from ₹10,999* →'),
                                    ]),

                                Section::make('Header Call-to-Action')
                                    ->description('Main primary conversion button on the right of the header.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('header_cta_label')->label('Button Label')->default('Start a Project')->required(),
                                            TextInput::make('header_cta_url')->label('Button Target URL')->default('/contact')->required(),
                                        ]),
                                    ]),

                                Section::make('Navigation Menu Manager')
                                    ->description('Configure and reorder main menu navigation items.')
                                    ->schema([
                                        Repeater::make('navigation_items')
                                            ->label('Menu Links')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    TextInput::make('label')->label('Link Title')->required(),
                                                    TextInput::make('url')->label('Destination URL')->required(),
                                                    Toggle::make('is_highlight')->label('Highlight Button')->default(false),
                                                ]),
                                            ])
                                            ->columns(1)
                                            ->collapsible()
                                            ->reorderable()
                                            ->defaultItems(6),
                                    ]),
                            ]),

                        // TAB 3: FOOTER & LEGAL
                        Tab::make('Footer & Legal')
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Section::make('Footer Branding')
                                    ->schema([
                                        Textarea::make('footer_description')->label('Footer Agency Mission')->rows(2)->required(),
                                        TextInput::make('footer_subtext')->label('Studio Lineage Note')->required(),
                                    ]),

                                Section::make('Footer Navigation Columns')
                                    ->description('Multi-column footer layout (Col 1 is Brand, Cols 2–4 are link groups).')
                                    ->schema([
                                        Repeater::make('footer_columns')
                                            ->label('Footer Link Columns')
                                            ->schema([
                                                TextInput::make('title')->label('Column Heading')->required(),
                                                Repeater::make('links')
                                                    ->label('Column Links')
                                                    ->schema([
                                                        Grid::make(2)->schema([
                                                            TextInput::make('label')->label('Link Label')->required(),
                                                            TextInput::make('url')->label('Destination URL')->required(),
                                                        ]),
                                                    ])
                                                    ->collapsible()
                                                    ->defaultItems(4),
                                            ])
                                            ->collapsible()
                                            ->defaultItems(3),
                                    ]),

                                Section::make('Social Media Profiles')
                                    ->description('Official corporate handles.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('linkedin_url')->label('LinkedIn Profile URL')->url(),
                                            TextInput::make('instagram_url')->label('Instagram URL')->url(),
                                            TextInput::make('twitter_url')->label('Twitter / X URL')->url(),
                                            TextInput::make('youtube_url')->label('YouTube Channel URL')->url(),
                                            TextInput::make('github_url')->label('GitHub Organization URL')->url(),
                                        ]),
                                    ]),

                                Section::make('Copyright & Disclaimers')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('copyright_text')->label('Copyright Notice')->required(),
                                            TextInput::make('footer_bottom_note')->label('Bottom Trust Guarantee')->required(),
                                        ]),
                                    ]),
                            ]),

                        // TAB 4: BRANDING & APPEARANCE
                        Tab::make('Branding & Tokens')
                            ->icon('heroicon-o-paint-brush')
                            ->schema([
                                Section::make('Design Tokens & Color Palette')
                                    ->description('Synchronized with React design system and CSS variables.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            ColorPicker::make('primary_color')
                                                ->label('Primary Brand Accent')
                                                ->default('#d4ff00')
                                                ->helperText('Electric lime brand signature.'),
                                            ColorPicker::make('dark_color')
                                                ->label('Dark Mode Background / Base')
                                                ->default('#111714')
                                                ->helperText('Midnight charcoal background.'),
                                            ColorPicker::make('blue_accent')
                                                ->label('Vibrant Blue Accent Dot')
                                                ->default('#3155f4'),
                                        ]),
                                    ]),

                                Section::make('Typography & Component Geometry')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            Select::make('font_family')
                                                ->label('Primary Font Family')
                                                ->options([
                                                    'Space Grotesk' => 'Space Grotesk (Signature Tech / Growth Agency)',
                                                    'Inter' => 'Inter (Clean Global SaaS Standard)',
                                                    'Plus Jakarta Sans' => 'Plus Jakarta Sans (Modern Editorial)',
                                                ])
                                                ->default('Space Grotesk'),

                                            Select::make('button_radius')
                                                ->label('Global Button Corner Radius')
                                                ->options([
                                                    'rounded-xl' => 'Slight Curve (rounded-xl - Default)',
                                                    'rounded-full' => 'Pill Shape (rounded-full)',
                                                    'rounded-md' => 'Subtle Geometric (rounded-md)',
                                                    'rounded-none' => 'Sharp Modernist (rounded-none)',
                                                ])
                                                ->default('rounded-xl'),
                                        ]),
                                    ]),
                            ]),

                        // TAB 5: SECTION & TEMPLATE LIBRARY
                        Tab::make('Section Templates')
                            ->icon('heroicon-o-squares-plus')
                            ->schema([
                                Section::make('Reusable Section & Component Library')
                                    ->description('Global pre-designed modules ready for 1-click insertion across Pages, Services, and Blogs.')
                                    ->schema([
                                        Repeater::make('section_templates_list')
                                            ->label('Active Pre-Built Templates')
                                            ->statePath('section_templates_list')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    TextInput::make('name')->label('Template Name')->disabled(),
                                                    TextInput::make('category')->label('Category')->disabled(),
                                                    TextInput::make('block_type')->label('Block Type Schema')->disabled(),
                                                ]),
                                                Textarea::make('description')->label('Purpose & Design Notes')->rows(2)->disabled(),
                                            ])
                                            ->addable(false)
                                            ->deletable(false)
                                            ->reorderable(false)
                                            ->default(fn () => SectionTemplate::where('is_active', true)->get()->toArray()),
                                    ]),
                            ]),

                        // TAB 6: GLOBAL SEO
                        Tab::make('Global SEO')
                            ->icon('heroicon-o-globe-alt')
                            ->schema([
                                Section::make('Baseline Search Metadata')
                                    ->description('Fallback tags when a page does not specify dedicated meta.')
                                    ->schema([
                                        TextInput::make('default_meta_title')->label('Default Global Title (SERP)')->required(),
                                        Textarea::make('default_meta_description')->label('Default Meta Description')->rows(3)->required(),
                                        TextInput::make('default_share_image')->label('Default OpenGraph Social Image URL')->required(),
                                        Grid::make(3)->schema([
                                            TextInput::make('organization_name')->label('Schema Legal Entity')->required(),
                                            Select::make('organization_schema_type')
                                                ->options([
                                                    'Organization' => 'Organization (Standard)',
                                                    'MarketingAgency' => 'ProfessionalService > MarketingAgency',
                                                    'LocalBusiness' => 'LocalBusiness',
                                                ])
                                                ->default('Organization'),
                                            Select::make('robots_default')
                                                ->options([
                                                    'index, follow' => 'index, follow (Allow All Search Engines)',
                                                    'noindex, nofollow' => 'noindex, nofollow (Private / Staging Mode)',
                                                ])
                                                ->default('index, follow'),
                                        ]),
                                    ]),
                            ]),

                        // TAB 7: ANALYTICS & INTEGRATIONS
                        Tab::make('Analytics & Scripts')
                            ->icon('heroicon-o-chart-bar')
                            ->schema([
                                Section::make('Marketing Tag Management')
                                    ->description('Container and measurement identifiers passed securely to frontend.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('gtm_id')->label('Google Tag Manager (GTM ID)')->placeholder('GTM-XXXXXXX'),
                                            TextInput::make('ga4_id')->label('Google Analytics 4 (Measurement ID)')->placeholder('G-XXXXXXXXXX'),
                                            TextInput::make('meta_pixel_id')->label('Meta Pixel ID')->placeholder('1234567890'),
                                        ]),
                                    ]),

                                Section::make('Custom Embed Scripts (Admin Only)')
                                    ->description('Injected safely into document head and footer.')
                                    ->schema([
                                        Textarea::make('custom_head_scripts')
                                            ->label('Custom <head> Scripts')
                                            ->placeholder('<script>...</script>')
                                            ->rows(4),
                                        Textarea::make('custom_footer_scripts')
                                            ->label('Custom Before </body> Scripts')
                                            ->placeholder('<script>...</script>')
                                            ->rows(4),
                                    ]),
                            ]),
                    ])
                    ->persistTabInQueryString()
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save_top')
                ->label('Save All Settings')
                ->icon('heroicon-o-check')
                ->color('primary')
                ->action('save'),

            Action::make('revisions')
                ->label('Settings Rollback')
                ->icon('heroicon-o-arrow-path')
                ->color('gray')
                ->modalHeading('Settings Version History & Rollback')
                ->modalDescription('Every settings save creates an immutable version snapshot. Restore any prior state in 1 click.')
                ->modalContent(fn () => view('filament.widgets.settings-revisions-modal', [
                    'revisions' => Revision::where('revisable_type', Setting::class)->orderBy('id', 'desc')->limit(15)->get(),
                ])),

            Action::make('clear_cache')
                ->label('Flush Cache')
                ->icon('heroicon-o-bolt')
                ->color('warning')
                ->action(function () {
                    Cache::forget('public_settings');
                    Notification::make()->success()->title('Frontend Cache Flushed')->send();
                }),

            Action::make('preview_frontend')
                ->label('Preview Live Site')
                ->icon('heroicon-o-arrow-top-right-on-square')
                ->color('info')
                ->url('https://getintofeed.com', shouldOpenInNewTab: true),
        ];
    }

    public function save(): void
    {
        $state = $this->form->getState();

        // 1. Take safety snapshot revision before mutating
        Setting::createRevision();

        // 2. Map form fields to appropriate groups
        $groupMapping = [
            'general' => [
                'site_name', 'agency_name', 'tagline', 'site_url', 'logo_text', 'logo_url',
                'alt_logo_url', 'favicon_url', 'contact_phone', 'contact_whatsapp',
                'contact_email', 'contact_address', 'starter_pricing', 'growth_pricing',
            ],
            'header' => [
                'announcement_enabled', 'announcement_text', 'announcement_link',
                'announcement_link_label', 'header_cta_label', 'header_cta_url', 'navigation_items',
            ],
            'footer' => [
                'footer_description', 'footer_subtext', 'copyright_text',
                'footer_bottom_note', 'footer_columns',
            ],
            'social' => [
                'instagram_url', 'linkedin_url', 'twitter_url', 'youtube_url', 'github_url',
            ],
            'branding' => [
                'primary_color', 'dark_color', 'blue_accent', 'font_family', 'button_radius',
            ],
            'seo' => [
                'default_meta_title', 'default_meta_description', 'default_share_image',
                'organization_name', 'organization_schema_type', 'robots_default',
            ],
            'integrations' => [
                'gtm_id', 'ga4_id', 'meta_pixel_id', 'custom_head_scripts', 'custom_footer_scripts',
            ],
        ];

        foreach ($groupMapping as $group => $keys) {
            foreach ($keys as $key) {
                if (array_key_exists($key, $state)) {
                    $isPublic = ! in_array($key, ['custom_head_scripts', 'custom_footer_scripts']);
                    Setting::set($group, $key, $state[$key], $isPublic);
                }
            }
        }

        // Flush public cache
        Cache::forget('public_settings');

        // Audit Log
        AuditLog::log('UPDATE_SETTINGS', null, null, ['updated_by' => auth()->user()?->email ?: 'admin']);

        Notification::make()
            ->success()
            ->title('Website Settings Saved')
            ->body('All settings have been persisted to the database and synchronized with the frontend API.')
            ->send();
    }

    public function rollbackRevision(int $revisionId): void
    {
        $ok = Setting::rollbackToRevision($revisionId);
        if ($ok) {
            $this->mount();
            Notification::make()
                ->success()
                ->title('Settings Rolled Back')
                ->body("Successfully restored settings state from snapshot #{$revisionId}.")
                ->send();
        } else {
            Notification::make()
                ->danger()
                ->title('Rollback Failed')
                ->body('Unable to find snapshot payload.')
                ->send();
        }
    }
}
