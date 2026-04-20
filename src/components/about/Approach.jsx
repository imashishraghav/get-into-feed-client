"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Target, Zap, BarChart2, TrendingUp } from "lucide-react";

// 🟢 Import custom smooth scroll hook & animations
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "../../utils/animations";

// ----------------------------------------------------------------------
// System Steps Data
// ----------------------------------------------------------------------
const stepsData = [
  {
    title: "Strategy & Architecture",
    description: "Deep market research, audience profiling, and full-funnel campaign mapping tailored to your unit economics.",
    icon: Target,
  },
  {
    title: "Creative Execution",
    description: "High-converting ad creatives, compelling copy, and landing pages engineered specifically for maximum ROI.",
    icon: Zap,
  },
  {
    title: "Performance & Optimization",
    description: "Ruthless, data-driven media buying. Continuous A/B testing and budget reallocation to outperforming assets.",
    icon: BarChart2,
  },
  {
    title: "Scaling & Domination",
    description: "Vertical and horizontal scaling strategies deployed to dominate market share while maintaining target CPA.",
    icon: TrendingUp,
  },
];

export default function Approach() {
  const containerRef = useRef(null);

  // 🟢 1. Global Background Parallax Depth
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * 0.1);

  // 🟢 2. Timeline Scroll Tracking
  // Tracks when the timeline container is in the center of the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Spring physics for the vertical progress line
  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 100,
    damping: 30,
    mass: 0.8,
  });

  return (
    <section className="relative w-full bg-[#F8F9FB] py-6 md:py-14 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      
      {/* Subtle Background Glows */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-[#2ED1B2]/5 to-transparent rounded-full blur-[150px] pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-20 md:mb-24"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-white px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              How We Work
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-6"
          >
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Growth System.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            A structured, data-driven approach designed to generate leads, optimize performance, and scale revenue predictability.
          </motion.p>
        </motion.div>

        {/* ================= DYNAMIC TIMELINE SECTION ================= */}
        <div className="max-w-4xl mx-auto relative" ref={containerRef}>
          
          {/* Default Inactive Line (Background) */}
          <div className="absolute left-[27px] md:left-[39px] top-6 bottom-6 w-[2px] bg-[#E5E7EB] z-0 hidden sm:block" />
          
          {/* 🟢 Active Progress Line (Animated based on scroll) */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-[27px] md:left-[39px] top-6 w-[2px] bg-gradient-to-b from-[#2ED1B2] to-[#0EA5A4] z-10 origin-top shadow-[0_0_10px_rgba(46,209,178,0.5)] hidden sm:block" 
          />

          <div className="flex flex-col gap-8 md:gap-12 relative z-20">
            {stepsData.map((step, index) => (
              <SystemStep 
                key={index} 
                step={step} 
                index={index} 
                totalSteps={stepsData.length} 
                scrollYProgress={scrollYProgress} 
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Advanced Individual Step Component (Tracks its own scroll state)
// ----------------------------------------------------------------------
function SystemStep({ step, index, totalSteps, scrollYProgress }) {
  const Icon = step.icon;
  
  // Calculate when this specific step should activate based on its position in the list
  const activationPoint = index / (totalSteps - 1); // e.g., 0, 0.33, 0.66, 1
  
  // We want the step to start fading/scaling in slightly *before* the line hits it
  const startTransition = Math.max(0, activationPoint - 0.15);
  
  // 1. Text & Layout Opacity (Starts muted, becomes fully visible)
  const rawOpacity = useTransform(scrollYProgress, [startTransition, activationPoint], [0.4, 1]);
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 30 });

  // 2. Scale Effect (Slight pop when activated)
  const rawScale = useTransform(scrollYProgress, [startTransition, activationPoint], [0.96, 1.02]);
  const scale = useSpring(rawScale, { stiffness: 100, damping: 30 });

  // 3. Highlight Colors (Overlay opacity to avoid React re-renders)
  const activeOverlayOpacity = useTransform(scrollYProgress, [startTransition, activationPoint], [0, 1]);

  return (
    <motion.div 
      style={{ opacity, scale }}
      className="relative flex flex-col sm:flex-row items-start gap-6 md:gap-10 group"
    >
      {/* Left: Animated Dot Indicator (Hidden on mobile for clean stacking) */}
      <div className="shrink-0 relative hidden sm:flex items-center justify-center w-[56px] md:w-[80px] pt-4">
        {/* Inactive Dot Base */}
        <div className="w-4 h-4 rounded-full bg-white border-2 border-[#E5E7EB] z-10 relative" />
        
        {/* Active Dot Overlay (Fades in dynamically) */}
        <motion.div 
          style={{ opacity: activeOverlayOpacity }}
          className="w-4 h-4 rounded-full bg-[#2ED1B2] shadow-[0_0_15px_rgba(46,209,178,0.8)] absolute z-20 pointer-events-none"
        />
      </div>

      {/* Right: Content Card */}
      <div className="flex-1 w-full relative">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          
          {/* Active Card Border Glow Overlay */}
          <motion.div 
            style={{ opacity: activeOverlayOpacity }}
            className="absolute inset-0 rounded-3xl border-2 border-[#2ED1B2]/40 pointer-events-none z-20 transition-colors"
          />

          {/* Active Internal Background Glow */}
          <motion.div 
            style={{ opacity: activeOverlayOpacity }}
            className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#2ED1B2]/10 to-transparent rounded-full pointer-events-none -z-0"
          />

          <div className="relative z-10">
            {/* Step Number & Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-12 h-12 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                <Icon className="w-5 h-5 text-[#475569] relative z-10" />
                {/* Active Icon Background */}
                <motion.div 
                  style={{ opacity: activeOverlayOpacity }}
                  className="absolute inset-0 bg-[#2ED1B2]/10 z-0"
                />
              </div>
              <span className="text-[11px] font-bold tracking-widest text-[#94A3B8] uppercase">
                Step 0{index + 1}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-[#0F172A] mb-3 tracking-tight">
              {step.title}
            </h3>
            <p className="text-base text-[#475569] leading-relaxed font-medium">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}