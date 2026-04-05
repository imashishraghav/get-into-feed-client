"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  MousePointerClick,
  PenTool,
  Mail,
  BarChart3,
  Sparkles,
  Loader2,
  ArrowRight,
  Globe,
  Palette,
  Users,
  Code,
  Star,
  ArrowUpRight,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

const KeyboardRow = ({ count, specialWidths = {} }) => (
  <div className="flex w-full flex-1 gap-[1px] md:gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-[#11161b] rounded-[1px] sm:rounded-[2px] md:rounded-sm shadow-[0_1px_1px_rgba(0,0,0,0.8),_0_0_1px_rgba(58,226,114,0.1)] border border-[#252e38] relative overflow-hidden flex-1"
        style={specialWidths[i] ? { flex: `0 0 ${specialWidths[i]}` } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
      </div>
    ))}
  </div>
);

export default function ServicesPage() {
  const servicesList = [
    {
      title: 'Search Engine Optimization',
      description: 'Rank higher on Google and drive continuous, organic, high-intent traffic to your website. We handle technical SEO, content, and high-authority link building.',
      icon: <Search size={28} strokeWidth={1.5} />,
    },
    {
      title: 'Social & Viral Marketing',
      description: 'Build a loyal community and dominate the feed. We create engaging, shareable content tailored for TikTok, Instagram Reels, and LinkedIn.',
      icon: <TrendingUp size={28} strokeWidth={1.5} />,
    },
    {
      title: 'Performance Advertising',
      description: 'Maximize your ROI with hyper-targeted ad campaigns on Google Ads, Meta, and LinkedIn. We optimize every penny of your ad spend.',
      icon: <MousePointerClick size={28} strokeWidth={1.5} />,
    },
    {
      title: 'Custom Web Development',
      description: 'Blazing fast, high-converting websites and web apps built with modern frameworks. We design digital experiences that captivate and convert.',
      icon: <Code size={28} strokeWidth={1.5} />,
    },
    {
      title: 'Brand Identity & Design',
      description: 'Forge a memorable brand. From logo design to comprehensive brand guidelines, we create visual identities that resonate with your target audience.',
      icon: <Palette size={28} strokeWidth={1.5} />,
    },
    {
      title: 'Influencer Campaigns',
      description: 'Tap into established audiences. We identify, negotiate, and manage relationships with key influencers to amplify your brand message.',
      icon: <Users size={28} strokeWidth={1.5} />,
    },
    {
      title: 'Content Strategy & Creation',
      description: 'Compelling copywriting, stunning visuals, and professional video production that tells your brand\'s unique story and captures attention.',
      icon: <PenTool size={28} strokeWidth={1.5} />,
    },
    {
      title: 'Email & SMS Automation',
      description: 'Nurture leads and drive repeat sales with automated, highly personalized campaigns that land directly in your customers\' inboxes.',
      icon: <Mail size={28} strokeWidth={1.5} />,
    },
    {
      title: 'Conversion Optimization (CRO)',
      description: 'Turn more existing traffic into paying customers. We use heatmaps, user behavior data, and rigorous A/B testing to boost conversions.',
      icon: <BarChart3 size={28} strokeWidth={1.5} />,
    },
  ];

  // Gemini API Integration State
  const [topic, setTopic] = useState('');
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Note: You will need to put your actual API key here later!
  const apiKey = "";

  const generateViralHooks = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setHooks([]);

    const promptText = `Act as an expert viral marketer. Generate 3 highly engaging, scroll-stopping hooks for short-form videos (TikTok/Reels) about: "${topic}". Keep them punchy, create intense curiosity, and under 15 words each. Return ONLY a JSON array of 3 strings.`;

    const payload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      }
    };

    let retries = 0;
    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    while (retries <= maxRetries) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          const parsedHooks = JSON.parse(text);
          setHooks(parsedHooks);
          setLoading(false);
          return;
        } else {
            throw new Error("Invalid response format");
        }
      } catch (err) {
        if (retries === maxRetries) {
          setError('Failed to generate hooks. Please check your API key or try again later.');
          setLoading(false);
          break;
        }
        await new Promise(resolve => setTimeout(resolve, delays[retries]));
        retries++;
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-[#020408] text-slate-300 relative selection:bg-[#3AE272]/30 selection:text-white overflow-x-hidden pt-16">
      {/* Import Premium Font */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      `}} />

      {/* Global Background Effects */}
      <div
        className="fixed inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none z-0"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }}
      ></div>
      
      {/* Refined Ambient Gradients */}
      <div className="fixed top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-[#3AE272]/[0.02] to-transparent pointer-events-none"></div>
      <div className="fixed -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-[#3AE272] rounded-full blur-[200px] opacity-[0.03] pointer-events-none"></div>
      <div className="fixed top-[30%] -left-[20%] w-[60vw] h-[60vw] bg-[#1d4ed8] rounded-full blur-[200px] opacity-[0.03] pointer-events-none"></div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 pb-32 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-20 relative px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-[#3AE272] animate-pulse"></span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-300">Our Capabilities</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight mb-6 text-white">
              We engineer <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3AE272] via-[#6ee7b7] to-[#3AE272]"> explosive growth.</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              From dominating search rankings to crafting viral campaigns, our tailored digital strategies ensure you don't just exist online—<span className="text-white">you take over.</span>
            </p>
          </div>

          {/* Hero Poster Banner / Laptop Scene */}
          <div className="relative w-full max-w-5xl mx-auto mb-20 md:mb-32 perspective-[2000px] px-2 sm:px-0">
            
            {/* Ambient Dark Room Environment */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-[#020304] rounded-[100%] blur-[60px] pointer-events-none z-0"></div>

            {/* Laptop Mockup Container */}
            <div className="relative z-10 flex justify-center group cursor-pointer w-full" style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}>
              <div
                className="w-full relative transition-all duration-[1000ms] ease-out md:hover:scale-[1.02]"
                style={{
                  transform: 'translateY(0)',
                  transformStyle: 'preserve-3d'
                }}
              >
                
                {/* Moody Desk Surface */}
                <div className="absolute -bottom-4 md:-bottom-8 -left-[10%] w-[120%] h-24 md:h-32 bg-[#080b0e] border-t border-white/5 z-0" style={{ transform: 'rotateX(70deg) translateZ(-40px)' }}></div>
                
                {/* Desk Lamp Light Pool */}
                <div className="absolute -bottom-2 md:-bottom-4 right-[-5%] w-[45%] h-16 md:h-24 bg-[#f8fafc]/10 blur-[30px] md:blur-[50px] rounded-[100%] z-0 pointer-events-none" style={{ transform: 'rotateX(70deg) translateZ(-30px)' }}></div>
                <div className="absolute bottom-0 right-[5%] w-[25%] h-8 md:h-12 bg-white/15 blur-[20px] md:blur-[30px] rounded-[100%] z-0 pointer-events-none" style={{ transform: 'rotateX(70deg) translateZ(-20px)' }}></div>

                {/* Deep Ground Shadow */}
                <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 w-[100%] h-8 md:h-12 bg-black blur-[15px] md:blur-[20px] opacity-100 rounded-[100%] z-0 pointer-events-none" style={{ transform: 'translateZ(-10px)' }}></div>

                {/* --- LAPTOP SCREEN (Lid) --- */}
                <div
                  className="relative z-20 bg-[#0d1115] rounded-t-lg sm:rounded-t-2xl md:rounded-t-[1.5rem] border-[2px] sm:border-[4px] md:border-[6px] border-[#151a21] border-b-0 aspect-[16/10] overflow-hidden shadow-2xl"
                  style={{
                    transformOrigin: 'bottom center',
                    transform: 'rotateX(2deg)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* OFF State Black Overlay */}
                  <div className="absolute inset-0 bg-[#030405] z-40 transition-opacity duration-1000 ease-in-out md:group-hover:opacity-0 md:group-hover:pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border border-white/5 flex items-center justify-center mb-2 md:mb-4 bg-white/[0.02] opacity-60 md:group-hover:opacity-0 transition-opacity duration-700">
                      <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                    </div>
                    <div className="text-white/30 text-[8px] md:text-xs tracking-[0.2em] font-medium uppercase opacity-60 md:group-hover:opacity-0 transition-opacity duration-700">Hover to Wake</div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 mix-blend-screen pointer-events-none"></div>
                  </div>

                  {/* Top Camera Bump Indicator */}
                  <div className="absolute top-1 md:top-2 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-black/80 flex items-center justify-center z-30 shadow-[0_1px_1px_rgba(255,255,255,0.1)]">
                    <div className="w-[1px] h-[1px] md:w-0.5 md:h-0.5 rounded-full bg-blue-500/50 md:group-hover:bg-[#3AE272] transition-colors duration-1000"></div>
                  </div>

                  {/* Enhanced Fake Instagram UI Mockup */}
                  <div className="w-full h-full bg-white flex flex-col text-slate-800 font-sans text-[8px] sm:text-[10px] md:text-sm relative z-10">
                    
                    {/* IG Navbar */}
                    <div className="flex items-center justify-between px-3 md:px-4 py-1.5 md:py-3 border-b border-slate-200 shrink-0">
                      <div className="font-serif italic font-bold text-xs sm:text-sm md:text-lg">Instagram</div>
                      <div className="hidden sm:flex bg-slate-100 rounded-md px-3 py-1.5 text-slate-400 w-1/3 items-center gap-2">
                        <Search size={14} /> <span className="text-xs">Search</span>
                      </div>
                      <div className="flex gap-2 md:gap-4">
                        <svg className="w-3.5 h-3.5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        <svg className="w-3.5 h-3.5 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      </div>
                    </div>
                    
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
                      
                      {/* IG Profile Header */}
                      <div className="flex items-start gap-3 md:gap-8 p-3 md:p-6 pb-2">
                        {/* Avatar */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 shrink-0 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[1.5px] md:p-[3px]">
                          <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop" className="w-full h-full object-cover" alt="Profile avatar" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mb-1 md:mb-4">
                            <h2 className="text-xs sm:text-sm md:text-xl font-bold flex items-center gap-1">
                              growth.agency
                              <svg className="w-2.5 h-2.5 md:w-4 md:h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"/></svg>
                            </h2>
                            <div className="flex gap-1.5 md:gap-2">
                              <button className="bg-slate-100 text-slate-800 px-2 md:px-4 py-1 md:py-1.5 rounded-lg font-semibold text-[8px] md:text-xs">Following</button>
                              <button className="bg-slate-100 text-slate-800 px-2 md:px-4 py-1 md:py-1.5 rounded-lg font-semibold text-[8px] md:text-xs">Message</button>
                            </div>
                          </div>
                          
                          <div className="hidden sm:flex gap-4 md:gap-6 mb-2 md:mb-3 text-[10px] md:text-sm">
                            <span><strong className="font-bold">892</strong> posts</span>
                            <span><strong className="font-bold">2.4M</strong> followers</span>
                            <span><strong className="font-bold">12</strong> following</span>
                          </div>
                          
                          <div className="text-[8px] sm:text-[10px] md:text-sm">
                            <p className="font-bold text-slate-900">Elite Digital Growth Partner</p>
                            <p className="text-slate-600 mt-0.5 leading-tight">We build empires online. 🚀<br/>Scaling brands to 8-figures & beyond.</p>
                            <span className="text-blue-900 font-medium mt-1 inline-flex items-center gap-0.5 md:gap-1"><svg className="w-2 h-2 md:w-3 md:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> wearegrowth.com</span>
                          </div>
                        </div>
                      </div>

                      {/* Story Highlights */}
                      <div className="flex gap-2.5 md:gap-5 px-3 md:px-6 py-2 md:py-3 overflow-x-hidden">
                        {[
                          { img: "1557838923-2985c318be48", title: "Results 📈" },
                          { img: "1603513492128-ba7bc9b3e143", title: "Case Studies" },
                          { img: "1533750516457-a7f992034fec", title: "Behind Scenes" },
                          { img: "1611162617213-7d7a39e9b1d7", title: "Our Team" }
                        ].map((story, i) => (
                          <div key={i} className="flex flex-col items-center gap-1 md:gap-1.5 cursor-pointer">
                            <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border border-slate-300 p-[1.5px] md:p-[2px]">
                              <div className="w-full h-full rounded-full bg-slate-200 overflow-hidden">
                                <img src={`https://images.unsplash.com/photo-${story.img}?w=100&h=100&fit=crop`} className="w-full h-full object-cover" alt={story.title} />
                              </div>
                            </div>
                            <span className="text-[7px] sm:text-[9px] md:text-xs font-medium text-slate-600">{story.title}</span>
                          </div>
                        ))}
                      </div>

                      {/* IG Tabs */}
                      <div className="flex justify-center gap-6 md:gap-16 border-t border-slate-200 mt-1 md:mt-2">
                        <div className="py-2 md:py-3 border-t-[1.5px] md:border-t-2 border-slate-800 -mt-[1px] flex items-center gap-1 md:gap-1.5 text-[8px] md:text-xs font-bold tracking-widest text-slate-800">
                          <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                          POSTS
                        </div>
                        <div className="py-2 md:py-3 flex items-center gap-1 md:gap-1.5 text-[8px] md:text-xs font-bold tracking-widest text-slate-400">
                          <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                          REELS
                        </div>
                      </div>

                      {/* IG Grid */}
                      <div className="grid grid-cols-3 gap-[1px] md:gap-[2px] pb-4">
                        {[
                          "1611262588024-d12430b98920",
                          "1563986768494-4dee2763ff0f",
                          "1557838923-2985c318be48",
                          "1533750516457-a7f992034fec",
                          "1603513492128-ba7bc9b3e143",
                          "1611162617213-7d7a39e9b1d7",
                          "1611162617474-5b21e879e113",
                          "1557838923-2985c318be48",
                          "1563986768494-4dee2763ff0f"
                        ].map((imgId, i) => (
                          <div key={i} className="bg-slate-100 aspect-square overflow-hidden relative group">
                            <img src={`https://images.unsplash.com/photo-${imgId}?w=400&h=400&fit=crop`} className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500" alt={`Instagram post ${i+1}`} />
                            <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 md:group-hover:opacity-100">
                              <div className="flex gap-2 md:gap-4 text-white font-bold text-[10px] md:text-sm">
                                <span className="flex items-center gap-1 md:gap-1.5"><svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> {(Math.random() * 10 + 2).toFixed(1)}k</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Screen Gloss/Reflection Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/10 pointer-events-none mix-blend-screen z-20"></div>
                  <div className="absolute -inset-[100%] transform -rotate-45 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none z-20 translate-y-1/2 translate-x-1/4"></div>
                </div>

                {/* --- LAPTOP BASE (Keyboard Deck - Cinematic Silhouette) --- */}
                <div
                  className="absolute top-full left-0 w-full bg-[#020202] rounded-b-md sm:rounded-b-lg md:rounded-b-xl border border-[#000] border-t-0 z-20 transition-colors duration-1000 md:group-hover:bg-[#07090b]"
                  style={{
                    height: '25%',
                    transformOrigin: 'top center',
                    transform: 'rotateX(70deg)',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,1)'
                  }}
                >
                  {/* Edge highlight caught from the desk lamp (Right edge) */}
                  <div className="absolute top-0 right-[1px] md:right-[2px] w-[1px] md:w-[2px] h-[95%] bg-gradient-to-b from-[#fff4d4]/30 to-transparent blur-[1px]"></div>

                  {/* Keyboard Well - Initially hidden in darkness, illuminated by screen on hover */}
                  <div className="absolute top-[10%] left-[5%] right-[5%] h-[55%] bg-[#010101] rounded-[1px] md:rounded-sm shadow-[0_1px_5px_rgba(0,0,0,1)_inset] border border-[#000] p-0.5 md:p-1.5 flex flex-col gap-[1px] md:gap-0.5 transition-all duration-1000 md:group-hover:bg-[#080b0f] md:group-hover:border-[#111]">
                    
                    {/* The keys gradually become visible as screen turns on */}
                    <div className="opacity-[0.05] md:group-hover:opacity-100 transition-opacity duration-1500 flex flex-col gap-[1px] md:gap-0.5 h-full">
                      <KeyboardRow count={14} />
                      <KeyboardRow count={14} specialWidths={{0: '8%', 13: '8%'}} />
                      <KeyboardRow count={13} specialWidths={{0: '10%', 12: '10%'}} />
                      <KeyboardRow count={12} specialWidths={{0: '12%', 11: '12%'}} />
                      
                      {/* Spacebar Row */}
                      <div className="flex w-full flex-1 gap-[1px] md:gap-0.5">
                        <div className="flex-[0.5] bg-[#050505] rounded-[1px] md:rounded-[2px] border border-[#111] transition-colors duration-1000 md:group-hover:bg-[#11161b] md:group-hover:border-[#252e38]"></div>
                        <div className="flex-[0.5] bg-[#050505] rounded-[1px] md:rounded-[2px] border border-[#111] transition-colors duration-1000 md:group-hover:bg-[#11161b] md:group-hover:border-[#252e38]"></div>
                        <div className="flex-[0.5] bg-[#050505] rounded-[1px] md:rounded-[2px] border border-[#111] transition-colors duration-1000 md:group-hover:bg-[#11161b] md:group-hover:border-[#252e38]"></div>
                        <div className="flex-[3] bg-[#050505] rounded-[1px] md:rounded-[2px] border border-[#111] relative overflow-hidden transition-all duration-1000 md:group-hover:bg-[#11161b] md:group-hover:border-[#252e38] md:group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.8),_0_0_5px_rgba(255,255,255,0.1)]">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-1000"></div>
                        </div>
                        <div className="flex-[0.5] bg-[#050505] rounded-[1px] md:rounded-[2px] border border-[#111] transition-colors duration-1000 md:group-hover:bg-[#11161b] md:group-hover:border-[#252e38]"></div>
                        <div className="flex-[0.5] bg-[#050505] rounded-[1px] md:rounded-[2px] border border-[#111] transition-colors duration-1000 md:group-hover:bg-[#11161b] md:group-hover:border-[#252e38]"></div>
                        <div className="flex-[1] bg-[#050505] rounded-[1px] md:rounded-[2px] border border-[#111] transition-colors duration-1000 md:group-hover:bg-[#11161b] md:group-hover:border-[#252e38]"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trackpad */}
                  <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[30%] h-[22%] bg-[#020202] rounded-sm shadow-[0_1px_1px_rgba(0,0,0,1)_inset] border border-[#000] transition-colors duration-1000 md:group-hover:bg-[#080b0e] md:group-hover:border-[#111]"></div>
                  
                  {/* Thumb Groove */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/5 h-0.5 md:h-1.5 bg-[#000] rounded-t-sm shadow-[0_-1px_1px_rgba(255,255,255,0.02)_inset]"></div>
                </div>

                {/* Dynamic Screen Glow Cast on the Desk */}
                <div className="absolute -bottom-10 md:-bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-16 md:h-24 bg-white/[0.06] md:bg-white/[0.08] blur-[20px] md:blur-[40px] rounded-[100%] opacity-0 md:group-hover:opacity-100 transition-opacity duration-[1500ms] pointer-events-none z-10 transform translateZ(-20px) rotateX(70deg)"></div>

              </div>
            </div>
          </div>

          {/* AI Feature: Viral Hook Generator */}
          <div className="relative w-full max-w-4xl mx-auto mb-24 md:mb-32 z-30 px-2 sm:px-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3AE272]/20 via-[#1d4ed8]/20 to-[#3AE272]/20 rounded-[2rem] sm:rounded-[2.5rem] blur-xl opacity-50"></div>
            <div className="relative bg-[#0b1015]/80 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 md:p-12 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl flex flex-col items-center text-center">
              
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#131b24] to-[#0a0f14] text-[#3AE272] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(58,226,114,0.15)] border border-white/5 ring-1 ring-white/10">
                <Sparkles size={28} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                Test Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3AE272] to-[#6ee7b7]">AI Engine.</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-8 font-medium">
                Tell us your niche or product, and our custom AI will instantly script 3 viral-ready video hooks guaranteed to stop the scroll.
              </p>

              <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Luxury Real Estate, Dog Training..."
                  className="flex-1 bg-[#05080a]/50 border border-white/10 rounded-xl px-4 sm:px-6 py-3.5 sm:py-4 text-white text-sm sm:text-base placeholder:text-slate-600 focus:outline-none focus:border-[#3AE272]/50 focus:ring-1 focus:ring-[#3AE272]/50 transition-all backdrop-blur-md"
                  onKeyDown={(e) => e.key === 'Enter' && generateViralHooks()}
                />
                <button
                  onClick={generateViralHooks}
                  disabled={loading || !topic.trim()}
                  className="bg-[#3AE272] text-[#022c22] font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl hover:bg-[#4df287] transition-all duration-300 shadow-[0_0_20px_rgba(58,226,114,0.15)] hover:shadow-[0_0_30px_rgba(58,226,114,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> Generating...</>
                  ) : (
                    <>Generate Hooks ✨</>
                  )}
                </button>
              </div>

              {error && <p className="text-red-400 mb-6 text-sm bg-red-400/10 py-2 px-4 rounded-lg border border-red-400/20">{error}</p>}

              {hooks.length > 0 && (
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {hooks.map((hook, index) => (
                    <div key={index} className="bg-[#131b24]/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:border-[#3AE272]/40 transition-colors duration-300">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#3AE272]/30 group-hover:bg-[#3AE272] transition-colors duration-300"></div>
                      <span className="text-[#3AE272] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2 sm:mb-3 block">Hook 0{index + 1}</span>
                      <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">"{hook}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Premium Services Grid */}
          <div className="mb-12 text-left sm:text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Core <span className="text-slate-500">Expertise</span></h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">Comprehensive digital solutions designed to scale your brand to the next level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative z-20">
            {servicesList.map((service, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 rounded-[1.5rem] bg-[#0b1015]/60 backdrop-blur-md border border-white-[0.03] hover:bg-[#0f161d]/80 hover:border-[#3AE272]/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col h-full"
              >
                {/* Decorative background glow on hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3AE272]/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1rem] bg-gradient-to-b from-[#1a2530] to-[#111820] text-[#3AE272] flex items-center justify-center mb-6 sm:mb-8 shadow-inner shadow-white/5 border border-white/5 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(58,226,114,0.15)] transition-all duration-300">
                  {service.icon}
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white tracking-wide group-hover:text-[#3AE272] transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-sm text-slate-400 leading-relaxed font-medium mb-6 sm:mb-8 flex-grow">
                  {service.description}
                </p>

                <div className="mt-auto flex items-center text-xs sm:text-sm text-slate-300 font-bold group-hover:text-white transition-colors cursor-pointer w-max">
                  Explore service
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform text-[#3AE272]" />
                </div>
              </div>
            ))}
          </div>

          {/* Trusted By Section (Social Proof) */}
          <div className="mt-32 mb-24 text-center relative z-20">
            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-500 mb-8 sm:mb-10">Industry Leaders Ka Bharosa</p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <span className="text-xl md:text-3xl font-bold font-serif tracking-tight">FORBES</span>
              <span className="text-xl md:text-3xl font-bold tracking-tighter">TechCrunch</span>
              <span className="text-xl md:text-3xl font-black italic tracking-widest">WIRED</span>
              <span className="text-xl md:text-3xl font-bold tracking-widest">FASTCOMPANY</span>
              <span className="text-xl md:text-3xl font-medium font-serif">Bloomberg</span>
            </div>
          </div>

          {/* Case Studies Section */}
          <div className="mb-24 md:mb-32 relative z-20">
            <div className="mb-10 sm:mb-16 text-left sm:text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Hamare <span className="text-[#3AE272]">Case Studies</span></h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">Dekhiye kaise humne data aur creativity ka use karke brands ki growth ko multiply kiya.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                { client: 'E-commerce Brand X', result: '+340%', metric: 'RoAS Increase', desc: 'Paid ads aur CRO optimize karke humne 3 mahine mein inka revenue 3x kar diya.' },
                { client: 'Tech Startup Y', result: '2.1M', metric: 'Organic Traffic', desc: 'Technical SEO aur viral content strategy ke through pehle saal mein massive growth.' }
              ].map((study, i) => (
                <div key={i} className="group relative bg-[#0b1015]/60 backdrop-blur-md border border-white/[0.03] p-8 md:p-12 rounded-[2rem] overflow-hidden hover:border-[#3AE272]/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(58,226,114,0.05)]">
                  <div className="absolute top-0 right-0 p-6 md:p-8 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 group-hover:translate-x-2 transition-all duration-500">
                    <ArrowUpRight size={36} className="text-[#3AE272]" />
                  </div>
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#3AE272]/5 blur-[60px] rounded-full group-hover:bg-[#3AE272]/10 transition-colors duration-500 pointer-events-none"></div>
                  
                  <p className="text-[#3AE272] font-bold text-xs sm:text-sm tracking-widest uppercase mb-3">{study.client}</p>
                  <h4 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">{study.result}</h4>
                  <p className="text-lg md:text-xl font-semibold text-slate-300 mb-6">{study.metric}</p>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">{study.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-24 md:mb-32 relative z-20">
            <div className="mb-10 sm:mb-16 text-left sm:text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Client <span className="text-slate-500">Testimonials</span></h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">Hamare clients hamare baare mein kya sochte hain.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                { name: 'Sarah Jenkins', role: 'CMO, TechFlow', text: 'Inki team ne hamari marketing ka pura game change kar diya. ROI ab tak ka highest hai. High-end professionalism.' },
                { name: 'David Chen', role: 'Founder, Elevate', text: 'Ekdum premium service. Viral hooks generator aur inki content strategy ne hamari brand value actually multiply kar di.' },
                { name: 'Priya Sharma', role: 'VP Marketing, Luxe', text: 'Website redesign aur SEO ka combo itna effective tha ki organic sales 2x ho gayi within 6 months. Unbelievable results.' }
              ].map((testimonial, i) => (
                <div key={i} className="bg-[#131b24]/40 backdrop-blur-md border border-white/[0.05] p-6 sm:p-8 rounded-[1.5rem] relative hover:bg-[#16202b]/80 transition-colors duration-300 group">
                  <MessageSquare className="absolute top-6 right-6 text-white/5 group-hover:text-white/10 transition-colors duration-300" size={40} />
                  <div className="flex gap-1 mb-6 text-[#3AE272]">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                  <p className="text-slate-300 mb-8 italic text-sm md:text-base leading-relaxed relative z-10">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3AE272] to-[#1d4ed8] p-[2px]">
                      <div className="w-full h-full bg-[#0b1015] rounded-full border border-[#1a2530]"></div>
                    </div>
                    <div>
                      <p className="text-white font-bold text-xs sm:text-sm">{testimonial.name}</p>
                      <p className="text-slate-500 text-[10px] sm:text-xs font-semibold">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call To Action (CTA) Footer Section */}
          <div className="relative z-20 bg-gradient-to-br from-[#131b24] to-[#0a0f14] border border-[#3AE272]/20 rounded-[2rem] p-8 sm:p-12 md:p-16 text-center overflow-hidden shadow-[0_0_50px_rgba(58,226,114,0.05)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#3AE272]/5 blur-[100px] pointer-events-none"></div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 relative z-10 tracking-tight">Apne Brand Ko Scale Karne <br className="hidden sm:block"/>Ke Liye <span className="text-[#3AE272]">Taiyar Hain?</span></h2>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto relative z-10">Ek free strategy session book karein aur dekhein hum aapki digital presence ko kaise transform kar sakte hain. No commitment required.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button className="bg-[#3AE272] text-[#022c22] font-bold py-4 px-6 sm:px-8 rounded-xl hover:bg-[#4df287] transition-all duration-300 shadow-[0_0_20px_rgba(58,226,114,0.2)] hover:shadow-[0_0_30px_rgba(58,226,114,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base">
                Book a Discovery Call
                <ArrowRight size={18} />
              </button>
              <button className="bg-transparent text-white border border-white/20 font-bold py-4 px-6 sm:px-8 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1 text-sm sm:text-base">
                Hamara Portfolio Dekhein
              </button>
            </div>
            
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-slate-400 text-xs sm:text-sm font-medium relative z-10">
              <span className="flex items-center justify-center gap-2"><CheckCircle size={16} className="text-[#3AE272]" /> No long-term contracts</span>
              <span className="flex items-center justify-center gap-2"><CheckCircle size={16} className="text-[#3AE272]" /> ROI focused approach</span>
              <span className="flex items-center justify-center gap-2"><CheckCircle size={16} className="text-[#3AE272]" /> Dedicated expert team</span>
            </div>
          </div>

        </div>
      </main>

      {/* Custom Scrollbar CSS hiding standard scrollbar while keeping functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};