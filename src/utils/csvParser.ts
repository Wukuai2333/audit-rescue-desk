import Papa from 'papaparse';

export interface ParsedCsvResult {
  headers: string[];
  rows: Record<string, string>[];
}

function normalizeParsedRows(data: Record<string, string>[], headers: string[]) {
  return data.map((row) => {
    const normalized: Record<string, string> = {};
    Object.entries(row).forEach(([key, value]) => {
      normalized[key?.trim() ?? ''] = value?.trim?.() ?? '';
    });
    headers.forEach((header) => {
      normalized[header] = normalized[header] ?? '';
    });
    return normalized;
  });
}

export function parseCsvText(csvText: string): Promise<ParsedCsvResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields?.filter(Boolean).map((field) => field.trim()) ?? [];
        resolve({ headers, rows: normalizeParsedRows(results.data, headers) });
      },
      error: (error: Error) => reject(error)
    });
  });
}

export function parseCsvFile(file: File): Promise<ParsedCsvResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields?.filter(Boolean).map((field) => field.trim()) ?? [];
        resolve({ headers, rows: normalizeParsedRows(results.data, headers) });
      },
      error: (error) => reject(error)
    });
  });
}
