<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'crm_leads';

    protected static function booted()
    {
        static::creating(function ($lead) {
            if (empty($lead->uuid)) {
                $lead->uuid = (string) Str::uuid();
            }
            if (empty($lead->lead_code)) {
                $lead->lead_code = 'ENQ-'.strtoupper(Str::random(8));
            }
            if (empty($lead->crm_sync_status)) {
                $lead->crm_sync_status = 'pending';
            }
        });
    }

    protected $fillable = [
        'uuid',
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
        'crm_sync_status',
        'crm_synced_at',
        'crm_sync_attempts',
        'crm_sync_error',
        'crm_lead_id',
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
        'crm_synced_at' => 'datetime',
        'crm_sync_attempts' => 'integer',
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

    /**
     * Scope query to leads successfully synced to external CRM.
     */
    public function scopeSynced($query)
    {
        return $query->where('crm_sync_status', 'synced');
    }

    /**
     * Scope query to leads pending sync to external CRM.
     */
    public function scopePendingSync($query)
    {
        return $query->where('crm_sync_status', 'pending');
    }

    /**
     * Scope query to leads whose external CRM sync failed.
     */
    public function scopeFailedSync($query)
    {
        return $query->where('crm_sync_status', 'failed');
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
