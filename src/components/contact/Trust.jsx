// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Coffee, ShieldCheck, Compass, LineChart } from "lucide-react";

// ----------------------------------------------------------------------
// Soft Framer Motion Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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
// Trust Data (Ultra-clear, no fluff)
// ----------------------------------------------------------------------
const trustData = [
  {
    id: 1,
    title: "No Pressure",
    description: "Zero-obligation conversations. We’re here to listen, not push.",
    icon: Coffee,
  },
  {
    id: 2,
    title: "No Spam",
    description: "Your inbox stays clean. No endless automated follow-ups.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Clear Strategy",
    description: "Honest insights and a clear roadmap, even if we don't work together.",
    icon: Compass,
  },
  {
    id: 4,
    title: "Real Growth",
    description: "We focus on building predictable systems, not just running campaigns.",
    icon: LineChart,
  },
];

export default function Trust() {
  return (
    <section className="relative w-full bg-background py-12 md:py-16 selection:bg-primary/20 selection:text-secondary border-b border-navy/5 transform-gpu">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-10 transform-gpu"
        >
          {trustData.map((item) => (
            <TrustItem key={item.id} data={item} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Trust Item
// ----------------------------------------------------------------------
function TrustItem({ data }) {
  const Icon = data.icon;
  
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-[0_10px_30px_-15px_rgba(46,209,178,0.15)] transform-gpu"
    >
      {/* Soft Icon Treatment */}
      <div className="w-12 h-12 rounded-full bg-white border border-navy/10 shadow-sm flex items-center justify-center text-navy/70 mb-5 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-secondary transition-all duration-300">
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>

      {/* Typography */}
      <h3 className="font-heading text-[17px] font-extrabold text-navy mb-2 tracking-tight group-hover:text-secondary transition-colors duration-300">
        {data.title}
      </h3>
      <p className="font-sans text-[14px] text-navy/60 font-medium leading-relaxed max-w-[240px]">
        {data.description}
      </p>
    </motion.div>
  );
}