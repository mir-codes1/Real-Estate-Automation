# Real Estate Automation Platform — Technical Project Brief

---

## Overview

This project is a full-stack automation platform built for real estate use cases. It ingests sold property listings, uses Google's Gemini AI to generate social media captions, and dispatches those captions through an automated workflow that publishes to external platforms and logs the result — all tracked through a live React dashboard.

The system was designed and built end-to-end: REST API, database, AI integration, webhook orchestration, and frontend. Every layer communicates in a documented, observable way.

---

## The Problem It Solves

Real estate agents spend time manually writing social media posts for every sold property. This platform automates that entire workflow:

1. A listing is entered into the system
2. The AI generates a ready-to-post caption, aware of property details and nearby schools
3. The caption is dispatched to an automation workflow that publishes it
4. The result (success or failure) is logged back and visible in the dashboard

What would take 10–15 minutes of manual work per listing becomes a two-click operation.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Backend API | Node.js + Express | Express 5.2 |
| Frontend | React + Vite | React 19, Vite 8 |
| Styling | Tailwind CSS | v4 |
| Database | SQLite (better-sqlite3) | v12 |
| AI | Google Gemini 2.5 Flash | via `@google/generative-ai` |
| Automation | n8n (self-hosted) | latest |
| Routing | React Router | v7 |
| Tunneling (dev) | ngrok | — |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      React Frontend                          │
│         Dashboard · Listings · Posts · Logs                  │
│              (Vite dev server, port 5173)                    │
└───────────────────────┬──────────────────────────────────────┘
                        │ HTTP /api/* (proxied in dev)
┌───────────────────────▼──────────────────────────────────────┐
│                  Express REST API                            │
│                    (port 3000)                               │
│                                                              │
│  /listings/:id/process                                       │
│      └─► schoolsService (nearby schools lookup)             │
│      └─► captionService (Gemini API call)                   │
│      └─► postsService   (saves draft to DB)                 │
│      └─► logsService    (audit log entry)                   │
│                                                              │
│  /listings/:id/send-to-automation                            │
│      └─► fetches listing + pending post                      │
│      └─► POSTs payload to n8n webhook                       │
│      └─► logsService    (audit log entry)                   │
│                                                              │
│  /api/automation/result  ◄── n8n callback                   │
│      └─► updates post status in DB                          │
│      └─► logsService    (audit log entry)                   │
└───────────────────────┬──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                  SQLite Database                             │
│          listings · posts · logs                             │
└───────────────────────┬──────────────────────────────────────┘
                        │ Webhook dispatch
┌───────────────────────▼──────────────────────────────────────┐
│                   n8n Workflow                               │
│                  (port 5678)                                 │
│                                                              │
│  [Webhook] → [Post to Discord] → [Callback to App]          │
│                    └─► publishes caption                     │
│                              └─► POSTs result back          │
└──────────────────────────────────────────────────────────────┘
```

---

## Database Schema

Three tables with foreign key constraints enforced. SQLite runs in WAL mode for better read concurrency.

```sql
listings (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  address       TEXT    NOT NULL,
  price         REAL    NOT NULL,
  beds          INTEGER NOT NULL,
  baths         INTEGER NOT NULL,
  neighborhood  TEXT    NOT NULL,
  sold_date     TEXT    NOT NULL,
  image_url     TEXT,
  created_at    TEXT    DEFAULT (datetime('now'))
)

posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id    INTEGER NOT NULL REFERENCES listings(id),
  caption       TEXT    NOT NULL,
  platform      TEXT    NOT NULL,   -- discord | twitter | instagram | draft
  status        TEXT    DEFAULT 'pending',  -- pending | posted | failed
  created_at    TEXT    DEFAULT (datetime('now'))
)

logs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id    INTEGER REFERENCES listings(id),
  event_type    TEXT    NOT NULL,   -- process_listing | send_to_automation | automation_result:discord
  message       TEXT    NOT NULL,
  status        TEXT    NOT NULL,   -- success | failed
  created_at    TEXT    DEFAULT (datetime('now'))
)
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/listings` | List all listings |
| POST | `/api/listings` | Create a listing |
| GET | `/api/listings/:id` | Get listing by ID |
| POST | `/api/listings/:id/process` | Generate AI caption + save draft post |
| POST | `/api/listings/:id/send-to-automation` | Dispatch to n8n webhook |
| GET | `/api/posts` | List all posts with listing data |
| GET | `/api/logs` | List all system event logs |
| GET | `/api/logs/:listingId` | Logs for a specific listing |
| POST | `/api/ai/generate-caption` | Generate a caption without saving |
| GET | `/api/schools?address=` | Nearby schools for an address |
| POST | `/api/automation/result` | n8n callback — update post status |

---

## AI Caption Generation

Listings are processed through Google Gemini 2.5 Flash via a structured prompt that enforces:

- Under 280 characters (Twitter-compatible)
- Mentions price (formatted in CAD), beds/baths, and neighborhood
- Incorporates nearby school ratings when available
- Ends with 2–3 relevant hashtags
- Professional but energetic tone

**Example output:**
> Just Sold! ✨ 123 Queen St W in Trinity Bellwoods — 3 bed/2 bath for $1,250,000! Steps from top-rated schools & the heart of Toronto. #TorontoRealEstate #JustSold #TriBell

The prompt is constructed in `captionService.js` and is fully parameterised — every detail comes from the listing record, making it reusable across any property.

---

## n8n Automation Workflow

n8n is a self-hosted workflow automation platform (similar in concept to Zapier or Make, but open source and developer-controlled).

**Workflow: `real-estate-automation`**

```
[Webhook Trigger]
    ↓  receives { listing, post, triggered_at }
[HTTP Request — Post to Discord]
    ↓  POSTs { content: caption } to Discord webhook
[HTTP Request — Callback to App]
    ↓  POSTs { listing_id, platform: "discord", status: "posted", message } to Express
[Respond to Webhook]
    ↓  returns { received: true } to Express
```

The callback closes the loop — the Express app receives the result, updates the post record in the database, and logs the event. The frontend reflects this in real time on the next poll.

**Why n8n instead of posting directly from Express?**

Separating the publishing concern into n8n means the backend doesn't need to manage OAuth tokens, platform-specific APIs, or retry logic. Swapping from Discord to Twitter or Instagram only requires changing the n8n workflow — the Express backend and its contract stay the same.

---

## End-to-End Data Flow

This is the complete lifecycle of a listing from creation to published post:

```
1.  POST /api/listings
    → Listing saved to SQLite

2.  POST /api/listings/1/process
    → Fetch listing from DB
    → Look up nearby schools (by address hash)
    → Send listing + schools to Gemini 2.5 Flash
    → Gemini returns ≤280 char caption
    → Save as post (platform: "draft", status: "pending")
    → Write success log
    → Return { listing, schools, caption, post, log }

3.  POST /api/listings/1/send-to-automation
    → Fetch listing + latest pending post
    → Build payload: { listing, post, triggered_at }
    → POST payload to N8N_WEBHOOK_URL (ngrok → localhost:5678)
    → Write dispatch log
    → Return { message, payload, log }

4.  n8n receives payload
    → HTTP Request: POST caption to Discord webhook
    → Discord publishes the message to channel
    → HTTP Request: POST result to localhost:3000/api/automation/result

5.  POST /api/automation/result
    → Validate payload (listing_id, platform, status, message)
    → Update post record: platform = "discord", status = "posted"
    → Write automation_result log
    → Return { received: true, post, log }

6.  Dashboard
    → Logs page shows full audit trail
    → Posts page shows caption with status: posted / platform: discord
```

---

## Frontend Architecture

Built with React 19 and React Router 7. Four views:

- **Dashboard** — aggregate stats (total listings, posts, logs) + recent activity feed
- **Listings** — property table with Process and Send to Automation action buttons
- **Posts** — card grid of AI-generated captions with platform and status badges
- **Logs** — chronological audit trail of every system event

All data fetching goes through a shared `useFetch` hook that handles loading states, error states, and request cancellation via `AbortController`. Every view is a client component — no SSR, no hydration complexity.

---

## Key Engineering Decisions

**SQLite over PostgreSQL**
SQLite requires zero infrastructure for development and is more than capable for the scale this project targets. The codebase is structured so that swapping to PostgreSQL means updating `src/db/connection.js` to use a connection pool and replacing `CREATE TABLE IF NOT EXISTS` with a migration tool — no controller or service changes required.

**No ORM**
`better-sqlite3` is used directly with prepared statements. For a project of this scope, an ORM adds indirection without benefit. Queries are simple, readable, and easy to audit.

**Separation of concerns across services**
Each service (`captionService`, `postsService`, `logsService`, `schoolsService`) has a single responsibility and is independently testable. Controllers orchestrate services but contain no business logic themselves.

**Audit logging on every significant action**
Every process step, dispatch, and callback writes a log entry. This makes the system fully observable and debuggable without needing to inspect the database directly.

**n8n as the publishing layer**
The Express backend's responsibility ends at dispatching the payload. Platform credentials, retry logic, and API-specific formatting live in n8n. This keeps the backend clean and makes the automation layer swappable without touching application code.

---

## Deployment Configuration

- Backend and frontend env vars are fully documented in `.env.example` and `client/.env.example`
- CORS is configured via `CORS_ORIGIN` env var (defaults to `http://localhost:5173`)
- Vite dev proxy is configurable via `BACKEND_URL` env var
- Production build: `npm run build:client` outputs to `client/dist/` — serve statically behind Nginx with `/api/*` reverse proxied to the backend
- PostgreSQL migration path is documented with the specific code changes required

---

## Skills Demonstrated

| Area | Specifics |
|---|---|
| Backend API design | RESTful routes, controller/service separation, input validation, consistent error handling |
| AI integration | Prompt engineering with structured constraints, Google Generative AI SDK |
| Database | Schema design, relational integrity, prepared statements, WAL mode |
| Webhook orchestration | Fire-and-forget dispatch, structured callback contract, status lifecycle |
| Automation tooling | n8n workflow design, multi-node pipelines, external API calls within workflows |
| Frontend | React 19, React Router 7, custom hooks, component composition |
| Deployment readiness | Environment variable management, CORS, configurable URLs, build scripts |
| Observability | Audit logging on every state transition, full event trail per listing |
