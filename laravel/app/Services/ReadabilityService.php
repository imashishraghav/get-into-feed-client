<?php

namespace App\Services;

class ReadabilityService
{
    /**
     * Analyze HTML content and return editorial readability, heading structure, and image alt-text checks.
     *
     * @return array{
     *     word_count: int,
     *     reading_time: int,
     *     readability_score: int,
     *     flesch_grade: string,
     *     heading_audit: array<string, mixed>,
     *     missing_alt_images: int,
     *     total_images: int
     * }
     */
    public function analyze(?string $html): array
    {
        $content = (string) ($html ?? '');
        $plain = trim(html_entity_decode(strip_tags($content), ENT_QUOTES | ENT_HTML5, 'UTF-8'));

        $words = $plain !== '' ? (preg_split('/\s+/u', $plain, -1, PREG_SPLIT_NO_EMPTY) ?: []) : [];
        $wordCount = count($words);
        $readingTime = max(1, (int) ceil($wordCount / 200));

        $sentences = $plain !== '' ? (preg_split('/[.!?]+/u', $plain, -1, PREG_SPLIT_NO_EMPTY) ?: []) : [];
        $sentenceCount = max(1, count($sentences));

        $syllables = 0;
        foreach ($words as $word) {
            $syllables += $this->estimateSyllables($word);
        }

        $score = 65;
        if ($wordCount > 0) {
            $wordsPerSentence = $wordCount / $sentenceCount;
            $syllablesPerWord = $syllables / $wordCount;
            $rawFlesch = 206.835 - (1.015 * $wordsPerSentence) - (84.6 * $syllablesPerWord);
            $score = (int) max(0, min(100, round($rawFlesch)));
        } else {
            $score = 0;
        }

        $grade = match (true) {
            $wordCount === 0 => 'Empty',
            $score >= 70 => 'Easy / Conversational',
            $score >= 50 => 'Clear / Editorial',
            $score >= 30 => 'Technical / Dense',
            default => 'Complex',
        };

        $headingAudit = $this->auditHeadings($content);
        [$totalImages, $missingAltImages] = $this->auditImageAltTexts($content);

        return [
            'word_count' => $wordCount,
            'reading_time' => $readingTime,
            'readability_score' => $score,
            'flesch_grade' => $grade,
            'heading_audit' => $headingAudit,
            'missing_alt_images' => $missingAltImages,
            'total_images' => $totalImages,
        ];
    }

    private function estimateSyllables(string $word): int
    {
        $clean = strtolower(preg_replace('/[^a-z]/', '', $word) ?? '');
        if (strlen($clean) <= 3) {
            return 1;
        }

        $clean = preg_replace('/(?:[^laeiouy]es|ed|[^laeiouy]e)$/', '', $clean) ?? $clean;
        $clean = preg_replace('/^y/', '', $clean) ?? $clean;
        preg_match_all('/[aeiouy]{1,2}/', $clean, $matches);

        return max(1, count($matches[0] ?? []));
    }

    /**
     * @return array{h1_count: int, h2_count: int, h3_count: int, h4_count: int, hierarchy_valid: bool}
     */
    private function auditHeadings(string $html): array
    {
        $h1 = preg_match_all('/<h1\b/i', $html) ?: 0;
        $h2 = preg_match_all('/<h2\b/i', $html) ?: 0;
        $h3 = preg_match_all('/<h3\b/i', $html) ?: 0;
        $h4 = preg_match_all('/<h4\b/i', $html) ?: 0;

        return [
            'h1_count' => $h1,
            'h2_count' => $h2,
            'h3_count' => $h3,
            'h4_count' => $h4,
            'hierarchy_valid' => $h1 === 0 && ($h2 > 0 || $h3 === 0),
        ];
    }

    /**
     * @return array{0: int, 1: int}
     */
    private function auditImageAltTexts(string $html): array
    {
        if ($html === '' || ! str_contains(strtolower($html), '<img')) {
            return [0, 0];
        }

        preg_match_all('/<img\b([^>]*)>/i', $html, $matches);
        $total = count($matches[1] ?? []);
        $missing = 0;

        foreach ($matches[1] ?? [] as $attrs) {
            if (! preg_match('/\balt\s*=\s*(["\'])(.*?)\1/is', $attrs, $altMatch) || trim($altMatch[2]) === '') {
                $missing++;
            }
        }

        return [$total, $missing];
    }
}
