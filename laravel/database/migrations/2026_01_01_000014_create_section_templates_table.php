<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('section_templates')) {
            Schema::create('section_templates', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('category')->default('General'); // Hero, Features, Proof, Pricing, FAQ, CTA
                $table->text('description')->nullable();
                $table->string('block_type')->default('rich_text');
                $table->longText('block_payload');
                $table->string('preview_image')->nullable();
                $table->unsignedInteger('usage_count')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();

                $table->index(['category', 'is_active']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('section_templates');
    }
};
