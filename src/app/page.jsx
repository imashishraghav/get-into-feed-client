"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Play, Volume2, Pause, CheckCircle2, ArrowRight, Zap, BarChart, Users, Heart, MessageCircle, Send, MoreVertical, Music, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  // State to hold the random heights of the audio visualizer safely
  const [waveHeights, setWaveHeights] = useState(Array(40).fill(20));

  // Generate the random heights only AFTER the page loads in the browser
  useEffect(() => {
    const newHeights = Array.from({ length: 40 }).map(() => Math.random() * 60 + 10);
    setWaveHeights(newHeights);
  }, []);

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      
      {/* --- Background Ambient Glows --- */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vh] bg-green-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vh] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-[30%] right-[20%] w-[30vw] h-[30vh] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* --- Main Hero Section --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-10 md:pt-32 md:pb-16 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Content & Video Player */}
        <div className="flex flex-col gap-8 relative z-20">
          <div>
            <h1 className="text-4xl lg:text-5xl xl:text-[3.2rem] font-['Raleway',sans-serif] font-extrabold leading-[1.1] tracking-[-0.02em] mb-5 text-white drop-shadow-md">
              Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">Social Media</span><br />
              <span className="whitespace-nowrap">Into Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300 font-semibold italic tracking-normal">Growth Engine</span></span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-lg lg:max-w-xl leading-relaxed">
              Get into Feed helps brands grow with powerful social media strategy, creative content, and performance marketing that converts followers into customers.
            </p>
          </div>

          {/* Video Player Mockup */}
          <div className="relative w-full max-w-lg mt-4 rounded-2xl overflow-hidden border border-white/10 bg-[#0d131f]/80 backdrop-blur-md p-1 shadow-2xl shadow-cyan-900/20">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #00ffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0a0f18] to-[#151f2e] p-6 aspect-[16/9] flex flex-col justify-between group">
              {/* Audio Waveform Graphic */}
              <div className="absolute inset-0 flex items-center justify-center opacity-60">
                 <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <path d="M0,75 Q50,20 100,75 T200,75 T300,75 T400,75" fill="none" stroke="url(#wave-grad-1)" strokeWidth="2" />
                    <path d="M0,75 Q50,130 100,75 T200,75 T300,75 T400,75" fill="none" stroke="url(#wave-grad-2)" strokeWidth="2" opacity="0.5" />
                    
                    {/* Updated safely hydrated bars */}
                    {waveHeights.map((h, i) => (
                      <rect 
                        key={i} 
                        x={i * 10} 
                        y={75 - h/2} 
                        width="2" 
                        height={h} 
                        fill="url(#wave-grad-1)" 
                        rx="1" 
                        className="animate-pulse" 
                        style={{animationDelay: `${i * 0.1}s`}}
                      />
                    ))}

                    <defs>
                      <linearGradient id="wave-grad-1" x1="0" y1="0" x2="1" y2="0">
                        <stop stopColor="#39FF14" stopOpacity="0.8"/>
                        <stop offset="1" stopColor="#00FFFF" stopOpacity="0.8"/>
                      </linearGradient>
                      <linearGradient id="wave-grad-2" x1="0" y1="0" x2="1" y2="0">
                         <stop stopColor="#00FFFF" stopOpacity="0.5"/>
                         <stop offset="1" stopColor="#39FF14" stopOpacity="0.5"/>
                      </linearGradient>
                    </defs>
                 </svg>
              </div>

              {/* Central Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group-hover:scale-110">
                  <Play className="w-6 h-6 text-white ml-1 fill-white" />
                </button>
              </div>

              {/* Top Text */}
              <div className="relative text-center mt-auto mb-10">
                <h3 className="text-xl font-bold">Get Into Feed</h3>
                <p className="text-green-400 text-xs tracking-[0.2em] font-medium mt-1 uppercase">Introduction</p>
              </div>

              {/* Bottom Controls */}
              <div className="relative flex flex-col gap-2 w-full">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-3">
                    <Pause className="w-4 h-4" />
                    <Volume2 className="w-4 h-4" />
                    <span>03:38</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400 font-medium bg-red-500/10 px-2 py-1 rounded">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></div>
                    128 Watching Live
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA & Trust */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4">
            <button className="relative px-8 py-3 rounded-full bg-[#0a111a] border border-cyan-500/50 text-white font-medium overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500 group-hover:duration-200"></div>
              <span className="relative z-10 flex items-center gap-2">Book Your Free Trial</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <span>Trusted by</span>
               <strong className="text-white">500+</strong>
               <span>Leading Brands</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visuals & Floating Cards */}
        <div className="relative h-[600px] w-full hidden lg:block">
          
          {/* Connecting Network Lines (SVG) */}
          <div className="absolute inset-0 pointer-events-none -left-32">
            <svg width="100%" height="100%" viewBox="0 0 600 600" fill="none" className="opacity-40">
              <path d="M 0 300 C 150 300, 200 150, 400 150" stroke="#ff004f" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" filter="url(#glow-red)" />
              <path d="M 0 300 C 100 350, 250 450, 450 450" stroke="#00ffff" strokeWidth="1.5" filter="url(#glow-cyan)" />
              <path d="M 50 280 C 200 280, 250 250, 400 250" stroke="#39FF14" strokeWidth="1" filter="url(#glow-green)" />
              <path d="M 0 320 C 150 320, 200 400, 350 400" stroke="#8a2be2" strokeWidth="2" filter="url(#glow-purple)" opacity="0.6"/>
              
              <defs>
                <filter id="glow-red"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-cyan"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-green"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-purple"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
            </svg>
          </div>

          {/* Floating Social Nodes */}
          <div className="absolute top-[10%] left-[20%] z-30">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.8)]">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>
          <div className="absolute top-[40%] left-[25%] z-30">
            <div className="w-10 h-10 rounded-full bg-[#ff0050] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,80,0.6)] border border-white/20 text-white font-bold italic text-lg leading-none">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
            </div>
          </div>
           <div className="absolute top-[50%] left-[30%] z-30">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.8)]">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-[20%] left-[35%] z-30">
            <div className="w-10 h-10 rounded-full bg-[#0077b5] flex items-center justify-center shadow-[0_0_20px_rgba(0,119,181,0.6)]">
              <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </div>
          </div>

          {/* Cards Container - Using 3D positioning via transforms */}
          <div className="relative w-full h-full perspective-[1000px]">
            
            {/* Card 1: Google Ads (Back Left) */}
            <div className="absolute top-24 right-44 w-64 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl transform rotate-y-[-10deg] rotate-z-[-5deg] scale-90 z-10 transition-transform duration-500 hover:scale-95 hover:z-40">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">
                  <span className="text-blue-500">G</span><span className="text-red-500">o</span>
                </div>
                <h4 className="font-semibold text-sm">Google Ads</h4>
              </div>
              <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                Capture high-intent customers with precision. Maximize conversions.
              </p>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                <span className="text-xs text-gray-400">Avg. CPA:</span>
                <span className="text-xl font-bold text-cyan-400">$15.50</span>
              </div>
            </div>

            {/* Card 3: Meta (Back Right) */}
            <div className="absolute top-12 -right-4 w-64 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl transform rotate-y-[10deg] rotate-z-[5deg] scale-90 z-20 transition-transform duration-500 hover:scale-95 hover:z-40">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#1877F2] rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white fill-white" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V15.3h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 3.3h-2.33v6.579C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </div>
                <h4 className="font-semibold text-sm">Meta</h4>
              </div>
              <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                Scale your brand using high-converting Facebook and Instagram advertising.
              </p>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-cyan-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div className="text-right">
                   <span className="text-[10px] text-gray-400 block">Avg. ROI:</span>
                   <span className="text-lg font-bold text-cyan-400">5.4x</span>
                </div>
              </div>
            </div>

            {/* Card 2: Social Media Growth (Front Center) */}
            <div className="absolute top-32 right-12 w-80 bg-gradient-to-b from-[#1a2332]/90 to-[#0f1623]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,255,255,0.1)] z-30 transform transition-transform duration-500 hover:-translate-y-2">
              
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                   <svg className="w-5 h-5 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Social Media</h3>
                  <p className="text-cyan-400 text-sm">Growth</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="w-8 h-2 bg-cyan-400 rounded-full mb-2"></div>
                  <div className="text-xl font-bold text-white">12.4k</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="w-8 h-2 bg-cyan-500/50 rounded-full mb-2"></div>
                  <div className="flex items-baseline gap-1">
                     <div className="text-xl font-bold text-white">85%</div>
                  </div>
                  <div className="text-xs text-gray-400">Organic Reach</div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="bg-[#0b1018] rounded-xl p-4 border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-gray-400">Engagement Rate:</span>
                  <span className="text-sm font-bold text-green-400">4.8%</span>
                </div>
                {/* Simulated SVG Line Chart */}
                <div className="h-20 w-full relative">
                  <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#39FF14" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#39FF14" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 60 Q 20 50, 40 60 T 80 50 T 120 70 T 150 40 T 200 10" fill="none" stroke="#39FF14" strokeWidth="2" filter="url(#glow-green)"/>
                    <path d="M0 60 Q 20 50, 40 60 T 80 50 T 120 70 T 150 40 T 200 10 L 200 80 L 0 80 Z" fill="url(#chart-grad)" />
                    
                    {/* Data Point Glow */}
                    <circle cx="150" cy="40" r="4" fill="#39FF14" className="animate-pulse shadow-[0_0_10px_#39FF14]" />
                  </svg>
                  <div className="absolute top-2 left-[68%] w-1 h-12 bg-green-400/20"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* --- Brand Ticker --- */}
      <div className="relative z-10 w-full overflow-hidden border-t border-white/5 bg-[#05080f]/50 py-6">
         <div className="flex w-[200%] animate-slide opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Duplicate content for seamless infinite scrolling effect */}
            <div className="flex w-1/2 justify-around items-center px-10">
               <LogoPlaceholder text="Google" icon={<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>} />
               <LogoPlaceholder text="Apple" icon={<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M16.365 14.384c-.015-2.913 2.38-4.305 2.492-4.376-1.352-1.977-3.441-2.24-4.183-2.28-1.777-.18-3.468 1.05-4.372 1.05-.904 0-2.3-1.018-3.784-.99-1.93.027-3.712 1.123-4.697 2.842-2.008 3.479-.513 8.618 1.442 11.453.957 1.393 2.083 2.946 3.605 2.89 1.464-.055 2.025-.944 3.73-.944 1.706 0 2.213.944 3.758.916 1.572-.027 2.556-1.408 3.504-2.793 1.096-1.602 1.545-3.153 1.57-3.235-.035-.015-2.952-1.134-2.965-4.533zm-2.454-7.056c.808-.976 1.353-2.336 1.205-3.692-1.161.047-2.583.774-3.414 1.751-.664.776-1.312 2.158-1.137 3.493 1.298.1 2.54-.658 3.346-1.552z"/></svg>}/>
               <LogoPlaceholder text="Beats" />
               <LogoPlaceholder text="Blusdern" />
               <LogoPlaceholder text="FIRIASNE" />
               <LogoPlaceholder text="Pleynt" />
               <LogoPlaceholder text="Vogo" />
            </div>
             <div className="flex w-1/2 justify-around items-center px-10">
               <LogoPlaceholder text="Google" icon={<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>} />
               <LogoPlaceholder text="Apple" icon={<svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M16.365 14.384c-.015-2.913 2.38-4.305 2.492-4.376-1.352-1.977-3.441-2.24-4.183-2.28-1.777-.18-3.468 1.05-4.372 1.05-.904 0-2.3-1.018-3.784-.99-1.93.027-3.712 1.123-4.697 2.842-2.008 3.479-.513 8.618 1.442 11.453.957 1.393 2.083 2.946 3.605 2.89 1.464-.055 2.025-.944 3.73-.944 1.706 0 2.213.944 3.758.916 1.572-.027 2.556-1.408 3.504-2.793 1.096-1.602 1.545-3.153 1.57-3.235-.035-.015-2.952-1.134-2.965-4.533zm-2.454-7.056c.808-.976 1.353-2.336 1.205-3.692-1.161.047-2.583.774-3.414 1.751-.664.776-1.312 2.158-1.137 3.493 1.298.1 2.54-.658 3.346-1.552z"/></svg>}/>
               <LogoPlaceholder text="Beats" />
               <LogoPlaceholder text="Blusdern" />
               <LogoPlaceholder text="FIRIASNE" />
               <LogoPlaceholder text="Pleynt" />
               <LogoPlaceholder text="Vogo" />
            </div>
         </div>
         <style dangerouslySetInnerHTML={{__html: `
           @import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap');
           @keyframes slide {
             0% { transform: translateX(0); }
             100% { transform: translateX(-50%); }
           }
           .animate-slide {
             animation: slide 30s linear infinite;
           }
           /* New Subtle Wiggle/Float Animation */
           @keyframes float-wiggle {
             0%, 100% { transform: translate(0, 0) rotate(0deg); }
             25% { transform: translate(-1.5px, -2.5px) rotate(-0.5deg); }
             50% { transform: translate(1.5px, 1.5px) rotate(0.5deg); }
             75% { transform: translate(-1px, 2.5px) rotate(-0.25deg); }
           }
           .animate-wiggle {
             animation: float-wiggle 6s ease-in-out infinite;
           }
           /* Hide scrollbar for slider but keep functionality */
           .scrollbar-hide::-webkit-scrollbar {
              display: none;
           }
           .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
           }
         `}} />
      </div>

      <SuccessBanner />
      <FeaturesSection />
      <InfluencerProgramme />
      <AgencyHub />
      <CustomerReviews />
      <ChooseService />
      <ContactBanner />

    </div>
  );
}

// Helper component for bottom logos
const LogoPlaceholder = ({ text, icon }) => (
  <div className="flex items-center gap-2 text-gray-500 font-medium text-lg tracking-wider">
    {icon || <div className="w-6 h-6 rounded-full border-2 border-current opacity-70"></div>}
    <span>{text}</span>
  </div>
);

const SuccessBanner = () => {
  return (
    <section className="relative z-10 py-12 md:py-16 px-6 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0d131f] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch shadow-2xl">
          {/* Left Side: Text */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 font-bold px-4 py-2 rounded-full text-sm mb-6 w-max border border-green-500/30">
              <CheckCircle2 className="w-4 h-4" />
              Real Results
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-['Raleway',sans-serif] font-bold text-white leading-[1.1] mb-6">
              We help to <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300">boost your sale</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base lg:text-lg leading-relaxed mb-8">
              Just like this local cafe owner, our targeted ad campaigns bring high-intent customers right to your door, turning foot traffic into loyal patrons and skyrocketing daily orders.
            </p>
            <button className="bg-gradient-to-r from-green-400 to-green-600 text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold w-max hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
              See Case Study
            </button>
          </div>

          {/* Right Side: Image */}
          <div className="w-full md:w-1/2 min-h-[250px] md:min-h-[400px] relative flex items-center justify-center p-8 bg-white/5">
            <svg viewBox="0 0 200 200" className="w-full h-full max-w-[200px] md:max-w-[280px] text-gray-300 fill-none stroke-current stroke-2">
              <path d="M100,170 C140,170 170,140 170,100 C170,60 140,30 100,30 C60,30 30,60 30,100 C30,140 60,170 100,170 Z" />
              <path d="M60,100 C60,80 80,60 100,60 C120,60 140,80 140,100 C140,120 120,140 100,140 C80,140 60,120 60,100 Z" />
              <path d="M30,100 C40,70 70,40 100,40" />
              <path d="M170,100 C160,130 130,160 100,160" />
              {/* Scribbles */}
              <path d="M40,80 Q50,60 60,70 T80,60" strokeWidth="1" />
              <path d="M120,60 Q130,40 140,50 T160,40" strokeWidth="1" />
              <path d="M40,120 Q50,140 60,130 T80,140" strokeWidth="1" />
              <path d="M120,140 Q130,160 140,150 T160,160" strokeWidth="1" />
              <path d="M80,80 Q90,100 100,90 T120,100" strokeWidth="1" />
              <path d="M80,120 Q90,100 100,110 T120,100" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    { icon: <Zap className="w-6 h-6 text-white" />, title: "Viral Algorithms", desc: "We reverse-engineer social algorithms to maximize your content's organic reach and engagement." },
    { icon: <BarChart className="w-6 h-6 text-white" />, title: "Data-Driven ROI", desc: "Every campaign is backed by hard data, ensuring your ad spend translates directly into measurable revenue." },
    { icon: <Users className="w-6 h-6 text-white" />, title: "Community Building", desc: "Turn passive scrollers into loyal brand advocates through targeted community management." }
  ];

  return (
    <section className="relative z-10 py-12 md:py-16 px-6 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-['Raleway',sans-serif] font-bold mb-4 text-white">
            Dominate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Digital Landscape</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Stop guessing what works. Our full-stack marketing approach guarantees growth.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <div key={i} className="animate-wiggle h-full" style={{ animationDelay: `${i * -1.5}s` }}>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 p-6 md:p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 group relative overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.05)] hover:shadow-[0_0_40px_rgba(57,255,20,0.15)] h-full flex flex-col backdrop-blur-sm">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 border border-green-400/30 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const InfluencerProgramme = () => {
  const reels = [
    {
      handle: "@sarah.creates",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      videoThumb: "https://images.unsplash.com/photo-1611601322175-925c427ee20b?auto=format&fit=crop&w=600&q=80",
      caption: "POV: You finally found the perfect strategy to boost your cafe's weekend sales! ☕️📈 #growth #marketing",
      likes: "24.5K",
      comments: "1,204",
      audio: "Original Audio - sarah.creates"
    },
    {
      handle: "@jordan_style",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
      videoThumb: "https://images.unsplash.com/photo-1529139574466-a303027c028c?auto=format&fit=crop&w=600&q=80",
      caption: "Partnering with Get Into Feed was the best decision for my brand this year. Link in bio! 🚀🔥",
      likes: "89.2K",
      comments: "3,440",
      audio: "Trending Beat - DJ Khaled"
    },
    {
      handle: "@mia.lifestyle",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      videoThumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      caption: "A day in the life of a full-time content creator. Let's get these views! 📸✨ #influencer #vlog",
      likes: "112K",
      comments: "5,892",
      audio: "Aesthetic Vibes - Lofi Study"
    }
  ];

  return (
    <section className="relative z-10 py-12 md:py-20 px-6 bg-[#070b14] w-full border-t border-white/5 overflow-hidden">
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Green Glowing Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[60%] h-[60%] bg-green-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-['Raleway',sans-serif] font-bold mb-4 text-white drop-shadow-lg">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300 drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">Influencer Programme</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg">
            Become part of our exclusive network. We connect top creators with high-growth brands to produce viral content and drive massive sales.
          </p>
        </div>

        {/* 3D Stacked Reels Grid */}
        <div className="relative flex justify-center items-center h-[450px] md:h-[550px] w-full max-w-5xl mx-auto mt-8 md:mt-12">
          {reels.map((reel, index) => {
            let positionClasses = "";
            if (index === 0) positionClasses = "absolute z-10 -translate-x-[55%] md:-translate-x-[95%] -rotate-6 scale-[0.85] opacity-40 blur-[2px] hover:blur-none hover:opacity-100 hover:z-40 hover:scale-[0.9] transition-all duration-500";
            if (index === 1) positionClasses = "relative z-30 scale-100 shadow-[0_0_50px_rgba(57,255,20,0.25)] hover:scale-[1.02] transition-all duration-500";
            if (index === 2) positionClasses = "absolute z-10 translate-x-[55%] md:translate-x-[95%] rotate-6 scale-[0.85] opacity-40 blur-[2px] hover:blur-none hover:opacity-100 hover:z-40 hover:scale-[0.9] transition-all duration-500";

            return (
              <div key={index} className={`w-[240px] md:w-[300px] aspect-[9/16] bg-gray-900 rounded-[2rem] overflow-hidden border-[4px] border-white/10 ${positionClasses}`}>
                {/* Background Video/Image */}
                <img src={reel.videoThumb} alt={reel.handle} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105" />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                {/* Top Play Indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                  <Play className="w-4 h-4 ml-0.5 fill-white" />
                </div>

                {/* Right Side Actions */}
                <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4 z-10">
                  <button className="flex flex-col items-center group/btn">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform group-hover/btn:scale-110">
                      <Heart className="w-6 h-6 md:w-7 md:h-7 text-white hover:fill-red-500 hover:text-red-500 transition-colors" />
                    </div>
                    <span className="text-white text-[10px] md:text-xs font-medium drop-shadow-md">{reel.likes}</span>
                  </button>
                  <button className="flex flex-col items-center group/btn">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform group-hover/btn:scale-110">
                      <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white fill-white/20" />
                    </div>
                    <span className="text-white text-[10px] md:text-xs font-medium drop-shadow-md">{reel.comments}</span>
                  </button>
                  <button className="flex flex-col items-center group/btn">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform group-hover/btn:scale-110">
                      <Send className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <span className="text-white text-[10px] md:text-xs font-medium drop-shadow-md">Share</span>
                  </button>
                </div>

                {/* Bottom Info Section */}
                <div className="absolute bottom-4 left-4 right-14 z-10">
                  {/* Profile row */}
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <img src={reel.avatar} alt="avatar" className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                    <span className="text-white font-bold text-xs md:text-sm drop-shadow-md truncate">{reel.handle}</span>
                  </div>
                  
                  {/* Caption */}
                  <p className="text-white text-[10px] md:text-xs leading-snug drop-shadow-md mb-2 line-clamp-2">
                    {reel.caption}
                  </p>

                  {/* Audio Ticker */}
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-full w-max max-w-[90%] border border-white/10">
                    <Music className="w-3 h-3 text-white shrink-0" />
                    <div className="overflow-hidden w-full relative">
                      <div className="whitespace-nowrap text-[9px] md:text-[10px] text-white font-medium truncate">
                        {reel.audio}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 md:mt-12 text-center relative z-20">
           <button className="bg-gradient-to-r from-green-400 to-green-600 text-black px-8 md:px-10 py-3 md:py-4 rounded-full font-extrabold text-base md:text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:shadow-[0_0_50px_rgba(57,255,20,0.8)] border border-green-300/50">
             Apply as Creator
           </button>
        </div>
      </div>
    </section>
  );
};

const AgencyHub = () => {
  return (
    <section className="relative z-10 py-12 md:py-20 bg-[#070b14] w-full overflow-hidden border-t border-white/5">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-12 relative z-20 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-['Raleway',sans-serif] font-bold mb-4 md:mb-6 text-white">
          The Engine Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">Your Brand</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg">
          We operate at the intersection of a creative powerhouse and a data-driven marketing agency.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto w-full px-6 z-20">
         {/* Center Logo - Visible on Desktop only */}
         <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#0d131f] border border-white/10 items-center justify-center shadow-[0_0_60px_rgba(57,255,20,0.15)] p-6 md:p-8 backdrop-blur-xl">
           <img src="gif-02.png" alt="Get Into Feed Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
         </div>

         {/* GRID REPLACES ABSOLUTE POSITIONING TO ELIMINATE BLANK SPACES */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-x-48 lg:gap-y-12 relative">
            {/* SVG Connecting Lines behind grid items - Desktop */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block -z-10" preserveAspectRatio="none">
              <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 6" />
              <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 6" />
              <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 6" />
              <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 6" />
            </svg>

            {/* Card: Creative Strategy */}
            <div className="animate-wiggle" style={{ animationDelay: '0s' }}>
              <div className="bg-[#121926]/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">Creative Strategy</h3>
                <p className="text-gray-400 text-sm leading-relaxed">We forge unique brand identities and scroll-stopping visual assets that capture attention in a crowded feed.</p>
              </div>
            </div>

            {/* Card: Performance Ads */}
            <div className="animate-wiggle" style={{ animationDelay: '-1.5s' }}>
              <div className="bg-[#121926]/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20">
                  <BarChart className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">Performance Ads</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Data-driven media buying across Meta, TikTok, and Google to maximize ROI and scale customer acquisition.</p>
              </div>
            </div>

            {/* Card: Content Production */}
            <div className="animate-wiggle" style={{ animationDelay: '-3s' }}>
              <div className="bg-[#121926]/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
                  <Play className="w-6 h-6 text-green-400 ml-0.5" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">Content Production</h3>
                <p className="text-gray-400 text-sm leading-relaxed">In-house production of high-converting short-form video, viral UGC, and static creatives tailored for success.</p>
              </div>
            </div>

            {/* Card: Social Growth */}
            <div className="animate-wiggle" style={{ animationDelay: '-4.5s' }}>
              <div className="bg-[#121926]/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                  <Users className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">Social Growth</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Building authentic communities, managing daily engagement, and executing viral organic campaigns.</p>
              </div>
            </div>
         </div>
      </div>
    </section>
  );
};

const CustomerReviews = () => {
  const scrollRef = useRef(null);
 
  const reviews = [
    { name: "Alex R.", role: "Cafe Owner", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80", text: "Get Into Feed completely transformed our weekend foot traffic. We're seeing 3x more customers from Instagram alone!", rating: 5 },
    { name: "Sarah J.", role: "E-com Founder", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", text: "Their performance ads cut our CPA in half. The creative team knows exactly what stops the scroll.", rating: 5 },
    { name: "Mike T.", role: "Fitness Coach", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", text: "I gained 10k highly engaged followers in just two months. The influencer strategy is unmatched.", rating: 5 },
    { name: "Emily W.", role: "Boutique Owner", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", text: "Best marketing decision we've made. The team is responsive, creative, and strictly ROI-focused.", rating: 5 },
    { name: "David K.", role: "Tech Startup CEO", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", text: "We scaled our user base rapidly thanks to their viral algorithms and pinpoint accurate targeting.", rating: 5 },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / (window.innerWidth < 768 ? 1 : 3);
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative z-10 py-12 md:py-16 px-6 w-full border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-['Raleway',sans-serif] font-bold text-white mb-3 md:mb-4">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Founders</span>
            </h2>
            <p className="text-gray-400 max-w-xl text-sm md:text-base">
              Don't just take our word for it. Here's what our partners have to say about their growth journey.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => scroll('left')} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-[#1a2332] flex items-center justify-center hover:bg-green-500/20 hover:border-green-500/50 transition-colors shadow-sm active:translate-y-[2px]">
               <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
             </button>
             <button onClick={() => scroll('right')} className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(57,255,20,0.3)] active:translate-y-[2px]">
               <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-black" />
             </button>
          </div>
        </div>

        {/* Slider Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pt-2"
        >
          {reviews.map((r, i) => (
            <div key={i} className="min-w-[85vw] md:min-w-[calc(33.3333%-1rem)] snap-start shrink-0 h-auto">
              {/* Card Style */}
              <div className="bg-gradient-to-br from-[#121926] to-[#0d131f] border border-white/10 p-6 md:p-8 rounded-2xl shadow-xl flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                {/* Profile row */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-green-500/50 bg-[#1a2332] overflow-hidden shrink-0 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                     <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base md:text-lg leading-tight">{r.name}</h4>
                    <span className="text-green-400 text-xs font-medium block mb-1">{r.role}</span>
                    <div className="flex text-yellow-400 gap-0.5 mt-1">
                       {[...Array(r.rating)].map((_, idx) => <Star key={idx} className="w-3 md:w-3.5 h-3 md:h-3.5 fill-current" />)}
                    </div>
                  </div>
                </div>
                {/* Review Text */}
                <p className="text-gray-300 text-sm font-medium leading-relaxed mb-6 flex-grow">"{r.text}"</p>
                {/* Action Button */}
                <button className="text-white bg-white/5 border border-white/10 font-medium py-2 px-5 rounded-full text-xs w-max hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ChooseService = () => {
  const services = [
    "Performance Marketing",
    "Branding",
    "Social Media Managing",
    "Online Brand Building",
    "Influencer Marketing"
  ];

  return (
    <section className="relative z-10 py-12 md:py-16 lg:py-24 w-full border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-['Raleway',sans-serif] font-bold text-white mb-8 md:mb-12">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Service</span>
        </h2>
        {/* Service Tag Cloud Layout */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="animate-wiggle"
              style={{ animationDelay: `${index * -0.7}s` }}
            >
              <button className="bg-[#121926]/80 backdrop-blur-sm border border-green-500/50 text-white font-bold text-sm md:text-base py-2.5 px-6 md:py-3 md:px-8 rounded-full hover:bg-green-500/20 transition-all duration-300 shadow-[0_4px_15px_rgba(57,255,20,0.1)] hover:shadow-[0_4px_25px_rgba(57,255,20,0.3)] active:scale-95 flex items-center gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400 animate-pulse"></div>
                {service}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactBanner = () => {
  return (
    <section className="relative z-10 py-12 md:py-16 px-6 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row items-center relative shadow-[0_0_40px_rgba(57,255,20,0.15)] overflow-hidden border border-green-400/30">
          {/* Decorative Background Blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Left Side: Line Art Brain Illustration */}
          <div className="w-full md:w-5/12 relative flex justify-center items-center p-6 md:p-8 h-48 md:h-80 bg-black/10">
            <svg viewBox="0 0 200 200" className="w-full h-full max-w-[160px] md:max-w-[240px] text-[#05080f] fill-none stroke-current stroke-[6] drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)] overflow-visible">
              {/* Brain Outline */}
              <path d="M100 160C140 160 170 140 170 100C170 65 145 40 100 50C55 40 30 65 30 100C30 140 60 160 100 160Z" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Brain Hemispheres divider */}
              <path d="M100 50C100 50 110 80 100 160" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Brain Folds */}
              <path d="M40 90C60 80 80 90 100 80" strokeLinecap="round"/>
              <path d="M35 120C60 110 70 130 100 120" strokeLinecap="round"/>
              <path d="M160 90C140 80 120 90 100 80" strokeLinecap="round"/>
              <path d="M165 120C140 110 130 130 100 120" strokeLinecap="round"/>
              {/* Confused Messy Scribbles */}
              <path d="M 70 30 C 40 -10, 130 -30, 130 10 C 130 50, 50 50, 60 10 C 70 -30, 160 0, 150 30 C 140 60, 80 60, 90 20" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 50 50 C 10 20, 80 -10, 80 30 C 80 70, 30 70, 40 40" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Action lines (Confusion marks) */}
              <path d="M160 -10 L175 -25 M180 30 L200 25 M20 30 L0 25 M40 -10 L25 -25" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Right Side: Text & CTA */}
          <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 text-center md:text-left z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-['Raleway',sans-serif] font-extrabold text-white mb-3 md:mb-4 leading-tight">
              Still confused?
            </h2>
            <p className="text-green-50/90 text-sm md:text-lg lg:text-xl font-medium mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
              Connect us to get more details. We'll walk you through our strategies and show you exactly how we can boost your sales.
            </p>
            <button className="bg-[#05080f] text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-gray-900 transition-colors shadow-xl active:scale-95 flex items-center justify-center gap-2 mx-auto md:mx-0 border border-white/10 hover:border-green-400/50">
              Get in Touch <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};