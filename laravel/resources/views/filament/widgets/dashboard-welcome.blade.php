<x-filament-widgets::widget>
    @php
        $counts = $this->getCounts();
        $recentLeads = $this->getRecentLeads();
        $services = $this->getServices();
        $recentSubs = $this->getRecentSubscribers();
        $health = $this->getSystemHealth();

        $kpis = [
            [
                'title' => 'Form Enquiries',
                'value' => number_format($counts['leads']),
                'sub' => ($counts['crm_failed'] > 0 ? "{$counts['crm_failed']} failed CRM sync" : ($counts['new_leads'] > 0 ? "{$counts['new_leads']} unreviewed" : 'All synced to CRM')),
                'badge' => ($counts['crm_failed'] > 0 ? "● {$counts['crm_failed']} SYNC ERR" : ($counts['new_leads'] > 0 ? "● {$counts['new_leads']} NEW" : 'ALL CLEAR')),
                'badge_tone' => (($counts['crm_failed'] > 0 || $counts['new_leads'] > 0) ? '#dc2626' : '#059669'),
                'badge_bg' => (($counts['crm_failed'] > 0 || $counts['new_leads'] > 0) ? '#fef2f2' : '#ecfdf5'),
                'badge_border' => (($counts['crm_failed'] > 0 || $counts['new_leads'] > 0) ? '#fecaca' : '#a7f3d0'),
                'url' => '/admin/leads',
                'icon_bg' => '#eff6ff',
                'icon_color' => '#2563eb',
                'border_accent' => '#2563eb',
                'icon' => 'heroicon-m-inbox-arrow-down',
            ],
            [
                'title' => 'Active Services',
                'value' => number_format($counts['services']),
                'sub' => 'Live catalog pillars',
                'badge' => 'SYNCED',
                'badge_tone' => '#059669',
                'badge_bg' => '#ecfdf5',
                'badge_border' => '#a7f3d0',
                'url' => '/admin/services',
                'icon_bg' => '#ecfdf5',
                'icon_color' => '#059669',
                'border_accent' => '#059669',
                'icon' => 'heroicon-m-sparkles',
            ],
            [
                'title' => 'Case Studies',
                'value' => number_format($counts['case_studies']),
                'sub' => 'Client proof & ROI',
                'badge' => 'PORTFOLIO',
                'badge_tone' => '#7c3aed',
                'badge_bg' => '#f5f3ff',
                'badge_border' => '#ddd6fe',
                'url' => '/admin/case-studies',
                'icon_bg' => '#f5f3ff',
                'icon_color' => '#7c3aed',
                'border_accent' => '#7c3aed',
                'icon' => 'heroicon-m-presentation-chart-line',
            ],
            [
                'title' => 'Client Reviews',
                'value' => number_format($counts['testimonials']),
                'sub' => ($counts['testimonials'] > 0 ? "{$counts['testimonials_avg']} ★ verified score" : 'No reviews published'),
                'badge' => ($counts['testimonials'] > 0 ? "{$counts['testimonials_avg']} ★ RATED" : 'NO REVIEWS'),
                'badge_tone' => ($counts['testimonials'] > 0 ? '#d97706' : '#64748b'),
                'badge_bg' => ($counts['testimonials'] > 0 ? '#fffbeb' : '#f8fafc'),
                'badge_border' => ($counts['testimonials'] > 0 ? '#fde68a' : '#e2e8f0'),
                'url' => '/admin/testimonials',
                'icon_bg' => '#fffbeb',
                'icon_color' => '#d97706',
                'border_accent' => '#d97706',
                'icon' => 'heroicon-m-star',
            ],
            [
                'title' => 'Subscribers',
                'value' => number_format($counts['subscribers']),
                'sub' => 'Newsletter audience',
                'badge' => 'AUDIENCE',
                'badge_tone' => '#0d9488',
                'badge_bg' => '#f0fdfa',
                'badge_border' => '#99f6e4',
                'url' => '/admin/newsletter-subscribers',
                'icon_bg' => '#f0fdfa',
                'icon_color' => '#0d9488',
                'border_accent' => '#0d9488',
                'icon' => 'heroicon-m-envelope',
            ],
            [
                'title' => 'Feed Notes Blog',
                'value' => number_format($counts['blog_posts']),
                'sub' => 'Growth SEO articles',
                'badge' => 'SEO LIVE',
                'badge_tone' => '#4f46e5',
                'badge_bg' => '#eef2ff',
                'badge_border' => '#c7d2fe',
                'url' => '/admin/blog-posts',
                'icon_bg' => '#eef2ff',
                'icon_color' => '#4f46e5',
                'border_accent' => '#4f46e5',
                'icon' => 'heroicon-m-newspaper',
            ],
        ];
    @endphp

    <style>
        .gif-dash-wrapper {
            font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #0f172a;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            overflow-x: hidden;
        }

        .gif-dash-wrapper *, .gif-dash-wrapper *::before, .gif-dash-wrapper *::after {
            box-sizing: border-box;
        }

        /* ── HERO BANNER (FULLY RESPONSIVE) ──────────────────────── */
        .gif-dash-hero {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 26px 28px;
            box-shadow: 0 4px 18px -4px rgba(15, 23, 42, 0.04);
            display: grid;
            grid-template-columns: minmax(0, 1fr) 320px;
            align-items: center;
            gap: 24px;
            position: relative;
            overflow: hidden;
            width: 100%;
            max-width: 100%;
        }
        .gif-dash-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #84cc16 0%, #10b981 35%, #2563eb 100%);
        }
        @media (max-width: 1080px) {
            .gif-dash-hero {
                grid-template-columns: 1fr;
                gap: 20px;
                padding: 22px 20px;
            }
        }
        @media (max-width: 640px) {
            .gif-dash-hero {
                padding: 18px 16px;
                border-radius: 14px;
            }
        }

        .gif-dash-pill {
            display: inline-flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 6px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            color: #475569;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 11.5px;
            font-weight: 700;
            letter-spacing: 0.02em;
            max-width: 100%;
        }

        .gif-dash-pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #10b981;
            box-shadow: 0 0 8px #10b981;
            animation: gifDotPulse 2s infinite ease-in-out;
            flex-shrink: 0;
        }

        @keyframes gifDotPulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.85); opacity: 0.4; }
            100% { transform: scale(1); opacity: 1; }
        }

        .gif-dash-title {
            font-size: clamp(20px, 2.5vw, 26px);
            font-weight: 800;
            letter-spacing: -0.03em;
            margin: 10px 0 6px 0;
            color: #0f172a;
            line-height: 1.25;
            word-break: break-word;
        }

        .gif-dash-title span.name {
            background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .gif-dash-sub {
            color: #64748b;
            font-size: clamp(12.5px, 1.4vw, 13.5px);
            line-height: 1.5;
            max-width: 640px;
            margin: 0;
            font-weight: 450;
        }

        .gif-dash-actions {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin-top: 18px;
            width: 100%;
        }

        .gif-btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            background: #2563eb;
            color: #ffffff;
            font-weight: 700;
            font-size: 12px;
            padding: 8px 16px;
            border-radius: 10px;
            text-decoration: none;
            transition: all 0.15s ease;
            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.22);
            min-height: 38px;
        }
        .gif-btn-primary:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .gif-btn-primary svg {
            width: 15px !important;
            height: 15px !important;
            flex-shrink: 0;
        }

        .gif-btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            color: #334155;
            font-weight: 650;
            font-size: 12px;
            padding: 8px 13px;
            border-radius: 10px;
            text-decoration: none;
            transition: all 0.15s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
            min-height: 38px;
        }
        .gif-btn-secondary:hover {
            background: #f8fafc;
            border-color: #94a3b8;
            color: #0f172a;
            transform: translateY(-1px);
        }
        .gif-btn-secondary svg {
            width: 14px !important;
            height: 14px !important;
            flex-shrink: 0;
        }

        @media (max-width: 540px) {
            .gif-dash-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
            .gif-btn-primary {
                grid-column: 1 / -1;
                width: 100%;
            }
            .gif-btn-secondary {
                width: 100%;
                font-size: 11.5px;
                padding: 8px 6px;
            }
        }

        /* Hero Right Telemetry Card */
        .gif-dash-telemetry {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px 18px;
            box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
            width: 100%;
        }

        .gif-dash-telemetry-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11.5px;
            font-weight: 750;
            color: #059669;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
        }

        .gif-dash-telemetry-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11.5px;
            color: #64748b;
            margin-bottom: 7px;
        }
        .gif-dash-telemetry-row span.val {
            color: #0f172a;
            font-weight: 700;
        }

        .gif-dash-telemetry-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px dashed #e2e8f0;
            width: 100%;
            font-size: 11.5px;
            font-weight: 700;
            color: #2563eb;
            text-decoration: none;
        }
        .gif-dash-telemetry-link:hover {
            color: #1d4ed8;
            text-decoration: underline;
        }
        .gif-dash-telemetry-link svg {
            width: 12px !important;
            height: 12px !important;
            flex-shrink: 0;
        }

        /* ── 6-COLUMN KPI GRID (RESPONSIVE) ──────────────────────── */
        .gif-dash-kpi-grid {
            display: grid;
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 14px;
            margin-top: 18px;
            width: 100%;
        }
        @media (max-width: 1280px) {
            .gif-dash-kpi-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }
        @media (max-width: 640px) {
            .gif-dash-kpi-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 10px;
            }
        }
        @media (max-width: 380px) {
            .gif-dash-kpi-grid {
                grid-template-columns: 1fr;
            }
        }

        .gif-dash-kpi-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 148px;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
            transition: all 0.16s ease;
            position: relative;
            overflow: hidden;
            width: 100%;
        }
        .gif-dash-kpi-card:hover {
            border-color: #cbd5e1;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.06);
        }

        .gif-dash-kpi-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }

        .gif-dash-kpi-icon {
            width: 34px;
            height: 34px;
            border-radius: 9px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .gif-dash-kpi-icon svg {
            width: 18px !important;
            height: 18px !important;
            flex-shrink: 0;
        }

        .gif-dash-kpi-badge {
            font-size: 9.5px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 2px 7px;
            border-radius: 9999px;
            letter-spacing: 0.03em;
            white-space: nowrap;
        }

        .gif-dash-kpi-val {
            font-size: clamp(24px, 2.5vw, 28px);
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.03em;
            margin: 10px 0 2px 0;
            line-height: 1;
        }

        .gif-dash-kpi-lbl {
            font-size: 12px;
            font-weight: 700;
            color: #334155;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .gif-dash-kpi-sub {
            font-size: 11px;
            color: #64748b;
            margin: 2px 0 0 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .gif-dash-kpi-foot {
            margin-top: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            font-weight: 700;
            color: #2563eb;
        }
        .gif-dash-kpi-foot svg {
            width: 12px !important;
            height: 12px !important;
            flex-shrink: 0;
        }

        /* ── SECTION CARD WRAPPER ────────────────────────────────── */
        .gif-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
            overflow: hidden;
            margin-top: 20px;
            width: 100%;
            max-width: 100%;
        }

        .gif-card-header {
            padding: 16px 20px;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            background: #ffffff;
            gap: 10px;
            width: 100%;
        }
        @media (max-width: 640px) {
            .gif-card-header {
                padding: 14px 16px;
            }
        }

        .gif-card-title {
            font-size: 13.5px;
            font-weight: 800;
            color: #0f172a;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            letter-spacing: -0.01em;
            line-height: 1.3;
        }

        .gif-title-icon-badge {
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .gif-title-icon-badge svg {
            width: 15px !important;
            height: 15px !important;
            flex-shrink: 0;
        }

        .gif-card-link {
            font-size: 11.5px;
            font-weight: 700;
            color: #2563eb;
            text-decoration: none;
            white-space: nowrap;
        }
        .gif-card-link:hover {
            color: #1d4ed8;
            text-decoration: underline;
        }

        .gif-export-btn {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 7px;
            font-size: 11px;
            font-weight: 700;
            text-decoration: none;
            white-space: nowrap;
        }
        .gif-export-btn svg {
            width: 12px !important;
            height: 12px !important;
            flex-shrink: 0;
        }
        .gif-export-excel {
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
        }
        .gif-export-excel:hover {
            background: #d1fae5;
        }
        .gif-export-pdf {
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fde68a;
        }
        .gif-export-pdf:hover {
            background: #fef3c7;
        }

        /* ── INBOUND LEADS TABLE (SCROLL-PROTECTED) ───────────────── */
        .gif-table-scroll {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        .gif-table {
            width: 100%;
            min-width: 720px;
            border-collapse: collapse;
            font-size: 12.5px;
        }
        .gif-table th {
            text-align: left;
            padding: 11px 16px;
            background: #f8fafc;
            color: #475569;
            font-weight: 750;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #e2e8f0;
            white-space: nowrap;
        }
        .gif-table td {
            padding: 13px 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #1e293b;
            vertical-align: middle;
        }
        .gif-table tr:hover td {
            background-color: #fbfcfe;
        }

        .gif-mobile-scroll-hint {
            display: none;
            font-size: 11px;
            color: #64748b;
            padding: 6px 16px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            align-items: center;
            gap: 5px;
        }
        @media (max-width: 768px) {
            .gif-mobile-scroll-hint {
                display: flex;
            }
        }

        .gif-badge-new {
            background: #fee2e2;
            color: #b91c1c;
            border: 1px solid #fecaca;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 9999px;
            text-transform: uppercase;
            display: inline-flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
        }

        .gif-badge-contacted {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 9999px;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .gif-btn-wa {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #25d366;
            color: #ffffff;
            font-weight: 700;
            font-size: 11px;
            padding: 5px 9px;
            border-radius: 7px;
            text-decoration: none;
            box-shadow: 0 1px 4px rgba(37, 211, 102, 0.25);
            white-space: nowrap;
        }
        .gif-btn-wa:hover {
            background: #1ebd5a;
        }
        .gif-btn-wa svg {
            width: 12px !important;
            height: 12px !important;
            flex-shrink: 0;
        }

        .gif-btn-call {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
            font-weight: 700;
            font-size: 11px;
            padding: 5px 8px;
            border-radius: 7px;
            text-decoration: none;
            white-space: nowrap;
        }
        .gif-btn-call:hover {
            background: #2563eb;
            color: #ffffff;
        }
        .gif-btn-call svg {
            width: 11px !important;
            height: 11px !important;
            flex-shrink: 0;
        }

        .gif-btn-edit {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            background: #ffffff;
            color: #334155;
            border: 1px solid #cbd5e1;
            font-weight: 700;
            font-size: 11px;
            padding: 5px 8px;
            border-radius: 7px;
            text-decoration: none;
            white-space: nowrap;
        }
        .gif-btn-edit:hover {
            background: #0f172a;
            color: #ffffff;
        }

        /* ── SERVICES GRID (3-COL ON DESKTOP, 2-COL TABLET, 1-COL MOBILE) ── */
        .gif-services-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            padding: 18px 20px;
            width: 100%;
        }
        @media (max-width: 1024px) {
            .gif-services-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }
        @media (max-width: 600px) {
            .gif-services-grid {
                grid-template-columns: 1fr;
                padding: 14px 16px;
            }
        }

        .gif-srv-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 138px;
            text-decoration: none;
            transition: all 0.16s ease;
            width: 100%;
        }
        .gif-srv-card:hover {
            background: #ffffff;
            border-color: #cbd5e1;
            transform: translateY(-2px);
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
        }

        /* ── 4-CARD OPERATIONS GRID ──────────────────────────────── */
        .gif-ops-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            margin-top: 20px;
            width: 100%;
        }
        @media (max-width: 1280px) {
            .gif-ops-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }
        @media (max-width: 640px) {
            .gif-ops-grid {
                grid-template-columns: 1fr;
            }
        }

        .gif-ops-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .gif-action-list {
            padding: 14px 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .gif-action-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 9px 12px;
            color: #0f172a;
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.14s ease;
        }
        .gif-action-item:hover {
            background: #0f172a;
            color: #ffffff;
            border-color: #0f172a;
            transform: translateX(2px);
        }
        .gif-action-item:hover span.arr {
            color: #84cc16;
        }

        /* Infrastructure Rows */
        .gif-infra-list {
            padding: 14px 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .gif-infra-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #475569;
            padding-bottom: 8px;
            border-bottom: 1px dashed #e2e8f0;
        }
        .gif-infra-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }

        .gif-infra-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            color: #059669;
            font-size: 10.5px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 9999px;
            white-space: nowrap;
        }
    </style>

    <div class="gif-dash-wrapper">

        <!-- ═══════════════════════════════════════════════════════════════════
             1. EXECUTIVE COMMAND HERO BANNER (RESPONSIVE)
        ═══════════════════════════════════════════════════════════════════ -->
        <div class="gif-dash-hero">
            <div style="min-width: 0; width: 100%;">
                <div class="gif-dash-pill">
                    <span class="gif-dash-pulse-dot"></span>
                    <span>GetIntoFeed</span>
                    <span style="color: #cbd5e1;">|</span>
                    <span>{{ now()->format('l, d F Y') }}</span>
                </div>

                <h1 class="gif-dash-title">
                    {{ $this->getGreeting() }}, <span class="name">{{ $this->getUserName() }}</span> 👋
                </h1>

                <p class="gif-dash-sub">
                    Real-time command center to track inbound client inquiries, manage live marketing services, and scale digital growth performance.
                </p>

                <div class="gif-dash-actions">
                    <a href="/admin/leads" class="gif-btn-primary">
                        <x-filament::icon icon="heroicon-m-inbox-arrow-down" style="color: #ffffff;" />
                        <span>Leads</span>
                        @if ($counts['new_leads'] > 0)
                            <span style="background: #ffffff; color: #2563eb; font-size: 10px; font-weight: 800; padding: 1px 7px; border-radius: 9999px; margin-left: 2px;">
                                {{ $counts['new_leads'] }} NEW
                            </span>
                        @else
                            <span style="background: rgba(255,255,255,0.22); color: #ffffff; font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 9999px;">
                                {{ $counts['leads'] }}
                            </span>
                        @endif
                    </a>

                    <a href="/admin/services" class="gif-btn-secondary">
                        <x-filament::icon icon="heroicon-m-sparkles" style="color: #059669;" />
                        <span>Services ({{ $counts['services'] }})</span>
                    </a>

                    <a href="/admin/case-studies/create" class="gif-btn-secondary">
                        <x-filament::icon icon="heroicon-m-plus" style="color: #7c3aed;" />
                        <span>Case Study</span>
                    </a>

                    <a href="/admin/blog-posts/create" class="gif-btn-secondary">
                        <x-filament::icon icon="heroicon-m-plus" style="color: #2271b1;" />
                        <span>Article</span>
                    </a>

                    <a href="/admin/media" class="gif-btn-secondary">
                        <x-filament::icon icon="heroicon-m-photo" style="color: #0d9488;" />
                        <span>Media</span>
                    </a>
                </div>
            </div>

            <!-- Right Telemetry Overview -->
            <div class="gif-dash-telemetry">
                <div class="gif-dash-telemetry-header">
                    <div style="display: inline-flex; align-items: center; gap: 6px;">
                        <span class="gif-dash-pulse-dot" style="{{ $health['db_connected'] && $health['failed_jobs'] === 0 ? '' : 'background:#f59e0b;' }}"></span>
                        <span>Agency Status</span>
                    </div>
                    <span style="{{ $health['db_connected'] && $health['failed_jobs'] === 0 ? 'background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857;' : 'background: #fffbeb; border: 1px solid #fde68a; color: #b45309;' }} font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px;">
                        {{ $health['db_connected'] ? ($health['failed_jobs'] === 0 ? 'OPERATIONAL (' . $health['db_latency_ms'] . 'ms)' : 'DEGRADED (' . $health['failed_jobs'] . ' FAIL)') : 'DB UNREACHABLE' }}
                    </span>
                </div>

                <div class="gif-dash-telemetry-row">
                    <span>Published Services:</span>
                    <span class="val">{{ $counts['services'] }} Live</span>
                </div>
                <div class="gif-dash-telemetry-row">
                    <span>Verified Case Studies:</span>
                    <span class="val">{{ $counts['case_studies'] }} Projects</span>
                </div>
                <div class="gif-dash-telemetry-row">
                    <span>Client Testimonials:</span>
                    <span class="val">{{ $counts['testimonials'] > 0 ? "{$counts['testimonials']} Quotes ({$counts['testimonials_avg']} ★)" : "No reviews published" }}</span>
                </div>
                <div class="gif-dash-telemetry-row">
                    <span>CRM Outbound Sync:</span>
                    <span class="val">{{ $counts['crm_failed'] > 0 ? "{$counts['crm_failed']} Errors" : "{$counts['crm_synced']} Synced" }}</span>
                </div>
                <div class="gif-dash-telemetry-row">
                    <span>Media Assets:</span>
                    <span class="val">{{ $counts['media'] }} Files</span>
                </div>

                <a href="https://getintofeed.com" target="_blank" rel="noopener noreferrer" class="gif-dash-telemetry-link">
                    <span>Open Live Website (getintofeed.com)</span>
                    <x-filament::icon icon="heroicon-m-arrow-top-right-on-square" />
                </a>
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════════
             2. 6-COLUMN RESPONSIVE KPI METRIC CARDS
        ═══════════════════════════════════════════════════════════════════ -->
        <div class="gif-dash-kpi-grid">
            @foreach ($kpis as $kpi)
                <a href="{{ $kpi['url'] }}" class="gif-dash-kpi-card" style="border-top: 3px solid {{ $kpi['border_accent'] }};">
                    <div>
                        <div class="gif-dash-kpi-top">
                            <span class="gif-dash-kpi-icon" style="background: {{ $kpi['icon_bg'] }}; color: {{ $kpi['icon_color'] }};">
                                <x-filament::icon icon="{{ $kpi['icon'] }}" />
                            </span>

                            <span class="gif-dash-kpi-badge" style="background: {{ $kpi['badge_bg'] }}; color: {{ $kpi['badge_tone'] }}; border: 1px solid {{ $kpi['badge_border'] }};">
                                {{ $kpi['badge'] }}
                            </span>
                        </div>

                        <div class="gif-dash-kpi-val">{{ $kpi['value'] }}</div>
                        <div class="gif-dash-kpi-lbl">{{ $kpi['title'] }}</div>
                        <div class="gif-dash-kpi-sub">{{ $kpi['sub'] }}</div>
                    </div>

                    <div class="gif-dash-kpi-foot">
                        <span>Manage Hub</span>
                        <x-filament::icon icon="heroicon-m-arrow-right" />
                    </div>
                </a>
            @endforeach
        </div>

        <!-- ═══════════════════════════════════════════════════════════════════
             3. INCOMING CLIENT LEADS & FREE AUDITS (FULL-WIDTH, ZERO OVERFLOW)
        ═══════════════════════════════════════════════════════════════════ -->
        <div class="gif-card">
            <div class="gif-card-header">
                <h2 class="gif-card-title">
                    <span class="gif-title-icon-badge" style="background: #eff6ff; color: #2563eb;">
                        <x-filament::icon icon="heroicon-m-inbox-stack" />
                    </span>
                    <span>Client Leads & Inquiries</span>
                </h2>

                <div style="display: flex; align-items: center; gap: 8px;">
                    <a href="{{ route('admin.leads.csv') }}" class="gif-export-btn gif-export-excel" title="Download clean Excel CSV file" target="_blank">
                        <x-filament::icon icon="heroicon-m-arrow-down-tray" />
                        <span>Excel</span>
                    </a>
                    <a href="{{ route('admin.leads.pdf') }}" class="gif-export-btn gif-export-pdf" title="Print or save PDF report" target="_blank">
                        <x-filament::icon icon="heroicon-m-document-text" />
                        <span>PDF</span>
                    </a>
                    <a href="/admin/leads" class="gif-card-link" style="margin-left: 4px;">
                        View All ({{ $counts['leads'] }}) →
                    </a>
                </div>
            </div>

            @if ($recentLeads->isEmpty())
                <div style="padding: 44px 20px; text-align: center; color: #64748b; background: #fafbfc;">
                    <div style="width: 48px; height: 48px; border-radius: 12px; background: #eff6ff; color: #2563eb; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                        <x-filament::icon icon="heroicon-o-inbox" style="width: 22px; height: 22px;" />
                    </div>
                    <p style="font-weight: 800; color: #0f172a; font-size: 14.5px; margin: 0;">No client inquiries received yet</p>
                    <p style="font-size: 12.5px; max-width: 440px; margin: 5px auto 14px auto; line-height: 1.5;">
                        When visitors submit a contact form or request a free digital audit on getintofeed.com, their details will appear here immediately with 1-click WhatsApp and call buttons.
                    </p>
                    <a href="/admin/leads" class="gif-btn-secondary" style="display: inline-flex;">
                        <span>Explore Leads Hub</span>
                        <span>→</span>
                    </a>
                </div>
            @else
                <div class="gif-mobile-scroll-hint">
                    <span>👈 Swipe table horizontally to view full contact details & WhatsApp actions 👉</span>
                </div>
                <div class="gif-table-scroll">
                    <table class="gif-table">
                        <thead>
                            <tr>
                                <th>Client / Business</th>
                                <th>Contact Details</th>
                                <th>Service Inquired</th>
                                <th>Status</th>
                                <th>Received</th>
                                <th style="text-align: right; padding-right: 18px;">Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($recentLeads as $lead)
                                @php
                                    $cleanPhone = preg_replace('/[^0-9]/', '', $lead->phone ?? '');
                                    if (strlen($cleanPhone) === 10) {
                                        $cleanPhone = '91' . $cleanPhone;
                                    }
                                    $serviceName = $lead->interested_service ?: ($lead->service_interested ?: 'Digital Growth');
                                    $waUrl = !empty($cleanPhone) ? "https://wa.me/{$cleanPhone}?text=" . urlencode("Hi {$lead->name}, Ashish here from GetIntoFeed. We received your project inquiry regarding {$serviceName}. Let's connect!") : null;
                                    $telUrl = !empty($cleanPhone) ? "tel:+{$cleanPhone}" : null;
                                    $rawUrl = $lead->page_url ?: $lead->source;
                                    $originPath = $rawUrl ? (parse_url($rawUrl, PHP_URL_PATH) ?: $rawUrl) : null;
                                    if ($originPath === '/' || empty($originPath)) $originPath = 'Home (/)';
                                    $isNew = in_array(strtolower($lead->status ?? ''), ['new', 'unread']);
                                @endphp
                                <tr>
                                    <td>
                                        <div style="font-weight: 800; color: #0f172a; font-size: 13.5px;">{{ $lead->name ?: 'Inbound Lead' }}</div>
                                        <div style="font-size: 11.5px; color: #64748b; margin-top: 1px;">{{ $lead->company ?: 'Direct Client' }}</div>
                                        @if ($originPath)
                                            <div style="font-size: 10px; color: #2563eb; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; margin-top: 4px; background: #eff6ff; border: 1px solid #dbeafe; padding: 2px 7px; border-radius: 6px;" title="{{ $lead->page_url ?: $lead->source }}">
                                                <span>📍</span>
                                                <span>{{ \Illuminate\Support\Str::limit($originPath, 26) }}</span>
                                            </div>
                                        @endif
                                    </td>
                                    <td>
                                        <div style="color: #0f172a; font-weight: 750; font-size: 12px;">{{ $lead->phone ?: '—' }}</div>
                                        <div style="color: #64748b; font-size: 11px; margin-top: 2px;">{{ $lead->email ?: '—' }}</div>
                                    </td>
                                    <td>
                                        <span style="background: #f1f5f9; color: #334155; font-size: 11px; font-weight: 700; padding: 4px 9px; border-radius: 6px; display: inline-block;">
                                            {{ $serviceName }}
                                        </span>
                                    </td>
                                    <td>
                                        @if ($isNew)
                                            <span class="gif-badge-new">
                                                <span>●</span>
                                                <span>NEW</span>
                                            </span>
                                        @else
                                            <span class="gif-badge-contacted">
                                                {{ $lead->status ?: 'Contacted' }}
                                            </span>
                                        @endif
                                    </td>
                                    <td style="font-size: 11px; color: #64748b; white-space: nowrap;">
                                        <div style="color: #0f172a; font-weight: 750;">{{ $lead->created_at?->diffForHumans() ?? 'Recent' }}</div>
                                        <div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">{{ $lead->created_at?->format('d M, h:i A') ?? '' }}</div>
                                    </td>
                                    <td style="text-align: right; padding-right: 18px; white-space: nowrap;">
                                        <div style="display: inline-flex; align-items: center; gap: 6px;">
                                            @if ($waUrl)
                                                <a href="{{ $waUrl }}" target="_blank" rel="noopener noreferrer" class="gif-btn-wa" title="Open WhatsApp Chat">
                                                    <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                                                    </svg>
                                                    <span>WhatsApp</span>
                                                </a>
                                            @endif
                                            @if ($telUrl)
                                                <a href="{{ $telUrl }}" class="gif-btn-call" title="Call directly">
                                                    <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                                    </svg>
                                                    <span>Call</span>
                                                </a>
                                            @endif
                                            <a href="/admin/leads/{{ $lead->id }}/edit" class="gif-btn-edit" title="View details and update lead status">
                                                <span>View →</span>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>

        <!-- ═══════════════════════════════════════════════════════════════════
             4. ACTIVE AGENCY SERVICES (FRONTEND CATALOG GRID)
        ═══════════════════════════════════════════════════════════════════ -->
        <div class="gif-card">
            <div class="gif-card-header">
                <div>
                    <h2 class="gif-card-title">
                        <span class="gif-title-icon-badge" style="background: #ecfdf5; color: #059669;">
                            <x-filament::icon icon="heroicon-m-squares-2x2" />
                        </span>
                        <span>Active Agency Services (Frontend Catalog)</span>
                    </h2>
                    <p style="font-size: 12px; color: #64748b; margin: 3px 0 0 0;">
                        Live marketing pillars on getintofeed.com/services. Edits made here sync dynamically with frontend.
                    </p>
                </div>
                <a href="/admin/services" class="gif-card-link">Manage All ({{ $counts['services'] }}) →</a>
            </div>

            <div class="gif-services-grid">
                @foreach ($services as $srv)
                    @php
                        $delivs = is_array($srv->deliverables) ? $srv->deliverables : (json_decode($srv->deliverables, true) ?: []);
                    @endphp
                    <a href="/admin/services/{{ $srv->id }}/edit" class="gif-srv-card">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                                <div style="font-weight: 800; font-size: 13.5px; color: #0f172a; line-height: 1.3;">
                                    {{ $srv->name }}
                                </div>
                                <span style="background: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; white-space: nowrap;">
                                    {{ $srv->category ?: 'Marketing' }}
                                </span>
                            </div>
                            <p style="font-size: 11.5px; color: #64748b; margin: 7px 0 0 0; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                {{ $srv->short_description }}
                            </p>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid #f1f5f9; font-size: 11px;">
                            <span style="font-weight: 800; color: #059669;">{{ $srv->pricing_tier ?: '₹10,999*' }}</span>
                            <span style="color: #2563eb; font-weight: 700;">{{ count($delivs) }} Deliverables · Edit →</span>
                        </div>
                    </a>
                @endforeach
            </div>
        </div>

        <!-- ═══════════════════════════════════════════════════════════════════
             5. 4-CARD OPERATIONS & INFRASTRUCTURE ROW (RESPONSIVE)
        ═══════════════════════════════════════════════════════════════════ -->
        <div class="gif-ops-grid">

            <!-- Card 1: Fast Actions Launchpad -->
            <div class="gif-ops-card">
                <div class="gif-card-header">
                    <h2 class="gif-card-title">
                        <span class="gif-title-icon-badge" style="background: #fefce8; color: #ca8a04;">
                            <x-filament::icon icon="heroicon-m-bolt" />
                        </span>
                        <span>Studio Fast Actions</span>
                    </h2>
                </div>

                <div class="gif-action-list">
                    <a href="/admin/case-studies/create" class="gif-action-item">
                        <span>+ Post New Case Study</span>
                        <span class="arr">→</span>
                    </a>
                    <a href="/admin/blog-posts/create" class="gif-action-item">
                        <span>+ Write Feed Notes Article</span>
                        <span class="arr">→</span>
                    </a>
                    <a href="/admin/testimonials/create" class="gif-action-item">
                        <span>+ Add Client Testimonial</span>
                        <span class="arr">→</span>
                    </a>
                    <a href="/admin/team-members/create" class="gif-action-item">
                        <span>+ Add Team Specialist</span>
                        <span class="arr">→</span>
                    </a>
                    <a href="/admin/media" class="gif-action-item">
                        <span>📁 Media Library</span>
                        <span class="arr">→</span>
                    </a>
                </div>
            </div>

            <!-- Card 2: Real-Time Subscribers -->
            <div class="gif-ops-card">
                <div class="gif-card-header">
                    <h2 class="gif-card-title">
                        <span class="gif-title-icon-badge" style="background: #f0fdfa; color: #0d9488;">
                            <x-filament::icon icon="heroicon-m-envelope" />
                        </span>
                        <span>Subscribers ({{ $counts['subscribers'] }})</span>
                    </h2>
                    <a href="/admin/newsletter-subscribers" class="gif-card-link">View All →</a>
                </div>

                @if ($recentSubs->isEmpty())
                    <div style="padding: 24px 16px; text-align: center; color: #64748b; font-size: 12px; margin: auto;">
                        <div style="width: 36px; height: 36px; border-radius: 9px; background: #f0fdfa; color: #0d9488; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 6px;">
                            <x-filament::icon icon="heroicon-o-envelope-open" style="width: 18px; height: 18px;" />
                        </div>
                        <p style="margin: 0; font-weight: 700; color: #1e293b;">No subscribers yet</p>
                        <p style="margin: 3px 0 0 0; font-size: 11px;">Blog & footer newsletter submissions appear here.</p>
                    </div>
                @else
                    <div style="padding: 12px 16px; display: flex; flex-direction: column; gap: 8px;">
                        @foreach ($recentSubs as $sub)
                            @php
                                $subRaw = $sub->page_url ?: $sub->source;
                                $subPath = $subRaw ? (parse_url($subRaw, PHP_URL_PATH) ?: $subRaw) : null;
                                if ($subPath === '/' || empty($subPath)) $subPath = 'Home (/)';
                            @endphp
                            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 7px; border-bottom: 1px solid #f1f5f9; font-size: 11.5px;">
                                <div>
                                    <div style="font-weight: 750; color: #0f172a;">{{ $sub->email }}</div>
                                    <div style="font-size: 10px; color: #0d9488; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; margin-top: 2px;">
                                        <span>📍</span>
                                        <span title="{{ $sub->page_url ?: $sub->source }}">{{ \Illuminate\Support\Str::limit($subPath, 20) }}</span>
                                    </div>
                                </div>
                                <div style="text-align: right; font-size: 10px; color: #64748b; white-space: nowrap;">
                                    {{ $sub->subscribed_at?->diffForHumans() ?? 'Recent' }}
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>

            <!-- Card 3: Agency Infrastructure & Health -->
            <div class="gif-ops-card">
                <div class="gif-card-header">
                    <h2 class="gif-card-title">
                        <span class="gif-title-icon-badge" style="background: #ecfdf5; color: #059669;">
                            <x-filament::icon icon="heroicon-m-shield-check" />
                        </span>
                        <span>System Health</span>
                    </h2>
                </div>

                <div class="gif-infra-list">
                    <div class="gif-infra-row">
                        <span>Database Engine</span>
                        <span class="gif-infra-pill" style="{{ $health['db_connected'] ? 'background:#ecfdf5;color:#059669;border-color:#a7f3d0;' : 'background:#fef2f2;color:#dc2626;border-color:#fecaca;' }}">
                            ● {{ $health['db_driver'] }} ({{ $health['db_latency_ms'] }}ms)
                        </span>
                    </div>
                    <div class="gif-infra-row">
                        <span>CRM Outbound Sync</span>
                        <span class="gif-infra-pill" style="{{ $counts['crm_failed'] > 0 ? 'background:#fef2f2;color:#dc2626;border-color:#fecaca;' : 'background:#ecfdf5;color:#059669;border-color:#a7f3d0;' }}">
                            ● {{ $counts['crm_failed'] > 0 ? "{$counts['crm_failed']} Failed" : "{$counts['crm_synced']} Synced" }}
                        </span>
                    </div>
                    <div class="gif-infra-row">
                        <span>Queue Depth</span>
                        <span class="gif-infra-pill">● {{ $health['queue_depth'] }} Queued</span>
                    </div>
                    <div class="gif-infra-row">
                        <span>Failed Jobs</span>
                        <span class="gif-infra-pill" style="{{ $health['failed_jobs'] > 0 ? 'background:#fef2f2;color:#dc2626;border-color:#fecaca;' : '' }}">
                            ● {{ $health['failed_jobs'] }} Failed
                        </span>
                    </div>
                    <div class="gif-infra-row">
                        <span>Last System Backup</span>
                        <span class="gif-infra-pill">● {{ $health['last_backup'] }}</span>
                    </div>
                </div>
            </div>

            <!-- Card 4: Studio Coordinates -->
            <div class="gif-ops-card">
                <div class="gif-card-header">
                    <h2 class="gif-card-title">
                        <span class="gif-title-icon-badge" style="background: #eff6ff; color: #2563eb;">
                            <x-filament::icon icon="heroicon-m-globe-alt" />
                        </span>
                        <span>Agency Coordinates</span>
                    </h2>
                    <a href="/admin/system-health" class="gif-card-link">View Status →</a>
                </div>

                <div style="padding: 14px 16px; font-size: 11.5px; color: #475569; display: flex; flex-direction: column; gap: 7px;">
                    <div>
                        <span style="font-weight: 700; color: #0f172a;">Official Phone:</span>
                        <a href="tel:+918810356950" style="color: #2563eb; font-weight: 600; text-decoration: none; margin-left: 4px;">+91 8810356950</a>
                    </div>
                    <div>
                        <span style="font-weight: 700; color: #0f172a;">WhatsApp:</span>
                        <a href="https://wa.me/918810356950" target="_blank" style="color: #059669; font-weight: 600; text-decoration: none; margin-left: 4px;">+91 8810356950</a>
                    </div>
                    <div>
                        <span style="font-weight: 700; color: #0f172a;">Inquiries Email:</span>
                        <a href="mailto:hello@getintofeed.com" style="color: #2563eb; font-weight: 600; text-decoration: none; margin-left: 4px;">hello@getintofeed.com</a>
                    </div>
                    <div>
                        <span style="font-weight: 700; color: #0f172a;">Headquarters:</span>
                        <span style="color: #64748b; margin-left: 4px;">New Delhi, Delhi NCR</span>
                    </div>
                </div>
            </div>

        </div>

    </div>
</x-filament-widgets::widget>
