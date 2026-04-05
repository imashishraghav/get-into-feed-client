"use client";

import React from 'react';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

export default function BlogPage() {
  const blogs = [
    {
      category: "Performance Ads",
      title: "How to Decrease Your Meta Ads CPA by 40% in 2026",
      desc: "Stop wasting ad spend. Learn the exact campaign structure and creative testing methodology we use to scale brands.",
      date: "April 2, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
    },
    {
      category: "SEO Strategy",
      title: "The Ultimate Guide to Technical SEO Audits",
      desc: "Rank higher on Google by fixing these hidden technical errors that are destroying your organic traffic.",
      date: "March 28, 2026",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80"
    },
    {
      category: "Content & Viral",
      title: "Decoding the TikTok Algorithm: Hooks That Convert",
      desc: "Why your short-form videos are flopping and the proven script structures that guarantee high retention and virality.",
      date: "March 15, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-zinc-400 pt-24 pb-32 px-6 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <BookOpen className="w-4 h-4 text-[#3AE272]" />
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-300">Insights & Resources</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            The <span className="text-[#3AE272]">Growth</span> Playbook.
          </h1>
          <p className="text-lg text-slate-400">
            Case studies, industry trends, and actionable marketing strategies directly from our experts.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, idx) => (
            <div key={idx} className="group bg-[#0b1015]/40 backdrop-blur-sm border border-white/[0.05] rounded-[1.5rem] overflow-hidden hover:border-[#3AE272]/40 transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <div className="h-48 md:h-56 overflow-hidden relative">
                <div className="absolute top-4 left-4 bg-[#3AE272] text-[#022c22] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10">
                  {post.category}
                </div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#3AE272] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {post.desc}
                </p>
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-slate-300 group-hover:text-[#3AE272] transition-colors cursor-pointer w-max">
                  Read Article <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}