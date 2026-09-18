"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Inbox, Upload, Users } from 'lucide-react';

export default function AdminPage() {
  const [documents, setDocuments] = useState<Array<{ id: number; title: string; status: string; tags: string[] }>>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadDocuments = () => fetch('/api/admin/docs').then((response) => response.json()).then((data) => setDocuments(data.documents || []));
  useEffect(() => { loadDocuments(); }, []);

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setMessage('');
    const form = new FormData(); form.append('file', file);
    const response = await fetch('/api/admin/docs', { method: 'POST', body: form });
    if (response.ok) { setMessage(`${file.name} is ready for questions.`); loadDocuments(); } else setMessage('Upload failed. Check that the backend is running.');
    setUploading(false);
  };

  return <main id="main-content" className="dashboard-grid min-h-screen px-4 py-6 text-slate-900 sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl"><a href="/home" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Back to Sherpa</a><header className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Admin workspace</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Keep knowledge useful.</h1><p className="mt-3 max-w-xl text-slate-600">Upload the documents your people actually use. Sherpa will make them searchable in the ask flow.</p></div><label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary/90"><Upload size={17} /> {uploading ? 'Uploading...' : 'Upload document'}<input type="file" accept=".txt,.md,.csv,.pdf,.docx" className="sr-only" onChange={upload} /></label></header>{message ? <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{message}</p> : null}<section className="mt-8 grid gap-5 sm:grid-cols-3"><div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><FileText className="text-primary" size={20} /><p className="mt-4 text-3xl font-bold">{documents.length}</p><p className="text-sm text-slate-500">Knowledge documents</p></div><div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><Inbox className="text-amber-600" size={20} /><p className="mt-4 text-3xl font-bold">Ready</p><p className="text-sm text-slate-500">Index status</p></div><div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><Users className="text-primary" size={20} /><p className="mt-4 text-3xl font-bold">8</p><p className="text-sm text-slate-500">Demo contacts</p></div></section><section className="mt-5 rounded-2xl bg-white p-6 ring-1 ring-slate-200"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Knowledge library</p><h2 className="mt-1 text-2xl font-bold">Documents</h2></div><span className="text-sm text-slate-500">{documents.length} indexed</span></div><div className="mt-5 divide-y divide-slate-100">{documents.map((document) => <div key={document.id} className="flex items-center justify-between py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100"><FileText size={17} className="text-slate-500" /></div><div><p className="font-semibold">{document.title}</p><p className="text-xs text-slate-500">{document.tags?.join(' · ') || 'General knowledge'}</p></div></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{document.status}</span></div>)}{documents.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">No documents yet. Upload your first onboarding guide.</p> : null}</div></section></div></main>;
}
