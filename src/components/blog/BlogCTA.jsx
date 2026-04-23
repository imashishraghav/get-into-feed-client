// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
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

export default function BlogCTA() {
  const containerRef = useRef(null);

  // 🟢 Smooth Scroll Initialization
  useSmoothScroll(); 

  // 🟢 Localized Scroll Tracking for Parallax Background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], 
  });

  // Soft parallax movement for the glowing background orb
  const glowY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const springGlowY = useSpring(glowY, { stiffness: 80, damping: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-background py-28 md:py-36 overflow-hidden selection:bg-primary/30 selection:text-navy transform-gpu"
    >
      {/* ================= 1. BACKGROUND EFFECTS ================= */}
      <motion.div 
        style={{ y: springGlowY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-primary/15 to-secondary/5 rounded-full blur-[100px] md:blur-[130px] pointer-events-none transform-gpu"
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
          
          {/* Headline (Appealing to the reader's mindset) */}
          <motion.h2 
            variants={blurFadeUp}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight leading-[1.15] mb-6 text-balance"
          >
            Stop Reading. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Start Scaling.
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-navy/80 font-medium leading-relaxed max-w-2xl mb-10 text-balance"
          >
            Let’s take the guesswork out of your marketing. Get a custom growth system designed specifically for your brand’s goals.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeUp} className="relative mb-8 w-full sm:w-auto transform-gpu">
            {/* Soft Teal Glow under button */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-30 scale-95" />
            
            <Link href="/contact" className="relative block focus:outline-none">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary text-background px-8 py-5 rounded-2xl font-bold text-lg tracking-wide shadow-lg overflow-hidden transform-gpu"
              >
                {/* 2D Glassmorphism Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
                
                <span className="relative z-10 font-heading">Book Your Strategy Call</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Micro Trust Line */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2 text-navy/70 opacity-90"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-sans text-sm font-medium">
              No pressure. Just clarity and execution.
            </span>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}