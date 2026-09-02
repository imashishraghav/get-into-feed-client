import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Flame,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Send,
  Sparkles,
  TrendingUp,
  X,
  Zap
} from "lucide-react";
import WhatsAppWidget from "./components/WhatsAppWidget";
import AdminDashboard from "./Admin";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

export default function App() {
  const [route, setRoute] = useState(window.location.pathname || "/");
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedIndustryCategory, setSelectedIndustryCategory] = useState("all");
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedServiceForLead, setSelectedServiceForLead] = useState("General Inbound");

  // Lead Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    service: "Content & Paid Growth",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service: selectedServiceForLead || formData.service,
          source: "Canvas Same-to-Same Landing Page"
        })
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setLeadModalOpen(false);
          setFormData({ name: "", email: "", phone: "", website: "", service: "Content & Paid Growth", message: "" });
        }, 2000);
      } else {
        alert("Thanks! Your message has been received. Our team will contact you on WhatsApp/Phone shortly.");
        setLeadModalOpen(false);
      }
    } catch {
      alert("Thanks! Your message has been received. Our team will contact you on WhatsApp/Phone shortly.");
      setLeadModalOpen(false);
    }
    setSubmitting(false);
  };

  // If on /admin route, render full Admin OS
  if (route.startsWith("/admin")) {
    return <AdminDashboard onNavigate={navigate} />;
  }

  // 12 Industries from Canvas
  const industries = [
    {
      id: "real-estate",
      category: "b2b",
      title: "Real Estate",
      desc: "Luxury properties, developers, brokers and co-living spaces needing high-intent buyer inquiries.",
      metrics: ["High-ticket lead gen", "Drone & video-first tours", "Hyper-local geo-targeting"]
    },
    {
      id: "d2c",
      category: "ecommerce",
      title: "D2C & E-Commerce",
      desc: "Apparel, beauty, lifestyle, and consumer goods driving high-velocity orders and compounding ROAS.",
      metrics: ["Creative-led performance ads", "Thumb-stopping product reels", "Retention email/SMS flows"]
    },
    {
      id: "hospitality",
      category: "lifestyle",
      title: "Hospitality",
      desc: "Resorts, boutique hotels, cloud kitchens, fine dining and nightlife creating viral experiential FOMO.",
      metrics: ["Aesthetic food & space reels", "Influencer collaboration engine", "Event & weekend campaign blitzes"]
    },
    {
      id: "healthcare",
      category: "services",
      title: "Healthcare & Wellness",
      desc: "Clinics, wellness centers, nutraceuticals and premium health apps building trust and patient bookings.",
      metrics: ["Trust-first authority content", "Doctor & expert-led short video", "Localized search & maps rank"]
    },
    {
      id: "education",
      category: "b2b",
      title: "Education",
      desc: "EdTech platforms, coaching academies, universities and skill bootcamps scaling student enrollments.",
      metrics: ["Student transformation stories", "Webinar & funnel acquisition", "Omnichannel paid scale"]
    },
    {
      id: "automotive",
      category: "b2b",
      title: "Automotive",
      desc: "Dealerships, EV startups, luxury detailing studios and aftermarket brands commanding road presence.",
      metrics: ["Cinematic vehicle showcases", "Drive experience viral hooks", "Test-drive booking ads"]
    },
    {
      id: "fashion",
      category: "ecommerce",
      title: "Fashion & Beauty",
      desc: "Runway labels, streetwear brands, skincare formulas and cosmetics demanding cult-like visual aesthetics.",
      metrics: ["Lookbook reels & TikTok formats", "Creator gifting & seeding", "High-conversion product pages"]
    },
    {
      id: "pro-services",
      category: "services",
      title: "Professional Services",
      desc: "Law firms, accounting practices, architecture studios and consultancies capturing corporate retainer clients.",
      metrics: ["Executive LinkedIn thought leadership", "Case study breakdown videos", "High-ticket appointment funnels"]
    },
    {
      id: "tech-startups",
      category: "b2b",
      title: "Startups & Tech",
      desc: "SaaS tools, AI platforms, fintech apps and venture-backed startups scaling user acquisition.",
      metrics: ["Product demo motion graphics", "Founder story storytelling", "CAC reduction & activation funnels"]
    },
    {
      id: "fitness",
      category: "lifestyle",
      title: "Fitness & Sports",
      desc: "Gym chains, fitness creators, activewear gear and sports academies driving passionate community memberships.",
      metrics: ["High-energy workout reels", "Transformation proof posts", "Member challenge campaigns"]
    },
    {
      id: "travel",
      category: "lifestyle",
      title: "Travel & Experiences",
      desc: "Travel agencies, experiential retreats, adventure tour operators and destination curators inspiring wanderlust.",
      metrics: ["Wanderlust cinematic reels", "Seasonal getaway ads", "Direct booking lead funnels"]
    },
    {
      id: "finance",
      category: "services",
      title: "Finance",
      desc: "Fintech apps, investment advisory, insurance aggregators and wealth desks translating complex finance into clarity.",
      metrics: ["Simplifying complex finance reels", "Compliance-ready ad creative", "High-trust lead funnels"]
    }
  ];

  const filteredIndustries = selectedIndustryCategory === "all"
    ? industries
    : industries.filter(ind => ind.category === selectedIndustryCategory);

  return (
    <div className="canvas-agency-body">
      {/* 1. TOP NOTICE RIBBON (ELECTRIC LIME BANNER) */}
      {showTopBar && (
        <div className="top-banner-lime">
          <div className="top-banner-inner">
            <Zap size={14} className="banner-zap-icon" />
            <p className="banner-text">
              NOW TAKING ON 3 NEW BRANDS THIS MONTH — LET'S BUILD SOMETHING PEOPLE CAN'T SCROLL PAST.
            </p>
            <button
              type="button"
              onClick={() => { setSelectedServiceForLead("High-Growth Retainer"); setLeadModalOpen(true); }}
              className="banner-cta-btn"
            >
              LET'S TALK <ArrowRight size={12} style={{ display: "inline", marginLeft: "4px" }} />
            </button>
            <button
              type="button"
              onClick={() => setShowTopBar(false)}
              className="banner-close-btn"
              aria-label="Dismiss banner"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 2. NAVBAR (DARK MODERN BRAND HEADER) */}
      <nav className="canvas-site-nav" id="navbar">
        <div className="canvas-nav-container">
          {/* BRAND LOGO WITH OFFICIAL GET INTO FEED LOGO */}
          <a href="#" className="canvas-brand-logo" aria-label="Get Into Feed Home">
            <img src="/logo-navbar.png" alt="Get Into Feed Logo" className="canvas-logo-img" />
            <span className="canvas-brand-name">getintofeed<span className="dot-lime">.</span></span>
          </a>

          {/* DESKTOP NAV LINKS */}
          <div className="canvas-desktop-links">
            <a href="#work" className="nav-link-item">Work</a>
            <a href="#services" className="nav-link-item">Services</a>
            <a href="#about" className="nav-link-item">About Us</a>
            <a href="tel:+918810356950" className="nav-link-phone">📞 8810356950</a>
            <button
              type="button"
              onClick={() => { setSelectedServiceForLead("Project Inquiry"); setLeadModalOpen(true); }}
              className="nav-lime-cta-btn"
            >
              Let's talk <ArrowRight size={14} />
            </button>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="canvas-mobile-hamburger"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} color="#CCFF00" /> : <Menu size={26} color="#ffffff" />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="canvas-mobile-drawer">
            <a href="#work" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">01. Our Work</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">02. Services</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">03. About Us</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">04. Contact</a>
            <div className="mobile-drawer-actions">
              <a
                href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%20team%2C%20I%20want%20to%20scale%20my%20brand."
                target="_blank"
                rel="noreferrer"
                className="mobile-wa-btn"
              >
                💬 WhatsApp Us
              </a>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); setLeadModalOpen(true); }}
                className="mobile-talk-btn"
              >
                Start a Project →
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 3. HERO SECTION (BIG DISPLAY TYPOGRAPHY & FEED CARDS) */}
      <header className="canvas-hero-section">
        {/* Background Grid Accent */}
        <div className="hero-bg-grid-overlay" />

        <div className="canvas-hero-inner">
          <div className="hero-content-grid">
            {/* Left Column Text */}
            <div className="hero-text-col">
              <div className="hero-badge-pill">
                <span className="live-pulsing-dot" />
                <span>GROWTH STUDIO FOR NEXT-GEN BRANDS</span>
              </div>

              <h1 className="hero-display-h1">
                GET YOUR BRAND <br />
                INTO THE <span className="hero-accent-blue">FEED.</span>
              </h1>

              <p className="hero-subtext">
                A creative, content-led growth studio for brands ready to stop wasting ad spend and start driving real revenue from social and search.
              </p>

              <div className="hero-btn-row">
                <a href="#work" className="btn-solid-lime">
                  See our work <ArrowRight size={16} />
                </a>
                <button
                  type="button"
                  onClick={() => { setSelectedServiceForLead("Free 30-Min Strategy Call"); setLeadModalOpen(true); }}
                  className="btn-outline-white"
                >
                  Let's talk
                </button>
              </div>

              <div className="hero-social-proof-strip">
                <div className="proof-metric-item">
                  <strong>4.8x</strong>
                  <span>Average Client ROAS</span>
                </div>
                <div className="proof-divider" />
                <div className="proof-metric-item">
                  <strong>+340%</strong>
                  <span>Organic Traffic Surge</span>
                </div>
                <div className="proof-divider" />
                <div className="proof-metric-item">
                  <strong>103+</strong>
                  <span>Brands Scaled</span>
                </div>
              </div>
            </div>

            {/* Right Column Interactive Feed Mockups */}
            <div className="hero-visual-col">
              <div className="feed-card-wrapper">
                {/* Main Dark Feed Card */}
                <div className="feed-card-main">
                  <div className="feed-card-badge-top">
                    <span className="feed-live-tag">LIVE IN FEED</span>
                    <span className="feed-handle">@getintofeed</span>
                  </div>

                  <h3 className="feed-card-headline">
                    Growth <br />
                    Starts in <br />
                    <span className="lime-text">The Feed.</span>
                  </h3>

                  <div className="feed-card-video-box">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
                      alt="Feed Video Visual"
                      className="feed-video-bg"
                    />
                    <div className="feed-video-overlay">
                      <div className="feed-play-circle">
                        <Play size={18} fill="#09090B" color="#09090B" />
                      </div>
                      <span className="feed-play-label">WATCH AGENCY SHOWREEL</span>
                    </div>
                  </div>

                  <div className="feed-card-footer-stats">
                    <div className="f-stat">
                      <span className="f-val">3.2M+</span>
                      <span className="f-lbl">Video Views</span>
                    </div>
                    <div className="f-stat">
                      <span className="f-val text-brand-lime">8.4%</span>
                      <span className="f-lbl">Engagement Rate</span>
                    </div>
                    <div className="f-stat">
                      <span className="f-val">4.8x</span>
                      <span className="f-lbl">ROAS</span>
                    </div>
                  </div>
                </div>

                {/* Floating Micro Card on Right */}
                <div className="feed-floating-pill-card top-right">
                  <Flame size={16} color="#CCFF00" />
                  <div>
                    <strong>Viral Hook Generated</strong>
                    <small>+124k Impressions in 24h</small>
                  </div>
                </div>

                {/* Floating Micro Card on Bottom */}
                <div className="feed-floating-pill-card bottom-left">
                  <TrendingUp size={16} color="#2563EB" />
                  <div>
                    <strong>Paid Funnel Optimized</strong>
                    <small>-42% Customer Acquisition Cost</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. SERVICES SECTION (8 INTERACTIVE CARDS) */}
      <section id="services" className="canvas-services-section">
        <div className="canvas-section-container">
          <div className="services-header-row">
            <div>
              <span className="section-kicker-blue">CAPABILITIES & SERVICES</span>
              <h2 className="section-title-large">
                WE TURN SCROLLS <br /> INTO RESULTS.
              </h2>
            </div>
            <p className="services-header-desc">
              Every deliverable is engineered to capture attention, stop the scroll, and turn passive viewers into paying customers.
            </p>
          </div>

          <div className="services-cards-8-grid">
            {/* 01. Content Marketing */}
            <div className="service-brutalist-card">
              <div className="s-card-top">
                <span className="s-num">01</span>
                <span className="s-icon-tag">📝 Content</span>
              </div>
              <h3 className="s-card-title">Content Marketing</h3>
              <p className="s-card-desc">
                High-intent articles, playbooks, editorial authority and viral social hooks that rank #1 on Google and get shared across platforms.
              </p>
              <ul className="s-card-bullets">
                <li><Check size={14} color="#CCFF00" /> SEO & Entity Authority Content</li>
                <li><Check size={14} color="#CCFF00" /> Viral Social Hooks & Carousels</li>
                <li><Check size={14} color="#CCFF00" /> Thought Leadership Playbooks</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedServiceForLead("Content Marketing"); setLeadModalOpen(true); }}
                className="s-card-arrow-link"
              >
                Explore Deliverables <ArrowRight size={14} />
              </button>
            </div>

            {/* 02. Ads Campaign */}
            <div className="service-brutalist-card highlight-border">
              <div className="s-card-top">
                <span className="s-num">02</span>
                <span className="s-icon-tag lime-badge">⚡ Performance</span>
              </div>
              <h3 className="s-card-title">Ads Campaign</h3>
              <p className="s-card-desc">
                High-ROAS Meta, Google Search, YouTube and TikTok ad campaigns built on scientific creative testing and server-side tracking.
              </p>
              <ul className="s-card-bullets">
                <li><Check size={14} color="#CCFF00" /> Value-Based Smart Bidding</li>
                <li><Check size={14} color="#CCFF00" /> High-Velocity Creative Testing</li>
                <li><Check size={14} color="#CCFF00" /> Meta CAPI & Conversion Telemetry</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedServiceForLead("Ads Campaign"); setLeadModalOpen(true); }}
                className="s-card-arrow-link"
              >
                Explore Deliverables <ArrowRight size={14} />
              </button>
            </div>

            {/* 03. Social Media Management */}
            <div className="service-brutalist-card">
              <div className="s-card-top">
                <span className="s-num">03</span>
                <span className="s-icon-tag">📱 Social</span>
              </div>
              <h3 className="s-card-title">Social Media Management</h3>
              <p className="s-card-desc">
                Full-stack channel management, daily community building, consistent posting calendar and algorithmic growth engineering.
              </p>
              <ul className="s-card-bullets">
                <li><Check size={14} color="#CCFF00" /> End-to-End Content Calendar</li>
                <li><Check size={14} color="#CCFF00" /> Active DMs & Community Engagement</li>
                <li><Check size={14} color="#CCFF00" /> Trend Hijacking & Memes</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedServiceForLead("Social Media Management"); setLeadModalOpen(true); }}
                className="s-card-arrow-link"
              >
                Explore Deliverables <ArrowRight size={14} />
              </button>
            </div>

            {/* 04. Graphics Design */}
            <div className="service-brutalist-card">
              <div className="s-card-top">
                <span className="s-num">04</span>
                <span className="s-icon-tag">🎨 Creative</span>
              </div>
              <h3 className="s-card-title">Graphics Design</h3>
              <p className="s-card-desc">
                Striking visual identity, ad creatives, carousel graphics, brand guidelines and sub-second landing page assets.
              </p>
              <ul className="s-card-bullets">
                <li><Check size={14} color="#CCFF00" /> High-Converting Ad Banners</li>
                <li><Check size={14} color="#CCFF00" /> Swipe-Friendly Carousels</li>
                <li><Check size={14} color="#CCFF00" /> Complete Brand Design Systems</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedServiceForLead("Graphics Design"); setLeadModalOpen(true); }}
                className="s-card-arrow-link"
              >
                Explore Deliverables <ArrowRight size={14} />
              </button>
            </div>

            {/* 05. Reels */}
            <div className="service-brutalist-card highlight-border">
              <div className="s-card-top">
                <span className="s-num">05</span>
                <span className="s-icon-tag lime-badge">🎬 Viral Video</span>
              </div>
              <h3 className="s-card-title">Reels & Short-Form</h3>
              <p className="s-card-desc">
                Fast-paced vertical videos, audio trend sync, dynamic captions and storytelling engineered specifically for Instagram & TikTok feeds.
              </p>
              <ul className="s-card-bullets">
                <li><Check size={14} color="#CCFF00" /> 3-Second Retention Hooks</li>
                <li><Check size={14} color="#CCFF00" /> Sound Design & Motion Effects</li>
                <li><Check size={14} color="#CCFF00" /> Weekly Content Batching</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedServiceForLead("Reels & Short-Form"); setLeadModalOpen(true); }}
                className="s-card-arrow-link"
              >
                Explore Deliverables <ArrowRight size={14} />
              </button>
            </div>

            {/* 06. Videos */}
            <div className="service-brutalist-card">
              <div className="s-card-top">
                <span className="s-num">06</span>
                <span className="s-icon-tag">🎥 Long-Form</span>
              </div>
              <h3 className="s-card-title">Videos & YouTube</h3>
              <p className="s-card-desc">
                High-production YouTube video editing, brand documentaries, podcast mastering and long-form authority assets.
              </p>
              <ul className="s-card-bullets">
                <li><Check size={14} color="#CCFF00" /> High-CTR YouTube Thumbnails</li>
                <li><Check size={14} color="#CCFF00" /> Multi-Camera Editing & Color Grade</li>
                <li><Check size={14} color="#CCFF00" /> Podcast Repurposing Engine</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedServiceForLead("Video Production"); setLeadModalOpen(true); }}
                className="s-card-arrow-link"
              >
                Explore Deliverables <ArrowRight size={14} />
              </button>
            </div>

            {/* 07. Strategy */}
            <div className="service-brutalist-card">
              <div className="s-card-top">
                <span className="s-num">07</span>
                <span className="s-icon-tag">🧠 Growth</span>
              </div>
              <h3 className="s-card-title">Strategy & Full-Funnel</h3>
              <p className="s-card-desc">
                Comprehensive market positioning, competitor vulnerability audit, pricing psychology and acquisition channel roadmaps.
              </p>
              <ul className="s-card-bullets">
                <li><Check size={14} color="#CCFF00" /> 90-Day Omnichannel Growth Plan</li>
                <li><Check size={14} color="#CCFF00" /> Offer & Unit Economics Audit</li>
                <li><Check size={14} color="#CCFF00" /> Customer Persona Telemetry</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedServiceForLead("Strategy & Full-Funnel"); setLeadModalOpen(true); }}
                className="s-card-arrow-link"
              >
                Explore Deliverables <ArrowRight size={14} />
              </button>
            </div>

            {/* 08. Growth Personalized */}
            <div className="service-brutalist-card">
              <div className="s-card-top">
                <span className="s-num">08</span>
                <span className="s-icon-tag lime-badge">🤖 AI First</span>
              </div>
              <h3 className="s-card-title">Growth Personalized</h3>
              <p className="s-card-desc">
                Generative AI Search (GEO), ChatGPT and Gemini entity indexing, automated lead nurturing and bespoke scaling pods.
              </p>
              <ul className="s-card-bullets">
                <li><Check size={14} color="#CCFF00" /> Generative Engine Optimization (GEO)</li>
                <li><Check size={14} color="#CCFF00" /> Automated CRM Ingestion & WhatsApp</li>
                <li><Check size={14} color="#CCFF00" /> Dedicated Growth Pod Team</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedServiceForLead("Growth Personalized"); setLeadModalOpen(true); }}
                className="s-card-arrow-link"
              >
                Explore Deliverables <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INFINITE MARQUEE TICKER (ELECTRIC LIME STRIP) */}
      <div className="canvas-marquee-strip">
        <div className="marquee-track">
          <div className="marquee-item-row">
            <span>ORGANIC GROWTH</span> <span className="m-bolt">⚡</span>
            <span>PAID ACQUISITION</span> <span className="m-bolt">⚡</span>
            <span>VIRAL REELS</span> <span className="m-bolt">⚡</span>
            <span>HIGH CONVERTING FUNNELS</span> <span className="m-bolt">⚡</span>
            <span>BRAND IDENTITY</span> <span className="m-bolt">⚡</span>
            <span>AI SEARCH DISCOVERY</span> <span className="m-bolt">⚡</span>
            <span>CONTENT MARKETING</span> <span className="m-bolt">⚡</span>
          </div>
          <div className="marquee-item-row" aria-hidden="true">
            <span>ORGANIC GROWTH</span> <span className="m-bolt">⚡</span>
            <span>PAID ACQUISITION</span> <span className="m-bolt">⚡</span>
            <span>VIRAL REELS</span> <span className="m-bolt">⚡</span>
            <span>HIGH CONVERTING FUNNELS</span> <span className="m-bolt">⚡</span>
            <span>BRAND IDENTITY</span> <span className="m-bolt">⚡</span>
            <span>AI SEARCH DISCOVERY</span> <span className="m-bolt">⚡</span>
            <span>CONTENT MARKETING</span> <span className="m-bolt">⚡</span>
          </div>
        </div>
      </div>

      {/* 6. INDUSTRIES WE ELEVATE (FILTERABLE GRID) */}
      <section id="work" className="canvas-industries-section">
        <div className="canvas-section-container">
          <div className="industries-header-flex">
            <div>
              <span className="section-kicker-blue">PORTFOLIO & EXPERTISE</span>
              <h2 className="section-title-large">
                INDUSTRIES WE <br /> <span className="hero-accent-blue">ELEVATE.</span>
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="industry-filter-pills">
              {[
                { id: "all", label: "All Sectors (12)" },
                { id: "ecommerce", label: "E-Commerce & D2C" },
                { id: "b2b", label: "Real Estate & B2B" },
                { id: "services", label: "Healthcare & Services" },
                { id: "lifestyle", label: "Hospitality & Lifestyle" }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedIndustryCategory(cat.id)}
                  className={`filter-pill-btn ${selectedIndustryCategory === cat.id ? "active" : ""}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="industries-cards-grid">
            {filteredIndustries.map(ind => (
              <div key={ind.id} className="industry-card-item">
                <div className="ind-top-row">
                  <h3 className="ind-card-title">{ind.title}</h3>
                  <span className="ind-cat-tag">{ind.category.toUpperCase()}</span>
                </div>
                <p className="ind-card-desc">{ind.desc}</p>
                <div className="ind-metrics-wrap">
                  {ind.metrics.map((m, i) => (
                    <span key={i} className="ind-metric-pill">
                      <Check size={12} color="#00D094" /> {m}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedServiceForLead(`${ind.title} Growth Engine`); setLeadModalOpen(true); }}
                  className="ind-consult-btn"
                >
                  Scale Your {ind.title} Brand →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FROM IDEA → FEED (4-STAGE EXECUTION SPRINT) */}
      <section className="canvas-process-section">
        <div className="canvas-section-container">
          <div className="process-header-box">
            <span className="section-kicker-blue">HOW WE WORK</span>
            <h2 className="section-title-large">
              FROM IDEA <br />
              <span className="stroke-outline-text">→ FEED.</span>
            </h2>
            <p className="process-header-desc">
              Our 4-stage sprint methodology guarantees rapid creative deployment, seamless ad execution, and predictable revenue compounding.
            </p>
          </div>

          <div className="process-steps-grid">
            {/* Stage 01 */}
            <div className="process-step-card">
              <span className="p-step-num">01</span>
              <h3 className="p-step-title">Discover</h3>
              <p className="p-step-desc">
                We audit your current traffic, customer acquisition costs, competitor ad strategies, and audience search behavior.
              </p>
              <div className="p-step-tag">WEEK 1 • STRATEGY</div>
            </div>

            {/* Stage 02 */}
            <div className="process-step-card">
              <span className="p-step-num">02</span>
              <h3 className="p-step-title">Build</h3>
              <p className="p-step-desc">
                We craft high-converting ad angles, record viral video hooks, script authority carousels, and build sub-second landing funnels.
              </p>
              <div className="p-step-tag">WEEKS 2-3 • CREATIVE ENGINE</div>
            </div>

            {/* Stage 03 */}
            <div className="process-step-card">
              <span className="p-step-num">03</span>
              <h3 className="p-step-title">Launch</h3>
              <p className="p-step-desc">
                We deploy creative batches across Meta, Google, Instagram, and Search with full server-side attribution telemetry.
              </p>
              <div className="p-step-tag">WEEK 4 • OMNICHANNEL PUSH</div>
            </div>

            {/* Stage 04 */}
            <div className="process-step-card highlight-step">
              <span className="p-step-num lime-num">04</span>
              <h3 className="p-step-title">Optimize</h3>
              <p className="p-step-desc">
                We double down on top-performing creative hooks, scale winning ad sets, and iterate weekly to maximize your ROAS.
              </p>
              <div className="p-step-tag lime-bg">ONGOING • REVENUE SCALING</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NO BORING MARKETING (BRUTALIST MANIFESTO) */}
      <section className="canvas-manifesto-section">
        <div className="canvas-section-container">
          <div className="manifesto-split-grid">
            {/* Sticky Left Title */}
            <div className="manifesto-left-sticky">
              <h2 className="manifesto-giant-h2">
                NO <br /> BORING <br /> MARKETING.
              </h2>
              <p className="manifesto-left-desc">
                In an attention-deficit economy, generic marketing is the most expensive mistake a business can make.
              </p>
            </div>

            {/* Right Column Statement Cards */}
            <div className="manifesto-right-cards">
              <div className="manifesto-card-item">
                <h3 className="m-card-h3">NO RANDOM POSTING.</h3>
                <p className="m-card-p">
                  Posting just to check a box is a waste of time. Every single piece of content must have a clear objective: capture attention, educate, or convert.
                </p>
              </div>

              <div className="manifesto-card-item">
                <h3 className="m-card-h3">NO "BOOST BUTTON" STRATEGY.</h3>
                <p className="m-card-p">
                  Boosting posts without scientific audience structuring, pixel calibration, and creative testing burns budget without generating pipeline.
                </p>
              </div>

              <div className="manifesto-card-item">
                <h3 className="m-card-h3">NO DESIGN FOR DESIGN'S SAKE.</h3>
                <p className="m-card-p">
                  Pretty visuals are useless if they don't communicate value. Creative must stop the thumb, convey the proposition, and compel immediate action.
                </p>
              </div>

              <div className="manifesto-card-item">
                <h3 className="m-card-h3">NO VANITY METRICS.</h3>
                <p className="m-card-p">
                  Reach and likes are nice for the ego. Qualified leads, customer lifetime value, and net revenue are what actually grow your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ABOUT US (WHO'S BEHIND THE FEED) */}
      <section id="about" className="canvas-about-section">
        <div className="canvas-section-container text-center">
          <span className="section-kicker-blue">WHO'S BEHIND THE FEED</span>
          <h3 className="about-giant-title">WE'RE GETINTOFEED.</h3>

          <p className="about-lead-quote">
            A creative growth studio built around one simple idea: <br />
            <span className="lime-highlight-span">good marketing shouldn't feel like marketing.</span>
          </p>

          <p className="about-sub-body">
            We bring together content, creative, social and performance marketing under one roof — helping brands go from "we need marketing" to "people are actually talking about us."
          </p>

          <div className="about-formula-badge">
            Strategy <span className="formula-cross-lime">×</span> Creativity <span className="formula-cross-blue">×</span> Performance
          </div>
        </div>
      </section>

      {/* 10. CTA SECTION (ELECTRIC ROYAL BLUE BOX) */}
      <section id="contact" className="canvas-cta-outer-section">
        <div className="canvas-cta-blue-card">
          <div className="cta-content-wrap">
            <h2 className="cta-giant-h2">
              READY TO <br />
              GET INTO <br />
              <span className="cta-lime-span">THE FEED?</span>
            </h2>

            <p className="cta-subtext">
              Tell us what you're building. We'll figure out how to get it noticed and scaled.
            </p>

            <div className="cta-btn-action-row">
              <button
                type="button"
                onClick={() => { setSelectedServiceForLead("Full Growth Sprint"); setLeadModalOpen(true); }}
                className="cta-start-btn"
              >
                Start a project <ArrowRight size={16} />
              </button>
              <a href="mailto:growth@getintofeed.com" className="cta-email-link">
                growth@getintofeed.com
              </a>
              <a href="tel:+918810356950" className="cta-email-link">
                📞 +91-8810356950
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 11. ENTERPRISE FOOTER */}
      <footer className="canvas-site-footer">
        <div className="canvas-section-container">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <a href="#" className="footer-brand-title">
                <img src="/logo-navbar.png" alt="Get Into Feed" style={{ width: "32px", height: "32px", display: "inline-block", marginRight: "8px", verticalAlign: "middle" }} />
                getintofeed<span className="dot-lime">.</span>
              </a>
              <p className="footer-brand-desc">
                A vibrant growth studio that gets brands into the feed — and gets them compounding revenue.
              </p>
              <div className="footer-direct-contact-pills">
                <a href="tel:+918810356950" className="footer-contact-pill">📞 +91-8810356950</a>
                <a href="mailto:growth@getintofeed.com" className="footer-contact-pill">✉️ growth@getintofeed.com</a>
              </div>
            </div>

            <div className="footer-links-columns-group">
              <div className="footer-nav-col">
                <span className="f-col-title">CAPABILITIES</span>
                <a href="#services">Content Marketing</a>
                <a href="#services">Paid Media (ROAS)</a>
                <a href="#services">Reels & Short-Form</a>
                <a href="#services">Social Management</a>
                <a href="#services">AI Search (GEO)</a>
              </div>

              <div className="footer-nav-col">
                <span className="f-col-title">COMPANY</span>
                <a href="#about">About Us</a>
                <a href="#work">Our Work</a>
                <a href="#services">Our Services</a>
                <a href="/admin" onClick={(e) => { e.preventDefault(); navigate("/admin"); }}>Admin Studio</a>
              </div>

              <div className="footer-nav-col">
                <span className="f-col-title">CONNECT</span>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-f-link">
                  <Instagram size={14} color="#CCFF00" /> Instagram
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-f-link">
                  <Linkedin size={14} color="#2563EB" /> LinkedIn
                </a>
                <a href="https://wa.me/918810356950" target="_blank" rel="noreferrer" className="social-f-link">
                  <MessageCircle size={14} color="#25D366" /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar with DMCA */}
          <div className="footer-bottom-strip">
            <p>© 2026 Get Into Feed Growth Studio. All rights reserved.</p>
            <div className="footer-bottom-legal-links">
              <a
                href="https://www.dmca.com/Protection/Status.aspx?ID=d7bfaa8b-113f-40c7-b0b8-9da53cf5cba7"
                target="_blank"
                rel="noreferrer"
                className="footer-dmca-badge-pill"
              >
                <img src="/dmca-badge.svg" alt="DMCA Protected" style={{ height: "24px", width: "auto" }} />
              </a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 12. FLOATING WHATSAPP BUTTON */}
      <WhatsAppWidget />

      {/* 13. LEAD CAPTURE MODAL ("START A PROJECT") */}
      {leadModalOpen && (
        <div className="lead-modal-overlay" onClick={() => setLeadModalOpen(false)}>
          <div className="lead-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLeadModalOpen(false)}
              className="modal-close-icon-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="modal-header-top">
              <span className="modal-kicker">GET INTO THE FEED</span>
              <h3 className="modal-h3">Let's Scale Your Brand</h3>
              <p className="modal-desc">
                Tell us about your brand. Our growth team will reach out in under 2 hours with a bespoke strategy.
              </p>
            </div>

            {submitSuccess ? (
              <div className="modal-success-box">
                <Check size={32} color="#CCFF00" />
                <h4>Inquiry Received!</h4>
                <p>We will connect with you on WhatsApp / Phone (+91-8810356950) shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="modal-lead-form">
                <div className="form-group-field">
                  <label>Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ashish Raghav"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group-field">
                    <label>Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. ashish@yourbrand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group-field">
                    <label>WhatsApp / Phone *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 8810356950"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-field">
                  <label>Website / Instagram Handle</label>
                  <input
                    type="text"
                    placeholder="e.g. yourbrand.com or @yourbrand"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="form-group-field">
                  <label>Interested Service</label>
                  <select
                    value={selectedServiceForLead}
                    onChange={(e) => setSelectedServiceForLead(e.target.value)}
                  >
                    <option value="Content & Paid Growth">Content & Paid Growth (Full Funnel)</option>
                    <option value="Performance Ads (ROAS)">Performance Ads (Meta, Google, TikTok)</option>
                    <option value="Reels & Short-Form Video">Reels & Short-Form Video Engine</option>
                    <option value="Social Media Management">Social Media Management & Creative</option>
                    <option value="Enterprise SEO & GEO">Enterprise SEO & Generative AI Search</option>
                    <option value="High-Growth Retainer">Comprehensive Agency Retainer</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label>What are your biggest growth goals?</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your current monthly revenue, ad budget, or timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="modal-submit-lime-btn"
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
