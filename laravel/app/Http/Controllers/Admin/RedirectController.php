<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRedirectRequest;
use App\Models\Redirect;
use App\Services\AuditLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RedirectController extends Controller
{
    public function __construct(private readonly AuditLogService $audit) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Redirect::class);

        $redirects = Redirect::query()
            ->orderByDesc('id')
            ->paginate(max(1, min(100, $request->integer('per_page', 30))));

        return response()->json([
            'success' => true,
            'data' => $redirects->items(),
            'meta' => [
                'current_page' => $redirects->currentPage(),
                'last_page' => $redirects->lastPage(),
                'total' => $redirects->total(),
            ],
        ]);
    }

    public function store(StoreRedirectRequest $request): JsonResponse
    {
        $data = $request->validated();
        $source = '/'.ltrim(trim((string) $data['source_url']), '/');
        $target = trim((string) $data['target_url']);

        $redirect = Redirect::updateOrCreate(
            ['source_url' => $source],
            [
                'target_url' => $target,
                'status_code' => (int) ($data['status_code'] ?? 301),
                'is_active' => array_key_exists('is_active', $data) ? (bool) $data['is_active'] : true,
            ]
        );

        $this->audit->record('REDIRECT_SAVED', $redirect, null, [
            'source_url' => $redirect->source_url,
            'target_url' => $redirect->target_url,
            'status_code' => $redirect->status_code,
        ], $request->user());

        return response()->json([
            'success' => true,
            'redirect' => $redirect,
        ], 201);
    }
}
