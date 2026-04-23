// @ts-nocheck
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
  useSmoothScroll(); // Removed unused scrollY to fix linter warning
  
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
      className="relative w-full min-h-[85vh] flex flex-col items-center justify-center bg-background overflow-hidden selection:bg-primary/20 selection:text-secondary pt-24 pb-12 transform-gpu"
    >
      {/* ================= BACKGROUND EFFECTS ================= */}
      <motion.div 
        style={{ y: springOrbY }}
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-b from-primary/15 to-transparent rounded-full blur-[100px] md:blur-[140px] pointer-events-none transform-gpu"
      />
      
      {/* Subtle Grid Pattern Overlay for Texture */}
      <div className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03]" style={{ backgroundSize: '32px 32px' }} />

      {/* ================= MAIN CONTENT ================= */}
      <motion.div 
        style={{ y: springContentY, opacity: contentOpacity }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center transform-gpu"
      >
        
        {/* 1. Small Label */}
        <motion.div variants={fadeUp} className="mb-6 transform-gpu">
          <span className="inline-block font-heading text-[11px] font-bold tracking-[0.25em] text-secondary uppercase bg-white/60 backdrop-blur-sm border border-primary/20 px-4 py-2 rounded-full shadow-sm">
            Pricing & Plans
          </span>
        </motion.div>

        {/* 2. Main Headline (Plus Jakarta Sans ensures a premium, geometric look) */}
        <motion.h1 
          variants={blurFadeUp}
          className="font-heading text-5xl md:text-7xl font-extrabold text-navy tracking-tight leading-[1.1] mb-8 text-balance transform-gpu"
        >
          Simple Pricing. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Real Growth.
          </span>
        </motion.h1>

        {/* 3. Subheadline (Inter font for highly readable body text) */}
        <motion.p 
          variants={fadeUp}
          className="font-sans text-lg md:text-xl text-navy/70 font-medium leading-relaxed max-w-2xl mb-12 text-balance transform-gpu"
        >
          Choose a plan designed to generate leads, scale revenue, and build a predictable growth system.
        </motion.p>

        {/* 4. Micro Trust Line */}
        <motion.div 
          variants={fadeUp}
          className="flex items-center justify-center gap-2 bg-white/50 backdrop-blur-md border border-navy/10 px-5 py-2.5 rounded-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transform-gpu"
        >
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="font-sans text-sm font-semibold text-navy/70">
            No hidden fees. No guesswork. Just performance.
          </span>
        </motion.div>

      </motion.div>
    </section>
  );
}