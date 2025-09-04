
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../lib/prisma.js";
import { requireAuth } from "../../../lib/auth.js";
import { readJsonBody, validate, method } from "../../../lib/validate.js";
import { createResponseSchema } from "../../../validators/response.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string };
  if (req.method === "GET") {
    const auth = requireAuth(req, res, ["BUYER", "SUPPLIER", "ADMIN"]);
    if (!auth) return;
    const responses = await prisma.supplierResponse.findMany({ where: { rfqId: id }, orderBy: { createdAt: "desc" } });
    return res.json(responses);
  }
  if (req.method === "POST") {
    const auth = requireAuth(req, res, ["SUPPLIER", "ADMIN"]);
    if (!auth) return;
    const body = readJsonBody(req);
    const v = validate(createResponseSchema, body);
    if (!v.ok) return res.status(400).json({ error: v.error });
    const { message, priceTotal, leadDays } = v.data;
    const responseRec = await prisma.supplierResponse.create({
      data: { rfqId: id, supplierId: auth.id, message, priceTotal, leadDays },
    });
    return res.status(201).json(responseRec);
  }
  return method(req, res, ["GET", "POST"]);
}
