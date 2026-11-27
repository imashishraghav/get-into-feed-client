<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Global Settings
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group'); // general, branding, header, footer, contact, social, email, notifications, integrations, api
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });

        // 2. Immutable Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('user_email')->nullable();
            $table->string('action'); // CREATE, UPDATE, DELETE, PUBLISH, UNPUBLISH, LOGIN, LOGOUT, PERMISSION_CHANGE, EXPORT
            $table->string('auditable_type')->nullable();
            $table->unsignedBigInteger('auditable_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['action', 'created_at']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('settings');
    }
};
