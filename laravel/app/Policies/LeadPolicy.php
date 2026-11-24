<?php

namespace App\Policies;

use App\Models\Lead;
use App\Models\User;

class LeadPolicy
{
    /**
     * Determine whether the user can view any leads.
     */
    public function viewAny(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || $user->hasCmsPermission('leads.view')
            || in_array($user->role, ['superadmin', 'admin', 'sales_crm']);
    }

    /**
     * Determine whether the user can view the specific lead.
     */
    public function view(User $user, Lead $lead): bool
    {
        return $this->viewAny($user);
    }

    /**
     * Determine whether the user can create leads.
     */
    public function create(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || $user->hasCmsPermission('leads.manage')
            || in_array($user->role, ['superadmin', 'admin', 'sales_crm']);
    }

    /**
     * Determine whether the user can update the lead.
     */
    public function update(User $user, Lead $lead): bool
    {
        return $this->create($user);
    }

    /**
     * Determine whether the user can delete the lead.
     */
    public function delete(User $user, Lead $lead): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || $user->hasCmsPermission('leads.delete');
    }

    /**
     * Determine whether the user can export leads.
     */
    public function export(User $user): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->isSuperAdmin()
            || $user->hasCmsPermission('leads.export')
            || in_array($user->role, ['superadmin', 'admin', 'sales_crm']);
    }
}
