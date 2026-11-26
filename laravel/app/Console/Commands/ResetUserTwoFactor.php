<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\TwoFactorAuthService;
use Illuminate\Console\Command;

class ResetUserTwoFactor extends Command
{
    protected $signature = 'user:reset-2fa
                            {email : Email address of the user whose 2FA should be reset}
                            {--force : Skip confirmation prompt}';

    protected $description = 'Emergency CLI reset for a user\'s two-factor authentication (Email OTP & recovery codes)';

    public function handle(TwoFactorAuthService $tfaService): int
    {
        $email = strtolower(trim((string) $this->argument('email')));
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email [{$email}].");

            return self::FAILURE;
        }

        if (! $user->hasTwoFactorEnabled() && empty($user->two_factor_secret)) {
            $this->warn("User [{$email}] does not currently have 2FA configured.");

            return self::SUCCESS;
        }

        if (! $this->option('force') && ! $this->confirm("Reset 2FA for {$user->name} <{$user->email}>?", false)) {
            $this->info('Operation cancelled.');

            return self::SUCCESS;
        }

        $tfaService->disableTwoFactor($user);

        AuditLog::create([
            'user_id' => null,
            'user_email' => 'cli@getintofeed.com',
            'action' => 'MFA_CLI_RESET',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'new_values' => [
                'target_email' => $user->email,
                'reset_via' => 'artisan user:reset-2fa',
            ],
            'ip_address' => '127.0.0.1',
            'user_agent' => 'CLI',
        ]);

        $this->info("Two-factor authentication has been reset for {$user->email}.");

        return self::SUCCESS;
    }
}
