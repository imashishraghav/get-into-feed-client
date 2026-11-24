<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and apply production-grade security headers.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // 1. Prevent MIME-sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // 2. Clickjacking protection (Filament requires SAMEORIGIN for modals/embeds)
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // 3. Referrer governance
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // 4. Permissions policy (disable invasive browser hardware APIs)
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

        // 5. Cross-Site Scripting filter for legacy browsers
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // 6. HTTP Strict Transport Security (HSTS) - enforce in production/HTTPS
        if ($request->isSecure() || app()->isProduction() || $request->header('X-Forwarded-Proto') === 'https') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // 7. Noindex directive for Admin & CRM panels
        if ($request->is('admin*') || $request->is('crm*') || $request->is('api/v1/crm*') || $request->getHost() === 'crm.getintofeed.com') {
            $response->headers->set('X-Robots-Tag', 'noindex, nofollow, noarchive');
        }

        return $response;
    }
}
