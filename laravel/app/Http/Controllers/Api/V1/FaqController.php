<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Faq::where('status', 'published')
            ->orderBy('sort_order', 'asc');

        if ($request->has('category')) {
            $query->where('category', $request->query('category'));
        }

        $faqs = $query->get()->map(function ($f) {
            return [
                'id' => $f->id,
                'category' => $f->category,
                'question' => $f->question,
                'q' => $f->question, // Compatibility alias
                'answer' => $f->answer,
                'a' => $f->answer, // Compatibility alias
            ];
        });

        return response()->json([
            'success' => true,
            'count' => $faqs->count(),
            'faqs' => $faqs, // Consumed by App.jsx
        ]);
    }
}
