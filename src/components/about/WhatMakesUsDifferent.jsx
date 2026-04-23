// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// 🟢 Using clean path aliases configured in jsconfig.json
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// Differences Data
// ----------------------------------------------------------------------
const differences = [
  {
    id: "01",
    title: "System-Driven Approach",
    description: "We build complete growth systems, not just run ads.",
  },
  {
    id: "02",
    title: "Data Over Guesswork",
    description: "Every decision is based on real data, not assumptions.",
  },
  {
    id: "03",
    title: "Revenue-Focused Strategy",
    description: "We focus on leads, conversions, and actual business growth.",
  },
  {
    id: "04",
    title: "Continuous Optimization",
    description: "We constantly test, improve, and scale what works.",
  },
  {
    id: "05",
    title: "Long-Term Growth",
    description: "We build strategies that deliver sustainable results.",
  },
];

export default function WhatMakesUsDifferent() {
  const containerRef = useRef(null);
  const rightColumnRef = useRef(null);

  // 🟢 1. Global Background Drift
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * -0.05);

  // 🟢 2. Scroll Tracking for the entire right column to drive the progress line
  const { scrollYProgress: columnProgress } = useScroll({
    target: rightColumnRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useSpring(useTransform(columnProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 100,
    damping: 30,
    mass: 0.8,
  });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-background py-16 md:py-24 overflow-hidden selection:bg-primary/20 selection:text-secondary"
    >
      {/* Subtle Background Accent */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0 gpu-accelerated" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* items-start is crucial for sticky behavior to work in a grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* ================= LEFT COLUMN: Sticky Anchor Context ================= */}
          <motion.div 
            className="lg:col-span-5 lg:sticky lg:top-40 flex flex-col items-start relative z-20 gpu-accelerated"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-secondary uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm">
                What Makes Us Different
              </span>
            </motion.div>

            <motion.h2 
              variants={fadeUp}
              className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-navy tracking-tight leading-[1.05] mb-6 text-balance"
            >
              Not Your Typical <br className="hidden lg:block" />
              Agency.
            </motion.h2>

            <motion.p 
              variants={fadeUp}
              className="font-sans text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-md border-l-2 border-primary/50 pl-4 py-1 text-balance"
            >
              We don’t chase clicks. We build systems that drive real business growth.
            </motion.p>
          </motion.div>

          {/* ================= RIGHT COLUMN: Scrollable Cards ================= */}
          <div 
            ref={rightColumnRef}
            className="lg:col-span-7 relative flex flex-col gap-6 md:gap-8 mt-8 lg:mt-0"
          >
            {/* Background Track for Progress Line */}
            <div className="absolute left-[20px] md:left-[30px] top-4 bottom-4 w-[2px] bg-white z-0 hidden sm:block shadow-sm" />
            
            {/* 🟢 Active Progress Line (Follows Scroll) */}
            <motion.div 
              style={{ height: lineHeight }}
              className="absolute left-[20px] md:left-[30px] top-4 w-[2px] bg-gradient-to-b from-primary to-secondary z-10 origin-top shadow-[0_0_12px_rgba(46,209,178,0.6)] hidden sm:block gpu-accelerated" 
            />

            {/* Render Difference Cards */}
            {differences.map((item, index) => (
              <DifferenceCard key={item.id} data={item} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Card Component (Tracks its own scroll depth)
// ----------------------------------------------------------------------
function DifferenceCard({ data, index }) {
  const cardRef = useRef(null);

  // Localized scroll tracking: Card activates when it crosses 75% of viewport height
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 85%", "start 40%"],
  });

  // Spring Physics for buttery smooth transitions
  const springConfig = { stiffness: 90, damping: 25 };
  
  // Opacity transitions from faded (0.4) to fully visible (1)
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const opacity = useSpring(rawOpacity, springConfig);

  // Scale transitions slightly for a "pop" effect
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const scale = useSpring(rawScale, springConfig);

  // Background shifts from gray-ish to pure white
  const bgColor = useTransform(scrollYProgress, [0, 1], ["#F8F9FB", "#FFFFFF"]);
  const borderColor = useTransform(scrollYProgress, [0, 1], ["#E5E7EB", "rgba(46,209,178,0.4)"]);
  const shadow = useTransform(scrollYProgress, [0, 1], ["0px 4px 10px rgba(0,0,0,0)", "0px 20px 40px -10px rgba(46,209,178,0.15)"]);

  // Number Color transitions from slate to teal
  const numberColor = useTransform(scrollYProgress, [0, 1], ["#CBD5E1", "#0EA5A4"]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ opacity, scale, y: useSpring(useTransform(scrollYProgress, [0, 1], [40, 0]), springConfig) }}
      className="relative pl-0 sm:pl-16 md:pl-20 w-full group gpu-accelerated"
    >
      {/* This div applies the dynamic background, border, and shadow.
        We wrap the content to allow Framer Motion to animate the CSS properties seamlessly.
      */}
      <motion.div
        style={{ backgroundColor: bgColor, borderColor: borderColor, boxShadow: shadow }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="relative border rounded-[2rem] p-8 md:p-10 transition-transform duration-300 ease-out z-20 overflow-hidden"
      >
        {/* Soft internal glow for premium feel */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/5 to-transparent rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          
          {/* Index Number */}
          <div className="shrink-0">
            <motion.span 
              style={{ color: numberColor }}
              className="font-heading text-4xl md:text-5xl font-extrabold tracking-tighter"
            >
              {data.id}
            </motion.span>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="font-heading text-xl md:text-2xl font-bold text-navy mb-2 tracking-tight group-hover:text-secondary transition-colors duration-300">
              {data.title}
            </h3>
            <p className="font-sans text-base text-slate-600 leading-relaxed font-medium">
              {data.description}
            </p>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}