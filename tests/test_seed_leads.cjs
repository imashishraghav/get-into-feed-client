const assert = require('assert');

async function testSeed() {
  console.log('🧪 Verifying 60 Realistic Indian Agency Seed Leads...\n');
  const { seedLeads } = require('../crm/src/data/seedLeads.js');

  assert.strictEqual(seedLeads.length, 60, 'Must have exactly 60 leads');

  const services = new Set(seedLeads.map(l => l.service_interest));
  console.log(`✓ Services count: ${services.size} of 8 distinct services`);
  assert.strictEqual(services.size, 8, 'All 8 services must be present');

  const cities = new Set(seedLeads.map(l => l.city));
  console.log(`✓ Cities represented: ${Array.from(cities).join(', ')}`);
  assert.ok(cities.has('Gurugram') && cities.has('South Delhi') && cities.has('Noida'));

  const phoneValid = seedLeads.every(l => l.phone.startsWith('+91'));
  assert.ok(phoneValid, 'All phones must be +91 normalized');

  const slaActive = seedLeads.filter(l => l.sla_seconds_remaining !== null);
  console.log(`✓ Leads with active 5-Min SLA countdowns: ${slaActive.length}`);
  assert.ok(slaActive.length > 0);

  const totalPipeline = seedLeads.reduce((acc, l) => acc + l.budget_monthly, 0);
  console.log(`✓ Total Seed Pipeline Value: ₹${(totalPipeline / 10000000).toFixed(2)} Crore (₹${(totalPipeline / 100000).toFixed(2)} Lakhs)`);

  console.log('\n🎉 SEED LEADS DATASET VERIFIED (100% VALID)!\n');
}

testSeed().catch(err => {
  console.error('❌ Seed test failed:', err);
  process.exit(1);
});
