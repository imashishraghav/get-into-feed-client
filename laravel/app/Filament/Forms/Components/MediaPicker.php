<?php

namespace App\Filament\Forms\Components;

use App\Models\Media;
use App\Models\MediaFolder;
use App\Services\MediaService;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Illuminate\Support\HtmlString;

class MediaPicker
{
    public static function make(string $name, string $label = 'Featured Media Asset'): Group
    {
        $placeholderName = str_replace('.', '_', $name).'_preview';

        return Group::make([
            Select::make($name)
                ->label($label)
                ->live()
                ->options(function () {
                    return Media::orderBy('id', 'desc')->get()->mapWithKeys(function ($media) {
                        $dim = $media->dimensions ? " ({$media->dimensions})" : '';
                        $folder = $media->folder ? " [{$media->folder->name}]" : '';

                        return [$media->id => "#{$media->id} • {$media->file_name}{$dim}{$folder}"];
                    })->toArray();
                })
                ->searchable()
                ->preload()
                ->createOptionForm([
                    FileUpload::make('file_path')
                        ->label('Upload Media')
                        ->disk('public')
                        ->directory('media')
                        ->visibility('public')
                        ->image()
                        ->required(),
                    TextInput::make('file_name')->required()->label('File Name'),
                    TextInput::make('alt_text')->label('SEO Alt Text')->placeholder('Crucial for Google Image ranking'),
                    Select::make('folder_id')
                        ->label('Folder')
                        ->options(fn () => MediaFolder::treeOptions()),
                ])
                ->createOptionUsing(function (array $data) {
                    $meta = MediaService::extractMetadata('public', $data['file_path']);
                    $media = Media::create([
                        'folder_id' => $data['folder_id'] ?? null,
                        'file_name' => $data['file_name'] ?? basename($data['file_path']),
                        'file_path' => $data['file_path'],
                        'disk' => 'public',
                        'file_size' => $meta['file_size'] ?? 0,
                        'mime_type' => $meta['mime_type'] ?? 'image/jpeg',
                        'width' => $meta['width'] ?? null,
                        'height' => $meta['height'] ?? null,
                        'file_hash' => $meta['file_hash'] ?? null,
                        'alt_text' => $data['alt_text'] ?? null,
                        'title' => ucwords(str_replace(['-', '_'], ' ', pathinfo($data['file_name'], PATHINFO_FILENAME))),
                        'uploaded_by_user_id' => auth()->id(),
                    ]);

                    if (in_array($media->mime_type, ['image/jpeg', 'image/png'])) {
                        MediaService::convertToWebp($media);
                    }

                    return $media->id;
                })
                ->helperText('Select from centralized Media Library or upload a new asset.'),

            Placeholder::make($placeholderName)
                ->label('')
                ->content(function ($get, $record) use ($name) {
                    $mediaId = $get($name);
                    if ($mediaId === null && $record) {
                        $mediaId = data_get($record, $name);
                    }

                    if (! $mediaId) {
                        return new HtmlString('
                            <div class="mt-2 flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-zinc-900/40 text-center">
                                <svg class="w-7 h-7 text-slate-300 dark:text-slate-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">No image selected</span>
                                <span class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Choose an asset above to display preview</span>
                            </div>
                        ');
                    }

                    $media = Media::find($mediaId);
                    if (! $media) {
                        return new HtmlString('
                            <div class="mt-2 p-2.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                                Media asset #'.e($mediaId).' not found.
                            </div>
                        ');
                    }

                    $url = e($media->url);
                    $fileName = e($media->file_name);
                    $alt = e($media->alt_text ?: $media->title ?: $media->file_name);
                    $dims = $media->dimensions ? e($media->dimensions) : '';
                    $size = $media->formatted_size ? e($media->formatted_size) : '';

                    return new HtmlString('
                        <div class="mt-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
                            <div class="relative group bg-slate-100 dark:bg-zinc-950 flex items-center justify-center p-2 min-h-[140px] max-h-[220px]">
                                <img src="'.$url.'" alt="'.$alt.'" class="w-full h-auto max-h-[200px] object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.01]" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML=\'<div class=\\\'p-4 text-xs text-rose-500 text-center\\\'>Image preview failed to load</div>\';" />
                                <a href="'.$url.'" target="_blank" class="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-black/75 hover:bg-black text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100">
                                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                    </svg>
                                    View Full
                                </a>
                            </div>
                            <div class="p-2.5 bg-slate-50/80 dark:bg-zinc-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                <div class="flex flex-col min-w-0">
                                    <span class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate" title="'.$fileName.'">'.$fileName.'</span>
                                    <span class="text-[10px] text-slate-500 dark:text-slate-400">'.($dims ? $dims.' • ' : '').$size.'</span>
                                </div>
                                <span class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Active Image
                                </span>
                            </div>
                        </div>
                    ');
                }),
        ]);
    }
}
