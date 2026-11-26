<?php

return [
    'enabled' => filter_var(env('LEAD_ALERTS_ENABLED', true), FILTER_VALIDATE_BOOLEAN),
    'recipient' => env('LEAD_NOTIFICATION_RECIPIENT', env('MAIL_FROM_ADDRESS', 'hello@getintofeed.com')),
    'email_to' => env('LEAD_ALERT_EMAIL_TO', env('MAIL_FROM_ADDRESS', 'hello@getintofeed.com')),
    'whatsapp_enabled' => filter_var(env('WHATSAPP_ALERTS_ENABLED', false), FILTER_VALIDATE_BOOLEAN)
        || ! empty(env('WHATSAPP_CALLMEBOT_APIKEY'))
        || (! empty(env('WHATSAPP_ACCESS_TOKEN')) && env('WHATSAPP_ACCESS_TOKEN') !== 'replace_with_meta_access_token')
        || ! empty(env('WHATSAPP_WEBHOOK_URL')),
];
