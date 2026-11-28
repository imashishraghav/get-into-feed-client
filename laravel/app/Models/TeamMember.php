<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'bio',
        'expertise',
        'avatar_media_id',
        'linkedin_url',
        'twitter_url',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'expertise' => 'array',
        'sort_order' => 'integer',
    ];

    public function avatar()
    {
        return $this->belongsTo(Media::class, 'avatar_media_id');
    }
}
