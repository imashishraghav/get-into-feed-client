<?php

namespace App\Filament;

use Filament\Resources\Resource;
use Illuminate\Database\Eloquent\Model;

/**
 * Shared server-side permission checks for Filament resources.
 * Resource visibility is only a convenience; every record operation is checked
 * again by Filament before it is run.
 */
abstract class ManagedResource extends Resource
{
    /** @var array<string, array<string, ?string>> */
    private const PERMISSIONS = [
        'AuditLog' => ['view' => 'audit.view'],
        'Award' => ['view' => 'awards.manage', 'manage' => 'awards.manage'],
        'BlogPost' => ['view' => 'blog.view', 'create' => 'blog.create', 'edit' => 'blog.edit', 'delete' => 'blog.delete'],
        'Campaign' => ['view' => 'campaigns.manage', 'manage' => 'campaigns.manage'],
        'Career' => ['view' => 'careers.manage', 'manage' => 'careers.manage'],
        'CaseStudy' => ['view' => 'case_studies.manage', 'manage' => 'case_studies.manage'],
        'Client' => ['view' => 'clients.manage', 'manage' => 'clients.manage'],
        'Company' => ['view' => 'crm.accounts.manage', 'manage' => 'crm.accounts.manage'],
        'Contact' => ['view' => 'crm.accounts.manage', 'manage' => 'crm.accounts.manage'],
        'CrmTask' => ['view' => 'leads.view', 'manage' => 'leads.manage'],
        'CrmRetainedClient' => ['view' => 'crm.accounts.manage', 'manage' => 'crm.accounts.manage'],
        'Faq' => ['view' => 'faqs.manage', 'manage' => 'faqs.manage'],
        'Lead' => ['view' => 'leads.view', 'manage' => 'leads.manage'],
        'LegalPage' => ['view' => 'legal.manage', 'manage' => 'legal.manage'],
        'Media' => ['view' => 'media.view', 'create' => 'media.upload', 'edit' => 'media.upload', 'delete' => 'media.delete'],
        'Opportunity' => ['view' => 'crm.deals.manage', 'manage' => 'crm.deals.manage'],
        'Page' => ['view' => 'pages.view', 'manage' => 'pages.manage'],
        'Redirect' => ['view' => 'redirects.manage', 'manage' => 'redirects.manage'],
        'Role' => ['view' => 'roles.manage', 'manage' => 'roles.manage'],
        'Service' => ['view' => 'services.manage', 'manage' => 'services.manage'],
        'Setting' => ['view' => 'settings.view', 'manage' => 'settings.manage'],
        'Subscriber' => ['view' => 'subscribers.manage', 'manage' => 'subscribers.manage'],
        'TeamMember' => ['view' => 'team.manage', 'manage' => 'team.manage'],
        'Testimonial' => ['view' => 'testimonials.manage', 'manage' => 'testimonials.manage'],
        'User' => ['view' => 'users.manage', 'manage' => 'users.manage'],
    ];

    /** @return array<string, ?string> */
    private static function permissions(): array
    {
        $model = class_basename(static::getModel());

        return self::PERMISSIONS[$model] ?? [];
    }

    private static function allows(?string $permission): bool
    {
        return $permission !== null && (bool) auth()->user()?->hasCmsPermission($permission);
    }

    public static function canViewAny(): bool
    {
        $permissions = self::permissions();

        return self::allows($permissions['view'] ?? $permissions['manage'] ?? null);
    }

    public static function canCreate(): bool
    {
        $permissions = self::permissions();

        return self::allows($permissions['create'] ?? $permissions['manage'] ?? null);
    }

    public static function canEdit(Model $record): bool
    {
        $permissions = self::permissions();

        return self::allows($permissions['edit'] ?? $permissions['manage'] ?? null);
    }

    public static function canDelete(Model $record): bool
    {
        $permissions = self::permissions();

        return self::allows($permissions['delete'] ?? $permissions['manage'] ?? null);
    }

    public static function canDeleteAny(): bool
    {
        $permissions = self::permissions();

        return self::allows($permissions['delete'] ?? $permissions['manage'] ?? null);
    }

    public static function canForceDelete(Model $record): bool
    {
        return static::canDelete($record);
    }

    public static function canForceDeleteAny(): bool
    {
        return static::canDeleteAny();
    }

    public static function canRestore(Model $record): bool
    {
        return static::canEdit($record);
    }

    public static function canRestoreAny(): bool
    {
        return static::canCreate();
    }

    public static function shouldRegisterNavigation(): bool
    {
        return static::canViewAny();
    }
}
