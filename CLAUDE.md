# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Development
npm run dev                  # Backend on http://localhost:3001 (nodemon)
cd client && npm run dev     # Frontend on http://localhost:5173 (Vite)

# Production build
npm run build:client         # Builds React app to client/dist/
npm start                    # Starts Express server (serves /api only)

# Database
npm run seed                 # Seed sample Toronto listings via scripts/seed.js
# Schema is auto-created on server start — no migration step needed
```

There is no test framework configured.

## Architecture

**Monorepo**: Express backend in `src/`, React frontend in `client/`, SQLite database in `data/`.

**Backend** (`src/`) — CommonJS (`"type": "commonjs"`):
- `server.js` → `app.js` → routes → controllers → services → db
- Each resource has its own route file (`routes/`), controller(s) (`controllers/`), and service (`services/`)
- `processController.js` is the core: orchestrates schools lookup → Gemini caption → post save → log write in a single `/api/listings/:id/process` call
- `callbackController.js` handles the `/api/automation/result` webhook from n8n updating post status
- `src/db/connection.js` exports a single synchronous `better-sqlite3` instance (WAL mode, FK constraints enabled); all queries are synchronous
- Schema initialized in `src/db/schema.js` on startup

**Frontend** (`client/src/`) — ESM, React 19, Tailwind CSS 4:
- Four pages: `Dashboard`, `Listings`, `Posts`, `Logs`
- `useFetch(url)` hook handles all data fetching with abort-on-unmount; returns `{ data, loading, error }`
- During dev, Vite proxies `/api/*` to the backend URL set in `client/.env` (`BACKEND_URL`, defaults to `http://localhost:3000`)

**Key data flow**:
1. `POST /api/listings/:id/process` → schools service + Gemini caption → saves `posts` row (status `pending`) + `logs` row
2. `POST /api/listings/:id/send-to-automation` → POSTs to `N8N_WEBHOOK_URL` → n8n publishes and calls back
3. `POST /api/automation/result` → updates post platform/status + writes log

## Environment Variables

Backend `.env`:
- `GEMINI_API_KEY` — required for caption generation
- `N8N_WEBHOOK_URL` — required for automation dispatch
- `PORT` — defaults to `3001`
- `DB_PATH` — defaults to `./data/real_estate.db`
- `CORS_ORIGIN` — defaults to `http://localhost:5173`

Frontend `client/.env` (dev only, not bundled):
- `BACKEND_URL` — Vite proxy target, defaults to `http://localhost:3000`

## Deployment Notes

- The backend is deployed to Heroku; the frontend is deployed to Vercel
- Vercel rewrites `/api/*` to the Heroku backend (configured in `vercel.json`)
- `/api/seed` is a live endpoint (not just a script) to seed the Heroku web dyno's database
- The deployed stack still uses SQLite — the `data/` directory is ephemeral on Heroku (resets on dyno restart)
