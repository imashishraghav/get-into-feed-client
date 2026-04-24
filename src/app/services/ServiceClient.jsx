"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PortableText } from '@portabletext/react';
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    // 🟢 FIX: Removed 'ease' entirely to keep TypeScript 100% happy.
    // Framer Motion will automatically use its beautiful default easing.
    transition: { duration: 0.6 } 
  }
};

export default function ServiceClient({ data }) {
  if (!data) return null;

  return (
    <article className="relative w-full bg-[#F8F9FB] pb-32">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2ED1B2]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span 
            initial="hidden" animate="visible" variants={fadeUp}
            className="inline-block font-bold text-sm tracking-[0.2em] text-[#0EA5A4] uppercase mb-6"
          >
            Our Expertise
          </motion.span>
          
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold text-[#0F172A] leading-tight mb-8"
          >
            {data.title}
          </motion.h1>
          
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed"
          >
            {data.tagline}
          </motion.p>
        </div>
      </section>

      {/* --- 2. FEATURED IMAGE --- */}
      {data.image && (
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-6xl mx-auto px-6 mb-24"
        >
          <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
            <Image src={data.image} alt={data.title} fill className="object-cover" priority />
          </div>
        </motion.div>
      )}

      {/* --- 3. MAIN CONTENT & DELIVERABLES --- */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
        
        {/* Left Col: Portable Text Content */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          {data.content && (
            <div className="prose prose-lg max-w-none prose-headings:text-[#0F172A] prose-p:text-[#475569] prose-a:text-[#2ED1B2]">
              <PortableText value={data.content} />
            </div>
          )}
        </motion.div>

        {/* Right Col: Deliverables & Sticky CTA */}
        <aside className="relative">
          <div className="sticky top-32 flex flex-col gap-8">
            
            {/* Deliverables Card */}
            {data.deliverables && data.deliverables.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#0F172A] mb-6 border-b border-gray-100 pb-4">
                  What's Included
                </h3>
                <ul className="flex flex-col gap-4">
                  {data.deliverables.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#2ED1B2] shrink-0 mt-0.5" />
                      <span className="text-[#475569] font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Premium Sticky CTA */}
            <div className="bg-[#0F172A] p-8 rounded-2xl shadow-lg border border-[#0F172A] text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Scale?</h3>
              <p className="text-gray-400 mb-8 text-sm">Let's build a custom growth system for your brand.</p>
              <Link 
                href="/contact"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#2ED1B2] text-[#0F172A] font-bold hover:bg-white transition-colors duration-300"
              >
                Book Consultation <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

          </div>
        </aside>
      </div>

    </article>
  );
}