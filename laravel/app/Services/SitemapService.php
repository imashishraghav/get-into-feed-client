<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Service;
use Illuminate\Support\Facades\Cache;

class SitemapService
{
    public const CACHE_KEY = 'cms:sitemap_xml';

    public function getXml(): string
    {
        return Cache::remember(self::CACHE_KEY, 1800, fn () => $this->generateXml());
    }

    public function regenerate(): string
    {
        Cache::forget(self::CACHE_KEY);
        $xml = $this->generateXml();
        Cache::put(self::CACHE_KEY, $xml, 1800);

        return $xml;
    }

    public function invalidate(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    public function generateXml(): string
    {
        $domain = rtrim(config('app.url') ?: 'https://getintofeed.com', '/');
        if (str_contains($domain, 'localhost') || str_contains($domain, '127.0.0.1')) {
            $domain = 'https://getintofeed.com';
        }
        $today = now()->format('Y-m-d');

        $staticUrls = [
            ['loc' => '/', 'priority' => '1.00', 'changefreq' => 'weekly'],
            ['loc' => '/services', 'priority' => '0.90', 'changefreq' => 'weekly'],
            ['loc' => '/case-studies', 'priority' => '0.90', 'changefreq' => 'weekly'],
            ['loc' => '/blog', 'priority' => '0.90', 'changefreq' => 'daily'],
            ['loc' => '/about', 'priority' => '0.85', 'changefreq' => 'monthly'],
            ['loc' => '/contact', 'priority' => '0.90', 'changefreq' => 'monthly'],
            ['loc' => '/pricing', 'priority' => '0.85', 'changefreq' => 'monthly'],
            ['loc' => '/privacy', 'priority' => '0.40', 'changefreq' => 'yearly'],
            ['loc' => '/terms', 'priority' => '0.40', 'changefreq' => 'yearly'],
            ['loc' => '/refund-policy', 'priority' => '0.40', 'changefreq' => 'yearly'],
            ['loc' => '/cookie-policy', 'priority' => '0.40', 'changefreq' => 'yearly'],
            ['loc' => '/disclaimer', 'priority' => '0.40', 'changefreq' => 'yearly'],
            ['loc' => '/nda', 'priority' => '0.40', 'changefreq' => 'yearly'],
        ];

        $services = Service::with('seo')->where('status', 'published')->get();
        $caseStudies = CaseStudy::with('seo')->where('status', 'published')->get();
        $blogs = BlogPost::with('seo')->publiclyListed()->get();
        $pages = Page::with('seo')->where('status', 'published')->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($staticUrls as $u) {
            $xml .= $this->renderUrlNode("{$domain}{$u['loc']}", $today, $u['changefreq'], $u['priority']);
        }

        foreach ($services as $s) {
            if ($s->seo && (! $s->seo->in_sitemap || ! $s->seo->robots_index)) {
                continue;
            }
            $lastmod = $s->updated_at ? $s->updated_at->format('Y-m-d') : $today;
            $xml .= $this->renderUrlNode("{$domain}/services/{$s->slug}", $lastmod, 'monthly', '0.90');
        }

        foreach ($caseStudies as $c) {
            if ($c->seo && (! $c->seo->in_sitemap || ! $c->seo->robots_index)) {
                continue;
            }
            $lastmod = $c->updated_at ? $c->updated_at->format('Y-m-d') : $today;
            $xml .= $this->renderUrlNode("{$domain}/case-studies/{$c->slug}", $lastmod, 'monthly', '0.80');
        }

        foreach ($blogs as $b) {
            $robotsIndex = $b->robots_index !== null ? (bool) $b->robots_index : ($b->seo?->robots_index ?? true);
            $inSitemap = $b->seo?->in_sitemap ?? true;
            if (! $robotsIndex || ! $inSitemap) {
                continue;
            }
            $lastmod = $b->updated_at ? $b->updated_at->format('Y-m-d') : $today;
            $xml .= $this->renderUrlNode("{$domain}/blog/{$b->slug}", $lastmod, 'monthly', '0.80');
        }

        $staticPaths = collect($staticUrls)->pluck('loc')->all();
        foreach ($pages as $page) {
            $path = '/'.$page->slug;
            if ($page->slug === 'home' || in_array($path, $staticPaths, true)) {
                continue;
            }
            if ($page->seo && (! $page->seo->in_sitemap || ! $page->seo->robots_index)) {
                continue;
            }
            $lastmod = $page->updated_at ? $page->updated_at->format('Y-m-d') : $today;
            $xml .= $this->renderUrlNode("{$domain}{$path}", $lastmod, 'monthly', '0.70');
        }

        $xml .= '</urlset>'."\n";

        return $xml;
    }

    private function renderUrlNode(string $loc, string $lastmod, string $changefreq, string $priority): string
    {
        return "  <url>\n"
            .'    <loc>'.e($loc)."</loc>\n"
            ."    <lastmod>{$lastmod}</lastmod>\n"
            ."    <changefreq>{$changefreq}</changefreq>\n"
            ."    <priority>{$priority}</priority>\n"
            ."  </url>\n";
    }
}
