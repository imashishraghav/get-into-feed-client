#!/usr/bin/env node

/**
 * Get Into Feed - Model Context Protocol (MCP) Stdio Server
 * Connects AI models and agents directly to Get Into Feed's growth marketing backend.
 */

import readline from "node:readline";
import { handleMcpRpc } from "./mcp/mcpEngine.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const request = JSON.parse(trimmed);
    const response = await handleMcpRpc(request);
    if (response) {
      process.stdout.write(JSON.stringify(response) + "\n");
    }
  } catch (err) {
    const errorResponse = {
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32700,
        message: `Parse error: ${err.message}`
      }
    };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});

process.on("SIGINT", () => {
  process.exit(0);
});
