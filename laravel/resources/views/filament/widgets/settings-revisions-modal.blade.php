<div class="space-y-3 p-2 text-xs font-sans">
    @if(empty($revisions) || $revisions->isEmpty())
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-center">
            No previous setting revisions recorded yet. An automatic snapshot is captured every time settings are saved.
        </div>
    @else
        <p class="text-slate-600 dark:text-slate-400 text-xs">
            Select any historical snapshot to revert all general, branding, header, footer, SEO, and integration settings:
        </p>
        <div class="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            @foreach($revisions as $rev)
                <div class="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-primary-100 text-primary-800 dark:bg-primary-900/60 dark:text-primary-300">
                                Snapshot v{{ $rev->version_number }}
                            </span>
                            <span class="text-slate-900 dark:text-white font-medium text-xs">
                                {{ count($rev->payload ?? []) }} settings keys
                            </span>
                        </div>
                        <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <span>Saved: {{ $rev->created_at->format('M d, Y · H:i:s') }}</span>
                            <span>•</span>
                            <span>By: {{ $rev->user?->name ?: $rev->user?->email ?: 'System Admin' }}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        wire:click="rollbackRevision({{ $rev->id }})"
                        wire:confirm="Revert all website settings to Snapshot v{{ $rev->version_number }}? A recovery snapshot of current settings will be taken automatically."
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all cursor-pointer border-none"
                    >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                        Rollback
                    </button>
                </div>
            @endforeach
        </div>
    @endif
</div>
