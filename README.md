# Sherpa

Sherpa is an onboarding copilot for companies, teams, clubs, and organizations. It helps newcomers answer questions, follow a personalized first-week path, find the right people and tools, and escalate unknown questions instead of guessing.

## Product Goal

New members often search across documents, FAQs, emails, websites, and experienced teammates to answer basic questions. Sherpa brings those workflows into one place:

```text
Personalization
    -> roadmap
    -> task dependencies
    -> next best action
    -> task completion
    -> progress update
    -> newcomer question
    -> knowledge retrieval
    -> source-backed answer or honest fallback
    -> human escalation when needed
```

## Current Architecture

```text
Browser
  |
  v
Next.js React frontend
  |
  | same-origin route handlers
  v
FastAPI backend
  |
  +-- SQLite database
  |     users, workspaces, documents, chunks, tasks, questions, events
  |
  +-- Retrieval engine
  |     exact-token keyword matching over document chunks
  |
  +-- Grounded answer generator
  |     extractive/mock generation, no paid AI key required
  |
  +-- Seed data
        Nimbus Labs, Robotics Club, personas, contacts, documents, tasks
```

The original target architecture can later replace SQLite with PostgreSQL and add pgvector without changing the main product boundaries. The current implementation intentionally favors a free, portable, offline-capable MVP.

## Technology

### Frontend

- Next.js 14 App Router
- React and TypeScript
- Tailwind CSS
- lucide-react icons
- Next.js route handlers for API proxying and fallback mode

### Backend

- Python 3.11+
- FastAPI
- SQLModel and SQLAlchemy
- SQLite
- Pydantic settings
- PyJWT
- Server-Sent Events for chat streaming
- Pytest regression tests

### Deployment

- Docker Compose for the full local stack
- Vercel-compatible frontend deployment
- No required external AI provider
- No required API key for the demo

## Features

### Newcomer experience

- Alex and Sam demo personas
- Personalized onboarding dashboard
- Readiness score
- Persistent task completion
- Dependency-aware task unlocking
- Next-best-action recommendation
- Newcomer FAQ section
- Ask Sherpa question flow
- Source labels for grounded answers
- Honest fallback for unsupported questions
- Ask-a-human escalation
- Explore page for tools, people, and knowledge documents

### Admin experience

- Jordan admin persona
- Role-aware redirect to the admin workspace
- Members cannot access admin APIs
- Document upload for Markdown, text, CSV, PDF, and DOCX files
- Knowledge document list and processing status
- Prioritized unanswered-question inbox
- Priority based on open status and question age
- Answer box for submitting verified answers
- Admin visibility into questions needing expert attention

### Knowledge and chat

- Seeded organization documents and chunks
- Exact-token retrieval to reduce false matches
- Grounded extractive answers
- Source metadata in the response
- `NO_ANSWER` fallback when evidence is weak or absent
- Streaming backend chat events
- Frontend-only fallback knowledge base when FastAPI is unavailable

## User Workflows

### Member login

1. Select Alex or Sam.
2. Frontend calls `/api/auth/demo`.
3. Next.js calls FastAPI `/auth/demo` when available.
4. FastAPI returns a demo JWT and user profile.
5. The frontend stores the session token locally.
6. The user is redirected to `/home`.

### Admin login

1. Select Jordan.
2. Frontend receives an admin JWT and user profile.
3. The user is redirected to `/admin`.
4. Admin APIs require a valid bearer token with `role=admin`.
5. A member token receives `403 Admin access required`.

### Roadmap loop

1. Frontend requests `/api/roadmap?persona=alex`.
2. FastAPI loads persisted tasks from SQLite.
3. Incomplete dependencies make tasks appear locked.
4. The first available task becomes `next_best_action`.
5. User clicks a task.
6. Frontend sends `PATCH /api/tasks/{id}`.
7. Backend stores status and completion time.
8. Frontend reloads readiness, task status, and next action.
9. Dependent tasks unlock automatically.

### Grounded question loop

1. User submits a question.
2. Frontend calls `/api/chat`.
3. Next.js proxies to FastAPI `/chat`.
4. FastAPI normalizes the query and retrieves document chunks.
5. Weak or unrelated evidence is rejected.
6. Strong evidence produces an extractive answer and source list.
7. No evidence produces `NO_ANSWER` and a fallback message.
8. The user can choose **Ask a human**.
9. The question is routed to a contact by expertise and stored for the admin inbox.

### Admin knowledge loop

1. Jordan opens `/admin`.
2. Jordan uploads an onboarding document.
3. Frontend sends the file to `/docs/upload`.
4. FastAPI creates a document and chunks its text.
5. The document appears in the knowledge library.
6. Retrieval can use its chunks in future questions.

### Admin question loop

1. A member asks an unsupported question.
2. The member clicks **Ask a human**.
3. FastAPI creates a `Question` record.
4. Topic matching routes it to the best contact.
5. Admin inbox sorts open questions by priority.
6. Jordan writes a verified answer.
7. FastAPI marks the question answered and records the answer and timestamp.

## Routes

### Frontend pages

| Route | Purpose |
|---|---|
| `/` | Redirects to `/login` |
| `/login` | Demo persona selection |
| `/home` | Newcomer dashboard, tasks, FAQs, and chat |
| `/explore` | Tools, people, and knowledge discovery |
| `/admin` | Admin documents and prioritized question inbox |

### Frontend route handlers

| Route | Method | Purpose |
|---|---:|---|
| `/api/auth/demo` | POST | Login proxy with fallback |
| `/api/chat` | POST | Chat proxy with SSE parsing and fallback |
| `/api/roadmap` | GET | Roadmap proxy |
| `/api/tasks/[taskId]` | PATCH | Task update proxy |
| `/api/explore` | GET | Explore data proxy |
| `/api/questions` | POST | Human escalation proxy |
| `/api/admin/docs` | GET/POST | Admin document list and upload |
| `/api/admin/questions` | GET | Admin prioritized question list |
| `/api/admin/questions/[questionId]` | PATCH | Submit verified admin answer |

### FastAPI routes

| Route | Method | Purpose |
|---|---:|---|
| `/api/health` | GET | Health check |
| `/auth/demo` | POST | Demo JWT login |
| `/chat` | POST | Streaming grounded chat |
| `/api/debug/retrieve?q=vpn` | GET | Retrieval debugging |
| `/api/roadmap` | GET | Persisted roadmap state |
| `/api/tasks/{task_id}` | PATCH | Persist task state |
| `/api/explore` | GET | Tools, contacts, documents |
| `/api/questions` | POST | Store and route unanswered question |
| `/api/admin/questions` | GET | Admin-only prioritized inbox |
| `/api/admin/questions/{id}` | PATCH | Admin-only verified answer |
| `/docs` | GET | Admin-only document list |
| `/docs/upload` | POST | Admin-only document upload |
| `/docs/{id}` | DELETE | Admin-only document deletion |
| `/api/admin/metrics` | GET | Demo analytics metrics |
| `/api/users` | GET | Seeded users |
| `/api/workspaces` | GET | Seeded workspaces |
| `/api/notifications` | GET | Demo notifications |
| `/api/seed` | POST | Re-run seed command |
| `/docs` | GET | Admin document list |

## Seed Data

On startup, the backend creates and seeds the database when it is empty.

### Workspaces

- Nimbus Labs, company workspace
- Robotics Club, club workspace

### Personas

- Jordan, admin
- Alex, Backend software engineer
- Sam, Product designer

### Contacts

- IT Helpdesk
- HR
- Payroll
- Security
- Engineering Manager
- Design Lead
- Office Admin
- Finance

### Documents

- `employee_handbook.md`
- `it_and_access_guide.md`
- `leave_and_payroll.md`
- `engineering_setup.md`
- `security_policy.md`
- `tools_overview.md`

## Run the Complete Project

### Requirements

- Docker Desktop and Git, or
- Python 3.11+, Node.js 18.17+, and npm

### Docker Compose

From a fresh clone:

```bash
git clone https://github.com/YOUR_USERNAME/sherpa.git
cd sherpa
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/api/health
- Backend document list: http://localhost:8000/docs (admin token required)

Stop the stack:

```bash
docker compose down
```

### Run without Docker

Terminal 1, backend:

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

Install and run:

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Terminal 2, frontend:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

## Environment Variables

The demo works without environment variables. Optional settings are documented in `.env.example`.

Backend settings include:

- `DATABASE_URL`: SQLite database URL
- `JWT_SECRET`: JWT signing secret
- `FRONTEND_URL`: frontend origin
- `ANTHROPIC_API_KEY`: optional future LLM provider key
- `DEMO_MODE`: keep offline/demo behavior enabled

Frontend settings include:

- `BACKEND_URL`: public or local FastAPI URL
- `NEXT_PUBLIC_API_URL`: alternate backend URL setting

## Vercel Deployment

Vercel can deploy the `frontend` directory as a lightweight demo.

1. Import the repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Keep the framework set to Next.js.
4. Deploy with no environment variables.

Without `BACKEND_URL`, the frontend uses its bundled demo knowledge base. To use a separately hosted FastAPI backend, configure:

```text
BACKEND_URL=https://your-backend.example.com
```

The complete local architecture is best run with Docker Compose. Vercel alone does not provide the SQLite/FastAPI service from this repository.

## Testing

Backend tests:

```bash
cd backend
python -m pytest -q
```

Frontend production build:

```bash
cd frontend
npm run build
```

The test suite covers chunking, retrieval, chat SSE behavior, grounded fallback, and unsupported questions. The production build validates all frontend routes and TypeScript.

## Project Structure

```text
sherpa/
  backend/
    app/
      main.py                 FastAPI app and routes
      config.py               Environment settings
      db.py                   SQLite engine
      models/                 SQLModel tables
      seed/seed.py            Demo data creation
      services/ingest/        Chunking
      services/rag/           Retrieval, generation, fallback, postprocess
      tests/                  Backend regression tests
    Dockerfile
    requirements.txt
  frontend/
    app/
      login/                  Persona login
      home/                   Newcomer dashboard
      admin/                  Admin workspace
      explore/                Discovery page
      api/                    Next.js backend proxy routes
      globals.css             Design system and layout styles
    lib/demo.ts               Offline demo knowledge base
    Dockerfile
    package.json
  docker-compose.yml           Full local stack
  README.md                    Complete project documentation
  WORKFLOW.txt                 Detailed workflow reference
  .env.example                 Environment template
  .gitignore                   Ignored files and secrets
```

## Known Limitations

This is a working MVP rather than a production SaaS platform.

- Demo login is not real user authentication.
- SQLite is used instead of PostgreSQL.
- Retrieval is keyword-based rather than pgvector hybrid search.
- The answer generator is extractive/mock and does not require an external LLM.
- Uploaded PDFs and DOCX files are currently decoded simply rather than fully parsed.
- Admin answers are stored on questions but are not yet promoted into new searchable verified documents.
- Analytics are currently demo metrics rather than a complete event dashboard.
- Background ingestion, notifications, and email/Slack integrations are not implemented.

These limitations are deliberate to keep the project free, portable, and easy for a friend to run. The main extension path is PostgreSQL plus pgvector, real authentication, richer parsers, verified-answer promotion, and persistent analytics.

## GitHub Publishing

From the repository root after creating an empty GitHub repository:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sherpa.git
git push -u origin main
```

Replace `YOUR_USERNAME/sherpa` with the actual repository path. Do not commit credentials, `.env` files, `node_modules`, `.next`, Python virtual environments, or database files.
