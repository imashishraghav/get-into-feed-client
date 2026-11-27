<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opportunity extends Model
{
    use HasFactory;

    protected $table = 'crm_opportunities';

    protected $fillable = [
        'company_id',
        'lead_id',
        'title',
        'value',
        'stage',
        'probability',
        'expected_close_at',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'probability' => 'integer',
        'expected_close_at' => 'date',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }
}
