# XenoCRM: AI-Native Retail Churn Prevention

XenoCRM is an intelligent, automated CRM tailored for retail brands to detect churn risk and instantly execute personalized win-back campaigns using AI.

## Architecture

```text
    +-----------------+        +------------------+
    |   Frontend      |        | Channel Service  |
    | (React + Vite)  | <----> | (Express Sim)    |
    +--------+--------+        +--------+---------+
             |                          |
             v                          v
    +-----------------+        +------------------+
    |    Backend      | <----> |   Supabase DB    |
    | (Express + AI)  |        | (PostgreSQL)     |
    +-----------------+        +------------------+
```

## How It Works

**1. Churn Scoring (RFM)**
XenoCRM calculates a Churn Risk Score (0-100) using Recency, Frequency, and Monetary metrics. Higher days since last order increases risk, while high average order value categorizes risky customers as "Critical". It automatically segments users into Critical, At Risk, or Safe tiers based on strict retail benchmarks.

**2. AI Integration**
Using Google Gemini AI, the system automatically drafts compelling, context-aware message variants for different risk segments. The prompts include customer stats to ensure offers (e.g. 20% off vs 10% off) match the severity of the churn risk.

**3. Callback Loop**
When a campaign launches, the Backend sends a fire-and-forget payload to the Channel Service. The Channel Service acts as an asynchronous queue simulator, waiting 1-4 seconds before issuing HTTP POST callbacks (`delivered`, `opened`, `clicked`) back to the Backend. The Backend updates the tracking table in real-time.

## Local Setup

1. **Supabase**: Create a project and run the provided SQL schema in the SQL Editor.
2. **Backend**: 
   - `cd backend && npm install`
   - Copy `.env.example` to `.env` and fill in `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEY`. 
   - Run `npm run dev`.
3. **Channel Service**: 
   - `cd channel-service && npm install`
   - Run `npm run dev`.
4. **Frontend**: 
   - `cd frontend && npm install`
   - Create `.env` with `VITE_API_URL=http://localhost:3001`. 
   - Run `npm run dev`.
5. **Seed Data**: Send a `POST` request to `http://localhost:3001/api/customers/seed`.

## Live URLs

- **Frontend**: [Vercel Deployment URL]
- **Backend API**: [Render Deployment URL]
- **Channel Service**: [Render Deployment URL]

## Tech Stack

| Component | Technology |
| --- | --- |
| **Frontend** | React, Vite, Tailwind CSS, React Router, Recharts |
| **Backend** | Node.js, Express, @supabase/supabase-js, Google Gemini AI |
| **Channel Service** | Node.js, Express, Axios (Simulation) |
| **Database** | Supabase (PostgreSQL) |

## Tradeoffs: What I'd do differently at scale

- **Message Queues**: Replace the HTTP callback mechanism with a proper messaging queue like RabbitMQ or AWS SQS to ensure delivery resilience and handle millions of events without dropping callbacks.
- **Batch Processing**: Instead of calculating churn scores in real-time during the seed or via a loop over all customers, I'd move scoring to a nightly cron job or materialized views in the database.
- **WebSocket / SSE**: Replace the 3-second frontend polling in the Performance Tracker with WebSockets or Server-Sent Events for true real-time, low-overhead UI updates.
