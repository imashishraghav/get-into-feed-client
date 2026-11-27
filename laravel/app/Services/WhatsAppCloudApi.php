<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class WhatsAppCloudApi
{
    /**
     * Dispatches lead alert to the configured WhatsApp channel (CallMeBot, Meta Cloud API, or Webhook).
     */
    public function sendLeadAlert(array $lead): ?string
    {
        $gateway = (string) config('services.whatsapp.gateway', 'meta');
        $to = preg_replace('/\D+/', '', (string) config('services.whatsapp.alert_to', '918810356950'));

        if (! preg_match('/^[1-9][0-9]{7,14}$/', $to ?: '')) {
            throw new RuntimeException('WHATSAPP_ALERT_TO must be an international number without + or spaces.');
        }

        // 1. CallMeBot Gateway (Direct instant personal WhatsApp alerts)
        if ($gateway === 'callmebot' || (! empty(config('services.whatsapp.callmebot_apikey')) && (empty(config('services.whatsapp.token')) || config('services.whatsapp.token') === 'replace_with_meta_access_token'))) {
            return $this->sendViaCallMeBot($lead, $to);
        }

        // 2. Custom Webhook (Wati, Aisensy, Zapier, Make)
        if ($gateway === 'webhook' || ! empty(config('services.whatsapp.webhook_url'))) {
            return $this->sendViaWebhook($lead, $to);
        }

        // 3. Official Meta WhatsApp Business Cloud API
        return $this->sendViaMetaCloud($lead, $to);
    }

    private function sendViaCallMeBot(array $lead, string $to): ?string
    {
        $apiKey = (string) config('services.whatsapp.callmebot_apikey');
        if (empty($apiKey)) {
            throw new RuntimeException('CallMeBot API Key is missing. Set WHATSAPP_CALLMEBOT_APIKEY in .env.');
        }

        $formattedPhone = str_starts_with($to, '+') ? $to : '+'.$to;
        $name = $this->templateValue($lead['name'] ?? 'Not provided');
        $phone = $this->templateValue($lead['phone'] ?? 'Not provided');
        $email = $this->templateValue($lead['email'] ?? 'Not provided');
        $service = $this->templateValue($lead['service'] ?? 'Not specified');
        $source = $this->templateValue($lead['source'] ?? 'Website');
        $message = $this->templateValue($lead['message'] ?? 'No message');
        $time = $lead['created_at'] ?? now()->format('d M Y, h:i A');

        $text = "🚀 *NEW WEBSITE LEAD - GETINTOFEED*\n\n"
              ."👤 *Name:* {$name}\n"
              ."📞 *Phone:* {$phone}\n"
              ."✉️ *Email:* {$email}\n"
              ."🎯 *Service:* {$service}\n"
              ."📍 *Source:* {$source}\n"
              ."💬 *Message:* {$message}\n"
              ."📅 *Date:* {$time}";

        $response = Http::connectTimeout(10)
            ->timeout(25)
            ->get('https://api.callmebot.com/whatsapp.php', [
                'phone' => $formattedPhone,
                'text' => $text,
                'apikey' => $apiKey,
            ]);

        $response->throw();

        return 'callmebot_'.uniqid();
    }

    private function sendViaWebhook(array $lead, string $to): ?string
    {
        $url = (string) config('services.whatsapp.webhook_url');
        if (empty($url)) {
            throw new RuntimeException('WhatsApp Webhook URL is missing. Set WHATSAPP_WEBHOOK_URL in .env.');
        }

        $response = Http::acceptJson()
            ->connectTimeout(10)
            ->timeout(25)
            ->post($url, [
                'event' => 'new_lead_alert',
                'alert_to' => $to,
                'lead' => $lead,
                'timestamp' => now()->toISOString(),
            ]);

        $response->throw();

        return 'webhook_'.uniqid();
    }

    private function sendViaMetaCloud(array $lead, string $to): ?string
    {
        $token = (string) config('services.whatsapp.token');
        $phoneNumberId = (string) config('services.whatsapp.phone_number_id');
        $apiVersion = (string) config('services.whatsapp.graph_api_version', 'v27.0');
        $templateName = (string) config('services.whatsapp.template_name');
        $language = (string) config('services.whatsapp.template_language', 'en_US');

        if ($token === '' || $token === 'replace_with_meta_access_token' || $phoneNumberId === '' || $phoneNumberId === 'replace_with_phone_number_id' || $templateName === '') {
            throw new RuntimeException('WhatsApp Cloud API is not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env.');
        }

        $values = [
            $this->templateValue($lead['name'] ?? 'Not provided'),
            $this->templateValue($lead['phone'] ?? 'Not provided'),
            $this->templateValue($lead['email'] ?? 'Not provided'),
            $this->templateValue($lead['service'] ?? 'Not specified'),
            $this->templateValue($lead['source'] ?? 'Website'),
            $this->templateValue($lead['message'] ?? 'No message'),
        ];

        $response = Http::acceptJson()
            ->withToken($token)
            ->connectTimeout(10)
            ->timeout(25)
            ->post("https://graph.facebook.com/{$apiVersion}/{$phoneNumberId}/messages", [
                'messaging_product' => 'whatsapp',
                'recipient_type' => 'individual',
                'to' => $to,
                'type' => 'template',
                'template' => [
                    'name' => $templateName,
                    'language' => ['code' => $language],
                    'components' => [[
                        'type' => 'body',
                        'parameters' => array_map(
                            fn (string $value): array => ['type' => 'text', 'text' => $value],
                            $values
                        ),
                    ]],
                ],
            ]);

        $response->throw();

        return $response->json('messages.0.id');
    }

    private function templateValue(mixed $value): string
    {
        $value = trim(strip_tags((string) $value));

        return Str::limit($value !== '' ? $value : 'Not provided', 900, '…');
    }
}
