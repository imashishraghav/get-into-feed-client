<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Award extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'organization',
        'year',
        'category',
        'description',
        'badge_media_id',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function badge()
    {
        return $this->belongsTo(Media::class, 'badge_media_id');
    }
}
