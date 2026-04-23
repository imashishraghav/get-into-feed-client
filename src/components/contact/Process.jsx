// @ts-nocheck
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
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-primary/20 selection:text-secondary transform-gpu">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* ================= 1. SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 transform-gpu"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-heading text-3xl md:text-5xl font-extrabold text-navy tracking-tight mb-4 text-balance"
          >
            What Happens Next
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg text-navy/70 font-medium leading-relaxed text-balance"
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
          className="relative transform-gpu"
        >
          {/* Premium Connecting Line (Hidden on mobile, visible on desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-navy/10 to-transparent z-0" />

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
      className="group relative flex flex-col items-center text-center md:px-4 cursor-default transform-gpu"
    >
      {/* Step Number Badge */}
      <div className="relative w-14 h-14 rounded-2xl bg-white border border-navy/10 shadow-sm flex items-center justify-center mb-6 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300 z-10">
        <span className="font-heading font-extrabold text-lg text-navy group-hover:text-secondary transition-colors duration-300">
          {data.step}
        </span>
        
        {/* Mobile Connecting Line (Vertical) - Shows only on small screens */}
        {!isLast && (
          <div className="md:hidden absolute top-14 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-gradient-to-b from-navy/10 to-transparent -z-10" />
        )}
      </div>

      {/* Content */}
      <h3 className="font-heading text-xl font-bold text-navy mb-3 tracking-tight">
        {data.title}
      </h3>
      <p className="font-sans text-[15px] text-navy/70 font-medium leading-relaxed max-w-[260px] mx-auto">
        {data.description}
      </p>

    </motion.div>
  );
}