<?php

namespace App\Listeners;

use App\Events\PostPublished;
use App\Services\SitemapService;
use Illuminate\Support\Facades\Cache;

class InvalidatePostCachesAndSitemap
{
    public function __construct(private readonly SitemapService $sitemapService) {}

    public function handle(PostPublished $event): void
    {
        Cache::forget('api_blog_public_list');
        Cache::forget('api_v1_bootstrap_data');
        Cache::forget('api_bootstrap_payload');
        Cache::forget("blog_post_slug:{$event->post->slug}");

        $this->sitemapService->regenerate();
    }
}
