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

    public function challenge(Request $request)
    {
        $user = $request->user();
        if (! $user || ! $user->requiresTwoFactorChallenge()) {
            return redirect('/admin');
        }

        if (session('auth.two_factor_verified')) {
            return redirect('/admin');
        }

        $mailResult = null;
        if (! $this->tfaService->hasActiveEmailOtp($user, 'login')) {
            $mailResult = $this->tfaService->sendEmailOtp($user, 'login', respectCooldown: false);
        }

        $throttleKey = 'mfa-verify:'.$user->id.'|'.$request->ip();
        $attemptsRemaining = RateLimiter::remaining($throttleKey, 5);

        return view('admin.two-factor.challenge', [
            'maskedEmail' => $user->getMaskedEmail(),
            'ttlMinutes' => (int) config('cms.two_factor.email_otp_ttl_minutes', 10),
            'cooldownRemaining' => $this->tfaService->getEmailOtpCooldownRemaining($user),
            'attemptsRemaining' => $attemptsRemaining,
            'mailError' => $mailResult['mail_error'] ?? null,
        ]);
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
                session([
                    'auth.two_factor_verified' => true,
                    'auth.reauthenticated_at' => time(),
                ]);

                return $this->completeVerificationRedirect($user, $request, $trustDevice);
            }

            RateLimiter::hit($throttleKey, 60);
            throw ValidationException::withMessages([
                'recovery_code' => ['The provided recovery code is invalid or has already been used.'],
            ]);
        }

        if ($this->tfaService->verifyEmailOtp($user, $code, 'login')) {
            RateLimiter::clear($throttleKey);
            session([
                'auth.two_factor_verified' => true,
                'auth.reauthenticated_at' => time(),
            ]);

            AuditLog::log('MFA_LOGIN_SUCCESS', $user, null, [
                'user_email' => $user->email,
                'method' => 'email_otp',
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
            'code' => ['The provided 6-digit email OTP is incorrect or expired. Request a new code if needed.'],
        ]);
    }

    public function sendOtp(Request $request)
    {
        $user = $request->user();
        $purpose = in_array($request->input('purpose'), ['setup', 'login', 'reauth'], true)
            ? (string) $request->input('purpose')
            : ($user->hasTwoFactorEnabled() ? 'login' : 'setup');

        $throttleKey = 'mfa-send:'.$user->id.'|'.$purpose.'|'.$request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return back()->withErrors([
                'code' => "Too many OTP requests. Please try again in {$seconds} seconds.",
            ]);
        }

        $result = $this->tfaService->sendEmailOtp($user, $purpose, respectCooldown: true);
        if (! $result['sent'] && $result['mail_error'] === null) {
            return back()->withErrors([
                'code' => "Please wait {$result['cooldown_remaining']} seconds before requesting a new email OTP.",
            ]);
        }

        RateLimiter::hit($throttleKey, 300);

        if ($result['mail_error'] !== null) {
            return back()->withErrors(['code' => $result['mail_error']]);
        }

        return back()->with('status', "A fresh 6-digit verification OTP has been sent to {$user->getMaskedEmail()}.");
    }

    private function completeVerificationRedirect($user, Request $request, bool $trustDevice)
    {
        if ($trustDevice) {
            $days = max(1, (int) config('cms.two_factor.trust_device_days', 30));
            $token = $this->tfaService->createTrustedDeviceToken(
                $user,
                $days,
                $request->userAgent(),
                $request->ip()
            );
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
        $mailResult = null;

        if (! $has2fa && ! $this->tfaService->hasActiveEmailOtp($user, 'setup')) {
            $mailResult = $this->tfaService->sendEmailOtp($user, 'setup', respectCooldown: false);
        }

        return view('admin.two-factor.setup', [
            'has2fa' => $has2fa,
            'user' => $user,
            'maskedEmail' => $user->getMaskedEmail(),
            'ttlMinutes' => (int) config('cms.two_factor.email_otp_ttl_minutes', 10),
            'cooldownRemaining' => $this->tfaService->getEmailOtpCooldownRemaining($user),
            'mailError' => $mailResult['mail_error'] ?? null,
            'graceUntil' => $user->two_factor_grace_until,
            'isInGracePeriod' => $user->isInTwoFactorGracePeriod(),
            'recoveryConfirmed' => $user->hasConfirmedRecoveryCodes(),
            'remainingCodesCount' => $user->getRemainingRecoveryCodesCount(),
            'graceDaysDefault' => (int) config('cms.two_factor.grace_days', 7),
        ]);
    }

    /**
     * Step 1 of activation: Verify the 6-digit Email OTP and display recovery codes for save confirmation.
     * Does NOT enforce mandatory challenge until recovery codes are explicitly confirmed saved.
     */
    public function confirm(Request $request)
    {
        $user = $request->user();
        $code = trim((string) $request->input('code', ''));

        if (! $this->tfaService->verifyEmailOtp($user, $code, 'setup')) {
            return redirect()->route('admin.two-factor.setup')
                ->withErrors(['code' => 'Invalid or expired 6-digit Email OTP. Please check your inbox or click Resend OTP.']);
        }

        $recoveryCodes = $this->tfaService->generateRecoveryCodes(8);
        session([
            'mfa_pending_enrollment' => [
                'method' => 'email',
                'hashed' => $recoveryCodes['hashed'],
            ],
        ]);

        return view('admin.two-factor.recovery-codes', [
            'codes' => $recoveryCodes['plain'],
            'requiresSaveConfirmation' => true,
            'graceDaysDefault' => (int) config('cms.two_factor.grace_days', 7),
        ]);
    }

    /**
     * Step 2 of activation: Complete Email OTP enrollment only after recovery codes are confirmed saved.
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

        if (! is_array($pending) || empty($pending['hashed'])) {
            return redirect()->route('admin.two-factor.setup')
                ->withErrors(['code' => 'No pending 2FA setup found. Please verify your email OTP again.']);
        }

        $graceDays = $request->boolean('skip_grace_period') ? 0 : (int) config('cms.two_factor.grace_days', 7);
        $this->tfaService->enableTwoFactor(
            $user,
            null,
            ['hashed' => $pending['hashed']],
            recoverySavedConfirmed: true,
            graceDays: $graceDays,
            method: 'email'
        );

        session()->forget('mfa_pending_enrollment');
        session(['auth.two_factor_verified' => true]);

        AuditLog::log('MFA_RECOVERY_CODES_CONFIRMED', $user, null, [
            'user_email' => $user->email,
            'method' => 'email',
            'grace_days' => $graceDays,
        ]);

        $statusMsg = $graceDays > 0
            ? "Email Two-Factor Authentication activated cleanly with a {$graceDays}-day transition grace period."
            : 'Email Two-Factor Authentication is now active and enforced on future logins.';

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
        $mailResult = null;

        if ($user->hasTwoFactorEnabled() && ! $this->tfaService->hasActiveEmailOtp($user, 'reauth')) {
            $mailResult = $this->tfaService->sendEmailOtp($user, 'reauth', respectCooldown: false);
        }

        return view('admin.two-factor.reauth', [
            'requiresOtp' => $user->hasTwoFactorEnabled(),
            'maskedEmail' => $user->getMaskedEmail(),
            'ttlMinutes' => (int) config('cms.two_factor.email_otp_ttl_minutes', 10),
            'mailError' => $mailResult['mail_error'] ?? null,
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
            if (! $this->tfaService->verifyEmailOtp($user, $code, 'reauth')) {
                return back()->withErrors(['code' => 'Invalid or expired 6-digit email OTP.']);
            }
        }

        session(['auth.reauthenticated_at' => time()]);

        return redirect()->intended('/admin/security-settings')
            ->with('status', 'Identity verified for sensitive operations.');
    }
}
