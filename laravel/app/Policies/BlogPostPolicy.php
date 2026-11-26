<?php

namespace App\Policies;

use App\Models\BlogPost;
use App\Models\User;

class BlogPostPolicy
{
    public function viewAny(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'seo_manager', 'editor', 'author', 'viewer'], true)
            || $user->hasCmsPermission('blog.view');
    }

    public function view(User $user, BlogPost $post): bool
    {
        if (! $this->viewAny($user)) {
            return false;
        }

        if ($user->isAuthor()) {
            return (int) $post->author_id === (int) $user->id || $post->status === 'published';
        }

        return true;
    }

    public function create(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor', 'author'], true)
            || $user->hasCmsPermission('blog.create');
    }

    public function update(User $user, BlogPost $post): bool
    {
        if (! $user->is_active) {
            return false;
        }

        if ($user->isAuthor()) {
            return (int) $post->author_id === (int) $user->id;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor'], true)
            || $user->hasCmsPermission('blog.edit');
    }

    public function publish(User $user, ?BlogPost $post = null): bool
    {
        if (! $user->is_active || $user->isAuthor()) {
            return false;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor'], true)
            || $user->hasCmsPermission('blog.publish');
    }

    public function restoreRevision(User $user, BlogPost $post): bool
    {
        if (! $user->is_active || $user->isAuthor()) {
            return false;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor'], true)
            || $user->hasCmsPermission('revisions.restore');
    }

    public function delete(User $user, BlogPost $post): bool
    {
        if (! $user->is_active) {
            return false;
        }

        if ($user->isAuthor()) {
            return (int) $post->author_id === (int) $user->id && $post->status === 'draft';
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor'], true)
            || $user->hasCmsPermission('blog.delete');
    }

    public function restore(User $user, BlogPost $post): bool
    {
        if (! $user->is_active || $user->isAuthor()) {
            return false;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor'], true)
            || $user->hasCmsPermission('blog.edit');
    }

    public function forceDelete(User $user, BlogPost $post): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || $user->role === 'admin'
            || $user->hasCmsPermission('blog.delete');
    }
}
