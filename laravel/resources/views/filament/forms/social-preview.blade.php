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

    $ogTitle = $resolver('seo.og_title') ?: ($resolver('seo.seo_title') ?: ($resolver('name') ?: ($resolver('title') ?: 'GetIntoFeed Growth Studio')));
    $ogDesc = $resolver('seo.og_description') ?: ($resolver('seo.meta_description') ?: 'Scale inbound revenue with algorithmic performance media.');
    $ogMedia = $resolver('seo.og_media_id') ?: $resolver('hero_media_id');

    $twTitle = $resolver('seo.twitter_title') ?: $ogTitle;
    $twDesc = $resolver('seo.twitter_description') ?: $ogDesc;
    $twMedia = $resolver('seo.twitter_media_id') ?: $ogMedia;
@endphp

<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
    <!-- Facebook / LinkedIn OpenGraph Card -->
    <div class="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
        <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Facebook / LinkedIn OG Preview</span>
        <div class="rounded-md overflow-hidden border border-slate-200 bg-slate-50">
            <div class="h-28 bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                @if($ogMedia)
                    <span class="text-slate-700 font-medium">✓ Media Attached (#{{ $ogMedia }})</span>
                @else
                    <span>1200 × 630 Social Image</span>
                @endif
            </div>
            <div class="p-2.5 space-y-1">
                <span class="text-[10px] text-slate-400 uppercase font-mono block">GETINTOFEED.COM</span>
                <p class="font-bold text-slate-900 text-xs line-clamp-1">
                    {{ $ogTitle }}
                </p>
                <p class="text-[11px] text-slate-600 line-clamp-2">
                    {{ $ogDesc }}
                </p>
            </div>
        </div>
    </div>

    <!-- Twitter / X Summary Card -->
    <div class="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
        <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Twitter / X Card Preview</span>
        <div class="rounded-md overflow-hidden border border-slate-200 bg-slate-50">
            <div class="h-28 bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                @if($twMedia)
                    <span class="text-slate-700 font-medium">✓ Twitter Media Attached (#{{ $twMedia }})</span>
                @else
                    <span>Twitter Summary Card</span>
                @endif
            </div>
            <div class="p-2.5 space-y-1">
                <span class="text-[10px] text-slate-400 uppercase font-mono block">GETINTOFEED.COM</span>
                <p class="font-bold text-slate-900 text-xs line-clamp-1">
                    {{ $twTitle }}
                </p>
                <p class="text-[11px] text-slate-600 line-clamp-2">
                    {{ $twDesc }}
                </p>
            </div>
        </div>
    </div>
</div>
