<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Standard Laravel Jobs Table for Database Queue Driver
        if (! Schema::hasTable('jobs')) {
            Schema::create('jobs', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('queue')->index();
                $table->longText('payload');
                $table->unsignedTinyInteger('attempts');
                $table->unsignedInteger('reserved_at')->nullable();
                $table->unsignedInteger('available_at');
                $table->unsignedInteger('created_at');

                $table->index(['queue', 'reserved_at']);
            });
        }

        // 2. Failed Jobs Table for Queue Failure Diagnostics & Retries
        if (! Schema::hasTable('failed_jobs')) {
            Schema::create('failed_jobs', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('uuid')->unique();
                $table->text('connection');
                $table->text('queue');
                $table->longText('payload');
                $table->longText('exception');
                $table->timestamp('failed_at')->useCurrent();
            });
        }

        // 3. Job Batches Table for Batch Processing
        if (! Schema::hasTable('job_batches')) {
            Schema::create('job_batches', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('name');
                $table->integer('total_jobs');
                $table->integer('pending_jobs');
                $table->integer('failed_jobs');
                $table->longText('failed_job_ids');
                $table->mediumText('options')->nullable();
                $table->integer('cancelled_at')->nullable();
                $table->integer('created_at');
                $table->integer('finished_at')->nullable();
            });
        }

        // 4. Notification Tracking Columns on crm_leads Table
        if (Schema::hasTable('crm_leads')) {
            Schema::table('crm_leads', function (Blueprint $table) {
                if (! Schema::hasColumn('crm_leads', 'notification_sent_at')) {
                    $table->timestamp('notification_sent_at')->nullable()->after('priority');
                }
                if (! Schema::hasColumn('crm_leads', 'notification_error')) {
                    $table->text('notification_error')->nullable()->after('notification_sent_at');
                }
                if (! Schema::hasColumn('crm_leads', 'notification_attempts')) {
                    $table->unsignedTinyInteger('notification_attempts')->default(0)->after('notification_error');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('crm_leads')) {
            Schema::table('crm_leads', function (Blueprint $table) {
                if (Schema::hasColumn('crm_leads', 'notification_sent_at')) {
                    $table->dropColumn('notification_sent_at');
                }
                if (Schema::hasColumn('crm_leads', 'notification_error')) {
                    $table->dropColumn('notification_error');
                }
                if (Schema::hasColumn('crm_leads', 'notification_attempts')) {
                    $table->dropColumn('notification_attempts');
                }
            });
        }

        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('jobs');
    }
};
