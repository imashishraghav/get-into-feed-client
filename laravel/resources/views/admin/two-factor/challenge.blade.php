<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two-step verification — GetIntoFeed</title>
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
            padding: 36px 32px 30px;
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
            letter-spacing: -0.02em;
        }
        h1 {
            font-size: 1.45rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
            letter-spacing: -0.02em;
        }
        p.subtitle {
            color: #475569;
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .otp-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            margin-bottom: 18px;
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
        .recovery-input {
            width: 100%;
            min-height: 48px;
            padding: 12px 14px;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            font-size: 1rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #0f172a;
            outline: none;
            margin-bottom: 18px;
        }
        .recovery-input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
        }
        .checkbox-row {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.875rem;
            color: #1e293b;
            margin-bottom: 20px;
            min-height: 44px;
            cursor: pointer;
        }
        .checkbox-row input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #2563eb;
            cursor: pointer;
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
            transition: background 0.15s ease;
        }
        .btn-primary:hover {
            background: #1e40af;
        }
        .footer-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: 18px;
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
        .link-btn:hover { color: #1d4ed8; }
        .attempts-text {
            color: #64748b;
            font-size: 0.85rem;
        }
        .alert {
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 0.84rem;
            margin-bottom: 18px;
            line-height: 1.45;
        }
        .alert-error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #b91c1c;
        }
        .alert-success {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #15803d;
        }
        .sub-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 18px;
            padding-top: 16px;
            border-top: 1px solid #f1f5f9;
            font-size: 0.8rem;
        }
        .hidden { display: none; }
        @media (max-width: 420px) {
            .card { padding: 28px 20px 24px; }
            .otp-grid { gap: 6px; }
            .otp-box { height: 48px; font-size: 1.15rem; }
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="brand-badge" aria-hidden="true">G</div>

        <h1>Two-step verification</h1>
        <p class="subtitle" id="subtitle-text">
            Enter the 6-digit code sent to <strong>{{ $maskedEmail }}</strong>.
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

        <form method="POST" action="{{ route('admin.two-factor.verify') }}" id="verify-form">
            @csrf
            <input type="hidden" id="code" name="code" value="">

            <div id="otp-group">
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
            </div>

            <div id="recovery-group" class="hidden">
                <input
                    type="text"
                    id="recovery_code"
                    name="recovery_code"
                    class="recovery-input"
                    maxlength="14"
                    placeholder="XXXX-XXXX-XXXX"
                >
            </div>

            <label class="checkbox-row">
                <input type="checkbox" name="trust_device" value="1">
                <span>Remember this device for 30 days</span>
            </label>

            <button type="submit" class="btn-primary">Verify and sign in</button>
        </form>

        <div class="footer-row">
            <button type="button" class="link-btn" id="toggle-recovery" onclick="toggleMode()">
                Use a recovery code
            </button>
            <span class="attempts-text">{{ $attemptsRemaining ?? 5 }} attempts left</span>
        </div>

        <div class="sub-actions">
            <form method="POST" action="{{ route('admin.two-factor.send-otp') }}">
                @csrf
                <input type="hidden" name="purpose" value="login">
                <button type="submit" class="link-btn" style="font-size:0.8rem; color:#475569;">
                    Resend email code
                </button>
            </form>

            <form method="POST" action="/admin/logout">
                @csrf
                <button type="submit" class="link-btn" style="font-size:0.8rem; color:#64748b; text-decoration:none;">
                    Sign out ({{ auth()->user()->email }})
                </button>
            </form>
        </div>
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
                        const nextIdx = Math.min(5, idx + digits.length);
                        boxes[nextIdx].focus();
                        return;
                    }
                    box.value = digits;
                    syncOtp();
                    if (idx < boxes.length - 1) {
                        boxes[idx + 1].focus();
                    }
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

        let isRecovery = false;
        function toggleMode() {
            isRecovery = !isRecovery;
            const otpGroup = document.getElementById('otp-group');
            const recoveryGroup = document.getElementById('recovery-group');
            const toggleLink = document.getElementById('toggle-recovery');
            const subtitleText = document.getElementById('subtitle-text');

            if (isRecovery) {
                otpGroup.classList.add('hidden');
                recoveryGroup.classList.remove('hidden');
                document.getElementById('code').value = '';
                document.querySelectorAll('.otp-box').forEach((b) => { b.value = ''; });
                document.getElementById('recovery_code').focus();
                toggleLink.textContent = 'Use email OTP code';
                subtitleText.textContent = 'Enter one of your unused emergency recovery codes.';
            } else {
                otpGroup.classList.remove('hidden');
                recoveryGroup.classList.add('hidden');
                document.getElementById('recovery_code').value = '';
                document.querySelector('.otp-box').focus();
                toggleLink.textContent = 'Use a recovery code';
                subtitleText.innerHTML = 'Enter the 6-digit code sent to <strong>{{ $maskedEmail }}</strong>.';
            }
        }
    </script>
</body>
</html>
