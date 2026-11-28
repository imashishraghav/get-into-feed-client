<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TwoFactorDisabledAlert extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $reason = 'Disabled by account owner'
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Two-Factor Authentication Disabled — GetIntoFeed CMS')
            ->line('Two-Factor Authentication protection was removed from your GetIntoFeed admin account.')
            ->line('Context: '.$this->reason)
            ->action('Re-enable 2FA Security', url('/admin/two-factor/setup'))
            ->line('If you did not expect this change, contact a Super Administrator immediately.');
    }
}
