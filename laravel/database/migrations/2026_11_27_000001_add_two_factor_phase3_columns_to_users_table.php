<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'two_factor_recovery_confirmed_at')) {
                $table->timestamp('two_factor_recovery_confirmed_at')->nullable()->after('two_factor_confirmed_at');
            }
            if (! Schema::hasColumn('users', 'two_factor_grace_until')) {
                $table->timestamp('two_factor_grace_until')->nullable()->after('two_factor_recovery_confirmed_at');
            }
            if (! Schema::hasColumn('users', 'two_factor_trusted_token_version')) {
                $table->unsignedInteger('two_factor_trusted_token_version')->default(1)->after('two_factor_grace_until');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $dropCols = array_values(array_filter([
                Schema::hasColumn('users', 'two_factor_trusted_token_version') ? 'two_factor_trusted_token_version' : null,
                Schema::hasColumn('users', 'two_factor_grace_until') ? 'two_factor_grace_until' : null,
                Schema::hasColumn('users', 'two_factor_recovery_confirmed_at') ? 'two_factor_recovery_confirmed_at' : null,
            ]));
            if ($dropCols !== []) {
                $table->dropColumn($dropCols);
            }
        });
    }
};
