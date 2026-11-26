<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Recovery Codes — GetIntoFeed Admin</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background: #080c14;
            color: #f1f5f9;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1.5rem;
        }
        .card {
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 1rem;
            max-width: 500px;
            width: 100%;
            padding: 2.25rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
            margin-bottom: 1.5rem;
            text-align: center;
        }
        .icon-check {
            width: 48px;
            height: 48px;
            background: rgba(34, 197, 94, 0.2);
            color: #4ade80;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
        }
        h1 {
            font-size: 1.35rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }
        p.subtitle {
            color: #94a3b8;
            font-size: 0.85rem;
            line-height: 1.5;
        }
        .warning-box {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.3);
            color: #fbbf24;
            padding: 0.85rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.825rem;
            line-height: 1.4;
            margin: 1.25rem 0;
        }
        .codes-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            background: #0b0f19;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.25rem;
            border-radius: 0.75rem;
            margin-bottom: 1.5rem;
        }
        .code-item {
            font-family: monospace;
            font-size: 0.95rem;
            letter-spacing: 0.05em;
            color: #38bdf8;
            text-align: center;
            padding: 0.4rem;
            background: #1e293b;
            border-radius: 0.35rem;
        }
        .actions {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1.25rem;
        }
        .btn {
            flex: 1;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            transition: all 0.2s;
        }
        .btn-primary {
            background: #254bdb;
            color: #ffffff;
            border: none;
        }
        .btn-primary:hover { background: #1d3bb8; }
        .btn-secondary {
            background: #1e293b;
            color: #cbd5e1;
            border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .btn-secondary:hover { background: #334155; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <div class="icon-check">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
            </div>
            <h1>Two-Factor Auth Activated!</h1>
            <p class="subtitle">Save these emergency recovery codes in a secure place (like 1Password or Bitwarden).</p>
        </div>

        @if ($errors->any())
            <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem;">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        <div class="warning-box">
            <strong>⚠️ Important:</strong> Each recovery code can only be used ONCE if you lose access to your authenticator app. They will not be displayed again.
        </div>

        <div class="codes-grid" id="codes-box">
            @foreach ($codes as $code)
                <div class="code-item">{{ $code }}</div>
            @endforeach
        </div>

        <div class="actions">
            <button type="button" class="btn btn-secondary" style="min-height:44px;" onclick="copyCodes()">Copy All Codes</button>
            <button type="button" class="btn btn-secondary" style="min-height:44px;" onclick="downloadCodes()">Download .TXT</button>
        </div>

        @if (! empty($requiresSaveConfirmation))
            <form method="POST" action="{{ route('admin.two-factor.confirm-recovery') }}" style="display:flex; flex-direction:column; gap:0.85rem;">
                @csrf
                <label style="display:flex; align-items:flex-start; gap:0.65rem; padding:0.75rem; border-radius:0.5rem; background:#1e293b; font-size:0.84rem; color:#e2e8f0; cursor:pointer;">
                    <input type="checkbox" name="confirmed_saved" value="1" required style="width:18px; height:18px; margin-top:2px;" />
                    <span>I have securely saved these emergency recovery codes and understand login stays unlocked until confirmed.</span>
                </label>

                @if (($graceDaysDefault ?? 7) > 0)
                    <label style="display:flex; align-items:flex-start; gap:0.65rem; padding:0.65rem 0.75rem; border-radius:0.5rem; background:#0b0f19; border:1px solid rgba(255,255,255,0.08); font-size:0.8rem; color:#94a3b8; cursor:pointer;">
                        <input type="checkbox" name="skip_grace_period" value="1" style="width:18px; height:18px; margin-top:2px;" />
                        <span>Enforce Email OTP challenge immediately (skip {{ $graceDaysDefault }}-day transition grace period).</span>
                    </label>
                @endif

                <button type="submit" class="btn btn-primary" style="min-height:44px;">Confirm Saved &amp; Activate 2FA</button>
            </form>
        @else
            <a href="/admin/two-factor/setup" class="btn btn-primary" style="display:block; min-height:44px;">Return to Security Settings</a>
        @endif
    </div>

    <script>
        function getFormattedRecoveryPayload() {
            const codes = @json($codes).join("\n");
            return "GetIntoFeed Admin Emergency Recovery Codes\nGenerated: " + new Date().toISOString() + "\n\n" + codes + "\n";
        }
        function copyCodes() {
            navigator.clipboard.writeText(getFormattedRecoveryPayload()).then(() => {
                alert("Recovery codes copied to clipboard!");
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
