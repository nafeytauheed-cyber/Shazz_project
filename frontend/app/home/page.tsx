"use client";

import { useEffect, useState } from 'react';
import { ArrowUpRight, BookOpen, Check, CircleHelp, LogOut, Sparkles, Users, Wrench } from 'lucide-react';

export default function HomePage() {
  const [query, setQuery] = useState('How do I get VPN access?');
  const [answer, setAnswer] = useState('');
  const [source, setSource] = useState<{ title: string; section: string } | null>(null);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const tasks = ['Complete SSO setup', 'Enroll in MFA', 'Request repository access'];
  const quickQuestions = ['How do I get VPN access?', 'What should I set up first?', 'Who can help with payroll?'];

  const askSherpa = async () => {
    setLoading(true);
    setAnswer('');
    setSource(null);
    setFallback(false);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, persona: 'Alex' }),
      });
      if (!res.ok) throw new Error('Chat request failed');
      const data = await res.json();
      setAnswer(data.answer);
      setSource(data.sources?.[0] ?? null);
      setFallback(Boolean(data.fallback));
    } catch {
      setAnswer('Sherpa is temporarily unavailable. Please try again.');
      setFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('sherpa_token')) window.location.href = '/login';
  }, []);

  return (
    <main id="main-content" className="dashboard-grid min-h-screen px-4 py-5 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center justify-between border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white"><Sparkles size={20} /></div><div><p className="text-lg font-bold tracking-tight">Sherpa</p><p className="text-xs text-slate-500">Nimbus Labs onboarding</p></div></div>
          <button aria-label="Sign out" title="Sign out" onClick={() => { localStorage.removeItem('sherpa_token'); window.location.href = '/login'; }} className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-primary"><LogOut size={18} /></button>
        </nav>
        <section className="rise-in grid gap-8 py-10 lg:grid-cols-[1fr_280px] lg:items-end">
          <div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Tuesday, September 19</p><h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">A clearer first week<br /><span className="text-primary">starts here.</span></h1><p className="mt-4 max-w-xl text-lg leading-7 text-slate-600">Good morning, Alex. Sherpa keeps your questions, people, and next steps in one calm place.</p></div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-600">Readiness</span><span className="text-2xl font-bold text-primary">82%</span></div><div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 w-[82%] rounded-full bg-accent" /></div><p className="mt-3 text-xs text-slate-500">You are on track for week one.</p></div>
        </section>
        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Your path</p><h2 className="mt-1 text-2xl font-bold">Next steps</h2></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">2 of 5 complete</span></div><div className="mt-6 space-y-3">{tasks.map((task, index) => { const done = completed.includes(task); return <button key={task} onClick={() => setCompleted(done ? completed.filter((item) => item !== task) : [...completed, task])} className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-3 text-left transition hover:border-primary/30 hover:bg-slate-50"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${done ? 'border-primary bg-primary text-white' : index === 2 ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-accent bg-amber-50 text-amber-700'}`}>{done ? <Check size={16} /> : <span className="text-xs font-bold">0{index + 1}</span>}</span><span className={`flex-1 text-sm font-semibold ${done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task}</span><ArrowUpRight size={16} className="text-slate-300" /></button>; })}</div></div>
          <div className="rounded-2xl bg-primary p-6 text-white shadow-sm"><Users size={22} className="text-amber-300" /><h2 className="mt-5 text-2xl font-bold">People in your corner</h2><p className="mt-2 text-sm leading-6 text-slate-200">You do not have to figure everything out alone.</p><div className="mt-6 space-y-3 text-sm"><div className="flex items-center justify-between border-b border-white/15 pb-3"><span>IT Helpdesk</span><span className="text-xs text-amber-300">Access</span></div><div className="flex items-center justify-between border-b border-white/15 pb-3"><span>HR & Payroll</span><span className="text-xs text-amber-300">People</span></div><div className="flex items-center justify-between"><span>Engineering Manager</span><span className="text-xs text-amber-300">Team</span></div></div></div>
        </section>
        <section className="mt-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-600"><CircleHelp size={19} /></div><div><h2 className="text-xl font-bold">Ask Sherpa</h2><p className="text-sm text-slate-500">Answers grounded in Nimbus Labs docs.</p></div></div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row"><input aria-label="Ask Sherpa a question" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') askSherpa(); }} className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" /><button onClick={askSherpa} className="min-h-12 rounded-xl bg-primary px-6 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60" disabled={loading}>{loading ? 'Thinking...' : 'Ask Sherpa'}</button></div>
          <div className="mt-3 flex flex-wrap gap-2">{quickQuestions.map((question) => <button key={question} onClick={() => setQuery(question)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-primary hover:text-primary">{question}</button>)}</div>
          <div aria-live="polite" className={`mt-6 min-h-24 rounded-xl border p-5 ${answer ? 'border-primary/15 bg-[#f7fbfa]' : 'border-dashed border-slate-200 bg-slate-50'}`}><p className="text-sm leading-7 text-slate-700">{answer || 'Ask a question to get a practical next step.'}</p>{source ? <p className="mt-4 border-t border-primary/10 pt-3 text-xs font-semibold text-primary"><BookOpen size={13} className="mr-1 inline" /> {source.title} · {source.section}</p> : null}{fallback ? <p className="mt-3 text-sm font-medium text-amber-700">Try IT Helpdesk: helpdesk@nimbuslabs.example</p> : null}</div>
        </section>
        <section className="grid gap-5 py-5 sm:grid-cols-2"><div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><div className="flex items-center gap-3"><Wrench size={18} className="text-primary" /><h2 className="font-bold">Your toolkit</h2></div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-lg bg-slate-100 px-3 py-2 text-sm">Slack</span><span className="rounded-lg bg-slate-100 px-3 py-2 text-sm">GitHub</span><span className="rounded-lg bg-slate-100 px-3 py-2 text-sm">VPN</span></div></div><div className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-100"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">One useful thing</p><p className="mt-2 text-sm leading-6 text-amber-950">Finish SSO before requesting repository access. It unlocks the rest of your setup.</p></div></section>
      </div>
    </main>
  );
}
