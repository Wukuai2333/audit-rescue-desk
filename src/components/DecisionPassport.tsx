import { useEffect, useMemo, useState } from 'react';
import { FixPriority, Issue } from '../utils/issueTypes';

interface DecisionPassportProps {
  issues: Issue[];
  onDecisionChange: (issueId: string, decision: Issue['humanDecision']) => void;
  onPriorityChange: (issueId: string, priority: FixPriority) => void;
}

const decisionButtons = [
  { label: 'Accept Fix', value: 'Accept Fix' as const, style: 'bg-emerald-600 text-white', active: 'ring-4 ring-emerald-200' },
  { label: 'Reject', value: 'Reject' as const, style: 'bg-rose-600 text-white', active: 'ring-4 ring-rose-200' },
  { label: 'Needs Review', value: 'Needs Review' as const, style: 'bg-amber-500 text-slate-900', active: 'ring-4 ring-amber-200' }
];

const priorityOptions: FixPriority[] = ['P0 Block Audit', 'P1 Fix Before Review', 'P2 Review Soon', 'P3 Track'];

const priorityTone: Record<FixPriority, string> = {
  'P0 Block Audit': 'bg-rose-100 text-rose-800',
  'P1 Fix Before Review': 'bg-amber-100 text-amber-900',
  'P2 Review Soon': 'bg-sky-100 text-sky-800',
  'P3 Track': 'bg-slate-100 text-slate-700'
};

function getStepTone(agent: string) {
  if (agent.includes('Mira')) {
    return 'bg-sky-100 text-sky-800 ring-sky-200';
  }
  if (agent.includes('Rafi')) {
    return 'bg-rose-100 text-rose-800 ring-rose-200';
  }
  if (agent.includes('Elena')) {
    return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
  }
  return 'bg-violet-100 text-violet-800 ring-violet-200';
}

export default function DecisionPassport({ issues, onDecisionChange, onPriorityChange }: DecisionPassportProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');

  useEffect(() => {
    if (issues.length === 0) {
      setSelectedIssueId('');
      return;
    }

    if (!issues.some((issue) => issue.id === selectedIssueId)) {
      setSelectedIssueId(issues[0].id);
    }
  }, [issues, selectedIssueId]);

  const selectedIndex = useMemo(
    () => Math.max(0, issues.findIndex((issue) => issue.id === selectedIssueId)),
    [issues, selectedIssueId]
  );
  const selectedIssue = issues[selectedIndex];
  const reviewedCount = issues.filter((issue) => issue.humanDecision).length;

  const goToIssue = (offset: number) => {
    if (issues.length === 0) {
      return;
    }
    const nextIndex = Math.min(Math.max(selectedIndex + offset, 0), issues.length - 1);
    setSelectedIssueId(issues[nextIndex].id);
  };

  const handleDecision = (decision: Issue['humanDecision']) => {
    if (!selectedIssue) {
      return;
    }
    onDecisionChange(selectedIssue.id, decision);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Decision Passport</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Review queue for audit exceptions</h2>
          <p className="mt-2 text-sm text-slate-600">
            Select an issue from the queue, review the evidence, set priority, and record a human decision.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          {reviewedCount}/{issues.length} reviewed
        </div>
      </div>

      {issues.length === 0 || !selectedIssue ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
          No issues are ready for review. Load the audit dataset to generate exceptions.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[0.42fr_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">Issue queue</p>
              <span className="text-sm text-slate-500">{issues.length} total</span>
            </div>
            <div className="mt-4 max-h-[720px] space-y-2 overflow-auto pr-1">
              {issues.map((issue, index) => (
                <button
                  key={issue.id}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    issue.id === selectedIssue.id
                      ? 'border-slate-900 bg-white shadow-sm'
                      : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                  }`}
                  type="button"
                  onClick={() => setSelectedIssueId(issue.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">
                      {index + 1}. {issue.id}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityTone[issue.humanPriority]}`}>
                      {issue.humanPriority.split(' ')[0]}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-700">{issue.visibleReason}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{issue.type}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {issue.humanDecision || 'Pending'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">{selectedIssue.id}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{selectedIssue.type}</span>
                  <span className={`rounded-full px-3 py-1 font-semibold ${priorityTone[selectedIssue.humanPriority]}`}>
                    {selectedIssue.humanPriority}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{selectedIssue.visibleReason}</h3>
              </div>
              <div className="space-y-2 text-left text-sm sm:text-right">
                <p className="font-semibold text-slate-900">Risk: {selectedIssue.riskLevel}</p>
                <p className="text-slate-600">Confidence: {selectedIssue.confidence}%</p>
                <p className="text-slate-600">Queue item {selectedIndex + 1} of {issues.length}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Affected rows</p>
                <p className="mt-2 text-slate-700">{selectedIssue.rows.join(', ')}</p>
              </div>
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Evidence</p>
                <p className="mt-2 whitespace-pre-line text-slate-700">{selectedIssue.evidence}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Why it matters</p>
                <p className="mt-2 text-slate-700">{selectedIssue.whyItMatters}</p>
              </div>
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Suggested action</p>
                <p className="mt-2 text-slate-700">{selectedIssue.suggestedAction}</p>
              </div>
              <div className="rounded-3xl bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Human decision</p>
                <p className="mt-2 text-slate-700">{selectedIssue.humanDecision || 'No decision yet'}</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
              <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <label className="text-sm text-slate-700">
                  <span className="mb-2 block font-semibold text-slate-900">Manual fix priority</span>
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400"
                    value={selectedIssue.humanPriority}
                    onChange={(event) => onPriorityChange(selectedIssue.id, event.target.value as FixPriority)}
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Priority reason</p>
                  <p className="mt-2 text-sm text-slate-700">{selectedIssue.priorityReason}</p>
                  <p className="mt-2 text-xs text-slate-500">Agent recommended: {selectedIssue.recommendedPriority}</p>
                </div>
              </div>
            </div>

            <details className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Analyst notes</p>
                    <p className="mt-1 text-sm text-slate-600">Open to see how the specialist agents reached this recommendation.</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {selectedIssue.agentTrail.length} reasoning step(s)
                  </span>
                </div>
              </summary>

              <div className="mt-5 space-y-4">
                {selectedIssue.agentTrail.map((step, index) => (
                  <div key={`${selectedIssue.id}-${step.agent}-${index}`} className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${getStepTone(step.agent)}`}>
                        {step.agent}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{step.role}</span>
                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Focus</p>
                        <p className="mt-1 text-sm text-slate-700">{step.focus}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Workstyle</p>
                        <p className="mt-1 text-sm text-slate-700">{step.workstyle}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Decision</p>
                        <p className="mt-1 text-sm text-slate-700">{step.decision}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reason</p>
                        <p className="mt-1 text-sm text-slate-700">{step.reason}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Evidence used</p>
                      <p className="mt-1 text-sm text-slate-700">{step.evidenceUsed}</p>
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                {decisionButtons.map((button) => {
                  const active = selectedIssue.humanDecision === button.value;
                  return (
                    <button
                      key={button.label}
                      className={`${button.style} ${active ? button.active : ''} rounded-full px-5 py-2 text-sm font-semibold transition hover:opacity-90`}
                      onClick={() => handleDecision(button.value)}
                      type="button"
                    >
                      {active ? `${button.label} saved` : button.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={selectedIndex === 0}
                  onClick={() => goToIssue(-1)}
                  type="button"
                >
                  Previous
                </button>
                <button
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={selectedIndex === issues.length - 1}
                  onClick={() => goToIssue(1)}
                  type="button"
                >
                  Next issue
                </button>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
