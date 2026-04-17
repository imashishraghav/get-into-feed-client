"use client";

import { motion } from "framer-motion";
import { Check, X, Info } from "lucide-react";
import Link from "next/link";

// ----------------------------------------------------------------------
// Premium SaaS Animation Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }, // Apple-like smooth ease
  },
};

export default function Pricing({ plans = [] }) {
  if (!plans || plans.length === 0) return null;

  return (
    <section className="relative py-24 md:py-32 bg-[#F8F9FB] overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2ED1B2] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <motion.h2 
            variants={fadeUpVariant} 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight mb-6"
          >
            Simple Pricing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5A4] to-[#2ED1B2]">Real Growth.</span>
          </motion.h2>
          <motion.p 
            variants={fadeUpVariant} 
            className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed"
          >
            Choose a plan designed to generate leads, scale revenue, and build a predictable growth system.
          </motion.p>
        </motion.div>

        {/* Dynamic Pricing Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => {
            const isPopular = plan.isPopular;

            return (
              <motion.div 
                key={plan._id || index} 
                variants={fadeUpVariant}
                className={`relative z-${isPopular ? '20' : '10'}`}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`relative flex flex-col h-full rounded-[2rem] p-8 md:p-10 transition-all duration-500 ease-out ${
                    isPopular 
                      ? "bg-[#0F172A] border-2 border-[#2ED1B2]/40 shadow-[0_20px_50px_-12px_rgba(46,209,178,0.25)] lg:scale-105 hover:border-[#2ED1B2]" 
                      : "bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300"
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && plan.badge && (
                    <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                      <div className="bg-gradient-to-r from-[#0EA5A4] to-[#2ED1B2] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-8">
                    <h3 className={`text-2xl font-bold mb-2 ${isPopular ? "text-white" : "text-[#0F172A]"}`}>
                      {plan.planName}
                    </h3>
                    <p className={`text-sm font-medium leading-relaxed ${isPopular ? "text-slate-400" : "text-slate-500"}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className={`mb-8 pb-8 border-b ${isPopular ? "border-slate-700/50" : "border-slate-100"}`}>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl md:text-5xl font-extrabold tracking-tighter ${isPopular ? "text-white" : "text-[#0F172A]"}`}>
                        {plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice.toLowerCase() !== "custom" && (
                        <span className={`text-sm font-semibold ${isPopular ? "text-slate-400" : "text-slate-500"}`}>
                          /mo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Call to Action */}
                  <Link href={plan.ctaLink || "#"} className="w-full mb-10 block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                        isPopular 
                          ? "bg-[#2ED1B2] text-[#0F172A] hover:bg-[#28B89D] hover:shadow-lg hover:shadow-[#2ED1B2]/20" 
                          : "bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {plan.ctaText || "Get Started"}
                    </motion.button>
                  </Link>

                  {/* Features List */}
                  <div className="space-y-4 mt-auto">
                    {plan.features?.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        {/* Icon Logic */}
                        <div className="shrink-0 mt-0.5">
                          {feature.isIncluded ? (
                            <div className={`flex items-center justify-center w-5 h-5 rounded-full ${isPopular ? 'bg-[#2ED1B2]/20' : 'bg-[#2ED1B2]/10'}`}>
                              <Check className={`w-3.5 h-3.5 ${isPopular ? 'text-[#2ED1B2]' : 'text-[#0EA5A4]'}`} strokeWidth={3} />
                            </div>
                          ) : (
                            <X className={`w-5 h-5 ${isPopular ? 'text-slate-600' : 'text-slate-300'}`} strokeWidth={2} />
                          )}
                        </div>

                        {/* Feature Text & Tooltip Logic */}
                        <div className="flex items-center gap-2 relative group flex-1">
                          <span className={`text-[15px] font-medium leading-snug ${
                            !feature.isIncluded 
                              ? (isPopular ? 'text-slate-600 line-through' : 'text-slate-400 line-through') 
                              : (isPopular ? 'text-slate-200' : 'text-slate-700')
                          }`}>
                            {feature.featureName}
                          </span>
                          
                          {/* Tooltip implementation */}
                          {feature.tooltip && (
                            <div className="relative flex items-center cursor-help">
                              <Info className={`w-4 h-4 ${isPopular ? 'text-slate-500' : 'text-slate-400'} hover:text-[#2ED1B2] transition-colors`} />
                              
                              {/* Tooltip Box */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                                <div className="bg-slate-900 text-white text-xs font-medium rounded-lg py-2 px-3 shadow-xl border border-slate-700 text-center">
                                  {feature.tooltip}
                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Global Conversion Note */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.p variants={fadeUpVariant} className="text-slate-500 font-medium flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-[#2ED1B2]" />
            Every plan includes strategy, execution, and continuous optimization.
          </motion.p>
        </motion.div>

      </div>
    </section>
  );
}