/**
 * GetIntoFeed Agency CRM — Realistic Indian Demo Seed Dataset
 * 60 rich leads across all 8 services, Delhi NCR micro-markets, INR values, and multi-channel attribution.
 * 
 * Standardized on:
 * - UUID v4 IDs
 * - slaDeadlineAt ISO timestamps
 * - 4 Deal Types (Growth Sprint, Service Package, Retainer, One-off)
 * - DPDP explicit consent tracking
 * - SAC price book & CA review flags
 */

import { v4 as uuidv4 } from 'uuid';
import { SAC_PRICE_BOOK, AGENCY_SERVICES } from '../utils/priceBook.ts';

const LOCATIONS = [
  { city: 'Gurugram', locality: 'Golf Course Road, DL', stateCode: '07' },
  { city: 'Gurugram', locality: 'Cyber City, Phase 2', stateCode: '07' },
  { city: 'South Delhi', locality: 'Greater Kailash 1, DL', stateCode: '07' },
  { city: 'South Delhi', locality: 'Hauz Khas Enclave, DL', stateCode: '07' },
  { city: 'Central Delhi', locality: 'Connaught Place, DL', stateCode: '07' },
  { city: 'West Delhi', locality: 'Rajouri Garden, DL', stateCode: '07' },
  { city: 'Noida', locality: 'Sector 62 Tech Zone, UP', stateCode: '09' },
  { city: 'Noida', locality: 'Sector 18 Commercial Hub, UP', stateCode: '09' },
  { city: 'Faridabad', locality: 'Sector 15 Industrial Area, HR', stateCode: '06' }
];

const SOURCES = [
  { channel: 'Meta Lead Ads', campaign: 'd2c_founder_reels_delhi', utm_source: 'facebook', utm_medium: 'cpc' },
  { channel: 'Google Search Ads', campaign: 'performance_marketing_agency_gurgaon', utm_source: 'google', utm_medium: 'cpc' },
  { channel: 'Website Inbound Form', campaign: 'getintofeed_home_cta', utm_source: 'direct', utm_medium: 'organic' },
  { channel: 'WhatsApp Quick Chat', campaign: 'floating_widget_delhi', utm_source: 'whatsapp', utm_medium: 'direct' },
  { channel: 'Founder Referral', campaign: 'ashish_network', utm_source: 'referral', utm_medium: 'offline' },
  { channel: 'Manual Intake', campaign: 'agency_event_delhi', utm_source: 'manual', utm_medium: 'offline' }
];

const STAGES = [
  'Captured',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost'
];

const DEAL_TYPES = [
  'Growth Sprint',
  'Service Package',
  'Retainer',
  'One-off'
];

const LEAD_TEMPLATES = [
  { name: 'Vikramaditya Singhania', company: 'LuxeLiving Realty', phone: '+919811012345', email: 'vikram@luxeliving.in', serviceId: 'meta-ads', budget: 180000, dealType: 'Retainer', bottleneck: 'CPL on Meta ads crossed ₹1800; need high-intent buyers for ₹4Cr+ Gurugram penthouses' },
  { name: 'Sneha Kapur', company: 'GlowUp D2C Skincare', phone: '+919871123456', email: 'sneha@glowup.in', serviceId: 'reels-12', budget: 95000, dealType: 'Growth Sprint', bottleneck: 'Organic reels not converting; ROAS stuck at 1.4x; need 12 thumb-stopping reels per month' },
  { name: 'Rohit Verma', company: 'UrbanFit Gyms & Nutrition', phone: '+919999012345', email: 'rohit@urbanfit.co', serviceId: 'google-ads', budget: 120000, dealType: 'Retainer', bottleneck: 'High gym membership churn; need hyper-local Google Ads and WhatsApp automation' },
  { name: 'Ananya Sharma', company: 'Nirvana Jewels', phone: '+919810054321', email: 'ananya@nirvanajewels.com', serviceId: 'graphic-design', budget: 85000, dealType: 'Service Package', bottleneck: 'Outdated brand identity; want a luxury editorial look for modern Delhi brides' },
  { name: 'Gaurav Malhotra', company: 'Kavach FinTech', phone: '+919910087654', email: 'gaurav@kavach.money', serviceId: 'website-cro', budget: 220000, dealType: 'Service Package', bottleneck: 'Next.js web app checkout drop-off rate is 64%; need full CRO and UI redesign' },
  { name: 'Priya Nair', company: 'The Clean Pantry', phone: '+919873322110', email: 'priya@cleanpantry.in', serviceId: 'seo', budget: 75000, dealType: 'Retainer', bottleneck: 'Zero organic traffic for organic snacks; competitors ranking on page 1 of Google' },
  { name: 'Rajesh Mittal', company: 'Mittal Ply & Hardware', phone: '+919811987654', email: 'rajesh@mittalply.com', serviceId: 'commercial-video', budget: 110000, dealType: 'One-off', bottleneck: 'B2B distributor leads are unqualified; need structured WhatsApp follow-up and corporate brand video' },
  { name: 'Tanvi Mehra', company: 'Silk & Saffron Couturiers', phone: '+919818844332', email: 'tanvi@silksaffron.in', serviceId: 'content-marketing', budget: 50000, dealType: 'Growth Sprint', bottleneck: 'Influencer collaborations costing ₹3L with zero trackable coupon code sales' },
  { name: 'Kabir Oberoi', company: 'BrewCraft Artisan Coffee', phone: '+919958811223', email: 'kabir@brewcraft.coffee', serviceId: 'reels-12', budget: 85000, dealType: 'Growth Sprint', bottleneck: 'Need viral food reels in Hauz Khas / Cyber Hub cafes to drive weekend footfalls' },
  { name: 'Aarav Gupta', company: 'Edunext Learning', phone: '+919810199887', email: 'aarav@edunext.in', serviceId: 'meta-ads', budget: 65000, dealType: 'Growth Sprint', bottleneck: 'Google Analytics 4 setup broken; GTM tag firing 3 times on purchase event' }
];

export function generate60SeedLeads() {
  const leads = [];

  for (let i = 0; i < 60; i++) {
    const template = LEAD_TEMPLATES[i % LEAD_TEMPLATES.length];
    const loc = LOCATIONS[i % LOCATIONS.length];
    const src = SOURCES[i % SOURCES.length];
    const serviceInfo = AGENCY_SERVICES[i % AGENCY_SERVICES.length];
    const stage = STAGES[i % STAGES.length];
    const dealType = template.dealType || DEAL_TYPES[i % DEAL_TYPES.length];

    const budgetMultiplier = 0.8 + ((i * 17) % 70) / 100;
    const estimatedBudget = Math.round((template.budget * budgetMultiplier) / 5000) * 5000;

    // SLA logic
    let slaDeadlineAt = null;
    let slaResolved = true;
    let firstContactChannel = null;
    let speedToLeadSeconds = 0;

    if (stage === 'Captured') {
      if (i % 3 === 0) {
        // Active countdown: deadline 3 to 5 minutes into the future
        const secondsRemaining = Math.max(45, 300 - ((i * 37) % 250));
        slaDeadlineAt = new Date(Date.now() + secondsRemaining * 1000).toISOString();
        slaResolved = false;
      } else if (i % 3 === 1) {
        // Breached deadline in the past
        slaDeadlineAt = new Date(Date.now() - 120 * 1000).toISOString();
        slaResolved = false;
      } else {
        // Already responded
        slaDeadlineAt = new Date(Date.now() - 3600 * 1000).toISOString();
        slaResolved = true;
        firstContactChannel = 'whatsapp';
        speedToLeadSeconds = 102;
      }
    } else {
      // Subsequent stages must have had first contact logged!
      slaResolved = true;
      firstContactChannel = i % 2 === 0 ? 'call' : 'whatsapp';
      speedToLeadSeconds = 85 + (i * 7) % 110;
    }

    const leadId = uuidv4();
    const sacEntry = SAC_PRICE_BOOK[serviceInfo.id] || SAC_PRICE_BOOK['meta-ads'];

    // DPDP explicit consent metadata
    const isManualWithoutConsent = (src.channel === 'Manual Intake' && i % 2 === 1);
    const dpdpConsent = {
      consentGiven: !isManualWithoutConsent,
      consentSourceUrl: isManualWithoutConsent ? '' : 'https://getintofeed.com/#contact',
      consentPolicyVersion: 'v1.2_2026_11',
      consentTimestamp: new Date(Date.now() - (i * 3600000 * 5.5)).toISOString(),
      consentIp: isManualWithoutConsent ? undefined : `49.36.142.${10 + (i % 50)}`
    };

    leads.push({
      id: leadId,
      name: i < 10 ? template.name : `${template.name.split(' ')[0]} ${String.fromCharCode(65 + (i % 26))}.`,
      company: i < 10 ? template.company : `${template.company} Group`,
      phone: `+91 9811${String(10000 + i).padStart(5, '0')}`,
      email: `contact_${i}@${template.company.toLowerCase().replace(/[^a-z]/g, '')}.in`,
      city: loc.city,
      locality: loc.locality,
      state_code: loc.stateCode,
      stateName: loc.stateCode === '07' ? 'Delhi (07 — Intra-State)' : 'Inter-State (18% IGST)',
      isIntraState: loc.stateCode === '07',
      service_interest: serviceInfo.name,
      serviceId: serviceInfo.id,
      sacCode: sacEntry.code,
      caReviewFlag: sacEntry.caReviewFlag,
      dealType,
      dealValue: estimatedBudget,
      budget_monthly: estimatedBudget,
      budget_formatted: `₹${(estimatedBudget / 100000).toFixed(2)} Lakh`,
      stage,
      status: stage === 'Won' ? 'Verified' : stage === 'Lost' ? 'Closed' : slaResolved ? 'Verified' : 'Needs Reply',
      lostReason: stage === 'Lost' ? (i % 2 === 0 ? 'Price / Budget Objection' : 'Selected Competitor') : undefined,
      lostNotes: stage === 'Lost' ? 'Client decided to delay marketing spend until Q2 FY27.' : undefined,
      source: src.channel,
      campaign: src.campaign,
      utm_source: src.utm_source,
      utm_medium: src.utm_medium,
      bottleneck: template.bottleneck,
      
      // Speed-to-lead SLA (isolated timestamp)
      slaDeadlineAt,
      slaResolved,
      firstContactChannel,
      speedToLeadSeconds,
      
      // DPDP Act Digital Consent
      dpdpConsent,

      assigned_to: i % 2 === 0 ? 'Ashish (Founder)' : 'Rahul (Sales Lead)',
      created_at: new Date(Date.now() - (i * 3600000 * 5.5)).toISOString(),
      updated_at: new Date().toISOString(),
      unpaidInvoice: stage === 'Won' ? (i % 2 === 0 ? Math.round(estimatedBudget * 1.18) : 0) : 0,
      notes_count: (i % 4) + 1,
      whatsapp_messages_count: (i % 6) + 1
    });
  }

  return leads;
}

export const seedLeads = generate60SeedLeads();
