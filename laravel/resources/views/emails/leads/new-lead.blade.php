<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New GetIntoFeed Lead</title>
</head>
<body style="margin:0;padding:24px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="padding:22px 26px;background:#0b1426;color:#ffffff;">
            <div style="font-size:12px;letter-spacing:1px;color:#c5f82a;font-weight:700;">GETINTOFEED</div>
            <h1 style="margin:10px 0 0;font-size:22px;">New website enquiry</h1>
        </div>
        <div style="padding:24px 26px;">
            <p style="margin-top:0;">A new lead has been saved in your CRM.</p>
            <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
                @foreach ([
                    'Name' => $lead['name'] ?? 'Not provided',
                    'Phone' => $lead['phone'] ?? 'Not provided',
                    'Email' => $lead['email'] ?? 'Not provided',
                    'Interested service' => $lead['service'] ?? 'Not specified',
                    'Lead source' => $lead['source'] ?? 'Website',
                    'Received at' => $lead['created_at'] ?? now()->format('d M Y, h:i A'),
                ] as $label => $value)
                    <tr>
                        <td style="width:38%;padding:11px 8px;border-bottom:1px solid #edf0f2;color:#64748b;vertical-align:top;">{{ $label }}</td>
                        <td style="padding:11px 8px;border-bottom:1px solid #edf0f2;font-weight:600;word-break:break-word;">{{ $value }}</td>
                    </tr>
                @endforeach
            </table>
            <h2 style="font-size:15px;margin:22px 0 8px;">Message</h2>
            <div style="padding:14px;background:#f8fafc;border-radius:8px;white-space:pre-wrap;line-height:1.5;">{{ $lead['message'] ?? 'No message' }}</div>
            <p style="margin:22px 0 0;color:#64748b;font-size:12px;">This is an automated notification from getintofeed.com. The original lead remains stored in your CRM.</p>
        </div>
    </div>
</body>
</html>
