from __future__ import annotations


def has_grounding(question: str, sources: list[dict]) -> bool:
    question_terms = {
        term
        for term in question.lower().split()
        if len(term.strip("?!.,'\"")) > 2
    }
    source_text = " ".join(str(source.get("text", "")) for source in sources).lower()
    return bool(question_terms and any(term.strip("?!.,'\"") in source_text for term in question_terms))


def generate_answer(question: str, sources: list[dict], plain_mode: bool = False) -> str:
    """Very small grounded generation wrapper for the demo.
    Returns a concise answer using the provided source content without inventing facts.
    """
    if not sources or not has_grounding(question, sources):
        return "NO_ANSWER"

    best = sources[0].get("text", "")
    answer = best.strip()
    if not answer:
        return "NO_ANSWER"
    if plain_mode:
        return answer[:220]
    return answer[:220]
