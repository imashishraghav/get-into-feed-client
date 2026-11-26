import { z } from 'zod';

/**
 * DPDP Consent Schema
 * Enforces explicit digital consent capture with origin URL, policy version, and ISO timestamp.
 */
export const DpdpConsentSchema = z.object({
  consentGiven: z.boolean().default(false),
  consentSourceUrl: z.string().url().or(z.string().min(1)),
  consentPolicyVersion: z.string().min(1).default('v1.2_2026_11'),
  consentTimestamp: z.string().datetime().or(z.string().min(10)),
  consentIp: z.string().optional()
});

/**
 * Lead Intake & Validation Schema
 */
export const LeadInputSchema = z.object({
  brand: z.string().min(2, 'Brand/Company name must be at least 2 characters'),
  contact: z.string().min(2, 'Contact person name is required'),
  phone: z.string()
    .min(10, 'Valid 10-digit Indian phone number required')
    .refine((val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10 && /^[6-9]\d{9}$/.test(digits.slice(-10));
    }, 'Phone must be a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)'),
  email: z.string().email('Valid business email address required'),
  stateCode: z.string().length(2, '2-digit GST state code required (e.g. 07 for Delhi)'),
  gstin: z.string().optional().refine((val) => {
    if (!val || val.trim() === '') return true;
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val.trim());
  }, 'Invalid Indian GSTIN format'),
  stage: z.enum(['Captured', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']).default('Captured'),
  dealType: z.enum(['Growth Sprint', 'Service Package', 'Retainer', 'One-off']).default('Growth Sprint'),
  dealValue: z.number().nonnegative('Deal value must be non-negative'),
  owner: z.string().min(1, 'Lead owner is required'),
  source: z.string().min(1, 'Lead source is required'),
  dpdpConsent: DpdpConsentSchema,
  lostReason: z.string().optional(),
  lostNotes: z.string().optional()
});

export type LeadInput = z.infer<typeof LeadInputSchema>;
