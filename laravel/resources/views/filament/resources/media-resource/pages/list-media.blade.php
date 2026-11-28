<x-filament-panels::page
    @class([
        'fi-resource-list-records-page',
        'fi-resource-' . str_replace('/', '-', $this->getResource()::getSlug()),
        'gif-media-library-page',
    ])
>
    <style>
        .gif-media-library-page .gif-media-card {
            background: #ffffff;
            border: 1px solid #e2e6ec;
            border-radius: 16px;
            overflow: hidden;
        }
        .dark .gif-media-library-page .gif-media-card {
            background: #18181b;
            border-color: #27272a;
        }
        .gif-media-library-page .gif-media-workspace {
            display: flex;
            min-height: 520px;
        }
        .gif-media-library-page .gif-folders-panel {
            width: 224px;
            flex-shrink: 0;
            border-right: 1px solid #e2e6ec;
            padding: 16px 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .dark .gif-media-library-page .gif-folders-panel {
            border-right-color: #27272a;
        }
        .gif-media-library-page .gif-folder-btn {
            width: 100%;
            border-radius: 8px;
            padding: 8px 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            font-size: 13.5px;
            font-weight: 500;
            color: #0f172a;
            text-align: left;
            transition: background-color 0.15s, color 0.15s;
        }
        .dark .gif-media-library-page .gif-folder-btn {
            color: #f4f4f5;
        }
        .gif-media-library-page .gif-folder-btn:hover {
            background: #f4f6f9;
        }
        .dark .gif-media-library-page .gif-folder-btn:hover {
            background: #27272a;
        }
        .gif-media-library-page .gif-folder-btn.active {
            background: #eef3fe;
            color: #2250e8;
            font-weight: 600;
        }
        .gif-media-library-page .gif-folder-btn.nested {
            padding-left: 28px;
            font-size: 13px;
        }
        .gif-media-library-page .gif-media-main {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
        }
        .gif-media-library-page .gif-view-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 20px;
            border-bottom: 1px solid #e2e6ec;
            background: #f8fafc;
        }
        .dark .gif-media-library-page .gif-view-bar {
            background: #18181b;
            border-bottom-color: #27272a;
        }
        .gif-media-library-page .gif-mobile-folders {
            display: none;
        }
        .gif-media-library-page .gif-grid-wrap {
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
        }
        .gif-media-library-page .gif-grid-card {
            border: 1px solid #e2e6ec;
            border-radius: 12px;
            background: #ffffff;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: border-color 0.15s, background-color 0.15s;
        }
        .gif-media-library-page .gif-grid-card.selected {
            border-color: #2250e8;
            background: #eef3fe;
        }
        .gif-media-library-page .fi-ta-ctn {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
        }
        @media (max-width: 1100px) {
            .gif-media-library-page .gif-media-workspace {
                flex-direction: column;
            }
            .gif-media-library-page .gif-folders-panel {
                display: none;
            }
            .gif-media-library-page .gif-mobile-folders {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                border-bottom: 1px solid #e2e6ec;
                overflow-x: auto;
                scrollbar-width: none;
            }
            .gif-media-library-page .gif-mobile-folders::-webkit-scrollbar {
                display: none;
            }
            .gif-media-library-page .gif-grid-wrap {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                padding: 16px;
                gap: 12px;
            }
        }
    </style>

    <div
        class="flex flex-col gap-y-6"
        x-data="{}"
        x-on:copy-to-clipboard.window="navigator.clipboard && navigator.clipboard.writeText($event.detail.text)"
    >
        <x-filament-panels::resources.tabs />

        {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_BEFORE, scopes: $this->getRenderHookScopes()) }}

        <div class="gif-media-card">
            <div class="gif-media-workspace">
                {{-- Desktop Nested Folders Sidebar --}}
                <aside class="gif-folders-panel" aria-label="Media folders">
                    <div class="flex items-center justify-between px-2 pb-2">
                        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Folders</span>
                    </div>

                    <button
                        type="button"
                        wire:click="selectFolder(null)"
                        @class(['gif-folder-btn', 'active' => $this->activeFolderId === null])
                    >
                        <span class="flex items-center gap-2 truncate">
                            <x-heroicon-o-folder class="w-4 h-4 shrink-0" />
                            <span class="truncate">All media</span>
                        </span>
                        <span class="text-xs text-slate-500">{{ $this->totalMediaCount }}</span>
                    </button>

                    @foreach ($this->folderTree as $folder)
                        <button
                            type="button"
                            wire:click="selectFolder({{ $folder->id }})"
                            @class(['gif-folder-btn', 'active' => $this->activeFolderId === $folder->id])
                        >
                            <span class="flex items-center gap-2 truncate">
                                <x-heroicon-o-folder class="w-4 h-4 shrink-0" />
                                <span class="truncate">{{ $folder->name }}</span>
                            </span>
                            <span class="text-xs text-slate-500">{{ $folder->media_count }}</span>
                        </button>

                        @foreach ($folder->children as $child)
                            <button
                                type="button"
                                wire:click="selectFolder({{ $child->id }})"
                                @class(['gif-folder-btn nested', 'active' => $this->activeFolderId === $child->id])
                            >
                                <span class="flex items-center gap-2 truncate">
                                    <x-heroicon-o-folder class="w-3.5 h-3.5 shrink-0" />
                                    <span class="truncate">{{ $child->name }}</span>
                                </span>
                                <span class="text-xs text-slate-500">{{ $child->media_count }}</span>
                            </button>
                        @endforeach
                    @endforeach
                </aside>

                <div class="gif-media-main">
                    {{-- Mobile Folder Chips --}}
                    <div class="gif-mobile-folders" aria-label="Media folders">
                        <button
                            type="button"
                            wire:click="selectFolder(null)"
                            @class([
                                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border',
                                'bg-blue-50 text-blue-700 border-blue-600' => $this->activeFolderId === null,
                                'bg-white text-slate-700 border-slate-200' => $this->activeFolderId !== null,
                            ])
                        >
                            All media ({{ $this->totalMediaCount }})
                        </button>

                        @foreach ($this->folderTree as $folder)
                            <button
                                type="button"
                                wire:click="selectFolder({{ $folder->id }})"
                                @class([
                                    'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border',
                                    'bg-blue-50 text-blue-700 border-blue-600' => $this->activeFolderId === $folder->id,
                                    'bg-white text-slate-700 border-slate-200' => $this->activeFolderId !== $folder->id,
                                ])
                            >
                                {{ $folder->name }} ({{ $folder->media_count }})
                            </button>
                        @endforeach
                    </div>

                    {{-- View Mode Toggle Bar --}}
                    <div class="gif-view-bar">
                        <div class="text-xs font-medium text-slate-500">
                            @if ($this->activeFolderId)
                                Filtering by folder
                                <button type="button" wire:click="selectFolder(null)" class="ml-2 text-blue-600 hover:underline font-semibold">Show all</button>
                            @else
                                Showing all media assets
                            @endif
                        </div>

                        <div class="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5" role="group" aria-label="View mode">
                            <button
                                type="button"
                                wire:click="setViewMode('list')"
                                aria-label="List view"
                                aria-pressed="{{ $this->viewMode === 'list' ? 'true' : 'false' }}"
                                @class([
                                    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition',
                                    'bg-blue-50 text-blue-700' => $this->viewMode === 'list',
                                    'text-slate-600 hover:text-slate-900' => $this->viewMode !== 'list',
                                ])
                            >
                                <x-heroicon-o-bars-3 class="w-4 h-4" />
                                List
                            </button>
                            <button
                                type="button"
                                wire:click="setViewMode('grid')"
                                aria-label="Grid view"
                                aria-pressed="{{ $this->viewMode === 'grid' ? 'true' : 'false' }}"
                                @class([
                                    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition',
                                    'bg-blue-50 text-blue-700' => $this->viewMode === 'grid',
                                    'text-slate-600 hover:text-slate-900' => $this->viewMode !== 'grid',
                                ])
                            >
                                <x-heroicon-o-squares-2x2 class="w-4 h-4" />
                                Grid
                            </button>
                        </div>
                    </div>

                    @if ($this->viewMode === 'grid')
                        @php
                            $records = $this->getTableRecords();
                        @endphp

                        @if ($records->isEmpty())
                            <div class="py-16 px-6 text-center">
                                <x-heroicon-o-photo class="w-10 h-10 mx-auto text-slate-400 mb-3" />
                                <h3 class="text-base font-semibold text-slate-900">No media assets found</h3>
                                <p class="text-sm text-slate-500 mt-1">Upload images for your website pages and blog articles.</p>
                            </div>
                        @else
                            <div class="gif-grid-wrap">
                                @foreach ($records as $record)
                                    @php
                                        $isSelected = in_array((string) $record->id, array_map('strval', $this->selectedTableRecords ?? []), true);
                                        $ext = strtoupper(pathinfo($record->file_name, PATHINFO_EXTENSION) ?: 'FILE');
                                    @endphp
                                    <article @class(['gif-grid-card group', 'selected' => $isSelected])>
                                        <div class="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                                            <img
                                                src="{{ $record->url }}"
                                                alt="{{ $record->alt_text ?: $record->title ?: $record->file_name }}"
                                                class="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            <label class="absolute top-2.5 left-2.5 w-7 h-7 rounded-md bg-white/95 border border-slate-200 flex items-center justify-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value="{{ $record->id }}"
                                                    wire:model.live="selectedTableRecords"
                                                    aria-label="Select {{ $record->file_name }}"
                                                    class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </label>
                                            <div class="absolute inset-0 bg-slate-950/85 text-white p-3 pl-11 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                                <div class="text-xs font-semibold truncate">{{ $record->title ?: $record->file_name }}</div>
                                                <div class="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                                                    {{ $record->alt_text ?: 'Alt text missing' }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="p-3 flex items-center justify-between gap-2">
                                            <div class="min-w-0">
                                                <div class="text-sm font-semibold text-slate-900 truncate" title="{{ $record->file_name }}">
                                                    {{ $record->file_name }}
                                                </div>
                                                <div class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                    <span>{{ $ext }} &middot; {{ $record->formatted_size }}</span>
                                                    @if (blank($record->alt_text))
                                                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">Alt missing</span>
                                                    @endif
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    wire:click="copyUrlToClipboard({{ \Illuminate\Support\Js::from($record->url) }}, {{ \Illuminate\Support\Js::from($record->file_name) }})"
                                                    aria-label="Copy URL for {{ $record->file_name }}"
                                                    class="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                                    title="Copy URL"
                                                >
                                                    <x-heroicon-o-clipboard-document class="w-4 h-4" />
                                                </button>
                                                <a
                                                    href="{{ \App\Filament\Resources\MediaResource::getUrl('edit', ['record' => $record]) }}"
                                                    aria-label="Edit details for {{ $record->file_name }}"
                                                    class="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                                    title="Edit details"
                                                >
                                                    <x-heroicon-o-pencil-square class="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                @endforeach
                            </div>

                            <div class="px-5 py-3 border-t border-slate-200">
                                {{ $records->links() }}
                            </div>
                        @endif
                    @else
                        {{ $this->table }}
                    @endif
                </div>
            </div>
        </div>

        {{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_AFTER, scopes: $this->getRenderHookScopes()) }}
    </div>
</x-filament-panels::page>
