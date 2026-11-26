<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Identity — GetIntoFeed Admin</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
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
            padding: 1.5rem;
        }
        .card {
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 1rem;
            max-width: 440px;
            width: 100%;
            padding: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        h1 { font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem; }
        p.subtitle { color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; font-size: 0.825rem; font-weight: 600; color: #cbd5e1; margin-bottom: 0.45rem; }
        input {
            width: 100%;
            min-height: 44px;
            padding: 0.7rem 0.9rem;
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 0.6rem;
            color: #ffffff;
            font-size: 1rem;
        }
        .btn-submit {
            width: 100%;
            min-height: 44px;
            padding: 0.75rem 1.25rem;
            background: #254bdb;
            color: #ffffff;
            font-weight: 700;
            border: none;
            border-radius: 0.6rem;
            cursor: pointer;
            margin-top: 0.5rem;
        }
        .error-msg {
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #f87171;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.85rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Confirm Your Password</h1>
        <p class="subtitle">Please verify your identity before completing this sensitive security or data export action.</p>

        @if (session('status'))
            <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem;">
                {{ session('status') }}
            </div>
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

        <form method="POST" action="{{ route('admin.two-factor.reauth.verify') }}">
            @csrf
            <div class="form-group">
                <label for="password">Current Password</label>
                <input type="password" id="password" name="password" required autofocus autocomplete="current-password">
            </div>

            @if ($requiresOtp)
                <div class="form-group">
                    <label for="code">6-Digit Email OTP (sent to {{ $maskedEmail }})</label>
                    <input type="text" id="code" name="code" maxlength="6" inputmode="numeric" autocomplete="one-time-code" placeholder="123456" required>
                </div>
            @endif

            <button type="submit" class="btn-submit">Confirm Identity</button>
        </form>

        @if ($requiresOtp)
            <form method="POST" action="{{ route('admin.two-factor.send-otp') }}" style="margin-top: 0.75rem;">
                @csrf
                <input type="hidden" name="purpose" value="reauth">
                <button type="submit" class="btn-submit" style="background:#1e293b; border:1px solid rgba(255,255,255,0.12); color:#cbd5e1;">
                    Resend Email OTP
                </button>
            </form>
        @endif
    </div>
</body>
</html>
