<?php

namespace App\Console\Commands;

use App\Support\DatabaseMigrationSupport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use PDO;
use Throwable;

class CopySqliteDataToMysql extends Command
{
    protected $signature = 'db:copy-sqlite-to-mysql
        {--source=sqlite_source : Named SQLite source connection}
        {--target=mysql : Named MySQL destination connection}
        {--chunk=300 : Number of rows inserted per batch}
        {--dry-run : Report counts only; do not write data}
        {--yes : Skip interactive confirmation}';

    protected $description = 'Copy SQLite rows into an empty MySQL database; never overwrites existing target rows.';

    public function handle(DatabaseMigrationSupport $support): int
    {
        $source = (string) $this->option('source');
        $target = (string) $this->option('target');
        $chunkSize = max(1, min(1000, (int) $this->option('chunk')));
        $dryRun = (bool) $this->option('dry-run');

        try {
            $support->assertConnections($source, $target);
            $sourceTables = array_values(array_diff($support->sqliteTables($source), DatabaseMigrationSupport::SKIPPED_TABLES));
            $targetTables = $support->mysqlTables($target);
        } catch (Throwable $exception) {
            $this->components->error($exception->getMessage());

            return self::FAILURE;
        }

        $problems = [];
        foreach ($sourceTables as $table) {
            if (! in_array($table, $targetTables, true)) {
                $problems[] = "Missing MySQL table: {$table}";

                continue;
            }

            foreach ($support->compatibilityIssues($source, $target, $table) as $issue) {
                $problems[] = $issue;
            }

            $targetCount = $support->countRows($target, $table);
            if ($targetCount !== 0) {
                $problems[] = "Target table [{$table}] already contains {$targetCount} rows. This command only writes into empty tables.";
            }
        }

        if ($problems !== []) {
            $this->components->error('Preflight failed. No data was copied.');
            foreach ($problems as $problem) {
                $this->line(' - '.$problem);
            }

            return self::FAILURE;
        }

        $this->table(
            ['Table', 'Rows to copy'],
            array_map(fn ($table) => [$table, $support->countRows($source, $table)], $sourceTables)
        );

        if ($dryRun) {
            $this->components->info('Dry run complete. No data was written.');

            return self::SUCCESS;
        }

        if (! $this->option('yes') && ! $this->confirm('Copy all listed rows into the currently empty MySQL tables?')) {
            $this->warn('Cancelled. No data was copied.');

            return self::SUCCESS;
        }

        $targetConnection = DB::connection($target);
        $targetConnection->statement('SET FOREIGN_KEY_CHECKS=0');
        $copiedCounts = [];

        try {
            foreach ($sourceTables as $table) {
                $this->line("Copying {$table}...");
                $quoted = $support->sqliteIdentifier($table);
                $statement = DB::connection($source)->getPdo()->query('SELECT * FROM '.$quoted);
                $batch = [];
                $copied = 0;

                $targetConnection->beginTransaction();
                try {
                    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                        $batch[] = $row;
                        if (count($batch) >= $chunkSize) {
                            $targetConnection->table($table)->insert($batch);
                            $copied += count($batch);
                            $batch = [];
                        }
                    }

                    if ($batch !== []) {
                        $targetConnection->table($table)->insert($batch);
                        $copied += count($batch);
                    }

                    $targetConnection->commit();
                } catch (Throwable $exception) {
                    if ($targetConnection->transactionLevel() > 0) {
                        $targetConnection->rollBack();
                    }
                    throw new \RuntimeException("Copy failed for [{$table}]: {$exception->getMessage()}", 0, $exception);
                }

                $copiedCounts[$table] = $copied;
                $this->info("  Copied {$copied} rows.");
            }
        } catch (Throwable $exception) {
            $this->components->error($exception->getMessage());
            $this->warn('Some earlier tables may already have committed. Do not rerun blindly; inspect the target database and restore/recreate the staging database before retrying.');

            return self::FAILURE;
        } finally {
            $targetConnection->statement('SET FOREIGN_KEY_CHECKS=1');
        }

        $this->newLine();
        $this->components->success('Data copy finished. Run db:verify-sqlite-mysql immediately.');

        return self::SUCCESS;
    }
}
