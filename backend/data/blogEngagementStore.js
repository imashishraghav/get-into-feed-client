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

const DEFAULT_ENGAGEMENT = {
  "why-creative-fatigue-kills-meta-ads": {
    reactions: { love: 24, fire: 42, clap: 19, insightful: 31 },
    comments: [
      {
        id: "cmt-seed-1",
        articleSlug: "why-creative-fatigue-kills-meta-ads",
        name: "Siddharth Rao",
        email: "siddharth@growthlabs.io",
        message: "The breakdown of frame 1 visual interrupts changed how we film our reels. Immediate 3x retention bump.",
        status: "approved",
        createdAt: "2026-03-03T09:30:00.000Z"
      },
      {
        id: "cmt-seed-2",
        articleSlug: "why-creative-fatigue-kills-meta-ads",
        name: "Pooja Hegde",
        email: "pooja@d2cbrands.in",
        message: "Finally an agency talking about the economic reality of CAC instead of just pretty aesthetics.",
        status: "approved",
        createdAt: "2026-03-04T14:15:00.000Z"
      }
    ]
  },
  "the-complete-guide-to-brand-identity": {
    reactions: { love: 38, fire: 19, clap: 27, insightful: 44 },
    comments: [
      {
        id: "cmt-seed-3",
        articleSlug: "the-complete-guide-to-brand-identity",
        name: "Arjun Mehta",
        email: "arjun@finscale.tech",
        message: "The differentiation framework between visual skin vs economic moat was an eye opener for our board.",
        status: "approved",
        createdAt: "2026-03-02T11:00:00.000Z"
      }
    ]
  },
  "ai-search-optimization-geov-overviews": {
    reactions: { love: 41, fire: 63, clap: 35, insightful: 78 },
    comments: [
      {
        id: "cmt-seed-4",
        articleSlug: "ai-search-optimization-geov-overviews",
        name: "Vikram Malhotra",
        email: "vikram@alpharetail.com",
        message: "Semantic schema injection literally got us cited in Perplexity and Google SGE within 3 weeks.",
        status: "approved",
        createdAt: "2026-03-05T08:20:00.000Z"
      }
    ]
  }
};

async function readEngagement() {
  try {
    const data = JSON.parse(await readFile(engagementFile, "utf8"));
    return { ...DEFAULT_ENGAGEMENT, ...data };
  } catch (error) {
    if (error.code === "ENOENT") {
      await saveEngagement(DEFAULT_ENGAGEMENT);
      return DEFAULT_ENGAGEMENT;
    }
    return DEFAULT_ENGAGEMENT;
  }
}

async function saveEngagement(engagement) {
  await mkdir(path.dirname(engagementFile), { recursive: true });
  await writeFile(engagementTempFile, JSON.stringify(engagement, null, 2));
  await rename(engagementTempFile, engagementFile);
}

function emptyEntry(slug = "") {
  return {
    reactions: { love: 5, fire: 8, clap: 4, insightful: 6 },
    comments: []
  };
}

export async function getAllEngagement() {
  return readEngagement();
}

export async function getEngagement(slug) {
  const engagement = await readEngagement();
  const entry = engagement[slug] || emptyEntry(slug);
  return {
    ...entry,
    comments: (entry.comments || []).filter((c) => c.status === "approved")
  };
}

export async function addReaction(slug, type) {
  const engagement = await readEngagement();
  const entry = engagement[slug] || emptyEntry(slug);
  if (!entry.reactions) {
    entry.reactions = { love: 0, fire: 0, clap: 0, insightful: 0 };
  }
  const validTypes = ["love", "fire", "clap", "insightful"];
  const reactionKey = validTypes.includes(type) ? type : "fire";
  entry.reactions[reactionKey] = (entry.reactions[reactionKey] || 0) + 1;
  engagement[slug] = entry;
  await saveEngagement(engagement);
  return entry.reactions;
}

export async function addComment(slug, payload) {
  const name = clean(payload.name || payload.author_name, 90);
  const email = clean(payload.email || payload.author_email, 120);
  const message = clean(payload.message || payload.comment || payload.comment_text);
  const website = clean(payload.website, 200);

  if (!name || !message) return null;

  const engagement = await readEngagement();
  const entry = engagement[slug] || emptyEntry(slug);
  if (!entry.comments) entry.comments = [];

  const comment = {
    id: `cmt-${crypto.randomUUID().slice(0, 8)}`,
    articleSlug: slug,
    name,
    email,
    website,
    message,
    status: "pending", // ALWAYS SUBMITTED AS PENDING FOR EDITORIAL MODERATION
    createdAt: new Date().toISOString()
  };

  entry.comments.unshift(comment);
  engagement[slug] = entry;
  await saveEngagement(engagement);
  return { entry, comment };
}

export async function getAllCommentsAdmin() {
  const engagement = await readEngagement();
  const allComments = [];
  for (const [slug, data] of Object.entries(engagement)) {
    if (Array.isArray(data.comments)) {
      for (const c of data.comments) {
        allComments.push({
          ...c,
          articleSlug: c.articleSlug || slug
        });
      }
    }
  }
  return allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateCommentStatus(commentId, newStatus) {
  const engagement = await readEngagement();
  let found = null;
  for (const slug of Object.keys(engagement)) {
    const list = engagement[slug].comments || [];
    const idx = list.findIndex((c) => c.id === commentId);
    if (idx !== -1) {
      list[idx].status = newStatus;
      found = list[idx];
      break;
    }
  }
  if (found) {
    await saveEngagement(engagement);
  }
  return found;
}

export async function deleteComment(commentId) {
  const engagement = await readEngagement();
  let removed = false;
  for (const slug of Object.keys(engagement)) {
    const list = engagement[slug].comments || [];
    const before = list.length;
    engagement[slug].comments = list.filter((c) => c.id !== commentId);
    if (engagement[slug].comments.length < before) {
      removed = true;
      break;
    }
  }
  if (removed) {
    await saveEngagement(engagement);
  }
  return removed;
}
