import React, { useState, useEffect } from "react";
import { Check, Plus, X, AlertCircle } from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";
import { PRICING_COUNTRY_CODES } from "../data/countryCodes.js";
import { enrichWithAttribution } from "../utils/utm.js";
export { PRICING_COUNTRY_CODES };

export function PricingPage({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [modalPlanTitle, setModalPlanTitle] = useState("Starter Support (₹10,500 onwards*)");
  const [modalForm, setModalForm] = useState({
    name: "",
    countryCode: "+91",
    countryName: "India",
    phone: "",
    email: "",
    service: "Google Ads (Search / Local Leads)",
    message: ""
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Pricing — GetIntoFeed Digital Marketing";
  }, []);

  const openPricingModal = (planTitle) => {
    setModalPlanTitle(planTitle);
    setModalSuccess(false);
    setPricingModalOpen(true);
  };

  const closePricingModal = () => {
    setPricingModalOpen(false);
    setModalSuccess(false);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handlePricingFormSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.name || !modalForm.phone || !modalForm.email) {
      alert("Please fill in your Name, Phone Number, and Email Address.");
      return;
    }

    setModalSubmitting(true);
    const fullPhone = `${modalForm.countryCode} ${modalForm.phone.trim()}`;
    const fullMessage = modalForm.message.trim()
      ? `[Country: ${modalForm.countryName} (${modalForm.countryCode})] [Plan: ${modalPlanTitle}] [Service: ${modalForm.service}] Message: ${modalForm.message.trim()}`
      : `[Country: ${modalForm.countryName} (${modalForm.countryCode})] [Plan: ${modalPlanTitle}] [Service: ${modalForm.service}]`;

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichWithAttribution({
          name: modalForm.name.trim(),
          email: modalForm.email.trim(),
          phone: fullPhone,
          whatsapp: fullPhone,
          company: null,
          city: modalForm.countryName,
          service: modalForm.service,
          interested_service: modalForm.service,
          budget: modalPlanTitle,
          message: fullMessage,
          source: `Pricing Page Quote Modal (${modalForm.countryName})`,
          form_type: `Pricing Page Quote Modal (${modalForm.countryName})`,
          consent: true
        }))
      });
    } catch (err) {
      console.error("Pricing lead submission error:", err);
    }

    setModalSubmitting(false);
    setModalSuccess(true);
    setTimeout(() => {
      setPricingModalOpen(false);
      setModalSuccess(false);
      setModalForm({
        name: "",
        countryCode: "+91",
        countryName: "India",
        phone: "",
        email: "",
        service: "Google Ads (Search / Local Leads)",
        message: ""
      });
    }, 2200);
  };

  const pricingFaqs = [
    {
      q: "Is ₹10,500 the price for every service?",
      a: "₹10,500* is our starting fee for a single, focused priority with a limited scope (for example, setting up & managing a starter local Google Ads campaign, basic local SEO, or a starter social pack). Larger multi-channel campaigns or full custom websites are quoted based on the exact workload required."
    },
    {
      q: "Do I pay Google or Meta directly?",
      a: "Yes, 100%. Your daily or monthly ad spend is billed directly inside your own Google Ads or Meta Ads account using your payment method. You get official tax invoices directly from Google/Meta and have full transparency over every rupee spent on clicks."
    },
    {
      q: "Can I request a one-time project instead of a monthly plan?",
      a: "Absolutely. If you only need a high-converting landing page, a new business website, an ad account audit, or a batch of Reels/creatives, you can book us for a one-time project with a clear timeline and handover."
    },
    {
      q: "Are results guaranteed?",
      a: "No honest agency can guarantee an exact number of sales or #1 Google rankings overnight because results depend on your market competition, offer, pricing, and how fast leads are followed up. What we guarantee is clear deliverables, clean conversion tracking, and transparent weekly/monthly execution."
    }
  ];

  return (
    <PageLayout
      onNavigate={onNavigate}
      activeNav="pricing"
      fullWidth={true}
    >
      <div className="w-full font-sans text-slate-900 bg-white antialiased selection:bg-[#d2ff00] selection:text-slate-950 pb-12">
        
        {/* HERO SECTION (Exact Screenshot Style with Geometric Ring & Asterisk) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="pricing-hero-bg rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-slate-800/90 min-h-[290px] flex items-center">
            
            {/* Right Side Decorative Geometric Graphic */}
            <div className="absolute right-[-40px] sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-90">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                {/* Outer Lime Translucent Ring */}
                <div className="w-full h-full rounded-full border-[28px] sm:border-[36px] border-[#d2ff00]/25 flex items-center justify-center">
                  {/* Inner Asterisk Spark */}
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#d2ff00]/50 -translate-x-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
                  </svg>
                </div>
                {/* Overlapping Top-Right Double Circle */}
                <div className="absolute -top-4 right-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#d2ff00]/40 flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#d2ff00]/30" />
                </div>
              </div>
            </div>

            {/* Left Column Copy */}
            <div className="relative z-10 max-w-2xl space-y-4 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#e7ff8a]">
                <span className="w-[11px] h-[11px] rounded-[3px] bg-[#d4ff00] border-2 border-[#2563eb] inline-block shrink-0 box-border" />
                PRICING MADE SIMPLE
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-[-0.035em] leading-[1.08] text-white">
                Starter pricing. <br className="hidden sm:inline" />
                <span className="text-[#d4ff00]">A plan that fits you.</span>
              </h1>

              <p className="text-[#d4dcf0] text-[14.5px] sm:text-[15px] leading-[1.55] max-w-xl font-normal pt-1">
                Start from ₹10,500* for limited-scope work, or request a full quote for Google Ads, SEO, social media, web design and creative support.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: 3 PRICING CARDS */}
        <section id="pricing-plans" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          {/* Section Header */}
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-blue-600 mb-2">
              NO ONE-SIZE-FITS-ALL RETAINERS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
              A fair starting point.<br />
              <span className="highlight-underline">A price built for your scope.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Not every business needs the same hours, ads or content. Here are three straightforward ways to begin.
            </p>
          </div>

          {/* 3 Pricing Tiers Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            
            {/* Card 1: Starter support */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-[#254bdb] starter-card-shadow flex flex-col justify-between transition hover:-translate-y-1">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#254bdb] block mb-2">
                  START HERE
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-3">
                  Starter support
                </h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">₹10,500</span>
                  <span className="text-xs font-bold text-slate-600">onwards*</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 pb-5 border-b border-slate-100">
                  For one small, clearly defined marketing priority.
                </p>

                <ul className="space-y-3 text-xs sm:text-[13px] text-slate-700 font-medium mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Pick your key goal</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Agree on deliverables first</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Small-scope monthly or project option, subject to quote</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>No need to buy every service</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => openPricingModal("Starter Support (₹10,500 onwards*)")}
                  className="px-5 py-3 rounded-xl bg-[#254bdb] hover:bg-blue-700 text-white font-bold text-xs sm:text-[13px] inline-flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <span>Get starter pricing</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* Card 2: Growth support */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 flex flex-col justify-between transition hover:-translate-y-1">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#254bdb] block mb-2">
                  FOR ACTIVE CAMPAIGNS
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-3">
                  Growth support
                </h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">Custom</span>
                  <span className="text-xs font-semibold text-slate-500">quote</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 pb-5 border-b border-slate-100">
                  For businesses needing ongoing help across ads, search or social.
                </p>

                <ul className="space-y-3 text-xs sm:text-[13px] text-slate-700 font-medium mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Google or Meta Ads planning</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>SEO or content tasks</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Reviews, changes and reporting</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Fee based on workload</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => openPricingModal("Growth Support (Custom Ongoing Plan)")}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-xs sm:text-[13px] inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Build my plan</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* Card 3: Project-based */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 flex flex-col justify-between transition hover:-translate-y-1">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                  ONE-TIME WORK
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-3">
                  Project-based
                </h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">Custom</span>
                  <span className="text-xs font-semibold text-slate-500">quote</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 pb-5 border-b border-slate-100">
                  For a defined website, landing page, creative batch or video edit.
                </p>

                <ul className="space-y-3 text-xs sm:text-[13px] text-slate-700 font-medium mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Agree on scope & timeline</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Website or landing page design</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Graphic design or reel editing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#254bdb] shrink-0 mt-0.5" />
                    <span>Simple handover</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => openPricingModal("Project-Based (One-Time Scope)")}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-xs sm:text-[13px] inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Price my project</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

          </div>

          {/* Footnote Disclaimer */}
          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-7 max-w-5xl">
            * ₹10,500 is a proposed starting service fee for limited scope, not a fixed price for every service or guaranteed result. Billing period, exact work and applicable taxes are confirmed in your quote. Advertising budgets, domain, hosting, production expenses and external subscriptions are separate unless agreed.
          </p>
        </section>

        {/* SECTION 3: WHAT YOU PAY FOR. WHAT YOU OWN. */}
        <section className="py-16 bg-[#f4f7ff] border-y border-blue-100/80 mt-6 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-2">
                YOU SHOULD KNOW UP FRONT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                What you pay for. <span className="highlight-underline">What you own.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 01 */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/70 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#254bdb] text-white font-extrabold text-xs flex items-center justify-center mb-5">
                  01
                </div>
                <h3 className="text-lg font-extrabold text-slate-950 mb-2">
                  Service fee ≠ ad budget
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Google and Meta media spend is paid separately from our work. Your budget stays in your control.
                </p>
              </div>

              {/* Card 02 */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/70 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#254bdb] text-white font-extrabold text-xs flex items-center justify-center mb-5">
                  02
                </div>
                <h3 className="text-lg font-extrabold text-slate-950 mb-2">
                  Scope is written down
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Number of posts, campaigns, pages, revisions and reporting are discussed before you start.
                </p>
              </div>

              {/* Card 03 */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/70 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#254bdb] text-white font-extrabold text-xs flex items-center justify-center mb-5">
                  03
                </div>
                <h3 className="text-lg font-extrabold text-slate-950 mb-2">
                  Keep your accounts
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Your site, advertising accounts and brand assets should stay under your ownership.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: DARK BANNER ("Don't pay for things you don't need.") */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-left">
          <div className="bg-[#0b0f19] rounded-2xl px-7 py-7 sm:px-10 sm:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Don’t pay for things you don’t need.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Choose your service, share your goal and get a quote designed for your business.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openPricingModal("Custom Business Quote")}
              className="px-5 py-3 rounded-xl bg-[#d2ff00] hover:bg-lime-300 text-slate-950 font-extrabold text-xs sm:text-[13px] inline-flex items-center gap-1.5 shrink-0 transition shadow-sm cursor-pointer"
            >
              <span>Get full pricing for my needs</span>
              <span>↗</span>
            </button>
          </div>
        </section>

        {/* SECTION 5: PRICING FAQS ("Small print, made clear.") */}
        <section id="pricing-faq" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-left">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-blue-600 mb-2">
              <span className="w-2 h-2 rounded-sm bg-[#d2ff00] ring-2 ring-blue-600" />
              PRICING FAQS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Small print, made clear.
            </h2>
          </div>

          <div className="space-y-3">
            {pricingFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white">
                  <button
                    type="button"
                    className="w-full px-6 py-4 text-left flex items-center justify-between font-extrabold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.q}</span>
                    <Plus className={`w-4 h-4 text-[#254bdb] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-45" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive Pricing Quote Modal (Full Scope with Country Phone, Email, Service & Message) */}
        {pricingModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative text-left max-h-[92vh] overflow-y-auto">
              <button
                type="button"
                onClick={closePricingModal}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d2ff00] text-slate-950 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
                ⚡ Request Scope & Pricing
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-1">
                {modalPlanTitle}
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Share your requirement below and we will reply with a clear scope & quote.
              </p>

              <form onSubmit={handlePricingFormSubmit} className="space-y-3">
                {/* 1. NAME */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* 2. PHONE WITH COUNTRY DROPDOWN */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Phone Number (With Country) *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={modalForm.countryCode}
                      onChange={(e) => {
                        const found = PRICING_COUNTRY_CODES.find(c => c.code === e.target.value);
                        setModalForm({
                          ...modalForm,
                          countryCode: e.target.value,
                          countryName: found ? found.country : "International"
                        });
                      }}
                      className="w-[125px] shrink-0 px-2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600 bg-slate-50 cursor-pointer"
                    >
                      {PRICING_COUNTRY_CODES.map((c) => (
                        <option key={`${c.code}-${c.country}`} value={c.code}>
                          {c.flag} {c.code} ({c.country.split('/')[0].trim()})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={modalForm.phone}
                      onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value.replace(/[^0-9\s-]/g, "") })}
                      placeholder="e.g. 98765 43210"
                      className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* 3. DEDICATED WORK EMAIL */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={modalForm.email}
                    onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                    placeholder="e.g. vikram@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* 4. WHICH SERVICE(S) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Which service(s) do you need?</label>
                  <select
                    value={modalForm.service}
                    onChange={(e) => setModalForm({ ...modalForm, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 bg-white cursor-pointer"
                  >
                    <option>Google Ads (Search / Local Leads)</option>
                    <option>Meta Ads (Instagram & Facebook)</option>
                    <option>Website or Landing Page Design</option>
                    <option>SEO & Local Search</option>
                    <option>Social Media, Creatives or Reels</option>
                    <option>Full Growth Suite (Multiple Services)</option>
                  </select>
                </div>

                {/* 5. MESSAGE / REQUIREMENTS */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Your Message / Requirements</label>
                  <textarea
                    rows="2"
                    value={modalForm.message}
                    onChange={(e) => setModalForm({ ...modalForm, message: e.target.value })}
                    placeholder="Briefly describe your goals, budget or timeline..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                {modalSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                    Thank you! Your inquiry from {modalForm.countryName} has been received. Our team will contact you shortly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#254bdb] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-1"
                >
                  <span>{modalSubmitting ? "Submitting Inquiry..." : "Get My Custom Quote"}</span>
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


export default PricingPage;
