import React, { useEffect } from "react";
import PageLayout from "../components/PageLayout.jsx";
import { CheckCircle2, ArrowRight, Phone, MessageSquare, Sparkles, ShieldCheck } from "lucide-react";

export default function ThankYouPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Thank You | Consultation Request Received — GetIntoFeed";

    // Set noindex, follow for conversion confirmation page
    let robotsMeta = document.querySelector('meta[name="robots"]');
    const originalRobots = robotsMeta ? robotsMeta.getAttribute("content") : "index, follow";
    if (robotsMeta) {
      robotsMeta.setAttribute("content", "noindex, follow");
    }

    return () => {
      if (robotsMeta) {
        robotsMeta.setAttribute("content", originalRobots);
      }
    };
  }, []);

  return (
    <PageLayout onNavigate={onNavigate} activeNav="contact" fullWidth={true}>
      <div className="w-full max-w-full overflow-x-hidden font-sans text-slate-900 bg-white antialiased selection:bg-[#d4ff00] selection:text-slate-950 min-h-[75vh] flex flex-col justify-center">
        {/* HERO CONFIRMATION SECTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 mb-6 shadow-inner animate-bounce-short">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultation Request Received</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 mb-4 font-space">
            Thank you! Your Growth Roadmap Is In Motion.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            We have received your campaign brief and contact details. A senior performance strategist is reviewing your digital presence and will connect with you within <strong>2 to 4 business hours</strong>.
          </p>

          {/* 3 STEP ROADMAP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-10 max-w-3xl mx-auto">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Step 01</span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Account & Funnel Audit</h3>
              <p className="text-xs text-slate-500 leading-relaxed">We inspect your current search presence, ad efficiency, and landing page conversion bottlenecks.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Step 02</span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Direct Strategy Call</h3>
              <p className="text-xs text-slate-500 leading-relaxed">A 20-minute discovery session with our strategist to align on CAC targets, sprint timeline, and KPIs.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-[#6366f1] uppercase tracking-wider block mb-1">Step 03</span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Transparent Sprint Proposal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">A defined, milestone-based execution plan with zero lock-in retainers or hidden agency markups.</p>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate && onNavigate("/work")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm transition shadow-lg cursor-pointer"
            >
              <span>Explore Proven Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/918810356950?text=Hi%20GetIntoFeed%20team,%20I%20just%20submitted%20a%20project%20brief%20on%20your%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Priority WhatsApp Message</span>
            </a>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP Act 2023 Compliant. Your business data and ad accounts remain 100% confidential.</span>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
