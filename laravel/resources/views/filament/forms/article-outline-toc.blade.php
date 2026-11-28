@php
    $record = isset($getRecord) && is_callable($getRecord) ? $getRecord() : null;
    $initialContent = (string) ($record?->content ?? '');
@endphp

<div
    wire:ignore
    x-data="articleOutlineToc({ initialContent: @js($initialContent) })"
    class="gif-sidebar-card"
>
    <div class="gif-sidebar-card-header">
        <div class="gif-row-gap-2">
            <svg class="gif-icon-sm gif-text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h12M4 18h8"/>
            </svg>
            <span class="gif-sidebar-title">Article Outline (TOC)</span>
        </div>
        <span class="gif-badge gif-badge-neutral" x-text="headings.length + ' headings'">0 headings</span>
    </div>

    <div class="gif-toc-body">
        <div x-show="hasH1Warning" style="display:none;" class="gif-toc-warning">
            <span>⚠ H1 detected inside article body. Use H2–H4 only.</span>
        </div>

        <template x-if="headings.length === 0">
            <p class="gif-toc-empty">
                Add H2, H3, or H4 headings in the editor to preview your live document outline.
            </p>
        </template>

        <ul class="gif-toc-list" x-show="headings.length > 0">
            <template x-for="(h, idx) in headings" :key="idx">
                <li>
                    <button
                        type="button"
                        @click="jumpToHeading(idx)"
                        class="gif-toc-item"
                        :class="'gif-toc-level-' + h.level"
                    >
                        <span class="gif-toc-tag" x-text="'H' + h.level">H2</span>
                        <span class="gif-toc-text" x-text="h.text"></span>
                    </button>
                </li>
            </template>
        </ul>
    </div>
</div>

<script>
(function () {
    function parseHeadings(html) {
        if (!html) return { list: [], hasH1: false };
        const hasH1 = /<h1\b[^>]*>/i.test(html);
        const list = [];
        const regex = /<h([2-4])\b[^>]*>(.*?)<\/h\1>/gi;
        let m;
        while ((m = regex.exec(html)) !== null) {
            const level = Number(m[1]);
            const tmp = document.createElement('div');
            tmp.innerHTML = m[2] || '';
            const text = (tmp.textContent || tmp.innerText || '').trim();
            if (text) {
                list.push({ level, text });
            }
        }
        return { list, hasH1 };
    }

    function registerOutlineToc() {
        if (!window.Alpine) return;

        window.Alpine.data('articleOutlineToc', (cfg) => ({
            headings: [],
            hasH1Warning: false,

            init() {
                const parsed = parseHeadings(cfg.initialContent || '');
                this.headings = parsed.list;
                this.hasH1Warning = parsed.hasH1;

                window.addEventListener('gif-editor-updated', (e) => {
                    if (!e.detail) return;
                    if (Array.isArray(e.detail.headings)) {
                        this.headings = e.detail.headings;
                    }
                    if (typeof e.detail.hasH1Warning === 'boolean') {
                        this.hasH1Warning = e.detail.hasH1Warning;
                    }
                });
            },

            jumpToHeading(index) {
                window.dispatchEvent(new CustomEvent('gif-scroll-to-heading', { detail: { index } }));
            }
        }));
    }

    if (window.Alpine) {
        registerOutlineToc();
    }
    document.addEventListener('alpine:init', registerOutlineToc);
})();
</script>
