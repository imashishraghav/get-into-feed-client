/**
 * GetIntoFeed Agency CRM — Duplicate Detection & Merge Engine
 * Identifies duplicate contacts by +91 phone digits, email, and company name similarity.
 */

/**
 * Normalizes Indian phone number to standard 10-digit clean string
 */
export function extract10DigitPhone(raw) {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  return digits.slice(-10);
}

/**
 * Format 10-digit phone to standard Indian E.164 (+91 XXXXX XXXXX)
 */
export function formatIndianPhone(raw) {
  const digits = extract10DigitPhone(raw);
  if (digits.length !== 10) return raw;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/**
 * Normalizes email address
 */
export function normalizeEmail(raw) {
  return (raw || '').trim().toLowerCase();
}

/**
 * Computes simple string similarity (0 to 1) for company names
 */
function companySimilarity(str1, str2) {
  const s1 = (str1 || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = (str2 || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;
  return 0;
}

/**
 * Detects duplicates in existing lead database
 */
export function findDuplicates(candidateLead, existingLeads = []) {
  const candidatePhone10 = extract10DigitPhone(candidateLead.phone);
  const candidateEmail = normalizeEmail(candidateLead.email);
  const matches = [];

  for (const lead of existingLeads) {
    if (lead.id === candidateLead.id) continue;

    const reasons = [];
    let score = 0;

    // Check Phone Collision
    const leadPhone10 = extract10DigitPhone(lead.phone);
    if (candidatePhone10 && leadPhone10 && candidatePhone10 === leadPhone10) {
      score += 0.9;
      reasons.push(`Matching Phone Number (${candidatePhone10})`);
    }

    // Check Email Collision
    const leadEmail = normalizeEmail(lead.email);
    if (candidateEmail && leadEmail && candidateEmail === leadEmail) {
      score += 0.85;
      reasons.push(`Matching Email (${candidateEmail})`);
    }

    // Check Company Similarity
    const compScore = companySimilarity(candidateLead.company, lead.company);
    if (compScore >= 0.8) {
      score += 0.5;
      reasons.push(`Matching Company Name ("${lead.company}")`);
    }

    if (score >= 0.7) {
      matches.push({
        matchedLead: lead,
        confidence: Math.min(1.0, score),
        reasons
      });
    }
  }

  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Merges two leads into a single consolidated record
 */
export function mergeLeads(primaryLead, secondaryLead) {
  return {
    ...primaryLead,
    // Retain highest budget
    budget_monthly: Math.max(primaryLead.budget_monthly || 0, secondaryLead.budget_monthly || 0),
    budget_formatted: `₹${(Math.max(primaryLead.budget_monthly || 0, secondaryLead.budget_monthly || 0) / 100000).toFixed(2)} Lakh`,
    // Consolidate secondary email/phone if missing
    secondary_phone: primaryLead.phone !== secondaryLead.phone ? secondaryLead.phone : null,
    secondary_email: primaryLead.email !== secondaryLead.email ? secondaryLead.email : null,
    // Combine notes count
    notes_count: (primaryLead.notes_count || 0) + (secondaryLead.notes_count || 0),
    whatsapp_messages_count: (primaryLead.whatsapp_messages_count || 0) + (secondaryLead.whatsapp_messages_count || 0),
    merged_with_lead_id: secondaryLead.id,
    updated_at: new Date().toISOString()
  };
}
