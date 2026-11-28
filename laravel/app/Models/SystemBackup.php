<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemBackup extends Model
{
    use HasFactory;

    protected $fillable = [
        'filename',
        'file_path',
        'file_size_bytes',
        'sha256_hash',
        'backup_type',
        'status',
        'tables_count',
        'rows_count',
        'created_by',
        'notes',
        'verified_at',
    ];

    protected $casts = [
        'file_size_bytes' => 'integer',
        'tables_count' => 'integer',
        'rows_count' => 'integer',
        'verified_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getFormattedSizeAttribute(): string
    {
        $bytes = (int) $this->file_size_bytes;
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2).' MB';
        }
        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 2).' KB';
        }

        return $bytes.' B';
    }

    public function getShortShaAttribute(): string
    {
        return substr((string) $this->sha256_hash, 0, 12);
    }

    public function scopeManual($query)
    {
        return $query->where('backup_type', 'manual');
    }

    public function scopeAutomatic($query)
    {
        return $query->where('backup_type', 'automatic');
    }

    public function scopePreRestore($query)
    {
        return $query->where('backup_type', 'pre_restore');
    }
}
