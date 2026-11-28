<?php

namespace App\Services;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class HtmlSanitizerService
{
    private const ALLOWED_IFRAME_HOSTS = [
        'www.youtube.com',
        'youtube.com',
        'www.youtube-nocookie.com',
        'player.vimeo.com',
        'vimeo.com',
    ];

    private const HTML_TAG_PATTERN = '/<\/?(?:p|h[1-6]|div|span|ul|ol|li|blockquote|table|thead|tbody|tfoot|tr|th|td|figure|figcaption|img|a|strong|em|b|i|u|s|mark|pre|code|iframe|script|style|object|embed|form|input|svg|details|summary|aside|section|br|hr)\b/i';

    private HtmlSanitizer $sanitizer;

    public function __construct()
    {
        $config = (new HtmlSanitizerConfig)
            ->allowSafeElements()
            ->allowLinkSchemes(['http', 'https', 'mailto', 'tel'])
            ->allowRelativeLinks(true)
            ->allowMediaSchemes(['http', 'https'])
            ->allowRelativeMedias(true)
            ->withMaxInputLength(500_000)
            ->allowElement('h1', ['id', 'class'])
            ->allowElement('h2', ['id', 'class'])
            ->allowElement('h3', ['id', 'class'])
            ->allowElement('h4', ['id', 'class'])
            ->allowElement('p', ['class'])
            ->allowElement('blockquote', ['class'])
            ->allowElement('ul', ['class'])
            ->allowElement('ol', ['class'])
            ->allowElement('li', ['class'])
            ->allowElement('u', ['class'])
            ->allowElement('s', ['class'])
            ->allowElement('mark', ['class'])
            ->allowElement('hr', ['class'])
            ->allowElement('br', [])
            ->allowElement('a', ['href', 'title', 'target', 'rel', 'class', 'data-cta'])
            ->allowElement('img', ['src', 'alt', 'title', 'width', 'height', 'loading', 'srcset', 'sizes', 'class', 'data-media-id'])
            ->allowElement('figure', ['class', 'data-video-embed'])
            ->allowElement('figcaption', ['class'])
            ->allowElement('div', ['class', 'id', 'role', 'aria-label', 'data-callout', 'data-type', 'data-toc', 'data-faq', 'data-cta', 'data-video-embed'])
            ->allowElement('section', ['class', 'id', 'aria-label', 'data-callout', 'data-toc', 'data-faq'])
            ->allowElement('aside', ['class', 'id', 'aria-label', 'data-callout'])
            ->allowElement('details', ['class', 'open'])
            ->allowElement('summary', ['class'])
            ->allowElement('pre', ['class', 'data-language'])
            ->allowElement('code', ['class', 'data-language'])
            ->allowElement('table', ['class'])
            ->allowElement('thead', ['class'])
            ->allowElement('tbody', ['class'])
            ->allowElement('tfoot', ['class'])
            ->allowElement('tr', ['class'])
            ->allowElement('th', ['class', 'colspan', 'rowspan', 'scope'])
            ->allowElement('td', ['class', 'colspan', 'rowspan'])
            ->allowElement('iframe', ['src', 'title', 'width', 'height', 'allowfullscreen', 'loading', 'class'])
            ->dropElement('script')
            ->dropElement('style')
            ->dropElement('object')
            ->dropElement('embed')
            ->dropElement('applet')
            ->dropElement('form')
            ->dropElement('input')
            ->dropElement('textarea')
            ->dropElement('select')
            ->dropElement('svg');

        $this->sanitizer = new HtmlSanitizer($config);
    }

    /**
     * Classify article body as pure 'markdown', 'mixed' (Markdown + embedded HTML such as <table>, <br>, <img>, <iframe>),
     * or rich 'html' (TipTap / semantic HTML).
     */
    public function classifyContent(?string $content): string
    {
        if ($content === null || trim($content) === '') {
            return 'markdown';
        }

        $hasHtmlTags = (bool) preg_match(self::HTML_TAG_PATTERN, $content);
        if (! $hasHtmlTags) {
            return 'markdown';
        }

        $hasMarkdownLines = (bool) preg_match('/^\s{0,3}(?:#{1,6}\s+\S|[-*+]\s+\S|\d+\.\s+\S|>\s+\S|\|[^\n]+\|)/m', $content);
        $hasPrimaryHtmlBlocks = (bool) preg_match('/<(?:p|h[1-6])\b/i', $content);

        if ($hasMarkdownLines || ! $hasPrimaryHtmlBlocks) {
            return 'mixed';
        }

        return 'html';
    }

    /**
     * Detect whether content is pure Markdown/plain text without HTML elements
     * so legacy Markdown posts are never altered by HTML sanitization.
     */
    public function isMarkdownOnly(?string $content): bool
    {
        return $this->classifyContent($content) === 'markdown';
    }

    /**
     * Sanitize HTML input against an allow-list and enforce safe embeds & links.
     * Preserves pure Markdown posts unaltered and keeps Markdown lines intact in mixed posts
     * while still stripping dangerous script/event-handler payloads.
     */
    public function sanitize(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        $classification = $this->classifyContent($html);

        if ($classification === 'markdown') {
            return $html;
        }

        if ($classification === 'mixed') {
            return $this->sanitizeMixedMarkdownHtml($html);
        }

        $cleaned = $this->sanitizer->sanitize($html);

        return $this->filterEmbedsAndExternalLinks($cleaned);
    }

    /**
     * Strip dangerous XSS vectors in mixed Markdown+HTML content without mutating Markdown syntax or line breaks.
     * Defeats nested-tag reassembly, encoded/raw javascript: URLs, srcdoc iframes, and event handlers.
     */
    private function sanitizeMixedMarkdownHtml(string $content): string
    {
        // 1. Defeat nested-tag reassembly (e.g. <scr<script>ipt>) by looping until fixed point
        do {
            $prev = $content;
            $content = preg_replace([
                '#<\s*(script|style|object|embed|applet|form|svg)\b[^>]*>.*?<\s*/\s*\1\s*>#is',
                '#<\s*(script|style|object|embed|applet|form|input|textarea|select|svg)\b[^>]*\/?>#is',
            ], '', $content) ?? $content;
        } while ($content !== $prev);

        // 2. Strip inline event handlers (on*=)
        $content = preg_replace('/\s+on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $content) ?? $content;

        // 3. Strip javascript:, vbscript:, and data: schemes (including entity-encoded and whitespace-padded variants)
        $content = preg_replace_callback('/((?:href|src|srcset|action|formaction)\s*=\s*["\'])([^"\']+)(["\'])/i', static function (array $m): string {
            $val = html_entity_decode($m[2], ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $valClean = preg_replace('/[\x00-\x1F\x7F\s]+/u', '', $val);
            if (preg_match('/^(?:javascript|vbscript|data):/i', $valClean)) {
                return $m[1].'#blocked:'.$m[3];
            }

            return $m[0];
        }, $content) ?? $content;

        // 4. Strip dangerous srcdoc attribute entirely
        $content = preg_replace('/\s+srcdoc\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $content) ?? $content;

        // 5. Enforce iframe host allow-list and disallow srcdoc/data iframes
        $content = preg_replace_callback('#<iframe\b[^>]*>.*?</iframe>#is', static function (array $match): string {
            if (preg_match('/\bsrcdoc\b/i', $match[0])) {
                return '';
            }
            if (! preg_match('/\bsrc\s*=\s*["\']([^"\']+)["\']/i', $match[0], $srcMatch)) {
                return '';
            }
            $src = trim($srcMatch[1]);
            $scheme = strtolower((string) parse_url($src, PHP_URL_SCHEME));
            $host = strtolower((string) parse_url($src, PHP_URL_HOST));

            if ($scheme !== 'https' || ! in_array($host, self::ALLOWED_IFRAME_HOSTS, true)) {
                return '';
            }

            return $match[0];
        }, $content) ?? $content;

        return $content;
    }

    /**
     * Enforce strict iframe host allow-list (YouTube/Vimeo only) and safe link rel attributes.
     */
    private function filterEmbedsAndExternalLinks(string $html): string
    {
        if (! str_contains($html, '<iframe') && ! str_contains($html, '<a ')) {
            return $html;
        }

        $previousState = libxml_use_internal_errors(true);
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $loaded = $dom->loadHTML(
            '<?xml encoding="utf-8" ?><div id="gif-sanitize-root">'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previousState);

        if (! $loaded) {
            return preg_replace('#<iframe\b[^>]*>.*?</iframe>#is', '', $html) ?? '';
        }

        $iframes = iterator_to_array($dom->getElementsByTagName('iframe'));
        foreach ($iframes as $iframe) {
            $src = trim($iframe->getAttribute('src'));
            $host = strtolower((string) parse_url($src, PHP_URL_HOST));
            $scheme = strtolower((string) parse_url($src, PHP_URL_SCHEME));

            if ($scheme !== 'https' || ! in_array($host, self::ALLOWED_IFRAME_HOSTS, true)) {
                $iframe->parentNode?->removeChild($iframe);

                continue;
            }

            if (! $iframe->hasAttribute('loading')) {
                $iframe->setAttribute('loading', 'lazy');
            }
            if (! $iframe->hasAttribute('referrerpolicy')) {
                $iframe->setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            }
        }

        $anchors = iterator_to_array($dom->getElementsByTagName('a'));
        foreach ($anchors as $anchor) {
            if (strtolower($anchor->getAttribute('target')) === '_blank') {
                $existingRel = array_filter(explode(' ', $anchor->getAttribute('rel')));
                $rel = array_unique(array_merge($existingRel, ['noopener', 'noreferrer']));
                $anchor->setAttribute('rel', implode(' ', $rel));
            }
        }

        $root = $dom->getElementById('gif-sanitize-root');
        if (! $root) {
            return $html;
        }

        $result = '';
        foreach ($root->childNodes as $child) {
            $result .= $dom->saveHTML($child);
        }

        return $result;
    }
}
