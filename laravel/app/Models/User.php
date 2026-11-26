<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar_media_id',
        'is_active',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
        'two_factor_recovery_confirmed_at',
        'two_factor_grace_until',
        'two_factor_trusted_token_version',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
        'two_factor_recovery_confirmed_at' => 'datetime',
        'two_factor_grace_until' => 'datetime',
        'two_factor_trusted_token_version' => 'integer',
    ];

    public function hasTwoFactorEnabled(): bool
    {
        return ! empty($this->two_factor_secret) && ! is_null($this->two_factor_confirmed_at);
    }

    public function hasConfirmedRecoveryCodes(): bool
    {
        return ! is_null($this->two_factor_recovery_confirmed_at);
    }

    public function isInTwoFactorGracePeriod(): bool
    {
        return $this->two_factor_grace_until !== null && $this->two_factor_grace_until->isFuture();
    }

    /**
     * Mandatory 2FA challenge applies only when user is enrolled,
     * recovery codes are saved (when grace policy is active), and grace period has elapsed.
     */
    public function requiresTwoFactorChallenge(): bool
    {
        if (! $this->hasTwoFactorEnabled()) {
            return false;
        }

        if ($this->isInTwoFactorGracePeriod()) {
            return false;
        }

        if ($this->two_factor_grace_until !== null && ! $this->hasConfirmedRecoveryCodes()) {
            return false;
        }

        return true;
    }

    public function getRemainingRecoveryCodesCount(): int
    {
        if (empty($this->two_factor_recovery_codes)) {
            return 0;
        }

        try {
            $codes = json_decode(Crypt::decryptString($this->two_factor_recovery_codes), true);

            return is_array($codes) ? count($codes) : 0;
        } catch (\Throwable $e) {
            return 0;
        }
    }

    public function getTwoFactorSecret(): ?string
    {
        if (empty($this->two_factor_secret)) {
            return null;
        }

        try {
            return Crypt::decryptString($this->two_factor_secret);
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'avatar_media_id');
    }

    public function assignedLeads(): HasMany
    {
        return $this->hasMany(Lead::class, 'assigned_user_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function blogPosts(): HasMany
    {
        return $this->hasMany(BlogPost::class, 'author_id');
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function isAdminOrHigher(): bool
    {
        return in_array($this->role, ['superadmin', 'admin'], true);
    }

    public function isEditorOrHigher(): bool
    {
        return in_array($this->role, ['superadmin', 'admin', 'content_manager', 'editor'], true);
    }

    public function isAuthor(): bool
    {
        return $this->role === 'author';
    }

    public static function clearPermissionCache(?string $role = null): void
    {
        if ($role !== null && $role !== '') {
            Cache::forget("cms:role_permissions:{$role}");

            return;
        }

        foreach (['superadmin', 'admin', 'content_manager', 'seo_manager', 'sales_crm', 'editor', 'author', 'viewer'] as $name) {
            Cache::forget("cms:role_permissions:{$name}");
        }
    }

    /**
     * Resolve cached CMS permission checks per role to eliminate repeated queries.
     */
    public function hasCmsPermission(string $permission): bool
    {
        if (! $this->is_active) {
            return false;
        }

        if ($this->isSuperAdmin()) {
            return true;
        }

        $roleName = (string) ($this->role ?? '');
        if ($roleName === '') {
            return false;
        }

        $rolePermissions = Cache::remember(
            "cms:role_permissions:{$roleName}",
            300,
            static function () use ($roleName): array {
                $role = Role::query()->where('name', $roleName)->with('permissions:permissions.name')->first();

                return $role ? $role->permissions->pluck('name')->all() : [];
            }
        );

        return in_array($permission, $rolePermissions, true);
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return (bool) ($this->is_active && in_array($this->role, [
            'superadmin', 'admin', 'content_manager', 'seo_manager', 'sales_crm', 'editor', 'author', 'viewer',
        ], true));
    }
}
