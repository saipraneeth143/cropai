# 🌾 CropAI — Full-Stack Deployment & Setup Guide

CropAI is an AI-powered agricultural advisory platform. This guide provides the complete, step-by-step instructions to set up the project locally and host the **Frontend on Vercel** and the **Backend on Render** with **Supabase** for database & authentication.

---

## 🏗️ Architecture Overview

- **Frontend:** React + Vite + Tailwind CSS (Hosted on **Vercel**)
- **Backend:** Node.js + Express REST API (Hosted on **Render**)
- **Database & Auth:** PostgreSQL + Row Level Security (Hosted on **Supabase**)
- **AI Inference:** Google Gemini API / Groq SDK

```
User Browser (Vercel Frontend)
       │
       ▼ (HTTPS REST API via VITE_API_BASE_URL)
Backend Server (Render Web Service)
       │
       ├──► Supabase (PostgreSQL Database & Auth)
       └──► Gemini / Groq API (AI Crop Advisory)
```

---

## 📁 Repository Structure

```
cropai/
├── client/                     # Frontend Vite + React application
│   ├── src/                    # Components, pages, Supabase client
│   ├── .env                    # Local frontend env variables
│   ├── package.json
│   ├── vercel.json             # SPA route rewrites for Vercel
│   └── vite.config.js
├── server/                     # Backend Express.js REST API
│   ├── controllers/            # Farm & advisory logic
│   ├── middleware/             # Supabase JWT authentication
│   ├── routes/                 # Express API route endpoints
│   ├── .env                    # Local backend secrets
│   ├── index.js                # Server entry point
│   └── package.json
├── .env.example                # Template for environment variables (safe for Git)
├── .gitignore                  # Git ignore rules (prevents secret leaks)
├── database.sql                # Supabase PostgreSQL schema
└── README.md
```

---

## 🚀 Step 1: Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, choose a name, set a secure database password, and select your nearest region.
3. Once created, go to the **SQL Editor** tab (left sidebar).
4. Copy and paste the entire contents of `database.sql` into the SQL editor and click **Run**.
5. Go to **Project Settings → API** and copy the following 3 values:
   - **Project URL** (e.g. `https://xxxx.supabase.co`)
   - **anon (public)** key
   - **service_role (secret)** key (keep this safe!)

---

## 🔑 Step 2: Get AI API Key

Choose one or both:
- **Google Gemini API:** Visit [aistudio.google.com](https://aistudio.google.com) → Click **Get API Key** → **Create API Key**.
- **Groq API:** Visit [console.groq.com/keys](https://console.groq.com/keys) → Create an API key.

---

## 💻 Step 3: Local Development & Testing

### 1. Configure Local Environment Files

Create `client/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api
```

Create `server/.env`:
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
```

### 2. Start Both Services

**Terminal 1 (Backend):**
```bash
cd server
npm install
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
# Frontend running on http://localhost:5173
```

Visit `http://localhost:5173` to test registration, farm creation, and AI advice.

---

## 🐙 Step 4: Push Project to GitHub

Make sure `node_modules` and all `.env` files are ignored:

```bash
# Check git status
git status

# Stage all project files
git add .

# Commit changes
git commit -m "feat: complete full stack CropAI setup"

# Push to your GitHub repo
git push origin main
```

> ⚠️ **IMPORTANT:** Never commit real API keys or service role keys to GitHub.

---

## 🟣 Step 5: Deploy Backend to Render

1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Select your GitHub repository (`cropai`).
4. Configure the service settings:
   - **Name:** `cropai-backend` (or custom name)
   - **Region:** Closest to your users
   - **Root Directory:** `server` ⚠️ *(MUST be set to `server`)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** `Free`

5. Scroll down to **Environment Variables** and add:

| Key | Value |
|---|---|
| `PORT` | `5000` |
| `SUPABASE_URL` | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_supabase_service_role_key` |
| `GEMINI_API_KEY` | `your_gemini_api_key` |
| `GROQ_API_KEY` | `your_groq_api_key` |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` *(or leave blank; CORS allows `*.vercel.app` automatically)* |

6. Click **Create Web Service**.
7. Once deployed, note down your Render URL:
   `https://cropai-xxxx.onrender.com`
8. Verify it works by opening:
   `https://cropai-xxxx.onrender.com/health` (should return `{"status":"ok"}`)

> 💡 **Note on Free Tier:** Render spins down free instances after 15 minutes of inactivity. The first request after sleep may take 30–60 seconds to wake up.

---

## ▲ Step 6: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** → **Project**.
3. Select your `cropai` repository.
4. Configure **Build & Development Settings**:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click *Edit* and select **`client`** ⚠️ *(MUST be set to `client`)*
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)

5. Expand **Environment Variables** and add:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your_supabase_anon_public_key` |
| `VITE_API_BASE_URL` | `https://cropai-xxxx.onrender.com/api` *(your Render backend URL + `/api`)* |

6. Click **Deploy**.
7. Vercel will build the frontend and provide your live URL (e.g., `https://cropai.vercel.app`).

---

## 🔄 Step 7: How Vercel & Render Connect

You do **not** need any manual dashboard integration between Vercel and Render:

1. The frontend on Vercel knows where to send API requests because of:
   `VITE_API_BASE_URL=https://<your-render-app>.onrender.com/api`
2. The backend on Render accepts requests from your frontend because the CORS middleware in `server/index.js` automatically allows:
   - Any origin ending in `.vercel.app`
   - Localhost (`http://localhost:5173`)
   - Any custom origin set in `FRONTEND_URL`

---

## 🛠️ Post-Deployment Verification Checklist

- [ ] **Backend Health Check:** Visit `https://<render-url>/health` → returns `{"status":"ok"}`
- [ ] **Frontend Loads:** Visit your Vercel URL → loads login/dashboard
- [ ] **Auth Works:** Sign up a new user via email
- [ ] **Database CRUD:** Add a new farm → verify it shows up in dashboard and Supabase table
- [ ] **AI Advice Works:** Open farm detail and generate crop advisory
- [ ] **SPA Routing:** Refreshing `/farms` or direct navigation doesn't throw 404 (handled by `vercel.json`)

