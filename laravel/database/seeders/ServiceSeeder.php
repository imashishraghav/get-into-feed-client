<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $mediaSeo = Media::where('file_name', 'service-seo.jpg')->first()?->id;
        $mediaAds = Media::where('file_name', 'service-performance-marketing.jpg')->first()?->id;
        $mediaSocial = Media::where('file_name', 'service-social-media.jpg')->first()?->id;
        $mediaContent = Media::where('file_name', 'service-content-marketing.jpg')->first()?->id;
        $mediaWeb = Media::where('file_name', 'service-web-development.jpg')->first()?->id;

        $services = [
            [
                'name' => 'SEO Services',
                'slug' => 'seo-services',
                'category' => 'Organic Search',
                'short_description' => 'Dominate high-intent search rankings across Google and modern generative AI engines with authoritative programmatic architecture.',
                'pricing_tier' => 'From ₹55,000 / mo',
                'hero_heading' => 'Dominate Search Intent & Organic Revenue Pipeline',
                'hero_description' => 'We map commercial bottom-of-funnel keywords, engineer sub-second Core Web Vitals, and build authoritative content clusters cited by Google and AI engines.',
                'hero_media_id' => $mediaSeo,
                'cta_label' => 'Claim Free SEO Audit',
                'cta_url' => '/audit',
                'overview' => 'Search Engine Optimization is not about stuffing keywords into blog posts. It is about engineering a dominant organic distribution asset that systematically captures inbound commercial demand.',
                'what_we_do' => 'From comprehensive technical crawl remediation to bottom-of-funnel keyword mapping and generative search optimization, we turn your domain into an industry authority.',
                'deliverables' => [
                    'Technical SEO Diagnostics & Crawl Health',
                    'Bottom-of-Funnel Keyword Intent Matrix',
                    'Topical Authority Silos & Pillar Content',
                    'Schema.org & LLM Citation Graph',
                    'High-Authority Editorial Backlink Strategy',
                    'Core Web Vitals & Sub-Second Page Speed',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Technical Diagnostics', 'description' => 'Full crawl architecture analysis, log file audits, and crawl bottleneck identification.'],
                    ['step' => '02', 'title' => 'Keyword Architecture', 'description' => 'Mapping search queries by commercial buying intent.'],
                    ['step' => '03', 'title' => 'Pillar Sprint', 'description' => 'Deploying comprehensive pillar guides and authoritative topic clusters.'],
                    ['step' => '04', 'title' => 'Authority Building', 'description' => 'Securing genuine high-DR publisher mentions with zero spam links.'],
                ],
                'sort_order' => 1,
                'status' => 'published',
            ],
            [
                'name' => 'Performance Marketing & Paid Ads',
                'slug' => 'performance-marketing',
                'category' => 'Paid Media',
                'short_description' => 'Scale customer acquisition with rigorous creative testing, algorithmic bidding, and deep first-party attribution across Meta and Google Ads.',
                'pricing_tier' => 'From ₹75,000 / mo',
                'hero_heading' => 'Turn Ad Spend Into Scalable, Predictable Revenue',
                'hero_description' => 'Stop burning capital on uncalibrated broad audiences. We deploy data-driven full-funnel paid media campaigns that maintain high ROAS.',
                'hero_media_id' => $mediaAds,
                'cta_label' => 'Audit Paid Ad Accounts',
                'cta_url' => '/contact',
                'overview' => 'Performance marketing requires deep alignment between quantitative algorithmic bidding and high-velocity qualitative creative testing.',
                'what_we_do' => 'We manage multi-crore ad budgets across Meta Ads, Google Performance Max, Search, and YouTube, tracking unit economics down to net customer lifetime value.',
                'deliverables' => [
                    'Meta Ads Account Restructuring & CAPI Setup',
                    'Google Ads Performance Max & Search Alpha/Beta',
                    'High-Volume Creative Angle & Hook Testing',
                    'Server-Side Event Tracking (Conversion API)',
                    'Blended ROAS & Multi-Touch Attribution Dashboards',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Account Restructuring', 'description' => 'Auditing conversion tracking, exclusions, and historical performance data.'],
                    ['step' => '02', 'title' => 'Creative Sprint', 'description' => 'Developing thumb-stopping visual hooks and UGC direct-response creatives.'],
                    ['step' => '03', 'title' => 'Algorithmic Scaling', 'description' => 'Incrementally scaling winning ad sets while pruning underperforming creative variations.'],
                    ['step' => '04', 'title' => 'Retention Optimization', 'description' => 'Building first-party audience retention and repeat purchase funnels.'],
                ],
                'sort_order' => 2,
                'status' => 'published',
            ],
            [
                'name' => 'Social Media Marketing & Viral Content',
                'slug' => 'social-media-marketing',
                'category' => 'Brand & Creative',
                'short_description' => 'Transform your brand into a cultural heavyweight with thumb-stopping short-form video, reels, and organic distribution frameworks.',
                'pricing_tier' => 'From ₹65,000 / mo',
                'hero_heading' => 'Stop Thumbs Dead in the Feed',
                'hero_description' => 'We build culturally relevant content machines that generate organic reach, cult community loyalty, and inbound customer demand.',
                'hero_media_id' => $mediaSocial,
                'cta_label' => 'Explore Content Strategy',
                'cta_url' => '/contact',
                'overview' => 'Traditional corporate social media posting is dead. Today’s algorithms reward authenticity, sharp editorial hooks, and narrative-driven video.',
                'what_we_do' => 'We ideate, script, shoot, and edit high-retention short-form video that resonates across Instagram Reels, YouTube Shorts, and LinkedIn.',
                'deliverables' => [
                    'High-Retention Reels & Shorts Production',
                    'Scriptwriting & Creative Hook Engineering',
                    'Brand Aesthetic & Visual Design Language',
                    'Influencer & Creator Collaboration Pipeline',
                    'Social Community Growth & Engagement',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Content Matrix', 'description' => 'Defining content pillars, tone of voice, and visual storytelling cues.'],
                    ['step' => '02', 'title' => 'Production Sprint', 'description' => 'Scripting and shooting multi-asset creative batches.'],
                    ['step' => '03', 'title' => 'Post-Production', 'description' => 'Dynamic editing, motion graphics, and sound design optimized for retention.'],
                    ['step' => '04', 'title' => 'Distribution & Analysis', 'description' => 'Optimized scheduling and engagement data tracking.'],
                ],
                'sort_order' => 3,
                'status' => 'published',
            ],
            [
                'name' => 'Content Marketing & Editorial Strategy',
                'slug' => 'content-marketing',
                'category' => 'Content Studio',
                'short_description' => 'High-conviction thought leadership and product-led content playbooks that convert cold readers into high-paying enterprise buyers.',
                'pricing_tier' => 'From ₹50,000 / mo',
                'hero_heading' => 'High-Taste Editorial Content That Converts',
                'hero_description' => 'No AI-generated fluff. We write deeply researched, authoritative articles and teardowns that establish your market leadership.',
                'hero_media_id' => $mediaContent,
                'cta_label' => 'Schedule Content Consultation',
                'cta_url' => '/contact',
                'overview' => 'B2B buyers research extensively before speaking to sales. Authoritative content builds compounding trust throughout the consideration journey.',
                'what_we_do' => 'We produce in-depth whitepapers, executive thought leadership, and comparison guides that directly accelerate deal velocity.',
                'deliverables' => [
                    'Industry Whitepapers & Research Reports',
                    'Executive Ghostwriting on LinkedIn & Twitter/X',
                    'Product-Led SEO Playbooks & Documentation',
                    'Customer Case Study Storytelling',
                    'Email Newsletter Architecture',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Audience Research', 'description' => 'Interviewing customers and internal subject matter experts.'],
                    ['step' => '02', 'title' => 'Editorial Calendar', 'description' => 'Mapping strategic themes and high-intent commercial narratives.'],
                    ['step' => '03', 'title' => 'Crafting & Review', 'description' => 'Authoring rigorously fact-checked, high-conviction content.'],
                    ['step' => '04', 'title' => 'Syndication', 'description' => 'Distributing across newsletters, community hubs, and social channels.'],
                ],
                'sort_order' => 4,
                'status' => 'published',
            ],
            [
                'name' => 'Web Design, Development & CRO',
                'slug' => 'web-design-development',
                'category' => 'Engineering & CRO',
                'short_description' => 'Sub-second, responsive digital flagships engineered in modern React and headless architectures with laser-focused conversion funnels.',
                'pricing_tier' => 'From ₹1,20,000 / project',
                'hero_heading' => 'Sub-Second Digital Flagships That Convert Traffic',
                'hero_description' => 'Your website is your best salesperson. We design ultra-clean, high-performance web experiences that maximize revenue per visitor.',
                'hero_media_id' => $mediaWeb,
                'cta_label' => 'Request Web Audit',
                'cta_url' => '/audit',
                'overview' => 'A 1-second delay in page load time reduces conversions by 7%. We build lightweight, blazing-fast web architectures designed for conversion.',
                'what_we_do' => 'From bespoke UI/UX Figma prototypes to modern React frontend implementations and conversion rate optimization sprints.',
                'deliverables' => [
                    'Custom Figma UI/UX Design Systems',
                    'Modern React & Next.js Headless Architecture',
                    '100/100 Core Web Vitals & Sub-Second Loading',
                    'Conversion Rate Optimization (CRO) Funnels',
                    'Integrated Analytics & Form Capture Systems',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Wireframing & UX', 'description' => 'Mapping user journeys and conversion psychology.'],
                    ['step' => '02', 'title' => 'High-Fidelity UI', 'description' => 'Designing modern typography, micro-interactions, and aesthetics.'],
                    ['step' => '03', 'title' => 'Clean Code Build', 'description' => 'Engineering fast, accessible, and responsive components.'],
                    ['step' => '04', 'title' => 'CRO Testing', 'description' => 'Continuous heatmaps and A/B split tests.'],
                ],
                'sort_order' => 5,
                'status' => 'published',
            ],
            [
                'name' => 'App Store Optimization (ASO)',
                'slug' => 'app-store-optimization',
                'category' => 'Mobile Growth',
                'short_description' => 'Maximize organic iOS App Store and Google Play installs through keyword positioning, visual asset A/B testing, and review sentiment engineering.',
                'pricing_tier' => 'From ₹45,000 / mo',
                'hero_heading' => 'Scale Organic App Installs Across iOS & Android',
                'hero_description' => 'Dominate app store search results with algorithmic metadata optimization and high-converting app screenshots and preview videos.',
                'hero_media_id' => $mediaSeo,
                'cta_label' => 'Audit App Store Presence',
                'cta_url' => '/contact',
                'overview' => 'App Store Optimization delivers permanent, compounding organic installs without continuous cost-per-install (CPI) ad spend.',
                'what_we_do' => 'We optimize app metadata, keyword visibility, custom product pages, and screenshot conversion rates.',
                'deliverables' => [
                    'iOS App Store & Google Play Keyword Silos',
                    'Custom Product Pages (CPP) & A/B Creative Testing',
                    'App Icon & Screenshot Redesign',
                    'Review Sentiment & Rating Acceleration',
                    'Organic Install Attribution Tracking',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'App Store Crawl', 'description' => 'Analyzing competitor keyword share and ranking gaps.'],
                    ['step' => '02', 'title' => 'Metadata Engineering', 'description' => 'Restructuring titles, subtitles, and keyword fields.'],
                    ['step' => '03', 'title' => 'Visual CRO', 'description' => 'Designing and A/B testing high-converting screenshots.'],
                    ['step' => '04', 'title' => 'Sentiment Loop', 'description' => 'Encouraging positive ratings and remediating low reviews.'],
                ],
                'sort_order' => 6,
                'status' => 'published',
            ],
            [
                'name' => 'Online Reputation Management (ORM)',
                'slug' => 'online-reputation-management',
                'category' => 'Brand Governance',
                'short_description' => 'Protect, repair, and elevate your brand’s executive search presence with proactive SERP suppression and authoritative citation engineering.',
                'pricing_tier' => 'From ₹80,000 / mo',
                'hero_heading' => 'Control Your Brand Narrative On Google',
                'hero_description' => 'Ensure that when high-value prospects, investors, or partners search your name or company, they discover authoritative positive coverage.',
                'hero_media_id' => $mediaContent,
                'cta_label' => 'Request Confidential Audit',
                'cta_url' => '/contact',
                'overview' => 'A single negative page 1 result can cost millions in lost deals. We build impenetrable positive search buffers around your executive and company brand.',
                'what_we_do' => 'We suppress unfair defamatory links, amplify positive PR features, and secure verified knowledge panels.',
                'deliverables' => [
                    'SERP Suppression of Unfair/Negative Results',
                    'Executive Wikipedia & Google Knowledge Panel Strategy',
                    'High-Authority PR Placements & Media Features',
                    'Review Platform Governance (Google, Glassdoor, Trustpilot)',
                    '24/7 Brand Sentiment & Crisis Monitoring',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Reputation Scan', 'description' => 'Mapping search sentiment across Page 1 to Page 5.'],
                    ['step' => '02', 'title' => 'Asset Creation', 'description' => 'Publishing high-authority profiles, interviews, and features.'],
                    ['step' => '03', 'title' => 'SERP Displacement', 'description' => 'Promoting positive owned properties above legacy negative links.'],
                    ['step' => '04', 'title' => 'Ongoing Shield', 'description' => 'Proactive monitoring against algorithmic fluctuations.'],
                ],
                'sort_order' => 7,
                'status' => 'published',
            ],
            [
                'name' => 'Marketing Automation & Retention CRM',
                'slug' => 'marketing-automation',
                'category' => 'Lifecycle Marketing',
                'short_description' => 'Automate high-converting email, WhatsApp, and SMS lifecycle flows that maximize customer lifetime value and eliminate pipeline leakage.',
                'pricing_tier' => 'From ₹60,000 / mo',
                'hero_heading' => 'Automate Compounding Customer Lifetime Value',
                'hero_description' => 'Convert more leads and re-engage inactive customers with automated behavioral triggers across email, WhatsApp, and SMS.',
                'hero_media_id' => $mediaAds,
                'cta_label' => 'Build Automation Pipeline',
                'cta_url' => '/contact',
                'overview' => 'Acquiring customers is only half the battle. Maximizing repeat purchase velocity and pipeline retention determines net profitability.',
                'what_we_do' => 'We build comprehensive Klaviyo, HubSpot, and WhatsApp automation flows that nurture prospects on autopilot.',
                'deliverables' => [
                    'Behavioral Welcome, Cart Abandonment & Browse Nurture',
                    'WhatsApp Business Automation & Inbound Chat Routing',
                    'Customer Segmentation & Predictive Churn Alerts',
                    'CRM Pipeline Hygiene & Sales Handoff Triggers',
                    'LTV & Cohort Retention Analytics',
                ],
                'process_steps' => [
                    ['step' => '01', 'title' => 'Funnel Audit', 'description' => 'Identifying lead leakage and customer drop-off milestones.'],
                    ['step' => '02', 'title' => 'Copy & Design Sprint', 'description' => 'Crafting compelling, high-deliverability lifecycle templates.'],
                    ['step' => '03', 'title' => 'Trigger Integration', 'description' => 'Connecting API webhooks with CRM and marketing automation software.'],
                    ['step' => '04', 'title' => 'Cohort Analysis', 'description' => 'Refining send cadence and multivariate subject testing.'],
                ],
                'sort_order' => 8,
                'status' => 'published',
            ],
        ];

        foreach ($services as $srv) {
            Service::updateOrCreate(
                ['slug' => $srv['slug']],
                $srv
            );
        }
    }
}
