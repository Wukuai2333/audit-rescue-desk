import { ChangeEvent } from 'react';
import { AgentPersonaSet } from '../agents/agentPersonas';

interface AgentOperatingModelProps {
  personas: AgentPersonaSet;
  onUploadPlaybook: (markdown: string) => void;
  onResetPlaybook: () => void;
}

const accentStyle: Record<string, string> = {
  sky: 'bg-sky-100 text-sky-800 ring-sky-200',
  rose: 'bg-rose-100 text-rose-800 ring-rose-200',
  emerald: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  violet: 'bg-violet-100 text-violet-800 ring-violet-200'
};

export default function AgentOperatingModel({ personas, onUploadPlaybook, onResetPlaybook }: AgentOperatingModelProps) {
  const agents = [personas.inspector, personas.ranker, personas.advisor, personas.narrator];

  const handlePlaybookUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    onUploadPlaybook(await file.text());
    event.target.value = '';
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Design Agents</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Agent playbook for non-technical audit work</h2>
          <p className="mt-2 text-sm text-slate-600">
            Start with the default specialist roster, or upload a Markdown playbook that describes your team's preferred roles and decision style.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            href="/agent-playbooks/default-agent-playbook.md"
            download
          >
            Download template
          </a>
          <label className="cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            Upload playbook
            <input className="sr-only" type="file" accept=".md,text/markdown,text/plain" onChange={handlePlaybookUpload} />
          </label>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200" type="button" onClick={onResetPlaybook}>
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white">
            <div className="flex gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ring-1 ${accentStyle[agent.accent]}`}
              >
                {agent.initials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{agent.name}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    {agent.id}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-700">{agent.role}</p>
                <p className="mt-3 text-sm text-slate-600">{agent.focus}</p>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Workstyle</p>
                    <p className="mt-1 text-sm text-slate-700">{agent.workstyle}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Decision bias</p>
                    <p className="mt-1 text-sm text-slate-700">{agent.decisionStyle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
