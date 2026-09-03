import React, { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowRight,
  BarChart2,
  Bookmark,
  Briefcase,
  Car,
  Check,
  Compass,
  Clapperboard,
  Coffee,
  ChevronDown,
  Dumbbell,
  Edit3,
  GraduationCap,
  Heart,
  Home,
  Instagram,
  Linkedin,
  Mail,
  Map,
  Megaphone,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PenTool,
  Phone,
  PieChart,
  Play,
  Rocket,
  Send,
  ShoppingBag,
  Sparkles,
  Users,
  Video,
  X,
  Zap
} from "lucide-react";
import WhatsAppWidget from "./components/WhatsAppWidget";
import AdminDashboard from "./Admin";
import {
  ServicesHubPage,
  ServiceDetailPage,
  AboutUsPage,
  WorkPage,
  PricingPage,
  AuditToolPage,
  FeedNotesPage,
  CareersPage,
  ContactPage,
  LegalPage,
  serviceCatalog
} from "./DetailPages";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

export default function App() {
  const [route, setRoute] = useState(window.location.pathname || "/");
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("General Inbound");

  // Lead Form
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
          service: selectedService || formData.service,
          source: "Exact Gemini Canvas Landing Page"
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
        alert("Thanks! Your message has been received. Our team will contact you on WhatsApp/Phone (+91-8810356950) shortly.");
        setLeadModalOpen(false);
      }
    } catch {
      alert("Thanks! Your message has been received. Our team will contact you on WhatsApp/Phone (+91-8810356950) shortly.");
      setLeadModalOpen(false);
    }
    setSubmitting(false);
  };

  // FULL-STACK ROUTING LOGIC
  if (route.startsWith("/admin")) {
    return <AdminDashboard onNavigate={navigate} />;
  }
  if (route === "/services" || route === "/services/") {
    return <ServicesHubPage onNavigate={navigate} />;
  }
  if (route.startsWith("/services/")) {
    const slug = route.replace("/services/", "").replace(/\/.*$/, "");
    return <ServiceDetailPage slug={slug} onNavigate={navigate} />;
  }
  if (route.startsWith("/about")) {
    return <AboutUsPage onNavigate={navigate} />;
  }
  if (route.startsWith("/work") || route.startsWith("/case-studies")) {
    return <WorkPage onNavigate={navigate} />;
  }
  if (route.startsWith("/pricing")) {
    return <PricingPage onNavigate={navigate} />;
  }
  if (route.startsWith("/audit")) {
    return <AuditToolPage onNavigate={navigate} />;
  }
  if (route.startsWith("/careers")) {
    return <CareersPage onNavigate={navigate} />;
  }
  if (route.startsWith("/blog") || route.startsWith("/feed-notes")) {
    const parts = route.split("/").filter(Boolean);
    const slug = parts[1] || "";
    return <FeedNotesPage onNavigate={navigate} slug={slug} />;
  }
  if (route.startsWith("/contact")) {
    return <ContactPage onNavigate={navigate} />;
  }
  if (route.startsWith("/privacy")) {
    return <LegalPage type="privacy" onNavigate={navigate} />;
  }
  if (route.startsWith("/terms")) {
    return <LegalPage type="terms" onNavigate={navigate} />;
  }

  // HOMEPAGE
  return (
    <div className="min-h-screen bg-[#09090B] text-white selection:bg-[#D4FF00] selection:text-[#09090B]">
      {/* 1. TOP BAR */}
      {showTopBar && (
        <div className="top-bar-lime">
          <Zap size={14} fill="#09090B" />
          <p>NOW TAKING ON 3 NEW BRANDS THIS MONTH — LET'S BUILD SOMETHING PEOPLE CAN'T SCROLL PAST.</p>
          <button
            type="button"
            onClick={() => { setSelectedService("High-Growth Retainer"); setLeadModalOpen(true); }}
            className="top-bar-talk-btn"
          >
            LET'S TALK <ArrowRight size={12} />
          </button>
          <button
            type="button"
            onClick={() => setShowTopBar(false)}
            className="top-bar-close-btn"
            aria-label="Close announcement"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. NAVBAR */}
      <nav className="site-navbar" id="navbar">
        <div className="navbar-container">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
            className="navbar-brand"
            aria-label="Get Into Feed Home"
          >
            <img src="/logo-navbar.png" alt="Get Into Feed Logo" className="navbar-logo-img" />
            <span>getintofeed.</span>
          </a>

          <div className="navbar-links">
            {/* Services Dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <a
                href="/services"
                onClick={(e) => { e.preventDefault(); navigate("/services"); }}
                className="nav-link"
                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                Services <ChevronDown size={14} />
              </a>
              {servicesDropdownOpen && (
                <div style={{ position: "absolute", top: "100%", left: "-20px", background: "#121216", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "16px", minWidth: "260px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)", zIndex: 100, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.values(serviceCatalog).map(s => (
                    <a
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      onClick={(e) => { e.preventDefault(); setServicesDropdownOpen(false); navigate(`/services/${s.slug}`); }}
                      style={{ color: "#d1d5db", fontSize: "12px", fontFamily: "var(--font-space)", fontWeight: "700", textDecoration: "none", textTransform: "uppercase", padding: "6px 10px", borderRadius: "6px", transition: "background 0.2s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--brand-lime)"; e.currentTarget.style.background = "#18181b"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#d1d5db"; e.currentTarget.style.background = "transparent"; }}
                    >
                      {s.title.split("&")[0]}
                    </a>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px", marginTop: "4px" }}>
                    <a
                      href="/services"
                      onClick={(e) => { e.preventDefault(); setServicesDropdownOpen(false); navigate("/services"); }}
                      style={{ color: "var(--brand-lime)", fontSize: "11px", fontFamily: "var(--font-space)", fontWeight: "900", textDecoration: "none", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      View All Services →
                    </a>
                  </div>
                </div>
              )}
            </div>
            <a href="/work" onClick={(e) => { e.preventDefault(); navigate("/work"); }} className="nav-link">Work</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); navigate("/about"); }} className="nav-link">About Us</a>
            <a href="/pricing" onClick={(e) => { e.preventDefault(); navigate("/pricing"); }} className="nav-link">Pricing</a>
            <a href="/audit" onClick={(e) => { e.preventDefault(); navigate("/audit"); }} className="nav-link" style={{ color: "var(--brand-lime)" }}>⚡ Free Audit</a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); navigate("/blog"); }} className="nav-link">Feed Notes</a>
            <a href="tel:+918810356950" className="nav-link" style={{ color: "#ffffff" }}>📞 8810356950</a>
          </div>

          <button
            type="button"
            onClick={() => { setSelectedService("Start a Project"); setLeadModalOpen(true); }}
            className="nav-start-btn"
          >
            Start a project <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} color="#D4FF00" /> : <Menu size={26} color="#ffffff" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <a href="/" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate("/"); }} className="mobile-menu-link">01. Home</a>
            <a href="/services" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate("/services"); }} className="mobile-menu-link">02. Services Hub</a>
            <a href="/work" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate("/work"); }} className="mobile-menu-link">03. Our Work & Portfolio</a>
            <a href="/about" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate("/about"); }} className="mobile-menu-link">04. About Us</a>
            <a href="/pricing" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate("/pricing"); }} className="mobile-menu-link">05. Pricing Sprints</a>
            <a href="/audit" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate("/audit"); }} className="mobile-menu-link" style={{ color: "var(--brand-lime)" }}>06. ⚡ Free Growth Audit</a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate("/blog"); }} className="mobile-menu-link">07. Feed Notes (Blog)</a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate("/contact"); }} className="mobile-menu-link">08. Contact & Intake</a>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <a
                href="https://wa.me/918810356950?text=Hi%20Get%20Into%20Feed%2C%20I%20want%20to%20scale%20my%20brand."
                target="_blank"
                rel="noreferrer"
                style={{ flex: 1, background: "#25D366", color: "#082414", textAlign: "center", padding: "12px", borderRadius: "6px", fontWeight: "800", textDecoration: "none", fontFamily: "var(--font-space)" }}
              >
                💬 WhatsApp
              </a>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); setLeadModalOpen(true); }}
                style={{ flex: 1, background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "12px", borderRadius: "6px", fontWeight: "900", border: "none", cursor: "pointer", fontFamily: "var(--font-space)" }}
              >
                Start a Project →
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 3. HERO SECTION */}
      <section className="hero-section">
        <div className="absolute inset-0 max-w-[1600px] mx-auto pointer-events-none" style={{ position: "absolute" }}>
          <svg className="absolute right-[45%] top-[25%] w-12 h-12 text-[#D4FF00] hidden lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: "45%", top: "25%" }}>
            <path d="M10 22C10 22 7 14 2 12C7 10 10 2 10 2C10 2 13 10 18 12C13 14 10 22 10 22Z" fill="#D4FF00" />
          </svg>
          <svg className="absolute right-[5%] bottom-[15%] w-16 h-16 text-[#D4FF00] hidden lg:block rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: "absolute", right: "5%", bottom: "15%" }}>
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="#D4FF00" strokeWidth="3" />
          </svg>
        </div>

        <div className="hero-inner-container">
          {/* Left: Typography & CTA */}
          <div className="reveal">
            <h1 className="hero-main-title">
              GET YOUR BRAND <br />
              INTO THE <span className="text-brand-blue">FEED.</span>
            </h1>

            <p className="hero-paragraph">
              We create content, run ads and build strategies that get brands{" "}
              <span className="text-brand-lime" style={{ fontWeight: "700" }}>noticed, clicked and remembered.</span>
            </p>

            <div className="hero-actions-row">
              <button
                type="button"
                onClick={() => { setSelectedService("Strategy Call"); setLeadModalOpen(true); }}
                className="hero-btn-lime"
              >
                Let's Talk <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/work")}
                className="hero-btn-work"
                style={{ background: "transparent", cursor: "pointer" }}
              >
                See Our Work <ArrowRight size={16} />
              </button>
            </div>

            <div className="hero-scroll-indicator">
              <div className="scroll-circle-icon">
                <ArrowDown size={16} />
              </div>
              Scroll to explore
            </div>
          </div>

          {/* Right: Floating UI Elements Mockup */}
          <div className="hero-mockups-col">
            {/* Center Phone */}
            <div className="phone-mockup-frame animate-float-phone">
              <div className="phone-notch" />

              {/* App Header (Clean official Get Into Feed branding - No gf/g. placeholder) */}
              <div className="phone-app-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img src="/logo-navbar.png" alt="Get Into Feed" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                  <span style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "14px" }}>getintofeed.</span>
                </div>
                <MoreHorizontal size={20} color="#9ca3af" />
              </div>

              {/* App Content */}
              <div className="phone-app-body">
                <h3 className="phone-feed-h3">
                  Growth <br />
                  Starts in <br />
                  <span className="text-brand-lime">The Feed.</span>
                </h3>
              </div>

              {/* App Footer */}
              <div className="phone-app-footer">
                <div className="phone-icons-row">
                  <Heart size={24} fill="#FF6B5E" color="#FF6B5E" />
                  <MessageCircle size={24} color="#ffffff" />
                  <Send size={24} color="#ffffff" />
                  <Bookmark size={24} color="#ffffff" style={{ marginLeft: "auto" }} />
                </div>
                <p style={{ fontWeight: "800", fontSize: "14px", marginBottom: "4px" }}>1,234 likes</p>
                <p style={{ fontSize: "12px", color: "#d1d5db", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "800", color: "#ffffff" }}>Smart strategy. Killer creative. Real results.</span>
                </p>
                <p style={{ fontSize: "10px", color: "#6b7280" }}>View all 23 comments</p>
              </div>
            </div>

            {/* Floating Card: Reach */}
            <div className="card-floating-reach animate-float-slow">
              <p style={{ fontSize: "12px", color: "#6b7280", fontFamily: "var(--font-space)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Reach</p>
              <p style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "36px", color: "var(--brand-dark)", marginBottom: "8px", lineHeight: 1 }}>2.8M</p>
              <svg style={{ width: "100%", height: "32px" }} viewBox="0 0 100 30" fill="none">
                <path d="M0 25 L20 15 L40 20 L60 5 L80 10 L100 0" stroke="#0033FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="100" cy="0" r="4" fill="#0033FF" />
              </svg>
            </div>

            {/* Floating Card: ROAS */}
            <div className="card-floating-roas animate-float-fast">
              <p style={{ fontSize: "12px", color: "rgba(9, 9, 11, 0.6)", fontFamily: "var(--font-space)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>ROAS</p>
              <p style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "36px", color: "var(--brand-dark)", marginBottom: "8px", lineHeight: 1 }}>4.6x</p>
              <svg style={{ width: "100%", height: "32px" }} viewBox="0 0 100 30" fill="none">
                <path d="M0 25 L25 15 L50 20 L75 5 L100 0" stroke="#09090B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="90,0 100,0 100,10" stroke="#09090B" strokeWidth="3" fill="none" />
              </svg>
            </div>

            {/* Floating Card: CTR */}
            <div className="card-floating-ctr animate-float-medium">
              <p style={{ fontSize: "12px", color: "#bfdbfe", fontFamily: "var(--font-space)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>CTR</p>
              <p style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "36px", color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>+42%</p>
              <svg style={{ width: "100%", height: "32px" }} viewBox="0 0 100 30" fill="none">
                <path d="M0 25 L25 20 L50 10 L75 15 L100 0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="90,0 100,0 100,10" stroke="#FFFFFF" strokeWidth="3" fill="none" />
              </svg>
            </div>

            {/* Floating Card: Video Views (Dark Glass) */}
            <div className="card-floating-views animate-float-dark-glass">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" alt="Sneaker" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
              <div style={{ position: "relative", zIndex: 10 }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px" }}>
                  <Play size={16} fill="#ffffff" color="#ffffff" style={{ marginLeft: "2px" }} />
                </div>
                <p style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "30px", color: "#ffffff", lineHeight: 1 }}>2.3M</p>
                <p style={{ fontSize: "10px", color: "#d1d5db", fontFamily: "var(--font-space)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>Video Views</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES / WHAT WE DO */}
      <section id="services" className="services-section">
        <div className="services-layout-grid">
          {/* Left Sticky Text */}
          <div className="services-left-col reveal">
            <p style={{ fontFamily: "var(--font-space)", fontWeight: "800", color: "var(--brand-blue)", letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "14px", marginBottom: "16px" }}>What We Do</p>
            <h2 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 4.5vw, 60px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "8px" }}>
              WE TURN SCROLLS <br /> INTO RESULTS.
            </h2>
            <svg style={{ width: "240px", height: "32px", marginBottom: "32px" }} viewBox="0 0 250 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 15C45.5 5 110 -2 248 8" stroke="#D4FF00" strokeWidth="4" strokeLinecap="round" />
              <path d="M15 18C60 12 120 8 230 15" stroke="#D4FF00" strokeWidth="4" strokeLinecap="round" />
            </svg>

            <p style={{ color: "#4b5563", fontSize: "15px", marginBottom: "32px", maxWidth: "380px", lineHeight: 1.6, fontWeight: "500" }}>
              From content that connects to campaigns that convert, we bring everything together to help your brand grow faster and smarter.
            </p>

            <button
              type="button"
              onClick={() => navigate("/services")}
              style={{ background: "var(--brand-dark)", color: "#ffffff", padding: "12px 24px", borderRadius: "4px", fontWeight: "800", fontFamily: "var(--font-space)", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              Explore all 8 services & specs <ArrowRight size={14} />
            </button>
          </div>

          {/* Right Grid of Cards */}
          <div className="services-cards-grid">
            {/* Card 1 */}
            <div className="service-card reveal" onClick={() => navigate("/services/content-marketing")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div className="service-icon-circle" style={{ background: "#dbeafe", color: "var(--brand-blue)" }}>
                  <Edit3 size={18} />
                </div>
                <span style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "20px", color: "#d1d5db" }}>01</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", textTransform: "uppercase", marginBottom: "8px" }}>Content Marketing</h3>
              <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }}>Strategic content that attracts, engages and builds trust.</p>
            </div>

            {/* Card 2 */}
            <div className="service-card reveal" onClick={() => navigate("/services/ads-campaign")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div className="service-icon-circle" style={{ background: "#FAFFCC", color: "#9ACC00" }}>
                  <Megaphone size={18} />
                </div>
                <span style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "20px", color: "#d1d5db" }}>02</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", textTransform: "uppercase", marginBottom: "8px" }}>Ads Campaign</h3>
              <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }}>High performing ad campaigns that drive clicks, leads & sales.</p>
            </div>

            {/* Card 3 */}
            <div className="service-card reveal" onClick={() => navigate("/services/social-media")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div className="service-icon-circle" style={{ background: "#dbeafe", color: "var(--brand-blue)" }}>
                  <Users size={18} />
                </div>
                <span style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "20px", color: "#d1d5db" }}>03</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", textTransform: "uppercase", marginBottom: "8px" }}>Social Media</h3>
              <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }}>We manage your socials to build community and grow.</p>
            </div>

            {/* Card 4 */}
            <div className="service-card reveal" onClick={() => navigate("/services/graphics-design")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div className="service-icon-circle" style={{ background: "#FAFFCC", color: "#9ACC00" }}>
                  <PenTool size={18} />
                </div>
                <span style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "20px", color: "#d1d5db" }}>04</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", textTransform: "uppercase", marginBottom: "8px" }}>Graphics Design</h3>
              <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }}>Scroll-stopping designs that communicate and convert.</p>
            </div>

            {/* Card 5 */}
            <div className="service-card reveal" onClick={() => navigate("/services/reels")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div className="service-icon-circle" style={{ background: "#fee2e2", color: "#ef4444" }}>
                  <Clapperboard size={18} />
                </div>
                <span style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "20px", color: "#d1d5db" }}>05</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", textTransform: "uppercase", marginBottom: "8px" }}>Reels</h3>
              <div style={{ width: "24px", height: "2px", background: "#ef4444", marginBottom: "12px" }} />
              <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }}>Short-form reels that grab attention and go viral.</p>
            </div>

            {/* Card 6 */}
            <div className="service-card reveal" onClick={() => navigate("/services/videos")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div className="service-icon-circle" style={{ background: "#dbeafe", color: "var(--brand-blue)" }}>
                  <Video size={18} />
                </div>
                <span style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "20px", color: "#d1d5db" }}>06</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", textTransform: "uppercase", marginBottom: "8px" }}>Videos</h3>
              <div style={{ width: "24px", height: "2px", background: "var(--brand-blue)", marginBottom: "12px" }} />
              <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }}>High quality videos that tell your story and drive action.</p>
            </div>

            {/* Card 7 */}
            <div className="service-card reveal" onClick={() => navigate("/services/strategy")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div className="service-icon-circle" style={{ background: "#FAFFCC", color: "#9ACC00" }}>
                  <Compass size={18} />
                </div>
                <span style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "20px", color: "#d1d5db" }}>07</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", textTransform: "uppercase", marginBottom: "8px" }}>Strategy</h3>
              <div style={{ width: "24px", height: "2px", background: "#9ACC00", marginBottom: "12px" }} />
              <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }}>Data-driven strategy tailored to your goals and audience.</p>
            </div>

            {/* Card 8 */}
            <div className="service-card reveal" onClick={() => navigate("/services/growth")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div className="service-icon-circle" style={{ background: "#ffedd5", color: "#f97316" }}>
                  <BarChart2 size={18} />
                </div>
                <span style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "20px", color: "#d1d5db" }}>08</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", textTransform: "uppercase", marginBottom: "8px" }}>Growth</h3>
              <div style={{ width: "24px", height: "2px", background: "#f97316", marginBottom: "12px" }} />
              <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }}>Customized growth plans that deliver real results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TICKER SECTION */}
      <section className="ticker-section">
        <div style={{ display: "flex", width: "100%" }}>
          <div className="animate-marquee">
            <span className="ticker-item-span">
              <span>CONTENT MARKETING</span> <Zap size={20} fill="#09090B" />
              <span>PAID MEDIA</span> <Zap size={20} fill="#09090B" />
              <span>SOCIAL</span> <Zap size={20} fill="#09090B" />
              <span>CREATIVE</span> <Zap size={20} fill="#09090B" />
              <span>PERFORMANCE</span> <Zap size={20} fill="#09090B" />
              <span>GROWTH</span> <Zap size={20} fill="#09090B" />
            </span>
            <span className="ticker-item-span" style={{ marginLeft: "24px" }}>
              <span>CONTENT MARKETING</span> <Zap size={20} fill="#09090B" />
              <span>PAID MEDIA</span> <Zap size={20} fill="#09090B" />
              <span>SOCIAL</span> <Zap size={20} fill="#09090B" />
              <span>CREATIVE</span> <Zap size={20} fill="#09090B" />
              <span>PERFORMANCE</span> <Zap size={20} fill="#09090B" />
              <span>GROWTH</span> <Zap size={20} fill="#09090B" />
            </span>
          </div>
        </div>
      </section>

      {/* 6. INDUSTRIES / FIELDS WE WORK FOR */}
      <section id="work" className="industries-section">
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "768px", margin: "0 auto 64px auto" }} className="reveal">
            <h2 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5vw, 70px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "16px", color: "var(--brand-dark)" }}>
              INDUSTRIES WE <br /> <span className="text-brand-blue">ELEVATE.</span>
            </h2>
            <p style={{ color: "#4b5563", fontSize: "15px", fontWeight: "500" }}>
              Tailored strategies and scroll-stopping content for brands ready to scale.
            </p>
          </div>

          <div className="industries-grid">
            {/* 01 Real Estate */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-lime)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-dark)" }}>
                  <Home size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>01</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Real Estate</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Turn properties into stories people want to step inside.</p>
              <div className="ind-tag-dark" style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-dark)", marginTop: "auto" }}>
                LEAD GEN • CONTENT
              </div>
            </div>

            {/* 02 D2C & E-Comm */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                  <ShoppingBag size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>02</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>D2C & E-Comm</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Make your products impossible to scroll past.</p>
              <div className="ind-tag-blue" style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-blue)", marginTop: "auto" }}>
                CONTENT • UGC
              </div>
            </div>

            {/* 03 Hospitality */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-coral)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                  <Coffee size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>03</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Hospitality</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Give people a reason to visit, book & come back.</p>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-coral)", marginTop: "auto" }}>
                REELS • SOCIAL
              </div>
            </div>

            {/* 04 Healthcare */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FAFFCC", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ACC00" }}>
                  <Heart size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>04</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Healthcare</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Build trust before they walk through your door.</p>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ACC00", marginTop: "auto" }}>
                CONTENT • LEADS
              </div>
            </div>

            {/* 05 Education */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                  <GraduationCap size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>05</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Education</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Turn attention into new admissions.</p>
              <div className="ind-tag-blue" style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-blue)", marginTop: "auto" }}>
                LEADS • ADS
              </div>
            </div>

            {/* 06 Automotive */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-lime)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-dark)" }}>
                  <Car size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>06</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Automotive</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Put your showroom on everyone's feed.</p>
              <div className="ind-tag-dark" style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-dark)", marginTop: "auto" }}>
                REELS • CAMPAIGNS
              </div>
            </div>

            {/* 07 Fashion & Beauty */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FAFFCC", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ACC00" }}>
                  <Sparkles size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>07</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Fashion & Beauty</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Make your brand impossible to scroll past.</p>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ACC00", marginTop: "auto" }}>
                CONTENT • SOCIAL
              </div>
            </div>

            {/* 08 Pro Services */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-coral)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                  <Briefcase size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>08</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Pro Services</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Turn expertise into attention—and clients.</p>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-coral)", marginTop: "auto" }}>
                BRANDING • LEADS
              </div>
            </div>

            {/* 09 Startups & Tech */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-coral)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                  <Rocket size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>09</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Startups & Tech</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Make complex ideas impossible to ignore.</p>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-coral)", marginTop: "auto" }}>
                CONTENT • B2B
              </div>
            </div>

            {/* 10 Fitness & Sports */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FAFFCC", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ACC00" }}>
                  <Dumbbell size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>10</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Fitness & Sports</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Build a brand people want to be part of.</p>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ACC00", marginTop: "auto" }}>
                REELS • COMMUNITY
              </div>
            </div>

            {/* 11 Travel & Exp */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-lime)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-dark)" }}>
                  <Map size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>11</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Travel & Exp</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Sell the experience before they book it.</p>
              <div className="ind-tag-dark" style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-dark)", marginTop: "auto" }}>
                CONTENT • SOCIAL
              </div>
            </div>

            {/* 12 Finance */}
            <div className="industry-card reveal" onClick={() => navigate("/work")} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--brand-blue)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                  <PieChart size={16} />
                </div>
                <span className="ind-num" style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", color: "#d1d5db" }}>12</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "15px", marginBottom: "8px", textTransform: "uppercase" }}>Finance</h3>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>Make trust your strongest marketing asset.</p>
              <div className="ind-tag-blue" style={{ fontSize: "9px", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--brand-blue)", marginTop: "auto" }}>
                CONTENT • BRANDING
              </div>
            </div>
          </div>

          <div style={{ marginTop: "48px", textAlign: "center" }} className="reveal">
            <button
              type="button"
              onClick={() => navigate("/work")}
              style={{ background: "transparent", border: "2px solid var(--brand-dark)", color: "var(--brand-dark)", padding: "12px 32px", borderRadius: "4px", fontWeight: "800", fontFamily: "var(--font-space)", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "12px" }}
            >
              Let's scale your brand <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 7. PROCESS SECTION */}
      <section className="process-section">
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }} className="reveal">
            <p style={{ fontFamily: "var(--font-space)", fontWeight: "800", color: "var(--brand-blue)", letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "14px", marginBottom: "16px" }}>Our Process</p>
            <h2 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(36px, 5vw, 70px)", lineHeight: 0.9, letterSpacing: "-0.04em", textTransform: "uppercase", color: "var(--brand-dark)" }}>
              FROM IDEA <br /> <span style={{ color: "transparent", WebkitTextStroke: "2px #09090B" }}>→ FEED.</span>
            </h2>
          </div>

          <div className="process-steps-grid">
            <div className="process-connecting-line" />

            <div className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div className="process-step-circle" style={{ background: "#ffffff", border: "1px solid #e5e7eb", color: "var(--brand-dark)" }}>01</div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", marginBottom: "12px", textTransform: "uppercase", color: "var(--brand-dark)" }}>Discover</h3>
              <p style={{ color: "#4b5563", fontSize: "13px", fontWeight: "500", lineHeight: 1.6, maxWidth: "260px" }}>We dig deep into your business, audience, and goals. No assumptions.</p>
            </div>

            <div className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div className="process-step-circle" style={{ background: "var(--brand-blue)", color: "#ffffff", ring: "8px solid #F4F4F5" }}>02</div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", marginBottom: "12px", textTransform: "uppercase", color: "var(--brand-dark)" }}>Build</h3>
              <p style={{ color: "#4b5563", fontSize: "13px", fontWeight: "500", lineHeight: 1.6, maxWidth: "260px" }}>Strategy, content creation, visual design, and campaign architecture.</p>
            </div>

            <div className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div className="process-step-circle" style={{ background: "var(--brand-dark)", color: "#ffffff", ring: "8px solid #F4F4F5" }}>03</div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", marginBottom: "12px", textTransform: "uppercase", color: "var(--brand-dark)" }}>Launch</h3>
              <p style={{ color: "#4b5563", fontSize: "13px", fontWeight: "500", lineHeight: 1.6, maxWidth: "260px" }}>We push the button. Your brand enters the feed where the audience lives.</p>
            </div>

            <div className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div className="process-step-circle" style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", ring: "8px solid #F4F4F5" }}>04</div>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "18px", marginBottom: "12px", textTransform: "uppercase", color: "var(--brand-dark)" }}>Optimize</h3>
              <p style={{ color: "#4b5563", fontSize: "13px", fontWeight: "500", lineHeight: 1.6, maxWidth: "260px" }}>Measure everything. Learn from the data. Scale what actually works.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PHILOSOPHY / MANIFESTO */}
      <section className="philosophy-section">
        <div className="philosophy-grid">
          <div className="reveal">
            <h2 className="philosophy-left-title">
              NO <br /> BORING <br /> MARKETING.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }} className="reveal">
            <div style={{ borderTop: "2px solid rgba(9, 9, 11, 0.2)", paddingTop: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "24px", marginBottom: "12px", textTransform: "uppercase" }}>NO RANDOM POSTING.</h3>
              <p style={{ fontSize: "18px", fontWeight: "500", opacity: 0.85, lineHeight: 1.6 }}>Every single piece of content has a strategic reason for existing. Hope is not a strategy.</p>
            </div>

            <div style={{ borderTop: "2px solid rgba(9, 9, 11, 0.2)", paddingTop: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "24px", marginBottom: "12px", textTransform: "uppercase" }}>NO "BOOST BUTTON" STRATEGY.</h3>
              <p style={{ fontSize: "18px", fontWeight: "500", opacity: 0.85, lineHeight: 1.6 }}>Paid media requires actual architecture. We build robust funnels, not quick fixes.</p>
            </div>

            <div style={{ borderTop: "2px solid rgba(9, 9, 11, 0.2)", paddingTop: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "24px", marginBottom: "12px", textTransform: "uppercase" }}>NO DESIGN FOR DESIGN'S SAKE.</h3>
              <p style={{ fontSize: "18px", fontWeight: "500", opacity: 0.85, lineHeight: 1.6 }}>Pretty visuals are useless if they don't communicate. Creative must drive action.</p>
            </div>

            <div style={{ borderTop: "2px solid rgba(9, 9, 11, 0.2)", paddingTop: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "24px", marginBottom: "12px", textTransform: "uppercase" }}>NO VANITY METRICS.</h3>
              <p style={{ fontSize: "18px", fontWeight: "500", opacity: 0.85, lineHeight: 1.6 }}>Reach and likes are nice for the ego. Conversions and revenue are better for the business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ABOUT SNIPPET */}
      <section id="about" className="about-section">
        <div className="reveal">
          <h2 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--brand-blue)", marginBottom: "24px" }}>Who's behind the feed</h2>
          <h3 style={{ fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "clamp(40px, 6vw, 60px)", letterSpacing: "-0.04em", marginBottom: "32px", lineHeight: 0.9, textTransform: "uppercase", color: "var(--brand-dark)" }}>WE'RE GETINTOFEED.</h3>

          <p style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: "500", lineHeight: 1.4, color: "var(--brand-dark)", marginBottom: "32px" }}>
            A creative growth studio built around one simple idea: <br />
            <span style={{ background: "var(--brand-lime)", padding: "2px 8px", display: "inline-block", marginTop: "8px" }}>good marketing shouldn't feel like marketing.</span>
          </p>

          <p style={{ fontSize: "16px", color: "#6b7280", maxWidth: "680px", margin: "0 auto 48px auto", lineHeight: 1.6, fontWeight: "500" }}>
            We bring together content, creative, social and performance marketing under one roof — helping brands go from "we need marketing" to "people are actually talking about us."
          </p>

          <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--brand-dark)", color: "#ffffff", padding: "16px 28px", borderRadius: "4px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "16px", textTransform: "uppercase" }}>
            Strategy <span style={{ color: "var(--brand-lime)", margin: "0 8px" }}>×</span> Creativity <span style={{ color: "var(--brand-blue)", margin: "0 8px" }}>×</span> Performance
          </div>
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <section id="contact" className="cta-section">
        <div className="cta-blue-card reveal">
          <svg className="absolute left-[5%] top-[20%] w-20 h-20 text-white/10 rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: "absolute", left: "5%", top: "20%", opacity: 0.15 }}>
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
          </svg>

          <div style={{ position: "relative", zIndex: 10, maxWidth: "768px", margin: "0 auto" }}>
            <h2 className="cta-heading">
              READY TO <br />
              GET INTO <br />
              <span className="text-brand-lime">THE FEED?</span>
            </h2>

            <p style={{ fontSize: "18px", color: "#dbeafe", fontWeight: "500", marginBottom: "48px", maxWidth: "560px", margin: "0 auto 48px auto" }}>
              Tell us what you're building. We'll figure out how to get it noticed.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => { setSelectedService("Full Growth Sprint"); setLeadModalOpen(true); }}
                style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "16px 40px", borderRadius: "4px", fontWeight: "800", fontFamily: "var(--font-space)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "14px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
              >
                Start a project <ArrowRight size={16} />
              </button>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
                <a href="mailto:growth@getintofeed.com" className="link-underline" style={{ color: "#ffffff", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", fontSize: "14px", textDecoration: "none" }}>
                  ✉️ growth@getintofeed.com
                </a>
                <a href="tel:+918810356950" className="link-underline" style={{ color: "#ffffff", fontFamily: "var(--font-space)", fontWeight: "800", textTransform: "uppercase", fontSize: "14px", textDecoration: "none" }}>
                  📞 +91-8810356950
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner-flex">
          <div>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="navbar-brand" style={{ marginBottom: "16px", fontSize: "32px" }}>
              <img src="/logo-navbar.png" alt="Get Into Feed" className="navbar-logo-img" style={{ width: "32px", height: "32px" }} />
              <span>getintofeed.</span>
            </a>
            <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500", maxWidth: "320px" }}>
              A vibrant growth studio that gets brands into the feed — and gets them results.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <a href="/services/content-marketing" onClick={(e) => { e.preventDefault(); navigate("/services/content-marketing"); }} className="nav-link">Content</a>
              <a href="/services/ads-campaign" onClick={(e) => { e.preventDefault(); navigate("/services/ads-campaign"); }} className="nav-link">Paid Media</a>
              <a href="/services/social-media" onClick={(e) => { e.preventDefault(); navigate("/services/social-media"); }} className="nav-link">Social</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <a href="/services/graphics-design" onClick={(e) => { e.preventDefault(); navigate("/services/graphics-design"); }} className="nav-link">Creative</a>
              <a href="/services/strategy" onClick={(e) => { e.preventDefault(); navigate("/services/strategy"); }} className="nav-link">Strategy</a>
              <a href="/admin" onClick={(e) => { e.preventDefault(); navigate("/admin"); }} className="nav-link" style={{ color: "#D4FF00" }}>Admin Studio</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-space)", fontWeight: "800", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}><Instagram size={16} color="#D4FF00" /> Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}><Linkedin size={16} color="#0033FF" /> LinkedIn</a>
              <a href="https://wa.me/918810356950" target="_blank" rel="noreferrer" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}><MessageCircle size={16} color="#25D366" /> WhatsApp</a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1600px", margin: "0 auto", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "24px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", fontSize: "12px", fontFamily: "var(--font-space)", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280" }}>
          <p>© 2026 GetIntoFeed Growth Studio.</p>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <a
              href="https://www.dmca.com/Protection/Status.aspx?ID=d7bfaa8b-113f-40c7-b0b8-9da53cf5cba7"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/dmca-badge.svg" alt="DMCA Protected" style={{ height: "24px", width: "auto" }} />
            </a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }} className="nav-link">Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigate("/terms"); }} className="nav-link">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* 12. FLOATING WHATSAPP WIDGET */}
      <WhatsAppWidget />

      {/* 13. LEAD INGESTION MODAL */}
      {leadModalOpen && (
        <div className="lead-modal-backdrop" onClick={() => setLeadModalOpen(false)}>
          <div className="lead-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLeadModalOpen(false)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer" }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--font-space)", fontSize: "11px", fontWeight: "900", color: "var(--brand-lime)", letterSpacing: "0.1em", textTransform: "uppercase" }}>GET INTO THE FEED</span>
              <h3 style={{ fontFamily: "var(--font-space)", fontSize: "28px", fontWeight: "900", textTransform: "uppercase", margin: "4px 0 8px 0" }}>Let's Scale Your Brand</h3>
              <p style={{ fontSize: "14px", color: "#9ca3af" }}>Tell us what you're building. Our team will reach out in under 2 hours.</p>
            </div>

            {submitSuccess ? (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <Check size={36} color="var(--brand-lime)" style={{ margin: "0 auto 12px auto" }} />
                <h4 style={{ fontFamily: "var(--font-space)", fontSize: "20px", fontWeight: "800", color: "var(--brand-lime)" }}>Inquiry Received!</h4>
                <p style={{ color: "#d1d5db", fontSize: "14px", marginTop: "8px" }}>We'll reach out on WhatsApp/Phone (+91-8810356950) shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ashish Raghav"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. ashish@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Phone / WhatsApp *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 8810356950"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>Website / Instagram Link</label>
                  <input
                    type="text"
                    placeholder="e.g. yourbrand.com or @yourbrand"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-space)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "6px" }}>What are your growth goals?</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your brand, budget, and targets..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#ffffff", outline: "none", fontSize: "14px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: "var(--brand-lime)", color: "var(--brand-dark)", padding: "14px", borderRadius: "6px", fontFamily: "var(--font-space)", fontWeight: "900", textTransform: "uppercase", fontSize: "14px", letterSpacing: "0.05em", border: "none", cursor: "pointer", marginTop: "8px" }}
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
