// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CheckCircle2, ArrowRight, MessageSquare, Sparkles, Plus, Minus, Layers } from "lucide-react";
import slugify from "slugify";

// --- 🎯 PREMIUM PORTABLE TEXT COMPONENTS ---
// --- 🎯 PREMIUM PORTABLE TEXT COMPONENTS (Ultra-Tight Spacing) ---
const CustomPortableTextComponents = {
  block: {
    h2: (props) => {
      const text = props.value?.children?.[0]?.text || "";
      const id = slugify(text).toLowerCase();
      return (
        <div className="relative mt-10 mb-3 scroll-mt-32" id={id}>
          <div className="absolute -left-6 lg:-left-10 top-1 w-1.5 h-8 bg-gradient-to-b from-[#2ED1B2] to-blue-500 rounded-full" />
          <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
            {props.children}
          </h2>
        </div>
      );
    },
    h3: (props) => {
      const text = props.value?.children?.[0]?.text || "";
      const id = slugify(text).toLowerCase();
      return (
        <h3 id={id} className="text-xl font-bold text-[#0F172A] mt-6 mb-2 scroll-mt-32 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2ED1B2]" />
          {props.children}
        </h3>
      );
    },
    normal: (props) => (
      <p className="text-[#475569] text-[1.05rem] leading-relaxed mb-3 font-medium">
        {props.children}
      </p>
    ),
    blockquote: (props) => (
      <blockquote className="relative overflow-hidden bg-gradient-to-br from-white to-[#F8F9FB] border border-[#E5E7EB] p-5 rounded-2xl shadow-sm my-6 group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#2ED1B2]/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute left-0 top-0 w-1.5 h-full bg-[#2ED1B2]" />
        <p className="relative z-10 text-lg font-semibold text-[#0F172A] leading-relaxed">
          "{props.children}"
        </p>
      </blockquote>
    ),
  },
  list: {
    // Gap aur Margin dono ko drastically kam kar diya
    bullet: (props) => <ul className="flex flex-col gap-2.5 my-3">{props.children}</ul>,
    number: (props) => <ol className="list-decimal pl-6 space-y-2 my-3 text-lg text-[#475569]">{props.children}</ol>,
  },
  listItem: {
    bullet: (props) => (
      // Padding (p-4 se p-3) aur Icon size ko chhota kiya taaki cards sleek lagein
      <li className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-[0_1px_5px_rgb(0,0,0,0.02)] hover:shadow-md hover:border-[#2ED1B2]/40 transition-all duration-300">
        <div className="w-7 h-7 rounded-full bg-[#2ED1B2]/10 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4 text-[#2ED1B2]" />
        </div>
        <span className="text-[1.05rem] text-[#0F172A] font-medium leading-relaxed">{props.children}</span>
      </li>
    ),
  },
};

// --- 🧭 STICKY TABLE OF CONTENTS ---
const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[#E5E7EB] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
      <h4 className="text-xs font-black tracking-widest text-[#0F172A] uppercase mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#2ED1B2] animate-pulse" />
        Table of Contents
      </h4>
      <nav className="flex flex-col gap-4 relative border-l-2 border-[#E5E7EB]/60 ml-1 pl-5">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`text-[15px] font-semibold transition-all duration-300 relative ${
              activeId === heading.id
                ? "text-[#2ED1B2] translate-x-1"
                : "text-[#475569] hover:text-[#0F172A] hover:translate-x-1"
            }`}
          >
            {activeId === heading.id && (
              <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#2ED1B2] ring-4 ring-[#2ED1B2]/20" />
            )}
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
};

// --- 🏆 MAIN SERVICE DETAIL COMPONENT ---
export default function ServiceDetailClient({ service }) {
  const [openFaq, setOpenFaq] = useState(0); // Pehla FAQ open rakhne ke liye

  // Generate TOC Headings (Content + Deliverables + FAQs)
  const headings = service?.content
    ?.filter((block) => block._type === 'block' && (block.style === 'h2' || block.style === 'h3'))
    ?.map((block) => {
      const text = block.children?.map((c) => c.text).join("") || "";
      return { text, id: slugify(text).toLowerCase() };
    }) || [];

  if (service?.deliverables?.length > 0) headings.push({ text: "Deliverables", id: "deliverables" });
  if (service?.faqs?.length > 0) headings.push({ text: "FAQs", id: "faqs" });

  return (
    <main className="bg-[#F8F9FB] min-h-screen pb-24 selection:bg-[#2ED1B2]/30 relative overflow-hidden">
      
      {/* 1️⃣ PREMIUM HERO SECTION */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-[#E5E7EB] bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#2ED1B2]/10 via-blue-500/5 to-transparent rounded-full blur-[100px] opacity-70 pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-sm font-bold text-[#475569] mb-8 tracking-wide">
              <Link href="/" className="hover:text-[#2ED1B2] transition-colors uppercase text-xs">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/services" className="hover:text-[#2ED1B2] transition-colors uppercase text-xs">Services</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#0F172A] uppercase text-xs">{service?.title}</span>
            </nav>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-[#0F172A] leading-[1.05] tracking-tight mb-8"
            >
              {service?.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-[#475569] leading-relaxed max-w-2xl font-medium"
            >
              {service?.shortDescription || service?.tagline}
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2️⃣ MAIN CONTENT LAYOUT */}
      <section className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-16 xl:gap-24">
          
          {/* LEFT SIDE: PREMIUM CONTENT */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-none"
          >
            {/* Main Featured Image */}
            {service?.mainImage && (
              <div className="w-full h-[450px] relative rounded-[2rem] overflow-hidden mb-16 shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-[#E5E7EB]">
                <Image src={service.mainImage} alt={service.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Sanity Portable Text */}
            <div className="prose prose-lg max-w-none text-[#0F172A]">
              {service?.content && (
                <PortableText value={service.content} components={CustomPortableTextComponents} />
              )}
            </div>

            {/* 📦 DELIVERABLES BENTO GRID */}
            {service?.deliverables && service.deliverables.length > 0 && (
              <div id="deliverables" className="mt-20 scroll-mt-32">
                <div className="relative mb-10">
                  <div className="absolute -left-6 lg:-left-10 top-1 w-1.5 h-10 bg-gradient-to-b from-[#2ED1B2] to-blue-500 rounded-full" />
                  <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight">What's Included</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-[#E5E7EB] hover:border-[#2ED1B2] hover:shadow-[0_10px_40px_rgb(46,209,178,0.1)] transition-all duration-300 group">
                      <div className="w-12 h-12 rounded-xl bg-[#F8F9FB] flex items-center justify-center mb-4 group-hover:bg-[#2ED1B2]/10 transition-colors">
                        <Layers className="w-6 h-6 text-[#475569] group-hover:text-[#2ED1B2]" />
                      </div>
                      <h4 className="text-xl font-bold text-[#0F172A] mb-2">{item.title}</h4>
                      <p className="text-[#475569] font-medium leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🤔 FAQs INTERACTIVE ACCORDION */}
            {service?.faqs && service.faqs.length > 0 && (
              <div id="faqs" className="mt-24 scroll-mt-32">
                 <div className="relative mb-10">
                  <div className="absolute -left-6 lg:-left-10 top-1 w-1.5 h-10 bg-gradient-to-b from-[#2ED1B2] to-blue-500 rounded-full" />
                  <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight">Common Questions</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {service.faqs.map((faq, idx) => (
                    <div 
                      key={idx} 
                      className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${openFaq === idx ? 'bg-white border-[#2ED1B2] shadow-sm' : 'bg-transparent border-[#E5E7EB] hover:border-[#cbd5e1]'}`}
                    >
                      <button 
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                      >
                        <span className="text-lg font-bold text-[#0F172A] pr-4">{faq.question}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openFaq === idx ? 'bg-[#2ED1B2]/10 text-[#2ED1B2]' : 'bg-[#F8F9FB] text-[#475569]'}`}>
                          {openFaq === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {openFaq === idx && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="px-6 pb-6 text-[#475569] font-medium leading-relaxed border-t border-[#E5E7EB] pt-4 mt-2">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>

          {/* RIGHT SIDE: PREMIUM SIDEBAR */}
          <aside className="relative">
            <div className="sticky top-32 w-full flex flex-col gap-8">
              
              <TableOfContents headings={headings} />

              {/* High-Converting CTA Card */}
              <div className="bg-[#0F172A] rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-[#0F172A]/20 border border-[#1E293B]">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#2ED1B2] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-[#2ED1B2]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#2ED1B2]/30">
                    <MessageSquare className="w-7 h-7 text-[#2ED1B2]" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 leading-tight tracking-tight">
                    Ready to scale your brand?
                  </h3>
                  <p className="text-[#94A3B8] text-base leading-relaxed mb-8 font-medium">
                    Let's discuss how our data-driven campaigns can generate high-quality leads for your business.
                  </p>
                  
                  <Link href="/contact">
                    <button className="w-full bg-[#2ED1B2] text-[#0F172A] font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(46,209,178,0.4)]">
                      Let's Talk
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}