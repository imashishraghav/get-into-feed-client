"use client";

import React from "react";
import { motion } from "framer-motion";

// ----------------------------------------------------------------------
// Framer Motion Variants
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

// ----------------------------------------------------------------------
// Process Data
// ----------------------------------------------------------------------
const processData = [
  {
    step: "01",
    title: "Submit Your Details",
    description: "Tell us about your business and goals.",
  },
  {
    step: "02",
    title: "We Review Your Business",
    description: "We analyze your current setup and growth potential.",
  },
  {
    step: "03",
    title: "Strategy Call",
    description: "We discuss your goals, challenges, and opportunities.",
  },
  {
    step: "04",
    title: "Growth Plan",
    description: "We create a clear roadmap to scale your business.",
  },
];

export default function Process() {
  return (
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* ================= 1. SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4"
          >
            What Happens Next
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="font-['Inter',sans-serif] text-lg text-[#475569] font-medium leading-relaxed"
          >
            A simple, transparent process designed to get you results faster.
          </motion.p>
        </motion.div>

        {/* ================= 2. PROCESS TIMELINE ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="relative"
        >
          {/* Premium Connecting Line (Hidden on mobile, visible on desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent z-0" />

          {/* Grid Layout for Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {processData.map((item, index) => (
              <ProcessStep key={index} data={item} isLast={index === processData.length - 1} />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Step Component
// ----------------------------------------------------------------------
function ProcessStep({ data, isLast }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative flex flex-col items-center text-center md:px-4 cursor-default"
    >
      {/* Step Number Badge */}
      <div className="relative w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center mb-6 group-hover:border-[#2ED1B2]/40 group-hover:bg-[#2ED1B2]/5 transition-all duration-300 z-10">
        <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-lg text-[#0F172A] group-hover:text-[#0EA5A4] transition-colors duration-300">
          {data.step}
        </span>
        
        {/* Mobile Connecting Line (Vertical) - Shows only on small screens */}
        {!isLast && (
          <div className="md:hidden absolute top-14 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-gradient-to-b from-[#E5E7EB] to-transparent -z-10" />
        )}
      </div>

      {/* Content */}
      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#0F172A] mb-3 tracking-tight">
        {data.title}
      </h3>
      <p className="font-['Inter',sans-serif] text-[15px] text-[#475569] font-medium leading-relaxed max-w-[260px] mx-auto">
        {data.description}
      </p>

    </motion.div>
  );
}