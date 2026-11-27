<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewLeadNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Lead $lead;

    /**
     * Create a new message instance.
     */
    public function __construct(Lead $lead)
    {
        $this->lead = $lead;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $senderAddress = config('mail.from.address', 'hello@getintofeed.com');
        $senderName = config('mail.from.name', 'GetIntoFeed Lead Engine');
        $serviceName = $this->lead->interested_service ?: 'Growth Consultation';

        return new Envelope(
            from: new Address($senderAddress, $senderName),
            replyTo: [
                new Address(
                    filter_var($this->lead->email, FILTER_VALIDATE_EMAIL) ? $this->lead->email : $senderAddress,
                    $this->lead->name ?: 'Lead'
                ),
            ],
            subject: "⚡ New Growth Enquiry [{$this->lead->lead_code}]: {$this->lead->name} — {$serviceName}"
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.new_lead',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
