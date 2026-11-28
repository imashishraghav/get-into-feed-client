<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadMediaRequest;
use App\Models\BlogPost;
use App\Repositories\Contracts\BlogPostRepositoryInterface;
use App\Services\AuditLogService;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EditorController extends Controller
{
    public function __construct(
        private readonly MediaService $mediaService,
        private readonly BlogPostRepositoryInterface $posts,
        private readonly AuditLogService $audit,
    ) {}

    /**
     * Direct Editor Image Upload with magic-byte MIME validation, EXIF stripping,
     * resize (max 1400px), WebP conversion, and responsive variants.
     */
    public function uploadImage(UploadMediaRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $media = $this->mediaService->processUpload(
            $request->uploadedFile(),
            [
                'disk' => 'public',
                'directory' => 'blog/content/'.date('Y').'/'.date('m'),
                'max_width' => 1400,
                'prefer_webp_primary' => true,
                'alt_text' => $validated['alt'],
                'title' => $validated['title'] ?? null,
                'caption' => $validated['caption'] ?? null,
                'variants' => true,
            ],
            $request->user()
        );

        $this->audit->record('EDITOR_MEDIA_UPLOADED', $media, null, [
            'file_name' => $media->file_name,
            'mime_type' => $media->mime_type,
        ], $request->user());

        return response()->json([
            'success' => true,
            'url' => $media->url,
            'width' => $media->width,
            'height' => $media->height,
            'size' => $media->file_size,
            'formatted_size' => $media->formatted_size,
            'media_id' => $media->id,
            'alt' => $media->alt_text,
            'variants' => $media->variant_urls,
            'srcset' => $media->srcset,
        ]);
    }

    /**
     * Search published blog posts for Smart Internal Link Suggestions & Also Read cards.
     */
    public function internalLinks(Request $request): JsonResponse
    {
        $this->authorize('viewAny', BlogPost::class);

        $q = Str::limit(trim((string) $request->query('q', '')), 120, '');
        $excludeId = $request->integer('exclude_id') ?: null;

        $posts = $this->posts->searchInternalLinks($q, $excludeId, 15)
            ->map(function (BlogPost $post): array {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'url' => 'https://getintofeed.com/blog/'.$post->slug,
                    'relative_url' => '/blog/'.$post->slug,
                    'category' => $post->category,
                    'excerpt' => Str::limit(strip_tags((string) ($post->excerpt ?: '')), 120),
                    'focus_keyphrase' => $post->focus_keyphrase,
                    'published_at' => $post->published_at ? $post->published_at->format('d M Y') : '',
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'posts' => $posts,
        ]);
    }
}
