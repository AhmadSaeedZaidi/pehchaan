# Pehchaan — پہچان

> **The proving ground for unrecognised developers.**
> An open infrastructure layer that maps informal tech talent to formal economic opportunities.

Pehchaan gives self-taught developers a verifiable, objective ledger of their capabilities — through adversarial code debugging, not passive portfolios.

---

## Platform

| Mode | Audience | Purpose |
|---|---|---|
| **The Sandbox** | Novice developers | Zero-penalty training, hints, progressive difficulty |
| **The Arena** | Experienced developers | Timed challenges, immutable badges, Pehchaan Trust Score |

---

## Tech Stack

- **Frontend** — Next.js 16, React 19, Tailwind CSS v3
- **Code Editor** — Monaco Editor (VS Code's engine)
- **Database** — Neon (serverless PostgreSQL)
- **AI Evaluation** — Google Gemini API (`gemma-4-31b-it`)
- **Profile Enrichment** — Tavily API (optional)

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/your-username/pehchaan.git
cd pehchaan
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Neon PostgreSQL — https://neon.tech (free tier works)
DATABASE_URL=postgresql://...

# Google AI Studio — https://aistudio.google.com/apikey
GEMINI_API_KEY=AIza...

# Tavily (optional) — https://tavily.com
TAVILY_API_KEY=tvly-...
```

### 3. Run

```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "initial commit"
git push origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"** → select your `pehchaan` repo
3. Vercel auto-detects Next.js — leave defaults as-is
4. Click **"Deploy"** (first deploy will fail without env vars — that's ok)

### Step 3 — Add Environment Variables

In the Vercel dashboard → **Settings → Environment Variables**, add:

| Name | Value | Environments |
|---|---|---|
| `DATABASE_URL` | Your Neon connection string | Production, Preview, Development |
| `GEMINI_API_KEY` | Your Google AI Studio key | Production, Preview, Development |
| `TAVILY_API_KEY` | Your Tavily key *(optional)* | Production, Preview, Development |

> **Tip:** In Neon, create a separate branch for Preview deployments and use that connection string for the Preview environment.

### Step 4 — Redeploy

Go to **Deployments → your latest deploy → Redeploy** (or push a new commit). The app will be live at `https://your-project.vercel.app`.

### Step 5 — Custom Domain *(optional)*

In Vercel → **Settings → Domains** → add `pehchaan.pk` or your custom domain. Update DNS per Vercel's instructions.

---

## Database Schema

The schema auto-creates on first API request (no manual migration needed):

```sql
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,
  github_username TEXT UNIQUE NOT NULL,
  pts_score       INTEGER NOT NULL DEFAULT 150,
  badges          TEXT[]  NOT NULL DEFAULT '{}',
  status          TEXT    NOT NULL DEFAULT 'Unverified',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## API Reference

### `POST /api/onboard`
Creates a new user profile.
```json
{ "githubUsername": "AhmadSaeedZaidi" }
```

### `POST /api/verify`
Grades submitted code using Gemini and updates the user's Trust Score.
```json
{
  "userId": "user_...",
  "challengeId": "react-state-1",
  "submittedCode": "..."
}
```

### `GET /api/verify?userId=...`
Returns a user's current score, status, and completed challenges.

---

## SDG Alignment

| Goal | How |
|---|---|
| **SDG 4** — Quality Education | Validates self-taught skills without institutional gatekeeping |
| **SDG 8** — Decent Work | Formalises informal tech talent for the gig economy |
| **SDG 10** — Reduced Inequalities | Removes geographic and credential-based barriers |
