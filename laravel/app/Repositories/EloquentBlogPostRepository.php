<?php

namespace App\Repositories;

use App\Models\BlogPost;
use App\Models\PostAutosave;
use App\Repositories\Contracts\BlogPostRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EloquentBlogPostRepository implements BlogPostRepositoryInterface
{
    public function paginateForAdmin(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = BlogPost::query()->withEditorialRelations();

        if (! empty($filters['trashed'])) {
            $query->onlyTrashed();
        } elseif (! empty($filters['with_trashed'])) {
            $query->withTrashed();
        }

        if (! empty($filters['status'])) {
            $query->where('status', (string) $filters['status']);
        }

        if (! empty($filters['visibility'])) {
            $query->where('visibility', (string) $filters['visibility']);
        }

        if (! empty($filters['author_id'])) {
            $query->where('author_id', (int) $filters['author_id']);
        }

        if (! empty($filters['category'])) {
            $query->where('category', (string) $filters['category']);
        }

        if (! empty($filters['search'])) {
            $term = '%'.trim((string) $filters['search']).'%';
            $query->where(function ($q) use ($term): void {
                $q->where('title', 'like', $term)
                    ->orWhere('slug', 'like', $term)
                    ->orWhere('excerpt', 'like', $term);
            });
        }

        return $query->orderByDesc('updated_at')->orderByDesc('id')->paginate($perPage);
    }

    public function paginatePublic(?string $category = null, ?string $search = null, int $perPage = 12): LengthAwarePaginator
    {
        $query = BlogPost::query()
            ->withEditorialRelations()
            ->publiclyListed()
            ->orderByDesc('published_at')
            ->orderByDesc('id');

        if (! empty($category) && ! in_array($category, ['All Topics', 'all'], true)) {
            $query->where('category', $category);
        }

        if (! empty($search)) {
            $term = '%'.trim($search).'%';
            $query->where(function ($q) use ($term): void {
                $q->where('title', 'like', $term)
                    ->orWhere('excerpt', 'like', $term)
                    ->orWhere('content', 'like', $term)
                    ->orWhere('tags', 'like', $term);
            });
        }

        return $query->paginate($perPage);
    }

    public function findByIdOrUuid(string|int $identifier, bool $withTrashed = true): ?BlogPost
    {
        $query = BlogPost::query()->withEditorialRelations();
        if ($withTrashed) {
            $query->withTrashed();
        }

        if (is_numeric($identifier)) {
            return $query->where('id', (int) $identifier)->first();
        }

        return $query->where('uuid', (string) $identifier)->first();
    }

    public function findPublicBySlug(string $slug): ?BlogPost
    {
        return BlogPost::query()
            ->withEditorialRelations()
            ->accessiblePublished()
            ->where('slug', $slug)
            ->first();
    }

    public function lockForUpdate(int $id): BlogPost
    {
        return BlogPost::withTrashed()
            ->lockForUpdate()
            ->findOrFail($id);
    }

    public function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        $query = BlogPost::withTrashed()->where('slug', $slug);
        if ($ignoreId !== null) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }

    public function upsertAutosave(int $postId, int $userId, array $attributes): PostAutosave
    {
        return PostAutosave::updateOrCreate(
            ['blog_post_id' => $postId, 'user_id' => $userId],
            $attributes
        );
    }

    public function getLatestAutosave(int $postId, int $userId): ?PostAutosave
    {
        return PostAutosave::query()
            ->where('blog_post_id', $postId)
            ->where('user_id', $userId)
            ->first();
    }

    public function searchInternalLinks(string $queryText, ?int $excludeId = null, int $limit = 15): Collection
    {
        $query = BlogPost::query()
            ->publiclyListed()
            ->select(['id', 'uuid', 'title', 'slug', 'category', 'excerpt', 'focus_keyphrase', 'published_at']);

        if ($excludeId !== null && $excludeId > 0) {
            $query->where('id', '!=', $excludeId);
        }

        if ($queryText !== '') {
            $query->where(function ($outer) use ($queryText): void {
                $outer->where('title', 'like', "%{$queryText}%")
                    ->orWhere('slug', 'like', "%{$queryText}%")
                    ->orWhere('category', 'like', "%{$queryText}%")
                    ->orWhere('focus_keyphrase', 'like', "%{$queryText}%")
                    ->orWhere('excerpt', 'like', "%{$queryText}%");
            });
        }

        return $query->orderByDesc('published_at')->orderByDesc('id')->limit($limit)->get();
    }
}
