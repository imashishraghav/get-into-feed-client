<?php

namespace Tests\Feature;

use Tests\TestCase;

class SsrRoutingTest extends TestCase
{
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
        $response->assertSee('<h1>Transparent Growth Sprints &amp; Retainers</h1>', false);
        $response->assertDontSee('<h1>Your business is online. But is it getting noticed?</h1>', false);
    }

    public function test_crm_leads_api_rejects_unauthenticated_requests(): void
    {
        $response = $this->getJson('/api/v1/crm/leads');

        $response->assertStatus(401);
    }
}
