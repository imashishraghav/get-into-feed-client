import React, { useState, useEffect } from "react";
import { enrichWithAttribution } from "../utils/utm.js";
import {
  Check,
  Plus,
  X,
  Search,
  Instagram,
  ArrowUpRight,
  Video,
  Phone,
  Layers,
  Palette,
  Film,
  PenTool,
  Globe,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Clock,
  ArrowRight,
  BarChart3,
  Target,
  Flame,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import DynamicContentRenderer from "./DynamicContentRenderer";

// =========================================================================
// SERVICE BLUEPRINTS (DELHI NCR FOCUS — 100% NODE / REACT SPA ARCHITECTURE)
// =========================================================================
const BLUEPRINTS = {
  "google-ads": {
    badgeKicker: "SEARCH ADS",
    title: "Google Ads Management Services in Delhi NCR",
    pageTitle: "Google Ads Management in Delhi NCR — GetIntoFeed",
    metaDesc: "Practical Google Search Ads support for businesses that need better enquiries, not just more clicks. Delhi, Noida, Gurugram & Pan-India.",
    subtitle: "Practical Google Search Ads support for businesses that need better enquiries, not just more clicks.",
    iconType: "google-ads",
    problemTag: "THE REAL PROBLEM",
    problemHeading: "Paying for clicks but hardly getting calls?",
    problemSummary: "We focus on useful search terms, clear ad copy, location settings and landing pages that make it easy to enquire.",
    howDealHeading: "How we deal with the problem",
    howDealP1: "Strategic Google Ads management in Delhi NCR should help you understand which searches bring real enquiries. We check search terms, targeting, ad copy and the page people reach after clicking\u2014not only how many clicks you buy.",
    howDealP2: "Practical Google Search Ads support for businesses that need better enquiries, not just more clicks. We work remotely with businesses across Delhi, Noida, Gurugram, Ghaziabad, Faridabad and nearby areas.",
    includedHeading: "What can be included",
    includedList: [
      "Search campaign setup or cleanup",
      "Keyword and negative-keyword planning",
      "Location targeting across Delhi NCR",
      "Ad copy and basic conversion tracking checks",
      "Search-term reviews and simple reports"
    ],
    includedDisclaimer: "The deliverable, timeline and pricing are agreed in writing. Media versions are explained clearly and decided every project.",
    processHeading: "Our simple working process",
    processSteps: [
      { num: "01", text: "Understand your offer and service area." },
      { num: "02", text: "Check the account, keywords and destination page" },
      { num: "03", text: "Build or improve the campaign" },
      { num: "04", text: "Review leads, search terms and wasted spend" }
    ],
    whoForHeading: "Who this is for",
    whoForDesc: "Businesses whose customers already search for their product or service.",
    sidebarKicker: "BUILT FOR COMMERCIAL RESULTS",
    sidebarHeading: "Start with a clear scope.",
    sidebarDesc: "Tell us what you sell, where you work and what you want to improve. We will help you choose what is worth doing first.",
    sidebarChecks: [
      "Dedicated team, Delhi NCR focus",
      "Clear scope before commitment",
      "Your accounts stay yours",
      "No guesswork or vanity metrics"
    ],
    sidebarModalTarget: "Talk about Google Ads",
    sidebarAgreementNote: "Direct sales agreement available",
    priceKicker: "SMALL PROJECTS / MILESTONE",
    priceAmount: "From \u20b910,500* onwards",
    priceDesc: "Proposed service fee for defined scope. Final quote depends on the actual scope. Ad spend is separate.",
    priceModalTarget: "Get my starter quote",
    issuesTag: "PROBLEMS WE HELP SOLVE",
    issuesHeading: "What we check, and why it matters.",
    issuesDesc: "Practical fixes before unnecessary spend. Campaign success depends on market competition, offer, budget, landing page and follow-up.",
    issues: [
      {
        num: "ISSUE 01",
        title: "Budget goes fast",
        desc: "We check search terms and negative keyword lists to remove keywords that drain cash without enquiries.",
        topBorder: "border-t-blue-600",
        numColor: "text-blue-600"
      },
      {
        num: "ISSUE 02",
        title: "Calls are hard to track",
        desc: "We check conversion and phone call tracking setup so you know what is actually working.",
        topBorder: "border-t-[#C5F82A]",
        numColor: "text-emerald-700 font-semibold"
      },
      {
        num: "ISSUE 03",
        title: "Wrong cities see your ads",
        desc: "We check location settings and exclude places you do not serve so you don't waste ad budget.",
        topBorder: "border-t-rose-400",
        numColor: "text-rose-600"
      }
    ],
    calloutQuestion: "Have the same problem?",
    calloutDesc: "Tell us about your business and get a realistic Google Ads scope and quote. No obligation to buy a big package.",
    calloutBtn: "Get a tailored plan",
    faqTag: "GOOD TO KNOW",
    faqHeading: "Questions about Google Ads",
    faqs: [
      {
        q: "Are your Google Ads services affordable?",
        a: "Yes. You can start from \u20b910,500* onwards for a focused single-campaign setup or cleanup. We agree on the exact deliverables up front so you never pay for bloated agency retainers."
      },
      {
        q: "Is advertising spend included in your fee?",
        a: "No. Our fee covers campaign planning, keyword research, ad writing, negative keyword filtering and management. Your daily or monthly click budget is paid directly to Google from your own Google Ads account."
      },
      {
        q: "Can you guarantee enquiries?",
        a: "No honest marketer can guarantee an exact number of leads because conversions depend on your pricing, market competition, landing page offer and response speed. We guarantee clean search-term targeting, proper tracking and transparent optimisations."
      },
      {
        q: "Does your google ads support cover Delhi, Noida and Gurugram?",
        a: "Yes! We work with businesses across Delhi, Noida, Greater Noida, Gurugram, Ghaziabad, Faridabad and pan-India, setting up hyper-local pin-code or city-specific targeting."
      },
      {
        q: "Can I start with commercial design / single project?",
        a: "Absolutely. You can hire us for a one-time Google Ads account audit & cleanup, or start with a 1-month focused search campaign to test enquiry quality before scaling."
      }
    ],
    relatedTag: "CONNECTED SERVICES",
    relatedHeading: "Other ways we can help.",
    relatedLinkText: "See everything",
    related: [
      {
        slug: "meta-ads-services-delhi-ncr",
        kicker: "PAID ADVERTISING",
        title: "Meta Ads",
        desc: "Build awareness and generate enquiries with targeted Facebook and Instagram ad campaigns.",
        type: "meta"
      },
      {
        slug: "seo-services-delhi-ncr",
        kicker: "ORGANIC SEARCH",
        title: "SEO",
        desc: "Help your business show up when customers search on Google without paying for every click.",
        type: "seo"
      },
      {
        slug: "social-media-marketing-delhi-ncr",
        kicker: "CONTENT & SOCIAL",
        title: "Social Media",
        desc: "Consistent posts and reels designed to build trust and keep your brand visible.",
        type: "social"
      }
    ],
    bottomHeading: "Want to talk through your options?",
    bottomDesc: "A short conversation is enough to get started.",
    bottomBtn: "Get customised pricing"
  },

  "meta-ads": {
    badgeKicker: "PAID SOCIAL",
    title: "Meta Ads (Facebook & Instagram) Services in Delhi NCR",
    pageTitle: "Meta Ads (FB & Instagram) in Delhi NCR — GetIntoFeed",
    metaDesc: "Facebook & Instagram ads built with thumb-stopping video hooks, Instant Lead Forms, and local radius targeting in Delhi NCR.",
    subtitle: "Facebook and Instagram campaigns that turn casual scrolling into qualified customer enquiries and sales.",
    iconType: "meta",
    problemTag: "THE REAL PROBLEM",
    problemHeading: "Spending on Facebook & Instagram but getting dead leads?",
    problemSummary: "We replace generic stock photos with scroll-stopping creative hooks, clear offers, and qualifying forms.",
    howDealHeading: "How we deal with the problem",
    howDealP1: "Meta Ads are unmatched for reaching targeted local audiences and scaling consumer brands. We build high-CTR video hooks, test multiple angles weekly, and set up instant inquiry flows that turn viewers into paying clients.",
    howDealP2: "We build localized campaigns around Delhi, Gurugram, Noida, and NCR pin-codes to ensure your budget connects with genuine buyers rather than spam bots.",
    includedHeading: "What can be included",
    includedList: [
      "Meta Business Manager & Pixel/CAPI Setup",
      "Instant Lead Form & direct call flows",
      "Local radius & demographic audience targeting",
      "Scroll-stopping video reels & graphic hooks",
      "Weekly creative angle testing & budget scaling"
    ],
    includedDisclaimer: "Exact deliverables depend on scope. Ad spend is billed directly by Meta via your own payment card.",
    processHeading: "Our simple working process",
    processSteps: [
      { num: "01", text: "Clarify your core customer offer and pricing hook" },
      { num: "02", text: "Set up Meta Pixel, conversion events & audience filters" },
      { num: "03", text: "Produce 3-5 creative hook variations and launch ads" },
      { num: "04", text: "Cut non-performing creatives and scale winning audiences" }
    ],
    whoForHeading: "Who this is for",
    whoForDesc: "Clinics, salons, real estate projects, interior designers, coaching centers, D2C brands, and local service providers wanting high inquiry volume.",
    locations: ["New Delhi", "Noida & Greater Noida", "Gurugram", "Ghaziabad", "Faridabad", "Pan-India Remote"],
    focusMetric: "Verified Lead Quality",
    sidebarKicker: "BUILT FOR COMMERCIAL RESULTS",
    sidebarHeading: "Start with high-converting ads.",
    sidebarDesc: "Tell us your target audience and monthly goal. We will help you choose the most effective ad format first.",
    sidebarChecks: [
      "Clear video & graphic creative direction",
      "Zero spam bot instant lead forms",
      "Full ad account ownership stays yours",
      "Weekly performance & ROI reviews"
    ],
    sidebarModalTarget: "Talk about Meta Ads",
    priceKicker: "USUAL STARTING INVESTMENT",
    priceAmount: "From ₹14,999*",
    priceDesc: "Targeted campaign build, pixel setup & creative angle testing. Ad spend is billed directly by Meta.",
    priceModalTarget: "Meta Ads Starter Quote (₹14,999*)",
    videoPill: "2-MINUTE WALKTHROUGH",
    videoHeading: "See how we build high-converting Meta Ads that generate genuine calls.",
    videoDesc: "Watch how we design scroll-stopping video hooks and structured lead forms that filter out junk submissions.",
    videoBadge: "Inside Our Meta Ad Campaign Setup",
    videoDuration: "02:30",
    videoId: "eFgzOWuciNI",
    videoImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1400&q=80",
    videoMetrics: [
      { num: "01", title: "Scroll-Stopping Hooks", desc: "First 3 seconds that grab attention", color: "blue" },
      { num: "02", title: "Qualified Lead Forms", desc: "Pre-filtered contact questions", color: "lime" },
      { num: "03", title: "CAPI Server Tracking", desc: "Accurate iOS & web attribution", color: "emerald" }
    ],
    issuesTag: "PROBLEMS WE HELP SOLVE",
    issuesHeading: "What we check, and why it matters.",
    issuesDesc: "We eliminate common Meta advertising pitfalls before you burn unnecessary budget.",
    issues: [
      {
        num: "ISSUE 01",
        title: "Leads don't answer phone calls",
        desc: "We add custom verification questions to instant forms so only serious prospects submit inquiries.",
        topBorder: "border-t-blue-600",
        numColor: "text-blue-600"
      },
      {
        num: "ISSUE 02",
        title: "Ad fatigue kicks in fast",
        desc: "We rotate fresh creative formats weekly to keep customer acquisition costs predictable.",
        topBorder: "border-t-[#b5e200]",
        numColor: "text-emerald-700"
      },
      {
        num: "ISSUE 03",
        title: "Targeting is too broad",
        desc: "We focus on hyper-local NCR radius drops to make sure ads only show where you can fulfill.",
        topBorder: "border-t-rose-400",
        numColor: "text-rose-600"
      }
    ],
    calloutQuestion: "Tired of wasting money on Meta Ads?",
    calloutDesc: "Let's review your account or build fresh creative hooks that bring genuine inquiries.",
    calloutBtn: "Get a tailored Meta plan",
    faqHeading: "Questions about Meta Ads",
    faqs: [
      {
        q: "What is the recommended starting ad budget for Meta Ads?",
        a: "We recommend starting with ₹1,000 to ₹1,500 per day in ad spend to allow Meta's machine learning algorithm to gather enough conversion data."
      },
      {
        q: "Do you design the ad graphics and videos?",
        a: "Yes! We provide complete visual copy, typography hooks, reel video edits, and graphics tailored to your business."
      },
      {
        q: "How do leads reach us from Facebook & Instagram?",
        a: "Leads arrive instantly on your phone via email alerts, shared live Google Sheets, or direct phone call button clicks."
      }
    ],
    related: [
      {
        slug: "google-ads-services-delhi-ncr",
        kicker: "SEARCH ADS",
        title: "Google Ads",
        desc: "Search Ads not bringing calls? Keywords, search terms, and location tracking.",
        gradient: "card-gradient-blue",
        type: "google-ads"
      },
      {
        slug: "website-design-delhi-ncr",
        kicker: "CONVERTING PRESENCE",
        title: "Website Design",
        desc: "Fast, mobile-friendly landing pages that double your ad conversion rates.",
        gradient: "card-gradient-amber",
        type: "web"
      },
      {
        slug: "reels-video-editing-delhi-ncr",
        kicker: "SHORT-FORM VIDEO",
        title: "Reels & Video Editing",
        desc: "High-retention reels, hooks, and video edits that build trust.",
        gradient: "card-gradient-purple",
        type: "video"
      }
    ]
  },

  "seo": {
    badgeKicker: "ORGANIC SEARCH",
    title: "SEO & Local Search Services in Delhi NCR",
    pageTitle: "SEO & Local Search Services in Delhi NCR — GetIntoFeed",
    metaDesc: "Practical Local SEO and organic search support. Rank for high-intent search terms across Delhi NCR.",
    subtitle: "Help your business show up on Google search and Maps over time without paying for every click.",
    iconType: "seo",
    problemTag: "THE REAL PROBLEM",
    problemHeading: "Website invisible on Google when local customers search?",
    problemSummary: "We optimize keywords, Google Business Profile, site speed, and technical indexing so you get consistent organic inquiries.",
    howDealHeading: "How we deal with the problem",
    howDealP1: "SEO is not about stuffing keywords into blog posts. It is about matching what your prospective customers actually search for and building technical authority that Google trusts.",
    howDealP2: "We specialize in hyper-local Delhi NCR search presence—optimizing your Google Business Profile and location landing pages so nearby buyers find you first.",
    includedHeading: "What can be included",
    includedList: [
      "Technical site audit & Core Web Vitals cleanup",
      "Keyword research focused on commercial intent",
      "Google Business Profile (Maps) optimization",
      "On-page meta tags, headings, and schema markup",
      "Monthly ranking & organic traffic progress report"
    ],
    includedDisclaimer: "SEO is an organic compounding strategy. Deliverables and timelines are structured across 30 to 90-day sprints.",
    processHeading: "Our simple working process",
    processSteps: [
      { num: "01", text: "Audit existing website, indexation and competitor rankings" },
      { num: "02", text: "Map high-intent buyer keywords for your service areas" },
      { num: "03", text: "Implement technical fixes, schema and optimized on-page content" },
      { num: "04", text: "Build local citations and monitor Google Search Console rankings" }
    ],
    whoForHeading: "Who this is for",
    whoForDesc: "Local service providers, clinics, law firms, architects, schools, and business owners looking for sustainable long-term inbound leads.",
    locations: ["New Delhi", "Noida & Greater Noida", "Gurugram", "Ghaziabad", "Faridabad", "Pan-India Remote"],
    focusMetric: "Organic Rank Progression",
    sidebarKicker: "BUILT FOR COMMERCIAL RESULTS",
    sidebarHeading: "Build long-term organic trust.",
    sidebarDesc: "Tell us your website and priority services. We will run an honest diagnostic of what needs fixing first.",
    sidebarChecks: [
      "White-hat ethical SEO only",
      "Direct Google Search Console transparency",
      "No fake link schemes or spam",
      "Clear monthly work summaries"
    ],
    sidebarModalTarget: "Talk about SEO",
    priceKicker: "USUAL STARTING INVESTMENT",
    priceAmount: "From ₹12,999*",
    priceDesc: "Proposed monthly sprint fee for on-page SEO & Google Maps optimization. No lock-in contracts.",
    priceModalTarget: "SEO Starter Quote (₹12,999*)",
    videoPill: "2-MINUTE WALKTHROUGH",
    videoHeading: "See how we audit local keywords and climb Google Search rankings.",
    videoDesc: "Watch how we identify low-competition buyer keywords and optimize your Google Business profile.",
    videoBadge: "Inside Our Local SEO Process",
    videoDuration: "02:10",
    videoId: "DvwS7cV9GmQ",
    videoImage: "https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=1400&q=80",
    videoMetrics: [
      { num: "01", title: "Commercial Keywords", desc: "Target ready-to-hire searches", color: "blue" },
      { num: "02", title: "Google Maps Pack", desc: "Top 3 local map ranking", color: "lime" },
      { num: "03", title: "Technical Health", desc: "Clean mobile indexing & speed", color: "emerald" }
    ],
    issuesTag: "PROBLEMS WE HELP SOLVE",
    issuesHeading: "What we check, and why it matters.",
    issuesDesc: "We fix fundamental ranking roadblocks so Google can properly index and rank your pages.",
    issues: [
      {
        num: "ISSUE 01",
        title: "Google doesn't index your new pages",
        desc: "We diagnose XML sitemaps, robots.txt, and canonical tags to ensure Google finds your content.",
        topBorder: "border-t-blue-600",
        numColor: "text-blue-600"
      },
      {
        num: "ISSUE 02",
        title: "Ranking for the wrong cities",
        desc: "We build localized schema and geographic landing pages targeting Delhi, Noida, and Gurugram.",
        topBorder: "border-t-[#b5e200]",
        numColor: "text-emerald-700"
      },
      {
        num: "ISSUE 03",
        title: "Slow mobile loading speed",
        desc: "We optimize images and reduce code bloat so mobile visitors don't bounce before calling.",
        topBorder: "border-t-rose-400",
        numColor: "text-rose-600"
      }
    ],
    calloutQuestion: "Want to check your website's SEO health?",
    calloutDesc: "Send us your URL. We will provide a 5-point actionable technical teardown.",
    calloutBtn: "Get my SEO audit",
    faqHeading: "Questions about SEO",
    faqs: [
      {
        q: "How long does SEO take to show results?",
        a: "Local SEO and Google Business fixes often show ranking momentum in 30 to 60 days. Broader competitive keywords typically take 3 to 6 months of compounding effort."
      },
      {
        q: "Do you guarantee #1 ranking on Google?",
        a: "No honest SEO professional guarantees #1 rankings because Google's algorithm changes constantly. We guarantee clean white-hat practices, measurable rank progression, and honest reporting."
      },
      {
        q: "Will you need access to my website?",
        a: "Yes, to update title tags, meta descriptions, and image alt text. We can also provide the exact recommendations in a document if your in-house developer prefers to upload them."
      }
    ],
    related: [
      {
        slug: "google-ads-services-delhi-ncr",
        kicker: "SEARCH ADS",
        title: "Google Ads",
        desc: "Need calls immediately while SEO compounds? Launch Google Search Ads.",
        gradient: "card-gradient-blue",
        type: "google-ads"
      },
      {
        slug: "website-design-delhi-ncr",
        kicker: "CONVERTING PRESENCE",
        title: "Website Design",
        desc: "Fast, modern websites that convert organic visitors into paying customers.",
        gradient: "card-gradient-amber",
        type: "web"
      },
      {
        slug: "content-creative-services-delhi-ncr",
        kicker: "CONTENT & BLOGS",
        title: "Content & Creatives",
        desc: "High-value articles and landing copy that establish commercial authority.",
        gradient: "card-gradient-green",
        type: "content"
      }
    ]
  },

  "website-design": {
    badgeKicker: "WEB PRESENCE",
    title: "Website Design & Performance Development in Delhi NCR",
    pageTitle: "Website Design & Development in Delhi NCR — GetIntoFeed",
    metaDesc: "Fast, mobile-friendly websites and landing pages built to turn visitors into phone calls and quote requests.",
    subtitle: "Modern, responsive websites with clear pricing hooks and direct contact flows that turn clicks into revenue.",
    iconType: "web",
    problemTag: "THE REAL PROBLEM",
    problemHeading: "Visitors land on your website but leave without inquiring?",
    problemSummary: "We design clean, fast, mobile-first websites with clear typography, genuine trust factors, and 1-tap contact buttons.",
    howDealHeading: "How we deal with the problem",
    howDealP1: "A slow website with complicated navigation loses over 60% of potential buyers. We build lightweight, ergonomic landing pages engineered for mobile visitors on 4G/5G connections.",
    howDealP2: "Every page is structured around a single goal: making it effortless for prospective clients in Delhi NCR to understand your offer and call you.",
    includedHeading: "What can be included",
    includedList: [
      "Custom responsive design (Mobile, Tablet & Desktop)",
      "Lightning-fast load speed (<1.5s)",
      "Direct Call & Lead form integration",
      "On-Page SEO and Google Analytics setup",
      "Complete CMS handover so you own everything"
    ],
    includedDisclaimer: "Domain and annual hosting are billed directly by your registrar. We build and deploy the complete system.",
    processHeading: "Our simple working process",
    processSteps: [
      { num: "01", text: "Map your service offerings, pricing hooks, and wireframe" },
      { num: "02", text: "Design modern visual identity, layout and clear copy" },
      { num: "03", text: "Develop responsive, clean code with instant lead alerts" },
      { num: "04", text: "Test across iOS & Android, launch live with SSL certificate" }
    ],
    whoForHeading: "Who this is for",
    whoForDesc: "Founders, local service professionals, B2B companies, and growing businesses needing a professional digital storefront that reflects their work quality.",
    locations: ["New Delhi", "Noida & Greater Noida", "Gurugram", "Ghaziabad", "Faridabad", "Pan-India Remote"],
    focusMetric: "High Mobile Conversion",
    sidebarKicker: "BUILT FOR COMMERCIAL RESULTS",
    sidebarHeading: "Start with a fast, modern site.",
    sidebarDesc: "Tell us what your business does. We will help you select the right scope—from a single high-converting landing page to a complete multi-page site.",
    sidebarChecks: [
      "100% mobile-friendly responsive build",
      "Clean code, no bloated plugins",
      "Direct phone call triggers",
      "You own 100% of the code & design"
    ],
    sidebarModalTarget: "Talk about Website Design",
    priceKicker: "USUAL STARTING INVESTMENT",
    priceAmount: "From ₹14,999*",
    priceDesc: "Proposed fee for a high-converting single-page layout or ad landing page with speed tuning.",
    priceModalTarget: "Website Design Quote (₹14,999*)",
    videoPill: "2-MINUTE WALKTHROUGH",
    videoHeading: "See how we structure mobile-first landing pages that double inquiry rates.",
    videoDesc: "Watch how we eliminate friction, place strategic sticky contact triggers, and tune Core Web Vitals.",
    videoBadge: "Inside Our Web Design Ergonomics",
    videoDuration: "02:20",
    videoId: "3tLb3i7GB38",
    videoImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    videoMetrics: [
      { num: "01", title: "Sub-1.5s Load Time", desc: "Keep impatient mobile visitors", color: "blue" },
      { num: "02", title: "Sticky Call Bar", desc: "Effortless 1-tap phone enquiry", color: "lime" },
      { num: "03", title: "Clear Pricing Hooks", desc: "Build immediate trust up front", color: "emerald" }
    ],
    issuesTag: "PROBLEMS WE HELP SOLVE",
    issuesHeading: "What we check, and why it matters.",
    issuesDesc: "We eliminate common web design blunders that drive potential buyers straight to your competitors.",
    issues: [
      {
        num: "ISSUE 01",
        title: "Website takes too long to load",
        desc: "We optimize asset compression and eliminate heavy scripts so your site opens in under 1.5 seconds.",
        topBorder: "border-t-blue-600",
        numColor: "text-blue-600"
      },
      {
        num: "ISSUE 02",
        title: "Contact form is buried",
        desc: "We position clear direct call links and simple forms above the fold and in sticky navigation bars.",
        topBorder: "border-t-[#b5e200]",
        numColor: "text-emerald-700"
      },
      {
        num: "ISSUE 03",
        title: "Looks broken on smartphones",
        desc: "We design specifically for handheld ergonomics where over 75% of your buyers discover you.",
        topBorder: "border-t-rose-400",
        numColor: "text-rose-600"
      }
    ],
    calloutQuestion: "Is your website overdue for a modern overhaul?",
    calloutDesc: "Send us your link. We will review your mobile layout and tell you what to improve.",
    calloutBtn: "Request a website review",
    faqHeading: "Questions about Website Design",
    faqs: [
      {
        q: "How long does it take to build a website?",
        a: "A focused single-page landing page typically takes 3 to 5 business days. A complete 5-8 page corporate website takes 7 to 14 business days."
      },
      {
        q: "Will I be able to edit text and images later?",
        a: "Yes! We hand over complete administrative access with simple controls so you can update text, images, and prices anytime."
      },
      {
        q: "Do you provide hosting and domains?",
        a: "We assist you in purchasing domain and hosting in your own name so you retain 100% legal ownership and control."
      }
    ],
    related: [
      {
        slug: "google-ads-services-delhi-ncr",
        kicker: "SEARCH ADS",
        title: "Google Ads",
        desc: "Drive instant buyer traffic to your newly designed landing page.",
        gradient: "card-gradient-blue",
        type: "google-ads"
      },
      {
        slug: "seo-services-delhi-ncr",
        kicker: "ORGANIC SEARCH",
        title: "SEO",
        desc: "Build Google rankings that compound organic traffic over time.",
        gradient: "card-gradient-green",
        type: "seo"
      },
      {
        slug: "graphic-design-services-delhi-ncr",
        kicker: "VISUAL ASSETS",
        title: "Graphic Design",
        desc: "Crisp vector logos, brochures, and brand graphics.",
        gradient: "card-gradient-pink",
        type: "design"
      }
    ]
  }
};

// Aliases lookup
const SLUG_MAPPING = {
  "google-ads": "google-ads",
  "google-ads-services-delhi-ncr": "google-ads",
  "search-ads": "google-ads",
  "google-ad": "google-ads",
  "meta-ads": "meta-ads",
  "meta-ads-services-delhi-ncr": "meta-ads",
  "facebook-ads": "meta-ads",
  "instagram-ads": "meta-ads",
  "meta-ad": "meta-ads",
  "seo": "seo",
  "seo-services-delhi-ncr": "seo",
  "local-seo": "seo",
  "website-design": "website-design",
  "website-design-delhi-ncr": "website-design",
  "web-development": "website-design",
  "web-design": "website-design",
  "social-media": "meta-ads",
  "social-media-marketing-delhi-ncr": "meta-ads",
  "content-marketing": "seo",
  "content-creative-services-delhi-ncr": "seo",
  "reels": "meta-ads",
  "reels-video-editing-delhi-ncr": "meta-ads",
  "graphic-design": "website-design",
  "graphic-design-services-delhi-ncr": "website-design"
};

// =========================================================================
// SERVICE ICON COMPONENT
// =========================================================================
function ServiceIcon({ type, className = "w-5 h-5" }) {
  if (type === "google-ads") {
    return (
      <svg className={className} viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FBBC04" d="M12.2 141.6L70.1 41.3c8.1-14 26-18.8 40-10.7 14 8.1 18.8 26 10.7 40l-57.9 100.3c-8.1 14-26 18.8-40 10.7-14-8.1-18.8-26-10.7-40z"/>
        <path fill="#4285F4" d="M179.8 141.6L121.9 41.3c-8.1-14-26-18.8-40-10.7-14 8.1 18.8 26 10.7 40l57.9 100.3c8.1 14 26 18.8 40 10.7 14-8.1 18.8-26 10.7-40z"/>
        <circle fill="#34A853" cx="37.6" cy="156.3" r="29.3"/>
      </svg>
    );
  }
  if (type === "meta") {
    return (
      <svg className={className} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="metaGradInner" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#0064E0"/>
            <stop offset="50%" stopColor="#0082FB"/>
            <stop offset="100%" stopColor="#0099FF"/>
          </linearGradient>
        </defs>
        <path d="M27.3 2C24.1 2 21.6 3.9 19.6 6.7C18.9 5.5 18.1 4.4 17.1 3.6C15.3 2.5 13.1 2 10.7 2C5.5 2 1.5 6.3 1.5 12.2C1.5 17.8 5.2 22 9.9 22C12.8 22 15.2 20.3 17.7 16.5C17.7 16.5 19.2 14.1 20.1 12.6C20.9 14 22.1 16.1 23.1 17.5C25.2 20.5 27.4 22 30.2 22C34.8 22 38.5 17.8 38.5 12.1C38.5 6.2 33.6 2 27.3 2ZM14.6 14.4C12.7 17.3 11.4 18.2 9.8 18.2C7.1 18.2 5.3 15.7 5.3 12.2C5.3 8.4 7.5 5.8 10.6 5.8C12.9 5.8 14.6 7.1 16.8 10.7C15.9 12.2 14.6 14.4 14.6 14.4ZM29.9 18.2C28.3 18.2 26.9 17.1 25.1 14.4C24.2 13 23.1 11.1 22.2 9.6C24 6.9 25.5 5.8 27.5 5.8C31.3 5.8 34.7 8.4 34.7 12.1C34.7 15.7 32.6 18.2 29.9 18.2Z" transform="translate(-2, 0)" fill="url(#metaGradInner)"/>
      </svg>
    );
  }
  if (type === "seo") {
    return <Search className={`${className} text-emerald-600`} />;
  }
  if (type === "social") {
    return <Instagram className={`${className} text-pink-600`} />;
  }
  if (type === "web") {
    return <Globe className={`${className} text-blue-600`} />;
  }
  if (type === "video") {
    return <Film className={`${className} text-purple-600`} />;
  }
  if (type === "content") {
    return <PenTool className={`${className} text-amber-600`} />;
  }
  return <Sparkles className={`${className} text-[#c6f000]`} />;
}

function SectionBadge({ text }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
      <span className="w-[11px] h-[11px] rounded-[3px] bg-[#d4ff00] border-2 border-[#2563eb] inline-block shrink-0 box-border" />
      <span>{text}</span>
    </div>
  );
}

// =========================================================================
// MAIN SERVICE PAGE RENDERER (NODE / REACT SPA COMPONENT)
// =========================================================================
export default function ServicePageRenderer({ service = {}, allServices = [], onNavigate, onOpenModal }) {
  const rawSlug = service.slug || "google-ads";
  const mappedKey = SLUG_MAPPING[rawSlug] || "google-ads";
  const bp = BLUEPRINTS[mappedKey] || BLUEPRINTS["google-ads"];

  // Interactive States
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [scopeModalOpen, setScopeModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(bp.sidebarModalTarget);

  // Form State
  const [formData, setFormData] = useState({ name: "", contact: "", businessLoc: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Set document title & SEO
  useEffect(() => {
    document.title = bp.pageTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = bp.metaDesc;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [bp]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setScopeModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const handleOpenScopeModal = (title) => {
    if (onOpenModal) {
      onOpenModal(title || bp.sidebarModalTarget);
    } else {
      setModalTitle(title || bp.sidebarModalTarget);
      setSubmitSuccess(false);
      setScopeModalOpen(true);
    }
  };

  const handleCloseScopeModal = () => {
    setScopeModalOpen(false);
  };

  const handleSubmitScopeForm = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;

    setIsSubmitting(true);
    try {
      const isEmail = formData.contact.includes("@");
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichWithAttribution({
          name: formData.name,
          email: isEmail ? formData.contact.trim() : null,
          phone: !isEmail ? formData.contact.trim() : null,
          service: modalTitle,
          message: `Scope & Quote request from /services/${rawSlug}. Location & Business: ${formData.businessLoc || "Not specified"}`,
          source: `Service Detail (${rawSlug})`,
          form_type: "Service Detail Scope Modal",
          consent: true
        }))
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setScopeModalOpen(false);
        setFormData({ name: "", contact: "", businessLoc: "" });
        setSubmitSuccess(false);
      }, 2000);
    } catch {
      setSubmitSuccess(true);
      setTimeout(() => {
        setScopeModalOpen(false);
        setFormData({ name: "", contact: "", businessLoc: "" });
        setSubmitSuccess(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full font-sans text-slate-900 bg-white antialiased relative selection:bg-[#C5F82A] selection:text-slate-950">
      <style>{`
        .hero-gradient {
          background: radial-gradient(circle at 80% 50%, rgba(29, 78, 216, 0.28) 0%, rgba(11, 20, 38, 1) 65%);
          background-color: #0B1426;
        }
        .lime-cta-gradient {
          background: linear-gradient(90deg, #C5F82A 0%, #B2F01E 100%);
        }
      `}</style>

      {/* Hero Banner Section */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-3 sm:pb-4">
        <div className="hero-gradient rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 lg:p-14 text-white relative overflow-hidden shadow-xl border border-slate-800/80">
          <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10">
            {/* Hero Left Text */}
            <div className="md:col-span-8 space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#C5F82A]">
                <span className="w-[11px] h-[11px] rounded-[3px] bg-[#d4ff00] border-2 border-[#2563eb] inline-block shrink-0 box-border"></span>
                <span id="hero-badge">{service.hero_badge || bp.badgeKicker}</span>
              </div>
              <h1 id="hero-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-bold tracking-[-0.035em] leading-[1.14] text-white break-words">
                {service.hero_heading || service.name || service.title || bp.title}
              </h1>
              <p id="hero-subtitle" className="text-[#d4dcf0] text-[13.5px] sm:text-[15px] max-w-2xl leading-[1.6] font-normal pt-0.5 sm:pt-1">
                {service.hero_description || service.short_description || service.shortDesc || bp.subtitle}
              </p>

              {/* Instant Conversion Action Bar (Mobile First) */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenScopeModal(service.title || bp.sidebarModalTarget || "Talk about Google Ads")}
                  className="w-full sm:w-auto bg-[#C5F82A] hover:bg-[#b4e619] active:scale-[0.98] text-slate-950 font-bold py-3.5 px-6 rounded-full text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none min-h-[44px]"
                >
                  <span>{bp.priceModalTarget || "Get Starter Quote"}</span>
                  <span>↗</span>
                </button>
                <a
                  href="https://wa.me/918810356950?text=Hi%20GetIntoFeed%2C%20I%20am%20interested%20in%20Google%20Ads%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-semibold py-3.5 px-5 rounded-full text-xs sm:text-sm transition flex items-center justify-center gap-2 no-underline border border-white/15 min-h-[44px]"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                  <Check className="w-3 h-3 text-[#C5F82A]" />
                  <span>{service.pricing_tier || bp.priceAmount || "From ₹10,500*"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                  <Check className="w-3 h-3 text-[#C5F82A]" />
                  <span>Delhi NCR Focus</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                  <Check className="w-3 h-3 text-[#C5F82A]" />
                  <span>Your Accounts Stay Yours</span>
                </span>
              </div>
            </div>

            {/* Hero Right Graphic / Abstract Ring (Hidden on mobile to save 200px vertical space, visible md+) */}
            <div className="hidden md:flex md:col-span-4 justify-center md:justify-end relative">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[16px] border-[#C5F82A]/25"></div>
                <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full border border-[#C5F82A]/40"></div>
                <svg className="w-10 h-10 text-[#C5F82A]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="py-3 text-xs font-medium text-blue-600 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("/"); }}
            className="hover:underline transition text-blue-600 shrink-0"
          >
            Home
          </a>
          <span className="text-slate-400 shrink-0">/</span>
          <a
            href="/services"
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("/services"); }}
            className="hover:underline transition text-blue-600 shrink-0"
          >
            Services
          </a>
          <span className="text-slate-400 shrink-0">/</span>
          <span id="breadcrumb-current" className="text-slate-500 font-normal truncate">
            {service.title || bp.title.split(" Services")[0]}
          </span>
        </nav>
      </section>

      {/* Main 2-Column Content Split */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Mobile Quick Scope & Pricing Snapshot Card (< lg only) */}
        <div className="lg:hidden mb-8 bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              {bp.priceKicker || "STARTER SPRINT"}
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900" id="pricing-amount-mobile">
              {service.pricing_tier || bp.priceAmount || "From ₹10,500*"}
            </span>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              {service.sidebar_heading || bp.sidebarHeading || "Start with a clear scope."}
            </h3>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              {service.sidebar_desc || bp.sidebarDesc}
            </p>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {((service.sidebar_checks && service.sidebar_checks.length > 0) ? service.sidebar_checks : bp.sidebarChecks).slice(0, 3).map((chk, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" strokeWidth={2.5} />
                <span>{chk}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => handleOpenScopeModal(bp.priceModalTarget || `${bp.badgeKicker} Starter Quote (${service.pricing_tier || bp.priceAmount})`)}
            className="w-full bg-[#C5F82A] hover:bg-[#b4e619] active:scale-[0.98] text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-xs min-h-[44px]"
          >
            <span>{bp.priceModalTarget || "Get Starter Quote"}</span>
            <span>↗</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Problem, Solution, Deliverables, Process, Who for */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">
            
            {(service?.editor_mode === 'blocks' && service?.content_blocks && service.content_blocks.length > 0) ? (
              <DynamicContentRenderer
                editorMode="blocks"
                contentBlocks={service.content_blocks}
                onNavigate={onNavigate}
                onOpenModal={onOpenModal}
              />
            ) : (
              <>
                {/* Problem Block */}
                <div>
                  <SectionBadge text={bp.problemTag || service.problem_tag || "THE REAL PROBLEM"} />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 sm:mb-3" id="problem-title">
                    {bp.problemHeading || service.problem_heading}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed" id="problem-desc">
                    {bp.problemSummary || service.problem_summary}
                  </p>
                </div>

                {/* How We Deal Block */}
                <div className="space-y-2.5 sm:space-y-3 pt-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">
                    {bp.howDealHeading || service.how_deal_heading || "How we deal with the problem"}
                  </h3>
                  <div className="space-y-2.5 sm:space-y-3 text-slate-600 leading-relaxed text-xs sm:text-sm">
                    <p id="solution-p1">{bp.howDealP1 || service.how_deal_content}</p>
                    {bp.howDealP2 && <p id="solution-p2">{bp.howDealP2}</p>}
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">
                    {bp.includedHeading || service.included_heading || "What can be included"}
                  </h3>
                  <ul className="space-y-2 text-slate-700 text-xs sm:text-sm" id="deliverables-list">
                    {((service.deliverables && service.deliverables.length > 0) ? service.deliverables : (bp.includedList || [])).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-slate-50/70 border border-slate-100 rounded-lg p-2.5 sm:p-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-snug text-slate-800 font-medium">{typeof item === "string" ? item : (item.text || item.title || JSON.stringify(item))}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-slate-400 italic pt-1">
                    {bp.includedDisclaimer || service.included_disclaimer}
                  </p>
                </div>

                {/* 4-Step Working Process Grid */}
                <div className="space-y-3 sm:space-y-4 pt-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">
                    {bp.processHeading || service.process_heading || "Our simple working process"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="process-steps">
                    {((service.process_steps && service.process_steps.length > 0) ? service.process_steps : (bp.processSteps || [])).map((step, idx) => {
                      const stepNum = typeof step === "object" ? (step.step || step.num || `0${idx + 1}`) : `0${idx + 1}`;
                      const stepTitle = typeof step === "string" ? step : (step.title || step.text || "");
                      const stepDesc = typeof step === "object" ? step.description : null;
                      return (
                        <div key={idx} className="bg-white border border-blue-200/70 p-4 rounded-xl shadow-xs space-y-1">
                          <span className="text-xs font-bold text-blue-600 block">{stepNum}</span>
                          <p className="text-slate-900 font-bold text-xs sm:text-sm leading-snug">{stepTitle}</p>
                          {stepDesc && (
                            <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed pt-0.5">{stepDesc}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Who this is for */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">
                    {bp.whoForHeading || service.who_for_heading || "Who this is for"}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed" id="who-desc">
                    {bp.whoForDesc || service.who_for_desc}
                  </p>
                </div>
              </>
            )}

          </div>

          {/* Right Column: Sticky Conversion & Pricing Card (Desktop / Tablet lg+) */}
          <aside className="lg:col-span-5 sticky top-24 self-start z-20">
            <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-5 sm:p-7 space-y-5 shadow-sm">
              
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                  {bp.sidebarKicker || "BUILT FOR COMMERCIAL RESULTS"}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {service.sidebar_heading || bp.sidebarHeading || "Start with a clear scope."}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {service.sidebar_desc || bp.sidebarDesc}
                </p>
              </div>

              {/* Value Checkmarks */}
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {((service.sidebar_checks && service.sidebar_checks.length > 0) ? service.sidebar_checks : bp.sidebarChecks).map((chk, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" strokeWidth={2.5} />
                    <span>{chk}</span>
                  </li>
                ))}
              </ul>

              {/* Primary CTA Button */}
              <div>
                <button
                  type="button"
                  onClick={() => handleOpenScopeModal(bp.sidebarModalTarget || `Talk about ${bp.badgeKicker}`)}
                  className="w-full bg-[#C5F82A] hover:bg-[#b4e619] active:scale-[0.98] text-slate-950 font-bold py-3.5 px-6 rounded-full text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 group cursor-pointer border-none min-h-[44px]"
                >
                  <span>{bp.sidebarModalTarget || `Talk about ${bp.badgeKicker}`}</span>
                  <span className="group-hover:translate-x-0.5 transition">↗</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  {bp.sidebarAgreementNote || "Direct sales agreement available"}
                </p>
              </div>

              {/* Nested Pricing Box */}
              <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {bp.priceKicker || "SMALL PROJECTS / MILESTONE"}
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900" id="pricing-amount">
                  {service.pricing_tier || bp.priceAmount}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed" id="pricing-note">
                  {bp.priceDesc}
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenScopeModal(bp.priceModalTarget || `${bp.badgeKicker} Starter Quote (${service.pricing_tier || bp.priceAmount})`)}
                  className="w-full bg-[#C5F82A] hover:bg-[#b4e619] active:scale-[0.98] text-slate-950 font-bold py-2.5 px-4 rounded-full text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border-none mt-1 min-h-[44px]"
                >
                  <span>{bp.priceModalTarget || "Get my starter quote"}</span>
                  <span>↗</span>
                </button>
              </div>

            </div>
          </aside>

        </div>
      </section>

      {/* Light Gray Band: Problems We Solve + Questions FAQ (Continuous Single Section as in Image) */}
      <section className="bg-[#f8fafc] border-y border-slate-200/80 py-12 sm:py-16" id="audit">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          
          {/* Sub-part 1: What We Check */}
          <div>
            <div className="mb-6 sm:mb-8 max-w-xl">
              <SectionBadge text={bp.issuesTag || "PROBLEMS WE HELP SOLVE"} />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">
                {bp.issuesHeading || "What we check, and why it matters."}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                {bp.issuesDesc}
              </p>
            </div>

            {/* 3 Issue Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
              {((service.issues && service.issues.length > 0) ? service.issues : bp.issues).map((iss, idx) => {
                const borderClass = iss.topBorder || (idx === 0 ? "border-t-blue-600" : idx === 1 ? "border-t-[#C5F82A]" : "border-t-rose-400");
                const tagClass = iss.numColor || (idx === 0 ? "text-blue-600" : idx === 1 ? "text-emerald-700" : "text-rose-600");
                return (
                  <div key={idx} className={`bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 border-t-4 ${borderClass} shadow-xs space-y-2`}>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${tagClass}`}>{iss.num}</span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{iss.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{iss.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Dark Inline Callout Banner */}
            <div className="bg-[#0B1426] rounded-2xl p-5 sm:p-7 text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6 shadow-xl border border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold">{bp.calloutQuestion || "Have the same problem?"}</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                  {bp.calloutDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenScopeModal(bp.calloutBtn || "Get a tailored plan")}
                className="w-full sm:w-auto bg-[#C5F82A] hover:bg-[#b4e619] active:scale-[0.98] text-slate-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm shrink-0 transition flex items-center justify-center gap-2 group cursor-pointer border-none min-h-[46px]"
              >
                <span>{bp.calloutBtn || "Get a tailored plan"}</span>
                <span className="group-hover:translate-x-0.5 transition">↗</span>
              </button>
            </div>
          </div>

          {/* Sub-part 2: Questions FAQ */}
          <div id="faq">
            <div className="mb-5 sm:mb-6">
              <SectionBadge text={bp.faqTag || "GOOD TO KNOW"} />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">
                {bp.faqHeading || "Questions about Google Ads"}
              </h2>
            </div>

            <div className="space-y-3">
              {((service.faqs && service.faqs.length > 0) ? service.faqs : bp.faqs).map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-xs"
                  open={idx === 0}
                >
                  <summary className="flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm select-none min-h-[36px]">
                    <span className="pr-3 leading-snug">{faq.q}</span>
                    <span className="text-blue-600 group-open:rotate-45 transition transform text-xl font-normal leading-none shrink-0">+</span>
                  </summary>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2.5 pt-1 border-t border-slate-100">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Related Services Section (Clean White Background) */}
      <section className="bg-white py-12 sm:py-16" id="services">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div>
              <SectionBadge text={bp.relatedTag || "CONNECTED SERVICES"} />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">{bp.relatedHeading || "Other ways we can help."}</h2>
            </div>
            <a
              href="/services"
              onClick={(e) => {
                e.preventDefault();
                onNavigate && onNavigate("/services");
              }}
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 no-underline"
            >
              <span>{bp.relatedLinkText || "See everything"}</span>
              <span>↗</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {bp.related.map((rel, idx) => (
              <a
                key={idx}
                href={`/services/${rel.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate && onNavigate(`/services/${rel.slug}`);
                }}
                className="group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition block no-underline"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold mb-4">
                  <ServiceIcon type={rel.type} className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{rel.kicker}</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition">{rel.title}</h3>
                <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{rel.desc}</p>
                <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <span>View service</span>
                  <span>↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Neon Lime CTA Banner */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-24 lg:pb-16" id="contact">
        <div className="lime-cta-gradient rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-slate-950 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6 shadow-sm">
          <div className="max-w-xl space-y-1.5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              {bp.bottomHeading || "Want to talk through your options?"}
            </h2>
            <p className="text-slate-800 text-xs sm:text-sm font-medium">
              {bp.bottomDesc || "A short conversation is enough to get started."}
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleOpenScopeModal(bp.bottomBtn || `Talk through options - ${bp.title}`)}
              className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 active:scale-[0.98] text-white font-bold px-7 py-3.5 rounded-full text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 group cursor-pointer border-none whitespace-nowrap min-h-[48px]"
            >
              <span>{bp.bottomBtn || "Get customised pricing"}</span>
              <span className="group-hover:translate-x-0.5 transition">↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Conversion Action Bar (Fixed at bottom on < lg screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">
            {service.hero_badge || bp.badgeKicker || "Search Ads"}
          </span>
          <span className="text-sm font-extrabold text-[#C5F82A] block truncate">
            {service.pricing_tier || bp.priceAmount || "From ₹10,500*"}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://wa.me/918810356950?text=Hi%20GetIntoFeed%2C%20I%20am%20interested%20in%20Google%20Ads%20services"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition active:scale-95 no-underline"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => handleOpenScopeModal(service.title || bp.sidebarModalTarget || "Talk about Google Ads")}
            className="bg-[#C5F82A] hover:bg-[#b4e619] active:scale-95 text-slate-950 font-bold px-4 py-2.5 rounded-full text-xs transition shadow-sm flex items-center gap-1.5 cursor-pointer border-none min-h-[40px]"
          >
            <span>Get Quote</span>
            <span>↗</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE SCOPE & QUOTE MODAL (PURE REACT / ZERO WHATSAPP) */}
      {/* ========================================================================= */}
      {scopeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-2xl border border-slate-200 relative text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={handleCloseScopeModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 border-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d2ff00] text-slate-950 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
              ⚡ {service.hero_badge || bp.badgeKicker} Scope Request
            </span>
            <h3 className="text-lg sm:text-2xl font-extrabold text-slate-950 mb-1 pr-8">
              {modalTitle}
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Tell us what you sell and your target city. We will reply with a practical starting plan.
            </p>

            <form onSubmit={handleSubmitScopeForm} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Khanna"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[16px] sm:text-sm font-medium focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Phone or Email *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210 or name@business.com"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[16px] sm:text-sm font-medium focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Your Business & Target Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dental Clinic in Noida / Delhi NCR"
                  value={formData.businessLoc}
                  onChange={(e) => setFormData({ ...formData, businessLoc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[16px] sm:text-sm font-medium focus:outline-none focus:border-blue-600"
                />
              </div>
              
              {submitSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                  Thank you! We have received your details and will share your scope & quote shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#254bdb] hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer border-none disabled:opacity-50 min-h-[48px]"
              >
                <span>{isSubmitting ? "Submitting..." : "Request My Scope & Quote"}</span>
                <span>↗</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
