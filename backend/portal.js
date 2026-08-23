import { MCP_TOOLS, MCP_RESOURCES } from "./mcp/mcpEngine.js";
import { getSiteContent } from "./data/contentStore.js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const leadFile = path.join(__dirname, "data", "leads.json");

export async function renderBackendPortal(req) {
  let content = { services: [], caseStudies: [], blogPosts: [] };
  try {
    content = await getSiteContent();
  } catch {}

  let leadCount = 0;
  try {
    const raw = await readFile(leadFile, "utf8");
    leadCount = JSON.parse(raw).length;
  } catch {}

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Get Into Feed — Agency Backend & API Engine</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --ink: #123b35;
      --deep: #092a26;
      --sage: #d9eddc;
      --paper: #fbfaf5;
      --cream: #f0efe6;
      --coral: #f15f46;
      --coral-dark: #ce4934;
      --yellow: #f7c94c;
      --muted: #62736e;
      --line: rgba(18, 59, 53, 0.16);
      --white: #fffefa;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--paper);
      color: var(--ink);
      font-family: "Manrope", sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: var(--white);
      border-bottom: 1px solid var(--line);
      padding: 16px clamp(20px, 5vw, 60px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--ink);
    }
    .brand b {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      background: var(--coral);
      color: var(--white);
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 800;
    }
    .brand strong { font-size: 1.05rem; display: block; }
    .brand small {
      color: var(--muted);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      display: block;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 99px;
      background: var(--sage);
      color: var(--ink);
      font-family: "DM Mono", monospace;
      font-size: 0.76rem;
      font-weight: 600;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
    }
    main {
      flex: 1;
      max-width: 1180px;
      width: 100%;
      margin: 0 auto;
      padding: clamp(32px, 5vw, 64px) 24px;
    }
    .hero-banner {
      background: var(--ink);
      color: var(--white);
      padding: clamp(36px, 6vw, 56px) clamp(24px, 5vw, 48px);
      border-radius: 12px;
      margin-bottom: 40px;
      position: relative;
      overflow: hidden;
    }
    .hero-banner p.kicker {
      color: var(--yellow);
      font-family: "DM Mono", monospace;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .hero-banner h1 {
      font-family: "Playfair Display", Georgia, serif;
      font-size: clamp(2rem, 4vw, 3.2rem);
      line-height: 1.1;
      margin-bottom: 16px;
    }
    .hero-banner p.desc {
      color: #d9eee1;
      font-size: 1.05rem;
      line-height: 1.65;
      max-width: 680px;
      margin-bottom: 28px;
    }
    .hero-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 20px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      border: 0;
      transition: all 0.2s ease;
    }
    .btn-coral { background: var(--coral); color: var(--white); }
    .btn-coral:hover { background: var(--coral-dark); }
    .btn-outline {
      border: 1px solid rgba(255, 255, 255, 0.4);
      background: rgba(255, 255, 255, 0.08);
      color: var(--white);
    }
    .btn-outline:hover { background: rgba(255, 255, 255, 0.18); }

    .grid-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: var(--white);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 22px 24px;
    }
    .stat-card span {
      display: block;
      color: var(--muted);
      font-family: "DM Mono", monospace;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }
    .stat-card strong {
      font-family: "Playfair Display", serif;
      font-size: 2.2rem;
      color: var(--ink);
    }

    .section-title {
      font-family: "Playfair Display", Georgia, serif;
      font-size: 1.8rem;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .panels-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      margin-bottom: 40px;
    }
    @media (max-width: 840px) {
      .panels-grid { grid-template-columns: 1fr; }
    }
    .card {
      background: var(--white);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 28px;
    }
    .card h3 {
      font-size: 1.25rem;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge-chip {
      padding: 3px 8px;
      background: var(--sage);
      color: var(--ink);
      font-family: "DM Mono", monospace;
      font-size: 0.68rem;
      border-radius: 4px;
    }
    .endpoint-list, .tools-list {
      list-style: none;
      display: grid;
      gap: 10px;
      margin-top: 14px;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 14px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: var(--paper);
      font-family: "DM Mono", monospace;
      font-size: 0.8rem;
    }
    .endpoint-item a {
      color: var(--coral);
      font-weight: 700;
      text-decoration: none;
    }
    .endpoint-item a:hover { text-decoration: underline; }
    .method-tag {
      font-weight: 800;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--ink);
      color: var(--white);
    }
    .method-tag.post { background: var(--coral); }

    footer {
      background: var(--deep);
      color: var(--white);
      padding: 24px clamp(20px, 5vw, 60px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.82rem;
      color: #9cb0aa;
      flex-wrap: wrap;
      gap: 12px;
    }
  </style>
</head>
<body>
  <header>
    <a href="/" class="brand">
      <b>GF</b>
      <div>
        <strong>Get Into Feed</strong>
        <small>Digital Growth Agency Backend Engine</small>
      </div>
    </a>
    <div class="status-badge">
      <span class="pulse-dot"></span>
      <span>API Gateway Active • Port 5000</span>
    </div>
  </header>

  <main>
    <div class="hero-banner">
      <p class="kicker">Agency Core Services & Telemetry</p>
      <h1>Get Into Feed Growth Engine & API</h1>
      <p class="desc">
        The centralized full-stack backend powering Get Into Feed’s website, lead intake funnels, marketing playbooks, and Model Context Protocol (MCP) integrations for AI agents.
      </p>
      <div class="hero-links">
        <a href="http://localhost:5173" target="_blank" class="btn btn-coral">Open Frontend Website ↗</a>
        <a href="http://localhost:5173/admin" target="_blank" class="btn btn-outline">Admin Command Center ↗</a>
        <a href="/api/health" class="btn btn-outline">Health Telemetry</a>
      </div>
    </div>

    <div class="grid-stats">
      <div class="stat-card">
        <span>Active Services</span>
        <strong>${content.services?.length || 6}</strong>
      </div>
      <div class="stat-card">
        <span>Case Studies</span>
        <strong>${content.caseStudies?.length || 4}</strong>
      </div>
      <div class="stat-card">
        <span>Total Leads Ingested</span>
        <strong>${leadCount}</strong>
      </div>
      <div class="stat-card">
        <span>MCP Tools Active</span>
        <strong>${MCP_TOOLS.length}</strong>
      </div>
    </div>

    <div class="panels-grid">
      <!-- REST API ENDPOINTS -->
      <div class="card">
        <h3>
          <span>REST API Catalog</span>
          <span class="badge-chip">JSON</span>
        </h3>
        <p style="color: var(--muted); font-size: 0.88rem; line-height: 1.5; margin-bottom: 12px;">
          Primary RESTful endpoints for agency data, client lead submission, and recruitment.
        </p>
        <ul class="endpoint-list">
          <li class="endpoint-item">
            <span><b class="method-tag">GET</b> /api/site</span>
            <a href="/api/site" target="_blank">Inspect ↗</a>
          </li>
          <li class="endpoint-item">
            <span><b class="method-tag post">POST</b> /api/leads</span>
            <span style="color: var(--muted); font-size: 0.72rem;">Lead Funnel Intake</span>
          </li>
          <li class="endpoint-item">
            <span><b class="method-tag">GET</b> /api/careers</span>
            <a href="/api/careers" target="_blank">Inspect ↗</a>
          </li>
          <li class="endpoint-item">
            <span><b class="method-tag post">POST</b> /api/applications</span>
            <span style="color: var(--muted); font-size: 0.72rem;">Job Applications</span>
          </li>
          <li class="endpoint-item">
            <span><b class="method-tag">GET</b> /api/admin/overview</span>
            <span style="color: var(--muted); font-size: 0.72rem;">Admin Auth Required</span>
          </li>
        </ul>
      </div>

      <!-- MCP ENGINE STATUS -->
      <div class="card">
        <h3>
          <span>Model Context Protocol (MCP)</span>
          <span class="badge-chip" style="background: #e0f2fe; color: #0369a1;">AI Agent Ready</span>
        </h3>
        <p style="color: var(--muted); font-size: 0.88rem; line-height: 1.5; margin-bottom: 12px;">
          Exposes Get Into Feed agency capabilities, ROI calculators, and lead capture directly to Antigravity, Claude, and Cursor.
        </p>
        <ul class="endpoint-list">
          <li class="endpoint-item">
            <span><b class="method-tag">GET</b> /api/mcp/health</span>
            <a href="/api/mcp/health" target="_blank">Status ↗</a>
          </li>
          <li class="endpoint-item">
            <span><b class="method-tag">GET</b> /api/mcp/tools</span>
            <a href="/api/mcp/tools" target="_blank">${MCP_TOOLS.length} Tools Catalog ↗</a>
          </li>
          <li class="endpoint-item">
            <span><b class="method-tag">GET</b> /api/mcp/resources</span>
            <a href="/api/mcp/resources" target="_blank">${MCP_RESOURCES.length} Resources ↗</a>
          </li>
          <li class="endpoint-item">
            <span><b class="method-tag post">POST</b> /api/mcp</span>
            <span style="color: var(--muted); font-size: 0.72rem;">JSON-RPC 2.0 Endpoint</span>
          </li>
          <li class="endpoint-item">
            <span><b class="method-tag">GET</b> /api/mcp/sse</span>
            <span style="color: var(--muted); font-size: 0.72rem;">Server-Sent Events Stream</span>
          </li>
        </ul>
      </div>
    </div>
  </main>

  <footer>
    <span>© ${new Date().getFullYear()} Get Into Feed Media Pvt. Ltd. • All Rights Reserved.</span>
    <span>Bengaluru • Mumbai • Delhi-NCR • Remote</span>
  </footer>
</body>
</html>`;
}
