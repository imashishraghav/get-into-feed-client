<?php

namespace App\Console\Commands;

use App\Support\DatabaseMigrationSupport;
use Illuminate\Console\Command;
use Throwable;

class VerifySqliteMysqlCopy extends Command
{
    protected $signature = 'db:verify-sqlite-mysql
        {--source=sqlite_source : Named SQLite source connection}
        {--target=mysql : Named MySQL destination connection}';

    protected $description = 'Compare SQLite and MySQL row counts after migration.';

    public function handle(DatabaseMigrationSupport $support): int
    {
        $source = (string) $this->option('source');
        $target = (string) $this->option('target');

        try {
            $support->assertConnections($source, $target);
            $sourceTables = array_values(array_diff($support->sqliteTables($source), DatabaseMigrationSupport::SKIPPED_TABLES));
            $targetTables = $support->mysqlTables($target);
        } catch (Throwable $exception) {
            $this->components->error($exception->getMessage());

            return self::FAILURE;
        }

        $rows = [];
        $failed = false;
        foreach ($sourceTables as $table) {
            if (! in_array($table, $targetTables, true)) {
                $rows[] = [$table, 'MISSING', '—', '—'];
                $failed = true;

                continue;
            }

            $sourceCount = $support->countRows($source, $table);
            $targetCount = $support->countRows($target, $table);
            $status = $sourceCount === $targetCount ? 'PASS' : 'MISMATCH';
            $failed = $failed || $status !== 'PASS';
            $rows[] = [$table, $status, $sourceCount, $targetCount];
        }

        $this->table(['Table', 'Result', 'SQLite rows', 'MySQL rows'], $rows);

        if ($failed) {
            $this->components->error('Row-count verification failed. Keep the application on SQLite until the mismatch is resolved.');

            return self::FAILURE;
        }

        $this->components->success('All checked table row counts match. This does not replace application-level testing.');

        return self::SUCCESS;
    }
}
