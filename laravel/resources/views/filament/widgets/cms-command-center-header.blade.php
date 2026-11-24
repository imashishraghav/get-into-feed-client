<x-filament-widgets::widget>
    <div class="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 p-6 shadow-2xl backdrop-blur-md">
        <!-- Ambient subtle glow -->
        <div class="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-[#cfff04]/10 blur-3xl pointer-events-none"></div>

        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <!-- Left: Greeting & Mission -->
            <div>
                <div class="flex items-center gap-2 mb-1.5">
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#cfff04]/10 text-[#cfff04] border border-[#cfff04]/30">
                        CMS Command Center
                    </span>
                    <span class="text-xs text-slate-400 font-mono">{{ date('D, d M Y') }}</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {{ $this->getGreeting() }}, <span class="text-[#cfff04]">{{ $this->getUserName() }}</span>
                </h1>
                <p class="text-sm text-slate-400 mt-1 max-w-xl">
                    GetIntoFeed enterprise publishing hub. Create structured content, audit search optimization, and manage release workflows.
                </p>
            </div>

            <!-- Right: Quick Actions Group -->
            <div class="flex flex-wrap items-center gap-2">
                <a href="/admin/services/create" 
                   class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#cfff04] text-slate-950 hover:bg-[#d9ff26] shadow-sm shadow-[#cfff04]/20 transition-all transform hover:-translate-y-0.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Service</span>
                </a>

                <a href="/admin/case-studies/create" 
                   class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-all">
                    <svg class="w-3.5 h-3.5 text-[#cfff04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>New Case Study</span>
                </a>

                <a href="/admin/blog-posts/create" 
                   class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-all">
                    <svg class="w-3.5 h-3.5 text-[#cfff04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>New Blog</span>
                </a>

                <a href="/admin/pages/create" 
                   class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-all">
                    <svg class="w-3.5 h-3.5 text-[#cfff04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>New Page</span>
                </a>

                <a href="/admin/media/create" 
                   class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-all">
                    <svg class="w-3.5 h-3.5 text-[#cfff04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Upload Media</span>
                </a>
            </div>
        </div>
    </div>
</x-filament-widgets::widget>
