<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SitemapService;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __construct(private readonly SitemapService $sitemap) {}

    public function xml(): Response
    {
        return response($this->sitemap->getXml(), 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }
}
