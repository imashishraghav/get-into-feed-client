@php
    $record = isset($getRecord) && is_callable($getRecord) ? $getRecord() : null;
    $comp = $component ?? null;
    if (!$record && isset($comp) && method_exists($comp, 'getRecord')) {
        try {
            $record = $comp->getRecord();
        } catch (\Throwable $e) {}
    }
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
            $val2 = data_get($livewireData, 'data.' . $key);
            if ($val2 !== null && $val2 !== '') return $val2;
        }
        if (isset($comp) && method_exists($comp, 'getContainer')) {
            try {
                $raw = $comp->getContainer()->getRawState();
                if (isset($raw[$key]) && $raw[$key] !== '') return $raw[$key];
            } catch (\Throwable $e) {}
        }
        if ($record) {
            return $record->$key ?? null;
        }
        return null;
    };

    $initialTitle = (string)($resolver('title') ?? '');
    $initialSlug = (string)($resolver('slug') ?? '');
    $initialContent = (string)($resolver('content') ?? '');

    $editorName = auth()->user()?->name ?: 'admin';
    $lastEditedFormatted = $record?->updated_at ? $record->updated_at->format('F j, Y \a\t g:i a') : now()->format('F j, Y \a\t g:i a');

    // Load recent media assets for Add Media modal
    $mediaAssets = [];
    try {
        $mediaAssets = \App\Models\Media::latest()->take(60)->get()->map(function($m) {
            return [
                'id' => $m->id,
                'name' => $m->file_name,
                'url' => $m->url,
                'alt' => $m->alt_text ?: $m->file_name,
                'size' => $m->formatted_size,
                'dimensions' => $m->dimensions,
                'created_at' => $m->created_at ? $m->created_at->format('F j, Y') : '',
            ];
        })->values()->toArray();
    } catch (\Throwable $e) {}
@endphp

<div
    x-data="wpClassicEditorSuite({
        initialTitle: @js($initialTitle),
        initialSlug: @js($initialSlug),
        initialContent: @js($initialContent),
        mediaAssets: @js($mediaAssets),
        csrfToken: @js(csrf_token())
    })"
    :class="isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'mb-4'"
    class="wp-classic-editor-suite font-sans"
    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;"
>
    <!-- 1. Title Input Box (Executive Clean Styling) -->
    <div class="relative mb-2.5" wire:ignore>
        <input
            type="text"
            x-model="title"
            @input="onTitleInput($event.target.value)"
            placeholder="Enter article title here..."
            autocomplete="off"
            spellcheck="true"
            class="w-full bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[22px] font-bold tracking-tight shadow-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition placeholder:text-slate-300 dark:placeholder:text-zinc-600"
        />
    </div>

    <!-- 2. Permalink Capsule -->
    <div class="inline-flex items-center flex-wrap gap-2 text-xs bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 rounded-lg px-3 py-1.5 mb-3 select-none" wire:ignore>
        <span class="font-medium text-slate-400 dark:text-zinc-500">Permalink:</span>
        <span class="text-slate-500 font-mono">https://getintofeed.com/blog/</span>
        <a
            :href="'https://getintofeed.com/blog/' + slug"
            target="_blank"
            class="text-blue-600 dark:text-blue-400 font-bold font-mono hover:underline break-all no-underline"
            x-text="slug || 'your-slug'"
        ></a>

        <button
            type="button"
            @click="isEditingSlug = !isEditingSlug"
            class="px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
        >
            Edit Slug
        </button>

        <!-- Inline Slug Edit Flyout -->
        <div x-show="isEditingSlug" style="display:none;" class="flex items-center gap-1.5 ml-1">
            <input
                type="text"
                x-model="tempSlug"
                class="px-2 py-0.5 text-xs rounded-md border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-slate-800 dark:text-white font-mono"
            />
            <button
                type="button"
                @click="saveSlug()"
                class="px-2.5 py-0.5 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
            >
                OK
            </button>
            <button
                type="button"
                @click="cancelSlug()"
                class="text-xs text-slate-500 hover:underline cursor-pointer bg-transparent border-none"
            >
                Cancel
            </button>
        </div>
    </div>

    <!-- 3. Modern Toolbar Top Bar: Add Media Button + Segmented Visual / Code Tabs -->
    <div class="flex items-end justify-between select-none mb-1.5">
        <!-- Left: Modern Add Media Asset Button -->
        <button
            type="button"
            @click="openMediaModal()"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold transition cursor-pointer shadow-2xs"
        >
            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span>Add Media Asset</span>
        </button>

        <!-- Right: Segmented Visual / Code Mode Tabs -->
        <div class="flex items-center bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs">
            <button
                type="button"
                @click="switchMode('visual')"
                :class="editorMode === 'visual' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs font-bold' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 font-medium'"
                class="px-3 py-1 rounded-md cursor-pointer transition select-none"
            >
                Visual Editor
            </button>
            <button
                type="button"
                @click="switchMode('code')"
                :class="editorMode === 'code' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs font-bold' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 font-medium'"
                class="px-3 py-1 rounded-md cursor-pointer transition select-none"
            >
                Code / HTML
            </button>
        </div>
    </div>

    <!-- 4. Modern Content Canvas Container -->
    <div class="border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
        <!-- Visual Mode Toolbar (Row 1: Exact Classic WordPress TinyMCE Tools) -->
        <div x-show="editorMode === 'visual'" class="wp-toolbar-row">
            <!-- 1. Format Block / Paragraph Select Dropdown -->
            <div style="display:inline-flex; align-items:center;">
                <select
                    @change="execFormat($event.target.value); $event.target.value = 'p';"
                    class="wp-toolbar-select"
                    style="height: 28px; font-size: 13px; color: #2c3338; background-color: #ffffff; background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%3E%3Cpath%20fill%3D%22%2350575e%22%20d%3D%22M0%200l5%206%205-6z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: calc(100% - 8px) center; background-size: 8px 5px; border: 1px solid #ccd0d4; border-radius: 3px; padding: 0 24px 0 8px; margin-right: 8px; outline: none; cursor: pointer; -webkit-appearance: none; -moz-appearance: none; appearance: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; box-sizing: border-box; line-height: 26px;"
                >
                    <option value="p">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="h5">Heading 5</option>
                    <option value="h6">Heading 6</option>
                    <option value="pre">Preformatted</option>
                </select>
            </div>

            <!-- 2. Bold (B) -->
            <button
                type="button"
                @click="exec('bold')"
                class="wp-toolbar-btn"
                title="Bold (Ctrl+B)"
            >
                <span style="font-weight:800; font-size:15px; font-family:sans-serif;">B</span>
            </button>

            <!-- 3. Italic (I) -->
            <button
                type="button"
                @click="exec('italic')"
                class="wp-toolbar-btn"
                title="Italic (Ctrl+I)"
            >
                <span style="font-style:italic; font-family:serif; font-weight:900; font-size:15px;">I</span>
            </button>

            <!-- 4. Bullet List -->
            <button
                type="button"
                @click="exec('insertUnorderedList')"
                class="wp-toolbar-btn"
                title="Bulleted list"
            >
                <svg style="width:16px; height:16px;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4-2a1 1 0 000 2h10a1 1 0 100-2H7zM3 11.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4-2a1 1 0 000 2h10a1 1 0 100-2H7zm-4 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4-2a1 1 0 000 2h10a1 1 0 100-2H7z" clip-rule="evenodd"/>
                </svg>
            </button>

            <!-- 5. Numbered List -->
            <button
                type="button"
                @click="exec('insertOrderedList')"
                class="wp-toolbar-btn"
                title="Numbered list"
            >
                <svg style="width:16px; height:16px;" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.5 3h1v3h-1V4.2h-.5V3.5h.5V3zm4.5 1a1 1 0 000 2h10a1 1 0 100-2H7zm-4.7 6.8c.2-.2.5-.5.9-.9.4-.4.6-.7.6-1 0-.3-.1-.5-.2-.7-.2-.1-.4-.2-.7-.2-.3 0-.5.1-.7.2l-.2-.6c.3-.2.7-.3 1.1-.3.5 0 .9.1 1.2.4.3.3.4.6.4 1 0 .4-.2.8-.5 1.2l-.6.6h1.4v.7H2.3v-.4zm4.7 0a1 1 0 000 2h10a1 1 0 100-2H7zm-4.7 6.7c.3.2.7.3 1.1.3.4 0 .8-.1 1-.4.2-.3.4-.6.4-1 0-.3-.1-.6-.3-.8-.2-.2-.5-.3-.9-.3h-.3v-.6h.3c.3 0 .6-.1.8-.3.2-.2.3-.4.3-.7 0-.3-.1-.6-.3-.8-.2-.2-.5-.3-.9-.3-.3 0-.6.1-.8.2l-.2-.6c.3-.2.7-.3 1.1-.3.5 0 1 .2 1.3.5.3.3.5.7.5 1.1 0 .3-.1.6-.3.9-.2.2-.4.4-.7.5.4.1.7.3.9.6.2.3.3.7.3 1.1 0 .5-.2 1-.5 1.4-.4.4-.9.6-1.5.6-.5 0-1-.1-1.3-.3l.2-.7zm4.7-.5a1 1 0 000 2h10a1 1 0 100-2H7z"/>
                </svg>
            </button>

            <!-- 6. Blockquote (❝) -->
            <button
                type="button"
                @click="exec('formatBlock', 'blockquote')"
                class="wp-toolbar-btn"
                title="Blockquote"
            >
                <span style="font-family:serif; font-weight:900; font-size:16px; line-height:1;">❝</span>
            </button>

            <!-- 7. Align Left -->
            <button
                type="button"
                @click="exec('justifyLeft')"
                class="wp-toolbar-btn"
                title="Align left"
            >
                <svg style="width:16px; height:16px;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
            </button>

            <!-- 8. Align Center -->
            <button
                type="button"
                @click="exec('justifyCenter')"
                class="wp-toolbar-btn"
                title="Align center"
            >
                <svg style="width:16px; height:16px;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
            </button>

            <!-- 9. Align Right -->
            <button
                type="button"
                @click="exec('justifyRight')"
                class="wp-toolbar-btn"
                title="Align right"
            >
                <svg style="width:16px; height:16px;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm-4 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
            </button>

            <!-- 10. Link (🔗) -->
            <button
                type="button"
                @click="insertLink()"
                class="wp-toolbar-btn"
                title="Insert/edit link (Ctrl+K)"
            >
                <svg style="width:16px; height:16px;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/>
                </svg>
            </button>

            <!-- 11. Read More Tag -->
            <button
                type="button"
                @click="insertMoreTag()"
                class="wp-toolbar-btn"
                title="Insert Read More tag"
            >
                <svg style="width:16px; height:16px;" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4h14v2H3V4zm0 10h14v2H3v-2zm0-5h3v2H3V9zm5 0h4v2H8V9zm6 0h3v2h-3V9z"/>
                </svg>
            </button>

            <!-- 12. Toolbar Toggle (Kitchen sink) -->
            <button
                type="button"
                @click="showKitchenSink = !showKitchenSink"
                class="wp-toolbar-btn"
                title="Toolbar Toggle"
            >
                <svg style="width:16px; height:16px;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 1a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm4 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm4 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM5 9a1 1 0 011-1h1a1 1 0 110 2H6a1 1 0 01-1-1zm4 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm4 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-7 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
            </button>

            <!-- 13. Fullscreen Toggle (Far Right) -->
            <button
                type="button"
                @click="toggleFullscreen()"
                class="wp-toolbar-btn"
                style="margin-left: auto;"
                title="Distraction-free writing mode"
            >
                <svg style="width:16px; height:16px;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l3.293 3.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-3.293 3.293a1 1 0 11-1.414-1.414L13.586 5H12zm-3.293 9.293a1 1 0 011.414 1.414L6.414 19H8a1 1 0 010 2H4a1 1 0 01-1-1v-4a1 1 0 012 0v1.586l3.293-3.293zm4.586 0a1 1 0 011.414 0L17 17.586V16a1 1 0 112 0v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-3.293-3.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
            </button>
        </div>

        <!-- Optional Second Row Toolbar (Kitchen Sink) -->
        <div x-show="editorMode === 'visual' && showKitchenSink" style="display:none;" class="wp-toolbar-row">
            <button type="button" @click="exec('strikeThrough')" class="wp-toolbar-btn" title="Strikethrough">
                <span class="line-through font-bold text-xs">S</span>
            </button>
            <button type="button" @click="exec('insertHorizontalRule')" class="wp-toolbar-btn" title="Horizontal line">
                <span class="font-bold text-xs">—</span>
            </button>
            <button type="button" @click="exec('removeFormat')" class="wp-toolbar-btn" title="Clear formatting">
                <svg style="width:14px; height:14px;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
            <button type="button" @click="exec('undo')" class="wp-toolbar-btn" title="Undo (Ctrl+Z)">
                <svg style="width:14px; height:14px;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            </button>
            <button type="button" @click="exec('redo')" class="wp-toolbar-btn" title="Redo (Ctrl+Y)">
                <svg style="width:14px; height:14px;" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H9a5 5 0 00-5 5v2a1 1 0 11-2 0v-2a7 7 0 017-7h5.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
        </div>

        <!-- Content Canvas (Visual Mode: Clean WYSIWYG Writing Canvas) -->
        <div x-show="editorMode === 'visual'">
            <div wire:ignore>
                <div
                    x-ref="editorCanvas"
                    contenteditable="true"
                    @input="onVisualInput()"
                    @blur="onVisualBlur()"
                    class="wp-editor-canvas min-h-[460px] p-5 bg-white text-[#1d2327] outline-none leading-relaxed text-[16px] focus:outline-none"
                    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;"
                >{!! $initialContent !!}</div>
            </div>
        </div>

        <!-- Content Canvas (Code Mode: Monospaced Raw HTML Textarea) -->
        <div x-show="editorMode === 'code'" style="display:none;">
            <div wire:ignore>
                <textarea
                    x-ref="codeTextarea"
                    x-model="codeContent"
                    @input="onCodeInput()"
                    rows="24"
                    placeholder="Write raw HTML or code here..."
                    class="w-full p-5 font-mono text-[13px] leading-relaxed bg-white text-slate-800 outline-none resize-y border-none shadow-none focus:ring-0"
                >{!! $initialContent !!}</textarea>
            </div>
        </div>

        <!-- Editor Status Bar / Footer (Exact Match to Screenshot) -->
        <div class="px-3 py-1.5 bg-[#f6f7f7] border-t border-[#dcdcde] flex items-center justify-between text-xs text-[#50575e] select-none">
            <!-- Left: Word count -->
            <div class="font-normal text-[#50575e]">
                Word count: <span x-text="wordCount">0</span>
            </div>

            <!-- Right: Last edited info -->
            <div class="text-[11px] text-[#646970]">
                Last edited by {{ $editorName }} on {{ $lastEditedFormatted }}
            </div>
        </div>
    </div>

    <!-- 5. WordPress Exact "Add media" Modal (Teleported to Body for 100% Full-Screen Fidelity) -->
    <template x-teleport="body">
        <div
            x-show="showMediaModal"
            style="display:none;"
            class="wp-media-modal-backdrop"
            @keydown.escape.window="showMediaModal = false"
        >
            <div
                @click.outside="showMediaModal = false"
                class="wp-media-modal-window"
            >
                <!-- Modal Header (Add media title + Top Right Close button) -->
                <div class="wp-media-modal-header">
                    <h2>Add media</h2>
                    <button
                        type="button"
                        @click="showMediaModal = false"
                        class="wp-media-modal-close"
                        title="Close"
                    >&times;</button>
                </div>

                <!-- Tabs Row: Upload files & Media Library (Exact WordPress Match) -->
                <div class="wp-media-tabs-bar">
                    <button
                        type="button"
                        @click="mediaTab = 'upload'"
                        class="wp-media-tab-btn"
                        :class="{ 'is-active': mediaTab === 'upload' }"
                    >
                        Upload files
                    </button>
                    <button
                        type="button"
                        @click="mediaTab = 'library'"
                        class="wp-media-tab-btn"
                        :class="{ 'is-active': mediaTab === 'library' }"
                    >
                        Media Library
                    </button>
                </div>

                <!-- Modal Body Area -->
                <div class="wp-media-modal-body">
                    <!-- ── TAB 1: Upload files (1:1 Match to media_1795032606448_b5197a4a.png) ── -->
                    <div
                        x-show="mediaTab === 'upload'"
                        @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false"
                        @drop.prevent="isDragging = false; handleFileDrop($event)"
                        :style="isDragging ? 'background-color:#f0f6fc; border:2px dashed #2271b1;' : 'background-color:#ffffff;'"
                        class="wp-media-upload-pane"
                    >
                        <div style="max-width:440px; margin:auto; text-align:center;">
                            <!-- Drop files to upload -->
                            <h3 style="font-size:20px; font-weight:400; color:#1d2327; margin:0 0 10px 0;">Drop files to upload</h3>

                            <!-- or -->
                            <p style="font-size:13px; color:#50575e; margin:0 0 16px 0;">or</p>

                            <!-- Native Clickable Label Button (100% Reliable File Picker) -->
                            <label style="display:inline-block; padding:10px 32px; border-radius:3px; border:1px solid #2271b1; color:#2271b1; background:#ffffff; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.15s; user-select:none; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
                                <input
                                    type="file"
                                    @change="handleFileSelect($event)"
                                    accept="image/*"
                                    multiple
                                    style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;"
                                />
                                Select Files
                            </label>

                            <!-- Maximum upload file size: 64 MB. -->
                            <p style="font-size:12px; color:#50575e; margin:24px 0 0 0;">Maximum upload file size: 64 MB.</p>

                            <!-- Uploading Indicator -->
                            <div x-show="isUploading" style="display:none; margin-top:20px; padding:12px 16px; background:#f0f6fc; border:1px solid #cce5ff; border-radius:4px; font-size:12px; color:#2271b1; display:flex; align-items:center; justify-content:center; gap:8px;">
                                <svg style="animation:spin 1s linear infinite; width:16px; height:16px;" viewBox="0 0 24 24" fill="none">
                                    <circle style="opacity:0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path style="opacity:0.75;" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span x-text="uploadStatusText || 'Uploading image...'"></span>
                            </div>

                            <!-- Uploaded Feedback -->
                            <div x-show="justUploadedAsset && mediaTab === 'upload'" style="display:none; margin-top:16px; padding:10px 14px; background:#edf7ed; border:1px solid #b7dfb7; border-radius:4px; font-size:12px; color:#1e4620; display:flex; align-items:center; justify-content:space-between; gap:12px;">
                                <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                                    <img :src="justUploadedAsset?.url" style="width:32px; height:32px; object-fit:cover; border-radius:2px; border:1px solid #b7dfb7;" />
                                    <span style="font-weight:600; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;" x-text="justUploadedAsset?.name"></span>
                                </div>
                                <span style="font-weight:700; color:#1e4620; white-space:nowrap;">✓ Uploaded</span>
                            </div>
                        </div>
                    </div>

                    <!-- ── TAB 2: Media Library (Browser + Attachment Details) ── -->
                    <div x-show="mediaTab === 'library'" style="display:none;" class="wp-media-library-pane">
                        <!-- Main Left Column: Filter Bar + Responsive Thumbnail Grid -->
                        <div class="wp-media-library-main">
                            <!-- Filter & Search Toolbar -->
                            <div class="wp-media-library-toolbar">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <select style="height:30px; font-size:13px; border:1px solid #8c8f94; border-radius:3px; padding:0 24px 0 8px; color:#2c3338; background-color:#ffffff; background-image:url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%3E%3Cpath%20fill%3D%22%2350575e%22%20d%3D%22M0%200l5%206%205-6z%22%2F%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:calc(100% - 8px) center; background-size:8px 5px; -webkit-appearance:none; -moz-appearance:none; appearance:none; cursor:pointer;">
                                        <option value="all">All media items</option>
                                        <option value="images">Images</option>
                                    </select>
                                    <select style="height:30px; font-size:13px; border:1px solid #8c8f94; border-radius:3px; padding:0 24px 0 8px; color:#2c3338; background-color:#ffffff; background-image:url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%3E%3Cpath%20fill%3D%22%2350575e%22%20d%3D%22M0%200l5%206%205-6z%22%2F%3E%3C%2Fsvg%3E'); background-repeat:no-repeat; background-position:calc(100% - 8px) center; background-size:8px 5px; -webkit-appearance:none; -moz-appearance:none; appearance:none; cursor:pointer;">
                                        <option value="all">All dates</option>
                                    </select>
                                    <button
                                        type="button"
                                        @click="fetchMediaAssets()"
                                        style="height:30px; padding:0 12px; border:1px solid #2271b1; color:#2271b1; background:#ffffff; border-radius:3px; font-size:12px; font-weight:500; cursor:pointer;"
                                        title="Refresh media list"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                <div style="display:flex; align-items:center; gap:6px;">
                                    <label for="wp-media-search-input" style="font-size:12px; color:#50575e;">Search media:</label>
                                    <input
                                        id="wp-media-search-input"
                                        type="text"
                                        x-model="mediaSearch"
                                        placeholder="Search by name..."
                                        style="height:30px; width:180px; font-size:12px; border:1px solid #8c8f94; border-radius:3px; padding:0 8px; outline:none; color:#2c3338;"
                                    />
                                </div>
                            </div>

                            <!-- Scrollable Grid of Constrained Thumbnails -->
                            <div class="wp-media-library-scroll">
                                <div style="font-size:12px; color:#646970; margin-bottom:10px;">
                                    Showing <span x-text="filteredMediaAssets.length"></span> items
                                </div>

                                <ul class="wp-media-grid-list">
                                    <template x-for="asset in filteredMediaAssets" :key="asset.id">
                                        <li
                                            @click="selectAsset(asset)"
                                            :class="{ 'is-selected': selectedAsset?.id === asset.id }"
                                            class="wp-media-item-card"
                                            :title="asset.name"
                                        >
                                            <div class="wp-media-thumb-wrap">
                                                <img :src="asset.url" :alt="asset.alt || asset.name" loading="lazy" />
                                            </div>

                                            <!-- Signature WordPress Blue Selection Checkmark -->
                                            <div x-show="selectedAsset?.id === asset.id" class="wp-media-check-icon">
                                                <svg viewBox="0 0 20 20" fill="currentColor" style="width:14px; height:14px;">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                                </svg>
                                            </div>
                                        </li>
                                    </template>
                                </ul>

                                <div x-show="filteredMediaAssets.length === 0" style="text-align:center; padding:60px 20px; color:#646970; font-size:13px;">
                                    No media files found. Switch to "Upload files" to upload pictures.
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: WordPress Classic ATTACHMENT DETAILS Sidebar -->
                        <div x-show="selectedAsset" class="wp-media-sidebar">
                            <div class="wp-media-sidebar-title">Attachment Details</div>

                            <!-- Constrained Preview Image Box -->
                            <div class="wp-media-sidebar-preview">
                                <img :src="selectedAsset?.url" :alt="selectedAsset?.alt" />
                            </div>

                            <!-- Meta Info -->
                            <div style="font-size:12px; color:#646970; line-height:1.5; margin-bottom:12px; word-break:break-all;">
                                <div style="font-weight:700; color:#1d2327; margin-bottom:2px;" x-text="selectedAsset?.name"></div>
                                <div x-show="selectedAsset?.created_at" x-text="selectedAsset?.created_at"></div>
                                <div x-show="selectedAsset?.size" x-text="selectedAsset?.size"></div>
                                <div x-show="selectedAsset?.dimensions" x-text="selectedAsset?.dimensions"></div>
                                <div style="margin-top:6px;">
                                    <button
                                        type="button"
                                        @click="selectedAsset = null"
                                        style="color:#b32d2e; text-decoration:underline; font-size:11px; background:none; border:none; padding:0; cursor:pointer;"
                                    >
                                        Deselect
                                    </button>
                                </div>
                            </div>

                            <hr style="border:0; border-top:1px solid #dcdcde; margin:8px 0 14px 0;" />

                            <!-- Attachment Form Fields -->
                            <div style="display:flex; flex-direction:column; gap:10px; font-size:12px;">
                                <!-- File URL -->
                                <div>
                                    <label style="display:block; font-size:11px; font-weight:600; color:#50575e; margin-bottom:3px;">File URL:</label>
                                    <input
                                        type="text"
                                        readonly
                                        :value="selectedAsset?.url"
                                        @click="$event.target.select()"
                                        style="width:100%; height:28px; font-size:11px; font-family:monospace; background:#fff; border:1px solid #8c8f94; border-radius:2px; padding:0 6px; color:#2c3338; box-sizing:border-box;"
                                    />
                                </div>

                                <!-- Title -->
                                <div>
                                    <label style="display:block; font-size:11px; font-weight:600; color:#50575e; margin-bottom:3px;">Title</label>
                                    <input
                                        type="text"
                                        x-model="selectedAsset.name"
                                        style="width:100%; height:28px; font-size:12px; background:#fff; border:1px solid #8c8f94; border-radius:2px; padding:0 6px; color:#2c3338; box-sizing:border-box;"
                                    />
                                </div>

                                <!-- Alt Text -->
                                <div>
                                    <label style="display:block; font-size:11px; font-weight:600; color:#50575e; margin-bottom:3px;">Alternative Text</label>
                                    <input
                                        type="text"
                                        x-model="selectedAsset.alt"
                                        placeholder="Describe the image"
                                        style="width:100%; height:28px; font-size:12px; background:#fff; border:1px solid #8c8f94; border-radius:2px; padding:0 6px; color:#2c3338; box-sizing:border-box;"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer: [ Insert into post ] Button (Exact WordPress styling) -->
                <div class="wp-media-modal-footer">
                    <div>
                        <span style="font-size:12px; color:#50575e;" x-text="selectedAsset ? 'Selected: ' + selectedAsset.name : (justUploadedAsset ? 'Selected: ' + justUploadedAsset.name : '')"></span>
                    </div>
                    <div>
                        <button
                            type="button"
                            @click="insertSelectedIntoPost()"
                            :disabled="!selectedAsset && !justUploadedAsset"
                            class="wp-media-insert-btn"
                            :class="{ 'is-active': selectedAsset || justUploadedAsset }"
                        >
                            Insert into post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>

<script>
(function() {
    function registerWpClassicEditor() {
        if (!window.Alpine) return;
        window.Alpine.data('wpClassicEditorSuite', (cfg) => ({
            title: cfg.initialTitle || '',
            slug: cfg.initialSlug || '',
            tempSlug: cfg.initialSlug || '',
            isEditingSlug: false,
            editorMode: 'visual',
            codeContent: cfg.initialContent || '',
            showMediaModal: false,
            mediaAssets: cfg.mediaAssets || [],
            selectedAsset: null,
            justUploadedAsset: null,
            mediaTab: 'upload',
            mediaSearch: '',
            isDragging: false,
            isUploading: false,
            uploadStatusText: '',
            csrfToken: cfg.csrfToken || '',
            showKitchenSink: false,
            isFullscreen: false,
            wordCount: 0,
            savedSelectionRange: null,

            init() {
                // 1. Initialise from server-rendered HTML or cfg.initialContent
                if (this.$refs.editorCanvas) {
                    const existingHtml = (this.$refs.editorCanvas.innerHTML || '').trim();
                    if (existingHtml && existingHtml !== '<br>') {
                        this.codeContent = this.$refs.editorCanvas.innerHTML;
                    } else if (this.codeContent) {
                        this.$refs.editorCanvas.innerHTML = this.codeContent;
                    }
                }

                if (this.$refs.codeTextarea && !this.$refs.codeTextarea.value && this.codeContent) {
                    this.$refs.codeTextarea.value = this.codeContent;
                }

                // 2. Read from or sync to Livewire deferred
                if (this.$wire) {
                    const lt = this.$wire.get('data.title');
                    if (lt !== undefined && lt !== null && lt !== '') {
                        this.title = lt;
                    } else if (this.title) {
                        this.$wire.set('data.title', this.title, false);
                    }

                    const ls = this.$wire.get('data.slug');
                    if (ls !== undefined && ls !== null && ls !== '') {
                        this.slug = ls;
                        this.tempSlug = ls;
                    } else if (this.slug) {
                        this.$wire.set('data.slug', this.slug, false);
                    }

                    const lc = this.$wire.get('data.content');
                    if (lc !== undefined && lc !== null && lc !== '') {
                        this.codeContent = lc;
                        if (this.$refs.editorCanvas && (!this.$refs.editorCanvas.innerHTML || this.$refs.editorCanvas.innerHTML === '<br>')) {
                            this.$refs.editorCanvas.innerHTML = lc;
                        }
                    } else if (this.codeContent) {
                        this.$wire.set('data.content', this.codeContent, false);
                    }
                }

                this.calculateWordCount();

                // 3. Keep in sync before save / publish or custom event
                window.addEventListener('sync-wp-editor', () => {
                    this.syncToWire(true);
                });

                const formEl = this.$el.closest('form');
                if (formEl) {
                    formEl.addEventListener('submit', () => {
                        this.syncToWire(true);
                    });
                }
            },

            openMediaModal() {
                // Save current cursor selection in editor canvas
                this.saveSelection();
                this.showMediaModal = true;
                this.fetchMediaAssets();
                this.isUploading = false;
                this.uploadStatusText = '';
            },

            fetchMediaAssets() {
                fetch('/admin/media/list', {
                    headers: { 'Accept': 'application/json' }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success && Array.isArray(data.media)) {
                        this.mediaAssets = data.media;
                    }
                })
                .catch(() => {});
            },

            saveSelection() {
                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0) {
                    this.savedSelectionRange = sel.getRangeAt(0).cloneRange();
                }
            },

            restoreSelection() {
                if (this.savedSelectionRange && window.getSelection) {
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(this.savedSelectionRange);
                }
            },

            get filteredMediaAssets() {
                if (!this.mediaSearch) return this.mediaAssets;
                const q = this.mediaSearch.toLowerCase();
                return this.mediaAssets.filter(a => (a.name || '').toLowerCase().includes(q));
            },

            selectAsset(asset) {
                if (this.selectedAsset?.id === asset.id) {
                    this.selectedAsset = null;
                } else {
                    this.selectedAsset = asset;
                    this.justUploadedAsset = asset;
                }
            },

            handleFileSelect(e) {
                const files = e.target.files;
                if (!files || !files.length) return;
                this.uploadFile(files[0]);
            },

            handleFileDrop(e) {
                const files = e.dataTransfer.files;
                if (!files || !files.length) return;
                this.uploadFile(files[0]);
            },

            uploadFile(file) {
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file (JPEG, PNG, WebP, GIF, SVG).');
                    return;
                }
                if (file.size > 64 * 1024 * 1024) {
                    alert('The selected file exceeds 64 MB maximum file size.');
                    return;
                }

                this.isUploading = true;
                this.uploadStatusText = 'Uploading ' + file.name + '...';

                const formData = new FormData();
                formData.append('file', file);
                formData.append('_token', this.csrfToken);

                fetch('/admin/media/quick-upload', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': this.csrfToken
                    },
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    this.isUploading = false;
                    if (data.success && data.media) {
                        this.mediaAssets.unshift(data.media);
                        this.selectedAsset = data.media;
                        this.justUploadedAsset = data.media;
                        this.uploadStatusText = '';
                        this.mediaTab = 'library';
                    } else {
                        alert(data.error || 'Failed to upload image. Please try again.');
                    }
                })
                .catch(err => {
                    this.isUploading = false;
                    alert('Network error while uploading: ' + err.message);
                });
            },

            insertSelectedIntoPost() {
                const target = this.selectedAsset || this.justUploadedAsset;
                if (!target || !target.url) return;
                this.insertImageHtml(target.url, target.alt || target.name);
            },

            slugify(text) {
                return (text || '').toString().toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');
            },

            syncToWire(immediate = false) {
                if (this.editorMode === 'visual' && this.$refs.editorCanvas) {
                    this.codeContent = this.$refs.editorCanvas.innerHTML;
                } else if (this.$refs.codeTextarea) {
                    this.codeContent = this.$refs.codeTextarea.value;
                }
                if (this.$wire) {
                    this.$wire.set('data.content', this.codeContent, !immediate ? false : undefined);
                    this.$wire.set('data.title', this.title, !immediate ? false : undefined);
                    this.$wire.set('data.slug', this.slug, !immediate ? false : undefined);
                }
                const contentInput = document.querySelector('input[name="content"], input[wire\\:model*="content"]');
                if (contentInput && contentInput.value !== this.codeContent) {
                    contentInput.value = this.codeContent;
                    contentInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            },

            onTitleInput(val) {
                this.title = val;
                if (this.$wire) {
                    this.$wire.set('data.title', val, false);
                }
                if (!this.slug || this.slug === this.slugify(this.title.slice(0, -1))) {
                    const newSlug = this.slugify(val);
                    this.slug = newSlug;
                    this.tempSlug = newSlug;
                    if (this.$wire) {
                        this.$wire.set('data.slug', newSlug, false);
                    }
                }
            },

            saveSlug() {
                const cleaned = this.slugify(this.tempSlug);
                this.slug = cleaned;
                this.tempSlug = cleaned;
                if (this.$wire) {
                    this.$wire.set('data.slug', cleaned, false);
                }
                this.isEditingSlug = false;
            },

            cancelSlug() {
                this.tempSlug = this.slug;
                this.isEditingSlug = false;
            },

            exec(command, value = null) {
                if (this.$refs.editorCanvas) {
                    this.$refs.editorCanvas.focus();
                    document.execCommand(command, false, value);
                    this.onVisualInput();
                }
            },

            execFormat(tag) {
                if (tag === 'p') {
                    this.exec('formatBlock', '<p>');
                } else if (tag === 'pre') {
                    this.exec('formatBlock', '<pre>');
                } else {
                    this.exec('formatBlock', '<' + tag + '>');
                }
            },

            insertLink() {
                const url = prompt('Enter the target URL:', 'https://');
                if (url) {
                    this.exec('createLink', url);
                }
            },

            insertMoreTag() {
                this.exec('insertHTML', '<hr class="wp-more-tag" title="Read More" /><p><br><\/p>');
            },

            toggleFullscreen() {
                this.isFullscreen = !this.isFullscreen;
            },

            switchMode(mode) {
                this.editorMode = mode;
                if (mode === 'code') {
                    if (this.$refs.editorCanvas) {
                        this.codeContent = this.$refs.editorCanvas.innerHTML;
                    }
                    if (this.$refs.codeTextarea) {
                        this.$refs.codeTextarea.value = this.codeContent;
                    }
                } else {
                    if (this.$refs.codeTextarea) {
                        this.codeContent = this.$refs.codeTextarea.value;
                    }
                    if (this.$refs.editorCanvas) {
                        this.$refs.editorCanvas.innerHTML = this.codeContent;
                    }
                }
                this.calculateWordCount();
            },

            onVisualInput() {
                if (this.$refs.editorCanvas) {
                    this.codeContent = this.$refs.editorCanvas.innerHTML;
                    if (this.$wire) {
                        this.$wire.set('data.content', this.codeContent, false);
                    }
                    this.calculateWordCount();
                }
            },

            onVisualBlur() {
                this.syncToWire(false);
            },

            onCodeInput() {
                if (this.$refs.codeTextarea) {
                    this.codeContent = this.$refs.codeTextarea.value;
                }
                if (this.$wire) {
                    this.$wire.set('data.content', this.codeContent, false);
                }
                this.calculateWordCount();
            },

            calculateWordCount() {
                let text = '';
                if (this.editorMode === 'visual' && this.$refs.editorCanvas) {
                    text = this.$refs.editorCanvas.innerText || '';
                } else {
                    const temp = document.createElement('div');
                    temp.innerHTML = this.codeContent || '';
                    text = temp.innerText || '';
                }
                const words = text.trim().split(/\s+/).filter(Boolean);
                this.wordCount = words.length;
            },

            insertImageHtml(url, alt) {
                const html = `<p><img src="${url}" alt="${alt || ''}" style="max-width: 100%; height: auto; border-radius: 4px; margin: 16px 0;" /><\/p><p><br><\/p>`;
                
                if (this.editorMode === 'code') {
                    this.codeContent += '\n' + html;
                    if (this.$refs.codeTextarea) {
                        this.$refs.codeTextarea.value = this.codeContent;
                    }
                    this.onCodeInput();
                } else {
                    if (this.$refs.editorCanvas) {
                        this.$refs.editorCanvas.focus();
                        let inserted = false;
                        if (this.savedSelectionRange) {
                            try {
                                this.restoreSelection();
                                inserted = document.execCommand('insertHTML', false, html);
                            } catch(e) {}
                        }
                        if (!inserted) {
                            try {
                                inserted = document.execCommand('insertHTML', false, html);
                            } catch(e) {}
                        }
                        if (!inserted) {
                            this.$refs.editorCanvas.innerHTML += html;
                        }
                        this.onVisualInput();
                    }
                }
                this.showMediaModal = false;
                this.selectedAsset = null;
                this.justUploadedAsset = null;
            }
        }));
    }

    if (window.Alpine) {
        registerWpClassicEditor();
    } else {
        document.addEventListener('alpine:init', registerWpClassicEditor);
    }
})();
</script>

<style>
.wp-editor-canvas:empty:before {
    content: "Start writing your article here...";
    color: #94a3b8;
    pointer-events: none;
}
.wp-editor-canvas blockquote {
    border-left: 4px solid #ccd0d4;
    padding-left: 1rem;
    font-style: italic;
    color: #50575e;
    margin: 1rem 0;
}
.wp-editor-canvas h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.wp-editor-canvas h2 { font-size: 1.6rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.wp-editor-canvas h3 { font-size: 1.35rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.wp-editor-canvas h4 { font-size: 1.15rem; font-weight: 700; margin: 0.75rem 0 0.5rem; }
.wp-editor-canvas p { margin: 0.75rem 0; line-height: 1.75; }
.wp-editor-canvas ul { list-style-type: disc; margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
.wp-editor-canvas ol { list-style-type: decimal; margin-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
.wp-editor-canvas a { color: #2271b1; text-decoration: underline; }
.wp-editor-canvas hr.wp-more-tag {
    border: none;
    border-top: 2px dashed #94a3b8;
    position: relative;
    margin: 1.5rem 0;
}
.wp-editor-canvas hr.wp-more-tag:after {
    content: "More";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: #e2e8f0;
    color: #64748b;
    padding: 0 8px;
    font-size: 11px;
    font-weight: bold;
    border-radius: 3px;
}

/* WordPress Classic TinyMCE Toolbar Styles */
.wp-toolbar-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    padding: 6px 10px;
    background: #f6f7f7;
    border-bottom: 1px solid #dcdcde;
    user-select: none;
    box-sizing: border-box;
}

.wp-toolbar-select {
    height: 28px !important;
    font-size: 13px !important;
    line-height: 26px !important;
    color: #2c3338 !important;
    background-color: #ffffff !important;
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%3E%3Cpath%20fill%3D%22%2350575e%22%20d%3D%22M0%200l5%206%205-6z%22%2F%3E%3C%2Fsvg%3E') !important;
    background-repeat: no-repeat !important;
    background-position: calc(100% - 8px) center !important;
    background-size: 8px 5px !important;
    border: 1px solid #ccd0d4 !important;
    border-radius: 3px !important;
    padding: 0 24px 0 8px !important;
    margin-right: 8px !important;
    outline: none !important;
    cursor: pointer !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
    box-sizing: border-box !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
}
.wp-toolbar-select:hover, .wp-toolbar-select:focus {
    border-color: #8c8f94 !important;
}

.wp-toolbar-btn {
    width: 28px;
    height: 28px;
    min-width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    border: 1px solid transparent;
    background: transparent;
    color: #50575e;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    padding: 0;
    box-sizing: border-box;
}
.wp-toolbar-btn:hover {
    background: #e0e0e0;
    color: #1d2327;
    border-color: #c3c4c7;
}
.wp-toolbar-btn:active {
    background: #d0d0d0;
}

/* WordPress Classic "Add media" Modal Styles */
.wp-media-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

.wp-media-modal-window {
    position: relative;
    width: 100%;
    max-width: 1160px;
    height: 88vh;
    max-height: 800px;
    background: #ffffff;
    border-radius: 3px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.35);
    border: 1px solid #dcdcde;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: #2c3338;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 13px;
    box-sizing: border-box;
}

.wp-media-modal-header {
    height: 52px;
    min-height: 52px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-bottom: 1px solid #dcdcde;
    box-sizing: border-box;
}
.wp-media-modal-header h2 {
    font-size: 22px;
    font-weight: 600;
    color: #1d2327;
    margin: 0;
    line-height: 1;
}
.wp-media-modal-close {
    background: transparent;
    border: none;
    font-size: 26px;
    font-weight: 300;
    color: #50575e;
    cursor: pointer;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 3px;
}
.wp-media-modal-close:hover {
    color: #1d2327;
    background: #f0f0f1;
}

.wp-media-tabs-bar {
    display: flex;
    align-items: flex-end;
    padding: 0 20px;
    background: #ffffff;
    border-bottom: 1px solid #dcdcde;
    height: 38px;
    min-height: 38px;
    box-sizing: border-box;
}
.wp-media-tab-btn {
    padding: 8px 16px;
    font-size: 13px;
    cursor: pointer;
    background: transparent;
    border: 1px solid transparent;
    border-bottom: none;
    color: #50575e;
    margin-right: 4px;
    box-sizing: border-box;
    line-height: 1.4;
    user-select: none;
    outline: none;
}
.wp-media-tab-btn:hover {
    color: #2271b1;
}
.wp-media-tab-btn.is-active {
    background: #ffffff;
    border-color: #dcdcde;
    border-bottom-color: #ffffff;
    color: #1d2327;
    font-weight: 600;
    margin-bottom: -1px;
}

.wp-media-modal-body {
    flex: 1 1 0%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #ffffff;
    box-sizing: border-box;
}

.wp-media-upload-pane {
    flex: 1 1 0%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    box-sizing: border-box;
    overflow-y: auto;
}

.wp-media-library-pane {
    flex: 1 1 0%;
    min-height: 0;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    box-sizing: border-box;
}

.wp-media-library-main {
    flex: 1 1 0%;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
}

.wp-media-library-toolbar {
    padding: 10px 16px;
    background: #ffffff;
    border-bottom: 1px solid #dcdcde;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    box-sizing: border-box;
}

.wp-media-library-scroll {
    flex: 1 1 0%;
    min-height: 0;
    overflow-y: auto;
    padding: 16px;
    box-sizing: border-box;
}

.wp-media-grid-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
    box-sizing: border-box;
}

.wp-media-item-card {
    position: relative;
    width: 100%;
    height: 130px;
    background-color: #f0f0f1;
    border: 1px solid #dcdcde;
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;
    user-select: none;
    transition: border-color 0.15s, box-shadow 0.15s;
}
.wp-media-item-card:hover {
    border-color: #8c8f94;
}
.wp-media-item-card.is-selected {
    box-shadow: inset 0 0 0 3px #ffffff, inset 0 0 0 6px #2271b1;
    border-color: #2271b1;
}

.wp-media-thumb-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f1;
    overflow: hidden;
}
.wp-media-thumb-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.wp-media-check-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 24px;
    background-color: #2271b1;
    box-shadow: 0 0 0 1px #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    z-index: 10;
}

.wp-media-sidebar {
    width: 320px;
    min-width: 320px;
    max-width: 320px;
    background: #f6f7f7;
    border-left: 1px solid #dcdcde;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 16px;
    box-sizing: border-box;
    font-size: 12px;
}

.wp-media-sidebar-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #646970;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdcde;
}

.wp-media-sidebar-preview {
    width: 100%;
    height: 140px;
    background: #ffffff;
    border: 1px solid #dcdcde;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    margin-bottom: 12px;
    overflow: hidden;
    box-sizing: border-box;
}
.wp-media-sidebar-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
}

.wp-media-modal-footer {
    height: 56px;
    min-height: 56px;
    padding: 0 20px;
    border-top: 1px solid #dcdcde;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.wp-media-insert-btn {
    padding: 6px 18px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 3px;
    transition: all 0.15s;
    outline: none;
    background: #f6f7f7;
    border: 1px solid #dcdcde;
    color: #a7aaad;
    cursor: not-allowed;
}
.wp-media-insert-btn.is-active {
    background: #2271b1;
    border-color: #2271b1;
    color: #ffffff;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.wp-media-insert-btn.is-active:hover {
    background: #135e96;
    border-color: #135e96;
}
</style>
