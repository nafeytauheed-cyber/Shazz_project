import { NextResponse } from 'next/server';
import { findAnswer } from '../../../lib/demo';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = String(body.message || '').trim();

  if (!message) {
    return NextResponse.json(
      { error: { code: 'invalid_message', message: 'Ask a question first.' } },
      { status: 400 },
    );
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
