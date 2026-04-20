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
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-[#0F172A]/10 selection:text-[#0F172A] border-b border-[#E5E7EB]/50">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* ================= 1. LEFT COLUMN: STICKY HEADER ================= */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeRight}
            className="lg:col-span-5 lg:sticky lg:top-32"
          >
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6 leading-tight">
              Who We Work <br className="hidden md:block" />
              Best With
            </h2>
            <p className="font-['Inter',sans-serif] text-lg text-[#475569] font-medium leading-relaxed mb-8">
              To ensure we deliver the highest possible ROI, we only partner with businesses that align with our expertise. If you check these boxes, we are a perfect match.
            </p>
            
            {/* Minimal Professional Accent Line */}
            <div className="w-16 h-1.5 bg-[#0F172A] rounded-full" />
          </motion.div>

          {/* ================= 2. RIGHT COLUMN: STACKED CHECKLIST CARDS ================= */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="lg:col-span-7 flex flex-col gap-5 md:gap-6"
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
      className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 bg-[#F8F9FB] border border-[#E5E7EB] rounded-[1.5rem] p-6 md:p-8 transition-all duration-300 hover:bg-white hover:border-[#0F172A]/20 hover:shadow-[0_15px_30px_-10px_rgba(15,23,42,0.08)] cursor-default"
    >
      {/* Icon Container - Using Dark Theme for High Authority */}
      <div className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#0F172A] transition-colors duration-500">
        <Check className="w-5 h-5 text-[#2ED1B2] group-hover:text-white transition-colors duration-500" strokeWidth={3} />
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#0F172A] tracking-tight transition-colors duration-300">
          {data.title}
        </h3>
        <p className="font-['Inter',sans-serif] text-[#475569] font-medium leading-relaxed">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
}