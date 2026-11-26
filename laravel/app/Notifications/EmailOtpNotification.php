<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailOtpNotification extends Notification
{
    public function __construct(
        private readonly string $otpCode,
        private readonly string $purpose = 'login',
        private readonly int $ttlMinutes = 10
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $purposeLabel = match ($this->purpose) {
            'setup' => 'Two-Factor Authentication Enrollment',
            'reauth' => 'Sensitive Action Verification',
            default => 'Admin Panel Sign-In Verification',
        };

        return (new MailMessage)
            ->subject("{$this->otpCode} is your GetIntoFeed verification code")
            ->greeting("Hello {$notifiable->name},")
            ->line("Use this one-time 6-digit verification code for {$purposeLabel}:")
            ->line("**{$this->otpCode}**")
            ->line("This code expires in {$this->ttlMinutes} minutes and can only be used once.")
            ->line('If you did not request this code, secure your account password immediately.');
    }
}
