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
// LIGHT-BASE MASTER PAGE LAYOUT (GETINTOFEED BRANDED)
// =========================================================================
export function PageLayout({ children, onNavigate, activeNav = "" }) {
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(() => !localStorage.getItem("gif_cookie_consent"));
  const [cookiePrefsOpen, setCookiePrefsOpen] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({ necessary: true, analytics: true, marketing: true, preferences: true });

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
        body: JSON.stringify({ ...formData, source: "Subpage Quick Consultation" })
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setLeadModalOpen(false);
        setFormData({ name: "", email: "", phone: "", website: "", service: "General Growth Inquiry", message: "" });
      }, 2000);
    } catch (err) {
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setLeadModalOpen(false); }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptCookies = (all = true) => {
    localStorage.setItem("gif_cookie_consent", all ? "all" : JSON.stringify(cookiePrefs));
    setCookieBannerVisible(false);
    setCookiePrefsOpen(false);
  };

  return (
    <div className="antialiased selection:bg-brand-lime selection:text-brand-dark bg-[#FAFAFA] font-inter relative min-h-screen text-[#09090B] flex flex-col justify-between">
      {/* Top Banner */}
      {showTopBar && (
        <div className="bg-brand-lime text-brand-dark text-[10px] sm:text-xs py-2 px-4 flex items-center justify-between font-bold font-space uppercase tracking-wider z-50 relative w-full shadow-sm border-b border-black/10">
          <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1 justify-center">
            <Zap className="w-3.5 h-3.5 fill-brand-dark shrink-0" />
            <span className="line-clamp-1 sm:line-clamp-none text-center">
              NOW TAKING ON 3 NEW BRANDS THIS MONTH — LET'S BUILD SOMETHING PEOPLE CAN'T SCROLL PAST.
            </span>
            <button
              type="button"
              onClick={() => onNavigate("/contact")}
              className="inline-flex bg-brand-dark text-white px-2.5 py-1 rounded text-[9px] sm:text-[10px] ml-2 hover:bg-black shrink-0 items-center gap-1 transition-colors cursor-pointer border-none font-bold font-space"
            >
              LET'S TALK <ArrowRight className="w-3 h-3" />
            </button>
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

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/10 transition-all">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="flex items-center gap-1.5 text-left bg-transparent border-none cursor-pointer p-0 group"
          >
            <span className="font-space font-extrabold text-xl md:text-2xl tracking-tighter uppercase text-brand-dark group-hover:text-brand-blue transition-colors">
              GETINTOFEED
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-lime border border-brand-dark shrink-0"></span>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => onNavigate("/services")}
                className="font-space font-bold text-xs uppercase tracking-wider text-brand-dark hover:text-brand-blue transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none py-2"
              >
                SERVICES <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white border-2 border-black rounded-xl p-3 shadow-2xl z-50 grid grid-cols-1 gap-1">
                  {servicesCatalog.map((s) => (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => { setServicesDropdownOpen(false); onNavigate(`/services/${s.slug}`); }}
                      className="text-left p-2.5 rounded-lg hover:bg-brand-light-gray transition-all flex items-start gap-3 group/item border-none bg-transparent cursor-pointer w-full"
                    >
                      <s.icon className="w-4 h-4 text-brand-dark group-hover/item:text-brand-blue shrink-0 mt-0.5" />
                      <div>
                        <div className="font-space font-bold text-xs uppercase text-brand-dark group-hover/item:text-brand-blue">
                          {s.title}
                        </div>
                        <div className="text-[11px] text-gray-500 line-clamp-1 font-inter">
                          {s.shortDesc}
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="pt-2 border-t border-black/10 mt-1">
                    <button
                      type="button"
                      onClick={() => { setServicesDropdownOpen(false); onNavigate("/services"); }}
                      className="w-full text-center py-2 bg-brand-lime text-brand-dark font-space font-bold text-[11px] uppercase rounded-md hover:bg-[#E2FF4D] transition-colors border-none cursor-pointer"
                    >
                      Explore All 8 Services →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate("/work")}
              className="font-space font-bold text-xs uppercase tracking-wider text-brand-dark hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none"
            >
              WORK
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/reviews")}
              className="font-space font-bold text-xs uppercase tracking-wider text-brand-dark hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none"
            >
              REVIEWS
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/about")}
              className="font-space font-bold text-xs uppercase tracking-wider text-brand-dark hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none"
            >
              ABOUT US
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/pricing")}
              className="font-space font-bold text-xs uppercase tracking-wider text-brand-dark hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none"
            >
              PRICING
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/blog")}
              className="font-space font-bold text-xs uppercase tracking-wider text-brand-dark hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none"
            >
              FEED NOTES
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="font-space font-bold text-xs text-gray-600 hover:text-brand-dark transition-colors flex items-center gap-1.5 text-decoration-none"
            >
              <Phone className="w-3.5 h-3.5 text-brand-blue" />
              <span>+91 98765 43210</span>
            </a>

            <button
              type="button"
              onClick={() => setLeadModalOpen(true)}
              className="bg-brand-dark text-white px-5 py-2.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-brand-blue hover:text-white transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer border-none"
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
          <div className="lg:hidden bg-white border-b-2 border-black px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/services"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-brand-dark border-b border-black/10 bg-transparent"
            >
              SERVICES
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/work"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-brand-dark border-b border-black/10 bg-transparent"
            >
              WORK
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/reviews"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-brand-dark border-b border-black/10 bg-transparent"
            >
              REVIEWS
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/about"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-brand-dark border-b border-black/10 bg-transparent"
            >
              ABOUT US
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/pricing"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-brand-dark border-b border-black/10 bg-transparent"
            >
              PRICING
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/blog"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-brand-dark border-b border-black/10 bg-transparent"
            >
              FEED NOTES / BLOG
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate("/audit"); }}
              className="block w-full text-left font-space font-bold text-sm uppercase py-2 text-brand-dark border-b border-black/10 bg-transparent"
            >
              FREE 360° AUDIT
            </button>

            <div className="pt-4 flex flex-col gap-3">
              <a
                href="tel:+919876543210"
                className="text-center py-2.5 border border-black/20 rounded-lg font-space font-bold text-xs uppercase text-brand-dark text-decoration-none"
              >
                Call: +91 98765 43210
              </a>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); setLeadModalOpen(true); }}
                className="w-full bg-brand-dark text-white py-3 rounded-lg font-space font-bold text-xs uppercase hover:bg-brand-blue transition-colors cursor-pointer border-none"
              >
                Start a Project →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Slot */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-12 py-8 md:py-16">
        {children}
      </main>

      {/* Global Branded Light Footer */}
      <footer className="bg-white border-t border-black/10 pt-16 pb-12 px-6 md:px-12 w-full mt-auto">
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
                <li><button type="button" onClick={() => onNavigate("/audit")} className="hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Free 360° Audit</button></li>
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

      {/* Quick Project Lead Modal */}
      {leadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border-2 border-black rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setLeadModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-brand-lime flex items-center justify-center mx-auto mb-4 text-brand-dark">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark mb-2">
                  INQUIRY RECEIVED!
                </h3>
                <p className="text-gray-600 text-xs font-inter">
                  Our growth strategist will contact you within 15 minutes.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-lime border border-black"></span>
                  <span className="font-space font-bold text-xs uppercase tracking-wider text-brand-blue">Growth Sprint Consultation</span>
                </div>
                <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark mb-4">
                  LET'S BUILD YOUR SPRINT.
                </h3>
                <form onSubmit={handleLeadSubmit} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        placeholder="rahul@brand.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">Company / Website</label>
                    <input
                      type="text"
                      placeholder="https://yourbrand.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-lime text-brand-dark py-3.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-md mt-2 disabled:opacity-50"
                  >
                    {submitting ? "Transmitting..." : "Schedule Sprint Call →"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cookie Consent Banner */}
      {cookieBannerVisible && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-white border-2 border-black rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <div>
              <h5 className="font-space font-bold text-xs uppercase tracking-wider text-brand-dark mb-1">
                COOKIE & PRIVACY PREFERENCES
              </h5>
              <p className="text-gray-600 text-xs font-inter mb-4 leading-relaxed">
                We use necessary cookies for site function and analytics cookies to optimize user experience. Review our <button type="button" onClick={() => onNavigate("/cookie-policy")} className="underline text-brand-blue bg-transparent border-none p-0 cursor-pointer">Cookie Policy</button>.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAcceptCookies(true)}
                  className="bg-brand-lime text-brand-dark px-4 py-2 rounded-lg font-space font-bold text-xs uppercase hover:bg-[#E2FF4D] cursor-pointer border-none"
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
      )}

      {/* Cookie Preferences Modal */}
      {cookiePrefsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 mb-4">
              <h4 className="font-space font-bold text-sm uppercase text-brand-dark">Customize Cookie Settings</h4>
              <button type="button" onClick={() => setCookiePrefsOpen(false)} className="text-gray-500 bg-transparent border-none cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs font-inter text-gray-700 mb-6">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-brand-dark">Strictly Necessary</div>
                  <div className="text-[11px] text-gray-500">Core navigation, security, and sessions.</div>
                </div>
                <input type="checkbox" checked disabled className="cursor-not-allowed" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-brand-dark">Analytics & Performance</div>
                  <div className="text-[11px] text-gray-500">GA4 event tracking and heatmaps.</div>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.analytics}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, analytics: e.target.checked })}
                />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-brand-dark">Marketing & Retargeting</div>
                  <div className="text-[11px] text-gray-500">Meta CAPI and Google Ads conversion pixels.</div>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.marketing}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, marketing: e.target.checked })}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleAcceptCookies(false)}
              className="w-full bg-brand-dark text-white py-2.5 rounded-lg font-space font-bold text-xs uppercase hover:bg-brand-blue transition-colors cursor-pointer border-none"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
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
  return (
    <PageLayout onNavigate={onNavigate} activeNav="services">
      <div className="space-y-16">
        <div className="text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-brand-blue" />
            End-To-End Growth Architecture
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            OUR CAPABILITIES. <br />
            <span className="text-brand-blue">BUILT FOR REVENUE.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
            Eight synchronized disciplines working under one roof. We combine thumb-stopping video creative with rigorous paid performance media and friction-free web development.
          </p>
        </div>

        {/* 8 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesCatalog.map((svc) => (
            <div
              key={svc.slug}
              className="bg-white border-2 border-black rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-lime flex items-center justify-center text-brand-dark group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <svc.icon className="w-6 h-6" />
                  </div>
                  <span className="font-space font-bold text-xs uppercase text-gray-500 bg-brand-light-gray px-3 py-1 rounded-full border border-black/10">
                    {svc.category}
                  </span>
                </div>

                <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark group-hover:text-brand-blue transition-colors mb-3">
                  {svc.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm font-inter leading-relaxed mb-6">
                  {svc.shortDesc}
                </p>

                <div className="space-y-2 pt-4 border-t border-black/10 mb-8">
                  <div className="font-space font-bold text-[11px] uppercase text-gray-500 mb-2">Key Deliverables:</div>
                  {svc.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-inter text-gray-700">
                      <Check className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                <span className="font-space font-bold text-xs uppercase text-brand-dark">
                  {svc.pricingTier}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(`/services/${svc.slug}`)}
                  className="bg-brand-dark text-white px-5 py-2.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider group-hover:bg-brand-blue transition-colors cursor-pointer border-none flex items-center gap-1.5"
                >
                  View Blueprint <ArrowRight className="w-3.5 h-3.5" />
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
// SERVICE DETAIL PAGE (/services/:slug) — 2-COLUMN DESKTOP STICKY FORM
// =========================================================================
export function ServiceDetailPage({ slug, onNavigate }) {
  const service = servicesCatalog.find((s) => s.slug === slug) || servicesCatalog[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: service.title,
    budget: "₹1,00,000 - ₹3,00,000",
    timeline: "Immediately (Within 7 Days)",
    details: ""
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
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service_required: service.title,
          budget_tier: formData.budget,
          project_timeline: formData.timeline,
          message: formData.details
        })
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true); // Graceful fallback
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="services">
      <div className="space-y-12">
        {/* Breadcrumb / Back Button */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("/services")}
            className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase text-gray-500 hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Services
          </button>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Deep Content Dossier */}
          <div className="lg:col-span-7 space-y-12 text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/30 border border-brand-lime/50 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
                <service.icon className="w-3.5 h-3.5 text-brand-blue" />
                {service.category}
              </div>
              <h1 className="font-space font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
                {service.title}
              </h1>
              <p className="text-gray-700 text-sm md:text-base font-inter leading-relaxed">
                {service.overview}
              </p>
            </div>

            {/* WHAT WE DO */}
            <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-sm">
              <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-blue" />
                WHAT WE DO & EXECUTE
              </h3>
              <div className="space-y-3.5">
                {service.whatWeDo.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs md:text-sm font-inter text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-brand-lime flex items-center justify-center shrink-0 mt-0.5 text-brand-dark font-space font-bold text-[10px]">
                      ✓
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-STEP SPRINT EXECUTION ROADMAP */}
            <div>
              <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark mb-6">
                4-STEP SPRINT ROADMAP.
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.strategySteps.map((st, idx) => (
                  <div key={idx} className="bg-white border-2 border-black rounded-2xl p-6">
                    <div className="font-space font-extrabold text-2xl text-brand-blue mb-1">
                      {st.step}
                    </div>
                    <div className="font-space font-bold text-sm uppercase text-brand-dark mb-2">
                      {st.name}
                    </div>
                    <p className="text-gray-600 text-xs font-inter leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* DELIVERABLES CHECKLIST */}
            <div className="bg-brand-light-gray border border-black/10 rounded-3xl p-8">
              <h3 className="font-space font-bold text-lg uppercase tracking-tight text-brand-dark mb-4">
                INCLUDED ASSETS & DELIVERABLES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.deliverables.map((del, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-black/10 text-xs font-inter text-gray-800">
                    <Check className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SERVICE FAQS */}
            <div className="space-y-4">
              <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark mb-4">
                FREQUENTLY ASKED QUESTIONS
              </h3>
              {service.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border-2 border-black rounded-2xl p-5">
                  <div className="font-space font-bold text-xs uppercase text-brand-dark mb-1.5">
                    {faq.q}
                  </div>
                  <p className="text-gray-600 text-xs font-inter leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY "START YOUR PROJECT" FORM */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
            <div className="bg-white border-2 border-black rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase">
                  <Zap className="w-3 h-3" /> Ready to Scale
                </div>
                <span className="font-space font-bold text-xs text-gray-500">Fast 15-Min Response</span>
              </div>

              <h3 className="font-space font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-brand-dark leading-none mb-2">
                START YOUR PROJECT.
              </h3>
              <p className="text-gray-600 text-xs font-inter mb-6 leading-relaxed">
                Connect directly with a senior strategist for <span className="font-bold text-brand-blue">{service.title}</span>.
              </p>

              {submitted ? (
                <div className="bg-brand-light-gray rounded-2xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-lime flex items-center justify-center mx-auto text-brand-dark">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="font-space font-bold text-xl uppercase text-brand-dark">
                    INQUIRY DISPATCHED!
                  </div>
                  <p className="text-xs text-gray-600 font-inter">
                    Our performance director is reviewing your requirements and will reach out to <span className="font-bold text-brand-dark">{formData.email}</span> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-space font-bold uppercase underline text-brand-blue bg-transparent border-none cursor-pointer"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Ashish Raghav"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        placeholder="ashish@brand.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                      Company Name / URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp or https://..."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                        Estimated Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                      >
                        <option value="Under ₹75,000">Under ₹75,000</option>
                        <option value="₹75,000 - ₹1,50,000">₹75,000 - ₹1,50,000</option>
                        <option value="₹1,50,000 - ₹3,50,000">₹1,50,000 - ₹3,50,000</option>
                        <option value="₹3,50,000+ (Enterprise)">₹3,50,000+ (Enterprise)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                        Project Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                      >
                        <option value="Immediately (Within 7 Days)">Immediately (Within 7 Days)</option>
                        <option value="Within 2-4 Weeks">Within 2-4 Weeks</option>
                        <option value="Exploring Options">Exploring Options</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                      Project Details / Core Pain Points
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us what you are building and what bottlenecks you are facing..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-lime text-brand-dark py-3.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-md disabled:opacity-50"
                  >
                    {submitting ? "Booking Sprint..." : "Book Strategy Consultation →"}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-inter pt-1">
                    <Lock className="w-3 h-3 text-gray-400" />
                    <span>Non-Disclosure & Data Confidentiality Guaranteed</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
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

  const filtered = filter === "All"
    ? caseStudiesCatalog
    : caseStudiesCatalog.filter((c) => c.category === filter);

  return (
    <PageLayout onNavigate={onNavigate} activeNav="work">
      <div className="space-y-16 text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-brand-blue" />
            Proof In The Feed
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            SELECTED CASE STUDIES. <br />
            <span className="text-brand-blue">REAL COMMERCIAL ROAS.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
            Explore how we partnered with ambitious brands to transform their digital presence, eliminate ad waste, and generate measurable revenue.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                filter === cat
                  ? "bg-brand-dark text-white border-black"
                  : "bg-white text-gray-700 border-black/10 hover:border-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Case Studies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((cs) => (
            <div
              key={cs.slug}
              className="bg-white border-2 border-black rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    src={cs.heroImage}
                    alt={cs.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-brand-lime text-brand-dark font-space font-bold text-[10px] uppercase px-2.5 py-1 rounded-full border border-black">
                    {cs.metric} {cs.result}
                  </div>
                </div>

                <div className="p-6">
                  <div className="font-space font-bold text-xs uppercase text-brand-blue mb-1">
                    {cs.brand} • {cs.category}
                  </div>
                  <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark mb-3">
                    {cs.title}
                  </h3>
                  <p className="text-gray-600 text-xs font-inter line-clamp-3 mb-4">
                    {cs.challenge}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => onNavigate(`/work/${cs.slug}`)}
                  className="w-full bg-brand-light-gray hover:bg-brand-lime text-brand-dark py-2.5 rounded-xl font-space font-bold text-xs uppercase transition-colors cursor-pointer border border-black/10"
                >
                  Read Full Teardown →
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
// CASE STUDY DETAIL PAGE (/work/:slug)
// =========================================================================
export function CaseStudyDetailPage({ slug, onNavigate }) {
  const cs = caseStudiesCatalog.find((c) => c.slug === slug) || caseStudiesCatalog[0];

  return (
    <PageLayout onNavigate={onNavigate} activeNav="work">
      <div className="space-y-12 text-left max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => onNavigate("/work")}
          className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase text-gray-500 hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Case Studies
        </button>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4 border border-black">
            {cs.brand} • {cs.category}
          </div>
          <h1 className="font-space font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            {cs.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-8">
            {cs.services.map((s, idx) => (
              <span key={idx} className="bg-brand-light-gray border border-black/10 text-gray-700 px-3 py-1 rounded-full text-xs font-space font-bold uppercase">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden border-2 border-black aspect-video w-full">
          <img src={cs.heroImage} alt={cs.title} className="w-full h-full object-cover" />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cs.results.map((r, idx) => (
            <div key={idx} className="bg-white border-2 border-black rounded-2xl p-6 text-center">
              <div className="font-space font-extrabold text-3xl md:text-4xl text-brand-blue mb-1">
                {r.val}
              </div>
              <div className="font-space font-bold text-xs uppercase text-gray-600">
                {r.label}
              </div>
            </div>
          ))}
        </div>

        {/* Challenge & Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-black rounded-2xl p-8">
            <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark mb-3">
              THE COMMERCIAL CHALLENGE
            </h3>
            <p className="text-gray-600 text-sm font-inter leading-relaxed">
              {cs.challenge}
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-8">
            <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark mb-3">
              OUR STRATEGIC EXECUTION
            </h3>
            <p className="text-gray-600 text-sm font-inter leading-relaxed">
              {cs.strategy}
            </p>
          </div>
        </div>

        {/* Client Testimonial */}
        {cs.testimonial && (
          <div className="bg-brand-lime border-2 border-black rounded-3xl p-8 md:p-10 text-brand-dark">
            <Quote className="w-8 h-8 mb-4 opacity-70" />
            <p className="font-space font-bold text-lg md:text-xl leading-relaxed mb-4">
              "{cs.testimonial.quote}"
            </p>
            <div className="font-space font-bold text-xs uppercase">
              {cs.testimonial.author} — <span className="opacity-80">{cs.testimonial.role}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="pt-8 text-center">
          <button
            type="button"
            onClick={() => onNavigate("/contact")}
            className="bg-brand-dark text-white px-8 py-4 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-brand-blue transition-colors cursor-pointer border-none"
          >
            Replicate These Results For Your Brand →
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// REVIEWS / TESTIMONIALS PAGE (/reviews)
// =========================================================================
export function ReviewsPage({ onNavigate }) {
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
          {reviewsCatalog.map((rev, idx) => (
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
  const tiers = [
    {
      name: "Starter Growth Sprint",
      price: "₹75,000",
      period: "/ month",
      desc: "For fast-moving brands looking to test a single channel with elite creative direction.",
      features: [
        "1 Core Growth Channel (Meta Ads OR Short-Form Video)",
        "8 Custom thumb-stopping video/carousel creative assets",
        "Weekly creative sprint reviews and angle testing",
        "Dedicated Slack channel with senior growth lead",
        "Standard Looker Studio KPI dashboard"
      ],
      cta: "Apply For Starter Sprint",
      badge: "Focused Sprint"
    },
    {
      name: "Scale Retainer",
      price: "₹1,50,000",
      period: "/ month",
      desc: "Our flagship full-stack growth program for brands spending ₹2L - ₹15L/month on media.",
      features: [
        "Full-Stack Multi-Channel (Meta, Google, & Organic Social)",
        "20+ High-velocity video reels, UGC cuts, and ad creatives",
        "Server-side CAPI and advanced GA4 attribution tracking",
        "Landing page CRO wireframes & conversion audits",
        "Dedicated Account Director + Video Producer in your Slack",
        "Bi-weekly strategic growth calls"
      ],
      cta: "Scale With Flagship Retainer",
      badge: "Most Popular",
      popular: true
    },
    {
      name: "Enterprise Growth Partner",
      price: "₹3,50,000",
      period: "/ month",
      desc: "Complete digital dominance for funded startups and market leaders.",
      features: [
        "Total omnichannel growth (Paid, Organic, Video, SEO, Web)",
        "Unlimited creative iterations and custom production days",
        "Full React / Next.js web engineering support",
        "Executive CMO strategic advisory",
        "24/7 Priority escalation desk and dedicated squad"
      ],
      cta: "Schedule Enterprise Briefing",
      badge: "Full Dominance"
    }
  ];

  return (
    <PageLayout onNavigate={onNavigate} activeNav="pricing">
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
            No endless hourly billing or mysterious agency fees. Choose a sprint or retainer tier that fits your commercial stage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between border-2 transition-all relative ${
                tier.popular
                  ? "bg-white border-black shadow-2xl scale-[1.02] ring-2 ring-brand-blue"
                  : "bg-white border-black/20 hover:border-black shadow-sm"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-4 py-1 rounded-full font-space font-bold text-[10px] uppercase tracking-wider">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="font-space font-bold text-xl uppercase text-brand-dark mb-1">
                  {tier.name}
                </div>
                <p className="text-gray-600 text-xs font-inter mb-6 min-h-[36px]">
                  {tier.desc}
                </p>

                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-black/10">
                  <span className="font-space font-extrabold text-3xl md:text-4xl text-brand-dark">
                    {tier.price}
                  </span>
                  <span className="text-xs text-gray-500 font-space font-bold">{tier.period}</span>
                </div>

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
                onClick={() => onNavigate("/contact")}
                className={`w-full py-3.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider transition-all cursor-pointer border-none ${
                  tier.popular
                    ? "bg-brand-lime text-brand-dark hover:bg-[#E2FF4D] shadow-md"
                    : "bg-brand-dark text-white hover:bg-brand-blue"
                }`}
              >
                {tier.cta} →
              </button>
            </div>
          ))}
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
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Comments state
  const [comments, setComments] = useState([
    { name: "Siddharth Rao", comment: "The breakdown of frame 1 visual interrupts changed how we film our reels. Immediate 3x retention bump.", date: "March 3, 2026" },
    { name: "Pooja Hegde", comment: "Finally an agency talking about the economic reality of CAC instead of just pretty aesthetics.", date: "March 4, 2026" }
  ]);
  const [newComment, setNewComment] = useState({ name: "", email: "", comment: "", website: "" });
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const activeArticle = blogPostsCatalog.find((b) => b.slug === selectedSlug);

  useEffect(() => {
    if (!selectedSlug) return;
    fetch(`${API_URL}/api/blog/${selectedSlug}/engagement`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.reactions) {
          setReactions((prev) => ({ ...prev, ...data.reactions }));
        }
        if (Array.isArray(data.comments) && data.comments.length > 0) {
          setComments(
            data.comments.map((c) => ({
              name: c.name || c.author_name,
              comment: c.message || c.comment_text || c.comment,
              date: new Date(c.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            }))
          );
        }
      })
      .catch(() => null);
  }, [selectedSlug]);

  const handleReact = (type) => {
    if (reacted[type]) return;
    setReactions((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    setReacted((prev) => ({ ...prev, [type]: true }));
    if (activeArticle) {
      fetch(`${API_URL}/api/blog/${activeArticle.slug}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      }).catch(() => null);
    }
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
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Great insight on creative marketing:")}`, "_blank");
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.email || !newComment.comment) {
      alert("Please fill in your name, email, and comment.");
      return;
    }
    // In our backend workflow, this is submitted as PENDING
    if (activeArticle) {
      fetch(`${API_URL}/api/blog/${activeArticle.slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: newComment.name,
          author_email: newComment.email,
          comment_text: newComment.comment,
          website: newComment.website
        })
      }).catch(() => null);
    }
    setCommentSubmitted(true);
    setNewComment({ name: "", email: "", comment: "", website: "" });
  };

  // If a single article is opened:
  if (activeArticle) {
    return (
      <PageLayout onNavigate={onNavigate} activeNav="blog">
        <div className="space-y-10 text-left max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setSelectedSlug(null)}
            className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase text-gray-500 hover:text-brand-dark transition-colors bg-transparent border-none p-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Feed Notes
          </button>

          <div>
            <div className="flex items-center gap-3 text-xs font-space font-bold uppercase text-brand-blue mb-3">
              <span>{activeArticle.category}</span>
              <span>•</span>
              <span className="text-gray-500">{activeArticle.readTime}</span>
              <span>•</span>
              <span className="text-gray-500">{activeArticle.date}</span>
            </div>
            <h1 className="font-space font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
              {activeArticle.title}
            </h1>
            <div className="flex items-center justify-between gap-4 py-4 border-y border-black/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-dark text-white font-space font-bold flex items-center justify-center text-xs uppercase">
                  {activeArticle.author.slice(0, 2)}
                </div>
                <div>
                  <div className="font-space font-bold text-xs uppercase text-brand-dark">{activeArticle.author}</div>
                  <div className="text-[11px] text-gray-500 font-inter">{activeArticle.authorRole}</div>
                </div>
              </div>

              {/* Share Action */}
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="bg-brand-light-gray hover:bg-brand-lime text-brand-dark px-3.5 py-2 rounded-lg font-space font-bold text-xs uppercase transition-colors flex items-center gap-1.5 cursor-pointer border border-black/10"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-neutral max-w-none text-gray-800 font-inter text-sm md:text-base leading-relaxed space-y-6">
            <p className="font-bold text-base md:text-lg text-brand-dark border-l-4 border-brand-lime pl-4 italic">
              {activeArticle.excerpt}
            </p>
            <div className="whitespace-pre-line">
              {activeArticle.content}
            </div>
          </div>

          {/* ARTICLE REACTIONS SYSTEM */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 text-center space-y-3">
            <h4 className="font-space font-bold text-xs uppercase tracking-wider text-gray-500">
              DID YOU FIND THIS VALUABLE? LEAVE A REACTION
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleReact("love")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-space font-bold transition-all cursor-pointer ${
                  reacted.love ? "bg-red-50 border-red-500 text-red-600" : "bg-white border-black/20 hover:border-black"
                }`}
              >
                ❤️ <span>Love</span> <span className="text-gray-500">({reactions.love})</span>
              </button>
              <button
                type="button"
                onClick={() => handleReact("fire")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-space font-bold transition-all cursor-pointer ${
                  reacted.fire ? "bg-orange-50 border-orange-500 text-orange-600" : "bg-white border-black/20 hover:border-black"
                }`}
              >
                🔥 <span>Fire</span> <span className="text-gray-500">({reactions.fire})</span>
              </button>
              <button
                type="button"
                onClick={() => handleReact("clap")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-space font-bold transition-all cursor-pointer ${
                  reacted.clap ? "bg-yellow-50 border-yellow-500 text-yellow-700" : "bg-white border-black/20 hover:border-black"
                }`}
              >
                👏 <span>Clap</span> <span className="text-gray-500">({reactions.clap})</span>
              </button>
              <button
                type="button"
                onClick={() => handleReact("insightful")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-space font-bold transition-all cursor-pointer ${
                  reacted.insightful ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-black/20 hover:border-black"
                }`}
              >
                💡 <span>Insightful</span> <span className="text-gray-500">({reactions.insightful})</span>
              </button>
            </div>
          </div>

          {/* COMMENTS SECTION */}
          <div className="space-y-8 pt-8 border-t border-black/10">
            <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-brand-dark">
              COMMUNITY DISCUSSION ({comments.length})
            </h3>

            {/* Approved comments list */}
            <div className="space-y-4">
              {comments.map((c, idx) => (
                <div key={idx} className="bg-white border border-black/15 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-space font-bold uppercase text-brand-dark">{c.name}</span>
                    <span className="text-gray-400 text-[11px]">{c.date}</span>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm font-inter">{c.comment}</p>
                </div>
              ))}
            </div>

            {/* Submit Comment Form */}
            <div className="bg-white border-2 border-black rounded-2xl p-6">
              <h4 className="font-space font-bold text-sm uppercase text-brand-dark mb-1">
                JOIN THE CONVERSATION
              </h4>
              <p className="text-gray-500 text-xs mb-4">
                Comments are reviewed by our editorial team prior to public publishing.
              </p>

              {commentSubmitted ? (
                <div className="bg-brand-lime/20 border border-brand-lime p-4 rounded-xl text-xs font-inter text-brand-dark">
                  ✓ <strong>Thank you!</strong> Your comment has been submitted and is awaiting administrator moderation before going live.
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={newComment.name}
                      onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                      required
                      className="bg-[#F4F4F5] border border-black/10 rounded-lg px-3 py-2 text-xs text-brand-dark focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Your Email *"
                      value={newComment.email}
                      onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                      required
                      className="bg-[#F4F4F5] border border-black/10 rounded-lg px-3 py-2 text-xs text-brand-dark focus:outline-none"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Write your perspective or question..."
                    value={newComment.comment}
                    onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                    required
                    className="w-full bg-[#F4F4F5] border border-black/10 rounded-lg px-3 py-2 text-xs text-brand-dark focus:outline-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-brand-dark text-white px-5 py-2.5 rounded-lg font-space font-bold uppercase text-xs hover:bg-brand-blue transition-colors cursor-pointer border-none"
                  >
                    Submit Comment For Review →
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* SHARE MODAL */}
          {shareModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border-2 border-black rounded-2xl max-w-sm w-full p-6 text-center">
                <div className="flex items-center justify-between pb-2 border-b border-black/10 mb-4">
                  <h4 className="font-space font-bold text-xs uppercase text-brand-dark">Share Article</h4>
                  <button type="button" onClick={() => setShareModalOpen(false)} className="text-gray-500 bg-transparent border-none cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-space font-bold uppercase">
                  <button type="button" onClick={() => handleShare("copy")} className="p-3 bg-gray-100 hover:bg-brand-lime rounded-xl border-none cursor-pointer">
                    {copiedLink ? "Copied! ✓" : "Copy Link"}
                  </button>
                  <button type="button" onClick={() => handleShare("whatsapp")} className="p-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl border-none cursor-pointer">
                    WhatsApp
                  </button>
                  <button type="button" onClick={() => handleShare("linkedin")} className="p-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl border-none cursor-pointer">
                    LinkedIn
                  </button>
                  <button type="button" onClick={() => handleShare("twitter")} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border-none cursor-pointer">
                    X / Twitter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageLayout>
    );
  }

  // Articles Hub Listing
  const filtered = blogPostsCatalog.filter((b) => {
    const matchCat = activeCategory === "All" || b.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PageLayout onNavigate={onNavigate} activeNav="blog">
      <div className="space-y-12 text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/20 border border-brand-lime/40 text-brand-dark font-space font-bold text-xs uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5 text-brand-blue" />
            Editorial Playbooks & Insights
          </div>
          <h1 className="font-space font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-brand-dark leading-[0.95] mb-6">
            FEED NOTES. <br />
            <span className="text-brand-blue">STRATEGY UNFILTERED.</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base font-inter leading-relaxed">
            Raw, battle-tested teardowns of short-form video algorithms, server-side attribution, and commercial brand positioning.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Creative Strategy", "Paid Performance", "SEO"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-space font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  activeCategory === cat
                    ? "bg-brand-dark text-white border-black"
                    : "bg-white text-gray-700 border-black/10 hover:border-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search playbooks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-black/15 rounded-lg pl-9 pr-3 py-2 text-xs text-brand-dark focus:outline-none"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <div
              key={post.slug}
              className="bg-white border-2 border-black rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-space font-bold uppercase text-brand-blue mb-3">
                  <span>{post.category}</span>
                  <span className="text-gray-400">{post.readTime}</span>
                </div>
                <h3 className="font-space font-bold text-xl uppercase tracking-tight text-brand-dark group-hover:text-brand-blue transition-colors mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-xs font-inter line-clamp-3 mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                <div className="text-[11px] text-gray-500 font-space font-bold uppercase">{post.author}</div>
                <button
                  type="button"
                  onClick={() => setSelectedSlug(post.slug)}
                  className="font-space font-bold text-xs uppercase text-brand-dark hover:text-brand-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Read Post →
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
                    <a href="tel:+919876543210" className="text-gray-600 hover:text-black">+91 98765 43210</a>
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
                  href="https://wa.me/919876543210?text=Hi%20GetIntoFeed%20team,%20I%20am%20interested%20in%20a%20growth%20sprint."
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
                      placeholder="+91 98765 43210"
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
              <li><button type="button" onClick={() => onNavigate("/audit")} className="hover:underline bg-transparent border-none p-0 cursor-pointer text-left">Free 360° Diagnostic Audit</button></li>
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
  return (
    <PageLayout onNavigate={onNavigate} activeNav="cookie-policy">
      <div className="space-y-8 text-left max-w-3xl mx-auto prose prose-neutral font-inter text-xs sm:text-sm text-gray-700">
        <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-brand-dark mb-4">
          COOKIE & PRIVACY POLICY
        </h1>
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <p>
          GetIntoFeed ("we", "us", or "our") uses cookies and similar browser storage mechanisms to recognize you when you visit our website, optimize your page load speeds, and measure analytics performance.
        </p>
        <h3>1. Categories of Cookies We Use</h3>
        <ul>
          <li><strong>Strictly Necessary Cookies:</strong> Essential for you to browse the website and use core security features.</li>
          <li><strong>Analytics & Performance:</strong> Aggregated measurement of page visits, device types, and bounce rates via GA4 without individual PII.</li>
          <li><strong>Targeting & Advertising:</strong> First-party Meta Conversions API (CAPI) signals to prevent serving duplicate marketing ads.</li>
        </ul>
        <h3>2. Managing Your Preferences</h3>
        <p>
          You can update your cookie preferences at any time by clearing your browser cache or clicking the button below:
        </p>
        <button
          type="button"
          onClick={() => { localStorage.removeItem("gif_cookie_consent"); window.location.reload(); }}
          className="bg-brand-dark text-white px-5 py-2 rounded-lg font-space font-bold uppercase text-xs cursor-pointer border-none"
        >
          Reset Cookie Preferences
        </button>
      </div>
    </PageLayout>
  );
}

// =========================================================================
// LEGAL PAGE (/privacy & /terms)
// =========================================================================
export function LegalPage({ type = "privacy", onNavigate }) {
  const isPrivacy = type === "privacy";

  return (
    <PageLayout onNavigate={onNavigate}>
      <div className="space-y-8 text-left max-w-3xl mx-auto prose prose-neutral font-inter text-xs sm:text-sm text-gray-700">
        <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-brand-dark">
          {isPrivacy ? "PRIVACY POLICY" : "TERMS OF SERVICE"}
        </h1>
        <p><strong>Last Updated:</strong> January 2026</p>
        {isPrivacy ? (
          <>
            <p>
              Your privacy is paramount. GetIntoFeed will never sell, lease, or monetize your company data, phone numbers, or email addresses to third parties.
            </p>
            <h3>Information Collection</h3>
            <p>
              When you submit a consultation form or free audit request, we collect your name, email, phone number, and company URL solely to prepare your strategic proposal.
            </p>
          </>
        ) : (
          <>
            <p>
              By accessing the GetIntoFeed website or contracting our creative and growth sprints, you agree to these commercial terms.
            </p>
            <h3>Intellectual Property</h3>
            <p>
              Upon receipt of full payment for creative sprints, all custom brand assets, Figma files, and video deliverables become the exclusive intellectual property of the client.
            </p>
          </>
        )}
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
