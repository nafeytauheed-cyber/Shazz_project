import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${backendUrl}/api/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ status: 'open', routed_to: { name: 'IT Helpdesk', email: 'helpdesk@nimbuslabs.example' } });
  }
}
