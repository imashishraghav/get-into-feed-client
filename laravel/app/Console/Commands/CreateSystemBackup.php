<?php

namespace App\Console\Commands;

use App\Services\BackupService;
use Illuminate\Console\Command;

class CreateSystemBackup extends Command
{
    protected $signature = 'cms:backup
                            {--type=automatic : Backup type (automatic, manual, pre_restore)}
                            {--notes= : Optional notes for the backup record}
                            {--prune : Automatically prune backups older than 14 days}';

    protected $description = 'Create a secure transaction-safe SQLite database backup and verify integrity';

    public function handle(BackupService $backupService): int
    {
        $type = $this->option('type') ?: 'automatic';
        $notes = $this->option('notes') ?: 'Scheduled automatic system backup';

        $this->info("Initiating SQLite database backup (Type: {$type})...");

        try {
            $backup = $backupService->createBackup($type, $notes);
            $this->info("✓ Backup created: {$backup->filename}");
            $this->line("  Size: {$backup->formatted_size}");
            $this->line("  SHA-256: {$backup->sha256_hash}");
            $this->line("  Tables: {$backup->tables_count}, Total Rows: {$backup->rows_count}");

            // Verify integrity
            $this->info('Verifying backup integrity...');
            $verification = $backupService->verifyBackup($backup);
            if ($verification['success']) {
                $this->info('✓ Integrity verified successfully: Quick Check OK, Foreign Keys OK.');
            } else {
                $this->error('✗ Integrity verification warning: '.($verification['error'] ?? 'Check failed'));
            }

            if ($this->option('prune')) {
                $this->info('Pruning expired backups (>14 days, keeping min 3)...');
                $pruned = $backupService->pruneOldBackups(14, 3);
                $this->info("✓ Pruned {$pruned} expired backup(s).");
            }

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('✗ Database backup failed: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
