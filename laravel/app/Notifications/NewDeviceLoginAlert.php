<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewDeviceLoginAlert extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $ipAddress,
        private readonly bool $trustedDeviceIssued = false
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $maskedIp = $this->maskIp($this->ipAddress);

        return (new MailMessage)
            ->subject('New Admin Sign-In Verified — GetIntoFeed CMS')
            ->line('A Two-Factor Authentication verification succeeded for your admin account.')
            ->line('Source Network (masked): '.$maskedIp)
            ->line('Browser Trust Issued (30 days): '.($this->trustedDeviceIssued ? 'Yes' : 'No'))
            ->action('Review Security Settings', url('/admin/security-settings'))
            ->line('If this was not you, click "Revoke All Trusted Devices" and reset your password immediately.');
    }

    private function maskIp(string $ip): string
    {
        if (str_contains($ip, '.')) {
            $parts = explode('.', $ip);
            if (count($parts) === 4) {
                return "{$parts[0]}.{$parts[1]}.{$parts[2]}.xxx";
            }
        }

        return 'masked-network';
    }
}
