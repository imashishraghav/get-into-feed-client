// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

// 🟢 Custom Hook Import
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

  // 🟢 Smooth Scroll Initialization (Removed unused scrollY to fix linter warning)
  useSmoothScroll(); 

  // 🟢 Localized Scroll Tracking for Parallax Background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], // Trigger tracking when section enters viewport
  });

  // Parallax calculations for the glowing orb
  const glowY = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const springGlowY = useSpring(glowY, { stiffness: 80, damping: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-navy py-32 md:py-48 overflow-hidden selection:bg-primary/30 selection:text-white transform-gpu"
    >
      {/* ================= 1. BACKGROUND EFFECTS ================= */}
      {/* Deep Teal Glow Parallax */}
      <motion.div 
        style={{ y: springGlowY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-primary/20 to-secondary/5 rounded-full blur-[120px] pointer-events-none transform-gpu"
      />
      
      {/* Subtle Noise / Grain Overlay for Premium Dark Texture */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('/noise.png')] pointer-events-none" />

      {/* ================= 2. MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center w-full transform-gpu"
        >
          
          {/* Headline */}
          <motion.h2 
            variants={blurFadeUp}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 md:mb-8 text-balance"
          >
            Ready to Dominate <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              the Feed?
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl lg:text-2xl text-white/70 font-medium leading-relaxed max-w-2xl mb-12 text-balance"
          >
            Let’s build a system that generates leads, scales your business, and drives real growth.
          </motion.p>

          {/* CTA Button Wrapper */}
          <motion.div variants={fadeUp} className="relative mb-8 w-full sm:w-auto transform-gpu">
            {/* Button Glow Layer (Pulses on Hover) */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-40 scale-90" />
            
            <Link href="/contact" className="relative block focus:outline-none">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary text-navy px-10 py-5 md:py-6 rounded-full font-bold font-heading text-lg md:text-xl tracking-wide shadow-[0_0_40px_-10px_rgba(46,209,178,0.5)] overflow-hidden transform-gpu"
              >
                {/* Shine effect inside button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
                
                <span className="relative z-10">Book Your Free Strategy Call</span>
                
                {/* Arrow Interaction */}
                <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Micro Trust Line */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2 text-white/50"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-sans text-sm md:text-base font-medium">
              No pressure. Just clarity and growth.
            </span>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}