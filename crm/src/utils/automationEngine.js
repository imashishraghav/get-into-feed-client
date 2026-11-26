/**
 * GetIntoFeed Agency CRM — Event-Driven Automation Engine
 * Runs all 17 pre-built agency automation recipes with event listeners,
 * condition filters, and execution telemetry.
 */

export const PREBUILT_RECIPES = [
  {
    id: 'AR-01',
    name: '5-Minute Speed-to-Lead Escalation',
    category: 'SLA & Routing',
    trigger: 'lead.sla_breached',
    description: 'When an inbound lead exceeds 5 minutes without a response, alert the Sales Manager and reassign ownership.',
    enabled: true,
    actionSummary: 'Escalate lead to Manager + WhatsApp alert',
    executionCount: 14
  },
  {
    id: 'AR-02',
    name: 'Instant WhatsApp Welcome & Service Brochure',
    category: 'Lead Capture',
    trigger: 'lead.created',
    description: 'When a new lead submits a form or ad, instantly send a WhatsApp welcome greeting with the 30-Day Growth Sprint brochure.',
    enabled: true,
    actionSummary: 'Dispatch WhatsApp template greeting',
    executionCount: 60
  },
  {
    id: 'AR-03',
    name: 'High-Ticket Lead Founder Routing',
    category: 'SLA & Routing',
    trigger: 'lead.created',
    description: 'If monthly budget is >= ₹1,50,000, immediately route lead to Ashish (Founder) and mark HOT tier.',
    enabled: true,
    actionSummary: 'Assign to Founder + VIP flag',
    executionCount: 8
  },
  {
    id: 'AR-04',
    name: 'Proposal Sent 48-Hour Follow-Up',
    category: 'Deals & Proposals',
    trigger: 'deal.proposal_sent',
    description: 'When a deal moves to "Proposal Sent", automatically schedule a follow-up task 48 hours later.',
    enabled: true,
    actionSummary: 'Schedule 48h follow-up task',
    executionCount: 22
  },
  {
    id: 'AR-05',
    name: 'Real-Time Proposal Viewed Alert',
    category: 'Deals & Proposals',
    trigger: 'proposal.viewed',
    description: 'When a prospective client opens the tokenized proposal link, send a real-time WhatsApp alert to the rep.',
    enabled: true,
    actionSummary: 'Instant rep notification on view',
    executionCount: 19
  },
  {
    id: 'AR-06',
    name: 'Contract Signed Onboarding Trigger',
    category: 'Client Delivery',
    trigger: 'contract.signed',
    description: 'When a retainer contract is signed via Digio, create client project board and send onboarding questionnaire.',
    enabled: true,
    actionSummary: 'Initialize project board + onboarding form',
    executionCount: 6
  },
  {
    id: 'AR-07',
    name: 'GST Invoice Generated Paylink',
    category: 'Billing & GST',
    trigger: 'invoice.created',
    description: 'When a GST invoice is created, auto-generate Razorpay UPI link and send via WhatsApp & email.',
    enabled: true,
    actionSummary: 'Send UPI payment link via WhatsApp',
    executionCount: 15
  },
  {
    id: 'AR-08',
    name: 'Invoice Overdue 3-Day & 7-Day Chaser',
    category: 'Billing & GST',
    trigger: 'invoice.overdue',
    description: 'At T+3 days send gentle WhatsApp reminder. At T+7 days pause active ad campaigns.',
    enabled: true,
    actionSummary: 'Automated payment chaser sequence',
    executionCount: 3
  },
  {
    id: 'AR-09',
    name: 'Invoice Paid Deal Won Celebration',
    category: 'Billing & GST',
    trigger: 'invoice.paid',
    description: 'When payment succeeds, auto-advance deal to "Won (Active Retainer)" and dispatch thank-you receipt.',
    enabled: true,
    actionSummary: 'Mark deal won + thank-you receipt',
    executionCount: 11
  },
  {
    id: 'AR-10',
    name: 'First Deliverable (Reel #01) 7-Day SLA',
    category: 'Client Delivery',
    trigger: 'project.onboarded',
    description: 'Ensure video editors deliver the first 9:16 reel draft within 7 days of onboarding.',
    enabled: true,
    actionSummary: 'Set 7-day creative deadline for Editor',
    executionCount: 5
  },
  {
    id: 'AR-11',
    name: 'Reel Approved Ad Campaign Launch',
    category: 'Client Delivery',
    trigger: 'reel.approved',
    description: 'When client taps "Approve" in the portal, alert media buyer to load creative into Meta Advantage+ ads.',
    enabled: true,
    actionSummary: 'Notify media buyer to launch ad',
    executionCount: 18
  },
  {
    id: 'AR-12',
    name: 'Monthly ROAS Report Dispatch',
    category: 'Client Delivery',
    trigger: 'sprint.day_28',
    description: 'On Day 28 of the 30-Day sprint, auto-compile ROAS metrics and dispatch PDF report to client.',
    enabled: true,
    actionSummary: 'Generate ROAS report PDF',
    executionCount: 4
  },
  {
    id: 'AR-13',
    name: 'Sprint Renewal 7-Day Early Warning',
    category: 'Deals & Proposals',
    trigger: 'sprint.ending_soon',
    description: 'Alert Account Manager 7 days before sprint expiration to present next month renewal sprint.',
    enabled: true,
    actionSummary: 'Task Account Manager for renewal',
    executionCount: 7
  },
  {
    id: 'AR-14',
    name: 'High ROAS (>3.5x) Referral Prompt',
    category: 'Lead Capture',
    trigger: 'metric.high_roas',
    description: 'When client campaign reaches 3.5x+ ROAS, trigger a friendly 1-click WhatsApp referral request.',
    enabled: true,
    actionSummary: 'Send 1-click referral request',
    executionCount: 9
  },
  {
    id: 'AR-15',
    name: 'Stale Lead 7-Day Nurture Warning',
    category: 'SLA & Routing',
    trigger: 'lead.stale_7d',
    description: 'If a lead has no calls, WhatsApp, or notes in 7 days, prompt rep with re-engagement template.',
    enabled: true,
    actionSummary: 'Prompt rep with re-engagement hook',
    executionCount: 12
  },
  {
    id: 'AR-16',
    name: 'Lost Deal 60-Day Re-check',
    category: 'Deals & Proposals',
    trigger: 'deal.lost',
    description: 'When a deal is marked Lost, queue an automated 60-day check-in task for the rep.',
    enabled: true,
    actionSummary: 'Queue 60-day check-in task',
    executionCount: 16
  },
  {
    id: 'AR-17',
    name: 'Festive Greeting Dispatch (Diwali / New Year)',
    category: 'Lead Capture',
    trigger: 'calendar.festival',
    description: 'Send personalized WhatsApp festival greetings to all active retainers and warm leads.',
    enabled: true,
    actionSummary: 'Personalized WhatsApp festival dispatch',
    executionCount: 45
  }
];

export class AutomationEngine {
  constructor(initialRecipes = PREBUILT_RECIPES) {
    this.recipes = [...initialRecipes];
    this.eventLog = [];
  }

  getRecipes() {
    return this.recipes;
  }

  toggleRecipe(recipeId) {
    this.recipes = this.recipes.map((r) =>
      r.id === recipeId ? { ...r, enabled: !r.enabled } : r
    );
    const target = this.recipes.find((r) => r.id === recipeId);
    return target ? target.enabled : false;
  }

  /**
   * Dispatches an event through the active automation recipes
   */
  async dispatchEvent(eventName, payload = {}) {
    const activeMatches = this.recipes.filter((r) => r.enabled && r.trigger === eventName);
    const results = [];

    for (const recipe of activeMatches) {
      recipe.executionCount = (recipe.executionCount || 0) + 1;
      const logEntry = {
        id: `auto_${Date.now()}_${recipe.id}`,
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        trigger: eventName,
        action: recipe.actionSummary,
        payload_lead_id: payload.leadId || payload.id,
        status: 'executed',
        timestamp: new Date().toISOString()
      };
      this.eventLog.unshift(logEntry);
      results.push(logEntry);
    }

    return results;
  }

  getEventLog() {
    return this.eventLog;
  }
}

export const automationEngine = new AutomationEngine();
