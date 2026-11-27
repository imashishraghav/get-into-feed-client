<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_backups', function (Blueprint $table) {
            $table->id();
            $table->string('filename')->unique();
            $table->string('file_path');
            $table->unsignedBigInteger('file_size_bytes')->default(0);
            $table->string('sha256_hash', 64)->index();
            $table->string('backup_type', 32)->default('manual'); // manual, automatic, pre_restore
            $table->string('status', 32)->default('completed'); // completed, failed, verified
            $table->unsignedInteger('tables_count')->default(0);
            $table->unsignedInteger('rows_count')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->index(['backup_type', 'created_at']);
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_backups');
    }
};
