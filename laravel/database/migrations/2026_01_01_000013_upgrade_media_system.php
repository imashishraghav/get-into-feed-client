<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {
            if (! Schema::hasColumn('media', 'file_hash')) {
                $table->string('file_hash', 64)->nullable()->index();
            }
            if (! Schema::hasColumn('media', 'webp_path')) {
                $table->string('webp_path', 255)->nullable();
            }
            if (! Schema::hasColumn('media', 'avif_path')) {
                $table->string('avif_path', 255)->nullable();
            }
            if (! Schema::hasColumn('media', 'optimized_size')) {
                $table->unsignedBigInteger('optimized_size')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            if (Schema::hasColumn('media', 'file_hash')) {
                $table->dropColumn('file_hash');
            }
            if (Schema::hasColumn('media', 'webp_path')) {
                $table->dropColumn('webp_path');
            }
            if (Schema::hasColumn('media', 'avif_path')) {
                $table->dropColumn('avif_path');
            }
            if (Schema::hasColumn('media', 'optimized_size')) {
                $table->dropColumn('optimized_size');
            }
        });
    }
};
