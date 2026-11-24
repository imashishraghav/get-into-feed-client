<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'crm_leads';

    protected $fillable = [
        'lead_code',
        'name',
        'email',
        'phone',
        'whatsapp',
        'company',
        'city',
        'industry',
        'website',
        'interested_service',
        'message',
        'budget',
        'source',
        'page_url',
        'page_title',
        'referrer',
        'form_type',
        'ip_address',
        'user_agent',
        'campaign_id',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',
        'fbclid',
        'consent_at',
        'consent_ip',
        'status',
        'is_test',
        'priority',
        'score',
        'stage',
        'lost_reason',
        'sla_due_at',
        'first_response_at',
        'converted_client_id',
        'notification_sent_at',
        'notification_error',
        'notification_attempts',
        'assigned_user_id',
        'next_follow_up_at',
    ];

    protected $casts = [
        'next_follow_up_at' => 'datetime',
        'notification_sent_at' => 'datetime',
        'notification_attempts' => 'integer',
        'consent_at' => 'datetime',
        'sla_due_at' => 'datetime',
        'first_response_at' => 'datetime',
        'score' => 'integer',
        'is_test' => 'boolean',
    ];

    /**
     * Scope query to only real production leads (exclude QA/bots/test leads).
     */
    public function scopeProduction($query)
    {
        return $query->where('is_test', false);
    }

    /**
     * Scope query to only test leads.
     */
    public function scopeTests($query)
    {
        return $query->where('is_test', true);
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function activities()
    {
        return $this->hasMany(Activity::class, 'lead_id');
    }

    public function notes()
    {
        return $this->hasMany(CrmNote::class, 'lead_id');
    }

    public function opportunities()
    {
        return $this->hasMany(Opportunity::class, 'lead_id');
    }

    public function tasks()
    {
        return $this->hasMany(CrmTask::class, 'lead_id');
    }

    public function events()
    {
        return $this->hasMany(CrmLeadEvent::class, 'lead_id')->orderBy('created_at', 'desc');
    }

    public function convertedClient()
    {
        return $this->belongsTo(CrmRetainedClient::class, 'converted_client_id');
    }
}
