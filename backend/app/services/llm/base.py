from __future__ import annotations

from typing import Protocol


class LLMAdapter(Protocol):
    def answer(self, question: str, sources: list[str]) -> str:
        ...


class MockLLM:
    def answer(self, question: str, sources: list[str]) -> str:
        q = question.lower()
        if "vpn" in q or "access" in q:
            answer = "VPN access requires MFA and manager approval. If you are a new teammate, request VPN access after SSO is active and then submit the IT portal request."
            return answer
        if "leave" in q or "payroll" in q:
            return "Leave requests are submitted in HR, and payroll is processed on the 25th of each month. Timesheets are due every Friday."
        if "security" in q:
            return "Security policy requires MFA and strong passwords. Do not share access tokens or credentials. Report unusual activity to the security team."
        if "repo" in q or "github" in q:
            return "Request repo access only after SSO and MFA are complete, and then follow the engineering setup guide."
        return "The onboarding docs say to start with SSO setup, then complete HR paperwork, and request team access after the required setup steps are complete."
