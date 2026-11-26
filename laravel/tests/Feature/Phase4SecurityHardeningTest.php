<?php

namespace Tests\Feature;

use App\Filament\Pages\SecuritySettings;
use App\Filament\Resources\UserResource\Pages\ListUsers;
use App\Models\AuditLog;
use App\Models\User;
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

    private function currentTotp(TwoFactorAuthService $service, string $secret): string
    {
        $method = new \ReflectionMethod($service, 'base32Decode');
        $decoded = $method->invoke($service, $secret);
        $step = (int) floor(time() / 30);

        return $service->calculateTotp($decoded, $step);
    }

    public function test_totp_replay_in_same_timestep_is_blocked_and_login_sends_masked_alert(): void
    {
        Notification::fake();

        $service = app(TwoFactorAuthService::class);
        $secret = $service->generateSecretKey();
        $codes = $service->generateRecoveryCodes(4);

        $user = $this->makeUser();
        $service->enableTwoFactor($user, $secret, $codes, recoverySavedConfirmed: true, graceDays: 0);

        $code = $this->currentTotp($service, $secret);

        // First verification succeeds and sends masked NewDeviceLoginAlert
        $this->actingAs($user)
            ->post('/admin/two-factor/verify', [
                'code' => $code,
                'trust_device' => true,
            ])
            ->assertRedirect('/admin');

        $user->refresh();
        $this->assertNotNull($user->two_factor_last_used_timestep);

        Notification::assertSentTo(
            $user,
            NewDeviceLoginAlert::class,
            function (NewDeviceLoginAlert $notification) use ($user) {
                $mail = $notification->toMail($user);
                $body = implode("\n", $mail->introLines);

                return str_contains($body, '.xxx') || str_contains($body, 'masked-network');
            }
        );

        // Replay of the exact same TOTP code within the same 30-second window must be rejected
        $this->actingAs($user)
            ->withSession(['auth.two_factor_verified' => false])
            ->post('/admin/two-factor/verify', [
                'code' => $code,
            ])
            ->assertSessionHasErrors('code');
    }

    public function test_superadmin_can_reset_users_two_factor_via_user_resource_action(): void
    {
        Notification::fake();

        $superadmin = $this->makeUser(['role' => 'superadmin']);
        $editor = $this->makeUser(['role' => 'author']);

        $service = app(TwoFactorAuthService::class);
        $secret = $service->generateSecretKey();
        $codes = $service->generateRecoveryCodes(4);
        $service->enableTwoFactor($editor, $secret, $codes, recoverySavedConfirmed: true, graceDays: 0);

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
        $service->enableTwoFactor($user, $service->generateSecretKey(), $service->generateRecoveryCodes(4), true, 0);

        AuditLog::log('MFA_LOGIN_SUCCESS', $user, null, ['user_email' => $user->email]);

        $this->actingAs($user)
            ->withSession(['auth.two_factor_verified' => true])
            ->get('/admin/security-settings')
            ->assertOk()
            ->assertSee('Two-Factor Authentication (TOTP)')
            ->assertSee('Manage 2FA & Recovery Codes');

        Livewire::test(SecuritySettings::class)
            ->set('logoutOtherPassword', 'StrongSecretPass123!')
            ->call('logoutOtherBrowserSessions')
            ->assertHasNoErrors();

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'OTHER_SESSIONS_LOGGED_OUT',
            'auditable_id' => $user->id,
        ]);
    }

    public function test_recent_reauthentication_guard_protects_backup_download_and_accepts_reauth(): void
    {
        $user = $this->makeUser();
        $service = app(TwoFactorAuthService::class);
        $secret = $service->generateSecretKey();
        $service->enableTwoFactor($user, $secret, $service->generateRecoveryCodes(4), true, 0);

        // Stale or missing auth.reauthenticated_at redirects to reauth prompt
        $this->actingAs($user)
            ->get('/admin/system-backups/999999/download')
            ->assertRedirect(route('admin.two-factor.reauth'));

        // Reauth screen renders password + TOTP input cleanly
        $this->actingAs($user)
            ->get(route('admin.two-factor.reauth'))
            ->assertOk()
            ->assertSee('Confirm Your Password')
            ->assertSee('Authenticator 6-Digit Code');

        // Completing reauth sets auth.reauthenticated_at and redirects back to the intended protected route
        $this->actingAs($user)
            ->post(route('admin.two-factor.reauth.verify'), [
                'password' => 'StrongSecretPass123!',
                'code' => $this->currentTotp($service, $secret),
            ])
            ->assertRedirect('/admin/system-backups/999999/download');

        $this->actingAs($user)
            ->withSession(['auth.reauthenticated_at' => time()])
            ->get('/admin/system-backups/999999/download')
            ->assertNotFound();
    }
}
