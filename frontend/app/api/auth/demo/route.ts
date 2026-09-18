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

  return NextResponse.json({ token: `demo-${persona}`, user });
}
