"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MessageSquareHeart } from "lucide-react";

// 🟢 Custom Hook (Lag-free smooth scroll integration)
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

// ----------------------------------------------------------------------
// Advanced Framer Motion Variants
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

export default function LetsTalkHero() {
  const containerRef = useRef(null);

  // 🟢 Smooth Scroll + Native Scroll Tracking for Parallax
  const { scrollY } = useSmoothScroll(); 
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 🟢 1. Background Orb Parallax (Moves down slightly to create depth)
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const springOrbY = useSpring(orbY, { stiffness: 80, damping: 30 });

  // 🟢 2. Content Parallax (Moves up and softly fades out)
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const springContentY = useSpring(contentY, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-[#F8F9FB] overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4] pt-28 pb-16"
    >
      {/* ================= BACKGROUND EFFECTS ================= */}
      {/* Soft Teal Glowing Orb */}
      <motion.div 
        style={{ y: springOrbY }}
        className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-gradient-to-b from-[#2ED1B2]/10 to-transparent rounded-full blur-[120px] pointer-events-none"
      />
      
      {/* Minimal Grid Texture for scale & structure */}
      <div className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03]" style={{ backgroundSize: '32px 32px' }} />

      {/* ================= MAIN CONTENT ================= */}
      <motion.div 
        style={{ y: springContentY, opacity: contentOpacity }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center"
      >
        
        {/* 1. Welcoming Label */}
        <motion.div variants={fadeUp} className="mb-6 md:mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] text-[#0EA5A4] uppercase bg-white/70 backdrop-blur-md border border-[#2ED1B2]/20 px-4 py-2 rounded-full shadow-sm">
            Let's Talk
          </span>
        </motion.div>

        {/* 2. Main Headline (Plus Jakarta Sans) */}
        <motion.h1 
          variants={blurFadeUp}
          className="font-['Plus_Jakarta_Sans',sans-serif] text-5xl md:text-7xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-8"
        >
          Let’s Build Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
            Growth System.
          </span>
        </motion.h1>

        {/* 3. Subheadline (Inter) */}
        <motion.p 
          variants={fadeUp}
          className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed max-w-2xl mb-12"
        >
          Tell us about your business and we’ll help you generate leads, scale your campaigns, and build predictable growth.
        </motion.p>

        {/* 4. Micro Trust Line (Lowers the barrier to entry) */}
        <motion.div 
          variants={fadeUp}
          className="flex items-center justify-center gap-2.5 bg-white/60 backdrop-blur-md border border-[#E5E7EB] px-6 py-3 rounded-full shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)]"
        >
          <div className="w-6 h-6 rounded-full bg-[#2ED1B2]/10 flex items-center justify-center shrink-0">
            <MessageSquareHeart className="w-3.5 h-3.5 text-[#0EA5A4]" />
          </div>
          <span className="font-['Inter',sans-serif] text-sm md:text-[15px] font-semibold text-[#475569]">
            No pressure. Just clarity and honest insights.
          </span>
        </motion.div>

      </motion.div>
    </section>
  );
}