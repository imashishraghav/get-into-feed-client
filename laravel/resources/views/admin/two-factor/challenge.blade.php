<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two-Factor Authentication — GetIntoFeed Admin</title>
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
            padding: 1.5rem;
        }
        .card {
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 1rem;
            max-width: 440px;
            width: 100%;
            padding: 2.25rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .logo-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-bottom: 1.75rem;
        }
        .logo-badge {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #254bdb 0%, #1d3bb8 100%);
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 15px -3px rgba(37, 75, 219, 0.4);
        }
        .shield-icon {
            width: 24px;
            height: 24px;
            color: #ffffff;
        }
        h1 {
            font-size: 1.35rem;
            font-weight: 700;
            text-align: center;
            color: #ffffff;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
        }
        p.subtitle {
            color: #94a3b8;
            font-size: 0.875rem;
            text-align: center;
            margin-bottom: 1.75rem;
            line-height: 1.5;
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
        input[type="text"] {
            width: 100%;
            padding: 0.85rem 1rem;
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 0.6rem;
            color: #ffffff;
            font-size: 1.25rem;
            letter-spacing: 0.25em;
            text-align: center;
            font-family: monospace;
            outline: none;
            transition: all 0.2s;
        }
        input[type="text"]:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
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
            transition: background 0.2s, transform 0.1s;
        }
        .btn-submit:hover {
            background: #1d3bb8;
        }
        .btn-submit:active {
            transform: scale(0.99);
        }
        .error-msg {
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #f87171;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.85rem;
            margin-bottom: 1.25rem;
        }
        .toggle-link {
            display: block;
            text-align: center;
            margin-top: 1.25rem;
            color: #38bdf8;
            font-size: 0.825rem;
            text-decoration: none;
            cursor: pointer;
        }
        .toggle-link:hover {
            text-decoration: underline;
        }
        .footer-nav {
            display: flex;
            justify-content: center;
            margin-top: 1.5rem;
            padding-top: 1.25rem;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .footer-nav a {
            color: #64748b;
            font-size: 0.8rem;
            text-decoration: none;
        }
        .footer-nav a:hover {
            color: #94a3b8;
        }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo-wrap">
            <div class="logo-badge">
                <svg class="shield-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
            </div>
        </div>

        <h1>Two-Factor Verification</h1>
        <p class="subtitle" id="subtitle-text">
            Enter the 6-digit code from your authenticator app (Google Authenticator, Microsoft Authenticator, or 1Password).
        </p>

        @if ($errors->any())
            <div class="error-msg">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('admin.two-factor.verify') }}">
            @csrf

            <div id="totp-group" class="form-group">
                <label for="code">Authentication Code</label>
                <input type="text" id="code" name="code" maxlength="6" inputmode="numeric" autocomplete="one-time-code" autofocus placeholder="123456">
            </div>

            <div id="recovery-group" class="form-group hidden">
                <label for="recovery_code">Emergency Recovery Code</label>
                <input type="text" id="recovery_code" name="recovery_code" maxlength="14" placeholder="XXXX-XXXX-XXXX" style="letter-spacing: 0.1em;">
            </div>

            <label style="display:flex; align-items:center; gap:0.55rem; margin-bottom:1.15rem; font-size:0.825rem; color:#cbd5e1; cursor:pointer; min-height:44px;">
                <input type="checkbox" name="trust_device" value="1" style="width:18px; height:18px;" />
                <span>Trust this browser for 30 days</span>
            </label>

            <button type="submit" class="btn-submit" style="min-height:44px;">Verify &amp; Continue</button>
        </form>

        <a href="javascript:void(0)" class="toggle-link" id="toggle-recovery" onclick="toggleMode()">
            Use an emergency recovery code instead
        </a>

        <div class="footer-nav">
            <form method="POST" action="/admin/logout">
                @csrf
                <button type="submit" style="background:none;border:none;color:#64748b;font-size:0.8rem;cursor:pointer;">
                    Log out of {{ auth()->user()->email }}
                </button>
            </form>
        </div>
    </div>

    <script>
        let isRecovery = false;
        function toggleMode() {
            isRecovery = !isRecovery;
            const totpGroup = document.getElementById('totp-group');
            const recoveryGroup = document.getElementById('recovery-group');
            const toggleLink = document.getElementById('toggle-recovery');
            const subtitleText = document.getElementById('subtitle-text');

            if (isRecovery) {
                totpGroup.classList.add('hidden');
                recoveryGroup.classList.remove('hidden');
                document.getElementById('code').value = '';
                document.getElementById('recovery_code').focus();
                toggleLink.textContent = 'Use standard 6-digit authenticator code instead';
                subtitleText.textContent = 'Enter one of your saved emergency recovery codes to regain access.';
            } else {
                totpGroup.classList.remove('hidden');
                recoveryGroup.classList.add('hidden');
                document.getElementById('recovery_code').value = '';
                document.getElementById('code').focus();
                toggleLink.textContent = 'Use an emergency recovery code instead';
                subtitleText.textContent = 'Enter the 6-digit code from your authenticator app.';
            }
        }
    </script>
</body>
</html>
