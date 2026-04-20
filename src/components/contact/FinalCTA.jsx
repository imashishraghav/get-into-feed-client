"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

// 🟢 Custom Hook (Lag-free smooth scroll integration)
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

// ----------------------------------------------------------------------
// Advanced Framer Motion Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

const blurFadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

export default function FinalCTA() {
  const containerRef = useRef(null);

  // 🟢 Smooth Scroll tracking context
  const { scrollY } = useSmoothScroll(); 

  // 🟢 Localized Scroll Tracking for Parallax Background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], 
  });

  // Smooth spring parallax for the background glow
  const glowY = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const springGlowY = useSpring(glowY, { stiffness: 80, damping: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[#0F172A] py-28 md:py-32 overflow-hidden selection:bg-[#2ED1B2]/30 selection:text-white"
    >
      {/* ================= 1. BACKGROUND EFFECTS ================= */}
      <motion.div 
        style={{ y: springGlowY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-gradient-to-br from-[#2ED1B2]/20 to-[#0EA5A4]/5 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"
      />
      
      {/* SVG Noise Texture for Premium Matte Finish */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* ================= 2. MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center w-full"
        >
          
          {/* Headline */}
          <motion.h2 
            variants={blurFadeUp}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6"
          >
            Let’s Start Building Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Growth System
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p 
            variants={fadeUp}
            className="font-['Inter',sans-serif] text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mb-10"
          >
            Fill out the form and let’s create a strategy that drives real results for your business.
          </motion.p>

          {/* CTA Button (Scrolls back up to the form smoothly) */}
          <motion.div variants={fadeUp} className="relative mb-8 w-full sm:w-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] rounded-2xl blur-xl opacity-30 scale-95" />
            
            <Link href="#contact-form" className="relative block focus:outline-none scroll-smooth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] text-[#0F172A] px-8 py-5 rounded-2xl font-bold text-lg tracking-wide shadow-lg overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
                
                <span className="relative z-10 font-['Plus_Jakarta_Sans',sans-serif]">Submit & Book Strategy Call</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Micro Trust Line */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2 text-slate-400 opacity-90"
          >
            <ShieldCheck className="w-4 h-4 text-[#2ED1B2]" />
            <span className="font-['Inter',sans-serif] text-sm font-medium">
              No pressure. Just clarity and honest insights.
            </span>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}