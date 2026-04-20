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
import { staggerContainer, fadeUp } from "../../utils/animations";

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
      className="relative w-full bg-[#F8F9FB] py-16 md:py-24 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
    >
      {/* Subtle Background Glow for depth */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-[#2ED1B2]/5 to-transparent rounded-full blur-[150px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20 flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#0EA5A4] uppercase bg-white px-4 py-2 rounded-full border border-[#E5E7EB] shadow-sm">
              What You Get
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0F172A] tracking-tight leading-[1.1] mb-6"
          >
            Outcomes That Drive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
              Real Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-[#475569] font-medium leading-relaxed"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
      className="group relative bg-white border border-[#E5E7EB] rounded-2xl p-8 transition-all duration-300 ease-out hover:border-[#2ED1B2]/40 hover:shadow-[0_20px_40px_-10px_rgba(46,209,178,0.12)] flex flex-col h-full overflow-hidden"
    >
      {/* Premium Inner Glow on Hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#2ED1B2]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-start">
        {/* Animated Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#2ED1B2]/10 group-hover:border-[#2ED1B2]/30 group-hover:scale-110 origin-left">
          <Icon className="w-5 h-5 text-[#475569] transition-colors duration-300 group-hover:text-[#0EA5A4]" strokeWidth={2} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-[#0F172A] mb-3 tracking-tight group-hover:text-[#0EA5A4] transition-colors duration-300">
          {data.title}
        </h3>
        
        <p className="text-[15px] text-[#475569] leading-relaxed font-medium">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
}