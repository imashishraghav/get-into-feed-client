"use client";

import React from 'react';
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Infinity, Search, ShoppingBag, Mail, CreditCard, BarChart2 } from 'lucide-react';

// 🟢 Import your custom smooth scroll hook!
import { useSmoothScroll } from "../../hooks/useSmoothScroll";

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
  // 1. Extract raw velocity from our smooth scroll hook
  const { velocity } = useSmoothScroll();
  
  // 2. Pass velocity through a spring so the speed changes smoothly
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  
  // Base X position tracker
  const baseX = useMotionValue(0);

  const partners = [
    { icon: Infinity, name: "Meta", highlight: "Business Partner" },
    { icon: Search, name: "Google", highlight: "Premium Partner" },
    { icon: ShoppingBag, name: "Shopify", highlight: "Plus Partner" },
    { icon: Mail, name: "Klaviyo", highlight: "Elite Master" },
    { icon: BarChart2, name: "SEMrush", highlight: "Agency Partner" },
    { icon: CreditCard, name: "Stripe", highlight: "Verified" },
  ];

  // 🟢 3. FIXED VELOCITY LOGIC
  useAnimationFrame((time, delta) => {
    // FIX: Changed base speed from 15 to 2.5 for a slow, premium crawl
    let moveBy = -1 * (delta / 1000) * 2.5; 

    // FIX: Reduced the scroll multiplier from 0.02 to 0.005 so it doesn't spin out of control on fast scrolls
    moveBy += moveBy * smoothVelocity.get() * 0.005; 

    let currentX = baseX.get() + moveBy;
    
    // Wrap Logic
    if (currentX <= -25) {
      currentX += 25;
    } else if (currentX >= 0) {
      currentX -= 25;
    }

    baseX.set(currentX);
  });

  // Convert the raw number into a percentage string for CSS transform
  const x = useTransform(baseX, (v) => `${v}%`);

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
        {/* Crisp Edge Fades */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
        
        {/* Sliding Track - Powered by Velocity */}
        <motion.div 
          style={{ x }}
          className="flex w-max items-center"
        >
          {[1, 2, 3, 4].map((set) => (
            <div key={set} className="flex items-center">
              {partners.map((partner, idx) => (
                <PartnerBadge key={`${set}-${idx}`} {...partner} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}