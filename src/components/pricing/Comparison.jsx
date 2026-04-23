// @ts-nocheck
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
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-primary/20 selection:text-secondary overflow-hidden transform-gpu">
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* ================= 1. SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20 transform-gpu"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-heading text-3xl md:text-5xl font-extrabold text-navy tracking-tight mb-6 text-balance"
          >
            Why Choose Get Into Feed?
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-navy/70 font-medium leading-relaxed text-balance"
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
          className="hidden md:block bg-white border border-navy/10 rounded-3xl shadow-sm overflow-hidden transform-gpu"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1.5fr] items-center border-b border-navy/10 bg-background">
            <div className="p-8 font-heading font-bold text-navy/70 uppercase tracking-wider text-sm">
              Features & Focus
            </div>
            {/* Get Into Feed Highlighted Header */}
            <div className="p-8 bg-primary/10 border-x border-primary/20 flex flex-col items-center justify-center text-center">
              <span className="font-heading text-xl font-extrabold text-navy">
                Get Into Feed
              </span>
            </div>
            <div className="p-8 text-center font-heading font-bold text-navy/50 uppercase tracking-wider text-sm">
              Most Agencies
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col">
            {comparisonData.map((row, index) => (
              <motion.div 
                key={index}
                variants={fadeUp}
                className={`grid grid-cols-[2fr_1.5fr_1.5fr] items-center group transition-colors duration-300 hover:bg-slate-50 ${index !== comparisonData.length - 1 ? "border-b border-navy/5" : ""} transform-gpu`}
              >
                {/* Feature Name */}
                <div className="p-6 lg:p-8 font-sans text-lg font-semibold text-navy">
                  {row.feature}
                </div>
                
                {/* Get Into Feed (Highlighted Column) */}
                <div className="h-full p-6 lg:p-8 bg-primary/[0.03] border-x border-primary/10 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center gap-3 text-center">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span className="font-heading font-bold text-navy">{row.gif}</span>
                </div>
                
                {/* Others (Muted Column) */}
                <div className="p-6 lg:p-8 flex items-center justify-center gap-3 text-center opacity-70">
                  {row.othersIcon === "cross" ? (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  ) : (
                    <MinusCircle className="w-5 h-5 text-navy/50 shrink-0" />
                  )}
                  <span className="font-sans font-medium text-navy/70">{row.others}</span>
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
          className="flex flex-col gap-5 md:hidden transform-gpu"
        >
          {comparisonData.map((row, index) => (
            <motion.div 
              key={index}
              variants={fadeUp}
              className="bg-white border border-navy/10 rounded-2xl p-6 shadow-sm flex flex-col gap-5 transform-gpu"
            >
              {/* Mobile Feature Title */}
              <h3 className="font-heading text-lg font-extrabold text-navy border-b border-navy/10 pb-3">
                {row.feature}
              </h3>
              
              {/* Mobile Comparison Layout */}
              <div className="flex flex-col gap-4">
                {/* GIF Highlight */}
                <div className="flex items-start justify-between gap-4 bg-primary/10 p-4 rounded-xl border border-primary/20">
                  <span className="font-heading font-bold text-navy text-sm">Get Into Feed</span>
                  <div className="flex items-center gap-2 text-right">
                    <span className="font-heading font-bold text-secondary text-sm">{row.gif}</span>
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  </div>
                </div>
                
                {/* Others Muted */}
                <div className="flex items-start justify-between gap-4 p-2 opacity-70">
                  <span className="font-sans font-semibold text-navy/50 text-sm">Most Agencies</span>
                  <div className="flex items-center gap-2 text-right">
                    <span className="font-sans font-medium text-navy/70 text-sm">{row.others}</span>
                    {row.othersIcon === "cross" ? (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : (
                      <MinusCircle className="w-4 h-4 text-navy/50 shrink-0" />
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