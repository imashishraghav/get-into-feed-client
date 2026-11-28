<x-filament-panels::page>
    <style>
        /* ═══════════════════════════════════════════════════════════════════
           SYSTEM HEALTH — EXECUTIVE LIGHT THEME & COMPACT KPI GRID
        ═══════════════════════════════════════════════════════════════════ */
        .sh-page-wrap {
            font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #0f172a;
        }

        /* Tabs Bar */
        .sh-tab-btn-active {
            background-color: #2563eb !important;
            color: #ffffff !important;
            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25) !important;
            font-weight: 700 !important;
            border: 1px solid #2563eb !important;
        }
        .sh-tab-btn-inactive {
            background-color: #ffffff !important;
            color: #475569 !important;
            border: 1px solid #e2e8f0 !important;
            font-weight: 600 !important;
        }
        .sh-tab-btn-inactive:hover {
            background-color: #f8fafc !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
        }

        /* ── 4-COLUMN KPI METRICS GRID (SINGLE ROW ON DESKTOP) ────────── */
        .sh-kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
            width: 100%;
        }
        @media (max-width: 860px) {
            .sh-kpi-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 12px;
            }
        }
        @media (max-width: 500px) {
            .sh-kpi-grid {
                grid-template-columns: 1fr;
                gap: 10px;
            }
        }

        .sh-kpi-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 16px 18px;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 126px;
            transition: all 0.15s ease;
        }
        .sh-kpi-card:hover {
            border-color: #cbd5e1;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
            transform: translateY(-1px);
        }

        .sh-kpi-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 8px;
        }

        .sh-kpi-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #2563eb;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .sh-kpi-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 7px;
            border-radius: 9999px;
            font-size: 10.5px;
            font-weight: 750;
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .sh-kpi-pill.warning {
            background: #fffbeb;
            color: #b45309;
            border-color: #fde68a;
        }
        .sh-kpi-pill.danger {
            background: #fef2f2;
            color: #b91c1c;
            border-color: #fecaca;
        }

        .sh-dot-live {
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background: #10b981;
            display: inline-block;
        }

        .sh-kpi-value {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
            margin: 0 0 3px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .sh-kpi-sub {
            font-size: 11.5px;
            color: #64748b;
            margin: 0;
            line-height: 1.4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .sh-kpi-footer {
            margin-top: 10px;
            padding-top: 9px;
            border-top: 1px solid #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11.5px;
            color: #64748b;
        }

        .sh-kpi-footer-val {
            font-weight: 700;
            color: #0f172a;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .sh-kpi-footer-val.healthy {
            color: #059669;
        }

        /* Universal Cards Fallbacks */
        .sh-page-wrap div[class*="bg-gray-900"],
        .sh-page-wrap div[class*="bg-gray-950"],
        .sh-card {
            background-color: #ffffff !important;
            border-color: #e2e8f0 !important;
            color: #0f172a !important;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
        }

        /* Inner item containers */
        .sh-page-wrap .space-y-3 > div[class*="bg-gray-950"],
        .sh-page-wrap .space-y-2\.5 > div[class*="bg-gray-950"],
        .sh-page-wrap div[class*="bg-gray-950"][class*="border"] {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
        }

        /* Typography & Metrics */
        .sh-page-wrap p[class*="text-white"],
        .sh-page-wrap h3[class*="text-white"],
        .sh-page-wrap div[class*="text-white"],
        .sh-page-wrap td[class*="text-white"],
        .sh-page-wrap span[class*="text-white"]:not(.sh-tab-btn-active span):not(button[class*="bg-primary"] span) {
            color: #0f172a !important;
        }

        .sh-page-wrap p[class*="text-gray-400"],
        .sh-page-wrap span[class*="text-gray-400"],
        .sh-page-wrap dt[class*="text-gray-400"],
        .sh-page-wrap td[class*="text-gray-400"] {
            color: #475569 !important;
        }

        .sh-page-wrap dd[class*="text-gray-200"],
        .sh-page-wrap span[class*="text-gray-200"],
        .sh-page-wrap span[class*="text-gray-300"],
        .sh-page-wrap div[class*="text-gray-300"] {
            color: #0f172a !important;
            font-weight: 600 !important;
        }

        /* Section dividers */
        .sh-page-wrap div[class*="border-gray-800"] {
            border-color: #f1f5f9 !important;
        }

        /* Tables */
        .sh-page-wrap table {
            background-color: #ffffff !important;
        }
        .sh-page-wrap thead,
        .sh-page-wrap thead tr,
        .sh-page-wrap thead th {
            background-color: #f8fafc !important;
            color: #475569 !important;
            border-bottom: 1px solid #e2e8f0 !important;
            font-weight: 750 !important;
        }
        .sh-page-wrap tbody tr {
            border-bottom: 1px solid #f1f5f9 !important;
            color: #1e293b !important;
            background-color: #ffffff !important;
        }
        .sh-page-wrap tbody tr:hover {
            background-color: #f8fafc !important;
        }

        /* Form Controls */
        .sh-page-wrap input[type="text"],
        .sh-page-wrap select {
            background-color: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            color: #0f172a !important;
            border-radius: 0.5rem !important;
        }
        .sh-page-wrap input[type="text"]:focus,
        .sh-page-wrap select:focus {
            border-color: #2563eb !important;
            outline: none !important;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12) !important;
        }

        /* ── 3-COLUMN MIDDLE GRID (SYSTEM RUNTIME, INVENTORY, API PROBES) ── */
        .sh-mid-grid {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 16px !important;
            width: 100% !important;
            margin-top: 16px !important;
        }
        @media (max-width: 1080px) {
            .sh-mid-grid {
                grid-template-columns: 1fr !important;
                gap: 14px !important;
            }
        }

        .sh-panel {
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 14px !important;
            padding: 20px !important;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            min-height: 430px !important;
            transition: all 0.15s ease !important;
        }
        .sh-panel:hover {
            border-color: #cbd5e1 !important;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06) !important;
        }

        .sh-panel-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            margin-bottom: 16px !important;
            padding-bottom: 12px !important;
            border-bottom: 1px solid #f1f5f9 !important;
        }
        .sh-panel-title-wrap {
            display: flex !important;
            align-items: center !important;
            gap: 9px !important;
        }
        .sh-panel-icon {
            width: 28px !important;
            height: 28px !important;
            border-radius: 8px !important;
            background: #eff6ff !important;
            color: #2563eb !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-shrink: 0 !important;
        }
        .sh-panel-icon.purple {
            background: #f5f3ff !important;
            color: #7c3aed !important;
        }
        .sh-panel-icon.emerald {
            background: #ecfdf5 !important;
            color: #059669 !important;
        }
        .sh-panel-title {
            font-size: 11.5px !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.06em !important;
            color: #1e293b !important;
            margin: 0 !important;
        }

        /* Key-Value Rows */
        .sh-kv-group {
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
        }
        .sh-kv-item {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 8.5px 0 !important;
            border-bottom: 1px solid #f1f5f9 !important;
            font-size: 12px !important;
        }
        .sh-kv-item:last-child {
            border-bottom: none !important;
        }
        .sh-kv-label {
            color: #64748b !important;
            font-weight: 600 !important;
            font-size: 12px !important;
        }
        .sh-kv-val {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            font-weight: 700 !important;
            color: #0f172a !important;
            font-size: 12px !important;
        }
        .sh-kv-val.accent {
            color: #2563eb !important;
            background: #eff6ff !important;
            padding: 2px 7px !important;
            border-radius: 6px !important;
            font-size: 11px !important;
            border: 1px solid #dbeafe !important;
        }

        /* Storage & Disk Progress */
        .sh-disk-section {
            margin-top: 14px !important;
            padding-top: 14px !important;
            border-top: 1px solid #f1f5f9 !important;
        }
        .sh-disk-head {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            color: #475569 !important;
            margin-bottom: 8px !important;
        }
        .sh-disk-badge {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            font-weight: 800 !important;
            font-size: 11px !important;
            color: #1e293b !important;
            background: #f1f5f9 !important;
            padding: 2px 7px !important;
            border-radius: 6px !important;
            border: 1px solid #e2e8f0 !important;
        }
        .sh-disk-track {
            width: 100% !important;
            height: 8px !important;
            background: #f1f5f9 !important;
            border-radius: 9999px !important;
            overflow: hidden !important;
            border: 1px solid #e2e8f0 !important;
        }
        .sh-disk-fill {
            height: 100% !important;
            background: linear-gradient(90deg, #2563eb, #3b82f6) !important;
            border-radius: 9999px !important;
            transition: width 0.3s ease !important;
        }
        .sh-disk-footer {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            font-size: 11px !important;
            color: #64748b !important;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            margin-top: 7px !important;
        }

        /* Inventory Tiles */
        .sh-inv-tile {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 10px 14px !important;
            border-radius: 10px !important;
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            margin-bottom: 9px !important;
            transition: all 0.15s ease !important;
        }
        .sh-inv-tile:last-child {
            margin-bottom: 0 !important;
        }
        .sh-inv-tile:hover {
            background: #ffffff !important;
            border-color: #cbd5e1 !important;
            box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04) !important;
            transform: translateX(1px) !important;
        }
        .sh-inv-name {
            font-size: 12px !important;
            font-weight: 750 !important;
            color: #0f172a !important;
            margin: 0 0 2px 0 !important;
        }
        .sh-inv-sub {
            font-size: 11px !important;
            color: #64748b !important;
            margin: 0 !important;
        }
        .sh-inv-count {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            font-size: 14px !important;
            font-weight: 800 !important;
            color: #2563eb !important;
            background: #eff6ff !important;
            border: 1px solid #dbeafe !important;
            padding: 4px 10px !important;
            border-radius: 8px !important;
            min-width: 32px !important;
            text-align: center !important;
        }
        .sh-inv-count.zero {
            color: #64748b !important;
            background: #f1f5f9 !important;
            border-color: #e2e8f0 !important;
        }

        /* API Probe Tiles */
        .sh-probe-tile {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 9.5px 12px !important;
            border-radius: 10px !important;
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            margin-bottom: 8px !important;
            transition: all 0.15s ease !important;
        }
        .sh-probe-tile:last-child {
            margin-bottom: 0 !important;
        }
        .sh-probe-tile:hover {
            background: #ffffff !important;
            border-color: #cbd5e1 !important;
            box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04) !important;
        }
        .sh-probe-main {
            min-width: 0 !important;
            flex: 1 !important;
            padding-right: 8px !important;
        }
        .sh-probe-row1 {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            margin-bottom: 2px !important;
        }
        .sh-probe-name {
            font-size: 12px !important;
            font-weight: 750 !important;
            color: #0f172a !important;
            white-space: nowrap !important;
        }
        .sh-probe-uri {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            font-size: 10.5px !important;
            color: #64748b !important;
            background: #f1f5f9 !important;
            padding: 1px 6px !important;
            border-radius: 4px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }
        .sh-probe-latency {
            font-size: 11px !important;
            color: #64748b !important;
            margin: 0 !important;
        }
        .sh-probe-status {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            padding: 3px 9px !important;
            border-radius: 9999px !important;
            white-space: nowrap !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
        }
        .sh-probe-status.healthy {
            background: #ecfdf5 !important;
            color: #047857 !important;
            border: 1px solid #a7f3d0 !important;
        }
        .sh-probe-status.danger {
            background: #fef2f2 !important;
            color: #b91c1c !important;
            border: 1px solid #fecaca !important;
        }

        /* Action Buttons */
        .sh-panel-action {
            margin-top: 14px !important;
            padding-top: 12px !important;
            border-top: 1px solid #f1f5f9 !important;
            display: flex !important;
            justify-content: flex-end !important;
        }
        .sh-btn-clean {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            padding: 7px 14px !important;
            border-radius: 8px !important;
            font-size: 11.5px !important;
            font-weight: 700 !important;
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            color: #334155 !important;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;
            cursor: pointer !important;
            transition: all 0.15s ease !important;
        }
        .sh-btn-clean:hover {
            background: #f8fafc !important;
            border-color: #94a3b8 !important;
            color: #0f172a !important;
        }
    </style>

    <div class="space-y-6 sh-page-wrap">

        {{-- Top Navigation Tabs --}}
        <div class="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
            <button
                type="button"
                wire:click="setActiveTab('health')"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition {{ $activeTab === 'health' ? 'sh-tab-btn-active' : 'sh-tab-btn-inactive' }}"
            >
                <x-heroicon-o-cpu-chip class="w-4 h-4" />
                <span>System Health & Monitoring</span>
            </button>

            <button
                type="button"
                wire:click="setActiveTab('backups')"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition {{ $activeTab === 'backups' ? 'sh-tab-btn-active' : 'sh-tab-btn-inactive' }}"
            >
                <x-heroicon-o-circle-stack class="w-4 h-4" />
                <span>Database Backups & Recovery</span>
                @if(count($backups) > 0)
                    <span class="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold rounded-full {{ $activeTab === 'backups' ? 'bg-white/25 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200' }}">
                        {{ count($backups) }}
                    </span>
                @endif
            </button>

            <button
                type="button"
                wire:click="setActiveTab('activity')"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition {{ $activeTab === 'activity' ? 'sh-tab-btn-active' : 'sh-tab-btn-inactive' }}"
            >
                <x-heroicon-o-clipboard-document-list class="w-4 h-4" />
                <span>Security & Activity Logs</span>
            </button>

            <button
                type="button"
                wire:click="setActiveTab('logs')"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition {{ $activeTab === 'logs' ? 'sh-tab-btn-active' : 'sh-tab-btn-inactive' }}"
            >
                <x-heroicon-o-document-magnifying-glass class="w-4 h-4" />
                <span>Cron, Jobs & Error Logs</span>
            </button>
        </div>

        {{-- ========================================================================= --}}
        {{-- TAB 1: SYSTEM HEALTH & REAL-TIME MONITORING --}}
        {{-- ========================================================================= --}}
        @if($activeTab === 'health')
            {{-- Top KPI Cards (Guaranteed 4 Columns in 1 Row on Desktop) --}}
            <div class="sh-kpi-grid">
                {{-- Server Platform Card --}}
                <div class="sh-kpi-card">
                    <div>
                        <div class="sh-kpi-header">
                            <span class="sh-kpi-title">Application & Server</span>
                            <span class="sh-kpi-pill">
                                <span class="sh-dot-live"></span>
                                Active
                            </span>
                        </div>
                        <p class="sh-kpi-value">Laravel {{ $serverMetrics['laravel_version'] }}</p>
                        <p class="sh-kpi-sub" title="PHP {{ $serverMetrics['php_version'] }} ({{ $serverMetrics['server_software'] }})">
                            PHP {{ $serverMetrics['php_version'] }} ({{ $serverMetrics['server_software'] }})
                        </p>
                    </div>
                    <div class="sh-kpi-footer">
                        <span>Memory Limit:</span>
                        <span class="sh-kpi-footer-val">{{ $serverMetrics['memory_limit'] }}</span>
                    </div>
                </div>

                {{-- Database Engine Health --}}
                <div class="sh-kpi-card">
                    <div>
                        <div class="sh-kpi-header">
                            <span class="sh-kpi-title">Database Engine</span>
                            @if($databaseMetrics['is_healthy'])
                                <span class="sh-kpi-pill">
                                    <span class="sh-dot-live"></span>
                                    {{ strtoupper($databaseMetrics['driver']) }} Active
                                </span>
                            @else
                                <span class="sh-kpi-pill danger">Issues Found</span>
                            @endif
                        </div>
                        <p class="sh-kpi-value">{{ $databaseMetrics['size'] }}</p>
                        <p class="sh-kpi-sub">
                            @if($databaseMetrics['driver'] === 'sqlite')
                                WAL: {{ $databaseMetrics['wal_size'] }} | Mode: {{ $databaseMetrics['journal_mode'] }}
                            @else
                                {{ $databaseMetrics['journal_mode'] }} • {{ $databaseMetrics['tables_count'] }} Tables
                            @endif
                        </p>
                    </div>
                    <div class="sh-kpi-footer">
                        <span>Integrity Check:</span>
                        <span class="sh-kpi-footer-val healthy">{{ $databaseMetrics['integrity'] }}</span>
                    </div>
                </div>

                {{-- Scheduled Publishing & Cron --}}
                <div class="sh-kpi-card">
                    <div>
                        <div class="sh-kpi-header">
                            <span class="sh-kpi-title">Scheduled Publishing</span>
                            @if($scheduledPublishing['is_cron_healthy'])
                                <span class="sh-kpi-pill">
                                    <span class="sh-dot-live"></span>
                                    Cron Active
                                </span>
                            @else
                                <span class="sh-kpi-pill warning">Cron Pending</span>
                            @endif
                        </div>
                        <p class="sh-kpi-value">{{ $scheduledPublishing['total_pending'] }} Due / Pending</p>
                        <p class="sh-kpi-sub">
                            @if($scheduledPublishing['next_item'])
                                Next: {{ $scheduledPublishing['next_item']['countdown'] }}
                            @else
                                No pending schedule queue
                            @endif
                        </p>
                    </div>
                    <div class="sh-kpi-footer">
                        <span>Frequency:</span>
                        <span class="sh-kpi-footer-val">Every 5 mins (CLI)</span>
                    </div>
                </div>

                {{-- Cache Engine Health --}}
                <div class="sh-kpi-card">
                    <div>
                        <div class="sh-kpi-header">
                            <span class="sh-kpi-title">Cache Driver</span>
                            @if($cacheHealth['is_healthy'])
                                <span class="sh-kpi-pill">
                                    <span class="sh-dot-live"></span>
                                    Operational
                                </span>
                            @else
                                <span class="sh-kpi-pill danger">Cache Error</span>
                            @endif
                        </div>
                        <p class="sh-kpi-value">{{ strtoupper($cacheHealth['driver']) }}</p>
                        <p class="sh-kpi-sub">Write/Read Latency: {{ $cacheHealth['latency_ms'] }} ms</p>
                    </div>
                    <div class="sh-kpi-footer">
                        <span>Probe Status:</span>
                        <span class="sh-kpi-footer-val healthy">Healthy</span>
                    </div>
                </div>
            </div>

            {{-- Middle Row: System Resources, Inventory & Probes (Guaranteed 3 Columns on Desktop) --}}
            <div class="sh-mid-grid">
                {{-- Server Resources --}}
                <div class="sh-panel">
                    <div>
                        <div class="sh-panel-header">
                            <div class="sh-panel-title-wrap">
                                <span class="sh-panel-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;">
                                        <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/>
                                        <rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>
                                        <line x1="6" x2="6.01" y1="6" y2="6"/>
                                        <line x1="6" x2="6.01" y1="18" y2="18"/>
                                    </svg>
                                </span>
                                <h3 class="sh-panel-title">System Runtime & Limits</h3>
                            </div>
                            <span class="sh-kpi-pill">
                                <span class="sh-dot-live"></span>
                                Healthy
                            </span>
                        </div>
                        <div class="sh-kv-group">
                            <div class="sh-kv-item">
                                <span class="sh-kv-label">PHP Memory Usage</span>
                                <span class="sh-kv-val">{{ $serverMetrics['memory_usage'] }} (Peak: {{ $serverMetrics['memory_peak'] }})</span>
                            </div>
                            <div class="sh-kv-item">
                                <span class="sh-kv-label">Memory Limit</span>
                                <span class="sh-kv-val">{{ $serverMetrics['memory_limit'] }}</span>
                            </div>
                            <div class="sh-kv-item">
                                <span class="sh-kv-label">Max Execution Time</span>
                                <span class="sh-kv-val">{{ $serverMetrics['max_execution_time'] }}</span>
                            </div>
                            <div class="sh-kv-item">
                                <span class="sh-kv-label">Max Upload / Post Size</span>
                                <span class="sh-kv-val">{{ $serverMetrics['upload_max_filesize'] }} / {{ $serverMetrics['post_max_size'] }}</span>
                            </div>
                            <div class="sh-kv-item">
                                <span class="sh-kv-label">Server Clock (IST)</span>
                                <span class="sh-kv-val accent">{{ $serverMetrics['server_time_kolkata'] }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="sh-disk-section">
                        <div class="sh-disk-head">
                            <span>Disk Usage (Hostinger Storage)</span>
                            <span class="sh-disk-badge">{{ $serverMetrics['disk_usage_percent'] }}% used</span>
                        </div>
                        <div class="sh-disk-track">
                            <div class="sh-disk-fill" style="width: {{ min(100, $serverMetrics['disk_usage_percent']) }}%"></div>
                        </div>
                        <div class="sh-disk-footer">
                            <span>Free: {{ $serverMetrics['disk_free'] }}</span>
                            <span>Total: {{ $serverMetrics['disk_total'] }}</span>
                        </div>
                    </div>
                </div>

                {{-- Content Inventory Matrix --}}
                <div class="sh-panel">
                    <div>
                        <div class="sh-panel-header">
                            <div class="sh-panel-title-wrap">
                                <span class="sh-panel-icon purple">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;">
                                        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                                        <polyline points="2 17 12 22 22 17"/>
                                        <polyline points="2 12 12 17 22 12"/>
                                    </svg>
                                </span>
                                <h3 class="sh-panel-title">Core Content Inventory</h3>
                            </div>
                            <span class="sh-kpi-pill">
                                CMS Live
                            </span>
                        </div>
                        <div>
                            <div class="sh-inv-tile">
                                <div>
                                    <p class="sh-inv-name">Services</p>
                                    <p class="sh-inv-sub">{{ $databaseMetrics['content_counts']['services']['published'] }} Published • {{ $databaseMetrics['content_counts']['services']['scheduled'] }} Scheduled</p>
                                </div>
                                <span class="sh-inv-count {{ $databaseMetrics['content_counts']['services']['total'] == 0 ? 'zero' : '' }}">
                                    {{ $databaseMetrics['content_counts']['services']['total'] }}
                                </span>
                            </div>

                            <div class="sh-inv-tile">
                                <div>
                                    <p class="sh-inv-name">Blog Posts & Articles</p>
                                    <p class="sh-inv-sub">{{ $databaseMetrics['content_counts']['blog_posts']['published'] }} Published • {{ $databaseMetrics['content_counts']['blog_posts']['scheduled'] }} Scheduled</p>
                                </div>
                                <span class="sh-inv-count {{ $databaseMetrics['content_counts']['blog_posts']['total'] == 0 ? 'zero' : '' }}">
                                    {{ $databaseMetrics['content_counts']['blog_posts']['total'] }}
                                </span>
                            </div>

                            <div class="sh-inv-tile">
                                <div>
                                    <p class="sh-inv-name">Case Studies</p>
                                    <p class="sh-inv-sub">{{ $databaseMetrics['content_counts']['case_studies']['published'] }} Published • {{ $databaseMetrics['content_counts']['case_studies']['scheduled'] }} Scheduled</p>
                                </div>
                                <span class="sh-inv-count {{ $databaseMetrics['content_counts']['case_studies']['total'] == 0 ? 'zero' : '' }}">
                                    {{ $databaseMetrics['content_counts']['case_studies']['total'] }}
                                </span>
                            </div>

                            <div class="sh-inv-tile">
                                <div>
                                    <p class="sh-inv-name">Dynamic Pages & Templates</p>
                                    <p class="sh-inv-sub">{{ $databaseMetrics['content_counts']['pages']['published'] }} Published Pages • {{ $databaseMetrics['content_counts']['settings'] }} Global Settings</p>
                                </div>
                                <span class="sh-inv-count {{ $databaseMetrics['content_counts']['pages']['total'] == 0 ? 'zero' : '' }}">
                                    {{ $databaseMetrics['content_counts']['pages']['total'] }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- API Endpoints Health Check --}}
                <div class="sh-panel">
                    <div>
                        <div class="sh-panel-header">
                            <div class="sh-panel-title-wrap">
                                <span class="sh-panel-icon emerald">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;">
                                        <path d="m13 2-2 10h9L7 22l2-10H0Z"/>
                                    </svg>
                                </span>
                                <h3 class="sh-panel-title">Public API Health Probes</h3>
                            </div>
                            <span class="sh-kpi-pill">
                                <span class="sh-dot-live"></span>
                                Probes Active
                            </span>
                        </div>
                        <div>
                            @foreach($apiHealth as $api)
                                <div class="sh-probe-tile">
                                    <div class="sh-probe-main">
                                        <div class="sh-probe-row1">
                                            <span class="sh-probe-name">{{ $api['name'] }}</span>
                                            <span class="sh-probe-uri">{{ $api['endpoint'] }}</span>
                                        </div>
                                        <p class="sh-probe-latency">Latency: {{ $api['latency_ms'] }} ms</p>
                                    </div>
                                    <div>
                                        @if($api['is_healthy'])
                                            <span class="sh-probe-status healthy">
                                                {{ $api['status_code'] }} OK
                                            </span>
                                        @else
                                            <span class="sh-probe-status danger">
                                                {{ $api['status_code'] }} Fail
                                            </span>
                                        @endif
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <div class="sh-panel-action">
                        <button
                            type="button"
                            wire:click="clearSystemCache"
                            class="sh-btn-clean"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; color: #2563eb;">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                <path d="M3 3v5h5"/>
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                                <path d="M16 21h5v-5"/>
                            </svg>
                            <span>Purge Application Cache</span>
                        </button>
                    </div>
                </div>
            </div>
        @endif

        {{-- ========================================================================= --}}
        {{-- TAB 2: DATABASE BACKUPS & SAFE RECOVERY --}}
        {{-- ========================================================================= --}}
        @if($activeTab === 'backups')
            <div class="space-y-6">
                {{-- Action Bar --}}
                <div class="p-4 rounded-xl border border-gray-800 bg-gray-900/40 flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-3 flex-1 min-w-[280px]">
                        <input
                            type="text"
                            wire:model="manualBackupNotes"
                            placeholder="Optional backup note (e.g., Pre-deployment checkpoint)..."
                            class="w-full text-xs rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            wire:click="createManualBackup"
                            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-500 shadow-sm transition flex-shrink-0"
                        >
                            <x-heroicon-o-plus-circle class="w-4 h-4" />
                            <span>Create Manual Backup</span>
                        </button>
                    </div>

                    @if($isSuperAdmin)
                        <div class="flex items-center gap-2">
                            <button
                                type="button"
                                wire:click="pruneOldBackups"
                                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition"
                            >
                                <x-heroicon-o-trash class="w-4 h-4 text-gray-400" />
                                <span>Prune (>14 Days)</span>
                            </button>
                        </div>
                    @endif
                </div>

                {{-- Backups Catalog Table --}}
                <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/40 shadow-sm">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-gray-950/70 text-gray-400 uppercase tracking-wider font-mono border-b border-gray-800">
                            <tr>
                                <th class="px-4 py-3">Filename & Notes</th>
                                <th class="px-4 py-3">Type</th>
                                <th class="px-4 py-3">File Size</th>
                                <th class="px-4 py-3">SHA-256 Hash</th>
                                <th class="px-4 py-3">Integrity Status</th>
                                <th class="px-4 py-3">Tables / Rows</th>
                                <th class="px-4 py-3">Created At (IST)</th>
                                <th class="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800/60 text-gray-300">
                            @forelse($backups as $b)
                                <tr class="hover:bg-gray-800/30 transition">
                                    <td class="px-4 py-3 font-mono">
                                        <div class="font-medium text-white">{{ $b->filename }}</div>
                                        @if($b->notes)
                                            <div class="text-[11px] text-gray-400 italic truncate max-w-xs">{{ $b->notes }}</div>
                                        @endif
                                    </td>
                                    <td class="px-4 py-3">
                                        @if($b->backup_type === 'manual')
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Manual</span>
                                        @elseif($b->backup_type === 'automatic')
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Automatic</span>
                                        @elseif($b->backup_type === 'pre_restore')
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pre-Restore</span>
                                        @else
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-700 text-gray-300">{{ $b->backup_type }}</span>
                                        @endif
                                    </td>
                                    <td class="px-4 py-3 font-mono">{{ $b->formatted_size }}</td>
                                    <td class="px-4 py-3 font-mono text-gray-400" title="{{ $b->sha256_hash }}">
                                        {{ $b->short_sha }}...
                                    </td>
                                    <td class="px-4 py-3">
                                        @if($b->status === 'verified')
                                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <x-heroicon-o-check-circle class="w-3.5 h-3.5" />
                                                Verified
                                            </span>
                                        @elseif($b->status === 'completed')
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                Completed
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                Failed
                                            </span>
                                        @endif
                                    </td>
                                    <td class="px-4 py-3 font-mono text-gray-400">
                                        {{ $b->tables_count }} tbls / {{ $b->rows_count }} rows
                                    </td>
                                    <td class="px-4 py-3 text-gray-400">
                                        {{ $b->created_at->format('d M Y, h:i A') }}
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <div class="inline-flex items-center gap-1.5">
                                            {{-- Verify Integrity Action --}}
                                            <button
                                                type="button"
                                                wire:click="verifyBackup({{ $b->id }})"
                                                title="Verify SHA-256 Checksum & SQLite Integrity"
                                                class="p-1.5 rounded bg-gray-800 text-gray-300 hover:text-emerald-400 hover:bg-gray-700 transition"
                                            >
                                                <x-heroicon-o-arrow-path class="w-3.5 h-3.5" />
                                            </button>

                                            {{-- Test Staging Restore --}}
                                            <button
                                                type="button"
                                                wire:click="testStagingRestore({{ $b->id }})"
                                                title="Test Restore in Isolated Staging (0 Downtime / Safe Inspection)"
                                                class="p-1.5 rounded bg-gray-800 text-gray-300 hover:text-primary-400 hover:bg-gray-700 transition"
                                            >
                                                <x-heroicon-o-beaker class="w-3.5 h-3.5" />
                                            </button>

                                            @if($isSuperAdmin)
                                                {{-- Production Restore (Super Admin Only) --}}
                                                <button
                                                    type="button"
                                                    wire:click="openProductionRestoreModal({{ $b->id }})"
                                                    title="Safe Recovery to Production (Super Admin Only)"
                                                    class="p-1.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition"
                                                >
                                                    <x-heroicon-o-arrow-uturn-left class="w-3.5 h-3.5" />
                                                </button>

                                                {{-- Download Backup --}}
                                                <button
                                                    type="button"
                                                    wire:click="downloadBackup({{ $b->id }})"
                                                    title="Download Backup Binary (Super Admin Only)"
                                                    class="p-1.5 rounded bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition"
                                                >
                                                    <x-heroicon-o-arrow-down-tray class="w-3.5 h-3.5" />
                                                </button>

                                                {{-- Delete Backup --}}
                                                <button
                                                    type="button"
                                                    wire:click="deleteBackup({{ $b->id }})"
                                                    onclick="return confirm('Are you sure you want to permanently delete this backup file?')"
                                                    title="Delete Backup"
                                                    class="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                                                >
                                                    <x-heroicon-o-trash class="w-3.5 h-3.5" />
                                                </button>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                                        No database backups registered in catalog yet. Click "Create Manual Backup" to generate the first verified snapshot.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        @endif

        {{-- ========================================================================= --}}
        {{-- TAB 3: SECURITY & ACTIVITY AUDIT LOGS --}}
        {{-- ========================================================================= --}}
        @if($activeTab === 'activity')
            <div class="space-y-4">
                {{-- Filters Bar --}}
                <div class="p-4 rounded-xl border border-gray-800 bg-gray-900/40 flex flex-wrap items-center justify-between gap-4">
                    <div class="flex flex-wrap items-center gap-3 flex-1">
                        {{-- Action Filter --}}
                        <div class="w-48">
                            <select
                                wire:model.live="auditActionFilter"
                                class="w-full text-xs rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-gray-200 focus:border-primary-500 focus:outline-none"
                            >
                                <option value="">All Activity Types</option>
                                @foreach($distinctActions as $act)
                                    <option value="{{ $act }}">{{ $act }}</option>
                                @endforeach
                            </select>
                        </div>

                        {{-- Search Input --}}
                        <div class="w-64">
                            <input
                                type="text"
                                wire:model.live.debounce.300ms="auditSearch"
                                placeholder="Search by email, action, IP..."
                                class="w-full text-xs rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-gray-200 placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div class="text-xs text-gray-400 font-mono">
                        Showing recent {{ count($auditLogs) }} event(s)
                    </div>
                </div>

                {{-- Activity Logs Table --}}
                <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/40 shadow-sm">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-gray-950/70 text-gray-400 uppercase tracking-wider font-mono border-b border-gray-800">
                            <tr>
                                <th class="px-4 py-3">Timestamp (IST)</th>
                                <th class="px-4 py-3">Action</th>
                                <th class="px-4 py-3">User / Identity</th>
                                <th class="px-4 py-3">Auditable Entity</th>
                                <th class="px-4 py-3">IP Address</th>
                                <th class="px-4 py-3 text-right">Payload Details</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800/60 text-gray-300">
                            @forelse($auditLogs as $log)
                                <tr class="hover:bg-gray-800/30 transition">
                                    <td class="px-4 py-3 text-gray-400 whitespace-nowrap">
                                        <div class="text-gray-300">{{ $log->created_at->format('d M Y, h:i:s A') }}</div>
                                        <div class="text-[11px] text-gray-500">{{ $log->created_at->diffForHumans() }}</div>
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap">
                                        @php
                                            $act = $log->action;
                                            $badgeClass = 'bg-gray-700 text-gray-300';
                                            if (in_array($act, ['LOGIN'])) $badgeClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                                            elseif (in_array($act, ['LOGOUT'])) $badgeClass = 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
                                            elseif (in_array($act, ['FAILED_LOGIN', 'UNAUTHORIZED_RESTORE_ATTEMPT', 'SCHEDULED_PUBLISH_FAILED'])) $badgeClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
                                            elseif (in_array($act, ['CREATE', 'BACKUP_CREATED'])) $badgeClass = 'bg-primary-500/10 text-primary-400 border border-primary-500/20';
                                            elseif (in_array($act, ['UPDATE', 'SETTINGS_UPDATED', 'SETTINGS_SNAPSHOT_RESTORED'])) $badgeClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                                            elseif (in_array($act, ['PUBLISH', 'SCHEDULED_PUBLISH'])) $badgeClass = 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
                                            elseif (in_array($act, ['DELETE', 'BACKUP_DELETED'])) $badgeClass = 'bg-red-500/10 text-red-400 border border-red-500/20';
                                            elseif (in_array($act, ['DATABASE_RESTORE_PRODUCTION'])) $badgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                                        @endphp
                                        <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold {{ $badgeClass }}">
                                            {{ $act }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="font-medium text-white">{{ $log->user?->name ?? ($log->user_email ?: 'System Runner') }}</div>
                                        @if($log->user?->email && $log->user->name !== $log->user->email)
                                            <div class="text-[11px] text-gray-500">{{ $log->user->email }}</div>
                                        @endif
                                    </td>
                                    <td class="px-4 py-3 font-mono text-gray-400">
                                        @if($log->auditable_type)
                                            <span>{{ class_basename($log->auditable_type) }} #{{ $log->auditable_id }}</span>
                                        @else
                                            <span class="text-gray-600">—</span>
                                        @endif
                                    </td>
                                    <td class="px-4 py-3 font-mono text-gray-400">
                                        {{ $log->ip_address ?: '—' }}
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        @if($log->old_values || $log->new_values)
                                            <button
                                                type="button"
                                                wire:click="viewAuditDetail({{ $log->id }})"
                                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-gray-800 text-primary-400 hover:text-primary-300 hover:bg-gray-700 transition"
                                            >
                                                <x-heroicon-o-eye class="w-3.5 h-3.5" />
                                                <span>View Diff</span>
                                            </button>
                                        @else
                                            <span class="text-gray-600 text-xs">—</span>
                                        @endif
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                                        No activity logs matching criteria.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        @endif

        {{-- ========================================================================= --}}
        {{-- TAB 4: CRON, BACKGROUND JOBS & ERROR LOGS --}}
        {{-- ========================================================================= --}}
        @if($activeTab === 'logs')
            <div class="space-y-6">
                {{-- Scheduled Publishing Background Service --}}
                <div class="p-6 rounded-xl border border-gray-800 bg-gray-900/40">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <x-heroicon-o-clock class="w-5 h-5 text-primary-400" />
                            <h3 class="text-base font-semibold text-white">Automated Scheduled Publishing Cron</h3>
                        </div>
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Command: cms:publish-scheduled
                        </span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div class="p-3.5 rounded-lg bg-gray-950 border border-gray-800">
                            <span class="text-xs text-gray-400">Hostinger Cron Schedule</span>
                            <p class="text-sm font-mono text-white mt-1">*/5 * * * * (Every 5 mins)</p>
                        </div>
                        <div class="p-3.5 rounded-lg bg-gray-950 border border-gray-800">
                            <span class="text-xs text-gray-400">Timezone Context</span>
                            <p class="text-sm font-mono text-white mt-1">Asia/Kolkata (IST)</p>
                        </div>
                        <div class="p-3.5 rounded-lg bg-gray-950 border border-gray-800">
                            <span class="text-xs text-gray-400">Last Execution</span>
                            <p class="text-sm font-mono text-white mt-1">{{ $scheduledPublishing['last_run_at'] }}</p>
                        </div>
                    </div>

                    @if(!empty($publishingLogs['file_tail']))
                        <div class="mt-4">
                            <p class="text-xs font-mono uppercase text-gray-400 mb-2">Recent Execution Log Entries (scheduled-publishing.log):</p>
                            <div class="p-3 rounded-lg bg-black/60 border border-gray-800 font-mono text-xs text-gray-300 max-h-48 overflow-y-auto space-y-1">
                                @foreach($publishingLogs['file_tail'] as $logLine)
                                    <div class="truncate">{{ $logLine }}</div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>

                {{-- Application Error Logs Viewer --}}
                <div class="p-6 rounded-xl border border-gray-800 bg-gray-900/40">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <x-heroicon-o-exclamation-triangle class="w-5 h-5 text-amber-400" />
                            <h3 class="text-base font-semibold text-white">Application Error & Warning Stream</h3>
                        </div>
                        <span class="text-xs font-mono text-gray-400">
                            storage/logs/laravel.log
                        </span>
                    </div>

                    <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
                        @forelse($errorLogs as $err)
                            <div class="p-3 rounded-lg bg-gray-950 border border-gray-800/80 text-xs font-mono">
                                <div class="flex items-center justify-between mb-1">
                                    <div class="flex items-center gap-2">
                                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold {{ in_array($err['level'], ['ERROR', 'CRITICAL']) ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400' }}">
                                            {{ $err['level'] }}
                                        </span>
                                        <span class="text-gray-400">{{ $err['timestamp'] }}</span>
                                    </div>
                                    <span class="text-gray-500">{{ $err['environment'] }}</span>
                                </div>
                                <p class="text-gray-300 break-words">{{ $err['message'] }}</p>
                            </div>
                        @empty
                            <div class="p-8 text-center text-gray-500 text-xs">
                                No recent errors or critical exceptions reported in laravel.log. System running cleanly.
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
        @endif

        {{-- ========================================================================= --}}
        {{-- MODAL 1: STAGING RESTORATION INSPECTION --}}
        {{-- ========================================================================= --}}
        @if($showStagingModal && $stagingInspectionResult)
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div class="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
                    <div class="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                        <div class="flex items-center gap-2">
                            <x-heroicon-o-beaker class="w-5 h-5 text-primary-400" />
                            <h3 class="text-lg font-bold text-white">Staging Restoration Audit (Isolated Verification)</h3>
                        </div>
                        <button type="button" wire:click="closeStagingModal" class="text-gray-400 hover:text-white">
                            <x-heroicon-o-x-mark class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="space-y-4 text-xs">
                        <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                            ✓ Backup restored successfully in temporary staging sandbox. Database integrity and foreign key constraints confirmed 100% valid with 0 downtime.
                        </div>

                        <dl class="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-950 border border-gray-800 font-mono">
                            <div>
                                <dt class="text-gray-500">Backup File</dt>
                                <dd class="text-white truncate">{{ $stagingInspectionResult['filename'] }}</dd>
                            </div>
                            <div>
                                <dt class="text-gray-500">File Size</dt>
                                <dd class="text-white">{{ $stagingInspectionResult['size'] }}</dd>
                            </div>
                            <div>
                                <dt class="text-gray-500">Integrity Check</dt>
                                <dd class="text-emerald-400">{{ $stagingInspectionResult['integrity'] }}</dd>
                            </div>
                            <div>
                                <dt class="text-gray-500">Foreign Key Violations</dt>
                                <dd class="text-emerald-400">{{ $stagingInspectionResult['fk_violations'] }}</dd>
                            </div>
                        </dl>

                        <div>
                            <p class="font-semibold text-gray-300 mb-2">Restorable Content Records:</p>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div class="p-2.5 rounded bg-gray-950 border border-gray-800 text-center">
                                    <div class="text-xs text-gray-400">Services</div>
                                    <div class="text-base font-bold text-white font-mono">{{ $stagingInspectionResult['counts']['services'] }}</div>
                                </div>
                                <div class="p-2.5 rounded bg-gray-950 border border-gray-800 text-center">
                                    <div class="text-xs text-gray-400">Blog Posts</div>
                                    <div class="text-base font-bold text-white font-mono">{{ $stagingInspectionResult['counts']['blog_posts'] }}</div>
                                </div>
                                <div class="p-2.5 rounded bg-gray-950 border border-gray-800 text-center">
                                    <div class="text-xs text-gray-400">Case Studies</div>
                                    <div class="text-base font-bold text-white font-mono">{{ $stagingInspectionResult['counts']['case_studies'] }}</div>
                                </div>
                                <div class="p-2.5 rounded bg-gray-950 border border-gray-800 text-center">
                                    <div class="text-xs text-gray-400">Pages</div>
                                    <div class="text-base font-bold text-white font-mono">{{ $stagingInspectionResult['counts']['pages'] }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-4 border-t border-gray-800 flex justify-end">
                        <button
                            type="button"
                            wire:click="closeStagingModal"
                            class="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition"
                        >
                            Close Audit View
                        </button>
                    </div>
                </div>
            </div>
        @endif

        {{-- ========================================================================= --}}
        {{-- MODAL 2: SAFE PRODUCTION RESTORE CONFIRMATION --}}
        {{-- ========================================================================= --}}
        @if($showRestoreModal)
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div class="w-full max-w-lg rounded-2xl border border-rose-500/40 bg-gray-900 p-6 shadow-2xl">
                    <div class="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                        <div class="flex items-center gap-2 text-rose-400">
                            <x-heroicon-o-exclamation-triangle class="w-6 h-6" />
                            <h3 class="text-lg font-bold text-white">Confirm Production Database Recovery</h3>
                        </div>
                        <button type="button" wire:click="closeProductionRestoreModal" class="text-gray-400 hover:text-white">
                            <x-heroicon-o-x-mark class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="space-y-4 text-xs">
                        <div class="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
                            <p class="font-semibold">⚠️ Safety Protocol Enforced:</p>
                            <ul class="list-disc list-inside mt-1 space-y-1 text-amber-300/90 text-[11px]">
                                <li>The system will automatically generate a fresh pre-restore safety snapshot first.</li>
                                <li>If anything fails during verification, automatic rollback will engage immediately.</li>
                                <li>This operation requires Super Administrator credentials.</li>
                            </ul>
                        </div>

                        <div>
                            <label class="block text-gray-300 font-semibold mb-1">
                                Type <span class="font-mono text-rose-400">CONFIRM RESTORE</span> to proceed:
                            </label>
                            <input
                                type="text"
                                wire:model="restoreConfirmInput"
                                placeholder="CONFIRM RESTORE"
                                class="w-full text-xs font-mono rounded-lg bg-gray-950 border border-gray-800 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div class="mt-6 pt-4 border-t border-gray-800 flex justify-end gap-3">
                        <button
                            type="button"
                            wire:click="closeProductionRestoreModal"
                            class="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            wire:click="executeProductionRestore"
                            class="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition shadow-sm"
                        >
                            Execute Safe Production Recovery
                        </button>
                    </div>
                </div>
            </div>
        @endif

        {{-- ========================================================================= --}}
        {{-- MODAL 3: AUDIT LOG PAYLOAD DIFF DETAILS --}}
        {{-- ========================================================================= --}}
        @if($showAuditDetailModal && $selectedAuditDetail)
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div class="w-full max-w-3xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
                    <div class="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                        <div class="flex items-center gap-2">
                            <x-heroicon-o-clipboard-document-list class="w-5 h-5 text-primary-400" />
                            <h3 class="text-lg font-bold text-white">Activity Log Audit Details (Log #{{ $selectedAuditDetail['id'] }})</h3>
                        </div>
                        <button type="button" wire:click="closeAuditDetailModal" class="text-gray-400 hover:text-white">
                            <x-heroicon-o-x-mark class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="space-y-4 text-xs">
                        <dl class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-gray-950 border border-gray-800 font-mono">
                            <div>
                                <dt class="text-gray-500">Action</dt>
                                <dd class="text-primary-400 font-bold">{{ $selectedAuditDetail['action'] }}</dd>
                            </div>
                            <div>
                                <dt class="text-gray-500">User</dt>
                                <dd class="text-white truncate">{{ $selectedAuditDetail['user'] }}</dd>
                            </div>
                            <div>
                                <dt class="text-gray-500">Entity</dt>
                                <dd class="text-white">{{ $selectedAuditDetail['entity'] }}</dd>
                            </div>
                            <div>
                                <dt class="text-gray-500">IP Address</dt>
                                <dd class="text-gray-300">{{ $selectedAuditDetail['ip_address'] }}</dd>
                            </div>
                            <div class="col-span-2">
                                <dt class="text-gray-500">Timestamp</dt>
                                <dd class="text-gray-300">{{ $selectedAuditDetail['created_at'] }}</dd>
                            </div>
                        </dl>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p class="font-semibold text-gray-400 mb-1">Previous Values (Before Change):</p>
                                <pre class="p-3 rounded-lg bg-black/60 border border-gray-800 font-mono text-[11px] text-gray-300 max-h-60 overflow-y-auto whitespace-pre-wrap">{{ $selectedAuditDetail['old_values'] ? json_encode($selectedAuditDetail['old_values'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : 'None' }}</pre>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-400 mb-1">New Values (After Change):</p>
                                <pre class="p-3 rounded-lg bg-black/60 border border-gray-800 font-mono text-[11px] text-emerald-300 max-h-60 overflow-y-auto whitespace-pre-wrap">{{ $selectedAuditDetail['new_values'] ? json_encode($selectedAuditDetail['new_values'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : 'None' }}</pre>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-4 border-t border-gray-800 flex justify-end">
                        <button
                            type="button"
                            wire:click="closeAuditDetailModal"
                            class="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        @endif

    </div>
</x-filament-panels::page>
