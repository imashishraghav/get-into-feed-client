// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Target } from "lucide-react"; // Target is used as a safety fallback

// 🟢 Import your custom animation variants
import { staggerContainer, fadeUp } from "@/utils/animations";

// 🟢 FIX: Added { services } prop to receive dynamic data from Sanity Server Wrapper
export default function ServicesOverview({ services }) {
  
  // Safety check: Agar data load na ho toh kuch mat render karo
  if (!services || services.length === 0) return null;

  return (
    <section className="relative w-full bg-background py-16 md:py-24 overflow-hidden selection:bg-primary/20 selection:text-secondary transform-gpu">
      
      {/* --- Subliminal Grid Background --- */}
      <div 
        className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20 flex flex-col items-center transform-gpu"
        >
          <motion.div variants={fadeUp} className="mb-6 transform-gpu">
            <span className="font-heading text-[11px] font-bold tracking-[0.2em] text-secondary uppercase bg-white px-4 py-2 rounded-full border border-navy/10 shadow-sm">
              Our Services
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-navy tracking-tight leading-[1.1] mb-6 text-balance transform-gpu"
          >
            Everything You Need to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Scale Your Growth.
            </span>
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="font-sans text-lg md:text-xl text-navy/70 font-medium leading-relaxed text-balance transform-gpu"
          >
            Each service is designed to work together as a complete, unified growth system.
          </motion.p>
        </motion.div>

        {/* ================= DYNAMIC SERVICES GRID ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transform-gpu"
        >
          {/* 🟢 FIX: Mapping over the dynamic Sanity 'services' data */}
          {services.map((service, index) => (
            <ServiceCard key={service.slug || index} service={service} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Service Card Component (Updated for Sanity Data)
// ----------------------------------------------------------------------
function ServiceCard({ service }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="h-full transform-gpu"
    >
      {/* 🟢 FIX: Dynamic URL generation based on Sanity slug */}
      <Link href={`/services/${service.slug}`} className="block h-full group focus:outline-none">
        <div className="relative h-full bg-white border border-navy/10 rounded-2xl p-8 md:p-10 transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 flex flex-col overflow-hidden">
          
          {/* Subtle Corner Glow on Hover */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform-gpu" />

          {/* Icon Area (Dynamic Image from Sanity) */}
          <div className="w-14 h-14 rounded-2xl bg-background border border-navy/10 flex items-center justify-center mb-8 transition-colors duration-300 group-hover:bg-primary/10 group-hover:border-primary/30 shrink-0">
            {service.icon ? (
              <img 
                src={service.icon} 
                alt={service.title} 
                className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300" 
              />
            ) : (
              // Safety Fallback just in case icon is missing in Sanity
              <Target className="w-6 h-6 text-navy/70 transition-colors duration-300 group-hover:text-secondary" strokeWidth={1.5} />
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-heading text-xl md:text-2xl font-extrabold text-navy mb-3 tracking-tight group-hover:text-secondary transition-colors duration-300">
              {service.title}
            </h3>
            
            <p className="font-sans text-[15px] md:text-base text-navy/70 leading-relaxed font-medium mb-8">
              {/* 🟢 FIX: Prioritize shortDescription, fallback to tagline */}
              {service.shortDescription || service.tagline}
            </p>
            
            {/* Clickable Indicator (Pushes to bottom) */}
            <div className="mt-auto flex items-center gap-2 text-sm font-bold font-heading text-primary uppercase tracking-wider transition-colors duration-300">
              <span>Explore</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 ease-out transform-gpu" />
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
