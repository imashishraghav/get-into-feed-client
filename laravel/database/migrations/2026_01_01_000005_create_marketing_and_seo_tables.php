<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Polymorphic SEO Metadata
        Schema::create('seo_metadata', function (Blueprint $table) {
            $table->id();
            $table->string('seoble_type'); // App\Models\Page, App\Models\Service, etc.
            $table->unsignedBigInteger('seoble_id');
            $table->string('seo_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('focus_keyword')->nullable();
            $table->string('canonical_url')->nullable();
            $table->boolean('robots_index')->default(true);
            $table->boolean('robots_follow')->default(true);
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->unsignedBigInteger('og_media_id')->nullable();
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->unsignedBigInteger('twitter_media_id')->nullable();
            $table->string('schema_type')->default('WebPage');
            $table->json('custom_schema_json')->nullable();
            $table->boolean('in_sitemap')->default(true);
            $table->decimal('sitemap_priority', 3, 2)->default(0.80);
            $table->string('sitemap_changefreq')->default('monthly');
            $table->timestamps();

            $table->unique(['seoble_type', 'seoble_id']);
            $table->foreign('og_media_id')->references('id')->on('media')->onDelete('set null');
            $table->foreign('twitter_media_id')->references('id')->on('media')->onDelete('set null');
        });

        // 2. 301 / 302 URL Redirects
        Schema::create('redirects', function (Blueprint $table) {
            $table->id();
            $table->string('source_url')->unique();
            $table->string('target_url');
            $table->integer('status_code')->default(301);
            $table->unsignedBigInteger('hits')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Marketing Campaigns & UTM Tracking
        Schema::create('marketing_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('utm_source');
            $table->string('utm_medium');
            $table->string('utm_campaign');
            $table->string('utm_term')->nullable();
            $table->string('utm_content')->nullable();
            $table->decimal('budget', 12, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->default('active'); // active, paused, completed
            $table->timestamps();
        });

        // 4. Newsletter Subscribers
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('source')->default('Website Footer');
            $table->string('status')->default('subscribed'); // subscribed, unsubscribed
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('subscribed_at')->useCurrent();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->timestamps();
        });

        // 5. Polymorphic Revisions Engine
        Schema::create('revisions', function (Blueprint $table) {
            $table->id();
            $table->string('revisable_type');
            $table->unsignedBigInteger('revisable_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedInteger('version_number');
            $table->json('payload');
            $table->timestamps();

            $table->index(['revisable_type', 'revisable_id', 'version_number']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('revisions');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('marketing_campaigns');
        Schema::dropIfExists('redirects');
        Schema::dropIfExists('seo_metadata');
    }
};
