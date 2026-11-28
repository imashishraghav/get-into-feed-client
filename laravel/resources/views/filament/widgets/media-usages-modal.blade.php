<div class="space-y-2 p-2 text-xs font-sans">
    @if(empty($usages))
        <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
            ✓ This media asset is currently unreferenced and safe to modify or replace.
        </div>
    @else
        <p class="text-slate-600 text-xs mb-2">This asset is actively linked by the following published or draft items:</p>
        <ul class="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white overflow-hidden">
            @foreach($usages as $usage)
                <li class="p-2.5 flex items-center gap-2 text-slate-800">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span class="font-medium">{{ $usage }}</span>
                </li>
            @endforeach
        </ul>
    @endif
</div>
