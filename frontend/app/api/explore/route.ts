import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  try {
    const response = await fetch(`${backendUrl}/api/explore`, { signal: AbortSignal.timeout(2500) });
    if (response.ok) return NextResponse.json(await response.json());
  } catch {}
  return NextResponse.json({
    tools: [{ name: 'Slack', purpose: 'Team communication' }, { name: 'GitHub', purpose: 'Engineering repositories' }, { name: 'VPN', purpose: 'Secure remote access' }],
    people: [{ name: 'IT Helpdesk', role: 'IT', email: 'helpdesk@nimbuslabs.example', expertise: 'VPN, SSO, laptop setup' }],
    documents: [],
  });
}
