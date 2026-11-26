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
     * Detect whether content is pure Markdown/plain text without HTML elements
     * so legacy Markdown posts are never altered by HTML sanitization.
     */
    public function isMarkdownOnly(?string $content): bool
    {
        if ($content === null || trim($content) === '') {
            return true;
        }

        return ! (bool) preg_match(
            '/<\/?(?:p|h[1-6]|div|span|ul|ol|li|blockquote|table|thead|tbody|tfoot|tr|th|td|figure|figcaption|img|a|strong|em|b|i|u|s|mark|pre|code|iframe|script|style|object|embed|form|input|svg|details|summary|aside|section|br|hr)\b/i',
            $content
        );
    }

    /**
     * Sanitize HTML input against an allow-list and enforce safe embeds & links.
     * Preserves pure Markdown posts unaltered.
     */
    public function sanitize(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        if ($this->isMarkdownOnly($html)) {
            return $html;
        }

        $cleaned = $this->sanitizer->sanitize($html);

        return $this->filterEmbedsAndExternalLinks($cleaned);
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
