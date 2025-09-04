
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../lib/auth.js";
import { readJsonBody, validate, method } from "../../lib/validate.js";
import { createRfqSchema } from "../../validators/rfq.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const auth = requireAuth(req, res, ["BUYER", "SUPPLIER", "ADMIN"]);
    if (!auth) return;
    const rfqs = await prisma.rfq.findMany({ orderBy: { createdAt: "desc" }, include: { lineItems: true } });
    return res.json(rfqs);
  }
  if (req.method === "POST") {
    const auth = requireAuth(req, res, ["BUYER", "ADMIN"]);
    if (!auth) return;
    const body = readJsonBody(req);
    const v = validate(createRfqSchema, body);
    if (!v.ok) return res.status(400).json({ error: v.error });
    const { title, description, dueDate, lineItems } = v.data;
    const rfq = await prisma.rfq.create({
      data: {
        title, description,
        buyerId: auth.id,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        lineItems: { create: lineItems },
      },
      include: { lineItems: true },
    });
    return res.status(201).json(rfq);
  }
  return method(req, res, ["GET", "POST"]);
}
