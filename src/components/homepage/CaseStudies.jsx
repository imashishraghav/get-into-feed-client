"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// ----------------------------------------------------------------------
// Mock Data (Optimized for Scannability)
// ----------------------------------------------------------------------
const caseStudies = [
  {
    id: "01",
    client: "Luxury Real Estate Group",
    industry: "High-Ticket Real Estate",
    description:
      "Burning ad spend in a saturated market. We deployed a high-converting social funnel to bypass traditional search and target premium buyers directly.",
    metrics: [
      { value: "5", suffix: "X", label: "Lead Volume" },
      { prefix: "-", value: "65", suffix: "%", label: "Cost Per Acquisition" },
      { prefix: "$", value: "12", suffix: "M+", label: "Pipeline Generated" },
    ],
    link: "#",
  },
  {
    id: "02",
    client: "Aura Skincare",
    industry: "D2C E-Commerce",
    description:
      "Stuck at a revenue plateau. We overhauled their creative strategy, isolated winning signals, and scaled top-performing assets to dominate the feed.",
    metrics: [
      { prefix: "+", value: "340", suffix: "%", label: "Return on Ad Spend" },
      { prefix: "+", value: "2.1", suffix: "M", label: "New Revenue" },
      { prefix: "-", value: "40", suffix: "%", label: "Customer Acq. Cost" },
    ],
    link: "#",
  },
];

// ----------------------------------------------------------------------
// Animation Variants
// ----------------------------------------------------------------------
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CaseStudies() {
  return (
    // FIX: Changed py-24 md:py-32 to pt-12 md:pt-16 pb-24 md:pb-32
    <section className="relative w-full bg-white pt-12 md:pt-16 pb-24 md:pb-32 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Optimized Section Header */}
        {/* FIX: Tightened bottom margin from mb-20 to mb-12 md:mb-16 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          className="max-w-2xl mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5A4]" />
            <span className="text-xs font-bold tracking-widest text-[#0EA5A4] uppercase">
              The Proof
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight mb-5">
            Proof, Not Promises.
          </h2>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
            Here’s how we’ve helped brands engineer attention into predictable, 
            scalable revenue. No vanity metrics, just bottom-line growth.
          </p>
        </motion.div>

        {/* Case Studies Container */}
        <div className="flex flex-col gap-8 md:gap-10">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariants}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={study.link} className="group block focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2ED1B2]/30 rounded-3xl">
                {/* Refined Card UI */}
                <div className="relative flex flex-col lg:flex-row bg-[#F8F9FB] rounded-3xl p-8 md:p-10 lg:p-14 border border-[#E5E7EB] transition-all duration-500 ease-out hover:shadow-xl hover:shadow-[#2ED1B2]/5 hover:-translate-y-1 hover:border-[#2ED1B2]/30 hover:bg-white overflow-hidden">
                  
                  {/* LEFT: The Narrative (Story) */}
                  <div className="flex-1 lg:pr-16 mb-12 lg:mb-0 flex flex-col justify-between">
                    <div>
                      {/* Upgraded Premium Tag */}
                      <span className="inline-block px-3 py-1 rounded-md bg-[#2ED1B2]/5 border border-[#2ED1B2]/20 text-xs font-bold text-[#0EA5A4] uppercase tracking-wider mb-5 transition-colors duration-300 group-hover:bg-[#2ED1B2]/10">
                        {study.industry}
                      </span>
                      
                      <h3 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4 tracking-tight transition-colors duration-300">
                        {study.client}
                      </h3>
                      
                      {/* Shortened, scannable description */}
                      <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-lg">
                        {study.description}
                      </p>
                    </div>

                    {/* Optimized Actionable CTA */}
                    <div className="mt-8 flex items-center gap-2 text-[#0EA5A4] font-bold group-hover:text-[#2ED1B2] transition-colors duration-300">
                      <span className="text-[15px] tracking-wide">View Case Study</span>
                      <ArrowRight 
                        size={18} 
                        strokeWidth={2.5} 
                        className="transition-transform duration-300 group-hover:translate-x-1" 
                      />
                    </div>
                  </div>

                  {/* RIGHT: The Metrics (Proof) */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-8 relative z-10 lg:border-l lg:border-slate-200 lg:pl-16 transition-colors duration-500 group-hover:border-[#2ED1B2]/20">
                    {study.metrics.map((metric, i) => (
                      <div key={i} className="flex flex-col justify-center">
                        <div className="flex items-baseline mb-1">
                          {metric.prefix && (
                            <span className="text-3xl md:text-4xl font-black text-[#2ED1B2] mr-1 opacity-90">
                              {metric.prefix}
                            </span>
                          )}
                          {/* Dominant Metric Values */}
                          <span className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tighter">
                            {metric.value}
                          </span>
                          {metric.suffix && (
                            <span className="text-3xl md:text-4xl font-black text-[#2ED1B2] ml-1 opacity-90">
                              {metric.suffix}
                            </span>
                          )}
                        </div>
                        <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}