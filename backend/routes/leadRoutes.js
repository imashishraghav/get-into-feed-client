import { Router } from "express";
import crypto from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const leadFile = path.join(__dirname, "..", "data", "leads.json");
const leadTempFile = `${leadFile}.tmp`;

export const leadRoutes = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requiredFields = ["name", "email", "service"];

function clean(value) {
  return String(value || "").trim().slice(0, 2000);
}

async function readLeads() {
  try {
    const raw = await readFile(leadFile, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function saveLeads(leads) {
  await mkdir(path.dirname(leadFile), { recursive: true });
  await writeFile(leadTempFile, JSON.stringify(leads, null, 2));
  await rename(leadTempFile, leadFile);
}

leadRoutes.get("/leads", async (req, res, next) => {
  try {
    const leads = await readLeads();
    res.json({ leads, total: leads.length });
  } catch (error) {
    next(error);
  }
});

leadRoutes.post("/leads", async (req, res, next) => {
  try {
    const payload = {
      name: clean(req.body.name),
      email: clean(req.body.email).toLowerCase(),
      phone: clean(req.body.phone),
      company: clean(req.body.company || "Direct Inquiry"),
      service: clean(req.body.service || "Search Engine Optimization"),
      budget: clean(req.body.budget || "Enterprise ROI Package"),
      message: clean(req.body.message),
      whatsapp: Boolean(req.body.whatsapp !== false),
      agreeTerms: Boolean(req.body.agreeTerms !== false),
      recaptchaToken: clean(req.body.recaptchaToken)
    };

    const missing = requiredFields.filter((field) => !payload[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please complete the required fields: ${missing.join(", ")}`
      });
    }

    if (!emailPattern.test(payload.email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid business email address."
      });
    }

    const lead = {
      id: crypto.randomUUID(),
      ...payload,
      source: req.body.source || "homepage_contact_audit",
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
      createdAt: new Date().toISOString()
    };

    const leads = await readLeads();
    leads.unshift(lead);
    await saveLeads(leads);

    res.status(201).json({
      success: true,
      message: "Your inquiry has been successfully received. A senior digital strategist will contact you within 24 hours.",
      leadId: lead.id,
      lead: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        service: lead.service,
        createdAt: lead.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});
