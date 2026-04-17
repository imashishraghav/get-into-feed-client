"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowRight } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-[#0a0f18] border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Green Top Border Accent */}
            <div className="h-1 w-full bg-[#3AE272]"></div>

            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">Let's scale your brand.</h3>
              <p className="text-zinc-400 text-sm mb-8">Fill out the form below and our growth experts will get back to you within 24 hours.</p>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-widest">First Name</label>
                    <input type="text" placeholder="John" className="w-full bg-[#020408] border border-white/10 p-3 text-white focus:border-[#3AE272] focus:ring-1 focus:ring-[#3AE272] outline-none transition-all placeholder:text-zinc-600" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Last Name</label>
                    <input type="text" placeholder="Doe" className="w-full bg-[#020408] border border-white/10 p-3 text-white focus:border-[#3AE272] focus:ring-1 focus:ring-[#3AE272] outline-none transition-all placeholder:text-zinc-600" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Work Email</label>
                  <input type="email" placeholder="john@company.com" className="w-full bg-[#020408] border border-white/10 p-3 text-white focus:border-[#3AE272] focus:ring-1 focus:ring-[#3AE272] outline-none transition-all placeholder:text-zinc-600" required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Service of Interest</label>
                  <select className="w-full bg-[#020408] border border-white/10 p-3 text-white focus:border-[#3AE272] focus:ring-1 focus:ring-[#3AE272] outline-none transition-all appearance-none cursor-pointer">
                    <option value="performance">Performance Marketing</option>
                    <option value="social">Social Media Growth</option>
                    <option value="content">Content Production</option>
                    <option value="influencer">Influencer Campaigns</option>
                  </select>
                </div>

                <button type="submit" className="w-full group flex items-center justify-center gap-3 bg-[#3AE272] text-[#022c22] px-8 py-4 text-[15px] font-bold uppercase tracking-wide hover:bg-white transition-colors duration-500 mt-4">
                  Send Message
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}