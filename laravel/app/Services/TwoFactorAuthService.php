<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use App\Notifications\TwoFactorDisabledAlert;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TwoFactorAuthService
{
    private const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    /**
     * Generate a cryptographically secure Base32 secret key (16 or 32 chars).
     */
    public function generateSecretKey(int $length = 16): string
    {
        $secret = '';
        $max = strlen(self::BASE32_CHARS) - 1;
        for ($i = 0; $i < $length; $i++) {
            $secret .= self::BASE32_CHARS[random_int(0, $max)];
        }

        return $secret;
    }

    /**
     * Generate an otpauth:// URL suitable for Google Authenticator / 1Password / Authy.
     */
    public function getQrCodeUrl(string $issuer, string $accountName, string $secret): string
    {
        $encodedIssuer = rawurlencode($issuer);
        $encodedAccount = rawurlencode($accountName);

        return "otpauth://totp/{$encodedIssuer}:{$encodedAccount}?secret={$secret}&issuer={$encodedIssuer}&algorithm=SHA1&digits=6&period=30";
    }

    /**
     * Render a crisp inline SVG QR code locally via bacon/bacon-qr-code (zero third-party leakage).
     */
    public function getQrCodeSvg(string $issuer, string $accountName, string $secret): string
    {
        $otpAuthUri = $this->getQrCodeUrl($issuer, $accountName, $secret);
        $renderer = new ImageRenderer(
            new RendererStyle(196, 1),
            new SvgImageBackEnd
        );

        return (new Writer($renderer))->writeString($otpAuthUri);
    }

    /**
     * Verify a 6-digit TOTP code against a Base32 secret key.
     * Allows a configurable time window (default 1 = +/- 30 seconds drift tolerance).
     */
    public function verifyCode(string $secret, string $code, int $window = 1): bool
    {
        return $this->matchTotpTimestep($secret, $code, $window) !== null;
    }

    /**
     * Verify a 6-digit TOTP code for a specific user and block same-timestep replay attacks.
     */
    public function verifyCodeForUser(User $user, string $secret, string $code, int $window = 1): bool
    {
        $matchedStep = $this->matchTotpTimestep($secret, $code, $window);
        if ($matchedStep === null) {
            return false;
        }

        $lastStep = $user->two_factor_last_used_timestep !== null
            ? (int) $user->two_factor_last_used_timestep
            : null;

        if ($lastStep !== null && $matchedStep <= $lastStep) {
            return false;
        }

        $user->two_factor_last_used_timestep = $matchedStep;
        $user->save();

        return true;
    }

    private function matchTotpTimestep(string $secret, string $code, int $window = 1): ?int
    {
        $code = trim($code);
        if (strlen($code) !== 6 || ! ctype_digit($code)) {
            return null;
        }

        $decodedSecret = $this->base32Decode($secret);
        if (empty($decodedSecret)) {
            return null;
        }

        $currentTimestamp = time();
        $timeStep = 30;
        $currentStep = (int) floor($currentTimestamp / $timeStep);

        for ($i = -$window; $i <= $window; $i++) {
            $step = $currentStep + $i;
            $calculatedCode = $this->calculateTotp($decodedSecret, $step);
            if (hash_equals($calculatedCode, $code)) {
                return $step;
            }
        }

        return null;
    }

    /**
     * Calculate 6-digit TOTP code for a given step using RFC 6238 HMAC-SHA1.
     */
    public function calculateTotp(string $decodedSecret, int $step): string
    {
        // 64-bit big-endian representation of time step
        $timeBinary = pack('N*', 0).pack('N*', $step);
        $hash = hash_hmac('sha1', $timeBinary, $decodedSecret, true);

        // Dynamic truncation: take last 4 bits of the 20-byte hash
        $offset = ord($hash[19]) & 0x0F;

        // Extract 4 bytes from offset
        $part = substr($hash, $offset, 4);
        $value = unpack('N', $part)[1] & 0x7FFFFFFF;

        $totp = $value % 1000000;

        return str_pad((string) $totp, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Decode a Base32 encoded string into raw binary bytes.
     */
    protected function base32Decode(string $b32): string
    {
        $b32 = strtoupper(trim($b32));
        $buffer = 0;
        $bitsLeft = 0;
        $binary = '';

        for ($i = 0, $len = strlen($b32); $i < $len; $i++) {
            $char = $b32[$i];
            if ($char === '=') {
                break;
            }
            $val = strpos(self::BASE32_CHARS, $char);
            if ($val === false) {
                continue;
            }
            $buffer = ($buffer << 5) | $val;
            $bitsLeft += 5;

            if ($bitsLeft >= 8) {
                $bitsLeft -= 8;
                $binary .= chr(($buffer >> $bitsLeft) & 0xFF);
            }
        }

        return $binary;
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
                // Remove used recovery code
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
     * Enable 2FA for a user with the confirmed secret key and recovery codes.
     */
    public function enableTwoFactor(
        User $user,
        string $secret,
        array $recoveryCodes,
        bool $recoverySavedConfirmed = true,
        ?int $graceDays = null
    ): void {
        $resolvedGraceDays = $graceDays ?? (int) config('cms.two_factor.grace_days', 7);

        $user->two_factor_secret = Crypt::encryptString($secret);
        $user->two_factor_recovery_codes = Crypt::encryptString(json_encode($recoveryCodes['hashed']));
        $user->two_factor_confirmed_at = now();
        $user->two_factor_recovery_confirmed_at = $recoverySavedConfirmed ? now() : null;
        $user->two_factor_grace_until = $resolvedGraceDays > 0 ? now()->addDays($resolvedGraceDays) : null;
        $user->save();

        AuditLog::log('MFA_ENABLED', $user, null, [
            'user_email' => $user->email,
            'confirmed_at' => now()->toIso8601String(),
            'recovery_confirmed' => $recoverySavedConfirmed,
            'grace_until' => $user->two_factor_grace_until?->toIso8601String(),
        ]);
    }

    /**
     * Regenerate emergency recovery codes and require explicit save confirmation.
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
