import './tiptap-studio.css';
import { Editor, Extension, Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';

const MARKDOWN_HTML_TAG_REGEX =
    /<\/?(?:p|h[1-6]|div|span|ul|ol|li|blockquote|table|thead|tbody|tfoot|tr|th|td|figure|figcaption|img|a|strong|em|b|i|u|s|mark|pre|code|iframe|script|style|object|embed|form|input|svg|details|summary|aside|section|br|hr)\b/i;

export function isMarkdownOnly(content) {
    if (!content || String(content).trim() === '') {
        return true;
    }
    return !MARKDOWN_HTML_TAG_REGEX.test(String(content));
}

export function slugifyHeading(text) {
    return (
        String(text || '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'section'
    );
}

export function normalizeVideoEmbedUrl(inputUrl) {
    const raw = String(inputUrl || '').trim();
    if (!raw) return null;

    let url;
    try {
        url = new URL(raw);
    } catch {
        return null;
    }

    if (url.protocol !== 'https:') {
        return null;
    }

    const host = url.hostname.toLowerCase();

    if (host === 'youtu.be') {
        const id = url.pathname.replace(/^\/+/, '').split('/')[0];
        return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }

    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
        if (url.pathname.startsWith('/embed/')) {
            const id = url.pathname.replace('/embed/', '').split('/')[0];
            return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
        }
        if (url.pathname.startsWith('/shorts/')) {
            const id = url.pathname.replace('/shorts/', '').split('/')[0];
            return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
        }
        const v = url.searchParams.get('v');
        return v ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v)}` : null;
    }

    if (host === 'vimeo.com' || host === 'www.vimeo.com') {
        const id = url.pathname.replace(/^\/+/, '').split('/')[0];
        return /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }

    if (host === 'player.vimeo.com') {
        const match = url.pathname.match(/\/video\/(\d+)/);
        return match ? `https://player.vimeo.com/video/${match[1]}` : null;
    }

    return null;
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Class-based text alignment extension (100% XSS-sanitizer safe without inline styles)
const BlockAlign = Extension.create({
    name: 'blockAlign',
    addOptions() {
        return {
            types: ['heading', 'paragraph'],
            alignments: ['left', 'center', 'right'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    textAlign: {
                        default: 'left',
                        parseHTML: (element) => {
                            if (element.classList.contains('gif-align-center')) return 'center';
                            if (element.classList.contains('gif-align-right')) return 'right';
                            return 'left';
                        },
                        renderHTML: (attributes) => {
                            if (attributes.textAlign === 'center') return { class: 'gif-align-center' };
                            if (attributes.textAlign === 'right') return { class: 'gif-align-right' };
                            return {};
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setBlockAlign:
                (alignment) =>
                ({ commands }) => {
                    if (!this.options.alignments.includes(alignment)) {
                        return false;
                    }
                    return this.options.types.every((type) =>
                        commands.updateAttributes(type, { textAlign: alignment })
                    );
                },
        };
    },
});

const CalloutNode = Node.create({
    name: 'callout',
    group: 'block',
    content: 'block+',
    defining: true,
    addAttributes() {
        return {
            type: {
                default: 'info',
                parseHTML: (el) => el.getAttribute('data-type') || 'info',
                renderHTML: (attrs) => ({ 'data-type': attrs.type || 'info' }),
            },
        };
    },
    parseHTML() {
        return [{ tag: 'div[data-callout]' }];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-callout': 'true',
                class: `gif-callout gif-callout-${HTMLAttributes['data-type'] || 'info'}`,
            }),
            0,
        ];
    },
});

const ImageFigureNode = Node.create({
    name: 'imageFigure',
    group: 'block',
    draggable: true,
    atom: true,
    addAttributes() {
        return {
            src: { default: '' },
            alt: { default: '' },
            caption: { default: '' },
            width: { default: null },
            height: { default: null },
            loading: { default: 'lazy' },
            srcset: { default: null },
            sizes: { default: null },
            mediaId: { default: null },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'figure.gif-image-figure',
                getAttrs: (el) => {
                    const img = el.querySelector('img');
                    if (!img) return false;
                    const cap = el.querySelector('figcaption');
                    return {
                        src: img.getAttribute('src') || '',
                        alt: img.getAttribute('alt') || '',
                        caption: cap ? cap.textContent || '' : '',
                        width: img.getAttribute('width'),
                        height: img.getAttribute('height'),
                        loading: img.getAttribute('loading') || 'lazy',
                        srcset: img.getAttribute('srcset'),
                        sizes: img.getAttribute('sizes'),
                        mediaId: img.getAttribute('data-media-id'),
                    };
                },
            },
            {
                tag: 'img[src]',
                getAttrs: (img) => ({
                    src: img.getAttribute('src') || '',
                    alt: img.getAttribute('alt') || '',
                    caption: '',
                    width: img.getAttribute('width'),
                    height: img.getAttribute('height'),
                    loading: img.getAttribute('loading') || 'lazy',
                    srcset: img.getAttribute('srcset'),
                    sizes: img.getAttribute('sizes'),
                    mediaId: img.getAttribute('data-media-id'),
                }),
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        const imgAttrs = {
            src: HTMLAttributes.src,
            alt: HTMLAttributes.alt || '',
            loading: HTMLAttributes.loading || 'lazy',
        };
        if (HTMLAttributes.width) imgAttrs.width = HTMLAttributes.width;
        if (HTMLAttributes.height) imgAttrs.height = HTMLAttributes.height;
        if (HTMLAttributes.srcset) imgAttrs.srcset = HTMLAttributes.srcset;
        if (HTMLAttributes.sizes) imgAttrs.sizes = HTMLAttributes.sizes;
        if (HTMLAttributes.mediaId) imgAttrs['data-media-id'] = HTMLAttributes.mediaId;

        if (HTMLAttributes.caption && String(HTMLAttributes.caption).trim() !== '') {
            return [
                'figure',
                { class: 'gif-image-figure' },
                ['img', imgAttrs],
                ['figcaption', {}, HTMLAttributes.caption],
            ];
        }

        return ['figure', { class: 'gif-image-figure' }, ['img', imgAttrs]];
    },
    addNodeView() {
        return ({ node, getPos, editor }) => {
            const wrap = document.createElement('div');
            wrap.className = 'gif-img-node';

            const img = document.createElement('img');
            img.style.maxHeight = '420px';
            img.style.objectFit = 'contain';

            const captionEl = document.createElement('figcaption');
            captionEl.style.textAlign = 'center';

            const metaBar = document.createElement('div');
            metaBar.className = 'gif-img-node-meta';

            const altPill = document.createElement('span');
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'gif-img-edit-btn';
            editBtn.textContent = 'Edit Alt & Caption';

            editBtn.addEventListener('click', () => {
                const currentAlt = node.attrs.alt || '';
                const currentCaption = node.attrs.caption || '';
                const nextAlt = window.prompt('Image Alt Text (required for SEO & accessibility):', currentAlt);
                if (nextAlt === null) return;
                const nextCaption = window.prompt('Optional Image Caption (leave blank for none):', currentCaption);
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos !== null) {
                    editor
                        .chain()
                        .focus()
                        .command(({ tr }) => {
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                alt: nextAlt.trim(),
                                caption: nextCaption === null ? currentCaption : nextCaption.trim(),
                            });
                            return true;
                        })
                        .run();
                }
            });

            metaBar.appendChild(altPill);
            metaBar.appendChild(editBtn);

            wrap.appendChild(img);
            wrap.appendChild(captionEl);
            wrap.appendChild(metaBar);

            const syncView = (currentNode) => {
                node = currentNode;
                img.src = currentNode.attrs.src || '';
                img.alt = currentNode.attrs.alt || '';
                const hasAlt = Boolean((currentNode.attrs.alt || '').trim());
                altPill.className = `gif-img-alt-pill ${hasAlt ? 'is-ok' : 'is-missing'}`;
                altPill.textContent = hasAlt ? `ALT: ${currentNode.attrs.alt}` : 'Missing ALT text';
                const cap = (currentNode.attrs.caption || '').trim();
                captionEl.textContent = cap;
                captionEl.style.display = cap ? 'block' : 'none';
            };

            syncView(node);

            return {
                dom: wrap,
                update: (updatedNode) => {
                    if (updatedNode.type.name !== 'imageFigure') return false;
                    syncView(updatedNode);
                    return true;
                },
            };
        };
    },
});

const VideoEmbedNode = Node.create({
    name: 'videoEmbed',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            src: { default: '' },
            title: { default: 'Embedded Video' },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'figure[data-video-embed]',
                getAttrs: (el) => {
                    const iframe = el.querySelector('iframe');
                    if (!iframe) return false;
                    const normalized = normalizeVideoEmbedUrl(iframe.getAttribute('src') || '');
                    if (!normalized) return false;
                    return {
                        src: normalized,
                        title: iframe.getAttribute('title') || 'Embedded Video',
                    };
                },
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'figure',
            { class: 'gif-video-embed', 'data-video-embed': 'true' },
            [
                'iframe',
                {
                    src: HTMLAttributes.src,
                    title: HTMLAttributes.title || 'Embedded Video',
                    loading: 'lazy',
                    allowfullscreen: 'allowfullscreen',
                    referrerpolicy: 'strict-origin-when-cross-origin',
                },
            ],
        ];
    },
});

const CtaButtonNode = Node.create({
    name: 'ctaButton',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            headline: { default: 'Ready to scale organic & paid growth?' },
            buttonText: { default: 'Book Free Strategy Audit' },
            href: { default: 'https://getintofeed.com/contact' },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'div[data-cta]',
                getAttrs: (el) => {
                    const a = el.querySelector('a');
                    const p = el.querySelector('p');
                    return {
                        headline: p ? p.textContent.trim() : 'Ready to scale?',
                        buttonText: a ? a.textContent.trim() : 'Get Started',
                        href: a ? a.getAttribute('href') || 'https://getintofeed.com/contact' : 'https://getintofeed.com/contact',
                    };
                },
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            { class: 'gif-cta-block', 'data-cta': 'button' },
            ['p', {}, ['strong', {}, HTMLAttributes.headline || '']],
            [
                'a',
                {
                    class: 'gif-cta-btn',
                    'data-cta': 'true',
                    href: HTMLAttributes.href || 'https://getintofeed.com/contact',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
                HTMLAttributes.buttonText || 'Learn More',
            ],
        ];
    },
    addNodeView() {
        return ({ node, getPos, editor }) => {
            const box = document.createElement('div');
            box.className = 'gif-cta-block';
            box.setAttribute('data-cta', 'button');

            const textWrap = document.createElement('div');
            const heading = document.createElement('strong');
            const urlSub = document.createElement('div');
            urlSub.style.fontSize = '11.5px';
            urlSub.style.color = 'var(--gif-text-muted)';
            textWrap.appendChild(heading);
            textWrap.appendChild(urlSub);

            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.gap = '8px';
            controls.style.flexWrap = 'wrap';

            const previewBtn = document.createElement('span');
            previewBtn.className = 'gif-cta-btn';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'gif-img-edit-btn';
            editBtn.textContent = 'Edit CTA';
            editBtn.addEventListener('click', () => {
                const nextHeadline = window.prompt('CTA Headline:', node.attrs.headline || '');
                if (nextHeadline === null) return;
                const nextLabel = window.prompt('Button Label:', node.attrs.buttonText || '');
                if (nextLabel === null) return;
                const nextHref = window.prompt('Destination URL (https:// or /path):', node.attrs.href || '');
                if (nextHref === null) return;

                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos !== null) {
                    editor
                        .chain()
                        .focus()
                        .command(({ tr }) => {
                            tr.setNodeMarkup(pos, undefined, {
                                headline: nextHeadline.trim() || node.attrs.headline,
                                buttonText: nextLabel.trim() || node.attrs.buttonText,
                                href: nextHref.trim() || node.attrs.href,
                            });
                            return true;
                        })
                        .run();
                }
            });

            controls.appendChild(previewBtn);
            controls.appendChild(editBtn);
            box.appendChild(textWrap);
            box.appendChild(controls);

            const sync = (n) => {
                node = n;
                heading.textContent = n.attrs.headline || '';
                urlSub.textContent = n.attrs.href || '';
                previewBtn.textContent = n.attrs.buttonText || 'Get Started';
            };
            sync(node);

            return {
                dom: box,
                update: (u) => {
                    if (u.type.name !== 'ctaButton') return false;
                    sync(u);
                    return true;
                },
            };
        };
    },
});

const FaqBlockNode = Node.create({
    name: 'faqBlock',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            items: {
                default: [
                    { q: 'What results can we expect in the first 90 days?', a: 'Structured campaigns focus on measurable pipeline, conversion lifts, and qualified lead volume.' },
                ],
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'div[data-faq]',
                getAttrs: (el) => {
                    const items = [];
                    el.querySelectorAll('.gif-faq-item, details').forEach((row) => {
                        const qEl = row.querySelector('h4, h3, summary, strong');
                        const aEl = row.querySelector('p');
                        const q = qEl ? qEl.textContent.trim() : '';
                        const a = aEl ? aEl.textContent.trim() : '';
                        if (q || a) items.push({ q, a });
                    });
                    return {
                        items: items.length
                            ? items
                            : [{ q: 'Frequently Asked Question', a: 'Detailed answer here.' }],
                    };
                },
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        const items = Array.isArray(HTMLAttributes.items) ? HTMLAttributes.items : [];
        const children = items.map((item) => [
            'div',
            { class: 'gif-faq-item' },
            ['h4', {}, item.q || ''],
            ['p', {}, item.a || ''],
        ]);
        return [
            'div',
            { class: 'gif-faq-block', 'data-faq': 'true' },
            ['p', { class: 'gif-faq-heading' }, ['strong', {}, 'Frequently Asked Questions']],
            ...children,
        ];
    },
    addNodeView() {
        return ({ node, getPos, editor }) => {
            const box = document.createElement('div');
            box.setAttribute('data-faq', 'true');

            const header = document.createElement('div');
            header.className = 'gif-faq-node-badge';
            const label = document.createElement('span');
            label.textContent = 'FAQ Schema Block (Auto-syncs JSON-LD)';

            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'gif-img-edit-btn';
            addBtn.textContent = '+ Add Q&A';

            header.appendChild(label);
            header.appendChild(addBtn);

            const listEl = document.createElement('div');
            listEl.style.display = 'flex';
            listEl.style.flexDirection = 'column';
            listEl.style.gap = '8px';

            box.appendChild(header);
            box.appendChild(listEl);

            const updateItems = (nextItems) => {
                const pos = typeof getPos === 'function' ? getPos() : null;
                if (pos === null) return;
                editor
                    .chain()
                    .focus()
                    .command(({ tr }) => {
                        tr.setNodeMarkup(pos, undefined, { items: nextItems });
                        return true;
                    })
                    .run();
            };

            addBtn.addEventListener('click', () => {
                const q = window.prompt('FAQ Question:');
                if (!q || !q.trim()) return;
                const a = window.prompt('FAQ Answer:');
                if (!a || !a.trim()) return;
                const next = [...(Array.isArray(node.attrs.items) ? node.attrs.items : []), { q: q.trim(), a: a.trim() }];
                updateItems(next);
            });

            const renderRows = (n) => {
                node = n;
                listEl.innerHTML = '';
                const items = Array.isArray(n.attrs.items) ? n.attrs.items : [];
                items.forEach((item, idx) => {
                    const row = document.createElement('div');
                    row.style.padding = '8px 10px';
                    row.style.borderRadius = '8px';
                    row.style.border = '1px solid var(--gif-border)';
                    row.style.background = 'var(--gif-bg)';

                    const qEl = document.createElement('div');
                    qEl.style.fontWeight = '700';
                    qEl.style.fontSize = '13px';
                    qEl.textContent = `${idx + 1}. ${item.q}`;

                    const aEl = document.createElement('div');
                    aEl.style.fontSize = '12.5px';
                    aEl.style.color = 'var(--gif-text-body)';
                    aEl.style.marginTop = '3px';
                    aEl.textContent = item.a;

                    const actions = document.createElement('div');
                    actions.style.display = 'flex';
                    actions.style.gap = '6px';
                    actions.style.marginTop = '6px';

                    const editRow = document.createElement('button');
                    editRow.type = 'button';
                    editRow.className = 'gif-img-edit-btn';
                    editRow.textContent = 'Edit';
                    editRow.addEventListener('click', () => {
                        const nq = window.prompt('Edit Question:', item.q);
                        if (nq === null) return;
                        const na = window.prompt('Edit Answer:', item.a);
                        if (na === null) return;
                        const copy = items.slice();
                        copy[idx] = { q: nq.trim(), a: na.trim() };
                        updateItems(copy);
                    });

                    const rmRow = document.createElement('button');
                    rmRow.type = 'button';
                    rmRow.className = 'gif-img-edit-btn';
                    rmRow.textContent = 'Remove';
                    rmRow.addEventListener('click', () => {
                        const copy = items.filter((_, i) => i !== idx);
                        if (copy.length === 0) {
                            editor.chain().focus().deleteSelection().run();
                            return;
                        }
                        updateItems(copy);
                    });

                    actions.appendChild(editRow);
                    actions.appendChild(rmRow);
                    row.appendChild(qEl);
                    row.appendChild(aEl);
                    row.appendChild(actions);
                    listEl.appendChild(row);
                });
            };

            renderRows(node);

            return {
                dom: box,
                update: (u) => {
                    if (u.type.name !== 'faqBlock') return false;
                    renderRows(u);
                    return true;
                },
            };
        };
    },
});

const TocBlockNode = Node.create({
    name: 'tocBlock',
    group: 'block',
    atom: true,
    draggable: true,
    parseHTML() {
        return [{ tag: 'div[data-toc]' }];
    },
    renderHTML() {
        return [
            'div',
            { class: 'gif-toc-block', 'data-toc': 'true', 'aria-label': 'Table of Contents' },
            ['p', {}, ['strong', {}, 'Table of Contents']],
            ['p', {}, 'Auto-generated from article H2 and H3 headings.'],
        ];
    },
    addNodeView() {
        return ({ editor }) => {
            const box = document.createElement('div');
            box.setAttribute('data-toc', 'true');

            const title = document.createElement('div');
            title.style.fontWeight = '800';
            title.style.fontSize = '12.5px';
            title.style.marginBottom = '6px';
            title.style.color = 'var(--gif-accent)';
            title.textContent = 'Auto Table of Contents (Live Headings)';

            const list = document.createElement('ul');
            list.style.margin = '0';
            list.style.paddingLeft = '1.25rem';
            list.style.fontSize = '13px';

            box.appendChild(title);
            box.appendChild(list);

            const refreshHeadings = () => {
                list.innerHTML = '';
                const headings = [];
                editor.state.doc.descendants((node) => {
                    if (node.type.name === 'heading' && node.attrs.level >= 2 && node.attrs.level <= 4) {
                        const text = node.textContent.trim();
                        if (text) headings.push({ level: node.attrs.level, text });
                    }
                });
                if (headings.length === 0) {
                    const li = document.createElement('li');
                    li.style.color = 'var(--gif-text-muted)';
                    li.textContent = 'Add H2 or H3 headings below to populate your Table of Contents automatically.';
                    list.appendChild(li);
                    return;
                }
                headings.forEach((h) => {
                    const li = document.createElement('li');
                    li.style.marginLeft = h.level === 3 ? '14px' : h.level === 4 ? '28px' : '0';
                    li.textContent = h.text;
                    list.appendChild(li);
                });
            };

            refreshHeadings();
            const onUpdate = () => refreshHeadings();
            editor.on('update', onUpdate);

            return {
                dom: box,
                destroy: () => {
                    editor.off('update', onUpdate);
                },
            };
        };
    },
});

const slashPluginKey = new PluginKey('gifSlashMenu');

function buildSlashCommandExtension(getItems, callbacks) {
    return Extension.create({
        name: 'gifSlashCommands',
        addProseMirrorPlugins() {
            return [
                Suggestion({
                    pluginKey: slashPluginKey,
                    editor: this.editor,
                    char: '/',
                    startOfLine: false,
                    items: ({ query }) => {
                        const q = String(query || '').toLowerCase().trim();
                        return getItems(callbacks).filter(
                            (item) =>
                                item.title.toLowerCase().includes(q) ||
                                item.keywords.some((kw) => kw.includes(q))
                        );
                    },
                    command: ({ editor, range, props }) => {
                        props.run(editor, range);
                    },
                    render: () => {
                        let popup = null;
                        let selectedIndex = 0;
                        let currentItems = [];
                        let currentCommand = null;

                        const renderList = () => {
                            if (!popup) return;
                            popup.innerHTML = '';
                            if (currentItems.length === 0) {
                                const empty = document.createElement('div');
                                empty.className = 'gif-slash-desc';
                                empty.style.padding = '10px';
                                empty.textContent = 'No matching blocks';
                                popup.appendChild(empty);
                                return;
                            }
                            currentItems.forEach((item, index) => {
                                const btn = document.createElement('button');
                                btn.type = 'button';
                                btn.className = `gif-slash-item${index === selectedIndex ? ' is-selected' : ''}`;

                                const badge = document.createElement('span');
                                badge.className = 'gif-slash-badge';
                                badge.textContent = item.badge;

                                const textCol = document.createElement('div');
                                const t = document.createElement('div');
                                t.className = 'gif-slash-title';
                                t.textContent = item.title;
                                const d = document.createElement('div');
                                d.className = 'gif-slash-desc';
                                d.textContent = item.description;
                                textCol.appendChild(t);
                                textCol.appendChild(d);

                                btn.appendChild(badge);
                                btn.appendChild(textCol);
                                btn.addEventListener('mousedown', (e) => {
                                    e.preventDefault();
                                    currentCommand(item);
                                });
                                popup.appendChild(btn);
                            });
                        };

                        const positionPopup = (props) => {
                            if (!popup) return;
                            const rect = typeof props.clientRect === 'function' ? props.clientRect() : null;
                            if (!rect) return;
                            const width = Math.min(300, window.innerWidth - 24);
                            const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
                            const spaceBelow = window.innerHeight - rect.bottom;
                            const top = spaceBelow > 240 ? rect.bottom + 6 : Math.max(12, rect.top - 280);
                            popup.style.left = `${left}px`;
                            popup.style.top = `${top}px`;
                        };

                        return {
                            onStart: (props) => {
                                currentItems = props.items || [];
                                currentCommand = props.command;
                                selectedIndex = 0;
                                popup = document.createElement('div');
                                popup.className = 'gif-slash-menu';
                                popup.setAttribute('role', 'listbox');
                                document.body.appendChild(popup);
                                renderList();
                                positionPopup(props);
                            },
                            onUpdate: (props) => {
                                currentItems = props.items || [];
                                currentCommand = props.command;
                                selectedIndex = Math.min(selectedIndex, Math.max(0, currentItems.length - 1));
                                renderList();
                                positionPopup(props);
                            },
                            onKeyDown: (props) => {
                                const key = props.event.key;
                                if (key === 'Escape') {
                                    popup?.remove();
                                    popup = null;
                                    return true;
                                }
                                if (key === 'ArrowDown') {
                                    if (currentItems.length > 0) {
                                        selectedIndex = (selectedIndex + 1) % currentItems.length;
                                        renderList();
                                    }
                                    return true;
                                }
                                if (key === 'ArrowUp') {
                                    if (currentItems.length > 0) {
                                        selectedIndex = (selectedIndex - 1 + currentItems.length) % currentItems.length;
                                        renderList();
                                    }
                                    return true;
                                }
                                if (key === 'Enter') {
                                    const chosen = currentItems[selectedIndex];
                                    if (chosen && currentCommand) {
                                        currentCommand(chosen);
                                        return true;
                                    }
                                }
                                return false;
                            },
                            onExit: () => {
                                popup?.remove();
                                popup = null;
                            },
                        };
                    },
                }),
            ];
        },
    });
}

function getSlashMenuItems(callbacks) {
    return [
        {
            badge: 'H2',
            title: 'Heading 2 (Section)',
            description: 'Main SEO section heading',
            keywords: ['heading', 'h2', 'title', 'section'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run(),
        },
        {
            badge: 'H3',
            title: 'Heading 3 (Subsection)',
            description: 'Nested subheading',
            keywords: ['heading', 'h3', 'sub'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run(),
        },
        {
            badge: 'H4',
            title: 'Heading 4 (Detail)',
            description: 'Supporting subsection heading',
            keywords: ['heading', 'h4'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).setNode('heading', { level: 4 }).run(),
        },
        {
            badge: '•',
            title: 'Bullet List',
            description: 'Unordered list items',
            keywords: ['bullet', 'list', 'ul'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
        },
        {
            badge: '1.',
            title: 'Numbered List',
            description: 'Step-by-step ordered list',
            keywords: ['numbered', 'ordered', 'ol', 'steps'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
        },
        {
            badge: '“ ”',
            title: 'Blockquote',
            description: 'Highlight key insight or quote',
            keywords: ['quote', 'blockquote', 'citation'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
        },
        {
            badge: 'TIP',
            title: 'Pro Tip Callout',
            description: 'Highlighted tip box',
            keywords: ['callout', 'tip', 'note', 'box'],
            run: (editor, range) =>
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .insertContent({
                        type: 'callout',
                        attrs: { type: 'tip' },
                        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Key Takeaway: Write your actionable tip here.' }] }],
                    })
                    .run(),
        },
        {
            badge: 'IMG',
            title: 'Image (Upload / Library)',
            description: 'Insert WebP image with Alt text',
            keywords: ['image', 'photo', 'picture', 'media', 'upload'],
            run: (editor, range) => {
                editor.chain().focus().deleteRange(range).run();
                callbacks.onRequestMedia?.();
            },
        },
        {
            badge: 'VID',
            title: 'Video Embed (YouTube / Vimeo)',
            description: 'Responsive privacy-enhanced embed',
            keywords: ['video', 'youtube', 'vimeo', 'embed'],
            run: (editor, range) => {
                editor.chain().focus().deleteRange(range).run();
                callbacks.onRequestVideo?.();
            },
        },
        {
            badge: 'TBL',
            title: 'Comparison Table (3×3)',
            description: 'Mobile-scrollable structured table',
            keywords: ['table', 'grid', 'comparison', 'pricing'],
            run: (editor, range) =>
                editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
        },
        {
            badge: '</>',
            title: 'Code Block',
            description: 'Preformatted code snippet',
            keywords: ['code', 'pre', 'snippet'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
        },
        {
            badge: 'CTA',
            title: 'CTA Conversion Banner',
            description: 'Call-to-action headline + button',
            keywords: ['cta', 'button', 'banner', 'conversion'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).insertContent({ type: 'ctaButton' }).run(),
        },
        {
            badge: 'FAQ',
            title: 'FAQ Schema Block',
            description: 'Auto-synced FAQPage structured data',
            keywords: ['faq', 'questions', 'schema', 'accordion'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).insertContent({ type: 'faqBlock' }).run(),
        },
        {
            badge: 'TOC',
            title: 'Auto Table of Contents',
            description: 'Live outline built from H2/H3 headings',
            keywords: ['toc', 'contents', 'outline', 'navigation'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).insertContent({ type: 'tocBlock' }).run(),
        },
        {
            badge: '—',
            title: 'Section Divider',
            description: 'Horizontal thematic break',
            keywords: ['divider', 'hr', 'line', 'separator'],
            run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
        },
    ];
}

export function serializeHtmlWithScrollableTablesAndToc(editor) {
    const raw = editor.getHTML();
    const template = document.createElement('template');
    template.innerHTML = raw;

    // Assign deterministic heading anchor IDs & collect headings for TOC hydration
    const headings = [];
    template.content.querySelectorAll('h2, h3, h4').forEach((h) => {
        const text = (h.textContent || '').trim();
        if (!text) return;
        const id = h.getAttribute('id') || slugifyHeading(text);
        h.setAttribute('id', id);
        if (h.tagName === 'H2' || h.tagName === 'H3') {
            headings.push({ id, text, level: h.tagName.toLowerCase() });
        }
    });

    // Ensure every table is wrapped inside a horizontally scrollable container on mobile
    template.content.querySelectorAll('table').forEach((table) => {
        const parent = table.parentElement;
        if (parent && parent.classList.contains('gif-table-scroll')) return;
        if (parent && parent.classList.contains('tableWrapper')) {
            parent.className = 'gif-table-scroll';
            return;
        }
        const wrapper = document.createElement('div');
        wrapper.className = 'gif-table-scroll';
        table.replaceWith(wrapper);
        wrapper.appendChild(table);
    });

    // Populate TocBlock HTML links cleanly
    template.content.querySelectorAll('div[data-toc]').forEach((tocEl) => {
        if (headings.length === 0) return;
        const listItems = headings
            .map(
                (h) =>
                    `<li class="gif-toc-html-${h.level}"><a href="#${escapeHtml(h.id)}">${escapeHtml(h.text)}</a></li>`
            )
            .join('');
        tocEl.innerHTML = `<p><strong>Table of Contents</strong></p><ul>${listItems}</ul>`;
    });

    return template.innerHTML;
}

export function extractFaqItemsFromDoc(editor) {
    const collected = [];
    editor.state.doc.descendants((node) => {
        if (node.type.name === 'faqBlock' && Array.isArray(node.attrs.items)) {
            node.attrs.items.forEach((item) => {
                if (item && (item.q || item.a)) {
                    collected.push({ q: String(item.q || ''), a: String(item.a || '') });
                }
            });
        }
    });
    return collected;
}

export function mountTipTapStudio({
    element,
    bubbleMenuElement,
    initialHtml = '',
    initialJson = null,
    placeholder = 'Write your article here... Type "/" to insert headings, tables, images, CTA, or FAQ blocks.',
    onUpdate,
    onSelectionUpdate,
    onUploadFile,
    onRequestMedia,
    onRequestVideo,
}) {
    if (!element) {
        throw new Error('TipTap mount target element is required.');
    }

    const callbacks = { onRequestMedia, onRequestVideo };

    const extensions = [
        StarterKit.configure({
            heading: { levels: [2, 3, 4] },
            codeBlock: { HTMLAttributes: { class: 'gif-code-block' } },
            history: { depth: 100 },
        }),
        Underline,
        Highlight.configure({ multicolor: false }),
        Link.configure({
            openOnClick: false,
            autolink: true,
            linkOnPaste: true,
        }),
        Placeholder.configure({ placeholder }),
        CharacterCount,
        BlockAlign,
        Table.configure({ resizable: false, HTMLAttributes: { class: 'gif-editor-table' } }),
        TableRow,
        TableHeader,
        TableCell,
        CalloutNode,
        ImageFigureNode,
        VideoEmbedNode,
        CtaButtonNode,
        FaqBlockNode,
        TocBlockNode,
        buildSlashCommandExtension(getSlashMenuItems, callbacks),
    ];

    if (bubbleMenuElement) {
        extensions.push(
            BubbleMenu.configure({
                element: bubbleMenuElement,
                shouldShow: ({ editor, from, to }) => {
                    if (from === to) return false;
                    if (editor.isActive('imageFigure') || editor.isActive('codeBlock')) return false;
                    return !editor.state.selection.empty;
                },
            })
        );
    }

    const startContent =
        initialJson && typeof initialJson === 'object' && initialJson.type === 'doc'
            ? initialJson
            : initialHtml || '';

    const editor = new Editor({
        element,
        extensions,
        content: startContent,
        editorProps: {
            attributes: {
                role: 'textbox',
                'aria-multiline': 'true',
                'aria-label': 'Article Visual Editor Canvas',
            },
            handlePaste: (_view, event) => {
                const items = Array.from(event.clipboardData?.items || []);
                const imageItem = items.find((i) => i.type && i.type.startsWith('image/'));
                if (imageItem && typeof onUploadFile === 'function') {
                    const file = imageItem.getAsFile();
                    if (file) {
                        event.preventDefault();
                        onUploadFile(file, editor);
                        return true;
                    }
                }
                return false;
            },
            handleDrop: (_view, event, _slice, moved) => {
                if (moved) return false;
                const files = Array.from(event.dataTransfer?.files || []);
                const imageFile = files.find((f) => f.type && f.type.startsWith('image/'));
                if (imageFile && typeof onUploadFile === 'function') {
                    event.preventDefault();
                    onUploadFile(imageFile, editor);
                    return true;
                }
                return false;
            },
        },
        onUpdate: ({ editor: instance }) => {
            if (typeof onUpdate === 'function') {
                onUpdate({
                    html: serializeHtmlWithScrollableTablesAndToc(instance),
                    json: instance.getJSON(),
                    text: instance.getText(),
                    faqItems: extractFaqItemsFromDoc(instance),
                });
            }
        },
        onSelectionUpdate: ({ editor: instance }) => {
            if (typeof onSelectionUpdate === 'function') {
                onSelectionUpdate(instance);
            }
        },
    });

    return editor;
}

if (typeof window !== 'undefined') {
    window.GetIntoFeedTipTap = {
        mount: mountTipTapStudio,
        isMarkdownOnly,
        normalizeVideoEmbedUrl,
        serializeHtmlWithScrollableTablesAndToc,
        extractFaqItemsFromDoc,
    };
}
