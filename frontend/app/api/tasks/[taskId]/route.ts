import { NextResponse } from 'next/server';

export async function PATCH(request: Request, context: { params: { taskId: string } }) {
  const body = await request.json().catch(() => ({}));
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${backendUrl}/api/tasks/${context.params.taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(2500),
    });
    if (response.ok) return NextResponse.json(await response.json());
  } catch {
    // The UI remains usable in frontend-only demo mode.
  }
  return NextResponse.json({ id: context.params.taskId, status: body.status });
}
