"use client";

import { useState } from 'react';
import { ArrowRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';

const personas = [
  { name: 'Alex', label: 'Newcomer • Backend' },
  { name: 'Sam', label: 'Newcomer • Product' },
  { name: 'Jordan', label: 'Admin' },
];

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const signIn = async (persona: string) => {
    setLoading(persona);
    setError('');
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      localStorage.setItem('sherpa_token', data.token);
      window.location.href = '/home';
    } catch (err) {
      setError('Unable to sign in with that persona.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main id="main-content" className="grid min-h-screen bg-[#f3f7f6] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-between"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[32px] border-white/10" /><div className="absolute bottom-16 right-16 h-36 w-36 rounded-full border border-amber-300/40" /><div className="relative"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-primary"><Sparkles size={22} /></div><span className="text-xl font-bold">Sherpa</span></div><h1 className="mt-24 max-w-lg text-6xl font-bold leading-[1.04]">Your first week,<br /><span className="text-amber-300">with a guide.</span></h1><p className="mt-6 max-w-md text-lg leading-8 text-slate-200">Find the right answer, the right person, and the right next step without digging through scattered docs.</p></div><div className="relative flex gap-8 text-sm text-slate-200"><span><Compass className="mb-2 text-amber-300" size={18} />Find your way</span><span><ShieldCheck className="mb-2 text-amber-300" size={18} />Stay grounded</span></div></section>
      <section className="flex items-center justify-center p-6 sm:p-10"><div className="w-full max-w-md"><div className="mb-10 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white"><Sparkles size={20} /></div><span className="text-lg font-bold">Sherpa</span></div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Nimbus Labs</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Start exploring.</h1><p className="mt-3 text-base leading-6 text-slate-600">Choose a demo persona to see Sherpa from their perspective.</p>

        <div className="mt-6 space-y-3">
          {personas.map((persona) => (
            <button
              key={persona.name}
              onClick={() => signIn(persona.name.toLowerCase())}
              disabled={loading !== null}
              className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md disabled:opacity-70"
            >
              <div>
                <div className="font-semibold text-slate-900">{persona.name}</div>
                <div className="text-sm text-slate-600">{persona.label}</div>
              </div>
              <span className="text-primary">{loading === persona.name.toLowerCase() ? '...' : <ArrowRight size={18} className="transition group-hover:translate-x-1" />}</span>
            </button>
          ))}
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <p className="mt-8 text-xs leading-5 text-slate-500">Demo mode uses sample Nimbus Labs content. No account or API key is required.</p></div></section>
    </main>
  );
}
