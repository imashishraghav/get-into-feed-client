<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo_media_id',
        'website_url',
        'industry',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function logo()
    {
        return $this->belongsTo(Media::class, 'logo_media_id');
    }
}
