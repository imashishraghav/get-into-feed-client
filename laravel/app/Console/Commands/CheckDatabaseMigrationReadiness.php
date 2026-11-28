<?php

namespace App\Console\Commands;

use App\Support\DatabaseMigrationSupport;
use Illuminate\Console\Command;
use Throwable;

class CheckDatabaseMigrationReadiness extends Command
{
    protected $signature = 'db:migration-readiness
        {--source=sqlite_source : Named SQLite source connection}
        {--target=mysql : Named MySQL destination connection}';

    protected $description = 'Audit SQLite-to-MySQL schema compatibility without changing either database.';

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

        $missingTables = array_values(array_diff($sourceTables, $targetTables));
        $issues = [];
        $rows = [];

        foreach ($sourceTables as $table) {
            if (! in_array($table, $targetTables, true)) {
                $rows[] = [$table, 'MISSING', $support->countRows($source, $table), '—'];

                continue;
            }

            $sourceCount = $support->countRows($source, $table);
            $targetCount = $support->countRows($target, $table);
            $tableIssues = $support->compatibilityIssues($source, $target, $table);
            array_push($issues, ...$tableIssues);
            $rows[] = [$table, $tableIssues === [] ? 'OK' : 'SCHEMA ISSUE', $sourceCount, $targetCount];
        }

        $this->newLine();
        $this->components->info("SQLite source: {$source} | MySQL target: {$target}");
        $this->table(['Table', 'Schema', 'SQLite rows', 'MySQL rows now'], $rows);

        if ($missingTables !== []) {
            $this->newLine();
            $this->components->error('Missing MySQL tables: '.implode(', ', $missingTables));
            $this->line('Run and review the project migrations against MySQL first. Do not copy data until every required table exists.');
        }

        if ($issues !== []) {
            $this->newLine();
            $this->components->error('Column compatibility issues:');
            foreach ($issues as $issue) {
                $this->line(' - '.$issue);
            }
        }

        if ($missingTables === [] && $issues === []) {
            $this->newLine();
            $this->components->success('Basic schema compatibility checks passed. Review the report and test in staging before copying production data.');

            return self::SUCCESS;
        }

        return self::FAILURE;
    }
}
