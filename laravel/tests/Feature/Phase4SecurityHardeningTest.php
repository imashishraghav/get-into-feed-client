<?php

namespace Tests\Feature;

use App\Filament\Pages\SecuritySettings;
use App\Filament\Resources\UserResource\Pages\ListUsers;
use App\Models\AuditLog;
use App\Models\User;
use App\Models\UserTrustedDevice;
use App\Notifications\EmailOtpNotification;
use App\Notifications\NewDeviceLoginAlert;
use App\Notifications\TwoFactorDisabledAlert;
use App\Services\TwoFactorAuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Livewire\Livewire;
use Tests\TestCase;

class Phase4SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(array $overrides = []): User
    {
        return User::create(array_merge([
            'name' => 'Phase 4 Admin',
            'email' => 'phase4-'.uniqid().'@getintofeed.com',
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

    public function test_email_otp_replay_is_blocked_cooldown_enforced_and_login_sends_masked_alert(): void
    {
        Notification::fake();

        $service = app(TwoFactorAuthService::class);
        $codes = $service->generateRecoveryCodes(4);

        $user = $this->makeUser();
        $service->enableTwoFactor($user, null, $codes, recoverySavedConfirmed: true, graceDays: 0);

        $this->actingAs($user)->get(route('admin.two-factor.challenge'))->assertOk();
        $otp = $this->captureSentEmailOtp($user);

        // Resend cooldown immediately blocks spam within cooldown window
        $this->actingAs($user)
            ->post(route('admin.two-factor.send-otp'), ['purpose' => 'login'])
            ->assertSessionHasErrors('code');

        // First verification succeeds, consumes OTP, and sends masked NewDeviceLoginAlert
        $this->actingAs($user)
            ->post('/admin/two-factor/verify', [
                'code' => $otp,
                'trust_device' => true,
            ])
            ->assertRedirect('/admin');

        $user->refresh();
        $this->assertNull($user->two_factor_email_otp_hash);

        Notification::assertSentTo(
            $user,
            NewDeviceLoginAlert::class,
            function (NewDeviceLoginAlert $notification) use ($user) {
                $mail = $notification->toMail($user);
                $body = implode("\n", $mail->introLines);

                return str_contains($body, '.xxx') || str_contains($body, 'masked-network');
            }
        );

        // Replaying the exact same OTP must be rejected
        $this->actingAs($user)
            ->withSession(['auth.two_factor_verified' => false])
            ->post('/admin/two-factor/verify', [
                'code' => $otp,
            ])
            ->assertSessionHasErrors('code');
    }

    public function test_superadmin_can_reset_users_two_factor_via_user_resource_action(): void
    {
        Notification::fake();

        $superadmin = $this->makeUser(['role' => 'superadmin']);
        $editor = $this->makeUser(['role' => 'author']);

        $service = app(TwoFactorAuthService::class);
        $codes = $service->generateRecoveryCodes(4);
        $service->enableTwoFactor($editor, null, $codes, recoverySavedConfirmed: true, graceDays: 0);

        $this->assertTrue($editor->fresh()->hasTwoFactorEnabled());

        $this->actingAs($superadmin);

        Livewire::test(ListUsers::class)
            ->callTableAction('resetTwoFactor', $editor);

        $editor->refresh();
        $this->assertFalse($editor->hasTwoFactorEnabled());
        $this->assertSame($superadmin->id, $editor->two_factor_reset_by);
        $this->assertNotNull($editor->two_factor_reset_at);
        $this->assertGreaterThan(1, (int) $editor->two_factor_trusted_token_version);

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'MFA_ADMIN_RESET',
            'auditable_id' => $editor->id,
        ]);

        Notification::assertSentTo($editor, TwoFactorDisabledAlert::class);
    }

    public function test_security_settings_page_renders_and_can_log_out_other_sessions(): void
    {
        $user = $this->makeUser();
        $service = app(TwoFactorAuthService::class);
        $service->enableTwoFactor($user, null, $service->generateRecoveryCodes(4), true, 0);

        AuditLog::log('MFA_LOGIN_SUCCESS', $user, null, ['user_email' => $user->email]);

        $this->actingAs($user)
            ->withSession(['auth.two_factor_verified' => true])
            ->get('/admin/security-settings')
            ->assertOk()
            ->assertSee('Two-step verification')
            ->assertSee('Trusted devices')
            ->assertSee('Active sessions')
            ->assertSee('Re-authentication');

        // Record a real trusted device and revoke it individually via SecuritySettings
        $token = $service->createTrustedDeviceToken($user, 30, 'Mozilla/5.0 Chrome/130.0 Windows NT 10.0', '103.42.10.5');
        $this->assertTrue($service->hasValidTrustedDeviceToken($user, $token));
        $device = UserTrustedDevice::query()->where('user_id', $user->id)->firstOrFail();

        Livewire::test(SecuritySettings::class)
            ->assertSee('Chrome on Windows')
            ->call('revokeTrustedDevice', $device->id);

        $this->assertFalse($service->hasValidTrustedDeviceToken($user, $token));

        Livewire::test(SecuritySettings::class)
            ->set('logoutOtherPassword', 'StrongSecretPass123!')
            ->call('logoutOtherBrowserSessions')
            ->assertHasNoErrors();

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'OTHER_SESSIONS_LOGGED_OUT',
            'auditable_id' => $user->id,
        ]);
    }

    public function test_recent_reauthentication_guard_protects_backup_download_and_accepts_email_otp_reauth(): void
    {
        Notification::fake();
        $user = $this->makeUser();
        $service = app(TwoFactorAuthService::class);
        $service->enableTwoFactor($user, null, $service->generateRecoveryCodes(4), true, 0);

        // Stale or missing auth.reauthenticated_at redirects to reauth prompt
        $this->actingAs($user)
            ->get('/admin/system-backups/999999/download')
            ->assertRedirect(route('admin.two-factor.reauth'));

        // Reauth screen automatically sends reauth Email OTP and renders password + Email OTP form
        $this->actingAs($user)
            ->get(route('admin.two-factor.reauth'))
            ->assertOk()
            ->assertSee('Confirm Your Password')
            ->assertSee('6-Digit Email OTP');

        $reauthOtp = $this->captureSentEmailOtp($user);

        // Completing reauth sets auth.reauthenticated_at and redirects back to the intended protected route
        $this->actingAs($user)
            ->post(route('admin.two-factor.reauth.verify'), [
                'password' => 'StrongSecretPass123!',
                'code' => $reauthOtp,
            ])
            ->assertRedirect('/admin/system-backups/999999/download');

        $this->actingAs($user)
            ->withSession(['auth.reauthenticated_at' => time()])
            ->get('/admin/system-backups/999999/download')
            ->assertNotFound();
    }
}
