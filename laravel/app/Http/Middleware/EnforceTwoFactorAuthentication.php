<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceTwoFactorAuthentication
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->hasTwoFactorEnabled()) {
            if (! session('auth.two_factor_verified')) {
                // Allow the 2FA challenge and verification routes through
                if ($request->routeIs('admin.two-factor.*') || $request->is('admin/two-factor*')) {
                    return $next($request);
                }

                // If logging out, allow it
                if ($request->is('admin/logout') || $request->routeIs('filament.admin.auth.logout')) {
                    return $next($request);
                }

                return redirect()->route('admin.two-factor.challenge');
            }
        }

        return $next($request);
    }
}
