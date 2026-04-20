"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

// 🟢 Import your custom lag-free smooth scroll hook & animation variants
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { staggerContainer, fadeUp, blurFadeUp } from "@/utils/animations";

// ----------------------------------------------------------------------
// Fallback Data (For UI Testing)
// ----------------------------------------------------------------------
const fallbackTestimonial = {
  quote: "The marketing systems built by the Get Into Feed team completely transformed our pipeline. We finally have a system that generates consistent leads and predictable revenue. They don't just run ads; they optimize for actual business growth.",
  clientName: "Amit Sharma",
  role: "Founder",
  company: "Real Estate Business",
  imageUrl: null, // Replace with actual Sanity image URL
};

// ----------------------------------------------------------------------
// Avatar Fallback Helper
// ----------------------------------------------------------------------
const FallbackAvatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F8F9FB] to-[#E5E7EB] border border-[#E5E7EB] flex items-center justify-center text-[#0EA5A4] text-xl font-bold shadow-sm shrink-0">
      {initial}
    </div>
  );
};

export default function CaseStudyTestimonial({ testimonial = fallbackTestimonial }) {
  const containerRef = useRef(null);

  // 🟢 1. Global Scroll Parallax (Subtle Background Drift)
  const { scrollY } = useSmoothScroll();
  const bgDrift = useTransform(scrollY, (y) => y * 0.05);

  // 🟢 2. Local Section Parallax (Lift effect on enter)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const sectionLift = useSpring(rawY, { stiffness: 90, damping: 30 });

  // Use fallback if data is missing
  const data = testimonial?.quote ? testimonial : fallbackTestimonial;

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#F8F9FB] py-20 md:py-32 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
    >
      {/* --- Ambient Background Glow --- */}
      <motion.div 
        style={{ y: bgDrift }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#2ED1B2]/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0" 
      />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 flex justify-center">
        
        {/* ================= TESTIMONIAL CARD ================= */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ y: sectionLift }}
          className="relative w-full max-w-4xl bg-white border border-[#E5E7EB] rounded-[2.5rem] p-8 md:p-16 lg:p-20 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-center group"
        >
          {/* Top Premium Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-gradient-to-r from-transparent via-[#2ED1B2] to-transparent opacity-80" />

          {/* Large Watermark Quote Icon */}
          <Quote className="absolute top-10 md:top-12 left-1/2 -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 text-[#F8F9FB] rotate-180 z-0 transition-transform duration-700 group-hover:scale-105" strokeWidth={1} />

          {/* --- Content --- */}
          <div className="relative z-10 flex flex-col items-center w-full">
            
            {/* 1. The Quote */}
            <blockquote className="text-xl md:text-3xl lg:text-[2rem] text-[#0F172A] font-medium leading-relaxed tracking-tight mb-12 max-w-3xl">
              "{data.quote}"
            </blockquote>

            {/* 2. Client Identity */}
            <div className="flex flex-col items-center gap-4">
              
              {/* Avatar */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                {data.imageUrl ? (
                  <Image 
                    src={data.imageUrl} 
                    alt={data.clientName} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <FallbackAvatar name={data.clientName} />
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col items-center">
                <h4 className="text-lg md:text-xl font-bold text-[#0F172A] leading-snug">
                  {data.clientName}
                </h4>
                <p className="text-sm md:text-[15px] font-semibold text-[#475569] mt-1">
                  {data.role}
                  {data.company && (
                    <>
                      <span className="text-[#2ED1B2] mx-2">•</span>
                      <span>{data.company}</span>
                    </>
                  )}
                </p>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}