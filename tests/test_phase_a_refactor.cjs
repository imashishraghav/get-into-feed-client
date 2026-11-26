/**
 * Phase A Automated Verification Test Suite
 * Validates all 8 items of Phase A: Refactor + Fix
 */

const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting Phase A Refactor & Verification Tests...\n');

  // Test 1: UUID v4 & Domain Models
  console.log('Test 1: Validating UUID v4 Generation & Seed Data Schema...');
  const { seedLeads } = await import('../crm/src/data/seedLeads.js');
  assert(Array.isArray(seedLeads), 'seedLeads must be an array');
  assert.strictEqual(seedLeads.length, 60, 'seedLeads must contain 60 leads');

  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  seedLeads.forEach((lead, idx) => {
    assert(uuidV4Regex.test(lead.id), `Lead at index ${idx} must have valid UUID v4 ID (got: ${lead.id})`);
    assert(lead.dealType, `Lead at index ${idx} must have dealType`);
    assert(lead.dpdpConsent, `Lead at index ${idx} must have dpdpConsent`);
    assert(typeof lead.dpdpConsent.consentGiven === 'boolean', `Lead at index ${idx} must have boolean consentGiven`);
  });
  console.log('  ✓ 60 leads verified with standard UUID v4 IDs and strict domain schema');

  // Test 2: Performance & slaDeadlineAt Timestamp
  console.log('\nTest 2: Verifying Performance SLA Deadline Timestamps...');
  const activeSlaLeads = seedLeads.filter(l => !l.slaResolved);
  assert(activeSlaLeads.length > 0, 'Must have leads with active SLA countdowns');
  activeSlaLeads.forEach((lead) => {
    assert(lead.slaDeadlineAt, `Unresolved lead ${lead.id} must have slaDeadlineAt timestamp`);
    assert(!isNaN(new Date(lead.slaDeadlineAt).getTime()), `slaDeadlineAt must be a valid date`);
  });
  console.log(`  ✓ Isolated slaDeadlineAt verified across ${activeSlaLeads.length} active countdown leads`);

  // Test 3: SLA First-Contact Resolution Enforcement
  console.log('\nTest 3: Enforcing SLA Resolution strictly on First Contact (never on stage advance)...');
  const { resolveSlaOnFirstContact, handleStageTransition } = await import('../crm/src/utils/slaManager.js');

  const testLead = {
    id: 'test-lead-uuid',
    created_at: new Date(Date.now() - 120 * 1000).toISOString(),
    slaDeadlineAt: new Date(Date.now() + 180 * 1000).toISOString(),
    slaResolved: false,
    stage: 'Captured'
  };

  // Rule 3A: Advancing stage does NOT resolve SLA
  const stageMovedLead = handleStageTransition(testLead, 'Proposal Sent');
  assert.strictEqual(stageMovedLead.slaResolved, false, 'Advancing stage must NEVER mark SLA as resolved!');
  assert.strictEqual(stageMovedLead.stage, 'Proposal Sent', 'Stage must update to Proposal Sent');

  // Rule 3B: Only verified contact resolves SLA
  const contactedLead = resolveSlaOnFirstContact(testLead, 'whatsapp', 'Rahul');
  assert.strictEqual(contactedLead.slaResolved, true, 'First contact must resolve SLA');
  assert.strictEqual(contactedLead.firstContactChannel, 'whatsapp', 'Must record firstContactChannel');
  assert(contactedLead.speedToLeadSeconds > 0, 'Must record speedToLeadSeconds');
  console.log('  ✓ SLA state machine verified: Stage movement preserves unresolved status; verified outreach resolves SLA');

  // Test 4: Pipeline Stages, 4 Deal Types & 8 Services
  console.log('\nTest 4: Verifying Pipeline Deal Types and 8 Agency Services...');
  const { AGENCY_SERVICES } = await import('../crm/src/utils/priceBook.ts');
  assert.strictEqual(AGENCY_SERVICES.length, 8, 'Must map all 8 agency disciplines');

  const dealTypesFound = new Set(seedLeads.map(l => l.dealType));
  assert(dealTypesFound.has('Growth Sprint'), 'Must contain Growth Sprint deals');
  assert(dealTypesFound.has('Service Package'), 'Must contain Service Package deals');
  assert(dealTypesFound.has('Retainer'), 'Must contain Retainer deals');
  assert(dealTypesFound.has('One-off'), 'Must contain One-off deals');
  console.log('  ✓ 4 Deal Types and 8 Agency Services successfully mapped');

  // Test 5: Compliance — SAC Price Book & Income-tax Act 2025 Section 393
  console.log('\nTest 5: Validating SAC Price Book with CA Flags & Section 393 TDS...');
  const { SAC_PRICE_BOOK, SECTION_393_TDS_RATES } = await import('../crm/src/utils/priceBook.ts');
  const { calculateGstInvoice } = await import('../crm/src/utils/gstEngine.js');

  // Verify CA review flags
  assert(SAC_PRICE_BOOK['website-cro'].caReviewFlag, 'SAC 998313 must have CA review flag');
  assert(SAC_PRICE_BOOK['reels-12'].caReviewFlag, 'SAC 998366 must have CA review flag');
  assert.strictEqual(SAC_PRICE_BOOK['meta-ads'].caReviewFlag, null, 'SAC 998361 is verified standard');

  // Verify Section 393 TDS calculation
  const calcDelhiInd = calculateGstInvoice({
    baseAmount: 100000,
    clientStateCode: '07',
    sacCode: '998361',
    sec393Key: 'sec_393_item_1_ind'
  });

  assert.strictEqual(calcDelhiInd.isIntraState, true, 'Delhi 07 must be intra-state');
  assert.strictEqual(calcDelhiInd.taxBreakdown.cgstAmount, 9000, 'CGST must be 9%');
  assert.strictEqual(calcDelhiInd.taxBreakdown.sgstAmount, 9000, 'SGST must be 9%');
  assert.strictEqual(calcDelhiInd.grossInvoiceTotal, 118000, 'Gross total must be 1,18,000');
  assert.strictEqual(calcDelhiInd.tdsDetails.ratePercent, 1.0, 'Ind/HUF Sec 393 contractor rate must be 1%');
  assert.strictEqual(calcDelhiInd.tdsDetails.tdsDeducted, 1000, 'TDS must be 1% of base (1,000)');
  assert.strictEqual(calcDelhiInd.netReceivable, 117000, 'Net receivable must be gross minus TDS (1,17,000)');

  const calcInterstateTech = calculateGstInvoice({
    baseAmount: 100000,
    clientStateCode: '06', // Haryana
    sacCode: '998313',
    sec393Key: 'sec_393_item_4_prof'
  });
  assert.strictEqual(calcInterstateTech.isIntraState, false, 'Haryana must be inter-state');
  assert.strictEqual(calcInterstateTech.taxBreakdown.igstAmount, 18000, 'IGST must be 18%');
  assert.strictEqual(calcInterstateTech.tdsDetails.ratePercent, 10.0, 'Professional fees rate must be 10%');
  assert.strictEqual(calcInterstateTech.tdsDetails.tdsDeducted, 10000, 'TDS must be 10,000');
  assert.strictEqual(calcInterstateTech.netReceivable, 108000, 'Net receivable must be 1,08,000');
  assert(calcInterstateTech.caReviewFlag, 'Must carry CA review flag on SAC 998313');
  console.log('  ✓ Section 393 TDS & Delhi 07 GST calculation engine validated');

  // Test 6: DPDP Consent Explicit Mandate
  console.log('\nTest 6: Validating DPDP Explicit Consent Verification...');
  const consentMissingLeads = seedLeads.filter(l => !l.dpdpConsent.consentGiven);
  assert(consentMissingLeads.length > 0, 'Must have manual intake leads flagged with consent missing');
  consentMissingLeads.forEach(l => {
    assert.strictEqual(l.source, 'Manual Intake', 'Only manual intake without proof should be flagged consent missing');
  });
  console.log(`  ✓ DPDP consent verified: ${seedLeads.length - consentMissingLeads.length} verified, ${consentMissingLeads.length} flagged "consent missing"`);

  // Test 7: Security & Formula Injection Neutralization
  console.log('\nTest 7: Validating CSV Formula Injection Neutralization...');
  const { sanitizeCsvCell, generateSafeCsv } = await import('../crm/src/utils/csvSanitizer.ts');

  // Formula trigger characters: =, +, -, @
  assert.strictEqual(sanitizeCsvCell('=SUM(A1:A10)'), '"\'=SUM(A1:A10)"', 'Must prepend single quote on = formula');
  assert.strictEqual(sanitizeCsvCell('+cmd|/c calc'), '"\'+cmd|/c calc"', 'Must prepend single quote on + trigger');
  assert.strictEqual(sanitizeCsvCell('-100'), '"\'-100"', 'Must sanitize negative numbers when treated as formulas');
  assert.strictEqual(sanitizeCsvCell('@admin'), '"\'@admin"', 'Must prepend single quote on @ trigger');
  assert.strictEqual(sanitizeCsvCell('GetIntoFeed Media'), '"GetIntoFeed Media"', 'Standard text must be cleanly quoted');
  console.log('  ✓ CSV formula injection protection verified against remote code execution / DDE triggers');

  // Test 8: Zod Schema Validation
  console.log('\nTest 8: Validating Runtime Input Validation with Zod...');
  const { LeadInputSchema } = await import('../crm/src/schemas/leadSchema.ts');

  const validLeadInput = {
    brand: 'DLF CyberCity Brand',
    contact: 'Vikram Singh',
    phone: '+91 98110 12345',
    email: 'vikram@dlfcyber.in',
    stateCode: '07',
    stage: 'Captured',
    dealType: 'Growth Sprint',
    dealValue: 75000,
    owner: 'Ashish Raghav',
    source: 'Meta Lead Ads',
    dpdpConsent: {
      consentGiven: true,
      consentSourceUrl: 'https://getintofeed.com/#contact',
      consentPolicyVersion: 'v1.2_2026_11',
      consentTimestamp: new Date().toISOString()
    }
  };

  const parseResult = LeadInputSchema.safeParse(validLeadInput);
  assert(parseResult.success, 'Valid lead must pass Zod schema validation');

  // Invalid phone test
  const invalidPhoneInput = { ...validLeadInput, phone: '12345' };
  const invalidResult = LeadInputSchema.safeParse(invalidPhoneInput);
  assert(!invalidResult.success, 'Invalid phone must fail Zod schema validation');
  console.log('  ✓ Zod runtime validation verified for lead ingestion and phone format');

  console.log('\n' + '='.repeat(60));
  console.log('🎉 ALL PHASE A VERIFICATION TESTS PASSED (100%)');
  console.log('='.repeat(60) + '\n');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILURE:', err);
  process.exit(1);
});
