"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// ----------------------------------------------------------------------
// Premium Fallback Copy (Get Into Feed Standard)
// ----------------------------------------------------------------------
const fallbackData = {
  heading: "Stop Reading.",
  highlight: "Start Scaling.",
  subheading: "Let's take the guesswork out of your marketing. Get a custom growth system designed specifically for your brand's goals.",
  buttonText: "Book Your Strategy Call",
  buttonLink: "/contact",
  trustBadge: "No pressure. Just clarity and execution."
};

// 🟢 FIX: Accept Sanity data via props
export default function FinalCTA({ data }) {
  // Use Sanity data if available, otherwise use fallback
  const content = data || fallbackData;

  // Split heading if it doesn't have a specific highlight field from Sanity
  const renderHeading = () => {
    if (content.highlight) {
      return (
        <>
          {content.heading} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
            {content.highlight}
          </span>
        </>
      );
    }
    return content.heading;
  };

  return (
    <section className="relative w-full py-24 md:py-32 bg-[#F8F9FB] overflow-hidden flex justify-center items-center">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#2ED1B2]/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-extrabold text-5xl md:text-6xl lg:text-7xl text-[#0F172A] tracking-tight leading-[1.1] mb-6"
        >
          {renderHeading()}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-lg md:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {content.subheading}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          {/* Main CTA Button */}
          <Link href={content.buttonLink || "/contact"}>
            <button className="group relative px-8 py-4 bg-[#2ED1B2] text-[#0F172A] font-bold text-lg rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(46,209,178,0.4)] hover:shadow-[0_0_60px_-15px_rgba(46,209,178,0.6)] transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center gap-2">
                {content.buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </Link>

          {/* Trust Badge */}
          {content.trustBadge && (
            <div className="flex items-center gap-2 text-sm font-medium text-[#475569]/80 mt-4">
              <CheckCircle2 className="w-4 h-4 text-[#2ED1B2]" />
              <span>{content.trustBadge}</span>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
