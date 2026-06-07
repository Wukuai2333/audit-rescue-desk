export default function GeodoResearch() {
  const researchTargets = [
    {
      label: 'Customers',
      finding: 'Traceability matters because each shipment record must point to a real customer or account owner.',
      demoUse: 'Supports orphaned reference detection and customer_id review.'
    },
    {
      label: 'Companies',
      finding: 'Manufacturers under audit need evidence that acquired plants follow the same data controls.',
      demoUse: 'Supports plant-level risk discussion for Harven plants A, B, and C.'
    },
    {
      label: 'Market',
      finding: 'Regulated supply chains reward reliable audit trails, explainable corrections, and fast exception handling.',
      demoUse: 'Supports the product positioning for compliance officers.'
    }
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Geodo Research</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Domain Expert research dossier</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">Market-backed context</span>
      </div>

      <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-900">
        <p className="font-semibold">How we use Geodo</p>
        <p className="mt-2">
          The Domain Expert uses Geodo's web platform to research real-world entities around this product: customers,
          companies, and market context. These notes anchor the audit narrative in real compliance needs instead of only
          synthetic CSV findings.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {researchTargets.map((target) => (
          <div key={target.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{target.label}</p>
                <p className="mt-2 text-sm text-slate-700">{target.finding}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
                Geodo note
              </span>
            </div>
            <div className="mt-4 rounded-2xl bg-white p-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Used in product: </span>
              {target.demoUse}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <p>
          Manufacturing audits depend on accurate product quantities, consistent units, and records that can be traced from production to inspection. Duplicate or conflicting data can trigger regulatory findings, late recalls, and lost audit confidence.
        </p>
        <p>
          Audit Rescue Desk helps compliance officers explain what happened by turning broken data into clear issues, safe suggested actions, and a documented decision trail.
        </p>
        <p>
          In the real world, audit teams need to show how they handled each issue, why it mattered, and which decisions were accepted, rejected, or marked for review.
        </p>
      </div>

      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Demo proof to add after Geodo session</p>
        <p className="mt-2">
          Add the Domain Expert's Geodo screenshot or exported notes here before submission. The demo should say:
          "Geodo research validated the customer, company, and market assumptions behind the audit workflow."
        </p>
      </div>
    </section>
  );
}
