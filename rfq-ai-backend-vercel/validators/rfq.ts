
import { z } from "zod";
export const lineItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  unit: z.string().min(1),
  notes: z.string().optional(),
});
export const createRfqSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  lineItems: z.array(lineItemSchema).min(1),
});
export const updateRfqSchema = createRfqSchema.partial();
