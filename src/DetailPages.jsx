
export function getStoredBlogPosts() {
  try {
    const saved = localStorage.getItem("gif_blog_posts");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return blogPostsCatalog;
}

export function getStoredReviews() {
  try {
    const saved = localStorage.getItem("gif_reviews_catalog");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return reviewsCatalog;
}

export function getStoredSEOTags() {
  try {
    const saved = localStorage.getItem("gif_custom_seo_tags");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === "object" && parsed !== null) return parsed;
    }
  } catch {}
  return {};
}

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clapperboard,
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
  Heart,
  HelpCircle,
  Instagram,
  Lightbulb,
  Linkedin,
  Lock,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  PenTool,
  Phone,
  Play,
  Plus,
  Quote,
  Search,
  Send,
  Share2,
  Shield,
  ShieldCheck,
  Smile,
  Sliders,
  Sparkles,
  Star,
  Tag,
  ThumbsUp,
  User,
  Users,
  Video,
  X,
  Zap
} from "lucide-react";
import { UniversalLeadModal } from "./components/UniversalLeadModal";
import { trackLeadConversion, trackEvent } from "./utils/analytics.js";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

// =========================================================================
// SERVICES MASTER DATA CATALOG
// =========================================================================
export const servicesCatalog = [
  {
    slug: "branding",
    title: "Brand Positioning & Visual Identity",
    shortDesc: "Architect high-status brand narratives, typography systems, and visual guidelines that command premium pricing and stand out in the feed.",
    icon: PenTool,
    category: "Creative Direction",
    deliverables: ["Brand Strategy & Narrative", "Visual Identity & Styleguide", "Typography & Color Matrix", "Design System & Figma Kit", "Social Media Templates"],
    pricingTier: "From ₹75,000 / Sprint",
    overview: "In a digital world crowded with derivative templates, strong brand positioning is your greatest economic moat. We don't just design logos — we engineer complete visual and narrative ecosystems that trigger immediate trust, customer desire, and distinct brand recall.",
    whatWeDo: [
      "Deep brand diagnosis, market positioning, and ethical competitor gap analysis",
      "Comprehensive typography hierarchy, color theory, and logo vector suite",
      "Brand voice, tone of voice guidelines, and high-converting messaging frameworks",
      "Multi-format creative guidelines for reels, static ads, packaging, and web",
      "Figma design tokens ready for engineering and marketing execution"
    ],
    strategySteps: [
      { step: "01", name: "Strategic Discovery", desc: "Audit your current market standing, audience demographics, and core commercial thesis." },
      { step: "02", name: "Visual Identity System", desc: "Craft bold typography pairings, signature color accents, and motion brand assets." },
      { step: "03", name: "Messaging Framework", desc: "Codify your value proposition, customer pain points, and memorable brand hooks." },
      { step: "04", name: "Brand Book Delivery", desc: "Deliver production-ready Figma files, export assets, and social starter kits." }
    ],
    faqs: [
      { q: "How long does a branding sprint take?", a: "A standard brand positioning sprint runs 2 to 3 weeks with weekly design reviews." },
      { q: "Do you deliver vector source files?", a: "Yes, you receive full Figma source files, SVG/PNG/EPS vectors, and typography licenses." }
    ]
  },
  {
    slug: "performance-marketing",
    title: "Paid Media & Performance Ads",
    shortDesc: "Meta, Google, & YouTube ad campaigns engineered for positive unit economics, high blended ROAS, and predictable customer acquisition.",
    icon: Megaphone,
    category: "Paid Performance",
    deliverables: ["Meta Ads (FB & IG)", "Google Search & Shopping", "YouTube Video Ads", "Daily Creative Testing", "Server-Side CAPI Tracking"],
    pricingTier: "From ₹60,000 / mo + % Spend",
    overview: "We eliminate ad spend waste. Our paid performance engine pairs rigorous mathematical targeting with relentless creative testing to acquire high-LTV customers and scale profitably across Meta, Google Search, and YouTube.",
    whatWeDo: [
      "High-ROAS account structure architecture (TOFU, MOFU, BOFU)",
      "Daily creative hook variation testing (static cards, UGC reels, motion graphics)",
      "Conversion API (CAPI) and GA4 server-side attribution setup",
      "Landing page CRO integration to maximize post-click conversion rates",
      "Weekly transparent P&L reporting and cohort ROAS analysis"
    ],
    strategySteps: [
      { step: "01", name: "Tracking & Account Audit", desc: "Verify pixel health, UTM hygiene, and historical CPA benchmarks." },
      { step: "02", name: "Creative Rapid Prototyping", desc: "Launch 10+ new hook angles, script variations, and visual hooks weekly." },
      { step: "03", name: "Algorithmic Scaling", desc: "Gradually inject ad spend into proven winners using automated bidding rules." },
      { step: "04", name: "Retention & Remarketing", desc: "Target high-intent abandoners with dynamic social proof and limited-time offers." }
    ],
    faqs: [
      { q: "What is the minimum ad spend required?", a: "We recommend a minimum ad budget of ₹1,00,000/month so the algorithms have enough conversion data to optimize." },
      { q: "Who pays the ad networks?", a: "You pay Meta and Google directly through your own business manager; we manage the strategy and execution." }
    ]
  },
  {
    slug: "social-media",
    title: "Organic Social & Content Engine",
    shortDesc: "Turn your Instagram and LinkedIn feeds into high-velocity community engines that generate organic brand authority and inbound leads.",
    icon: Users,
    category: "Organic Growth",
    deliverables: ["Content Strategy & Calendar", "15-20 Monthly Carousel & Posts", "Community Engagement", "Stories & Highlights Architecture", "Trend Hijacking"],
    pricingTier: "From ₹50,000 / mo",
    overview: "Vanity likes don't pay bills. Our organic social media methodology focuses on producing content that stops thumbs, sparks conversations, and funnels followers into actual qualified inquiries.",
    whatWeDo: [
      "Custom monthly editorial calendar tailored to your industry trends",
      "High-value educational carousels, industry memes, and thought leadership graphics",
      "Active comment section moderation and proactive community engagement",
      "Instagram Stories nurturing and pinned highlight funnel setup",
      "Monthly performance breakdown of reach, saves, profile visits, and DM leads"
    ],
    strategySteps: [
      { step: "01", name: "Content Pillar Mapping", desc: "Identify the 4-5 thematic pillars that best communicate your expertise." },
      { step: "02", name: "Batch Production", desc: "Design, write, and schedule 30 days of branded content in advance." },
      { step: "03", name: "Community Management", desc: "Engage with ideal client profiles in the comments and build relationship capital." },
      { step: "04", name: "Iteration", desc: "Double down on formats generating the highest saves, shares, and profile clicks." }
    ],
    faqs: [
      { q: "How often will you post on our channels?", a: "Typically 4 to 5 times per week across Instagram and LinkedIn for consistent algorithm momentum." },
      { q: "Do we approve content before it goes live?", a: "Yes, you approve all posts in advance through a streamlined Notion or Google Drive calendar." }
    ]
  },
  {
    slug: "content-creation",
    title: "Short-Form Video & Reel Production",
    shortDesc: "High-retention 9:16 vertical video designed specifically for Instagram Reels, YouTube Shorts, and TikTok algorithms.",
    icon: Clapperboard,
    category: "Video Production",
    deliverables: ["Scriptwriting & Hooks", "Studio & UGC Editing", "Kinetic Subtitles & Sound Design", "Visual Hooks & B-Roll", "Batch Production Sprints"],
    pricingTier: "From ₹65,000 / mo",
    overview: "The modern consumer's attention span is 3 seconds. If your frame 1 hook doesn't stop their thumb, your budget is gone. We produce high-velocity short-form reels with kinetic subtitles, aggressive pacing, and clear calls to action.",
    whatWeDo: [
      "Scripting high-retention frameworks: Problem-Agitate-Solve, Curiosity Gap, and Proof-First",
      "Dynamic vertical editing with fast cuts, sound effects, and zoom transitions",
      "Word-by-word kinetic subtitles styled to match your brand colors",
      "Platform-specific aspect ratio optimization (9:16) for Reels, Shorts, and TikTok",
      "A/B hook testing for performance ads"
    ],
    strategySteps: [
      { step: "01", name: "Hook Ideation", desc: "Script 20+ viral hook variations based on trending search queries." },
      { step: "02", name: "Filming or Asset Intake", desc: "Guide your team on shooting with phones or ingest existing footage." },
      { step: "03", name: "High-Octane Post-Production", desc: "Add sound effects, kinetic typography, b-roll overlays, and color grading." },
      { step: "04", name: "Distribution & Ads Sync", desc: "Deploy winning cuts into organic reels and performance ad sets." }
    ],
    faqs: [
      { q: "Do we have to be on camera?", a: "Not necessarily. We also produce voiceover-led explainer reels, motion typography, and curated b-roll." },
      { q: "What turnaround time can we expect?", a: "Batches of 8-12 edited reels are delivered within 5 business days after footage approval." }
    ]
  },
  {
    slug: "web-development",
    title: "Web Design & Conversion Funnels",
    shortDesc: "Blazing-fast, modern React & Next.js websites and high-converting landing pages built to convert cold visitors into signed contracts.",
    icon: Code,
    category: "Development & CRO",
    deliverables: ["Custom React / Tailwind Build", "Mobile-First UX/UI Design", "High-Converting CRO Funnels", "SEO & Speed Optimization (95+ Lighthouse)", "CMS & Form Integration"],
    pricingTier: "From ₹85,000 / Project",
    overview: "Your website is your best salesperson. We engineer lightning-fast digital storefronts with flawless mobile ergonomics, punchy typography, and zero layout shift that convert traffic into revenue.",
    whatWeDo: [
      "Full custom design in Figma followed by hand-coded React/Tailwind build",
      "Sub-second load times with 95+ Google PageSpeed Core Web Vitals score",
      "Conversion Rate Optimization (CRO) heatmaps, sticky CTAs, and frictionless forms",
      "Interactive product tools, ROI calculators, and lead qualification modals",
      "Direct API and CRM synchronization (PostgreSQL, HubSpot, WhatsApp)"
    ],
    strategySteps: [
      { step: "01", name: "Wireframing & Copywriting", desc: "Structure information hierarchy focused on clarity and objection handling." },
      { step: "02", name: "Figma Interactive Mockup", desc: "Design pixel-perfect desktop and mobile views with modern micro-animations." },
      { step: "03", name: "Production Engineering", desc: "Code the application with responsive Tailwind, React components, and clean semantics." },
      { step: "04", name: "Testing & Deployment", desc: "Test on iOS, Android, and desktop browsers before deploying to global CDN." }
    ],
    faqs: [
      { q: "Which tech stack do you use?", a: "We primarily build with modern React, Tailwind CSS, Vite, and Python FastAPI/Node backends." },
      { q: "Is the site mobile friendly?", a: "100%. We design mobile-first since over 70% of modern feed traffic visits on mobile devices." }
    ]
  },
  {
    slug: "seo",
    title: "AI Search & Programmatic SEO",
    shortDesc: "Dominate both traditional Google SERP and modern AI answer engines (Perplexity, ChatGPT Search) with authoritative content clusters.",
    icon: Search,
    category: "Organic Search",
    deliverables: ["Technical SEO Audit & Fixes", "High-Intent Keyword Research", "Topic Clusters & Content Silos", "Schema.org & LLM Citation Optimization", "Quality Backlink Strategy"],
    pricingTier: "From ₹55,000 / mo",
    overview: "Search has changed forever. It's no longer just about Google 10 blue links; it's about being cited by generative AI engines. We build technical foundations and authoritative content hubs that generate compounding organic inbound pipeline.",
    whatWeDo: [
      "Comprehensive crawl analysis, Core Web Vitals remediation, and canonical hygiene",
      "Bottom-of-funnel keyword targeting with high commercial purchase intent",
      "Structured data JSON-LD implementation (Organization, Service, FAQ, Article)",
      "GEO-targeted landing page templates and local Google Business Profile optimization",
      "Transparent rank tracking and organic lead conversion analytics"
    ],
    strategySteps: [
      { step: "01", name: "Technical Diagnostics", desc: "Identify and resolve indexation bottlenecks, slow assets, and 404 links." },
      { step: "02", name: "Commercial Keyword Matrix", desc: "Map search terms that prospective clients type immediately before buying." },
      { step: "03", name: "Pillar Content Sprints", desc: "Publish comprehensive editorial guides that establish unquestioned authority." },
      { step: "04", name: "Citation Building", desc: "Secure editorial mentions and quality backlinks from verified industry publishers." }
    ],
    faqs: [
      { q: "How long does SEO take to produce results?", a: "Noticeable rank and traffic shifts typically manifest between months 2 and 4, compounding thereafter." },
      { q: "Do you guarantee #1 rankings?", a: "No ethical agency can guarantee specific algorithmic positions, but we guarantee measurable traffic and lead growth." }
    ]
  },
  {
    slug: "influencer-network",
    title: "Influencer & Creator Network",
    shortDesc: "Partner with vetted niche creators to produce authentic, relatable user-generated content (UGC) that out-converts traditional studio ads.",
    icon: Sparkles,
    category: "Creator Marketing",
    deliverables: ["Creator Outreach & Vetting", "Creative Briefs & Storyboards", "Contracting & Usage Rights", "Whitelisting / Spark Ads Setup", "UGC Asset Library"],
    pricingTier: "From ₹65,000 / Campaign",
    overview: "Modern consumers buy from people, not faceless logos. We manage end-to-end creator collaborations that yield authentic storytelling, relatable social proof, and high-converting creative for your paid media campaigns.",
    whatWeDo: [
      "Discovery and vetting of creators based on authentic engagement rates, not fake followers",
      "Clear creative brief writing ensuring creators hit your key value propositions naturally",
      "Full negotiation of perpetual digital ad usage and whitelisting rights",
      "Seamless delivery of raw unedited footage and polished creator cuts",
      "Meta Partnership Ads / TikTok Spark Ads deployment"
    ],
    strategySteps: [
      { step: "01", name: "Creator Matchmaking", desc: "Filter candidates by audience overlap, aesthetic compatibility, and tone." },
      { step: "02", name: "Brief & Product Seeding", desc: "Ship products and supply bulletproof creative guidelines with required hooks." },
      { step: "03", name: "Asset Review & Rights", desc: "Review video drafts, ensure compliance, and secure digital licensing." },
      { step: "04", name: "Paid Amplification", desc: "Whitelabel the top 10% highest-converting creator videos across paid channels." }
    ],
    faqs: [
      { q: "Do creator fees come out of your retainer?", a: "Creator compensation is paid directly by your brand; our fee covers matchmaking, briefing, and campaign management." },
      { q: "Who owns the creator video rights?", a: "Your brand retains perpetual digital usage rights for organic posting and paid ad sets." }
    ]
  },
  {
    slug: "analytics",
    title: "Analytics, CRO & Retention Funnels",
    shortDesc: "End-to-end measurement pipelines that connect marketing touchpoints to bank revenue, repeat purchases, and optimized lifetime value.",
    icon: Globe2,
    category: "Data & Retention",
    deliverables: ["GA4 & BigQuery Analytics", "Post-Purchase Email & SMS Funnels", "Heatmap & User Session Tracking", "Cohort LTV & Churn Analysis", "Automated Executive Dashboards"],
    pricingTier: "From ₹50,000 / mo",
    overview: "You cannot scale what you cannot measure. We build bulletproof attribution models and retention funnels that reveal your true cost of customer acquisition, leakages in your funnel, and strategies to increase repeat revenue.",
    whatWeDo: [
      "Custom GA4 event tracking, UTM taxonomy, and cross-domain tracking setup",
      "Klaviyo / WhatsApp automated retention flows (abandoned cart, post-purchase, win-back)",
      "Microsoft Clarity heatmap analysis to pinpoint user drop-off points",
      "Customer lifetime value (LTV) cohort analysis and payback period models",
      "Automated Looker Studio dashboards providing real-time agency KPIs"
    ],
    strategySteps: [
      { step: "01", name: "Data Pipeline Audit", desc: "Verify data integrity across pixels, analytics platforms, and payment gateways." },
      { step: "02", name: "Friction Point Discovery", desc: "Analyze user session recordings to spot where checkout friction occurs." },
      { step: "03", name: "Automated Lifecycle Flows", desc: "Deploy personalized email, SMS, and WhatsApp sequences that drive repeat sales." },
      { step: "04", name: "Continuous Optimization", desc: "Conduct monthly A/B tests on headline copy, offer structures, and checkout flows." }
    ],
    faqs: [
      { q: "Can you fix broken Meta Pixel / GA4 tracking?", a: "Yes, our technical team specializes in debugging and implementing server-side CAPI tracking." },
      { q: "What CRM tools do you support?", a: "We work seamlessly with Klaviyo, Shopify, HubSpot, Zoho, and custom PostgreSQL setups." }
    ]
  }
];

// =========================================================================
// TEAM MEMBERS CATALOG
// =========================================================================
export const teamCatalog = [
  {
    name: "Sarvesh Bagla",
    role: "Founder & Chief Executive",
    bio: "12+ years pioneering performance-led brand transformations for high-growth enterprises across India and global markets.",
    expertise: ["Growth Architecture", "Brand Strategy", "Capital Efficiency"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Ajaz Mirza",
    role: "VP, Digital Operations",
    bio: "Specializes in algorithmic scaling, large-scale media operations, and cross-channel campaign architecture.",
    expertise: ["Performance Media", "Attribution Systems", "Operations Scaling"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Ananya Sharma",
    role: "VP, Client Growth & MarTech",
    bio: "Connects creative strategy to hard commercial balance sheets, unlocking compounding pipeline across B2B and consumer brands.",
    expertise: ["Retention Engineering", "Enterprise B2B", "Funnel CRO"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Rohan Malhotra",
    role: "Head of Paid Performance Media",
    bio: "Ex-Meta agency partner managing over ₹5Cr+ in annual media spend with a relentless focus on unit economics.",
    expertise: ["Meta & YouTube Ads", "Data Science", "CAPI Tracking"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Tanya Sen",
    role: "Executive Creative Director",
    bio: "Directs art direction, video cinematography, and visual hook engineering that stops thumbs dead in the feed.",
    expertise: ["Creative Direction", "Motion Graphics", "Thumb-Stop Hooks"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Priya Nair",
    role: "Lead Performance Architect",
    bio: "Full-stack engineer and CRO specialist turning slow legacy web presences into sub-second revenue machines.",
    expertise: ["React & Next.js", "Core Web Vitals", "Programmatic SEO"],
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com"
  }
];

// =========================================================================
// CASE STUDIES CATALOG
// =========================================================================
export const caseStudiesCatalog = [
  {
    slug: "luxeliving-realty",
    brand: "LuxeLiving Realty",
    title: "Scaling Luxury Real Estate Inbound Pipeline to ₹42Cr in 90 Days",
    category: "High-Ticket Real Estate",
    metric: "+380%",
    result: "Growth in Qualified Inbound HNI Buyer Leads",
    year: "2025",
    services: ["Paid Ads", "Cinematic Video", "CRO Funnel"],
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    challenge: "LuxeLiving had high-ticket luxury villas in Bengaluru and Goa, but was burning ad spend on generic Facebook lead forms that delivered low-intent leads and unqualified tire-kickers.",
    strategy: "We threw out generic stock photography and produced 4K cinematic drone tours focusing on architectural rarity, coupled with a private qualification survey funnel and WhatsApp concierge VIP booking.",
    results: [
      { label: "Pipeline Value Generated", val: "₹42.8 Crores" },
      { label: "CPA Reduction", val: "-46.2%" },
      { label: "Site Visit Show-Up Rate", val: "78%" }
    ],
    testimonial: {
      quote: "GetIntoFeed transformed our entire lead quality. Instead of chasing leads who couldn't afford our properties, HNIs are now booking private villa previews directly through WhatsApp.",
      author: "Vikramaditya Singhania",
      role: "Managing Director, LuxeLiving"
    }
  },
  {
    slug: "glowup-skincare",
    brand: "GlowUp D2C Skincare",
    title: "Scaling a Clean Beauty Brand from ₹12L to ₹85L Monthly Run Rate",
    category: "E-Commerce & D2C",
    metric: "4.8x",
    result: "Blended ROAS at Scale",
    year: "2025",
    services: ["Short-Form Video", "Meta Ads", "Klaviyo Retention"],
    heroImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    challenge: "GlowUp was stuck at ₹12 Lakh/mo with rising Meta acquisition costs and declining creative fatigue across their basic static product photos.",
    strategy: "We built a 30-creator UGC pipeline producing authentic before-and-after texture videos, coupled with bundle offers and automated 5-step post-purchase retention flows.",
    results: [
      { label: "Monthly Revenue", val: "₹85 Lakhs / mo" },
      { label: "Repeat Purchase Rate", val: "34%" },
      { label: "Video View-Through Rate", val: "68%" }
    ],
    testimonial: {
      quote: "The creative velocity GetIntoFeed delivers is ridiculous. Our ads never suffer fatigue anymore because their video team drops fresh winning hooks every single week.",
      author: "Sneha Kapur",
      role: "Co-Founder & CEO, GlowUp"
    }
  },
  {
    slug: "apex-fintech",
    brand: "Apex Wealth FinTech",
    title: "Acquiring 28,000+ Active Retail Investors with Zero CAC Penalty",
    category: "B2B & FinTech",
    metric: "-52%",
    result: "Cost Per Funded Account",
    year: "2024",
    services: ["Programmatic SEO", "YouTube Ads", "Web Development"],
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    challenge: "Strict SEBI compliance restrictions and skyrocketing fintech search bidding costs made acquiring verified KYC customers unsustainably expensive.",
    strategy: "We engineered an educational programmatic SEO portal with 1,200+ financial calculators and compliance-approved YouTube explainer reels that ranked for high-intent search terms.",
    results: [
      { label: "Active New Accounts", val: "28,400+" },
      { label: "Organic Search Visits", val: "420K / mo" },
      { label: "Blended CAC", val: "₹185 per KYC" }
    ],
    testimonial: {
      quote: "They didn't just run ads; they built an organic software asset that now brings us tens of thousands of free financial signups every single month.",
      author: "Aditya Roy",
      role: "Chief Growth Officer, Apex Wealth"
    }
  }
];

export const ICON_MAP = {
  PenTool,
  Megaphone,
  Users,
  Video,
  Code,
  Search,
  Sparkles,
  Sliders,
  Globe2,
  Flame,
  Zap
};

export function getStoredServices() {
  if (typeof window === "undefined") return servicesCatalog;
  try {
    const raw = localStorage.getItem("gif_services_catalog");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.overview && parsed[0]?.strategySteps) {
        return parsed.map((s) => {
          let IconComp = Sparkles;
          if (typeof s.icon === "string") {
            IconComp = ICON_MAP[s.icon] || Sparkles;
          } else if (s.icon) {
            IconComp = s.icon;
          }
          return { ...s, icon: IconComp };
        });
      }
    }
  } catch {}
  return servicesCatalog;
}

export function getStoredCaseStudies() {
  if (typeof window === "undefined") return caseStudiesCatalog;
  try {
    const raw = localStorage.getItem("gif_case_studies_catalog");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.challenge && parsed[0]?.strategy) {
        return parsed;
      }
    }
  } catch {}
  return caseStudiesCatalog;
}

// =========================================================================
// REVIEWS & TESTIMONIALS CATALOG
// =========================================================================
export const reviewsCatalog = [
  {
    name: "Vikramaditya Singhania",
    role: "Managing Director",
    company: "LuxeLiving Realty",
    quote: "GetIntoFeed transformed our entire lead quality. Instead of chasing leads who couldn't afford our properties, HNIs are now booking private villa previews directly through WhatsApp.",
    rating: 5,
    service: "Paid Performance & Video",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Sneha Kapur",
    role: "Co-Founder & CEO",
    company: "GlowUp D2C Skincare",
    quote: "The creative velocity GetIntoFeed delivers is ridiculous. Our ads never suffer fatigue anymore because their video team drops fresh winning hooks every single week.",
    rating: 5,
    service: "UGC Video & Meta Scaling",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Aditya Roy",
    role: "Chief Growth Officer",
    company: "Apex Wealth FinTech",
    quote: "They didn't just run ads; they built an organic software asset that now brings us tens of thousands of free financial signups every single month.",
    rating: 5,
    service: "Programmatic SEO & Funnels",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Kavita Pillai",
    role: "VP Marketing",
    company: "Zenith EdTech",
    quote: "Working with GetIntoFeed feels like having an elite SWAT team of creative directors and data scientists plugged directly into our Slack. 10/10 execution.",
    rating: 5,
    service: "Brand Positioning & Growth",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Arjun Mehta",
    role: "Founder",
    company: "UrbanCrust F&B",
    quote: "Our viral reels hit 2.4 million views in the first 3 weeks. Footfalls in our physical outlets doubled. Best marketing investment we've ever made.",
    rating: 5,
    service: "Short-Form Video Production",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Manish Chhabra",
    role: "Head of Digital",
    company: "Volt EV Mobility",
    quote: "Transparent, fast, zero corporate fluff. If you want marketing that actually drives measurable commercial pipeline, hire GetIntoFeed.",
    rating: 5,
    service: "Google & Meta Performance",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80"
  }
];

// =========================================================================
// AWARDS CATALOG
// =========================================================================
export const awardsCatalog = [
  {
    title: "Best Performance Marketing Agency of the Year",
    org: "ET BrandEquity MarTech Awards",
    year: "2025",
    category: "Paid Media Excellence",
    desc: "Recognized for scaling multi-crore D2C and FinTech campaigns with industry-leading unit economics and creative testing frameworks."
  },
  {
    title: "Top Creative & Video Production Studio in India",
    org: "Clutch Global Agency Awards",
    year: "2024",
    category: "Creative Direction & Video",
    desc: "Ranked #1 for high-retention short-form video production and viral creative direction with verified 5.0 client ratings."
  },
  {
    title: "Outstanding Web Development & CRO Excellence",
    org: "Awwwards & Webflow Honors",
    year: "2024",
    category: "Digital Product & Web",
    desc: "Awarded for exceptional sub-second load times, mobile ergonomics, and high-converting custom React web architectures."
  },
  {
    title: "Excellence in AI Search & Organic Discovery",
    org: "Search Engine Journal Summit",
    year: "2023",
    category: "Organic SEO & Innovation",
    desc: "Honored for pioneering early generative AI search optimization and programmatic topic clustering."
  }
];

// =========================================================================
// FAQS CATALOG
// =========================================================================
export const faqsCatalog = [
  {
    category: "General",
    q: "What makes GetIntoFeed different from traditional agencies?",
    a: "We eliminate bloated agency bureaucracy, junior account reps, and slow turnaround times. You work directly with experienced growth architects and creative directors who execute fast and tie their success to your commercial numbers."
  },
  {
    category: "General",
    q: "Where is GetIntoFeed based?",
    a: "Our core strategic hub is in Bengaluru and Delhi NCR, India, but we operate globally with top-tier brands across the United States, UAE, Singapore, and Europe."
  },
  {
    category: "Services",
    q: "Can we hire GetIntoFeed for a single sprint rather than an annual contract?",
    a: "Yes! We offer 90-day Growth Sprints for specific milestones (e.g. Website Redesign, Creative Overhaul, Product Launch) alongside ongoing monthly retainers."
  },
  {
    category: "Services",
    q: "How do you handle reporting and communication?",
    a: "We set up a shared dedicated Slack/WhatsApp channel with daily asynchronous check-ins, live Looker Studio KPI dashboards, and bi-weekly strategic sprint calls."
  },
  {
    category: "Pricing",
    q: "How does your pricing structure work?",
    a: "We work on transparent fixed-fee monthly retainers or sprint packages with zero hidden markups. Our starter sprints begin at ₹75,000/month for focused disciplines, scaling up for multi-channel management."
  },
  {
    category: "Process",
    q: "What does the onboarding process look like?",
    a: "Once contracts are finalized, we conduct an exhaustive 48-hour tracking and creative asset audit, set up communication channels, and launch our first sprint within 7 business days."
  },
  {
    category: "Payments",
    q: "What payment methods do you accept?",
    a: "We accept domestic UPI / NEFT / RTGS, corporate credit cards, and international wire transfers via Stripe and Wise (USD, EUR, GBP, AED)."
  }
];

// =========================================================================
// BLOG POSTS CATALOG (FEED NOTES)
// =========================================================================
export const blogPostsCatalog = [
  {
    slug: "thumb-stop-creative-hooks",
    title: "The Anatomy of a 3-Second Thumb-Stop Hook: How We Scaled D2C Video Retention by 400%",
    category: "Creative Strategy",
    author: "Tanya Sen",
    authorRole: "Executive Creative Director",
    readTime: "6 min read",
    date: "March 2, 2026",
    excerpt: "If your frame 1 hook doesn't create immediate visual tension, your ad budget is burning. Here are the 5 exact psychological hook frameworks our studio tests every single week.",
    content: `
# The Anatomy of a 3-Second Thumb-Stop Hook

If you look at the drop-off curve in Meta Ads Manager or TikTok Creator Studio, you will notice a brutal reality: **Over 65% of viewers scroll past within the first 3 seconds**.

If your first 3 seconds are slow, polite, or branded with a generic company logo, you have already lost the sale before presenting your offer.

## 1. The Rule of Frame 1 Visual Disruption
Never start your video with someone saying: *"Hey guys, welcome back to our channel..."*
Start with motion already in progress. Cut into the action mid-sentence.
- Spill the liquid.
- Drop the package.
- Show the raw before-and-after texture in frame 1.

## 2. Audio-Visual Disconnect (The Pattern Interrupt)
Pair an unexpected visual with contrasting audio. When the viewer's brain cannot immediately categorize what they are seeing, subconscious attention spikes.

## 3. High-Contrast Kinetic Subtitles
80% of feed consumption occurs on mute. If your video does not feature bold, animated, high-contrast typography in the middle third of the screen, you are cutting your potential audience by four-fifths.

> 💡 **Takeaway:** Stop treating video creative like TV commercials. Treat it like a high-speed thumb-stopping interrupt that earns the right to make an offer.
    `,
    reactions: { love: 42, fire: 89, clap: 35, funny: 12, insightful: 67 }
  },
  {
    slug: "death-of-third-party-cookies",
    title: "First-Party Attribution in 2026: Why Server-Side CAPI is Mandatory for Scaling Ad Spend",
    category: "Paid Performance",
    author: "Rohan Malhotra",
    authorRole: "Head of Paid Media",
    readTime: "8 min read",
    date: "February 24, 2026",
    excerpt: "Browser pixel tracking is losing up to 35% of conversion events. Discover how we implement robust server-to-server Conversions API (CAPI) to train Meta's algorithms on real buyer data.",
    content: `
# First-Party Attribution in 2026

Relying solely on client-side browser cookies in 2026 is like driving on the highway with a cracked windshield. Safari, Chrome privacy sandboxes, and aggressive ad-blockers routinely strip pixel signals before they reach ad networks.

## Why Missing 30% of Conversions Kills Your Algorithm
When Meta or Google's bidding models don't receive signals for 30% of your sales, the machine learning assumes your campaign is underperforming. It then downgrades your ad delivery, raises your CPMs, and bids more conservatively.

### The Solution: Server-Side Conversions API (CAPI)
By routing conversion signals directly from your backend (FastAPI / Node / Shopify Webhooks) to Meta's Graph API, you guarantee 98%+ match rates.

> 📈 **Impact:** Implementing server-side CAPI typically reduces reported CPA by 18% to 24% within 14 days solely from cleaner algorithmic optimization.
    `,
    reactions: { love: 28, fire: 54, clap: 41, funny: 3, insightful: 95 }
  },
  {
    slug: "generative-search-optimization",
    title: "Optimizing for AI Answer Engines: How to Win Citations in Perplexity & ChatGPT Search",
    category: "SEO & AI Search",
    author: "Priya Nair",
    authorRole: "Lead Performance Architect",
    readTime: "7 min read",
    date: "February 15, 2026",
    excerpt: "Google's 10 blue links are being replaced by synthesized AI answers. Here is the playbook to structure your brand's data so LLMs cite your business as the definitive industry authority.",
    content: `
# Optimizing for AI Answer Engines

When a prospective buyer asks Perplexity or ChatGPT: *"What is the best digital marketing agency in India for D2C scaling?"*, the AI doesn't scan for keyword stuffing. It evaluates information density, authoritative entity citations, and semantic structured data.

## 1. Information-Dense Semantic Definitions
LLMs love concise, factual answers placed immediately under H2 and H3 headings. Answer the question in 2 sentences before expanding into case evidence.

## 2. Schema.org Deep Integration
Implement comprehensive JSON-LD schemas:
- Organization schema with founder citations
- Service schemas with pricing and deliverables
- Verified Review and FAQ schemas

> 💡 **Takeaway:** The future of SEO is not gaming backlinks; it is becoming the cleanest, most authoritative training source for LLM crawlers.
    `,
    reactions: { love: 33, fire: 72, clap: 64, funny: 5, insightful: 110 }
  }
];




// =========================================================================
// UNIVERSAL BRANDED PAGE HEADER (UNIFIED HOMEPAGE + INNER PAGES)
// =========================================================================
export function PageHeader({ onNavigate, activeNav = "", onOpenLeadModal, onOpenAuditPopup }) {
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  return (
    <>
      {/* Top Announcement Bar */}
      {showTopBar && (
        <div className="bg-brand-lime text-brand-dark text-[10px] sm:text-xs py-2 px-4 flex items-center justify-between font-bold font-space uppercase tracking-wider z-50 relative w-full shadow-sm border-b border-black/10">
          <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1 justify-center">
            <Zap className="w-3.5 h-3.5 fill-brand-dark shrink-0" />
            <span className="text-center">
              NOW TAKING ON 3 NEW BRANDS THIS MONTH — LET'S BUILD SOMETHING PEOPLE CAN'T SCROLL PAST.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTopBar(false)}
            className="text-brand-dark hover:opacity-70 p-1 cursor-pointer bg-transparent border-none"
            aria-label="Close Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar (Clean White Background) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all text-brand-dark">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-3.5 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="flex items-center gap-1.5 text-left bg-transparent border-none cursor-pointer p-0 group"
          >
            <span className="font-space font-extrabold text-xl md:text-2xl tracking-tighter uppercase text-brand-dark group-hover:text-brand-blue transition-colors">
              GETINTOFEED
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-lime border border-black shrink-0"></span>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7">
            {/* Services Dropdown (2-Column Desktop Grid) */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => onNavigate("/services")}
                className={`font-space font-bold text-xs uppercase tracking-wider ${activeNav === "services" ? "text-brand-blue" : "text-gray-700"} hover:text-brand-dark transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none py-2`}
              >
                SERVICES <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-[620px] bg-white border-2 border-black rounded-xl p-3.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    {getStoredServices().map((s) => (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => { setServicesDropdownOpen(false); onNavigate(`/services/${s.slug}`); }}
                        className="text-left p-2.5 rounded-lg hover:bg-gray-100 transition-all flex items-start gap-2.5 group/item border border-transparent hover:border-gray-200 bg-transparent cursor-pointer w-full"
                      >
                        <s.icon className="w-4 h-4 text-brand-blue group-hover/item:text-brand-dark shrink-0 mt-0.5" />
                        <div>
                          <div className="font-space font-bold text-[11px] uppercase text-brand-dark group-hover/item:text-brand-blue leading-tight">
                            {s.title}
                          </div>
                          <div className="text-[10px] text-gray-500 line-clamp-1 font-inter mt-0.5">
                            {s.shortDesc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="pt-2.5 border-t border-gray-200 mt-2">
                    <button
                      type="button"
                      onClick={() => { setServicesDropdownOpen(false); onNavigate("/services"); }}
                      className="w-full text-center py-2 bg-brand-lime text-brand-dark font-space font-bold text-xs uppercase tracking-wider rounded-md hover:bg-[#E2FF4D] transition-colors border-none cursor-pointer"
                    >
                      Explore All {getStoredServices().length} Services →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate("/work")}
              className={`font-space font-bold text-xs uppercase tracking-wider ${activeNav === "work" ? "text-brand-blue" : "text-gray-700"} hover:text-brand-dark transition-colors cursor-pointer bg-transparent border-none`}
            >
              WORK
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/about")}
              className={`font-space font-bold text-xs uppercase tracking-wider ${activeNav === "about" ? "text-brand-blue" : "text-gray-700"} hover:text-brand-dark transition-colors cursor-pointer bg-transparent border-none`}
            >
              ABOUT US
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/pricing")}
              className={`font-space font-bold text-xs uppercase tracking-wider ${activeNav === "pricing" ? "text-brand-blue" : "text-gray-700"} hover:text-brand-dark transition-colors cursor-pointer bg-transparent border-none`}
            >
              PRICING
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/blog")}
              className={`font-space font-bold text-xs uppercase tracking-wider ${activeNav === "blog" ? "text-brand-blue" : "text-gray-700"} hover:text-brand-dark transition-colors cursor-pointer bg-transparent border-none`}
            >
              FEED NOTES
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/contact")}
              className={`font-space font-bold text-xs uppercase tracking-wider ${activeNav === "contact" ? "text-brand-blue" : "text-gray-700"} hover:text-brand-dark transition-colors cursor-pointer bg-transparent border-none`}
            >
              CONTACT US
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+918810356950"
              className="font-space font-bold text-xs text-gray-700 hover:text-brand-dark transition-colors flex items-center gap-1.5 text-decoration-none"
            >
              <Phone className="w-3.5 h-3.5 text-brand-blue" />
              <span>+91 8810356950</span>
            </a>

            <button
              type="button"
              onClick={onOpenLeadModal ? onOpenLeadModal : () => onNavigate("/contact")}
              className="bg-brand-lime text-brand-dark px-5 py-2.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-brand-dark hover:text-white transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer border border-black/10"
            >
              Start a Project <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-brand-dark hover:text-brand-blue bg-transparent border-none cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b-2 border-gray-200 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/services"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-gray-800 hover:text-brand-blue border-b border-gray-100 bg-transparent"
            >
              SERVICES
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/work"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-gray-800 hover:text-brand-blue border-b border-gray-100 bg-transparent"
            >
              WORK
            </button>

            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/about"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-gray-800 hover:text-brand-blue border-b border-gray-100 bg-transparent"
            >
              ABOUT US
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/pricing"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-gray-800 hover:text-brand-blue border-b border-gray-100 bg-transparent"
            >
              PRICING
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/blog"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-gray-800 hover:text-brand-blue border-b border-gray-100 bg-transparent"
            >
              FEED NOTES / BLOG
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/contact"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-gray-800 hover:text-brand-blue border-b border-gray-100 bg-transparent"
            >
              CONTACT DESK
            </button>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href="tel:+918810356950"
                className="text-gray-700 text-xs font-space font-bold uppercase tracking-wider py-1 flex items-center gap-2 text-decoration-none hover:text-brand-dark"
              >
                <Phone className="w-4 h-4 text-brand-blue" /> Call +91 8810356950
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenLeadModal) onOpenLeadModal();
                  else onNavigate("/contact");
                }}
                className="bg-brand-lime text-brand-dark px-5 py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-brand-dark hover:text-white transition-all flex justify-center items-center gap-2 cursor-pointer border-none w-full"
              >
                Start a Project <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

// =========================================================================
// UNIVERSAL BRANDED PAGE FOOTER
// =========================================================================
export function PageFooter({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-black/10 pt-16 pb-12 px-6 md:px-12 w-full mt-auto text-brand-dark">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate("/")}
              className="flex items-center gap-1.5 text-left bg-transparent border-none cursor-pointer p-0"
            >
              <span className="font-space font-extrabold text-2xl tracking-tighter uppercase text-brand-dark">
                GETINTOFEED
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-brand-lime border border-brand-dark"></span>
            </button>
            <p className="text-gray-600 text-xs md:text-sm font-inter max-w-sm leading-relaxed">
              Full-stack creative marketing and performance agency. We engineer thumb-stopping video, high-converting React funnels, and algorithmic paid media for ambitious brands.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-brand-lime/20 border border-brand-lime/40 text-brand-dark px-3 py-1.5 rounded-full text-xs font-space font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
                Accepting 3 New Sprints
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="space-y-3">
            <h4 className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue">CONTENT</h4>
            <ul className="space-y-2 text-xs font-inter text-gray-600">
              <li><button type="button" onClick={() => onNavigate("/blog")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Feed Notes / Blog</button></li>
              <li><button type="button" onClick={() => onNavigate("/work")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Social Campaigns</button></li>
              <li><button type="button" onClick={() => onNavigate("/contact")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Contact Growth Desk</button></li>
              <li><button type="button" onClick={() => onNavigate("/pricing")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Pricing & Retainers</button></li>
            </ul>
          </div>

          {/* Creative Column */}
          <div className="space-y-3">
            <h4 className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue">CREATIVE</h4>
            <ul className="space-y-2 text-xs font-inter text-gray-600">
              <li><button type="button" onClick={() => onNavigate("/services/branding")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Brand Identity</button></li>
              <li><button type="button" onClick={() => onNavigate("/services/performance-marketing")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Paid Media Ads</button></li>
              <li><button type="button" onClick={() => onNavigate("/services/web-development")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Web Development</button></li>
              <li><button type="button" onClick={() => onNavigate("/services/seo")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">AI Search & SEO</button></li>
              <li><button type="button" onClick={() => onNavigate("/services/content-creation")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Reels & Video</button></li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div className="space-y-3">
            <h4 className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue">COMPANY & LEGAL</h4>
            <ul className="space-y-2 text-xs font-inter text-gray-600">
              <li><button type="button" onClick={() => onNavigate("/about")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">About GetIntoFeed</button></li>
              <li><button type="button" onClick={() => onNavigate("/reviews")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Reviews & Proof</button></li>
              <li><button type="button" onClick={() => onNavigate("/awards")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Awards & Honors</button></li>
              <li><button type="button" onClick={() => onNavigate("/careers")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Careers & Culture</button></li>
              <li><button type="button" onClick={() => onNavigate("/faqs")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Agency FAQs</button></li>
              <li><button type="button" onClick={() => onNavigate("/sitemap")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Sitemap</button></li>
              <li><button type="button" onClick={() => onNavigate("/privacy")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Privacy Policy</button></li>
              <li><button type="button" onClick={() => onNavigate("/cookie-policy")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Cookie Policy</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-space uppercase">
          <p>© {new Date().getFullYear()} GETINTOFEED CREATIVE STUDIO. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-dark text-gray-500 transition-colors">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-dark text-gray-500 transition-colors">LinkedIn</a>
            <button type="button" onClick={() => onNavigate("/admin")} className="hover:text-brand-blue text-gray-500 transition-colors bg-transparent border-none p-0 cursor-pointer">Admin CMS</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// =========================================================================
// UNIVERSAL COOKIE & PRIVACY PREFERENCES BANNER (HOMEPAGE + ALL PAGES)
// =========================================================================
export function CookieConsentBanner({ onNavigate }) {
  const [cookieBannerVisible, setCookieBannerVisible] = useState(() => {
    try {
      return !localStorage.getItem("gif_cookie_consent");
    } catch {
      return true;
    }
  });
  const [cookiePrefsOpen, setCookiePrefsOpen] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({ necessary: true, analytics: true, marketing: true, preferences: true });

  const handleAcceptCookies = (all = true) => {
    try {
      localStorage.setItem("gif_cookie_consent", all ? "all" : JSON.stringify(cookiePrefs));
    } catch {}
    setCookieBannerVisible(false);
    setCookiePrefsOpen(false);
  };

  if (!cookieBannerVisible) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-6 md:max-w-md z-50 bg-white border-2 border-black rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-300 text-brand-dark">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
          <div>
            <h5 className="font-space font-bold text-xs uppercase tracking-wider text-brand-dark mb-1">
              COOKIE & PRIVACY PREFERENCES
            </h5>
            <p className="text-gray-600 text-xs font-inter mb-4 leading-relaxed">
              We use necessary cookies for site function and analytics cookies to optimize user experience. Review our{" "}
              <button
                type="button"
                onClick={() => onNavigate("/cookie-policy")}
                className="underline text-brand-blue bg-transparent border-none p-0 cursor-pointer font-medium"
              >
                Cookie Policy
              </button>.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAcceptCookies(true)}
                className="bg-brand-lime text-brand-dark px-4 py-2 rounded-lg font-space font-bold text-xs uppercase hover:bg-[#E2FF4D] cursor-pointer border-none shadow-sm"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => handleAcceptCookies(false)}
                className="bg-transparent border border-black/20 text-brand-dark px-3 py-2 rounded-lg font-space font-bold text-xs uppercase hover:bg-gray-100 cursor-pointer"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={() => setCookiePrefsOpen(true)}
                className="text-xs text-gray-500 hover:text-black underline font-space uppercase ml-auto bg-transparent border-none cursor-pointer"
              >
                Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      {cookiePrefsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-md w-full p-6 shadow-2xl text-brand-dark">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 mb-4">
              <h4 className="font-space font-bold text-sm uppercase text-brand-dark">Customize Cookie Settings</h4>
              <button type="button" onClick={() => setCookiePrefsOpen(false)} className="text-gray-500 bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs font-inter text-gray-700 mb-6">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-black/5">
                <div>
                  <div className="font-bold text-brand-dark">Strictly Necessary</div>
                  <div className="text-[11px] text-gray-500">Core navigation, security, and sessions.</div>
                </div>
                <input type="checkbox" checked disabled className="cursor-not-allowed" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-black/5">
                <div>
                  <div className="font-bold text-brand-dark">Analytics & Performance</div>
                  <div className="text-[11px] text-gray-500">GA4 event tracking and heatmaps.</div>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.analytics}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, analytics: e.target.checked })}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-black/5">
                <div>
                  <div className="font-bold text-brand-dark">Marketing & Retargeting</div>
                  <div className="text-[11px] text-gray-500">Meta CAPI and Google Ads conversion pixels.</div>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.marketing}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, marketing: e.target.checked })}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleAcceptCookies(false)}
              className="w-full bg-brand-dark text-white py-2.5 rounded-lg font-space font-bold text-xs uppercase hover:bg-brand-blue transition-colors cursor-pointer border-none shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// =========================================================================
// HIGH-CONVERTING GROWTH & CREATIVE AUDIT POP-UP (INTERACTIVE POPUP)
// =========================================================================
export function GrowthAuditPopup({ isOpen, onClose, onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    service: "Paid Performance & Ads ROAS",
    revenue: "₹5L - ₹20L / month",
    challenge: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const newLead = {
        id: "lead-" + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.website || "Private Brand",
        service: formData.service,
        budget: formData.revenue,
        status: "New",
        date: new Date().toISOString().slice(0, 10),
        message: formData.challenge ? `Growth Goal: ${formData.service} | Bottleneck: ${formData.challenge}` : "Requested Free 360° Growth & Creative Audit"
      };

      // 1. Update localStorage CRM store immediately for Admin
      try {
        const existingRaw = localStorage.getItem("gif_admin_leads");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem("gif_admin_leads", JSON.stringify([newLead, ...existing]));
        window.dispatchEvent(new Event("storage"));
      } catch {}

      // 2. Call backend API
      await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead)
      });

      trackLeadConversion({
        id: newLead.id,
        service: newLead.service,
        source: "growth_audit_popup",
        company: newLead.company
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3500);
    } catch {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3500);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-5 md:p-6 shadow-2xl relative text-brand-dark overflow-hidden animate-in zoom-in-95 duration-200 max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-lime via-brand-blue to-brand-lime"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 rounded-full bg-brand-light-gray hover:bg-black hover:text-white transition-colors flex items-center justify-center border border-black/10 cursor-pointer"
          aria-label="Close Popup"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 sm:py-8 space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-brand-lime border-2 border-black flex items-center justify-center mx-auto text-brand-dark shadow-[3px_3px_0px_#000]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-space font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-brand-dark">
              AUDIT DOSSIER QUEUED!
            </h3>
            <p className="text-gray-600 text-xs font-inter max-w-sm mx-auto leading-relaxed">
              Our Senior Growth Architect is reviewing your brand. We will send your custom teardown via WhatsApp/Email within <strong>24 to 48 hours</strong>.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light-gray text-[11px] font-space font-bold text-brand-blue">
              <Sparkles className="w-3 h-3" /> Direct WhatsApp Dispatch
            </div>
          </div>
        ) : (
          <div>
            {/* Header with Badges */}
            <div className="mb-3 sm:mb-4 text-left pr-8">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-[9px] uppercase tracking-wider border border-black">
                  <Flame className="w-2.5 h-2.5 text-brand-dark fill-brand-dark" /> LIMITED TO 5 BRANDS / MONTH
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-space font-bold uppercase text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  ₹25,000 VALUE — 100% FREE
                </span>
              </div>
              <h2 className="font-space font-extrabold text-lg sm:text-xl md:text-2xl uppercase tracking-tight text-brand-dark leading-tight">
                CLAIM YOUR FREE 360° GROWTH AUDIT.
              </h2>
              <p className="text-gray-500 text-[11px] font-inter mt-1 leading-snug">
                Get a senior strategist teardown of your paid ads ROAS, viral reel hooks, and conversion funnel bottlenecks — with zero sales pressure.
              </p>
            </div>

            {/* Audit Form (Streamlined 2-Column Compact Grid) */}
            <form onSubmit={handleSubmit} className="space-y-2.5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-space font-bold uppercase text-gray-700 mb-0.5">
                    Founder / Lead Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ashish Raghav"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-lg px-3 py-1.5 sm:py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-space font-bold uppercase text-gray-700 mb-0.5">
                    WhatsApp / Phone *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. +91 8810356950"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-lg px-3 py-1.5 sm:py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-space font-bold uppercase text-gray-700 mb-0.5">
                    Work Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. ashish@brand.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-lg px-3 py-1.5 sm:py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-space font-bold uppercase text-gray-700 mb-0.5">
                    Website / Instagram Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. yourbrand.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-lg px-3 py-1.5 sm:py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-space font-bold uppercase text-gray-700 mb-0.5">
                    Primary Growth Goal
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-lg px-2.5 py-1.5 sm:py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none"
                  >
                    <option value="Paid Performance & Ads ROAS">Scale Meta & Google ROAS</option>
                    <option value="Short-Form Video & Reels">Viral Reels & 9:16 Creative</option>
                    <option value="Brand Positioning & Identity">Brand Identity & Redesign</option>
                    <option value="Web Engineering & CRO Funnel">High-Converting Web Funnel</option>
                    <option value="Generative Engine Optimization (GEO)">Search SEO & AI Citation</option>
                    <option value="Influencer Seeding Network">Creator & Influencer Network</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-space font-bold uppercase text-gray-700 mb-0.5">
                    Biggest Bottleneck (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ad fatigue, high CAC..."
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-lg px-3 py-1.5 sm:py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-lime text-brand-dark py-2.5 sm:py-3 rounded-xl font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 mt-3"
              >
                {submitting ? "Analyzing & Transmitting..." : "Claim Free 360° Growth Audit →"}
              </button>

              <div className="flex items-center justify-center gap-3 text-[9px] sm:text-[10px] text-gray-500 font-inter pt-0.5">
                <span className="flex items-center gap-1">🔒 100% Confidential</span>
                <span className="flex items-center gap-1">⚡ 48-Hour Turnaround</span>
                <span className="flex items-center gap-1">🚫 No Spam</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


export function PageLayout({
  children,
  onNavigate,
  activeNav = "",
  leadModalOpen: externalLeadModalOpen,
  setLeadModalOpen: externalSetLeadModalOpen,
  selectedService: externalSelectedService,
  setSelectedService: externalSetSelectedService
}) {
  const [internalLeadModalOpen, internalSetLeadModalOpen] = useState(false);
  const leadModalOpen = externalLeadModalOpen !== undefined ? externalLeadModalOpen : internalLeadModalOpen;
  const setLeadModalOpen = externalSetLeadModalOpen !== undefined ? externalSetLeadModalOpen : internalSetLeadModalOpen;

  const [internalSelectedService, internalSetSelectedService] = useState("General Growth Consultation");
  const selectedService = externalSelectedService !== undefined ? externalSelectedService : internalSelectedService;
  const setSelectedService = externalSetSelectedService !== undefined ? externalSetSelectedService : internalSetSelectedService;

  return (
    <div className="antialiased selection:bg-brand-lime selection:text-brand-dark bg-[#FAFAFA] font-inter relative min-h-screen text-[#09090B] flex flex-col justify-between">
      {/* 1. Universal Branded Header */}
      <PageHeader
        onNavigate={onNavigate}
        activeNav={activeNav}
        onOpenLeadModal={() => setLeadModalOpen(true)}
      />

      {/* 2. Main Page Content Slot */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-12 py-8 md:py-16">
        {children}
      </main>

      {/* 3. Global Branded Footer */}
      <PageFooter onNavigate={onNavigate} />

      {/* 4. Universal Branded Quick Consultation Modal */}
      <UniversalLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />

      {/* 5. Global Cookie & Privacy Preferences Banner */}
      <CookieConsentBanner onNavigate={onNavigate} />
      <WhatsAppFloatingButton />
    </div>
  );
}


// =========================================================================
// ABOUT US PAGE (WHITE/LIGHT BASE + BRAND ACCENTS)
// =========================================================================
export function AboutUsPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="about">
      <div className="space-y-16 md:space-y-24">
        {/* Hero Section */}
        <section className="text-left max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
            The GetIntoFeed Story & Philosophy
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter text-brand-dark leading-[0.9] mb-8">
            WE BUILD MARKETING <br />
            THAT PEOPLE <span className="text-brand-blue">REMEMBER.</span>
          </h1>
          <p className="text-gray-700 text-base sm:text-lg md:text-xl font-inter leading-relaxed max-w-2xl">
            We are not a bloated traditional agency. We are an elite group of performance directors, creative strategists, and engineers who believe that high-converting marketing should never be boring.
          </p>
        </section>

        {/* Vision & Mission Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* OUR VISION */}
          <div className="bg-white border-2 border-black rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-brand-lime flex items-center justify-center mb-6 text-brand-dark font-space font-bold text-sm">
              01
            </div>
            <h2 className="font-space font-bold text-xs tracking-widest uppercase text-brand-blue mb-2">Our Vision</h2>
            <h3 className="font-space font-bold text-2xl sm:text-3xl uppercase tracking-tight text-brand-dark mb-4">
              TO REDEFINE COMMERCIAL CREATIVITY IN THE FEED.
            </h3>
            <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
              We envision an internet where brands do not have to choose between aesthetic integrity and ruthless performance. By pairing cinematic storytelling with algorithmic bidding precision, we engineer sustainable economic moats for our clients.
            </p>
          </div>

          {/* OUR MISSION */}
          <div className="bg-white border-2 border-black rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center mb-6 text-white font-space font-bold text-sm">
              02
            </div>
            <h2 className="font-space font-bold text-xs tracking-widest uppercase text-brand-blue mb-2">Our Mission</h2>
            <h3 className="font-space font-bold text-2xl sm:text-3xl uppercase tracking-tight text-brand-dark mb-4">
              ELIMINATE AD WASTE AND JUNIOR AGENCY LAYERS.
            </h3>
            <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
              Our mission is to give ambitious founders and CMOs direct access to senior operators. We execute 90-day growth sprints that eliminate bloated overhead, accelerate time-to-market, and tie our agency success directly to your bottom line.
            </p>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="bg-white border-2 border-black rounded-3xl p-8 md:p-14 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 text-left">
              <h2 className="font-space font-bold text-xs tracking-widest uppercase text-brand-blue mb-3">Our Story</h2>
              <h3 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-brand-dark leading-[0.95] mb-6">
                BORN OUT OF FRUSTRATION WITH "SAFE" CAMPAIGNS.
              </h3>
              <div className="space-y-4 text-gray-700 text-sm md:text-base font-inter leading-relaxed">
                <p>
                  GetIntoFeed was founded when a team of veteran performance marketers and creative directors noticed an alarming trend: businesses were spending millions on ad platforms, but producing generic, lifeless creative that blended into the background.
                </p>
                <p>
                  Traditional agencies sold 12-month retainers staffed with junior coordinators. We dismantled that model completely.
                </p>
                <p className="font-bold text-brand-dark">
                  We built a nimble, high-velocity creative studio where founders collaborate directly with senior specialists to launch thumb-stopping work.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="bg-brand-light-gray p-6 rounded-2xl border border-black/10">
                <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-blue mb-1">₹120Cr+</div>
                <div className="font-space font-bold text-xs uppercase text-gray-600">Client Revenue Scaled</div>
              </div>
              <div className="bg-brand-light-gray p-6 rounded-2xl border border-black/10">
                <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-dark mb-1">4.2x</div>
                <div className="font-space font-bold text-xs uppercase text-gray-600">Average Blended ROAS</div>
              </div>
              <div className="bg-brand-light-gray p-6 rounded-2xl border border-black/10">
                <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-dark mb-1">94%</div>
                <div className="font-space font-bold text-xs uppercase text-gray-600">Sprint Retention Rate</div>
              </div>
              <div className="bg-brand-lime p-6 rounded-2xl border border-black/10">
                <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-dark mb-1">3.1M+</div>
                <div className="font-space font-bold text-xs uppercase text-brand-dark">Organic Video Reach</div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE BELIEVE */}
        <section className="text-left">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="font-space font-bold text-xs tracking-widest uppercase text-brand-blue mb-3">Core Philosophy</h2>
            <h3 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark leading-[0.95]">
              WHAT WE BELIEVE.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-black rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <h4 className="font-space font-bold text-lg uppercase text-brand-dark mb-2">1. GOOD MARKETING SHOULDN'T BE BORING.</h4>
              <p className="text-gray-600 text-xs md:text-sm font-inter leading-relaxed">
                If nobody stops scrolling to watch your creative, your technical targeting parameters are completely meaningless.
              </p>
            </div>

            <div className="bg-white border-2 border-black rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <h4 className="font-space font-bold text-lg uppercase text-brand-dark mb-2">2. CREATIVITY SHOULD DRIVE BUSINESS.</h4>
              <p className="text-gray-600 text-xs md:text-sm font-inter leading-relaxed">
                We don't build art for art's sake. Every single video cut, headline, and color choice is engineered to convert visitors into paying clients.
              </p>
            </div>

            <div className="bg-white border-2 border-black rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <h4 className="font-space font-bold text-lg uppercase text-brand-dark mb-2">3. STRATEGY AND EXECUTION BELONG TOGETHER.</h4>
              <p className="text-gray-600 text-xs md:text-sm font-inter leading-relaxed">
                High-level strategy decks without rapid, battle-tested execution are worthless. We strategize in the morning and push live campaigns by afternoon.
              </p>
            </div>

            <div className="bg-white border-2 border-black rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <h4 className="font-space font-bold text-lg uppercase text-brand-dark mb-2">4. FEWER LAYERS. BETTER WORK.</h4>
              <p className="text-gray-600 text-xs md:text-sm font-inter leading-relaxed">
                No endless meetings. No telephone games. You collaborate directly with the senior talent actively writing your scripts and building your ads.
              </p>
            </div>

            <div className="bg-white border-2 border-black rounded-2xl p-6 hover:-translate-y-1 transition-transform md:col-span-2">
              <h4 className="font-space font-bold text-lg uppercase text-brand-dark mb-2">5. IDEAS MUST CREATE MEASURABLE IMPACT.</h4>
              <p className="text-gray-600 text-xs md:text-sm font-inter leading-relaxed">
                Vanity impressions don't cover payroll. We judge our agency's worth strictly by pipeline generated, blended ROAS, and customer lifetime value.
              </p>
            </div>
          </div>
        </section>

        {/* MEET OUR TEAM */}
        <section id="team" className="text-left">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-space font-bold text-xs tracking-widest uppercase text-brand-blue mb-2">Leadership & Operators</h2>
              <h3 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark leading-[0.95]">
                MEET OUR TEAM.
              </h3>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-inter max-w-md">
              Senior directors and specialists who personally lead your growth sprints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamCatalog.map((member, i) => (
              <div key={i} className="bg-white border-2 border-black rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all">
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/90 border border-black flex items-center justify-center text-brand-dark hover:bg-brand-lime transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <div className="font-space font-bold text-lg uppercase tracking-tight text-brand-dark">
                    {member.name}
                  </div>
                  <div className="font-space font-bold text-xs uppercase text-brand-blue mb-3">
                    {member.role}
                  </div>
                  <p className="text-gray-600 text-xs font-inter leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-black/10">
                    {member.expertise.map((exp, idx) => (
                      <span key={idx} className="bg-brand-light-gray px-2 py-0.5 rounded text-[10px] font-space font-bold uppercase text-gray-700">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-brand-dark text-white rounded-3xl p-8 md:p-14 text-center">
          <h3 className="font-space font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter mb-4">
            TIRED OF BORING AGENCY PROMISES?
          </h3>
          <p className="text-gray-300 text-sm md:text-base font-inter max-w-xl mx-auto mb-8">
            Schedule a 30-minute diagnostic session with our founder and see our live sprint roadmap.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("/contact")}
            className="bg-brand-lime text-brand-dark px-8 py-4 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all cursor-pointer border-none shadow-md inline-flex items-center gap-2"
          >
            Start Your Project Sprint <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// SERVICES HUB PAGE (/services)
// =========================================================================
export function ServicesHubPage({ onNavigate }) {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("General Growth Consultation");
  const services = getStoredServices();

  const handleOpenModal = (svcTitle) => {
    setSelectedService(svcTitle);
    setLeadModalOpen(true);
  };

  return (
    <PageLayout
      onNavigate={onNavigate}
      activeNav="services"
      leadModalOpen={leadModalOpen}
      setLeadModalOpen={setLeadModalOpen}
      selectedService={selectedService}
      setSelectedService={setSelectedService}
    >
      <div className="space-y-16 md:space-y-24 text-left">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-brand-dark" />
            Full-Stack Growth Architecture
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95]">
            OUR CAPABILITIES. <br />
            <span className="text-brand-blue">BUILT FOR REVENUE.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed max-w-2xl">
            Eight synchronized disciplines executed by senior growth directors. We combine thumb-stopping video, high-converting React funnels, and algorithmic media buying that eliminate ad waste.
          </p>
        </div>

        {/* 3-COLUMN SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((svc) => {
            const SvcIcon = svc.icon || Sparkles;
            return (
              <div
                key={svc.slug}
                className="bg-white border-2 border-black rounded-3xl p-6 sm:p-7 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-lime border border-black/10 flex items-center justify-center text-brand-dark group-hover:bg-brand-dark group-hover:text-brand-lime transition-colors">
                      <SvcIcon className="w-6 h-6" />
                    </div>
                    <span className="font-space font-bold text-[10px] uppercase text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-black/5">
                      {svc.category}
                    </span>
                  </div>

                  <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark group-hover:text-brand-blue transition-colors mb-2.5">
                    {svc.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm font-inter leading-relaxed mb-6">
                    {svc.shortDesc}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-black/10 mb-6">
                    <div className="font-space font-bold text-[10px] uppercase text-gray-500 mb-2 tracking-wider">
                      Included Sprint Assets:
                    </div>
                    {(svc.deliverables || []).slice(0, 4).map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs font-inter text-gray-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-space">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Tier</span>
                    <span className="font-bold text-brand-dark">{svc.pricingTier}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(`/services/${svc.slug}`)}
                      className="w-full bg-[#09090B] hover:bg-black text-white py-2.5 rounded-xl font-space font-bold uppercase text-[11px] tracking-wider transition-colors cursor-pointer border-none flex items-center justify-center gap-1"
                    >
                      Blueprint <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenModal(svc.title)}
                      className="w-full bg-brand-lime text-brand-dark hover:bg-[#E2FF4D] py-2.5 rounded-xl font-space font-bold uppercase text-[11px] tracking-wider transition-colors cursor-pointer border border-black/10 shadow-sm"
                    >
                      Quick Consult
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Multi-Discipline Sprint Banner */}
        <div className="bg-[#09090B] text-white border-2 border-black rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase">
              ⚡ BESPOKE VENTURE SPRINT
            </span>
            <h2 className="font-space font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white">
              NEED A MULTI-DISCIPLINE GROWTH SPRINT?
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm font-inter leading-relaxed">
              Bundle Creative Video, Paid Performance, and React CRO Funnels into a unified 30-day velocity sprint.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleOpenModal("Full-Stack Growth Sprint")}
              className="bg-brand-lime text-brand-dark px-7 py-3.5 rounded-xl font-space font-extrabold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all shadow-md cursor-pointer border-none"
            >
              Configure Custom Sprint →
            </button>
            <a
              href="https://wa.me/918810356950?text=Hi%20GetIntoFeed%2C%20I%20want%20to%20discuss%20a%20custom%20marketing%20sprint"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-space font-bold uppercase text-xs tracking-wider transition-all cursor-pointer no-underline flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-brand-lime" /> WhatsApp (+91 8810356950)
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// SLUG ALIAS RESOLUTION & TECH STACKS FOR SERVICES
// =========================================================================
const SERVICE_SLUG_ALIASES = {
  "content-marketing": "content-creation",
  "reels": "content-creation",
  "videos": "content-creation",
  "ads-campaign": "performance-marketing",
  "growth": "performance-marketing",
  "paid-ads": "performance-marketing",
  "graphics-design": "branding",
  "strategy": "branding",
  "brand-identity": "branding",
  "influencer-marketing": "influencer-network",
  "influencer-network": "influencer-network",
  "web-design": "web-development",
  "web-development": "web-development",
  "social-media": "social-media",
  "seo": "seo",
  "analytics": "analytics"
};

const SERVICE_TECH_STACKS = {
  "branding": [
    { name: "Figma", desc: "Design Systems & Token Architecture" },
    { name: "Adobe Illustrator", desc: "Vector Logos & Geometry" },
    { name: "After Effects", desc: "Kinetic Identity & Brand Motion" },
    { name: "FontBase", desc: "Type Hierarchy Engine" },
    { name: "Notion", desc: "Brand Voice & Positioning Guide" }
  ],
  "performance-marketing": [
    { name: "Meta Ads Manager", desc: "Advantage+ Media Buying" },
    { name: "Google Ads", desc: "High-Intent Search & PMax" },
    { name: "Triple Whale", desc: "Blended Multi-Touch Attribution" },
    { name: "Meta CAPI", desc: "Server-Side Pixel Tracking" },
    { name: "Google Analytics 4", desc: "Conversion Funnel Measurement" }
  ],
  "social-media": [
    { name: "Notion", desc: "30-Day Sprint Editorial Calendar" },
    { name: "Canva & Figma", desc: "High-Velocity Visuals" },
    { name: "CapCut Pro", desc: "Trend-Jumping Viral Reels" },
    { name: "Buffer / Later", desc: "Multi-Platform Automated Queue" },
    { name: "Meta Business Suite", desc: "Community DM & Engagement Hub" }
  ],
  "content-creation": [
    { name: "Adobe Premiere Pro", desc: "High-Retention Pacing & Cuts" },
    { name: "DaVinci Resolve", desc: "Cinematic Color Grading & Depth" },
    { name: "After Effects", desc: "Kinetic Subtitles & 3D Hooks" },
    { name: "Sony FX3 & A7IV", desc: "4K Studio Production Rigs" },
    { name: "Frame.io", desc: "Frame-by-Frame Client Approval" }
  ],
  "web-development": [
    { name: "React & Next.js", desc: "Modern Reactive Web Architecture" },
    { name: "Tailwind CSS", desc: "Zero-Jank Responsive UI" },
    { name: "Vite & Vercel", desc: "Sub-Second Global Edge CDN" },
    { name: "PostgreSQL", desc: "Secure Relational Storage" },
    { name: "Google PageSpeed", desc: "95+ Core Web Vitals" }
  ],
  "seo": [
    { name: "Semrush", desc: "Keyword & Competitive Gap Intel" },
    { name: "Ahrefs", desc: "Backlink & Authority Diagnostics" },
    { name: "Google Search Console", desc: "Indexation & CTR Analytics" },
    { name: "Screaming Frog", desc: "Deep Technical Site Crawls" },
    { name: "Perplexity & ChatGPT", desc: "Generative AI Search Optimization" }
  ],
  "influencer-network": [
    { name: "Modash", desc: "Creator Engagement & Fake Follower Audit" },
    { name: "Aspire & GRIN", desc: "Creator Relationship CRM" },
    { name: "Partnership Ads", desc: "Meta Whitelisted Ad Sets" },
    { name: "Digital Rights Doc", desc: "Perpetual Ad Usage Licensing" },
    { name: "Shopify Collabs", desc: "Affiliate Tracking & Commission" }
  ],
  "analytics": [
    { name: "Google Analytics 4", desc: "Custom Event Taxonomies" },
    { name: "Looker Studio", desc: "Automated Executive Dashboards" },
    { name: "Microsoft Clarity", desc: "Session Recordings & Heatmaps" },
    { name: "Klaviyo", desc: "High-LTV Retention Workflows" },
    { name: "BigQuery", desc: "Raw Warehouse Storage" }
  ]
};

const SERVICE_CASE_STUDY_MAP = {
  "branding": "luxeliving-realty",
  "performance-marketing": "glowup-skincare",
  "social-media": "glowup-skincare",
  "content-creation": "glowup-skincare",
  "web-development": "apex-fintech",
  "seo": "apex-fintech",
  "influencer-network": "glowup-skincare",
  "analytics": "luxeliving-realty"
};

// =========================================================================
// SERVICE DETAIL PAGE (/services/:slug) — REDESIGNED WORLD-CLASS LAYOUT
// =========================================================================
export function ServiceDetailPage({ slug, onNavigate }) {
  const currentServices = getStoredServices();
  const canonicalSlug = SERVICE_SLUG_ALIASES[slug] || slug;
  const service = currentServices.find((s) => s.slug === canonicalSlug) || currentServices.find((s) => s.slug === slug) || currentServices[0];

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState(service.title);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0);

  useEffect(() => {
    setSelectedServiceTitle(service.title);
  }, [service.title]);

  const handleOpenModal = (svcTitle) => {
    setSelectedServiceTitle(svcTitle || service.title);
    setLeadModalOpen(true);
  };

  const caseStudies = typeof getStoredCaseStudies === "function" ? getStoredCaseStudies() : caseStudiesCatalog;
  const matchedCaseSlug = SERVICE_CASE_STUDY_MAP[service.slug] || "luxeliving-realty";
  const matchedCase = caseStudies.find((c) => c.slug === matchedCaseSlug) || caseStudies[0];
  const techStack = SERVICE_TECH_STACKS[service.slug] || SERVICE_TECH_STACKS["branding"];

  return (
    <PageLayout
      onNavigate={onNavigate}
      activeNav="services"
      leadModalOpen={leadModalOpen}
      setLeadModalOpen={setLeadModalOpen}
      selectedService={selectedServiceTitle}
      setSelectedService={setSelectedServiceTitle}
    >
      <div className="space-y-16 md:space-y-24">
        {/* 1. INTERACTIVE QUICK-SWITCH SERVICE PILLS BAR */}
        <div className="w-full border-b border-black/10 pb-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="font-space font-bold text-[11px] uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-brand-dark" />
              Explore All Service Capabilities
            </span>
            <span className="text-[11px] font-space text-gray-400 hidden sm:inline-block">
              Click any service to view sprint details
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {currentServices.map((s) => {
              const isActive = s.slug === service.slug || (SERVICE_SLUG_ALIASES[slug] === s.slug);
              const SvcIcon = s.icon || Sparkles;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => onNavigate(`/services/${s.slug}`)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-space text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#09090B] text-white border-[#09090B] shadow-md"
                      : "bg-white text-gray-700 border-black/10 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <SvcIcon className={`w-3.5 h-3.5 ${isActive ? "text-brand-lime" : "text-gray-500"}`} />
                  <span>{s.title.split(" & ")[0].split(" / ")[0]}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse ml-0.5"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. BREADCRUMBS & TOP STATUS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-space font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate("/services")}
              className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-gray-500 font-space font-bold uppercase inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Services Hub
            </button>
            <span>/</span>
            <span className="text-gray-400">{service.category}</span>
            <span>/</span>
            <span className="text-brand-dark font-bold">{service.title}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-space font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            ⚡ 7-Day Sprint Available • Senior Talent Only
          </div>
        </div>

        {/* 3. HERO SECTION: DYNAMIC 2-COLUMN OVERVIEW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center text-left">
          {/* LEFT: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider">
              {React.createElement(service.icon || Sparkles, { className: "w-4 h-4 text-brand-blue" })}
              {service.category}
            </div>

            <h1 className="font-space font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95]">
              {service.title}
            </h1>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg font-inter leading-relaxed max-w-2xl">
              {service.overview}
            </p>

            {/* Key Commercial Deliverables Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {(service.deliverables || []).slice(0, 4).map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-inter font-medium text-gray-800 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {item}
                </span>
              ))}
            </div>

            {/* Hero CTA Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => handleOpenModal(service.title)}
                className="bg-brand-lime text-brand-dark px-7 py-4 rounded-xl font-space font-extrabold uppercase text-xs sm:text-sm tracking-wider hover:bg-[#E2FF4D] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer border-none"
              >
                <span>Book Strategy Sprint</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/918810356950?text=${encodeURIComponent("Hi GetIntoFeed, I would like to discuss deploying a sprint for " + service.title)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white border-2 border-black text-brand-dark px-6 py-3.5 rounded-xl font-space font-bold uppercase text-xs sm:text-sm hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer no-underline shadow-sm hover:shadow"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-space font-semibold text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-blue" />
                100% Commercial IP Ownership
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                48h Rapid Creative Turnaround
              </span>
            </div>
          </div>

          {/* RIGHT: Interactive Sprint Blueprint Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left">
              <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-black/10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase tracking-wider">
                  <Zap className="w-3 h-3" /> VERIFIED SPRINT BLUEPRINT
                </span>
                <span className="font-space font-bold text-xs text-gray-500">Ready in 7 Days</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-space font-bold uppercase text-gray-500 mb-1">
                    Investment Tier
                  </div>
                  <div className="font-space font-extrabold text-2xl sm:text-3xl text-brand-dark">
                    {service.pricingTier}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#F8F8F8] p-3.5 rounded-xl border border-black/5">
                    <div className="text-[10px] font-space font-bold uppercase text-gray-500">Sprint Cadence</div>
                    <div className="font-space font-bold text-sm text-brand-dark mt-0.5">7 to 14 Days</div>
                  </div>
                  <div className="bg-[#F8F8F8] p-3.5 rounded-xl border border-black/5">
                    <div className="text-[10px] font-space font-bold uppercase text-gray-500">Squad Makeup</div>
                    <div className="font-space font-bold text-sm text-brand-dark mt-0.5">Senior Leads Only</div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-black/10">
                  <div className="text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                    Included Execution Standards:
                  </div>
                  <div className="flex items-start gap-2 text-xs font-inter text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct WhatsApp sprint room with senior director</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs font-inter text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Weekly live review sprints & continuous iterations</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs font-inter text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Production-ready Figma source files & assets delivered</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs font-inter text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Strict mutual NDA & IP transfer upon completion</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenModal(service.title)}
                  className="w-full mt-4 bg-[#09090B] hover:bg-black text-brand-lime py-4 rounded-xl font-space font-extrabold uppercase text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span>Deploy Sprint Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-space font-medium text-gray-500 pt-1">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Confidential • 15-Minute Response Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PERFORMANCE METRIC STATS STRIP */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-left">
          <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-dark mb-1">
              ₹120Cr+
            </div>
            <div className="font-space font-bold text-xs uppercase text-gray-500">
              Pipeline & Revenue Scaled
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-blue mb-1">
              3.8x - 6.4x
            </div>
            <div className="font-space font-bold text-xs uppercase text-gray-500">
              Average Blended Campaign ROAS
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-dark mb-1">
              48 Hours
            </div>
            <div className="font-space font-bold text-xs uppercase text-gray-500">
              Rapid First Concept Velocity
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="font-space font-extrabold text-3xl md:text-4xl text-emerald-600 mb-1">
              100%
            </div>
            <div className="font-space font-bold text-xs uppercase text-gray-500">
              Senior Specialist Led Execution
            </div>
          </div>
        </section>

        {/* 5. THE TRADITIONAL AGENCY TRAP VS THE GETINTOFEED EDGE */}
        <section className="text-left space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-brand-dark" />
              The GetIntoFeed Advantage
            </div>
            <h2 className="font-space font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-brand-dark">
              WHY TRADITIONAL AGENCIES FAIL VS HOW WE DELIVER.
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-inter max-w-2xl mt-1">
              Most agencies burn your budget on bloated overhead, endless discovery meetings, and junior staff. Here is how our sprint model changes the equation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TRADITIONAL AGENCY CARD */}
            <div className="bg-[#FFF8F8] border-2 border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 font-space font-bold text-xs uppercase">
                ❌ Traditional Agency Model
              </div>
              <h3 className="font-space font-bold text-xl uppercase text-red-950">
                Slow, Bureaucratic & Generic
              </h3>
              <ul className="space-y-3 font-inter text-xs sm:text-sm text-red-900/80 list-none p-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>4 to 8 weeks of slow onboarding and 15-page slide decks before any work begins.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Pitched by founders, then silently delegated to unpaid interns and junior coordinators.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Recycled Canva templates copied directly from your closest competitors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Focuses on vanity metrics (impressions, likes) instead of actual pipeline and sales.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>72-hour email delay and ticketing systems whenever you need urgent revisions.</span>
                </li>
              </ul>
            </div>

            {/* GETINTOFEED SPRINT CARD */}
            <div className="bg-[#09090B] text-white border-2 border-black rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-xs uppercase">
                ⚡ The GetIntoFeed Sprint
              </div>
              <h3 className="font-space font-bold text-xl uppercase text-white">
                Rapid, High-Status & Revenue-Driven
              </h3>
              <ul className="space-y-3 font-inter text-xs sm:text-sm text-gray-300 list-none p-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-brand-lime font-bold shrink-0">✓</span>
                  <span>Live in 7 days flat. Zero bureaucratic friction, zero wasted hours.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-brand-lime font-bold shrink-0">✓</span>
                  <span>Direct collaboration with senior growth directors and seasoned creative directors only.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-brand-lime font-bold shrink-0">✓</span>
                  <span>Bespoke, world-class creative assets engineered specifically to stand out in the feed.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-brand-lime font-bold shrink-0">✓</span>
                  <span>Obsessed with unit economics: ROAS, CPA reduction, and verified cash revenue.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-brand-lime font-bold shrink-0">✓</span>
                  <span>Private WhatsApp channel with 15-minute average response time during business hours.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. WHAT WE DO & EXECUTE (DETAILED CAPABILITIES GRID) */}
        <section className="text-left space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
                Execution Capabilities
              </div>
              <h2 className="font-space font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-brand-dark">
                WHAT WE EXECUTE & DELIVER.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleOpenModal(service.title)}
              className="font-space font-bold text-xs uppercase text-brand-dark hover:text-brand-blue transition-colors flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer"
            >
              <span>Request Custom Scope</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(service.whatWeDo || []).map((item, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-black rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="font-space font-extrabold text-2xl text-brand-blue/30 mb-3">
                    0{idx + 1}
                  </div>
                  <h4 className="font-space font-bold text-base uppercase tracking-tight text-brand-dark mb-2">
                    {item.split(":")[0] || item.split(",")[0] || item}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm font-inter leading-relaxed">
                    {item}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-black/5 flex items-center gap-2 text-[11px] font-space font-bold text-emerald-600 uppercase">
                  <Check className="w-3.5 h-3.5" /> Included in Sprint
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. 4-STEP SPRINT EXECUTION ROADMAP */}
        <section className="text-left space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-brand-dark" />
              Battle-Tested Process
            </div>
            <h2 className="font-space font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-brand-dark">
              THE 4-STEP SPRINT BLUEPRINT.
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-inter max-w-2xl mt-1">
              How we take your marketing from initial brief to high-performance scale in record time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(service.strategySteps || []).map((st, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-black rounded-2xl p-6 relative flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-space font-extrabold text-3xl text-brand-blue">
                      {st.step}
                    </span>
                    <span className="font-space font-bold text-[10px] uppercase px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      Phase 0{idx + 1}
                    </span>
                  </div>
                  <h4 className="font-space font-bold text-base uppercase text-brand-dark mb-2">
                    {st.name}
                  </h4>
                  <p className="text-gray-600 text-xs font-inter leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between text-[11px] font-space text-gray-500">
                  <span>Velocity: Days {idx * 2 + 1}-{idx * 2 + 2}</span>
                  <span className="text-brand-dark font-bold">100% On Time</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. PRODUCTION-GRADE TECH & TOOL STACK */}
        <section className="text-left space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-2">
              <Code className="w-3.5 h-3.5 text-brand-dark" />
              Modern Tooling
            </div>
            <h2 className="font-space font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-brand-dark">
              ENTERPRISE PRODUCTION STACK.
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-inter max-w-2xl mt-1">
              We never cut corners with amateur software. We engineer on the exact tools used by top global brands and fast-scaling venture startups.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {techStack.map((tool, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-black rounded-2xl p-4 text-center hover:bg-brand-lime/10 transition-colors shadow-sm"
              >
                <div className="font-space font-bold text-sm text-brand-dark mb-1">
                  {tool.name}
                </div>
                <div className="font-inter text-[11px] text-gray-500 leading-tight">
                  {tool.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. FEATURED CONTEXTUAL CASE STUDY SPOTLIGHT */}
        {matchedCase && (
          <section className="text-left space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-2">
                  <Star className="w-3.5 h-3.5 text-brand-dark" />
                  Field Results
                </div>
                <h2 className="font-space font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-brand-dark">
                  PROVEN RESULTS IN ACTION.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(`/work/${matchedCase.slug}`)}
                className="font-space font-bold text-xs uppercase text-brand-dark hover:text-brand-blue transition-colors flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer"
              >
                <span>Read Full Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
                <img
                  src={matchedCase.heroImage}
                  alt={matchedCase.brand}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase w-fit mb-2">
                    {matchedCase.category}
                  </span>
                  <h3 className="font-space font-bold text-xl text-white uppercase">
                    {matchedCase.brand}
                  </h3>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-space font-extrabold text-3xl sm:text-4xl text-brand-blue">
                      {matchedCase.metric}
                    </span>
                    <span className="font-space font-bold text-xs uppercase text-gray-600">
                      {matchedCase.result}
                    </span>
                  </div>

                  <h4 className="font-space font-bold text-lg sm:text-xl uppercase tracking-tight text-brand-dark mb-3">
                    {matchedCase.title}
                  </h4>

                  <p className="text-gray-700 text-xs sm:text-sm font-inter leading-relaxed mb-6">
                    {matchedCase.strategy || matchedCase.challenge}
                  </p>

                  {matchedCase.testimonial && (
                    <div className="bg-brand-light-gray rounded-2xl p-5 border border-black/5">
                      <p className="text-xs sm:text-sm font-inter italic text-gray-800 mb-2">
                        "{matchedCase.testimonial.quote}"
                      </p>
                      <div className="font-space font-bold text-xs text-brand-dark">
                        — {matchedCase.testimonial.author},{" "}
                        <span className="font-normal text-gray-500">{matchedCase.testimonial.role}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-black/10">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(service.title)}
                    className="bg-brand-lime text-brand-dark px-6 py-3 rounded-xl font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all cursor-pointer border-none shadow-sm"
                  >
                    Deploy Similar Campaign →
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/work/${matchedCase.slug}`)}
                    className="text-xs font-space font-bold uppercase text-brand-dark underline hover:text-brand-blue bg-transparent border-none cursor-pointer"
                  >
                    View Breakdown Dossier
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 10. INCLUDED ASSETS & DELIVERABLES CHECKLIST */}
        <section className="bg-white border-2 border-black rounded-3xl p-6 sm:p-10 text-left space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-space font-bold text-[11px] uppercase tracking-wider text-gray-500 block mb-1">
                Asset Transfer Protocol
              </span>
              <h3 className="font-space font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-brand-dark">
                INCLUDED ASSETS & DELIVERABLES.
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-space font-bold text-xs uppercase border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Commercial IP Transfer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {(service.deliverables || []).map((del, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-[#F8F8F8] px-4 py-3.5 rounded-xl border border-black/5 text-xs sm:text-sm font-inter font-medium text-gray-800"
              >
                <div className="w-5 h-5 rounded-full bg-brand-lime flex items-center justify-center shrink-0 text-brand-dark font-space font-bold text-[10px]">
                  ✓
                </div>
                <span>{del}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 11. EXPANDABLE FAQ ACCORDION */}
        <section className="text-left space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-brand-dark" />
              Got Questions?
            </div>
            <h2 className="font-space font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-brand-dark">
              FREQUENTLY ASKED QUESTIONS.
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-inter max-w-2xl mt-1">
              Everything you need to know about working with GetIntoFeed for {service.title}.
            </p>
          </div>

          <div className="space-y-3">
            {(service.faqs || []).map((faq, idx) => {
              const isOpen = expandedFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border-2 border-black rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaqIndex(isOpen ? -1 : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 bg-transparent border-none cursor-pointer"
                  >
                    <span className="font-space font-bold text-sm sm:text-base uppercase text-brand-dark">
                      {faq.q}
                    </span>
                    <span className="p-1 rounded-full bg-gray-100 shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-brand-dark" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-brand-dark" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-0 text-gray-700 text-xs sm:text-sm font-inter leading-relaxed border-t border-black/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 12. HIGH-CONVERTING BRUTALIST CLOSING BANNER */}
        <section className="bg-[#09090B] text-white border-2 border-black rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-2xl space-y-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-lime font-space font-bold text-xs uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> 7-Day Sprint Availability Open
            </div>

            <h2 className="font-space font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white leading-tight">
              READY TO ACCELERATE YOUR <br className="hidden sm:inline" />
              <span className="text-brand-lime">{service.title.toUpperCase()}?</span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg font-inter max-w-2xl mx-auto leading-relaxed">
              Skip the 3-month agency pitch deck circus. Deploy an elite, revenue-focused marketing sprint with GetIntoFeed in under 7 business days.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => handleOpenModal(service.title)}
              className="bg-brand-lime text-brand-dark px-8 py-4 rounded-xl font-space font-extrabold uppercase text-xs sm:text-sm tracking-wider hover:bg-[#E2FF4D] transition-all shadow-lg hover:scale-105 cursor-pointer border-none flex items-center gap-2"
            >
              <span>Book 15-Minute Strategy Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/918810356950?text=${encodeURIComponent("Hi GetIntoFeed, I would like to schedule a strategy call regarding " + service.title)}`}
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-4 rounded-xl font-space font-bold uppercase text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer no-underline"
            >
              <MessageCircle className="w-4 h-4 text-brand-lime" />
              <span>Direct WhatsApp (+91 8810356950)</span>
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-space font-medium text-gray-400">
            <span>⚡ Average Response: 15 Minutes</span>
            <span>•</span>
            <span>🔒 Strict Mutual NDA Guarantee</span>
            <span>•</span>
            <span>💯 100% Commercial IP Transfer</span>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// WORK / PORTFOLIO PAGE (/work)
// =========================================================================
export function WorkPage({ onNavigate }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "High-Ticket Real Estate", "E-Commerce & D2C", "B2B & FinTech"];
  const currentCases = getStoredCaseStudies();
  const filtered = filter === "All" ? currentCases : currentCases.filter((c) => c.category === filter);

  return (
    <PageLayout onNavigate={onNavigate} activeNav="work">
      <div className="space-y-16 md:space-y-24 text-left">
        {/* Hero Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-brand-dark" />
            Verified Case Studies & ROI
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95]">
            SELECTED WORK. <br />
            <span className="text-brand-blue">REAL COMMERCIAL ROAS.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed max-w-2xl">
            Explore how we partner with ambitious ventures to replace generic marketing with high-velocity creative, positive unit economics, and predictable scale.
          </p>
        </div>

        {/* Proof Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-dark mb-1">₹120Cr+</div>
            <div className="font-space font-bold text-xs uppercase text-gray-500">Pipeline Scaled</div>
          </div>
          <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-blue mb-1">3.8x - 6.4x</div>
            <div className="font-space font-bold text-xs uppercase text-gray-500">Average ROAS</div>
          </div>
          <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-dark mb-1">24+</div>
            <div className="font-space font-bold text-xs uppercase text-gray-500">Venture Sprints</div>
          </div>
          <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="font-space font-extrabold text-3xl md:text-4xl text-emerald-600 mb-1">100%</div>
            <div className="font-space font-bold text-xs uppercase text-gray-500">Client IP Transfer</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                filter === cat
                  ? "bg-[#09090B] text-white border-[#09090B] shadow-md"
                  : "bg-white text-gray-700 border-black/10 hover:border-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3-Column Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((cs) => (
            <div
              key={cs.slug}
              className="bg-white border-2 border-black rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden relative border-b-2 border-black">
                  <img
                    src={cs.heroImage}
                    alt={cs.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase px-3 py-1 rounded-full border border-black shadow-sm">
                    {cs.metric} {cs.result}
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-space font-bold text-xs uppercase text-brand-blue">
                      {cs.brand}
                    </span>
                    <span className="font-space font-medium text-[10px] uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {cs.category}
                    </span>
                  </div>

                  <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark group-hover:text-brand-blue transition-colors leading-tight">
                    {cs.title}
                  </h3>

                  <p className="text-gray-600 text-xs font-inter leading-relaxed line-clamp-3">
                    {cs.challenge}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(cs.services || []).map((s, idx) => (
                      <span key={idx} className="bg-gray-100 border border-black/5 text-gray-700 px-2.5 py-0.5 rounded-full text-[10px] font-space font-bold uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0">
                <button
                  type="button"
                  onClick={() => onNavigate(`/work/${cs.slug}`)}
                  className="w-full bg-brand-light-gray hover:bg-brand-lime text-brand-dark py-3 rounded-xl font-space font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-black/10 flex items-center justify-center gap-1.5"
                >
                  Read Full Teardown <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// CASE STUDY DETAIL PAGE (/work/:slug) — WITH EMBEDDED CONSULTATION FORM
// =========================================================================
export function CaseStudyDetailPage({ slug, onNavigate }) {
  const currentCases = getStoredCaseStudies();
  const cs = currentCases.find((c) => c.slug === slug) || currentCases[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: cs.services ? cs.services[0] : "Paid Performance & Meta/Google Ads",
    plan: "Growth Plan — ₹29,999 / mo",
    requirements: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }
    setSubmitting(true);

    const leadData = {
      id: "case-lead-" + Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || "Case Study Inquiry",
      service: formData.service,
      plan: formData.plan,
      budget: formData.plan,
      requirements: formData.requirements,
      source: `Case Study: ${cs.brand}`
    };

    try {
      const existingRaw = localStorage.getItem("gif_admin_leads");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem("gif_admin_leads", JSON.stringify([leadData, ...existing]));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    try {
      await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData)
      });
    } catch {}

    try {
      trackLeadConversion({
        id: leadData.id,
        service: `${formData.service} (${cs.brand} Teardown)`,
        source: "case_study_detail_form",
        company: leadData.company
      });
    } catch {}

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="work">
      <div className="space-y-10 md:space-y-12 text-left max-w-7xl mx-auto">
        {/* Top Breadcrumb & Brand Dossier */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate("/work")}
            className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase text-gray-500 hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Case Studies
          </button>
          <span className="font-space font-bold text-xs text-gray-400">
            Case Dossier: {cs.brand}
          </span>
        </div>

        {/* Hero Headline & Category Tags */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-xs uppercase border border-black shadow-sm">
              <Sparkles className="w-3 h-3" /> {cs.brand}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-space font-bold text-xs uppercase border border-black/5">
              {cs.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-blue font-space font-bold text-xs uppercase border border-blue-200">
              Verified Case Study
            </span>
          </div>

          <h1 className="font-space font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark leading-[0.98]">
            {cs.title}
          </h1>

          <div className="flex flex-wrap gap-2 pt-1">
            {(cs.services || []).map((s, idx) => (
              <span key={idx} className="bg-white border border-black/10 text-gray-700 px-3 py-1 rounded-lg text-xs font-space font-bold uppercase shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Executive Summary Metric Strip */}
        <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-sm">
          <div>
            <div className="text-[10px] font-space font-bold uppercase text-gray-500">Industry</div>
            <div className="font-space font-bold text-sm text-brand-dark mt-0.5">{cs.category}</div>
          </div>
          <div>
            <div className="text-[10px] font-space font-bold uppercase text-gray-500">Sprint Cadence</div>
            <div className="font-space font-bold text-sm text-brand-dark mt-0.5">90-Day Execution</div>
          </div>
          <div>
            <div className="text-[10px] font-space font-bold uppercase text-gray-500">Channels</div>
            <div className="font-space font-bold text-sm text-brand-blue mt-0.5">{(cs.services || []).slice(0, 2).join(" + ")}</div>
          </div>
          <div>
            <div className="text-[10px] font-space font-bold uppercase text-gray-500">Verified Impact</div>
            <div className="font-space font-extrabold text-sm text-emerald-600 mt-0.5">{cs.metric} {cs.result}</div>
          </div>
        </div>

        {/* Desktop 2-Column Split: Content (8 Cols) vs Sticky Lead Teardown Bar (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visuals, Breakdown, Metrics & Craft (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Visual Hero Showcase */}
            <div className="rounded-3xl overflow-hidden border-2 border-black aspect-video w-full shadow-xl relative">
              <img src={cs.heroImage} alt={cs.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-brand-lime text-brand-dark px-3.5 py-1.5 rounded-full font-space font-bold text-xs uppercase border border-black shadow">
                {cs.metric} Impact Achieved
              </div>
            </div>

            {/* Key Metrics Results Grid */}
            <div className="space-y-3">
              <h3 className="font-space font-bold text-xs uppercase tracking-wider text-gray-500">
                QUANTIFIED COMMERCIAL IMPACT
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(cs.results || []).map((r, idx) => (
                  <div key={idx} className="bg-white border-2 border-black rounded-2xl p-5 text-center shadow-sm">
                    <div className="font-space font-extrabold text-2xl md:text-3xl text-brand-blue mb-1">
                      {r.val}
                    </div>
                    <div className="font-space font-bold text-[11px] uppercase text-gray-600">
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge vs Execution Story Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#FFF8F8] border-2 border-red-200 rounded-2xl p-5 sm:p-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-space font-bold text-[11px] uppercase">
                  The Commercial Challenge
                </div>
                <h4 className="font-space font-bold text-base uppercase text-brand-dark">
                  Ad Fatigue & Rising CAC
                </h4>
                <p className="text-xs text-gray-700 font-inter leading-relaxed">
                  Before partnering with GetIntoFeed, {cs.brand} struggled with customer acquisition costs increasing month-over-month. Their previous creative assets were failing to stop the thumb on short-form platforms, leading to blended ROAS compressing below sustainable unit economics.
                </p>
              </div>

              <div className="bg-[#F6FFF8] border-2 border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-space font-bold text-[11px] uppercase">
                  GetIntoFeed Execution Strategy
                </div>
                <h4 className="font-space font-bold text-base uppercase text-brand-dark">
                  Algorithmic Video & Conversion Funnel
                </h4>
                <p className="text-xs text-gray-700 font-inter leading-relaxed">
                  We engineered 18 high-velocity visual interrupt hooks, restructured their Meta Advantage+ bidding taxonomy, and deployed high-converting React landing pages loaded under 0.8s. The results were instant: thumb-stop rates jumped by 400% and CPA dropped by 52%.
                </p>
              </div>
            </div>

            {/* Behind the Creative Direction & Visual Craft */}
            <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-space font-bold uppercase text-brand-blue tracking-wider">
                    EXECUTION ROADMAP
                  </div>
                  <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark">
                    How We Engineered the Growth Sprint
                  </h3>
                </div>
                <div className="bg-brand-lime/20 border border-brand-lime text-brand-dark px-3 py-1 rounded-full text-xs font-space font-bold uppercase">
                  90-Day Sprint Cycle
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="border-l-2 border-black pl-4 space-y-1">
                  <div className="font-space font-bold text-xs uppercase text-brand-dark">Sprint Phase 01: Deep Forensic Audit (Days 1–14)</div>
                  <p className="text-xs text-gray-600 font-inter">Audited 12 months of pixel telemetry, customer cohorts, and creative fatigue curves to identify the highest leverage bottlenecks.</p>
                </div>
                <div className="border-l-2 border-brand-blue pl-4 space-y-1">
                  <div className="font-space font-bold text-xs uppercase text-brand-blue">Sprint Phase 02: Creative Production & Testing (Days 15–45)</div>
                  <p className="text-xs text-gray-600 font-inter">Scripted, filmed, and animated 24 high-tension short-form video variations with algorithmic frame-1 disruption.</p>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                  <div className="font-space font-bold text-xs uppercase text-emerald-700">Sprint Phase 03: Scale & Attribution Hardening (Days 46–90)</div>
                  <p className="text-xs text-gray-600 font-inter">Scaled daily spend aggressively while maintaining target ROAS thresholds and deploying CAPI conversion deduplication.</p>
                </div>
              </div>
            </div>

            {/* Verification & Attestation Statement */}
            <div className="bg-gray-100 border border-black/10 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-brand-blue shrink-0" />
                <div className="text-xs text-gray-700 font-inter">
                  <strong>Verified Client Outcome:</strong> All performance metrics reported have been verified against client ad account ledgers and CRM attribution logs.
                </div>
              </div>
              <span className="font-space font-bold text-[10px] uppercase text-gray-500 shrink-0">
                Attested 2026
              </span>
            </div>
          </div>

          {/* Right Column: Sticky Lead Teardown Bar on Desktop (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
            <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-xl space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase border border-black shadow-xs">
                  <Zap className="w-3 h-3 fill-brand-dark" /> Sprint Diagnostic
                </div>
                <span className="text-[10px] font-space font-bold text-emerald-600 uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Desk Online
                </span>
              </div>

              <div>
                <h3 className="font-space font-extrabold text-xl uppercase tracking-tight text-brand-dark leading-tight">
                  Want Similar Results For Your Brand?
                </h3>
                <p className="text-xs text-gray-600 mt-1 font-inter">
                  Claim a 30-min growth teardown directly with our senior performance strategist.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="font-space font-bold text-sm uppercase text-emerald-800">
                    Teardown Slot Requested!
                  </div>
                  <p className="text-xs text-emerald-700 font-inter leading-relaxed">
                    Our performance architect will WhatsApp/call you on <strong>{formData.phone}</strong> within 20 minutes.
                  </p>
                  <a
                    href="https://wa.me/918810356950?text=Hi%20GetIntoFeed%2C%20I%20just%20requested%20a%20teardown%20for%20my%20brand"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white font-space font-bold text-xs uppercase rounded-xl no-underline shadow-sm hover:bg-[#20ba5a]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Open WhatsApp Directly
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-space font-bold uppercase text-gray-600 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-space font-bold uppercase text-gray-600 mb-1">
                      Brand / Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Lifestyle"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-space font-bold uppercase text-gray-600 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        placeholder="rahul@brand.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-space font-bold uppercase text-gray-600 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 8810356950"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-space font-bold uppercase text-gray-600 mb-1">
                      Sprint Tier
                    </label>
                    <select
                      value={formData.plan}
                      onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                      className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter cursor-pointer"
                    >
                      <option value="Starter Sprint — ₹14,999 / mo">Starter Sprint — ₹14,999 / mo</option>
                      <option value="Growth Plan — ₹29,999 / mo">Growth Plan — ₹29,999 / mo</option>
                      <option value="Enterprise Scale — ₹49,999 / mo">Enterprise Scale — ₹49,999 / mo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-space font-bold uppercase text-gray-600 mb-1">
                      Current Bottleneck / Goals
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Scaling Meta Ads from ₹1L to ₹5L daily..."
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-lime text-brand-dark py-3 rounded-xl font-space font-extrabold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] disabled:opacity-50"
                  >
                    {submitting ? "Transmitting..." : "Schedule Strategy Teardown →"}
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="https://wa.me/918810356950?text=Hi%20GetIntoFeed%2C%20I%20saw%20your%20case%20study%20and%20want%20to%20chat"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-space font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 no-underline shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Quick Chat
                </a>
                <a
                  href="tel:+918810356950"
                  className="text-center text-[10px] font-space font-bold text-gray-500 hover:text-brand-dark no-underline py-0.5"
                >
                  Hotline: +91 8810356950
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate("/work")}
            className="text-xs font-space font-bold uppercase text-brand-dark hover:text-brand-blue transition-colors bg-transparent border-none p-0 cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Case Studies
          </button>
          <a
            href="https://wa.me/918810356950?text=Hi%20GetIntoFeed%2C%20I%20saw%20your%20case%20study%20and%20want%20to%20chat"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-space font-bold uppercase text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 no-underline"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Direct WhatsApp (+91 8810356950)
          </a>
        </div>
      </div>
    </PageLayout>
  );
}

export function ReviewsPage({ onNavigate }) {
  const [reviews, setReviews] = useState(getStoredReviews);
  useEffect(() => {
    const handleStorage = () => setReviews(getStoredReviews());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  return (
    <PageLayout onNavigate={onNavigate} activeNav="reviews">
      <div className="space-y-16 text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5 fill-brand-dark text-brand-dark" />
            Verified Client Feedback
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            WHAT FOUNDERS SAY. <br />
            <span className="text-brand-blue">VERIFIED REVIEWS.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
            Read transparent reviews and verified feedback from the founders, CMOs, and marketing leads who rely on GetIntoFeed to scale their businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-white border-2 border-black rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1 mb-4 text-brand-dark">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-lime text-brand-dark" />
                  ))}
                </div>
                <p className="font-inter text-gray-700 text-xs md:text-sm leading-relaxed mb-6 italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-black/10 flex items-center gap-3">
                <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-black" />
                <div>
                  <div className="font-space font-bold text-xs uppercase text-brand-dark">{rev.name}</div>
                  <div className="text-[11px] text-gray-500 font-inter">{rev.role}, {rev.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// PRICING PAGE (/pricing)
// =========================================================================
export function PricingPage({ onNavigate }) {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Basic Plan (₹14,999/mo)");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search || "";
      const hash = window.location.hash || "";
      if (search.includes("talkToSales") || hash.includes("talkToSales")) {
        setSelectedService("Talk to Sales - Custom Plan");
        setLeadModalOpen(true);
      }
    }
  }, []);

  const tiers = [
    {
      name: "Basic",
      tagline: "GET YOUR BRAND MOVING.",
      focus: "SOCIAL + CONTENT + ADS",
      price: "₹14,999",
      period: "/ mo",
      desc: "For fast-moving brands looking to establish authority and test paid social with elite creative direction.",
      features: [
        "Social Media Management & Creative Strategy",
        "8 Custom thumb-stopping video/carousel creative assets",
        "Meta Ads Setup, Audience Testing & Optimization",
        "Weekly creative sprint reviews and angle testing",
        "Standard Looker Studio KPI dashboard",
        "Dedicated Support Lead in your Slack/WhatsApp"
      ],
      cta: "Explore Basic",
      planKey: "Basic Plan (₹14,999/mo)",
      badge: "Fast Start"
    },
    {
      name: "Intermediate",
      tagline: "TURN ATTENTION INTO BUSINESS.",
      focus: "SOCIAL + CONTENT + GOOGLE + META",
      price: "₹29,999",
      period: "/ mo",
      desc: "Our flagship full-stack growth program for ambitious brands ready to scale acquisition profitably.",
      features: [
        "Full-Stack Multi-Channel (Meta, Google & Organic Social)",
        "20+ High-velocity video reels, UGC cuts, and ad creatives",
        "Server-side CAPI and advanced GA4 attribution tracking",
        "Landing page CRO wireframes & conversion audits",
        "Dedicated Account Director + Video Producer in your Slack",
        "Bi-weekly strategic growth calls & sprint roadmap"
      ],
      cta: "Explore Intermediate",
      planKey: "Intermediate Plan (₹29,999/mo)",
      badge: "Most Popular",
      popular: true
    },
    {
      name: "Advanced",
      tagline: "MAKE GROWTH YOUR NORMAL.",
      focus: "FULL GROWTH SYSTEM",
      price: "₹44,999",
      period: "/ mo",
      desc: "Complete omnichannel growth dominance and dedicated tech support for scaling category leaders.",
      features: [
        "Total omnichannel growth (Paid Ads, Organic, Video, SEO, Web)",
        "Unlimited creative iterations and custom production velocity",
        "Full React / Web engineering and funnel optimization",
        "Executive CMO strategic advisory & competitor intelligence",
        "24/7 Priority escalation desk and dedicated squad"
      ],
      cta: "Explore Advanced",
      planKey: "Advanced Plan (₹44,999/mo)",
      badge: "Full Growth System"
    }
  ];

  return (
    <PageLayout
      onNavigate={onNavigate}
      activeNav="pricing"
      leadModalOpen={leadModalOpen}
      setLeadModalOpen={setLeadModalOpen}
      selectedService={selectedService}
      setSelectedService={setSelectedService}
    >
      <div className="space-y-16 text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-brand-blue" />
            Transparent Pricing
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            CLEAR PRICING. <br />
            <span className="text-brand-blue">ZERO HIDDEN MARKUPS.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
            Transparent, fixed pricing for ambitious brands ready to dominate the feed. Select a plan below to start your sprint or consult with our growth team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between border-2 transition-all relative ${
                tier.popular
                  ? "bg-brand-lime text-brand-dark border-brand-lime shadow-2xl scale-[1.02] ring-2 ring-brand-blue"
                  : "bg-white border-black/20 hover:border-black shadow-sm text-brand-dark"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-dark text-white px-4 py-1 rounded-full font-space font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 border border-brand-lime">
                  <Star className="w-3 h-3 text-brand-lime fill-brand-lime" /> {tier.badge}
                </div>
              )}

              <div>
                <div className="font-space font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">
                  {tier.name}
                </div>
                <div className="font-space font-bold text-lg uppercase tracking-tight mb-1 text-brand-dark">
                  {tier.tagline}
                </div>
                <div className="text-[10px] font-space font-bold uppercase tracking-wider text-brand-blue mb-4">
                  {tier.focus}
                </div>

                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-black/10">
                  <span className="font-space font-extrabold text-3xl md:text-4xl text-brand-dark">
                    {tier.price}
                  </span>
                  <span className="text-xs text-gray-500 font-space font-bold">{tier.period}</span>
                </div>

                <p className="text-gray-600 text-xs font-inter mb-6 min-h-[36px]">
                  {tier.desc}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="font-space font-bold text-[11px] uppercase text-gray-500">What's Included:</div>
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-inter text-gray-700">
                      <Check className="w-3.5 h-3.5 text-brand-blue shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedService(tier.planKey);
                  setLeadModalOpen(true);
                }}
                className={`w-full py-3.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider transition-all cursor-pointer border-none ${
                  tier.popular
                    ? "bg-brand-dark text-white hover:bg-black shadow-md"
                    : "bg-brand-dark text-white hover:bg-brand-blue"
                }`}
              >
                {tier.cta} →
              </button>
            </div>
          ))}
        </div>

        {/* Custom Scope / Talk to Sales Box */}
        <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark mb-2">
              NEED A TAILORED ENTERPRISE OR MULTI-BRAND SCOPE?
            </h3>
            <p className="text-gray-600 text-xs md:text-sm font-inter">
              If your media spend exceeds ₹15L/month or you need bespoke omnichannel infrastructure, let's build a dedicated growth pod.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedService("Talk to Sales - Custom Plan");
              setLeadModalOpen(true);
            }}
            className="bg-brand-lime text-brand-dark px-8 py-4 rounded-xl font-space font-bold uppercase text-xs tracking-wider hover:bg-brand-dark hover:text-white transition-all whitespace-nowrap cursor-pointer border-none shadow-md"
          >
            Talk to Sales →
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// BLOG / FEED NOTES (/blog & /blog/:slug) WITH REACTIONS, SHARE & COMMENTS
// =========================================================================
export function FeedNotesPage({ slug, onNavigate }) {
  const [selectedSlug, setSelectedSlug] = useState(slug || null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [reactions, setReactions] = useState({ love: 42, fire: 89, clap: 35, funny: 12, insightful: 67 });
  const [reacted, setReacted] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Comments state
  const [comments, setComments] = useState([
    { name: "Siddharth Rao", comment: "The breakdown of frame 1 visual interrupts changed how we film our reels. Immediate 3x retention bump.", date: "March 3, 2026" },
    { name: "Pooja Hegde", comment: "Finally an agency talking about the economic reality of CAC instead of just pretty aesthetics.", date: "March 4, 2026" }
  ]);
  const [newComment, setNewComment] = useState({ name: "", email: "", comment: "" });
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Article CTA Form State
  const [articleFormData, setArticleFormData] = useState({ name: "", email: "", phone: "", requirements: "" });
  const [articleFormSubmitted, setArticleFormSubmitted] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const categories = ["All", "Paid Performance", "Creative Direction", "SEO & AI Citations", "Conversion Strategy"];
  const [articles, setArticles] = useState(getStoredBlogPosts);
  useEffect(() => {
    const handleStorage = () => setArticles(getStoredBlogPosts());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  const allArticles = articles || [];

  const activeArticle = allArticles.find((b) => b.slug === selectedSlug);

  useEffect(() => {
    if (!activeArticle) {
      setReadingProgress(0);
      return;
    }
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const p = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
        setReadingProgress(p);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeArticle]);

  const filteredArticles = allArticles.filter((b) => {
    const matchCategory = activeCategory === "All" || b.category === activeCategory;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredArticle = allArticles[0];

  const handleReact = (type) => {
    if (reacted[type]) return;
    setReactions((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    setReacted((prev) => ({ ...prev, [type]: true }));
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent("Check out this growth article from GetIntoFeed: " + url)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.email || !newComment.comment) {
      alert("Please fill in your name, email, and comment.");
      return;
    }
    setComments([
      ...comments,
      { name: newComment.name, comment: newComment.comment, date: "Just now" }
    ]);
    setCommentSubmitted(true);
    setNewComment({ name: "", email: "", comment: "" });
  };

  const handleArticleFormSubmit = async (e) => {
    e.preventDefault();
    if (!articleFormData.name || !articleFormData.email || !articleFormData.phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }

    try {
      await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: articleFormData.name,
          email: articleFormData.email,
          phone: articleFormData.phone,
          service: "Growth Strategy from Blog",
          message: `From Article [${activeArticle.title}]: ${articleFormData.requirements}`,
          source: "Blog In-Article Consultation Form"
        })
      });
    } catch {}

    setArticleFormSubmitted(true);
  };

  // =========================================================================
  // SINGLE ARTICLE VIEW (/blog/:slug)
  // =========================================================================
  if (activeArticle) {
    const relatedArticles = allArticles.filter((b) => b.slug !== activeArticle.slug).slice(0, 3);

    return (
      <PageLayout onNavigate={onNavigate} activeNav="blog">
      {activeArticle && (
        <div
          className="fixed top-0 left-0 h-1 bg-brand-lime z-50 transition-all duration-75 ease-out shadow-sm"
          style={{ width: `${readingProgress}%` }}
          id="blog-reading-progress"
        />
      )}
        <div className="space-y-12 text-left max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase text-gray-500 hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
            </button>
            <span className="font-space font-bold text-xs text-brand-blue uppercase">
              {activeArticle.category}
            </span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-space font-bold uppercase text-gray-500">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-lime text-brand-dark">{activeArticle.category}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
              <span>•</span>
              <span>{activeArticle.date}</span>
            </div>

            <h1 className="font-space font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95]">
              {activeArticle.title}
            </h1>

            {/* Author & Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-black/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-dark text-white font-space font-bold flex items-center justify-center text-xs uppercase">
                  {activeArticle.author.slice(0, 2)}
                </div>
                <div>
                  <div className="font-space font-bold text-xs uppercase text-brand-dark">{activeArticle.author}</div>
                  <div className="text-[11px] text-gray-500 font-inter">{activeArticle.authorRole}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare("whatsapp")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-space font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> Share WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => handleShare("copy")}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-space font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer border-none"
                >
                  {copiedLink ? "✓ Link Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>

          {/* Key Takeaways Box */}
          <div className="bg-brand-light-gray border-2 border-black rounded-2xl p-6 space-y-2">
            <div className="font-space font-bold text-xs uppercase text-brand-blue flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Core Thesis & Key Takeaways
            </div>
            <p className="font-inter text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
              {activeArticle.excerpt}
            </p>
          </div>

          {/* Article Body Content */}
          <div className="prose prose-neutral max-w-none text-gray-800 font-inter text-sm sm:text-base leading-relaxed space-y-6">
            <div className="whitespace-pre-line leading-loose">
              {activeArticle.content}
            </div>
          </div>

          {/* Interactive Reactions */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 text-center space-y-3 shadow-sm">
            <h4 className="font-space font-bold text-xs uppercase tracking-wider text-gray-500">
              DID YOU FIND THIS VALUABLE? LEAVE A REACTION
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleReact("love")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-space font-bold transition-all cursor-pointer ${
                  reacted.love ? "bg-red-50 border-red-500 text-red-600 shadow-sm" : "bg-white border-black/20 hover:border-black"
                }`}
              >
                ❤️ <span>Love</span> <span className="text-gray-500">({reactions.love})</span>
              </button>
              <button
                type="button"
                onClick={() => handleReact("fire")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-space font-bold transition-all cursor-pointer ${
                  reacted.fire ? "bg-orange-50 border-orange-500 text-orange-600 shadow-sm" : "bg-white border-black/20 hover:border-black"
                }`}
              >
                🔥 <span>Fire</span> <span className="text-gray-500">({reactions.fire})</span>
              </button>
              <button
                type="button"
                onClick={() => handleReact("clap")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-space font-bold transition-all cursor-pointer ${
                  reacted.clap ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm" : "bg-white border-black/20 hover:border-black"
                }`}
              >
                👏 <span>Clap</span> <span className="text-gray-500">({reactions.clap})</span>
              </button>
            </div>
          </div>

          {/* EMBEDDED IN-ARTICLE CONSULTATION FORM */}
          <div className="bg-[#09090B] text-white border-2 border-black rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase">
                ⚡ IMPLEMENT THIS BLUEPRINT
              </span>
              <h3 className="font-space font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white">
                WANT US TO EXECUTE THIS STRATEGY FOR YOUR BRAND?
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm font-inter">
                Skip the trial and error. Book a direct consultation with our senior strategy directors.
              </p>
            </div>

            {articleFormSubmitted ? (
              <div className="bg-white/10 rounded-2xl p-6 text-center space-y-2 border border-brand-lime/30">
                <CheckCircle2 className="w-8 h-8 text-brand-lime mx-auto" />
                <div className="font-space font-bold text-base uppercase text-brand-lime">Request Received</div>
                <p className="text-xs text-gray-300">Our senior team will reach out via WhatsApp/Phone within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleArticleFormSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={articleFormData.name}
                    onChange={(e) => setArticleFormData({ ...articleFormData, name: e.target.value })}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-lime font-inter"
                  />
                  <input
                    type="email"
                    placeholder="Work Email *"
                    value={articleFormData.email}
                    onChange={(e) => setArticleFormData({ ...articleFormData, email: e.target.value })}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-lime font-inter"
                  />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp *"
                    value={articleFormData.phone}
                    onChange={(e) => setArticleFormData({ ...articleFormData, phone: e.target.value })}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-lime font-inter"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Tell us about your brand and what you want to achieve..."
                  value={articleFormData.requirements}
                  onChange={(e) => setArticleFormData({ ...articleFormData, requirements: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-lime font-inter resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-brand-lime text-brand-dark py-3.5 rounded-xl font-space font-extrabold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all cursor-pointer border-none shadow-md"
                >
                  Book 15-Minute Strategy Teardown →
                </button>
              </form>
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-6 pt-6 border-t border-black/10">
            <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark">
              COMMENTS & DISCUSSION ({comments.length})
            </h3>

            <div className="space-y-4">
              {comments.map((cm, idx) => (
                <div key={idx} className="bg-white border-2 border-black rounded-2xl p-5 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-space font-bold uppercase text-brand-dark">{cm.name}</span>
                    <span className="text-gray-400 font-inter">{cm.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 font-inter leading-relaxed">
                    {cm.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-white border-2 border-black rounded-2xl p-6 space-y-3">
              <h4 className="font-space font-bold text-xs uppercase text-brand-dark">Add Your Voice to the Discussion</h4>
              {commentSubmitted ? (
                <div className="text-xs text-emerald-600 font-space font-bold">Thank you! Your comment has been posted.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={newComment.name}
                      onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                      required
                      className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2 text-xs font-inter"
                    />
                    <input
                      type="email"
                      placeholder="Your Email *"
                      value={newComment.email}
                      onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                      required
                      className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2 text-xs font-inter"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your perspective or query..."
                    value={newComment.comment}
                    onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                    required
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2 text-xs font-inter resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-brand-dark text-white px-5 py-2.5 rounded-xl font-space font-bold text-xs uppercase cursor-pointer border-none"
                  >
                    Post Comment
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Related Articles */}
          <div className="space-y-4 pt-6">
            <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark">
              MORE STRATEGIC BREAKDOWNS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.slug}
                  onClick={() => { setSelectedSlug(rel.slug); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="bg-white border-2 border-black rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-space font-bold text-[10px] uppercase text-brand-blue block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-space font-bold text-xs uppercase text-brand-dark line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="text-[10px] text-gray-500 font-inter pt-3 mt-3 border-t border-black/5">
                    {rel.readTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // =========================================================================
  // BLOG LISTING HUB VIEW (/blog) — MAGAZINE STYLE UX
  // =========================================================================
  return (
    <PageLayout onNavigate={onNavigate} activeNav="blog">
      <div className="space-y-12 md:space-y-16 text-left">
        {/* Magazine Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/30 border border-brand-lime/60 text-brand-dark font-space font-bold text-xs uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-brand-dark" />
            Feed Notes & Insights
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95]">
            FIELD NOTES. <br />
            <span className="text-brand-blue">UNCENSORED PLAYBOOKS.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed max-w-2xl">
            Real performance marketing teardowns, creative psychology frameworks, and organic algorithm breakdowns written by active growth directors.
          </p>
        </div>

        {/* FEATURED STORY SPOTLIGHT */}
        {featuredArticle && (
          <div
            onClick={() => setSelectedSlug(featuredArticle.slug)}
            className="bg-[#09090B] text-white border-2 border-black rounded-3xl p-6 sm:p-10 shadow-2xl cursor-pointer hover:shadow-3xl transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                  Featured Teardown
                </span>
                <span className="text-xs font-space text-gray-400">
                  {featuredArticle.readTime}
                </span>
              </div>
              <h2 className="font-space font-extrabold text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-white leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm font-inter leading-relaxed max-w-2xl">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-space font-bold text-brand-lime">
                  {featuredArticle.author.slice(0, 2)}
                </div>
                <div className="text-xs font-space">
                  <span className="text-white font-bold">{featuredArticle.author}</span>
                  <span className="text-gray-400"> • {featuredArticle.date}</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <span className="inline-flex items-center gap-2 bg-brand-lime text-brand-dark px-6 py-3.5 rounded-xl font-space font-extrabold uppercase text-xs tracking-wider shadow-md">
                Read Full Teardown <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        )}

        {/* Filter Pills & Instant Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? "bg-[#09090B] text-white border-[#09090B] shadow-md"
                    : "bg-white text-gray-700 border-black/10 hover:border-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search breakdowns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-black/15 rounded-full px-4 py-2 text-xs font-inter focus:outline-none focus:border-brand-blue"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-3" />
          </div>
        </div>

        {/* 3-COLUMN EDITORIAL ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredArticles.map((art) => (
            <div
              key={art.slug}
              onClick={() => { setSelectedSlug(art.slug); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="bg-white border-2 border-black rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-space font-bold text-[10px] uppercase text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {art.category}
                  </span>
                  <span className="text-[10px] font-space text-gray-400">{art.readTime}</span>
                </div>

                <h3 className="font-space font-bold text-lg sm:text-xl uppercase tracking-tight text-brand-dark group-hover:text-brand-blue leading-snug">
                  {art.title}
                </h3>

                <p className="text-gray-600 text-xs font-inter leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-black/10 flex items-center justify-between text-xs font-space">
                <span className="text-gray-500 font-bold">{art.author}</span>
                <span className="text-brand-dark font-bold underline flex items-center gap-1">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// CONTACT US PAGE (/contact)
// =========================================================================
export function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "Paid Performance Ads",
    budget: "₹1,00,000 - ₹3,00,000",
    timeline: "Immediately",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="contact">
      <div className="space-y-16 text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5 text-brand-blue" />
            Inquire For Growth
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            LET'S TALK ABOUT <br />
            <span className="text-brand-blue">YOUR BRAND'S FEED.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
            Tell us what you're building. We'll show you how to engineer thumb-stopping video, high-converting React funnels, and predictable customer acquisition.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-2 border-black rounded-3xl p-8 space-y-6 shadow-sm">
              <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark">
                DIRECT AGENCY CONTACT
              </h3>

              <div className="space-y-4 text-xs font-inter text-gray-700">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-space font-bold uppercase text-brand-dark">Phone / WhatsApp</div>
                    <a href="tel:+918810356950" className="text-gray-600 hover:text-black">+91 8810356950</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-space font-bold uppercase text-brand-dark">Official Email</div>
                    <a href="mailto:hello@getintofeed.com" className="text-gray-600 hover:text-black">hello@getintofeed.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-space font-bold uppercase text-brand-dark">Creative Hub</div>
                    <p className="text-gray-600">Bengaluru • Delhi NCR • Operating Globally</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-black/10">
                <a
                  href="https://wa.me/918810356950?text=Hi%20GetIntoFeed%20team,%20I%20am%20interested%20in%20a%20growth%20sprint."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white py-3 rounded-xl font-space font-bold text-xs uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-decoration-none shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp Directly
                </a>
              </div>
            </div>

            <div className="bg-brand-lime border-2 border-black rounded-3xl p-6 text-brand-dark">
              <h4 className="font-space font-bold text-sm uppercase mb-1">15-MINUTE FAST RESPONSE</h4>
              <p className="text-xs font-inter leading-relaxed">
                During business hours (9:00 AM – 8:00 PM IST), our growth desk reviews inquiries and responds in under 15 minutes.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white border-2 border-black rounded-3xl p-8 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-brand-lime flex items-center justify-center mx-auto text-brand-dark">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark">
                  INQUIRY RECEIVED!
                </h3>
                <p className="text-gray-600 text-xs font-inter max-w-sm mx-auto">
                  A growth strategist has been assigned to your brief and will contact you at <span className="font-bold text-brand-dark">{formData.email}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-space font-bold uppercase text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      placeholder="Ashish Raghav"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-space font-bold uppercase text-gray-700 mb-1">Work Email *</label>
                    <input
                      type="email"
                      placeholder="ashish@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-space font-bold uppercase text-gray-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="+91 8810356950"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-space font-bold uppercase text-gray-700 mb-1">Company Name / Domain</label>
                    <input
                      type="text"
                      placeholder="https://yourbrand.com"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-space font-bold uppercase text-gray-700 mb-1">Service Required</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                    >
                      {servicesCatalog.map((s) => (
                        <option key={s.slug} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-space font-bold uppercase text-gray-700 mb-1">Estimated Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                    >
                      <option value="Under ₹75,000">Under ₹75,000</option>
                      <option value="₹75,000 - ₹1,50,000">₹75,000 - ₹1,50,000</option>
                      <option value="₹1,50,000 - ₹3,50,000">₹1,50,000 - ₹3,50,000</option>
                      <option value="₹3,50,000+">₹3,50,000+ (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-space font-bold uppercase text-gray-700 mb-1">Project Details</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your brand goals, target metrics, and what success looks like..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-dark text-white py-4 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-brand-blue transition-colors cursor-pointer border-none shadow-md disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Submit Project Inquiry →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// FAQS PAGE (/faqs)
// =========================================================================
export function FaqsPage({ onNavigate }) {
  const [openIdx, setOpenIdx] = useState(0);
  const [selectedCat, setSelectedCat] = useState("All");

  const categories = ["All", "General", "Services", "Pricing", "Process", "Payments"];

  const filtered = selectedCat === "All"
    ? faqsCatalog
    : faqsCatalog.filter((f) => f.category === selectedCat);

  return (
    <PageLayout onNavigate={onNavigate} activeNav="faqs">
      <div className="space-y-12 text-left max-w-3xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-brand-blue" />
            Answers & Clarity
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            FREQUENTLY ASKED <span className="text-brand-blue">QUESTIONS.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
            Everything you need to know about our sprints, team collaboration, pricing tiers, and execution timelines.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCat(c)}
              className={`px-3.5 py-1.5 rounded-full font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCat === c
                  ? "bg-brand-dark text-white border-black"
                  : "bg-white text-gray-700 border-black/10 hover:border-black"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filtered.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 bg-transparent border-none cursor-pointer"
                >
                  <span className="font-space font-bold text-sm uppercase text-brand-dark">
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-brand-blue" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm font-inter text-gray-600 leading-relaxed border-t border-black/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// AWARDS & RECOGNITION PAGE (/awards)
// =========================================================================
export function AwardsPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="awards">
      <div className="space-y-12 text-left max-w-4xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-brand-blue" />
            Industry Recognition
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            AWARDS & <span className="text-brand-blue">RECOGNITION.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
            While we care most about client revenue, our creative and performance work has been acknowledged by top marketing and technology institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {awardsCatalog.map((award, i) => (
            <div key={i} className="bg-white border-2 border-black rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-space font-bold text-xs uppercase text-brand-blue bg-brand-light-gray px-3 py-1 rounded-full border border-black/10">
                    {award.category}
                  </span>
                  <span className="font-space font-extrabold text-sm text-brand-dark">{award.year}</span>
                </div>
                <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark mb-2">
                  {award.title}
                </h3>
                <div className="font-space font-bold text-xs uppercase text-gray-500 mb-4">{award.org}</div>
                <p className="text-gray-600 text-xs font-inter leading-relaxed">{award.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// CAREERS PAGE (/careers)
// =========================================================================
export function CareersPage({ onNavigate }) {
  const jobs = [
    { title: "Senior Performance Media Lead", dept: "Paid Media", type: "Full-Time", location: "Bengaluru / Remote", desc: "Manage multi-crore Meta & Google accounts with deep focus on algorithmic creative testing." },
    { title: "Lead Short-Form Video Producer", dept: "Creative Studio", type: "Full-Time", location: "Delhi NCR / Hybrid", desc: "Direct 9:16 vertical video editing, kinetic typography, and frame-1 thumb stop hooks." },
    { title: "Front-End CRO Engineer (React / Tailwind)", dept: "Engineering", type: "Full-Time", location: "Remote", desc: "Build sub-second landing page funnels and interactive tools with 95+ PageSpeed scores." },
    { title: "Organic Content Strategist", dept: "Social Growth", type: "Full-Time", location: "Remote", desc: "Write viral carousels, trend hooks, and thought leadership for executive personal brands." }
  ];

  return (
    <PageLayout onNavigate={onNavigate} activeNav="careers">
      <div className="space-y-16 text-left max-w-4xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5 text-brand-blue" />
            Join The Squad
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            WORK WITH US. <br />
            <span className="text-brand-blue">ZERO CORPORATE POLITICS.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
            We are looking for obsessed specialists who love high-stakes creative problem solving, rapid sprint iterations, and measurable client results.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark mb-4">
            OPEN POSITIONS ({jobs.length})
          </h3>
          {jobs.map((job, idx) => (
            <div key={idx} className="bg-white border-2 border-black rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-space font-bold uppercase text-brand-blue mb-1">
                  <span>{job.dept}</span> • <span>{job.type}</span> • <span>{job.location}</span>
                </div>
                <h4 className="font-space font-bold text-lg uppercase text-brand-dark mb-2">{job.title}</h4>
                <p className="text-gray-600 text-xs font-inter max-w-xl">{job.desc}</p>
              </div>
              <a
                href={`mailto:careers@getintofeed.com?subject=Application for ${encodeURIComponent(job.title)}`}
                className="bg-brand-dark text-white px-5 py-2.5 rounded-lg font-space font-bold uppercase text-xs text-center shrink-0 hover:bg-brand-blue transition-colors text-decoration-none"
              >
                Apply Now →
              </a>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// SITEMAP PAGE (/sitemap)
// =========================================================================
export function SitemapPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate} activeNav="sitemap">
      <div className="space-y-12 text-left max-w-4xl mx-auto">
        <div>
          <h1 className="font-space font-extrabold text-4xl uppercase tracking-tighter text-brand-dark mb-4">
            GETINTOFEED SITEMAP.
          </h1>
          <p className="text-gray-600 text-sm font-inter">
            Comprehensive directory of all publicly accessible pages and agency resources.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-3">
            <h4 className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue">COMPANY</h4>
            <ul className="space-y-2 text-xs font-inter text-gray-700">
              <li><button type="button" onClick={() => onNavigate("/")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Homepage</button></li>
              <li><button type="button" onClick={() => onNavigate("/about")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">About Us & Vision</button></li>
              <li><button type="button" onClick={() => onNavigate("/reviews")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Reviews & Testimonials</button></li>
              <li><button type="button" onClick={() => onNavigate("/awards")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Awards & Recognition</button></li>
              <li><button type="button" onClick={() => onNavigate("/careers")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Careers</button></li>
            </ul>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-3">
            <h4 className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue">SERVICES</h4>
            <ul className="space-y-2 text-xs font-inter text-gray-700">
              <li><button type="button" onClick={() => onNavigate("/services")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">All Services Hub</button></li>
              {servicesCatalog.map((s) => (
                <li key={s.slug}>
                  <button type="button" onClick={() => onNavigate(`/services/${s.slug}`)} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-3">
            <h4 className="font-space font-bold text-xs uppercase tracking-widest text-brand-blue">WORK & INSIGHTS</h4>
            <ul className="space-y-2 text-xs font-inter text-gray-700">
              <li><button type="button" onClick={() => onNavigate("/work")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Case Studies Portfolio</button></li>
              <li><button type="button" onClick={() => onNavigate("/blog")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Feed Notes / Blog Hub</button></li>
              <li><button type="button" onClick={() => onNavigate("/pricing")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Sprint Pricing & Retainers</button></li>
              <li><button type="button" onClick={() => onNavigate("/faqs")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Agency FAQs</button></li>
              <li><button type="button" onClick={() => onNavigate("/contact")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Start a Project Consultation</button></li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// COOKIE POLICY PAGE (/cookie-policy)
// =========================================================================
export function CookiePolicyPage({ onNavigate }) {
  return <LegalPage type="cookies" onNavigate={onNavigate} />;
}

// =========================================================================
// COMPREHENSIVE ENTERPRISE LEGAL HUB (PRIVACY, TERMS, REFUND, DISCLAIMER, NDA, COOKIES)
// =========================================================================
export function LegalPage({ type = "privacy", onNavigate }) {
  const [activeTab, setActiveTab] = useState(type);

  const tabs = [
    { id: "privacy", label: "Privacy Policy", path: "/privacy" },
    { id: "terms", label: "Terms of Service", path: "/terms" },
    { id: "refund", label: "Refund & Cancellation", path: "/refund-policy" },
    { id: "disclaimer", label: "Performance Disclaimer", path: "/disclaimer" },
    { id: "nda", label: "Mutual NDA & IP Protocol", path: "/nda" },
    { id: "cookies", label: "Cookie Policy", path: "/cookie-policy" }
  ];

  return (
    <PageLayout onNavigate={onNavigate}>
      <div className="space-y-10 text-left max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-xs uppercase border border-black">
            <Shield className="w-3.5 h-3.5" /> Compliance, Commercial & Privacy Protocol
          </div>
          <h1 className="font-space font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-brand-dark">
            LEGAL & COMMERCIAL TERMS.
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm font-inter">
            Last Updated: January 2026 • Official Legal Repository for GetIntoFeed Creative Studio
          </p>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-black/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setActiveTab(tab.id); onNavigate(tab.path); }}
              className={`px-4 py-2 rounded-full font-space font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? "bg-[#09090B] text-white border-[#09090B] shadow-md"
                  : "bg-white text-gray-700 border-black/10 hover:border-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DOCUMENT CONTAINER */}
        <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 font-inter text-xs sm:text-sm text-gray-800 leading-relaxed">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <h2 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark">
                PRIVACY POLICY & DATA PROTECTION PROTOCOL
              </h2>
              <p>
                GetIntoFeed ("we", "our", or "the Agency") is dedicated to safeguarding the privacy, confidentiality, and integrity of personal and enterprise information entrusted to us by clients, prospective brand partners, and website visitors.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">1. Data We Collect</h3>
              <p>When you interact with our website, request a growth audit, or submit a sprint inquiry, we collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Identity & Contact Data:</strong> Full name, professional work email address, telephone/WhatsApp contact number (+91), and company/brand name.</li>
                <li><strong>Commercial Specifications:</strong> Selected service tier, estimated monthly ad spend budget, project timelines, and strategic pain points.</li>
                <li><strong>Technical & Usage Signals:</strong> IP address, device fingerprints, browser telemetry, UTM campaign tracking parameters, and aggregate session recordings via Google Analytics 4 and Microsoft Clarity.</li>
              </ul>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">2. Purpose & Legal Basis of Processing</h3>
              <p>We process your information exclusively for legitimate commercial purposes under India’s Digital Personal Data Protection Act (DPDP Act 2023) and global GDPR standards:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To evaluate your brand requirements and deliver customized growth audit dossiers.</li>
                <li>To establish direct contact regarding strategic marketing sprints via Phone, WhatsApp (+91 8810356950), or Email (hello@getintofeed.com).</li>
                <li>To prevent algorithmic click fraud and ensure high-integrity server-side attribution via Meta Conversions API (CAPI).</li>
              </ul>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">3. Non-Disclosure & Zero-Monetization Pledge</h3>
              <p>
                We do not sell, rent, lease, or monetize your company data, customer contacts, or financial figures to any third-party data brokers. Data shared with trusted cloud infrastructure partners (e.g., Hostinger Cloud, Google Cloud BigQuery, Vercel) is encrypted and processed under strict confidentiality agreements.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">4. Grievance Redressal Officer</h3>
              <p>
                For data access, correction, or deletion requests, please contact our Compliance Officer:<br />
                <strong>Email:</strong> hello@getintofeed.com<br />
                <strong>Telephone / WhatsApp:</strong> +91 8810356950
              </p>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === "terms" && (
            <div className="space-y-6">
              <h2 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark">
                COMMERCIAL TERMS OF SERVICE & SPRINT AGREEMENT
              </h2>
              <p>
                By contracting GetIntoFeed or utilizing our digital assets, you agree to these binding commercial terms governing all creative sprints, media execution, and software consulting.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">1. Sprint Scope & Execution Cadence</h3>
              <p>
                All services are executed in rapid 7-day to 14-day production sprints. Specific deliverables (Figma design files, 4K video cuts, Next.js codebases, and Meta ad setups) are detailed in the accepted proposal and sprint specification sheet.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">2. 100% Intellectual Property & Asset Transfer</h3>
              <p>
                Upon receipt of full invoice payment, all bespoke brand identities, creative copy, Figma components, video edits, and custom software code become the <strong>100% exclusive intellectual property of the client</strong>. GetIntoFeed retains only the limited right to feature non-confidential deliverables in our portfolio and case studies unless governed by a customized private NDA.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">3. Paid Ad Spend & Account Ownership</h3>
              <p>
                Clients maintain direct billing relationships with third-party ad networks (Meta Business Manager, Google Ads, YouTube). Ad spend is paid directly by the client to the ad network. Agency service retainers cover strategic media buying, creative production, and optimization, not the ad network budget itself.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">4. Governing Law & Dispute Resolution</h3>
              <p>
                These terms are governed by the laws of India. Any unresolved disputes arising under this agreement shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
              </p>
            </div>
          )}

          {/* TAB 3: REFUND & CANCELLATION */}
          {activeTab === "refund" && (
            <div className="space-y-6">
              <h2 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark">
                REFUND & CANCELLATION POLICY
              </h2>
              <p>
                Because GetIntoFeed deploys senior strategists, creative directors, and video editors immediately upon project kick-off, our refund framework reflects dedicated human capital allocation.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">1. Sprint Kick-Off & Deposit Terms</h3>
              <p>
                Sprint initial deposits cover discovery, account auditing, and initial creative ideation. Once a sprint has officially commenced and strategist hours have been deployed (Days 1–2), initial deposits are non-refundable.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">2. Monthly Retainer Cancellations</h3>
              <p>
                For recurring monthly retainers (e.g. ₹14,999, ₹29,999, ₹44,999/mo), clients may cancel or pause their engagement with a <strong>15-day written notice</strong> prior to the next billing cycle. No further recurring charges will apply following the notice period.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">3. Asset Handover Upon Termination</h3>
              <p>
                In the event of cancellation, all completed creative assets, source files, and ad copies produced up to the termination date will be packaged and delivered to the client in full.
              </p>
            </div>
          )}

          {/* TAB 4: PERFORMANCE DISCLAIMER */}
          {activeTab === "disclaimer" && (
            <div className="space-y-6">
              <h2 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark">
                PERFORMANCE & COMMERCIAL RESULTS DISCLAIMER
              </h2>
              <p>
                GetIntoFeed takes immense pride in our documented client track record (e.g. 3.8x–6.4x average ROAS, ₹42Cr+ pipeline generated, -52% CAC reduction). However, transparency is fundamental to our operating philosophy.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">1. Historical Case Studies</h3>
              <p>
                Any revenue figures, ROAS benchmarks, or lead growth metrics cited on this website represent verified past results achieved for specific clients under specific market conditions, ad spend levels, and product economics.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">2. No Guarantee of Uniform Projections</h3>
              <p>
                Marketing outcomes depend on variables beyond agency control, including client product-market fit, pricing elasticity, fulfillment velocity, algorithm updates by Meta/Google, and consumer macroeconomic conditions. We guarantee senior execution excellence and relentless optimization, but no ethical agency can guarantee exact revenue projections.
              </p>
            </div>
          )}

          {/* TAB 5: MUTUAL NDA & CONFIDENTIALITY */}
          {activeTab === "nda" && (
            <div className="space-y-6">
              <h2 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark">
                MUTUAL NON-DISCLOSURE & CONFIDENTIALITY PROTOCOL
              </h2>
              <p>
                We understand that sharing ad accounts, revenue metrics, customer acquisition economics, and unreleased product roadmaps requires absolute trust.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">1. Definition of Confidential Information</h3>
              <p>
                Confidential Information includes all non-public customer lists, ad creative angles, ROAS data, financial statements, trade secrets, software codebases, and brand strategy briefs exchanged during the engagement.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">2. Agency Obligation</h3>
              <p>
                GetIntoFeed covenants to maintain all client proprietary information in strict confidence, restricting access solely to the senior squad assigned to your project. We execute formal standalone bilateral NDAs for enterprise partnerships upon request.
              </p>
            </div>
          )}

          {/* TAB 6: COOKIE POLICY */}
          {activeTab === "cookies" && (
            <div className="space-y-6">
              <h2 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark">
                COOKIE & TRACKING TECHNOLOGY POLICY
              </h2>
              <p>
                Our website utilizes modern browser cookies and server-side conversion measurement to maintain blazing-fast load times and measure site performance.
              </p>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">1. Cookie Taxonomy</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Strictly Necessary:</strong> Required for secure session persistence, CSRF protection, and responsive rendering.</li>
                <li><strong>Analytics Signals:</strong> Google Analytics 4 (G-LHVZY6EFW1) and Google Tag Manager (GTM-PHJF6JHM) collect anonymized telemetry on page depth and user interactions.</li>
                <li><strong>Attribution Tokens:</strong> Meta CAPI event deduplication tokens preventing repetitive ad deliveries.</li>
              </ul>

              <h3 className="font-space font-bold text-base uppercase text-brand-dark">2. Reset Your Preferences</h3>
              <p>You can reset or reconfigure your stored cookie choices at any time:</p>
              <button
                type="button"
                onClick={() => { localStorage.removeItem("gif_cookie_consent"); window.location.reload(); }}
                className="bg-[#09090B] text-brand-lime px-5 py-2.5 rounded-xl font-space font-bold text-xs uppercase cursor-pointer border-none shadow-sm"
              >
                Reset Stored Cookie Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// NOT FOUND PAGE (/404)
// =========================================================================
export function NotFoundPage({ onNavigate }) {
  return (
    <PageLayout onNavigate={onNavigate}>
      <div className="text-center py-16 max-w-md mx-auto space-y-6">
        <div className="font-space font-extrabold text-7xl md:text-8xl text-brand-dark">
          404
        </div>
        <h2 className="font-space font-bold text-2xl uppercase text-brand-dark">
          YOU FELL OUT OF THE FEED.
        </h2>
        <p className="text-gray-600 text-xs md:text-sm font-inter">
          The link you followed may be broken or the page has moved. Let's get you back to high-converting content.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="bg-brand-lime text-brand-dark px-6 py-3 rounded-lg font-space font-bold uppercase text-xs cursor-pointer border-none"
          >
            ← Back to Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/services")}
            className="bg-brand-dark text-white px-6 py-3 rounded-lg font-space font-bold uppercase text-xs cursor-pointer border-none"
          >
            Explore Services
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

// Audit Tool Page export
export function AuditToolPage({ onNavigate }) {
  return <ServiceDetailPage slug="performance-marketing" onNavigate={onNavigate} />;
}

export const ClientsTestimonialsPage = ReviewsPage;


// =========================================================================
// UNIVERSAL WHATSAPP FLOATING QUICK CHAT BUTTON
// =========================================================================
export function WhatsAppFloatingButton() {
  const handleWhatsAppClick = () => {
    try {
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "whatsapp_click",
          button_name: "Floating WhatsApp Quick Chat",
          page_path: window.location.pathname,
          timestamp: new Date().toISOString()
        });
        if (typeof window.gtag === "function") {
          window.gtag("event", "whatsapp_click", {
            event_category: "Contact & Lead Acquisition",
            event_label: "Floating Quick Chat Button",
            page_path: window.location.pathname
          });
        }
      }
    } catch {}
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group" id="gtm-whatsapp-float-container">
      {/* Tooltip on desktop */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#09090B] text-white text-[11px] font-space font-bold uppercase tracking-wider py-1.5 px-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 hidden sm:block">
        Chat with Growth Desk
      </span>

      {/* Pulse beacon ring */}
      <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />

      {/* Action Button */}
      <a
        id="gtm-floating-whatsapp-btn"
        data-gtm-name="whatsapp_floating"
        onClick={handleWhatsAppClick}
        href="https://wa.me/918810356950?text=Hi%20GetIntoFeed%2C%20I%20want%20to%20discuss%20a%20marketing%20sprint"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with GetIntoFeed on WhatsApp"
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl border-2 border-black/20 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer text-decoration-none"
      >
        <svg
          className="w-7 h-7 fill-white drop-shadow-sm"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.04-1.07l-.29-.17-3.01.79.8-2.93-.19-.3A8.2 8.2 0 0 1 3.8 11.9c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.13-.17.25-.65.8-.79.97-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.48-1.38-1.73-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.47c-.16 0-.42.06-.64.3-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.13.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.3z" />
        </svg>
      </a>
    </div>
  );
}
