"use client";

import React from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, Zap, Star, Users } from 'lucide-react';

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Performance Marketer",
      type: "Full-Time",
      location: "Remote / New Delhi",
      desc: "Scale 8-figure ad accounts across Meta and Google. Must be obsessed with ROAS and data analytics."
    },
    {
      title: "Short-Form Video Editor",
      type: "Full-Time",
      location: "Remote",
      desc: "Create viral, high-retention TikToks and Reels. Mastery of Premiere Pro/CapCut required."
    },
    {
      title: "SEO Specialist",
      type: "Full-Time",
      location: "New Delhi",
      desc: "Drive organic dominance through technical SEO, content strategy, and high-authority link building."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-zinc-400 pt-24 pb-32 px-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] bg-[#3AE272]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[#3AE272] animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-300">Join The Revolution</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Build the future of <span className="text-[#3AE272]">Digital Growth.</span>
          </h1>
          <p className="text-lg text-slate-400">
            Hum ek high-performance team hain jo average results mein believe nahi karti. Agar aap top 1% talent hain, toh Get Into Feed aapka naya ghar hai.
          </p>
        </div>

        {/* Culture Perks */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {[
            { icon: <Zap className="w-8 h-8" />, title: "Fast-Paced Environment", desc: "Learn and execute faster than anywhere else." },
            { icon: <Users className="w-8 h-8" />, title: "Elite Team", desc: "Work alongside the sharpest minds in digital marketing." },
            { icon: <Star className="w-8 h-8" />, title: "High Reward", desc: "Competitive salary, performance bonuses, and growth." }
          ].map((perk, i) => (
            <div key={i} className="bg-[#0b1015]/60 backdrop-blur-md border border-white/[0.05] p-8 rounded-[2rem]">
              <div className="text-[#3AE272] mb-6">{perk.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{perk.title}</h3>
              <p className="text-sm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">Open <span className="text-[#3AE272]">Positions</span></h2>
        <div className="grid gap-6">
          {jobs.map((job, idx) => (
            <div key={idx} className="group bg-[#0b1015]/40 backdrop-blur-sm border border-white/[0.05] p-8 rounded-[1.5rem] hover:border-[#3AE272]/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#3AE272] transition-colors">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-xs font-semibold tracking-wider text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5"><Briefcase size={16} /> {job.type}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                </div>
                <p className="text-sm max-w-2xl">{job.desc}</p>
              </div>
              <button className="bg-white/5 border border-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-[#3AE272] hover:text-[#020408] transition-all duration-300 whitespace-nowrap flex items-center gap-2">
                Apply Now <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}