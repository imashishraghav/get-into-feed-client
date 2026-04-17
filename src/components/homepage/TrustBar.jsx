"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Infinity, Search, ShoppingBag, Mail, CreditCard, BarChart2 } from 'lucide-react';

// --- Premium Partner Badge Component ---
const PartnerBadge = ({ icon: Icon, name, highlight }) => (
  <div className="flex items-center justify-center gap-3 px-12 cursor-pointer group">
    <Icon className="w-7 h-7 text-[#94A3B8] group-hover:text-[#2ED1B2] transition-colors duration-500" />
    <div className="flex flex-col">
      <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-[#94A3B8] group-hover:text-[#0F172A] transition-colors duration-500 whitespace-nowrap leading-none">
        {name}
      </span>
      {highlight && (
        <span className="text-[9px] font-body font-bold uppercase tracking-widest text-[#2ED1B2] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-1">
          {highlight}
        </span>
      )}
    </div>
  </div>
);

export default function TrustBar() {
  // We duplicate the array to create a seamless, infinite loop
  const partners = [
    { icon: Infinity, name: "Meta", highlight: "Business Partner" },
    { icon: Search, name: "Google", highlight: "Premium Partner" },
    { icon: ShoppingBag, name: "Shopify", highlight: "Plus Partner" },
    { icon: Mail, name: "Klaviyo", highlight: "Elite Master" },
    { icon: BarChart2, name: "SEMrush", highlight: "Agency Partner" },
    { icon: CreditCard, name: "Stripe", highlight: "Verified" },
  ];

  return (
    <div className="pt-6 pb-10 bg-white border-b border-[#E5E7EB] overflow-hidden relative flex flex-col items-center z-10 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.05)]">
      
      {/* Premium Micro-Label */}
      <div className="flex items-center gap-4 mb-6 text-center relative z-20 w-full max-w-7xl px-6">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E5E7EB]" />
        <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-[#64748B] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2ED1B2] animate-pulse" />
          Certified Platform Partners
        </p>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E5E7EB]" />
      </div>

      {/* Marquee Container */}
      <div className="relative w-full flex items-center overflow-hidden">
        {/* Crisp Edge Fades (Matches pure white background) */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
        
        {/* Sliding Track - Flawless Framer Motion Loop */}
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 35 // Increase or decrease for speed control
          }}
          className="flex w-max items-center"
        >
          {/* First Render */}
          <div className="flex items-center">
            {partners.map((partner, idx) => (
              <PartnerBadge key={`first-${idx}`} {...partner} />
            ))}
          </div>
          
          {/* Second Render (Creates the infinite illusion) */}
          <div className="flex items-center">
            {partners.map((partner, idx) => (
              <PartnerBadge key={`second-${idx}`} {...partner} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}