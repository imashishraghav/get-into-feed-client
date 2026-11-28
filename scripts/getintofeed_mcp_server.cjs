#!/usr/bin/env node

/**
 * Get Into Feed - Model Context Protocol (MCP) Stdio Server
 * Bridges local MCP clients (Antigravity, Cursor, Claude Desktop) to
 * the production Laravel backend MCP endpoint at https://getintofeed.com/api/mcp.
 */

const readline = require('readline');
const https = require('https');

const MCP_ENDPOINT = process.env.GETINTOFEED_MCP_ENDPOINT || 'https://getintofeed.com/api/mcp';
const MCP_KEY = (process.env.GETINTOFEED_MCP_KEY || '').trim();

function sendRpc(request) {
  if (!MCP_KEY) {
    return Promise.resolve({
      jsonrpc: '2.0',
      id: request.id ?? null,
      error: { code: -32001, message: 'GETINTOFEED_MCP_KEY environment variable is required.' }
    });
  }
  return new Promise((resolve) => {
    const payload = JSON.stringify(request);
    const url = new URL(MCP_ENDPOINT);

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'GetIntoFeed-MCP-Bridge/1.0.0',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MCP_KEY}`
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 204) {
          resolve(null);
          return;
        }
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve({
            jsonrpc: '2.0',
            id: request.id ?? null,
            error: { code: -32000, message: `Invalid response from backend: ${data.slice(0, 150)}` }
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        jsonrpc: '2.0',
        id: request.id ?? null,
        error: { code: -32000, message: `Failed to connect to backend MCP: ${err.message}` }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        jsonrpc: '2.0',
        id: request.id ?? null,
        error: { code: -32000, message: 'Backend MCP request timed out (15s)' }
      });
    });

    req.write(payload);
    req.end();
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const request = JSON.parse(trimmed);
    const response = await sendRpc(request);
    if (response) {
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  } catch (err) {
    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: `Parse error: ${err.message}` }
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

process.on('SIGINT', () => {
  process.exit(0);
});
