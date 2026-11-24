<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="alternate icon" href="/favicon.svg">
<link rel="apple-touch-icon" href="/favicon.svg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

<style>
    /* ==========================================================================
       GETINTOFEED V6 — SLIM, COMPACT & CLEAN EXECUTIVE LIGHT THEME
       ========================================================================== */

    :root {
        --gif-font: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --gif-primary: #254bdb;
        --gif-wp-blue: #2271b1;
        --sidebar-width: 11.5rem !important;
        --collapsed-sidebar-width: 4.5rem !important;
    }

    /* ── BASE & GLOBAL TYPOGRAPHY ─────────────────────────────────────────── */
    html, body, .fi-body {
        font-family: var(--gif-font) !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        background-color: #f8fafc !important;
        color: #0f172a !important;
    }

    .fi-main {
        background-color: #f8fafc !important;
    }

    /* Modern Thin Scrollbar */
    ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 9999px;
    }

    /* ── COMPACT PURE WHITE LIGHT SIDEBAR ─────────────────────────────────── */
    .fi-sidebar {
        background-color: #ffffff !important;
        border-right: 1px solid #e2e8f0 !important;
        box-shadow: 1px 0 6px rgba(15, 23, 42, 0.03) !important;
    }

    /* Strict Desktop Dimensions — Eliminates unwanted dead space on the right */
    @media (min-width: 1024px) {
        /* Expanded / Open Desktop Sidebar (Ultra-Compact 11.5rem / 184px — completely eliminates dead space) */
        aside.fi-sidebar,
        .fi-sidebar,
        aside.fi-sidebar.fi-sidebar-open {
            width: 11.5rem !important;
            min-width: 11.5rem !important;
            max-width: 11.5rem !important;
            flex-basis: 11.5rem !important;
            transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Collapsed Desktop Sidebar (Rail Mode: 4.5rem / 72px) */
        aside.fi-sidebar:not(.fi-sidebar-open),
        aside.fi-sidebar.fi-sidebar-close,
        aside.fi-sidebar.fi-sidebar-collapsed {
            width: 4.5rem !important;
            min-width: 4.5rem !important;
            max-width: 4.5rem !important;
            flex-basis: 4.5rem !important;
        }
    }

    /* Sidebar Header & Brand Logo Container */
    .fi-sidebar-header {
        background-color: #ffffff !important;
        border-bottom: 1px solid #f1f5f9 !important;
        padding: 0.45rem 0.5rem !important;
        height: 3.25rem !important;
        min-height: 3.25rem !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        overflow: hidden !important; /* CRITICAL: prevents any text spill outside header */
    }

    /* Open State: Full Logo on Left, Collapse Button on Right */
    aside.fi-sidebar-open .fi-sidebar-header {
        padding: 0.45rem 0.6rem !important;
        justify-content: space-between !important;
    }

    /* Collapsed State: ONLY the tilted 'G' logo badge, centered in 72px rail */
    aside:not(.fi-sidebar-open) .fi-sidebar-header {
        padding: 0.45rem 0.25rem !important;
        justify-content: center !important;
    }

    aside:not(.fi-sidebar-open) .fi-brand-logo-text {
        display: none !important;
    }

    aside:not(.fi-sidebar-open) .fi-sidebar-collapse-toggle-btn {
        display: none !important;
    }

    aside:not(.fi-sidebar-open) .fi-sidebar-header > div,
    aside:not(.fi-sidebar-open) .fi-sidebar-header a {
        margin: 0 auto !important;
        justify-content: center !important;
        width: 100% !important;
        display: flex !important;
    }

    /* Sidebar Collapse (<) Button (Visible in Open State) */
    .fi-sidebar-collapse-toggle-btn {
        align-items: center !important;
        justify-content: center !important;
        width: 26px !important;
        height: 26px !important;
        min-width: 26px !important;
        min-height: 26px !important;
        border-radius: 0.375rem !important;
        color: #475569 !important;
        background-color: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
        padding: 0 !important;
        flex-shrink: 0 !important;
        display: inline-flex !important;
    }

    .fi-sidebar-collapse-toggle-btn:hover {
        background-color: #eff6ff !important;
        color: #2563eb !important;
        border-color: #bfdbfe !important;
    }

    .fi-sidebar-collapse-toggle-btn svg {
        width: 14px !important;
        height: 14px !important;
        color: inherit !important;
    }

    .fi-sidebar-footer {
        display: none !important;
    }

    .fi-sidebar-nav {
        padding-top: 0.15rem !important;
        padding-bottom: 0.5rem !important;
        padding-left: 0.25rem !important;
        padding-right: 0.25rem !important;
        overflow-x: hidden !important;
    }

    /* Ultra-Clean Group Spacing — Eliminates huge vertical dead space between groups */
    .fi-sidebar-nav-groups {
        gap: 0.35rem !important;
    }

    .fi-sidebar-group {
        margin-top: 0.08rem !important;
        margin-bottom: 0.08rem !important;
    }

    .fi-sidebar-group-items {
        gap: 0.08rem !important;
    }

    /* Compact Navigation Items (Dashboard, Services, Leads etc.) */
    .fi-sidebar-nav .fi-sidebar-item-button {
        height: 34px !important;
        min-height: 34px !important;
        max-height: 34px !important;
        border-radius: 0.375rem !important;
        margin: 0.08rem 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 0.35rem 0.6rem !important;
        font-size: 0.8125rem !important;
        font-weight: 600 !important;
        color: #334155 !important;
        background-color: transparent !important;
        transition: all 0.12s ease !important;
        border: none !important;
        box-shadow: none !important;
        display: flex !important;
        align-items: center !important;
    }

    .fi-sidebar-nav .fi-sidebar-item-button span,
    .fi-sidebar-nav .fi-sidebar-item-label {
        color: #334155 !important;
        font-size: 0.8125rem !important;
        font-weight: 600 !important;
    }

    .fi-sidebar-nav .fi-sidebar-item-icon {
        color: #64748b !important;
        width: 1.1rem !important;
        height: 1.1rem !important;
        flex-shrink: 0 !important;
    }

    .fi-sidebar-nav .fi-sidebar-item-button:hover {
        background-color: #f1f5f9 !important;
        color: #0f172a !important;
    }

    .fi-sidebar-nav .fi-sidebar-item-button:hover span,
    .fi-sidebar-nav .fi-sidebar-item-button:hover .fi-sidebar-item-label {
        color: #0f172a !important;
    }

    .fi-sidebar-nav .fi-sidebar-item-button:hover .fi-sidebar-item-icon {
        color: #2563eb !important;
    }

    /* Active Item (Dashboard, etc.) */
    .fi-sidebar-nav .fi-sidebar-item-active .fi-sidebar-item-button {
        background-color: #eff6ff !important;
        color: #1d4ed8 !important;
        font-weight: 700 !important;
        border-left: 3px solid #2563eb !important;
        border-radius: 0 0.375rem 0.375rem 0 !important;
        box-shadow: none !important;
    }

    .fi-sidebar-nav .fi-sidebar-item-active .fi-sidebar-item-button span,
    .fi-sidebar-nav .fi-sidebar-item-active .fi-sidebar-item-label {
        color: #1d4ed8 !important;
        font-weight: 700 !important;
    }

    .fi-sidebar-nav .fi-sidebar-item-active .fi-sidebar-item-icon {
        color: #2563eb !important;
    }

    /* Badges (Count Pill in sidebar only) */
    .fi-sidebar .fi-badge,
    .fi-sidebar-item-badge,
    .fi-sidebar-item-badge-ctn {
        display: none !important;
    }

    /* Table & Content Badges — Visible, crisp & well-aligned */
    .fi-ta-table .fi-badge,
    .fi-ta-cell .fi-badge,
    .fi-badge {
        display: inline-flex !important;
    }

    /* Standard Group Section Headers (CONTENT STUDIO, INBOUND & GROWTH, etc.) */
    .fi-sidebar-group-label,
    .fi-sidebar-group-label span,
    .fi-sidebar-group-button,
    .fi-sidebar-group-button span {
        font-size: 0.65rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        color: #94a3b8 !important;
        padding: 0.2rem 0.45rem 0.05rem 0.45rem !important;
        margin: 0 !important;
    }

    /* Hide Chevrons on all groups */
    .fi-sidebar-group svg[class*="chevron"],
    .fi-sidebar-group-collapse-button svg,
    .fi-sidebar-group button > svg:last-child {
        display: none !important;
    }

    /* ── WORDPRESS POSTS MENU (Compact Royal Blue Banner & Light Submenu) ──── */
    .wp-posts-sidebar-group {
        background-color: transparent !important;
        border-radius: 0 !important;
        margin: 0.05rem 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
    }

    /* Compact Blue Header: Posts */
    .wp-posts-sidebar-group > .fi-sidebar-group-label,
    .wp-posts-sidebar-group > .fi-sidebar-group-button,
    .wp-posts-sidebar-group > div:first-child {
        height: 32px !important;
        min-height: 32px !important;
        max-height: 32px !important;
        background-color: #2271b1 !important; /* Authentic WordPress Blue */
        color: #ffffff !important;
        padding: 0.25rem 0.55rem !important;
        margin: 0.05rem 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
        border-radius: 0.375rem !important;
        font-size: 0.8125rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.01em !important;
        display: flex !important;
        align-items: center !important;
        text-transform: none !important;
        border: none !important;
        box-shadow: 0 1px 3px rgba(34, 113, 177, 0.25) !important;
    }

    .wp-posts-sidebar-group > .fi-sidebar-group-label span,
    .wp-posts-sidebar-group > .fi-sidebar-group-button span {
        color: #ffffff !important;
        font-size: 0.8125rem !important;
        font-weight: 700 !important;
        text-transform: none !important;
    }

    .wp-posts-sidebar-group svg:last-child {
        display: none !important;
    }

    /* Only show WP Posts Header when sidebar is open */
    .fi-sidebar-close .wp-posts-sidebar-group > div:first-child,
    .fi-sidebar-close .wp-posts-sidebar-group > .fi-sidebar-group-label,
    .fi-sidebar-collapsed .wp-posts-sidebar-group > div:first-child,
    .fi-sidebar-collapsed .wp-posts-sidebar-group > .fi-sidebar-group-label,
    aside[class*="collapsed"] .wp-posts-sidebar-group > div:first-child,
    aside[class*="collapsed"] .wp-posts-sidebar-group > .fi-sidebar-group-label,
    aside:not(.fi-sidebar-open) .wp-posts-sidebar-group > div:first-child,
    aside:not(.fi-sidebar-open) .wp-posts-sidebar-group > .fi-sidebar-group-label {
        display: none !important;
    }

    /* ── COLLAPSED SIDEBAR RULES (Clean Centered Icon Rail) ─────────────────── */
    aside:not(.fi-sidebar-open) .wp-posts-sidebar-group .fi-sidebar-group-items,
    aside:not(.fi-sidebar-open) .fi-sidebar-group-items,
    .fi-sidebar-close .wp-posts-sidebar-group .fi-sidebar-group-items,
    .fi-sidebar-close .fi-sidebar-group-items,
    .fi-sidebar-collapsed .wp-posts-sidebar-group .fi-sidebar-group-items,
    .fi-sidebar-collapsed .fi-sidebar-group-items {
        padding: 0 !important;
        margin: 0 !important;
    }

    aside:not(.fi-sidebar-open) .fi-sidebar-item-button,
    aside:not(.fi-sidebar-open) .wp-posts-sidebar-group .fi-sidebar-item-button,
    .fi-sidebar-close .fi-sidebar-item-button,
    .fi-sidebar-close .wp-posts-sidebar-group .fi-sidebar-item-button,
    .fi-sidebar-collapsed .fi-sidebar-item-button,
    .fi-sidebar-collapsed .wp-posts-sidebar-group .fi-sidebar-item-button {
        width: 2.5rem !important;
        height: 2.5rem !important;
        min-height: 2.5rem !important;
        max-height: 2.5rem !important;
        padding: 0 !important;
        margin: 0.15rem auto !important;
        justify-content: center !important;
        border-radius: 0.375rem !important;
        border-left: none !important;
    }

    aside:not(.fi-sidebar-open) .fi-sidebar-item-button span,
    aside:not(.fi-sidebar-open) .fi-sidebar-item-label,
    .fi-sidebar-close .fi-sidebar-item-button span,
    .fi-sidebar-close .fi-sidebar-item-label,
    .fi-sidebar-collapsed .fi-sidebar-item-button span,
    .fi-sidebar-collapsed .fi-sidebar-item-label,
    aside:not(.fi-sidebar-open) .fi-sidebar-group-label,
    aside:not(.fi-sidebar-open) .fi-sidebar-group-button,
    .fi-sidebar-close .fi-sidebar-group-label,
    .fi-sidebar-close .fi-sidebar-group-button,
    .fi-sidebar-collapsed .fi-sidebar-group-label,
    .fi-sidebar-collapsed .fi-sidebar-group-button {
        display: none !important;
    }

    aside:not(.fi-sidebar-open) .fi-sidebar-item-icon,
    .fi-sidebar-close .fi-sidebar-item-icon,
    .fi-sidebar-collapsed .fi-sidebar-item-icon {
        margin: 0 !important;
        width: 1.15rem !important;
        height: 1.15rem !important;
    }

    aside:not(.fi-sidebar-open) .fi-sidebar-item-active .fi-sidebar-item-button,
    .fi-sidebar-close .fi-sidebar-item-active .fi-sidebar-item-button,
    .fi-sidebar-collapsed .fi-sidebar-item-active .fi-sidebar-item-button {
        background-color: #eff6ff !important;
        color: #1d4ed8 !important;
        border-left: none !important;
        border-radius: 0.375rem !important;
    }

    aside:not(.fi-sidebar-open) .fi-sidebar-header,
    .fi-sidebar-close .fi-sidebar-header,
    .fi-sidebar-collapsed .fi-sidebar-header {
        padding: 0.65rem 0.25rem !important;
        justify-content: center !important;
    }

    aside:not(.fi-sidebar-open) .fi-sidebar-nav,
    .fi-sidebar-close .fi-sidebar-nav,
    .fi-sidebar-collapsed .fi-sidebar-nav {
        padding-left: 0.25rem !important;
        padding-right: 0.25rem !important;
    }

    /* Sub-items Container */
    .wp-posts-sidebar-group .fi-sidebar-group-items {
        background-color: transparent !important;
        padding: 0.1rem 0 0.1rem 0.45rem !important;
        margin: 0 !important;
        border: none !important;
        box-sizing: border-box !important;
        overflow-x: hidden !important;
    }

    /* Sub-items (All Posts, Add Post, Categories, Tags) */
    .wp-posts-sidebar-group .fi-sidebar-item-button {
        height: 30px !important;
        min-height: 30px !important;
        max-height: 30px !important;
        border-radius: 0.375rem !important;
        margin: 0.04rem 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 0.25rem 0.5rem !important;
        color: #475569 !important;
        background-color: transparent !important;
        transition: all 0.12s ease !important;
        border: none !important;
        box-shadow: none !important;
        display: flex !important;
        align-items: center !important;
    }

    .wp-posts-sidebar-group .fi-sidebar-item-button span,
    .wp-posts-sidebar-group .fi-sidebar-item-label {
        color: #475569 !important;
        font-size: 0.8125rem !important;
        font-weight: 500 !important;
    }

    .wp-posts-sidebar-group .fi-sidebar-item-icon {
        color: #94a3b8 !important;
        width: 1rem !important;
        height: 1rem !important;
        flex-shrink: 0 !important;
    }

    .wp-posts-sidebar-group .fi-sidebar-item-button:hover {
        background-color: #f1f5f9 !important;
        color: #0f172a !important;
    }

    .wp-posts-sidebar-group .fi-sidebar-item-button:hover span,
    .wp-posts-sidebar-group .fi-sidebar-item-button:hover .fi-sidebar-item-label {
        color: #0f172a !important;
    }

    /* Active Sub-item in Posts Menu */
    .wp-posts-sidebar-group .fi-sidebar-item-active .fi-sidebar-item-button {
        background-color: #eff6ff !important;
        color: #1d4ed8 !important;
        font-weight: 700 !important;
        border-left: 2.5px solid #2271b1 !important;
        border-radius: 0 0.375rem 0.375rem 0 !important;
    }

    .wp-posts-sidebar-group .fi-sidebar-item-active .fi-sidebar-item-button span,
    .wp-posts-sidebar-group .fi-sidebar-item-active .fi-sidebar-item-label {
        color: #1d4ed8 !important;
        font-weight: 700 !important;
    }

    .wp-posts-sidebar-group .fi-sidebar-item-active .fi-sidebar-item-icon {
        color: #2271b1 !important;
    }

    /* ── TOPBAR NAVIGATION (Clean Pure White) ───────────────────────────────── */
    .fi-topbar {
        background-color: #ffffff !important;
        border-bottom: 1px solid #e2e8f0 !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03) !important;
        height: 3.5rem !important;
    }

    /* Topbar Open Button on Desktop when sidebar is collapsed */
    .fi-main-ctn:not(.fi-main-ctn-sidebar-open) .fi-topbar-open-sidebar-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 32px !important;
        height: 32px !important;
        border-radius: 0.375rem !important;
        background-color: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        color: #334155 !important;
        margin-right: 0.5rem !important;
        cursor: pointer !important;
    }

    .fi-main-ctn:not(.fi-main-ctn-sidebar-open) .fi-topbar-open-sidebar-btn:hover {
        background-color: #eff6ff !important;
        color: #2563eb !important;
        border-color: #bfdbfe !important;
    }

    .fi-global-search-field input {
        border-radius: 9999px !important;
        border: 1px solid #e2e8f0 !important;
        background-color: #f8fafc !important;
        font-size: 0.8125rem !important;
        padding-left: 2.25rem !important;
        height: 32px !important;
    }

    .fi-global-search-field input:focus {
        border-color: #2563eb !important;
        background-color: #ffffff !important;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
    }

    /* ── RESOURCE TABLES & FORMS (Light & Crisp) ───────────────────────────── */
    .fi-ta-ctn {
        border-radius: 0.75rem !important;
        border: 1px solid #e2e8f0 !important;
        background-color: #ffffff !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03) !important;
    }

    .fi-ta-header-cell,
    .fi-ta-header-cell span {
        background-color: #f8fafc !important;
        color: #475569 !important;
        font-size: 0.75rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.03em !important;
        text-transform: uppercase !important;
    }

    .fi-ta-row:hover {
        background-color: rgba(241, 245, 249, 0.6) !important;
    }

    .fi-section, .fi-card {
        border-radius: 0.75rem !important;
        border: 1px solid #e2e8f0 !important;
        background-color: #ffffff !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03) !important;
    }

    /* ── ADVANCED YOAST SEO SUITE STYLING ─────────────────────────────────── */
    .yoast-seo-suite-section {
        border: 1px solid #f1d5e6 !important;
        background: #ffffff !important;
        box-shadow: 0 2px 8px -2px rgba(164, 40, 106, 0.08), 0 1px 3px rgba(15, 23, 42, 0.03) !important;
        border-radius: 0.875rem !important;
        overflow: hidden !important;
        transition: all 0.2s ease !important;
    }

    .yoast-seo-suite-section:hover {
        border-color: #e2b4d1 !important;
        box-shadow: 0 4px 14px -3px rgba(164, 40, 106, 0.12), 0 2px 4px rgba(15, 23, 42, 0.04) !important;
    }

    .yoast-seo-suite-section .fi-section-header {
        background: linear-gradient(180deg, #ffffff 0%, #fdf8fb 100%) !important;
        border-bottom: 1px solid #f6e6f0 !important;
        padding: 0.875rem 1.25rem !important;
    }

    .dark .yoast-seo-suite-section {
        border: 1px solid rgba(164, 40, 106, 0.3) !important;
        background: #18181b !important;
        box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.4) !important;
    }

    .dark .yoast-seo-suite-section .fi-section-header {
        background: linear-gradient(180deg, #18181b 0%, #151114 100%) !important;
        border-bottom: 1px solid rgba(164, 40, 106, 0.25) !important;
    }

    /* Form Inputs */
    .fi-fo-field-wrp input[type="text"],
    .fi-fo-field-wrp input[type="email"],
    .fi-fo-field-wrp select,
    .fi-fo-field-wrp textarea {
        border-radius: 0.375rem !important;
        border: 1px solid #cbd5e1 !important;
        font-size: 0.8125rem !important;
        background-color: #ffffff !important;
        color: #0f172a !important;
    }

    .fi-fo-field-wrp input:focus,
    .fi-fo-field-wrp select:focus,
    .fi-fo-field-wrp textarea:focus {
        border-color: #2563eb !important;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12) !important;
        outline: none !important;
    }

    /* WordPress Title & Editor */
    .wp-title-input input {
        font-size: 1.625rem !important;
        font-weight: 800 !important;
        line-height: 1.3 !important;
        border: none !important;
        border-bottom: 2px solid #e2e8f0 !important;
        border-radius: 0 !important;
        padding: 0.6rem 0.2rem !important;
        background-color: transparent !important;
        color: #0f172a !important;
    }

    .wp-title-input input:focus {
        border-bottom-color: #2563eb !important;
        box-shadow: none !important;
    }

    .wp-visual-editor .trix-content {
        min-height: 440px !important;
        font-size: 1rem !important;
        line-height: 1.75 !important;
        padding: 1.25rem !important;
        border-radius: 0.5rem !important;
        background-color: #ffffff !important;
        color: #1e293b !important;
    }

    .yoast-brand-logo {
        font-family: Georgia, 'Times New Roman', serif;
        font-weight: 900;
        font-size: 24px;
        color: #a4286a;
    }
</style>

<script>
    /* Style WordPress Posts Menu Group with Compact Blue Header */
    function styleWpPostsMenu() {
        document.querySelectorAll('.fi-sidebar-group, .fi-sidebar-group-label, .fi-sidebar-group-button').forEach(function(el) {
            var txt = (el.textContent || '').trim();
            if (txt.indexOf('Posts') === 0 || txt === 'Posts') {
                var group = el.closest('.fi-sidebar-group') || el;
                if (!group.classList.contains('wp-posts-sidebar-group')) {
                    group.classList.add('wp-posts-sidebar-group');
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', styleWpPostsMenu);
    } else {
        styleWpPostsMenu();
    }
    document.addEventListener('livewire:navigated', styleWpPostsMenu);
    document.addEventListener('livewire:init', styleWpPostsMenu);

    /* Prevent 419 Page Expired modal during background refresh */
    document.addEventListener('livewire:init', function() {
        if (window.Livewire && typeof window.Livewire.hook === 'function') {
            window.Livewire.hook('request', function(payload) {
                if (payload && typeof payload.fail === 'function') {
                    payload.fail(function(failure) {
                        if (failure && failure.status === 419 && typeof failure.preventDefault === 'function') {
                            failure.preventDefault();
                        }
                    });
                }
            });
        }
    });
</script>
