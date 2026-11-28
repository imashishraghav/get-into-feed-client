<x-filament-widgets::widget>
    <div class="rounded-xl border border-white/10 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm h-full flex flex-col">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-[#cfff04]"></div>
                <h2 class="text-sm font-bold text-white uppercase tracking-wider">Live Activity Feed</h2>
            </div>
            <span class="text-[11px] text-slate-400 font-mono">Real-time</span>
        </div>

        <div class="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
            @foreach($this->getActivities() as $act)
                <div class="flex items-start gap-3 text-xs">
                    <div class="w-1.5 h-1.5 rounded-full bg-[#cfff04] mt-1.5 shrink-0"></div>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-slate-200 truncate">{{ $act['title'] }}</p>
                        <div class="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                            <span>{{ $act['user'] }}</span>
                            <span>•</span>
                            <span>{{ $act['time'] }}</span>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</x-filament-widgets::widget>
