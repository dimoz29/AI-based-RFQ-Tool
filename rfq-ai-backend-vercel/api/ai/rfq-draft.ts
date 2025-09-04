
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../../lib/auth.js";
import { readJsonBody, method } from "../../lib/validate.js";
import { draftRfq } from "../../lib/ai.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, ["POST"])) return;
  const auth = requireAuth(req, res, ["BUYER", "ADMIN"]);
  if (!auth) return;
  const body = readJsonBody<{ prompt?: string }>(req);
  if (!body.prompt) return res.status(400).json({ error: "Missing prompt" });
  return res.json({ draft: draftRfq(body.prompt) });
}
