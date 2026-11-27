<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaFolder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(MediaFolder::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(MediaFolder::class, 'parent_id');
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'folder_id');
    }

    public function getHierarchyNameAttribute(): string
    {
        $segments = [$this->name];
        $current = $this;
        $visited = [$this->id];

        while ($current->parent && ! in_array($current->parent->id, $visited, true)) {
            $visited[] = $current->parent->id;
            $current = $current->parent;
            array_unshift($segments, $current->name);
        }

        return implode(' / ', $segments);
    }

    public static function treeOptions(): array
    {
        $folders = static::with('parent')->get();
        $options = [];

        foreach ($folders as $folder) {
            $options[$folder->id] = $folder->hierarchy_name;
        }

        asort($options);

        return $options;
    }
}
