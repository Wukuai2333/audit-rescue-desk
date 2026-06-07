const workflowSteps = [
  {
    title: 'Load the audit evidence',
    description:
      'Start with the Harven manufacturing audit export or upload a new CSV. The workspace shows file identity, row count, columns, and a short raw data preview so the officer knows what they are reviewing.'
  },
  {
    title: 'Group data quality problems',
    description:
      'The product should summarize issues by quality category first, then let users inspect examples. This keeps the workflow approachable for officers who do not work in SQL.'
  },
  {
    title: 'Rank audit risk with human control',
    description:
      'Agents recommend an initial risk order and P0-P3 fix priority. The compliance owner can override the ranking when local business context changes the severity.'
  },
  {
    title: 'Choose the final remediation plan',
    description:
      'For each issue category, the user chooses whether to hold, escalate, request validation, annotate, or stage a cleaned draft. Nothing is silently overwritten.'
  },
  {
    title: 'Generate the audit packet',
    description:
      'The report brings together evidence, risk ranking, human decisions, agent notes, Cognee memory, and remaining open items into a plain-English audit narrative.'
  }
];

const toolNarrative = [
  {
    name: 'Cognee SDK',
    role: 'Memory layer',
    story:
      'Cognee stores agent handoffs, user risk overrides, remediation choices, and natural-language policy notes. Over time, Policy Memory helps the system recall how this team handles similar audit risk.'
  },
  {
    name: 'Geodo',
    role: 'Domain research',
    story:
      'The Domain Expert uses Geodo to research real-world customers, companies, and market context. Those notes explain why traceability, acquired plants, and audit defensibility matter beyond the CSV.'
  },
  {
    name: 'Kaggle Track 01',
    role: 'Benchmark evidence',
    story:
      'The Harven manufacturing dataset gives the demo a realistic audit crisis: corrupted warehouse data four days before a regulatory audit.'
  },
  {
    name: 'Trupeer',
    role: 'Demo delivery',
    story:
      'Trupeer turns the workflow into a clear five-minute product story: load evidence, detect categories, review priorities, save policy memory, and export the audit packet.'
  }
];

export default function Tutorial() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Product Tutorial</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">How Audit Rescue Desk becomes a learning audit workflow</h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
          Audit Rescue Desk is designed for manufacturing compliance officers who need to rescue corrupted audit data
          without writing SQL. The long-term product vision is not just to detect issues once, but to remember how each
          compliance team ranks risk and handles remediation.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Workflow</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">From broken CSV to defensible audit packet</h3>
          <div className="mt-6 space-y-4">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Long-Term Story</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Policy Memory is the product moat</h3>
          <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            <p>
              Every review teaches the system something about the team: which issues block the audit, when a record
              should be escalated, and what remediation language belongs in the report.
            </p>
            <p>
              Cognee SDK is the memory layer behind that learning loop. The app writes concise policy summaries with
              <span className="font-semibold text-slate-900"> remember</span>, retrieves prior guidance with
              <span className="font-semibold text-slate-900"> recall</span>, and can promote selected session memory with
              <span className="font-semibold text-slate-900"> improve</span> when an LLM key is configured.
            </p>
            <div className="rounded-3xl bg-slate-950 p-5 text-slate-100">
              <p className="font-semibold">Product promise</p>
              <p className="mt-2 text-slate-300">
                The first audit finds the problems. The next audit starts with the team's remembered policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Mandatory Tools In The Narrative</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">How each tool supports the business story</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {toolNarrative.map((tool) => (
            <div key={tool.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900">{tool.name}</p>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  {tool.role}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{tool.story}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-panel">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Later Tutorial Content</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">Final screenshots and walkthrough notes will go here</h3>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
          After the product flow is finalized, this page can include short guided walkthroughs for officers: loading a
          dataset, reviewing categories, saving Policy Memory, and exporting the audit packet.
        </p>
      </div>
    </section>
  );
}
