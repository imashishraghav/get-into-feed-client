<?php

namespace Tests\Feature;

use App\Jobs\SyncLeadToCrmJob;
use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class CrmSyncPipelineTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('services.crm.secret', 'test-crm-hmac-secret-xyz-98765');
        Config::set('services.crm.endpoint', 'https://crm.test/api/v1/inbound-leads');
        Config::set('services.crm.timeout', 5);
    }

    public function test_lead_ingestion_saves_lead_locally_and_dispatches_sync_job(): void
    {
        Queue::fake([SyncLeadToCrmJob::class]);

        $payload = [
            'name' => 'Aditya Sharma',
            'email' => 'aditya@example.com',
            'phone' => '+91 98765 43210',
            'company' => 'Acme Direct Growth',
            'service' => 'Paid Ads',
            'message' => 'Need help scaling Meta Ads retainers.',
            'utm_source' => 'google',
            'utm_medium' => 'cpc',
            'utm_campaign' => 'q4_search_delhi',
            'consent' => true,
        ];

        $response = $this->postJson('/api/v1/leads', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('crm_leads', [
            'email' => 'aditya@example.com',
            'company' => 'Acme Direct Growth',
            'crm_sync_status' => 'pending',
            'is_test' => 0,
        ]);

        $lead = Lead::where('email', 'aditya@example.com')->first();
        $this->assertNotNull($lead->uuid);

        Queue::assertPushed(SyncLeadToCrmJob::class, function (SyncLeadToCrmJob $job) use ($lead) {
            return $job->lead->id === $lead->id;
        });
    }

    public function test_sync_job_posts_to_crm_with_hmac_and_idempotency_key_and_marks_synced(): void
    {
        Http::fake([
            'https://crm.test/api/v1/inbound-leads' => Http::response([
                'success' => true,
                'lead_id' => 'CRM-LEAD-999',
            ], 200),
        ]);

        $lead = Lead::create([
            'name' => 'Meera Kapoor',
            'email' => 'meera@kapoorgrowth.in',
            'phone' => '+91 98111 22233',
            'company' => 'Kapoor Growth',
            'status' => 'New',
            'crm_sync_status' => 'pending',
        ]);

        $job = new SyncLeadToCrmJob($lead);
        $job->handle();

        Http::assertSent(function ($request) use ($lead) {
            $hasIdempotency = $request->header('Idempotency-Key')[0] === $lead->uuid;
            $hasTimestamp = ! empty($request->header('X-Timestamp')[0]);
            $hasSignature = ! empty($request->header('X-Signature')[0]);

            return $hasIdempotency && $hasTimestamp && $hasSignature;
        });

        $lead->refresh();
        $this->assertEquals('synced', $lead->crm_sync_status);
        $this->assertEquals('CRM-LEAD-999', $lead->crm_lead_id);
        $this->assertNotNull($lead->crm_synced_at);
        $this->assertNull($lead->crm_sync_error);
    }

    public function test_sync_job_treats_409_conflict_as_successful_idempotent_sync(): void
    {
        Http::fake([
            'https://crm.test/*' => Http::response([
                'message' => 'Duplicate idempotency key detected',
                'id' => 'EXISTING-CRM-409',
            ], 409),
        ]);

        $lead = Lead::create([
            'name' => 'Rohan Sen',
            'email' => 'rohan@senmedia.in',
            'phone' => '+91 99999 88888',
            'company' => 'Sen Media',
            'status' => 'New',
            'crm_sync_status' => 'pending',
        ]);

        $job = new SyncLeadToCrmJob($lead);
        $job->handle();

        $lead->refresh();
        $this->assertEquals('synced', $lead->crm_sync_status);
        $this->assertEquals('EXISTING-CRM-409', $lead->crm_lead_id);
    }

    public function test_sync_job_retains_pending_status_and_logs_error_on_500_server_error(): void
    {
        Http::fake([
            'https://crm.test/*' => Http::response('Database connection timed out in CRM', 500),
        ]);

        $lead = Lead::create([
            'name' => 'Failing Prospect',
            'email' => 'failing@prospect.in',
            'phone' => '+91 98888 77777',
            'status' => 'New',
            'crm_sync_status' => 'pending',
        ]);

        $job = new SyncLeadToCrmJob($lead);

        try {
            $job->handle();
            $this->fail('Expected exception was not thrown on HTTP 500.');
        } catch (\Throwable $e) {
            $this->assertStringContainsString('500', $e->getMessage());
        }

        $lead->refresh();
        $this->assertEquals('pending', $lead->crm_sync_status);
        $this->assertStringContainsString('500', $lead->crm_sync_error);
        $this->assertEquals(1, $lead->crm_sync_attempts);
    }

    public function test_webhook_rejects_missing_or_bad_hmac_signature(): void
    {
        $responseMissing = $this->postJson('/api/v1/webhooks/crm-status', ['status' => 'Contacted']);
        $responseMissing->assertStatus(401);

        $payload = json_encode(['status' => 'Contacted']);
        $timestamp = time();

        $responseBadSig = $this->call(
            'POST',
            '/api/v1/webhooks/crm-status',
            [],
            [],
            [],
            [
                'HTTP_X_TIMESTAMP' => (string) $timestamp,
                'HTTP_X_SIGNATURE' => 'invalid-hmac-sha256-hash-signature',
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ],
            $payload
        );

        $responseBadSig->assertStatus(403);
    }

    public function test_webhook_rejects_replay_attack_older_than_5_minutes(): void
    {
        $payload = json_encode(['status' => 'Contacted']);
        $expiredTimestamp = time() - 400; // 6.6 minutes ago
        $secret = config('services.crm.secret');
        $signature = hash_hmac('sha256', $expiredTimestamp.'.'.$payload, $secret);

        $response = $this->call(
            'POST',
            '/api/v1/webhooks/crm-status',
            [],
            [],
            [],
            [
                'HTTP_X_TIMESTAMP' => (string) $expiredTimestamp,
                'HTTP_X_SIGNATURE' => $signature,
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ],
            $payload
        );

        $response->assertStatus(401);
        $this->assertStringContainsString('replay', $response->json('error'));
    }

    public function test_webhook_updates_lead_status_on_valid_signature(): void
    {
        $lead = Lead::create([
            'name' => 'Webhook Prospect',
            'email' => 'webhook@prospect.in',
            'phone' => '+91 97777 66666',
            'status' => 'New',
            'crm_sync_status' => 'synced',
        ]);

        $payload = json_encode([
            'uuid' => $lead->uuid,
            'status' => 'Qualified',
            'crm_lead_id' => 'REMOTE-CRM-777',
        ]);

        $timestamp = time();
        $secret = config('services.crm.secret');
        $signature = hash_hmac('sha256', $timestamp.'.'.$payload, $secret);

        $response = $this->call(
            'POST',
            '/api/v1/webhooks/crm-status',
            [],
            [],
            [],
            [
                'HTTP_X_TIMESTAMP' => (string) $timestamp,
                'HTTP_X_SIGNATURE' => $signature,
                'CONTENT_TYPE' => 'application/json',
                'HTTP_ACCEPT' => 'application/json',
            ],
            $payload
        );

        $response->assertStatus(200);
        $this->assertTrue($response->json('success'));

        $lead->refresh();
        $this->assertEquals('Qualified', $lead->status);
        $this->assertEquals('REMOTE-CRM-777', $lead->crm_lead_id);
    }
}
