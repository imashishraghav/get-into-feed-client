<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two-Factor Authentication Setup — GetIntoFeed Admin</title>
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
            max-width: 520px;
            width: 100%;
            padding: 2.25rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
            margin-bottom: 1.75rem;
            text-align: center;
        }
        .badge {
            display: inline-block;
            padding: 0.35rem 0.85rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 0.75rem;
        }
        .badge-enabled {
            background: rgba(34, 197, 94, 0.15);
            color: #4ade80;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .badge-disabled {
            background: rgba(239, 68, 68, 0.15);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        h1 {
            font-size: 1.4rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }
        p.subtitle {
            color: #94a3b8;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        .step {
            margin-bottom: 1.5rem;
            padding: 1.25rem;
            background: #1e293b;
            border-radius: 0.75rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .step-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: #cbd5e1;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .step-num {
            background: #254bdb;
            color: #ffffff;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
        }
        .qr-wrap {
            display: flex;
            justify-content: center;
            margin: 1rem auto;
            padding: 0.75rem;
            background: #ffffff;
            border-radius: 0.5rem;
            width: fit-content;
            max-width: 100%;
        }
        .qr-wrap svg {
            width: 100%;
            max-width: 196px;
            height: auto;
            display: block;
        }
        @media (max-width: 480px) {
            body { padding: 1rem 0.75rem; }
            .card { padding: 1.35rem 1rem; }
            .step { padding: 1rem 0.85rem; }
        }
        .secret-box {
            background: #0b0f19;
            border: 1px dashed rgba(255, 255, 255, 0.2);
            padding: 0.75rem;
            border-radius: 0.5rem;
            text-align: center;
            font-family: monospace;
            font-size: 1.1rem;
            letter-spacing: 0.15em;
            color: #38bdf8;
            user-select: all;
            margin-top: 0.75rem;
        }
        .form-group {
            margin-bottom: 1.25rem;
        }
        label {
            display: block;
            font-size: 0.825rem;
            font-weight: 600;
            color: #cbd5e1;
            margin-bottom: 0.5rem;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 0.75rem 1rem;
            background: #0b0f19;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 0.5rem;
            color: #ffffff;
            font-size: 1.1rem;
            outline: none;
        }
        input[type="text"]:focus, input[type="password"]:focus {
            border-color: #3b82f6;
        }
        .btn-submit {
            width: 100%;
            padding: 0.85rem 1.25rem;
            background: #254bdb;
            color: #ffffff;
            border: none;
            border-radius: 0.6rem;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn-submit:hover { background: #1d3bb8; }
        .btn-danger {
            background: #dc2626;
        }
        .btn-danger:hover { background: #b91c1c; }
        .error-msg {
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #f87171;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.85rem;
            margin-bottom: 1.25rem;
        }
        .status-msg {
            background: rgba(34, 197, 94, 0.15);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #4ade80;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.85rem;
            margin-bottom: 1.25rem;
        }
        .back-link {
            display: inline-block;
            margin-top: 1.5rem;
            color: #94a3b8;
            font-size: 0.85rem;
            text-decoration: none;
        }
        .back-link:hover { color: #ffffff; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            @if ($has2fa)
                <span class="badge badge-enabled">Active (Email OTP)</span>
            @else
                <span class="badge badge-disabled">Not Configured</span>
            @endif
            <h1>Two-Factor Authentication</h1>
            <p class="subtitle">Protect your GetIntoFeed admin account with 6-digit one-time verification codes sent directly to your registered email.</p>
        </div>

        @if (session('status'))
            <div class="status-msg">{{ session('status') }}</div>
        @endif

        @if (! empty($mailError))
            <div class="error-msg">{{ $mailError }}</div>
        @endif

        @if ($errors->any())
            <div class="error-msg">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        @if (! $has2fa)
            <!-- Setup steps (Email OTP) -->
            <div class="step">
                <div class="step-title"><span class="step-num">1</span> Check your email inbox for the 6-digit OTP</div>
                <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.55;">
                    We have sent a one-time 6-digit verification code to <strong style="color:#f8fafc;">{{ $maskedEmail }}</strong>.
                    It remains valid for <strong>{{ $ttlMinutes }} minutes</strong>.
                </p>
                <form method="POST" action="{{ route('admin.two-factor.send-otp') }}" style="margin-top: 0.9rem;">
                    @csrf
                    <input type="hidden" name="purpose" value="setup">
                    <button type="submit" class="btn-submit" style="min-height:44px; background:#334155;">
                        Resend Email OTP
                    </button>
                </form>
            </div>

            <div class="step">
                <div class="step-title"><span class="step-num">2</span> Enter the 6-digit Email OTP</div>
                <form method="POST" action="{{ route('admin.two-factor.confirm') }}">
                    @csrf
                    <div class="form-group">
                        <label for="code">6-Digit Email Verification Code</label>
                        <input type="text" id="code" name="code" maxlength="6" inputmode="numeric" autocomplete="one-time-code" placeholder="123456" style="min-height:44px; text-align:center; letter-spacing:0.2em; font-family:monospace;" required>
                    </div>
                    <button type="submit" class="btn-submit" style="min-height:44px;">Verify Email OTP &amp; View Recovery Codes</button>
                </form>
            </div>
        @else
            <!-- Already enabled: status + grace info + device revocation + regenerate + disable -->
            <div class="step" style="background: rgba(34, 197, 94, 0.05); border-color: rgba(34, 197, 94, 0.2);">
                <div style="font-size: 0.95rem; font-weight: 600; color: #4ade80; margin-bottom: 0.5rem;">
                    ✓ Email Two-Factor Authentication is configured
                </div>
                <p style="font-size: 0.825rem; color: #94a3b8; line-height: 1.5;">
                    @if ($isInGracePeriod && $graceUntil)
                        Transition grace window active until <strong>{{ $graceUntil->timezone('Asia/Kolkata')->format('M d, Y H:i') }} IST</strong>. Mandatory challenge begins once grace ends.
                    @else
                        Your account receives a fresh 6-digit verification OTP at <strong>{{ $maskedEmail }}</strong> on every untrusted browser sign-in.
                    @endif
                    <br>Remaining emergency recovery codes: <strong>{{ $remainingCodesCount ?? 0 }}</strong>.
                </p>
            </div>

            <div class="step">
                <div class="step-title">Trusted Browsers &amp; Sessions</div>
                <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.9rem;">
                    Revoke all "Trust this browser for 30 days" tokens across your devices.
                </p>
                <form method="POST" action="{{ route('admin.two-factor.revoke-devices') }}">
                    @csrf
                    <button type="submit" class="btn-submit" style="min-height:44px; background:#334155;">Revoke All Trusted Devices</button>
                </form>
            </div>

            <div class="step">
                <div class="step-title">Regenerate Recovery Codes</div>
                <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.9rem;">
                    Generate 8 fresh recovery codes (previous codes become invalid immediately).
                </p>
                <form method="POST" action="{{ route('admin.two-factor.regenerate-recovery') }}">
                    @csrf
                    <div class="form-group">
                        <label for="regen_password">Confirm Current Password</label>
                        <input type="password" id="regen_password" name="password" style="min-height:44px;" required>
                    </div>
                    <button type="submit" class="btn-submit" style="min-height:44px;">Generate New Recovery Codes</button>
                </form>
            </div>

            <div class="step">
                <div class="step-title" style="color: #f87171;">Disable Two-Factor Authentication</div>
                <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 1rem;">
                    To disable 2FA, enter your current administrator password to confirm.
                </p>
                <form method="POST" action="{{ route('admin.two-factor.disable') }}">
                    @csrf
                    <div class="form-group">
                        <label for="password">Confirm Current Password</label>
                        <input type="password" id="password" name="password" style="min-height:44px;" required>
                    </div>
                    <button type="submit" class="btn-submit btn-danger" style="min-height:44px;">Disable 2FA Protection</button>
                </form>
            </div>
        @endif

        <div style="text-align: center;">
            <a href="/admin" class="back-link">← Return to Admin Dashboard</a>
        </div>
    </div>
</body>
</html>
