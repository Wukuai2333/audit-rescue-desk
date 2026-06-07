interface MemoryEntry {
  agent: string;
  note: string;
}

interface CogneeMemoryTrailProps {
  memoryTrail: MemoryEntry[];
  cloudStatus?: {
    configured: boolean;
    connected: boolean;
    mode?: string;
    datasetName: string;
    baseUrl: string;
    message: string;
    llmConfigured?: boolean;
  } | null;
}

export default function CogneeMemoryTrail({ memoryTrail, cloudStatus }: CogneeMemoryTrailProps) {
  const statusLabel = cloudStatus?.connected
    ? cloudStatus.mode === 'local_sdk'
      ? 'Cognee SDK connected'
      : 'Cognee connected'
    : cloudStatus?.configured
      ? 'Cognee configured'
      : 'Cognee SDK not running';

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Cognee Memory Trail</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Shared audit memory layer</h2>
        </div>
        <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800">{statusLabel}</span>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Each agent stores outputs in a shared memory layer so the next agent can recall findings and build the audit narrative.
        When the Cognee SDK bridge is running, these traces are written through real cognee.remember calls.
      </p>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Cognee SDK usage</p>
        <p className="mt-2">{cloudStatus?.message ?? 'Checking Cognee SDK bridge...'}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Dataset</p>
            <p className="mt-1 font-medium text-slate-900">{cloudStatus?.datasetName ?? 'audit_rescue_desk_policy_memory'}</p>
          </div>
          <div className="rounded-2xl bg-white p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">SDK operation</p>
            <p className="mt-1 font-medium text-slate-900">remember session traces + recall policy memory</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          LLM key: {cloudStatus?.llmConfigured ? 'configured for optional improve/permanent memory' : 'not required for low-cost session memory'}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {memoryTrail.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
            Cognee memory is waiting for CSV upload and agent analysis.
          </div>
        ) : (
          memoryTrail.map((entry, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">{entry.agent}</p>
              <p className="mt-2 text-slate-700">{entry.note}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
