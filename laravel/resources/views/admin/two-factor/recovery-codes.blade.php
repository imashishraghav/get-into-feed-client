<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recovery codes — GetIntoFeed</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f8fafc;
            color: #0f172a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
        }
        .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            max-width: 500px;
            width: 100%;
            padding: 34px 32px 28px;
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04);
        }
        .brand-badge {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            background: #0f172a;
            color: #a3e635;
            font-weight: 800;
            font-size: 1.25rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        h1 { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        p.subtitle { color: #475569; font-size: 0.9rem; line-height: 1.5; margin-bottom: 18px; }
        .warning-box {
            background: #fefce8;
            border: 1px solid #fde68a;
            color: #854d0e;
            padding: 12px 14px;
            border-radius: 10px;
            font-size: 0.84rem;
            line-height: 1.45;
            margin-bottom: 18px;
        }
        .codes-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 16px;
        }
        .code-item {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.92rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            color: #0f172a;
            text-align: center;
            padding: 10px 8px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
        }
        .actions {
            display: flex;
            gap: 10px;
            margin-bottom: 18px;
        }
        .btn-outline {
            flex: 1;
            min-height: 44px;
            background: #ffffff;
            color: #0f172a;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .btn-outline:hover { background: #f8fafc; }
        .btn-primary {
            width: 100%;
            min-height: 46px;
            background: #1d4ed8;
            color: #ffffff;
            border: none;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .btn-primary:hover { background: #1e40af; }
        .check-card {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px 14px;
            border-radius: 10px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            font-size: 0.84rem;
            color: #334155;
            cursor: pointer;
        }
        .check-card input { width: 18px; height: 18px; margin-top: 2px; accent-color: #2563eb; }
        .alert-error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #b91c1c;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 0.84rem;
            margin-bottom: 16px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="brand-badge" aria-hidden="true">G</div>

        <h1>Recovery codes</h1>
        <p class="subtitle">Each code works once. Codes are stored hashed and are shown only when you generate them.</p>

        @if ($errors->any())
            <div class="alert-error">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        <div class="warning-box">
            Save these emergency codes somewhere safe before closing this page. They unlock your account if you cannot access your email.
        </div>

        <div class="codes-grid" id="codes-box">
            @foreach ($codes as $code)
                <div class="code-item">{{ $code }}</div>
            @endforeach
        </div>

        <div class="actions">
            <button type="button" class="btn-outline" onclick="copyCodes()">Copy</button>
            <button type="button" class="btn-outline" onclick="downloadCodes()">Download .txt</button>
        </div>

        @if (! empty($requiresSaveConfirmation))
            <form method="POST" action="{{ route('admin.two-factor.confirm-recovery') }}" style="display:flex; flex-direction:column; gap:12px;">
                @csrf
                <label class="check-card">
                    <input type="checkbox" name="confirmed_saved" value="1" required>
                    <span>I have securely saved these emergency recovery codes and understand login stays unlocked until confirmed.</span>
                </label>

                @if (($graceDaysDefault ?? 7) > 0)
                    <label class="check-card" style="background:#ffffff;">
                        <input type="checkbox" name="skip_grace_period" value="1">
                        <span>Enforce Email OTP challenge immediately (skip {{ $graceDaysDefault }}-day transition grace period).</span>
                    </label>
                @endif

                <button type="submit" class="btn-primary">Confirm saved &amp; activate 2FA</button>
            </form>
        @else
            <a href="/admin/security-settings" class="btn-primary">Return to Security settings</a>
        @endif
    </div>

    <script>
        function getFormattedRecoveryPayload() {
            const codes = @json($codes).join("\n");
            return "GetIntoFeed Admin Emergency Recovery Codes\nGenerated: " + new Date().toISOString() + "\n\n" + codes + "\n";
        }
        function copyCodes() {
            navigator.clipboard.writeText(getFormattedRecoveryPayload()).then(() => {
                alert("Recovery codes copied to clipboard.");
            });
        }
        function downloadCodes() {
            const blob = new Blob([getFormattedRecoveryPayload()], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'getintofeed-2fa-recovery-codes.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>
