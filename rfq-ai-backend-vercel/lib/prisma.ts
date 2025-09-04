
import { PrismaClient } from "@prisma/client";

// In serverless, it's fine to create a new client per invocation, but we try to reuse across warm invocations.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
