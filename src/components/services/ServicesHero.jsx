// @ts-nocheck
"use client";

import React from "react";
import { motion, useTransform, useSpring } from "framer-motion";
import { Layers } from "lucide-react";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp, blurFadeUp } from "@/utils/animations";

export default function ServicesHero() {
  // 🟢 1. Initialize Smooth Scroll tracking
  const { scrollY } = useSmoothScroll();

  // 🟢 2. Multi-Layer Parallax Physics
  // Background Layer: Drifts DOWN slowly to create depth
  const rawBgY = useTransform(scrollY, [0, 800], [0, 150]);
  const bgY = useSpring(rawBgY, { stiffness: 80, damping: 30 });

  // Text Layer: Drifts UP and fades OUT gracefully as user scrolls to the services grid
  const rawTextY = useTransform(scrollY, [0, 600], [0, -100]);
  const rawOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  
  const textY = useSpring(rawTextY, { stiffness: 90, damping: 30 });
  const opacity = useSpring(rawOpacity, { stiffness: 90, damping: 30 });

  return (
    <section className="relative w-full min-h-[65vh] flex flex-col justify-center items-center bg-background pt-32 pb-16 overflow-hidden selection:bg-primary/20 selection:text-secondary transform-gpu">
      
      {/* --- 🟢 Subtle Ambient Background --- */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none flex justify-center items-center -z-10 transform-gpu"
      >
        {/* Soft, breathing teal orb */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[700px] h-[500px] bg-gradient-to-b from-primary/15 to-transparent rounded-[100%] blur-[120px] -translate-y-20 transform-gpu"
        />
      </motion.div>

      {/* Premium Subliminal Grid Texture */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundSize: '40px 40px' }} 
      />

      {/* --- 🟢 Main Content Container --- */}
      <motion.div 
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center text-center transform-gpu"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full transform-gpu"
        >
          {/* Small Label */}
          <motion.div variants={fadeUp} className="mb-6 md:mb-8 transform-gpu">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-navy/10 text-navy font-heading text-xs font-bold shadow-sm uppercase tracking-[0.15em]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Our Services
            </div>
          </motion.div>

          {/* Headline with Advanced Blur Reveal */}
          <motion.h1 
            variants={blurFadeUp}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tighter leading-[1.05] mb-6 md:mb-8 max-w-3xl text-balance transform-gpu"
          >
            Growth Services Built to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Scale Your Revenue.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl lg:text-[1.35rem] text-navy/70 font-medium leading-relaxed max-w-2xl mb-10 md:mb-12 mx-auto text-balance transform-gpu"
          >
            We combine performance marketing, creative strategy, and data-driven execution to build systems that generate leads and drive real business growth.
          </motion.p>

          {/* Micro System Line */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2.5 px-5 py-2.5 bg-white border border-navy/10 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] text-navy/70 font-sans font-semibold text-sm md:text-base tracking-wide transform-gpu"
          >
            <Layers className="w-5 h-5 text-secondary" strokeWidth={2.5} />
            <p>Not just services. A complete growth system.</p>
          </motion.div>

        </motion.div>
      </motion.div>

      {/* Subtle Divider Line anchoring the Hero to the upcoming Grid */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-navy/10 to-transparent opacity-80" />
      
    </section>
  );
}