from __future__ import annotations


def chunk_text(text: str, chunk_size: int = 450, overlap: int = 60) -> list[str]:
    """Split long text into variable-sized chunks with overlap."""
    normalized = text.strip()
    if not normalized:
        return []

    words = normalized.split()
    if len(words) <= chunk_size:
        return [" ".join(words)]

    step = max(1, chunk_size - overlap)
    chunks: list[str] = []
    start = 0

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks.append(" ".join(words[start:end]))
        if end == len(words):
            break
        start += step

    return chunks
