const rolloutSteps = [
  {
    title: 'Baseline the audit file',
    detail: 'Upload the latest warehouse export and confirm the app sees the expected row count, columns, and plants.'
  },
  {
    title: 'Review high-risk exceptions',
    detail: 'Start with critical and high-risk records so the compliance team spends attention where audit exposure is highest.'
  },
  {
    title: 'Capture human decisions',
    detail: 'Accept, reject, or send each suggested action for review while preserving the reason behind the decision.'
  },
  {
    title: 'Prepare the audit packet',
    detail: 'Export the narrative report with issue evidence, agent reasoning, memory trail, and outstanding review items.'
  }
];

const businessSignals = [
  'Designed for compliance teams that do not write SQL.',
  'Keeps every suggested correction explainable and human-approved.',
  'Turns corrupted manufacturing data into a defensible audit workflow.'
];

export default function SubmissionChecklist() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Audit Launch Plan</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">From broken export to audit-ready packet</h2>

      <div className="mt-6 space-y-4">
        {rolloutSteps.map((step, index) => (
          <div key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{step.title}</p>
                <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-900 p-5 text-sm text-white">
        <p className="font-semibold">Business value</p>
        <ul className="mt-3 space-y-2 text-slate-200">
          {businessSignals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
