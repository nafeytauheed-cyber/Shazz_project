from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel, Relationship


class Workspace(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    type: str = "company"
    settings_json: dict[str, Any] | None = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Team(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspace.id")
    name: str


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspace.id")
    email: str
    name: str
    password_hash: str | None = None
    role: str = "member"
    team_id: int | None = Field(default=None, foreign_key="team.id")
    job_role: str | None = None
    start_date: datetime | None = None
    language: str = "en"
    plain_mode: bool = False
    prefs_json: dict[str, Any] | None = Field(default_factory=dict, sa_column=Column(JSON))


class Document(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspace.id")
    title: str
    source_type: str = "upload"
    source_uri: str | None = None
    mime: str | None = None
    visibility: str = "all"
    team_ids: list[int] | None = Field(default_factory=list, sa_column=Column(JSON))
    tags: list[str] | None = Field(default_factory=list, sa_column=Column(JSON))
    status: str = "ready"
    version: int = 1
    content_hash: str | None = None
    uploaded_by: int | None = Field(default=None, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Chunk(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    document_id: int = Field(foreign_key="document.id")
    ordinal: int = 0
    section_path: str = ""
    page: int | None = None
    text: str
    token_count: int = 0


class Tool(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspace.id")
    name: str
    purpose: str = ""
    category: str = "tool"
    url: str | None = None
    access_steps: list[str] | None = Field(default_factory=list, sa_column=Column(JSON))
    request_contact_id: int | None = Field(default=None, foreign_key="contact.id")
    doc_id: int | None = Field(default=None, foreign_key="document.id")
    status: str = "approved"


class Process(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspace.id")
    name: str
    summary: str = ""
    steps_json: list[str] | None = Field(default_factory=list, sa_column=Column(JSON))
    doc_id: int | None = Field(default=None, foreign_key="document.id")
    status: str = "approved"


class Contact(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspace.id")
    name: str
    role: str = ""
    email: str | None = None
    slack_handle: str | None = None
    expertise_text: str = ""
    topics: list[str] | None = Field(default_factory=list, sa_column=Column(JSON))
    is_backup: bool = False
    status: str = "approved"


class GlossaryTerm(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspace.id")
    term: str
    definition: str = ""
    doc_id: int | None = Field(default=None, foreign_key="document.id")
    status: str = "approved"


class RoadmapTemplate(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_type: str
    job_role: str
    tasks_yaml: str = ""


class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str
    why: str = ""
    type: str = "setup"
    est_minutes: int = 30
    due_date: datetime | None = None
    links_json: list[str] | None = Field(default_factory=list, sa_column=Column(JSON))
    contact_id: int | None = Field(default=None, foreign_key="contact.id")
    depends_on_json: list[int] | None = Field(default_factory=list, sa_column=Column(JSON))
    status: str = "todo"
    completed_at: datetime | None = None


class Conversation(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    role: str
    content: str
    sources_json: list[dict[str, Any]] | None = Field(default_factory=list, sa_column=Column(JSON))
    intent: str | None = None
    confidence: float | None = None
    latency_ms: int | None = None
    feedback: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Question(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspace.id")
    user_id: int = Field(foreign_key="user.id")
    message_id: int | None = Field(default=None, foreign_key="message.id")
    text: str
    status: str = "open"
    cluster_id: str | None = None
    routed_to: int | None = Field(default=None, foreign_key="contact.id")
    token: str | None = None
    expires_at: datetime | None = None
    answer_text: str | None = None
    answered_by: str | None = None
    answer_doc_id: int | None = Field(default=None, foreign_key="document.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    answered_at: datetime | None = None


class Event(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    workspace_id: int = Field(foreign_key="workspace.id")
    user_id: int | None = Field(default=None, foreign_key="user.id")
    type: str
    payload_json: dict[str, Any] | None = Field(default_factory=dict, sa_column=Column(JSON))
    ts: datetime = Field(default_factory=datetime.utcnow)
