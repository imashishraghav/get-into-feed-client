/**
 * Phase 5 Automated Test: Proposals, E-Sign, GST Invoicing & Payments
 * Tests Delhi GST calculation (Intra vs Inter-state), SAC codes, sequential numbering,
 * TDS deduction under 194C/194J, tokenized proposals, e-sign workflow, and payment links.
 */

const assert = require('assert');

async function testProposalsGstPhase5() {
  console.log('🧪 Starting Phase 5 Proposals, E-Sign & GST Invoicing Test Suite...\n');

  const {
    calculateGstInvoice,
    generateInvoiceNumber,
    extractStateCodeFromGstin,
    AGENCY_STATE_CODE,
    SAC_CODES,
    TDS_SECTIONS
  } = require('../crm/src/utils/gstEngine.js');

  const {
    PROPOSAL_TEMPLATES,
    generateTokenizedProposal
  } = require('../crm/src/data/proposalTemplates.js');

  const {
    esignAdapter,
    paymentAdapter
  } = require('../crm/src/adapters/index.js');

  // ==========================================
  // 1. Delhi Intra-State GST Calculation (CGST 9% + SGST 9%)
  // ==========================================
  console.log('1. Testing Intra-State Delhi GST Calculation (State Code 07)...');
  const baseAmountDelhi = 100000; // ₹1,00,000
  const intraInvoice = calculateGstInvoice({
    baseAmount: baseAmountDelhi,
    clientStateCode: '07', // Delhi
    sacCode: SAC_CODES.ADVERTISING.code
  });

  assert.strictEqual(intraInvoice.isIntraState, true, 'Delhi to Delhi must be intra-state');
  assert.strictEqual(intraInvoice.taxBreakdown.cgstRate, 9, 'CGST rate must be 9%');
  assert.strictEqual(intraInvoice.taxBreakdown.cgstAmount, 9000, 'CGST must be ₹9,000 on ₹1,00,000');
  assert.strictEqual(intraInvoice.taxBreakdown.sgstRate, 9, 'SGST rate must be 9%');
  assert.strictEqual(intraInvoice.taxBreakdown.sgstAmount, 9000, 'SGST must be ₹9,000 on ₹1,00,000');
  assert.strictEqual(intraInvoice.taxBreakdown.igstAmount, 0, 'IGST must be 0 for intra-state');
  assert.strictEqual(intraInvoice.grossInvoiceTotal, 118000, 'Gross invoice total must be ₹1,18,000 (18% GST)');
  console.log(`   ✓ Delhi Intra-State: Base ₹1,00,000 + CGST ₹9,000 + SGST ₹9,000 = Total ₹${intraInvoice.grossInvoiceTotal.toLocaleString('en-IN')}`);

  // ==========================================
  // 2. Inter-State GST Calculation (IGST 18%)
  // ==========================================
  console.log('\n2. Testing Inter-State GST Calculation (Gurugram/Noida/Bengaluru)...');
  const interInvoiceHaryana = calculateGstInvoice({
    baseAmount: baseAmountDelhi,
    clientStateCode: '06', // Haryana (Gurugram)
    sacCode: SAC_CODES.VIDEO_PRODUCTION.code
  });

  assert.strictEqual(interInvoiceHaryana.isIntraState, false, 'Delhi to Haryana must be inter-state');
  assert.strictEqual(interInvoiceHaryana.taxBreakdown.cgstAmount, 0, 'CGST must be 0 for inter-state');
  assert.strictEqual(interInvoiceHaryana.taxBreakdown.sgstAmount, 0, 'SGST must be 0 for inter-state');
  assert.strictEqual(interInvoiceHaryana.taxBreakdown.igstRate, 18, 'IGST rate must be 18%');
  assert.strictEqual(interInvoiceHaryana.taxBreakdown.igstAmount, 18000, 'IGST must be ₹18,000 on ₹1,00,000');
  assert.strictEqual(interInvoiceHaryana.grossInvoiceTotal, 118000, 'Gross invoice total must be ₹1,18,000');
  console.log(`   ✓ Inter-State (Haryana): Base ₹1,00,000 + IGST ₹18,000 = Total ₹${interInvoiceHaryana.grossInvoiceTotal.toLocaleString('en-IN')}`);

  // ==========================================
  // 3. GSTIN State Code Extraction & Sequential Numbering
  // ==========================================
  console.log('\n3. Testing GSTIN State Code Extraction & Sequential Invoice Format...');
  const gstinKarnataka = '29ABCDE1234F1Z5';
  const stateCodeExtracted = extractStateCodeFromGstin(gstinKarnataka);
  assert.strictEqual(stateCodeExtracted, '29', 'Should extract state code 29 for Karnataka');

  const invNum = generateInvoiceNumber(104, '26-27');
  assert.strictEqual(invNum, 'GIF/26-27/0104', 'Sequential invoice format must match GIF/YY-YY/XXXX');
  console.log(`   ✓ Extracted State Code '29' from GSTIN: ${gstinKarnataka}`);
  console.log(`   ✓ Formatted Sequential Invoice Number: ${invNum}`);

  // ==========================================
  // 4. TDS Deduction (Section 194C & 194J)
  // ==========================================
  console.log('\n4. Testing TDS Deductions under Indian Income Tax Act...');
  // TDS under Section 194C (2% contractor rate on base amount)
  const invoice194C = calculateGstInvoice({
    baseAmount: 100000,
    clientStateCode: '07',
    tdsSection: 'SECTION_194C',
    tdsRate: 2
  });
  assert.strictEqual(invoice194C.tdsDetails.tdsDeducted, 2000, 'TDS 2% on ₹1,00,000 base should be ₹2,000');
  assert.strictEqual(invoice194C.netReceivable, 116000, 'Net receivable should be ₹1,18,000 - ₹2,000 = ₹1,16,000');
  console.log(`   ✓ Section 194C (2%): Gross ₹1,18,000 - TDS ₹2,000 = Net Receivable ₹${invoice194C.netReceivable.toLocaleString('en-IN')}`);

  // TDS under Section 194J (10% professional services on base amount)
  const invoice194J = calculateGstInvoice({
    baseAmount: 100000,
    clientStateCode: '09', // UP
    tdsSection: 'SECTION_194J',
    tdsRate: 10
  });
  assert.strictEqual(invoice194J.tdsDetails.tdsDeducted, 10000, 'TDS 10% on ₹1,00,000 base should be ₹10,000');
  assert.strictEqual(invoice194J.netReceivable, 108000, 'Net receivable should be ₹1,18,000 - ₹10,000 = ₹1,08,000');
  console.log(`   ✓ Section 194J (10%): Gross ₹1,18,000 - TDS ₹10,000 = Net Receivable ₹${invoice194J.netReceivable.toLocaleString('en-IN')}`);

  // ==========================================
  // 5. Modular Proposal Templates & Token Generation
  // ==========================================
  console.log('\n5. Testing Modular Proposal Templates & Token Generation...');
  assert.strictEqual(PROPOSAL_TEMPLATES.length >= 3, true, 'Must have at least 3 pre-built proposal templates');
  
  const mockLead = {
    id: 'lead_test_prop_01',
    name: 'Kabir Oberoi',
    company: 'Oberoi Realty Ventures'
  };

  const tokenizedProp = generateTokenizedProposal({
    lead: mockLead,
    templateId: 'sprint_30d_performance'
  });

  assert.ok(tokenizedProp.token.startsWith('prop_lead_test_prop_01_'), 'Token format check');
  assert.ok(tokenizedProp.public_url.includes(tokenizedProp.token), 'Public URL must include security token');
  assert.strictEqual(tokenizedProp.status, 'sent', 'Initial proposal status must be sent');
  assert.ok(tokenizedProp.deliverables.length >= 5, 'Must contain sprint deliverables');
  console.log(`   ✓ Generated Proposal Token: ${tokenizedProp.token}`);
  console.log(`   ✓ Secure Public Link: ${tokenizedProp.public_url}`);

  // ==========================================
  // 6. E-Sign Adapter Workflow (Digio/Leegality Mock)
  // ==========================================
  console.log('\n6. Testing Digio/Leegality Aadhaar E-Sign Adapter...');
  const esignReq = await esignAdapter.createAgreement({
    title: 'GetIntoFeed 30-Day Growth Sprint Retainer Agreement',
    signerName: 'Kabir Oberoi',
    signerEmail: 'kabir@oberoirealty.com',
    signerPhone: '+919811000000',
    contractValue: 118000
  });

  assert.ok(esignReq.id, 'Must generate agreement id');
  assert.strictEqual(esignReq.status, 'pending_signature', 'Initial status must be pending_signature');

  // Verify simulated signing
  const signedDoc = await esignAdapter.simulateSigned(esignReq.id);
  assert.strictEqual(signedDoc.status, 'signed', 'Document status must update to signed');
  assert.ok(signedDoc.signed_at, 'Must record timestamp');
  assert.ok(signedDoc.audit_trail.aadhaar_ref, 'Audit trail must record Aadhaar ref');
  console.log(`   ✓ Digio/Leegality eSign workflow verified (Aadhaar Ref: ${signedDoc.audit_trail.aadhaar_ref})`);

  // ==========================================
  // 7. Payment Adapter Workflow (Razorpay Mock)
  // ==========================================
  console.log('\n7. Testing Razorpay Payment & UPI QR Link Adapter...');
  const payReq = await paymentAdapter.createPaymentLink({
    amount: 100000,
    customerName: 'Kabir Oberoi',
    customerEmail: 'kabir@oberoirealty.com',
    description: 'Invoice GIF/26-27/0104 - 30-Day Growth Sprint'
  });

  assert.ok(payReq.id, 'Must generate payment id');
  assert.ok(payReq.short_url, 'Must generate short payment link');
  assert.ok(payReq.upi_qr, 'Must generate UPI QR string');
  assert.strictEqual(payReq.status, 'created', 'Initial payment status must be created');
  console.log(`   ✓ Razorpay Payment Link generated: ${payReq.short_url}`);
  console.log(`   ✓ Razorpay UPI QR string generated: ${payReq.upi_qr}`);

  console.log('\n🎉 ALL PHASE 5 PROPOSALS, E-SIGN & GST INVOICING TESTS PASSED (100%)!\n');
}

testProposalsGstPhase5().catch(err => {
  console.error('❌ Phase 5 Test Failed:', err);
  process.exit(1);
});
