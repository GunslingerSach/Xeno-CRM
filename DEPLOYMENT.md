# XenoCRM Deployment Guide

This guide details the steps to deploy all three services for XenoCRM.

## Prerequisites

1. A [Supabase](https://supabase.com) account.
2. A [Render](https://render.com) account (for backend and channel-service).
3. A [Vercel](https://vercel.com) account (for frontend).
4. A Google Gemini API key.

## 1. Setup Supabase Database

1. Create a new project in Supabase.
2. In the Supabase dashboard, go to the **SQL Editor**.
3. Paste the provided database schema and run it to create the tables (`customers`, `campaigns`, `communications`, `communication_events`).
4. Keep your Supabase URL, Anon Key, and Service Role Key handy from Project Settings -> API.

## 2. Deploy Channel Service (Render)

The channel service must be deployed first so its URL can be provided to the backend.

1. Create a new "Web Service" on Render.
2. Connect your GitHub repository.
3. Set the Root Directory to `channel-service`.
4. Build Command: `npm install`
5. Start Command: `node src/index.js`
6. Once deployed, note the generated URL (e.g., `https://xenocrm-channel-service.onrender.com`).

**Environment Variables:**
- `PORT` = `3002`

## 3. Deploy Backend (Render)

1. Create another "Web Service" on Render.
2. Set the Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Add the required Environment Variables:
   - `PORT` = `3001`
   - `SUPABASE_URL` = `<your-supabase-url>`
   - `SUPABASE_SERVICE_ROLE_KEY` = `<your-supabase-service-key>`
   - `GEMINI_API_KEY` = `<your-gemini-key>`
   - `CHANNEL_SERVICE_URL` = `<url-from-step-2>`
6. Once deployed, note the backend URL (e.g., `https://xenocrm-backend.onrender.com`).
7. **Seed Data**: After successful deployment, make a POST request to `https://<backend-url>/api/customers/seed` to populate the Supabase DB.

## 4. Deploy Frontend (Vercel)

1. Import your repository to Vercel.
2. Set the Framework Preset to `Vite`.
3. Set the Root Directory to `frontend`.
4. Vercel will automatically use the `vercel.json` for React Router rewrites.
5. Add Environment Variables:
   - `VITE_API_URL` = `<url-from-step-3>` (The Backend URL)
6. Deploy.

Your AI-native CRM is now live!
