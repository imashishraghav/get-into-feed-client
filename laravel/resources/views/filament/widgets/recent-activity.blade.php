<x-filament-widgets::widget>
    <div class="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wide">Recent Activity</h2>
            <span class="text-xs text-slate-400">Audit timeline</span>
        </div>

        <div class="divide-y divide-slate-100">
            @forelse($this->getActivities() as $act)
                <div class="py-2.5 flex items-start justify-between gap-2 text-xs">
                    <div class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                        <div>
                            <div class="font-medium text-slate-900">{{ $act['action'] }}</div>
                            <div class="text-slate-500 text-[11px]">by {{ $act['user'] }}</div>
                        </div>
                    </div>
                    <span class="text-slate-400 text-[11px] whitespace-nowrap font-mono">{{ $act['time'] }}</span>
                </div>
            @empty
                <div class="py-4 text-center text-xs text-slate-400">
                    No recent activity recorded yet.
                </div>
            @endforelse
        </div>
    </div>
</x-filament-widgets::widget>
