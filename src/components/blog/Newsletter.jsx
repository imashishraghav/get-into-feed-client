"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

// ----------------------------------------------------------------------
// Framer Motion Variants
// ----------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API Call (Replace with Mailchimp/ConvertKit API later)
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      
      // Reset back to normal after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    }, 1200);
  };

  return (
    <section className="relative w-full bg-[#F8F9FB] py-20 md:py-28 selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4] flex justify-center px-6 md:px-12">
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        className="w-full max-w-4xl"
      >
        <div className="relative bg-white rounded-[2.5rem] p-8 md:p-14 lg:p-16 border border-[#E5E7EB] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] overflow-hidden text-center z-10">
          
          {/* ================= BACKGROUND ACCENTS ================= */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#2ED1B2]/5 rounded-full blur-[80px] pointer-events-none -z-10" />
          
          {/* Icon Header */}
          <div className="w-16 h-16 mx-auto bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Mail className="w-7 h-7 text-[#0EA5A4]" strokeWidth={1.5} />
          </div>

          {/* ================= TEXT CONTENT ================= */}
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4 leading-tight">
            Get Growth Insights in Your Inbox
          </h2>
          <p className="font-['Inter',sans-serif] text-lg text-[#475569] font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Join our newsletter and receive actionable strategies, insights, and marketing tips to scale your business.
          </p>

          {/* ================= NEWSLETTER FORM ================= */}
          <form onSubmit={handleSubmit} className="relative z-20 max-w-xl mx-auto flex flex-col md:flex-row gap-4 mb-6">
            
            <div className="relative flex-grow">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl px-6 py-4 md:py-5 text-[#0F172A] font-['Inter',sans-serif] outline-none transition-all duration-300 focus:bg-white focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/10 placeholder:text-slate-400 disabled:opacity-60"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              disabled={status === "loading" || status === "success"}
              type="submit"
              className="group shrink-0 relative flex items-center justify-center gap-2 bg-[#0F172A] text-white px-8 py-4 md:py-5 rounded-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-wide transition-all duration-300 hover:bg-[#1E293B] shadow-lg disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Internal Button Shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
              
              <AnimatePresence mode="wait">
                {status === "idle" && (
                  <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                    <span className="relative z-10">Subscribe</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.div>
                )}
                {status === "loading" && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[#2ED1B2] relative z-10">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Subscribed!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

          </form>

          {/* ================= MICRO TRUST LINE ================= */}
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#0EA5A4]" />
            <span className="font-['Inter',sans-serif] text-[13px] font-medium">
              No spam. Only valuable insights.
            </span>
          </div>

        </div>
      </motion.div>
    </section>
  );
}