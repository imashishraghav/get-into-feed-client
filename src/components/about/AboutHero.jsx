"use client";

import React from "react";
import { motion, useTransform, useSpring } from "framer-motion";
import { ShieldCheck } from "lucide-react";

// 🟢 Import custom smooth scroll hook & animation variants
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { staggerContainer, fadeUp, blurFadeUp } from "../../utils/animations";

export default function AboutHero() {
  // 🟢 1. Initialize Smooth Scroll
  const { scrollY } = useSmoothScroll();

  // 🟢 2. Multi-Layer Parallax Physics (Stripe/Linear style)
  
  // Background Layer: Drifts DOWN slowly as user scrolls
  const rawBgY = useTransform(scrollY, [0, 800], [0, 150]);
  const bgY = useSpring(rawBgY, { stiffness: 80, damping: 30 });

  // Text Layer: Drifts UP and fades OUT gracefully for a seamless exit
  const rawTextY = useTransform(scrollY, [0, 600], [0, -100]);
  const rawOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  
  const textY = useSpring(rawTextY, { stiffness: 90, damping: 30 });
  const opacity = useSpring(rawOpacity, { stiffness: 90, damping: 30 });

  return (
    <section className="relative w-full bg-[#F8F9FB] py-20 md:py-32 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      
      {/* --- 🟢 Subtle Architectural Background (Moves Down) --- */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none flex justify-center items-center -z-10"
      >
        {/* Soft, breathing teal orb */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.25, 0.35, 0.25]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[600px] h-[400px] bg-gradient-to-b from-[#2ED1B2]/15 to-transparent rounded-[100%] blur-[120px] -translate-y-20"
        />
      </motion.div>

      {/* Premium Subliminal Grid Texture */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundSize: '40px 40px' }} 
      />

      {/* --- 🟢 Main Content Container (Moves Up + Fades Out) --- */}
      <motion.div 
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center text-center"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* Small Label */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] text-[#0F172A] text-xs font-bold shadow-sm uppercase tracking-[0.15em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2ED1B2] animate-pulse" />
              About Get Into Feed
            </div>
          </motion.div>

          {/* Headline with Advanced Blur Reveal */}
          <motion.h1 
            variants={blurFadeUp}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-[#0F172A] tracking-tighter leading-[1.05] mb-8 max-w-4xl"
          >
            We Build Systems That Drive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Real Growth.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl lg:text-2xl text-[#475569] font-medium leading-relaxed max-w-2xl mb-12 mx-auto"
          >
            We help brands move from inconsistent results to predictable growth by building structured, data-driven marketing systems.
          </motion.p>

          {/* Micro Trust Line */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2 text-[#475569] font-semibold text-sm md:text-base tracking-wide"
          >
            <ShieldCheck className="w-5 h-5 text-[#0EA5A4]" strokeWidth={2.5} />
            <p>No guesswork. Just systems that scale.</p>
          </motion.div>

        </motion.div>
      </motion.div>

      {/* Optional: Soft subtle divider at the very bottom of the viewport to anchor the section */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent opacity-60" />
      
    </section>
  );
}