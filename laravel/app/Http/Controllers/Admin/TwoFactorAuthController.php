<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Services\TwoFactorAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class TwoFactorAuthController extends Controller
{
    public function __construct(
        protected TwoFactorAuthService $tfaService
    ) {}

    /**
     * Show the 2FA authentication challenge screen.
     */
    public function challenge()
    {
        $user = auth()->user();
        if (! $user || ! $user->hasTwoFactorEnabled()) {
            return redirect('/admin');
        }

        if (session('auth.two_factor_verified')) {
            return redirect('/admin');
        }

        return view('admin.two-factor.challenge');
    }

    /**
     * Verify the entered TOTP code or recovery code.
     */
    public function verify(Request $request)
    {
        $user = $request->user();
        if (! $user || ! $user->hasTwoFactorEnabled()) {
            return redirect('/admin');
        }

        // Rate limit verification attempts (5 per minute per IP + User)
        $throttleKey = 'mfa-verify:' . $user->id . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'code' => ["Too many failed authentication attempts. Please try again in {$seconds} seconds."],
            ]);
        }

        $code = trim($request->input('code', ''));
        $recoveryCode = trim($request->input('recovery_code', ''));

        // Case 1: Recovery code provided
        if (! empty($recoveryCode)) {
            if ($this->tfaService->verifyAndConsumeRecoveryCode($user, $recoveryCode)) {
                RateLimiter::clear($throttleKey);
                session(['auth.two_factor_verified' => true]);
                return redirect()->intended('/admin');
            }

            RateLimiter::hit($throttleKey, 60);
            throw ValidationException::withMessages([
                'recovery_code' => ['The provided recovery code is invalid or has already been used.'],
            ]);
        }

        // Case 2: 6-digit TOTP code provided
        $secret = $user->getTwoFactorSecret();
        if ($secret && $this->tfaService->verifyCode($secret, $code)) {
            RateLimiter::clear($throttleKey);
            session(['auth.two_factor_verified' => true]);

            AuditLog::log('MFA_LOGIN_SUCCESS', $user, null, [
                'user_email' => $user->email,
                'ip' => $request->ip(),
            ]);

            return redirect()->intended('/admin');
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

    /**
     * Show MFA setup screen with TOTP secret and QR code.
     */
    public function setup(Request $request)
    {
        $user = $request->user();
        $isEnabled = $user->hasTwoFactorEnabled();
        $secret = null;
        $qrCodeSvg = null;

        if (! $isEnabled) {
            $secret = $this->tfaService->generateSecretKey();
            session(['mfa_pending_secret' => $secret]);
            $qrCodeSvg = $this->tfaService->getQrCodeSvg(
                config('app.name', 'GetIntoFeed Enterprise CMS'),
                $user->email,
                $secret
            );
        }

        return view('admin.two-factor.setup', [
            'isEnabled' => $isEnabled,
            'secret' => $secret,
            'qrCodeSvg' => $qrCodeSvg,
            'user' => $user,
        ]);
    }

    /**
     * Confirm MFA setup with the first valid TOTP code.
     */
    public function confirm(Request $request)
    {
        $user = $request->user();
        $secret = session('mfa_pending_secret');

        if (! $secret) {
            return redirect()->route('admin.two-factor.setup')->withErrors(['code' => 'MFA setup session expired. Please try again.']);
        }

        $code = trim($request->input('code', ''));
        if (! $this->tfaService->verifyCode($secret, $code)) {
            return back()->withErrors(['code' => 'Invalid code. Enter the 6-digit code shown in your authenticator app.']);
        }

        // Generate recovery codes
        $recoveryCodes = $this->tfaService->generateRecoveryCodes(8);
        $this->tfaService->enableTwoFactor($user, $secret, $recoveryCodes);

        // Mark current session as verified
        session()->forget('mfa_pending_secret');
        session(['auth.two_factor_verified' => true]);

        return view('admin.two-factor.recovery-codes', [
            'codes' => $recoveryCodes['plain'],
        ]);
    }

    /**
     * Disable 2FA.
     */
    public function disable(Request $request)
    {
        $user = $request->user();
        $password = $request->input('password');

        if (! Hash::check($password, $user->password)) {
            return back()->withErrors(['password' => 'Incorrect password. Cannot disable 2FA.']);
        }

        $this->tfaService->disableTwoFactor($user);
        session()->forget('auth.two_factor_verified');

        return redirect()->route('admin.two-factor.setup')->with('status', 'Two-Factor Authentication has been successfully disabled.');
    }
}
