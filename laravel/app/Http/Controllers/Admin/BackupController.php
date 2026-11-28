<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemBackup;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupController extends Controller
{
    public function __construct(private readonly AuditLogService $audit) {}

    public function download(Request $request, int $id): BinaryFileResponse
    {
        $user = $request->user();
        if (! $user || ! $user->isSuperAdmin()) {
            abort(403, 'Unauthorized. Super Administrator access required.');
        }

        $backup = SystemBackup::findOrFail($id);
        if (! file_exists($backup->file_path)) {
            abort(404, 'Backup file missing on disk.');
        }

        $this->audit->record('BACKUP_DOWNLOADED', $backup, null, [
            'filename' => $backup->filename,
            'size' => $backup->file_size_bytes,
        ], $user);

        return response()->download($backup->file_path, $backup->filename);
    }
}
