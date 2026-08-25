import React, { useState } from "react";
import {
  AlertCircle, ArrowLeft, ArrowRight, Award, BarChart3, Building2, Check, CheckCircle2, ChevronDown, ChevronRight, Clock, Code, Database, Eye, FileText, Globe2, HelpCircle, Layers, Layout, LineChart, Mail, MapPin, Megaphone, MessageCircle, MousePointerClick, Palette, PenTool, Phone, Plus, Quote, RotateCw, Search, Send, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Star, Target, TrendingUp, UsersRound, Zap
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// -----------------------------------------------------------------------------
// COMPLETE GET INTO FEED SERVICE TAXONOMY (20+ SPECIALIZED CAPABILITIES)
// -----------------------------------------------------------------------------
export const serviceCatalog = {
  // 1. ENTERPRISE SEO
  "enterprise-seo": {
    title: "Enterprise SEO Services",
    icon: Search,
    label: "Enterprise Search",
    outcome: "Scale organic search moats, capture category leadership, and compound inbound pipeline for large enterprises.",
    description: "Enterprise websites require sophisticated crawl topology, Core Web Vitals engineering, and programmatic keyword hubs. We help Fortune 500s and Indian conglomerates capture dominant search real estate.",
    bottleneck: "Enterprise websites with 100K+ pages suffer from severe crawl budget waste, orphaned subdomains, and slow indexing velocity.",
    framework: [
      { step: "01. Log File & Crawl Analysis", detail: "Inspecting Googlebot server crawl behavior to eliminate orphan pages and maximize crawl efficiency." },
      { step: "02. Programmatic Page Clusters", detail: "Deploying thousands of high-intent programmatic landing pages targeting long-tail commercial queries." },
      { step: "03. Internal Link Graph Engineering", detail: "Optimizing PageRank flow and category internal linking to lift commercial product pages." },
      { step: "04. Authority Moat Building", detail: "Securing tier-1 editorial digital PR links to solidify #1 Google rankings across competitive verticals." }
    ],
    points: [
      "Enterprise Log File & Crawl Budget Optimization",
      "Programmatic Commercial Keyword Clustering",
      "Technical Core Web Vitals & Sub-Second LCP Fixes",
      "Multi-Subdomain & International Hreflang Architecture",
      "Tier-1 Digital PR & High-Authority Backlink Acquisition",
      "Custom Looker Studio Enterprise SEO Telemetry"
    ],
    tools: ["Ahrefs Enterprise", "SEMrush", "Screaming Frog", "BigQuery", "Google Search Console", "Schema.org"],
    caseMetric: "+340% Organic Leads",
    caseBrand: "FinScale Lending (BFSI)",
    faqs: [
      { q: "How do you handle SEO for websites with over 100,000 pages?", a: "We utilize automated programmatic templates, server log file analysis, and dynamic internal link graphs to ensure Googlebot crawls and indexes high-priority commercial URLs first." },
      { q: "How long until enterprise SEO moves the needle on revenue?", a: "Technical and indexation improvements deliver noticeable ranking surges in 30 to 45 days, with full commercial pipeline compounding at 90+ days." }
    ]
  },

  // 2. GENERATIVE ENGINE OPTIMIZATION (GEO / AI SEO)
  "geo-ai-search": {
    title: "Generative Engine Optimization (GEO / AI SEO)",
    icon: Sparkles,
    label: "AI Search Discovery",
    outcome: "Get cited and recommended by ChatGPT, Google Gemini, and Perplexity when buyers search for category solutions.",
    description: "Search is shifting from 10 blue links to AI answer engines. We optimize your brand entity, schema graphs, and citation footprint so LLMs recommend your brand first.",
    bottleneck: "LLMs ignore unverified brand entities and surface competitors who have structured Knowledge Graph markup and authoritative citations.",
    framework: [
      { step: "01. Knowledge Graph Entity Mapping", detail: "Building comprehensive Schema.org Organization, Brand, and sameAs nodes across WikiData and Crunchbase." },
      { step: "02. Direct Data & Fact Ingestion", detail: "Publishing original benchmark statistics and proprietary research that LLM crawlers ingest into training weights." },
      { step: "03. High-Authority Brand Co-occurrence", detail: "Securing brand mentions alongside industry keywords in verified trade journals and digital PR." },
      { step: "04. AI Overview Prompt Testing", detail: "Simulating hundreds of conversational prompts across ChatGPT and Gemini to verify citation share." }
    ],
    points: [
      "ChatGPT, Gemini & Perplexity Brand Citation Optimization",
      "Schema.org Semantic Knowledge Graph Structuring",
      "Proprietary Benchmark Research & Data Ingestion",
      "Digital PR Entity Co-occurrence Engineering",
      "Google AI Overviews (AEO) Answer Engine Domination",
      "Conversational Search Query Cluster Mapping"
    ],
    tools: ["Schema.org", "Wikidata", "Perplexity Pro", "ChatGPT Enterprise", "Ahrefs", "Google Gemini API"],
    caseMetric: "+273% AI Visibility",
    caseBrand: "Veloura & FinScale Growth Portfolio",
    faqs: [
      { q: "What is the difference between SEO and GEO?", a: "SEO targets Google keyword rank positions, while GEO (Generative Engine Optimization) ensures AI models cite and recommend your brand when synthesizing complex answers." }
    ]
  },

  // 3. LOCAL SEO
  "local-seo": {
    title: "Local SEO & Google Map Pack Dominance",
    icon: MapPin,
    label: "Local Search",
    outcome: "Dominate Google 3-Pack and local map searches across Bengaluru, Mumbai, Delhi-NCR, Pune, and regional hubs.",
    description: "Capture nearby buyers and multi-location foot traffic with hyper-localized landing pages, Google Business Profile (GBP) velocity, and geo-targeted review systems.",
    bottleneck: "Multi-location brands lose 70% of high-intent local footfall due to inconsistent NAP citations and unoptimized local profiles.",
    framework: [
      { step: "01. Google Business Profile Audit", detail: "Optimizing primary and secondary categories, service menus, and geo-tagged images." },
      { step: "02. Hyperlocal Landing Pages", detail: "Building dedicated landing pages for every city branch with localized schema markup." },
      { step: "03. Citation & NAP Consistency", detail: "Syncing Business Name, Address, and Phone across 60+ local Indian directories." },
      { step: "04. Review Generation Velocity", detail: "Automating customer feedback workflows to maintain 4.8★ ratings with local keywords." }
    ],
    points: [
      "Google 3-Pack Map Ranking Optimization",
      "Multi-Location Google Business Profile (GBP) Management",
      "Hyperlocal Branch Pages with LocalBusiness Schema",
      "Local Citation & Directory Cleanup (JustDial, IndiaMart, Sulekha)",
      "Automated WhatsApp Review Collection Funnels",
      "Hyperlocal Google Search Ads Integration"
    ],
    tools: ["Google Business Profile", "BrightLocal", "Whitespark", "Google Maps API", "WhatsApp API"],
    caseMetric: "+280% OPD Bookings",
    caseBrand: "MediHealth Super Specialty Hospitals",
    faqs: [
      { q: "Can you rank multiple branches in different cities?", a: "Yes! We build location-specific landing page architectures that achieve #1 Google Map Pack rankings for each branch independently." }
    ]
  },

  // 4. ECOMMERCE SEO
  "ecommerce-seo": {
    title: "Ecommerce SEO & D2C Growth",
    icon: Globe2,
    label: "Ecommerce SEO",
    outcome: "Drive compounding organic revenue and reduce paid ad reliance for Shopify, WooCommerce, and Magento stores.",
    description: "Rank product categories and high-converting product pages at the top of Google. We combine faceted navigation optimization, product schema, and buyer intent clusters.",
    bottleneck: "Faceted navigation generates duplicate content bloat and canonical errors that dilute domain authority.",
    framework: [
      { step: "01. Faceted Navigation Architecture", detail: "Cleaning up duplicate filter URLs and indexing only high-demand commercial attribute combinations." },
      { step: "02. Rich Product Schema", detail: "Adding Product, AggregateRating, and Offer schemas for prominent Google Shopping rich snippets." },
      { step: "03. Category Hub Optimization", detail: "Transforming thin category pages into authoritative buying guides that rank for top-of-funnel searches." },
      { step: "04. Commercial Link Acquisition", detail: "Securing product placements in lifestyle publications and buyer guides." }
    ],
    points: [
      "Shopify & Headless Ecommerce SEO Optimization",
      "Product & AggregateRating Schema Markup",
      "Faceted Navigation & Canonical URL Engineering",
      "Commercial Category Buying Guide Hubs",
      "Zero-Click Product Snippet Optimization",
      "Out-of-Stock & Seasonal Product Redirect Management"
    ],
    tools: ["Shopify Plus", "Ahrefs", "Google Search Console", "Screaming Frog", "Schema App"],
    caseMetric: "4.8x ROAS / ₹1.8 Cr",
    caseBrand: "Veloura Organics (D2C Skincare)",
    faqs: [
      { q: "How do you handle out-of-stock products in SEO?", a: "We implement dynamic related-product modules and 301/302 redirects to preserve page authority and avoid high bounce rates." }
    ]
  },

  // 5. PAID ADS / GOOGLE SEARCH & PMAX
  "google-ads-ppc": {
    title: "Google Ads & Performance Max Management",
    icon: MousePointerClick,
    label: "Paid Search PPC",
    outcome: "Capture bottom-funnel commercial searches with tight CAC controls and maximum Return on Ad Spend (ROAS).",
    description: "We architect high-precision Google Search, Performance Max, and Shopping campaigns. With strict negative keyword filtering and server-side tracking, no rupee is wasted.",
    bottleneck: "Unoptimized broad match keywords and automated Smart Bidding drain ad budgets on low-intent search terms.",
    framework: [
      { step: "01. Account & Tracking Audit", detail: "Deploying Google Tag Manager server-side tracking and cleaning up wasted search query spend." },
      { step: "02. High-Intent Single-Theme Groups", detail: "Structuring ad groups by exact buyer intent with dynamic keyword insertion." },
      { step: "03. High-Converting Landing Pages", detail: "Routing traffic to sub-second custom React landing pages designed for instant lead capture." },
      { step: "04. Value-Based Bidding", detail: "Training Google AI bidding algorithms on qualified CRM lead value rather than vanity clicks." }
    ],
    points: [
      "Google Search, Shopping & Performance Max Campaigns",
      "Value-Based Smart Bidding Strategy & Optimization",
      "Daily Negative Keyword Scrubbing & Waste Elimination",
      "Sub-Second Custom React Conversion Landing Pages",
      "Server-Side Google Tag Manager (sGTM) Setup",
      "Multi-Touch CRM Revenue Attribution Modeling"
    ],
    tools: ["Google Ads", "Google Tag Manager", "Looker Studio", "BigQuery", "Hotjar"],
    caseMetric: "3.9x ROI / 18.4K Admissions",
    caseBrand: "EdVance Academy (EdTech)",
    faqs: [
      { q: "How do you ensure leads from Google Ads are qualified?", a: "We integrate your CRM webhook with Google Offline Conversion Tracking so algorithms optimize for deals closed rather than initial clicks." }
    ]
  },

  // 6. META ADS & UGC VIDEO SPRINTS
  "meta-ads": {
    title: "Meta Ads & Creator-Led UGC Scaling",
    icon: Megaphone,
    label: "Social Paid Ads",
    outcome: "Scale customer acquisition profitably on Instagram and Facebook with high-velocity creative testing sprints.",
    description: "Creative is modern targeting. We direct, produce, and test 8 to 12 creator-led video hooks and UGC reels weekly to scale multi-crore ad budgets with high ROAS.",
    bottleneck: "Ad accounts suffer from creative fatigue and rising CAC when running the same 3 video ads for months.",
    framework: [
      { step: "01. Weekly Creative Sprint", detail: "Producing 8+ creator hooks weekly testing Problem-Agitation, Demo, and Social Proof." },
      { step: "02. Advantage+ Campaign Scaling", detail: "Structuring broad audience campaigns powered by high-converting creative variations." },
      { step: "03. Conversions API (CAPI)", detail: "Deploying server-side tracking to restore 100% signal accuracy after iOS privacy updates." },
      { step: "04. Retention & WhatsApp Funnels", detail: "Retargeting engaged viewers with automated WhatsApp cart recovery offers." }
    ],
    points: [
      "High-Volume Creator-Led UGC Video Production",
      "Meta Advantage+ Shopping & Lead Campaigns",
      "Server-Side Meta Conversions API (CAPI) Integration",
      "Sub-Second React Product Landing Pages",
      "Automated WhatsApp Follow-up & Cart Recovery",
      "Weekly Creative Performance Scorecards"
    ],
    tools: ["Meta Ads Manager", "Meta CAPI", "CapCut Pro", "Figma", "WhatsApp API"],
    caseMetric: "₹1.8 Cr/mo Revenue",
    caseBrand: "Veloura Organics",
    faqs: [
      { q: "How many ad creatives do you test weekly?", a: "We produce and test 8 to 12 new video hooks and static iterations every single week to eliminate ad fatigue." }
    ]
  },

  // 7. B2B LINKEDIN ADS & ABM
  "linkedin-b2b-ads": {
    title: "LinkedIn B2B Advertising & Account-Based Marketing",
    icon: Target,
    label: "B2B Demand Gen",
    outcome: "Target CXOs, VP of Marketing, and decision-makers at tier-1 enterprise accounts to build qualified sales pipeline.",
    description: "We combine LinkedIn Account-Based Marketing (ABM) lists, thought leadership ads, and high-value research playbooks to generate enterprise pipeline.",
    bottleneck: "B2B brands waste ad budget on generic lead generation forms that attract unqualified consultants.",
    framework: [
      { step: "01. ICP & Account List Matching", detail: "Uploading target company accounts and matched decision-maker job titles." },
      { step: "02. Thought Leadership Ads", detail: "Promoting executive insights and original industry benchmark reports." },
      { step: "03. High-Intent Lead Routing", detail: "Connecting lead forms directly to your sales team's Slack and CRM." },
      { step: "04. Multi-Channel Nurturing", detail: "Retargeting website visitors with personalized case study snippets." }
    ],
    points: [
      "LinkedIn Account-Based Marketing (ABM) Lists",
      "Executive Thought Leadership Ad Campaigns",
      "High-Converting B2B Lead Gen Forms & Webhooks",
      "Matchedd Audience Retargeting & Pipeline Nurturing",
      "B2B CRM Pipeline Attribution (HubSpot / Salesforce)",
      "High-CTR Single Image & Carousel Creatives"
    ],
    tools: ["LinkedIn Campaign Manager", "HubSpot", "Salesforce", "Apollo.io", "Looker Studio"],
    caseMetric: "4.5x Pipeline",
    caseBrand: "Fintech & Enterprise Tech Portfolio",
    faqs: [
      { q: "Is LinkedIn advertising too expensive for mid-size brands?", a: "When targeted tightly to exact decision-makers with high-value research assets, LinkedIn delivers the lowest cost per qualified enterprise sales opportunity." }
    ]
  },

  // 8. APP STORE OPTIMIZATION (ASO)
  "app-store-optimization": {
    title: "App Store Optimization (ASO) & Mobile Growth",
    icon: Smartphone,
    label: "ASO & App Marketing",
    outcome: "Rank #1 for high-volume commercial keywords on iOS App Store & Google Play and drive profitable user acquisition.",
    description: "We scale organic app installs with keyword indexing, benefit-driven screenshots, and Apple Search Ads campaigns that deliver high retention.",
    bottleneck: "Over 65% of app downloads come from search, yet most apps leave title and subtitle keyword fields unoptimized.",
    framework: [
      { step: "01. Keyword & Metadata Mapping", detail: "Optimizing app title, subtitle, and hidden keyword fields for maximum search indexation." },
      { step: "02. Visual Screenshot CRO", detail: "Designing benefit-first screenshots and video previews that double install conversion rate." },
      { step: "03. Apple Search Ads (ASA)", detail: "Capturing top-of-search downloads while organically lifting category ranking." },
      { step: "04. Rating Velocity", detail: "Deploying in-app rating triggers to sustain 4.6+ star ratings." }
    ],
    points: [
      "iOS App Store & Google Play ASO Strategy",
      "App Title, Subtitle & Hidden Keyword Optimization",
      "High-Converting Screenshot & Preview Video Design",
      "Apple Search Ads & Google App Campaigns",
      "In-App Funnel & User Retention Optimization",
      "App Rating & Review Reputation Velocity"
    ],
    tools: ["AppTweak", "SensorTower", "Apple Search Ads", "Google Play Console", "AppsFlyer"],
    caseMetric: "+65% App Downloads",
    caseBrand: "Fintech & D2C Mobile Apps",
    faqs: [
      { q: "How long do ASO keyword updates take to rank?", a: "Google Play updates reflect in 3 to 7 days, while iOS App Store updates index upon publishing a new app build." }
    ]
  },

  // 9. WEBSITE DESIGN & CRO
  "website-design": {
    title: "High-Converting Web Experiences & CRO",
    icon: Globe2,
    label: "Web & CRO",
    outcome: "Sub-second React web applications, custom landing pages, and automated funnels built to turn visitors into paying clients.",
    description: "Speed is revenue. We engineer mobile-first React and Next.js web applications with 95+ Core Web Vitals scores that eliminate bounce rates and maximize conversions.",
    bottleneck: "A 1-second delay in page load drops mobile conversions by 26%. Slow WordPress templates bleed expensive marketing traffic.",
    framework: [
      { step: "01. Conversion UX Wireframing", detail: "Mapping user objections, trust triggers, and frictionless conversion pathways." },
      { step: "02. Sub-Second React Development", detail: "Engineering high-performance frontends with 95+ PageSpeed scores." },
      { step: "03. Automated CRM & WhatsApp Funnels", detail: "Routing form submissions instantly to WhatsApp API and sales CRM." },
      { step: "04. A/B Testing Sprints", detail: "Iterative testing of headlines, offers, and CTA moments." }
    ],
    points: [
      "Sub-Second React & Next.js Frontend Architecture",
      "Conversion Rate Optimization (CRO) UX Design",
      "Mobile-First Responsive Layouts Tested on all Metros",
      "Direct CRM, WhatsApp API & Webhook Automations",
      "Google Core Web Vitals Optimization (95+ PageSpeed)",
      "Interactive ROI Calculators & Multi-Step Lead Funnels"
    ],
    tools: ["React", "Next.js", "Vite", "TailwindCSS", "Node.js", "WhatsApp API", "Hotjar"],
    caseMetric: "+212% Enquiries",
    caseBrand: "EdVance Academy",
    faqs: [
      { q: "Why choose custom React over WordPress?", a: "React websites load in under 500ms, have zero plugin security vulnerabilities, achieve 95+ PageSpeed scores, and deliver double the conversion rates on mobile networks." }
    ]
  },

  // 10. CONTENT MARKETING & PR
  "content-marketing": {
    title: "Content Marketing & Digital PR",
    icon: PenTool,
    label: "Content & PR",
    outcome: "Thought leadership articles, SEO content hubs, and tier-1 media placements that establish industry authority.",
    description: "We produce editorial-grade SEO copywriting and original research reports that earn media coverage and compound permanent top-3 Google rankings.",
    bottleneck: "Generic AI content fails to rank or build trust. Winning requires original data and authoritative digital PR citations.",
    framework: [
      { step: "01. Commercial Topic Mapping", detail: "Targeting bottom-funnel buyer queries that indicate imminent purchase intent." },
      { step: "02. Practitioner Copywriting", detail: "Crafting in-depth guides and playbooks that demonstrate real subject authority." },
      { step: "03. Digital PR Outreach", detail: "Distributing research benchmarks to tier-1 business and trade publications." },
      { step: "04. Search Moat Maintenance", detail: "Internal linking and updating content to defend #1 positions." }
    ],
    points: [
      "High-Intent Commercial SEO Copywriting",
      "Original Research Reports & Industry Benchmarks",
      "Tier-1 Digital PR & National Media Placements",
      "Executive Ghostwriting & LinkedIn Thought Leadership",
      "Competitor Content Theft & Refresh Sprints",
      "Authoritative Whitepapers & Ebooks"
    ],
    tools: ["Ahrefs", "Clearscope", "Google Trends", "Hunter.io", "PR Newswire"],
    caseMetric: "41M+ Article Views",
    caseBrand: "Enterprise Portfolio",
    faqs: [
      { q: "Which media publications do you secure coverage in?", a: "We secure editorial coverage in leading Indian business outlets including The Economic Times, Mint, YourStory, Inc42, and specialized industry journals." }
    ]
  },

  // 11. ONLINE REPUTATION MANAGEMENT (ORM)
  "online-reputation-management": {
    title: "Online Reputation Management (ORM)",
    icon: ShieldCheck,
    label: "ORM & Brand Protection",
    outcome: "Protect brand search results, suppress negative content, and build positive reviews across Google, Glassdoor, and Trustpilot.",
    description: "We safeguard corporate reputation on Google page 1. Through positive asset creation and review acceleration, we ensure prospective buyers see credibility.",
    bottleneck: "Negative search results or review brigade attacks destroy buyer trust at the final consideration stage.",
    framework: [
      { step: "01. Search Page 1 Sentiment Audit", detail: "Cataloging all brand search results and identifying negative listings." },
      { step: "02. Positive Asset Domination", detail: "Building high-authority brand assets to displace negative third-party links." },
      { step: "03. Review Generation Sprints", detail: "Automating positive customer review workflows on Google and Trustpilot." },
      { step: "04. 24/7 Brand Monitoring", detail: "Real-time alerts on brand mentions across social media and forums." }
    ],
    points: [
      "Google Page 1 Negative Link Suppression",
      "Google Business Profile Review Reputation Elevation",
      "Glassdoor & Employee Sentiment Optimization",
      "Wikipedia & Knowledge Panel Entity Management",
      "Crisis Communications & Digital PR Response",
      "24/7 Brand Mention Sentiment Telemetry"
    ],
    tools: ["Google Alerts", "Brand24", "Ahrefs", "Trustpilot", "Glassdoor"],
    caseMetric: "4.9★ Average Rating",
    caseBrand: "Healthcare & Fintech Enterprises",
    faqs: [
      { q: "Can you remove negative links from Google?", a: "We utilize legal takedown protocols for defamatory content while aggressively ranking positive, owned brand assets on Page 1 to displace negative links." }
    ]
  },

  // 12. GA4 & MARTECH
  "ga4-server-side-tracking": {
    title: "BI Analytics, GA4 & Server-Side Tracking",
    icon: BarChart3,
    label: "MarTech & Attribution",
    outcome: "Server-side tracking, GA4 setups, and real-time Looker Studio dashboards revealing the exact revenue generated per rupee spent.",
    description: "We eliminate tracking blind spots with server-side Google Tag Manager, Meta CAPI, and executive Looker Studio dashboards.",
    bottleneck: "Browser privacy changes and ad blockers cause 30%+ of conversions to be lost in standard tracking setups.",
    framework: [
      { step: "01. Data Layer & Pixel Audit", detail: "Auditing tag health, duplicate events, and attribution discrepancies." },
      { step: "02. Server-Side GTM & CAPI", detail: "Deploying server-side tracking on cloud infrastructure for 100% data fidelity." },
      { step: "03. Multi-Touch Attribution", detail: "Connecting first-click to last-click sales data in custom BigQuery pipelines." },
      { step: "04. Real-Time Looker Dashboards", detail: "Building automated executive dashboards for daily marketing reviews." }
    ],
    points: [
      "Server-Side Google Tag Manager (sGTM) Deployment",
      "Meta Conversions API (CAPI) & GA4 Integration",
      "Custom Looker Studio Real-Time BI Dashboards",
      "Multi-Touch Attribution Modeling",
      "Cohort CAC-to-LTV Lifetime Value Analysis",
      "BigQuery & PostgreSQL Marketing Data Warehousing"
    ],
    tools: ["Google Tag Manager", "GA4", "Meta CAPI", "Looker Studio", "BigQuery", "PostgreSQL"],
    caseMetric: "100% Signal Fidelity",
    caseBrand: "Multi-Location Enterprise Group",
    faqs: [
      { q: "Why is Server-Side tracking necessary in 2026?", a: "Server-side tracking bypasses browser ad blockers, avoids cookie expiration limits, and provides Meta and Google algorithms with 100% accurate conversion data." }
    ]
  }
};

// Aliases
serviceCatalog["seo-growth"] = serviceCatalog["enterprise-seo"];
serviceCatalog["paid-media"] = serviceCatalog["google-ads-ppc"];
serviceCatalog["analytics"] = serviceCatalog["ga4-server-side-tracking"];
serviceCatalog["app-marketing"] = serviceCatalog["app-store-optimization"];
serviceCatalog["cro-conversion-optimization"] = serviceCatalog["website-design"];
serviceCatalog["digital-pr-outreach"] = serviceCatalog["content-marketing"];

// -----------------------------------------------------------------------------
// CASE STUDIES CATALOG
// -----------------------------------------------------------------------------
export const caseStudyCatalog = {
  "veloura-organics-d2c-skincare": {
    brand: "Veloura Organics (D2C Skincare)",
    metric: "4.8x ROAS",
    result: "Scaled Monthly Revenue to ₹1.8 Cr with 4.8x ROAS",
    channel: "Meta Ads + UGC Video Sprints + WhatsApp Retention",
    detail: "Veloura Organics had hit a performance plateau at ₹32L/month with a 1.9x ROAS. We overhauled their creative engine with 8 weekly creator-led UGC reels, deployed sub-second React landing pages, and implemented automated WhatsApp cart abandonment sequences. Within 120 days, monthly revenue scaled to ₹1.8 Crore while ROAS surged to 4.8x.",
    challenge: "High customer acquisition costs on Meta Ads and low mobile conversion rates on an unoptimized Shopify theme.",
    execution: "Produced 32 creator video ad hooks, built sub-second product bundle pages, and deployed server-side Meta CAPI for precise attribution.",
    results: [
      { metric: "₹1.8 Cr", label: "Monthly Revenue (up from ₹32L)" },
      { metric: "4.8x", label: "Blended Return on Ad Spend (ROAS)" },
      { metric: "-42%", label: "Reduction in Customer Acquisition Cost" },
      { metric: "28%", label: "Repeat Purchase Rate via WhatsApp API" }
    ],
    quote: "Get Into Feed transformed our digital customer acquisition. In 4 months, our organic traffic tripled, and our Meta ad spend scaled profitably to ₹50L/month with a 4.8x ROAS. They operate like true growth partners.",
    quoteAuthor: "Ananya Sharma, Co-Founder & CMO"
  },
  "finscale-bfsi-loans": {
    brand: "FinScale Lending (BFSI & Fintech)",
    metric: "+340% Leads",
    result: "+340% Inbound Loan Applications & -46% CAC",
    channel: "Enterprise SEO + Core Web Vitals + Programmatic Hubs",
    detail: "FinScale was spending over ₹2,400 per loan enquiry on Google Ads. We engineered 450+ programmatic high-intent keyword hubs centered on loan calculators and eligibility tools, earning #1 rankings for high-volume commercial terms across India. Inbound organic applications grew by 340%, reducing blended CAC by 46%.",
    challenge: "Intense paid search competition driving commercial loan CPCs above ₹180 per click.",
    execution: "Developed interactive loan comparison calculators with programmatic Schema markup, optimized Core Web Vitals, and earned tier-1 fintech PR backlinks.",
    results: [
      { metric: "+340%", label: "Increase in Organic Loan Enquiries" },
      { metric: "-46%", label: "Reduction in Blended Customer Acquisition Cost" },
      { metric: "#1 to #3", label: "Google Rankings for 220+ High-Intent Keywords" },
      { metric: "₹45L/mo", label: "Saved in Paid Search Bidding Costs" }
    ],
    quote: "Unlike traditional agencies that send vanity metric reports, Get Into Feed speaks revenue and unit economics. Their enterprise SEO architecture unlocked 340% growth in qualified inbound loan applications.",
    quoteAuthor: "Vikramaditya Mehta, Head of Growth"
  },
  "edvance-academy-edtech": {
    brand: "EdVance Academy (EdTech Platform)",
    metric: "18.4K Admissions",
    result: "18,400+ Paid Student Enrollments at 3.9x ROI",
    channel: "Google Search + Performance Max + WhatsApp Funnels",
    detail: "EdVance needed to scale student enrollments across 12 certification courses without inflating lead costs. We structured targeted Google Search and Performance Max campaigns for high-intent career switchers, paired with localized student video testimonials and 1-click WhatsApp counseling funnels.",
    challenge: "High lead drop-off rates on long application forms and unorganized search keyword structures.",
    execution: "Restructured Google Ads by career intent, deployed sub-second React landing pages, and implemented automated WhatsApp counseling follow-ups.",
    results: [
      { metric: "18,400+", label: "Paid Student Enrollments Completed" },
      { metric: "3.9x", label: "Overall Marketing Return on Investment (ROI)" },
      { metric: "+212%", label: "Increase in Admission Enquiries" },
      { metric: "68%", label: "Counseling Show-Up Rate via WhatsApp" }
    ],
    quote: "Their speed of execution is unmatched in India. From sub-second React landing pages to weekly creative testing sprints, our CAC dropped by 38% in 60 days. Highest recommendation.",
    quoteAuthor: "Rohan Deshmukh, VP Marketing"
  },
  "medihealth-super-specialty": {
    brand: "MediHealth Super Specialty (Healthcare)",
    metric: "+280% Bookings",
    result: "+280% Verified Doctor Appointments Booked",
    channel: "Local Map Pack SEO + Hyperlocal Google Ads",
    detail: "MediHealth operated 14 hospital centers across Delhi-NCR and Bengaluru but struggled with local search visibility. We optimized local Google Business Profiles, built localized doctor specialty pages with appointment booking schemas, and ran hyperlocal search campaigns, surging OPD appointments by 280%.",
    challenge: "Low local search visibility across competing private healthcare hospital networks.",
    execution: "Dominated Google 3-Pack rankings for 40+ medical specialties, verified reviews velocity, and deployed localized click-to-call Google Ads.",
    results: [
      { metric: "+280%", label: "Increase in Verified Doctor Appointments" },
      { metric: "#1 Rank", label: "In Google Map Pack across 14 Locations" },
      { metric: "12,500+", label: "Monthly Patient Inbound Calls Generated" },
      { metric: "4.8★", label: "Average Patient Review Rating on Google" }
    ],
    quote: "Get Into Feed's local search domination strategy filled our hospital OPD schedules across 14 branches. Truly remarkable execution.",
    quoteAuthor: "Dr. Arvind Rao, Medical Director"
  }
};

// -----------------------------------------------------------------------------
// LOCATION HUBS CATALOG (GET INTO FEED REGIONAL HUBS)
// -----------------------------------------------------------------------------
export const locationCatalog = {
  "bengaluru": {
    city: "Bengaluru (HQ)",
    title: "Best SEO & Digital Marketing Agency in Bengaluru",
    address: "Indiranagar 100ft Road & HSR Layout Sector 4, Bengaluru, Karnataka 560038",
    phone: "+91-98765-43210",
    email: "bengaluru@getintofeed.com",
    overview: "Powering enterprise SEO, AI search discovery (GEO), and performance marketing for Bengaluru's top tech startups, D2C unicorns, and enterprises.",
    clients: ["Veloura Organics", "EdVance Academy", "FinScale Lending"],
    kpi: "+273% Organic Traffic Growth in South India"
  },
  "mumbai": {
    city: "Mumbai Hub",
    title: "Best SEO & Digital Marketing Agency in Mumbai",
    address: "Bandra Kurla Complex (BKC) & Lower Parel, Mumbai, Maharashtra 400051",
    phone: "+91-98765-43210",
    email: "mumbai@getintofeed.com",
    overview: "Delivering profit-tied paid media, enterprise SEO, and digital PR for Mumbai's leading BFSI, Fintech, and Bollywood entertainment brands.",
    clients: ["FinScale Loans", "Apollo Hospitals Group", "Veloura"],
    kpi: "₹120+ Cr Revenue Driven in Mumbai Metro"
  },
  "delhi-ncr": {
    city: "Delhi-NCR Hub",
    title: "Best SEO & Digital Marketing Agency in Delhi-NCR (Gurugram)",
    address: "DLF Cyber City, Building 10, Tower B, Gurugram, Haryana 122002",
    phone: "+91-98765-43210",
    email: "delhi@getintofeed.com",
    overview: "Engineering search dominance, local Google Map Pack rankings, and Performance Max campaigns for Delhi-NCR's top healthcare and retail brands.",
    clients: ["MediHealth Super Specialty", "Airtel Enterprise", "Hero Fincorp"],
    kpi: "+280% Inbound Consultations in North India"
  },
  "pune": {
    city: "Pune Hub",
    title: "Best SEO & Digital Marketing Agency in Pune",
    address: "Kalyani Nagar & Viman Nagar Tech Center, Pune, Maharashtra 411006",
    phone: "+91-98765-43210",
    email: "pune@getintofeed.com",
    overview: "Scaling B2B SaaS demand generation and sub-second React web development for Pune's fastest growing tech companies.",
    clients: ["EdVance Group", "B2B SaaS Clients"],
    kpi: "4.8x Average Client ROAS in Pune"
  }
};

export function resolveService(slug, fallbackServices = []) {
  const clean = slugify(slug);
  if (serviceCatalog[clean]) return serviceCatalog[clean];

  for (const [key, val] of Object.entries(serviceCatalog)) {
    if (clean.includes(key) || key.includes(clean)) return val;
  }

  const match = fallbackServices.find((s) => slugify(s.title) === clean);
  if (match) {
    return {
      title: match.title,
      icon: Search,
      label: match.title,
      outcome: match.description,
      description: match.description,
      bottleneck: "Overcoming digital fragmentation to build predictable customer acquisition.",
      framework: [
        { step: "01. Diagnostic Audit", detail: "Comprehensive audit of your current channels, competitors, and conversion funnel." },
        { step: "02. Strategic Execution", detail: "Deploying high-impact campaigns and modern technical architecture." },
        { step: "03. Velocity & Scaling", detail: "Iterative weekly testing to eliminate waste and compound winning assets." },
        { step: "04. Revenue Attribution", detail: "Real-time tracking of leads and revenue tied to commercial growth." }
      ],
      points: Array.isArray(match.points) ? match.points : (match.points || "").split(","),
      tools: ["Google Search Console", "Ahrefs", "GA4", "Meta Ads", "React"],
      caseMetric: "+273% Growth",
      caseBrand: "Enterprise Client Portfolio",
      faqs: [
        { q: "How quickly does this service start delivering results?", a: "Initial performance improvements are observed within 14 to 30 days, with compounding growth scaling significantly in 60 to 90 days." }
      ]
    };
  }

  return serviceCatalog["enterprise-seo"];
}

export function resolveCaseStudy(slug, fallbackStudies = []) {
  const clean = slugify(slug);
  if (caseStudyCatalog[clean]) return caseStudyCatalog[clean];

  for (const [key, val] of Object.entries(caseStudyCatalog)) {
    if (clean.includes(key) || key.includes(clean)) return val;
  }

  const match = fallbackStudies.find((s) => slugify(s.brand) === clean);
  if (match) {
    return {
      brand: match.brand,
      metric: match.metric || "+212%",
      result: match.result,
      channel: match.channel,
      detail: match.detail,
      challenge: "Scaling customer acquisition while maintaining tight unit economics and ROAS controls.",
      execution: "Full-funnel digital marketing strategy combining high-intent search, creative ad sprints, and sub-second web experiences.",
      results: [
        { metric: match.metric || "+212%", label: "Primary Growth Multiplier" },
        { metric: "4.8x", label: "Blended Return on Investment" },
        { metric: "-38%", label: "Customer Acquisition Cost Reduction" }
      ],
      quote: "Get Into Feed delivered measurable revenue growth that exceeded our commercial milestones.",
      quoteAuthor: "Leadership Team"
    };
  }

  return caseStudyCatalog["veloura-organics-d2c-skincare"];
}

// -----------------------------------------------------------------------------
// SERVICE DETAIL PAGE TEMPLATE
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// SERVICE DETAIL PAGE TEMPLATE (MATCHING 7-PAGE PDF 1-TO-1 & BACKEND CONNECTED)
// -----------------------------------------------------------------------------
export function ServiceDetail({ service, onNavigate }) {
  const currentService = service || {
    title: "PPC & Performance Paid Marketing",
    icon: MousePointerClick,
    kpi: "3.9x ROI / 18.4K Leads",
    description: "Partner with us, the leading digital marketing & PPC agency in India, for campaigns that deliver measurable results, qualified leads, and higher ROI."
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: currentService.title,
    message: "",
    whatsapp: true,
    agreeTerms: true
  });
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadResult, setLeadResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeFaq, setActiveFaq] = useState(0);

  // Dynamic Sub-Services matching the active service domain
  const getSubServices = (svc) => {
    const title = (svc.title || "").toLowerCase();
    if (title.includes("seo") || title.includes("search engine")) {
      return [
        {
          title: "Technical SEO & Crawl Topology",
          desc: "Eliminate crawl budget waste, fix Core Web Vitals, and ensure Googlebot instantly indexes commercial landing pages.",
          icon: Search
        },
        {
          title: "Programmatic Keyword Hubs",
          desc: "Deploy thousands of high-intent programmatic landing pages targeting long-tail commercial queries and buyer keywords.",
          icon: Layers
        },
        {
          title: "Generative Engine Optimization (GEO)",
          desc: "Optimize brand entity graphs and schema markup to capture #1 recommendations on ChatGPT, Gemini, and Perplexity.",
          icon: Sparkles
        },
        {
          title: "Local & Google Map Pack SEO",
          desc: "Dominate Google 3-Pack and nearby voice searches across Bengaluru, Mumbai, Delhi-NCR, Pune, and regional hubs.",
          icon: MapPin
        },
        {
          title: "Ecommerce & Product Schema",
          desc: "Rich snippet schemas, product category hubs, and facet navigation designed to drive high-converting ecommerce sales.",
          icon: ShoppingBag
        },
        {
          title: "Tier-1 Digital PR & Authority Links",
          desc: "Build unassailable domain authority with verified editorial mentions in top Indian business publications and media.",
          icon: Megaphone
        }
      ];
    }

    if (title.includes("web") || title.includes("design") || title.includes("development") || title.includes("cro")) {
      return [
        {
          title: "Sub-Second React & Next.js Web",
          desc: "Modern ultra-fast headless web architectures optimized for 95+ Google PageSpeed and sub-second Largest Contentful Paint (LCP).",
          icon: Code
        },
        {
          title: "High-Converting CRO Funnels",
          desc: "Data-driven UI/UX conversion rate optimization, micro-interactions, and A/B tested checkout flows that increase lead velocity.",
          icon: LineChart
        },
        {
          title: "Enterprise Brand UI/UX Design",
          desc: "Clean, elegant, responsive interfaces crafted to establish enterprise authority and deliver frictionless customer experiences.",
          icon: Palette
        },
        {
          title: "Server-Side Telemetry & CAPI",
          desc: "Full-funnel attribution tracking with Meta Conversions API, Google Tag Manager Server Container, and GA4 custom events.",
          icon: BarChart3
        },
        {
          title: "Headless CMS & Dynamic Stores",
          desc: "Scalable content management systems tailored for fast editorial publishing and seamless e-commerce transactions.",
          icon: Layers
        },
        {
          title: "Enterprise Web Security & SLA",
          desc: "Bank-grade SSL/TLS encryption, automated daily cloud backups, and 99.99% uptime guarantee with Cloudflare Edge CDN.",
          icon: ShieldCheck
        }
      ];
    }

    // Default Performance / PPC & Digital Marketing
    return [
      {
        title: "Search Advertising & Google Ads",
        desc: "High-intent Google Search and Performance Max campaigns optimized with smart bidding to capture active buyers at the lowest CAC.",
        icon: Search
      },
      {
        title: "Display & GDN Advertising",
        desc: "Reach millions of qualified prospects across top web publishers and Google Display Network with high-impact visual banners.",
        icon: Layout
      },
      {
        title: "Paid Social Media Advertising",
        desc: "Scale customer acquisition across Instagram, Facebook, LinkedIn, YouTube, and Twitter with hyper-targeted audience funnels.",
        icon: Megaphone
      },
      {
        title: "Dynamic Retargeting & Remarketing",
        desc: "Recover abandoned carts and re-engage warm visitors with personalized multi-channel ads that maximize conversion rates.",
        icon: RotateCw
      },
      {
        title: "Google Shopping & Product Feeds",
        desc: "AI-driven product feed optimization and shopping bid management designed to maximize ROAS for direct-to-consumer ecommerce.",
        icon: ShoppingBag
      },
      {
        title: "Generative AI (GEO) Search",
        desc: "Get cited and recommended directly inside ChatGPT, Google Gemini, and Perplexity when buyers research your category.",
        icon: Sparkles
      }
    ];
  };

  const subServices = getSubServices(currentService);

  const industries = [
    { name: "BFSI & FinTech", desc: "Our search architects drive customer trust and high-ticket lead generation for India's leading banks, lending platforms, and wealth managers.", icon: "🏦" },
    { name: "Higher Education & EdTech", desc: "Attract the highest intent students and drive qualified course enrollments with precision search campaigns and localized campus funnels.", icon: "🎓" },
    { name: "Healthcare & Hospitals", desc: "Connect patients with super-specialty doctors at their moment of need. Proven record of +279% increase in verified doctor appointments.", icon: "🏥" },
    { name: "B2B SaaS & Enterprise", desc: "Generate enterprise pipeline and shorten B2B sales cycles with account-based marketing, programmatic search, and executive thought leadership.", icon: "🏢" },
    { name: "D2C Brands & Ecommerce", desc: "Scale store revenue and first-time customer acquisition with high-ROAS performance ads, product schema, and sub-second React landing pages.", icon: "🛒" },
    { name: "Insurance & Wealth", desc: "Build digital authority, boost policy inquiries, and lower customer acquisition costs through high-intent multi-channel search marketing.", icon: "🛡️" }
  ];

  const challenges = [
    { title: "Acquiring popular ad spaces without exhausting the budget", desc: "Our advanced algorithmic bidding strategies secure prime search real estate while cutting cost per acquisition by up to 38%." },
    { title: "Publishing relevant ads without incurring ad fatigue", desc: "We deploy weekly creative sprints with dynamic hooks and format rotation to keep campaigns consistently fresh and high-converting." },
    { title: "Driving targeted traffic and getting meaningful clicks", desc: "Through first-party audience modeling and AI-driven intent mining, we attract high-ticket decision-makers who actually buy." },
    { title: "Optimizing landing pages for minimal bounce rate and maximum conversions", desc: "We engineer sub-second page load speeds, clear visual hierarchy, and frictionless inquiry forms that increase conversion rates." },
    { title: "Creating impactful, high-converting copy in limited ad real estate", desc: "Our specialized direct-response copywriters craft magnetic value propositions that trigger immediate action from target prospects." },
    { title: "Continuously adapting campaigns with latest algorithm updates", desc: "Our team conducts real-time weekly telemetry audits to ensure your campaigns stay ahead of Google, Meta, and AI algorithm shifts." }
  ];

  const competitiveFeatures = [
    { title: "Genuine Enterprise Capabilities", desc: "Get Into Feed is the premier choice for enterprise brands requiring complex, multi-million dollar campaign architectures managed with military precision." },
    { title: "Complete Search Landscape Domination", desc: "From Google Universal Search, Map Pack, and YouTube Video to ChatGPT, Gemini, and Perplexity AI citations, we ensure total category visibility." },
    { title: "Portfolio of Marquee Enterprise Brands", desc: "Trusted by India's top leaders in BFSI, Healthcare, Education, and eCommerce—delivering audited compounding growth year after year." },
    { title: "Obsessed with Measurable Revenue Numbers", desc: "We partner on Annual Operating Plans (AOPs) and deliver verified commercial milestones with full revenue and pipeline attribution." },
    { title: "Vertical-Specific Strategic Depth", desc: "Tailored compliance-ready playbooks for BFSI, healthcare NABH guidelines, EdTech admission cycles, and high-velocity D2C sales." },
    { title: "Dedicated Senior Strategic Growth Pods", desc: "Direct access to senior search engineers, performance media buyers, and creative strategists with zero middle-management bureaucracy." }
  ];

  const serviceFaqs = currentService.faqs && currentService.faqs.length > 0 ? [
    ...currentService.faqs,
    { q: `Is ${currentService.title} suitable for my business size?`, a: "Yes, our tailored frameworks scale from high-growth mid-market ventures to large enterprises with complex multi-location and multi-brand requirements." },
    { q: "How quickly do we start seeing measurable growth in pipeline?", a: "Paid campaigns generate qualified inbound inquiries within the first 7 to 14 days. Organic SEO and Generative Engine Optimization (GEO) compound over 60 to 90 days, delivering sustained long-term organic dominance." },
    { q: "What analytics and attribution reports will I receive?", a: "You receive access to a 24/7 custom Looker Studio telemetry dashboard tracking qualified leads, cost per acquisition (CPA), return on ad spend (ROAS), and keyword ranking velocity in real time." }
  ] : [
    { q: `Is ${currentService.title} suitable for my business?`, a: "Yes, our strategic frameworks are tailored to your specific industry economics, target customer profile, and commercial revenue objectives." },
    { q: "Why should I invest in paid & organic search marketing together?", a: "Combining paid and organic search allows your brand to capture over 65% of the total search engine results page (SERP) real estate, multiplying trust and lowering overall blended customer acquisition costs." },
    { q: "What are the most common pitfalls you prevent?", a: "We eliminate wasted ad spend on broad untargeted keywords, prevent attribution blindness with server-side CAPI tracking, and fix slow landing pages that bleed conversion revenue." },
    { q: "How long does it take to see results?", a: "Paid performance ads produce qualified leads within 7-14 days. Organic search moats and Generative AI optimization compound exponentially across 60-90 days." },
    { q: "Where will my campaigns and brand assets be displayed?", a: "Your brand is positioned across Google Search, Google Display Network (GDN), YouTube, Meta (Instagram & Facebook), LinkedIn B2B feeds, and AI Search Overviews (ChatGPT & Gemini)." }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.agreeTerms) {
      setErrorMsg("Please accept the Terms of Service & Privacy Policy.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          service: currentService.title,
          source: `service_detail_${currentService.title}`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLeadResult(data);
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || "Failed to submit request.");
      }
    } catch {
      setErrorMsg("Unable to connect to the backend server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="service-detail-full-page-view">
      {/* 1. HERO BANNER */}
      <section className="sd-hero-banner-section">
        <div className="sd-hero-container">
          <div className="sd-hero-left">
            <div className="sd-hero-top-badge">
              <Sparkles size={14} color="#f59e0b" />
              <span>🏆 #1 Rated Digital Marketing & Performance Agency in India</span>
            </div>
            <h1>Increase ROI with India's Leading {currentService.title} Agency</h1>
            <p>
              Partner with us, the leading performance & AI-first marketing company in India, for {currentService.title.toLowerCase()} that deliver measurable results, qualified leads, and higher ROI. Backed by data-driven insights and years of expertise, we help brands grow through transparent, ROI-focused campaigns that build long-term trust and performance.
            </p>
            <div className="sd-hero-btn-row">
              <button type="button" onClick={() => onNavigate("/contact")} className="sd-hero-orange-btn">
                Speak to an Expert →
              </button>
              <button type="button" onClick={() => onNavigate("/services")} className="sd-hero-outline-btn">
                Our Services →
              </button>
            </div>
          </div>

          <div className="sd-hero-right-visual">
            <div className="sd-hero-nodes-card">
              <div className="sd-nodes-card-title">
                <span className="live-pulse-dot" />
                <strong>Growth Execution Engine</strong>
              </div>
              <div className="sd-node-badge node-1">
                <span className="node-icon">⚡</span>
                <div>
                  <strong>AI Automated Bidding</strong>
                  <small>Real-time ROAS optimization</small>
                </div>
              </div>
              <div className="sd-node-badge node-2">
                <span className="node-icon">🎨</span>
                <div>
                  <strong>Sharp Creatives</strong>
                  <small>Dynamic ad fatigue defense</small>
                </div>
              </div>
              <div className="sd-node-badge node-3">
                <span className="node-icon">🎯</span>
                <div>
                  <strong>Audience Insights</strong>
                  <small>First-party intent telemetry</small>
                </div>
              </div>
              <div className="sd-node-stat-pill">
                <strong>{currentService.kpi || "+273% Verified Growth"}</strong>
                <span>• 500+ Active Campaigns Managed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMB */}
      <div className="sd-breadcrumb-strip">
        <div className="sd-container">
          <button type="button" onClick={() => onNavigate("/")} className="as-link">Home</button>
          <span>›</span>
          <button type="button" onClick={() => onNavigate("/services")} className="as-link">Services</button>
          <span>›</span>
          <span className="active-crumb">{currentService.title}</span>
        </div>
      </div>

      {/* 3. MAIN TWO-COLUMN LAYOUT */}
      <section className="sd-main-body-section">
        <div className="sd-container sd-two-col-grid">
          {/* LEFT 65% COLUMN */}
          <div className="sd-left-content-col">
            {/* KEY ACHIEVEMENTS BOX */}
            <div className="sd-achievements-checklist-box">
              <div className="achieve-item">
                <CheckCircle2 size={20} className="achieve-check" />
                <span>Delivered +58% average growth in conversions across clients' campaigns in FY25</span>
              </div>
              <div className="achieve-item">
                <CheckCircle2 size={20} className="achieve-check" />
                <span>MCube Award - Best Digital Marketing Campaign for Enterprise Growth FY25</span>
              </div>
              <div className="achieve-item">
                <CheckCircle2 size={20} className="achieve-check" />
                <span>Drivers of Digital Awards - Best Search & Performance Marketing Campaign FY25</span>
              </div>
            </div>

            {/* INTRO NARRATIVE */}
            <div className="sd-narrative-block">
              <p>
                Consistently ranked among the best digital performance agencies in India, <strong>Get Into Feed</strong> has helped hundreds of brands across sectors build campaigns that cut waste, increase visibility, and deliver predictable growth.
              </p>
              <p>
                Our mission is simple: to help brands achieve maximum ROI through data-led search campaigns that connect the right audience with your brand at the right time.
              </p>
              <p>
                With years of proven experience, we craft conversion-focused strategies that don't just drive traffic but turn clicks into qualified leads and measurable revenue growth.
              </p>
            </div>

            {/* TRUSTED AGENCY SECTION */}
            <div className="sd-trusted-agency-box">
              <h2>Trusted Agency Delivering Consistent Growth Across Industries</h2>
              <div className="sd-trusted-split">
                <div className="sd-trusted-text">
                  <p>
                    Our team of experts has been managing search & performance campaigns across the Education, BFSI, eCommerce, and Healthcare industries for years. This experience helps us design custom strategies that deliver measurable results for every business.
                  </p>
                  <p>
                    As a certified <strong>Google Premier Partner</strong>, we combine data-driven insights with industry-leading tools to lower CPA, maximize ROI, and drive consistent growth for our clients. In fact, we achieved a 58% average increase in leads in FY25. Discover more of our proven results in the latest Digital Report Card.
                  </p>
                </div>
                <div className="sd-trusted-img-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                    alt="Get Into Feed Strategy Team"
                  />
                  <div className="img-partner-badge">
                    <span>★ Google Premier Partner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GROW YOUR BUSINESS FASTER (6 SUB-SERVICES GRID) */}
            <div className="sd-sub-services-block">
              <h2>Grow Your Business Faster with Our Advertising Services</h2>
              <p className="sub-svc-lead">
                We offer a full suite of management services to improve your digital advertising potential:
              </p>

              <div className="sd-sub-services-grid">
                {subServices.map((sub, i) => {
                  const Icon = sub.icon;
                  return (
                    <div key={i} className="sd-sub-card">
                      <div className="sd-sub-card-icon">
                        <Icon size={24} />
                      </div>
                      <h3>{sub.title}</h3>
                      <p>{sub.desc}</p>
                      <button type="button" onClick={() => onNavigate("/contact")} className="sd-sub-arrow-link">
                        Get Started →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INLINE DISCOVERY BANNER */}
            <div className="sd-inline-discovery-banner">
              <div className="sd-discovery-content">
                <h3>Discover What Your Customers Search For</h3>
                <p>Get insights on evolving customer behaviour, high volume keywords, search trends, and more.</p>
              </div>
              <button type="button" onClick={() => onNavigate("/blog")} className="sd-discovery-btn">
                Explore More →
              </button>
            </div>

            {/* INCREASING ROI: THE GET INTO FEED WAY (3 STEPS) */}
            <div className="sd-process-way-block">
              <h2>Increasing ROI: The Get Into Feed Way</h2>
              <p className="process-lead">
                We believe digital marketing is more than just buying ads, it's about buying results. Our services drive measurable ROI by combining data insights with advanced strategies to reach the right audience at the right time.
              </p>

              <div className="sd-process-three-grid">
                <div className="sd-step-box">
                  <span className="step-num">1</span>
                  <h4>Strategic Planning and Campaign Execution</h4>
                  <p>Our team first conducts an in-depth analysis of your industry, target audience, and objectives to attract prospects most likely to convert.</p>
                </div>

                <div className="sd-step-box">
                  <span className="step-num">2</span>
                  <h4>Paid Campaign Optimization for Better Results</h4>
                  <p>Once launched, we optimize campaigns by refining ad copies, improving landing pages, and adjusting bidding strategies to maximize ROAS.</p>
                </div>

                <div className="sd-step-box">
                  <span className="step-num">3</span>
                  <h4>Performance Reporting and Continuous Improvement</h4>
                  <p>With regular performance tracking, we provide actionable insights through dynamic dashboards that include metrics like CTR, ROAS, CPC, and CPA.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 35% STICKY COLUMN */}
          <div className="sd-right-sidebar-col">
            {/* STICKY LIVE BACKEND LEAD CAPTURE FORM */}
            <div className="sd-sticky-lead-card">
              <div className="sd-form-header">
                <h3>Request Growth Proposal</h3>
                <p>Speak directly with our senior search & performance strategists.</p>
              </div>

              {submitted ? (
                <div className="sd-form-success">
                  <CheckCircle2 size={40} color="#16a34a" />
                  <h4>Inquiry Received!</h4>
                  <p>
                    Reference ID: <strong>#{leadResult?.leadId?.slice(0, 8).toUpperCase() || "GIF-2026"}</strong>
                  </p>
                  <p>Our team will prepare a custom growth audit and contact you within 2 hours.</p>
                  <a
                    href="https://wa.me/918810356950"
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-instant-btn"
                  >
                    💬 WhatsApp Instant Chat
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="sd-form-body">
                  {errorMsg && (
                    <div className="form-error-banner">
                      <AlertCircle size={16} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="sd-input-field">
                    <label>Your Name *</label>
                    <input
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="sd-input-field">
                    <label>Email Id *</label>
                    <input
                      required
                      type="email"
                      placeholder="vikram@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="sd-input-field">
                    <label>Mobile No *</label>
                    <input
                      required
                      placeholder="+91-8810356950"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className="sd-input-field">
                    <label>Selected Service *</label>
                    <input
                      disabled
                      value={currentService.title}
                      className="sd-disabled-input"
                    />
                  </div>

                  <div className="sd-input-field">
                    <label>Type Your Message</label>
                    <textarea
                      rows={2}
                      placeholder="Describe your brand & goals..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <div className="sd-checkbox-field">
                    <input
                      type="checkbox"
                      id="sd-terms"
                      checked={form.agreeTerms}
                      onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                    />
                    <label htmlFor="sd-terms">
                      By registering here, I agree to Get Into Feed's Terms of Service and Privacy Policy.
                    </label>
                  </div>

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
                        style={{ width: "24px", height: "24px" }}
                      />
                      <span>reCAPTCHA</span>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} className="sd-form-submit-btn">
                    {submitting ? "Submitting..." : "Submit Now →"}
                  </button>
                </form>
              )}
            </div>

            {/* GREEN CASE STUDIES SIDEBAR CARD */}
            <div className="sd-green-cta-card">
              <h3>Experience Results That Matter!</h3>
              <p>Discover how we boosted our clients' search visibility and business growth.</p>
              <button type="button" onClick={() => onNavigate("/work")} className="sd-green-btn">
                View Case Studies →
              </button>
            </div>

            {/* KEY CLIENTS LOGOS */}
            <div className="sd-clients-sidebar-card">
              <h4>Our Key Clients</h4>
              <div className="sd-clients-logo-grid">
                <span className="client-name-chip">Apollo 24|7</span>
                <span className="client-name-chip">DCB Bank</span>
                <span className="client-name-chip">Bajaj Finserv</span>
                <span className="client-name-chip">Airtel Payments</span>
                <span className="client-name-chip">Tata 1mg</span>
                <span className="client-name-chip">Max Life</span>
              </div>
            </div>

            {/* SEARCH TRENDS SIDEBAR BADGE */}
            <div className="sd-report-sidebar-card">
              <h4>Get Into Feed's Search Trends Reports</h4>
              <p>Get the most valuable search-related insights about leading brands, trending keywords, and city-level metrics.</p>
              <button type="button" onClick={() => onNavigate("/blog")} className="sd-report-link">
                Explore Now →
              </button>
            </div>

            {/* NEWS & EVENTS SIDEBAR BADGE */}
            <div className="sd-news-sidebar-card">
              <h4>Stay Up to Date with Our News & Events!</h4>
              <p>Get updates on industry insights, upcoming events, and key company announcements, all in one place.</p>
              <button type="button" onClick={() => onNavigate("/about")} className="sd-news-orange-btn">
                Explore Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INDUSTRIES WE SERVE */}
      <section className="sd-industries-section">
        <div className="sd-container">
          <div className="sd-section-header">
            <h2>Industries We Serve</h2>
            <p>Founded in 2026 as India's premier AI-first digital growth studio, we deliver transformational search and revenue outcomes across key growth verticals, frequently delivering transformational growth to clients in these sectors.</p>
          </div>

          <div className="sd-industries-grid">
            {industries.map((ind, i) => (
              <div key={i} className="sd-industry-card">
                <div className="ind-icon-box">{ind.icon}</div>
                <h3>{ind.name}</h3>
                <p>{ind.desc}</p>
                <button type="button" onClick={() => onNavigate("/work")} className="ind-arrow-link">
                  Explore {ind.name} Strategy →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMMON CHALLENGES & SOLUTIONS */}
      <section className="sd-challenges-section">
        <div className="sd-container">
          <div className="sd-section-header">
            <h2>Our Solutions for Common Challenges That Yield Results</h2>
            <p>Digital marketing has its own challenges as it demands precise execution to balance budgets and deliver results. At Get Into Feed, we address these challenges with tailored, data-driven solutions:</p>
          </div>

          <div className="sd-challenges-grid">
            {challenges.map((c, i) => (
              <div key={i} className="sd-challenge-card">
                <div className="challenge-icon-circle">✓</div>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLIENT TESTIMONIALS */}
      <section className="sd-testimonials-section">
        <div className="sd-container">
          <div className="sd-testimonial-blue-box">
            <div className="test-header">
              <span>CLIENT TESTIMONIALS</span>
            </div>
            <div className="test-quote-body">
              <div className="test-brand-badge">Bajaj Health</div>
              <p>"I wanted to thank Get Into Feed for their exceptional support and quality strategies for our healthcare acquisition campaigns. Their technical search depth and proactive optimization delivered +279% growth in qualified consultations."</p>
              <div className="test-author-info">
                <strong>Sahana K</strong>
                <span>Manager (Marketing), Bajaj Health</span>
              </div>
            </div>
            <div className="test-footer-action">
              <button type="button" onClick={() => onNavigate("/about")} className="sd-view-all-orange-btn">
                View All Testimonials →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WORLD CLASS SERVICES & BIG STATS */}
      <section className="sd-world-class-section">
        <div className="sd-container">
          <div className="sd-section-header">
            <h2>World Class Services from Get Into Feed: Gain a Competitive Edge</h2>
            <p>Get Into Feed is a natural choice for enterprise brands looking for a top agentic AI marketing company, one that can manage the complexity of large-scale campaigns without compromising on performance or precision.</p>
          </div>

          <div className="sd-features-six-grid">
            {competitiveFeatures.map((f, i) => (
              <div key={i} className="sd-feature-item-card">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* 3 STAT BADGES */}
          <div className="sd-three-stat-badges-row">
            <div className="sd-stat-badge">
              <strong>300+</strong>
              <span>Digital Marketing Experts</span>
            </div>
            <div className="sd-stat-badge">
              <strong>~20</strong>
              <span>Years of Combined Experience</span>
            </div>
            <div className="sd-stat-badge">
              <strong>Certified</strong>
              <span>Google Premier Partner</span>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: "28px" }}>
            <button type="button" onClick={() => onNavigate("/about")} className="sd-view-more-orange-btn">
              View More Capabilities →
            </button>
          </div>
        </div>
      </section>

      {/* 8. CASE STUDIES */}
      <section className="sd-case-studies-section">
        <div className="sd-container">
          <div className="sd-section-header">
            <h2>Case Studies</h2>
            <p>For businesses evaluating performance agencies in India, proven ROAS figures and real client outcomes matter more than claims—which is why we let our case studies do the talking.</p>
          </div>

          <div className="sd-case-cards-three-grid">
            <div className="sd-case-study-card">
              <div className="case-stat-overlay-badge">+34% Leads</div>
              <span className="case-cat-tag">BFSI & Lending</span>
              <h4>34% Increase in Qualified Leads for DCB Bank, 15.88 ROAS</h4>
              <p style={{ fontSize: "0.84rem", color: "#64748b", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Restructured Google Search campaigns with high-intent negative keyword filtering and custom lead scoring.
              </p>
              <button type="button" onClick={() => onNavigate("/work")} className="case-outline-link">
                View Case Study →
              </button>
            </div>

            <div className="sd-case-study-card">
              <div className="case-stat-overlay-badge">-26% CPA</div>
              <span className="case-cat-tag">Home Improvement</span>
              <h4>PPC Case Study – Reduced Cost Per Acquisition by 26% for UK Countertops</h4>
              <p style={{ fontSize: "0.84rem", color: "#64748b", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Deployed automated value-based smart bidding and sub-second React landing page funnels.
              </p>
              <button type="button" onClick={() => onNavigate("/work")} className="case-outline-link">
                View Case Study →
              </button>
            </div>

            <div className="sd-case-study-card">
              <div className="case-stat-overlay-badge">+180% Bookings</div>
              <span className="case-cat-tag">Hospitality & Travel</span>
              <h4>Performance Search Case Study – Leading Luxury Hotel Chain in India</h4>
              <p style={{ fontSize: "0.84rem", color: "#64748b", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Captured seasonal booking surges with geo-targeted search ads and dynamic room rate extensions.
              </p>
              <button type="button" onClick={() => onNavigate("/work")} className="case-outline-link">
                View Case Study →
              </button>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: "28px" }}>
            <button type="button" onClick={() => onNavigate("/work")} className="sd-view-all-orange-btn">
              View All Case Studies →
            </button>
          </div>
        </div>
      </section>

      {/* 9. HOW IT WORKS */}
      <section className="sd-how-it-works-section">
        <div className="sd-container">
          <div className="sd-section-header">
            <h2>How Search & Performance Marketing Works for Your Business</h2>
            <p>SEO is the gold standard for establishing long-term trust and organic growth, but it's a marathon, not a sprint. Performance marketing services step in to deliver immediate impact sooner by giving you traffic and leads while your organic search strategy takes shape and takes hold.</p>
          </div>

          <div className="sd-how-works-checklist">
            <div className="how-check-item">
              <CheckCircle2 size={20} className="achieve-check" />
              <span>Reach users actively searching for your high-intent products or services</span>
            </div>
            <div className="how-check-item">
              <CheckCircle2 size={20} className="achieve-check" />
              <span>Utilize precision demographic, geographic, behavioral, and intent-based targeting</span>
            </div>
            <div className="how-check-item">
              <CheckCircle2 size={20} className="achieve-check" />
              <span>Continuously A/B test ad copies, visual creatives, and checkout funnels</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQS */}
      <section className="sd-faqs-section">
        <div className="sd-container">
          <div className="sd-section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Common questions regarding our strategy, deliverables, and onboarding process.</p>
          </div>

          <div className="sd-faqs-accordion">
            {serviceFaqs.map((faq, i) => (
              <div key={i} className={`sd-faq-row ${activeFaq === i ? "open" : ""}`}>
                <button
                  type="button"
                  className="sd-faq-q-btn"
                  onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                >
                  <span>{faq.q}</span>
                  <span className="sd-faq-toggle-sign">{activeFaq === i ? "✕" : "+"}</span>
                </button>
                {activeFaq === i && (
                  <div className="sd-faq-ans">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. NATIONWIDE PRESENCE */}
      <section className="sd-presence-links-section">
        <div className="sd-container">
          <h3>Our Nationwide Agency Hubs</h3>
          <p style={{ color: "#64748b", fontSize: "0.88rem", margin: "0 0 16px 0" }}>Connect with our senior growth architects at our regional offices:</p>
          <div className="presence-pills-row">
            <button type="button" onClick={() => onNavigate("/locations/delhi-ncr")}>📍 New Delhi HQ (Pitampura & Noida)</button>
            <button type="button" onClick={() => onNavigate("/locations/bengaluru")}>📍 Bengaluru Hub (Koramangala)</button>
            <button type="button" onClick={() => onNavigate("/locations/mumbai")}>📍 Mumbai Hub (BKC)</button>
            <button type="button" onClick={() => onNavigate("/locations/pune")}>📍 Pune Hub (Kalyani Nagar)</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// -----------------------------------------------------------------------------
// COMPREHENSIVE ENTERPRISE CASE STUDY DETAIL PAGE (/work/:id)
// -----------------------------------------------------------------------------
export function WorkDetail({ study, onNavigate }) {
  const currentStudy = study || caseStudyCatalog["veloura-organics-d2c-skincare"];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [leadId, setLeadId] = useState("");

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!recaptchaVerified) {
      setErrorMsg("Please verify that you are not a robot (Google reCAPTCHA).");
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
          service: `Case Study Strategy Inquiry (${currentStudy.brand})`,
          message: `Company: ${form.company} | Note: ${form.message}`,
          source: "case_study_detail_sidebar"
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLeadId(data.leadId || "GIF-CS-2026");
        setSubmitted(true);
      } else {
        setErrorMsg(data.message || "Failed to submit inquiry. Please try again.");
      }
    } catch {
      setErrorMsg("Unable to connect to backend server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const otherStudies = Object.entries(caseStudyCatalog)
    .filter(([key, s]) => s.brand !== currentStudy.brand)
    .slice(0, 3);

  return (
    <div className="work-detail-full-page-view">
      {/* 1. HERO BANNER */}
      <section className="work-detail-hero-section">
        <div className="work-detail-container">
          <button
            type="button"
            onClick={() => onNavigate("/work")}
            className="work-detail-back-btn"
          >
            <ArrowLeft size={16} /> Back to All Case Studies
          </button>

          <div className="work-detail-channel-badge">
            <Sparkles size={14} color="#38bdf8" />
            <span>{currentStudy.channel || "Full-Funnel Growth Engineering"}</span>
          </div>

          <h1>{currentStudy.brand}</h1>
          <p className="work-detail-result-title">{currentStudy.result}</p>

          {/* 4-STAT HIGHLIGHT RIBBON */}
          <div className="work-detail-kpis-ribbon">
            {(currentStudy.results || []).map((r, i) => (
              <div key={i} className="work-kpi-ribbon-item">
                <strong>{r.metric}</strong>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SNAPSHOT STRIP */}
      <section className="work-snapshot-strip-section">
        <div className="work-detail-container">
          <div className="work-snapshot-grid">
            <div className="snapshot-cell">
              <span className="snapshot-label">Client Partner</span>
              <strong>{currentStudy.brand}</strong>
            </div>
            <div className="snapshot-cell">
              <span className="snapshot-label">Growth Objective</span>
              <strong>Scale ROAS & Lower CAC</strong>
            </div>
            <div className="snapshot-cell">
              <span className="snapshot-label">Execution Model</span>
              <strong>120-Day Growth Sprint</strong>
            </div>
            <div className="snapshot-cell">
              <span className="snapshot-label">Core Strategy</span>
              <strong>{currentStudy.channel?.split("+")[0] || "Omnichannel Performance"}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN BODY & TWO-COLUMN BREAKDOWN */}
      <section className="work-detail-body-section">
        <div className="work-detail-container">
          <div className="work-detail-split-grid">
            {/* LEFT CONTENT COLUMN */}
            <div className="work-detail-left-col">
              {/* THE CHALLENGE / BOTTLENECK */}
              <div className="case-content-block">
                <span className="case-block-kicker">01. THE INITIAL BOTTLENECK</span>
                <h2>The Challenge & Growth Barrier</h2>
                <div className="case-challenge-alert-box">
                  <div className="alert-red-line" />
                  <p>{currentStudy.challenge || currentStudy.detail}</p>
                </div>
                <p className="case-narrative-para">
                  Prior to partnering with Get Into Feed, the brand was constrained by rising Customer Acquisition Costs (CAC), ad fatigue on static creatives, and high drop-off rates on slow mobile checkout landing pages. Tracking signal loss from browser privacy updates further distorted return on ad spend metrics.
                </p>
              </div>

              {/* THE STRATEGY & SPRINT FRAMEWORK */}
              <div className="case-content-block">
                <span className="case-block-kicker">02. STRATEGY & ARCHITECTURE</span>
                <h2>The Get Into Feed Sprint Framework</h2>
                <p className="case-narrative-para">
                  {currentStudy.execution || currentStudy.detail}
                </p>

                <div className="case-strategy-three-phases">
                  <div className="phase-card">
                    <div className="phase-badge">Phase 1</div>
                    <h4>Telemetry & Infrastructure</h4>
                    <p>Deploying Server-Side Google Tag Manager (sGTM) and Meta Conversions API (CAPI) to achieve 100% conversion signal fidelity.</p>
                  </div>

                  <div className="phase-card">
                    <div className="phase-badge">Phase 2</div>
                    <h4>High-Velocity Creative Sprints</h4>
                    <p>Directing and testing 8+ weekly creator-led UGC video hooks, dynamic creative testing (DCT), and Advantage+ shopping scaling.</p>
                  </div>

                  <div className="phase-card">
                    <div className="phase-badge">Phase 3</div>
                    <h4>Sub-Second React & WhatsApp CRO</h4>
                    <p>Engineering sub-800ms headless React landing pages paired with automated 1-click WhatsApp checkout and cart recovery funnels.</p>
                  </div>
                </div>
              </div>

              {/* TANGIBLE DELIVERABLES CHECKLIST */}
              <div className="case-content-block">
                <span className="case-block-kicker">03. KEY DELIVERABLES</span>
                <h2>Key Deliverables Executed</h2>
                <div className="case-deliverables-checklist">
                  <div className="deliv-item">
                    <CheckCircle2 size={18} color="#0284c7" />
                    <span>Server-Side Conversions API (CAPI) & GA4 BigQuery Telemetry</span>
                  </div>
                  <div className="deliv-item">
                    <CheckCircle2 size={18} color="#0284c7" />
                    <span>32+ Creator UGC Video Ad Hooks & Dynamic Creative Testing Sprints</span>
                  </div>
                  <div className="deliv-item">
                    <CheckCircle2 size={18} color="#0284c7" />
                    <span>Sub-Second React Landing Page Architectures (LCP &lt; 800ms)</span>
                  </div>
                  <div className="deliv-item">
                    <CheckCircle2 size={18} color="#0284c7" />
                    <span>Automated WhatsApp Business API Lead Scoring & Cart Recovery</span>
                  </div>
                  <div className="deliv-item">
                    <CheckCircle2 size={18} color="#0284c7" />
                    <span>Weekly Algorithmic Bid Tuning & Real-Time Looker Studio Dashboards</span>
                  </div>
                </div>
              </div>

              {/* CLIENT TESTIMONIAL QUOTE BOX */}
              {currentStudy.quote && (
                <div className="case-executive-quote-card">
                  <Quote size={36} className="quote-accent-icon" />
                  <p className="quote-body-text">"{currentStudy.quote}"</p>
                  <div className="quote-author-meta">
                    <strong>{currentStudy.quoteAuthor || "Executive Leadership Team"}</strong>
                    <small>{currentStudy.brand}</small>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT STICKY SIDEBAR: LEAD CAPTURE FORM */}
            <aside className="work-detail-right-sidebar">
              <div className="work-sticky-lead-card">
                <div className="sidebar-form-header">
                  <span className="sidebar-tag-pill">GROWTH CONSULTATION</span>
                  <h3>Achieve Similar Growth for Your Brand</h3>
                  <p>Speak with our senior growth architects to formulate a custom strategy roadmap.</p>
                </div>

                {submitted ? (
                  <div className="sidebar-success-state">
                    <CheckCircle2 size={42} color="#16a34a" />
                    <h4>Strategy Session Requested!</h4>
                    <p>Reference: <strong>#{leadId.slice(0, 8).toUpperCase()}</strong></p>
                    <p className="success-desc">A senior growth strategist will contact you within 24 hours with custom unit economics benchmarks.</p>
                    <a
                      href={`https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20reviewed%20the%20${encodeURIComponent(currentStudy.brand)}%20case%20study`}
                      target="_blank"
                      rel="noreferrer"
                      className="sidebar-whatsapp-btn"
                    >
                      💬 WhatsApp Us Now
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="sidebar-form-body">
                    {errorMsg && (
                      <div className="sidebar-error-box">
                        <AlertCircle size={14} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="sidebar-field">
                      <label>Full Name *</label>
                      <input
                        required
                        placeholder="e.g. Ananya Sharma"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>

                    <div className="sidebar-field">
                      <label>Work Email *</label>
                      <input
                        required
                        type="email"
                        placeholder="ananya@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>

                    <div className="sidebar-field">
                      <label>Phone / WhatsApp *</label>
                      <input
                        required
                        placeholder="+91-8810356950"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>

                    <div className="sidebar-field">
                      <label>Company Website / Brand Name</label>
                      <input
                        placeholder="https://yourbrand.com"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                      />
                    </div>

                    {/* GOOGLE RECAPTCHA WIDGET */}
                    <div
                      className={`sidebar-recaptcha-box ${recaptchaVerified ? "verified" : ""}`}
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

                    <button type="submit" disabled={submitting} className="sidebar-submit-orange-btn">
                      {submitting ? "Submitting Inquiry..." : "Claim Free Growth Audit →"}
                    </button>
                  </form>
                )}
              </div>

              {/* AGENCY PARTNER CREDENTIALS */}
              <div className="sidebar-credentials-card">
                <h4>Verified Agency Credentials</h4>
                <div className="credentials-list">
                  <div className="cred-item">
                    <span>🏆</span>
                    <div>
                      <strong>Google Premier Partner</strong>
                      <small>Top 3% Performance Agencies in India</small>
                    </div>
                  </div>
                  <div className="cred-item">
                    <span>⚡</span>
                    <div>
                      <strong>Meta Certified Agency Partner</strong>
                      <small>Advanced Advantage+ & Server CAPI</small>
                    </div>
                  </div>
                  <div className="cred-item">
                    <span>🛡️</span>
                    <div>
                      <strong>DPDP Act 2023 & GDPR Compliant</strong>
                      <small>100% Enterprise Security & Confidentiality</small>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 4. MORE PROVEN CASE STUDIES (3 CARDS) */}
      {otherStudies.length > 0 && (
        <section className="work-more-studies-section">
          <div className="work-detail-container">
            <div className="more-studies-header">
              <h2>More Proven Growth Case Studies</h2>
              <button type="button" onClick={() => onNavigate("/work")} className="view-all-work-btn">
                All Case Studies <ArrowRight size={15} />
              </button>
            </div>

            <div className="more-studies-three-grid">
              {otherStudies.map(([slugKey, other]) => (
                <div
                  key={slugKey}
                  className="more-study-card"
                  onClick={() => onNavigate(`/work/${slugKey}`)}
                >
                  <div className="more-study-badge">{other.metric}</div>
                  <span className="more-study-cat">{other.channel?.split("+")[0] || "Growth Sprint"}</span>
                  <h4>{other.brand}</h4>
                  <p>{other.result}</p>
                  <span className="more-study-read-link">
                    View Breakdown <ArrowRight size={14} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

// -----------------------------------------------------------------------------
// LOCATION DETAIL TEMPLATE (GET INTO FEED REGIONAL HUBS)
// -----------------------------------------------------------------------------
export function LocationDetail({ loc, onNavigate }) {
  return (
    <article className="service-detail-view">
      <section className="service-detail-hero">
        <div className="detail-hero-shell">
          <button type="button" onClick={() => onNavigate("/contact")} className="back-link-btn">
            <ArrowLeft size={16} /> Back to Contact Hubs
          </button>
          <div className="service-hero-pill">
            <MapPin size={16} color="#f59e0b" />
            <span>{loc.city}</span>
          </div>
          <h1>{loc.title}</h1>
          <p className="service-hero-lead">{loc.overview}</p>
          <div className="service-hero-actions">
            <button type="button" onClick={() => onNavigate("/contact")} className="button button-coral">
              Schedule In-Person Strategy Meeting <ArrowRight size={16} />
            </button>
            <a href={`tel:${loc.phone}`} className="button button-outline">
              <Phone size={15} /> Call {loc.city} Office
            </a>
          </div>
        </div>
      </section>

      <section className="service-bottleneck-section">
        <div className="bottleneck-card">
          <div className="bottleneck-icon-badge">
            <Building2 size={26} color="#f15b29" />
          </div>
          <div>
            <span className="kicker-tag">OFFICE ADDRESS & LOCATION</span>
            <h3>{loc.city} Agency Hub</h3>
            <p>{loc.address}</p>
            <p style={{ marginTop: "8px", fontWeight: 700, color: "var(--brand-orange)" }}>
              Hotline: {loc.phone} • Email: {loc.email}
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
