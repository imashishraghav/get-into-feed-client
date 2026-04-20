"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Target, PenTool, Lightbulb, LineChart } from "lucide-react";

// 🟢 Import custom smooth scroll hook & animations
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "../../utils/animations";

// ----------------------------------------------------------------------
// Core Capabilities Data
// ----------------------------------------------------------------------
const capabilities = [
  {
    title: "Performance Marketing",
    description: "Data-driven media buying across Meta, Google, and beyond to acquire high-value customers at scale.",
    icon: Target,
  },
  {
    title: "Creative Strategy & Design",
    description: "High-converting ad creatives, landing pages, and visual assets engineered specifically for maximum ROI.",
    icon: PenTool,
  },
  {
    title: "Digital Strategy & Planning",
    description: "Comprehensive growth roadmaps, audience architecture, and full-funnel strategy mapping.",
    icon: Lightbulb,
  },
  {
    title: "Growth & Optimization",
    description: "Continuous CRO, A/B testing, and unit economic optimization to ensure profitable scaling.",
    icon: LineChart,
  },
];

export default function WhatWeDo() {
  const containerRef = useRef(null);

  // 🟢 1. Global Background Drift
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * 0.05);

  // 🟢 2. Localized Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 🟢 3. Advanced Animations
  // Right Column Float (Upward drift as you scroll)
  const rawRightY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rightY = useSpring(rawRightY, { stiffness: 80, damping: 25, mass: 0.8 });

  // Left Column Scroll Progress Line (Draws down as you scroll)
  const lineProgress = useSpring(useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]), { 
    stiffness: 100, damping: 30 
  });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[#F8F9FB] py-6 md:py-10 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
    >
      {/* --- 🟢 Advanced Background Graphics --- */}
      {/* Top Right Orb */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-bl from-[#2ED1B2]/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" 
      />
      {/* Bottom Left Orb */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#0EA5A4]/5 rounded-full blur-[150px] pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* items-start is strictly required for sticky behavior inside a grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* ================= LEFT COLUMN: Sticky Context ================= */}
          {/* Removed transform 'y' to allow native CSS position:sticky to work flawlessly. Added h-fit. */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 h-fit flex flex-col items-start relative z-20">
            
            {/* 🟢 Graphic: Animated Scroll Progress Line */}
            <div className="absolute left-0 top-4 bottom-[-40px] w-[2px] bg-[#F8F9FB] hidden md:block">
              <motion.div 
                style={{ height: lineProgress }}
                className="w-full bg-gradient-to-b from-[#2ED1B2] to-[#0EA5A4] shadow-[0_0_10px_rgba(46,209,178,0.5)] origin-top rounded-full"
              />
            </div>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="md:pl-10"
            >
              <motion.div variants={fadeUp} className="mb-6">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-[#2ED1B2]/10 px-3 py-1.5 rounded-full border border-[#2ED1B2]/20 shadow-sm flex items-center gap-2 w-max">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2ED1B2] animate-pulse" />
                  What We Do
                </span>
              </motion.div>

              <motion.h2 
                variants={fadeUp}
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#0F172A] tracking-tight leading-[1.05] mb-6"
              >
                We build complete <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
                  marketing systems.
                </span>
              </motion.h2>

              <motion.p 
                variants={fadeUp}
                className="text-lg text-[#475569] font-medium leading-relaxed max-w-md"
              >
                Turning attention into predictable revenue by combining advanced strategy, relentless performance, and high-end creative execution.
              </motion.p>
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN: Floating Capability Cards ================= */}
          <motion.div 
            style={{ y: rightY }}
            className="lg:col-span-7 flex flex-col gap-6 w-full mt-8 lg:mt-0 relative z-10"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col gap-6"
            >
              {capabilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={{ y: -8, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="group relative bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-10 transition-all duration-500 ease-out hover:border-[#2ED1B2]/40 hover:shadow-[0_40px_80px_-20px_rgba(46,209,178,0.15)] overflow-hidden cursor-default"
                  >
                    {/* 🟢 Advanced Graphic: Hover Glass/Mesh Effect */}
                    <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-[radial-gradient(circle_at_top_right,rgba(46,209,178,0.08),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/4 translate-x-1/4" />
                    
                    {/* Subtle Base Background */}
                    <div className="absolute inset-0 bg-[#F8F9FB] opacity-50 group-hover:opacity-0 transition-opacity duration-500 -z-10" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                      
                      {/* Icon Container with Advanced Hover Animation */}
                      <div className="shrink-0 w-16 h-16 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex items-center justify-center transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-[#2ED1B2] group-hover:to-[#0EA5A4] group-hover:border-transparent group-hover:shadow-[0_10px_30px_-10px_rgba(46,209,178,0.5)]">
                        <Icon className="w-7 h-7 text-[#475569] transition-all duration-500 group-hover:text-white group-hover:scale-110" strokeWidth={2} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <h3 className="text-2xl font-bold text-[#0F172A] mb-3 tracking-tight group-hover:text-[#0EA5A4] transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-base text-[#475569] leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}