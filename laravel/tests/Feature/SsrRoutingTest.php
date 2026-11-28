<?php

namespace Tests\Feature;

use App\Jobs\SyncLeadToCrmJob;
use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SsrRoutingTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_returns_unique_server_rendered_h1(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('<h1>Your business is online. But is it getting noticed?</h1>', false);
    }

    public function test_services_hub_returns_unique_server_rendered_h1(): void
    {
        $response = $this->get('/services');

        $response->assertStatus(200);
        $response->assertSee('<h1>Growth &amp; Performance Marketing Services in Delhi NCR</h1>', false);
        $response->assertDontSee('<h1>Your business is online. But is it getting noticed?</h1>', false);
    }

    public function test_pricing_page_returns_unique_server_rendered_h1(): void
    {
        $response = $this->get('/pricing');

        $response->assertStatus(200);
        $response->assertSee('<h1>Pricing &amp; Growth Sprints — Transparent Retainers</h1>', false);
        $response->assertDontSee('<h1>Your business is online. But is it getting noticed?</h1>', false);
    }

    public function test_crm_leads_api_is_removed_from_website_admin(): void
    {
        $this->getJson('/api/v1/crm/leads')->assertStatus(404);
        $this->getJson('/api/v1/crm/pipeline')->assertStatus(404);
        $this->getJson('/api/v1/crm/stats')->assertStatus(404);
        $this->getJson('/api/v1/crm/leads/1')->assertStatus(404);
        $this->assertContains($this->postJson('/api/v1/crm/auth/login', [])->status(), [404, 405]);
        $this->assertContains($this->postJson('/api/v1/crm/leads', [])->status(), [404, 405]);
        $this->assertContains($this->patchJson('/api/v1/crm/leads/1', [])->status(), [404, 405]);
    }

    public function test_crm_ingest_bridge_is_hardened_and_requires_consent(): void
    {
        Queue::fake([SyncLeadToCrmJob::class]);

        // 1. Missing or unaccepted consent must fail validation (422)
        $this->postJson('/api/v1/crm/ingest', [
            'name' => 'Aarav Mehta',
            'phone' => '9811011223',
        ])->assertStatus(422)->assertJsonValidationErrors(['consent']);

        $this->postJson('/api/v1/crm/ingest', [
            'name' => 'Aarav Mehta',
            'phone' => '9811011223',
            'consent' => false,
        ])->assertStatus(422)->assertJsonValidationErrors(['consent']);

        // 2. Honeypot trap returns opaque 201 without storing DB record
        $this->postJson('/api/v1/crm/ingest', [
            'name' => 'Spam Bot',
            'email' => 'bot@spam.example',
            'website_hp' => 'https://spam.example',
            'consent' => true,
        ])->assertStatus(201);
        $this->assertDatabaseMissing('crm_leads', ['email' => 'bot@spam.example']);

        // 3. Valid consented submission stores normalized lead without echoing PII
        $response = $this->postJson('/api/v1/crm/ingest', [
            'name' => 'Neha Kapoor',
            'phone' => '9876543210',
            'email' => 'neha@brand.in',
            'company' => 'Kapoor Naturals',
            'consent' => true,
            'consent_notice_version' => 'DPDP_2026_V1',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['success', 'lead_code', 'message'])
            ->assertJsonMissing(['email' => 'neha@brand.in', 'phone' => '+919876543210']);

        $this->assertDatabaseHas('crm_leads', [
            'email' => 'neha@brand.in',
            'phone' => '+919876543210',
            'is_test' => 0,
        ]);

        $lead = Lead::where('email', 'neha@brand.in')->first();
        $this->assertNotNull($lead->consent_at);
    }
}
