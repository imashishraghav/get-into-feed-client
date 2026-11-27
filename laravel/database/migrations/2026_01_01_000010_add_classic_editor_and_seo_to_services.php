<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            if (! Schema::hasColumn('services', 'content')) {
                $table->longText('content')->nullable()->after('overview');
            }
            if (! Schema::hasColumn('services', 'faqs')) {
                $table->json('faqs')->nullable()->after('process_steps');
            }
            if (! Schema::hasColumn('services', 'problem_tag')) {
                $table->string('problem_tag')->nullable()->after('hero_description');
            }
            if (! Schema::hasColumn('services', 'problem_heading')) {
                $table->string('problem_heading')->nullable()->after('problem_tag');
            }
            if (! Schema::hasColumn('services', 'problem_summary')) {
                $table->text('problem_summary')->nullable()->after('problem_heading');
            }
            if (! Schema::hasColumn('services', 'how_deal_heading')) {
                $table->string('how_deal_heading')->nullable()->after('problem_summary');
            }
            if (! Schema::hasColumn('services', 'how_deal_content')) {
                $table->text('how_deal_content')->nullable()->after('how_deal_heading');
            }
            if (! Schema::hasColumn('services', 'who_for_heading')) {
                $table->string('who_for_heading')->nullable()->after('how_deal_content');
            }
            if (! Schema::hasColumn('services', 'who_for_desc')) {
                $table->text('who_for_desc')->nullable()->after('who_for_heading');
            }
            if (! Schema::hasColumn('services', 'locations')) {
                $table->json('locations')->nullable()->after('who_for_desc');
            }
            if (! Schema::hasColumn('services', 'issues')) {
                $table->json('issues')->nullable()->after('locations');
            }
            if (! Schema::hasColumn('services', 'sidebar_heading')) {
                $table->string('sidebar_heading')->nullable()->after('issues');
            }
            if (! Schema::hasColumn('services', 'sidebar_desc')) {
                $table->text('sidebar_desc')->nullable()->after('sidebar_heading');
            }
            if (! Schema::hasColumn('services', 'sidebar_checks')) {
                $table->json('sidebar_checks')->nullable()->after('sidebar_desc');
            }
            if (! Schema::hasColumn('services', 'backlinks')) {
                $table->json('backlinks')->nullable()->after('sidebar_checks');
            }
        });

        Schema::table('seo_metadata', function (Blueprint $table) {
            if (! Schema::hasColumn('seo_metadata', 'backlinks')) {
                $table->json('backlinks')->nullable()->after('canonical_url');
            }
            if (! Schema::hasColumn('seo_metadata', 'target_keywords')) {
                $table->json('target_keywords')->nullable()->after('focus_keyword');
            }
            if (! Schema::hasColumn('seo_metadata', 'seo_score')) {
                $table->integer('seo_score')->default(90)->after('robots_follow');
            }
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'content', 'faqs', 'problem_tag', 'problem_heading', 'problem_summary',
                'how_deal_heading', 'how_deal_content', 'who_for_heading', 'who_for_desc',
                'locations', 'issues', 'sidebar_heading', 'sidebar_desc', 'sidebar_checks', 'backlinks',
            ]);
        });

        Schema::table('seo_metadata', function (Blueprint $table) {
            $table->dropColumn(['backlinks', 'target_keywords', 'seo_score']);
        });
    }
};
