<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'two_factor_last_used_timestep')) {
                $table->unsignedBigInteger('two_factor_last_used_timestep')->nullable()->after('two_factor_trusted_token_version');
            }
            if (! Schema::hasColumn('users', 'two_factor_reset_by')) {
                $table->foreignId('two_factor_reset_by')->nullable()->after('two_factor_last_used_timestep')->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('users', 'two_factor_reset_at')) {
                $table->timestamp('two_factor_reset_at')->nullable()->after('two_factor_reset_by');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'two_factor_reset_by')) {
                $table->dropConstrainedForeignId('two_factor_reset_by');
            }
            $dropCols = array_values(array_filter([
                Schema::hasColumn('users', 'two_factor_reset_at') ? 'two_factor_reset_at' : null,
                Schema::hasColumn('users', 'two_factor_last_used_timestep') ? 'two_factor_last_used_timestep' : null,
            ]));
            if ($dropCols !== []) {
                $table->dropColumn($dropCols);
            }
        });
    }
};
