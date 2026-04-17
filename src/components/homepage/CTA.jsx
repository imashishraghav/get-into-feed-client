"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

// Import your global motion system (adjust path as needed)
import { staggerContainer, fadeUp, buttonMotion } from "../../utils/animations";

export default function FinalCTA() {
  return (
    // TIGHTENED: Reduced py-32/48 to py-16/24 for a much more compact vertical footprint
    <section className="relative py-16 md:py-24 bg-[#0F172A] overflow-hidden selection:bg-[#2ED1B2]/30 selection:text-white">
      
      {/* --- Advanced Background Glow Loops --- */}
      <motion.div
        animate={{ 
          opacity: [0.15, 0.3, 0.15], 
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[600px] h-[300px] bg-[#2ED1B2] rounded-full blur-[150px] pointer-events-none -translate-y-1/2 -translate-x-1/4"
      />
      <motion.div
        animate={{ 
          opacity: [0.1, 0.2, 0.1], 
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#0EA5A4] rounded-full blur-[120px] pointer-events-none translate-y-1/2 translate-x-1/4"
      />
      {/* -------------------------------------- */}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03] pointer-events-none" style={{ backgroundSize: '40px 40px' }} />

      {/* WIDENED: Changed max-w-4xl to max-w-7xl to support horizontal layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          // SPLIT LAYOUT: Changed flex-col to grid 2-columns
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
        >
          
          {/* ================= LEFT SIDE: COPY ================= */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Micro Status Badge */}
            {/* TIGHTENED: Reduced mb-8 to mb-5 */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 backdrop-blur-md">
              <Zap className="w-4 h-4 text-[#2ED1B2]" fill="#2ED1B2" />
              <span className="text-[11px] font-bold tracking-widest text-[#2ED1B2] uppercase">
                Your Growth Partner
              </span>
            </motion.div>

            {/* Powerful Headline */}
            {/* ADJUSTED: Font size slightly tweaked to fit split layout perfectly */}
            <motion.h2 
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter mb-5 leading-[1.05]"
            >
              Ready to Scale Your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] via-[#0EA5A4] to-[#2ED1B2] animate-gradient-x">
                Revenue Predictably?
              </span>
            </motion.h2>

            {/* Clear Subheading */}
            {/* TIGHTENED: Removed bottom margin (mb-12) since it's the last item on the left */}
            <motion.p 
              variants={fadeUp}
              className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed"
            >
              Stop paying for clicks and vanity metrics. Let’s generate qualified leads, improve conversions, and build a system that owns your market.
            </motion.p>
          </div>

          {/* ================= RIGHT SIDE: CTA ================= */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end lg:text-right mt-4 lg:mt-0">
            {/* Primary CTA Button */}
            <motion.div variants={fadeUp} className="w-full sm:w-auto">
              <Link href="/book-call">
                <motion.button
                  {...buttonMotion}
                  // TIGHTENED: Slightly reduced py-5 to py-4
                  className="relative group w-full sm:w-auto overflow-hidden bg-[#2ED1B2] text-[#0F172A] font-bold text-[15px] tracking-wide px-8 py-4 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(46,209,178,0.2)] hover:shadow-[0_0_60px_rgba(46,209,178,0.35)] transition-shadow duration-500"
                >
                  {/* --- Micro Interaction: Shimmer Sweep --- */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                  {/* --------------------------------------- */}

                  <span className="relative z-10">Book Free Strategy Call</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Secondary Reassurance */}
            {/* TIGHTENED: Reduced mt-8 to mt-4 */}
            <motion.div 
              variants={fadeUp} 
              className="mt-4 flex items-center justify-center lg:justify-end gap-2 text-slate-500 font-medium text-sm w-full sm:w-auto"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <p>No long-term contracts. Just results.</p>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}