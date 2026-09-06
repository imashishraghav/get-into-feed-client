import React, { useState } from "react";
import { X, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { trackLeadConversion } from "../utils/analytics.js";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

export function UniversalLeadModal({ isOpen, onClose, selectedService, setSelectedService }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }

    setSubmitting(true);
    const activeService = selectedService || "General Growth Consultation";

    const newLead = {
      id: "lead-" + Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.website || "Direct Inquiry",
      service: activeService,
      budget: activeService.includes("14,999")
        ? "₹14,999/mo"
        : activeService.includes("29,999")
        ? "₹29,999/mo"
        : activeService.includes("44,999")
        ? "₹44,999/mo"
        : "Custom Enterprise",
      status: "New",
      date: new Date().toISOString().slice(0, 10),
      message: formData.message || `Inquiry for ${activeService}`
    };

    // 1. Instant CRM localStorage update for Admin dashboard
    try {
      const existingRaw = localStorage.getItem("gif_admin_leads");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem("gif_admin_leads", JSON.stringify([newLead, ...existing]));
      window.dispatchEvent(new Event("storage"));
    } catch {}

    // 2. Call backend API
    try {
      await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLead,
          source: "Universal Lead Modal"
        })
      });
    } catch (err) {
      console.warn("API lead sync error:", err);
    }

    // 3. Analytics Conversion Tracking (GA4 + GTM)
    try {
      trackLeadConversion({
        id: newLead.id,
        service: newLead.service,
        source: "universal_lead_modal",
        company: newLead.company
      });
    } catch {}

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({ name: "", email: "", phone: "", website: "", message: "" });
    }, 2200);
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-[250] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black rounded-3xl max-w-lg w-full p-5 sm:p-7 md:p-8 shadow-[8px_8px_0px_#000] relative text-brand-dark overflow-hidden animate-in zoom-in-95 duration-200 max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Lime Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-lime via-brand-blue to-brand-lime"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F4F5] hover:bg-black hover:text-white transition-colors flex items-center justify-center border border-black/10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8 sm:py-10 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-lime border-2 border-black flex items-center justify-center mx-auto text-brand-dark shadow-[3px_3px_0px_#000]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-space font-extrabold text-2xl uppercase tracking-tight text-brand-dark">
              INQUIRY RECEIVED!
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm font-inter max-w-xs mx-auto leading-relaxed">
              Our senior growth strategist will reach out on WhatsApp/Phone within 2 hours.
            </p>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-5 text-left pr-8">
              <span className="inline-flex items-center gap-1.5 font-space text-[10px] font-bold bg-brand-lime text-brand-dark px-2.5 py-1 rounded-full uppercase border border-black/15 tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-brand-dark" />
                GET INTO THE FEED
              </span>
              <h3 className="font-space font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-brand-dark leading-tight">
                LET'S SCALE YOUR BRAND.
              </h3>
              <p className="text-xs text-gray-500 font-inter mt-1 leading-relaxed">
                Direct access to senior growth operators. Tell us what you're building.
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              {/* Selected Plan / Service */}
              <div>
                <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                  Selected Plan / Service
                </label>
                <select
                  value={selectedService || "Basic Plan (₹14,999/mo)"}
                  onChange={(e) => setSelectedService && setSelectedService(e.target.value)}
                  className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter font-medium cursor-pointer"
                >
                  <option value="Basic Plan (₹14,999/mo)">Basic Plan — ₹14,999 / mo (Social + Content + Ads)</option>
                  <option value="Intermediate Plan (₹29,999/mo)">Intermediate Plan — ₹29,999 / mo (Google & Meta Ads + Creative)</option>
                  <option value="Advanced Plan (₹44,999/mo)">Advanced Plan — ₹44,999 / mo (Full Growth System)</option>
                  <option value="Talk to Sales - Custom Plan">Talk to Sales / Custom Enterprise Plan</option>
                  <option value="Ready to Launch - Sprint">Ready to Launch — Growth Sprint</option>
                  <option value="Paid Performance & Ads">Paid Performance & Ads ROAS</option>
                  <option value="Short-Form Video & Reels">Short-Form Video & Reels Creative</option>
                  <option value="Web Engineering & CRO">High-Speed Web Development & CRO</option>
                  <option value="SEO & Organic Growth">Search SEO & AI Citation (GEO)</option>
                  <option value="Brand Positioning & Identity">Brand Identity & Redesign</option>
                  <option value="General Growth Consultation">General Growth Consultation</option>
                </select>
              </div>

              {/* Founder Name */}
              <div>
                <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ashish Raghav"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter"
                />
              </div>

              {/* 2-Column Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    placeholder="ashish@brand.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter"
                  />
                </div>
              </div>

              {/* Website or Social Handle */}
              <div>
                <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                  Website or Instagram Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://yourbrand.com or @handle"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter"
                />
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-lime text-brand-dark py-3.5 rounded-xl font-space font-bold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 mt-2"
              >
                {submitting ? "Transmitting..." : "Schedule Sprint Consultation →"}
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-[10px] text-gray-500 font-inter pt-1">
                <span className="flex items-center gap-1">🔒 100% Confidential</span>
                <span className="flex items-center gap-1">⚡ 2-Hour Response</span>
                <span className="flex items-center gap-1">🚫 No Spam</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UniversalLeadModal;
