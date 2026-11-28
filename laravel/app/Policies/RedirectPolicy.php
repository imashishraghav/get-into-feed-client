<?php

namespace App\Policies;

use App\Models\Redirect;
use App\Models\User;

class RedirectPolicy
{
    public function viewAny(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isEditorOrHigher()
            || $user->role === 'seo_manager'
            || $user->hasCmsPermission('redirects.manage');
    }

    public function view(User $user, Redirect $redirect): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Redirect $redirect): bool
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Redirect $redirect): bool
    {
        return $this->viewAny($user);
    }
}
