<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrmRetainedClient extends Model
{
    use HasFactory;

    protected $table = 'crm_retained_clients';

    protected $fillable = [
        'lead_id',
        'name',
        'company_name',
        'email',
        'phone',
        'website',
        'monthly_retainer',
        'currency',
        'status',
        'start_date',
        'primary_service',
        'notes',
        'assigned_user_id',
    ];

    protected $casts = [
        'monthly_retainer' => 'decimal:2',
        'start_date' => 'date',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function tasks()
    {
        return $this->hasMany(CrmTask::class, 'client_id');
    }
}
