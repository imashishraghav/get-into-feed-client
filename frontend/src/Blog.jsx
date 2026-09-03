import React, { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft, ArrowRight, Bookmark, CalendarDays, Check, CheckCircle2, Clock3, Eye, Flame, Heart, Linkedin, MessageCircle, MessageSquare, Search, Send, Share2, Sparkles, Tag, TrendingUp, Twitter, User, Zap
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

export const defaultBlogPosts = [
  {
    id: "blog-1",
    slug: "enterprise-seo-ai-overviews-geo-playbook",
    title: "The 2026 Enterprise SEO Playbook: Dominating AI Overviews, ChatGPT & Gemini Search (GEO)",
    category: "AI & GEO Search",
    author: {
      name: "Rahul Saxena",
      role: "VP of Search Architecture",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    publishedAt: "2026-08-20T09:00:00.000Z",
    readTime: "8 min read",
    featured: true,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    excerpt: "How modern enterprise brands are restructuring schema topologies, building topical authority moats, and earning primary citation status in AI answer engines.",
    content: `### The Seismic Shift from Blue Links to AI Synthesis

Search behavior has undergone its most dramatic transformation since the inception of PageRank. With Google AI Overviews capturing zero-click real estate and conversational engines like ChatGPT and Gemini handling millions of commercial discovery queries daily, traditional keyword stuffing is dead.

To thrive in 2026, enterprise growth leaders must transition from standard SEO to **Generative Engine Optimization (GEO)**.

---

### Key Pillars of Generative Engine Optimization (GEO)

1. **Entity Graph Structuring**: Connect your brand's core domain entities via JSON-LD Schema (Organization, Product, ItemList, FAQPage, MedicalEntity/FinancialService).
2. **First-Party Empirical Data**: AI models heavily favor original research, benchmark reports, and proprietary statistics that cannot be synthesized from common web scrapers.
3. **Structured Quotation Topology**: Write concise, authoritative definitions (40-60 words) under H2/H3 headers so LLMs can cleanly excerpt and cite your domain as the primary source.
4. **Author Authority & E-E-A-T Signals**: Establish verified author entity profiles across Wikidata, LinkedIn, and tier-1 digital PR publications.

---

### The 4-Step GEO Implementation Framework

- **Step 1: Technical Knowledge Base Audit**: Ensure all canonical URLs, schema trees, and server-rendered HTML payloads load in under 600ms without JavaScript hydration bottlenecks.
- **Step 2: Programmatic Commercial Keyword Hubs**: Group queries into semantic clusters rather than isolated long-tail targets.
- **Step 3: Direct Answer Engineering**: Embed comparative tables, pros/cons breakdowns, and structured summaries at the top of high-intent service pages.
- **Step 4: Real-Time LLM Telemetry**: Monitor brand citation frequency across ChatGPT, Perplexity, and Google Gemini using server log query analysis.

---

### Conclusion: Future-Proofing Your Search Pipeline

Brands that act early to establish entity authority and original benchmark data will build compounding search moats that algorithms cannot easily replicate. Get Into Feed's growth engineers specialize in designing bespoke GEO architectures for category leaders.`
  },
  {
    id: "blog-2",
    slug: "scaling-d2c-meta-ads-ugc-creative-sprints",
    title: "Scaling D2C Meta Ads from ₹10L to ₹1Cr/Month: The 3-Tier UGC Creative Sprints Framework",
    category: "Performance Paid Media",
    author: {
      name: "Pooja Malhotra",
      role: "Head of Growth Media",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
    },
    publishedAt: "2026-08-18T11:30:00.000Z",
    readTime: "6 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80",
    excerpt: "A tactical breakdown of creative angle testing, creator whitelisting, dynamic retargeting, and server-side CAPI modeling to achieve 4.8x blended ROAS.",
    content: `### Why Most Meta Ad Accounts Stall at Scale

Scaling Meta ad spend past ₹10 Lakhs/month inevitably triggers creative fatigue, audience saturation, and soaring customer acquisition costs (CAC). Traditional media buying tactics alone cannot fix an ad account starved of fresh creative angles.

To scale profitably to ₹1 Crore+ monthly spend, high-growth D2C brands deploy a **3-Tier Creative Sprint Architecture**.

---

### The 3-Tier Creative Sprint Architecture

1. **Tier 1: High-Volume Hook Testing (Top of Funnel)**:
   - Produce 12-16 creator hooks weekly focusing on problem-agitation, before/after transformations, and unboxing reviews.
   - Run dynamic creative testing (DCT) with 3 hooks, 2 bodies, and 2 CTAs per ad set.

2. **Tier 2: Winner Iteration & Scaling (Middle of Funnel)**:
   - Identify top 5% winning creative concepts and iterate with different background music, text overlay styling, and localized regional languages (Hindi, Tamil, Marathi).
   - Scale budget horizontally with Advantage+ Shopping Campaigns (ASC).

3. **Tier 3: Server-Side Meta Conversions API (CAPI)**:
   - Deploy server-side event tracking to recover 25-35% of lost attribution signals caused by iOS privacy updates and ad blockers.
   - Feed high-value purchase data back into Meta's AI bidding algorithms.

---

### The Unit Economics Formula for 4.8x ROAS

By pairing weekly creative sprints with sub-second React landing pages, brands consistently observe:
- **-38% CAC Reduction**
- **+45% Average Order Value (AOV)** via smart 1-click upsells
- **2.8x Higher LTV** driven by automated WhatsApp retention funnels.`
  },
  {
    id: "blog-3",
    slug: "programmatic-seo-architecture-bfsi-growth",
    title: "How Programmatic SEO Architecture Unlocked 340% Inbound Loan Applications in BFSI",
    category: "Enterprise SEO",
    author: {
      name: "Vikramaditya Mehta",
      role: "Chief Strategy Officer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    publishedAt: "2026-08-15T14:15:00.000Z",
    readTime: "7 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Engineering 450+ programmatic high-intent keyword hubs around financial calculators and city-level eligibility to dominate organic search.",
    content: `### The Problem with Traditional BFSI SEO

In highly competitive financial verticals like personal loans, home mortgages, and MSME business credit, bidding on broad search keywords via PPC results in exorbitant CPAs often exceeding ₹2,500 per lead.

To achieve sustainable customer acquisition economics, we deployed an **Automated Programmatic SEO Architecture** across 450+ semantic search hubs.

---

### Anatomy of a High-Converting Programmatic Financial Hub

- **Dynamic Interactive Calculators**: Real-time EMI sliders built with lightweight React components that provide instant customized quotes.
- **Localized Regulatory Disclosures**: Automated RBI-compliant interest rate ranges and eligibility tables tailored to 50+ tier-1 and tier-2 Indian cities.
- **Server-Side Rendered (SSR) Clean HTML**: Sub-second page loads ensuring zero cumulative layout shift (CLS = 0) and 98+ mobile PageSpeed scores.
- **Internal Knowledge Graph Linking**: Hub-and-spoke link architecture routing authority from high-tier financial PR backlinks directly to high-intent calculator pages.

---

### The Impact

Within 120 days of deployment:
- **+340% surge in verified inbound loan applications**
- **-46% reduction in overall blended CAC**
- **#1 organic Google rankings for 180+ commercial loan queries**.`
  },
  {
    id: "blog-4",
    slug: "sub-second-react-core-web-vitals-cro-guide",
    title: "Sub-Second React & Next.js Core Web Vitals: Turning Mobile Visitors into High-LTV Customers",
    category: "CRO & Web Experience",
    author: {
      name: "Aman Singhal",
      role: "Lead Web Architect",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
    },
    publishedAt: "2026-08-12T16:45:00.000Z",
    readTime: "5 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    excerpt: "How reducing mobile Largest Contentful Paint (LCP) to under 800ms directly lifts ad conversion rates by +42% across Indian telecom networks.",
    content: `### Speed is Revenue: The 100ms Truth

Every 100ms of latency on mobile landing pages causes a 7% drop in conversion rate. When running multi-crore paid media campaigns on Meta and Google, slow bloated page builders silently burn up to 40% of your advertising budget before visitors even view your offer.

---

### Engineering Sub-Second Performance

1. **Zero-JavaScript Hydration Waste**: Eliminate heavy third-party tracking scripts from blocking the main browser thread.
2. **Modern Image Formats**: Serve responsive WebP and AVIF assets with exact aspect ratios and preloaded hero banners.
3. **Edge Server Caching**: Distribute static HTML assets across regional Indian CDN nodes in Mumbai, Delhi, and Chennai.
4. **Friction-Free WhatsApp Checkout**: Replace multi-step forms with 1-click pre-filled WhatsApp conversion funnels.

---

### Benchmarked Outcomes

Brands switching to our headless React architecture experience an immediate 95+ Google PageSpeed score and an average **+42% increase in paid landing page conversion rate**.`
  },
  {
    id: "blog-5",
    slug: "server-side-gtm-meta-capi-attribution-2026",
    title: "Server-Side GTM & Meta CAPI: Overcoming Ad-Blockers and Signal Loss in 2026",
    category: "Data & Analytics",
    author: {
      name: "Rahul Saxena",
      role: "VP of Search Architecture",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    publishedAt: "2026-08-10T10:00:00.000Z",
    readTime: "6 min read",
    featured: false,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    excerpt: "A comprehensive guide to deploying Server-Side Google Tag Manager (sGTM) to restore lost conversion data and optimize smart bidding algorithms.",
    content: `### The Hidden Cost of Client-Side Tracking Loss

With browser tracking protections (ITP), ad blockers, and cookie expiration restrictions, standard browser-based tracking pixels lose between 20% and 35% of all conversion events.

When ad platforms like Google Ads and Meta receive incomplete signal telemetry, their machine learning bidding algorithms misallocate spend, inflating your Cost Per Acquisition (CPA).

---

### The Solution: Server-Side Tagging Architecture

By routing events through a first-party cloud server endpoint (e.g. 'data.yourbrand.com'), you gain:
- **100% Signal Recovery**: Bypass browser extensions and privacy blocks legally under first-party data consent.
- **Enhanced Data Security**: Scrub sensitive user PII before transmitting event data to third-party ad networks.
- **Faster Page Load Speed**: Move heavy JavaScript SDKs off the user's mobile device and onto high-speed cloud instances.

---

### Implementing Server-Side Meta CAPI with Get Into Feed

Our data engineering team deploys turnkey sGTM and Meta Conversions API integrations with real-time deduplication, event quality scoring (>8.5/10), and Looker Studio executive telemetry.`
  }
];

function formatDate(value) {
  if (!value) return "Latest insight";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function ShareRow({ post }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? "https://getintofeed.com/blog/" + post.slug : window.location.href;
  const shareText = encodeURIComponent(`${post.title} — Get Into Feed`);

  const copy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${post.title} - ${url}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(url)}`;

  return (
    <div className="share-row-wrap">
      <span className="share-label">Share article:</span>
      <div className="share-btn-group">
        <button
          type="button"
          className="share-icon-btn"
          onClick={copy}
          title="Copy Link"
          aria-label="Copy Link"
        >
          {copied ? <Check size={15} color="#16a34a" /> : <Share2 size={15} />}
        </button>

        <a
          className="share-icon-btn whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          title="Share on WhatsApp"
        >
          <Send size={14} />
        </a>

        <a
          className="share-icon-btn linkedin"
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          title="Share on LinkedIn"
        >
          <Linkedin size={14} />
        </a>

        <a
          className="share-icon-btn twitter"
          href={twitterUrl}
          target="_blank"
          rel="noreferrer"
          title="Share on Twitter"
        >
          <Twitter size={14} />
        </a>

        {copied && <span className="copied-pill">Link Copied!</span>}
      </div>
    </div>
  );
}

function BlogEngagement({ post }) {
  const localLikeKey = `gif_liked_${post.slug}`;
  const localCommentsKey = `gif_comments_${post.slug}`;

  const [likes, setLikes] = useState(() => {
    try {
      return Number(localStorage.getItem(`gif_like_count_${post.slug}`)) || 14;
    } catch {
      return 14;
    }
  });

  const [liked, setLiked] = useState(() => {
    try {
      return localStorage.getItem(localLikeKey) === "true";
    } catch {
      return false;
    }
  });

  const [comments, setComments] = useState(() => {
    try {
      const stored = localStorage.getItem(localCommentsKey);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: "c-1",
        name: "Vikramaditya Mehta",
        message: "Practical breakdown. Structuring landing pages by entity intent cut our bounce rate significantly.",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: "c-2",
        name: "Neha Nair",
        message: "The point about weekly creative angle testing and ASC scaling is spot on. Helpful notes from the team!",
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  });

  const [form, setForm] = useState({ name: "", message: "" });
  const [status, setStatus] = useState({ state: "", message: "" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/api/blog/${post.slug}/engagement`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.likes) setLikes(data.likes);
        if (Array.isArray(data.comments) && data.comments.length > 0) {
          setComments(data.comments);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, [post.slug]);

  const handleLike = async () => {
    if (liked) return;
    const next = likes + 1;
    setLikes(next);
    setLiked(true);

    try {
      localStorage.setItem(localLikeKey, "true");
      localStorage.setItem(`gif_like_count_${post.slug}`, String(next));
    } catch {}

    try {
      await fetch(`${API_URL}/api/blog/${post.slug}/likes`, { method: "POST" });
    } catch {}
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    setStatus({ state: "loading", message: "Posting your comment..." });

    const newComment = {
      id: "c-" + Date.now(),
      name: form.name.trim(),
      message: form.message.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    setForm({ name: "", message: "" });
    setStatus({ state: "success", message: "Your comment is now live!" });

    try {
      localStorage.setItem(localCommentsKey, JSON.stringify(updated));
    } catch {}

    try {
      await fetch(`${API_URL}/api/blog/${post.slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newComment.name, message: newComment.message })
      });
    } catch {}
  };

  return (
    <section className="blog-engagement-section">
      <div className="engagement-header-bar">
        <button
          type="button"
          className={`like-action-pill ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <Heart size={18} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#64748b"} />
          <span>{likes} {likes === 1 ? "Appreciation" : "Appreciations"}</span>
        </button>

        <ShareRow post={post} />
      </div>

      <div className="comments-box-wrapper">
        <div className="comments-header">
          <MessageCircle size={20} color="#0284c7" />
          <h3>Join the Executive Discussion ({comments.length})</h3>
        </div>

        <form onSubmit={handleCommentSubmit} className="article-comment-form">
          <div className="form-row-author">
            <input
              required
              placeholder="Your Full Name & Designation *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="comment-input"
            />
          </div>

          <textarea
            required
            rows={3}
            placeholder="Share your practical growth experience or ask a question..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="comment-textarea"
          />

          <div className="comment-submit-row">
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={status.state === "loading"}
            >
              {status.state === "loading" ? "Posting..." : "Post Comment"} <Send size={14} />
            </button>

            {status.message && (
              <span className={`comment-status-msg ${status.state}`}>
                {status.message}
              </span>
            )}
          </div>
        </form>

        <div className="comment-thread-list">
          {comments.map((item) => (
            <article key={item.id} className="comment-bubble">
              <header className="comment-bubble-header">
                <div className="author-avatar-chip">
                  <User size={14} />
                </div>
                <strong>{item.name}</strong>
                <time>{formatDate(item.createdAt)}</time>
              </header>
              <p>{item.message}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 1. EDITORIAL BLOG HUB PAGE (/blog)
// -----------------------------------------------------------------------------
export function BlogPage({ posts = [], onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const combinedPosts = useMemo(() => {
    if (posts && posts.length > 0) {
      // Merge with default posts to ensure full rich library
      const existingSlugs = new Set(posts.map((p) => p.slug));
      const filteredDefaults = defaultBlogPosts.filter((d) => !existingSlugs.has(d.slug));
      return [...posts, ...filteredDefaults];
    }
    return defaultBlogPosts;
  }, [posts]);

  const categories = ["All", "AI & GEO Search", "Enterprise SEO", "Performance Paid Media", "CRO & Web Experience", "Data & Analytics"];

  const filteredPosts = useMemo(() => {
    return combinedPosts.filter((post) => {
      const matchCat = activeCategory === "All" || post.category === activeCategory;
      const matchSearch =
        !searchTerm.trim() ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.category || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [combinedPosts, activeCategory, searchTerm]);

  const featuredPost = combinedPosts.find((p) => p.featured) || combinedPosts[0];
  const gridPosts = filteredPosts.filter((p) => p.slug !== (activeCategory === "All" && !searchTerm ? featuredPost.slug : ""));

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
  };

  return (
    <div className="blog-hub-full-view">
      {/* 1. HERO SECTION */}
      <section className="blog-hub-hero-section">
        <div className="blog-hero-container">
          <div className="blog-hero-kicker-badge">
            <Sparkles size={14} color="#f59e0b" />
            <span>📚 THE GROWTH CODEX • 2026 PLAYBOOKS & FRAMEWORKS</span>
          </div>

          <h1>Actionable Growth Playbooks for Modern Marketers</h1>

          <p className="blog-hero-subtext">
            Original research, enterprise SEO architectures, paid media scaling frameworks, and generative AI search (GEO) playbooks written direct by our growth engineers.
          </p>

          {/* SEARCH & FILTER BAR */}
          <div className="blog-hero-search-wrap">
            <div className="blog-search-input-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search playbooks on SEO, AI Search, Meta Ads, Core Web Vitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm("")} className="clear-search-btn">
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="blog-category-pills-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`blog-cat-pill ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="blog-body-container">
        {/* 2. FEATURED MARQUEE POST (WHEN ON ALL & NO SEARCH) */}
        {activeCategory === "All" && !searchTerm && featuredPost && (
          <section className="blog-featured-marquee-section">
            <div className="featured-blog-card" onClick={() => onNavigate(`/blog/${featuredPost.slug}`)}>
              <div className="featured-blog-img-wrap">
                <img
                  src={featuredPost.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"}
                  alt={featuredPost.title}
                />
                <span className="featured-tag-badge">🔥 FEATURED PLAYBOOK</span>
              </div>

              <div className="featured-blog-content">
                <div className="featured-blog-meta-top">
                  <span className="cat-badge">{featuredPost.category || "AI & GEO Search"}</span>
                  <span className="read-time"><Clock3 size={13} /> {featuredPost.readTime || "8 min read"}</span>
                </div>

                <h2>{featuredPost.title}</h2>
                <p className="featured-blog-excerpt">{featuredPost.excerpt}</p>

                <div className="featured-blog-author-row">
                  <div className="author-info">
                    <img
                      src={featuredPost.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                      alt={featuredPost.author?.name || "Author"}
                      className="author-img"
                    />
                    <div>
                      <strong>{featuredPost.author?.name || "Growth Strategist"}</strong>
                      <small>{formatDate(featuredPost.publishedAt)}</small>
                    </div>
                  </div>

                  <span className="read-article-action">
                    Read Playbook <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. MAIN BLOG ARTICLES GRID */}
        <section className="blog-articles-grid-section">
          <div className="grid-header-row">
            <h2>
              {activeCategory === "All" ? "Latest Editorial Playbooks" : `${activeCategory} Articles`}
            </h2>
            <span className="count-pill">{filteredPosts.length} Playbooks</span>
          </div>

          {gridPosts.length > 0 ? (
            <div className="blog-cards-triplet-grid">
              {gridPosts.map((post) => (
                <article
                  key={post.id || post.slug}
                  className="blog-card-item"
                  onClick={() => onNavigate(`/blog/${post.slug}`)}
                >
                  <div className="blog-card-img-wrap">
                    <img
                      src={post.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"}
                      alt={post.title}
                      loading="lazy"
                    />
                    <span className="blog-card-cat-tag">{post.category || "Insights"}</span>
                  </div>

                  <div className="blog-card-body">
                    <div className="blog-card-submeta">
                      <span><CalendarDays size={13} /> {formatDate(post.publishedAt)}</span>
                      <span><Clock3 size={13} /> {post.readTime || "6 min read"}</span>
                    </div>

                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>

                    <div className="blog-card-footer">
                      <div className="card-author">
                        <img
                          src={post.author?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                          alt={post.author?.name || "Author"}
                        />
                        <span>{post.author?.name || "Growth Lead"}</span>
                      </div>

                      <span className="card-read-link">
                        Read <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="blog-empty-state">
              <Search size={36} color="#94a3b8" />
              <h3>No playbooks found for "{searchTerm}"</h3>
              <p>Try searching for different keywords or reset your filters.</p>
              <button
                type="button"
                onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
                className="reset-filters-btn"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* 4. NEWSLETTER SUBSCRIPTION CARD */}
        <section className="blog-newsletter-banner">
          <div className="newsletter-content-col">
            <span className="nl-kicker">WEEKLY GROWTH DISPATCH</span>
            <h3>Get Proven Marketing Frameworks in Your Inbox</h3>
            <p>Join 8,500+ founders, CMOs, and growth marketers receiving our weekly breakdown on AI Search, PPC scaling, and revenue attribution.</p>
          </div>

          <div className="newsletter-form-col">
            {newsletterSubscribed ? (
              <div className="nl-success-box">
                <CheckCircle2 size={24} color="#16a34a" />
                <span>You're subscribed! Check your inbox for our 2026 Growth Bible.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="nl-form-row">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit">Subscribe Free →</button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2. FULL ARTICLE PAGE VIEW (/blog/:slug)
// -----------------------------------------------------------------------------
export function BlogArticle({ post, posts = [], onNavigate }) {
  if (!post) {
    // Fallback lookup in default posts
    post = defaultBlogPosts[0];
  }

  const allArticles = posts.length > 0 ? posts : defaultBlogPosts;
  const recentPosts = allArticles.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="blog-article-full-page-view">
      {/* 1. ARTICLE HERO HEADER */}
      <section className="article-hero-header-section">
        <div className="article-hero-container">
          <button
            type="button"
            className="article-back-nav-btn"
            onClick={() => onNavigate("/blog")}
          >
            <ArrowLeft size={16} /> Back to Growth Playbooks
          </button>

          <div className="article-meta-badges-row">
            <span className="article-category-badge">{post.category || "Growth Playbook"}</span>
            <span className="meta-item"><CalendarDays size={14} /> {formatDate(post.publishedAt)}</span>
            <span className="meta-item"><Clock3 size={14} /> {post.readTime || "7 min read"}</span>
          </div>

          <h1>{post.title}</h1>

          {/* AUTHOR BYLINE */}
          <div className="article-author-byline">
            <img
              src={post.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
              alt={post.author?.name || "Author"}
              className="author-avatar-img"
            />
            <div className="author-details-text">
              <strong>{post.author?.name || "Growth Engineering Team"}</strong>
              <small>{post.author?.role || "Get Into Feed Media Pvt. Ltd."}</small>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ARTICLE READING CONTAINER WITH 2-COLUMN SPLIT */}
      <div className="article-reading-container">
        <div className="article-split-layout">
          {/* MAIN ARTICLE COLUMN */}
          <div className="article-main-body-col">
            {/* FEATURED BANNER IMAGE */}
            {post.image && (
              <div className="article-featured-media-box">
                <img src={post.image} alt={post.title} />
              </div>
            )}

            {/* KEY TAKEAWAYS BOX */}
            <div className="article-takeaways-callout">
              <div className="takeaway-title">
                <Sparkles size={16} color="#0284c7" />
                <strong>Executive Summary & Key Takeaways</strong>
              </div>
              <p>{post.excerpt}</p>
            </div>

            {/* ARTICLE CONTENT */}
            <div className="article-prose-content">
              {String(post.content || "")
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph, idx) => {
                  if (paragraph.startsWith("### ")) {
                    return <h3 key={idx}>{paragraph.replace("### ", "")}</h3>;
                  }
                  if (paragraph.startsWith("## ")) {
                    return <h2 key={idx}>{paragraph.replace("## ", "")}</h2>;
                  }
                  if (paragraph.startsWith("---")) {
                    return <hr key={idx} />;
                  }
                  if (paragraph.startsWith("- ") || paragraph.startsWith("1. ")) {
                    const items = paragraph.split("\n").filter(Boolean);
                    return (
                      <ul key={idx} className="prose-bullet-list">
                        {items.map((it, j) => (
                          <li key={j}>{it.replace(/^[-*\d.]\s*/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
            </div>

            {/* ENGAGEMENT & COMMENTS */}
            <BlogEngagement post={post} />
          </div>

          {/* RIGHT STICKY SIDEBAR */}
          <aside className="article-sticky-sidebar-col">
            {/* 360 AUDIT CTA CARD */}
            <div className="article-audit-sidebar-card">
              <span className="sidebar-pill">FREE STRATEGY AUDIT</span>
              <h4>Scale Your Brand with Get Into Feed</h4>
              <p>Get a custom 360° AI Search & Performance audit tailored for your vertical within 24 hours.</p>
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="sidebar-orange-btn"
              >
                Claim Free Growth Audit →
              </button>
            </div>

            {/* AUTHOR PROFILE CARD */}
            <div className="article-author-sidebar-card">
              <div className="author-card-top">
                <img
                  src={post.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                  alt={post.author?.name || "Author"}
                />
                <div>
                  <strong>{post.author?.name || "Growth Strategist"}</strong>
                  <small>{post.author?.role || "Search & Paid Media"}</small>
                </div>
              </div>
              <p>Senior growth architect at Get Into Feed engineering programmatic search moats, GEO visibility, and full-funnel paid acquisition.</p>
            </div>

            {/* RELATED PLAYBOOKS LIST */}
            <div className="article-trending-sidebar-card">
              <h4>Related Growth Playbooks</h4>
              <div className="trending-links-list">
                {recentPosts.map((r) => (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => onNavigate(`/blog/${r.slug}`)}
                    className="trending-item-link"
                  >
                    <strong>{r.title}</strong>
                    <small>{r.readTime || "5 min read"}</small>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 3. RECENT POSTS 3-COLUMN STRIP */}
      {recentPosts.length > 0 && (
        <section className="article-recent-strip-section">
          <div className="article-hero-container">
            <div className="recent-strip-header">
              <h2>Keep Exploring Growth Insights</h2>
              <button type="button" onClick={() => onNavigate("/blog")} className="view-all-insights-btn">
                All Playbooks <ArrowRight size={15} />
              </button>
            </div>

            <div className="blog-cards-triplet-grid">
              {recentPosts.map((item) => (
                <article
                  key={item.id || item.slug}
                  className="blog-card-item"
                  onClick={() => onNavigate(`/blog/${item.slug}`)}
                >
                  <div className="blog-card-img-wrap">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"}
                      alt={item.title}
                      loading="lazy"
                    />
                    <span className="blog-card-cat-tag">{item.category || "Insights"}</span>
                  </div>

                  <div className="blog-card-body">
                    <div className="blog-card-submeta">
                      <span><CalendarDays size={13} /> {formatDate(item.publishedAt)}</span>
                      <span><Clock3 size={13} /> {item.readTime || "6 min read"}</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>

                    <div className="blog-card-footer">
                      <span className="card-read-link">
                        Read Playbook <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
