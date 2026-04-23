// @ts-nocheck
"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp, blurFadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// Smart String Parser for Sanity Data
// Example: "+320%" -> prefix: "+", num: 320, suffix: "%"
// Example: "₹50L+" -> prefix: "₹", num: 50, suffix: "L+"
// ----------------------------------------------------------------------
const parseMetricValue = (valString) => {
  if (!valString) return { prefix: "", num: 0, suffix: "", isFloat: false, isValid: false };
  
  // Regex to extract non-numeric start, numeric middle (including decimals), and non-numeric end
  const match = String(valString).match(/^([^0-9.-]*)([0-9.]+)([^0-9]*)$/);
  
  if (match) {
    return {
      prefix: match[1],
      num: parseFloat(match[2]),
      suffix: match[3],
      isFloat: match[2].includes('.'),
      isValid: true
    };
  }
  
  // Fallback if parsing fails (e.g., pure text)
  return { prefix: "", num: 0, suffix: valString, isFloat: false, isValid: false };
};

// ----------------------------------------------------------------------
// Fallback Data
// ----------------------------------------------------------------------
const fallbackResults = [
  { label: "Leads", value: "+320%" },
  { label: "Revenue", value: "₹50L+" },
  { label: "CPL", value: "-40%" },
  { label: "ROAS", value: "3X" }
];

export default function ResultsSection({ results = fallbackResults }) {
  const containerRef = useRef(null);

  // 🟢 1. Local Section Parallax (Lift effect on scroll)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const sectionLift = useSpring(rawY, { stiffness: 90, damping: 30 });

  // Safety check for data
  const displayResults = results?.length > 0 ? results : fallbackResults;

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-white py-20 md:py-32 overflow-hidden selection:bg-primary/20 selection:text-secondary border-t border-navy/10 transform-gpu"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="text-center mb-16 md:mb-24 transform-gpu"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-heading text-3xl md:text-5xl font-extrabold text-navy tracking-tight"
          >
            The Bottom Line
          </motion.h2>
        </motion.div>

        {/* ================= METRICS GRID ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8 transform-gpu"
        >
          {displayResults.map((item, index) => (
            <AnimatedMetricBlock key={index} item={item} index={index} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Animated Metric Component
// ----------------------------------------------------------------------
function AnimatedMetricBlock({ item, index }) {
  const { label, value, description } = item;
  const parsed = parseMetricValue(value);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Spring physics for buttery smooth count-up
  const springValue = useSpring(0, {
    damping: 40,
    stiffness: 80,
    mass: 1,
    // Add slight stagger to the start of the spring animation based on index
    delay: index * 100 
  });

  useEffect(() => {
    if (isInView && parsed.isValid) {
      springValue.set(parsed.num);
    }
  }, [isInView, parsed.isValid, parsed.num, springValue]);

  // Format the display value handling decimals (e.g., 3.5X)
  const displayValue = useTransform(springValue, (current) => {
    if (parsed.isFloat) {
      return current.toFixed(1);
    }
    return Math.round(current).toString();
  });

  return (
    <motion.div 
      variants={fadeUp} 
      className="flex flex-col items-center text-center group transform-gpu"
    >
      <div ref={ref} className="flex items-baseline justify-center mb-4 overflow-hidden">
        
        {/* Prefix (e.g., +, -, ₹) */}
        {parsed.prefix && (
          <span className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mr-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out transform-gpu">
            {parsed.prefix}
          </span>
        )}
        
        {/* Animated Number */}
        {parsed.isValid ? (
          <motion.span className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-navy tracking-tighter transform-gpu">
            {displayValue}
          </motion.span>
        ) : (
          <span className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-navy tracking-tighter transform-gpu">
            {value}
          </span>
        )}
        
        {/* Suffix (e.g., %, L+, X) */}
        {parsed.suffix && (
          <span className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary ml-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out delay-75 transform-gpu">
            {parsed.suffix}
          </span>
        )}
        
      </div>
      
      {/* Label */}
      <h3 className="font-sans text-xs md:text-sm font-bold tracking-[0.2em] text-navy/70 uppercase max-w-[180px] leading-relaxed">
        {label}
      </h3>
      
      {/* Optional Description */}
      {description && (
        <p className="font-sans mt-3 text-sm text-navy/70 font-medium max-w-[200px]">
          {description}
        </p>
      )}
    </motion.div>
  );
}