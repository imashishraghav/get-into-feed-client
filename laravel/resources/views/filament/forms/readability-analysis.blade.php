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
    $plainContent = strip_tags($content);
    $wordCount = str_word_count($plainContent);

    $readProblems = [];
    $readImprovements = [];
    $readGood = [];

    // 1. Not Enough Content
    if ($wordCount < 100) {
        $readProblems[] = [
            'title' => 'Not enough content',
            'message' => 'Please add some content to enable a good analysis (minimum 100 words recommended).'
        ];
    } else {
        $readGood[] = [
            'title' => 'Content volume',
            'message' => 'Your text contains ' . $wordCount . ' words. Sufficient for deep editorial analysis.'
        ];
    }

    // 2. Word Complexity
    if ($wordCount < 50) {
        $readProblems[] = [
            'title' => 'Word complexity',
            'message' => 'Is your vocabulary suited for a larger audience? Add more content to measure word complexity.'
        ];
    } else {
        $wordsArray = str_word_count($plainContent, 1);
        $complexWords = 0;
        foreach ($wordsArray as $w) {
            if (strlen($w) >= 11) $complexWords++;
        }
        $ratio = round(($complexWords / max(1, count($wordsArray))) * 100, 1);
        if ($ratio > 10) {
            $readImprovements[] = [
                'title' => 'Word complexity',
                'message' => $ratio . '% of the words are complex (10+ characters). Try using simpler vocabulary for a wider audience.'
            ];
        } else {
            $readGood[] = [
                'title' => 'Word complexity',
                'message' => 'Your vocabulary is well suited for a large audience. Great job!'
            ];
        }
    }

    // 3. Passive Voice
    $passiveMatches = preg_match_all('/\b(is|are|was|were|been|be|being)\s+([a-z]+ed|[a-z]+en)\b/i', $plainContent);
    $sentenceCount = max(1, preg_match_all('/[.!?]+/', $plainContent));
    $passiveRatio = round(($passiveMatches / $sentenceCount) * 100, 1);
    if ($passiveRatio > 15) {
        $readImprovements[] = [
            'title' => 'Passive voice',
            'message' => $passiveRatio . '% of the sentences contain passive voice. Try using more active voice.'
        ];
    } else {
        $readGood[] = [
            'title' => 'Passive voice',
            'message' => 'You are not using too much passive voice (' . $passiveRatio . '%). That\'s great!'
        ];
    }

    // 4. Consecutive Sentences
    $sentences = preg_split('/[.!?]+/', $plainContent, -1, PREG_SPLIT_NO_EMPTY);
    $consecutiveCount = 0;
    $prevStarter = '';
    foreach ($sentences as $s) {
        $trimmed = trim($s);
        if (empty($trimmed)) continue;
        $firstWord = strtolower(explode(' ', $trimmed)[0] ?? '');
        if ($firstWord === $prevStarter && strlen($firstWord) > 2) {
            $consecutiveCount++;
        }
        $prevStarter = $firstWord;
    }
    if ($consecutiveCount >= 3) {
        $readImprovements[] = [
            'title' => 'Consecutive sentences',
            'message' => 'The text contains ' . $consecutiveCount . ' instances where consecutive sentences start with the same word. Vary your sentence beginnings!'
        ];
    } else {
        $readGood[] = [
            'title' => 'Consecutive sentences',
            'message' => 'There are no repetitive sentence beginnings. That\'s great!'
        ];
    }

    // 5. Subheading Distribution
    $subheadingCount = preg_match_all('/<h[2-4][^>]*>/i', $content);
    if ($subheadingCount === 0) {
        if ($wordCount > 300) {
            $readImprovements[] = [
                'title' => 'Subheading distribution',
                'message' => 'Your text is longer than 300 words and contains no subheadings. Break up your text with H2 and H3 subheadings.'
            ];
        } else {
            $readGood[] = [
                'title' => 'Subheading distribution',
                'message' => 'You are not using any subheadings, but your text is short enough and probably doesn\'t need them.'
            ];
        }
    } else {
        $readGood[] = [
            'title' => 'Subheading distribution',
            'message' => 'Great job! You have ' . $subheadingCount . ' subheadings structuring your content.'
        ];
    }

    // 6. Paragraph Length
    $paragraphs = preg_split('/\n+|<p[^>]*>/i', $content);
    $longParagraphs = 0;
    foreach ($paragraphs as $p) {
        $cleanP = trim(strip_tags($p));
        if (str_word_count($cleanP) > 150) $longParagraphs++;
    }
    if ($longParagraphs > 0) {
        $readImprovements[] = [
            'title' => 'Paragraph length',
            'message' => $longParagraphs . ' paragraph' . ($longParagraphs > 1 ? 's are' : ' is') . ' longer than 150 words. Shorten long paragraphs for better mobile reading.'
        ];
    } else {
        $readGood[] = [
            'title' => 'Paragraph length',
            'message' => 'There are no paragraphs that are too long. Great job!'
        ];
    }

    // 7. Sentence Length
    $longSentences = 0;
    foreach ($sentences as $s) {
        if (str_word_count(trim($s)) > 20) $longSentences++;
    }
    $longSentenceRatio = round(($longSentences / max(1, count($sentences))) * 100, 1);
    if ($longSentenceRatio > 25) {
        $readImprovements[] = [
            'title' => 'Sentence length',
            'message' => $longSentenceRatio . '% of the sentences contain more than 20 words. Try splitting them into shorter sentences.'
        ];
    } else {
        $readGood[] = [
            'title' => 'Sentence length',
            'message' => 'Great! Most sentences are concise and easy to read.'
        ];
    }

    // 8. Transition Words
    $transitions = ['however', 'therefore', 'furthermore', 'in addition', 'moreover', 'because', 'although', 'as a result', 'firstly', 'secondly', 'finally', 'for example', 'for instance', 'consequently'];
    $transitionMatches = 0;
    foreach ($transitions as $tr) {
        $transitionMatches += substr_count(strtolower($plainContent), $tr);
    }
    if ($wordCount > 200 && $transitionMatches === 0) {
        $readImprovements[] = [
            'title' => 'Transition words',
            'message' => 'You are not using any transition words. Using words like "however", "therefore", and "in addition" makes your text much easier to follow.'
        ];
    } elseif ($transitionMatches > 0) {
        $readGood[] = [
            'title' => 'Transition words',
            'message' => 'Great! You are using transition words (' . $transitionMatches . ' occurrences) to guide your readers.'
        ];
    } else {
        $readGood[] = [
            'title' => 'Transition words',
            'message' => 'You are not using any transition words, but your text is short enough and probably doesn\'t need them.'
        ];
    }
@endphp

<div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 font-sans text-xs shadow-xs mb-3 space-y-3.5 transition-colors">
    <!-- Readability Traffic Light Summary -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
            <span class="font-extrabold text-[12px] uppercase tracking-wider text-slate-900 dark:text-white">Analysis results</span>
            <span class="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">Readability</span>
        </div>
        <div class="flex items-center gap-2">
            @if(count($readProblems) > 0)
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    {{ count($readProblems) }} Problems
                </span>
            @endif
            @if(count($readImprovements) > 0)
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    {{ count($readImprovements) }} Improvements
                </span>
            @endif
            @if(count($readGood) > 0)
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {{ count($readGood) }} Good
                </span>
            @endif
        </div>
    </div>

    <!-- Problems Accordion -->
    @if(count($readProblems) > 0)
        <div x-data="{ open: true }" class="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 overflow-hidden">
            <button type="button" @click="open = !open" class="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-rose-900 dark:text-rose-300 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 transition-colors">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span>Problems ({{ count($readProblems) }})</span>
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
                    <span>Improvements ({{ count($readImprovements) }})</span>
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
        <div x-data="{ open: true }" class="rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 overflow-hidden">
            <button type="button" @click="open = !open" class="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-emerald-900 dark:text-emerald-300 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-colors">
                <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Good results ({{ count($readGood) }})</span>
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
