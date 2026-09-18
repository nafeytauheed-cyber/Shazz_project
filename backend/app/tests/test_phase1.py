from app.services.ingest.chunker import chunk_text
from app.services.rag.retrieve import retrieve_chunks


def test_chunker_returns_chunks():
    text = ' '.join([f'paragraph {i}' for i in range(120)])
    chunks = chunk_text(text, chunk_size=40, overlap=10)
    assert len(chunks) >= 2
    assert all(len(c.split()) > 0 for c in chunks)


def test_retrieve_returns_ranked_chunks():
    chunks = retrieve_chunks('vpn access', workspace_id=1, limit=5)
    assert isinstance(chunks, list)
    assert len(chunks) <= 5


def test_retrieve_drops_unrelated_chunks():
    chunks = retrieve_chunks("CEO favorite color", workspace_id=1, limit=5)
    assert chunks == []
