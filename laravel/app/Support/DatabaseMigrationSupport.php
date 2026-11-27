<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;
use RuntimeException;

class DatabaseMigrationSupport
{
    public const SKIPPED_TABLES = ['migrations'];

    public function assertConnections(string $sourceName, string $targetName): void
    {
        $sourceDriver = config("database.connections.{$sourceName}.driver");
        $targetDriver = config("database.connections.{$targetName}.driver");

        if ($sourceDriver !== 'sqlite') {
            throw new RuntimeException("Source connection [{$sourceName}] must use the sqlite driver.");
        }

        if ($targetDriver !== 'mysql') {
            throw new RuntimeException("Target connection [{$targetName}] must use the mysql driver.");
        }

        $sourcePath = config("database.connections.{$sourceName}.database");
        if (! is_string($sourcePath) || $sourcePath === '' || $sourcePath === ':memory:' || ! is_file($sourcePath)) {
            throw new RuntimeException('SQLite source file was not found. Check SQLITE_SOURCE_DB_DATABASE.');
        }

        DB::connection($sourceName)->getPdo();
        DB::connection($targetName)->getPdo();
    }

    /** @return list<string> */
    public function sqliteTables(string $connection): array
    {
        $rows = DB::connection($connection)->select(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        );

        return array_values(array_map(static fn ($row) => (string) $row->name, $rows));
    }

    /** @return list<string> */
    public function mysqlTables(string $connection): array
    {
        $rows = DB::connection($connection)->select(
            'SELECT TABLE_NAME AS table_name FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = ? ORDER BY TABLE_NAME',
            ['BASE TABLE']
        );

        return array_values(array_map(static fn ($row) => (string) $row->table_name, $rows));
    }

    /** @return list<string> */
    public function sqliteColumns(string $connection, string $table): array
    {
        $rows = DB::connection($connection)->select('PRAGMA table_info('.$this->sqliteIdentifier($table).')');

        return array_values(array_map(static fn ($row) => (string) $row->name, $rows));
    }

    /** @return list<object> */
    public function mysqlColumns(string $connection, string $table): array
    {
        return DB::connection($connection)->select('SHOW COLUMNS FROM '.$this->mysqlIdentifier($table));
    }

    public function countRows(string $connection, string $table): int
    {
        return (int) DB::connection($connection)->table($table)->count();
    }

    public function sqliteIdentifier(string $identifier): string
    {
        return '"'.str_replace('"', '""', $identifier).'"';
    }

    public function mysqlIdentifier(string $identifier): string
    {
        return '`'.str_replace('`', '``', $identifier).'`';
    }

    /**
     * Return actionable schema compatibility issues before any rows are copied.
     *
     * @return list<string>
     */
    public function compatibilityIssues(string $source, string $target, string $table): array
    {
        $issues = [];
        $sourceColumns = $this->sqliteColumns($source, $table);
        $targetMetadata = $this->mysqlColumns($target, $table);
        $targetNames = array_map(static fn ($column) => (string) $column->Field, $targetMetadata);

        foreach (array_diff($sourceColumns, $targetNames) as $missing) {
            $issues[] = "{$table}: source column [{$missing}] does not exist in MySQL.";
        }

        foreach ($targetMetadata as $column) {
            $name = (string) $column->Field;
            $isRequired = strtoupper((string) $column->Null) === 'NO';
            $hasDefault = $column->Default !== null;
            $isAutoIncrement = str_contains(strtolower((string) $column->Extra), 'auto_increment');

            if ($isRequired && ! $hasDefault && ! $isAutoIncrement && ! in_array($name, $sourceColumns, true)) {
                $issues[] = "{$table}: required MySQL column [{$name}] has no SQLite source value, default, or AUTO_INCREMENT.";
            }
        }

        return $issues;
    }
}
