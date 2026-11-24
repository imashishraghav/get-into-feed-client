@php
    $record = isset($getRecord) && is_callable($getRecord) ? $getRecord() : null;
    $resolver = function($key) use ($record) {
        if (isset($get) && is_callable($get)) {
            $v = $get($key);
            if ($v !== null && $v !== '') return $v;
        }
        if ($record) {
            if (str_starts_with($key, 'seo.')) {
                $sub = substr($key, 4);
                return $record->seo?->$sub;
            }
            return $record->$key ?? null;
        }
        return null;
    };

    $title = (string) ($resolver('seo.seo_title') ?: ($resolver('name') ?: ($resolver('title') ?: ($resolver('project_name') ?: 'GetIntoFeed | Creative Performance Studio'))));
    $desc = (string) ($resolver('seo.meta_description') ?: ($resolver('short_description') ?: ($resolver('hero_description') ?: 'Data-driven performance marketing, short-form video reels, and organic revenue pipeline scaling for ambitious enterprise brands.')));
    $slug = (string) ($resolver('slug') ?: 'services');

    $titleLen = mb_strlen($title);
    $descLen = mb_strlen($desc);

    // Title meter status
    $titleStatus = 'optimal';
    $titlePercent = min(100, round(($titleLen / 60) * 100));
    if ($titleLen === 0) {
        $titleStatus = 'empty';
    } elseif ($titleLen < 30) {
        $titleStatus = 'short';
    } elseif ($titleLen > 60) {
        $titleStatus = 'long';
    }

    // Desc meter status
    $descStatus = 'optimal';
    $descPercent = min(100, round(($descLen / 160) * 100));
    if ($descLen === 0) {
        $descStatus = 'empty';
    } elseif ($descLen < 80) {
        $descStatus = 'short';
    } elseif ($descLen > 160) {
        $descStatus = 'long';
    }
@endphp

<div x-data="{ mode: 'desktop' }" class="rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-xs mb-3 font-sans transition-colors">
    {{-- Header --}}
    <div class="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-3.5">
        <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <div>
                <span class="text-xs font-bold text-slate-900 tracking-wide">Google Search Snippet Preview</span>
                <span class="text-[11px] font-semibold text-slate-500 ml-1.5">• Live SERP Simulation</span>
            </div>
        </div>

        {{-- Segmented View Switcher (Desktop / Mobile) --}}
        <div class="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
                type="button"
                @click="mode = 'desktop'"
                :class="mode === 'desktop' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 font-medium'"
                class="px-3 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>Desktop</span>
            </button>
            <button
                type="button"
                @click="mode = 'mobile'"
                :class="mode === 'mobile' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 font-medium'"
                class="px-3 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                <span>Mobile</span>
            </button>
        </div>
    </div>

    {{-- Desktop View --}}
    <div x-show="mode === 'desktop'" class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5 transition-all">
        <div class="flex items-center justify-between text-xs pb-0.5">
            <div class="flex items-center gap-2 text-slate-600 truncate">
                <span class="w-5 h-5 rounded-md bg-[#0c101d] text-[#cfff04] flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">G</span>
                <span class="text-slate-900 font-semibold text-[13px]">GetIntoFeed</span>
                <span class="text-slate-400 text-xs">›</span>
                <span class="text-slate-500 font-mono text-[11px] truncate">https://getintofeed.com/{{ $slug }}</span>
            </div>
            <span class="text-slate-400 p-0.5" title="Google SERP Options">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
            </span>
        </div>

        <h4 class="text-[19px] font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1" style="font-family: Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
            {{ $title }}
        </h4>

        <p class="text-[13.5px] text-[#4d5156] leading-relaxed line-clamp-2" style="font-family: Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
            {{ $desc }}
        </p>
    </div>

    {{-- Mobile View --}}
    <div x-show="mode === 'mobile'" class="max-w-md mx-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 transition-all">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-[#0c101d] text-[#cfff04] flex items-center justify-center text-[11px] font-black shrink-0 shadow-xs">G</span>
                <div class="flex flex-col">
                    <span class="text-slate-900 font-bold text-xs leading-tight">GetIntoFeed</span>
                    <span class="text-slate-500 font-mono text-[10px] truncate">https://getintofeed.com/{{ $slug }}</span>
                </div>
            </div>
            <span class="text-slate-400 p-0.5">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
            </span>
        </div>

        <h4 class="text-[17px] font-normal text-[#1a0dab] leading-snug line-clamp-2" style="font-family: Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
            {{ $title }}
        </h4>

        <p class="text-[12.5px] text-[#4d5156] leading-relaxed line-clamp-3" style="font-family: Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
            {{ $desc }}
        </p>
    </div>

    {{-- Length Meters (Yoast / RankMath Style Dual Progress Bars) --}}
    <div class="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {{-- Title Length Meter --}}
        <div>
            <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-slate-600 font-medium">SEO Title Length</span>
                <div class="flex items-center gap-1.5">
                    <span class="font-bold font-mono text-slate-800">{{ $titleLen }} / 60</span>
                    @if($titleStatus === 'optimal')
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Optimal</span>
                    @elseif($titleStatus === 'short')
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Too Short</span>
                    @elseif($titleStatus === 'long')
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Too Long</span>
                    @else
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Empty</span>
                    @endif
                </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                    class="h-1.5 rounded-full transition-all duration-300 {{ $titleStatus === 'optimal' ? 'bg-emerald-500' : ($titleStatus === 'short' ? 'bg-amber-400' : 'bg-rose-500') }}"
                    style="width: {{ $titlePercent }}%"
                ></div>
            </div>
        </div>

        {{-- Meta Description Length Meter --}}
        <div>
            <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-slate-600 font-medium">Meta Description Length</span>
                <div class="flex items-center gap-1.5">
                    <span class="font-bold font-mono text-slate-800">{{ $descLen }} / 160</span>
                    @if($descStatus === 'optimal')
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Optimal</span>
                    @elseif($descStatus === 'short')
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Too Short</span>
                    @elseif($descStatus === 'long')
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Too Long</span>
                    @else
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Empty</span>
                    @endif
                </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                    class="h-1.5 rounded-full transition-all duration-300 {{ $descStatus === 'optimal' ? 'bg-emerald-500' : ($descStatus === 'short' ? 'bg-amber-400' : 'bg-rose-500') }}"
                    style="width: {{ $descPercent }}%"
                ></div>
            </div>
        </div>
    </div>
</div>
