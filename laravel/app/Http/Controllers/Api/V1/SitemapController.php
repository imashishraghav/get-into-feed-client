<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\Service;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function xml(): Response
    {
        $domain = 'https://getintofeed.com';
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
        $blogs = BlogPost::with('seo')->where('status', 'published')->get();
        $pages = Page::with('seo')->where('status', 'published')->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($staticUrls as $u) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$domain}{$u['loc']}</loc>\n";
            $xml .= "    <lastmod>{$today}</lastmod>\n";
            $xml .= "    <changefreq>{$u['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$u['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }

        foreach ($services as $s) {
            if ($s->seo && (! $s->seo->in_sitemap || ! $s->seo->robots_index)) {
                continue;
            }
            $lastmod = $s->updated_at ? $s->updated_at->format('Y-m-d') : $today;
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$domain}/services/{$s->slug}</loc>\n";
            $xml .= "    <lastmod>{$lastmod}</lastmod>\n";
            $xml .= "    <changefreq>monthly</changefreq>\n";
            $xml .= "    <priority>0.90</priority>\n";
            $xml .= "  </url>\n";
        }

        foreach ($caseStudies as $c) {
            if ($c->seo && (! $c->seo->in_sitemap || ! $c->seo->robots_index)) {
                continue;
            }
            $lastmod = $c->updated_at ? $c->updated_at->format('Y-m-d') : $today;
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$domain}/case-studies/{$c->slug}</loc>\n";
            $xml .= "    <lastmod>{$lastmod}</lastmod>\n";
            $xml .= "    <changefreq>monthly</changefreq>\n";
            $xml .= "    <priority>0.80</priority>\n";
            $xml .= "  </url>\n";
        }

        foreach ($blogs as $b) {
            if ($b->seo && (! $b->seo->in_sitemap || ! $b->seo->robots_index)) {
                continue;
            }
            $lastmod = $b->updated_at ? $b->updated_at->format('Y-m-d') : $today;
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$domain}/blog/{$b->slug}</loc>\n";
            $xml .= "    <lastmod>{$lastmod}</lastmod>\n";
            $xml .= "    <changefreq>monthly</changefreq>\n";
            $xml .= "    <priority>0.80</priority>\n";
            $xml .= "  </url>\n";
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
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$domain}{$path}</loc>\n";
            $xml .= "    <lastmod>{$lastmod}</lastmod>\n";
            $xml .= "    <changefreq>monthly</changefreq>\n";
            $xml .= "    <priority>0.70</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>'."\n";

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=utf-8']);
    }
}
