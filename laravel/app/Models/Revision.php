<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Revision extends Model
{
    use HasFactory;

    protected $fillable = [
        'revisable_type',
        'revisable_id',
        'user_id',
        'version_number',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function revisable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
