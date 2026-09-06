import "./admin.css";
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bold,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Code,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Layers,
  LayoutDashboard,
  Link as LinkIcon,
  List,
  ListOrdered,
  Lock,
  LogOut,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  PenTool,
  Pencil,
  Phone,
  Plus,
  Quote,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Strikethrough,
  Tag,
  Trash2,
  User,
  UserCheck,
  Users,
  Video,
  X,
  Zap
} from "lucide-react";

import { INITIAL_SERVICES, INITIAL_CASE_STUDIES } from "./adminData.js";
import { blogPostsCatalog, reviewsCatalog } from "./DetailPages.jsx";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminDashboard({ onNavigate }) {
  // =========================================================================
  // 1. AUTHENTICATION & SECURITY STATE (RESTRICTED ACCESS)
  // =========================================================================
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return (
        sessionStorage.getItem("gif_admin_session") === "true" ||
        localStorage.getItem("gif_admin_session") === "true"
      );
    } catch {
      return false;
    }
  });

  const [loginEmail, setLoginEmail] = useState("admin@getintofeed.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const validEmail = (loginEmail.trim().toLowerCase() === "admin@getintofeed.com" || loginEmail.trim().toLowerCase() === "ashish@getintofeed.com");
    const validPass = (loginPassword.trim() === "admin123" || loginPassword.trim() === "FeedGrowth2025!");

    if (validEmail && validPass) {
      if (rememberMe) {
        localStorage.setItem("gif_admin_session", "true");
      }
      sessionStorage.setItem("gif_admin_session", "true");
      setIsAuthenticated(true);
    } else {
      setLoginError("Invalid Studio credentials. Access attempt has been recorded.");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("gif_admin_session");
      sessionStorage.removeItem("gif_admin_session");
    } catch {}
    setIsAuthenticated(false);
  };

  // =========================================================================
  // 2. ACTIVE NAVIGATION & NOTIFICATIONS
  // =========================================================================
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notice, setNotice] = useState(null);

  const showNotice = (msg, type = "success") => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 3500);
  };

  // =========================================================================
  // 3. INBOUND LEADS (CRM) STATE
  // =========================================================================
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_admin_leads");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "lead-001",
        name: "Vikram Malhotra",
        email: "vikram@malhotrarealty.com",
        phone: "+91 98110 44221",
        company: "Malhotra Realty & Villas",
        service: "Paid Performance & Meta/Google Ads",
        plan: "Growth Plan — ₹29,999 / mo",
        budget: "₹50,000 / mo ad spend",
        status: "New",
        date: "2026-03-05",
        requirements: "Looking to acquire verified HNI leads for luxury Goa villas."
      },
      {
        id: "lead-002",
        name: "Ananya Deshmukh",
        email: "ananya@urbanbotanics.in",
        phone: "+91 99201 88310",
        company: "Urban Botanics Skincare",
        service: "Short-Form Video & Reel Production",
        plan: "Scale Plan — ₹44,999 / mo",
        budget: "₹1,00,000 / mo spend",
        status: "Contacted",
        date: "2026-03-04",
        requirements: "Need 20 high-retention reel hooks to scale beyond 2.8x ROAS."
      }
    ];
  });

  const [leadFilterStatus, setLeadFilterStatus] = useState("All");
  const [leadSearch, setLeadSearch] = useState("");

  const filteredLeads = leads.filter(l => {
    const matchStatus = leadFilterStatus === "All" || l.status === leadFilterStatus;
    const matchSearch = !leadSearch || 
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.company.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch);
    return matchStatus && matchSearch;
  });

  // =========================================================================
  // 4. BLOG & FEED NOTES CMS (TOP-NOTCH EDITOR)
  // =========================================================================
  const [blogPosts, setBlogPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_blog_posts");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return blogPostsCatalog || [];
  });

  const [blogSearch, setBlogSearch] = useState("");
  const [blogCategoryFilter, setBlogCategoryFilter] = useState("All");

  // Blog Editor Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editorSubTab, setEditorSubTab] = useState("write"); // write | preview | seo

  const [blogFormData, setBlogFormData] = useState({
    slug: "",
    title: "",
    category: "Creative Strategy",
    author: "Ashish Raghav",
    authorRole: "Executive Growth Director",
    readTime: "5 min read",
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    excerpt: "",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    seoTitle: "",
    seoDescription: "",
    focusKeyword: ""
  });

  const openNewBlogModal = () => {
    setEditingPost(null);
    setBlogFormData({
      slug: "",
      title: "",
      category: "Creative Strategy",
      author: "Ashish Raghav",
      authorRole: "Executive Growth Director",
      readTime: "5 min read",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      excerpt: "",
      content: "# New Growth Playbook\n\nStart writing your breakdown here...",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      seoTitle: "",
      seoDescription: "",
      focusKeyword: ""
    });
    setEditorSubTab("write");
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (post) => {
    setEditingPost(post);
    setBlogFormData({
      slug: post.slug || "",
      title: post.title || "",
      category: post.category || "Creative Strategy",
      author: post.author || "Ashish Raghav",
      authorRole: post.authorRole || "Executive Growth Director",
      readTime: post.readTime || "5 min read",
      date: post.date || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      coverImage: post.coverImage || post.heroImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      seoTitle: post.seoTitle || post.title || "",
      seoDescription: post.seoDescription || post.excerpt || "",
      focusKeyword: post.focusKeyword || ""
    });
    setEditorSubTab("write");
    setIsBlogModalOpen(true);
  };

  const handleSaveBlogPost = (e) => {
    e.preventDefault();
    if (!blogFormData.title.trim()) {
      alert("Please enter a title for the blog post.");
      return;
    }

    const calculatedSlug = blogFormData.slug.trim() ? slugify(blogFormData.slug) : slugify(blogFormData.title);
    
    // Auto calculate reading time
    const wordCount = (blogFormData.content || "").split(/\s+/).length;
    const calcReadTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

    const postToSave = {
      ...blogFormData,
      slug: calculatedSlug,
      readTime: blogFormData.readTime || calcReadTime,
      seoTitle: blogFormData.seoTitle || blogFormData.title,
      seoDescription: blogFormData.seoDescription || blogFormData.excerpt
    };

    let updatedPosts;
    if (editingPost) {
      updatedPosts = blogPosts.map(p => p.slug === editingPost.slug ? postToSave : p);
      showNotice("Blog playbook updated successfully!");
    } else {
      updatedPosts = [postToSave, ...blogPosts];
      showNotice("New blog playbook published live!");
    }

    setBlogPosts(updatedPosts);
    try {
      localStorage.setItem("gif_blog_posts", JSON.stringify(updatedPosts));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    setIsBlogModalOpen(false);
  };

  const handleDeleteBlogPost = (slug) => {
    if (!window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
    const updated = blogPosts.filter(p => p.slug !== slug);
    setBlogPosts(updated);
    try {
      localStorage.setItem("gif_blog_posts", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    showNotice("Article deleted from catalog.");
  };

  // Editor toolbar insert helper
  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = document.getElementById("blog-content-editor");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = prefix + (selected || "text") + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setBlogFormData(prev => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "text").length);
    }, 50);
  };

  // =========================================================================
  // 5. CLIENT REVIEWS & TESTIMONIALS CMS (FULL CRUD)
  // =========================================================================
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_reviews_catalog");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return reviewsCatalog || [];
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReviewIndex, setEditingReviewIndex] = useState(null);
  const [reviewFormData, setReviewFormData] = useState({
    name: "",
    role: "",
    company: "",
    quote: "",
    rating: 5,
    service: "Paid Performance & Video",
    metric: "+380% ROAS",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    verified: true
  });

  const openNewReviewModal = () => {
    setEditingReviewIndex(null);
    setReviewFormData({
      name: "",
      role: "Founder & CEO",
      company: "",
      quote: "",
      rating: 5,
      service: "Paid Performance & Video",
      metric: "+300% Growth",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      verified: true
    });
    setIsReviewModalOpen(true);
  };

  const openEditReviewModal = (rev, idx) => {
    setEditingReviewIndex(idx);
    setReviewFormData({
      name: rev.name || "",
      role: rev.role || "",
      company: rev.company || "",
      quote: rev.quote || "",
      rating: rev.rating || 5,
      service: rev.service || "Growth Sprint",
      metric: rev.metric || "+250% ROAS",
      avatar: rev.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      verified: rev.verified !== false
    });
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!reviewFormData.name.trim() || !reviewFormData.quote.trim()) {
      alert("Please fill in client name and review quote.");
      return;
    }

    let updated;
    if (editingReviewIndex !== null) {
      updated = reviews.map((r, i) => i === editingReviewIndex ? reviewFormData : r);
      showNotice("Client review updated successfully!");
    } else {
      updated = [reviewFormData, ...reviews];
      showNotice("New client testimonial added live!");
    }

    setReviews(updated);
    try {
      localStorage.setItem("gif_reviews_catalog", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    setIsReviewModalOpen(false);
  };

  const handleDeleteReview = (idx) => {
    if (!window.confirm("Delete this client testimonial?")) return;
    const updated = reviews.filter((_, i) => i !== idx);
    setReviews(updated);
    try {
      localStorage.setItem("gif_reviews_catalog", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {}
    showNotice("Review removed from live catalog.");
  };

  // =========================================================================
  // 6. GLOBAL SEO & META TAGS CMS (PER-ROUTE MANAGER)
  // =========================================================================
  const defaultRoutesSEO = {
    "/": {
      title: "GetIntoFeed | Creative Marketing & Performance Growth Agency",
      description: "Premier creative performance marketing studio. We engineer thumb-stopping video reels, high-converting React funnels, and algorithmic paid media for ambitious brands.",
      keywords: "Performance marketing, creative agency, Meta ads agency India, video reels production, growth hacking",
      ogImage: "https://www.getintofeed.com/assets/og-home.jpg"
    },
    "/services": {
      title: "Growth Services & Capabilities | GetIntoFeed",
      description: "Explore our 8 core growth disciplines: Brand Positioning, Paid Performance Ads, Video Reels, Web Development, SEO, and CRO Funnels.",
      keywords: "D2C marketing services, performance branding, viral reel hooks, React web development",
      ogImage: "https://www.getintofeed.com/assets/og-services.jpg"
    },
    "/work": {
      title: "Selected Case Studies & Commercial Results | GetIntoFeed",
      description: "Real client outcomes: +380% qualified pipeline, 4.8x blended ROAS, and 28,000+ verified customer acquisitions.",
      keywords: "Performance marketing case studies, real estate lead generation, D2C brand scaling",
      ogImage: "https://www.getintofeed.com/assets/og-work.jpg"
    },
    "/about": {
      title: "About GetIntoFeed | We Build Marketing That People Remember",
      description: "Our story, vision, mission, and philosophy. We eliminate bloated agency layers and deliver high-velocity creative sprints.",
      keywords: "About GetIntoFeed, Ashish Raghav agency, creative studio Delhi NCR",
      ogImage: "https://www.getintofeed.com/assets/og-about.jpg"
    },
    "/pricing": {
      title: "Transparent Growth Sprints & Retainers | GetIntoFeed",
      description: "Clear sprint pricing with zero hidden fees. Starter Sprints, Scale Retainers, and Enterprise partnerships.",
      keywords: "Marketing agency pricing, performance marketing retainers India, growth sprint costs",
      ogImage: "https://www.getintofeed.com/assets/og-pricing.jpg"
    },
    "/blog": {
      title: "Feed Notes | Editorial Playbooks & Growth Strategies | GetIntoFeed",
      description: "Raw, battle-tested teardowns of short-form video algorithms, server-side attribution, and commercial brand positioning.",
      keywords: "Marketing blog, Meta ads strategy 2026, TikTok reel algorithms, UGC breakdown",
      ogImage: "https://www.getintofeed.com/assets/og-blog.jpg"
    },
    "/contact": {
      title: "Contact Growth Desk | Schedule Strategy Consultation | GetIntoFeed",
      description: "Connect with senior growth architects. Schedule a 30-minute diagnostic session or chat directly via WhatsApp.",
      keywords: "Contact marketing agency, book marketing audit, GetIntoFeed phone WhatsApp",
      ogImage: "https://www.getintofeed.com/assets/og-contact.jpg"
    },
    "/privacy": {
      title: "Privacy Policy & DPDPA Compliance | GetIntoFeed",
      description: "Digital Personal Data Protection Act (DPDPA 2023) and GDPR data processing standards.",
      keywords: "Privacy policy, data protection, DPDPA compliance",
      ogImage: ""
    },
    "/terms": {
      title: "Terms of Commercial Service & Intellectual Property | GetIntoFeed",
      description: "Commercial sprint deliverables, IP transfer terms, and legal jurisdiction.",
      keywords: "Terms of service, agency contract, IP ownership",
      ogImage: ""
    },
    "/refund-policy": {
      title: "Refund & Cancellation Policy | GetIntoFeed",
      description: "Transparent refund rules, sprint milestone approvals, and retainer cancellation terms.",
      keywords: "Refund policy, agency retainer cancellation",
      ogImage: ""
    },
    "/disclaimer": {
      title: "Performance Disclaimer & Algorithm Notice | GetIntoFeed",
      description: "Ad platform algorithmic variances, third-party attribution policies, and performance estimates.",
      keywords: "Performance disclaimer, ROAS guarantee policy",
      ogImage: ""
    },
    "/nda": {
      title: "Mutual Non-Disclosure Agreement (NDA) | GetIntoFeed",
      description: "Confidentiality protection for client campaign data, ad accounts, and commercial trade secrets.",
      keywords: "Agency NDA, mutual non-disclosure agreement",
      ogImage: ""
    },
    "/cookie-policy": {
      title: "Cookie & Tracking Policy | GetIntoFeed",
      description: "Transparent overview of cookies, tracking signals, and user data privacy.",
      keywords: "Cookie policy, tracking preferences",
      ogImage: ""
    }
  };

  const [seoCatalog, setSeoCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_custom_seo_tags");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          return { ...defaultRoutesSEO, ...parsed };
        }
      }
    } catch {}
    return defaultRoutesSEO;
  });

  const [selectedSeoRoute, setSelectedSeoRoute] = useState("/");
  const currentSeoData = seoCatalog[selectedSeoRoute] || defaultRoutesSEO[selectedSeoRoute] || {
    title: "",
    description: "",
    keywords: "",
    ogImage: ""
  };

  const handleUpdateCurrentSeo = (field, val) => {
    setSeoCatalog(prev => ({
      ...prev,
      [selectedSeoRoute]: {
        ...(prev[selectedSeoRoute] || {}),
        [field]: val
      }
    }));
  };

  const handleSaveSeo = () => {
    try {
      localStorage.setItem("gif_custom_seo_tags", JSON.stringify(seoCatalog));
      window.dispatchEvent(new Event("storage"));
      showNotice(`SEO settings for ${selectedSeoRoute} saved & applied live!`);
    } catch (e) {
      showNotice("Failed saving SEO settings", "error");
    }
  };

  const handleResetSeo = () => {
    if (!window.confirm(`Reset SEO settings for ${selectedSeoRoute} to agency defaults?`)) return;
    const resetVal = defaultRoutesSEO[selectedSeoRoute] || {};
    setSeoCatalog(prev => ({
      ...prev,
      [selectedSeoRoute]: resetVal
    }));
    try {
      const copy = { ...seoCatalog, [selectedSeoRoute]: resetVal };
      localStorage.setItem("gif_custom_seo_tags", JSON.stringify(copy));
      window.dispatchEvent(new Event("storage"));
      showNotice("Restored agency default SEO tags.");
    } catch {}
  };

  // =========================================================================
  // 7. CATALOG VIEWER: SERVICES & CASE STUDIES
  // =========================================================================
  const [services] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_services_catalog");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SERVICES;
  });

  const [cases] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_case_studies_catalog");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CASE_STUDIES;
  });

  // =========================================================================
  // AUTH GUARD: IF NOT LOGGED IN, RENDER STUDIO LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-inter selection:bg-brand-lime selection:text-black">
        {/* Background ambient lighting */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#121215] border-2 border-black/80 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
          {/* Studio Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime/10 border border-brand-lime/30 text-brand-lime font-space font-bold text-[10px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Studio OS • Restricted
            </div>
            <h1 className="font-space font-extrabold text-2xl uppercase tracking-tight text-white mt-2">
              GETINTOFEED STUDIO
            </h1>
            <p className="text-xs text-gray-400 font-inter">
              Agency Operating System & Content Management Engine
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-space font-bold uppercase text-gray-400 mb-1.5">
                Executive Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@getintofeed.com"
                  className="w-full bg-[#1A1A1E] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-lime transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-space font-bold uppercase text-gray-400 mb-1.5">
                Master Security Key / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1A1A1E] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-lime transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#1A1A1E] border-white/20 text-brand-lime focus:ring-0"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={() => { setLoginEmail("admin@getintofeed.com"); setLoginPassword("admin123"); }}
                className="text-[11px] text-brand-lime hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Auto-fill credentials
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-lime hover:bg-[#E2FF4D] text-brand-dark font-space font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg mt-2"
            >
              <Lock className="w-3.5 h-3.5" /> Unlock Studio OS
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate("/") : (window.location.href = "/")}
              className="text-xs text-gray-500 hover:text-gray-300 font-space uppercase transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" /> Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN STUDIO OS DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F0F2F5] font-inter text-[#1E293B] flex flex-col">
      {/* Top Banner Notice */}
      {notice && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-space font-bold uppercase flex items-center gap-2 ${notice.type === "error" ? "bg-red-600 text-white" : "bg-brand-dark text-brand-lime border border-brand-lime/40"}`}>
          <CheckCircle2 className="w-4 h-4 text-brand-lime" />
          <span>{notice.msg}</span>
        </div>
      )}

      {/* 1. STUDIO OS MASTER HEADER */}
      <header className="bg-[#09090B] text-white border-b border-black px-6 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 text-left"
          >
            <span className="font-space font-extrabold text-lg uppercase tracking-tight text-white hover:text-brand-lime transition-colors">
              GETINTOFEED
            </span>
            <span className="text-[10px] font-space font-bold px-2 py-0.5 rounded-md bg-brand-lime text-brand-dark uppercase">
              STUDIO OS
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/15 text-[11px] font-space text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM ONLINE</span>
            <span className="text-gray-600">•</span>
            <span>v4.2 PRO</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate("/") : (window.location.href = "/")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-space font-bold uppercase transition-colors border-none cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" /> View Live Agency ↗
          </button>

          <div className="flex items-center gap-2 pl-2 sm:border-l border-white/15">
            <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold text-white font-space">
              AR
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-space font-bold uppercase transition-colors border-none cursor-pointer flex items-center gap-1.5"
              title="Lock Studio & Log Out"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: SIDEBAR NAVIGATION + CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#1E293B] text-[#CBD5E1] p-4 flex flex-col gap-1 shrink-0 border-r border-slate-700/50">
          <div className="text-[10px] font-space font-bold uppercase tracking-widest text-slate-400 px-3 py-2">
            AGENCY MODULES
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all text-left border-none cursor-pointer ${activeTab === "dashboard" ? "bg-brand-blue text-white shadow-sm" : "hover:bg-slate-700 text-slate-300 bg-transparent"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Executive Dashboard
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leads")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all text-left border-none cursor-pointer ${activeTab === "leads" ? "bg-brand-blue text-white shadow-sm" : "hover:bg-slate-700 text-slate-300 bg-transparent"}`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" /> Inbound Leads (CRM)
            </div>
            <span className="bg-brand-lime text-brand-dark text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {leads.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("blog")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all text-left border-none cursor-pointer ${activeTab === "blog" ? "bg-brand-blue text-white shadow-sm" : "hover:bg-slate-700 text-slate-300 bg-transparent"}`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4" /> Blog & Playbooks (CMS)
            </div>
            <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {blogPosts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all text-left border-none cursor-pointer ${activeTab === "reviews" ? "bg-brand-blue text-white shadow-sm" : "hover:bg-slate-700 text-slate-300 bg-transparent"}`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4" /> Client Reviews (CMS)
            </div>
            <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {reviews.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all text-left border-none cursor-pointer ${activeTab === "seo" ? "bg-brand-blue text-white shadow-sm" : "hover:bg-slate-700 text-slate-300 bg-transparent"}`}
          >
            <Globe className="w-4 h-4" /> Global SEO & Meta Tags
          </button>

          <div className="text-[10px] font-space font-bold uppercase tracking-widest text-slate-400 px-3 py-2 mt-4">
            PORTFOLIO ASSETS
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all text-left border-none cursor-pointer ${activeTab === "services" ? "bg-brand-blue text-white shadow-sm" : "hover:bg-slate-700 text-slate-300 bg-transparent"}`}
          >
            <Layers className="w-4 h-4" /> Services Catalog ({services.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cases")}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-space font-bold uppercase transition-all text-left border-none cursor-pointer ${activeTab === "cases" ? "bg-brand-blue text-white shadow-sm" : "hover:bg-slate-700 text-slate-300 bg-transparent"}`}
          >
            <Sparkles className="w-4 h-4" /> Case Studies ({cases.length})
          </button>

          <div className="mt-auto pt-6 border-t border-slate-700/50 text-[11px] text-slate-400 font-space">
            <div>Support Desk:</div>
            <div className="text-white font-bold">+91 8810356950</div>
          </div>
        </aside>

        {/* Content Workspace Slot */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* =============================================================== */}
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {/* =============================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-space font-extrabold text-2xl uppercase tracking-tight text-slate-900">
                    Executive Growth Command
                  </h2>
                  <p className="text-xs text-slate-500 font-inter">
                    Real-time operational overview across campaigns, inbound inquiries, and content engine.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openNewBlogModal}
                    className="px-3 py-2 bg-brand-dark text-brand-lime hover:bg-black font-space font-bold text-xs uppercase rounded-xl border border-black transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Compose Story
                  </button>
                  <button
                    type="button"
                    onClick={openNewReviewModal}
                    className="px-3 py-2 bg-brand-blue text-white hover:bg-blue-700 font-space font-bold text-xs uppercase rounded-xl transition-colors border-none cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Review
                  </button>
                </div>
              </div>

              {/* Metric Stat Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <div className="text-[11px] font-space font-bold uppercase text-slate-500">Pipeline Leads</div>
                  <div className="font-space font-extrabold text-3xl text-slate-900 mt-1">{leads.length}</div>
                  <div className="text-[10px] text-emerald-600 font-space font-bold mt-1">⚡ Instant WhatsApp sync</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <div className="text-[11px] font-space font-bold uppercase text-slate-500">Published Stories</div>
                  <div className="font-space font-extrabold text-3xl text-brand-blue mt-1">{blogPosts.length}</div>
                  <div className="text-[10px] text-slate-500 font-space font-bold mt-1">Live in /blog directory</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <div className="text-[11px] font-space font-bold uppercase text-slate-500">Verified Reviews</div>
                  <div className="font-space font-extrabold text-3xl text-emerald-600 mt-1">{reviews.length}</div>
                  <div className="text-[10px] text-emerald-700 font-space font-bold mt-1">100% 5-Star Rating</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <div className="text-[11px] font-space font-bold uppercase text-slate-500">SEO Indexed Pages</div>
                  <div className="font-space font-extrabold text-3xl text-purple-600 mt-1">{Object.keys(seoCatalog).length}</div>
                  <div className="text-[10px] text-purple-700 font-space font-bold mt-1">Automated SERP Schema</div>
                </div>
              </div>

              {/* Recent Inquiries Preview Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-space font-bold text-sm uppercase text-slate-900">
                    Recent Inbound Growth Leads
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("leads")}
                    className="text-xs font-space font-bold uppercase text-brand-blue hover:underline bg-transparent border-none cursor-pointer"
                  >
                    View All Leads ({leads.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-space font-bold uppercase text-slate-400">
                        <th className="pb-3">Client</th>
                        <th className="pb-3">Service Required</th>
                        <th className="pb-3">Budget</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Quick Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.slice(0, 4).map(l => (
                        <tr key={l.id} className="hover:bg-slate-50/80">
                          <td className="py-3">
                            <div className="font-bold text-slate-900">{l.name}</div>
                            <div className="text-[11px] text-slate-500">{l.company}</div>
                          </td>
                          <td className="py-3">{l.service}</td>
                          <td className="py-3 font-space font-bold">{l.plan}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold uppercase font-space">
                              {l.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <a
                              href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(l.name)}%2C%20Ashish%20from%20GetIntoFeed%20here%20regarding%20your%20growth%20inquiry`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#25D366] text-white rounded-lg text-[11px] font-space font-bold uppercase no-underline shadow-xs"
                            >
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 2: INBOUND LEADS (CRM) */}
          {/* =============================================================== */}
          {activeTab === "leads" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-space font-extrabold text-2xl uppercase tracking-tight text-slate-900">
                    Inbound Leads & Client Inquiries
                  </h2>
                  <p className="text-xs text-slate-500 font-inter">
                    Direct lead entries from Case Study teardowns, Services Consultation modal, and Contact forms.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," + 
                        ["Name,Company,Email,Phone,Service,Plan,Status,Date,Requirements"].join(",") + "\n" +
                        leads.map(l => `"${l.name}","${l.company}","${l.email}","${l.phone}","${l.service}","${l.plan}","${l.status}","${l.date}","${(l.requirements||"").replace(/"/g, '""')}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `getintofeed-leads-${Date.now()}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-space font-bold text-xs uppercase rounded-xl transition-colors border-none cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by prospect name, company, email, phone..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full text-xs font-inter bg-transparent border-none focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-space font-bold text-slate-500 uppercase">Status:</span>
                  {["All", "New", "Contacted", "In Sprint", "Closed"].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setLeadFilterStatus(s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-space font-bold uppercase transition-colors border-none cursor-pointer ${leadFilterStatus === s ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leads Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-[10px] font-space font-bold uppercase text-slate-500">
                      <th className="p-4">Prospect</th>
                      <th className="p-4">Contact Coordinates</th>
                      <th className="p-4">Service & Plan</th>
                      <th className="p-4">Requirements</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50/80">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{l.name}</div>
                          <div className="text-[11px] text-slate-500 font-space font-bold uppercase">{l.company}</div>
                        </td>
                        <td className="p-4">
                          <div>{l.email}</div>
                          <div className="text-slate-500 font-space mt-0.5">{l.phone}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-brand-blue font-bold rounded text-[11px]">
                            {l.service}
                          </span>
                          <div className="text-[11px] font-space text-slate-500 mt-1">{l.plan}</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="text-[11px] text-slate-600 line-clamp-2">
                            {l.requirements || "General growth audit inquiry"}
                          </p>
                        </td>
                        <td className="p-4">
                          <select
                            value={l.status || "New"}
                            onChange={(e) => {
                              const updated = leads.map(item => item.id === l.id ? { ...item, status: e.target.value } : item);
                              setLeads(updated);
                              try { localStorage.setItem("gif_admin_leads", JSON.stringify(updated)); } catch {}
                              showNotice(`Lead status updated to ${e.target.value}`);
                            }}
                            className="text-[11px] font-space font-bold uppercase px-2 py-1 bg-slate-100 border border-slate-300 rounded-lg cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Sprint">In Sprint</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`https://wa.me/${(l.phone || "").replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(l.name)}%2C%20Ashish%20from%20GetIntoFeed%20here%20regarding%20your%20growth%20inquiry`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#25D366] text-white rounded-lg text-xs font-space font-bold uppercase no-underline shadow-xs"
                          >
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              if (!window.confirm(`Delete inquiry from ${l.name}?`)) return;
                              const updated = leads.filter(item => item.id !== l.id);
                              setLeads(updated);
                              try { localStorage.setItem("gif_admin_leads", JSON.stringify(updated)); } catch {}
                              showNotice("Lead record removed.");
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border-none bg-transparent cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 3: BLOG & PLAYBOOKS STUDIO (TOP-NOTCH EDITOR) */}
          {/* =============================================================== */}
          {activeTab === "blog" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-space font-extrabold text-2xl uppercase tracking-tight text-slate-900">
                    Blog & Editorial Playbooks Studio
                  </h2>
                  <p className="text-xs text-slate-500 font-inter">
                    Create, edit, and optimize algorithmic teardowns and strategic growth playbooks with live Google SERP preview.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewBlogModal}
                  className="px-4 py-2.5 bg-brand-dark hover:bg-black text-brand-lime font-space font-bold text-xs uppercase rounded-xl border-2 border-black transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> New Story / Playbook
                </button>
              </div>

              {/* Filter strip */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles by headline or keyword..."
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    className="w-full text-xs font-inter bg-transparent border-none focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-space font-bold text-slate-500 uppercase">Category:</span>
                  {["All", "Creative Strategy", "Paid Performance", "SEO & AI Citations", "Conversion Strategy"].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBlogCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-space font-bold uppercase transition-colors border-none cursor-pointer ${blogCategoryFilter === cat ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Articles Grid / Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-[10px] font-space font-bold uppercase text-slate-500">
                      <th className="p-4">Article Headline & Slug</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Reading Time</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {blogPosts
                      .filter(p => {
                        const matchCat = blogCategoryFilter === "All" || p.category === blogCategoryFilter;
                        const matchQ = !blogSearch || p.title.toLowerCase().includes(blogSearch.toLowerCase()) || p.slug.includes(blogSearch.toLowerCase());
                        return matchCat && matchQ;
                      })
                      .map(p => (
                        <tr key={p.slug} className="hover:bg-slate-50/80">
                          <td className="p-4 max-w-md">
                            <div className="font-bold text-slate-900 text-sm leading-snug">{p.title}</div>
                            <div className="text-[11px] text-brand-blue font-space mt-1 flex items-center gap-1">
                              <span>/blog/{p.slug}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-space font-bold text-[10px] uppercase">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{p.author || "Ashish Raghav"}</div>
                            <div className="text-[10px] text-slate-500">{p.authorRole || "Executive Director"}</div>
                          </td>
                          <td className="p-4 font-space text-slate-500">
                            {p.readTime || "5 min read"}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => openEditBlogModal(p)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-space font-bold uppercase transition-colors border-none cursor-pointer inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <a
                              href={`/blog/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-blue rounded-lg text-xs font-space font-bold uppercase transition-colors no-underline inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> View ↗
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteBlogPost(p.slug)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border-none bg-transparent cursor-pointer"
                              title="Delete Story"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 4: CLIENT REVIEWS & TESTIMONIALS CMS */}
          {/* =============================================================== */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-space font-extrabold text-2xl uppercase tracking-tight text-slate-900">
                    Client Reviews & Verified Testimonials
                  </h2>
                  <p className="text-xs text-slate-500 font-inter">
                    Manage founder & CMO endorsements displayed across the Homepage, Reviews Hub (/reviews), and Pitch Desks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewReviewModal}
                  className="px-4 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-space font-bold text-xs uppercase rounded-xl transition-all border-none cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Client Review
                </button>
              </div>

              {/* Reviews Visual Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="bg-white border-2 border-black rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {rev.verified !== false && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-space font-bold text-[10px] uppercase">
                            Verified Client
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 font-inter leading-relaxed italic">
                        "{rev.quote}"
                      </p>

                      {rev.metric && (
                        <div className="inline-block px-2.5 py-1 bg-brand-lime text-brand-dark rounded-md font-space font-extrabold text-[11px] uppercase border border-black/10">
                          {rev.metric}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
                          alt={rev.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">{rev.name}</div>
                          <div className="text-[10px] text-slate-500 font-inter">{rev.role}, {rev.company}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditReviewModal(rev, idx)}
                          className="p-1.5 text-slate-600 hover:text-brand-blue hover:bg-slate-100 rounded-lg border-none bg-transparent cursor-pointer"
                          title="Edit Review"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border-none bg-transparent cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 5: GLOBAL SEO & META TAGS MANAGER */}
          {/* =============================================================== */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-space font-extrabold text-2xl uppercase tracking-tight text-slate-900">
                    Global SEO & SERP Meta Tags Engine
                  </h2>
                  <p className="text-xs text-slate-500 font-inter">
                    Directly configure Meta Titles, Descriptions, and OpenGraph tags for every route with a live Google search preview simulator.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetSeo}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-space font-bold text-xs uppercase rounded-xl transition-colors border-none cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSeo}
                    className="px-4 py-2 bg-brand-lime text-brand-dark hover:bg-[#E2FF4D] font-space font-bold text-xs uppercase rounded-xl border border-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Page SEO
                  </button>
                </div>
              </div>

              {/* Route Selector Strip */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <div className="text-[11px] font-space font-bold uppercase text-slate-500 mb-2">
                  Select Target Route to Optimize:
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(defaultRoutesSEO).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedSeoRoute(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-space font-bold uppercase transition-all border-none cursor-pointer ${selectedSeoRoute === r ? "bg-brand-dark text-brand-lime shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                    >
                      {r === "/" ? "/ (Homepage)" : r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dual Column: SEO Form & Live Google SERP Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Input Form (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-space font-bold text-sm uppercase text-slate-900">
                      SEO Metadata for <span className="text-brand-blue">{selectedSeoRoute}</span>
                    </span>
                    <span className="text-[11px] font-space text-slate-400">Live Browser Sync</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-space font-bold uppercase text-slate-700">
                        SEO Meta Title
                      </label>
                      <span className={`text-[10px] font-space font-bold ${(currentSeoData.title || "").length > 60 ? "text-amber-600" : "text-emerald-600"}`}>
                        {(currentSeoData.title || "").length} / 60 characters
                      </span>
                    </div>
                    <input
                      type="text"
                      value={currentSeoData.title || ""}
                      onChange={(e) => handleUpdateCurrentSeo("title", e.target.value)}
                      placeholder="High-converting Title Tag..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-space font-bold uppercase text-slate-700">
                        Meta Description
                      </label>
                      <span className={`text-[10px] font-space font-bold ${(currentSeoData.description || "").length > 160 ? "text-amber-600" : "text-emerald-600"}`}>
                        {(currentSeoData.description || "").length} / 160 characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={currentSeoData.description || ""}
                      onChange={(e) => handleUpdateCurrentSeo("description", e.target.value)}
                      placeholder="Concise commercial summary showing in Google search results..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue focus:bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                      Target Focus Keywords (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={currentSeoData.keywords || ""}
                      onChange={(e) => handleUpdateCurrentSeo("keywords", e.target.value)}
                      placeholder="creative marketing, performance agency, meta ads..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                      OpenGraph Social Share Image URL (og:image)
                    </label>
                    <input
                      type="text"
                      value={currentSeoData.ogImage || ""}
                      onChange={(e) => handleUpdateCurrentSeo("ogImage", e.target.value)}
                      placeholder="https://www.getintofeed.com/assets/og-share.jpg"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSaveSeo}
                      className="w-full py-2.5 bg-brand-lime text-brand-dark hover:bg-[#E2FF4D] font-space font-bold text-xs uppercase tracking-wider rounded-xl border border-black shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Save Changes for {selectedSeoRoute}
                    </button>
                  </div>
                </div>

                {/* Right: Live Google SERP Simulator Card (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-space font-bold text-xs uppercase text-slate-500">
                      Live Google SERP Simulator
                    </span>
                    <span className="text-[10px] font-space font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                      Google Mobile & Desktop
                    </span>
                  </div>

                  {/* Google Snippet Box */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-1.5 shadow-xs font-sans">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-lime border border-black flex items-center justify-center text-[10px] font-space font-bold text-brand-dark">
                        G
                      </div>
                      <div>
                        <div className="text-[12px] text-slate-800 leading-none">GetIntoFeed Studio</div>
                        <div className="text-[10px] text-slate-500 leading-none mt-0.5">
                          https://www.getintofeed.com{selectedSeoRoute === "/" ? "" : selectedSeoRoute}
                        </div>
                      </div>
                    </div>

                    <div className="text-[#1a0dab] hover:underline text-base font-medium leading-snug cursor-pointer pt-1">
                      {currentSeoData.title || "GetIntoFeed | Creative Marketing Agency"}
                    </div>

                    <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-3">
                      {currentSeoData.description || "Premier creative performance marketing studio. We engineer thumb-stopping video reels, high-converting React funnels, and algorithmic paid media."}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                    <div className="font-space font-bold text-[11px] uppercase text-slate-900">
                      Agency SEO Health Check:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      <li>Title length: <strong>{(currentSeoData.title || "").length} chars</strong> (Ideal: 50–60)</li>
                      <li>Description length: <strong>{(currentSeoData.description || "").length} chars</strong> (Ideal: 120–160)</li>
                      <li>Canonical URL: <strong>https://www.getintofeed.com{selectedSeoRoute}</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 6: SERVICES CATALOG */}
          {/* =============================================================== */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-space font-extrabold text-2xl uppercase tracking-tight text-slate-900">
                  Services Catalog ({services.length} Core Disciplines)
                </h2>
                <p className="text-xs text-slate-500 font-inter">
                  Active agency disciplines rendered across the 3-column /services hub and navigation menus.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map(s => (
                  <div key={s.slug} className="bg-white border-2 border-black rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-space font-bold uppercase text-brand-blue">{s.deliverables?.length || 4} Deliverables</span>
                        <span className="font-space font-extrabold text-xs text-emerald-600">Starting {s.pricingTiers?.[0]?.price || "₹14,999"}</span>
                      </div>
                      <h3 className="font-space font-bold text-lg uppercase tracking-tight text-slate-900">{s.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-3">{s.shortDesc || s.overview}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={`/services/${s.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-space font-bold uppercase text-brand-blue hover:underline no-underline"
                      >
                        Preview Service Page ↗
                      </a>
                      <span className="text-[10px] font-space text-slate-400 uppercase">Production Node</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 7: CASE STUDIES CATALOG */}
          {/* =============================================================== */}
          {activeTab === "cases" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-space font-extrabold text-2xl uppercase tracking-tight text-slate-900">
                  Case Studies & Commercial Dossiers ({cases.length})
                </h2>
                <p className="text-xs text-slate-500 font-inter">
                  Verified client outcomes featured in the Work Portfolio with desktop sticky teardown cards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {cases.map(c => (
                  <div key={c.slug} className="bg-white border-2 border-black rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase rounded border border-black/10">
                          {c.brand}
                        </span>
                        <span className="font-space font-extrabold text-xs text-emerald-600">{c.metric}</span>
                      </div>
                      <h3 className="font-space font-bold text-base uppercase tracking-tight text-slate-900">{c.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{c.category}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={`/work/${c.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-space font-bold uppercase text-brand-blue hover:underline no-underline"
                      >
                        Preview Teardown ↗
                      </a>
                      <span className="text-[10px] font-space text-slate-400 uppercase">Sticky Card Enabled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =================================================================== */}
      {/* MODAL: TOP-NOTCH BLOG EDITOR STUDIO */}
      {/* =================================================================== */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#09090B] text-white px-6 py-4 flex items-center justify-between border-b border-black">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-brand-lime"></div>
                <h3 className="font-space font-extrabold text-base uppercase tracking-tight text-white">
                  {editingPost ? "Edit Growth Playbook" : "Compose New Playbook / Story"}
                </h3>
              </div>

              {/* Subtabs: Write, Preview, SEO */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setEditorSubTab("write")}
                  className={`px-3 py-1 rounded-lg text-xs font-space font-bold uppercase transition-all border-none cursor-pointer ${editorSubTab === "write" ? "bg-brand-lime text-brand-dark" : "text-white hover:bg-white/10"}`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setEditorSubTab("preview")}
                  className={`px-3 py-1 rounded-lg text-xs font-space font-bold uppercase transition-all border-none cursor-pointer ${editorSubTab === "preview" ? "bg-brand-lime text-brand-dark" : "text-white hover:bg-white/10"}`}
                >
                  Live Preview
                </button>
                <button
                  type="button"
                  onClick={() => setEditorSubTab("seo")}
                  className={`px-3 py-1 rounded-lg text-xs font-space font-bold uppercase transition-all border-none cursor-pointer ${editorSubTab === "seo" ? "bg-brand-lime text-brand-dark" : "text-white hover:bg-white/10"}`}
                >
                  SERP & SEO
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsBlogModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 bg-transparent border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveBlogPost} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* TOP METADATA ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                    Article Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogFormData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setBlogFormData(prev => ({
                        ...prev,
                        title: newTitle,
                        slug: prev.slug || slugify(newTitle)
                      }));
                    }}
                    placeholder="e.g. The Anatomy of a 3-Second Thumb-Stop Hook..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter font-semibold focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                    Category Pillar
                  </label>
                  <select
                    value={blogFormData.category}
                    onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    <option value="Creative Strategy">Creative Strategy</option>
                    <option value="Paid Performance">Paid Performance</option>
                    <option value="SEO & AI Citations">SEO & AI Citations</option>
                    <option value="Conversion Strategy">Conversion Strategy</option>
                    <option value="Video Production">Video Production</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                    Slug (/blog/slug)
                  </label>
                  <input
                    type="text"
                    value={blogFormData.slug}
                    onChange={(e) => setBlogFormData({ ...blogFormData, slug: slugify(e.target.value) })}
                    placeholder="thumb-stop-creative-hooks"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-space focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={blogFormData.author}
                    onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                    placeholder="Ashish Raghav"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                    Featured Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={blogFormData.coverImage}
                    onChange={(e) => setBlogFormData({ ...blogFormData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                  Executive Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  value={blogFormData.excerpt}
                  onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                  placeholder="If your frame 1 hook doesn't create immediate visual tension, your ad budget is burning..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              {/* SUBTAB 1: WRITE MODE (WITH RICH FORMATTING TOOLBAR) */}
              {editorSubTab === "write" && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => insertMarkdown("# ")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-space font-bold border-none bg-transparent cursor-pointer"
                        title="Heading 1"
                      >
                        <Heading1 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("## ")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-space font-bold border-none bg-transparent cursor-pointer"
                        title="Heading 2"
                      >
                        <Heading2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("### ")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-space font-bold border-none bg-transparent cursor-pointer"
                        title="Heading 3"
                      >
                        <Heading3 className="w-4 h-4" />
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("**", "**")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold border-none bg-transparent cursor-pointer"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("*", "*")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold border-none bg-transparent cursor-pointer"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("> ")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold border-none bg-transparent cursor-pointer"
                        title="Blockquote"
                      >
                        <Quote className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("- ")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold border-none bg-transparent cursor-pointer"
                        title="Bullet List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("1. ")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold border-none bg-transparent cursor-pointer"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("![Visual Breakdown](https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80)")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold border-none bg-transparent cursor-pointer"
                        title="Insert Image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("[Link Text](https://)")}
                        className="p-1.5 hover:bg-slate-200 rounded text-xs font-bold border-none bg-transparent cursor-pointer"
                        title="Insert Hyperlink"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] font-space text-slate-500">
                      Markdown Supported
                    </div>
                  </div>

                  <textarea
                    id="blog-content-editor"
                    rows={12}
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-mono leading-relaxed focus:outline-none focus:border-brand-blue focus:bg-white resize-y"
                    placeholder="# Main Heading..."
                  />
                </div>
              )}

              {/* SUBTAB 2: LIVE ARTICLE PREVIEW */}
              {editorSubTab === "preview" && (
                <div className="border border-slate-200 rounded-2xl p-6 bg-[#FAFAFA] space-y-6">
                  <div className="space-y-2 border-b border-slate-200 pb-4">
                    <span className="px-3 py-1 bg-brand-lime text-brand-dark font-space font-bold text-xs uppercase rounded-full border border-black/10">
                      {blogFormData.category}
                    </span>
                    <h1 className="font-space font-extrabold text-2xl sm:text-3xl uppercase text-slate-900 leading-tight">
                      {blogFormData.title || "Untitled Growth Playbook"}
                    </h1>
                    <div className="text-xs text-slate-500 font-space">
                      By {blogFormData.author} • {blogFormData.date}
                    </div>
                  </div>

                  {blogFormData.coverImage && (
                    <div className="rounded-2xl overflow-hidden aspect-video max-h-80 w-full border border-slate-200">
                      <img src={blogFormData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-inter space-y-4">
                    {blogFormData.content}
                  </div>
                </div>
              )}

              {/* SUBTAB 3: GOOGLE SERP & SEO INSPECTOR */}
              {editorSubTab === "seo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                        Custom SEO Title (Browser & Google)
                      </label>
                      <input
                        type="text"
                        value={blogFormData.seoTitle}
                        onChange={(e) => setBlogFormData({ ...blogFormData, seoTitle: e.target.value })}
                        placeholder={blogFormData.title}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                        Meta Description (Search Snippet)
                      </label>
                      <textarea
                        rows={3}
                        value={blogFormData.seoDescription}
                        onChange={(e) => setBlogFormData({ ...blogFormData, seoDescription: e.target.value })}
                        placeholder={blogFormData.excerpt}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                        Focus Keyword
                      </label>
                      <input
                        type="text"
                        value={blogFormData.focusKeyword}
                        onChange={(e) => setBlogFormData({ ...blogFormData, focusKeyword: e.target.value })}
                        placeholder="e.g. thumb stop hooks, meta ads 2026"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  {/* Google SERP Card Preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="text-[10px] font-space font-bold uppercase text-slate-500">
                      Live Google Search Snippet Preview:
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-1 shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-brand-lime border border-black flex items-center justify-center text-[9px] font-space font-bold text-brand-dark">
                          G
                        </div>
                        <div>
                          <div className="text-[11px] text-slate-800 leading-none">GetIntoFeed Studio</div>
                          <div className="text-[9px] text-slate-500 leading-none mt-0.5">
                            https://www.getintofeed.com &gt; blog &gt; {blogFormData.slug || "story-slug"}
                          </div>
                        </div>
                      </div>

                      <div className="text-[#1a0dab] text-sm font-medium hover:underline cursor-pointer pt-1">
                        {blogFormData.seoTitle || blogFormData.title || "Article Headline"} | GetIntoFeed
                      </div>

                      <p className="text-[12px] text-[#4d5156] leading-relaxed line-clamp-2">
                        {blogFormData.seoDescription || blogFormData.excerpt || "Article excerpt description..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-space font-bold text-xs uppercase rounded-xl transition-colors border-none cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-lime hover:bg-[#E2FF4D] text-brand-dark font-space font-extrabold text-xs uppercase tracking-wider rounded-xl border border-black shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> {editingPost ? "Save & Update Playbook" : "Publish Playbook Live →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT CLIENT REVIEW */}
      {/* =================================================================== */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-black rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-[#09090B] text-white px-6 py-4 flex items-center justify-between border-b border-black">
              <h3 className="font-space font-extrabold text-base uppercase tracking-tight text-white">
                {editingReviewIndex !== null ? "Edit Client Review" : "Add Verified Client Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 bg-transparent border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewFormData.name}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Singhania"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={reviewFormData.role}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, role: e.target.value })}
                    placeholder="Managing Director"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                    Company / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewFormData.company}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, company: e.target.value })}
                    placeholder="LuxeLiving Realty"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                    Star Rating (1 to 5)
                  </label>
                  <select
                    value={reviewFormData.rating}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                    Verified ROI Metric Tag
                  </label>
                  <input
                    type="text"
                    value={reviewFormData.metric}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, metric: e.target.value })}
                    placeholder="+380% ROAS"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                  Client Avatar / Headshot URL
                </label>
                <input
                  type="text"
                  value={reviewFormData.avatar}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-space font-bold uppercase text-slate-700 mb-1">
                  Client Quote / Testimonial Statement *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewFormData.quote}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, quote: e.target.value })}
                  placeholder="GetIntoFeed transformed our entire lead quality. HNIs are now booking private villa previews directly through WhatsApp..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-inter focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-space font-bold text-xs uppercase rounded-xl transition-colors border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-space font-bold text-xs uppercase rounded-xl transition-colors border-none cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
