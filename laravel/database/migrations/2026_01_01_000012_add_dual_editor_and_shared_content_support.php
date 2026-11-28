<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Pages table
        if (Schema::hasTable('pages')) {
            Schema::table('pages', function (Blueprint $table) {
                if (! Schema::hasColumn('pages', 'content')) {
                    $table->longText('content')->nullable()->after('content_blocks');
                }
                if (! Schema::hasColumn('pages', 'editor_mode')) {
                    $table->string('editor_mode', 20)->default('classic')->nullable()->after('template');
                }
            });
        }

        // 2. Services table
        if (Schema::hasTable('services')) {
            Schema::table('services', function (Blueprint $table) {
                if (! Schema::hasColumn('services', 'content_blocks')) {
                    $table->longText('content_blocks')->nullable()->after('content');
                }
                if (! Schema::hasColumn('services', 'editor_mode')) {
                    $table->string('editor_mode', 20)->default('classic')->nullable()->after('status');
                }
            });
        }

        // 3. Blog Posts table
        if (Schema::hasTable('blog_posts')) {
            Schema::table('blog_posts', function (Blueprint $table) {
                if (! Schema::hasColumn('blog_posts', 'editor_mode')) {
                    $table->string('editor_mode', 20)->default('classic')->nullable()->after('status');
                }
            });
        }

        // 4. Case Studies table
        if (Schema::hasTable('case_studies')) {
            Schema::table('case_studies', function (Blueprint $table) {
                if (! Schema::hasColumn('case_studies', 'content')) {
                    $table->longText('content')->nullable()->after('hero_description');
                }
                if (! Schema::hasColumn('case_studies', 'content_blocks')) {
                    $table->longText('content_blocks')->nullable()->after('content');
                }
                if (! Schema::hasColumn('case_studies', 'editor_mode')) {
                    $table->string('editor_mode', 20)->default('classic')->nullable()->after('status');
                }
            });
        }

        // 5. Seed initial hardcoded core pages if pages table has zero records
        if (Schema::hasTable('pages') && DB::table('pages')->count() === 0) {
            $now = date('Y-m-d H:i:s');
            $initialPages = [
                [
                    'title' => 'About GetIntoFeed',
                    'slug' => 'about',
                    'template' => 'about',
                    'editor_mode' => 'classic',
                    'status' => 'published',
                    'published_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'content' => '<h2>We Build Marketing That People Actually Remember</h2><p>GetIntoFeed is a senior strategist-led growth studio operating across Delhi NCR and pan-India. We eliminate bloated agency layers and vanity metrics, focusing strictly on high-intent customer acquisition, creative video reels, and revenue attribution.</p>',
                ],
                [
                    'title' => 'Start a Project Consultation',
                    'slug' => 'contact',
                    'template' => 'contact',
                    'editor_mode' => 'classic',
                    'status' => 'published',
                    'published_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'content' => '<h2>Start a Direct Conversation With Our Strategy Lead</h2><p>Tell us what you sell, where you operate, and the primary bottleneck holding back your growth. We will help you scope out a practical, high-ROI sprint before spending a single rupee on ad budgets.</p>',
                ],
                [
                    'title' => 'Transparent Sprint Pricing & Retainers',
                    'slug' => 'pricing',
                    'template' => 'pricing',
                    'editor_mode' => 'classic',
                    'status' => 'published',
                    'published_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'content' => '<h2>Transparent Growth Sprints. No Mandatory Retainers.</h2><p>Choose an agile 30-day growth sprint or targeted service package with agreed deliverables, clear timelines, and direct accountability.</p>',
                ],
                [
                    'title' => 'Privacy Policy',
                    'slug' => 'privacy-policy',
                    'template' => 'default',
                    'editor_mode' => 'classic',
                    'status' => 'published',
                    'published_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'content' => '<h2>Privacy Policy & Data Protection</h2><p>GetIntoFeed Media Pvt. Ltd. is committed to protecting your personal data and commercial privacy. We do not sell or lease client data to third parties.</p>',
                ],
                [
                    'title' => 'Terms of Service',
                    'slug' => 'terms-of-service',
                    'template' => 'default',
                    'editor_mode' => 'classic',
                    'status' => 'published',
                    'published_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                    'content' => '<h2>Commercial Terms of Engagement</h2><p>All client scopes, campaign deliverables, and billing milestones are agreed in written sprint agreements. Advertising platform spend is paid directly to advertising channels (Google, Meta).</p>',
                ],
            ];

            foreach ($initialPages as $pageData) {
                DB::table('pages')->insert($pageData);
            }
        }
    }

    public function down(): void
    {
        // SQLite does not drop columns easily in older versions, safe no-op or drop if supported
        if (Schema::hasTable('pages')) {
            Schema::table('pages', function (Blueprint $table) {
                if (Schema::hasColumn('pages', 'content')) {
                    $table->dropColumn('content');
                }
                if (Schema::hasColumn('pages', 'editor_mode')) {
                    $table->dropColumn('editor_mode');
                }
            });
        }
    }
};
