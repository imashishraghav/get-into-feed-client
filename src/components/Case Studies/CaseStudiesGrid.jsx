"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, TrendingUp, Target } from "lucide-react";

// 🟢 Import your custom animation variants & smooth scroll hook
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { staggerContainer, fadeUp } from "../../utils/animations";

// ----------------------------------------------------------------------
// Fallback Contextual Data (Runs only if Sanity is empty or loading)
// ----------------------------------------------------------------------
const fallbackCaseStudies = [
  {
    _id: "1",
    title: "Eldeco 7 Peaks",
    slug: "eldeco-7-peaks",
    industry: "Real Estate",
    problem: "Needed a massive influx of high-intent buyers for a new luxury project launch.",
    result: "+120% Qualified Leads",
    shortDescription: "Orchestrated comprehensive lead generation campaigns optimizing meta tags and landing pages.",
    imageUrl: null, 
    icon: TrendingUp
  },
  {
    _id: "2",
    title: "Sobha Sector 1",
    slug: "sobha-sector-1",
    industry: "Luxury Real Estate",
    problem: "Struggling to maintain profitability while scaling digital ad spend.",
    result: "3.5x Average ROAS",
    shortDescription: "Managed aggressive digital marketing updates and seamless performance scaling.",
    imageUrl: null,
    icon: Target
  }
];

export default function CaseStudiesGrid({ caseStudies = fallbackCaseStudies }) {
  const containerRef = useRef(null);

  // 🟢 Subtle Scroll Parallax for the entire grid
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const gridLift = useSpring(rawY, { stiffness: 90, damping: 25 });

  // 🟢 Connection Logic: Agar Sanity se data aaya hai, toh use karo, warna fallback dikhao
  const displayData = caseStudies?.length > 0 ? caseStudies : fallbackCaseStudies;

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#F8F9FB] py-16 md:py-24 overflow-hidden selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">

        {/* ================= GRID LAYOUT ================= */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ y: gridLift }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {displayData.map((data, index) => (
            <CaseStudyCard key={data._id || index} data={data} index={index} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 🟢 Individual Case Study Card Component
// ----------------------------------------------------------------------
function CaseStudyCard({ data, index }) {
  const hoverTransition = { type: "spring", stiffness: 300, damping: 25 };
  const ResultIcon = data.icon || Flame; // Fallback icon if none provided
  
  // 🟢 Sanity URL Fix: Handles both string and object slug formats
  const slugPath = data.slug?.current || data.slug;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.02, transition: hoverTransition }}
      className="group relative bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(46,209,178,0.15)] hover:border-[#2ED1B2]/30 transition-all duration-500 ease-out flex flex-col h-full"
    >
      {/* 🟢 FIXED: URL path is now /casestudies/ matching your folder structure */}
      <Link href={`/casestudies/${slugPath}`} className="flex flex-col h-full focus:outline-none">
        
        {/* 🟢 1. IMAGE CONTAINER */}
        <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden border-b border-[#E5E7EB]">
          {data.imageUrl ? (
            <Image 
              src={data.imageUrl} 
              alt={data.title} 
              fill 
              className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-700 ease-in-out">
               <div className="absolute inset-0 bg-[url('/grid-pattern-light.svg')] opacity-20" style={{ backgroundSize: '24px 24px' }} />
               <span className="relative z-10 text-white/50 font-sora font-bold text-xl tracking-widest uppercase text-center">{data.title}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* 🟢 2. CONTENT CONTAINER */}
        <div className="p-6 md:p-8 flex flex-col flex-1">
          
          {/* Industry Tag */}
          <div className="mb-4">
            <span className="inline-block text-[11px] font-bold tracking-[0.15em] text-[#0EA5A4] uppercase bg-[#2ED1B2]/10 border border-[#2ED1B2]/20 px-3 py-1.5 rounded-md shadow-sm">
              {data.industry || 'Digital Marketing'}
            </span>
          </div>

          {/* Title & Short Description */}
          <h3 className="text-2xl font-extrabold text-[#0F172A] mb-3 leading-tight group-hover:text-[#0EA5A4] transition-colors duration-300">
            {data.title}
          </h3>
          <p className="text-[#475569] text-[15px] leading-relaxed mb-6 line-clamp-2">
            {data.shortDescription || 'Read how we transformed this brand.'}
          </p>

          <div className="mt-auto">
            {/* 🟢 3. HIGHLIGHT RESULT BLOCK */}
            <div className="bg-[#F8F9FB] border border-[#E5E7EB]/50 rounded-2xl p-4 flex items-center gap-3 mb-6 transition-colors duration-300 group-hover:bg-[#2ED1B2]/5 group-hover:border-[#2ED1B2]/20">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-[#2ED1B2]">
                <ResultIcon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">
                  Core Result
                </span>
                <span className="text-lg font-extrabold text-[#0F172A]">
                  {data.result || 'Massive Growth'}
                </span>
              </div>
            </div>

            {/* 🟢 4. CTA */}
            <div className="flex items-center text-sm font-bold text-[#0F172A] group-hover:text-[#2ED1B2] transition-colors duration-300">
              <span>View Case Study</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
            </div>
          </div>
          
        </div>
      </Link>
    </motion.div>
  );
}