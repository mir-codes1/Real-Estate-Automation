# Real Estate Automation

A full-stack automation platform for real estate agents. It ingests sold property listings, generates AI-powered social media captions using Google Gemini, and dispatches them to an n8n workflow for multi-platform publishing — all tracked through a live dashboard.

Built as a personal project to demonstrate end-to-end systems thinking: REST API design, AI integration, webhook orchestration, and a clean React frontend wired together without unnecessary abstraction.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 5 |
| Frontend | React 19, Vite, Tailwind CSS 4 |
| Database | SQLite (better-sqlite3) |
| AI | Google Gemini 2.5 Flash |
| Automation | n8n (self-hosted or cloud) |
| Routing | React Router 7 |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                           │
│   Dashboard · Listings · Posts · Logs  (served from /dist)     │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP /api/*
┌────────────────────────▼────────────────────────────────────────┐
│                     Express API (src/)                          │
│                                                                 │
│  listings ──► /process ──► schools service                     │
│                        ──► Gemini caption service               │
│                        ──► posts service (saves draft)          │
│                        ──► logs service                         │
│                                                                 │
│  /send-to-automation ──► n8n webhook (POST)                     │
│  /api/automation/result ◄── n8n callback (POST)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                     SQLite Database                             │
│              listings · posts · logs                            │
└─────────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      n8n Workflow                               │
│   Receives payload ──► publishes to Twitter/Instagram           │
│   ──► POSTs result back to /api/automation/result               │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
real-estate-automation/
├── src/                        # Express backend
│   ├── server.js               # Entry point
│   ├── app.js                  # Express setup, CORS, middleware, routes
│   ├── controllers/            # Request handlers (one per resource)
│   ├── routes/                 # Route definitions
│   ├── services/               # Business logic (caption, posts, logs, schools)
│   ├── middleware/             # requestLogger, validateId
│   └── db/
│       ├── connection.js       # SQLite connection (WAL mode, FK constraints)
│       └── schema.js           # Table initialization on startup
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── pages/              # Dashboard, Listings, Posts, Logs
│   │   ├── components/         # Sidebar, TopBar, StatusBadge, LoadingSpinner
│   │   └── hooks/useFetch.js   # Generic data fetching with abort support
│   ├── vite.config.js          # Dev proxy to backend
│   └── dist/                   # Production build output
├── scripts/seed.js             # Seed database with sample listings
├── data/                       # SQLite database files (gitignored)
└── .env.example                # Environment variable documentation
```

---

## Setup

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- n8n (optional — needed only for the automation dispatch step)

### Install

```bash
# Install backend and frontend dependencies
npm run install:all
```

### Configure environment

```bash
# Backend
cp .env.example .env
# Edit .env — fill in GEMINI_API_KEY at minimum

# Frontend (optional for dev — defaults to localhost:3001)
cp client/.env.example client/.env
```

### Database

```bash
# Schema is created automatically on server start.
# Seed sample Toronto listings:
npm run seed
```

### Run (development)

```bash
# Terminal 1 — backend (http://localhost:3001)
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client && npm run dev
```

### Build (production)

```bash
# Build React app to client/dist/
npm run build:client

# Start backend
npm start
```

Serve `client/dist/` as a static site and reverse-proxy `/api/*` to the backend. With Nginx:

```nginx
location /api/ {
    proxy_pass http://localhost:3001;
}
location / {
    root /path/to/client/dist;
    try_files $uri /index.html;
}
```

---

## Environment Variables

### Backend (`.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3001` | Port the Express server listens on |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `DB_PATH` | No | `./data/real_estate.db` | Path to SQLite database file |
| `GEMINI_API_KEY` | **Yes** | — | Google Gemini API key |
| `N8N_WEBHOOK_URL` | No | — | n8n webhook URL for automation dispatch |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed frontend origin |

### Frontend (`client/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `BACKEND_URL` | No | `http://localhost:3001` | Backend URL for Vite dev proxy |

> `BACKEND_URL` is only used during `npm run dev`. It is not bundled into the production build.

### PostgreSQL (future)

SQLite is used for local development. For production, swap to PostgreSQL:

1. Replace `better-sqlite3` with `pg`
2. Update `src/db/connection.js` to use a connection pool
3. Replace `DB_PATH` with `DATABASE_URL=postgresql://user:pass@host:5432/real_estate`
4. Add a migration tool (Knex, node-pg-migrate) in place of the `CREATE TABLE IF NOT EXISTS` schema init

---

## API Reference

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ status: "ok", timestamp }` |

### Listings

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/listings` | List all listings |
| `POST` | `/api/listings` | Create a listing |
| `GET` | `/api/listings/:id` | Get a listing by ID |
| `POST` | `/api/listings/:id/process` | Generate AI caption and save draft post |
| `POST` | `/api/listings/:id/send-to-automation` | Send draft post to n8n webhook |

**POST `/api/listings` body:**
```json
{
  "address": "123 Queen St W, Toronto",
  "price": 1250000,
  "beds": 3,
  "baths": 2,
  "neighborhood": "Trinity Bellwoods",
  "sold_date": "2024-11-15",
  "image_url": "https://..."
}
```

### Posts

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/posts` | List all posts with listing details |

### Logs

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/logs` | List all system event logs |
| `GET` | `/api/logs/:listingId` | Logs for a specific listing |

### AI

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/ai/generate-caption` | Generate a caption without saving |

### Schools

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/schools?address=...` | Get nearby schools for an address |

### Automation

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/automation/result` | Callback endpoint for n8n to post results |

**POST `/api/automation/result` body:**
```json
{
  "listing_id": 1,
  "platform": "instagram",
  "status": "posted",
  "message": "Post published successfully"
}
```

Valid `platform` values: `twitter`, `instagram`, `draft`  
Valid `status` values: `posted`, `failed`

---

## End-to-End Workflow

This is the full lifecycle from listing ingestion to automation result:

```
1. Create listing
   POST /api/listings
   → listing saved to SQLite

2. Process listing
   POST /api/listings/1/process
   → fetches nearby schools (mock data, swappable with Google Places)
   → sends listing + schools to Gemini 2.5 Flash
   → Gemini returns a ≤280 char "Just Sold!" caption with hashtags
   → caption saved as a pending draft post in `posts` table
   → success logged to `logs` table
   → returns { listing, schools, caption, post, log }

3. Send to automation
   POST /api/listings/1/send-to-automation
   → fetches listing + latest pending post
   → POSTs payload to N8N_WEBHOOK_URL
   → n8n workflow receives { listing, post, triggered_at }
   → event logged to `logs` table

4. n8n publishes the post
   → n8n publishes caption to Twitter and/or Instagram
   → n8n POSTs result back to /api/automation/result

5. Callback received
   POST /api/automation/result
   → validates payload (platform, status, listing_id, message)
   → updates post record with final platform + status
   → logs result to `logs` table
   → frontend dashboard reflects updated status
```

---

## Dashboard

The React frontend provides four views:

- **Dashboard** — stats (total listings, posts, logs) + recent activity
- **Listings** — table with Process and Send to Automation action buttons
- **Posts** — card grid of generated captions with platform and status badges
- **Logs** — chronological audit trail of all system events

All views poll the API via a shared `useFetch` hook with request cancellation.

---

## About This Project

This project was built to demonstrate practical integration of several technologies that typically appear in production automation systems:

- **REST API design** — clean separation of controllers, services, and routes; consistent error handling and validation
- **AI integration** — prompt engineering with structured constraints (character limit, tone, format); Gemini 2.5 Flash via the Google Generative AI SDK
- **Webhook orchestration** — fire-and-forget dispatch to n8n with a structured callback contract for status updates
- **Audit logging** — every significant action (process, dispatch, callback) writes a log entry, making the system observable and debuggable
- **React architecture** — custom data fetching hook, component composition, React Router for navigation
- **Deployment readiness** — CORS configuration, configurable environment variables, production build scripts, documented PostgreSQL migration path

The codebase is intentionally kept lean — no ORM, no test framework bolted on, no configuration layers that obscure what the system is actually doing. The goal was to ship something that works end-to-end and is easy to read.
