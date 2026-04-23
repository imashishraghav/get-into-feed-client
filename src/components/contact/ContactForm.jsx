// @ts-nocheck
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, ShieldCheck, ChevronDown } from "lucide-react";

// ----------------------------------------------------------------------
// Advanced Framer Motion Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

export default function ContactForm() {
  // Form State Management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    revenue: "",
    budget: "",
    goal: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      console.log("Form Data Submitted:", formData);
      alert("Thanks for reaching out! We will get back to you shortly.");
      setIsSubmitting(false);
      // Optional: Reset form
      // setFormData({ name: "", email: "", phone: "", website: "", revenue: "", budget: "", goal: "" });
    }, 1500);
  };

  return (
    <section className="relative w-full bg-white py-24 md:py-32 selection:bg-primary/20 selection:text-secondary transform-gpu" id="contact-form">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* ================= 1. HEADER ================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-12 md:mb-16 transform-gpu"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-heading text-3xl md:text-5xl font-extrabold text-navy tracking-tight mb-4"
          >
            Tell Us About Your Business
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg text-navy/70 font-medium leading-relaxed"
          >
            Fill out the form below and we’ll get back to you with a clear growth plan.
          </motion.p>
        </motion.div>

        {/* ================= 2. THE FORM ================= */}
        <motion.form 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          onSubmit={handleSubmit}
          className="bg-white border border-navy/10 rounded-[2rem] p-6 sm:p-10 md:p-12 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] flex flex-col gap-6 relative overflow-hidden transform-gpu"
        >
          {/* Subtle Background Accent */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="flex flex-col gap-2 transform-gpu">
              <label className="font-heading text-[13px] font-extrabold text-navy uppercase tracking-wider ml-1">Full Name *</label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-background border border-navy/10 rounded-2xl px-5 py-4 text-navy font-sans outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-navy/40"
              />
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col gap-2 transform-gpu">
              <label className="font-heading text-[13px] font-extrabold text-navy uppercase tracking-wider ml-1">Work Email *</label>
              <input 
                type="email" name="email" required value={formData.email} onChange={handleChange}
                placeholder="john@company.com"
                className="w-full bg-background border border-navy/10 rounded-2xl px-5 py-4 text-navy font-sans outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-navy/40"
              />
            </motion.div>
          </div>

          {/* Row 2: Phone & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="flex flex-col gap-2 transform-gpu">
              <label className="font-heading text-[13px] font-extrabold text-navy uppercase tracking-wider ml-1">Phone Number (Optional)</label>
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-background border border-navy/10 rounded-2xl px-5 py-4 text-navy font-sans outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-navy/40"
              />
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col gap-2 transform-gpu">
              <label className="font-heading text-[13px] font-extrabold text-navy uppercase tracking-wider ml-1">Business / Website *</label>
              <input 
                type="text" name="website" required value={formData.website} onChange={handleChange}
                placeholder="yourbrand.com"
                className="w-full bg-background border border-navy/10 rounded-2xl px-5 py-4 text-navy font-sans outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-navy/40"
              />
            </motion.div>
          </div>

          {/* Row 3: Revenue & Budget Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="flex flex-col gap-2 relative transform-gpu">
              <label className="font-heading text-[13px] font-extrabold text-navy uppercase tracking-wider ml-1">Monthly Revenue *</label>
              <div className="relative">
                <select 
                  name="revenue" required value={formData.revenue} onChange={handleChange}
                  className="w-full bg-background border border-navy/10 rounded-2xl px-5 py-4 pr-12 text-navy font-sans outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer invalid:text-navy/40"
                >
                  <option value="" disabled hidden>Select revenue range</option>
                  <option value="Pre-revenue / Startup">Pre-revenue / Startup</option>
                  <option value="Under ₹10 Lakh/mo">Under ₹10 Lakh/mo</option>
                  <option value="₹10L - ₹50L/mo">₹10L - ₹50L/mo</option>
                  <option value="₹50L - ₹1Cr+/mo">₹50L - ₹1Cr+/mo</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40 pointer-events-none" />
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col gap-2 relative transform-gpu">
              <label className="font-heading text-[13px] font-extrabold text-navy uppercase tracking-wider ml-1">Budget Range *</label>
              <div className="relative">
                <select 
                  name="budget" required value={formData.budget} onChange={handleChange}
                  className="w-full bg-background border border-navy/10 rounded-2xl px-5 py-4 pr-12 text-navy font-sans outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer invalid:text-navy/40"
                >
                  <option value="" disabled hidden>Select budget range</option>
                  <option value="Under ₹50,000">Under ₹50,000</option>
                  <option value="₹50,000 - ₹1.5L">₹50,000 - ₹1.5L</option>
                  <option value="₹1.5L - ₹5L">₹1.5L - ₹5L</option>
                  <option value="₹5L+">₹5L+</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40 pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Goal Textarea */}
          <motion.div variants={fadeUp} className="flex flex-col gap-2 transform-gpu">
            <label className="font-heading text-[13px] font-extrabold text-navy uppercase tracking-wider ml-1">Your Primary Goal *</label>
            <textarea 
              name="goal" required rows={3} value={formData.goal} onChange={handleChange}
              placeholder="e.g., We want to generate more qualified leads for our new real estate project..."
              className="w-full bg-background border border-navy/10 rounded-2xl px-5 py-4 text-navy font-sans outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-navy/40 resize-none"
            />
          </motion.div>

          {/* Submit Button & Trust Line */}
          <motion.div variants={fadeUp} className="mt-4 flex flex-col items-center transform-gpu">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary text-navy px-8 py-5 rounded-2xl font-bold font-heading text-lg tracking-wide shadow-[0_0_30px_-10px_rgba(46,209,178,0.4)] overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed transform-gpu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
              
              <span className="relative z-10">
                {isSubmitting ? "Sending Request..." : "Request Growth Plan"}
              </span>
              {!isSubmitting && (
                <Send className="relative z-10 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
              )}
            </motion.button>

            {/* Micro Trust Line */}
            <div className="flex items-center justify-center gap-2 mt-6 opacity-80">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span className="font-sans text-sm font-medium text-navy/60">
                No spam. No pressure. Just a clear conversation.
              </span>
            </div>
          </motion.div>

        </motion.form>
      </div>
    </section>
  );
}