<?php
/**
 * GetIntoFeed — Agent-Ready Router & Content Negotiation Handler
 * 
 * Features:
 * 1. RFC 8288 Link header injection pointing to /llms.txt and /.well-known/mcp/server-card.json
 * 2. Content-Signal response header: search=yes, ai-train=no
 * 3. Content negotiation: Serves Markdown (text/markdown) when requested via Accept header or ?format=md
 * 4. Real HTTP 404 status code enforcement for missing/non-existent URLs
 * 5. Serves pre-rendered semantic HTML shell to non-JS crawlers & AI bots
 * 6. Filament Admin CMS & Laravel 12 Backend Bridge delegation
 */

// Disable PHP output compression interference
if (function_exists('ini_set')) {
    ini_set('zlib.output_compression', 'Off');
}

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);
$path = '/' . trim((string)$path, '/');
if ($path === '//') $path = '/';
$normalizedPath = strtolower($path);

// ── 1. Filament Admin & Laravel 12 Backend Delegation ──
if (
    ($_SERVER['HTTP_HOST'] ?? '') === 'crm.getintofeed.com' ||
    $normalizedPath === '/admin' ||
    strpos($normalizedPath, '/admin/') === 0 ||
    $normalizedPath === '/crm' ||
    strpos($normalizedPath, '/crm/') === 0 ||
    $normalizedPath === '/api' ||
    strpos($normalizedPath, '/api/') === 0 ||
    $normalizedPath === '/livewire' ||
    strpos($normalizedPath, '/livewire/') === 0 ||
    $normalizedPath === '/filament' ||
    strpos($normalizedPath, '/filament/') === 0 ||
    $normalizedPath === '/laravel_bridge.php'
) {
    $bridgePath = file_exists(__DIR__ . '/laravel_bridge.php')
        ? __DIR__ . '/laravel_bridge.php'
        : (file_exists(__DIR__ . '/public_html/laravel_bridge.php')
            ? __DIR__ . '/public_html/laravel_bridge.php'
            : (file_exists(__DIR__ . '/../laravel_bridge.php') ? __DIR__ . '/../laravel_bridge.php' : false));

    if ($bridgePath) {
        require $bridgePath;
        exit;
    }
}

// Global Agent-Ready & Security Headers
header('Content-Signal: search=yes, ai-train=no');
header('Link: </llms.txt>; rel="alternate"; type="text/markdown", </.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
header('Access-Control-Allow-Headers: Accept, Content-Type, Authorization, User-Agent');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Check if client requests Markdown
$acceptHeader = strtolower($_SERVER['HTTP_ACCEPT'] ?? '');
$formatQuery = strtolower($_GET['format'] ?? '');
$wantsMarkdown = (
    strpos($acceptHeader, 'text/markdown') !== false ||
    strpos($acceptHeader, 'text/x-markdown') !== false ||
    $formatQuery === 'md' ||
    $formatQuery === 'markdown'
);

// Canonical Active Services & Aliases
$validServiceSlugs = [
    'google-ads-services-delhi-ncr',
    'meta-ads-services-delhi-ncr',
    'seo-services-delhi-ncr',
    'social-media-marketing-delhi-ncr',
    'website-design-delhi-ncr',
    'content-creative-services-delhi-ncr',
    'reels-video-editing-delhi-ncr',
    'graphic-design-services-delhi-ncr',
    'performance-marketing-delhi-ncr',
    'short-form-video-reels-delhi-ncr',
    'web-development-delhi-ncr',
    'brand-strategy-delhi-ncr',
    'influencer-marketing-delhi-ncr',
    'analytics-reporting-delhi-ncr',
    'google-ads',
    'meta-ads',
    'seo',
    'social-media',
    'website-design',
    'web-development',
    'content-marketing',
    'reels',
    'graphic-design'
];

// Valid Static Hubs & Static Pages
$validHubs = [
    '/',
    '/services',
    '/case-studies',
    '/work',
    '/about',
    '/pricing',
    '/blog',
    '/feed-notes',
    '/insights',
    '/contact',
    '/privacy',
    '/terms',
    '/cookie-policy',
    '/cookies',
    '/refund',
    '/refund-policy',
    '/disclaimer',
    '/nda',
    '/reviews',
    '/clients',
    '/testimonials',
    '/audit',
    '/careers',
    '/faqs',
    '/faq',
    '/awards',
    '/llms.txt',
    '/llms-full.txt'
];

// Valid Blog Slugs & Aliases
$validBlogSlugs = [
    'meta-advantage-plus-ecommerce-scaling',
    'how-metas-advantage-plus-changes-ecommerce',
    'how-metas-advantage-plus-algorithm-changes-ecommerce-scaling-in-2026',
    'advantage-plus',
    'meta-advantage-plus',
    'tiktok-reels-hook-frameworks',
    'tiktok-hook-frameworks',
    '5-high-converting-hook-frameworks-for-tiktok-ads',
    'landing-page-ux-convert-10-percent',
    'designing-landing-pages-that-convert-at-10-percent',
    'designing-landing-pages-that-convert',
    'retargeting-funnel-leaks-fix',
    'why-your-retargeting-funnel-is-leaking-money',
    'programmatic-seo-b2b-saas',
    'generative-search-optimization',
    'organic-content-vs-paid-media'
];

// Valid Case Study Slugs (Substantiated in database & client archives)
$validCaseStudySlugs = [
    'urbanthreads-co',
    'skyline-residences',
    'datasync-analytics',
    'vitahealth-app',
    'luxeliving-realty',
    'glowup-skincare',
    'apex-fintech'
];

// Canonical Aliases & Redirections (301 Permanent)
$canonicalRedirects = [
    '/legal' => '/privacy',
    '/sitemap' => '/sitemap.xml',
    '/work' => '/case-studies',
    '/feed-notes' => '/blog',
    '/insights' => '/blog',
    '/services/ads-campaign' => '/services/google-ads-services-delhi-ncr',
    '/services/graphics-design' => '/services/graphic-design-services-delhi-ncr',
    '/services/videos' => '/services/reels-video-editing-delhi-ncr',
    '/services/performance-marketing' => '/services/google-ads-services-delhi-ncr',
    '/services/performance-marketing-delhi-ncr' => '/services/google-ads-services-delhi-ncr',
    '/services/short-form-video-reels-delhi-ncr' => '/services/reels-video-editing-delhi-ncr',
    '/services/google-ads' => '/services/google-ads-services-delhi-ncr',
    '/services/meta-ads' => '/services/meta-ads-services-delhi-ncr',
    '/services/seo' => '/services/seo-services-delhi-ncr',
    '/services/social-media' => '/services/social-media-marketing-delhi-ncr',
    '/services/web-development' => '/services/website-design-delhi-ncr',
    '/services/web-development-delhi-ncr' => '/services/website-design-delhi-ncr',
    '/services/website-design' => '/services/website-design-delhi-ncr',
    '/services/reels' => '/services/reels-video-editing-delhi-ncr',
    '/services/content-marketing' => '/services/content-creative-services-delhi-ncr',
    '/services/graphic-design' => '/services/graphic-design-services-delhi-ncr',
];

if (isset($canonicalRedirects[$normalizedPath])) {
    header('Location: ' . $canonicalRedirects[$normalizedPath], true, 301);
    exit;
}

// Validate if requested route exists (Strict Whitelisting — Eliminates Soft-404 Risk)
$isRouteValid = false;

if (in_array($normalizedPath, $validHubs, true)) {
    $isRouteValid = true;
} elseif (preg_match('#^/services/([^/]+)$#', $normalizedPath, $matches)) {
    $slug = $matches[1];
    if (in_array($slug, $validServiceSlugs, true)) {
        $isRouteValid = true;
    }
} elseif (preg_match('#^/(case-studies|work)/([^/]+)$#', $normalizedPath, $matches)) {
    $slug = $matches[2];
    if (in_array($slug, $validCaseStudySlugs, true)) {
        $isRouteValid = true;
    }
} elseif (preg_match('#^/(blog|feed-notes|insights)/([^/]+)$#', $normalizedPath, $matches)) {
    $slug = $matches[2];
    if (in_array($slug, $validBlogSlugs, true)) {
        $isRouteValid = true;
    }
} elseif (preg_match('#^/([^/]+)$#', $normalizedPath, $matches) && in_array($matches[1], $validBlogSlugs, true)) {
    $isRouteValid = true;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO 1: MISSING / NON-EXISTENT ROUTE -> REAL HTTP 404
// ─────────────────────────────────────────────────────────────────────────────
if (!$isRouteValid) {
    http_response_code(404);
    header('X-Robots-Tag: noindex, nofollow');

    if ($wantsMarkdown) {
        header('Content-Type: text/markdown; charset=UTF-8');
        echo "# 404 Not Found\n\n";
        echo "The requested resource `{$path}` does not exist on GetIntoFeed.\n\n";
        echo "## Directory of Available Resources:\n";
        echo "- [Homepage](https://getintofeed.com/)\n";
        echo "- [Services Hub](https://getintofeed.com/services)\n";
        echo "- [Selected Case Studies](https://getintofeed.com/case-studies)\n";
        echo "- [Pricing & Sprint Packages](https://getintofeed.com/pricing)\n";
        echo "- [About Us](https://getintofeed.com/about)\n";
        echo "- [Contact & Consultation](https://getintofeed.com/contact)\n";
        echo "- [LLM Machine-Readable Summary](https://getintofeed.com/llms.txt)\n";
        echo "- [MCP Server Card](https://getintofeed.com/.well-known/mcp/server-card.json)\n";
        exit;
    }

    header('Content-Type: text/html; charset=UTF-8');
    $notFoundFile = __DIR__ . '/404.html';
    if (file_exists($notFoundFile)) {
        readfile($notFoundFile);
    } else {
        readfile(__DIR__ . '/index.html');
    }
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO 2: VALID ROUTE WITH ACCEPT: text/markdown OR ?format=md
// ─────────────────────────────────────────────────────────────────────────────
if ($wantsMarkdown) {
    http_response_code(200);
    header('Content-Type: text/markdown; charset=UTF-8');

    // Route-specific Markdown delivery
    if ($normalizedPath === '/' || $normalizedPath === '/llms.txt') {
        $llmsFile = __DIR__ . '/llms.txt';
        if (file_exists($llmsFile)) {
            readfile($llmsFile);
            exit;
        }
    }

    if ($normalizedPath === '/llms-full.txt') {
        $llmsFullFile = __DIR__ . '/llms-full.txt';
        if (file_exists($llmsFullFile)) {
            readfile($llmsFullFile);
            exit;
        }
    }

    if ($normalizedPath === '/services') {
        echo "# GetIntoFeed — Core Growth & Performance Services\n\n";
        echo "Explore our 8 core growth disciplines engineered for ambitious brands:\n\n";
        echo "1. **[Performance Marketing & Paid Ads](https://getintofeed.com/services/performance-marketing-delhi-ncr)**: Meta & Google Ads algorithmic scaling, CAPI attribution.\n";
        echo "2. **[Short-Form Video & Reels](https://getintofeed.com/services/short-form-video-reels-delhi-ncr)**: Viral TikTok, Reels, and Shorts production.\n";
        echo "3. **[SEO & Organic Search](https://getintofeed.com/services/seo-services-delhi-ncr)**: Technical SEO, programmatic architecture, and GEO.\n";
        echo "4. **[Web Development & Custom Engineering](https://getintofeed.com/services/web-development-delhi-ncr)**: High-converting React SPA and Laravel API platforms.\n";
        echo "5. **[Brand Strategy & Positioning](https://getintofeed.com/services/brand-strategy-delhi-ncr)**: Identity, category design, and messaging architecture.\n";
        echo "6. **[Social Media Marketing](https://getintofeed.com/services/social-media-marketing-delhi-ncr)**: Full-spectrum organic brand management.\n";
        echo "7. **[Influencer Marketing & Creator Seeding](https://getintofeed.com/services/influencer-marketing-delhi-ncr)**: Tier-1 and Tier-2 Indian creator activations.\n";
        echo "8. **[Analytics & Growth Reporting](https://getintofeed.com/services/analytics-reporting-delhi-ncr)**: GA4, GTM, and custom Looker dashboards.\n\n";
        echo "For customized growth sprints, visit [Contact](https://getintofeed.com/contact) or WhatsApp +91-8810356950.\n";
        exit;
    }

    if (strpos($normalizedPath, '/services/') === 0) {
        $slug = str_replace('/services/', '', $normalizedPath);
        $cleanTitle = ucwords(str_replace('-', ' ', str_replace(['-services-delhi-ncr', '-delhi-ncr'], '', $slug)));
        echo "# {$cleanTitle} Services in Delhi NCR | GetIntoFeed\n\n";
        echo "> Premier growth service provided by GetIntoFeed studio.\n\n";
        echo "## Key Deliverables\n";
        echo "- Strategic campaign audit and competitor gap analysis\n";
        echo "- Hands-on sprint execution with verified weekly reporting\n";
        echo "- Dedicated growth strategist and senior creative team\n";
        echo "- Rigorous conversion tracking attribution & data-driven optimization\n\n";
        echo "## Book This Sprint\n";
        echo "- **WhatsApp / Direct Line**: +91-8810356950\n";
        echo "- **Email**: hello@getintofeed.com\n";
        echo "- **Inquiry Form**: https://getintofeed.com/contact\n";
        exit;
    }

    if ($normalizedPath === '/pricing') {
        echo "# GetIntoFeed — Transparent Growth Pricing\n\n";
        echo "Zero hidden agency retainers. Flexible engagements:\n\n";
        echo "### Entry Tier: Starter Single-Discipline Support\n";
        echo "- **Price**: Starting from ₹10,500 onwards*\n";
        echo "- **Focus**: Single campaign setup, audit, local SEO, or focused design pack.\n\n";
        echo "### Tier 1: Performance Marketing Sprint\n";
        echo "- **Price**: Starting from ₹24,999/month*\n";
        echo "- **Target**: 3.5x - 5x Blended ROAS\n";
        echo "- **Includes**: Meta/Google ads setup, 10 custom creatives, CAPI attribution.\n\n";
        echo "### Tier 2: Creative Content & Reels Sprint\n";
        echo "- **Price**: Starting from ₹29,999/month*\n";
        echo "- **Deliverables**: 12 high-retention short-form video reels, scripting, and sound design.\n\n";
        echo "### Tier 3: Full-Funnel Growth Retainer\n";
        echo "- **Price**: Starting from ₹49,999/month*\n";
        echo "- **Includes**: Blended paid media, content engine, CRO funnels, dedicated team.\n\n";
        echo "Inquire at https://getintofeed.com/contact\n";
        exit;
    }

    if ($normalizedPath === '/about') {
        echo "# About GetIntoFeed — Creative Growth Studio\n\n";
        echo "Founded in 2023 in New Delhi, GetIntoFeed is a performance marketing and creative engineering studio.\n\n";
        echo "- **Founder**: Ashish Raghav\n";
        echo "- **Headquarters**: New Delhi, Delhi, India — 110001\n";
        echo "- **Phone**: +91-8810356950\n";
        echo "- **Email**: hello@getintofeed.com\n";
        echo "- **Track Record (Verified Client Milestones)**: 28,400+ funded retail accounts acquired (Apex Wealth FinTech case study), +380% qualified inbound HNI pipeline (LuxeLiving Realty case study), up to 4.8x blended ROAS at scale (GlowUp Skincare case study).\n";
        exit;
    }

    if ($normalizedPath === '/contact') {
        echo "# Contact GetIntoFeed\n\n";
        echo "- **Phone / WhatsApp**: +91-8810356950\n";
        echo "- **Email**: hello@getintofeed.com\n";
        echo "- **Headquarters**: New Delhi, Delhi, India — 110001\n";
        echo "- **Hours**: Monday to Friday, 09:00 - 19:00 IST\n";
        echo "- **Consultation**: https://getintofeed.com/contact\n";
        exit;
    }

    // Default Markdown fallback
    $llmsFile = __DIR__ . '/llms.txt';
    if (file_exists($llmsFile)) {
        readfile($llmsFile);
    } else {
        echo "# GetIntoFeed\n\nPerformance Marketing & Web Engineering Studio.\nVisit https://getintofeed.com/";
    }
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO 3: VALID ROUTE RETURNING HTML (LARAVEL SSR & METADATA ENGINE)
// ─────────────────────────────────────────────────────────────────────────────
$bridgePath = file_exists(__DIR__ . '/laravel_bridge.php')
    ? __DIR__ . '/laravel_bridge.php'
    : (file_exists(__DIR__ . '/public_html/laravel_bridge.php')
        ? __DIR__ . '/public_html/laravel_bridge.php'
        : (file_exists(__DIR__ . '/../laravel_bridge.php') ? __DIR__ . '/../laravel_bridge.php' : false));

if ($bridgePath) {
    require $bridgePath;
    exit;
}

http_response_code(200);
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

readfile(__DIR__ . '/index.html');
exit;
