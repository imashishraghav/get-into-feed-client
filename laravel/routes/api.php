<?php

use App\Http\Controllers\Api\V1\AuditController;
use App\Http\Controllers\Api\V1\AwardController;
use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\BootstrapController;
use App\Http\Controllers\Api\V1\CaseStudyController;
use App\Http\Controllers\Api\V1\CrmIngestController;
use App\Http\Controllers\Api\V1\CrmWebhookController;
use App\Http\Controllers\Api\V1\FaqController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\LeadController;
use App\Http\Controllers\Api\V1\McpController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\SitemapController;
use App\Http\Controllers\Api\V1\SubscriberController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\TestimonialController;
use Illuminate\Support\Facades\Route;

// ── V1 CANONICAL REST API ──────────────────────────────────────────
Route::prefix('v1')->group(function () {
    Route::get('/bootstrap', [BootstrapController::class, 'index']);
    Route::get('/bootstrap', [BootstrapController::class, 'index']);
    Route::get('/health', [HealthController::class, 'index']);
    Route::get('/pages/{slug}', [PageController::class, 'show']);

    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{slug}', [ServiceController::class, 'show']);

    Route::get('/case-studies', [CaseStudyController::class, 'index']);
    Route::get('/case-studies/{slug}', [CaseStudyController::class, 'show']);
    Route::get('/projects', [CaseStudyController::class, 'index']);
    Route::get('/projects/{slug}', [CaseStudyController::class, 'show']);

    Route::get('/blog', [BlogController::class, 'index']);
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blog/{slug}', [BlogController::class, 'show']);
    Route::get('/blog/{slug}/engagement', [BlogController::class, 'engagement']);
    Route::post('/blog/{slug}/likes', [BlogController::class, 'like'])->middleware('throttle:30,1');
    Route::post('/blog/{slug}/comments', [BlogController::class, 'comment'])->middleware('throttle:10,1');

    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/team', [TeamController::class, 'index']);
    Route::get('/awards', [AwardController::class, 'index']);
    Route::get('/faqs', [FaqController::class, 'index']);

    Route::get('/settings/public', [SettingsController::class, 'publicSettings']);
    Route::get('/settings', [SettingsController::class, 'publicSettings']);
    Route::get('/section-templates', [SettingsController::class, 'sectionTemplates']);
    Route::get('/sitemap.xml', [SitemapController::class, 'xml']);

    Route::post('/leads', [LeadController::class, 'store'])->middleware('throttle:10,1');
    Route::post('/enquiries', [LeadController::class, 'store'])->middleware('throttle:10,1');
    Route::post('/audit', [AuditController::class, 'submitAudit'])->middleware('throttle:5,1');
    Route::post('/newsletter/subscribe', [SubscriberController::class, 'subscribe'])->middleware('throttle:5,1');
    Route::post('/subscribers', [SubscriberController::class, 'subscribe'])->middleware('throttle:5,1');

    // ── EXTERNAL CRM WEBHOOK INBOUND CALLBACK ───────────────────────────
    Route::post('/webhooks/crm-status', [CrmWebhookController::class, 'handleStatusUpdate'])->middleware('throttle:30,1');

    // ── HARDENED WEBSITE LEAD INGESTION BRIDGE (Removed in Phase 3 when feedos-api is live) ──
    Route::prefix('crm')->group(function () {
        Route::post('/ingest', [CrmIngestController::class, 'store'])
            ->middleware('throttle:10,1');
    });

    // Model Context Protocol (MCP) Streamable HTTP & JSON-RPC Endpoints (Throttled & Protected)
    Route::middleware('throttle:60,1')->group(function () {
        Route::match(['get', 'post'], '/mcp', [McpController::class, 'index']);
        Route::get('/mcp/health', [McpController::class, 'health']);
        Route::get('/mcp/tools', [McpController::class, 'tools']);
        Route::get('/mcp/resources', [McpController::class, 'resources']);
        Route::get('/mcp/sse', [McpController::class, 'sse']);
        Route::post('/mcp/tools/{toolName}', [McpController::class, 'executeDirect']);
    });
});

// ── BACKWARD-COMPATIBILITY ALIASES (FOR EXISTING REACT FRONTEND & ROOT MCP) ──
// MCP Direct Aliases (Exposes /api/mcp with rate-limiting throttle)
Route::middleware('throttle:60,1')->group(function () {
    Route::match(['get', 'post'], '/mcp', [McpController::class, 'index']);
    Route::get('/mcp/health', [McpController::class, 'health']);
    Route::get('/mcp/tools', [McpController::class, 'tools']);
    Route::get('/mcp/resources', [McpController::class, 'resources']);
    Route::get('/mcp/sse', [McpController::class, 'sse']);
    Route::post('/mcp/tools/{toolName}', [McpController::class, 'executeDirect']);
});
Route::get('/bootstrap', [BootstrapController::class, 'index']);
Route::get('/health', [HealthController::class, 'index']);
Route::get('/pages/{slug}', [PageController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);

Route::get('/projects', [CaseStudyController::class, 'index']);
Route::get('/projects/{slug}', [CaseStudyController::class, 'show']);
Route::get('/case-studies', [CaseStudyController::class, 'index']);
Route::get('/case-studies/{slug}', [CaseStudyController::class, 'show']);

Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/{slug}', [BlogController::class, 'show']);
Route::get('/blog/{slug}/engagement', [BlogController::class, 'engagement']);
Route::post('/blog/{slug}/likes', [BlogController::class, 'like'])->middleware('throttle:30,1');
Route::post('/blog/{slug}/comments', [BlogController::class, 'comment'])->middleware('throttle:10,1');

Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/team', [TeamController::class, 'index']);
Route::get('/awards', [AwardController::class, 'index']);
Route::get('/faqs', [FaqController::class, 'index']);

Route::get('/settings/public', [SettingsController::class, 'publicSettings']);
Route::get('/settings', [SettingsController::class, 'publicSettings']);
Route::get('/section-templates', [SettingsController::class, 'sectionTemplates']);
Route::get('/sitemap.xml', [SitemapController::class, 'xml']);

Route::post('/leads', [LeadController::class, 'store'])->middleware('throttle:10,1');
Route::post('/enquiries', [LeadController::class, 'store'])->middleware('throttle:10,1');
Route::post('/audit', [AuditController::class, 'submitAudit'])->middleware('throttle:5,1');
Route::post('/newsletter/subscribe', [SubscriberController::class, 'subscribe'])->middleware('throttle:5,1');
Route::post('/subscribe', [SubscriberController::class, 'subscribe'])->middleware('throttle:5,1');
Route::post('/subscribers', [SubscriberController::class, 'subscribe'])->middleware('throttle:5,1');
