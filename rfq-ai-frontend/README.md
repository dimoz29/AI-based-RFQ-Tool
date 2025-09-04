
# RFQ AI Frontend (Vite + React)

## Deploy to Vercel
1. Import this folder as a new project.
2. Set **Build Command**: `npm run build`
3. Set **Output Directory**: `dist`
4. Add **Environment Variable**: `VITE_API_URL` → URL of your backend API (e.g., https://rfq-api.onrender.com/api).
   - For local dev: `VITE_API_URL=http://localhost:4000/api`
5. Deploy.

## Local Development
```bash
npm i
cp .env.example .env.local
npm run dev
```
