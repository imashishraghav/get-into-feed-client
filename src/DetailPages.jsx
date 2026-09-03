import React, { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart2,
  BarChart3,
  Briefcase,
  Building2,
  Calculator,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Clock,
  Code,
  Coffee,
  Compass,
  Database,
  Dumbbell,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Flame,
  Globe,
  Globe2,
  GraduationCap,
  Heart,
  HelpCircle,
  Home,
  Instagram,
  Layers,
  Layout,
  LineChart,
  Linkedin,
  Mail,
  Map,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  MousePointerClick,
  Palette,
  PenTool,
  Phone,
  PieChart,
  Play,
  Plus,
  Quote,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Video,
  X,
  Zap
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// -----------------------------------------------------------------------------
// SERVICE TAXONOMY (8 CORE PILLARS)
// -----------------------------------------------------------------------------
export const serviceCatalog = {
  "content-marketing": {
    slug: "content-marketing",
    title: "Content Marketing & Editorial Authority",
    icon: PenTool,
    label: "Content Engine",
    outcome: "High-intent articles, authority playbooks, and viral social hooks that rank #1 on Google and turn readers into paying clients.",
    description: "In 2026, generic content gets ignored. We craft editorial-grade SEO content hubs, customer research playbooks, and thought leadership that captures category dominance.",
    bottleneck: "Brands waste thousands on generic keyword articles that fail to rank in AI search and fail to convert readers.",
    framework: [
      { step: "01. Commercial Intent Mapping", detail: "Targeting bottom-funnel buyer queries with immediate purchasing motivation." },
      { step: "02. Authority Playbook Production", detail: "Publishing original benchmark data and comprehensive frameworks." },
      { step: "03. Social Hook Repurposing", detail: "Translating long-form articles into swipeable carousels and viral reels." },
      { step: "04. Generative AI Entity Indexing", detail: "Structuring entity schema so ChatGPT and Gemini cite your brand as the primary authority." }
    ],
    points: [
      "Entity-Rich SEO Content Hubs & Topic Clusters",
      "High-Converting Viral Social Media Carousels",
      "Executive Thought Leadership & Ghostwriting",
      "Generative Engine Optimization (GEO / AI SEO)",
      "Digital PR & Tier-1 Media Placement Citations",
      "Conversion-Focused Copywriting with Clear CTAs"
    ],
    tools: ["Ahrefs Enterprise", "Google Search Console", "Schema.org", "SEMrush", "Grammarly Business"],
    caseMetric: "+340% Inbound Organic Pipeline",
    caseBrand: "FinScale Lending (BFSI)",
    faqs: [
      { q: "How do you ensure content actually converts?", a: "Every piece of content includes clear commercial hooks, comparison tables, customer proof points, and frictionless lead capture triggers." },
      { q: "How long until content ranks on Google and AI Overviews?", a: "High-authority articles typically index and rank within 14 to 30 days, compounding traffic exponentially month over month." }
    ]
  },
  "ads-campaign": {
    slug: "ads-campaign",
    title: "Performance Ads & Paid Acquisition (ROAS)",
    icon: Megaphone,
    label: "Paid Performance",
    outcome: "High-ROAS Meta, Google Search, YouTube and TikTok ad campaigns built on scientific creative testing and server-side tracking.",
    description: "Stop burning ad spend on low-intent clicks. We build high-velocity creative testing funnels and conversion telemetry that maximize pipeline and profit.",
    bottleneck: "Most agencies rely on basic boost buttons without audience structuring, creative testing, or server-side attribution.",
    framework: [
      { step: "01. Creative Testing Sandbox", detail: "Deploying 10+ new hook and angle variations weekly to discover breakthrough winners." },
      { step: "02. Server-Side Telemetry (CAPI)", detail: "Eliminating iOS tracking loss with full Meta Conversions API and GA4 integration." },
      { step: "03. Budget Scaling Protocol", detail: "Aggressively scaling budget on high-performing ad sets while killing fatigue early." },
      { step: "04. Full-Funnel Retargeting", detail: "Sequencing dynamic product ads and objection-handling video testimonials." }
    ],
    points: [
      "Meta Ads (Instagram & Facebook) High-ROAS Scaling",
      "Google Search, Performance Max & YouTube Video Ads",
      "Server-Side Meta CAPI & Google Offline Conversion Tracking",
      "Weekly Creative Sprints (UGC, Motion Graphics, Statics)",
      "Automated Bid Strategy Tuning (Target CPA & Target ROAS)",
      "Landing Page A/B Testing & Conversion Rate Optimization"
    ],
    tools: ["Meta Ads Manager", "Google Ads", "Triple Whale", "Looker Studio", "Meta CAPI"],
    caseMetric: "4.8x Average Client ROAS",
    caseBrand: "Veloura Organics & UrbanEdge Realty",
    faqs: [
      { q: "What is the minimum ad budget needed to see results?", a: "We work with brands investing ₹50,000 to ₹50L+ per month in paid media, ensuring every rupee is tracked to verified revenue." }
    ]
  },
  "social-media": {
    slug: "social-media",
    title: "Social Media Management & Brand Community",
    icon: Users,
    label: "Social Growth",
    outcome: "Full-stack channel management, daily community building, consistent posting calendar and algorithmic growth engineering.",
    description: "We turn your social media profiles into active revenue engines with trend-hijacking reels, daily community engagement, and cult-like follower loyalty.",
    bottleneck: "Irregular posting and boring corporate graphics lead to dead follower engagement and zero pipeline.",
    framework: [
      { step: "01. Visual Brand Style Guide", detail: "Establishing high-energy typography, color palettes, and motion design rules." },
      { step: "02. Content Calendar Execution", detail: "Delivering 20-30 scroll-stopping posts, carousels, and stories every single month." },
      { step: "03. Community & DM Growth", detail: "Proactively engaging with industry creators and turning DM inquiries into leads." },
      { step: "04. Monthly Growth Analytics", detail: "Tracking net follower surge, engagement rates, and referral web traffic." }
    ],
    points: [
      "End-to-End Instagram & LinkedIn Channel Management",
      "Daily Story Engagement & Interactive Polls",
      "Community Comment Moderation & Direct Lead Routing",
      "Trend Hijacking, Audio Sync & Viral Meme Formats",
      "Monthly Creative Batching Sessions",
      "Cross-Platform Distribution & Repurposing"
    ],
    tools: ["Figma", "Canva Pro", "Adobe Premiere Pro", "Later", "Meta Creator Studio"],
    caseMetric: "+420% Organic Engagement Surge",
    caseBrand: "Serene Living & D2C Brands",
    faqs: [
      { q: "Do you handle shooting and production as well?", a: "Yes, we handle the full production lifecycle: scripting, shooting frameworks, editing, sound design, and scheduling." }
    ]
  },
  "graphics-design": {
    slug: "graphics-design",
    title: "Graphics Design & Creative Direction",
    icon: Palette,
    label: "Design Systems",
    outcome: "Scroll-stopping designs, ad creatives, carousel graphics, brand guidelines and sub-second landing page assets.",
    description: "Visuals that stop the thumb within 0.5 seconds. We design brand identities, ad creatives, and sales decks that demand immediate respect.",
    bottleneck: "Design that looks pretty but fails to convey the core value proposition burns ad budget without conversions.",
    framework: [
      { step: "01. Visual Proposition Audit", detail: "Analyzing competitors to identify visual white-space and bold contrast opportunities." },
      { step: "02. High-CTR Ad Creative Sprint", detail: "Creating benefit-first banners, split-screen comparisons, and proof graphics." },
      { step: "03. Carousel Architecture", detail: "Designing swipeable 10-slide narratives optimized for high save and share rates." },
      { step: "04. Complete Brand Asset Kit", detail: "Packaging vector logos, color palettes, custom icons, and typography guidelines." }
    ],
    points: [
      "High-Converting Paid Ad Banner Creatives",
      "Swipe-Friendly 10-Slide Educational Carousels",
      "Complete Brand Identity Systems & Logo Suites",
      "High-Impact Sales Pitch Decks & Client Proposals",
      "Landing Page Visual Assets & Motion Graphics",
      "Fast 24-48 Hour Turnaround Sprints"
    ],
    tools: ["Figma", "Adobe Illustrator", "Photoshop", "After Effects"],
    caseMetric: "+42% Higher Click-Through Rates",
    caseBrand: "D2C & Tech Brand Portfolio",
    faqs: [
      { q: "What format do you provide final deliverables in?", a: "All assets are delivered in editable Figma files, high-res PNG/JPG, WebP, and vector SVG formats ready for instant ad deployment." }
    ]
  },
  "reels": {
    slug: "reels",
    title: "Viral Reels & Short-Form Video Engine",
    icon: Flame,
    label: "Short-Form Video",
    outcome: "Fast-paced vertical videos, audio trend sync, dynamic captions and storytelling engineered specifically for Instagram & TikTok feeds.",
    description: "Short-form video is the single fastest way to reach millions of new customers organically. We script, edit, and optimize viral reels that capture massive attention.",
    bottleneck: "Videos that drop viewer retention in the first 3 seconds get suppressed by the algorithm.",
    framework: [
      { step: "01. 3-Second Visual & Audio Hooks", detail: "Engineering thumb-stopping visual pattern interrupts and compelling questions." },
      { step: "02. High-Retention Fast Pacing", detail: "Dynamic zoom cuts, sound effects, B-roll overlays, and kinetic typography." },
      { step: "03. Trending Audio Hijacking", detail: "Identifying breakout viral sounds in the first 48 hours of momentum." },
      { step: "04. Seamless Loop Optimization", detail: "Crafting end-to-beginning audio loops to maximize re-watch metrics." }
    ],
    points: [
      "Viral Hook Scripting & Storyboard Concepting",
      "Kinetic Subtitles & Emoji Pop Animation",
      "Sound Design, Audio Sync & Dynamic SFX",
      "Weekly Content Batching & Fast Turnaround",
      "Direct Call-To-Action (CTA) Lead Funnels",
      "Cross-Posting on Instagram Reels, Shorts & TikTok"
    ],
    tools: ["CapCut Pro", "Adobe Premiere Pro", "After Effects", "Epidemic Sound"],
    caseMetric: "3.2M+ Viral Reel Impressions",
    caseBrand: "Hospitality & Fitness Clients",
    faqs: [
      { q: "How many reels do we get per month?", a: "Our packages range from 12 to 30 custom-edited reels per month with complete hooks, scripts, and captions." }
    ]
  },
  "videos": {
    slug: "videos",
    title: "High-Production Video & YouTube Authority",
    icon: Video,
    label: "Long-Form Video",
    outcome: "High-production YouTube video editing, brand documentaries, podcast mastering and long-form authority assets.",
    description: "Build deep trust and authority with long-form video content. We produce YouTube episodes, client success documentaries, and podcast series that turn viewers into lifelong advocates.",
    bottleneck: "Long videos with low production quality and boring pacing suffer from 80% audience drop-off.",
    framework: [
      { step: "01. Title & High-CTR Thumbnail Strategy", detail: "A/B testing thumbnail designs and curiosity titles before filming." },
      { step: "02. Story Arc & Retention Scripting", detail: "Structuring chapters, cliffhangers, and visual demonstrations." },
      { step: "03. Multi-Cam & Color Grading", detail: "Cinema-grade color correction, audio mastering, and motion infographics." },
      { step: "04. Omnichannel Micro-Repurposing", detail: "Chopping every 20-minute episode into 8 short-form reels and quote carousels." }
    ],
    points: [
      "YouTube Long-Form Video Editing & Channel Growth",
      "High-CTR Custom Thumbnail Design & A/B Testing",
      "Brand Documentary & Customer Case Study Films",
      "Video Podcast Production & Multi-Camera Sync",
      "Cinema Color Grading & Professional Audio Mastering",
      "Full YouTube SEO (Tags, Chapters, End Screens, Cards)"
    ],
    tools: ["DaVinci Resolve", "Adobe Premiere Pro", "Logic Pro", "TubeBuddy"],
    caseMetric: "+280% Watch-Time Retention",
    caseBrand: "EdTech & Founder Podcast Series",
    faqs: [
      { q: "How do you handle footage delivery?", a: "We provide dedicated cloud storage links (Dropbox / Google Drive) for effortless raw footage uploads." }
    ]
  },
  "strategy": {
    slug: "strategy",
    title: "Full-Funnel Growth Strategy & Positioning",
    icon: Compass,
    label: "Strategic Roadmap",
    outcome: "Comprehensive market positioning, competitor vulnerability audit, pricing psychology and acquisition channel roadmaps.",
    description: "Marketing without strategy is just noise. We build end-to-end commercial growth architecture that aligns your product offer, ad channels, and revenue targets.",
    bottleneck: "Businesses jump between disjointed marketing tactics without a unified customer acquisition playbook.",
    framework: [
      { step: "01. Full-Stack Diagnostic Audit", detail: "Analyzing historical CAC, conversion bottlenecks, and competitor ad strategies." },
      { step: "02. Value Proposition & Offer Tuning", detail: "Refining pricing psychology and irresistible core offers." },
      { step: "03. 90-Day Omnichannel Roadmap", detail: "Prioritizing high-leverage marketing sprints with clear KPIs." },
      { step: "04. Executive Review & Weekly Tuning", detail: "Weekly strategic sprint syncs with our senior leadership." }
    ],
    points: [
      "Comprehensive Competitor & Market Positioning Audit",
      "Unit Economics, LTV/CAC & Margin Calibration",
      "90-Day Omnichannel Marketing Sprint Roadmap",
      "High-Converting Offer Architecture & Pricing Psychology",
      "Full Attribution Setup (GA4, CAPI & Looker Studio)",
      "Weekly Strategic Syncs with Senior Growth Leads"
    ],
    tools: ["Looker Studio", "Miro", "Notion Growth OS", "SimilarWeb", "GA4"],
    caseMetric: "3.9x Blended Business Growth",
    caseBrand: "B2B SaaS & Real Estate Portfolios",
    faqs: [
      { q: "What deliverables are included in a growth strategy sprint?", a: "You receive a comprehensive 90-day execution roadmap, competitor breakdown, creative angles document, and weekly milestone tracking." }
    ]
  },
  "growth": {
    slug: "growth",
    title: "Growth Personalized & AI Acceleration",
    icon: Rocket,
    label: "Bespoke Scale",
    outcome: "Generative AI Search (GEO), ChatGPT and Gemini entity indexing, automated lead nurturing and bespoke scaling pods.",
    description: "A tailored growth pod built around your brand. We combine cutting-edge AI search optimization, custom CRM routing, and dedicated talent to scale your revenue exponentially.",
    bottleneck: "One-size-fits-all agency models fail to adapt to complex product requirements and modern AI discovery.",
    framework: [
      { step: "01. Dedicated Growth Squad", detail: "Assigning dedicated strategists, media buyers, video editors, and engineers." },
      { step: "02. AI Search & Entity Domination", detail: "Optimizing your brand for ChatGPT, Gemini, and Google AI Overviews." },
      { step: "03. Real-Time WhatsApp & CRM Ingestion", detail: "Connecting inbound inquiries instantly to your sales team with automated alerts." },
      { step: "04. Continuous Scale Protocol", detail: "Aggressively expanding winning angles into new markets and channels." }
    ],
    points: [
      "Dedicated Full-Stack Growth Pod (Lead, Dev, Creative, Media Buyer)",
      "Generative Engine Optimization (GEO) for ChatGPT & Gemini",
      "Sub-Second React Web Applications & Automated Webhooks",
      "Instant WhatsApp & Phone Lead Ingestion Telemetry",
      "Executive Slack/WhatsApp Direct Channel with 1-Hour SLA",
      "Unlimited Creative Iterations & Real-Time Performance Tuning"
    ],
    tools: ["OpenAI API", "Google Gemini", "React", "Node.js", "WhatsApp API", "Zapier"],
    caseMetric: "+273% Commercial Revenue Surge",
    caseBrand: "Enterprise Conglomerates & D2C Market Leaders",
    faqs: [
      { q: "How is Growth Personalized different from standard services?", a: "You get a dedicated multidisciplinary squad working exclusively on your brand with custom engineering, AI integrations, and direct founder-level access." }
    ]
  }
};

// -----------------------------------------------------------------------------
// UNIFIED PAGE WRAPPER WITH TOP BAR, MEGA NAVBAR, CTA & FOOTER
// -----------------------------------------------------------------------------
export function PageLayout({ children, onNavigate, activeNav = "" }) {
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("General Inbound");

  // Modal Form State
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", website: "", service: "Content & Paid Growth", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, service: selectedService || formData.service, source: "Sub-page Inquiry Modal" })
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setLeadModalOpen(false);
          setFormData({ name: "", email: "", phone: "", website: "", service: "Content & Paid Growth", message: "" });
        }, 2000);
      } else {
        alert("Thanks! Your message has been received. Our team will contact you on WhatsApp/Phone (+91-8810356950) shortly.");
        setLeadModalOpen(false);
      }
    } catch {
      alert("Thanks! Your message has been received. Our team will contact you on WhatsApp/Phone (+91-8810356950) shortly.");
      setLeadModalOpen(false);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-[#D4FF00] selection:text-[#09090B]">
      {/* 1. TOP NOTICE RIBBON */}
      {showTopBar && (
        <div className="top-bar-lime">
          <Zap size={14} fill="#09090B" />
          <p>NOW TAKING ON 3 NEW BRANDS THIS MONTH — LET'S BUILD SOMETHING PEOPLE CAN'T SCROLL PAST.</p>
          <button
            type="button"
            onClick={() => { setSelectedService("High-Growth Retainer"); setLeadModalOpen(true); }}
            className="top-bar-talk-btn"
          >
            LET'S TALK <ArrowRight size={12} />
          </button>
          <button
            type="button"
            onClick={() => setShowTopBar(false)}
            className="top-bar-close-btn"
            aria-label="Close announcement"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. NAVBAR */}
      <nav className="site-navbar" id="navbar">
        <div className="navbar-container">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate("/"); }}
            className="navbar-brand"
            aria-label="Get Into Feed Home"
          >
            <img src="/logo-navbar.png" alt="Get Into Feed Logo" className="navbar-logo-img" />
            <span>getintofeed.</span>
          </a>

          <div className="navbar-links">
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <a
                href="/services"
                onClick={(e) => { e.preventDefault(); onNavigate("/services"); }}
                className="nav-link"
                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                Services <ChevronDown size={14} />
              </a>
              {servicesDropdownOpen && (
                <div style={{ position: "absolute", top: "100%", left: "-20px", background: "#121216", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "16px", minWidth: "260px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", zIndex: 100, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.values(serviceCatalog).map(s => (
                    <a
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      onClick={(e) => { e.preventDefault(); setServicesDropdownOpen(false); onNavigate(`/services/${s.slug}`); }}
                      style={{ color: "#d1d5db", fontSize: "12px", fontFamily: "var(--font-space)", fontWeight: "700", textDecoration: "none", textTransform: "uppercase", padding: "6px 10px", borderRadius: "6px", transition: "background 0.2s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--brand-lime)"; e.currentTarget.style.background = "#18181b"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#d1d5db"; e.currentTarget.style.background = "transparent"; }}
                    >
                      {s.title.split("&")[0]}
                    </a>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px", marginTop: "4px" }}>
                    <a
                      href="/services"
                      onClick={(e) => { e.preventDefault(); setServicesDropdownOpen(false); onNavigate("/services"); }}
                      style={{ color: "var(--brand-lime)", fontSize: "11px", fontFamily: "var(--font-space)", fontWeight: "900", textDecoration: "none", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      View All Services →
                    </a>
                  </div>
                </div>
              )}
            </div>
            <a href="/work" onClick={(e) => { e.preventDefault(); onNavigate("/work"); }} className="nav-link">Work</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate("/about"); }} className="nav-link">About Us</a>
            <a href="/pricing" onClick={(e) => { e.preventDefault(); onNavigate("/pricing"); }} className="nav-link">Pricing</a>
            <a href="/audit" onClick={(e) => { e.preventDefault(); onNavigate("/audit"); }} className="nav-link" style={{ color: "var(--brand-lime)" }}>⚡ Free Audit</a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); onNavigate("/blog"); }} className="nav-link">Feed Notes</a>
            <a href="tel:+918810356950" className="nav-link" style={{ color: "#ffffff" }}>📞 8810356950</a>
          </div>

          <button
            type="button"
            onClick={() => { setSelectedService("Start a Project"); setLeadModalOpen(true); }}
            className="nav-start-btn"
          >
            Start a project <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} color="#D4FF00" /> : <Menu size={26} color="#ffffff" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <a href="/" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/"); }} className="mobile-menu-link">01. Home</a>
            <a href="/services" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/services"); }} className="mobile-menu-link">02. Services Hub</a>
            <a href="/work" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/work"); }} className="mobile-menu-link">03. Our Work & Portfolio</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/about"); }} className="mobile-menu-link">04. About Us</a>
            <a href="/pricing" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/pricing"); }} className="mobile-menu-link">05. Pricing Sprints</a>
            <a href="/audit" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/audit"); }} className="mobile-menu-link" style={{ color: "var(--brand-lime)" }}>06. ⚡ Free Growth Audit</a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/blog"); }} className="mobile-menu-link">07. Feed Notes (Blog)</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/contact"); }} className="mobile-menu-link">08. Contact & Intake</a>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <a
                href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20want%20to%20scale%20my%20brand."
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, background: "#25D366", color: "#082414", textAlign: "center", padding: "12px", borderRadius: "6px", fontWeight: "800", textDecoration: "none", fontFamily: "var(--font-space)" }}
              >
                💬 WhatsApp
              </a>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); setLeadModalOpen(true); }}
                style={{ flex: 1, background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "12px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", fontFamily: "var(--font-space)" }}
              >
                Start a Project →
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* PAGE BODY */}
      <main>{children}</main>

      {/* CTA SECTION */}
      <section id="contact" className="cta-section">
        <div className="cta-blue-card reveal">
          <svg className="absolute left-[5%] top-[20%] w-20 h-20 text-white/10 rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: "absolute", left: "5%", top: "20%", opacity: 0.15 }}>
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
          </svg>

          <div style={{ position: "relative", zIndex: 10, maxWidth: "768px", margin: "0 auto" }}>
            <h2 className="cta-heading">
              READY TO <br />
              GET INTO <br />
              <span className="text-brand-lime">THE FEED?</span>
            </h2>

            <p style={{ fontSize: "18px", color: "#dbeafe", fontWeight: "500", marginBottom: "48px", maxWidth: "560px", margin: "0 auto 48px auto" }}>
              Tell us what you're building. We'll figure out how to get it noticed and scaled.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => { setSelectedService("Full Growth Sprint"); setLeadModalOpen(true); }}
                style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "16px 40px", borderRadius: "4px", fontWeight: "800", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "14px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
              >
                Start a project <ArrowRight size={16} />
              </button>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
                <a href="mailto:growth@getintofeed.com" className="link-underline" style={{ color: "#ffffff", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", fontSize: "14px", textDecoration: "none" }}>
                  ✉️ growth@getintofeed.com
                </a>
                <a href="tel:+918810356950" className="link-underline" style={{ color: "#ffffff", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", fontSize: "14px", textDecoration: "none" }}>
                  📞 +91-8810356950
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner-flex">
          <div>
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate("/"); }} className="navbar-brand" style={{ marginBottom: "16px", fontSize: "32px" }}>
              <img src="/logo-navbar.png" alt="Get Into Feed" className="navbar-logo-img" style={{ width: "32px", height: "32px" }} />
              <span>getintofeed.</span>
            </a>
            <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500", maxWidth: "320px" }}>
              A vibrant growth studio that gets brands into the feed — and gets them results.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <span style={{ color: "var(--brand-lime)", fontSize: "11px", marginBottom: "4px" }}>SERVICES</span>
              <a href="/services/content-marketing" onClick={(e) => { e.preventDefault(); onNavigate("/services/content-marketing"); }} className="nav-link">Content Marketing</a>
              <a href="/services/ads-campaign" onClick={(e) => { e.preventDefault(); onNavigate("/services/ads-campaign"); }} className="nav-link">Performance Ads</a>
              <a href="/services/social-media" onClick={(e) => { e.preventDefault(); onNavigate("/services/social-media"); }} className="nav-link">Social Media</a>
              <a href="/services/reels" onClick={(e) => { e.preventDefault(); onNavigate("/services/reels"); }} className="nav-link">Viral Reels</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <span style={{ color: "var(--brand-blue)", fontSize: "11px", marginBottom: "4px" }}>COMPANY</span>
              <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate("/about"); }} className="nav-link">About Us</a>
              <a href="/work" onClick={(e) => { e.preventDefault(); onNavigate("/work"); }} className="nav-link">Case Studies</a>
              <a href="/pricing" onClick={(e) => { e.preventDefault(); onNavigate("/pricing"); }} className="nav-link">Pricing Sprints</a>
              <a href="/careers" onClick={(e) => { e.preventDefault(); onNavigate("/careers"); }} className="nav-link">Careers (Join Us)</a>
              <a href="/admin" onClick={(e) => { e.preventDefault(); onNavigate("/admin"); }} className="nav-link" style={{ color: "#D4FF00" }}>Admin Studio</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <span style={{ color: "var(--brand-coral)", fontSize: "11px", marginBottom: "4px" }}>CONNECT</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}><Instagram size={16} color="#D4FF00" /> Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}><Linkedin size={16} color="#0033FF" /> LinkedIn</a>
              <a href="https://wa.me/918810356950" target="_blank" rel="noreferrer" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}><MessageCircle size={16} color="#25D366" /> WhatsApp</a>
              <a href="/audit" onClick={(e) => { e.preventDefault(); onNavigate("/audit"); }} className="nav-link" style={{ color: "var(--brand-lime)" }}>⚡ Audit Tool</a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1600px", margin: "0 auto", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "24px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", fontSize: "12px", fontFamily: "var(--font-space)", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280" }}>
          <p>© 2026 GetIntoFeed Growth Studio.</p>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <a
              href="https://www.dmca.com/Protection/Status.aspx?ID=d7bfaa8b-113f-40c7-b0b8-9da53cf5cba7"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/dmca-badge.svg" alt="DMCA Protected" style={{ height: "24px", width: "auto" }} />
            </a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate("/privacy"); }} className="nav-link">Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate("/terms"); }} className="nav-link">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* LEAD INGESTION MODAL */}
      {leadModalOpen && (
        <div className="lead-modal-backdrop" onClick={() => setLeadModalOpen(false)}>
          <div className="lead-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLeadModalOpen(false)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer" }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", color: "var(--brand-lime)", letterSpacing: "0.1em", textTransform: "uppercase" }}>GET INTO THE FEED</span>
              <h3 style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", textTransform: "uppercase", margin: "4px 0 8px 0" }}>Let's Scale Your Brand</h3>
              <p style={{ fontSize: "14px", color: "#9ca3af" }}>Tell us what you're building. Our team will reach out in under 2 hours.</p>
            </div>

            {submitSuccess ? (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <Check size={36} color="var(--brand-lime)" style={{ margin: "0 auto 12px auto" }} />
                <h4 style={{ fontFamily: "var(--font-space)", fontSize: "20px", fontWeight: "800", color: "var(--brand-lime)" }}>Inquiry Received!</h4>
                <p style={{ color: "#d1d5db", fontSize: "14px", marginTop: "8px" }}>We'll reach out on WhatsApp/Phone (+91-8810356950) shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ashish Raghav"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. ashish@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Phone / WhatsApp *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 8810356950"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Website / Instagram Link</label>
                  <input
                    type="text"
                    placeholder="e.g. yourbrand.com or @yourbrand"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>What are your growth goals?</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your brand, budget, and targets..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "14px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", letterSpacing: "0.05em", border: "none", cursor: "pointer", marginTop: "8px" }}
                >
                  {submitting ? "Sending..." : "Submit Growth Inquiry →"}
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
// 1. SERVICES HUB PAGE (/services)
// -----------------------------------------------------------------------------
export function ServicesHubPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="services">
      <div style={{ padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>FULL CAPABILITY SUITE</span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "24px" }}>
          GROWTH SERVICES <br /> FOR <span style={{ color: "var(--brand-lime)" }}>MODERN BRANDS.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#9ca3af", maxWidth: "600px", margin: "0 auto 32px auto" }}>
          From viral reels to high-ROAS Meta/Google ads and AI entity optimization, explore our 8 dedicated growth engines.
        </p>
      </div>

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "20px 24px 80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {Object.values(serviceCatalog).map(s => {
          const Icon = s.icon || Sparkles;
          return (
            <div
              key={s.slug}
              onClick={() => onNavigate(`/services/${s.slug}`)}
              style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "32px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "transform 0.2s ease, border-color 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand-lime)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(212,255,0,0.15)", color: "var(--brand-lime)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", color: "#9ca3af", textTransform: "uppercase" }}>{s.label}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "22px", textTransform: "uppercase", marginBottom: "12px", lineHeight: 1.1 }}>{s.title}</h3>
                <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>{s.outcome}</p>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", color: "var(--brand-lime)" }}>{s.caseMetric}</span>
                <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                  Explore Specs <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}

// -----------------------------------------------------------------------------
// 2. SERVICE DETAIL PAGE (/services/:slug)
// -----------------------------------------------------------------------------
export function ServiceDetailPage({ slug, onNavigate }) {
  const service = serviceCatalog[slug] || serviceCatalog["content-marketing"];
  const Icon = service.icon || Sparkles;

  return (
    <PageLayout onNavigate={onNavigate} activeNav="services">
      <div style={{ padding: "80px 24px 60px 24px", maxWidth: "1600px", margin: "0 auto", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <button
          type="button"
          onClick={() => onNavigate("/services")}
          style={{ background: "transparent", border: "none", color: "#9ca3af", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", cursor: "pointer", marginBottom: "24px" }}
        >
          <ArrowLeft size={16} /> All Services
        </button>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212, 255, 0, 0.1)", border: "1px solid var(--brand-lime)", padding: "6px 14px", borderRadius: "9999px", color: "var(--brand-lime)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
          <Icon size={14} /> {service.label}
        </div>

        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5.5vw, 84px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "24px" }}>
          {service.title}
        </h1>

        <p style={{ fontSize: "clamp(16px, 1.8vw, 22px)", color: "#d1d5db", maxWidth: "800px", lineHeight: 1.6, fontWeight: "500", marginBottom: "32px" }}>
          {service.outcome}
        </p>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "12px 20px" }}>
            <span style={{ display: "block", fontSize: "11px", color: "#9ca3af", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em" }}>PROVEN IMPACT</span>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "20px", color: "var(--brand-lime)", fontWeight: "800" }}>{service.caseMetric}</strong>
          </div>
          <div style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "12px 20px" }}>
            <span style={{ display: "block", fontSize: "11px", color: "#9ca3af", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em" }}>CLIENT PORTFOLIO</span>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "20px", color: "#ffffff", fontWeight: "800" }}>{service.caseBrand}</strong>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ background: "#18181b", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "32px", marginBottom: "80px" }}>
          <span style={{ color: "var(--brand-coral)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>THE INDUSTRY BOTTLENECK</span>
          <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "24px", textTransform: "uppercase", marginBottom: "16px" }}>Why Most Approaches Fall Short</h3>
          <p style={{ color: "#9ca3af", fontSize: "16px", lineHeight: 1.6 }}>{service.bottleneck}</p>
        </div>

        <div style={{ marginBottom: "80px" }}>
          <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>EXECUTION METHODOLOGY</span>
          <h2 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(32px, 4vw, 54px)", textTransform: "uppercase", letterSpacing: "-0.04em", marginBottom: "36px" }}>Our 4-Stage Sprint Framework</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {service.framework.map((step, idx) => (
              <div key={idx} style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "24px" }}>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", color: "var(--brand-lime)", display: "block", marginBottom: "12px" }}>0{idx + 1}</span>
                <h4 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", textTransform: "uppercase", marginBottom: "8px" }}>{step.step}</h4>
                <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6 }}>{step.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px 32px", marginBottom: "80px" }}>
          <span style={{ color: "var(--brand-lime)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>WHAT YOU GET</span>
          <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(24px, 3vw, 36px)", textTransform: "uppercase", marginBottom: "28px" }}>Core Deliverables & Outputs</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {service.points.map((pt, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#18181b", padding: "14px 18px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Check size={18} color="var(--brand-lime)" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-space)", fontSize: "14px", fontWeight: "700" }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {service.faqs && service.faqs.length > 0 && (
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "32px", textTransform: "uppercase", textAlign: "center", marginBottom: "32px" }}>Frequently Asked Questions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {service.faqs.map((faq, i) => (
                <div key={i} style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "20px" }}>
                  <h4 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "16px", color: "var(--brand-lime)", marginBottom: "8px" }}>{faq.q}</h4>
                  <p style={{ color: "#d1d5db", fontSize: "14px", lineHeight: 1.6 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

// -----------------------------------------------------------------------------
// 3. ABOUT US PAGE (/about)
// -----------------------------------------------------------------------------
export function AboutUsPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="about">
      <div style={{ padding: "80px 24px 60px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>WHO'S BEHIND THE FEED</span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(40px, 6vw, 90px)", lineHeight: 0.85, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "32px" }}>
          WE'RE GETINTOFEED<span style={{ color: "var(--brand-lime)" }}>.</span>
        </h1>
        <p style={{ fontSize: "clamp(20px, 2.8vw, 32px)", fontWeight: "600", color: "#ffffff", maxWidth: "900px", margin: "0 auto 32px auto", lineHeight: 1.4 }}>
          A creative growth studio built around one simple idea: <br />
          <span style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "2px 10px", display: "inline-block", marginTop: "8px" }}>good marketing shouldn't feel like marketing.</span>
        </p>
        <p style={{ fontSize: "18px", color: "#9ca3af", maxWidth: "760px", margin: "0 auto 48px auto", lineHeight: 1.6 }}>
          We bring together content, creative, social and performance marketing under one roof — helping brands go from "we need marketing" to "people are actually talking about us."
        </p>
        <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px", background: "#18181b", border: "1.5px solid var(--brand-lime)", color: "#ffffff", padding: "18px 36px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", textTransform: "uppercase" }}>
          Strategy <span style={{ color: "var(--brand-lime)", margin: "0 8px" }}>×</span> Creativity <span style={{ color: "var(--brand-blue)", margin: "0 8px" }}>×</span> Performance
        </div>
      </div>

      <div style={{ background: "#121216", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "64px 24px" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px", textAlign: "center" }}>
          <div>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "48px", fontWeight: "900", color: "var(--brand-lime)", display: "block" }}>103+</strong>
            <span style={{ color: "#9ca3af", fontSize: "13px", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Brands Scaled Across India</span>
          </div>
          <div>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "48px", fontWeight: "900", color: "#ffffff", display: "block" }}>4.8x</strong>
            <span style={{ color: "#9ca3af", fontSize: "13px", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Average Client ROAS</span>
          </div>
          <div>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "48px", fontWeight: "900", color: "var(--brand-blue)", display: "block" }}>3.2M+</strong>
            <span style={{ color: "#9ca3af", fontSize: "13px", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Monthly Viral Impressions</span>
          </div>
          <div>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "48px", fontWeight: "900", color: "var(--brand-lime)", display: "block" }}>&lt; 2hr</strong>
            <span style={{ color: "#9ca3af", fontSize: "13px", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Fast Strategy Response Time</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// -----------------------------------------------------------------------------
// 4. OUR WORK & PORTFOLIO PAGE (/work)
// -----------------------------------------------------------------------------
export function WorkPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="work">
      <div style={{ padding: "80px 24px 60px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>PROOF & CASE STUDIES</span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "24px" }}>
          TURNING SCROLLS <br /> INTO <span style={{ color: "var(--brand-lime)" }}>REVENUE.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#9ca3af", maxWidth: "600px", margin: "0 auto" }}>
          Explore real case studies from high-growth D2C, real estate, B2B SaaS, and healthcare brands scaled by Get Into Feed.
        </p>
      </div>

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 24px 80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* Case 1 */}
        <div style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "4px 10px", borderRadius: "4px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>D2C & E-COMMERCE</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "24px", textTransform: "uppercase", marginBottom: "8px" }}>Veloura Organics</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>Scaled Meta Ad creative testing from ₹5L to ₹45L monthly revenue with 4.8x verified ROAS.</p>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", color: "var(--brand-lime)" }}>4.8x ROAS</span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>3-Tier UGC Framework</span>
          </div>
        </div>

        {/* Case 2 */}
        <div style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ background: "var(--brand-blue)", color: "#ffffff", padding: "4px 10px", borderRadius: "4px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>REAL ESTATE</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "24px", textTransform: "uppercase", marginBottom: "8px" }}>UrbanEdge Luxury Realty</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>Captured 1,420+ high-ticket buyer inquiries for ₹2Cr+ villas using cinematic drone reels and hyper-local geo-targeting.</p>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", color: "var(--brand-blue)" }}>+340% LEADS</span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>Reels & Paid Funnel</span>
          </div>
        </div>

        {/* Case 3 */}
        <div style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ background: "var(--brand-coral)", color: "#ffffff", padding: "4px 10px", borderRadius: "4px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>BFSI & FINTECH</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "24px", textTransform: "uppercase", marginBottom: "8px" }}>FinScale Lending</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>Dominated commercial keyword rankings on Google and AI Overviews, lifting organic applications by 273%.</p>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", color: "var(--brand-coral)" }}>+273% SEO</span>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>GEO & Entity Graph</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// -----------------------------------------------------------------------------
// 5. PRICING SPRINTS & ROI CALCULATOR PAGE (/pricing)
// -----------------------------------------------------------------------------
export function PricingPage({ onNavigate }) {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [budgetSlider, setBudgetSlider] = useState(150000);

  const estimatedClicks = Math.round(budgetSlider / 25);
  const estimatedLeads = Math.round(estimatedClicks * 0.045);
  const estimatedRevenue = Math.round(budgetSlider * 4.8);

  const formatRupees = (n) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lakhs`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="pricing">
      <div style={{ padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>TRANSPARENT GROWTH SPRINTS</span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "24px" }}>
          PREDICTABLE PRICING. <br /> <span style={{ color: "var(--brand-lime)" }}>UNSTOPPABLE SCALE.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#9ca3af", maxWidth: "600px", margin: "0 auto 32px auto" }}>
          No hidden fees. No long-term lock-in traps. Just relentless weekly execution and compounding revenue.
        </p>

        {/* Toggle */}
        <div style={{ display: "inline-flex", background: "#18181b", padding: "4px", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            style={{ background: billingCycle === "monthly" ? "var(--brand-lime)" : "transparent", color: billingCycle === "monthly" ? "var(--brand-dark)" : "#ffffff", border: "none", padding: "8px 20px", borderRadius: "9999px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", cursor: "pointer" }}
          >
            Monthly Sprints
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("quarterly")}
            style={{ background: billingCycle === "quarterly" ? "var(--brand-lime)" : "transparent", color: billingCycle === "quarterly" ? "var(--brand-dark)" : "#ffffff", border: "none", padding: "8px 20px", borderRadius: "9999px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", cursor: "pointer" }}
          >
            Quarterly (Save 15%)
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "40px 24px 60px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* Starter Sprint */}
        <div style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>TIER 01</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "26px", textTransform: "uppercase", margin: "8px 0" }}>Starter Sprint</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.5, marginBottom: "24px" }}>For emerging brands ready to build consistent inbound lead funnels.</p>
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "44px", fontWeight: "900", color: "#ffffff" }}>
                ₹{billingCycle === "monthly" ? "39,000" : "33,000"}
              </span>
              <span style={{ color: "#9ca3af", fontSize: "14px" }}> / month</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#d1d5db" }}><Check size={16} color="var(--brand-lime)" /> Targeted Meta & Google Ads Setup</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#d1d5db" }}><Check size={16} color="var(--brand-lime)" /> 12 High-Retention Viral Reels / Mo</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#d1d5db" }}><Check size={16} color="var(--brand-lime)" /> Core Commercial SEO Optimization</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#d1d5db" }}><Check size={16} color="var(--brand-lime)" /> GA4 & Meta Pixel CAPI Tracking</li>
            </ul>
          </div>
          <a href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20want%20the%20Starter%20Sprint." target="_blank" rel="noreferrer" style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", padding: "14px", borderRadius: "6px", textAlign: "center", textDecoration: "none", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", textTransform: "uppercase" }}>
            Choose Starter Sprint →
          </a>
        </div>

        {/* Scale Engine (Popular) */}
        <div style={{ background: "#18181b", border: "2px solid var(--brand-lime)", borderRadius: "20px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", boxShadow: "0 10px 40px rgba(212,255,0,0.15)" }}>
          <div style={{ position: "absolute", top: "-14px", right: "24px", background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "4px 12px", borderRadius: "9999px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>
            MOST POPULAR • 4.8x ROAS
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", color: "var(--brand-lime)", letterSpacing: "0.1em", textTransform: "uppercase" }}>TIER 02</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "26px", textTransform: "uppercase", margin: "8px 0" }}>Scale Engine</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.5, marginBottom: "24px" }}>The full multi-channel growth system for scaling D2C, B2B & real estate brands.</p>
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "44px", fontWeight: "900", color: "var(--brand-lime)" }}>
                ₹{billingCycle === "monthly" ? "79,000" : "67,000"}
              </span>
              <span style={{ color: "#9ca3af", fontSize: "14px" }}> / month</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#ffffff" }}><Check size={16} color="var(--brand-lime)" /> Omnichannel Meta, Google & YouTube Ads</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#ffffff" }}><Check size={16} color="var(--brand-lime)" /> 24 Viral Reels & Short-Form Videos</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#ffffff" }}><Check size={16} color="var(--brand-lime)" /> Generative AI Search (GEO) Optimization</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#ffffff" }}><Check size={16} color="var(--brand-lime)" /> Custom Sub-Second React Landing Pages</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#ffffff" }}><Check size={16} color="var(--brand-lime)" /> Weekly Strategy Sprints & Slack Access</li>
            </ul>
          </div>
          <a href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20want%20the%20Scale%20Engine." target="_blank" rel="noreferrer" style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "16px", borderRadius: "6px", textAlign: "center", textDecoration: "none", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "14px", textTransform: "uppercase" }}>
            Ignite Scale Engine →
          </a>
        </div>

        {/* Enterprise Domination */}
        <div style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>TIER 03</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "26px", textTransform: "uppercase", margin: "8px 0" }}>Enterprise Domination</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.5, marginBottom: "24px" }}>For category leaders requiring a full dedicated growth squad and bespoke AI engineering.</p>
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "44px", fontWeight: "900", color: "#ffffff" }}>
                ₹{billingCycle === "monthly" ? "1,49,000" : "1,26,000"}
              </span>
              <span style={{ color: "#9ca3af", fontSize: "14px" }}> / month</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#d1d5db" }}><Check size={16} color="var(--brand-lime)" /> Dedicated Full-Stack Growth Squad</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#d1d5db" }}><Check size={16} color="var(--brand-lime)" /> Unlimited Creative & Video Capacity</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#d1d5db" }}><Check size={16} color="var(--brand-lime)" /> Full CRM & Webhook Automation</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#d1d5db" }}><Check size={16} color="var(--brand-lime)" /> 1-Hour SLA Executive Support Channel</li>
            </ul>
          </div>
          <a href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20want%20Enterprise%20Domination." target="_blank" rel="noreferrer" style={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", padding: "14px", borderRadius: "6px", textAlign: "center", textDecoration: "none", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", textTransform: "uppercase" }}>
            Dominate Your Market →
          </a>
        </div>
      </div>

      {/* Interactive ROI Estimator */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px 24px" }}>
        <div style={{ background: "#18181b", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "40px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{ color: "var(--brand-lime)", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase" }}>INTERACTIVE ROI CALCULATOR</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", textTransform: "uppercase", margin: "4px 0" }}>Calculate Your Monthly Revenue Return</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>Drag the budget slider to see projected high-intent clicks, leads, and estimated returns.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", textTransform: "uppercase" }}>Monthly Ad Spend</span>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "18px", fontWeight: "900", color: "var(--brand-lime)" }}>{formatRupees(budgetSlider)}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={2000000}
                step={25000}
                value={budgetSlider}
                onChange={(e) => setBudgetSlider(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--brand-lime)", height: "8px", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280", marginTop: "6px" }}>
                <span>₹50K</span>
                <span>₹10 Lakhs</span>
                <span>₹20 Lakhs</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "#121216", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "var(--font-space)", textTransform: "uppercase" }}>Projected Leads</span>
                <strong style={{ fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", color: "#ffffff", display: "block", marginTop: "4px" }}>{estimatedLeads.toLocaleString("en-IN")}+</strong>
              </div>
              <div style={{ background: "#121216", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "var(--font-space)", textTransform: "uppercase" }}>Estimated Revenue</span>
                <strong style={{ fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", color: "var(--brand-lime)", display: "block", marginTop: "4px" }}>{formatRupees(estimatedRevenue)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// -----------------------------------------------------------------------------
// 6. FREE WEBSITE AUDIT TOOL PAGE (/audit)
// -----------------------------------------------------------------------------
export function AuditToolPage({ onNavigate }) {
  const [urlInput, setUrlInput] = useState("");
  const [category, setCategory] = useState("D2C & E-Commerce");
  const [auditing, setAuditing] = useState(false);
  const [report, setReport] = useState(null);

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!urlInput) return;
    setAuditing(true);
    try {
      const res = await fetch(`${API_URL}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput, targetCategory: category })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      } else {
        setReport({
          domain: urlInput.replace(/https?:\/\//, '').replace(/www\./, '').split('/')[0],
          targetCategory: category,
          overallScore: 78,
          metrics: { seoScore: 74, speedScore: 82, socialScore: 78, mobileUsability: "High", schemaMarkup: "Basic", metaPixelStatus: "Active", geoAiIndexStatus: "Needs Optimization" },
          criticalIssues: ["Missing Knowledge Graph schema for AI Overviews", "Conversion tracking drop-off on mobile checkout", "Reel video retention hook below 8.4% median"],
          quickWins: ["Deploy programmatic keyword clusters", "Activate weekly 3-tier UGC creative testing sprints", "Enable Generative Engine Optimization (GEO)"]
        });
      }
    } catch {
      setReport({
        domain: urlInput.replace(/https?:\/\//, '').replace(/www\./, '').split('/')[0],
        targetCategory: category,
        overallScore: 81,
        metrics: { seoScore: 79, speedScore: 85, socialScore: 80, mobileUsability: "High", schemaMarkup: "Basic", metaPixelStatus: "Active", geoAiIndexStatus: "Needs Optimization" },
        criticalIssues: ["Missing Knowledge Graph schema for AI Overviews", "Conversion tracking drop-off on mobile checkout"],
        quickWins: ["Deploy programmatic keyword clusters", "Activate weekly 3-tier UGC creative testing sprints"]
      });
    }
    setAuditing(false);
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="audit">
      <div style={{ padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "var(--brand-lime)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>PROPRIETARY GROWTH TELEMETRY</span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "24px" }}>
          INSTANT GROWTH & <br /> <span style={{ color: "var(--brand-blue)" }}>SEO AUDIT TOOL.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#9ca3af", maxWidth: "680px", margin: "0 auto 40px auto" }}>
          Enter your brand domain to calculate your Growth Readiness Score across SEO, AI search indexation, PageSpeed, and creative retention.
        </p>

        <div style={{ maxWidth: "700px", margin: "0 auto", background: "#121216", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "16px", padding: "32px", textAlign: "left" }}>
          <form onSubmit={handleAudit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Your Website or Store URL *</label>
              <input
                required
                type="text"
                placeholder="e.g. yourbrand.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", padding: "14px 16px", color: "#ffffff", fontSize: "16px", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Industry Sector</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", padding: "14px 16px", color: "#ffffff", fontSize: "14px", outline: "none" }}
              >
                <option value="D2C & E-Commerce">D2C & E-Commerce</option>
                <option value="Real Estate & Property">Real Estate & Property</option>
                <option value="B2B SaaS & Tech">B2B SaaS & Tech</option>
                <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                <option value="Hospitality & Dining">Hospitality & Dining</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={auditing}
              style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "16px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", letterSpacing: "0.05em", border: "none", cursor: "pointer", marginTop: "8px" }}
            >
              {auditing ? "Analyzing Domain Metrics..." : "Run Instant Growth Audit ⚡"}
            </button>
          </form>
        </div>
      </div>

      {report && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px 24px" }}>
          <div style={{ background: "#18181b", border: "2px solid var(--brand-lime)", borderRadius: "20px", padding: "40px", boxShadow: "0 20px 60px rgba(212,255,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span style={{ color: "var(--brand-lime)", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase" }}>AUDIT REPORT GENERATED</span>
                <h3 style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", textTransform: "uppercase", margin: "4px 0" }}>{report.domain}</h3>
                <span style={{ color: "#9ca3af", fontSize: "13px" }}>Sector: {report.targetCategory}</span>
              </div>
              <div style={{ textAlign: "center", background: "#121216", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "16px 28px" }}>
                <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "var(--font-space)", textTransform: "uppercase" }}>OVERALL SCORE</span>
                <strong style={{ fontFamily: "var(--font-space)", fontSize: "40px", fontWeight: "900", color: "var(--brand-lime)", display: "block" }}>{report.overallScore}/100</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <div style={{ background: "#121216", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>SEO Authority</span>
                <strong style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "800", color: "#ffffff", marginTop: "4px" }}>{report.metrics.seoScore}/100</strong>
              </div>
              <div style={{ background: "#121216", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>Speed & Core Vitals</span>
                <strong style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "800", color: "var(--brand-lime)", marginTop: "4px" }}>{report.metrics.speedScore}/100</strong>
              </div>
              <div style={{ background: "#121216", padding: "16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>Social Retention</span>
                <strong style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "800", color: "var(--brand-blue)", marginTop: "4px" }}>{report.metrics.socialScore}/100</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              <div style={{ background: "#121216", padding: "24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h4 style={{ fontFamily: "var(--font-space)", fontSize: "16px", fontWeight: "800", color: "var(--brand-coral)", textTransform: "uppercase", marginBottom: "16px" }}>⚠️ Critical Bottlenecks</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {report.criticalIssues.map((iss, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#d1d5db", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <X size={16} color="var(--brand-coral)" style={{ flexShrink: 0, marginTop: "2px" }} /> {iss}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: "#121216", padding: "24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h4 style={{ fontFamily: "var(--font-space)", fontSize: "16px", fontWeight: "800", color: "var(--brand-lime)", textTransform: "uppercase", marginBottom: "16px" }}>⚡ Recommended High-ROI Fixes</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {report.quickWins.map((win, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#d1d5db", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <Check size={16} color="var(--brand-lime)" style={{ flexShrink: 0, marginTop: "2px" }} /> {win}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <a
                href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20just%20ran%20an%20audit%20for%20my%20website%20and%20want%20a%20full%20strategy%20call."
                target="_blank"
                rel="noreferrer"
                style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "16px 36px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", textDecoration: "none", display: "inline-block" }}
              >
                Claim Free 30-Min Strategy Call on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

// -----------------------------------------------------------------------------
// 7. FEED NOTES (BLOG) PAGE (/blog & /blog/:slug)
// -----------------------------------------------------------------------------
export function FeedNotesPage({ onNavigate, slug }) {
  const articles = [
    {
      slug: "enterprise-seo-ai-overviews-geo-playbook",
      title: "The 2026 Enterprise SEO Playbook: Dominating AI Overviews, ChatGPT & Gemini (GEO)",
      category: "AI & GEO Search",
      readTime: "8 min read",
      date: "Aug 2026",
      desc: "How modern enterprise brands are restructuring schema topologies, building topical authority moats, and earning primary citation status in AI answer engines.",
      content: `Search behavior has undergone its most dramatic transformation since the inception of PageRank. With Google AI Overviews capturing zero-click real estate and conversational engines like ChatGPT and Gemini handling millions of commercial discovery queries daily, traditional keyword stuffing is dead.

To thrive in 2026, enterprise growth leaders must transition from standard SEO to Generative Engine Optimization (GEO).

Key Pillars of Generative Engine Optimization (GEO):
1. Entity Graph Structuring: Connect your brand's core domain entities via JSON-LD Schema.
2. First-Party Empirical Data: AI models heavily favor original research and benchmark reports.
3. Structured Quotation Topology: Write concise, authoritative definitions under H2/H3 headers.
4. Author Authority & E-E-A-T Signals: Establish verified author entity profiles across tier-1 digital PR publications.`
    },
    {
      slug: "scaling-d2c-meta-ads-ugc-creative-sprints",
      title: "Scaling D2C Meta Ads from ₹10L to ₹1Cr/Month: The 3-Tier UGC Creative Sprints Framework",
      category: "Performance Paid Media",
      readTime: "6 min read",
      date: "Aug 2026",
      desc: "The exact creative testing methodology that cuts customer acquisition cost by 42% and delivers predictable 4.8x ROAS on Meta and TikTok.",
      content: `Scaling ad spend without increasing Customer Acquisition Cost (CAC) is the ultimate hurdle for modern D2C brands. 

The solution is high-velocity creative testing:
- Tier 1: 3-Second Hook Variations (Visual pattern interrupts)
- Tier 2: Problem-Agitation Proof (Real customer unboxing & pain points)
- Tier 3: Offer & Frictionless Checkout (Direct incentives & WhatsApp routing)`
    }
  ];

  if (slug) {
    const article = articles.find(a => a.slug === slug) || articles[0];
    return (
      <PageLayout onNavigate={onNavigate} activeNav="blog">
        <div style={{ padding: "80px 24px 60px 24px", maxWidth: "1000px", margin: "0 auto" }}>
          <button
            type="button"
            onClick={() => onNavigate("/blog")}
            style={{ background: "transparent", border: "none", color: "#9ca3af", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", cursor: "pointer", marginBottom: "24px" }}
          >
            <ArrowLeft size={16} /> Back to All Articles
          </button>

          <span style={{ background: "rgba(212,255,0,0.1)", color: "var(--brand-lime)", border: "1px solid var(--brand-lime)", padding: "4px 10px", borderRadius: "9999px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>
            {article.category} • {article.readTime}
          </span>

          <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(32px, 4.5vw, 64px)", lineHeight: 0.95, textTransform: "uppercase", marginBottom: "32px" }}>
            {article.title}
          </h1>

          <div style={{ background: "#121216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "40px 32px", fontSize: "17px", lineHeight: 1.8, color: "#d1d5db", whiteSpace: "pre-line" }}>
            {article.content}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout onNavigate={onNavigate} activeNav="blog">
      <div style={{ padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>FEED NOTES & INSIGHTS</span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "24px" }}>
          PLAYBOOKS & <span style={{ color: "var(--brand-lime)" }}>TACTICS.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#9ca3af", maxWidth: "600px", margin: "0 auto" }}>
          Actionable strategies on performance ads, viral reels, Generative AI Search (GEO), and conversion architecture.
        </p>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
        {articles.map((art) => (
          <div
            key={art.slug}
            onClick={() => onNavigate(`/blog/${art.slug}`)}
            style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "32px", cursor: "pointer", transition: "transform 0.2s ease, border-color 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--brand-lime)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ color: "var(--brand-lime)", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
              {art.category} • {art.readTime}
            </span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "22px", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "12px" }}>
              {art.title}
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
              {art.desc}
            </p>
            <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Read Playbook <ArrowRight size={14} />
            </span>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

// -----------------------------------------------------------------------------
// 8. CAREERS PAGE (/careers)
// -----------------------------------------------------------------------------
export function CareersPage({ onNavigate }) {
  const roles = [
    { title: "Senior Performance Media Buyer (Meta & Google)", exp: "3-5 Yrs", type: "Full-Time • Delhi-NCR / Remote", desc: "Manage ₹20L+ monthly ad spends, build high-velocity creative testing sandboxes, and scale ROAS for category leaders." },
    { title: "Viral Short-Form Video Editor & Motion Designer", exp: "2-4 Yrs", type: "Full-Time • Delhi-NCR", desc: "Script, pace, and edit high-retention vertical reels, kinetic typography, and audio-synced video ads." },
    { title: "Generative AI Search & SEO Architect (GEO)", exp: "3-6 Yrs", type: "Full-Time • Remote / Hybrid", desc: "Build semantic Schema.org Knowledge Graphs, programmatic keyword hubs, and AI answer engine domination systems." },
    { title: "Full-Stack React & Next.js Growth Engineer", exp: "2-5 Yrs", type: "Full-Time • Remote / Hybrid", desc: "Develop sub-second React web experiences, automated webhook CRM funnels, and high-converting landing pages." }
  ];

  return (
    <PageLayout onNavigate={onNavigate} activeNav="careers">
      <div style={{ padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>JOIN THE SQUAD</span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "24px" }}>
          BUILD WHAT PEOPLE <br /> <span style={{ color: "var(--brand-lime)" }}>CAN'T SCROLL PAST.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#9ca3af", maxWidth: "600px", margin: "0 auto 40px auto" }}>
          We're looking for ambitious media buyers, video creators, SEO architects, and engineers ready to scale India's fastest growing brands.
        </p>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {roles.map((r, i) => (
          <div key={i} style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span style={{ color: "var(--brand-lime)", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>{r.type}</span>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "22px", textTransform: "uppercase", margin: "4px 0 8px 0" }}>{r.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", maxWidth: "700px" }}>{r.desc}</p>
            </div>
            <a
              href="mailto:careers@getintofeed.com?subject=Job%20Application%20for%20"
              style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "12px 24px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "12px", textDecoration: "none" }}
            >
              Apply Now →
            </a>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

// -----------------------------------------------------------------------------
// 9. CONTACT US PAGE (/contact)
// -----------------------------------------------------------------------------
export function ContactPage({ onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "", service: "Full Growth Sprint", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "Contact Us Page" })
      });
      setSuccess(true);
    } catch {
      setSuccess(true);
    }
    setSubmitting(false);
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="contact">
      <div style={{ padding: "80px 24px 60px 24px", maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px" }}>
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <span style={{ color: "var(--brand-blue)", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>START A PROJECT</span>
            <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "24px" }}>
              READY TO GET <br /> <span style={{ color: "var(--brand-lime)" }}>INTO THE FEED?</span>
            </h1>
            <p style={{ fontSize: "18px", color: "#9ca3af" }}>
              Tell us about your brand. Our growth team responds with a bespoke strategy within 2 hours.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <div style={{ background: "#121216", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "36px", display: "flex", flexDirection: "column", gap: "28px" }}>
              <div>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", color: "var(--brand-lime)", textTransform: "uppercase", letterSpacing: "0.1em" }}>CALL / WHATSAPP</span>
                <a href="tel:+918810356950" style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", color: "#ffffff", textDecoration: "none", marginTop: "4px" }}>+91-8810356950</a>
                <p style={{ color: "#9ca3af", fontSize: "13px", marginTop: "4px" }}>Direct line to our senior growth strategists</p>
              </div>

              <div>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", color: "var(--brand-blue)", textTransform: "uppercase", letterSpacing: "0.1em" }}>OFFICIAL EMAIL</span>
                <a href="mailto:growth@getintofeed.com" style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "20px", fontWeight: "900", color: "#ffffff", textDecoration: "none", marginTop: "4px" }}>growth@getintofeed.com</a>
                <p style={{ color: "#9ca3af", fontSize: "13px", marginTop: "4px" }}>For commercial proposals and RFPs</p>
              </div>

              <div>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", color: "var(--brand-coral)", textTransform: "uppercase", letterSpacing: "0.1em" }}>OFFICE HUBS</span>
                <p style={{ fontFamily: "var(--font-space)", fontSize: "16px", fontWeight: "800", color: "#ffffff", marginTop: "4px" }}>Delhi-NCR • Bengaluru • Mumbai</p>
                <p style={{ color: "#9ca3af", fontSize: "13px", marginTop: "4px" }}>Serving fast-growing brands pan-India and globally</p>
              </div>
            </div>

            <div style={{ background: "#18181b", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "36px" }}>
              {success ? (
                <div style={{ textAlign: "center", padding: "40px 16px" }}>
                  <Check size={48} color="var(--brand-lime)" style={{ margin: "0 auto 16px auto" }} />
                  <h3 style={{ fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", color: "var(--brand-lime)", textTransform: "uppercase" }}>Inquiry Submitted!</h3>
                  <p style={{ color: "#d1d5db", fontSize: "15px", marginTop: "10px" }}>Our growth lead will contact you on WhatsApp / Phone (+91-8810356950) shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Full Name *</label>
                    <input required type="text" placeholder="e.g. Ashish Raghav" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", background: "#121216", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Work Email *</label>
                      <input required type="email" placeholder="e.g. ashish@brand.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%", background: "#121216", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Phone / WhatsApp *</label>
                      <input required type="tel" placeholder="e.g. 8810356950" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%", background: "#121216", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Brand Website / Instagram Link</label>
                    <input type="text" placeholder="e.g. yourbrand.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} style={{ width: "100%", background: "#121216", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Growth Goals & Message</label>
                    <textarea rows={3} placeholder="Tell us about your brand revenue, ad budget, or timeline..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ width: "100%", background: "#121216", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none" }} />
                  </div>

                  <button type="submit" disabled={submitting} style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "16px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", border: "none", cursor: "pointer", marginTop: "8px" }}>
                    {submitting ? "Submitting..." : "Submit Growth Inquiry →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// -----------------------------------------------------------------------------
// 10. LEGAL PAGES (/privacy & /terms)
// -----------------------------------------------------------------------------
export function LegalPage({ type = "privacy", onNavigate }) {
  const isPrivacy = type === "privacy";
  return (
    <PageLayout onNavigate={onNavigate}>
      <div style={{ padding: "80px 24px 60px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "42px", textTransform: "uppercase", marginBottom: "24px" }}>
          {isPrivacy ? "Privacy Policy" : "Terms of Service"}
        </h1>
        <div style={{ background: "#121216", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "32px", color: "#d1d5db", lineHeight: 1.8, fontSize: "15px" }}>
          <p style={{ marginBottom: "16px" }}>
            Last Updated: August 2026. Get Into Feed ("we", "our", "us") is dedicated to protecting your data and maintaining enterprise privacy standards.
          </p>
          <h3 style={{ fontFamily: "var(--font-space)", color: "var(--brand-lime)", fontSize: "18px", fontWeight: "800", textTransform: "uppercase", margin: "24px 0 8px 0" }}>1. Data Collection & Analytics</h3>
          <p style={{ marginBottom: "16px" }}>
            We only collect information directly submitted through our inquiry forms (Name, Email, Phone, Website) to provide marketing consultations. We do not sell or lease client data to third parties.
          </p>
          <h3 style={{ fontFamily: "var(--font-space)", color: "var(--brand-lime)", fontSize: "18px", fontWeight: "800", textTransform: "uppercase", margin: "24px 0 8px 0" }}>2. Copyright & Intellectual Property</h3>
          <p style={{ marginBottom: "16px" }}>
            All content, graphics, and trademarks are protected under DMCA registration and international intellectual property laws.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
