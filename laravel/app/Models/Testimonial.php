<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_name',
        'client_role',
        'company',
        'quote',
        'rating',
        'service_tag',
        'result_metric',
        'avatar_media_id',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
        'sort_order' => 'integer',
    ];

    public function avatar()
    {
        return $this->belongsTo(Media::class, 'avatar_media_id');
    }
}
