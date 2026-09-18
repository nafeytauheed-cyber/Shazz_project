import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${backendUrl}/docs`, { signal: AbortSignal.timeout(2500) });
    if (response.ok) return NextResponse.json(await response.json());
  } catch {}
  return NextResponse.json({ documents: [] });
}

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${backendUrl}/docs/upload`, {
      method: 'POST',
      body: await request.arrayBuffer(),
      headers: { 'Content-Type': request.headers.get('content-type') || 'application/octet-stream' },
      signal: AbortSignal.timeout(10000),
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ error: { code: 'backend_unavailable', message: 'Backend is unavailable.' } }, { status: 503 });
  }
}
