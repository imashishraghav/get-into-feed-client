<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SectionTemplate;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function publicSettings(): JsonResponse
    {
        $all = Setting::allAsDictionary();

        // Default Navigation Items if not customized yet
        $defaultNav = [
            ['label' => 'Services', 'url' => '/services', 'is_highlight' => false],
            ['label' => 'Pricing', 'url' => '/pricing', 'is_highlight' => false],
            ['label' => 'Work', 'url' => '/work', 'is_highlight' => false],
            ['label' => 'About', 'url' => '/about', 'is_highlight' => false],
            ['label' => 'Blog', 'url' => '/blog', 'is_highlight' => false],
            ['label' => 'Contact', 'url' => '/contact', 'is_highlight' => true],
        ];

        // Default Footer Columns if not customized yet
        $defaultFooterColumns = [
            [
                'title' => 'Find your way',
                'links' => [
                    ['label' => 'Home', 'url' => '/'],
                    ['label' => 'Services', 'url' => '/services'],
                    ['label' => 'About us', 'url' => '/about'],
                    ['label' => 'Blog', 'url' => '/blog'],
                    ['label' => 'Contact us', 'url' => '/contact'],
                    ['label' => 'Pricing', 'url' => '/pricing'],
                ],
            ],
            [
                'title' => 'Popular services',
                'links' => [
                    ['label' => 'Google Ads', 'url' => '/services/google-ads-services-delhi-ncr'],
                    ['label' => 'Meta Ads', 'url' => '/services/meta-ads-services-delhi-ncr'],
                    ['label' => 'SEO', 'url' => '/services/seo-services-delhi-ncr'],
                    ['label' => 'Website design', 'url' => '/services/website-design-delhi-ncr'],
                ],
            ],
            [
                'title' => 'Talk directly',
                'links' => [
                    ['label' => 'hello@getintofeed.com', 'url' => 'mailto:hello@getintofeed.com'],
                    ['label' => '+91 88103 56950', 'url' => 'tel:+918810356950'],
                    ['label' => 'Privacy note', 'url' => '/privacy-policy'],
                    ['label' => 'Terms of service', 'url' => '/terms-of-service'],
                ],
            ],
        ];

        $settings = [
            // 1. General & Identity
            'site_name' => $all['site_name'] ?? 'GetIntoFeed',
            'agency_name' => $all['agency_name'] ?? 'GetIntoFeed Growth Studio',
            'tagline' => $all['tagline'] ?? "India's Elite Performance & Growth Marketing Agency",
            'site_url' => $all['site_url'] ?? 'https://getintofeed.com',
            'logo_text' => $all['logo_text'] ?? 'GETINTOFEED',
            'logo_url' => $all['logo_url'] ?? null,
            'alt_logo_url' => $all['alt_logo_url'] ?? null,
            'favicon_url' => $all['favicon_url'] ?? '/favicon.svg',

            // 2. Contact Coordinates
            'phone' => $all['contact_phone'] ?? $all['phone_primary'] ?? '+91 8810356950',
            'whatsapp' => $all['contact_whatsapp'] ?? '+91 8810356950',
            'email' => $all['contact_email'] ?? $all['email_primary'] ?? 'hello@getintofeed.com',
            'address' => $all['contact_address'] ?? $all['address'] ?? 'New Delhi, Delhi NCR, India',
            'starter_pricing' => $all['starter_pricing'] ?? '₹10,999*',
            'growth_pricing' => $all['growth_pricing'] ?? '₹24,999*',

            // 3. Header & Navigation
            'announcement_enabled' => isset($all['announcement_enabled']) ? (bool) $all['announcement_enabled'] : true,
            'announcement_text' => $all['announcement_text'] ?? 'GET SEEN ONLINE ✳ Google Ads · SEO · Websites · Social',
            'announcement_link' => $all['announcement_link'] ?? '/pricing',
            'announcement_link_label' => $all['announcement_link_label'] ?? 'Starter support from ₹10,999* →',
            'header_cta_label' => $all['header_cta_label'] ?? 'Start a Project',
            'header_cta_url' => $all['header_cta_url'] ?? '/contact',
            'navigation_items' => ! empty($all['navigation_items']) && is_array($all['navigation_items']) ? $all['navigation_items'] : $defaultNav,

            // 4. Footer & Legal
            'footer_description' => $all['footer_description'] ?? 'Google Ads, SEO, websites and creative work for businesses ready to build a stronger online presence.',
            'footer_subtext' => $all['footer_subtext'] ?? 'An independent, remote-first freelance team serving Delhi NCR and beyond.',
            'copyright_text' => $all['copyright_text'] ?? '© 2026 GetIntoFeed · Independent digital marketing team',
            'footer_bottom_note' => $all['footer_bottom_note'] ?? 'Independent freelancers · No made-up results · Your accounts stay yours',
            'footer_columns' => ! empty($all['footer_columns']) && is_array($all['footer_columns']) ? $all['footer_columns'] : $defaultFooterColumns,

            // Social Profiles
            'instagram_url' => $all['instagram_url'] ?? 'https://instagram.com/getintofeed',
            'linkedin_url' => $all['linkedin_url'] ?? 'https://linkedin.com/company/getintofeed',
            'twitter_url' => $all['twitter_url'] ?? 'https://x.com/getintofeed',
            'youtube_url' => $all['youtube_url'] ?? '',
            'github_url' => $all['github_url'] ?? '',

            // 5. Branding & Appearance Tokens
            'primary_color' => $all['primary_color'] ?? '#d4ff00',
            'dark_color' => $all['dark_color'] ?? '#111714',
            'blue_accent' => $all['blue_accent'] ?? '#3155f4',
            'font_family' => $all['font_family'] ?? 'Space Grotesk',
            'button_radius' => $all['button_radius'] ?? 'rounded-xl',

            // 6. Global SEO
            'default_meta_title' => $all['default_meta_title'] ?? 'GetIntoFeed | Top Performance Marketing, Google Ads & SEO Agency Delhi NCR',
            'default_meta_description' => $all['default_meta_description'] ?? 'Scale pipeline with GetIntoFeed performance marketing, SEO, Google Ads, and custom high-converting web engineering in Delhi NCR.',
            'default_share_image' => $all['default_share_image'] ?? 'https://getintofeed.com/agency-hero.png',
            'organization_name' => $all['organization_name'] ?? 'GetIntoFeed Growth Studio',
            'organization_schema_type' => $all['organization_schema_type'] ?? 'Organization',
            'robots_default' => $all['robots_default'] ?? 'index, follow',

            // 7. Analytics & Integrations (Safe Public IDs Only)
            'gtm_id' => $all['gtm_id'] ?? 'GTM-PHJF6JHM',
            'ga4_id' => $all['ga4_id'] ?? 'G-LHVZY6EFW1',
            'meta_pixel_id' => $all['meta_pixel_id'] ?? '',
        ];

        return response()->json([
            'success' => true,
            'settings' => $settings,
            'synced_at' => now()->toIso8601String(),
        ]);
    }

    public function sectionTemplates(): JsonResponse
    {
        $templates = SectionTemplate::where('is_active', true)->orderBy('category')->get();

        return response()->json([
            'success' => true,
            'templates' => $templates,
        ]);
    }
}
