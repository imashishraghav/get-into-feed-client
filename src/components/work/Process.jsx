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
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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

const fadeUpHeader = {
  hidden: { opacity: 0, y: 20 },
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
    id: 1,
    num: "01",
    title: "Discovery & Strategy",
    description: "We understand your business, goals, and current challenges to map out a clear path to ROI.",
  },
  {
    id: 2,
    num: "02",
    title: "System Design",
    description: "We build a custom growth strategy and architect the funnels tailored specifically to your business.",
  },
  {
    id: 3,
    num: "03",
    title: "Execution & Launch",
    description: "We implement the campaigns, develop the creatives, and officially launch your growth engine.",
  },
  {
    id: 4,
    num: "04",
    title: "Optimization & Scaling",
    description: "We continuously test, analyze data, improve conversion rates, and safely scale what works.",
  },
];

export default function Process() {
  return (
    <section className="relative w-full bg-[#F8F9FB] py-24 md:py-32 selection:bg-[#0F172A]/10 selection:text-[#0F172A] border-t border-[#E5E7EB]/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ================= 1. SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpHeader}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6 leading-tight">
            How We Work
          </h2>
          <p className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed">
            A proven, structured approach to ensure smooth onboarding and rapid results. No guesswork, just execution.
          </p>
        </motion.div>

        {/* ================= 2. PROCESS TIMELINE GRID ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative"
        >
          {/* Subtle connecting line for Desktop (Hidden on mobile/tablet) */}
          <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#E5E7EB] via-[#2ED1B2]/40 to-[#E5E7EB] z-0" />

          {processData.map((step) => (
            <ProcessCard key={step.id} data={step} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Process Card Component
// ----------------------------------------------------------------------
function ProcessCard({ data }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative z-10 group bg-white border border-[#E5E7EB] rounded-[2rem] p-8 md:p-10 transition-all duration-500 ease-out hover:border-[#0F172A]/30 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] flex flex-col h-full"
    >
      {/* Number Badge (Authority Black Theme) */}
      <div className="w-14 h-14 rounded-2xl bg-[#0F172A] flex items-center justify-center mb-8 shadow-md group-hover:bg-[#2ED1B2] group-hover:shadow-lg transition-all duration-500 ease-out mx-auto lg:mx-0">
        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-white group-hover:text-[#0F172A] transition-colors duration-500">
          {data.num}
        </span>
      </div>

      {/* Text Content */}
      <div className="text-center lg:text-left flex-grow flex flex-col">
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight mb-4 transition-colors duration-300">
          {data.title}
        </h3>
        <p className="font-['Inter',sans-serif] text-[16px] text-[#475569] font-medium leading-relaxed flex-grow">
          {data.description}
        </p>
      </div>

    </motion.div>
  );
}