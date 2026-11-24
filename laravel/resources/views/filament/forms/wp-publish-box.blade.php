@php
    $record = isset($getRecord) && is_callable($getRecord) ? $getRecord() : null;
    $comp = $component ?? null;
    $livewireData = null;
    if (isset($comp)) {
        try {
            $livewireData = $comp->getLivewire()->data ?? null;
        } catch (\Throwable $e) {}
    }

    $resolver = function($key) use ($record, $comp, $livewireData) {
        if ($livewireData) {
            $val = data_get($livewireData, $key);
            if ($val !== null && $val !== '') return $val;
        }
        if (isset($comp) && method_exists($comp, 'getContainer')) {
            try {
                $raw = $comp->getContainer()->getRawState();
                if (isset($raw[$key]) && $raw[$key] !== '') return $raw[$key];
            } catch (\Throwable $e) {}
        }
        if ($record) {
            if (str_contains($key, '.')) {
                return data_get($record, $key);
            }
            return $record->$key ?? null;
        }
        return null;
    };

    $status = (string)($resolver('status') ?: 'draft');
    $publishedAt = $resolver('published_at');
    $scheduledFor = $resolver('scheduled_for');
    $isFeatured = (bool)($resolver('is_featured') ?: false);
    $slug = (string)($resolver('slug') ?: '');
    $previewUrl = $slug ? "https://getintofeed.com/blog/{$slug}" : "https://getintofeed.com/blog";

    // SEO evaluation
    $focusKw = trim((string)($resolver('seo.focus_keyword') ?? ''));
    $hasSeo = !empty($focusKw);
    $seoScore = (int)($resolver('seo.seo_score') ?? 0);
    $seoLabel = $hasSeo ? ($seoScore >= 80 ? 'Good' : ($seoScore >= 50 ? 'OK' : 'Needs improvement')) : 'Not available';

    // Readability evaluation: if post has content or words, compute label, default to Good if record exists with length > 200
    $content = (string)($resolver('content') ?? ($resolver('body') ?? ''));
    $wordCount = str_word_count(strip_tags($content));
    if ($wordCount >= 250 || ($record && strlen($record->content ?? '') > 500)) {
        $readabilityLabel = 'Good';
    } elseif ($wordCount > 50) {
        $readabilityLabel = 'OK';
    } elseif ($wordCount > 0) {
        $readabilityLabel = 'Needs improvement';
    } else {
        $readabilityLabel = 'Not available';
    }
@endphp

<div
    x-data="wpPublishMetabox()"
    class="wp-metabox-card border border-[#dcdcde] dark:border-slate-700 bg-white dark:bg-slate-900 rounded-[2px] shadow-2xs overflow-hidden font-sans text-[13px] text-[#2c3338] dark:text-slate-200 mb-4 select-none"
    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;"
>
    <!-- Card Header: Classic WordPress "Publish" with Top Right Controls (1:1 Exact Match) -->
    <div
        class="flex items-center justify-between px-3.5 py-2.5 bg-white dark:bg-slate-900 border-b border-[#dcdcde] dark:border-slate-700"
    >
        <span class="font-bold text-[14px] text-[#1d2327] dark:text-slate-100">Publish</span>
        <div class="flex items-center space-x-1.5 text-[#50575e]">
            <!-- Light grey up chevron -->
            <svg class="w-3.5 h-3.5 text-[#a7aaad]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
            </svg>
            <!-- Dark down chevron -->
            <svg class="w-3.5 h-3.5 text-[#1d2327] dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
            </svg>
            <!-- Dark solid up triangle -->
            <svg class="w-2.5 h-2.5 fill-[#1d2327] dark:fill-slate-300" viewBox="0 0 24 24">
                <path d="M12 4l9 16H3z"/>
            </svg>
        </div>
    </div>

    <!-- Body -->
    <div>
        <!-- Top Action Row: Save Draft & Preview Buttons (Exact 1:1 Match) -->
        <div class="p-3.5 flex items-center justify-between gap-3">
            <button
                type="button"
                @click="saveDraft()"
                class="min-w-[115px] px-4 py-1.5 rounded-[3px] border border-[#2271b1] text-[#2271b1] dark:text-blue-400 dark:border-blue-500 hover:bg-[#f0f6fc] dark:hover:bg-blue-950/40 text-[13px] font-normal transition bg-white dark:bg-slate-900 shadow-2xs cursor-pointer text-center"
            >
                Save Draft
            </button>

            <a
                href="{{ $previewUrl }}"
                target="_blank"
                rel="noopener noreferrer"
                class="min-w-[115px] px-4 py-1.5 rounded-[3px] border border-[#2271b1] text-[#2271b1] dark:text-blue-400 dark:border-blue-500 hover:bg-[#f0f6fc] dark:hover:bg-blue-950/40 text-[13px] font-normal transition bg-white dark:bg-slate-900 shadow-2xs no-underline text-center cursor-pointer inline-block"
            >
                Preview
            </a>
        </div>

        <!-- Metadata Section: Status, Visibility, Publish Date, SEO, Readability (Exact 1:1 Match) -->
        <div class="px-3.5 pb-4 space-y-3 text-[13px]">
            <!-- 1. Status Row -->
            <div>
                <div class="flex items-center space-x-2.5">
                    <!-- Key Icon: Classic Skeleton Key -->
                    <div class="w-5 flex items-center justify-center shrink-0">
                        <svg class="w-4 h-4 text-[#2c3338] dark:text-slate-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 2a4.5 4.5 0 0 0-1 8.89V15a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1v-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1v-.11A4.5 4.5 0 0 0 10 2zm0 2.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="flex items-center flex-wrap gap-1">
                        <span class="text-[#2c3338] dark:text-slate-300">Status:</span>
                        <strong class="font-bold text-[#1d2327] dark:text-white" x-text="formatStatusLabel(status)"></strong>
                        <button
                            type="button"
                            @click="editStatus = !editStatus"
                            class="text-[#2271b1] dark:text-blue-400 underline hover:text-[#135e96] text-[13px] bg-transparent border-none p-0 cursor-pointer ml-0.5"
                        >Edit</button>
                    </div>
                </div>

                <!-- Status Inline Edit Flyout -->
                <div x-show="editStatus" style="display:none;" class="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 space-y-2">
                    <select
                        x-model="tempStatus"
                        class="w-full text-xs rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-1.5 text-slate-800 dark:text-white"
                    >
                        <option value="draft">Draft</option>
                        <option value="review">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                    </select>
                    <div class="flex items-center space-x-2 pt-1">
                        <button
                            type="button"
                            @click="applyStatus()"
                            class="px-2.5 py-1 bg-[#2271b1] text-white rounded text-xs font-semibold hover:bg-[#135e96] cursor-pointer"
                        >
                            OK
                        </button>
                        <button
                            type="button"
                            @click="tempStatus = status; editStatus = false;"
                            class="text-xs text-[#2271b1] hover:underline cursor-pointer bg-transparent border-none"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            <!-- 2. Visibility Row -->
            <div>
                <div class="flex items-center space-x-2.5">
                    <!-- Eye Icon: Outlined Almond with Center Solid Pupil -->
                    <div class="w-5 flex items-center justify-center shrink-0">
                        <svg class="w-4 h-4 text-[#2c3338] dark:text-slate-200" viewBox="0 0 20 20" fill="none">
                            <path d="M1.5 10c1.8-4.5 5-7 8.5-7s6.7 2.5 8.5 7c-1.8 4.5-5 7-8.5 7s-6.7-2.5-8.5-7z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="10" cy="10" r="2.8" fill="currentColor"/>
                        </svg>
                    </div>
                    <div class="flex items-center flex-wrap gap-1">
                        <span class="text-[#2c3338] dark:text-slate-300">Visibility:</span>
                        <strong class="font-bold text-[#1d2327] dark:text-white" x-text="visibility === 'public' ? 'Public' : 'Private'"></strong>
                        <button
                            type="button"
                            @click="editVisibility = !editVisibility"
                            class="text-[#2271b1] dark:text-blue-400 underline hover:text-[#135e96] text-[13px] bg-transparent border-none p-0 cursor-pointer ml-0.5"
                        >Edit</button>
                    </div>
                </div>

                <!-- Visibility Inline Edit Flyout -->
                <div x-show="editVisibility" style="display:none;" class="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" value="public" x-model="tempVisibility" class="text-blue-600 focus:ring-0" />
                        <span>Public</span>
                    </label>
                    <label class="flex items-center space-x-2 pl-4 cursor-pointer text-slate-600 dark:text-slate-300">
                        <input type="checkbox" x-model="tempFeatured" class="rounded text-blue-600 focus:ring-0" />
                        <span>Stick this post to the front page</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" value="private" x-model="tempVisibility" class="text-blue-600 focus:ring-0" />
                        <span>Private</span>
                    </label>
                    <div class="flex items-center space-x-2 pt-1">
                        <button
                            type="button"
                            @click="applyVisibility()"
                            class="px-2.5 py-1 bg-[#2271b1] text-white rounded text-xs font-semibold hover:bg-[#135e96] cursor-pointer"
                        >
                            OK
                        </button>
                        <button
                            type="button"
                            @click="tempVisibility = visibility; tempFeatured = isFeatured; editVisibility = false;"
                            class="text-xs text-[#2271b1] hover:underline cursor-pointer bg-transparent border-none"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            <!-- 3. Publish Date Row -->
            <div>
                <div class="flex items-center space-x-2.5">
                    <!-- Calendar Icon: 3 Rings, Top Line, 3 Vertical Columns -->
                    <div class="w-5 flex items-center justify-center shrink-0">
                        <svg class="w-4 h-4 text-[#2c3338] dark:text-slate-200" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 1.5a.75.75 0 01.75.75V3h2.5V2.25a.75.75 0 011.5 0V3h2.5V2.25a.75.75 0 011.5 0V3h2.5V2.25a.75.75 0 011.5 0V3h.25A2.75 2.75 0 0119 5.75v10.5A2.75 2.75 0 0116.25 19H3.75A2.75 2.75 0 011 16.25V5.75A2.75 2.75 0 013.75 3H4V2.25A.75.75 0 014 1.5zM2.5 7.5v8.75c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V7.5H2.5zm3 2.5h2v5h-2v-5zm4 0h2v5h-2v-5zm4 0h2v5h-2v-5z"/>
                        </svg>
                    </div>
                    <div class="flex items-center flex-wrap gap-1">
                        <span class="text-[#2c3338] dark:text-slate-300" x-text="status === 'published' ? 'Published' : 'Publish'"></span>
                        <strong class="font-bold text-[#1d2327] dark:text-white" x-text="formatDateLabel()"></strong>
                        <button
                            type="button"
                            @click="editDate = !editDate"
                            class="text-[#2271b1] dark:text-blue-400 underline hover:text-[#135e96] text-[13px] bg-transparent border-none p-0 cursor-pointer ml-0.5"
                        >Edit</button>
                    </div>
                </div>

                <!-- Date Inline Edit Flyout -->
                <div x-show="editDate" style="display:none;" class="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <input
                        type="datetime-local"
                        x-model="tempDate"
                        class="w-full text-xs rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-1.5 text-slate-800 dark:text-white"
                    />
                    <div class="flex items-center space-x-2 pt-1">
                        <button
                            type="button"
                            @click="applyDate()"
                            class="px-2.5 py-1 bg-[#2271b1] text-white rounded text-xs font-semibold hover:bg-[#135e96] cursor-pointer"
                        >
                            OK
                        </button>
                        <button
                            type="button"
                            @click="tempDate = publishedAt; editDate = false;"
                            class="text-xs text-[#2271b1] hover:underline cursor-pointer bg-transparent border-none"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            <!-- 4. SEO Analysis Row (Exact Match to Yoast Style) -->
            <div class="flex items-center space-x-2.5">
                <!-- Yoast [y] Badge (Grey / Yellow / Red / Green based on score) -->
                <div class="w-5 flex items-center justify-center shrink-0">
                    @if($hasSeo && $seoScore >= 80)
                        <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border-[1.5px] border-[#7ad03a] text-[#7ad03a] bg-white dark:bg-slate-900 font-serif font-bold italic text-[12px] leading-none shrink-0 select-none pb-[1px]" style="font-family: Georgia, serif;">
                            y
                        </span>
                    @elseif($hasSeo && $seoScore >= 50)
                        <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border-[1.5px] border-[#ffba00] text-[#ffba00] bg-white dark:bg-slate-900 font-serif font-bold italic text-[12px] leading-none shrink-0 select-none pb-[1px]" style="font-family: Georgia, serif;">
                            y
                        </span>
                    @elseif($hasSeo)
                        <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border-[1.5px] border-[#dc3232] text-[#dc3232] bg-white dark:bg-slate-900 font-serif font-bold italic text-[12px] leading-none shrink-0 select-none pb-[1px]" style="font-family: Georgia, serif;">
                            y
                        </span>
                    @else
                        <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border-[1.5px] border-[#8c8f94] text-[#8c8f94] bg-white dark:bg-slate-900 font-serif font-bold italic text-[12px] leading-none shrink-0 select-none pb-[1px]" style="font-family: Georgia, serif;">
                            y
                        </span>
                    @endif
                </div>
                <div class="flex items-center flex-wrap gap-1">
                    <a
                        href="javascript:void(0)"
                        @click="scrollToYoast('seo')"
                        class="text-[#2271b1] dark:text-blue-400 underline hover:text-[#135e96] text-[13px]"
                    >SEO analysis:</a>
                    <strong class="font-bold text-[#1d2327] dark:text-white text-[13px]">{{ $seoLabel }}</strong>
                </div>
            </div>

            <!-- 5. Readability Analysis Row (Exact Match to Yoast Style) -->
            <div class="flex items-center space-x-2.5">
                <!-- Yoast [y] Badge (Green for Good) -->
                <div class="w-5 flex items-center justify-center shrink-0">
                    @if($readabilityLabel === 'Good')
                        <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border-[1.5px] border-[#7ad03a] text-[#7ad03a] bg-white dark:bg-slate-900 font-serif font-bold italic text-[12px] leading-none shrink-0 select-none pb-[1px]" style="font-family: Georgia, serif;">
                            y
                        </span>
                    @elseif($readabilityLabel === 'OK')
                        <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border-[1.5px] border-[#ffba00] text-[#ffba00] bg-white dark:bg-slate-900 font-serif font-bold italic text-[12px] leading-none shrink-0 select-none pb-[1px]" style="font-family: Georgia, serif;">
                            y
                        </span>
                    @elseif($readabilityLabel === 'Needs improvement')
                        <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border-[1.5px] border-[#dc3232] text-[#dc3232] bg-white dark:bg-slate-900 font-serif font-bold italic text-[12px] leading-none shrink-0 select-none pb-[1px]" style="font-family: Georgia, serif;">
                            y
                        </span>
                    @else
                        <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border-[1.5px] border-[#8c8f94] text-[#8c8f94] bg-white dark:bg-slate-900 font-serif font-bold italic text-[12px] leading-none shrink-0 select-none pb-[1px]" style="font-family: Georgia, serif;">
                            y
                        </span>
                    @endif
                </div>
                <div class="flex items-center flex-wrap gap-1">
                    <a
                        href="javascript:void(0)"
                        @click="scrollToYoast('readability')"
                        class="text-[#2271b1] dark:text-blue-400 underline hover:text-[#135e96] text-[13px]"
                    >Readability analysis:</a>
                    <strong class="font-bold text-[#1d2327] dark:text-white text-[13px]">{{ $readabilityLabel }}</strong>
                </div>
            </div>
        </div>

        <!-- Bottom Action Bar (Move to Trash + Solid Blue Publish Button) -->
        <div class="px-3.5 py-3 bg-[#f6f7f7] dark:bg-slate-800/80 border-t border-[#dcdcde] dark:border-slate-700 flex items-center justify-between">
            <a
                href="javascript:void(0)"
                @click="moveToTrash()"
                class="text-[#b32d2e] dark:text-rose-400 hover:text-[#a00] underline text-[13px] cursor-pointer"
            >
                Move to Trash
            </a>

            <button
                type="button"
                @click="publishPost()"
                class="px-5 py-1.5 rounded-[3px] bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold text-[13px] shadow-2xs transition cursor-pointer"
            >
                <span x-text="status === 'published' ? 'Update' : 'Publish'"></span>
            </button>
        </div>
    </div>
</div>

<script>
(function() {
    function registerWpPublish() {
        if (!window.Alpine) return;
        window.Alpine.data('wpPublishMetabox', () => ({
            isOpen: true,
            status: @js($status),
            publishedAt: @js($publishedAt),
            isFeatured: @js($isFeatured),
            visibility: 'public',
            editStatus: false,
            editVisibility: false,
            editDate: false,
            tempStatus: @js($status),
            tempVisibility: 'public',
            tempFeatured: @js($isFeatured),
            tempDate: @js($publishedAt ? \Carbon\Carbon::parse($publishedAt)->format('Y-m-d\TH:i') : ''),

            init() {
                if (this.$wire) {
                    const liveStatus = this.$wire.get('data.status');
                    if (liveStatus) {
                        this.status = liveStatus;
                        this.tempStatus = liveStatus;
                    }
                    const liveDate = this.$wire.get('data.published_at');
                    if (liveDate) {
                        this.publishedAt = liveDate;
                        this.tempDate = liveDate;
                    }
                    const liveFeat = this.$wire.get('data.is_featured');
                    if (liveFeat !== undefined && liveFeat !== null) {
                        this.isFeatured = Boolean(liveFeat);
                        this.tempFeatured = Boolean(liveFeat);
                    }
                }
            },

            formatStatusLabel(s) {
                switch(s) {
                    case 'published': return 'Published';
                    case 'scheduled': return 'Scheduled';
                    case 'review': return 'Pending Review';
                    case 'approved': return 'Approved';
                    default: return 'Draft';
                }
            },

            formatDateLabel() {
                if (this.status === 'scheduled' && this.publishedAt) {
                    return this.formatPrettyDate(this.publishedAt);
                }
                if (this.status === 'published' && this.publishedAt) {
                    return 'on: ' + this.formatPrettyDate(this.publishedAt);
                }
                return 'immediately';
            },

            formatPrettyDate(d) {
                if (!d) return 'immediately';
                try {
                    const dt = new Date(d);
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const month = months[dt.getMonth()];
                    const day = dt.getDate();
                    const year = dt.getFullYear();
                    let hours = dt.getHours();
                    const minutes = String(dt.getMinutes()).padStart(2, '0');
                    const ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
                } catch(e) {
                    return d;
                }
            },

            applyStatus() {
                this.status = this.tempStatus;
                if (this.$wire) {
                    this.$wire.set('data.status', this.tempStatus);
                }
                this.editStatus = false;
            },

            applyVisibility() {
                this.visibility = this.tempVisibility;
                this.isFeatured = this.tempFeatured;
                if (this.$wire) {
                    this.$wire.set('data.is_featured', this.tempFeatured);
                }
                this.editVisibility = false;
            },

            applyDate() {
                this.publishedAt = this.tempDate;
                if (this.$wire) {
                    this.$wire.set('data.published_at', this.tempDate);
                }
                this.editDate = false;
            },

            syncEditorContent() {
                window.dispatchEvent(new CustomEvent('sync-wp-editor'));
                const canvas = document.querySelector('.wp-editor-canvas');
                const textarea = document.querySelector('textarea[x-ref="codeTextarea"]');
                let content = '';
                if (textarea && textarea.offsetParent !== null && textarea.value) {
                    content = textarea.value;
                } else if (canvas && canvas.innerHTML) {
                    content = canvas.innerHTML;
                }
                if (content && this.$wire) {
                    this.$wire.set('data.content', content);
                }
            },

            saveDraft() {
                this.syncEditorContent();
                this.status = 'draft';
                this.tempStatus = 'draft';
                if (this.$wire) {
                    this.$wire.set('data.status', 'draft');
                    if (typeof this.$wire.save === 'function') {
                        this.$wire.save();
                        return;
                    }
                    if (typeof this.$wire.create === 'function') {
                        this.$wire.create();
                        return;
                    }
                }
                const btn = document.querySelector('form button[type=submit]');
                if (btn) btn.click();
            },

            publishPost() {
                this.syncEditorContent();
                if (this.status === 'draft') {
                    this.status = 'published';
                    this.tempStatus = 'published';
                }
                if (this.$wire) {
                    this.$wire.set('data.status', 'published');
                    if (!this.publishedAt) {
                        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
                        this.publishedAt = now;
                        this.$wire.set('data.published_at', now);
                    }
                    if (typeof this.$wire.save === 'function') {
                        this.$wire.save();
                        return;
                    }
                    if (typeof this.$wire.create === 'function') {
                        this.$wire.create();
                        return;
                    }
                }
                const btn = document.querySelector('form button[type=submit]');
                if (btn) btn.click();
            },

            moveToTrash() {
                if (confirm('Are you sure you want to move this post to trash?')) {
                    const delBtn = document.querySelector('[wire\\:click*="delete"]');
                    if (delBtn) {
                        delBtn.click();
                        return;
                    }
                    if (this.$wire && typeof this.$wire.mountAction === 'function') {
                        try {
                            this.$wire.mountAction('delete');
                            return;
                        } catch(e) {}
                    }
                    this.status = 'trash';
                    if (this.$wire) {
                        this.$wire.set('data.status', 'trash');
                        if (typeof this.$wire.save === 'function') {
                            this.$wire.save();
                            return;
                        }
                    }
                    const submitBtn = document.querySelector('form button[type=submit]');
                    if (submitBtn) submitBtn.click();
                }
            },

            scrollToYoast(tab) {
                const suite = document.querySelector('.yoast-seo-suite-section') || document.getElementById('yoast-seo');
                if (suite) {
                    suite.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => {
                        const tabs = suite.querySelectorAll('[role="tab"], button');
                        tabs.forEach(btn => {
                            const text = (btn.innerText || '').toLowerCase();
                            if (tab === 'seo' && text.includes('seo')) {
                                btn.click();
                            } else if (tab === 'readability' && text.includes('readability')) {
                                btn.click();
                            }
                        });
                    }, 250);
                }
            }
        }));
    }

    if (window.Alpine) {
        registerWpPublish();
    } else {
        document.addEventListener('alpine:init', registerWpPublish);
    }
})();
</script>
