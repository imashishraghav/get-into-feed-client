<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('blog_posts')) {
            return;
        }

        Schema::table('blog_posts', function (Blueprint $table) {
            if (! Schema::hasColumn('blog_posts', 'featured_image_alt')) {
                $table->string('featured_image_alt')->nullable()->after('featured_media_id');
            }
            if (! Schema::hasColumn('blog_posts', 'focus_keyphrase')) {
                $table->string('focus_keyphrase')->nullable()->after('tags');
            }
            if (! Schema::hasColumn('blog_posts', 'secondary_keyphrases')) {
                $table->json('secondary_keyphrases')->nullable()->after('focus_keyphrase');
            }
            if (! Schema::hasColumn('blog_posts', 'seo_title')) {
                $table->string('seo_title')->nullable()->after('secondary_keyphrases');
            }
            if (! Schema::hasColumn('blog_posts', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('seo_title');
            }
            if (! Schema::hasColumn('blog_posts', 'canonical_url')) {
                $table->string('canonical_url')->nullable()->after('meta_description');
            }
            if (! Schema::hasColumn('blog_posts', 'schema_type')) {
                $table->string('schema_type')->default('BlogPosting')->after('canonical_url');
            }
            if (! Schema::hasColumn('blog_posts', 'robots_index')) {
                $table->boolean('robots_index')->default(true)->after('schema_type');
            }
            if (! Schema::hasColumn('blog_posts', 'robots_follow')) {
                $table->boolean('robots_follow')->default(true)->after('robots_index');
            }
            if (! Schema::hasColumn('blog_posts', 'faq_items')) {
                $table->json('faq_items')->nullable()->after('robots_follow');
            }
            if (! Schema::hasColumn('blog_posts', 'og_title')) {
                $table->string('og_title')->nullable()->after('faq_items');
            }
            if (! Schema::hasColumn('blog_posts', 'og_description')) {
                $table->text('og_description')->nullable()->after('og_title');
            }
            if (! Schema::hasColumn('blog_posts', 'seo_score')) {
                $table->unsignedTinyInteger('seo_score')->default(0)->after('og_description');
            }
            if (! Schema::hasColumn('blog_posts', 'word_count')) {
                $table->unsignedInteger('word_count')->default(0)->after('seo_score');
            }
            if (! Schema::hasColumn('blog_posts', 'reading_time')) {
                $table->unsignedSmallInteger('reading_time')->default(0)->after('word_count');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('blog_posts')) {
            return;
        }

        $columns = [
            'featured_image_alt',
            'focus_keyphrase',
            'secondary_keyphrases',
            'seo_title',
            'meta_description',
            'canonical_url',
            'schema_type',
            'robots_index',
            'robots_follow',
            'faq_items',
            'og_title',
            'og_description',
            'seo_score',
            'word_count',
            'reading_time',
        ];

        $toDrop = array_values(array_filter(
            $columns,
            fn (string $column): bool => Schema::hasColumn('blog_posts', $column)
        ));

        if ($toDrop !== []) {
            Schema::table('blog_posts', function (Blueprint $table) use ($toDrop) {
                $table->dropColumn($toDrop);
            });
        }
    }
};
