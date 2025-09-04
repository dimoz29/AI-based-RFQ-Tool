
import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";

export type Role = "BUYER" | "SUPPLIER" | "ADMIN";
export type JwtPayload = { id: string; role: Role };

export function getAuth(req: VercelRequest): JwtPayload | null {
  const header = (req.headers["authorization"] || req.headers["Authorization"]) as string | undefined;
  const token = header && header.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev") as JwtPayload;
    return payload;
  } catch {
    return null;
  }
}

export function requireAuth(req: VercelRequest, res: VercelResponse, roles?: Role[]): JwtPayload | null {
  const payload = getAuth(req);
  if (!payload) {
    res.status(401).json({ error: "Missing or invalid token" });
    return null;
  }
  if (roles && !roles.includes(payload.role)) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }
  return payload;
}
