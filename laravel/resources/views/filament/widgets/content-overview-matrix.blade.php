<x-filament-widgets::widget>
    <div class="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 p-5 shadow-sm dark:shadow-xl backdrop-blur-sm">
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-white/10">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-blue-600 dark:bg-[#cfff04]"></div>
                <h2 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Content Overview Matrix</h2>
            </div>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Status Distribution</span>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead>
                    <tr class="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/5 uppercase tracking-wider font-semibold">
                        <th class="pb-2.5 font-bold text-slate-700 dark:text-slate-300">Content Type</th>
                        <th class="pb-2.5 text-center font-bold text-slate-700 dark:text-slate-200">Total</th>
                        <th class="pb-2.5 text-center text-emerald-600 dark:text-emerald-400 font-bold">Published</th>
                        <th class="pb-2.5 text-center text-amber-600 dark:text-amber-400 font-bold">In Review</th>
                        <th class="pb-2.5 text-center text-slate-500 dark:text-slate-400 font-bold">Draft</th>
                        <th class="pb-2.5 text-center text-blue-600 dark:text-blue-400 font-bold">Scheduled</th>
                        <th class="pb-2.5 text-right font-bold text-slate-700 dark:text-slate-300">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                    @foreach($this->getContentMatrix() as $item)
                        <tr class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                            <td class="py-2.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                <span class="text-blue-600 dark:text-[#cfff04] font-bold">›</span>
                                <span>{{ $item['name'] }}</span>
                            </td>
                            <td class="py-2.5 text-center font-bold text-slate-800 dark:text-slate-100 font-mono">{{ $item['total'] }}</td>
                            <td class="py-2.5 text-center">
                                <span class="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-mono">
                                    {{ $item['published'] }}
                                </span>
                            </td>
                            <td class="py-2.5 text-center">
                                <span class="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold {{ $item['review'] > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 font-bold' : 'text-slate-400 dark:text-slate-500' }} font-mono">
                                    {{ $item['review'] }}
                                </span>
                            </td>
                            <td class="py-2.5 text-center text-slate-500 dark:text-slate-400 font-mono">{{ $item['draft'] }}</td>
                            <td class="py-2.5 text-center text-slate-500 dark:text-slate-400 font-mono">{{ $item['scheduled'] }}</td>
                            <td class="py-2.5 text-right">
                                <a href="{{ $item['route'] }}" class="text-[11px] font-semibold text-blue-600 dark:text-[#cfff04] hover:underline">
                                    Manage →
                                </a>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</x-filament-widgets::widget>
