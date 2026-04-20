// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { BookOpenText } from "lucide-react";

// 🟢 Custom Hook (Aapka lag-free smooth scroll)
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

export default function BlogHero() {
  const containerRef = useRef(null);

  // 🟢 Smooth Scroll Initialization
  const { scrollY } = useSmoothScroll(); 

  // 🟢 Native Scroll Tracking for Parallax Depth
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Background Orb Parallax (Moves slightly down)
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const springOrbY = useSpring(orbY, { stiffness: 80, damping: 30 });

  // Content Parallax (Moves up and fades out softly)
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const springContentY = useSpring(contentY, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-[#F8F9FB] overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4] pt-28 pb-16"
    >
      {/* ================= BACKGROUND EFFECTS ================= */}
      <motion.div 
        style={{ y: springOrbY }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-gradient-to-b from-[#2ED1B2]/10 to-transparent rounded-full blur-[100px] md:blur-[120px] pointer-events-none"
      />
      
      {/* Very Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03]" style={{ backgroundSize: '32px 32px' }} />

      {/* ================= MAIN CONTENT ================= */}
      <motion.div 
        style={{ y: springContentY, opacity: contentOpacity }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center gpu-accelerated"
      >
        
        {/* 1. Small Authority Label */}
        <motion.div variants={fadeUp} className="mb-6 md:mb-8">
          <span className="inline-block text-[11px] font-bold tracking-[0.25em] text-[#0EA5A4] uppercase bg-white/60 backdrop-blur-sm border border-[#2ED1B2]/20 px-4 py-2 rounded-full shadow-sm">
            Insights & Resources
          </span>
        </motion.div>

        {/* 2. Main Headline */}
        <motion.h1 
          variants={blurFadeUp}
          className="font-['Plus_Jakarta_Sans',sans-serif] text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-8 text-balance"
        >
          Insights That Drive <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
            Real Growth.
          </span>
        </motion.h1>

        {/* 3. Subheadline */}
        <motion.p 
          variants={fadeUp}
          className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed max-w-2xl mb-12 text-balance"
        >
          Learn how to generate leads, scale your campaigns, and build predictable growth systems.
        </motion.p>

        {/* 4. Micro Line (Establishes Content Quality) */}
        <motion.div 
          variants={fadeUp}
          className="flex items-center justify-center gap-2.5 bg-white/50 backdrop-blur-md border border-[#E5E7EB] px-5 py-2.5 rounded-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
        >
          <BookOpenText className="w-4 h-4 text-[#2ED1B2]" />
          <span className="font-['Inter',sans-serif] text-sm md:text-[15px] font-semibold text-[#475569]">
            No fluff. Just actionable insights.
          </span>
        </motion.div>

      </motion.div>
    </section>
  );
}