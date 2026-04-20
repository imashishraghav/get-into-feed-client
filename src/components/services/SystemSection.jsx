"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// 🟢 Import your custom animation variants
// Note: Ensure staggerContainer and fadeUp are available in your utils
import { staggerContainer, fadeUp } from "../../utils/animations";

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
      className="relative w-full bg-white py-16 md:py-24 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-[#F8F9FB] px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              Our Process
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-6"
          >
            A System Built for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Predictable Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            Every step is designed to move your business from inconsistent results to scalable revenue.
          </motion.p>
        </motion.div>

        {/* ================= TIMELINE GRID ================= */}
        <div className="relative">
          
          {/* --- Background Inactive Lines --- */}
          {/* Desktop Horizontal Line */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-[#F8F9FB] z-0" />
          {/* Mobile Vertical Line */}
          <div className="block lg:hidden absolute top-[5%] bottom-[5%] left-[44px] w-[2px] bg-[#F8F9FB] z-0" />

          {/* --- Animated Active Lines --- */}
          {/* Desktop Horizontal Active Line */}
          <motion.div 
            style={{ scaleX: lineProgress }} 
            className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] origin-left z-0 shadow-[0_0_10px_rgba(46,209,178,0.5)]" 
          />
          {/* Mobile Vertical Active Line */}
          <motion.div 
            style={{ scaleY: lineProgress }} 
            className="block lg:hidden absolute top-[5%] bottom-[5%] left-[44px] w-[2px] bg-gradient-to-b from-[#2ED1B2] to-[#0EA5A4] origin-top z-0 shadow-[0_0_10px_rgba(46,209,178,0.5)]" 
          />

          {/* --- Steps Container --- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8 relative z-10"
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
      className="relative flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-8 group"
    >
      {/* 🟢 Step Number Node (Sits on the line) */}
      <div className="shrink-0 relative w-24 h-24 rounded-full bg-white border-[3px] border-[#F8F9FB] flex items-center justify-center transition-all duration-500 group-hover:border-[#2ED1B2]/40 group-hover:shadow-[0_0_30px_-5px_rgba(46,209,178,0.3)] z-10">
        
        {/* Subtle inner pulse background on hover */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#2ED1B2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <span className="relative z-10 font-display text-3xl font-extrabold text-[#CBD5E1] tracking-tighter transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#2ED1B2] group-hover:to-[#0EA5A4] group-hover:drop-shadow-[0_2px_10px_rgba(46,209,178,0.4)]">
          {step.id}
        </span>
      </div>

      {/* 🟢 Step Content Card */}
      <div className="flex-1 w-full bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 transition-all duration-300 ease-out hover:border-[#2ED1B2]/30 hover:shadow-[0_20px_40px_-10px_rgba(46,209,178,0.12)] relative overflow-hidden text-left lg:text-center mt-2 lg:mt-0">
        
        {/* Subtle Hover Glow Inside Card */}
        <div className="absolute top-0 right-0 lg:left-1/2 lg:-translate-x-1/2 w-32 h-32 bg-gradient-to-b from-[#2ED1B2]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -translate-y-1/2" />

        <h3 className="relative z-10 text-xl font-bold text-[#0F172A] mb-3 tracking-tight group-hover:text-[#0EA5A4] transition-colors duration-300">
          {step.title}
        </h3>
        
        <p className="relative z-10 text-[15px] md:text-base text-[#475569] leading-relaxed font-medium">
          {step.description}
        </p>
      </div>
      
    </motion.div>
  );
}