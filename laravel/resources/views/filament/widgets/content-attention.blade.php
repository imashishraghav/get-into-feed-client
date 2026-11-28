<x-filament-widgets::widget>
    <div class="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 p-5 shadow-sm dark:shadow-xl backdrop-blur-sm h-full flex flex-col">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/10">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                <h2 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Action Required</h2>
            </div>
            <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-400 font-bold">
                {{ count($this->getAttentionItems()) }} Items
            </span>
        </div>

        <div class="space-y-2.5 flex-1 overflow-y-auto max-h-80 pr-1">
            @foreach($this->getAttentionItems() as $item)
                <div class="p-3 rounded-lg border transition-all 
                    @if($item['type'] === 'critical') bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-500/10 dark:border-rose-500/25 dark:text-rose-300
                    @elseif($item['type'] === 'warning') bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/25 dark:text-amber-300
                    @elseif($item['type'] === 'info') bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/25 dark:text-blue-300
                    @else bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-300
                    @endif">
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <h3 class="text-xs font-bold text-slate-900 dark:text-white leading-snug">{{ $item['title'] }}</h3>
                            <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{{ $item['desc'] }}</p>
                        </div>
                        <a href="{{ $item['link'] }}" class="shrink-0 inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white transition-colors">
                            {{ $item['action'] }} →
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</x-filament-widgets::widget>
