import React, { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout.jsx";
import ServicePageRenderer from "../components/ServicePageRenderer.jsx";
import { getStoredServices } from "../data/catalog.js";

const SERVICE_SLUG_ALIASES = {
  // Google Ads
  "google-ads": "google-ads",
  "google-ads-services-delhi-ncr": "google-ads",
  "search-ads": "google-ads",
  "google-ad": "google-ads",
  
  // Meta Ads
  "meta-ads": "meta-ads",
  "meta-ads-services-delhi-ncr": "meta-ads",
  "facebook-ads": "meta-ads",
  "instagram-ads": "meta-ads",
  "meta-ad": "meta-ads",

  // SEO & Local Search
  "seo": "seo",
  "seo-services-delhi-ncr": "seo",
  "seo-local": "seo",
  "local-seo": "seo",
  "strategy": "seo",

  // Social Media
  "social-media": "social-media",
  "social-media-marketing-delhi-ncr": "social-media",
  "influencer-marketing": "social-media",
  "influencer-network": "social-media",

  // Website Design
  "website-design": "website-design",
  "website-design-delhi-ncr": "website-design",
  "web-development": "website-design",
  "web-design": "website-design",
  "growth": "website-design",

  // Content & Creatives
  "content-marketing": "content-marketing",
  "content-creative-services-delhi-ncr": "content-marketing",
  "content-creatives": "content-marketing",
  "content-creation": "content-marketing",

  // Reels & Video Editing
  "reels": "reels",
  "reels-video": "reels",
  "reels-video-editing-delhi-ncr": "reels",
  "videos": "reels",

  // Graphic Design
  "graphic-design": "graphic-design",
  "graphic-design-services-delhi-ncr": "graphic-design",
  "graphics-design": "graphic-design",
  "branding": "graphic-design",
  "brand-identity": "graphic-design",

  // Fallbacks
  "ads-campaign": "google-ads",
  "performance-marketing": "meta-ads",
  "paid-ads": "google-ads",
  "analytics": "google-ads"
};

const SERVICE_TECH_STACKS = {
  "content-marketing": [
    { name: "Notion", desc: "Editorial Planning & Strategy" },
    { name: "Grammarly Business", desc: "Tone & Voice Consistency" },
    { name: "Semrush", desc: "High-Intent Search Topics" },
    { name: "Google Docs", desc: "Collaborative Editorial Reviews" }
  ],
  "ads-campaign": [
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
  "graphics-design": [
    { name: "Figma", desc: "Design Systems & Token Architecture" },
    { name: "Adobe Illustrator", desc: "Vector Logos & Geometry" },
    { name: "Photoshop", desc: "High-CTR Ad Creatives & Compositing" },
    { name: "After Effects", desc: "Motion Brand Assets" },
    { name: "FontBase", desc: "Type Hierarchy Engine" }
  ],
  "reels": [
    { name: "Adobe Premiere Pro", desc: "Dynamic 9:16 Cuts" },
    { name: "CapCut Pro", desc: "Trending Audio & Auto-Captions" },
    { name: "After Effects", desc: "Kinetic Subtitles & 3D Hooks" },
    { name: "Sony FX3 & A7IV", desc: "4K Studio Production Rigs" },
    { name: "Frame.io", desc: "Rapid Review & Delivery" }
  ],
  "videos": [
    { name: "Sony Cinema Line", desc: "4K 10-bit Video Acquisition" },
    { name: "DaVinci Resolve Studio", desc: "Color Science & ACES Grading" },
    { name: "Adobe Premiere Pro", desc: "Commercial Pacing & Sound Design" },
    { name: "Sennheiser Audio", desc: "Broadcast Quality Audio Capture" }
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
  ]
};

const SERVICE_CASE_STUDY_MAP = {
  "content-marketing": "glowup-skincare",
  "ads-campaign": "glowup-skincare",
  "social-media": "glowup-skincare",
  "graphics-design": "luxeliving-realty",
  "reels": "glowup-skincare",
  "videos": "glowup-skincare",
  "web-development": "apex-fintech",
  "seo": "apex-fintech"
};

// =========================================================================
// SERVICE DETAIL PAGE (/services/:slug)  — FULLY DYNAMIC DATA-DRIVEN RENDERER
// =========================================================================

export function ServiceDetailPage({ slug, onNavigate }) {
  const currentServices = getStoredServices();
  const canonicalSlug = SERVICE_SLUG_ALIASES[slug] || slug;
  
  // Safe lookup from current catalog: exact match, alias match, or regional slug match
  const matchedService = currentServices.find((s) => 
    s.slug === slug || 
    s.slug === canonicalSlug || 
    (s.slug && s.slug.replace(/-services-delhi-ncr$/, '') === (canonicalSlug || slug).replace(/-services-delhi-ncr$/, ''))
  ) || null;

  const [service, setService] = useState(matchedService);
  const [loading, setLoading] = useState(!matchedService);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState(matchedService?.title || matchedService?.name || "Growth Engineering");

  useEffect(() => {
    let isMounted = true;
    if (!matchedService) setLoading(true);

    fetch(`/api/services/${encodeURIComponent(canonicalSlug || slug)}?t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return { success: false, notFound: true };
          throw new Error("Service fetch failed");
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.success && data.service) {
            setService(data.service);
            setSelectedServiceTitle(data.service.title || data.service.name);
          } else if (data.notFound) {
            setService(null);
          } else {
            setService(matchedService);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setService(matchedService);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, canonicalSlug]);

  const handleOpenModal = (svcTitle) => {
    setSelectedServiceTitle(svcTitle || (service && (service.title || service.name)) || "Growth Engineering");
    setLeadModalOpen(true);
  };

  if (loading && !service) {
    return (
      <PageLayout onNavigate={onNavigate} activeNav="services">
        <div className="py-32 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-inter text-sm mt-4 font-medium">Loading service details...</p>
        </div>
      </PageLayout>
    );
  }

  if (!service && !loading) {
    return (
      <PageLayout onNavigate={onNavigate} activeNav="services">
        <div className="py-24 text-center max-w-lg mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mb-4 font-bold text-2xl font-space">
            404
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-space">Service Not Found</h2>
          <p className="text-slate-500 mt-2 font-inter text-sm leading-relaxed">
            The requested service &lsquo;{slug}&rsquo; does not exist, has been unpublished, or was moved.
          </p>
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate("/services") : (window.location.href = "/services")}
            className="mt-6 px-6 py-3 bg-slate-900 hover:bg-[#b5e200] hover:text-slate-950 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer border-none transition-colors inline-flex items-center gap-2"
          >
            <span>Explore All Services</span>
            <span>→</span>
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      onNavigate={onNavigate}
      activeNav="services"
      fullWidth={true}
      leadModalOpen={leadModalOpen}
      setLeadModalOpen={setLeadModalOpen}
      selectedService={selectedServiceTitle}
      setSelectedService={setSelectedServiceTitle}
    >
      <ServicePageRenderer
        service={service}
        allServices={currentServices}
        onNavigate={onNavigate}
        onOpenModal={handleOpenModal}
      />
    </PageLayout>
  );
}


export default ServiceDetailPage;
