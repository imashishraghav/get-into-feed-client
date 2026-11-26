<?php

return [
    'mcp_api_key' => env('MCP_API_KEY'),

    'bootstrap_admin' => [
        'name' => env('ADMIN_BOOTSTRAP_NAME', ''),
        'email' => env('ADMIN_BOOTSTRAP_EMAIL', ''),
        'password' => env('ADMIN_BOOTSTRAP_PASSWORD', ''),
    ],

    'health_token' => env('SYSTEM_HEALTH_TOKEN'),

    'media' => [
        'max_kb' => (int) env('MEDIA_MAX_UPLOAD_KB', 25600),
        'editor_max_kb' => (int) env('EDITOR_MEDIA_MAX_KB', 5120),
        'webp_quality' => (int) env('MEDIA_WEBP_QUALITY', 82),
        'responsive_widths' => [400, 800, 1200],
    ],

    'blog' => [
        'preview_ttl_minutes' => (int) env('BLOG_PREVIEW_TTL_MINUTES', 1440),
        'revisions_limit' => (int) env('BLOG_REVISIONS_LIMIT', 50),
    ],

    'two_factor' => [
        'grace_days' => (int) env('CMS_2FA_GRACE_DAYS', 7),
        'trust_device_days' => (int) env('CMS_2FA_TRUST_DAYS', 30),
        'cookie_name' => 'gif_mfa_trust',
    ],
];
