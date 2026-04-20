"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

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

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 350, damping: 28 } 
  },
};

export default function PricingExpectation() {
  return (
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="w-full flex flex-col items-center"
        >
          
          {/* ================= 1. HEADER ================= */}
          <motion.h2 
            variants={fadeUp}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6 leading-tight"
          >
            Investment & Expectations
          </motion.h2>
          
          <motion.p 
            variants={fadeUp}
            className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed max-w-2xl mb-12"
          >
            We work with businesses that are ready to invest in building a scalable growth system.
          </motion.p>

          {/* ================= 2. THE "BLACK CARD" PRICING BLOCK ================= */}
          <motion.div 
            variants={scaleUp}
            className="relative w-full bg-[#0F172A] rounded-[2.5rem] p-10 md:p-14 lg:p-16 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.3)] overflow-hidden flex flex-col items-center justify-center border border-slate-800"
          >
            {/* Subtle Inner Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#2ED1B2]/10 rounded-full blur-[80px] pointer-events-none" />

            <p className="relative z-10 font-['Inter',sans-serif] text-slate-300 text-base md:text-lg font-medium mb-4 uppercase tracking-widest">
              Typical Monthly Investment
            </p>

            {/* Massive Pricing Text with Teal Gradient */}
            <h3 className="relative z-10 font-['Plus_Jakarta_Sans',sans-serif] text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] mb-6">
              ₹30,000 <span className="text-slate-500 font-medium text-3xl md:text-5xl lg:text-6xl mx-1 md:mx-2">-</span> ₹1,00,000+
            </h3>

            <p className="relative z-10 font-['Inter',sans-serif] text-slate-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              Depending on your goals, scale, and the complexity of the campaign structure.
            </p>
          </motion.div>

          {/* ================= 3. OPTIONAL NOTE / TRUST LINE ================= */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2 mt-10 text-[#475569]"
          >
            <ShieldCheck className="w-5 h-5 text-[#2ED1B2]" />
            <span className="font-['Inter',sans-serif] text-[15px] font-medium">
              Every engagement is completely customized based on your unique business needs.
            </span>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}