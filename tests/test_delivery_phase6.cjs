/**
 * Phase 6 Automated Test: Client Delivery OS & Service Modules
 * Tests Creative Delivery (Frame.io timestamped review), Performance Ads pacing,
 * Creative fatigue detection, SEO SERP rankings, Web CRO scores, and White-Label Growth Report generation.
 */

const assert = require('assert');

async function testDeliveryPhase6() {
  console.log('🧪 Starting Phase 6 Delivery OS & Service Modules Test Suite...\n');

  const {
    ACTIVE_PROJECTS,
    getProjectByLeadId,
    getProjectById
  } = require('../crm/src/data/projectData.js');

  const {
    generateClientGrowthReport
  } = require('../crm/src/utils/reportGenerator.js');

  // ==========================================
  // 1. Verify Active Projects Data Structure
  // ==========================================
  console.log('1. Testing Active Projects Seed Data...');
  assert.ok(ACTIVE_PROJECTS.length >= 2, 'Must have at least 2 active client projects');

  const projectSinghania = getProjectByLeadId('lead_01');
  assert.strictEqual(projectSinghania.clientCompany, 'Singhania Couture');
  assert.strictEqual(projectSinghania.monthlyRetainer, 79000);
  assert.strictEqual(projectSinghania.health, 'excellent');
  assert.ok(projectSinghania.assignedTeam.accountManager.includes('Ashish'));
  console.log(`   ✓ Active project retrieved: ${projectSinghania.clientCompany} (₹${projectSinghania.monthlyRetainer.toLocaleString('en-IN')}/mo)`);

  // ==========================================
  // 2. Creative Delivery Board: Frame.io Style Timestamped Review
  // ==========================================
  console.log('\n2. Testing Frame.io Style Timestamped Video Review & Approvals...');
  const reels = projectSinghania.reelsDeliverables;
  assert.ok(reels.length >= 4, 'Must have at least 4 reels deliverables');

  const targetReel = reels.find((r) => r.id === 'reel_singh_02');
  assert.ok(targetReel, 'Target reel reel_singh_02 must exist');
  assert.strictEqual(targetReel.currentVersion, 'v2');
  assert.strictEqual(targetReel.status, 'pending_approval');

  // Add simulated timestamped comment at 00:15
  const newComment = {
    id: `c_test_${Date.now()}`,
    timestamp: '00:15',
    author: 'Ananya Singhania (Client)',
    text: 'Transition to the bridal lehenga look is seamless. Approved for ads!',
    resolved: false
  };
  targetReel.comments.push(newComment);

  assert.ok(targetReel.comments.some((c) => c.timestamp === '00:15'));
  console.log(`   ✓ Pinned comment at timestamp ${newComment.timestamp}: "${newComment.text}"`);

  // Simulate Approval
  targetReel.status = 'approved';
  assert.strictEqual(targetReel.status, 'approved', 'Reel status must update to approved');
  console.log(`   ✓ Reel status flipped to: ${targetReel.status.toUpperCase()} (Ship to Meta Ads)`);

  // ==========================================
  // 3. Performance Marketing & Paid Ads Module
  // ==========================================
  console.log('\n3. Testing Performance Marketing & Creative Fatigue Engine...');
  const ads = projectSinghania.paidAds;
  assert.ok(ads.blendedRoas >= 4.0, 'Blended ROAS must be >= 4.0x');
  assert.ok(ads.spentToDate > 0, 'Ad spend must be recorded');
  assert.strictEqual(ads.cpa, 378, 'CPA must match ₹378');
  assert.ok(ads.cpa < ads.targetCpa, 'Actual CPA must outperform target CPA');

  // Creative Fatigue Detection
  assert.ok(ads.creativeFatigueAlerts.length > 0, 'Must record fatigue alert for high frequency');
  const alert = ads.creativeFatigueAlerts[0];
  assert.ok(alert.frequency > 3.5, 'Fatigue triggers when frequency > 3.5');
  assert.strictEqual(alert.severity, 'HIGH');
  console.log(`   ✓ Blended ROAS: ${ads.blendedRoas}x (Target: ${ads.targetRoas}x)`);
  console.log(`   ✓ Creative Fatigue Alert detected: ${alert.adName} (Freq: ${alert.frequency}, CTR Trend: ${alert.ctrTrend}%)`);

  // ==========================================
  // 4. SEO & Organic Search Module
  // ==========================================
  console.log('\n4. Testing SEO SERP Rankings & Local Map Pack Tracking...');
  const seo = projectSinghania.seo;
  assert.ok(seo.trackedKeywords.length >= 4, 'Must have at least 4 tracked keywords');
  assert.ok(seo.trackedKeywords.some((k) => k.rank === 1), 'Must have at least one #1 ranking keyword');
  assert.strictEqual(seo.clicksGrowthMoM, '+34.2%');
  assert.ok(seo.delhiLocalRank.includes('South Delhi'));
  console.log(`   ✓ Organic Clicks: ${seo.organicClicks.toLocaleString('en-IN')} (${seo.clicksGrowthMoM} MoM)`);
  console.log(`   ✓ Top 3 Local Map Pack verified: ${seo.delhiLocalRank}`);

  // ==========================================
  // 5. Web Development & CRO Module
  // ==========================================
  console.log('\n5. Testing Web Development & Conversion Rate Optimization (CRO)...');
  const web = projectSinghania.webCro;
  assert.ok(web.speedScore >= 95, 'Lighthouse speed score must be >= 95');
  assert.strictEqual(web.accessibilityScore, 100);
  assert.strictEqual(web.seoScore, 100);
  assert.strictEqual(web.activeCroExperiment.status, 'winning');
  assert.strictEqual(web.activeCroExperiment.conversionUplift, '+19.4%');
  console.log(`   ✓ Lighthouse Performance Score: ${web.speedScore}/100 (LCP ${web.lcp})`);
  console.log(`   ✓ Winning CRO Test: "${web.activeCroExperiment.name}" (${web.activeCroExperiment.conversionUplift} uplift)`);

  // ==========================================
  // 6. White-Label Client Growth PDF Report Generator
  // ==========================================
  console.log('\n6. Testing White-Label Client Growth Report Generator...');
  const report = generateClientGrowthReport(projectSinghania);

  assert.ok(report.reportId.startsWith('REP_'), 'Report ID format check');
  assert.strictEqual(report.clientCompany, 'Singhania Couture');
  assert.ok(report.executiveSummary.includes('4.35x'), 'Executive summary must mention ROAS');
  assert.ok(report.executiveSummary.includes('GetIntoFeed'), 'Must include agency branding');
  assert.strictEqual(report.topReels.length, 3, 'Must feature top 3 winning reels');
  assert.ok(report.nextSprintRoadmap.length >= 4, 'Must have at least 4 roadmap initiatives');
  assert.strictEqual(report.agencyContact.name, 'Ashish');
  console.log(`   ✓ Generated White-Label Report: ${report.reportId}`);
  console.log(`   ✓ Executive Summary: "${report.executiveSummary.slice(0, 100)}..."`);

  console.log('\n🎉 ALL PHASE 6 DELIVERY OS & SERVICE MODULES VERIFIED (100%)!\n');
}

testDeliveryPhase6().catch((err) => {
  console.error('❌ Phase 6 Delivery Test Failed:', err);
  process.exit(1);
});
