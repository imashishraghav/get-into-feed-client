<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crm_leads', function (Blueprint $table) {
            if (! Schema::hasColumn('crm_leads', 'page_url')) {
                $table->string('page_url', 1000)->nullable()->after('source');
            }
            if (! Schema::hasColumn('crm_leads', 'page_title')) {
                $table->string('page_title')->nullable()->after('page_url');
            }
            if (! Schema::hasColumn('crm_leads', 'referrer')) {
                $table->string('referrer', 1000)->nullable()->after('page_title');
            }
            if (! Schema::hasColumn('crm_leads', 'form_type')) {
                $table->string('form_type')->nullable()->after('referrer');
            }
            if (! Schema::hasColumn('crm_leads', 'ip_address')) {
                $table->string('ip_address', 45)->nullable()->after('form_type');
            }
            if (! Schema::hasColumn('crm_leads', 'user_agent')) {
                $table->text('user_agent')->nullable()->after('ip_address');
            }
        });

        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            if (! Schema::hasColumn('newsletter_subscribers', 'page_url')) {
                $table->string('page_url', 1000)->nullable()->after('source');
            }
            if (! Schema::hasColumn('newsletter_subscribers', 'page_title')) {
                $table->string('page_title')->nullable()->after('page_url');
            }
            if (! Schema::hasColumn('newsletter_subscribers', 'referrer')) {
                $table->string('referrer', 1000)->nullable()->after('page_title');
            }
            if (! Schema::hasColumn('newsletter_subscribers', 'user_agent')) {
                $table->text('user_agent')->nullable()->after('ip_address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('crm_leads', function (Blueprint $table) {
            $table->dropColumn(['page_url', 'page_title', 'referrer', 'form_type', 'ip_address', 'user_agent']);
        });

        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropColumn(['page_url', 'page_title', 'referrer', 'user_agent']);
        });
    }
};
