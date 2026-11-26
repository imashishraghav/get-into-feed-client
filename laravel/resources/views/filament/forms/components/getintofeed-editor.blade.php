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
    $initialFeaturedUrl = $record?->featuredMedia?->url ?? '';
@endphp

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
            wordCount: cfg.wordCount,
            readingTime: cfg.readingTime,
            featuredImageAlt: cfg.featuredImageAlt,
            featuredMediaId: cfg.featuredMediaId,

            // Config & lookups
            recordId: cfg.recordId || null,
            csrfToken: cfg.csrfToken || '',
            uploadEndpoint: cfg.uploadEndpoint || '/admin/editor/upload-image',
            internalLinksEndpoint: cfg.internalLinksEndpoint || '/admin/editor/internal-links',
            mediaListEndpoint: cfg.mediaListEndpoint || '/admin/media/list',
            mediaUrlMap: cfg.mediaUrlMap || {},
            mediaAssets: cfg.mediaAssets || [],
            featuredImageUrl: cfg.initialFeaturedUrl || '',

            // Editor UI state
            mode: 'visual',
            isFocusMode: false,
            isExcerptOpen: false,
            isEditingSlug: false,
            slugCustomized: Boolean(cfg.recordId),
            tempSlug: '',
            savedRange: null,
            _auditTimer: null,
            _syncTimer: null,
            _localSaveTimer: null,
            _canvasCtx: null,

            // Auto-save recovery
            autoSaveStatus: 'Synced',
            hasRecoverableDraft: false,
            recoverableDraftTime: '',

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
            toast: {
                show: false,
                message: '',
            },

            initEditor() {
                // Coalesce null server values cleanly for legacy records
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
                this.tempSlug = this.slug;

                this.$nextTick(() => {
                    if (this.$refs.visualCanvas) {
                        this.$refs.visualCanvas.innerHTML = this.content || '';
                    }
                    this.resolveFeaturedImageUrl();
                    this.runFullAnalysis();
                    this.checkLocalDraftRecovery();
                    this.fetchInternalSuggestions();
                });

                // Watch sidebar live updates
                this.$watch('featuredMediaId', () => {
                    this.resolveFeaturedImageUrl();
                    this.scheduleAudit();
                });
                this.$watch('featuredImageAlt', () => {
                    this.scheduleAudit();
                });

                // External events from Publish box, TOC sidebar, and form submission
                window.addEventListener('sync-wp-editor', () => {
                    this.flushContentToWire();
                });
                window.addEventListener('gif-switch-seo-tab', (e) => {
                    if (e.detail && e.detail.tab) {
                        this.seoTab = e.detail.tab;
                    }
                });
                window.addEventListener('gif-scroll-to-heading', (e) => {
                    if (!e.detail || typeof e.detail.index !== 'number') return;
                    this.scrollToEditorHeading(e.detail.index);
                });

                const formEl = this.$el.closest('form');
                if (formEl) {
                    formEl.addEventListener('submit', () => {
                        this.flushContentToWire();
                        this.clearLocalDraft();
                    });
                }
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
                this.scheduleAudit();
                this.scheduleLocalSave();
            },

            saveSlug() {
                this.slug = this.slugify(this.tempSlug || this.title);
                this.tempSlug = this.slug;
                this.slugCustomized = true;
                this.isEditingSlug = false;
                this.scheduleAudit();
                this.showToast('Permalink slug updated');
            },

            cancelSlug() {
                this.tempSlug = this.slug;
                this.isEditingSlug = false;
            },

            // Editor Input & Mode Switching (Zero Typing Lag)
            onVisualInput() {
                this.autoSaveStatus = 'Editing...';
                clearTimeout(this._syncTimer);
                this._syncTimer = setTimeout(() => {
                    if (this.$refs.visualCanvas) {
                        this.content = this.$refs.visualCanvas.innerHTML;
                    }
                    this.runFullAnalysis();
                    this.scheduleLocalSave();
                }, 180);
            },

            onVisualBlur() {
                this.flushContentToWire();
            },

            onHtmlInput() {
                this.autoSaveStatus = 'Editing HTML...';
                this.scheduleAudit();
                this.scheduleLocalSave();
            },

            flushContentToWire() {
                clearTimeout(this._syncTimer);
                if (this.mode === 'visual' && this.$refs.visualCanvas) {
                    this.content = this.$refs.visualCanvas.innerHTML;
                } else if (this.mode === 'html' && this.$refs.htmlTextarea) {
                    this.content = this.$refs.htmlTextarea.value;
                }
                this.runFullAnalysis();
            },

            switchMode(newMode) {
                if (newMode === this.mode) return;
                if (newMode === 'html') {
                    if (this.$refs.visualCanvas) {
                        this.content = this.$refs.visualCanvas.innerHTML;
                    }
                    this.mode = 'html';
                } else {
                    this.mode = 'visual';
                    this.$nextTick(() => {
                        if (this.$refs.visualCanvas) {
                            this.$refs.visualCanvas.innerHTML = this.content || '';
                        }
                    });
                }
                this.runFullAnalysis();
            },

            saveSelection() {
                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0) {
                    const range = sel.getRangeAt(0);
                    if (this.$refs.visualCanvas && this.$refs.visualCanvas.contains(range.commonAncestorContainer)) {
                        this.savedRange = range.cloneRange();
                    }
                }
            },

            restoreSelection() {
                if (this.savedRange && window.getSelection) {
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(this.savedRange);
                }
            },

            exec(cmd, val = null) {
                if (this.mode === 'html') {
                    this.showToast('Switch to Visual mode to use formatting tools.');
                    return;
                }
                if (this.$refs.visualCanvas) {
                    this.$refs.visualCanvas.focus();
                    document.execCommand(cmd, false, val);
                    this.flushContentToWire();
                }
            },

            execFormatBlock(tag) {
                // Strictly prevent H1 inside article body
                const safeTag = tag.toLowerCase() === 'h1' ? 'h2' : tag.toLowerCase();
                this.exec('formatBlock', '<' + safeTag + '>');
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
                    this.runFullAnalysis();
                    return;
                }
                if (this.$refs.visualCanvas) {
                    this.$refs.visualCanvas.focus();
                    if (this.savedRange) {
                        try { this.restoreSelection(); } catch (e) {}
                    }
                    let ok = false;
                    try {
                        ok = document.execCommand('insertHTML', false, html);
                    } catch (e) {}
                    if (!ok) {
                        this.$refs.visualCanvas.innerHTML += html;
                    }
                    this.flushContentToWire();
                }
            },

            scrollToEditorHeading(index) {
                if (this.mode !== 'visual') {
                    this.switchMode('visual');
                }
                this.$nextTick(() => {
                    if (!this.$refs.visualCanvas) return;
                    const headings = this.$refs.visualCanvas.querySelectorAll('h2, h3, h4');
                    const el = headings[index];
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.style.outline = '2px solid #2563eb';
                        el.style.borderRadius = '4px';
                        setTimeout(() => { el.style.outline = ''; }, 1400);
                    }
                });
            },

            // One-Click Custom SEO Blocks
            insertBlock(type) {
                if (type === 'alsoRead') {
                    this.openAlsoReadModal();
                    return;
                }

                let html = '';
                if (type === 'takeaways') {
                    html = `<div class="gif-block-takeaways" style="background-color:#f8fafc;border-left:4px solid #2563eb;border-radius:10px;padding:18px 20px;margin:24px 0;"><div style="font-weight:800;font-size:13px;text-transform:uppercase;color:#1e3a8a;letter-spacing:0.05em;margin-bottom:8px;">📌 Key Takeaways<\/div><ul style="margin:0;padding-left:20px;color:#334155;line-height:1.65;"><li>Core insight backed by verified industry benchmarks.<\/li><li>Actionable implementation step for higher conversion ROI.<\/li><li>Key metric to monitor after rolling out changes.<\/li><\/ul><\/div><p><br><\/p>`;
                } else if (type === 'faq') {
                    if (this.faqItems.length === 0) {
                        this.faqItems.push({
                            q: 'How does ' + (this.focusKeyphrase || 'this strategy') + ' improve results?',
                            a: 'It aligns search intent with structured, high-converting user journeys to maximize qualified leads and organic visibility.',
                        });
                    }
                    html = `<div class="gif-block-faq" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:28px 0;"><h2 style="font-size:20px;font-weight:800;color:#0f172a;margin-top:0;margin-bottom:14px;">Frequently Asked Questions<\/h2><div style="margin-bottom:12px;"><h3 style="font-size:16px;font-weight:700;color:#1e3a8a;margin:0 0 4px 0;">How does ${this.escapeHtml(this.focusKeyphrase || 'this strategy')} improve results?<\/h3><p style="margin:0;color:#475569;line-height:1.6;">It aligns search intent with structured, high-converting user journeys to maximize qualified leads and organic visibility.<\/p><\/div><\/div><p><br><\/p>`;
                } else if (type === 'table') {
                    html = `<div style="overflow-x:auto;margin:24px 0;border-radius:10px;border:1px solid #e2e8f0;"><table style="width:100%;border-collapse:collapse;min-width:480px;"><thead><tr style="background:#f8fafc;text-align:left;"><th style="padding:11px 14px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#0f172a;">Feature / Metric<\/th><th style="padding:11px 14px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#0f172a;">Traditional Approach<\/th><th style="padding:11px 14px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#2563eb;">Optimized Approach<\/th><\/tr><\/thead><tbody><tr><td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">Execution Velocity<\/td><td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">4–6 Weeks<\/td><td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-weight:600;color:#059669;">7-Day Sprint<\/td><\/tr><tr><td style="padding:10px 14px;">Conversion Impact<\/td><td style="padding:10px 14px;">Baseline<\/td><td style="padding:10px 14px;font-weight:600;color:#059669;">+35% to +120% Lift<\/td><\/tr><\/tbody><\/table><\/div><p><br><\/p>`;
                } else if (type === 'adsense') {
                    html = `<div class="gif-adsense-shortcode" data-adsense-slot="in-article" style="margin:24px 0;padding:12px 16px;border:1px dashed #94a3b8;border-radius:8px;background:#f8fafc;text-align:center;font-family:monospace;font-size:12px;color:#475569;">[adsense_in_article]<\/div><p><br><\/p>`;
                } else if (type === 'proTip') {
                    html = `<div class="gif-block-protip" style="background-color:#ecfdf5;border-left:4px solid #10b981;border-radius:10px;padding:16px 18px;margin:22px 0;"><div style="font-weight:800;font-size:12px;text-transform:uppercase;color:#065f46;margin-bottom:4px;">💡 Pro Growth Tip<\/div><p style="margin:0;color:#047857;font-size:14px;line-height:1.6;">Use your primary focus keyphrase naturally in the opening 60 words and inside at least one H2 subheading.<\/p><\/div><p><br><\/p>`;
                }

                this.saveSelection();
                this.insertHtmlSnippet(html);
                this.showToast('SEO block inserted into article');
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

            // Media Modal (Auto-WebP Upload + Media Library Browser + Mandatory Alt Text)
            openMediaModal() {
                this.saveSelection();
                this.mediaModal.open = true;
                this.mediaModal.url = '';
                this.mediaModal.alt = this.focusKeyphrase ? (this.focusKeyphrase + ' guide visual') : '';
                this.mediaModal.caption = '';
                this.mediaModal.lazy = true;
                this.mediaModal.width = null;
                this.mediaModal.height = null;
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

                const src = this.escapeHtml(this.mediaModal.url.trim());
                const alt = this.escapeHtml(this.mediaModal.alt.trim());
                const lazyAttr = this.mediaModal.lazy ? ' loading="lazy"' : '';
                const dimAttrs = (this.mediaModal.width && this.mediaModal.height)
                    ? ` width="${Number(this.mediaModal.width)}" height="${Number(this.mediaModal.height)}"`
                    : '';

                let html = `<figure style="margin:24px auto;text-align:center;"><img src="${src}" alt="${alt}"${lazyAttr}${dimAttrs} style="max-width:100%;height:auto;border-radius:10px;" />`;
                if (this.mediaModal.caption.trim()) {
                    html += `<figcaption style="font-size:12px;color:#64748b;margin-top:8px;">${this.escapeHtml(this.mediaModal.caption.trim())}<\/figcaption>`;
                }
                html += `<\/figure><p><br><\/p>`;

                this.insertHtmlSnippet(html);
                this.mediaModal.open = false;
                this.showToast('Media inserted with SEO Alt Text & lazy loading');
            },

            // Link Modal (with Quick Internal Post Search + Nofollow + Target Blank)
            openLinkModal() {
                this.saveSelection();
                this.linkModal.url = '';
                this.linkModal.text = '';
                this.linkModal.newTab = false;
                this.linkModal.nofollow = false;
                this.linkModal.search = '';

                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0 && this.$refs.visualCanvas && this.$refs.visualCanvas.contains(sel.anchorNode)) {
                    this.linkModal.text = sel.toString();
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
                const html = `<a href="${safeUrl}"${targetAttr}${relAttr}>${anchor}<\/a>`;

                this.insertHtmlSnippet(html);
                this.linkModal.open = false;
                this.showToast('Hyperlink inserted');
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
                    if (this.mode === 'visual' && this.$refs.visualCanvas) {
                        this.$refs.visualCanvas.innerHTML = this.content;
                    }
                    this.runFullAnalysis();
                    this.showToast('Converted body <h1> headings to <h2> for strict SEO hierarchy');
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
                        if (this.$refs.visualCanvas) this.$refs.visualCanvas.innerHTML = parsed.content;
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
        wordCount: $wire.$entangle('data.word_count'),
        readingTime: $wire.$entangle('data.reading_time'),
        featuredImageAlt: $wire.$entangle('data.featured_image_alt'),
        featuredMediaId: $wire.$entangle('data.featured_media_id'),
        recordId: @js($recordId),
        csrfToken: @js(csrf_token()),
        uploadEndpoint: @js(route('admin.editor.upload-image')),
        internalLinksEndpoint: @js(route('admin.editor.internal-links')),
        mediaListEndpoint: @js(route('admin.media.list')),
        mediaAssets: @js($mediaAssets),
        mediaUrlMap: @js($mediaUrlMap),
        initialFeaturedUrl: @js($initialFeaturedUrl),
    })"
    x-init="initEditor()"
    @keydown.escape.window="mediaModal.open = false; linkModal.open = false; alsoReadModal.open = false; isFocusMode = false;"
    @keydown.ctrl.k.window.prevent="if ($refs.visualCanvas && document.activeElement === $refs.visualCanvas) openLinkModal()"
    @keydown.meta.k.window.prevent="if ($refs.visualCanvas && document.activeElement === $refs.visualCanvas) openLinkModal()"
    class="gif-editor-root"
    :class="{ 'is-focus-mode': isFocusMode }"
>
    <!-- Toast Notification -->
    <div x-show="toast.show" x-transition class="gif-toast" style="display: none;">
        <span class="gif-dot gif-dot-success"></span>
        <span x-text="toast.message"></span>
    </div>

    <!-- Local Draft Recovery Banner -->
    <div x-show="hasRecoverableDraft" style="display:none;" class="gif-recovery-banner">
        <div style="margin-bottom:12px; padding:10px 14px; border-radius:10px; background:var(--gif-warn-bg); border:1px solid var(--gif-warn-border); display:flex; align-items:center; justify-content:space-between; gap:10px; font-size:12px;">
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
                        <button type="button" @click="insertBlock('adsense'); open = false;" class="gif-dropdown-item">
                            <span>💰</span>
                            <div>
                                <div style="font-weight:700; font-size:12px;">AdSense In-Article Shortcode</div>
                                <div style="font-size:10.5px; color:var(--gif-text-muted);">Inserts [adsense_in_article] marker</div>
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
            </div>

            <!-- Focus Mode & Visual/HTML Toggle -->
            <div class="gif-row-gap-2">
                <button type="button" @click="isFocusMode = !isFocusMode" class="gif-btn gif-btn-secondary gif-btn-xs" :title="isFocusMode ? 'Exit Focus Mode (Esc)' : 'Distraction-Free Focus Mode'">
                    <span x-text="isFocusMode ? '✕ Exit Focus' : '⛶ Focus Mode'"></span>
                </button>

                <div class="gif-mode-switch">
                    <button type="button" @click="switchMode('visual')" class="gif-mode-btn" :class="{ 'is-active': mode === 'visual' }">Visual</button>
                    <button type="button" @click="switchMode('html')" class="gif-mode-btn" :class="{ 'is-active': mode === 'html' }">Raw HTML</button>
                </div>
            </div>
        </div>

        <!-- Sticky Formatting Toolbar (H1 Disabled Intentionally for Strict SEO Hierarchy) -->
        <div class="gif-sticky-toolbar">
            <select
                @change="execFormatBlock($event.target.value); $event.target.value = 'p';"
                class="gif-tb-select"
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

            <button type="button" @click="exec('bold')" class="gif-tb-btn" style="font-weight:800;" title="Bold (Ctrl+B)">B</button>
            <button type="button" @click="exec('italic')" class="gif-tb-btn" style="font-style:italic;font-family:serif;" title="Italic (Ctrl+I)">I</button>
            <button type="button" @click="exec('underline')" class="gif-tb-btn" style="text-decoration:underline;" title="Underline (Ctrl+U)">U</button>
            <button type="button" @click="exec('strikeThrough')" class="gif-tb-btn" style="text-decoration:line-through;" title="Strikethrough">S</button>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="exec('insertUnorderedList')" class="gif-tb-btn" title="Bullet List">• List</button>
            <button type="button" @click="exec('insertOrderedList')" class="gif-tb-btn" title="Numbered List">1. List</button>
            <button type="button" @click="execFormatBlock('blockquote')" class="gif-tb-btn" title="Blockquote">❝ Quote</button>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="exec('justifyLeft')" class="gif-tb-btn" title="Align Left">⫷</button>
            <button type="button" @click="exec('justifyCenter')" class="gif-tb-btn" title="Align Center">☰</button>
            <button type="button" @click="exec('justifyRight')" class="gif-tb-btn" title="Align Right">⫸</button>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="openLinkModal()" class="gif-tb-btn" style="color:var(--gif-accent);" title="Insert Link (Ctrl+K)">🔗 Link</button>
            <button type="button" @click="exec('insertHorizontalRule')" class="gif-tb-btn" title="Horizontal Rule">― HR</button>
            <button type="button" @click="exec('removeFormat')" class="gif-tb-btn" title="Clear Formatting">✕ Clear</button>

            <span class="gif-tb-sep"></span>

            <button type="button" @click="exec('undo')" class="gif-tb-btn" title="Undo (Ctrl+Z)">↩</button>
            <button type="button" @click="exec('redo')" class="gif-tb-btn" title="Redo (Ctrl+Y)">↪</button>
        </div>

        <!-- Writing Canvas -->
        <div>
            <div
                x-show="mode === 'visual'"
                x-ref="visualCanvas"
                contenteditable="true"
                @input="onVisualInput()"
                @blur="onVisualBlur()"
                class="gif-article-canvas"
            ></div>

            <textarea
                x-show="mode === 'html'"
                x-ref="htmlTextarea"
                x-model="content"
                @input="onHtmlInput()"
                class="gif-code-textarea"
                style="display: none;"
                placeholder="Write or paste semantic HTML here..."
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
                @input="scheduleAudit(); scheduleLocalSave();"
                rows="2"
                placeholder="Write a concise 1–2 sentence teaser displayed on the blog hub and fallback meta snippet..."
                class="gif-input"
            ></textarea>
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
                        <div style="font-weight:700; font-size:13px; margin-bottom:4px;" x-text="mediaModal.isUploading ? 'Converting & optimizing to WebP...' : 'Drop image here or click to upload'"></div>
                        <div style="font-size:11px; color:var(--gif-text-muted);">JPG, PNG, WebP, GIF · Max 5 MB · Automatically resized (&le;1400px) &amp; converted to WebP</div>
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
</div>
