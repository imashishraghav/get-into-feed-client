"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Layers, Activity, Rocket } from "lucide-react";

// ----------------------------------------------------------------------
// Advanced Framer Motion Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
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
// Explanation Content Data
// ----------------------------------------------------------------------
const explanationData = [
  {
    id: 1,
    title: "Outcome-Based Approach",
    description: "We focus on results, not tasks. Every plan is designed to generate leads and drive real business growth.",
    icon: Target,
  },
  {
    id: 2,
    title: "Full-Funnel System",
    description: "From ads to landing pages to conversion, everything is connected into one seamless growth system.",
    icon: Layers,
  },
  {
    id: 3,
    title: "Continuous Optimization",
    description: "We don’t just launch campaigns. We constantly test, optimize, and scale what works.",
    icon: Activity,
  },
  {
    id: 4,
    title: "Long-Term Growth",
    description: "Our goal is not short-term wins but building a predictable and scalable growth engine.",
    icon: Rocket,
  },
];

export default function PricingExplanation() {
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
            className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6"
          >
            Why Our Pricing Works
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            We don’t sell services. We build systems that generate consistent leads and predictable revenue.
          </motion.p>
        </motion.div>

        {/* ================= 2. EXPLANATION GRID ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10"
        >
          {explanationData.map((item) => (
            <ExplanationCard key={item.id} data={item} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Card Component
// ----------------------------------------------------------------------
function ExplanationCard({ data }) {
  const Icon = data.icon;
  const hoverTransition = { type: "spring", stiffness: 400, damping: 25 };

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, transition: hoverTransition }}
      className="group relative bg-[#F8F9FB] border border-[#E5E7EB] rounded-3xl p-8 md:p-10 hover:bg-white hover:border-[#2ED1B2]/30 transition-colors duration-500 ease-out flex flex-col h-full shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(46,209,178,0.12)]"
    >
      {/* Icon Wrapper with subtle background highlight on hover */}
      <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center shrink-0 text-[#0F172A] mb-6 group-hover:bg-[#2ED1B2]/10 group-hover:border-[#2ED1B2]/20 group-hover:text-[#0EA5A4] transition-all duration-500">
        <Icon className="w-6 h-6" strokeWidth={2} />
      </div>

      {/* Content */}
      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-[#0F172A] tracking-tight mb-4 group-hover:text-[#0EA5A4] transition-colors duration-300">
        {data.title}
      </h3>
      <p className="font-['Inter',sans-serif] text-[#475569] leading-relaxed font-medium">
        {data.description}
      </p>

      {/* Subtle indicator line that expands on hover (Premium UX touch) */}
      <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-500 origin-left rounded-t-full" />
    </motion.div>
  );
}