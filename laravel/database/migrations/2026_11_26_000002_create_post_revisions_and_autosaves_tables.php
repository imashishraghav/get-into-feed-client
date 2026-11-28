<?php

use App\Models\BlogPost;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('post_revisions')) {
            Schema::create('post_revisions', function (Blueprint $table) {
                $table->id();
                $table->uuid('uuid')->unique();
                $table->foreignId('blog_post_id')->constrained('blog_posts')->cascadeOnDelete();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->unsignedInteger('revision_number')->default(1);
                $table->string('type', 32)->default('manual');
                $table->string('title');
                $table->string('slug')->nullable();
                $table->text('excerpt')->nullable();
                $table->longText('content_html')->nullable();
                $table->json('content_json')->nullable();
                $table->json('meta_snapshot')->nullable();
                $table->string('change_summary')->nullable();
                $table->unsignedInteger('version_at_capture')->default(1);
                $table->timestamp('created_at')->nullable();

                $table->index(['blog_post_id', 'revision_number'], 'post_rev_post_num_idx');
                $table->index(['blog_post_id', 'created_at'], 'post_rev_post_created_idx');
            });
        }

        if (! Schema::hasTable('post_autosaves')) {
            Schema::create('post_autosaves', function (Blueprint $table) {
                $table->id();
                $table->foreignId('blog_post_id')->constrained('blog_posts')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('title')->nullable();
                $table->text('excerpt')->nullable();
                $table->longText('content_html')->nullable();
                $table->json('content_json')->nullable();
                $table->json('meta_snapshot')->nullable();
                $table->unsignedInteger('base_version')->default(1);
                $table->timestamps();

                $table->unique(['blog_post_id', 'user_id'], 'post_autosaves_post_user_unique');
            });
        }

        // Backfill legacy polymorphic revisions for BlogPost safely when present
        if (Schema::hasTable('revisions')) {
            DB::table('revisions')
                ->where('revisable_type', BlogPost::class)
                ->orderBy('id')
                ->chunkById(50, function ($legacyRows): void {
                    foreach ($legacyRows as $row) {
                        $postExists = DB::table('blog_posts')->where('id', $row->revisable_id)->exists();
                        if (! $postExists) {
                            continue;
                        }

                        $payload = json_decode((string) $row->payload, true);
                        if (! is_array($payload)) {
                            $payload = [];
                        }

                        DB::table('post_revisions')->insert([
                            'uuid' => (string) Str::uuid(),
                            'blog_post_id' => $row->revisable_id,
                            'user_id' => $row->user_id,
                            'revision_number' => (int) ($row->version_number ?: 1),
                            'type' => 'manual',
                            'title' => (string) ($payload['title'] ?? 'Migrated Revision'),
                            'slug' => $payload['slug'] ?? null,
                            'excerpt' => $payload['excerpt'] ?? null,
                            'content_html' => $payload['content_html'] ?? ($payload['content'] ?? null),
                            'content_json' => isset($payload['content_json']) ? json_encode($payload['content_json']) : null,
                            'meta_snapshot' => json_encode([
                                'category' => $payload['category'] ?? null,
                                'tags' => $payload['tags'] ?? [],
                                'meta_title' => $payload['meta_title'] ?? ($payload['seo_title'] ?? null),
                                'meta_description' => $payload['meta_description'] ?? null,
                                'canonical_url' => $payload['canonical_url'] ?? null,
                                'faq_json' => $payload['faq_json'] ?? ($payload['faq_items'] ?? []),
                                'visibility' => $payload['visibility'] ?? 'public',
                            ]),
                            'change_summary' => 'Backfilled from legacy revisions',
                            'version_at_capture' => (int) ($payload['version'] ?? ($row->version_number ?: 1)),
                            'created_at' => $row->created_at ?? now(),
                        ]);
                    }
                });
        }

        // Snapshot all existing blog_posts that have no entry in post_revisions yet
        if (Schema::hasTable('blog_posts')) {
            DB::table('blog_posts')
                ->orderBy('id')
                ->chunkById(50, function ($posts): void {
                    foreach ($posts as $post) {
                        $hasRevision = DB::table('post_revisions')
                            ->where('blog_post_id', $post->id)
                            ->exists();

                        if ($hasRevision) {
                            continue;
                        }

                        DB::table('post_revisions')->insert([
                            'uuid' => (string) Str::uuid(),
                            'blog_post_id' => $post->id,
                            'user_id' => $post->author_id,
                            'revision_number' => 1,
                            'type' => 'manual',
                            'title' => (string) $post->title,
                            'slug' => $post->slug,
                            'excerpt' => $post->excerpt,
                            'content_html' => $post->content_html ?? $post->content,
                            'content_json' => $post->content_json,
                            'meta_snapshot' => json_encode([
                                'status' => $post->status,
                                'visibility' => $post->visibility ?? 'public',
                                'category' => $post->category,
                                'tags' => $post->tags ? json_decode((string) $post->tags, true) : [],
                                'meta_title' => $post->meta_title ?? $post->seo_title,
                                'meta_description' => $post->meta_description,
                                'canonical_url' => $post->canonical_url,
                                'og_image' => $post->og_image,
                                'faq_json' => $post->faq_json ? json_decode((string) $post->faq_json, true) : ($post->faq_items ? json_decode((string) $post->faq_items, true) : []),
                                'featured_media_id' => $post->featured_media_id,
                                'featured_image_alt' => $post->featured_image_alt,
                            ]),
                            'change_summary' => 'Pre-upgrade baseline snapshot',
                            'version_at_capture' => (int) ($post->version ?: 1),
                            'created_at' => $post->updated_at ?? ($post->created_at ?? now()),
                        ]);
                    }
                });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('post_autosaves');
        Schema::dropIfExists('post_revisions');
    }
};
