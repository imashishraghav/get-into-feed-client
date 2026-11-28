<?php

namespace App\Repositories\Contracts;

use App\Models\BlogPost;
use App\Models\PostAutosave;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BlogPostRepositoryInterface
{
    public function paginateForAdmin(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function paginatePublic(?string $category = null, ?string $search = null, int $perPage = 12): LengthAwarePaginator;

    public function findByIdOrUuid(string|int $identifier, bool $withTrashed = true): ?BlogPost;

    public function findPublicBySlug(string $slug): ?BlogPost;

    public function lockForUpdate(int $id): BlogPost;

    public function slugExists(string $slug, ?int $ignoreId = null): bool;

    public function upsertAutosave(int $postId, int $userId, array $attributes): PostAutosave;

    public function getLatestAutosave(int $postId, int $userId): ?PostAutosave;

    public function searchInternalLinks(string $query, ?int $excludeId = null, int $limit = 15): Collection;
}
