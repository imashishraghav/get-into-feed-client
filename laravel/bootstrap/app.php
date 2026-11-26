<?php

use App\Http\Middleware\SecurityHeaders;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Http\Request;
use Illuminate\Routing\Exceptions\InvalidSignatureException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withCommands([
        __DIR__.'/../app/Console/Commands',
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

        $middleware->validateCsrfTokens(except: []);

        $middleware->web(append: [
            SecurityHeaders::class,
        ]);

        $middleware->api(prepend: [
            HandleCors::class,
            SecurityHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*') && ! $request->is('cms-preview-data/*') && ! $request->expectsJson()) {
                return null;
            }

            if ($e instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'error' => config('app.debug') ? $e->getMessage() : 'The given data was invalid.',
                    'errors' => $e->errors(),
                    'code' => 422,
                ], 422);
            }

            $status = match (true) {
                $e instanceof AuthenticationException => 401,
                $e instanceof AuthorizationException => 403,
                $e instanceof InvalidSignatureException => 403,
                $e instanceof ModelNotFoundException => 404,
                $e instanceof HttpExceptionInterface => $e->getStatusCode(),
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
                    : (Response::$statusTexts[$status] ?? 'Request failed.'),
            };

            return response()->json([
                'success' => false,
                'error' => config('app.debug') ? $e->getMessage() : $safeMessage,
                'code' => $status,
            ], $status);
        });
    })->create();
