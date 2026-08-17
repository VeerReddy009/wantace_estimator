# Northline Roofing Config-Driven Estimator

Full-stack monorepo with two surfaces:

- Public Estimator (dynamic runtime config, no frontend pricing hardcoding)
- Owner Panel (authenticated config editor + lead viewer)

## Live Deployment Links

- Frontend: Add your Vercel/Netlify URL here
- Backend API: Add your Render/Railway URL here

## Tech Stack

- Client: React + Vite
- Server: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT login for owner panel

## Monorepo Structure

- `client/` React app
- `server/` Express API
- `DECISIONS.md` architecture and formula decisions
- `AI_LOG.md` AI usage and corrections

## Environment Variables

### Server (`server/.env`)

Copy from `server/.env.example`.

- `PORT=4000`
- `DATABASE_URL=...`
- `CLIENT_URL=http://localhost:5173`
- `JWT_SECRET=replace_with_a_long_secret`
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=roofing2026!`
- `NODE_ENV=development`

### Client (`client/.env`)

Copy from `client/.env.example`.

- `VITE_API_BASE_URL=http://localhost:4000/api`

## Local Setup (Clean Clone)

1. Install dependencies:
   - `npm install`
   - `cd server && npm install`
   - `cd ../client && npm install`
2. Create env files:
   - `server/.env` from `server/.env.example`
   - `client/.env` from `client/.env.example`
3. Run both apps from repo root:
   - `npm run dev`
4. Open:
   - Public estimator: `http://localhost:5173`
   - Admin login: `http://localhost:5173/admin/login`

## API Endpoints

### Public

- `GET /api/config`
- `POST /api/estimate`

### Owner Auth

- `POST /api/auth/login`

### Owner Protected

- `GET /api/admin/config`
- `PUT /api/admin/config`
- `GET /api/admin/leads`

## Admin Test Credentials

- Username: `admin`
- Password: `roofing2026!`

## Deployment Notes

1. Provision MongoDB (Atlas).
2. Deploy `server` to Render/Railway and set all `server/.env` vars.
3. Deploy `client` to Vercel/Netlify and set `VITE_API_BASE_URL` to deployed API URL (include `/api`).
4. Set `CLIENT_URL` in backend to deployed frontend origin.
5. Validate owner auth and config edit round-trip in production.

## Assignment Validation Checklist Mapping

- Dynamic frontend questions/options/rates: done via `GET /api/config` + runtime renderer.
- Server-side formula and lead persistence: done in `/api/estimate`.
- Auth-protected owner panel: JWT login + protected admin endpoints.
- Config changes update estimator behavior without redeploy: owner updates persisted config in DB and public estimator always reads active config at runtime.
