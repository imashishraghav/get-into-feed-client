<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'page_url' => 'nullable|string|max:1000',
            'page_title' => 'nullable|string|max:255',
            'referrer' => 'nullable|string|max:1000',
        ]);

        $pageUrl = $request->input('page_url') ?: $request->header('referer') ?: 'https://getintofeed.com';
        $pageTitle = $request->input('page_title') ?: 'GetIntoFeed Website';
        $referrer = $request->input('referrer') ?: $request->header('referer') ?: 'Direct Traffic';
        $source = $validated['source'] ?? 'Website Newsletter Form';

        $sub = Subscriber::updateOrCreate(
            ['email' => strtolower($validated['email'])],
            [
                'name' => $validated['name'] ?? null,
                'source' => $source,
                'page_url' => $pageUrl,
                'page_title' => $pageTitle,
                'referrer' => $referrer,
                'status' => 'subscribed',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'subscribed_at' => now(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Thank you for subscribing to Feed Notes! You will receive our next growth breakdown.',
        ], 200);
    }
}
