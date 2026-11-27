<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crm_leads', function (Blueprint $table) {
            // 1. Allow nullable email and phone (preventing forced synthetic email fallbacks)
            $table->string('email', 191)->nullable()->change();
            $table->string('phone', 191)->nullable()->change();

            // 2. Click IDs and Marketing Attribution
            if (! Schema::hasColumn('crm_leads', 'gclid')) {
                $table->string('gclid', 100)->nullable()->after('utm_content');
            }
            if (! Schema::hasColumn('crm_leads', 'fbclid')) {
                $table->string('fbclid', 100)->nullable()->after('gclid');
            }

            // 3. DPDP Compliance Consent Tracking
            if (! Schema::hasColumn('crm_leads', 'consent_at')) {
                $table->timestamp('consent_at')->nullable()->after('fbclid');
            }
            if (! Schema::hasColumn('crm_leads', 'consent_ip')) {
                $table->string('consent_ip', 45)->nullable()->after('consent_at');
            }

            // 4. CRM Pipeline & SLA Tracking
            if (! Schema::hasColumn('crm_leads', 'score')) {
                $table->integer('score')->default(0)->after('priority');
            }
            if (! Schema::hasColumn('crm_leads', 'stage')) {
                $table->string('stage', 50)->default('New')->after('score');
            }
            if (! Schema::hasColumn('crm_leads', 'lost_reason')) {
                $table->string('lost_reason', 255)->nullable()->after('stage');
            }
            if (! Schema::hasColumn('crm_leads', 'sla_due_at')) {
                $table->timestamp('sla_due_at')->nullable()->after('lost_reason');
            }
            if (! Schema::hasColumn('crm_leads', 'first_response_at')) {
                $table->timestamp('first_response_at')->nullable()->after('sla_due_at');
            }

            // 5. Demographics & Firmographics
            if (! Schema::hasColumn('crm_leads', 'city')) {
                $table->string('city', 100)->nullable()->after('company');
            }
            if (! Schema::hasColumn('crm_leads', 'industry')) {
                $table->string('industry', 100)->nullable()->after('city');
            }
        });
    }

    public function down(): void
    {
        Schema::table('crm_leads', function (Blueprint $table) {
            $columnsToDrop = [
                'gclid',
                'fbclid',
                'consent_at',
                'consent_ip',
                'score',
                'stage',
                'lost_reason',
                'sla_due_at',
                'first_response_at',
                'city',
                'industry',
            ];
            foreach ($columnsToDrop as $col) {
                if (Schema::hasColumn('crm_leads', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
