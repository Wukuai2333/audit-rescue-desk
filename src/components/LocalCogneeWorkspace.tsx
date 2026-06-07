import { useMemo, useState } from 'react';
import { WorkspaceArtifact } from '../memory/cogneeMemory';
import { improveCogneeMemory, rememberCogneePolicy, searchCogneeMemory } from '../services/cogneeClient';

interface LocalCogneeWorkspaceProps {
  artifacts: WorkspaceArtifact[];
}

const typeLabel: Record<WorkspaceArtifact['type'], string> = {
  agent_playbook: 'Agent playbook',
  raw_dataset: 'Raw dataset',
  analysis_result: 'Analysis result',
  audit_report: 'Audit report'
};

export default function LocalCogneeWorkspace({ artifacts }: LocalCogneeWorkspaceProps) {
  const [query, setQuery] = useState('');
  const [policyText, setPolicyText] = useState('');
  const [sdkResult, setSdkResult] = useState<string>('');
  const [isWorking, setIsWorking] = useState(false);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return artifacts.slice(0, 8);
    }

    return artifacts
      .filter((artifact) => `${artifact.title} ${artifact.summary} ${artifact.type}`.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [artifacts, query]);

  const runSdkAction = async (action: () => Promise<unknown>, fallback: string) => {
    setIsWorking(true);
    setSdkResult('');
    try {
      const result = await action();
      setSdkResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setSdkResult(error instanceof Error ? error.message : fallback);
    } finally {
      setIsWorking(false);
    }
  };

  const handleRememberPolicy = () => {
    if (!policyText.trim()) {
      setSdkResult('Enter a policy note before saving memory.');
      return;
    }

    runSdkAction(
      () =>
        rememberCogneePolicy({
          policyText,
          riskRanking: 'User-defined ranking from current review',
          remediationPlan: 'User-defined remediation policy from current review',
          permanent: false,
          selfImprovement: false
        }),
      'Could not save policy memory.'
    );
  };

  const handleRecall = () => {
    runSdkAction(
      () => searchCogneeMemory(query || 'What policy memory should affect this audit review?'),
      'Could not recall Cognee memory.'
    );
  };

  const handleImprove = () => {
    runSdkAction(() => improveCogneeMemory(), 'Could not run Cognee improve.');
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Local Cognee Workspace</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Stored context for agent recall</h2>
          <p className="mt-2 text-sm text-slate-600">
            The app stores playbooks, raw dataset previews, analysis results, and reports so future agent runs can reuse the same context.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          {artifacts.length} artifact(s)
        </span>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-slate-900">Recall context</span>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
          placeholder="Search customer, report, playbook, priority..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-900">Policy Memory</p>
        <p className="mt-1 text-sm text-slate-600">
          Save how your team wants to rank risk or handle future exceptions. This uses Cognee SDK remember.
        </p>
        <textarea
          className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          placeholder="Example: For acquired plants, orphaned customer references should be escalated before unit conflicts. Do not auto-fix shipment dates without source documents."
          value={policyText}
          onChange={(event) => setPolicyText(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            disabled={isWorking}
            type="button"
            onClick={handleRememberPolicy}
          >
            Save policy memory
          </button>
          <button
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-50"
            disabled={isWorking}
            type="button"
            onClick={handleRecall}
          >
            Recall with Cognee
          </button>
          <button
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-50"
            disabled={isWorking}
            type="button"
            onClick={handleImprove}
          >
            Improve memory
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Improve can use the configured LLM path depending on Cognee settings. Use it only for concise policy summaries.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
            No stored context matches this search yet.
          </div>
        ) : (
          filtered.map((artifact) => (
            <div key={artifact.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                  {typeLabel[artifact.type]}
                </span>
                <span className="text-xs text-slate-500">{new Date(artifact.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">{artifact.title}</p>
              <p className="mt-1 text-sm text-slate-600">{artifact.summary}</p>
            </div>
          ))
        )}
      </div>

      {sdkResult && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-100">
          <p className="mb-2 font-semibold">Cognee SDK response</p>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap">{sdkResult}</pre>
        </div>
      )}
    </section>
  );
}
