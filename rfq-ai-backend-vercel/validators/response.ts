
import { z } from "zod";
export const createResponseSchema = z.object({
  message: z.string().min(1),
  priceTotal: z.number().positive().optional(),
  leadDays: z.number().int().positive().optional(),
});
