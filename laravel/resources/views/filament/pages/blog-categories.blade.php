<x-filament-panels::page>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: Add New Category Form (WordPress Style) -->
        <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <div class="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span class="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                </span>
                <div>
                    <h2 class="text-base font-bold text-slate-900 dark:text-white">Add New Category</h2>
                    <p class="text-xs text-slate-500">Create a taxonomy category to organize your growth articles.</p>
                </div>
            </div>

            <form wire:submit="addCategory" class="space-y-4">
                <!-- Name -->
                <div>
                    <label for="cat-name" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Name <span class="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="cat-name"
                        wire:model.live.debounce.300ms="name"
                        placeholder="e.g. Email Marketing"
                        class="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2.5 px-3"
                        required
                    />
                    <p class="text-[11px] text-slate-400 mt-1">The name is how it appears on your site and blog cards.</p>
                    @error('name') <span class="text-[11px] text-rose-500 font-semibold">{{ $message }}</span> @enderror
                </div>

                <!-- Slug -->
                <div>
                    <label for="cat-slug" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Slug
                    </label>
                    <input
                        type="text"
                        id="cat-slug"
                        wire:model="categorySlug"
                        placeholder="e.g. email-marketing"
                        class="w-full text-xs font-mono rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2.5 px-3"
                    />
                    <p class="text-[11px] text-slate-400 mt-1">The “slug” is the URL-friendly version. Usually lowercase, letters, numbers, and hyphens.</p>
                </div>

                <!-- Description -->
                <div>
                    <label for="cat-desc" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Description
                    </label>
                    <textarea
                        id="cat-desc"
                        wire:model="description"
                        rows="3"
                        placeholder="Brief summary of what this category covers..."
                        class="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                    ></textarea>
                    <p class="text-[11px] text-slate-400 mt-1">The description helps search crawlers and category archive pages.</p>
                </div>

                <!-- Submit Button -->
                <div class="pt-2">
                    <button
                        type="submit"
                        class="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold shadow-xs transition-colors"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        <span>Add New Category</span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Right Column: Categories Table (WordPress Style) -->
        <div class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 class="text-base font-bold text-slate-900 dark:text-white">Existing Categories</h2>
                    <p class="text-xs text-slate-500">Categories currently available for blog posts.</p>
                </div>

                <!-- Live Search -->
                <div class="relative w-full sm:w-60">
                    <input
                        type="text"
                        wire:model.live.debounce.300ms="search"
                        placeholder="Search categories..."
                        class="w-full text-xs rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-8 pr-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
            </div>

            <!-- Categories Table -->
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
                        @php $cats = $this->getCategories(); @endphp
                        @forelse($cats as $cat)
                            <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                <td class="py-3 px-3.5">
                                    <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                                        {{ $cat['name'] }}
                                    </div>
                                    @if(!empty($cat['description']))
                                        <div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                            {{ $cat['description'] }}
                                        </div>
                                    @endif
                                </td>
                                <td class="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                    {{ $cat['slug'] ?? \Illuminate\Support\Str::slug($cat['name']) }}
                                </td>
                                <td class="py-3 px-3 text-center">
                                    <a
                                        href="/admin/blog-posts?tableFilters[category][value]={{ urlencode($cat['name']) }}"
                                        class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 transition-colors"
                                        title="View posts in this category"
                                    >
                                        {{ $cat['count'] ?? 0 }}
                                    </a>
                                </td>
                                <td class="py-3 px-3 text-right">
                                    <button
                                        type="button"
                                        wire:click="deleteCategory('{{ addslashes($cat['name']) }}')"
                                        wire:confirm="Are you sure you want to delete category '{{ $cat['name'] }}'?"
                                        class="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                        title="Delete Category"
                                    >
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="py-6 text-center text-slate-400">
                                    No categories found. Use the form on the left to add one!
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-filament-panels::page>
