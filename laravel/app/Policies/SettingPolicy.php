<?php

namespace App\Policies;

use App\Models\Setting;
use App\Models\User;

class SettingPolicy
{
    public function viewAny(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isAdminOrHigher() || $user->hasCmsPermission('settings.view');
    }

    public function view(User $user, Setting $setting): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->updateAny($user);
    }

    public function update(User $user, Setting $setting): bool
    {
        return $this->updateAny($user);
    }

    public function updateAny(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isAdminOrHigher() || $user->hasCmsPermission('settings.manage');
    }

    public function delete(User $user, Setting $setting): bool
    {
        return $user->is_active && $user->isSuperAdmin();
    }
}
