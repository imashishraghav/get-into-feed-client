import "./admin.css";
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bold,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
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
  Flame,
  Globe2,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Link2,
  List,
  Lock,
  LogOut,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MoreVertical,
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
  Tag,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  Users,
  Video,
  Wand2,
  X,
  Zap
} from "lucide-react";

import { INITIAL_SERVICES, INITIAL_CASE_STUDIES, INITIAL_USERS } from "./adminData.js";
import { defaultBlogPosts } from "./Blog.jsx";
import { reviewsCatalog } from "./DetailPages.jsx";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminDashboard() {
  // 1. AUTH & USER STATE
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_admin_users");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_admin_current_user");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USERS[0]; // Default: Ashish Raghav (Administrator)
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem("gif_admin_logged_out") !== "true";
    } catch {
      return true;
    }
  });

  const [loginEmail, setLoginEmail] = useState("admin@getintofeed.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [loginError, setLoginError] = useState("");

  // 2. ACTIVE NAVIGATION TAB
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarServicesOpen, setSidebarServicesOpen] = useState(true);
  const [sidebarCasesOpen, setSidebarCasesOpen] = useState(true);
  const [sidebarBlogOpen, setSidebarBlogOpen] = useState(false);

  // 3. CATALOG DATA STATES
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_services_catalog");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SERVICES;
  });

  const [caseStudies, setCaseStudies] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_case_studies_catalog");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CASE_STUDIES;
  });

  const [blogPosts, setBlogPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_blog_posts");
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultBlogPosts;
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_reviews");
      if (saved) return JSON.parse(saved);
    } catch {}
    return reviewsCatalog;
  });

  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_admin_leads");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: "lead-1", name: "Varun Goel", company: "Zomato Cloud Kitchens", email: "varun@zomato-kitchens.com", phone: "+91 98110 44219", service: "Performance Marketing & ROAS", budget: "₹3,00,000 - ₹5,00,000", status: "New", date: "2026-09-05" },
      { id: "lead-2", name: "Ananya Mehta", company: "Nykaa D2C Luxe", email: "ananya@nykaaluxe.com", phone: "+91 99201 88312", service: "Short-Form Video & Reels", budget: "₹1,50,000 - ₹3,00,000", status: "Contacted", date: "2026-09-04" },
      { id: "lead-3", name: "Kunal Shah", company: "CRED FinTech", email: "kunal@cred-growth.com", phone: "+91 98450 11982", service: "Generative Engine Optimization (GEO)", budget: "₹5,00,000+", status: "Proposal Sent", date: "2026-09-03" },
      { id: "lead-4", name: "Rishi Kapoor", company: "Taj Luxury Stays", email: "rishi@tajvillas.com", phone: "+91 98210 77364", service: "Brand Positioning & Identity", budget: "₹3,00,000 - ₹5,00,000", status: "Won", date: "2026-09-01" }
    ];
  });

  const [comments, setComments] = useState(() => {
    try {
      const saved = localStorage.getItem("gif_admin_comments");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: "c-1", authorName: "Devansh Khurana", authorEmail: "dev@growthlab.io", postSlug: "enterprise-seo-ai-overviews-geo-playbook", content: "The insight about schema entity mapping for ChatGPT citation is pure gold. We implemented this last month and saw our AI referral traffic jump 34%!", status: "pending", date: "2026-09-04" },
      { id: "c-2", authorName: "Tanvi Saxena", authorEmail: "tanvi@d2cgrowth.com", postSlug: "thumb-stop-creative-hooks", content: "Great breakdown of the 1.5-second visual hook. Most brands fail here.", status: "approved", date: "2026-09-02" },
      { id: "c-3", authorName: "Crypto Bot 2026", authorEmail: "spam@crypto-pumps.xyz", postSlug: "death-of-third-party-cookies", content: "Free bitcoin rewards at bit-pump-free.xyz claim now!", status: "spam", date: "2026-09-01" }
    ];
  });

  // 4. ACTIVE EDITING STATES
  const [editingService, setEditingService] = useState(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);
  const [notification, setNotification] = useState("");

  // Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: "", email: "", password: "", role: "Editor" });

  // Persistence helpers
  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  const saveServicesToStorage = (updated) => {
    setServices(updated);
    try {
      localStorage.setItem("gif_services_catalog", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {}
  };

  const saveCaseStudiesToStorage = (updated) => {
    setCaseStudies(updated);
    try {
      localStorage.setItem("gif_case_studies_catalog", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch {}
  };

  const saveUsersToStorage = (updated) => {
    setUsers(updated);
    try {
      localStorage.setItem("gif_admin_users", JSON.stringify(updated));
    } catch {}
  };

  // Switch User helper
  const handleSwitchUser = (u) => {
    setCurrentUser(u);
    try {
      localStorage.setItem("gif_admin_current_user", JSON.stringify(u));
    } catch {}
    showNotice(`Logged in as ${u.name} (${u.role})`);
  };

  // Auth logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem("gif_admin_logged_out", "true");
    } catch {}
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      try {
        localStorage.removeItem("gif_admin_logged_out");
        localStorage.setItem("gif_admin_current_user", JSON.stringify(found));
      } catch {}
      setLoginError("");
    } else {
      const defaultAdmin = users[0];
      setCurrentUser(defaultAdmin);
      setIsAuthenticated(true);
      try {
        localStorage.removeItem("gif_admin_logged_out");
        localStorage.setItem("gif_admin_current_user", JSON.stringify(defaultAdmin));
      } catch {}
    }
  };

  // RBAC Permission Check
  const isAdmin = currentUser.role === "Administrator";
  const isEditorOrAdmin = currentUser.role === "Administrator" || currentUser.role === "Editor";

  // -------------------------------------------------------------
  // SERVICE ACTIONS
  // -------------------------------------------------------------
  const handleStartNewService = () => {
    if (!isEditorOrAdmin) {
      alert("Permission Denied: Only Administrators and Editors can add new services.");
      return;
    }
    const emptySvc = {
      slug: "new-service-" + Date.now().toString().slice(-4),
      title: "",
      shortDesc: "",
      icon: "Sparkles",
      category: "Creative Direction",
      deliverables: ["Deliverable Item 1", "Deliverable Item 2"],
      pricingTier: "From ₹65,000 / Sprint",
      overview: "",
      whatWeDo: [
        "Strategic market diagnosis and competitor positioning",
        "High-conversion creative assets and performance architecture"
      ],
      strategySteps: [
        { step: "01", name: "Strategic Discovery", desc: "Audit commercial position and set growth KPIs." },
        { step: "02", name: "Sprint Execution", desc: "Build deliverables and deploy campaign assets." }
      ],
      faqs: [
        { q: "What is the expected turnaround time?", a: "Standard execution timeline is 2 to 3 weeks." }
      ],
      status: "published",
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setEditingService(emptySvc);
    setActiveTab("edit_service");
  };

  const handleEditService = (s) => {
    if (!isEditorOrAdmin) {
      alert("Permission Denied: You have read-only access to services.");
      return;
    }
    setEditingService(JSON.parse(JSON.stringify(s)));
    setActiveTab("edit_service");
  };

  const handleSaveService = () => {
    if (!editingService.title.trim()) {
      alert("Please enter a Service Title.");
      return;
    }
    const slug = editingService.slug || slugify(editingService.title);
    const updatedSvc = {
      ...editingService,
      slug,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    const exists = services.some(s => s.slug === updatedSvc.slug);
    let newServices;
    if (exists) {
      newServices = services.map(s => s.slug === updatedSvc.slug ? updatedSvc : s);
    } else {
      newServices = [updatedSvc, ...services];
    }

    saveServicesToStorage(newServices);
    showNotice(`Service "${updatedSvc.title}" published & synced to live website!`);
    setActiveTab("services");
  };

  const handleDeleteService = (slug) => {
    if (!isAdmin) {
      alert("Permission Denied: Only Administrators can delete services.");
      return;
    }
    if (confirm("Are you sure you want to delete this service?")) {
      const filtered = services.filter(s => s.slug !== slug);
      saveServicesToStorage(filtered);
      showNotice("Service deleted.");
    }
  };

  // AI 1-Click Generator for Service
  const handleAIGenerateService = () => {
    if (!editingService.title) {
      alert("Please type a Service Title first (e.g. 'Enterprise Generative AI Marketing' or 'High-Converting TikTok Ads')");
      return;
    }
    const title = editingService.title;
    const generated = {
      ...editingService,
      shortDesc: `Engineered for commercial revenue velocity, high-retention engagement, and predictable customer acquisition across ${title}.`,
      overview: `In today's hyper-competitive digital ecosystem, derivative playbooks guarantee negative unit economics. Our ${title} practice combines mathematical targeting with category-defining creative execution to build compounding commercial moats, elevate brand status, and drive high-margin pipeline.`,
      deliverables: [
        `Custom ${title} Strategic Architecture`,
        "Comprehensive Figma Design & Asset Kit",
        "High-Velocity Creative Testing Matrix",
        "Conversion Rate & Analytics Integration",
        "Weekly Executive ROAS & KPI Reporting"
      ],
      whatWeDo: [
        `In-depth diagnosis of current market standing and competitor ${title} gaps`,
        "Rapid prototyping of high-converting visual assets and psychological hooks",
        "Rigorous technical integration ensuring zero attribution loss and full compliance",
        "Continuous weekly budget re-allocation towards proven commercial winners",
        "Executive dashboard delivering real-time pipeline visibility"
      ],
      strategySteps: [
        { step: "01", name: "Market Discovery & Audit", desc: "Audit commercial position, target personas, and existing conversion funnels." },
        { step: "02", name: "Creative Architecture", desc: "Develop category-defining messaging frameworks and visual asset libraries." },
        { step: "03", name: "Controlled Scaling Sprint", desc: "Deploy campaigns with real-time attribution and daily variation testing." },
        { step: "04", name: "Retention & Compounding", desc: "Implement automated retention flows to maximize customer lifetime value." }
      ],
      faqs: [
        { q: `How long before we see commercial impact from ${title}?`, a: "Initial qualitative traction is typically visible within 14 days, with full commercial pipeline scaling between weeks 4 and 8." },
        { q: "What assets do we need to provide before kickoff?", a: "We only require access to existing brand guidelines and analytics accounts. Our internal studio handles all scripting, design, and technical engineering." }
      ],
      pricingTier: "From ₹85,000 / Sprint"
    };
    setEditingService(generated);
    showNotice("✨ AI successfully populated all 7 service inner sections!");
  };

  // -------------------------------------------------------------
  // CASE STUDY ACTIONS
  // -------------------------------------------------------------
  const handleStartNewCaseStudy = () => {
    if (!isEditorOrAdmin) {
      alert("Permission Denied: Only Administrators and Editors can add case studies.");
      return;
    }
    const emptyCs = {
      slug: "new-case-" + Date.now().toString().slice(-4),
      brand: "",
      title: "",
      category: "E-Commerce & D2C",
      metric: "+320%",
      result: "Revenue Growth in 90 Days",
      year: "2025",
      services: ["Paid Ads", "Cinematic Video"],
      heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      challenge: "The brand struggled with declining ad efficiency and high acquisition costs on generic static ads.",
      strategy: "We engineered a 20-creator UGC video pipeline with high-intent landing page funnels.",
      results: [
        { label: "Revenue Generated", val: "₹55 Lakhs" },
        { label: "ROAS at Scale", val: "4.5x" }
      ],
      testimonial: {
        quote: "GetIntoFeed transformed our commercial trajectory with unmatched speed.",
        author: "Founder",
        role: "CEO"
      },
      status: "published",
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setEditingCaseStudy(emptyCs);
    setActiveTab("edit_caseStudy");
  };

  const handleEditCaseStudy = (cs) => {
    if (!isEditorOrAdmin) {
      alert("Permission Denied: You have read-only access.");
      return;
    }
    setEditingCaseStudy(JSON.parse(JSON.stringify(cs)));
    setActiveTab("edit_caseStudy");
  };

  const handleSaveCaseStudy = () => {
    if (!editingCaseStudy.brand || !editingCaseStudy.title) {
      alert("Please provide Brand Name and Headline Title.");
      return;
    }
    const slug = editingCaseStudy.slug || slugify(editingCaseStudy.brand);
    const updatedCs = {
      ...editingCaseStudy,
      slug,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    const exists = caseStudies.some(c => c.slug === updatedCs.slug);
    let newCases;
    if (exists) {
      newCases = caseStudies.map(c => c.slug === updatedCs.slug ? updatedCs : c);
    } else {
      newCases = [updatedCs, ...caseStudies];
    }

    saveCaseStudiesToStorage(newCases);
    showNotice(`Case Study "${updatedCs.brand}" saved and live!`);
    setActiveTab("caseStudies");
  };

  const handleDeleteCaseStudy = (slug) => {
    if (!isAdmin) {
      alert("Permission Denied: Only Administrators can delete case studies.");
      return;
    }
    if (confirm("Delete this case study?")) {
      const filtered = caseStudies.filter(c => c.slug !== slug);
      saveCaseStudiesToStorage(filtered);
      showNotice("Case study removed.");
    }
  };

  const handleAIGenerateCaseStudy = () => {
    if (!editingCaseStudy.brand) {
      alert("Please enter Brand Name first (e.g. 'Aura Botanicals' or 'Nova FinTech')");
      return;
    }
    const b = editingCaseStudy.brand;
    setEditingCaseStudy({
      ...editingCaseStudy,
      title: `Scaling ${b} to Market Leadership with High-Performance Acquisition Funnels`,
      metric: "5.2x",
      result: "Return On Ad Spend (ROAS)",
      services: ["Paid Ads", "Cinematic Video", "CRO Funnel"],
      challenge: `${b} was burning significant capital on generic static ads with rising customer acquisition costs and plateauing monthly run rates.`,
      strategy: `We deployed a rapid-fire creative testing engine with 35+ high-retention video variations, engineered friction-free checkout flows, and launched automated retention sequences.`,
      results: [
        { label: "New Pipeline Created", val: "₹64 Lakhs / mo" },
        { label: "Customer Acquisition Cost", val: "-48.5%" },
        { label: "Blended Return", val: "5.2x ROAS" }
      ],
      testimonial: {
        quote: `GetIntoFeed isn't just an agency; they are an unfair economic advantage. Our revenue doubled within 60 days of partnering with them.`,
        author: "Chief Growth Officer",
        role: `Executive Director, ${b}`
      }
    });
    showNotice("✨ AI populated case study challenge, strategy, KPIs, and testimonial!");
  };

  // -------------------------------------------------------------
  // USER MANAGEMENT (RBAC)
  // -------------------------------------------------------------
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Permission Denied: Only Administrators can create users.");
      return;
    }
    if (!newUserData.name || !newUserData.email) {
      alert("Please fill in Name and Email.");
      return;
    }
    const newUser = {
      id: "user-" + Date.now().toString().slice(-4),
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const updated = [...users, newUser];
    saveUsersToStorage(updated);
    setIsAddUserModalOpen(false);
    setNewUserData({ name: "", email: "", password: "", role: "Editor" });
    showNotice(`User ${newUser.name} created as ${newUser.role}!`);
  };

  const handleDeleteUser = (id) => {
    if (!isAdmin) {
      alert("Permission Denied: Only Administrators can delete users.");
      return;
    }
    if (id === currentUser.id) {
      alert("You cannot delete your own active account.");
      return;
    }
    if (confirm("Delete this user?")) {
      const updated = users.filter(u => u.id !== id);
      saveUsersToStorage(updated);
      showNotice("User deleted.");
    }
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN SCREEN (IF LOGGED OUT)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="wp-login-wrapper">
        <div className="wp-login-box">
          <div className="wp-login-logo">
            <span className="wp-brand-title">GETINTOFEED</span>
            <span className="wp-brand-dot"></span>
          </div>

          <div className="wp-login-card">
            <h2>Sign In to CMS</h2>
            <p className="wp-login-subtitle">WordPress-Simple Content Management System</p>

            {loginError && <div className="wp-notice-error">{loginError}</div>}

            <form onSubmit={handleLogin}>
              <div className="wp-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="wp-form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="wp-btn wp-btn-primary wp-btn-block">
                Log In to Dashboard
              </button>
            </form>

            <div className="wp-demo-quick-logins">
              <span className="wp-demo-label">1-Click Test Accounts:</span>
              <div className="wp-demo-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail("admin@getintofeed.com");
                    setCurrentUser(users[0]);
                    setIsAuthenticated(true);
                  }}
                  className="wp-btn-pill wp-btn-pill-admin"
                >
                  👑 Administrator (Full Access)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail("editor@getintofeed.com");
                    setCurrentUser(users[1] || users[0]);
                    setIsAuthenticated(true);
                  }}
                  className="wp-btn-pill wp-btn-pill-editor"
                >
                  ✏️ Editor (Manage & Publish)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail("author@getintofeed.com");
                    setCurrentUser(users[2] || users[0]);
                    setIsAuthenticated(true);
                  }}
                  className="wp-btn-pill wp-btn-pill-author"
                >
                  ✍️ Author (Draft Mode)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: WORDPRESS DASHBOARD MAIN SHELL
  // -------------------------------------------------------------
  return (
    <div className="wp-admin-body">
      {/* 1. TOP ADMIN BAR */}
      <header className="wp-topbar">
        <div className="wp-topbar-left">
          <div className="wp-site-brand">
            <span className="wp-site-icon">⚡</span>
            <span className="wp-site-name">Get Into Feed</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="wp-topbar-link"
          >
            <ExternalLink size={13} /> Visit Site
          </a>
        </div>

        <div className="wp-topbar-right">
          {/* Quick RBAC Switcher */}
          <div className="wp-role-switcher">
            <span className="wp-role-label">Role Switcher:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = users.find(u => u.id === e.target.value);
                if (selected) handleSwitchUser(selected);
              }}
              className="wp-role-select"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="wp-user-profile">
            <img src={currentUser.avatar} alt={currentUser.name} className="wp-user-avatar" />
            <span className="wp-user-greeting">Howdy, <strong>{currentUser.name}</strong></span>
            <span className={`wp-badge-role wp-role-${currentUser.role.toLowerCase()}`}>
              {currentUser.role}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="wp-logout-btn"
            title="Log Out"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </header>

      {/* 2. ADMIN CONTAINER (SIDEBAR + MAIN CANVAS) */}
      <div className="wp-admin-container">
        {/* SIDEBAR */}
        <aside className="wp-sidebar">
          <nav className="wp-nav">
            {/* Dashboard */}
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`wp-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            {/* Services Menu */}
            <div className="wp-nav-group">
              <button
                type="button"
                onClick={() => { setActiveTab("services"); setSidebarServicesOpen(!sidebarServicesOpen); }}
                className={`wp-nav-item wp-nav-parent ${activeTab.includes("service") ? "active" : ""}`}
              >
                <div className="wp-nav-parent-title">
                  <PenTool size={16} />
                  <span>Services</span>
                </div>
                <ChevronDown size={14} className={`wp-arrow ${sidebarServicesOpen ? "open" : ""}`} />
              </button>
              {sidebarServicesOpen && (
                <div className="wp-subnav">
                  <button
                    type="button"
                    onClick={() => setActiveTab("services")}
                    className={`wp-subnav-item ${activeTab === "services" ? "active" : ""}`}
                  >
                    All Services ({services.length})
                  </button>
                  {isEditorOrAdmin && (
                    <button
                      type="button"
                      onClick={handleStartNewService}
                      className={`wp-subnav-item ${activeTab === "edit_service" && !editingService?.title ? "active" : ""}`}
                    >
                      + Add New Service
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Case Studies Menu */}
            <div className="wp-nav-group">
              <button
                type="button"
                onClick={() => { setActiveTab("caseStudies"); setSidebarCasesOpen(!sidebarCasesOpen); }}
                className={`wp-nav-item wp-nav-parent ${activeTab.includes("caseStudy") || activeTab === "caseStudies" ? "active" : ""}`}
              >
                <div className="wp-nav-parent-title">
                  <Sparkles size={16} />
                  <span>Case Studies</span>
                </div>
                <ChevronDown size={14} className={`wp-arrow ${sidebarCasesOpen ? "open" : ""}`} />
              </button>
              {sidebarCasesOpen && (
                <div className="wp-subnav">
                  <button
                    type="button"
                    onClick={() => setActiveTab("caseStudies")}
                    className={`wp-subnav-item ${activeTab === "caseStudies" ? "active" : ""}`}
                  >
                    All Case Studies ({caseStudies.length})
                  </button>
                  {isEditorOrAdmin && (
                    <button
                      type="button"
                      onClick={handleStartNewCaseStudy}
                      className={`wp-subnav-item ${activeTab === "edit_caseStudy" && !editingCaseStudy?.brand ? "active" : ""}`}
                    >
                      + Add New Case Study
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Blog Posts */}
            <div className="wp-nav-group">
              <button
                type="button"
                onClick={() => { setActiveTab("blog"); setSidebarBlogOpen(!sidebarBlogOpen); }}
                className={`wp-nav-item wp-nav-parent ${activeTab.includes("blog") ? "active" : ""}`}
              >
                <div className="wp-nav-parent-title">
                  <FileText size={16} />
                  <span>Blog Playbooks</span>
                </div>
                <ChevronDown size={14} className={`wp-arrow ${sidebarBlogOpen ? "open" : ""}`} />
              </button>
              {sidebarBlogOpen && (
                <div className="wp-subnav">
                  <button
                    type="button"
                    onClick={() => setActiveTab("blog")}
                    className={`wp-subnav-item ${activeTab === "blog" ? "active" : ""}`}
                  >
                    All Posts ({blogPosts.length})
                  </button>
                </div>
              )}
            </div>

            {/* Testimonials */}
            <button
              type="button"
              onClick={() => setActiveTab("testimonials")}
              className={`wp-nav-item ${activeTab === "testimonials" ? "active" : ""}`}
            >
              <Star size={16} />
              <span>Reviews & Trust</span>
            </button>

            {/* Leads CRM */}
            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`wp-nav-item ${activeTab === "leads" ? "active" : ""}`}
            >
              <Mail size={16} />
              <span>Inbound Leads</span>
              <span className="wp-nav-counter">{leads.length}</span>
            </button>

            {/* Comments Moderation */}
            <button
              type="button"
              onClick={() => setActiveTab("comments")}
              className={`wp-nav-item ${activeTab === "comments" ? "active" : ""}`}
            >
              <MessageSquare size={16} />
              <span>Comments</span>
              <span className="wp-nav-counter">{comments.length}</span>
            </button>

            <div className="wp-nav-divider"></div>

            {/* Users (Admin Only) */}
            <button
              type="button"
              onClick={() => {
                if (isAdmin) setActiveTab("users");
                else alert("Access Restricted: Administrator privileges required to manage users.");
              }}
              className={`wp-nav-item ${activeTab === "users" ? "active" : ""} ${!isAdmin ? "wp-disabled" : ""}`}
            >
              <Users size={16} />
              <span>Users & Roles</span>
              {!isAdmin && <Lock size={12} className="wp-lock-icon" />}
            </button>

            {/* Settings (Admin Only) */}
            <button
              type="button"
              onClick={() => {
                if (isAdmin) setActiveTab("settings");
                else alert("Access Restricted: Administrator privileges required to change site settings.");
              }}
              className={`wp-nav-item ${activeTab === "settings" ? "active" : ""} ${!isAdmin ? "wp-disabled" : ""}`}
            >
              <Settings size={16} />
              <span>Settings</span>
              {!isAdmin && <Lock size={12} className="wp-lock-icon" />}
            </button>
          </nav>
        </aside>

        {/* MAIN CANVAS */}
        <main className="wp-main-canvas">
          {notification && (
            <div className="wp-notification-banner">
              <CheckCircle2 size={16} />
              <span>{notification}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="wp-tab-content">
              <div className="wp-page-header">
                <h1>Dashboard</h1>
                <p>Welcome back to GetIntoFeed Central Administration.</p>
              </div>

              {/* Welcome Card */}
              <div className="wp-welcome-card">
                <div className="wp-welcome-text">
                  <h2>Welcome to your WordPress-Simple Agency CMS!</h2>
                  <p>
                    Everything you publish here synchronizes dynamically with your live website inner pages.
                    Manage services, case studies, inbound client leads, and team roles with ease.
                  </p>
                  <div className="wp-welcome-actions">
                    {isEditorOrAdmin && (
                      <>
                        <button type="button" onClick={handleStartNewService} className="wp-btn wp-btn-primary">
                          <Plus size={15} /> Add New Service
                        </button>
                        <button type="button" onClick={handleStartNewCaseStudy} className="wp-btn wp-btn-secondary">
                          <Sparkles size={15} /> Add Case Study
                        </button>
                      </>
                    )}
                    <a href="/" target="_blank" rel="noreferrer" className="wp-btn wp-btn-outline">
                      <ExternalLink size={15} /> Visit Website
                    </a>
                  </div>
                </div>
              </div>

              {/* At a Glance Stats */}
              <div className="wp-stats-grid">
                <div className="wp-stat-box" onClick={() => setActiveTab("services")}>
                  <div className="wp-stat-icon wp-icon-blue"><PenTool size={20} /></div>
                  <div className="wp-stat-num">{services.length}</div>
                  <div className="wp-stat-lbl">Published Services</div>
                </div>

                <div className="wp-stat-box" onClick={() => setActiveTab("caseStudies")}>
                  <div className="wp-stat-icon wp-icon-purple"><Sparkles size={20} /></div>
                  <div className="wp-stat-num">{caseStudies.length}</div>
                  <div className="wp-stat-lbl">Active Case Studies</div>
                </div>

                <div className="wp-stat-box" onClick={() => setActiveTab("leads")}>
                  <div className="wp-stat-icon wp-icon-green"><Mail size={20} /></div>
                  <div className="wp-stat-num">{leads.length}</div>
                  <div className="wp-stat-lbl">Inbound Leads</div>
                </div>

                <div className="wp-stat-box" onClick={() => setActiveTab("users")}>
                  <div className="wp-stat-icon wp-icon-amber"><Users size={20} /></div>
                  <div className="wp-stat-num">{users.length}</div>
                  <div className="wp-stat-lbl">Team Members</div>
                </div>
              </div>

              {/* Recent Inbound Leads Table */}
              <div className="wp-card wp-mt-4">
                <div className="wp-card-header">
                  <h3>Recent Inbound Enquiries (CRM)</h3>
                  <button type="button" onClick={() => setActiveTab("leads")} className="wp-btn-link">View All Leads →</button>
                </div>
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>Prospect Name</th>
                      <th>Company</th>
                      <th>Service Required</th>
                      <th>Budget Tier</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.slice(0, 4).map(lead => (
                      <tr key={lead.id}>
                        <td><strong>{lead.name}</strong><br /><small className="wp-sub-text">{lead.email}</small></td>
                        <td>{lead.company}</td>
                        <td><span className="wp-badge-tag">{lead.service}</span></td>
                        <td>{lead.budget}</td>
                        <td><span className={`wp-status-pill wp-status-${lead.status.toLowerCase().replace(/\s+/g, '-')}`}>{lead.status}</span></td>
                        <td>{lead.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: ALL SERVICES */}
          {/* ======================================================== */}
          {activeTab === "services" && (
            <div className="wp-tab-content">
              <div className="wp-page-header wp-header-with-action">
                <div>
                  <h1>Services</h1>
                  <p>All capabilities appearing on the website, header dropdown, and dedicated inner pages.</p>
                </div>
                {isEditorOrAdmin && (
                  <button type="button" onClick={handleStartNewService} className="wp-btn wp-btn-primary">
                    <Plus size={15} /> Add New Service
                  </button>
                )}
              </div>

              <div className="wp-card">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>Title & Inner Page Slug</th>
                      <th>Category</th>
                      <th>Starting Price</th>
                      <th>Deliverables</th>
                      <th>Roadmap Steps</th>
                      <th>FAQs</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(s => (
                      <tr key={s.slug} className="wp-row-hoverable">
                        <td>
                          <div className="wp-item-title">{s.title}</div>
                          <div className="wp-permalink-preview">/services/{s.slug}</div>
                          <div className="wp-row-actions">
                            {isEditorOrAdmin && (
                              <button type="button" onClick={() => handleEditService(s)} className="wp-row-action-link wp-action-edit">
                                Edit Inner Page
                              </button>
                            )}
                            <a href={`/services/${s.slug}`} target="_blank" rel="noreferrer" className="wp-row-action-link wp-action-view">
                              View Live ↗
                            </a>
                            {isAdmin && (
                              <button type="button" onClick={() => handleDeleteService(s.slug)} className="wp-row-action-link wp-action-trash">
                                Trash
                              </button>
                            )}
                          </div>
                        </td>
                        <td><span className="wp-badge-category">{s.category}</span></td>
                        <td><strong>{s.pricingTier || "Custom"}</strong></td>
                        <td>{s.deliverables?.length || 0} items</td>
                        <td>{s.strategySteps?.length || 4} steps</td>
                        <td>{s.faqs?.length || 0} FAQs</td>
                        <td><span className="wp-status-pill wp-status-published">Published</span></td>
                        <td>
                          {isEditorOrAdmin && (
                            <button type="button" onClick={() => handleEditService(s)} className="wp-btn-sm wp-btn-outline">
                              <Edit3 size={13} /> Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: EDIT / ADD SERVICE (2-COLUMN WORDPRESS GUTENBERG STYLE) */}
          {/* ======================================================== */}
          {activeTab === "edit_service" && editingService && (
            <div className="wp-tab-content">
              <div className="wp-edit-header">
                <button type="button" onClick={() => setActiveTab("services")} className="wp-back-btn">
                  <ArrowLeft size={16} /> Back to All Services
                </button>
                <h2>{editingService.title ? `Edit Service: ${editingService.title}` : "Add New Service"}</h2>
              </div>

              <div className="wp-edit-grid">
                {/* LEFT MAIN COLUMN: All 7 Inner Page Sections */}
                <div className="wp-edit-main-col">
                  {/* Document Title Input */}
                  <div className="wp-title-box">
                    <label>Service Headline Title *</label>
                    <input
                      type="text"
                      className="wp-input-title"
                      placeholder="e.g. Brand Positioning & Visual Identity"
                      value={editingService.title}
                      onChange={(e) => setEditingService({
                        ...editingService,
                        title: e.target.value,
                        slug: editingService.slug || slugify(e.target.value)
                      })}
                    />
                  </div>

                  {/* Permalink row */}
                  <div className="wp-permalink-bar">
                    <span className="wp-permalink-label">Permalink:</span>
                    <span className="wp-permalink-url">https://getintofeed-client.vercel.app/services/</span>
                    <input
                      type="text"
                      className="wp-permalink-slug-input"
                      value={editingService.slug}
                      onChange={(e) => setEditingService({ ...editingService, slug: slugify(e.target.value) })}
                    />
                  </div>

                  {/* Section 1: Overview & Pricing */}
                  <div className="wp-meta-box">
                    <div className="wp-meta-box-header">
                      <h3>1. Commercial Overview & Pricing Tier</h3>
                    </div>
                    <div className="wp-meta-box-body">
                      <div className="wp-form-row-2">
                        <div className="wp-form-group">
                          <label>Discipline Category *</label>
                          <select
                            value={editingService.category}
                            onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                          >
                            <option value="Creative Direction">Creative Direction</option>
                            <option value="Paid Performance">Paid Performance</option>
                            <option value="Organic Social">Organic Social</option>
                            <option value="Video & Creative">Video & Creative</option>
                            <option value="Web Engineering">Web Engineering</option>
                            <option value="Search Intelligence">Search Intelligence</option>
                            <option value="Influencer Marketing">Influencer Marketing</option>
                            <option value="Growth Analytics">Growth Analytics</option>
                          </select>
                        </div>
                        <div className="wp-form-group">
                          <label>Starting Pricing Tier (e.g. From ₹75,000 / Sprint) *</label>
                          <input
                            type="text"
                            value={editingService.pricingTier}
                            onChange={(e) => setEditingService({ ...editingService, pricingTier: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="wp-form-group">
                        <label>Short Description (Shown on Cards & Dropdowns) *</label>
                        <textarea
                          rows={2}
                          value={editingService.shortDesc}
                          onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                          placeholder="Architect high-status brand narratives that command premium pricing..."
                        />
                      </div>

                      <div className="wp-form-group">
                        <label>Extended Strategic Overview (Inner Page Hero Narrative) *</label>
                        <textarea
                          rows={4}
                          value={editingService.overview}
                          onChange={(e) => setEditingService({ ...editingService, overview: e.target.value })}
                          placeholder="Explain why this service provides an economic moat for clients..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Deliverables Scope Checklist */}
                  <div className="wp-meta-box">
                    <div className="wp-meta-box-header">
                      <h3>2. Deliverables Scope Checklist (1 by 1)</h3>
                      <button
                        type="button"
                        onClick={() => setEditingService({
                          ...editingService,
                          deliverables: [...(editingService.deliverables || []), "New Deliverable Item"]
                        })}
                        className="wp-btn-sm wp-btn-outline"
                      >
                        + Add Deliverable
                      </button>
                    </div>
                    <div className="wp-meta-box-body">
                      {(editingService.deliverables || []).map((item, idx) => (
                        <div key={idx} className="wp-dynamic-item-row">
                          <Check size={16} className="wp-check-icon" />
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...editingService.deliverables];
                              updated[idx] = e.target.value;
                              setEditingService({ ...editingService, deliverables: updated });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingService.deliverables.filter((_, i) => i !== idx);
                              setEditingService({ ...editingService, deliverables: updated });
                            }}
                            className="wp-item-delete-btn"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: What We Do (Core Pillars) */}
                  <div className="wp-meta-box">
                    <div className="wp-meta-box-header">
                      <h3>3. What We Do (Capabilities & Methodologies)</h3>
                      <button
                        type="button"
                        onClick={() => setEditingService({
                          ...editingService,
                          whatWeDo: [...(editingService.whatWeDo || []), "New capability item"]
                        })}
                        className="wp-btn-sm wp-btn-outline"
                      >
                        + Add Bullet
                      </button>
                    </div>
                    <div className="wp-meta-box-body">
                      {(editingService.whatWeDo || []).map((item, idx) => (
                        <div key={idx} className="wp-dynamic-item-row">
                          <span className="wp-bullet-num">#{idx + 1}</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...editingService.whatWeDo];
                              updated[idx] = e.target.value;
                              setEditingService({ ...editingService, whatWeDo: updated });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingService.whatWeDo.filter((_, i) => i !== idx);
                              setEditingService({ ...editingService, whatWeDo: updated });
                            }}
                            className="wp-item-delete-btn"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: 4-Step Execution Roadmap */}
                  <div className="wp-meta-box">
                    <div className="wp-meta-box-header">
                      <h3>4. 4-Step Execution Roadmap</h3>
                      <button
                        type="button"
                        onClick={() => setEditingService({
                          ...editingService,
                          strategySteps: [...(editingService.strategySteps || []), {
                            step: String((editingService.strategySteps?.length || 0) + 1).padStart(2, "0"),
                            name: "New Execution Phase",
                            desc: "Phase deliverables and commercial targets."
                          }]
                        })}
                        className="wp-btn-sm wp-btn-outline"
                      >
                        + Add Step
                      </button>
                    </div>
                    <div className="wp-meta-box-body">
                      {(editingService.strategySteps || []).map((step, idx) => (
                        <div key={idx} className="wp-step-card">
                          <div className="wp-step-card-top">
                            <input
                              type="text"
                              className="wp-step-num-input"
                              value={step.step}
                              onChange={(e) => {
                                const updated = [...editingService.strategySteps];
                                updated[idx].step = e.target.value;
                                setEditingService({ ...editingService, strategySteps: updated });
                              }}
                            />
                            <input
                              type="text"
                              className="wp-step-name-input"
                              placeholder="Step Name"
                              value={step.name}
                              onChange={(e) => {
                                const updated = [...editingService.strategySteps];
                                updated[idx].name = e.target.value;
                                setEditingService({ ...editingService, strategySteps: updated });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingService.strategySteps.filter((_, i) => i !== idx);
                                setEditingService({ ...editingService, strategySteps: updated });
                              }}
                              className="wp-item-delete-btn"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Step Description"
                            value={step.desc}
                            onChange={(e) => {
                              const updated = [...editingService.strategySteps];
                              updated[idx].desc = e.target.value;
                              setEditingService({ ...editingService, strategySteps: updated });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 5: Frequently Asked Questions (FAQ Accordion) */}
                  <div className="wp-meta-box">
                    <div className="wp-meta-box-header">
                      <h3>5. Frequently Asked Questions (Accordion)</h3>
                      <button
                        type="button"
                        onClick={() => setEditingService({
                          ...editingService,
                          faqs: [...(editingService.faqs || []), { q: "New Question?", a: "Detailed answer..." }]
                        })}
                        className="wp-btn-sm wp-btn-outline"
                      >
                        + Add FAQ
                      </button>
                    </div>
                    <div className="wp-meta-box-body">
                      {(editingService.faqs || []).map((faq, idx) => (
                        <div key={idx} className="wp-faq-card">
                          <div className="wp-faq-card-top">
                            <HelpCircle size={16} className="wp-faq-icon" />
                            <input
                              type="text"
                              placeholder="Question"
                              value={faq.q}
                              onChange={(e) => {
                                const updated = [...editingService.faqs];
                                updated[idx].q = e.target.value;
                                setEditingService({ ...editingService, faqs: updated });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingService.faqs.filter((_, i) => i !== idx);
                                setEditingService({ ...editingService, faqs: updated });
                              }}
                              className="wp-item-delete-btn"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Answer"
                            value={faq.a}
                            onChange={(e) => {
                              const updated = [...editingService.faqs];
                              updated[idx].a = e.target.value;
                              setEditingService({ ...editingService, faqs: updated });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDEBAR COLUMN: Publish & AI Generator */}
                <div className="wp-edit-side-col">
                  {/* PUBLISH BOX (CLASSIC WORDPRESS) */}
                  <div className="wp-side-box">
                    <div className="wp-side-box-header">
                      <h3>Publish</h3>
                    </div>
                    <div className="wp-side-box-body">
                      <div className="wp-publish-meta-row">
                        <span>Status:</span> <strong>{editingService.status === "published" ? "Published" : "Draft"}</strong>
                      </div>
                      <div className="wp-publish-meta-row">
                        <span>Visibility:</span> <strong>Public</strong>
                      </div>
                      <div className="wp-publish-meta-row">
                        <span>Last Updated:</span> <strong>{editingService.updatedAt || "Today"}</strong>
                      </div>

                      <div className="wp-publish-actions">
                        <button
                          type="button"
                          onClick={handleSaveService}
                          className="wp-btn wp-btn-primary wp-btn-block"
                        >
                          <Save size={15} /> Update & Publish Service
                        </button>

                        <a
                          href={`/services/${editingService.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="wp-btn wp-btn-outline wp-btn-block wp-mt-2"
                        >
                          <Eye size={15} /> View Live Page ↗
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* AI 1-CLICK ASSISTANT */}
                  <div className="wp-side-box wp-box-ai">
                    <div className="wp-side-box-header">
                      <h3><Wand2 size={15} /> 1-Click AI Auto-Fill</h3>
                    </div>
                    <div className="wp-side-box-body">
                      <p className="wp-ai-helper-text">
                        Type your Service Headline Title on the left, then click below.
                        AI will automatically write the <strong>Overview</strong>, <strong>Deliverables</strong>, <strong>Core Capabilities</strong>, <strong>4-Step Roadmap</strong>, and <strong>FAQs</strong>!
                      </p>
                      <button
                        type="button"
                        onClick={handleAIGenerateService}
                        className="wp-btn wp-btn-ai wp-btn-block"
                      >
                        <Sparkles size={15} /> ✨ Auto-Fill All 7 Sections
                      </button>
                    </div>
                  </div>

                  {/* SERVICE ICON SELECTOR */}
                  <div className="wp-side-box">
                    <div className="wp-side-box-header">
                      <h3>Service Icon</h3>
                    </div>
                    <div className="wp-side-box-body">
                      <select
                        value={editingService.icon || "PenTool"}
                        onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                        className="wp-select"
                      >
                        <option value="PenTool">PenTool (Branding & Identity)</option>
                        <option value="Megaphone">Megaphone (Performance Ads)</option>
                        <option value="Users">Users (Social & Community)</option>
                        <option value="Video">Video (Reels & Film)</option>
                        <option value="Code">Code (Web & Funnels)</option>
                        <option value="Search">Search (SEO & GEO)</option>
                        <option value="Sparkles">Sparkles (Influencer Network)</option>
                        <option value="Sliders">Sliders (Analytics & CRO)</option>
                        <option value="Globe2">Globe2 (Global Reach)</option>
                        <option value="Flame">Flame (Viral Hooks)</option>
                        <option value="Zap">Zap (Growth Engine)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: ALL CASE STUDIES */}
          {/* ======================================================== */}
          {activeTab === "caseStudies" && (
            <div className="wp-tab-content">
              <div className="wp-page-header wp-header-with-action">
                <div>
                  <h1>Case Studies / Portfolio</h1>
                  <p>Client growth stories, challenge breakdowns, verified ROAS metrics, and client quotes.</p>
                </div>
                {isEditorOrAdmin && (
                  <button type="button" onClick={handleStartNewCaseStudy} className="wp-btn wp-btn-primary">
                    <Plus size={15} /> Add New Case Study
                  </button>
                )}
              </div>

              <div className="wp-card">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>Brand / Client</th>
                      <th>Headline Title</th>
                      <th>Category</th>
                      <th>Hero Metric</th>
                      <th>Year</th>
                      <th>Services</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseStudies.map(cs => (
                      <tr key={cs.slug} className="wp-row-hoverable">
                        <td>
                          <div className="wp-item-title">{cs.brand}</div>
                          <div className="wp-permalink-preview">/work/{cs.slug}</div>
                          <div className="wp-row-actions">
                            {isEditorOrAdmin && (
                              <button type="button" onClick={() => handleEditCaseStudy(cs)} className="wp-row-action-link wp-action-edit">
                                Edit Case Study
                              </button>
                            )}
                            <a href={`/work/${cs.slug}`} target="_blank" rel="noreferrer" className="wp-row-action-link wp-action-view">
                              View Live ↗
                            </a>
                            {isAdmin && (
                              <button type="button" onClick={() => handleDeleteCaseStudy(cs.slug)} className="wp-row-action-link wp-action-trash">
                                Trash
                              </button>
                            )}
                          </div>
                        </td>
                        <td>{cs.title}</td>
                        <td><span className="wp-badge-category">{cs.category}</span></td>
                        <td><span className="wp-badge-metric">{cs.metric}</span></td>
                        <td>{cs.year}</td>
                        <td>{Array.isArray(cs.services) ? cs.services.join(", ") : cs.services}</td>
                        <td>
                          {isEditorOrAdmin && (
                            <button type="button" onClick={() => handleEditCaseStudy(cs)} className="wp-btn-sm wp-btn-outline">
                              <Edit3 size={13} /> Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: EDIT / ADD CASE STUDY */}
          {/* ======================================================== */}
          {activeTab === "edit_caseStudy" && editingCaseStudy && (
            <div className="wp-tab-content">
              <div className="wp-edit-header">
                <button type="button" onClick={() => setActiveTab("caseStudies")} className="wp-back-btn">
                  <ArrowLeft size={16} /> Back to All Case Studies
                </button>
                <h2>{editingCaseStudy.brand ? `Edit: ${editingCaseStudy.brand}` : "Add New Case Study"}</h2>
              </div>

              <div className="wp-edit-grid">
                <div className="wp-edit-main-col">
                  {/* Brand & Headline */}
                  <div className="wp-title-box">
                    <label>Client / Brand Name *</label>
                    <input
                      type="text"
                      className="wp-input-title"
                      placeholder="e.g. LuxeLiving Realty or GlowUp D2C"
                      value={editingCaseStudy.brand}
                      onChange={(e) => setEditingCaseStudy({
                        ...editingCaseStudy,
                        brand: e.target.value,
                        slug: editingCaseStudy.slug || slugify(e.target.value)
                      })}
                    />
                  </div>

                  <div className="wp-meta-box">
                    <div className="wp-meta-box-header">
                      <h3>1. Headline & Hero Metrics</h3>
                    </div>
                    <div className="wp-meta-box-body">
                      <div className="wp-form-group">
                        <label>Case Study Headline Title *</label>
                        <input
                          type="text"
                          value={editingCaseStudy.title}
                          onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, title: e.target.value })}
                          placeholder="Scaling Luxury Real Estate Inbound Pipeline to ₹42Cr in 90 Days"
                        />
                      </div>

                      <div className="wp-form-row-3">
                        <div className="wp-form-group">
                          <label>Category *</label>
                          <input
                            type="text"
                            value={editingCaseStudy.category}
                            onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, category: e.target.value })}
                          />
                        </div>
                        <div className="wp-form-group">
                          <label>Hero Metric (e.g. +380% or 4.8x) *</label>
                          <input
                            type="text"
                            value={editingCaseStudy.metric}
                            onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, metric: e.target.value })}
                          />
                        </div>
                        <div className="wp-form-group">
                          <label>Result Statement *</label>
                          <input
                            type="text"
                            value={editingCaseStudy.result}
                            onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, result: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="wp-form-row-2">
                        <div className="wp-form-group">
                          <label>Year</label>
                          <input
                            type="text"
                            value={editingCaseStudy.year}
                            onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, year: e.target.value })}
                          />
                        </div>
                        <div className="wp-form-group">
                          <label>Services Delivered (Comma Separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(editingCaseStudy.services) ? editingCaseStudy.services.join(", ") : editingCaseStudy.services}
                            onChange={(e) => setEditingCaseStudy({
                              ...editingCaseStudy,
                              services: e.target.value.split(",").map(s => s.trim())
                            })}
                          />
                        </div>
                      </div>

                      <div className="wp-form-group">
                        <label>Hero Image URL</label>
                        <input
                          type="text"
                          value={editingCaseStudy.heroImage}
                          onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, heroImage: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Challenge & Strategy */}
                  <div className="wp-meta-box">
                    <div className="wp-meta-box-header">
                      <h3>2. The Challenge & Strategic Playbook</h3>
                    </div>
                    <div className="wp-meta-box-body">
                      <div className="wp-form-group">
                        <label>The Bottleneck / Initial Challenge *</label>
                        <textarea
                          rows={4}
                          value={editingCaseStudy.challenge}
                          onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, challenge: e.target.value })}
                        />
                      </div>

                      <div className="wp-form-group">
                        <label>Our Strategic Solution & Execution *</label>
                        <textarea
                          rows={4}
                          value={editingCaseStudy.strategy}
                          onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, strategy: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Results KPI Grid */}
                  <div className="wp-meta-box">
                    <div className="wp-meta-box-header">
                      <h3>3. Hard Metric Results (KPI Grid)</h3>
                      <button
                        type="button"
                        onClick={() => setEditingCaseStudy({
                          ...editingCaseStudy,
                          results: [...(editingCaseStudy.results || []), { label: "New KPI", val: "+100%" }]
                        })}
                        className="wp-btn-sm wp-btn-outline"
                      >
                        + Add Metric KPI
                      </button>
                    </div>
                    <div className="wp-meta-box-body">
                      {(editingCaseStudy.results || []).map((r, idx) => (
                        <div key={idx} className="wp-dynamic-item-row">
                          <input
                            type="text"
                            placeholder="KPI Label (e.g. CPA Reduction)"
                            value={r.label}
                            onChange={(e) => {
                              const updated = [...editingCaseStudy.results];
                              updated[idx].label = e.target.value;
                              setEditingCaseStudy({ ...editingCaseStudy, results: updated });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. -46.2%)"
                            value={r.val}
                            onChange={(e) => {
                              const updated = [...editingCaseStudy.results];
                              updated[idx].val = e.target.value;
                              setEditingCaseStudy({ ...editingCaseStudy, results: updated });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingCaseStudy.results.filter((_, i) => i !== idx);
                              setEditingCaseStudy({ ...editingCaseStudy, results: updated });
                            }}
                            className="wp-item-delete-btn"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Testimonial */}
                  <div className="wp-meta-box">
                    <div className="wp-meta-box-header">
                      <h3>4. Client Testimonial Quote</h3>
                    </div>
                    <div className="wp-meta-box-body">
                      <div className="wp-form-group">
                        <label>Quote Text</label>
                        <textarea
                          rows={3}
                          value={editingCaseStudy.testimonial?.quote || ""}
                          onChange={(e) => setEditingCaseStudy({
                            ...editingCaseStudy,
                            testimonial: { ...editingCaseStudy.testimonial, quote: e.target.value }
                          })}
                        />
                      </div>
                      <div className="wp-form-row-2">
                        <div className="wp-form-group">
                          <label>Client Author Name</label>
                          <input
                            type="text"
                            value={editingCaseStudy.testimonial?.author || ""}
                            onChange={(e) => setEditingCaseStudy({
                              ...editingCaseStudy,
                              testimonial: { ...editingCaseStudy.testimonial, author: e.target.value }
                            })}
                          />
                        </div>
                        <div className="wp-form-group">
                          <label>Client Author Title / Role</label>
                          <input
                            type="text"
                            value={editingCaseStudy.testimonial?.role || ""}
                            onChange={(e) => setEditingCaseStudy({
                              ...editingCaseStudy,
                              testimonial: { ...editingCaseStudy.testimonial, role: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="wp-edit-side-col">
                  <div className="wp-side-box">
                    <div className="wp-side-box-header">
                      <h3>Publish</h3>
                    </div>
                    <div className="wp-side-box-body">
                      <button
                        type="button"
                        onClick={handleSaveCaseStudy}
                        className="wp-btn wp-btn-primary wp-btn-block"
                      >
                        <Save size={15} /> Save & Publish Case Study
                      </button>
                      <a
                        href={`/work/${editingCaseStudy.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="wp-btn wp-btn-outline wp-btn-block wp-mt-2"
                      >
                        <Eye size={15} /> View Live Case Study ↗
                      </a>
                    </div>
                  </div>

                  <div className="wp-side-box wp-box-ai">
                    <div className="wp-side-box-header">
                      <h3><Wand2 size={15} /> 1-Click AI Generator</h3>
                    </div>
                    <div className="wp-side-box-body">
                      <p className="wp-ai-helper-text">
                        Type the Brand Name and click below to auto-generate Challenge, Strategy, KPIs, and Quote!
                      </p>
                      <button
                        type="button"
                        onClick={handleAIGenerateCaseStudy}
                        className="wp-btn wp-btn-ai wp-btn-block"
                      >
                        <Sparkles size={15} /> ✨ Auto-Fill Case Study
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: BLOG PLAYBOOKS */}
          {/* ======================================================== */}
          {activeTab === "blog" && (
            <div className="wp-tab-content">
              <div className="wp-page-header">
                <h1>Blog Insights & Editorial Playbooks</h1>
                <p>High-converting growth playbooks, GEO search insights, and performance breakdowns.</p>
              </div>
              <div className="wp-card">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>Article Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map(p => (
                      <tr key={p.slug}>
                        <td>
                          <strong>{p.title}</strong>
                          <div className="wp-permalink-preview">/blog/{p.slug}</div>
                        </td>
                        <td><span className="wp-badge-category">{p.category}</span></td>
                        <td>{p.author?.name || "Editorial Team"}</td>
                        <td>{p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : "2026-08"}</td>
                        <td>
                          <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="wp-btn-sm wp-btn-outline">
                            View ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: REVIEWS & TESTIMONIALS */}
          {/* ======================================================== */}
          {activeTab === "testimonials" && (
            <div className="wp-tab-content">
              <div className="wp-page-header">
                <h1>Client Reviews & Testimonials</h1>
                <p>Verified executive quotes displayed on homepage and /reviews route.</p>
              </div>
              <div className="wp-card">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Role & Company</th>
                      <th>Verified Quote</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r, i) => (
                      <tr key={i}>
                        <td><strong>{r.name}</strong></td>
                        <td>{r.role}, {r.company}</td>
                        <td className="wp-quote-cell">"{r.quote}"</td>
                        <td>{"⭐".repeat(r.rating || 5)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: INBOUND LEADS (CRM) */}
          {/* ======================================================== */}
          {activeTab === "leads" && (
            <div className="wp-tab-content">
              <div className="wp-page-header">
                <h1>Inbound Enquiries (CRM Pipeline)</h1>
                <p>Client leads captured from the Contact and Services intake forms.</p>
              </div>
              <div className="wp-card">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>Prospect</th>
                      <th>Contact Info</th>
                      <th>Service Required</th>
                      <th>Budget Tier</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id}>
                        <td>
                          <strong>{lead.name}</strong>
                          <div className="wp-sub-text">{lead.company}</div>
                        </td>
                        <td>
                          <div>{lead.email}</div>
                          <div className="wp-sub-text">{lead.phone}</div>
                        </td>
                        <td><span className="wp-badge-tag">{lead.service}</span></td>
                        <td>{lead.budget}</td>
                        <td>
                          <select
                            value={lead.status}
                            onChange={(e) => {
                              const updated = leads.map(l => l.id === lead.id ? { ...l, status: e.target.value } : l);
                              setLeads(updated);
                              try { localStorage.setItem("gif_admin_leads", JSON.stringify(updated)); } catch {}
                              showNotice(`Lead status updated to ${e.target.value}`);
                            }}
                            className="wp-select-sm"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td>{lead.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: COMMENTS MODERATION */}
          {/* ======================================================== */}
          {activeTab === "comments" && (
            <div className="wp-tab-content">
              <div className="wp-page-header">
                <h1>Comments Moderation</h1>
                <p>Review and approve public reader comments submitted on blog playbooks.</p>
              </div>
              <div className="wp-card">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>Author</th>
                      <th>Comment</th>
                      <th>In Response To</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map(c => (
                      <tr key={c.id}>
                        <td>
                          <strong>{c.authorName}</strong>
                          <div className="wp-sub-text">{c.authorEmail}</div>
                        </td>
                        <td className="wp-comment-body">"{c.content}"</td>
                        <td><code>/blog/{c.postSlug}</code></td>
                        <td><span className={`wp-status-pill wp-status-${c.status}`}>{c.status}</span></td>
                        <td>
                          <div className="wp-btn-group-sm">
                            {c.status !== "approved" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = comments.map(item => item.id === c.id ? { ...item, status: "approved" } : item);
                                  setComments(updated);
                                  try { localStorage.setItem("gif_admin_comments", JSON.stringify(updated)); } catch {}
                                  showNotice("Comment approved!");
                                }}
                                className="wp-btn-sm wp-btn-success"
                              >
                                Approve
                              </button>
                            )}
                            {c.status !== "spam" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = comments.map(item => item.id === c.id ? { ...item, status: "spam" } : item);
                                  setComments(updated);
                                  try { localStorage.setItem("gif_admin_comments", JSON.stringify(updated)); } catch {}
                                  showNotice("Comment marked as spam.");
                                }}
                                className="wp-btn-sm wp-btn-warning"
                              >
                                Spam
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = comments.filter(item => item.id !== c.id);
                                setComments(updated);
                                try { localStorage.setItem("gif_admin_comments", JSON.stringify(updated)); } catch {}
                                showNotice("Comment deleted.");
                              }}
                              className="wp-btn-sm wp-btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: USERS & ROLE-BASED ACCESS CONTROL (RBAC) */}
          {/* ======================================================== */}
          {activeTab === "users" && (
            <div className="wp-tab-content">
              <div className="wp-page-header wp-header-with-action">
                <div>
                  <h1>Users & Access Control (RBAC)</h1>
                  <p>Assign fine-grained roles to team members: Administrator, Editor, Author, and Viewer.</p>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="wp-btn wp-btn-primary"
                  >
                    <UserPlus size={15} /> Add New User
                  </button>
                )}
              </div>

              {/* Role Explainer Card */}
              <div className="wp-roles-summary-card">
                <div className="wp-role-summary-col">
                  <strong>👑 Administrator</strong>
                  <p>Full control over Settings, Users, CMS, Leads, and Code sync.</p>
                </div>
                <div className="wp-role-summary-col">
                  <strong>✏️ Editor</strong>
                  <p>Can add, edit, and publish Services, Case Studies, and Blogs. (No Users/Settings).</p>
                </div>
                <div className="wp-role-summary-col">
                  <strong>✍️ Author</strong>
                  <p>Can draft content for review. Cannot publish directly or access system settings.</p>
                </div>
                <div className="wp-role-summary-col">
                  <strong>👁️ Viewer</strong>
                  <p>Read-only access to preview draft content and lead metrics.</p>
                </div>
              </div>

              <div className="wp-card wp-mt-4">
                <table className="wp-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email / Username</th>
                      <th>Assigned Role</th>
                      <th>Status</th>
                      <th>Date Added</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="wp-user-cell">
                            <img src={u.avatar} alt={u.name} className="wp-table-avatar" />
                            <strong>{u.name}</strong>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`wp-badge-role wp-role-${u.role.toLowerCase()}`}>
                            {u.role}
                          </span>
                        </td>
                        <td><span className="wp-status-pill wp-status-published">{u.status}</span></td>
                        <td>{u.createdAt || "2025-01"}</td>
                        <td>
                          {isAdmin && u.id !== currentUser.id && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id)}
                              className="wp-btn-sm wp-btn-danger"
                            >
                              Delete
                            </button>
                          )}
                          {u.id === currentUser.id && (
                            <span className="wp-sub-text">(Active Session)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add User Modal */}
              {isAddUserModalOpen && (
                <div className="wp-modal-overlay">
                  <div className="wp-modal-card">
                    <div className="wp-modal-header">
                      <h3>Add New Team Member</h3>
                      <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="wp-modal-close">
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleAddUser}>
                      <div className="wp-form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newUserData.name}
                          onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                          placeholder="e.g. Rohan Sharma"
                        />
                      </div>

                      <div className="wp-form-group">
                        <label>Work Email *</label>
                        <input
                          type="email"
                          required
                          value={newUserData.email}
                          onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                          placeholder="e.g. rohan@getintofeed.com"
                        />
                      </div>

                      <div className="wp-form-group">
                        <label>Account Password *</label>
                        <input
                          type="password"
                          required
                          value={newUserData.password}
                          onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                          placeholder="Set initial password"
                        />
                      </div>

                      <div className="wp-form-group">
                        <label>Role & Permissions *</label>
                        <select
                          value={newUserData.role}
                          onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                        >
                          <option value="Administrator">Administrator (Full Access)</option>
                          <option value="Editor">Editor (Publish Services & Case Studies)</option>
                          <option value="Author">Author (Draft Only)</option>
                          <option value="Viewer">Viewer (Read-Only Preview)</option>
                        </select>
                      </div>

                      <div className="wp-modal-actions">
                        <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="wp-btn wp-btn-outline">
                          Cancel
                        </button>
                        <button type="submit" className="wp-btn wp-btn-primary">
                          Save New User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: SETTINGS (ADMIN ONLY) */}
          {/* ======================================================== */}
          {activeTab === "settings" && (
            <div className="wp-tab-content">
              <div className="wp-page-header">
                <h1>Agency Settings</h1>
                <p>Global contact numbers, WhatsApp concierge, and social channels.</p>
              </div>

              <div className="wp-card">
                <div className="wp-form-group">
                  <label>Agency Name</label>
                  <input type="text" defaultValue="Get Into Feed" />
                </div>

                <div className="wp-form-group">
                  <label>Tagline</label>
                  <input type="text" defaultValue="No Boring Marketing. Built for Commercial Revenue." />
                </div>

                <div className="wp-form-row-2">
                  <div className="wp-form-group">
                    <label>WhatsApp Concierge Number</label>
                    <input type="text" defaultValue="+91 98110 00000" />
                  </div>
                  <div className="wp-form-group">
                    <label>Inbound Lead Email</label>
                    <input type="email" defaultValue="growth@getintofeed.com" />
                  </div>
                </div>

                <div className="wp-form-group">
                  <label>Office Address</label>
                  <input type="text" defaultValue="100 Feet Road, Indiranagar, Bengaluru, KA 560038" />
                </div>

                <button
                  type="button"
                  onClick={() => showNotice("Settings saved successfully!")}
                  className="wp-btn wp-btn-primary wp-mt-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
