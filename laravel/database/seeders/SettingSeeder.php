<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['group' => 'general', 'key' => 'site_name', 'value' => 'GetIntoFeed', 'is_public' => true],
            ['group' => 'general', 'key' => 'tagline', 'value' => "India's Elite Performance & Growth Marketing Agency", 'is_public' => true],
            ['group' => 'general', 'key' => 'site_url', 'value' => 'https://getintofeed.com', 'is_public' => true],

            ['group' => 'contact', 'key' => 'phone_primary', 'value' => '+91 98765 43210', 'is_public' => true],
            ['group' => 'contact', 'key' => 'email_primary', 'value' => 'hello@getintofeed.com', 'is_public' => true],
            ['group' => 'contact', 'key' => 'address', 'value' => 'Gurgaon CyberCity, DLF Phase 2 & Bengaluru Innovation Hub, India', 'is_public' => true],

            ['group' => 'social', 'key' => 'linkedin_url', 'value' => 'https://linkedin.com/company/getintofeed', 'is_public' => true],
            ['group' => 'social', 'key' => 'twitter_url', 'value' => 'https://x.com/getintofeed', 'is_public' => true],
            ['group' => 'social', 'key' => 'instagram_url', 'value' => 'https://instagram.com/getintofeed', 'is_public' => true],

            ['group' => 'branding', 'key' => 'primary_color', 'value' => '#cfff04', 'is_public' => true],
            ['group' => 'branding', 'key' => 'dark_color', 'value' => '#111827', 'is_public' => true],

            ['group' => 'footer', 'key' => 'copyright_text', 'value' => '© 2026 GetIntoFeed Digital Media. All rights reserved.', 'is_public' => true],
        ];

        foreach ($settings as $s) {
            Setting::updateOrCreate(
                ['key' => $s['key']],
                $s
            );
        }
    }
}
