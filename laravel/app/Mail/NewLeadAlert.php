<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewLeadAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public array $lead) {}

    public function envelope(): Envelope
    {
        $name = $this->lead['name'] ?? 'Website visitor';

        return new Envelope(
            subject: "New GetIntoFeed website lead — {$name}"
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.leads.new-lead'
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
