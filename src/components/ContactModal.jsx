// @ts-nocheck
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 🟢 1. Handle Scroll Lock & ESC Key to Close
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Reset states when opened
      setIsSuccess(false);
      setIsSubmitting(false);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // 🟢 2. Simulated Submit Handler (Replace with actual API call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request (e.g., fetch to /api/contact)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-navy border border-white/10 rounded-3xl shadow-2xl overflow-hidden gpu-accelerated"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />

            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10 relative">
              <AnimatePresence mode="wait">
                
                {/* 🟢 SUCCESS STATE */}
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-heading text-3xl font-extrabold text-white mb-3">Request Sent!</h3>
                    <p className="font-sans text-slate-400 leading-relaxed mb-8 max-w-sm">
                      Our growth experts have received your details. We'll be in touch within 24 hours.
                    </p>
                    <button 
                      onClick={onClose}
                      className="bg-white/10 text-white font-bold py-3 px-8 rounded-full hover:bg-white/20 transition-colors"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  
                  /* 🟢 FORM STATE */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 id="modal-title" className="font-heading text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
                      Let's scale your brand.
                    </h3>
                    <p className="font-sans text-slate-400 text-sm mb-8">
                      Fill out the form below and our experts will get back to you within 24 hours.
                    </p>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                      
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label htmlFor="firstName" className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                          <input 
                            id="firstName"
                            type="text" 
                            placeholder="John" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-sans" 
                            required 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="lastName" className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                          <input 
                            id="lastName"
                            type="text" 
                            placeholder="Doe" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-sans" 
                            required 
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                        <input 
                          id="email"
                          type="email" 
                          placeholder="john@company.com" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-sans" 
                          required 
                        />
                      </div>

                      {/* Service Dropdown */}
                      <div className="space-y-1.5">
                        <label htmlFor="service" className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service of Interest</label>
                        <div className="relative">
                          <select 
                            id="service"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer font-sans"
                          >
                            <option value="performance" className="bg-navy">Performance Marketing</option>
                            <option value="social" className="bg-navy">Social Media Growth</option>
                            <option value="content" className="bg-navy">Content Production</option>
                            <option value="influencer" className="bg-navy">Influencer Campaigns</option>
                          </select>
                          {/* Custom Dropdown Arrow */}
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full group flex items-center justify-center gap-3 bg-primary text-navy rounded-xl px-8 py-4 font-heading text-[15px] font-bold uppercase tracking-wide hover:bg-[#4df287] transition-all duration-300 mt-6 shadow-[0_0_20px_rgba(46,209,178,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}