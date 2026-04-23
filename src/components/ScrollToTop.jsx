// @ts-nocheck
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useTransform } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 🟢 1. Track Scroll Position without causing heavy React re-renders
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show button after 300px of scrolling
    if (latest > 300) {
      if (!isVisible) setIsVisible(true);
    } else {
      if (isVisible) setIsVisible(false);
    }
  });

  // 🟢 2. Smooth Spring Physics for the Progress Ring
  const pathLength = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  });

  // 🟢 3. Lenis / Native Smooth Scroll Fallback
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8, pointerEvents: "none" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[90] gpu-accelerated"
        >
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-navy border-none shadow-soft hover:shadow-[0_12px_25px_rgba(46,209,178,0.3)] cursor-pointer focus:outline-none overflow-hidden"
            aria-label="Scroll to top"
          >
            {/* --- Advanced SVG Progress Ring --- */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" 
              viewBox="0 0 100 100"
            >
              {/* Background Track */}
              <circle 
                cx="50" cy="50" r="46" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="4" 
                fill="none" 
              />
              {/* Animated Progress Fill */}
              <motion.circle 
                cx="50" cy="50" r="46" 
                stroke="#2ED1B2" // primary color
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
                style={{ pathLength }} // Bound to scroll progress directly
                className="transition-colors duration-500 group-hover:stroke-white"
              />
            </svg>

            {/* Inner Background Hover Effect */}
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full" />

            {/* Icon */}
            <ChevronUp 
              className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-navy relative z-10 transition-colors duration-300" 
              strokeWidth={2.5} 
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}