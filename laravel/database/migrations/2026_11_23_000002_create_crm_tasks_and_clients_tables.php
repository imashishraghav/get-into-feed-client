<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. CRM Tasks (SLA Response, Follow-ups, Callbacks, Proposals)
        if (! Schema::hasTable('crm_tasks')) {
            Schema::create('crm_tasks', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('lead_id')->nullable()->index();
                $table->unsignedBigInteger('client_id')->nullable()->index();
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('type', 50)->default('Follow-up'); // SLA, Call, Meeting, Proposal, Review
                $table->string('priority', 20)->default('Medium'); // Urgent, High, Medium, Low
                $table->string('status', 30)->default('Pending'); // Pending, In Progress, Completed, Cancelled
                $table->timestamp('due_at')->nullable()->index();
                $table->timestamp('completed_at')->nullable();
                $table->unsignedBigInteger('assigned_user_id')->nullable()->index();
                $table->timestamps();

                $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('cascade');
                $table->foreign('assigned_user_id')->references('id')->on('users')->onDelete('set null');
            });
        }

        // 2. CRM Retained Clients (Paying Clients with Retainer / MRR Tracking)
        if (! Schema::hasTable('crm_retained_clients')) {
            Schema::create('crm_retained_clients', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('lead_id')->nullable()->index();
                $table->string('name');
                $table->string('company_name');
                $table->string('email')->nullable();
                $table->string('phone')->nullable();
                $table->string('website')->nullable();
                $table->decimal('monthly_retainer', 12, 2)->default(0.00);
                $table->string('currency', 10)->default('INR');
                $table->string('status', 30)->default('Onboarding'); // Onboarding, Active, Paused, Churned
                $table->date('start_date')->nullable();
                $table->string('primary_service')->nullable();
                $table->text('notes')->nullable();
                $table->unsignedBigInteger('assigned_user_id')->nullable()->index();
                $table->timestamps();

                $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('set null');
                $table->foreign('assigned_user_id')->references('id')->on('users')->onDelete('set null');
            });
        }

        // 3. CRM Lead Events (Audit Trail & Activity Timeline)
        if (! Schema::hasTable('crm_lead_events')) {
            Schema::create('crm_lead_events', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('lead_id')->index();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('event_type', 50); // created, status_change, score_calculated, task_created, task_completed, note_added, alert_sent, converted
                $table->text('description');
                $table->json('properties')->nullable();
                $table->timestamp('created_at')->useCurrent()->index();

                $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            });
        }

        // 4. Add converted_client_id to crm_leads if missing
        if (! Schema::hasColumn('crm_leads', 'converted_client_id')) {
            Schema::table('crm_leads', function (Blueprint $table) {
                $table->unsignedBigInteger('converted_client_id')->nullable()->after('sla_due_at')->index();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('crm_leads', 'converted_client_id')) {
            Schema::table('crm_leads', function (Blueprint $table) {
                $table->dropColumn('converted_client_id');
            });
        }
        Schema::dropIfExists('crm_lead_events');
        Schema::dropIfExists('crm_retained_clients');
        Schema::dropIfExists('crm_tasks');
    }
};
