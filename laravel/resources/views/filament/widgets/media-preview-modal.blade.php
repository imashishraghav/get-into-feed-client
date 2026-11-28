<div class="space-y-4 p-2 text-xs font-sans">
    <div class="w-full flex items-center justify-center p-4 bg-slate-900/5 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden" style="min-height: 220px; max-height: 400px;">
        @if(str_starts_with($media->mime_type ?? '', 'image/') || str_ends_with($media->file_path, '.jpg') || str_ends_with($media->file_path, '.png') || str_ends_with($media->file_path, '.webp'))
            <img src="{{ $media->url }}" alt="{{ $media->alt_text }}" class="max-h-[360px] max-w-full rounded-lg object-contain shadow-sm" />
        @else
            <div class="flex flex-col items-center justify-center text-slate-500 py-8">
                <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <span class="font-mono text-xs">{{ $media->file_name }}</span>
            </div>
        @endif
    </div>

    <!-- Technical Meta Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div class="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">Dimensions</div>
            <div class="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">{{ $media->dimensions ?: 'Scalable Vector / Doc' }}</div>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div class="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">File Size</div>
            <div class="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">{{ $media->formatted_size }}</div>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div class="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">MIME Format</div>
            <div class="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">{{ $media->mime_type }}</div>
        </div>
        <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div class="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">Optimization</div>
            <div class="font-mono font-semibold {{ $media->webp_path ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-800 dark:text-amber-300' }} mt-0.5">
                {{ $media->webp_path ? "WebP (-{$media->savings_percentage}%)" : 'Standard' }}
            </div>
        </div>
    </div>

    <!-- Metadata Details -->
    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
        <div class="flex items-start justify-between">
            <span class="font-semibold text-slate-600 dark:text-slate-300">Asset Title:</span>
            <span class="font-medium text-slate-900 dark:text-white text-right">{{ $media->title ?: '—' }}</span>
        </div>
        <div class="flex items-start justify-between">
            <span class="font-semibold text-slate-600 dark:text-slate-300">SEO Alt Text:</span>
            <span class="font-medium {{ $media->alt_text ? 'text-slate-900 dark:text-white' : 'text-amber-700 font-bold' }} text-right">
                {{ $media->alt_text ?: '⚠️ Missing Alt Text' }}
            </span>
        </div>
        @if($media->file_hash)
        <div class="flex items-start justify-between text-[11px]">
            <span class="font-semibold text-slate-600 dark:text-slate-300">SHA-256 Hash:</span>
            <span class="font-mono text-slate-600 dark:text-slate-300 truncate max-w-[280px]">{{ $media->file_hash }}</span>
        </div>
        @endif
    </div>

    <!-- Quick Embed Snippets -->
    <div class="space-y-1.5">
        <label class="font-bold text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wide">Public CDN / Storage URL</label>
        <div class="flex items-center gap-2">
            <input type="text" readonly value="{{ $media->url }}" class="w-full text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 select-all" />
        </div>
    </div>
</div>
