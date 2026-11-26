<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'label',
        'description',
    ];

    protected static function booted(): void
    {
        static::saved(function (Role $role): void {
            User::clearPermissionCache($role->name);
        });

        static::deleted(function (Role $role): void {
            User::clearPermissionCache($role->name);
        });
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_has_permissions');
    }
}
