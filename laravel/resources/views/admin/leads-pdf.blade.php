<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GetIntoFeed — Inbound Leads & Growth Pipeline Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #0f172a;
            background: #f8fafc;
            padding: 30px;
            font-size: 13px;
            line-height: 1.5;
        }
        .no-print-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #090d16;
            color: #ffffff;
            padding: 14px 24px;
            border-radius: 14px;
            margin-bottom: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .no-print-bar .brand {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 16px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .btn-print {
            background: #ccff00;
            color: #090d16;
            border: none;
            padding: 9px 18px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: opacity 0.2s;
        }
        .btn-print:hover { opacity: 0.9; }
        .btn-back {
            background: transparent;
            color: #94a3b8;
            border: 1px solid #334155;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 12px;
            text-decoration: none;
            margin-right: 10px;
        }
        .btn-back:hover { color: #ffffff; border-color: #64748b; }
        .report-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 20px;
            margin-bottom: 24px;
        }
        .logo-area h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
        }
        .logo-area p {
            color: #64748b;
            font-size: 12px;
            margin-top: 4px;
        }
        .meta-info {
            text-align: right;
            font-size: 12px;
            color: #64748b;
        }
        .meta-info strong {
            color: #0f172a;
            font-size: 13px;
        }
        .summary-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        }
        .stat-box {
            background: #f1f5f9;
            padding: 14px 18px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }
        .stat-box .num {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
        }
        .stat-box .lbl {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
            margin-top: 2px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background: #0f172a;
            color: #ffffff;
            text-align: left;
            padding: 10px 12px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        th:first-child { border-top-left-radius: 8px; }
        th:last-child { border-top-right-radius: 8px; }
        td {
            padding: 11px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
            vertical-align: top;
        }
        tr:nth-child(even) td { background: #f8fafc; }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .badge-new { background: #e0f2fe; color: #0369a1; }
        .badge-contacted { background: #ede9fe; color: #6d28d9; }
        .badge-qualified { background: #fef3c7; color: #b45309; }
        .badge-won { background: #dcfce7; color: #15803d; }
        .badge-lost { background: #fee2e2; color: #b91c1c; }
        .footer-note {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            color: #94a3b8;
            font-size: 11px;
        }

        @media print {
            body { background: #ffffff; padding: 0; font-size: 11px; }
            .no-print-bar { display: none !important; }
            .report-card { border: none; box-shadow: none; padding: 0; }
            th { background: #0f172a !important; color: #ffffff !important; -webkit-print-color-adjust: exact; }
            .badge { -webkit-print-color-adjust: exact; }
            tr:nth-child(even) td { background: #f8fafc !important; -webkit-print-color-adjust: exact; }
            .stat-box { background: #f1f5f9 !important; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="no-print-bar">
        <div class="brand">
            <span>GETINTOFEED</span>
            <span style="color: #ccff00;">•</span>
            <span style="font-weight: 400; font-size: 13px; color: #cbd5e1;">Inbound Leads Export</span>
        </div>
        <div>
            <a href="/admin/leads" class="btn-back">← Back to Leads</a>
            <button onclick="window.print()" class="btn-print">🖨️ Print / Save as PDF</button>
        </div>
    </div>

    <div class="report-card">
        <div class="header-section">
            <div class="logo-area">
                <h1>GETINTOFEED</h1>
                <p>Digital Marketing & Performance Media Studio • Delhi NCR</p>
                <p style="font-size: 11px; color: #94a3b8;">Official Pipeline & Inbound Growth Telemetry</p>
            </div>
            <div class="meta-info">
                <div>Report: <strong>Client Inbound Pipeline</strong></div>
                <div>Generated: <strong>{{ now()->format('d M Y, h:i A') }}</strong></div>
                <div>Total Records: <strong>{{ count($leads) }} Inbound Enquiries</strong></div>
            </div>
        </div>

        <div class="summary-stats">
            <div class="stat-box">
                <div class="num">{{ count($leads) }}</div>
                <div class="lbl">Total Enquiries</div>
            </div>
            <div class="stat-box">
                <div class="num">{{ $leads->where('status', 'New')->count() }}</div>
                <div class="lbl">New Uncontacted</div>
            </div>
            <div class="stat-box">
                <div class="num">{{ $leads->where('status', 'Contacted')->count() }}</div>
                <div class="lbl">In Progress</div>
            </div>
            <div class="stat-box">
                <div class="num">{{ $leads->where('status', 'Won')->count() }}</div>
                <div class="lbl">Won Clients</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 70px;">Code</th>
                    <th style="width: 130px;">Contact</th>
                    <th style="width: 140px;">Phone &amp; Email</th>
                    <th style="width: 130px;">Service / Budget</th>
                    <th style="width: 80px;">Status</th>
                    <th>Client Note / Project Scope</th>
                    <th style="width: 100px;">Submitted</th>
                </tr>
            </thead>
            <tbody>
                @forelse($leads as $lead)
                    <tr>
                        <td style="font-family: monospace; font-size: 11px; font-weight: 700; color: #475569;">
                            {{ $lead->lead_code ?: ('LEAD-'.$lead->id) }}
                        </td>
                        <td>
                            <strong style="color: #0f172a;">{{ $lead->name }}</strong>
                            @if($lead->company && $lead->company !== 'Direct Client')
                                <div style="font-size: 11px; color: #64748b;">{{ $lead->company }}</div>
                            @endif
                        </td>
                        <td>
                            <div><a href="tel:{{ $lead->phone }}" style="color: #2563eb; text-decoration: none; font-weight: 600;">{{ $lead->phone }}</a></div>
                            <div style="font-size: 11px; color: #64748b;">{{ $lead->email }}</div>
                        </td>
                        <td>
                            <div style="font-weight: 600; color: #0f172a;">{{ $lead->interested_service ?: 'General Growth' }}</div>
                            @if($lead->budget)
                                <div style="font-size: 11px; color: #16a34a; font-weight: 600;">{{ $lead->budget }}</div>
                            @endif
                        </td>
                        <td>
                            @php
                                $statusClass = match(strtolower($lead->status ?? 'new')) {
                                    'new' => 'badge-new',
                                    'contacted' => 'badge-contacted',
                                    'qualified' => 'badge-qualified',
                                    'won' => 'badge-won',
                                    'lost' => 'badge-lost',
                                    default => 'badge-new',
                                };
                            @endphp
                            <span class="badge {{ $statusClass }}">{{ $lead->status ?: 'New' }}</span>
                        </td>
                        <td style="color: #334155;">
                            {{ $lead->message ?: '—' }}
                            @if($lead->page_url)
                                <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Origin: {{ parse_url($lead->page_url, PHP_URL_PATH) ?: '/' }}</div>
                            @endif
                        </td>
                        <td style="color: #64748b; font-size: 11px;">
                            {{ $lead->created_at ? $lead->created_at->format('d M Y, h:i A') : '—' }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 30px; color: #94a3b8;">
                            No inbound leads found.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="footer-note">
            <div>Confidential • For internal use by GetIntoFeed leadership only.</div>
            <div>https://getintofeed.com • +91 88103 56950</div>
        </div>
    </div>

    <script>
        // Auto trigger print dialog on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.print();
            }, 600);
        });
    </script>
</body>
</html>
