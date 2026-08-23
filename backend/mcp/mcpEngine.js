import crypto from "node:crypto";
import { getSiteContent, saveSiteContent, createId } from "../data/contentStore.js";
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const leadFile = path.join(__dirname, "..", "data", "leads.json");
const leadTempFile = `${leadFile}.tmp`;

// Industry benchmarks database for ROI estimation
const INDUSTRY_BENCHMARKS = {
  "d2c": { name: "D2C & E-Commerce", avgCpc: 18, convRate: 3.2, roasMultiplier: 4.8, avgTicketSize: 1850 },
  "b2b": { name: "B2B SaaS & Enterprise IT", avgCpc: 65, convRate: 4.5, roasMultiplier: 5.4, avgTicketSize: 45000 },
  "realestate": { name: "Luxury Real Estate & High-Ticket", avgCpc: 42, convRate: 3.8, roasMultiplier: 6.2, avgTicketSize: 150000 },
  "edtech": { name: "EdTech & Career Certifications", avgCpc: 24, convRate: 5.1, roasMultiplier: 4.2, avgTicketSize: 28000 },
  "healthcare": { name: "Clinics & Healthcare Networks", avgCpc: 28, convRate: 4.8, roasMultiplier: 5.0, avgTicketSize: 12000 },
  "services": { name: "Professional Services & Agencies", avgCpc: 35, convRate: 4.0, roasMultiplier: 4.6, avgTicketSize: 35000 }
};

async function readLeads() {
  try {
    const raw = await readFile(leadFile, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveLeads(leads) {
  await mkdir(path.dirname(leadFile), { recursive: true });
  await writeFile(leadTempFile, JSON.stringify(leads, null, 2));
  await rename(leadTempFile, leadFile);
}

// -----------------------------------------------------------------------------
// MCP Tools Schema Declarations
// -----------------------------------------------------------------------------
export const MCP_TOOLS = [
  {
    name: "get_agency_services",
    description: "Retrieve all active digital growth services, deliverables, and capabilities provided by Get Into Feed agency (Performance Ads, Technical SEO, React Web, UGC Video, Retention, Analytics).",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Optional filter by service name or keyword (e.g. 'ads', 'seo', 'web', 'creative')"
        }
      }
    }
  },
  {
    name: "get_case_studies",
    description: "Get verified performance outcomes and case studies from Get Into Feed (e.g. Veloura Organics 4.8x ROAS, SkillCraft Academy +312% leads, Zentura Cloud $1.4M pipeline).",
    inputSchema: {
      type: "object",
      properties: {
        industry: {
          type: "string",
          description: "Optional filter by industry: 'd2c', 'b2b', 'edtech', 'realestate', or 'all'"
        }
      }
    }
  },
  {
    name: "calculate_growth_roi",
    description: "Calculate expected high-intent traffic, qualified leads, ROAS multiplier, and projected revenue growth for an Indian or global brand based on monthly ad budget and industry.",
    inputSchema: {
      type: "object",
      properties: {
        monthlyBudgetInr: {
          type: "number",
          description: "Monthly digital marketing ad spend in INR (e.g. 50000, 150000, 500000)"
        },
        industry: {
          type: "string",
          enum: ["d2c", "b2b", "realestate", "edtech", "healthcare", "services"],
          description: "Target commercial industry sector"
        }
      },
      required: ["monthlyBudgetInr", "industry"]
    }
  },
  {
    name: "create_growth_lead",
    description: "Submit a new inbound qualified client lead, growth consultation request, or project inquiry to Get Into Feed.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Lead / Founder full name" },
        email: { type: "string", description: "Work email address" },
        phone: { type: "string", description: "WhatsApp or phone number" },
        company: { type: "string", description: "Company or Brand name" },
        service: { type: "string", description: "Desired service (e.g. 'Performance Ads', 'Full-Funnel Sprint')" },
        budget: { type: "string", description: "Monthly budget range (e.g. 'Rs 50k - Rs 1L/month')" },
        message: { type: "string", description: "Growth target details or bottlenecks" }
      },
      required: ["name", "email", "service", "budget", "message"]
    }
  },
  {
    name: "request_360_growth_audit",
    description: "Generate and submit a 360° Digital Growth Diagnostic Audit for a business website or domain.",
    inputSchema: {
      type: "object",
      properties: {
        company: { type: "string", description: "Brand or company name" },
        website: { type: "string", description: "Website domain or URL (e.g. 'https://brand.com')" },
        growthBlockers: {
          type: "array",
          items: { type: "string" },
          description: "List of bottlenecks (e.g. ['Low ROAS', 'Stagnant SEO', 'Low Web Conversion'])"
        },
        name: { type: "string", description: "Contact person name" },
        email: { type: "string", description: "Contact email" },
        phone: { type: "string", description: "WhatsApp contact number" },
        budget: { type: "string", description: "Current monthly spend range" }
      },
      required: ["company", "name", "email", "phone"]
    }
  },
  {
    name: "get_lead_submissions",
    description: "Retrieve all received website leads, audit requests, and inquiries (admin tool).",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Maximum number of recent leads to return (default: 20)" }
      }
    }
  },
  {
    name: "get_blog_posts",
    description: "Retrieve published growth marketing playbooks and insight articles from Get Into Feed.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Optional category filter (e.g. 'SEO', 'Performance Ads', 'Conversion')" }
      }
    }
  }
];

// -----------------------------------------------------------------------------
// MCP Resources Declarations
// -----------------------------------------------------------------------------
export const MCP_RESOURCES = [
  {
    uri: "mcp://getintofeed/overview",
    name: "Agency Overview & Credentials",
    description: "Overview of Get Into Feed agency, core team metrics, certifications (Google Premier Partner, Meta Partner), and stats.",
    mimeType: "application/json"
  },
  {
    uri: "mcp://getintofeed/pricing",
    name: "Growth Sprint Pricing & Packages",
    description: "Transparent sprint tiers (Starter at ₹39k/mo, Scale Engine at ₹79k/mo, Enterprise at ₹1.49L/mo) with full deliverable lists.",
    mimeType: "application/json"
  },
  {
    uri: "mcp://getintofeed/benchmarks",
    name: "Indian Digital Marketing Industry Benchmarks",
    description: "Standard CPC, conversion rates, and ROAS benchmarks across D2C, B2B SaaS, Real Estate, and EdTech sectors in India.",
    mimeType: "application/json"
  }
];

// -----------------------------------------------------------------------------
// Tool Execution Handler
// -----------------------------------------------------------------------------
export async function executeTool(name, args = {}) {
  const content = await getSiteContent();

  switch (name) {
    case "get_agency_services": {
      let services = content.services || [];
      if (args.category) {
        const query = String(args.category).toLowerCase();
        services = services.filter((s) => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
      }
      return {
        count: services.length,
        services: services.map((s) => ({
          title: s.title,
          description: s.description,
          deliverables: s.points
        }))
      };
    }

    case "get_case_studies": {
      let cases = content.caseStudies || [];
      if (args.industry && args.industry !== "all") {
        const ind = String(args.industry).toLowerCase();
        cases = cases.filter((c) => c.brand.toLowerCase().includes(ind) || (c.channel && c.channel.toLowerCase().includes(ind)));
      }
      return {
        count: cases.length,
        caseStudies: cases
      };
    }

    case "calculate_growth_roi": {
      const budget = Number(args.monthlyBudgetInr) || 100000;
      const indKey = (args.industry || "d2c").toLowerCase();
      const bench = INDUSTRY_BENCHMARKS[indKey] || INDUSTRY_BENCHMARKS["d2c"];

      const estimatedClicks = Math.round(budget / bench.avgCpc);
      const estimatedLeads = Math.round(estimatedClicks * (bench.convRate / 100));
      const projectedRevenue = Math.round(budget * bench.roasMultiplier);

      return {
        input: {
          monthlyBudgetInr: budget,
          industry: bench.name
        },
        benchmarks: {
          avgCpcInr: bench.avgCpc,
          conversionRatePercent: bench.convRate,
          roasMultiplier: `${bench.roasMultiplier}x`
        },
        forecast90Days: {
          estimatedHighIntentVisits: estimatedClicks,
          estimatedQualifiedConversions: estimatedLeads,
          projectedGrossRevenueInr: projectedRevenue,
          projectedRoas: `${bench.roasMultiplier}x`,
          recommendedTier: budget >= 300000 ? "Enterprise Domination" : budget >= 75000 ? "Scale Engine" : "Starter Sprint"
        }
      };
    }

    case "create_growth_lead": {
      const lead = {
        id: crypto.randomUUID(),
        name: String(args.name || "").trim(),
        email: String(args.email || "").trim().toLowerCase(),
        phone: String(args.phone || "").trim(),
        company: String(args.company || "Direct Inquiry").trim(),
        service: String(args.service || "Growth Sprint").trim(),
        budget: String(args.budget || "Rs 50k - Rs 1L/month").trim(),
        message: String(args.message || "").trim(),
        source: "mcp-agent",
        createdAt: new Date().toISOString()
      };

      const leads = await readLeads();
      leads.unshift(lead);
      await saveLeads(leads);

      return {
        status: "success",
        message: "Lead recorded in Get Into Feed growth engine.",
        leadId: lead.id,
        summary: `Lead created for ${lead.name} (${lead.company}) - Target: ${lead.service}`
      };
    }

    case "request_360_growth_audit": {
      const blockers = Array.isArray(args.growthBlockers) ? args.growthBlockers.join(", ") : args.growthBlockers || "General 360 Diagnostic";
      const fullNote = `[MCP 360° Audit Request]\nWebsite: ${args.website || "N/A"}\nGrowth Blockers: ${blockers}\nBudget: ${args.budget || "Not Specified"}`;

      const lead = {
        id: crypto.randomUUID(),
        name: String(args.name).trim(),
        email: String(args.email).trim().toLowerCase(),
        phone: String(args.phone || "").trim(),
        company: String(args.company).trim(),
        service: "360° Growth Audit",
        budget: String(args.budget || "Rs 50k - Rs 1L/month").trim(),
        message: fullNote,
        source: "mcp-audit-tool",
        createdAt: new Date().toISOString()
      };

      const leads = await readLeads();
      leads.unshift(lead);
      await saveLeads(leads);

      return {
        status: "success",
        message: `360° Growth Audit requested for ${args.company} (${args.website || "N/A"}).`,
        auditId: lead.id,
        nextSteps: "Our senior growth team will generate your custom 12-page teardown and delivery email within 24 hours."
      };
    }

    case "get_lead_submissions": {
      const limit = Number(args.limit) || 20;
      const leads = await readLeads();
      return {
        total: leads.length,
        recentLeads: leads.slice(0, limit)
      };
    }

    case "get_blog_posts": {
      let posts = content.blogPosts || [];
      if (args.category) {
        const cat = String(args.category).toLowerCase();
        posts = posts.filter((p) => (p.category || "").toLowerCase().includes(cat));
      }
      return {
        count: posts.length,
        posts: posts.map((p) => ({
          title: p.title,
          slug: p.slug,
          category: p.category,
          readTime: p.readTime,
          publishedAt: p.publishedAt,
          excerpt: p.excerpt
        }))
      };
    }

    default:
      throw new Error(`Unknown MCP Tool: '${name}'`);
  }
}

// -----------------------------------------------------------------------------
// Resource Retrieval Handler
// -----------------------------------------------------------------------------
export async function readResource(uri) {
  const content = await getSiteContent();

  switch (uri) {
    case "mcp://getintofeed/overview":
      return {
        agency: "Get Into Feed Media Pvt. Ltd.",
        tagline: "India's #1 Digital Marketing & Growth Engineering Studio",
        website: "https://getintofeed.com",
        certifications: [
          "Google Premier Partner 2026",
          "Meta Certified Media Agency",
          "Clutch Top Agency 4.9/5",
          "LinkedIn Marketing Solutions Partner"
        ],
        stats: content.stats || [],
        hubs: ["Bengaluru", "Mumbai", "Delhi-NCR", "Remote Worldwide"]
      };

    case "mcp://getintofeed/pricing":
      return {
        sprintTiers: content.pricing || [],
        guarantee: "45-Day Milestone Commitment: If strategic KPIs are not hit in Sprint 1, we work free until achieved."
      };

    case "mcp://getintofeed/benchmarks":
      return INDUSTRY_BENCHMARKS;

    default:
      throw new Error(`Unknown MCP Resource URI: '${uri}'`);
  }
}

// -----------------------------------------------------------------------------
// JSON-RPC 2.0 Protocol Dispatcher for MCP
// -----------------------------------------------------------------------------
export async function handleMcpRpc(request) {
  const { jsonrpc, id, method, params } = request;

  if (jsonrpc !== "2.0") {
    return { jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid JSON-RPC version. Must be '2.0'." } };
  }

  try {
    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: { listChanged: false },
              resources: { subscribe: false, listChanged: false }
            },
            serverInfo: {
              name: "get-into-feed-mcp",
              version: "1.0.0"
            }
          }
        };

      case "notifications/initialized":
        return null; // Notification, no response required

      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: MCP_TOOLS
          }
        };

      case "tools/call": {
        const { name, arguments: args } = params || {};
        if (!name) {
          return { jsonrpc: "2.0", id, error: { code: -32602, message: "Missing tool name in params" } };
        }
        const output = await executeTool(name, args || {});
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: typeof output === "string" ? output : JSON.stringify(output, null, 2)
              }
            ],
            isError: false
          }
        };
      }

      case "resources/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            resources: MCP_RESOURCES
          }
        };

      case "resources/read": {
        const { uri } = params || {};
        if (!uri) {
          return { jsonrpc: "2.0", id, error: { code: -32602, message: "Missing uri in params" } };
        }
        const resourceData = await readResource(uri);
        return {
          jsonrpc: "2.0",
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: JSON.stringify(resourceData, null, 2)
              }
            ]
          }
        };
      }

      case "ping":
        return { jsonrpc: "2.0", id, result: {} };

      default:
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method '${method}' not found` }
        };
    }
  } catch (err) {
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32000, message: err.message || "Internal server error" }
    };
  }
}
