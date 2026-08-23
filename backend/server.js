import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { leadRoutes } from "./routes/leadRoutes.js";
import { applicationRoutes } from "./routes/applicationRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { siteRoutes } from "./routes/siteRoutes.js";
import { mcpRoutes } from "./routes/mcpRoutes.js";
import { renderSeoPage } from "./seo.js";
import { renderBackendPortal } from "./portal.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const app = express();
const port = Number(process.env.PORT || 5000);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));
app.use(cors({ origin: [frontendUrl, "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000"], credentials: true }));
app.use(express.json({ limit: "32kb" }));
app.use(morgan("dev"));

// Health & Status
app.get("/api/health", (req, res) => {
  res.json({
    agency: "Get Into Feed Media Pvt. Ltd.",
    status: "ok",
    service: "get-into-feed-backend",
    mcpConnected: true,
    hubs: ["Noida HQ (Delhi-NCR)"], founded: 2026
  });
});

// Agency Backend Command & Developer Portal
app.get(["/portal", "/api/portal"], async (req, res) => {
  const html = await renderBackendPortal(req);
  res.type("html").send(html);
});

// Standard REST & Site Routes
app.use("/api", siteRoutes);
app.use("/api", leadRoutes);
app.use("/api", applicationRoutes);
app.use("/api/admin", adminRoutes);

// Model Context Protocol (MCP) Routes (HTTP & SSE transports)
app.use("/api/mcp", mcpRoutes);
app.use("/mcp", mcpRoutes);

const frontendDist = path.join(__dirname, "..", "frontend", "dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDist));
  app.get("*", async (req, res, next) => {
    try {
      const page = await renderSeoPage(path.join(frontendDist, "index.html"), req.path);
      res.status(page.found ? 200 : 404).type("html").send(page.html);
    } catch (error) {
      next(error);
    }
  });
} else {
  // In development, visiting http://localhost:5000/ shows the branded Get Into Feed Backend Portal
  app.get("/", async (req, res) => {
    const html = await renderBackendPortal(req);
    res.type("html").send(html);
  });
}

app.use((req, res) => {
  res.status(404).json({
    agency: "Get Into Feed Media Pvt. Ltd.",
    message: "Endpoint not found on Get Into Feed backend engine.",
    portal: "/portal",
    docs: "/api/health"
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    agency: "Get Into Feed Media Pvt. Ltd.",
    message: "Something went wrong on Get Into Feed backend. Please try again."
  });
});

export function startServer() {
  return app.listen(port, () => {
    console.log(`Get Into Feed Agency Backend running on http://localhost:${port}`);
    console.log(`- Developer Portal:   http://localhost:${port}/portal`);
    console.log(`- MCP HTTP Endpoint:  http://localhost:${port}/api/mcp`);
    console.log(`- MCP SSE Endpoint:   http://localhost:${port}/api/mcp/sse`);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer();
}
