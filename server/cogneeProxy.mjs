import http from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadDotEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, '');

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const port = Number(process.env.COGNEE_PROXY_PORT ?? 8787);
const cogneeBaseUrl = process.env.COGNEE_BASE_URL ?? 'https://api.cognee.ai';
const cogneeApiKey = process.env.COGNEE_API_KEY ?? '';
const defaultDataset = process.env.COGNEE_DATASET_NAME ?? 'audit-rescue-desk-track01';

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.COGNEE_ALLOWED_ORIGIN ?? 'http://localhost:5173',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function callCognee(path, payload) {
  if (!cogneeApiKey) {
    return {
      ok: false,
      status: 0,
      data: {
        message: 'COGNEE_API_KEY is not configured. Create a Cognee Cloud trial key and add it to .env.'
      }
    };
  }

  const response = await fetch(`${cogneeBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': cogneeApiKey
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

async function callCogneeHealth() {
  if (!cogneeApiKey) {
    return {
      configured: false,
      connected: false,
      datasetName: defaultDataset,
      baseUrl: cogneeBaseUrl,
      message: 'Missing COGNEE_API_KEY. Generate one in Cognee Cloud API Keys and restart the proxy.'
    };
  }

  const response = await fetch(`${cogneeBaseUrl}/health`, {
    headers: {
      'X-Api-Key': cogneeApiKey
    }
  });

  return {
    configured: true,
    connected: response.ok,
    datasetName: defaultDataset,
    baseUrl: cogneeBaseUrl,
    message: response.ok ? 'Cognee Cloud is reachable.' : `Cognee health check returned ${response.status}.`
  };
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 200, {});
    return;
  }

  try {
    if (request.method === 'GET' && request.url === '/api/cognee/status') {
      sendJson(response, 200, await callCogneeHealth());
      return;
    }

    if (request.method === 'POST' && request.url === '/api/cognee/remember-entry') {
      const body = await readBody(request);
      const result = await callCognee('/api/v1/remember/entry', {
        entry: {
          type: 'trace',
          agent: body.agent,
          note: body.note,
          payload: body.payload,
          created_at: new Date().toISOString()
        },
        dataset_name: body.datasetName ?? defaultDataset,
        session_id: body.sessionId ?? 'audit-rescue-desk-demo'
      });
      sendJson(response, result.ok ? 200 : 502, result);
      return;
    }

    if (request.method === 'POST' && request.url === '/api/cognee/search') {
      const body = await readBody(request);
      const result = await callCognee('/api/v1/search', {
        query: body.query,
        search_type: body.searchType ?? 'GRAPH_COMPLETION'
      });
      sendJson(response, result.ok ? 200 : 502, result);
      return;
    }

    sendJson(response, 404, { message: 'Route not found.' });
  } catch (error) {
    sendJson(response, 500, {
      message: error instanceof Error ? error.message : 'Unknown proxy error.'
    });
  }
});

server.listen(port, () => {
  console.log(`Cognee proxy listening on http://localhost:${port}`);
  console.log(`Cognee base URL: ${cogneeBaseUrl}`);
  console.log(`Dataset: ${defaultDataset}`);
});
