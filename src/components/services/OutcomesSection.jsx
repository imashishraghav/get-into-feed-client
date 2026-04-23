// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Magnet, 
  TrendingDown, 
  MousePointerClick, 
  Layers, 
  PieChart, 
  Compass, 
  Award, 
  TrendingUp 
} from "lucide-react";

// 🟢 Import your custom animation variants
import { staggerContainer, fadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// Outcomes Data
// ----------------------------------------------------------------------
const outcomes = [
  {
    id: "lead-gen",
    title: "Consistent Lead Gen",
    description: "Get a steady, predictable flow of high-quality, high-intent leads.",
    icon: Magnet,
  },
  {
    id: "lower-cpa",
    title: "Lower Acquisition Cost",
    description: "Reduce wasted ad spend and improve your overall marketing efficiency.",
    icon: TrendingDown,
  },
  {
    id: "higher-cr",
    title: "Higher Conversion Rates",
    description: "Turn more of your existing traffic and visitors into paying customers.",
    icon: MousePointerClick,
  },
  {
    id: "scalable-system",
    title: "Scalable Growth System",
    description: "Build an acquisition system that seamlessly grows alongside your business.",
    icon: Layers,
  },
  {
    id: "better-roas",
    title: "Better Return on Ad Spend",
    description: "Maximize the actual revenue generated from every single campaign.",
    icon: PieChart,
  },
  {
    id: "clear-strategy",
    title: "Clear Marketing Strategy",
    description: "No confusion or guesswork — just a structured, data-backed plan.",
    icon: Compass,
  },
  {
    id: "strong-brand",
    title: "Strong Brand Presence",
    description: "Stand out, capture attention, and stay memorable in a crowded market.",
    icon: Award,
  },
  {
    id: "predictable-revenue",
    title: "Predictable Revenue",
    description: "Move from random, spiky results to consistent, reliable income.",
    icon: TrendingUp,
  },
];

export default function OutcomesSection() {
  const containerRef = useRef(null);

  // Localized Scroll Parallax for a subtle section lift effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const sectionLift = useSpring(rawY, { stiffness: 90, damping: 25 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-background py-16 md:py-24 overflow-hidden selection:bg-primary/20 selection:text-secondary transform-gpu"
    >
      {/* Subtle Background Glow for depth */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-[150px] pointer-events-none -z-0 transform-gpu" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20 flex flex-col items-center transform-gpu"
        >
          <motion.div variants={fadeUp} className="mb-6 transform-gpu">
            <span className="font-heading text-[11px] font-bold tracking-[0.2em] text-secondary uppercase bg-white px-4 py-2 rounded-full border border-navy/10 shadow-sm">
              What You Get
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-navy tracking-tight leading-[1.1] mb-6 text-balance transform-gpu"
          >
            Outcomes That Drive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Real Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-navy/70 font-medium leading-relaxed text-balance transform-gpu"
          >
            We focus on results that actually impact your bottom line — not vanity metrics that look good on paper.
          </motion.p>
        </motion.div>

        {/* ================= OUTCOMES GRID ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ y: sectionLift }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transform-gpu"
        >
          {outcomes.map((item) => (
            <OutcomeCard key={item.id} data={item} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Outcome Card Component
// ----------------------------------------------------------------------
function OutcomeCard({ data }) {
  const Icon = data.icon;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative bg-white border border-navy/10 rounded-2xl p-8 transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full overflow-hidden transform-gpu"
    >
      {/* Premium Inner Glow on Hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform-gpu" />

      <div className="relative z-10 flex flex-col items-start">
        {/* Animated Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-background border border-navy/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:scale-110 origin-left">
          <Icon className="w-5 h-5 text-navy/70 transition-colors duration-300 group-hover:text-secondary" strokeWidth={2} />
        </div>

        {/* Content */}
        <h3 className="font-heading text-xl font-bold text-navy mb-3 tracking-tight group-hover:text-secondary transition-colors duration-300">
          {data.title}
        </h3>
        
        <p className="font-sans text-[15px] text-navy/70 leading-relaxed font-medium">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
}