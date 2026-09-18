from fastapi.testclient import TestClient

from app.main import app


def test_chat_returns_sse_stream():
    client = TestClient(app)
    response = client.post('/chat', json={'message': 'How do I get VPN access?'})
    assert response.status_code == 200
    body = response.text
    assert 'event: token' in body
    assert 'event: sources' in body
    assert 'event: done' in body


def test_chat_falls_back_for_unanswerable_question():
    client = TestClient(app)
    response = client.post('/chat', json={'message': "What's the CEO's favorite color?"})
    assert response.status_code == 200
    body = response.text
    assert 'I couldn\'t find this in the onboarding docs yet' in body or 'NO_ANSWER' in body
