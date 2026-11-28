<x-filament-panels::page>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: Add New Tag Form (WordPress Style) -->
        <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <div class="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span class="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                </span>
                <div>
                    <h2 class="text-base font-bold text-slate-900 dark:text-white">Add New Tag</h2>
                    <p class="text-xs text-slate-500">Create granular keywords to cross-reference articles.</p>
                </div>
            </div>

            <form wire:submit="addTag" class="space-y-4">
                <!-- Name -->
                <div>
                    <label for="tag-name" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Name <span class="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="tag-name"
                        wire:model.live.debounce.300ms="name"
                        placeholder="e.g. Meta Ads"
                        class="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2.5 px-3"
                        required
                    />
                    <p class="text-[11px] text-slate-400 mt-1">The name is how it appears on your blog and search filters.</p>
                    @error('name') <span class="text-[11px] text-rose-500 font-semibold">{{ $message }}</span> @enderror
                </div>

                <!-- Slug -->
                <div>
                    <label for="tag-slug" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Slug
                    </label>
                    <input
                        type="text"
                        id="tag-slug"
                        wire:model="tagSlug"
                        placeholder="e.g. meta-ads"
                        class="w-full text-xs font-mono rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2.5 px-3"
                    />
                    <p class="text-[11px] text-slate-400 mt-1">The “slug” is the URL-friendly version of the name.</p>
                </div>

                <!-- Description -->
                <div>
                    <label for="tag-desc" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Description
                    </label>
                    <textarea
                        id="tag-desc"
                        wire:model="description"
                        rows="3"
                        placeholder="Brief summary of this tag..."
                        class="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                    ></textarea>
                </div>

                <!-- Submit Button -->
                <div class="pt-2">
                    <button
                        type="submit"
                        class="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold shadow-xs transition-colors"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        <span>Add New Tag</span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Right Column: Tags Table (WordPress Style) -->
        <div class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-bold text-slate-900 dark:text-white">Existing Tags</h2>
                    <p class="text-xs text-slate-500">Keywords and tags used across your growth library.</p>
                </div>

                <!-- Live Search -->
                <div class="relative w-full sm:w-60">
                    <input
                        type="text"
                        wire:model.live.debounce.300ms="search"
                        placeholder="Search tags..."
                        class="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-8 pr-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
            </div>

            <!-- Tags Table -->
            <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                            <th class="py-2.5 px-3.5 font-bold">Name</th>
                            <th class="py-2.5 px-3 font-bold">Slug</th>
                            <th class="py-2.5 px-3 text-center font-bold">Posts Count</th>
                            <th class="py-2.5 px-3 text-right font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
                        @php $tags = $this->getTags(); @endphp
                        @forelse($tags as $tag)
                            <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                <td class="py-3 px-3.5">
                                    <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                                        {{ $tag['name'] }}
                                    </div>
                                    @if(!empty($tag['description']))
                                        <div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                            {{ $tag['description'] }}
                                        </div>
                                    @endif
                                </td>
                                <td class="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                    {{ $tag['slug'] ?? \Illuminate\Support\Str::slug($tag['name']) }}
                                </td>
                                <td class="py-3 px-3 text-center">
                                    <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        {{ $tag['count'] ?? 0 }}
                                    </span>
                                </td>
                                <td class="py-3 px-3 text-right">
                                    <button
                                        type="button"
                                        wire:click="deleteTag('{{ addslashes($tag['name']) }}')"
                                        wire:confirm="Are you sure you want to delete tag '{{ $tag['name'] }}'?"
                                        class="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                        title="Delete Tag"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="py-6 text-center text-slate-400">
                                    No tags found. Use the form on the left to add one!
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-filament-panels::page>
