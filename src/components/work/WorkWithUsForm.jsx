// @ts-nocheck
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ShieldCheck, ChevronDown, CheckCircle2 } from "lucide-react";

// ----------------------------------------------------------------------
// Framer Motion Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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

export default function WorkWithUsForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    revenue: "",
    budget: "",
    goal: "",
    challenge: "",
  });

  const [status, setStatus] = useState("idle"); // idle | loading | success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API Call / Backend Integration
    setTimeout(() => {
      console.log("Application Submitted:", formData);
      setStatus("success");
      
      // Optional: Reset form after some time
      // setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <section className="relative w-full bg-[#F8F9FB] py-24 md:py-32 selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]" id="apply">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* ================= 1. HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="text-center mb-12 md:mb-16"
        >
          {/* 🟢 FIX: Replaced custom font string with global 'font-heading' */}
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4 text-balance">
            Apply to Work With Us
          </h2>
          {/* 🟢 FIX: Replaced custom font string with global 'font-sans' */}
          <p className="font-sans text-lg text-[#475569] font-medium leading-relaxed max-w-2xl mx-auto text-balance">
            Tell us about your business and goals. We’ll review your application and get back to you.
          </p>
        </motion.div>

        {/* ================= 2. APPLICATION FORM ================= */}
        <motion.form 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          onSubmit={handleSubmit}
          // 🟢 FIX: Used premium-card utility for cleaner styling
          className="premium-card p-6 sm:p-10 md:p-14 flex flex-col gap-6 md:gap-8 relative overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2ED1B2]/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <motion.div variants={fadeUp} className="flex flex-col gap-2.5">
              <label className="font-heading text-[13px] font-bold text-[#0F172A] uppercase tracking-wider ml-1">Full Name *</label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-[#0F172A] font-sans outline-none transition-all duration-300 focus:bg-white focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/10 placeholder:text-slate-400"
              />
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col gap-2.5">
              <label className="font-heading text-[13px] font-bold text-[#0F172A] uppercase tracking-wider ml-1">Email Address *</label>
              <input 
                type="email" name="email" required value={formData.email} onChange={handleChange}
                placeholder="john@company.com"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-[#0F172A] font-sans outline-none transition-all duration-300 focus:bg-white focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/10 placeholder:text-slate-400"
              />
            </motion.div>
          </div>

          {/* Row 2: Phone & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <motion.div variants={fadeUp} className="flex flex-col gap-2.5">
              <label className="font-heading text-[13px] font-bold text-[#0F172A] uppercase tracking-wider ml-1">Phone Number</label>
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-[#0F172A] font-sans outline-none transition-all duration-300 focus:bg-white focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/10 placeholder:text-slate-400"
              />
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col gap-2.5">
              <label className="font-heading text-[13px] font-bold text-[#0F172A] uppercase tracking-wider ml-1">Business Name / Website *</label>
              <input 
                type="text" name="website" required value={formData.website} onChange={handleChange}
                placeholder="yourbrand.com"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-[#0F172A] font-sans outline-none transition-all duration-300 focus:bg-white focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/10 placeholder:text-slate-400"
              />
            </motion.div>
          </div>

          {/* Row 3: Qualification Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <motion.div variants={fadeUp} className="flex flex-col gap-2.5 relative">
              <label className="font-heading text-[13px] font-bold text-[#0F172A] uppercase tracking-wider ml-1">Monthly Revenue *</label>
              <div className="relative">
                <select 
                  name="revenue" required value={formData.revenue} onChange={handleChange}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl px-5 py-4 pr-12 text-[#0F172A] font-sans outline-none transition-all duration-300 focus:bg-white focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/10 appearance-none cursor-pointer invalid:text-slate-400"
                >
                  <option value="" disabled hidden>Select revenue range</option>
                  <option value="Below ₹50K">Below ₹50K</option>
                  <option value="₹50K – ₹2L">₹50K – ₹2L</option>
                  <option value="₹2L – ₹10L">₹2L – ₹10L</option>
                  <option value="₹10L+">₹10L+</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col gap-2.5 relative">
              <label className="font-heading text-[13px] font-bold text-[#0F172A] uppercase tracking-wider ml-1">Marketing Budget *</label>
              <div className="relative">
                <select 
                  name="budget" required value={formData.budget} onChange={handleChange}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl px-5 py-4 pr-12 text-[#0F172A] font-sans outline-none transition-all duration-300 focus:bg-white focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/10 appearance-none cursor-pointer invalid:text-slate-400"
                >
                  <option value="" disabled hidden>Select budget range</option>
                  <option value="Below ₹20K">Below ₹20K</option>
                  <option value="₹20K – ₹50K">₹20K – ₹50K</option>
                  <option value="₹50K – ₹1L">₹50K – ₹1L</option>
                  <option value="₹1L+">₹1L+</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Row 4: Detailed Answers */}
          <motion.div variants={fadeUp} className="flex flex-col gap-2.5">
            <label className="font-heading text-[13px] font-bold text-[#0F172A] uppercase tracking-wider ml-1">What are you trying to achieve? *</label>
            <textarea 
              name="goal" required rows={2} value={formData.goal} onChange={handleChange}
              placeholder="E.g., We want to generate 50 qualified real estate leads per month..."
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-[#0F172A] font-sans outline-none transition-all duration-300 focus:bg-white focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/10 placeholder:text-slate-400 resize-none"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-2.5">
            <label className="font-heading text-[13px] font-bold text-[#0F172A] uppercase tracking-wider ml-1">What’s stopping your growth right now? *</label>
            <textarea 
              name="challenge" required rows={2} value={formData.challenge} onChange={handleChange}
              placeholder="E.g., Our ad costs are too high and leads are poor quality..."
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-[#0F172A] font-sans outline-none transition-all duration-300 focus:bg-white focus:border-[#2ED1B2] focus:ring-4 focus:ring-[#2ED1B2]/10 placeholder:text-slate-400 resize-none"
            />
          </motion.div>

          {/* Submit Button & Trust Line */}
          <motion.div variants={fadeUp} className="mt-4 flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={status === "loading" || status === "success"}
              type="submit"
              className="group relative w-full flex items-center justify-center gap-3 bg-[#0F172A] text-white px-8 py-5 rounded-2xl font-bold text-lg tracking-wide shadow-lg overflow-hidden disabled:opacity-80 disabled:cursor-not-allowed hover:bg-[#1e293b] transition-colors duration-300"
            >
              {/* Premium Inner Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
              
              <AnimatePresence mode="wait">
                {status === "idle" && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <span className="relative z-10 font-heading">Submit Application</span>
                    <Send className="relative z-10 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
                  </motion.div>
                )}
                {status === "loading" && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="font-heading">Reviewing details...</span>
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex items-center gap-2 text-[#2ED1B2]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-heading text-white">Application Sent!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Micro Trust Line */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <ShieldCheck className="w-4 h-4 text-[#2ED1B2]" />
              <span className="font-sans text-sm font-medium text-[#64748B]">
                We review every application carefully. No spam. No pressure.
              </span>
            </div>
          </motion.div>

        </motion.form>
      </div>
    </section>
  );
}