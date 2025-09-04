
import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { ZodSchema } from "zod";

export function readJsonBody<T = any>(req: VercelRequest): T {
  const b: any = (req as any).body;
  if (!b) return {} as T;
  if (typeof b === "string") {
    try { return JSON.parse(b) as T; } catch { return {} as T; }
  }
  return b as T;
}

export function validate<T>(schema: ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const flat = result.error.flatten();
    return { ok: false, error: flat } as const;
  }
  return { ok: true, data: result.data } as const;
}

export function method(req: VercelRequest, res: VercelResponse, allowed: string[]) {
  if (!allowed.includes(req.method || "")) {
    res.setHeader("Allow", allowed.join(", "));
    res.status(405).json({ error: "Method Not Allowed" });
    return false;
  }
  return true;
}
