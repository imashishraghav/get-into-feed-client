"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShieldCheck } from "lucide-react";

// 🟢 Custom Hook (Aapka banaya hua lag-free smooth scroll)
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

// ----------------------------------------------------------------------
// Advanced Framer Motion Variants (Blur Reveal & Fade Ups)
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  },
};

const blurFadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

export default function PricingHero() {
  const containerRef = useRef(null);

  // 🟢 Custom Smooth Scroll + Native Scroll Tracking for Parallax
  const { scrollY } = useSmoothScroll(); 
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 🟢 1. Background Orb Parallax (Moves slightly down on scroll)
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const springOrbY = useSpring(orbY, { stiffness: 80, damping: 30 });

  // 🟢 2. Content Parallax (Moves up and fades out gently)
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const springContentY = useSpring(contentY, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[85vh] flex flex-col items-center justify-center bg-[#F8F9FB] overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4] pt-24 pb-12"
    >
      {/* ================= BACKGROUND EFFECTS ================= */}
      <motion.div 
        style={{ y: springOrbY }}
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-b from-[#2ED1B2]/15 to-transparent rounded-full blur-[100px] md:blur-[140px] pointer-events-none"
      />
      
      {/* Subtle Grid Pattern Overlay for Texture */}
      <div className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03]" style={{ backgroundSize: '32px 32px' }} />

      {/* ================= MAIN CONTENT ================= */}
      <motion.div 
        style={{ y: springContentY, opacity: contentOpacity }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center"
      >
        
        {/* 1. Small Label */}
        <motion.div variants={fadeUp} className="mb-6">
          <span className="inline-block text-[11px] font-bold tracking-[0.25em] text-[#0EA5A4] uppercase bg-white/60 backdrop-blur-sm border border-[#2ED1B2]/20 px-4 py-2 rounded-full shadow-sm">
            Pricing & Plans
          </span>
        </motion.div>

        {/* 2. Main Headline (Plus Jakarta Sans ensures a premium, geometric look) */}
        <motion.h1 
          variants={blurFadeUp}
          className="font-['Plus_Jakarta_Sans',sans-serif] text-5xl md:text-7xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-8"
        >
          Simple Pricing. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
            Real Growth.
          </span>
        </motion.h1>

        {/* 3. Subheadline (Inter font for highly readable body text) */}
        <motion.p 
          variants={fadeUp}
          className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed max-w-2xl mb-12"
        >
          Choose a plan designed to generate leads, scale revenue, and build a predictable growth system.
        </motion.p>

        {/* 4. Micro Trust Line */}
        <motion.div 
          variants={fadeUp}
          className="flex items-center justify-center gap-2 bg-white/50 backdrop-blur-md border border-[#E5E7EB] px-5 py-2.5 rounded-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
        >
          <ShieldCheck className="w-4 h-4 text-[#2ED1B2]" />
          <span className="font-['Inter',sans-serif] text-sm font-semibold text-[#475569]">
            No hidden fees. No guesswork. Just performance.
          </span>
        </motion.div>

      </motion.div>
    </section>
  );
}