import { FixPriority, Issue, IssueType } from '../utils/issueTypes';

interface IssueDashboardProps {
  issues: Issue[];
  hasDataset: boolean;
  isReferenceDataset: boolean;
  onPriorityChange: (issueId: string, priority: FixPriority) => void;
}

const issueTypes: IssueType[] = [
  'Contradiction',
  'Impossible Value',
  'Orphaned Reference',
  'Unit Conflict',
  'Duplicate Record',
  'Missing Value'
];

const priorityOptions: FixPriority[] = ['P0 Block Audit', 'P1 Fix Before Review', 'P2 Review Soon', 'P3 Track'];

const priorityTone: Record<FixPriority, string> = {
  'P0 Block Audit': 'bg-rose-100 text-rose-800',
  'P1 Fix Before Review': 'bg-amber-100 text-amber-900',
  'P2 Review Soon': 'bg-sky-100 text-sky-800',
  'P3 Track': 'bg-slate-100 text-slate-700'
};

const priorityTrack: Record<FixPriority, string> = {
  'P0 Block Audit': 'bg-rose-500',
  'P1 Fix Before Review': 'bg-amber-500',
  'P2 Review Soon': 'bg-sky-500',
  'P3 Track': 'bg-slate-400'
};

const priorityOrder: Record<FixPriority, number> = {
  'P0 Block Audit': 4,
  'P1 Fix Before Review': 3,
  'P2 Review Soon': 2,
  'P3 Track': 1
};

export default function IssueDashboard({ issues, hasDataset, isReferenceDataset, onPriorityChange }: IssueDashboardProps) {
  const totalIssues = issues.length;
  const maxIssueCount = Math.max(1, ...issueTypes.map((type) => issues.filter((issue) => issue.type === type).length));
  const issueCounts = issueTypes.map((type) => ({
    type,
    count: issues.filter((issue) => issue.type === type).length
  }));

  const queue = [...issues]
    .sort((a, b) => priorityOrder[b.humanPriority] - priorityOrder[a.humanPriority] || b.confidence - a.confidence)
    .slice(0, 8);

  const priorityCounts = priorityOptions.map((priority) => ({
    priority,
    count: issues.filter((issue) => issue.humanPriority === priority).length
  }));
  const boardStatus = !hasDataset
    ? {
        title: 'Waiting for dataset',
        detail: 'Load the audit dataset to build queue'
      }
    : isReferenceDataset
      ? {
          title: 'Reference file loaded',
          detail: 'Customer reference is context; load audit dataset to scan exceptions'
        }
      : totalIssues === 0
        ? {
            title: 'No exceptions found',
            detail: 'Current file has no issues under the active checks'
          }
        : {
            title: 'Analysis queue active',
            detail: `${totalIssues} exception(s) detected`
          };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel fade-in-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Exception & Fix Priority Board</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">What the dataset contains and what to fix first</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Agent 2 recommends a fix priority from the detected issue type, audit risk, and evidence. Compliance owners can override the priority before the report is exported.
          </p>
        </div>
        <div className="rounded-3xl bg-slate-950 px-5 py-4 text-sm text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"></span>
            </span>
            <span className="font-semibold">{boardStatus.title}</span>
          </div>
          <p className="mt-1 text-slate-300">{boardStatus.detail}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {priorityCounts.map(({ priority, count }) => (
          <div key={priority} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${priorityTone[priority]}`}>{priority}</span>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{count}</p>
            <p className="mt-1 text-sm text-slate-500">issue(s)</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${priorityTrack[priority]} data-bar`}
                style={{ width: `${totalIssues ? Math.max(8, (count / totalIssues) * 100) : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Issue types found</p>
          <div className="mt-4 space-y-3">
            {issueCounts.map(({ type, count }) => (
              <div key={type} className="rounded-2xl bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-700">{type}</span>
                  <span className="text-sm font-semibold text-slate-900">{count}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-700 data-bar" style={{ width: `${(count / maxIssueCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 scan-surface">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-900">Fix queue</p>
            <span className="text-sm text-slate-500">Top {queue.length || 0}</span>
          </div>

          {queue.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
              {isReferenceDataset
                ? 'This customer reference file supports traceability checks, but it is not the audit exception dataset.'
                : hasDataset
                  ? 'No exceptions were generated for the current file.'
                  : 'Load the Kaggle audit dataset to generate a prioritized fix queue.'}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {queue.map((issue) => (
                <div key={issue.id} className="rounded-2xl bg-white p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{issue.id}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[issue.humanPriority]}`}>
                          {issue.humanPriority}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
                          {issue.type}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-900">{issue.visibleReason}</p>
                      <p className="mt-1 text-sm text-slate-600">{issue.priorityReason}</p>
                    </div>

                    <label className="min-w-52 text-sm text-slate-700">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Human priority
                      </span>
                      <select
                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400"
                        value={issue.humanPriority}
                        onChange={(event) => onPriorityChange(issue.id, event.target.value as FixPriority)}
                      >
                        {priorityOptions.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
