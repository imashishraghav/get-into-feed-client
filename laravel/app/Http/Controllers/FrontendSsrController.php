<?php

namespace App\Http\Controllers;

use App\Services\SeoDeliveryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FrontendSsrController extends Controller
{
    protected SeoDeliveryService $seoService;

    public function __construct(SeoDeliveryService $seoService)
    {
        $this->seoService = $seoService;
    }

    /**
     * Handle incoming web request and render SSR metadata.
     */
    public function render(Request $request): Response|RedirectResponse
    {
        return $this->seoService->render($request);
    }
}
