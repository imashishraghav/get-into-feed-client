<?php

namespace App\Repositories;

use App\Models\Media;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MediaRepository
{
    public function paginateForAdmin(?string $search = null, ?int $folderId = null, int $perPage = 40): LengthAwarePaginator
    {
        $query = Media::query()->with('uploader:id,name,email')->latest();

        if (! empty($search)) {
            $term = '%'.trim($search).'%';
            $query->where(function ($q) use ($term): void {
                $q->where('file_name', 'like', $term)
                    ->orWhere('title', 'like', $term)
                    ->orWhere('alt_text', 'like', $term);
            });
        }

        if ($folderId !== null && $folderId > 0) {
            $query->where('folder_id', $folderId);
        }

        return $query->paginate($perPage);
    }
}
