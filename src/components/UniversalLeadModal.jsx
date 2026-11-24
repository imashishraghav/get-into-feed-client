import React, { useState, useEffect } from "react";
import { X, CheckCircle2, ArrowRight, Sparkles, AlertCircle, ShieldCheck, Zap, Lock } from "lucide-react";
import { trackLeadConversion } from "../utils/analytics.js";
import { validateLeadForm, isHoneypotTriggered } from "../utils/validation.js";
import { toast } from "./Toast.jsx";
import { enrichWithAttribution } from "../utils/utm.js";

const API_URL = import.meta.env.VITE_API_URL || "";

const SERVICES_LIST = [
  "Viral Content & Video Reels",
  "Paid Media & Performance Ads (Meta / Google)",
  "Web Development & Conversion Funnels",
  "AI Search & Programmatic SEO",
  "Full Growth Suite (Multi-Channel)",
  "Other / Custom Consultation"
];

export function UniversalLeadModal({ isOpen, onClose, selectedService, setSelectedService }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Viral Content & Video Reels",
    requirements: "",
    // Honeypot fields for anti-spam bots
    hp_field: "",
    bot_check: ""
  });
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Intelligently sync service when modal opens or selectedService prop changes
  useEffect(() => {
    if (!selectedService) return;
    const str = String(selectedService);
    const matchedSvc = SERVICES_LIST.find((s) => s.toLowerCase().includes(str.toLowerCase()) || str.toLowerCase().includes(s.toLowerCase()));
    setFormData((prev) => ({ ...prev, service: matchedSvc || str }));
  }, [selectedService, isOpen]);

  // Reset errors when modal reopens
  useEffect(() => {
    if (isOpen) {
      setFieldErrors({});
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Bot honeypot check
    if (isHoneypotTriggered(formData)) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
      return;
    }

    // 2. Validate form inputs
    const { isValid, errors, cleanedData } = validateLeadForm({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      countryCode: "+91"
    });

    if (!isValid) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      toast(firstError, "error");
      return;
    }

    if (!consent) {
      setFieldErrors((prev) => ({ ...prev, consent: "Please agree to the Privacy Policy to proceed." }));
      toast("Please agree to the Privacy Policy to proceed.", "error");
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    const newLead = {
      id: "lead-" + Date.now(),
      name: cleanedData.name,
      email: cleanedData.email,
      phone: cleanedData.phone,
      service: formData.service,
      company: null,
      budget: null,
      requirements: formData.requirements,
      status: "New",
      date: new Date().toISOString().slice(0, 10),
      message: formData.requirements
        ? `[Service: ${formData.service}] Note: ${formData.requirements}`
        : `[Service: ${formData.service}]`
    };

    // 1. Transmit to backend API with complete attribution & DPDP consent
    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichWithAttribution({
          ...newLead,
          consent: consent,
          source: "Universal Growth Modal",
          form_type: "Universal Growth Modal",
          hp_field: formData.hp_field,
          bot_check: formData.bot_check
        }))
      });

      if (!response.ok && response.status !== 422) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
    } catch (err) {
      console.warn("API lead sync error:", err);
      // We still treat as captured locally so user is not penalized for temporary network blips
    }

    // 3. Analytics Conversion Tracking (GA4 + GTM)
    try {
      trackLeadConversion({
        id: newLead.id,
        service: formData.service,
        source: "universal_lead_modal",
        company: newLead.company
      });
    } catch {}

    setSubmitting(false);
    setSubmitted(true);
    toast("Thank you! Your growth plan inquiry has been received.", "success");

    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "Viral Content & Video Reels",
        requirements: "",
        hp_field: "",
        bot_check: ""
      });
      if (typeof window !== "undefined") {
        window.location.href = "/thank-you";
      }
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fe-universal-lead-modal-title"
        className="bg-[#0e0e13]/95 border border-white/10 rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 md:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(212,255,0,0.08)] relative text-white overflow-hidden animate-in zoom-in-95 duration-200 max-h-[94vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Lighting Accents */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4ff00] to-transparent opacity-80 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#d4ff00]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#3155f4]/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Sleek Dark Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-all flex items-center justify-center border border-white/10 cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8 sm:py-12 space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/40 flex items-center justify-center mx-auto text-[#d4ff00] shadow-[0_0_30px_rgba(212,255,0,0.25)] animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 font-space text-[10px] font-bold bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/30 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Zap className="w-3 h-3 text-[#d4ff00]" /> BRIEF LOGGED SUCCESSFULLY
              </span>
              <h3 id="fe-universal-lead-modal-title" className="font-space font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-white mt-1">
                INQUIRY RECEIVED!
              </h3>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm font-inter max-w-sm mx-auto leading-relaxed">
              Our senior growth strategist will review your requirements and reach out directly on WhatsApp/Phone at <span className="font-bold text-[#d4ff00]">{formData.phone}</span> within 15 minutes.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 font-inter">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3155f4]" />
              <span>Direct strategist allocation · Zero spam</span>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            {/* Modal Header */}
            <div className="mb-3 sm:mb-4 text-left pr-8">
              <span className="inline-flex items-center gap-1.5 font-space text-[10px] font-bold bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/30 px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3 text-[#d4ff00]" />
                GET INTO THE FEED · 2027 SPRINT
              </span>
              <h3 id="fe-universal-lead-modal-title" className="font-space font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-white leading-tight">
                LET'S SCALE YOUR BRAND<span className="text-[#d4ff00]">.</span>
              </h3>
              <p className="text-xs text-zinc-400 font-inter mt-1 leading-relaxed">
                Direct access to senior growth operators. Fill 4 quick fields for a tailored acquisition roadmap.
              </p>
            </div>

            {/* Streamlined Modal Form */}
            <form onSubmit={handleSubmit} noValidate toolname="submitLeadInquiry" tooldescription="Submit a business growth consultation inquiry or project brief to GetIntoFeed" toolautosubmit="false" className="space-y-2.5 sm:space-y-3 text-left">
              {/* Invisible Bot Honeypots */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="hp_field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.hp_field}
                  onChange={(e) => setFormData({ ...formData, hp_field: e.target.value })}
                />
                <input
                  type="text"
                  name="bot_check"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.bot_check}
                  onChange={(e) => setFormData({ ...formData, bot_check: e.target.value })}
                />
              </div>

              {/* 1. Name */}
              <div>
                <label htmlFor="lead-modal-name" className="block text-[11px] font-space font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  Your Name *
                </label>
                <input
                  id="lead-modal-name"
                  type="text"
                  placeholder="e.g. Ashish Raghav"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
                  }}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  className={`w-full bg-zinc-900/80 border rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:bg-zinc-950 focus:outline-none focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]/40 transition-all font-inter ${
                    fieldErrors.name ? "border-rose-500/80 bg-rose-950/20" : "border-white/10 hover:border-white/20"
                  }`}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>

              {/* 2. Phone / WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label htmlFor="lead-modal-phone" className="block text-[11px] font-space font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="lead-modal-phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: null });
                    }}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                    className={`w-full bg-zinc-900/80 border rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:bg-zinc-950 focus:outline-none focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]/40 transition-all font-inter ${
                      fieldErrors.phone ? "border-rose-500/80 bg-rose-950/20" : "border-white/10 hover:border-white/20"
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p id="phone-error" className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{fieldErrors.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lead-modal-email" className="block text-[11px] font-space font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    id="lead-modal-email"
                    type="email"
                    placeholder="ashish@brand.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                    }}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    className={`w-full bg-zinc-900/80 border rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:bg-zinc-950 focus:outline-none focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]/40 transition-all font-inter ${
                      fieldErrors.email ? "border-rose-500/80 bg-rose-950/20" : "border-white/10 hover:border-white/20"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Service / Goal */}
              <div>
                <label htmlFor="lead-modal-service" className="block text-[11px] font-space font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  Service / Growth Focus *
                </label>
                <div className="relative">
                  <select
                    id="lead-modal-service"
                    value={formData.service}
                    onChange={(e) => {
                      setFormData({ ...formData, service: e.target.value });
                      if (setSelectedService) setSelectedService(e.target.value);
                    }}
                    className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:bg-zinc-950 focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]/40 focus:outline-none transition-all font-inter font-medium cursor-pointer appearance-none"
                  >
                    {SERVICES_LIST.map((svc) => (
                      <option key={svc} value={svc} className="bg-zinc-900 text-white py-1">
                        {svc}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 4. Project Goal / Link (Optional) */}
              <div>
                <label htmlFor="lead-modal-goal" className="block text-[11px] font-space font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  Current Goal or Website <span className="text-zinc-500 font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="lead-modal-goal"
                  type="text"
                  placeholder="e.g. 5x ROAS for fashion brand / https://brand.com"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full bg-zinc-900/80 border border-white/10 hover:border-white/20 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:bg-zinc-950 focus:border-[#d4ff00] focus:ring-1 focus:ring-[#d4ff00]/40 focus:outline-none transition-all font-inter"
                />
              </div>

              {/* DPDP Consent */}
              <div className="pt-0.5">
                <label className="flex items-start gap-2.5 text-[11px] text-zinc-300 font-inter cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (e.target.checked) {
                        setFieldErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.consent;
                          return updated;
                        });
                      }
                    }}
                    className="mt-0.5 rounded border-white/20 bg-zinc-900 text-[#d4ff00] focus:ring-[#d4ff00]/50 accent-[#d4ff00]"
                  />
                  <span className="leading-relaxed">
                    I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#d4ff00] hover:text-white">Privacy Policy</a> and consent to receiving communications regarding my project brief via WhatsApp, Phone, or Email (DPDP Act 2023 compliant).
                  </span>
                </label>
                {fieldErrors.consent && (
                  <p className="text-[11px] text-rose-400 mt-1 font-inter">{fieldErrors.consent}</p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#d4ff00] text-[#09090b] py-3 sm:py-3.5 rounded-xl font-space font-extrabold uppercase text-xs sm:text-sm tracking-wider hover:bg-[#c2ed00] hover:shadow-[0_0_25px_rgba(212,255,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#d4ff00] disabled:opacity-50 mt-2 shadow-lg active:scale-[0.99]"
              >
                {submitting ? (
                  <span>Transmitting Brief...</span>
                ) : (
                  <>
                    <span>Get Growth Plan On WhatsApp / Call</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Sleek Trust Micro-Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5 text-[10px] text-zinc-400 font-inter">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/5">
                  <Lock className="w-3 h-3 text-[#d4ff00]" /> 100% Confidential
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/5">
                  <Zap className="w-3 h-3 text-[#d4ff00]" /> 15-Min Response
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/5">
                  <ShieldCheck className="w-3 h-3 text-[#3155f4]" /> DPDP Compliant
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UniversalLeadModal;
