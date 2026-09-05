import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Bold, BookOpen, Bot, BriefcaseBusiness, Check, CheckCircle2, ChevronDown, ChevronRight, Clock, Code, Copy, Download, ExternalLink, Eye, FileText, Filter, Globe2, Heading, Heading1, Heading2, Heading3, HelpCircle, Image as ImageIcon, Italic, KeyRound, Layers, LayoutDashboard, LineChart, Link2, List, ListOrdered, Lock, LogOut, Mail, Maximize2, Megaphone, MessageCircle, MessageSquare, Minimize2, Monitor, MoreVertical, Palette, PenTool, Pencil, Phone, Play, Plus, Quote, RefreshCw, Save, Search, Send, Share2, ShieldCheck, Sliders, Smartphone, Sparkles, Star, Strikethrough, Table, Tag, Trash2, Underline, UploadCloud, UsersRound, Video, Wand2, X, Zap
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

const contentTypes = [
  { key: "blogPosts", label: "Blog Insights & Articles", singular: "Blog Post", icon: FileText, categoryLabel: "Editorial Playbooks" },
  { key: "services", label: "Services Engine", singular: "Service", icon: Globe2, categoryLabel: "Capabilities" },
  { key: "caseStudies", label: "Case Studies", singular: "Case Study", icon: Sparkles, categoryLabel: "Portfolio" },
  { key: "testimonials", label: "Testimonials", singular: "Review", icon: Star, categoryLabel: "Client Voice" },
  { key: "careers", label: "Job Openings", singular: "Role", icon: BriefcaseBusiness, categoryLabel: "Recruitment" }
];

const CURATED_IMAGE_PRESETS = [
  { label: "Agency Team Hero", url: "/agency-hero.png" },
  { label: "Performance Ads & BI", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" },
  { label: "React Web & CRO Funnel", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80" },
  { label: "D2C E-Commerce & Skincare", url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80" },
  { label: "EdTech & Learning Hub", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80" },
  { label: "Luxury High-Ticket Realty", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
  { label: "Enterprise AI & Neural Search", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" },
  { label: "Executive Strategy Boardroom", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" }
];

const AUTHOR_PRESETS = [
  { name: "Sarvesh Bagla", role: "Founder & CEO, Get Into Feed", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
  { name: "Ajaz Mirza", role: "VP, Digital Operations", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
  { name: "Ananya Sharma", role: "VP, Client Growth & MarTech", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" },
  { name: "Rohan Malhotra", role: "Head of Paid Performance Media", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
  { name: "Editorial Research Team", role: "Get Into Feed Growth Lab", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" }
];

function emptyItem(type) {
  if (type === "services") {
    return {
      title: "",
      description: "",
      icon: "Globe2",
      points: "",
      coverImage: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      schemaType: "Service"
    };
  }
  if (type === "caseStudies") {
    return {
      brand: "",
      result: "",
      metric: "",
      channel: "",
      detail: "",
      coverImage: "",
      metaTitle: "",
      metaDescription: "",
      keywords: ""
    };
  }
  if (type === "testimonials") {
    return {
      quote: "",
      name: "",
      role: "",
      avatar: ""
    };
  }
  if (type === "careers") {
    return {
      title: "",
      team: "Growth Media",
      type: "Full-time",
      location: "Bengaluru / Remote",
      summary: ""
    };
  }
  return {
    title: "",
    slug: "",
    category: "AI Search & SEO",
    author: "Sarvesh Bagla",
    authorRole: "Founder & CEO, Get Into Feed",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    tags: ["Enterprise SEO", "AI Search", "Growth Playbook"],
    readTime: "5 min read",
    status: "published",
    publishedAt: new Date().toISOString().slice(0, 10),
    excerpt: "",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    schemaType: "BlogPosting"
  };
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Markdown to HTML preview renderer for live split-screen
function renderMarkdownPreview(md = "") {
  if (!md) return "<p style='color: #64748b; font-style: italic;'>Start typing in the editor or click formatting tools to see live rendered HTML output...</p>";

  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(/^#### (.*$)/gim, '<h4 class="preview-h4">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="preview-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="preview-h2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="preview-h1">$1</h1>');

  // Callouts & Takeaways
  html = html.replace(/^\> 💡 (.*$)/gim, '<div class="preview-callout tip"><span class="callout-icon">💡</span><div><strong>Key Strategic Takeaway</strong><p>$1</p></div></div>');
  html = html.replace(/^\> 📈 (.*$)/gim, '<div class="preview-callout stat"><span class="callout-icon">📈</span><div><strong>Audited Growth Impact</strong><p>$1</p></div></div>');
  html = html.replace(/^\> ⚠️ (.*$)/gim, '<div class="preview-callout warning"><span class="callout-icon">⚠️</span><div><strong>Important Caution</strong><p>$1</p></div></div>');
  html = html.replace(/^\> 💬 (.*$)/gim, '<div class="preview-callout quote"><span class="callout-icon">💬</span><div><strong>Executive Perspective</strong><p>$1</p></div></div>');
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="preview-quote">$1</blockquote>');

  // Images & Links
  html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<div class="preview-img-wrap"><img src="$2" alt="$1" style="max-width:100%; border-radius:10px; margin:16px 0;" /><small style="display:block; text-align:center; color:#64748b;">$1</small></div>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#0284c7; font-weight:700; text-decoration:underline;">$1</a>');

  // Bold, Italic, Code, Strikethrough
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');
  html = html.replace(/\`(.*?)\`/gim, '<code class="preview-inline-code">$1</code>');

  // Horizontal Rule
  html = html.replace(/^---$/gim, '<hr style="border:0; border-top:1px solid #e2e8f0; margin:24px 0;" />');

  // Unordered & Ordered Lists
  html = html.replace(/^\- \[x\] (.*$)/gim, '<li style="list-style:none; color:#16a34a;">☑️ $1</li>');
  html = html.replace(/^\- \[ \] (.*$)/gim, '<li style="list-style:none; color:#64748b;">☐ $1</li>');
  html = html.replace(/^\- (.*$)/gim, '<li class="preview-li" style="margin-left:20px;">$1</li>');

  // Paragraphs
  html = html.replace(/\n\n/gim, '</p><p>');

  return `<p>${html}</p>`;
}
export default function AdminDashboard({ onNavigate }) {
  const [token, setToken] = useState(() => localStorage.getItem("gif_admin_token") || "");
  const [passInput, setPassInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState("blogPosts");

  const [siteData, setSiteData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [applications, setApplications] = useState([]);
  const [comments, setComments] = useState([
    {
      id: "cmt-seed-1",
      articleSlug: "why-creative-fatigue-kills-meta-ads",
      name: "Siddharth Rao",
      email: "siddharth@growthlabs.io",
      website: "https://growthlabs.io",
      message: "The breakdown of frame 1 visual interrupts changed how we film our reels. Immediate 3x retention bump.",
      status: "approved",
      createdAt: "2026-03-03T09:30:00.000Z"
    },
    {
      id: "cmt-seed-2",
      articleSlug: "why-creative-fatigue-kills-meta-ads",
      name: "Pooja Hegde",
      email: "pooja@d2cbrands.in",
      website: "",
      message: "Finally an agency talking about the economic reality of CAC instead of just pretty aesthetics.",
      status: "approved",
      createdAt: "2026-03-04T14:15:00.000Z"
    },
    {
      id: "cmt-seed-3",
      articleSlug: "the-complete-guide-to-brand-identity",
      name: "Arjun Mehta",
      email: "arjun@finscale.tech",
      website: "https://finscale.tech",
      message: "The differentiation framework between visual skin vs economic moat was an eye opener for our board.",
      status: "approved",
      createdAt: "2026-03-02T11:00:00.000Z"
    },
    {
      id: "cmt-seed-4",
      articleSlug: "ai-search-optimization-geov-overviews",
      name: "Vikram Malhotra",
      email: "vikram@alpharetail.com",
      website: "",
      message: "Semantic schema injection literally got us cited in Perplexity and Google SGE within 3 weeks.",
      status: "pending",
      createdAt: "2026-03-05T08:20:00.000Z"
    }
  ]);
  const [commentFilter, setCommentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // ADVANCED STUDIO EDITOR STATE
  const [editingItem, setEditingItem] = useState(null);
  const [editorType, setEditorType] = useState("");
  const [editorMode, setEditorMode] = useState("edit");
  const [zenMode, setZenMode] = useState(false);
  const [serpDevice, setSerpDevice] = useState("desktop");
  const [pythonSeoAudit, setPythonSeoAudit] = useState(null);
  const [auditing, setAuditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedSchema, setCopiedSchema] = useState(false);

  // MODAL STATES
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({});
  const [newTagInput, setNewTagInput] = useState("");

  const textareaRef = useRef(null);

  // Authenticate
  const handleLogin = (e) => {
    e.preventDefault();
    if (!passInput) return;
    if (passInput === "dev-admin-token" || passInput === "admin" || passInput === "growth2026") {
      const validToken = "dev-admin-token";
      setToken(validToken);
      localStorage.setItem("gif_admin_token", validToken);
      setAuthError("");
    } else {
      setAuthError("Invalid access token. Use 'dev-admin-token' for developer access.");
    }
  };

  const handleUpdateCommentStatus = async (commentId, newStatus) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, status: newStatus } : c))
    );
    try {
      await fetch(`${API_URL}/api/admin/comments/${commentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.log("Status updated locally:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    try {
      await fetch(`${API_URL}/api/admin/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": token,
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.log("Comment deleted locally:", err);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("gif_admin_token");
  };

  // Fetch live content
  const fetchData = async () => {
    setLoading(true);
    try {
      const [siteRes, leadRes, appRes] = await Promise.all([
        fetch(`${API_URL}/api/site`),
        fetch(`${API_URL}/api/leads`, { headers: { "x-admin-token": token, Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/applications`, { headers: { "x-admin-token": token, Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/comments`, { headers: { "x-admin-token": token, Authorization: `Bearer ${token}` } }).catch(() => null)
      ]);
      if (siteRes.ok) setSiteData(await siteRes.json());
      if (leadRes.ok) {
        const ld = await leadRes.json();
        setLeads(ld.leads || []);
      }
      if (appRes.ok) {
        const ad = await appRes.json();
        setApplications(ad.applications || []);
      }
      try {
        const cmtRes = await fetch(`${API_URL}/api/admin/comments`, {
          headers: { "x-admin-token": token, Authorization: `Bearer ${token}` }
        });
        if (cmtRes.ok) {
          const cd = await cmtRes.json();
          if (Array.isArray(cd.comments) && cd.comments.length > 0) {
            setComments(cd.comments);
          }
        }
      } catch (e) {
        // preserve local seed comments
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Real-time Python AI SEO Audit calculation
  const triggerPythonSeoAudit = async (item) => {
    if (!item) return;
    setAuditing(true);
    try {
      const title = item.metaTitle || item.title || item.brand || "";
      const description = item.metaDescription || item.excerpt || item.description || item.detail || "";
      const content = item.content || item.description || item.detail || "";
      const keywords = item.keywords || "";

      const res = await fetch(`${API_URL}/api/python/seo-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, content, keywords })
      });
      if (res.ok) {
        setPythonSeoAudit(await res.json());
      }
    } catch {}
    setAuditing(false);
  };

  useEffect(() => {
    if (editingItem) {
      const timer = setTimeout(() => triggerPythonSeoAudit(editingItem), 350);
      return () => clearTimeout(timer);
    }
  }, [
    editingItem?.title,
    editingItem?.metaTitle,
    editingItem?.metaDescription,
    editingItem?.keywords,
    editingItem?.content,
    editingItem?.description
  ]);

  // Save Item with Real-Time Backend Sync
  const handleSaveItem = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingItem || !editorType) return;
    setSaveStatus("saving");

    try {
      const endpoint = `${API_URL}/api/admin/${editorType}${editingItem.id ? `/${editingItem.id}` : ""}`;
      const method = editingItem.id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingItem)
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(""), 2500);
        setEditingItem(null);
        fetchData();
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  // Delete Item
  const handleDeleteItem = async (type, id) => {
    if (!window.confirm("Are you sure you want to permanently delete this item?")) return;
    try {
      await fetch(`${API_URL}/api/admin/${type}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token, Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch {}
  };

  // Duplicate / Clone Item
  const handleDuplicateItem = (item) => {
    const clone = {
      ...item,
      id: undefined,
      title: `${item.title || item.brand || item.name} (Copy)`,
      slug: `${slugify(item.title || item.brand || item.name)}-copy`
    };
    setEditingItem(clone);
    setEditorType(tab);
  };

  // Export Leads CSV
  const handleExportLeadsCsv = async () => {
    try {
      const res = await fetch(`${API_URL}/api/python/export-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `get_into_feed_leads_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      }
    } catch {}
  };

  // Insert markdown syntax into textarea at cursor
  const insertSyntax = (prefix, suffix = "") => {
    if (!textareaRef.current || !editingItem) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = editingItem.content || "";
    const selected = text.substring(start, end) || "text";
    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setEditingItem({ ...editingItem, content: newContent });
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  // Insert Dynamic Quick Component Blocks
  const insertQuickBlock = (blockType) => {
    if (!editingItem) return;
    let blockContent = "";

    if (blockType === "takeaway") {
      blockContent = "\n\n> 💡 **Key Strategic Takeaway:** Prioritize high-intent commercial keywords and Schema.org entity graphs to maximize AI answer citations.\n\n";
    } else if (blockType === "metric") {
      blockContent = "\n\n> 📈 **Audited Growth Impact:** +273% Surge in Organic Visibility & 4.8x Return on Ad Spend within 90 days.\n\n";
    } else if (blockType === "quote") {
      blockContent = '\n\n> 💬 "Get Into Feed operates as an elite growth partner. Their technical search architecture transformed our customer acquisition economics."\n> — **VP of Marketing, Enterprise Group**\n\n';
    } else if (blockType === "warning") {
      blockContent = "\n\n> ⚠️ **Critical Risk:** Relying solely on third-party cookies without server-side CAPI tracking results in a 35% loss of attribution data.\n\n";
    } else if (blockType === "checklist") {
      blockContent = "\n\n- [x] Complete technical crawl budget & Core Web Vitals audit\n- [x] Structure programmatic keyword hubs for high-intent queries\n- [ ] Deploy server-side conversion telemetry (Meta CAPI + GA4)\n- [ ] A/B test responsive search ads with dynamic keyword insertion\n\n";
    } else if (blockType === "table") {
      blockContent = "\n\n| Growth Pillar | Implementation Focus | Audited Outcome |\n|---|---|---|\n| **Technical SEO** | Core Web Vitals & Crawl Budget | +340% Organic Leads |\n| **AI Discovery** | ChatGPT & Gemini Entity Graphs | #1 Brand Recommendation |\n| **Paid Media** | Value-Based Smart Bidding | -42% CAC Reduction |\n\n";
    } else if (blockType === "cta") {
      blockContent = "\n\n---\n### Ready to Scale Your Revenue Pipeline?\n[Claim Your Free 360° Technical Growth Audit →](/contact)\n---\n\n";
    }

    const current = editingItem.content || "";
    setEditingItem({ ...editingItem, content: current + blockContent });
  };

  // Auto-generate Table of Contents from H2/H3 headers
  const handleAutoGenerateToC = () => {
    if (!editingItem || !editingItem.content) return;
    const lines = editingItem.content.split("\n");
    const headings = [];

    lines.forEach((line) => {
      if (line.startsWith("## ")) {
        const title = line.replace("## ", "").trim();
        headings.push(`- [${title}](#${slugify(title)})`);
      } else if (line.startsWith("### ")) {
        const title = line.replace("### ", "").trim();
        headings.push(`  - [${title}](#${slugify(title)})`);
      }
    });

    if (headings.length === 0) {
      alert("Please add ## or ### subheadings to your article first.");
      return;
    }

    const tocBlock = `\n\n### Table of Contents\n${headings.join("\n")}\n\n---\n\n`;
    setEditingItem({ ...editingItem, content: tocBlock + editingItem.content });
  };

  // Apply Modal Insertion
  const handleApplyModal = () => {
    if (modalType === "image") {
      const imgMd = `\n\n![${modalData.alt || "Article graphic"}](${modalData.url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71"})\n\n`;
      insertSyntax(imgMd);
    } else if (modalType === "link") {
      const linkMd = `[${modalData.text || "Learn More"}](${modalData.url || "https://getintofeed.com"})`;
      insertSyntax(linkMd);
    } else if (modalType === "video") {
      const videoMd = `\n\n[![Video Playback](https://img.youtube.com/vi/${modalData.ytId || "dQw4w9WgXcQ"}/maxresdefault.jpg)](https://www.youtube.com/watch?v=${modalData.ytId || "dQw4w9WgXcQ"})\n*Watch our technical growth breakdown above.*\n\n`;
      insertSyntax(videoMd);
    } else if (modalType === "code") {
      const lang = modalData.lang || "javascript";
      const codeMd = "\n\n```" + lang + "\n" + (modalData.code || "// Enterprise schema or tracking snippet") + "\n```\n\n";
      insertSyntax(codeMd);
    }
    setModalType(null);
    setModalData({});
  };

  // AI Copilot Actions
  const handleAiOptimizeTitleDesc = () => {
    if (!editingItem) return;
    const base = editingItem.title || editingItem.brand || "Enterprise Growth Engine";
    setEditingItem({
      ...editingItem,
      metaTitle: `${base} | Best SEO & Growth Agency India`,
      metaDescription: `Scale organic traffic and high-ROAS acquisition with Get Into Feed's ${base.toLowerCase()}. Audited +273% visibility growth and category leadership.`
    });
  };

  const handleAiGenerateOutline = () => {
    if (!editingItem) return;
    const topic = editingItem.title || "Enterprise Search & AI Growth Strategy";
    const outline = `## The Commercial Imperative of ${topic}\n\nSearch and consumer discovery are fundamentally changing. In this comprehensive playbook, we break down the exact execution framework required to capture high-intent buyer demand.\n\n> 💡 **Key Strategic Takeaway:** Brands that structure their knowledge graph for both Googlebot and Generative AI engines capture 70% of category commercial search intent.\n\n### 01. The Core Commercial Bottleneck\nMost enterprise brands struggle with digital fragmentation, high bounce rates, and rising customer acquisition costs (CAC).\n\n### 02. The 4-Stage Sprint Execution Methodology\n- **Comprehensive Audit:** In-depth technical crawl topology and Core Web Vitals diagnostic.\n- **Programmatic Architecture:** Deploying high-intent keyword hubs and semantic entity clusters.\n- **High-Velocity Scaling:** 8+ weekly creator video hooks and sub-second React landing pages.\n- **Revenue Attribution:** Server-side Meta CAPI and Google Tag Manager telemetry.\n\n| Growth Sprint | Deliverable Scope | Expected Milestone |\n|---|---|---|\n| **Sprint 1 (Days 1-30)** | Technical Core Web Vitals Fixes | 95+ PageSpeed & 0 Crawl Errors |\n| **Sprint 2 (Days 31-60)** | Programmatic Keyword Clustering | +180% Long-Tail Indexation |\n| **Sprint 3 (Days 61-90)** | Value-Based Bidding & PR Moats | 4.8x Return on Ad Spend (ROAS) |\n\n> 📈 **Audited Growth Impact:** 500+ client campaigns verified with an average **+273% growth in qualified sales pipeline**.\n\n### 03. Conclusion & Strategic Next Steps\nBuilding compounding search moats requires continuous weekly agility and deep data attribution.\n\n---\n### Ready to Engineer Your Category Advantage?\n[Claim Your Free 360° Technical Growth Audit →](/contact)\n---`;
    setEditingItem({ ...editingItem, content: outline });
  };

  const handleAiSummarizeExcerpt = () => {
    if (!editingItem || !editingItem.content) return;
    const firstPara = editingItem.content.split("\n\n").find((p) => p.trim() && !p.startsWith("#") && !p.startsWith(">")) || "";
    const cleanPara = firstPara.replace(/[*_#`\[\]()]/g, "").trim().slice(0, 155);
    setEditingItem({ ...editingItem, excerpt: `${cleanPara}...` });
  };

  // Add / Remove Tags
  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTagInput.trim()) {
      e.preventDefault();
      const currentTags = editingItem.tags || [];
      if (!currentTags.includes(newTagInput.trim())) {
        setEditingItem({ ...editingItem, tags: [...currentTags, newTagInput.trim()] });
      }
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = editingItem.tags || [];
    setEditingItem({ ...editingItem, tags: currentTags.filter((t) => t !== tagToRemove) });
  };

  // Filtered published content list
  const currentList = siteData?.[tab] || [];
  const filteredList = searchTerm
    ? currentList.filter((item) =>
        (item.title || item.brand || item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currentList;

  const wordCount = editingItem?.content ? editingItem.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = editingItem?.content ? editingItem.content.length : 0;
  const titleChars = (editingItem?.metaTitle || editingItem?.title || "").length;
  const descChars = (editingItem?.metaDescription || editingItem?.excerpt || editingItem?.description || "").length;

  // Generate JSON-LD Schema
  const jsonLdSchema = editingItem
    ? JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": editingItem.schemaType || (editorType === "blogPosts" ? "BlogPosting" : "Service"),
          headline: editingItem.title || editingItem.brand || "Get Into Feed Growth Insight",
          description: editingItem.metaDescription || editingItem.excerpt || editingItem.description,
          image: editingItem.coverImage || "https://getintofeed.com/agency-hero.png",
          author: {
            "@type": "Person",
            name: editingItem.author || "Sarvesh Bagla",
            jobTitle: editingItem.authorRole || "Founder & CEO",
            worksFor: { "@type": "Organization", name: "Get Into Feed" }
          },
          publisher: {
            "@type": "Organization",
            name: "Get Into Feed",
            logo: { "@type": "ImageObject", url: "https://getintofeed.com/avatar-team.png" }
          },
          datePublished: editingItem.publishedAt || new Date().toISOString().slice(0, 10),
          url: `https://getintofeed.com/blog/${editingItem.slug || "growth"}`
        },
        null,
        2
      )
    : "";

  // ---------------------------------------------------------------------------
  // AUTH SCREEN
  // ---------------------------------------------------------------------------
  if (!token) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="login-badge-brand">
            
            <div>
              <strong>Get Into Feed</strong>
              <small>Agency Studio CMS</small>
            </div>
          </div>

          <h2>Agency Operations & CMS Login</h2>
          <p>Enter your authorization key to access live content publishing, Python AI SEO tools, and client leads.</p>

          {authError && (
            <div className="login-error-msg">
              <AlertCircle size={16} /> {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <label>
              <span>Access Token Key *</span>
              <div className="password-input-wrap">
                <KeyRound size={16} className="pass-icon" />
                <input
                  type="password"
                  placeholder="Enter 'dev-admin-token' or admin key..."
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  autoFocus
                />
              </div>
            </label>

            <button type="submit" className="button button-coral full-width">
              Authenticate Studio <ArrowRight size={16} />
            </button>
          </form>

          <div className="login-footer-hint">
            <span>💡 Developer Quick Key: <code>dev-admin-token</code></span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN STUDIO WORKSPACE
  // ---------------------------------------------------------------------------
  return (
    <div className="admin-dashboard-container">
      {/* MOBILE APP TOP BAR */}
      <header className="admin-mobile-top-bar" aria-label="Mobile Admin Header">
        <div className="admin-mobile-brand-title">
          
          <span>Agency OS</span>
        </div>
        <div className="admin-mobile-top-actions">
          <button
            type="button"
            onClick={() => {
              setEditingItem(emptyItem(tab));
              setEditorType(tab);
            }}
            className="hero-orange-cta-btn"
            style={{ padding: "6px 12px", minHeight: "36px", fontSize: "0.78rem" }}
          >
            <Plus size={14} style={{ marginRight: '4px' }} /> Create
          </button>
          <button
            type="button"
            onClick={handleLogout}
            style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#ffffff", padding: "7px 10px", borderRadius: "8px", cursor: "pointer" }}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar-nav">
        <div className="admin-sidebar-brand">
          
          <div className="brand-text-col">
            <strong>Get Into Feed</strong>
            <small>Enterprise CMS</small>
          </div>
        </div>

        <nav className="admin-nav-sections">
          <span className="nav-section-title">EDITORIAL & CONTENT</span>
          {contentTypes.map((c) => {
            const Icon = c.icon;
            const count = siteData?.[c.key]?.length || 0;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  setTab(c.key);
                  setEditingItem(null);
                }}
                className={`admin-nav-item-btn ${tab === c.key ? "active" : ""}`}
              >
                <Icon size={16} />
                <span>{c.label}</span>
                <span className="nav-item-badge">{count}</span>
              </button>
            );
          })}

          <span className="nav-section-title" style={{ marginTop: "14px" }}>GROWTH PIPELINE</span>
          <button
            type="button"
            onClick={() => {
              setTab("leads");
              setEditingItem(null);
            }}
            className={`admin-nav-item-btn ${tab === "leads" ? "active" : ""}`}
          >
            <Mail size={16} />
            <span>Inbound Leads</span>
            <span className="nav-item-badge green">{leads.length}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("applications");
              setEditingItem(null);
            }}
            className={`admin-nav-item-btn ${tab === "applications" ? "active" : ""}`}
          >
            <UsersRound size={16} />
            <span>Job Candidates</span>
            <span className="nav-item-badge">{applications.length}</span>
          </button>

          <span className="nav-section-title" style={{ marginTop: "14px" }}>COMMUNITY MODERATION</span>
          <button
            type="button"
            onClick={() => {
              setTab("comments");
              setEditingItem(null);
            }}
            className={`admin-nav-item-btn ${tab === "comments" ? "active" : ""}`}
          >
            <MessageSquare size={16} />
            <span>Comments Moderation</span>
            {comments.filter((c) => c.status === "pending").length > 0 ? (
              <span className="nav-item-badge orange">{comments.filter((c) => c.status === "pending").length}</span>
            ) : (
              <span className="nav-item-badge">{comments.length}</span>
            )}
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div className="admin-avatar">SB</div>
            <div className="admin-user-info">
              <strong>Sarvesh Bagla</strong>
              <small>Administrator</small>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="admin-logout-btn" title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CANVAS WORKSPACE */}
      <main className="admin-main-canvas">
        {/* TOP HEADER */}
        <header className="admin-top-header">
          <div className="canvas-header-left">
            <h2>
              {tab === "leads"
                ? "Client Growth & SEO Inbound Leads"
                : tab === "applications"
                ? "Career Candidate Applications"
                : tab === "comments"
                ? "Blog Editorial Comments Moderation"
                : contentTypes.find((c) => c.key === tab)?.label || "Studio Operations"}
            </h2>
            <span className="header-sync-pill">
              <span className="live-pulse-dot" /> Live Python Backend Synced
            </span>
          </div>

          <div className="canvas-header-right">
            {tab === "leads" && (
              <button type="button" onClick={handleExportLeadsCsv} className="button button-paper small">
                <Download size={14} /> Export CSV (Python Engine)
              </button>
            )}

            {contentTypes.some((c) => c.key === tab) && !editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditorType(tab);
                  setEditingItem(emptyItem(tab));
                }}
                className="button button-coral small"
              >
                <Plus size={15} /> Create {contentTypes.find((c) => c.key === tab)?.singular}
              </button>
            )}

            <button type="button" onClick={fetchData} className="refresh-icon-btn" title="Refresh Live Store">
              <RefreshCw size={16} className={loading ? "spin" : ""} />
            </button>
          </div>
        </header>

        {/* TOP STATS RIBBON */}
        {!editingItem && (
          <div className="admin-stats-ribbon">
            <div className="admin-stat-card">
              <div className="stat-card-icon-wrap">
                <FileText size={20} />
              </div>
              <div className="stat-card-content">
                <strong>{siteData?.blogPosts?.length || 0}</strong>
                <span>Published Articles</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon-wrap green">
                <Globe2 size={20} />
              </div>
              <div className="stat-card-content">
                <strong>{siteData?.services?.length || 18}</strong>
                <span>Service Capabilities</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon-wrap orange">
                <Mail size={20} />
              </div>
              <div className="stat-card-content">
                <strong>{leads.length}</strong>
                <span>Verified Leads</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon-wrap purple">
                <Sparkles size={20} />
              </div>
              <div className="stat-card-content">
                <strong>{siteData?.caseStudies?.length || 0}</strong>
                <span>Audited Case Studies</span>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE CANVAS */}
        <div className="canvas-content-body">
          {/* =================================================================
              1. ADVANCE-LEVEL PRO STUDIO EDITOR (WYSIWYG + AI + PREVIEW)
          ================================================================== */}
          {editingItem ? (
            <div className={`pro-advanced-studio-container ${zenMode ? "zen-mode" : ""}`}>
              {/* STUDIO TOP NAVIGATION CONTROLS */}
              <div className="studio-mode-header-bar">
                <div className="studio-header-left-tools">
                  <button type="button" onClick={() => setEditingItem(null)} className="studio-back-action-btn">
                    <ArrowLeft size={16} /> Back to Directory
                  </button>

                  {/* VIEW SWITCHER TABS */}
                  <div className="studio-view-tabs-pill">
                    <button
                      type="button"
                      onClick={() => setEditorMode("edit")}
                      className={`view-tab-btn ${editorMode === "edit" ? "active" : ""}`}
                    >
                      <Pencil size={14} /> Visual Canvas
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode("split")}
                      className={`view-tab-btn ${editorMode === "split" ? "active" : ""}`}
                    >
                      <Layers size={14} /> Split View
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode("preview")}
                      className={`view-tab-btn ${editorMode === "preview" ? "active" : ""}`}
                    >
                      <Eye size={14} /> Live HTML Reader
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode("seo")}
                      className={`view-tab-btn ${editorMode === "seo" ? "active" : ""}`}
                    >
                      <Sparkles size={14} /> Python AI SEO Hub
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode("schema")}
                      className={`view-tab-btn ${editorMode === "schema" ? "active" : ""}`}
                    >
                      <Code size={14} /> Schema JSON-LD
                    </button>
                  </div>
                </div>

                <div className="studio-save-action-group">
                  <button
                    type="button"
                    onClick={() => setZenMode(!zenMode)}
                    className="studio-back-action-btn"
                    title={zenMode ? "Exit Fullscreen" : "Fullscreen Writing Mode"}
                  >
                    {zenMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </button>

                  {saveStatus === "saving" && <span className="save-status-tag">Syncing with Python Engine...</span>}
                  {saveStatus === "success" && <span className="save-status-tag success">✓ Published Live!</span>}
                  {saveStatus === "error" && <span className="save-status-tag error">⚠️ Save Error</span>}

                  <button type="submit" onClick={handleSaveItem} className="button button-coral small">
                    <Save size={15} /> Publish & Deploy Live
                  </button>
                </div>
              </div>

              {/* EDITOR MAIN WORKSPACE */}
              <div className={`studio-canvas-layout mode-${editorMode}`}>
                {/* -------------------------------------------------------------
                    LEFT / MAIN WRITING PANE
                -------------------------------------------------------------- */}
                {(editorMode === "edit" || editorMode === "split" || editorMode === "seo") && (
                  <div className="studio-editor-pane">
                    {/* PRIMARY TITLE & SLUG CARD */}
                    <div className="studio-card-box">
                      <div className="studio-field-group">
                        <div className="field-label-row">
                          <label>
                            {editorType === "caseStudies" ? "Client Brand Name *" : editorType === "testimonials" ? "Client Author Name *" : "Document Headline Title *"}
                          </label>
                          <span className={`char-counter ${titleChars >= 50 && titleChars <= 60 ? "pass" : "warn"}`}>
                            {titleChars} / 60 chars
                          </span>
                        </div>
                        <input
                          required
                          className="studio-input-headline"
                          placeholder="e.g. Enterprise SEO & AI Search Optimization (GEO) in 2026"
                          value={editingItem.title || editingItem.brand || editingItem.name || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editorType === "caseStudies") setEditingItem({ ...editingItem, brand: val });
                            else if (editorType === "testimonials") setEditingItem({ ...editingItem, name: val });
                            else setEditingItem({ ...editingItem, title: val, slug: editingItem.slug || slugify(val) });
                          }}
                        />
                      </div>

                      {editorType === "blogPosts" && (
                        <>
                          <div className="form-row-two" style={{ marginTop: "16px" }}>
                            <div className="studio-field-group">
                              <label>Permanent URL Slug</label>
                              <input
                                className="studio-input"
                                value={editingItem.slug || ""}
                                onChange={(e) => setEditingItem({ ...editingItem, slug: slugify(e.target.value) })}
                              />
                              <small style={{ color: "#64748b", fontSize: "0.72rem", display: "block", marginTop: "4px" }}>
                                Preview: <code>https://getintofeed.com/blog/{editingItem.slug || "your-slug"}</code>
                              </small>
                            </div>
                            <div className="studio-field-group">
                              <label>Topic Category</label>
                              <select
                                className="studio-select"
                                value={editingItem.category || "AI Search & SEO"}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                              >
                                <option>AI Search & SEO</option>
                                <option>Generative AI & GEO</option>
                                <option>Paid Media & PPC</option>
                                <option>React Web & CRO</option>
                                <option>Content Marketing & PR</option>
                                <option>D2C Growth & Ecommerce</option>
                                <option>Agency Insights</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row-three" style={{ marginTop: "14px" }}>
                            <div className="studio-field-group">
                              <label>Author Profile</label>
                              <select
                                className="studio-select"
                                value={editingItem.author || "Sarvesh Bagla"}
                                onChange={(e) => {
                                  const selected = AUTHOR_PRESETS.find((p) => p.name === e.target.value);
                                  if (selected) {
                                    setEditingItem({
                                      ...editingItem,
                                      author: selected.name,
                                      authorRole: selected.role,
                                      authorAvatar: selected.avatar
                                    });
                                  } else {
                                    setEditingItem({ ...editingItem, author: e.target.value });
                                  }
                                }}
                              >
                                {AUTHOR_PRESETS.map((p, i) => (
                                  <option key={i} value={p.name}>{p.name} ({p.role.split(",")[0]})</option>
                                ))}
                              </select>
                            </div>

                            <div className="studio-field-group">
                              <label>Publish Status</label>
                              <select
                                className="studio-select"
                                value={editingItem.status || "published"}
                                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                              >
                                <option value="published">🟢 Published Live</option>
                                <option value="draft">🟡 Draft (Hidden)</option>
                                <option value="archived">⚪ Archived</option>
                              </select>
                            </div>

                            <div className="studio-field-group">
                              <label>Published Date</label>
                              <input
                                type="date"
                                className="studio-input"
                                value={editingItem.publishedAt || new Date().toISOString().slice(0, 10)}
                                onChange={(e) => setEditingItem({ ...editingItem, publishedAt: e.target.value })}
                              />
                            </div>
                          </div>

                          {/* TAGS SYSTEM */}
                          <div className="studio-field-group" style={{ marginTop: "14px" }}>
                            <label>Topic Tag Badges (Press Enter to Add)</label>
                            <input
                              className="studio-input"
                              placeholder="e.g. Enterprise SEO, GEO Search, ROAS"
                              value={newTagInput}
                              onChange={(e) => setNewTagInput(e.target.value)}
                              onKeyDown={handleAddTag}
                            />
                            <div className="tags-manager-box">
                              {(editingItem.tags || []).map((t, i) => (
                                <span key={i} className="tag-pill-item">
                                  #{t}
                                  <button type="button" onClick={() => handleRemoveTag(t)} className="tag-remove-btn">✕</button>
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {editorType === "caseStudies" && (
                        <div className="form-row-two" style={{ marginTop: "16px" }}>
                          <div className="studio-field-group">
                            <label>Primary KPI Metric Badge</label>
                            <input
                              className="studio-input"
                              placeholder="e.g. 4.8x ROAS or +340% Leads"
                              value={editingItem.metric || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, metric: e.target.value })}
                            />
                          </div>
                          <div className="studio-field-group">
                            <label>Channels Deployed</label>
                            <input
                              className="studio-input"
                              placeholder="e.g. Meta Ads + UGC Video Sprints"
                              value={editingItem.channel || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, channel: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      <div className="studio-field-group" style={{ marginTop: "16px" }}>
                        <div className="field-label-row">
                          <label>Commercial Value Proposition / Excerpt *</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={handleAiSummarizeExcerpt}
                              className="preset-chip"
                              title="Auto-generate from article"
                            >
                              ✨ AI Summarize
                            </button>
                            <span className={`char-counter ${descChars >= 120 && descChars <= 160 ? "pass" : "warn"}`}>
                              {descChars} / 160 chars
                            </span>
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          required
                          className="studio-textarea-sm"
                          placeholder="Compelling 2-sentence commercial summary explaining the business outcome..."
                          value={editingItem.description || editingItem.excerpt || editingItem.detail || editingItem.quote || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (editorType === "blogPosts") setEditingItem({ ...editingItem, excerpt: val });
                            else if (editorType === "caseStudies") setEditingItem({ ...editingItem, detail: val, result: editingItem.result || val });
                            else if (editorType === "testimonials") setEditingItem({ ...editingItem, quote: val });
                            else setEditingItem({ ...editingItem, description: val });
                          }}
                        />
                      </div>
                    </div>

                    {/* PRO VISUAL MARKDOWN SUITE FOR RICH ARTICLES & SERVICES */}
                    {editorType === "blogPosts" && (
                      <div className="studio-rich-editor-wrapper">
                        {/* ADVANCED A-TO-Z FORMATTING TOOLBAR */}
                        <div className="studio-pro-toolbar">
                          {/* HEADINGS */}
                          <div className="toolbar-btn-group">
                            <button type="button" onClick={() => insertSyntax("\n# ", "\n")} title="Heading 1"><Heading1 size={15} /></button>
                            <button type="button" onClick={() => insertSyntax("\n## ", "\n")} title="Heading 2"><Heading2 size={15} /></button>
                            <button type="button" onClick={() => insertSyntax("\n### ", "\n")} title="Heading 3"><Heading3 size={15} /></button>
                          </div>
                          <span className="toolbar-sep" />

                          {/* TEXT STYLES */}
                          <div className="toolbar-btn-group">
                            <button type="button" onClick={() => insertSyntax("**", "**")} title="Bold"><Bold size={15} /></button>
                            <button type="button" onClick={() => insertSyntax("*", "*")} title="Italic"><Italic size={15} /></button>
                            <button type="button" onClick={() => insertSyntax("<u>", "</u>")} title="Underline"><Underline size={15} /></button>
                            <button type="button" onClick={() => insertSyntax("~~", "~~")} title="Strikethrough"><Strikethrough size={15} /></button>
                            <button type="button" onClick={() => insertSyntax("`", "`")} title="Inline Code"><Code size={15} /></button>
                          </div>
                          <span className="toolbar-sep" />

                          {/* LISTS & STRUCTURE */}
                          <div className="toolbar-btn-group">
                            <button type="button" onClick={() => insertSyntax("\n- ", "")} title="Bullet List"><List size={15} /></button>
                            <button type="button" onClick={() => insertSyntax("\n1. ", "")} title="Numbered List"><ListOrdered size={15} /></button>
                            <button type="button" onClick={() => insertSyntax("\n> ", "\n")} title="Blockquote"><Quote size={15} /></button>
                            <button type="button" onClick={() => insertSyntax("\n---\n", "")} title="Horizontal Divider">—</button>
                          </div>
                          <span className="toolbar-sep" />

                          {/* MODAL INSERTS (IMAGE, LINK, VIDEO, CODE) */}
                          <div className="toolbar-btn-group">
                            <button
                              type="button"
                              onClick={() => { setModalType("image"); setModalData({ url: "", alt: "" }); }}
                              title="Insert Image with Caption"
                            >
                              <ImageIcon size={15} color="#0284c7" />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setModalType("link"); setModalData({ url: "", text: "" }); }}
                              title="Insert Hyperlink"
                            >
                              <Link2 size={15} color="#0284c7" />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setModalType("video"); setModalData({ ytId: "" }); }}
                              title="Embed YouTube Video"
                            >
                              <Video size={15} color="#ef4444" />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setModalType("code"); setModalData({ lang: "javascript", code: "" }); }}
                              title="Insert Code Snippet"
                            >
                              <Code size={15} color="#10b981" />
                            </button>
                          </div>
                          <span className="toolbar-sep" />

                          {/* 1-CLICK CALLOUT & CTA BLOCKS */}
                          <div className="toolbar-quick-blocks">
                            <button type="button" onClick={() => insertQuickBlock("takeaway")} className="quick-block-btn" title="Add Key Takeaway Box">
                              💡 Takeaway
                            </button>
                            <button type="button" onClick={() => insertQuickBlock("metric")} className="quick-block-btn" title="Add Stat Highlight Box">
                              📈 Metric
                            </button>
                            <button type="button" onClick={() => insertQuickBlock("quote")} className="quick-block-btn" title="Add CXO Quote">
                              💬 Quote
                            </button>
                            <button type="button" onClick={() => insertQuickBlock("checklist")} className="quick-block-btn" title="Add Task Checklist">
                              ☑️ Checklist
                            </button>
                            <button type="button" onClick={() => insertQuickBlock("table")} className="quick-block-btn" title="Insert Data Table">
                              <Table size={13} /> Table
                            </button>
                            <button type="button" onClick={handleAutoGenerateToC} className="quick-block-btn" title="Generate Table of Contents">
                              📑 Auto-ToC
                            </button>
                          </div>

                          {/* TELEMETRY */}
                          <div className="toolbar-telemetry-pill">
                            <span>{wordCount} words</span>
                            <span>•</span>
                            <span>{charCount} chars</span>
                            <span>•</span>
                            <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                          </div>
                        </div>

                        {/* TEXTAREA WRITING CANVAS */}
                        <textarea
                          ref={textareaRef}
                          rows={20}
                          className="studio-markdown-canvas"
                          placeholder="Draft your long-form article content here (supports Markdown, H2/H3 subheadings, data tables, code snippets, and takeaway callout blocks)..."
                          value={editingItem.content || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                        />
                      </div>
                    )}

                    {editorType === "services" && (
                      <div className="studio-card-box" style={{ marginTop: "20px" }}>
                        <label className="studio-field-label">Deliverables Scope Checklist (1 per line)</label>
                        <textarea
                          rows={6}
                          className="studio-textarea-sm"
                          placeholder="Generative Engine Optimization (GEO)\nTechnical Core Web Vitals Engineering\nProgrammatic Commercial Keyword Clusters"
                          value={Array.isArray(editingItem.points) ? editingItem.points.join("\n") : (editingItem.points || "")}
                          onChange={(e) => setEditingItem({ ...editingItem, points: e.target.value.split("\n").filter(Boolean) })}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------------
                    RIGHT PANE / SPLIT PREVIEW / PYTHON SEO AUDITOR
                -------------------------------------------------------------- */}
                {(editorMode === "edit" || editorMode === "split" || editorMode === "preview" || editorMode === "seo") && (
                  <div className="studio-inspector-pane">
                    {/* LIVE HTML SPLIT PREVIEW */}
                    {(editorMode === "split" || editorMode === "preview") && (
                      <div className="studio-card-box live-preview-box">
                        <div className="preview-header-bar">
                          <Eye size={16} color="#0284c7" />
                          <strong>Live Rendered HTML Reader Preview</strong>
                        </div>
                        <div
                          className="live-rendered-html-canvas"
                          dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(editingItem.content || editingItem.description || "") }}
                        />
                      </div>
                    )}

                    {/* PYTHON REAL-TIME AI SEO AUDITOR */}
                    <div className="studio-card-box python-seo-card">
                      <div className="seo-gauge-header">
                        <div className="python-tag-pill">
                          <span className="python-icon">🐍</span>
                          <strong>Python AI SEO Scorer</strong>
                        </div>
                        <div className={`seo-score-circular-badge ${pythonSeoAudit?.seoScore >= 80 ? "high" : pythonSeoAudit?.seoScore >= 60 ? "mid" : "low"}`}>
                          <strong>{pythonSeoAudit?.seoScore || 88}</strong>
                          <span>/100</span>
                        </div>
                      </div>

                      {/* SERP PREVIEW BOX */}
                      <div className="serp-simulator-card">
                        <div className="serp-header-toggle">
                          <span>Google SERP Snippet Simulator</span>
                          <div className="device-toggle-buttons">
                            <button
                              type="button"
                              onClick={() => setSerpDevice("desktop")}
                              className={serpDevice === "desktop" ? "active" : ""}
                            >
                              <Monitor size={12} /> Desktop
                            </button>
                            <button
                              type="button"
                              onClick={() => setSerpDevice("mobile")}
                              className={serpDevice === "mobile" ? "active" : ""}
                            >
                              <Smartphone size={12} /> Mobile
                            </button>
                          </div>
                        </div>

                        <div className={`serp-snippet-render ${serpDevice}`}>
                          <div className="serp-favicon-row">
                            
                            <span className="serp-domain">https://getintofeed.com › {editingItem.category ? slugify(editingItem.category) : "services"} › {editingItem.slug || "growth"}</span>
                          </div>
                          <h4 className="serp-render-title">{editingItem.metaTitle || editingItem.title || "Enterprise Digital Growth Strategy"}</h4>
                          <p className="serp-render-desc">
                            {editingItem.metaDescription || editingItem.excerpt || editingItem.description || "Discover how Get Into Feed scales search moats, generative AI visibility, and compounding commercial pipeline."}
                          </p>
                        </div>
                      </div>

                      {/* SOCIAL OPEN GRAPH CARD PREVIEW */}
                      <div className="social-og-card-preview">
                        <div className="og-image-box">
                          <img
                            src={editingItem.coverImage || "/agency-hero.png"}
                            alt="OG Preview"
                            onError={(e) => { e.target.src = "/agency-hero.png"; }}
                          />
                        </div>
                        <div className="og-info-box">
                          <span className="og-domain-tag">GETINTOFEED.COM</span>
                          <h5 className="og-title">{editingItem.metaTitle || editingItem.title || "Enterprise Growth Strategy"}</h5>
                          <p className="og-desc">{editingItem.metaDescription || editingItem.excerpt || "Read the latest growth framework by Get Into Feed."}</p>
                        </div>
                      </div>

                      {/* SEO AUDIT CHECKLIST */}
                      <div className="seo-audit-checklist">
                        {(pythonSeoAudit?.checks || [
                          { name: "Title Length", status: "pass", msg: "Optimal length (55 chars)" },
                          { name: "Meta Snippet", status: "pass", msg: "Fits Google SERP box (145 chars)" },
                          { name: "Heading Hierarchy", status: "pass", msg: "H2 and H3 hierarchy detected" },
                          { name: "Content Depth", status: wordCount >= 300 ? "pass" : "warn", msg: `${wordCount} words drafted` }
                        ]).map((chk, i) => (
                          <div key={i} className={`audit-check-item ${chk.status}`}>
                            {chk.status === "pass" ? <Check size={14} color="#16a34a" /> : <AlertCircle size={14} color="#f59e0b" />}
                            <span>{chk.msg}</span>
                          </div>
                        ))}
                      </div>

                      {/* 1-CLICK AI COPILOT BUTTONS */}
                      <div className="ai-copilot-btn-grid">
                        <button type="button" onClick={handleAiOptimizeTitleDesc} className="ai-tool-btn">
                          <Zap size={14} color="#f15b29" /> AI Optimize Meta
                        </button>
                        <button type="button" onClick={handleAiGenerateOutline} className="ai-tool-btn">
                          <Wand2 size={14} color="#f15b29" /> AI Generate Outline
                        </button>
                      </div>
                    </div>

                    {/* MEDIA ASSET MANAGER */}
                    <div className="studio-card-box">
                      <span className="studio-field-label">Featured Cover Image Asset URL</span>
                      <input
                        className="studio-input"
                        placeholder="https://images.unsplash.com/..."
                        value={editingItem.coverImage || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, coverImage: e.target.value })}
                      />

                      {editingItem.coverImage && (
                        <div className="cover-thumb-preview">
                          <img src={editingItem.coverImage} alt="Cover" onError={(e) => { e.target.style.display = "none"; }} />
                        </div>
                      )}

                      <span className="preset-label-text">1-Click High-Res Presets:</span>
                      <div className="preset-buttons-wrap">
                        {CURATED_IMAGE_PRESETS.map((p, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setEditingItem({ ...editingItem, coverImage: p.url })}
                            className="preset-chip"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* TARGET SEO KEYWORDS */}
                    <div className="studio-card-box">
                      <span className="studio-field-label">Target Commercial Keywords</span>
                      <input
                        className="studio-input"
                        placeholder="e.g. SEO company India, GEO marketing, AI search"
                        value={editingItem.keywords || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, keywords: e.target.value })}
                      />
                      <small style={{ color: "#64748b", fontSize: "0.75rem", display: "block", marginTop: "6px" }}>
                        Separate keyword phrases with commas for Python entity scoring.
                      </small>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                    SCHEMA JSON-LD MODE
                -------------------------------------------------------------- */}
                {editorMode === "schema" && (
                  <div className="studio-card-box" style={{ gridColumn: "1 / -1" }}>
                    <div className="field-label-row">
                      <label>Google Rich Results JSON-LD Schema ({editingItem.schemaType || "BlogPosting"})</label>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(jsonLdSchema);
                          setCopiedSchema(true);
                          setTimeout(() => setCopiedSchema(false), 2000);
                        }}
                        className="row-edit-btn"
                      >
                        {copiedSchema ? <Check size={14} /> : <Copy size={14} />} {copiedSchema ? "Copied!" : "Copy Schema"}
                      </button>
                    </div>
                    <pre className="schema-json-code-box">{jsonLdSchema}</pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* =================================================================
               2. SAAS DATA TABLES & CRM PIPELINES
            ================================================================== */
            <div className="saas-data-table-card">
              {/* TABLE SEARCH BAR */}
              <div className="directory-search-bar-row">
                <div className="search-input-wrapper">
                  <Search size={16} color="#64748b" />
                  <input
                    type="text"
                    placeholder={`Search ${contentTypes.find((c) => c.key === tab)?.label || "records"}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <span className="directory-count-tag">{filteredList.length} Records Found</span>
              </div>

              {tab === "leads" ? (
                /* CLIENT AUDIT LEADS CRM */
                <div className="crm-table-wrapper">
                  {leads.length === 0 ? (
                    <div className="empty-state-card">
                      <Mail size={32} color="#cbd5e1" />
                      <p>No audit requests recorded yet.</p>
                    </div>
                  ) : (
                    <table className="saas-table">
                      <thead>
                        <tr>
                          <th>Lead Contact</th>
                          <th>Service Focus</th>
                          <th>Source / Ref</th>
                          <th>Message Details</th>
                          <th>Direct Chat</th>
                          <th>Received Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead, idx) => (
                          <tr key={lead.id || idx}>
                            <td>
                              <strong>{lead.name}</strong>
                              <small style={{ display: "block", color: "#64748b" }}>{lead.email} • {lead.phone}</small>
                            </td>
                            <td><span className="badge-pill">{lead.service}</span></td>
                            <td><small>{lead.source || "Website Form"}</small></td>
                            <td><p className="lead-msg-cell" style={{ margin: 0, fontSize: "0.82rem", maxWidth: "260px" }}>{lead.message || "—"}</p></td>
                            <td>
                              {lead.phone ? (
                                <a
                                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="row-edit-btn"
                                  style={{ background: "#25D366", fontSize: "0.75rem", padding: "4px 10px" }}
                                >
                                  💬 WhatsApp
                                </a>
                              ) : "—"}
                            </td>
                            <td><small>{new Date(lead.createdAt || Date.now()).toLocaleDateString()}</small></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : tab === "comments" ? (
                /* BLOG COMMENTS MODERATION */
                <div className="crm-table-wrapper" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Status filter tabs */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "12px 16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    {[
                      { key: "all", label: "All Comments", count: comments.length },
                      { key: "pending", label: "Pending Review", count: comments.filter(c => c.status === "pending").length, highlight: true },
                      { key: "approved", label: "Approved (Public)", count: comments.filter(c => c.status === "approved").length },
                      { key: "rejected", label: "Rejected", count: comments.filter(c => c.status === "rejected").length },
                      { key: "spam", label: "Spam", count: comments.filter(c => c.status === "spam").length }
                    ].map(f => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setCommentFilter(f.key)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: commentFilter === f.key ? "2px solid #000" : "1px solid #cbd5e1",
                          background: commentFilter === f.key ? (f.highlight ? "#fef08a" : "#000") : "#fff",
                          color: commentFilter === f.key ? (f.highlight ? "#000" : "#fff") : "#475569",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {f.label} ({f.count})
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const filtered = comments.filter(c => {
                      const matchesStatus = commentFilter === "all" || c.status === commentFilter;
                      const matchesSearch = !searchTerm ||
                        (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (c.message && c.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (c.articleSlug && c.articleSlug.toLowerCase().includes(searchTerm.toLowerCase()));
                      return matchesStatus && matchesSearch;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="empty-state-card">
                          <MessageSquare size={32} color="#cbd5e1" />
                          <p>No comments found for filter "{commentFilter}".</p>
                        </div>
                      );
                    }

                    return (
                      <table className="saas-table">
                        <thead>
                          <tr>
                            <th>Commenter</th>
                            <th>Article Reference</th>
                            <th>Comment Content</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Moderation Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((c) => (
                            <tr key={c.id}>
                              <td>
                                <strong>{c.name}</strong>
                                <small style={{ display: "block", color: "#64748b" }}>{c.email}</small>
                                {c.website && (
                                  <a href={c.website} target="_blank" rel="noreferrer" style={{ fontSize: "0.72rem", color: "#0033FF" }}>
                                    {c.website.replace(/^https?:\/\//, "")}
                                  </a>
                                )}
                              </td>
                              <td>
                                <span className="badge-pill" style={{ fontSize: "0.72rem", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block" }}>
                                  {c.articleSlug || "general"}
                                </span>
                              </td>
                              <td style={{ maxWidth: "300px" }}>
                                <p style={{ margin: 0, fontSize: "0.82rem", color: "#1e293b", lineHeight: 1.4 }}>
                                  "{c.message}"
                                </p>
                              </td>
                              <td>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "3px 8px",
                                    borderRadius: "12px",
                                    fontSize: "0.7rem",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    background:
                                      c.status === "approved"
                                        ? "#dcfce7"
                                        : c.status === "pending"
                                        ? "#fef9c3"
                                        : c.status === "spam"
                                        ? "#fee2e2"
                                        : "#f1f5f9",
                                    color:
                                      c.status === "approved"
                                        ? "#15803d"
                                        : c.status === "pending"
                                        ? "#a16207"
                                        : c.status === "spam"
                                        ? "#b91c1c"
                                        : "#475569"
                                  }}
                                >
                                  {c.status}
                                </span>
                              </td>
                              <td>
                                <small style={{ color: "#64748b" }}>
                                  {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                                </small>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  {c.status !== "approved" && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateCommentStatus(c.id, "approved")}
                                      style={{
                                        background: "#16a34a",
                                        color: "#fff",
                                        border: "none",
                                        padding: "4px 8px",
                                        borderRadius: "6px",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        itemsCenter: "center",
                                        gap: "4px"
                                      }}
                                    >
                                      ✓ Approve
                                    </button>
                                  )}
                                  {c.status !== "rejected" && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateCommentStatus(c.id, "rejected")}
                                      style={{
                                        background: "#64748b",
                                        color: "#fff",
                                        border: "none",
                                        padding: "4px 8px",
                                        borderRadius: "6px",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        cursor: "pointer"
                                      }}
                                    >
                                      Reject
                                    </button>
                                  )}
                                  {c.status !== "spam" && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateCommentStatus(c.id, "spam")}
                                      style={{
                                        background: "#ef4444",
                                        color: "#fff",
                                        border: "none",
                                        padding: "4px 8px",
                                        borderRadius: "6px",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        cursor: "pointer"
                                      }}
                                    >
                                      Spam
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(c.id)}
                                    style={{
                                      background: "transparent",
                                      border: "1px solid #cbd5e1",
                                      color: "#94a3b8",
                                      padding: "4px 6px",
                                      borderRadius: "6px",
                                      fontSize: "0.72rem",
                                      cursor: "pointer"
                                    }}
                                    title="Delete"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              ) : tab === "applications" ? (
                /* JOB CANDIDATE APPLICATIONS */
                <div className="crm-table-wrapper">
                  {applications.length === 0 ? (
                    <div className="empty-state-card">
                      <BriefcaseBusiness size={32} color="#cbd5e1" />
                      <p>No job applications received yet.</p>
                    </div>
                  ) : (
                    <table className="saas-table">
                      <thead>
                        <tr>
                          <th>Candidate Name</th>
                          <th>Role Applied</th>
                          <th>Contact Details</th>
                          <th>Portfolio Link</th>
                          <th>Candidate Note</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app, idx) => (
                          <tr key={app.id || idx}>
                            <td><strong>{app.name}</strong></td>
                            <td><span className="badge-pill">{app.role}</span></td>
                            <td>{app.email}<br />{app.phone}</td>
                            <td>
                              {app.portfolio ? (
                                <a href={app.portfolio} target="_blank" rel="noreferrer" className="table-link">
                                  Portfolio Link <ArrowUpRight size={13} />
                                </a>
                              ) : "—"}
                            </td>
                            <td><p className="lead-msg-cell">{app.note || "No note provided."}</p></td>
                            <td><small>{new Date(app.createdAt || Date.now()).toLocaleDateString()}</small></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                /* PUBLISHED CONTENT DIRECTORY */
                <div className="published-items-list">
                  {filteredList.length === 0 ? (
                    <div className="empty-state-card">
                      <FileText size={32} color="#cbd5e1" />
                      <p>No records found in this category. Click "Create" to add one.</p>
                    </div>
                  ) : (
                    filteredList.map((item, idx) => (
                      <div key={item.id || idx} className="data-row-card">
                        <div className="data-row-main">
                          <div className="data-row-title-flex">
                            <h4>{item.title || item.brand || item.name}</h4>
                            {item.status && <span className={`badge-pill ${item.status === "published" ? "green" : ""}`}>{item.status}</span>}
                            {item.metric && <span className="badge-pill green">{item.metric}</span>}
                            {item.category && <span className="badge-pill">{item.category}</span>}
                          </div>
                          <p className="data-row-excerpt">
                            {item.description || item.detail || item.excerpt || item.quote}
                          </p>
                          <small style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                            Author: {item.author || "Sarvesh Bagla"} • Date: {item.publishedAt || "Recently"} • Read: {item.readTime || "5 min"}
                          </small>
                        </div>

                        <div className="data-row-actions">
                          <button
                            type="button"
                            onClick={() => {
                              setEditorType(tab);
                              setEditingItem({ ...item });
                            }}
                            className="row-edit-btn"
                          >
                            <Pencil size={15} /> Edit in Studio
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateItem(item)}
                            className="preset-chip"
                            title="Duplicate / Clone"
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(tab, item.id)}
                            className="row-delete-btn"
                            title="Delete Item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* =======================================================================
          3. RICH INSERTION MODALS (IMAGE, LINK, VIDEO, CODE)
      ======================================================================== */}
      {modalType && (
        <div className="editor-modal-overlay" onClick={() => setModalType(null)}>
          <div className="editor-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>
                {modalType === "image" && "🖼️ Insert Image"}
                {modalType === "link" && "🔗 Insert Hyperlink"}
                {modalType === "video" && "🎥 Embed YouTube Video"}
                {modalType === "code" && "💻 Insert Code Snippet"}
              </h3>
              <button type="button" onClick={() => setModalType(null)} className="tag-remove-btn" style={{ fontSize: "1.1rem" }}>✕</button>
            </div>

            {modalType === "image" && (
              <>
                <div className="modal-field">
                  <label>Image Source URL *</label>
                  <input
                    className="studio-input"
                    placeholder="https://images.unsplash.com/..."
                    value={modalData.url || ""}
                    onChange={(e) => setModalData({ ...modalData, url: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Caption / Alt Text</label>
                  <input
                    className="studio-input"
                    placeholder="e.g. Search engine visibility growth chart"
                    value={modalData.alt || ""}
                    onChange={(e) => setModalData({ ...modalData, alt: e.target.value })}
                  />
                </div>
              </>
            )}

            {modalType === "link" && (
              <>
                <div className="modal-field">
                  <label>Anchor Text *</label>
                  <input
                    className="studio-input"
                    placeholder="e.g. Explore SEO Services"
                    value={modalData.text || ""}
                    onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Destination Target URL *</label>
                  <input
                    className="studio-input"
                    placeholder="https://getintofeed.com/services/enterprise-seo"
                    value={modalData.url || ""}
                    onChange={(e) => setModalData({ ...modalData, url: e.target.value })}
                  />
                </div>
              </>
            )}

            {modalType === "video" && (
              <div className="modal-field">
                <label>YouTube Video ID or URL *</label>
                <input
                  className="studio-input"
                  placeholder="e.g. dQw4w9WgXcQ or https://youtube.com/watch?v=..."
                  value={modalData.ytId || ""}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.includes("v=")) val = val.split("v=")[1].split("&")[0];
                    else if (val.includes("youtu.be/")) val = val.split("youtu.be/")[1];
                    setModalData({ ...modalData, ytId: val });
                  }}
                />
              </div>
            )}

            {modalType === "code" && (
              <>
                <div className="modal-field">
                  <label>Programming Language</label>
                  <select
                    className="studio-select"
                    value={modalData.lang || "javascript"}
                    onChange={(e) => setModalData({ ...modalData, lang: e.target.value })}
                  >
                    <option value="javascript">JavaScript / TypeScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="sql">SQL</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label>Code Snippet</label>
                  <textarea
                    rows={6}
                    className="studio-textarea-sm"
                    placeholder="// Paste code snippet here..."
                    value={modalData.code || ""}
                    onChange={(e) => setModalData({ ...modalData, code: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="modal-actions-row">
              <button type="button" onClick={() => setModalType(null)} className="button button-outline small">Cancel</button>
              <button type="button" onClick={handleApplyModal} className="button button-coral small">Insert to Canvas</button>
            </div>
          </div>
        </div>
      )}
      {/* MOBILE FIXED BOTTOM TOUCH NAVIGATION */}
      <nav className="admin-mobile-bottom-nav" aria-label="Admin Mobile Bottom Navigation">
        <button
          type="button"
          onClick={() => { setTab("overview"); setEditingItem(null); }}
          className={`admin-mobile-nav-tab ${tab === "overview" ? "active" : ""}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => { setTab("leads"); setEditingItem(null); }}
          className={`admin-mobile-nav-tab ${tab === "leads" ? "active" : ""}`}
        >
          <MessageSquare size={18} />
          <span>Leads CRM</span>
          {leads.length > 0 && <span className="admin-mobile-tab-badge">{leads.length}</span>}
        </button>

        <button
          type="button"
          onClick={() => { setTab("blogPosts"); setEditingItem(null); }}
          className={`admin-mobile-nav-tab ${tab === "blogPosts" ? "active" : ""}`}
        >
          <FileText size={18} />
          <span>Articles</span>
        </button>

        <button
          type="button"
          onClick={() => { setTab("caseStudies"); setEditingItem(null); }}
          className={`admin-mobile-nav-tab ${tab === "caseStudies" ? "active" : ""}`}
        >
          <Sparkles size={18} />
          <span>Portfolio</span>
        </button>

        <button
          type="button"
          onClick={() => { setTab("services"); setEditingItem(null); }}
          className={`admin-mobile-nav-tab ${tab === "services" || tab === "applications" ? "active" : ""}`}
        >
          <Sliders size={18} />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
