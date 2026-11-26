<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    */

    'whatsapp' => [
        'gateway' => env('WHATSAPP_GATEWAY', 'meta'), // 'meta', 'callmebot', 'webhook'
        'token' => env('WHATSAPP_ACCESS_TOKEN'),
        'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID'),
        'graph_api_version' => env('WHATSAPP_GRAPH_API_VERSION', 'v27.0'),
        'alert_to' => env('WHATSAPP_ALERT_TO', '918810356950'),
        'template_name' => env('WHATSAPP_TEMPLATE_NAME', 'new_website_lead_alert'),
        'template_language' => env('WHATSAPP_TEMPLATE_LANGUAGE', 'en_US'),
        'callmebot_apikey' => env('WHATSAPP_CALLMEBOT_APIKEY'),
        'webhook_url' => env('WHATSAPP_WEBHOOK_URL'),
    ],

    'crm' => [
        'endpoint' => env('CRM_API_ENDPOINT', 'https://crm.getintofeed.com/api/v1/inbound-leads'),
        'secret' => env('CRM_SYNC_SECRET'),
        'timeout' => (int) env('CRM_SYNC_TIMEOUT', 10),
    ],

    'mcp' => [
        'key' => env('MCP_API_KEY'),
    ],

];
