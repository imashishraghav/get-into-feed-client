<?php

namespace App\Repositories;

use App\Models\PostRevision;
use Illuminate\Database\Eloquent\Collection;

class RevisionRepository
{
    public function forPost(int $postId, int $limit = 50): Collection
    {
        return PostRevision::query()
            ->with('user:id,name,email')
            ->where('blog_post_id', $postId)
            ->orderByDesc('revision_number')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();
    }

    public function findForPost(int $postId, int $revisionId): PostRevision
    {
        return PostRevision::query()
            ->with('user:id,name,email')
            ->where('blog_post_id', $postId)
            ->findOrFail($revisionId);
    }

    public function nextRevisionNumber(int $postId): int
    {
        $max = PostRevision::query()
            ->where('blog_post_id', $postId)
            ->max('revision_number');

        return ((int) $max) + 1;
    }
}
