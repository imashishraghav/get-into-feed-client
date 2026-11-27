import React, { useState, useEffect, useMemo } from "react";
import { Check, X, Search, Instagram, Layout, Sparkles, Clapperboard, Palette, BarChart3, ChevronDown, ChevronUp, Phone } from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";
import { getStoredServices, API_URL, trackLeadConversion, servicesCatalog } from "../DetailPages.jsx";
import { enrichWithAttribution } from "../utils/utm.js";

export function ServicesHubPage({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Google Ads");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", business: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 300ms Debounce for live services search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Our Services — GetIntoFeed Digital Marketing";
  }, []);

  const openServiceModal = (serviceName) => {
    setModalTitle(serviceName);
    setSubmitted(false);
    setModalOpen(true);
  };

  const closeServiceModal = () => {
    setModalOpen(false);
    setSubmitted(false);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  const submitServiceEnquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichWithAttribution({
          name: formData.name,
          phone: formData.phone || null,
          email: formData.email || null,
          company: formData.business || null,
          service: modalTitle,
          message: formData.note ? `[Challenge: ${formData.note}]` : `[Service: ${modalTitle}]`,
          source: "Services Hub Quick Plan Modal",
          form_type: "Services Hub Quick Plan Modal",
          consent: true
        }))
      });
      trackLeadConversion({
        service: modalTitle,
        source: "services_hub_modal",
        business: formData.business
      });
    } catch (err) {
      console.warn("Lead submit error:", err);
    }
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      closeServiceModal();
      setFormData({ name: "", phone: "", email: "", business: "", note: "" });
    }, 1800);
  };

  const [services, setServices] = useState(() => {
    const stored = getStoredServices();
    return (Array.isArray(stored) && stored.length > 0) ? stored : (servicesCatalog || []);
  });
  const [loading, setLoading] = useState(false);

  // REAL-TIME SYNCHRONIZATION WITH LARAVEL BACKEND CMS
  // Whenever an admin deletes, drafts, edits, or adds a service, this updates in real time!
  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const res = await fetch(`/api/services?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.services)) {
            setServices(data.services);
            try {
              localStorage.setItem("gif_services_catalog", JSON.stringify(data.services));
            } catch {}
          }
        }
      } catch (err) {
        // Silently use cached/stored services
      }
    };

    fetchServices();
    // 10-second polling for real-time frontend updates on delete/create/update in CMS
    const pollInterval = setInterval(fetchServices, 10000);
    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  // Helper to normalize any service (live API record or fallback catalog) into a card model
  const normalizeService = (s) => {
    const slug = s.slug || "";
    const name = s.name || s.title || "Growth Service";
    const category = s.category || "Performance Marketing";
    const categoryLabel = (s.hero_badge || category).toUpperCase();
    const pricing = s.pricing_tier || s.pricingTier || "";

    let deliverables = [];
    if (Array.isArray(s.deliverables) && s.deliverables.length > 0) {
      deliverables = s.deliverables.map(d => typeof d === "string" ? d : (d.title || d.name || String(d))).filter(Boolean);
    } else if (Array.isArray(s.what_we_do) && s.what_we_do.length > 0) {
      deliverables = s.what_we_do.map(d => typeof d === "string" ? d : (d.title || d.name || String(d))).filter(Boolean);
    } else {
      deliverables = ["High-ROI Strategy & Execution", "Transparent Weekly Reporting", "Dedicated Account Manager"];
    }
    deliverables = deliverables.slice(0, 3);

    const problem = s.problem_summary || s.problem_heading || "Facing scaling friction or low conversions?";
    const rawSolution = s.how_deal_content 
      ? s.how_deal_content.replace(/<[^>]+>/g, '').trim().slice(0, 95)
      : (s.short_description || s.shortDesc || "Engineered for high ROAS and predictable customer acquisition.");
    const solution = rawSolution.endsWith('.') ? rawSolution : `${rawSolution}...`;

    let gradient = "card-gradient-blue";
    let borderColor = "border-slate-200/90 hover:border-blue-400";
    let iconType = "web";
    const combined = `${category} ${slug} ${name}`.toLowerCase();

    if (combined.includes("google") || combined.includes("search ad")) {
      iconType = "google";
      gradient = "card-gradient-blue";
      borderColor = "border-slate-200/90 hover:border-blue-400";
    } else if (combined.includes("meta") || combined.includes("facebook") || combined.includes("instagram") || combined.includes("paid")) {
      iconType = "meta";
      gradient = "card-gradient-blue";
      borderColor = "border-slate-200/90 hover:border-blue-400";
    } else if (combined.includes("seo") || combined.includes("search") || combined.includes("programmatic")) {
      iconType = "seo";
      gradient = "card-gradient-green";
      borderColor = "border-emerald-200/80 hover:border-emerald-400";
    } else if (combined.includes("social") || combined.includes("influencer")) {
      iconType = "social";
      gradient = "card-gradient-pink";
      borderColor = "border-pink-200/70 hover:border-pink-400";
    } else if (combined.includes("video") || combined.includes("reel") || combined.includes("creative")) {
      iconType = "reels";
      gradient = "card-gradient-purple";
      borderColor = "border-purple-200/70 hover:border-purple-400";
    } else if (combined.includes("analytics") || combined.includes("attribution") || combined.includes("tracking")) {
      iconType = "analytics";
      gradient = "card-gradient-green";
      borderColor = "border-emerald-200/80 hover:border-emerald-400";
    } else if (combined.includes("web") || combined.includes("cro") || combined.includes("dev")) {
      iconType = "web";
      gradient = "card-gradient-blue";
      borderColor = "border-2 border-t-[#b5e200] border-slate-200/90 hover:border-blue-400";
    }

    return {
      id: s.id || slug,
      name,
      slug,
      category,
      categoryLabel,
      pricing,
      gradient,
      borderColor,
      iconType,
      problem,
      solution,
      deliverables,
      detailRoute: `/services/${slug}`
    };
  };

  const normalizedServices = useMemo(() => {
    return services.map(normalizeService);
  }, [services]);

  const serviceCategories = [
    { id: "all", label: "All Services" },
    { id: "Paid Ads", label: "Paid Ads" },
    { id: "SEO & Search", label: "SEO & Search" },
    { id: "Web & CRO", label: "Web & CRO" },
    { id: "Creative & Reels", label: "Creative & Reels" },
    { id: "Social & Influencer", label: "Social & Influencer" }
  ];

  const filteredServices = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return normalizedServices.filter((s) => {
      // 1. Category filter
      let matchCat = true;
      if (activeCategory !== "all") {
        const cat = (s.category || "").toLowerCase();
        const slug = (s.slug || "").toLowerCase();
        const label = (s.categoryLabel || "").toLowerCase();
        if (activeCategory === "Paid Ads") {
          matchCat = cat.includes("paid") || cat.includes("performance") || cat.includes("ad") || slug.includes("ad") || label.includes("ad");
        } else if (activeCategory === "SEO & Search") {
          matchCat = cat.includes("seo") || cat.includes("search") || slug.includes("seo") || slug.includes("google") || label.includes("seo");
        } else if (activeCategory === "Web & CRO") {
          matchCat = cat.includes("web") || cat.includes("cro") || slug.includes("web") || label.includes("web");
        } else if (activeCategory === "Creative & Reels") {
          matchCat = cat.includes("creative") || cat.includes("design") || cat.includes("video") || cat.includes("reel") || slug.includes("reel") || slug.includes("graphic") || slug.includes("content") || label.includes("creative") || label.includes("video");
        } else if (activeCategory === "Social & Influencer") {
          matchCat = cat.includes("social") || cat.includes("influencer") || cat.includes("content") || slug.includes("social") || label.includes("social");
        } else {
          matchCat = s.category === activeCategory;
        }
      }
      if (!matchCat) return false;

      // 2. Live search query filter
      if (!q) return true;
      const nameMatch = (s.name || "").toLowerCase().includes(q);
      const problemMatch = (s.problem || "").toLowerCase().includes(q);
      const solutionMatch = (s.solution || "").toLowerCase().includes(q);
      const catMatch = (s.category || "").toLowerCase().includes(q) || (s.categoryLabel || "").toLowerCase().includes(q);
      const delivMatch = Array.isArray(s.deliverables) && s.deliverables.some(d => d.toLowerCase().includes(q));

      return nameMatch || problemMatch || solutionMatch || catMatch || delivMatch;
    });
  }, [normalizedServices, activeCategory, debouncedSearch]);

  const renderServiceIcon = (type) => {
    switch (type) {
      case "google":
        return (
          <svg className="w-6 h-6" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FBBC04" d="M12.2 141.6L70.1 41.3c8.1-14 26-18.8 40-10.7 14 8.1 18.8 26 10.7 40l-57.9 100.3c-8.1 14-26 18.8-40 10.7-14-8.1-18.8-26-10.7-40z"/>
            <path fill="#4285F4" d="M179.8 141.6L121.9 41.3c-8.1-14-26-18.8-40-10.7-14 8.1 18.8 26 10.7 40l57.9 100.3c8.1 14 26 18.8 40 10.7 14-8.1 18.8-26 10.7-40z"/>
            <circle fill="#34A853" cx="37.6" cy="156.3" r="29.3"/>
          </svg>
        );
      case "meta":
        return (
          <svg className="w-6 h-6" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="metaGradHub" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#0064E0"/>
                <stop offset="50%" stopColor="#0082FB"/>
                <stop offset="100%" stopColor="#0099FF"/>
              </linearGradient>
            </defs>
            <path d="M27.3 2C24.1 2 21.6 3.9 19.6 6.7C18.9 5.5 18.1 4.4 17.1 3.6C15.3 2.5 13.1 2 10.7 2C5.5 2 1.5 6.3 1.5 12.2C1.5 17.8 5.2 22 9.9 22C12.8 22 15.2 20.3 17.7 16.5C17.7 16.5 19.2 14.1 20.1 12.6C20.9 14 22.1 16.1 23.1 17.5C25.2 20.5 27.4 22 30.2 22C34.8 22 38.5 17.8 38.5 12.1C38.5 6.2 33.6 2 27.3 2ZM14.6 14.4C12.7 17.3 11.4 18.2 9.8 18.2C7.1 18.2 5.3 15.7 5.3 12.2C5.3 8.4 7.5 5.8 10.6 5.8C12.9 5.8 14.6 7.1 16.8 10.7C15.9 12.2 14.6 14.4 14.6 14.4ZM29.9 18.2C28.3 18.2 26.9 17.1 25.1 14.4C24.2 13 23.1 11.1 22.2 9.6C24 6.9 25.5 5.8 27.5 5.8C31.3 5.8 34.7 8.4 34.7 12.1C34.7 15.7 32.6 18.2 29.9 18.2Z" transform="translate(-2, 0)" fill="url(#metaGradHub)"/>
          </svg>
        );
      case "seo":
        return <Search className="w-5 h-5 text-emerald-600" />;
      case "social":
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case "web":
        return <Layout className="w-5 h-5 text-blue-600" />;
      case "content":
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case "reels":
        return <Clapperboard className="w-5 h-5 text-purple-600" />;
      case "design":
        return <Palette className="w-5 h-5 text-rose-500" />;
      case "analytics":
        return <BarChart3 className="w-5 h-5 text-emerald-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <PageLayout
      onNavigate={onNavigate}
      activeNav="services"
      fullWidth={true}
    >
      <div className="w-full max-w-full overflow-x-hidden font-sans text-slate-900 bg-white antialiased selection:bg-[#d2ff00] selection:text-slate-950">
        
        {/* HERO SECTION (Optimized for Mobile & Desktop with Adaptive Graphic) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10">
          <div className="services-hero-bg rounded-3xl p-6 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-slate-800/90 min-h-[300px] flex items-center">
            
            {/* Decorative Geometric Ring (Ambient on mobile, prominent on desktop) */}
            <div className="absolute -right-16 -top-10 sm:right-6 sm:top-1/2 sm:-translate-y-1/2 pointer-events-none select-none opacity-20 sm:opacity-90 transition-opacity">
              <div className="relative w-56 h-56 sm:w-80 sm:h-80">
                <div className="w-full h-full rounded-full border-[24px] sm:border-[36px] border-[#d2ff00]/25 flex items-center justify-center">
                  <svg className="w-14 h-14 sm:w-20 sm:h-20 text-[#d2ff00]/50 -translate-x-4 sm:-translate-x-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
                  </svg>
                </div>
                <div className="absolute -top-4 right-4 w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-[#d2ff00]/40 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#d2ff00]/30"></div>
                </div>
              </div>
            </div>

            {/* Hero Copy & Mobile-Friendly Action Buttons */}
            <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#e7ff8a]">
                <span className="w-[11px] h-[11px] rounded-[3px] bg-[#d4ff00] border-2 border-[#2563eb] inline-block shrink-0 box-border" />
                OUR SERVICES
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-[-0.035em] leading-[1.08] text-white">
                Make your business <br className="hidden sm:inline" />
                <span className="text-[#d4ff00]">stand out online.</span>
              </h1>

              <p className="text-[#d4dcf0] text-[14.5px] sm:text-[15px] leading-[1.55] max-w-xl font-normal pt-1">
                Google Ads, SEO, websites, content, graphic design and video editing. Choose what your business needs—without paying for the rest.
              </p>

              {/* Mobile-Friendly Hero Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#all-services"
                  className="px-5 py-3 rounded-xl bg-[#d2ff00] hover:bg-[#b5e200] text-slate-950 font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition shadow-sm active:scale-[0.98]"
                >
                  <span>Explore Services</span>
                  <span className="font-extrabold">↓</span>
                </a>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('/contact');
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 border border-slate-700 transition active:scale-[0.98] no-underline"
                >
                  <Phone className="w-4 h-4 text-slate-300" />
                  <span>Contact Us ↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: 8 SERVICE CARDS WITH FILTER TABS */}
        <section id="all-services" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-blue-600 mb-2">
              <span className="w-2 h-2 rounded-sm bg-[#d2ff00] ring-2 ring-blue-600"></span>
              CHOOSE A STARTING POINT
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
              Choose the service that solves your biggest problem.
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mt-2 sm:mt-3 leading-relaxed">
              Google Ads, local SEO, websites, social media and creatives—with clear tasks, realistic budgets and direct conversations with the people doing the work.
            </p>
          </div>

          {/* Filter & Live Search Toolbar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm">
              
              {/* Category Filter Tabs */}
              <div className="flex flex-nowrap overflow-x-auto items-center gap-2 pb-1 lg:pb-0" style={{ scrollbarWidth: "none" }}>
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                      activeCategory === cat.id
                        ? "bg-slate-950 text-white shadow-sm ring-1 ring-slate-900"
                        : "bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Live Search Input with Clear Button & Keyboard Navigation */}
              <div className="relative w-full lg:w-72 flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search services (e.g., Google Ads, SEO, Reels)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchQuery("");
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2 text-xs font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 transition shadow-sm"
                  aria-label="Search services"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    title="Clear search (Esc)"
                    aria-label="Clear search input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Query & Result Count Status Bar */}
            {(debouncedSearch.trim() || activeCategory !== "all") && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    Showing {filteredServices.length} of {normalizedServices.length} services
                  </span>
                  {debouncedSearch.trim() && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d2ff00]/25 text-slate-950 text-[11px] font-semibold border border-[#d2ff00]/60">
                      Query: &ldquo;{debouncedSearch}&rdquo;
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-slate-500 hover:text-slate-950 ml-0.5 cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {activeCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                      Category: {serviceCategories.find(c => c.id === activeCategory)?.label || activeCategory}
                      <button
                        type="button"
                        onClick={() => setActiveCategory("all")}
                        className="text-blue-500 hover:text-blue-900 ml-0.5 cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer underline"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredServices.length === 0 ? (
              <div className="col-span-full py-16 px-6 text-center bg-slate-50 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#d2ff00]/30 text-slate-900 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-slate-800" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-950 mb-2">No services match your criteria</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                  We couldn't find any service matching {debouncedSearch ? <span>query &ldquo;<strong>{debouncedSearch}</strong>&rdquo;</span> : ""} {activeCategory !== "all" ? <span>in category &ldquo;<strong>{activeCategory}</strong>&rdquo;</span> : ""}. Try searching for terms like &ldquo;Google Ads&rdquo;, &ldquo;Meta&rdquo;, &ldquo;SEO&rdquo;, &ldquo;Web&rdquo;, or &ldquo;Reels&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                  className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-2 transition cursor-pointer active:scale-95 shadow-sm"
                >
                  <span>Reset All Filters</span>
                  <span>↺</span>
                </button>
              </div>
            ) : (
              filteredServices.map((card) => (
                <div
                  key={card.id}
                  className={`${card.gradient} rounded-2xl p-6 border ${card.borderColor} shadow-sm hover:shadow-md transition flex flex-col justify-between`}
                >
                  <div>
                    <a
                      href={`/services/${card.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNavigate) onNavigate(`/services/${card.slug}`);
                      }}
                      className="block group no-underline text-inherit cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                        {renderServiceIcon(card.iconType)}
                      </div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block truncate">
                          {card.categoryLabel}
                        </span>
                        {card.pricing && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
                            {card.pricing}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-950 mb-2 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                        <span>{card.name}</span>
                        <span className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h3>
                    </a>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {card.problem} <strong className="text-slate-900">{card.solution}</strong>
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 font-medium mb-6 border-t border-slate-100 pt-3.5">
                      {card.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action Buttons (Direct Connection to Inner Pages + Modal fallback) */}
                  <div className="pt-3 border-t border-slate-100/90 flex items-center gap-2">
                    <a
                      href={`/services/${card.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNavigate) onNavigate(`/services/${card.slug}`);
                      }}
                      className="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition active:scale-[0.98] shadow-sm no-underline cursor-pointer"
                      title={`View ${card.name} details & packages`}
                    >
                      <span>View Details</span>
                      <span>→</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => openServiceModal(card.name)}
                      className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1 transition border border-slate-200 active:scale-[0.98] cursor-pointer"
                      title="Request quick starting plan & pricing"
                    >
                      <span>Plan</span>
                      <span>⚡</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION 3: WHAT FITS? ("Find the right place to begin.") */}
        <section id="starting-point" className="py-12 sm:py-16 bg-[#f4f7ff] border-y border-blue-100/80 mt-4 sm:mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-blue-600 mb-2">
                <span className="w-2 h-2 rounded-sm bg-[#d2ff00] ring-2 ring-blue-600"></span>
                WHAT FITS?
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                Find the right place to begin.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Match your exact business roadblock to the fastest growth lever.
              </p>
            </div>

            {/* 2x2 Diagnostic Grid with Direct Inner Page Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              
              {/* Box 1 */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                    IF YOUR PROBLEM IS...
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold text-slate-950 mb-2">
                    People search but do not find you
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    Search-based advertising can help you show up at the very top of Google for relevant customer queries immediately.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="/services/google-ads-services-delhi-ncr"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate('/services/google-ads-services-delhi-ncr');
                    }}
                    className="min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition shadow-sm active:scale-[0.98] no-underline cursor-pointer"
                  >
                    <span>Explore Google Ads</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => openServiceModal('Google Ads')}
                    className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition border border-blue-200 cursor-pointer active:scale-[0.98]"
                    title="Get Quick Google Ads Plan"
                  >
                    <span>Plan ⚡</span>
                  </button>
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                    IF YOUR PROBLEM IS...
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold text-slate-950 mb-2">
                    Your ads get attention, not messages
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    A clearer offer, WhatsApp click ads, and direct inquiry forms will convert passive viewers into genuine leads.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="/services/meta-ads-services-delhi-ncr"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate('/services/meta-ads-services-delhi-ncr');
                    }}
                    className="min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition shadow-sm active:scale-[0.98] no-underline cursor-pointer"
                  >
                    <span>Explore Meta Ads</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => openServiceModal('Meta Ads')}
                    className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition border border-indigo-200 cursor-pointer active:scale-[0.98]"
                    title="Get Quick Meta Ads Plan"
                  >
                    <span>Plan ⚡</span>
                  </button>
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                    IF YOUR PROBLEM IS...
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold text-slate-950 mb-2">
                    Your site has little search visibility
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    Improve Google Business Profile Maps ranking and on-page service search terms to win organic inbound inquiries.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="/services/seo-services-delhi-ncr"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate('/services/seo-services-delhi-ncr');
                    }}
                    className="min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition shadow-sm active:scale-[0.98] no-underline cursor-pointer"
                  >
                    <span>Explore SEO</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => openServiceModal('SEO & Local Search')}
                    className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition border border-emerald-200 cursor-pointer active:scale-[0.98]"
                    title="Get Quick SEO Plan"
                  >
                    <span>Plan ⚡</span>
                  </button>
                </div>
              </div>

              {/* Box 4 */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                    IF YOUR PROBLEM IS...
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold text-slate-950 mb-2">
                    People visit but do not get in touch
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    A faster mobile website with clear pricing hooks and direct WhatsApp triggers makes the next step effortless.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="/services/website-design-delhi-ncr"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate('/services/website-design-delhi-ncr');
                    }}
                    className="min-h-[44px] flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition shadow-sm active:scale-[0.98] no-underline cursor-pointer"
                  >
                    <span>Explore Website Design</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => openServiceModal('Website Design')}
                    className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition border border-blue-200 cursor-pointer active:scale-[0.98]"
                    title="Get Quick Website Plan"
                  >
                    <span>Plan ⚡</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4: SERVICES FAQ */}
        <section id="faq" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">COMMON QUESTIONS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Services FAQ
            </h2>
          </div>

          <div className="space-y-3">
            {/* FAQ 1 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <button
                type="button"
                className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 hover:bg-slate-50 transition cursor-pointer bg-transparent border-none min-h-[52px]"
                onClick={() => toggleFaq(0)}
              >
                <span>Do I have to take all the services together?</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${openFaqIndex === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-5 sm:px-6 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  Not at all. You can start with just one service that solves your most urgent bottleneck (for example, Google Ads for immediate enquiries or Website Design to fix poor conversions) and add more channels only when you are ready.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <button
                type="button"
                className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 hover:bg-slate-50 transition cursor-pointer bg-transparent border-none min-h-[52px]"
                onClick={() => toggleFaq(1)}
              >
                <span>What is the minimum budget required to start?</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${openFaqIndex === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-5 sm:px-6 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  Our starter single-service support begins from <strong className="text-slate-900">₹10,500/month*</strong>. If you are running paid ads (Google or Meta), your ad spend goes directly to the platform based on your comfort level (typically ₹500–₹1,500/day for local SMBs).
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <button
                type="button"
                className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 hover:bg-slate-50 transition cursor-pointer bg-transparent border-none min-h-[52px]"
                onClick={() => toggleFaq(2)}
              >
                <span>How long does it take to see real results?</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${openFaqIndex === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-5 sm:px-6 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  Google Ads and Meta Ads can go live within 4–5 days and start generating clicks and enquiries in the first week. Website redesigns take 1 to 3 weeks, while SEO &amp; Local Search build steady organic momentum over 8 to 12 weeks.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 5: BOTTOM LIME GREEN CTA BANNER */}
        <section id="cta-banner" className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="rounded-3xl bg-gradient-to-r from-[#d2ff00] via-[#d8ff29] to-[#b8f542] p-6 sm:px-12 sm:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-lime-400">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Not sure where to start?
              </h2>
              <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1">
                Tell us what is not working. We will help you choose one sensible next step.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openServiceModal('General Project Consultation')}
                className="min-h-[44px] flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shrink-0 transition shadow-sm cursor-pointer border-none active:scale-[0.98]"
              >
                <span>Talk about your project</span>
                <span>↗</span>
              </button>
              <a
                href="tel:+918810356950"
                className="min-h-[44px] flex-1 sm:flex-initial px-5 py-3.5 rounded-xl bg-white/90 hover:bg-white text-slate-950 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shrink-0 transition border border-slate-300 active:scale-[0.98] no-underline"
              >
                <Phone className="w-4 h-4 text-slate-800" />
                <span>Call +91 88103 56950</span>
              </a>
            </div>
          </div>
        </section>

        {/* Interactive Quick Service Enquiry Modal (Optimized for Mobile) */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
              <button
                type="button"
                onClick={closeServiceModal}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer border-none"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-300/60 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                ⚡ Quick Service Plan
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-1 pr-6">
                {modalTitle}
              </h3>
              <p className="text-xs text-slate-600 mb-5">
                Tell us a bit about your business and we will share a practical starting plan &amp; pricing.
              </p>

              <form onSubmit={submitServiceEnquiry} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aman Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-blue-600 bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-blue-600 bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Business Type &amp; City *</label>
                  <input
                    type="text"
                    required
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    placeholder="e.g. Interior Designer in Gurgaon"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-blue-600 bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">What is your main challenge right now?</label>
                  <textarea
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="e.g. Getting clicks but not enough phone calls..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-blue-600 bg-white text-slate-900 resize-none"
                  />
                </div>
                {submitted && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                    Thank you! We have received your request and will get back to you shortly.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[46px] py-3 rounded-xl bg-[#254bdb] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer border-none disabled:opacity-75 active:scale-[0.98]"
                >
                  <span>{submitting ? "Sending..." : "Request Plan & Pricing"}</span>
                  <span>↗</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

// =========================================================================

export default ServicesHubPage;
