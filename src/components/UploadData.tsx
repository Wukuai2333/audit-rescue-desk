import { ChangeEvent } from 'react';

interface UploadDataProps {
  fileName: string;
  rowCount: number;
  columnCount: number;
  parsedHeaders: string[];
  statusMessage: string;
  onUpload: (file: File) => void;
  onLoadAuditDataset: () => void;
  onLoadCustomerReference: () => void;
  datasets: Array<{
    id: string;
    fileName: string;
    rowCount: number;
    issueCount: number;
    isReferenceDataset: boolean;
  }>;
  activeDatasetId: string;
  onSelectDataset: (datasetId: string) => void;
  previewRows: Record<string, string>[];
}

export default function UploadData({
  fileName,
  rowCount,
  columnCount,
  parsedHeaders,
  statusMessage,
  onUpload,
  onLoadAuditDataset,
  onLoadCustomerReference,
  datasets,
  activeDatasetId,
  onSelectDataset,
  previewRows
}: UploadDataProps) {
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Upload Data</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">CSV Upload & dataset summary</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center rounded-2xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
            type="button"
            onClick={onLoadAuditDataset}
          >
            Load audit dataset
          </button>
          <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            Choose CSV
            <input className="sr-only" type="file" accept=".csv" onChange={handleFileSelect} />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">File</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{fileName || 'No file selected'}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Rows</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{rowCount}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Columns</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{columnCount}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-900">Detected columns</p>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
              type="button"
              onClick={onLoadCustomerReference}
            >
              Load customer reference
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {parsedHeaders.length > 0 ? (
            parsedHeaders.map((header) => (
              <span key={header} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {header}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No headers detected yet. Upload a CSV to scan columns.</p>
          )}
        </div>
      </div>

      {datasets.length > 0 && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Uploaded datasets</p>
              <p className="mt-1 text-sm text-slate-500">Switch files to compare their analyzed results and raw preview.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
              {datasets.length} loaded
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {datasets.map((dataset) => (
              <button
                key={dataset.id}
                className={`rounded-2xl border p-4 text-left transition ${
                  dataset.id === activeDatasetId
                    ? 'border-slate-900 bg-white shadow-sm'
                    : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
                type="button"
                onClick={() => onSelectDataset(dataset.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-slate-900">{dataset.fileName}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {dataset.isReferenceDataset ? 'Reference' : 'Audit'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {dataset.rowCount} rows - {dataset.issueCount} issue(s)
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {previewRows.length > 0 && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Raw data preview</p>
              <p className="mt-1 text-sm text-slate-500">First five rows from the active dataset.</p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  {parsedHeaders.slice(0, 8).map((header) => (
                    <th key={header} className="whitespace-nowrap px-4 py-3 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {previewRows.map((row, rowIndex) => (
                  <tr key={`${fileName}-${rowIndex}`}>
                    {parsedHeaders.slice(0, 8).map((header) => (
                      <td key={header} className="max-w-56 truncate whitespace-nowrap px-4 py-3">
                        {row[header] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsedHeaders.length > 8 && (
            <p className="mt-3 text-xs text-slate-500">Showing first 8 of {parsedHeaders.length} columns.</p>
          )}
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <p>{statusMessage}</p>
      </div>
    </section>
  );
}
