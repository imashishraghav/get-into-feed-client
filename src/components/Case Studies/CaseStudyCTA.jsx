"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp, blurFadeUp } from "@/utils/animations";

export default function CaseStudyCTA() {
  const containerRef = useRef(null);

  // 🟢 1. Global Smooth Scroll Hooks for Background Parallax
  const { scrollY } = useSmoothScroll();
  
  // Background Parallax: Soft glowing orbs drift down slowly for cinematic depth
  const rawBgY = useTransform(scrollY, [0, 5000], [0, 250]);
  const bgY = useSpring(rawBgY, { stiffness: 70, damping: 40 });

  // 🟢 2. Local Scroll for Content Lift (Magnetic Pull Effect)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Content lifts up smoothly as it enters the viewport
  const rawTextY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useSpring(rawTextY, { stiffness: 90, damping: 30 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#0F172A] py-24 md:py-32 overflow-hidden selection:bg-[#2ED1B2]/30 selection:text-white"
    >
      {/* --- 🟢 Premium Ambient Background Visuals --- */}
      
      {/* Subliminal Grid Pattern with Spotlight Mask */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-10 pointer-events-none z-0 invert" 
        style={{ 
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 80%)'
        }} 
      />

      {/* Floating Ambient Orbs */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center">
        {/* Soft Center Teal Glow */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[800px] h-[600px] bg-gradient-to-tr from-[#2ED1B2]/40 to-[#0EA5A4]/10 rounded-[100%] blur-[140px] mix-blend-screen"
        />
      </motion.div>

      {/* --- 🟢 Main Content Container (Centered Layout) --- */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: textY }}
          className="flex flex-col items-center w-full antialiased"
        >
          {/* Subtle Context Label */}
          <motion.div variants={fadeUp} className="mb-6 md:mb-8">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#2ED1B2] uppercase bg-[#2ED1B2]/10 border border-[#2ED1B2]/20 px-4 py-2 rounded-full shadow-sm">
              Next Steps
            </span>
          </motion.div>

          {/* Headline with Advanced Blur Reveal */}
          <motion.h2 
            variants={blurFadeUp}
            className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white tracking-tighter leading-[1.05] mb-6 drop-shadow-2xl"
          >
            Ready to Get{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] drop-shadow-none">
              Similar Results?
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mb-12"
          >
            Let’s build a system that generates leads, scales your campaigns, and drives real growth.
          </motion.p>

          {/* 🟢 Premium CTA Button */}
          <motion.div variants={fadeUp} className="w-full sm:w-auto">
            <Link href="/contact" className="block w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative group w-full sm:w-auto overflow-hidden bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] text-[#0F172A] font-bold text-lg md:text-[1.1rem] tracking-wide px-10 py-5 rounded-full flex items-center justify-center gap-3 shadow-[0_10px_40px_-10px_rgba(46,209,178,0.5)] hover:shadow-[0_20px_60px_-15px_rgba(46,209,178,0.7)] hover:ring-4 ring-[#2ED1B2]/30 transition-all duration-500 ease-out"
              >
                {/* --- Micro Interaction: Premium Shimmer Sweep --- */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                
                {/* --- Button Text --- */}
                <span className="relative z-10 drop-shadow-sm">Book Your Free Strategy Call</span>
                
                {/* --- Dual Arrow Animation --- */}
                <div className="relative z-10 flex items-center justify-center overflow-hidden w-5 h-5">
                  <ArrowRight className="absolute w-5 h-5 group-hover:translate-x-[150%] transition-transform duration-300 ease-in" />
                  <ArrowRight className="absolute w-5 h-5 -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-300 ease-out delay-75" />
                </div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Micro Trust Line */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2.5 mt-8 text-slate-400 font-semibold text-sm tracking-wide"
          >
            {/* Subtle Floating Animation on the Shield */}
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheck className="w-5 h-5 text-[#2ED1B2]" />
            </motion.div>
            <p>No pressure. Just clarity and growth.</p>
          </motion.div>

        </motion.div>
      </div>

    </section>
  );
}