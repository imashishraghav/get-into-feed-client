<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'department',
        'location',
        'type',
        'description',
        'requirements',
        'benefits',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
        'sort_order' => 'integer',
    ];
}
