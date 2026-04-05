"use client";

import React, { useRef, useEffect } from 'react';
import { ArrowUpRight, BarChart3, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CaseStudiesPage() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const cases = [
    {
      client: "Luxe Real Estate",
      category: "Performance Ads & CRO",
      title: "Scaling Luxury Property Leads by 450% in 90 Days",
      metrics: [
        { label: "Lead Volume", value: "+450%" },
        { label: "Cost Per Lead", value: "-62%" },
        { label: "Closed Sales", value: "₹42Cr+" }
      ],
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
      icon: <BarChart3 className="text-[#3AE272] w-6 h-6" />
    },
    {
      client: "UrbanBrew Coffee",
      category: "Social & Viral Marketing",
      title: "From Local Cafe to National Brand via TikTok & Reels",
      metrics: [
        { label: "Followers Gained", value: "1.2M+" },
        { label: "Organic Reach", value: "45M+" },
        { label: "E-com Sales", value: "3x" }
      ],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      icon: <TrendingUp className="text-[#3AE272] w-6 h-6" />
    },
    {
      client: "TechFit Wearables",
      category: "Influencer Marketing",
      title: "Driving ₹5Cr in Launch Week Sales with Micro-Influencers",
      metrics: [
        { label: "Creators Activated", value: "150+" },
        { label: "Launch Revenue", value: "₹5Cr" },
        { label: "Avg. ROAS", value: "6.8x" }
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      icon: <Users className="text-[#3AE272] w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-zinc-400 pt-24 pb-32 px-6 font-sans relative overflow-hidden">
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#3AE272]/60 pointer-events-none z-[100] transition-transform duration-100 ease-out hidden md:block"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
      
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vh] bg-[#3AE272]/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[#3AE272] animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-300">Success Stories</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Proof is in the <span className="text-[#3AE272]">Performance.</span>
          </h1>
          <p className="text-lg text-slate-400">
            Dekhiye kaise humne apne clients ke business models ko transform kiya aur unhe unki industry ka market leader banaya.
          </p>
        </div>

        {/* Case Studies List */}
        <div className="space-y-12 md:space-y-24">
          {cases.map((study, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center group`}>
              
              {/* Image Side */}
              <div className="w-full md:w-1/2 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#3AE272]/20 to-blue-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>
                <div className="relative bg-[#0b1015] border border-white/10 rounded-[2rem] p-2 aspect-[4/3] overflow-hidden shadow-2xl">
                  <img 
                    src={study.image} 
                    alt={study.client} 
                    className="w-full h-full object-cover rounded-[1.5rem] opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                  />
                  {/* Category Badge over image */}
                  <div className="absolute top-6 left-6 bg-[#020408]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    {study.icon}
                    <span className="text-white text-xs font-bold uppercase tracking-wider">{study.category}</span>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2">
                <p className="text-[#3AE272] text-sm font-bold tracking-widest uppercase mb-4">{study.client}</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                  {study.title}
                </h2>
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {study.metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <h4 className="text-2xl md:text-3xl font-black text-white mb-1">{metric.value}</h4>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <Link href="#" className="inline-flex items-center gap-2 text-white font-bold hover:text-[#3AE272] transition-colors group/link">
                  Read Full Case Study 
                  <ArrowUpRight className="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-32 text-center">
           <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Want to be our next success story?</h3>
           <Link href="/contact" className="inline-flex items-center gap-2 bg-[#3AE272] text-[#022c22] font-bold py-4 px-8 rounded-xl hover:bg-[#4df287] transition-all duration-300 shadow-[0_0_20px_rgba(58,226,114,0.2)]">
              Let's Scale Together <ArrowRight size={18} />
           </Link>
        </div>

      </div>
    </div>
  );
}