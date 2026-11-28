/**
 * GetIntoFeed Agency CRM — Workload-Aware Sales Routing Engine
 * Routes leads based on budget threshold, service specialization, and round-robin balance.
 */

const SALES_REPS = [
  { id: 'usr_ashish', name: 'Ashish (Founder)', specialization: ['High-Ticket', 'Brand Strategy', 'Web Development & CRO'], minBudget: 120000, activeLeadsCount: 14 },
  { id: 'usr_rahul', name: 'Rahul (Sales Lead)', specialization: ['Performance Marketing & Paid Ads', 'Short-Form Video & Reels'], minBudget: 60000, activeLeadsCount: 18 },
  { id: 'usr_priya', name: 'Priya (Sales Rep)', specialization: ['Search Engine Optimization (SEO)', 'Influencer Marketing', 'General Inbound'], minBudget: 0, activeLeadsCount: 12 }
];

let roundRobinIndex = 0;

export function routeLeadToRep(lead) {
  const budget = lead.budget_monthly || 0;
  const service = lead.service_interest || '';

  // 1. High-Ticket Priority Routing to Founder
  if (budget >= 150000) {
    return {
      repId: 'usr_ashish',
      repName: 'Ashish (Founder)',
      reason: 'High-Ticket enterprise budget (₹1.5L+) routed to Founder'
    };
  }

  // 2. Service Specialization Routing
  const specialist = SALES_REPS.find(
    (rep) => rep.specialization.some((s) => service.toLowerCase().includes(s.toLowerCase())) && budget >= rep.minBudget
  );

  if (specialist) {
    return {
      repId: specialist.id,
      repName: specialist.name,
      reason: `Routed to ${specialist.name} based on service expertise in ${service}`
    };
  }

  // 3. Workload-Balanced Round Robin Fallback
  const candidate = SALES_REPS[roundRobinIndex % SALES_REPS.length];
  roundRobinIndex++;

  return {
    repId: candidate.id,
    repName: candidate.name,
    reason: `Workload-balanced round-robin assignment`
  };
}
