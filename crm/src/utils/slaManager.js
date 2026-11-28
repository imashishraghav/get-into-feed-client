/**
 * GetIntoFeed Agency CRM — Speed-to-Lead SLA Manager
 * Enforces the 5-minute first response window.
 * 
 * Strict Rule (Phase A #4):
 * SLA is resolved ONLY when a verified real first contact (call/WhatsApp/email) is logged.
 * Advancing a pipeline stage NEVER resolves an SLA!
 */

export const SLA_STATES = {
  ACTIVE: 'active',         // > 90 seconds remaining
  CRITICAL: 'critical',     // <= 90 seconds remaining (amber warning)
  BREACHED: 'breached',     // 0 seconds remaining (escalated to manager)
  RESPONDED: 'responded'    // Rep initiated WhatsApp, Call, or Email (SLA successfully met)
};

export const SLA_INITIAL_SECONDS = 300; // 5 minutes

/**
 * Calculates current SLA status from timestamp deadline and response state
 */
export function getSlaStatusFromDeadline(deadlineAt, isResolved = false) {
  if (isResolved) return SLA_STATES.RESPONDED;
  if (!deadlineAt) return SLA_STATES.ACTIVE;
  
  const diffSeconds = Math.floor((new Date(deadlineAt).getTime() - Date.now()) / 1000);
  if (diffSeconds <= 0) return SLA_STATES.BREACHED;
  if (diffSeconds <= 90) return SLA_STATES.CRITICAL;
  return SLA_STATES.ACTIVE;
}

/**
 * Resolves Speed-to-Lead SLA upon genuine first contact interaction.
 * Supported channels: 'call' | 'whatsapp' | 'email'.
 */
export function resolveSlaOnFirstContact(lead, channel, actorName = 'Rep') {
  if (lead.slaResolved) {
    return lead; // Already resolved
  }

  const validChannels = ['call', 'whatsapp', 'email'];
  if (!validChannels.includes(channel)) {
    throw new Error(`Invalid interaction channel "${channel}". SLA can only be resolved via call, whatsapp, or email.`);
  }

  const now = new Date();
  const createdAt = lead.created_at ? new Date(lead.created_at) : now;
  const speedToLeadSeconds = Math.max(1, Math.floor((now.getTime() - createdAt.getTime()) / 1000));

  return {
    ...lead,
    slaResolved: true,
    sla_status: SLA_STATES.RESPONDED,
    firstContactChannel: channel,
    firstContactedAt: now.toISOString(),
    firstContactActor: actorName,
    speedToLeadSeconds,
    status: 'Verified',
    updated_at: now.toISOString()
  };
}

/**
 * Validates whether stage movement is allowed, ensuring stage movement DOES NOT resolve SLA.
 */
export function handleStageTransition(lead, nextStage) {
  // Moving stage retains existing SLA resolution status!
  // It NEVER auto-marks slaResolved = true.
  return {
    ...lead,
    stage: nextStage,
    updated_at: new Date().toISOString()
  };
}

/**
 * Escalates a breached lead to the Sales Manager and reassigns
 */
export function handleSlaBreach(lead) {
  return {
    ...lead,
    slaResolved: false,
    sla_status: SLA_STATES.BREACHED,
    escalated_to_manager: true,
    previous_assignee: lead.assigned_to,
    assigned_to: 'Ashish (Founder - Manager Escalation)',
    escalation_reason: '5-minute Speed-to-Lead window breached without outbound touchpoint.',
    escalated_at: new Date().toISOString()
  };
}

/**
 * Formats seconds into MM:SS display string
 */
export function formatSlaCountdown(seconds) {
  if (seconds === null || seconds === undefined) return 'N/A';
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
