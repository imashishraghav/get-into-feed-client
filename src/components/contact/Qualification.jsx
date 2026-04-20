"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

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
// Content Data
// ----------------------------------------------------------------------
const isForData = [
  "Businesses ready to scale aggressively",
  "Brands already generating revenue",
  "Founders serious about long-term growth",
  "Companies wanting predictable lead generation",
];

const isNotForData = [
  "Looking for cheap or 'budget' services",
  "Want instant, overnight results",
  "Not ready to invest in their own growth",
  "Just exploring without any commitment",
];

export default function QualificationCriteria() {
  return (
    <section className="relative w-full bg-white py-20 md:py-28 selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4] border-b border-[#E5E7EB]/50">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        
        {/* ================= 1. SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4"
          >
            Is This Right For You?
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="font-['Inter',sans-serif] text-lg text-[#475569] font-medium leading-relaxed"
          >
            We don’t work with everyone. We only partner with brands where we know we can deliver massive ROI.
          </motion.p>
        </motion.div>

        {/* ================= 2. TWO-COLUMN COMPARISON ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10"
        >
          
          {/* ================= COLUMN 1: WHO THIS IS FOR (The Perfect Match) ================= */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-[#F8F9FB] border border-[#2ED1B2]/30 rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(46,209,178,0.12)] transition-all duration-300 relative overflow-hidden"
          >
            {/* Soft Green Glow in background */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#2ED1B2]/10 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[#0F172A] mb-8 flex items-center gap-3">
              <span className="bg-[#2ED1B2]/10 text-[#0EA5A4] p-2 rounded-xl">Who this is FOR</span>
            </h3>

            <ul className="flex flex-col gap-5">
              {isForData.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2ED1B2] shrink-0 mt-0.5" />
                  <span className="font-['Inter',sans-serif] text-[#0F172A] font-semibold text-lg leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>


          {/* ================= COLUMN 2: WHO THIS IS NOT FOR (The Filter) ================= */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white border border-[#E5E7EB] rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[#475569] mb-8 flex items-center gap-3">
              <span className="bg-slate-100 text-slate-500 p-2 rounded-xl">Who this is NOT for</span>
            </h3>

            <ul className="flex flex-col gap-5 opacity-80">
              {isNotForData.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                  <span className="font-['Inter',sans-serif] text-[#475569] font-medium text-lg leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}