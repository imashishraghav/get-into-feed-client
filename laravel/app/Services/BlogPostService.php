<?php

namespace App\Services;

use App\Events\PostPublished;
use App\Exceptions\OptimisticLockException;
use App\Models\BlogPost;
use App\Models\PostAutosave;
use App\Models\PostRevision;
use App\Models\Revision;
use App\Models\User;
use App\Repositories\Contracts\BlogPostRepositoryInterface;
use App\Repositories\RevisionRepository;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BlogPostService
{
    public function __construct(
        private readonly BlogPostRepositoryInterface $posts,
        private readonly RevisionRepository $revisions,
        private readonly HtmlSanitizerService $sanitizer,
        private readonly ReadabilityService $readability,
        private readonly SeoSchemaService $schemaService,
        private readonly RedirectService $redirects,
        private readonly AuditLogService $audit,
        private readonly SitemapService $sitemap,
    ) {}

    public function generateUniqueSlug(string $titleOrSlug, ?int $ignorePostId = null): string
    {
        $base = Str::slug($titleOrSlug) ?: 'untitled-post';
        $candidate = $base;
        $counter = 2;

        while ($this->posts->slugExists($candidate, $ignorePostId)) {
            $candidate = "{$base}-{$counter}";
            $counter++;
        }

        return $candidate;
    }

    /**
     * Create a new BlogPost with HTML sanitization, schema generation, initial revision, and audit log.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?User $actor = null): BlogPost
    {
        return DB::transaction(function () use ($data, $actor): BlogPost {
            $prepared = $this->prepareAttributes($data, null, $actor);

            $post = BlogPost::create($prepared);
            $this->syncSeoAndSchema($post);

            $this->captureRevision($post, $actor, $post->status === 'published' ? 'publish' : 'manual', 'Initial creation');
            $this->audit->record('CREATE', $post, null, $post->toArray(), $actor);

            if ($post->status === 'published') {
                PostPublished::dispatch($post);
            }

            return $post->fresh(['featuredMedia', 'author', 'seo']);
        });
    }

    /**
     * Update an existing BlogPost with optimistic locking check, auto 301 redirect on slug change,
     * HTML allow-list sanitization, revision snapshot, and cache/sitemap refresh.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws OptimisticLockException
     */
    public function update(BlogPost $post, array $data, ?User $actor = null, ?int $expectedVersion = null): BlogPost
    {
        return DB::transaction(function () use ($post, $data, $actor, $expectedVersion): BlogPost {
            $locked = $this->posts->lockForUpdate($post->id);
            $currentVersion = (int) ($locked->version ?: 1);

            if ($expectedVersion !== null && $expectedVersion !== $currentVersion) {
                throw new OptimisticLockException(
                    expectedVersion: $expectedVersion,
                    currentVersion: $currentVersion,
                    latestSnapshot: [
                        'id' => $locked->id,
                        'uuid' => $locked->uuid,
                        'title' => $locked->title,
                        'slug' => $locked->slug,
                        'version' => $currentVersion,
                        'updated_at' => $locked->updated_at?->toIso8601String(),
                    ]
                );
            }

            $oldState = $locked->toArray();
            $oldSlug = (string) $locked->slug;
            $oldStatus = (string) $locked->status;

            $prepared = $this->prepareAttributes($data, $locked, $actor);
            $prepared['version'] = $currentVersion + 1;

            if ($oldSlug !== '' && isset($prepared['slug']) && $prepared['slug'] !== $oldSlug && ($oldStatus === 'published' || $locked->published_at !== null)) {
                $this->redirects->handleBlogSlugChange($oldSlug, (string) $prepared['slug']);
            }

            $locked->fill($prepared);
            $locked->save();

            $this->syncSeoAndSchema($locked);

            if ($actor !== null) {
                PostAutosave::query()
                    ->where('blog_post_id', $locked->id)
                    ->where('user_id', $actor->id)
                    ->delete();
            }

            $revType = ($locked->status === 'published' && $oldStatus !== 'published') ? 'publish' : 'manual';
            $summary = trim((string) ($data['change_summary'] ?? ($revType === 'publish' ? 'Published update' : 'Manual save')));

            $this->captureRevision($locked, $actor, $revType, $summary);
            $this->audit->record('UPDATE', $locked, $oldState, $locked->toArray(), $actor);

            if ($locked->status === 'published' || $oldStatus === 'published') {
                PostPublished::dispatch($locked);
            }

            return $locked->fresh(['featuredMedia', 'author', 'seo']);
        });
    }

    /**
     * Save debounced editor draft state strictly into post_autosaves without mutating live published rows.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function autosave(BlogPost $post, array $data, User $actor): array
    {
        $rawHtml = (string) ($data['content_html'] ?? ($data['content'] ?? ''));
        $sanitizedHtml = $this->sanitizer->sanitize($rawHtml);
        $baseVersion = (int) ($data['base_version'] ?? ($data['version'] ?? $post->version ?? 1));
        $serverVersion = (int) ($post->version ?: 1);

        $metaSnapshot = array_filter([
            'slug' => $data['slug'] ?? null,
            'category' => $data['category'] ?? null,
            'tags' => $data['tags'] ?? null,
            'visibility' => $data['visibility'] ?? null,
            'meta_title' => $data['meta_title'] ?? ($data['seo_title'] ?? null),
            'meta_description' => $data['meta_description'] ?? null,
            'focus_keyphrase' => $data['focus_keyphrase'] ?? null,
            'canonical_url' => $data['canonical_url'] ?? null,
            'og_image' => $data['og_image'] ?? null,
            'faq_json' => $data['faq_json'] ?? ($data['faq_items'] ?? null),
            'featured_media_id' => $data['featured_media_id'] ?? null,
            'featured_image_alt' => $data['featured_image_alt'] ?? null,
        ], static fn ($value) => $value !== null);

        $autosave = $this->posts->upsertAutosave($post->id, $actor->id, [
            'title' => $data['title'] ?? $post->title,
            'excerpt' => $data['excerpt'] ?? $post->excerpt,
            'content_html' => $sanitizedHtml !== '' ? $sanitizedHtml : null,
            'content_json' => $data['content_json'] ?? null,
            'meta_snapshot' => $metaSnapshot,
            'base_version' => $baseVersion,
        ]);

        return [
            'autosave' => $autosave,
            'version_conflict' => $baseVersion !== $serverVersion,
            'server_version' => $serverVersion,
            'saved_at' => $autosave->updated_at?->toIso8601String() ?? now()->toIso8601String(),
        ];
    }

    public function publish(BlogPost $post, ?User $actor = null): BlogPost
    {
        return DB::transaction(function () use ($post, $actor): BlogPost {
            $locked = $this->posts->lockForUpdate($post->id);
            $oldState = $locked->toArray();
            $now = now(config('app.timezone', 'Asia/Kolkata'));

            $locked->status = 'published';
            $locked->published_at = $locked->published_at ?? $now;
            $locked->scheduled_at = null;
            $locked->version = ((int) $locked->version) + 1;
            $locked->save();

            $this->syncSeoAndSchema($locked);
            $this->captureRevision($locked, $actor, 'publish', 'Published article');
            $this->audit->record('PUBLISH', $locked, $oldState, $locked->toArray(), $actor);

            PostPublished::dispatch($locked);

            return $locked->fresh(['featuredMedia', 'author', 'seo']);
        });
    }

    public function schedule(BlogPost $post, CarbonInterface $scheduledAt, ?User $actor = null): BlogPost
    {
        return DB::transaction(function () use ($post, $scheduledAt, $actor): BlogPost {
            $locked = $this->posts->lockForUpdate($post->id);
            $oldState = $locked->toArray();

            $locked->status = 'scheduled';
            $locked->scheduled_at = $scheduledAt;
            $locked->version = ((int) $locked->version) + 1;
            $locked->save();

            $this->audit->record('SCHEDULE_UPDATED', $locked, $oldState, [
                'status' => 'scheduled',
                'scheduled_at' => $scheduledAt->toIso8601String(),
            ], $actor);

            return $locked->fresh();
        });
    }

    public function moveToTrash(BlogPost $post, ?User $actor = null): void
    {
        DB::transaction(function () use ($post, $actor): void {
            $locked = $this->posts->lockForUpdate($post->id);
            $wasPublished = $locked->status === 'published';

            $locked->status = 'trashed';
            $locked->save();
            $locked->delete();

            $this->audit->record('POST_TRASHED', $locked, null, ['status' => 'trashed'], $actor);

            if ($wasPublished) {
                $this->sitemap->regenerate();
            }
        });
    }

    public function restore(BlogPost $post, ?User $actor = null): BlogPost
    {
        return DB::transaction(function () use ($post, $actor): BlogPost {
            $locked = $this->posts->lockForUpdate($post->id);
            $locked->restore();
            if ($locked->status === 'trashed') {
                $locked->status = 'draft';
            }
            $locked->version = ((int) $locked->version) + 1;
            $locked->save();

            $this->audit->record('POST_RESTORED', $locked, null, ['status' => $locked->status], $actor);

            return $locked->fresh();
        });
    }

    /**
     * Restore a specific PostRevision onto the post safely with optimistic version checking.
     *
     * @throws OptimisticLockException
     */
    public function restoreRevision(BlogPost $post, PostRevision $revision, ?User $actor = null, ?int $expectedVersion = null): BlogPost
    {
        if ((int) $revision->blog_post_id !== (int) $post->id) {
            throw new \InvalidArgumentException('Revision does not belong to the specified blog post.');
        }

        return DB::transaction(function () use ($post, $revision, $actor, $expectedVersion): BlogPost {
            $locked = $this->posts->lockForUpdate($post->id);
            $currentVersion = (int) ($locked->version ?: 1);

            if ($expectedVersion !== null && $expectedVersion !== $currentVersion) {
                throw new OptimisticLockException($expectedVersion, $currentVersion, [
                    'title' => $locked->title,
                    'version' => $currentVersion,
                ]);
            }

            $oldState = $locked->toArray();
            $snapshot = is_array($revision->meta_snapshot) ? $revision->meta_snapshot : [];
            $restoredHtml = $this->sanitizer->sanitize((string) $revision->content_html);

            if (! empty($revision->slug) && $revision->slug !== $locked->slug) {
                $newSlug = $this->generateUniqueSlug((string) $revision->slug, $locked->id);
                if ($locked->status === 'published') {
                    $this->redirects->handleBlogSlugChange((string) $locked->slug, $newSlug);
                }
                $locked->slug = $newSlug;
            }

            $analysis = $this->readability->analyze($restoredHtml);

            $locked->fill([
                'title' => $revision->title,
                'excerpt' => $revision->excerpt,
                'content_html' => $restoredHtml,
                'content_json' => $revision->content_json,
                'category' => $snapshot['category'] ?? $locked->category,
                'tags' => $snapshot['tags'] ?? $locked->tags,
                'meta_title' => $snapshot['meta_title'] ?? $locked->meta_title,
                'meta_description' => $snapshot['meta_description'] ?? $locked->meta_description,
                'canonical_url' => $snapshot['canonical_url'] ?? $locked->canonical_url,
                'faq_json' => $snapshot['faq_json'] ?? $locked->faq_json,
                'visibility' => $snapshot['visibility'] ?? $locked->visibility,
                'featured_media_id' => $snapshot['featured_media_id'] ?? $locked->featured_media_id,
                'featured_image_alt' => $snapshot['featured_image_alt'] ?? $locked->featured_image_alt,
                'word_count' => $analysis['word_count'],
                'reading_time' => $analysis['reading_time'],
                'read_time' => $analysis['reading_time'].' min read',
                'readability_score' => $analysis['readability_score'],
                'version' => $currentVersion + 1,
            ]);
            unset($locked->content, $locked->seo_title, $locked->faq_items);

            $locked->save();
            $this->syncSeoAndSchema($locked);

            $this->captureRevision(
                $locked,
                $actor,
                'restore',
                "Restored from Revision #{$revision->revision_number}"
            );

            $this->audit->record('POST_REVISION_RESTORED', $locked, $oldState, [
                'restored_revision_id' => $revision->id,
                'restored_revision_number' => $revision->revision_number,
                'version' => $locked->version,
            ], $actor);

            if ($locked->status === 'published') {
                PostPublished::dispatch($locked);
            }

            return $locked->fresh(['featuredMedia', 'author', 'seo']);
        });
    }

    /**
     * Compute structured field + line-by-line diff between two revisions.
     *
     * @return array<string, mixed>
     */
    public function diffRevisions(PostRevision $from, PostRevision $to): array
    {
        $fromText = trim(html_entity_decode(strip_tags(str_replace(['</p>', '</h2>', '</h3>', '</h4>', '</li>', '<br>', '<br/>'], "\n", (string) $from->content_html))));
        $toText = trim(html_entity_decode(strip_tags(str_replace(['</p>', '</h2>', '</h3>', '</h4>', '</li>', '<br>', '<br/>'], "\n", (string) $to->content_html))));

        $fromLines = $fromText === '' ? [] : array_values(array_map('trim', explode("\n", $fromText)));
        $toLines = $toText === '' ? [] : array_values(array_map('trim', explode("\n", $toText)));

        return [
            'from' => [
                'id' => $from->id,
                'revision_number' => $from->revision_number,
                'created_at' => $from->created_at?->toIso8601String(),
                'author' => $from->user?->name,
            ],
            'to' => [
                'id' => $to->id,
                'revision_number' => $to->revision_number,
                'created_at' => $to->created_at?->toIso8601String(),
                'author' => $to->user?->name,
            ],
            'fields' => [
                'title' => ['changed' => $from->title !== $to->title, 'from' => $from->title, 'to' => $to->title],
                'slug' => ['changed' => $from->slug !== $to->slug, 'from' => $from->slug, 'to' => $to->slug],
                'excerpt' => ['changed' => $from->excerpt !== $to->excerpt, 'from' => $from->excerpt, 'to' => $to->excerpt],
            ],
            'content_lines' => $this->computeLineDiff($fromLines, $toLines),
        ];
    }

    /**
     * Synchronize polymorphic SeoMetadata & JSON-LD schema_json column cleanly.
     */
    public function syncSeoAndSchema(BlogPost $post): void
    {
        $schema = $this->schemaService->buildForBlogPost($post);
        if ($post->schema_json !== $schema) {
            $post->forceFill(['schema_json' => $schema])->saveQuietly();
        }

        $existingSeo = $post->seo;
        $post->seo()->updateOrCreate(
            ['seoble_type' => BlogPost::class, 'seoble_id' => $post->id],
            [
                'seo_title' => $post->meta_title ?: ($post->seo_title ?: null),
                'meta_description' => $post->meta_description ?: null,
                'focus_keyword' => $post->focus_keyphrase ?: null,
                'target_keywords' => $post->secondary_keyphrases ?? [],
                'canonical_url' => $post->canonical_url ?: null,
                'robots_index' => (bool) ($post->robots_index ?? true),
                'robots_follow' => (bool) ($post->robots_follow ?? true),
                'og_title' => $post->og_title ?: null,
                'og_description' => $post->og_description ?: null,
                'og_media_id' => $existingSeo?->og_media_id ?: ($post->featured_media_id ?: null),
                'twitter_title' => $existingSeo?->twitter_title ?: ($post->og_title ?: null),
                'twitter_description' => $existingSeo?->twitter_description ?: ($post->og_description ?: null),
                'twitter_media_id' => $existingSeo?->twitter_media_id,
                'schema_type' => $post->schema_type ?: 'BlogPosting',
                'custom_schema_json' => $schema,
                'seo_score' => (int) ($post->seo_score ?? 0),
                'in_sitemap' => $existingSeo?->in_sitemap ?? true,
                'sitemap_priority' => $existingSeo?->sitemap_priority ?? 0.8,
                'sitemap_changefreq' => $existingSeo?->sitemap_changefreq ?? 'weekly',
            ]
        );
    }

    /**
     * Record a snapshot in both post_revisions and legacy revisions table.
     */
    public function captureRevision(BlogPost $post, ?User $actor = null, string $type = 'manual', ?string $summary = null): PostRevision
    {
        $revNum = $this->revisions->nextRevisionNumber($post->id);

        $revision = PostRevision::create([
            'blog_post_id' => $post->id,
            'user_id' => $actor?->id,
            'revision_number' => $revNum,
            'type' => $type,
            'title' => (string) $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content_html' => $post->content_html ?? $post->content,
            'content_json' => $post->content_json,
            'meta_snapshot' => [
                'status' => $post->status,
                'visibility' => $post->visibility,
                'category' => $post->category,
                'tags' => $post->tags ?? [],
                'meta_title' => $post->meta_title ?? $post->seo_title,
                'meta_description' => $post->meta_description,
                'canonical_url' => $post->canonical_url,
                'og_image' => $post->og_image,
                'faq_json' => $post->faq_json ?? $post->faq_items ?? [],
                'featured_media_id' => $post->featured_media_id,
                'featured_image_alt' => $post->featured_image_alt,
            ],
            'change_summary' => $summary,
            'version_at_capture' => (int) ($post->version ?: 1),
        ]);

        // Mirror into legacy polymorphic revisions table for Filament widgets using old relation
        Revision::create([
            'revisable_type' => BlogPost::class,
            'revisable_id' => $post->id,
            'user_id' => $actor?->id,
            'version_number' => $revNum,
            'payload' => $post->toArray(),
        ]);

        return $revision;
    }

    /**
     * Normalize attributes, sanitize HTML (XSS allow-list), enforce author publish restrictions,
     * compute readability metrics, and generate unique slugs cleanly.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function prepareAttributes(array $data, ?BlogPost $existing, ?User $actor): array
    {
        $canPublish = $actor === null
            || $actor->isSuperAdmin()
            || $actor->hasCmsPermission('blog.publish')
            || $actor->isEditorOrHigher();

        if (! $canPublish) {
            if ($existing) {
                $data['status'] = $existing->status === 'published' ? 'review' : $existing->status;
                $data['published_at'] = $existing->published_at;
                $data['scheduled_at'] = $existing->scheduled_at;
                unset($data['scheduled_for']);
            } else {
                $data['status'] = in_array($data['status'] ?? '', ['draft', 'review'], true) ? $data['status'] : 'draft';
                $data['published_at'] = null;
                $data['scheduled_at'] = null;
                unset($data['scheduled_for']);
            }
        }

        if (! $existing && empty($data['author_id'])) {
            $data['author_id'] = $actor?->id;
        }

        if (isset($data['slug']) || isset($data['title'])) {
            $rawSlug = ! empty($data['slug']) ? (string) $data['slug'] : (string) ($data['title'] ?? ($existing?->title ?? ''));
            $data['slug'] = $this->generateUniqueSlug($rawSlug, $existing?->id);
        }

        $rawContent = $data['content_html'] ?? ($data['content'] ?? ($existing?->content_html ?? $existing?->content));

        if ($rawContent !== null) {
            // HtmlSanitizerService::sanitize preserves pure Markdown posts unaltered while sanitizing HTML
            $sanitizedHtml = $this->sanitizer->sanitize((string) $rawContent);
            $data['content_html'] = $sanitizedHtml;
            unset($data['content']);

            $analysis = $this->readability->analyze($sanitizedHtml);
            $data['word_count'] = max($analysis['word_count'], (int) ($data['word_count'] ?? 0));
            $data['reading_time'] = max(1, (int) ceil($data['word_count'] / 200));
            $data['read_time'] = $data['reading_time'].' min read';
            $data['readability_score'] = $data['readability_score'] ?? $analysis['readability_score'];
        }

        // Route canonical column updates through BlogPost::syncDualArchitectureColumns() as the single sync point
        if (! array_key_exists('scheduled_at', $data) && array_key_exists('scheduled_for', $data)) {
            $data['scheduled_at'] = $data['scheduled_for'];
        }
        unset($data['scheduled_for']);

        if (! array_key_exists('meta_title', $data) && array_key_exists('seo_title', $data)) {
            $data['meta_title'] = $data['seo_title'];
        }
        unset($data['seo_title']);

        if (array_key_exists('faq_json', $data) || array_key_exists('faq_items', $data)) {
            $data['faq_json'] = $this->normalizeFaqItems($data['faq_json'] ?? ($data['faq_items'] ?? []));
            unset($data['faq_items']);
        }

        if (isset($data['secondary_keyphrases'])) {
            $data['secondary_keyphrases'] = is_array($data['secondary_keyphrases'])
                ? array_values(array_filter(array_map('trim', $data['secondary_keyphrases'])))
                : [];
        }

        if (($data['status'] ?? null) === 'published' && empty($data['published_at']) && empty($existing?->published_at)) {
            $data['published_at'] = now(config('app.timezone', 'Asia/Kolkata'));
        }

        if (isset($data['seo_score'])) {
            $data['seo_score'] = max(0, min(100, (int) $data['seo_score']));
        }

        $data['visibility'] = in_array($data['visibility'] ?? ($existing?->visibility ?? 'public'), ['public', 'unlisted', 'private'], true)
            ? ($data['visibility'] ?? ($existing?->visibility ?? 'public'))
            : 'public';

        return $data;
    }

    /**
     * @return array<int, array{q: string, a: string}>
     */
    private function normalizeFaqItems(mixed $items): array
    {
        if (! is_array($items)) {
            return [];
        }

        $clean = [];
        foreach ($items as $item) {
            if (! is_array($item)) {
                continue;
            }
            $q = trim((string) ($item['q'] ?? ($item['question'] ?? '')));
            $a = trim((string) ($item['a'] ?? ($item['answer'] ?? '')));
            if ($q !== '' || $a !== '') {
                $clean[] = ['q' => $q, 'a' => $a];
            }
        }

        return $clean;
    }

    /**
     * Myers-inspired compact LCS line diff for revision comparison.
     *
     * @param  array<int, string>  $fromLines
     * @param  array<int, string>  $toLines
     * @return array<int, array{type: string, text: string}>
     */
    private function computeLineDiff(array $fromLines, array $toLines): array
    {
        $m = count($fromLines);
        $n = count($toLines);

        if ($m > 300 || $n > 300) {
            // Bound DP matrix size on extraordinarily huge documents
            $result = [];
            foreach (array_diff($fromLines, $toLines) as $line) {
                $result[] = ['type' => 'removed', 'text' => $line];
            }
            foreach (array_diff($toLines, $fromLines) as $line) {
                $result[] = ['type' => 'added', 'text' => $line];
            }

            return $result;
        }

        $dp = array_fill(0, $m + 1, array_fill(0, $n + 1, 0));
        for ($i = $m - 1; $i >= 0; $i--) {
            for ($j = $n - 1; $j >= 0; $j--) {
                $dp[$i][$j] = $fromLines[$i] === $toLines[$j]
                    ? $dp[$i + 1][$j + 1] + 1
                    : max($dp[$i + 1][$j], $dp[$i][$j + 1]);
            }
        }

        $diff = [];
        $i = 0;
        $j = 0;
        while ($i < $m && $j < $n) {
            if ($fromLines[$i] === $toLines[$j]) {
                $diff[] = ['type' => 'unchanged', 'text' => $fromLines[$i]];
                $i++;
                $j++;
            } elseif ($dp[$i + 1][$j] >= $dp[$i][$j + 1]) {
                $diff[] = ['type' => 'removed', 'text' => $fromLines[$i]];
                $i++;
            } else {
                $diff[] = ['type' => 'added', 'text' => $toLines[$j]];
                $j++;
            }
        }
        while ($i < $m) {
            $diff[] = ['type' => 'removed', 'text' => $fromLines[$i++]];
        }
        while ($j < $n) {
            $diff[] = ['type' => 'added', 'text' => $toLines[$j++]];
        }

        return $diff;
    }
}
