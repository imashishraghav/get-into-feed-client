<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two-step verification setup — GetIntoFeed</title>
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
            max-width: 480px;
            width: 100%;
            padding: 34px 32px 28px;
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04);
        }
        .top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
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
        }
        .pill {
            display: inline-flex;
            align-items: center;
            padding: 4px 11px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .pill-on { background: #dcfce7; color: #166534; }
        .pill-off { background: #f1f5f9; color: #475569; }
        h1 {
            font-size: 1.4rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
            letter-spacing: -0.02em;
        }
        p.subtitle {
            color: #475569;
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 22px;
        }
        .otp-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        .otp-box {
            width: 100%;
            height: 54px;
            min-height: 44px;
            text-align: center;
            font-size: 1.35rem;
            font-weight: 600;
            color: #0f172a;
            background: #ffffff;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            outline: none;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .otp-box:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
        }
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
        }
        .btn-primary:hover { background: #1e40af; }
        .btn-outline {
            width: 100%;
            min-height: 44px;
            background: #ffffff;
            color: #0f172a;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            padding: 0 14px;
        }
        .btn-outline:hover { background: #f8fafc; }
        .btn-danger-outline {
            width: 100%;
            min-height: 44px;
            background: #ffffff;
            color: #dc2626;
            border: 1px solid #fca5a5;
            border-radius: 10px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
        }
        .btn-danger-outline:hover { background: #fef2f2; }
        .panel-box {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 14px;
            background: #ffffff;
        }
        .panel-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 4px;
        }
        .panel-desc {
            font-size: 0.825rem;
            color: #64748b;
            line-height: 1.45;
            margin-bottom: 12px;
        }
        input[type="password"] {
            width: 100%;
            min-height: 44px;
            padding: 10px 12px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.9rem;
            color: #0f172a;
            margin-bottom: 10px;
            outline: none;
        }
        input[type="password"]:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
        }
        .footer-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: 16px;
            font-size: 0.85rem;
        }
        .link-btn {
            background: none;
            border: none;
            padding: 0;
            color: #2563eb;
            font-size: 0.85rem;
            font-weight: 500;
            text-decoration: underline;
            cursor: pointer;
        }
        .muted-meta { color: #64748b; font-size: 0.85rem; }
        .alert {
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 0.84rem;
            margin-bottom: 16px;
            line-height: 1.45;
        }
        .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
        .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .back-row {
            margin-top: 18px;
            padding-top: 14px;
            border-top: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            font-size: 0.84rem;
        }
        .back-row a { color: #475569; text-decoration: none; }
        .back-row a:hover { color: #0f172a; }
        @media (max-width: 420px) {
            .card { padding: 26px 18px 22px; }
            .otp-grid { gap: 6px; }
            .otp-box { height: 48px; font-size: 1.15rem; }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="top-bar">
            <div class="brand-badge" aria-hidden="true">G</div>
            @if ($has2fa)
                <span class="pill pill-on">On</span>
            @else
                <span class="pill pill-off">Not enabled</span>
            @endif
        </div>

        <h1>{{ $has2fa ? 'Two-step verification' : 'Verify your email' }}</h1>
        <p class="subtitle">
            @if ($has2fa)
                Email OTP protection is active for <strong>{{ $maskedEmail }}</strong>.
            @else
                Enter the 6-digit code sent to <strong>{{ $maskedEmail }}</strong> to enable Email OTP verification.
            @endif
        </p>

        @if (session('status'))
            <div class="alert alert-success">{{ session('status') }}</div>
        @endif

        @if (! empty($mailError))
            <div class="alert alert-error">{{ $mailError }}</div>
        @endif

        @if ($errors->any())
            <div class="alert alert-error">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        @if (! $has2fa)
            <form method="POST" action="{{ route('admin.two-factor.confirm') }}">
                @csrf
                <input type="hidden" id="code" name="code" value="">

                <div class="otp-grid" role="group" aria-label="6-digit email verification code">
                    @for ($i = 0; $i < 6; $i++)
                        <input
                            type="text"
                            class="otp-box"
                            maxlength="1"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            autocomplete="{{ $i === 0 ? 'one-time-code' : 'off' }}"
                            aria-label="Digit {{ $i + 1 }}"
                            {{ $i === 0 ? 'autofocus' : '' }}
                        >
                    @endfor
                </div>

                <button type="submit" class="btn-primary">Verify email OTP &amp; continue</button>
            </form>

            <div class="footer-row">
                <form method="POST" action="{{ route('admin.two-factor.send-otp') }}">
                    @csrf
                    <input type="hidden" name="purpose" value="setup">
                    <button type="submit" class="link-btn">Resend code</button>
                </form>
                <span class="muted-meta">Expires in {{ $ttlMinutes }} min</span>
            </div>
        @else
            <div class="panel-box">
                <div class="panel-title">Status &amp; recovery codes</div>
                <div class="panel-desc" style="margin-bottom:0;">
                    @if ($isInGracePeriod && $graceUntil)
                        Transition grace ends <strong>{{ $graceUntil->timezone('Asia/Kolkata')->format('M d, Y H:i') }} IST</strong>.
                    @else
                        Required on every new untrusted sign-in.
                    @endif
                    <br>{{ $remainingCodesCount ?? 0 }} of 8 unused emergency recovery codes.
                </div>
            </div>

            <div class="panel-box">
                <div class="panel-title">Trusted devices</div>
                <div class="panel-desc">Revoke all "Remember this device for 30 days" tokens across your browsers.</div>
                <form method="POST" action="{{ route('admin.two-factor.revoke-devices') }}">
                    @csrf
                    <button type="submit" class="btn-outline">Revoke trusted devices</button>
                </form>
            </div>

            <div class="panel-box">
                <div class="panel-title">Regenerate recovery codes</div>
                <div class="panel-desc">Generates 8 fresh single-use codes and invalidates older codes.</div>
                <form method="POST" action="{{ route('admin.two-factor.regenerate-recovery') }}">
                    @csrf
                    <input type="password" name="password" placeholder="Current password" required>
                    <button type="submit" class="btn-outline">Regenerate recovery codes</button>
                </form>
            </div>

            <div class="panel-box">
                <div class="panel-title" style="color:#b91c1c;">Disable two-step verification</div>
                <div class="panel-desc">Enter your current administrator password to turn off Email OTP protection.</div>
                <form method="POST" action="{{ route('admin.two-factor.disable') }}">
                    @csrf
                    <input type="password" name="password" placeholder="Current password" required>
                    <button type="submit" class="btn-danger-outline">Disable two-step verification</button>
                </form>
            </div>
        @endif

        <div class="back-row">
            <a href="/admin">← Return to Admin</a>
            <a href="/admin/security-settings">Security settings →</a>
        </div>
    </div>

    @if (! $has2fa)
        <script>
            (function () {
                const boxes = Array.from(document.querySelectorAll('.otp-box'));
                const hiddenInput = document.getElementById('code');

                function syncOtp() {
                    hiddenInput.value = boxes.map((box) => box.value.replace(/\D/g, '')).join('');
                }

                boxes.forEach((box, idx) => {
                    box.addEventListener('input', (e) => {
                        const digits = (e.target.value || '').replace(/\D/g, '');
                        if (!digits) {
                            box.value = '';
                            syncOtp();
                            return;
                        }
                        if (digits.length > 1) {
                            digits.slice(0, 6).split('').forEach((d, offset) => {
                                if (boxes[idx + offset]) boxes[idx + offset].value = d;
                            });
                            syncOtp();
                            boxes[Math.min(5, idx + digits.length)].focus();
                            return;
                        }
                        box.value = digits;
                        syncOtp();
                        if (idx < boxes.length - 1) boxes[idx + 1].focus();
                    });

                    box.addEventListener('keydown', (e) => {
                        if (e.key === 'Backspace' && !box.value && idx > 0) {
                            boxes[idx - 1].focus();
                            boxes[idx - 1].value = '';
                            syncOtp();
                        } else if (e.key === 'ArrowLeft' && idx > 0) {
                            boxes[idx - 1].focus();
                        } else if (e.key === 'ArrowRight' && idx < boxes.length - 1) {
                            boxes[idx + 1].focus();
                        }
                    });

                    box.addEventListener('paste', (e) => {
                        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
                        if (!pasted) return;
                        e.preventDefault();
                        pasted.slice(0, 6).split('').forEach((d, offset) => {
                            if (boxes[offset]) boxes[offset].value = d;
                        });
                        syncOtp();
                        boxes[Math.min(5, pasted.length - 1)].focus();
                    });
                });
            })();
        </script>
    @endif
</body>
</html>
