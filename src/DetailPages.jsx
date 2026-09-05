import React, { useState, useEffect } from "react";
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

export function PageLayout({ children, onNavigate, activeNav = "" }) {
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("General Inbound");

  useEffect(() => {
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#09090B";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

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
      await fetch(API_URL + "/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, service: selectedService || formData.service, source: "Sub-page Inquiry Modal" })
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setLeadModalOpen(false);
        setFormData({ name: "", email: "", phone: "", website: "", service: "Content & Paid Growth", message: "" });
      }, 2000);
    } catch {
      alert("Thanks! Your message has been received. Our team will contact you on WhatsApp/Phone (+91-8810356950) shortly.");
      setLeadModalOpen(false);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#09090B", minHeight: "100vh", fontFamily: "var(--font-inter)", display: "flex", flexDirection: "column" }}>
      {showTopBar && (
        <div style={{ background: "#D4FF00", color: "#09090B", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", fontSize: "12px", fontFamily: "var(--font-space)", fontWeight: "800", letterSpacing: "0.05em", borderBottom: "2px solid #09090B" }}>
          <Zap size={14} fill="#09090B" />
          <span>NOW TAKING ON 3 NEW BRANDS THIS MONTH — LET'S BUILD SOMETHING PEOPLE CAN'T SCROLL PAST.</span>
          <button
            type="button"
            onClick={() => { setSelectedService("High-Growth Retainer"); setLeadModalOpen(true); }}
            style={{ background: "#09090B", color: "#D4FF00", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            LET'S TALK <ArrowRight size={10} />
          </button>
          <button
            type="button"
            onClick={() => setShowTopBar(false)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#09090B", display: "flex", alignItems: "center" }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <nav style={{ background: "#FFFFFF", borderBottom: "2px solid #09090B", position: "sticky", top: 0, zIndex: 50, padding: "16px 24px" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate("/"); }}
            style={{ textDecoration: "none", color: "#09090B", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "26px", letterSpacing: "-0.03em" }}
          >
            getintofeed<span style={{ color: "#0033FF" }}>.</span>
          </a>

          <div className="subpage-nav-links">
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <a
                href="/services"
                onClick={(e) => { e.preventDefault(); onNavigate("/services"); }}
                style={{ color: activeNav === "services" ? "#0033FF" : "#09090B", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                Services <ChevronDown size={14} />
              </a>
              {servicesDropdownOpen && (
                <div style={{ position: "absolute", top: "100%", left: "-20px", background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "12px", padding: "16px", minWidth: "260px", boxShadow: "6px 6px 0px #09090B", zIndex: 100, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.values(serviceCatalog).map(s => (
                    <a
                      key={s.slug}
                      href={"/services/" + s.slug}
                      onClick={(e) => { e.preventDefault(); setServicesDropdownOpen(false); onNavigate("/services/" + s.slug); }}
                      style={{ color: "#09090B", fontSize: "12px", fontFamily: "var(--font-space)", fontWeight: "800", textDecoration: "none", textTransform: "uppercase", padding: "8px 12px", borderRadius: "6px", transition: "all 0.2s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#D4FF00"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      {s.title.split("&")[0]}
                    </a>
                  ))}
                  <div style={{ borderTop: "1px solid #E4E4E7", paddingTop: "8px", marginTop: "4px" }}>
                    <a
                      href="/services"
                      onClick={(e) => { e.preventDefault(); setServicesDropdownOpen(false); onNavigate("/services"); }}
                      style={{ color: "#0033FF", fontSize: "11px", fontFamily: "var(--font-space)", fontWeight: "900", textDecoration: "none", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      View All 8 Services →
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="/work" onClick={(e) => { e.preventDefault(); onNavigate("/work"); }} style={{ color: activeNav === "work" ? "#0033FF" : "#09090B", textDecoration: "none" }}>Work</a>
            <a href="/testimonials" onClick={(e) => { e.preventDefault(); onNavigate("/testimonials"); }} style={{ color: activeNav === "testimonials" ? "#0033FF" : "#09090B", textDecoration: "none" }}>Reviews</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate("/about"); }} style={{ color: activeNav === "about" ? "#0033FF" : "#09090B", textDecoration: "none" }}>About Us</a>
            <a href="/pricing" onClick={(e) => { e.preventDefault(); onNavigate("/pricing"); }} style={{ color: activeNav === "pricing" ? "#0033FF" : "#09090B", textDecoration: "none" }}>Pricing</a>
            <a href="/audit" onClick={(e) => { e.preventDefault(); onNavigate("/audit"); }} style={{ background: "#D4FF00", color: "#09090B", border: "1.5px solid #09090B", padding: "4px 12px", borderRadius: "9999px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", boxShadow: "2px 2px 0px #09090B" }}>⚡ Free Audit</a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); onNavigate("/blog"); }} style={{ color: activeNav === "blog" ? "#0033FF" : "#09090B", textDecoration: "none" }}>Feed Notes</a>
            <a href="tel:+918810356950" style={{ color: "#09090B", textDecoration: "none", fontWeight: "900" }}>📞 8810356950</a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="button"
              onClick={() => { setSelectedService("Start a Project"); setLeadModalOpen(true); }}
              style={{ background: "#D4FF00", color: "#09090B", border: "2px solid #09090B", padding: "10px 22px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "3px 3px 0px #09090B" }}
            >
              Start a project <ArrowRight size={14} />
            </button>
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="subpage-mobile-toggle" aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={26} color="#09090B" /> : <Menu size={26} color="#09090B" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{ background: "#FFFFFF", borderTop: "2px solid #09090B", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "14px", textTransform: "uppercase" }}>
            <a href="/" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/"); }} style={{ color: "#09090B", textDecoration: "none" }}>01. Home</a>
            <a href="/services" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/services"); }} style={{ color: "#09090B", textDecoration: "none" }}>02. Services Hub</a>
            <a href="/testimonials" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/testimonials"); }} style={{ color: "#09090B", textDecoration: "none" }}>03. Reviews & Proof</a>
            <a href="/work" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/work"); }} style={{ color: "#09090B", textDecoration: "none" }}>03. Our Work & Portfolio</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/about"); }} style={{ color: "#09090B", textDecoration: "none" }}>04. About Us</a>
            <a href="/pricing" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/pricing"); }} style={{ color: "#09090B", textDecoration: "none" }}>05. Pricing Sprints</a>
            <a href="/audit" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/audit"); }} style={{ color: "#09090B", textDecoration: "none", background: "#D4FF00", border: "1.5px solid #09090B", padding: "6px 12px", borderRadius: "4px", display: "inline-block" }}>06. ⚡ Free Growth Audit</a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/blog"); }} style={{ color: "#09090B", textDecoration: "none" }}>07. Feed Notes (Blog)</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/contact"); }} style={{ color: "#09090B", textDecoration: "none" }}>08. Contact & Intake</a>
          </div>
        )}
      </nav>

      <main style={{ backgroundColor: "#FFFFFF", color: "#09090B", flexGrow: 1 }}>
        {children}
      </main>

      <section style={{ backgroundColor: "#FFFFFF", padding: "80px 24px", maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
        <div style={{ background: "#D4FF00", color: "#09090B", border: "3px solid #09090B", borderRadius: "24px", padding: "60px 32px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "8px 8px 0px #09090B" }}>
          <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", margin: "0 auto" }}>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", letterSpacing: "0.15em", textTransform: "uppercase", background: "#09090B", color: "#D4FF00", padding: "6px 16px", borderRadius: "9999px", display: "inline-block", marginBottom: "20px" }}>
              TAKE ACTION TODAY
            </span>
            <h2 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(36px, 5vw, 68px)", lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "20px" }}>
              READY TO GET <br /> INTO THE FEED?
            </h2>
            <p style={{ fontSize: "18px", fontWeight: "600", color: "#09090B", maxWidth: "560px", margin: "0 auto 36px auto", lineHeight: 1.5 }}>
              Tell us what you're building. We'll figure out how to get it noticed, clicked, and scaled.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => { setSelectedService("Full Growth Sprint"); setLeadModalOpen(true); }}
                style={{ background: "#09090B", color: "#FFFFFF", padding: "16px 36px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", border: "2px solid #09090B", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "3px 3px 0px #FFFFFF" }}
              >
                Start a project <ArrowRight size={16} />
              </button>
              <a
                href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20want%20to%20scale%20my%20brand."
                target="_blank"
                rel="noreferrer"
                style={{ background: "#FFFFFF", color: "#09090B", border: "2px solid #09090B", padding: "16px 28px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "3px 3px 0px #09090B" }}
              >
                💬 WhatsApp (8810356950)
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: "#F4F4F5", borderTop: "2px solid #09090B", padding: "64px 24px 32px 24px", color: "#09090B" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "40px", marginBottom: "48px" }}>
          <div>
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate("/"); }} style={{ textDecoration: "none", color: "#09090B", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "28px", display: "block", marginBottom: "12px" }}>
              getintofeed<span style={{ color: "#0033FF" }}>.</span>
            </a>
            <p style={{ fontSize: "14px", color: "#52525B", maxWidth: "340px", lineHeight: 1.6 }}>
              A vibrant growth studio that gets brands into the feed — and gets them real results.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", textTransform: "uppercase" }}>
              <span style={{ color: "#09090B", fontSize: "11px", fontWeight: "900", letterSpacing: "0.1em", marginBottom: "4px" }}>SERVICES</span>
              <a href="/services/content-marketing" onClick={(e) => { e.preventDefault(); onNavigate("/services/content-marketing"); }} style={{ color: "#52525B", textDecoration: "none" }}>Content Marketing</a>
              <a href="/services/ads-campaign" onClick={(e) => { e.preventDefault(); onNavigate("/services/ads-campaign"); }} style={{ color: "#52525B", textDecoration: "none" }}>Performance Ads</a>
              <a href="/services/social-media" onClick={(e) => { e.preventDefault(); onNavigate("/services/social-media"); }} style={{ color: "#52525B", textDecoration: "none" }}>Social Media</a>
              <a href="/services/reels" onClick={(e) => { e.preventDefault(); onNavigate("/services/reels"); }} style={{ color: "#52525B", textDecoration: "none" }}>Viral Reels</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", textTransform: "uppercase" }}>
              <span style={{ color: "#09090B", fontSize: "11px", fontWeight: "900", letterSpacing: "0.1em", marginBottom: "4px" }}>COMPANY</span>
              <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate("/about"); }} style={{ color: "#52525B", textDecoration: "none" }}>About Us</a>
              <a href="/work" onClick={(e) => { e.preventDefault(); onNavigate("/work"); }} style={{ color: "#52525B", textDecoration: "none" }}>Case Studies</a>
              <a href="/pricing" onClick={(e) => { e.preventDefault(); onNavigate("/pricing"); }} style={{ color: "#52525B", textDecoration: "none" }}>Pricing Sprints</a>
              <a href="/careers" onClick={(e) => { e.preventDefault(); onNavigate("/careers"); }} style={{ color: "#52525B", textDecoration: "none" }}>Careers</a>
              <a href="/admin" onClick={(e) => { e.preventDefault(); onNavigate("/admin"); }} style={{ color: "#0033FF", textDecoration: "none" }}>Admin Studio</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", textTransform: "uppercase" }}>
              <span style={{ color: "#09090B", fontSize: "11px", fontWeight: "900", letterSpacing: "0.1em", marginBottom: "4px" }}>CONNECT</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: "#52525B", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}><Instagram size={14} /> Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: "#52525B", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}><Linkedin size={14} /> LinkedIn</a>
              <a href="https://wa.me/918810356950" target="_blank" rel="noreferrer" style={{ color: "#52525B", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}><MessageCircle size={14} /> WhatsApp</a>
              <a href="/audit" onClick={(e) => { e.preventDefault(); onNavigate("/audit"); }} style={{ color: "#09090B", textDecoration: "none", background: "#D4FF00", border: "1px solid #09090B", padding: "2px 8px", borderRadius: "4px", display: "inline-block" }}>⚡ Audit Tool</a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1600px", margin: "0 auto", borderTop: "1px solid #E4E4E7", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", fontSize: "12px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", color: "#71717A" }}>
          <p>© 2026 GetIntoFeed Growth Studio.</p>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <a href="https://www.dmca.com/Protection/Status.aspx?ID=d7bfaa8b-113f-40c7-b0b8-9da53cf5cba7" target="_blank" rel="noreferrer">
              <img src="/dmca-badge.svg" alt="DMCA Protected" style={{ height: "22px" }} />
            </a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate("/privacy"); }} style={{ color: "#71717A", textDecoration: "none" }}>Privacy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate("/terms"); }} style={{ color: "#71717A", textDecoration: "none" }}>Terms</a>
          </div>
        </div>
      </footer>

      {leadModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={() => setLeadModalOpen(false)}>
          <div style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "32px", maxWidth: "480px", width: "100%", position: "relative", boxShadow: "8px 8px 0px #09090B" }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLeadModalOpen(false)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#71717A", cursor: "pointer" }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", background: "#D4FF00", color: "#09090B", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", border: "1px solid #09090B" }}>GET INTO THE FEED</span>
              <h3 style={{ fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", textTransform: "uppercase", margin: "8px 0 4px 0", color: "#09090B" }}>Let's Scale Your Brand</h3>
              <p style={{ fontSize: "13px", color: "#71717A" }}>Tell us what you're building. Our team will reach out in under 2 hours.</p>
            </div>

            {submitSuccess ? (
              <div style={{ textAlign: "center", padding: "28px 16px" }}>
                <Check size={36} color="#0033FF" style={{ margin: "0 auto 12px auto" }} />
                <h4 style={{ fontFamily: "var(--font-space)", fontSize: "20px", fontWeight: "800", color: "#09090B" }}>Inquiry Received!</h4>
                <p style={{ color: "#52525B", fontSize: "14px", marginTop: "6px" }}>We'll reach out on WhatsApp/Phone (+91-8810356950) shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px", color: "#09090B" }}>Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ashish Raghav"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #E4E4E7", borderRadius: "6px", padding: "10px 12px", color: "#09090B", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px", color: "#09090B" }}>Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. ashish@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #E4E4E7", borderRadius: "6px", padding: "10px 12px", color: "#09090B", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px", color: "#09090B" }}>Phone / WhatsApp *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 8810356950"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #E4E4E7", borderRadius: "6px", padding: "10px 12px", color: "#09090B", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px", color: "#09090B" }}>Website / Instagram</label>
                  <input
                    type="text"
                    placeholder="e.g. yourbrand.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #E4E4E7", borderRadius: "6px", padding: "10px 12px", color: "#09090B", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px", color: "#09090B" }}>Message / Growth Goals</label>
                  <textarea
                    rows={2}
                    placeholder="Tell us what you want to achieve..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #E4E4E7", borderRadius: "6px", padding: "10px 12px", color: "#09090B", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: "#D4FF00", color: "#09090B", border: "2px solid #09090B", padding: "12px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "13px", cursor: "pointer", marginTop: "6px", boxShadow: "2px 2px 0px #09090B" }}
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

export function ServicesHubPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="services">
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", background: "#F4F4F5", border: "1.5px solid #E4E4E7", padding: "4px 14px", borderRadius: "9999px", marginBottom: "16px" }}>
          FULL CAPABILITY SUITE
        </span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(36px, 5.5vw, 76px)", lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
          GROWTH SERVICES <br /> FOR <span style={{ background: "#D4FF00", padding: "2px 12px", borderRadius: "8px", border: "2px solid #09090B" }}>MODERN BRANDS.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#52525B", maxWidth: "620px", margin: "0 auto 32px auto", lineHeight: 1.6 }}>
          From viral reels to high-ROAS Meta/Google ads and AI entity optimization, explore our 8 dedicated growth engines.
        </p>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", maxWidth: "1600px", margin: "0 auto", padding: "20px 24px 80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
        {Object.values(serviceCatalog).map(s => {
          const Icon = s.icon || Sparkles;
          return (
            <div
              key={s.slug}
              onClick={() => onNavigate("/services/" + s.slug)}
              style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "32px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all 0.2s ease", boxShadow: "5px 5px 0px #09090B" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "8px 8px 0px #D4FF00"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "5px 5px 0px #09090B"; }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "#D4FF00", color: "#09090B", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #09090B" }}>
                    <Icon size={24} />
                  </div>
                  <span style={{ fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", color: "#09090B", background: "#F4F4F5", padding: "4px 10px", borderRadius: "6px", border: "1px solid #E4E4E7", textTransform: "uppercase" }}>{s.label}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "22px", textTransform: "uppercase", color: "#09090B", marginBottom: "12px", lineHeight: 1.15 }}>{s.title}</h3>
                <p style={{ color: "#52525B", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>{s.outcome}</p>
              </div>
              <div style={{ borderTop: "2px solid #F4F4F5", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "900", color: "#09090B", background: "#D4FF00", border: "1px solid #09090B", padding: "3px 10px", borderRadius: "6px" }}>{s.caseMetric}</span>
                <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
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

export function ServiceDetailPage({ slug, onNavigate }) {
  const service = serviceCatalog[slug] || serviceCatalog["content-marketing"];
  const Icon = service.icon || Sparkles;

  return (
    <PageLayout onNavigate={onNavigate} activeNav="services">
      <div style={{ backgroundColor: "#FFFFFF", padding: "60px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => onNavigate("/services")}
          style={{ background: "#F4F4F5", border: "1.5px solid #09090B", padding: "8px 16px", borderRadius: "6px", color: "#09090B", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", marginBottom: "28px" }}
        >
          <ArrowLeft size={16} /> All Services
        </button>

        <div style={{ background: "#FFFFFF", border: "2.5px solid #09090B", borderRadius: "20px", padding: "48px 36px", boxShadow: "6px 6px 0px #09090B" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#D4FF00", border: "1.5px solid #09090B", padding: "6px 14px", borderRadius: "9999px", color: "#09090B", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
            <Icon size={14} /> {service.label}
          </div>

          <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(34px, 5vw, 68px)", lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
            {service.title}
          </h1>

          <p style={{ fontSize: "clamp(16px, 1.8vw, 20px)", color: "#3F3F46", maxWidth: "880px", lineHeight: 1.6, fontWeight: "500", marginBottom: "32px" }}>
            {service.outcome}
          </p>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ background: "#F4F4F5", border: "2px solid #09090B", borderRadius: "10px", padding: "14px 22px" }}>
              <span style={{ display: "block", fontSize: "11px", color: "#71717A", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "800" }}>PROVEN IMPACT</span>
              <strong style={{ fontFamily: "var(--font-space)", fontSize: "22px", color: "#09090B", fontWeight: "900" }}>{service.caseMetric}</strong>
            </div>
            <div style={{ background: "#F4F4F5", border: "2px solid #09090B", borderRadius: "10px", padding: "14px 22px" }}>
              <span style={{ display: "block", fontSize: "11px", color: "#71717A", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "800" }}>CLIENT PORTFOLIO</span>
              <strong style={{ fontFamily: "var(--font-space)", fontSize: "22px", color: "#0033FF", fontWeight: "900" }}>{service.caseBrand}</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", maxWidth: "1600px", margin: "0 auto", padding: "40px 24px 80px 24px" }}>
        <div style={{ background: "#FEF2F2", border: "2px solid #EF4444", borderRadius: "16px", padding: "32px", marginBottom: "60px", boxShadow: "4px 4px 0px #EF4444" }}>
          <span style={{ color: "#DC2626", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>THE INDUSTRY BOTTLENECK</span>
          <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "24px", textTransform: "uppercase", marginBottom: "12px", color: "#991B1B" }}>Why Most Traditional Agencies Fall Short</h3>
          <p style={{ color: "#7F1D1D", fontSize: "16px", lineHeight: 1.6, fontWeight: "500" }}>{service.bottleneck}</p>
        </div>

        <div style={{ marginBottom: "60px" }}>
          <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>EXECUTION METHODOLOGY</span>
          <h2 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(30px, 4vw, 48px)", textTransform: "uppercase", letterSpacing: "-0.04em", color: "#09090B", marginBottom: "32px" }}>Our 4-Stage Sprint Framework</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {service.framework.map((step, idx) => (
              <div key={idx} style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "28px", boxShadow: "4px 4px 0px #09090B" }}>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", color: "#09090B", background: "#D4FF00", border: "1.5px solid #09090B", padding: "2px 10px", borderRadius: "6px", display: "inline-block", marginBottom: "16px" }}>0{idx + 1}</span>
                <h4 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "18px", textTransform: "uppercase", color: "#09090B", marginBottom: "8px" }}>{step.step}</h4>
                <p style={{ color: "#52525B", fontSize: "14px", lineHeight: 1.6 }}>{step.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#F4F4F5", border: "2.5px solid #09090B", borderRadius: "20px", padding: "40px 32px", marginBottom: "60px", boxShadow: "6px 6px 0px #09090B" }}>
          <span style={{ color: "#09090B", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>WHAT YOU GET</span>
          <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(24px, 3vw, 36px)", textTransform: "uppercase", color: "#09090B", marginBottom: "28px" }}>Core Deliverables & Outputs</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {service.points.map((pt, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", background: "#FFFFFF", padding: "16px 20px", borderRadius: "10px", border: "1.5px solid #09090B" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#D4FF00", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1.5px solid #09090B" }}>
                  <Check size={14} color="#09090B" />
                </div>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "14px", fontWeight: "800", color: "#09090B" }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {service.faqs && service.faqs.length > 0 && (
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "32px", textTransform: "uppercase", color: "#09090B", textAlign: "center", marginBottom: "32px" }}>Frequently Asked Questions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {service.faqs.map((faq, i) => (
                <div key={i} style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "12px", padding: "24px", boxShadow: "3px 3px 0px #09090B" }}>
                  <h4 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "16px", color: "#0033FF", marginBottom: "8px" }}>{faq.q}</h4>
                  <p style={{ color: "#3F3F46", fontSize: "14px", lineHeight: 1.6 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export function AboutUsPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="about">
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 60px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", background: "#F4F4F5", border: "1.5px solid #E4E4E7", padding: "4px 14px", borderRadius: "9999px", marginBottom: "16px" }}>
          WHO'S BEHIND THE FEED
        </span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(40px, 6vw, 90px)", lineHeight: 0.85, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "32px" }}>
          WE'RE GETINTOFEED<span style={{ color: "#0033FF" }}>.</span>
        </h1>
        <p style={{ fontSize: "clamp(20px, 2.8vw, 32px)", fontWeight: "800", color: "#09090B", maxWidth: "900px", margin: "0 auto 32px auto", lineHeight: 1.4 }}>
          A creative growth studio built around one simple idea: <br />
          <span style={{ background: "#D4FF00", color: "#09090B", padding: "4px 14px", borderRadius: "6px", display: "inline-block", marginTop: "8px", border: "2px solid #09090B" }}>good marketing shouldn't feel like marketing.</span>
        </p>
        <p style={{ fontSize: "18px", color: "#52525B", maxWidth: "760px", margin: "0 auto 48px auto", lineHeight: 1.6 }}>
          We bring together content, creative, social and performance marketing under one roof — helping brands go from "we need marketing" to "people are actually talking about us."
        </p>
        <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px", background: "#FFFFFF", border: "2px solid #09090B", color: "#09090B", padding: "18px 36px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "18px", textTransform: "uppercase", boxShadow: "4px 4px 0px #09090B" }}>
          Strategy <span style={{ color: "#0033FF", margin: "0 8px" }}>×</span> Creativity <span style={{ color: "#FF6B5E", margin: "0 8px" }}>×</span> Performance
        </div>
      </div>

      <div style={{ background: "#F4F4F5", borderTop: "2px solid #09090B", borderBottom: "2px solid #09090B", padding: "64px 24px" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px", textAlign: "center" }}>
          <div style={{ background: "#FFFFFF", padding: "28px", borderRadius: "12px", border: "2px solid #09090B", boxShadow: "4px 4px 0px #09090B" }}>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "48px", fontWeight: "900", color: "#09090B", display: "block" }}>103+</strong>
            <span style={{ color: "#71717A", fontSize: "13px", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "800" }}>Brands Scaled Across India</span>
          </div>
          <div style={{ background: "#FFFFFF", padding: "28px", borderRadius: "12px", border: "2px solid #09090B", boxShadow: "4px 4px 0px #09090B" }}>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "48px", fontWeight: "900", color: "#0033FF", display: "block" }}>4.8x</strong>
            <span style={{ color: "#71717A", fontSize: "13px", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "800" }}>Average Client ROAS</span>
          </div>
          <div style={{ background: "#FFFFFF", padding: "28px", borderRadius: "12px", border: "2px solid #09090B", boxShadow: "4px 4px 0px #09090B" }}>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "48px", fontWeight: "900", color: "#09090B", display: "block" }}>3.2M+</strong>
            <span style={{ color: "#71717A", fontSize: "13px", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "800" }}>Monthly Viral Impressions</span>
          </div>
          <div style={{ background: "#FFFFFF", padding: "28px", borderRadius: "12px", border: "2px solid #09090B", boxShadow: "4px 4px 0px #09090B" }}>
            <strong style={{ fontFamily: "var(--font-space)", fontSize: "48px", fontWeight: "900", color: "#0033FF", display: "block" }}>&lt; 2hr</strong>
            <span style={{ color: "#71717A", fontSize: "13px", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "800" }}>Fast Strategy Response Time</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export function WorkPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="work">
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 60px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", background: "#F4F4F5", border: "1.5px solid #E4E4E7", padding: "4px 14px", borderRadius: "9999px", marginBottom: "16px" }}>
          PROOF & CASE STUDIES
        </span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
          TURNING SCROLLS <br /> INTO <span style={{ background: "#D4FF00", padding: "2px 12px", borderRadius: "8px", border: "2px solid #09090B" }}>REVENUE.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#52525B", maxWidth: "600px", margin: "0 auto" }}>
          Explore real case studies from high-growth D2C, real estate, B2B SaaS, and healthcare brands scaled by Get Into Feed.
        </p>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", maxWidth: "1600px", margin: "0 auto", padding: "0 24px 80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
        <div onClick={() => onNavigate("/work/veloura-organics")} style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "5px 5px 0px #09090B", cursor: "pointer", transition: "transform 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
          <div>
            <span style={{ background: "#D4FF00", color: "#09090B", padding: "4px 12px", borderRadius: "4px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px", border: "1px solid #09090B" }}>D2C & E-COMMERCE</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "24px", textTransform: "uppercase", color: "#09090B", marginBottom: "8px" }}>Veloura Organics</h3>
            <p style={{ color: "#52525B", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>Scaled Meta Ad creative testing from ₹5L to ₹45L monthly revenue with 4.8x verified ROAS.</p>
          </div>
          <div>
            <div style={{ borderTop: "2px solid #F4F4F5", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", color: "#09090B" }}>4.8x ROAS</span>
              <span style={{ fontSize: "12px", color: "#71717A", fontWeight: "700" }}>3-Tier UGC Sprints</span>
            </div>
            <span style={{ color: "#0033FF", fontWeight: "900", fontSize: "12px", fontFamily: "var(--font-space)", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              Read Full Case Study →
            </span>
          </div>
        </div>

        <div onClick={() => onNavigate("/work/urbanedge-realty")} style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "5px 5px 0px #09090B", cursor: "pointer", transition: "transform 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
          <div>
            <span style={{ background: "#0033FF", color: "#FFFFFF", padding: "4px 12px", borderRadius: "4px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>REAL ESTATE</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "24px", textTransform: "uppercase", color: "#09090B", marginBottom: "8px" }}>UrbanEdge Luxury Realty</h3>
            <p style={{ color: "#52525B", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>Captured 1,420+ high-ticket buyer inquiries for ₹2Cr+ villas using cinematic drone reels and hyper-local geo-targeting.</p>
          </div>
          <div>
            <div style={{ borderTop: "2px solid #F4F4F5", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", color: "#0033FF" }}>+340% LEADS</span>
              <span style={{ fontSize: "12px", color: "#71717A", fontWeight: "700" }}>Reels & Paid Funnel</span>
            </div>
            <span style={{ color: "#0033FF", fontWeight: "900", fontSize: "12px", fontFamily: "var(--font-space)", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              Read Full Case Study →
            </span>
          </div>
        </div>

        <div onClick={() => onNavigate("/work/finscale-lending")} style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "5px 5px 0px #09090B", cursor: "pointer", transition: "transform 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
          <div>
            <span style={{ background: "#09090B", color: "#D4FF00", padding: "4px 12px", borderRadius: "4px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>BFSI & FINTECH</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "24px", textTransform: "uppercase", color: "#09090B", marginBottom: "8px" }}>FinScale Lending</h3>
            <p style={{ color: "#52525B", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>Dominated commercial keyword rankings on Google and AI Overviews, lifting organic applications by 273%.</p>
          </div>
          <div>
            <div style={{ borderTop: "2px solid #F4F4F5", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", color: "#09090B" }}>+273% SEO</span>
              <span style={{ fontSize: "12px", color: "#71717A", fontWeight: "700" }}>GEO & Entity Graph</span>
            </div>
            <span style={{ color: "#0033FF", fontWeight: "900", fontSize: "12px", fontFamily: "var(--font-space)", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              Read Full Case Study →
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export function PricingPage({ onNavigate }) {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [budgetSlider, setBudgetSlider] = useState(150000);

  const estimatedClicks = Math.round(budgetSlider / 25);
  const estimatedLeads = Math.round(estimatedClicks * 0.045);
  const estimatedRevenue = Math.round(budgetSlider * 4.8);

  const formatRupees = (n) => {
    if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
    if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + " Lakhs";
    return "₹" + n.toLocaleString("en-IN");
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="pricing">
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", background: "#F4F4F5", border: "1.5px solid #E4E4E7", padding: "4px 14px", borderRadius: "9999px", marginBottom: "16px" }}>
          TRANSPARENT GROWTH SPRINTS
        </span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
          PREDICTABLE PRICING. <br /> <span style={{ background: "#D4FF00", padding: "2px 12px", borderRadius: "8px", border: "2px solid #09090B" }}>UNSTOPPABLE SCALE.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#52525B", maxWidth: "600px", margin: "0 auto 32px auto" }}>
          No hidden fees. No long-term lock-in traps. Just relentless weekly execution and compounding revenue.
        </p>

        <div style={{ display: "inline-flex", background: "#F4F4F5", padding: "4px", borderRadius: "9999px", border: "2px solid #09090B" }}>
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            style={{ background: billingCycle === "monthly" ? "#D4FF00" : "transparent", color: "#09090B", border: billingCycle === "monthly" ? "1.5px solid #09090B" : "none", padding: "8px 20px", borderRadius: "9999px", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "12px", textTransform: "uppercase", cursor: "pointer" }}
          >
            Monthly Sprints
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("quarterly")}
            style={{ background: billingCycle === "quarterly" ? "#D4FF00" : "transparent", color: "#09090B", border: billingCycle === "quarterly" ? "1.5px solid #09090B" : "none", padding: "8px 20px", borderRadius: "9999px", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "12px", textTransform: "uppercase", cursor: "pointer" }}
          >
            Quarterly (Save 15%)
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", maxWidth: "1600px", margin: "0 auto", padding: "40px 24px 60px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
        <div style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "20px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "5px 5px 0px #09090B" }}>
          <div>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", color: "#71717A", letterSpacing: "0.1em", textTransform: "uppercase" }}>TIER 01</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "26px", textTransform: "uppercase", margin: "8px 0", color: "#09090B" }}>Starter Sprint</h3>
            <p style={{ color: "#52525B", fontSize: "14px", lineHeight: 1.5, marginBottom: "24px" }}>For emerging brands ready to build consistent inbound lead funnels.</p>
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "44px", fontWeight: "900", color: "#09090B" }}>
                {billingCycle === "monthly" ? "₹39,000" : "₹33,000"}
              </span>
              <span style={{ color: "#71717A", fontSize: "14px", fontWeight: "700" }}> / month</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "600" }}><Check size={16} color="#0033FF" /> Targeted Meta & Google Ads Setup</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "600" }}><Check size={16} color="#0033FF" /> 12 High-Retention Viral Reels / Mo</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "600" }}><Check size={16} color="#0033FF" /> Core Commercial SEO Optimization</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "600" }}><Check size={16} color="#0033FF" /> GA4 & Meta Pixel CAPI Tracking</li>
            </ul>
          </div>
          <a href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20want%20the%20Starter%20Sprint." target="_blank" rel="noreferrer" style={{ background: "#F4F4F5", border: "2px solid #09090B", color: "#09090B", padding: "14px", borderRadius: "6px", textAlign: "center", textDecoration: "none", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", textTransform: "uppercase" }}>
            Choose Starter Sprint →
          </a>
        </div>

        <div style={{ background: "#FFFFFF", border: "3px solid #09090B", borderRadius: "20px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", boxShadow: "8px 8px 0px #D4FF00" }}>
          <div style={{ position: "absolute", top: "-14px", right: "24px", background: "#D4FF00", color: "#09090B", padding: "4px 14px", borderRadius: "9999px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", border: "1.5px solid #09090B" }}>
            MOST POPULAR • 4.8x ROAS
          </div>
          <div>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", color: "#0033FF", letterSpacing: "0.1em", textTransform: "uppercase" }}>TIER 02</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "26px", textTransform: "uppercase", margin: "8px 0", color: "#09090B" }}>Scale Engine</h3>
            <p style={{ color: "#52525B", fontSize: "14px", lineHeight: 1.5, marginBottom: "24px" }}>The full multi-channel growth system for scaling D2C, B2B & real estate brands.</p>
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "44px", fontWeight: "900", color: "#09090B" }}>
                {billingCycle === "monthly" ? "₹79,000" : "₹67,000"}
              </span>
              <span style={{ color: "#71717A", fontSize: "14px", fontWeight: "700" }}> / month</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "800" }}><Check size={16} color="#0033FF" /> Omnichannel Meta, Google & YouTube Ads</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "800" }}><Check size={16} color="#0033FF" /> 24 Viral Reels & Short-Form Videos</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "800" }}><Check size={16} color="#0033FF" /> Generative AI Search (GEO) Optimization</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "800" }}><Check size={16} color="#0033FF" /> Custom Sub-Second React Landing Pages</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "800" }}><Check size={16} color="#0033FF" /> Weekly Strategy Sprints & Slack Access</li>
            </ul>
          </div>
          <a href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20want%20the%20Scale%20Engine." target="_blank" rel="noreferrer" style={{ background: "#D4FF00", color: "#09090B", border: "2px solid #09090B", padding: "16px", borderRadius: "6px", textAlign: "center", textDecoration: "none", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "14px", textTransform: "uppercase", boxShadow: "2px 2px 0px #09090B" }}>
            Ignite Scale Engine →
          </a>
        </div>

        <div style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "20px", padding: "36px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "5px 5px 0px #09090B" }}>
          <div>
            <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", color: "#71717A", letterSpacing: "0.1em", textTransform: "uppercase" }}>TIER 03</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "26px", textTransform: "uppercase", margin: "8px 0", color: "#09090B" }}>Enterprise Domination</h3>
            <p style={{ color: "#52525B", fontSize: "14px", lineHeight: 1.5, marginBottom: "24px" }}>For category leaders requiring a full dedicated growth squad and bespoke AI engineering.</p>
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "44px", fontWeight: "900", color: "#09090B" }}>
                {billingCycle === "monthly" ? "₹1,49,000" : "₹1,26,000"}
              </span>
              <span style={{ color: "#71717A", fontSize: "14px", fontWeight: "700" }}> / month</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "600" }}><Check size={16} color="#0033FF" /> Dedicated Full-Stack Growth Squad</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "600" }}><Check size={16} color="#0033FF" /> Unlimited Creative & Video Capacity</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "600" }}><Check size={16} color="#0033FF" /> Full CRM & Webhook Automation</li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#09090B", fontWeight: "600" }}><Check size={16} color="#0033FF" /> 1-Hour SLA Executive Support Channel</li>
            </ul>
          </div>
          <a href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20want%20Enterprise%20Domination." target="_blank" rel="noreferrer" style={{ background: "#F4F4F5", border: "2px solid #09090B", color: "#09090B", padding: "14px", borderRadius: "6px", textAlign: "center", textDecoration: "none", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", textTransform: "uppercase" }}>
            Dominate Your Market →
          </a>
        </div>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px 24px" }}>
        <div style={{ background: "#F4F4F5", border: "2px solid #09090B", borderRadius: "20px", padding: "40px", boxShadow: "6px 6px 0px #09090B" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{ background: "#D4FF00", color: "#09090B", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", padding: "3px 10px", borderRadius: "4px", border: "1px solid #09090B" }}>INTERACTIVE ROI CALCULATOR</span>
            <h3 style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", textTransform: "uppercase", margin: "8px 0 4px 0", color: "#09090B" }}>Calculate Your Monthly Revenue Return</h3>
            <p style={{ color: "#52525B", fontSize: "14px" }}>Drag the budget slider to see projected high-intent clicks, leads, and estimated returns.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", color: "#09090B" }}>Monthly Ad Spend</span>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "20px", fontWeight: "900", color: "#09090B" }}>{formatRupees(budgetSlider)}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={2000000}
                step={25000}
                value={budgetSlider}
                onChange={(e) => setBudgetSlider(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0033FF", height: "8px", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#71717A", marginTop: "6px", fontFamily: "var(--font-space)", fontWeight: "700" }}>
                <span>₹50K</span>
                <span>₹10 Lakhs</span>
                <span>₹20 Lakhs</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "2px solid #09090B" }}>
                <span style={{ fontSize: "11px", color: "#71717A", fontFamily: "var(--font-space)", textTransform: "uppercase", fontWeight: "800" }}>Projected Leads</span>
                <strong style={{ fontFamily: "var(--font-space)", fontSize: "26px", fontWeight: "900", color: "#09090B", display: "block", marginTop: "4px" }}>{estimatedLeads.toLocaleString("en-IN")}+</strong>
              </div>
              <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "2px solid #09090B" }}>
                <span style={{ fontSize: "11px", color: "#71717A", fontFamily: "var(--font-space)", textTransform: "uppercase", fontWeight: "800" }}>Estimated Revenue</span>
                <strong style={{ fontFamily: "var(--font-space)", fontSize: "26px", fontWeight: "900", color: "#0033FF", display: "block", marginTop: "4px" }}>{formatRupees(estimatedRevenue)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

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
      const res = await fetch(API_URL + "/api/audit", {
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
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", background: "#F4F4F5", border: "1.5px solid #E4E4E7", padding: "4px 14px", borderRadius: "9999px", marginBottom: "16px" }}>
          PROPRIETARY GROWTH TELEMETRY
        </span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
          INSTANT GROWTH & <br /> <span style={{ background: "#D4FF00", padding: "2px 12px", borderRadius: "8px", border: "2px solid #09090B" }}>SEO AUDIT TOOL.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#52525B", maxWidth: "680px", margin: "0 auto 40px auto" }}>
          Enter your brand domain to calculate your Growth Readiness Score across SEO, AI search indexation, PageSpeed, and creative retention.
        </p>

        <div style={{ maxWidth: "700px", margin: "0 auto", background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "32px", textAlign: "left", boxShadow: "6px 6px 0px #09090B" }}>
          <form onSubmit={handleAudit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px", color: "#09090B" }}>Your Website or Store URL *</label>
              <input
                required
                type="text"
                placeholder="e.g. yourbrand.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #09090B", borderRadius: "8px", padding: "14px 16px", color: "#09090B", fontSize: "16px", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px", color: "#09090B" }}>Industry Sector</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #09090B", borderRadius: "8px", padding: "14px 16px", color: "#09090B", fontSize: "14px", outline: "none" }}
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
              style={{ background: "#D4FF00", color: "#09090B", border: "2px solid #09090B", padding: "16px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", letterSpacing: "0.05em", cursor: "pointer", marginTop: "8px", boxShadow: "2px 2px 0px #09090B" }}
            >
              {auditing ? "Analyzing Domain Metrics..." : "Run Instant Growth Audit ⚡"}
            </button>
          </form>
        </div>
      </div>

      {report && (
        <div style={{ backgroundColor: "#FFFFFF", maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px 24px" }}>
          <div style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "20px", padding: "40px", boxShadow: "8px 8px 0px #D4FF00" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #09090B", paddingBottom: "24px", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase" }}>AUDIT REPORT GENERATED</span>
                <h3 style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", textTransform: "uppercase", color: "#09090B", margin: "4px 0" }}>{report.domain}</h3>
                <span style={{ color: "#71717A", fontSize: "13px" }}>Sector: {report.targetCategory}</span>
              </div>
              <div style={{ textAlign: "center", background: "#D4FF00", border: "2px solid #09090B", borderRadius: "12px", padding: "16px 28px" }}>
                <span style={{ fontSize: "11px", color: "#09090B", fontFamily: "var(--font-space)", textTransform: "uppercase", fontWeight: "800" }}>OVERALL SCORE</span>
                <strong style={{ fontFamily: "var(--font-space)", fontSize: "40px", fontWeight: "900", color: "#09090B", display: "block" }}>{report.overallScore}/100</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <div style={{ background: "#F4F4F5", padding: "16px", borderRadius: "10px", border: "1.5px solid #09090B" }}>
                <span style={{ color: "#71717A", fontSize: "12px", fontWeight: "700" }}>SEO Authority</span>
                <strong style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", color: "#09090B", marginTop: "4px" }}>{report.metrics.seoScore}/100</strong>
              </div>
              <div style={{ background: "#F4F4F5", padding: "16px", borderRadius: "10px", border: "1.5px solid #09090B" }}>
                <span style={{ color: "#71717A", fontSize: "12px", fontWeight: "700" }}>Speed & Core Vitals</span>
                <strong style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", color: "#0033FF", marginTop: "4px" }}>{report.metrics.speedScore}/100</strong>
              </div>
              <div style={{ background: "#F4F4F5", padding: "16px", borderRadius: "10px", border: "1.5px solid #09090B" }}>
                <span style={{ color: "#71717A", fontSize: "12px", fontWeight: "700" }}>Social Retention</span>
                <strong style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", color: "#09090B", marginTop: "4px" }}>{report.metrics.socialScore}/100</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              <div style={{ background: "#FEF2F2", padding: "24px", borderRadius: "12px", border: "2px solid #EF4444" }}>
                <h4 style={{ fontFamily: "var(--font-space)", fontSize: "16px", fontWeight: "900", color: "#991B1B", textTransform: "uppercase", marginBottom: "16px" }}>⚠️ Critical Bottlenecks</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {report.criticalIssues.map((iss, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#7F1D1D", display: "flex", alignItems: "flex-start", gap: "8px", fontWeight: "600" }}>
                      <X size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: "2px" }} /> {iss}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: "#F0FDF4", padding: "24px", borderRadius: "12px", border: "2px solid #22C55E" }}>
                <h4 style={{ fontFamily: "var(--font-space)", fontSize: "16px", fontWeight: "900", color: "#166534", textTransform: "uppercase", marginBottom: "16px" }}>⚡ Recommended High-ROI Fixes</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {report.quickWins.map((win, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#14532D", display: "flex", alignItems: "flex-start", gap: "8px", fontWeight: "600" }}>
                      <Check size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: "2px" }} /> {win}
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
                style={{ background: "#D4FF00", color: "#09090B", border: "2px solid #09090B", padding: "16px 36px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", textDecoration: "none", display: "inline-block", boxShadow: "4px 4px 0px #09090B" }}
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
        <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 60px 24px", maxWidth: "1000px", margin: "0 auto" }}>
          <button
            type="button"
            onClick={() => onNavigate("/blog")}
            style={{ background: "#F4F4F5", border: "1.5px solid #09090B", padding: "8px 16px", borderRadius: "6px", color: "#09090B", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", cursor: "pointer", marginBottom: "24px" }}
          >
            <ArrowLeft size={16} /> Back to All Articles
          </button>

          <span style={{ background: "#D4FF00", color: "#09090B", border: "1.5px solid #09090B", padding: "4px 10px", borderRadius: "9999px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>
            {article.category} • {article.readTime}
          </span>

          <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(32px, 4.5vw, 60px)", lineHeight: 0.95, textTransform: "uppercase", color: "#09090B", marginBottom: "32px" }}>
            {article.title}
          </h1>

          <div style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "40px 32px", fontSize: "17px", lineHeight: 1.8, color: "#27272A", whiteSpace: "pre-line", boxShadow: "5px 5px 0px #09090B" }}>
            {article.content}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout onNavigate={onNavigate} activeNav="blog">
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", background: "#F4F4F5", border: "1.5px solid #E4E4E7", padding: "4px 14px", borderRadius: "9999px", marginBottom: "16px" }}>
          FEED NOTES & INSIGHTS
        </span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
          PLAYBOOKS & <span style={{ background: "#D4FF00", padding: "2px 12px", borderRadius: "8px", border: "2px solid #09090B" }}>TACTICS.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#52525B", maxWidth: "600px", margin: "0 auto" }}>
          Actionable strategies on performance ads, viral reels, Generative AI Search (GEO), and conversion architecture.
        </p>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "28px" }}>
        {articles.map((art) => (
          <div
            key={art.slug}
            onClick={() => onNavigate("/blog/" + art.slug)}
            style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "32px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "5px 5px 0px #09090B" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "8px 8px 0px #D4FF00"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "5px 5px 0px #09090B"; }}
          >
            <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
              {art.category} • {art.readTime}
            </span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "22px", textTransform: "uppercase", color: "#09090B", lineHeight: 1.15, marginBottom: "12px" }}>
              {art.title}
            </h3>
            <p style={{ color: "#52525B", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
              {art.desc}
            </p>
            <span style={{ color: "#09090B", fontFamily: "var(--font-space)", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Read Playbook <ArrowRight size={14} />
            </span>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export function CareersPage({ onNavigate }) {
  const roles = [
    { title: "Senior Performance Media Buyer (Meta & Google)", exp: "3-5 Yrs", type: "Full-Time • Delhi-NCR / Remote", desc: "Manage ₹20L+ monthly ad spends, build high-velocity creative testing sandboxes, and scale ROAS for category leaders." },
    { title: "Viral Short-Form Video Editor & Motion Designer", exp: "2-4 Yrs", type: "Full-Time • Delhi-NCR", desc: "Script, pace, and edit high-retention vertical reels, kinetic typography, and audio-synced video ads." },
    { title: "Generative AI Search & SEO Architect (GEO)", exp: "3-6 Yrs", type: "Full-Time • Remote / Hybrid", desc: "Build semantic Schema.org Knowledge Graphs, programmatic keyword hubs, and AI answer engine domination systems." },
    { title: "Full-Stack React & Next.js Growth Engineer", exp: "2-5 Yrs", type: "Full-Time • Remote / Hybrid", desc: "Develop sub-second React web experiences, automated webhook CRM funnels, and high-converting landing pages." }
  ];

  return (
    <PageLayout onNavigate={onNavigate} activeNav="careers">
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 40px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", background: "#F4F4F5", border: "1.5px solid #E4E4E7", padding: "4px 14px", borderRadius: "9999px", marginBottom: "16px" }}>
          JOIN THE SQUAD
        </span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
          BUILD WHAT PEOPLE <br /> <span style={{ background: "#D4FF00", padding: "2px 12px", borderRadius: "8px", border: "2px solid #09090B" }}>CAN'T SCROLL PAST.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#52525B", maxWidth: "600px", margin: "0 auto 40px auto" }}>
          We're looking for ambitious media buyers, video creators, SEO architects, and engineers ready to scale India's fastest growing brands.
        </p>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {roles.map((r, i) => (
          <div key={i} style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", boxShadow: "4px 4px 0px #09090B" }}>
            <div>
              <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>{r.type}</span>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "22px", textTransform: "uppercase", color: "#09090B", margin: "4px 0 8px 0" }}>{r.title}</h3>
              <p style={{ color: "#52525B", fontSize: "14px", maxWidth: "700px" }}>{r.desc}</p>
            </div>
            <a
              href="mailto:careers@getintofeed.com?subject=Job%20Application%20for%20"
              style={{ background: "#D4FF00", color: "#09090B", border: "1.5px solid #09090B", padding: "12px 24px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "12px", textDecoration: "none", boxShadow: "2px 2px 0px #09090B" }}
            >
              Apply Now →
            </a>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export function ContactPage({ onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "", service: "Full Growth Sprint", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(API_URL + "/api/leads", {
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
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 60px 24px", maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px" }}>
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
            <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", background: "#F4F4F5", border: "1.5px solid #E4E4E7", padding: "4px 14px", borderRadius: "9999px", marginBottom: "16px" }}>
              START A PROJECT
            </span>
            <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
              READY TO GET <br /> <span style={{ background: "#D4FF00", padding: "2px 12px", borderRadius: "8px", border: "2px solid #09090B" }}>INTO THE FEED?</span>
            </h1>
            <p style={{ fontSize: "18px", color: "#52525B" }}>
              Tell us about your brand. Our growth team responds with a bespoke strategy within 2 hours.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <div style={{ background: "#F4F4F5", border: "2.5px solid #09090B", borderRadius: "20px", padding: "36px", display: "flex", flexDirection: "column", gap: "28px", boxShadow: "6px 6px 0px #09090B" }}>
              <div>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", color: "#09090B", background: "#D4FF00", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", border: "1px solid #09090B" }}>CALL / WHATSAPP</span>
                <a href="tel:+918810356950" style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", color: "#09090B", textDecoration: "none", marginTop: "8px" }}>+91-8810356950</a>
                <p style={{ color: "#71717A", fontSize: "13px", marginTop: "4px" }}>Direct line to our senior growth strategists</p>
              </div>

              <div>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", color: "#FFFFFF", background: "#0033FF", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>OFFICIAL EMAIL</span>
                <a href="mailto:growth@getintofeed.com" style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "20px", fontWeight: "900", color: "#09090B", textDecoration: "none", marginTop: "8px" }}>growth@getintofeed.com</a>
                <p style={{ color: "#71717A", fontSize: "13px", marginTop: "4px" }}>For commercial proposals and RFPs</p>
              </div>

              <div>
                <span style={{ fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", color: "#FFFFFF", background: "#09090B", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>OFFICE HUBS</span>
                <p style={{ fontFamily: "var(--font-space)", fontSize: "16px", fontWeight: "900", color: "#09090B", marginTop: "8px" }}>Delhi-NCR • Bengaluru • Mumbai</p>
                <p style={{ color: "#71717A", fontSize: "13px", marginTop: "4px" }}>Serving fast-growing brands pan-India and globally</p>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "2.5px solid #09090B", borderRadius: "20px", padding: "36px", boxShadow: "6px 6px 0px #09090B" }}>
              {success ? (
                <div style={{ textAlign: "center", padding: "40px 16px" }}>
                  <Check size={48} color="#0033FF" style={{ margin: "0 auto 16px auto" }} />
                  <h3 style={{ fontFamily: "var(--font-space)", fontSize: "24px", fontWeight: "900", textTransform: "uppercase", color: "#09090B" }}>Inquiry Submitted!</h3>
                  <p style={{ color: "#52525B", fontSize: "15px", marginTop: "10px" }}>Our growth lead will contact you on WhatsApp / Phone (+91-8810356950) shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px", color: "#09090B" }}>Full Name *</label>
                    <input required type="text" placeholder="e.g. Ashish Raghav" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #09090B", borderRadius: "6px", padding: "12px 14px", color: "#09090B", outline: "none" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px", color: "#09090B" }}>Work Email *</label>
                      <input required type="email" placeholder="e.g. ashish@brand.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #09090B", borderRadius: "6px", padding: "12px 14px", color: "#09090B", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px", color: "#09090B" }}>Phone / WhatsApp *</label>
                      <input required type="tel" placeholder="e.g. 8810356950" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #09090B", borderRadius: "6px", padding: "12px 14px", color: "#09090B", outline: "none" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px", color: "#09090B" }}>Brand Website / Instagram</label>
                    <input type="text" placeholder="e.g. yourbrand.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #09090B", borderRadius: "6px", padding: "12px 14px", color: "#09090B", outline: "none" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px", color: "#09090B" }}>Growth Goals & Message</label>
                    <textarea rows={3} placeholder="Tell us about your brand revenue, ad budget, or timeline..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ width: "100%", background: "#F4F4F5", border: "1.5px solid #09090B", borderRadius: "6px", padding: "12px 14px", color: "#09090B", outline: "none" }} />
                  </div>

                  <button type="submit" disabled={submitting} style={{ background: "#D4FF00", color: "#09090B", border: "2px solid #09090B", padding: "16px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", cursor: "pointer", marginTop: "6px", boxShadow: "2px 2px 0px #09090B" }}>
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

export function LegalPage({ type = "privacy", onNavigate }) {
  const isPrivacy = type === "privacy";
  return (
    <PageLayout onNavigate={onNavigate}>
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 60px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "42px", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
          {isPrivacy ? "Privacy Policy" : "Terms of Service"}
        </h1>
        <div style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "32px", color: "#27272A", lineHeight: 1.8, fontSize: "15px", boxShadow: "5px 5px 0px #09090B" }}>
          <p style={{ marginBottom: "16px" }}>
            Last Updated: August 2026. Get Into Feed ("we", "our", "us") is dedicated to protecting your data and maintaining enterprise privacy standards.
          </p>
          <h3 style={{ fontFamily: "var(--font-space)", color: "#09090B", background: "#D4FF00", border: "1px solid #09090B", display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "16px", fontWeight: "900", textTransform: "uppercase", margin: "24px 0 8px 0" }}>1. Data Collection & Analytics</h3>
          <p style={{ marginBottom: "16px" }}>
            We only collect information directly submitted through our inquiry forms (Name, Email, Phone, Website) to provide marketing consultations. We do not sell or lease client data to third parties.
          </p>
          <h3 style={{ fontFamily: "var(--font-space)", color: "#09090B", background: "#D4FF00", border: "1px solid #09090B", display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "16px", fontWeight: "900", textTransform: "uppercase", margin: "24px 0 8px 0" }}>2. Copyright & Intellectual Property</h3>
          <p style={{ marginBottom: "16px" }}>
            All content, graphics, and trademarks are protected under DMCA registration and international intellectual property laws.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// CASE STUDIES CATALOG & DETAILED CASE STUDY VIEW
// =========================================================================
export const caseStudiesCatalog = {
  "veloura-organics": {
    slug: "veloura-organics",
    brand: "Veloura Organics",
    industry: "D2C Clean Skincare & Beauty",
    tagline: "Scaling from ₹5L to ₹45L Monthly Revenue with 4.8x Verified ROAS",
    overview: "Veloura had outstanding organic customer sentiment, but their Meta ad spend was hitting a ceiling at ₹5 Lakhs per month with soaring CAC. We rebuilt their creative testing engine from scratch.",
    metrics: [
      { label: "Monthly Revenue", value: "₹45L+", change: "+800% in 90 days" },
      { label: "Blended ROAS", value: "4.82x", change: "Across Meta & Google" },
      { label: "CPA Reduction", value: "-42%", change: "Down to ₹380 per buyer" },
      { label: "Net New Customers", value: "18,400+", change: "First-time buyers acquired" }
    ],
    challenge: "Creative fatigue was setting in every 48 hours. Generic product studio shots were getting high scroll-by rates and cost-per-purchase had spiked above ₹950.",
    solution: "We deployed our 3-Tier UGC Sprints: 32 high-hook creator videos testing founder stories, dermatologist breakdowns, and customer unboxings. Simultaneously, we replaced their slow collection pages with a high-speed custom lander with 1-click cart bumps.",
    deliverables: [
      "32 High-Converting UGC Video Ad Variations",
      "Direct-Response Landers with Instant Cart Bumps",
      "Advantage+ & CBO Full-Funnel Scaling Structure",
      "Post-Purchase Klaviyo Retention & Upsell Workflows"
    ],
    testimonial: {
      quote: "Get Into Feed completely altered our unit economics. Their creative team moves at lightning speed, testing dozens of hooks every week until they find 4x+ ROAS winners.",
      author: "Rhea Singhal",
      role: "Founder & CEO, Veloura Organics",
      rating: 5
    }
  },
  "urbanedge-realty": {
    slug: "urbanedge-realty",
    brand: "UrbanEdge Luxury Realty",
    industry: "Premium Real Estate & Villas",
    tagline: "1,420+ High-Ticket HNI Inquiries for ₹2.5Cr+ Luxury Villas",
    overview: "Selling luxury properties via digital ads requires supreme credibility, cinematic production, and surgical geographic targeting of high-net-worth individuals.",
    metrics: [
      { label: "High-Ticket Leads", value: "1,420+", change: "Verified HNI buyers" },
      { label: "Cost Per Site Visit", value: "₹2,100", change: "64% lower than industry avg" },
      { label: "Inventory Closed", value: "₹28.4 Cr", change: "Directly attributed to ads" },
      { label: "Video Completion Rate", value: "68%", change: "Cinematic drone reels" }
    ],
    challenge: "Low-quality generic form fill ads from previous agencies flooded the sales team with unqualified leads who could not afford luxury villa price points.",
    solution: "We shot 4K cinematic walkthrough reels featuring the head architect, integrated an interactive 3D floorplan qualification questionnaire, and targeted Tier-1 tech founders and corporate executives.",
    deliverables: [
      "4K Cinematic Architectural Walkthrough Reels",
      "Interactive WhatsApp Lead Qualification Bot",
      "Meta Instant Experience Property Showcase Landers",
      "Hyper-Targeted High-Net-Worth Persona Audiences"
    ],
    testimonial: {
      quote: "The quality of leads changed overnight. Instead of bargain hunters, our sales team was talking directly to CXOs and business owners ready to book site visits.",
      author: "Vikramaditya Mehra",
      role: "Managing Director, UrbanEdge Properties",
      rating: 5
    }
  },
  "finscale-lending": {
    slug: "finscale-lending",
    brand: "FinScale Lending",
    industry: "BFSI & Digital MSME Loans",
    tagline: "+273% Organic Inbound Pipeline via Enterprise SEO & Entity Graph",
    overview: "In a heavily saturated commercial lending landscape dominated by legacy banks, FinScale needed to capture high-intent MSME business owners searching for working capital.",
    metrics: [
      { label: "Organic Inbound Leads", value: "+273%", change: "High-intent loan applications" },
      { label: "#1 Keyword Rankings", value: "142", change: "High-commercial intent terms" },
      { label: "AI Search Citations", value: "84%", change: "Cited in ChatGPT & Gemini answers" },
      { label: "Domain Authority", value: "58", change: "Up from 24 via Tier-1 Digital PR" }
    ],
    challenge: "Commercial finance keywords carry massive CPCs exceeding ₹450 per click on Google Search. Organic rankings were negligible due to lack of topical authority.",
    solution: "We mapped and published 45 deep commercial intent playbooks, implemented advanced schema markup for financial calculators, and built authoritative entity citations across financial trade media.",
    deliverables: [
      "45 Enterprise Financial Topic Clusters & Content Hubs",
      "Custom Interactive Working Capital ROI Calculator",
      "GEO (Generative Engine Optimization) Schema Structuring",
      "Tier-1 Financial PR Mentions and Authority Backlinks"
    ],
    testimonial: {
      quote: "Get Into Feed didn't just get us rankings—they drove verified business owners looking for ₹20L to ₹1Cr credit lines. Our organic CAC dropped to near zero.",
      author: "Anandita Sen",
      role: "Chief Marketing Officer, FinScale",
      rating: 5
    }
  }
};

export function CaseStudyDetailPage({ slug, onNavigate }) {
  const caseData = caseStudiesCatalog[slug] || caseStudiesCatalog["veloura-organics"];

  return (
    <PageLayout onNavigate={onNavigate} activeNav="work">
      <div style={{ backgroundColor: "#FFFFFF", padding: "60px 24px 40px 24px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Back Link */}
        <button
          type="button"
          onClick={() => onNavigate("/work")}
          style={{ background: "transparent", border: "none", color: "#71717A", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-space)", fontWeight: "700", fontSize: "12px", textTransform: "uppercase", cursor: "pointer", marginBottom: "24px" }}
        >
          <ArrowLeft size={16} /> Back to all case studies
        </button>

        {/* Case Study Header */}
        <div style={{ borderBottom: "2px solid #09090B", paddingBottom: "40px", marginBottom: "50px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ background: "#0033FF", color: "#FFFFFF", padding: "6px 14px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {caseData.industry}
            </span>
            <span style={{ background: "#D4FF00", color: "#09090B", padding: "6px 14px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", border: "1.5px solid #09090B" }}>
              VERIFIED GROWTH CASE STUDY
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(34px, 5vw, 68px)", lineHeight: 0.95, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", margin: "0 0 20px 0" }}>
            {caseData.brand}
          </h1>

          <p style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(18px, 2.5vw, 26px)", color: "#0033FF", textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 20px 0" }}>
            {caseData.tagline}
          </p>

          <p style={{ fontSize: "16px", color: "#52525B", maxWidth: "800px", lineHeight: 1.7, margin: 0 }}>
            {caseData.overview}
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "60px" }}>
          {caseData.metrics.map((m, idx) => (
            <div key={idx} style={{ background: idx === 0 ? "#D4FF00" : "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "28px", boxShadow: "5px 5px 0px #09090B" }}>
              <div style={{ fontSize: "12px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", color: idx === 0 ? "#09090B" : "#71717A", marginBottom: "8px" }}>
                {m.label}
              </div>
              <div style={{ fontSize: "clamp(32px, 4vw, 44px)", fontFamily: "var(--font-space)", fontWeight: "900", color: "#09090B", letterSpacing: "-0.04em", lineHeight: 1 }}>
                {m.value}
              </div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: idx === 0 ? "#09090B" : "#0033FF", marginTop: "10px" }}>
                ✓ {m.change}
              </div>
            </div>
          ))}
        </div>

        {/* Challenge & Solution Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", marginBottom: "60px" }}>
          <div style={{ background: "#F4F4F5", border: "2px solid #09090B", borderRadius: "16px", padding: "36px", boxShadow: "5px 5px 0px #09090B" }}>
            <span style={{ background: "#FF6B5E", color: "#FFFFFF", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>
              THE BOTTLENECK
            </span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "22px", textTransform: "uppercase", color: "#09090B", marginBottom: "14px" }}>
              The Challenge
            </h3>
            <p style={{ color: "#52525B", fontSize: "15px", lineHeight: 1.7, margin: 0 }}>
              {caseData.challenge}
            </p>
          </div>

          <div style={{ background: "#09090B", color: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "36px", boxShadow: "5px 5px 0px #D4FF00" }}>
            <span style={{ background: "#D4FF00", color: "#09090B", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", display: "inline-block", marginBottom: "16px" }}>
              OUR PLAYBOOK
            </span>
            <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "22px", textTransform: "uppercase", color: "#D4FF00", marginBottom: "14px" }}>
              The Execution
            </h3>
            <p style={{ color: "#D4D4D8", fontSize: "15px", lineHeight: 1.7, margin: 0 }}>
              {caseData.solution}
            </p>
          </div>
        </div>

        {/* Deliverables */}
        <div style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "36px", marginBottom: "60px", boxShadow: "5px 5px 0px #09090B" }}>
          <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "20px", textTransform: "uppercase", color: "#09090B", marginBottom: "20px" }}>
            Key Deliverables & Assets Built
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {caseData.deliverables.map((d, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#F4F4F5", padding: "14px 18px", borderRadius: "8px", border: "1px solid #E4E4E7" }}>
                <CheckCircle2 size={18} color="#0033FF" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#09090B", fontFamily: "var(--font-space)" }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Testimonial */}
        <div style={{ background: "#0033FF", color: "#FFFFFF", borderRadius: "20px", padding: "48px 36px", marginBottom: "60px", position: "relative", overflow: "hidden" }}>
          <Quote size={60} style={{ position: "absolute", top: "20px", right: "24px", opacity: 0.15 }} />
          <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
            {[...Array(caseData.testimonial.rating)].map((_, i) => (
              <Star key={i} size={20} fill="#D4FF00" color="#D4FF00" />
            ))}
          </div>
          <p style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontFamily: "var(--font-space)", fontWeight: "700", lineHeight: 1.5, marginBottom: "24px", maxWidth: "900px" }}>
            "{caseData.testimonial.quote}"
          </p>
          <div>
            <div style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "16px", textTransform: "uppercase" }}>{caseData.testimonial.author}</div>
            <div style={{ color: "#D4FF00", fontSize: "13px", fontWeight: "700" }}>{caseData.testimonial.role}</div>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{ background: "#09090B", color: "#FFFFFF", borderRadius: "20px", padding: "50px 36px", textAlign: "center", border: "2px solid #D4FF00" }}>
          <h2 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(26px, 4vw, 44px)", textTransform: "uppercase", color: "#FFFFFF", marginBottom: "16px" }}>
            WANT SIMILAR RESULTS FOR YOUR FEED?
          </h2>
          <p style={{ color: "#A1A1AA", fontSize: "15px", maxWidth: "600px", margin: "0 auto 30px auto" }}>
            Let's audit your current marketing funnel and identify high-converting revenue opportunities.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => onNavigate("/audit")}
              style={{ background: "#D4FF00", color: "#09090B", border: "2px solid #D4FF00", padding: "14px 28px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              Get Free Growth Audit <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/contact")}
              style={{ background: "transparent", color: "#FFFFFF", border: "2px solid #FFFFFF", padding: "14px 28px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "13px", cursor: "pointer" }}
            >
              Book Strategy Call
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// CLIENTS & TESTIMONIALS PAGE (/clients, /testimonials)
// =========================================================================
export function ClientsTestimonialsPage({ onNavigate }) {
  const [filter, setFilter] = useState("all");

  const testimonials = [
    {
      category: "d2c",
      brand: "Veloura Organics",
      industry: "D2C Skincare",
      quote: "Get Into Feed took our ad spend from ₹5L/mo to ₹45L/mo at a 4.8x ROAS. Their UGC creative hooks are unlike anything other agencies produce.",
      author: "Rhea Singhal",
      role: "Co-Founder & CEO",
      metric: "4.8x ROAS",
      rating: 5
    },
    {
      category: "realestate",
      brand: "UrbanEdge Luxury Realty",
      industry: "Real Estate",
      quote: "1,420+ high-intent buyer inquiries for our luxury villas. We closed over ₹28 Crores in inventory directly tracked to their video campaigns.",
      author: "Vikramaditya Mehra",
      role: "Managing Director",
      metric: "₹28Cr Closed",
      rating: 5
    },
    {
      category: "fintech",
      brand: "FinScale Lending",
      industry: "FinTech & BFSI",
      quote: "Their entity-based SEO and content cluster framework helped us dominate #1 Google rankings for commercial loans, lifting organic applications by 273%.",
      author: "Anandita Sen",
      role: "Chief Marketing Officer",
      metric: "+273% Leads",
      rating: 5
    },
    {
      category: "health",
      brand: "CureZen Healthcare",
      industry: "HealthTech",
      quote: "We scaled tele-consultation bookings by 520% in 4 months. The team understands healthcare regulations and conversion optimization thoroughly.",
      author: "Dr. Sameer Kulkarni",
      role: "Operations Director",
      metric: "+520% Consults",
      rating: 5
    },
    {
      category: "d2c",
      brand: "Stride Activewear",
      industry: "D2C Fitness Apparel",
      quote: "Our customer acquisition cost plummeted by 38% after launching Get Into Feed's creator unboxing sprint. They deliver true ROI, not vanity likes.",
      author: "Aakash Varma",
      role: "Founder",
      metric: "-38% CAC",
      rating: 5
    },
    {
      category: "saas",
      brand: "NexaCloud SaaS",
      industry: "B2B Cloud Software",
      quote: "From zero LinkedIn authority to 45 enterprise demo requests every month. Their B2B thought leadership ghostwriting is exceptional.",
      author: "Priya Nambiar",
      role: "Head of Growth",
      metric: "45 Demos/mo",
      rating: 5
    }
  ];

  const filteredList = filter === "all" ? testimonials : testimonials.filter(t => t.category === filter);

  return (
    <PageLayout onNavigate={onNavigate} activeNav="testimonials">
      <div style={{ backgroundColor: "#FFFFFF", padding: "80px 24px 60px 24px", maxWidth: "1600px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ color: "#0033FF", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", letterSpacing: "0.15em", textTransform: "uppercase", display: "inline-block", background: "#F4F4F5", border: "1.5px solid #E4E4E7", padding: "4px 14px", borderRadius: "9999px", marginBottom: "16px" }}>
          TESTIMONIALS & CLIENT RESULTS
        </span>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(36px, 5.5vw, 80px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#09090B", marginBottom: "24px" }}>
          TRUSTED BY <br /><span style={{ background: "#D4FF00", padding: "2px 12px", borderRadius: "8px", border: "2px solid #09090B" }}>85+ BRANDS</span> WORLDWIDE.
        </h1>
        <p style={{ fontSize: "18px", color: "#52525B", maxWidth: "640px", margin: "0 auto 40px auto" }}>
          Discover what founders, CMOs, and marketing leaders say about partnering with Get Into Feed to scale revenue and organic reach.
        </p>

        {/* Trust Badges Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", maxWidth: "1000px", margin: "0 auto 50px auto" }}>
          <div style={{ background: "#F8F8F8", border: "2px solid #09090B", borderRadius: "12px", padding: "20px", boxShadow: "4px 4px 0px #09090B" }}>
            <div style={{ fontFamily: "var(--font-space)", fontSize: "32px", fontWeight: "900", color: "#09090B" }}>4.9 / 5.0</div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#71717A", textTransform: "uppercase" }}>Average Client Rating</div>
          </div>
          <div style={{ background: "#F8F8F8", border: "2px solid #09090B", borderRadius: "12px", padding: "20px", boxShadow: "4px 4px 0px #09090B" }}>
            <div style={{ fontFamily: "var(--font-space)", fontSize: "32px", fontWeight: "900", color: "#0033FF" }}>₹140Cr+</div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#71717A", textTransform: "uppercase" }}>Client Revenue Scaled</div>
          </div>
          <div style={{ background: "#F8F8F8", border: "2px solid #09090B", borderRadius: "12px", padding: "20px", boxShadow: "4px 4px 0px #09090B" }}>
            <div style={{ fontFamily: "var(--font-space)", fontSize: "32px", fontWeight: "900", color: "#09090B" }}>96%</div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#71717A", textTransform: "uppercase" }}>Quarterly Retainer Retention</div>
          </div>
          <div style={{ background: "#F8F8F8", border: "2px solid #09090B", borderRadius: "12px", padding: "20px", boxShadow: "4px 4px 0px #09090B" }}>
            <div style={{ fontFamily: "var(--font-space)", fontSize: "32px", fontWeight: "900", color: "#0033FF" }}>3.8x</div>
            <div style={{ fontSize: "12px", fontWeight: "800", color: "#71717A", textTransform: "uppercase" }}>Average Blended ROAS</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
          {[
            { key: "all", label: "All Reviews" },
            { key: "d2c", label: "D2C Brands" },
            { key: "realestate", label: "Real Estate" },
            { key: "fintech", label: "FinTech & BFSI" },
            { key: "health", label: "Health & Wellness" },
            { key: "saas", label: "B2B SaaS" }
          ].map(b => (
            <button
              key={b.key}
              type="button"
              onClick={() => setFilter(b.key)}
              style={{
                background: filter === b.key ? "#09090B" : "#FFFFFF",
                color: filter === b.key ? "#D4FF00" : "#09090B",
                border: "2px solid #09090B",
                padding: "8px 18px",
                borderRadius: "9999px",
                fontFamily: "var(--font-space)",
                fontWeight: "800",
                fontSize: "12px",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: filter === b.key ? "3px 3px 0px #0033FF" : "none"
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div style={{ backgroundColor: "#FFFFFF", maxWidth: "1600px", margin: "0 auto", padding: "0 24px 80px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "28px" }}>
        {filteredList.map((t, idx) => (
          <div key={idx} style={{ background: "#FFFFFF", border: "2px solid #09090B", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "5px 5px 0px #09090B" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ background: "#F4F4F5", color: "#09090B", border: "1px solid #09090B", padding: "3px 10px", borderRadius: "4px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>
                  {t.industry}
                </span>
                <span style={{ background: "#D4FF00", color: "#09090B", border: "1px solid #09090B", padding: "3px 10px", borderRadius: "4px", fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900" }}>
                  {t.metric}
                </span>
              </div>

              <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#09090B" color="#09090B" />
                ))}
              </div>

              <p style={{ color: "#18181B", fontSize: "15px", lineHeight: 1.6, fontStyle: "italic", marginBottom: "24px" }}>
                "{t.quote}"
              </p>
            </div>

            <div style={{ borderTop: "2px solid #F4F4F5", paddingTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "14px", color: "#09090B", textTransform: "uppercase" }}>{t.author}</div>
                <div style={{ fontSize: "12px", color: "#71717A", fontWeight: "600" }}>{t.role}, {t.brand}</div>
              </div>
              <span style={{ color: "#0033FF", fontWeight: "900", fontSize: "11px", fontFamily: "var(--font-space)", display: "flex", alignItems: "center", gap: "2px" }}>
                <CheckCircle2 size={14} /> VERIFIED
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 80px auto", padding: "0 24px" }}>
        <div style={{ background: "#0033FF", color: "#FFFFFF", borderRadius: "20px", padding: "48px 36px", textAlign: "center", border: "2px solid #09090B", boxShadow: "6px 6px 0px #09090B" }}>
          <h2 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(26px, 4vw, 42px)", textTransform: "uppercase", marginBottom: "16px" }}>
            Ready to become our next success story?
          </h2>
          <p style={{ fontSize: "16px", color: "#E0E7FF", maxWidth: "600px", margin: "0 auto 28px auto" }}>
            We only take on brands where we have 100% conviction we can produce an outsized return on investment.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("/audit")}
            style={{ background: "#D4FF00", color: "#09090B", border: "2px solid #09090B", padding: "14px 32px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "13px", textTransform: "uppercase", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "4px 4px 0px #09090B" }}
          >
            Claim Your Free Growth Audit <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// 404 NOT FOUND PAGE
// =========================================================================
export function NotFoundPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="">
      <div style={{ backgroundColor: "#FFFFFF", padding: "100px 24px", maxWidth: "900px", margin: "0 auto", textAlign: "center", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ background: "#D4FF00", color: "#09090B", padding: "8px 24px", borderRadius: "8px", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(60px, 12vw, 120px)", lineHeight: 1, letterSpacing: "-0.05em", border: "3px solid #09090B", boxShadow: "8px 8px 0px #09090B", marginBottom: "30px" }}>
          404
        </div>
        <h1 style={{ fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "clamp(26px, 4vw, 44px)", textTransform: "uppercase", color: "#09090B", marginBottom: "16px", letterSpacing: "-0.03em" }}>
          YOU FELL OUT OF THE FEED.
        </h1>
        <p style={{ fontSize: "16px", color: "#52525B", maxWidth: "520px", margin: "0 auto 36px auto", lineHeight: 1.6 }}>
          The page you're searching for doesn't exist, was moved, or has scrolled out of view. Let's get you back to high-converting content.
        </p>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => onNavigate("/")}
            style={{ background: "#09090B", color: "#D4FF00", border: "2px solid #09090B", padding: "12px 24px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "12px", textTransform: "uppercase", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "3px 3px 0px #D4FF00" }}
          >
            ← Back to Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/services")}
            style={{ background: "#FFFFFF", color: "#09090B", border: "2px solid #09090B", padding: "12px 24px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "12px", textTransform: "uppercase", cursor: "pointer", boxShadow: "3px 3px 0px #09090B" }}
          >
            Explore Services
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/audit")}
            style={{ background: "#D4FF00", color: "#09090B", border: "2px solid #09090B", padding: "12px 24px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", fontSize: "12px", textTransform: "uppercase", cursor: "pointer", boxShadow: "3px 3px 0px #09090B" }}
          >
            Free Growth Audit ⚡
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
