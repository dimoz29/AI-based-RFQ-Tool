
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../../../lib/auth.js";
import { prisma } from "../../../lib/prisma.js";
import { recommendBest } from "../../../lib/ai.js";
import { method } from "../../../lib/validate.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, ["GET"])) return;
  const auth = requireAuth(req, res, ["BUYER", "ADMIN"]);
  if (!auth) return;
  const { rfqId } = req.query as { rfqId: string };
  const responses = await prisma.supplierResponse.findMany({ where: { rfqId } });
  return res.json(recommendBest(responses));
}
