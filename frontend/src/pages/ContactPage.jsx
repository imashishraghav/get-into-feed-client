import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";
import { validateName, validatePhone, isHoneypotTriggered } from "../utils/validation.js";
import { toast } from "../components/Toast.jsx";
import { trackLeadConversion } from "../utils/analytics.js";
import { enrichWithAttribution } from "../utils/utm.js";

const API_URL = import.meta.env.VITE_API_URL || "";

export function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    business: "",
    service: "Google Ads",
    message: "",
    hp_field: "",
    bot_check: ""
  });
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact Us — GetIntoFeed Digital Marketing";
  }, []);

  const contactFaqs = [
    {
      q: "Do you have a physical office in Delhi NCR?",
      a: "We work as a remote-first freelance digital team across Delhi, Noida, and Gurugram. We meet clients via Google Meet and phone, keeping our overheads low so you get direct expert execution without bloated agency markups."
    },
    {
      q: "Can we talk before choosing a service?",
      a: "Yes, absolutely! We encourage an introductory discovery chat. We will review your website or current ads, identify immediate bottlenecks, and recommend only what your business genuinely needs."
    },
    {
      q: "Will I need to share my account password?",
      a: "Never. You retain 100% ownership and control. You simply grant standard partner or manager access through Google Ads MCC or Meta Business Manager."
    },
    {
      q: "Do you work with businesses outside Delhi NCR?",
      a: "Yes! While our primary local client base is Delhi NCR, we regularly work with fast-growing brands across Bengaluru, Mumbai, Hyderabad, and internationally."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Honeypot bot protection
    if (isHoneypotTriggered(formData)) {
      setSubmitted(true);
      return;
    }

    // 2. Inline form validation
    const errors = {};
    const nameRes = validateName(formData.name);
    if (!nameRes.isValid) errors.name = nameRes.error;

    const phoneRes = validatePhone(formData.phone, "+91");
    if (!phoneRes.isValid) errors.phone = phoneRes.error;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast(Object.values(errors)[0], "error");
      return;
    }

    if (!consent) {
      setFieldErrors((prev) => ({ ...prev, consent: "Please agree to the Privacy Policy to proceed." }));
      toast("Please agree to the Privacy Policy to proceed.", "error");
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    const waText = `Hi GetIntoFeed, I would like to get in touch regarding ${formData.service}.\n\n*Name:* ${nameRes.cleaned}\n*Phone:* ${phoneRes.cleaned}\n*Business:* ${formData.business || "N/A"}\n*Service:* ${formData.service}\n*Note:* ${formData.message || "Looking for consultation"}`;
    const waUrl = `https://wa.me/918810356950?text=${encodeURIComponent(waText)}`;

    try {
      // Canonical single lead submission with full marketing attribution & consent
      await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichWithAttribution({
          name: nameRes.cleaned,
          phone: phoneRes.cleaned,
          company: formData.business?.trim() || null,
          service: formData.service,
          message: formData.message?.trim() || null,
          source: "Contact Page Form",
          form_type: "Contact Page Form",
          consent: consent,
          hp_field: formData.hp_field,
          bot_check: formData.bot_check
        }))
      });

      trackLeadConversion({
        service: formData.service,
        source: "contact_page",
        name: nameRes.cleaned,
        phone: phoneRes.cleaned
      });

      toast("Redirecting to WhatsApp to send your inquiry...", "success");
    } catch (err) {
      console.warn("Contact lead error:", err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      window.open(waUrl, "_blank");
    }
  };

  return (
    <PageLayout onNavigate={onNavigate} activeNav="contact" fullWidth={true}>
      <div className="w-full max-w-full overflow-x-hidden font-sans text-slate-900 bg-white antialiased selection:bg-[#d4ff00] selection:text-slate-950">
        {/* 1. HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="services-hero-bg rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-slate-800/90 min-h-[280px] sm:min-h-[300px] flex items-center">
            {/* Right Side Decorative Geometric Graphic */}
            <div className="absolute right-[-40px] sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-85 sm:opacity-90">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <div className="w-full h-full rounded-full border-[28px] sm:border-[36px] border-[#d4ff00]/25 flex items-center justify-center">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#d4ff00]/50 -translate-x-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/>
                  </svg>
                </div>
                <div className="absolute -top-4 right-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#d4ff00]/40 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#d4ff00]/30"></div>
                </div>
              </div>
            </div>

            {/* Left Column Copy */}
            <div className="relative z-10 max-w-2xl space-y-4 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#e7ff8a]">
                <span className="w-[11px] h-[11px] rounded-[3px] bg-[#d4ff00] border-2 border-[#2563eb] inline-block shrink-0 box-border" />
                CONTACT US
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-[-0.035em] leading-[1.08] text-white">
                Let’s get your <br className="hidden sm:inline" />
                <span className="text-[#d4ff00]">business noticed.</span>
              </h1>

              <p className="text-[#d4dcf0] text-[14.5px] sm:text-[15px] leading-[1.55] max-w-xl font-normal pt-1">
                Need Google Ads, social media, SEO or a website refresh? Call, WhatsApp or ask for a price based on your needs.
              </p>
            </div>
          </div>
        </section>

        {/* 2. CONTACT DETAILS & ENQUIRY FORM */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Direct Contact Details Card */}
            <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => onNavigate("/pricing")}
                    className="px-4 py-2 rounded-full bg-[#3155f4] hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition border-none cursor-pointer"
                  >
                    <span>Get detailed pricing</span>
                    <span>↗</span>
                  </button>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#3155f4]">
                    <span className="w-2 h-2 rounded-full bg-[#3155f4]"></span>
                    TALK TO US
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-space">
                  Real contact details. No office address.
                </h2>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">
                  We work remotely across Delhi NCR. Reach us directly and explain what you need help with.
                </p>

                <div className="divide-y divide-slate-200/80 mt-6 border-y border-slate-200/80">
                  <div className="py-4">
                    <a
                      href="tel:+918810356950"
                      className="group inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-blue-600 transition"
                    >
                      <span>Call us</span>
                      <span className="text-slate-400 group-hover:text-blue-600">↗</span>
                    </a>
                    <div className="text-sm font-semibold text-slate-700 mt-0.5">
                      +91 88103 56950
                    </div>
                  </div>

                  <div className="py-4">
                    <a
                      href="mailto:hello@getintofeed.com"
                      className="group inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-blue-600 transition"
                    >
                      <span>Email us</span>
                      <span className="text-slate-400 group-hover:text-blue-600">↗</span>
                    </a>
                    <div className="text-sm font-semibold text-slate-700 mt-0.5">
                      hello@getintofeed.com
                    </div>
                  </div>

                  <div className="py-4">
                    <a
                      href="https://wa.me/918810356950"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-emerald-600 transition"
                    >
                      <span>WhatsApp</span>
                      <span className="text-slate-400 group-hover:text-emerald-600">↗</span>
                    </a>
                    <div className="text-sm font-semibold text-slate-700 mt-0.5">
                      Message our team
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm mt-8">
                <h4 className="text-sm font-extrabold text-slate-900 mb-1 font-space">
                  Helpful details to share
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Your business, location, preferred service, website (if any) and the problem you want to solve.
                </p>
              </div>
            </div>

            {/* Right Column: Enquiry Form Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 text-left flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#3155f4]">
                  <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0" viewBox="0 0 16 16" fill="none">
                    <rect width="16" height="16" rx="3" fill="#3155f4" />
                    <path d="M4 0 L16 0 L16 12 Z" fill="#d4ff00" />
                  </svg>
                  ENQUIRY FORM
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-2 font-space">
                  Share a few details.
                </h2>
                <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
                  Keep it short. We do not need a full marketing brief to understand your first question.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Honeypot Fields */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="hp_field"
                      tabIndex={-1}
                      value={formData.hp_field}
                      onChange={(e) => setFormData({ ...formData, hp_field: e.target.value })}
                    />
                    <input
                      type="text"
                      name="bot_check"
                      tabIndex={-1}
                      value={formData.bot_check}
                      onChange={(e) => setFormData({ ...formData, bot_check: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">
                        Your name *
                      </label>
                      <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: null });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none ${
                          fieldErrors.name ? "border-rose-500 bg-rose-50/20" : "border-slate-200 focus:border-blue-500"
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{fieldErrors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">
                        Phone or WhatsApp (10 digits) *
                      </label>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: null });
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none ${
                          fieldErrors.phone ? "border-rose-500 bg-rose-50/20" : "border-slate-200 focus:border-blue-500"
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{fieldErrors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">
                        Business name
                      </label>
                      <input
                        type="text"
                        placeholder="Business (optional)"
                        value={formData.business}
                        onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1.5">
                        What do you need?
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
                      >
                        <option value="Google Ads">Google Ads</option>
                        <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
                        <option value="SEO & Local Search">SEO & Local Search</option>
                        <option value="Website Design">Website Design</option>
                        <option value="Reels & Video Editing">Reels & Video Editing</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Full Growth Marketing">Full Growth Marketing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">
                      What is not working?
                    </label>
                    <textarea
                      rows={4}
                      placeholder="A few lines about your goal or issue"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
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
                        className="mt-0.5 rounded border-slate-300 text-[#3155f4] focus:ring-[#3155f4]"
                      />
                      <span>
                        I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#3155f4] hover:text-blue-800">Privacy Policy</a> and consent to receiving communications regarding my inquiry via WhatsApp, Phone, or Email (DPDP Act 2023 compliant).
                      </span>
                    </label>
                    {fieldErrors.consent && (
                      <p className="text-xs text-rose-500 mt-1">{fieldErrors.consent}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#3155f4] hover:bg-blue-700 text-white font-extrabold text-sm inline-flex items-center justify-center gap-1.5 transition shadow-md cursor-pointer border-none disabled:opacity-50"
                    >
                      <span>{submitting ? "Opening WhatsApp..." : "Continue on WhatsApp"}</span>
                      <span>↗</span>
                    </button>
                  </div>

                  <div className="mt-4 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-medium">
                    We open a WhatsApp message with your details so you can review and send it yourself.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BEFORE YOU MESSAGE FAQ ACCORDION */}
        <section className="bg-slate-50/60 border-t border-slate-100 py-12 sm:py-16 text-left">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#3155f4] mb-2">
              <svg className="w-3.5 h-3.5 rounded-[3px] shrink-0" viewBox="0 0 16 16" fill="none">
                <rect width="16" height="16" rx="3" fill="#3155f4" />
                <path d="M4 0 L16 0 L16 12 Z" fill="#d4ff00" />
              </svg>
              BEFORE YOU MESSAGE
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-8 font-space">
              A few useful answers.
            </h2>

            <div className="space-y-3">
              {contactFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer border-none bg-transparent hover:text-blue-600 transition"
                    >
                      <span>{faq.q}</span>
                      <span className="text-blue-600 text-lg font-mono font-bold shrink-0">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default ContactPage;
