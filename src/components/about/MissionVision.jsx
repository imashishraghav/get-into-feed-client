// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Target, Eye } from "lucide-react";

// 🟢 Using clean path aliases configured in jsconfig.json
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer } from "@/utils/animations";

// ----------------------------------------------------------------------
// Content Data
// ----------------------------------------------------------------------
const data = [
  {
    id: "mission",
    title: "Our Mission",
    description: "To help businesses achieve predictable growth through structured, data-driven marketing systems. We remove guesswork and replace it with clarity, consistency, and results.",
    icon: Target,
  },
  {
    id: "vision",
    title: "Our Vision",
    description: "To become a growth partner for brands that want to dominate their market by building scalable systems that drive long-term impact.",
    icon: Eye,
  },
];

// ----------------------------------------------------------------------
// Advanced Blur & Scale Variant for Cards
// ----------------------------------------------------------------------
const blurRevealVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.98, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    // 🟢 FIX: Replaced array with string "easeOut" for TypeScript stability in JSX
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

export default function MissionVision() {
  const containerRef = useRef(null);

  // 🟢 1. Global Background Parallax (Drifts down)
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * 0.05);

  // 🟢 2. Local Section Parallax (Floats up)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Spring physics for smooth lift
  const rawY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const sectionLift = useSpring(rawY, { stiffness: 90, damping: 30, mass: 0.8 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-background py-16 md:py-24 overflow-hidden selection:bg-primary/20 selection:text-secondary"
    >
      {/* --- Subliminal Grid & Ambient Glow --- */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundSize: '40px 40px' }} 
      />
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-[120px] pointer-events-none z-0 gpu-accelerated" 
      />

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= 2-COLUMN GRID ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 gpu-accelerated"
        >
          {data.map((item, index) => (
            <MissionVisionCard key={item.id} data={item} index={index} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Card Component with Premium Interactions
// ----------------------------------------------------------------------
function MissionVisionCard({ data, index }) {
  const Icon = data.icon;

  return (
    <motion.div
      variants={blurRevealVariant}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      // 🟢 Optimized Classes using premium-card global utility
      className="group relative h-full premium-card p-10 md:p-14 transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(46,209,178,0.12)] hover:border-primary/40 overflow-hidden flex flex-col cursor-default"
    >
      {/* 🟢 Premium Accent: Hidden Top Gradient Line reveals on hover */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Subtle Internal Background Glow on Hover */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* Header Section: Icon & Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/30 transition-colors duration-500 shrink-0">
            <Icon className="w-6 h-6 text-slate-600 group-hover:text-secondary transition-colors duration-500" strokeWidth={1.5} />
          </div>
          
          <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-navy tracking-tight group-hover:text-secondary transition-colors duration-500">
            {data.title}
          </h3>
        </div>

        {/* Content Paragraph */}
        <p className="font-sans text-lg md:text-xl text-slate-600 leading-relaxed font-medium text-balance">
          {data.description}
        </p>
        
      </div>
    </motion.div>
  );
}