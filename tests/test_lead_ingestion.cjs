/**
 * Automated Verification for Phase 3 Lead Ingestion, Webhooks, Scoring, Dedup & SLA
 */

const assert = require('assert');

async function testIngestionPipeline() {
  console.log('🧪 Starting Phase 3 Ingestion & CRM Core Test Suite...\n');

  const { processInboundLead } = require('../crm/src/api/ingestion.js');
  const { MetaLeadAdsAdapter } = require('../crm/src/adapters/metaLeadAdsAdapter.js');
  const { findDuplicates, mergeLeads } = require('../crm/src/utils/dedup.js');
  const { getSlaStatusFromDeadline, handleSlaBreach } = require('../crm/src/utils/slaManager.js');

  // -------------------------------------------------------------
  // Test 1: Honeypot Spam Filtering
  // -------------------------------------------------------------
  console.log('Test 1: Testing Honeypot Bot Interception...');
  const botSubmission = {
    name: 'Spam Bot',
    phone: '9811099999',
    website_hp: 'http://spam-link.ru', // honeypot triggered
    email: 'bot@spam.com'
  };
  const botRes = await processInboundLead(botSubmission, []);
  assert.strictEqual(botRes.success, false);
  assert.strictEqual(botRes.isSpam, true);
  console.log('✓ Bot submission successfully intercepted and rejected via honeypot');

  // -------------------------------------------------------------
  // Test 2: Ingestion & Auto-Scoring + Routing for High-Ticket Lead
  // -------------------------------------------------------------
  console.log('\nTest 2: High-Ticket Lead Ingestion & Founder Routing...');
  const realLead = {
    name: 'Vikramaditya Singhania',
    company: 'LuxeLiving Realty',
    phone: '98110 12345',
    email: 'vikram@luxeliving.in',
    city: 'Gurugram',
    service: 'Performance Marketing & Paid Ads',
    budget_range: '₹1,80,000 / month',
    bottleneck: 'High CPL on luxury penthouses'
  };
  const leadRes = await processInboundLead(realLead, []);
  assert.strictEqual(leadRes.success, true);
  assert.strictEqual(leadRes.lead.phone, '+91 98110 12345', 'Phone must be normalized to +91');
  assert.strictEqual(leadRes.lead.ai_score, undefined, 'AI fields must be absent');
  assert.strictEqual(leadRes.lead.ai_tier, undefined, 'AI fields must be absent');
  assert.strictEqual(leadRes.lead.assigned_to, 'Ashish (Founder)', 'High-ticket must route to Founder');
  assert.strictEqual(leadRes.lead.sla_seconds_remaining, 300, '5-minute SLA must start at 300s');
  console.log('✓ High-ticket lead ingested and routed to Founder (100% AI-free)');

  // -------------------------------------------------------------
  // Test 3: Meta Lead Ads Adapter Normalization
  // -------------------------------------------------------------
  console.log('\nTest 3: Meta Lead Ads Webhook Adapter Normalization...');
  const metaAdapter = new MetaLeadAdsAdapter();
  const simulatedMeta = metaAdapter.simulateLeadSubmission({
    name: 'Sneha Kapur',
    company: 'GlowUp Skincare',
    phone: '9871123456',
    email: 'sneha@glowup.in',
    city: 'South Delhi'
  });
  assert.strictEqual(simulatedMeta.source, 'Meta Lead Ads');
  assert.strictEqual(simulatedMeta.phone, '+91 98711 23456');
  assert.strictEqual(simulatedMeta.sla_seconds_remaining, 300);
  console.log('✓ Meta Lead Ads webhook normalized with +91 and 5-min SLA trigger');

  // -------------------------------------------------------------
  // Test 4: Duplicate Detection & Collision Matching
  // -------------------------------------------------------------
  console.log('\nTest 4: Duplicate Detection by Phone & Email Collision...');
  const existingDatabase = [leadRes.lead];
  const duplicateCandidate = {
    name: 'Vikram Singhania',
    phone: '09811012345', // Same phone with leading 0
    email: 'vikram@luxeliving.in',
    company: 'LuxeLiving Realty'
  };
  const dupCheck = findDuplicates(duplicateCandidate, existingDatabase);
  assert.ok(dupCheck.length > 0, 'Duplicate must be detected');
  assert.ok(dupCheck[0].confidence >= 0.9, 'Confidence must be >= 0.9');
  console.log(`✓ Duplicate detected with ${(dupCheck[0].confidence * 100).toFixed(0)}% confidence`);

  // -------------------------------------------------------------
  // Test 5: Lead Merge
  // -------------------------------------------------------------
  console.log('\nTest 5: Lead Merge Verification...');
  const merged = mergeLeads(leadRes.lead, { id: 'secondary_lead', budget_monthly: 220000 });
  assert.strictEqual(merged.budget_monthly, 220000, 'Merged lead must adopt higher budget');
  console.log('✓ Leads merged retaining highest budget');

  // -------------------------------------------------------------
  // Test 6: SLA State Transitions & Manager Escalation
  // -------------------------------------------------------------
  console.log('\nTest 6: 5-Minute Speed-to-Lead SLA State Transitions...');
  assert.strictEqual(getSlaStatusFromDeadline(new Date(Date.now() + 250 * 1000).toISOString()), 'active');
  assert.strictEqual(getSlaStatusFromDeadline(new Date(Date.now() + 75 * 1000).toISOString()), 'critical');
  assert.strictEqual(getSlaStatusFromDeadline(new Date(Date.now() - 10 * 1000).toISOString()), 'breached');
  assert.strictEqual(getSlaStatusFromDeadline(new Date(Date.now() + 120 * 1000).toISOString(), true), 'responded');

  const escalatedLead = handleSlaBreach(leadRes.lead);
  assert.strictEqual(escalatedLead.sla_status, 'breached');
  assert.strictEqual(escalatedLead.escalated_to_manager, true);
  assert.strictEqual(escalatedLead.assigned_to.includes('Manager Escalation'), true);
  console.log('✓ SLA state machine and Manager Escalation verified');

  console.log('\n🎉 ALL INGESTION, SCORING, ROUTING, DEDUP & SLA TESTS PASSED!\n');
}

testIngestionPipeline().catch(err => {
  console.error('❌ Ingestion test failed:', err);
  process.exit(1);
});
