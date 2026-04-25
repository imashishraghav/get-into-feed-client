// @ts-nocheck
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// 🟢 Import custom smooth scroll hook for velocity
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

// ----------------------------------------------------------------------
// Animation Variants for Header
// ----------------------------------------------------------------------
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

// 🟢 FIX: Strictly accepting caseStudiesData from Sanity. No fallbacks.
export default function CaseStudies({ caseStudiesData }) {
  const { velocity } = useSmoothScroll();
  const smoothVelocity = useSpring(velocity, { damping: 30, stiffness: 200 });

  // 🟢 Safety Check: Hide section completely if no Sanity data is provided
  if (!caseStudiesData || caseStudiesData.length === 0) {
    return null; 
  }

  return (
    <section className="relative w-full bg-white pt-12 md:pt-16 pb-24 md:pb-32 overflow-hidden selection:bg-primary/20 selection:text-secondary">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Optimized Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          className="max-w-2xl mb-12 md:mb-16 gpu-accelerated"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="font-sans text-xs font-bold tracking-widest text-secondary uppercase">
              The Proof
            </span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight mb-5 text-balance">
            Proof, Not Promises.
          </h2>
          
          <p className="font-sans text-lg md:text-xl text-slate-500 font-medium leading-relaxed text-balance">
            Here’s how we’ve helped brands engineer attention into predictable, 
            scalable revenue. No vanity metrics, just bottom-line growth.
          </p>
        </motion.div>

        {/* Case Studies Container */}
        <div className="flex flex-col gap-8 md:gap-10">
          {caseStudiesData.map((study, index) => (
            <CaseStudyCard 
              key={study._id || index} 
              study={study} 
              index={index} 
              smoothVelocity={smoothVelocity} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Advanced Parallax Card Component
// ----------------------------------------------------------------------
function CaseStudyCard({ study, index, smoothVelocity }) {
  const cardRef = useRef(null);

  // Local scroll tracking for perfect entry parallax
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1.1", "1 0.8"], 
  });

  // Parallax calculations
  const rawY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  const y = useSpring(rawY, { stiffness: 80, damping: 20 });
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 20 });
  const scale = useSpring(rawScale, { stiffness: 80, damping: 20 });

  const metricScale = useTransform(smoothVelocity, [-800, 0, 800], [1.08, 1, 1.08]);

  // Handle Sanity Slug Path securely
  const hrefLink = study.link || `/casestudies/${study.slug?.current || study.slug || '#'}`;

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, scale }}
      className="w-full gpu-accelerated"
    >
      <Link href={hrefLink} className="group block focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 rounded-3xl">
        <div className="relative flex flex-col lg:flex-row bg-background rounded-3xl p-8 md:p-10 lg:p-14 border border-border transition-all duration-500 ease-out hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 hover:bg-white overflow-hidden">
          
          {/* LEFT: The Narrative (Story) */}
          <div className="flex-1 lg:pr-16 mb-12 lg:mb-0 flex flex-col justify-between">
            <div>
              <span className="font-sans inline-block px-3 py-1 rounded-md bg-primary/5 border border-primary/20 text-xs font-bold text-secondary uppercase tracking-wider mb-5 transition-colors duration-300 group-hover:bg-primary/10">
                {study.industry}
              </span>
              
              <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-4 tracking-tight transition-colors duration-300">
                {study.client || study.title}
              </h3>
              
              <p className="font-sans text-base md:text-lg text-slate-500 leading-relaxed max-w-lg text-balance line-clamp-3">
                {study.description || study.shortDescription}
              </p>
            </div>

            <div className="font-sans mt-8 flex items-center gap-2 text-secondary font-bold group-hover:text-primary transition-colors duration-300">
              <span className="text-[15px] tracking-wide">View Case Study</span>
              <ArrowRight 
                size={18} 
                strokeWidth={2.5} 
                className="transition-transform duration-300 group-hover:translate-x-1" 
              />
            </div>
          </div>

          {/* RIGHT: The Metrics (Proof) with 🟢 Velocity Animation */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-8 relative z-10 lg:border-l lg:border-border lg:pl-16 transition-colors duration-500 group-hover:border-primary/20">
            {/* Safety check: Ensure metrics array exists before mapping */}
            {study.metrics && study.metrics.map((metric, i) => (
              <div key={i} className="flex flex-col justify-center origin-left">
                <motion.div 
                  style={{ scale: metricScale }}
                  className="flex items-baseline mb-1 origin-left"
                >
                  {metric.prefix && (
                    <span className="font-heading text-3xl md:text-4xl font-black text-primary mr-1 opacity-90">
                      {metric.prefix}
                    </span>
                  )}
                  <span className="font-heading text-5xl md:text-6xl font-black text-navy tracking-tighter">
                    {metric.value}
                  </span>
                  {metric.suffix && (
                    <span className="font-heading text-3xl md:text-4xl font-black text-primary ml-1 opacity-90">
                      {metric.suffix}
                    </span>
                  )}
                </motion.div>
                <span className="font-sans text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
          
        </div>
      </Link>
    </motion.div>
  );
}
