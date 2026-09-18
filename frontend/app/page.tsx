export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-primary">Sherpa</h1>
        <p className="mt-3 text-lg">Day-one answers. Week-one momentum. Zero repeated questions.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-semibold">Ask</h2>
            <p className="mt-2 text-sm text-slate-600">Grounded onboarding answers with citations.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-semibold">Guide</h2>
            <p className="mt-2 text-sm text-slate-600">Personalized tasks and readiness score.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-semibold">Route</h2>
            <p className="mt-2 text-sm text-slate-600">Escalate unanswered questions to the right expert.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
