import {
  Palette,
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
  Zap,
  Edit3,
  Clapperboard,
  Layout
} from "lucide-react";

export const PRICING_COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" }
];

export const reviewsCatalog = [
  {
    name: "Vikramaditya Singhania",
    client_name: "Vikramaditya Singhania",
    role: "Managing Director",
    client_role: "Managing Director",
    company: "LuxeLiving Realty",
    client_company: "LuxeLiving Realty",
    quote: "GetIntoFeed transformed our entire lead quality. Instead of chasing leads who couldn't afford our properties, HNIs are now booking private villa previews directly through WhatsApp.",
    content: "GetIntoFeed transformed our entire lead quality. Instead of chasing leads who couldn't afford our properties, HNIs are now booking private villa previews directly through WhatsApp.",
    rating: 5,
    service: "Paid Performance & Video",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Sneha Kapur",
    client_name: "Sneha Kapur",
    role: "Co-Founder & CEO",
    client_role: "Co-Founder & CEO",
    company: "GlowUp D2C Skincare",
    client_company: "GlowUp D2C Skincare",
    quote: "The creative velocity GetIntoFeed delivers is ridiculous. Our ads never suffer fatigue anymore because their video team drops fresh winning hooks every single week.",
    content: "The creative velocity GetIntoFeed delivers is ridiculous. Our ads never suffer fatigue anymore because their video team drops fresh winning hooks every single week.",
    rating: 5,
    service: "UGC Video & Meta Scaling",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Aditya Roy",
    client_name: "Aditya Roy",
    role: "Chief Growth Officer",
    client_role: "Chief Growth Officer",
    company: "Apex Wealth FinTech",
    client_company: "Apex Wealth FinTech",
    quote: "They didn't just run ads; they built an organic software asset that now brings us tens of thousands of free financial signups every single month.",
    content: "They didn't just run ads; they built an organic software asset that now brings us tens of thousands of free financial signups every single month.",
    rating: 5,
    service: "Programmatic SEO & Funnels",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Kavita Pillai",
    client_name: "Kavita Pillai",
    role: "VP Marketing",
    client_role: "VP Marketing",
    company: "Zenith EdTech",
    client_company: "Zenith EdTech",
    quote: "Working with GetIntoFeed feels like having an elite SWAT team of creative directors and data scientists plugged directly into our Slack. 10/10 execution.",
    content: "Working with GetIntoFeed feels like having an elite SWAT team of creative directors and data scientists plugged directly into our Slack. 10/10 execution.",
    rating: 5,
    service: "Brand Positioning & Growth",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Arjun Mehta",
    client_name: "Arjun Mehta",
    role: "Founder",
    client_role: "Founder",
    company: "UrbanCrust F&B",
    client_company: "UrbanCrust F&B",
    quote: "Our viral reels hit 2.4 million views in the first 3 weeks. Footfalls in our physical outlets doubled. Best marketing investment we've ever made.",
    content: "Our viral reels hit 2.4 million views in the first 3 weeks. Footfalls in our physical outlets doubled. Best marketing investment we've ever made.",
    rating: 5,
    service: "Short-Form Video Production",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Manish Chhabra",
    client_name: "Manish Chhabra",
    role: "Head of Digital",
    client_role: "Head of Digital",
    company: "Volt EV Mobility",
    client_company: "Volt EV Mobility",
    quote: "Transparent, fast, zero corporate fluff. If you want marketing that actually drives measurable commercial pipeline, hire GetIntoFeed.",
    content: "Transparent, fast, zero corporate fluff. If you want marketing that actually drives measurable commercial pipeline, hire GetIntoFeed.",
    rating: 5,
    service: "Google & Meta Performance",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80"
  }
];

export function getStoredReviews() {
  try {
    const saved = localStorage.getItem("gif_reviews_catalog");
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return reviewsCatalog;
}

export function getStoredSEOTags() {
  try {
    const saved = localStorage.getItem("gif_custom_seo_tags");
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === "object" && parsed !== null) return parsed;
    }
  } catch {}
  return {};
}

export function getStoredTeam() {
  try {
    const saved = localStorage.getItem("gif_team_catalog");
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return teamCatalog;
}

export function getStoredAwards() {
  try {
    const saved = localStorage.getItem("gif_awards_catalog");
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return awardsCatalog;
}

export function getStoredFaqs() {
  try {
    const saved = localStorage.getItem("gif_faqs_catalog");
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return faqsCatalog;
}


export const servicesCatalog = [
  {
    slug: "google-ads",
    title: "Google Ads",
    shortDesc: "High-intent Google Search, Maps, and Performance Max campaigns engineered for immediate phone calls and verified conversion tracking.",
    icon: Search,
    category: "Search Ads",
    deliverables: ["High-intent buyer keywords", "Negative keyword waste filtering", "Call & WhatsApp conversion tracking", "Performance Max asset groups"],
    pricingTier: "From ₹14,999 / mo",
    overview: "Google Ads captures customers at the exact instant they are searching for your service. We eliminate wasted spend by actively managing search terms, negative keywords, location radii, and conversion tracking.",
    whatWeDo: [
      "Transactional keyword intent mapping and competitor gap analysis",
      "Negative keyword master list setup to cut low-intent click waste",
      "Google Tag Manager and GA4 call & WhatsApp conversion tracking",
      "Performance Max campaigns with optimized copy, images, and audience signals",
      "Ongoing bid optimization and weekly transparent performance reporting"
    ],
    strategySteps: [
      { step: "01", name: "Search Intent Discovery", desc: "Identify exact queries prospective clients type when ready to buy or call." },
      { step: "02", name: "Campaign Architecture", desc: "Build tightly-themed ad groups with targeted headlines and extensions." },
      { step: "03", name: "Conversion Tracking", desc: "Integrate phone call, form, and WhatsApp conversion triggers in GA4." },
      { step: "04", name: "Optimization & Scaling", desc: "Refine negative terms daily and scale spend on top-performing search terms." }
    ],
    faqs: [
      { q: "How quickly do Google Ads produce calls?", a: "Once approved, campaigns go live within 24 to 48 hours and can generate calls and inquiries on Day 1." },
      { q: "Who pays Google for ad spend?", a: "You pay Google directly through your own ad account; we handle strategy, setup, and daily management." }
    ]
  },
  {
    slug: "meta-ads",
    title: "Meta Ads",
    shortDesc: "Facebook & Instagram performance campaigns built with thumb-stopping video hooks, Instant Lead Forms, and direct WhatsApp click ads.",
    icon: Megaphone,
    category: "Paid Social",
    deliverables: ["Instant Lead Forms & WhatsApp Ads", "Local radius & interest targeting", "Scroll-stopping video & graphic hooks", "Meta CAPI server tracking"],
    pricingTier: "From ₹14,999 / mo",
    overview: "Meta Ads are unmatched for reaching targeted local audiences and scaling consumer brands. We build high-CTR video hooks, test multiple angles weekly, and set up instant WhatsApp inquiry flows that turn viewers into paying clients.",
    whatWeDo: [
      "Full funnel setup: top-of-funnel prospecting and bottom-of-funnel retargeting",
      "Weekly creative hook testing across vertical video reels, carousels, and statics",
      "Instant Lead Forms with pre-filled inputs for maximum mobile submission rates",
      "Direct WhatsApp click ads connecting prospective buyers to your phone",
      "Meta Conversions API (CAPI) server tracking to bypass iOS privacy restrictions"
    ],
    strategySteps: [
      { step: "01", name: "Audience & Offer Mapping", desc: "Define compelling local offers and target audience demographics." },
      { step: "02", name: "Creative Rapid Prototyping", desc: "Script, design, and edit thumb-stopping video and graphic variations." },
      { step: "03", name: "Lead Flow Integration", desc: "Connect lead forms directly to your WhatsApp and email notifications." },
      { step: "04", name: "Algorithmic Scaling", desc: "Inject budget into winning creative angles and expand local reach." }
    ],
    faqs: [
      { q: "How do leads reach us from Facebook & Instagram?", a: "Leads arrive instantly on your WhatsApp, in a shared Google Sheet in real time, or via email." },
      { q: "Do you design the video ads and graphics?", a: "Yes! Our in-house creative team designs all creatives, video reels, and ad copy." }
    ]
  },
  {
    slug: "website-design",
    title: "Website Design",
    shortDesc: "Lightning-fast, mobile-first websites and landing pages with clear value propositions, modern typography, and direct WhatsApp contact flows.",
    icon: Layout,
    category: "Web & CRO",
    deliverables: ["High-converting Ad landing pages", "Fast mobile-first responsive build", "Direct WhatsApp & Call button flows", "Speed optimization (<1.5s)"],
    pricingTier: "From ₹14,999 / Project",
    overview: "Your website is your best salesperson. We design mobile-first, lightning-fast digital storefronts with flawless ergonomics, clear pricing hooks, and frictionless WhatsApp contact flows that convert clicks into revenue.",
    whatWeDo: [
      "Custom mobile-first responsive UI/UX design with modern typography",
      "Lightning page speeds loading in under 1.5 seconds on mobile 4G/5G",
      "Conversion Rate Optimization (CRO) with sticky WhatsApp and Call buttons",
      "On-page SEO, Schema structured data markup, and clean semantic code",
      "Simple content management so you can easily update text and images"
    ],
    strategySteps: [
      { step: "01", name: "Wireframing & Copy", desc: "Craft clear messaging and customer conversion journeys." },
      { step: "02", name: "Modern Design Mockup", desc: "Design clean, high-trust desktop and mobile layouts." },
      { step: "03", name: "Responsive Build", desc: "Code the website with clean semantic structure and fast assets." },
      { step: "04", name: "Launch & Testing", desc: "Test across iPhones, Android devices, and desktops before going live." }
    ],
    faqs: [
      { q: "How long does a website take to build?", a: "A single-page landing page takes 3 to 5 business days. A complete 5-8 page corporate site takes 10 to 14 days." },
      { q: "Is the website mobile-friendly?", a: "100%. We design mobile-first since over 80% of digital marketing traffic visits on smartphones." }
    ]
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    shortDesc: "Bespoke ad creatives, social media post kits, company pitch decks, and brand identity systems that command premium credibility.",
    icon: Palette,
    category: "Creative & Design",
    deliverables: ["Social media & ad campaign kits", "Company brochures & pitch decks", "Clean visual identity & templates", "Vector & editable source files"],
    pricingTier: "From ₹12,999 / mo",
    overview: "In an online feed where customers judge you in 0.5 seconds, premium visual aesthetics are your most powerful lever for credibility. We design assets that reflect top-tier quality and stop thumbs.",
    whatWeDo: [
      "High-CTR ad banners and comparison graphics for Meta & Google campaigns",
      "Cohesive Instagram carousel kits and LinkedIn thought leadership infographics",
      "Corporate pitch decks, capability brochures, and client presentation decks",
      "Brand identity systems including typography tokens, color palettes, and vectors",
      "Full export suites including web-optimized PNGs, PDFs, and editable source files"
    ],
    strategySteps: [
      { step: "01", name: "Brand Diagnosis", desc: "Review existing visual assets, competitor gaps, and brand guidelines." },
      { step: "02", name: "Style Direction", desc: "Establish type hierarchies, high-contrast palettes, and creative layouts." },
      { step: "03", name: "Batch Creation", desc: "Design ad kits, social carousels, and brochures with disciplined craft." },
      { step: "04", name: "Delivery & Iteration", desc: "Deliver production-ready files with ongoing refinement." }
    ],
    faqs: [
      { q: "Do you provide editable source files?", a: "Yes, you receive all export files along with editable Figma, AI, or PSD source files." },
      { q: "Can you follow our existing brand guidelines?", a: "Yes, we strictly match your colors, fonts, and logos for seamless brand consistency." }
    ]
  },
  {
    slug: "content-marketing",
    title: "Content Marketing",
    shortDesc: "No random posting. We craft scroll-stopping copy, editorial articles, and thought leadership that connect with your audience and build genuine authority.",
    icon: Edit3,
    category: "Content Strategy",
    deliverables: ["Content Strategy & Planning", "Copywriting & Brand Voice", "Editorial & Topic Clusters", "Organic Inbound Lead Tactics"],
    pricingTier: "From ₹50,000 / mo",
    overview: "In a digital world crowded with noise, high-intent content is your highest-leverage moat. Every piece of content we produce has a distinct strategic reason for existing — designed to hook attention, build authority, and systematically guide prospects toward conversion.",
    whatWeDo: [
      "Customer journey & thematic content pillar mapping",
      "High-converting copywriting for articles, newsletters, and lead magnets",
      "Search intent optimization and programmatic keyword silos",
      "Strategic storytelling that differentiates your brand from competitors",
      "Regular performance reporting and inbound pipeline attribution"
    ],
    strategySteps: [
      { step: "01", name: "Audience Discovery", desc: "Identify what questions, pain points, and topics your ideal clients research before purchasing." },
      { step: "02", name: "Content Architecture", desc: "Build thematic clusters and editorial calendars that position your brand as the industry leader." },
      { step: "03", name: "High-Standard Creation", desc: "Draft, edit, and polish high-taste copy with uncompromising editorial standards." },
      { step: "04", name: "Distribution & Lead Capture", desc: "Distribute across key channels with embedded lead capture points." }
    ],
    faqs: [
      { q: "How quickly does content marketing show results?", a: "Content establishes brand authority immediately and compounds organic leads over 60-90 days." },
      { q: "Do you write all the copy yourselves?", a: "Yes, our dedicated in-house copywriters write and refine every single deliverable." }
    ]
  },
  {
    slug: "ads-campaign",
    title: "Ads Campaign",
    shortDesc: "Meta, Google, & YouTube ad campaigns engineered for positive unit economics, high blended ROAS, and predictable customer acquisition.",
    icon: Megaphone,
    category: "Paid Performance",
    deliverables: ["Google Ads & Search Architecture", "Meta Performance Ads (FB & IG)", "Conversion Funnel CRO", "Server-Side CAPI & ROAS Tracking"],
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
    title: "Social Media",
    shortDesc: "Turn your Instagram and LinkedIn feeds into high-velocity community engines that generate organic brand authority and inbound leads.",
    icon: Users,
    category: "Organic Social",
    deliverables: ["Platform Strategy (IG & LinkedIn)", "Community Management & DMs", "Viral Carousel & Post Mechanics", "Brand Voice & Trend Hijacking"],
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
    slug: "graphics-design",
    title: "Graphics Design",
    shortDesc: "Architect high-status visual identities, ad creatives, typography hierarchies, and social assets that command premium pricing and stand out in the feed.",
    icon: PenTool,
    category: "Creative & Design",
    deliverables: ["Brand Identity & Visual Guidelines", "High-CTR Ad Creatives & Banners", "Social Media Design Systems", "Typography & Marketing Assets"],
    pricingTier: "From ₹10,500 onwards*",
    overview: "In a digital world crowded with derivative templates, strong visual design is your greatest economic moat. We don't just design logos  — we engineer complete visual ecosystems that trigger immediate trust, customer desire, and distinct brand recall.",
    whatWeDo: [
      "Deep brand diagnosis, market positioning, and ethical competitor gap analysis",
      "Comprehensive typography hierarchy, color theory, and logo vector suite",
      "High-converting ad graphic variations for Meta, Google Display, and LinkedIn",
      "Multi-format creative guidelines for reels, static ads, packaging, and web",
      "Figma design tokens ready for engineering and marketing execution"
    ],
    strategySteps: [
      { step: "01", name: "Strategic Discovery", desc: "Audit your current market standing, audience demographics, and core visual aesthetic." },
      { step: "02", name: "Visual Identity System", desc: "Craft bold typography pairings, signature color accents, and motion brand assets." },
      { step: "03", name: "Ad Creative Sprints", desc: "Produce high-converting banner designs and static visual hooks for performance ads." },
      { step: "04", name: "Asset Delivery", desc: "Deliver production-ready Figma files, export assets, and social starter kits." }
    ],
    faqs: [
      { q: "How long does a design sprint take?", a: "A standard graphics sprint runs 1 to 2 weeks with regular design reviews." },
      { q: "Do you deliver vector source files?", a: "Yes, you receive full Figma source files, SVG/PNG/EPS vectors, and typography licenses." }
    ]
  },
  {
    slug: "reels",
    title: "Reels",
    shortDesc: "High-retention 9:16 vertical video designed specifically for Instagram Reels, YouTube Shorts, and TikTok algorithms.",
    icon: Clapperboard,
    category: "Short-Form Video",
    deliverables: ["Thumb-Stopping Hook Ideation", "Kinetic Subtitles & Sound Design", "Fast Pacing & Dynamic B-Roll", "Batch Production Sprints"],
    pricingTier: "From ₹10,500 onwards*",
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
    slug: "videos",
    title: "Videos",
    shortDesc: "High-octane commercial video production, brand stories, product showcases, and high-converting UGC designed to turn viewer attention into brand trust and signed contracts.",
    icon: Video,
    category: "Video Production",
    deliverables: ["Commercial & Brand Storytelling", "4K Studio & UGC Video Intake", "Cinematic Color Grading & Motion", "Multi-Platform Video Formats"],
    pricingTier: "From ₹75,000 / Project",
    overview: "High-end commercial video establishes unquestioned credibility. From founder documentaries and product launch films to dynamic UGC pipelines, we produce cinematic video assets that elevate your brand and drive measurable conversions.",
    whatWeDo: [
      "End-to-end commercial scriptwriting, storyboarding, and creative direction",
      "Cinema-grade 4K filming with multi-camera setups and broadcast lighting",
      "High-end post-production, sound mixing, and DaVinci color grading",
      "Cut-downs optimized for horizontal web embedding and 9:16 social amplification",
      "Direct conversion hooks engineered to maximize viewer action"
    ],
    strategySteps: [
      { step: "01", name: "Narrative Discovery", desc: "Unpack your brand story, product differentiators, and customer emotional drivers." },
      { step: "02", name: "Pre-Production & Script", desc: "Lock storyboards, scripts, call sheets, and creative vision before shooting." },
      { step: "03", name: "Production Execution", desc: "Shoot in studio or on-location with cinema-grade cameras and professional audio." },
      { step: "04", name: "Finishing & Delivery", desc: "Deliver master files along with multi-aspect ratio cuts for web and ad campaigns." }
    ],
    faqs: [
      { q: "Do you shoot on location in India?", a: "Yes, our production crews can shoot on location across major cities or in studio." },
      { q: "Can we use these videos for ads?", a: "Yes, you receive full commercial broadcast and digital ad rights with all delivered masters." }
    ]
  },
  {
    slug: "web-development",
    title: "Web Development",
    shortDesc: "Blazing-fast, modern React & Next.js websites and high-converting landing pages built to convert cold visitors into signed contracts.",
    icon: Code,
    category: "Web & CRO",
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
    title: "SEO",
    shortDesc: "Dominate search intent across traditional Google SERPs and generative AI answer engines (Perplexity, ChatGPT Search) with authoritative content clusters.",
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
// =========================================================================
// CASE STUDIES CATALOG (DYNAMIC CMS DRIVEN  — ZERO HARDCODED DUMMY DATA)
// =========================================================================
export const caseStudiesCatalog = [];

export const ICON_MAP = {
  Palette,
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
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = localStorage.getItem("gif_services_catalog");
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch {}
  return servicesCatalog || [];
}

export function getStoredCaseStudies() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = localStorage.getItem("gif_case_studies_catalog");
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch {}
  return [];
}


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
    a: "We work on transparent fixed-fee monthly retainers or sprint packages with zero hidden markups. Our starter sprints begin at ₹10,500 onwards* for focused disciplines, scaling up for multi-channel management."
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