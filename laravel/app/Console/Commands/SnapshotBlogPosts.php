<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use App\Services\BlogPostService;
use Illuminate\Console\Command;

class SnapshotBlogPosts extends Command
{
    protected $signature = 'cms:snapshot-posts
                            {--all : Capture a fresh snapshot even for posts that already have revisions}
                            {--summary=Pre-upgrade baseline snapshot : Revision summary label}';

    protected $description = 'Snapshot existing blog posts into post_revisions before content or editor upgrades';

    public function handle(BlogPostService $blogPostService): int
    {
        $captureAll = (bool) $this->option('all');
        $summary = (string) $this->option('summary');
        $captured = 0;
        $skipped = 0;

        BlogPost::withTrashed()
            ->orderBy('id')
            ->chunkById(50, function ($posts) use ($blogPostService, $captureAll, $summary, &$captured, &$skipped): void {
                foreach ($posts as $post) {
                    if (! $captureAll && $post->postRevisions()->exists()) {
                        $skipped++;

                        continue;
                    }

                    $blogPostService->captureRevision($post, null, 'manual', $summary);
                    $captured++;
                }
            });

        $this->info("Snapshot complete: {$captured} captured, {$skipped} skipped (already snapshotted).");

        return self::SUCCESS;
    }
}
