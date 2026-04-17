"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

// ----------------------------------------------------------------------
// Data: Refined for punchy, scannable reading
// ----------------------------------------------------------------------
const comparisonData = [
  {
    bad: "Focus on clicks",
    good: "Focus on revenue",
  },
  {
    bad: "Low-effort creatives",
    good: "High-converting creatives",
  },
  {
    bad: "No clear strategy",
    good: "Predictable growth system",
  },
  {
    bad: "Inconsistent results",
    good: "Scalable, steady ROI",
  },
  {
    bad: "Gut-feeling decisions",
    good: "Data-driven optimizations",
  },
];

// ----------------------------------------------------------------------
// Premium SaaS Animation Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Comparison() {
  return (
    <section className="pt-8 pb-12 md:pt-12 md:pb-16 bg-white relative overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full pointer-events-none">
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-[#2ED1B2] opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-slate-200 opacity-[0.2] blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <motion.div
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              The Alternative
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUpVariant}
            className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6 leading-tight"
          >
            Why Most Agencies Fail — <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5A4] to-[#2ED1B2]">
              And Why We Don’t.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUpVariant}
            className="text-lg text-slate-500 font-medium mb-3"
          >
            Stop paying for vanity metrics. We build predictable engines that turn attention into actual revenue.
          </motion.p>
          
          {/* Micro Trust Line */}
          <motion.p
            variants={fadeUpVariant}
            className="text-[15px] md:text-base text-slate-800 font-semibold italic bg-slate-50/80 inline-block px-4 py-1 rounded-md"
          >
            The difference isn’t subtle — it’s structural.
          </motion.p>
        </motion.div>

        {/* Comparison Layout - Adjusted max-width, gap, and added relative for VS badge */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto relative"
        >
          
          {/* Central VS Badge (Visible on Desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full border-2 border-slate-100 items-center justify-center z-20 shadow-md">
            <span className="font-bold text-slate-400 tracking-wider">VS</span>
          </div>

          {/* Left Side: Typical Agency */}
          <motion.div
            variants={fadeUpVariant}
            className="bg-slate-50 border border-slate-200/70 rounded-3xl p-6 md:p-8 relative overflow-hidden opacity-90"
          >
            <div className="mb-8 border-b border-slate-200/70 pb-6">
              <h3 className="text-xl font-bold text-slate-400 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                </span>
                Typical Agency
              </h3>
            </div>
            
            <ul className="space-y-4">
              {comparisonData.map((item, index) => (
                <li
                  key={`bad-${index}`}
                  className="flex items-center gap-4 p-2 -ml-2 rounded-xl"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-slate-300" strokeWidth={3} />
                  </div>
                  <span className="text-slate-400 font-medium text-[15px] md:text-base">
                    {item.bad}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Side: Our Agency */}
          <motion.div
            variants={fadeUpVariant}
            className="bg-white border-2 border-[#2ED1B2]/30 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_-12px_rgba(46,209,178,0.2)] relative overflow-hidden group hover:border-[#2ED1B2]/60 hover:shadow-[0_12px_40px_-12px_rgba(46,209,178,0.3)] transition-all duration-500"
          >
            {/* Soft internal glow for the premium feel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#2ED1B2]/10 to-transparent rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="mb-8 border-b border-slate-100 pb-6 relative z-10 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#2ED1B2]/10 flex items-center justify-center shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#2ED1B2] animate-pulse" />
                </span>
                Get Into Feed
              </h3>
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#2ED1B2]/10 border border-[#2ED1B2]/20 text-[#0EA5A4] text-[10px] font-bold uppercase tracking-widest shadow-sm">
                Our System
              </span>
            </div>

            <ul className="space-y-4 relative z-10">
              {comparisonData.map((item, index) => (
                <li
                  key={`good-${index}`}
                  className="flex items-center gap-4 cursor-default p-2 -ml-2 rounded-xl hover:bg-[#2ED1B2]/5 transition-colors duration-300 group/item"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2ED1B2] flex items-center justify-center shadow-sm shadow-[#2ED1B2]/30 group-hover/item:scale-110 transition-transform duration-300 ease-out">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[#0F172A] font-semibold text-[15px] md:text-base">
                    {item.good}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}