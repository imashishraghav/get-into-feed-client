// @ts-nocheck
"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { TrendingUp, Banknote, Rocket, Target, Users, ArrowDownRight } from "lucide-react";

// 🟢 Using clean path aliases configured in jsconfig.json
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// Metrics Data
// ----------------------------------------------------------------------
const metricsData = [
  { 
    id: "1", 
    prefix: "₹", 
    value: 10, 
    suffix: "Cr+", 
    label: "Ad Spend Managed", 
    icon: Banknote 
  },
  { 
    id: "2", 
    prefix: "+", 
    value: 300, 
    suffix: "%", 
    label: "Average Growth", 
    icon: TrendingUp 
  },
  { 
    id: "3", 
    prefix: "", 
    value: 1000, 
    suffix: "+", 
    label: "Campaigns Launched", 
    icon: Rocket 
  },
  { 
    id: "4", 
    prefix: "", 
    value: 5, 
    suffix: "x", 
    label: "ROAS Achieved", 
    icon: Target 
  },
  { 
    id: "5", 
    prefix: "", 
    value: 50, 
    suffix: "+", 
    label: "Brands Scaled", 
    icon: Users 
  },
  { 
    id: "6", 
    prefix: "-", 
    value: 40, 
    suffix: "%", 
    label: "Cost Per Lead", 
    icon: ArrowDownRight 
  },
];

export default function ResultsSection() {
  const containerRef = useRef(null);

  // 🟢 1. Global Background Parallax (Depth Effect)
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * 0.1);

  // 🟢 2. Localized Scroll Parallax for Section Lift
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const sectionLift = useSpring(rawY, { stiffness: 90, damping: 25 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-background py-16 md:py-24 overflow-hidden selection:bg-primary/20 selection:text-secondary"
    >
      {/* --- Subliminal Grid & Parallax Glow --- */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundSize: '40px 40px' }} 
      />
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0 gpu-accelerated" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20 flex flex-col items-center gpu-accelerated"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-secondary uppercase bg-white px-4 py-2 rounded-full border border-border shadow-sm">
              Results That Matter
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-navy tracking-tight leading-[1.05] mb-6 text-balance"
          >
            We Don’t Promise Growth.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              We Build It.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl font-sans text-slate-600 font-medium leading-relaxed max-w-2xl text-balance"
          >
            Our systems are designed to generate consistent leads, improve conversion rates, and scale revenue predictably.
          </motion.p>
        </motion.div>

        {/* ================= METRICS GRID ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ y: sectionLift }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 gpu-accelerated"
        >
          {metricsData.map((metric, index) => (
            <MetricCard key={metric.id} metric={metric} index={index} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Metric Card Component
// ----------------------------------------------------------------------
function MetricCard({ metric, index }) {
  const Icon = metric.icon;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      // 🟢 Applied premium-card global class & custom teal hover
      className="group relative premium-card p-8 md:p-10 transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-[0_20px_50px_-15px_rgba(46,209,178,0.15)] overflow-hidden flex flex-col"
    >
      {/* Subtle Hover Glow Overlay */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-start">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-6 group-hover:bg-primary/5 group-hover:border-primary/30 transition-colors duration-300">
          <Icon className="w-5 h-5 text-slate-600 group-hover:text-secondary transition-colors duration-300" />
        </div>

        {/* 🟢 Animated Number System */}
        <div className="flex items-baseline mb-2">
          {metric.prefix && (
            <span className="text-3xl md:text-4xl font-heading font-extrabold text-primary mr-1">
              {metric.prefix}
            </span>
          )}
          
          <AnimatedCounter targetValue={metric.value} />
          
          {metric.suffix && (
            <span className="text-3xl md:text-4xl font-heading font-extrabold text-primary ml-1">
              {metric.suffix}
            </span>
          )}
        </div>

        {/* Label */}
        <p className="font-sans text-slate-600 font-semibold text-sm md:text-base tracking-wide">
          {metric.label}
        </p>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 🟢 High-End Count-Up Engine (Spring Powered)
// ----------------------------------------------------------------------
function AnimatedCounter({ targetValue }) {
  const ref = useRef(null);
  
  // Trigger animation only when the number enters the viewport
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Motion Value initializes at 0
  const motionValue = useMotionValue(0);
  
  // Spring Physics for realistic counting deceleration
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
    mass: 1,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(targetValue);
    }
  }, [isInView, targetValue, motionValue]);

  // Format the raw spring number into a clean whole number
  const displayValue = useTransform(springValue, (latest) => {
    return Math.round(latest).toLocaleString('en-US');
  });

  return (
    <motion.span 
      ref={ref} 
      className="text-5xl md:text-6xl font-heading font-extrabold text-navy tracking-tighter"
    >
      {displayValue}
    </motion.span>
  );
}