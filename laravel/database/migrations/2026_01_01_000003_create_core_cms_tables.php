<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Pages
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('template')->default('default'); // homepage, about, contact, custom
            $table->json('content_blocks')->nullable();
            $table->unsignedBigInteger('featured_media_id')->nullable();
            $table->string('status')->default('draft'); // draft, review, approved, scheduled, published
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_for')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('featured_media_id')->references('id')->on('media')->onDelete('set null');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('set null');
        });

        // 2. Services (8 Core Disciplines)
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category'); // Organic Search, Paid Performance, Short-Form Video, etc.
            $table->text('short_description');
            $table->string('pricing_tier')->nullable();
            $table->string('timeline')->nullable();
            $table->string('icon_name')->default('Zap');
            $table->text('overview')->nullable();
            $table->json('what_we_do')->nullable();
            $table->json('deliverables')->nullable();
            $table->json('process_steps')->nullable();
            $table->string('hero_heading')->nullable();
            $table->text('hero_description')->nullable();
            $table->unsignedBigInteger('hero_media_id')->nullable();
            $table->string('cta_label')->default('Start a Project');
            $table->string('cta_url')->default('/contact');
            $table->string('status')->default('draft'); // draft, review, approved, scheduled, published
            $table->integer('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_for')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('hero_media_id')->references('id')->on('media')->onDelete('set null');
        });

        // 3. Case Studies (7 Growth Studies)
        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('project_name');
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('sub_tag')->nullable();
            $table->json('filter_categories')->nullable();
            $table->string('year')->default('2026');
            $table->string('headline_prefix')->nullable();
            $table->string('headline_highlight')->nullable();
            $table->string('headline_suffix')->nullable();
            $table->text('hero_description')->nullable();
            $table->unsignedBigInteger('hero_media_id')->nullable();
            $table->text('challenge')->nullable();
            $table->json('challenge_paragraphs')->nullable();
            $table->json('obstacles')->nullable();
            $table->text('strategy')->nullable();
            $table->json('strategy_pillars')->nullable();
            $table->json('execution_gallery')->nullable(); // array of media_ids
            $table->json('results_metrics')->nullable(); // array of { label, value }
            $table->unsignedBigInteger('testimonial_id')->nullable();
            $table->string('status')->default('draft'); // draft, review, approved, scheduled, published
            $table->integer('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_for')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('hero_media_id')->references('id')->on('media')->onDelete('set null');
        });

        Schema::create('case_study_services', function (Blueprint $table) {
            $table->unsignedBigInteger('case_study_id');
            $table->unsignedBigInteger('service_id');
            $table->primary(['case_study_id', 'service_id']);
            $table->foreign('case_study_id')->references('id')->on('case_studies')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
        });

        // 4. Blog Posts / Feed Notes (10 Articles)
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->unsignedBigInteger('featured_media_id')->nullable();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('author_name')->default('Rahul Sharma');
            $table->string('author_role')->default('Head of Growth');
            $table->string('category')->default('Growth Playbook');
            $table->json('tags')->nullable();
            $table->longText('content')->nullable();
            $table->json('content_blocks')->nullable();
            $table->string('read_time')->default('5 min read');
            $table->boolean('is_featured')->default(false);
            $table->string('status')->default('draft'); // draft, review, approved, scheduled, published
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_for')->nullable();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('featured_media_id')->references('id')->on('media')->onDelete('set null');
            $table->foreign('author_id')->references('id')->on('users')->onDelete('set null');
        });

        // 5. Testimonials (6 Verified Client Reviews)
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('client_role');
            $table->string('company');
            $table->text('quote');
            $table->integer('rating')->default(5);
            $table->string('service_tag')->nullable();
            $table->string('result_metric')->nullable();
            $table->unsignedBigInteger('avatar_media_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('status')->default('draft');
            $table->timestamps();

            $table->foreign('avatar_media_id')->references('id')->on('media')->onDelete('set null');
        });

        // 6. Clients
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('logo_media_id')->nullable();
            $table->string('website_url')->nullable();
            $table->string('industry')->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('status')->default('draft');
            $table->timestamps();

            $table->foreign('logo_media_id')->references('id')->on('media')->onDelete('set null');
        });

        // 7. Team Members (6 Leadership Specialists)
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->text('bio')->nullable();
            $table->json('expertise')->nullable();
            $table->unsignedBigInteger('avatar_media_id')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('status')->default('draft');
            $table->timestamps();

            $table->foreign('avatar_media_id')->references('id')->on('media')->onDelete('set null');
        });

        // 8. FAQs (7 Categorized Questions)
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category')->default('General');
            $table->text('question');
            $table->text('answer');
            $table->integer('sort_order')->default(0);
            $table->string('status')->default('draft');
            $table->timestamps();
        });

        // 9. Awards (4 Verified Honors)
        Schema::create('awards', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('organization');
            $table->string('year');
            $table->string('category');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('badge_media_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->string('status')->default('draft');
            $table->timestamps();

            $table->foreign('badge_media_id')->references('id')->on('media')->onDelete('set null');
        });

        // 10. Careers
        Schema::create('careers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('department');
            $table->string('location')->default('Gurgaon, India / Remote');
            $table->string('type')->default('Full-Time');
            $table->text('description');
            $table->json('requirements')->nullable();
            $table->json('benefits')->nullable();
            $table->string('status')->default('draft');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 11. Legal Pages
        Schema::create('legal_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->timestamp('last_updated_at')->nullable();
            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legal_pages');
        Schema::dropIfExists('careers');
        Schema::dropIfExists('awards');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('clients');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('case_study_services');
        Schema::dropIfExists('case_studies');
        Schema::dropIfExists('services');
        Schema::dropIfExists('pages');
    }
};
