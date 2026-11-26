<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Notifications\NewDeviceLoginAlert;
use App\Services\TwoFactorAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class TwoFactorAuthController extends Controller
{
    public function __construct(
        protected TwoFactorAuthService $tfaService
    ) {}

    public function challenge()
    {
        $user = auth()->user();
        if (! $user || ! $user->requiresTwoFactorChallenge()) {
            return redirect('/admin');
        }

        if (session('auth.two_factor_verified')) {
            return redirect('/admin');
        }

        return view('admin.two-factor.challenge');
    }

    public function verify(Request $request)
    {
        $user = $request->user();
        if (! $user || ! $user->hasTwoFactorEnabled()) {
            return redirect('/admin');
        }

        $throttleKey = 'mfa-verify:'.$user->id.'|'.$request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'code' => ["Too many failed authentication attempts. Please try again in {$seconds} seconds."],
            ]);
        }

        $code = trim((string) $request->input('code', ''));
        $recoveryCode = trim((string) $request->input('recovery_code', ''));
        $trustDevice = $request->boolean('trust_device');

        if ($recoveryCode !== '') {
            if ($this->tfaService->verifyAndConsumeRecoveryCode($user, $recoveryCode)) {
                RateLimiter::clear($throttleKey);
                session(['auth.two_factor_verified' => true]);

                return $this->completeVerificationRedirect($user, $request, $trustDevice);
            }

            RateLimiter::hit($throttleKey, 60);
            throw ValidationException::withMessages([
                'recovery_code' => ['The provided recovery code is invalid or has already been used.'],
            ]);
        }

        $secret = $user->getTwoFactorSecret();
        if ($secret && $this->tfaService->verifyCodeForUser($user, $secret, $code)) {
            RateLimiter::clear($throttleKey);
            session([
                'auth.two_factor_verified' => true,
                'auth.reauthenticated_at' => time(),
            ]);

            AuditLog::log('MFA_LOGIN_SUCCESS', $user, null, [
                'user_email' => $user->email,
                'ip' => $request->ip(),
                'trusted_device_issued' => $trustDevice,
            ]);

            try {
                $user->notify(new NewDeviceLoginAlert((string) $request->ip(), $trustDevice));
            } catch (\Throwable) {
                // Do not block login when mail transport is not configured.
            }

            return $this->completeVerificationRedirect($user, $request, $trustDevice);
        }

        RateLimiter::hit($throttleKey, 60);

        AuditLog::log('MFA_LOGIN_FAILED', $user, null, [
            'user_email' => $user->email,
            'ip' => $request->ip(),
            'attempted_length' => strlen($code),
        ]);

        throw ValidationException::withMessages([
            'code' => ['The provided 6-digit authenticator code is incorrect or expired.'],
        ]);
    }

    private function completeVerificationRedirect($user, Request $request, bool $trustDevice)
    {
        if ($trustDevice) {
            $days = max(1, (int) config('cms.two_factor.trust_device_days', 30));
            $token = $this->tfaService->createTrustedDeviceToken($user, $days);
            $cookieName = (string) config('cms.two_factor.cookie_name', 'gif_mfa_trust');

            Cookie::queue(cookie(
                name: $cookieName,
                value: $token,
                minutes: $days * 24 * 60,
                path: '/admin',
                domain: config('session.domain'),
                secure: $request->isSecure() || app()->isProduction(),
                httpOnly: true,
                raw: false,
                sameSite: 'lax'
            ));
        }

        return redirect()->intended('/admin');
    }

    public function setup(Request $request)
    {
        $user = $request->user();
        $has2fa = $user->hasTwoFactorEnabled();
        $secret = null;
        $qrUri = null;
        $qrCodeSvg = null;

        if (! $has2fa) {
            $secret = session('mfa_pending_secret') ?: $this->tfaService->generateSecretKey();
            session(['mfa_pending_secret' => $secret]);
            $issuer = config('app.name', 'GetIntoFeed Admin');
            $qrUri = $this->tfaService->getQrCodeUrl($issuer, $user->email, $secret);
            $qrCodeSvg = $this->tfaService->getQrCodeSvg($issuer, $user->email, $secret);
        }

        return view('admin.two-factor.setup', [
            'has2fa' => $has2fa,
            'secret' => $secret,
            'qrUri' => $qrUri,
            'qrCodeSvg' => $qrCodeSvg,
            'user' => $user,
            'graceUntil' => $user->two_factor_grace_until,
            'isInGracePeriod' => $user->isInTwoFactorGracePeriod(),
            'recoveryConfirmed' => $user->hasConfirmedRecoveryCodes(),
            'remainingCodesCount' => $user->getRemainingRecoveryCodesCount(),
            'graceDaysDefault' => (int) config('cms.two_factor.grace_days', 7),
        ]);
    }

    /**
     * Step 1 of activation: Verify first TOTP code and display recovery codes for explicit save confirmation.
     * Does NOT enforce mandatory challenge until recovery codes are explicitly confirmed saved.
     */
    public function confirm(Request $request)
    {
        $user = $request->user();
        $secret = session('mfa_pending_secret');

        if (! $secret) {
            return redirect()->route('admin.two-factor.setup')
                ->withErrors(['code' => 'MFA setup session expired. Please scan the new QR code cleanly.']);
        }

        $code = trim((string) $request->input('code', ''));
        if (! $this->tfaService->verifyCode($secret, $code)) {
            return back()->withErrors(['code' => 'Invalid code. Enter the 6-digit code shown in your authenticator app.']);
        }

        $recoveryCodes = $this->tfaService->generateRecoveryCodes(8);
        session([
            'mfa_pending_enrollment' => [
                'secret' => $secret,
                'hashed' => $recoveryCodes['hashed'],
            ],
        ]);
        session()->forget('mfa_pending_secret');

        return view('admin.two-factor.recovery-codes', [
            'codes' => $recoveryCodes['plain'],
            'requiresSaveConfirmation' => true,
            'graceDaysDefault' => (int) config('cms.two_factor.grace_days', 7),
        ]);
    }

    /**
     * Step 2 of activation: Complete enrollment only after user confirms recovery codes are saved.
     */
    public function confirmRecoveryCodes(Request $request)
    {
        $request->validate([
            'confirmed_saved' => ['required', 'accepted'],
            'skip_grace_period' => ['nullable', 'boolean'],
        ], [
            'confirmed_saved.accepted' => 'Please confirm that you have safely saved your emergency recovery codes before activating 2FA.',
        ]);

        $user = $request->user();
        $pending = session('mfa_pending_enrollment');

        if (! is_array($pending) || empty($pending['secret']) || empty($pending['hashed'])) {
            return redirect()->route('admin.two-factor.setup')
                ->withErrors(['code' => 'No pending 2FA setup found. Please verify your authenticator app again.']);
        }

        $graceDays = $request->boolean('skip_grace_period') ? 0 : (int) config('cms.two_factor.grace_days', 7);
        $this->tfaService->enableTwoFactor(
            $user,
            (string) $pending['secret'],
            ['hashed' => $pending['hashed']],
            recoverySavedConfirmed: true,
            graceDays: $graceDays
        );

        session()->forget('mfa_pending_enrollment');
        session(['auth.two_factor_verified' => true]);

        AuditLog::log('MFA_RECOVERY_CODES_CONFIRMED', $user, null, [
            'user_email' => $user->email,
            'grace_days' => $graceDays,
        ]);

        $statusMsg = $graceDays > 0
            ? "Two-Factor Authentication activated cleanly with a {$graceDays}-day transition grace period."
            : 'Two-Factor Authentication is now active and enforced on future logins.';

        return redirect()->route('admin.two-factor.setup')->with('status', $statusMsg);
    }

    public function regenerateRecoveryCodes(Request $request)
    {
        $user = $request->user();
        if (! $user->hasTwoFactorEnabled()) {
            return redirect()->route('admin.two-factor.setup');
        }

        if (! Hash::check((string) $request->input('password', ''), $user->password)) {
            return back()->withErrors(['password' => 'Incorrect password. Cannot regenerate recovery codes.']);
        }

        $codes = $this->tfaService->regenerateRecoveryCodes($user);

        return view('admin.two-factor.recovery-codes', [
            'codes' => $codes['plain'],
            'requiresSaveConfirmation' => false,
            'graceDaysDefault' => 0,
        ]);
    }

    public function revokeTrustedDevices(Request $request)
    {
        $user = $request->user();
        $this->tfaService->revokeTrustedDevices($user);

        $cookieName = (string) config('cms.two_factor.cookie_name', 'gif_mfa_trust');
        Cookie::queue(Cookie::forget($cookieName, '/admin', config('session.domain')));

        return redirect()->route('admin.two-factor.setup')
            ->with('status', 'All trusted browser sessions for Two-Factor Authentication have been revoked.');
    }

    public function disable(Request $request)
    {
        $user = $request->user();
        $password = (string) $request->input('password', '');

        if (! Hash::check($password, $user->password)) {
            return back()->withErrors(['password' => 'Incorrect password. Cannot disable 2FA.']);
        }

        $this->tfaService->disableTwoFactor($user, $user);
        session()->forget('auth.two_factor_verified');
        $cookieName = (string) config('cms.two_factor.cookie_name', 'gif_mfa_trust');
        Cookie::queue(Cookie::forget($cookieName, '/admin', config('session.domain')));

        return redirect()->route('admin.two-factor.setup')->with('status', 'Two-Factor Authentication has been successfully disabled.');
    }

    public function reauth(Request $request)
    {
        $user = $request->user();

        return view('admin.two-factor.reauth', [
            'requiresTotp' => $user->hasTwoFactorEnabled(),
        ]);
    }

    public function verifyReauth(Request $request)
    {
        $user = $request->user();
        $password = (string) $request->input('password', '');

        if (! Hash::check($password, $user->password)) {
            return back()->withErrors(['password' => 'The password you entered is incorrect.']);
        }

        if ($user->hasTwoFactorEnabled()) {
            $code = trim((string) $request->input('code', ''));
            $secret = (string) $user->getTwoFactorSecret();
            if (! $this->tfaService->verifyCodeForUser($user, $secret, $code)) {
                return back()->withErrors(['code' => 'Invalid or already-used 6-digit authenticator code.']);
            }
        }

        session(['auth.reauthenticated_at' => time()]);

        return redirect()->intended('/admin/security-settings')
            ->with('status', 'Identity verified for sensitive operations.');
    }
}
