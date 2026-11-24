import React, { useState, useEffect, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { getStoredBlogPosts } from "./data/blogPosts.js";
import { trackLeadConversion, trackEvent } from "./utils/analytics.js";
import { initAttributionTracking, enrichWithAttribution } from "./utils/utm.js";

// Route-level code splitting: All pages and admin dashboard load asynchronously on demand
const AdminDashboard = React.lazy(() => import("./Admin"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ServicesHubPage = React.lazy(() => import("./pages/ServicesHubPage"));
const ServiceDetailPage = React.lazy(() => import("./pages/ServiceDetailPage"));
const AboutUsPage = React.lazy(() => import("./pages/AboutUsPage"));
const WorkPage = React.lazy(() => import("./pages/WorkPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const FeedNotesPage = React.lazy(() => import("./pages/BlogPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const ThankYouPage = React.lazy(() => import("./pages/ThankYouPage"));
const LegalPage = React.lazy(() => import("./pages/LegalPage").then(m => ({ default: m.LegalPage })));
const CaseStudyDetailPage = React.lazy(() => import("./pages/CaseStudyDetailPage"));
const CookiePolicyPage = React.lazy(() => import("./pages/LegalPage").then(m => ({ default: m.CookiePolicyPage })));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const DynamicPage = React.lazy(() => import("./components/DynamicPage"));
const ReviewsPage = React.lazy(() => import("./pages/ReviewsPage"));
const AuditPage = React.lazy(() => import("./pages/AuditPage"));

const RouteSuspense = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white" aria-busy="true" aria-live="polite">
        <div className="w-8 h-8 border-2 border-[#D4FF00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const API_URL = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [homeBlogPosts, setHomeBlogPosts] = useState(() => {
    try {
      const posts = getStoredBlogPosts();
      return Array.isArray(posts) ? posts.slice(0, 3) : [];
    } catch {
      return [];
    }
  });

  const [services, setServices] = useState(() => {
    try {
      const raw = localStorage.getItem("gif_services_catalog");
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Non-blocking background fetch on app mount: defers network work until browser is idle
  useEffect(() => {
    initAttributionTracking();

    const fetchFreshContent = () => {
      fetch(`/api/blog?t=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.posts)) {
            setHomeBlogPosts(data.posts.slice(0, 3));
            localStorage.setItem("gif_blog_posts", JSON.stringify(data.posts));
            window.dispatchEvent(new Event("storage"));
          }
        })
        .catch(() => {});

      fetch(`/api/services?t=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.services)) {
            setServices(data.services);
            localStorage.setItem("gif_services_catalog", JSON.stringify(data.services));
          }
        })
        .catch(() => {});
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(fetchFreshContent, { timeout: 2500 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(fetchFreshContent, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const updatePosts = () => {
      try {
        const posts = getStoredBlogPosts();
        if (Array.isArray(posts)) {
          setHomeBlogPosts(posts.slice(0, 3));
        }
      } catch {}
    };
    window.addEventListener("storage", updatePosts);
    return () => window.removeEventListener("storage", updatePosts);
  }, []);

  const [route, setRoute] = useState(window.location.pathname || "/");

  // Background hydration: sync published content from CMS to localStorage (deferred & interaction-driven)
  useEffect(() => {
    let hasTriggered = false;

    const syncCMS = async () => {
      try {
        const lastSync = localStorage.getItem("gif_last_cms_sync");
        const now = Date.now();
        // Throttle rapid re-fetches within 15 seconds, but allow continuous fresh updates from CMS
        if (lastSync && now - parseInt(lastSync, 10) < 15 * 1000) {
          return;
        }

        // Consolidated High-Performance Bootstrap: 1 single network request replacing 8 individual calls
        const bootstrapRes = await fetch(`/api/v1/bootstrap?t=${now}`).catch(() => null);
        if (bootstrapRes && bootstrapRes.ok) {
          const data = await bootstrapRes.json();
          if (data && data.success) {
            localStorage.setItem("gif_last_cms_sync", now.toString());

            if (Array.isArray(data.services)) {
              localStorage.setItem("gif_services_catalog", JSON.stringify(data.services));
              setServices(data.services);
            }
            if (Array.isArray(data.projects || data.case_studies)) {
              localStorage.setItem("gif_case_studies_catalog", JSON.stringify(data.projects || data.case_studies));
            }
            if (Array.isArray(data.posts)) {
              localStorage.setItem("gif_blog_posts", JSON.stringify(data.posts));
              setHomeBlogPosts(data.posts.slice(0, 3));
            }
            if (Array.isArray(data.testimonials || data.reviews)) {
              localStorage.setItem("gif_reviews_catalog", JSON.stringify(data.testimonials || data.reviews));
            }
            if (Array.isArray(data.team)) {
              localStorage.setItem("gif_team_catalog", JSON.stringify(data.team));
            }
            if (Array.isArray(data.awards)) {
              localStorage.setItem("gif_awards_catalog", JSON.stringify(data.awards));
            }
            if (Array.isArray(data.faqs)) {
              localStorage.setItem("gif_faqs_catalog", JSON.stringify(data.faqs));
            }
            if (data.settings) {
              localStorage.setItem("gif_public_settings", JSON.stringify(data.settings));
            }

            window.dispatchEvent(new Event("storage"));
            return;
          }
        }

        // Graceful Fallback (if bootstrap unavailable)
        const [srvRes, blogRes] = await Promise.allSettled([
          fetch(`/api/services?t=${now}`),
          fetch(`/api/blog?t=${now}`)
        ]);
        if (srvRes.status === "fulfilled" && srvRes.value?.ok) {
          const data = await srvRes.value.json();
          if (data && data.success && Array.isArray(data.services)) {
            localStorage.setItem("gif_services_catalog", JSON.stringify(data.services));
            setServices(data.services);
          }
        }
        if (blogRes.status === "fulfilled" && blogRes.value?.ok) {
          const data = await blogRes.value.json();
          if (data && data.posts && Array.isArray(data.posts)) {
            localStorage.setItem("gif_blog_posts", JSON.stringify(data.posts));
            setHomeBlogPosts(data.posts.slice(0, 3));
          }
        }
      } catch {}
    };

    const triggerSync = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      interactionEvents.forEach((e) => {
        window.removeEventListener(e, triggerSync, { passive: true });
      });
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => syncCMS(), { timeout: 4000 });
      } else {
        setTimeout(syncCMS, 1000);
      }
    };
    // Immediate initial sync on mount to ensure fresh database state is loaded without delay
    syncCMS();

    const interactionEvents = ["pointerdown", "touchstart", "scroll", "keydown"];
    interactionEvents.forEach((e) => {
      window.addEventListener(e, triggerSync, { once: true, passive: true });
    });

    // Fallback: only if user stays on the page idle for over 15 seconds
    const fallbackTimer = setTimeout(triggerSync, 15000);
    return () => {
      clearTimeout(fallbackTimer);
      interactionEvents.forEach((e) => {
        window.removeEventListener(e, triggerSync, { passive: true });
      });
    };
  }, []);
  useEffect(() => {
    // Dynamic SEO Titles, Meta Descriptions, Canonical, OpenGraph, Twitter Cards, JSON-LD
    const BASE_URL = "https://getintofeed.com";
    const DEFAULT_IMAGE = `${BASE_URL}/agency-hero.jpg`;

    const setSEO = (title, desc, path = "/", image = DEFAULT_IMAGE) => {
      // Title
      document.title = title;

      // Meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", desc);

      // Canonical
      const canonical = document.getElementById("canonical-tag");
      if (canonical) canonical.setAttribute("href", `${BASE_URL}${path}`);

      // Open Graph
      const ogUrl = document.getElementById("og-url");
      if (ogUrl) ogUrl.setAttribute("content", `${BASE_URL}${path}`);
      const ogTitle = document.getElementById("og-title");
      if (ogTitle) ogTitle.setAttribute("content", title);
      const ogDesc = document.getElementById("og-desc");
      if (ogDesc) ogDesc.setAttribute("content", desc);
      const ogImage = document.getElementById("og-image");
      if (ogImage) ogImage.setAttribute("content", image);

      // Twitter Cards
      const twTitle = document.getElementById("tw-title");
      if (twTitle) twTitle.setAttribute("content", title);
      const twDesc = document.getElementById("tw-desc");
      if (twDesc) twDesc.setAttribute("content", desc);

      // Reset robots meta to indexable for regular content pages
      const metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots) metaRobots.setAttribute("content", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    };

    // Inject per-page JSON-LD (breadcrumb + page-specific schema)
    const injectSchema = (schemaObj) => {
      const existing = document.getElementById("dynamic-ld-json");
      if (existing) existing.remove();
      const script = document.createElement("script");
      script.id = "dynamic-ld-json";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    };

    const makeBreadcrumb = (crumbs) => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": crumbs.map((c, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": c.name,
        "item": `${BASE_URL}${c.path}`
      }))
    });

    // SPA Virtual Pageview for Google Analytics & Google Tag Manager
    try {
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "virtual_pageview",
          page_path: window.location.pathname,
          page_title: document.title
        });

        if (typeof window.gtag === "function") {
          window.gtag("event", "page_view", {
            page_path: window.location.pathname,
            page_title: document.title
          });
        }
      }
    } catch {}

    // 1. Check custom overrides from Admin SEO Manager
    try {
      const customSEO = JSON.parse(localStorage.getItem("gif_custom_seo_tags") || "{}");
      const cleanRoute = route === "" ? "/" : route;
      if (customSEO[cleanRoute] && customSEO[cleanRoute].title) {
        setSEO(customSEO[cleanRoute].title, customSEO[cleanRoute].description || "GetIntoFeed Creative & Performance Growth Agency", cleanRoute);
        injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: customSEO[cleanRoute].title, path: cleanRoute }]));
        return;
      }
    } catch {}

    // 2. Automated default SEO rules
    if (route === "/" || route === "") {
      setSEO("GetIntoFeed | Creative Marketing & Performance Growth Agency", "Premier creative performance marketing studio in India. We engineer thumb-stopping video reels, high-converting funnels, and algorithmic paid media for ambitious brands. Trusted by founders and CMOs.", "/");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }]));
    } else if (route === "/services" || route === "/services/") {
      setSEO("Growth Services & Capabilities | GetIntoFeed", "Explore our 8 core growth disciplines: Brand Positioning, Paid Performance Ads, Video Reels, Web Development, SEO, and CRO Funnels.", "/services");
      injectSchema({ "@context": "https://schema.org", "@graph": [
        makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
        { "@type": "Service", "name": "Digital Marketing Services", "provider": { "@type": "Organization", "name": "GetIntoFeed", "url": "https://getintofeed.com" }, "areaServed": "India", "description": "Full-stack creative marketing: paid ads, video reels, SEO, brand strategy, influencer marketing, web development." }
      ]});
    } else if (route.startsWith("/services/")) {
      const slug = route.replace("/services/", "").replace(/\/.*$/, "");
      const cleanName = slug
        .replace(/-services-delhi-ncr$/, "")
        .replace(/-delhi-ncr$/, "")
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      setSEO(`${cleanName} Services in Delhi NCR | GetIntoFeed`, `Professional ${cleanName} services in Delhi NCR and Pan-India. Capture verified enquiries, high ROAS, and qualified customers.`, `/services/${slug}`);
      injectSchema({ "@context": "https://schema.org", "@graph": [
        makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: cleanName, path: `/services/${slug}` }]),
        { "@type": "Service", "name": `${cleanName} Services`, "provider": { "@type": "Organization", "name": "GetIntoFeed", "url": "https://getintofeed.com" }, "areaServed": "Delhi NCR, India" }
      ]});
    } else if (route === "/case-studies" || route === "/case-studies/" || route === "/work" || route === "/work/") {
      setSEO("Selected Case Studies & Commercial Results | GetIntoFeed", "Real client outcomes: +380% qualified pipeline, 4.8x blended ROAS, and 28,000+ verified customer acquisitions.", "/case-studies");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Case Studies", path: "/case-studies" }]));
    } else if (route.startsWith("/case-studies/") || route.startsWith("/work/")) {
      const slug = route.replace(/^\/(case-studies|work)\//, "").replace(/\/.*$/, "");
      const caseTitle = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      setSEO(`${caseTitle} Case Study | GetIntoFeed`, "Deep-dive campaign teardown, creative direction gallery, and measurable business outcomes.", `/case-studies/${slug}`);
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Case Studies", path: "/case-studies" }, { name: caseTitle, path: `/case-studies/${slug}` }]));
    } else if (route.startsWith("/about")) {
      setSEO("About GetIntoFeed | We Build Marketing That People Remember", "Our story, vision, mission, and philosophy. We eliminate bloated agency layers and deliver high-velocity creative sprints.", "/about");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]));
    } else if (route.startsWith("/pricing")) {
      setSEO("Transparent Growth Pricing & Plans | GetIntoFeed", "Clear pricing with zero hidden fees. Starter support from ₹10,500 onwards*, custom growth plans, and transparent deliverables.", "/pricing");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]));
    } else if (route.startsWith("/blog") || route.startsWith("/feed-notes")) {
      const slug = route.replace(/^\/(blog|feed-notes|insights)\/?/, "").replace(/\/.*$/, "");
      if (slug) {
        const articleTitle = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        setSEO(`${articleTitle} | Growth Marketing Blog | GetIntoFeed`, "Tactical marketing teardown, algorithmic short-form strategy, and commercial brand positioning.", route);
        injectSchema({ "@context": "https://schema.org", "@graph": [
          makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: articleTitle, path: route }]),
          { "@type": "Article", "headline": articleTitle, "author": { "@type": "Organization", "name": "GetIntoFeed" }, "publisher": { "@type": "Organization", "name": "GetIntoFeed", "url": "https://getintofeed.com" }, "mainEntityOfPage": { "@type": "WebPage", "@id": `https://getintofeed.com${route}` } }
        ]});
      } else {
        setSEO("Blog — Ideas that make your marketing work harder | GetIntoFeed", "Ads that spend but don't convert? Website visitors who don't call? Start with our straightforward fixes.", "/blog");
        injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]));
      }
    } else if (route.startsWith("/contact")) {
      setSEO("Contact Us — Let’s get your business noticed | GetIntoFeed", "Need Google Ads, social media, SEO or a website refresh? Reach us directly across Delhi NCR.", "/contact");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]));
    } else if (route.startsWith("/cookie-policy")) {
      setSEO("Cookie & Privacy Policy | GetIntoFeed", "Transparent overview of cookies, tracking signals, and user data privacy.", "/cookie-policy");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Cookie Policy", path: "/cookie-policy" }]));
    } else if (route.startsWith("/privacy")) {
      setSEO("Privacy Policy & DPDPA Compliance | GetIntoFeed", "Digital Personal Data Protection Act (DPDPA 2023) and GDPR data processing standards.", "/privacy");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }]));
    } else if (route.startsWith("/terms")) {
      setSEO("Terms of Commercial Service & Intellectual Property | GetIntoFeed", "Commercial sprint deliverables, IP transfer terms, and legal jurisdiction.", "/terms");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }]));
    } else if (route.startsWith("/refund") || route.startsWith("/cancellation")) {
      setSEO("Refund & Cancellation Policy | GetIntoFeed", "Transparent refund rules, sprint milestone approvals, and retainer cancellation terms.", "/refund-policy");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Refund Policy", path: "/refund-policy" }]));
    } else if (route.startsWith("/disclaimer")) {
      setSEO("Performance Disclaimer & Algorithm Notice | GetIntoFeed", "Ad platform algorithmic variances, third-party attribution policies, and performance estimates.", "/disclaimer");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Disclaimer", path: "/disclaimer" }]));
    } else if (route.startsWith("/nda") || route.startsWith("/confidentiality")) {
      setSEO("Mutual Non-Disclosure Agreement (NDA) | GetIntoFeed", "Confidentiality protection for client campaign data, ad accounts, and commercial trade secrets.", "/nda");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "NDA", path: "/nda" }]));
    } else if (route.startsWith("/reviews") || route.startsWith("/clients")) {
      setSEO("Client Reviews & Verified Testimonials | GetIntoFeed", "Verified testimonials, client ratings, and founder reviews for GetIntoFeed performance campaigns.", "/reviews");
      injectSchema(makeBreadcrumb([{ name: "Home", path: "/" }, { name: "Reviews", path: "/reviews" }]));
    } else if (route.startsWith("/admin")) {
      setSEO("Admin | GetIntoFeed", "Secure agency management operating system.", "/admin");
      const metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots) metaRobots.setAttribute("content", "noindex, nofollow");
    } else {
      setSEO("Page Not Found | GetIntoFeed", "The requested page does not exist.", route);
      const metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots) metaRobots.setAttribute("content", "noindex, nofollow");
    }
  }, [route]);
  

  useEffect(() => {
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#111714";

    const handlePopState = () => {
      const p = window.location.pathname;
      setRoute(p);
      document.body.style.backgroundColor = "#FFFFFF";
      document.body.style.color = "#111714";
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // FULL-STACK ROUTING LOGIC (LAZY-LOADED ON DEMAND)
  if (route.startsWith("/admin")) {
    return <RouteSuspense><AdminDashboard onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/pages/") || route.startsWith("/p/")) {
    const slug = route.replace(/^\/(pages|p)\//, "").replace(/\/.*$/, "");
    return <RouteSuspense><DynamicPage slug={slug} onNavigate={navigate} /></RouteSuspense>;
  }
  if (route === "/services" || route === "/services/") {
    return <RouteSuspense><ServicesHubPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/services/")) {
    const slug = route.replace("/services/", "").replace(/\/.*$/, "");
    return <RouteSuspense><ServiceDetailPage slug={slug} onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/about")) {
    return <RouteSuspense><AboutUsPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route === "/work" || route === "/work/") {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/case-studies");
    }
    return <RouteSuspense><WorkPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route === "/case-studies" || route === "/case-studies/") {
    return <RouteSuspense><WorkPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/work/")) {
    const slug = route.replace("/work/", "").replace(/\/.*$/, "");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/case-studies/${slug}`);
    }
    return <RouteSuspense><CaseStudyDetailPage slug={slug} onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/case-studies/")) {
    const slug = route.replace("/case-studies/", "").replace(/\/.*$/, "");
    return <RouteSuspense><CaseStudyDetailPage slug={slug} onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/pricing")) {
    return <RouteSuspense><PricingPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/feed-notes") || route.startsWith("/insights")) {
    const pathOnly = route.split("?")[0].split("#")[0];
    const parts = pathOnly.split("/").filter(Boolean);
    const cleanSlug = parts.length > 1 ? parts[1] : null;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", cleanSlug ? `/blog/${cleanSlug}` : "/blog");
    }
    return <RouteSuspense><FeedNotesPage slug={cleanSlug || null} onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/blog")) {
    const pathOnly = route.split("?")[0].split("#")[0];
    const parts = pathOnly.split("/").filter(Boolean);
    const cleanSlug = parts.length > 1 ? parts[1] : null;
    return <RouteSuspense><FeedNotesPage slug={cleanSlug || null} onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/contact")) {
    return <RouteSuspense><ContactPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/thank-you") || route.startsWith("/thankyou")) {
    return <RouteSuspense><ThankYouPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/audit")) {
    return <RouteSuspense><AuditPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/faqs") || route.startsWith("/faq")) {
    return <RouteSuspense><ServicesHubPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/awards") || route.startsWith("/careers")) {
    return <RouteSuspense><AboutUsPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/cookie-policy") || route.startsWith("/cookies")) {
    return <RouteSuspense><CookiePolicyPage onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/privacy")) {
    return <RouteSuspense><LegalPage type="privacy" onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/terms")) {
    return <RouteSuspense><LegalPage type="terms" onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/refund") || route.startsWith("/cancellation")) {
    return <RouteSuspense><LegalPage type="refund" onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/disclaimer")) {
    return <RouteSuspense><LegalPage type="disclaimer" onNavigate={navigate} /></RouteSuspense>;
  }
  if (route.startsWith("/nda") || route.startsWith("/confidentiality")) {
    return <RouteSuspense><LegalPage type="nda" onNavigate={navigate} /></RouteSuspense>;
  }

  // Direct Blog Slug Aliases (e.g., /how-metas-advantage-plus-changes-ecommerce or /meta-advantage-plus-ecommerce-scaling)
  const cleanRouteSlug = route.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
  const DIRECT_BLOG_ALIASES = {
    "how-metas-advantage-plus-changes-ecommerce": "meta-advantage-plus-ecommerce-scaling",
    "meta-advantage-plus-ecommerce-scaling": "meta-advantage-plus-ecommerce-scaling",
    "how-metas-advantage-plus-algorithm-changes-ecommerce-scaling-in-2026": "meta-advantage-plus-ecommerce-scaling",
    "advantage-plus": "meta-advantage-plus-ecommerce-scaling",
    "meta-advantage-plus": "meta-advantage-plus-ecommerce-scaling",
    "5-high-converting-hook-frameworks-for-tiktok-ads": "tiktok-reels-hook-frameworks",
    "tiktok-hook-frameworks": "tiktok-reels-hook-frameworks",
    "tiktok-reels-hook-frameworks": "tiktok-reels-hook-frameworks",
    "designing-landing-pages-that-convert-at-10-percent": "landing-page-ux-convert-10-percent",
    "designing-landing-pages-that-convert": "landing-page-ux-convert-10-percent",
    "landing-page-ux-convert-10-percent": "landing-page-ux-convert-10-percent",
    "why-your-retargeting-funnel-is-leaking-money": "retargeting-funnel-leaks-fix",
    "retargeting-funnel-leaks-fix": "retargeting-funnel-leaks-fix",
    "programmatic-seo-b2b-saas": "programmatic-seo-b2b-saas",
    "how-to-increase-form-conversions-generate-more-leads": "how-to-increase-form-conversions-generate-more-leads",
    "how-to-increase-form-conversions-generate-more-leads-in-2027": "how-to-increase-form-conversions-generate-more-leads",
    "form-conversions-2027": "how-to-increase-form-conversions-generate-more-leads",
    "how-to-increase-form-conversions": "how-to-increase-form-conversions-generate-more-leads",
    "increase-form-conversions-generate-more-leads": "how-to-increase-form-conversions-generate-more-leads",
    "increase-form-conversions": "how-to-increase-form-conversions-generate-more-leads",
    "7-ways-to-increase-form-field-conversion-rate": "how-to-increase-form-conversions-generate-more-leads",
    "ways-to-increase-form-field-conversion-rate": "how-to-increase-form-conversions-generate-more-leads",
    "form-field-conversion-rate": "how-to-increase-form-conversions-generate-more-leads",
    "increase-form-field-conversion-rate": "how-to-increase-form-conversions-generate-more-leads"
  };

  if (DIRECT_BLOG_ALIASES[cleanRouteSlug]) {
    return <RouteSuspense><FeedNotesPage slug={DIRECT_BLOG_ALIASES[cleanRouteSlug]} onNavigate={navigate} /></RouteSuspense>;
  }


  if (route.startsWith("/reviews") || route.startsWith("/clients")) {
    return <RouteSuspense><ReviewsPage onNavigate={navigate} /></RouteSuspense>;
  }

  if (route !== "/" && route !== "") {
    return <RouteSuspense><NotFoundPage onNavigate={navigate} /></RouteSuspense>;
  }

  // Canonical Homepage View
  return (
    <RouteSuspense>
      <HomePage onNavigate={navigate} homeBlogPosts={homeBlogPosts} />
    </RouteSuspense>
  );
}
