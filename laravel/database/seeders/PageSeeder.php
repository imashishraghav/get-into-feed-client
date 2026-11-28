<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\SeoMetadata;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'about',
                'title' => 'About GetIntoFeed',
                'content' => '<h2>We Build Marketing That People Actually Remember</h2><p>GetIntoFeed is a senior strategist-led growth and creative engineering studio headquartered in New Delhi. We replace bloated agency models with high-velocity creative testing, algorithmic paid media, and conversion-focused web engineering.</p>',
                'status' => 'published',
                'seo' => [
                    'seo_title' => 'About GetIntoFeed | Performance Marketing & Creative Studio',
                    'meta_description' => 'Founded by seasoned performance marketers and creative directors to replace slow agency models with high-velocity creative testing and paid growth.',
                    'canonical_url' => 'https://getintofeed.com/about',
                ],
            ],
            [
                'slug' => 'contact',
                'title' => 'Start a Project Consultation',
                'content' => '<h2>Start a Direct Conversation With Our Strategy Lead</h2><p>Tell us what you sell, where you operate, and your monthly growth targets. We will evaluate your current funnels and recommend a realistic starting sprint.</p>',
                'status' => 'published',
                'seo' => [
                    'seo_title' => 'Contact GetIntoFeed | Book a 30-Minute Growth Strategy Call',
                    'meta_description' => 'Reach out to our growth directors in New Delhi. Submit your inquiry or call +91-8810356950 to unlock high-performing ad creatives and paid funnel growth.',
                    'canonical_url' => 'https://getintofeed.com/contact',
                ],
            ],
            [
                'slug' => 'pricing',
                'title' => 'Transparent Sprint Pricing & Retainers',
                'content' => '<h2>Transparent Growth Sprints. No Mandatory Retainers.</h2><p>Choose an agile 30-day growth sprint or full-funnel retainer. Deliverables, KPIs, and pricing are defined upfront with zero hidden fees.</p>',
                'status' => 'published',
                'seo' => [
                    'seo_title' => 'Pricing & Growth Sprints | Transparent Retainers | GetIntoFeed',
                    'meta_description' => 'Explore transparent engagement models: Full-Funnel Growth Retainer, Creative Reels Studio, Paid Ads Management, and Performance SEO with zero hidden fees.',
                    'canonical_url' => 'https://getintofeed.com/pricing',
                ],
            ],
        ];

        foreach ($pages as $pData) {
            $seoData = $pData['seo'];
            unset($pData['seo']);

            $page = Page::updateOrCreate(['slug' => $pData['slug']], $pData);

            SeoMetadata::updateOrCreate(
                [
                    'seoble_type' => Page::class,
                    'seoble_id' => $page->id,
                ],
                [
                    'seo_title' => $seoData['seo_title'],
                    'meta_description' => $seoData['meta_description'],
                    'canonical_url' => $seoData['canonical_url'],
                    'robots_index' => true,
                    'robots_follow' => true,
                    'in_sitemap' => true,
                ]
            );
        }
    }
}
