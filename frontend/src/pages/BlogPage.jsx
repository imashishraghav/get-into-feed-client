import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  Layout,
  Link,
  List,
  Lock,
  Plus,
  Search,
  Send,
  ThumbsUp,
  Twitter,
  BarChart3,
  X,
  Copy,
  Calendar,
  User,
  Zap
} from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";
import { getStoredBlogPosts, blogPostsCatalog } from "../data/blogPosts.js";
import { getArticleToc, renderArticleContent } from "../utils/markdownRenderer.jsx";
import { enrichWithAttribution } from "../utils/utm.js";

export function FeedNotesPage({ slug, onNavigate }) {
  const [selectedSlug, setSelectedSlug] = useState(slug || null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [visibleCount, setVisibleCount] = useState(6);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // 300ms Debounce for live search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("intro");

  // Free Audit Modal State
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditFormSubmitted, setAuditFormSubmitted] = useState(false);
  const [auditEmail, setAuditEmail] = useState("");
  const [auditStoreUrl, setAuditStoreUrl] = useState("");
  const [auditSpend, setAuditSpend] = useState("$25,000 \u2013 $75,000 / mo");
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  // General Consultation Modal State
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("General Growth Consultation");

  const categories = ["All Topics", "Lead Gen.", "Paid Media", "SEO & Search", "Creative Strategy", "Web & CRO"];
  const [articles, setArticles] = useState(getStoredBlogPosts);
  const [serverArticle, setServerArticle] = useState(null);

  // Authoritative real-time sync with database on mount
  useEffect(() => {
    fetch(`/api/blog?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.posts)) {
          setArticles(data.posts);
          try {
            localStorage.setItem("gif_blog_posts", JSON.stringify(data.posts));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleStorage = () => setArticles(getStoredBlogPosts());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Sync slug prop on route navigation
  useEffect(() => {
    setSelectedSlug(slug || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const cleanSlug = (selectedSlug || "").toLowerCase().trim().replace(/\/+$/, "");

  const BLOG_SLUG_ALIASES = {
    "how-metas-advantage-plus-changes-ecommerce": "meta-advantage-plus-ecommerce-scaling",
    "meta-advantage-plus": "meta-advantage-plus-ecommerce-scaling",
    "advantage-plus": "meta-advantage-plus-ecommerce-scaling",
    "how-metas-advantage-plus-algorithm-changes-ecommerce-scaling-in-2026": "meta-advantage-plus-ecommerce-scaling",
    "5-high-converting-hook-frameworks-for-tiktok-ads": "tiktok-reels-hook-frameworks",
    "tiktok-hook-frameworks": "tiktok-reels-hook-frameworks",
    "tiktok-reels-hook": "tiktok-reels-hook-frameworks",
    "designing-landing-pages-that-convert-at-10-percent": "landing-page-ux-convert-10-percent",
    "designing-landing-pages-that-convert": "landing-page-ux-convert-10-percent",
    "landing-pages": "landing-page-ux-convert-10-percent",
    "why-your-retargeting-funnel-is-leaking-money": "retargeting-funnel-leaks-fix",
    "retargeting-funnel-leaks": "retargeting-funnel-leaks-fix",
    "retargeting": "retargeting-funnel-leaks-fix",
    "programmatic-seo": "programmatic-seo-b2b-saas",
    "how-to-increase-form-conversions-generate-more-leads": "how-to-increase-form-conversions-generate-more-leads",
    "how-to-increase-form-conversions-generate-more-leads-in-2027": "how-to-increase-form-conversions-generate-more-leads",
    "form-conversions-2027": "how-to-increase-form-conversions-generate-more-leads",
    "how-to-increase-form-conversions": "how-to-increase-form-conversions-generate-more-leads",
    "increase-form-conversions-generate-more-leads": "how-to-increase-form-conversions-generate-more-leads",
    "increase-form-conversions": "how-to-increase-form-conversions-generate-more-leads",
    "7-ways-to-increase-form-field-conversion-rate": "how-to-increase-form-conversions-generate-more-leads",
    "ways-to-increase-form-field-conversion-rate": "how-to-increase-form-conversions-generate-more-leads",
    "form-field-conversion-rate": "how-to-increase-form-conversions-generate-more-leads",
    "increase-form-field-conversion-rate": "how-to-increase-form-conversions-generate-more-leads"
  };

  const resolvedSlug = cleanSlug ? (BLOG_SLUG_ALIASES[cleanSlug] || cleanSlug) : null;

  useEffect(() => {
    if (!resolvedSlug) {
      setServerArticle(null);
      return;
    }
    fetch(`/api/blog/${encodeURIComponent(resolvedSlug)}?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && (data.post || data.article)) {
          setServerArticle(data.post || data.article);
        } else {
          setServerArticle(null);
        }
      })
      .catch(() => {});
  }, [resolvedSlug]);

  const allArticles = (Array.isArray(articles) && articles.length > 0)
    ? articles
    : (blogPostsCatalog && blogPostsCatalog.length > 0 ? blogPostsCatalog : []);

  const matchedArticle = resolvedSlug
    ? allArticles.find((b) => b.slug === resolvedSlug) ||
      allArticles.find((b) => b.slug.toLowerCase() === resolvedSlug) ||
      allArticles.find((b) => b.slug.replace(/[^a-z0-9]/gi, "") === resolvedSlug.replace(/[^a-z0-9]/gi, "")) ||
      allArticles.find((b) => b.slug.includes(resolvedSlug) || resolvedSlug.includes(b.slug))
    : null;

  const activeArticle = serverArticle || matchedArticle;

  const tocItems = useMemo(() => getArticleToc(activeArticle), [activeArticle]);

  // Scroll tracking for Reading Progress Bar and ScrollSpy
  useEffect(() => {
    if (!activeArticle) {
      setReadingProgress(0);
      return;
    }

    const resolvedSeoTitle = activeArticle.seo?.seo_title || activeArticle.title || "Blog";
    document.title = resolvedSeoTitle.toLowerCase().includes("getintofeed")
      ? resolvedSeoTitle
      : `${resolvedSeoTitle} | GetIntoFeed`;

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const p = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
        setReadingProgress(p);
      }

      // TOC ScrollSpy with dynamic section IDs
      const sections = tocItems.map((item) => item.id);
      if (window.scrollY < 200 && sections.length > 0) {
        setCurrentSection(sections[0]);
      } else {
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && window.scrollY >= el.offsetTop - 180) {
            setCurrentSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeArticle, tocItems]);

  const openArticle = (newSlug) => {
    setSelectedSlug(newSlug);
    if (onNavigate) {
      onNavigate(`/blog/${newSlug}`);
    } else {
      window.history.pushState({}, "", `/blog/${newSlug}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToListing = () => {
    setSelectedSlug(null);
    if (onNavigate) {
      onNavigate("/blog");
    } else {
      window.history.pushState({}, "", "/blog");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredArticles = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    return allArticles.filter((b) => {
      let matchCategory = true;
      if (activeCategory !== "All Topics") {
        if (activeCategory === "Lead Gen." || activeCategory === "Lead Gen") {
          matchCategory = b.category === "Lead Gen." || b.category === "Lead Gen" || (b.category && b.category.includes("Lead"));
        } else if (activeCategory === "Paid Media") {
          matchCategory = b.category === "Paid Media" || b.category === "Paid Performance" || (b.category && b.category.includes("Paid"));
        } else if (activeCategory === "SEO & Search") {
          matchCategory = b.category?.includes("SEO") || b.category?.includes("Search") || b.category?.includes("GEO");
        } else if (activeCategory === "Creative Strategy") {
          matchCategory = b.category?.includes("Creative") || b.category?.includes("Video") || b.category?.includes("Hook");
        } else if (activeCategory === "Web & CRO") {
          matchCategory = b.category?.includes("Web") || b.category?.includes("CRO");
        } else {
          matchCategory = b.category === activeCategory;
        }
      }
      if (!matchCategory) return false;

      if (!query) return true;

      const titleMatch = (b.title || "").toLowerCase().includes(query);
      const excerptMatch = (b.excerpt || "").toLowerCase().includes(query);
      const contentMatch = (b.content || "").toLowerCase().includes(query);
      const authorMatch = (b.author || b.author_name || "").toLowerCase().includes(query);
      const catMatch = (b.category || "").toLowerCase().includes(query);
      const tagsMatch = Array.isArray(b.tags)
        ? b.tags.some((t) => String(t).toLowerCase().includes(query))
        : typeof b.tags === "string" && b.tags.toLowerCase().includes(query);

      return titleMatch || excerptMatch || contentMatch || authorMatch || catMatch || tagsMatch;
    });
  }, [allArticles, activeCategory, debouncedSearch]);

  const featuredArticle = filteredArticles.find((b) => b.featured) || filteredArticles[0] || null;

  const handleShare = (platform) => {
    const url = typeof window !== "undefined" ? window.location.href : "https://getintofeed.com/blog";
    if (platform === "copy") {
      try {
        navigator.clipboard.writeText(url);
      } catch {}
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent((activeArticle?.title || "Growth Playbook") + " \u2013 Read this on GetIntoFeed: " + url)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent((activeArticle?.title || "Growth Playbook") + " via @GetIntoFeed")}&url=${encodeURIComponent(url)}`, "_blank");
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await fetch(`/api/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail,
          source: "Blog Article Bottom Newsletter",
          page_url: window.location.href,
          page_title: document.title,
          referrer: document.referrer || ""
        })
      });
    } catch {}
    setNewsletterSubmitted(true);
  };

  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    if (!auditEmail) return;
    try {
      const newLead = {
        name: "Meta Audit Request",
        email: auditEmail,
        website: auditStoreUrl,
        budget: auditSpend,
        service: "Meta 15-Point Ad Audit",
        source: "Article Meta Ad Audit Form",
        form_type: "Article Meta Ad Audit Form",
        consent: true,
        date: new Date().toISOString()
      };
      await fetch(`/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichWithAttribution(newLead))
      });
    } catch {}
    setAuditFormSubmitted(true);
    setTimeout(() => {
      setAuditModalOpen(false);
      setAuditFormSubmitted(false);
    }, 2800);
  };

  // =========================================================================
  // SINGLE ARTICLE VIEW (/blog/:slug) "" EXACT REFERENCE DESIGN FROM USER
  // =========================================================================
  if (resolvedSlug && !activeArticle) {
    return (
      <PageLayout onNavigate={onNavigate} activeNav="blog">
        <div className="py-24 text-center max-w-lg mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mb-4 font-bold text-2xl font-space">
            404
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-space">Article Not Found</h2>
          <p className="text-slate-500 mt-2 font-inter text-sm leading-relaxed">
            The requested article &lsquo;{resolvedSlug}&rsquo; does not exist, has been deleted, or was unpublished.
          </p>
          <button
            type="button"
            onClick={handleBackToListing}
            className="mt-6 px-6 py-3 bg-slate-900 hover:bg-[#b5e200] hover:text-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer border-none transition-colors inline-flex items-center gap-2"
          >
            <span>Explore All Articles</span>
            <span>→</span>
          </button>
        </div>
      </PageLayout>
    );
  }

  if (activeArticle) {
    return (
      <PageLayout
        onNavigate={onNavigate}
        activeNav="blog"
        fullWidth={true}
        hideHeader={false}
        leadModalOpen={leadModalOpen}
        setLeadModalOpen={setLeadModalOpen}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      >
        <div className="w-full max-w-full font-sans text-slate-900 bg-white antialiased relative selection:bg-[#CCFF00] selection:text-slate-950">
          
          {/* Scoped CSS from User's Exact HTML Specification */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .bg-grid-pattern {
                background-size: 40px 40px;
                background-image: 
                  linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px);
              }
              .prose-custom p:not(.not-prose *) {
                margin-bottom: 1.5rem;
                line-height: 1.85;
                color: #334155;
                font-size: 1.08rem;
              }
              .prose-custom h2:not(.not-prose *) {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-weight: 800;
                font-size: 1.75rem;
                line-height: 1.3;
                color: #0f172a;
                margin-top: 3rem;
                margin-bottom: 1.25rem;
                letter-spacing: -0.02em;
                scroll-margin-top: 100px;
              }
              .prose-custom h3:not(.not-prose *) {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-weight: 700;
                font-size: 1.35rem;
                color: #0f172a;
                margin-top: 2.25rem;
                margin-bottom: 0.75rem;
                scroll-margin-top: 100px;
              }
              .prose-custom ul:not(.not-prose *) {
                margin-top: 1.25rem;
                margin-bottom: 1.75rem;
                padding-left: 1.5rem;
                list-style-type: disc;
              }
              .prose-custom ul:not(.not-prose *) li {
                margin-bottom: 0.65rem;
                line-height: 1.75;
                color: #334155;
                font-size: 1.05rem;
              }
              .prose-custom ol:not(.not-prose *) {
                margin-top: 1.25rem;
                margin-bottom: 1.75rem;
                padding-left: 1.5rem;
                list-style-type: decimal;
              }
              .prose-custom ol:not(.not-prose *) li {
                margin-bottom: 0.65rem;
                line-height: 1.75;
                color: #334155;
                font-size: 1.05rem;
              }
              .prose-custom blockquote {
                margin-top: 2rem;
                margin-bottom: 2rem;
                padding: 1.25rem 1.5rem;
                border-left: 4px solid #0f172a;
                background: #f8fafc;
                border-radius: 0 1rem 1rem 0;
                color: #1e293b;
                font-size: 1.08rem;
                line-height: 1.7;
              }
              .prose-custom a {
                color: #0f172a;
                font-weight: 600;
                text-decoration: underline;
                text-decoration-color: #CCFF00;
                text-decoration-thickness: 2px;
                text-underline-offset: 4px;
                transition: all 0.2s ease;
              }
              .prose-custom a:hover {
                background-color: rgba(204, 255, 0, 0.25);
                border-radius: 2px;
              }
              .prose-custom strong {
                color: #0f172a;
                font-weight: 700;
              }
              .toc-link.active {
                color: #020617 !important;
                font-weight: 700 !important;
                border-left-color: #CCFF00 !important;
                background-color: #f8fafc !important;
              }
              .writing-vertical-up {
                writing-mode: vertical-rl;
                transform: rotate(180deg);
              }
            `
          }} />

          {/* Top Reading Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-100">
            <div
              id="reading-progress"
              className="h-full bg-slate-950 transition-all duration-150"
              style={{ width: `${readingProgress}%` }}
            />
          </div>

          {/* Hero Article Header Section */}
          <section className="relative bg-grid-pattern border-b border-slate-200/80 pt-8 pb-5 sm:pt-12 sm:pb-6 overflow-hidden text-left">
            {/* Subtle Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500">
                  <button
                    type="button"
                    onClick={() => onNavigate('/')}
                    className="hover:text-slate-900 transition bg-transparent border-none p-0 cursor-pointer text-slate-500 text-xs"
                  >
                    Home
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <button
                    type="button"
                    onClick={handleBackToListing}
                    className="hover:text-slate-900 transition bg-transparent border-none p-0 cursor-pointer text-slate-500 text-xs"
                  >
                    The Feed
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-900 font-semibold">{activeArticle.category || "Paid Social"}</span>
                </nav>
              </div>

              {/* Main Article Title */}
              <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-[52px] text-slate-950 tracking-tight leading-[1.12] mb-5">
                {activeArticle.title}
              </h1>

              {/* Article Subtitle / Deck */}
              {Boolean(activeArticle.excerpt) && (
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 font-normal">
                  {activeArticle.excerpt}
                </p>
              )}

              {/* Author & Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-6 pt-5 border-t border-slate-200/90">
                {/* Author Info */}
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <img
                      src={activeArticle.author_avatar || activeArticle.authorAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
                      alt={activeArticle.author || activeArticle.author_name || "Author"}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#CCFF00]"
                      loading="lazy"
                      decoding="async"
                      width="48"
                      height="48"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 bg-slate-950 text-[#CCFF00] p-0.5 rounded-full" title="Verified Expert">
                      <Check className="w-3 h-3" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-950 text-sm sm:text-base">
                        {activeArticle.author || activeArticle.author_name || "GetIntoFeed Editorial"}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {activeArticle.author_role || activeArticle.authorRole || "Growth Collective"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date & Reading Time */}
                <div className="flex items-center space-x-4 text-xs sm:text-sm text-slate-500 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{activeArticle.date || activeArticle.published_at || "Recent"}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{activeArticle.readTime || activeArticle.read_time || "5 min read"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Hero Image Showcase */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-950 group">
                <img
                  src={activeArticle.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85"}
                  alt={activeArticle.featured_image_alt || activeArticle.title}
                  className="w-full h-auto max-h-[500px] object-contain bg-[#09090b] mx-auto opacity-95 group-hover:scale-[1.01] transition duration-500"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </section>

          {/* Main 3-Column Content Layout */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-12 sm:pb-16 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

              {/* LEFT SIDEBAR: Sticky Vertical Share Bar & TOC (4 Columns on Desktop for Generous Width) */}
              <aside className="hidden lg:flex lg:col-span-4 sticky top-28 self-start items-start gap-6 select-none z-20">
                {/* Vertical "SHARE ARTICLE" Rail */}
                <div className="flex flex-col items-center shrink-0 pt-2">
                  <span className="writing-vertical-up whitespace-nowrap font-bold text-[11px] tracking-[0.24em] uppercase text-slate-500">
                    Share Article
                  </span>

                  {/* Vertical Divider Line */}
                  <div className="w-px h-12 bg-slate-200 my-5" />

                  {/* Circular Social & Copy Link Buttons */}
                  <div className="flex flex-col items-center space-y-3.5">
                    {/* LinkedIn Button */}
                    <button
                      type="button"
                      onClick={() => handleShare("linkedin")}
                      aria-label="Share on LinkedIn"
                      className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-900 hover:border-slate-950 hover:bg-[#CCFF00] shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </button>

                    {/* Twitter Button */}
                    <button
                      type="button"
                      onClick={() => handleShare("twitter")}
                      aria-label="Share on Twitter"
                      className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-900 hover:border-slate-950 hover:bg-[#CCFF00] shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </button>

                    {/* Copy Link Button */}
                    <button
                      type="button"
                      onClick={() => handleShare("copy")}
                      aria-label="Copy Article Link"
                      className="relative w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-900 hover:border-slate-950 hover:bg-[#CCFF00] shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                    >
                      <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span className={`pointer-events-none absolute left-14 bg-slate-950 text-[#CCFF00] text-[10px] font-mono font-bold px-2.5 py-1 rounded-md whitespace-nowrap shadow-md transition-opacity z-20 ${copiedLink ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {copiedLink ? 'Copied! ✓' : 'Copy Link'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Table of Contents (Clean Unboxed Design matching User Reference) */}
                <div className="flex-1 select-none">
                  <h4 className="font-bold text-[12px] sm:text-[13px] tracking-[0.08em] uppercase text-slate-400 mb-4 pl-3.5">
                    Table of Contents
                  </h4>
                  <nav id="toc-nav" className="border-l border-slate-200/90 space-y-0.5 text-sm">
                    {tocItems.map((item) => {
                      const isActive = currentSection === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const target = document.getElementById(item.id);
                            if (target) {
                              const y = target.getBoundingClientRect().top + window.pageYOffset - 90;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                              window.history.replaceState(null, '', `#${item.id}`);
                              setCurrentSection(item.id);
                            }
                          }}
                          className={`toc-link block py-2.5 px-3.5 border-l-[3.5px] -ml-[1px] transition-colors duration-150 no-underline text-sm font-medium leading-snug ${
                            item.level === 3 ? 'pl-6 text-xs text-slate-500' : ''
                          } ${
                            isActive
                              ? 'active border-[#CCFF00] bg-slate-50 text-slate-950 font-bold'
                              : 'border-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-50/50'
                          }`}
                        >
                          {item.title}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              </aside>

              {/* MAIN ARTICLE BODY (8 Columns on Desktop for Ideal Editorial Measure) */}
              <article className="lg:col-span-8 prose-custom max-w-none">
                <div id="intro" className="scroll-mt-28" />
                <div>
                  {renderArticleContent(activeArticle.content, activeArticle.title)}
                </div>

                {/* Article Tags & Helpful Feedback Row */}
                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono uppercase text-slate-400 mr-1">Tags:</span>
                    {(Array.isArray(activeArticle.tags) && activeArticle.tags.length > 0
                      ? activeArticle.tags
                      : ["#Marketing", "#Growth", "#Conversion", "#Strategy"]
                    ).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium bg-slate-100 hover:bg-[#CCFF00] text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-lg transition cursor-pointer select-none"
                      >
                        {String(t).startsWith('#') ? t : `#${t}`}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Helpful Reaction */}
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
                    {voteSubmitted ? (
                      <span className="text-xs font-bold text-emerald-700 px-2 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Thanks for your feedback!</span>
                    ) : (
                      <>
                        <span className="text-xs font-medium text-slate-600">Helpful?</span>
                        <button
                          type="button"
                          onClick={() => setVoteSubmitted(true)}
                          className="p-1 hover:bg-[#CCFF00] rounded text-slate-600 hover:text-slate-950 transition bg-transparent border-none cursor-pointer"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setVoteSubmitted(true)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 transition bg-transparent border-none cursor-pointer"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 14V2" />
                            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h-1.5a1.5 1.5 0 0 1-1.5-1.5V18.12Z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* REDESIGNED AUTHOR BIO CARD */}
                <div className="mt-10 bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <img
                      src={activeArticle.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                      alt={activeArticle.author || "GetIntoFeed Author"}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white shadow-md shrink-0"
                      loading="lazy"
                      decoding="async"
                      width="96"
                      height="96"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">Written By</span>
                          <h3 className="!mt-0 !mb-0 font-extrabold text-xl text-slate-950">
                            {activeArticle.author || "GetIntoFeed Team"}
                          </h3>
                          <p className="!text-xs text-slate-500 !mb-0">
                            {activeArticle.authorRole || "Growth & Performance Specialist"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href="https://www.linkedin.com/in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold bg-white border border-slate-200 hover:border-slate-950 px-3 py-1.5 rounded-lg text-slate-800 flex items-center space-x-1 transition no-underline"
                          >
                            <span>Follow on LinkedIn</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                      <p className="!mb-0 !text-sm text-slate-600 leading-relaxed">
                        {activeArticle.authorBio || (activeArticle.author?.includes("Ashish") ? (
                          <>
                            Ashish Raghav is the Co-Founder, Ads Specialist &amp; Web Designer at <strong>GetIntoFeed</strong>. He architects high-converting landing pages, conversion rate optimization frameworks, and scalable paid performance campaigns for brands across India and global markets.
                          </>
                        ) : (
                          <>
                            Rahul Sood is the Founder &amp; Head of Paid Growth at <strong>GetIntoFeed</strong>. Over the last 8 years, he has architected full-funnel paid social and creative testing systems for 60+ venture-backed DTC and SaaS brands across North America, Europe, and India.
                          </>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              </article>

            </div>
          </main>

          {/* Related Articles Section ("More from The Feed") */}
          {allArticles.filter((b) => b.slug !== activeArticle?.slug).length > 0 && (
            <section className="bg-slate-50 border-t border-slate-200/80 py-16 sm:py-20 text-left">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-semibold block mb-1">Keep Reading</span>
                    <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-950 m-0">More from The Feed</h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToListing}
                    className="inline-flex items-center space-x-1.5 text-sm font-bold text-slate-900 hover:text-indigo-600 transition bg-transparent border-none p-0 cursor-pointer"
                  >
                    <span>View All Articles</span>
                    <ArrowRight className="w-4 h-4 ml-1 inline" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                  {allArticles
                    .filter((b) => b.slug !== activeArticle?.slug)
                    .slice(0, 3)
                    .map((rel) => (
                      <article
                        key={rel.slug}
                        onClick={() => openArticle(rel.slug)}
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                      >
                        <div className="relative h-48 overflow-hidden bg-slate-950">
                          <img
                            src={rel.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
                            alt={rel.title}
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                          {rel.category && (
                            <span className="absolute top-3 left-3 bg-[#CCFF00] text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                              {rel.category}
                            </span>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2.5 font-medium">
                              <span>{rel.date || "Recent"}</span>
                              {rel.readTime && (
                                <>
                                  <span>•</span>
                                  <span>{rel.readTime}</span>
                                </>
                              )}
                            </div>
                            <h3 className="font-bold text-lg text-slate-950 group-hover:text-indigo-600 transition leading-snug mb-2.5 line-clamp-2">
                              {rel.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-0">
                              {rel.excerpt}
                            </p>
                          </div>
                          <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900">
                            <span>Read Playbook</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            </section>
          )}

          {/* Signature Acid-Lime Newsletter Banner */}
          <section id="newsletter" className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-left">
            <div className="max-w-6xl mx-auto bg-[#CCFF00] rounded-3xl p-8 sm:p-12 lg:p-14 border-2 border-slate-950 shadow-[8px_8px_0px_0px_#090D16] relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center space-x-2 bg-slate-950 text-[#CCFF00] text-xs font-mono uppercase px-3 py-1 rounded-full mb-4">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Every Tuesday Morning</span>
                  </div>
                  <h2 className="font-extrabold text-3xl sm:text-4xl text-slate-950 tracking-tight leading-tight mb-3">
                    Join 15,000+ Growth Marketers Getting Smarter Every Week.
                  </h2>
                  <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed mb-0">
                    Zero fluff. Get 1 breakdown of a winning DTC ad creative, 1 algorithm update, and 1 CRO experiment delivered straight to your inbox.
                  </p>
                </div>

                <div className="lg:col-span-5">
                  {newsletterSubmitted ? (
                    <div className="bg-white p-6 rounded-2xl border-2 border-slate-950 shadow-md text-slate-950 font-bold text-sm">
                      ✅ <strong>You're in!</strong> Check your inbox for the 2026 Meta Scaling Playbook.
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="bg-white p-2 rounded-2xl border-2 border-slate-950 shadow-md flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        required
                        placeholder="Enter your work email..."
                        className="flex-1 px-4 py-3 text-sm text-slate-950 placeholder-slate-400 focus:outline-none rounded-xl border-none"
                      />
                      <button
                        type="submit"
                        className="bg-slate-950 hover:bg-slate-800 text-[#CCFF00] font-bold text-sm px-6 py-3.5 rounded-xl transition shrink-0 border-none cursor-pointer"
                      >
                        Subscribe Free
                      </button>
                    </form>
                  )}
                  <p className="text-xs font-semibold text-slate-800 mt-2.5 pl-1 mb-0 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" /> No spam ever. Unsubscribe in 1-click.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Audit Modal Dialog */}
          {auditModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-[#0e0e13]/98 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(212,255,0,0.06)] relative text-left overflow-hidden text-white animate-in zoom-in-95 duration-200">
                {/* Top ambient highlight */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4ff00] to-transparent opacity-80 pointer-events-none"></div>

                <button
                  type="button"
                  onClick={() => setAuditModalOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="inline-block bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/30 text-[10px] font-space font-extrabold uppercase px-2.5 py-1 rounded-full mb-3 tracking-wider">
                  Free Loom Teardown
                </span>
                <h3 className="font-space font-extrabold text-2xl text-white mb-1.5">Request Your Growth Audit</h3>
                <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                  Enter your store details below and our growth team will record a personalized 12-minute video teardown within 48 hours.
                </p>

                {auditFormSubmitted ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] flex items-center justify-center mx-auto text-xl font-bold shadow-[0_0_20px_rgba(212,255,0,0.2)]">✓</div>
                    <h4 className="font-space font-bold text-lg text-white">Audit Request Received!</h4>
                    <p className="text-xs text-zinc-400 mt-1">Our strategist team will email your personalized Loom video within 48 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleAuditSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase tracking-wider text-zinc-300 mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={auditEmail}
                        onChange={(e) => setAuditEmail(e.target.value)}
                        placeholder="you@brand.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-900/80 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]/40 transition-all font-inter"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase tracking-wider text-zinc-300 mb-1">Website / Store URL *</label>
                      <input
                        type="url"
                        required
                        value={auditStoreUrl}
                        onChange={(e) => setAuditStoreUrl(e.target.value)}
                        placeholder="https://yourstore.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-900/80 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]/40 transition-all font-inter"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase tracking-wider text-zinc-300 mb-1">Current Monthly Ad Spend</label>
                      <select
                        value={auditSpend}
                        onChange={(e) => setAuditSpend(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-900/90 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]/40 transition-all font-inter cursor-pointer"
                      >
                        <option value="₹30,000 – ₹1,00,000 / mo" className="bg-zinc-900 text-white">₹30,000 – ₹1,00,000 / mo</option>
                        <option value="₹1,00,000 – ₹3,00,000 / mo" className="bg-zinc-900 text-white">₹1,00,000 – ₹3,00,000 / mo</option>
                        <option value="₹3,00,000 – ₹10,00,000+ / mo" className="bg-zinc-900 text-white">₹3,00,000 – ₹10,00,000+ / mo</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#d4ff00] hover:bg-[#c2ed00] text-[#09090b] font-space font-extrabold text-xs uppercase py-3.5 rounded-xl transition cursor-pointer border border-[#d4ff00] shadow-lg active:scale-[0.99] mt-2"
                    >
                      Send My Free Audit →
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </PageLayout>
    );
  }

  // =========================================================================
  // BLOG LISTING HUB VIEW (/blog) "" EXACT USER REFERENCE DESIGN
  // =========================================================================
  const isFeaturedInFiltered = filteredArticles.some((b) => b.slug === featuredArticle?.slug);
  const gridArticles = filteredArticles
    .filter((b) => !isFeaturedInFiltered || b.slug !== featuredArticle?.slug)
    .slice(0, visibleCount);
  const totalGridArticles = filteredArticles.filter((b) => !isFeaturedInFiltered || b.slug !== featuredArticle?.slug).length;
  const hasMore = visibleCount < totalGridArticles;

  return (
    <PageLayout
      onNavigate={onNavigate}
      activeNav="blog"
      fullWidth={true}
      leadModalOpen={leadModalOpen}
      setLeadModalOpen={setLeadModalOpen}
      selectedService={selectedService}
      setSelectedService={setSelectedService}
    >
      <div className="w-full max-w-full overflow-x-hidden font-inter text-[#111827] bg-[#ffffff] antialiased">
        {/* HERO SECTION (Image 2: Rounded Dark Card with Geometric Ring & Asterisk Spark) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="services-hero-bg rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-slate-800/90 min-h-[280px] sm:min-h-[300px] flex items-center">
            
            {/* Right Side Decorative Geometric Graphic (Matching Screenshot 2) */}
            <div className="absolute right-[-40px] sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-85 sm:opacity-90">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                {/* Outer Lime Translucent Ring */}
                <div className="w-full h-full rounded-full border-[28px] sm:border-[36px] border-[#d2ff00]/25 flex items-center justify-center">
                  {/* Inner Asterisk Spark */}
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#d2ff00]/50 -translate-x-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
                  </svg>
                </div>
                {/* Overlapping Top-Right Double Circle */}
                <div className="absolute -top-4 right-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#d2ff00]/40 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#d2ff00]/30"></div>
                </div>
              </div>
            </div>

            {/* Left Column Copy */}
            <div className="relative z-10 max-w-2xl space-y-4 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#e7ff8a]">
                <span className="w-[11px] h-[11px] rounded-[3px] bg-[#d4ff00] border-2 border-[#2563eb] inline-block shrink-0 box-border" />
                GETINTOFEED BLOG
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-[-0.035em] leading-[1.08] text-white">
                Ideas that make your <br className="hidden sm:inline" />
                <span className="text-[#d4ff00]">marketing work harder.</span>
              </h1>

              <p className="text-[#d4dcf0] text-[14.5px] sm:text-[15px] leading-[1.55] max-w-xl font-normal pt-1">
                Ads that spend but don't convert? Website visitors who don't call? Start with our straightforward fixes.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Article Section */}
        {featuredArticle && isFeaturedInFiltered && (
          <section className="py-8 sm:py-10 bg-white relative z-20 border-b border-gray-100">
            <div className="container mx-auto px-4 max-w-7xl">
              <div
                onClick={() => openArticle(featuredArticle.slug)}
                className="group flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 transition-all hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] cursor-pointer text-left"
              >
                <div className="lg:w-3/5 min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] relative overflow-hidden bg-[#09090b] flex items-center justify-center">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-contain bg-[#09090b] transition duration-700 group-hover:scale-[1.02]"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden pointer-events-none" />
                  <div className="absolute bottom-4 left-4 lg:hidden z-10">
                    <span className="bg-[#cfff04] text-[#111827] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="lg:w-2/5 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                  <div className="hidden lg:flex items-center gap-3 mb-6">
                    <span className="bg-[#cfff04] text-[#111827] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Featured
                    </span>
                    <span className="text-sm text-[#4b5563] font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime || "8 Min Read"}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111827] mb-4 leading-tight group-hover:text-[#b8e600] transition-colors">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-[#4b5563] text-base sm:text-lg mb-8 line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={featuredArticle.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                          alt=""
                          onError={(e) => { e.currentTarget.style.display = 'none'; if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                          className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                          loading="lazy"
                          decoding="async"
                          width="40"
                          height="40"
                        />
                        <div
                          style={{ display: 'none' }}
                          className="w-10 h-10 rounded-full bg-slate-900 text-[#d4ff00] font-bold text-xs items-center justify-center border border-gray-200"
                        >
                          {featuredArticle.author ? featuredArticle.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AR'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111827]">{featuredArticle.author}</div>
                        <div className="text-xs text-[#4b5563]">{featuredArticle.authorRole}</div>
                      </div>
                    </div>
                    <div className="text-[#111827] font-bold text-sm uppercase tracking-wider group-hover:text-[#b8e600] transition-colors flex items-center gap-1.5">
                      Read <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sticky Filter & Search Bar */}
        <section className="py-5 bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
          <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-nowrap overflow-x-auto items-center justify-start md:justify-center gap-2.5 pb-2 md:pb-0 w-full md:w-auto" style={{ scrollbarWidth: "none" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(6);
                  }}
                  className={`whitespace-nowrap px-5 sm:px-6 py-2 rounded-full border text-xs sm:text-sm font-semibold transition cursor-pointer active:scale-95 ${
                    activeCategory === cat
                      ? "bg-[#111827] text-white border-[#111827] shadow-sm"
                      : "text-[#4b5563] bg-white border-gray-300 hover:bg-gray-100 hover:text-[#111827]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72 flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles (e.g. Meta, SEO, CRO)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(6);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearch("");
                  }
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-9 py-2 text-xs font-inter text-[#111827] focus:outline-none focus:border-[#111827] focus:bg-white transition shadow-sm"
                aria-label="Search articles"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setVisibleCount(6);
                  }}
                  className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                  title="Clear search (Esc)"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 3-Column Articles Grid */}
        <section className="py-12 sm:py-16 bg-[#f9fafb]">
          <div className="container mx-auto px-4 max-w-7xl">
            {(debouncedSearch.trim() || activeCategory !== "All Topics") && (
              <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">
                    Showing {filteredArticles.length} of {allArticles.length} articles
                  </span>
                  {debouncedSearch.trim() && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                      Query: &ldquo;{debouncedSearch}&rdquo;
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="text-slate-400 hover:text-slate-900 ml-1 cursor-pointer"
                        title="Remove search query"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {activeCategory !== "All Topics" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                      Category: {activeCategory}
                      <button
                        type="button"
                        onClick={() => setActiveCategory("All Topics")}
                        className="text-blue-400 hover:text-blue-900 ml-1 cursor-pointer"
                        title="Reset category"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All Topics");
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer underline"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {allArticles.length === 0 ? (
              <div className="text-center py-20 max-w-lg mx-auto px-4">
                <div className="w-16 h-16 rounded-2xl bg-[#CCFF00]/25 text-slate-950 flex items-center justify-center mx-auto mb-4 font-bold text-2xl font-space">
                  <BookOpen className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#111827] font-space">No Articles Published Yet</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  The team is currently crafting new growth playbooks and insights. Articles published from the Content Studio will appear here live.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate ? onNavigate("/") : (window.location.href = "/")}
                  className="mt-6 px-6 py-3 bg-slate-900 hover:bg-[#b5e200] hover:text-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer border-none transition-colors inline-flex items-center gap-2"
                >
                  <span>Return to Homepage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : gridArticles.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#cfff04]/30 text-slate-900 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
                  <Search className="w-6 h-6 text-slate-800" />
                </div>
                <h3 className="text-xl font-extrabold text-[#111827] mb-2 font-space">No articles found</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  No articles matched {debouncedSearch ? <span>query &ldquo;<strong>{debouncedSearch}</strong>&rdquo;</span> : ""} {activeCategory !== "All Topics" ? <span>in category &ldquo;<strong>{activeCategory}</strong>&rdquo;</span> : ""}.
                </p>
                <button
                  type="button"
                  onClick={() => { setActiveCategory("All Topics"); setSearch(""); }}
                  className="px-6 py-2.5 bg-[#111827] hover:bg-slate-800 text-white rounded-full text-xs uppercase font-bold tracking-wider cursor-pointer shadow-sm transition active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div id="blog-articles-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridArticles.map((art) => (
                  <div
                    key={art.slug}
                    onClick={() => openArticle(art.slug)}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] text-left"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-200">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-[#111827] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {art.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-xs text-[#4b5563] font-medium mb-3 flex items-center justify-between">
                        <span>{art.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {art.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-black mb-3 leading-snug group-hover:text-[#b8e600] transition text-[#111827] line-clamp-2">
                        {art.title}
                      </h3>

                      <p className="text-[#4b5563] text-sm mb-6 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-[#111827] font-bold text-sm uppercase tracking-wider group-hover:text-[#b8e600] transition-colors">
                        Read Article{" "}
                        <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-14 sm:mt-16">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="bg-white border-2 border-[#111827] text-[#111827] font-bold py-3 px-10 rounded-full hover:bg-[#111827] hover:text-white transition shadow-sm cursor-pointer active:scale-95 text-sm uppercase tracking-wider"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section className="py-16 sm:py-20 bg-white relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-[#cfff04] rounded-[2.5rem] p-8 md:p-14 shadow-[0_4px_14px_0_rgba(207,255,4,0.39)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl pointer-events-none" />

              <div className="md:w-1/2 relative z-10 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-4 leading-tight">
                  Join 5,000+ Marketers Getting Smarter Every Week.
                </h2>
                <p className="text-[#111827]/80 font-medium text-base sm:text-lg mb-0 leading-relaxed">
                  No fluff. Just the exact tactics and strategies we use to scale 7 &amp; 8 figure brands, delivered to your inbox.
                </p>
              </div>

              <div className="md:w-1/2 w-full relative z-10">
                {newsletterSubmitted ? (
                  <div className="bg-white/95 p-6 rounded-xl text-center font-bold text-[#111827] shadow-sm">
                    <CheckCircle2 className="w-4 h-4 inline mr-2 text-emerald-600" /> Thank you for subscribing! Check your inbox for our latest scaling playbook.
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      required
                      className="w-full border-none rounded-xl px-5 py-4 text-[#111827] focus:outline-none focus:ring-4 focus:ring-white/50 bg-white placeholder-gray-400 font-medium shadow-sm transition text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-[#0f172a] text-white font-bold py-4 px-8 rounded-xl hover:bg-black transition whitespace-nowrap shadow-md cursor-pointer active:scale-95 text-sm"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
                <div className="text-xs sm:text-sm font-medium text-[#111827]/70 mt-3 text-center md:text-left flex items-center justify-center md:justify-start gap-1.5">
                  <Lock className="w-3.5 h-3.5 inline" /> We respect your privacy. No spam ever.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export const BlogPage = FeedNotesPage;
export default FeedNotesPage;
