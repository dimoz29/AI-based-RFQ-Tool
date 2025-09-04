
# RFQ AI Backend – Vercel Functions

This is a serverless version of the RFQ AI backend designed for **Vercel**.

## Structure
- `api/` — Serverless functions (one file per endpoint)
- `lib/` — Shared libs (Prisma, auth, validation, AI heuristics)
- `validators/` — Zod schemas
- `prisma/schema.prisma` — Database schema

## Deploy to Vercel
1. Create a new Vercel project from this folder (zip upload or Git repo).
2. Configure **Environment Variables**:
   - `JWT_SECRET` — a strong secret
   - `DATABASE_URL` — Prefer **Prisma Accelerate** or a pooled Postgres connection
     - Accelerate (recommended): `prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY`
     - Neon/Supabase/Railway pooled example:
       `postgresql://user:pass@host/db?sslmode=require&pgbouncer=true&connection_limit=1`
3. Set a **Postgres** database (Neon/Supabase/Railway) and copy its connection string.
4. On first deploy, Vercel runs `vercel-build` (`prisma generate`). Run migrations from your local machine pointed at the remote DB:
   ```bash
   npm i
   npx prisma migrate deploy # or prisma migrate dev (locally) after setting DATABASE_URL to your remote DB
   ```
5. Your API routes will be available under:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `GET|POST /api/rfqs`
   - `GET|PATCH /api/rfqs/[id]`
   - `GET|POST /api/rfqs/[id]/responses`
   - `POST /api/ai/rfq-draft`
   - `POST /api/ai/summarize/[rfqId]`
   - `GET /api/ai/recommendation/[rfqId]`

## Notes
- These functions run on **Node.js runtime** (not Edge) to support Prisma.
- For heavier traffic, enable connection pooling or Prisma Accelerate to avoid timeouts.
- CORS is typically handled at the frontend; if needed, add CORS headers per route based on `Origin`.
