<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Testimonial::with('avatar')
            ->where('status', 'published')
            ->orderBy('sort_order', 'asc')
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'name' => $t->client_name,
                    'client_name' => $t->client_name,
                    'role' => $t->client_role,
                    'client_role' => $t->client_role,
                    'company' => $t->company,
                    'quote' => $t->quote,
                    'rating' => $t->rating,
                    'service' => $t->service_tag,
                    'result_metric' => $t->result_metric,
                    'avatar' => $t->avatar?->url ?: '',
                ];
            });

        return response()->json([
            'success' => true,
            'count' => $items->count(),
            'testimonials' => $items, // Consumed by App.jsx
            'reviews' => $items,
        ]);
    }
}
