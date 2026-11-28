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
        --gif-primary: #2563eb;
        --gif-wp-blue: #2271b1;
        --sidebar-width: 12rem !important;
        --collapsed-sidebar-width: 4.5rem !important;
    }

    /* ── BASE & GLOBAL TYPOGRAPHY ─────────────────────────────────────────── */
    html, body, .fi-body {
        font-family: var(--gif-font) !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
    }

    .dark html, .dark body, .dark .fi-body, .dark .fi-main {
        background-color: #09090b !important;
        color: #f4f4f5 !important;
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

    /* ── COMPACT SIDEBAR ─────────────────────────────────── */
    .fi-sidebar {
        border-right: 1px solid #e2e8f0 !important;
    }

    .dark .fi-sidebar {
        background-color: #0d0d10 !important;
        border-right: 1px solid #27272a !important;
    }

    .dark .fi-sidebar-header {
        background-color: #0d0d10 !important;
        border-bottom: 1px solid #27272a !important;
    }

    .dark .fi-topbar {
        background-color: #0d0d10 !important;
        border-bottom: 1px solid #27272a !important;
    }

    /* Desktop Dimensions */
    @media (min-width: 1024px) {
        aside.fi-sidebar,
        .fi-sidebar,
        aside.fi-sidebar.fi-sidebar-open {
            width: 12rem !important;
            min-width: 12rem !important;
            max-width: 12rem !important;
            flex-basis: 12rem !important;
            transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

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

    /* ── TABLE ROW ACTIONS (Executive Micro-Pills) ─────────────────────────── */
    .fi-ta-actions {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.35rem !important;
        flex-wrap: nowrap !important;
        white-space: nowrap !important;
    }

    .fi-ta-actions .fi-link,
    .fi-ta-actions a.fi-link,
    .fi-ta-actions button.fi-link,
    .fi-ta-actions .fi-btn,
    .fi-ta-actions a.fi-btn,
    .fi-ta-actions button.fi-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.35rem !important;
        padding: 0.25rem 0.55rem !important;
        border-radius: 0.375rem !important;
        font-size: 0.75rem !important;
        font-weight: 600 !important;
        line-height: 1.25 !important;
        text-decoration: none !important;
        border: 1px solid #e2e8f0 !important;
        background-color: #f8fafc !important;
        color: #334155 !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer !important;
    }

    .fi-ta-actions .fi-link span,
    .fi-ta-actions .fi-btn span {
        text-decoration: none !important;
        font-weight: 600 !important;
        color: inherit !important;
        line-height: 1 !important;
    }

    .fi-ta-actions .fi-link svg,
    .fi-ta-actions .fi-btn svg,
    .fi-ta-actions .fi-link-icon {
        width: 13.5px !important;
        height: 13.5px !important;
        color: inherit !important;
        flex-shrink: 0 !important;
    }

    /* Hover Micro-Lift */
    .fi-ta-actions .fi-link:hover,
    .fi-ta-actions a.fi-link:hover,
    .fi-ta-actions button.fi-link:hover,
    .fi-ta-actions .fi-btn:hover {
        background-color: #f1f5f9 !important;
        border-color: #cbd5e1 !important;
        color: #0f172a !important;
        transform: translateY(-0.5px) !important;
        box-shadow: 0 2px 4px rgba(15, 23, 42, 0.08) !important;
        text-decoration: none !important;
    }

    /* Primary Accent Action (e.g. Edit) */
    .fi-ta-actions [class*="color-primary"].fi-link,
    .fi-ta-actions .fi-color-primary,
    .fi-ta-actions [class*="color-custom"].fi-link:first-child {
        background-color: #eff6ff !important;
        border-color: #bfdbfe !important;
        color: #2563eb !important;
    }

    .fi-ta-actions [class*="color-primary"].fi-link:hover,
    .fi-ta-actions .fi-color-primary:hover,
    .fi-ta-actions [class*="color-custom"].fi-link:first-child:hover {
        background-color: #dbeafe !important;
        border-color: #93c5fd !important;
        color: #1d4ed8 !important;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.12) !important;
    }

    /* Danger / Delete Action (e.g. Delete / Archive) */
    .fi-ta-actions [class*="color-danger"],
    .fi-ta-actions .fi-color-danger,
    .fi-ta-actions [class*="color-danger"] span,
    .fi-ta-actions .fi-link-color-danger {
        background-color: #fff1f2 !important;
        border-color: #fecdd3 !important;
        color: #e11d48 !important;
    }

    .fi-ta-actions [class*="color-danger"]:hover,
    .fi-ta-actions .fi-color-danger:hover {
        background-color: #ffe4e6 !important;
        border-color: #fda4af !important;
        color: #be123c !important;
        box-shadow: 0 2px 4px rgba(225, 29, 72, 0.12) !important;
    }

    /* Info / Schedule Action */
    .fi-ta-actions [class*="color-info"],
    .fi-ta-actions .fi-color-info {
        background-color: #f0fdf4 !important;
        border-color: #bbf7d0 !important;
        color: #16a34a !important;
    }

    .fi-ta-actions [class*="color-info"]:hover,
    .fi-ta-actions .fi-color-info:hover {
        background-color: #dcfce7 !important;
        border-color: #86efac !important;
        color: #15803d !important;
        box-shadow: 0 2px 4px rgba(22, 163, 74, 0.12) !important;
    }

    /* Dark Mode Table Actions */
    .dark .fi-ta-actions .fi-link,
    .dark .fi-ta-actions a.fi-link,
    .dark .fi-ta-actions button.fi-link,
    .dark .fi-ta-actions .fi-btn {
        background-color: #18181b !important;
        border-color: #27272a !important;
        color: #d4d4d8 !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
    }

    .dark .fi-ta-actions .fi-link:hover,
    .dark .fi-ta-actions a.fi-link:hover,
    .dark .fi-ta-actions button.fi-link:hover,
    .dark .fi-ta-actions .fi-btn:hover {
        background-color: #27272a !important;
        border-color: #3f3f46 !important;
        color: #f4f4f5 !important;
    }

    .dark .fi-ta-actions [class*="color-primary"].fi-link,
    .dark .fi-ta-actions .fi-color-primary {
        background-color: rgba(37, 99, 235, 0.12) !important;
        border-color: rgba(37, 99, 235, 0.28) !important;
        color: #60a5fa !important;
    }

    .dark .fi-ta-actions [class*="color-primary"].fi-link:hover {
        background-color: rgba(37, 99, 235, 0.2) !important;
        border-color: rgba(37, 99, 235, 0.4) !important;
    }

    .dark .fi-ta-actions [class*="color-danger"],
    .dark .fi-ta-actions .fi-color-danger {
        background-color: rgba(225, 29, 72, 0.12) !important;
        border-color: rgba(225, 29, 72, 0.28) !important;
        color: #fb7185 !important;
    }

    .dark .fi-ta-actions [class*="color-danger"]:hover {
        background-color: rgba(225, 29, 72, 0.2) !important;
        border-color: rgba(225, 29, 72, 0.4) !important;
    }

    .dark .fi-ta-actions [class*="color-info"],
    .dark .fi-ta-actions .fi-color-info {
        background-color: rgba(22, 163, 74, 0.12) !important;
        border-color: rgba(22, 163, 74, 0.28) !important;
        color: #4ade80 !important;
    }

    /* ── ADVANCED YOAST SEO SUITE STYLING (Executive AI Suite) ─────────────── */
    .yoast-seo-suite-section {
        border: 1px solid #e2e8f0 !important;
        background: #ffffff !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
        border-radius: 0.875rem !important;
        overflow: hidden !important;
        transition: all 0.2s ease !important;
    }

    .yoast-seo-suite-section:hover {
        border-color: #cbd5e1 !important;
        box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px rgba(15, 23, 42, 0.03) !important;
    }

    .yoast-seo-suite-section .fi-section-header {
        background: #ffffff !important;
        border-bottom: 1px solid #f1f5f9 !important;
        padding: 0.875rem 1.25rem !important;
    }

    .dark .yoast-seo-suite-section {
        border: 1px solid #27272a !important;
        background: #18181b !important;
        box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.4) !important;
    }

    .dark .yoast-seo-suite-section .fi-section-header {
        background: #18181b !important;
        border-bottom: 1px solid #27272a !important;
    }

    /* ── WORDPRESS POST EDITOR CANVAS FINISHING ────────────────────────────── */
    .wp-toolbar-row {
        background-color: #f8fafc !important;
        border-bottom: 1px solid #e2e8f0 !important;
        padding: 0.35rem 0.5rem !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 0.25rem !important;
        align-items: center !important;
    }

    .dark .wp-toolbar-row {
        background-color: #18181b !important;
        border-bottom: 1px solid #27272a !important;
    }

    .wp-toolbar-btn {
        width: 28px !important;
        height: 28px !important;
        border-radius: 0.375rem !important;
        border: 1px solid transparent !important;
        background-color: transparent !important;
        color: #475569 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        transition: all 0.12s ease !important;
    }

    .wp-toolbar-btn:hover {
        background-color: #ffffff !important;
        border-color: #e2e8f0 !important;
        color: #0f172a !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
    }

    .dark .wp-toolbar-btn {
        color: #a1a1aa !important;
    }

    .dark .wp-toolbar-btn:hover {
        background-color: #27272a !important;
        border-color: #3f3f46 !important;
        color: #f4f4f5 !important;
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

    /* ── EDITORIAL STUDIO + LIVE SEO STUDIO PRO (LIGHT & DARK MODE) ───────── */
    :root {
        --gif-bg: #ffffff;
        --gif-bg-soft: #f8fafc;
        --gif-bg-muted: #f1f5f9;
        --gif-border: #e2e8f0;
        --gif-border-strong: #cbd5e1;
        --gif-text: #0f172a;
        --gif-text-body: #334155;
        --gif-text-muted: #64748b;
        --gif-accent: #2563eb;
        --gif-accent-hover: #1d4ed8;
        --gif-accent-soft: #eff6ff;
        --gif-accent-border: #bfdbfe;
        --gif-success: #059669;
        --gif-success-bg: #ecfdf5;
        --gif-success-border: #a7f3d0;
        --gif-warn: #d97706;
        --gif-warn-bg: #fffbeb;
        --gif-warn-border: #fde68a;
        --gif-danger: #e11d48;
        --gif-danger-bg: #fff1f2;
        --gif-danger-border: #fecdd3;
        --gif-indigo: #4f46e5;
        --gif-indigo-bg: #eef2ff;
        --gif-indigo-border: #c7d2fe;
    }

    .dark {
        --gif-bg: #18181b;
        --gif-bg-soft: #111114;
        --gif-bg-muted: #27272a;
        --gif-border: #27272a;
        --gif-border-strong: #3f3f46;
        --gif-text: #f4f4f5;
        --gif-text-body: #d4d4d8;
        --gif-text-muted: #a1a1aa;
        --gif-accent: #3b82f6;
        --gif-accent-hover: #60a5fa;
        --gif-accent-soft: rgba(59, 130, 246, 0.14);
        --gif-accent-border: rgba(59, 130, 246, 0.35);
        --gif-success: #34d399;
        --gif-success-bg: rgba(16, 185, 129, 0.12);
        --gif-success-border: rgba(16, 185, 129, 0.3);
        --gif-warn: #fbbf24;
        --gif-warn-bg: rgba(245, 158, 11, 0.12);
        --gif-warn-border: rgba(245, 158, 11, 0.3);
        --gif-danger: #fb7185;
        --gif-danger-bg: rgba(244, 63, 94, 0.12);
        --gif-danger-border: rgba(244, 63, 94, 0.3);
        --gif-indigo: #818cf8;
        --gif-indigo-bg: rgba(99, 102, 241, 0.14);
        --gif-indigo-border: rgba(99, 102, 241, 0.35);
    }

    /* Dark Mode Filament Form Inputs Fix */
    .dark .fi-fo-field-wrp input[type="text"],
    .dark .fi-fo-field-wrp input[type="email"],
    .dark .fi-fo-field-wrp input[type="url"],
    .dark .fi-fo-field-wrp input[type="datetime-local"],
    .dark .fi-fo-field-wrp select,
    .dark .fi-fo-field-wrp textarea {
        background-color: #09090b !important;
        border-color: #3f3f46 !important;
        color: #f4f4f5 !important;
    }

    .gif-studio-pill {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        background: var(--gif-indigo-bg);
        color: var(--gif-indigo);
        border: 1px solid var(--gif-indigo-border);
    }

    .gif-add-new-btn {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 0.5rem;
        font-size: 12px;
        font-weight: 600;
        background: var(--gif-bg);
        color: var(--gif-accent);
        border: 1px solid var(--gif-accent-border);
        text-decoration: none;
        transition: all 0.15s ease;
    }
    .gif-add-new-btn:hover {
        background: var(--gif-accent-soft);
    }

    @media (min-width: 1024px) {
        .gif-sticky-sidebar {
            position: sticky;
            top: 4.25rem;
            align-self: start;
        }
    }

    .gif-editor-root {
        color: var(--gif-text);
        font-family: var(--gif-font);
    }
    .gif-editor-root.is-focus-mode {
        position: fixed;
        inset: 0;
        z-index: 60;
        background: var(--gif-bg-soft);
        padding: 20px 24px 48px;
        overflow-y: auto;
    }

    .gif-card {
        background: var(--gif-bg);
        border: 1px solid var(--gif-border);
        border-radius: 0.875rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        margin-bottom: 1.25rem;
    }

    .gif-sidebar-card {
        background: var(--gif-bg);
        border: 1px solid var(--gif-border);
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
        overflow: hidden;
        color: var(--gif-text);
    }

    .gif-sidebar-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 0.75rem 1rem;
        background: var(--gif-bg-soft);
        border-bottom: 1px solid var(--gif-border);
    }

    .gif-sidebar-title {
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--gif-text);
    }

    .gif-row-gap-2 {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    .gif-flex-1 { flex: 1 1 0%; }
    .gif-icon-sm { width: 16px; height: 16px; flex-shrink: 0; }
    .gif-icon-xs { width: 14px; height: 14px; flex-shrink: 0; }
    .gif-text-accent { color: var(--gif-accent); }

    /* Buttons */
    .gif-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 0.45rem 0.85rem;
        border-radius: 0.5rem;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.25;
        cursor: pointer;
        border: 1px solid transparent;
        text-decoration: none;
        transition: all 0.15s ease;
        white-space: nowrap;
    }
    .gif-btn-xs { padding: 0.3rem 0.65rem; font-size: 11px; }
    .gif-btn-primary {
        background: var(--gif-accent);
        color: #ffffff;
        border-color: var(--gif-accent);
        box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2);
    }
    .gif-btn-primary:hover { background: var(--gif-accent-hover); }
    .gif-btn-secondary {
        background: var(--gif-bg);
        color: var(--gif-text-body);
        border-color: var(--gif-border-strong);
    }
    .gif-btn-secondary:hover { background: var(--gif-bg-muted); color: var(--gif-text); }
    .gif-btn-indigo {
        background: var(--gif-indigo-bg);
        color: var(--gif-indigo);
        border-color: var(--gif-indigo-border);
    }
    .gif-btn-indigo:hover { filter: brightness(0.96); }
    .gif-btn-danger-ghost {
        background: transparent;
        color: var(--gif-danger);
        border-color: transparent;
    }
    .gif-btn-danger-ghost:hover {
        background: var(--gif-danger-bg);
        border-color: var(--gif-danger-border);
    }
    .gif-link-btn {
        background: none;
        border: none;
        color: var(--gif-accent);
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        padding: 2px 4px;
    }
    .gif-link-btn:hover { text-decoration: underline; }

    /* Badges */
    .gif-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 2px 8px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        border: 1px solid transparent;
    }
    .gif-badge-success { background: var(--gif-success-bg); color: var(--gif-success); border-color: var(--gif-success-border); }
    .gif-badge-warn { background: var(--gif-warn-bg); color: var(--gif-warn); border-color: var(--gif-warn-border); }
    .gif-badge-danger { background: var(--gif-danger-bg); color: var(--gif-danger); border-color: var(--gif-danger-border); }
    .gif-badge-info { background: var(--gif-accent-soft); color: var(--gif-accent); border-color: var(--gif-accent-border); }
    .gif-badge-neutral { background: var(--gif-bg-muted); color: var(--gif-text-muted); border-color: var(--gif-border); }

    .gif-dot { width: 6px; height: 6px; border-radius: 9999px; display: inline-block; }
    .gif-dot-success { background: var(--gif-success); }
    .gif-dot-warn { background: var(--gif-warn); }
    .gif-dot-danger { background: var(--gif-danger); }
    .gif-dot-info { background: var(--gif-accent); }

    /* Inputs */
    .gif-input,
    .fi-fo-field-wrp .gif-input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        font-size: 12.5px;
        font-weight: 500;
        border-radius: 0.5rem;
        border: 1px solid var(--gif-border-strong) !important;
        background: var(--gif-bg) !important;
        color: var(--gif-text) !important;
        outline: none;
        box-sizing: border-box;
    }
    .gif-input:focus,
    .fi-fo-field-wrp .gif-input:focus {
        border-color: var(--gif-accent) !important;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.14) !important;
    }

    .gif-title-input,
    .fi-fo-field-wrp .gif-title-input {
        width: 100%;
        padding: 0.8rem 1rem !important;
        font-size: 1.45rem !important;
        font-weight: 800 !important;
        letter-spacing: -0.02em;
        line-height: 1.25;
        border-radius: 0.75rem !important;
        border: 1px solid var(--gif-border-strong) !important;
        background: var(--gif-bg) !important;
        color: var(--gif-text) !important;
        box-sizing: border-box;
    }

    .gif-permalink-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        margin-top: 8px;
        border-radius: 0.5rem;
        background: var(--gif-bg-soft);
        border: 1px solid var(--gif-border);
        font-size: 12px;
    }
    .gif-permalink-slug {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-weight: 700;
        color: var(--gif-accent);
        text-decoration: none;
        word-break: break-all;
    }
    .gif-permalink-slug:hover { text-decoration: underline; }

    /* Publish Box & Sidebar */
    .gif-publish-top-actions {
        display: flex;
        gap: 8px;
        padding: 12px;
        border-bottom: 1px solid var(--gif-border);
    }
    .gif-publish-meta-list {
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .gif-meta-block { border-bottom: 1px solid var(--gif-border); padding-bottom: 8px; }
    .gif-meta-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 12px;
    }
    .gif-meta-label { color: var(--gif-text-muted); font-weight: 500; }
    .gif-meta-value { color: var(--gif-text); font-weight: 700; }
    .gif-flyout {
        margin-top: 8px;
        padding: 10px;
        border-radius: 0.5rem;
        background: var(--gif-bg-soft);
        border: 1px solid var(--gif-border);
    }
    .gif-checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--gif-text-body);
        cursor: pointer;
    }
    .gif-publish-bottom-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 12px;
        background: var(--gif-bg-soft);
        border-top: 1px solid var(--gif-border);
    }

    /* TOC Sidebar */
    .gif-toc-body { padding: 10px 12px; }
    .gif-toc-empty { font-size: 12px; color: var(--gif-text-muted); line-height: 1.5; margin: 4px 0; }
    .gif-toc-warning {
        padding: 6px 10px;
        border-radius: 6px;
        background: var(--gif-danger-bg);
        border: 1px solid var(--gif-danger-border);
        color: var(--gif-danger);
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 8px;
    }
    .gif-toc-list {
        list-style: none;
        margin: 0;
        padding: 0;
        max-height: 260px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .gif-toc-item {
        width: 100%;
        display: flex;
        align-items: flex-start;
        gap: 6px;
        text-align: left;
        padding: 5px 8px;
        border-radius: 6px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--gif-text-body);
        font-size: 12px;
        line-height: 1.35;
        transition: background 0.12s ease;
    }
    .gif-toc-item:hover { background: var(--gif-bg-muted); color: var(--gif-text); }
    .gif-toc-level-3 { padding-left: 20px; font-size: 11.5px; }
    .gif-toc-level-4 { padding-left: 32px; font-size: 11px; color: var(--gif-text-muted); }
    .gif-toc-tag {
        flex-shrink: 0;
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 9.5px;
        font-weight: 800;
        background: var(--gif-accent-soft);
        color: var(--gif-accent);
        margin-top: 1px;
    }
    .gif-toc-text { word-break: break-word; }

    /* Editor Card & Sticky Toolbar */
    .gif-editor-top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        padding: 10px 14px;
        background: var(--gif-bg-soft);
        border-bottom: 1px solid var(--gif-border);
        border-radius: 0.875rem 0.875rem 0 0;
    }

    .gif-sticky-toolbar {
        position: sticky;
        top: 3.5rem;
        z-index: 25;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        padding: 8px 14px;
        background: var(--gif-bg);
        border-bottom: 1px solid var(--gif-border);
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    }
    .gif-editor-root.is-focus-mode .gif-sticky-toolbar {
        top: 0;
    }

    .gif-tb-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        min-width: 30px;
        padding: 0 7px;
        border-radius: 6px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--gif-text-body);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.12s ease;
    }
    .gif-tb-btn:hover {
        background: var(--gif-bg-muted);
        border-color: var(--gif-border);
        color: var(--gif-text);
    }
    .gif-tb-sep {
        width: 1px;
        height: 18px;
        background: var(--gif-border);
        margin: 0 4px;
    }
    .gif-tb-select,
    .fi-fo-field-wrp .gif-tb-select {
        height: 30px;
        padding: 0 10px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        border-radius: 6px !important;
        border: 1px solid var(--gif-border-strong) !important;
        background: var(--gif-bg-soft) !important;
        color: var(--gif-text) !important;
        cursor: pointer;
    }

    .gif-mode-switch {
        display: inline-flex;
        align-items: center;
        padding: 2px;
        border-radius: 8px;
        background: var(--gif-bg-muted);
        border: 1px solid var(--gif-border);
    }
    .gif-mode-btn {
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11.5px;
        font-weight: 700;
        border: none;
        background: transparent;
        color: var(--gif-text-muted);
        cursor: pointer;
    }
    .gif-mode-btn.is-active {
        background: var(--gif-bg);
        color: var(--gif-accent);
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
    }

    .gif-dropdown-menu {
        position: absolute;
        left: 0;
        top: calc(100% + 6px);
        width: 275px;
        background: var(--gif-bg);
        border: 1px solid var(--gif-border-strong);
        border-radius: 0.75rem;
        box-shadow: 0 14px 30px -6px rgba(15, 23, 42, 0.2);
        padding: 6px;
        z-index: 40;
    }
    .gif-dropdown-item {
        width: 100%;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 8px;
        border: none;
        background: transparent;
        text-align: left;
        cursor: pointer;
        color: var(--gif-text);
    }
    .gif-dropdown-item:hover { background: var(--gif-bg-muted); }

    /* Visual Writing Canvas */
    .gif-article-canvas {
        min-height: 460px;
        padding: 24px 28px;
        background: var(--gif-bg);
        color: var(--gif-text);
        font-size: 15.5px;
        line-height: 1.75;
        outline: none;
    }
    .gif-article-canvas:empty::before {
        content: "Start writing your article here... Use H2/H3 subheadings, lists, and one-click SEO blocks above.";
        color: var(--gif-text-muted);
        pointer-events: none;
    }
    .gif-article-canvas h2 { font-size: 1.5rem; font-weight: 800; margin: 1.5rem 0 0.75rem; color: var(--gif-text); line-height: 1.3; }
    .gif-article-canvas h3 { font-size: 1.25rem; font-weight: 700; margin: 1.25rem 0 0.5rem; color: var(--gif-text); line-height: 1.35; }
    .gif-article-canvas h4 { font-size: 1.075rem; font-weight: 700; margin: 1rem 0 0.45rem; color: var(--gif-text); }
    .gif-article-canvas p { margin: 0.75rem 0; }
    .gif-article-canvas ul { list-style: disc; padding-left: 1.5rem; margin: 0.85rem 0; }
    .gif-article-canvas ol { list-style: decimal; padding-left: 1.5rem; margin: 0.85rem 0; }
    .gif-article-canvas blockquote {
        margin: 1.25rem 0;
        padding: 0.85rem 1.25rem;
        border-left: 4px solid var(--gif-accent);
        background: var(--gif-bg-soft);
        border-radius: 0 8px 8px 0;
        font-style: italic;
        color: var(--gif-text-body);
    }
    .gif-article-canvas a { color: var(--gif-accent); text-decoration: underline; }
    .gif-article-canvas table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; }
    .gif-article-canvas th, .gif-article-canvas td { border: 1px solid var(--gif-border-strong); padding: 8px 12px; }
    .gif-article-canvas img { max-width: 100%; height: auto; border-radius: 8px; }
    .gif-article-canvas hr { border: 0; border-top: 2px solid var(--gif-border); margin: 1.5rem 0; }

    .gif-code-textarea,
    .fi-fo-field-wrp .gif-code-textarea {
        width: 100%;
        min-height: 460px;
        padding: 20px !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important;
        font-size: 12.5px !important;
        line-height: 1.65 !important;
        background: #09090b !important;
        color: #e4e4e7 !important;
        border: none !important;
        border-radius: 0 !important;
        resize: vertical;
        outline: none;
    }

    .gif-editor-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
        padding: 10px 14px;
        background: var(--gif-bg-soft);
        border-top: 1px solid var(--gif-border);
        border-radius: 0 0 0.875rem 0.875rem;
        font-size: 12px;
        color: var(--gif-text-muted);
    }
    .gif-editor-footer strong { color: var(--gif-text); }

    /* SEO Studio PRO */
    .gif-seo-header {
        padding: 14px 20px;
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        border-radius: 0.875rem 0.875rem 0 0;
    }

    .gif-seo-dashboard {
        padding: 18px 20px;
        background: var(--gif-bg-soft);
        border-bottom: 1px solid var(--gif-border);
        display: grid;
        grid-template-columns: 1fr;
        gap: 18px;
        align-items: center;
    }
    @media (min-width: 768px) {
        .gif-seo-dashboard { grid-template-columns: 260px 1fr; }
    }

    .gif-pillar-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }
    @media (min-width: 640px) {
        .gif-pillar-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    .gif-pillar-card {
        padding: 10px 12px;
        border-radius: 10px;
        background: var(--gif-bg);
        border: 1px solid var(--gif-border);
    }

    .gif-progress-track {
        width: 100%;
        height: 6px;
        border-radius: 9999px;
        background: var(--gif-bg-muted);
        overflow: hidden;
        position: relative;
    }
    .gif-progress-fill {
        height: 100%;
        border-radius: 9999px;
        transition: width 0.25s ease;
    }

    .gif-tabs-bar {
        display: flex;
        align-items: center;
        gap: 4px;
        overflow-x: auto;
        padding: 10px 16px 0;
        border-bottom: 1px solid var(--gif-border);
        background: var(--gif-bg);
    }
    .gif-tab-btn {
        padding: 8px 12px 10px;
        font-size: 12px;
        font-weight: 700;
        border: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: var(--gif-text-muted);
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
    }
    .gif-tab-btn:hover { color: var(--gif-text); }
    .gif-tab-btn.is-active {
        color: var(--gif-accent);
        border-bottom-color: var(--gif-accent);
    }

    .gif-panel-box {
        padding: 14px 16px;
        border-radius: 12px;
        background: var(--gif-bg-soft);
        border: 1px solid var(--gif-border);
    }

    .gif-audit-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 9px 12px;
        border-radius: 8px;
        font-size: 12px;
        border: 1px solid transparent;
    }
    .gif-audit-crit { background: var(--gif-danger-bg); border-color: var(--gif-danger-border); color: var(--gif-text); }
    .gif-audit-tip { background: var(--gif-warn-bg); border-color: var(--gif-warn-border); color: var(--gif-text); }
    .gif-audit-pass { background: var(--gif-success-bg); border-color: var(--gif-success-border); color: var(--gif-text); }

    /* SERP Simulator */
    .gif-serp-card {
        padding: 16px 18px;
        border-radius: 12px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        color: #202124;
        font-family: Arial, Roboto, sans-serif;
    }
    .dark .gif-serp-card {
        background: #0f1117;
        border-color: #27272a;
        color: #e4e4e7;
    }
    .gif-serp-title {
        color: #1a0dab;
        font-size: 19px;
        font-weight: 500;
        line-height: 1.3;
        margin: 4px 0;
    }
    .dark .gif-serp-title { color: #8ab4f8; }
    .gif-serp-desc {
        color: #4d5156;
        font-size: 13px;
        line-height: 1.5;
    }
    .dark .gif-serp-desc { color: #bdc1c6; }
    .gif-serp-faq-item {
        border-top: 1px solid var(--gif-border);
        padding: 8px 0;
        font-size: 12.5px;
    }

    /* Modals */
    .gif-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(15, 23, 42, 0.72);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
    }
    .gif-modal-window {
        width: 100%;
        max-width: 760px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        background: var(--gif-bg);
        color: var(--gif-text);
        border: 1px solid var(--gif-border-strong);
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
        overflow: hidden;
    }
    .gif-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        border-bottom: 1px solid var(--gif-border);
        background: var(--gif-bg-soft);
    }
    .gif-modal-body {
        padding: 16px 18px;
        overflow-y: auto;
        flex: 1 1 auto;
    }
    .gif-modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        padding: 12px 18px;
        border-top: 1px solid var(--gif-border);
        background: var(--gif-bg-soft);
    }
    .gif-media-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
        gap: 10px;
        max-height: 240px;
        overflow-y: auto;
        padding: 4px 0;
    }
    .gif-media-tile {
        position: relative;
        height: 96px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid var(--gif-border);
        background: var(--gif-bg-muted);
        cursor: pointer;
        padding: 0;
    }
    .gif-media-tile.is-selected {
        border-color: var(--gif-accent);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
    }
    .gif-media-tile img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
    .gif-dropzone {
        border: 2px dashed var(--gif-border-strong);
        border-radius: 12px;
        padding: 24px 16px;
        text-align: center;
        background: var(--gif-bg-soft);
        cursor: pointer;
        transition: all 0.15s ease;
    }
    .gif-dropzone.is-dragging {
        border-color: var(--gif-accent);
        background: var(--gif-accent-soft);
    }
    .gif-toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 12px;
        background: #09090b;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 600;
        border: 1px solid #27272a;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    }

    /* ── PHASE 2: EDITORIAL STUDIO MOBILE-FIRST, DRAWERS & DEVICE PREVIEW ─── */
    .gif-mobile-tabs-bar,
    .gif-mobile-bottom-bar {
        display: none;
    }

    .gif-autosave-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        background: var(--gif-bg-muted);
        color: var(--gif-text-body);
        border: 1px solid var(--gif-border);
    }
    .gif-autosave-pill.is-saving {
        background: var(--gif-accent-soft);
        color: var(--gif-accent);
        border-color: var(--gif-accent-border);
    }
    .gif-autosave-pill.is-offline,
    .gif-autosave-pill.is-conflict {
        background: var(--gif-danger-bg);
        color: var(--gif-danger);
        border-color: var(--gif-danger-border);
    }

    .gif-status-banner {
        margin-bottom: 12px;
        padding: 10px 14px;
        border-radius: 10px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        font-size: 12px;
    }
    .gif-status-banner.is-warn {
        background: var(--gif-warn-bg);
        border: 1px solid var(--gif-warn-border);
        color: var(--gif-text);
    }
    .gif-status-banner.is-danger {
        background: var(--gif-danger-bg);
        border: 1px solid var(--gif-danger-border);
        color: var(--gif-danger);
    }
    .gif-status-banner.is-info {
        background: var(--gif-indigo-bg);
        border: 1px solid var(--gif-indigo-border);
        color: var(--gif-text);
    }

    /* Slide-Over Revisions Drawer */
    .gif-drawer-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9998;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(3px);
        display: flex;
        justify-content: flex-end;
    }
    .gif-drawer-panel {
        width: 100%;
        max-width: 640px;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: var(--gif-bg);
        color: var(--gif-text);
        border-left: 1px solid var(--gif-border-strong);
        box-shadow: -16px 0 40px rgba(0, 0, 0, 0.35);
    }
    .gif-diff-line {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 11.5px;
        line-height: 1.5;
        padding: 2px 8px;
        border-radius: 4px;
        white-space: pre-wrap;
        word-break: break-word;
    }
    .gif-diff-line.is-added { background: rgba(16, 185, 129, 0.14); color: var(--gif-success); }
    .gif-diff-line.is-removed { background: rgba(244, 63, 94, 0.14); color: var(--gif-danger); }

    /* Responsive Preview Frame */
    .gif-preview-stage {
        background: var(--gif-bg-muted);
        border: 1px solid var(--gif-border);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        justify-content: center;
        overflow-x: auto;
        min-height: 360px;
        max-height: 62vh;
        overflow-y: auto;
    }
    .gif-preview-frame {
        background: var(--gif-bg);
        color: var(--gif-text);
        border: 1px solid var(--gif-border-strong);
        border-radius: 12px;
        padding: 22px 24px;
        width: 100%;
        flex: 0 0 auto;
        transition: max-width 0.2s ease, width 0.2s ease;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        overflow-wrap: anywhere;
    }
    .gif-preview-frame.is-mobile { width: 375px; max-width: 100%; padding: 16px 14px; }
    .gif-preview-frame.is-tablet { width: 768px; max-width: 100%; }
    .gif-preview-frame.is-desktop { width: 100%; max-width: 100%; }
    .gif-preview-frame .gif-table-scroll { width: 100%; overflow-x: auto; }
    .gif-preview-frame table { width: 100%; border-collapse: collapse; min-width: 420px; }
    .gif-preview-frame th, .gif-preview-frame td { border: 1px solid var(--gif-border-strong); padding: 6px 10px; }

    @media (max-width: 1023px) {
        html, body, .fi-main, .fi-page, .fi-fo-component-ctn, .fi-fo-field-wrp, .gif-editor-root, #gif-content-pane, .gif-card {
            min-width: 0 !important;
            max-width: 100% !important;
            overflow-x: clip !important;
        }
        .gif-title-input {
            font-size: 1.3rem !important;
            padding: 10px 12px !important;
        }
        .gif-permalink-bar {
            max-width: 100%;
            overflow-wrap: anywhere;
        }
        body:has(.gif-editor-root) .fi-page {
            padding-bottom: 84px !important;
        }
        .gif-mobile-tabs-bar {
            position: sticky;
            top: 3.25rem;
            z-index: 45;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 4px;
            padding: 6px;
            margin: 0 0 12px;
            border-radius: 12px;
            background: var(--gif-bg);
            border: 1px solid var(--gif-border-strong);
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }
        .gif-mobile-tab-btn {
            min-height: 44px;
            border-radius: 8px;
            border: none;
            background: transparent;
            color: var(--gif-text-muted);
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            padding: 4px 6px;
            white-space: nowrap;
        }
        .gif-mobile-tab-btn.is-active {
            background: var(--gif-accent);
            color: #ffffff;
        }
        .gif-sticky-toolbar {
            position: sticky;
            top: 6.9rem;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            padding: 6px 10px !important;
            gap: 6px !important;
            max-width: 100%;
        }
        .gif-sticky-toolbar.is-keyboard-pinned {
            position: fixed !important;
            top: auto !important;
            left: 0 !important;
            right: 0 !important;
            bottom: var(--gif-vv-bottom, 0px) !important;
            z-index: 95 !important;
            border-top: 1px solid var(--gif-border-strong);
            border-bottom: none;
            box-shadow: 0 -6px 20px rgba(15, 23, 42, 0.16);
        }
        .gif-tb-btn,
        .gif-tb-select,
        .gif-mode-btn,
        .gif-tab-btn,
        .gif-btn {
            min-height: 44px !important;
        }
        .gif-tb-btn {
            min-width: 44px !important;
            padding: 0 10px !important;
            flex-shrink: 0;
        }
        .gif-tb-select {
            flex-shrink: 0;
        }
        .gif-mobile-bottom-bar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 55;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            padding: 8px 12px calc(8px + env(safe-area-inset-bottom, 0px));
            background: var(--gif-bg);
            border-top: 1px solid var(--gif-border-strong);
            box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.12);
        }
        .gif-toast {
            bottom: 86px;
            right: 12px;
            left: 12px;
        }
        html[data-gif-mobile-tab="content"] #gif-seo-studio-pro,
        html[data-gif-mobile-tab="content"] .gif-sticky-sidebar {
            display: none !important;
        }
        html[data-gif-mobile-tab="seo"] #gif-content-pane,
        html[data-gif-mobile-tab="seo"] .gif-sticky-sidebar {
            display: none !important;
        }
        html[data-gif-mobile-tab="publish"] #gif-content-pane,
        html[data-gif-mobile-tab="publish"] #gif-seo-studio-pro,
        html[data-gif-mobile-tab="publish"] .gif-sidebar-media {
            display: none !important;
        }
        html[data-gif-mobile-tab="media"] #gif-content-pane,
        html[data-gif-mobile-tab="media"] #gif-seo-studio-pro,
        html[data-gif-mobile-tab="media"] .gif-sidebar-publish {
            display: none !important;
        }
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
