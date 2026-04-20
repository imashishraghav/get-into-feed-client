"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { TrendingUp, Banknote, Rocket, Target, Users, ArrowDownRight } from "lucide-react";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "../../utils/animations";

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
      className="relative w-full bg-[#F8F9FB] py-6 md:py-14 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
    >
      {/* --- Subliminal Grid & Parallax Glow --- */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundSize: '40px 40px' }} 
      />
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#2ED1B2]/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20 flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-white px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              Results That Matter
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.05] mb-6"
          >
            We Don’t Promise Growth.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              We Build It.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed max-w-2xl"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
      className="group relative bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-10 transition-all duration-300 ease-out hover:border-[#2ED1B2]/40 hover:shadow-[0_20px_50px_-15px_rgba(46,209,178,0.15)] overflow-hidden flex flex-col"
    >
      {/* Subtle Hover Glow Overlay */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#2ED1B2]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-start">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center mb-6 group-hover:bg-[#2ED1B2]/5 group-hover:border-[#2ED1B2]/30 transition-colors duration-300">
          <Icon className="w-5 h-5 text-[#475569] group-hover:text-[#0EA5A4] transition-colors duration-300" />
        </div>

        {/* 🟢 Animated Number System */}
        <div className="flex items-baseline mb-2">
          {metric.prefix && (
            <span className="text-3xl md:text-4xl font-extrabold text-[#2ED1B2] mr-1">
              {metric.prefix}
            </span>
          )}
          
          <AnimatedCounter targetValue={metric.value} />
          
          {metric.suffix && (
            <span className="text-3xl md:text-4xl font-extrabold text-[#2ED1B2] ml-1">
              {metric.suffix}
            </span>
          )}
        </div>

        {/* Label */}
        <p className="text-[#475569] font-semibold text-sm md:text-base tracking-wide">
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
      className="text-5xl md:text-6xl font-extrabold text-[#0F172A] tracking-tighter"
    >
      {displayValue}
    </motion.span>
  );
}