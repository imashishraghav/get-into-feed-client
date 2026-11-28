<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrmTask extends Model
{
    use HasFactory;

    protected $table = 'crm_tasks';

    protected $fillable = [
        'lead_id',
        'client_id',
        'title',
        'description',
        'type',
        'priority',
        'status',
        'due_at',
        'completed_at',
        'assigned_user_id',
    ];

    protected $casts = [
        'due_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }

    public function client()
    {
        return $this->belongsTo(CrmRetainedClient::class, 'client_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'Pending')->where('due_at', '<', now());
    }
}
