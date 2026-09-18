from __future__ import annotations


def fallback_response(question: str, sources: list[dict]) -> str:
    if sources:
        return "I couldn't find this in the onboarding docs yet. Please contact IT Helpdesk for help."
    return "NO_ANSWER"
