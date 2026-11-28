<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AutosaveBlogPostRequest;
use App\Http\Requests\Admin\RestoreRevisionRequest;
use App\Http\Requests\Admin\SchedulePostRequest;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Http\Resources\BlogPostResource;
use App\Http\Resources\PostRevisionResource;
use App\Models\BlogPost;
use App\Models\Setting;
use App\Repositories\Contracts\BlogPostRepositoryInterface;
use App\Repositories\RevisionRepository;
use App\Services\BlogPostService;
use App\Services\HtmlSanitizerService;
use App\Services\ReadabilityService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function __construct(
        private readonly BlogPostRepositoryInterface $posts,
        private readonly RevisionRepository $revisions,
        private readonly BlogPostService $blogPostService,
        private readonly ReadabilityService $readability,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', BlogPost::class);

        $filters = $request->only(['status', 'visibility', 'category', 'search', 'trashed', 'with_trashed']);
        if ($request->user()?->isAuthor()) {
            $filters['author_id'] = $request->user()->id;
        }

        $perPage = max(1, min(100, $request->integer('per_page', 20)));
        $paginator = $this->posts->paginateForAdmin($filters, $perPage);

        return BlogPostResource::collection($paginator)
            ->additional(['success' => true])
            ->response();
    }

    public function store(StoreBlogPostRequest $request): JsonResponse
    {
        $post = $this->blogPostService->create($request->validated(), $request->user());

        return (new BlogPostResource($post))
            ->additional(['success' => true])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, BlogPost $post): JsonResponse
    {
        $this->authorize('view', $post);
        $post->loadMissing(['featuredMedia', 'author', 'seo.ogMedia', 'seo.twitterMedia']);

        $autosave = $request->user()
            ? $this->posts->getLatestAutosave($post->id, $request->user()->id)
            : null;

        return (new BlogPostResource($post))
            ->additional([
                'success' => true,
                'autosave' => $autosave ? [
                    'title' => $autosave->title,
                    'excerpt' => $autosave->excerpt,
                    'content_html' => $autosave->content_html,
                    'content_json' => $autosave->content_json,
                    'meta_snapshot' => $autosave->meta_snapshot ?? [],
                    'base_version' => $autosave->base_version,
                    'updated_at' => $autosave->updated_at?->toIso8601String(),
                ] : null,
            ])
            ->response();
    }

    public function update(UpdateBlogPostRequest $request, BlogPost $post): JsonResponse
    {
        $expectedVersion = $request->filled('version') ? $request->integer('version') : null;
        $updated = $this->blogPostService->update($post, $request->validated(), $request->user(), $expectedVersion);

        return (new BlogPostResource($updated))
            ->additional(['success' => true])
            ->response();
    }

    public function destroy(Request $request, BlogPost $post): JsonResponse
    {
        $this->authorize('delete', $post);
        $this->blogPostService->moveToTrash($post, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Post moved to trash.',
        ]);
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::withTrashed()->findOrFail($id);
        $this->authorize('restore', $post);

        $restored = $this->blogPostService->restore($post, $request->user());

        return (new BlogPostResource($restored))
            ->additional(['success' => true])
            ->response();
    }

    public function publish(Request $request, BlogPost $post): JsonResponse
    {
        $this->authorize('publish', $post);
        $published = $this->blogPostService->publish($post, $request->user());

        return (new BlogPostResource($published))
            ->additional(['success' => true])
            ->response();
    }

    public function schedule(SchedulePostRequest $request, BlogPost $post): JsonResponse
    {
        $scheduledAt = Carbon::parse((string) $request->validated('scheduled_at'), config('app.timezone', 'Asia/Kolkata'));
        $scheduled = $this->blogPostService->schedule($post, $scheduledAt, $request->user());

        return (new BlogPostResource($scheduled))
            ->additional(['success' => true])
            ->response();
    }

    public function autosave(AutosaveBlogPostRequest $request, BlogPost $post): JsonResponse
    {
        $result = $this->blogPostService->autosave($post, $request->validated(), $request->user());

        return response()->json([
            'success' => true,
            'version_conflict' => $result['version_conflict'],
            'server_version' => $result['server_version'],
            'saved_at' => $result['saved_at'],
            'autosave' => [
                'id' => $result['autosave']->id,
                'base_version' => $result['autosave']->base_version,
            ],
        ]);
    }

    public function analyze(Request $request): JsonResponse
    {
        $this->authorize('viewAny', BlogPost::class);
        $html = (string) $request->input('content_html', $request->input('content', ''));

        return response()->json([
            'success' => true,
            'analysis' => $this->readability->analyze($html),
        ]);
    }

    public function revisions(Request $request, BlogPost $post): JsonResponse
    {
        $this->authorize('view', $post);

        $limit = max(1, min(100, $request->integer('limit', 50)));
        $items = $this->revisions->forPost($post->id, $limit);

        return PostRevisionResource::collection($items)
            ->additional(['success' => true])
            ->response();
    }

    public function diffRevision(Request $request, BlogPost $post): JsonResponse
    {
        $this->authorize('view', $post);

        $validated = $request->validate([
            'from' => ['required', 'integer'],
            'to' => ['required', 'integer'],
        ]);

        $from = $this->revisions->findForPost($post->id, (int) $validated['from']);
        $to = $this->revisions->findForPost($post->id, (int) $validated['to']);

        return response()->json([
            'success' => true,
            'diff' => $this->blogPostService->diffRevisions($from, $to),
        ]);
    }

    public function restoreRevision(RestoreRevisionRequest $request, BlogPost $post, int $revisionId): JsonResponse
    {
        $revision = $this->revisions->findForPost($post->id, $revisionId);
        $expectedVersion = $request->filled('version') ? $request->integer('version') : null;

        $restored = $this->blogPostService->restoreRevision($post, $revision, $request->user(), $expectedVersion);

        return (new BlogPostResource($restored))
            ->additional(['success' => true])
            ->response();
    }

    public function tagsAutocomplete(Request $request): JsonResponse
    {
        $this->authorize('viewAny', BlogPost::class);

        $queryText = strtolower(trim((string) $request->query('q', '')));
        $collected = [];

        $registry = Setting::get('blog_tags_registry', []);
        if (is_array($registry)) {
            foreach ($registry as $entry) {
                $name = is_array($entry) ? ($entry['name'] ?? null) : (is_string($entry) ? $entry : null);
                if ($name) {
                    $collected[] = trim($name);
                }
            }
        }

        BlogPost::query()
            ->whereNotNull('tags')
            ->limit(200)
            ->pluck('tags')
            ->each(function ($tagList) use (&$collected): void {
                if (is_array($tagList)) {
                    foreach ($tagList as $tag) {
                        if (is_string($tag) && trim($tag) !== '') {
                            $collected[] = trim($tag);
                        }
                    }
                }
            });

        $tags = collect($collected)
            ->unique(fn (string $tag) => strtolower($tag))
            ->when($queryText !== '', fn ($c) => $c->filter(fn (string $tag) => str_contains(strtolower($tag), $queryText)))
            ->sort()
            ->take(25)
            ->values()
            ->all();

        return response()->json([
            'success' => true,
            'tags' => $tags,
        ]);
    }

    public function quickCreateTag(Request $request): JsonResponse
    {
        $this->authorize('create', BlogPost::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:1', 'max:60'],
        ]);

        $name = trim($validated['name']);
        $slug = Str::slug($name);
        $registry = Setting::get('blog_tags_registry', []);
        if (! is_array($registry)) {
            $registry = [];
        }

        $exists = collect($registry)->contains(fn ($item) => strtolower((string) ($item['name'] ?? '')) === strtolower($name));
        if (! $exists) {
            $registry[] = ['name' => $name, 'slug' => $slug];
            Setting::set('cms', 'blog_tags_registry', array_values($registry), true);
        }

        return response()->json([
            'success' => true,
            'tag' => ['name' => $name, 'slug' => $slug],
        ], 201);
    }

    public function createSignedPreviewUrl(Request $request, BlogPost $post): JsonResponse
    {
        $this->authorize('view', $post);
        $ttlMinutes = max(5, min(10080, (int) config('cms.blog.preview_ttl_minutes', 1440)));

        $url = URL::temporarySignedRoute(
            'admin.posts.signed-preview',
            now()->addMinutes($ttlMinutes),
            ['uuid' => $post->uuid]
        );

        return response()->json([
            'success' => true,
            'preview_url' => $url,
            'expires_in_minutes' => $ttlMinutes,
        ]);
    }

    public function signedPreview(Request $request, string $uuid, HtmlSanitizerService $sanitizer): JsonResponse|Response
    {
        $post = BlogPost::withTrashed()
            ->withEditorialRelations()
            ->where('uuid', $uuid)
            ->firstOrFail();

        if ($request->expectsJson() || $request->query('format') === 'json') {
            return (new BlogPostResource($post))
                ->additional([
                    'success' => true,
                    'preview' => true,
                ])
                ->response();
        }

        $raw = (string) ($post->content_html ?: $post->content ?: '');
        $renderedHtml = $sanitizer->isMarkdownOnly($raw)
            ? Str::markdown($raw, ['html_input' => 'escape', 'allow_unsafe_links' => false])
            : $sanitizer->sanitize($raw);

        return response()
            ->view('admin.post-preview', [
                'post' => $post,
                'renderedHtml' => $renderedHtml,
            ])
            ->header('X-Robots-Tag', 'noindex, nofollow');
    }
}
