// @ts-nocheck
"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// 1. Stats Data
// ----------------------------------------------------------------------
const statsData = [
  { id: 1, prefix: "₹", value: 2, suffix: "Cr+", label: "Ad Spend Managed", icon: PieChart },
  { id: 2, prefix: "+", value: 120, suffix: "%", label: "Increase in Leads", icon: TrendingUp },
  { id: 3, prefix: "-", value: 40, suffix: "%", label: "CPA Reduction", icon: Activity },
  { id: 4, prefix: "", value: 150, suffix: "+", label: "Campaigns Launched", icon: BarChart3 },
];

// ----------------------------------------------------------------------
// 2. Case Snippets Data (Mini Case Studies)
// ----------------------------------------------------------------------
const caseSnippets = [
  {
    id: "eldeco",
    client: "Eldeco 7 Peaks",
    category: "Real Estate Lead Gen",
    title: "120% Surge in Qualified Inquiries",
    description: "Orchestrated comprehensive lead generation campaigns for the project launch, optimizing landing page architecture and meta tags to capture high-intent buyers.",
  },
  {
    id: "sobha",
    client: "Sobha Sector 1",
    category: "Performance Marketing",
    title: "Maintained 3.5x ROAS at Scale",
    description: "Managed aggressive digital marketing updates and seamless RERA-compliant performance scaling, securing maximum visibility in a highly competitive market.",
  },
  {
    id: "laxmi-pg",
    client: "Laxmi Boys PG",
    category: "Search Strategy",
    title: "Reduced CPA by 40% in 30 Days",
    description: "Deployed highly targeted search campaigns highlighting unique USPs like home-style food and zero time restrictions, dramatically lowering acquisition costs.",
  },
];

export default function ProofSection() {
  const containerRef = useRef(null);

  // 🟢 Global Background Parallax
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * -0.05);

  // 🟢 Local Scroll Parallax for Section Lift
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const sectionLift = useSpring(rawY, { stiffness: 90, damping: 25 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-white py-16 md:py-24 overflow-hidden selection:bg-primary/20 selection:text-secondary transform-gpu"
    >
      {/* Subtle Background Accent */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-1/3 left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0 transform-gpu" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20 flex flex-col items-center transform-gpu"
        >
          <motion.div variants={fadeUp} className="mb-6 transform-gpu">
            <span className="font-heading text-[11px] font-bold tracking-[0.2em] text-secondary uppercase bg-background px-4 py-2 rounded-full border border-navy/10 shadow-sm">
              Proof
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-navy tracking-tight leading-[1.1] mb-6 text-balance transform-gpu"
          >
            Results That Speak{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              for Themselves.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-navy/70 font-medium leading-relaxed text-balance transform-gpu"
          >
            We don’t rely on promises — we build systems that deliver measurable, undeniable results.
          </motion.p>
        </motion.div>

        {/* ================= STATS BENTO GRID ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ y: sectionLift }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10 transform-gpu"
        >
          {statsData.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </motion.div>

        {/* ================= CASE SNIPPETS ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ y: sectionLift }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 transform-gpu"
        >
          {caseSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Stat Card with Animated Counters
// ----------------------------------------------------------------------
function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative bg-background border border-navy/10 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:bg-white overflow-hidden transform-gpu"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="w-10 h-10 rounded-full bg-white border border-navy/10 flex items-center justify-center mb-4 text-navy/70 group-hover:text-secondary group-hover:bg-primary/5 transition-colors duration-300">
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>

      <div className="flex items-baseline mb-1">
        {stat.prefix && <span className="font-heading text-2xl md:text-3xl font-extrabold text-primary">{stat.prefix}</span>}
        <AnimatedCounter targetValue={stat.value} />
        {stat.suffix && <span className="font-heading text-2xl md:text-3xl font-extrabold text-primary">{stat.suffix}</span>}
      </div>

      <p className="font-sans text-sm md:text-base text-navy/70 font-semibold tracking-wide">
        {stat.label}
      </p>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Mini Case Snippet Card
// ----------------------------------------------------------------------
function SnippetCard({ snippet }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative bg-white border border-navy/10 rounded-[2rem] p-8 md:p-10 transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-xl hover:shadow-primary/15 flex flex-col h-full transform-gpu"
    >
      {/* Category Tag */}
      <div className="mb-6 flex justify-between items-start">
        <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
          {snippet.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="font-heading text-[13px] font-bold text-navy/50 uppercase tracking-wider mb-2">
          {snippet.client}
        </h4>
        <h3 className="font-heading text-2xl font-extrabold text-navy leading-snug mb-4 group-hover:text-secondary transition-colors duration-300">
          {snippet.title}
        </h3>
        <p className="font-sans text-navy/70 text-[15px] leading-relaxed font-medium">
          {snippet.description}
        </p>
      </div>

      {/* Decorative Interactive Bottom */}
      <div className="mt-8 pt-6 border-t border-navy/10 flex items-center text-sm font-bold font-heading text-navy group-hover:text-primary transition-colors duration-300 cursor-pointer">
        <span>View Full Strategy</span>
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300 ease-out transform-gpu" />
      </div>
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
    damping: 35,
    stiffness: 90,
    mass: 1,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(targetValue);
    }
  }, [isInView, targetValue, motionValue]);

  const displayValue = useTransform(springValue, (latest) => {
    return Math.round(latest).toLocaleString('en-US');
  });

  return (
    <motion.span 
      ref={ref} 
      className="font-heading inline-block text-4xl md:text-[2.75rem] font-extrabold text-navy tracking-tighter transition-transform duration-300 group-hover:scale-105 transform-gpu"
    >
      {displayValue}
    </motion.span>
  );
}