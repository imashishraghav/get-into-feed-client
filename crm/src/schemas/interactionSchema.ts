import { z } from 'zod';

/**
 * First-Contact & Activity Interaction Schema
 * Strictly enforced to resolve Speed-to-Lead SLA
 */
export const InteractionSchema = z.object({
  lead_id: z.string().uuid().or(z.string().min(1)),
  channel: z.enum(['call', 'whatsapp', 'email']),
  actor: z.string().min(1),
  actorRole: z.enum(['Admin', 'Sales', 'Editor', 'Finance', 'Client']),
  outcome: z.string().min(1),
  concern: z.string().optional(),
  clientFeedback: z.string().optional(),
  repAction: z.string().min(1),
  timestamp: z.string().datetime().or(z.string().min(10)),
  durationSeconds: z.number().optional()
});

export type InteractionInput = z.infer<typeof InteractionSchema>;
