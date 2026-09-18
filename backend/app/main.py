from __future__ import annotations

import json
from typing import Any

import jwt
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from sqlmodel import Session, SQLModel, select

from app.config import settings
from app.db import engine
from app.models import Chunk, Document, Question, User, Workspace
from app.services.ingest.chunker import chunk_text
from app.services.llm.base import MockLLM
from app.services.rag.fallback import fallback_response
from app.services.rag.generate import generate_answer, has_grounding
from app.services.rag.postprocess import build_followups, validate_citations
from app.services.rag.retrieve import retrieve_chunks
from app.services.rag.understand import understand_query

app = FastAPI(title="Sherpa API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DemoLoginRequest(BaseModel):
    persona: str


class ChatRequest(BaseModel):
    message: str
    persona: str = "Alex"


class ErrorResponse(BaseModel):
    error: dict[str, str]


@app.on_event("startup")
def startup():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        session.execute("SELECT 1")
    from app.seed.seed import seed_database
    seed_database()


@app.get("/api/health")
def health():
    return {"ok": True, "status": "healthy", "app": settings.app_name}


@app.post("/auth/demo")
def demo_login(payload: DemoLoginRequest):
    persona = payload.persona.lower()
    user_map = {
        "alex": {"email": "alex@nimbuslabs.example", "name": "Alex", "role": "member", "team": "Backend", "job_role": "Software Engineer"},
        "sam": {"email": "sam@nimbuslabs.example", "name": "Sam", "role": "member", "team": "Product", "job_role": "Designer"},
        "jordan": {"email": "jordan@nimbuslabs.example", "name": "Jordan", "role": "admin", "team": "Engineering", "job_role": "Admin"},
    }
    if persona not in user_map:
        raise HTTPException(status_code=400, detail={"error": {"code": "invalid_persona", "message": "Persona not found"}})
    user = user_map[persona]
    token = jwt.encode({"sub": user["email"], "role": user["role"], "name": user["name"], "team": user["team"], "job_role": user["job_role"]}, settings.jwt_secret, algorithm="HS256")
    return {"token": token, "user": user}


@app.get("/api/debug/retrieve")
def debug_retrieve(q: str):
    return {"query": q, "chunks": retrieve_chunks(q, workspace_id=1, limit=8)}


@app.get("/docs")
def list_documents():
    with Session(engine) as session:
        rows = session.exec(select(Document)).all()
        return {"documents": [
            {"id": d.id, "title": d.title, "status": d.status, "source_type": d.source_type, "visibility": d.visibility}
            for d in rows
        ]}


@app.post("/docs/upload")
async def upload_document(file: UploadFile = File(...), title: str | None = Form(None)):
    doc_title = title or file.filename or "uploaded_doc"
    content = await file.read()
    text = content.decode("utf-8", errors="ignore") or "Uploaded document content."
    chunks = chunk_text(text)

    with Session(engine) as session:
        doc = Document(workspace_id=1, title=doc_title, source_type="upload", mime=file.content_type or "text/plain", visibility="all", status="ready")
        session.add(doc)
        session.commit()
        session.refresh(doc)

        for idx, chunk_text_value in enumerate(chunks):
            session.add(Chunk(document_id=doc.id, ordinal=idx + 1, section_path="root", text=chunk_text_value, token_count=max(1, len(chunk_text_value.split()))))
        session.commit()
    return {"document": {"id": doc.id, "title": doc_title, "status": "ready"}, "chunks": len(chunks)}


@app.delete("/docs/{doc_id}")
def delete_document(doc_id: int):
    with Session(engine) as session:
        doc = session.get(Document, doc_id)
        if not doc:
            raise HTTPException(status_code=404, detail={"error": {"code": "not_found", "message": "Document not found"}})
        session.delete(doc)
        session.commit()
    return {"deleted": True, "id": doc_id}


@app.post("/chat")
async def chat(payload: ChatRequest):
    understanding = understand_query([], payload.message)
    workspace_id = 1
    sources = retrieve_chunks(understanding["standalone_query"], workspace_id=workspace_id, limit=4)

    answer_text = generate_answer(payload.message, sources)
    if answer_text == "NO_ANSWER" or not sources or not has_grounding(payload.message, sources):
        answer_text = fallback_response(payload.message, sources)
    valid_text = validate_citations(answer_text, [item["id"] for item in sources])
    followups = build_followups(valid_text, sources)

    def event_generator():
        words = valid_text.split()
        for i in range(len(words)):
            text = ' '.join(words[: i + 1]) + (' ' if i < len(words) - 1 else '')
            yield {"event": "token", "data": json.dumps({"text": text}, ensure_ascii=False)}
        yield {"event": "sources", "data": json.dumps({"sources": [{"id": item["id"], "title": item["title"], "section": item["section_path"], "updated": "2026-01-01"} for item in sources]}, ensure_ascii=False)}
        yield {"event": "next_steps", "data": json.dumps({"items": [{"title": "Complete SSO setup", "status": "pending"}, {"title": "Request repo access", "status": "locked"}]}, ensure_ascii=False)}
        yield {"event": "contact", "data": json.dumps({"name": "IT Helpdesk", "email": "helpdesk@nimbuslabs.example"}, ensure_ascii=False)}
        yield {"event": "followups", "data": json.dumps({"items": followups}, ensure_ascii=False)}
        yield {"event": "done", "data": json.dumps({"done": True}, ensure_ascii=False)}

    return EventSourceResponse(event_generator())


@app.get("/api/admin/metrics")
def metrics():
    return {"deflection_rate": 0.82, "p50_latency_ms": 1500, "citation_rate": 0.94, "thumbs_up_ratio": 0.88}


@app.get("/api/roadmap")
def roadmap():
    return {"tasks": [{"title": "SSO login", "status": "todo", "depends_on": []}, {"title": "Request repo access", "status": "locked", "depends_on": [1]}]}


@app.post("/api/seed")
def seed_demo_data():
    from app.seed.seed import seed_database
    seed_database()
    return {"ok": True, "message": "seeded"}


@app.get("/api/users")
def list_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return {"users": [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users]}


@app.get("/api/workspaces")
def list_workspaces():
    with Session(engine) as session:
        workspaces = session.exec(select(Workspace)).all()
        return {"workspaces": [{"id": w.id, "name": w.name, "type": w.type} for w in workspaces]}


@app.get("/api/admin/questions")
def admin_questions():
    with Session(engine) as session:
        rows = session.exec(select(Question)).all()
        return {"questions": [{"id": q.id, "text": q.text, "status": q.status} for q in rows]}


@app.get("/api/notifications")
def notifications():
    return {"notifications": [{"id": 1, "text": "Your question has been routed to IT Helpdesk."}]}


@app.post("/api/answer/{token}")
def answer_token(token: str):
    return {"token": token, "status": "accepted", "answer": "VPN access is approved after MFA and the onboarding checklist is complete."}


@app.get("/")
def home():
    return {"message": "Sherpa backend ready"}
