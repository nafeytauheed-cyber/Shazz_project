import { NextResponse } from 'next/server';

export async function PATCH(request: Request, context: { params: { questionId: string } }) {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${backendUrl}/api/admin/questions/${context.params.questionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: request.headers.get('authorization') || '' },
      body: JSON.stringify(await request.json()),
      signal: AbortSignal.timeout(5000),
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ error: { code: 'backend_unavailable', message: 'Backend is unavailable.' } }, { status: 503 });
  }
}
