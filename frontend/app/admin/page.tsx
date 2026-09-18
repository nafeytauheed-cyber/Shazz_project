"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Inbox, Upload, Users } from 'lucide-react';

export default function AdminPage() {
  const [documents, setDocuments] = useState<Array<{ id: number; title: string; status: string; tags: string[] }>>([]);
  const [questions, setQuestions] = useState<Array<{ id: number; text: string; status: string; priority: number }>>([]);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('sherpa_token') || ''}` });
  const loadDocuments = () => fetch('/api/admin/docs', { headers: authHeaders() }).then((response) => { if (response.status === 401 || response.status === 403) { window.location.href = '/home'; return null; } return response.json(); }).then((data) => data && setDocuments(data.documents || []));
  const loadQuestions = () => fetch('/api/admin/questions', { headers: authHeaders() }).then((response) => response.json()).then((data) => setQuestions(data.questions || []));
  useEffect(() => { try { if (JSON.parse(localStorage.getItem('sherpa_user') || '{}').role !== 'admin') { window.location.href = '/home'; return; } } catch { window.location.href = '/login'; return; } loadDocuments(); loadQuestions(); }, []);

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setMessage('');
    const form = new FormData(); form.append('file', file);
    const response = await fetch('/api/admin/docs', { method: 'POST', body: form, headers: authHeaders() });
    if (response.ok) { setMessage(`${file.name} is ready for questions.`); loadDocuments(); } else setMessage('Upload failed. Check that the backend is running.');
    setUploading(false);
  };

  const answerQuestion = async (id: number) => {
    const answer = drafts[id]?.trim();
    if (!answer) return;
    await fetch(`/api/admin/questions/${id}`, { method: 'PATCH', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ answer }) });
    setDrafts((current) => ({ ...current, [id]: '' }));
    loadQuestions();
  };

  return <main id="main-content" className="dashboard-grid min-h-screen px-4 py-6 text-slate-900 sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl"><a href="/home" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Back to Sherpa</a><header className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Admin workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Keep knowledge useful.</h1><p className="mt-3 max-w-xl text-slate-600">Upload documents, answer the questions Sherpa could not, and improve onboarding for everyone.</p></div><label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90"><Upload size={17} /> {uploading ? 'Uploading...' : 'Upload document'}<input type="file" accept=".txt,.md,.csv,.pdf,.docx" className="sr-only" onChange={upload} /></label></header>{message ? <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{message}</p> : null}<section className="mt-8 grid gap-5 sm:grid-cols-3"><div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><FileText className="text-primary" size={20} /><p className="mt-4 text-3xl font-bold">{documents.length}</p><p className="text-sm text-slate-500">Knowledge documents</p></div><div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><Inbox className="text-amber-600" size={20} /><p className="mt-4 text-3xl font-bold">{questions.filter((question) => question.status === 'open').length}</p><p className="text-sm text-slate-500">Open questions</p></div><div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><Users className="text-primary" size={20} /><p className="mt-4 text-3xl font-bold">8</p><p className="text-sm text-slate-500">Demo contacts</p></div></section><section className="mt-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Needs your expertise</p><h2 className="mt-1 text-2xl font-bold">Unanswered questions</h2></div><span className="text-sm text-slate-500">Highest priority first</span></div><div className="mt-5 space-y-3">{questions.map((question) => <div key={question.id} className="rounded-xl border border-slate-100 p-4"><div className="flex items-start justify-between gap-4"><p className="font-semibold text-slate-800">{question.text}</p><span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${question.status === 'open' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{question.status}</span></div><p className="mt-2 text-xs text-slate-500">Priority score: {question.priority}</p>{question.status === 'open' ? <div className="mt-3 flex gap-2"><input value={drafts[question.id] || ''} onChange={(event) => setDrafts((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Write a verified answer..." className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" /><button onClick={() => answerQuestion(question.id)} className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white">Answer</button></div> : null}</div>)}{questions.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">No unanswered questions. Nice work.</p> : null}</div></section><section className="mt-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Knowledge library</p><h2 className="mt-1 text-2xl font-bold">Documents</h2></div><span className="text-sm text-slate-500">{documents.length} indexed</span></div><div className="mt-5 divide-y divide-slate-100">{documents.map((document) => <div key={document.id} className="flex items-center justify-between py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100"><FileText size={17} className="text-slate-500" /></div><div><p className="font-semibold">{document.title}</p><p className="text-xs text-slate-500">{document.tags?.join(' · ') || 'General knowledge'}</p></div></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{document.status}</span></div>)}{documents.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">No documents yet. Upload your first onboarding guide.</p> : null}</div></section></div></main>;
}
