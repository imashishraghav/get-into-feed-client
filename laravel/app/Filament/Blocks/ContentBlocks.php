<?php

namespace App\Filament\Blocks;

use App\Models\Faq;
use App\Models\Media;
use App\Models\Testimonial;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

class ContentBlocks
{
    public static function get(): array
    {
        return [
            // 1. Hero Block
            Block::make('hero')
                ->label('Hero Section')
                ->icon('heroicon-o-sparkles')
                ->schema([
                    TextInput::make('headline')->required()->placeholder('e.g. Scaling Ambitious Brands'),
                    TextInput::make('highlight_substring')->placeholder('e.g. Faster with Video Reels'),
                    Textarea::make('subtitle')->rows(3)->placeholder('Hero description narrative...'),
                    Select::make('media_id')
                        ->label('Background Media (Media Library)')
                        ->options(fn () => Media::pluck('file_name', 'id'))
                        ->searchable()
                        ->preload(),
                    TextInput::make('primary_cta_label')->default('Start a Project'),
                    TextInput::make('primary_cta_url')->default('/contact'),
                    TextInput::make('secondary_cta_label')->default('View Case Studies'),
                    TextInput::make('secondary_cta_url')->default('/case-studies'),
                ]),

            // 2. Rich Text Block
            Block::make('rich_text')
                ->label('Rich Text')
                ->icon('heroicon-o-document-text')
                ->schema([
                    RichEditor::make('content')
                        ->toolbarButtons([
                            'bold', 'italic', 'strike', 'link', 'heading',
                            'bulletList', 'orderedList', 'blockquote', 'codeBlock',
                        ])
                        ->required(),
                ]),

            // 3. Heading Block
            Block::make('heading')
                ->label('Heading')
                ->icon('heroicon-o-hashtag')
                ->schema([
                    Select::make('level')
                        ->options(['h2' => 'Heading 2 (H2)', 'h3' => 'Heading 3 (H3)', 'h4' => 'Heading 4 (H4)'])
                        ->default('h2'),
                    TextInput::make('text')->required(),
                    Select::make('accent')
                        ->options(['default' => 'Default Dark (#111827)', 'lime' => 'Neon Lime Accent (#cfff04)'])
                        ->default('default'),
                ]),

            // 4. Paragraph Block
            Block::make('paragraph')
                ->label('Paragraph')
                ->icon('heroicon-o-bars-3-bottom-left')
                ->schema([
                    Textarea::make('text')->rows(4)->required(),
                    Select::make('size')
                        ->options(['normal' => 'Standard (18px)', 'large' => 'Lead (20px)', 'small' => 'Muted (14px)'])
                        ->default('normal'),
                ]),

            // 5. Image Block (Media Library picker ONLY)
            Block::make('image')
                ->label('Image')
                ->icon('heroicon-o-photo')
                ->schema([
                    Select::make('media_id')
                        ->label('Select from Media Library')
                        ->options(fn () => Media::pluck('file_name', 'id'))
                        ->searchable()
                        ->preload()
                        ->required(),
                    TextInput::make('caption')->placeholder('Optional caption below image'),
                    TextInput::make('alt_override')->placeholder('Optional alt text override'),
                    Toggle::make('full_width')->label('Full Width Display')->default(false),
                    Toggle::make('centered')->label('Centered Alignment')->default(true),
                ]),

            // 6. Gallery Block
            Block::make('gallery')
                ->label('Gallery')
                ->icon('heroicon-o-rectangle-stack')
                ->schema([
                    Select::make('media_ids')
                        ->label('Select Images from Media Library')
                        ->multiple()
                        ->options(fn () => Media::pluck('file_name', 'id'))
                        ->searchable()
                        ->preload()
                        ->required(),
                    Select::make('layout')
                        ->options([
                            'grid-2' => '2-Column Grid',
                            'grid-3' => '3-Column Grid',
                            'carousel' => 'Interactive Carousel',
                        ])
                        ->default('grid-3'),
                ]),

            // 7. Video Block
            Block::make('video')
                ->label('Video')
                ->icon('heroicon-o-video-camera')
                ->schema([
                    Select::make('media_id')
                        ->label('Select Video from Media Library')
                        ->options(fn () => Media::where('mime_type', 'like', 'video/%')->pluck('file_name', 'id'))
                        ->searchable(),
                    TextInput::make('hosted_url')->placeholder('Or external hosted MP4 / Stream URL'),
                    Select::make('aspect_ratio')
                        ->options(['16:9' => 'Horizontal 16:9 (Commercial)', '9:16' => 'Vertical 9:16 (Reels/Shorts)'])
                        ->default('16:9'),
                    Toggle::make('autoplay_muted')->label('Autoplay Muted')->default(false),
                ]),

            // 8. Button / CTA Block
            Block::make('button_cta')
                ->label('Button / CTA')
                ->icon('heroicon-o-cursor-arrow-rays')
                ->schema([
                    TextInput::make('label')->required()->default('Schedule Strategy Session'),
                    TextInput::make('url')->required()->default('/contact'),
                    Select::make('style')
                        ->options([
                            'lime' => 'Brand Neon Lime Button',
                            'dark' => 'Solid Dark Button',
                            'outline' => 'Minimal Outline Button',
                        ])
                        ->default('lime'),
                    Select::make('target')
                        ->options(['_self' => 'Same Window', '_blank' => 'New Tab'])
                        ->default('_self'),
                ]),

            // 9. Quote / Blockquote Block
            Block::make('quote')
                ->label('Quote / Blockquote')
                ->icon('heroicon-o-chat-bubble-bottom-center-text')
                ->schema([
                    Textarea::make('quote')->rows(3)->required(),
                    TextInput::make('author')->required(),
                    TextInput::make('role')->placeholder('e.g. Founder & CEO'),
                    TextInput::make('company')->placeholder('e.g. UrbanThreads Co.'),
                    Select::make('avatar_media_id')
                        ->label('Author Avatar (Media Library)')
                        ->options(fn () => Media::pluck('file_name', 'id'))
                        ->searchable(),
                ]),

            // 10. Statistics / Metrics Block
            Block::make('statistics')
                ->label('Statistics / Metrics')
                ->icon('heroicon-o-chart-bar')
                ->schema([
                    Repeater::make('metrics')
                        ->schema([
                            TextInput::make('value')->required()->placeholder('e.g. +380%'),
                            TextInput::make('label')->required()->placeholder('e.g. Qualified Pipeline'),
                            Toggle::make('highlight')->label('Neon Highlight')->default(true),
                        ])
                        ->minItems(1)
                        ->maxItems(4)
                        ->columns(3),
                ]),

            // 11. Features Block
            Block::make('features')
                ->label('Features Grid')
                ->icon('heroicon-o-squares-plus')
                ->schema([
                    Repeater::make('items')
                        ->schema([
                            TextInput::make('title')->required(),
                            Textarea::make('description')->rows(2)->required(),
                            TextInput::make('icon_name')->default('CheckCircle'),
                        ])
                        ->columns(3),
                ]),

            // 12. Cards Block
            Block::make('cards')
                ->label('Content Cards')
                ->icon('heroicon-o-squares-2x2')
                ->schema([
                    Repeater::make('cards')
                        ->schema([
                            TextInput::make('title')->required(),
                            Textarea::make('description')->rows(2),
                            Select::make('media_id')
                                ->label('Card Image (Media Library)')
                                ->options(fn () => Media::pluck('file_name', 'id'))
                                ->searchable(),
                            TextInput::make('link_url')->placeholder('/services/...'),
                        ])
                        ->columns(2),
                ]),

            // 13. FAQ Accordion Block
            Block::make('faq_accordion')
                ->label('FAQ Accordion')
                ->icon('heroicon-o-question-mark-circle')
                ->schema([
                    Select::make('selected_faq_ids')
                        ->label('Select Existing FAQs')
                        ->multiple()
                        ->options(fn () => Faq::pluck('question', 'id'))
                        ->searchable(),
                ]),

            // 14. Testimonials Block
            Block::make('testimonials_block')
                ->label('Testimonials Section')
                ->icon('heroicon-o-star')
                ->schema([
                    Select::make('selected_testimonial_ids')
                        ->label('Select Verified Testimonials')
                        ->multiple()
                        ->options(fn () => Testimonial::pluck('client_name', 'id'))
                        ->searchable(),
                ]),

            // 15. Columns Block (2 or 3 Columns)
            Block::make('columns')
                ->label('Columns (2 or 3 Col)')
                ->icon('heroicon-o-view-columns')
                ->schema([
                    Select::make('columns_count')
                        ->options(['2' => '2 Columns (50% / 50%)', '3' => '3 Columns (33% / 33% / 33%)'])
                        ->default('2'),
                    RichEditor::make('column_1')->label('Column 1 Content'),
                    RichEditor::make('column_2')->label('Column 2 Content'),
                    RichEditor::make('column_3')->label('Column 3 Content (if 3 cols)'),
                ]),

            // 16. Custom Section Anchor (Audited Frontend Component Anchors)
            Block::make('custom_section')
                ->label('Custom Frontend Anchor Section')
                ->icon('heroicon-o-cube')
                ->schema([
                    Select::make('anchor_key')
                        ->label('Component Anchor')
                        ->options([
                            'audit_tool_calculator' => 'Free Website Audit Calculator Form',
                            'pricing_sprints_table' => 'Transparent Growth Sprints Table',
                            'creative_video_showcase' => '9:16 Video Reels Player Grid',
                            'leadership_team_grid' => 'Executive Leadership Squad Grid',
                            'client_logos_ticker' => 'Client Brand Logos Marquee',
                        ])
                        ->required(),
                ]),

            // 17. Deliverables / Features Checklist Block
            Block::make('deliverables')
                ->label('Deliverables / Checklist')
                ->icon('heroicon-o-check-badge')
                ->schema([
                    TextInput::make('heading')->default('What Is Included In Every Engagement')->required(),
                    Textarea::make('subheading')->rows(2)->placeholder('Scope clarity before invoices...'),
                    Repeater::make('items')
                        ->schema([
                            TextInput::make('title')->required()->placeholder('e.g. Weekly KPI dashboard & transparent reporting'),
                            Textarea::make('details')->rows(2)->placeholder('Optional expanded deliverable scope details'),
                        ])
                        ->minItems(1)
                        ->defaultItems(3)
                        ->collapsible()
                        ->cloneable(),
                ]),

            // 18. Process Roadmap Steps Block
            Block::make('process_steps')
                ->label('Process Steps Roadmap')
                ->icon('heroicon-o-arrow-path-rounded-square')
                ->schema([
                    TextInput::make('heading')->default('How We Execute')->required(),
                    Textarea::make('subheading')->rows(2)->placeholder('Sprint methodology and milestones'),
                    Repeater::make('steps')
                        ->schema([
                            TextInput::make('step')->default('01')->required(),
                            TextInput::make('title')->required()->placeholder('e.g. Audit & Strategy Discovery'),
                            Textarea::make('description')->rows(2)->required(),
                        ])
                        ->columns(3)
                        ->minItems(2)
                        ->defaultItems(4)
                        ->collapsible(),
                ]),

            // 19. Problem & Solution Comparison Block
            Block::make('problem_solution')
                ->label('Problem & Solution Grid')
                ->icon('heroicon-o-scale')
                ->schema([
                    TextInput::make('problem_tag')->default('THE REAL ROADBLOCK'),
                    TextInput::make('problem_heading')->required()->placeholder('e.g. Paying for clicks but enquiries remain low?'),
                    Textarea::make('problem_summary')->rows(3)->required(),
                    TextInput::make('solution_heading')->default('How We Deal With The Problem')->required(),
                    Textarea::make('solution_content')->rows(4)->required(),
                ]),

            // 20. Custom HTML / Raw Embed Block
            Block::make('custom_html')
                ->label('Custom Raw HTML / Embed')
                ->icon('heroicon-o-code-bracket')
                ->schema([
                    Textarea::make('html')
                        ->label('HTML / Embed Code')
                        ->rows(6)
                        ->required()
                        ->extraInputAttributes(['class' => 'font-mono text-xs'])
                        ->helperText('Custom embed, iframe, or valid HTML markup. Scripts restricted to super-administrators.'),
                ]),
        ];
    }
}
