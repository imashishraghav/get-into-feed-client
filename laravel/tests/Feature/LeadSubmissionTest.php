<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_inbound_lead_requires_email_or_phone(): void
    {
        $response = $this->postJson('/api/v1/leads', [
            'name' => 'Test Lead',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'phone']);
    }

    public function test_inbound_lead_submission_with_phone_succeeds(): void
    {
        $response = $this->postJson('/api/v1/leads', [
            'name' => 'Valid Client',
            'phone' => '+919876543210',
            'service' => 'SEO Services',
            'message' => 'Need search ranking improvements in Delhi NCR.',
            'consent' => true,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('crm_leads', [
            'name' => 'Valid Client',
            'phone' => '+919876543210',
        ]);
    }

    public function test_honeypot_bot_submission_is_intercepted(): void
    {
        $response = $this->postJson('/api/v1/leads', [
            'name' => 'Spam Bot',
            'email' => 'bot@spam.com',
            'phone' => '1234567890',
            'hp_field' => 'bot_entered_value',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        // Honeypot leads must never be saved into database
        $this->assertDatabaseMissing('crm_leads', [
            'email' => 'bot@spam.com',
        ]);
    }
}
