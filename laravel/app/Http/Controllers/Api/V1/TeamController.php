<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        $team = TeamMember::with('avatar')
            ->where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->get()
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'role' => $m->role,
                    'bio' => $m->bio,
                    'expertise' => $m->expertise ?? [],
                    'image' => $m->avatar?->url ?: '',
                    'linkedin' => $m->linkedin_url,
                    'twitter' => $m->twitter_url,
                ];
            });

        return response()->json([
            'success' => true,
            'count' => $team->count(),
            'team' => $team, // Consumed by App.jsx
        ]);
    }
}
