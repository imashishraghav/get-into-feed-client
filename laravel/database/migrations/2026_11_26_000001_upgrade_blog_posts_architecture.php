<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('blog_posts')) {
            return;
        }

        Schema::table('blog_posts', function (Blueprint $table) {
            if (! Schema::hasColumn('blog_posts', 'uuid')) {
                $table->uuid('uuid')->nullable()->unique('blog_posts_uuid_unique')->after('id');
            }
            if (! Schema::hasColumn('blog_posts', 'content_html')) {
                $table->longText('content_html')->nullable()->after('content');
            }
            if (! Schema::hasColumn('blog_posts', 'content_json')) {
                $table->json('content_json')->nullable()->after('content_html');
            }
            if (! Schema::hasColumn('blog_posts', 'visibility')) {
                $table->string('visibility', 20)->default('public')->after('status');
            }
            if (! Schema::hasColumn('blog_posts', 'scheduled_at')) {
                $table->timestamp('scheduled_at')->nullable()->after('published_at');
            }
            if (! Schema::hasColumn('blog_posts', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('seo_title');
            }
            if (! Schema::hasColumn('blog_posts', 'og_image')) {
                $table->string('og_image', 500)->nullable()->after('og_description');
            }
            if (! Schema::hasColumn('blog_posts', 'faq_json')) {
                $table->json('faq_json')->nullable()->after('faq_items');
            }
            if (! Schema::hasColumn('blog_posts', 'schema_json')) {
                $table->json('schema_json')->nullable()->after('faq_json');
            }
            if (! Schema::hasColumn('blog_posts', 'readability_score')) {
                $table->unsignedTinyInteger('readability_score')->nullable()->after('seo_score');
            }
            if (! Schema::hasColumn('blog_posts', 'version')) {
                $table->unsignedInteger('version')->default(1)->after('views_count');
            }
        });

        // Backfill normalized architecture columns idempotently from legacy columns
        DB::table('blog_posts')
            ->orderBy('id')
            ->chunkById(100, function ($posts): void {
                foreach ($posts as $post) {
                    $updates = [];

                    if (empty($post->uuid)) {
                        $updates['uuid'] = (string) Str::uuid();
                    }
                    if (empty($post->content_html) && ! empty($post->content)) {
                        $updates['content_html'] = $post->content;
                    }
                    if (empty($post->scheduled_at) && ! empty($post->scheduled_for)) {
                        $updates['scheduled_at'] = $post->scheduled_for;
                    }
                    if (empty($post->meta_title) && ! empty($post->seo_title)) {
                        $updates['meta_title'] = $post->seo_title;
                    }
                    if (empty($post->faq_json) && ! empty($post->faq_items)) {
                        $updates['faq_json'] = $post->faq_items;
                    }
                    if (empty($post->visibility)) {
                        $updates['visibility'] = 'public';
                    }
                    if (empty($post->version) || (int) $post->version < 1) {
                        $updates['version'] = 1;
                    }

                    if ($updates !== []) {
                        DB::table('blog_posts')->where('id', $post->id)->update($updates);
                    }
                }
            });

        // Add performance indexes if not already present
        $indexes = [
            'blog_posts_status_idx' => ['status'],
            'blog_posts_visibility_idx' => ['visibility'],
            'blog_posts_published_at_idx' => ['published_at'],
            'blog_posts_scheduled_at_idx' => ['scheduled_at'],
            'blog_posts_author_id_idx' => ['author_id'],
            'blog_posts_category_idx' => ['category'],
            'blog_posts_pub_feed_idx' => ['status', 'visibility', 'published_at'],
            'blog_posts_deleted_at_idx' => ['deleted_at'],
        ];

        Schema::table('blog_posts', function (Blueprint $table) use ($indexes): void {
            foreach ($indexes as $name => $columns) {
                if (! $this->indexExists('blog_posts', $name)) {
                    $table->index($columns, $name);
                }
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('blog_posts')) {
            return;
        }

        $indexesToDrop = [
            'blog_posts_status_idx',
            'blog_posts_visibility_idx',
            'blog_posts_published_at_idx',
            'blog_posts_scheduled_at_idx',
            'blog_posts_author_id_idx',
            'blog_posts_category_idx',
            'blog_posts_pub_feed_idx',
            'blog_posts_deleted_at_idx',
            'blog_posts_uuid_unique',
        ];

        Schema::table('blog_posts', function (Blueprint $table) use ($indexesToDrop): void {
            foreach ($indexesToDrop as $name) {
                if ($this->indexExists('blog_posts', $name)) {
                    $name === 'blog_posts_uuid_unique'
                        ? $table->dropUnique($name)
                        : $table->dropIndex($name);
                }
            }
        });

        $columns = [
            'uuid',
            'content_html',
            'content_json',
            'visibility',
            'scheduled_at',
            'meta_title',
            'og_image',
            'faq_json',
            'schema_json',
            'readability_score',
            'version',
        ];

        $toDrop = array_values(array_filter(
            $columns,
            fn (string $column): bool => Schema::hasColumn('blog_posts', $column)
        ));

        if ($toDrop !== []) {
            Schema::table('blog_posts', function (Blueprint $table) use ($toDrop): void {
                $table->dropColumn($toDrop);
            });
        }
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $driver = DB::getDriverName();

        if ($driver === 'sqlite') {
            $rows = DB::select("SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = ? AND name = ?", [$table, $indexName]);

            return count($rows) > 0;
        }

        $database = DB::getDatabaseName();
        $rows = DB::select(
            'SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1',
            [$database, $table, $indexName]
        );

        return count($rows) > 0;
    }
};
