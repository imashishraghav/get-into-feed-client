"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { TrendingUp, Building2, Target, Users } from "lucide-react";

// ----------------------------------------------------------------------
// Reusable Animation Variants
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
// Proof Metrics Data
// ----------------------------------------------------------------------
const proofData = [
  {
    id: 1,
    value: 5,
    prefix: "₹",
    suffix: "Cr+",
    label: "Revenue Generated",
    icon: TrendingUp,
  },
  {
    id: 2,
    value: 50,
    prefix: "",
    suffix: "+",
    label: "Brands Scaled",
    icon: Building2,
  },
  {
    id: 3,
    value: 300,
    prefix: "+",
    suffix: "%",
    label: "Lead Growth",
    icon: Target,
  },
  {
    id: 4,
    value: 95,
    prefix: "",
    suffix: "%",
    label: "Client Retention",
    icon: Users,
  },
];

export default function Proof() {
  return (
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ================= 1. HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6"
          >
            Proof Over Promises.
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
          >
            We don’t just run campaigns; we engineer predictable growth systems. Here is the impact we’ve created for our partners.
          </motion.p>
        </motion.div>

        {/* ================= 2. METRICS GRID ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {proofData.map((item) => (
            <MetricCard key={item.id} data={item} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Metric Card with Count-Up Animation
// ----------------------------------------------------------------------
function MetricCard({ data }) {
  const Icon = data.icon;
  
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative bg-[#F8F9FB] border border-[#E5E7EB] rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-500 ease-out hover:bg-white hover:border-[#2ED1B2]/30 hover:shadow-[0_20px_40px_-15px_rgba(46,209,178,0.15)]"
    >
      {/* Premium Icon Wrapper */}
      <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center shrink-0 text-[#0F172A] mb-6 group-hover:bg-[#2ED1B2] group-hover:border-[#2ED1B2] group-hover:text-white transition-all duration-500">
        <Icon className="w-6 h-6" strokeWidth={2} />
      </div>

      {/* Animated Number Logic */}
      <div className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tighter mb-2 group-hover:text-[#0EA5A4] transition-colors duration-300">
        <AnimatedNumber value={data.value} prefix={data.prefix} suffix={data.suffix} />
      </div>

      {/* Label */}
      <span className="font-['Inter',sans-serif] text-sm font-bold text-[#475569] uppercase tracking-wider">
        {data.label}
      </span>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// High-Performance DOM Count-Up Logic (No React Re-renders during count)
// ----------------------------------------------------------------------
function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && nodeRef.current) {
      // Direct DOM manipulation via Framer Motion's animate function
      const controls = animate(0, value, {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1], // Premium Apple-style ease-out curve
        onUpdate(currentValue) {
          if (nodeRef.current) {
            nodeRef.current.textContent = `${prefix}${Math.round(currentValue)}${suffix}`;
          }
        },
      });

      return () => controls.stop();
    }
  }, [inView, value, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}0{suffix}</span>;
}