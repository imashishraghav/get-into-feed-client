@php
    $record = isset($getRecord) && is_callable($getRecord) ? $getRecord() : null;
    $resolver = function($key) use ($record) {
        if (isset($get) && is_callable($get)) {
            $v = $get($key);
            if ($v !== null && $v !== '') return $v;
        }
        if ($record) {
            return $record->$key ?? null;
        }
        return null;
    };

    $content = (string) ($resolver('content') ?: ($resolver('overview') ?: ($resolver('hero_description') ?: '')));
    $plainContent = trim(strip_tags($content));
    $wordCount = str_word_count($plainContent);
    $sentences = preg_split('/[.!?]+/', $plainContent, -1, PREG_SPLIT_NO_EMPTY);
    $sentenceCount = max(1, count($sentences));

    $readProblems = [];
    $readImprovements = [];
    $readGood = [];
    $llmChecks = [];

    // 1. Word Count & Depth for LLM context window
    if ($wordCount < 150) {
        $readProblems[] = [
            'title' => 'Thin content volume',
            'message' => 'Your text contains only ' . $wordCount . ' words. LLM answer engines prefer 400+ words to extract contextual nuance.'
        ];
    } elseif ($wordCount >= 600) {
        $readGood[] = [
            'title' => 'Authoritative content depth',
            'message' => 'Comprehensive ' . $wordCount . ' words. Excellent semantic coverage for high-authority AI citations.'
        ];
    } else {
        $readGood[] = [
            'title' => 'Adequate content volume',
            'message' => 'Your text contains ' . $wordCount . ' words. Sufficient for core topic synthesis.'
        ];
    }

    // 2. Flesch Reading Ease & Grade Level Calculation
    // Syllable estimation heuristic
    $totalSyllables = 0;
    $wordsArray = str_word_count(strtolower($plainContent), 1);
    foreach ($wordsArray as $w) {
        $len = strlen($w);
        if ($len <= 3) {
            $totalSyllables += 1;
        } else {
            $syl = preg_match_all('/[aeiouy]{1,2}/', $w);
            if (str_ends_with($w, 'e')) $syl = max(1, $syl - 1);
            $totalSyllables += max(1, $syl);
        }
    }

    $asl = $wordCount / $sentenceCount; // average sentence length
    $asw = $totalSyllables / max(1, $wordCount); // average syllables per word

    // Flesch Reading Ease Formula
    $flesch = round(206.835 - (1.015 * $asl) - (84.6 * $asw));
    $flesch = max(0, min(100, $flesch));

    if ($flesch >= 70) {
        $fleschGrade = 'Grade 7-8 (Fairly Easy)';
        $fleschStatus = 'Optimal for AI & Humans';
    } elseif ($flesch >= 60) {
        $fleschGrade = 'Grade 8-9 (Standard Plain English)';
        $fleschStatus = 'Optimal for Universal Synthesis';
    } elseif ($flesch >= 50) {
        $fleschGrade = 'Grade 10-12 (Fairly Difficult)';
        $fleschStatus = 'Slightly Complex';
    } else {
        $fleschGrade = 'College Level (Difficult)';
        $fleschStatus = 'Dense / Academic';
    }

    // 3. Passive Voice & Active Attribution
    $passiveMatches = preg_match_all('/\b(is|are|was|were|been|be|being)\s+([a-z]+ed|[a-z]+en)\b/i', $plainContent);
    $passiveRatio = round(($passiveMatches / $sentenceCount) * 100, 1);
    $activeRatio = max(0, 100 - $passiveRatio);

    if ($passiveRatio > 15) {
        $readImprovements[] = [
            'title' => 'Passive voice frequency',
            'message' => $passiveRatio . '% of sentences use passive voice. LLMs generate 3x clearer citations when active voice is used.'
        ];
    } else {
        $readGood[] = [
            'title' => 'Strong active voice',
            'message' => $activeRatio . '% active voice. Clear entity-to-action relationships make AI parsing effortless.'
        ];
    }

    // 4. LLM Direct Answer & Definition Extraction Test (First 150 Words)
    $first150Words = implode(' ', array_slice(explode(' ', $plainContent), 0, 150));
    $hasDirectAnswer = (bool) preg_match('/\b(is|are|refers to|defined as|means|helps|allows|enables|works by)\b/i', $first150Words);
    if ($hasDirectAnswer && $wordCount >= 100) {
        $llmChecks[] = [
            'pass' => true,
            'title' => 'Direct Answer in Intro',
            'desc' => 'Your introductory 150 words contain a direct definition/answer statement. Ideal for Google AI Overview & Perplexity summary extracts.'
        ];
    } else {
        $llmChecks[] = [
            'pass' => false,
            'title' => 'Direct Answer Missing in Intro',
            'desc' => 'Perplexity & AI Overviews prioritize articles that define the core query in the first 2 sentences. Add a direct definition statement early.'
        ];
    }

    // 5. Heading Depth & Chunking (H2/H3 for LLM Embeddings)
    $h2Count = preg_match_all('/<h2[^>]*>/i', $content);
    $h3Count = preg_match_all('/<h3[^>]*>/i', $content);
    $totalHeadings = $h2Count + $h3Count;

    if ($totalHeadings >= 3) {
        $llmChecks[] = [
            'pass' => true,
            'title' => 'Semantic Heading Hierarchy (' . $totalHeadings . ' Headings)',
            'desc' => 'Content is divided into structured H2/H3 thematic chunks. Allows vector databases and RAG systems to index subtopics cleanly.'
        ];
    } else {
        $llmChecks[] = [
            'pass' => false,
            'title' => 'Need more H2/H3 subheadings',
            'desc' => 'Use H2 and H3 subheadings every 200–300 words so AI search engines can chunk and cite specific sections.'
        ];
    }

    // 6. Structural Lists & Tables for AI Skimmability
    $hasLists = (bool) preg_match('/<(ul|ol|table|blockquote)\b/i', $content);
    if ($hasLists) {
        $llmChecks[] = [
            'pass' => true,
            'title' => 'Structured Skimmable Elements',
            'desc' => 'Bullet points or tables detected. AI models synthesize bulleted takeaways with 40% higher direct snippet inclusion.'
        ];
    } else {
        $llmChecks[] = [
            'pass' => false,
            'title' => 'No bullet lists or tables',
            'desc' => 'Add 1-2 bulleted summary cards (Key Takeaways) to increase answer engine extraction.'
        ];
    }

    // 7. Sentence Length Distribution
    $longSentences = 0;
    foreach ($sentences as $s) {
        if (str_word_count(trim($s)) > 22) $longSentences++;
    }
    $longSentenceRatio = round(($longSentences / max(1, count($sentences))) * 100, 1);
    if ($longSentenceRatio > 20) {
        $readImprovements[] = [
            'title' => 'Sentence length',
            'message' => $longSentenceRatio . '% of sentences exceed 22 words. Break them down for faster human and LLM token processing.'
        ];
    } else {
        $readGood[] = [
            'title' => 'Concise sentence rhythm',
            'message' => 'Average sentence length is ' . round($asl, 1) . ' words. Ideal for high reader retention.'
        ];
    }

    // Composite LLM Citability Score (0-100)
    $citabilityScore = 40;
    if ($hasDirectAnswer) $citabilityScore += 20;
    if ($flesch >= 60) $citabilityScore += 15;
    if ($activeRatio >= 85) $citabilityScore += 10;
    if ($totalHeadings >= 3) $citabilityScore += 10;
    if ($hasLists) $citabilityScore += 5;
    $citabilityScore = min(100, max(20, $citabilityScore));
@endphp

<div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 font-sans text-xs shadow-xs mb-3 space-y-4 transition-colors">

    <!-- Top LLM Readability & AI Citability Dashboard -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- 1. AI Citability Score -->
        <div class="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 to-blue-50/40 dark:from-indigo-950/40 dark:to-blue-950/20">
            <div class="flex items-center justify-between mb-1.5">
                <span class="text-[11px] font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">🤖 AI Citability</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold {{ $citabilityScore >= 80 ? 'bg-emerald-500 text-white' : ($citabilityScore >= 60 ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white') }}">
                    {{ $citabilityScore }}/100
                </span>
            </div>
            <div class="text-[13px] font-extrabold text-slate-900 dark:text-white">
                {{ $citabilityScore >= 80 ? 'High Citation Ready' : ($citabilityScore >= 60 ? 'Moderate Readiness' : 'Needs Optimization') }}
            </div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Perplexity & AI Overview extractability</div>
        </div>

        <!-- 2. Flesch Reading Ease -->
        <div class="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30">
            <div class="flex items-center justify-between mb-1.5">
                <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">📖 Reading Ease</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                    {{ $flesch }}/100
                </span>
            </div>
            <div class="text-[13px] font-extrabold text-slate-900 dark:text-white">{{ $fleschGrade }}</div>
            <div class="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">{{ $fleschStatus }}</div>
        </div>

        <!-- 3. Direct Answer in Intro -->
        <div class="p-3.5 rounded-xl border {{ $hasDirectAnswer ? 'border-blue-100 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30' : 'border-amber-100 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30' }}">
            <div class="flex items-center justify-between mb-1.5">
                <span class="text-[11px] font-bold uppercase tracking-wider {{ $hasDirectAnswer ? 'text-blue-900 dark:text-blue-300' : 'text-amber-900 dark:text-amber-300' }}">⚡ Answer Extract</span>
                <span class="text-xs">{{ $hasDirectAnswer ? '✓' : '⚠' }}</span>
            </div>
            <div class="text-[13px] font-extrabold text-slate-900 dark:text-white">
                {{ $hasDirectAnswer ? 'Direct Definition Found' : 'Add Direct Definition' }}
            </div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1">First 150-word answer readiness</div>
        </div>

        <!-- 4. Active Voice Ratio -->
        <div class="p-3.5 rounded-xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30">
            <div class="flex items-center justify-between mb-1.5">
                <span class="text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">🎯 Active Voice</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                    {{ $activeRatio }}%
                </span>
            </div>
            <div class="text-[13px] font-extrabold text-slate-900 dark:text-white">
                {{ $passiveRatio <= 10 ? 'High Entity Authority' : 'Reduce Passive Voice' }}
            </div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Avg sentence: {{ round($asl, 1) }} words</div>
        </div>
    </div>

    <!-- AI & LLM Citability Engine Checklist -->
    <div class="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-slate-50/80 dark:bg-zinc-800/50 p-3.5 space-y-2.5">
        <div class="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-700/80 pb-2">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span class="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Generative Engine Optimization (GEO) & LLM Audit</span>
            </div>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">Targeting ChatGPT, Perplexity, Claude & Google AI</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            @foreach($llmChecks as $chk)
                <div class="p-2.5 rounded-lg border {{ $chk['pass'] ? 'border-emerald-200/70 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-amber-200/70 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20' }}">
                    <div class="flex items-center gap-1.5 mb-1 font-bold {{ $chk['pass'] ? 'text-emerald-900 dark:text-emerald-300' : 'text-amber-900 dark:text-amber-300' }}">
                        <span>{{ $chk['pass'] ? '✓' : '⚡' }}</span>
                        <span>{{ $chk['title'] }}</span>
                    </div>
                    <div class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{{ $chk['desc'] }}</div>
                </div>
            @endforeach
        </div>
    </div>

    <!-- Editorial Readability Details -->
    <div class="space-y-2.5">
        <!-- Problems Accordion -->
        @if(count($readProblems) > 0)
            <div x-data="{ open: true }" class="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 overflow-hidden">
                <button type="button" @click="open = !open" class="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-rose-900 dark:text-rose-300 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 transition-colors">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                        <span>Critical Issues ({{ count($readProblems) }})</span>
                    </div>
                    <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 text-rose-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div x-show="open" class="px-3.5 pb-3.5 space-y-2 border-t border-rose-100 dark:border-rose-900/40 pt-2.5">
                    @foreach($readProblems as $item)
                        <div class="flex items-start gap-2.5 text-xs">
                            <span class="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                            <span class="text-slate-700 dark:text-slate-300 leading-relaxed">
                                <strong class="font-bold text-rose-950 dark:text-rose-200">{{ $item['title'] }}:</strong>
                                {{ $item['message'] }}
                            </span>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        <!-- Improvements Accordion -->
        @if(count($readImprovements) > 0)
            <div x-data="{ open: true }" class="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 overflow-hidden">
                <button type="button" @click="open = !open" class="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-amber-900 dark:text-amber-300 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 transition-colors">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>Recommended Improvements ({{ count($readImprovements) }})</span>
                    </div>
                    <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 text-amber-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div x-show="open" class="px-3.5 pb-3.5 space-y-2 border-t border-amber-100 dark:border-amber-900/40 pt-2.5">
                    @foreach($readImprovements as $item)
                        <div class="flex items-start gap-2.5 text-xs">
                            <span class="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                            <span class="text-slate-700 dark:text-slate-300 leading-relaxed">
                                <strong class="font-bold text-amber-950 dark:text-amber-200">{{ $item['title'] }}:</strong>
                                {{ $item['message'] }}
                            </span>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        <!-- Good Results Accordion -->
        @if(count($readGood) > 0)
            <div x-data="{ open: false }" class="rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 overflow-hidden">
                <button type="button" @click="open = !open" class="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-emerald-900 dark:text-emerald-300 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-colors">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span>Passed Readability Checks ({{ count($readGood) }})</span>
                    </div>
                    <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 text-emerald-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div x-show="open" class="px-3.5 pb-3.5 space-y-2 border-t border-emerald-100 dark:border-emerald-900/40 pt-2.5">
                    @foreach($readGood as $item)
                        <div class="flex items-start gap-2.5 text-xs">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                            <span class="text-slate-700 dark:text-slate-300 leading-relaxed">
                                <strong class="font-bold text-emerald-950 dark:text-emerald-200">{{ $item['title'] }}:</strong>
                                {{ $item['message'] }}
                            </span>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif
    </div>
</div>
