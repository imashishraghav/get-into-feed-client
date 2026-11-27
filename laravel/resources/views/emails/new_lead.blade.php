<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Growth Enquiry</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #0f1319;
            color: #e2e8f0;
            margin: 0;
            padding: 24px 12px;
            line-height: 1.6;
        }
        .container {
            max-width: 620px;
            margin: 0 auto;
            background-color: #171d26;
            border: 1px solid #2d3748;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        .header {
            background-color: #111720;
            padding: 28px 32px;
            border-bottom: 2px solid #3155f4;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .logo {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.05em;
            color: #ffffff;
            text-decoration: none;
        }
        .logo-mark {
            display: inline-block;
            width: 26px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            background-color: #d4ff00;
            color: #09090b;
            font-weight: 900;
            border-radius: 6px;
            margin-right: 8px;
        }
        .badge {
            background-color: rgba(212, 255, 0, 0.15);
            color: #d4ff00;
            border: 1px solid rgba(212, 255, 0, 0.3);
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .body-content {
            padding: 32px;
        }
        h1 {
            font-size: 22px;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 8px 0;
            letter-spacing: -0.02em;
        }
        .subtitle {
            color: #94a3b8;
            font-size: 14px;
            margin-bottom: 24px;
        }
        .section-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #3155f4;
            margin: 24px 0 10px 0;
            border-bottom: 1px solid #2d3748;
            padding-bottom: 6px;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        .data-table td {
            padding: 8px 12px;
            font-size: 13.5px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .data-label {
            width: 35%;
            color: #94a3b8;
            font-weight: 600;
        }
        .data-value {
            width: 65%;
            color: #f8fafc;
            font-weight: 500;
            word-break: break-word;
        }
        .message-box {
            background-color: #0d1117;
            border-left: 3px solid #d4ff00;
            padding: 14px 16px;
            border-radius: 6px;
            margin: 12px 0 20px 0;
            font-size: 13.5px;
            color: #e2e8f0;
            white-space: pre-wrap;
        }
        .action-button {
            display: inline-block;
            background-color: #3155f4;
            color: #ffffff !important;
            font-weight: 700;
            font-size: 14px;
            padding: 12px 24px;
            border-radius: 10px;
            text-decoration: none;
            margin: 20px 0 10px 0;
            box-shadow: 0 4px 12px rgba(49, 85, 244, 0.35);
        }
        .footer {
            background-color: #0f131a;
            padding: 20px 32px;
            border-top: 1px solid #2d3748;
            font-size: 12px;
            color: #64748b;
            text-align: center;
        }
        .footer a {
            color: #94a3b8;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Brand Header -->
        <div class="header">
            <div>
                <a href="https://getintofeed.com" class="logo">
                    <span class="logo-mark">G</span>GETINTOFEED
                </a>
            </div>
            <div>
                <span class="badge">{{ $lead->lead_code }}</span>
            </div>
        </div>

        <div class="body-content">
            <h1>⚡ New Growth Lead Captured</h1>
            <p class="subtitle">A prospective client just submitted an enquiry on <strong>GetIntoFeed.com</strong>.</p>

            <!-- Primary Contact Coordinates -->
            <div class="section-title">Client Details</div>
            <table class="data-table">
                <tr>
                    <td class="data-label">Full Name</td>
                    <td class="data-value"><strong>{{ $lead->name }}</strong></td>
                </tr>
                <tr>
                    <td class="data-label">Work Email</td>
                    <td class="data-value">
                        <a href="mailto:{{ $lead->email }}" style="color: #60a5fa; text-decoration: underline;">{{ $lead->email }}</a>
                    </td>
                </tr>
                <tr>
                    <td class="data-label">Phone / WhatsApp</td>
                    <td class="data-value">
                        @if($lead->phone && $lead->phone !== '—')
                            <a href="tel:{{ preg_replace('/[^0-9+]/', '', $lead->phone) }}" style="color: #d4ff00; text-decoration: none; font-weight: bold;">{{ $lead->phone }}</a>
                            &nbsp;
                            <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $lead->phone) }}" style="color: #22c55e; font-size: 12px; text-decoration: underline;">(Chat on WhatsApp)</a>
                        @else
                            <span style="color: #64748b;">Not provided</span>
                        @endif
                    </td>
                </tr>
                @if($lead->company && $lead->company !== 'Direct Client')
                <tr>
                    <td class="data-label">Company / Brand</td>
                    <td class="data-value">{{ $lead->company }}</td>
                </tr>
                @endif
                @if($lead->website)
                <tr>
                    <td class="data-label">Website</td>
                    <td class="data-value">
                        <a href="{{ $lead->website }}" target="_blank" style="color: #60a5fa;">{{ $lead->website }}</a>
                    </td>
                </tr>
                @endif
            </table>

            <!-- Commercial Scope & Service -->
            <div class="section-title">Project Scope</div>
            <table class="data-table">
                <tr>
                    <td class="data-label">Requested Service</td>
                    <td class="data-value"><strong style="color: #d4ff00;">{{ $lead->interested_service }}</strong></td>
                </tr>
                @if($lead->budget)
                <tr>
                    <td class="data-label">Planned Budget</td>
                    <td class="data-value">{{ $lead->budget }}</td>
                </tr>
                @endif
                <tr>
                    <td class="data-label">Form Type</td>
                    <td class="data-value">{{ $lead->form_type ?? 'Inbound Growth Modal' }}</td>
                </tr>
            </table>

            @if($lead->message)
            <div class="section-title">Client Requirements / Message</div>
            <div class="message-box">{{ $lead->message }}</div>
            @endif

            <!-- Origin & Marketing Attribution -->
            <div class="section-title">Source Attribution</div>
            <table class="data-table">
                <tr>
                    <td class="data-label">Submission Page</td>
                    <td class="data-value" style="font-size: 12px;">{{ $lead->page_url }}</td>
                </tr>
                @if($lead->referrer)
                <tr>
                    <td class="data-label">Referrer</td>
                    <td class="data-value" style="font-size: 12px;">{{ $lead->referrer }}</td>
                </tr>
                @endif
                @if($lead->utm_source || $lead->utm_campaign)
                <tr>
                    <td class="data-label">Campaign / UTM</td>
                    <td class="data-value" style="font-size: 12px;">
                        Source: <strong>{{ $lead->utm_source ?? 'organic' }}</strong>
                        @if($lead->utm_medium) | Medium: {{ $lead->utm_medium }} @endif
                        @if($lead->utm_campaign) | Campaign: {{ $lead->utm_campaign }} @endif
                    </td>
                </tr>
                @endif
                <tr>
                    <td class="data-label">Captured Timestamp</td>
                    <td class="data-value" style="font-size: 12px;">
                        {{ $lead->created_at ? $lead->created_at->timezone('Asia/Kolkata')->format('d M Y, h:i A') . ' IST' : now()->timezone('Asia/Kolkata')->format('d M Y, h:i A') . ' IST' }}
                    </td>
                </tr>
                <tr>
                    <td class="data-label">Client IP</td>
                    <td class="data-value" style="font-size: 11px; font-family: monospace;">{{ $lead->ip_address }}</td>
                </tr>
            </table>

            <div style="text-align: center; margin-top: 24px;">
                <a href="https://getintofeed.com/admin/leads" class="action-button">
                    View Lead in Filament CRM ↗
                </a>
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0 0 6px 0;">This is an automated notification from the <strong>GetIntoFeed.com</strong> Production Lead Engine.</p>
            <p style="margin: 0;">© {{ date('Y') }} GetIntoFeed Creative Studio · All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>
