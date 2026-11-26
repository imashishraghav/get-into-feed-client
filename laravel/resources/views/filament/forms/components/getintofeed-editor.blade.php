@php
    $record = isset($getRecord) && is_callable($getRecord) ? $getRecord() : null;
    $comp = $component ?? null;
    $statePath = isset($getStatePath) && is_callable($getStatePath) ? $getStatePath() : 'data.content';

    $mediaAssets = [];
    $mediaUrlMap = [];
    try {
        $mediaAssets = \App\Models\Media::latest()->take(60)->get()->map(function ($m) use (&$mediaUrlMap) {
            $mediaUrlMap[(string) $m->id] = $m->url;

            return [
                'id' => $m->id,
                'name' => $m->file_name,
                'url' => $m->url,
                'alt' => $m->alt_text ?: $m->title ?: $m->file_name,
                'size' => $m->formatted_size,
                'dimensions' => $m->dimensions,
                'width' => $m->width,
                'height' => $m->height,
                'created_at' => $m->created_at ? $m->created_at->format('M j, Y') : '',
            ];
        })->values()->toArray();
    } catch (\Throwable $e) {
    }

    if ($record?->featuredMedia) {
        $mediaUrlMap[(string) $record->featured_media_id] = $record->featuredMedia->url;
    }

    $recordId = $record?->id ?? null;
    $recordUuid = $record?->uuid ?? null;
    $postVersion = max(1, (int) ($record?->version ?? 1));
    $canPublish = (bool) (auth()->user()?->hasCmsPermission('blog.publish') ?? false);
    $initialFeaturedUrl = $record?->featuredMedia?->url ?? '';
    $tiptapCssUrl = asset('build/editor/tiptap-studio.css');
    $tiptapJsUrl = asset('build/editor/tiptap-studio.js');
    $autosaveEndpoint = $recordId ? route('admin.api.posts.autosave', ['post' => $recordId]) : '';
    $revisionsEndpoint = $recordId ? route('admin.api.posts.revisions.index', ['post' => $recordId]) : '';
    $revisionsDiffEndpoint = $recordId ? route('admin.api.posts.revisions.diff', ['post' => $recordId]) : '';
    $revisionsRestoreBase = $recordId ? url('/admin/api/posts/' . $recordId . '/revisions') : '';
    $previewLinkEndpoint = $recordId ? route('admin.api.posts.preview-link', ['post' => $recordId]) : '';
@endphp

<link rel="stylesheet" href="{{ $tiptapCssUrl }}">

{{-- Validation errors surfaced cleanly outside wire:ignore --}}
@if($errors->has('data.title') || $errors->has('data.slug') || $errors->has('data.content'))
    <div style="margin-bottom: 12px; padding: 10px 14px; border-radius: 10px; background: var(--gif-danger-bg); border: 1px solid var(--gif-danger-border); color: var(--gif-danger); font-size: 12px; font-weight: 600;">
        @error('data.title') <div>• {{ $message }}</div> @enderror
        @error('data.slug') <div>• {{ $message }}</div> @enderror
        @error('data.content') <div>• {{ $message }}</div> @enderror
    </div>
@endif

<script>
(function () {
    function registerGetintofeedEditorStudio() {
        if (!window.Alpine) return;

        window.Alpine.data('getintofeedEditorStudio', (cfg) => ({
            // Livewire $entangle state (deferred by default in Livewire 3 => zero typing lag)
            content: cfg.content,
            title: cfg.title,
            slug: cfg.slug,
            excerpt: cfg.excerpt,
            focusKeyphrase: cfg.focusKeyphrase,
            secondaryKeyphrases: cfg.secondaryKeyphrases,
            seoTitle: cfg.seoTitle,
            metaDescription: cfg.metaDescription,
            canonicalUrl: cfg.canonicalUrl,
            schemaType: cfg.schemaType,
            robotsIndex: cfg.robotsIndex,
            robotsFollow: cfg.robotsFollow,
            faqItems: cfg.faqItems,
            ogTitle: cfg.ogTitle,
            ogDescription: cfg.ogDescription,
            seoScore: cfg.seoScore,
            readabilityScore: cfg.readabilityScore,
            wordCount: cfg.wordCount,
            readingTime: cfg.readingTime,
            featuredImageAlt: cfg.featuredImageAlt,
            featuredMediaId: cfg.featuredMediaId,
            visibility: cfg.visibility,
            version: cfg.version,
            contentJson: cfg.contentJson,

            // Config & lookups
            recordId: cfg.recordId || null,
            recordUuid: cfg.recordUuid || null,
            canPublish: Boolean(cfg.canPublish),
            tiptapJsUrl: cfg.tiptapJsUrl || '/build/editor/tiptap-studio.js',
            csrfToken: cfg.csrfToken || '',
            uploadEndpoint: cfg.uploadEndpoint || '/admin/editor/upload-image',
            internalLinksEndpoint: cfg.internalLinksEndpoint || '/admin/editor/internal-links',
            mediaListEndpoint: cfg.mediaListEndpoint || '/admin/media/list',
            autosaveEndpoint: cfg.autosaveEndpoint || '',
            revisionsEndpoint: cfg.revisionsEndpoint || '',
            revisionsDiffEndpoint: cfg.revisionsDiffEndpoint || '',
            revisionsRestoreBase: cfg.revisionsRestoreBase || '',
            previewLinkEndpoint: cfg.previewLinkEndpoint || '',
            mediaUrlMap: cfg.mediaUrlMap || {},
            mediaAssets: cfg.mediaAssets || [],
            featuredImageUrl: cfg.initialFeaturedUrl || '',

            // Editor UI state
            mode: 'visual',
            mobileTab: 'content',
            isMarkdownPost: false,
            isFocusMode: false,
            isExcerptOpen: false,
            isEditingSlug: false,
            slugCustomized: Boolean(cfg.recordId),
            tempSlug: '',
            savedRange: null,
            _auditTimer: null,
            _syncTimer: null,
            _localSaveTimer: null,
            _serverAutosaveTimer: null,
            _canvasCtx: null,
            _tiptapEditor: null,
            tiptapReady: false,
            activeMarks: {},
            isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
            isKeyboardOpen: false,
            keyboardBottomOffset: 0,
            hasUncommittedChanges: false,

            // Auto-save & Optimistic Locking state
            autoSaveStatus: 'Synced',
            autosaveState: 'idle',
            hasRecoverableDraft: false,
            recoverableDraftTime: '',
            versionConflict: null,

            // SEO Studio PRO UI
            seoTab: 'audit',
            serpDevice: 'desktop',
            showSerpDate: true,
            newLsiInput: '',
            seoTitlePx: 0,

            // Live Stats
            stats: {
                words: 0,
                readingTime: 1,
                headings: 0,
                internalLinks: 0,
                externalLinks: 0,
                totalLinks: 0,
            },

            // Keyword & Audit Metrics
            keywordCount: 0,
            keywordDensity: 0,
            usedLsiCount: 0,
            pillarScore: { basic: 0, titleMeta: 0, contentLsi: 0, linksTech: 0 },
            criticalIssues: [],
            recommendedTips: [],
            passedChecks: [],

            // Readability Metrics
            fleschScore: 70,
            avgSentenceLength: 0,
            passiveVoicePct: 0,
            transitionWordsPct: 0,
            longParagraphs: [],
            readabilityLabel: 'OK',

            // Internal Link Suggestions
            internalSuggestions: [],
            internalLoading: false,
            internalSearchQuery: '',

            // Modals
            mediaModal: {
                open: false,
                tab: 'upload',
                url: '',
                alt: '',
                caption: '',
                lazy: true,
                width: null,
                height: null,
                sizeLabel: '',
                search: '',
                isDragging: false,
                isUploading: false,
                error: '',
            },
            linkModal: {
                open: false,
                url: '',
                text: '',
                newTab: true,
                nofollow: false,
                search: '',
                results: [],
                loading: false,
            },
            alsoReadModal: {
                open: false,
                search: '',
                results: [],
                loading: false,
            },
            videoModal: {
                open: false,
                url: '',
                title: '',
                error: '',
            },
            revisionsDrawer: {
                open: false,
                loading: false,
                items: [],
                selectedFrom: null,
                selectedTo: null,
                diff: null,
                diffLoading: false,
                restoring: false,
                error: '',
            },
            previewModal: {
                open: false,
                device: 'desktop',
                shareUrl: '',
                expiresInMinutes: 0,
                loadingShare: false,
                error: '',
            },
            toast: {
                show: false,
                message: '',
            },

            initEditor() {
                if (typeof this.content !== 'string') this.content = '';
                if (typeof this.title !== 'string') this.title = '';
                if (typeof this.slug !== 'string') this.slug = '';
                if (typeof this.excerpt !== 'string') this.excerpt = '';
                if (typeof this.focusKeyphrase !== 'string') this.focusKeyphrase = '';
                if (!Array.isArray(this.secondaryKeyphrases)) this.secondaryKeyphrases = [];
                if (typeof this.seoTitle !== 'string') this.seoTitle = '';
                if (typeof this.metaDescription !== 'string') this.metaDescription = '';
                if (typeof this.canonicalUrl !== 'string') this.canonicalUrl = '';
                if (!this.schemaType) this.schemaType = 'BlogPosting';
                if (this.robotsIndex === null || this.robotsIndex === undefined) this.robotsIndex = true;
                if (this.robotsFollow === null || this.robotsFollow === undefined) this.robotsFollow = true;
                if (!Array.isArray(this.faqItems)) this.faqItems = [];
                if (typeof this.ogTitle !== 'string') this.ogTitle = '';
                if (typeof this.ogDescription !== 'string') this.ogDescription = '';
                if (typeof this.featuredImageAlt !== 'string') this.featuredImageAlt = '';
                if (!this.visibility) this.visibility = 'public';
                if (!this.version || Number(this.version) < 1) this.version = 1;
                this.tempSlug = this.slug;

                this.setMobileTab('content');
                this.isMarkdownPost = Boolean(this.content.trim() && this.isContentMarkdownOnly(this.content));
                if (this.isMarkdownPost) {
                    this.mode = 'html';
                }

                this.$nextTick(() => {
                    this.resolveFeaturedImageUrl();
                    this.runFullAnalysis();
                    this.checkLocalDraftRecovery();
                    this.fetchInternalSuggestions();
                    if (!this.isMarkdownPost && this.mode === 'visual') {
                        this.mountTipTapEditor();
                    }
                });

                this.setupViewportAndConnectivity();

                this.$watch('featuredMediaId', () => {
                    this.resolveFeaturedImageUrl();
                    this.scheduleAudit();
                });
                this.$watch('featuredImageAlt', () => {
                    this.scheduleAudit();
                });

                window.addEventListener('sync-wp-editor', () => {
                    this.flushContentToWire();
                });
                window.addEventListener('gif-switch-seo-tab', (e) => {
                    if (e.detail && e.detail.tab) {
                        this.seoTab = e.detail.tab;
                        this.setMobileTab('seo');
                    }
                });
                window.addEventListener('gif-scroll-to-heading', (e) => {
                    if (!e.detail || typeof e.detail.index !== 'number') return;
                    this.setMobileTab('content');
                    this.scrollToEditorHeading(e.detail.index);
                });
                window.addEventListener('gif-open-preview-modal', () => {
                    this.openPreviewModal();
                });
                window.addEventListener('gif-open-revisions-drawer', () => {
                    this.openRevisionsDrawer();
                });
                window.addEventListener('beforeunload', (e) => {
                    if (this.hasUncommittedChanges) {
                        e.preventDefault();
                        e.returnValue = '';
                    }
                });

                const formEl = this.$el.closest('form');
                if (formEl) {
                    formEl.addEventListener('submit', () => {
                        this.hasUncommittedChanges = false;
                        this.flushContentToWire();
                        this.clearLocalDraft();
                    });
                }
            },

            isContentMarkdownOnly(text) {
                if (!text || String(text).trim() === '') return false;
                return !/[<]\/?(?:p|h[1-6]|div|span|ul|ol|li|blockquote|table|thead|tbody|tfoot|tr|th|td|figure|figcaption|img|a|strong|em|b|i|u|s|mark|pre|code|iframe|script|style|object|embed|form|input|svg|details|summary|aside|section|br|hr)\b/i.test(String(text));
            },

            setMobileTab(tab) {
                this.mobileTab = tab;
                document.documentElement.dataset.gifMobileTab = tab;
            },

            setupViewportAndConnectivity() {
                window.addEventListener('online', () => {
                    this.isOnline = true;
                    this.autoSaveStatus = 'Back online · Ready';
                    this.autosaveState = 'idle';
                });
                window.addEventListener('offline', () => {
                    this.isOnline = false;
                    this.autosaveState = 'offline';
                    this.autoSaveStatus = 'Offline · Saving locally';
                });

                if (window.visualViewport) {
                    const updateVp = () => {
                        const vv = window.visualViewport;
                        const inset = Math.max(0, Math.round(window.innerHeight - (vv.height + vv.offsetTop)));
                        this.keyboardBottomOffset = inset;
                        this.isKeyboardOpen = inset > 120;
                        document.documentElement.style.setProperty('--gif-vv-bottom', inset + 'px');
                    };
                    window.visualViewport.addEventListener('resize', updateVp);
                    window.visualViewport.addEventListener('scroll', updateVp);
                }
            },

            async mountTipTapEditor() {
                if (!this.$refs.tiptapMount) return;
                if (this._tiptapEditor) return;

                try {
                    if (!window.GetIntoFeedTipTap) {
                        await import(this.tiptapJsUrl);
                    }
                } catch (err) {
                    this.showToast('Unable to load rich editor engine — using code mode.');
                    this.mode = 'html';
                    return;
                }

                if (!window.GetIntoFeedTipTap || !this.$refs.tiptapMount) return;

                this._tiptapEditor = window.GetIntoFeedTipTap.mount({
                    element: this.$refs.tiptapMount,
                    bubbleMenuElement: this.$refs.bubbleMenu || null,
                    initialHtml: this.content || '',
                    onUpdate: ({ html, json, faqItems }) => {
                        this.content = html;
                        this.contentJson = json;
                        if (Array.isArray(faqItems) && faqItems.length > 0) {
                            this.faqItems = faqItems;
                        }
                        this.markDirtyAndScheduleSaves();
                    },
                    onSelectionUpdate: (ed) => {
                        this.refreshActiveMarks(ed);
                    },
                    onUploadFile: (file, ed) => {
                        this.uploadFileDirectlyToEditor(file, ed);
                    },
                    onRequestMedia: () => {
                        this.openMediaModal();
                    },
                    onRequestVideo: () => {
                        this.openVideoModal();
                    },
                });
                this.tiptapReady = true;
                this.refreshActiveMarks(this._tiptapEditor);
            },

            refreshActiveMarks(ed) {
                if (!ed) return;
                this.activeMarks = {
                    bold: ed.isActive('bold'),
                    italic: ed.isActive('italic'),
                    underline: ed.isActive('underline'),
                    strike: ed.isActive('strike'),
                    highlight: ed.isActive('highlight'),
                    bulletList: ed.isActive('bulletList'),
                    orderedList: ed.isActive('orderedList'),
                    blockquote: ed.isActive('blockquote'),
                    codeBlock: ed.isActive('codeBlock'),
                    link: ed.isActive('link'),
                    table: ed.isActive('table'),
                    h2: ed.isActive('heading', { level: 2 }),
                    h3: ed.isActive('heading', { level: 3 }),
                    h4: ed.isActive('heading', { level: 4 }),
                };
            },

            convertMarkdownToVisualBlocks() {
                const md = String(this.content || '');
                const lines = md.split(/\r?\n/);
                let html = '';
                let inList = false;

                for (const rawLine of lines) {
                    const line = rawLine.trim();
                    if (!line) {
                        if (inList) { html += '<\/ul>'; inList = false; }
                        continue;
                    }
                    if (/^###\s+/.test(line)) {
                        if (inList) { html += '<\/ul>'; inList = false; }
                        html += `<h3>${this.escapeHtml(line.replace(/^###\s+/, ''))}<\/h3>`;
                    } else if (/^##\s+/.test(line)) {
                        if (inList) { html += '<\/ul>'; inList = false; }
                        html += `<h2>${this.escapeHtml(line.replace(/^##\s+/, ''))}<\/h2>`;
                    } else if (/^#\s+/.test(line)) {
                        if (inList) { html += '<\/ul>'; inList = false; }
                        html += `<h2>${this.escapeHtml(line.replace(/^#\s+/, ''))}<\/h2>`;
                    } else if (/^[-*]\s+/.test(line)) {
                        if (!inList) { html += '<ul>'; inList = true; }
                        html += `<li>${this.escapeHtml(line.replace(/^[-*]\s+/, ''))}<\/li>`;
                    } else {
                        if (inList) { html += '<\/ul>'; inList = false; }
                        let safe = this.escapeHtml(line)
                            .replace(/\*\*(.+?)\*\*/g, '<strong>$1<\/strong>')
                            .replace(/\*(.+?)\*/g, '<em>$1<\/em>');
                        html += `<p>${safe}<\/p>`;
                    }
                }
                if (inList) html += '<\/ul>';

                this.isMarkdownPost = false;
                this.content = html || '<p><\/p>';
                this.switchMode('visual');
                this.markDirtyAndScheduleSaves();
                this.showToast('Converted Markdown into editable Visual Blocks');
            },

            showToast(msg) {
                this.toast.message = msg;
                this.toast.show = true;
                setTimeout(() => { this.toast.show = false; }, 3200);
            },

            slugify(text) {
                return (text || '')
                    .toString()
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+|-+$/g, '');
            },

            escapeHtml(str) {
                return String(str || '')
                    .replace(/&/g, '&amp;')
                    .replace(/[<]/g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            },

            highlightKeyphrase(text) {
                const safe = this.escapeHtml(text || '');
                const kw = (this.focusKeyphrase || '').trim();
                if (!kw || !safe) return safe;
                const escapedKw = this.escapeHtml(kw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                try {
                    const re = new RegExp('(' + escapedKw + ')', 'gi');
                    return safe.replace(re, '<strong style="background: rgba(250, 204, 21, 0.35); padding: 0 2px; border-radius: 3px;">$1<\/strong>');
                } catch (e) {
                    return safe;
                }
            },

            measurePixelWidth(text) {
                if (!text) return 0;
                if (!this._canvasCtx) {
                    const canvas = document.createElement('canvas');
                    this._canvasCtx = canvas.getContext('2d');
                }
                if (!this._canvasCtx) {
                    return text.length * 10;
                }
                this._canvasCtx.font = '20px Arial, Roboto, sans-serif';
                return Math.round(this._canvasCtx.measureText(text).width);
            },

            resolveFeaturedImageUrl() {
                const id = this.featuredMediaId ? String(this.featuredMediaId) : '';
                if (!id) {
                    this.featuredImageUrl = '';
                    return;
                }
                if (this.mediaUrlMap[id]) {
                    this.featuredImageUrl = this.mediaUrlMap[id];
                    return;
                }
                const found = this.mediaAssets.find((m) => String(m.id) === id);
                if (found && found.url) {
                    this.mediaUrlMap[id] = found.url;
                    this.featuredImageUrl = found.url;
                    return;
                }
                fetch(this.mediaListEndpoint, { headers: { Accept: 'application/json' } })
                    .then((r) => (r.ok ? r.json() : null))
                    .then((data) => {
                        if (data && Array.isArray(data.media)) {
                            this.mediaAssets = data.media;
                            data.media.forEach((m) => {
                                this.mediaUrlMap[String(m.id)] = m.url;
                            });
                            if (this.mediaUrlMap[id]) {
                                this.featuredImageUrl = this.mediaUrlMap[id];
                            }
                        }
                    })
                    .catch(() => {});
            },

            // Title & Slug Handlers
            onTitleInput(val) {
                this.title = val;
                if (!this.slugCustomized || !this.slug) {
                    this.slug = this.slugify(val);
                    this.tempSlug = this.slug;
                }
                this.markDirtyAndScheduleSaves();
            },

            markDirtyAndScheduleSaves() {
                this.hasUncommittedChanges = true;
                this.autoSaveStatus = this.isOnline ? 'Unsaved changes...' : 'Offline · Saving locally...';
                this.scheduleAudit();
                this.scheduleLocalSave();
                this.scheduleServerAutosave();
            },

            saveSlug() {
                this.slug = this.slugify(this.tempSlug || this.title);
                this.tempSlug = this.slug;
                this.slugCustomized = true;
                this.isEditingSlug = false;
                this.markDirtyAndScheduleSaves();
                this.showToast('Permalink slug updated');
            },

            cancelSlug() {
                this.tempSlug = this.slug;
                this.isEditingSlug = false;
            },

            onHtmlInput() {
                this.markDirtyAndScheduleSaves();
            },

            flushContentToWire() {
                clearTimeout(this._syncTimer);
                if (this.mode === 'visual' && this._tiptapEditor && window.GetIntoFeedTipTap) {
                    this.content = window.GetIntoFeedTipTap.serializeHtmlWithScrollableTablesAndToc(this._tiptapEditor);
                    this.contentJson = this._tiptapEditor.getJSON();
                } else if (this.mode === 'html' && this.$refs.htmlTextarea) {
                    this.content = this.$refs.htmlTextarea.value;
                }
                this.readabilityScore = Math.max(0, Math.min(100, Number(this.fleschScore || 0)));
                this.runFullAnalysis();
            },

            async switchMode(newMode) {
                if (newMode === this.mode) return;
                if (newMode === 'html') {
                    if (this._tiptapEditor && window.GetIntoFeedTipTap) {
                        this.content = window.GetIntoFeedTipTap.serializeHtmlWithScrollableTablesAndToc(this._tiptapEditor);
                        this.contentJson = this._tiptapEditor.getJSON();
                    }
                    this.mode = 'html';
                } else {
                    if (this.isMarkdownPost) {
                        this.convertMarkdownToVisualBlocks();
                        return;
                    }
                    this.mode = 'visual';
                    await this.$nextTick();
                    if (!this._tiptapEditor) {
                        await this.mountTipTapEditor();
                    } else {
                        this._tiptapEditor.commands.setContent(this.content || '', false);
                        this.contentJson = this._tiptapEditor.getJSON();
                    }
                }
                this.runFullAnalysis();
            },

            exec(cmd, val = null) {
                if (this.mode === 'html') {
                    this.showToast('Switch to Visual mode to use formatting tools.');
                    return;
                }
                const ed = this._tiptapEditor;
                if (!ed) return;
                const chain = ed.chain().focus();
                switch (cmd) {
                    case 'bold': chain.toggleBold().run(); break;
                    case 'italic': chain.toggleItalic().run(); break;
                    case 'underline': chain.toggleUnderline().run(); break;
                    case 'strikeThrough': chain.toggleStrike().run(); break;
                    case 'highlight': chain.toggleHighlight().run(); break;
                    case 'code': chain.toggleCode().run(); break;
                    case 'insertUnorderedList': chain.toggleBulletList().run(); break;
                    case 'insertOrderedList': chain.toggleOrderedList().run(); break;
                    case 'justifyLeft': chain.setBlockAlign('left').run(); break;
                    case 'justifyCenter': chain.setBlockAlign('center').run(); break;
                    case 'justifyRight': chain.setBlockAlign('right').run(); break;
                    case 'insertHorizontalRule': chain.setHorizontalRule().run(); break;
                    case 'removeFormat': chain.unsetAllMarks().clearNodes().run(); break;
                    case 'undo': chain.undo().run(); break;
                    case 'redo': chain.redo().run(); break;
                    case 'addTableRow': chain.addRowAfter().run(); break;
                    case 'addTableCol': chain.addColumnAfter().run(); break;
                    case 'deleteTable': chain.deleteTable().run(); break;
                    default: break;
                }
                this.refreshActiveMarks(ed);
            },

            execFormatBlock(tag) {
                if (this.mode === 'html') {
                    this.showToast('Switch to Visual mode to change block styles.');
                    return;
                }
                const ed = this._tiptapEditor;
                if (!ed) return;
                const safeTag = tag.toLowerCase() === 'h1' ? 'h2' : tag.toLowerCase();
                const chain = ed.chain().focus();
                if (safeTag === 'p') chain.setParagraph().run();
                else if (safeTag === 'h2') chain.toggleHeading({ level: 2 }).run();
                else if (safeTag === 'h3') chain.toggleHeading({ level: 3 }).run();
                else if (safeTag === 'h4') chain.toggleHeading({ level: 4 }).run();
                else if (safeTag === 'blockquote') chain.toggleBlockquote().run();
                else if (safeTag === 'pre') chain.toggleCodeBlock().run();
                this.refreshActiveMarks(ed);
            },

            insertHtmlSnippet(html) {
                if (this.mode === 'html') {
                    const ta = this.$refs.htmlTextarea;
                    if (ta) {
                        const start = ta.selectionStart || this.content.length;
                        const end = ta.selectionEnd || start;
                        this.content = this.content.slice(0, start) + '\n' + html + '\n' + this.content.slice(end);
                    } else {
                        this.content = (this.content || '') + '\n' + html;
                    }
                    this.markDirtyAndScheduleSaves();
                    return;
                }
                if (this._tiptapEditor) {
                    this._tiptapEditor.chain().focus().insertContent(html).run();
                    this.flushContentToWire();
                    this.markDirtyAndScheduleSaves();
                }
            },

            scrollToEditorHeading(index) {
                if (this.mode !== 'visual') {
                    this.switchMode('visual');
                }
                this.$nextTick(() => {
                    if (!this.$refs.tiptapMount) return;
                    const headings = this.$refs.tiptapMount.querySelectorAll('h2, h3, h4');
                    const el = headings[index];
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.style.outline = '2px solid #2563eb';
                        el.style.borderRadius = '4px';
                        setTimeout(() => { el.style.outline = ''; }, 1400);
                    }
                });
            },

            // One-Click Custom SEO & TipTap Blocks
            insertBlock(type) {
                if (type === 'alsoRead') {
                    this.openAlsoReadModal();
                    return;
                }
                if (type === 'video') {
                    this.openVideoModal();
                    return;
                }

                if (this.mode === 'visual' && this._tiptapEditor) {
                    const ed = this._tiptapEditor;
                    if (type === 'table') {
                        ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                    } else if (type === 'faq') {
                        const initialFaqs = this.faqItems.length > 0
                            ? this.faqItems
                            : [{
                                q: 'How does ' + (this.focusKeyphrase || 'this strategy') + ' improve results?',
                                a: 'It aligns search intent with structured, high-converting user journeys to maximize qualified leads.',
                            }];
                        ed.chain().focus().insertContent({ type: 'faqBlock', attrs: { items: initialFaqs } }).run();
                    } else if (type === 'cta') {
                        ed.chain().focus().insertContent({ type: 'ctaButton' }).run();
                    } else if (type === 'toc') {
                        ed.chain().focus().insertContent({ type: 'tocBlock' }).run();
                    } else if (type === 'proTip') {
                        ed.chain().focus().insertContent({
                            type: 'callout',
                            attrs: { type: 'tip' },
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Pro Growth Tip: Use your primary focus keyphrase naturally in the opening 60 words and inside at least one H2 subheading.' }] }],
                        }).run();
                    } else if (type === 'takeaways') {
                        ed.chain().focus().insertContent({
                            type: 'callout',
                            attrs: { type: 'info' },
                            content: [
                                { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Key Takeaways' }] },
                                { type: 'bulletList', content: [
                                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Core insight backed by verified benchmarks.' }] }] },
                                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Actionable step for higher conversion ROI.' }] }] },
                                ] },
                            ],
                        }).run();
                    }
                    this.flushContentToWire();
                    this.markDirtyAndScheduleSaves();
                    this.showToast('Block inserted into article');
                    return;
                }

                let html = '';
                if (type === 'takeaways') {
                    html = `<div class="gif-callout gif-callout-info" data-callout="true" data-type="info"><p><strong>Key Takeaways<\/strong><\/p><ul><li>Core insight backed by verified industry benchmarks.<\/li><li>Actionable implementation step for higher conversion ROI.<\/li><\/ul><\/div>`;
                } else if (type === 'faq') {
                    if (this.faqItems.length === 0) {
                        this.faqItems.push({
                            q: 'How does ' + (this.focusKeyphrase || 'this strategy') + ' improve results?',
                            a: 'It aligns search intent with structured, high-converting user journeys to maximize qualified leads and organic visibility.',
                        });
                    }
                    html = `<div class="gif-faq-block" data-faq="true"><p><strong>Frequently Asked Questions<\/strong><\/p><div class="gif-faq-item"><h4>How does ${this.escapeHtml(this.focusKeyphrase || 'this strategy')} improve results?<\/h4><p>It aligns search intent with structured, high-converting user journeys to maximize qualified leads and organic visibility.<\/p><\/div><\/div>`;
                } else if (type === 'table') {
                    html = `<div class="gif-table-scroll"><table><thead><tr><th>Feature / Metric<\/th><th>Traditional Approach<\/th><th>Optimized Approach<\/th><\/tr><\/thead><tbody><tr><td>Execution Velocity<\/td><td>4–6 Weeks<\/td><td>7-Day Sprint<\/td><\/tr><tr><td>Conversion Impact<\/td><td>Baseline<\/td><td>+35% to +120% Lift<\/td><\/tr><\/tbody><\/table><\/div>`;
                } else if (type === 'cta') {
                    html = `<div class="gif-cta-block" data-cta="button"><p><strong>Ready to scale organic &amp; paid growth?<\/strong><\/p><a class="gif-cta-btn" data-cta="true" href="https://getintofeed.com/contact" target="_blank" rel="noopener noreferrer">Book Free Strategy Audit<\/a><\/div>`;
                } else if (type === 'toc') {
                    html = `<div class="gif-toc-block" data-toc="true" aria-label="Table of Contents"><p><strong>Table of Contents<\/strong><\/p><\/div>`;
                } else if (type === 'proTip') {
                    html = `<div class="gif-callout gif-callout-tip" data-callout="true" data-type="tip"><p><strong>Pro Growth Tip:<\/strong> Use your primary focus keyphrase naturally in the opening 60 words and inside at least one H2 subheading.<\/p><\/div>`;
                }

                this.insertHtmlSnippet(html);
                this.showToast('Block inserted into article');
            },

            // Also Read Internal Link Card Picker
            openAlsoReadModal() {
                this.saveSelection();
                this.alsoReadModal.open = true;
                this.alsoReadModal.search = this.focusKeyphrase || '';
                this.searchAlsoReadPosts();
            },

            searchAlsoReadPosts() {
                this.alsoReadModal.loading = true;
                const params = new URLSearchParams();
                if (this.alsoReadModal.search) params.set('q', this.alsoReadModal.search);
                if (this.recordId) params.set('exclude_id', String(this.recordId));

                fetch(this.internalLinksEndpoint + '?' + params.toString(), {
                    headers: { Accept: 'application/json' },
                })
                    .then((r) => r.json())
                    .then((data) => {
                        this.alsoReadModal.results = Array.isArray(data.posts) ? data.posts : [];
                    })
                    .catch(() => {
                        this.alsoReadModal.results = [];
                    })
                    .finally(() => {
                        this.alsoReadModal.loading = false;
                    });
            },

            insertAlsoReadCard(post) {
                if (!post || !post.url) return;
                const safeTitle = this.escapeHtml(post.title);
                const safeUrl = this.escapeHtml(post.url);
                const safeCat = this.escapeHtml(post.category || 'Related Guide');
                const html = `<div class="gif-also-read" style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:10px;padding:14px 18px;margin:22px 0;"><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#1d4ed8;margin-bottom:4px;">📖 Also Read · ${safeCat}<\/div><a href="${safeUrl}" style="color:#0f172a;font-weight:700;font-size:15px;text-decoration:underline;">${safeTitle} →<\/a><\/div><p><br><\/p>`;
                this.insertHtmlSnippet(html);
                this.alsoReadModal.open = false;
                this.showToast('Inserted "Also Read" internal link card');
            },

            uploadFileDirectlyToEditor(file, ed) {
                if (!file || !file.type.startsWith('image/')) return;
                if (file.size > 5 * 1024 * 1024) {
                    this.showToast('Dropped/pasted image exceeds 5 MB limit.');
                    return;
                }
                const derivedAlt = (file.name || 'article visual').replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim() || (this.focusKeyphrase || 'Article visual');
                const altText = window.prompt('Enter SEO Alt Text for uploaded image:', derivedAlt);
                if (altText === null || !altText.trim()) {
                    this.showToast('Upload cancelled — Alt text is required for editorial images.');
                    return;
                }

                this.autoSaveStatus = 'Uploading image...';
                const fd = new FormData();
                fd.append('image', file);
                fd.append('alt', altText.trim());

                fetch(this.uploadEndpoint, {
                    method: 'POST',
                    headers: { Accept: 'application/json', 'X-CSRF-TOKEN': this.csrfToken },
                    body: fd,
                })
                    .then(async (res) => {
                        const data = await res.json().catch(() => ({}));
                        if (!res.ok || !data.url) throw new Error(data.message || 'Upload failed');
                        return data;
                    })
                    .then((data) => {
                        if (ed) {
                            ed.chain().focus().insertContent({
                                type: 'imageFigure',
                                attrs: {
                                    src: data.url,
                                    alt: data.alt || altText.trim(),
                                    width: data.width || null,
                                    height: data.height || null,
                                    loading: 'lazy',
                                    srcset: data.srcset || null,
                                    mediaId: data.media_id || null,
                                },
                            }).run();
                        }
                        this.refreshMediaLibrary();
                        this.markDirtyAndScheduleSaves();
                        this.showToast('Image uploaded (WebP) & inserted!');
                    })
                    .catch((err) => {
                        this.showToast(err.message || 'Image upload failed');
                    });
            },

            // Media Modal (Auto-WebP Upload + Media Library Browser + Mandatory Alt Text)
            openMediaModal() {
                this.mediaModal.open = true;
                this.mediaModal.url = '';
                this.mediaModal.alt = this.focusKeyphrase ? (this.focusKeyphrase + ' guide visual') : '';
                this.mediaModal.caption = '';
                this.mediaModal.lazy = true;
                this.mediaModal.width = null;
                this.mediaModal.height = null;
                this.mediaModal.mediaId = null;
                this.mediaModal.srcset = null;
                this.mediaModal.sizeLabel = '';
                this.mediaModal.error = '';
                this.refreshMediaLibrary();
            },

            refreshMediaLibrary() {
                fetch(this.mediaListEndpoint, { headers: { Accept: 'application/json' } })
                    .then((r) => (r.ok ? r.json() : null))
                    .then((data) => {
                        if (data && Array.isArray(data.media)) {
                            this.mediaAssets = data.media;
                            data.media.forEach((m) => { this.mediaUrlMap[String(m.id)] = m.url; });
                        }
                    })
                    .catch(() => {});
            },

            get filteredMediaAssets() {
                const q = (this.mediaModal.search || '').trim().toLowerCase();
                if (!q) return this.mediaAssets;
                return this.mediaAssets.filter((m) =>
                    (m.name || '').toLowerCase().includes(q) || (m.alt || '').toLowerCase().includes(q)
                );
            },

            selectMediaFromLibrary(asset) {
                this.mediaModal.url = asset.url;
                this.mediaModal.alt = asset.alt || this.mediaModal.alt || '';
                this.mediaModal.width = asset.width || null;
                this.mediaModal.height = asset.height || null;
                this.mediaModal.sizeLabel = [asset.dimensions, asset.size].filter(Boolean).join(' · ');
                this.mediaModal.error = '';
            },

            handleMediaDrop(e) {
                this.mediaModal.isDragging = false;
                const files = e.dataTransfer?.files;
                if (files && files.length > 0) {
                    this.uploadEditorImage(files[0]);
                }
            },

            handleMediaFileInput(e) {
                const files = e.target?.files;
                if (files && files.length > 0) {
                    this.uploadEditorImage(files[0]);
                }
                e.target.value = '';
            },

            uploadEditorImage(file) {
                this.mediaModal.error = '';
                if (!file.type.startsWith('image/')) {
                    this.mediaModal.error = 'Please upload a valid image (JPG, PNG, WebP, or GIF).';
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    this.mediaModal.error = 'Image exceeds 5 MB limit.';
                    return;
                }

                this.mediaModal.isUploading = true;
                const fd = new FormData();
                fd.append('image', file);
                if (this.mediaModal.alt) {
                    fd.append('alt', this.mediaModal.alt);
                }

                fetch(this.uploadEndpoint, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': this.csrfToken,
                    },
                    body: fd,
                })
                    .then(async (res) => {
                        const data = await res.json().catch(() => ({}));
                        if (!res.ok || !data.url) {
                            throw new Error(data.message || data.error || 'Upload failed.');
                        }
                        return data;
                    })
                    .then((data) => {
                        this.mediaModal.url = data.url;
                        this.mediaModal.width = data.width || null;
                        this.mediaModal.height = data.height || null;
                        this.mediaModal.mediaId = data.media_id || null;
                        this.mediaModal.srcset = data.srcset || null;
                        this.mediaModal.sizeLabel = (data.width && data.height ? `${data.width}×${data.height}px · ` : '') + (data.formatted_size || `${Math.round((data.size || 0) / 1024)} KB`) + ' (WebP)';
                        if (!this.mediaModal.alt && data.alt) {
                            this.mediaModal.alt = data.alt;
                        }
                        this.refreshMediaLibrary();
                        this.showToast('Image compressed to WebP & ready to insert!');
                    })
                    .catch((err) => {
                        this.mediaModal.error = err.message || 'Network upload error.';
                    })
                    .finally(() => {
                        this.mediaModal.isUploading = false;
                    });
            },

            insertMediaAsset() {
                if (!this.mediaModal.url.trim()) {
                    this.mediaModal.error = 'Upload an image, select one from the library, or enter an image URL.';
                    return;
                }
                if (!this.mediaModal.alt.trim()) {
                    this.mediaModal.error = 'SEO Alt Text is mandatory before inserting an image.';
                    return;
                }

                if (this.mode === 'visual' && this._tiptapEditor) {
                    this._tiptapEditor.chain().focus().insertContent({
                        type: 'imageFigure',
                        attrs: {
                            src: this.mediaModal.url.trim(),
                            alt: this.mediaModal.alt.trim(),
                            caption: this.mediaModal.caption.trim(),
                            width: this.mediaModal.width || null,
                            height: this.mediaModal.height || null,
                            loading: this.mediaModal.lazy ? 'lazy' : 'eager',
                            srcset: this.mediaModal.srcset || null,
                            mediaId: this.mediaModal.mediaId || null,
                        },
                    }).run();
                    this.flushContentToWire();
                    this.markDirtyAndScheduleSaves();
                    this.mediaModal.open = false;
                    this.showToast('Media inserted with SEO Alt Text & lazy loading');
                    return;
                }

                const src = this.escapeHtml(this.mediaModal.url.trim());
                const alt = this.escapeHtml(this.mediaModal.alt.trim());
                const lazyAttr = this.mediaModal.lazy ? ' loading="lazy"' : '';
                const dimAttrs = (this.mediaModal.width && this.mediaModal.height)
                    ? ` width="${Number(this.mediaModal.width)}" height="${Number(this.mediaModal.height)}"`
                    : '';

                let html = `<figure class="gif-image-figure"><img src="${src}" alt="${alt}"${lazyAttr}${dimAttrs} />`;
                if (this.mediaModal.caption.trim()) {
                    html += `<figcaption>${this.escapeHtml(this.mediaModal.caption.trim())}<\/figcaption>`;
                }
                html += `<\/figure>`;

                this.insertHtmlSnippet(html);
                this.mediaModal.open = false;
                this.showToast('Media inserted with SEO Alt Text & lazy loading');
            },

            // Link Modal (with Quick Internal Post Search + Nofollow + Target Blank)
            openLinkModal() {
                this.linkModal.url = '';
                this.linkModal.text = '';
                this.linkModal.newTab = false;
                this.linkModal.nofollow = false;
                this.linkModal.search = '';

                if (this._tiptapEditor) {
                    const { from, to } = this._tiptapEditor.state.selection;
                    this.linkModal.text = this._tiptapEditor.state.doc.textBetween(from, to, ' ');
                    const attrs = this._tiptapEditor.getAttributes('link');
                    if (attrs && attrs.href) this.linkModal.url = attrs.href;
                }

                this.linkModal.open = true;
                this.searchLinkTargets();
            },

            searchLinkTargets() {
                this.linkModal.loading = true;
                const params = new URLSearchParams();
                if (this.linkModal.search) params.set('q', this.linkModal.search);
                if (this.recordId) params.set('exclude_id', String(this.recordId));

                fetch(this.internalLinksEndpoint + '?' + params.toString(), {
                    headers: { Accept: 'application/json' },
                })
                    .then((r) => r.json())
                    .then((data) => {
                        this.linkModal.results = Array.isArray(data.posts) ? data.posts : [];
                    })
                    .catch(() => { this.linkModal.results = []; })
                    .finally(() => { this.linkModal.loading = false; });
            },

            pickInternalLinkForModal(post) {
                this.linkModal.url = post.url;
                if (!this.linkModal.text.trim()) {
                    this.linkModal.text = post.title;
                }
                this.linkModal.newTab = false;
                this.linkModal.nofollow = false;
            },

            insertLink() {
                const rawUrl = (this.linkModal.url || '').trim();
                if (!rawUrl) {
                    alert('Please enter a destination URL');
                    return;
                }
                const anchor = this.escapeHtml((this.linkModal.text || '').trim() || rawUrl);
                const safeUrl = this.escapeHtml(rawUrl);

                const relParts = [];
                if (this.linkModal.newTab) {
                    relParts.push('noopener', 'noreferrer');
                }
                if (this.linkModal.nofollow) {
                    relParts.push('nofollow');
                }

                const targetAttr = this.linkModal.newTab ? ' target="_blank"' : '';
                const relAttr = relParts.length > 0 ? ` rel="${relParts.join(' ')}"` : '';

                if (this.mode === 'visual' && this._tiptapEditor) {
                    const ed = this._tiptapEditor;
                    const { from, to } = ed.state.selection;
                    const linkAttrs = {
                        href: rawUrl,
                        target: this.linkModal.newTab ? '_blank' : null,
                        rel: relParts.length > 0 ? relParts.join(' ') : null,
                    };
                    if (from === to) {
                        ed.chain().focus().insertContent(`<a href="${safeUrl}"${targetAttr}${relAttr}>${anchor}<\/a>`).run();
                    } else {
                        ed.chain().focus().extendMarkRange('link').setLink(linkAttrs).run();
                    }
                    this.flushContentToWire();
                    this.markDirtyAndScheduleSaves();
                    this.linkModal.open = false;
                    this.showToast('Hyperlink inserted');
                    return;
                }

                const html = `<a href="${safeUrl}"${targetAttr}${relAttr}>${anchor}<\/a>`;

                this.insertHtmlSnippet(html);
                this.linkModal.open = false;
                this.showToast('Hyperlink inserted');
            },

            openVideoModal() {
                this.videoModal.open = true;
                this.videoModal.url = '';
                this.videoModal.title = 'Article Video';
                this.videoModal.error = '';
            },

            insertVideoEmbed() {
                const rawUrl = (this.videoModal.url || '').trim();
                const normalized = window.GetIntoFeedTipTap
                    ? window.GetIntoFeedTipTap.normalizeVideoEmbedUrl(rawUrl)
                    : null;
                if (!normalized) {
                    this.videoModal.error = 'Enter a valid HTTPS YouTube or Vimeo video URL.';
                    return;
                }
                const title = (this.videoModal.title || 'Embedded Video').trim();
                if (this.mode === 'visual' && this._tiptapEditor) {
                    this._tiptapEditor.chain().focus().insertContent({
                        type: 'videoEmbed',
                        attrs: { src: normalized, title },
                    }).run();
                    this.flushContentToWire();
                    this.markDirtyAndScheduleSaves();
                } else {
                    this.insertHtmlSnippet(`<figure class="gif-video-embed" data-video-embed="true"><iframe src="${this.escapeHtml(normalized)}" title="${this.escapeHtml(title)}" loading="lazy" allowfullscreen="allowfullscreen"><\/iframe><\/figure>`);
                }
                this.videoModal.open = false;
                this.showToast('Video embed inserted safely');
            },

            // Smart Internal Linking Suggestions (SEO Studio PRO)
            fetchInternalSuggestions() {
                this.internalLoading = true;
                const q = (this.internalSearchQuery || this.focusKeyphrase || this.title || '').trim();
                const params = new URLSearchParams();
                if (q) params.set('q', q);
                if (this.recordId) params.set('exclude_id', String(this.recordId));

                fetch(this.internalLinksEndpoint + '?' + params.toString(), {
                    headers: { Accept: 'application/json' },
                })
                    .then((r) => r.json())
                    .then((data) => {
                        this.internalSuggestions = Array.isArray(data.posts) ? data.posts : [];
                    })
                    .catch(() => {
                        this.internalSuggestions = [];
                    })
                    .finally(() => {
                        this.internalLoading = false;
                    });
            },

            insertContextualInternalLink(post) {
                const safeUrl = this.escapeHtml(post.url);
                const safeTitle = this.escapeHtml(post.title);
                const html = `<p>Related guide: <a href="${safeUrl}">${safeTitle}<\/a>.<\/p>`;
                this.insertHtmlSnippet(html);
                this.showToast('Internal link inserted into article');
            },

            // Secondary / LSI Keywords with live occurrence counters
            addLsiKeyword() {
                const raw = (this.newLsiInput || '').trim();
                if (!raw) return;
                raw.split(',').forEach((piece) => {
                    const kw = piece.trim().toLowerCase();
                    if (kw && !this.secondaryKeyphrases.some((k) => String(k).toLowerCase() === kw)) {
                        this.secondaryKeyphrases.push(kw);
                    }
                });
                this.newLsiInput = '';
                this.runFullAnalysis();
            },

            removeLsiKeyword(idx) {
                this.secondaryKeyphrases.splice(idx, 1);
                this.runFullAnalysis();
            },

            getLsiCount(kw) {
                if (!kw) return 0;
                const plain = this.stripHtmlToText(this.content).toLowerCase();
                const escaped = String(kw).trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                if (!escaped) return 0;
                const matches = plain.match(new RegExp('\\b' + escaped + '\\b', 'gi'));
                return matches ? matches.length : 0;
            },

            // FAQ Builder
            addFaqItem() {
                this.faqItems.push({ q: '', a: '' });
                this.scheduleAudit();
            },

            removeFaqItem(idx) {
                this.faqItems.splice(idx, 1);
                this.scheduleAudit();
            },

            insertFaqBlockIntoArticle() {
                const valid = (this.faqItems || []).filter((i) => i && i.q && i.a);
                if (valid.length === 0) {
                    this.showToast('Add at least one complete Question & Answer first.');
                    return;
                }
                let html = `<div class="gif-block-faq" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:22px;margin:28px 0;"><h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-top:0;margin-bottom:16px;">Frequently Asked Questions<\/h2>`;
                valid.forEach((item) => {
                    html += `<div style="margin-bottom:14px;border-bottom:1px solid #f1f5f9;padding-bottom:12px;"><h3 style="font-size:16px;font-weight:700;color:#1e3a8a;margin:0 0 6px 0;">${this.escapeHtml(item.q)}<\/h3><p style="margin:0;color:#475569;font-size:14.5px;line-height:1.65;">${this.escapeHtml(item.a)}<\/p><\/div>`;
                });
                html += `<\/div><p><br><\/p>`;
                this.insertHtmlSnippet(html);
                this.showToast('FAQ section embedded into article body');
            },

            // Live JSON-LD Computed Preview
            get computedJsonLdString() {
                const canonical = (this.canonicalUrl || '').trim() || ('https://getintofeed.com/blog/' + (this.slug || 'article-slug'));
                const headline = (this.title || this.seoTitle || 'Article Title').trim();
                const desc = (this.metaDescription || this.excerpt || '').trim() || 'GetIntoFeed Growth Guide';
                const image = this.featuredImageUrl || 'https://getintofeed.com/agency-hero.jpg';
                const schemaChoice = this.schemaType || 'BlogPosting';
                const kType = '@' + 'type';
                const kId = '@' + 'id';
                const kContext = '@' + 'context';
                const kGraph = '@' + 'graph';

                const publisher = {
                    [kType]: 'Organization',
                    [kId]: 'https://getintofeed.com/#organization',
                    name: 'GetIntoFeed',
                    url: 'https://getintofeed.com/',
                    logo: { [kType]: 'ImageObject', url: 'https://getintofeed.com/favicon.svg' },
                };

                let primaryNode;
                if (schemaChoice === 'HowTo') {
                    primaryNode = {
                        [kType]: 'HowTo',
                        [kId]: canonical + '#howto',
                        name: headline,
                        description: desc,
                        image: [image],
                        url: canonical,
                        totalTime: 'PT' + Math.max(1, this.stats.readingTime) + 'M',
                        publisher,
                    };
                } else {
                    primaryNode = {
                        [kType]: schemaChoice === 'FAQPage' ? 'BlogPosting' : schemaChoice,
                        [kId]: canonical + '#article',
                        headline,
                        description: desc,
                        image: [image],
                        url: canonical,
                        wordCount: this.stats.words,
                        publisher,
                        mainEntityOfPage: { [kType]: 'WebPage', [kId]: canonical },
                    };
                }

                const graph = [
                    primaryNode,
                    {
                        [kType]: 'BreadcrumbList',
                        [kId]: canonical + '#breadcrumb',
                        itemListElement: [
                            { [kType]: 'ListItem', position: 1, name: 'Home', item: 'https://getintofeed.com/' },
                            { [kType]: 'ListItem', position: 2, name: 'Blog', item: 'https://getintofeed.com/blog' },
                            { [kType]: 'ListItem', position: 3, name: headline, item: canonical },
                        ],
                    },
                ];

                const validFaqs = (this.faqItems || []).filter((i) => i && String(i.q || '').trim() && String(i.a || '').trim());
                if (validFaqs.length > 0) {
                    graph.push({
                        [kType]: 'FAQPage',
                        [kId]: canonical + '#faq',
                        mainEntity: validFaqs.map((item) => ({
                            [kType]: 'Question',
                            name: String(item.q).trim(),
                            acceptedAnswer: {
                                [kType]: 'Answer',
                                text: String(item.a).trim(),
                            },
                        })),
                    });
                }

                return JSON.stringify({ [kContext]: 'https://schema.org', [kGraph]: graph }, null, 2);
            },

            copyJsonLd() {
                const payload = this.computedJsonLdString;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(payload).then(() => this.showToast('JSON-LD copied to clipboard!')).catch(() => {});
                } else {
                    const ta = document.createElement('textarea');
                    ta.value = payload;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    this.showToast('JSON-LD copied to clipboard!');
                }
            },

            // Auto-Optimize Meta & Quick Fixes
            autoOptimizeMeta() {
                const kw = (this.focusKeyphrase || '').trim();
                const baseTitle = (this.title || '').trim();
                const plain = this.stripHtmlToText(this.content);

                if (baseTitle) {
                    let candidate = baseTitle;
                    if (kw && !candidate.toLowerCase().includes(kw.toLowerCase())) {
                        candidate = kw.charAt(0).toUpperCase() + kw.slice(1) + ': ' + candidate;
                    }
                    if (candidate.length <= 45) {
                        candidate += ' | GetIntoFeed';
                    } else if (candidate.length > 60) {
                        candidate = candidate.slice(0, 57).trim() + '...';
                    }
                    this.seoTitle = candidate;
                }

                const sourceDesc = (this.excerpt || '').trim() || plain;
                if (sourceDesc) {
                    let desc = sourceDesc;
                    if (kw && !desc.toLowerCase().slice(0, 155).includes(kw.toLowerCase())) {
                        desc = `Learn ${kw}: ` + desc;
                    }
                    desc = desc.slice(0, 156).trim();
                    if (desc.length > 140 && !desc.endsWith('.')) {
                        desc = desc.replace(/\s+\S*$/, '') + '.';
                    }
                    this.metaDescription = desc;
                }

                if (!this.canonicalUrl && this.slug) {
                    this.canonicalUrl = 'https://getintofeed.com/blog/' + this.slug;
                }

                this.runFullAnalysis();
                this.showToast('SEO Title & Meta Description auto-optimized!');
            },

            runQuickFix(action) {
                const kw = (this.focusKeyphrase || '').trim();
                if (action === 'focusKeyphraseInput') {
                    this.seoTab = 'audit';
                    this.$nextTick(() => this.$refs.focusKeyphraseInput?.focus());
                } else if (action === 'kwInTitle' || action === 'autoOptimizeTitle') {
                    const base = (this.title || 'Growth Guide').trim();
                    let next = kw && !base.toLowerCase().includes(kw.toLowerCase())
                        ? (kw.charAt(0).toUpperCase() + kw.slice(1) + ' — ' + base)
                        : base;
                    if (next.length <= 45) next += ' | GetIntoFeed';
                    if (next.length > 60) next = next.slice(0, 57).trim() + '...';
                    this.seoTitle = next;
                    this.runFullAnalysis();
                    this.showToast('Optimized SEO Title');
                } else if (action === 'fixSlug') {
                    const baseSlug = this.slugify(kw ? (kw + ' ' + (this.title || '')) : (this.title || ''));
                    if (baseSlug) {
                        this.slug = baseSlug.slice(0, 75).replace(/-+$/, '');
                        this.tempSlug = this.slug;
                        this.slugCustomized = true;
                        this.runFullAnalysis();
                        this.showToast('Updated URL slug with focus keyphrase');
                    }
                } else if (action === 'autoOptimizeMeta') {
                    this.autoOptimizeMeta();
                } else if (action === 'openMediaModal') {
                    this.openMediaModal();
                } else if (action === 'openAlsoReadModal') {
                    this.openAlsoReadModal();
                } else if (action === 'openLinkModal') {
                    this.openLinkModal();
                } else if (action === 'fixBodyH1') {
                    this.content = (this.content || '')
                        .replace(/<h1(\b[^>]*)>/gi, '<h2$1>')
                        .replace(/<\/h1>/gi, '<\/h2>');
                    if (this.mode === 'visual' && this._tiptapEditor) {
                        this._tiptapEditor.commands.setContent(this.content, false);
                    }
                    this.runFullAnalysis();
                    this.showToast('Converted body h1 headings to h2 for strict SEO hierarchy');
                } else if (action === 'fixCanonical') {
                    this.canonicalUrl = 'https://getintofeed.com/blog/' + (this.slug || this.slugify(this.title) || 'post');
                    this.runFullAnalysis();
                    this.showToast('Set Canonical URL to primary post URL');
                } else if (action === 'goToFaqBuilder') {
                    this.seoTab = 'schema';
                    if (this.faqItems.length === 0) {
                        this.addFaqItem();
                    }
                    this.showToast('Opened FAQ Schema Builder');
                } else if (action === 'focusLsiInput') {
                    this.seoTab = 'audit';
                    this.$nextTick(() => this.$refs.lsiInput?.focus());
                }
            },

            // Helper: HTML stripping & Readability engines
            stripHtmlToText(html) {
                if (!html) return '';
                const spaced = String(html)
                    .replace(/<\/(h[1-6]|p|div|li|tr|td|th|blockquote)>/gi, ' ')
                    .replace(/<(br|hr)\s*\/?>/gi, ' ');
                const tmp = document.createElement('div');
                tmp.innerHTML = spaced;
                return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
            },

            countSyllables(word) {
                const w = String(word || '').toLowerCase().replace(/[^a-z]/g, '');
                if (!w) return 0;
                if (w.length <= 3) return 1;
                let syl = w
                    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
                    .replace(/^y/, '')
                    .match(/[aeiouy]{1,2}/g);
                return syl ? Math.max(1, syl.length) : 1;
            },

            extractOutline(html) {
                const list = [];
                const regex = /<h([2-4])\b[^>]*>(.*?)<\/h\1>/gi;
                let m;
                while ((m = regex.exec(html || '')) !== null) {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = m[2] || '';
                    const text = (tmp.textContent || tmp.innerText || '').trim();
                    if (text) list.push({ level: Number(m[1]), text });
                }
                return list;
            },

            scheduleAudit() {
                clearTimeout(this._auditTimer);
                this._auditTimer = setTimeout(() => this.runFullAnalysis(), 150);
            },

            runFullAnalysis() {
                const html = this.content || '';
                const plain = this.stripHtmlToText(html);
                const wordsArr = plain ? plain.split(/\s+/).filter(Boolean) : [];
                const words = wordsArr.length;

                // Counts
                this.stats.words = words;
                this.stats.readingTime = Math.max(1, Math.ceil(words / 200));
                this.wordCount = words;
                this.readingTime = this.stats.readingTime;

                const outline = this.extractOutline(html);
                this.stats.headings = outline.length;

                // Internal vs External links
                const hrefMatches = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)];
                let intLinks = 0;
                let extLinks = 0;
                hrefMatches.forEach((m) => {
                    const href = (m[1] || '').trim().toLowerCase();
                    if (!href || href.startsWith('#')) return;
                    if (href.startsWith('/') || href.includes('getintofeed.com')) {
                        intLinks++;
                    } else if (href.startsWith('http://') || href.startsWith('https://')) {
                        extLinks++;
                    }
                });
                this.stats.internalLinks = intLinks;
                this.stats.externalLinks = extLinks;
                this.stats.totalLinks = intLinks + extLinks;

                // Readability Analysis
                const sentences = plain
                    .split(/[.!?]+/)
                    .map((s) => s.trim())
                    .filter((s) => s.length > 2);
                const sentenceCount = Math.max(1, sentences.length);
                this.avgSentenceLength = words > 0 ? parseFloat((words / sentenceCount).toFixed(1)) : 0;

                let totalSyllables = 0;
                wordsArr.forEach((w) => { totalSyllables += this.countSyllables(w); });
                const asw = words > 0 ? (totalSyllables / words) : 1.5;
                const rawFlesch = words > 0 ? Math.round(206.835 - (1.015 * this.avgSentenceLength) - (84.6 * asw)) : 0;
                this.fleschScore = words > 0 ? Math.max(0, Math.min(100, rawFlesch)) : 0;

                if (words === 0) this.readabilityLabel = 'Not available';
                else if (this.fleschScore >= 70) this.readabilityLabel = 'Very Easy';
                else if (this.fleschScore >= 60) this.readabilityLabel = 'Good';
                else if (this.fleschScore >= 45) this.readabilityLabel = 'Fair';
                else this.readabilityLabel = 'Complex';

                // Passive Voice %
                let passiveCount = 0;
                const passiveRegex = /\b(am|is|are|was|were|be|been|being)\s+[a-z]+(ed|en)\b/i;
                sentences.forEach((s) => { if (passiveRegex.test(s)) passiveCount++; });
                this.passiveVoicePct = sentences.length > 0 ? parseFloat(((passiveCount / sentences.length) * 100).toFixed(1)) : 0;

                // Transition Words %
                const transitionRegex = /\b(however|therefore|additionally|instead|furthermore|moreover|consequently|meanwhile|nevertheless|nonetheless|because|although|since|while|similarly|specifically|finally|first|second|third|for example|for instance|in addition|as a result|in contrast|on the other hand|in summary)\b/i;
                let transitionCount = 0;
                sentences.forEach((s) => { if (transitionRegex.test(s)) transitionCount++; });
                this.transitionWordsPct = sentences.length > 0 ? parseFloat(((transitionCount / sentences.length) * 100).toFixed(1)) : 0;

                // Long Paragraph Warnings (> 120 words)
                const longParas = [];
                const pMatches = [...html.matchAll(/<p\b[^>]*>(.*?)<\/p>/gis)];
                pMatches.forEach((m, idx) => {
                    const pText = this.stripHtmlToText(m[1]);
                    const pWords = pText ? pText.split(/\s+/).filter(Boolean).length : 0;
                    if (pWords > 120) {
                        longParas.push({
                            index: idx + 1,
                            words: pWords,
                            preview: pText.slice(0, 90) + '...',
                        });
                    }
                });
                this.longParagraphs = longParas;

                // Keyword Density
                const kw = (this.focusKeyphrase || '').trim().toLowerCase();
                const safeTotalWords = Math.max(1, words);
                if (kw && words > 0) {
                    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const matches = plain.toLowerCase().match(new RegExp('\\b' + escaped + '\\b', 'gi'));
                    this.keywordCount = matches ? matches.length : 0;
                    this.keywordDensity = parseFloat(((this.keywordCount / safeTotalWords) * 100).toFixed(2));
                } else {
                    this.keywordCount = 0;
                    this.keywordDensity = 0;
                }

                // LSI usage
                let lsiUsed = 0;
                (this.secondaryKeyphrases || []).forEach((k) => {
                    if (this.getLsiCount(k) > 0) lsiUsed++;
                });
                this.usedLsiCount = lsiUsed;

                // SERP Pixel Width
                const effectiveTitle = (this.seoTitle || this.title || '').trim();
                this.seoTitlePx = this.measurePixelWidth(effectiveTitle);

                // ── 14-POINT LIVE SEO AUDIT ──────────────────────────────────────
                const crit = [];
                const tips = [];
                const pass = [];

                // 1. Focus Keyphrase Defined
                if (kw) {
                    pass.push({ label: `Focus keyphrase set: "${kw}"` });
                } else {
                    crit.push({ label: 'No Primary Focus Keyphrase set yet', action: 'focusKeyphraseInput', fixLabel: 'Set Keyphrase' });
                }

                // 2. Keyphrase in SEO Title / H1
                const seoTitleLower = (this.seoTitle || '').toLowerCase();
                const h1Lower = (this.title || '').toLowerCase();
                if (kw && (seoTitleLower.includes(kw) || h1Lower.includes(kw))) {
                    pass.push({ label: 'Focus keyphrase appears in Title' });
                } else if (kw) {
                    crit.push({ label: 'Focus keyphrase missing from SEO Title', action: 'kwInTitle', fixLabel: 'Fix Title' });
                }

                // 3. Keyphrase in URL Slug
                const slugNorm = (this.slug || '').toLowerCase().replace(/-/g, ' ');
                if (kw && slugNorm.includes(kw)) {
                    pass.push({ label: 'Focus keyphrase appears in URL slug' });
                } else if (kw) {
                    tips.push({ label: 'URL slug does not include the focus keyphrase', action: 'fixSlug', fixLabel: 'Fix Slug' });
                }

                // 4. Keyphrase in First Paragraph / Intro
                const introChunk = plain.slice(0, Math.max(320, Math.floor(plain.length * 0.1))).toLowerCase();
                if (kw && introChunk.includes(kw)) {
                    pass.push({ label: 'Focus keyphrase appears in the opening paragraph' });
                } else if (kw) {
                    tips.push({ label: 'Mention focus keyphrase naturally in the opening 60 words' });
                }

                // 5. Keyphrase in H2/H3 Subheadings
                const subheadingsText = outline.map((h) => h.text.toLowerCase()).join(' ');
                if (kw && subheadingsText.includes(kw)) {
                    pass.push({ label: 'Focus keyphrase included in H2/H3 subheadings' });
                } else if (kw) {
                    tips.push({ label: 'Add your focus keyphrase to at least one H2 or H3 subheading' });
                }

                // 6. Keyword Density (0.5% - 2.5%)
                if (kw && this.keywordDensity >= 0.5 && this.keywordDensity <= 2.5) {
                    pass.push({ label: `Optimal keyword density (${this.keywordDensity}%, ${this.keywordCount}x)` });
                } else if (kw && this.keywordDensity > 2.5) {
                    crit.push({ label: `Keyword stuffing risk: ${this.keywordDensity}% density (target 0.5%–2.5%)` });
                } else if (kw) {
                    tips.push({ label: `Low keyword density (${this.keywordDensity}%). Target 0.5%–2.5%` });
                }

                // 7. Secondary / LSI Coverage
                if ((this.secondaryKeyphrases || []).length === 0) {
                    tips.push({ label: 'Add 2–4 Secondary / LSI keywords to strengthen topical coverage', action: 'focusLsiInput', fixLabel: 'Add LSI' });
                } else if (this.usedLsiCount === this.secondaryKeyphrases.length) {
                    pass.push({ label: `All ${this.usedLsiCount} Secondary/LSI keywords used in content` });
                } else {
                    tips.push({ label: `${this.usedLsiCount}/${this.secondaryKeyphrases.length} Secondary/LSI keywords used in body` });
                }

                // 8. Word Count / Content Depth
                if (words >= 600) {
                    pass.push({ label: `Strong editorial depth (${words} words)` });
                } else if (words >= 300) {
                    tips.push({ label: `${words} words written — expand to 600+ words for competitive ranking` });
                } else {
                    crit.push({ label: `Thin content: only ${words} words (minimum 300 required)` });
                }

                // 9. SEO Title Length (38-60 chars & <= 580px)
                const sTitleLen = (this.seoTitle || '').trim().length;
                if (sTitleLen >= 38 && sTitleLen <= 60 && this.seoTitlePx <= 580) {
                    pass.push({ label: `SEO Title length & pixel width optimal (${sTitleLen} chars · ${this.seoTitlePx}px)` });
                } else if (sTitleLen === 0) {
                    crit.push({ label: 'SEO Title is empty', action: 'autoOptimizeTitle', fixLabel: 'Auto-Title' });
                } else if (sTitleLen > 60 || this.seoTitlePx > 580) {
                    tips.push({ label: `SEO Title too wide (${sTitleLen} chars · ${this.seoTitlePx}px / 580px max)`, action: 'autoOptimizeTitle', fixLabel: 'Trim Title' });
                } else {
                    tips.push({ label: `SEO Title too short (${sTitleLen} chars — target 38–60 chars)`, action: 'autoOptimizeTitle', fixLabel: 'Auto-Title' });
                }

                // 10. Meta Description Length & Keyphrase
                const mDescLen = (this.metaDescription || '').trim().length;
                if (mDescLen >= 120 && mDescLen <= 160 && (!kw || this.metaDescription.toLowerCase().includes(kw))) {
                    pass.push({ label: `Meta description optimal (${mDescLen} chars)` });
                } else if (mDescLen === 0) {
                    crit.push({ label: 'Meta description is missing', action: 'autoOptimizeMeta', fixLabel: 'Auto-Meta' });
                } else if (mDescLen > 160) {
                    tips.push({ label: `Meta description exceeds 160 chars (${mDescLen})`, action: 'autoOptimizeMeta', fixLabel: 'Optimize' });
                } else {
                    tips.push({ label: `Meta description ${mDescLen < 120 ? 'short (' + mDescLen + ' chars)' : 'missing focus keyphrase'}`, action: 'autoOptimizeMeta', fixLabel: 'Optimize' });
                }

                // 11. Images & Mandatory SEO Alt Text (body + featured)
                const imgMatches = html.match(/<img\b[^>]*>/gi) || [];
                const bodyMissingAlt = imgMatches.filter((tag) => !/alt=["'][^"']+["']/i.test(tag)).length;
                const hasFeaturedAlt = Boolean(this.featuredMediaId && (this.featuredImageAlt || '').trim());
                if (bodyMissingAlt > 0) {
                    crit.push({ label: `${bodyMissingAlt} body image(s) missing SEO Alt Text`, action: 'openMediaModal', fixLabel: 'Add Image' });
                } else if (imgMatches.length > 0 && hasFeaturedAlt) {
                    pass.push({ label: `Featured image & ${imgMatches.length} body image(s) have SEO Alt Text` });
                } else if (imgMatches.length > 0 || hasFeaturedAlt) {
                    tips.push({ label: hasFeaturedAlt ? 'Embed at least 1 in-article visual with Alt Text' : 'Add Featured Image SEO Alt Text in the right sidebar', action: 'openMediaModal', fixLabel: 'Insert Media' });
                } else {
                    tips.push({ label: 'No images with Alt Text added yet', action: 'openMediaModal', fixLabel: 'Insert Media' });
                }

                // 12. Internal & External Links
                if (intLinks >= 1 && extLinks >= 1) {
                    pass.push({ label: `Healthy link profile (${intLinks} internal · ${extLinks} external)` });
                } else if (intLinks === 0) {
                    tips.push({ label: 'Add at least 1 internal link to another GetIntoFeed article', action: 'openAlsoReadModal', fixLabel: 'Add Internal Link' });
                } else {
                    tips.push({ label: 'Add 1 authoritative external citation link', action: 'openLinkModal', fixLabel: 'Insert Link' });
                }

                // 13. Heading Hierarchy (No H1 in body)
                const hasBodyH1 = /<h1\b[^>]*>/i.test(html);
                if (hasBodyH1) {
                    crit.push({ label: 'H1 tag found inside body — convert to H2 for SEO hierarchy', action: 'fixBodyH1', fixLabel: 'Convert to H2' });
                } else if (outline.length >= 2 || words < 250) {
                    pass.push({ label: 'Clean H2–H4 hierarchy (zero duplicate H1 tags)' });
                } else {
                    tips.push({ label: 'Add at least 2 H2/H3 subheadings to structure the post' });
                }

                // 14. Canonical URL & FAQ Schema Readiness
                const validFaqsCount = (this.faqItems || []).filter((i) => i && i.q && i.a).length;
                if (this.canonicalUrl && validFaqsCount > 0) {
                    pass.push({ label: `Canonical URL & FAQ Schema (${validFaqsCount} FAQs) configured` });
                } else if (!this.canonicalUrl) {
                    tips.push({ label: 'Canonical URL not explicitly set', action: 'fixCanonical', fixLabel: 'Set Canonical' });
                } else {
                    tips.push({ label: 'Add 2–4 FAQ Schema items for Google Rich Results', action: 'goToFaqBuilder', fixLabel: 'Add FAQ' });
                }

                this.criticalIssues = crit;
                this.recommendedTips = tips;
                this.passedChecks = pass;

                // ── 4-PILLAR SCORES ───────────────────────────────────────────────
                this.pillarScore.basic =
                    (kw ? 25 : 0) +
                    (kw && (seoTitleLower.includes(kw) || h1Lower.includes(kw)) ? 25 : 0) +
                    (kw && slugNorm.includes(kw) ? 25 : 0) +
                    (kw && introChunk.includes(kw) ? 25 : 0);

                this.pillarScore.titleMeta =
                    (sTitleLen >= 38 && sTitleLen <= 60 ? 35 : (sTitleLen > 0 ? 15 : 0)) +
                    (mDescLen >= 120 && mDescLen <= 160 ? 35 : (mDescLen > 0 ? 15 : 0)) +
                    (kw && (this.metaDescription || '').toLowerCase().includes(kw) ? 15 : 0) +
                    (this.canonicalUrl ? 15 : 0);

                this.pillarScore.contentLsi =
                    (words >= 600 ? 35 : (words >= 300 ? 20 : (words >= 100 ? 8 : 0))) +
                    (kw && this.keywordDensity >= 0.5 && this.keywordDensity <= 2.5 ? 25 : (kw && this.keywordCount > 0 ? 10 : 0)) +
                    (!hasBodyH1 && (outline.length >= 2 || words < 250) ? 20 : 8) +
                    ((this.usedLsiCount >= 1 ? 10 : 0) + (this.fleschScore >= 55 ? 10 : 0));

                this.pillarScore.linksTech =
                    (intLinks >= 1 ? 30 : 0) +
                    (extLinks >= 1 ? 20 : 0) +
                    ((imgMatches.length > 0 && bodyMissingAlt === 0) || hasFeaturedAlt ? 25 : 5) +
                    ((this.robotsIndex ? 10 : 0) + (validFaqsCount > 0 ? 15 : 5));

                const composite = Math.round(
                    this.pillarScore.basic * 0.30 +
                    this.pillarScore.titleMeta * 0.25 +
                    this.pillarScore.contentLsi * 0.25 +
                    this.pillarScore.linksTech * 0.20
                );
                this.seoScore = Math.max(0, Math.min(100, composite));

                // Notify Sticky Sidebar Publish Box & Article Outline TOC
                window.dispatchEvent(new CustomEvent('gif-editor-updated', {
                    detail: {
                        words: this.stats.words,
                        readingTime: this.stats.readingTime,
                        seoScore: this.seoScore,
                        readabilityLabel: this.readabilityLabel,
                        fleschScore: this.fleschScore,
                        slug: this.slug,
                        headings: outline,
                        hasH1Warning: hasBodyH1,
                    },
                }));
            },

            // Auto-Save Local Backup Helpers
            localStorageKey() {
                return 'gif_editorial_draft_' + (this.recordId || 'create');
            },

            scheduleLocalSave() {
                clearTimeout(this._localSaveTimer);
                this._localSaveTimer = setTimeout(() => {
                    try {
                        const payload = {
                            title: this.title,
                            slug: this.slug,
                            content: this.content,
                            excerpt: this.excerpt,
                            savedAt: new Date().toISOString(),
                        };
                        localStorage.setItem(this.localStorageKey(), JSON.stringify(payload));
                        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        this.autoSaveStatus = 'Draft auto-saved locally · ' + timeStr;
                    } catch (e) {}
                }, 900);
            },

            checkLocalDraftRecovery() {
                try {
                    const raw = localStorage.getItem(this.localStorageKey());
                    if (!raw) return;
                    const parsed = JSON.parse(raw);
                    if (parsed && parsed.content && parsed.content !== this.content && parsed.content.length > 20) {
                        this.hasRecoverableDraft = true;
                        this.recoverableDraftTime = parsed.savedAt ? new Date(parsed.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    }
                } catch (e) {}
            },

            restoreLocalDraft() {
                try {
                    const raw = localStorage.getItem(this.localStorageKey());
                    if (!raw) return;
                    const parsed = JSON.parse(raw);
                    if (parsed.title) this.title = parsed.title;
                    if (parsed.slug) { this.slug = parsed.slug; this.tempSlug = parsed.slug; }
                    if (parsed.excerpt) this.excerpt = parsed.excerpt;
                    if (parsed.content) {
                        this.content = parsed.content;
                        if (this.mode === 'visual' && this._tiptapEditor) {
                            this._tiptapEditor.commands.setContent(parsed.content, false);
                        }
                    }
                    this.hasRecoverableDraft = false;
                    this.runFullAnalysis();
                    this.showToast('Restored unsaved local draft!');
                } catch (e) {}
            },

            clearLocalDraft() {
                try { localStorage.removeItem(this.localStorageKey()); } catch (e) {}
                this.hasRecoverableDraft = false;
            },

            scheduleServerAutosave() {
                if (!this.recordId || !this.autosaveEndpoint || !this.isOnline) return;
                clearTimeout(this._serverAutosaveTimer);
                this._serverAutosaveTimer = setTimeout(() => {
                    this.triggerServerAutosave(false);
                }, 1800);
            },

            async triggerServerAutosave(showFeedback = false) {
                if (!this.recordId || !this.autosaveEndpoint || !this.isOnline) return;
                this.flushContentToWire();
                this.autosaveState = 'saving';
                this.autoSaveStatus = 'Saving…';

                try {
                    const res = await fetch(this.autosaveEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-CSRF-TOKEN': this.csrfToken,
                        },
                        body: JSON.stringify({
                            title: this.title,
                            slug: this.slug,
                            excerpt: this.excerpt,
                            content_html: this.content,
                            content_json: this.contentJson || null,
                            base_version: Number(this.version || 1),
                            meta_title: this.seoTitle,
                            meta_description: this.metaDescription,
                            focus_keyphrase: this.focusKeyphrase,
                            canonical_url: this.canonicalUrl,
                            visibility: this.visibility || 'public',
                            faq_json: this.faqItems || [],
                            featured_media_id: this.featuredMediaId || null,
                            featured_image_alt: this.featuredImageAlt || null,
                        }),
                    });

                    const data = await res.json().catch(() => ({}));
                    if (res.status === 409 || data.version_conflict) {
                        this.autosaveState = 'conflict';
                        this.autoSaveStatus = 'Version conflict';
                        this.versionConflict = {
                            serverVersion: data.server_version || data.current_version || 'newer',
                            baseVersion: this.version,
                        };
                        return;
                    }

                    if (!res.ok) {
                        throw new Error(data.message || 'Autosave failed');
                    }

                    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    this.autosaveState = 'saved';
                    this.autoSaveStatus = 'Saved ' + timeStr;
                    if (showFeedback) {
                        this.showToast('Draft autosaved at ' + timeStr);
                    }
                } catch (e) {
                    this.autosaveState = 'offline';
                    this.autoSaveStatus = 'Saved locally (retry pending)';
                }
            },

            reloadPageLatest() {
                this.hasUncommittedChanges = false;
                window.location.reload();
            },

            async openRevisionsDrawer() {
                if (!this.recordId || !this.revisionsEndpoint) {
                    this.showToast('Save this draft once to enable revision history.');
                    return;
                }
                this.revisionsDrawer.open = true;
                this.revisionsDrawer.loading = true;
                this.revisionsDrawer.error = '';
                this.revisionsDrawer.diff = null;

                try {
                    const res = await fetch(this.revisionsEndpoint, { headers: { Accept: 'application/json' } });
                    const payload = await res.json().catch(() => ({}));
                    this.revisionsDrawer.items = Array.isArray(payload.data) ? payload.data : [];
                    if (this.revisionsDrawer.items.length >= 2) {
                        this.revisionsDrawer.selectedTo = this.revisionsDrawer.items[0].id;
                        this.revisionsDrawer.selectedFrom = this.revisionsDrawer.items[1].id;
                        await this.loadRevisionDiff();
                    }
                } catch (e) {
                    this.revisionsDrawer.error = 'Failed to load revision history.';
                } finally {
                    this.revisionsDrawer.loading = false;
                }
            },

            async loadRevisionDiff() {
                if (!this.revisionsDiffEndpoint || !this.revisionsDrawer.selectedFrom || !this.revisionsDrawer.selectedTo) return;
                this.revisionsDrawer.diffLoading = true;
                try {
                    const url = `${this.revisionsDiffEndpoint}?from=${encodeURIComponent(this.revisionsDrawer.selectedFrom)}&to=${encodeURIComponent(this.revisionsDrawer.selectedTo)}`;
                    const res = await fetch(url, { headers: { Accept: 'application/json' } });
                    const payload = await res.json().catch(() => ({}));
                    this.revisionsDrawer.diff = payload.diff || null;
                } catch (e) {
                    this.revisionsDrawer.diff = null;
                } finally {
                    this.revisionsDrawer.diffLoading = false;
                }
            },

            async restoreServerRevision(revisionId) {
                if (!this.revisionsRestoreBase || !revisionId) return;
                if (!window.confirm('Restore this revision into the editor?')) return;
                this.revisionsDrawer.restoring = true;
                this.revisionsDrawer.error = '';
                try {
                    const res = await fetch(`${this.revisionsRestoreBase}/${revisionId}/restore`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-CSRF-TOKEN': this.csrfToken,
                        },
                        body: JSON.stringify({ expected_version: Number(this.version || 1) }),
                    });
                    const payload = await res.json().catch(() => ({}));
                    if (!res.ok || !payload.data) {
                        throw new Error(payload.message || 'Could not restore revision.');
                    }
                    const post = payload.data;
                    this.title = post.title || this.title;
                    this.slug = post.slug || this.slug;
                    this.tempSlug = this.slug;
                    this.excerpt = post.excerpt || '';
                    this.content = post.content_html || post.content || '';
                    this.contentJson = post.content_json || null;
                    this.version = Number(post.version || ((this.version || 1) + 1));
                    if (Array.isArray(post.faq_json)) this.faqItems = post.faq_json;
                    this.isMarkdownPost = Boolean(this.content.trim() && this.isContentMarkdownOnly(this.content));
                    if (!this.isMarkdownPost && this.mode === 'visual' && this._tiptapEditor) {
                        this._tiptapEditor.commands.setContent(this.content || '', false);
                    }
                    this.hasUncommittedChanges = false;
                    this.versionConflict = null;
                    this.revisionsDrawer.open = false;
                    this.runFullAnalysis();
                    this.showToast('Revision restored cleanly (v' + this.version + ')');
                } catch (e) {
                    this.revisionsDrawer.error = e.message || 'Restore failed.';
                } finally {
                    this.revisionsDrawer.restoring = false;
                }
            },

            openPreviewModal() {
                this.flushContentToWire();
                this.previewModal.open = true;
                this.previewModal.shareUrl = '';
                this.previewModal.error = '';
            },

            async generateSignedPreviewLink() {
                if (!this.recordId || !this.previewLinkEndpoint) {
                    this.previewModal.error = 'Save this post once to generate an expiring share link.';
                    return;
                }
                this.previewModal.loadingShare = true;
                this.previewModal.error = '';
                try {
                    const res = await fetch(this.previewLinkEndpoint, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'X-CSRF-TOKEN': this.csrfToken,
                        },
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok || !data.preview_url) {
                        throw new Error(data.message || 'Failed to generate preview link.');
                    }
                    this.previewModal.shareUrl = data.preview_url;
                    this.previewModal.expiresInMinutes = data.expires_in_minutes || 1440;
                } catch (e) {
                    this.previewModal.error = e.message || 'Could not generate preview link.';
                } finally {
                    this.previewModal.loadingShare = false;
                }
            },

            copyPreviewShareUrl() {
                if (!this.previewModal.shareUrl) return;
                if (navigator.clipboard?.writeText) {
                    navigator.clipboard.writeText(this.previewModal.shareUrl)
                        .then(() => this.showToast('Signed preview link copied!'))
                        .catch(() => {});
                }
            },

            renderedPreviewBodyHtml() {
                const raw = String(this.content || '');
                if (!raw.trim()) return '<p style="color:var(--gif-text-muted);">No article content yet.<\/p>';
                if (this.isContentMarkdownOnly(raw)) {
                    return '<pre style="white-space:pre-wrap;font-family:inherit;background:transparent;color:inherit;padding:0;">' + this.escapeHtml(raw) + '<\/pre>';
                }
                return raw;
            },

            mobileSaveDraft() {
                this.flushContentToWire();
                window.dispatchEvent(new CustomEvent('gif-mobile-save-draft'));
            },

            mobilePublish() {
                this.flushContentToWire();
                window.dispatchEvent(new CustomEvent('gif-mobile-publish'));
            },
        }));
    }

    if (window.Alpine) {
        registerGetintofeedEditorStudio();
    }
    document.addEventListener('alpine:init', registerGetintofeedEditorStudio);
})();
</script>

<div
    wire:ignore
    x-data="getintofeedEditorStudio({
        content: $wire.$entangle('{{ $statePath }}'),
        title: $wire.$entangle('data.title'),
        slug: $wire.$entangle('data.slug'),
        excerpt: $wire.$entangle('data.excerpt'),
        focusKeyphrase: $wire.$entangle('data.focus_keyphrase'),
        secondaryKeyphrases: $wire.$entangle('data.secondary_keyphrases'),
        seoTitle: $wire.$entangle('data.seo_title'),
        metaDescription: $wire.$entangle('data.meta_description'),
        canonicalUrl: $wire.$entangle('data.canonical_url'),
        schemaType: $wire.$entangle('data.schema_type'),
        robotsIndex: $wire.$entangle('data.robots_index'),
        robotsFollow: $wire.$entangle('data.robots_follow'),
        faqItems: $wire.$entangle('data.faq_items'),
        ogTitle: $wire.$entangle('data.og_title'),
        ogDescription: $wire.$entangle('data.og_description'),
        seoScore: $wire.$entangle('data.seo_score'),
        readabilityScore: $wire.$entangle('data.readability_score'),
        wordCount: $wire.$entangle('data.word_count'),
        readingTime: $wire.$entangle('data.reading_time'),
        featuredImageAlt: $wire.$entangle('data.featured_image_alt'),
        featuredMediaId: $wire.$entangle('data.featured_media_id'),
        visibility: $wire.$entangle('data.visibility'),
        version: $wire.$entangle('data.version'),
        contentJson: $wire.$entangle('data.content_json'),
        recordId: @js($recordId),
        recordUuid: @js($recordUuid),
        canPublish: @js($canPublish),
        tiptapJsUrl: @js($tiptapJsUrl),
        csrfToken: @js(csrf_token()),
        uploadEndpoint: @js(route('admin.editor.upload-image')),
        internalLinksEndpoint: @js(route('admin.editor.internal-links')),
        mediaListEndpoint: @js(route('admin.media.list')),
        autosaveEndpoint: @js($autosaveEndpoint),
        revisionsEndpoint: @js($revisionsEndpoint),
        revisionsDiffEndpoint: @js($revisionsDiffEndpoint),
        revisionsRestoreBase: @js($revisionsRestoreBase),
        previewLinkEndpoint: @js($previewLinkEndpoint),
        mediaAssets: @js($mediaAssets),
        mediaUrlMap: @js($mediaUrlMap),
        initialFeaturedUrl: @js($initialFeaturedUrl),
    })"
    x-init="initEditor()"
    @keydown.escape.window="mediaModal.open = false; linkModal.open = false; alsoReadModal.open = false; videoModal.open = false; previewModal.open = false; revisionsDrawer.open = false; isFocusMode = false;"
    @keydown.ctrl.k.window.prevent="if (mode === 'visual' && _tiptapEditor && _tiptapEditor.isFocused) openLinkModal()"
    @keydown.meta.k.window.prevent="if (mode === 'visual' && _tiptapEditor && _tiptapEditor.isFocused) openLinkModal()"
    @keydown.ctrl.s.window.prevent="recordId ? triggerServerAutosave(true) : mobileSaveDraft()"
    @keydown.meta.s.window.prevent="recordId ? triggerServerAutosave(true) : mobileSaveDraft()"
    class="gif-editor-root"
    :class="{ 'is-focus-mode': isFocusMode }"
>
    <!-- Mobile Section Tabs Bar (< 1024px) -->
    <nav class="gif-mobile-tabs-bar" aria-label="Editorial Studio Sections">
        <button type="button" @click="setMobileTab('content')" class="gif-mobile-tab-btn" :class="{ 'is-active': mobileTab === 'content' }">Content</button>
        <button type="button" @click="setMobileTab('publish')" class="gif-mobile-tab-btn" :class="{ 'is-active': mobileTab === 'publish' }">Publish</button>
        <button type="button" @click="setMobileTab('seo')" class="gif-mobile-tab-btn" :class="{ 'is-active': mobileTab === 'seo' }">SEO</button>
        <button type="button" @click="setMobileTab('media')" class="gif-mobile-tab-btn" :class="{ 'is-active': mobileTab === 'media' }">Media</button>
    </nav>

    <!-- Toast Notification -->
    <div x-show="toast.show" x-transition class="gif-toast" style="display: none;">
        <span class="gif-dot gif-dot-success"></span>
        <span x-text="toast.message"></span>
    </div>

    <!-- Optimistic Lock Version Conflict Alert -->
    <div x-show="versionConflict" style="display:none;" class="gif-status-banner is-danger" role="alert">
        <span>
            <strong>Version Conflict:</strong> A newer version (<span x-text="'v' + (versionConflict?.serverVersion || '')"></span>) was saved on another tab or device. Reload before saving so edits aren't lost.
        </span>
        <button type="button" @click="reloadPageLatest()" class="gif-btn gif-btn-primary gif-btn-xs">Reload Latest</button>
    </div>

    <!-- Offline Mode Indicator -->
    <div x-show="!isOnline" style="display:none;" class="gif-status-banner is-warn" role="status">
        <span><strong>Offline Mode:</strong> Internet disconnected. Edits are safely queued in local browser draft storage.</span>
    </div>

    <!-- Non-Destructive Legacy Markdown Preservation Banner -->
    <div x-show="isMarkdownPost" style="display:none;" class="gif-status-banner is-info">
        <span>
            <strong>Legacy Markdown Post:</strong> Preserved untouched so existing Markdown formatting is never altered automatically.
        </span>
        <button type="button" @click="convertMarkdownToVisualBlocks()" class="gif-btn gif-btn-indigo gif-btn-xs">Convert to Visual Blocks</button>
    </div>

    <!-- Local Draft Recovery Banner -->
    <div x-show="hasRecoverableDraft" style="display:none;" class="gif-recovery-banner">
        <div class="gif-status-banner is-warn">
            <span>
                <strong>Unsaved local backup found</strong>
                <span x-show="recoverableDraftTime" x-text="' (' + recoverableDraftTime + ')'"></span>. Would you like to restore it?
            </span>
            <div class="gif-row-gap-2">
                <button type="button" @click="restoreLocalDraft()" class="gif-btn gif-btn-primary gif-btn-xs">Restore Draft</button>
                <button type="button" @click="clearLocalDraft()" class="gif-btn gif-btn-secondary gif-btn-xs">Dismiss</button>
            </div>
        </div>
    </div>

    <div id="gif-content-pane">
    {{-- =====================================================================
         1. H1 TITLE & PERMALINK CAPSULE
         ===================================================================== --}}
    <div style="margin-bottom: 14px;">
        <input
            type="text"
            :value="title"
            @input="onTitleInput($event.target.value)"
            placeholder="Enter article headline (H1)..."
            autocomplete="off"
            spellcheck="true"
            class="gif-title-input"
        />

        <div class="gif-permalink-bar">
            <span style="color: var(--gif-text-muted); font-weight: 600;">Permalink:</span>
            <span style="color: var(--gif-text-muted); font-family: monospace;">https://getintofeed.com/blog/</span>
            <a
                :href="'https://getintofeed.com/blog/' + (slug || '')"
                target="_blank"
                rel="noopener noreferrer"
                class="gif-permalink-slug"
                x-text="slug || 'your-post-slug'"
            ></a>

            <button type="button" @click="tempSlug = slug; isEditingSlug = !isEditingSlug" class="gif-btn gif-btn-secondary gif-btn-xs">
                Edit Slug
            </button>

            <div x-show="isEditingSlug" style="display:none;" class="gif-row-gap-2">
                <input type="text" x-model="tempSlug" @keydown.enter.prevent="saveSlug()" class="gif-input" style="width:220px; padding:3px 8px; font-family:monospace; font-size:11.5px;" />
                <button type="button" @click="saveSlug()" class="gif-btn gif-btn-primary gif-btn-xs">OK</button>
                <button type="button" @click="cancelSlug()" class="gif-link-btn">Cancel</button>
            </div>
        </div>
    </div>

    {{-- =====================================================================
         2. STICKY RICH BLOG EDITOR CARD
         ===================================================================== --}}
    <div class="gif-card">
        <!-- Top Action Bar -->
        <div class="gif-editor-top-bar">
            <div class="gif-row-gap-2" style="flex-wrap: wrap;">
                <button type="button" @click="openMediaModal()" class="gif-btn gif-btn-secondary">
                    <svg class="gif-icon-xs gif-text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span>Add Media</span>
                </button>

                <!-- One-Click Custom SEO Blocks Dropdown -->
                <div style="position: relative;" x-data="{ open: false }" @click.outside="open = false">
                    <button type="button" @click="open = !open" class="gif-btn gif-btn-indigo">
                        <span>⚡ SEO Blocks ▾</span>
                    </button>

                    <div x-show="open" x-transition class="gif-dropdown-menu" style="display: none;">
                        <button type="button" @click="insertBlock('takeaways'); open = false;" class="gif-dropdown-item">
                            <span>📌</span>
                            <div>
                                <div style="font-weight:700; font-size:12px;">Key Takeaways Box</div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted);">Featured Snippet summary box</div>
                            </div>
                        </button>
                        <button type="button" @click="insertBlock('faq'); open = false;" class="gif-dropdown-item">
                            <span>❓</span>
                            <div>
                                <div style="font-weight:700; font-size:12px;">FAQ Schema Block</div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted);">Structured Q&amp;A + JSON-LD sync</div>
                            </div>
                        </button>
                        <button type="button" @click="insertBlock('toc'); open = false;" class="gif-dropdown-item">
                            <span>📑</span>
                            <div>
                                <div style="font-weight:700; font-size:12px;">Auto Table of Contents</div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted);">Synced live from H2/H3 headings</div>
                            </div>
                        </button>
                        <button type="button" @click="insertBlock('cta'); open = false;" class="gif-dropdown-item">
                            <span>🚀</span>
                            <div>
                                <div style="font-weight:700; font-size:12px;">CTA Conversion Banner</div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted);">Headline + action button card</div>
                            </div>
                        </button>
                        <button type="button" @click="insertBlock('video'); open = false;" class="gif-dropdown-item">
                            <span>🎬</span>
                            <div>
                                <div style="font-weight:700; font-size:12px;">Video Embed (YouTube / Vimeo)</div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted);">Responsive allow-listed iframe</div>
                            </div>
                        </button>
                        <button type="button" @click="insertBlock('alsoRead'); open = false;" class="gif-dropdown-item">
                            <span>📖</span>
                            <div>
                                <div style="font-weight:700; font-size:12px;">"Also Read" Internal Link Card</div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted);">Search real published posts</div>
                            </div>
                        </button>
                        <button type="button" @click="insertBlock('table'); open = false;" class="gif-dropdown-item">
                            <span>📊</span>
                            <div>
                                <div style="font-weight:700; font-size:12px;">Responsive Comparison Table</div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted);">Mobile-scrollable feature matrix</div>
                            </div>
                        </button>
                        <button type="button" @click="insertBlock('proTip'); open = false;" class="gif-dropdown-item">
                            <span>💡</span>
                            <div>
                                <div style="font-weight:700; font-size:12px;">Pro Tip Callout</div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted);">High-contrast insight card</div>
                            </div>
                        </button>
                    </div>
                </div>

                <button type="button" x-show="recordId" @click="openRevisionsDrawer()" class="gif-btn gif-btn-secondary gif-btn-xs" title="Inspect Revision History & Diff">
                    <span>🕒 Revisions</span>
                </button>
                <button type="button" @click="openPreviewModal()" class="gif-btn gif-btn-secondary gif-btn-xs" title="Mobile / Tablet / Desktop Preview">
                    <span>👁 Preview</span>
                </button>
            </div>

            <!-- Autosave Status, Focus Mode & Visual/HTML Toggle -->
            <div class="gif-row-gap-2" style="flex-wrap: wrap;">
                <span class="gif-autosave-pill" :class="{ 'is-saving': autosaveState === 'saving', 'is-offline': !isOnline || autosaveState === 'offline', 'is-conflict': autosaveState === 'conflict' }" x-text="autoSaveStatus">Synced</span>

                <button type="button" @click="isFocusMode = !isFocusMode" class="gif-btn gif-btn-secondary gif-btn-xs" :title="isFocusMode ? 'Exit Focus Mode (Esc)' : 'Distraction-Free Focus Mode'">
                    <span x-text="isFocusMode ? '✕ Exit Focus' : '⛶ Focus Mode'"></span>
                </button>

                <div class="gif-mode-switch" role="group" aria-label="Editor Mode">
                    <button type="button" @click="switchMode('visual')" class="gif-mode-btn" :class="{ 'is-active': mode === 'visual' }">Visual</button>
                    <button type="button" @click="switchMode('html')" class="gif-mode-btn" :class="{ 'is-active': mode === 'html' }" x-text="isMarkdownPost ? 'Markdown' : 'Raw HTML'">Raw HTML</button>
                </div>
            </div>
        </div>

        <!-- Sticky & Mobile Keyboard-Pinned Formatting Toolbar -->
        <div class="gif-sticky-toolbar" :class="{ 'is-keyboard-pinned': isKeyboardOpen && mode === 'visual' }" role="toolbar" aria-label="Text Formatting Toolbar">
            <select
                @change="execFormatBlock($event.target.value); $event.target.value = 'p';"
                class="gif-tb-select"
                aria-label="Block Format"
                title="Paragraph & Subheadings (H1 disabled for SEO)"
            >
                <option value="p">Paragraph</option>
                <option value="h2">Heading 2 (H2)</option>
                <option value="h3">Heading 3 (H3)</option>
                <option value="h4">Heading 4 (H4)</option>
                <option value="blockquote">Blockquote</option>
                <option value="pre">Code Block</option>
            </select>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="exec('bold')" class="gif-tb-btn" :class="{ 'is-active': activeMarks.bold }" style="font-weight:800;" aria-label="Bold" title="Bold (Ctrl+B)">B</button>
            <button type="button" @click="exec('italic')" class="gif-tb-btn" :class="{ 'is-active': activeMarks.italic }" style="font-style:italic;font-family:serif;" aria-label="Italic" title="Italic (Ctrl+I)">I</button>
            <button type="button" @click="exec('underline')" class="gif-tb-btn" :class="{ 'is-active': activeMarks.underline }" style="text-decoration:underline;" aria-label="Underline" title="Underline (Ctrl+U)">U</button>
            <button type="button" @click="exec('strikeThrough')" class="gif-tb-btn" :class="{ 'is-active': activeMarks.strike }" style="text-decoration:line-through;" aria-label="Strikethrough" title="Strikethrough">S</button>
            <button type="button" @click="exec('highlight')" class="gif-tb-btn" :class="{ 'is-active': activeMarks.highlight }" aria-label="Highlight" title="Highlight Text">🖍</button>
            <button type="button" @click="exec('code')" class="gif-tb-btn" aria-label="Inline Code" title="Inline Code">&lt;/&gt;</button>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="exec('insertUnorderedList')" class="gif-tb-btn" :class="{ 'is-active': activeMarks.bulletList }" aria-label="Bullet List" title="Bullet List">• List</button>
            <button type="button" @click="exec('insertOrderedList')" class="gif-tb-btn" :class="{ 'is-active': activeMarks.orderedList }" aria-label="Numbered List" title="Numbered List">1. List</button>
            <button type="button" @click="execFormatBlock('blockquote')" class="gif-tb-btn" :class="{ 'is-active': activeMarks.blockquote }" aria-label="Blockquote" title="Blockquote">❝ Quote</button>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="exec('justifyLeft')" class="gif-tb-btn" aria-label="Align Left" title="Align Left">⫷</button>
            <button type="button" @click="exec('justifyCenter')" class="gif-tb-btn" aria-label="Align Center" title="Align Center">☰</button>
            <button type="button" @click="exec('justifyRight')" class="gif-tb-btn" aria-label="Align Right" title="Align Right">⫸</button>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="openLinkModal()" class="gif-tb-btn" :class="{ 'is-active': activeMarks.link }" style="color:var(--gif-accent);" aria-label="Insert Link" title="Insert Link (Ctrl+K)">🔗 Link</button>
            <button type="button" @click="openMediaModal()" class="gif-tb-btn" aria-label="Insert Image" title="Insert Image">🖼 Image</button>
            <button type="button" @click="insertBlock('table')" class="gif-tb-btn" aria-label="Insert Table" title="Insert Table">📊 Table</button>

            <template x-if="activeMarks.table">
                <span class="gif-row-gap-2" style="margin-left:4px;">
                    <button type="button" @click="exec('addTableRow')" class="gif-tb-btn" title="Add Row">+Row</button>
                    <button type="button" @click="exec('addTableCol')" class="gif-tb-btn" title="Add Column">+Col</button>
                    <button type="button" @click="exec('deleteTable')" class="gif-tb-btn" style="color:var(--gif-danger);" title="Remove Table">✕Tbl</button>
                </span>
            </template>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="exec('insertHorizontalRule')" class="gif-tb-btn" aria-label="Divider" title="Horizontal Rule">― HR</button>
            <button type="button" @click="exec('removeFormat')" class="gif-tb-btn" aria-label="Clear Formatting" title="Clear Formatting">✕ Clear</button>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="exec('undo')" class="gif-tb-btn" aria-label="Undo" title="Undo (Ctrl+Z)">↩</button>
            <button type="button" @click="exec('redo')" class="gif-tb-btn" aria-label="Redo" title="Redo (Ctrl+Y)">↪</button>
        </div>

        <!-- TipTap Floating Bubble Selection Toolbar -->
        <div x-ref="bubbleMenu" class="gif-bubble-menu" style="display:none;" aria-label="Selection Formatting Bar">
            <button type="button" @click="exec('bold')" class="gif-bubble-btn" :class="{ 'is-active': activeMarks.bold }">B</button>
            <button type="button" @click="exec('italic')" class="gif-bubble-btn" :class="{ 'is-active': activeMarks.italic }" style="font-style:italic;">I</button>
            <button type="button" @click="exec('underline')" class="gif-bubble-btn" :class="{ 'is-active': activeMarks.underline }" style="text-decoration:underline;">U</button>
            <button type="button" @click="exec('strikeThrough')" class="gif-bubble-btn" :class="{ 'is-active': activeMarks.strike }" style="text-decoration:line-through;">S</button>
            <button type="button" @click="exec('highlight')" class="gif-bubble-btn" :class="{ 'is-active': activeMarks.highlight }">Hi</button>
            <button type="button" @click="exec('code')" class="gif-bubble-btn">&lt;/&gt;</button>
            <button type="button" @click="openLinkModal()" class="gif-bubble-btn" :class="{ 'is-active': activeMarks.link }">Link</button>
        </div>

        <!-- TipTap Writing Canvas + Raw Code Mode -->
        <div>
            <div
                x-show="mode === 'visual'"
                x-ref="tiptapMount"
                class="gif-tiptap-host"
            ></div>

            <textarea
                x-show="mode === 'html'"
                x-ref="htmlTextarea"
                x-model="content"
                @input="onHtmlInput()"
                class="gif-code-textarea"
                style="display: none;"
                :placeholder="isMarkdownPost ? 'Write Markdown cleanly...' : 'Write or paste semantic HTML here...'"
            ></textarea>
        </div>

        <!-- Live Footer Bar -->
        <div class="gif-editor-footer">
            <div style="display:flex; align-items:center; flex-wrap:wrap; gap:10px;">
                <span>Words: <strong x-text="stats.words">0</strong></span>
                <span>·</span>
                <span>Reading: <strong x-text="stats.readingTime + ' min'">1 min</strong></span>
                <span>·</span>
                <span>Headings: <strong x-text="stats.headings">0</strong></span>
                <span>·</span>
                <span>Links: <strong x-text="stats.internalLinks + ' int / ' + stats.externalLinks + ' ext'">0 int / 0 ext</strong></span>
            </div>

            <div style="display:flex; align-items:center; flex-wrap:wrap; gap:10px;">
                <span style="font-size:11px; color:var(--gif-text-muted);" x-text="autoSaveStatus">Synced</span>
                <span class="gif-badge" :class="seoScore >= 80 ? 'gif-badge-success' : (seoScore >= 55 ? 'gif-badge-warn' : 'gif-badge-danger')">
                    <span class="gif-dot" :class="seoScore >= 80 ? 'gif-dot-success' : (seoScore >= 55 ? 'gif-dot-warn' : 'gif-dot-danger')"></span>
                    <span>SEO: <span x-text="seoScore">0</span>/100</span>
                </span>
            </div>
        </div>
    </div>

    {{-- =====================================================================
         3. COLLAPSIBLE EXCERPT CARD
         ===================================================================== --}}
    <div class="gif-card" style="overflow: hidden;">
        <button
            type="button"
            @click="isExcerptOpen = !isExcerptOpen"
            style="width:100%; display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:var(--gif-bg-soft); border:none; cursor:pointer; color:var(--gif-text); font-size:13px; font-weight:700;"
        >
            <span>Article Excerpt / Summary Deck</span>
            <span style="font-size:11px; color:var(--gif-text-muted);" x-text="isExcerptOpen ? 'Hide ▲' : ((excerpt || '').length > 0 ? (excerpt.length + ' chars ▼') : 'Optional ▼')"></span>
        </button>
        <div x-show="isExcerptOpen" style="display:none; padding:14px 16px; border-top:1px solid var(--gif-border);">
            <textarea
                x-model="excerpt"
                @input="markDirtyAndScheduleSaves()"
                rows="2"
                placeholder="Write a concise 1–2 sentence teaser displayed on the blog hub and fallback meta snippet..."
                class="gif-input"
            ></textarea>
        </div>
    </div>
    </div>

    {{-- =====================================================================
         4. LIVE SEO STUDIO PRO (RANKMATH + YOAST + SURFER ENGINE)
         ===================================================================== --}}
    <div id="gif-seo-studio-pro" class="gif-card" style="overflow: hidden; margin-bottom: 0;">
        <!-- Studio Header -->
        <div class="gif-seo-header">
            <div style="display:flex; align-items:center; gap:12px;">
                <span style="width:34px; height:34px; border-radius:9px; background:#4f46e5; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:11px; color:#fff;">PRO</span>
                <div>
                    <div style="font-weight:800; font-size:14px; letter-spacing:-0.01em;">GetIntoFeed SEO Studio PRO</div>
                    <div style="font-size:11px; color:#cbd5e1;">Live Keyword Density · LSI Counters · Smart Internal Links · SERP &amp; @graph JSON-LD</div>
                </div>
            </div>
            <button type="button" @click="autoOptimizeMeta()" class="gif-btn gif-btn-primary">
                <span>✨ Auto-Optimize Meta</span>
            </button>
        </div>

        <!-- Executive Score Gauge + 4-Pillar Health Dashboard -->
        <div class="gif-seo-dashboard">
            <div style="display:flex; align-items:center; gap:14px;">
                <div style="position:relative; width:82px; height:82px; flex-shrink:0;">
                    <svg style="width:82px; height:82px; transform:rotate(-90deg);" viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="38" stroke="var(--gif-border-strong)" stroke-width="8" fill="none" />
                        <circle
                            cx="45" cy="45" r="38"
                            :stroke="seoScore >= 80 ? '#10b981' : (seoScore >= 55 ? '#f59e0b' : '#f43f5e')"
                            stroke-width="8"
                            fill="none"
                            stroke-linecap="round"
                            stroke-dasharray="238.76"
                            :stroke-dashoffset="238.76 - (238.76 * seoScore / 100)"
                            style="transition: stroke-dashoffset 0.35s ease;"
                        />
                    </svg>
                    <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        <span style="font-weight:900; font-size:20px; line-height:1;" x-text="seoScore">0</span>
                        <span style="font-size:9.5px; color:var(--gif-text-muted); font-weight:700;">/ 100</span>
                    </div>
                </div>
                <div>
                    <div style="font-size:14px; font-weight:800;" x-text="seoScore >= 80 ? 'Optimal Growth' : (seoScore >= 55 ? 'Needs Tuning' : 'Needs Setup')"></div>
                    <div style="font-size:11.5px; color:var(--gif-text-muted); margin-top:4px;">
                        <strong style="color:var(--gif-success);" x-text="passedChecks.length">0</strong> passed ·
                        <strong style="color:var(--gif-warn);" x-text="recommendedTips.length">0</strong> tips ·
                        <strong style="color:var(--gif-danger);" x-text="criticalIssues.length">0</strong> critical
                    </div>
                </div>
            </div>

            <!-- 4-Pillar Health Bars -->
            <div class="gif-pillar-grid">
                <div class="gif-pillar-card">
                    <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; margin-bottom:6px;">
                        <span style="color:var(--gif-text-muted);">Basic SEO</span>
                        <span x-text="pillarScore.basic + '%'">0%</span>
                    </div>
                    <div class="gif-progress-track">
                        <div class="gif-progress-fill" :style="'width:' + pillarScore.basic + '%; background:' + (pillarScore.basic >= 80 ? '#10b981' : (pillarScore.basic >= 50 ? '#f59e0b' : '#f43f5e'))"></div>
                    </div>
                </div>

                <div class="gif-pillar-card">
                    <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; margin-bottom:6px;">
                        <span style="color:var(--gif-text-muted);">Title &amp; Meta</span>
                        <span x-text="pillarScore.titleMeta + '%'">0%</span>
                    </div>
                    <div class="gif-progress-track">
                        <div class="gif-progress-fill" :style="'width:' + pillarScore.titleMeta + '%; background:' + (pillarScore.titleMeta >= 80 ? '#10b981' : (pillarScore.titleMeta >= 50 ? '#f59e0b' : '#f43f5e'))"></div>
                    </div>
                </div>

                <div class="gif-pillar-card">
                    <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; margin-bottom:6px;">
                        <span style="color:var(--gif-text-muted);">Content &amp; LSI</span>
                        <span x-text="pillarScore.contentLsi + '%'">0%</span>
                    </div>
                    <div class="gif-progress-track">
                        <div class="gif-progress-fill" :style="'width:' + pillarScore.contentLsi + '%; background:' + (pillarScore.contentLsi >= 80 ? '#10b981' : (pillarScore.contentLsi >= 50 ? '#f59e0b' : '#f43f5e'))"></div>
                    </div>
                </div>

                <div class="gif-pillar-card">
                    <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; margin-bottom:6px;">
                        <span style="color:var(--gif-text-muted);">Links &amp; Tech</span>
                        <span x-text="pillarScore.linksTech + '%'">0%</span>
                    </div>
                    <div class="gif-progress-track">
                        <div class="gif-progress-fill" :style="'width:' + pillarScore.linksTech + '%; background:' + (pillarScore.linksTech >= 80 ? '#10b981' : (pillarScore.linksTech >= 50 ? '#f59e0b' : '#f43f5e'))"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Studio Tabs -->
        <div class="gif-tabs-bar">
            <button type="button" @click="seoTab = 'audit'" class="gif-tab-btn" :class="{ 'is-active': seoTab === 'audit' }">
                Keywords &amp; Audit (<span x-text="criticalIssues.length">0</span>)
            </button>
            <button type="button" @click="seoTab = 'serp'" class="gif-tab-btn" :class="{ 'is-active': seoTab === 'serp' }">
                Google SERP &amp; Meta
            </button>
            <button type="button" @click="seoTab = 'readability'" class="gif-tab-btn" :class="{ 'is-active': seoTab === 'readability' }">
                Readability (<span x-text="fleschScore">0</span>)
            </button>
            <button type="button" @click="seoTab = 'schema'" class="gif-tab-btn" :class="{ 'is-active': seoTab === 'schema' }">
                Schema &amp; Robots
            </button>
            <button type="button" @click="seoTab = 'social'" class="gif-tab-btn" :class="{ 'is-active': seoTab === 'social' }">
                Social Cards
            </button>
        </div>

        {{-- TAB 1: KEYWORDS, LSI COUNTERS, INTERNAL LINKING & 14-POINT AUDIT --}}
        <div x-show="seoTab === 'audit'" style="padding: 18px 20px; display: flex; flex-direction: column; gap: 16px;">
            <!-- Primary Focus Keyphrase + Live Density Meter -->
            <div class="gif-panel-box">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                    <label style="font-size:12px; font-weight:700;">🎯 Primary Focus Keyphrase</label>
                    <span class="gif-badge" :class="keywordDensity >= 0.5 && keywordDensity <= 2.5 ? 'gif-badge-success' : (keywordDensity > 2.5 ? 'gif-badge-danger' : 'gif-badge-warn')">
                        Density: <span x-text="keywordDensity + '%'">0%</span> (<span x-text="keywordCount + 'x'">0x</span>)
                    </span>
                </div>
                <input
                    x-ref="focusKeyphraseInput"
                    type="text"
                    x-model="focusKeyphrase"
                    @input="scheduleAudit(); fetchInternalSuggestions();"
                    placeholder="e.g., meta advantage plus ecommerce scaling"
                    class="gif-input"
                />
                <div style="display:flex; align-items:center; gap:8px; margin-top:8px; font-size:10.5px; color:var(--gif-text-muted);">
                    <span>0%</span>
                    <div class="gif-progress-track" style="flex:1;">
                        <div style="position:absolute; left:16.6%; right:16.6%; top:0; bottom:0; background:rgba(16,185,129,0.2);"></div>
                        <div class="gif-progress-fill" :style="'width:' + Math.min(100, (keywordDensity / 3) * 100) + '%; background:' + (keywordDensity >= 0.5 && keywordDensity <= 2.5 ? '#10b981' : (keywordDensity > 2.5 ? '#f43f5e' : '#f59e0b'))"></div>
                    </div>
                    <span>0.5%–2.5% Ideal</span>
                    <span>3%+</span>
                </div>
            </div>

            <!-- Secondary / LSI Keyphrases with Live Usage Counters -->
            <div class="gif-panel-box">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <label style="font-size:12px; font-weight:700;">
                        ⚡ Secondary / LSI Keyphrases (<span x-text="usedLsiCount">0</span>/<span x-text="secondaryKeyphrases.length">0</span> used)
                    </label>
                    <span style="font-size:11px; color:var(--gif-text-muted);">Press Enter or comma to add</span>
                </div>

                <div style="display:flex; gap:8px; margin-bottom:10px;">
                    <input
                        x-ref="lsiInput"
                        type="text"
                        x-model="newLsiInput"
                        @keydown.enter.prevent="addLsiKeyword()"
                        placeholder="Add secondary / LSI keyphrase..."
                        class="gif-input"
                    />
                    <button type="button" @click="addLsiKeyword()" class="gif-btn gif-btn-primary">Add</button>
                </div>

                <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    <template x-for="(kw, idx) in secondaryKeyphrases" :key="idx">
                        <span
                            class="gif-badge"
                            :class="getLsiCount(kw) > 0 ? 'gif-badge-success' : 'gif-badge-neutral'"
                            style="padding: 4px 10px; font-size: 11.5px;"
                        >
                            <span x-text="kw"></span>
                            <strong style="margin-left:4px;" x-text="getLsiCount(kw) + 'x'">0x</strong>
                            <button type="button" @click="removeLsiKeyword(idx)" style="background:none; border:none; color:inherit; cursor:pointer; font-weight:800; margin-left:4px;">×</button>
                        </span>
                    </template>
                    <template x-if="secondaryKeyphrases.length === 0">
                        <span style="font-size:11.5px; color:var(--gif-text-muted); font-style:italic;">No secondary keywords yet. Add 3–5 semantic terms to track live usage counts.</span>
                    </template>
                </div>
            </div>

            <!-- Smart Internal Linking Suggestions (Real Published Posts) -->
            <div class="gif-panel-box">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
                    <span style="font-size:12px; font-weight:700;">🔗 Smart Internal Link Suggestions (Live Published Posts)</span>
                    <div style="display:flex; gap:6px;">
                        <input
                            type="text"
                            x-model="internalSearchQuery"
                            @keydown.enter.prevent="fetchInternalSuggestions()"
                            placeholder="Filter posts..."
                            class="gif-input"
                            style="width:165px; padding:4px 8px; font-size:11.5px;"
                        />
                        <button type="button" @click="fetchInternalSuggestions()" class="gif-btn gif-btn-secondary gif-btn-xs">Refresh</button>
                    </div>
                </div>

                <div x-show="internalLoading" style="font-size:11.5px; color:var(--gif-text-muted);">Searching published articles...</div>

                <div x-show="!internalLoading && internalSuggestions.length === 0" style="font-size:11.5px; color:var(--gif-text-muted);">
                    No matching published articles found yet.
                </div>

                <div x-show="!internalLoading && internalSuggestions.length > 0" style="display:flex; flex-direction:column; gap:6px; max-height:190px; overflow-y:auto;">
                    <template x-for="post in internalSuggestions.slice(0, 6)" :key="post.id">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px 10px; border-radius:8px; background:var(--gif-bg); border:1px solid var(--gif-border);">
                            <div style="min-width:0; flex:1;">
                                <div style="font-size:12px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" x-text="post.title"></div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted); font-family:monospace; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" x-text="post.url"></div>
                            </div>
                            <div class="gif-row-gap-2" style="flex-shrink:0;">
                                <button type="button" @click="insertContextualInternalLink(post)" class="gif-btn gif-btn-secondary gif-btn-xs">Insert Link</button>
                                <button type="button" @click="insertAlsoReadCard(post)" class="gif-btn gif-btn-indigo gif-btn-xs">Also Read</button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 14-Point Live SEO Audit -->
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div x-show="criticalIssues.length > 0">
                    <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--gif-danger); margin-bottom:6px;">
                        ✕ Critical Problems (<span x-text="criticalIssues.length">0</span>)
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <template x-for="(item, idx) in criticalIssues" :key="'crit-' + idx">
                            <div class="gif-audit-row gif-audit-crit">
                                <span><strong style="color:var(--gif-danger);">✕</strong> <span x-text="item.label"></span></span>
                                <button x-show="item.action" type="button" @click="runQuickFix(item.action)" class="gif-btn gif-btn-primary gif-btn-xs" x-text="item.fixLabel || 'Quick Fix'"></button>
                            </div>
                        </template>
                    </div>
                </div>

                <div x-show="recommendedTips.length > 0">
                    <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--gif-warn); margin-bottom:6px;">
                        ⚠ Recommended Tips (<span x-text="recommendedTips.length">0</span>)
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <template x-for="(item, idx) in recommendedTips" :key="'tip-' + idx">
                            <div class="gif-audit-row gif-audit-tip">
                                <span><strong style="color:var(--gif-warn);">⚠</strong> <span x-text="item.label"></span></span>
                                <button x-show="item.action" type="button" @click="runQuickFix(item.action)" class="gif-btn gif-btn-secondary gif-btn-xs" x-text="item.fixLabel || 'Quick Fix'"></button>
                            </div>
                        </template>
                    </div>
                </div>

                <div>
                    <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--gif-success); margin-bottom:6px;">
                        ✓ Passed Checks (<span x-text="passedChecks.length">0</span>)
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <template x-for="(item, idx) in passedChecks" :key="'pass-' + idx">
                            <div class="gif-audit-row gif-audit-pass">
                                <span><strong style="color:var(--gif-success);">✓</strong> <span x-text="item.label"></span></span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        {{-- TAB 2: GOOGLE SERP & META STUDIO --}}
        <div x-show="seoTab === 'serp'" style="display:none; padding: 18px 20px;">
            <div class="gif-panel-box" style="margin-bottom: 16px;">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                    <span style="font-size:12px; font-weight:700;">🔍 Google Search Snippet Simulator</span>
                    <div class="gif-row-gap-2">
                        <label class="gif-checkbox-label" style="font-size:11px;">
                            <input type="checkbox" x-model="showSerpDate" />
                            <span>Show Date</span>
                        </label>
                        <div class="gif-mode-switch">
                            <button type="button" @click="serpDevice = 'desktop'" class="gif-mode-btn" :class="{ 'is-active': serpDevice === 'desktop' }">Desktop</button>
                            <button type="button" @click="serpDevice = 'mobile'" class="gif-mode-btn" :class="{ 'is-active': serpDevice === 'mobile' }">Mobile</button>
                        </div>
                    </div>
                </div>

                <div class="gif-serp-card" :style="serpDevice === 'mobile' ? 'max-width: 390px; margin: 0 auto;' : ''">
                    <div style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:4px;">
                        <span style="width:18px; height:18px; border-radius:9999px; background:#0f172a; color:#cfff04; display:inline-flex; align-items:center; justify-content:center; font-size:10px; font-weight:900;">G</span>
                        <span style="font-weight:600;">GetIntoFeed</span>
                        <span style="color:var(--gif-text-muted); font-size:11px;" x-text="'https://getintofeed.com/blog/' + (slug || 'article-slug')"></span>
                    </div>

                    <div class="gif-serp-title" x-html="highlightKeyphrase(seoTitle || title || 'Post Title (H1) | GetIntoFeed')"></div>

                    <div class="gif-serp-desc">
                        <span x-show="showSerpDate" style="color:var(--gif-text-muted);" x-text="new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' — '"></span>
                        <span x-html="highlightKeyphrase(metaDescription || excerpt || 'Add a compelling 120–160 character meta description to boost organic search CTR.')"></span>
                    </div>

                    <!-- FAQ Rich Result Dropdowns in SERP -->
                    <div x-show="faqItems.filter(i => i && i.q && i.a).length > 0" style="margin-top:10px;">
                        <template x-for="(faq, fIdx) in faqItems.filter(i => i && i.q && i.a).slice(0, 3)" :key="'serp-faq-' + fIdx">
                            <div class="gif-serp-faq-item" x-data="{ open: false }">
                                <button type="button" @click="open = !open" style="width:100%; display:flex; align-items:center; justify-content:space-between; background:none; border:none; cursor:pointer; padding:2px 0; color:inherit; font-weight:600; text-align:left;">
                                    <span x-text="faq.q"></span>
                                    <span x-text="open ? '▲' : '▼'" style="font-size:10px;"></span>
                                </button>
                                <div x-show="open" style="margin-top:4px; color:var(--gif-text-muted); font-size:12px;" x-text="faq.a"></div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- SEO Title + Pixel Width + Meta Description + Canonical -->
            <div style="display:flex; flex-direction:column; gap:14px;">
                <div>
                    <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px; font-size:12px; margin-bottom:4px;">
                        <label style="font-weight:700;">SEO Title (&lt;title&gt;)</label>
                        <span style="font-family:monospace; font-size:11px;" :style="(seoTitle || '').length >= 38 && (seoTitle || '').length <= 60 && seoTitlePx <= 580 ? 'color:var(--gif-success);font-weight:700;' : 'color:var(--gif-warn);'">
                            <span x-text="(seoTitle || '').length">0</span>/60 chars · <span x-text="seoTitlePx">0</span>/580px
                        </span>
                    </div>
                    <input type="text" x-model="seoTitle" @input="scheduleAudit()" placeholder="Primary Keyphrase — Hook | GetIntoFeed" class="gif-input" />
                    <div class="gif-progress-track" style="margin-top:6px;">
                        <div class="gif-progress-fill" :style="'width:' + Math.min(100, (seoTitlePx / 580) * 100) + '%; background:' + ((seoTitle || '').length >= 38 && (seoTitle || '').length <= 60 && seoTitlePx <= 580 ? '#10b981' : (seoTitlePx > 580 || (seoTitle || '').length > 60 ? '#f43f5e' : '#f59e0b'))"></div>
                    </div>
                </div>

                <div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                        <label style="font-weight:700;">Meta Description</label>
                        <span style="font-family:monospace; font-size:11px;" :style="(metaDescription || '').length >= 120 && (metaDescription || '').length <= 160 ? 'color:var(--gif-success);font-weight:700;' : 'color:var(--gif-warn);'">
                            <span x-text="(metaDescription || '').length">0</span> / 160 chars (Ideal: 120–160)
                        </span>
                    </div>
                    <textarea x-model="metaDescription" @input="scheduleAudit()" rows="3" placeholder="Compelling 120–160 char meta description including focus keyphrase..." class="gif-input"></textarea>
                    <div class="gif-progress-track" style="margin-top:6px;">
                        <div class="gif-progress-fill" :style="'width:' + Math.min(100, ((metaDescription || '').length / 160) * 100) + '%; background:' + ((metaDescription || '').length >= 120 && (metaDescription || '').length <= 160 ? '#10b981' : ((metaDescription || '').length > 160 ? '#f43f5e' : '#f59e0b'))"></div>
                    </div>
                </div>

                <div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                        <label style="font-weight:700;">Canonical URL</label>
                        <button type="button" @click="runQuickFix('fixCanonical')" class="gif-link-btn">Use Default Post URL</button>
                    </div>
                    <input type="url" x-model="canonicalUrl" @input="scheduleAudit()" placeholder="https://getintofeed.com/blog/..." class="gif-input" style="font-family:monospace;" />
                </div>
            </div>
        </div>

        {{-- TAB 3: READABILITY STUDIO --}}
        <div x-show="seoTab === 'readability'" style="display:none; padding: 18px 20px;">
            <div class="gif-panel-box" style="display:flex; align-items:center; gap:14px; margin-bottom:14px;">
                <span class="gif-badge" :class="fleschScore >= 60 ? 'gif-badge-success' : 'gif-badge-warn'" style="font-size:18px; padding:10px 14px; border-radius:12px;" x-text="fleschScore">0</span>
                <div>
                    <div style="font-size:14px; font-weight:800;" x-text="'Flesch Reading Ease: ' + readabilityLabel"></div>
                    <div style="font-size:11.5px; color:var(--gif-text-muted);">Target 60+ for scannable, human-first web content.</div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap:10px; margin-bottom:14px;">
                <div class="gif-panel-box">
                    <div style="font-size:11px; color:var(--gif-text-muted); font-weight:600;">Avg. Sentence Length</div>
                    <div style="font-size:16px; font-weight:800; margin-top:4px;" :style="avgSentenceLength <= 20 ? 'color:var(--gif-success);' : 'color:var(--gif-warn);'" x-text="avgSentenceLength + ' words'">0 words</div>
                    <div style="font-size:10.5px; color:var(--gif-text-muted);">Recommended: &le; 20 words</div>
                </div>

                <div class="gif-panel-box">
                    <div style="font-size:11px; color:var(--gif-text-muted); font-weight:600;">Passive Voice</div>
                    <div style="font-size:16px; font-weight:800; margin-top:4px;" :style="passiveVoicePct <= 10 ? 'color:var(--gif-success);' : 'color:var(--gif-warn);'" x-text="passiveVoicePct + '%'">0%</div>
                    <div style="font-size:10.5px; color:var(--gif-text-muted);">Target: &lt; 10% passive sentences</div>
                </div>

                <div class="gif-panel-box">
                    <div style="font-size:11px; color:var(--gif-text-muted); font-weight:600;">Transition Words</div>
                    <div style="font-size:16px; font-weight:800; margin-top:4px;" :style="transitionWordsPct >= 30 ? 'color:var(--gif-success);' : 'color:var(--gif-warn);'" x-text="transitionWordsPct + '%'">0%</div>
                    <div style="font-size:10.5px; color:var(--gif-text-muted);">Target: &ge; 30% sentences</div>
                </div>
            </div>

            <!-- Long Paragraph Warnings -->
            <div class="gif-panel-box">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:12px; font-weight:700;">Long Paragraph Check (&gt; 120 words)</span>
                    <span class="gif-badge" :class="longParagraphs.length === 0 ? 'gif-badge-success' : 'gif-badge-warn'" x-text="longParagraphs.length === 0 ? '✓ All concise' : (longParagraphs.length + ' long paragraphs')"></span>
                </div>
                <template x-if="longParagraphs.length > 0">
                    <div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
                        <template x-for="lp in longParagraphs" :key="'lp-' + lp.index">
                            <div class="gif-audit-row gif-audit-tip" style="font-size:11.5px;">
                                <span><strong>Paragraph #<span x-text="lp.index"></span> (<span x-text="lp.words"></span> words):</strong> <span x-text="lp.preview"></span></span>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </div>

        {{-- TAB 4: SCHEMA & ROBOTS --}}
        <div x-show="seoTab === 'schema'" style="display:none; padding: 18px 20px;">
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin-bottom:16px;">
                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Schema.org Type</label>
                    <select x-model="schemaType" @change="scheduleAudit()" class="gif-input">
                        <option value="BlogPosting">BlogPosting (Default)</option>
                        <option value="NewsArticle">NewsArticle</option>
                        <option value="HowTo">HowTo (Step-by-step Guide)</option>
                        <option value="FAQPage">FAQPage + BlogPosting</option>
                        <option value="Article">Article (General)</option>
                        <option value="TechArticle">TechArticle</option>
                    </select>
                </div>

                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Search Engine Robots Directives</label>
                    <div class="gif-panel-box" style="display:flex; gap:16px; padding:8px 12px;">
                        <label class="gif-checkbox-label">
                            <input type="checkbox" x-model="robotsIndex" />
                            <span>index</span>
                        </label>
                        <label class="gif-checkbox-label">
                            <input type="checkbox" x-model="robotsFollow" />
                            <span>follow</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Interactive FAQ Rich Result Builder -->
            <div class="gif-panel-box" style="margin-bottom:16px;">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
                    <div>
                        <div style="font-size:12px; font-weight:700;">FAQ Rich Result Builder (@graph FAQPage)</div>
                        <div style="font-size:11px; color:var(--gif-text-muted);">Automatically injects FAQPage schema into &lt;head&gt; whenever items exist.</div>
                    </div>
                    <div class="gif-row-gap-2">
                        <button type="button" @click="insertFaqBlockIntoArticle()" x-show="faqItems.length > 0" class="gif-btn gif-btn-indigo gif-btn-xs">Insert into Body</button>
                        <button type="button" @click="addFaqItem()" class="gif-btn gif-btn-primary gif-btn-xs">+ Add FAQ Item</button>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:8px;">
                    <template x-for="(faq, fIdx) in faqItems" :key="'faq-' + fIdx">
                        <div style="padding:10px; border-radius:8px; background:var(--gif-bg); border:1px solid var(--gif-border); display:flex; flex-direction:column; gap:6px;">
                            <div style="display:flex; gap:8px;">
                                <input type="text" x-model="faq.q" @input="scheduleAudit()" placeholder="Question..." class="gif-input" style="font-weight:700;" />
                                <button type="button" @click="removeFaqItem(fIdx)" class="gif-btn gif-btn-danger-ghost gif-btn-xs">Remove</button>
                            </div>
                            <textarea x-model="faq.a" @input="scheduleAudit()" rows="2" placeholder="Concise Featured-Snippet answer (40–60 words)..." class="gif-input"></textarea>
                        </div>
                    </template>
                    <template x-if="faqItems.length === 0">
                        <div style="font-size:11.5px; color:var(--gif-text-muted); font-style:italic;">No FAQ items added yet.</div>
                    </template>
                </div>
            </div>

            <!-- Live @graph JSON-LD Preview + Copy -->
            <div class="gif-panel-box">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <span style="font-size:12px; font-weight:700;">Live @graph JSON-LD Preview</span>
                    <button type="button" @click="copyJsonLd()" class="gif-btn gif-btn-secondary gif-btn-xs">Copy JSON-LD</button>
                </div>
                <pre style="margin:0; padding:12px; border-radius:8px; background:#09090b; color:#a5f3fc; font-size:11px; overflow-x:auto; max-height:260px;" x-text="computedJsonLdString"></pre>
            </div>
        </div>

        {{-- TAB 5: SOCIAL CARDS --}}
        <div x-show="seoTab === 'social'" style="display:none; padding: 18px 20px;">
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:16px; margin-bottom:16px;">
                <!-- Facebook / LinkedIn OpenGraph Card -->
                <div>
                    <div style="font-size:12px; font-weight:700; margin-bottom:6px;">Facebook / LinkedIn OpenGraph</div>
                    <div style="border-radius:12px; overflow:hidden; border:1px solid var(--gif-border); background:var(--gif-bg-soft);">
                        <div style="height:150px; background:var(--gif-bg-muted); display:flex; align-items:center; justify-content:center; overflow:hidden;">
                            <template x-if="featuredImageUrl">
                                <img :src="featuredImageUrl" :alt="featuredImageAlt || title" style="width:100%; height:100%; object-fit:cover;" />
                            </template>
                            <template x-if="!featuredImageUrl">
                                <span style="font-size:11.5px; color:var(--gif-text-muted);">1200 × 630 Featured Image</span>
                            </template>
                        </div>
                        <div style="padding:12px;">
                            <div style="font-size:10px; text-transform:uppercase; color:var(--gif-text-muted); font-weight:700;">getintofeed.com</div>
                            <div style="font-size:13.5px; font-weight:700; margin-top:2px;" x-text="ogTitle || seoTitle || title || 'Post Title'"></div>
                            <div style="font-size:12px; color:var(--gif-text-muted); margin-top:4px;" x-text="ogDescription || metaDescription || excerpt || 'OpenGraph summary description'"></div>
                        </div>
                    </div>
                </div>

                <!-- X (Twitter) Large Card -->
                <div>
                    <div style="font-size:12px; font-weight:700; margin-bottom:6px;">X (Twitter) Large Summary Card</div>
                    <div style="border-radius:14px; overflow:hidden; border:1px solid var(--gif-border); background:var(--gif-bg-soft);">
                        <div style="height:150px; background:var(--gif-bg-muted); display:flex; align-items:center; justify-content:center; overflow:hidden;">
                            <template x-if="featuredImageUrl">
                                <img :src="featuredImageUrl" :alt="featuredImageAlt || title" style="width:100%; height:100%; object-fit:cover;" />
                            </template>
                            <template x-if="!featuredImageUrl">
                                <span style="font-size:11.5px; color:var(--gif-text-muted);">Twitter summary_large_image</span>
                            </template>
                        </div>
                        <div style="padding:12px;">
                            <div style="font-size:13.5px; font-weight:700;" x-text="ogTitle || seoTitle || title || 'Post Title'"></div>
                            <div style="font-size:12px; color:var(--gif-text-muted); margin-top:4px;" x-text="ogDescription || metaDescription || excerpt || 'X card description'"></div>
                            <div style="font-size:10.5px; color:var(--gif-text-muted); margin-top:6px;">getintofeed.com</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">OpenGraph Title Override (Optional)</label>
                    <input type="text" x-model="ogTitle" placeholder="Defaults to SEO Title if empty" class="gif-input" />
                </div>
                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">OpenGraph Description Override (Optional)</label>
                    <textarea x-model="ogDescription" rows="2" placeholder="Defaults to Meta Description if empty" class="gif-input"></textarea>
                </div>
            </div>
        </div>
    </div>

    {{-- =====================================================================
         MODAL 1: INSERT MEDIA (AUTO-WEBP UPLOAD + LIBRARY + MANDATORY ALT TEXT)
         ===================================================================== --}}
    <div x-show="mediaModal.open" style="display:none;" class="gif-modal-backdrop" @click.self="mediaModal.open = false">
        <div class="gif-modal-window">
            <div class="gif-modal-header">
                <span style="font-weight:800; font-size:14px;">Insert Media (Auto-WebP + SEO Alt Text)</span>
                <button type="button" @click="mediaModal.open = false" class="gif-btn gif-btn-secondary gif-btn-xs">✕</button>
            </div>

            <div class="gif-tabs-bar">
                <button type="button" @click="mediaModal.tab = 'upload'" class="gif-tab-btn" :class="{ 'is-active': mediaModal.tab === 'upload' }">Upload Image (WebP)</button>
                <button type="button" @click="mediaModal.tab = 'library'" class="gif-tab-btn" :class="{ 'is-active': mediaModal.tab === 'library' }">Media Library</button>
                <button type="button" @click="mediaModal.tab = 'url'" class="gif-tab-btn" :class="{ 'is-active': mediaModal.tab === 'url' }">Image URL</button>
            </div>

            <div class="gif-modal-body">
                <!-- Tab 1: Direct Upload -->
                <div x-show="mediaModal.tab === 'upload'" style="margin-bottom:14px;">
                    <label
                        class="gif-dropzone"
                        :class="{ 'is-dragging': mediaModal.isDragging }"
                        @dragover.prevent="mediaModal.isDragging = true"
                        @dragleave.prevent="mediaModal.isDragging = false"
                        @drop.prevent="handleMediaDrop($event)"
                        style="display:block;"
                    >
                        <input type="file" accept="image/*" @change="handleMediaFileInput($event)" style="display:none;" />
                        <div style="font-weight:700; font-size:13px; margin-bottom:4px;" x-text="mediaModal.isUploading ? 'Converting & optimizing to WebP...' : 'Drop image here, paste in canvas, or tap to choose gallery file'"></div>
                        <div style="font-size:11px; color:var(--gif-text-muted);">JPG, PNG, WebP, GIF · Max 5 MB · Automatically stripped of EXIF &amp; converted to WebP</div>
                    </label>
                    <label class="gif-btn gif-btn-secondary" style="margin-top:8px; width:100%; cursor:pointer;">
                        <input type="file" accept="image/*" capture="environment" @change="handleMediaFileInput($event)" style="display:none;" />
                        <span>📷 Capture Photo with Camera</span>
                    </label>
                </div>

                <!-- Tab 2: Media Library -->
                <div x-show="mediaModal.tab === 'library'" style="display:none; margin-bottom:14px;">
                    <input type="text" x-model="mediaModal.search" placeholder="Search media library..." class="gif-input" style="margin-bottom:10px;" />
                    <div class="gif-media-grid">
                        <template x-for="asset in filteredMediaAssets" :key="'lib-' + asset.id">
                            <button type="button" @click="selectMediaFromLibrary(asset)" class="gif-media-tile" :class="{ 'is-selected': mediaModal.url === asset.url }" :title="asset.name">
                                <img :src="asset.url" :alt="asset.alt" loading="lazy" />
                            </button>
                        </template>
                    </div>
                </div>

                <!-- Tab 3: URL -->
                <div x-show="mediaModal.tab === 'url'" style="display:none; margin-bottom:14px;">
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Direct Image URL</label>
                    <input type="url" x-model="mediaModal.url" placeholder="https://getintofeed.com/storage/..." class="gif-input" />
                </div>

                <!-- Preview & Error -->
                <div x-show="mediaModal.error" style="display:none; margin-bottom:12px; padding:8px 12px; border-radius:8px; background:var(--gif-danger-bg); border:1px solid var(--gif-danger-border); color:var(--gif-danger); font-size:12px; font-weight:600;" x-text="mediaModal.error"></div>

                <div x-show="mediaModal.url" style="display:none; margin-bottom:12px;">
                    <div style="padding:10px; border-radius:10px; background:var(--gif-bg-soft); border:1px solid var(--gif-border); display:flex; align-items:center; gap:12px;">
                        <img :src="mediaModal.url" style="width:68px; height:52px; object-fit:cover; border-radius:6px;" />
                        <div style="min-width:0; flex:1; font-size:11.5px;">
                            <div style="font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" x-text="mediaModal.url"></div>
                            <div style="color:var(--gif-success); font-weight:600;" x-show="mediaModal.sizeLabel" x-text="mediaModal.sizeLabel"></div>
                        </div>
                    </div>
                </div>

                <!-- Mandatory Alt Text + Caption + Lazy -->
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">
                            SEO Alt Text <span style="color:var(--gif-danger);">* (Required)</span>
                        </label>
                        <input type="text" x-model="mediaModal.alt" placeholder="Describe the image clearly (include focus keyphrase if relevant)..." class="gif-input" />
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Caption (Optional)</label>
                        <input type="text" x-model="mediaModal.caption" placeholder="Visible figure caption below image..." class="gif-input" />
                    </div>
                    <label class="gif-checkbox-label">
                        <input type="checkbox" x-model="mediaModal.lazy" />
                        <span>Add <code>loading="lazy"</code> attribute for Core Web Vitals</span>
                    </label>
                </div>
            </div>

            <div class="gif-modal-footer">
                <button type="button" @click="mediaModal.open = false" class="gif-btn gif-btn-secondary">Cancel</button>
                <button type="button" @click="insertMediaAsset()" class="gif-btn gif-btn-primary">Insert Into Article</button>
            </div>
        </div>
    </div>

    {{-- =====================================================================
         MODAL 2: INSERT HYPERLINK (ANCHOR + INTERNAL SEARCH + TARGET/NOFOLLOW)
         ===================================================================== --}}
    <div x-show="linkModal.open" style="display:none;" class="gif-modal-backdrop" @click.self="linkModal.open = false">
        <div class="gif-modal-window" style="max-width: 520px;">
            <div class="gif-modal-header">
                <span style="font-weight:800; font-size:14px;">Insert Hyperlink</span>
                <button type="button" @click="linkModal.open = false" class="gif-btn gif-btn-secondary gif-btn-xs">✕</button>
            </div>

            <div class="gif-modal-body" style="display:flex; flex-direction:column; gap:12px;">
                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Anchor Text</label>
                    <input type="text" x-model="linkModal.text" placeholder="Clickable anchor text..." class="gif-input" />
                </div>

                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Destination URL</label>
                    <input type="url" x-model="linkModal.url" placeholder="https://getintofeed.com/..." class="gif-input" style="font-family:monospace;" />
                </div>

                <div style="display:flex; flex-direction:column; gap:6px;">
                    <label class="gif-checkbox-label">
                        <input type="checkbox" x-model="linkModal.newTab" />
                        <span>Open in new tab (<code>target="_blank"</code>)</span>
                    </label>
                    <label class="gif-checkbox-label">
                        <input type="checkbox" x-model="linkModal.nofollow" />
                        <span>Add <code>rel="nofollow"</code> attribute</span>
                    </label>
                </div>

                <!-- Quick Internal Post Picker -->
                <div class="gif-panel-box">
                    <div style="display:flex; gap:6px; margin-bottom:8px;">
                        <input type="text" x-model="linkModal.search" @input.debounce.250ms="searchLinkTargets()" placeholder="Or search published GetIntoFeed posts..." class="gif-input" />
                    </div>
                    <div style="max-height:150px; overflow-y:auto; display:flex; flex-direction:column; gap:4px;">
                        <template x-for="post in linkModal.results" :key="'lm-' + post.id">
                            <button type="button" @click="pickInternalLinkForModal(post)" style="text-align:left; padding:6px 8px; border-radius:6px; border:1px solid var(--gif-border); background:var(--gif-bg); cursor:pointer; color:var(--gif-text); font-size:11.5px;">
                                <div style="font-weight:700;" x-text="post.title"></div>
                                <div style="font-size:10.5px; color:var(--gif-accent); font-family:monospace;" x-text="post.url"></div>
                            </button>
                        </template>
                    </div>
                </div>
            </div>

            <div class="gif-modal-footer">
                <button type="button" @click="linkModal.open = false" class="gif-btn gif-btn-secondary">Cancel</button>
                <button type="button" @click="insertLink()" class="gif-btn gif-btn-primary">Insert Link</button>
            </div>
        </div>
    </div>

    {{-- =====================================================================
         MODAL 3: "ALSO READ" INTERNAL LINK CARD PICKER
         ===================================================================== --}}
    <div x-show="alsoReadModal.open" style="display:none;" class="gif-modal-backdrop" @click.self="alsoReadModal.open = false">
        <div class="gif-modal-window" style="max-width: 560px;">
            <div class="gif-modal-header">
                <span style="font-weight:800; font-size:14px;">Insert "Also Read" Internal Link Card</span>
                <button type="button" @click="alsoReadModal.open = false" class="gif-btn gif-btn-secondary gif-btn-xs">✕</button>
            </div>

            <div class="gif-modal-body" style="display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; gap:8px;">
                    <input
                        type="text"
                        x-model="alsoReadModal.search"
                        @input.debounce.250ms="searchAlsoReadPosts()"
                        placeholder="Search published posts by title, category, or keyphrase..."
                        class="gif-input"
                    />
                    <button type="button" @click="searchAlsoReadPosts()" class="gif-btn gif-btn-primary">Search</button>
                </div>

                <div x-show="alsoReadModal.loading" style="font-size:12px; color:var(--gif-text-muted);">Searching published posts...</div>

                <div x-show="!alsoReadModal.loading && alsoReadModal.results.length === 0" style="font-size:12px; color:var(--gif-text-muted);">
                    No published articles matched your search.
                </div>

                <div style="max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">
                    <template x-for="post in alsoReadModal.results" :key="'ar-' + post.id">
                        <div style="padding:10px 12px; border-radius:10px; border:1px solid var(--gif-border); background:var(--gif-bg-soft); display:flex; align-items:center; justify-content:space-between; gap:10px;">
                            <div style="min-width:0; flex:1;">
                                <div style="font-size:12.5px; font-weight:700;" x-text="post.title"></div>
                                <div style="font-size:11px; color:var(--gif-text-muted);" x-text="(post.category || 'Blog') + ' · ' + post.url"></div>
                            </div>
                            <button type="button" @click="insertAlsoReadCard(post)" class="gif-btn gif-btn-indigo gif-btn-xs">Insert Card</button>
                        </div>
                    </template>
                </div>
            </div>

            <div class="gif-modal-footer">
                <button type="button" @click="alsoReadModal.open = false" class="gif-btn gif-btn-secondary">Close</button>
            </div>
        </div>
    </div>

    {{-- =====================================================================
         MODAL 4: VIDEO EMBED (YOUTUBE / VIMEO ALLOW-LIST)
         ===================================================================== --}}
    <div x-show="videoModal.open" style="display:none;" class="gif-modal-backdrop" @click.self="videoModal.open = false">
        <div class="gif-modal-window" style="max-width: 480px;">
            <div class="gif-modal-header">
                <span style="font-weight:800; font-size:14px;">Embed Video (YouTube / Vimeo)</span>
                <button type="button" @click="videoModal.open = false" class="gif-btn gif-btn-secondary gif-btn-xs">✕</button>
            </div>
            <div class="gif-modal-body" style="display:flex; flex-direction:column; gap:12px;">
                <div x-show="videoModal.error" style="display:none; padding:8px 12px; border-radius:8px; background:var(--gif-danger-bg); border:1px solid var(--gif-danger-border); color:var(--gif-danger); font-size:12px;" x-text="videoModal.error"></div>
                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">YouTube or Vimeo HTTPS URL</label>
                    <input type="url" x-model="videoModal.url" placeholder="https://www.youtube.com/watch?v=..." class="gif-input" />
                </div>
                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:4px;">Video Accessibility Title</label>
                    <input type="text" x-model="videoModal.title" placeholder="Video walkthrough..." class="gif-input" />
                </div>
            </div>
            <div class="gif-modal-footer">
                <button type="button" @click="videoModal.open = false" class="gif-btn gif-btn-secondary">Cancel</button>
                <button type="button" @click="insertVideoEmbed()" class="gif-btn gif-btn-primary">Insert Video</button>
            </div>
        </div>
    </div>

    {{-- =====================================================================
         MODAL 5: RESPONSIVE DEVICE PREVIEW + SIGNED SHARE LINK
         ===================================================================== --}}
    <div x-show="previewModal.open" style="display:none;" class="gif-modal-backdrop" @click.self="previewModal.open = false">
        <div class="gif-modal-window" style="max-width: 960px;">
            <div class="gif-modal-header" style="flex-wrap:wrap; gap:8px;">
                <div class="gif-row-gap-2">
                    <span style="font-weight:800; font-size:14px;">Responsive Article Preview</span>
                    <div class="gif-mode-switch" role="group" aria-label="Preview Device Width">
                        <button type="button" @click="previewModal.device = 'mobile'" class="gif-mode-btn" :class="{ 'is-active': previewModal.device === 'mobile' }">Mobile 375px</button>
                        <button type="button" @click="previewModal.device = 'tablet'" class="gif-mode-btn" :class="{ 'is-active': previewModal.device === 'tablet' }">Tablet 768px</button>
                        <button type="button" @click="previewModal.device = 'desktop'" class="gif-mode-btn" :class="{ 'is-active': previewModal.device === 'desktop' }">Desktop</button>
                    </div>
                </div>
                <button type="button" @click="previewModal.open = false" class="gif-btn gif-btn-secondary gif-btn-xs">✕</button>
            </div>

            <div class="gif-modal-body" style="display:flex; flex-direction:column; gap:12px;">
                <div x-show="recordId" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px; padding:8px 12px; border-radius:10px; background:var(--gif-bg-soft); border:1px solid var(--gif-border);">
                    <div style="font-size:12px;">
                        <strong>Shareable Unlisted Draft Link:</strong>
                        <span x-show="!previewModal.shareUrl" style="color:var(--gif-text-muted);">Generate a signed temporary URL to share with clients or editors.</span>
                        <a x-show="previewModal.shareUrl" :href="previewModal.shareUrl" target="_blank" rel="noopener noreferrer" style="color:var(--gif-accent); font-family:monospace; word-break:break-all;" x-text="previewModal.shareUrl"></a>
                    </div>
                    <div class="gif-row-gap-2">
                        <button type="button" @click="generateSignedPreviewLink()" class="gif-btn gif-btn-indigo gif-btn-xs" :disabled="previewModal.loadingShare">
                            <span x-text="previewModal.loadingShare ? 'Generating...' : 'Generate Link'"></span>
                        </button>
                        <button type="button" x-show="previewModal.shareUrl" @click="copyPreviewShareUrl()" class="gif-btn gif-btn-secondary gif-btn-xs">Copy</button>
                    </div>
                </div>

                <div x-show="previewModal.error" style="display:none; padding:8px 12px; border-radius:8px; background:var(--gif-danger-bg); color:var(--gif-danger); font-size:12px;" x-text="previewModal.error"></div>

                <div class="gif-preview-stage">
                    <article class="gif-preview-frame" :class="'is-' + previewModal.device">
                        <div style="font-size:11px; color:var(--gif-text-muted); margin-bottom:6px;" x-text="'URL: /blog/' + (slug || 'untitled-post') + ' · Visibility: ' + (visibility || 'public')"></div>
                        <h1 style="font-size:1.65rem; font-weight:800; line-height:1.25; margin:0 0 12px;" x-text="title || 'Untitled Article'"></h1>
                        <p x-show="excerpt" style="color:var(--gif-text-muted); margin:0 0 16px; font-size:14px;" x-text="excerpt"></p>
                        <div x-html="renderedPreviewBodyHtml()" style="font-size:15px; line-height:1.7;"></div>
                    </article>
                </div>
            </div>

            <div class="gif-modal-footer">
                <button type="button" @click="previewModal.open = false" class="gif-btn gif-btn-secondary">Close Preview</button>
            </div>
        </div>
    </div>

    {{-- =====================================================================
         DRAWER: SLIDE-OVER REVISIONS HISTORY + DIFF + 1-CLICK RESTORE
         ===================================================================== --}}
    <div x-show="revisionsDrawer.open" style="display:none;" class="gif-drawer-backdrop" @click.self="revisionsDrawer.open = false">
        <div class="gif-drawer-panel" role="dialog" aria-label="Post Revision History">
            <div class="gif-modal-header">
                <div>
                    <div style="font-weight:800; font-size:14px;">Revision History &amp; Diff</div>
                    <div style="font-size:11px; color:var(--gif-text-muted);">Compare snapshots or restore any version safely</div>
                </div>
                <button type="button" @click="revisionsDrawer.open = false" class="gif-btn gif-btn-secondary gif-btn-xs">✕</button>
            </div>

            <div class="gif-modal-body" style="display:flex; flex-direction:column; gap:12px;">
                <div x-show="revisionsDrawer.error" style="padding:8px 12px; border-radius:8px; background:var(--gif-danger-bg); color:var(--gif-danger); font-size:12px;" x-text="revisionsDrawer.error"></div>
                <div x-show="revisionsDrawer.loading" style="font-size:12px; color:var(--gif-text-muted);">Loading saved revisions...</div>

                <template x-if="!revisionsDrawer.loading && revisionsDrawer.items.length >= 2">
                    <div class="gif-panel-box">
                        <div style="font-size:12px; font-weight:700; margin-bottom:8px;">Compare Revisions</div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr auto; gap:8px; align-items:center;">
                            <select x-model="revisionsDrawer.selectedFrom" class="gif-input" aria-label="Compare From Revision">
                                <template x-for="r in revisionsDrawer.items" :key="'from-' + r.id">
                                    <option :value="r.id" x-text="'v' + r.revision_number + ' · ' + (r.type || 'manual')"></option>
                                </template>
                            </select>
                            <select x-model="revisionsDrawer.selectedTo" class="gif-input" aria-label="Compare To Revision">
                                <template x-for="r in revisionsDrawer.items" :key="'to-' + r.id">
                                    <option :value="r.id" x-text="'v' + r.revision_number + ' · ' + (r.type || 'manual')"></option>
                                </template>
                            </select>
                            <button type="button" @click="loadRevisionDiff()" class="gif-btn gif-btn-primary gif-btn-xs">Diff</button>
                        </div>

                        <div x-show="revisionsDrawer.diffLoading" style="font-size:11.5px; color:var(--gif-text-muted); margin-top:8px;">Computing line diff...</div>

                        <template x-if="revisionsDrawer.diff && !revisionsDrawer.diffLoading">
                            <div style="margin-top:10px; max-height:200px; overflow-y:auto; padding:8px; border-radius:8px; background:var(--gif-bg); border:1px solid var(--gif-border);">
                                <template x-if="revisionsDrawer.diff.fields?.title?.changed">
                                    <div style="font-size:11.5px; margin-bottom:6px;">
                                        <strong>Title changed:</strong>
                                        <span class="gif-diff-line is-removed" x-text="'- ' + revisionsDrawer.diff.fields.title.from"></span>
                                        <span class="gif-diff-line is-added" x-text="'+ ' + revisionsDrawer.diff.fields.title.to"></span>
                                    </div>
                                </template>
                                <template x-for="(line, lIdx) in (revisionsDrawer.diff.content_lines || [])" :key="'dl-' + lIdx">
                                    <div
                                        x-show="line.type !== 'unchanged'"
                                        class="gif-diff-line"
                                        :class="line.type === 'added' ? 'is-added' : 'is-removed'"
                                        x-text="(line.type === 'added' ? '+ ' : '- ') + line.text"
                                    ></div>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>

                <div style="display:flex; flex-direction:column; gap:8px;">
                    <template x-for="rev in revisionsDrawer.items" :key="'rev-' + rev.id">
                        <div style="padding:10px 12px; border-radius:10px; border:1px solid var(--gif-border); background:var(--gif-bg-soft); display:flex; align-items:center; justify-content:space-between; gap:10px;">
                            <div style="min-width:0; flex:1;">
                                <div style="font-size:12.5px; font-weight:700;" x-text="'Revision #' + rev.revision_number + ' · ' + (rev.title || 'Untitled')"></div>
                                <div style="font-size:11px; color:var(--gif-text-muted);" x-text="(rev.type || 'manual').toUpperCase() + ' · ' + (rev.author?.name || 'System') + ' · ' + (rev.change_summary || 'Snapshot')"></div>
                            </div>
                            <button type="button" @click="restoreServerRevision(rev.id)" :disabled="revisionsDrawer.restoring" class="gif-btn gif-btn-secondary gif-btn-xs">
                                Restore
                            </button>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>

    {{-- =====================================================================
         MOBILE STICKY BOTTOM ACTION BAR (< 1024px)
         ===================================================================== --}}
    <div class="gif-mobile-bottom-bar" x-show="!isKeyboardOpen" aria-label="Mobile Quick Actions">
        <button type="button" @click="mobileSaveDraft()" class="gif-btn gif-btn-secondary">Save Draft</button>
        <button type="button" @click="openPreviewModal()" class="gif-btn gif-btn-secondary">Preview</button>
        <button type="button" @click="mobilePublish()" class="gif-btn gif-btn-primary" x-text="canPublish ? 'Publish' : 'Submit'"></button>
    </div>
</div>
