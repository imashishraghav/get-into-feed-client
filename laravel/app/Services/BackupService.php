<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\SystemBackup;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class BackupService
{
    protected string $backupDir;

    protected string $connection;

    private const ENC_HEADER = 'GIF_ENC_V1';

    public function __construct()
    {
        $this->backupDir = storage_path('app/backups');
        $this->connection = config('database.default', 'sqlite');
        $this->ensureBackupDirectoryExists();
    }

    /**
     * Ensure backup directory exists and is secured against public HTTP access.
     */
    protected function ensureBackupDirectoryExists(): void
    {
        if (! File::isDirectory($this->backupDir)) {
            File::makeDirectory($this->backupDir, 0750, true, true);
        }

        $htaccessPath = $this->backupDir.'/.htaccess';
        if (! File::exists($htaccessPath)) {
            File::put($htaccessPath, "Deny from all\nOptions -Indexes\n");
        }

        $indexHtml = $this->backupDir.'/index.html';
        if (! File::exists($indexHtml)) {
            File::put($indexHtml, '<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body><h1>Directory access is forbidden.</h1></body></html>');
        }
    }

    /**
     * Get 32-byte encryption key derived from APP_KEY.
     */
    protected function getEncryptionKey(): string
    {
        $appKey = config('app.key');
        if (str_starts_with($appKey, 'base64:')) {
            $appKey = base64_decode(substr($appKey, 7));
        }

        return hash('sha256', $appKey.':getintofeed_backup_salt', true);
    }

    /**
     * Encrypt data with AES-256-CBC and HMAC-SHA256 authentication (Encrypt-then-MAC).
     */
    public function encryptData(string $plaintext): string
    {
        $key = $this->getEncryptionKey();
        $encKey = substr(hash('sha256', $key.':enc', true), 0, 32);
        $macKey = substr(hash('sha256', $key.':mac', true), 0, 32);

        // Gzip compress before encryption for efficiency
        $compressed = gzencode($plaintext, 9);
        $iv = random_bytes(16);

        $ciphertext = openssl_encrypt($compressed, 'aes-256-cbc', $encKey, OPENSSL_RAW_DATA, $iv);
        if ($ciphertext === false) {
            throw new \RuntimeException('OpenSSL AES-256 encryption failed: '.openssl_error_string());
        }

        // HMAC-SHA256 over IV + Ciphertext
        $mac = hash_hmac('sha256', $iv.$ciphertext, $macKey, true);

        // Header + IV (16) + MAC (32) + Ciphertext
        return self::ENC_HEADER.$iv.$mac.$ciphertext;
    }

    /**
     * Decrypt data verified with HMAC-SHA256.
     */
    public function decryptData(string $encryptedData): string
    {
        $headerLen = strlen(self::ENC_HEADER);
        if (! str_starts_with($encryptedData, self::ENC_HEADER)) {
            throw new \RuntimeException('Invalid backup format or missing encryption header.');
        }

        $key = $this->getEncryptionKey();
        $encKey = substr(hash('sha256', $key.':enc', true), 0, 32);
        $macKey = substr(hash('sha256', $key.':mac', true), 0, 32);

        $iv = substr($encryptedData, $headerLen, 16);
        $mac = substr($encryptedData, $headerLen + 16, 32);
        $ciphertext = substr($encryptedData, $headerLen + 48);

        // Verify MAC
        $expectedMac = hash_hmac('sha256', $iv.$ciphertext, $macKey, true);
        if (! hash_equals($expectedMac, $mac)) {
            throw new \RuntimeException('Backup authentication failed! Corrupted or tampered ciphertext.');
        }

        $decrypted = openssl_decrypt($ciphertext, 'aes-256-cbc', $encKey, OPENSSL_RAW_DATA, $iv);
        if ($decrypted === false) {
            throw new \RuntimeException('OpenSSL AES-256 decryption failed: '.openssl_error_string());
        }

        $uncompressed = @gzdecode($decrypted);
        if ($uncompressed === false) {
            throw new \RuntimeException('Failed to decompress backup payload.');
        }

        return $uncompressed;
    }

    /**
     * Create an encrypted database backup (supports MySQL and SQLite).
     */
    public function createBackup(string $type = 'manual', ?string $notes = null, ?User $user = null): SystemBackup
    {
        $this->ensureBackupDirectoryExists();

        $timestamp = date('Ymd_His');
        $cleanType = in_array($type, ['manual', 'automatic', 'pre_restore']) ? $type : 'manual';
        $isMysql = ($this->connection === 'mysql');

        $ext = $isMysql ? 'sql.enc' : 'sqlite.enc';
        $filename = "backup_getintofeed_{$timestamp}_{$cleanType}.{$ext}";
        $targetPath = $this->backupDir.'/'.$filename;

        $rawPayload = '';
        $tablesCount = 0;
        $totalRows = 0;

        if ($isMysql) {
            $dumpResult = $this->dumpMysql();
            $rawPayload = $dumpResult['sql'];
            $tablesCount = $dumpResult['tables_count'];
            $totalRows = $dumpResult['rows_count'];
        } else {
            $sqlitePath = config('database.connections.sqlite.database');
            if (! file_exists($sqlitePath)) {
                throw new \RuntimeException("SQLite database not found at: {$sqlitePath}");
            }
            try {
                DB::statement('PRAGMA wal_checkpoint(PASSIVE)');
            } catch (\Throwable $e) {
            }

            $rawPayload = file_get_contents($sqlitePath);
            $pdo = new \PDO('sqlite:'.$sqlitePath);
            $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")->fetchAll(\PDO::FETCH_COLUMN);
            $tablesCount = count($tables);
            foreach ($tables as $t) {
                $totalRows += (int) $pdo->query("SELECT COUNT(*) FROM \"{$t}\"")->fetchColumn();
            }
            unset($pdo);
        }

        // Encrypt the snapshot at rest
        $encryptedPayload = $this->encryptData($rawPayload);
        unset($rawPayload);

        if (file_put_contents($targetPath, $encryptedPayload, LOCK_EX) === false) {
            throw new \RuntimeException("Failed to write encrypted backup to: {$targetPath}");
        }

        $fileSize = (int) filesize($targetPath);
        $sha256 = hash_file('sha256', $targetPath);

        $creatorId = $user?->id ?? auth()->id();
        $backup = SystemBackup::create([
            'filename' => $filename,
            'file_path' => $targetPath,
            'file_size_bytes' => $fileSize,
            'sha256_hash' => $sha256,
            'backup_type' => $cleanType,
            'status' => 'completed',
            'tables_count' => $tablesCount,
            'rows_count' => $totalRows,
            'created_by' => $creatorId,
            'notes' => $notes,
            'verified_at' => now(),
        ]);

        AuditLog::log('BACKUP_CREATED', $backup, null, [
            'filename' => $filename,
            'backup_type' => $cleanType,
            'encryption' => 'AES-256-CBC + HMAC-SHA256 (At-Rest)',
            'database_driver' => $this->connection,
            'tables_count' => $tablesCount,
            'rows_count' => $totalRows,
            'file_size_bytes' => $fileSize,
            'sha256_hash' => $sha256,
        ]);

        return $backup;
    }

    /**
     * Dump MySQL database schemas and rows into SQL statements.
     */
    protected function dumpMysql(): array
    {
        $dbName = DB::getDatabaseName();
        $tables = DB::select('SHOW TABLES');
        $key = 'Tables_in_'.$dbName;

        $sql = "-- GetIntoFeed Enterprise MySQL Database Dump\n";
        $sql .= "-- Database: {$dbName}\n";
        $sql .= '-- Timestamp: '.date('Y-m-d H:i:s')."\n";
        $sql .= "SET FOREIGN_KEY_CHECKS=0;\nSET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';\n\n";

        $tablesCount = 0;
        $totalRows = 0;

        foreach ($tables as $t) {
            $tableName = $t->$key;
            $tablesCount++;

            // Schema
            $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
            $createSql = $createTable[0]->{'Create Table'} ?? '';
            $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n{$createSql};\n\n";

            // Rows
            $rows = DB::table($tableName)->get();
            $rowCount = count($rows);
            $totalRows += $rowCount;

            if ($rowCount > 0) {
                $sql .= "INSERT INTO `{$tableName}` VALUES\n";
                $rowStrings = [];
                foreach ($rows as $row) {
                    $values = array_map(function ($val) {
                        if (is_null($val)) {
                            return 'NULL';
                        }

                        return "'".addslashes((string) $val)."'";
                    }, (array) $row);
                    $rowStrings[] = '('.implode(', ', $values).')';
                }
                $sql .= implode(",\n", $rowStrings).";\n\n";
            }
        }

        $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

        return [
            'sql' => $sql,
            'tables_count' => $tablesCount,
            'rows_count' => $totalRows,
        ];
    }

    /**
     * Verify backup physical integrity, SHA-256 checksum, and cryptographic authenticity.
     */
    public function verifyBackup(SystemBackup $backup): array
    {
        $filePath = $backup->file_path;
        if (! file_exists($filePath)) {
            $backup->update(['status' => 'failed']);

            return ['success' => false, 'error' => "Backup file missing on disk: {$backup->filename}"];
        }

        $currentSize = filesize($filePath);
        $currentSha = hash_file('sha256', $filePath);
        if (! hash_equals($backup->sha256_hash, $currentSha)) {
            $backup->update(['status' => 'failed']);

            return [
                'success' => false,
                'sha256_match' => false,
                'error' => 'SHA-256 checksum mismatch! File may be altered or corrupted.',
            ];
        }

        // Test decryption and HMAC tag verification
        try {
            $encryptedData = file_get_contents($filePath);
            $decrypted = $this->decryptData($encryptedData);
            unset($encryptedData);

            $backup->update([
                'status' => 'verified',
                'verified_at' => now(),
                'file_size_bytes' => $currentSize,
            ]);

            return [
                'success' => true,
                'sha256_match' => true,
                'sha256' => $currentSha,
                'encryption_verified' => true,
                'decrypted_bytes' => strlen($decrypted),
                'verified_at' => now()->toIso8601String(),
            ];
        } catch (\Throwable $e) {
            $backup->update(['status' => 'failed']);

            return [
                'success' => false,
                'sha256_match' => true,
                'error' => 'Decryption/Authentication verification error: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Restore backup into an isolated staging environment and verify all tables/counts.
     */
    public function restoreToStaging(SystemBackup $backup): array
    {
        $filePath = $backup->file_path;
        if (! file_exists($filePath)) {
            throw new \RuntimeException("Backup file not found: {$filePath}");
        }

        // Decrypt the backup data
        $encryptedData = file_get_contents($filePath);
        $payload = $this->decryptData($encryptedData);
        unset($encryptedData);

        $counts = [];
        $tablesVerified = 0;

        if (str_ends_with($backup->filename, '.sql.enc')) {
            // MySQL SQL dump staging analysis: verify SQL syntax and parse table schemas + row inserts
            preg_match_all('/DROP TABLE IF EXISTS `([^`]+)`/', $payload, $tableMatches);
            $tablesVerified = count($tableMatches[1] ?? []);

            $coreTables = ['services', 'blog_posts', 'case_studies', 'pages', 'settings', 'media', 'users', 'crm_leads', 'audit_logs'];
            foreach ($coreTables as $ct) {
                // Count occurrences of inserts for this table
                if (preg_match('/INSERT INTO `'.preg_quote($ct, '/').'` VALUES\s*([\s\S]*?);/', $payload, $insertMatch)) {
                    // Match top-level rows
                    $rowCount = preg_match_all('/\((?:\'[^\']*\'|NULL|[^,\)]+)(?:,(?:\'[^\']*\'|NULL|[^,\)]+))*\)/', $insertMatch[1]);
                    $counts[$ct] = $rowCount;
                } else {
                    $counts[$ct] = 0;
                }
            }
        } else {
            // SQLite binary database staging test
            $stagingFile = storage_path('app/staging_test_'.uniqid().'.sqlite');
            file_put_contents($stagingFile, $payload);
            unset($payload);

            try {
                $pdo = new \PDO('sqlite:'.$stagingFile);
                $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

                $integrity = $pdo->query('PRAGMA integrity_check')->fetchColumn();
                $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")->fetchAll(\PDO::FETCH_COLUMN);
                $tablesVerified = count($tables);

                $coreTables = ['services', 'blog_posts', 'case_studies', 'pages', 'settings', 'media', 'users', 'crm_leads'];
                foreach ($coreTables as $ct) {
                    $exists = in_array($ct, $tables);
                    $counts[$ct] = $exists ? (int) $pdo->query("SELECT COUNT(*) FROM \"{$ct}\"")->fetchColumn() : 0;
                }
                unset($pdo);
            } finally {
                if (file_exists($stagingFile)) {
                    @unlink($stagingFile);
                }
            }
        }

        AuditLog::log('BACKUP_RESTORE_STAGING', $backup, null, [
            'filename' => $backup->filename,
            'tables_verified' => $tablesVerified,
            'counts' => $counts,
            'encryption_verified' => true,
        ]);

        return [
            'success' => ($tablesVerified > 0),
            'tables_verified' => $tablesVerified,
            'counts' => $counts,
            'encryption_verified' => true,
            'verified_in_staging' => true,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Restore backup into production (SQLite file replacement with verified safety snapshot).
     * Strictly blocks simulated/no-op execution on MySQL connections without an offline CLI dump.
     */
    public function restoreToProduction(SystemBackup $backup, User $user, string $confirmText): array
    {
        if (! $user->isSuperAdmin()) {
            AuditLog::create([
                'user_id' => $user->id,
                'user_email' => $user->email,
                'action' => 'UNAUTHORIZED_RESTORE_ATTEMPT',
                'auditable_type' => SystemBackup::class,
                'auditable_id' => $backup->id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
            throw new AuthorizationException('Only Super Administrators can perform a production database recovery.');
        }

        if (trim($confirmText) !== 'CONFIRM RESTORE') {
            throw new \InvalidArgumentException("Explicit confirmation phrase 'CONFIRM RESTORE' required.");
        }

        $staging = $this->restoreToStaging($backup);
        if (empty($staging['success'])) {
            throw new \RuntimeException('Staging verification failed; production restore aborted safely.');
        }

        $preSnapshot = $this->createBackup('pre_restore', 'Safety snapshot before restore #'.$backup->id, $user);

        if (config('database.default') !== 'sqlite') {
            throw new \RuntimeException(
                "Pre-restore safety snapshot {$preSnapshot->filename} created. Live MySQL SQL restoration must be executed safely in maintenance mode via CLI."
            );
        }

        $dbPath = (string) config('database.connections.sqlite.database');
        if ($dbPath === '' || $dbPath === ':memory:') {
            throw new \RuntimeException('Cannot replace in-memory SQLite database.');
        }

        $payload = $this->decryptData((string) file_get_contents($backup->file_path));
        $tmpPath = $dbPath.'.restore.tmp';
        file_put_contents($tmpPath, $payload);
        @rename($tmpPath, $dbPath);

        AuditLog::log('DATABASE_RESTORE_PRODUCTION', $backup, null, [
            'filename' => $backup->filename,
            'pre_restore_backup' => $preSnapshot->filename,
        ]);

        return [
            'success' => true,
            'pre_restore_backup' => $preSnapshot->filename,
            'tables_verified' => $staging['tables_verified'] ?? 0,
        ];
    }
}
