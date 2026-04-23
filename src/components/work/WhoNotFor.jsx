// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

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

const fadeRight = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

// ----------------------------------------------------------------------
// Disqualification Data
// ----------------------------------------------------------------------
const notForData = [
  {
    id: 1,
    title: "Looking for Cheap Services",
    description: "If your primary goal is finding the cheapest agency rather than the highest ROI, our premium systems aren't the right fit.",
  },
  {
    id: 2,
    title: "Expecting Quick Fixes",
    description: "Real growth requires data, testing, and optimization. We don't do overnight magic tricks or generic 'boost post' tactics.",
  },
  {
    id: 3,
    title: "No Long-Term Vision",
    description: "We partner with founders who want to build a sustainable, scalable business, not those chasing short-lived trends.",
  },
  {
    id: 4,
    title: "Not Ready to Invest",
    description: "Building a predictable revenue system requires an investment of time, trust, and capital. We need strategic partners, not micromanagers.",
  },
];

export default function WhoNotFor() {
  return (
    <section className="relative w-full bg-background py-24 md:py-32 selection:bg-rose-500/10 selection:text-rose-700 border-b border-navy/5 transform-gpu">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* ================= 1. LEFT COLUMN: STICKY HEADER ================= */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeRight}
            className="lg:col-span-5 lg:sticky lg:top-32 transform-gpu"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6 leading-tight text-balance">
              Who This Is <br className="hidden md:block" />
              <span className="text-navy/50">NOT For</span>
            </h2>
            <p className="font-sans text-lg text-navy/70 font-medium leading-relaxed mb-8 text-balance">
              We value your time as much as ours. To save us both from frustration, if these points resonate with your current mindset, we might not be the best fit right now.
            </p>
            
            {/* Subtle Muted Accent Line */}
            <div className="w-16 h-1.5 bg-navy/20 rounded-full" />
          </motion.div>

          {/* ================= 2. RIGHT COLUMN: STACKED CHECKLIST CARDS ================= */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="lg:col-span-7 flex flex-col gap-5 md:gap-6 transform-gpu"
          >
            {notForData.map((item) => (
              <CriteriaCard key={item.id} data={item} />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Disqualification Card
// ----------------------------------------------------------------------
function CriteriaCard({ data }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 6, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 bg-white border border-navy/10 rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5 cursor-default transform-gpu"
    >
      {/* Icon Container - Muted by default, soft rose on hover */}
      <div className="w-12 h-12 rounded-full bg-background border border-navy/10 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-rose-50 group-hover:border-rose-100 transition-colors duration-500">
        <X className="w-5 h-5 text-navy/40 group-hover:text-rose-500 transition-colors duration-500" strokeWidth={2.5} />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-xl font-bold text-navy tracking-tight group-hover:text-rose-600 transition-colors duration-300">
          {data.title}
        </h3>
        <p className="font-sans text-navy/70 font-medium leading-relaxed">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
}