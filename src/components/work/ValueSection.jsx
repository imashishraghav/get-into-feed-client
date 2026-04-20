"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LineChart, 
  Layers, 
  Hammer, 
  RefreshCcw 
} from "lucide-react";

// ----------------------------------------------------------------------
// Framer Motion Variants
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

const fadeUpHeader = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

// ----------------------------------------------------------------------
// Value Proposition Data
// ----------------------------------------------------------------------
const valueData = [
  {
    id: 1,
    title: "Predictable Lead Generation",
    description: "A system that consistently brings qualified, high-intent leads into your business month after month.",
    icon: LineChart,
  },
  {
    id: 2,
    title: "Full-Funnel Growth System",
    description: "From scroll-stopping ads to high-converting landing pages — everything is built to work together seamlessly.",
    icon: Layers,
  },
  {
    id: 3,
    title: "Strategy + Execution",
    description: "We don’t just give you a PDF guide. We build, test, execute, and scale the entire process for you.",
    icon: Hammer,
  },
  {
    id: 4,
    title: "Continuous Optimization",
    description: "Marketing never sleeps. We provide constant testing and data-driven improvements to maximize your ROI.",
    icon: RefreshCcw,
  },
];

export default function ValueSection() {
  return (
    <section className="relative w-full bg-[#F8F9FB] py-24 md:py-32 selection:bg-[#0F172A]/10 selection:text-[#0F172A]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* ================= 1. SECTION HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpHeader}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6 leading-tight">
            What You Get
          </h2>
          <p className="font-['Inter',sans-serif] text-lg md:text-xl text-[#475569] font-medium leading-relaxed">
            We don’t offer isolated services. We build complete, end-to-end systems designed to generate actual revenue.
          </p>
        </motion.div>

        {/* ================= 2. VALUE CARDS GRID ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {valueData.map((item) => (
            <ValueCard key={item.id} data={item} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Value Card Component
// ----------------------------------------------------------------------
function ValueCard({ data }) {
  const Icon = data.icon;
  
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group bg-white border border-[#E5E7EB] rounded-[2rem] p-8 md:p-10 transition-all duration-500 ease-out hover:border-[#0F172A]/30 hover:shadow-[0_20px_40px_-15px_rgba(15,23,42,0.08)] flex flex-col h-full"
    >
      {/* Icon Container (2D Premium Aesthetic) */}
      <div className="w-14 h-14 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center mb-8 group-hover:bg-[#0F172A] group-hover:border-[#0F172A] transition-all duration-500 ease-out">
        <Icon className="w-6 h-6 text-[#0F172A] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
      </div>

      {/* Text Content */}
      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#0F172A] tracking-tight mb-4 group-hover:text-[#2ED1B2] transition-colors duration-300">
        {data.title}
      </h3>
      <p className="font-['Inter',sans-serif] text-lg text-[#475569] font-medium leading-relaxed flex-grow">
        {data.description}
      </p>

      {/* Decorative Bottom Line that expands on hover */}
      <div className="mt-8 w-8 h-1 bg-[#E5E7EB] rounded-full group-hover:w-16 group-hover:bg-[#0F172A] transition-all duration-500 ease-out" />
    </motion.div>
  );
}