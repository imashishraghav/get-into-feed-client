<?php

use App\Http\Controllers\Admin\TwoFactorAuthController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\SitemapController;
use App\Http\Controllers\FrontendSsrController;
use App\Models\AuditLog;
use App\Models\Lead;
use App\Models\Media;
use App\Models\SystemBackup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

// XML Sitemap for Search Engines
Route::get('/sitemap.xml', [SitemapController::class, 'xml']);

// Web Authentication Fallback (Redirects browser requests to Filament admin login)
Route::get('/login', fn () => redirect('/admin/login'))->name('login');

// System View Cache Purge & OPcache Reset Endpoint
Route::get('/api/v1/system/purge-views-cache', function () {
    $viewCacheDir = storage_path('framework/views');
    $clearedViews = 0;
    if (is_dir($viewCacheDir)) {
        foreach (glob($viewCacheDir.'/*.php') as $f) {
            @unlink($f);
            $clearedViews++;
        }
    }
    $opcacheReset = function_exists('opcache_reset') ? @opcache_reset() : false;

    return response()->json([
        'success' => true,
        'base_path' => base_path(),
        'views_path' => resource_path('views'),
        'cleared_views' => $clearedViews,
        'opcache_reset' => $opcacheReset,
        'time' => date('Y-m-d H:i:s'),
    ]);
});

// Quick Media Upload for Classic Post Editor (Exact WordPress "Add media" Modal)
Route::post('/admin/media/quick-upload', function (Request $request) {
    $user = auth()->user();
    if (! $user || ! $user->is_active) {
        return response()->json(['success' => false, 'error' => 'Unauthenticated'], 401);
    }

    if (! $user->isSuperAdmin() && ! $user->hasCmsPermission('media.upload') && ! in_array($user->role, ['superadmin', 'admin', 'content_manager', 'editor'])) {
        return response()->json(['success' => false, 'error' => 'Forbidden. Media upload permission required.'], 403);
    }

    $request->validate([
        'file' => 'required|file|max:32768|mimes:jpeg,jpg,png,webp,avif,gif,pdf',
    ]);

    $file = $request->file('file');
    $originalName = $file->getClientOriginalName();
    $cleanBaseName = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
    $extension = strtolower($file->getClientOriginalExtension());
    $sanitizedFileName = $cleanBaseName.'_'.Str::random(8).'.'.$extension;

    $path = $file->storeAs('media', $sanitizedFileName, 'public');
    $mimeType = $file->getMimeType();
    $fileSize = $file->getSize();

    $media = Media::create([
        'file_name' => $sanitizedFileName,
        'file_path' => $path,
        'disk' => 'public',
        'file_size' => $fileSize,
        'mime_type' => $mimeType,
        'alt_text' => ucwords(str_replace(['-', '_'], ' ', $cleanBaseName)),
        'title' => ucwords(str_replace(['-', '_'], ' ', $cleanBaseName)),
        'uploaded_by_user_id' => $user->id,
    ]);

    return response()->json([
        'success' => true,
        'media' => [
            'id' => $media->id,
            'name' => $media->file_name,
            'url' => $media->url,
            'alt' => $media->alt_text ?: $media->file_name,
            'size' => $media->formatted_size,
            'dimensions' => $media->dimensions,
            'created_at' => $media->created_at ? $media->created_at->format('F j, Y') : '',
        ],
    ]);
})->middleware(['web', 'auth'])->name('admin.media.quick-upload');

// Fetch Media List for Classic Post Editor Add Media Modal
Route::get('/admin/media/list', function () {
    $user = auth()->user();
    if (! $user || ! $user->is_active) {
        return response()->json(['success' => false, 'error' => 'Unauthenticated'], 401);
    }

    if (! $user->isSuperAdmin() && ! $user->hasCmsPermission('media.view') && ! in_array($user->role, ['superadmin', 'admin', 'content_manager', 'editor', 'viewer'])) {
        return response()->json(['success' => false, 'error' => 'Forbidden. Media view permission required.'], 403);
    }

    $media = Media::latest()->take(100)->get()->map(function ($m) {
        return [
            'id' => $m->id,
            'name' => $m->file_name,
            'url' => $m->url,
            'alt' => $m->alt_text ?: $m->file_name,
            'size' => $m->formatted_size,
            'dimensions' => $m->dimensions,
            'created_at' => $m->created_at ? $m->created_at->format('F j, Y') : '',
        ];
    });

    return response()->json(['success' => true, 'media' => $media]);
})->middleware(['web', 'auth'])->name('admin.media.list');

// Two-Factor Authentication Routes
Route::middleware(['web', 'auth'])->prefix('admin/two-factor')->name('admin.two-factor.')->group(function () {
    Route::get('/', [TwoFactorAuthController::class, 'challenge'])->name('challenge');
    Route::post('/verify', [TwoFactorAuthController::class, 'verify'])->name('verify');
    Route::get('/setup', [TwoFactorAuthController::class, 'setup'])->name('setup');
    Route::post('/confirm', [TwoFactorAuthController::class, 'confirm'])->name('confirm');
    Route::post('/disable', [TwoFactorAuthController::class, 'disable'])->name('disable');
});

// Secure CMS Preview signed endpoint
Route::get('/cms-preview-data/pages/{slug}', [PageController::class, 'preview'])
    ->middleware(['auth', 'signed'])
    ->name('cms.preview.data');

// Secure Database Backup Download (Super Administrator Only)
Route::get('/admin/system-backups/{id}/download', function ($id) {
    $user = auth()->user();
    if (! $user || ! $user->isSuperAdmin()) {
        abort(403, 'Unauthorized. Super Administrator access required.');
    }
    $backup = SystemBackup::findOrFail($id);
    if (! file_exists($backup->file_path)) {
        abort(404, 'Backup file missing on disk.');
    }
    AuditLog::create([
        'user_id' => $user->id,
        'user_email' => $user->email,
        'action' => 'BACKUP_DOWNLOADED',
        'auditable_type' => SystemBackup::class,
        'auditable_id' => $backup->id,
        'new_values' => ['filename' => $backup->filename, 'size' => $backup->file_size_bytes],
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
    ]);

    return response()->download($backup->file_path, $backup->filename);
})->middleware(['web', 'auth'])->name('admin.system-backups.download');

// Secure Inbound Leads CSV Export (Excel Compatible UTF-8 BOM)
Route::get('/admin/leads/export-csv', function () {
    $user = auth()->user();
    if (! $user || ! $user->is_active) {
        abort(403, 'Unauthorized. Active admin account required.');
    }

    $canExport = $user->isSuperAdmin()
        || $user->hasCmsPermission('leads.manage')
        || in_array($user->role, ['superadmin', 'admin', 'sales_crm']);

    if (! $canExport) {
        abort(403, 'Forbidden. You do not have permission to export CRM leads.');
    }

    $ids = request()->query('ids');
    $query = Lead::query();
    if (! empty($ids)) {
        $idArray = is_array($ids) ? $ids : explode(',', $ids);
        $query->whereIn('id', $idArray);
    }
    $leads = $query->orderBy('created_at', 'desc')->get();

    AuditLog::create([
        'user_id' => $user->id,
        'user_email' => $user->email,
        'action' => 'LEADS_EXPORTED',
        'auditable_type' => Lead::class,
        'auditable_id' => null,
        'new_values' => [
            'format' => 'CSV',
            'count' => $leads->count(),
            'ids_filtered' => ! empty($ids),
        ],
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
    ]);

    return response()->streamDownload(function () use ($leads) {
        $handle = fopen('php://output', 'w');
        // UTF-8 BOM for seamless Microsoft Excel rendering
        fwrite($handle, "\xEF\xBB\xBF");
        fputcsv($handle, [
            'ID',
            'Lead Code',
            'Contact Name',
            'Email Address',
            'Phone',
            'WhatsApp',
            'Company / Brand',
            'Website',
            'Interested Service',
            'Budget Range',
            'Status',
            'Priority',
            'Origin Page',
            'Form Identifier',
            'Marketing Source',
            'Referrer',
            'IP Address',
            'Client Message',
            'Submitted At',
        ]);

        foreach ($leads as $lead) {
            fputcsv($handle, [
                $lead->id,
                $lead->lead_code,
                $lead->name,
                $lead->email,
                $lead->phone,
                $lead->whatsapp,
                $lead->company,
                $lead->website,
                $lead->interested_service,
                $lead->budget,
                $lead->status,
                $lead->priority,
                $lead->page_url,
                $lead->form_type,
                $lead->source,
                $lead->referrer,
                $lead->ip_address,
                $lead->message,
                $lead->created_at ? $lead->created_at->format('Y-m-d H:i:s') : '',
            ]);
        }

        fclose($handle);
    }, 'getintofeed-leads-'.date('Y-m-d-His').'.csv', [
        'Content-Type' => 'text/csv; charset=UTF-8',
        'Content-Disposition' => 'attachment; filename="getintofeed-leads-'.date('Y-m-d-His').'.csv"',
    ]);
})->middleware(['web', 'auth'])->name('admin.leads.csv');

// Secure Inbound Leads High-Resolution Printable PDF Report
Route::get('/admin/leads/export-pdf', function () {
    $user = auth()->user();
    if (! $user || ! $user->is_active) {
        abort(403, 'Unauthorized. Active admin account required.');
    }

    $canExport = $user->isSuperAdmin()
        || $user->hasCmsPermission('leads.manage')
        || in_array($user->role, ['superadmin', 'admin', 'sales_crm']);

    if (! $canExport) {
        abort(403, 'Forbidden. You do not have permission to export CRM leads.');
    }

    $ids = request()->query('ids');
    $query = Lead::query();
    if (! empty($ids)) {
        $idArray = is_array($ids) ? $ids : explode(',', $ids);
        $query->whereIn('id', $idArray);
    }
    $leads = $query->orderBy('created_at', 'desc')->get();

    AuditLog::create([
        'user_id' => $user->id,
        'user_email' => $user->email,
        'action' => 'LEADS_EXPORTED',
        'auditable_type' => Lead::class,
        'auditable_id' => null,
        'new_values' => [
            'format' => 'PDF',
            'count' => $leads->count(),
            'ids_filtered' => ! empty($ids),
        ],
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
    ]);

    return view('admin.leads-pdf', compact('leads'));
})->middleware(['web', 'auth'])->name('admin.leads.pdf');

// Primary Frontend Routes (SSR Dynamic Metadata Injection + React SPA)
Route::get('/', [FrontendSsrController::class, 'render'])->name('home');
Route::get('/services/{slug?}', [FrontendSsrController::class, 'render'])->name('services.show');
Route::get('/blog/{slug?}', [FrontendSsrController::class, 'render'])->name('blog.show');
Route::get('/case-studies/{slug?}', [FrontendSsrController::class, 'render'])->name('case-studies.show');
Route::get('/{slug}', [FrontendSsrController::class, 'render'])->where('slug', '^(?!admin|api|livewire|filament|storage|assets|fonts).*$');

// Catch-all Fallback for 404 handling
Route::fallback([FrontendSsrController::class, 'render']);
