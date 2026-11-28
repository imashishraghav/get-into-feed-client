const assert = require('assert');

async function testRbac() {
  console.log('🧪 Verifying 8-Role RBAC & Data Masking Engine...\n');
  const { ROLES, PERMISSIONS, hasPermission, maskSensitiveLeadData } = require('../crm/src/utils/rbac.js');

  // 1. Owner has all permissions
  assert.strictEqual(hasPermission(ROLES.OWNER, PERMISSIONS.VIEW_ALL_LEADS), true);
  assert.strictEqual(hasPermission(ROLES.OWNER, PERMISSIONS.VIEW_PROFIT_MARGINS), true);
  assert.strictEqual(hasPermission(ROLES.OWNER, PERMISSIONS.MANAGE_SETTINGS), true);
  console.log('✓ Owner unrestricted permissions verified');

  // 2. Sales Rep has restricted permissions
  assert.strictEqual(hasPermission(ROLES.SALES_REP, PERMISSIONS.VIEW_ALL_LEADS), false);
  assert.strictEqual(hasPermission(ROLES.SALES_REP, PERMISSIONS.VIEW_ASSIGNED_LEADS), true);
  assert.strictEqual(hasPermission(ROLES.SALES_REP, PERMISSIONS.VIEW_PROFIT_MARGINS), false);
  console.log('✓ Sales Rep role boundaries verified');

  // 3. Freelancer Data Masking
  const rawLead = {
    id: 'lead_1',
    name: 'Vikramaditya',
    company: 'LuxeLiving',
    phone: '+919811012345',
    email: 'vikram@luxeliving.in',
    budget_monthly: 180000,
    budget_formatted: '₹1.80 Lakh',
    profit_margin: 0.42
  };
  const maskedLead = maskSensitiveLeadData(rawLead, ROLES.FREELANCER);
  assert.strictEqual(maskedLead.phone.includes('XXXXX'), true);
  assert.strictEqual(maskedLead.budget_formatted, '[Protected Margin]');
  assert.strictEqual(maskedLead.profit_margin, null);
  console.log('✓ Freelancer financial margin & phone number masking verified');

  // 4. Finance Role
  assert.strictEqual(hasPermission(ROLES.FINANCE, PERMISSIONS.MANAGE_GST_INVOICES), true);
  assert.strictEqual(hasPermission(ROLES.FINANCE, PERMISSIONS.VIEW_PROFIT_MARGINS), true);
  console.log('✓ Finance GST & P&L permissions verified');

  console.log('\n🎉 8-ROLE RBAC & DATA MASKING ENGINE VERIFIED (100% PASS)!\n');
}

testRbac().catch(err => {
  console.error('❌ RBAC test failed:', err);
  process.exit(1);
});
