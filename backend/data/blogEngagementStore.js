import crypto from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const engagementFile = path.join(__dirname, "blog-engagement.json");
const engagementTempFile = `${engagementFile}.tmp`;

function clean(value, max = 1200) {
  return String(value || "").trim().slice(0, max);
}

async function readEngagement() {
  try {
    return JSON.parse(await readFile(engagementFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

async function saveEngagement(engagement) {
  await mkdir(path.dirname(engagementFile), { recursive: true });
  await writeFile(engagementTempFile, JSON.stringify(engagement, null, 2));
  await rename(engagementTempFile, engagementFile);
}

function emptyEntry() {
  return { likes: 0, comments: [] };
}

export async function getAllEngagement() {
  return readEngagement();
}

export async function getEngagement(slug) {
  const engagement = await readEngagement();
  return engagement[slug] || emptyEntry();
}

export async function addLike(slug) {
  const engagement = await readEngagement();
  const entry = engagement[slug] || emptyEntry();
  entry.likes += 1;
  engagement[slug] = entry;
  await saveEngagement(engagement);
  return entry;
}

export async function addComment(slug, payload) {
  const name = clean(payload.name, 90);
  const message = clean(payload.message);
  if (!name || !message) return null;
  const engagement = await readEngagement();
  const entry = engagement[slug] || emptyEntry();
  const comment = { id: crypto.randomUUID(), name, message, createdAt: new Date().toISOString() };
  entry.comments.unshift(comment);
  engagement[slug] = entry;
  await saveEngagement(engagement);
  return { entry, comment };
}
