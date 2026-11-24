import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ChevronDown,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Shield,
  Twitter,
  X,
  Zap
} from "lucide-react";
import { getStoredServices } from "../data/catalog.js";
import { trackPhoneClick, trackCtaClick } from "../utils/analytics.js";

// =========================================================================
// PUBLIC SETTINGS REACTIVE HOOK
// =========================================================================
export function usePublicSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("gif_public_settings");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem("gif_public_settings");
        if (stored) setSettings(JSON.parse(stored));
      } catch {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return settings;
}

// =========================================================================
// UNIVERSAL BRANDED PAGE HEADER (UNIFIED HOMEPAGE + INNER PAGES)
// =========================================================================
export function PageHeader({ onNavigate, activeNav = "", onOpenLeadModal, onOpenAuditPopup }) {
  const settings = usePublicSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const announcementEnabled = settings.announcement_enabled !== false;
  const announcementText = settings.announcement_text || "GET SEEN ONLINE \u00A0✳\u00A0 Google Ads · SEO · Websites · Social";
  const announcementLink = settings.announcement_link || "/pricing";
  const announcementLinkLabel = settings.announcement_link_label || "Starter support from ₹10,500* →";
  const logoText = settings.logo_text || "GETINTOFEED";
  const phone = settings.phone || "+91 88103 56950";
  const ctaLabel = settings.header_cta_label || "Get my pricing ↗";
  const ctaUrl = settings.header_cta_url || "/pricing";
  const navItems = Array.isArray(settings.navigation_items) && settings.navigation_items.length > 0
    ? settings.navigation_items
    : [
        { label: "Services", url: "/services" },
        { label: "Pricing", url: "/pricing" },
        { label: "About us", url: "/about" },
        { label: "Blog", url: "/blog" },
        { label: "Contact us", url: "/contact", is_highlight: true },
      ];

  return (
    <>
      {/* Top Announcement Bar (Exact match to reference) */}
      {announcementEnabled && (
        <div className="bg-[#d4ff00] text-[#111714] text-[11px] sm:text-xs py-2 px-4 sm:px-8 border-b border-black/5 z-50 relative w-full font-bold">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
            <span className="font-bold tracking-tight">
              {announcementText}
            </span>
            <a
              href={announcementLink}
              onClick={(e) => { e.preventDefault(); onNavigate(announcementLink); }}
              className="text-[#111714] font-bold hover:underline hidden sm:inline-block text-decoration-none"
            >
              {announcementLinkLabel}
            </a>
          </div>
        </div>
      )}

      {/* Main Navigation Bar (Clean White Background) */}
      {/* Main Navigation Bar (Clean White Background) */}
      <header
        className="sticky top-0 z-40 border-b border-gray-200 transition-all"
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between">
          {/* Brand Logo with Tilted Badged G and Blue Dot */}
          <button
            type="button"
            onClick={() => onNavigate("/")}
            className="flex items-center gap-2 text-left bg-transparent border-none cursor-pointer p-0 group"
            aria-label="GetIntoFeed homepage"
          >
            <span
              className="w-9 h-9 rounded-[11px] font-black font-space flex items-center justify-center text-xl shrink-0 transition-transform group-hover:rotate-0"
              style={{
                backgroundColor: "#121820",
                color: "#d4ff00",
                boxShadow: "3px 3px 0 #d4ff00",
                transform: "rotate(-8deg)"
              }}
            >
              G
            </span>
            <span
              className="font-space font-extrabold text-xl md:text-2xl tracking-tighter uppercase"
              style={{ color: "#111714" }}
            >
              {logoText}
            </span>
            <span style={{ color: "#3155f4", fontSize: "24px", fontWeight: 900, marginLeft: "-4px" }} aria-hidden="true">.</span>
          </button>

          {/* Desktop Nav Items (Driven by CMS Navigation Manager) */}
          <nav
            className="hidden lg:flex items-center gap-7 ml-auto mr-6"
            style={{ marginLeft: "auto", marginRight: "24px", gap: "28px" }}
            aria-label="Main Navigation"
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                onClick={(e) => { e.preventDefault(); onNavigate(item.url); }}
                className={`font-sans font-bold text-[13.5px] text-[#1f2937] hover:text-[#3155f4] transition-colors cursor-pointer bg-transparent border-none py-1 text-decoration-none relative ${
                  item.is_highlight
                    ? "after:content-[''] after:absolute after:-bottom-[6px] after:left-0 after:right-0 after:h-[3.5px] after:bg-[#d4ff00] after:rounded-full"
                    : ""
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              onClick={() => trackPhoneClick(phone, 'header_desktop')}
              className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-xl font-sans font-bold text-[13px] text-slate-700 hover:text-slate-950 border border-slate-200 hover:bg-slate-50 transition-all text-decoration-none"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span>{phone}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                trackCtaClick(ctaLabel, 'header_cta', ctaUrl);
                if (onOpenLeadModal) onOpenLeadModal();
                else onNavigate(ctaUrl);
              }}
              className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 rounded-xl text-white border-none font-sans font-extrabold text-[13px] leading-none whitespace-nowrap shadow-[0_3px_10px_rgba(49,85,244,0.28)] transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{
                backgroundColor: "#3155f4"
              }}
            >
              {ctaLabel}
            </button>
          </div>

          {/* Mobile Actions: Hamburger Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111714] hover:text-[#3155f4] bg-transparent border-none cursor-pointer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#111714]" aria-hidden="true" /> : <Menu className="w-6 h-6 text-[#111714]" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-b-2 border-gray-200 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200"
            style={{ backgroundColor: "#ffffff" }}
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate(item.url); }}
                className="block w-full text-left font-sans font-bold text-sm py-2 text-gray-800 hover:text-brand-blue border-b border-gray-100 bg-transparent text-decoration-none"
              >
                {item.label}
              </a>
            ))}

            <div className="pt-3 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  trackCtaClick(ctaLabel, 'mobile_menu_cta', ctaUrl);
                  if (onOpenLeadModal) onOpenLeadModal();
                  else onNavigate(ctaUrl);
                }}
                className="w-full py-3 rounded-xl bg-[#3155f4] text-white font-sans font-extrabold text-[13.5px] border-none cursor-pointer shadow-[0_3px_10px_rgba(49,85,244,0.28)]"
              >
                {ctaLabel}
              </button>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                onClick={() => trackPhoneClick(phone, 'header_mobile')}
                aria-label={`Call GetIntoFeed directly at ${phone}`}
                className="text-gray-600 text-xs font-sans font-semibold py-2 flex items-center justify-center gap-2 text-decoration-none hover:text-brand-dark"
              >
                <Phone className="w-3.5 h-3.5 text-brand-blue" aria-hidden="true" /> Call {phone}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

// =========================================================================
// UNIVERSAL BRANDED PAGE FOOTER (100% FIDELITY TO USER'S REFERENCE DESIGN)
// =========================================================================
export function PageFooter({ onNavigate }) {
  const settings = usePublicSettings();
  const logoText = settings.logo_text || "GETINTOFEED";
  const footerDesc = settings.footer_description || "Google Ads, SEO, websites and creative work for businesses ready to build a stronger online presence.";
  const footerSubtext = settings.footer_subtext || "A dedicated performance marketing and creative studio partnering with ambitious brands across Delhi NCR and beyond.";
  const starterPricing = settings.starter_pricing || "₹10,500*";
  const copyrightText = settings.copyright_text || "© 2026 GetIntoFeed Creative Studio. All rights reserved.";
  const footerBottomNote = settings.footer_bottom_note || "Performance Marketing & Web Engineering · Full Account Ownership · Delhi NCR & Worldwide";
  const email = settings.email || "hello@getintofeed.com";
  const phone = settings.phone || "+91 88103 56950";
  const footerColumns = Array.isArray(settings.footer_columns) && settings.footer_columns.length > 0 ? settings.footer_columns : null;

  return (
    <footer className="footer bg-[#10151c] text-white pt-12 pb-8 border-t border-[#323944] w-full relative z-20">
      <div className="wrap max-w-[1180px] mx-auto px-4 sm:px-6">
        <div className="footer-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-left">
          {/* Col 1: Brand & Identity */}
          <div>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); onNavigate("/"); }}
              className="logo text-xl font-bold font-space text-white inline-flex items-center gap-2 mb-3 text-decoration-none"
            >
              <span aria-hidden="true" className="logo-mark inline-flex items-center justify-center w-7 h-7 bg-[#d4ff00] text-[#111714] font-black rounded-lg text-sm">G</span>
              {logoText}<span className="text-[#3155f4]">.</span>
            </a>
            <p className="text-[#bbc7c9] text-xs leading-relaxed max-w-[280px] mb-3">
              {footerDesc}
            </p>
            <p className="text-[#bbc7c9] text-xs leading-relaxed mb-4">
              {footerSubtext}
            </p>
            <a
              href="/pricing"
              onClick={(e) => { e.preventDefault(); onNavigate("/pricing"); }}
              className="foot-price inline-block font-space text-xs font-bold text-[#d4ff00] hover:underline"
            >
              Starter pricing from {starterPricing} ↗
            </a>
          </div>

          {/* Cols 2-4: Driven by CMS Settings */}
          {footerColumns ? (
            footerColumns.map((col, idx) => (
              <div key={idx}>
                <h4 className="text-white font-space font-bold text-sm uppercase tracking-wider mb-4">{col.title}</h4>
                <nav aria-label={col.title} className="flex flex-col gap-2.5 text-xs">
                  {col.links?.map((lnk, lIdx) => (
                    <a
                      key={lIdx}
                      href={lnk.url}
                      onClick={(e) => {
                        if (!lnk.url.startsWith("http") && !lnk.url.startsWith("mailto:") && !lnk.url.startsWith("tel:")) {
                          e.preventDefault();
                          onNavigate(lnk.url);
                        }
                      }}
                      className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors"
                    >
                      {lnk.label}
                    </a>
                  ))}
                </nav>
              </div>
            ))
          ) : (
            <>
              {/* Col 2 */}
              <div>
                <h4 className="text-white font-space font-bold text-sm uppercase tracking-wider mb-4">Find your way</h4>
                <nav aria-label="Footer navigation" className="flex flex-col gap-2.5 text-xs">
                  <a href="/" onClick={(e) => { e.preventDefault(); onNavigate("/"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Home</a>
                  <a href="/services" onClick={(e) => { e.preventDefault(); onNavigate("/services"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Services</a>
                  <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate("/about"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">About us</a>
                  <a href="/blog" onClick={(e) => { e.preventDefault(); onNavigate("/blog"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Blog</a>
                  <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Contact us</a>
                  <a href="/pricing" onClick={(e) => { e.preventDefault(); onNavigate("/pricing"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Pricing</a>
                </nav>
              </div>

              {/* Col 3 */}
              <div>
                <h4 className="text-white font-space font-bold text-sm uppercase tracking-wider mb-4">Popular services</h4>
                <nav aria-label="Footer services" className="flex flex-col gap-2.5 text-xs">
                  <a href="/services/google-ads-services-delhi-ncr" onClick={(e) => { e.preventDefault(); onNavigate("/services/google-ads-services-delhi-ncr"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Google Ads</a>
                  <a href="/services/meta-ads-services-delhi-ncr" onClick={(e) => { e.preventDefault(); onNavigate("/services/meta-ads-services-delhi-ncr"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Meta Ads</a>
                  <a href="/services/seo-services-delhi-ncr" onClick={(e) => { e.preventDefault(); onNavigate("/services/seo-services-delhi-ncr"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">SEO & Local Search</a>
                  <a href="/services/website-design-delhi-ncr" onClick={(e) => { e.preventDefault(); onNavigate("/services/website-design-delhi-ncr"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Website Design</a>
                  <a href="/services" onClick={(e) => { e.preventDefault(); onNavigate("/services"); }} className="text-[#d4ff00] font-bold hover:underline transition-colors">All 8 Services Hub →</a>
                </nav>
              </div>

              {/* Col 4: Contact & Legal Compliance */}
              <div>
                <h4 className="text-white font-space font-bold text-sm uppercase tracking-wider mb-4">Legal & Contact</h4>
                <nav aria-label="Legal and contact navigation" className="flex flex-col gap-2.5 text-xs">
                  <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate("/about"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">About Us</a>
                  <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Contact Us</a>
                  <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate("/terms"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Terms of Service</a>
                  <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate("/privacy"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Privacy Policy</a>
                  <a href="/cookie-policy" onClick={(e) => { e.preventDefault(); onNavigate("/cookie-policy"); }} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">Cookie Policy</a>
                  <a href={`mailto:${email}`} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors mt-1">{email}</a>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} onClick={() => trackPhoneClick(phone, 'footer')} className="text-[#bbc7c9] hover:text-[#d4ff00] transition-colors">{phone}</a>
                </nav>
              </div>
            </>
          )}
        </div>

        <div className="footer-bottom border-t border-[#323944] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#9cafa2]">
          <span>{copyrightText}</span>
          <nav aria-label="Legal navigation links" className="flex flex-wrap items-center gap-3">
            <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate("/about"); }} className="hover:text-[#d4ff00] transition-colors">About Us</a>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate("/contact"); }} className="hover:text-[#d4ff00] transition-colors">Contact</a>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate("/terms"); }} className="hover:text-[#d4ff00] transition-colors font-semibold text-white">Terms of Service</a>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate("/privacy"); }} className="hover:text-[#d4ff00] transition-colors">Privacy Policy</a>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <a href="/cookie-policy" onClick={(e) => { e.preventDefault(); onNavigate("/cookie-policy"); }} className="hover:text-[#d4ff00] transition-colors">Cookie Policy</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function CookieConsentBanner({ onNavigate }) {
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [cookiePrefsOpen, setCookiePrefsOpen] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({ necessary: true, analytics: true, marketing: true, preferences: true });

  useEffect(() => {
    try {
      if (localStorage.getItem("gif_cookie_consent") || sessionStorage.getItem("gif_cookie_dismissed")) {
        return;
      }
    } catch {}

    const timer = setTimeout(() => {
      setCookieBannerVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem("gif_cookie_dismissed", "true");
    } catch {}
    setCookieBannerVisible(false);
  };

  const handleAcceptCookies = (all = true) => {
    try {
      localStorage.setItem("gif_cookie_consent", all ? "all" : JSON.stringify(cookiePrefs));
    } catch {}
    setCookieBannerVisible(false);
    setCookiePrefsOpen(false);
  };

  if (!cookieBannerVisible) return null;

  return (
    <>
      <div
        style={{ position: "fixed", zIndex: 99999 }}
        className="bottom-4 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md bg-[#0e0e13]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(212,255,0,0.05)] animate-in slide-in-from-bottom duration-300 text-white relative overflow-hidden"
        role="region"
        aria-label="Cookie and privacy preferences"
      >
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4ff00]/70 to-transparent pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss cookie notice"
          className="absolute top-3.5 right-3.5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-8 h-8 rounded-lg bg-[#3155f4]/15 border border-[#3155f4]/30 flex items-center justify-center text-[#3155f4] shrink-0 mt-0.5">
            <Shield className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <p className="font-space font-bold text-xs uppercase tracking-wider text-white mb-1">
              COOKIE &amp; PRIVACY PREFERENCES
            </p>
            <p className="text-zinc-400 text-xs font-inter mb-4 leading-relaxed">
              We use necessary cookies for site function and analytics cookies to optimize user experience. Review our{" "}
              <button
                type="button"
                onClick={() => onNavigate("/cookie-policy")}
                className="underline text-[#d4ff00] hover:text-[#e2ff4d] bg-transparent border-none p-0 cursor-pointer font-medium transition-colors"
              >
                Cookie Policy
              </button>.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAcceptCookies(true)}
                className="bg-[#d4ff00] text-[#09090b] px-4 py-2 rounded-lg font-space font-bold text-xs uppercase hover:bg-[#c2ed00] hover:shadow-[0_0_15px_rgba(212,255,0,0.25)] transition-all cursor-pointer border border-[#d4ff00]"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => handleAcceptCookies(false)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white px-3 py-2 rounded-lg font-space font-bold text-xs uppercase transition-colors cursor-pointer"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={() => setCookiePrefsOpen(true)}
                className="text-xs text-zinc-400 hover:text-[#d4ff00] underline font-space uppercase ml-auto bg-transparent border-none cursor-pointer transition-colors"
              >
                Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      {cookiePrefsOpen && (
        <div
          style={{ position: "fixed", zIndex: 100000 }}
          className="inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Customize Cookie Settings"
        >
          <div className="bg-[#0e0e13]/98 border border-white/10 rounded-2xl sm:rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(212,255,0,0.06)] text-white relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Ambient Top Light */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4ff00] to-transparent opacity-80 pointer-events-none"></div>

            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
              <p className="font-space font-bold text-sm uppercase tracking-wider text-white">Customize Cookie Settings</p>
              <button
                type="button"
                onClick={() => setCookiePrefsOpen(false)}
                aria-label="Close cookie settings dialog"
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-3 text-xs font-inter text-zinc-300 mb-6">
              <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                <div>
                  <div className="font-bold text-white text-xs font-space uppercase tracking-wider">Strictly Necessary</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Core navigation, security, and sessions (Always Active).</div>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="cursor-not-allowed accent-[#d4ff00]"
                  aria-label="Strictly Necessary Cookies (Always Active)"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                <div>
                  <div className="font-bold text-white text-xs font-space uppercase tracking-wider">Analytics &amp; Performance</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">GA4 event tracking and heatmaps.</div>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.analytics}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, analytics: e.target.checked })}
                  className="cursor-pointer accent-[#d4ff00]"
                  aria-label="Analytics and Performance Cookies"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                <div>
                  <div className="font-bold text-white text-xs font-space uppercase tracking-wider">Marketing &amp; Retargeting</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Meta CAPI and Google Ads conversion pixels.</div>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.marketing}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, marketing: e.target.checked })}
                  className="cursor-pointer accent-[#d4ff00]"
                  aria-label="Marketing and Retargeting Cookies"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleAcceptCookies(false)}
              className="w-full bg-[#d4ff00] text-[#09090b] py-3 rounded-xl font-space font-bold text-xs uppercase hover:bg-[#c2ed00] hover:shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all cursor-pointer border border-[#d4ff00]"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// =========================================================================
// UNIVERSAL WHATSAPP FLOATING QUICK CHAT BUTTON (REMOVED PER USER REQUEST)
// =========================================================================
export function WhatsAppFloatingButton() {
  return null;
}
