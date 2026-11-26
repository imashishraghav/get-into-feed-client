import { z } from 'zod';

/**
 * Invoice Validation Schema with Section 393 TDS & Delhi 07 GST
 */
export const InvoiceCreateSchema = z.object({
  lead_id: z.string().uuid().or(z.string().min(1)),
  clientName: z.string().min(2),
  gstin: z.string().optional(),
  stateCode: z.string().length(2),
  isIntraState: z.boolean(),
  baseAmount: z.number().positive('Invoice base amount must be greater than zero'),
  sacCode: z.string().min(6),
  sec393Item: z.enum([
    'sec_393_item_1_ind',
    'sec_393_item_1_corp',
    'sec_393_item_4_tech',
    'sec_393_item_4_prof'
  ]),
  dueDate: z.string().min(10)
});

export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;
