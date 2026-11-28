<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('media')) {
            Schema::table('media', function (Blueprint $table): void {
                if (! Schema::hasColumn('media', 'variants')) {
                    $table->json('variants')->nullable()->after('avif_path');
                }
                if (! Schema::hasColumn('media', 'exif_stripped_at')) {
                    $table->timestamp('exif_stripped_at')->nullable()->after('optimized_size');
                }
            });
        }

        if (Schema::hasTable('redirects')) {
            Schema::table('redirects', function (Blueprint $table): void {
                if (! $this->indexExists('redirects', 'redirects_source_active_idx')) {
                    $table->index(['source_url', 'is_active'], 'redirects_source_active_idx');
                }
            });
        }

        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table): void {
                if (! $this->indexExists('audit_logs', 'audit_logs_user_created_idx')) {
                    $table->index(['user_id', 'created_at'], 'audit_logs_user_created_idx');
                }
                if (! $this->indexExists('audit_logs', 'audit_logs_auditable_idx')) {
                    $table->index(['auditable_type', 'auditable_id'], 'audit_logs_auditable_idx');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table): void {
                if ($this->indexExists('audit_logs', 'audit_logs_user_created_idx')) {
                    $table->dropIndex('audit_logs_user_created_idx');
                }
                if ($this->indexExists('audit_logs', 'audit_logs_auditable_idx')) {
                    $table->dropIndex('audit_logs_auditable_idx');
                }
            });
        }

        if (Schema::hasTable('redirects')) {
            Schema::table('redirects', function (Blueprint $table): void {
                if ($this->indexExists('redirects', 'redirects_source_active_idx')) {
                    $table->dropIndex('redirects_source_active_idx');
                }
            });
        }

        if (Schema::hasTable('media')) {
            $cols = array_values(array_filter(
                ['variants', 'exif_stripped_at'],
                fn (string $col): bool => Schema::hasColumn('media', $col)
            ));
            if ($cols !== []) {
                Schema::table('media', function (Blueprint $table) use ($cols): void {
                    $table->dropColumn($cols);
                });
            }
        }
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            $rows = DB::select("SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = ? AND name = ?", [$table, $indexName]);

            return count($rows) > 0;
        }

        $database = DB::getDatabaseName();
        $rows = DB::select(
            'SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1',
            [$database, $table, $indexName]
        );

        return count($rows) > 0;
    }
};
