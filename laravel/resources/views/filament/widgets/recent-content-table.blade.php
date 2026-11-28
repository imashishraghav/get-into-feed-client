<x-filament-widgets::widget>
    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
            <div class="flex items-center gap-2">
                <span class="inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                <h2 class="text-sm font-extrabold text-slate-950 uppercase tracking-wide">Live Services, Work & Articles Overview</h2>
            </div>
            <span class="text-xs font-semibold text-slate-400">Recently updated records</span>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead>
                    <tr class="text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold bg-slate-50/70">
                        <th class="py-2.5 px-3 font-semibold">Title</th>
                        <th class="py-2.5 px-3 font-semibold">Type</th>
                        <th class="py-2.5 px-3 font-semibold">Status</th>
                        <th class="py-2.5 px-3 font-semibold">Updated</th>
                        <th class="py-2.5 px-3 font-semibold">Author</th>
                        <th class="py-2.5 px-3 text-right font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($this->getRecentItems() as $item)
                        <tr class="hover:bg-slate-50/80 transition-colors">
                            <td class="py-2.5 px-3 font-medium text-slate-900 max-w-xs truncate">
                                {{ $item['title'] }}
                            </td>
                            <td class="py-2.5 px-3">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border {{ $item['type_badge'] }}">
                                    {{ $item['type'] }}
                                </span>
                            </td>
                            <td class="py-2.5 px-3">
                                @if($item['status'] === 'published')
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Published
                                    </span>
                                @elseif($item['status'] === 'review')
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                        In Review
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                        Draft
                                    </span>
                                @endif
                            </td>
                            <td class="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                                {{ $item['updated'] }}
                            </td>
                            <td class="py-2.5 px-3 text-slate-600">
                                {{ $item['author'] }}
                            </td>
                            <td class="py-2.5 px-3 text-right">
                                <a href="{{ $item['edit_url'] }}" class="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-2">
                                    Edit
                                </a>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</x-filament-widgets::widget>
