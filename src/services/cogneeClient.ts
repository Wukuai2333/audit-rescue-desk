export interface CogneeStatus {
  configured: boolean;
  connected: boolean;
  mode?: string;
  datasetName: string;
  baseUrl: string;
  message: string;
  llmConfigured?: boolean;
}

const proxyBaseUrl = import.meta.env.VITE_COGNEE_PROXY_URL ?? 'http://localhost:8787';

export async function getCogneeStatus(): Promise<CogneeStatus> {
  const response = await fetch(`${proxyBaseUrl}/api/cognee/status`);
  if (!response.ok) {
    throw new Error(`Cognee proxy status failed: ${response.status}`);
  }
  return response.json();
}

export async function rememberCogneeEntry(agent: string, note: string, payload: unknown) {
  const response = await fetch(`${proxyBaseUrl}/api/cognee/remember-entry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ agent, note, payload })
  });

  return response.json();
}

export async function searchCogneeMemory(query: string) {
  const response = await fetch(`${proxyBaseUrl}/api/cognee/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, searchType: 'GRAPH_COMPLETION' })
  });

  return response.json();
}

export async function rememberCogneePolicy(payload: {
  policyText: string;
  riskRanking: unknown;
  remediationPlan: unknown;
  permanent?: boolean;
  selfImprovement?: boolean;
}) {
  const response = await fetch(`${proxyBaseUrl}/api/cognee/remember-policy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return response.json();
}

export async function improveCogneeMemory() {
  const response = await fetch(`${proxyBaseUrl}/api/cognee/improve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  return response.json();
}
