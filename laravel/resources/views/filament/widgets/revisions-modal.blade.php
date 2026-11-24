<div class="space-y-2.5 p-2 text-xs font-sans">
    @if($revisions->isEmpty())
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
            No previous revisions recorded for this item. Revisions are created automatically whenever edits are saved.
        </div>
    @else
        <ul class="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white overflow-hidden">
            @foreach($revisions as $rev)
                <li class="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-slate-900">Revision #{{ $rev->version_number }}</span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                                {{ $rev->created_at->format('d M Y, H:i') }}
                            </span>
                        </div>
                        <p class="text-[11px] text-slate-500 mt-0.5">
                            Author: {{ $rev->user?->name ?: ($rev->user?->email ?: 'Ashish') }}
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] text-slate-500 font-medium">Snapshot Saved</span>
                        <button type="button" wire:click="restoreRevision({{ $rev->id }})" wire:loading.attr="disabled" class="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 transition-colors cursor-pointer">
                            Restore
                        </button>
                    </div>
                </li>
            @endforeach
        </ul>
    @endif
</div>
