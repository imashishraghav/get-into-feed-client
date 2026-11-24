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

    $seoTitle = (string) ($resolver('seo.seo_title') ?: ($resolver('name') ?: ($resolver('title') ?: ($resolver('project_name') ?: ''))));
    $metaDesc = (string) ($resolver('seo.meta_description') ?: ($resolver('short_description') ?: ($resolver('hero_description') ?: '')));
    $focusKw = strtolower(trim((string) $resolver('seo.focus_keyword')));
    $slug = strtolower(trim((string) $resolver('slug')));
    $content = (string) ($resolver('content') ?: ($resolver('overview') ?: ($resolver('hero_description') ?: '')));
    $plainContent = strip_tags($content);
    $wordCount = str_word_count($plainContent);
    $recordId = $record?->id ?? null;

    $problems = [];
    $improvements = [];
    $goodResults = [];

    // 1. Outbound Links (Supports HTML & Markdown)
    preg_match_all('/<a\s+[^>]*href=["\'](https?:\/\/[^"\']+)["\']/i', $content, $htmlOutbound);
    preg_match_all('/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/i', $content, $mdOutbound);
    $allOutbound = array_merge($htmlOutbound[1] ?? [], $mdOutbound[2] ?? []);
    $outboundLinks = 0;
    foreach ($allOutbound as $url) {
        if (!str_contains($url, 'getintofeed.com')) {
            $outboundLinks++;
        }
    }
    if ($outboundLinks === 0) {
        $problems[] = [
            'title' => 'Outbound links',
            'message' => 'No outbound links appear in this page. Add some authority links to external sources!'
        ];
    } else {
        $goodResults[] = [
            'title' => 'Outbound links',
            'message' => 'Good job! You have ' . $outboundLinks . ' outbound link' . ($outboundLinks > 1 ? 's' : '') . ' to external resources.'
        ];
    }

    // 2. Internal Links (Supports HTML & Markdown)
    preg_match_all('/<a\s+[^>]*href=["\'](\/[^"\']*|https?:\/\/getintofeed\.com[^"\']*)["\']/i', $content, $htmlInternal);
    preg_match_all('/\[([^\]]+)\]\((\/[^\)]*|https?:\/\/getintofeed\.com[^\)]*)\)/i', $content, $mdInternal);
    $internalLinks = count($htmlInternal[1] ?? []) + count($mdInternal[2] ?? []);
    if ($internalLinks === 0) {
        $problems[] = [
            'title' => 'Internal links',
            'message' => 'No internal links appear in this page, make sure to add some internal references to related services or blog guides!'
        ];
    } else {
        $goodResults[] = [
            'title' => 'Internal links',
            'message' => 'You have enough internal links (' . $internalLinks . '). Good job!'
        ];
    }

    // 3. Images and Keyphrase in Image Alt Attributes (Supports HTML & Markdown)
    preg_match_all('/<img[^>]+>/i', $content, $imgMatches);
    preg_match_all('/!\[([^\]]*)\]\(([^\)]+)\)/i', $content, $mdImgMatches);
    $totalImages = count($imgMatches[0] ?? []) + count($mdImgMatches[0] ?? []);
    if ($totalImages === 0) {
        $problems[] = [
            'title' => 'Images',
            'message' => 'No images appear on this page. Add some images or diagrams to increase reader engagement!'
        ];
        $problems[] = [
            'title' => 'Keyphrase in image alt attributes',
            'message' => 'This page does not have images, a keyphrase, or both. Add some images with alt attributes that include the keyphrase or synonyms!'
        ];
    } else {
        $imagesWithAlt = 0;
        $imagesWithKwInAlt = 0;
        foreach ($imgMatches[0] ?? [] as $img) {
            if (preg_match('/alt=["\']([^"\']+)["\']/i', $img, $altMatch)) {
                $imagesWithAlt++;
                if (!empty($focusKw) && str_contains(strtolower($altMatch[1]), $focusKw)) {
                    $imagesWithKwInAlt++;
                }
            }
        }
        foreach ($mdImgMatches[1] ?? [] as $altText) {
            if (!empty(trim($altText))) {
                $imagesWithAlt++;
                if (!empty($focusKw) && str_contains(strtolower($altText), $focusKw)) {
                    $imagesWithKwInAlt++;
                }
            }
        }

        if ($imagesWithAlt < $totalImages) {
            $improvements[] = [
                'title' => 'Image alt attributes',
                'message' => ($totalImages - $imagesWithAlt) . ' out of ' . $totalImages . ' images are missing an alt attribute. Crucial for Google Image search!'
            ];
        }

        if (!empty($focusKw)) {
            if ($imagesWithKwInAlt > 0) {
                $goodResults[] = [
                    'title' => 'Keyphrase in image alt attributes',
                    'message' => 'Good job! Your focus keyphrase appears in image alt attributes.'
                ];
            } else {
                $improvements[] = [
                    'title' => 'Keyphrase in image alt attributes',
                    'message' => 'Images on this page do not have alt attributes with the focus keyphrase. Add it to at least one image.'
                ];
            }
        }
    }

    // 4. Focus Keyphrase Length
    if (empty($focusKw)) {
        $problems[] = [
            'title' => 'Keyphrase length',
            'message' => 'No focus keyphrase was set for this page. Set a keyphrase in order to calculate your SEO score.'
        ];
    } else {
        $kwWords = str_word_count($focusKw);
        if ($kwWords > 6) {
            $improvements[] = [
                'title' => 'Keyphrase length',
                'message' => 'The focus keyphrase is ' . $kwWords . ' words long. That\'s more than the recommended maximum of 6 words.'
            ];
        } else {
            $goodResults[] = [
                'title' => 'Keyphrase length',
                'message' => 'Good job! Keyphrase is concise and focused (' . $kwWords . ' words).'
            ];
        }
    }

    // 5. Keyphrase in Introduction (Supports HTML & Markdown)
    $firstParagraph = '';
    if (preg_match('/<p[^>]*>(.*?)<\/p>/is', $content, $pMatch)) {
        $firstParagraph = strip_tags($pMatch[1]);
    } else {
        $cleanLines = array_filter(explode("\n", $content), fn($l) => !empty(trim($l)) && !str_starts_with(trim($l), '#') && !str_starts_with(trim($l), '>') && !str_starts_with(trim($l), '!') && !str_starts_with(trim($l), '-') && !str_starts_with(trim($l), '_') && !str_starts_with(trim($l), '*'));
        $firstParagraph = reset($cleanLines) ?: substr($plainContent, 0, 300);
    }

    if (empty($focusKw)) {
        $problems[] = [
            'title' => 'Keyphrase in introduction',
            'message' => 'Please add both a keyphrase and an introduction containing the keyphrase.'
        ];
    } elseif (!empty($firstParagraph) && str_contains(strtolower($firstParagraph), $focusKw)) {
        $goodResults[] = [
            'title' => 'Keyphrase in introduction',
            'message' => 'Your keyphrase appears in the first paragraph. Well done!'
        ];
    } else {
        $improvements[] = [
            'title' => 'Keyphrase in introduction',
            'message' => 'Your keyphrase or its synonyms do not appear in the first paragraph. Make sure the topic is clear immediately.'
        ];
    }

    // 6. Keyphrase Density
    $kwCount = 0;
    $density = 0;
    if (!empty($focusKw) && $wordCount > 0) {
        $kwCount = substr_count(strtolower($plainContent), $focusKw);
        $density = round(($kwCount * max(1, str_word_count($focusKw)) / $wordCount) * 100, 2);
    }

    if (empty($focusKw) || $wordCount === 0) {
        $problems[] = [
            'title' => 'Keyphrase density',
            'message' => 'Please add both a keyphrase and some text containing the keyphrase.'
        ];
    } elseif ($kwCount === 0) {
        $problems[] = [
            'title' => 'Keyphrase density',
            'message' => 'The focus keyphrase was found 0 times in the text. That\'s less than the recommended minimum of 0.5%. Focus on your keyphrase!'
        ];
    } elseif ($density >= 0.5 && $density <= 3.0) {
        $goodResults[] = [
            'title' => 'Keyphrase density',
            'message' => 'The focus keyphrase was found ' . $kwCount . ' times (' . $density . '%). This is great!'
        ];
    } elseif ($density > 3.0) {
        $problems[] = [
            'title' => 'Keyphrase density',
            'message' => 'The focus keyphrase was found ' . $kwCount . ' times (' . $density . '%). That is over the recommended maximum of 3.0%. Don\'t over-optimize!'
        ];
    } else {
        $improvements[] = [
            'title' => 'Keyphrase density',
            'message' => 'The focus keyphrase was found ' . $kwCount . ' times (' . $density . '%). That\'s a bit low; try using it in subheadings or body copy.'
        ];
    }

    // 7. Keyphrase in SEO Title
    if (empty($focusKw) || empty($seoTitle)) {
        $problems[] = [
            'title' => 'Keyphrase in SEO title',
            'message' => 'Please add both a keyphrase and an SEO title beginning with the keyphrase.'
        ];
    } elseif (str_contains(strtolower($seoTitle), $focusKw)) {
        if (str_starts_with(strtolower($seoTitle), $focusKw)) {
            $goodResults[] = [
                'title' => 'Keyphrase in SEO title',
                'message' => 'The keyphrase appears at the very beginning of the SEO title. Well done!'
            ];
        } else {
            $goodResults[] = [
                'title' => 'Keyphrase in SEO title',
                'message' => 'The focus keyphrase appears in the SEO title. Nice!'
            ];
        }
    } else {
        $problems[] = [
            'title' => 'Keyphrase in SEO title',
            'message' => 'The focus keyphrase does not appear in the SEO title. Add it near the beginning for optimal click-through rates.'
        ];
    }

    // 8. SEO Title Width / Length
    $titleLen = strlen($seoTitle);
    if ($titleLen === 0) {
        // already caught in keyphrase
    } elseif ($titleLen >= 30 && $titleLen <= 60) {
        $goodResults[] = [
            'title' => 'SEO title width',
            'message' => 'Good job! SEO title length is ' . $titleLen . ' characters (optimal 30–60 chars).'
        ];
    } elseif ($titleLen > 60) {
        $problems[] = [
            'title' => 'SEO title width',
            'message' => 'The SEO title is ' . $titleLen . ' characters long. That is over the recommended maximum of 60 characters and will be truncated by Google.'
        ];
    } else {
        $improvements[] = [
            'title' => 'SEO title width',
            'message' => 'The SEO title is ' . $titleLen . ' characters long. Try making it more descriptive (at least 30 characters).'
        ];
    }

    // 9. Keyphrase in Meta Description
    if (empty($focusKw) || empty($metaDesc)) {
        $problems[] = [
            'title' => 'Keyphrase in meta description',
            'message' => 'Please add both a keyphrase and a meta description containing the keyphrase.'
        ];
    } elseif (str_contains(strtolower($metaDesc), $focusKw)) {
        $goodResults[] = [
            'title' => 'Keyphrase in meta description',
            'message' => 'Keyphrase or its synonyms appear in the meta description. Well done!'
        ];
    } else {
        $improvements[] = [
            'title' => 'Keyphrase in meta description',
            'message' => 'The meta description has been specified, but it does not contain the focus keyphrase. Add it to entice searchers!'
        ];
    }

    // 10. Meta Description Length
    $descLen = strlen($metaDesc);
    if ($descLen === 0) {
        $problems[] = [
            'title' => 'Meta description length',
            'message' => 'No meta description has been specified. Search engines will display copy from the page instead. Make sure to write one!'
        ];
    } elseif ($descLen >= 80 && $descLen <= 160) {
        $goodResults[] = [
            'title' => 'Meta description length',
            'message' => 'Well done! Meta description is ' . $descLen . ' characters long (ideal 80–160 chars).'
        ];
    } elseif ($descLen > 160) {
        $problems[] = [
            'title' => 'Meta description length',
            'message' => 'The meta description is ' . $descLen . ' characters long. That is over the recommended maximum of 160 characters.'
        ];
    } else {
        $improvements[] = [
            'title' => 'Meta description length',
            'message' => 'The meta description is under 80 characters (' . $descLen . ' chars). Make it more descriptive to maximize search clicks.'
        ];
    }

    // 11. Previously Used Keyphrase (Cannibalization Check)
    if (empty($focusKw)) {
        $problems[] = [
            'title' => 'Previously used keyphrase',
            'message' => 'No focus keyphrase was set for this page. Please add a focus keyphrase you haven\'t used before on other content.'
        ];
    } else {
        $usedElsewhere = false;
        try {
            $usedElsewhere = \App\Models\SeoMetadata::where('focus_keyword', $focusKw)
                ->where(function($q) use ($recordId) {
                    if ($recordId) {
                        $q->where('seoble_id', '!=', $recordId);
                    }
                })->exists();
        } catch (\Throwable $e) {}

        if ($usedElsewhere) {
            $problems[] = [
                'title' => 'Previously used keyphrase',
                'message' => 'You\'ve used this focus keyphrase before on another page! Avoid keyword cannibalization so your pages don\'t compete with each other.'
            ];
        } else {
            $goodResults[] = [
                'title' => 'Previously used keyphrase',
                'message' => 'You haven\'t used this focus keyphrase before, very good!'
            ];
        }
    }

    // 12. Keyphrase in Slug
    if (empty($focusKw) || empty($slug)) {
        $problems[] = [
            'title' => 'Keyphrase in slug',
            'message' => 'Please add both a keyphrase and a slug containing the keyphrase.'
        ];
    } elseif (str_contains(str_replace('-', ' ', $slug), str_replace('-', ' ', $focusKw))) {
        $goodResults[] = [
            'title' => 'Keyphrase in slug',
            'message' => 'Keyphrase appears in the URL slug. Great!'
        ];
    } else {
        $improvements[] = [
            'title' => 'Keyphrase in slug',
            'message' => 'Your focus keyphrase does not appear in the URL slug for this page. Add it to the slug.'
        ];
    }

    // 13. Keyphrase in Subheading (H2, H3 - Supports HTML & Markdown)
    preg_match_all('/<h[2-4][^>]*>(.*?)<\/h[2-4]>/is', $content, $subheadingMatches);
    preg_match_all('/^#{2,4}\s+(.+)$/m', $content, $mdSubheadingMatches);
    $subheadings = array_merge($subheadingMatches[1] ?? [], $mdSubheadingMatches[1] ?? []);
    if (empty($focusKw) || count($subheadings) === 0) {
        if ($wordCount === 0) {
            $problems[] = [
                'title' => 'Keyphrase in subheading',
                'message' => 'Please add both a keyphrase and some text to receive relevant feedback.'
            ];
        } else {
            $improvements[] = [
                'title' => 'Keyphrase in subheading',
                'message' => 'Use more subheadings (H2, H3) and include your focus keyphrase in at least one.'
            ];
        }
    } else {
        $kwInSubheading = false;
        foreach ($subheadings as $sh) {
            if (str_contains(strtolower(strip_tags($sh)), $focusKw)) {
                $kwInSubheading = true;
                break;
            }
        }
        if ($kwInSubheading) {
            $goodResults[] = [
                'title' => 'Keyphrase in subheading',
                'message' => 'Your focus keyphrase appears in one or more higher-level subheadings (H2/H3). Good job!'
            ];
        } else {
            $improvements[] = [
                'title' => 'Keyphrase in subheading',
                'message' => 'Use your focus keyphrase in at least one subheading (H2 or H3).'
            ];
        }
    }

    // 14. Text Length (Word Count)
    if ($wordCount === 0) {
        $problems[] = [
            'title' => 'Text length',
            'message' => 'The text contains 0 words. This is far below the recommended minimum of 300 words. Add more content.'
        ];
    } elseif ($wordCount < 300) {
        $problems[] = [
            'title' => 'Text length',
            'message' => 'The text contains ' . $wordCount . ' words. This is below the recommended minimum of 300 words. Add more content.'
        ];
    } elseif ($wordCount < 600) {
        $improvements[] = [
            'title' => 'Text length',
            'message' => 'The text contains ' . $wordCount . ' words. Good, but comprehensive articles (600+ words) rank higher.'
        ];
    } else {
        $goodResults[] = [
            'title' => 'Text length',
            'message' => 'The text contains ' . $wordCount . ' words. Substantial editorial depth, well done!'
        ];
    }

    // 15. Single Title (No H1 in content)
    if (preg_match('/<h1[^>]*>/i', $content)) {
        $problems[] = [
            'title' => 'Single title',
            'message' => 'Your content contains an H1 heading. Avoid multiple H1 tags since the article title is already H1.'
        ];
    } else {
        $goodResults[] = [
            'title' => 'Single title',
            'message' => 'You don\'t have multiple H1 headings, well done!'
        ];
    }

    // 16. Competing Links
    $competing = false;
    if (!empty($focusKw)) {
        foreach ($outboundMatches[0] ?? [] as $outLink) {
            if (str_contains(strtolower($outLink), '>' . $focusKw . '<') || str_contains(strtolower($outLink), '>' . $focusKw . '</a>')) {
                $competing = true;
                break;
            }
        }
    }
    if ($competing) {
        $problems[] = [
            'title' => 'Competing links',
            'message' => 'You have links that use your exact focus keyphrase as anchor text to other pages. That confuses search engines.'
        ];
    } else {
        $goodResults[] = [
            'title' => 'Competing links',
            'message' => 'There are no links which use your keyphrase or synonym as their anchor text. Nice!'
        ];
    }
@endphp

<div class="rounded-xl border border-slate-200 bg-white p-4 font-sans text-xs shadow-xs mb-3 space-y-3.5 transition-colors">
    {{-- Header with Score Summary Pills --}}
    <div class="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-100">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
            <div>
                <span class="font-bold text-xs text-slate-900 tracking-wide uppercase">SEO Analysis Audit</span>
                <span class="text-[11px] font-semibold text-slate-500 ml-1.5">• 16 Technical & Editorial Checks</span>
            </div>
        </div>
        <div class="flex items-center gap-1.5">
            @if(count($problems) > 0)
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    {{ count($problems) }} Problems
                </span>
            @endif
            @if(count($improvements) > 0)
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {{ count($improvements) }} Improvements
                </span>
            @endif
            @if(count($goodResults) > 0)
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {{ count($goodResults) }} Good Results
                </span>
            @endif
        </div>
    </div>

    {{-- Problems Accordion --}}
    @if(count($problems) > 0)
        <div x-data="{ open: true }" class="rounded-xl border border-rose-200 bg-rose-50/20 overflow-hidden shadow-2xs">
            <button
                type="button"
                @click="open = !open"
                class="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs text-rose-900 hover:bg-rose-50/50 transition-colors cursor-pointer"
            >
                <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">✕</span>
                    <span class="text-[13px]">Problems ({{ count($problems) }})</span>
                </div>
                <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 text-rose-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div x-show="open" class="p-3 pt-0 space-y-2">
                @foreach($problems as $item)
                    <div class="p-3 rounded-lg bg-white border border-rose-100 shadow-2xs flex items-start gap-3 transition-colors hover:border-rose-200">
                        <span class="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">✕</span>
                        <div class="min-w-0 flex-1">
                            <span class="font-bold text-slate-900 text-xs">{{ $item['title'] }}:</span>
                            <span class="text-slate-600 text-xs ml-1 leading-relaxed">{{ $item['message'] }}</span>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    @endif

    {{-- Improvements Accordion --}}
    @if(count($improvements) > 0)
        <div x-data="{ open: true }" class="rounded-xl border border-amber-200 bg-amber-50/20 overflow-hidden shadow-2xs">
            <button
                type="button"
                @click="open = !open"
                class="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs text-amber-900 hover:bg-amber-50/50 transition-colors cursor-pointer"
            >
                <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">!</span>
                    <span class="text-[13px]">Improvements ({{ count($improvements) }})</span>
                </div>
                <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 text-amber-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div x-show="open" class="p-3 pt-0 space-y-2">
                @foreach($improvements as $item)
                    <div class="p-3 rounded-lg bg-white border border-amber-100 shadow-2xs flex items-start gap-3 transition-colors hover:border-amber-200">
                        <span class="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">!</span>
                        <div class="min-w-0 flex-1">
                            <span class="font-bold text-slate-900 text-xs">{{ $item['title'] }}:</span>
                            <span class="text-slate-600 text-xs ml-1 leading-relaxed">{{ $item['message'] }}</span>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    @endif

    {{-- Good Results Accordion --}}
    @if(count($goodResults) > 0)
        <div x-data="{ open: true }" class="rounded-xl border border-emerald-200 bg-emerald-50/20 overflow-hidden shadow-2xs">
            <button
                type="button"
                @click="open = !open"
                class="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs text-emerald-900 hover:bg-emerald-50/50 transition-colors cursor-pointer"
            >
                <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                    <span class="text-[13px]">Good results ({{ count($goodResults) }})</span>
                </div>
                <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 text-emerald-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div x-show="open" class="p-3 pt-0 space-y-2">
                @foreach($goodResults as $item)
                    <div class="p-3 rounded-lg bg-white border border-emerald-100 shadow-2xs flex items-start gap-3 transition-colors hover:border-emerald-200">
                        <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                        <div class="min-w-0 flex-1">
                            <span class="font-bold text-slate-900 text-xs">{{ $item['title'] }}:</span>
                            <span class="text-slate-600 text-xs ml-1 leading-relaxed">{{ $item['message'] }}</span>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</div>
