import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${backendUrl}/api/admin/questions`, {
      headers: { Authorization: request.headers.get('authorization') || '' },
      signal: AbortSignal.timeout(2500),
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ error: { code: 'backend_unavailable', message: 'Backend is unavailable.' } }, { status: 503 });
  }
}
