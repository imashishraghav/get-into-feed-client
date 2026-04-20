"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

// ----------------------------------------------------------------------
// Framer Motion Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

// ----------------------------------------------------------------------
// Comparison Data
// ----------------------------------------------------------------------
const comparisonData = [
  {
    feature: "Strategy & Planning",
    gif: "Custom Blueprint",
    gifIcon: "check",
    others: "Generic Templates",
    othersIcon: "minus",
  },
  {
    feature: "Full-Funnel System",
    gif: "End-to-End System",
    gifIcon: "check",
    others: "Siloed Campaigns",
    othersIcon: "cross",
  },
  {
    feature: "Data-Driven Optimization",
    gif: "Continuous & Daily",
    gifIcon: "check",
    others: "'Set & Forget'",
    othersIcon: "cross",
  },
  {
    feature: "Consistent Lead Generation",
    gif: "High-Intent Buyers",
    gifIcon: "check",
    others: "Inconsistent Junk Leads",
    othersIcon: "cross",
  },
  {
    feature: "Creative & Design Support",
    gif: "Fully Included",
    gifIcon: "check",
    others: "Extra Cost / Outsourced",
    othersIcon: "minus",
  },
  {
    feature: "Long-Term Growth Focus",
    gif: "Strategic Partner",
    gifIcon: "check",
    others: "Short-Term Vendor",
    othersIcon: "minus",
  },
];

export default function Comparison() {
  return (
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* ================= 1. SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6"
          >
            Why Choose Get Into Feed?
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            We don’t just run ads. We build systems that drive real growth and predictable revenue.
          </motion.p>
        </motion.div>

        {/* ================= 2. DESKTOP COMPARISON TABLE ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="hidden md:block bg-white border border-[#E5E7EB] rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr] items-center border-b border-[#E5E7EB] bg-[#F8F9FB]">
            <div className="p-8 font-bold text-[#475569] uppercase tracking-wider text-sm">
              Features & Focus
            </div>
            {/* Get Into Feed Highlighted Header */}
            <div className="p-8 bg-[#2ED1B2]/10 border-x border-[#2ED1B2]/20 flex flex-col items-center justify-center text-center">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-[#0F172A]">
                Get Into Feed
              </span>
            </div>
            <div className="p-8 text-center font-bold text-[#94A3B8] uppercase tracking-wider text-sm">
              Most Agencies
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col">
            {comparisonData.map((row, index) => (
              <motion.div 
                key={index}
                variants={fadeUp}
                className={`grid grid-cols-[2fr_1.5fr_1.5fr] items-center group transition-colors duration-300 hover:bg-slate-50 ${index !== comparisonData.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}
              >
                {/* Feature Name */}
                <div className="p-6 lg:p-8 font-['Inter',sans-serif] text-lg font-semibold text-[#0F172A]">
                  {row.feature}
                </div>
                
                {/* Get Into Feed (Highlighted Column) */}
                <div className="h-full p-6 lg:p-8 bg-[#2ED1B2]/[0.03] border-x border-[#2ED1B2]/10 group-hover:bg-[#2ED1B2]/10 transition-colors duration-300 flex items-center justify-center gap-3 text-center">
                  <CheckCircle2 className="w-6 h-6 text-[#2ED1B2] shrink-0" />
                  <span className="font-bold text-[#0F172A]">{row.gif}</span>
                </div>
                
                {/* Others (Muted Column) */}
                <div className="p-6 lg:p-8 flex items-center justify-center gap-3 text-center opacity-70">
                  {row.othersIcon === "cross" ? (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  ) : (
                    <MinusCircle className="w-5 h-5 text-[#94A3B8] shrink-0" />
                  )}
                  <span className="font-medium text-[#475569]">{row.others}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ================= 3. MOBILE STACKED CARDS ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="flex flex-col gap-5 md:hidden"
        >
          {comparisonData.map((row, index) => (
            <motion.div 
              key={index}
              variants={fadeUp}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col gap-5"
            >
              {/* Mobile Feature Title */}
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-extrabold text-[#0F172A] border-b border-[#E5E7EB] pb-3">
                {row.feature}
              </h3>
              
              {/* Mobile Comparison Layout */}
              <div className="flex flex-col gap-4">
                {/* GIF Highlight */}
                <div className="flex items-start justify-between gap-4 bg-[#2ED1B2]/10 p-4 rounded-xl border border-[#2ED1B2]/20">
                  <span className="font-bold text-[#0F172A] text-sm">Get Into Feed</span>
                  <div className="flex items-center gap-2 text-right">
                    <span className="font-bold text-[#0EA5A4] text-sm">{row.gif}</span>
                    <CheckCircle2 className="w-5 h-5 text-[#2ED1B2] shrink-0" />
                  </div>
                </div>
                
                {/* Others Muted */}
                <div className="flex items-start justify-between gap-4 p-2 opacity-70">
                  <span className="font-semibold text-[#94A3B8] text-sm">Most Agencies</span>
                  <div className="flex items-center gap-2 text-right">
                    <span className="font-medium text-[#475569] text-sm">{row.others}</span>
                    {row.othersIcon === "cross" ? (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <MinusCircle className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}