@php
    $record = isset($getRecord) && is_callable($getRecord) ? $getRecord() : null;
    $content = null;
    if (isset($get) && is_callable($get)) {
        $content = $get('content');
    }
    if (!$content && $record) {
        $content = $record->content;
    }
    $text = strip_tags($content ?? '');
    $words = str_word_count($text);
    $chars = strlen($text);
    $readingMinutes = max(1, (int) ceil($words / 200));
@endphp

<div class="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-[#0c101d] border border-white/10 text-xs font-mono">
    <div class="flex items-center gap-1.5">
        <span class="text-slate-400">Words:</span>
        <span class="font-bold text-white">{{ number_format($words) }}</span>
    </div>
    <span class="text-slate-600">•</span>
    <div class="flex items-center gap-1.5">
        <span class="text-slate-400">Characters:</span>
        <span class="font-bold text-white">{{ number_format($chars) }}</span>
    </div>
    <span class="text-slate-600">•</span>
    <div class="flex items-center gap-1.5">
        <span class="text-slate-400">Estimated Reading Time:</span>
        <span class="font-bold text-[#cfff04]">{{ $readingMinutes }} min read</span>
    </div>
</div>
