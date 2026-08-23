import { Router } from "express";
import crypto from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteContent } from "../data/contentStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const applicationFile = path.join(__dirname, "..", "data", "applications.json");
const applicationTempFile = `${applicationFile}.tmp`;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const applicationRoutes = Router();

function clean(value) {
  return String(value || "").trim().slice(0, 2000);
}

async function readApplications() {
  try {
    return JSON.parse(await readFile(applicationFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveApplications(applications) {
  await mkdir(path.dirname(applicationFile), { recursive: true });
  await writeFile(applicationTempFile, JSON.stringify(applications, null, 2));
  await rename(applicationTempFile, applicationFile);
}

applicationRoutes.get("/careers", async (req, res, next) => {
  try {
    const content = await getSiteContent();
    res.json({ jobs: content.careers || [] });
  } catch (error) {
    next(error);
  }
});

applicationRoutes.get("/applications", async (req, res, next) => {
  try {
    const applications = await readApplications();
    res.json({ applications, total: applications.length });
  } catch (error) {
    next(error);
  }
});

applicationRoutes.post("/applications", async (req, res, next) => {
  try {
    const application = {
      id: crypto.randomUUID(),
      name: clean(req.body.name),
      email: clean(req.body.email).toLowerCase(),
      role: clean(req.body.role),
      portfolio: clean(req.body.portfolio),
      note: clean(req.body.note),
      source: "website",
      createdAt: new Date().toISOString()
    };
    if (!application.name || !application.email || !application.role || !application.note) {
      return res.status(400).json({ message: "Please complete the required fields." });
    }
    if (!emailPattern.test(application.email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }
    const applications = await readApplications();
    applications.unshift(application);
    await saveApplications(applications);
    return res.status(201).json({ message: "Application received successfully.", applicationId: application.id });
  } catch (error) {
    return next(error);
  }
});
