<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use App\Notifications\EmailOtpNotification;
use App\Notifications\TwoFactorDisabledAlert;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TwoFactorAuthService
{
    /**
     * Send a fresh 6-digit single-use Email OTP to the user's email address.
     *
     * @return array{sent: bool, cooldown_remaining: int, expires_at: mixed, mail_error: ?string}
     */
    public function sendEmailOtp(User $user, string $purpose = 'login', bool $respectCooldown = true): array
    {
        $ttlMinutes = max(1, (int) config('cms.two_factor.email_otp_ttl_minutes', 10));
        $cooldownSeconds = max(5, (int) config('cms.two_factor.email_otp_resend_cooldown_seconds', 30));
        $cooldownRemaining = $this->getEmailOtpCooldownRemaining($user);

        if ($respectCooldown && $this->hasActiveEmailOtp($user, $purpose) && $cooldownRemaining > 0) {
            return [
                'sent' => false,
                'cooldown_remaining' => $cooldownRemaining,
                'expires_at' => $user->two_factor_email_otp_expires_at,
                'mail_error' => null,
            ];
        }

        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes($ttlMinutes);

        $user->two_factor_email_otp_hash = Hash::make($otp);
        $user->two_factor_email_otp_purpose = $purpose;
        $user->two_factor_email_otp_expires_at = $expiresAt;
        $user->two_factor_email_otp_sent_at = now();
        $user->save();

        $mailError = null;
        try {
            $user->notifyNow(new EmailOtpNotification($otp, $purpose, $ttlMinutes));
        } catch (\Throwable) {
            $mailError = 'Email delivery could not be completed. Check mail/SMTP configuration on the server.';
        }

        AuditLog::log('MFA_EMAIL_OTP_SENT', $user, null, [
            'user_email' => $user->email,
            'purpose' => $purpose,
            'delivery_ok' => $mailError === null,
        ]);

        return [
            'sent' => $mailError === null,
            'cooldown_remaining' => $cooldownSeconds,
            'expires_at' => $expiresAt,
            'mail_error' => $mailError,
        ];
    }

    public function hasActiveEmailOtp(User $user, string $purpose): bool
    {
        return ! empty($user->two_factor_email_otp_hash)
            && $user->two_factor_email_otp_purpose === $purpose
            && $user->two_factor_email_otp_expires_at !== null
            && $user->two_factor_email_otp_expires_at->isFuture();
    }

    public function getEmailOtpCooldownRemaining(User $user): int
    {
        if (! $user->two_factor_email_otp_sent_at) {
            return 0;
        }

        $cooldownSeconds = max(5, (int) config('cms.two_factor.email_otp_resend_cooldown_seconds', 30));
        $elapsed = now()->timestamp - $user->two_factor_email_otp_sent_at->timestamp;

        return max(0, $cooldownSeconds - $elapsed);
    }

    /**
     * Verify a 6-digit Email OTP and consume it immediately to prevent replay attacks.
     */
    public function verifyEmailOtp(User $user, string $code, string $purpose): bool
    {
        $normalized = preg_replace('/\D+/', '', trim($code)) ?? '';
        if (strlen($normalized) !== 6) {
            return false;
        }

        if (! $this->hasActiveEmailOtp($user, $purpose)) {
            return false;
        }

        if (! Hash::check($normalized, (string) $user->two_factor_email_otp_hash)) {
            return false;
        }

        $this->clearPendingEmailOtp($user);

        return true;
    }

    public function clearPendingEmailOtp(User $user): void
    {
        $user->two_factor_email_otp_hash = null;
        $user->two_factor_email_otp_purpose = null;
        $user->two_factor_email_otp_expires_at = null;
        $user->two_factor_email_otp_sent_at = null;
        $user->save();
    }

    /**
     * Generate recovery codes (formatted as XXXX-XXXX-XXXX).
     * Returns: ['plain' => [...], 'hashed' => [...]]
     */
    public function generateRecoveryCodes(int $count = 8): array
    {
        $plainCodes = [];
        $hashedCodes = [];

        for ($i = 0; $i < $count; $i++) {
            $code = strtoupper(Str::random(4).'-'.Str::random(4).'-'.Str::random(4));
            $plainCodes[] = $code;
            $hashedCodes[] = Hash::make($code);
        }

        return [
            'plain' => $plainCodes,
            'hashed' => $hashedCodes,
        ];
    }

    /**
     * Verify and consume a recovery code for the given user.
     */
    public function verifyAndConsumeRecoveryCode(User $user, string $code): bool
    {
        $code = trim(strtoupper($code));
        if (empty($user->two_factor_recovery_codes)) {
            return false;
        }

        $codes = json_decode(Crypt::decryptString($user->two_factor_recovery_codes), true);
        if (! is_array($codes)) {
            return false;
        }

        foreach ($codes as $index => $hashedCode) {
            if (Hash::check($code, $hashedCode)) {
                unset($codes[$index]);
                $user->two_factor_recovery_codes = Crypt::encryptString(json_encode(array_values($codes)));
                $user->save();

                AuditLog::log('MFA_RECOVERY_CODE_CONSUMED', $user, null, [
                    'remaining_codes_count' => count($codes),
                    'user_email' => $user->email,
                ]);

                return true;
            }
        }

        return false;
    }

    /**
     * Enable Email OTP 2FA for a user with emergency recovery codes.
     */
    public function enableTwoFactor(
        User $user,
        ?string $secret,
        array $recoveryCodes,
        bool $recoverySavedConfirmed = true,
        ?int $graceDays = null,
        string $method = 'email'
    ): void {
        $resolvedGraceDays = $graceDays ?? (int) config('cms.two_factor.grace_days', 7);

        $user->two_factor_method = $method;
        $user->two_factor_secret = $secret ? Crypt::encryptString($secret) : null;
        $user->two_factor_recovery_codes = Crypt::encryptString(json_encode($recoveryCodes['hashed']));
        $user->two_factor_confirmed_at = now();
        $user->two_factor_recovery_confirmed_at = $recoverySavedConfirmed ? now() : null;
        $user->two_factor_grace_until = $resolvedGraceDays > 0 ? now()->addDays($resolvedGraceDays) : null;
        $user->two_factor_email_otp_hash = null;
        $user->two_factor_email_otp_purpose = null;
        $user->two_factor_email_otp_expires_at = null;
        $user->two_factor_email_otp_sent_at = null;
        $user->save();

        AuditLog::log('MFA_ENABLED', $user, null, [
            'user_email' => $user->email,
            'method' => $method,
            'confirmed_at' => now()->toIso8601String(),
            'recovery_confirmed' => $recoverySavedConfirmed,
            'grace_until' => $user->two_factor_grace_until?->toIso8601String(),
        ]);
    }

    /**
     * Regenerate emergency recovery codes.
     *
     * @return array{plain: array<int, string>, hashed: array<int, string>}
     */
    public function regenerateRecoveryCodes(User $user): array
    {
        $codes = $this->generateRecoveryCodes(8);
        $user->two_factor_recovery_codes = Crypt::encryptString(json_encode($codes['hashed']));
        $user->save();

        AuditLog::log('MFA_RECOVERY_CODES_REGENERATED', $user, null, [
            'user_email' => $user->email,
        ]);

        return $codes;
    }

    public function createTrustedDeviceToken(User $user, int $days = 30): string
    {
        $payload = [
            'uid' => (int) $user->id,
            'ver' => max(1, (int) ($user->two_factor_trusted_token_version ?? 1)),
            'exp' => now()->addDays(max(1, $days))->timestamp,
            'nonce' => Str::random(12),
        ];

        $encoded = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
        $sig = hash_hmac('sha256', $encoded, (string) config('app.key'));

        return $encoded.'.'.$sig;
    }

    public function hasValidTrustedDeviceToken(User $user, ?string $token): bool
    {
        if (empty($token) || ! str_contains($token, '.')) {
            return false;
        }

        [$encoded, $sig] = explode('.', $token, 2);
        $expectedSig = hash_hmac('sha256', $encoded, (string) config('app.key'));
        if (! hash_equals($expectedSig, $sig)) {
            return false;
        }

        $json = base64_decode(strtr($encoded, '-_', '+/'), true);
        if ($json === false) {
            return false;
        }

        $data = json_decode($json, true);
        if (! is_array($data)) {
            return false;
        }

        $expectedVersion = max(1, (int) ($user->two_factor_trusted_token_version ?? 1));

        return (int) ($data['uid'] ?? 0) === (int) $user->id
            && (int) ($data['ver'] ?? 0) === $expectedVersion
            && (int) ($data['exp'] ?? 0) > time();
    }

    public function revokeTrustedDevices(User $user): void
    {
        $user->two_factor_trusted_token_version = max(1, (int) ($user->two_factor_trusted_token_version ?? 1)) + 1;
        $user->save();

        AuditLog::log('MFA_TRUSTED_DEVICES_REVOKED', $user, null, [
            'user_email' => $user->email,
            'new_token_version' => $user->two_factor_trusted_token_version,
        ]);
    }

    /**
     * Disable 2FA and revoke trusted devices for a user.
     */
    public function disableTwoFactor(User $user, ?User $actor = null): void
    {
        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->two_factor_recovery_confirmed_at = null;
        $user->two_factor_grace_until = null;
        $user->two_factor_last_used_timestep = null;
        $user->two_factor_email_otp_hash = null;
        $user->two_factor_email_otp_purpose = null;
        $user->two_factor_email_otp_expires_at = null;
        $user->two_factor_email_otp_sent_at = null;
        $user->two_factor_trusted_token_version = max(1, (int) ($user->two_factor_trusted_token_version ?? 1)) + 1;
        $user->save();

        AuditLog::log('MFA_DISABLED', $user, null, [
            'user_email' => $user->email,
            'actor_id' => $actor?->id,
        ]);

        try {
            $user->notify(new TwoFactorDisabledAlert(
                $actor && $actor->id !== $user->id
                    ? "Disabled by administrator ({$actor->email})"
                    : 'Disabled by account owner'
            ));
        } catch (\Throwable) {
            // Do not block local environments without mail transport configured.
        }
    }

    /**
     * Superadmin recovery action: reset a locked-out user's 2FA and record full audit trail.
     */
    public function resetTwoFactorByAdmin(User $target, User $actor): void
    {
        $target->two_factor_secret = null;
        $target->two_factor_recovery_codes = null;
        $target->two_factor_confirmed_at = null;
        $target->two_factor_recovery_confirmed_at = null;
        $target->two_factor_grace_until = null;
        $target->two_factor_last_used_timestep = null;
        $target->two_factor_email_otp_hash = null;
        $target->two_factor_email_otp_purpose = null;
        $target->two_factor_email_otp_expires_at = null;
        $target->two_factor_email_otp_sent_at = null;
        $target->two_factor_trusted_token_version = max(1, (int) ($target->two_factor_trusted_token_version ?? 1)) + 1;
        $target->two_factor_reset_by = $actor->id;
        $target->two_factor_reset_at = now();
        $target->save();

        AuditLog::log('MFA_ADMIN_RESET', $target, null, [
            'target_email' => $target->email,
            'reset_by_id' => $actor->id,
            'reset_by_email' => $actor->email,
        ]);

        try {
            $target->notify(new TwoFactorDisabledAlert(
                "Emergency administrator reset performed by {$actor->email}"
            ));
        } catch (\Throwable) {
            // Do not block local environments without mail transport configured.
        }
    }
}
