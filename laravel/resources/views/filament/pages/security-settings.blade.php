<x-filament-panels::page>
    @php
        $user = auth()->user();
        $has2fa = (bool) $user?->hasTwoFactorEnabled();
        $inGrace = (bool) $user?->isInTwoFactorGracePeriod();
        $remainingCodes = $user?->getRemainingRecoveryCodesCount() ?? 0;
        $trustedDevices = $this->trustedDevices;
        $otherSessions = $this->otherSessions;
    @endphp

    <style>
        .sec-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
            align-items: start;
        }
        .sec-col {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .sec-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 22px 24px;
            color: #0f172a;
        }
        .sec-card-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
        }
        .sec-title {
            font-size: 1rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
        }
        .sec-desc {
            font-size: 0.875rem;
            color: #64748b;
            line-height: 1.5;
            margin: 0 0 16px;
        }
        .sec-pill {
            display: inline-flex;
            align-items: center;
            padding: 3px 10px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .sec-pill-green { background: #dcfce7; color: #166534; }
        .sec-pill-amber { background: #fef3c7; color: #92400e; }
        .sec-pill-gray { background: #f1f5f9; color: #475569; }
        .sec-btn-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        }
        .sec-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 38px;
            padding: 0 14px;
            border-radius: 9px;
            font-size: 0.84rem;
            font-weight: 600;
            border: 1px solid #cbd5e1;
            background: #ffffff;
            color: #0f172a;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.15s ease;
        }
        .sec-btn:hover { background: #f8fafc; }
        .sec-btn-primary {
            background: #1d4ed8;
            border-color: #1d4ed8;
            color: #ffffff;
        }
        .sec-btn-primary:hover { background: #1e40af; }
        .sec-btn-danger {
            border-color: #fca5a5;
            color: #dc2626;
        }
        .sec-btn-danger:hover { background: #fef2f2; }
        .sec-codes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
            gap: 10px;
            margin-bottom: 16px;
        }
        .sec-code-pill {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 9px 10px;
            text-align: center;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.84rem;
            font-weight: 600;
            color: #334155;
            letter-spacing: 0.04em;
        }
        .sec-list-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 12px 0;
            border-top: 1px solid #f1f5f9;
        }
        .sec-list-row:first-of-type { border-top: none; padding-top: 4px; }
        .sec-list-row:last-of-type { padding-bottom: 2px; }
        .sec-row-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: #0f172a;
        }
        .sec-row-sub {
            font-size: 0.8rem;
            color: #64748b;
            margin-top: 2px;
        }
        .sec-amber-box {
            background: #fefce8;
            border: 1px solid #fde68a;
            border-radius: 14px;
            padding: 18px 22px;
            color: #422006;
        }
        .sec-inline-form {
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid #f1f5f9;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .sec-input {
            width: 100%;
            min-height: 40px;
            padding: 8px 12px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.875rem;
            color: #0f172a;
            background: #ffffff;
        }
        @media (max-width: 960px) {
            .sec-grid { grid-template-columns: 1fr; }
        }
    </style>

    <div class="sec-grid">
        {{-- LEFT COLUMN --}}
        <div class="sec-col">
            {{-- 1. Two-step verification --}}
            <div class="sec-card">
                <div class="sec-card-head">
                    <h2 class="sec-title">Two-step verification</h2>
                    @if ($has2fa)
                        <span class="sec-pill {{ $inGrace ? 'sec-pill-amber' : 'sec-pill-green' }}">
                            {{ $inGrace ? 'Grace' : 'On' }}
                        </span>
                    @else
                        <span class="sec-pill sec-pill-gray">Off</span>
                    @endif
                </div>

                <p class="sec-desc">
                    @if ($has2fa)
                        Email OTP verification ({{ $user->getMaskedEmail() }}). Enabled {{ $user->two_factor_confirmed_at?->timezone('Asia/Kolkata')->format('d M Y') }}.
                        @if ($inGrace && $user->two_factor_grace_until)
                            Grace window ends {{ $user->two_factor_grace_until->timezone('Asia/Kolkata')->format('d M Y H:i') }} IST.
                        @else
                            Required on untrusted sign-ins for Admin and Editor roles.
                        @endif
                    @else
                        Email OTP protection sends a 6-digit one-time code to {{ $user?->getMaskedEmail() }} at sign-in.
                    @endif
                </p>

                <div class="sec-btn-row">
                    @if ($has2fa)
                        <button type="button" wire:click="$toggle('showRegenerateForm')" class="sec-btn">
                            Regenerate recovery codes
                        </button>
                        <button type="button" wire:click="startDisableFlow" class="sec-btn sec-btn-danger">
                            Disable (asks password + code)
                        </button>
                    @else
                        <a href="/admin/two-factor/setup" class="sec-btn sec-btn-primary">
                            Set up Email OTP (2FA)
                        </a>
                    @endif
                </div>

                @if ($showRegenerateForm && $has2fa)
                    <form wire:submit="regenerateCodes" class="sec-inline-form">
                        <input type="password" wire:model="regenPassword" placeholder="Confirm current password..." class="sec-input" required>
                        <div class="sec-btn-row">
                            <button type="submit" class="sec-btn sec-btn-primary">Confirm &amp; regenerate</button>
                            <button type="button" wire:click="$set('showRegenerateForm', false)" class="sec-btn">Cancel</button>
                        </div>
                    </form>
                @endif

                @if ($showDisableForm && $has2fa)
                    <form wire:submit="confirmDisableTwoFactor" class="sec-inline-form">
                        <input type="password" wire:model="disablePassword" placeholder="Current password..." class="sec-input" required>
                        <input type="text" wire:model="disableOtp" maxlength="6" inputmode="numeric" placeholder="6-digit Email OTP sent to {{ $user?->getMaskedEmail() }}" class="sec-input" required>
                        <div class="sec-btn-row">
                            <button type="submit" class="sec-btn sec-btn-danger">Confirm disable 2FA</button>
                            <button type="button" wire:click="$set('showDisableForm', false)" class="sec-btn">Cancel</button>
                        </div>
                    </form>
                @endif
            </div>

            {{-- 2. Recovery codes --}}
            <div class="sec-card">
                <div class="sec-card-head">
                    <h2 class="sec-title">Recovery codes</h2>
                    <span style="font-size:0.82rem; color:#64748b;">{{ $remainingCodes }} of 8 unused</span>
                </div>

                <p class="sec-desc">
                    Each code works once. Codes are stored hashed and are shown only when you generate them.
                </p>

                @if (! empty($generatedRecoveryCodes))
                    <div class="sec-codes-grid" id="live-recovery-codes">
                        @foreach ($generatedRecoveryCodes as $code)
                            <div class="sec-code-pill">{{ $code }}</div>
                        @endforeach
                    </div>
                    <div class="sec-btn-row">
                        <button type="button" class="sec-btn" onclick="copyLiveRecoveryCodes()">Copy</button>
                        <button type="button" class="sec-btn" onclick="downloadLiveRecoveryCodes()">Download .txt</button>
                    </div>
                    <script>
                        function getLiveRecoveryPayload() {
                            return @json(implode("\n", $generatedRecoveryCodes));
                        }
                        function copyLiveRecoveryCodes() {
                            navigator.clipboard.writeText(getLiveRecoveryPayload());
                        }
                        function downloadLiveRecoveryCodes() {
                            const blob = new Blob([getLiveRecoveryPayload() + "\n"], { type: 'text/plain;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'getintofeed-2fa-recovery-codes.txt';
                            a.click();
                            URL.revokeObjectURL(url);
                        }
                    </script>
                @else
                    <div class="sec-codes-grid">
                        @for ($i = 0; $i < max(0, min(8, $remainingCodes)); $i++)
                            <div class="sec-code-pill">•••• ••••</div>
                        @endfor
                        @if ($remainingCodes === 0)
                            <div style="grid-column: 1 / -1; font-size:0.82rem; color:#94a3b8;">
                                No recovery codes generated yet.
                            </div>
                        @endif
                    </div>
                    <div class="sec-btn-row">
                        @if ($has2fa)
                            <a href="/admin/two-factor/setup" class="sec-btn">Manage 2FA &amp; Recovery Codes</a>
                        @endif
                    </div>
                @endif
            </div>
        </div>

        {{-- RIGHT COLUMN --}}
        <div class="sec-col">
            {{-- 3. Trusted devices --}}
            <div class="sec-card">
                <div class="sec-card-head">
                    <h2 class="sec-title">Trusted devices</h2>
                    @if ($trustedDevices->isNotEmpty())
                        <button type="button" wire:click="revokeTrustedDevices" class="sec-btn" style="min-height:32px; font-size:0.78rem; padding:0 10px;">
                            Revoke all
                        </button>
                    @endif
                </div>

                @if ($trustedDevices->isEmpty())
                    <p class="sec-desc" style="margin-bottom:0;">
                        No active trusted devices. Check "Remember this device for 30 days" during Email OTP sign-in to add one.
                    </p>
                @else
                    @foreach ($trustedDevices as $device)
                        <div class="sec-list-row">
                            <div>
                                <div class="sec-row-title">{{ $device->device_name }}</div>
                                <div class="sec-row-sub">
                                    {{ $device->location_hint ?: 'Verified network' }} ·
                                    last used {{ $device->last_used_at?->diffForHumans() ?? 'recently' }} ·
                                    {{ $device->daysRemaining() }} days left
                                </div>
                            </div>
                            <button type="button" wire:click="revokeTrustedDevice({{ $device->id }})" class="sec-btn">
                                Revoke
                            </button>
                        </div>
                    @endforeach
                @endif
            </div>

            {{-- 4. Active sessions --}}
            <div class="sec-card">
                <div class="sec-card-head">
                    <h2 class="sec-title">Active sessions</h2>
                    <button type="button" wire:click="$toggle('showLogoutOtherForm')" class="sec-btn">
                        Log out other devices
                    </button>
                </div>

                <div class="sec-list-row">
                    <div>
                        <div class="sec-row-title">This device · {{ $this->currentDeviceLabel }}</div>
                        <div class="sec-row-sub">Signed in {{ now()->timezone('Asia/Kolkata')->format('H:i') }} IST today</div>
                    </div>
                    <span class="sec-pill sec-pill-green">Current</span>
                </div>

                @foreach ($otherSessions as $sess)
                    <div class="sec-list-row">
                        <div>
                            <div class="sec-row-title">{{ \App\Services\TwoFactorAuthService::describeDevice($sess->user_agent ?? '') }}</div>
                            <div class="sec-row-sub">
                                Active {{ \Illuminate\Support\Carbon::createFromTimestamp($sess->last_activity)->timezone('Asia/Kolkata')->format('d M H:i') }} IST
                            </div>
                        </div>
                        <button type="button" wire:click="endSession('{{ $sess->id }}')" style="background:none; border:none; color:#2563eb; font-size:0.84rem; font-weight:600; cursor:pointer;">
                            End session
                        </button>
                    </div>
                @endforeach

                @if ($showLogoutOtherForm)
                    <form wire:submit="logoutOtherBrowserSessions" class="sec-inline-form">
                        <input type="password" wire:model="logoutOtherPassword" placeholder="Confirm password to log out other devices..." class="sec-input" required>
                        <div class="sec-btn-row">
                            <button type="submit" class="sec-btn sec-btn-primary">Confirm log out other devices</button>
                            <button type="button" wire:click="$set('showLogoutOtherForm', false)" class="sec-btn">Cancel</button>
                        </div>
                    </form>
                @endif
            </div>

            {{-- 5. Re-authentication callout --}}
            <div class="sec-amber-box">
                <div style="font-size:0.95rem; font-weight:700; margin-bottom:6px;">Re-authentication</div>
                <div style="font-size:0.85rem; line-height:1.5; color:#713f12;">
                    Changing a password, disabling 2FA, changing roles, deleting users and exporting leads ask for your password and a fresh code.
                </div>
            </div>
        </div>
    </div>
</x-filament-panels::page>
