<?php

namespace App\Policies;

use App\Models\Media;
use App\Models\User;

class MediaPolicy
{
    public function viewAny(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor', 'author', 'seo_manager', 'viewer'], true)
            || $user->hasCmsPermission('media.view');
    }

    public function view(User $user, Media $media): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor', 'author'], true)
            || $user->hasCmsPermission('media.upload');
    }

    public function update(User $user, Media $media): bool
    {
        if (! $user->is_active) {
            return false;
        }

        if ($user->isAuthor()) {
            return (int) $media->uploaded_by_user_id === (int) $user->id;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor'], true)
            || $user->hasCmsPermission('media.upload');
    }

    public function delete(User $user, Media $media): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || in_array($user->role, ['admin', 'content_manager', 'editor'], true)
            || $user->hasCmsPermission('media.delete');
    }
}
