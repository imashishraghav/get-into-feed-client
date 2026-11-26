<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('user_trusted_devices')) {
            Schema::create('user_trusted_devices', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('token_id', 64)->unique();
                $table->string('device_name', 120);
                $table->string('location_hint', 120)->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamp('expires_at');
                $table->timestamp('revoked_at')->nullable();
                $table->timestamps();

                $table->index(['user_id', 'revoked_at', 'expires_at'], 'utd_user_active_idx');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('user_trusted_devices');
    }
};
