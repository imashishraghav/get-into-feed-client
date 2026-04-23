// @ts-nocheck
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, TrendingUp } from "lucide-react";

// ----------------------------------------------------------------------
// Premium Linear/Stripe Animation Variants
// ----------------------------------------------------------------------
const customEase = [0.16, 1, 0.3, 1]; // Ultra-smooth Apple-like easing

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: customEase },
  },
};

const bullets = [
  "Identify revenue leaks in your funnel",
  "Improve ad performance & ROAS",
  "Increase landing page conversion rates",
  "Get a clear, actionable growth roadmap",
];

export default function LeadMagnet() {
  const [isFocused, setIsFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
  };

  return (
    <section className="relative py-12 md:py-16 bg-background overflow-hidden selection:bg-primary/20 selection:text-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Main Dark Card Container */}
        {/* TIGHTENED PADDING: Significantly reduced top/bottom (py) while keeping width */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative bg-navy rounded-[2.5rem] px-6 py-8 md:px-12 md:py-10 lg:px-20 lg:py-12 overflow-hidden shadow-2xl border border-slate-800 gpu-accelerated"
        >
          {/* --- Advanced Floating Glow Effects --- */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.08, 0.15, 0.08] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.05, 0.1, 0.05] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary rounded-full blur-[100px] pointer-events-none"
          />
          {/* -------------------------------------- */}

          {/* TIGHTENED GAP: Reduced gap between left content and right form */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Side: Copy & Value Proposition */}
            <div>
              <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-sans text-[11px] font-bold tracking-widest text-primary uppercase">
                  Free Growth Audit
                </span>
              </motion.div>

              <motion.h2 
                variants={fadeUpVariant}
                className="font-heading text-4xl md:text-5xl lg:text-[48px] font-extrabold text-white tracking-tight mb-4 leading-[1.1] text-balance"
              >
                Find Out What's Stopping Your Growth.
              </motion.h2>

              <motion.p 
                variants={fadeUpVariant}
                className="font-sans text-lg text-slate-400 mb-8 leading-relaxed max-w-md text-balance"
              >
                We analyze your ads, creatives, and funnel to uncover the exact bottlenecks holding back your revenue.
              </motion.p>

              <motion.ul 
                variants={staggerContainer}
                className="space-y-4"
              >
                {bullets.map((bullet, idx) => (
                  <motion.li 
                    key={idx}
                    variants={fadeUpVariant}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                    </div>
                    <span className="font-sans text-slate-300 font-medium text-[15px] md:text-base leading-snug">
                      {bullet}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Right Side: High-Converting Form */}
            <motion.div variants={fadeUpVariant} className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  
                  {/* Name Input */}
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      onFocus={() => setIsFocused('name')}
                      onBlur={() => setIsFocused(null)}
                      className="font-sans w-full bg-navy/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 relative z-10"
                    />
                    {/* Animated Focus Border Glow */}
                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none shadow-[0_0_15px_rgba(46,209,178,0.15)] ring-1 ring-primary ${isFocused === 'name' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Work Email"
                      required
                      onFocus={() => setIsFocused('email')}
                      onBlur={() => setIsFocused(null)}
                      className="font-sans w-full bg-navy/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 relative z-10"
                    />
                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none shadow-[0_0_15px_rgba(46,209,178,0.15)] ring-1 ring-primary ${isFocused === 'email' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>

                  {/* Website Input */}
                  <div className="relative group">
                    <input
                      type="url"
                      placeholder="Website URL"
                      required
                      onFocus={() => setIsFocused('website')}
                      onBlur={() => setIsFocused(null)}
                      className="font-sans w-full bg-navy/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all duration-300 relative z-10"
                    />
                    <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none shadow-[0_0_15px_rgba(46,209,178,0.15)] ring-1 ring-primary ${isFocused === 'website' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-full mt-2 bg-primary text-navy font-heading font-bold px-8 py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors relative group overflow-hidden"
                  >
                    {/* Soft Hover Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    
                    <span className="relative z-10">Get My Free Audit</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>

                  <p className="text-center font-sans text-xs text-slate-500 mt-1 font-medium">
                    100% Free. No commitment required.
                  </p>

                </form>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}