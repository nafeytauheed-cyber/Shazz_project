from __future__ import annotations

import re
from typing import Any


def normalize_query(query: str) -> str:
    s = re.sub(r"\s+", " ", query or "").strip()
    return s.lower()


def understand_query(last_turns: list[str], new_message: str) -> dict[str, Any]:
    joined = " ".join(last_turns + [new_message])
    q = normalize_query(joined)
    intent = "policy"
    if any(k in q for k in ["vpn", "access", "sso", "repo", "github", "password", "mfa"]):
        intent = "access"
    elif any(k in q for k in ["leave", "payroll", "expense", "timesheet", "hr"]):
        intent = "policy"
    elif any(k in q for k in ["what tool", "slack", "jira", "figma", "sentry", "github"]):
        intent = "tool"
    elif any(k in q for k in ["who", "contact", "manager", "hr", "helpdesk"]):
        intent = "contact"
    elif any(k in q for k in ["roadmap", "today", "first week", "first day", "onboarding plan"]):
        intent = "roadmap"
    elif any(k in q for k in ["hi", "hello", "thanks", "how are you"]):
        intent = "smalltalk"
    
    return {
        "standalone_query": new_message.strip(),
        "intent": intent,
        "entities": re.findall(r"[A-Za-z][A-Za-z0-9_\- ]{2,}", new_message),
    }
