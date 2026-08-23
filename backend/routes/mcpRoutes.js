import { Router } from "express";
import { MCP_TOOLS, MCP_RESOURCES, handleMcpRpc, executeTool, readResource } from "../mcp/mcpEngine.js";

export const mcpRoutes = Router();

// -----------------------------------------------------------------------------
// 1. Health & Discovery Endpoints
// -----------------------------------------------------------------------------
mcpRoutes.get("/health", (req, res) => {
  res.json({
    status: "ok",
    protocol: "mcp",
    version: "2024-11-05",
    server: "get-into-feed-mcp",
    toolsCount: MCP_TOOLS.length,
    resourcesCount: MCP_RESOURCES.length
  });
});

mcpRoutes.get("/tools", (req, res) => {
  res.json({
    protocolVersion: "2024-11-05",
    tools: MCP_TOOLS
  });
});

mcpRoutes.get("/resources", (req, res) => {
  res.json({
    protocolVersion: "2024-11-05",
    resources: MCP_RESOURCES
  });
});

// -----------------------------------------------------------------------------
// 2. Direct JSON-RPC 2.0 MCP Execution Endpoint (HTTP Transport)
// -----------------------------------------------------------------------------
mcpRoutes.post("/", async (req, res) => {
  try {
    const request = req.body;
    if (!request || typeof request !== "object") {
      return res.status(400).json({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32600, message: "Invalid Request payload" }
      });
    }

    const response = await handleMcpRpc(request);
    if (!response) {
      return res.status(204).end();
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id || null,
      error: { code: -32000, message: error.message || "Internal server error" }
    });
  }
});

// -----------------------------------------------------------------------------
// 3. Server-Sent Events (SSE) Transport for MCP
// -----------------------------------------------------------------------------
mcpRoutes.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // Send initial endpoint event
  const sessionId = Math.random().toString(36).substring(2, 15);
  res.write(`event: endpoint\ndata: /api/mcp?sessionId=${sessionId}\n\n`);

  req.on("close", () => {
    res.end();
  });
});

// -----------------------------------------------------------------------------
// 4. RESTful Quick Invocation Helpers
// -----------------------------------------------------------------------------
mcpRoutes.post("/tools/:toolName", async (req, res) => {
  try {
    const { toolName } = req.params;
    const args = req.body || {};
    const result = await executeTool(toolName, args);
    res.json({ status: "success", tool: toolName, result });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});
