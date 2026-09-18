# Sherpa

Sherpa is a demo-ready onboarding copilot MVP built to match the design brief in this repository.

## Quick start

### Easiest option: deploy the frontend only

Sherpa is a lightweight onboarding copilot demo. It helps a new teammate find answers, follow first-week tasks, and contact the right person.

The recommended version is the `frontend` app. It runs with Next.js route handlers and a small local knowledge base, so friends can clone and run it without Python, a database, an AI key, or paid services.

## Run It Locally

### Requirements

- Node.js 18.17 or newer
- npm

### From a fresh clone

```bash
git clone https://github.com/YOUR_USERNAME/sherpa.git
cd sherpa/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To test the production build locally:

```bash
npm run build
npm start
```

## Demo Login

Choose one of these personas on the login screen:

- **Alex**: Backend newcomer
- **Sam**: Product newcomer
- **Jordan**: Admin

The demo has no real authentication and stores no secrets.

## What Works

- Demo persona login
- Responsive onboarding dashboard
- Interactive first-week task checklist
- Readiness progress display
- Grounded questions about VPN, SSO, repositories, payroll, and leave
- Source labels on answers
- Honest fallback for unsupported questions
- Same-origin API routes that work locally and on Vercel

## Deploy To Vercel

1. Import the GitHub repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Leave the framework as **Next.js**.
4. Click **Deploy**.

No environment variables are required for the demo.

## Publish This Folder To GitHub

Run these commands from the project root after creating an empty GitHub repository:

```bash
git init
git add .
git commit -m "Build Sherpa onboarding copilot demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sherpa.git
git push -u origin main
```

Replace `YOUR_USERNAME/sherpa` with the repository you created. Do not commit `.env`, credentials, `node_modules`, `.next`, or database files; the included `.gitignore` excludes them.

## Project Shape

```text
sherpa/
   frontend/
      app/              Next.js pages and serverless API routes
      lib/demo.ts       Demo knowledge base and answer matching
      package.json      Frontend dependencies and scripts
   README.md
   .gitignore
```

The older `backend/` folder is kept for future expansion, but it is not needed to run or deploy the current demo.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. For Vercel, import the repository, set the project root to `frontend`, and deploy with the default Next.js settings.

### Full local option

1. Create a virtual environment and install backend dependencies.
2. Start the API:
   `cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
3. In another terminal, start the frontend:
   `cd frontend && npm install && npm run dev`
4. Open the app at http://localhost:3000.

## Demo personas

- Alex: newcomer
- Sam: newcomer
- Jordan: admin

Use the demo login endpoint at `/auth/demo` with a persona payload.

## Architecture

```text
Demo deployment: Browser -> Next.js route handlers -> in-memory knowledge base

Optional backend: Browser -> Next.js App -> FastAPI API -> SQLite -> retrieval services
```

## Notes

The frontend-only deployment is the recommended demo path because it is cheap, portable, and works on Vercel's serverless runtime. The Python backend remains available for extending ingestion, persistence, and production retrieval later.
