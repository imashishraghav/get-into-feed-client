// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowDownRight, BarChart3, Layers } from "lucide-react";

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

// ----------------------------------------------------------------------
// Proof & Stats Data
// ----------------------------------------------------------------------
const proofData = [
  {
    id: 1,
    stat: "300%",
    suffix: "↑",
    title: "Increase in Lead Volume",
    description: "Scaled high-intent lead generation for luxury real estate and premium commercial projects.",
    icon: TrendingUp,
    highlight: "text-navy" 
  },
  {
    id: 2,
    stat: "40%",
    suffix: "↓",
    title: "Reduction in CPL",
    description: "Slashed cost-per-lead by restructuring Meta and Google Ad targeting for maximum efficiency.",
    icon: ArrowDownRight,
    highlight: "text-primary" 
  },
  {
    id: 3,
    stat: "Consistent",
    suffix: "",
    title: "Revenue Growth",
    description: "Shifted focus entirely from vanity metrics (likes/clicks) to actual pipeline value and closed deals.",
    icon: BarChart3,
    highlight: "text-navy"
  },
  {
    id: 4,
    stat: "Scalable",
    suffix: "",
    title: "Growth Systems",
    description: "Built robust funnels that handle increased ad spend efficiently without breaking down.",
    icon: Layers,
    highlight: "text-navy"
  },
];

export default function Proof() {
  return (
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-primary/20 selection:text-navy border-t border-border/50">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* ================= 1. SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6 leading-tight text-balance">
            Proven Results
          </h2>
          <p className="font-sans text-lg md:text-xl text-slate-600 font-medium leading-relaxed text-balance">
            We don’t rely on promises or guesswork. We focus strictly on measurable growth, data-driven execution, and real outcomes.
          </p>
        </motion.div>

        {/* ================= 2. PROOF GRID ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 gpu-accelerated"
        >
          {proofData.map((item) => (
            <ProofCard key={item.id} data={item} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Proof Card Component
// ----------------------------------------------------------------------
function ProofCard({ data }) {
  const Icon = data.icon;
  
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      // 🟢 Optimized Classes using our Global Utility
      className="group bg-[#F8F9FB] border border-border rounded-[2rem] p-8 md:p-10 transition-all duration-500 ease-out hover:bg-white hover:border-navy/20 hover:shadow-soft flex flex-col justify-between h-full relative overflow-hidden"
    >
      {/* Background Accent on Hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out pointer-events-none" />

      {/* Top Section: Icon & Massive Stat */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center shadow-sm group-hover:border-primary/30 transition-colors duration-300">
            <Icon className="w-5 h-5 text-navy group-hover:text-secondary transition-colors duration-300" strokeWidth={2} />
          </div>
        </div>
        
        <div className="flex items-baseline gap-1">
          <h3 className={`font-heading text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tighter leading-none ${data.highlight} transition-colors duration-300`}>
            {data.stat}
          </h3>
          {data.suffix && (
            <span className={`font-heading text-3xl md:text-4xl font-bold ${data.highlight}`}>
              {data.suffix}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: Title & Description */}
      <div className="relative z-10">
        <h4 className="font-heading text-xl md:text-2xl font-bold text-navy mb-3 tracking-tight">
          {data.title}
        </h4>
        <p className="font-sans text-[16px] text-slate-600 font-medium leading-relaxed">
          {data.description}
        </p>
      </div>

    </motion.div>
  );
}