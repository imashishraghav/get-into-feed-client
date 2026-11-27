<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegalPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'last_updated_at',
        'status',
    ];

    protected $casts = [
        'last_updated_at' => 'datetime',
    ];

    public function seo()
    {
        return $this->morphOne(SeoMetadata::class, 'seoble');
    }
}
