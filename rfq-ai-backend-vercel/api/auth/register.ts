
import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { registerSchema } from "../../validators/auth.js";
import { readJsonBody, validate, method } from "../../lib/validate.js";
import jwt from "jsonwebtoken";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, ["POST"])) return;
  const body = readJsonBody(req);
  const v = validate(registerSchema, body);
  if (!v.ok) return res.status(400).json({ error: v.error });
  const { email, password, name, role } = v.data;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { email, password: hashed, name, role } });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "dev", { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e: any) {
    if (e.code === "P2002") return res.status(409).json({ error: "Email already exists" });
    return res.status(500).json({ error: "Server error" });
  }
}
