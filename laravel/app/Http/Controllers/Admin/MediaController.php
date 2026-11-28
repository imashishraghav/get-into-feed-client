<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadMediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Repositories\MediaRepository;
use App\Services\AuditLogService;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(
        private readonly MediaRepository $mediaRepo,
        private readonly MediaService $mediaService,
        private readonly AuditLogService $audit,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Media::class);

        $search = $request->query('q') ?: $request->query('search');
        $folderId = $request->integer('folder_id') ?: null;
        $perPage = max(1, min(100, $request->integer('per_page', 50)));

        $items = $this->mediaRepo->paginateForAdmin($search, $folderId, $perPage);
        $resourceData = MediaResource::collection($items->items())->resolve($request);

        return response()->json([
            'success' => true,
            'media' => $resourceData,
            'data' => $resourceData,
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function store(UploadMediaRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $media = $this->mediaService->processUpload(
            $request->uploadedFile(),
            [
                'disk' => 'public',
                'directory' => 'media',
                'alt_text' => $validated['alt'],
                'title' => $validated['title'] ?? null,
                'caption' => $validated['caption'] ?? null,
                'description' => $validated['description'] ?? null,
                'folder_id' => $validated['folder_id'] ?? null,
                'variants' => true,
            ],
            $request->user()
        );

        $this->audit->record('MEDIA_UPLOADED', $media, null, [
            'file_name' => $media->file_name,
            'mime_type' => $media->mime_type,
            'file_size' => $media->file_size,
        ], $request->user());

        $payload = (new MediaResource($media))->resolve($request);

        return response()->json([
            'success' => true,
            'media' => $payload,
            'data' => $payload,
        ], 201);
    }
}
