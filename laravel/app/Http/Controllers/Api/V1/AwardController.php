<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Award;
use Illuminate\Http\JsonResponse;

class AwardController extends Controller
{
    public function index(): JsonResponse
    {
        $awards = Award::with('badge')
            ->where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'org' => $a->organization,
                    'organization' => $a->organization,
                    'year' => $a->year,
                    'category' => $a->category,
                    'description' => $a->description,
                    'badge_url' => $a->badge?->url ?: '',
                ];
            });

        return response()->json([
            'success' => true,
            'count' => $awards->count(),
            'awards' => $awards, // Consumed by App.jsx
        ]);
    }
}
