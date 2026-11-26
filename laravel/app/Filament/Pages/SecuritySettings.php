<?php

namespace App\Filament\Pages;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\TwoFactorAuthService;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

class SecuritySettings extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-lock-closed';

    protected static ?string $navigationGroup = 'Settings & Operations';

    protected static ?string $navigationLabel = 'Account Security (2FA)';

    protected static ?string $title = 'Account Security & Two-Factor Authentication';

    protected static string $view = 'filament.pages.security-settings';

    protected static ?int $navigationSort = 91;

    public string $logoutOtherPassword = '';

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
            ->title('Trusted Devices Revoked')
            ->body('All 30-day trusted browser cookies have been invalidated.')
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

        AuditLog::log('OTHER_SESSIONS_LOGGED_OUT', $user, null, [
            'user_email' => $user->email,
        ]);

        Notification::make()
            ->title('Other Sessions Logged Out')
            ->body('All other browser sessions have been signed out cleanly.')
            ->success()
            ->send();
    }

    public function getSecurityEventsProperty()
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
            ->limit(10)
            ->get();
    }
}
