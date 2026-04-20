"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { Target, Activity, TrendingUp, Zap } from "lucide-react";

// 🟢 Modular Premium Components (Inhi ke karan website high-end lagti hai)
import ResultsSection from "./ResultsSection";
import CaseStudyTestimonial from "./CaseStudyTestimonial";
import CaseStudyCTA from "./CaseStudyCTA";

// 🟢 Custom Hooks & Utils
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp, blurFadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// Fallback Data for UI Testing
// ----------------------------------------------------------------------
const mockData = {
  title: "Scaling Luxury Real Estate with High-Intent Lead Architecture",
  industry: "Real Estate",
  clientName: "Eldeco 7 Peaks",
  overview: "Eldeco 7 Peaks required a massive, predictable influx of qualified buyers for their new luxury project launch.",
  problem: [
    "High cost per acquisition (CPA) on existing generic campaigns.",
    "Low lead quality and high junk-lead ratio wasting the sales team's time."
  ],
  strategy: "We engineered a full-funnel performance marketing system.",
  execution: [
    "Overhauled SEO meta tags and deployed hyper-targeted Google Search campaigns.",
    "Designed and launched a luxury-themed landing page with zero friction points."
  ],
  results: [
    { label: "Surge in Qualified Inquiries", value: "+120%" },
    { label: "Drop in Cost Per Acquisition", value: "-40%" }
  ],
  testimonial: {
    quote: "The marketing systems built by the team completely transformed our lead pipeline.",
    name: "Rahul Verma",
    role: "Marketing Head",
  },
  images: [], 
  conclusion: [
    "Data-driven media buying outperforms massive budgets with poor targeting.",
    "A unified system (Ads + Landing Page) is the only way to scale predictably."
  ]
};

export default function CaseStudyClient({ data = mockData }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progressHeight = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <article ref={containerRef} className="relative w-full bg-white selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      
      {/* 🟢 Floating Reading Progress Bar */}
      <motion.div 
        style={{ scaleX: progressHeight }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] z-50 origin-left"
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full bg-[#F8F9FB] pt-32 pb-20 md:pt-40 md:pb-28 border-b border-[#E5E7EB] overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#2ED1B2]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-start">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full">
            
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-white px-3 py-1.5 rounded-md border border-[#E5E7EB] shadow-sm">
                {data?.industry || 'Digital Marketing'}
              </span>
              <span className="text-sm font-semibold text-[#475569]">
                Client: <span className="text-[#0F172A]">{data?.clientName || 'Partner'}</span>
              </span>
            </motion.div>

            <motion.h1 variants={blurFadeUp} className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-[#0F172A] tracking-tighter leading-[1.1] mb-8">
              {data?.title || 'Case Study'}
            </motion.h1>

            {/* Hero Key Result Highlight */}
            {data?.results && data.results.length > 0 && (
              <motion.div variants={fadeUp} className="inline-flex items-center gap-4 bg-white border border-[#E5E7EB] rounded-full p-2 pr-6 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#2ED1B2] flex items-center justify-center text-[#0F172A] shrink-0">
                  <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0F172A]">{data.results[0].value}</span>
                  <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider">{data.results[0].label}</span>
                </div>
              </motion.div>
            )}

          </motion.div>
        </div>
      </section>

      {/* ================= 2. CONTENT SECTIONS ================= */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 md:mt-24 flex flex-col gap-20 md:gap-32 mb-20 md:mb-32">
        
        {/* OVERVIEW */}
        {data?.overview && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#0EA5A4] uppercase mb-6 flex items-center gap-2">
              <Target className="w-4 h-4" /> Overview
            </h2>
            <p className="text-xl md:text-2xl text-[#0F172A] font-medium leading-relaxed">
              {data.overview}
            </p>
          </motion.section>
        )}

        {/* THE PROBLEM (Safely Mapped) */}
        {data?.problem && data.problem.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-8 tracking-tight">The Challenge</h2>
            <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-3xl p-8 md:p-12">
              <ul className="flex flex-col gap-6">
                {data.problem.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-lg text-[#475569] font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        )}

        {/* STRATEGY & EXECUTION (Safely Mapped) */}
        {(data?.strategy || (data?.execution && data.execution.length > 0)) && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-8 tracking-tight">Our Approach</h2>
            
            {data?.strategy && (
              <div className="prose prose-lg prose-slate max-w-none mb-12">
                <p className="text-[#475569] leading-relaxed">{data.strategy}</p>
              </div>
            )}
            
            {data?.execution && data.execution.length > 0 && (
              <div className="relative border-l-2 border-[#E5E7EB] ml-4 pl-8 flex flex-col gap-10">
                {data.execution.map((step, index) => (
                  <div key={index} className="relative">
                    <span className="absolute -left-[43px] top-0.5 w-6 h-6 rounded-full bg-white border-4 border-[#2ED1B2] flex items-center justify-center" />
                    <h3 className="text-sm font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Phase 0{index + 1}</h3>
                    <p className="text-lg text-[#0F172A] font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* VISUAL PROOF */}
        {data?.images && data.images.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-8 tracking-tight">Behind the Scenes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.images.map((imgUrl, i) => (
                <div key={i} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F8F9FB]">
                  <Image src={imgUrl} alt={`Proof ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ================= 3. MODULAR INJECTED SECTIONS ================= */}
      
      {/* 🚀 RESULTS SECTION (Using your custom component) */}
      {data?.results && data.results.length > 0 && (
        <ResultsSection results={data.results} />
      )}

      {/* 🗣 TESTIMONIAL SECTION (Using your custom component) */}
      {data?.testimonial && data.testimonial.quote && (
        <CaseStudyTestimonial testimonial={data.testimonial} />
      )}

      {/* 💡 KEY TAKEAWAYS (Safely Mapped) */}
      {data?.conclusion && data.conclusion.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 md:px-12 my-20 md:my-32">
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-8 tracking-tight">Key Takeaways</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.conclusion.map((point, i) => (
                <div key={i} className="flex items-start gap-4 bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-sm">
                  <Zap className="w-5 h-5 text-[#0EA5A4] shrink-0 mt-0.5" />
                  <p className="text-[#475569] font-medium leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      )}

      {/* 🔥 FINAL CTA (Using your custom component) */}
      <CaseStudyCTA />

    </article>
  );
}