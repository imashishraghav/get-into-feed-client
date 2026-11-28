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
    $plainContent = trim(strip_tags($content));
    $wordCount = str_word_count($plainContent);
    $slug = (string)($resolver('slug') ?? '');

    // Real-time AI & SEO Scoring Algorithm (0-100)
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

    // 6. Direct Answer Definition or Schema Depth
    $first150Words = implode(' ', array_slice(explode(' ', $plainContent), 0, 150));
    $hasDirectAnswer = (bool) preg_match('/\b(is|are|refers to|defined as|means|helps|allows|works by)\b/i', $first150Words);
    $contentOptimal = ($wordCount >= 300 && $hasDirectAnswer);
    if ($contentOptimal) {
        $score += 15;
        $checksPassed++;
    } elseif ($wordCount >= 200) {
        $score += 8;
    }

    // State styling
    if ($score >= 80) {
        $scoreBorder = 'border-emerald-200 dark:border-emerald-800/60';
        $scoreBg = 'bg-emerald-50 dark:bg-emerald-950/40';
        $scoreBadgeBg = 'bg-emerald-500';
        $scoreTextColor = 'text-emerald-700 dark:text-emerald-300';
        $scoreLabel = 'AI Citations Ready';
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

{{-- Executive AI & Search Engine Status Strip (GetIntoFeed Studio) --}}
<div class="mb-3.5 px-3.5 py-2.5 rounded-xl bg-slate-50/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2 text-xs">
    <!-- Left: Score + Keyphrase + Lengths -->
    <div class="flex items-center flex-wrap gap-2.5">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold {{ $scoreBg }} {{ $scoreTextColor }} border {{ $scoreBorder }} shadow-2xs">
            <span class="w-2 h-2 rounded-full {{ $scoreBadgeBg }} {{ $score >= 80 ? 'animate-pulse' : '' }}"></span>
            <span>AI Readiness: <strong>{{ $score }}/100</strong> • {{ $scoreLabel }}</span>
        </span>

        @if(!empty($focusKeyword))
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-2xs">
                <span class="text-slate-400">Keyphrase:</span>
                <span class="text-blue-600 dark:text-blue-400 font-bold">"{{ $focusKeyword }}"</span>
                <span class="text-[10px] {{ $kwInTitle ? 'text-emerald-600 font-semibold' : 'text-amber-500' }}">({{ $kwInTitle ? '✓ In Title' : 'Missing in Title' }})</span>
            </span>
        @else
            <span class="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200/80 dark:border-amber-900">
                ⚡ Set Primary Keyphrase for LLM Citations
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
        <span class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900 shadow-2xs">
            🤖 LLM Parseable
        </span>
        <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900 shadow-2xs">
            Schema: {{ $schemaType }}
        </span>
        <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900 shadow-2xs">
            Direct Answer Ready
        </span>
    </div>
</div>
