import { useEffect, useState } from 'react';
import { parseCsvFile, parseCsvText } from './utils/csvParser';
import { downloadMarkdownReport } from './utils/reportExport';
import { inspectData } from './agents/dataInspector';
import { rankIssues } from './agents/riskRanker';
import { adviseFixes } from './agents/fixAdvisor';
import { createAuditReport } from './agents/auditNarrator';
import { clearMemory, getMemoryTrail, getWorkspaceArtifacts, rememberAgentOutput, rememberWorkspaceArtifact, WorkspaceArtifact } from './memory/cogneeMemory';
import { FixPriority, Issue } from './utils/issueTypes';
import Layout from './components/Layout';
import ProductBrief from './components/ProductBrief';
import UploadData from './components/UploadData';
import IssueDashboard from './components/IssueDashboard';
import DecisionPassport from './components/DecisionPassport';
import CogneeMemoryTrail from './components/CogneeMemoryTrail';
import GeodoResearch from './components/GeodoResearch';
import AuditReport from './components/AuditReport';
import SubmissionChecklist from './components/SubmissionChecklist';
import AgentOperatingModel from './components/AgentOperatingModel';
import LocalCogneeWorkspace from './components/LocalCogneeWorkspace';
import Tutorial from './components/Tutorial';
import { CogneeStatus, getCogneeStatus, rememberCogneeEntry } from './services/cogneeClient';
import { AgentPersonaSet, defaultAgentPersonas } from './agents/agentPersonas';
import { parseAgentPlaybookMarkdown, serializeAgentPlaybook } from './agents/agentPlaybook';

interface DatasetSnapshot {
  id: string;
  fileName: string;
  headers: string[];
  rows: Record<string, string>[];
  issues: Issue[];
  memoryTrail: Array<{ agent: string; note: string }>;
  reportMarkdown: string;
  analysisStatus: string;
  isReferenceDataset: boolean;
}

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'agents' | 'tutorial'>('dashboard');
  const [agentPlaybook, setAgentPlaybook] = useState<AgentPersonaSet>(() => {
    const stored = window.localStorage.getItem('audit-rescue-desk-agent-playbook');
    if (!stored) {
      return defaultAgentPersonas;
    }

    try {
      return JSON.parse(stored) as AgentPersonaSet;
    } catch {
      return defaultAgentPersonas;
    }
  });
  const [workspaceArtifacts, setWorkspaceArtifacts] = useState<WorkspaceArtifact[]>(() => getWorkspaceArtifacts());
  const [datasets, setDatasets] = useState<DatasetSnapshot[]>([]);
  const [activeDatasetId, setActiveDatasetId] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [memoryTrail, setMemoryTrail] = useState<Array<{ agent: string; note: string }>>([]);
  const [cogneeStatus, setCogneeStatus] = useState<CogneeStatus | null>(null);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [analysisStatus, setAnalysisStatus] = useState<string>('Upload a manufacturing CSV to begin the review.');

  useEffect(() => {
    getCogneeStatus()
      .then(setCogneeStatus)
      .catch((error) =>
        setCogneeStatus({
          configured: false,
          connected: false,
          datasetName: 'audit-rescue-desk-track01',
          baseUrl: 'https://api.cognee.ai',
          message: error instanceof Error ? error.message : 'Cognee proxy is not running.'
        })
      );
  }, []);

  const rememberSharedMemory = (agent: string, payload: unknown) => {
    rememberAgentOutput(agent, payload);
    const summary = typeof payload === 'object' && payload && 'summary' in payload ? String((payload as { summary: unknown }).summary) : JSON.stringify(payload);
    rememberCogneeEntry(agent, summary, payload).catch((error) => {
      rememberAgentOutput('Cognee Cloud Proxy', {
        summary: `Cloud memory write failed for ${agent}: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    });
  };

  const updateAgentPlaybook = (next: AgentPersonaSet) => {
    setAgentPlaybook(next);
    window.localStorage.setItem('audit-rescue-desk-agent-playbook', JSON.stringify(next));
    rememberWorkspaceArtifact({
      type: 'agent_playbook',
      title: 'Agent playbook updated',
      summary: 'User-defined Markdown playbook stored for future analysis runs.',
      payload: serializeAgentPlaybook(next)
    });
    setWorkspaceArtifacts(getWorkspaceArtifacts());
  };

  const handleUploadPlaybook = (markdown: string) => {
    updateAgentPlaybook(parseAgentPlaybookMarkdown(markdown));
    setAnalysisStatus('Agent playbook updated. Run or reload a dataset to apply the new roles to reasoning.');
  };

  const handleResetPlaybook = () => {
    updateAgentPlaybook(defaultAgentPersonas);
    setAnalysisStatus('Agent playbook reset to the default audit specialists.');
  };

  const isCustomerReferenceDataset = (parsedHeaders: string[]) => {
    const normalized = parsedHeaders.map((header) => header.toLowerCase());
    return (
      normalized.includes('customer_id') &&
      normalized.includes('company_name') &&
      normalized.includes('region') &&
      !normalized.includes('record_id')
    );
  };

  const applyDatasetSnapshot = (snapshot: DatasetSnapshot) => {
    setActiveDatasetId(snapshot.id);
    setFileName(snapshot.fileName);
    setHeaders(snapshot.headers);
    setRows(snapshot.rows);
    setIssues(snapshot.issues);
    setMemoryTrail(snapshot.memoryTrail);
    setReportMarkdown(snapshot.reportMarkdown);
    setAnalysisStatus(snapshot.analysisStatus);
  };

  const upsertDatasetSnapshot = (snapshot: DatasetSnapshot) => {
    setDatasets((current) => {
      const withoutSameId = current.filter((dataset) => dataset.id !== snapshot.id);
      return [snapshot, ...withoutSameId].slice(0, 6);
    });
    applyDatasetSnapshot(snapshot);
  };

  const runAgentPipeline = (parsedRows: Record<string, string>[], parsedHeaders: string[], uploadedFileName: string): DatasetSnapshot => {
    clearMemory();
    setAnalysisStatus('Analyzing the manufacturing dataset with Audit Rescue Desk...');

    const isReferenceDataset = isCustomerReferenceDataset(parsedHeaders);
    if (isReferenceDataset) {
      rememberWorkspaceArtifact({
        type: 'raw_dataset',
        title: uploadedFileName,
        summary: `${parsedRows.length} customer reference rows stored as traceability context in the local Cognee workspace.`,
        payload: {
          headers: parsedHeaders,
          previewRows: parsedRows.slice(0, 20),
          rowCount: parsedRows.length
        }
      });

      return {
        id: `${uploadedFileName}-${Date.now()}`,
        fileName: uploadedFileName,
        headers: parsedHeaders,
        rows: parsedRows,
        issues: [],
        memoryTrail: [],
        reportMarkdown: '',
        analysisStatus: 'Customer reference loaded. Use it to understand customer_id traceability, then load the audit dataset to scan exceptions.',
        isReferenceDataset
      };
    }

    rememberWorkspaceArtifact({
      type: 'raw_dataset',
      title: uploadedFileName,
      summary: `${parsedRows.length} rows and ${parsedHeaders.length} columns loaded into the local Cognee workspace.`,
      payload: {
        headers: parsedHeaders,
        previewRows: parsedRows.slice(0, 20),
        rowCount: parsedRows.length
      }
    });

    const findings = inspectData(parsedRows, parsedHeaders, agentPlaybook);
    rememberSharedMemory('Agent 1 Data Inspector', {
      summary: `Found ${findings.length} issue(s) from ${parsedRows.length} rows.`,
      findings
    });

    const ranked = rankIssues(findings, agentPlaybook);
    rememberSharedMemory('Agent 2 Risk Ranker', {
      summary: `Ranked ${ranked.length} issue(s) by audit risk.`,
      rankedIssues: ranked
    });

    const advised = adviseFixes(ranked, agentPlaybook);
    rememberSharedMemory('Agent 3 Fix Advisor', {
      summary: 'Suggested safe actions for each issue. Human approval is required.',
      advisedIssues: advised
    });

    const memoryTrailSnapshot = getMemoryTrail();
    const report = createAuditReport({
      datasetName: uploadedFileName,
      rowCount: parsedRows.length,
      columnCount: parsedHeaders.length,
      issues: advised,
      memoryTrail: memoryTrailSnapshot
    });
    rememberSharedMemory('Agent 4 Audit Narrator', {
      summary: 'Prepared audit-ready Markdown report for export.',
      reportTitle: report.title
    });

    rememberWorkspaceArtifact({
      type: 'analysis_result',
      title: `${uploadedFileName} analysis result`,
      summary: `${advised.length} issue(s) analyzed and prioritized with the active agent playbook.`,
      payload: {
        issues: advised,
        agentPlaybook
      }
    });

    rememberWorkspaceArtifact({
      type: 'audit_report',
      title: report.title,
      summary: 'Downloadable audit report generated from issue evidence, decisions, and memory trail.',
      payload: report.markdown
    });

    const finalMemoryTrail = getMemoryTrail();

    return {
      id: `${uploadedFileName}-${Date.now()}`,
      fileName: uploadedFileName,
      headers: parsedHeaders,
      rows: parsedRows,
      issues: advised,
      memoryTrail: finalMemoryTrail,
      reportMarkdown: report.markdown,
      analysisStatus:
        advised.length > 0
          ? 'Analysis complete. Review detected issues and export the audit report.'
          : 'Analysis complete. No exceptions were generated by the active checks.',
      isReferenceDataset
    };
  };

  const handleParsedDataset = (uploadedFileName: string, parsedHeaders: string[], parsedRows: Record<string, string>[]) => {
    const snapshot = runAgentPipeline(parsedRows, parsedHeaders, uploadedFileName);
    upsertDatasetSnapshot(snapshot);
    setWorkspaceArtifacts(getWorkspaceArtifacts());
  };

  const handleDataUpload = async (file: File) => {
    const parsed = await parseCsvFile(file);
    handleParsedDataset(file.name, parsed.headers, parsed.rows);
  };

  const loadPublicDataset = async (url: string, loadedFileName: string) => {
    setAnalysisStatus(`Loading ${loadedFileName}...`);
    const response = await fetch(url);
    const csvText = await response.text();
    const parsed = await parseCsvText(csvText);
    handleParsedDataset(loadedFileName, parsed.headers, parsed.rows);
  };

  const handleSelectDataset = (datasetId: string) => {
    const dataset = datasets.find((candidate) => candidate.id === datasetId);
    if (dataset) {
      applyDatasetSnapshot(dataset);
    }
  };

  const updateDecision = (issueId: string, decision: Issue['humanDecision']) => {
    const updated = issues.map((issue) =>
      issue.id === issueId ? { ...issue, humanDecision: decision } : issue
    );
    setIssues(updated);
    rememberSharedMemory('Agent 3 Fix Advisor', {
      summary: `Human decision recorded for ${issueId}.`,
      decisionUpdate: { issueId, decision }
    });
    const updatedTrail = getMemoryTrail();
    setMemoryTrail(updatedTrail);

    if (fileName) {
      const report = createAuditReport({
        datasetName: fileName,
        rowCount: rows.length,
        columnCount: headers.length,
        issues: updated,
        memoryTrail: updatedTrail
      });
      setReportMarkdown(report.markdown);
      setDatasets((current) =>
        current.map((dataset) =>
          dataset.id === activeDatasetId
            ? { ...dataset, issues: updated, memoryTrail: updatedTrail, reportMarkdown: report.markdown }
            : dataset
        )
      );
    }
  };

  const updatePriority = (issueId: string, priority: FixPriority) => {
    const updated = issues.map((issue) =>
      issue.id === issueId ? { ...issue, humanPriority: priority } : issue
    );
    setIssues(updated);
    rememberSharedMemory('Agent 2 Risk Ranker', {
      summary: `Human priority override recorded for ${issueId}.`,
      priorityUpdate: { issueId, priority }
    });
    const updatedTrail = getMemoryTrail();
    setMemoryTrail(updatedTrail);

    if (fileName) {
      const report = createAuditReport({
        datasetName: fileName,
        rowCount: rows.length,
        columnCount: headers.length,
        issues: updated,
        memoryTrail: updatedTrail
      });
      setReportMarkdown(report.markdown);
      setDatasets((current) =>
        current.map((dataset) =>
          dataset.id === activeDatasetId
            ? { ...dataset, issues: updated, memoryTrail: updatedTrail, reportMarkdown: report.markdown }
            : dataset
        )
      );
    }
  };

  const handleDownloadReport = () => {
    if (!reportMarkdown) {
      return;
    }
    downloadMarkdownReport(reportMarkdown, 'audit-rescue-desk-report.md');
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'agents' as const, label: 'Design Agents' },
    { id: 'tutorial' as const, label: 'Tutorial' }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <ProductBrief />

        <nav className="rounded-3xl border border-slate-200 bg-white p-2 shadow-panel">
          <div className="grid gap-2 sm:grid-cols-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  activeView === item.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
                type="button"
                onClick={() => setActiveView(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {activeView === 'dashboard' && (
          <div className="space-y-8">
            <UploadData
              fileName={fileName}
              rowCount={rows.length}
              columnCount={headers.length}
              parsedHeaders={headers}
              onUpload={handleDataUpload}
              onLoadAuditDataset={() => loadPublicDataset('/data/kaggle/track01_data_rescue.csv', 'track01_data_rescue.csv')}
              onLoadCustomerReference={() => loadPublicDataset('/data/kaggle/track01_customers.csv', 'track01_customers.csv')}
              datasets={datasets.map((dataset) => ({
                id: dataset.id,
                fileName: dataset.fileName,
                rowCount: dataset.rows.length,
                issueCount: dataset.issues.length,
                isReferenceDataset: dataset.isReferenceDataset
              }))}
              activeDatasetId={activeDatasetId}
              onSelectDataset={handleSelectDataset}
              previewRows={rows.slice(0, 5)}
              statusMessage={analysisStatus}
            />

            <IssueDashboard
              issues={issues}
              hasDataset={rows.length > 0}
              isReferenceDataset={isCustomerReferenceDataset(headers)}
              onPriorityChange={updatePriority}
            />

            <DecisionPassport issues={issues} onDecisionChange={updateDecision} onPriorityChange={updatePriority} />

            <div>
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Audit Evidence</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Memory, report, and operating context</h2>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <AuditReport markdown={reportMarkdown} onDownload={handleDownloadReport} />
                <CogneeMemoryTrail memoryTrail={memoryTrail} cloudStatus={cogneeStatus} />
                <LocalCogneeWorkspace artifacts={workspaceArtifacts} />
                <SubmissionChecklist />
                <div className="xl:col-span-2">
                  <GeodoResearch />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'agents' && (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <AgentOperatingModel
              personas={agentPlaybook}
              onUploadPlaybook={handleUploadPlaybook}
              onResetPlaybook={handleResetPlaybook}
            />
            <LocalCogneeWorkspace artifacts={workspaceArtifacts} />
          </div>
        )}

        {activeView === 'tutorial' && (
          <Tutorial />
        )}
      </div>
    </Layout>
  );
}

export default App;
