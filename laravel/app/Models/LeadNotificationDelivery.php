<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadNotificationDelivery extends Model
{
    protected $table = 'lead_notification_deliveries';

    protected $fillable = [
        'lead_key',
        'channel',
        'status',
        'attempts',
        'provider_message_id',
        'last_error',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'attempts' => 'integer',
            'sent_at' => 'datetime',
        ];
    }
}
