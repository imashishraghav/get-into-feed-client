/**
 * GetIntoFeed Agency CRM — Unified Ingestion API Pipeline
 * Orchestrates honeypot spam filtering, E.164 phone normalization,
 * duplicate detection, round-robin routing, and 5-min SLA initialization.
 */

import { formatIndianPhone, normalizeEmail, findDuplicates } from '../utils/dedup.js';
import { routeLeadToRep } from '../utils/routingEngine.js';
import { SLA_INITIAL_SECONDS, SLA_STATES } from '../utils/slaManager.js';

export async function processInboundLead(rawInput, existingLeads = []) {
  // 1. Honeypot check
  if (rawInput.website_hp || rawInput.honeypot || rawInput.middle_name) {
    return {
      success: false,
      error: 'Bot submission rejected via honeypot.',
      isSpam: true
    };
  }

  // 2. Data Normalization
  const cleanPhone = formatIndianPhone(rawInput.phone || rawInput.mobile || '');
  const cleanEmail = normalizeEmail(rawInput.email || '');
  const budgetNum = typeof rawInput.budget_monthly === 'number'
    ? rawInput.budget_monthly
    : parseInt(String(rawInput.budget_range || rawInput.budget || '75000').replace(/\D/g, ''), 10) || 75000;

  const candidateLead = {
    id: `lead_inbound_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: (rawInput.name || 'Inbound Lead').trim(),
    company: (rawInput.company || rawInput.business_name || 'Independent Brand').trim(),
    phone: cleanPhone,
    email: cleanEmail,
    city: rawInput.city || 'Delhi NCR',
    locality: rawInput.locality || `${rawInput.city || 'Delhi'} NCR`,
    state_code: (rawInput.city || '').toLowerCase().includes('noida') ? '09' : '07',
    service_interest: rawInput.service_interest || rawInput.service || 'Performance Marketing & Paid Ads',
    budget_monthly: budgetNum,
    budget_formatted: `₹${(budgetNum / 100000).toFixed(2)} Lakh`,
    bottleneck: rawInput.primary_bottleneck || rawInput.bottleneck || 'Scaling sales',
    source: rawInput.source || 'Website Inbound Form',
    campaign: rawInput.campaign || 'getintofeed_web',
    utm_source: rawInput.utm_source || 'direct',
    utm_medium: rawInput.utm_medium || 'organic',
    gclid: rawInput.gclid || null,
    fbclid: rawInput.fbclid || null,
    dpdp_consent: {
      consent_given: true,
      consent_timestamp: new Date().toISOString(),
      consent_version: 'DPDP_POLICY_V2026.1'
    },
    stage: 'Captured',
    status: 'Needs Reply',
    created_at: new Date().toISOString()
  };

  // 3. Duplicate Detection
  const duplicates = findDuplicates(candidateLead, existingLeads);
  const isDuplicate = duplicates.length > 0;

  // 4. Sales Routing (Budget & Service Specialization + Round-Robin)
  const routing = routeLeadToRep(candidateLead);
  candidateLead.assigned_to = routing.repName;
  candidateLead.owner_id = routing.repId;
  candidateLead.routing_reason = routing.reason;

  // 5. SLA Timer Initialization (5 minutes = 300 seconds)
  candidateLead.sla_seconds_remaining = SLA_INITIAL_SECONDS;
  candidateLead.slaDeadlineAt = new Date(Date.now() + SLA_INITIAL_SECONDS * 1000).toISOString();
  candidateLead.slaResolved = false;
  candidateLead.sla_status = SLA_STATES.ACTIVE;

  return {
    success: true,
    lead: candidateLead,
    isDuplicate,
    duplicates,
    routing
  };
}
