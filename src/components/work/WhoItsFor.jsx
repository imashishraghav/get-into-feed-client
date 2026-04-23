// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
// Qualification Data
// ----------------------------------------------------------------------
const criteriaData = [
  {
    id: 1,
    title: "Ready to Scale",
    description: "Your business has proven its offer, and you are ready to scale your growth aggressively without breaking operations.",
  },
  {
    id: 2,
    title: "Already Earning",
    description: "We work best with established brands already generating revenue. We are here to multiply results, not start from absolute zero.",
  },
  {
    id: 3,
    title: "Serious About Growth",
    description: "Founders who understand that real, sustainable growth takes time, consistency, and a solid foundation.",
  },
  {
    id: 4,
    title: "Wants Systems",
    description: "You are tired of random, disjointed campaigns and want predictable, scalable lead generation systems.",
  },
  {
    id: 5,
    title: "Open to Strategy",
    description: "You are willing to trust the experts, pivot when data demands it, and let us handle the heavy lifting of execution.",
  },
];

export default function WhoItsFor() {
  return (
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-navy/10 selection:text-navy border-b border-navy/5 transform-gpu">
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
              Who We Work <br className="hidden md:block" />
              Best With
            </h2>
            <p className="font-sans text-lg text-navy/70 font-medium leading-relaxed mb-8 text-balance">
              To ensure we deliver the highest possible ROI, we only partner with businesses that align with our expertise. If you check these boxes, we are a perfect match.
            </p>
            
            {/* Minimal Professional Accent Line */}
            <div className="w-16 h-1.5 bg-navy rounded-full" />
          </motion.div>

          {/* ================= 2. RIGHT COLUMN: STACKED CHECKLIST CARDS ================= */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="lg:col-span-7 flex flex-col gap-5 md:gap-6 transform-gpu"
          >
            {criteriaData.map((item) => (
              <CriteriaCard key={item.id} data={item} />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Criteria Card
// ----------------------------------------------------------------------
function CriteriaCard({ data }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ x: 6, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 bg-background border border-navy/10 rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 hover:bg-white hover:border-navy/20 hover:shadow-xl hover:shadow-navy/5 cursor-default transform-gpu"
    >
      {/* Icon Container - Using Dark Theme for High Authority */}
      <div className="w-12 h-12 rounded-full bg-white border border-navy/10 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-navy transition-colors duration-500">
        <Check className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-500" strokeWidth={3} />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading text-xl font-bold text-navy tracking-tight transition-colors duration-300">
          {data.title}
        </h3>
        <p className="font-sans text-navy/70 font-medium leading-relaxed">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
}