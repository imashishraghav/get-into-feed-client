<?php

namespace App\Filament\Pages;

use App\Models\AuditLog;
use App\Models\SystemBackup;
use App\Services\BackupService;
use App\Services\SystemHealthService;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class SystemHealth extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-shield-check';

    protected static ?string $navigationGroup = 'Settings & Operations';

    protected static ?string $navigationLabel = 'System Health';

    protected static ?string $title = 'System Health';

    protected static string $view = 'filament.pages.system-health';

    protected static ?int $navigationSort = 90;

    public string $activeTab = 'health'; // health, backups, activity, logs

    public ?string $auditActionFilter = '';

    public ?string $auditSearch = '';

    public ?int $selectedBackupId = null;

    public string $restoreConfirmInput = '';

    public ?array $stagingInspectionResult = null;

    public bool $showStagingModal = false;

    public bool $showRestoreModal = false;

    public bool $showAuditDetailModal = false;

    public ?array $selectedAuditDetail = null;

    public string $manualBackupNotes = '';

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }

    public function setActiveTab(string $tab): void
    {
        if (in_array($tab, ['health', 'backups', 'activity', 'logs'])) {
            $this->activeTab = $tab;
        }
    }

    public function createManualBackup(BackupService $backupService): void
    {
        try {
            $notes = trim($this->manualBackupNotes) ?: 'Manual backup triggered from System Health console';
            $backup = $backupService->createBackup('manual', $notes, auth()->user());
            $backupService->verifyBackup($backup);

            $this->manualBackupNotes = '';

            Notification::make()
                ->title('Backup Created & Verified')
                ->body("Successfully generated {$backup->filename} ({$backup->formatted_size}). SHA-256 verified.")
                ->success()
                ->send();
        } catch (\Throwable $e) {
            Notification::make()
                ->title('Backup Failed')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function verifyBackup(int $id, BackupService $backupService): void
    {
        $backup = SystemBackup::findOrFail($id);
        try {
            $result = $backupService->verifyBackup($backup);

            if ($result['success']) {
                Notification::make()
                    ->title('Integrity Verified')
                    ->body("File: {$backup->filename} | SHA-256: {$backup->short_sha}... | Integrity: OK | Tables: {$result['tables_count']} | Rows: {$result['rows_count']}")
                    ->success()
                    ->send();
            } else {
                Notification::make()
                    ->title('Integrity Check Failed')
                    ->body($result['error'] ?? 'Checksum or SQLite check failed.')
                    ->danger()
                    ->send();
            }
        } catch (\Throwable $e) {
            Notification::make()
                ->title('Verification Error')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function testStagingRestore(int $id, BackupService $backupService): void
    {
        $backup = SystemBackup::findOrFail($id);
        try {
            $result = $backupService->restoreToStaging($backup);
            $this->stagingInspectionResult = [
                'filename' => $backup->filename,
                'created_at' => $backup->created_at->format('d M Y, h:i A T'),
                'sha256' => $backup->sha256_hash,
                'size' => $backup->formatted_size,
                'counts' => $result['counts'],
                'integrity' => $result['integrity'],
                'fk_violations' => $result['fk_violations'],
            ];
            $this->showStagingModal = true;
        } catch (\Throwable $e) {
            Notification::make()
                ->title('Staging Restore Error')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function closeStagingModal(): void
    {
        $this->showStagingModal = false;
        $this->stagingInspectionResult = null;
    }

    public function openProductionRestoreModal(int $id): void
    {
        $user = auth()->user();
        if (! $user || ! $user->isSuperAdmin()) {
            Notification::make()
                ->title('Permission Denied')
                ->body('Production database recovery is strictly restricted to Super Administrators.')
                ->danger()
                ->send();

            return;
        }

        $this->selectedBackupId = $id;
        $this->restoreConfirmInput = '';
        $this->showRestoreModal = true;
    }

    public function closeProductionRestoreModal(): void
    {
        $this->showRestoreModal = false;
        $this->selectedBackupId = null;
        $this->restoreConfirmInput = '';
    }

    public function executeProductionRestore(BackupService $backupService): void
    {
        $user = auth()->user();
        if (! $user || ! $user->isSuperAdmin()) {
            Notification::make()
                ->title('Permission Denied')
                ->body('Production database recovery is strictly restricted to Super Administrators.')
                ->danger()
                ->send();

            return;
        }

        if (trim($this->restoreConfirmInput) !== 'CONFIRM RESTORE') {
            Notification::make()
                ->title('Confirmation Required')
                ->body('You must type "CONFIRM RESTORE" exactly to proceed.')
                ->warning()
                ->send();

            return;
        }

        $backup = SystemBackup::findOrFail($this->selectedBackupId);

        try {
            $result = $backupService->restoreToProduction($backup, $user, 'CONFIRM RESTORE');
            $this->closeProductionRestoreModal();

            Notification::make()
                ->title('Production Database Restored')
                ->body("Successfully recovered database from {$backup->filename}. Safety snapshot: {$result['pre_restore_backup']}. All 4 content models verified.")
                ->success()
                ->send();
        } catch (\Throwable $e) {
            $this->closeProductionRestoreModal();
            Notification::make()
                ->title('Restore Aborted / Rolled Back')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function downloadBackup(int $id): ?BinaryFileResponse
    {
        $user = auth()->user();
        if (! $user || ! $user->isSuperAdmin()) {
            Notification::make()
                ->title('Permission Denied')
                ->body('Backup download is restricted to Super Administrators.')
                ->danger()
                ->send();

            return null;
        }

        $backup = SystemBackup::findOrFail($id);
        if (! file_exists($backup->file_path)) {
            Notification::make()
                ->title('File Missing')
                ->body("File not found on disk: {$backup->filename}")
                ->danger()
                ->send();

            return null;
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
    }

    public function deleteBackup(int $id): void
    {
        $user = auth()->user();
        if (! $user || ! $user->isSuperAdmin()) {
            Notification::make()
                ->title('Permission Denied')
                ->body('Backup deletion is restricted to Super Administrators.')
                ->danger()
                ->send();

            return;
        }

        $backup = SystemBackup::findOrFail($id);
        if (file_exists($backup->file_path)) {
            @unlink($backup->file_path);
        }

        $filename = $backup->filename;
        $backup->delete();

        AuditLog::create([
            'user_id' => $user->id,
            'user_email' => $user->email,
            'action' => 'BACKUP_DELETED',
            'new_values' => ['filename' => $filename],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        Notification::make()
            ->title('Backup Deleted')
            ->body("Removed {$filename} from disk and catalog.")
            ->success()
            ->send();
    }

    public function pruneOldBackups(BackupService $backupService): void
    {
        $user = auth()->user();
        if (! $user || ! $user->isSuperAdmin()) {
            Notification::make()
                ->title('Permission Denied')
                ->body('Pruning backups is restricted to Super Administrators.')
                ->danger()
                ->send();

            return;
        }

        $pruned = $backupService->pruneOldBackups(14, 3);
        Notification::make()
            ->title('Retention Pruning Complete')
            ->body("Pruned {$pruned} backup(s) older than 14 days (preserving at least 3 latest backups).")
            ->success()
            ->send();
    }

    public function viewAuditDetail(int $id): void
    {
        $log = AuditLog::with('user')->findOrFail($id);
        $this->selectedAuditDetail = [
            'id' => $log->id,
            'action' => $log->action,
            'user' => $log->user?->name ?? $log->user_email ?? 'System / Anonymous',
            'email' => $log->user_email,
            'ip_address' => $log->ip_address,
            'user_agent' => $log->user_agent,
            'entity' => $log->auditable_type ? (class_basename($log->auditable_type)." #{$log->auditable_id}") : '—',
            'created_at' => $log->created_at->format('d M Y, h:i:s A T'),
            'old_values' => $log->old_values,
            'new_values' => $log->new_values,
        ];
        $this->showAuditDetailModal = true;
    }

    public function closeAuditDetailModal(): void
    {
        $this->showAuditDetailModal = false;
        $this->selectedAuditDetail = null;
    }

    public function clearSystemCache(): void
    {
        try {
            Artisan::call('cache:clear');
            Artisan::call('view:clear');

            Notification::make()
                ->title('Cache Cleared')
                ->body('Application cache and compiled views cleared successfully.')
                ->success()
                ->send();
        } catch (\Throwable $e) {
            Notification::make()
                ->title('Error Clearing Cache')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function getViewData(): array
    {
        $healthService = app(SystemHealthService::class);

        $serverMetrics = $healthService->getServerMetrics();
        $databaseMetrics = $healthService->getDatabaseMetrics();
        $cacheHealth = $healthService->getCacheHealth();
        $scheduledPublishing = $healthService->getScheduledPublishingStatus();
        $apiHealth = $healthService->getApiHealth();
        $errorLogs = $healthService->getErrorLogs(40);
        $publishingLogs = $healthService->getPublishingLogs(30);

        $backups = SystemBackup::with('creator')->latest()->get();

        // Query activity logs with reactive filtering
        $auditQuery = AuditLog::with('user')->latest();

        if (! empty($this->auditActionFilter)) {
            $auditQuery->where('action', $this->auditActionFilter);
        }

        if (! empty($this->auditSearch)) {
            $term = '%'.trim($this->auditSearch).'%';
            $auditQuery->where(function ($q) use ($term) {
                $q->where('user_email', 'like', $term)
                    ->orWhere('action', 'like', $term)
                    ->orWhere('auditable_type', 'like', $term)
                    ->orWhere('ip_address', 'like', $term);
            });
        }

        $auditLogs = $auditQuery->take(100)->get();

        $distinctActions = AuditLog::select('action')->distinct()->orderBy('action')->pluck('action')->toArray();

        return [
            'serverMetrics' => $serverMetrics,
            'databaseMetrics' => $databaseMetrics,
            'cacheHealth' => $cacheHealth,
            'scheduledPublishing' => $scheduledPublishing,
            'apiHealth' => $apiHealth,
            'errorLogs' => $errorLogs,
            'publishingLogs' => $publishingLogs,
            'backups' => $backups,
            'auditLogs' => $auditLogs,
            'distinctActions' => $distinctActions,
            'isSuperAdmin' => (bool) (auth()->user()?->isSuperAdmin()),
        ];
    }
}
