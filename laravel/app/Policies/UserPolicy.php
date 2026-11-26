<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isAdminOrHigher() || $user->hasCmsPermission('users.manage');
    }

    public function view(User $user, User $target): bool
    {
        return $this->viewAny($user) || (int) $user->id === (int) $target->id;
    }

    public function create(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function update(User $user, User $target): bool
    {
        if (! $this->viewAny($user)) {
            return false;
        }

        return $target->role !== 'superadmin' || $user->isSuperAdmin();
    }

    public function delete(User $user, User $target): bool
    {
        if (! $this->viewAny($user)) {
            return false;
        }

        return (int) $user->id !== (int) $target->id
            && ($target->role !== 'superadmin' || $user->isSuperAdmin());
    }
}
