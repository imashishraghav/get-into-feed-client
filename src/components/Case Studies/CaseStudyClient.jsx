// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { Target, Activity, TrendingUp, Zap } from "lucide-react";

// 🟢 Modular Premium Components
import ResultsSection from "./ResultsSection";
import CaseStudyTestimonial from "./CaseStudyTestimonial";
import CaseStudyCTA from "./CaseStudyCTA";

// 🟢 Custom Hooks & Utils
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp, blurFadeUp } from "@/utils/animations";

export default function CaseStudyClient({ data }) {
  const containerRef = useRef(null);
  
  // 🟢 Smooth Scroll Hook
  useSmoothScroll();

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progressHeight = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Safety check: Agar data load nahi hua toh kuch mat dikhao
  if (!data) return null;

  return (
    <article ref={containerRef} className="relative w-full bg-white selection:bg-primary/20 selection:text-secondary transform-gpu">
      
      {/* 🟢 Floating Reading Progress Bar */}
      <motion.div 
        style={{ scaleX: progressHeight }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-50 origin-left transform-gpu"
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full bg-background pt-32 pb-20 md:pt-40 md:pb-28 border-b border-navy/10 overflow-hidden transform-gpu">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none transform-gpu" />
        
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-start">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full transform-gpu">
            
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-8">
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-secondary uppercase bg-white px-3 py-1.5 rounded-md border border-navy/10 shadow-sm">
                {data.industry || 'Digital Marketing'}
              </span>
              <span className="font-sans text-sm font-semibold text-navy/70">
                Client: <span className="text-navy">{data.clientName || 'Partner'}</span>
              </span>
            </motion.div>

            <motion.h1 variants={blurFadeUp} className="font-heading text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-navy tracking-tighter leading-[1.1] mb-8 text-balance">
              {data.title || 'Case Study'}
            </motion.h1>

            {/* Hero Key Result Highlight */}
            {data.results && data.results.length > 0 && (
              <motion.div variants={fadeUp} className="inline-flex items-center gap-4 bg-white border border-navy/10 rounded-full p-2 pr-6 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-navy shrink-0">
                  <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-sm font-bold text-navy">{data.results[0].value}</span>
                  <span className="font-sans text-[11px] font-semibold text-navy/70 uppercase tracking-wider">{data.results[0].label}</span>
                </div>
              </motion.div>
            )}

          </motion.div>
        </div>
      </section>

      {/* ================= 2. CONTENT SECTIONS ================= */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-16 md:mt-24 flex flex-col gap-20 md:gap-32 mb-20 md:mb-32">
        
        {/* OVERVIEW */}
        {data.overview && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="transform-gpu">
            <h2 className="font-heading text-sm font-bold tracking-[0.2em] text-secondary uppercase mb-6 flex items-center gap-2">
              <Target className="w-4 h-4" /> Overview
            </h2>
            <p className="font-sans text-xl md:text-2xl text-navy font-medium leading-relaxed">
              {data.overview}
            </p>
          </motion.section>
        )}

        {/* THE PROBLEM */}
        {data.problem && data.problem.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="transform-gpu">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-8 tracking-tight">The Challenge</h2>
            <div className="bg-background border border-navy/10 rounded-3xl p-8 md:p-12">
              <ul className="flex flex-col gap-6">
                {data.problem.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="font-sans text-lg text-navy/70 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        )}

        {/* STRATEGY & EXECUTION */}
        {(data.strategy || (data.execution && data.execution.length > 0)) && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="transform-gpu">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-8 tracking-tight">Our Approach</h2>
            
            {data.strategy && (
              <div className="prose prose-lg prose-slate max-w-none mb-12">
                <p className="font-sans text-navy/70 leading-relaxed">{data.strategy}</p>
              </div>
            )}
            
            {data.execution && data.execution.length > 0 && (
              <div className="relative border-l-2 border-navy/10 ml-4 pl-8 flex flex-col gap-10">
                {data.execution.map((step, index) => (
                  <div key={index} className="relative">
                    <span className="absolute -left-[43px] top-0.5 w-6 h-6 rounded-full bg-white border-4 border-primary flex items-center justify-center" />
                    <h3 className="font-heading text-sm font-bold text-navy/50 uppercase tracking-wider mb-2">Phase 0{index + 1}</h3>
                    <p className="font-sans text-lg text-navy font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* VISUAL PROOF */}
        {data.images && data.images.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="transform-gpu">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-8 tracking-tight">Behind the Scenes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.images.map((imgUrl, i) => (
                <div key={i} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-navy/10 bg-background">
                  <Image src={imgUrl} alt={`Proof ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ================= 3. MODULAR INJECTED SECTIONS ================= */}
      
      {/* 🚀 RESULTS SECTION */}
      {data.results && data.results.length > 0 && (
        <ResultsSection results={data.results} />
      )}

      {/* 🗣 TESTIMONIAL SECTION */}
      {data.testimonial && data.testimonial.quote && (
        <CaseStudyTestimonial testimonial={data.testimonial} />
      )}

      {/* 💡 KEY TAKEAWAYS */}
      {data.conclusion && data.conclusion.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 md:px-12 my-20 md:my-32">
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="transform-gpu">
            <h2 className="font-heading text-3xl font-extrabold text-navy mb-8 tracking-tight">Key Takeaways</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.conclusion.map((point, i) => (
                <div key={i} className="flex items-start gap-4 bg-white border border-navy/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Zap className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <p className="font-sans text-navy/70 font-medium leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      )}

      {/* 🔥 FINAL CTA */}
      <CaseStudyCTA />

    </article>
  );
}