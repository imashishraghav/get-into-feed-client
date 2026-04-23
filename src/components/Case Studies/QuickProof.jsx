// @ts-nocheck
"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// High-Impact Proof Metrics
// ----------------------------------------------------------------------
const proofMetrics = [
  { 
    id: 1, 
    prefix: "+", 
    value: 300, 
    suffix: "%", 
    label: "Lead Growth" 
  },
  { 
    id: 2, 
    prefix: "₹", 
    value: 15, 
    suffix: "Cr+", 
    label: "Client Revenue Generated" 
  },
  { 
    id: 3, 
    prefix: "-", 
    value: 40, 
    suffix: "%", 
    label: "Drop in CPA" 
  },
  { 
    id: 4, 
    prefix: "", 
    value: 20, 
    suffix: "+", 
    label: "Brands Scaled" 
  },
];

export default function QuickProof() {
  const containerRef = useRef(null);

  // 🟢 1. Global Scroll Parallax (Subtle drift)
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * -0.03);

  // 🟢 2. Local Section Parallax (Lift effect on enter)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const sectionLift = useSpring(rawY, { stiffness: 90, damping: 30 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-white py-16 md:py-24 overflow-hidden border-b border-navy/5 selection:bg-primary/20 selection:text-secondary transform-gpu"
    >
      {/* Subtle Background Glow for Depth */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-full blur-[100px] pointer-events-none z-0 transform-gpu" 
      />

      <motion.div 
        style={{ y: sectionLift }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 transform-gpu"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          // Desktop: 4 columns | Mobile: 2 columns or stacked
          className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 md:gap-x-0"
        >
          {proofMetrics.map((metric, index) => (
            <StatBlock 
              key={metric.id} 
              metric={metric} 
              isLast={index === proofMetrics.length - 1} 
              index={index}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Stat Block Component
// ----------------------------------------------------------------------
function StatBlock({ metric, isLast, index }) {
  // Logic to hide borders correctly on different screen sizes
  // Desktop: border on right (except last)
  // Mobile/Tablet: border on right for odd items, border bottom for top row
  const borderClasses = `
    relative flex flex-col items-center justify-center text-center transform-gpu
    lg:border-r lg:border-navy/10 lg:last:border-r-0
    ${index % 2 === 0 ? 'border-r border-navy/10 lg:border-r' : ''}
    ${index < 2 ? 'pb-12 border-b border-navy/10 lg:pb-0 lg:border-b-0' : 'pt-12 lg:pt-0'}
  `;

  return (
    <motion.div
      variants={fadeUp}
      className={borderClasses}
    >
      {/* Metric Value */}
      <div className="flex items-baseline justify-center mb-3">
        {metric.prefix && (
          <span className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mr-1">
            {metric.prefix}
          </span>
        )}
        <AnimatedCounter targetValue={metric.value} />
        {metric.suffix && (
          <span className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary ml-1">
            {metric.suffix}
          </span>
        )}
      </div>

      {/* Metric Label */}
      <h3 className="font-sans text-xs md:text-sm font-bold tracking-[0.2em] text-navy/70 uppercase max-w-[180px] leading-relaxed mx-auto">
        {metric.label}
      </h3>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 🟢 Reusable Spring-Powered Counter Component
// ----------------------------------------------------------------------
function AnimatedCounter({ targetValue }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 80,
    mass: 1,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(targetValue);
    }
  }, [isInView, targetValue, motionValue]);

  // Format the number to include commas (e.g., 1,000)
  const displayValue = useTransform(springValue, (latest) => {
    return Math.round(latest).toLocaleString('en-IN');
  });

  return (
    <motion.span 
      ref={ref} 
      className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-navy tracking-tighter transform-gpu"
    >
      {displayValue}
    </motion.span>
  );
}