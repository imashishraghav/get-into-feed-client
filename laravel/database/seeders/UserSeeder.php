<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Define standard permissions
        $permissions = [
            // Website
            ['name' => 'pages.view', 'label' => 'View Pages', 'group' => 'website'],
            ['name' => 'pages.manage', 'label' => 'Manage Pages', 'group' => 'website'],
            ['name' => 'services.manage', 'label' => 'Manage Services', 'group' => 'website'],
            ['name' => 'case_studies.manage', 'label' => 'Manage Case Studies', 'group' => 'website'],
            ['name' => 'testimonials.manage', 'label' => 'Manage Testimonials', 'group' => 'website'],
            ['name' => 'team.manage', 'label' => 'Manage Team', 'group' => 'website'],
            ['name' => 'faqs.manage', 'label' => 'Manage FAQs', 'group' => 'website'],
            ['name' => 'awards.manage', 'label' => 'Manage Awards', 'group' => 'website'],
            ['name' => 'clients.manage', 'label' => 'Manage Clients', 'group' => 'website'],
            ['name' => 'careers.manage', 'label' => 'Manage Careers', 'group' => 'website'],
            ['name' => 'legal.manage', 'label' => 'Manage Legal Pages', 'group' => 'website'],

            // Content Studio
            ['name' => 'blog.view', 'label' => 'View Blog Posts', 'group' => 'content_studio'],
            ['name' => 'blog.create', 'label' => 'Create Blog Posts', 'group' => 'content_studio'],
            ['name' => 'blog.edit', 'label' => 'Edit Blog Posts', 'group' => 'content_studio'],
            ['name' => 'blog.publish', 'label' => 'Publish Blog Posts', 'group' => 'content_studio'],
            ['name' => 'blog.delete', 'label' => 'Delete Blog Posts', 'group' => 'content_studio'],
            ['name' => 'revisions.view', 'label' => 'View Revisions', 'group' => 'content_studio'],
            ['name' => 'revisions.restore', 'label' => 'Restore Revisions', 'group' => 'content_studio'],

            // CRM
            ['name' => 'leads.view', 'label' => 'View Leads', 'group' => 'crm'],
            ['name' => 'leads.manage', 'label' => 'Manage Leads', 'group' => 'crm'],
            ['name' => 'leads.export', 'label' => 'Export Leads', 'group' => 'crm'],
            ['name' => 'crm.accounts.manage', 'label' => 'Manage Companies & Contacts', 'group' => 'crm'],
            ['name' => 'crm.deals.manage', 'label' => 'Manage Opportunities', 'group' => 'crm'],

            // Marketing
            ['name' => 'campaigns.manage', 'label' => 'Manage Marketing Campaigns', 'group' => 'marketing'],
            ['name' => 'subscribers.manage', 'label' => 'Manage Subscribers', 'group' => 'marketing'],
            ['name' => 'redirects.manage', 'label' => 'Manage URL Redirects', 'group' => 'marketing'],
            ['name' => 'seo.manage', 'label' => 'Manage Global SEO & Meta', 'group' => 'marketing'],

            // Media
            ['name' => 'media.view', 'label' => 'View Media Library', 'group' => 'media'],
            ['name' => 'media.upload', 'label' => 'Upload Media', 'group' => 'media'],
            ['name' => 'media.delete', 'label' => 'Delete Media', 'group' => 'media'],

            // People
            ['name' => 'users.manage', 'label' => 'Manage Admin Users', 'group' => 'people'],
            ['name' => 'roles.manage', 'label' => 'Manage Roles & Permissions', 'group' => 'people'],

            // Settings
            ['name' => 'settings.view', 'label' => 'View Global Settings', 'group' => 'settings'],
            ['name' => 'settings.manage', 'label' => 'Manage Global Settings', 'group' => 'settings'],

            // System & Governance
            ['name' => 'audit.view', 'label' => 'View Audit Logs', 'group' => 'security_governance'],
            ['name' => 'system.view', 'label' => 'View System Status', 'group' => 'system'],
        ];

        $permissionModels = [];
        foreach ($permissions as $p) {
            $permissionModels[$p['name']] = Permission::updateOrCreate(
                ['name' => $p['name']],
                ['label' => $p['label'], 'group' => $p['group']]
            );
        }

        // 2. Define Roles
        $allPermissionNames = array_column($permissions, 'name');

        $roles = [
            'superadmin' => [
                'label' => 'Super Administrator',
                'description' => 'Full unrestricted platform access, governance, settings, and destructive actions.',
                'permissions' => $allPermissionNames,
            ],
            'admin' => [
                'label' => 'Administrator',
                'description' => 'Operational management of CMS, media, CRM, users, backups, and marketing.',
                'permissions' => array_values(array_filter($allPermissionNames, fn ($k) => $k !== 'roles.manage')),
            ],
            'content_manager' => [
                'label' => 'Content Manager',
                'description' => 'Full editorial control over pages, blog posts, case studies, media, and publishing lifecycle.',
                'permissions' => [
                    'pages.view', 'pages.manage', 'services.manage', 'case_studies.manage', 'testimonials.manage',
                    'team.manage', 'faqs.manage', 'awards.manage', 'clients.manage', 'careers.manage', 'legal.manage',
                    'blog.view', 'blog.create', 'blog.edit', 'blog.publish', 'revisions.view', 'revisions.restore', 'media.view', 'media.upload', 'seo.manage',
                ],
            ],
            'seo_manager' => [
                'label' => 'SEO Specialist',
                'description' => 'Dedicated authority over meta titles, descriptions, canonical URLs, schema JSON-LD, sitemaps, and redirects.',
                'permissions' => [
                    'pages.view', 'blog.view', 'seo.manage', 'redirects.manage', 'revisions.view',
                ],
            ],
            'sales_crm' => [
                'label' => 'Sales & CRM Representative',
                'description' => 'Access to inbound leads, opportunities, contact directories, and attribution tracking.',
                'permissions' => [
                    'leads.view', 'leads.manage', 'leads.export', 'crm.accounts.manage', 'crm.deals.manage', 'subscribers.manage',
                ],
            ],
            'editor' => [
                'label' => 'Editor',
                'description' => 'Create, edit, schedule, publish, and restore content, manage redirects, and upload media.',
                'permissions' => [
                    'pages.view', 'blog.view', 'blog.create', 'blog.edit', 'blog.publish', 'blog.delete',
                    'revisions.view', 'revisions.restore', 'media.view', 'media.upload', 'seo.manage', 'redirects.manage',
                ],
            ],
            'author' => [
                'label' => 'Author',
                'description' => 'Write and edit own draft articles, inspect revisions, and upload supporting media.',
                'permissions' => [
                    'blog.view', 'blog.create', 'blog.edit', 'revisions.view', 'media.view', 'media.upload',
                ],
            ],
            'viewer' => [
                'label' => 'Read-Only Viewer',
                'description' => 'Audit, reporting, and review access across content and CRM.',
                'permissions' => [
                    'pages.view', 'blog.view', 'media.view',
                ],
            ],
        ];

        foreach ($roles as $roleKey => $roleData) {
            $role = Role::updateOrCreate(
                ['name' => $roleKey],
                ['label' => $roleData['label'], 'description' => $roleData['description']]
            );

            $permIds = [];
            foreach ($roleData['permissions'] as $permKey) {
                if (isset($permissionModels[$permKey])) {
                    $permIds[] = $permissionModels[$permKey]->id;
                }
            }
            $role->permissions()->sync($permIds);
            User::clearPermissionCache($roleKey);
        }

        // Never create a publicly guessable or seeded administrator password.
        // The owner may bootstrap exactly one initial account through explicit
        // private environment configuration during first-time installation.
        $name = trim((string) config('cms.bootstrap_admin.name', ''));
        $email = strtolower(trim((string) config('cms.bootstrap_admin.email', '')));
        $password = (string) config('cms.bootstrap_admin.password', '');
        $bootstrapValues = [$name, $email, $password];

        if (count(array_filter($bootstrapValues, fn ($value) => $value !== '')) === 0) {
            return;
        }

        if ($name === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 16) {
            throw new \RuntimeException(
                'Set ADMIN_BOOTSTRAP_NAME, ADMIN_BOOTSTRAP_EMAIL, and a unique ADMIN_BOOTSTRAP_PASSWORD of at least 16 characters before seeding the first owner.'
            );
        }

        if (! User::where('role', 'superadmin')->exists()) {
            User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make($password),
                    'role' => 'superadmin',
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
