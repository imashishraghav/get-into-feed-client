<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $table = 'marketing_campaigns';

    protected $fillable = [
        'name',
        'slug',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'budget',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
