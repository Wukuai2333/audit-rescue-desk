export default function ProductBrief() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-600">Product Brief</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Audit Rescue Desk</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            A compliance-focused tool for the Kaggle Track 01 Harven Manufacturing dataset. It helps non-technical audit teams upload manufacturing data, find corrupted records, explain every issue, and export an audit-ready report.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">Track 01 ready</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Benchmark Mode available</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">Non-technical UX</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">End user</p>
          <p className="mt-2 text-slate-600">Compliance officer with no SQL or database experience.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Problem solved</p>
          <p className="mt-2 text-slate-600">Corrupted manufacturing data before audit: duplicates, conflicting units, impossible values, and orphaned references.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Success</p>
          <p className="mt-2 text-slate-600">Upload CSV, review issues, approve or flag fixes, download a report.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Audit promise</p>
          <p className="mt-2 text-slate-600">Explainable decision trail with Cognee memory shown in the interface.</p>
        </div>
      </div>
    </section>
  );
}
