@php
    $record = isset($getRecord) && is_callable($getRecord) ? $getRecord() : (isset($record) ? $record : null);
    $comp = $component ?? null;
    $resolver = function($key) use ($record, $comp) {
        if (isset($get) && is_callable($get)) {
            $v = $get($key);
            if ($v !== null && $v !== '') return $v;
        }
        if ($comp && method_exists($comp, 'getContainer')) {
            try {
                $raw = $comp->getContainer()->getRawState();
                if (isset($raw[$key]) && $raw[$key] !== '') return $raw[$key];
            } catch (\Throwable $e) {}
        }
        if ($record) {
            if (str_starts_with($key, 'seo.')) {
                $sub = substr($key, 4);
                return $record->seo?->$sub ?? null;
            }
            return $record->$key ?? null;
        }
        return null;
    };

    $focusKeyword = trim((string)($resolver('seo.focus_keyword') ?? ''));
    $seoTitle = trim((string)($resolver('seo.seo_title') ?: ($resolver('name') ?: ($resolver('title') ?: ($resolver('project_name') ?: '')))));
    $metaDesc = trim((string)($resolver('seo.meta_description') ?: ($resolver('short_description') ?: ($resolver('hero_description') ?: ''))));
    $schemaType = $resolver('seo.schema_type') ?: 'Article';
    $content = (string)($resolver('content') ?: ($resolver('body') ?: ($resolver('overview') ?: '')));
    $wordCount = str_word_count(strip_tags($content));
    $slug = (string)($resolver('slug') ?? '');

    // Real-time SEO Scoring Algorithm (0-100)
    $score = 0;
    $checksPassed = 0;
    $totalChecks = 6;

    // 1. Focus Keyphrase Defined
    if (!empty($focusKeyword)) {
        $score += 20;
        $checksPassed++;
    }

    // 2. Focus Keyphrase in SEO Title
    $kwInTitle = (!empty($focusKeyword) && !empty($seoTitle) && stripos($seoTitle, $focusKeyword) !== false);
    if ($kwInTitle) {
        $score += 20;
        $checksPassed++;
    }

    // 3. SEO Title Length (Optimal 40-60)
    $titleLen = mb_strlen($seoTitle);
    $titleOptimal = ($titleLen >= 40 && $titleLen <= 60);
    if ($titleOptimal) {
        $score += 15;
        $checksPassed++;
    } elseif ($titleLen > 0 && $titleLen < 40) {
        $score += 8;
    }

    // 4. Focus Keyphrase in Meta Description
    $kwInDesc = (!empty($focusKeyword) && !empty($metaDesc) && stripos($metaDesc, $focusKeyword) !== false);
    if ($kwInDesc) {
        $score += 15;
        $checksPassed++;
    }

    // 5. Meta Description Length (Optimal 120-160)
    $descLen = mb_strlen($metaDesc);
    $descOptimal = ($descLen >= 120 && $descLen <= 160);
    if ($descOptimal) {
        $score += 15;
        $checksPassed++;
    } elseif ($descLen > 0 && $descLen < 120) {
        $score += 8;
    }

    // 6. Content Depth or Schema
    $contentOptimal = ($wordCount >= 300 || !empty($schemaType));
    if ($contentOptimal) {
        $score += 15;
        $checksPassed++;
    }

    // State styling
    if ($score >= 80) {
        $scoreBorder = 'border-emerald-200 dark:border-emerald-800/60';
        $scoreBg = 'bg-emerald-50 dark:bg-emerald-950/40';
        $scoreBadgeBg = 'bg-emerald-500';
        $scoreTextColor = 'text-emerald-700 dark:text-emerald-300';
        $scoreLabel = 'Optimal';
    } elseif ($score >= 50) {
        $scoreBorder = 'border-amber-200 dark:border-amber-800/60';
        $scoreBg = 'bg-amber-50 dark:bg-amber-950/40';
        $scoreBadgeBg = 'bg-amber-500';
        $scoreTextColor = 'text-amber-700 dark:text-amber-300';
        $scoreLabel = 'Needs Work';
    } else {
        $scoreBorder = 'border-rose-200 dark:border-rose-800/60';
        $scoreBg = 'bg-rose-50 dark:bg-rose-950/40';
        $scoreBadgeBg = 'bg-rose-500';
        $scoreTextColor = 'text-rose-700 dark:text-rose-300';
        $scoreLabel = 'Needs Setup';
    }
@endphp

{{-- Compact, Sleek 1-Row Executive SEO Quick Status Strip --}}
<div class="mb-3 px-3 py-2 rounded-lg bg-slate-50/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
    <!-- Left: Score + Keyphrase + Lengths -->
    <div class="flex items-center flex-wrap gap-2.5">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold {{ $scoreBg }} {{ $scoreTextColor }} border {{ $scoreBorder }}">
            <span class="w-2 h-2 rounded-full {{ $scoreBadgeBg }} {{ $score >= 80 ? 'animate-pulse' : '' }}"></span>
            {{ $score }}/100 • {{ $scoreLabel }}
        </span>

        @if(!empty($focusKeyword))
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-800 px-2.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
                <span class="text-slate-400">Keyphrase:</span>
                <span class="text-[#a4286a] dark:text-pink-400 font-bold">"{{ $focusKeyword }}"</span>
                <span class="text-[10px] {{ $kwInTitle ? 'text-emerald-600 font-semibold' : 'text-amber-500' }}">({{ $kwInTitle ? '✓ In Title' : 'Missing in Title' }})</span>
            </span>
        @else
            <span class="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/80 dark:border-amber-900">
                ⚠️ No focus keyphrase set
            </span>
        @endif

        <span class="hidden md:inline text-slate-300 dark:text-slate-700">•</span>

        <!-- SERP Length meters -->
        <span class="hidden md:inline-flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Title: <strong class="{{ $titleOptimal ? 'text-emerald-600' : 'text-amber-600' }}">{{ $titleLen }}/60</strong></span>
            <span>•</span>
            <span>Desc: <strong class="{{ $descOptimal ? 'text-emerald-600' : ($descLen > 160 ? 'text-rose-600' : 'text-amber-600') }}">{{ $descLen }}/160</strong></span>
        </span>
    </div>

    <!-- Right: Quick Feature Chips -->
    <div class="flex items-center gap-1.5 text-[10px] font-semibold">
        <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
            Schema: {{ $schemaType }}
        </span>
        <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900">
            Index, Follow
        </span>
        <span class="hidden lg:inline-flex px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-900">
            AI Search Ready
        </span>
    </div>
</div>
