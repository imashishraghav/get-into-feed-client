"use client";

import React, { useRef, useEffect } from 'react';
import { Globe, Users, CheckCircle2, ArrowRight, LineChart, Zap, Shield, Mail, Share2 } from 'lucide-react';

export default function AboutPage() {
  const cursorRef = useRef(null);

  // Custom Mouse Follower Effect
  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const stats = [
    { label: "Brands Scaled", value: "250+" },
    { label: "Ad Spend Managed", value: "₹20Cr+" },
    { label: "In-House Experts", value: "15+" },
    { label: "Client Retention", value: "96%" }
  ];

  const team = [
    {
      name: "Ashish Raghav",
      role: "Founder & Digital Marketing Manager",
      bio: "Digital infrastructure aur high-ROI campaigns ke expert, Ashish leads the vision of Get Into Feed.",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
    },
    {
      name: "Saurabh Negi",
      role: "Lead Creative Strategist",
      bio: "Viral content aur brand storytelling ke master, Saurabh ensures every feed post stops the scroll.",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    },
    {
      name: "Sumit Mishra",
      role: "Performance Marketing Head",
      bio: "Data-driven analytics aur scaling expert, Sumit turns ad spend into massive revenue growth.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div style={{ fontFamily: "'Raleway', sans-serif" }} className="min-h-screen bg-[#020408] text-zinc-400 relative selection:bg-[#3AE272]/30 selection:text-white overflow-x-hidden pt-16">
      
      {/* Custom Follower Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#3AE272]/60 pointer-events-none z-[100] transition-transform duration-100 ease-out hidden md:block"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vh] bg-[#3AE272]/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vh] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <main className="relative z-10 pt-20 pb-32 px-6 lg:px-8 max-w-[1400px] mx-auto">
        
        {/* --- Hero Section --- */}
        <div className="text-center mb-24 relative px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-[#3AE272] animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-300">About Get Into Feed</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-white">
            We don't just run ads. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3AE272] via-[#6ee7b7] to-[#3AE272]">We engineer empires.</span>
          </h1>
          <p className="text-base md:text-xl text-zinc-400 font-medium leading-relaxed">
            Get Into Feed ek growth agency hai jo digital era ke liye bani hai. Hum creative storytelling aur algorithmic precision ka use karte hain taaki aapke brand ko actual revenue mil sake.
          </p>
        </div>

        {/* --- Stats Banner --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-32 relative z-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#0b1015]/60 backdrop-blur-md border border-white/[0.03] p-6 sm:p-8 rounded-[1.5rem] text-center hover:border-[#3AE272]/30 hover:-translate-y-1 transition-all duration-300 group">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-[#3AE272] transition-colors">{stat.value}</h3>
              <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* --- Our Story Split Section --- */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32 relative z-20">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#3AE272]/20 to-blue-600/20 rounded-[2.5rem] blur-2xl opacity-50"></div>
            <div className="relative bg-[#0b1015] border border-white/10 rounded-[2rem] p-2 aspect-square overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" 
                alt="Our Team Working" 
                className="w-full h-full object-cover rounded-[1.5rem] opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent"></div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Built out of <span className="text-[#3AE272]">frustration</span> with traditional agencies.</h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
              Humne Get Into Feed isliye shuru kiya kyunki hum brands ko un outdated marketing tactics par paisa barbaad karte hue dekh kar thak chuke the. Aaj ka digital landscape agility, data obsession, aur platform algorithms ki gehri samajh maangta hai.
            </p>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
              Humein vanity metrics jaise impressions ya clicks se koi farq nahi padta agar wo conversions mein na badlein. Hamara ek hi goal hai: aapke Return on Ad Spend (ROAS) ko maximize karna aur business ko sustainably scale karna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#3AE272] w-5 h-5" />
                <span className="text-white font-medium">Results-Driven</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#3AE272] w-5 h-5" />
                <span className="text-white font-medium">Platform Native</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#3AE272] w-5 h-5" />
                <span className="text-white font-medium">Scalable Growth</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Why Choose Us Section --- */}
        <div className="mb-32 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Why <span className="text-[#3AE272]">Choose Us?</span></h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">Hum sirf promises nahi karte, hum scalable systems build karte hain jo actual revenue drive karte hain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <LineChart className="w-8 h-8" />,
                title: "Data-Obsessed",
                desc: "Har campaign data aur deep analytics par based hota hai. Zero guesswork, pure performance."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                desc: "Trends roz badalte hain. Hamari agile team market shifts ko catch karke instantly execute karti hai."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "100% Transparent",
                desc: "Live dashboards aur clear reporting. Aapko hamesha pata hoga aapka ek-ek paisa kahan invest ho raha hai."
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Omnichannel Growth",
                desc: "SEO se lekar Paid Ads aur Social Media tak—hum aapke brand ko har jagah dominate karwate hain."
              }
            ].map((item, idx) => (
              <div key={idx} className="group bg-[#0b1015]/40 backdrop-blur-sm border border-white/[0.05] p-8 rounded-[2rem] hover:bg-[#0f161d]/80 hover:border-[#3AE272]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(58,226,114,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3AE272]/5 blur-[40px] rounded-full group-hover:bg-[#3AE272]/10 transition-colors duration-500 pointer-events-none"></div>
                <div className="text-[#3AE272] mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#3AE272] transition-colors duration-300">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- Meet Our Team Section --- */}
        <div className="mb-32 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Meet our <span className="text-[#3AE272]">Team</span></h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">The masterminds behind your brand's explosive growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {team.map((member, idx) => (
              <div key={idx} className="group relative bg-[#0b1015]/60 backdrop-blur-md border border-white/[0.03] p-6 rounded-[2rem] overflow-hidden hover:border-[#3AE272]/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(58,226,114,0.05)] text-center">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#3AE272]/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-tr from-[#3AE272] to-blue-600 p-[3px] mb-6 group-hover:scale-105 transition-transform duration-500 shadow-xl">
                  <div className="w-full h-full rounded-full border-4 border-[#0b1015] overflow-hidden bg-slate-800">
                     <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-[#3AE272] transition-colors duration-300">{member.name}</h3>
                <p className="text-[#3AE272] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6">{member.role}</p>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 px-2">
                  {member.bio}
                </p>
                
                <div className="flex justify-center gap-4">
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#3AE272]/20 hover:text-[#3AE272] hover:border-[#3AE272]/50 transition-all text-zinc-400"><Share2 size={18} /></a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#3AE272]/20 hover:text-[#3AE272] hover:border-[#3AE272]/50 transition-all text-zinc-400"><Mail size={18} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CTA Section --- */}
        <div className="relative z-20 bg-gradient-to-br from-[#131b24] to-[#0a0f14] border border-[#3AE272]/20 rounded-[2rem] p-8 sm:p-12 md:p-16 text-center overflow-hidden shadow-[0_0_50px_rgba(58,226,114,0.05)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#3AE272]/5 blur-[100px] pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 relative z-10 tracking-tight">Ready to scale your <br className="hidden sm:block"/>brand <span className="text-[#3AE272]">history?</span></h2>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto relative z-10">Hum un brands ke saath kaam karte hain jo scaling ke liye serious hain.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button className="bg-[#3AE272] text-[#022c22] font-bold py-4 px-8 rounded-xl hover:bg-[#4df287] transition-all duration-300 shadow-[0_0_20px_rgba(58,226,114,0.2)] hover:shadow-[0_0_30px_rgba(58,226,114,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Your Journey
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}