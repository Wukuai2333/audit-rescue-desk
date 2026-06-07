interface MemoryRecord {
  agent: string;
  payload: unknown;
  createdAt: string;
}

export interface WorkspaceArtifact {
  id: string;
  type: 'agent_playbook' | 'raw_dataset' | 'analysis_result' | 'audit_report';
  title: string;
  summary: string;
  payload: unknown;
  createdAt: string;
}

const memory: MemoryRecord[] = [];
const workspaceKey = 'audit-rescue-desk-local-cognee-workspace';

function summarizePayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return String(payload ?? '');
  }

  const maybeSummary = (payload as { summary?: unknown }).summary;
  if (typeof maybeSummary === 'string') {
    return maybeSummary;
  }

  return JSON.stringify(payload);
}

export function rememberAgentOutput(agent: string, payload: unknown) {
  memory.push({
    agent,
    payload,
    createdAt: new Date().toISOString()
  });
}

export function getMemoryTrail() {
  return memory.map((record) => ({
    agent: record.agent,
    note: summarizePayload(record.payload)
  }));
}

export function clearMemory() {
  memory.length = 0;
}

function readWorkspaceArtifacts(): WorkspaceArtifact[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = window.localStorage.getItem(workspaceKey);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as WorkspaceArtifact[];
  } catch {
    return [];
  }
}

function writeWorkspaceArtifacts(artifacts: WorkspaceArtifact[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(workspaceKey, JSON.stringify(artifacts.slice(0, 40)));
}

export function rememberWorkspaceArtifact(artifact: Omit<WorkspaceArtifact, 'id' | 'createdAt'>) {
  const next: WorkspaceArtifact = {
    ...artifact,
    id: `${artifact.type}-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  writeWorkspaceArtifacts([next, ...readWorkspaceArtifacts()]);
  return next;
}

export function getWorkspaceArtifacts() {
  return readWorkspaceArtifacts();
}
