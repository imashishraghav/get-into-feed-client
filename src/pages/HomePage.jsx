import React, { useState, useEffect, Suspense } from "react";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { PageHeader, PageFooter, CookieConsentBanner } from "../components/Layout.jsx";
import ToastContainer from "../components/Toast.jsx";
const UniversalLeadModal = React.lazy(() => import("../components/UniversalLeadModal").then(m => ({ default: m.UniversalLeadModal })));

function renderServiceSvg(slug = "", icon = "") {
  const s = (slug || icon || "").toLowerCase();
  if (s.includes("google")) {
    return (
      <svg aria-hidden="true" className="service-svg" focusable="false" viewBox="0 0 250 230" fill="none">
        <path fill="#4285F4" d="M85.9,28.6c2.4-6.3,5.7-12.1,10.6-16.8c19.6-19.1,52-14.3,65.3,9.7c10,18.2,20.6,36,30.9,54c17.2,29.9,34.6,59.8,51.6,89.8c14.3,25.1-1.2,56.8-29.6,61.1c-17.4,2.6-33.7-5.4-42.7-21c-15.1-26.3-30.3-52.6-45.4-78.8c-0.3-0.6-0.7-1.1-1.1-1.6c-1.6-1.3-2.3-3.2-3.3-4.9c-6.7-11.8-13.6-23.5-20.3-35.2c-4.3-7.6-8.8-15.1-13.1-22.7c-3.9-6.8-5.7-14.2-5.5-22C83.6,36.2,84.1,32.2,85.9,28.6"/>
        <path fill="#FBBC04" d="M85.9,28.6c-0.9,3.6-1.7,7.2-1.9,11c-0.3,8.4,1.8,16.2,6,23.5C101,82,112,101,122.9,120c1,1.7,1.8,3.4,2.8,5c-6,10.4-12,20.7-18.1,31.1c-8.4,14.5-16.8,29.1-25.3,43.6c-0.4,0-0.5-0.2-0.6-0.5c-0.1-0.8,0.2-1.5,0.4-2.3c4.1-15,0.7-28.3-9.6-39.7c-6.3-6.9-14.3-10.8-23.5-12.1c-12-1.7-22.6,1.4-32.1,8.9c-1.7,1.3-2.8,3.2-4.8,4.2c-0.4,0-0.6-0.2-0.7-0.5c4.8-8.3,9.5-16.6,14.3-24.9C45.5,98.4,65.3,64,85.2,29.7C85.4,29.3,85.7,29,85.9,28.6"/>
        <path fill="#34A853" d="M11.8,158c1.9-1.7,3.7-3.5,5.7-5.1c24.3-19.2,60.8-5.3,66.1,25.1c1.3,7.3,0.6,14.3-1.6,21.3c-0.1,0.6-0.2,1.1-0.4,1.7c-0.9,1.6-1.7,3.3-2.7,4.9c-8.9,14.7-22,22-39.2,20.9C20,225.4,4.5,210.6,1.8,191c-1.3-9.5,0.6-18.4,5.5-26.6c1-1.8,2.2-3.4,3.3-5.2C11.1,158.8,10.9,158,11.8,158"/>
      </svg>
    );
  }
  if (s.includes("meta") || s.includes("facebook")) {
    return (
      <svg aria-hidden="true" className="service-svg" focusable="false" viewBox="0 0 24 24" fill="#0081FB">
        <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"/>
      </svg>
    );
  }
  if (s.includes("seo")) {
    return (
      <svg aria-hidden="true" className="service-svg" focusable="false" viewBox="0 0 34 34">
        <circle cx="14" cy="14" fill="none" r="8" stroke="#3155F4" strokeWidth="3.5"></circle>
        <path d="m20 20 9 9" stroke="#3155F4" strokeLinecap="round" strokeWidth="4"></path>
        <path d="m10 16 3-4 3 2 3-4" fill="none" stroke="#67B84F" strokeLinejoin="round" strokeWidth="2.5"></path>
      </svg>
    );
  }
  if (s.includes("social")) {
    return (
      <svg aria-hidden="true" className="service-svg" focusable="false" viewBox="0 0 34 34">
        <rect fill="#EA4A84" height="26" rx="8" width="26" x="4" y="4"></rect>
        <rect fill="none" height="14" rx="4" stroke="white" strokeWidth="2.4" width="14" x="10" y="10"></rect>
        <circle cx="17" cy="17" fill="none" r="3.6" stroke="white" strokeWidth="2.2"></circle>
        <circle cx="25" cy="9" fill="white" r="1.6"></circle>
      </svg>
    );
  }
  if (s.includes("website") || s.includes("web") || s.includes("design")) {
    return (
      <svg aria-hidden="true" className="service-svg" focusable="false" viewBox="0 0 34 34">
        <rect fill="none" height="24" rx="4" stroke="#3155F4" strokeWidth="2.8" width="27" x="3.5" y="5"></rect>
        <path d="M5 12h24" stroke="#3155F4" strokeWidth="2.7"></path>
        <circle cx="9" cy="9" fill="#FF7768" r="1"></circle>
        <circle cx="13" cy="9" fill="#D4FF00" r="1"></circle>
        <path d="m13 17-4 3 4 3m8-6 4 3-4 3" fill="none" stroke="#3155F4" strokeLinecap="round" strokeWidth="2.1"></path>
      </svg>
    );
  }
  if (s.includes("content") || s.includes("creative")) {
    return (
      <svg aria-hidden="true" className="service-svg" focusable="false" viewBox="0 0 34 34">
        <path d="m17 2 2.5 9.5L29 14l-9.5 2.5L17 26l-2.5-9.5L5 14l9.5-2.5L17 2Z" fill="#F59A32"></path>
        <path d="m28 24 1.1 4 4 1.1-4 1.1-1.1 4-1.1-4-4-1.1 4-1.1Z" fill="#3155F4"></path>
      </svg>
    );
  }
  if (s.includes("reel") || s.includes("video")) {
    return (
      <svg aria-hidden="true" className="service-svg" focusable="false" viewBox="0 0 34 34">
        <rect fill="#A143E2" height="27" rx="6" width="25" x="5" y="4"></rect>
        <path d="m14 12 11 6-11 6z" fill="white"></path>
        <path d="M10 4 16 12M20 4l6 8" opacity=".6" stroke="white" strokeWidth="2"></path>
      </svg>
    );
  }
  if (s.includes("graphic")) {
    return (
      <svg aria-hidden="true" className="service-svg" focusable="false" viewBox="0 0 34 34">
        <path d="M7 28 4 17 21 3l10 10-17 17Z" fill="#F06555"></path>
        <path d="m11 23 13-13" stroke="white" strokeWidth="2.5"></path>
        <circle cx="26" cy="8" fill="#FBDC56" r="3"></circle>
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" className="service-svg" focusable="false" viewBox="0 0 34 34" fill="none" stroke="#2563EB" strokeWidth="2.5">
      <path d="M4 28L28 4M28 4H10M28 4V22" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const defaultHomepageServices = [
  { name: "Google Ads", slug: "google-ads-services-delhi-ncr", short_description: "Get found when buyers search." },
  { name: "Meta Ads", slug: "meta-ads-services-delhi-ncr", short_description: "Reach more of the right people." },
  { name: "SEO & Local Search", slug: "seo-services-delhi-ncr", short_description: "Help nearby customers find you." },
  { name: "Social Media", slug: "social-media-marketing-delhi-ncr", short_description: "Post with a clear purpose." },
  { name: "Website Design", slug: "website-design-delhi-ncr", short_description: "Make visits easier to convert." },
  { name: "Content & Creatives", slug: "content-creative-services-delhi-ncr", short_description: "Make your offer easy to understand." },
  { name: "Reels & Video Editing", slug: "reels-video-editing-delhi-ncr", short_description: "Show more in less time." },
  { name: "Graphic Design", slug: "graphic-design-services-delhi-ncr", short_description: "Look consistent and memorable." },
];


export function HomePage({ onNavigate, homeBlogPosts = [] }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("Full-Stack Digital Growth");
  const [services, setServices] = useState(() => {
    try {
      const raw = localStorage.getItem("gif_services_catalog");
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultHomepageServices;
  });

  useEffect(() => {
    fetch(`/api/services?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
          localStorage.setItem("gif_services_catalog", JSON.stringify(data.services));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((winScroll / height) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = onNavigate || ((to) => {
    window.history.pushState(null, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeServicesList = (Array.isArray(services) && services.length > 0) ? services : defaultHomepageServices;

  return (
    <ErrorBoundary>
      <div className="antialiased selection:bg-brand-lime selection:text-brand-dark bg-white font-inter relative min-h-screen text-gray-900">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-brand-lime z-[100] transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        id="scroll-progress"
      ></div>

      {/* Universal Branded Header (Exact Same Menu As Inner Pages) */}
      <PageHeader
        onNavigate={navigate}
        activeNav="home"
        onOpenLeadModal={() => { setSelectedService("Start a Project"); setLeadModalOpen(true); }}
      />

      <main id="main-content">
        {/* Hero Section (Studio V6 Exact Card Component) */}
        <div className="hero-shell w-full bg-white text-[#111714]">
          <div className="wrap">
            <section aria-labelledby="home-title" className="hero-v2">
              <div className="hero-content">
                <div className="hero-eyebrow">
                  <span className="eyebrow-icon"></span>
                  <span>DIGITAL MARKETING SERVICES IN DELHI NCR</span>
                </div>
                <h1 id="home-title">
                  Your business is online.<br />
                  <span className="accent">But is it getting noticed?</span>
                </h1>
                <p>
                  Digital marketing services in Delhi NCR for businesses ready to get noticed. We handle Google Ads, SEO, social media and web design without the big-agency overhead.
                </p>
                <div className="hero-buttons">
                  <button
                    type="button"
                    onClick={() => { setSelectedService("Full-Stack Digital Growth"); setLeadModalOpen(true); }}
                    className="hero-btn hero-btn-lime"
                  >
                    Get pricing for my business ↗
                  </button>
                  <a
                    href="#what-we-do"
                    onClick={(e) => { e.preventDefault(); scrollToSection("#what-we-do"); }}
                    className="hero-btn hero-btn-white"
                  >
                    See what we do
                  </a>
                </div>
              </div>

              <div aria-hidden="true" className="hero-visual">
                <div className="visual-glow"></div>
                <div className="floating-bubble">
                  <span className="bubble-star">✳</span> BE SEEN ONLINE
                </div>
                <div className="online-window">
                  <div className="window-top">
                    <span className="bubble"></span>
                    <span className="bubble"></span>
                    <span className="bubble"></span>
                    <strong>Search visibility · Demo</strong>
                  </div>
                  <div className="window-search">
                    <span>business near me</span>
                    <span className="window-search-icon">⌕</span>
                  </div>
                  <div className="window-result">
                    <small>Example search result</small>
                    <b>Your business could be here ↗</b>
                    <p>Better visibility begins with a clear strategy, not lucky guesses.</p>
                  </div>
                </div>
                <div className="floating-mini">
                  <span className="bubble-star">✳</span> Make every click count.
                </div>
              </div>
            </section>

            <div className="mini-categories">
              <span className="label">What can we help with?</span>
              <a
                href="/services/google-ads-services-delhi-ncr"
                onClick={(e) => { e.preventDefault(); navigate("/services/google-ads-services-delhi-ncr"); }}
              >
                Google Ads ↗
              </a>
              <a
                href="/services/seo-services-delhi-ncr"
                onClick={(e) => { e.preventDefault(); navigate("/services/seo-services-delhi-ncr"); }}
              >
                SEO ↗
              </a>
              <a
                href="/services/meta-ads-services-delhi-ncr"
                onClick={(e) => { e.preventDefault(); navigate("/services/meta-ads-services-delhi-ncr"); }}
              >
                Meta Ads ↗
              </a>
              <a
                href="/services/website-design-delhi-ncr"
                onClick={(e) => { e.preventDefault(); navigate("/services/website-design-delhi-ncr"); }}
              >
                Websites ↗
              </a>
              <a
                href="/services/reels-video-editing-delhi-ncr"
                onClick={(e) => { e.preventDefault(); navigate("/services/reels-video-editing-delhi-ncr"); }}
              >
                Reels ↗
              </a>
            </div>
          </div>
        </div>

      {/* Sound Familiar? Problem Tiles Section (Studio V6 Exact Match) */}
      <section className="problem-tiles-section relative z-20">
        <div className="wrap">
          <div className="section-title-row">
            <div>
              <div className="eyebrow-caps">SOUND FAMILIAR?</div>
              <h2>
                Good business. <span className="spot">Not enough attention.</span>
              </h2>
              <p>
                Customers make decisions online every day. Here’s what we can fix before more opportunities slip past.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedService("Tell us your biggest problem"); setLeadModalOpen(true); }}
              className="bluelink"
            >
              Tell us your biggest problem ↗
            </button>
          </div>

          <div className="problem-tiles">
            {/* Tile 1 */}
            <article className="problem-tile">
              <div aria-hidden="true" className="sym">↗</div>
              <div className="pain">You’re not appearing on Google?</div>
              <h3>Let customers find you.</h3>
              <p>Google Ads and SEO put the right offer in front of the right searches.</p>
              <a
                href="/services/google-ads-services-delhi-ncr"
                onClick={(e) => { e.preventDefault(); navigate("/services/google-ads-services-delhi-ncr"); }}
                className="text-link"
              >
                Check search visibility ↗
              </a>
            </article>

            {/* Tile 2 */}
            <article className="problem-tile">
              <div aria-hidden="true" className="sym">◉</div>
              <div className="pain">Posting every day, but no response?</div>
              <h3>Give people a reason to stop.</h3>
              <p>Sharper creatives, social content and a message people understand.</p>
              <a
                href="/services/meta-ads-services-delhi-ncr"
                onClick={(e) => { e.preventDefault(); navigate("/services/meta-ads-services-delhi-ncr"); }}
                className="text-link"
              >
                Fix your social content ↗
              </a>
            </article>

            {/* Tile 3 */}
            <article className="problem-tile">
              <div aria-hidden="true" className="sym">✳</div>
              <div className="pain">People visit but don’t enquire?</div>
              <h3>Turn interest into action.</h3>
              <p>Clear landing pages, strong offers and an obvious way to contact you.</p>
              <a
                href="/services/website-design-delhi-ncr"
                onClick={(e) => { e.preventDefault(); navigate("/services/website-design-delhi-ncr"); }}
                className="text-link"
              >
                Improve your website ↗
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* Services Section (Studio V6 Exact Match) */}
      <section className="section services-section relative z-20" id="what-we-do">
        <div id="services" className="sr-only"></div>
        <div className="wrap">
          <div className="section-title-row">
            <div>
              <div className="eyebrow-caps">YOUR ONLINE PRESENCE, SORTED.</div>
              <h2>
                Everything you need.<br /><span className="spot">Nothing you don’t.</span>
              </h2>
              <p>Choose one service or build a small, sensible mix. No compulsory all-in-one package.</p>
            </div>
            <a
              href="/services"
              onClick={(e) => { e.preventDefault(); navigate("/services"); }}
              className="bluelink"
            >
              See all service details ↗
            </a>
          </div>

          <div className="grid grid-4">
            {(services && services.length > 0 ? services.slice(0, 8) : []).map((s, idx) => (
              <article
                key={s.slug || idx}
                className="service-tile cursor-pointer"
                onClick={() => {
                  navigate(`/services/${s.slug}`);
                }}
              >
                <span className="corner-arrow">↗</span>
                <div aria-hidden="true" className="sicon">
                  {renderServiceSvg(s.slug, s.icon)}
                </div>
                <h3>{s.name || s.title}</h3>
                <p>{s.short_description || s.shortDesc || "Get found when buyers search."}</p>
                <span className="stlink">See how we help ↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE WORK WITH Section */}
      <section className="section who-we-work-section relative z-20">
        <div className="wrap">
          <div className="who-head">
            <div className="who-title-block">
              <div className="eyebrow-caps">WHO WE WORK WITH</div>
              <h2>
                Built for Indian businesses <span className="spot">that rely on daily</span><br />
                <span className="spot">enquiries.</span>
              </h2>
            </div>
            <p className="who-sub">
              Whether you run a local clinic, a service business, or a growing brand, we tailor campaigns around how your specific customers buy.
            </p>
          </div>

          <div className="who-grid">
            {/* 1: Clinics & Healthcare */}
            <div className="who-card">
              <div className="who-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 3v5a3.5 3.5 0 0 0 7 0V3"/>
                  <path d="M8 11.5v3.5a4.5 4.5 0 0 0 9 0v-2"/>
                  <circle cx="17" cy="11" r="2.5"/>
                  <circle cx="4.5" cy="3" r="1.2" fill="#2563EB"/>
                  <circle cx="11.5" cy="3" r="1.2" fill="#2563EB"/>
                </svg>
              </div>
              <h3>Clinics &amp; Healthcare</h3>
              <p>Patient appointments via Google Search &amp; Maps</p>
            </div>

            {/* 2: Real Estate & Interiors */}
            <div className="who-card">
              <div className="who-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="3" width="16" height="18" rx="3"/>
                  <path d="M9 21v-4a3 3 0 0 1 6 0v4"/>
                  <path d="M8 8h2M14 8h2M8 12h2M14 12h2"/>
                </svg>
              </div>
              <h3>Real Estate &amp; Interiors</h3>
              <p>High-intent site visits &amp; consultation leads</p>
            </div>

            {/* 3: Coaching & Institutes */}
            <div className="who-card">
              <div className="who-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12.5v4.5c3 2.5 9 2.5 12 0v-4.5"/>
                </svg>
              </div>
              <h3>Coaching &amp; Institutes</h3>
              <p>Student admissions &amp; counseling calls</p>
            </div>

            {/* 4: E-Commerce & D2C (Highlighted) */}
            <div className="who-card highlighted">
              <div className="who-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="7" width="16" height="14" rx="3"/>
                  <path d="M8 7V5a4 4 0 0 1 8 0v2"/>
                  <path d="M9.5 12a2.5 2.5 0 0 0 5 0"/>
                </svg>
              </div>
              <h3>E-Commerce &amp; D2C</h3>
              <p>ROAS-focused Meta &amp; Google Shopping ads</p>
            </div>

            {/* 5: Salons, Gyms & Cafes */}
            <div className="who-card">
              <div className="who-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2v20"/>
                  <path d="M21 2c0 4-3 6-3 6"/>
                  <path d="M3 2v6a3 3 0 0 0 6 0V2"/>
                  <path d="M6 8v14"/>
                  <path d="M6 2v4"/>
                </svg>
              </div>
              <h3>Salons, Gyms &amp;<br />Cafes</h3>
              <p>Local walk-ins, Reels &amp; neighbourhood buzz</p>
            </div>

            {/* 6: B2B & Local Services */}
            <div className="who-card">
              <div className="who-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="18" height="14" rx="3"/>
                  <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                  <path d="M8 7v14M16 7v14"/>
                </svg>
              </div>
              <h3>B2B &amp; Local Services</h3>
              <p>Steady quote requests &amp; phone enquiries</p>
            </div>
          </div>
        </div>
      </section>

      {/* How Online Growth Connects Section (Studio V6 Exact Match) */}
      <section className="section growth-section relative z-20">
        <div className="wrap">
          <div className="web-presence">
            <div className="copy">
              <div className="eyebrow">
                HOW ONLINE GROWTH CONNECTS
              </div>
              <h2>
                Get seen. Get clicked.<br />Give them a reason to enquire.
              </h2>
              <p>
                An ad alone won’t fix a confusing website. A pretty website alone won’t bring traffic. We connect visibility, content and the next step.
              </p>
              <a
                href="/services"
                onClick={(e) => { e.preventDefault(); navigate("/services"); }}
                className="button-lime"
              >
                Find the right service ↗
              </a>
            </div>
            <div aria-hidden="true" className="illustration">
              <div className="journey-card">
                <div className="journey-line">
                  <span className="journey-dot">1</span>
                  <strong>Show up</strong>
                  <small>Google · Social</small>
                </div>
                <div className="journey-line">
                  <span className="journey-dot">2</span>
                  <strong>Earn the click</strong>
                  <small>Ads · Creatives</small>
                </div>
                <div className="journey-line">
                  <span className="journey-dot">3</span>
                  <strong>Make it easy to enquire</strong>
                  <small>Website · Contact</small>
                </div>
                <div className="journey-meter">
                  <i></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Starter Pricing Splash Banner (Studio V6 Exact Match) */}
      <section className="section compact pricing-splash-section relative z-20 py-8 md:py-12 bg-white">
        <div className="wrap max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="pricing-splash">
            <div className="price-side">
              <div className="eyebrow-caps">A SMALLER WAY TO START</div>
              <div className="amount">
                ₹10,500<small> onwards*</small>
              </div>
              <p className="price-note">
                Illustrative starting service fee. Final scope varies.<br />
                Ad platform budgets and third-party charges are extra.
              </p>
            </div>
            <div className="offer-copy">
              <h2>You don’t need a huge budget to start showing up.</h2>
              <p>
                Start with one priority. Tell us your goals and get a quote that fits the actual work—not a generic package designed for everyone.
              </p>
              <div className="pricing-splash-actions">
                <a
                  href="#pricing-plans"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('pricing-plans');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigate("/pricing");
                  }}
                  className="button button-dark"
                >
                  See starting prices ↗
                </a>
                <button
                  type="button"
                  onClick={() => { setSelectedService("Starter Package (from ₹10,500)"); setLeadModalOpen(true); }}
                  className="button button-light"
                >
                  Get my exact quote ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Tier Pricing Plans Section (Studio V6 Exact Match) */}
      <section id="pricing-plans" className="section compact price-options-section relative z-20 py-4 md:py-8 bg-white">
        <div className="wrap max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="price-options">
            {/* Card 1: Starter support */}
            <article className="price-option featured">
              <div className="price-kicker">START HERE</div>
              <h3>Starter support</h3>
              <div className="price-val">
                ₹10,500 <small>onwards*</small>
              </div>
              <p>For one small, clearly defined marketing priority.</p>
              <ul>
                <li>Pick your key goal</li>
                <li>Agree on deliverables first</li>
                <li>Small-scope monthly or project option, subject to quote</li>
                <li>No need to buy every service</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedService("Starter support (from ₹10,500)"); setLeadModalOpen(true); }}
                className="button button-blue"
              >
                Get starter pricing ↗
              </button>
            </article>

            {/* Card 2: Growth support */}
            <article className="price-option">
              <div className="price-kicker">FOR ACTIVE CAMPAIGNS</div>
              <h3>Growth support</h3>
              <div className="price-val custom-val">
                Custom <small>quote</small>
              </div>
              <p>For businesses needing ongoing help across ads, search or social.</p>
              <ul>
                <li>Google or Meta Ads planning</li>
                <li>SEO or content tasks</li>
                <li>Reviews, changes and reporting</li>
                <li>Fee based on workload</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedService("Growth support (Custom quote)"); setLeadModalOpen(true); }}
                className="button button-outline"
              >
                Build my plan ↗
              </button>
            </article>

            {/* Card 3: Project-based */}
            <article className="price-option">
              <div className="price-kicker">ONE-TIME WORK</div>
              <h3>Project-based</h3>
              <div className="price-val custom-val">
                Custom <small>quote</small>
              </div>
              <p>For a defined website, landing page, creative batch or video edit.</p>
              <ul>
                <li>Agree on scope &amp; timeline</li>
                <li>Website or landing page design</li>
                <li>Graphic design or reel editing</li>
                <li>Simple handover</li>
              </ul>
              <button
                type="button"
                onClick={() => { setSelectedService("Project-based (Custom quote)"); setLeadModalOpen(true); }}
                className="button button-outline"
              >
                Price my project ↗
              </button>
            </article>
          </div>
          <p className="tiny-disclaimer">
            * ₹10,500 is a proposed starting service fee for limited scope, not a fixed price for every service or guaranteed result. Billing period, exact work and applicable taxes are confirmed in your quote. Advertising budgets, domain, hosting, production expenses and external subscriptions are separate unless agreed.
          </p>
        </div>
      </section>

            {/* Simple From Day One / Pricing Steps Section (Studio V6 Exact Match) */}
      <section className="section pricing-steps-section relative z-20 py-8 md:py-14 bg-white border-b border-gray-100">
        <div className="wrap max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="pricing-steps-header">
            <div className="eyebrow-caps">SIMPLE FROM DAY ONE</div>
            <h2>Less pitch. More clarity.</h2>
            <p>You’ll know what needs doing, what it may cost and what happens next.</p>
          </div>
          <div className="pricing-steps">
            <article className="pricing-step">
              <span className="num">01</span>
              <h3>Tell us your goal</h3>
              <p>More calls? Better visibility? A website that finally looks good? Start with the one thing that matters.</p>
            </article>
            <article className="pricing-step">
              <span className="num">02</span>
              <h3>Get your plan &amp; price</h3>
              <p>We discuss deliverables, realistic scope, service fees and any separate platform costs.</p>
            </article>
            <article className="pricing-step">
              <span className="num">03</span>
              <h3>Decide before you commit</h3>
              <p>No exaggerated promises. You choose what to do next, and you keep ownership of your accounts.</p>
            </article>
          </div>
        </div>
      </section>

      {/* From The Blog / Quick Guides (Dynamic Real-Time Blog Feed with Photos) */}
      {homeBlogPosts && homeBlogPosts.length > 0 && (
        <section className="section alt py-10 md:py-16 bg-[#fcfdfa] border-b border-gray-100">
          <div className="wrap max-w-[1180px] mx-auto px-4 sm:px-6">
            <div className="section-title-row flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="eyebrow-caps text-brand-blue font-bold tracking-widest text-xs uppercase mb-2">FROM THE BLOG</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Before you spend more, <span className="spot">read this.</span>
                </h2>
                <p className="text-gray-600 text-sm md:text-base mt-2">Quick, useful advice on where marketing money gets wasted and what to fix first.</p>
              </div>
              <a
                href="/blog"
                onClick={(e) => { e.preventDefault(); navigate("/blog"); }}
                className="inline-flex items-center gap-1 font-bold text-sm text-[#3155f4] hover:underline"
              >
                All articles ↗
              </a>
            </div>

            <div className={`grid grid-cols-1 ${homeBlogPosts.length === 1 ? "max-w-xl" : homeBlogPosts.length === 2 ? "md:grid-cols-2 max-w-4xl" : "md:grid-cols-3"} gap-6`}>
              {homeBlogPosts.map((post, idx) => (
                <article
                  key={post.slug || post.id || idx}
                  className="blog-card group cursor-pointer"
                  onClick={() => navigate("/blog/" + post.slug)}
                >
                  <div className="blog-card-media relative h-48 sm:h-52 w-full overflow-hidden bg-[#09090b] flex items-center justify-center">
                    <img
                      src={post.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=75"}
                      alt={post.title}
                      className="w-full h-full object-contain bg-[#09090b] transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="315"
                    />
                    <span className="blog-card-badge" aria-hidden="true">↗</span>
                    {post.category && (
                      <span className="blog-card-category-tag">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <div className="blog-info flex flex-col flex-1 p-5 sm:p-6">
                    <p className="blog-meta font-space text-[11px] font-bold tracking-wider text-[#3155f4] uppercase mb-2">
                      {post.category ? post.category + " · QUICK GUIDE" : "GROWTH INSIGHT"}
                      {post.readTime ? " · " + post.readTime : ""}
                    </p>
                    <h3 className="font-space font-bold text-base sm:text-lg text-gray-950 mb-2 leading-snug group-hover:text-[#3155f4] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <span className="text-link font-space font-bold text-xs sm:text-sm text-[#3155f4] inline-flex items-center gap-1 mt-auto">
                      Read guide ↗
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      

      {/* FAQ Accordion (Studio V6 Exact Match) */}
      <section className="section compact py-12 md:py-20 bg-white border-t border-gray-100">
        <div className="wrap max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="section-header text-left mb-8">
            <div className="eyebrow-badge">YOUR QUESTIONS, ANSWERED</div>
            <h2 className="font-space font-extrabold text-3xl sm:text-4xl md:text-5xl text-gray-950 tracking-tight mt-2">
              Know before you spend.
            </h2>
          </div>
          <div className="faq-list w-full">
            <details>
              <summary>What does the ₹10,500 starting price include?</summary>
              <p>It is an indicative starting service fee for a small, clearly defined scope. The exact deliverables and billing period are confirmed in your personal quote. Ad spend, software, hosting and other third-party charges are separate unless agreed.</p>
            </details>
            <details>
              <summary>Can I choose just one service?</summary>
              <p>Absolutely. Start with Google Ads, SEO, your website or content—whichever problem matters most.</p>
            </details>
            <details>
              <summary>Will you guarantee sales, leads or Google rankings?</summary>
              <p>No. We focus on clear work, sensible testing and transparent reviews. Results depend on your offer, market, budget and many other factors.</p>
            </details>
            <details>
              <summary>Who actually works on my project?</summary>
              <p>GetIntoFeed operates as a dedicated team of senior growth marketers, designers, and developers. Every project is handled directly by experienced specialists with clear milestones and direct communication.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Honest Strip CTA (Studio V6 Exact Match) */}
      <section className="section compact py-8 md:py-12 bg-white">
        <div className="wrap max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="honest-strip">
            <div>
              <h2>Your next customer might be searching right now.</h2>
              <p>Help them find a clear, confident business online. Tell us what you need and get a realistic starting plan.</p>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedService("Customised Pricing Plan"); setLeadModalOpen(true); }}
              className="button-lime cursor-pointer border-none"
            >
              Get my customised pricing ↗
            </button>
          </div>
        </div>
      </section>

    </main>

      {/* Footer (Synchronized With All Pages) */}
      <PageFooter onNavigate={navigate} />

      {/* Global Cookie & Privacy Preferences Banner on Homepage */}
      <CookieConsentBanner onNavigate={navigate} />

      {/* UNIVERSAL SINGLE BRANDED LEAD MODAL (LAZY LOADED ON DEMAND) */}
      {leadModalOpen && (
        <Suspense fallback={null}>
          <UniversalLeadModal
            isOpen={leadModalOpen}
            onClose={() => setLeadModalOpen(false)}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        </Suspense>
      )}

      {/* Global Interactive Toast Notification System */}
      <ToastContainer />
    </div>
  </ErrorBoundary>
  );
}

export default HomePage;
