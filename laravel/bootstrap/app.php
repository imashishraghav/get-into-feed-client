<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withCommands([
        __DIR__ . '/../app/Console/Commands',
    ])
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustHosts(
            at: fn (): array => array_merge(
                [
                    'getintofeed.com',
                    'crm.getintofeed.com',
                    'api.getintofeed.com',
                    'localhost',
                    '127.0.0.1',
                ],
                config('app.trusted_hosts', [])
            ),
            subdomains: true,
        );

        $middleware->validateCsrfTokens(except: [
            'livewire/*',
            'admin/livewire/*',
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\SecurityHeaders::class,
        ]);

        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
            \App\Http\Middleware\SecurityHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if (! $request->is('api/*') && ! $request->is('cms-preview-data/*') && ! $request->expectsJson()) {
                return null;
            }

            if ($e instanceof \Illuminate\Validation\ValidationException) {
                return response()->json([
                    'success' => false,
                    'error' => config('app.debug') ? $e->getMessage() : 'The given data was invalid.',
                    'errors' => $e->errors(),
                    'code' => 422,
                ], 422);
            }

            $status = match (true) {
                $e instanceof \Illuminate\Auth\AuthenticationException => 401,
                $e instanceof \Illuminate\Auth\Access\AuthorizationException => 403,
                $e instanceof \Illuminate\Routing\Exceptions\InvalidSignatureException => 403,
                $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException => 404,
                $e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface => $e->getStatusCode(),
                default => 500,
            };

            $safeMessage = match ($status) {
                401 => 'Unauthenticated.',
                403 => 'Forbidden.',
                404 => 'Resource not found.',
                405 => 'Method not allowed.',
                419 => 'Page expired.',
                429 => 'Too many requests.',
                default => $status >= 500
                    ? 'An unexpected server error occurred.'
                    : (\Symfony\Component\HttpFoundation\Response::$statusTexts[$status] ?? 'Request failed.'),
            };

            return response()->json([
                'success' => false,
                'error' => config('app.debug') ? $e->getMessage() : $safeMessage,
                'code' => $status,
            ], $status);
        });
    })->create();
