import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { agencyContent } from "./agencyContent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentFile = path.join(__dirname, "site-content.json");
const contentTempFile = `${contentFile}.tmp`;

function slugify(value) {
  return String(value || "item")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "item";
}

function withIds(items, prefix, valueKey) {
  return (items || []).map((item, index) => ({
    ...item,
    id: item.id || `${prefix}-${slugify(item[valueKey])}-${index + 1}`
  }));
}

export function normalizeContent(content) {
  return {
    ...content,
    services: withIds(content.services, "service", "title"),
    caseStudies: withIds(content.caseStudies, "work", "brand"),
    testimonials: withIds(content.testimonials, "testimonial", "name"),
    careers: withIds(content.careers, "career", "title"),
    blogPosts: withIds(content.blogPosts, "blog", "title").map((post) => ({
      ...post,
      slug: post.slug || slugify(post.title)
    }))
  };
}

export async function getSiteContent() {
  try {
    return normalizeContent(JSON.parse(await readFile(contentFile, "utf8")));
  } catch (error) {
    if (error.code === "ENOENT") {
      return normalizeContent(structuredClone(agencyContent));
    }
    throw error;
  }
}

export async function saveSiteContent(content) {
  const normalized = normalizeContent(content);
  await mkdir(path.dirname(contentFile), { recursive: true });
  await writeFile(contentTempFile, JSON.stringify(normalized, null, 2));
  await rename(contentTempFile, contentFile);
  return normalized;
}

export function createId(collection, label) {
  return `${collection}-${slugify(label)}-${Date.now().toString(36)}`;
}
