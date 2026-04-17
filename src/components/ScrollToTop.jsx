"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll track karne ka logic (300px ke baad dikhega)
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Smooth scroll up logic
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[90]">
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0F172A] border border-[#0F172A] flex items-center justify-center transition-all duration-500 ease-[0.16,1,0.3,1] shadow-[0_8px_20px_rgba(15,23,42,0.15)] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        } hover:bg-[#C9A227] hover:border-[#C9A227] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(201,162,39,0.3)] group cursor-pointer`}
        aria-label="Scroll to top"
      >
        <ChevronUp 
          className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-[#0F172A] transition-colors duration-500" 
          strokeWidth={2.5} 
        />
      </button>
    </div>
  );
};

export default ScrollToTop;