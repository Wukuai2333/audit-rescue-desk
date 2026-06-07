interface AuditReportProps {
  markdown: string;
  onDownload: () => void;
}

export default function AuditReport({ markdown, onDownload }: AuditReportProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Audit Report</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Export a Markdown audit report</h2>
        </div>
        <button
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={onDownload}
        >
          Download .md
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        {markdown ? (
          <div>
            <p className="font-medium text-slate-900">Report preview:</p>
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-6 text-slate-700">{markdown.slice(0, 500)}{markdown.length > 500 ? '...' : ''}</pre>
          </div>
        ) : (
          <p>No report is available yet. Generate a report by uploading a CSV file and reviewing detected issues.</p>
        )}
      </div>
    </section>
  );
}
