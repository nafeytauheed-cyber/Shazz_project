import { NextResponse } from 'next/server';
import { personas, type Persona } from '../../../../lib/demo';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const persona = String(body.persona || '').toLowerCase() as Persona;
  const user = personas[persona];

  if (!user) {
    return NextResponse.json(
      { error: { code: 'invalid_persona', message: 'Persona not found' } },
      { status: 400 },
    );
  }

  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const backendResponse = await fetch(`${backendUrl}/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona }),
      signal: AbortSignal.timeout(2500),
    });
    if (backendResponse.ok) return NextResponse.json(await backendResponse.json());
  } catch {
    // The local demo fallback keeps the frontend usable without the API.
  }

  return NextResponse.json({ token: `demo-${persona}`, user });
}
