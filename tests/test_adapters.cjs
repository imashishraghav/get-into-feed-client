/**
 * Automated Verification Test for Zero-Credential Adapters
 */

const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting Zero-Credential Adapters Test Suite...\n');

  // 1. Test WhatsApp Mock Adapter
  console.log('Testing MockWhatsAppAdapter...');
  const { MockWhatsAppAdapter } = require('../crm/src/adapters/whatsAppAdapter.js');
  const wa = new MockWhatsAppAdapter();
  const waRes = await wa.sendMessage({
    to: '9811012345',
    message: 'Hello from GetIntoFeed test'
  });
  assert.strictEqual(waRes.success, true);
  assert.strictEqual(waRes.status, 'delivered');
  const history = await wa.getChatHistory('9811012345');
  assert.strictEqual(history.length, 1);
  console.log('✓ MockWhatsAppAdapter passed');

  // 2. Test Payment Mock Adapter (Razorpay + Delhi GST)
  console.log('Testing MockPaymentAdapter...');
  const { MockPaymentAdapter } = require('../crm/src/adapters/paymentAdapter.js');
  const rzp = new MockPaymentAdapter();
  const payRes = await rzp.createPaymentLink({
    amount: 100000, // 1 Lakh base
    customerName: 'Singhania Real Estate',
    customerPhone: '+919811099999',
    customerEmail: 'vikram@luxeliving.in',
    description: '30-Day Growth Sprint Retainer',
    stateCode: '07' // Delhi State Code
  });
  assert.strictEqual(payRes.base_amount, 100000);
  assert.strictEqual(payRes.amount, 118000); // 18% GST (1.18L)
  assert.strictEqual(payRes.tax_details.cgst, 9000);
  assert.strictEqual(payRes.tax_details.sgst, 9000);
  assert.strictEqual(payRes.tax_details.igst, 0);
  console.log('✓ MockPaymentAdapter with Delhi Intra-State GST (CGST+SGST) passed');

  // 3. Test E-Signature Mock Adapter (Digio)
  console.log('Testing MockEsignAdapter...');
  const { MockEsignAdapter } = require('../crm/src/adapters/esignAdapter.js');
  const esign = new MockEsignAdapter();
  const doc = await esign.createAgreement({
    title: 'GetIntoFeed Performance Marketing Retainer',
    signerName: 'Sneha Kapur',
    signerEmail: 'sneha@glowup.in',
    contractValue: 79000
  });
  assert.strictEqual(doc.status, 'pending_signature');
  const signedDoc = await esign.simulateSigned(doc.id);
  assert.strictEqual(signedDoc.status, 'signed');
  assert.ok(signedDoc.audit_trail.ip_address);
  console.log('✓ MockEsignAdapter with digital audit trail passed');

  // 4. Test Telephony Mock Adapter (Exotel)
  console.log('Testing MockTelephonyAdapter...');
  const { MockTelephonyAdapter } = require('../crm/src/adapters/telephonyAdapter.js');
  const tel = new MockTelephonyAdapter();
  const call = await tel.initiateCall({
    customerPhone: '+919811054321',
    customerName: 'Rohit Verma'
  });
  assert.strictEqual(call.success, true);
  assert.ok(call.call_sid);
  console.log('✓ MockTelephonyAdapter click-to-call passed');

  // 5. Test Email Mock Adapter
  console.log('Testing MockEmailAdapter...');
  const { MockEmailAdapter } = require('../crm/src/adapters/emailAdapter.js');
  const email = new MockEmailAdapter();
  const mailRes = await email.sendEmail({
    to: 'vikram@luxeliving.in',
    subject: 'Proposal: GetIntoFeed 30-Day Growth Sprint',
    html: '<p>Hi Vikram, here is your proposal.</p>'
  });
  assert.strictEqual(mailRes.success, true);
  assert.strictEqual(email.getOutbox().length, 1);
  console.log('✓ MockEmailAdapter passed');

  console.log('\n🎉 ALL 5 ZERO-CREDENTIAL ADAPTERS VERIFIED SUCCESSFULLY!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
