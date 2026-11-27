<?php

return [

    'name' => env('APP_NAME', 'GetIntoFeed Enterprise CMS'),

    'env' => env('APP_ENV', 'production'),

    'debug' => (bool) env('APP_DEBUG', false),

    'url' => env('APP_URL', 'https://getintofeed.com'),

    'frontend_url' => env('FRONTEND_URL', env('APP_URL', 'https://getintofeed.com')),

    'trusted_hosts' => array_values(array_filter(array_unique(array_merge(
        [
            parse_url(env('APP_URL', 'https://getintofeed.com'), PHP_URL_HOST),
            parse_url(env('FRONTEND_URL', env('APP_URL', 'https://getintofeed.com')), PHP_URL_HOST),
        ],
        env('APP_ENV', 'production') === 'local' ? ['localhost', '127.0.0.1'] : [],
    )))),

    'timezone' => env('APP_TIMEZONE', 'Asia/Kolkata'),

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
