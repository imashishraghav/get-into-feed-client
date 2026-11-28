import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import PageLayout from "../components/PageLayout.jsx";
import { PRICING_COUNTRY_CODES } from "../data/countryCodes.js";
import { enrichWithAttribution } from "../utils/utm.js";

export function AboutUsPage({ onNavigate }) {
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamModalHeading, setTeamModalHeading] = useState("Talk to our team");
  const [teamForm, setTeamForm] = useState({
    name: "",
    countryCode: "+91",
    countryName: "India",
    phone: "",
    email: "",
    message: ""
  });
  const [teamSubmitting, setTeamSubmitting] = useState(false);
  const [teamSuccess, setTeamSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Us — GetIntoFeed Digital Marketing";
  }, []);

  const openTeamModal = (title = "Talk to our team") => {
    setTeamModalHeading(title);
    setTeamSuccess(false);
    setTeamModalOpen(true);
  };

  const closeTeamModal = () => {
    setTeamModalOpen(false);
    setTeamSuccess(false);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.phone || !teamForm.email) {
      alert("Please enter your name, phone number, and email address.");
      return;
    }

    setTeamSubmitting(true);
    const fullPhone = `${teamForm.countryCode} ${teamForm.phone.trim()}`;
    const fullMessage = teamForm.message.trim()
      ? `[Country: ${teamForm.countryName} (${teamForm.countryCode})] [Inquiry: ${teamModalHeading}] Requirements: ${teamForm.message.trim()}`
      : `[Country: ${teamForm.countryName} (${teamForm.countryCode})] [Inquiry: ${teamModalHeading}]`;

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichWithAttribution({
          name: teamForm.name.trim(),
          email: teamForm.email.trim(),
          phone: fullPhone,
          whatsapp: fullPhone,
          company: null,
          city: teamForm.countryName,
          service: "Founder & Team Consultation",
          interested_service: "Founder & Team Consultation",
          message: fullMessage,
          source: `About Us Page Modal (${teamForm.countryName})`,
          form_type: `About Us Page Modal (${teamForm.countryName})`,
          consent: true
        }))
      });
    } catch (err) {
      console.error("Team lead submission error:", err);
    }

    setTeamSubmitting(false);
    setTeamSuccess(true);
    setTimeout(() => {
      setTeamModalOpen(false);
      setTeamSuccess(false);
      setTeamForm({
        name: "",
        countryCode: "+91",
        countryName: "India",
        phone: "",
        email: "",
        message: ""
      });
    }, 2200);
  };

  return (
    <PageLayout
      onNavigate={onNavigate}
      activeNav="about"
      fullWidth={true}
    >
      <div className="w-full font-sans text-slate-900 bg-white antialiased selection:bg-[#d2ff00] selection:text-slate-950 pb-12">
        
        {/* HERO SECTION (Exact Image 1 Style with Geometric Ring & Asterisk) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <div className="about-hero-bg rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-slate-800/90 min-h-[290px] flex items-center">
            
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
                ABOUT GETINTOFEED
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-[-0.035em] leading-[1.08] text-white">
                Small team. Fresh ideas. <br className="hidden sm:inline" />
                <span className="text-[#d4ff00]">Serious about your online presence.</span>
              </h1>

              <p className="text-[#d4dcf0] text-[14.5px] sm:text-[15px] leading-[1.55] max-w-xl font-normal pt-1">
                Meet the independent people behind GetIntoFeed—your new digital marketing partner, working remotely across Delhi NCR.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: MEET YOUR TEAM ("Real people behind the work.") */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1.5">
                MEET YOUR TEAM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                Real people behind the work.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Three people, three areas of expertise. Meet the specialists you will work with.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openTeamModal("Talk to our team")}
              className="px-5 py-2.5 rounded-xl bg-[#254bdb] hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shrink-0 transition shadow-sm self-start sm:self-auto cursor-pointer"
            >
              <span>Talk to our team</span>
              <span>↗</span>
            </button>
          </div>

          {/* 3 Team Member Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Member 1: Sumit Mishra */}
            <div className="bg-[#f4f7ff] rounded-2xl p-4 sm:p-5 border border-blue-100/90 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition duration-200">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-white shadow-sm relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                  alt="Sumit Mishra"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="96"
                  height="112"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold text-slate-950 truncate">
                  Sumit Mishra
                </h3>
                <p className="text-[11px] font-bold text-blue-600 mb-3 leading-snug">
                  Co-Founder & Content Strategist
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">Website content</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">SEO writing</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">Brand messaging</span>
                </div>
              </div>
            </div>

            {/* Member 2: Ashish Raghav */}
            <div className="bg-[#f4f7ff] rounded-2xl p-4 sm:p-5 border border-blue-100/90 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition duration-200">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-b from-blue-600 to-slate-900 shrink-0 flex flex-col items-center justify-end relative border border-white shadow-sm">
                <div className="w-8 h-8 rounded-full bg-white/30 mb-1" />
                <div className="w-16 h-10 rounded-t-full bg-white/25" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold text-slate-950 truncate">
                  Ashish Raghav
                </h3>
                <p className="text-[11px] font-bold text-blue-600 mb-3 leading-snug">
                  Co-Founder · Ads Specialist & Web Designer
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">Google & Meta Ads</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">Web design</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">Landing pages</span>
                </div>
              </div>
            </div>

            {/* Member 3: Shubham Mishra */}
            <div className="bg-[#f4fbf7] rounded-2xl p-4 sm:p-5 border border-emerald-100/90 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition duration-200">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-b from-[#a3e635] to-emerald-900 shrink-0 flex flex-col items-center justify-end relative border border-white shadow-sm">
                <div className="w-8 h-8 rounded-full bg-white/35 mb-1" />
                <div className="w-16 h-10 rounded-t-full bg-white/30" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold text-slate-950 truncate">
                  Shubham Mishra
                </h3>
                <p className="text-[11px] font-bold text-emerald-700 mb-3 leading-snug">
                  Social Media Growth Expert
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">Social strategy</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">Content planning</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-bold text-slate-700">Profile growth</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: OUR CORE VALUES / WHY SMBS TRUST US */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-blue-600 mb-2">
              <span className="w-2 h-2 rounded-sm bg-[#d2ff00] ring-2 ring-blue-600" />
              OUR CORE VALUES
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">
              Why SMBs & Founders trust us.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Three clear principles that guide every ad campaign, piece of website content, and growth roadmap we build.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Value 1: Direct Founder Involvement */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/85 shadow-sm hover:shadow-md hover:border-blue-200 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#254bdb] font-extrabold text-sm flex items-center justify-center mb-4 border border-blue-100">
                01
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-950 mb-2">
                Direct Founder Involvement
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You work directly with Sumit, Ashish & Shubham. No junior interns handling your marketing budget or account managers who don’t understand the actual work.
              </p>
            </div>

            {/* Value 2: 100% Account & Asset Ownership */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/85 shadow-sm hover:shadow-md hover:border-lime-300 transition">
              <div className="w-10 h-10 rounded-xl bg-[#f7fee7] text-lime-800 font-extrabold text-sm flex items-center justify-center mb-4 border border-lime-300/80">
                02
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-950 mb-2">
                100% Account & Asset Ownership
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your Google Ads accounts, Meta pixels, website code, and creative assets remain completely in your hands. Zero lock-in contracts and zero hostage situations.
              </p>
            </div>

            {/* Value 3: Metrics That Feed Your Bank */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/85 shadow-sm hover:shadow-md hover:border-purple-200 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-extrabold text-sm flex items-center justify-center mb-4 border border-purple-100">
                03
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-950 mb-2">
                Metrics That Feed Your Bank
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vanity impressions don’t pay salaries. We focus strictly on qualified inquiries, lower customer acquisition costs (CPA), high conversion rates, and real revenue.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: WHO WE ARE + STICKY SIDEBAR ("We're building our name by doing the work right.") */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column: Story, Expectations & Location (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Who We Are Intro */}
              <div className="space-y-3.5">
                <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                  <span className="w-2 h-2 rounded-sm bg-[#d2ff00] ring-2 ring-blue-600" />
                  WHO WE ARE
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                  We're building our name by doing the work right.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  GetIntoFeed is an independent digital marketing team serving businesses across Delhi NCR. We work from our own spaces, coordinate online and focus on useful services such as Google Ads, SEO, social media content and website design.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We are building our name from the beginning. We would rather be clear about the work, the budget and who handles it than use big agency-style claims.
                </p>
              </div>

              {/* What you can expect */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-4">
                  What you can expect
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span><strong className="text-slate-950">Clear communication:</strong> We explain what we are doing and why.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span><strong className="text-slate-950">Smaller starting points:</strong> A specific problem does not always need a full monthly package.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span><strong className="text-slate-950">Clear ownership:</strong> Your ad accounts, websites and business assets should remain under your control.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span><strong className="text-slate-950">Simple updates:</strong> Useful observations and next steps instead of complicated promises.</span>
                  </li>
                </ul>
              </div>

              {/* Where we work */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-2">
                  Where we work
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We work remotely and are open to projects from Delhi, Noida, Gurugram, Ghaziabad, Faridabad and other locations. We do not list an office or walk-in address because we do not operate one.
                </p>
              </div>

            </div>

            {/* Right Column: "Small team, fewer layers." Callout Box (5 Cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-8">
              <div className="bg-[#f4f7ff] rounded-3xl p-7 sm:p-8 border border-blue-100 shadow-sm space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  OUR APPROACH
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                  Small team, fewer layers.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  If you have a question, it should reach someone who understands the actual work. That is the kind of service we want to build.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => openTeamModal("Say hello to the team")}
                    className="px-5 py-3 rounded-xl bg-[#d2ff00] hover:bg-lime-300 text-slate-950 font-extrabold text-xs inline-flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <span>Say hello</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: HOW WE WORK ("No mystery process.") */}
        <section className="py-16 bg-[#f4f7ff] border-y border-blue-100/80 mt-4 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-blue-600 mb-2">
                <span className="w-2 h-2 rounded-sm bg-[#d2ff00] ring-2 ring-blue-600" />
                HOW WE WORK
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                No mystery process.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 01 */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center mb-5">
                  01
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 mb-2">
                  Tell us the problem
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A few details about your offer, audience and budget help us understand what you need.
                </p>
              </div>

              {/* Step 02 */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center mb-5">
                  02
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 mb-2">
                  Agree on the work
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We decide on the scope, fee, timeline and what you will receive before starting.
                </p>
              </div>

              {/* Step 03 */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center mb-5">
                  03
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 mb-2">
                  Stay in the loop
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  You can review the work and discuss improvements without a chain of account managers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: BOTTOM LIME GREEN CTA BANNER */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-left">
          <div className="rounded-3xl bg-gradient-to-r from-[#d2ff00] via-[#d8ff29] to-[#b8f542] px-7 py-8 sm:px-12 sm:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-lime-400">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Need a freelancer team, not a big pitch?
              </h2>
              <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1">
                Tell us what you are working on and what help would be useful.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openTeamModal("Talk about your project")}
              className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shrink-0 transition shadow-sm cursor-pointer"
            >
              <span>Talk about your project</span>
              <span>↗</span>
            </button>
          </div>
        </section>

        {/* Interactive Team Contact Modal (Full Scope with Country Phone, Email & Message) */}
        {teamModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative text-left max-h-[92vh] overflow-y-auto">
              <button
                type="button"
                onClick={closeTeamModal}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d2ff00] text-slate-950 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
                👋 Direct Team Message
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-1">
                {teamModalHeading}
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Your message goes straight to Sumit, Ashish & Shubham—no sales middlemen.
              </p>

              <form onSubmit={handleTeamSubmit} className="space-y-3">
                {/* 1. NAME */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    placeholder="e.g. Neha Gupta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* 2. PHONE WITH COUNTRY DROPDOWN */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Phone / WhatsApp Number (With Country) *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={teamForm.countryCode}
                      onChange={(e) => {
                        const found = PRICING_COUNTRY_CODES.find(c => c.code === e.target.value);
                        setTeamForm({
                          ...teamForm,
                          countryCode: e.target.value,
                          countryName: found ? found.country : "International"
                        });
                      }}
                      className="w-[125px] shrink-0 px-2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600 bg-slate-50 cursor-pointer"
                    >
                      {PRICING_COUNTRY_CODES.map((c) => (
                        <option key={`about-${c.code}-${c.country}`} value={c.code}>
                          {c.flag} {c.code} ({c.country.split('/')[0].trim()})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={teamForm.phone}
                      onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value.replace(/[^0-9\s-]/g, "") })}
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
                    value={teamForm.email}
                    onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                    placeholder="e.g. neha@brand.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* 4. MESSAGE / PROJECT DETAILS */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">What are you working on? *</label>
                  <textarea
                    rows="2"
                    required
                    value={teamForm.message}
                    onChange={(e) => setTeamForm({ ...teamForm, message: e.target.value })}
                    placeholder="e.g. Need help with Google Ads and website content for our clinic..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                {teamSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                    Thank you! Your message from {teamForm.countryName} has been received. Our team will contact you shortly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={teamSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#254bdb] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 mt-1"
                >
                  <span>{teamSubmitting ? "Sending Message..." : "Send Message"}</span>
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





// =========================================================================
// SERVICES HUB PAGE (/services) - USER-FRIENDLY & MOBILE-FRIENDLY NODE FRONTEND
// =========================================================================

export default AboutUsPage;
