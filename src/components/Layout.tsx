import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Audit Rescue Desk</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                Explainable manufacturing data rescue for non-technical compliance officers
              </h1>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
              Demo-ready audit tool - Plain-language review - Cognee memory layer
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
