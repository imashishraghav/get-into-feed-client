import React, { useState, useEffect } from "react";
import { X, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { trackLeadConversion } from "../utils/analytics.js";

const API_URL = import.meta.env.VITE_API_URL || "https://get-into-feed-client.vercel.app";

const SERVICES_LIST = [
  "Content Creation & Viral Reels",
  "Paid Media & Performance Ads",
  "Brand Positioning & Visual Identity",
  "Social Media & Organic Growth",
  "Web Design & Conversion Funnels",
  "AI Search & Programmatic SEO",
  "Influencer & Creator UGC Network",
  "Analytics, Attribution & Retention",
  "Full-Stack Growth Sprint (All-in-One)",
  "Other / Custom Requirement"
];

const PLANS_LIST = [
  "Basic Plan — ₹14,999 / mo",
  "Intermediate Plan — ₹29,999 / mo",
  "Advanced Plan — ₹44,999 / mo",
  "Custom Sprint / Enterprise Tier (₹75,000+)",
  "Not Sure / Need Recommendation"
];

export function UniversalLeadModal({ isOpen, onClose, selectedService, setSelectedService }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    service: "Content Creation & Viral Reels",
    plan: "Basic Plan — ₹14,999 / mo",
    requirements: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Intelligently sync service or plan when modal opens or selectedService prop changes
  useEffect(() => {
    if (!selectedService) return;

    const str = String(selectedService);
    const isPlan = str.includes("14,999") || str.includes("29,999") || str.includes("44,999") || str.toLowerCase().includes("plan");

    if (isPlan) {
      if (str.includes("14,999")) {
        setFormData((prev) => ({ ...prev, plan: "Basic Plan — ₹14,999 / mo" }));
      } else if (str.includes("29,999")) {
        setFormData((prev) => ({ ...prev, plan: "Intermediate Plan — ₹29,999 / mo" }));
      } else if (str.includes("44,999")) {
        setFormData((prev) => ({ ...prev, plan: "Advanced Plan — ₹44,999 / mo" }));
      } else {
        setFormData((prev) => ({ ...prev, plan: str }));
      }
    } else {
      // Find closest matching service or use as custom
      const matchedSvc = SERVICES_LIST.find((s) => s.toLowerCase().includes(str.toLowerCase()) || str.toLowerCase().includes(s.toLowerCase()));
      setFormData((prev) => ({ ...prev, service: matchedSvc || str }));
    }
  }, [selectedService, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please enter your name, email, and phone number.");
      return;
    }

    setSubmitting(true);

    const newLead = {
      id: "lead-" + Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.website || "Direct Inquiry",
      service: formData.service,
      plan: formData.plan,
      budget: formData.plan,
      requirements: formData.requirements,
      status: "New",
      date: new Date().toISOString().slice(0, 10),
      message: formData.requirements
        ? `[Plan: ${formData.plan}] [Service: ${formData.service}] Requirements: ${formData.requirements}`
        : `[Plan: ${formData.plan}] [Service: ${formData.service}]`
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
          service: formData.service,
          plan: formData.plan,
          budget_tier: formData.plan,
          requirements: formData.requirements,
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
        service: `${formData.service} (${formData.plan})`,
        source: "universal_lead_modal",
        company: newLead.company
      });
    } catch {}

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        service: "Content Creation & Viral Reels",
        plan: "Basic Plan — ₹14,999 / mo",
        requirements: ""
      });
    }, 2200);
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-[250] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-black rounded-3xl max-w-xl w-full p-5 sm:p-7 md:p-8 shadow-[8px_8px_0px_#000] relative text-brand-dark overflow-hidden animate-in zoom-in-95 duration-200 max-h-[94vh] overflow-y-auto"
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
              Our senior growth strategist will review your requirements and reach out on WhatsApp/Phone within 15 minutes.
            </p>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-4 text-left pr-8">
              <span className="inline-flex items-center gap-1.5 font-space text-[10px] font-bold bg-brand-lime text-brand-dark px-2.5 py-1 rounded-full uppercase border border-black/15 tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-brand-dark" />
                GET INTO THE FEED
              </span>
              <h3 className="font-space font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-brand-dark leading-tight">
                LET'S SCALE YOUR BRAND.
              </h3>
              <p className="text-xs text-gray-500 font-inter mt-1 leading-relaxed">
                Direct access to senior growth operators. Custom tailor your service and plan below.
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              {/* 1. SEPARATED: SERVICE REQUIRED & PLAN / BUDGET TIER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                    Service Required *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => {
                      setFormData({ ...formData, service: e.target.value });
                      if (setSelectedService) setSelectedService(e.target.value);
                    }}
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter font-medium cursor-pointer"
                  >
                    {SERVICES_LIST.map((svc) => (
                      <option key={svc} value={svc}>
                        {svc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                    Selected Plan / Tier *
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3 py-2.5 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter font-medium cursor-pointer"
                  >
                    {PLANS_LIST.map((pln) => (
                      <option key={pln} value={pln}>
                        {pln}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. FOUNDER / CONTACT NAME */}
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

              {/* 3. 2-COLUMN EMAIL & PHONE */}
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

              {/* 4. WEBSITE OR SOCIAL HANDLE */}
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

              {/* 5. PROJECT DETAILS & REQUIREMENTS TEXTAREA */}
              <div>
                <label className="block text-[11px] font-space font-bold uppercase text-gray-700 mb-1">
                  Project Details / Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your brand goals, target audience, or specific deliverables required..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full bg-[#F4F4F5] border border-black/15 rounded-xl px-3.5 py-2 text-xs text-brand-dark focus:border-brand-blue focus:bg-white focus:outline-none transition-all font-inter resize-none"
                ></textarea>
              </div>

              {/* 6. SUBMIT CTA BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-lime text-brand-dark py-3.5 rounded-xl font-space font-extrabold uppercase text-xs tracking-wider hover:bg-[#E2FF4D] transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 mt-1"
              >
                {submitting ? "Transmitting..." : "Schedule Sprint Consultation →"}
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-[10px] text-gray-500 font-inter pt-1">
                <span className="flex items-center gap-1">🔒 100% Confidential</span>
                <span className="flex items-center gap-1">⚡ 15-Min Response</span>
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
