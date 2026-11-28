<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'key',
        'value',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        if (! $setting) {
            return $default;
        }
        $decoded = json_decode((string) $setting->value, true);

        return (json_last_error() === JSON_ERROR_NONE) ? $decoded : $setting->value;
    }

    public static function set(string $group, string $key, mixed $value, bool $isPublic = false): static
    {
        $val = is_array($value) ? json_encode($value) : (string) $value;
        $record = static::updateOrCreate(
            ['key' => $key],
            ['group' => $group, 'value' => $val, 'is_public' => $isPublic]
        );
        Cache::forget('public_settings');
        Cache::forget('all_settings_dictionary');

        return $record;
    }

    public static function getGroup(string $group): array
    {
        $settings = static::where('group', $group)->get();
        $out = [];
        foreach ($settings as $s) {
            $decoded = json_decode((string) $s->value, true);
            $out[$s->key] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $s->value;
        }

        return $out;
    }

    public static function allAsDictionary(): array
    {
        return Cache::remember('all_settings_dictionary', 300, function () {
            try {
                $settings = static::all();
                $out = [];
                foreach ($settings as $s) {
                    $decoded = json_decode((string) $s->value, true);
                    $out[$s->key] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $s->value;
                }

                return $out;
            } catch (\Throwable $e) {
                return [];
            }
        });
    }

    public static function createRevision(?int $userId = null): Revision
    {
        $currentSettings = static::allAsDictionary();
        $version = Revision::where('revisable_type', static::class)->where('revisable_id', 0)->count() + 1;

        return Revision::create([
            'revisable_type' => static::class,
            'revisable_id' => 0,
            'user_id' => $userId ?: auth()->id() ?: 1,
            'version_number' => $version,
            'payload' => $currentSettings,
        ]);
    }

    public static function rollbackToRevision(int $revisionId): bool
    {
        $rev = Revision::where('revisable_type', static::class)->where('id', $revisionId)->first();
        if (! $rev || ! is_array($rev->payload)) {
            return false;
        }

        // Snapshot current state first for rollback-of-rollback safety
        static::createRevision();

        foreach ($rev->payload as $key => $val) {
            $existing = static::where('key', $key)->first();
            $group = $existing ? $existing->group : 'general';
            $isPublic = $existing ? $existing->is_public : true;

            $serialized = is_array($val) ? json_encode($val) : (string) $val;
            static::updateOrCreate(
                ['key' => $key],
                ['group' => $group, 'value' => $serialized, 'is_public' => $isPublic]
            );
        }

        Cache::forget('public_settings');

        return true;
    }
}
