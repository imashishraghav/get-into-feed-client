<?php

namespace Tests\Feature;

use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_inbound_lead_is_created_with_is_test_false(): void
    {
        $response = $this->postJson('/api/v1/leads', [
            'name' => 'Real Prospect',
            'phone' => '+919876543210',
            'email' => 'prospect@business.com',
            'service' => 'Meta Ads Scaling',
            'message' => 'Interested in 30 day growth sprint.',
            'consent' => true,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('crm_leads', [
            'email' => 'prospect@business.com',
            'is_test' => 0,
        ]);
    }

    public function test_production_scope_excludes_test_leads(): void
    {
        // 1 genuine client lead
        Lead::create([
            'lead_code' => 'TEST-001',
            'name' => 'Genuine Client',
            'email' => 'client@client.com',
            'phone' => '+919999999991',
            'status' => 'new',
            'is_test' => false,
        ]);

        // 1 automated verification bot
        Lead::create([
            'lead_code' => 'TEST-002',
            'name' => 'Verification Bot',
            'email' => 'bot-123@getintofeed.com',
            'phone' => '+919999999992',
            'status' => 'new',
            'is_test' => true,
        ]);

        $this->assertEquals(2, Lead::count());
        $this->assertEquals(1, Lead::production()->count());
        $this->assertEquals(1, Lead::tests()->count());
        $this->assertEquals('Genuine Client', Lead::production()->first()->name);
    }

    public function test_manage_test_leads_command_in_dry_run_does_not_modify_data(): void
    {
        Lead::create([
            'lead_code' => 'BOT-001',
            'name' => 'QA Verification Bot',
            'email' => 'bot@example.com',
            'phone' => '+919999999999',
            'status' => 'new',
            'is_test' => false,
        ]);

        $this->artisan('leads:manage-test --dry-run')
            ->expectsOutputToContain('CRM Test & Bot Lead Inspector')
            ->expectsOutputToContain('DRY-RUN MODE ACTIVE')
            ->assertExitCode(0);

        // Record should remain unmodified
        $lead = Lead::where('name', 'QA Verification Bot')->first();
        $this->assertNotNull($lead);
        $this->assertFalse((bool) $lead->is_test);
    }

    public function test_manage_test_leads_command_flags_records(): void
    {
        Lead::create([
            'lead_code' => 'BOT-002',
            'name' => 'QA Verification Bot',
            'email' => 'bot@example.com',
            'phone' => '+919999999999',
            'status' => 'new',
            'is_test' => false,
        ]);

        $this->artisan('leads:manage-test --flag')
            ->expectsOutputToContain('Successfully flagged')
            ->assertExitCode(0);

        $lead = Lead::where('name', 'QA Verification Bot')->first();
        $this->assertTrue((bool) $lead->is_test);
    }
}
