@php
    $record = isset($getRecord) && is_callable($getRecord) ? $getRecord() : null;
    $comp = $component ?? null;
    $livewireData = null;
    if (isset($comp)) {
        try {
            $livewireData = $comp->getLivewire()->data ?? null;
        } catch (\Throwable $e) {}
    }

    $resolver = function ($key) use ($record, $comp, $livewireData) {
        if ($livewireData) {
            $val = data_get($livewireData, $key);
            if ($val !== null && $val !== '') {
                return $val;
            }
        }
        if (isset($comp) && method_exists($comp, 'getContainer')) {
            try {
                $raw = $comp->getContainer()->getRawState();
                if (isset($raw[$key]) && $raw[$key] !== '') {
                    return $raw[$key];
                }
            } catch (\Throwable $e) {}
        }
        if ($record) {
            return str_contains($key, '.') ? data_get($record, $key) : ($record->$key ?? null);
        }

        return null;
    };

    $status = (string) ($resolver('status') ?: 'draft');
    $visibility = (string) ($resolver('visibility') ?: 'public');
    $publishedAt = $resolver('published_at');
    $scheduledFor = $resolver('scheduled_for') ?: $resolver('scheduled_at');
    $isFeatured = (bool) ($resolver('is_featured') ?: false);
    $slug = (string) ($resolver('slug') ?: '');
    $canPublish = (bool) (auth()->user()?->hasCmsPermission('blog.publish') ?? false);

    $seoScore = (int) ($resolver('seo_score') ?? ($record?->effectiveSeoScore() ?? 0));
    $content = (string) ($resolver('content') ?: ($resolver('content_html') ?? ''));
    $wordCount = str_word_count(strip_tags($content));
    $readabilityLabel = $wordCount >= 250 ? 'Good' : ($wordCount > 50 ? 'OK' : ($wordCount > 0 ? 'Short' : 'Not available'));
@endphp

<div
    wire:ignore
    x-data="wpPublishMetabox({
        status: @js($status),
        visibility: @js($visibility),
        publishedAt: @js($publishedAt),
        scheduledFor: @js($scheduledFor),
        isFeatured: @js($isFeatured),
        slug: @js($slug),
        seoScore: @js($seoScore),
        readabilityLabel: @js($readabilityLabel),
        canPublish: @js($canPublish)
    })"
    class="gif-sidebar-card"
>
    <!-- Header -->
    <div class="gif-sidebar-card-header">
        <div class="gif-row-gap-2">
            <svg class="gif-icon-sm gif-text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="gif-sidebar-title">Publish &amp; Status</span>
        </div>
        <span
            class="gif-badge"
            :class="status === 'published' ? 'gif-badge-success' : (status === 'scheduled' ? 'gif-badge-info' : 'gif-badge-warn')"
        >
            <span class="gif-dot" :class="status === 'published' ? 'gif-dot-success' : (status === 'scheduled' ? 'gif-dot-info' : 'gif-dot-warn')"></span>
            <span x-text="formatStatusLabel(status)"></span>
        </span>
    </div>

    <!-- Top Quick Actions -->
    <div class="gif-publish-top-actions">
        <button type="button" @click="saveDraft()" class="gif-btn gif-btn-secondary gif-flex-1">
            <svg class="gif-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            <span>Save Draft</span>
        </button>

        <button type="button" @click="openPreviewModal()" class="gif-btn gif-btn-secondary gif-flex-1">
            <span>Preview</span>
            <svg class="gif-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        </button>
    </div>

    <!-- Metadata Rows -->
    <div class="gif-publish-meta-list">
        <!-- Status -->
        <div class="gif-meta-block">
            <div class="gif-meta-row">
                <span class="gif-meta-label">Status</span>
                <div class="gif-row-gap-2">
                    <span class="gif-meta-value" x-text="formatStatusLabel(status)"></span>
                    <button type="button" @click="editStatus = !editStatus" class="gif-link-btn">Edit</button>
                </div>
            </div>
            <div x-show="editStatus" style="display:none;" class="gif-flyout">
                <select x-model="tempStatus" class="gif-input">
                    <option value="draft">Draft</option>
                    <option value="review">Pending Review</option>
                    <option value="approved">Approved</option>
                    @if($canPublish)
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                    @endif
                </select>
                <div class="gif-row-gap-2" style="margin-top: 8px;">
                    <button type="button" @click="applyStatus()" class="gif-btn gif-btn-primary gif-btn-xs">OK</button>
                    <button type="button" @click="tempStatus = status; editStatus = false;" class="gif-link-btn">Cancel</button>
                </div>
            </div>
        </div>

        <!-- Visibility & Featured -->
        <div class="gif-meta-block">
            <div class="gif-meta-row">
                <span class="gif-meta-label">Visibility</span>
                <div class="gif-row-gap-2">
                    <span class="gif-meta-value" x-text="formatVisibilityLabel(visibility) + (isFeatured ? ' · Pinned' : '')"></span>
                    <button type="button" @click="editVisibility = !editVisibility" class="gif-link-btn">Edit</button>
                </div>
            </div>
            <div x-show="editVisibility" style="display:none;" class="gif-flyout">
                <select x-model="tempVisibility" class="gif-input" style="margin-bottom:8px;">
                    <option value="public">Public (Listed &amp; Indexed)</option>
                    <option value="unlisted">Unlisted (Direct URL Only)</option>
                    <option value="private">Private (Admins/Editors Only)</option>
                </select>
                <label class="gif-checkbox-label">
                    <input type="checkbox" x-model="tempFeatured" />
                    <span>Stick this post to the front hub (Featured)</span>
                </label>
                <div class="gif-row-gap-2" style="margin-top: 8px;">
                    <button type="button" @click="applyVisibility()" class="gif-btn gif-btn-primary gif-btn-xs">OK</button>
                    <button type="button" @click="tempFeatured = isFeatured; tempVisibility = visibility; editVisibility = false;" class="gif-link-btn">Cancel</button>
                </div>
            </div>
        </div>

        <!-- Publish / Schedule Date (IST) -->
        <div class="gif-meta-block">
            <div class="gif-meta-row">
                <span class="gif-meta-label" x-text="status === 'scheduled' ? 'Schedule (IST)' : 'Publish Date'"></span>
                <div class="gif-row-gap-2">
                    <span class="gif-meta-value" x-text="formatDateLabel()"></span>
                    <button type="button" @click="editDate = !editDate" class="gif-link-btn">Edit</button>
                </div>
            </div>
            <div x-show="editDate" style="display:none;" class="gif-flyout">
                <input type="datetime-local" x-model="tempDate" class="gif-input" />
                <div style="font-size:10.5px; color:var(--gif-text-muted); margin-top:4px;">Timezone: IST (Asia/Kolkata, UTC+5:30)</div>
                <div class="gif-row-gap-2" style="margin-top: 8px;">
                    <button type="button" @click="applyDate()" class="gif-btn gif-btn-primary gif-btn-xs">OK</button>
                    <button type="button" @click="editDate = false;" class="gif-link-btn">Cancel</button>
                </div>
            </div>
        </div>

        <!-- Live SEO Score -->
        <div class="gif-meta-row">
            <button type="button" @click="scrollToSeoStudio('audit')" class="gif-link-btn" style="padding: 0; font-weight: 600;">
                SEO Studio Score
            </button>
            <span
                class="gif-badge"
                :class="seoScore >= 80 ? 'gif-badge-success' : (seoScore >= 55 ? 'gif-badge-warn' : 'gif-badge-danger')"
                x-text="seoScore + ' / 100'"
            ></span>
        </div>

        <!-- Live Readability -->
        <div class="gif-meta-row" style="border-bottom: none; padding-bottom: 0;">
            <button type="button" @click="scrollToSeoStudio('readability')" class="gif-link-btn" style="padding: 0; font-weight: 600;">
                Readability
            </button>
            <span
                class="gif-badge"
                :class="readabilityLabel === 'Good' || readabilityLabel === 'Very Easy' ? 'gif-badge-success' : 'gif-badge-neutral'"
                x-text="readabilityLabel"
            ></span>
        </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="gif-publish-bottom-actions">
        <button type="button" @click="moveToTrash()" class="gif-btn gif-btn-danger-ghost">
            Move to Trash
        </button>

        @if($canPublish)
            <button type="button" @click="publishPost()" class="gif-btn gif-btn-primary">
                <svg class="gif-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span x-text="status === 'published' ? 'Update Post' : (status === 'scheduled' ? 'Save Schedule' : 'Publish Post')"></span>
            </button>
        @else
            <button type="button" @click="saveDraft()" class="gif-btn gif-btn-primary">
                <svg class="gif-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span>Submit Draft</span>
            </button>
        @endif
    </div>
</div>

<script>
(function () {
    function registerWpPublish() {
        if (!window.Alpine) return;

        window.Alpine.data('wpPublishMetabox', (cfg) => ({
            status: cfg.status || 'draft',
            visibility: cfg.visibility || 'public',
            publishedAt: cfg.publishedAt || '',
            scheduledFor: cfg.scheduledFor || '',
            isFeatured: Boolean(cfg.isFeatured),
            slug: cfg.slug || '',
            seoScore: Number(cfg.seoScore || 0),
            readabilityLabel: cfg.readabilityLabel || 'Not available',
            canPublish: Boolean(cfg.canPublish),

            editStatus: false,
            editVisibility: false,
            editDate: false,
            tempStatus: cfg.status || 'draft',
            tempVisibility: cfg.visibility || 'public',
            tempFeatured: Boolean(cfg.isFeatured),
            tempDate: '',

            init() {
                const rawDt = this.status === 'scheduled' ? this.scheduledFor : this.publishedAt;
                this.tempDate = this.toDatetimeLocal(rawDt);

                window.addEventListener('gif-editor-updated', (e) => {
                    if (!e.detail) return;
                    if (typeof e.detail.seoScore === 'number') this.seoScore = e.detail.seoScore;
                    if (e.detail.readabilityLabel) this.readabilityLabel = e.detail.readabilityLabel;
                    if (typeof e.detail.slug === 'string') this.slug = e.detail.slug;
                });
                window.addEventListener('gif-mobile-save-draft', () => this.saveDraft());
                window.addEventListener('gif-mobile-publish', () => this.publishPost());

                if (this.$wire) {
                    const liveStatus = this.$wire.get('data.status');
                    if (liveStatus) {
                        this.status = liveStatus;
                        this.tempStatus = liveStatus;
                    }
                    const liveSlug = this.$wire.get('data.slug');
                    if (liveSlug) this.slug = liveSlug;
                }
            },

            toDatetimeLocal(val) {
                if (!val) return '';
                try {
                    const str = String(val).replace(' ', 'T').slice(0, 16);
                    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str) ? str : '';
                } catch (e) {
                    return '';
                }
            },

            formatStatusLabel(s) {
                switch (s) {
                    case 'published': return 'Published';
                    case 'scheduled': return 'Scheduled';
                    case 'review': return 'Pending Review';
                    case 'approved': return 'Approved';
                    default: return 'Draft';
                }
            },

            formatVisibilityLabel(v) {
                switch (v) {
                    case 'unlisted': return 'Unlisted';
                    case 'private': return 'Private';
                    default: return 'Public';
                }
            },

            formatDateLabel() {
                const dt = this.status === 'scheduled' ? this.scheduledFor : this.publishedAt;
                if (!dt) return this.status === 'scheduled' ? 'Pick date' : 'Immediately';
                try {
                    const d = new Date(dt);
                    if (isNaN(d.getTime())) return String(dt);
                    return d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' });
                } catch (e) {
                    return String(dt);
                }
            },

            applyStatus() {
                this.status = this.tempStatus;
                if (this.$wire) {
                    this.$wire.set('data.status', this.tempStatus, false);
                }
                this.editStatus = false;
            },

            applyVisibility() {
                this.visibility = this.tempVisibility || 'public';
                this.isFeatured = Boolean(this.tempFeatured);
                if (this.$wire) {
                    this.$wire.set('data.visibility', this.visibility, false);
                    this.$wire.set('data.is_featured', this.isFeatured, false);
                }
                this.editVisibility = false;
            },

            openPreviewModal() {
                this.syncEditor();
                window.dispatchEvent(new CustomEvent('gif-open-preview-modal'));
            },

            applyDate() {
                const formatted = this.tempDate ? this.tempDate.replace('T', ' ') + ':00' : null;
                if (this.status === 'scheduled') {
                    this.scheduledFor = formatted || '';
                    if (this.$wire) this.$wire.set('data.scheduled_for', formatted, false);
                } else {
                    this.publishedAt = formatted || '';
                    if (this.$wire) this.$wire.set('data.published_at', formatted, false);
                }
                this.editDate = false;
            },

            syncEditor() {
                window.dispatchEvent(new CustomEvent('sync-wp-editor'));
            },

            submitLivewireForm() {
                if (this.$wire) {
                    if (typeof this.$wire.save === 'function') {
                        this.$wire.save();
                        return;
                    }
                    if (typeof this.$wire.create === 'function') {
                        this.$wire.create();
                        return;
                    }
                }
                const btn = document.querySelector('form button[type="submit"]');
                if (btn) btn.click();
            },

            saveDraft() {
                this.syncEditor();
                this.status = 'draft';
                this.tempStatus = 'draft';
                if (this.$wire) {
                    this.$wire.set('data.status', 'draft', false);
                }
                this.submitLivewireForm();
            },

            publishPost() {
                this.syncEditor();
                if (!this.canPublish) {
                    this.saveDraft();
                    return;
                }
                if (this.status !== 'scheduled') {
                    this.status = 'published';
                    this.tempStatus = 'published';
                    if (this.$wire) {
                        this.$wire.set('data.status', 'published', false);
                        if (!this.publishedAt) {
                            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
                            this.publishedAt = now;
                            this.$wire.set('data.published_at', now, false);
                        }
                    }
                } else if (this.$wire) {
                    this.$wire.set('data.status', 'scheduled', false);
                }
                this.submitLivewireForm();
            },

            moveToTrash() {
                if (!confirm('Are you sure you want to archive / move this post to trash?')) return;
                if (this.$wire && typeof this.$wire.mountAction === 'function') {
                    try {
                        this.$wire.mountAction('delete');
                        return;
                    } catch (e) {}
                }
                const delBtn = document.querySelector('[wire\\:click*="delete"]');
                if (delBtn) delBtn.click();
            },

            scrollToSeoStudio(tab) {
                const studio = document.getElementById('gif-seo-studio-pro');
                if (studio) {
                    studio.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.dispatchEvent(new CustomEvent('gif-switch-seo-tab', { detail: { tab } }));
                }
            }
        }));
    }

    if (window.Alpine) {
        registerWpPublish();
    }
    document.addEventListener('alpine:init', registerWpPublish);
})();
</script>
