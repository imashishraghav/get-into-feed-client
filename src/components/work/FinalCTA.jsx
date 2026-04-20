"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
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

  // 🟢 Smooth Scroll Initialization
  const { scrollY } = useSmoothScroll(); 

  // 🟢 Localized Scroll Tracking for Parallax Background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], 
  });

  // Soft parallax movement for the glowing background orb
  const glowY = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const springGlowY = useSpring(glowY, { stiffness: 80, damping: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[#0F172A] py-28 md:py-36 overflow-hidden selection:bg-[#2ED1B2]/30 selection:text-white"
    >
      {/* ================= 1. BACKGROUND EFFECTS ================= */}
      {/* Dynamic Parallax Orb */}
      <motion.div 
        style={{ y: springGlowY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-[#2ED1B2]/15 to-[#0EA5A4]/5 rounded-full blur-[100px] md:blur-[130px] pointer-events-none"
      />
      
      {/* 2D Noise/Grain Overlay for International Standard Matte Finish */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* ================= 2. MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
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
            className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] mb-6"
          >
            Ready to Build <br className="hidden md:block" />
            Something That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">Scales?</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p 
            variants={fadeUp}
            className="font-['Inter',sans-serif] text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mb-12"
          >
            If you're serious about growth, let’s build a system that generates leads and drives real results.
          </motion.p>

          {/* CTA Button (Scrolls back up to the form smoothly) */}
          <motion.div variants={fadeUp} className="relative mb-8 w-full sm:w-auto">
            {/* Soft Teal Glow under button */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] rounded-2xl blur-xl opacity-30 scale-95" />
            
            <Link href="#apply" className="relative block focus:outline-none scroll-smooth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] text-[#0F172A] px-8 py-5 rounded-2xl font-bold text-lg tracking-wide shadow-lg overflow-hidden"
              >
                {/* Glassmorphism Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
                
                <span className="relative z-10 font-['Plus_Jakarta_Sans',sans-serif]">Apply to Work With Us</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Micro Exclusivity Line */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2.5 text-slate-400 opacity-90 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-sm"
          >
            <Lock className="w-3.5 h-3.5 text-[#2ED1B2]" />
            <span className="font-['Inter',sans-serif] text-sm font-medium tracking-wide">
              We work with a limited number of clients each month.
            </span>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}