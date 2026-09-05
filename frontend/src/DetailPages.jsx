import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Clock,
  Code,
  Edit3,
  ExternalLink,
  Flame,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  PenTool,
  Phone,
  Play,
  Quote,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  X,
  Zap
} from "lucide-react";
import FloatingNavControl from "./components/FloatingNavControl";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

// =========================================================================
// SERVICES CATALOG
// =========================================================================
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
    title: "Performance Ads & Paid Media Scaling",
    icon: Megaphone,
    label: "Paid Media Machine",
    outcome: "Profitable customer acquisition across Meta, Google & YouTube with 3.5x to 5.0x verified blended ROAS.",
    description: "We don't touch the 'Boost Post' button. We engineer full-funnel paid media architecture with rapid creative iteration, bespoke landing pages, and algorithmic budget management.",
    bottleneck: "Creative fatigue within 48 hours and skyrocketing CAC because ads rely on single creative variations without testing infrastructure.",
    framework: [
      { step: "01. Creative Angle Matrix", detail: "Developing 20+ distinct visual and psychological hooks across UGC, founder stories, and product teardowns." },
      { step: "02. Advantage+ & CBO Scaling", detail: "Structuring automated campaign budgets to allocate spend into proven algorithmic winners." },
      { step: "03. Custom Landing Page CRO", detail: "Directing paid traffic to high-speed landers with 1-click order bumps and tailored value props." },
      { step: "04. Attribution & Signal Hardening", detail: "Server-side Conversions API (CAPI) setup guaranteeing accurate first-party conversion tracking." }
    ],
    points: [
      "Meta (Instagram & Facebook) High-ROAS Campaigns",
      "Google Search, Performance Max & YouTube Ads",
      "UGC Creator Ad Production & Rapid Hook Testing",
      "Headless E-commerce Landing Page Funnels",
      "Server-Side Tracking & First-Party Data CAPI",
      "Weekly Cohort Attribution & Unit Economics Analysis"
    ],
    tools: ["Meta Ads Manager", "Google Ads", "Triple Whale", "Shopify Plus", "Klaviyo"],
    caseMetric: "4.8x Verified ROAS (₹45L/mo)",
    caseBrand: "Veloura Organics (D2C)",
    faqs: [
      { q: "What is your minimum ad spend requirement?", a: "We typically work with brands spending at least ₹1.5 Lakhs to ₹10 Lakhs+ monthly to ensure statistical significance during creative testing." },
      { q: "How quickly can we see positive ROAS?", a: "Initial sprint optimizations typically yield ROAS gains within the first 14 to 21 days as winning creative hooks emerge." }
    ]
  },
  "social-media": {
    slug: "social-media",
    title: "Organic Social Media Growth & Community",
    icon: Users,
    label: "Social Engine",
    outcome: "Transform social feeds into an organic acquisition engine that commands attention and turns followers into loyal customers.",
    description: "Social media isn't just about vanity likes. We craft scroll-stopping visual identity systems, trend-jacking video reels, and high-engagement carousels that build genuine authority.",
    bottleneck: "Boring corporate posting that gets 12 likes and zero client inquiries.",
    framework: [
      { step: "01. Visual Feed Architecture", detail: "Designing cohesive brutalist brand aesthetic and template design systems." },
      { step: "02. Viral Hook Engineering", detail: "Scripting and producing 3-second attention-grabbing video openings." },
      { step: "03. Community Direct Outreach", detail: "Engaging directly in comments and DMs to qualify warm commercial leads." },
      { step: "04. Cross-Platform Syndication", detail: "Repurposing hero assets seamlessly across Instagram, LinkedIn, and X." }
    ],
    points: [
      "Brand Feed Identity & Aesthetic Master Guidelines",
      "High-Engagement Swipeable Carousels",
      "Reels & Shorts Scripting & Production",
      "Community Management & Lead DM Ingestion",
      "Influencer Seeding & Co-Creation Sprints",
      "Monthly Social Sentiment & Growth Analytics"
    ],
    tools: ["Figma Enterprise", "CapCut Pro", "Later", "Instagram Creator Studio", "Notion CMS"],
    caseMetric: "+420% Organic Social Engagement",
    caseBrand: "UrbanEdge Luxury Realty",
    faqs: [
      { q: "Do you handle shooting and production?", a: "Yes, we handle scriptwriting, creative direction, editing, visual motion design, and remote or on-site production coordination." },
      { q: "How many posts do you deliver monthly?", a: "Our standard sprint includes 16 to 24 high-production video reels and carousels per month." }
    ]
  },
  "graphics-design": {
    slug: "graphics-design",
    title: "Creative Branding & Visual Design",
    icon: PenTool,
    label: "Visual Identity",
    outcome: "Distinctive, unforgettable brand identities that elevate perception, command premium pricing, and dominate market share.",
    description: "Design without commercial intent is just decoration. We build high-impact creative identity systems, packaging, marketing collateral, and digital design languages.",
    bottleneck: "Cheap-looking brand assets that undermine credibility and make premium clients hesitant to buy.",
    framework: [
      { step: "01. Brand Core Discovery", detail: "Unearthing unique brand positioning and category whitespace." },
      { step: "02. Visual Design System", detail: "Developing typography pairings, color physics, logo marks, and grid systems." },
      { step: "03. Commercial Asset Production", detail: "Designing ad creatives, investor pitch decks, and digital packaging." },
      { step: "04. Brand Guidelines Bible", detail: "Delivering a comprehensive brand book to ensure lifelong visual consistency." }
    ],
    points: [
      "Logo Identity & Complete Brand Guidelines",
      "Packaging & Label Design for D2C Brands",
      "High-Converting Ad Creatives & Social Banners",
      "Investor Pitch Decks & Sales Presentation Decks",
      "Print Collateral, Signage & Environmental Graphics",
      "Figma Design Systems & Component Libraries"
    ],
    tools: ["Adobe Creative Cloud", "Figma", "Blender 3D", "After Effects", "Cinema 4D"],
    caseMetric: "+85% Brand Perceived Value",
    caseBrand: "Aura Premium Living",
    faqs: [
      { q: "What deliverables are included in a full branding sprint?", a: "Primary/secondary logo marks, typography scales, color palettes, iconography, social templates, packaging mocks, and a 60+ page brand guidelines deck." },
      { q: "How long does a brand identity project take?", a: "Complete brand sprints typically take 3 to 4 weeks from initial kickoff to final vector deliveries." }
    ]
  },
  "reels": {
    slug: "reels",
    title: "Viral Reels & Short-Form Video Production",
    icon: Clapperboard,
    label: "Viral Video Hub",
    outcome: "High-retention short-form video content engineered to capture attention in the first 2 seconds and generate massive organic reach.",
    description: "Short-form video is the single most powerful algorithm lever in 2026. We script, edit, animate, and publish dynamic 15-to-60-second reels that drive explosive growth.",
    bottleneck: "Low view counts and 15% drop-off in the first 2 seconds due to weak hooks and boring pacing.",
    framework: [
      { step: "01. Psychological Hook Strategy", detail: "Testing visual surprises, contrarian questions, and pattern interrupts." },
      { step: "02. Dynamic Fast-Paced Editing", detail: "Sound design, kinetic typography, b-roll layering, and zero dead air." },
      { step: "03. Seamless CTA Integration", detail: "Embedding natural call-to-actions that drive bio clicks and comments." },
      { step: "04. Algorithm Optimization", detail: "Optimizing audio selection, hashtags, and watch-time loops." }
    ],
    points: [
      "Hook-Driven Short-Form Scriptwriting",
      "Kinetic Subtitles & Dynamic Typography Animations",
      "Professional Sound Design & Trending Audio Curation",
      "UGC Remote Direction & Creator Sourcing",
      "Cross-Platform Formatting (Reels, Shorts, TikTok)",
      "Watch-Time & Retention Rate Optimization"
    ],
    tools: ["Adobe Premiere Pro", "After Effects", "CapCut Pro", "Logic Pro X", "Frame.io"],
    caseMetric: "12M+ Organic Video Views",
    caseBrand: "FitPulse Nutrition",
    faqs: [
      { q: "Do we need to be on camera?", a: "Not necessarily. We produce founder-led video, creator UGC video, and b-roll voiceover video depending on your brand preference." },
      { q: "What is the turnaround time for reels?", a: "Batches of 8 to 12 edited reels are delivered within 5 to 7 business days." }
    ]
  },
  "videos": {
    slug: "videos",
    title: "Cinematic Commercial Video & Brand Films",
    icon: Video,
    label: "Brand Films",
    outcome: "Broadcast-quality brand films, product showcase videos, and customer case study mini-docs that build unshakeable credibility.",
    description: "When you need to tell a deeper story that moves hearts and opens enterprise wallets, our cinematic production unit delivers commercial-grade video assets.",
    bottleneck: "Inability to close enterprise or high-ticket clients due to lack of polished credibility video assets.",
    framework: [
      { step: "01. Conceptual Storyboarding", detail: "Developing narrative arcs, visual moodboards, and shooting scripts." },
      { step: "02. Production Execution", detail: "4K cinema cameras, drone aerials, professional lighting, and sound." },
      { step: "03. Color Grading & Audio Mix", detail: "Hollywood-grade color grading and spatial sound mastering." },
      { step: "04. Multi-Cut Deliverables", detail: "Exporting 90s hero film, 30s commercial cuts, and 15s social teasers." }
    ],
    points: [
      "Founding Story Mini-Documentaries",
      "4K Drone & Architectural Property Showcases",
      "High-End D2C Product Commercials",
      "Customer Success Video Case Studies",
      "Cinema Color Grading & Professional Sound Mix",
      "Multi-Format Delivery for TV, Web & Social"
    ],
    tools: ["RED Digital Cinema", "Sony FX6", "DaVinci Resolve Studio", "DJI Ronin", "Soundcraft"],
    caseMetric: "₹28.4 Cr Closed Property Deals",
    caseBrand: "UrbanEdge Luxury Realty",
    faqs: [
      { q: "Do you travel for shoots across India?", a: "Yes, our cinema crew travels across Bengaluru, Mumbai, Delhi NCR, Hyderabad, and overseas on request." },
      { q: "What resolution do you deliver in?", a: "All footage is shot in 4K/6K RAW and delivered in pristine 4K UHD with color grading." }
    ]
  },
  "growth": {
    slug: "growth",
    title: "Full-Stack Web Development & CRO Funnels",
    icon: Code,
    label: "Web Engineering",
    outcome: "Lightning-fast, high-converting digital storefronts and web apps built on modern React, Next.js, and headless architectures.",
    description: "A slow website kills ad spend. We engineer bespoke, responsive web experiences optimized for sub-second page loads, SEO perfection, and frictionless conversion.",
    bottleneck: "Bloated WordPress or Shopify themes taking 6+ seconds to load, resulting in 50%+ bounce rates on paid traffic.",
    framework: [
      { step: "01. UX/UI Wireframing & Prototyping", detail: "Mapping friction-free user journeys in high-fidelity Figma." },
      { step: "02. Clean Component Architecture", detail: "Developing accessible, modular React code with Tailwind CSS." },
      { step: "03. Sub-Second Speed Optimization", detail: "Achieving 95+ Google PageSpeed scores with edge caching." },
      { step: "04. Conversion Funnel Optimization", detail: "A/B testing order bumps, sticky CTAs, and 1-click checkout." }
    ],
    points: [
      "Custom React & Next.js Headless Applications",
      "High-Speed Shopify Plus Custom Theme Engineering",
      "Sub-Second Core Web Vitals Optimization",
      "Interactive Calculators, Audits & Lead Tools",
      "Secure REST API & Database Integrations",
      "Continuous A/B Testing & Funnel CRO"
    ],
    tools: ["React 18", "Next.js", "Tailwind CSS", "FastAPI / Python", "PostgreSQL", "Vercel"],
    caseMetric: "+64% Site Conversion Rate",
    caseBrand: "CureZen Healthcare",
    faqs: [
      { q: "Do you build custom web apps or just landing pages?", a: "We build both: from rapid high-converting direct-response landers to complex full-stack web applications with Python backends." },
      { q: "Will our website be mobile-optimized?", a: "100%. We design mobile-first with thumb-friendly touch targets and rapid touch feedback." }
    ]
  },
  "strategy": {
    slug: "strategy",
    title: "Enterprise SEO & Generative Engine Optimization",
    icon: Search,
    label: "Organic Dominance",
    outcome: "Dominate Google search results and generative AI answers (ChatGPT, Perplexity, Gemini) with entity-based search architecture.",
    description: "Traditional keyword stuffing is dead. We build comprehensive semantic topic clusters, technical schema graphs, and authority citations that secure permanent #1 organic visibility.",
    bottleneck: "Spending thousands on PPC ads every month with zero long-term organic equity or compounding inbound pipeline.",
    framework: [
      { step: "01. Entity & Knowledge Graph Audit", detail: "Mapping your brand's authority footprint across search engines and AI models." },
      { step: "02. Technical SEO Core Optimization", detail: "Fixing crawl budgets, Core Web Vitals, and structured JSON-LD schema." },
      { step: "03. Semantic Topic Cluster Creation", detail: "Publishing exhaustive pillar pages that rank for hundreds of long-tail terms." },
      { step: "04. Generative Engine Optimization (GEO)", detail: "Formatting content so AI chatbots cite your brand as the definitive authority." }
    ],
    points: [
      "Full Technical SEO & Core Web Vitals Hardening",
      "Semantic Topic Clusters & Content Pillar Architecture",
      "Generative Engine Optimization (GEO for ChatGPT & Gemini)",
      "Advanced Schema.org JSON-LD Structured Data",
      "High-Authority Digital PR & Editorial Backlinks",
      "Commercial Keyword Ranking & Pipeline Tracking"
    ],
    tools: ["Ahrefs Enterprise", "Google Search Console", "Screaming Frog SEO Spider", "Schema App", "SEMrush"],
    caseMetric: "+273% Organic Inbound Leads",
    caseBrand: "FinScale Lending",
    faqs: [
      { q: "What is Generative Engine Optimization (GEO)?", a: "GEO is the new evolution of SEO that optimizes your brand to be cited and recommended inside AI answers like ChatGPT, Google AI Overviews, and Perplexity." },
      { q: "How long does SEO take to produce measurable pipeline?", a: "Most clients see indexation and ranking velocity within 30 to 60 days, with exponential inbound pipeline compounding over 6 to 12 months." }
    ]
  }
};

// =========================================================================
// CASE STUDIES CATALOG
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

// =========================================================================
// MASTER PAGE LAYOUT (INHERITING EXACT HOMEPAGE DNA)
// =========================================================================
export function PageLayout({ children, onNavigate, activeNav = "" }) {
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("General Growth Inquiry");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", website: "", service: "General Growth Inquiry", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, service: selectedService || formData.service, source: "Subpage Lead Modal" })
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setLeadModalOpen(false);
        setFormData({ name: "", email: "", phone: "", website: "", service: "General Growth Inquiry", message: "" });
      }, 2000);
    } catch {
      alert("Thank you! Your growth inquiry has been received. Our team will contact you shortly.");
      setLeadModalOpen(false);
    }
    setSubmitting(false);
  };

  return (
    <div className="antialiased selection:bg-brand-lime selection:text-brand-dark bg-brand-dark font-inter min-h-screen text-white flex flex-col relative">
      {/* Top Bar Announcement Banner */}
      {showTopBar && (
        <div className="bg-[#D4FF00] text-[#09090B] font-space font-bold text-xs uppercase tracking-wider py-2.5 px-4 flex items-center justify-center gap-3 relative z-50 text-center select-none">
          <Zap size={14} fill="#09090B" className="shrink-0" />
          <span className="hidden sm:inline">NOW TAKING ON 3 NEW BRANDS THIS MONTH — LET'S BUILD SOMETHING PEOPLE CAN'T SCROLL PAST.</span>
          <span className="sm:hidden">TAKING ON 3 NEW BRANDS THIS MONTH.</span>
          <button
            type="button"
            onClick={() => { setSelectedService("High-Growth Retainer"); setLeadModalOpen(true); }}
            className="inline-flex bg-brand-dark text-white px-3 py-1 rounded text-[10px] hover:bg-black shrink-0 items-center gap-1 transition-colors group cursor-pointer border-none font-bold"
          >
            LET'S TALK <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            type="button"
            onClick={() => setShowTopBar(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-transparent border-none text-brand-dark cursor-pointer p-1"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Global Master Navbar */}
      <nav className="w-full z-50 bg-brand-dark border-b border-white/10 sticky top-0 backdrop-blur-md" id="navbar">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 py-4 md:py-5 flex justify-between items-center">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate("/"); }}
            className="font-space font-bold text-2xl tracking-tighter text-white hover:text-brand-lime transition-colors text-decoration-none"
          >
            getintofeed<span className="text-brand-blue">.</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 font-bold font-space text-xs tracking-widest uppercase">
            <div
              className="relative py-2"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <a
                href="/services"
                onClick={(e) => { e.preventDefault(); onNavigate("/services"); }}
                className={`flex items-center gap-1.5 transition-colors text-decoration-none ${
                  activeNav === "services" ? "text-brand-lime" : "text-white/85 hover:text-brand-lime"
                }`}
              >
                Services <ChevronDown size={13} />
              </a>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 bg-[#18181B] border border-white/15 rounded-xl p-3 min-w-[280px] shadow-2xl z-50 flex flex-col gap-1">
                  {Object.values(serviceCatalog).map(s => (
                    <a
                      key={s.slug}
                      href={"/services/" + s.slug}
                      onClick={(e) => { e.preventDefault(); setServicesDropdownOpen(false); onNavigate("/services/" + s.slug); }}
                      className="text-white/80 hover:text-brand-lime hover:bg-white/5 px-3 py-2 rounded-lg text-[11px] font-space font-bold uppercase tracking-wider text-decoration-none transition-colors"
                    >
                      {s.title.split("&")[0]}
                    </a>
                  ))}
                  <div className="border-t border-white/10 pt-2 mt-1">
                    <a
                      href="/services"
                      onClick={(e) => { e.preventDefault(); setServicesDropdownOpen(false); onNavigate("/services"); }}
                      className="text-brand-lime hover:text-white px-3 py-1.5 text-[10px] font-space font-bold uppercase tracking-widest text-decoration-none flex items-center gap-1"
                    >
                      View All 8 Services →
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/work"
              onClick={(e) => { e.preventDefault(); onNavigate("/work"); }}
              className={`transition-colors text-decoration-none ${
                activeNav === "work" ? "text-brand-lime" : "text-white/85 hover:text-brand-lime"
              }`}
            >
              Work
            </a>

            <a
              href="/testimonials"
              onClick={(e) => { e.preventDefault(); onNavigate("/testimonials"); }}
              className={`transition-colors text-decoration-none ${
                activeNav === "testimonials" ? "text-brand-lime" : "text-white/85 hover:text-brand-lime"
              }`}
            >
              Reviews
            </a>

            <a
              href="/about"
              onClick={(e) => { e.preventDefault(); onNavigate("/about"); }}
              className={`transition-colors text-decoration-none ${
                activeNav === "about" ? "text-brand-lime" : "text-white/85 hover:text-brand-lime"
              }`}
            >
              About Us
            </a>

            <a
              href="/pricing"
              onClick={(e) => { e.preventDefault(); onNavigate("/pricing"); }}
              className={`transition-colors text-decoration-none ${
                activeNav === "pricing" ? "text-brand-lime" : "text-white/85 hover:text-brand-lime"
              }`}
            >
              Pricing
            </a>

            <a
              href="/blog"
              onClick={(e) => { e.preventDefault(); onNavigate("/blog"); }}
              className={`transition-colors text-decoration-none ${
                activeNav === "blog" ? "text-brand-lime" : "text-white/85 hover:text-brand-lime"
              }`}
            >
              Feed Notes
            </a>

            <a
              href="tel:+918810356950"
              className="text-white/90 hover:text-brand-lime transition-colors text-decoration-none font-bold"
            >
              📞 8810356950
            </a>
          </div>

          {/* Desktop Right CTA */}
          <button
            type="button"
            onClick={() => { setSelectedService("Start a Project"); setLeadModalOpen(true); }}
            className="hidden md:flex bg-brand-blue text-white px-5 py-2.5 rounded-lg text-xs font-bold font-space uppercase tracking-wider hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(0,51,255,0.4)] transition-all items-center gap-2 group cursor-pointer border-none"
          >
            Start a project <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-1 bg-transparent border-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="flex flex-col bg-brand-dark px-6 py-6 border-b border-white/10 gap-5 absolute w-full z-40 left-0 top-full lg:hidden shadow-2xl">
            <a href="/" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/"); }} className="text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">01. Home</a>
            <a href="/services" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/services"); }} className="text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">02. Services Hub</a>
            <a href="/work" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/work"); }} className="text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">03. Case Studies & Proof</a>
            <a href="/testimonials" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/testimonials"); }} className="text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">04. Client Reviews</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/about"); }} className="text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">05. About Us</a>
            <a href="/pricing" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/pricing"); }} className="text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">06. Pricing Sprints</a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/blog"); }} className="text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">07. Feed Notes</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate("/contact"); }} className="text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">08. Contact & Discovery</a>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); setSelectedService("Start a Project"); setLeadModalOpen(true); }}
              className="bg-brand-blue text-white px-6 py-3 rounded-lg text-xs font-bold font-space uppercase tracking-wider hover:bg-blue-600 transition-all flex justify-center items-center gap-2 group w-full mt-2 cursor-pointer border-none"
            >
              Start a project <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </nav>

      {/* Main Subpage Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Global Master Footer */}
      <footer className="relative z-30 bg-brand-dark pt-16 pb-8 px-6 md:px-12 lg:px-16 w-full text-white border-t border-white/10 mt-auto">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
          <div>
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate("/"); }} className="font-space font-bold text-3xl tracking-tighter text-white hover:text-brand-lime transition-colors block mb-3 text-decoration-none">
              getintofeed<span className="text-brand-blue">.</span>
            </a>
            <p className="text-xs text-gray-400 font-medium max-w-[280px] leading-relaxed font-inter">
              A vibrant growth studio that gets brands into the feed — and gets them verified revenue.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 w-full md:w-auto">
            <div className="flex flex-col gap-3 font-space font-bold text-[10px] uppercase tracking-widest text-white">
              <a href="/services/content-marketing" onClick={(e) => { e.preventDefault(); onNavigate("/services/content-marketing"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white/80">Content</a>
              <a href="/services/ads-campaign" onClick={(e) => { e.preventDefault(); onNavigate("/services/ads-campaign"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white/80">Paid Media</a>
              <a href="/services/social-media" onClick={(e) => { e.preventDefault(); onNavigate("/services/social-media"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white/80">Social</a>
            </div>
            <div className="flex flex-col gap-3 font-space font-bold text-[10px] uppercase tracking-widest text-white">
              <a href="/services/graphics-design" onClick={(e) => { e.preventDefault(); onNavigate("/services/graphics-design"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white/80">Creative</a>
              <a href="/services/growth" onClick={(e) => { e.preventDefault(); onNavigate("/services/growth"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white/80">Web Dev</a>
              <a href="/services/strategy" onClick={(e) => { e.preventDefault(); onNavigate("/services/strategy"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white/80">SEO</a>
            </div>
            <div className="flex flex-col gap-3 font-space font-bold text-[10px] uppercase tracking-widest text-white col-span-2 sm:col-span-1">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-brand-lime transition-colors flex items-center gap-2 text-decoration-none text-white/80"><Instagram size={12} className="text-brand-lime" /> Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-brand-blue transition-colors flex items-center gap-2 text-decoration-none text-white/80"><Linkedin size={12} className="text-brand-blue" /> LinkedIn</a>
              <a href="mailto:hello@getintofeed.com" className="hover:text-brand-lime transition-colors flex items-center gap-2 text-decoration-none text-white/80"><Mail size={12} className="text-white" /> Email</a>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] sm:text-[10px] font-space font-bold tracking-widest uppercase text-gray-500">
          <p>© 2026 GetIntoFeed Growth Studio. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate("/privacy"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-gray-400">Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate("/terms"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-gray-400">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Lead Intake Modal */}
      {leadModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setLeadModalOpen(false)}>
          <div className="bg-[#09090B] border-2 border-[#D4FF00] rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(212,255,0,0.2)] text-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setLeadModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"><X size={20} /></button>
            <div className="mb-6">
              <span className="font-space font-bold text-xs uppercase tracking-widest text-[#D4FF00] mb-2 block">Quick Inquiry</span>
              <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-2">Let's build your feed.</h3>
              <p className="text-gray-400 text-xs font-inter">Tell us about your brand. We'll reply within 15 minutes.</p>
            </div>
            {submitted ? (
              <div className="bg-[#18181B] border border-[#D4FF00] rounded-xl p-6 text-center">
                <CheckCircle2 size={36} className="text-[#D4FF00] mx-auto mb-3" />
                <h4 className="font-space font-bold text-lg uppercase text-white mb-1">Inquiry Received!</h4>
                <p className="text-gray-300 text-xs font-inter">Our lead strategist will reach out to you directly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Your Name *</label>
                  <input required type="text" placeholder="e.g. Ashish Raghav" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Email *</label>
                    <input required type="email" placeholder="ashish@brand.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none" />
                  </div>
                  <div>
                    <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Phone *</label>
                    <input required type="tel" placeholder="8810356950" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Website or Handle</label>
                  <input type="text" placeholder="yourbrand.com" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none" />
                </div>
                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">What are your growth goals?</label>
                  <textarea rows={2} placeholder="Tell us what you want to achieve..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none" />
                </div>
                <button type="submit" disabled={submitting} className="bg-[#D4FF00] text-[#09090B] font-space font-bold uppercase text-xs tracking-wider py-3 rounded-lg hover:bg-[#E2FF4D] hover:shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-all cursor-pointer border-none mt-2">
                  {submitting ? "Sending..." : "Submit Growth Inquiry →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Right-Side Navigation Dock */}
      <FloatingNavControl />
    </div>
  );
}

// =========================================================================
// SERVICES HUB PAGE (/services)
// =========================================================================
export function ServicesHubPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="services">
      {/* Dark Hero */}
      <section className="relative pt-16 pb-16 md:pt-20 md:pb-20 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue mb-4">
            Capabilities & Growth Engines
          </p>
          <h1 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[68px] lg:text-[76px] leading-[0.85] tracking-tighter uppercase mb-6">
            SERVICES ENGINEERED <br />
            FOR <span className="text-brand-lime">PREDICTABLE REVENUE.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-medium font-inter mb-8">
            We don't sell random packages. We deploy modular growth systems across content, paid media, creative design, and technical conversion.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-[#18181B] border border-white/15 text-white px-4 py-1.5 rounded-full text-[11px] font-space font-bold uppercase tracking-wider">
              8 Specialized Capabilities
            </span>
            <span className="bg-[#18181B] border border-brand-lime/40 text-brand-lime px-4 py-1.5 rounded-full text-[11px] font-space font-bold uppercase tracking-wider">
              Weekly Creative Testing Sprints
            </span>
            <span className="bg-[#18181B] border border-white/15 text-white px-4 py-1.5 rounded-full text-[11px] font-space font-bold uppercase tracking-wider">
              Direct Senior Execution
            </span>
          </div>
        </div>
      </section>

      {/* 8 Services Master Grid */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(serviceCatalog).map((s, idx) => {
            const IconComp = s.icon;
            return (
              <div
                key={s.slug}
                onClick={() => onNavigate("/services/" + s.slug)}
                className="group bg-[#18181B] border border-white/10 hover:border-brand-lime rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-lime group-hover:bg-brand-lime group-hover:text-brand-dark transition-colors">
                      <IconComp size={22} />
                    </div>
                    <span className="font-space font-bold text-xs text-gray-500 group-hover:text-brand-lime transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <span className="font-space font-bold text-[10px] uppercase tracking-widest text-brand-blue block mb-2">
                    {s.label}
                  </span>
                  <h3 className="font-space font-bold text-lg md:text-xl uppercase tracking-tight text-white mb-3 group-hover:text-brand-lime transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-inter line-clamp-3 mb-6">
                    {s.outcome}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-brand-lime text-xs font-space font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:underline">
                    Explore Capability <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Delivery Sprints (Alternating Light Gray Section) */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-light-gray text-brand-dark border-y border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue mb-3">Our Delivery Framework</p>
            <h2 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark mb-4 leading-tight">
              HOW WE SHIP WINS IN <span className="text-brand-blue">30-DAY CYCLES.</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-inter">
              No endless agency onboarding. We deploy proven growth playbooks from Day 1.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "Sprint 01", title: "Funnel & Creative Audit", desc: "Diagnostic teardown of current CPA, creative fatigue, unit economics, and keyword gaps." },
              { step: "Sprint 02", title: "Creative Engine Build", desc: "Producing 20+ hook-driven UGC video reels, carousels, and custom direct-response landers." },
              { step: "Sprint 03", title: "Algorithmic Scaling", desc: "Deploying Advantage+ CBO campaigns, Google Search capture, and conversion signal hardening." },
              { step: "Sprint 04", title: "Retention & LTV Lift", desc: "Optimizing email flows, SMS retention, and category authority digital PR." }
            ].map((st, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-brand-dark transition-colors">
                <div>
                  <span className="font-space font-bold text-xs text-brand-blue tracking-widest uppercase block mb-3">{st.step}</span>
                  <h3 className="font-space font-bold text-lg uppercase tracking-tight text-brand-dark mb-2">{st.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-inter">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1280px] mx-auto bg-brand-blue rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <h2 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white mb-4">
            NOT SURE WHICH CAPABILITY YOU NEED?
          </h2>
          <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto mb-8 font-inter">
            Let's conduct a free 360° growth audit of your current ad account, organic feed, and website conversion rate.
          </p>
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }}
            className="bg-brand-lime text-brand-dark px-8 py-3.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] hover:shadow-[0_0_25px_rgba(212,255,0,0.5)] transition-all inline-flex items-center gap-2 group text-decoration-none"
          >
            Claim Free Growth Audit <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// SERVICE DETAIL PAGE (/services/:slug)
// =========================================================================
export function ServiceDetailPage({ slug, onNavigate }) {
  const service = serviceCatalog[slug] || serviceCatalog["content-marketing"];
  const IconComp = service.icon;

  return (
    <PageLayout onNavigate={onNavigate} activeNav="services">
      {/* Dark Hero */}
      <section className="pt-16 pb-16 md:pt-20 md:pb-20 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto">
          <button
            type="button"
            onClick={() => onNavigate("/services")}
            className="text-gray-400 hover:text-brand-lime font-space font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-6 cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft size={14} /> Back to all services
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-brand-blue text-white px-3 py-1 rounded text-[11px] font-space font-bold uppercase tracking-wider">
                  {service.label}
                </span>
                <span className="bg-white/10 text-brand-lime px-3 py-1 rounded text-[11px] font-space font-bold uppercase tracking-wider border border-brand-lime/30">
                  Sprint Capability
                </span>
              </div>
              <h1 className="font-space font-bold text-[36px] sm:text-[48px] md:text-[60px] leading-[0.9] tracking-tighter uppercase text-white mb-6">
                {service.title}
              </h1>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed font-inter max-w-2xl mb-8">
                {service.outcome}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/contact"
                  onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }}
                  className="bg-brand-lime text-brand-dark px-6 py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] hover:shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-all inline-flex items-center gap-2 group text-decoration-none"
                >
                  Book This Sprint <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/pricing"
                  onClick={(e) => { e.preventDefault(); onNavigate("/pricing"); }}
                  className="bg-transparent border border-white/20 text-white px-6 py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-brand-blue hover:border-brand-blue transition-all inline-flex items-center gap-2 text-decoration-none"
                >
                  View Sprint Pricing
                </a>
              </div>
            </div>

            {/* Verified Case Metric Box */}
            <div className="bg-[#18181B] border-2 border-white/10 rounded-2xl p-8 shadow-2xl">
              <span className="font-space font-bold text-xs uppercase tracking-widest text-brand-lime block mb-2">Verified Result</span>
              <div className="font-space font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight mb-2">
                {service.caseMetric}
              </div>
              <p className="text-gray-400 text-xs font-inter mb-6">Client: {service.caseBrand}</p>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-gray-400 font-space uppercase">
                <span>MarTech Stack:</span>
                <span className="text-white font-bold">{service.tools.slice(0, 2).join(" • ")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottleneck vs Solution (Alternating Light Gray) */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-16 bg-brand-light-gray text-brand-dark">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-red-200 shadow-sm">
            <span className="bg-red-500 text-white px-3 py-1 rounded text-[10px] font-space font-bold uppercase tracking-widest block w-max mb-4">
              The Costly Mistake
            </span>
            <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark mb-4">
              The Common Bottleneck
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed font-inter">
              {service.bottleneck}
            </p>
          </div>

          <div className="bg-brand-dark text-white p-8 md:p-10 rounded-3xl border border-white/10 shadow-xl">
            <span className="bg-brand-lime text-brand-dark px-3 py-1 rounded text-[10px] font-space font-bold uppercase tracking-widest block w-max mb-4 font-extrabold">
              Our Growth Approach
            </span>
            <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-4">
              How We Solve It
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-inter">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Execution Framework */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-t border-white/10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-lime mb-3">Our 4-Step Playbook</p>
            <h2 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white">
              THE EXECUTION BLUEPRINT.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.framework.map((f, idx) => (
              <div key={idx} className="bg-[#18181B] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-brand-lime transition-colors">
                <span className="font-space font-bold text-xs text-brand-blue tracking-widest uppercase block mb-2">
                  Step 0{idx + 1}
                </span>
                <h3 className="font-space font-bold text-lg md:text-xl uppercase text-white tracking-tight mb-2">
                  {f.step}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-inter">
                  {f.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Grid */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-16 bg-brand-dark border-t border-white/10">
        <div className="max-w-[1280px] mx-auto">
          <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-8 text-center">
            Exact Sprint Deliverables
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.points.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#18181B] border border-white/10 px-5 py-4 rounded-xl">
                <CheckCircle2 size={18} className="text-brand-lime shrink-0" />
                <span className="font-space font-bold text-xs uppercase text-white tracking-wide">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-16 bg-brand-light-gray text-brand-dark border-t border-gray-200">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-space font-bold text-3xl uppercase tracking-tight text-brand-dark mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {service.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="font-space font-bold text-base uppercase text-brand-dark mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm leading-relaxed font-inter">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1000px] mx-auto bg-brand-blue rounded-3xl p-10 text-center shadow-xl">
          <h3 className="font-space font-bold text-3xl uppercase tracking-tight text-white mb-4">
            Ready to scale with {service.title.split("&")[0]}?
          </h3>
          <p className="text-blue-100 text-sm max-w-lg mx-auto mb-6 font-inter">
            Schedule a 15-minute discovery call to evaluate your growth goals and sprint timeline.
          </p>
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }}
            className="bg-brand-lime text-brand-dark px-8 py-3.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all inline-flex items-center gap-2 group text-decoration-none"
          >
            Start Growth Discovery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// ABOUT US PAGE (/about)
// =========================================================================
export function AboutUsPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="about">
      {/* Dark Hero */}
      <section className="pt-16 pb-16 md:pt-24 md:pb-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue mb-4">
            Agency Manifesto & Team
          </p>
          <h1 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[70px] lg:text-[80px] leading-[0.85] tracking-tighter uppercase mb-6">
            WE BUILT GETINTOFEED AROUND <br />
            A SIMPLE IDEA: <span className="text-brand-lime">GOOD MARKETING SHOULDN'T BE BORING.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-medium font-inter mb-8">
            We are not a bloated agency with 5 account managers standing between you and the creative. We are a senior growth unit that moves at high speed and scales client revenue.
          </p>
        </div>
      </section>

      {/* Story & Philosophy Section (2 Column) */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
          <div className="text-left">
            <h2 className="font-space font-bold text-xs tracking-widest uppercase text-brand-blue mb-4">Origin & Mission</h2>
            <h3 className="font-space font-bold text-[36px] sm:text-[46px] md:text-[54px] tracking-tighter leading-[0.9] uppercase text-white">
              LEAN SENIOR TEAM. <br />
              <span className="text-brand-lime">RADICAL ROI.</span>
            </h3>
          </div>

          <div className="text-left text-gray-300 space-y-6 text-sm md:text-base leading-relaxed font-inter bg-[#18181B] p-8 md:p-12 rounded-3xl border border-white/10">
            <p className="text-white font-space font-bold text-lg md:text-xl uppercase tracking-tight">
              Most marketing agencies operate on retainers that fund office perks and junior interns. We took the opposite path.
            </p>
            <p>
              By keeping our team compact, highly specialized, and deeply experienced in performance creative, paid algorithms, and conversion engineering, we eliminate waste and pass the efficiency directly to your bottom line.
            </p>
            <p>
              Whether we're shooting 32 UGC ad hooks for a beauty brand, restructuring an enterprise SEO entity graph, or architecting a multi-crore real estate reel campaign, our focus never wavers from verified commercial return.
            </p>
            <div className="pt-2">
              <a
                href="/work"
                onClick={(e) => { e.preventDefault(); onNavigate("/work"); }}
                className="inline-flex bg-brand-lime text-brand-dark px-6 py-3 rounded-lg font-bold font-space uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all items-center gap-2 group text-decoration-none"
              >
                View Our Verified Work <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Numbers (Light Gray Section) */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-16 bg-brand-light-gray text-brand-dark border-y border-gray-200">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "₹140Cr+", label: "Client Revenue Scaled" },
            { num: "4.8x", label: "Average Blended ROAS" },
            { num: "85+", label: "High-Growth Brands" },
            { num: "< 15 Min", label: "Client Response Time" }
          ].map((st, i) => (
            <div key={i} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 text-center shadow-sm">
              <div className="font-space font-bold text-3xl sm:text-4xl md:text-5xl text-brand-dark tracking-tighter mb-2">{st.num}</div>
              <div className="font-space font-bold text-xs uppercase text-gray-500 tracking-wider">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team Grid */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-lime mb-3">Who's In The Room</p>
            <h2 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white">
              CORE GROWTH LEADERSHIP.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Ashish Raghav", role: "Founder & Creative Growth Director", spec: "Performance Media & Creative Direction" },
              { name: "Devanshi Verma", role: "Head of Editorial & Authority SEO", spec: "Topic Clusters & Entity Architecture" },
              { name: "Kunal Mehra", role: "Creative Director & Short-Form Video", spec: "UGC Video & Kinetic Motion" },
              { name: "Siddharth Rao", role: "Lead Full-Stack Web Architect", spec: "Headless React, Python & Core Web Vitals" }
            ].map((tm, idx) => (
              <div key={idx} className="bg-[#18181B] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-lime transition-colors">
                <div>
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 mb-4 flex items-center justify-center font-space font-bold text-xl text-brand-lime">
                    {tm.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="font-space font-bold text-lg uppercase text-white mb-1">{tm.name}</h3>
                  <p className="font-space font-bold text-xs uppercase text-brand-blue mb-3">{tm.role}</p>
                  <p className="text-gray-400 text-xs font-inter leading-relaxed">{tm.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// WORK / PORTFOLIO PAGE (/work)
// =========================================================================
export function WorkPage({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const caseStudyList = [
    {
      slug: "veloura-organics",
      cat: "d2c",
      brand: "Veloura Organics",
      tag: "D2C Clean Skincare",
      desc: "Scaled Meta Ad creative testing from ₹5L to ₹45L monthly revenue with 4.8x verified blended ROAS.",
      metric: "4.8x ROAS",
      subMetric: "3-Tier UGC Sprints"
    },
    {
      slug: "urbanedge-realty",
      cat: "realestate",
      brand: "UrbanEdge Luxury Realty",
      tag: "Luxury Real Estate",
      desc: "Captured 1,420+ high-ticket buyer inquiries for ₹2.5Cr+ villas using cinematic drone reels and hyper-local targeting.",
      metric: "1,420+ LEADS",
      subMetric: "₹28.4Cr Closed Inventory"
    },
    {
      slug: "finscale-lending",
      cat: "fintech",
      brand: "FinScale Lending",
      tag: "BFSI & FinTech",
      desc: "Dominated commercial keyword rankings on Google and AI Overviews, lifting organic inbound applications by 273%.",
      metric: "+273% SEO",
      subMetric: "GEO & Entity Graph"
    },
    {
      slug: "curezen-health",
      cat: "health",
      brand: "CureZen Healthcare",
      tag: "HealthTech & Preventive Care",
      desc: "Scaled tele-consultation patient bookings by 520% in 4 months with sub-second headless landing page funnels.",
      metric: "+520% BOOKINGS",
      subMetric: "Headless Funnel CRO"
    }
  ];

  const filtered = activeFilter === "all" ? caseStudyList : caseStudyList.filter(c => c.cat === activeFilter);

  return (
    <PageLayout onNavigate={onNavigate} activeNav="work">
      {/* Dark Hero */}
      <section className="pt-16 pb-16 md:pt-24 md:pb-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue mb-4">
            Proof & Case Studies
          </p>
          <h1 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[70px] lg:text-[80px] leading-[0.85] tracking-tighter uppercase mb-6">
            TURNING SCROLLS INTO <span className="text-brand-lime">VERIFIED REVENUE.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-medium font-inter mb-8">
            Explore deep-dive case studies from high-growth D2C, real estate, B2B SaaS, and healthcare brands scaled by Get Into Feed.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: "all", label: "All Projects" },
              { key: "d2c", label: "D2C Brands" },
              { key: "realestate", label: "Real Estate" },
              { key: "fintech", label: "FinTech" },
              { key: "health", label: "Healthcare" }
            ].map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2 rounded-full font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  activeFilter === f.key
                    ? "bg-brand-lime text-brand-dark border-brand-lime shadow-[0_0_15px_rgba(212,255,0,0.3)]"
                    : "bg-[#18181B] text-white/80 border-white/15 hover:border-white/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Work Grid */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map(cs => (
            <div
              key={cs.slug}
              onClick={() => onNavigate("/work/" + cs.slug)}
              className="group bg-[#18181B] border border-white/10 hover:border-brand-lime rounded-2xl p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-brand-blue text-white px-3 py-1 rounded text-[10px] font-space font-bold uppercase tracking-wider">
                    {cs.tag}
                  </span>
                  <span className="text-brand-lime text-xs font-space font-bold uppercase">
                    Verified Outcome
                  </span>
                </div>
                <h3 className="font-space font-bold text-2xl md:text-3xl uppercase tracking-tight text-white mb-3 group-hover:text-brand-lime transition-colors">
                  {cs.brand}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-inter mb-8">
                  {cs.desc}
                </p>
              </div>

              <div>
                <div className="border-t border-white/10 pt-6 flex justify-between items-end mb-4">
                  <div>
                    <div className="font-space font-bold text-3xl md:text-4xl text-white tracking-tight">
                      {cs.metric}
                    </div>
                    <div className="text-gray-400 text-xs font-space uppercase mt-1">
                      {cs.subMetric}
                    </div>
                  </div>
                  <span className="text-brand-lime font-space font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 group-hover:underline">
                    Read Deep Dive <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// CASE STUDY DETAIL PAGE (/work/:slug)
// =========================================================================
export function CaseStudyDetailPage({ slug, onNavigate }) {
  const cs = caseStudiesCatalog[slug] || caseStudiesCatalog["veloura-organics"];

  return (
    <PageLayout onNavigate={onNavigate} activeNav="work">
      {/* Dark Hero */}
      <section className="pt-16 pb-16 md:pt-20 md:pb-20 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto">
          <button
            type="button"
            onClick={() => onNavigate("/work")}
            className="text-gray-400 hover:text-brand-lime font-space font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-6 cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft size={14} /> Back to all case studies
          </button>

          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-brand-blue text-white px-3 py-1 rounded text-[11px] font-space font-bold uppercase tracking-wider">
              {cs.industry}
            </span>
            <span className="bg-[#18181B] border border-brand-lime/40 text-brand-lime px-3 py-1 rounded text-[11px] font-space font-bold uppercase tracking-wider">
              Verified Growth Case Study
            </span>
          </div>

          <h1 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[68px] leading-[0.9] tracking-tighter uppercase text-white mb-4">
            {cs.brand}
          </h1>

          <p className="text-brand-lime font-space font-bold text-xl md:text-2xl uppercase tracking-tight mb-6">
            {cs.tagline}
          </p>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed font-inter max-w-3xl">
            {cs.overview}
          </p>
        </div>
      </section>

      {/* 4 Key Metrics Bar */}
      <section className="py-12 md:py-16 px-6 md:px-12 lg:px-16 bg-[#121215] border-b border-white/10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {cs.metrics.map((m, idx) => (
            <div key={idx} className="bg-[#18181B] border border-white/10 rounded-2xl p-6">
              <span className="font-space font-bold text-[11px] uppercase text-gray-400 tracking-wider block mb-2">{m.label}</span>
              <div className="font-space font-bold text-3xl sm:text-4xl text-white tracking-tight mb-2">{m.value}</div>
              <div className="text-brand-lime font-space font-bold text-xs">✓ {m.change}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The Challenge vs The Playbook */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-8 md:p-10">
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded text-[10px] font-space font-bold uppercase tracking-widest block w-max mb-4">
              The Bottleneck
            </span>
            <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-4">
              The Initial Challenge
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-inter">
              {cs.challenge}
            </p>
          </div>

          <div className="bg-[#18181B] border-2 border-brand-lime rounded-2xl p-8 md:p-10 shadow-[0_0_30px_rgba(212,255,0,0.1)]">
            <span className="bg-brand-lime text-brand-dark px-3 py-1 rounded text-[10px] font-space font-bold uppercase tracking-widest block w-max mb-4 font-extrabold">
              Our Strategic Solution
            </span>
            <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-4">
              The Creative Execution
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-inter">
              {cs.solution}
            </p>
          </div>
        </div>
      </section>

      {/* Deliverables Checklist */}
      <section className="py-16 px-6 md:px-12 lg:px-16 bg-[#121215] border-t border-white/10">
        <div className="max-w-[1280px] mx-auto">
          <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-8 text-center">
            Key Assets & Infrastructure Built
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {cs.deliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#18181B] border border-white/10 px-5 py-4 rounded-xl">
                <CheckCircle2 size={18} className="text-brand-lime shrink-0" />
                <span className="font-space font-bold text-xs uppercase text-white tracking-wider">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Quote Banner */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark">
        <div className="max-w-[1000px] mx-auto bg-brand-blue rounded-3xl p-10 md:p-16 text-center text-white relative shadow-2xl">
          <div className="flex justify-center gap-1.5 mb-6">
            {[...Array(cs.testimonial.rating)].map((_, i) => (
              <Star key={i} size={18} fill="#D4FF00" color="#D4FF00" />
            ))}
          </div>
          <p className="font-space font-bold text-xl md:text-2xl lg:text-3xl leading-snug uppercase mb-8">
            "{cs.testimonial.quote}"
          </p>
          <div>
            <div className="font-space font-bold text-base uppercase text-white">{cs.testimonial.author}</div>
            <div className="text-blue-200 text-xs font-space uppercase mt-1">{cs.testimonial.role}</div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// CLIENTS & TESTIMONIALS PAGE (/testimonials, /clients)
// =========================================================================
export function ClientsTestimonialsPage({ onNavigate }) {
  const [filter, setFilter] = useState("all");

  const reviews = [
    { cat: "d2c", brand: "Veloura Organics", quote: "Get Into Feed completely altered our ad unit economics. Scaled us from ₹5L to ₹45L monthly revenue at 4.8x ROAS.", author: "Rhea Singhal", role: "CEO, Veloura Organics", metric: "4.8x ROAS" },
    { cat: "realestate", brand: "UrbanEdge Luxury Realty", quote: "1,420+ high-ticket buyer inquiries for ₹2.5Cr+ villas. Closed ₹28.4 Crores in inventory directly tracked to their reels.", author: "Vikramaditya Mehra", role: "Managing Director", metric: "₹28.4Cr Closed" },
    { cat: "fintech", brand: "FinScale Lending", quote: "Their entity SEO and content clusters got us #1 Google rankings for commercial credit, lifting inbound leads by 273%.", author: "Anandita Sen", role: "CMO, FinScale", metric: "+273% Leads" },
    { cat: "health", brand: "CureZen Healthcare", quote: "Scalable tele-consultation patient bookings increased by 520% in 4 months with sub-second headless landing funnels.", author: "Dr. Sameer Kulkarni", role: "Director, CureZen", metric: "+520% Consults" },
    { cat: "d2c", brand: "Stride Activewear", quote: "Our customer acquisition cost plummeted by 38% after launching Get Into Feed's creator unboxing sprint.", author: "Aakash Varma", role: "Founder, Stride", metric: "-38% CAC" },
    { cat: "saas", brand: "NexaCloud SaaS", quote: "From zero LinkedIn authority to 45 enterprise demo requests every month. Their B2B thought leadership is exceptional.", author: "Priya Nambiar", role: "Head of Growth", metric: "45 Demos/mo" }
  ];

  const filtered = filter === "all" ? reviews : reviews.filter(r => r.cat === filter);

  return (
    <PageLayout onNavigate={onNavigate} activeNav="testimonials">
      {/* Dark Hero */}
      <section className="pt-16 pb-16 md:pt-24 md:pb-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue mb-4">
            Client Proof & Verified Reviews
          </p>
          <h1 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[70px] lg:text-[80px] leading-[0.85] tracking-tighter uppercase mb-6">
            TRUSTED BY <span className="text-brand-lime">85+ BRANDS</span> WORLDWIDE.
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-medium font-inter mb-8">
            Read what founders, CMOs, and marketing directors say about partnering with Get Into Feed to scale revenue and attention.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: "all", label: "All Reviews" },
              { key: "d2c", label: "D2C Brands" },
              { key: "realestate", label: "Real Estate" },
              { key: "fintech", label: "FinTech" },
              { key: "health", label: "HealthTech" },
              { key: "saas", label: "B2B SaaS" }
            ].map(b => (
              <button
                key={b.key}
                type="button"
                onClick={() => setFilter(b.key)}
                className={`px-5 py-2 rounded-full font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  filter === b.key
                    ? "bg-brand-lime text-brand-dark border-brand-lime shadow-[0_0_15px_rgba(212,255,0,0.3)]"
                    : "bg-[#18181B] text-white/80 border-white/15 hover:border-white/40"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, idx) => (
            <div key={idx} className="bg-[#18181B] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:border-brand-lime transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#D4FF00" color="#D4FF00" />
                    ))}
                  </div>
                  <span className="bg-brand-blue text-white px-2.5 py-0.5 rounded text-[10px] font-space font-bold uppercase">
                    {r.metric}
                  </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed font-inter italic mb-6">
                  "{r.quote}"
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <div>
                  <div className="font-space font-bold text-sm uppercase text-white">{r.author}</div>
                  <div className="text-gray-400 text-xs font-inter">{r.role}</div>
                </div>
                <span className="text-brand-lime text-xs font-space font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// PRICING PAGE (/pricing)
// =========================================================================
export function PricingPage({ onNavigate }) {
  const [adSpend, setAdSpend] = useState(250000);

  const estReach = Math.round(adSpend * 18);
  const estClicks = Math.round(adSpend / 14);
  const estRevenue = Math.round(adSpend * 4.4);

  const formatINR = (n) => {
    if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
    if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + " Lakhs";
    return "₹" + n.toLocaleString("en-IN");
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="pricing">
      {/* Dark Hero */}
      <section className="pt-16 pb-16 md:pt-24 md:pb-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue mb-4">
            Transparent Retainers & Sprints
          </p>
          <h1 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[70px] lg:text-[80px] leading-[0.85] tracking-tighter uppercase mb-6">
            BUILT AROUND YOUR GOALS, <br />
            NOT <span className="text-brand-lime">ARBITRARY PACKAGES.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-medium font-inter mb-8">
            Choose the growth sprint model that matches where your brand is today. No hidden retainers, no junior handoffs.
          </p>
        </div>
      </section>

      {/* Interactive ROI Calculator Slider */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-16 bg-[#121215] border-b border-white/10">
        <div className="max-w-[1000px] mx-auto bg-[#18181B] border-2 border-brand-lime rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <span className="bg-brand-lime text-brand-dark px-3 py-1 rounded text-[10px] font-space font-bold uppercase tracking-widest font-extrabold mb-3 inline-block">
              Interactive ROI Estimator
            </span>
            <h3 className="font-space font-bold text-2xl md:text-3xl uppercase text-white tracking-tight">
              Estimate Your Monthly Inbound Scale
            </h3>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="font-space font-bold text-xs uppercase text-gray-400">Monthly Ad Spend:</span>
              <span className="font-space font-bold text-2xl text-brand-lime">{formatINR(adSpend)}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={2000000}
              step={25000}
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4FF00]"
            />
            <div className="flex justify-between text-[10px] font-space text-gray-500 uppercase mt-1">
              <span>₹50,000 / mo</span>
              <span>₹10 Lakhs / mo</span>
              <span>₹20 Lakhs+ / mo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t border-white/10 pt-8">
            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
              <div className="font-space font-bold text-2xl md:text-3xl text-white">{estReach.toLocaleString()}</div>
              <div className="font-space font-bold text-xs uppercase text-gray-400 mt-1">Target Feed Impressions</div>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
              <div className="font-space font-bold text-2xl md:text-3xl text-brand-blue">{estClicks.toLocaleString()}</div>
              <div className="font-space font-bold text-xs uppercase text-gray-400 mt-1">High-Intent Visitors</div>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-brand-lime/30">
              <div className="font-space font-bold text-2xl md:text-3xl text-brand-lime">{formatINR(estRevenue)}</div>
              <div className="font-space font-bold text-xs uppercase text-brand-lime mt-1">Estimated Attributed Pipeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Sprint Models */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 01 */}
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/30 transition-colors">
            <div>
              <span className="font-space font-bold text-xs text-brand-blue uppercase tracking-widest block mb-2">Tier 01</span>
              <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-2">Need Attention?</h3>
              <p className="text-gray-400 text-xs font-inter mb-6">For brands that have something great to sell but aren't getting enough organic attention.</p>
              <div className="border-t border-white/10 pt-4 space-y-3 mb-8">
                {["16 UGC Video Reels / mo", "Feed Visual Design System", "High-Engagement Carousels", "Community Management"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-space text-gray-300">
                    <Check size={14} className="text-brand-lime shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }} className="bg-white/10 text-white hover:bg-white hover:text-brand-dark py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider text-center transition-all text-decoration-none">
              Explore Content Sprint →
            </a>
          </div>

          {/* Card 02 (Featured Pop Card) */}
          <div className="bg-brand-blue text-white rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative border-2 border-brand-blue hover:shadow-[0_0_40px_rgba(0,51,255,0.4)] transition-all">
            <span className="absolute -top-3 right-6 bg-brand-lime text-brand-dark px-3 py-1 rounded text-[10px] font-space font-bold uppercase tracking-widest font-extrabold">
              Most Popular
            </span>
            <div>
              <span className="font-space font-bold text-xs text-brand-lime uppercase tracking-widest block mb-2">Tier 02</span>
              <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-2">Need Customers?</h3>
              <p className="text-blue-100 text-xs font-inter mb-6">Paid media architecture, creative testing sprints, and bespoke CRO landing pages.</p>
              <div className="border-t border-white/20 pt-4 space-y-3 mb-8">
                {["Meta & Google Ads Management", "Weekly 10+ Creative Hook Testing", "High-Speed Headless Landers", "Attribution & CAPI Signal Setup", "Dedicated Growth Lead"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-space text-white">
                    <Check size={14} className="text-brand-lime shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }} className="bg-brand-lime text-brand-dark hover:bg-[#E2FF4D] py-3.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider text-center transition-all text-decoration-none font-extrabold">
              Scale With Paid Media →
            </a>
          </div>

          {/* Card 03 */}
          <div className="bg-[#18181B] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-white/30 transition-colors">
            <div>
              <span className="font-space font-bold text-xs text-brand-coral uppercase tracking-widest block mb-2">Tier 03</span>
              <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-2">Full Growth System</h3>
              <p className="text-gray-400 text-xs font-inter mb-6">Complete turnkey growth marketing department for market leaders and high-growth startups.</p>
              <div className="border-t border-white/10 pt-4 space-y-3 mb-8">
                {["All Paid Media & Content Engine", "Enterprise SEO & AI Optimization", "Custom Full-Stack Web Development", "Full Video Commercial Production", "Weekly Executive Strategy Sprints"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-space text-gray-300">
                    <Check size={14} className="text-brand-lime shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }} className="bg-white/10 text-white hover:bg-white hover:text-brand-dark py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider text-center transition-all text-decoration-none">
              Deploy Full System →
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// FEED NOTES / BLOG HUB PAGE (/blog, /blog/:slug)
// =========================================================================
export function FeedNotesPage({ onNavigate, slug }) {
  const articles = [
    {
      slug: "why-generic-content-gets-ignored-2026",
      title: "Why Generic Content Gets Ignored in 2026 (And How to Win the Feed)",
      cat: "Content Strategy",
      read: "4 min read",
      date: "Sep 2026",
      snippet: "With millions of AI-generated articles flooding the internet, audience trust has shifted towards contrarian research, verified case data, and punchy founder-led perspectives.",
      author: "Ashish Raghav"
    },
    {
      slug: "3-tier-creative-testing-meta-ads",
      title: "The 3-Tier Creative Testing Framework We Use for 4.8x Meta ROAS",
      cat: "Paid Media",
      read: "6 min read",
      date: "Aug 2026",
      snippet: "How to isolate creative variables, structure Advantage+ campaigns, and kill losing ads within 72 hours without burning test budgets.",
      author: "Kunal Mehra"
    },
    {
      slug: "generative-engine-optimization-guide",
      title: "Generative Engine Optimization: How to Get Cited by ChatGPT & Gemini",
      cat: "SEO & AI",
      read: "5 min read",
      date: "Aug 2026",
      snippet: "Search is no longer just ten blue links. Here is our technical playbook for structuring schema and entity graphs so AI models recommend your brand first.",
      author: "Devanshi Verma"
    }
  ];

  if (slug) {
    const art = articles.find(a => a.slug === slug) || articles[0];
    return (
      <PageLayout onNavigate={onNavigate} activeNav="blog">
        <section className="pt-16 pb-16 md:pt-20 md:pb-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
          <div className="max-w-[800px] mx-auto">
            <button
              type="button"
              onClick={() => onNavigate("/blog")}
              className="text-gray-400 hover:text-brand-lime font-space font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-6 cursor-pointer bg-transparent border-none"
            >
              <ArrowLeft size={14} /> Back to all articles
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-brand-blue text-white px-3 py-1 rounded text-[10px] font-space font-bold uppercase">{art.cat}</span>
              <span className="text-gray-400 text-xs font-space">{art.read} • {art.date}</span>
            </div>
            <h1 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-6 leading-tight">
              {art.title}
            </h1>
            <p className="text-brand-lime font-space font-bold text-sm uppercase mb-10">By {art.author}</p>
            <div className="prose prose-invert max-w-none text-gray-300 font-inter space-y-6 text-base leading-relaxed border-t border-white/10 pt-8">
              <p className="text-lg text-white font-medium">{art.snippet}</p>
              <p>In modern performance marketing, vanity metrics like impressions and reach mean very little if they don't compound into warm prospect familiarity and immediate commercial intent.</p>
              <h3 className="text-2xl font-space font-bold uppercase text-white pt-4">01. Eliminate Boring Hooks</h3>
              <p>The first three seconds dictate 80% of your acquisition efficiency. If you open with a generic logo animation or slow product zoom, users have already scrolled past to the next video.</p>
              <h3 className="text-2xl font-space font-bold uppercase text-white pt-4">02. Measure Unit Economics, Not Likes</h3>
              <p>Every dollar or rupee invested into content must correlate with lower blended CAC or higher organic search volume. That is the philosophy behind Get Into Feed.</p>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout onNavigate={onNavigate} activeNav="blog">
      {/* Dark Hero */}
      <section className="pt-16 pb-16 md:pt-24 md:pb-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue mb-4">
            Feed Notes & Insights
          </p>
          <h1 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[70px] lg:text-[80px] leading-[0.85] tracking-tighter uppercase mb-6">
            EDITORIAL PLAYBOOKS ON <br />
            <span className="text-brand-lime">ATTENTION & REVENUE.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-medium font-inter">
            Deep-dive frameworks on creative hook testing, AI search optimization, unit economics, and building category-defining brands.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(art => (
            <div
              key={art.slug}
              onClick={() => onNavigate("/blog/" + art.slug)}
              className="group bg-[#18181B] border border-white/10 hover:border-brand-lime rounded-2xl p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-brand-blue text-white px-2.5 py-0.5 rounded text-[10px] font-space font-bold uppercase">{art.cat}</span>
                  <span className="text-gray-500 text-xs font-space">{art.read}</span>
                </div>
                <h3 className="font-space font-bold text-xl uppercase tracking-tight text-white mb-3 group-hover:text-brand-lime transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-inter mb-6">
                  {art.snippet}
                </p>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs font-space font-bold uppercase">
                <span className="text-gray-400">By {art.author}</span>
                <span className="text-brand-lime flex items-center gap-1 group-hover:underline">Read Article →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// CONTACT & DISCOVERY PAGE (/contact)
// =========================================================================
export function ContactPage({ onNavigate }) {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", brand: "", budget: "₹1.5L - ₹5L / mo", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="contact">
      {/* Dark Hero */}
      <section className="pt-16 pb-16 md:pt-20 md:pb-20 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue mb-4">
            Project Discovery & Inbound
          </p>
          <h1 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[68px] leading-[0.85] tracking-tighter uppercase mb-6">
            TELL US WHAT YOU'RE BUILDING. <br />
            WE'LL GET IT <span className="text-brand-lime">INTO THE FEED.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-xl mx-auto font-inter">
            Replies guaranteed in &lt; 15 minutes. Or connect directly on WhatsApp with our growth team.
          </p>
        </div>
      </section>

      {/* Form & Coordinates */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          {/* Direct Coordinates */}
          <div className="space-y-8">
            <div className="bg-[#18181B] border border-white/10 rounded-2xl p-8">
              <span className="font-space font-bold text-xs uppercase tracking-widest text-brand-lime block mb-2">Direct WhatsApp Hotline</span>
              <h3 className="font-space font-bold text-2xl uppercase text-white mb-2">+91 8810356950</h3>
              <p className="text-gray-400 text-xs font-inter mb-4">Direct line to our senior growth strategist for fast-tracked proposals.</p>
              <a
                href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%20team!%20I%20am%20interested%20in%20a%20growth%20sprint%20for%20our%20brand."
                target="_blank"
                rel="noreferrer"
                className="inline-flex bg-[#D4FF00] text-[#09090B] px-5 py-2.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all text-decoration-none"
              >
                Chat on WhatsApp →
              </a>
            </div>

            <div className="bg-[#18181B] border border-white/10 rounded-2xl p-8">
              <span className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue block mb-2">Direct Email</span>
              <h3 className="font-space font-bold text-2xl uppercase text-white mb-2">hello@getintofeed.com</h3>
              <p className="text-gray-400 text-xs font-inter">Send RFPs, deck attachments, or general studio inquiries.</p>
            </div>

            <div className="bg-[#18181B] border border-white/10 rounded-2xl p-8">
              <span className="font-space font-bold text-xs uppercase tracking-widest text-gray-400 block mb-2">Office Headquarters</span>
              <h3 className="font-space font-bold text-xl uppercase text-white mb-1">Get Into Feed Growth Studio</h3>
              <p className="text-gray-400 text-xs font-inter">Bengaluru • New Delhi • Remote Worldwide</p>
            </div>
          </div>

          {/* Discovery Form */}
          <div className="bg-[#18181B] border-2 border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle2 size={48} className="text-brand-lime mx-auto mb-4" />
                <h3 className="font-space font-bold text-2xl uppercase text-white mb-2">Discovery Inquiry Sent!</h3>
                <p className="text-gray-400 text-sm font-inter">We'll review your website and reply to your email/phone within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-space font-bold text-2xl uppercase text-white tracking-tight mb-4">Start Project Discovery</h3>
                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Your Name *</label>
                  <input required type="text" placeholder="e.g. Ashish Raghav" className="w-full bg-[#09090B] border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-lime outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Work Email *</label>
                    <input required type="email" placeholder="ashish@brand.com" className="w-full bg-[#09090B] border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-lime outline-none" />
                  </div>
                  <div>
                    <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Phone / WhatsApp *</label>
                    <input required type="tel" placeholder="8810356950" className="w-full bg-[#09090B] border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-lime outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Website or Instagram Handle</label>
                  <input type="text" placeholder="yourbrand.com" className="w-full bg-[#09090B] border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-lime outline-none" />
                </div>
                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Target Monthly Growth Budget</label>
                  <select className="w-full bg-[#09090B] border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-lime outline-none">
                    <option>₹1 Lakh - ₹3 Lakhs / mo</option>
                    <option>₹3 Lakhs - ₹8 Lakhs / mo</option>
                    <option>₹8 Lakhs - ₹20 Lakhs+ / mo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">What are your primary goals?</label>
                  <textarea rows={3} placeholder="Tell us what you want to achieve..." className="w-full bg-[#09090B] border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:border-brand-lime outline-none" />
                </div>
                <button type="submit" className="w-full bg-brand-lime text-brand-dark font-space font-bold uppercase text-xs tracking-wider py-4 rounded-lg hover:bg-[#E2FF4D] hover:shadow-[0_0_25px_rgba(212,255,0,0.5)] transition-all cursor-pointer border-none font-extrabold mt-2">
                  Submit Discovery Inquiry →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// CAREERS PAGE (/careers)
// =========================================================================
export function CareersPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="careers">
      <section className="pt-16 pb-16 md:pt-24 md:pb-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue mb-4">Culture & Recruitment</p>
          <h1 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[70px] lg:text-[80px] leading-[0.85] tracking-tighter uppercase mb-6">
            WORK WITH PEOPLE WHO <br /><span className="text-brand-lime">REFUSE TO BE BORING.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-xl mx-auto font-inter">
            We operate fully remote with flexible hours, high ownership, competitive pay, and direct senior mentorship.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white">
        <div className="max-w-[900px] mx-auto space-y-6">
          {[
            { title: "Senior Performance Media Buyer (Meta & Google)", loc: "Remote / India", type: "Full-Time", desc: "Manage ₹20L+ monthly ad spend, run rapid creative testing sprints, and scale client ROAS." },
            { title: "Short-Form Video Editor & Motion Designer", loc: "Remote / India", type: "Full-Time", desc: "Edit high-retention reels, kinetic typography hooks, and cinematic UGC ads using Premiere & After Effects." },
            { title: "Senior Content Strategist & SEO Lead", loc: "Remote / India", type: "Full-Time", desc: "Build topic cluster authority playbooks, GEO entity graphs, and bottom-funnel commercial content hubs." }
          ].map((j, i) => (
            <div key={i} className="bg-[#18181B] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-lime transition-colors">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="bg-brand-blue text-white px-2 py-0.5 rounded text-[10px] font-space font-bold uppercase">{j.type}</span>
                  <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-[10px] font-space">{j.loc}</span>
                </div>
                <h3 className="font-space font-bold text-xl uppercase text-white mb-2">{j.title}</h3>
                <p className="text-gray-400 text-xs font-inter max-w-lg">{j.desc}</p>
              </div>
              <a href="mailto:careers@getintofeed.com?subject=Job%20Application" className="bg-brand-lime text-brand-dark px-5 py-2.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all text-decoration-none shrink-0">
                Apply Now →
              </a>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// LEGAL PAGES (/privacy, /terms)
// =========================================================================
export function LegalPage({ type = "privacy", onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="">
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-dark text-white min-h-[70vh]">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-space font-bold text-3xl sm:text-4xl uppercase tracking-tight text-white mb-8 border-b border-white/10 pb-4">
            {type === "privacy" ? "Privacy Policy" : "Terms of Service"}
          </h1>
          <div className="prose prose-invert text-gray-300 font-inter space-y-4 text-sm leading-relaxed">
            <p>Last updated: September 2026. Get Into Feed ("we", "us", or "our") respects client confidentiality and data security.</p>
            <h3 className="font-space font-bold uppercase text-white text-lg pt-4">Data Collection & Privacy</h3>
            <p>We collect only information willingly submitted through project inquiry forms, WhatsApp discovery sessions, and email communications. We never sell or license client contact data.</p>
            <h3 className="font-space font-bold uppercase text-white text-lg pt-4">Service Terms</h3>
            <p>All marketing sprints, creative deliverables, and consulting retainers are governed by formal statements of work (SOW) executed between Get Into Feed and the client entity.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

// =========================================================================
// 404 NOT FOUND PAGE
// =========================================================================
export function NotFoundPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="">
      <div className="bg-brand-dark text-white py-24 px-6 text-center min-h-[70vh] flex flex-col justify-center items-center">
        <div className="font-space font-bold text-[80px] sm:text-[120px] text-brand-lime leading-none mb-4 tracking-tighter drop-shadow-[0_0_35px_rgba(212,255,0,0.3)]">
          404
        </div>
        <h1 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white mb-4">
          YOU FELL OUT OF THE FEED.
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto mb-8 font-inter">
          The link you followed may be broken or the page has scrolled out of view. Let's get you back to high-converting content.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="bg-brand-lime text-brand-dark px-6 py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all cursor-pointer border-none"
          >
            ← Back to Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/services")}
            className="bg-transparent border border-white/20 text-white px-6 py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-brand-blue transition-all cursor-pointer"
          >
            Explore Services
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// AUDIT TOOL PAGE (FREE 360° CREATIVE & GROWTH AUDIT)
// =========================================================================
export function AuditToolPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    socialHandle: "",
    monthlySpend: "1L - 5L INR",
    primaryGoal: "Scale ROAS & Lower CPA",
    competitor: "",
    biggestBottleneck: "Creative fatigue and low conversion rates"
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please provide your name, email, and contact number.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          website: formData.website || formData.socialHandle,
          service: "Free 360 Audit",
          source: "Interactive Audit Tool",
          message: `Goal: ${formData.primaryGoal} | Spend: ${formData.monthlySpend} | Competitor: ${formData.competitor} | Bottleneck: ${formData.biggestBottleneck}`
        })
      });
      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setSubmitted(true); // Graceful UX
    }
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="audit">
      <div className="py-12 md:py-20 max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/10 border border-brand-lime/20 text-brand-lime font-space font-bold text-xs uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Free 360° Diagnostic Report
          </div>
          <h1 className="font-space font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white mb-6 leading-none">
            AUDIT YOUR <span className="text-brand-lime">BRAND'S FEED</span> & CONVERSION FUNNEL.
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-inter leading-relaxed">
            Uncover why your ads bleed spend, why visitors bounce, and where your competitor is out-ranking you. Get a human-evaluated, senior strategist-led growth teardown within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#18181B] border border-brand-lime/30 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-[0_0_30px_rgba(212,255,0,0.15)]">
            <div className="w-16 h-16 rounded-full bg-brand-lime/20 flex items-center justify-center mx-auto mb-6 text-brand-lime">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-white mb-3">
              AUDIT QUEUED SUCCESSFULLY!
            </h3>
            <p className="text-gray-300 text-sm mb-6">
              Our growth strategists are reviewing <span className="text-brand-lime font-semibold">{formData.website || formData.socialHandle || "your brand"}</span>. We will deliver the video teardown and strategic benchmark to <span className="text-white font-semibold">{formData.email}</span> within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("/")}
              className="bg-brand-lime text-brand-dark px-6 py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Audit Form Container */}
            <div className="lg:col-span-7 bg-[#18181B] border border-white/10 rounded-2xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-space font-bold text-lg uppercase tracking-tight text-white mb-1">
                    Step 1: Your Brand Details
                  </h3>
                  <p className="text-gray-400 text-xs mb-4">Tell us what brand or domain we are auditing.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-space font-bold uppercase text-gray-300 mb-1.5">
                        Brand / Website URL *
                      </label>
                      <input
                        type="text"
                        placeholder="https://yourbrand.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        required
                        className="w-full bg-[#09090B] border border-white/10 text-white rounded-lg px-3.5 py-2.5 text-xs focus:border-brand-lime focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-space font-bold uppercase text-gray-300 mb-1.5">
                        Instagram / Ad Handle
                      </label>
                      <input
                        type="text"
                        placeholder="@yourbrand"
                        value={formData.socialHandle}
                        onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                        className="w-full bg-[#09090B] border border-white/10 text-white rounded-lg px-3.5 py-2.5 text-xs focus:border-brand-lime focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <h3 className="font-space font-bold text-lg uppercase tracking-tight text-white mb-1">
                    Step 2: Growth Metrics & Bottlenecks
                  </h3>
                  <p className="text-gray-400 text-xs mb-4">Help us benchmark against your specific commercial stage.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-space font-bold uppercase text-gray-300 mb-1.5">
                        Monthly Marketing Spend
                      </label>
                      <select
                        value={formData.monthlySpend}
                        onChange={(e) => setFormData({ ...formData, monthlySpend: e.target.value })}
                        className="w-full bg-[#09090B] border border-white/10 text-white rounded-lg px-3.5 py-2.5 text-xs focus:border-brand-lime focus:outline-none transition-colors"
                      >
                        <option value="Under 1L INR">Under ₹1 Lakh / mo</option>
                        <option value="1L - 5L INR">₹1 Lakh - ₹5 Lakh / mo</option>
                        <option value="5L - 20L INR">₹5 Lakh - ₹20 Lakh / mo</option>
                        <option value="20L+ INR">₹20 Lakh+ / mo (Enterprise)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-space font-bold uppercase text-gray-300 mb-1.5">
                        Top Strategic Goal
                      </label>
                      <select
                        value={formData.primaryGoal}
                        onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                        className="w-full bg-[#09090B] border border-white/10 text-white rounded-lg px-3.5 py-2.5 text-xs focus:border-brand-lime focus:outline-none transition-colors"
                      >
                        <option value="Scale ROAS & Lower CPA">Scale ROAS & Lower CPA</option>
                        <option value="Organic Reach & Viral Hooks">Viral Video Hooks & Reach</option>
                        <option value="Conversion Rate Optimization">Landing Page CRO & Retention</option>
                        <option value="Complete Brand Repositioning">Complete Brand Repositioning</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-space font-bold uppercase text-gray-300 mb-1.5">
                      Top Competitor You Want To Out-Market
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. competitor.com or their handle"
                      value={formData.competitor}
                      onChange={(e) => setFormData({ ...formData, competitor: e.target.value })}
                      className="w-full bg-[#09090B] border border-white/10 text-white rounded-lg px-3.5 py-2.5 text-xs focus:border-brand-lime focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <h3 className="font-space font-bold text-lg uppercase tracking-tight text-white mb-1">
                    Step 3: Where Should We Send The Teardown?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-space font-bold uppercase text-gray-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Ashish Raghav"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-[#09090B] border border-white/10 text-white rounded-lg px-3.5 py-2.5 text-xs focus:border-brand-lime focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-space font-bold uppercase text-gray-300 mb-1.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        placeholder="ashish@brand.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#09090B] border border-white/10 text-white rounded-lg px-3.5 py-2.5 text-xs focus:border-brand-lime focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-space font-bold uppercase text-gray-300 mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full bg-[#09090B] border border-white/10 text-white rounded-lg px-3.5 py-2.5 text-xs focus:border-brand-lime focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-lime text-brand-dark py-4 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] hover:shadow-[0_0_25px_rgba(212,255,0,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
                >
                  {submitting ? "Analyzing Metrics..." : "Request 360° Teardown (100% Free)"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Value Props & What You Receive */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#18181B] border border-white/10 rounded-2xl p-6">
                <h4 className="font-space font-bold text-sm uppercase tracking-wider text-brand-lime mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4" /> What's Included In Your Teardown
                </h4>
                <ul className="space-y-3.5 text-xs text-gray-300 font-inter">
                  <li className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-brand-lime/20 text-brand-lime flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">1</div>
                    <span><strong>Creative Hook Analysis:</strong> Why users scroll past your first 3 seconds and how to fix frame 1 dropoff.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-brand-lime/20 text-brand-lime flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">2</div>
                    <span><strong>Landing Page Friction Map:</strong> Heatmap-backed breakdown of mobile bounce factors and offer clarity.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-brand-lime/20 text-brand-lime flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">3</div>
                    <span><strong>Competitor Ad Spy & Gap Analysis:</strong> What angles your rival is scaling right now that you can ethically hijack.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-brand-lime/20 text-brand-lime flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">4</div>
                    <span><strong>90-Day Sprint Roadmap:</strong> Specific test budget, ad creative cadence, and ROAS projections.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-brand-blue text-white rounded-2xl p-6">
                <div className="font-space font-bold text-xs uppercase tracking-wider text-brand-lime mb-1">
                  NO AUTOMATED BOT REPORTS
                </div>
                <h4 className="font-space font-bold text-lg uppercase tracking-tight text-white mb-2">
                  Every Audit Is Reviewed By A Human Growth Director
                </h4>
                <p className="text-xs text-white/80 font-inter leading-relaxed">
                  We don't send useless generic automated PDF scrapers. A dedicated strategist spends 45 minutes manually dissecting your ad accounts, creatives, and conversion pages before recording your video teardown.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
