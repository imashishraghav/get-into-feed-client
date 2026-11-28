<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Password — GetIntoFeed</title>
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
            max-width: 440px;
            width: 100%;
            padding: 36px 32px 28px;
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
            margin-bottom: 22px;
        }
        h1 { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        p.subtitle { color: #475569; font-size: 0.9rem; line-height: 1.5; margin-bottom: 22px; }
        label { display: block; font-size: 0.84rem; font-weight: 600; color: #334155; margin-bottom: 6px; }
        input[type="password"] {
            width: 100%;
            min-height: 46px;
            padding: 10px 14px;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            font-size: 0.95rem;
            color: #0f172a;
            margin-bottom: 18px;
            outline: none;
        }
        input[type="password"]:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
        }
        .otp-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        .otp-box {
            width: 100%;
            height: 52px;
            min-height: 44px;
            text-align: center;
            font-size: 1.3rem;
            font-weight: 600;
            color: #0f172a;
            background: #ffffff;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            outline: none;
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
        .alert { padding: 10px 14px; border-radius: 10px; font-size: 0.84rem; margin-bottom: 16px; }
        .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
        .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .link-btn {
            background: none;
            border: none;
            color: #2563eb;
            font-size: 0.84rem;
            text-decoration: underline;
            cursor: pointer;
        }
        @media (max-width: 420px) {
            .card { padding: 26px 18px 22px; }
            .otp-grid { gap: 6px; }
            .otp-box { height: 48px; font-size: 1.15rem; }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="brand-badge" aria-hidden="true">G</div>

        <h1>Confirm Your Password</h1>
        <p class="subtitle">Please verify your identity before completing this sensitive security or data export action.</p>

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

        <form method="POST" action="{{ route('admin.two-factor.reauth.verify') }}">
            @csrf
            <label for="password">Current password</label>
            <input type="password" id="password" name="password" required autofocus autocomplete="current-password">

            @if ($requiresOtp)
                <input type="hidden" id="code" name="code" value="">
                <label>6-Digit Email OTP (sent to {{ $maskedEmail }})</label>
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
                        >
                    @endfor
                </div>
            @endif

            <button type="submit" class="btn-primary">Confirm identity</button>
        </form>

        @if ($requiresOtp)
            <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
                <form method="POST" action="{{ route('admin.two-factor.send-otp') }}">
                    @csrf
                    <input type="hidden" name="purpose" value="reauth">
                    <button type="submit" class="link-btn">Resend email code</button>
                </form>
                <span style="font-size:0.84rem; color:#64748b;">Expires in {{ $ttlMinutes ?? 10 }} min</span>
            </div>

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
    </div>
</body>
</html>
