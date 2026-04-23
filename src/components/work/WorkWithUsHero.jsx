// @ts-nocheck
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

  // 🟢 Smooth Scroll Initialization (Fixed unused scrollY warning)
  useSmoothScroll(); 

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
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-background overflow-hidden selection:bg-primary/20 selection:text-secondary pt-28 pb-16 transform-gpu"
    >
      {/* ================= BACKGROUND EFFECTS ================= */}
      {/* Soft Teal Glowing Orb (Calm & Premium) */}
      <motion.div 
        style={{ y: springOrbY }}
        className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-[100px] md:blur-[130px] pointer-events-none transform-gpu"
      />
      
      {/* Subtle Grid Texture for Agency/Tech Feel */}
      <div className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03]" style={{ backgroundSize: '32px 32px' }} />

      {/* ================= MAIN CONTENT ================= */}
      <motion.div 
        style={{ y: springContentY, opacity: contentOpacity }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center transform-gpu"
      >
        
        {/* 1. Selective Label */}
        <motion.div variants={fadeUp} className="mb-6 md:mb-8 transform-gpu">
          <span className="inline-flex items-center gap-2 font-heading text-[11px] font-bold tracking-[0.25em] text-navy uppercase bg-white/60 backdrop-blur-sm border border-navy/10 px-4 py-2 rounded-full shadow-sm">
            <BriefcaseBusiness className="w-3.5 h-3.5 text-secondary" />
            Work With Us
          </span>
        </motion.div>

        {/* 2. Main Headline */}
        <motion.h1 
          variants={blurFadeUp}
          className="font-heading text-5xl md:text-7xl font-extrabold text-navy tracking-tight leading-[1.1] mb-8 text-balance transform-gpu"
        >
          Let’s Build Something That <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Actually Grows.
          </span>
        </motion.h1>

        {/* 3. Subheadline */}
        <motion.p 
          variants={fadeUp}
          className="font-sans text-lg md:text-xl text-navy/70 font-medium leading-relaxed max-w-2xl mb-12 text-balance transform-gpu"
        >
          We partner with businesses that are serious about scaling, generating leads, and building predictable growth systems.
        </motion.p>

        {/* 4. The "Filter" Micro Line */}
        <motion.div 
          variants={fadeUp}
          className="flex items-center justify-center gap-2.5 bg-background/80 backdrop-blur-md border border-navy/5 px-6 py-3 rounded-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transform-gpu"
        >
          <div className="w-6 h-6 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
            <Lock className="w-3 h-3 text-navy/50" />
          </div>
          <span className="font-sans text-sm md:text-[15px] font-semibold text-navy/70">
            We don’t work with everyone — only with those ready to grow.
          </span>
        </motion.div>

      </motion.div>
    </section>
  );
}