<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. CRM Companies
        Schema::create('crm_companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('industry')->nullable();
            $table->string('website')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // 2. CRM Contacts
        Schema::create('crm_contacts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('job_title')->nullable();
            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('crm_companies')->onDelete('set null');
        });

        // 3. CRM Leads (Inbound consultations, pricing forms, audits)
        Schema::create('crm_leads', function (Blueprint $table) {
            $table->id();
            $table->string('lead_code')->unique(); // e.g. LEAD-9C95CF8F
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('whatsapp')->nullable();
            $table->string('company')->nullable();
            $table->string('website')->nullable();
            $table->string('interested_service')->nullable();
            $table->text('message')->nullable();
            $table->string('budget')->nullable();
            $table->string('source')->default('Website Inbound');
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_term')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('status')->default('New'); // New, Contacted, Qualified, Proposal, Negotiation, Won, Lost, Spam
            $table->string('priority')->default('Medium'); // Low, Medium, High, Urgent
            $table->unsignedBigInteger('assigned_user_id')->nullable();
            $table->timestamp('next_follow_up_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('assigned_user_id')->references('id')->on('users')->onDelete('set null');
        });

        // 4. CRM Opportunities
        Schema::create('crm_opportunities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('lead_id')->nullable();
            $table->string('title');
            $table->decimal('value', 12, 2)->default(0.00);
            $table->string('stage')->default('Discovery'); // Discovery, Proposal, Negotiation, Closed Won, Closed Lost
            $table->integer('probability')->default(20);
            $table->date('expected_close_at')->nullable();
            $table->timestamps();

            $table->foreign('company_id')->references('id')->on('crm_companies')->onDelete('set null');
            $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('set null');
        });

        // 5. CRM Activities
        Schema::create('crm_activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lead_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('type'); // Call, Email, Meeting, WhatsApp, Note
            $table->text('summary');
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });

        // 6. CRM Notes
        Schema::create('crm_notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lead_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('content');
            $table->timestamps();

            $table->foreign('lead_id')->references('id')->on('crm_leads')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_notes');
        Schema::dropIfExists('crm_activities');
        Schema::dropIfExists('crm_opportunities');
        Schema::dropIfExists('crm_leads');
        Schema::dropIfExists('crm_contacts');
        Schema::dropIfExists('crm_companies');
    }
};
