from __future__ import annotations

from typing import Any


def validate_citations(text: str, source_ids: list[int]) -> str:
    out = text
    for marker in [m for m in __import__('re').findall(r'\[(\d+)\]', text) if int(m) not in source_ids]:
        out = out.replace(f'[{marker}]', '')
    return out


def build_followups(answer: str, sources: list[dict[str, Any]]) -> list[str]:
    base = [
        'How do I request VPN access?',
        'What does the onboarding checklist include?',
        'Who should I contact for HR or payroll questions?',
    ]
    if not answer:
        return base[:3]
    return base[:3]
