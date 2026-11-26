<?php

use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\EditorController;
use App\Http\Controllers\Admin\LeadExportController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\RedirectController;
use App\Http\Controllers\Admin\SystemOperationsController;
use App\Http\Controllers\Admin\TwoFactorAuthController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\SitemapController;
use App\Http\Controllers\FrontendSsrController;
use App\Http\Middleware\RequireRecentAuthentication;
use Illuminate\Support\Facades\Route;

// XML Sitemap for Search Engines
Route::get('/sitemap.xml', [SitemapController::class, 'xml']);

// Web Authentication Fallback (Redirects browser requests to Filament admin login)
Route::get('/login', fn () => redirect('/admin/login'))->name('login');

// Quick Media Upload & Library List for Post Editor
Route::post('/admin/media/quick-upload', [MediaController::class, 'store'])
    ->middleware(['web', 'auth', 'throttle:60,1'])
    ->name('admin.media.quick-upload');

Route::get('/admin/media/list', [MediaController::class, 'index'])
    ->middleware(['web', 'auth'])
    ->name('admin.media.list');

// Editorial Studio Pro Endpoints (Auto-WebP Image Upload & Live Internal Links Search)
Route::middleware(['web', 'auth', 'throttle:60,1'])->prefix('admin/editor')->name('admin.editor.')->group(function () {
    Route::post('/upload-image', [EditorController::class, 'uploadImage'])->name('upload-image');
    Route::get('/internal-links', [EditorController::class, 'internalLinks'])->name('internal-links');
});

// Phase 1 Layered Admin CMS & Operations REST API (Session + CSRF + Policy Protected)
Route::middleware(['web', 'auth', 'throttle:120,1'])->prefix('admin/api')->name('admin.api.')->group(function () {
    // Posts & Editorial Studio API
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::post('/posts/analyze', [PostController::class, 'analyze'])->name('posts.analyze');
    Route::get('/posts/tags', [PostController::class, 'tagsAutocomplete'])->name('posts.tags.index');
    Route::post('/posts/tags', [PostController::class, 'quickCreateTag'])->name('posts.tags.store');
    Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::match(['put', 'patch'], '/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/posts/{id}/restore', [PostController::class, 'restore'])->name('posts.restore');
    Route::post('/posts/{post}/publish', [PostController::class, 'publish'])->name('posts.publish');
    Route::post('/posts/{post}/schedule', [PostController::class, 'schedule'])->name('posts.schedule');
    Route::match(['post', 'patch'], '/posts/{post}/autosave', [PostController::class, 'autosave'])->name('posts.autosave');
    Route::get('/posts/{post}/revisions', [PostController::class, 'revisions'])->name('posts.revisions.index');
    Route::get('/posts/{post}/revisions/diff', [PostController::class, 'diffRevision'])->name('posts.revisions.diff');
    Route::post('/posts/{post}/revisions/{revisionId}/restore', [PostController::class, 'restoreRevision'])->name('posts.revisions.restore');
    Route::post('/posts/{post}/preview-link', [PostController::class, 'createSignedPreviewUrl'])->name('posts.preview-link');

    // Media Pipeline API
    Route::get('/media', [MediaController::class, 'index'])->name('media.index');
    Route::post('/media', [MediaController::class, 'store'])->name('media.store');

    // Redirects Management API
    Route::get('/redirects', [RedirectController::class, 'index'])->name('redirects.index');
    Route::post('/redirects', [RedirectController::class, 'store'])->name('redirects.store');

    // System Operations API (Cache/Sitemap/Queue)
    Route::post('/operations/purge-cache', [SystemOperationsController::class, 'purgeCache'])->name('operations.purge-cache');
    Route::get('/operations/queue', [SystemOperationsController::class, 'queueStatus'])->name('operations.queue.status');
    Route::post('/operations/queue/retry/{uuidOrAll}', [SystemOperationsController::class, 'retryFailedJob'])->name('operations.queue.retry');
});

// Two-Factor Authentication Routes
Route::middleware(['web', 'auth'])->prefix('admin/two-factor')->name('admin.two-factor.')->group(function () {
    Route::get('/', [TwoFactorAuthController::class, 'challenge'])->name('challenge');
    Route::post('/verify', [TwoFactorAuthController::class, 'verify'])->name('verify');
    Route::get('/setup', [TwoFactorAuthController::class, 'setup'])->name('setup');
    Route::post('/confirm', [TwoFactorAuthController::class, 'confirm'])->name('confirm');
    Route::post('/recovery-codes/confirm', [TwoFactorAuthController::class, 'confirmRecoveryCodes'])->name('confirm-recovery');
    Route::post('/recovery-codes/regenerate', [TwoFactorAuthController::class, 'regenerateRecoveryCodes'])->name('regenerate-recovery');
    Route::post('/revoke-devices', [TwoFactorAuthController::class, 'revokeTrustedDevices'])->name('revoke-devices');
    Route::post('/disable', [TwoFactorAuthController::class, 'disable'])->name('disable');
    Route::get('/reauth', [TwoFactorAuthController::class, 'reauth'])->name('reauth');
    Route::post('/reauth', [TwoFactorAuthController::class, 'verifyReauth'])->name('reauth.verify');
});

// Secure CMS Preview signed endpoints
Route::get('/cms-preview-data/pages/{slug}', [PageController::class, 'preview'])
    ->middleware(['auth', 'signed'])
    ->name('cms.preview.data');

Route::get('/cms-preview-data/blog/{uuid}', [PostController::class, 'signedPreview'])
    ->middleware(['signed'])
    ->name('admin.posts.signed-preview');

// Secure Database Backup Download (Super Administrator Only + Recent Re-Authentication)
Route::get('/admin/system-backups/{id}/download', [BackupController::class, 'download'])
    ->middleware(['web', 'auth', RequireRecentAuthentication::class])
    ->name('admin.system-backups.download');

// Secure Inbound Leads Exports (Audited via AuditLogService)
Route::get('/admin/leads/export-csv', [LeadExportController::class, 'exportCsv'])
    ->middleware(['web', 'auth'])
    ->name('admin.leads.csv');

Route::get('/admin/leads/export-pdf', [LeadExportController::class, 'exportPdf'])
    ->middleware(['web', 'auth'])
    ->name('admin.leads.pdf');

// Primary Frontend Routes (SSR Dynamic Metadata Injection + React SPA)
Route::get('/', [FrontendSsrController::class, 'render'])->name('home');
Route::get('/services/{slug?}', [FrontendSsrController::class, 'render'])->name('services.show');
Route::get('/blog/{slug?}', [FrontendSsrController::class, 'render'])->name('blog.show');
Route::get('/case-studies/{slug?}', [FrontendSsrController::class, 'render'])->name('case-studies.show');
Route::get('/{slug}', [FrontendSsrController::class, 'render'])->where('slug', '^(?!admin|api|livewire|filament|storage|assets|fonts).*$');

// Catch-all Fallback for 404 handling
Route::fallback([FrontendSsrController::class, 'render']);
