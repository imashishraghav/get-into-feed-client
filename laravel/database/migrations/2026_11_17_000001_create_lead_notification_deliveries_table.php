<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_notification_deliveries', function (Blueprint $table) {
            $table->id();
            $table->string('lead_key', 191);
            $table->string('channel', 20);
            $table->string('status', 20)->default('pending');
            $table->unsignedSmallInteger('attempts')->default(0);
            $table->string('provider_message_id')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->unique(['lead_key', 'channel']);
            $table->index(['status', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_notification_deliveries');
    }
};
