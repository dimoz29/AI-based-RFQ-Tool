
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../lib/auth.js";
import { readJsonBody, validate, method } from "../../lib/validate.js";
import { updateRfqSchema } from "../../validators/rfq.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string };
  if (req.method === "GET") {
    const auth = requireAuth(req, res, ["BUYER", "SUPPLIER", "ADMIN"]);
    if (!auth) return;
    const rfq = await prisma.rfq.findUnique({ where: { id }, include: { lineItems: true, responses: true } });
    if (!rfq) return res.status(404).json({ error: "RFQ not found" });
    return res.json(rfq);
  }
  if (req.method === "PATCH") {
    const auth = requireAuth(req, res, ["BUYER", "ADMIN"]);
    if (!auth) return;
    const body = readJsonBody(req);
    const v = validate(updateRfqSchema, body);
    if (!v.ok) return res.status(400).json({ error: v.error });
    const rfq = await prisma.rfq.update({ where: { id }, data: v.data, include: { lineItems: true } });
    return res.json(rfq);
  }
  return method(req, res, ["GET", "PATCH"]);
}
