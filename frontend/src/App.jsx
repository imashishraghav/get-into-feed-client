import React, { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bookmark,
  Check,
  Clapperboard,
  Code,
  Coffee,
  Briefcase,
  Car,
  Dumbbell,
  Edit3,
  Flame,
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
  PieChart,
  Rocket,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
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
  LegalPage
} from "./DetailPages";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

export default function App() {
  const [route, setRoute] = useState(window.location.pathname || "/");
  const [showTopBar, setShowTopBar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("General Inbound");
  const [scrollProgress, setScrollProgress] = useState(0);

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
    if (route === "/" || route === "") {
      document.body.style.backgroundColor = "#09090B";
      document.body.style.color = "#FFFFFF";
    } else {
      document.body.style.backgroundColor = "#FFFFFF";
      document.body.style.color = "#09090B";
    }

    const handlePopState = () => {
      const p = window.location.pathname;
      setRoute(p);
      if (p === "/" || p === "") {
        document.body.style.backgroundColor = "#09090B";
        document.body.style.color = "#FFFFFF";
      } else {
        document.body.style.backgroundColor = "#FFFFFF";
        document.body.style.color = "#09090B";
      }
    };
    window.addEventListener("popstate", handlePopState);

    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [route]);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (route !== "/" && route !== "") {
      navigate("/" + id);
      setTimeout(() => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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
          source: "GetIntoFeed Exact Homepage"
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
  if (route.startsWith("/blog") || route.startsWith("/insights")) {
    const slug = route.replace("/blog/", "").replace("/insights/", "").replace(/\/.*$/, "");
    return <FeedNotesPage slug={slug !== "/blog" && slug !== "/insights" && slug !== "" ? slug : null} onNavigate={navigate} />;
  }
  if (route.startsWith("/careers")) {
    return <CareersPage onNavigate={navigate} />;
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

  // =========================================================================
  // EXACT GETINTOFEED HOMEPAGE (100% MATCH TO https://getintofeedd.vercel.app/)
  // =========================================================================
  return (
    <div className="antialiased selection:bg-brand-lime selection:text-brand-dark bg-brand-dark font-inter relative min-h-screen text-white">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-brand-lime z-[100] transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        id="scroll-progress"
      ></div>

      {/* Top Bar */}
      {showTopBar && (
        <div className="bg-brand-lime text-brand-dark text-[10px] sm:text-xs py-2 px-4 flex items-center justify-center gap-1 sm:gap-2 font-bold font-space uppercase tracking-wider z-50 relative w-full shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-brand-dark shrink-0 animate-pulse-slow" style={{ width: "14px", height: "14px" }} />
          <p className="text-center line-clamp-1 sm:line-clamp-none flex-1 sm:flex-none">
            NOW TAKING ON 3 NEW BRANDS THIS MONTH — LET'S BUILD SOMETHING PEOPLE CAN'T SCROLL PAST.
          </p>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
            className="inline-flex bg-brand-dark text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-[9px] sm:text-[10px] ml-1 sm:ml-2 hover:bg-black shrink-0 items-center gap-1 transition-colors group text-decoration-none"
          >
            LET'S TALK <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
          </a>
          <button
            type="button"
            onClick={() => setShowTopBar(false)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 shrink-0 opacity-70 hover:opacity-100 transition-opacity bg-transparent border-none text-brand-dark cursor-pointer"
            id="close-banner"
            aria-label="Close Announcement"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" style={{ width: "16px", height: "16px" }} />
          </button>
        </div>
      )}

      {/* Navbar */}
      <nav className="w-full z-50 bg-brand-dark border-b border-white/10 relative" id="navbar">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 py-4 md:py-5 flex justify-between items-center">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate("/"); }}
            className="font-space font-bold text-xl md:text-2xl tracking-tighter text-white hover:text-brand-lime transition-colors text-decoration-none"
          >
            getintofeed.
          </a>

          <div className="hidden lg:flex items-center gap-10 font-bold font-space text-xs tracking-widest text-white uppercase">
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection("#services"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">Services</a>
            <a href="#industries" onClick={(e) => { e.preventDefault(); scrollToSection("#industries"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">Industries</a>
            <a href="#ways-to-work" onClick={(e) => { e.preventDefault(); scrollToSection("#ways-to-work"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">Solutions</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection("#pricing"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">Pricing</a>
          </div>

          <button
            type="button"
            onClick={() => { setSelectedService("Start a Project"); setLeadModalOpen(true); }}
            className="hidden md:flex bg-brand-blue text-white px-6 py-3 rounded-lg text-xs font-bold font-space uppercase tracking-wider hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(0,51,255,0.4)] transition-all items-center gap-2 group cursor-pointer border-none"
          >
            Start a project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ width: "16px", height: "16px" }} />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-btn"
            className="lg:hidden text-white p-1 bg-transparent border-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" style={{ width: "24px", height: "24px" }} /> : <Menu className="w-6 h-6" style={{ width: "24px", height: "24px" }} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="flex flex-col bg-brand-dark px-6 py-6 border-b border-white/10 gap-6 absolute w-full z-40 left-0 top-full lg:hidden shadow-2xl">
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection("#services"); }} className="mobile-link text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">Services</a>
            <a href="#industries" onClick={(e) => { e.preventDefault(); scrollToSection("#industries"); }} className="mobile-link text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">Industries</a>
            <a href="#ways-to-work" onClick={(e) => { e.preventDefault(); scrollToSection("#ways-to-work"); }} className="mobile-link text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">Solutions</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection("#pricing"); }} className="mobile-link text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">Pricing</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection("#about"); }} className="mobile-link text-white font-space font-bold text-sm tracking-widest uppercase hover:text-brand-lime transition-colors text-decoration-none">About Us</a>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); setSelectedService("Start a Project"); setLeadModalOpen(true); }}
              className="mobile-link bg-brand-blue text-white px-6 py-3 rounded-lg text-xs font-bold font-space uppercase tracking-wider hover:bg-blue-600 transition-all flex justify-center items-center gap-2 group w-full mt-2 cursor-pointer border-none"
            >
              Start a project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ width: "16px", height: "16px" }} />
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-15 pt-6 pb-6 md:pt-12 md:pb-12 px-6 md:px-12 lg:px-16 overflow-hidden flex items-center bg-brand-dark text-white w-full">
        {/* Background accents with EXPLICIT dimensions */}
        <div className="absolute inset-0 w-full pointer-events-none overflow-hidden">
          <svg className="absolute left-[3%] top-[10%] w-16 h-16 text-brand-blue hidden xl:block -rotate-12 opacity-30 blur-[1px]" style={{ width: "64px", height: "64px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" className="stroke-current" strokeWidth="3" />
          </svg>
          <svg className="absolute right-[45%] top-[25%] w-12 h-12 text-brand-lime/20 hidden lg:block" style={{ width: "48px", height: "48px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 22C10 22 7 14 2 12C7 10 10 2 10 2C10 2 13 10 18 12C13 14 10 22 10 22Z" className="fill-currentColor" />
          </svg>
          <svg className="absolute right-[2%] bottom-[15%] w-32 h-32 text-brand-lime hidden xl:block rotate-12 opacity-80 blur-[2px]" style={{ width: "128px", height: "128px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" className="stroke-current" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10">
          {/* Left: Typography & CTA */}
          <div className="reveal text-center lg:text-left">
            <h1 className="font-space font-bold text-[38px] leading-[1] sm:text-[55px] sm:leading-[0.9] md:text-[85px] xl:text-[110px] md:leading-[0.85] tracking-tighter uppercase">
              GET YOUR BRAND <br />
              INTO THE <span className="text-brand-blue">FEED.</span>
            </h1>

            <p className="mt-3 md:mt-6 text-sm sm:text-lg md:text-xl max-w-md mx-auto lg:mx-0 font-medium text-gray-300 leading-relaxed font-inter reveal reveal-delay-1">
              We create content, run ads and build strategies that get brands <span className="text-brand-lime font-bold">noticed, clicked and remembered.</span>
            </p>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 reveal reveal-delay-2">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="w-full sm:w-auto bg-brand-lime text-brand-dark px-8 py-3.5 sm:py-4 rounded-lg font-bold font-space uppercase text-xs sm:text-sm tracking-wider hover:bg-white hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(212,255,0,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] text-decoration-none"
              >
                Let's Talk
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ width: "16px", height: "16px" }} />
              </a>
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); scrollToSection("#services"); }}
                className="w-full sm:w-auto text-white font-bold font-space uppercase text-xs sm:text-sm tracking-wider hover:text-brand-lime transition-colors flex items-center justify-center gap-2 border-b-2 border-transparent hover:border-brand-lime py-2 group text-decoration-none"
              >
                See What We Do
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" style={{ width: "16px", height: "16px" }} />
              </a>
            </div>
          </div>

          {/* Right: Floating UI Elements Mockup (Desktop) & Interactive Mobile Graphic */}
          <div className="relative h-[280px] sm:h-[350px] lg:h-[500px] xl:h-[550px] w-full flex justify-center items-center mt-2 lg:mt-0 reveal reveal-delay-3">
            {/* MOBILE VISUAL GRAPHIC */}
            <div className="lg:hidden w-full max-w-sm bg-gradient-to-br from-[#18181B] to-[#111113] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-lime flex items-center justify-center text-brand-dark font-bold text-xs font-space">g.</div>
                  <span className="font-space font-bold text-xs uppercase tracking-wider text-white">Full-Stack Growth</span>
                </div>
                <span className="bg-brand-blue/20 text-brand-blue text-[9px] font-space font-bold uppercase px-2 py-0.5 rounded-full">One-Stop Solution</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex flex-col justify-between">
                  <Megaphone className="w-4 h-4 text-brand-lime mb-1" style={{ width: "16px", height: "16px" }} />
                  <div>
                    <p className="text-[9px] text-gray-400 font-space uppercase">Paid Media</p>
                    <p className="font-space font-bold text-[11px] text-white">Google & Meta Ads</p>
                  </div>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex flex-col justify-between">
                  <Code className="w-4 h-4 text-brand-blue mb-1" style={{ width: "16px", height: "16px" }} />
                  <div>
                    <p className="text-[9px] text-gray-400 font-space uppercase">Development</p>
                    <p className="font-space font-bold text-[11px] text-white">High-Speed Web</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-brand-coral" style={{ width: "14px", height: "14px" }} />
                  <span className="font-space font-bold text-[11px] text-white uppercase tracking-wider">SEO + Content Engine</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-ping"></span>
              </div>
            </div>

            {/* DESKTOP 3D PHONE MOCKUP */}
            <div className="hidden lg:flex absolute z-20 w-[280px] xl:w-[300px] h-[520px] xl:h-[570px] bg-brand-dark border-[10px] xl:border-[12px] border-[#1A1A1A] rounded-[40px] shadow-2xl overflow-hidden flex-col animate-float-medium" style={{ width: "300px", height: "550px" }}>
              <div className="absolute top-0 inset-x-0 h-5 xl:h-6 bg-[#1A1A1A] rounded-b-3xl w-1/2 mx-auto z-30"></div>
              <div className="pt-10 pb-4 px-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <span className="text-brand-dark font-space font-bold text-xs">g.</span>
                  </div>
                  <span className="font-space font-bold text-sm">getintofeed.</span>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-400" style={{ width: "20px", height: "20px" }} />
              </div>
              <div className="flex-1 bg-black flex items-center justify-center p-6 relative">
                <h3 className="font-space font-bold text-4xl xl:text-5xl uppercase leading-[0.85] tracking-tighter text-white z-10 text-center">
                  Growth <br />
                  Starts in <br />
                  <span className="text-brand-lime">The Feed.</span>
                </h3>
              </div>
              <div className="p-4 bg-brand-dark">
                <div className="flex gap-4 mb-3">
                  <Heart className="w-5 h-5 xl:w-6 xl:h-6 fill-brand-coral text-brand-coral" style={{ width: "24px", height: "24px" }} />
                  <MessageCircle className="w-5 h-5 xl:w-6 xl:h-6 text-white" style={{ width: "24px", height: "24px" }} />
                  <Send className="w-5 h-5 xl:w-6 xl:h-6 text-white" style={{ width: "24px", height: "24px" }} />
                  <Bookmark className="w-5 h-5 xl:w-6 xl:h-6 text-white ml-auto" style={{ width: "24px", height: "24px" }} />
                </div>
                <p className="font-bold text-xs xl:text-sm mb-1">1,234 likes</p>
                <p className="text-[10px] xl:text-xs text-gray-300 mb-2 font-inter">
                  <span className="font-bold text-white">Smart strategy. Killer creative.</span>
                </p>
              </div>
            </div>

            {/* Floating Cards (Desktop) */}
            <div className="hidden lg:block absolute z-10 top-[10%] left-[2%] xl:-left-[5%] bg-white p-4 xl:p-5 rounded-2xl shadow-2xl w-44 xl:w-48 animate-float-slow -rotate-6" style={{ width: "190px" }}>
              <p className="text-[10px] xl:text-xs text-gray-500 font-space tracking-widest uppercase mb-1">Reach</p>
              <p className="font-space font-bold text-3xl xl:text-4xl text-brand-dark mb-2">2.8M</p>
              <svg className="w-full h-6 xl:h-8" style={{ width: "100%", height: "32px" }} viewBox="0 0 100 30" fill="none">
                <path d="M0 25 L20 15 L40 20 L60 5 L80 10 L100 0" stroke="#0033FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="100" cy="0" r="4" fill="#0033FF" />
              </svg>
            </div>

            <div className="hidden lg:block absolute z-30 bottom-[15%] left-[5%] xl:left-[2%] bg-brand-lime p-4 xl:p-5 rounded-2xl shadow-2xl w-36 xl:w-40 animate-float-fast rotate-3" style={{ width: "160px" }}>
              <p className="text-[10px] xl:text-xs text-brand-dark/60 font-space tracking-widest uppercase mb-1">ROAS</p>
              <p className="font-space font-bold text-3xl xl:text-4xl text-brand-dark mb-2">4.6x</p>
              <svg className="w-full h-6 xl:h-8" style={{ width: "100%", height: "32px" }} viewBox="0 0 100 30" fill="none">
                <path d="M0 25 L25 15 L50 20 L75 5 L100 0" stroke="#09090B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="90,0 100,0 100,10" stroke="#09090B" strokeWidth="3" fill="none" />
              </svg>
            </div>

            <div className="hidden lg:block absolute z-10 top-[5%] right-[0%] xl:-right-[10%] bg-brand-blue p-4 xl:p-5 rounded-2xl shadow-2xl w-40 xl:w-44 animate-float-medium rotate-6" style={{ width: "175px" }}>
              <p className="text-[10px] xl:text-xs text-blue-200 font-space tracking-widest uppercase mb-1">CTR</p>
              <p className="font-space font-bold text-3xl xl:text-4xl text-white mb-2">+42%</p>
              <svg className="w-full h-6 xl:h-8" style={{ width: "100%", height: "32px" }} viewBox="0 0 100 30" fill="none">
                <path d="M0 25 L25 20 L50 10 L75 15 L100 0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="90,0 100,0 100,10" stroke="#FFFFFF" strokeWidth="3" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Sleek Strip: Hot Offering Banner (Zero Gap) */}
      <section className="bg-white pt-2 pb-2 px-6 md:px-12 lg:px-16 w-full relative z-20 border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto reveal">
          <div className="text-[10px] sm:text-xs font-space font-bold uppercase tracking-widest text-brand-coral mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} /> Hot Offer
          </div>

          <div className="bg-brand-lime rounded-xl md:rounded-full p-4 sm:p-5 md:pr-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-brand-lime hover:shadow-md transition-shadow duration-300">
            <p className="font-space font-bold text-base sm:text-lg md:text-xl text-brand-dark uppercase tracking-tight m-0 text-center md:text-left leading-snug">
              Get everything you need to grow for <span className="bg-brand-dark text-white px-2 py-0.5 rounded ml-1">₹14,999/mo</span>
            </p>

            <a
              href="#pricing"
              onClick={(e) => { e.preventDefault(); scrollToSection("#pricing"); }}
              className="w-full md:w-auto bg-brand-dark text-white px-6 py-3 rounded-full font-space font-bold uppercase text-[10px] md:text-xs tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2 group/btn shrink-0 text-decoration-none"
            >
              See What's Included <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" style={{ width: "14px", height: "14px" }} />
            </a>
          </div>
        </div>
      </section>

      {/* Services Overview (Compact Button Grid) */}
      <section id="services" className="relative z-20 pt-8 pb-16 md:pt-12 md:pb-24 bg-white text-brand-dark px-6 md:px-12 lg:px-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-10 lg:gap-16 items-start">
          <div className="reveal lg:sticky lg:top-32 text-center lg:text-left">
            <p className="font-space font-bold text-brand-blue tracking-widest uppercase text-xs md:text-sm mb-4">Core Focus</p>
            <h2 className="font-space font-bold text-[32px] sm:text-[45px] lg:text-[50px] leading-[0.9] tracking-tighter uppercase mb-4 text-brand-dark">
              WE TURN SCROLLS <br /> INTO RESULTS.
            </h2>
            <svg className="w-40 md:w-56 h-5 md:h-6 mb-6 mx-auto lg:mx-0" style={{ width: "220px", height: "24px" }} viewBox="0 0 250 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 15C45.5 5 110 -2 248 8" stroke="#D4FF00" strokeWidth="4" strokeLinecap="round" />
              <path d="M15 18C60 12 120 8 230 15" stroke="#D4FF00" strokeWidth="4" strokeLinecap="round" />
            </svg>

            <p className="text-gray-600 text-sm md:text-base mb-8 max-w-sm mx-auto lg:mx-0 leading-relaxed font-medium">
              From content that connects to campaigns that convert, we bring everything together to help your brand grow faster and smarter.
            </p>
          </div>

          <div className="w-full">
            {/* Compact Buttons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
              <div
                onClick={() => navigate("/services/content-marketing")}
                className="bg-[#F8F8F8] p-3 md:px-5 md:py-4 rounded-xl hover:shadow-md hover:bg-brand-dark transition-all duration-300 border border-transparent hover:border-brand-dark group reveal cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1"
              >
                <Edit3 className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-brand-blue group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
                <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight group-hover:text-white transition-colors m-0 leading-tight text-left text-brand-dark">Content Marketing</h3>
              </div>

              <div
                onClick={() => navigate("/services/ads-campaign")}
                className="bg-[#F8F8F8] p-3 md:px-5 md:py-4 rounded-xl hover:shadow-md hover:bg-brand-dark transition-all duration-300 border border-transparent hover:border-brand-dark group reveal reveal-delay-1 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1"
              >
                <Megaphone className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#9ACC00] group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
                <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight group-hover:text-white transition-colors m-0 leading-tight text-left text-brand-dark">Ads Campaign</h3>
              </div>

              <div
                onClick={() => navigate("/services/social-media")}
                className="bg-[#F8F8F8] p-3 md:px-5 md:py-4 rounded-xl hover:shadow-md hover:bg-brand-dark transition-all duration-300 border border-transparent hover:border-brand-dark group reveal reveal-delay-2 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1"
              >
                <Users className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-brand-blue group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
                <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight group-hover:text-white transition-colors m-0 leading-tight text-left text-brand-dark">Social Media</h3>
              </div>

              <div
                onClick={() => navigate("/services/graphics-design")}
                className="bg-[#F8F8F8] p-3 md:px-5 md:py-4 rounded-xl hover:shadow-md hover:bg-brand-dark transition-all duration-300 border border-transparent hover:border-brand-dark group reveal reveal-delay-3 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1"
              >
                <PenTool className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#9ACC00] group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
                <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight group-hover:text-white transition-colors m-0 leading-tight text-left text-brand-dark">Graphics Design</h3>
              </div>

              <div
                onClick={() => navigate("/services/reels")}
                className="bg-[#F8F8F8] p-3 md:px-5 md:py-4 rounded-xl hover:shadow-md hover:bg-brand-dark transition-all duration-300 border border-transparent hover:border-brand-dark group reveal cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1"
              >
                <Clapperboard className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-red-500 group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
                <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight group-hover:text-white transition-colors m-0 leading-tight text-left text-brand-dark">Reels</h3>
              </div>

              <div
                onClick={() => navigate("/services/videos")}
                className="bg-[#F8F8F8] p-3 md:px-5 md:py-4 rounded-xl hover:shadow-md hover:bg-brand-dark transition-all duration-300 border border-transparent hover:border-brand-dark group reveal reveal-delay-1 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1"
              >
                <Video className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-brand-blue group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
                <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight group-hover:text-white transition-colors m-0 leading-tight text-left text-brand-dark">Videos</h3>
              </div>

              <div
                onClick={() => navigate("/services/growth")}
                className="bg-[#F8F8F8] p-3 md:px-5 md:py-4 rounded-xl hover:shadow-md hover:bg-brand-dark transition-all duration-300 border border-transparent hover:border-brand-dark group reveal reveal-delay-2 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1"
              >
                <Code className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#9ACC00] group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
                <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight group-hover:text-white transition-colors m-0 leading-tight text-left text-brand-dark">Web Development</h3>
              </div>

              <div
                onClick={() => navigate("/services/strategy")}
                className="bg-[#F8F8F8] p-3 md:px-5 md:py-4 rounded-xl hover:shadow-md hover:bg-brand-dark transition-all duration-300 border border-transparent hover:border-brand-dark group reveal reveal-delay-3 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-orange-500 group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
                <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight group-hover:text-white transition-colors m-0 leading-tight text-left text-brand-dark">SEO</h3>
              </div>
            </div>

            {/* CTA Below Services Grid */}
            <div className="mt-8 bg-brand-dark text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 shadow-xl reveal">
              <div className="text-center md:text-left">
                <h4 className="font-space font-bold text-xl md:text-2xl uppercase tracking-tight mb-2">Not sure where to start?</h4>
                <p className="text-gray-400 text-xs md:text-sm font-inter">Let's audit your current feed and find the easiest growth wins.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/audit")}
                className="w-full md:w-auto shrink-0 bg-brand-lime text-brand-dark px-6 py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 group shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-none"
              >
                Get a Free Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker Section */}
      <section className="relative z-30 py-6 bg-brand-lime overflow-hidden w-full">
        <div className="flex w-full hover:pause-animation">
          <div className="animate-marquee whitespace-nowrap flex w-max items-center gap-10 sm:gap-16 font-space font-bold text-xl sm:text-3xl text-brand-dark uppercase tracking-widest px-4 cursor-default">
            <span>CONTENT MARKETING</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>PAID MEDIA</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>WEB DEVELOPMENT</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>SEO</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>SOCIAL</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>CREATIVE</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />

            <span>CONTENT MARKETING</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>PAID MEDIA</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>WEB DEVELOPMENT</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>SEO</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>SOCIAL</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
            <span>CREATIVE</span> <Zap className="fill-brand-dark w-5 h-5" style={{ width: "20px", height: "20px" }} />
          </div>
        </div>
      </section>

      {/* Industries / Fields We Work For */}
      <section id="industries" className="relative z-20 py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-brand-light-gray w-full overflow-hidden border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="mb-10 md:mb-14 reveal text-center max-w-3xl mx-auto flex flex-col items-center">
            <p className="font-space font-bold text-brand-blue tracking-widest uppercase text-xs md:text-sm mb-3">Industries</p>
            <h2 className="font-space font-bold text-[32px] sm:text-[45px] md:text-[55px] lg:text-[60px] leading-[0.9] tracking-tighter uppercase mb-4 text-brand-dark">
              WHO WE <br /> <span className="text-brand-blue">ELEVATE.</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-medium mb-8">Tailored strategies and scroll-stopping content for brands ready to scale.</p>
          </div>

          {/* Compact Industry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full mb-10">
            <div onClick={() => { setSelectedService("Real Estate"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 reveal border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <Home className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-gray-500 group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Real Estate</h3>
            </div>
            <div onClick={() => { setSelectedService("D2C & E-Commerce"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 reveal reveal-delay-1 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-brand-blue group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">D2C & E-Commerce</h3>
            </div>
            <div onClick={() => { setSelectedService("Hospitality"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 reveal reveal-delay-2 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <Coffee className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-brand-coral group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Hospitality</h3>
            </div>
            <div onClick={() => { setSelectedService("Healthcare & Wellness"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 reveal reveal-delay-3 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <Heart className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#9ACC00] group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Healthcare & Wellness</h3>
            </div>
            <div onClick={() => { setSelectedService("Education"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 reveal border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <GraduationCap className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-brand-blue group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Education</h3>
            </div>
            <div onClick={() => { setSelectedService("Automotive"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 reveal reveal-delay-1 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <Car className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-gray-500 group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Automotive</h3>
            </div>
            <div onClick={() => { setSelectedService("Fashion & Beauty"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 reveal reveal-delay-2 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#9ACC00] group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Fashion & Beauty</h3>
            </div>
            <div onClick={() => { setSelectedService("Pro Services"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 reveal reveal-delay-3 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-brand-coral group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Pro Services</h3>
            </div>
            <div onClick={() => { setSelectedService("Startups & Tech"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <Rocket className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-brand-coral group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Startups & Tech</h3>
            </div>
            <div onClick={() => { setSelectedService("Fitness & Sports"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <Dumbbell className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-[#9ACC00] group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Fitness & Sports</h3>
            </div>
            <div onClick={() => { setSelectedService("Travel & Experiences"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <Map className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-gray-500 group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Travel & Experiences</h3>
            </div>
            <div onClick={() => { setSelectedService("Finance"); setLeadModalOpen(true); }} className="group bg-white p-3 md:px-5 md:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-brand-dark cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 md:gap-3 w-full h-full hover:-translate-y-1">
              <PieChart className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-brand-blue group-hover:text-brand-lime transition-colors" style={{ width: "20px", height: "20px" }} />
              <h3 className="font-space font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-tight m-0 leading-tight text-brand-dark group-hover:text-white transition-colors">Finance</h3>
            </div>
          </div>

          <div className="text-center reveal">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
              className="inline-flex bg-white border border-gray-200 text-brand-dark px-6 py-2.5 rounded-lg font-bold font-space uppercase text-xs tracking-wider hover:bg-brand-dark hover:text-white transition-all items-center gap-2 group shadow-sm hover:-translate-y-0.5 text-decoration-none"
            >
              Is your industry missing? Let's talk <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
            </a>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="relative z-10 py-12 md:py-16 bg-white px-6 md:px-12 lg:px-16 w-full border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10 md:mb-12 reveal flex flex-col items-center">
            <p className="font-space font-bold text-brand-blue tracking-widest uppercase text-xs md:text-sm mb-4">Our Process</p>
            <h2 className="font-space font-bold text-[32px] sm:text-[45px] md:text-[55px] lg:text-[60px] leading-[0.9] tracking-tighter uppercase text-brand-dark">
              FROM IDEA <br /> <span className="text-transparent" style={{ WebkitTextStroke: "2px #09090B" }}>→ FEED.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-0 max-w-4xl mx-auto mb-10">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gray-100 -z-10"></div>

            <div className="relative reveal flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-light-gray border border-gray-200 flex items-center justify-center font-space font-bold text-lg md:text-xl shadow-sm mb-4 text-brand-dark z-10 group-hover:-translate-y-1 transition-transform duration-300" style={{ width: "64px", height: "64px" }}>01</div>
              <h3 className="font-space font-bold text-sm md:text-base mb-2 uppercase text-brand-dark">Discover</h3>
              <p className="text-gray-500 text-[11px] md:text-xs font-medium leading-relaxed max-w-[200px] font-inter">We dig deep into your business, audience, and goals. No assumptions.</p>
            </div>

            <div className="relative reveal reveal-delay-1 flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-blue text-white flex items-center justify-center font-space font-bold text-lg md:text-xl shadow-sm mb-4 z-10 ring-8 ring-white group-hover:-translate-y-1 transition-transform duration-300" style={{ width: "64px", height: "64px" }}>02</div>
              <h3 className="font-space font-bold text-sm md:text-base mb-2 uppercase text-brand-dark">Build</h3>
              <p className="text-gray-500 text-[11px] md:text-xs font-medium leading-relaxed max-w-[200px] font-inter">Strategy, content creation, visual design, and campaign architecture.</p>
            </div>

            <div className="relative reveal reveal-delay-2 flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-dark text-white flex items-center justify-center font-space font-bold text-lg md:text-xl shadow-sm mb-4 z-10 ring-8 ring-white group-hover:-translate-y-1 transition-transform duration-300" style={{ width: "64px", height: "64px" }}>03</div>
              <h3 className="font-space font-bold text-sm md:text-base mb-2 uppercase text-brand-dark">Launch</h3>
              <p className="text-gray-500 text-[11px] md:text-xs font-medium leading-relaxed max-w-[200px] font-inter">We push the button. Your brand enters the feed where the audience lives.</p>
            </div>

            <div className="relative reveal reveal-delay-3 flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-lime text-brand-dark flex items-center justify-center font-space font-bold text-lg md:text-xl shadow-sm mb-4 z-10 ring-8 ring-white group-hover:-translate-y-1 transition-transform duration-300" style={{ width: "64px", height: "64px" }}>04</div>
              <h3 className="font-space font-bold text-sm md:text-base mb-2 uppercase text-brand-dark">Optimize</h3>
              <p className="text-gray-500 text-[11px] md:text-xs font-medium leading-relaxed max-w-[200px] font-inter">Measure everything. Learn from the data. Scale what actually works.</p>
            </div>
          </div>

          <div className="text-center reveal">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
              className="inline-flex bg-brand-dark text-white px-8 py-3.5 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-brand-lime hover:text-brand-dark hover:shadow-lg hover:-translate-y-0.5 transition-all items-center gap-2 group text-decoration-none"
            >
              Ready to Launch? <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
            </a>
          </div>
        </div>
      </section>

      {/* Why GetIntoFeed (Experience Without The Extra Cost) */}
      <section className="relative z-10 py-12 md:py-16 bg-brand-light-gray text-brand-dark px-6 md:px-12 lg:px-16 w-full border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-10 text-center reveal max-w-3xl mx-auto">
            <p className="font-space font-bold text-brand-blue tracking-widest uppercase text-xs md:text-sm mb-4">Why GetIntoFeed?</p>
            <h2 className="font-space font-bold text-[32px] sm:text-[45px] lg:text-[50px] leading-[0.9] tracking-tighter uppercase mb-6 text-brand-dark">
              EXPERIENCE WITHOUT THE EXTRA COST.
            </h2>
          </div>

          {/* Tighter 4-column Grid for small text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full mb-8">
            <div className="reveal bg-white p-5 md:p-6 rounded-2xl border border-transparent hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <h3 className="font-space font-bold text-sm md:text-base uppercase tracking-tight mb-2 text-brand-dark">Experienced People</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-inter font-medium">
                Skilled specialists working across content, creative, social and performance.
              </p>
            </div>

            <div className="reveal reveal-delay-1 bg-white p-5 md:p-6 rounded-2xl border border-transparent hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <h3 className="font-space font-bold text-sm md:text-base uppercase tracking-tight mb-2 text-brand-dark">Lower Costs</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-inter font-medium">
                Less agency overhead means more affordable pricing for you.
              </p>
            </div>

            <div className="reveal reveal-delay-2 bg-white p-5 md:p-6 rounded-2xl border border-transparent hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <h3 className="font-space font-bold text-sm md:text-base uppercase tracking-tight mb-2 text-brand-dark">One Connected Team</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-inter font-medium">
                Different specialists. One team. One direction.
              </p>
            </div>

            <div className="reveal reveal-delay-3 bg-white p-5 md:p-6 rounded-2xl border border-transparent hover:border-gray-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <h3 className="font-space font-bold text-sm md:text-base uppercase tracking-tight mb-2 text-brand-dark">Flexible Services</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-inter font-medium">
                Take what your business needs — nothing you don't.
              </p>
            </div>
          </div>

          {/* Full width Highlight/CTA */}
          <div className="reveal bg-brand-blue text-white p-6 md:p-8 rounded-2xl border border-transparent shadow-[0_10px_30px_rgba(0,51,255,0.2)] flex flex-col md:flex-row items-center justify-between gap-6 w-full max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <h3 className="font-space font-bold text-lg md:text-xl uppercase tracking-tight mb-2 text-white">Made To Be Affordable</h3>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed font-inter font-medium">
                We built GetIntoFeed around a simple idea: good marketing shouldn't have to be expensive.
              </p>
            </div>
            <a
              href="#ways-to-work"
              onClick={(e) => { e.preventDefault(); scrollToSection("#ways-to-work"); }}
              className="shrink-0 inline-flex bg-brand-lime text-brand-dark px-6 py-3 rounded-lg font-space font-bold uppercase text-xs tracking-wider hover:bg-white transition-all items-center gap-2 group shadow-sm hover:-translate-y-0.5 text-decoration-none"
            >
              View Solutions <ArrowDown className="w-3 h-3 group-hover:translate-y-1 transition-transform" style={{ width: "12px", height: "12px" }} />
            </a>
          </div>
        </div>
      </section>

      {/* Ways To Work With Us / Solutions */}
      <section id="ways-to-work" className="relative z-20 py-12 md:py-16 px-6 md:px-12 lg:px-16 bg-white text-brand-dark w-full overflow-hidden border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="mb-10 md:mb-12 reveal text-center max-w-3xl mx-auto flex flex-col items-center">
            <p className="font-space font-bold text-brand-blue tracking-widest uppercase text-xs md:text-sm mb-4">Solutions</p>
            <h2 className="font-space font-bold text-[32px] sm:text-[45px] md:text-[55px] lg:text-[60px] leading-[0.9] tracking-tighter uppercase mb-4 text-brand-dark">
              WAYS TO <br /> <span className="text-brand-blue">WORK WITH US.</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-medium mb-6 font-inter">Built around your actual goals, not arbitrary packages.</p>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto w-full items-stretch">
            {/* 01 Need Attention (Light Gray Card) */}
            <div className="group bg-brand-light-gray p-6 md:p-8 rounded-3xl border border-transparent hover:border-gray-300 transition-all duration-300 reveal flex flex-col h-full shadow-sm hover:shadow-lg hover:-translate-y-1">
              <h3 className="font-space font-bold text-lg md:text-xl uppercase tracking-tight mb-2 leading-tight text-brand-dark group-hover:text-brand-blue transition-colors">NEED ATTENTION?</h3>
              <div className="text-[9px] sm:text-[10px] font-space font-bold uppercase tracking-widest text-brand-blue mb-4">
                CONTENT + SOCIAL + CREATIVE
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-6 flex-grow font-medium font-inter">
                For businesses that have something good to say but aren't getting enough attention online.
              </p>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="mt-auto w-full text-center bg-white border border-transparent hover:border-brand-dark hover:bg-brand-dark hover:text-white text-brand-dark py-3 rounded-lg font-space font-bold uppercase text-[10px] md:text-xs tracking-wider transition-all inline-flex justify-center items-center gap-2 group/btn shadow-sm text-decoration-none"
              >
                GET NOTICED <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
              </a>
            </div>

            {/* 02 Need Customers (Blue Pop Card) */}
            <div className="group bg-brand-blue text-white p-6 md:p-8 rounded-3xl border border-brand-blue transition-all duration-300 reveal reveal-delay-1 flex flex-col h-full shadow-[0_10px_25px_rgba(0,51,255,0.2)] hover:shadow-[0_15px_35px_rgba(0,51,255,0.4)] relative z-10 hover:-translate-y-1">
              <h3 className="font-space font-bold text-lg md:text-xl uppercase tracking-tight mb-2 leading-tight text-white group-hover:text-brand-lime transition-colors">NEED CUSTOMERS?</h3>
              <div className="text-[9px] sm:text-[10px] font-space font-bold uppercase tracking-widest text-brand-lime mb-4">
                PAID MEDIA + CREATIVE
              </div>
              <p className="text-blue-100 text-xs md:text-sm leading-relaxed mb-6 flex-grow font-medium font-inter">
                For businesses ready to turn digital attention into enquiries, bookings or sales.
              </p>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="mt-auto w-full text-center bg-white hover:bg-brand-lime text-brand-dark py-3 rounded-lg font-space font-bold uppercase text-[10px] md:text-xs tracking-wider transition-all inline-flex justify-center items-center gap-2 shadow-sm group/btn text-decoration-none"
              >
                GET LEADS <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
              </a>
            </div>

            {/* 03 Need The Whole Thing (Dark Card) */}
            <div className="group bg-brand-dark text-white p-6 md:p-8 rounded-3xl border border-brand-dark hover:border-gray-700 transition-all duration-300 reveal reveal-delay-2 flex flex-col h-full shadow-lg hover:shadow-xl hover:-translate-y-1">
              <h3 className="font-space font-bold text-lg md:text-xl uppercase tracking-tight mb-2 leading-tight text-white group-hover:text-brand-lime transition-colors">NEED THE WHOLE THING?</h3>
              <div className="text-[9px] sm:text-[10px] font-space font-bold uppercase tracking-widest text-brand-lime mb-4 leading-relaxed">
                STRATEGY + CONTENT + SOCIAL + CREATIVE + PAID
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 flex-grow font-medium font-inter">
                For brands that want one connected team handling their digital marketing.
              </p>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="mt-auto w-full text-center bg-white/10 border border-white/20 hover:bg-brand-lime hover:border-brand-lime hover:text-brand-dark text-white py-3 rounded-lg font-space font-bold uppercase text-[10px] md:text-xs tracking-wider transition-all inline-flex justify-center items-center gap-2 group/btn text-decoration-none"
              >
                BUILD SYSTEM <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Investment Section */}
      <section id="pricing" className="relative z-20 py-12 md:py-16 px-6 md:px-12 lg:px-16 bg-brand-dark text-white w-full overflow-hidden border-t border-white/10">
        <svg className="absolute right-[5%] top-[10%] w-24 h-24 text-white/5 hidden xl:block rotate-45 pointer-events-none" style={{ width: "96px", height: "96px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        </svg>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="mb-10 md:mb-12 reveal text-center max-w-3xl mx-auto flex flex-col items-center">
            <p className="font-space font-bold text-brand-lime tracking-widest uppercase text-xs md:text-sm mb-4">Investment</p>
            <h2 className="font-space font-bold text-[32px] sm:text-[45px] md:text-[55px] lg:text-[60px] leading-[0.9] tracking-tighter uppercase mb-4 text-white">
              PLANS THAT <br /> <span className="text-brand-blue">SCALE.</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium mb-8 font-inter">Transparent pricing for brands ready to dominate the feed.</p>

            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
              className="inline-flex bg-transparent border border-white/20 text-white px-6 py-2.5 rounded-lg font-bold font-space uppercase text-[10px] sm:text-xs tracking-wider hover:bg-white hover:text-brand-dark transition-all items-center gap-2 group shadow-sm text-decoration-none"
            >
              Talk to Sales <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto w-full items-stretch">
            {/* 01 Basic */}
            <div className="group bg-[#111111] p-6 md:p-8 rounded-3xl border border-white/5 hover:border-gray-600 transition-all duration-300 reveal flex flex-col h-full shadow-lg hover:-translate-y-1">
              <p className="font-space font-bold text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 mb-3">Basic</p>
              <h3 className="font-space font-bold text-base md:text-lg uppercase tracking-tight mb-4 leading-tight text-white group-hover:text-brand-lime transition-colors">GET YOUR BRAND MOVING.</h3>
              <div className="mb-5">
                <span className="font-space font-bold text-3xl md:text-4xl tracking-tighter text-white">₹14,999</span><span className="text-gray-500 text-[10px] sm:text-xs font-medium font-inter">/mo</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-space font-bold uppercase tracking-widest text-brand-blue mb-6 leading-relaxed flex-grow">
                SOCIAL + CONTENT + ADS
              </div>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="mt-auto w-full text-center bg-white/5 border border-white/10 hover:bg-white hover:text-brand-dark text-white py-3 rounded-lg font-space font-bold uppercase text-[10px] md:text-xs tracking-wider transition-all inline-flex justify-center items-center gap-2 group/btn text-decoration-none"
              >
                EXPLORE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
              </a>
            </div>

            {/* 02 Intermediate */}
            <div className="group bg-brand-lime text-brand-dark p-6 md:p-8 rounded-3xl border border-brand-lime transition-all duration-300 reveal reveal-delay-1 flex flex-col h-full shadow-[0_10px_25px_rgba(212,255,0,0.15)] hover:shadow-[0_15px_35px_rgba(212,255,0,0.3)] relative z-10 hover:-translate-y-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-dark text-white px-3 py-1 rounded-full font-space font-bold text-[8px] sm:text-[9px] tracking-widest uppercase flex items-center gap-1 shadow-lg border border-brand-lime">
                <Star className="w-2.5 h-2.5 text-brand-lime fill-brand-lime" style={{ width: "10px", height: "10px" }} /> Popular
              </div>

              <p className="font-space font-bold text-[9px] sm:text-[10px] uppercase tracking-widest text-brand-dark/70 mb-3 mt-1">Intermediate</p>
              <h3 className="font-space font-bold text-base md:text-lg uppercase tracking-tight mb-4 leading-tight">TURN ATTENTION INTO BUSINESS.</h3>
              <div className="mb-5">
                <span className="font-space font-bold text-3xl md:text-4xl tracking-tighter">₹29,999</span><span className="text-brand-dark/60 text-[10px] sm:text-xs font-medium font-inter">/mo</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-space font-bold uppercase tracking-widest text-brand-blue mb-6 leading-relaxed flex-grow">
                SOCIAL + CONTENT + GOOGLE + META
              </div>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="mt-auto w-full text-center bg-brand-dark hover:bg-black text-white py-3 rounded-lg font-space font-bold uppercase text-[10px] md:text-xs tracking-wider transition-all inline-flex justify-center items-center gap-2 shadow-sm group/btn text-decoration-none"
              >
                EXPLORE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
              </a>
            </div>

            {/* 03 Advanced */}
            <div className="group bg-[#111111] p-6 md:p-8 rounded-3xl border border-white/5 hover:border-gray-600 transition-all duration-300 reveal reveal-delay-2 flex flex-col h-full shadow-lg hover:-translate-y-1">
              <p className="font-space font-bold text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 mb-3">Advanced</p>
              <h3 className="font-space font-bold text-base md:text-lg uppercase tracking-tight mb-4 leading-tight text-white group-hover:text-brand-coral transition-colors">MAKE GROWTH YOUR NORMAL.</h3>
              <div className="mb-5">
                <span className="font-space font-bold text-3xl md:text-4xl tracking-tighter text-white">₹44,999</span><span className="text-gray-500 text-[10px] sm:text-xs font-medium font-inter">/mo</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-space font-bold uppercase tracking-widest text-brand-coral mb-6 leading-relaxed flex-grow">
                FULL GROWTH SYSTEM
              </div>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="mt-auto w-full text-center bg-white/5 border border-white/10 hover:bg-white hover:text-brand-dark text-white py-3 rounded-lg font-space font-bold uppercase text-[10px] md:text-xs tracking-wider transition-all inline-flex justify-center items-center gap-2 group/btn text-decoration-none"
              >
                EXPLORE <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative z-20 py-16 md:py-24 bg-brand-lime text-brand-dark px-6 md:px-12 lg:px-16 w-full overflow-hidden border-t border-brand-dark">
        <svg className="absolute left-[-2%] top-[30%] w-40 h-40 text-brand-dark/5 hidden xl:block -rotate-45 pointer-events-none" style={{ width: "160px", height: "160px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
        </svg>

        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
          <div className="reveal flex flex-col items-start">
            <h2 className="font-space font-bold text-[40px] sm:text-[60px] md:text-[80px] xl:text-[90px] leading-[0.8] tracking-tighter uppercase lg:sticky lg:top-32">
              NO <br /> BORING <br /> MARKETING.
            </h2>
          </div>

          <div className="space-y-10 lg:space-y-12 mt-4 lg:mt-0 reveal reveal-delay-1">
            <div className="border-t border-brand-dark/20 pt-6 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
              <h3 className="font-space font-bold text-lg md:text-xl xl:text-2xl mb-2 tracking-tight uppercase group-hover:text-brand-blue transition-colors">NO RANDOM POSTING.</h3>
              <p className="text-sm md:text-base xl:text-lg font-medium opacity-80 leading-relaxed font-inter">Every single piece of content has a strategic reason for existing. Hope is not a strategy.</p>
            </div>

            <div className="border-t border-brand-dark/20 pt-6 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
              <h3 className="font-space font-bold text-lg md:text-xl xl:text-2xl mb-2 tracking-tight uppercase group-hover:text-brand-blue transition-colors">NO "BOOST BUTTON" STRATEGY.</h3>
              <p className="text-sm md:text-base xl:text-lg font-medium opacity-80 leading-relaxed font-inter">Paid media requires actual architecture. We build robust funnels, not quick fixes.</p>
            </div>

            <div className="border-t border-brand-dark/20 pt-6 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
              <h3 className="font-space font-bold text-lg md:text-xl xl:text-2xl mb-2 tracking-tight uppercase group-hover:text-brand-blue transition-colors">NO DESIGN FOR DESIGN'S SAKE.</h3>
              <p className="text-sm md:text-base xl:text-lg font-medium opacity-80 leading-relaxed font-inter">Pretty visuals are useless if they don't communicate. Creative must drive action.</p>
            </div>

            <div className="border-t border-brand-dark/20 pt-6 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
              <h3 className="font-space font-bold text-lg md:text-xl xl:text-2xl mb-2 tracking-tight uppercase group-hover:text-brand-blue transition-colors">NO VANITY METRICS.</h3>
              <p className="text-sm md:text-base xl:text-lg font-medium opacity-80 leading-relaxed mb-6 font-inter">Reach and likes are nice for the ego. Conversions and revenue are better for the business.</p>
            </div>

            <div className="pt-4">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="inline-flex bg-brand-dark text-white px-6 py-3.5 rounded-lg font-bold font-space uppercase text-xs tracking-wider hover:bg-white hover:text-brand-dark hover:shadow-lg transition-all items-center gap-2 group text-decoration-none"
              >
                Tired of boring? Let's talk <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative z-10 py-12 md:py-16 bg-white px-6 md:px-12 lg:px-16 w-full border-y border-gray-200">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start reveal">
          <div className="text-left lg:sticky lg:top-32">
            <h2 className="font-space font-bold text-xs tracking-widest uppercase text-brand-blue mb-4">Who's behind the feed</h2>
            <h3 className="font-space font-bold text-[32px] sm:text-[40px] md:text-[50px] tracking-tighter mb-6 leading-[0.9] uppercase text-brand-dark">
              WE ARE <br /> GETINTOFEED.
            </h3>
          </div>

          <div className="text-left text-sm md:text-base text-gray-600 space-y-4 md:space-y-5 leading-relaxed font-medium bg-brand-light-gray p-6 md:p-10 rounded-3xl border border-gray-100 transition-all duration-300 font-inter">
            <p className="text-base md:text-xl font-space font-bold text-brand-dark">
              We’re not a big agency. We’re a group of experienced marketing specialists working together.
            </p>
            <p>
              From content and social media to creative and paid advertising, we bring the right people together for the work your business actually needs.
            </p>
            <p>
              By keeping our own setup lean, we avoid many of the costs that come with a traditional agency — and that helps us keep our services more affordable.
            </p>
            <p className="font-bold text-brand-dark">
              We’re here to make good marketing accessible, practical and worth the money you spend on it.
            </p>

            <div className="pt-4">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="inline-flex bg-brand-dark text-white px-6 py-3 rounded-lg font-bold font-space uppercase text-xs tracking-wider hover:bg-brand-blue transition-all items-center gap-2 group mt-2 shadow-md text-decoration-none"
              >
                MEET THE TEAM <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" style={{ width: "12px", height: "12px" }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative z-20 px-6 md:px-12 lg:px-16 pt-10 pb-12 md:pb-16 bg-brand-light-gray w-full overflow-hidden">
        <div className="bg-brand-blue text-white rounded-[2rem] p-10 md:p-16 lg:p-20 text-center max-w-[1280px] mx-auto relative overflow-hidden reveal shadow-[0_15px_40px_-10px_rgba(0,51,255,0.2)] hover:shadow-[0_20px_50px_-10px_rgba(0,51,255,0.3)] transition-shadow duration-500">
          <svg className="absolute left-[5%] top-[20%] w-20 h-20 text-white/10 rotate-12 pointer-events-none" style={{ width: "80px", height: "80px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
          </svg>
          <div className="absolute -bottom-[20%] -right-[5%] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-space font-bold text-[36px] sm:text-[50px] md:text-[70px] lg:text-[80px] leading-[0.85] tracking-tighter uppercase mb-6">
              READY TO <br />
              GET INTO <br />
              <span className="text-brand-lime">THE FEED?</span>
            </h2>

            <p className="text-sm md:text-base lg:text-lg text-blue-100 font-medium mb-10 max-w-lg mx-auto font-inter">
              Tell us what you're building. We'll figure out how to get it noticed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => { setSelectedService("Main CTA Project"); setLeadModalOpen(true); }}
                className="bg-brand-lime text-brand-dark px-8 py-3.5 rounded-lg font-bold font-space uppercase tracking-widest text-xs hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(212,255,0,0.3)] transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center group/btn cursor-pointer border-none"
              >
                Start a project
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" style={{ width: "14px", height: "14px" }} />
              </button>
              <a
                href="mailto:hello@getintofeed.com"
                className="text-white hover:text-brand-lime font-space font-bold uppercase tracking-widest text-xs transition-colors link-underline text-decoration-none"
              >
                hello@getintofeed.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 bg-brand-dark pt-16 pb-8 px-6 md:px-12 lg:px-16 w-full text-white">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
          <div>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="font-space font-bold text-3xl tracking-tighter text-white hover:text-brand-lime transition-colors block mb-3 text-decoration-none">
              getintofeed.
            </a>
            <p className="text-xs text-gray-500 font-medium max-w-[250px] leading-relaxed font-inter">A vibrant growth studio that gets brands into the feed — and gets them results.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 w-full md:w-auto">
            <div className="flex flex-col gap-3 font-space font-bold text-[10px] uppercase tracking-widest text-white">
              <a href="/services/content-marketing" onClick={(e) => { e.preventDefault(); navigate("/services/content-marketing"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">Content</a>
              <a href="/services/ads-campaign" onClick={(e) => { e.preventDefault(); navigate("/services/ads-campaign"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">Paid Media</a>
              <a href="/services/social-media" onClick={(e) => { e.preventDefault(); navigate("/services/social-media"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">Social</a>
            </div>
            <div className="flex flex-col gap-3 font-space font-bold text-[10px] uppercase tracking-widest text-white">
              <a href="/services/graphics-design" onClick={(e) => { e.preventDefault(); navigate("/services/graphics-design"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">Creative</a>
              <a href="/services/growth" onClick={(e) => { e.preventDefault(); navigate("/services/growth"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">Web Dev</a>
              <a href="/services/strategy" onClick={(e) => { e.preventDefault(); navigate("/services/strategy"); }} className="hover:text-brand-lime transition-colors text-decoration-none text-white">SEO</a>
            </div>
            <div className="flex flex-col gap-3 font-space font-bold text-[10px] uppercase tracking-widest text-white col-span-2 sm:col-span-1">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-brand-lime transition-colors flex items-center gap-2 text-decoration-none text-white"><Instagram className="w-3 h-3 text-brand-lime" style={{ width: "12px", height: "12px" }} /> Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-brand-blue transition-colors flex items-center gap-2 text-decoration-none text-white"><Linkedin className="w-3 h-3 text-brand-blue" style={{ width: "12px", height: "12px" }} /> LinkedIn</a>
              <a href="mailto:hello@getintofeed.com" className="hover:text-brand-lime transition-colors flex items-center gap-2 text-decoration-none text-white"><Mail className="w-3 h-3 text-white" style={{ width: "12px", height: "12px" }} /> Email</a>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] sm:text-[10px] font-space font-bold tracking-widest uppercase text-gray-600">
          <p>© 2026 GetIntoFeed Growth Studio.</p>
          <div className="flex gap-6">
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }} className="hover:text-white transition-colors text-decoration-none text-gray-500">Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigate("/terms"); }} className="hover:text-white transition-colors text-decoration-none text-gray-500">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* LEAD INTAKE MODAL */}
      {leadModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={() => setLeadModalOpen(false)}
        >
          <div
            className="bg-[#09090B] border-2 border-[#D4FF00] rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(212,255,0,0.2)] text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLeadModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="font-space text-[10px] font-bold bg-[#D4FF00] text-[#09090B] px-2 py-0.5 rounded uppercase">GET INTO THE FEED</span>
              <h3 className="font-space text-2xl font-bold uppercase mt-2 text-white">Let's Scale Your Brand</h3>
              <p className="text-xs text-gray-400 mt-1 font-inter">Tell us what you're building. Our team responds within 2 hours.</p>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8">
                <Check className="w-12 h-12 text-[#D4FF00] mx-auto mb-3" />
                <h4 className="font-space text-xl font-bold text-white">Inquiry Received!</h4>
                <p className="text-sm text-gray-300 mt-1">We'll reach out on WhatsApp/Phone (+91-8810356950) shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ashish Raghav"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. ashish@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Phone / WhatsApp *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 8810356950"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">Website or Instagram</label>
                  <input
                    type="text"
                    placeholder="e.g. yourbrand.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-space text-[11px] font-bold uppercase mb-1 text-gray-300">What are your growth goals?</label>
                  <textarea
                    rows={2}
                    placeholder="Tell us what you want to achieve..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#18181B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4FF00] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#D4FF00] text-[#09090B] font-space font-bold uppercase text-xs tracking-wider py-3 rounded-lg hover:bg-white transition-colors mt-2 cursor-pointer border-none shadow-[0_0_20px_rgba(212,255,0,0.3)]"
                >
                  {submitting ? "Sending..." : "Submit Growth Inquiry →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp Quick Connect */}
      <WhatsAppWidget />
    </div>
  );
}
