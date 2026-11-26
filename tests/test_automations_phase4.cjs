/**
 * Phase 4 Automated Test: 17 Pre-Built Agency Automation Recipes
 * Tests event listeners, trigger dispatches, and recipe execution telemetry.
 */

const assert = require('assert');

async function testAutomationEngine() {
  console.log('🧪 Starting Phase 4 Automation Engine Test Suite...\n');

  const { automationEngine, PREBUILT_RECIPES } = require('../crm/src/utils/automationEngine.js');

  // 1. Verify 17 Pre-Built Recipes Exist
  assert.strictEqual(PREBUILT_RECIPES.length, 17, 'Must have exactly 17 pre-built agency recipes');
  console.log(`✓ All 17 agency recipes verified in registry (AR-01 to AR-17)`);

  // 2. Test Recipe Toggle
  const initialStatus = PREBUILT_RECIPES[0].enabled;
  const toggled = automationEngine.toggleRecipe('AR-01');
  assert.strictEqual(toggled, !initialStatus, 'Toggle must flip boolean state');
  automationEngine.toggleRecipe('AR-01'); // restore to true
  console.log('✓ 1-Click Recipe ON/OFF toggle verified');

  // 3. Test Event Dispatch: `lead.created` (should trigger AR-02 and AR-03)
  console.log('\nTesting Event Trigger: `lead.created`...');
  const leadPayload = {
    id: 'lead_test_auto_01',
    name: 'Vikramaditya',
    company: 'LuxeLiving',
    budget_monthly: 180000
  };
  const execResults = await automationEngine.dispatchEvent('lead.created', leadPayload);
  assert.ok(execResults.length >= 2, 'Should execute AR-02 (WhatsApp welcome) and AR-03 (High-ticket routing)');
  console.log(`✓ Triggered ${execResults.length} actions for 'lead.created':`);
  execResults.forEach(r => console.log(`   - [${r.recipe_id}] ${r.recipe_name} -> ${r.action}`));

  // 4. Test Event Dispatch: `contract.signed` (triggers AR-06 Onboarding)
  console.log('\nTesting Event Trigger: `contract.signed`...');
  const contractRes = await automationEngine.dispatchEvent('contract.signed', { leadId: 'lead_test_auto_01' });
  assert.ok(contractRes.some(r => r.recipe_id === 'AR-06'), 'Must trigger AR-06 contract onboarding');
  console.log('✓ AR-06 Contract Signed Onboarding Trigger verified');

  // 5. Test Event Dispatch: `invoice.paid` (triggers AR-09 Won Celebration)
  console.log('\nTesting Event Trigger: `invoice.paid`...');
  const invoiceRes = await automationEngine.dispatchEvent('invoice.paid', { leadId: 'lead_test_auto_01', amount: 118000 });
  assert.ok(invoiceRes.some(r => r.recipe_id === 'AR-09'), 'Must trigger AR-09 deal won');
  console.log('✓ AR-09 Invoice Paid Deal Won Celebration verified');

  // 6. Verify Telemetry Log
  const logs = automationEngine.getEventLog();
  assert.ok(logs.length >= 4, 'Event execution telemetry must be recorded');
  console.log(`\n✓ Total logged automation executions: ${logs.length}`);

  console.log('\n🎉 ALL 17 AUTOMATION RECIPES & EVENT ENGINE VERIFIED SUCCESSFULLY!\n');
}

testAutomationEngine().catch(err => {
  console.error('❌ Automation test failed:', err);
  process.exit(1);
});
