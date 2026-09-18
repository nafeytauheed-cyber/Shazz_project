import { NextResponse } from 'next/server';
import { findAnswer } from '../../../lib/demo';

async function backendAnswer(message: string, token?: string) {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const response = await fetch(`${backendUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ message }),
    signal: AbortSignal.timeout(3500),
  });
  if (!response.ok) throw new Error('Backend chat failed');
  const text = await response.text();
  let answer = '';
  let sources: Array<{ id: string; title: string; section: string; updated: string }> = [];
  for (const event of text.split(/\r?\n\r?\n/)) {
    const eventName = event.match(/event: ([^\n]+)/)?.[1];
    const data = event.match(/data: (.+)/)?.[1];
    if (!data) continue;
    const payload = JSON.parse(data);
    if (eventName === 'token') answer = payload.text || answer;
    if (eventName === 'sources') sources = payload.sources || [];
  }
  return { answer, sources, fallback: !sources.length };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = String(body.message || '').trim();

  if (!message) {
    return NextResponse.json(
      { error: { code: 'invalid_message', message: 'Ask a question first.' } },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await backendAnswer(message, request.headers.get('authorization') || undefined));
  } catch {
    // The in-memory answer path is intentional for Vercel and offline demos.
  }

  const source = findAnswer(message);
  if (!source) {
    return NextResponse.json({
      answer: "I couldn't find this in the onboarding docs yet. Please contact IT Helpdesk for help.",
      sources: [],
      fallback: true,
      contact: { name: 'IT Helpdesk', email: 'helpdesk@nimbuslabs.example' },
    });
  }

  return NextResponse.json({
    answer: source.answer,
    sources: [{ id: source.id, title: source.title, section: source.section, updated: '2026-01-01' }],
    fallback: false,
    contact: { name: 'IT Helpdesk', email: 'helpdesk@nimbuslabs.example' },
    followups: ['What should I complete first?', 'Who approves access requests?'],
  });
}
