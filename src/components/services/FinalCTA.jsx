"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { staggerContainer, fadeUp, blurFadeUp } from "../../utils/animations";

export default function FinalCTA() {
  const containerRef = useRef(null);

  // 🟢 1. Global Smooth Scroll Hooks for Parallax
  const { scrollY } = useSmoothScroll();
  
  // Background Parallax: Soft glowing orbs drift down slowly for cinematic depth
  const rawBgY = useTransform(scrollY, [0, 5000], [0, 250]);
  const bgY = useSpring(rawBgY, { stiffness: 70, damping: 40 });

  // 🟢 2. Local Scroll for Content Lift (Magnetic Pull Effect)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Content lifts up smoothly as it enters the viewport
  const rawTextY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useSpring(rawTextY, { stiffness: 90, damping: 30 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#0F172A] py-24 md:py-32 overflow-hidden selection:bg-[#2ED1B2]/30 selection:text-white border-t border-white/5"
    >
      {/* --- 🟢 Premium Ambient Background Visuals --- */}
      
      {/* Subliminal Grid Pattern with Spotlight Mask */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-10 pointer-events-none z-0 invert" 
        style={{ 
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 80%)'
        }} 
      />

      {/* Floating Ambient Orbs */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center">
        {/* Top Right Teal Glow */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2ED1B2] rounded-full blur-[160px] mix-blend-screen"
        />
        {/* Bottom Left Deep Aqua Glow */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#0EA5A4] rounded-full blur-[150px] mix-blend-screen"
        />
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        
        {/* --- 🟢 Main Content Container (Centered Layout) --- */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: textY }}
          className="flex flex-col items-center w-full antialiased"
        >
          {/* Headline */}
          <motion.h2 
            variants={blurFadeUp}
            className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-white tracking-tighter leading-[1.05] mb-6 drop-shadow-2xl"
          >
            Ready to Scale <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] via-[#0EA5A4] to-[#2ED1B2] animate-gradient-x drop-shadow-none">
              Your Growth?
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-slate-400/90 font-medium leading-relaxed max-w-2xl mb-12"
          >
            Let’s build a system that generates leads, increases conversions, and drives real revenue for your business.
          </motion.p>

          {/* 🟢 Premium CTA Button */}
          <motion.div variants={fadeUp} className="w-full sm:w-auto">
            <Link href="/contact" className="block w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative group w-full sm:w-auto overflow-hidden bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] text-[#0F172A] font-bold text-lg md:text-[1.1rem] tracking-wide px-10 py-5 rounded-full flex items-center justify-center gap-3 shadow-[0_10px_40px_-10px_rgba(46,209,178,0.5)] hover:shadow-[0_20px_60px_-15px_rgba(46,209,178,0.7)] hover:ring-4 ring-[#2ED1B2]/30 transition-all duration-500 ease-out"
              >
                {/* --- Micro Interaction: Shimmer Sweep --- */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                
                {/* --- Button Content --- */}
                <span className="relative z-10 drop-shadow-sm">Book Your Free Strategy Call</span>
                
                {/* --- Arrow Interaction --- */}
                <div className="relative z-10 flex items-center justify-center overflow-hidden w-5 h-5">
                  <ArrowRight className="absolute w-5 h-5 group-hover:translate-x-[150%] transition-transform duration-300 ease-in" />
                  <ArrowRight className="absolute w-5 h-5 -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-300 ease-out delay-75" />
                </div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Micro Trust Line */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2.5 mt-8 text-slate-400 font-semibold text-sm tracking-wide"
          >
            {/* Subtle Floating Animation on the Shield */}
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheck className="w-5 h-5 text-[#2ED1B2]" />
            </motion.div>
            <p>No pressure. Just clarity and growth.</p>
          </motion.div>

        </motion.div>
      </div>

    </section>
  );
}