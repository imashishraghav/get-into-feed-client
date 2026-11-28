<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;

class DualEditor
{
    public static function make(
        string $contentField = 'content',
        string $blocksField = 'content_blocks',
        string $modeField = 'editor_mode',
        string $title = 'Article Content'
    ): Section {
        return Section::make($title)
            ->icon('heroicon-o-document-text')
            ->collapsible(false)
            ->schema([
                Hidden::make($modeField)->default('classic'),
                Hidden::make($blocksField)->dehydrateStateUsing(fn ($state) => $state ?? []),

                RichEditor::make($contentField)
                    ->label('')
                    ->placeholder('Start writing your content here... Use headings, bullet lists, formatting, links, blockquotes, and media attachments.')
                    ->toolbarButtons([
                        'attachFiles',
                        'blockquote',
                        'bold',
                        'bulletList',
                        'codeBlock',
                        'h2',
                        'h3',
                        'italic',
                        'link',
                        'orderedList',
                        'redo',
                        'strike',
                        'underline',
                        'undo',
                    ])
                    ->fileAttachmentsDisk('public')
                    ->fileAttachmentsDirectory('editor-uploads')
                    ->columnSpanFull()
                    ->extraInputAttributes([
                        'class' => 'gif-modern-editor',
                        'style' => 'min-height: 480px;',
                    ]),
            ]);
    }
}
