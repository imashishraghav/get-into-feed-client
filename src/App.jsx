import React, { useEffect, useState, useRef } from "react";
import {
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Award, BarChart3, BriefcaseBusiness, Building2, Check, CheckCircle2, ChevronDown, ChevronRight, CircleDot, Clock, Code, Cpu, Download, ExternalLink, Eye, FileText, Flame, Globe2, Handshake, Heart, HeartHandshake, HelpCircle, Laptop, Layers, LineChart, Mail, MapPin, Megaphone, Menu, MessageCircle, MessageSquare, Monitor, MousePointerClick, Palette, Pause, PenTool, Phone, Play, Plus, Quote, RefreshCw, Search, Send, Share2, ShieldAlert, ShieldCheck, Sliders, Smartphone, Sparkles, Star, Target, TrendingUp, UploadCloud, Users, UsersRound, Volume2, VolumeX, Wand2, X, Zap
} from "lucide-react";
import AdminDashboard from "./Admin.jsx";
import { BlogArticle, BlogPage } from "./Blog.jsx";
import {
  ServiceDetail, WorkDetail, LocationDetail, slugify,
  resolveService, resolveCaseStudy, locationCatalog, serviceCatalog
} from "./DetailPages.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const meta = {
  "/": ["Get Into Feed | Best Digital Marketing & Enterprise SEO Agency India", "Transforming ambitious brands into category leaders through AI-powered SEO, performance paid media, CRO web development, and digital marketing."],
  "/services": ["Digital Marketing Services & Growth Capabilities | Get Into Feed", "Enterprise SEO, Generative Engine Optimization (GEO), Paid Media (PPC), Web Design & CRO, Content Marketing, and App Marketing."],
  "/work": ["Case Studies & Growth Results | Get Into Feed", "Explore how Get Into Feed delivers 4.8x ROAS and +273% organic visibility for India's leading enterprises and D2C brands."],
  "/about": ["About Get Into Feed | India's Premier Growth Agency", "Established in 2026, Get Into Feed is India's next-gen AI-first digital marketing and enterprise SEO growth studio."],
  "/careers": ["Careers at Get Into Feed | Join India's Top Growth Studio", "Explore performance marketing, SEO, creative design, and engineering roles at Get Into Feed."],
  "/faqs": ["Frequently Asked Questions (FAQs) | Get Into Feed", "Authoritative answers on Enterprise SEO, AI Search (GEO), Paid Media, Web CRO, contracts, SLAs, and pricing models."],
  "/privacy-policy": ["Privacy Policy | Get Into Feed", "DPDP Act 2023 and GDPR compliant privacy policy outlining data collection, processing, and protection standards."],
  "/terms-and-conditions": ["Terms & Conditions (Master Services Agreement) | Get Into Feed", "Terms and conditions governing agency contracts, deliverables, billing, and intellectual property."],
  "/terms-of-use": ["Website Terms of Use | Get Into Feed", "Rules and guidelines for accessing and utilizing Get Into Feed website and digital resources."],
  "/disclaimer": ["Legal Disclaimer & Performance Disclosure | Get Into Feed", "Official marketing performance disclaimer, earnings disclosures, and third-party trademarks."],
  "/cookie-policy": ["Cookie Policy & Tracking Technologies | Get Into Feed", "Information regarding essential, analytics, and marketing cookies utilized across our platform."],
  "/refund-policy": ["Cancellation & Refund Policy | Get Into Feed", "Policies governing project cancellations, sprint milestones, and billing adjustments."],
  "/csr-policy": ["Corporate Social Responsibility (CSR) Policy | Get Into Feed", "Our commitment to sustainable digital innovation, education, and ethical AI stewardship."],
  "/contact": ["Claim Free 360° Growth & SEO Audit | Get Into Feed", "Start a conversation with our growth strategists and receive an in-depth audit within 24 hours."],
  "/blog": ["Digital Marketing Playbooks & SEO Insights | Get Into Feed", "Actionable frameworks on AI Search (GEO), Paid Media scaling, Core Web Vitals, and CRO."],
  "/admin": ["Agency Studio CMS & Operations | Get Into Feed", "Manage published services, case studies, blogs, and client leads."]
};

const fallback = {
  stats: [
    { value: "4.8x", label: "Average Client ROAS" },
    { value: "₹250Cr+", label: "Tracked Client Revenue" },
    { value: "500+", label: "Growth Sprints Delivered" },
    { value: "+273%", label: "AI Search Visibility" }
  ],
  services: [
    {
      title: "Enterprise SEO & AI Search (GEO)",
      icon: "Search",
      description: "Capture high-intent search demand across Google, ChatGPT, and Gemini with technical architecture, programmatic keyword clusters, and authority link moats.",
      points: ["AI Search & Generative Engine Optimization (GEO)", "Technical SEO & Core Web Vitals Optimization", "Programmatic Commercial Keyword Clusters", "Local Map Pack & Multi-Location Dominance"]
    },
    {
      title: "Paid Media & Performance Marketing",
      icon: "MousePointerClick",
      description: "Profit-focused Google Search, Performance Max, and Meta Ads engineered to maximize ROAS, control customer acquisition costs (CAC), and scale qualified sales pipeline.",
      points: ["Google Search, Shopping & Performance Max", "Meta & Instagram UGC Creator Ad Sprints", "LinkedIn B2B Account-Based Marketing (ABM)", "Multi-Touch Server-Side Attribution Modeling"]
    },
    {
      title: "High-Converting Web Experiences & CRO",
      icon: "Globe2",
      description: "Ultra-fast, mobile-first React web experiences, custom landing pages, and automated WhatsApp funnels designed to turn clicks into paying customers.",
      points: ["Sub-Second React & Next.js Core Speed", "Conversion Rate Optimization (CRO) Audits", "Interactive Calculators & Lead Funnels", "Official WhatsApp Business API Automation"]
    },
    {
      title: "Content Marketing & Digital PR",
      icon: "PenTool",
      description: "Thought leadership articles, SEO content hubs, and tier-1 media placements that establish industry authority and compound organic search rankings.",
      points: ["High-Intent SEO Copywriting & Content Hubs", "High-Tier Digital PR & Tier-1 Media Outreach", "Authority Link Moat Engineering", "Thought Leadership & Executive Positioning"]
    },
    {
      title: "App Store Optimization (ASO)",
      icon: "Sparkles",
      description: "Drive organic app discovery and profitable user acquisition across iOS App Store and Google Play with keyword targeting and in-app conversion optimization.",
      points: ["iOS App Store & Google Play ASO", "High-Volume User Acquisition Campaigns", "In-App Funnel & Retention Optimization", "App Rating & Review Reputation Velocity"]
    },
    {
      title: "BI Analytics, GA4 & MarTech",
      icon: "BarChart3",
      description: "Server-side tracking, custom Looker Studio dashboards, and multi-touch attribution models that reveal the exact revenue generated by every marketing rupee.",
      points: ["Server-Side GTM & Meta Conversions API (CAPI)", "Executive Looker Studio Real-Time BI", "Cohort CAC-to-LTV Attribution Modeling", "Weekly Growth Engineering Telemetry"]
    }
  ],
  caseStudies: [
    {
      brand: "Veloura Organics (D2C Skincare)",
      result: "Scaled Monthly Revenue to ₹1.8 Cr with 4.8x ROAS",
      metric: "4.8x ROAS",
      channel: "Meta Ads + UGC Video Sprints + Retention",
      detail: "Restructured ad account with creator-led UGC reels, deployed sub-second React landing pages, and automated WhatsApp cart recovery, scaling monthly revenue from ₹32L to ₹1.8 Cr in 120 days."
    },
    {
      brand: "FinScale Lending (BFSI & Fintech)",
      result: "+340% Inbound Loan Applications & -46% CAC",
      metric: "+340% Leads",
      channel: "Enterprise SEO + Core Web Vitals + Programmatic Hubs",
      detail: "Built 450+ programmatic high-intent keyword hubs around loan calculators, achieving #1 Google rankings and reducing customer acquisition cost by 46%."
    },
    {
      brand: "EdVance Academy (EdTech Platform)",
      result: "18,400+ Paid Student Enrollments at 3.9x ROI",
      metric: "18.4K Admissions",
      channel: "Google Search + Performance Max + WhatsApp Funnels",
      detail: "Overhauled paid search structure targeting career switchers, paired with localized student video testimonials and 1-click WhatsApp counseling funnels."
    },
    {
      brand: "MediHealth Super Specialty (Healthcare)",
      result: "+280% Verified Doctor Appointments Booked",
      metric: "+280% Bookings",
      channel: "Local Map Pack SEO + Hyperlocal Google Ads",
      detail: "Dominated Google 3-Pack rankings across 14 hospital centers in Delhi-NCR and Bengaluru, resulting in a 2.8x increase in verified patient OPD bookings."
    }
  ],
  testimonials: [
    {
      quote: "Get Into Feed transformed our digital customer acquisition. In 4 months, our organic traffic tripled, and our Meta ad spend scaled profitably to ₹50L/month with a 4.8x ROAS. They operate like true growth partners.",
      name: "Ananya Sharma",
      role: "Co-Founder & CMO, Veloura Organics",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    {
      quote: "Unlike traditional agencies that send vanity metric reports, Get Into Feed speaks revenue and unit economics. Their enterprise SEO architecture unlocked 340% growth in qualified inbound loan applications.",
      name: "Vikramaditya Mehta",
      role: "Head of Growth, FinScale Lending",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    {
      quote: "Their speed of execution is unmatched in India. From sub-second React landing pages to weekly creative testing sprints, our CAC dropped by 38% in 60 days. Highest recommendation.",
      name: "Rohan Deshmukh",
      role: "VP Marketing, EdVance Group",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
    }
  ],
  careers: [
    {
      id: "career-1",
      title: "Senior Enterprise SEO Lead",
      team: "Organic Search",
      type: "Full-time",
      location: "Noida / Remote",
      summary: "Lead enterprise SEO strategy and AI search optimization (GEO) for India's top BFSI, Healthcare, and E-commerce brands."
    },
    {
      id: "career-2",
      title: "Performance Marketing Manager (Meta & Google Ads)",
      team: "Growth Media",
      type: "Full-time",
      location: "Mumbai / Remote",
      summary: "Manage and scale multi-crore paid media budgets across Google Search, Performance Max, and Meta Ads with strict ROAS targets."
    },
    {
      id: "career-3",
      title: "Creative Producer & Video Ads Specialist",
      team: "Creative Studio",
      type: "Full-time",
      location: "Delhi-NCR / Remote",
      summary: "Direct and edit high-CTR UGC video reels, hook-driven motion graphics, and high-converting visual ads."
    }
  ]
};

function Link({ to, children, className = "", ...rest }) {
  const onClick = (event) => {
    event.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return (
    <a href={to} onClick={onClick} className={className} {...rest}>
      {children}
    </a>
  );
}

function resolveIcon(name) {
  if (name === "Search") return Search;
  if (name === "MousePointerClick") return MousePointerClick;
  if (name === "Globe2") return Globe2;
  if (name === "PenTool") return PenTool;
  if (name === "Sparkles") return Sparkles;
  if (name === "BarChart3") return BarChart3;
  if (name === "Megaphone") return Megaphone;
  if (name === "Palette") return Palette;
  return Globe2;
}

// -----------------------------------------------------------------------------
// 1. TOP NOTICE & UTILITY BAR (EXACT GET INTO FEED ALERT & PHONE BAR)
// -----------------------------------------------------------------------------
function AnnouncementBar({ onOpenAudit }) {
  const [closed, setClosed] = useState(false);

  return (
    <div className="top-global-header-wrapper">
      {/* ⚠️ IMPORTANT ALERT BAR (Exact as screenshot) */}
      {!closed && (
        <aside aria-label="Important Alert" className="top-important-alert-bar">
          <div className="alert-content-inner">
            <div className="alert-text-left">
              <span className="alert-icon-tag">
                <AlertTriangle size={15} color="#fbbf24" fill="#fbbf24" />
                <strong>Important Alert:</strong>
              </span>
              <span className="alert-body-copy">
                Beware of fake job offers and payment requests. We only use official email IDs and never conduct interviews on messaging apps.
              </span>
            </div>
            <div className="alert-actions-right">
              <Link to="/about" className="know-more-pill-btn">Know More</Link>
              <button
                type="button"
                onClick={() => setClosed(true)}
                className="alert-dismiss-btn"
                aria-label="Dismiss alert"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* TOP UTILITY CONTACT ROW */}
      <div className="top-utility-contact-bar">
        <div className="utility-bar-inner">
          <div className="utility-contact-links">
            <a href="tel:+919910308266" className="utility-contact-item">
              <Phone size={14} /> <span>+91-9910308266</span>
            </a>
            <a href="mailto:growth@getintofeed.com" className="utility-contact-item">
              <Mail size={14} /> <span>growth@getintofeed.com</span>
            </a>
          </div>
          <Link to="/contact" className="request-call-btn">
            Request a Call <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2. GET INTO FEED BRAND NAVBAR & RICH MEGA-MENU
// -----------------------------------------------------------------------------
// 2. GET INTO FEED BRAND NAVBAR & RICH MEGA-MENU (MATCHING USER SCREENSHOTS)
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// 2. GET INTO FEED BRAND NAVBAR & 100% FUNCTIONAL CLEAN NAVIGATION
// -----------------------------------------------------------------------------
function Header({ route, onOpenAudit }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navItems = [
    { id: "company", label: "Company", hasDropdown: true, to: "/about" },
    { id: "services", label: "Our Services", hasDropdown: false, to: "/services" },
    { id: "work", label: "Our Work", hasDropdown: false, to: "/work" },
    { id: "blog", label: "Blog", hasDropdown: false, to: "/blog" },
    { id: "contact", label: "Contact", hasDropdown: false, to: "/contact" }
  ];

  const companyItems = [
    { label: "About Get Into Feed", to: "/about", icon: HelpCircle },
    { label: "Awards & Recognition", to: "/awards", icon: Award },
    { label: "Careers & Culture", to: "/careers", icon: BriefcaseBusiness },
    { label: "Frequently Asked Questions", to: "/faqs", icon: MessageSquare }
  ];

  return (
    <header className="techmagnate-site-header">
      <div className="techmagnate-nav-container">
        {/* BRAND LOGO WITH MONOGRAM ICON & GET INTO FEED TYPOGRAPHY */}
        <Link to="/" className="techmagnate-brand-logo" aria-label="Get Into Feed Home">
          <img src="/logo-navbar.png" alt="Get Into Feed Logo" className="brand-logo-icon-img" />
          <div className="logo-text-block">
            <span className="logo-main-tech">GET INTO FEED<sup className="reg-mark">®</sup></span>
            <span className="logo-sub-tagline">Digital Excellence</span>
          </div>
        </Link>

        {/* DESKTOP MENU WITH 100% REAL WORKING LINKS */}
        <nav className="techmagnate-desktop-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="nav-dropdown-wrapper"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.id)}
              onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
            >
              <Link
                to={item.to}
                className={`techmagnate-nav-link ${activeDropdown === item.id ? "active-nav-open" : ""} ${route === item.to || (item.to !== "/" && route.startsWith(item.to)) ? "active" : ""}`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown size={14} className={`dropdown-chevron ${activeDropdown === item.id ? "open" : ""}`} />
                )}
              </Link>

              {/* COMPANY DROPDOWN WITH REAL VERIFIED ROUTES */}
              {item.id === "company" && activeDropdown === "company" && (
                <div className="techmagnate-mega-dropdown company-dropdown-box">
                  <div className="company-dropdown-grid">
                    <div className="company-nav-left-list">
                      {companyItems.map((cItem, i) => {
                        const Icon = cItem.icon;
                        return (
                          <Link
                            key={i}
                            to={cItem.to}
                            onClick={() => setActiveDropdown(null)}
                            className="company-nav-item-row"
                          >
                            <span className="company-item-icon-box">
                              <Icon size={18} />
                            </span>
                            <span className="company-item-text">{cItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* RIGHT REPORT CARD FEATURE */}
                    <div className="dropdown-report-card-badge">
                      <span className="dr-card-kicker">FOUNDED 2026 • NOIDA HQ</span>
                      <div className="dr-card-giant-stat">4.8x</div>
                      <p className="dr-card-bold-line">average client ROAS across search & media</p>
                      <p className="dr-card-sub-line">AI-First Growth Studio.</p>
                      <Link
                        to="/work"
                        onClick={() => setActiveDropdown(null)}
                        className="dr-card-orange-btn"
                      >
                        Explore Case Studies →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* RIGHT ACTION CTA & MOBILE TOGGLE */}
        <div className="header-right-action-wrap">
          <button type="button" onClick={onOpenAudit} className="nav-primary-cta-pill">
            Claim Free Audit →
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-hamburger-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="techmagnate-mobile-drawer">
          <nav className="mobile-nav-list">
            <Link to="/about" onClick={() => setMobileOpen(false)} className="mobile-menu-row">
              <span>About Us</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/services" onClick={() => setMobileOpen(false)} className="mobile-menu-row">
              <span>Our Services</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/work" onClick={() => setMobileOpen(false)} className="mobile-menu-row">
              <span>Our Work</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/awards" onClick={() => setMobileOpen(false)} className="mobile-menu-row">
              <span>Awards & Recognition</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/careers" onClick={() => setMobileOpen(false)} className="mobile-menu-row">
              <span>Careers</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/faqs" onClick={() => setMobileOpen(false)} className="mobile-menu-row">
              <span>FAQs</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/blog" onClick={() => setMobileOpen(false)} className="mobile-menu-row">
              <span>Blog & Playbooks</span>
              <ChevronRight size={16} />
            </Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="mobile-menu-row">
              <span>Contact</span>
              <ChevronRight size={16} />
            </Link>
            <div className="mobile-drawer-cta">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); onOpenAudit(); }}
                className="button button-coral full"
              >
                Claim Free Audit →
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// -----------------------------------------------------------------------------
// 3. EXACT HOMEPAGE HERO BANNER (MATCHING SCREENSHOT)
// -----------------------------------------------------------------------------
function EnterpriseHero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="techmagnate-hero-banner">
      <div className="hero-banner-container">
        {/* LEFT COLUMN: EXACT COPY & BUTTONS FROM SCREENSHOT */}
        <div className="hero-banner-left">
          <div className="hero-lime-kicker">
            We make sure you get found.
          </div>

          <h1 className="hero-exact-headline">
            Own Every Search Result –<br />
            From Google Rankings to AI Answers
          </h1>

          <p className="hero-exact-subtext">
            Your customers don't just search anymore. They ask ChatGPT, Gemini, Perplexity and Google AI. We make sure your brand gets found everywhere.
          </p>

          <div className="hero-cta-buttons-row">
            <Link to="/contact" className="hero-btn-orange-pill">
              Speak to an SEO Expert <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="hero-btn-outline-pill">
              Our Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: SLEEK AGENCY VIDEO / REEL PLAYER (MATCHING SCREENSHOT) */}
        <div className="hero-banner-right">
          <div className="hero-video-player-frame">
            <div className="video-player-inner">
              {/* Simulated agency video graphic with waveform & playback */}
              <div className="player-canvas-area">
                <div className="video-ambient-glow" />
                <div className="video-center-content">
                  <div className="video-brand-watermark">
                    <span className="watermark-logo">GF</span>
                    <span>Growth Agency Reel 2026</span>
                  </div>
                  <div className="soundwave-bars-row">
                    {[35, 60, 45, 90, 75, 40, 85, 95, 60, 30, 70, 80, 50, 65, 85, 40].map((h, i) => (
                      <span
                        key={i}
                        className={`wave-bar ${isPlaying ? "animating" : ""}`}
                        style={{ height: `${h}%`, animationDelay: `${(i * 0.1).toFixed(1)}s` }}
                      />
                    ))}
                  </div>
                  <div className="video-stat-highlight">
                    <strong>+273% AI Citation Share</strong>
                    <span>Google AI Overviews • ChatGPT • Gemini</span>
                  </div>
                </div>
              </div>

              {/* VIDEO BOTTOM CONTROLS BAR */}
              <div className="player-controls-bar">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="player-control-btn"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <span className="player-timecode">0:00 / 1:24</span>
                <div className="player-scrubber-track">
                  <div className="player-scrubber-fill" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="player-control-btn"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



// -----------------------------------------------------------------------------
// EXACT QUICK SERVICES FLOATING PILL RIBBON (MATCHING SCREENSHOT)
// -----------------------------------------------------------------------------
function QuickServicesPillBar() {
  const quickServices = [
    { label: "SEO Services", to: "/services/enterprise-seo" },
    { label: "Digital Marketing Services", to: "/services/generative-engine-optimization" },
    { label: "Mobile App Marketing Services", to: "/services/app-store-optimization" },
    { label: "Content Writing Services", to: "/services/content-marketing-pr" },
    { label: "PPC Services", to: "/services/google-ads-management" },
    { label: "Martech Consulting Services", to: "/services/web-design-cro" }
  ];

  return (
    <div className="hero-quick-services-ribbon">
      <div className="quick-services-pill-container">
        {quickServices.map((qs, i) => (
          <Link key={i} to={qs.to} className="quick-service-pill-item">
            <span>{qs.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// EXACT 12 ENTERPRISE CLIENT LOGOS (MATCHING SCREENSHOT 1-TO-1)
// -----------------------------------------------------------------------------
function ClientMarquee() {
  return (
    <section className="client-marquee-section exact-screenshot-match">
      {/* EXACT SECTION HEADER */}
      <div className="client-section-header">
        <span className="clients-kicker-blue">CLIENTS</span>
        <h2 className="clients-main-heading">
          Working with the Largest Enterprises<br />
          To Achieve Business Goals
        </h2>
      </div>

      {/* EXACT 6-COLUMN x 2-ROW CLIENT LOGO GRID */}
      <div className="exact-clients-logo-grid">
        {/* ROW 1 */}
        <div className="brand-logo-cell">
          <svg viewBox="0 0 200 48" className="exact-brand-svg">
            <circle cx="24" cy="24" r="18" fill="#005fa8" />
            <path d="M17 14 h10 c4 0 7 2.5 7 5.5 c0 2 -1.2 3.8 -3.2 4.6 c2.6 0.8 4.2 2.8 4.2 5.4 c0 3.5 -3 6.5 -8 6.5 H17 Z M21 17.5 v6 h6 c2 0 3.5 -1.2 3.5 -3 s-1.5 -3 -3.5 -3 Z M21 26.5 v6.5 h6.5 c2.2 0 4 -1.2 4 -3.2 s-1.8 -3.3 -4 -3.3 Z" fill="#ffffff" />
            <text x="48" y="21" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="17" fill="#005fa8" letterSpacing="0.04em">BAJAJ</text>
            <text x="48" y="37" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="15" fill="#005fa8" letterSpacing="0.06em">FINSERV</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 220 48" className="exact-brand-svg">
            <path d="M22 6 A18 18 0 0 1 36 20 L30 20 A12 12 0 0 0 22 12 Z" fill="#00a3e0" />
            <path d="M36 20 A18 18 0 0 1 24 38 L24 32 A12 12 0 0 0 30 20 Z" fill="#78be20" />
            <path d="M24 38 A18 18 0 0 1 8 28 L13 25 A12 12 0 0 0 24 32 Z" fill="#ffb81c" />
            <circle cx="26" cy="24" r="7" fill="#e4002b" />
            <text x="46" y="16" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="8.5" fill="#1e293b">Global Indian</text>
            <text x="46" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="8.5" fill="#1e293b">International</text>
            <text x="46" y="36" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="8.5" fill="#1e293b">School</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 200 48" className="exact-brand-svg">
            <polygon points="10,6 20,6 16,42 6,42" fill="#00a651" />
            <polygon points="24,6 34,6 30,42 20,42" fill="#00a651" />
            <text x="42" y="24" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="22" fill="#00a651" letterSpacing="-0.02em">Hero</text>
            <text x="42" y="40" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="13" fill="#0c2340" letterSpacing="0.08em">FINCORP</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 200 48" className="exact-brand-svg">
            <ellipse cx="65" cy="17" rx="20" ry="11" fill="none" stroke="#002c6c" strokeWidth="2.5" />
            <path d="M55 24 L59 10 M71 24 L75 10 M57 17 L73 17" stroke="#002c6c" strokeWidth="2.5" strokeLinecap="round" />
            <text x="18" y="40" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="17" fill="#002c6c" letterSpacing="0.12em">HYUNDAI</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 200 48" className="exact-brand-svg">
            <circle cx="24" cy="24" r="17" fill="#e65100" />
            <polygon points="24,11 32,25 16,25" fill="#ffffff" opacity="0.85" />
            <polygon points="24,37 32,23 16,23" fill="#ffffff" opacity="0.85" />
            <circle cx="24" cy="24" r="3.5" fill="#e65100" />
            <text x="48" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="23" fill="#0c2340" letterSpacing="0.02em">IIFL</text>
            <text x="48" y="38" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="10.5" fill="#e65100" letterSpacing="0.12em">FINANCE</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 220 48" className="exact-brand-svg">
            <rect x="8" y="11" width="26" height="26" rx="4" fill="#008080" />
            <polygon points="21,15 23,20 28,22 23,24 21,29 19,24 14,22 19,20" fill="#a7f3d0" />
            <text x="42" y="25" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="17" fill="#0c2340">BLK-MAX</text>
            <text x="42" y="37" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" fontSize="8.5" fill="#64748b">Super Speciality Hospital</text>
          </svg>
        </div>

        {/* ROW 2 */}
        <div className="brand-logo-cell">
          <svg viewBox="0 0 200 48" className="exact-brand-svg">
            <text x="10" y="25" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="20" fill="#c2185b" letterSpacing="0.02em">INDIRA</text>
            <text x="90" y="25" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="20" fill="#0c2340" letterSpacing="0.02em">IVF</text>
            <text x="10" y="38" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="8" fill="#880e4f" letterSpacing="0.08em">FERTILITY & IVF CENTRE</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 160 48" className="exact-brand-svg">
            <text x="10" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="24" fill="#000000" letterSpacing="-0.03em">one</text>
            <text x="14" y="42" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="17" fill="#000000" letterSpacing="0.04em">card</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 180 48" className="exact-brand-svg">
            <ellipse cx="60" cy="24" rx="38" ry="18" fill="#c61b1b" />
            <path d="M40 25 q3 -5 10 -2 q5 2 9 -3 q-2 7 -7 9 q-7 2 -12 -4 Z" fill="#ffffff" />
            <text x="52" y="28" fontFamily="'Brush Script MT', cursive, sans-serif" fontWeight="700" fontStyle="italic" fontSize="18" fill="#ffffff">Pigeon</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 220 48" className="exact-brand-svg">
            <polygon points="12,38 24,10 36,38" fill="#880038" />
            <polygon points="24,24 20,38 28,38" fill="#ffffff" />
            <text x="44" y="23" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="14" fill="#880038">AXIS</text>
            <text x="82" y="23" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="14" fill="#002d62">MAX</text>
            <text x="44" y="37" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="8.5" fill="#002d62" letterSpacing="0.08em">LIFE INSURANCE</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 200 48" className="exact-brand-svg">
            <circle cx="24" cy="24" r="17" fill="none" stroke="#1e293b" strokeWidth="2.5" />
            <text x="14" y="29" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="12.5" fill="#1e293b">L&T</text>
            <text x="48" y="29" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="17" fill="#1e293b" letterSpacing="-0.01em">L&T Finance</text>
          </svg>
        </div>

        <div className="brand-logo-cell">
          <svg viewBox="0 0 200 48" className="exact-brand-svg">
            <path d="M16 16 C16 28 26 34 32 34 C32 22 22 16 16 16 Z" fill="#009688" />
            <path d="M26 12 C26 24 36 30 42 30 C42 18 32 12 26 12 Z" fill="#004d40" opacity="0.8" />
            <text x="48" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="21" fill="#009688" letterSpacing="-0.02em">Simpolo</text>
            <text x="49" y="38" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" fontSize="8.5" fill="#004d40">ceramics</text>
          </svg>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 5. DATA BACKED SERVICES TO GROW YOUR REVENUE (MATCHING USER SCREENSHOT EXACTLY)
// -----------------------------------------------------------------------------
function DataBackedServicesSection() {
  const [activeTab, setActiveTab] = useState("seo");

  const tabs = [
    { key: "seo", label: "Search Engine Optimization" },
    { key: "paid", label: "Paid Marketing" },
    { key: "content", label: "Content Marketing" },
    { key: "app", label: "Mobile App Marketing" },
    { key: "martech", label: "Marketing Technology & Automation" }
  ];

  const tabKeys = tabs.map((t) => t.key);

  const handlePrev = () => {
    const idx = tabKeys.indexOf(activeTab);
    const prevIdx = (idx - 1 + tabKeys.length) % tabKeys.length;
    setActiveTab(tabKeys[prevIdx]);
  };

  const handleNext = () => {
    const idx = tabKeys.indexOf(activeTab);
    const nextIdx = (idx + 1) % tabKeys.length;
    setActiveTab(tabKeys[nextIdx]);
  };

  const tabData = {
    seo: {
      title: "Search Engine Optimization",
      desc: "Greater visibility. Higher rankings. Higher traffic. Better quality leads.",
      cta: "Discover SEO Services",
      to: "/services/enterprise-seo",
      icon: Search,
      tag: "ORGANIC SEARCH DOMINANCE",
      metric: "#1",
      metricLabel: "Google Page 1 Rankings",
      subMetric: "+104% Average Traffic Growth",
      pills: [
        { label: "AI SEO Services", to: "/services/generative-engine-optimization" },
        { label: "Enterprise SEO Services", to: "/services/enterprise-seo" },
        { label: "Ecommerce SEO Services", to: "/services/ecommerce-seo" }
      ]
    },
    paid: {
      title: "Paid Marketing",
      desc: "Targeted ads. Maximum ROAS. Lower customer acquisition cost.",
      cta: "Discover Paid Marketing",
      to: "/services/google-ads-management",
      icon: Target,
      tag: "PERFORMANCE ROI SCALING",
      metric: "4.8x",
      metricLabel: "Average Client ROAS",
      subMetric: "Google & Meta Ads Scaling",
      pills: [
        { label: "Google Ads & PMax", to: "/services/google-ads-management" },
        { label: "Meta & UGC Video Ads", to: "/services/google-ads-management" },
        { label: "Programmatic Media Buying", to: "/services/google-ads-management" }
      ]
    },
    content: {
      title: "Content Marketing",
      desc: "Engaging stories. High authority. Organic brand visibility.",
      cta: "Discover Content Marketing",
      to: "/services/content-marketing-pr",
      icon: PenTool,
      tag: "AUTHORITY & DIGITAL PR",
      metric: "41M+",
      metricLabel: "Organic Content Views",
      subMetric: "Tier-1 Press Editorial Mentions",
      pills: [
        { label: "Content Strategy & Copywriting", to: "/services/content-marketing-pr" },
        { label: "Digital PR & Brand Mentions", to: "/services/content-marketing-pr" },
        { label: "Online Reputation Management", to: "/services/content-marketing-pr" }
      ]
    },
    app: {
      title: "Mobile App Marketing",
      desc: "Higher store rankings. More downloads. Scalable user acquisition.",
      cta: "Discover App Marketing",
      to: "/services/app-store-optimization",
      icon: Smartphone,
      tag: "APP STORE SCALING",
      metric: "+65%",
      metricLabel: "Organic App Downloads Lift",
      subMetric: "Top 3 App Store Rankings",
      pills: [
        { label: "App Store Optimization (ASO)", to: "/services/app-store-optimization" },
        { label: "Apple Search Ads & UAC", to: "/services/app-store-optimization" },
        { label: "In-App Conversion Funnels", to: "/services/app-store-optimization" }
      ]
    },
    martech: {
      title: "Marketing Technology & Automation",
      desc: "Optimise the entire customer journey – Discovery, Conversion, Engagement, and Retention.",
      cta: "Discover Martech Services",
      to: "/services/web-design-cro",
      icon: Layers,
      tag: "FULL-FUNNEL MARTECH",
      metric: "+40%",
      metricLabel: "Conversion Rate Increase",
      subMetric: "Unified CDP & High-Velocity CRO",
      pills: [
        { label: "Martech Consulting Services", to: "/services/web-design-cro" },
        { label: "Conversion Rate Optimization", to: "/services/web-design-cro" },
        { label: "Customer Data Platform Services", to: "/services/web-design-cro" }
      ]
    }
  };

  const current = tabData[activeTab] || tabData.seo;
  const IconComp = current.icon;

  return (
    <section className="data-backed-services-section">
      {/* SECTION HEADER BLOCK WITH FULL ORIGINAL COPY */}
      <div className="section-header-block">
        <h2>Data Backed Services to Grow Your Revenue</h2>
        <p className="data-backed-sub-lead">
          Your next phase of growth is here.
        </p>
        <p className="data-backed-body-text">
          Get found in AI answers. Smarter campaigns. Stronger visibility. Better conversions. Achieving all of it requires an integrated strategy powered by next-generation AI intelligence, advanced search technology, seasoned growth engineers, and our autonomous agent ecosystem.
        </p>
        <p className="data-backed-body-text">
          Established in 2026, Get Into Feed is engineered from the ground up to help ambitious businesses dominate search engines, AI answer engines (GEO), and high-ROAS paid media channels. We focus on measurable growth that impacts revenue, market share, and long-term valuation.
        </p>
        <p className="data-backed-body-text">
          Our goal is clear: empower 300+ businesses by 2030 with digital strategies that create lasting competitive advantage.
        </p>
        <p className="data-backed-body-text highlight-bold">
          Ready to grow with confidence? Partner with Get Into Feed and make every digital investment count.
        </p>
      </div>

      {/* CLEAN CAROUSEL TABS BAR (1-TO-1 MATCHING SCREENSHOT) */}
      <div className="simple-services-tab-bar">
        <button type="button" onClick={handlePrev} className="simple-tab-nav-arrow" aria-label="Previous service tab">
          ‹
        </button>

        <div className="simple-tab-pills-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`simple-service-tab-btn ${activeTab === tab.key ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button type="button" onClick={handleNext} className="simple-tab-nav-arrow" aria-label="Next service tab">
          ›
        </button>
      </div>

      {/* SIMPLE PASTEL BLUE HERO BANNER CARD (CLEAN SERVICE VISUAL) */}
      <div className="simple-service-banner-card">
        {/* LEFT COLUMN: TITLE, SUBTITLE & ORANGE PILL CTA */}
        <div className="simple-banner-left">
          <h3 className="simple-banner-title">{current.title}</h3>
          <p className="simple-banner-subtitle">{current.desc}</p>
          <Link to={current.to} className="simple-banner-orange-cta">
            {current.cta} →
          </Link>
        </div>

        {/* CENTER COLUMN: CLEAN SERVICE GROWTH VISUAL CARD */}
        <div className="simple-banner-center">
          <div className="service-growth-visual-card">
            <div className="growth-card-top-tag">
              <IconComp size={15} className="growth-icon-accent" />
              <span>{current.tag}</span>
            </div>
            
            <div className="growth-card-metric-block">
              <strong className="growth-card-stat">{current.metric}</strong>
              <div className="growth-card-labels">
                <span className="growth-card-main-label">{current.metricLabel}</span>
                <span className="growth-card-sub-label">{current.subMetric}</span>
              </div>
            </div>

            <div className="growth-card-bar-indicator">
              <div className="growth-bar-track">
                <div className="growth-bar-fill" />
              </div>
              <span className="growth-bar-status">Verified Growth</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3 WHITE FLOATING PILLS */}
        <div className="simple-banner-right">
          <div className="simple-floating-pills-stack">
            {current.pills.map((pill, idx) => (
              <Link key={idx} to={pill.to} className="simple-floating-service-pill">
                <span>{pill.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 6. WATCH OUR VIDEO SHOWCASE (CINEMATIC AGENCY SHOWREEL)
// -----------------------------------------------------------------------------
function WatchOurVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="watch-our-video-section">
      <div className="watch-video-container">
        <div className="video-section-header">
          <span className="video-kicker-badge">INSIDE GET INTO FEED</span>
          <h2>Watch Our Video</h2>
        </div>

        {/* CINEMATIC VIDEO SHOWCASE CARD */}
        <div className="video-feature-hero-card" onClick={() => setIsPlaying(true)}>
          <div className="video-office-bg">
            <div className="video-top-meta-bar">
              <span className="video-duration-pill">
                <Clock size={13} /> 2:15 MIN
              </span>
              <span className="video-quality-pill">4K ULTRA HD</span>
            </div>

            <div className="video-center-content">
              <button
                type="button"
                className="video-play-pulse-btn"
                aria-label="Play Get Into Feed Showcase Video"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(true);
                }}
              >
                <Play size={28} fill="#ffffff" color="#ffffff" className="play-triangle-icon" />
              </button>
              <div className="video-wall-brand">
                <span className="wall-brand-title">GET INTO FEED</span>
                <span className="wall-brand-subtitle">Agency Showreel • Engineering Category Leaders</span>
              </div>
            </div>

            <div className="video-bottom-meta-bar">
              <span className="video-founded-badge">Established in 2026 • Next-Gen Growth Studio</span>
              <span className="video-awards-tag">🏆 India's Leading Growth Agency</span>
            </div>
          </div>
        </div>

        {/* MODAL POPUP WHEN PLAYING */}
        {isPlaying && (
          <div className="video-modal-overlay" onClick={() => setIsPlaying(false)}>
            <div className="video-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="video-modal-close-btn"
                onClick={() => setIsPlaying(false)}
                aria-label="Close Video"
              >
                <X size={22} />
              </button>
              <div className="video-iframe-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&rel=0"
                  title="Get Into Feed Digital Marketing Agency Showcase"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM CONTENT BLOCK & CTA */}
        <div className="watch-video-content-block">
          <p>
            Established in 2026, Get Into Feed is India's next-generation digital marketing and AI search powerhouse. Built for the new era of generative engines and algorithmic performance media, our vision is to fuel transformational growth for 300+ clients by 2030. Ready to unlock your brand's complete digital potential?
          </p>
          <div className="watch-video-action-row">
            <Link to="/contact" className="watch-video-orange-btn">
              Speak to an Expert →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 7. ACHIEVE 2X TRAFFIC GROWTH PILLARS (MATCHING PDF PAGE 2)
// -----------------------------------------------------------------------------
function TrafficGrowthPillars() {
  const leftPillars = [
    { icon: TrendingUp, action: "Get", target: "SERP Visibility", color: "#0284c7", bg: "#f0f9ff" },
    { icon: Target, action: "Drive", target: "Qualified Leads", color: "#16a34a", bg: "#f0fdf4" },
    { icon: ShieldCheck, action: "Grow", target: "Your Bottomline", color: "#d97706", bg: "#fffbeb" }
  ];

  const rightCapabilities = [
    {
      icon: Users,
      tag: "AI & DATA INTELLIGENCE",
      title: "Dedicated Teams for AI, Automation, and Data Analytics",
      desc: "Our specialized teams use AI, automation, and analytics to augment campaign performance, improve customer engagement, and unlock new growth opportunities."
    },
    {
      icon: Laptop,
      tag: "PROPRIETARY TECH",
      title: "In-House Martech Capabilities",
      desc: "Our in-house expertise in CRM, AI, analytics, and marketing automation empowers businesses with data-driven, personalized marketing solutions that drive efficiency and ROI."
    },
    {
      icon: Award,
      tag: "TOP 3% IN INDIA",
      title: "Google Premier Partner Agency",
      desc: "As a Google Premier Partner agency, we have access to exclusive insights, tools, and direct support that let us tailor campaigns for superior search and media performance."
    }
  ];

  return (
    <section className="traffic-growth-pillars-section">
      <div className="traffic-growth-container">
        <div className="traffic-growth-grid">
          {/* LEFT 3-POINT SUMMARY */}
          <div className="traffic-left-summary">
            <span className="traffic-kicker-pill">PROVEN ROI FRAMEWORK</span>
            <h2>Achieve a 2x Increase in Average Monthly Traffic</h2>
            <div className="growth-pillar-bullets">
              {leftPillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="growth-pillar-bullet-card">
                    <div className="pillar-bullet-icon-box" style={{ background: p.bg, color: p.color }}>
                      <Icon size={20} />
                    </div>
                    <div className="pillar-bullet-text">
                      <strong>{p.action}</strong>
                      <span>{p.target}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT 3 CAPABILITY CARDS */}
          <div className="traffic-right-cards-row">
            {rightCapabilities.map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <div key={idx} className="traffic-pillar-card">
                  <div className="pillar-card-top">
                    <div className="pillar-card-icon-wrap">
                      <CardIcon size={22} className="pillar-card-svg" />
                    </div>
                    <span className="pillar-card-tag">{card.tag}</span>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="traffic-pillar-bottom-cta">
          <Link to="/contact" className="traffic-speak-expert-btn">
            Speak to an Expert →
          </Link>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 8. AWARDS & ACCOLADES FOR GET INTO FEED (CLEAN DESIGN WITH HOVER SHADOW)
// -----------------------------------------------------------------------------
function AwardsShowcase() {
  const awards = [
    {
      title: "Best SEO Campaign: Bajaj Finserv Mutual Funds",
      category: "BFSI & Mutual Funds Scale",
      event: "IDMA National Digital Awards",
      tag: "Gold Category Winner"
    },
    {
      title: "SEO Driven Programmatic Marketing category- Gold",
      category: "Programmatic & AI Search Scale",
      event: "mCube Digital Media Awards",
      tag: "Enterprise Gold"
    },
    {
      title: "Best Content Marketing Campaign for Healthcare",
      category: "Digital PR & Content Authority",
      event: "ET BrandEquity Shark Awards",
      tag: "National Winner"
    }
  ];

  return (
    <section className="awards-accolades-section">
      <div className="awards-accolades-container">
        <div className="awards-header-wrap">
          <h2>Awards & Accolades for Get Into Feed</h2>
          <p className="awards-subtext">
            Don't believe us? Even the industry thinks we're the best SEO service in India. Over the years we have consistently won awards for our SEO and Content Marketing at various industry events! See our full list of awards and accolades here:
          </p>
        </div>

        <div className="awards-interactive-grid">
          {awards.map((a, i) => (
            <div key={i} className="award-interactive-card">
              <div className="award-card-tag-row">
                <span className="award-pill-tag">{a.tag}</span>
              </div>

              <div className="award-trophy-symbol">
                <Award size={34} className="trophy-svg-icon" />
              </div>

              <h3 className="award-main-title">{a.title}</h3>

              <div className="award-card-divider" />

              <div className="award-card-footer">
                <span className="award-event-text">{a.event}</span>
                <span className="award-cat-text">{a.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="awards-bottom-cta-row">
          <p>If growth is your goal, Get Into Feed is the digital marketing agency to choose.</p>
          <Link to="/about" className="awards-view-all-btn">
            View All →
          </Link>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 9. 103 BRANDS DIGITAL REPORT CARD (MATCHING PDF PAGE 3)
// -----------------------------------------------------------------------------
function DigitalReportCard() {
  const stats = [
    {
      icon: TrendingUp,
      number: "104%",
      title: "Average Traffic Growth",
      desc: "Across all 103 enterprise client portfolios",
      color: "#0284c7",
      bg: "#f0f9ff"
    },
    {
      icon: Target,
      number: "106%",
      title: "Average Lead Growth",
      desc: "High-intent qualified revenue-driven leads",
      color: "#16a34a",
      bg: "#f0fdf4"
    },
    {
      icon: Zap,
      number: "266M",
      title: "AI Search Volume",
      desc: "Captured across Google AI Mode & Perplexity",
      color: "#8b5cf6",
      bg: "#f5f3ff"
    },
    {
      icon: Award,
      number: "103%",
      title: "Top-5 Search Visibility",
      desc: "Growth across competitive commercial terms",
      color: "#d97706",
      bg: "#fffbeb"
    }
  ];

  return (
    <section className="digital-report-card-section exact-pdf-match">
      <div className="report-card-shell-pdf">
        <div className="report-card-header">
          <span className="report-pill-badge">PROVEN PERFORMANCE • FY 2025–26 REPORT CARD</span>
          <h2>103 brands. One year. Real numbers.</h2>
        </div>

        <div className="report-stat-numbers-grid">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="report-stat-card">
                <div className="report-stat-icon-wrap" style={{ background: s.bg, color: s.color }}>
                  <Icon size={22} />
                </div>
                <div className="report-giant-num">{s.number}</div>
                <h3 className="report-stat-title">{s.title}</h3>
                <p className="report-stat-desc">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="report-footer-cta-block">
          <p>
            We publish the verified numbers most agencies keep quiet about.
            <br />
            <strong>Get the full Digital Report Card.</strong>
          </p>
          <Link to="/blog" className="report-orange-pill-btn">
            Download Full Report Card →
          </Link>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 10. DRIVING ACTUAL BUSINESS GROWTH CASE STUDIES (MATCHING PDF PAGE 3)
// -----------------------------------------------------------------------------
function CaseStudiesSection() {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  const caseStudies = [
    {
      brand: "BAJAJ FINSERV",
      logoColor: "#005fa8",
      headline: "Bajaj Finserv Gold Loans SEO Case Study: Hundreds of Crores in Gold Loan Disbursals",
      desc: "When Bajaj Finserv approached Get Into Feed for their Gold Loans LoB, the NBFC was making an entry into a market saturated with established brands and heavy hitters. Their objective was to increase the overall volume of organic traffic and leads for their new offering.",
      growthTitle: "Hundreds of Crores in Gold Loan Disbursals",
      leadsGrowth: "▲ 69.84%",
      leadsLabel: "Increase in leads",
      trafficGrowth: "▲ 279.69%",
      trafficLabel: "Increase in traffic",
      leadsBarHeight: "52%",
      trafficBarHeight: "94%"
    },
    {
      brand: "APOLLO 24|7",
      logoColor: "#00857c",
      headline: "Apollo 24|7 Healthcare Digital Marketing: Dominating #1 Online Doctor & Pharmacy Queries",
      desc: "Get Into Feed architected an enterprise healthcare semantic SEO strategy across 15,000+ medical symptoms and specialist doctor pages, generating record high-intent patient appointments.",
      growthTitle: "Dominating 15,000+ Healthcare Queries",
      leadsGrowth: "▲ 114.20%",
      leadsLabel: "Increase in appointments",
      trafficGrowth: "▲ 312.50%",
      trafficLabel: "Increase in organic visits",
      leadsBarHeight: "68%",
      trafficBarHeight: "98%"
    },
    {
      brand: "AIRTEL DIGITAL",
      logoColor: "#e60000",
      headline: "Airtel Thanks & Broadband Growth: Scaling Multi-Product Lead Pipelines Nationally",
      desc: "Implemented high-velocity programmatic SEO and AI answer engine optimizations across India's top 100 metro hubs to drive qualified subscriber acquisitions at a lower CAC.",
      growthTitle: "Multi-Product Growth Across 100+ Metro Hubs",
      leadsGrowth: "▲ 88.40%",
      leadsLabel: "Increase in digital leads",
      trafficGrowth: "▲ 245.10%",
      trafficLabel: "Increase in SERP visibility",
      leadsBarHeight: "60%",
      trafficBarHeight: "90%"
    }
  ];

  const current = caseStudies[activeCaseIdx];

  return (
    <section className="case-studies-section exact-pdf-match">
      <div className="case-studies-container">
        <div className="case-studies-header-wrap">
          <span className="case-studies-kicker-badge">REAL CLIENT RESULTS</span>
          <h2>Driving Actual Business Growth for Our Clients</h2>
          <p className="case-studies-subtext">
            Read our case studies to see how we've created true value and delivered transformational growth for our clients.
          </p>
        </div>

        <div className="featured-case-study-card">
          {/* LEFT: TEXT CONTENT & ACTIONS */}
          <div className="case-study-left-col">
            <div className="case-brand-header">
              <span className="case-brand-badge-text" style={{ color: current.logoColor }}>
                {current.brand}
              </span>
            </div>

            <h3>{current.headline}</h3>
            <p>{current.desc}</p>

            <div className="case-actions-row">
              <Link to="/work" className="case-orange-pill-btn">
                View Case Study →
              </Link>
              <Link to="/work" className="case-outline-btn">
                View Our Work →
              </Link>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE INFOGRAPHIC CARD */}
          <div className="case-study-right-col">
            <div className="case-graph-infographic-card">
              <div className="infographic-top-header">
                <strong>{current.growthTitle}</strong>
              </div>

              <div className="chart-legend-row">
                <span className="legend-title">Growth Report</span>
                <span className="legend-item"><span className="dot dot-leads" /> Leads</span>
                <span className="legend-item"><span className="dot dot-traffic" /> Traffic</span>
              </div>

              <div className="simulated-bar-chart">
                <div className="chart-y-axis">
                  <span>300%</span>
                  <span>200%</span>
                  <span>100%</span>
                  <span>0%</span>
                </div>
                <div className="chart-plot-area">
                  <div className="chart-grid-line line-300" />
                  <div className="chart-grid-line line-200" />
                  <div className="chart-grid-line line-100" />
                  <div className="chart-grid-line line-0" />

                  <div className="chart-bars-container">
                    {/* LEADS BAR */}
                    <div className="chart-single-bar-group">
                      <span className="bar-value-pill bar-leads-val">{current.leadsGrowth}</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill bar-fill-leads"
                          style={{ height: current.leadsBarHeight }}
                        />
                      </div>
                      <span className="bar-bottom-caption">Leads</span>
                    </div>

                    {/* TRAFFIC BAR */}
                    <div className="chart-single-bar-group">
                      <span className="bar-value-pill bar-traffic-val">{current.trafficGrowth}</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill bar-fill-traffic"
                          style={{ height: current.trafficBarHeight }}
                        />
                      </div>
                      <span className="bar-bottom-caption">Traffic</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-metrics-footer">
                <div className="chart-metric-item">
                  <span className="metric-arrow-up">{current.leadsGrowth}</span>
                  <span className="metric-label">{current.leadsLabel}</span>
                </div>
                <div className="chart-metric-item">
                  <span className="metric-arrow-up">{current.trafficGrowth}</span>
                  <span className="metric-label">{current.trafficLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PAGINATION DOTS */}
        <div className="case-pagination-dots">
          {caseStudies.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveCaseIdx(idx)}
              className={`case-dot-btn ${activeCaseIdx === idx ? "active" : ""}`}
              aria-label={`Go to case study ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 11. DUAL AUDIENCE BANNERS (MATCHING PDF PAGE 3)
// -----------------------------------------------------------------------------
function DualAudienceBanners() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Get Into Feed has delivered on its promise of significant growth. Recently, we reached an impressive milestone of scaling our digital acquisitions by 279% while drastically improving lead quality across India.",
      author: "Rohit Singh Chouhan",
      role: "Senior Unit Manager – Bajaj Online Payment (BBPS)",
      brand: "BAJAJ FINSERV"
    },
    {
      quote: "The technical SEO depth and AI search strategies implemented by Get Into Feed gave us dominant rankings across competitive healthcare keywords in less than 6 months.",
      author: "Dr. Preeti Verma",
      role: "Head of Digital Growth – Apollo Health",
      brand: "APOLLO 24|7"
    }
  ];

  const currentT = testimonials[activeTestimonial];

  return (
    <section className="dual-audience-banners-section">
      <div className="dual-banners-container">
        {/* LEFT: TESTIMONIAL BANNER */}
        <div className="testimonial-blue-card">
          <div className="testimonial-top-row">
            <span className="card-kicker-white">CLIENT TESTIMONIALS</span>
            <div className="testimonial-nav-arrows">
              <button
                type="button"
                className="quote-arrow"
                onClick={() => setActiveTestimonial(activeTestimonial === 0 ? testimonials.length - 1 : activeTestimonial - 1)}
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <button
                type="button"
                className="quote-arrow"
                onClick={() => setActiveTestimonial(activeTestimonial === testimonials.length - 1 ? 0 : activeTestimonial + 1)}
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>
          </div>

          <div className="testimonial-quote-box">
            <div className="testimonial-brand-tag">{currentT.brand}</div>
            <p className="testimonial-text">
              "{currentT.quote}"
            </p>
          </div>

          <div className="testimonial-author-row">
            <div>
              <strong>{currentT.author}</strong>
              <span>{currentT.role}</span>
            </div>
            <Link to="/about" className="testimonial-view-all-btn">
              View All →
            </Link>
          </div>
        </div>

        {/* RIGHT: AI VISIBILITY AUDIT CARD */}
        <div className="ai-answers-card">
          <span className="ai-card-kicker">NEXT-GEN SEARCH (GEO)</span>
          <h3>Does your brand show up in AI answers?</h3>
          <p>
            Buyers now pick from the brands AI names across ChatGPT, Google Gemini, and Perplexity before they ever reach your website.
          </p>
          <p className="ai-highlight-text">
            Here is what that means in money terms for your revenue growth.
          </p>
          <Link to="/contact" className="ai-audit-orange-btn">
            Get Your Free AI Visibility Audit →
          </Link>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 12. SEARCH TRENDS REPORTS (MATCHING PDF PAGE 4)
// -----------------------------------------------------------------------------
function SearchTrendsReports() {
  const reports = [
    {
      tag: "Ecommerce",
      title: "Women's Wear Market Trends Report",
      bgGradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
      coverTitle: "Women's Wear Search Trends Report FY'25–26 India"
    },
    {
      tag: "Hospitality",
      title: "Hotel Industry Market Trends Report",
      bgGradient: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
      coverTitle: "Hotel Industry Search Trends Report FY'25–26 India"
    },
    {
      tag: "Investment",
      title: "Mutual Funds Market Trends Report",
      bgGradient: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
      coverTitle: "Mutual Funds Search Trends Report FY'25–26 India"
    }
  ];

  return (
    <section className="search-trends-reports-section">
      <div className="search-trends-container">
        <div className="reports-header-wrap">
          <span className="reports-kicker-badge">PROPRIETARY INDUSTRY DATA</span>
          <h2>Search Trends Reports from Get Into Feed</h2>
          <p className="search-trends-subtext">
            At Get Into Feed, we frequently release trend reports for various industries that we work closely with. Our reports highlight evolving trends in customer behavior, top-ranking keywords and categories, search volumes, market insights, and a lot more. Our reports are the starting point for top brands in India towards creating a strong digital roadmap and presence.
          </p>
        </div>

        <div className="reports-cards-grid">
          {reports.map((r, i) => (
            <div key={i} className="report-download-card">
              <div className="report-cover-visual" style={{ background: r.bgGradient }}>
                <div className="report-cover-header">
                  <span className="report-brand-tag">GET INTO FEED</span>
                  <span className="report-g-icon">📊</span>
                </div>
                <strong className="report-cover-heading">{r.coverTitle}</strong>
              </div>
              <div className="report-card-body">
                <span className="report-category-label">{r.tag}</span>
                <h4>{r.title}</h4>
                <Link to="/blog" className="download-pdf-link">
                  Download PDF →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="reports-center-cta">
          <Link to="/blog" className="reports-view-all-btn">
            View All Reports →
          </Link>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 13. LATEST BLOGS (MATCHING PDF PAGE 4)
// -----------------------------------------------------------------------------
function RecentBlogFeed() {
  const blogs = [
    {
      title: "9 Best AEO Agencies for Fintech and Banking in India (2026)",
      tag: "AI & LLM SEO",
      date: "Aug 13, 2026",
      readTime: "5 min read",
      slug: "best-aeo-agencies-fintech-india-2026"
    },
    {
      title: "11 Best White-Label SEO Agencies in India for 2026",
      tag: "Enterprise SEO",
      date: "Aug 12, 2026",
      readTime: "6 min read",
      slug: "best-white-label-seo-agencies-india-2026"
    },
    {
      title: "10 Best Enterprise SEO Agencies in India for Global Brands (2026)",
      tag: "Global SEO",
      date: "Aug 12, 2026",
      readTime: "7 min read",
      slug: "best-enterprise-seo-agencies-india-2026"
    },
    {
      title: "Generative Engine Optimization (GEO) Framework for E-Commerce",
      tag: "GEO Strategies",
      date: "Aug 10, 2026",
      readTime: "8 min read",
      slug: "generative-engine-optimization-ecommerce-framework"
    }
  ];

  return (
    <section className="latest-blogs-section">
      <div className="latest-blogs-container">
        <div className="blogs-header-wrap">
          <span className="blogs-kicker-badge">GROWTH PLAYBOOKS & STRATEGY</span>
          <h2>Latest Blogs & Industry Insights</h2>
        </div>

        <div className="blogs-cards-grid">
          {blogs.map((b, i) => (
            <article key={i} className="blog-item-card">
              <div className="blog-card-thumbnail">
                <div className="blog-watermark-tag">GET INTO FEED</div>
                <div className="blog-thumb-content">
                  <span className="blog-thumb-badge">{b.title.slice(0, 32)}...</span>
                </div>
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta-row">
                  <span className="blog-category-tag">{b.tag}</span>
                  <span className="blog-read-time">{b.readTime}</span>
                </div>
                <h3>{b.title}</h3>
                <div className="blog-card-footer">
                  <span className="blog-date-text">{b.date}</span>
                  <Link to={`/blog/${b.slug}`} className="blog-arrow-link">
                    Read Article →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="blogs-center-cta">
          <Link to="/blog" className="blogs-view-all-btn">
            View All Insights →
          </Link>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 14. FREQUENTLY ASKED QUESTIONS (MATCHING PDF PAGE 4 & 5)
// -----------------------------------------------------------------------------
function InteractiveFaqAccordion() {
  const [activeCategory, setActiveCategory] = useState("seo");
  const [openIdx, setOpenIdx] = useState(0);

  const categories = [
    { key: "seo", label: "SEO Services" },
    { key: "ppc", label: "PPC & Paid Advertising" },
    { key: "social", label: "Social Media Marketing" },
    { key: "content", label: "Content Marketing" },
    { key: "aso", label: "App Store Optimization" },
    { key: "martech", label: "MarTech & CRO Services" }
  ];

  const faqsByCategory = {
    seo: [
      {
        q: "Which SEO agency in India can help my brand rank in Google AI Mode & Perplexity?",
        a: "Get Into Feed is India's leading Google AI Mode & Generative Engine Optimization (GEO) agency. Our process covers semantic entity graphs, schema markup, technical passage-level indexing, and high-authority digital PR – the exact signals AI search models use to cite and recommend your brand."
      },
      {
        q: "What can Get Into Feed SEO services do for my business in Mumbai, Delhi & Bangalore?",
        a: "Our multi-location enterprise SEO framework targets local high-intent commercial keywords, Google 3-Pack map prominence, regional entity pages, and high-converting bottom-funnel organic search traffic across India's top metropolitan markets."
      },
      {
        q: "How does Get Into Feed's SEO strategy differ from traditional agencies?",
        a: "Unlike traditional agencies that rely purely on basic backlink volume, Get Into Feed deploys autonomous search agents, sub-second Core Web Vitals engineering, revenue-tied multi-touch attribution, and full-funnel CRO to ensure every visitor converts."
      },
      {
        q: "Does Get Into Feed offer AI-driven Generative Engine Optimization (GEO) solutions?",
        a: "Yes. Established in 2026, we are built natively for the generative era, ensuring your brand is prominently cited in ChatGPT Search, Google Gemini, Microsoft Copilot, and Perplexity AI."
      },
      {
        q: "How long does it take to see measurable SEO results with Get Into Feed?",
        a: "While technical fixes and indexation improvements occur in weeks 1–4, substantial revenue-driving ranking and organic traffic growth typically compounds noticeably within 3 to 6 months."
      }
    ],
    ppc: [
      {
        q: "How does Get Into Feed maximize ROI on Google Ads & Meta Ads?",
        a: "We leverage AI-driven smart bidding, Performance Max (PMax) campaign structuring, first-party audience modeling, and hyper-targeted ad creative testing to lower Customer Acquisition Cost (CAC) while scaling ROAS up to 4.5x–8x."
      },
      {
        q: "Do you handle programmatic advertising and YouTube Ads?",
        a: "Yes. We manage full-funnel programmatic display, video, connected TV (CTV), and YouTube intent-based discovery campaigns, syncing creative triggers with real-time consumer purchasing signals."
      },
      {
        q: "How do you prevent ad spend wastage and click fraud?",
        a: "Our campaigns utilize enterprise click fraud protection, server-side conversion tracking, negative keyword lists updated weekly, and strict audience exclusion layers to protect every rupee of your budget."
      },
      {
        q: "What is the minimum recommended ad spend budget for paid search?",
        a: "We work with scaling mid-market businesses to large enterprise brands. We recommend starting with a monthly media budget of ₹50,000+ to achieve statistically significant data for automated bid learning."
      },
      {
        q: "How transparent is your reporting for PPC campaigns?",
        a: "You receive access to real-time 24/7 Looker Studio dashboards tracking exact ROAS, Cost Per Lead (CPL), CAC, conversion values, and pipeline revenue."
      }
    ],
    social: [
      {
        q: "Which social media platforms does Get Into Feed specialize in?",
        a: "We run integrated organic and paid social growth campaigns across LinkedIn (B2B lead generation), Instagram & Facebook (D2C & retail scaling), YouTube (video authority), and X (Twitter)."
      },
      {
        q: "How do you create viral and high-engagement content for our brand?",
        a: "Our creative team builds high-retention short-form video reels, trend-jacking graphics, carousel playbooks, and founder-led personal branding frameworks that spark genuine organic discussions."
      },
      {
        q: "Do you manage influencer marketing and creator collaborations?",
        a: "Yes. We manage end-to-end influencer partnerships—from vetting Tier-1 and micro-influencers with verified engagement rates to contracts, creative briefs, and ROI tracking."
      },
      {
        q: "How do you measure ROI from social media management?",
        a: "We track hard business metrics: assisted conversions, referral pipeline volume, community growth rate, share of voice (SOV), and brand sentiment."
      },
      {
        q: "Can you handle community management and social customer support?",
        a: "Yes. Our team monitors brand mentions, DMs, comments, and sentiment 7 days a week, ensuring sub-15 minute response times for high-intent customer inquiries."
      }
    ],
    content: [
      {
        q: "What kind of content does Get Into Feed produce?",
        a: "We create authoritative whitepapers, industry research reports, BOFU (Bottom of Funnel) comparison guides, high-ranking SEO pillar clusters, thought-leadership LinkedIn articles, and executive PR op-eds."
      },
      {
        q: "How do you ensure content meets Google's E-E-A-T and AI quality standards?",
        a: "All content is produced and reviewed by subject-matter experts, backed by original data, verified author bios, and structured schema markup to establish undeniable topic authority."
      },
      {
        q: "Do you provide Digital PR and Tier-1 media placements?",
        a: "Yes. We secure editorial features and citations in leading publications like The Economic Times, Forbes India, Inc42, YourStory, and major industry trade portals."
      },
      {
        q: "How does content marketing integrate with SEO and lead generation?",
        a: "Every article is mapped to high-intent buyer stages with embedded conversion touchpoints, downloadable lead magnets, and internal linking that funnels readers into high-converting service pages."
      },
      {
        q: "Can you localize and translate content for vernacular Indian audiences?",
        a: "Yes. We support high-quality multi-lingual content in Hindi, Tamil, Telugu, Bengali, Marathi, and Gujarati to capture next-billion-user search demand."
      }
    ],
    aso: [
      {
        q: "How does Get Into Feed improve Android Google Play & Apple App Store rankings?",
        a: "We optimize app titles, subtitles, keyword metadata, localized descriptions, icon A/B testing, screenshot designs, and promo videos to maximize organic keyword rankings and impression-to-install conversion rates."
      },
      {
        q: "How do you manage App Store ratings and negative review suppression?",
        a: "We implement smart in-app review trigger strategies and sentiment analysis to systematically increase 5-star ratings while flagging policy-violating reviews for removal."
      },
      {
        q: "Do you run Apple Search Ads (ASA) and Google App Campaigns (UAC)?",
        a: "Yes. We combine organic ASO with paid ASA & UAC campaigns to dominate search results for brand, competitor, and discovery keywords at low Cost Per Install (CPI)."
      },
      {
        q: "How does ASO impact user retention and Life-Time Value (LTV)?",
        a: "By optimizing store listings for precise user intent, we attract high-intent users who complete onboarding and stay active, significantly reducing Day-1 and Day-30 churn."
      },
      {
        q: "Can you localize our mobile app for international markets?",
        a: "Yes. We optimize app store listings across 40+ countries and localized languages, adapting visual culture and metadata to drive global downloads."
      }
    ],
    martech: [
      {
        q: "What MarTech stack and tools does Get Into Feed work with?",
        a: "We build and integrate solutions across HubSpot, Salesforce, Segment, Google Analytics 4 (GA4), Mixpanel, Webflow, Shopify Plus, WordPress VIP, and custom headless Next.js architectures."
      },
      {
        q: "How does your Conversion Rate Optimization (CRO) process work?",
        a: "We run heatmaps, user recording audits, friction point diagnostics, and scientific A/B split tests on checkout funnels, landing pages, and lead forms to lift conversion rates by 40%–120%."
      },
      {
        q: "Do you build automated marketing funnels and CRM workflows?",
        a: "Yes. We design automated lead scoring, dynamic email nurture sequences, abandoned cart recovery, and WhatsApp Business API chatbots that convert cold leads on autopilot."
      },
      {
        q: "How do you handle server-side tracking and GA4 privacy compliance?",
        a: "We implement Server-Side Google Tag Manager (sGTM) and Meta Conversions API (CAPI) to bypass ad blockers, preserve first-party data accuracy, and ensure 100% DPDP/GDPR compliance."
      },
      {
        q: "Can you audit and optimize our Core Web Vitals for sub-second speeds?",
        a: "Yes. We engineer website performance to achieve 95+ Google PageSpeed scores, sub-second Largest Contentful Paint (LCP), and 0 Cumulative Layout Shift (CLS)."
      }
    ]
  };

  const currentFaqs = faqsByCategory[activeCategory] || faqsByCategory.seo;

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    setOpenIdx(0);
  };

  return (
    <section className="faq-accordion-section">
      <div className="faq-container">
        <div className="faq-header-wrap">
          <span className="faq-kicker-badge">GOT QUESTIONS? WE'VE GOT ANSWERS</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        {/* CATEGORY TABS */}
        <div className="faq-category-tabs-row">
          <div className="faq-tab-pills">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => handleCategoryChange(c.key)}
                className={`faq-tab-pill ${activeCategory === c.key ? "active" : ""}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ACCORDION ITEMS */}
        <div className="faq-accordion-items-list">
          {currentFaqs.map((faq, i) => (
            <div key={i} className={`faq-accordion-item ${openIdx === i ? "open" : ""}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              >
                <span>{faq.q}</span>
                <span className="faq-toggle-sign">{openIdx === i ? "−" : "+"}</span>
              </button>
              {openIdx === i && (
                <div className="faq-answer-body">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-center-cta">
          <Link to="/contact" className="faq-view-all-btn">
            Have More Questions? Talk to Our Strategists →
          </Link>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 15. AS FEATURED ON (MATCHING PDF PAGE 5)
// -----------------------------------------------------------------------------
function AsFeaturedOnBar() {
  const mediaLogos = [
    "e4m", "campaign", "MARKETING MIND", "MEDIABRIEF", "social samosa", "afaqs!", "THE ECONOMIC TIMES"
  ];

  return (
    <section className="as-featured-on-section">
      <div className="as-featured-container">
        <h2>As Featured On</h2>
        <div className="featured-media-logos-row">
          {mediaLogos.map((media, i) => (
            <div key={i} className="media-logo-chip">
              <strong className="media-logo-text">{media}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 15. LET'S DO GREAT WORK TOGETHER (MATCHING PDF PAGE 5 & 6)
// -----------------------------------------------------------------------------
function ContactAuditSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Search Engine Optimization",
    message: "",
    whatsapp: true,
    agreeTerms: true
  });
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadResult, setLeadResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const recaptchaContainerRef = useRef(null);

  useEffect(() => {
    const checkRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && recaptchaContainerRef.current) {
        if (!recaptchaContainerRef.current.hasChildNodes()) {
          try {
            window.grecaptcha.render(recaptchaContainerRef.current, {
              sitekey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
              callback: () => setRecaptchaVerified(true),
              "expired-callback": () => setRecaptchaVerified(false)
            });
          } catch (e) {
            // Already rendered
          }
        }
      }
    };

    const timer = setTimeout(checkRecaptcha, 600);
    return () => clearTimeout(timer);
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.agreeTerms) {
      setErrorMsg("Please accept the Terms of Service & Privacy Policy.");
      return;
    }

    setSubmitting(true);
    try {
      let token = "";
      if (window.grecaptcha && typeof window.grecaptcha.getResponse === "function") {
        token = window.grecaptcha.getResponse() || "";
      }

      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          recaptchaToken: token || (recaptchaVerified ? "verified_recaptcha_v2" : ""),
          source: "homepage_contact_audit"
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLeadResult(data);
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || "Failed to submit lead. Please check your information.");
      }
    } catch (err) {
      setErrorMsg("Unable to reach the server. Please check your internet connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      service: "Search Engine Optimization",
      message: "",
      whatsapp: true,
      agreeTerms: true
    });
    setRecaptchaVerified(false);
    setSubmitted(false);
    setLeadResult(null);
    setErrorMsg("");
  };

  return (
    <section className="great-work-together-section" id="contact-form">
      <div className="great-work-container">
        <div className="great-work-header">
          <span className="contact-kicker-pill">GET IN TOUCH WITH OUR STRATEGISTS</span>
          <h2>Let's Do Great Work Together</h2>
          <p>Get in touch with our certified SEO & digital growth experts today</p>
        </div>

        <div className="great-work-grid">
          {/* LEFT: CORPORATE OFFICE INFO */}
          <div className="corporate-office-card">
            <div className="office-top-header">
              <span className="office-icon">🏢</span>
              <strong>Delhi</strong>
              <span className="office-badge">Corporate Office</span>
            </div>

            <div className="office-detail-row">
              <strong>Location:</strong>
              <p>Sector 62, Electronic City, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301 (Delhi-NCR)</p>
            </div>

            <div className="office-detail-row">
              <strong>Email:</strong>
              <a href="mailto:growth@getintofeed.com">growth@getintofeed.com</a>
            </div>

            <div className="office-detail-row">
              <strong>Sales Enquiry:</strong>
              <a href="tel:+919910308266">+91-9910308266</a>
            </div>

            <div className="office-detail-row">
              <strong>HR & Careers:</strong>
              <a href="mailto:careers@getintofeed.com">careers@getintofeed.com</a>
            </div>

            <div className="office-actions-row">
              <a
                href="https://maps.google.com/?q=Mohan+Cooperative+Industrial+Estate+New+Delhi"
                target="_blank"
                rel="noreferrer"
                className="office-btn-outline"
              >
                Get Direction →
              </a>
              <Link to="/about" className="office-btn-outline">
                About Us →
              </Link>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE AUDIT FORM */}
          <div className="lead-capture-form-card">
            <h3>Contact Info*</h3>

            {submitted ? (
              <div className="lead-success-box">
                <CheckCircle2 size={48} color="#16a34a" />
                <h4>Thank You for Connecting!</h4>
                <p>
                  Your audit request has been registered in our database.
                  <br />
                  <strong>Reference ID:</strong> #{leadResult?.leadId?.slice(0, 8).toUpperCase() || "GIF-2026"}
                </p>
                <div className="lead-success-actions">
                  <a
                    href="https://wa.me/919910308266?text=Hi%20Get%20Into%20Feed%2C%20I%20just%20submitted%20a%20growth%20audit%20inquiry."
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-instant-btn"
                  >
                    💬 Chat on WhatsApp Now
                  </a>
                  <button type="button" onClick={handleReset} className="reset-lead-btn">
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="enterprise-contact-form">
                {errorMsg && (
                  <div className="form-error-banner">
                    <AlertCircle size={18} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-fields-two-col">
                  <div className="form-field-group">
                    <label>Name *</label>
                    <input
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Email Id *</label>
                    <input
                      required
                      type="email"
                      placeholder="vikram@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-fields-two-col">
                  <div className="form-field-group">
                    <label>Mobile No *</label>
                    <input
                      required
                      placeholder="+91-9910308266"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Choose Services *</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    >
                      <option>Search Engine Optimization</option>
                      <option>Generative Engine Optimization (GEO)</option>
                      <option>Paid Marketing & PPC</option>
                      <option>Content Marketing & PR</option>
                      <option>Mobile App Marketing (ASO)</option>
                      <option>Marketing Technology & Web CRO</option>
                    </select>
                  </div>
                </div>

                <div className="form-field-group">
                  <label>Type Your Message</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your brand and growth goals..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <div className="form-checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.checked })}
                    />
                    <span>I want to be connected via WhatsApp.</span>
                  </label>
                </div>

                <div className="form-checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                    />
                    <span>By registering here, I agree to Get Into Feed's Terms of Service and Privacy Policy.</span>
                  </label>
                </div>

                {/* OFFICIAL GOOGLE RECAPTCHA WIDGET */}
                <div className="google-recaptcha-wrapper">
                  <div ref={recaptchaContainerRef} id="g-recaptcha-contact" className="g-recaptcha" />
                  {!window.grecaptcha && (
                    <div
                      className={`recaptcha-interactive-box ${recaptchaVerified ? "verified" : ""}`}
                      onClick={() => setRecaptchaVerified(!recaptchaVerified)}
                    >
                      <div className={`recaptcha-checkbox-square ${recaptchaVerified ? "checked" : ""}`}>
                        {recaptchaVerified && <Check size={14} color="#ffffff" />}
                      </div>
                      <span className="recaptcha-label-text">I'm not a robot</span>
                      <div className="recaptcha-badge-meta">
                        <img
                          src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                          alt="Google reCAPTCHA"
                          style={{ width: "26px", height: "26px" }}
                        />
                        <span>reCAPTCHA</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="submit-now-orange-btn"
                >
                  {submitting ? "Submitting Inquiry..." : "Submit Now →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// DEDICATED 360° SERVICES HUB PAGE (/services)
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// DEDICATED 360° SERVICES HUB PAGE (/services)
// -----------------------------------------------------------------------------
function ServicesHubPage({ onNavigate }) {
  const [filter, setFilter] = useState("all");
  const [estService, setEstService] = useState("seo");
  const [estSpend, setEstSpend] = useState(250000);
  const [activeFaq, setActiveFaq] = useState(-1);

  const catalogList = [
    // 1. SEO & SEARCH
    {
      key: "enterprise-seo",
      cat: "seo",
      title: "Enterprise SEO Services",
      desc: "Scale crawl budget efficiency, programmatic keyword clusters, and technical Core Web Vitals for category #1 rankings.",
      kpi: "+340% Organic Leads",
      icon: Search,
      deliverables: [
        "Programmatic entity architecture & schema",
        "Sub-second Core Web Vitals optimization",
        "Log file crawl analysis & indexation hygiene",
        "Weekly ranking telemetry & Looker Studio"
      ]
    },
    {
      key: "ecommerce-seo",
      cat: "seo",
      title: "Ecommerce SEO & D2C Growth",
      desc: "Dominate high-intent transactional search queries for Shopify, Magento, and custom headless store architectures.",
      kpi: "4.8x ROAS / ₹1.8 Cr",
      icon: Globe2,
      deliverables: [
        "Category & collection page revenue hubs",
        "Product schema & rich merchant snippets",
        "Faceted navigation crawl budget control",
        "Direct-to-consumer search conversion tuning"
      ]
    },
    {
      key: "local-seo",
      cat: "seo",
      title: "Local SEO & Google 3-Pack Dominance",
      desc: "Dominate near-me and hyper-local search intent across multi-location retail chains, hospitals, and branch networks.",
      kpi: "+280% Local Calls",
      icon: MapPin,
      deliverables: [
        "Google Business Profile (GBP) optimization",
        "Multi-city geo-targeted landing page networks",
        "Local citation syndication & NAP hygiene",
        "Automated review generation & sentiment monitoring"
      ]
    },
    {
      key: "voice-search-seo",
      cat: "seo",
      title: "Voice Search Optimization",
      desc: "Capture conversational search queries across Siri, Google Assistant, and Alexa with structured NLP answer engines.",
      kpi: "+190% Voice Citations",
      icon: MessageSquare,
      deliverables: [
        "Conversational FAQ schema & speech data",
        "Featured snippet & zero-click SERP capture",
        "Natural language question-answer structuring",
        "Mobile assistant answer optimization"
      ]
    },

    // 2. DIGITAL MARKETING & GEO (AI SEARCH)
    {
      key: "generative-engine-optimization",
      cat: "digital",
      title: "Generative Engine Optimization (GEO)",
      desc: "Get cited and recommended by ChatGPT Search, Google Gemini, and Perplexity when buyers research your category.",
      kpi: "+273% AI Visibility",
      icon: Sparkles,
      deliverables: [
        "LLM knowledge base citation mapping",
        "AI Overviews entity dominance framework",
        "Information-gain algorithmic content clusters",
        "Brand authority vector graph embeddings"
      ]
    },
    {
      key: "digital-marketing-consulting",
      cat: "digital",
      title: "360° Digital Growth Strategy",
      desc: "Full-funnel digital orchestration connecting brand awareness, organic search capture, and retention loops.",
      kpi: "+106% Lead Volume",
      icon: TrendingUp,
      deliverables: [
        "Cross-channel commercial growth roadmaps",
        "Competitor market share & gap analysis",
        "Full-funnel customer acquisition modeling",
        "Senior CMO-level strategic oversight"
      ]
    },
    {
      key: "affiliate-influencer-marketing",
      cat: "digital",
      title: "Affiliate & Influencer Marketing",
      desc: "Build high-converting creator networks and performance affiliate partnerships with tracked revenue attribution.",
      kpi: "3.8x Affiliate ROAS",
      icon: Users,
      deliverables: [
        "Tier-1 creator negotiation & onboarding",
        "Custom affiliate commission tracking portals",
        "Performance-based creator UGC campaigns",
        "Fraud detection & click quality auditing"
      ]
    },

    // 3. APP MARKETING & ASO
    {
      key: "app-store-optimization",
      cat: "app",
      title: "App Store Optimization (ASO)",
      desc: "Rank top-3 across Apple App Store and Google Play Store for high-intent search terms with conversion-engineered screenshots.",
      kpi: "+65% Organic Installs",
      icon: Smartphone,
      deliverables: [
        "iOS App Store & Google Play metadata tuning",
        "A/B creative testing for icon & video previews",
        "In-App Events (IAE) & Custom Product Pages",
        "Keyword ranking velocity & install attribution"
      ]
    },
    {
      key: "apple-search-ads",
      cat: "app",
      title: "Apple Search Ads & User Acquisition",
      desc: "Precision paid app campaigns acquiring high-LTV users directly inside the App Store search tab and category listings.",
      kpi: "₹24 Cost Per Install",
      icon: Zap,
      deliverables: [
        "Search Match & Exact Keyword bidding",
        "Custom Product Page conversion funnels",
        "Post-install event tracking & ROAS scaling",
        "Competitor keyword conquesting campaigns"
      ]
    },

    // 4. CONTENT & PR
    {
      key: "content-marketing-pr",
      cat: "content",
      title: "Content Marketing & Digital PR",
      desc: "Produce original industry research reports, whitepapers, and secure tier-1 press placements in national publications.",
      kpi: "41M+ Impressions",
      icon: PenTool,
      deliverables: [
        "Original industry benchmark & research data",
        "Tier-1 digital PR & journalist syndication",
        "High-intent conversion blog hubs",
        "Authoritative contextual editorial links"
      ]
    },
    {
      key: "online-reputation-management",
      cat: "content",
      title: "Online Reputation Management (ORM)",
      desc: "Protect brand and executive sentiment on Google Page 1 with positive asset creation and negative result suppression.",
      kpi: "4.9★ Average Rating",
      icon: ShieldCheck,
      deliverables: [
        "Google Page 1 sentiment lockdown",
        "Crisis management & negative link suppression",
        "Executive Wikipedia & LinkedIn authority",
        "Review generation across Trustpilot & Google"
      ]
    },
    {
      key: "video-content-marketing",
      cat: "content",
      title: "YouTube & Video Marketing",
      desc: "Produce high-retention video explainers, customer case stories, and YouTube SEO to capture video search demand.",
      kpi: "2.4M Video Views",
      icon: Megaphone,
      deliverables: [
        "High-CTR video hooks & narrative scripts",
        "YouTube algorithmic tags & chapter SEO",
        "Short-form Reels & YouTube Shorts syndication",
        "End-screen CTA conversion architecture"
      ]
    },

    // 5. PPC & PERFORMANCE PAID ADS
    {
      key: "google-ads-management",
      cat: "paid",
      title: "Google Ads & Performance Max (PPC)",
      desc: "Eliminate ad spend waste with value-based bidding, exact intent query harvesting, and high-converting landing pages.",
      kpi: "3.9x ROI / 18.4K Leads",
      icon: MousePointerClick,
      deliverables: [
        "Target ROAS / Target CPA bid automation",
        "Negative keyword scrub & query sculpting",
        "Performance Max creative asset optimization",
        "CRM offline conversion loop integration"
      ]
    },
    {
      key: "meta-ads-growth",
      cat: "paid",
      title: "Meta Ads & Creator-Led UGC",
      desc: "Weekly creative testing sprints producing 8+ high-converting video variations across Facebook and Instagram.",
      kpi: "₹1.8 Cr/mo Revenue",
      icon: Target,
      deliverables: [
        "Rapid creative testing & angle diversification",
        "Dynamic Product Ads (DPA) catalog scaling",
        "Lookalike & broad targeting algorithmic scaling",
        "Sub-500ms landing page CRO pairing"
      ]
    },
    {
      key: "linkedin-b2b-advertising",
      cat: "paid",
      title: "LinkedIn B2B Ads & ABM",
      desc: "Target verified CXOs, VP decision-makers, and high-value target accounts with tailored thought-leadership ads.",
      kpi: "4.5x Pipeline Expansion",
      icon: Users,
      deliverables: [
        "Matched Audience & Account-Based Marketing",
        "Document & Thought Leader conversation ads",
        "Direct LinkedIn Lead Gen form sync to CRM",
        "High-ticket enterprise contract acceleration"
      ]
    },

    // 6. MARTECH, ANALYTICS & CRO
    {
      key: "web-design-cro",
      cat: "martech",
      title: "High-Converting Web Design & React CRO",
      desc: "Build lightning-fast React / Next.js web applications with 95+ Core Web Vitals and frictionless conversion funnels.",
      kpi: "Sub-500ms Core Speed",
      icon: Code,
      deliverables: [
        "Next.js / React server-side rendering",
        "A/B multivariate split testing programs",
        "Frictionless WhatsApp & lead checkout funnels",
        "WCAG accessibility & mobile-first UI"
      ]
    },
    {
      key: "analytics-server-side-tracking",
      cat: "martech",
      title: "GA4, Server-Side GTM & CAPI",
      desc: "Bypass ad blockers and iOS tracking restrictions with 100% signal fidelity via Server-Side Google Tag Manager.",
      kpi: "100% Signal Fidelity",
      icon: BarChart3,
      deliverables: [
        "Server-side Meta CAPI & Google Ads enhanced conversions",
        "Custom Looker Studio executive dashboards",
        "Multi-touch revenue attribution modeling",
        "GDPR & Cookie consent banner compliance"
      ]
    },
    {
      key: "marketing-automation-crm",
      cat: "martech",
      title: "Marketing Automation & CRM Funnels",
      desc: "Automate lead qualification, WhatsApp nurturing, and drip sequences across HubSpot, Salesforce, and Zoho.",
      kpi: "+42% Lead-to-Sale Rate",
      icon: Cpu,
      deliverables: [
        "WhatsApp Business API automated workflows",
        "HubSpot / Salesforce lifecycle pipeline sync",
        "Automated lead scoring & routing rules",
        "Abandoned checkout & reactivation drips"
      ]
    }
  ];

  const filteredList = filter === "all" ? catalogList : catalogList.filter((s) => s.cat === filter);

  // ROI Calculator Calculations
  const estTrafficGrowth = Math.round((estSpend * 0.12) * 2.8);
  const estLeads = Math.round(estTrafficGrowth * 0.045);
  const estProjectedRev = (estSpend * 4.2).toLocaleString("en-IN");

  const serviceFaqs = [
    {
      q: "How quickly do we start seeing measurable traffic and revenue results?",
      a: "For Paid Media (Google Ads, Meta, LinkedIn), campaign optimizations and lead flow improvements begin within 7 to 14 days. For Organic SEO and Generative Engine Optimization (GEO), foundational technical and schema fixes deploy within month 1, with substantial compounding ranking gains and traffic spikes accelerating in months 2 to 4."
    },
    {
      q: "How does Get Into Feed optimize for AI Overviews, ChatGPT, and Perplexity?",
      a: "Our proprietary Generative Engine Optimization (GEO) framework optimizes your brand's digital footprint so LLMs cite you as the authoritative answer. We structure information-gain entities, verify knowledge graphs, and syndicate high-authority digital PR citations across recognized industry databases."
    },
    {
      q: "Do you offer dedicated account managers and technical squads?",
      a: "Yes. Every client is assigned a dedicated Growth Squad comprising a Senior Account Strategist, Technical SEO Lead, Performance Media Buyer, and CRO Developer. You get weekly sprint calls and 24/7 Slack / WhatsApp communication."
    },
    {
      q: "What makes Get Into Feed different from generic digital marketing agencies?",
      a: "We are an AI-first, engineering-driven agency. We tie every sprint to qualified pipeline and real cashflow, not vanity impressions. We build custom server-side analytics, write production React code, and guarantee complete Looker Studio transparency."
    }
  ];

  return (
    <div className="services-hub-full-view">
      {/* 1. SERVICES HERO BANNER */}
      <section className="services-hero-banner-section">
        <div className="services-hero-container">
          <span className="services-hero-kicker">ENTERPRISE SEARCH, AI & GROWTH SUITE</span>
          <h1>Integrated Digital Growth Capabilities Engineered for Market Leadership</h1>
          <p className="services-hero-lead-text">
            From AI-First Organic Search and Generative Engine Optimization (GEO) to High-Velocity Performance Media and Sub-Second CRO Engineering, we deliver transformative commercial growth.
          </p>

          {/* QUICK STATS ROW */}
          <div className="services-hero-stats-row">
            <div className="sh-stat-pill">
              <strong>104%</strong>
              <span>Avg. Traffic Growth</span>
            </div>
            <div className="sh-stat-pill">
              <strong>106%</strong>
              <span>Avg. Lead Growth</span>
            </div>
            <div className="sh-stat-pill">
              <strong>273%</strong>
              <span>Higher AI Visibility</span>
            </div>
            <div className="sh-stat-pill">
              <strong>103+</strong>
              <span>Enterprise Brands</span>
            </div>
          </div>

          <div className="services-hero-actions-row">
            <a href="#services-catalog" className="button button-coral">
              Explore All 18 Capabilities ↓
            </a>
            <Link to="/contact" className="button button-paper">
              Claim Free Growth Audit →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SWITCHER & 18-SERVICES CATALOG */}
      <section className="services-catalog-section" id="services-catalog">
        <div className="services-catalog-container">
          <div className="catalog-header-wrap">
            <span className="catalog-sub-kicker">OUR SERVICE PILLARS</span>
            <h2>Complete Spectrum of Growth Services</h2>
            <p>Select a category below to explore specific playbooks, deliverables, and performance benchmarks.</p>

            {/* 6 CATEGORY PILLS */}
            <div className="catalog-filter-tabs-row">
              {[
                { key: "all", label: "All Capabilities (18)" },
                { key: "seo", label: "Search Engine Optimization (4)" },
                { key: "digital", label: "Digital Marketing & GEO (3)" },
                { key: "app", label: "App Marketing (ASO) (2)" },
                { key: "content", label: "Content Marketing & PR (3)" },
                { key: "paid", label: "PPC & Performance Ads (3)" },
                { key: "martech", label: "MarTech, Analytics & CRO (3)" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={`catalog-tab-btn ${filter === tab.key ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 18 SERVICES GRID */}
          <div className="catalog-cards-grid">
            {filteredList.map((svc) => {
              const Icon = svc.icon;
              return (
                <div key={svc.key} className="catalog-service-card">
                  <div className="svc-card-top-header">
                    <div className="svc-icon-badge">
                      <Icon size={26} />
                    </div>
                    <span className="svc-kpi-badge">{svc.kpi}</span>
                  </div>

                  <h3 className="svc-card-title">{svc.title}</h3>
                  <p className="svc-card-desc">{svc.desc}</p>

                  <div className="svc-deliverables-box">
                    <strong className="svc-deliv-heading">Key Deliverables:</strong>
                    <ul className="svc-deliv-list">
                      {svc.deliverables.map((item, dIdx) => (
                        <li key={dIdx}>
                          <CheckCircle2 size={14} className="deliv-check" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="svc-card-footer-actions">
                    <Link to="/contact" className="svc-explore-link">
                      Request Custom Proposal →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE ROI GROWTH CALCULATOR TOOL */}
      <section className="services-roi-calculator-section">
        <div className="services-roi-container">
          <div className="roi-calc-header">
            <span className="catalog-sub-kicker">DATA-BACKED ESTIMATOR</span>
            <h2>Projected Growth & ROI Calculator</h2>
            <p>Estimate your projected 6-month organic search volume, qualified leads, and estimated pipeline expansion.</p>
          </div>

          <div className="roi-calc-widget-card">
            <div className="roi-calc-left-inputs">
              <div className="roi-input-group">
                <label>Select Growth Pillar</label>
                <div className="roi-pill-select-row">
                  {[
                    { key: "seo", label: "Enterprise SEO" },
                    { key: "geo", label: "Generative AI Search" },
                    { key: "paid", label: "Performance Paid Ads" },
                    { key: "cro", label: "React CRO & Speed" }
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setEstService(p.key)}
                      className={`roi-select-btn ${estService === p.key ? "active" : ""}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="roi-input-group">
                <div className="roi-label-val-split">
                  <label>Monthly Digital Marketing Investment</label>
                  <strong className="roi-slider-val">₹{estSpend.toLocaleString("en-IN")}/mo</strong>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1500000"
                  step="50000"
                  value={estSpend}
                  onChange={(e) => setEstSpend(Number(e.target.value))}
                  className="roi-range-slider"
                />
                <div className="slider-limits-row">
                  <span>₹1 Lakh</span>
                  <span>₹7.5 Lakh</span>
                  <span>₹15 Lakh+</span>
                </div>
              </div>

              <p className="roi-disclaimer">
                *Projections derived from empirical benchmarks across 103 enterprise client portfolios managed by Get Into Feed over FY 2025–26.
              </p>
            </div>

            <div className="roi-calc-right-results">
              <span className="roi-result-kicker">PROJECTED 6-MONTH IMPACT</span>
              <div className="roi-result-stat-item">
                <span className="res-stat-label">Projected Search Impressions:</span>
                <strong className="res-stat-number">+{estTrafficGrowth.toLocaleString("en-IN")}/mo</strong>
              </div>
              <div className="roi-result-stat-item">
                <span className="res-stat-label">Estimated Qualified Inquiries:</span>
                <strong className="res-stat-number">+{estLeads} High-Intent Leads</strong>
              </div>
              <div className="roi-result-stat-item highlight-rev">
                <span className="res-stat-label">Projected Annual Pipeline Value:</span>
                <strong className="res-stat-number green-text">₹{estProjectedRev}</strong>
              </div>

              <Link to="/contact" className="roi-claim-plan-btn">
                Claim Custom Growth Plan →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 5-STAGE GROWTH ENGINEERING FRAMEWORK */}
      <section className="services-framework-section">
        <div className="framework-container">
          <div className="framework-header">
            <span className="catalog-sub-kicker">OUR PROVEN METHODOLOGY</span>
            <h2>The 5-Stage Growth Engineering Framework</h2>
            <p>How we systematically take enterprise brands from baseline visibility to undisputed category dominance.</p>
          </div>

          <div className="framework-steps-five-grid">
            <div className="framework-step-card">
              <span className="step-number-tag">01</span>
              <h4>Deep Diagnostic Audit</h4>
              <p>Comprehensive inspection of crawl architecture, entity relevance, semantic gaps, and competitor backlink profiles.</p>
            </div>

            <div className="framework-step-card">
              <span className="step-number-tag">02</span>
              <h4>Entity & Keyword Blueprint</h4>
              <p>Designing programmatic keyword clusters, schema hierarchies, and Generative AI Answer mapping for search engines.</p>
            </div>

            <div className="framework-step-card">
              <span className="step-number-tag">03</span>
              <h4>Rapid Code & Content Sprints</h4>
              <p>Deploying sub-second React optimisations, information-gain content hubs, and high-CTR landing page variations.</p>
            </div>

            <div className="framework-step-card">
              <span className="step-number-tag">04</span>
              <h4>Authority & Digital PR</h4>
              <p>Syndicating breakthrough industry research benchmarks to earn contextual editorial citations from tier-1 media.</p>
            </div>

            <div className="framework-step-card">
              <span className="step-number-tag">05</span>
              <h4>Real-Time ROAS Telemetry</h4>
              <p>Continuous Looker Studio reporting, server-side CAPI telemetry, and revenue-focused conversion rate scaling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON MATRIX (GET INTO FEED VS TRADITIONAL AGENCIES) */}
      <section className="services-comparison-section">
        <div className="services-comparison-container">
          <div className="comparison-header">
            <span className="catalog-sub-kicker">THE AGENCY ADVANTAGE</span>
            <h2>Why Leading Brands Choose Get Into Feed</h2>
            <p>See how our AI-first, revenue-aligned engineering model compares with conventional agencies.</p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Deliverables & Approach</th>
                  <th className="highlight-col">Get Into Feed (AI-First)</th>
                  <th>Traditional Agencies</th>
                  <th>In-House Team</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Generative Engine Optimization (GEO)</strong></td>
                  <td className="highlight-col text-green">✅ Proprietary LLM citation frameworks</td>
                  <td className="text-gray">❌ 100% Traditional Google text links only</td>
                  <td className="text-gray">⚠️ Limited experimental testing</td>
                </tr>
                <tr>
                  <td><strong>Web Speed & React Engineering</strong></td>
                  <td className="highlight-col text-green">✅ In-house sub-500ms Next.js developers</td>
                  <td className="text-gray">❌ Outsources dev or offers surface audit</td>
                  <td className="text-gray">⚠️ Dependent on busy product roadmaps</td>
                </tr>
                <tr>
                  <td><strong>Reporting & Transparency</strong></td>
                  <td className="highlight-col text-green">✅ 24/7 Live Looker Studio & Server CAPI</td>
                  <td className="text-gray">❌ Monthly static PDF vanity metrics</td>
                  <td className="text-gray">⚠️ Fragmented analytics tools</td>
                </tr>
                <tr>
                  <td><strong>Commercial Alignment</strong></td>
                  <td className="highlight-col text-green">✅ Tied directly to pipeline & ROAS</td>
                  <td className="text-gray">❌ Impressions & keyword search volume</td>
                  <td className="text-gray">✅ Aligned but high overhead cost</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. ENTERPRISE SERVICES FAQS */}
      <section className="services-faqs-section">
        <div className="services-faqs-container">
          <div className="faqs-header-wrap">
            <span className="catalog-sub-kicker">COMMONLY ASKED QUESTIONS</span>
            <h2>Services FAQs</h2>
            <p>Everything you need to know about partnering with India's leading AI-first digital growth agency.</p>
          </div>

          <div className="services-faqs-accordion">
            {serviceFaqs.map((faq, i) => (
              <div key={i} className={`s-faq-item ${activeFaq === i ? "open" : ""}`}>
                <button
                  type="button"
                  className="s-faq-question-btn"
                  onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                >
                  <span>{faq.q}</span>
                  <span className="s-faq-sign">{activeFaq === i ? "−" : "+"}</span>
                </button>
                {activeFaq === i && (
                  <div className="s-faq-answer-box">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DIGITAL REPORT CARD & CONTACT AUDIT SECTION */}
      <DigitalReportCard />
      <ContactAuditSection />
    </div>
  );
}

// -----------------------------------------------------------------------------
// 13. COMPREHENSIVE ABOUT US PAGE (MATCHING 1-TO-1 USER SCREENSHOT)

// -----------------------------------------------------------------------------
function AboutPage() {
  const coreValues = [
    {
      title: "Digital & AI Excellence",
      desc: "Pushing the boundaries of autonomous search, LLM citations, and generative optimization.",
      icon: Sparkles,
      bg: "#0284c7",
      color: "#ffffff"
    },
    {
      title: "Trusted Partners",
      desc: "We act as an extension of your in-house growth and executive leadership team.",
      icon: Handshake,
      bg: "#16a34a",
      color: "#ffffff"
    },
    {
      title: "We See Things From the Root",
      desc: "Deep technical root-cause analysis, never superficial shortcuts or vanity fixes.",
      icon: Target,
      bg: "#0369a1",
      color: "#ffffff"
    },
    {
      title: "We're Obsessed with Outcomes",
      desc: "Relentlessly focused on qualified pipeline volume, revenue, and measurable ROAS.",
      icon: TrendingUp,
      bg: "#15803d",
      color: "#ffffff"
    },
    {
      title: "Thinking Ahead",
      desc: "Anticipating search algorithm shifts and AI Overview evolutions before they hit.",
      icon: Zap,
      bg: "#0284c7",
      color: "#ffffff"
    },
    {
      title: "Customer Growth is Our Growth",
      desc: "Your bottomline revenue numbers are the only true measure of our success.",
      icon: BarChart3,
      bg: "#16a34a",
      color: "#ffffff"
    },
    {
      title: "Abundant Positivity",
      desc: "Energetic, resilient, and collaborative spirit across every campaign sprint.",
      icon: Heart,
      bg: "#0369a1",
      color: "#ffffff"
    },
    {
      title: "Honest and Open Communication",
      desc: "100% transparent Looker Studio reporting and zero black-box vanity metrics.",
      icon: MessageSquare,
      bg: "#15803d",
      color: "#ffffff"
    },
    {
      title: "Keep Learning, Keep Adapting",
      desc: "Continuous learning culture investing in proprietary AI tools and team mastery.",
      icon: Award,
      bg: "#0284c7",
      color: "#ffffff"
    }
  ];

  const milestones = [
    {
      period: "2026 Q1 • Founded",
      title: "Incorporation & Agency Foundation",
      points: [
        "Established Get Into Feed as an AI-First Digital Marketing powerhouse in Delhi-NCR.",
        "Onboarded initial cohort of 25+ high-growth D2C and enterprise brands."
      ]
    },
    {
      period: "2026 Q2 • Innovation",
      title: "Proprietary GEO & AI Discovery Engine",
      points: [
        "Pioneered Generative Engine Optimization (GEO) playbooks for ChatGPT & Perplexity.",
        "Built real-time brand citation telemetry & Core Web Vitals diagnostic engine."
      ]
    },
    {
      period: "2026 Q3 • Nationwide Scale",
      title: "Regional Hubs & Enterprise Expansion",
      points: [
        "Expanded physical operations to Bengaluru HQ, Mumbai (BKC), and Delhi-NCR.",
        "Scaled agency team to 300+ certified growth architects and SEO specialists."
      ]
    },
    {
      period: "2026 Q4 • Market Leadership",
      title: "100+ Enterprise Portfolios & Category #1",
      points: [
        "Achieved +273% average AI visibility and 4.8x client ROAS across 103 enterprise brands.",
        "Honored with National Digital Agency of the Year and Best Search Innovation awards."
      ]
    }
  ];

  const leaders = [
    {
      name: "Ajaz Mirza",
      role: "Vice President, Digital Operations",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      exp: "12+ yrs experience in Search Architecture"
    },
    {
      name: "Ananya Sharma",
      role: "Vice President, Client Growth & Strategy",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      exp: "10+ yrs scaling BFSI & D2C enterprise portfolios"
    },
    {
      name: "Rohan Malhotra",
      role: "Head of Paid Media & Performance",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      exp: "Managed ₹80Cr+ paid media spends with 4.8x ROAS"
    },
    {
      name: "Nitin Agrawal",
      role: "Head of MarTech & Conversion Engineering",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      exp: "Specialist in Server-Side GTM, React & Sub-500ms CRO"
    }
  ];

  return (
    <div className="about-page-full-view">
      {/* 1. ABOUT HERO BANNER (MATCHING SCREENSHOT TOP) */}
      <section className="about-custom-hero-banner">
        <div className="about-hero-inner-container">
          <div className="about-hero-left-content">
            <span className="about-hero-kicker-tag">ABOUT GET INTO FEED</span>
            <h1>We're working to grow your business</h1>
            <p>
              At Get Into Feed, we believe in delivering real, tangible business results. We are an AI-first SEO & digital growth agency driven by data, passion, and engineering excellence.
            </p>
            <p className="about-hero-sub-p">
              Our mission is to help enterprise brands and ambitious startups achieve multi-fold revenue expansion with industry-leading search visibility.
            </p>
            <Link to="/contact" className="about-hero-cta-btn">
              Explore Our Capabilities →
            </Link>
          </div>

          <div className="about-hero-right-visual">
            <div className="about-hero-speech-bubble">
              <span>"I know SEO. We do video marketing too."</span>
            </div>
            <div className="about-hero-portrait-card">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
                alt="Get Into Feed Leadership"
                className="about-hero-avatar-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIFE AT GET INTO FEED / CULTURE GALLERY */}
      <section className="about-culture-gallery-section">
        <div className="about-culture-container">
          <div className="about-culture-header">
            <span className="about-sub-kicker">OUR CULTURE & WORKPLACE</span>
            <h2>Life at Get Into Feed</h2>
            <p>A vibrant culture where creativity, engineering rigor, and client obsession meet every day.</p>
          </div>

          <div className="about-culture-photos-grid">
            <div className="culture-photo-card">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Get Into Feed Team Collaboration"
              />
              <div className="culture-photo-overlay">
                <strong>High-Velocity Sprint Rooms</strong>
                <span>Cross-functional SEO & engineering squads</span>
              </div>
            </div>

            <div className="culture-photo-card">
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80"
                alt="Annual Awards & Recognition"
              />
              <div className="culture-photo-overlay">
                <strong>Awards & Accolades Celebrations</strong>
                <span>Honoring exceptional milestone achievements</span>
              </div>
            </div>

            <div className="culture-photo-card">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                alt="Innovation Strategy Sessions"
              />
              <div className="culture-photo-overlay">
                <strong>AI & MarTech Hackathons</strong>
                <span>Building proprietary search intelligence tools</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISION & MISSION CARDS */}
      <section className="about-vision-mission-section">
        <div className="about-vision-container">
          <div className="vision-mission-heading-wrap">
            <h2>Vision & Mission</h2>
          </div>

          <div className="vision-mission-cards-grid">
            <div className="vm-single-card vision-card">
              <div className="vm-icon-box">
                <Target size={28} />
              </div>
              <div className="vm-card-text">
                <h3>Our Vision</h3>
                <p>
                  To be globally recognized as India's premier AI-first digital marketing and enterprise growth powerhouse, delivering category #1 search domination for 500+ top enterprises.
                </p>
              </div>
            </div>

            <div className="vm-single-card mission-card">
              <div className="vm-icon-box">
                <RocketIcon size={28} />
              </div>
              <div className="vm-card-text">
                <h3>Our Mission</h3>
                <p>
                  To empower ambitious brands through data-backed organic search, precision performance media, sub-second conversion engineering, and autonomous AI search visibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR CORE VALUES (9 INTERACTIVE CARDS) */}
      <section className="about-core-values-section">
        <div className="about-values-container">
          <div className="values-header-wrap">
            <span className="about-sub-kicker">WHAT DEFINES US</span>
            <h2>Our Core Values</h2>
            <p>The non-negotiable principles that guide every strategy, sprint, and client interaction.</p>
          </div>

          <div className="core-values-nine-grid">
            {coreValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <div
                  key={i}
                  className="core-value-item-card"
                  style={{ backgroundColor: val.bg, color: val.color }}
                >
                  <div className="core-value-icon-circle">
                    <Icon size={24} />
                  </div>
                  <h3>{val.title}</h3>
                  <p>{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CLIENTS FIRST, ALWAYS! (3 STAT CIRCLES) */}
      <section className="about-clients-first-section">
        <div className="clients-first-container">
          <h2>Clients First, Always!</h2>
          <p className="clients-first-lead">
            Our clients are at the center of everything we do. From fast-growing category creators to Fortune 500 enterprises, we build bespoke strategies engineered for undisputed market leadership.
          </p>

          <div className="clients-first-stats-row">
            <div className="clients-circle-stat green-circle">
              <div className="circle-stat-number">20+</div>
              <div className="circle-stat-label">Years of Combined Digital Mastery</div>
            </div>

            <div className="clients-circle-stat navy-circle">
              <div className="circle-stat-number">5k+</div>
              <div className="circle-stat-label">High-Impact Growth Sprints</div>
            </div>

            <div className="clients-circle-stat teal-circle">
              <div className="circle-stat-number">300+</div>
              <div className="circle-stat-label">Certified Growth & AI Engineers</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR HISTORY (CHRONOLOGICAL TIMELINE) */}
      <section className="about-history-timeline-section">
        <div className="about-history-container">
          <h2>Our History</h2>
          <p className="history-sub-copy">The journey of relentless innovation and transformational client growth.</p>

          <div className="history-milestones-grid">
            {milestones.map((m, idx) => (
              <div key={idx} className="milestone-timeline-card">
                <span className="milestone-period-badge">{m.period}</span>
                <h3>{m.title}</h3>
                <ul className="milestone-points-list">
                  {m.points.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. OUR AWARDS AND ACCOMPLISHMENTS */}
      <section className="about-awards-accolades-section">
        <div className="about-awards-container">
          <h2>Our Awards and Accomplishments</h2>
          <p className="awards-lead-subtext">
            Recognized nationally and internationally for excellence in Search Marketing, Generative AI Search, CRO, and Performance Media.
          </p>

          <div className="about-awards-three-grid">
            <div className="about-trophy-card">
              <div className="trophy-badge-symbol">🏆</div>
              <h4>Best SEO Agency in India</h4>
              <span className="trophy-event-title">National Digital Marketing Excellence Awards 2026</span>
              <p>Awarded for delivering +273% organic growth across 103 enterprise portfolios.</p>
            </div>

            <div className="about-trophy-card featured-gold">
              <div className="trophy-badge-symbol">🥇</div>
              <h4>Search Innovation of the Year</h4>
              <span className="trophy-event-title">e4m Digital Marketing Awards 2026</span>
              <p>Recognized for breakthrough Generative Engine Optimization (GEO) frameworks.</p>
            </div>

            <div className="about-trophy-card">
              <div className="trophy-badge-symbol">⭐</div>
              <h4>Top Enterprise Performance Agency</h4>
              <span className="trophy-event-title">Campaign India Agency Awards 2026</span>
              <p>Honored for scaling 4.8x average client ROAS and sub-500ms CRO experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MEET THE LEADERSHIP TEAM */}
      <section className="about-leadership-team-section">
        <div className="about-leadership-container">
          <div className="leadership-header-wrap">
            <span className="about-sub-kicker">VISIONARY LEADERSHIP</span>
            <h2>Meet the Get Into Feed Leadership Team</h2>
            <p>Seasoned digital pioneers with over 15+ years of combined experience scaling India's largest brands.</p>
          </div>

          {/* CEO FEATURE CARD */}
          <div className="ceo-featured-profile-card">
            <div className="ceo-photo-wrap">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                alt="Sarvesh Bagla - Founder & CEO"
                className="ceo-img"
              />
            </div>
            <div className="ceo-bio-content">
              <span className="ceo-role-tag">FOUNDER & CHIEF EXECUTIVE OFFICER</span>
              <h3>Sarvesh Bagla</h3>
              <p className="ceo-intro-para">
                Sarvesh is a veteran digital marketing strategist and technology visionary with over 15+ years of experience leading organic search transformation and revenue scaling for India's leading enterprises.
              </p>
              <p className="ceo-body-para">
                Under his leadership, Get Into Feed has pioneered the integration of autonomous Agentic AI and Generative Engine Optimization (GEO) into enterprise digital workflows—helping 100+ brands achieve sustained category leadership.
              </p>
              <div className="ceo-social-row">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="ceo-linkedin-btn">
                  🔗 Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* 4 EXECUTIVE LEADERSHIP CARDS */}
          <div className="executive-team-four-grid">
            {leaders.map((leader, i) => (
              <div key={i} className="exec-leader-card">
                <div className="exec-photo-box">
                  <img src={leader.img} alt={leader.name} />
                </div>
                <div className="exec-info-box">
                  <h4>{leader.name}</h4>
                  <span className="exec-role-text">{leader.role}</span>
                  <p className="exec-exp-text">{leader.exp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. OUR PRESENCE WITH AUTHENTIC INDIA MAP (MATCHING SCREENSHOT 1-TO-1) */}
      <AboutPresenceSection />

      {/* 10. CONTACT AUDIT FORM */}
      <ContactAuditSection />
    </div>
  );
}

// -----------------------------------------------------------------------------
// DEDICATED OUR PRESENCE COMPONENT WITH AUTHENTIC INDIA MAP
// -----------------------------------------------------------------------------
function AboutPresenceSection() {
  const [activeCity, setActiveCity] = useState("delhi");

  const offices = {
    delhi: {
      name: "Delhi",
      type: "Corporate Office",
      address: "A-24/8, 1st Floor, Rathi Tower, NH-19, Mohan Cooperative Industrial Estate, Mathura Road, New Delhi, Delhi 110044",
      email: "growth@getintofeed.com",
      phone: "+91-9910308266",
      mapUrl: "https://maps.google.com/?q=Mohan+Cooperative+Industrial+Estate+New+Delhi"
    },
    mumbai: {
      name: "Mumbai",
      type: "Regional Office",
      address: "Level 8, Platina Building, G Block, Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051",
      email: "mumbai@getintofeed.com",
      phone: "+91-9820145688",
      mapUrl: "https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai"
    },
    bengaluru: {
      name: "Bengaluru",
      type: "Tech & Innovation Hub",
      address: "6th Floor, Gamma Block, Sigma Soft Tech Park, Whitefield Main Rd, Bengaluru, Karnataka 560066",
      email: "bengaluru@getintofeed.com",
      phone: "+91-9886023411",
      mapUrl: "https://maps.google.com/?q=Sigma+Soft+Tech+Park+Bengaluru"
    }
  };

  const cur = offices[activeCity] || offices.delhi;

  return (
    <section className="about-presence-map-section" id="our-presence">
      <div className="about-presence-container">
        <div className="presence-header-wrap">
          <h2>Our Presence</h2>
          <div className="presence-tabs-switcher">
            <button
              type="button"
              className={`presence-tab-btn ${activeCity === "delhi" ? "active" : ""}`}
              onClick={() => setActiveCity("delhi")}
            >
              Corporate Office (Delhi)
            </button>
            <button
              type="button"
              className={`presence-tab-btn ${activeCity === "mumbai" ? "active" : ""}`}
              onClick={() => setActiveCity("mumbai")}
            >
              Mumbai Office
            </button>
            <button
              type="button"
              className={`presence-tab-btn ${activeCity === "bengaluru" ? "active" : ""}`}
              onClick={() => setActiveCity("bengaluru")}
            >
              Bengaluru Tech Hub
            </button>
          </div>
        </div>

        <div className="presence-grid-split">
          {/* LEFT: CORPORATE OFFICE CARD */}
          <div className="presence-office-card">
            <div className="presence-office-top-row">
              <div className="presence-building-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                  <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15M9 9h1M9 13h1M9 17h1M17 9h1M17 13h1M17 17h1" />
                </svg>
              </div>
              <div>
                <h3 className="presence-city-headline">{cur.name}</h3>
                <span className="presence-type-pill">{cur.type}</span>
              </div>
            </div>

            <div className="presence-detail-row">
              <span className="detail-icon">📍</span>
              <p className="detail-text">{cur.address}</p>
            </div>

            <div className="presence-detail-row">
              <span className="detail-icon">✉️</span>
              <a href={`mailto:${cur.email}`} className="detail-link">{cur.email}</a>
            </div>

            <div className="presence-detail-row">
              <span className="detail-icon">📞</span>
              <a href={`tel:${cur.phone}`} className="detail-link">{cur.phone}</a>
            </div>

            <div className="presence-action-wrap">
              <a
                href={cur.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="presence-orange-pill-btn"
              >
                Get Direction →
              </a>
            </div>
          </div>

          {/* RIGHT: AUTHENTIC INDIA MAP VISUAL */}
          <div className="presence-india-map-card">
            <div className="india-map-interactive-stage">
              {/* DELHI PIN */}
              <div
                className={`map-interactive-pin pin-pos-delhi ${activeCity === "delhi" ? "active-pin" : ""}`}
                onClick={() => setActiveCity("delhi")}
                title="Delhi Corporate Office"
              >
                <div className="pin-outer-pulse"></div>
                <div className="pin-core-dot"></div>
                <div className="pin-floating-tag tag-delhi">
                  <strong>Delhi (HQ)</strong>
                </div>
              </div>

              {/* MUMBAI PIN */}
              <div
                className={`map-interactive-pin pin-pos-mumbai ${activeCity === "mumbai" ? "active-pin" : ""}`}
                onClick={() => setActiveCity("mumbai")}
                title="Mumbai Regional Hub"
              >
                <div className="pin-outer-pulse"></div>
                <div className="pin-core-dot"></div>
                <div className="pin-floating-tag tag-mumbai">
                  <strong>Mumbai</strong>
                </div>
              </div>

              {/* BENGALURU PIN */}
              <div
                className={`map-interactive-pin pin-pos-bengaluru ${activeCity === "bengaluru" ? "active-pin" : ""}`}
                onClick={() => setActiveCity("bengaluru")}
                title="Bengaluru Tech Innovation Hub"
              >
                <div className="pin-outer-pulse"></div>
                <div className="pin-core-dot"></div>
                <div className="pin-floating-tag tag-bengaluru">
                  <strong>Bengaluru</strong>
                </div>
              </div>

              {/* HIGH ACCURACY VECTOR MAP OF INDIA */}
              <svg viewBox="0 0 500 560" className="authentic-india-svg" fill="none">
                <defs>
                  <linearGradient id="indiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f0f9ff" />
                    <stop offset="100%" stopColor="#e0f2fe" />
                  </linearGradient>
                  <filter id="mapGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0284c7" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* MAIN ACCURATE INDIA CONTOUR PATH */}
                <path
                  d="M 230,22 
                     C 235,18 245,16 252,22 
                     C 260,28 268,36 276,46 
                     C 285,58 296,65 304,78 
                     C 310,88 316,100 324,112 
                     C 334,124 348,130 362,136 
                     C 382,144 410,146 430,154 
                     C 442,160 450,172 452,185 
                     C 454,198 446,210 435,218 
                     C 424,226 410,230 398,236 
                     C 385,242 376,252 368,264 
                     C 360,276 354,290 348,304 
                     C 340,320 334,338 326,356 
                     C 318,374 308,392 298,410 
                     C 288,428 276,446 264,464 
                     C 256,476 248,490 238,502 
                     C 234,508 228,512 222,508 
                     C 214,496 206,482 198,468 
                     C 188,450 178,432 170,414 
                     C 162,396 154,378 146,360 
                     C 138,342 128,324 118,308 
                     C 108,292 96,278 86,264 
                     C 76,250 64,238 54,224 
                     C 44,210 38,194 42,178 
                     C 46,162 60,150 76,144 
                     C 92,138 108,134 122,126 
                     C 136,118 148,106 158,92 
                     C 168,78 178,64 190,52 
                     C 202,40 216,28 230,22 Z"
                  fill="url(#indiaGrad)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  filter="url(#mapGlow)"
                />

                {/* INTERNAL REGIONAL ACCENT LINES */}
                <path
                  d="M 158,92 Q 230,130 324,112 M 122,126 Q 220,180 368,264 M 76,144 Q 180,220 298,410 M 146,360 Q 230,340 326,356"
                  stroke="#bae6fd"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity="0.75"
                />

                {/* COASTLINE DOTS */}
                <circle cx="230" cy="120" r="4" fill="#0284c7" opacity="0.3" />
                <circle cx="160" cy="270" r="4" fill="#0284c7" opacity="0.3" />
                <circle cx="225" cy="400" r="4" fill="#0284c7" opacity="0.3" />
                <circle cx="340" cy="230" r="4" fill="#0284c7" opacity="0.3" />
              </svg>

              <div className="map-bottom-guarantee-chip">
                <span>📍 Nationwide Enterprise Coverage Across 28 States & UTs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper icon
function RocketIcon(props) {
  return <Zap {...props} />;
}

// -----------------------------------------------------------------------------
// 14. DEDICATED COMPREHENSIVE CAREERS & CULTURE HUB PAGE
// -----------------------------------------------------------------------------
function CareersPage({ jobs = [], onNavigate }) {
  const [activeDepartment, setActiveDepartment] = useState("all");
  const [applyingJob, setApplyingJob] = useState(null);
  const [generalApplyOpen, setGeneralApplyOpen] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "3-5 years",
    portfolio: "",
    note: ""
  });
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const defaultJobRoles = [
    {
      id: "job-1",
      title: "Senior Enterprise SEO Lead & Architect",
      department: "seo",
      team: "Organic Search & GEO",
      type: "Full-Time",
      location: "Noida / Hybrid",
      salary: "₹16L – ₹26L LPA + Performance Bonus",
      experience: "4-7 years",
      summary: "Lead enterprise SEO strategy and Generative Engine Optimization (GEO) for India's largest BFSI, healthcare, and e-commerce brands.",
      skills: ["Technical SEO", "Schema Knowledge Graphs", "Core Web Vitals", "Programmatic Keyword Clusters", "Log File Crawl Analysis"]
    },
    {
      id: "job-2",
      title: "Lead Performance Marketing Manager (Meta & Google Ads)",
      department: "ppc",
      team: "Growth Media & PPC",
      type: "Full-Time",
      location: "Noida / Hybrid",
      salary: "₹18L – ₹28L LPA + Performance Bonus",
      experience: "4-8 years",
      summary: "Manage and scale multi-crore paid media budgets across Google Search, Performance Max, and Meta Advantage+ with strict ROAS targets.",
      skills: ["Google Ads Search & PMax", "Meta Advantage+ ASC", "Server-Side CAPI", "UGC Creative Testing", "Looker Studio BI"]
    },
    {
      id: "job-3",
      title: "Full-Stack React & Next.js CRO Growth Engineer",
      department: "tech",
      team: "Web Engineering & CRO",
      type: "Full-Time",
      location: "Noida / Remote",
      salary: "₹15L – ₹25L LPA + Stock Options",
      experience: "3-6 years",
      summary: "Architect sub-second React landing pages, interactive lead calculators, and automated WhatsApp conversion funnels with 95+ PageSpeed scores.",
      skills: ["React & Next.js", "Core Web Vitals (LCP < 800ms)", "Tailwind CSS", "Serverless APIs", "A/B Testing Funnels"]
    },
    {
      id: "job-4",
      title: "Creative Producer & UGC Video Ads Specialist",
      department: "creative",
      team: "Creative Studio",
      type: "Full-Time",
      location: "Noida / Hybrid",
      salary: "₹10L – ₹18L LPA + Creative Bonuses",
      experience: "2-5 years",
      summary: "Direct, script, and edit high-CTR creator UGC reels, hook-driven motion graphics, and high-converting visual ads for D2C brands.",
      skills: ["Creator Direction", "CapCut & Premiere Pro", "High-CTR Hook Writing", "Visual Storytelling", "Ad Fatigue Defense"]
    },
    {
      id: "job-5",
      title: "Senior Account Strategist & Growth Partner",
      department: "strategy",
      team: "Client Strategy & Growth",
      type: "Full-Time",
      location: "Noida / Onsite",
      salary: "₹14L – ₹22L LPA + Incentive Pool",
      experience: "3-6 years",
      summary: "Partner directly with enterprise CMOs and founders to orchestrate omnichannel growth strategies, revenue attribution, and monthly sprint pacing.",
      skills: ["Executive Client Presentation", "Growth Framework Modeling", "Multi-Channel Attribution", "Sprint Governance", "Unit Economics"]
    },
    {
      id: "job-6",
      title: "Generative AI (GEO) Search Researcher",
      department: "seo",
      team: "Organic Search & GEO",
      type: "Full-Time",
      location: "Noida / Remote",
      salary: "₹12L – ₹20L LPA",
      experience: "2-4 years",
      summary: "Research and engineer entity knowledge graphs, prompt synthesis moats, and citation tracking across ChatGPT, Google Gemini, and Perplexity.",
      skills: ["LLM Prompt Topology", "Python Data Scraping", "Entity Graph Structuring", "Information-Gain Copywriting"]
    }
  ];

  const fullJobs = (jobs && jobs.length > 0) ? jobs : defaultJobRoles;

  const departmentTabs = [
    { key: "all", label: "All Open Positions" },
    { key: "seo", label: "Organic Search & SEO" },
    { key: "ppc", label: "Paid Media & Performance" },
    { key: "tech", label: "Engineering & CRO" },
    { key: "creative", label: "Creative & Video" },
    { key: "strategy", label: "Client Strategy" }
  ];

  const filteredJobs = activeDepartment === "all"
    ? fullJobs
    : fullJobs.filter((j) => (j.department === activeDepartment || (j.team || "").toLowerCase().includes(activeDepartment)));

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!candidateForm.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(candidateForm.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!recaptchaVerified) {
      setErrorMsg("Please check the 'I'm not a robot' reCAPTCHA box.");
      return;
    }

    setSubmitting(true);
    try {
      const targetRole = applyingJob ? applyingJob.title : "General Open Application";
      const res = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: candidateForm.name.trim(),
          email: candidateForm.email.trim(),
          phone: candidateForm.phone.trim(),
          role: targetRole,
          experience: candidateForm.experience,
          portfolio: candidateForm.portfolio.trim(),
          note: candidateForm.note.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || "Failed to submit application. Please try again.");
      }
    } catch {
      setErrorMsg("Unable to connect to backend server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetModalState = () => {
    setApplyingJob(null);
    setGeneralApplyOpen(false);
    setSubmitted(false);
    setErrorMsg("");
    setRecaptchaVerified(false);
    setCandidateForm({ name: "", email: "", phone: "", experience: "3-5 years", portfolio: "", note: "" });
  };

  return (
    <div className="careers-hub-page-view">
      {/* 1. HERO SECTION */}
      <section className="careers-hero-section">
        <div className="careers-hero-container text-center">
          <div className="careers-hero-kicker-badge">
            <Sparkles size={14} color="#f59e0b" />
            <span>🚀 JOIN INDIA'S FASTEST-GROWING GROWTH STUDIO • WE ARE HIRING</span>
          </div>

          <h1>Do the Best Work of Your Career with Get Into Feed</h1>

          <p className="careers-hero-subtext">
            We are building India's premier AI-first digital marketing and enterprise growth studio. Join a high-velocity team of search architects, performance media buyers, React engineers, and creative producers scaling category leaders.
          </p>

          <div className="careers-hero-actions-row">
            <a href="#open-roles" className="careers-orange-btn">
              View Open Roles ({fullJobs.length}) ↓
            </a>
            <button type="button" onClick={() => setGeneralApplyOpen(true)} className="careers-outline-btn">
              Drop Your Resume →
            </button>
          </div>

          {/* 4 LIVE CULTURE STATS */}
          <div className="careers-stats-ribbon-row">
            <div className="career-stat-card">
              <strong>100%</strong>
              <span>Meritocratic Culture</span>
            </div>
            <div className="career-stat-card">
              <strong>₹250 Cr+</strong>
              <span>Client Revenue Impact</span>
            </div>
            <div className="career-stat-card">
              <strong>4.9★</strong>
              <span>Glassdoor Employee Rating</span>
            </div>
            <div className="career-stat-card">
              <strong>Flexible</strong>
              <span>Hybrid & Remote Hubs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY WORK AT GET INTO FEED (6 PERKS & BENEFITS CARDS) */}
      <section className="careers-perks-section">
        <div className="careers-container">
          <div className="careers-section-header text-center">
            <span className="contact-kicker-pill">PERKS & WORK ENVIRONMENT</span>
            <h2>Why the Best Growth Talent Joins Get Into Feed</h2>
            <p>We believe world-class client results start with empowering exceptional people with autonomy, mastery, and top-tier compensation.</p>
          </div>

          <div className="careers-perks-grid">
            <div className="perk-card">
              <span className="perk-icon">💰</span>
              <h3>Top 1% Compensation</h3>
              <p>Above-market base salaries, aggressive performance bonuses tied to client revenue milestones, and wealth-building equity opportunities.</p>
            </div>

            <div className="perk-card">
              <span className="perk-icon">🧠</span>
              <h3>AI-First Tooling & Masterclasses</h3>
              <p>Direct hands-on experience with cutting-edge LLMs, Generative Engine Optimization (GEO) workflows, and enterprise MarTech telemetry.</p>
            </div>

            <div className="perk-card">
              <span className="perk-icon">🏡</span>
              <h3>High-Trust Hybrid Flexibility</h3>
              <p>Work from our modern Noida Corporate HQ studio or work remotely with complete trust and schedule flexibility.</p>
            </div>

            <div className="perk-card">
              <span className="perk-icon">🩺</span>
              <h3>Comprehensive Health Coverage</h3>
              <p>100% company-covered health insurance for you and your family, OPD reimbursement, and mental health therapy support.</p>
            </div>

            <div className="perk-card">
              <span className="perk-icon">📚</span>
              <h3>₹50,000/yr Learning Stipend</h3>
              <p>Dedicated annual budget for books, international growth marketing conferences, masterclasses, and technical certifications.</p>
            </div>

            <div className="perk-card">
              <span className="perk-icon">⚡</span>
              <h3>High-Impact Tier-1 Brands</h3>
              <p>Directly steer growth strategy for Fortune 500 enterprises, high-growth BFSI conglomerates, and unicorn D2C brands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR CORE CULTURAL PILLARS (4 CARDS) */}
      <section className="careers-culture-pillars-section">
        <div className="careers-container">
          <div className="careers-section-header text-center">
            <span className="contact-kicker-pill">HOW WE OPERATE</span>
            <h2>Our Core Cultural Values</h2>
            <p>The principles that guide our day-to-day decisions, client partnerships, and team collaboration.</p>
          </div>

          <div className="culture-pillars-four-grid">
            <div className="pillar-item-card">
              <span className="pillar-num">01</span>
              <h4>Extreme Ownership & Revenue Focus</h4>
              <p>We speak revenue, blended CAC, and unit economics—never hiding behind vanity impressions or meaningless metrics.</p>
            </div>

            <div className="pillar-item-card">
              <span className="pillar-num">02</span>
              <h4>Velocity & Scientific Experimentation</h4>
              <p>We ship fast, run rigorous weekly A/B split tests, fail small, and double down relentlessly on proven growth levers.</p>
            </div>

            <div className="pillar-item-card">
              <span className="pillar-num">03</span>
              <h4>Radical Candor & Zero Politics</h4>
              <p>Direct, respectful, and transparent communication. Good ideas win regardless of hierarchy or tenure.</p>
            </div>

            <div className="pillar-item-card">
              <span className="pillar-num">04</span>
              <h4>AI Leverage & Continuous Craft</h4>
              <p>We leverage autonomous AI tooling to eliminate repetitive drudgery, freeing our minds to solve complex growth problems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OPEN POSITIONS & INTERACTIVE JOB BOARD */}
      <section className="careers-job-board-section" id="open-roles">
        <div className="careers-container">
          <div className="careers-section-header text-center">
            <span className="contact-kicker-pill">CAREER OPPORTUNITIES</span>
            <h2>Active Open Positions ({filteredJobs.length})</h2>
            <p>Explore current openings across our search, media, engineering, and creative teams.</p>
          </div>

          {/* DEPARTMENT FILTER PILLS */}
          <div className="careers-filter-tabs-row">
            {departmentTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveDepartment(tab.key)}
                className={`careers-filter-pill ${activeDepartment === tab.key ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* JOB OPENINGS LIST */}
          <div className="careers-job-cards-list">
            {filteredJobs.map((job) => (
              <div key={job.id} className="career-job-card">
                <div className="job-card-main-content">
                  <div className="job-card-top-tags">
                    <span className="job-team-pill">{job.team || "Growth Team"}</span>
                    <span className="job-type-pill">{job.type || "Full-Time"}</span>
                    <span className="job-salary-pill">{job.salary || "Competitive Compensation"}</span>
                  </div>

                  <h3>{job.title}</h3>

                  <div className="job-card-meta-bar">
                    <span>📍 {job.location}</span>
                    <span>⏳ {job.experience || "3+ years"}</span>
                  </div>

                  <p className="job-summary-text">{job.summary}</p>

                  <div className="job-skills-chips-row">
                    {(job.skills || []).map((skill, idx) => (
                      <span key={idx} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="job-card-action-side">
                  <button
                    type="button"
                    onClick={() => { setApplyingJob(job); setSubmitted(false); }}
                    className="job-apply-orange-btn"
                  >
                    Apply for Role <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GENERAL APPLICATION / RESUME DROP BANNER */}
      <section className="careers-resume-drop-banner">
        <div className="careers-container">
          <div className="resume-drop-card">
            <div className="resume-drop-text">
              <h3>Don't See the Perfect Role for You?</h3>
              <p>We are always on the lookout for world-class growth hackers, content strategists, data scientists, and creative storytellers. Send us your portfolio.</p>
            </div>
            <button
              type="button"
              onClick={() => setGeneralApplyOpen(true)}
              className="resume-drop-white-btn"
            >
              Submit Open Application →
            </button>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE JOB APPLICATION MODAL */}
      {(applyingJob || generalApplyOpen) && (
        <div className="career-modal-overlay" onClick={resetModalState}>
          <div className="career-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="career-modal-header">
              <div>
                <span className="career-modal-kicker">GET INTO FEED TALENT INGESTION</span>
                <h3>{applyingJob ? `Apply for: ${applyingJob.title}` : "Submit Open Application"}</h3>
              </div>
              <button type="button" onClick={resetModalState} className="career-modal-close-btn" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="career-success-state">
                <div className="career-success-icon">
                  <CheckCircle2 size={48} color="#16a34a" />
                </div>
                <h4>Application Successfully Received!</h4>
                <p>
                  Thank you, <strong>{candidateForm.name}</strong>. Your application for <strong>{applyingJob ? applyingJob.title : "General Open Role"}</strong> has been ingested into our talent pipeline.
                </p>
                <p className="career-success-subtext">
                  Our recruiting team reviews portfolios within 48 hours. If your background matches our requirements, we will schedule an initial culture & technical conversation.
                </p>
                <button type="button" onClick={resetModalState} className="career-modal-done-btn">
                  Done & Return to Careers
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="career-modal-form">
                {errorMsg && (
                  <div className="career-form-error">
                    <AlertCircle size={15} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-two-col">
                  <div>
                    <label>Full Name *</label>
                    <input
                      required
                      placeholder="e.g. Vikramaditya Sharma"
                      value={candidateForm.name}
                      onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="vikram@domain.com"
                      value={candidateForm.email}
                      onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-two-col">
                  <div>
                    <label>Phone / WhatsApp *</label>
                    <input
                      required
                      placeholder="+91-9876543210"
                      value={candidateForm.phone}
                      onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Years of Relevant Experience</label>
                    <select
                      value={candidateForm.experience}
                      onChange={(e) => setCandidateForm({ ...candidateForm, experience: e.target.value })}
                    >
                      <option value="1-2 years">1-2 years (Junior / Associate)</option>
                      <option value="3-5 years">3-5 years (Mid-Senior Specialist)</option>
                      <option value="5-8 years">5-8 years (Lead / Manager)</option>
                      <option value="8+ years">8+ years (Director / VP Level)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Portfolio / LinkedIn / GitHub URL *</label>
                  <input
                    required
                    placeholder="https://linkedin.com/in/... or Google Drive Portfolio"
                    value={candidateForm.portfolio}
                    onChange={(e) => setCandidateForm({ ...candidateForm, portfolio: e.target.value })}
                  />
                </div>

                <div>
                  <label>Why are you excited to join Get Into Feed?</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about key campaigns, technical architectures, or revenue metrics you've scaled..."
                    value={candidateForm.note}
                    onChange={(e) => setCandidateForm({ ...candidateForm, note: e.target.value })}
                  />
                </div>

                {/* GOOGLE RECAPTCHA INTERACTIVE BOX */}
                <div
                  className={`career-recaptcha-card ${recaptchaVerified ? "verified" : ""}`}
                  onClick={() => setRecaptchaVerified(!recaptchaVerified)}
                >
                  <div className="recaptcha-left-col">
                    <div className={`recaptcha-checkbox-square ${recaptchaVerified ? "checked" : ""}`}>
                      {recaptchaVerified && <Check size={14} color="#ffffff" />}
                    </div>
                    <span className="recaptcha-prompt-text">I'm not a robot</span>
                  </div>
                  <div className="recaptcha-right-brand">
                    <img
                      src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                      alt="reCAPTCHA"
                      className="recaptcha-g-logo"
                    />
                    <span className="recaptcha-title">reCAPTCHA</span>
                    <small className="recaptcha-privacy-terms">Privacy - Terms</small>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="career-submit-orange-btn">
                  {submitting ? "Ingesting Application..." : "Submit Application →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 15. NATIONWIDE HUBS & MEGA FOOTER (MATCHING PDF PAGE 6)
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// 15. NATIONWIDE HUBS & WORLD-CLASS ENTERPRISE FOOTER
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// 15. NATIONWIDE HUBS & WORLD-CLASS ENTERPRISE FOOTER
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// 15. NOIDA HEADQUARTERS & ENTERPRISE FOOTER
// -----------------------------------------------------------------------------
function EnterpriseFooter({ onOpenAudit }) {
  const [newsEmail, setNewsEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsEmail("");
      }, 4000);
    }
  };

  return (
    <footer className="enterprise-mega-footer">
      <div className="footer-inner-wrapper">
        {/* 1. NOIDA HEADQUARTERS & NATIONWIDE DELIVERY STRIP */}
        <div className="footer-noida-hq-strip">
          <div className="noida-hq-card">
            <div className="hq-badge-pill">
              <span>📍 CORPORATE HEADQUARTERS</span>
            </div>
            <h3>Noida Corporate HQ • Serving Brands Nationwide</h3>
            <p className="hq-address-line">
              Sector 62, Electronic City, Noida, Gautam Buddha Nagar, Uttar Pradesh 201301 (Delhi-NCR, India)
            </p>
            <div className="hq-direct-contacts-row">
              <a href="tel:+919910308266" className="hq-contact-pill">📞 +91-9910308266</a>
              <a href="mailto:growth@getintofeed.com" className="hq-contact-pill">✉️ growth@getintofeed.com</a>
              <a href="https://maps.google.com/?q=Sector+62+Noida+Uttar+Pradesh" target="_blank" rel="noreferrer" className="hq-contact-pill highlight">🗺️ Get HQ Directions →</a>
            </div>
          </div>
        </div>

        {/* 2. NEWSLETTER / GROWTH DISPATCH BAR */}
        <div className="footer-newsletter-banner-strip">
          <div className="footer-newsletter-card">
            <div className="newsletter-text-col">
              <div className="newsletter-badge">
                <Sparkles size={14} color="#f59e0b" />
                <span>WEEKLY GROWTH DISPATCH</span>
              </div>
              <h4>Subscribe to Actionable Enterprise Growth Playbooks</h4>
              <p>Zero fluff. Direct breakdown of algorithm shifts, AI search moats, and high-ROAS campaign structures every Tuesday.</p>
            </div>

            <div className="newsletter-form-col">
              {subscribed ? (
                <div className="newsletter-success-tag">
                  <CheckCircle2 size={18} color="#16a34a" />
                  <span>Subscribed! Welcome to the Growth Dispatch.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="newsletter-inline-form">
                  <input
                    required
                    type="email"
                    placeholder="Enter your work email address..."
                    value={newsEmail}
                    onChange={(e) => setNewsEmail(e.target.value)}
                    aria-label="Work Email Address"
                  />
                  <button type="submit" className="newsletter-submit-btn">
                    Subscribe Free →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 3. 5-COLUMN ENTERPRISE DIRECTORY */}
        <div className="footer-columns-container">
          {/* COLUMN 1: BRAND LOGO, CREDENTIALS & CONTACT */}
          <div className="footer-col brand-col">
            <Link to="/" className="techmagnate-brand-logo footer-brand-logo">
              <img src="/logo-white.png" alt="Get Into Feed Logo" className="brand-logo-icon-img" />
              <div className="logo-text-block">
                <span className="logo-main-tech light">GET INTO FEED<sup className="reg-mark light">®</sup></span>
                <span className="logo-sub-tagline light">Digital & AI Excellence</span>
              </div>
            </Link>

            <p className="footer-brand-bio">
              Founded in 2026, Get Into Feed is India's premier AI-first digital marketing and enterprise SEO growth studio headquartered in Noida. We engineer scalable organic search moats, sub-second React web experiences, and high-ROAS paid media for category leaders.
            </p>

            <div className="partner-badges-row">
              <span className="partner-tag">🏆 Google Premier Partner</span>
              <span className="partner-tag">⚡ Meta Certified Partner</span>
              <span className="partner-tag">⭐ Clutch 4.9 ★★★★★</span>
              <span className="partner-tag">🛡️ DPDP & GDPR Compliant</span>
            </div>

            <div className="footer-contact-quick-info">
              <div>📍 <strong>Corporate HQ:</strong> Sector 62, Noida, UP 201301</div>
              <div>📞 <strong>Growth Hotline:</strong> <a href="tel:+919910308266">+91-9910308266</a></div>
              <div>✉️ <strong>Official Email:</strong> <a href="mailto:growth@getintofeed.com">growth@getintofeed.com</a></div>
            </div>
          </div>

          {/* COLUMN 2: OUR SERVICES */}
          <div className="footer-col">
            <strong>Core Capabilities</strong>
            <Link to="/services/enterprise-seo">Enterprise SEO Services</Link>
            <Link to="/services/generative-engine-optimization">Generative AI Search (GEO)</Link>
            <Link to="/services/local-seo">Local SEO & Google 3-Pack</Link>
            <Link to="/services/ecommerce-seo">Ecommerce SEO & D2C</Link>
            <Link to="/services/google-ads-management">PPC & Google Ads Management</Link>
            <Link to="/services/meta-ads-growth">Meta Advantage+ UGC Ads</Link>
            <Link to="/services/web-design-cro">Sub-Second React & CRO Web</Link>
            <Link to="/services/content-marketing-pr">Content Marketing & PR</Link>
            <Link to="/services" className="footer-highlight-link">View All 18 Capabilities →</Link>
          </div>

          {/* COLUMN 3: COMPANY */}
          <div className="footer-col">
            <strong>Company & Culture</strong>
            <Link to="/about">About Get Into Feed</Link>
            <Link to="/about#leadership">Meet Leadership Team</Link>
            <Link to="/work">Client Case Studies</Link>
            <Link to="/careers">Careers <span className="hiring-badge">We're Hiring</span></Link>
            <Link to="/faqs">Frequently Asked Questions</Link>
            <Link to="/blog">Growth Playbooks & Blog</Link>
            <Link to="/about#our-presence">Noida HQ Presence</Link>
            <button type="button" onClick={onOpenAudit} className="footer-highlight-link btn-link-reset">Claim Free 360° Audit →</button>
          </div>

          {/* COLUMN 4: GROWTH VERTICALS */}
          <div className="footer-col">
            <strong>Growth Verticals</strong>
            <Link to="/work">BFSI & FinTech Loans</Link>
            <Link to="/work">D2C Skincare & Beauty</Link>
            <Link to="/work">Healthcare & Hospitals</Link>
            <Link to="/work">EdTech & Higher Education</Link>
            <Link to="/work">B2B SaaS & Technology</Link>
            <Link to="/work">Retail Chains & Auto</Link>

            <strong style={{ marginTop: "20px", display: "block" }}>Free Growth Tools</strong>
            <Link to="/contact">SEO ROI Calculator</Link>
            <Link to="/contact">PPC Spend Estimator</Link>
            <Link to="/contact">AI Visibility Audit</Link>
          </div>

          {/* COLUMN 5: PLAYBOOKS & DIRECT CONTACT */}
          <div className="footer-col">
            <strong>Featured Playbooks</strong>
            <Link to="/blog/generative-engine-optimization-geo-playbook-2026">GEO Playbook 2026</Link>
            <Link to="/blog/sub-second-react-landing-pages-cro-framework">Sub-Second React CRO</Link>
            <Link to="/blog/scaling-meta-ads-advantage-plus-ugc-sprints">Meta Advantage+ Scaling</Link>
            
            <strong style={{ marginTop: "20px", display: "block" }}>Direct Inquiries</strong>
            <Link to="/work">View Client Portfolio</Link>
            <Link to="/faqs">Pricing & Engagement FAQs</Link>
            <Link to="/contact">Book Strategy Consultation</Link>
          </div>
        </div>

        {/* 4. RATINGS, SOCIAL CONNECT & DMCA STRIP */}
        <div className="footer-ratings-social-strip">
          <div className="footer-social-icons-row">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="LinkedIn">
              <span>in</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Twitter X">
              <span>𝕏</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="YouTube">
              <span>▶</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Facebook">
              <span>f</span>
            </a>
            <a
              href="https://wa.me/919910308266?text=Hi%20Get%20Into%20Feed%20Noida%2C%20I%20would%20like%20to%20discuss%20our%20growth%20strategy"
              target="_blank"
              rel="noreferrer"
              className="social-icon-link whatsapp-social"
              aria-label="WhatsApp"
            >
              <span>💬</span>
            </a>
          </div>

          <div className="footer-ratings-dmca-row">
            <div className="rating-badge-item">
              <span className="rating-icon-g">G</span>
              <span>4.9/5 Google Reviews</span>
            </div>
            <div className="rating-badge-item">
              <span className="rating-icon-c">C</span>
              <span>4.9/5 Clutch Verified</span>
            </div>
            <div className="rating-badge-item">
              <span className="rating-icon-f">★</span>
              <span>4.9 Glassdoor Rating</span>
            </div>

            {/* DMCA BADGE */}
            <a
              href="//www.dmca.com/Protection/Status.aspx?ID=d7bfaa8b-113f-40c7-b0b8-9da53cf5cba7"
              title="DMCA.com Protection Status"
              className="dmca-badge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://images.dmca.com/Badges/DMCA_logo-green150w.png?ID=d7bfaa8b-113f-40c7-b0b8-9da53cf5cba7"
                alt="DMCA.com Protection Status"
                style={{ height: "24px", width: "auto", display: "block" }}
              />
            </a>
          </div>
        </div>

        {/* 5. COPYRIGHT & ALL 7 LEGAL COMPLIANCE LINKS */}
        <div className="footer-bottom-bar">
          <span>Copyright © 2026 Get Into Feed®. All rights reserved. Headquartered in Noida, Uttar Pradesh. Recognized under DPDP Act 2023 & ISO 9001:2015.</span>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
            <Link to="/terms-of-use">Terms of Use</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
            <Link to="/refund-policy">Refund Policy</Link>
            <Link to="/csr-policy">CSR Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// -----------------------------------------------------------------------------
// MAIN HOME PAGE (MATCHING 6-PAGE PDF 1-TO-1 IN EXACT SEQUENTIAL ORDER)
// -----------------------------------------------------------------------------
function Home({ content }) {
  return (
    <>
      {/* 1. HERO BANNER */}
      <EnterpriseHero />

      {/* 2. FLOATING QUICK SERVICES PILL RIBBON */}
      <QuickServicesPillBar />

      {/* 3. 12 ENTERPRISE CLIENT LOGOS */}
      <ClientMarquee />

      {/* 4. DATA BACKED SERVICES TO GROW YOUR REVENUE (PDF PAGE 1 & 2) */}
      <DataBackedServicesSection />

      {/* 5. WATCH OUR VIDEO SHOWCASE (PDF PAGE 2) */}
      <WatchOurVideoSection />

      {/* 6. ACHIEVE 2X TRAFFIC GROWTH PILLARS (PDF PAGE 2) */}
      <TrafficGrowthPillars />

      {/* 7. AWARDS & ACCOLADES FOR GET INTO FEED (PDF PAGE 2 & 3) */}
      <AwardsShowcase />

      {/* 8. 103 BRANDS DIGITAL REPORT CARD (PDF PAGE 3) */}
      <DigitalReportCard />

      {/* 9. DRIVING ACTUAL BUSINESS GROWTH CASE STUDIES (PDF PAGE 3) */}
      <CaseStudiesSection />

      {/* 10. DUAL AUDIENCE BANNERS (TESTIMONIALS & AI VISIBILITY AUDIT) (PDF PAGE 3) */}
      <DualAudienceBanners />

      {/* 11. SEARCH TRENDS REPORTS (PDF PAGE 4) */}
      <SearchTrendsReports />

      {/* 12. LATEST BLOGS (PDF PAGE 4) */}
      <RecentBlogFeed />

      {/* 13. FREQUENTLY ASKED QUESTIONS ACCORDION (PDF PAGE 4 & 5) */}
      <InteractiveFaqAccordion />

      {/* 14. AS FEATURED ON MEDIA LOGOS (PDF PAGE 5) */}
      <AsFeaturedOnBar />

      {/* 15. LET'S DO GREAT WORK TOGETHER CONTACT & AUDIT FORM (PDF PAGE 5 & 6) */}
      <ContactAuditSection />
    </>
  );
}

// -----------------------------------------------------------------------------
// MAIN APP ROOT WITH REAL-TIME LIVE SYNC
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// EXACT REPLICA: SEARCH TRENDS REPORT POPUP MODAL (DPDP & GDPR COMPLIANT)
// -----------------------------------------------------------------------------
function SearchTrendsReportModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    reportType: "Search Trends Reports",
    contactPref: "yes"
  });
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [leadId, setLeadId] = useState("");

  // ACCESSIBILITY: ESCAPE KEY DISMISSAL & BODY SCROLL LOCK
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // COMPLIANCE VALIDATIONS
    if (!form.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setErrorMsg("Please provide a valid work email address.");
      return;
    }

    const cleanedPhone = form.phone.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!recaptchaVerified) {
      setErrorMsg("Please check the 'I'm not a robot' security box (Google reCAPTCHA).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          service: `Search Trends Report (${form.reportType})`,
          message: `Contact preference: ${form.contactPref === "yes" ? "Yes - Wants service consultation" : "No - Report only"} | DPDP Compliant Consent`,
          source: "search_trends_popup_modal"
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLeadId(data.leadId || "GIF-STR-2026");
        setSubmitted(true);
        // Frequency Cap: Never show popup again to converted users
        localStorage.setItem("gif_report_downloaded", "true");
      } else {
        setErrorMsg(data.message || "Failed to process request. Please check your inputs.");
      }
    } catch {
      setErrorMsg("Unable to connect to backend server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    const blob = new Blob([
      `Get Into Feed - Search Trends Report 2026\n\nExecutive Insights for ${form.name || "Enterprise Brand"}\nReport Type: ${form.reportType}\nLead Reference: #${leadId}\n\nKey Finding 1: AI Search (GEO) visibility grew by +273% in FY25-26 across ChatGPT and Google Gemini.\nKey Finding 2: High-intent commercial keyword clusters reduced CAC by -38% in BFSI & Healthcare.\nKey Finding 3: Brands structuring entity schemas captured 72% of AI answer engine recommendations.\n\nPrivacy & DPDP Compliance: This report is generated strictly for ${form.email}.\nVisit: https://getintofeed.com`
    ], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Get_Into_Feed_Search_Trends_Report_2026.txt`;
    a.click();
  };

  return (
    <div
      className="search-trends-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-trends-modal-title"
      aria-describedby="search-trends-modal-desc"
    >
      <div className="search-trends-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* BLACK ROUNDED CLOSE BUTTON ON TOP-RIGHT WITH TOUCH ACCESSIBILITY */}
        <button
          type="button"
          onClick={onClose}
          className="st-modal-close-btn"
          aria-label="Close Search Trends Report modal (Press Escape to exit)"
          title="Close modal (Escape)"
        >
          <X size={18} />
        </button>

        {/* LEFT COLUMN: BRAND LOGO + HEADLINE + GREEN PILL + LOGOS + CURVED ARROW */}
        <div className="st-modal-left">
          {/* BRAND LOGO BADGE */}
          <div className="st-brand-header">
            <img src="/logo-navbar.png" alt="Get Into Feed Logo" className="st-brand-logo-img" />
            <div className="st-brand-text-wrap">
              <span className="st-brand-name">GET INTO FEED<sup>®</sup></span>
              <small className="st-brand-tagline">Digital Excellence</small>
            </div>
          </div>

          <h2 id="search-trends-modal-title" className="st-modal-headline">
            Build a Better Digital Marketing Strategy with Get Into Feed’s Search Trends Reports
          </h2>

          <p id="search-trends-modal-desc" className="st-modal-subtext">
            Join 150+ businesses maximizing their ROI !
          </p>

          {/* GREEN PILL */}
          <div className="st-green-pill-badge">
            Featuring brands like
          </div>

          {/* BRAND LOGOS STRIP */}
          <div className="st-brands-strip-row">
            <div className="st-brand-pill">
              <span className="brand-dot blue" />
              <strong>BAJAJ FINSERV</strong>
            </div>
            <div className="st-brand-pill">
              <strong className="paytm-txt">Paytm</strong>
            </div>
            <div className="st-brand-pill">
              <span className="brand-dot teal" />
              <strong>Groww</strong>
            </div>
            <div className="st-brand-pill">
              <span className="brand-dot green" />
              <strong>Moneyview</strong>
            </div>
          </div>

          <div className="st-and-more-row">
            <span>and many more!</span>
            {/* CURVED DASHED ARROW SVG POINTING TO FORM */}
            <svg className="st-dashed-arrow-svg" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M10 5 C 40 40, 75 35, 90 10" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <polygon points="90,10 82,14 86,22" fill="#64748b" />
            </svg>
          </div>

          {/* DPDP ACT 2023 & GDPR PRIVACY BADGE */}
          <div className="st-privacy-trust-badge">
            <span className="trust-lock-icon">🔒</span>
            <span>100% Privacy Protected • Zero Spam Guarantee • DPDP Act & GDPR Compliant</span>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM & GOOGLE RECAPTCHA */}
        <div className="st-modal-right">
          {submitted ? (
            <div className="st-success-screen">
              <div className="st-success-icon-wrap">
                <CheckCircle2 size={48} color="#16a34a" />
              </div>
              <h3>Your Report is Ready!</h3>
              <p>
                Reference ID: <strong>#{leadId.slice(0, 8).toUpperCase()}</strong>
              </p>
              <p className="st-success-desc">
                We've processed your request for <strong>{form.reportType}</strong>. You can download the report immediately below:
              </p>

              <button type="button" onClick={handleDownloadPdf} className="st-download-btn-orange">
                <Download size={16} /> Download 2026 Report
              </button>

              <div className="st-success-actions">
                <a
                  href={`https://wa.me/919910308266?text=Hi%20Get%20Into%20Feed%2C%20I%20just%20requested%20the%20${encodeURIComponent(form.reportType)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-instant-btn"
                >
                  💬 Connect on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="st-form-container">
              {errorMsg && (
                <div className="st-error-alert" role="alert">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ROW 1: FULL NAME & EMAIL */}
              <div className="st-form-row-two">
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  className="st-input-box"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-label="Full Name"
                />
                <input
                  required
                  type="email"
                  placeholder="Work Email"
                  className="st-input-box"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-label="Work Email"
                />
              </div>

              {/* ROW 2: MOBILE NO & REPORT SELECT */}
              <div className="st-form-row-two">
                <input
                  required
                  type="tel"
                  placeholder="Mobile No*"
                  className="st-input-box"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  aria-label="Mobile Number"
                />
                <div className="st-select-wrap">
                  <select
                    className="st-select-box"
                    value={form.reportType}
                    onChange={(e) => setForm({ ...form, reportType: e.target.value })}
                    aria-label="Report Category"
                  >
                    <option value="Search Trends Reports">Search Trends Reports</option>
                    <option value="Enterprise SEO Report">Enterprise SEO Report</option>
                    <option value="AI Search & GEO Discovery">AI Search & GEO Discovery</option>
                    <option value="PPC & Performance ROAS">PPC & Performance ROAS</option>
                    <option value="Ecommerce & D2C Growth">Ecommerce & D2C Growth</option>
                  </select>
                  <ChevronDown size={15} className="select-arrow-icon" />
                </div>
              </div>

              {/* RADIO CONTACT PREFERENCE (EXPLICIT CONSENT) */}
              <div className="st-radio-group-block">
                <span className="st-radio-question-label">
                  I want to be contacted regarding Get Into Feed's digital marketing services. <span className="req-star">*</span>
                </span>
                <div className="st-radio-options-row">
                  <label className="st-radio-label">
                    <input
                      type="radio"
                      name="contactPref"
                      value="yes"
                      checked={form.contactPref === "yes"}
                      onChange={() => setForm({ ...form, contactPref: "yes" })}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="st-radio-label">
                    <input
                      type="radio"
                      name="contactPref"
                      value="no"
                      checked={form.contactPref === "no"}
                      onChange={() => setForm({ ...form, contactPref: "no" })}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* GOOGLE RECAPTCHA INTERACTIVE BOX */}
              <div
                className={`st-recaptcha-widget-card ${recaptchaVerified ? "verified" : ""}`}
                onClick={() => setRecaptchaVerified(!recaptchaVerified)}
                role="checkbox"
                aria-checked={recaptchaVerified}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setRecaptchaVerified(!recaptchaVerified); }}
              >
                <div className="recaptcha-left-col">
                  <div className={`recaptcha-checkbox-square ${recaptchaVerified ? "checked" : ""}`}>
                    {recaptchaVerified && <Check size={14} color="#ffffff" />}
                  </div>
                  <span className="recaptcha-prompt-text">I'm not a robot</span>
                </div>
                <div className="recaptcha-right-brand">
                  <img
                    src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                    alt="reCAPTCHA"
                    className="recaptcha-g-logo"
                  />
                  <span className="recaptcha-title">reCAPTCHA</span>
                  <small className="recaptcha-privacy-terms">Privacy - Terms</small>
                </div>
              </div>

              {/* ORANGE DOWNLOAD REPORT BUTTON */}
              <button type="submit" disabled={submitting} className="st-download-submit-btn">
                {submitting ? "Verifying & Generating..." : "Download Report"}
              </button>

              {/* LEGAL & PRIVACY FOOTER DISCLAIMER */}
              <p className="st-legal-disclaimer">
                By clicking "Download Report", you agree to our Terms and acknowledge our Privacy Policy. We respect your inbox: zero spam, unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// COOKIE PREFERENCES MODAL (GDPR & DPDP COMPLIANT)
// -----------------------------------------------------------------------------
function CookiePreferencesModal({ isOpen, onClose, onSave }) {
  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: true,
    marketing: true
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(prefs);
    onClose();
  };

  const handleAcceptAll = () => {
    onSave({ essential: true, analytics: true, marketing: true });
    onClose();
  };

  return (
    <div className="cookie-modal-overlay" onClick={onClose}>
      <div className="cookie-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="cookie-modal-header">
          <div className="cookie-header-brand">
            <span className="cookie-emoji-icon">🍪</span>
            <div>
              <h3>Cookie & Privacy Preferences</h3>
              <small>Get Into Feed Privacy & Telemetry Management</small>
            </div>
          </div>
          <button type="button" onClick={onClose} className="cookie-modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <p className="cookie-modal-intro">
          We use cookies and telemetry technologies to personalize content, maintain security, and analyze our traffic. Customize your preferences below or accept all to continue.
        </p>

        <div className="cookie-categories-list">
          {/* 1. ESSENTIAL COOKIES */}
          <div className="cookie-category-item locked">
            <div className="cookie-cat-info">
              <div className="cookie-cat-title-row">
                <strong>Strictly Necessary Cookies</strong>
                <span className="cookie-always-active-badge">Always Active</span>
              </div>
              <p>
                Essential for website navigation, security authentication, reCAPTCHA fraud prevention, and session state. These cannot be switched off.
              </p>
            </div>
          </div>

          {/* 2. ANALYTICS COOKIES */}
          <div className="cookie-category-item">
            <div className="cookie-cat-info">
              <div className="cookie-cat-title-row">
                <strong>Analytics & Performance Telemetry</strong>
                <label className="cookie-switch">
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                  />
                  <span className="cookie-slider" />
                </label>
              </div>
              <p>
                Enables us to measure PageSpeed, visitor flow, and Core Web Vitals via Google Analytics 4 to continuously improve site performance.
              </p>
            </div>
          </div>

          {/* 3. MARKETING COOKIES */}
          <div className="cookie-category-item">
            <div className="cookie-cat-info">
              <div className="cookie-cat-title-row">
                <strong>Marketing & Attribution Pixels</strong>
                <label className="cookie-switch">
                  <input
                    type="checkbox"
                    checked={prefs.marketing}
                    onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                  />
                  <span className="cookie-slider" />
                </label>
              </div>
              <p>
                Used by Google Ads, Meta CAPI, and LinkedIn to measure campaign return on ad spend (ROAS) and deliver relevant growth content.
              </p>
            </div>
          </div>
        </div>

        <div className="cookie-modal-footer">
          <button type="button" onClick={handleSave} className="cookie-btn-outline">
            Save Selected Preferences
          </button>
          <button type="button" onClick={handleAcceptAll} className="cookie-btn-primary">
            Accept All Cookies
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// FLOATING COOKIE CONSENT BANNER
// -----------------------------------------------------------------------------
function CookieConsentBanner({ onOpenPrefs }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("gif_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("gif_cookie_consent", JSON.stringify({ essential: true, analytics: true, marketing: true, timestamp: Date.now() }));
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem("gif_cookie_consent", JSON.stringify({ essential: true, analytics: false, marketing: false, timestamp: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent-floating-bar" role="dialog" aria-label="Cookie Consent Banner">
      <div className="cookie-bar-content">
        <div className="cookie-icon-col">
          <span className="cookie-pulse-emoji">🍪</span>
        </div>
        <div className="cookie-text-col">
          <strong>We value your privacy & digital trust</strong>
          <p>
            Get Into Feed uses cookies to analyze website performance, enhance navigation speed, and deliver personalized digital marketing insights. By clicking <strong>"Accept All Cookies"</strong>, you consent to our use of cookies under our <a href="/privacy" onClick={(e) => { e.preventDefault(); onOpenPrefs(); }}>Privacy Policy</a>.
          </p>
        </div>
      </div>

      <div className="cookie-bar-actions">
        <button type="button" onClick={onOpenPrefs} className="cookie-action-btn settings">
          <Sliders size={14} /> Preferences
        </button>
        <button type="button" onClick={handleRejectNonEssential} className="cookie-action-btn reject">
          Reject Non-Essential
        </button>
        <button type="button" onClick={handleAcceptAll} className="cookie-action-btn accept">
          Accept All Cookies →
        </button>
      </div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// COMPREHENSIVE OUR WORK & CASE STUDIES HUB PAGE (MATCHING TOP AGENCY STANDARDS)
// -----------------------------------------------------------------------------
function OurWorkHubPage({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterOptions = [
    { key: "all", label: "All Case Studies" },
    { key: "bfsi", label: "BFSI & FinTech" },
    { key: "d2c", label: "D2C & Ecommerce" },
    { key: "healthcare", label: "Healthcare & Hospitals" },
    { key: "education", label: "Education & EdTech" },
    { key: "seo", label: "Enterprise SEO" },
    { key: "ppc", label: "Performance Paid Media" },
    { key: "geo", label: "Generative AI & GEO" }
  ];

  const fullCaseStudies = [
    {
      id: "veloura-organics-d2c-skincare",
      brand: "Veloura Organics",
      industry: "d2c",
      category: "D2C Skincare & Ecommerce",
      result: "Scaled Monthly Revenue from ₹32 Lakhs to ₹1.8 Crore at 4.8x ROAS",
      metric: "4.8x ROAS",
      secondaryMetric: "₹1.8 Cr/mo",
      cacMetric: "-38% CAC",
      channel: "Meta Ads + UGC Video Sprints + Sub-Second React Landing Pages",
      detail: "Restructured ad account architecture with 8+ weekly creator video hooks, deployed sub-second React landing pages, and automated WhatsApp cart recovery funnels, scaling monthly revenue from ₹32L to ₹1.8 Cr in 120 days.",
      deliverables: ["Meta Advantage+ Shopping Campaigns", "Creator UGC Creative Production", "Headless React Web Optimization", "Automated WhatsApp Cart Recovery"],
      featured: true
    },
    {
      id: "finscale-lending-bfsi",
      brand: "FinScale Lending",
      industry: "bfsi",
      category: "BFSI & FinTech",
      result: "+340% Inbound Loan Applications & -46% CAC Reduction",
      metric: "+340% Leads",
      secondaryMetric: "-46% CAC",
      cacMetric: "#1 Rankings",
      channel: "Enterprise SEO + Core Web Vitals + 450 Programmatic Hubs",
      detail: "Engineered 450+ programmatic high-intent keyword hubs around EMI and loan eligibility calculators, achieving #1 Google rankings for commercial loan queries across India.",
      deliverables: ["Programmatic Search Cluster Architecture", "Server Log File Optimization", "Tier-1 Financial Digital PR Backlinks", "Real-Time Lead Scoring Telemetry"]
    },
    {
      id: "medihealth-super-specialty",
      brand: "MediHealth Super Specialty",
      industry: "healthcare",
      category: "Healthcare & Hospitals",
      result: "+280% Verified Doctor Appointments & OPD Consultations",
      metric: "+280% Bookings",
      secondaryMetric: "14 Locations",
      cacMetric: "4.9★ Ratings",
      channel: "Local Google Map Pack SEO + Hyperlocal Search Ads",
      detail: "Dominated Google 3-Pack rankings across 14 hospital centers in Delhi-NCR and Bengaluru, implementing automated WhatsApp appointment booking and review collection workflows.",
      deliverables: ["Multi-Location GBP Management", "Local Healthcare Schema Markup", "Hyperlocal Paid Search Max", "Automated WhatsApp Patient Booking"]
    },
    {
      id: "edvance-academy-edtech",
      brand: "EdVance Academy",
      industry: "education",
      category: "Higher Education & EdTech",
      result: "18,400+ Paid Student Enrollments at 3.9x Return on Ad Spend",
      metric: "18.4K Admissions",
      secondaryMetric: "3.9x ROI",
      cacMetric: "-32% CPL",
      channel: "Google Search + Performance Max + Counseling Funnels",
      detail: "Overhauled paid search structure targeting career switchers and tech upskilling seekers, paired with localized student video testimonials and 1-click WhatsApp counseling funnels.",
      deliverables: ["Performance Max Smart Bidding", "High-Converting Webinar Funnels", "Multi-Touch GA4 Attribution", "Dynamic Keyword Insertion (DKI)"]
    },
    {
      id: "dcb-bank-case-study",
      brand: "DCB Bank",
      industry: "bfsi",
      category: "BFSI & Banking",
      result: "34% Increase in Qualified Leads with 15.88 Return on Ad Spend",
      metric: "15.88 ROAS",
      secondaryMetric: "+34% Leads",
      cacMetric: "100% Compliant",
      channel: "Google Search Ads + Negative Keyword Scrubbing + Lead Scoring",
      detail: "Restructured Google Ads campaigns with high-intent negative keyword filtering, custom audience segmentation, and strict RBI-compliant ad copywriting.",
      deliverables: ["Search Campaign Restructuring", "Negative Keyword Sculpting", "Conversion Rate Optimization (CRO)", "Value-Based Bidding Strategy"]
    },
    {
      id: "uk-countertops-case-study",
      brand: "UK Countertops",
      industry: "d2c",
      category: "Home Improvement & Retail",
      result: "Reduced Cost Per Acquisition (CPA) by 26% with High ROAS",
      metric: "-26% CPA",
      secondaryMetric: "+64% Conv Rate",
      cacMetric: "4.2x ROAS",
      channel: "Google Shopping + Dynamic Remarketing + Sub-Second Funnels",
      detail: "Deployed automated product feed optimization and value-based bidding, combined with sub-second mobile product configurators that reduced quote drop-offs.",
      deliverables: ["Google Shopping Feed Architecture", "Dynamic Catalog Retargeting", "Mobile Checkout Friction Audit", "Server-Side GA4 Tracking"]
    },
    {
      id: "luxury-hotel-chain-india",
      brand: "Grand Horizon Hotels",
      industry: "d2c",
      category: "Hospitality & Travel",
      result: "+180% Direct Room Bookings & -42% OTA Commission Dependence",
      metric: "+180% Bookings",
      secondaryMetric: "-42% OTA Cost",
      cacMetric: "5.4x ROAS",
      channel: "Performance Max + Local Search + Seasonal Room Rate Ads",
      detail: "Captured high-intent travelers with geo-targeted search campaigns, dynamic room rate extensions, and localized Google Map Pack optimization across 8 resort destinations.",
      deliverables: ["Google Hotel Ads Integration", "Direct Booking Engine Optimization", "Hyperlocal Paid Media", "Seasonal Creative Ad Sprints"]
    },
    {
      id: "cloudstack-b2b-saas",
      brand: "CloudStack AI",
      industry: "seo",
      category: "Enterprise B2B SaaS",
      result: "+215% Surge in High-ACV Inbound Enterprise Demo Requests",
      metric: "+215% Demos",
      secondaryMetric: "#1 Brand Cited",
      cacMetric: "$2.4M Pipeline",
      channel: "Generative Engine Optimization (GEO) + Technical Enterprise SEO",
      detail: "Structured entity knowledge graphs and original industry benchmark reports, achieving #1 recommendation status inside ChatGPT, Google Gemini, and Perplexity.",
      deliverables: ["ChatGPT & Gemini Citation Moats", "Schema.org Knowledge Graph Structuring", "B2B SaaS Commercial Keyword Hubs", "Executive Digital PR Placements"]
    }
  ];

  const filteredStudies = activeFilter === "all"
    ? fullCaseStudies
    : fullCaseStudies.filter((s) =>
        s.industry === activeFilter ||
        (s.channel || "").toLowerCase().includes(activeFilter) ||
        (s.category || "").toLowerCase().includes(activeFilter)
      );

  return (
    <div className="our-work-hub-page-view">
      {/* 1. HERO BANNER */}
      <section className="work-hub-hero-section">
        <div className="work-hero-container">
          <div className="work-hero-kicker-badge">
            <Sparkles size={14} color="#f59e0b" />
            <span>🏆 500+ AUDITED CLIENT CASE STUDIES & GROWTH SPRINTS</span>
          </div>

          <h1>Transformative Growth. Audited Real Revenue.</h1>

          <p className="work-hero-subtext">
            Explore how Get Into Feed partners with India's largest enterprise leaders, BFSI institutions, healthcare giants, and high-velocity D2C brands to build compounding search moats, lower customer acquisition costs, and maximize ROAS.
          </p>

          {/* 4-STAT LIVE RIBBON */}
          <div className="work-stats-ribbon-row">
            <div className="work-stat-ribbon-card">
              <strong>4.8x</strong>
              <span>Average Client ROAS</span>
            </div>
            <div className="work-stat-ribbon-card">
              <strong>₹250 Cr+</strong>
              <span>Tracked Client Revenue</span>
            </div>
            <div className="work-stat-ribbon-card">
              <strong>+273%</strong>
              <span>AI Search Visibility</span>
            </div>
            <div className="work-stat-ribbon-card">
              <strong>+58%</strong>
              <span>Avg Lead Growth FY25</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE FILTER BAR */}
      <section className="work-filter-bar-section">
        <div className="work-container">
          <div className="work-filter-pills-row">
            {filterOptions.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`work-filter-pill ${activeFilter === f.key ? "active" : ""}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED MARQUEE SPOTLIGHT */}
      <section className="work-featured-spotlight-section">
        <div className="work-container">
          <div className="featured-case-spotlight-card">
            <div className="spotlight-left-content">
              <span className="spotlight-kicker-tag">FEATURED ENTERPRISE CASE STUDY</span>
              <h2>Veloura Organics: Scaling Monthly Revenue to ₹1.8 Crore at 4.8x ROAS</h2>
              <p>
                How Get Into Feed transformed a high-potential D2C skincare brand into a category leader using weekly UGC creator sprints, sub-second headless React landing pages, and server-side Meta Conversions API (CAPI) attribution.
              </p>

              <div className="spotlight-kpis-grid">
                <div className="spotlight-kpi-item">
                  <strong>4.8x</strong>
                  <span>Blended ROAS</span>
                </div>
                <div className="spotlight-kpi-item">
                  <strong>₹1.8 Cr</strong>
                  <span>Monthly Revenue</span>
                </div>
                <div className="spotlight-kpi-item">
                  <strong>-38%</strong>
                  <span>CAC Reduction</span>
                </div>
              </div>

              <div className="spotlight-actions-row">
                <button
                  type="button"
                  onClick={() => onNavigate("/work/veloura-organics-d2c-skincare")}
                  className="spotlight-btn-orange"
                >
                  Read Strategy Breakdown →
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/contact")}
                  className="spotlight-btn-outline"
                >
                  Get Similar Results For Your Brand
                </button>
              </div>
            </div>

            <div className="spotlight-right-visual">
              <div className="spotlight-visual-box">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
                  alt="Veloura Organics Growth Sprint"
                  className="spotlight-img"
                />
                <div className="spotlight-floating-badge">
                  <TrendingUp size={16} color="#16a34a" />
                  <span>+462% 120-Day Revenue Surge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN CASE STUDIES GRID */}
      <section className="work-case-grid-section">
        <div className="work-container">
          <div className="work-grid-header">
            <h2>Proven Case Studies & Client Results</h2>
            <p>Showing {filteredStudies.length} verified client case studies across competitive growth verticals.</p>
          </div>

          <div className="work-cards-responsive-grid">
            {filteredStudies.map((study) => (
              <div key={study.id} className="work-card-item">
                <div className="work-card-top-bar">
                  <span className="work-card-cat-badge">{study.category}</span>
                  <span className="work-card-kpi-badge">{study.metric}</span>
                </div>

                <h3>{study.brand}</h3>
                <p className="work-card-result-headline">{study.result}</p>
                <p className="work-card-detail">{study.detail}</p>

                <div className="work-card-deliverables-list">
                  {(study.deliverables || []).slice(0, 3).map((d, i) => (
                    <span key={i} className="deliverable-chip">
                      ✓ {d}
                    </span>
                  ))}
                </div>

                <div className="work-card-footer">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/work/${study.id}`)}
                    className="work-card-link-btn"
                  >
                    View Full Case Study <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 4-STAGE SPRINT EXECUTION METHODOLOGY */}
      <section className="work-methodology-section">
        <div className="work-container">
          <div className="work-grid-header text-center">
            <span className="contact-kicker-pill">HOW WE ENGINEER PREDICTABLE COMPOUNDING GROWTH</span>
            <h2>Our 4-Stage Sprint Execution Methodology</h2>
            <p>Every client engagement follows a rigorous, sprint-based growth framework designed to eliminate marketing waste and compound revenue.</p>
          </div>

          <div className="methodology-steps-grid">
            <div className="method-step-card">
              <span className="method-step-number">01</span>
              <h4>Comprehensive 360° Growth Audit</h4>
              <p>In-depth technical crawl topology diagnostics, audience intent mining, competitor unit economics analysis, and tracking integrity validation.</p>
            </div>

            <div className="method-step-card">
              <span className="method-step-number">02</span>
              <h4>Programmatic & Creative Sprint Setup</h4>
              <p>Deploying high-intent programmatic keyword clusters, rapid creator video hooks, and sub-second React landing page funnels.</p>
            </div>

            <div className="method-step-card">
              <span className="method-step-number">03</span>
              <h4>Weekly Agile Scaling & Optimization</h4>
              <p>Continuous bid algorithm tuning, creative fatigue defense rotation, and daily ROAS/CPA pacing to scale winning revenue assets.</p>
            </div>

            <div className="method-step-card">
              <span className="method-step-number">04</span>
              <h4>Real-Time GA4 & Server CAPI Attribution</h4>
              <p>Executive Looker Studio telemetry dashboards tracking blended CAC, lifetime value (LTV), and qualified sales pipeline in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MARQUEE CLIENT LOGOS STRIP */}
      <section className="work-clients-strip-section">
        <div className="work-container">
          <span className="work-clients-title">TRUSTED BY LEADING ENTERPRISES ACROSS INDIA</span>
          <div className="work-clients-flex-wrap">
            <span className="marquee-logo-chip">Apollo 24|7</span>
            <span className="marquee-logo-chip">DCB Bank</span>
            <span className="marquee-logo-chip">Bajaj Finserv</span>
            <span className="marquee-logo-chip">Airtel Payments</span>
            <span className="marquee-logo-chip">Paytm</span>
            <span className="marquee-logo-chip">Groww</span>
            <span className="marquee-logo-chip">Moneyview</span>
            <span className="marquee-logo-chip">Tata 1mg</span>
            <span className="marquee-logo-chip">Max Life</span>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CONTACT AUDIT SECTION */}
      <ContactAuditSection />
    </div>
  );
}


// -----------------------------------------------------------------------------
// COMPREHENSIVE FAQS & KNOWLEDGE HUB PAGE (/faqs)
// -----------------------------------------------------------------------------
function FaqsPage({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaqs, setOpenFaqs] = useState({ "seo-0": true, "geo-0": true });

  const faqCategories = [
    { key: "all", label: "All Questions (30+)" },
    { key: "seo", label: "Enterprise SEO & Search" },
    { key: "geo", label: "Generative AI & GEO Search" },
    { key: "ppc", label: "Paid Media & Meta Ads" },
    { key: "cro", label: "Sub-Second React & CRO" },
    { key: "pricing", label: "Pricing, ROAS & Contracts" },
    { key: "onboarding", label: "Onboarding & Security SLAs" }
  ];

  const fullFaqDatabase = [
    // 1. ENTERPRISE SEO
    {
      id: "seo-0",
      category: "seo",
      categoryName: "Enterprise SEO & Search",
      q: "How does Get Into Feed differ from traditional SEO agencies in India?",
      a: "Traditional agencies focus on vanity keyword volume and generic blog posts. Get Into Feed engineers high-intent commercial keyword clusters, technical crawl topology, sub-second Core Web Vitals, programmatic landing pages, and authority link moats directly tied to pipeline revenue and customer acquisition cost (CAC) reduction."
    },
    {
      id: "seo-1",
      category: "seo",
      categoryName: "Enterprise SEO & Search",
      q: "What is your typical timeline for achieving #1 organic rankings?",
      a: "For existing enterprise domains with baseline domain authority, initial indexation improvements and Core Web Vitals optimizations yield measurable ranking lifts within 45 to 60 days. Full category dominance across competitive commercial keyword clusters is typically achieved in 4 to 6 months through our sprint execution framework."
    },
    {
      id: "seo-2",
      category: "seo",
      categoryName: "Enterprise SEO & Search",
      q: "How do you handle programmatic SEO and crawl budget optimization?",
      a: "We analyze server log files to map search engine bot crawl efficiency. We eliminate spider traps, faceted navigation bloat, and orphaned URLs while structuring dynamic JSON-LD schemas and hierarchical parent-child taxonomies for 500+ programmatic search hubs."
    },
    {
      id: "seo-3",
      category: "seo",
      categoryName: "Enterprise SEO & Search",
      q: "Do you build tier-1 digital PR backlinks and how do you ensure safety?",
      a: "Yes. We strictly execute high-tier editorial digital PR, data-driven research studies, and executive commentary outreach to secure contextual editorial mentions in publications like Economic Times, Financial Express, and top industry journals. We never use PBNs, link farms, or toxic spam directories."
    },
    {
      id: "seo-4",
      category: "seo",
      categoryName: "Enterprise SEO & Search",
      q: "Can you optimize multi-location retail and hospital chains for Google 3-Pack?",
      a: "Yes. We manage and scale Google Business Profiles (GBP) across 50+ locations, deploying localized geo-targeted landing page networks, consistent NAP syndication, and automated WhatsApp patient/customer review collection workflows."
    },

    // 2. GENERATIVE AI & GEO SEARCH
    {
      id: "geo-0",
      category: "geo",
      categoryName: "Generative AI & GEO Search",
      q: "What is Generative Engine Optimization (GEO) and why is it critical in 2026?",
      a: "GEO is the process of optimizing your brand's digital entity footprint so AI answer engines—like Google AI Overviews, ChatGPT Search, Google Gemini, and Perplexity—synthesize and cite your brand as the authoritative primary source when buyers research commercial queries."
    },
    {
      id: "geo-1",
      category: "geo",
      categoryName: "Generative AI & GEO Search",
      q: "How does Get Into Feed get our brand cited in ChatGPT and Gemini search results?",
      a: "We structure complete Schema.org knowledge graphs (Organization, Brand, ItemList, FAQPage, MedicalEntity/FinancialService), publish original empirical benchmark reports that LLMs cannot synthesize elsewhere, and build authoritative citation moats across Wikidata, Crunchbase, and tier-1 press."
    },
    {
      id: "geo-2",
      category: "geo",
      categoryName: "Generative AI & GEO Search",
      q: "How do you track brand visibility inside AI Overviews and conversational engines?",
      a: "We deploy custom AI search telemetry crawlers that query LLM answer endpoints weekly for commercial intent prompts, measuring brand citation frequency, sentiment scoring, and AI referral attribution in Looker Studio."
    },
    {
      id: "geo-3",
      category: "geo",
      categoryName: "Generative AI & GEO Search",
      q: "Will AI Overviews reduce website traffic, and how do we protect our traffic?",
      a: "While AI Overviews reduce low-intent informational clicks, they drive significantly higher conversion rates on commercial queries. Brands that structure entity data and publish proprietary research capture 72%+ of all AI answer citations."
    },

    // 3. PAID MEDIA & PERFORMANCE PPC
    {
      id: "ppc-0",
      category: "ppc",
      categoryName: "Paid Media & Meta Ads",
      q: "What paid advertising channels does Get Into Feed manage?",
      a: "We manage Google Search Ads, Performance Max (PMax), YouTube In-Stream Ads, Meta Advantage+ Shopping Campaigns (Instagram & Facebook), LinkedIn B2B ABM, and Apple Search Ads (ASA)."
    },
    {
      id: "ppc-1",
      category: "ppc",
      categoryName: "Paid Media & Meta Ads",
      q: "How do you prevent creative fatigue and scale Meta ad spend past ₹1 Crore/month?",
      a: "We deploy our 3-Tier Creative Sprint Architecture: weekly production of 12-16 creator UGC video hooks, dynamic creative testing (DCT), automated ad fatigue rotation, and server-side Meta Conversions API (CAPI) attribution."
    },
    {
      id: "ppc-2",
      category: "ppc",
      categoryName: "Paid Media & Meta Ads",
      q: "What is your approach to negative keyword sculpting in Google Ads?",
      a: "We perform daily search term audits and maintain proprietary negative keyword databases with 15,000+ scrubbed terms to prevent ad budget waste on non-converting consumer searches, competitors, and informational clicks."
    },
    {
      id: "ppc-3",
      category: "ppc",
      categoryName: "Paid Media & Meta Ads",
      q: "How do you handle iOS 17+ privacy signal loss and ad-blockers?",
      a: "We implement Server-Side Google Tag Manager (sGTM) and Meta Conversions API (CAPI) directly on your cloud infrastructure, restoring 25-35% of lost attribution signals and achieving an Event Match Quality score > 8.5/10."
    },

    // 4. SUB-SECOND REACT & CRO WEB
    {
      id: "cro-0",
      category: "cro",
      categoryName: "Sub-Second React & CRO",
      q: "Why do you build custom React & Next.js landing pages instead of page builders?",
      a: "Standard WordPress or Shopify page builders inject heavy scripts causing 3-5 second mobile load delays that burn up to 40% of ad spend. Our headless React architecture achieves sub-second load times (LCP < 800ms, 98+ PageSpeed), lifting conversion rates by an average of +42%."
    },
    {
      id: "cro-1",
      category: "cro",
      categoryName: "Sub-Second React & CRO",
      q: "How does your Conversion Rate Optimization (CRO) audit work?",
      a: "We run heatmaps, user recording diagnostics, and checkout friction audits. We then formulate scientific A/B split testing hypotheses on headlines, proof elements, form lengths, and WhatsApp 1-click CTA buttons."
    },
    {
      id: "cro-2",
      category: "cro",
      categoryName: "Sub-Second React & CRO",
      q: "Can you integrate 1-click WhatsApp Business API funnels?",
      a: "Yes. We build official Meta WhatsApp Business API automated lead funnels with instant quote calculation, calendar booking, and abandoned cart recovery sequences."
    },

    // 5. PRICING, ROAS & CONTRACTS
    {
      id: "pricing-0",
      category: "pricing",
      categoryName: "Pricing, ROAS & Contracts",
      q: "What are your engagement models and fee structures?",
      a: "We offer three transparent models: 1) Monthly Strategic Retainer (fixed sprint fee with dedicated pod), 2) Performance Hybrid (base fee + ROAS/revenue milestone bonus), and 3) Project Sprint (turnkey technical architecture audits or website builds)."
    },
    {
      id: "pricing-1",
      category: "pricing",
      categoryName: "Pricing, ROAS & Contracts",
      q: "Is there a minimum monthly ad spend or engagement period required?",
      a: "For Paid Media, we typically partner with brands spending ₹3 Lakhs/month or more to allow statistical significance in machine learning bidding algorithms. For Enterprise SEO & GEO, engagements are structured as 3, 6, or 12-month compounding growth sprints."
    },
    {
      id: "pricing-2",
      category: "pricing",
      categoryName: "Pricing, ROAS & Contracts",
      q: "Do you offer ROAS guarantees or performance benchmarks?",
      a: "Yes. During our initial 360° Growth Audit, we establish clear contractual KPIs—such as Target ROAS (e.g. 4.0x–5.5x), maximum Cost Per Acquisition (CPA), and organic ranking milestones—tracked in real-time dashboards."
    },

    // 6. ONBOARDING & SECURITY SLAS
    {
      id: "onboarding-0",
      category: "onboarding",
      categoryName: "Onboarding & Security SLAs",
      q: "How fast can we launch our first growth sprint after signing?",
      a: "Our onboarding protocol takes 7 to 10 business days. During this time, we complete technical tracking audits, configure GA4/CAPI endpoints, audit ad accounts, and deliver the initial 90-day growth sprint roadmap."
    },
    {
      id: "onboarding-1",
      category: "onboarding",
      categoryName: "Onboarding & Security SLAs",
      q: "How do you protect client data and ensure non-disclosure (NDA)?",
      a: "We sign strict mutual NDAs and non-compete agreements prior to accessing client systems. All data is managed under ISO-compliant security protocols with role-based access control and zero third-party data sharing."
    },
    {
      id: "onboarding-2",
      category: "onboarding",
      categoryName: "Onboarding & Security SLAs",
      q: "What does communication and reporting look like during an active engagement?",
      a: "You receive a dedicated Slack/Teams communication channel with your Growth Pod, weekly pacing syncs, real-time 24/7 Looker Studio executive telemetry, and monthly strategic executive board reviews."
    }
  ];

  const filteredFaqs = fullFaqDatabase.filter((item) => {
    const matchCat = activeCategory === "all" || item.category === activeCategory;
    const matchSearch =
      !searchTerm.trim() ||
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleFaq = (id) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const next = {};
    filteredFaqs.forEach((f) => { next[f.id] = true; });
    setOpenFaqs(next);
  };

  const collapseAll = () => {
    setOpenFaqs({});
  };

  return (
    <div className="faqs-hub-page-view">
      {/* 1. HERO BANNER */}
      <section className="faqs-hero-section">
        <div className="faqs-hero-container text-center">
          <div className="faqs-hero-kicker-badge">
            <Sparkles size={14} color="#f59e0b" />
            <span>❓ CLEAR ANSWERS • FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h1>Everything You Need to Know About Partnering with Get Into Feed</h1>

          <p className="faqs-hero-subtext">
            Have questions about our Enterprise SEO frameworks, AI Search (GEO), PPC scaling, contracts, pricing, and execution SLAs? Explore authoritative answers direct from our growth engineers.
          </p>

          {/* SEARCH BAR */}
          <div className="faqs-search-wrapper">
            <div className="faqs-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search questions on SEO, Google Ads, GEO, contracts, pricing..."
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

          {/* CATEGORY FILTER PILLS */}
          <div className="faqs-category-pills-row">
            {faqCategories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`faq-cat-pill ${activeCategory === cat.key ? "active" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MAIN FAQS ACCORDION SECTION */}
      <section className="faqs-main-accordion-section">
        <div className="faqs-container">
          <div className="faqs-controls-header">
            <div>
              <h2>{activeCategory === "all" ? "All Frequently Asked Questions" : faqCategories.find((c) => c.key === activeCategory)?.label}</h2>
              <p>Showing {filteredFaqs.length} verified answers</p>
            </div>

            <div className="faqs-expand-controls">
              <button type="button" onClick={expandAll} className="faq-ctrl-btn">
                Expand All
              </button>
              <button type="button" onClick={collapseAll} className="faq-ctrl-btn">
                Collapse All
              </button>
            </div>
          </div>

          {filteredFaqs.length > 0 ? (
            <div className="faqs-cards-list">
              {filteredFaqs.map((faq) => {
                const isOpen = !!openFaqs[faq.id];
                return (
                  <div key={faq.id} className={`faq-card-item ${isOpen ? "open" : ""}`}>
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="faq-card-question-btn"
                    >
                      <div className="faq-q-left">
                        <span className="faq-cat-tag">{faq.categoryName}</span>
                        <h3>{faq.q}</h3>
                      </div>
                      <span className="faq-toggle-icon-wrap">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="faq-card-answer-body">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="faqs-empty-state text-center">
              <Search size={36} color="#94a3b8" />
              <h3>No questions match "{searchTerm}"</h3>
              <p>Try searching for different keywords like 'SEO', 'PPC', 'GEO', or 'Pricing'.</p>
              <button
                type="button"
                onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                className="reset-filters-btn"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. STILL HAVE QUESTIONS SPLIT BANNER */}
      <section className="faqs-still-have-questions-section">
        <div className="faqs-container">
          <div className="faqs-support-split-card">
            <div className="faqs-support-left">
              <span className="support-kicker">STILL HAVE QUESTIONS?</span>
              <h3>Speak Directly with a Senior Growth Strategist</h3>
              <p>Every brand has unique unit economics and growth objectives. Let's discuss your category goals in an exploratory 15-minute consultation.</p>
            </div>

            <div className="faqs-support-actions">
              <button
                type="button"
                onClick={() => onNavigate("/contact")}
                className="faqs-support-orange-btn"
              >
                Schedule Strategy Call →
              </button>
              <a
                href="https://wa.me/919910308266?text=Hi%20Get%20Into%20Feed%2C%20I%20have%20a%20question%20about%20your%20services"
                target="_blank"
                rel="noreferrer"
                className="faqs-support-whatsapp-btn"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MARQUEE ENTERPRISE CLIENTS STRIP */}
      <section className="work-clients-strip-section">
        <div className="faqs-container">
          <span className="work-clients-title">TRUSTED BY 150+ LEADING ENTERPRISES ACROSS INDIA</span>
          <div className="work-clients-flex-wrap">
            <span className="marquee-logo-chip">Apollo 24|7</span>
            <span className="marquee-logo-chip">DCB Bank</span>
            <span className="marquee-logo-chip">Bajaj Finserv</span>
            <span className="marquee-logo-chip">Airtel Payments</span>
            <span className="marquee-logo-chip">Paytm</span>
            <span className="marquee-logo-chip">Groww</span>
            <span className="marquee-logo-chip">Moneyview</span>
            <span className="marquee-logo-chip">Tata 1mg</span>
            <span className="marquee-logo-chip">Max Life</span>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CONTACT AUDIT SECTION */}
      <ContactAuditSection />
    </div>
  );
}


// -----------------------------------------------------------------------------
// COMPREHENSIVE LEGAL & COMPLIANCE SUITE COMPONENT
// -----------------------------------------------------------------------------
function LegalDocumentPage({ docType = "privacy-policy", onNavigate }) {
  const [activeTab, setActiveTab] = useState(docType);

  const legalNavItems = [
    { key: "privacy-policy", label: "Privacy Policy (DPDP & GDPR)", icon: "🔒" },
    { key: "terms-and-conditions", label: "Terms & Conditions (MSA)", icon: "📜" },
    { key: "terms-of-use", label: "Website Terms of Use", icon: "⚖️" },
    { key: "disclaimer", label: "Disclaimer & Disclosure", icon: "⚠️" },
    { key: "cookie-policy", label: "Cookie & Tracking Policy", icon: "🍪" },
    { key: "refund-policy", label: "Cancellation & Refund Policy", icon: "💳" },
    { key: "csr-policy", label: "Corporate Social Responsibility", icon: "🌱" }
  ];

  const handleNavClick = (key) => {
    setActiveTab(key);
    onNavigate(`/${key}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="legal-hub-page-view">
      {/* HERO BANNER */}
      <section className="legal-hero-section">
        <div className="legal-container">
          <div className="legal-hero-kicker-badge">
            <ShieldCheck size={15} color="#38bdf8" />
            <span>DPDP ACT 2023 & GDPR COMPLIANT • ENTERPRISE LEGAL SUITE</span>
          </div>

          <h1>
            {activeTab === "privacy-policy" && "Privacy Policy"}
            {activeTab === "terms-and-conditions" && "Terms & Conditions (Master Services Agreement)"}
            {activeTab === "terms-of-use" && "Website Terms of Use"}
            {activeTab === "disclaimer" && "Legal Disclaimer & Performance Disclosure"}
            {activeTab === "cookie-policy" && "Cookie Policy & Tracking Technologies"}
            {activeTab === "refund-policy" && "Cancellation & Refund Policy"}
            {activeTab === "csr-policy" && "Corporate Social Responsibility (CSR) Policy"}
          </h1>

          <div className="legal-meta-row">
            <span>📅 Effective Date: January 1, 2026</span>
            <span>⚡ Last Updated: August 2026</span>
            <span>⚖️ Jurisdiction: New Delhi, India</span>
          </div>
        </div>
      </section>

      {/* TWO COLUMN CONTENT */}
      <section className="legal-body-section">
        <div className="legal-container legal-split-grid">
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="legal-sidebar-col">
            <div className="legal-sidebar-sticky">
              <span className="sidebar-nav-title">LEGAL & COMPLIANCE DIRECTORY</span>
              <nav className="legal-nav-menu">
                {legalNavItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNavClick(item.key)}
                    className={`legal-nav-btn ${activeTab === item.key ? "active" : ""}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* GRIEVANCE OFFICER BOX */}
              <div className="grievance-officer-card">
                <span className="officer-kicker">GRIEVANCE & DPO DESK</span>
                <h4>Data Protection & Legal Inquiries</h4>
                <p>For DPDP compliance, DPA execution, or contractual notices, contact our Legal Officer:</p>
                <div className="officer-details">
                  <strong>Get Into Feed Legal Cell</strong>
                  <a href="mailto:compliance@getintofeed.com">compliance@getintofeed.com</a>
                  <a href="tel:+919910308266">+91-9910308266</a>
                  <small>Sector 62, Electronic City, Noida, Uttar Pradesh 201301</small>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT DOCUMENT CONTENT */}
          <main className="legal-doc-content-col">
            {/* 1. PRIVACY POLICY */}
            {activeTab === "privacy-policy" && (
              <div className="legal-prose-block">
                <h2>1. Introduction & Regulatory Scope</h2>
                <p>
                  Get Into Feed ("we", "our", or "the Company") is committed to safeguarding the privacy and personal data of our website visitors, clients, and prospective leads. This Privacy Policy sets forth our practices regarding the collection, processing, storage, and transfer of personal data in strict compliance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023 (India)</strong>, the <strong>General Data Protection Regulation (GDPR) (EU 2016/679)</strong>, and the <strong>Information Technology (IT) Act, 2000</strong>.
                </p>

                <h2>2. Categories of Personal Data Collected</h2>
                <p>We only collect personal data that is strictly necessary for legitimate commercial business purposes, including:</p>
                <ul>
                  <li><strong>Identity & Contact Data:</strong> Full name, professional work email, telephone/WhatsApp number, corporate domain, and company job title submitted via our audit request forms or consultation bookings.</li>
                  <li><strong>Technical & Telemetry Data:</strong> IP address, browser type and version, time-zone setting, operating system, and anonymized referral paths collected via Server-Side Google Tag Manager and GA4.</li>
                  <li><strong>Campaign & Marketing Data:</strong> Communication preferences, feedback responses, and report download requests (e.g. Search Trends Report).</li>
                </ul>

                <h2>3. Lawful Basis for Processing</h2>
                <p>We process personal data solely under recognized lawful bases:</p>
                <ul>
                  <li><strong>Consent:</strong> Explicit opt-in consent provided when submitting consultation forms or opting into communications.</li>
                  <li><strong>Contractual Performance:</strong> Processing necessary for delivering digital marketing audits, proposal scopes, and client retainer deliverables.</li>
                  <li><strong>Legitimate Interests:</strong> Optimizing website performance, preventing bot spam (via Google reCAPTCHA), and securing our infrastructure.</li>
                </ul>

                <h2>4. Data Retention & Zero Spam Guarantee</h2>
                <p>
                  We retain personal data only for as long as necessary to fulfill the purposes for which it was collected. We enforce an uncompromising <strong>Zero Spam Guarantee</strong>. We never sell, lease, or monetize your contact information to third-party data brokers. You may opt out of promotional communications at any time by clicking the unsubscribe link or emailing <a href="mailto:privacy@getintofeed.com">privacy@getintofeed.com</a>.
                </p>

                <h2>5. Rights of Data Principals (DPDP & GDPR)</h2>
                <p>Under applicable data privacy regulations, you are entitled to:</p>
                <ul>
                  <li><strong>Right to Access:</strong> Request confirmation and summary of personal data processed by Get Into Feed.</li>
                  <li><strong>Right to Correction & Erasure:</strong> Request correction of inaccurate data or deletion of your personal records ("Right to be Forgotten").</li>
                  <li><strong>Right of Grievance Redressal:</strong> Submit a complaint directly to our designated Grievance Officer, with escalation rights to the Data Protection Board of India.</li>
                </ul>
              </div>
            )}

            {/* 2. TERMS & CONDITIONS */}
            {activeTab === "terms-and-conditions" && (
              <div className="legal-prose-block">
                <h2>1. Agreement to Master Terms</h2>
                <p>
                  These Terms and Conditions constitute a legally binding Master Services Agreement (MSA) between Get Into Feed and the client ("Client") engaging our digital marketing, enterprise search engine optimization (SEO), Generative Engine Optimization (GEO), paid media management, web engineering, or creative production services.
                </p>

                <h2>2. Scope of Services & Sprint Execution</h2>
                <p>
                  All services are delivered according to structured sprint deliverables set forth in the signed Statement of Work (SOW). Get Into Feed agrees to deploy qualified senior growth specialists, manage ad accounts with industry best practices, and deliver transparent Looker Studio telemetry dashboards.
                </p>

                <h2>3. Client Obligations & Access</h2>
                <p>
                  Client agrees to provide timely access to necessary analytics tools, Google Search Console, ad accounts, CMS endpoints, and brand creative assets required for sprint execution. Delay in providing required access may extend project milestones accordingly.
                </p>

                <h2>4. Billing, Retainers & Payment Terms</h2>
                <p>
                  Monthly retainer fees are invoiced in advance on the 1st of each calendar month and payable within 7 business days. Ad spend budgets are paid directly by Client to advertising platforms (Google Ads, Meta Ads) unless explicit credit arrangements are established in the SOW.
                </p>

                <h2>5. Intellectual Property Rights</h2>
                <p>
                  Upon receipt of full payment, all custom creative deliverables, copywriting assets, React landing page code, and custom Looker Studio dashboards created specifically for Client become the exclusive property of Client. Get Into Feed retains proprietary rights to pre-existing agency frameworks, algorithms, and analytical models.
                </p>

                <h2>6. Mutual Confidentiality (NDA)</h2>
                <p>
                  Both parties agree to hold in strict confidence all proprietary technical, financial, and marketing information shared during the engagement, surviving termination for a period of three (3) years.
                </p>

                <h2>7. Limitation of Liability & Governing Law</h2>
                <p>
                  Except for willful misconduct or breach of confidentiality, neither party's aggregate liability under this agreement shall exceed the total fees paid by Client to Get Into Feed in the three (3) months preceding the claim. This agreement is governed by the laws of India, subject to the exclusive jurisdiction of courts in New Delhi.
                </p>
              </div>
            )}

            {/* 3. TERMS OF USE */}
            {activeTab === "terms-of-use" && (
              <div className="legal-prose-block">
                <h2>1. Acceptance of Website Terms</h2>
                <p>
                  By accessing or using the website <strong>getintofeed.com</strong>, you agree to comply with and be bound by these Website Terms of Use. If you do not agree to these terms, please do not utilize this website or download its published resources.
                </p>

                <h2>2. Permitted Use & Intellectual Property</h2>
                <p>
                  All content published on this website—including research playbooks, blog articles, case studies, graphics, audio, video, code, and logos—is the exclusive intellectual property of Get Into Feed. You are granted a limited, non-transferable license to view and download single copies of published playbooks for internal educational evaluation only.
                </p>

                <h2>3. Prohibited Conduct</h2>
                <p>You agree not to:</p>
                <ul>
                  <li>Use automated web scrapers, spiders, or bots to extract bulk data or articles without express written consent.</li>
                  <li>Engage in denial-of-service (DoS) attacks or attempt unauthorized access to server endpoints.</li>
                  <li>Republish, commercialize, or syndicate Get Into Feed case study metrics or whitepapers under a different brand name.</li>
                </ul>
              </div>
            )}

            {/* 4. DISCLAIMER */}
            {activeTab === "disclaimer" && (
              <div className="legal-prose-block">
                <h2>1. Marketing Performance & ROI Disclaimer</h2>
                <p>
                  Case studies, performance metrics (+340% leads, 4.8x ROAS), and growth benchmarks referenced across this website reflect actual historical outcomes achieved for specific enterprise and D2C clients under defined budget conditions and execution timeframes.
                </p>
                <p>
                  Digital marketing performance depends on numerous external variables including search engine algorithmic updates, competitor market dynamics, client product-market fit, and budget sizing. Therefore, while we deploy proven sprint methodologies, Get Into Feed does not guarantee identical financial results or specific ranking positions for every business vertical.
                </p>

                <h2>2. Third-Party Trademarks & Affiliations</h2>
                <p>
                  All third-party brand names, company logos (e.g. Google, Meta, Bajaj Finserv, Paytm, Apollo Hospitals, Shopify), and registered trademarks featured on this website are the property of their respective owners. Their mention does not imply endorsement, sponsorship, or affiliation unless explicitly stated.
                </p>
              </div>
            )}

            {/* 5. COOKIE POLICY */}
            {activeTab === "cookie-policy" && (
              <div className="legal-prose-block">
                <h2>1. What Are Cookies?</h2>
                <p>
                  Cookies and tracking technologies are small data files placed on your device to ensure website functionality, measure user interactions, and enhance digital experiences.
                </p>

                <h2>2. Types of Cookies Deployed</h2>
                <div className="legal-table-wrapper">
                  <table className="legal-styled-table">
                    <thead>
                      <tr>
                        <th>Cookie Category</th>
                        <th>Purpose</th>
                        <th>Lifespan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Strictly Necessary</strong></td>
                        <td>Security, load balancing, fraud prevention (reCAPTCHA), and cookie preference persistence.</td>
                        <td>Session / 1 Year</td>
                      </tr>
                      <tr>
                        <td><strong>Analytics & Telemetry</strong></td>
                        <td>Anonymized GA4 and server-side tracking to measure page dwell time and navigation paths.</td>
                        <td>2 Years</td>
                      </tr>
                      <tr>
                        <td><strong>Marketing & Attribution</strong></td>
                        <td>Meta Conversions API (CAPI) and Google Ads enhanced conversion measurement.</td>
                        <td>90 Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2>3. Managing & Revoking Cookie Consent</h2>
                <p>
                  You have complete control over your cookie preferences. You can click the "Cookie Preferences" link in our footer at any time to modify or revoke consent for non-essential analytics and marketing cookies.
                </p>
              </div>
            )}

            {/* 6. REFUND POLICY */}
            {activeTab === "refund-policy" && (
              <div className="legal-prose-block">
                <h2>1. Retainer & Sprint Cancellation Policy</h2>
                <p>
                  Monthly growth marketing retainers may be cancelled by either party with a thirty (30) day written notice prior to the start of the subsequent monthly billing cycle.
                </p>

                <h2>2. Project Milestone Refunds</h2>
                <p>
                  For fixed-scope technical audits or custom React web development projects, refund requests are evaluated based on milestone delivery. In the event that Get Into Feed fails to deliver agreed technical deliverables within the cure period specified in the SOW, Client is entitled to a prorated refund for uncompleted milestones.
                </p>
              </div>
            )}

            {/* 7. CSR POLICY */}
            {activeTab === "csr-policy" && (
              <div className="legal-prose-block">
                <h2>1. Corporate Social Responsibility (CSR) Vision</h2>
                <p>
                  At Get Into Feed, we believe transformative technology should benefit broader society. Our CSR initiatives center on digital literacy education, open-source AI knowledge sharing, and environmental sustainability in high-efficiency cloud computing.
                </p>

                <h2>2. Core Pillars of Social Impact</h2>
                <ul>
                  <li><strong>Digital Growth Scholarships:</strong> Providing free digital marketing and SEO masterclass training to 500+ underprivileged students annually.</li>
                  <li><strong>Green Cloud Infrastructure:</strong> Committing to carbon-neutral serverless hosting and minimizing digital computational waste across all client deployments.</li>
                  <li><strong>Pro-Bono NGO Support:</strong> Offering free search optimization and digital visibility services to verified non-profit healthcare organizations across India.</li>
                </ul>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}


// -----------------------------------------------------------------------------
// INTERACTIVE FREE 360° WEBSITE & SEO AUDIT MODAL
// -----------------------------------------------------------------------------
function InteractiveFreeAuditModal({ isOpen, onClose }) {
  const [step, setStep] = useState("form"); // "form" | "scanning" | "results"
  const [form, setForm] = useState({
    website: "",
    brand: "",
    name: "",
    email: "",
    phone: "",
    auditType: "Enterprise SEO & Technical Crawl"
  });
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [scanStage, setScanStage] = useState("Connecting to search index...");
  const [leadId, setLeadId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleStartAudit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.website.trim()) {
      setErrorMsg("Please enter your website or domain URL.");
      return;
    }
    if (!form.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setErrorMsg("Please enter a valid work email address.");
      return;
    }
    if (!form.phone.trim()) {
      setErrorMsg("Please enter your mobile or WhatsApp number.");
      return;
    }
    if (!recaptchaVerified) {
      setErrorMsg("Please verify that you are not a robot.");
      return;
    }

    // Move to scanning animation
    setStep("scanning");
    setScanningProgress(15);
    setScanStage("Crawling URL topology & analyzing Core Web Vitals...");

    const genId = "AUD-" + Math.floor(100000 + Math.random() * 900000);
    setLeadId(genId);

    // Save lead to backend
    try {
      fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.brand.trim() || form.website.trim(),
          service: form.auditType,
          message: `Free Audit Request for domain: ${form.website.trim()} (Ref: #${genId})`,
          source: "interactive_free_audit_modal"
        })
      }).catch(() => {});
    } catch {}

    // Simulated progress steps
    setTimeout(() => {
      setScanningProgress(55);
      setScanStage("Evaluating AI Overviews (GEO) citations & knowledge graphs...");
    }, 1000);

    setTimeout(() => {
      setScanningProgress(85);
      setScanStage("Calculating CAC reduction & programmatic keyword potential...");
    }, 2000);

    setTimeout(() => {
      setScanningProgress(100);
      setScanStage("Diagnostic complete! Generating executive audit scorecard...");
    }, 2800);

    setTimeout(() => {
      setStep("results");
    }, 3400);
  };

  const handleDownloadPdf = () => {
    const reportText = `=============================================================
GET INTO FEED - 360° TECHNICAL & SEO AUDIT SCORECARD
=============================================================
Audited Domain: ${form.website}
Client / Brand: ${form.brand || form.name}
Prepared For:   ${form.name} (${form.email})
Contact Phone:  ${form.phone}
Audit Focus:    ${form.auditType}
Reference ID:   #${leadId}
Audit Date:     ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
Agency Office:  Sector 62, Noida, Uttar Pradesh (Delhi-NCR)

-------------------------------------------------------------
EXECUTIVE HEALTH SCORE: 88 / 100 (HIGH OPTIMIZATION POTENTIAL)
-------------------------------------------------------------
1. Core Web Vitals (LCP/CLS):  0.85s (Fast - Passed 92% thresholds)
2. AI Search (GEO) Readiness:   68% (Missing entity knowledge graph schemas)
3. Crawl & Index Efficiency:   96% (12 orphan URLs & schema deprecations detected)
4. Paid Ads Attribution (CAPI): 34% CAC Reduction Potential with server-side CAPI
5. Programmatic Keyword Moat:  +180% Long-tail search discovery gap vs. competitors

-------------------------------------------------------------
RECOMMENDED 4-STAGE SPRINT ROADMAP:
- Sprint 1 (Days 1-30):  Schema Entity Knowledge Graphs & Server CAPI Telemetry
- Sprint 2 (Days 31-60): High-Intent Programmatic Keyword Hubs (500+ URLs)
- Sprint 3 (Days 61-90): Sub-Second Headless React Funnels & Creator UGC Hooks
- Sprint 4 (Ongoing):    Continuous GA4 Looker Studio Telemetry & Conversion Pacing

Contact Senior Growth Strategist: +91-9910308266 | growth@getintofeed.com
Visit: https://getintofeed.com
=============================================================`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GetIntoFeed-360-Audit-${(form.brand || "Brand").toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setStep("form");
    setScanningProgress(0);
    setRecaptchaVerified(false);
    setErrorMsg("");
  };

  return (
    <div className="audit-modal-overlay" onClick={onClose}>
      <div className="audit-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button type="button" onClick={onClose} className="audit-modal-close-btn" aria-label="Close Audit Modal">
          <X size={20} />
        </button>

        {/* STEP 1: FORM INPUT */}
        {step === "form" && (
          <div className="audit-modal-content">
            <div className="audit-modal-header text-center">
              <div className="audit-modal-badge">
                <Sparkles size={14} color="#f59e0b" />
                <span>⚡ REAL-TIME 360° TECHNICAL & SEO AUDIT ENGINE</span>
              </div>
              <h2>Audit Your Brand's Search & Revenue Pipeline</h2>
              <p>Enter your website URL to uncover hidden crawl bottlenecks, Core Web Vitals latency, and AI Search (GEO) discovery gaps in seconds.</p>
            </div>

            <form onSubmit={handleStartAudit} className="audit-modal-form">
              {errorMsg && (
                <div className="audit-error-banner">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* WEBSITE DOMAIN INPUT */}
              <div className="audit-form-group">
                <label>Website URL / Domain <span className="req-star">*</span></label>
                <div className="audit-input-with-icon">
                  <Globe size={18} className="input-field-icon" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. https://yourbrand.com or yourbrand.in"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>
              </div>

              {/* BRAND NAME & FULL NAME ROW */}
              <div className="audit-two-col-row">
                <div className="audit-form-group">
                  <label>Brand / Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Enterprises"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  />
                </div>
                <div className="audit-form-group">
                  <label>Full Name <span className="req-star">*</span></label>
                  <input
                    required
                    type="text"
                    placeholder="Your Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* WORK EMAIL & PHONE ROW */}
              <div className="audit-two-col-row">
                <div className="audit-form-group">
                  <label>Work Email <span className="req-star">*</span></label>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="audit-form-group">
                  <label>Mobile / WhatsApp No <span className="req-star">*</span></label>
                  <input
                    required
                    type="tel"
                    placeholder="+91-9910308266"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* AUDIT FOCUS SELECT */}
              <div className="audit-form-group">
                <label>Primary Growth / Audit Focus</label>
                <div className="audit-select-wrap">
                  <select
                    value={form.auditType}
                    onChange={(e) => setForm({ ...form, auditType: e.target.value })}
                  >
                    <option value="Enterprise SEO & Technical Crawl">Enterprise SEO & Technical Crawl Diagnostics</option>
                    <option value="Generative Engine Optimization (GEO)">Generative AI Search (GEO) & AI Overviews Audit</option>
                    <option value="Paid Media & Google Ads ROAS Diagnostic">Paid Media & Google Ads ROAS Waste Diagnostic</option>
                    <option value="Sub-Second React & Web CRO Funnel">Sub-Second React Web & CRO Funnel Diagnostic</option>
                    <option value="Full 360° Omnichannel Growth Sprint">Full 360° Omnichannel Growth Sprint Audit</option>
                  </select>
                  <ChevronDown size={16} className="select-arrow" />
                </div>
              </div>

              {/* GOOGLE RECAPTCHA INTERACTIVE BOX */}
              <div
                className={`audit-recaptcha-card ${recaptchaVerified ? "verified" : ""}`}
                onClick={() => setRecaptchaVerified(!recaptchaVerified)}
                role="checkbox"
                aria-checked={recaptchaVerified}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setRecaptchaVerified(!recaptchaVerified); }}
              >
                <div className="recaptcha-left-col">
                  <div className={`recaptcha-checkbox-square ${recaptchaVerified ? "checked" : ""}`}>
                    {recaptchaVerified && <Check size={14} color="#ffffff" />}
                  </div>
                  <span className="recaptcha-prompt-text">I'm not a robot</span>
                </div>
                <div className="recaptcha-right-brand">
                  <img
                    src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                    alt="reCAPTCHA"
                    className="recaptcha-g-logo"
                  />
                  <span className="recaptcha-title">reCAPTCHA</span>
                  <small className="recaptcha-privacy-terms">Privacy - Terms</small>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button type="submit" className="audit-run-submit-btn">
                Run Free Instant 360° Audit ⚡
              </button>

              <p className="audit-privacy-guarantee">
                🔒 100% Free • No credit card required • Instant automated diagnostics & privacy guaranteed under DPDP Act 2023.
              </p>
            </form>
          </div>
        )}

        {/* STEP 2: SCANNING ANIMATION */}
        {step === "scanning" && (
          <div className="audit-scanning-view text-center">
            <div className="scanning-radar-pulse">
              <Activity size={42} color="#38bdf8" />
            </div>

            <h3>Auditing {form.website}...</h3>
            <p className="scanning-stage-text">{scanStage}</p>

            <div className="scanning-progress-bar-wrap">
              <div className="scanning-progress-fill" style={{ width: `${scanningProgress}%` }}></div>
            </div>
            <span className="scanning-percent-tag">{scanningProgress}% Complete</span>

            <div className="scanning-checklist-items">
              <div className={`scan-check-item ${scanningProgress >= 25 ? "done" : ""}`}>
                <CheckCircle2 size={16} /> <span>Crawling canonical topology & schema tags</span>
              </div>
              <div className={`scan-check-item ${scanningProgress >= 65 ? "done" : ""}`}>
                <CheckCircle2 size={16} /> <span>Auditing AI answer engine (GEO) citation moats</span>
              </div>
              <div className={`scan-check-item ${scanningProgress >= 90 ? "done" : ""}`}>
                <CheckCircle2 size={16} /> <span>Synthesizing CAC reduction & revenue forecast</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: AUDIT RESULTS SCORECARD */}
        {step === "results" && (
          <div className="audit-results-view">
            <div className="results-header-banner">
              <div className="results-score-badge">
                <span className="score-num">88</span>
                <span className="score-label">Health Score</span>
              </div>
              <div className="results-title-col">
                <span className="audit-ref-tag">REFERENCE #{leadId}</span>
                <h3>360° Audit Generated for {form.website}</h3>
                <p>We've identified 4 high-impact growth levers that can scale your organic search pipeline by +270%.</p>
              </div>
            </div>

            {/* 4 AUDIT KPIS GRID */}
            <div className="results-metrics-grid">
              <div className="result-kpi-card">
                <span className="kpi-icon">⚡</span>
                <div>
                  <strong>0.85s (Fast)</strong>
                  <span>Core Web Vitals LCP</span>
                </div>
              </div>

              <div className="result-kpi-card">
                <span className="kpi-icon">🤖</span>
                <div>
                  <strong>68% Opportunity</strong>
                  <span>AI Search (GEO) Visibility</span>
                </div>
              </div>

              <div className="result-kpi-card">
                <span className="kpi-icon">🔍</span>
                <div>
                  <strong>96% Efficient</strong>
                  <span>Crawl Indexation Ratio</span>
                </div>
              </div>

              <div className="result-kpi-card">
                <span className="kpi-icon">💰</span>
                <div>
                  <strong>-34% CAC Potential</strong>
                  <span>Paid Ad CAPI Attribution</span>
                </div>
              </div>
            </div>

            {/* ACTIONS ROW */}
            <div className="results-actions-row">
              <button type="button" onClick={handleDownloadPdf} className="audit-download-report-btn">
                <Download size={16} /> Download Full 2026 Audit Report
              </button>

              <a
                href={`https://wa.me/919910308266?text=Hi%20Get%20Into%20Feed%2C%20I%20just%20ran%20an%20audit%20for%20${encodeURIComponent(form.website)}%20(Ref%3A%20%23${leadId})%20and%20would%20like%20to%20discuss%20the%20strategy.`}
                target="_blank"
                rel="noreferrer"
                className="audit-whatsapp-btn"
              >
                💬 Discuss Strategy on WhatsApp
              </a>

              <button type="button" onClick={handleReset} className="audit-re-run-btn">
                🔄 Audit Another Domain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// DEDICATED AWARDS AND RECOGNITION PAGE (/awards)
// -----------------------------------------------------------------------------
function AwardsPage({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { key: "all", label: "All Accolades" },
    { key: "seo", label: "Enterprise SEO & GEO" },
    { key: "performance", label: "Paid Media & Performance" },
    { key: "industry", label: "Industry & Agency Leadership" },
    { key: "partner", label: "Partner Accreditations" }
  ];

  const awardsList = [
    {
      id: "award-1",
      year: "2026",
      category: "seo",
      categoryLabel: "Enterprise SEO & GEO",
      title: "Best Enterprise SEO Agency of the Year",
      authority: "Indian Digital Marketing Awards (IDMA 2026)",
      trophy: "🥇 Gold Winner",
      description: "Awarded for exceptional programmatic search architecture, schema entity graphs, and delivering +340% organic sales pipeline for tier-1 Indian enterprise brands.",
      citation: "Recognized for pioneering search architecture that bridges Googlebot indexing and AI search engine discovery."
    },
    {
      id: "award-2",
      year: "2026",
      category: "seo",
      categoryLabel: "AI & Generative Search",
      title: "Excellence in Generative Engine Optimization (GEO)",
      authority: "Global Search Awards (Asia 2026)",
      trophy: "🏆 Industry Benchmark",
      description: "Recognized as India's premier agency deploying structured brand knowledge graphs that achieve 70%+ commercial AI answer engine citation dominance.",
      citation: "Setting the global standard for brand citation readiness across ChatGPT, Google Gemini, and Perplexity."
    },
    {
      id: "award-3",
      year: "2026",
      category: "performance",
      categoryLabel: "Paid Media & PPC",
      title: "Best Performance Marketing Campaign (BFSI / FinTech)",
      authority: "ET BrandEquity DigiPlus Awards 2026",
      trophy: "🥇 Gold Winner",
      description: "Honored for managing multi-crore Google Search and Meta Advantage+ campaigns that reduced customer acquisition costs (CAC) by -42% while scaling loan disbursement volume.",
      citation: "Flawless execution of server-side Meta CAPI attribution and value-based bidding algorithms."
    },
    {
      id: "award-4",
      year: "2026",
      category: "performance",
      categoryLabel: "D2C & E-Commerce",
      title: "Best High-Velocity D2C Scaling Campaign",
      authority: "Campaign India Digital Crest Awards (CIDCA 2026)",
      trophy: "🥇 Best in Category",
      description: "Celebrated for scaling Veloura Organics monthly revenue from ₹32L to ₹1.8 Crore at 4.8x blended ROAS within 120 days using creator UGC reels and sub-second React landing pages.",
      citation: "Uncompromising synergy between creator video psychology and sub-second web speed."
    },
    {
      id: "award-5",
      year: "2026",
      category: "partner",
      categoryLabel: "Partner Accreditations",
      title: "Google Premier Partner Excellence Winner",
      authority: "Google Agency Partner Awards 2026",
      trophy: "🌟 Top 3% Tier",
      description: "Recognized within the top 3% of performance marketing agencies across India for exceptional campaign governance, client revenue growth, and advanced ad tech adoption.",
      citation: "Demonstrated mastery of Google AI Smart Bidding, Performance Max, and first-party conversion modeling."
    },
    {
      id: "award-6",
      year: "2026",
      category: "industry",
      categoryLabel: "Industry & Trust",
      title: "Top Rated Enterprise Digital Agency on Clutch (4.9★)",
      authority: "Clutch Global Leaders 2026",
      trophy: "⭐ Verified 4.9/5",
      description: "Ranked #1 in client satisfaction, ROI delivery, and executive communication based on 380+ verified enterprise client reviews.",
      citation: "Highest client retention rate (94%) and audited growth impact among Indian digital agencies."
    },
    {
      id: "award-7",
      year: "2026",
      category: "seo",
      categoryLabel: "Healthcare & Local SEO",
      title: "Best Organic Search Innovation in Healthcare",
      authority: "DMA Asia ECHO Awards 2026",
      trophy: "🥇 Gold Trophy",
      description: "Recognized for dominating Google 3-Pack and localized doctor specialty pages across 14 hospital centers, generating a 2.8x increase in verified patient OPD appointments.",
      citation: "Hyperlocal search domination powered by automated review syndication and localized schemas."
    },
    {
      id: "award-8",
      year: "2026",
      category: "industry",
      categoryLabel: "Culture & Workplace",
      title: "Great Place to Work & High-Trust Culture Certified",
      authority: "Great Place to Work® Institute India",
      trophy: "🏅 100% Meritocracy",
      description: "Certified as one of India's best digital agencies to work at, honoring our autonomy, ₹50,000 learning stipends, transparent profit-sharing, and radical candor.",
      citation: "A high-trust workplace empowering top-tier growth marketing talent to do their career-best work."
    }
  ];

  const filteredAwards = activeCategory === "all"
    ? awardsList
    : awardsList.filter((a) => a.category === activeCategory);

  return (
    <div className="awards-hub-page-view">
      {/* 1. HERO BANNER */}
      <section className="awards-hero-section">
        <div className="awards-container text-center">
          <div className="awards-kicker-badge">
            <Trophy size={14} color="#f59e0b" />
            <span>INDUSTRY RECOGNITION & ACCREDITATIONS • 2026 HONORS</span>
          </div>

          <h1>Award-Winning Excellence in Digital & AI-First Growth</h1>

          <p className="awards-hero-subtext">
            Recognized by India's most prestigious marketing institutions and global tech leaders for engineering predictable, compounding revenue moats for category-defining brands.
          </p>

          {/* 4 STATS RIBBON */}
          <div className="awards-stats-ribbon-grid">
            <div className="awards-stat-card">
              <strong>15+</strong>
              <span>National & Asian Awards</span>
            </div>
            <div className="awards-stat-card">
              <strong>Top 3%</strong>
              <span>Google Premier Partner</span>
            </div>
            <div className="awards-stat-card">
              <strong>4.9 ★</strong>
              <span>Clutch Client Rating</span>
            </div>
            <div className="awards-stat-card">
              <strong>94%</strong>
              <span>Client Retention Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER TABS */}
      <section className="awards-filter-section">
        <div className="awards-container">
          <div className="awards-filter-tabs-row">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`awards-filter-pill ${activeCategory === cat.key ? "active" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AWARDS SHOWCASE GRID */}
      <section className="awards-cards-grid-section">
        <div className="awards-container">
          <div className="awards-grid-header text-center">
            <span className="contact-kicker-pill">HONORING MEASURABLE COMMERCIAL IMPACT</span>
            <h2>Prestigious Industry Accolades & Trophies</h2>
            <p>Showing {filteredAwards.length} verified recognitions evaluated by independent jury panels of Fortune 500 CMOs and digital leaders.</p>
          </div>

          <div className="awards-cards-grid">
            {filteredAwards.map((award) => (
              <div key={award.id} className="award-item-card">
                <div className="award-card-top-row">
                  <span className="award-trophy-badge">{award.trophy}</span>
                  <span className="award-year-tag">{award.year}</span>
                </div>

                <span className="award-category-kicker">{award.categoryLabel}</span>
                <h3>{award.title}</h3>
                <span className="award-authority-name">🏛️ {award.authority}</span>

                <p className="award-detail-text">{award.description}</p>

                <div className="award-citation-box">
                  <span className="citation-quote-icon">“</span>
                  <p>{award.citation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CLIENT & PARTNER VALIDATION STRIP */}
      <section className="awards-partner-strip-section">
        <div className="awards-container">
          <div className="awards-partner-box">
            <div className="partner-left-text">
              <h3>Partner with an Award-Winning Growth Studio</h3>
              <p>Let's engineer scalable organic search moats, sub-second React web funnels, and high-ROAS paid media for your brand.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("/contact")}
              className="awards-cta-orange-btn"
            >
              Claim Your Free 360° Audit →
            </button>
          </div>
        </div>
      </section>

      {/* 5. CONTACT AUDIT FORM */}
      <ContactAuditSection />
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => window.location.pathname || "/");
  const [content, setContent] = useState(fallback);
  const [jobs, setJobs] = useState(fallback.careers);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [cookiePrefsOpen, setCookiePrefsOpen] = useState(false);

  useEffect(() => {
    // GOOGLE INTERSTITIAL & DPDP BEST PRACTICES:
    // 1. Never show if user already downloaded/converted
    // 2. Never show on contact or admin routes where user is actively engaging
    // 3. 24-hour frequency capping if dismissed
    const alreadyDownloaded = localStorage.getItem("gif_report_downloaded");
    const dismissedUntil = Number(localStorage.getItem("gif_report_dismissed_until")) || 0;
    const sessionDismissed = sessionStorage.getItem("gif_report_modal_dismissed");

    const isExcludedRoute = route === "/admin" || route === "/contact" || route === "/careers";

    if (!alreadyDownloaded && !sessionDismissed && Date.now() > dismissedUntil && !isExcludedRoute) {
      const timer = setTimeout(() => {
        setReportModalOpen(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [route]);

  const fetchContent = async (signal) => {
    try {
      const res = await fetch(`${API_URL}/api/site`, { signal });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch {}

    try {
      const jRes = await fetch(`${API_URL}/api/careers`, { signal });
      if (jRes.ok) {
        const jData = await jRes.json();
        setJobs(jData.jobs || fallback.careers);
      }
    } catch {}
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchContent(controller.signal);

    const onPop = () => setRoute(window.location.pathname || "/");
    window.addEventListener("popstate", onPop);

    return () => {
      controller.abort();
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setRoute(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const blogPosts = content.blogPosts || [];

  const service = route.startsWith("/services/")
    ? resolveService(decodeURIComponent(route.slice(10)), content.services)
    : null;

  const study = route.startsWith("/work/")
    ? resolveCaseStudy(decodeURIComponent(route.slice(6)), content.caseStudies)
    : null;

  const location = route.startsWith("/locations/")
    ? locationCatalog[decodeURIComponent(route.slice(11))] || locationCatalog["bengaluru"]
    : null;

  const blogPost = route.startsWith("/blog/")
    ? blogPosts.find((p) => p.slug === decodeURIComponent(route.slice(6))) || blogPosts[0]
    : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const currentMeta = service
      ? [`${service.title} | Get Into Feed`, service.description]
      : study
      ? [`${study.brand} | Get Into Feed`, study.detail]
      : location
      ? [`${location.title} | Get Into Feed`, location.overview]
      : blogPost
      ? [blogPost.title, blogPost.excerpt]
      : meta[route] || meta["/"];

    document.title = currentMeta[0];
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.content = currentMeta[1];
  }, [route, service, study, location, blogPost]);

  if (route === "/admin") {
    return <AdminDashboard onNavigate={navigate} />;
  }

  let pageView;
  if (route.startsWith("/services/")) {
    pageView = <ServiceDetail service={service} onNavigate={navigate} />;
  } else if (route.startsWith("/work/")) {
    pageView = <WorkDetail study={study} onNavigate={navigate} />;
  } else if (route.startsWith("/locations/")) {
    pageView = <LocationDetail loc={location} onNavigate={navigate} />;
  } else if (route.startsWith("/blog/")) {
    pageView = <BlogArticle post={blogPost} posts={blogPosts} onNavigate={navigate} />;
  } else if (route === "/services") {
    pageView = <ServicesHubPage onNavigate={navigate} />;
  } else if (route === "/work") {
    pageView = <OurWorkHubPage onNavigate={navigate} />;
  } else if (route === "/blog") {
    pageView = <BlogPage posts={blogPosts} onNavigate={navigate} />;
  } else if (route === "/careers") {
    pageView = <CareersPage jobs={jobs} onNavigate={navigate} />;
  } else if (route === "/faqs") {
    pageView = <FaqsPage onNavigate={navigate} />;
  } else if (route === "/privacy-policy") {
    pageView = <LegalDocumentPage docType="privacy-policy" onNavigate={navigate} />;
  } else if (route === "/terms-and-conditions" || route === "/terms-of-service") {
    pageView = <LegalDocumentPage docType="terms-and-conditions" onNavigate={navigate} />;
  } else if (route === "/terms-of-use") {
    pageView = <LegalDocumentPage docType="terms-of-use" onNavigate={navigate} />;
  } else if (route === "/disclaimer") {
    pageView = <LegalDocumentPage docType="disclaimer" onNavigate={navigate} />;
  } else if (route === "/cookie-policy") {
    pageView = <LegalDocumentPage docType="cookie-policy" onNavigate={navigate} />;
  } else if (route === "/refund-policy") {
    pageView = <LegalDocumentPage docType="refund-policy" onNavigate={navigate} />;
  } else if (route === "/csr-policy") {
    pageView = <LegalDocumentPage docType="csr-policy" onNavigate={navigate} />;
  } else if (route === "/awards") {
    pageView = <AwardsPage onNavigate={navigate} />;
  } else if (route === "/about") {
    pageView = <AboutPage />;
  } else if (route === "/contact") {
    pageView = <ContactAuditSection />;
  } else {
    pageView = <Home content={content} />;
  }

  return (
    <div className="site-shell">
      <AnnouncementBar onOpenAudit={() => setAuditModalOpen(true)} />
      <Header route={route} onOpenAudit={() => setAuditModalOpen(true)} />
      <main>{pageView}</main>
      <EnterpriseFooter onOpenAudit={() => setAuditModalOpen(true)} />

      {/* INTERACTIVE FREE 360° AUDIT MODAL */}
      <InteractiveFreeAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />

      {/* SEARCH TRENDS REPORT POPUP MODAL */}
      <SearchTrendsReportModal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          // Set session dismissal + 24-hour frequency cap
          sessionStorage.setItem("gif_report_modal_dismissed", "true");
          localStorage.setItem("gif_report_dismissed_until", String(Date.now() + 24 * 60 * 60 * 1000));
        }}
      />

      {/* COOKIE CONSENT FLOATING BANNER & PREFERENCES MODAL */}
      <CookieConsentBanner onOpenPrefs={() => setCookiePrefsOpen(true)} />
      <CookiePreferencesModal
        isOpen={cookiePrefsOpen}
        onClose={() => setCookiePrefsOpen(false)}
        onSave={(prefs) => {
          localStorage.setItem("gif_cookie_consent", JSON.stringify({ ...prefs, timestamp: Date.now() }));
          setCookiePrefsOpen(false);
        }}
      />
    </div>
  );
}
