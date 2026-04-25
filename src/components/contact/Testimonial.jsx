// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image"; // 🟢 Added for dynamic image rendering

// ----------------------------------------------------------------------
// Framer Motion Variants
// ----------------------------------------------------------------------
const cardReveal = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 25,
      duration: 0.6 
    } 
  },
};

// ----------------------------------------------------------------------
// Premium Fallback Data (Just in case Sanity is empty)
// ----------------------------------------------------------------------
const fallbackData = {
  name: "Amit Sharma",
  role: "Founder",
  company: "Real Estate Business",
  testimonial: "We finally have a system that generates consistent leads and predictable revenue. The clarity and results have been incredible.",
  imageUrl: null,
};

// 🟢 Helper to get initials (e.g., "Amit Sharma" -> "AS")
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// 🟢 FIX: Accept 'data' prop from the server page
export default function Testimonial({ data }) {
  // Use Sanity data if available, otherwise use fallback
  const content = data || fallbackData;

  return (
    <section className="relative w-full bg-background py-16 md:py-24 selection:bg-primary/20 selection:text-secondary flex justify-center transform-gpu">
      <div className="max-w-4xl w-full px-6 md:px-12">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={cardReveal}
          className="relative bg-white rounded-[2.5rem] p-8 md:p-14 border border-navy/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col items-center text-center transform-gpu"
        >
          {/* Subtle Background Quote Icon for an editorial feel */}
          <Quote className="absolute top-8 left-8 md:top-12 md:left-12 w-16 h-16 md:w-24 md:h-24 text-primary/5 -rotate-12 pointer-events-none" />
          <Quote className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-16 h-16 md:w-24 md:h-24 text-secondary/5 rotate-12 pointer-events-none" />

          {/* 5-Star Rating (Teal colored to match brand) */}
          <div className="flex gap-1.5 mb-8 relative z-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>

          {/* The Core Message */}
          <blockquote className="relative z-10 mb-10">
            <p className="font-heading text-2xl md:text-3xl lg:text-4xl font-extrabold text-navy leading-tight md:leading-[1.3] tracking-tight text-balance">
              “{content.testimonial}”
            </p>
          </blockquote>

          {/* Client Details */}
          <div className="flex items-center gap-4 relative z-10">
            
            {/* 🟢 Dynamic Avatar Rendering */}
            {content.imageUrl ? (
              <div className="w-14 h-14 relative rounded-full overflow-hidden shadow-md shrink-0 border border-navy/10">
                <Image 
                  src={content.imageUrl} 
                  alt={content.name} 
                  fill 
                  className="object-cover" 
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shrink-0 border border-navy/10">
                <span className="font-heading text-xl font-bold text-navy">
                  {getInitials(content.name)}
                </span>
              </div>
            )}
            
            <div className="text-left">
              <h4 className="font-heading text-lg font-extrabold text-navy leading-none mb-1.5">
                {content.name}
              </h4>
              <p className="font-sans text-[15px] font-medium text-navy/70 leading-none">
                {content.role} {content.company ? `• ${content.company}` : ""}
              </p>
            </div>
            
          </div>

        </motion.div>

      </div>
    </section>
  );
}
