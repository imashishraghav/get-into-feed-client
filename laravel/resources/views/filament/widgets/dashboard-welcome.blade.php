<x-filament-widgets::widget>
    @php
        $counts = $this->getCounts();
        $recentLeads = $this->getRecentLeads();
        $health = $this->getSystemHealth();

        $metrics = [
            [
                'title' => 'Form Enquiries',
                'value' => number_format($counts['leads']),
                'subtext' => ($counts['crm_failed'] > 0 ? "{$counts['crm_failed']} failed CRM sync" : ($counts['new_leads'] > 0 ? "{$counts['new_leads']} unreviewed" : 'All synced to CRM')),
                'badge' => ($counts['crm_failed'] > 0 ? 'SYNC ERR' : ($counts['new_leads'] > 0 ? "● {$counts['new_leads']} NEW" : 'ALL CLEAR')),
                'status' => (($counts['crm_failed'] > 0 || $counts['new_leads'] > 0) ? 'warning' : 'success'),
                'url' => '/admin/leads',
                'icon' => 'heroicon-o-inbox-arrow-down',
            ],
            [
                'title' => 'Services Catalog',
                'value' => number_format($counts['services']),
                'subtext' => 'Live growth pillars & SEO routes',
                'badge' => 'CATALOG',
                'status' => 'neutral',
                'url' => '/admin/services',
                'icon' => 'heroicon-o-sparkles',
            ],
            [
                'title' => 'Case Studies & Proof',
                'value' => number_format($counts['case_studies']),
                'subtext' => ($counts['testimonials'] > 0 ? "{$counts['testimonials']} Reviews ({$counts['testimonials_avg']} ★)" : '0 Published reviews'),
                'badge' => 'PORTFOLIO',
                'status' => 'neutral',
                'url' => '/admin/case-studies',
                'icon' => 'heroicon-o-presentation-chart-line',
            ],
            [
                'title' => 'Feed Notes Blog',
                'value' => number_format($counts['blog_posts']),
                'subtext' => number_format($counts['subscribers']) . ' Newsletter audience',
                'badge' => 'SEO LIVE',
                'status' => 'neutral',
                'url' => '/admin/blog-posts',
                'icon' => 'heroicon-o-document-text',
            ],
        ];
    @endphp

    <style>
        .gif-saas-root {
            --saas-bg-card: #ffffff;
            --saas-border: #e2e8f0;
            --saas-text-title: #09090b;
            --saas-text-body: #334155;
            --saas-text-muted: #64748b;
            --saas-bg-subtle: #f8fafc;
            --saas-primary: #2563eb;
            --saas-primary-hover: #1d4ed8;
            --saas-radius: 14px;
            --saas-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
            font-family: inherit;
            color: var(--saas-text-body);
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
        }

        .dark .gif-saas-root {
            --saas-bg-card: #121215;
            --saas-border: #27272a;
            --saas-text-title: #f4f4f5;
            --saas-text-body: #d4d4d8;
            --saas-text-muted: #a1a1aa;
            --saas-bg-subtle: #18181b;
            --saas-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        }

        /* ── EXECUTIVE BANNER ── */
        .gif-saas-header {
            background: var(--saas-bg-card);
            border: 1px solid var(--saas-border);
            border-radius: var(--saas-radius);
            padding: 24px 28px;
            box-shadow: var(--saas-shadow);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            flex-wrap: wrap;
        }

        .gif-saas-header-left {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .gif-saas-kicker {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--saas-text-muted);
        }

        .gif-saas-dot {
            width: 7px;
            height: 7px;
            border-radius: 9999px;
            background: #10b981;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .gif-saas-title {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: var(--saas-text-title);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .gif-saas-sub {
            font-size: 13px;
            color: var(--saas-text-muted);
            margin: 0;
        }

        .gif-saas-header-right {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }

        .gif-saas-telemetry-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: var(--saas-bg-subtle);
            border: 1px solid var(--saas-border);
            border-radius: 8px;
            font-size: 11.5px;
            font-weight: 600;
            color: var(--saas-text-body);
        }

        .gif-saas-btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 14px;
            background: #09090b;
            color: #ffffff !important;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            text-decoration: none !important;
            transition: all 0.15s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .dark .gif-saas-btn-primary {
            background: #ffffff;
            color: #09090b !important;
        }

        .gif-saas-btn-primary:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        /* ── METRIC CARDS ── */
        .gif-saas-grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
        }

        @media (max-width: 1024px) {
            .gif-saas-grid-4 {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 640px) {
            .gif-saas-grid-4 {
                grid-template-columns: 1fr;
            }
        }

        .gif-saas-card {
            background: var(--saas-bg-card);
            border: 1px solid var(--saas-border);
            border-radius: var(--saas-radius);
            padding: 20px;
            box-shadow: var(--saas-shadow);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 16px;
            text-decoration: none !important;
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .gif-saas-card:hover {
            border-color: #cbd5e1;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.06);
        }

        .dark .gif-saas-card:hover {
            border-color: #3f3f46;
            box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.4);
        }

        .gif-saas-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .gif-saas-card-icon {
            width: 36px;
            height: 36px;
            border-radius: 9px;
            background: var(--saas-bg-subtle);
            border: 1px solid var(--saas-border);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--saas-primary);
        }

        .gif-saas-badge {
            font-size: 10px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 6px;
            letter-spacing: 0.04em;
        }

        .gif-saas-badge-success {
            background: #ecfdf5;
            color: #059669;
            border: 1px solid #a7f3d0;
        }

        .dark .gif-saas-badge-success {
            background: rgba(5, 150, 105, 0.15);
            color: #34d399;
            border-color: rgba(5, 150, 105, 0.3);
        }

        .gif-saas-badge-warning {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }

        .dark .gif-saas-badge-warning {
            background: rgba(220, 38, 38, 0.15);
            color: #f87171;
            border-color: rgba(220, 38, 38, 0.3);
        }

        .gif-saas-badge-neutral {
            background: var(--saas-bg-subtle);
            color: var(--saas-text-muted);
            border: 1px solid var(--saas-border);
        }

        .gif-saas-metric-val {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.03em;
            color: var(--saas-text-title);
            line-height: 1.1;
        }

        .gif-saas-metric-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--saas-text-title);
            margin-top: 4px;
        }

        .gif-saas-metric-sub {
            font-size: 11.5px;
            color: var(--saas-text-muted);
            margin-top: 2px;
        }

        /* ── TWO-COLUMN SECTION ── */
        .gif-saas-main-layout {
            display: grid;
            grid-template-columns: minmax(0, 1.8fr) minmax(0, 1.2fr);
            gap: 20px;
        }

        @media (max-width: 1080px) {
            .gif-saas-main-layout {
                grid-template-columns: 1fr;
            }
        }

        .gif-saas-panel {
            background: var(--saas-bg-card);
            border: 1px solid var(--saas-border);
            border-radius: var(--saas-radius);
            box-shadow: var(--saas-shadow);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .gif-saas-panel-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--saas-border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .gif-saas-panel-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--saas-text-title);
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .gif-saas-link-subtle {
            font-size: 12px;
            font-weight: 600;
            color: var(--saas-primary);
            text-decoration: none !important;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .gif-saas-link-subtle:hover {
            color: var(--saas-primary-hover);
            text-decoration: underline !important;
        }

        /* Empty State */
        .gif-saas-empty {
            padding: 48px 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .gif-saas-empty-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: var(--saas-bg-subtle);
            border: 1px solid var(--saas-border);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--saas-text-muted);
            margin-bottom: 4px;
        }

        .gif-saas-empty-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--saas-text-title);
            margin: 0;
        }

        .gif-saas-empty-text {
            font-size: 12.5px;
            color: var(--saas-text-muted);
            max-width: 340px;
            margin: 0;
            line-height: 1.5;
        }

        /* Lead List Table */
        .gif-saas-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
        }

        .gif-saas-table th {
            text-align: left;
            padding: 10px 16px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--saas-text-muted);
            background: var(--saas-bg-subtle);
            border-bottom: 1px solid var(--saas-border);
        }

        .gif-saas-table td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--saas-border);
            color: var(--saas-text-body);
            vertical-align: middle;
        }

        .gif-saas-table tr:last-child td {
            border-bottom: none;
        }

        .gif-saas-table tr:hover td {
            background: var(--saas-bg-subtle);
        }

        /* Diagnostic Telemetry Rows */
        .gif-saas-diag-list {
            display: flex;
            flex-direction: column;
        }

        .gif-saas-diag-item {
            padding: 12px 20px;
            border-bottom: 1px solid var(--saas-border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12.5px;
        }

        .gif-saas-diag-item:last-child {
            border-bottom: none;
        }

        .gif-saas-diag-label {
            color: var(--saas-text-muted);
            font-weight: 500;
        }

        .gif-saas-diag-val {
            font-weight: 600;
            color: var(--saas-text-title);
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        /* ── STUDIO CONTENT BANNER ── */
        .gif-saas-content-trio {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }

        @media (max-width: 768px) {
            .gif-saas-content-trio {
                grid-template-columns: 1fr;
            }
        }

        .gif-saas-trio-card {
            background: var(--saas-bg-card);
            border: 1px solid var(--saas-border);
            border-radius: var(--saas-radius);
            padding: 18px 20px;
            box-shadow: var(--saas-shadow);
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-decoration: none !important;
            transition: all 0.15s ease;
        }

        .gif-saas-trio-card:hover {
            border-color: #cbd5e1;
            transform: translateY(-1px);
        }

        .dark .gif-saas-trio-card:hover {
            border-color: #3f3f46;
        }
    </style>

    <div class="gif-saas-root">

        <!-- 1. EXECUTIVE COMMAND HEADER -->
        <div class="gif-saas-header">
            <div class="gif-saas-header-left">
                <div class="gif-saas-kicker">
                    <span class="gif-saas-dot"></span>
                    <span>GetIntoFeed</span>
                    <span>·</span>
                    <span>{{ now('Asia/Kolkata')->format('l, d F Y') }}</span>
                </div>
                <h1 class="gif-saas-title">
                    {{ $this->getGreeting() }}, {{ $this->getUserName() }} 👋
                </h1>
                <p class="gif-saas-sub">
                    Direct website management command center for marketing services, blog SEO, and inbound inquiries.
                </p>
            </div>

            <div class="gif-saas-header-right">
                <div class="gif-saas-telemetry-pill">
                    <span class="gif-saas-dot" style="background: {{ $health['db_connected'] ? '#10b981' : '#ef4444' }};"></span>
                    <span>DB: {{ $health['db_driver'] }} ({{ $health['db_latency_ms'] }}ms)</span>
                </div>

                <div class="gif-saas-telemetry-pill">
                    <span class="gif-saas-dot"></span>
                    <span>CRM Forwarding: Active</span>
                </div>

                <a href="https://getintofeed.com" target="_blank" rel="noopener noreferrer" class="gif-saas-btn-primary">
                    <span>Live Website</span>
                    <x-filament::icon icon="heroicon-m-arrow-top-right-on-square" style="width: 14px; height: 14px;" />
                </a>
            </div>
        </div>

        <!-- 2. FOUR CORE METRIC CARDS -->
        <div class="gif-saas-grid-4">
            @foreach ($metrics as $metric)
                <a href="{{ $metric['url'] }}" class="gif-saas-card">
                    <div class="gif-saas-card-top">
                        <div class="gif-saas-card-icon">
                            <x-filament::icon icon="{{ $metric['icon'] }}" style="width: 18px; height: 18px;" />
                        </div>
                        <span class="gif-saas-badge gif-saas-badge-{{ $metric['status'] }}">
                            {{ $metric['badge'] }}
                        </span>
                    </div>

                    <div>
                        <div class="gif-saas-metric-val">{{ $metric['value'] }}</div>
                        <div class="gif-saas-metric-label">{{ $metric['title'] }}</div>
                        <div class="gif-saas-metric-sub">{{ $metric['subtext'] }}</div>
                    </div>
                </a>
            @endforeach
        </div>

        <!-- 3. MAIN SECTION: INBOUND ENQUIRIES + DIAGNOSTIC TELEMETRY -->
        <div class="gif-saas-main-layout">
            <!-- Left: Recent Form Enquiries Table -->
            <div class="gif-saas-panel">
                <div class="gif-saas-panel-header">
                    <div>
                        <h2 class="gif-saas-panel-title">
                            <x-filament::icon icon="heroicon-o-inbox" style="width: 16px; height: 16px; color: var(--saas-primary);" />
                            <span>Inbound Form Enquiries</span>
                        </h2>
                    </div>

                    <div style="display: flex; align-items: center; gap: 10px;">
                        <a href="/admin/leads/export-csv" class="gif-saas-link-subtle" style="color: var(--saas-text-muted);">
                            <x-filament::icon icon="heroicon-o-arrow-down-tray" style="width: 13px; height: 13px;" />
                            <span>Export</span>
                        </a>
                        <a href="/admin/leads" class="gif-saas-link-subtle">
                            <span>Open Inbox →</span>
                        </a>
                    </div>
                </div>

                @if ($recentLeads->count() > 0)
                    <table class="gif-saas-table">
                        <thead>
                            <tr>
                                <th>Received</th>
                                <th>Contact</th>
                                <th>Service</th>
                                <th>CRM Sync</th>
                                <th style="text-align: right;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($recentLeads as $lead)
                                <tr>
                                    <td>
                                        <div style="font-weight: 600; color: var(--saas-text-title);">{{ $lead->created_at?->diffForHumans() }}</div>
                                        <div style="font-size: 11px; color: var(--saas-text-muted);">{{ $lead->created_at?->format('d M, h:i A') }}</div>
                                    </td>
                                    <td>
                                        <div style="font-weight: 700; color: var(--saas-text-title);">{{ $lead->name }}</div>
                                        <div style="font-size: 11px; color: var(--saas-text-muted);">{{ $lead->phone ?: $lead->email }}</div>
                                    </td>
                                    <td>
                                        <span style="font-weight: 600; font-size: 11.5px; padding: 2px 7px; background: var(--saas-bg-subtle); border: 1px solid var(--saas-border); border-radius: 6px;">
                                            {{ $lead->interested_service ?: 'General Growth' }}
                                        </span>
                                    </td>
                                    <td>
                                        @if ($lead->crm_sync_status === 'synced')
                                            <span class="gif-saas-badge gif-saas-badge-success">● SYNCED</span>
                                        @elseif ($lead->crm_sync_status === 'failed')
                                            <span class="gif-saas-badge gif-saas-badge-warning">● FAILED</span>
                                        @else
                                            <span class="gif-saas-badge gif-saas-badge-neutral">● PENDING</span>
                                        @endif
                                    </td>
                                    <td style="text-align: right;">
                                        <a href="/admin/leads/{{ $lead->id }}/edit" class="gif-saas-link-subtle">
                                            <span>Details</span>
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @else
                    <div class="gif-saas-empty">
                        <div class="gif-saas-empty-icon">
                            <x-filament::icon icon="heroicon-o-inbox" style="width: 22px; height: 22px;" />
                        </div>
                        <h3 class="gif-saas-empty-title">No Pending Inquiries</h3>
                        <p class="gif-saas-empty-text">
                            New client inquiries from getintofeed.com contact forms and audits will appear here in real time and automatically forward to CRM.
                        </p>
                        <a href="/admin/leads" class="gif-saas-btn-primary" style="margin-top: 6px; font-size: 11.5px; padding: 6px 12px;">
                            <span>View All Enquiries</span>
                        </a>
                    </div>
                @endif
            </div>

            <!-- Right: Diagnostic Telemetry -->
            <div class="gif-saas-panel">
                <div class="gif-saas-panel-header">
                    <h2 class="gif-saas-panel-title">
                        <x-filament::icon icon="heroicon-o-cpu-chip" style="width: 16px; height: 16px; color: var(--saas-primary);" />
                        <span>System Diagnostics</span>
                    </h2>

                    <a href="/admin/system-health" class="gif-saas-link-subtle">
                        <span>Full Audit →</span>
                    </a>
                </div>

                <div class="gif-saas-diag-list">
                    <div class="gif-saas-diag-item">
                        <span class="gif-saas-diag-label">Database Engine</span>
                        <span class="gif-saas-diag-val">
                            <span class="gif-saas-dot" style="background: {{ $health['db_connected'] ? '#10b981' : '#ef4444' }};"></span>
                            <span>{{ $health['db_driver'] }} ({{ $health['db_latency_ms'] }}ms)</span>
                        </span>
                    </div>

                    <div class="gif-saas-diag-item">
                        <span class="gif-saas-diag-label">Outbound CRM Sync</span>
                        <span class="gif-saas-diag-val">
                            @if ($counts['crm_failed'] > 0)
                                <span class="gif-saas-badge gif-saas-badge-warning">{{ $counts['crm_failed'] }} Failed</span>
                            @else
                                <span class="gif-saas-badge gif-saas-badge-success">● {{ $counts['crm_synced'] }} Synced</span>
                            @endif
                        </span>
                    </div>

                    <div class="gif-saas-diag-item">
                        <span class="gif-saas-diag-label">Queue Depth</span>
                        <span class="gif-saas-diag-val">{{ $health['queue_depth'] }} Queued</span>
                    </div>

                    <div class="gif-saas-diag-item">
                        <span class="gif-saas-diag-label">Failed Jobs</span>
                        <span class="gif-saas-diag-val" style="{{ $health['failed_jobs'] > 0 ? 'color: #dc2626;' : '' }}">
                            {{ $health['failed_jobs'] }} Failed
                        </span>
                    </div>

                    <div class="gif-saas-diag-item">
                        <span class="gif-saas-diag-label">Last Backup</span>
                        <span class="gif-saas-diag-val">{{ $health['last_backup'] }}</span>
                    </div>

                    <div class="gif-saas-diag-item">
                        <span class="gif-saas-diag-label">Diagnostic Timestamp</span>
                        <span class="gif-saas-diag-val" style="font-size: 11.5px; color: var(--saas-text-muted);">
                            {{ $health['checked_at'] }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 4. CONTENT STUDIO FAST NAVIGATION -->
        <div class="gif-saas-content-trio">
            <a href="/admin/services" class="gif-saas-trio-card">
                <div>
                    <div style="font-size: 13px; font-weight: 700; color: var(--saas-text-title);">Services Catalog</div>
                    <div style="font-size: 11.5px; color: var(--saas-text-muted); margin-top: 2px;">{{ $counts['services'] }} Live growth pillars</div>
                </div>
                <x-filament::icon icon="heroicon-m-arrow-right" style="width: 14px; height: 14px; color: var(--saas-primary);" />
            </a>

            <a href="/admin/blog-posts" class="gif-saas-trio-card">
                <div>
                    <div style="font-size: 13px; font-weight: 700; color: var(--saas-text-title);">Feed Notes Blog</div>
                    <div style="font-size: 11.5px; color: var(--saas-text-muted); margin-top: 2px;">{{ $counts['blog_posts'] }} Published SEO articles</div>
                </div>
                <x-filament::icon icon="heroicon-m-arrow-right" style="width: 14px; height: 14px; color: var(--saas-primary);" />
            </a>

            <a href="/admin/case-studies" class="gif-saas-trio-card">
                <div>
                    <div style="font-size: 13px; font-weight: 700; color: var(--saas-text-title);">Case Studies & Proof</div>
                    <div style="font-size: 11.5px; color: var(--saas-text-muted); margin-top: 2px;">{{ $counts['case_studies'] }} Projects & ROI proof</div>
                </div>
                <x-filament::icon icon="heroicon-m-arrow-right" style="width: 14px; height: 14px; color: var(--saas-primary);" />
            </a>
        </div>

    </div>
</x-filament-widgets::widget>
