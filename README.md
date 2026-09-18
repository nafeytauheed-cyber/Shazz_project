# Sherpa

Sherpa is an onboarding copilot for finding answers, completing first-week tasks, and contacting the right teammate.

This repository contains the complete project:

- Next.js frontend
- FastAPI backend
- SQLite database
- Seeded Nimbus Labs demo data
- Retrieval and streaming chat
- Docker Compose setup
- Vercel-compatible frontend fallback

## Fastest Full-Project Start

### Requirements

- Docker Desktop
- Git

### Run from a fresh clone

```bash
git clone https://github.com/YOUR_USERNAME/sherpa.git
cd sherpa
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/api/health

The backend creates the database and seed data automatically on startup. No API key is required.

Stop the app with `Ctrl+C`. Remove containers with:

```bash
docker compose down
```

## Run Without Docker

### Terminal 1: backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Then:

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Terminal 2: frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

## Demo Personas

- **Alex**: Backend newcomer
- **Sam**: Product newcomer
- **Jordan**: Admin

The login is demo authentication. It does not require passwords or store secrets.

## What Works

- Demo persona login
- Responsive onboarding dashboard
- Interactive first-week tasks
- Readiness progress
- Grounded questions about VPN, SSO, repositories, payroll, and leave
- Source labels on answers
- Streaming backend chat through the frontend proxy
- Fallback for unsupported questions
- Seeded workspaces, users, contacts, documents, chunks, and tasks

## Deploy Frontend To Vercel

Vercel runs the frontend portion. It works using the bundled lightweight knowledge base when the Python backend is not deployed.

1. Import this GitHub repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Leave the framework as **Next.js**.
4. Deploy with no environment variables.

To connect Vercel to a separately deployed FastAPI backend, set `BACKEND_URL` to that backend's public HTTPS URL.

## Publish To GitHub

Create an empty GitHub repository, then run these commands from this project root:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sherpa.git
git push -u origin main
```

Replace `YOUR_USERNAME/sherpa` with the real repository path.

## Project Structure

```text
sherpa/
  backend/           FastAPI API, models, seed data, retrieval, tests
  frontend/          Next.js UI and API proxy/fallback
  docker-compose.yml Full local stack
  README.md          Setup instructions
  .gitignore         Generated files and secrets excluded from Git
```

The frontend calls FastAPI when it is available. If the backend is unavailable, its route handlers use the small bundled demo knowledge base so the UI remains usable for a simple Vercel demo.
