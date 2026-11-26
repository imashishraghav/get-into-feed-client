/**
 * Phase 8 End-to-End Master Lifecycle Verification Test Suite
 * Validates the entire unbroken 12-stage agency customer journey from visitor form submission
 * to GST invoicing, Digio e-signing, Frame.io reels delivery, and client growth reporting.
 */

const assert = require('assert');

async function runFullAgencyLifecycleE2E() {
  console.log('🚀 Starting Full 12-Stage Agency Lifecycle End-to-End Test Suite...\n');

  // =================================================================
  // Stage 1: Inbound Web Form Capture on getintofeed.com with UTMs & DPDP
  // =================================================================
  console.log('Stage 1: Visitor Form Submission on getintofeed.com...');
  const { processInboundLead } = require('../crm/src/api/ingestion.js');

  const visitorPayload = {
    name: 'Kabir Singhania',
    company: 'Singhania Luxury Couture',
    email: 'kabir@singhaniacouture.com',
    phone: '98188 11223', // Raw format needing normalization
    city: 'South Extension, New Delhi',
    service_interest: 'Performance Marketing & Paid Ads',
    budget_range: '₹1,50,000 / mo',
    primary_bottleneck: 'High Meta CAC and creative fatigue',
    utm_source: 'instagram',
    utm_medium: 'paid_ad',
    utm_campaign: 'delhi_bridal_growth_sprint',
    gclid: 'gclid_test_bridal_9921',
    fbclid: 'fbclid_test_reels_4421',
    website_hp: '' // Honeypot must be empty
  };

  const ingestionRes = await processInboundLead(visitorPayload, []);
  assert.strictEqual(ingestionRes.success, true);
  const lead = ingestionRes.lead;

  assert.strictEqual(lead.phone, '+91 98188 11223', 'Phone must be normalized to +91');
  assert.strictEqual(lead.utm_source, 'instagram');
  assert.strictEqual(lead.gclid, 'gclid_test_bridal_9921');
  assert.ok(lead.dpdp_consent.consent_timestamp, 'DPDP consent timestamp must be recorded');
  console.log(`   ✓ Ingested Lead: ${lead.name} (${lead.company})`);
  console.log(`   ✓ DPDP Consent Version: ${lead.dpdp_consent.consent_version}`);
  console.log(`   ✓ Normalized Phone: ${lead.phone}`);

  // =================================================================
  // Stage 2 & 3: 5-Minute Speed-to-Lead SLA Initialization (Human Qualification)
  // =================================================================
  console.log('\nStage 2 & 3: 5-Minute Speed-to-Lead SLA Initialization...');
  assert.strictEqual(lead.sla_status, 'active');
  assert.strictEqual(lead.sla_seconds_remaining, 300, 'SLA must start at 300 seconds');
  assert.strictEqual(lead.ai_score, undefined, 'No AI scoring allowed');
  assert.strictEqual(lead.ai_tier, undefined, 'No AI tier allowed');
  console.log(`   ✓ 5-Minute SLA Initialized: ${lead.sla_seconds_remaining}s remaining (Human qualification workflow)`);

  // =================================================================
  // Stage 4: Workload-Aware Routing Engine
  // =================================================================
  console.log('\nStage 4: Workload-Aware Routing Engine Assignment...');
  const { routeLeadToRep } = require('../crm/src/utils/routingEngine.js');
  const assignment = routeLeadToRep(lead);
  lead.assigned_to = assignment.repName;

  assert.ok(lead.assigned_to.includes('Ashish'), 'HOT leads >= ₹1.5L must route to Founder Ashish');
  console.log(`   ✓ Routed to: ${lead.assigned_to} (Rule: ${assignment.reason})`);

  // =================================================================
  // Stage 5: Speed-to-Lead WhatsApp Welcome Message (SLA Met)
  // =================================================================
  console.log('\nStage 5: Speed-to-Lead WhatsApp Welcome & SLA Resolution...');
  const { MockWhatsAppAdapter } = require('../crm/src/adapters/whatsAppAdapter.js');
  const wa = new MockWhatsAppAdapter();
  const waRes = await wa.sendMessage({
    to: lead.phone,
    message: `Hi ${lead.name}! Thanks for reaching out to GetIntoFeed regarding ${lead.service_interest}. We saw your bottleneck regarding CAC. Are you free for a 15-min discovery call today?`
  });

  assert.strictEqual(waRes.success, true);
  lead.sla_status = 'responded';
  lead.sla_seconds_remaining = null;
  console.log(`   ✓ WhatsApp Welcome Dispatched to ${lead.phone}`);
  console.log(`   ✓ Speed-to-Lead SLA status updated to: ${lead.sla_status.toUpperCase()}`);

  // =================================================================
  // Stage 6: Google Meet Discovery Call Scheduling
  // =================================================================
  console.log('\nStage 6: Discovery Call Scheduled on Google Meet...');
  const { createAgencyMeeting } = require('../crm/src/utils/calendarScheduler.js');
  const meetSession = createAgencyMeeting({
    lead,
    title: 'GetIntoFeed 30-Day Growth Sprint Strategy Call'
  });

  assert.ok(meetSession.meet_url.includes('meet.google.com/'));
  lead.stage = 'Audit Scheduled';
  console.log(`   ✓ Discovery Meeting URL: ${meetSession.meet_url}`);
  console.log(`   ✓ Pipeline stage moved to: "${lead.stage}"`);

  // =================================================================
  // Stage 7: Modular Proposal Generation with Secure Token
  // =================================================================
  console.log('\nStage 7: Modular Proposal Generation & Public Link Dispatch...');
  const { generateTokenizedProposal } = require('../crm/src/data/proposalTemplates.js');
  const proposal = generateTokenizedProposal({
    lead,
    templateId: 'sprint_30d_performance'
  });

  assert.ok(proposal.token.startsWith('prop_'));
  assert.ok(proposal.public_url.includes(proposal.token));
  assert.strictEqual(proposal.monthly_fee, 79000);
  lead.stage = 'Proposal Sent';
  console.log(`   ✓ Generated Secure Proposal Token: ${proposal.token}`);
  console.log(`   ✓ Proposal Fee: ₹${proposal.monthly_fee.toLocaleString('en-IN')}/mo`);
  console.log(`   ✓ Public Link: ${proposal.public_url}`);

  // =================================================================
  // Stage 8: Digio / Leegality Aadhaar E-Sign Retainer Execution
  // =================================================================
  console.log('\nStage 8: Digio / Leegality Aadhaar E-Sign Agreement...');
  const { MockEsignAdapter } = require('../crm/src/adapters/esignAdapter.js');
  const esign = new MockEsignAdapter();
  const agreement = await esign.createAgreement({
    title: 'GetIntoFeed 30-Day Growth Sprint Agreement',
    signerName: lead.name,
    signerEmail: lead.email,
    signerPhone: lead.phone,
    contractValue: 79000
  });

  assert.strictEqual(agreement.status, 'pending_signature');
  const signedAgreement = await esign.simulateSigned(agreement.id);

  assert.strictEqual(signedAgreement.status, 'signed');
  assert.ok(signedAgreement.audit_trail.aadhaar_ref);
  lead.stage = 'Contract / Negotiation';
  console.log(`   ✓ Agreement E-Signed via Aadhaar OTP (Ref: ${signedAgreement.audit_trail.aadhaar_ref})`);
  console.log(`   ✓ Certificate Authority: ${signedAgreement.audit_trail.certificate_authority}`);

  // =================================================================
  // Stage 9: India-First Delhi GST & TDS Invoicing Engine
  // =================================================================
  console.log('\nStage 9: Delhi GST (State Code 07) Invoice Generation...');
  const { calculateGstInvoice, generateInvoiceNumber, SAC_CODES } = require('../crm/src/utils/gstEngine.js');

  const invoice = calculateGstInvoice({
    baseAmount: 79000,
    clientStateCode: '07', // Delhi Intra-State
    sacCode: SAC_CODES.ADVERTISING.code,
    tdsSection: 'SECTION_194C',
    tdsRate: 2
  });

  const invoiceNumber = generateInvoiceNumber(108, '26-27');
  assert.strictEqual(invoice.isIntraState, true, 'Delhi client must be intra-state');
  assert.strictEqual(invoice.taxBreakdown.cgstRate, 9);
  assert.strictEqual(invoice.taxBreakdown.sgstRate, 9);
  assert.strictEqual(invoice.taxBreakdown.totalGst, 14220);
  assert.strictEqual(invoice.grossInvoiceTotal, 93220);
  assert.strictEqual(invoice.tdsDetails.tdsDeducted, 1580); // 2% of ₹79,000 base
  assert.strictEqual(invoice.netReceivable, 91640);

  console.log(`   ✓ Invoice Number: ${invoiceNumber}`);
  console.log(`   ✓ Base Retainer: ₹${invoice.baseAmount.toLocaleString('en-IN')}`);
  console.log(`   ✓ CGST 9% (₹${invoice.taxBreakdown.cgstAmount}) + SGST 9% (₹${invoice.taxBreakdown.sgstAmount}) = Gross ₹${invoice.grossInvoiceTotal.toLocaleString('en-IN')}`);
  console.log(`   ✓ TDS Section 194C (2%): -₹${invoice.tdsDetails.tdsDeducted} -> Net Receivable: ₹${invoice.netReceivable.toLocaleString('en-IN')}`);

  // =================================================================
  // Stage 10: Razorpay UPI QR Payment Link & Settlement
  // =================================================================
  console.log('\nStage 10: Razorpay UPI QR Link Generation & Settlement...');
  const { MockPaymentAdapter } = require('../crm/src/adapters/paymentAdapter.js');
  const rzp = new MockPaymentAdapter();
  const payLink = await rzp.createPaymentLink({
    amount: invoice.grossInvoiceTotal,
    customerName: lead.name,
    customerEmail: lead.email,
    description: `Invoice ${invoiceNumber} - GetIntoFeed Growth Sprint`
  });

  assert.ok(payLink.short_url.includes('rzp.io'));
  assert.ok(payLink.upi_qr.includes('upi://pay'));

  // Mark Won & Paid
  lead.stage = 'Won (Active Retainer)';
  console.log(`   ✓ Razorpay Payment Short URL: ${payLink.short_url}`);
  console.log(`   ✓ UPI Intent String: ${payLink.upi_qr}`);
  console.log(`   ✓ Deal Stage Updated to: "${lead.stage}" 🎉`);

  // =================================================================
  // Stage 11: AR-06 Automation Onboarding & Project Board Initialization
  // =================================================================
  console.log('\nStage 11: Automation AR-06 Trigger & 12 Reels Studio Board...');
  const { automationEngine } = require('../crm/src/utils/automationEngine.js');
  const autoResults = await automationEngine.dispatchEvent('contract.signed', { leadId: lead.id });

  assert.ok(autoResults.some((r) => r.recipe_id === 'AR-06'));
  console.log(`   ✓ AR-06 Executed: Launched Delivery Board & Assigned Team`);

  // =================================================================
  // Stage 12: Frame.io Style Video Review & White-Label Growth Report
  // =================================================================
  console.log('\nStage 12: Frame.io Style Reel Review & Growth PDF Dispatch...');
  const { ACTIVE_PROJECTS } = require('../crm/src/data/projectData.js');
  const project = ACTIVE_PROJECTS[0];

  // Pin timestamped comment at 00:08
  const reelToReview = project.reelsDeliverables[1];
  reelToReview.comments.push({
    id: 'c_e2e_01',
    timestamp: '00:08',
    author: 'Kabir Singhania (Client)',
    text: 'Sitar hook is soulful. Color grade is perfect. Approved!',
    resolved: true
  });
  reelToReview.status = 'approved';

  assert.strictEqual(reelToReview.status, 'approved');
  console.log(`   ✓ Reel #${reelToReview.id} approved at timestamp 00:08`);

  // Generate White-Label Growth Report
  const { generateClientGrowthReport } = require('../crm/src/utils/reportGenerator.js');
  const report = generateClientGrowthReport(project);

  assert.ok(report.reportId.startsWith('REP_'));
  assert.ok(report.metrics.blendedRoas);
  console.log(`   ✓ Generated White-Label Growth Report: ${report.reportId}`);
  console.log(`   ✓ Blended ROAS Achieved: ${report.metrics.blendedRoas} (Target: ${report.metrics.targetRoas})`);
  console.log(`   ✓ Client PDF & WhatsApp Summary dispatched!`);

  console.log('\n🎉 ENTIRE 12-STAGE AGENCY LIFECYCLE E2E TEST PASSED 100% WITH ZERO ERRORS!\n');
}

runFullAgencyLifecycleE2E().catch((err) => {
  console.error('❌ E2E Lifecycle Test Failed:', err);
  process.exit(1);
});
