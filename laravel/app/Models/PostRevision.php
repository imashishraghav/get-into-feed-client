<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PostRevision extends Model
{
    use HasFactory;

    protected $table = 'post_revisions';

    public $timestamps = false;

    protected $fillable = [
        'uuid',
        'blog_post_id',
        'user_id',
        'revision_number',
        'type',
        'title',
        'slug',
        'excerpt',
        'content_html',
        'content_json',
        'meta_snapshot',
        'change_summary',
        'version_at_capture',
        'created_at',
    ];

    protected $casts = [
        'content_json' => 'array',
        'meta_snapshot' => 'array',
        'revision_number' => 'integer',
        'version_at_capture' => 'integer',
        'created_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (PostRevision $revision): void {
            if (empty($revision->uuid)) {
                $revision->uuid = (string) Str::uuid();
            }
            if (empty($revision->created_at)) {
                $revision->created_at = now();
            }
        });
    }

    public function blogPost(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class, 'blog_post_id')->withTrashed();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
