<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireRecentAuthentication
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            return $next($request);
        }

        $ttlMinutes = max(1, (int) config('cms.two_factor.reauth_ttl_minutes', 15));
        $reauthAt = (int) session('auth.reauthenticated_at', 0);

        if ($reauthAt > 0 && (time() - $reauthAt) <= ($ttlMinutes * 60)) {
            return $next($request);
        }

        if ($request->expectsJson() || $request->is('admin/api/*')) {
            return response()->json([
                'success' => false,
                'error' => 'Recent password verification required.',
                'redirect' => route('admin.two-factor.reauth'),
            ], 423);
        }

        session(['url.intended' => $request->fullUrl()]);

        return redirect()->route('admin.two-factor.reauth');
    }
}
