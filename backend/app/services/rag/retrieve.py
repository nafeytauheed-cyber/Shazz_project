from __future__ import annotations

import re
from typing import Any

from sqlmodel import Session, select

from app.db import engine
from app.models import Chunk, Document


def normalize_query(query: str) -> str:
    return ' '.join(query.lower().split())


def retrieve_chunks(query: str, workspace_id: int = 1, limit: int = 8) -> list[dict[str, Any]]:
    stop_words = {"what", "when", "where", "which", "who", "how", "does", "the", "this", "that", "with", "for", "are", "can", "get"}
    keywords = [w for w in re.findall(r"[a-z0-9]+", normalize_query(query)) if len(w) > 2 and w not in stop_words]
    if not keywords:
        return []

    with Session(engine) as session:
        docs = session.exec(select(Document).where(Document.workspace_id == workspace_id)).all()
        doc_map = {doc.id: doc for doc in docs}
        all_chunks = session.exec(select(Chunk).join(Document, Chunk.document_id == Document.id).where(Document.workspace_id == workspace_id)).all()

    scored: list[tuple[float, dict[str, Any]]] = []
    for chunk in all_chunks:
        text = (chunk.text or '').lower()
        text_terms = re.findall(r"[a-z0-9]+", text)
        score = 0.0
        for term in keywords:
            occurrences = text_terms.count(term)
            score += occurrences * 2.0
            if occurrences:
                score += 0.75
        domain_terms = ["vpn", "access", "sso", "repo", "security", "payroll", "leave", "team"]
        if any(term in keywords and term in text for term in domain_terms):
            score += 1.0
        if chunk.section_path:
            score += 0.2
        title = doc_map.get(chunk.document_id).title if chunk.document_id in doc_map else "unknown"
        if score > 0.75:
            scored.append((score, {"id": chunk.id, "doc_id": chunk.document_id, "title": title, "section_path": chunk.section_path, "text": chunk.text[:280], "score": round(score, 3)}))

    scored.sort(key=lambda item: item[0], reverse=True)
    return [item[1] for item in scored[:limit]]
