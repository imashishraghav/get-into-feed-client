<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostAutosave extends Model
{
    use HasFactory;

    protected $table = 'post_autosaves';

    protected $fillable = [
        'blog_post_id',
        'user_id',
        'title',
        'excerpt',
        'content_html',
        'content_json',
        'meta_snapshot',
        'base_version',
    ];

    protected $casts = [
        'content_json' => 'array',
        'meta_snapshot' => 'array',
        'base_version' => 'integer',
    ];

    public function blogPost(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'blog_post_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
