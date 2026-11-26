<x-filament-panels::page>
    @php
        $user = auth()->user();
        $has2fa = (bool) $user?->hasTwoFactorEnabled();
        $inGrace = (bool) $user?->isInTwoFactorGracePeriod();
        $remainingCodes = $user?->getRemainingRecoveryCodesCount() ?? 0;
    @endphp

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <div class="gif-card" style="padding: 20px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:12px;">
                <h2 style="font-size:15px; font-weight:800; margin:0;">Two-Factor Authentication (TOTP)</h2>
                <span class="gif-badge {{ $has2fa ? 'gif-badge-success' : 'gif-badge-warn' }}">
                    {{ $has2fa ? ($inGrace ? 'Active (Grace)' : 'Active') : 'Not Enrolled' }}
                </span>
            </div>

            <p style="font-size:13px; color:var(--gif-text-muted); line-height:1.55; margin-bottom:14px;">
                @if ($has2fa)
                    TOTP protection is active with local QR enrollment, single-use recovery codes, and same-timestep replay protection.
                    @if ($inGrace && $user->two_factor_grace_until)
                        Grace window ends <strong>{{ $user->two_factor_grace_until->timezone('Asia/Kolkata')->format('M d, Y H:i') }} IST</strong>.
                    @endif
                @else
                    Protect your admin account with an authenticator app and 8 emergency single-use recovery codes.
                @endif
            </p>

            <div style="font-size:12.5px; color:var(--gif-text-body); margin-bottom:14px;">
                Remaining recovery codes: <strong>{{ $remainingCodes }}</strong>
            </div>

            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                <a href="/admin/two-factor/setup" class="gif-btn gif-btn-primary">
                    {{ $has2fa ? 'Manage 2FA & Recovery Codes' : 'Set Up 2FA Now' }}
                </a>
                @if ($has2fa)
                    <button type="button" wire:click="revokeTrustedDevices" class="gif-btn gif-btn-secondary">
                        Revoke Trusted Devices
                    </button>
                @endif
            </div>
        </div>

        <div class="gif-card" style="padding: 20px;">
            <h2 style="font-size:15px; font-weight:800; margin:0 0 8px;">Active Browser Sessions</h2>
            <p style="font-size:13px; color:var(--gif-text-muted); line-height:1.55; margin-bottom:14px;">
                Sign out all other browser sessions across devices by confirming your current password.
            </p>

            <form wire:submit="logoutOtherBrowserSessions" style="display:flex; flex-direction:column; gap:10px;">
                <input
                    type="password"
                    wire:model="logoutOtherPassword"
                    placeholder="Enter current password..."
                    class="gif-input"
                    required
                />
                <button type="submit" class="gif-btn gif-btn-secondary">Log Out Other Browser Sessions</button>
            </form>
        </div>
    </div>

    <div class="gif-card" style="padding: 20px; margin-top: 16px;">
        <h2 style="font-size:15px; font-weight:800; margin:0 0 12px;">Recent Security &amp; 2FA Audit Events</h2>
        @if ($this->securityEvents->isEmpty())
            <div style="font-size:13px; color:var(--gif-text-muted);">No recent security events recorded.</div>
        @else
            <div style="display:flex; flex-direction:column; gap:8px;">
                @foreach ($this->securityEvents as $event)
                    <div style="padding:10px 12px; border-radius:8px; background:var(--gif-bg-soft); border:1px solid var(--gif-border); display:flex; justify-content:space-between; gap:10px; font-size:12.5px;">
                        <strong>{{ $event->action }}</strong>
                        <span style="color:var(--gif-text-muted);">{{ $event->created_at?->timezone('Asia/Kolkata')->format('M d, Y H:i') }} IST</span>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</x-filament-panels::page>
