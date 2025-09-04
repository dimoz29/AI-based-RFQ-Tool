
import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { loginSchema } from "../../validators/auth.js";
import { readJsonBody, validate, method } from "../../lib/validate.js";
import jwt from "jsonwebtoken";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, ["POST"])) return;
  const body = readJsonBody(req);
  const v = validate(loginSchema, body);
  if (!v.ok) return res.status(400).json({ error: v.error });
  const { email, password } = v.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "dev", { expiresIn: "7d" });
  return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}
