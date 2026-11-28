<?php

namespace App\Jobs;

use App\Events\PostPublished;
use App\Models\BlogPost;
use App\Services\AuditLogService;
use App\Services\BlogPostService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class PublishScheduledPostJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public readonly int $blogPostId) {}

    public function handle(BlogPostService $blogPostService, AuditLogService $audit): void
    {
        DB::transaction(function () use ($blogPostService, $audit): void {
            $post = BlogPost::query()->lockForUpdate()->find($this->blogPostId);
            if (! $post || $post->status !== 'scheduled') {
                return;
            }

            $dueAt = $post->scheduled_at ?? $post->scheduled_for;
            $now = now(config('app.timezone', 'Asia/Kolkata'));
            if ($dueAt && $dueAt->greaterThan($now)) {
                return;
            }

            $before = [
                'status' => $post->status,
                'scheduled_at' => $dueAt?->toIso8601String(),
                'published_at' => $post->published_at?->toIso8601String(),
            ];

            $post->status = 'published';
            $post->published_at = $dueAt ?? $now;
            $post->scheduled_at = null;
            $post->version = ((int) $post->version) + 1;
            $post->save();

            $blogPostService->syncSeoAndSchema($post);
            $blogPostService->captureRevision($post, null, 'publish', 'Published by scheduled job');

            $audit->record('SCHEDULED_PUBLISH', $post, $before, [
                'status' => 'published',
                'published_at' => $post->published_at?->toIso8601String(),
                'published_via' => self::class,
            ]);

            PostPublished::dispatch($post);
        });
    }
}
