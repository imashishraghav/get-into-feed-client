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
        Schema::table('crm_leads', function (Blueprint $table) {
            if (! Schema::hasColumn('crm_leads', 'uuid')) {
                $table->uuid('uuid')->nullable()->unique()->after('id');
            }
            if (! Schema::hasColumn('crm_leads', 'crm_sync_status')) {
                $table->string('crm_sync_status', 20)->default('pending')->index()->after('is_test');
            }
            if (! Schema::hasColumn('crm_leads', 'crm_synced_at')) {
                $table->timestamp('crm_synced_at')->nullable()->after('crm_sync_status');
            }
            if (! Schema::hasColumn('crm_leads', 'crm_sync_attempts')) {
                $table->unsignedInteger('crm_sync_attempts')->default(0)->after('crm_synced_at');
            }
            if (! Schema::hasColumn('crm_leads', 'crm_sync_error')) {
                $table->text('crm_sync_error')->nullable()->after('crm_sync_attempts');
            }
            if (! Schema::hasColumn('crm_leads', 'crm_lead_id')) {
                $table->string('crm_lead_id', 100)->nullable()->after('crm_sync_error');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crm_leads', function (Blueprint $table) {
            $table->dropColumn([
                'uuid',
                'crm_sync_status',
                'crm_synced_at',
                'crm_sync_attempts',
                'crm_sync_error',
                'crm_lead_id',
            ]);
        });
    }
};
