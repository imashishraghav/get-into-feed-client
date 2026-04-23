// @ts-nocheck
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
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-primary/20 selection:text-secondary transform-gpu">
      <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="w-full flex flex-col items-center transform-gpu"
        >
          
          {/* ================= 1. HEADER ================= */}
          <motion.h2 
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-6 leading-tight text-balance"
          >
            Investment & Expectations
          </motion.h2>
          
          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-navy/70 font-medium leading-relaxed max-w-2xl mb-12 text-balance"
          >
            We work with businesses that are ready to invest in building a scalable growth system.
          </motion.p>

          {/* ================= 2. THE "BLACK CARD" PRICING BLOCK ================= */}
          <motion.div 
            variants={scaleUp}
            className="relative w-full bg-navy rounded-[2.5rem] p-10 md:p-14 lg:p-16 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.3)] overflow-hidden flex flex-col items-center justify-center border border-white/10 transform-gpu"
          >
            {/* Subtle Inner Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none transform-gpu" />

            <p className="relative z-10 font-sans text-white/70 text-base md:text-lg font-medium mb-4 uppercase tracking-widest">
              Typical Monthly Investment
            </p>

            {/* Massive Pricing Text with Teal Gradient */}
            <h3 className="relative z-10 font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6">
              ₹30,000 <span className="text-white/50 font-medium text-3xl md:text-5xl lg:text-6xl mx-1 md:mx-2">-</span> ₹1,00,000+
            </h3>

            <p className="relative z-10 font-sans text-white/70 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              Depending on your goals, scale, and the complexity of the campaign structure.
            </p>
          </motion.div>

          {/* ================= 3. OPTIONAL NOTE / TRUST LINE ================= */}
          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-2 mt-10 text-navy/70 transform-gpu"
          >
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-sans text-[15px] font-medium">
              Every engagement is completely customized based on your unique business needs.
            </span>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}