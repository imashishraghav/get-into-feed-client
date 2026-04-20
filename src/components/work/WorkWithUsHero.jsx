"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { BriefcaseBusiness, Lock } from "lucide-react";

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

export default function WorkWithUsHero() {
  const containerRef = useRef(null);

  // 🟢 Smooth Scroll Initialization
  const { scrollY } = useSmoothScroll(); 

  // 🟢 Native Scroll Tracking for Parallax Depth
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Background Orb Parallax (Moves down to create depth)
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const springOrbY = useSpring(orbY, { stiffness: 80, damping: 30 });

  // Content Parallax (Moves up and fades out softly as user reads further)
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const springContentY = useSpring(contentY, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-[#F8F9FB] overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4] pt-28 pb-16"
    >
      {/* ================= BACKGROUND EFFECTS ================= */}
      {/* Soft Teal Glowing Orb (Calm & Premium) */}
      <motion.div 
        style={{ y: springOrbY }}
        className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-gradient-to-b from-[#2ED1B2]/10 to-transparent rounded-full blur-[100px] md:blur-[130px] pointer-events-none"
      />
      
      {/* Subtle Grid Texture for Agency/Tech Feel */}
      <div className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03]" style={{ backgroundSize: '32px 32px' }} />

      {/* ================= MAIN CONTENT ================= */}
      <motion.div 
        style={{ y: springContentY, opacity: contentOpacity }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center"
      >
        
        {/* 1. Selective Label */}
        <motion.div variants={fadeUp} className="mb-6 md:mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] text-[#0F172A] uppercase bg-white/60 backdrop-blur-sm border border-[#E5E7EB] px-4 py-2 rounded-full shadow-sm">
            <BriefcaseBusiness className="w-3.5 h-3.5 text-[#0EA5A4]" />
            Work With Us
          </span>
        </motion.div>

        {/* 2. Main Headline */}
        <motion.h1 
          variants={blurFadeUp}
          className="font-['Plus_Jakarta_Sans',sans-serif] text-5xl md:text-7xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-8"
        >
          Let’s Build Something That <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
            Actually Grows.
          </span>
        </motion.h1>

        {/* 3. Subheadline */}
        <motion.p 
          variants={fadeUp}
          className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed max-w-2xl mb-12"
        >
          We partner with businesses that are serious about scaling, generating leads, and building predictable growth systems.
        </motion.p>

        {/* 4. The "Filter" Micro Line */}
        <motion.div 
          variants={fadeUp}
          className="flex items-center justify-center gap-2.5 bg-slate-100/80 backdrop-blur-md border border-slate-200 px-6 py-3 rounded-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]"
        >
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            <Lock className="w-3 h-3 text-slate-500" />
          </div>
          <span className="font-['Inter',sans-serif] text-sm md:text-[15px] font-semibold text-[#475569]">
            We don’t work with everyone — only with those ready to grow.
          </span>
        </motion.div>

      </motion.div>
    </section>
  );
}