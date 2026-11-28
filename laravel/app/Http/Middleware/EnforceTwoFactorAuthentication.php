<?php

namespace App\Http\Middleware;

use App\Services\TwoFactorAuthService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceTwoFactorAuthentication
{
    public function __construct(
        private readonly TwoFactorAuthService $tfaService
    ) {}

    /**
     * Enforce 2FA challenge only when enrolled, recovery codes saved, and grace period elapsed.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->requiresTwoFactorChallenge()) {
            return $next($request);
        }

        if ($request->routeIs('admin.two-factor.*') || $request->is('admin/two-factor*')) {
            return $next($request);
        }

        if ($request->is('admin/logout') || $request->routeIs('filament.admin.auth.logout')) {
            return $next($request);
        }

        if (session('auth.two_factor_verified')) {
            return $next($request);
        }

        $cookieName = (string) config('cms.two_factor.cookie_name', 'gif_mfa_trust');
        $trustedCookie = $request->cookie($cookieName);
        if (is_string($trustedCookie) && $this->tfaService->hasValidTrustedDeviceToken($user, $trustedCookie)) {
            session(['auth.two_factor_verified' => true]);

            return $next($request);
        }

        if ($request->expectsJson() || $request->is('admin/api/*')) {
            return response()->json([
                'success' => false,
                'error' => 'Two-factor authentication verification required.',
                'redirect' => route('admin.two-factor.challenge'),
            ], 403);
        }

        return redirect()->route('admin.two-factor.challenge');
    }
}
