import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const persona = new URL(request.url).searchParams.get('persona') || 'alex';
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${backendUrl}/api/roadmap?persona=${encodeURIComponent(persona)}`, { signal: AbortSignal.timeout(2500) });
    if (response.ok) return NextResponse.json(await response.json());
  } catch {
    // Return a lightweight roadmap when the backend is unavailable.
  }
  return NextResponse.json({
    tasks: [
      { id: 'sso', title: 'Complete SSO setup', why: 'Unlocks the rest of your access.', status: 'todo', depends_on: [] },
      { id: 'mfa', title: 'Enroll in MFA', why: 'Protects your Nimbus Labs account.', status: 'todo', depends_on: [] },
      { id: 'repo', title: 'Request repository access', why: 'Start your first engineering task.', status: 'locked', depends_on: ['sso'] },
    ],
    readiness: 0,
    next_best_action: { id: 'sso', title: 'Complete SSO setup', status: 'todo' },
  });
}
