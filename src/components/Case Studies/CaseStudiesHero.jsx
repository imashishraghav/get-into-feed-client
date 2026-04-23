// @ts-nocheck
"use client";

import React from "react";
import { motion, useTransform, useSpring } from "framer-motion";
import { BarChart3, TrendingUp, Target, Activity } from "lucide-react";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp, blurFadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// Strategic Hero Metrics
// ----------------------------------------------------------------------
const heroMetrics = [
  {
    id: 1,
    value: "+120%",
    label: "Lead Growth",
    icon: TrendingUp,
  },
  {
    id: 2,
    value: "₹2 Cr+",
    label: "Ad Spend Managed",
    icon: BarChart3,
  },
  {
    id: 3,
    value: "3.5x",
    label: "Average ROAS",
    icon: Target,
  },
];

export default function CaseStudiesHero() {
  // 🟢 1. Initialize Smooth Scroll tracking
  const { scrollY } = useSmoothScroll();

  // 🟢 2. Multi-Layer Parallax Physics
  // Background Layer: Drifts DOWN slowly to create depth
  const rawBgY = useTransform(scrollY, [0, 800], [0, 150]);
  const bgY = useSpring(rawBgY, { stiffness: 80, damping: 30 });

  // Text Layer: Drifts UP and fades OUT gracefully as user scrolls to the grid
  const rawTextY = useTransform(scrollY, [0, 600], [0, -120]);
  const rawOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  
  const textY = useSpring(rawTextY, { stiffness: 90, damping: 30 });
  const opacity = useSpring(rawOpacity, { stiffness: 90, damping: 30 });

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-center items-center bg-background pt-32 pb-20 overflow-hidden selection:bg-primary/20 selection:text-secondary transform-gpu">
      
      {/* --- 🟢 Subtle Ambient Background --- */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none flex justify-center items-center -z-10 transform-gpu"
      >
        {/* Soft, breathing teal orb */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[800px] h-[600px] bg-gradient-to-b from-primary/15 to-transparent rounded-[100%] blur-[120px] -translate-y-20 transform-gpu"
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
        className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center text-center transform-gpu"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full transform-gpu"
        >
          {/* Small Label */}
          <motion.div variants={fadeUp} className="mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-navy/10 text-navy font-sans text-xs font-bold shadow-sm uppercase tracking-[0.15em]">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Case Studies
            </div>
          </motion.div>

          {/* Headline with Advanced Blur Reveal */}
          <motion.h1 
            variants={blurFadeUp}
            className="font-heading text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-navy tracking-tighter leading-[1.05] mb-6 md:mb-8 max-w-4xl text-balance"
          >
            Real Results.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Real Growth.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl lg:text-[1.25rem] text-navy/70 font-medium leading-relaxed max-w-2xl mb-12 mx-auto text-balance"
          >
            See how we help brands generate high-intent leads, scale revenue, and build predictable growth systems that outpace the competition.
          </motion.p>

          {/* --- 🟢 High-Impact Metric Strip --- */}
          <motion.div 
            variants={fadeUp}
            className="w-full max-w-3xl mx-auto bg-white border border-navy/10 rounded-2xl md:rounded-full p-2 md:p-3 shadow-[0_20px_40px_-15px_rgba(46,209,178,0.08)] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 mb-10 transform-gpu"
          >
            {heroMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <React.Fragment key={metric.id}>
                  <div className="flex items-center gap-4 px-6 py-3 w-full md:w-auto justify-center md:justify-start group">
                    <div className="w-10 h-10 rounded-full bg-background border border-navy/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-secondary" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-heading text-xl md:text-2xl font-extrabold text-navy tracking-tight leading-none mb-1">
                        {metric.value}
                      </span>
                      <span className="font-sans text-[13px] font-semibold text-navy/70 uppercase tracking-wider">
                        {metric.label}
                      </span>
                    </div>
                  </div>
                  {/* Divider */}
                  {index !== heroMetrics.length - 1 && (
                    <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-navy/10 to-transparent" />
                  )}
                  {index !== heroMetrics.length - 1 && (
                    <div className="block md:hidden w-3/4 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
                  )}
                </React.Fragment>
              );
            })}
          </motion.div>

          {/* Micro System Line */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2 text-navy/70 font-sans font-bold text-sm tracking-widest uppercase opacity-80"
          >
            <Activity className="w-4 h-4 text-secondary" strokeWidth={2.5} />
            <p>Numbers don’t lie. Systems work.</p>
          </motion.div>

        </motion.div>
      </motion.div>

      {/* Subtle Anchor Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-navy/10 to-transparent opacity-80" />
      
    </section>
  );
}