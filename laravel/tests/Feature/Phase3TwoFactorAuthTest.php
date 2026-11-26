<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\EmailOtpNotification;
use App\Services\TwoFactorAuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class Phase3TwoFactorAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function makeAdmin(array $overrides = []): User
    {
        return User::create(array_merge([
            'name' => 'Security Admin',
            'email' => 'mfa-'.uniqid().'@getintofeed.com',
            'password' => Hash::make('StrongSecretPass123!'),
            'role' => 'superadmin',
            'is_active' => true,
        ], $overrides));
    }

    private function captureSentEmailOtp(User $user): string
    {
        $capturedOtp = '';
        Notification::assertSentTo(
            $user,
            EmailOtpNotification::class,
            function (EmailOtpNotification $notification) use ($user, &$capturedOtp): bool {
                $mail = $notification->toMail($user);
                if (preg_match('/^(\d{6})\s+is your/i', (string) $mail->subject, $matches)) {
                    $capturedOtp = $matches[1];
                }

                return $capturedOtp !== '';
            }
        );

        $this->assertMatchesRegularExpression('/^\d{6}$/', $capturedOtp);

        return $capturedOtp;
    }

    public function test_email_otp_enrollment_and_two_step_recovery_code_confirmation_guardrail(): void
    {
        Notification::fake();
        $admin = $this->makeAdmin();

        $this->actingAs($admin);

        // Setup page sends a 6-digit Email OTP automatically and renders masked email UI (no TOTP QR)
        $setupResponse = $this->get(route('admin.two-factor.setup'))->assertOk();
        $setupResponse->assertSee($admin->getMaskedEmail(), false);
        $setupResponse->assertDontSee('api.qrserver.com', false);

        $otp = $this->captureSentEmailOtp($admin);

        // Step 1: Confirm Email OTP displays emergency recovery codes, but login stays unlocked until confirmed saved
        $this->post(route('admin.two-factor.confirm'), ['code' => $otp])
            ->assertOk()
            ->assertSee('I have securely saved these emergency recovery codes');

        $admin->refresh();
        $this->assertFalse($admin->hasTwoFactorEnabled());
        $this->assertFalse($admin->requiresTwoFactorChallenge());

        // Simulating page abandon before clicking "Confirm Saved" -> admin can still access /admin cleanly
        session()->forget('auth.two_factor_verified');
        $this->get('/admin/blog-posts')->assertOk();

        // Step 2: Confirm recovery codes saved with default 7-day grace period
        $this->post(route('admin.two-factor.confirm-recovery'), [
            'confirmed_saved' => '1',
        ])->assertRedirect(route('admin.two-factor.setup'));

        $admin->refresh();
        $this->assertTrue($admin->hasTwoFactorEnabled());
        $this->assertTrue($admin->hasConfirmedRecoveryCodes());
        $this->assertTrue($admin->isInTwoFactorGracePeriod());
        // Within grace period, admin login/access is still unblocked
        $this->assertFalse($admin->requiresTwoFactorChallenge());
        session()->forget('auth.two_factor_verified');
        $this->get('/admin/blog-posts')->assertOk();

        // After grace period elapses -> challenge is enforced
        $this->travel(8)->days();
        $this->assertTrue($admin->fresh()->requiresTwoFactorChallenge());
        $this->get('/admin/blog-posts')->assertRedirect(route('admin.two-factor.challenge'));
    }

    public function test_email_otp_verify_trusted_device_cookie_and_revoke_all_devices(): void
    {
        Notification::fake();
        $tfa = app(TwoFactorAuthService::class);
        $recovery = $tfa->generateRecoveryCodes(4);

        $admin = $this->makeAdmin();
        $tfa->enableTwoFactor($admin, null, $recovery, recoverySavedConfirmed: true, graceDays: 0);

        $this->actingAs($admin);

        // Blocked before verifying
        $this->get('/admin/blog-posts')->assertRedirect(route('admin.two-factor.challenge'));

        // Opening challenge triggers a fresh 6-digit login Email OTP
        $this->get(route('admin.two-factor.challenge'))
            ->assertOk()
            ->assertSee($admin->getMaskedEmail(), false);
        $otp = $this->captureSentEmailOtp($admin);

        // Verify with Email OTP + "Trust this browser for 30 days"
        $verifyResponse = $this->post(route('admin.two-factor.verify'), [
            'code' => $otp,
            'trust_device' => '1',
        ]);
        $verifyResponse->assertRedirect('/admin');
        $cookieName = (string) config('cms.two_factor.cookie_name', 'gif_mfa_trust');
        $verifyResponse->assertCookie($cookieName);

        $trustCookieValue = $verifyResponse->getCookie($cookieName)?->getValue();
        $this->assertNotEmpty($trustCookieValue);

        // New session carrying trusted cookie bypasses challenge
        session()->forget('auth.two_factor_verified');
        $this->withCookie($cookieName, $trustCookieValue)
            ->get('/admin/blog-posts')
            ->assertOk();

        // Revoking trusted devices increments version and forces new challenge
        $this->post(route('admin.two-factor.revoke-devices'))
            ->assertRedirect(route('admin.two-factor.setup'));

        session()->forget('auth.two_factor_verified');
        $this->withCookie($cookieName, $trustCookieValue)
            ->get('/admin/blog-posts')
            ->assertRedirect(route('admin.two-factor.challenge'));
    }

    public function test_recovery_code_single_use_rate_limit_regenerate_disable_and_cli_reset(): void
    {
        Notification::fake();
        $tfa = app(TwoFactorAuthService::class);
        $recovery = $tfa->generateRecoveryCodes(4);

        $admin = $this->makeAdmin();
        $tfa->enableTwoFactor($admin, null, $recovery, recoverySavedConfirmed: true, graceDays: 0);

        $this->actingAs($admin);

        // Single-use recovery code succeeds once
        $firstRecovery = $recovery['plain'][0];
        $this->post(route('admin.two-factor.verify'), [
            'recovery_code' => $firstRecovery,
        ])->assertRedirect('/admin');

        $this->assertSame(3, $admin->fresh()->getRemainingRecoveryCodesCount());

        // Reusing same recovery code fails
        session()->forget('auth.two_factor_verified');
        $this->post(route('admin.two-factor.verify'), [
            'recovery_code' => $firstRecovery,
        ])->assertSessionHasErrors('recovery_code');

        // Rate limiting triggers after 5 total failures per minute
        for ($i = 0; $i < 4; $i++) {
            $this->post(route('admin.two-factor.verify'), ['code' => '000000'])
                ->assertSessionHasErrors('code');
        }
        $rateLimited = $this->post(route('admin.two-factor.verify'), ['code' => '000000']);
        $rateLimited->assertSessionHasErrors('code');
        $this->assertStringContainsString('Too many failed authentication attempts', session('errors')->first('code'));

        // Emergency CLI reset unlocks account
        $this->artisan('user:reset-2fa', ['email' => $admin->email, '--force' => true])
            ->assertExitCode(0);

        $fresh = $admin->fresh();
        $this->assertFalse($fresh->hasTwoFactorEnabled());
        $this->assertNull($fresh->two_factor_recovery_confirmed_at);
        $this->assertNull($fresh->two_factor_grace_until);
        $this->actingAs($fresh)->get('/admin/blog-posts')->assertOk();

        // Re-enable, regenerate codes (requires password), then disable (requires password)
        $tfa->enableTwoFactor($fresh, null, $recovery, recoverySavedConfirmed: true, graceDays: 0);
        session(['auth.two_factor_verified' => true]);

        $this->post(route('admin.two-factor.regenerate-recovery'), ['password' => 'WrongPassword'])
            ->assertSessionHasErrors('password');

        $this->post(route('admin.two-factor.regenerate-recovery'), ['password' => 'StrongSecretPass123!'])
            ->assertOk();
        $this->assertSame(8, $fresh->fresh()->getRemainingRecoveryCodesCount());

        $this->post(route('admin.two-factor.disable'), ['password' => 'StrongSecretPass123!'])
            ->assertRedirect(route('admin.two-factor.setup'));
        $this->assertFalse($fresh->fresh()->hasTwoFactorEnabled());
    }
}
