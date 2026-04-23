// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// 🟢 Import your custom animation variants
import { staggerContainer, fadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// System Steps Data
// ----------------------------------------------------------------------
const steps = [
  {
    id: "01",
    title: "Strategy",
    description: "Understand business, audience, and goals. Define a clear, data-driven growth roadmap.",
  },
  {
    id: "02",
    title: "Execution",
    description: "Launch targeted campaigns, high-converting creatives, and frictionless funnels.",
  },
  {
    id: "03",
    title: "Optimization",
    description: "Test, analyze, and improve performance. Relentless focus on lowering CPA and boosting conversions.",
  },
  {
    id: "04",
    title: "Scaling",
    description: "Scale winning campaigns vertically and horizontally to maximize ROI and predictable growth.",
  },
];

export default function SystemSection() {
  const containerRef = useRef(null);

  // 🟢 Scroll Tracking for the Timeline Line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"], // Animates as the section enters the viewport
  });

  // Spring physics for buttery smooth line drawing
  const springConfig = { stiffness: 80, damping: 25, mass: 0.8 };
  const lineProgress = useSpring(scrollYProgress, springConfig);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-white py-16 md:py-24 overflow-hidden selection:bg-primary/20 selection:text-secondary transform-gpu"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 flex flex-col items-center transform-gpu"
        >
          <motion.div variants={fadeUp} className="mb-6 transform-gpu">
            <span className="font-heading text-[11px] font-bold tracking-[0.2em] text-secondary uppercase bg-background px-4 py-2 rounded-full border border-navy/10 shadow-sm">
              Our Process
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-navy tracking-tight leading-[1.1] mb-6 text-balance transform-gpu"
          >
            A System Built for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Predictable Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-navy/70 font-medium leading-relaxed text-balance transform-gpu"
          >
            Every step is designed to move your business from inconsistent results to scalable revenue.
          </motion.p>
        </motion.div>

        {/* ================= TIMELINE GRID ================= */}
        <div className="relative">
          
          {/* --- Background Inactive Lines --- */}
          {/* Desktop Horizontal Line */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-background z-0" />
          {/* Mobile Vertical Line */}
          <div className="block lg:hidden absolute top-[5%] bottom-[5%] left-[44px] w-[2px] bg-background z-0" />

          {/* --- Animated Active Lines --- */}
          {/* Desktop Horizontal Active Line */}
          <motion.div 
            style={{ scaleX: lineProgress }} 
            className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary to-secondary origin-left z-0 shadow-[0_0_10px_rgba(46,209,178,0.5)] transform-gpu" 
          />
          {/* Mobile Vertical Active Line */}
          <motion.div 
            style={{ scaleY: lineProgress }} 
            className="block lg:hidden absolute top-[5%] bottom-[5%] left-[44px] w-[2px] bg-gradient-to-b from-primary to-secondary origin-top z-0 shadow-[0_0_10px_rgba(46,209,178,0.5)] transform-gpu" 
          />

          {/* --- Steps Container --- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8 relative z-10 transform-gpu"
          >
            {steps.map((step, index) => (
              <TimelineStep key={step.id} step={step} index={index} />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Timeline Step Component
// ----------------------------------------------------------------------
function TimelineStep({ step, index }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-8 group transform-gpu"
    >
      {/* 🟢 Step Number Node (Sits on the line) */}
      <div className="shrink-0 relative w-24 h-24 rounded-full bg-white border-[3px] border-background flex items-center justify-center transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_-5px_rgba(46,209,178,0.3)] z-10">
        
        {/* Subtle inner pulse background on hover */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <span className="relative z-10 font-heading text-3xl font-extrabold text-navy/30 tracking-tighter transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:drop-shadow-md">
          {step.id}
        </span>
      </div>

      {/* 🟢 Step Content Card */}
      <div className="flex-1 w-full bg-white border border-navy/10 rounded-3xl p-6 md:p-8 transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 relative overflow-hidden text-left lg:text-center mt-2 lg:mt-0">
        
        {/* Subtle Hover Glow Inside Card */}
        <div className="absolute top-0 right-0 lg:left-1/2 lg:-translate-x-1/2 w-32 h-32 bg-gradient-to-b from-primary/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -translate-y-1/2" />

        <h3 className="relative z-10 font-heading text-xl font-bold text-navy mb-3 tracking-tight group-hover:text-secondary transition-colors duration-300">
          {step.title}
        </h3>
        
        <p className="relative z-10 font-sans text-[15px] md:text-base text-navy/70 leading-relaxed font-medium">
          {step.description}
        </p>
      </div>
      
    </motion.div>
  );
}