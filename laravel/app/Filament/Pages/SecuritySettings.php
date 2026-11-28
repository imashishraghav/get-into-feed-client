<?php

namespace App\Filament\Pages;

use App\Models\AuditLog;
use App\Models\User;
use App\Models\UserTrustedDevice;
use App\Services\TwoFactorAuthService;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class SecuritySettings extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-lock-closed';

    protected static ?string $navigationGroup = 'Settings & Operations';

    protected static ?string $navigationLabel = 'Security';

    protected static ?string $title = 'Security';

    protected static string $view = 'filament.pages.security-settings';

    protected static ?int $navigationSort = 91;

    public string $logoutOtherPassword = '';

    public bool $showLogoutOtherForm = false;

    public bool $showRegenerateForm = false;

    public string $regenPassword = '';

    /** @var array<int, string> */
    public array $generatedRecoveryCodes = [];

    public bool $showDisableForm = false;

    public string $disablePassword = '';

    public string $disableOtp = '';

    public function startDisableFlow(TwoFactorAuthService $tfaService): void
    {
        $user = auth()->user();
        if (! $user instanceof User || ! $user->hasTwoFactorEnabled()) {
            return;
        }

        $this->showDisableForm = true;
        $this->showRegenerateForm = false;

        $result = $tfaService->sendEmailOtp($user, 'reauth', respectCooldown: true);
        if ($result['sent']) {
            Notification::make()
                ->title('Verification OTP Sent')
                ->body("Enter your password and the 6-digit code sent to {$user->getMaskedEmail()}.")
                ->info()
                ->send();
        }
    }

    public function confirmDisableTwoFactor(TwoFactorAuthService $tfaService): void
    {
        $user = auth()->user();
        if (! $user instanceof User) {
            return;
        }

        if (! Hash::check($this->disablePassword, (string) $user->password)) {
            Notification::make()->title('Incorrect Password')->danger()->send();

            return;
        }

        if (! $tfaService->verifyEmailOtp($user, $this->disableOtp, 'reauth')) {
            Notification::make()->title('Invalid or Expired Email OTP')->danger()->send();

            return;
        }

        $tfaService->disableTwoFactor($user, $user);
        session()->forget('auth.two_factor_verified');
        $cookieName = (string) config('cms.two_factor.cookie_name', 'gif_mfa_trust');
        Cookie::queue(Cookie::forget($cookieName, '/admin', config('session.domain')));

        $this->disablePassword = '';
        $this->disableOtp = '';
        $this->showDisableForm = false;
        $this->generatedRecoveryCodes = [];

        Notification::make()
            ->title('Two-step verification disabled')
            ->success()
            ->send();
    }

    public function regenerateCodes(TwoFactorAuthService $tfaService): void
    {
        $user = auth()->user();
        if (! $user instanceof User || ! $user->hasTwoFactorEnabled()) {
            return;
        }

        if (! Hash::check($this->regenPassword, (string) $user->password)) {
            Notification::make()->title('Incorrect Password')->danger()->send();

            return;
        }

        $codes = $tfaService->regenerateRecoveryCodes($user);
        $this->generatedRecoveryCodes = $codes['plain'];
        $this->regenPassword = '';
        $this->showRegenerateForm = false;

        Notification::make()
            ->title('New Recovery Codes Generated')
            ->body('Save or download them now — they are only displayed once.')
            ->success()
            ->send();
    }

    public function revokeTrustedDevice(int $deviceId, TwoFactorAuthService $tfaService): void
    {
        $user = auth()->user();
        if (! $user instanceof User) {
            return;
        }

        if ($tfaService->revokeSingleTrustedDevice($user, $deviceId)) {
            Notification::make()
                ->title('Trusted Device Revoked')
                ->success()
                ->send();
        }
    }

    public function revokeTrustedDevices(TwoFactorAuthService $tfaService): void
    {
        $user = auth()->user();
        if (! $user instanceof User) {
            return;
        }

        $tfaService->revokeTrustedDevices($user);
        $cookieName = (string) config('cms.two_factor.cookie_name', 'gif_mfa_trust');
        Cookie::queue(Cookie::forget($cookieName, '/admin', config('session.domain')));

        Notification::make()
            ->title('All Trusted Devices Revoked')
            ->success()
            ->send();
    }

    public function logoutOtherBrowserSessions(): void
    {
        $user = auth()->user();
        if (! $user instanceof User) {
            return;
        }

        if (! Hash::check($this->logoutOtherPassword, (string) $user->password)) {
            Notification::make()
                ->title('Incorrect Password')
                ->body('Enter your current password to invalidate other browser sessions.')
                ->danger()
                ->send();

            return;
        }

        Auth::logoutOtherDevices($this->logoutOtherPassword);
        $this->logoutOtherPassword = '';
        $this->showLogoutOtherForm = false;

        AuditLog::log('OTHER_SESSIONS_LOGGED_OUT', $user, null, [
            'user_email' => $user->email,
        ]);

        Notification::make()
            ->title('Other Sessions Logged Out')
            ->body('All other browser sessions have been signed out cleanly.')
            ->success()
            ->send();
    }

    public function endSession(string $sessionId): void
    {
        $user = auth()->user();
        if (! $user instanceof User || ! Schema::hasTable('sessions')) {
            return;
        }

        DB::table('sessions')
            ->where('id', $sessionId)
            ->where('user_id', $user->id)
            ->delete();

        Notification::make()->title('Session Ended')->success()->send();
    }

    public function getTrustedDevicesProperty(): Collection
    {
        $userId = auth()->id();
        if (! $userId || ! Schema::hasTable('user_trusted_devices')) {
            return collect();
        }

        return UserTrustedDevice::query()
            ->where('user_id', $userId)
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->latest('last_used_at')
            ->get();
    }

    public function getOtherSessionsProperty(): Collection
    {
        $userId = auth()->id();
        if (! $userId || config('session.driver') !== 'database' || ! Schema::hasTable('sessions')) {
            return collect();
        }

        $currentId = session()->getId();

        return DB::table('sessions')
            ->where('user_id', $userId)
            ->where('id', '!=', $currentId)
            ->orderByDesc('last_activity')
            ->get();
    }

    public function getCurrentDeviceLabelProperty(): string
    {
        return TwoFactorAuthService::describeDevice(request()->userAgent());
    }

    public function getSecurityEventsProperty(): Collection
    {
        $userId = auth()->id();
        if (! $userId) {
            return collect();
        }

        return AuditLog::query()
            ->where(function ($q) use ($userId): void {
                $q->where('user_id', $userId)
                    ->orWhere(function ($sub) use ($userId): void {
                        $sub->where('auditable_type', User::class)->where('auditable_id', $userId);
                    });
            })
            ->latest('created_at')
            ->limit(8)
            ->get();
    }
}
