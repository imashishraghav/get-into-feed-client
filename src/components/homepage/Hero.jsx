"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, ArrowRight, Play, Search, Target, Zap, BarChart3 } from 'lucide-react';
// Updated Imports: Removed itemFadeUp, added blurFadeUp
import { staggerContainer, fadeUp, blurFadeUp, premiumEase } from '../../utils/animations';
import VideoModal from './VideoModal';

// --- Helper Component: 3D Tilt Card ---
const TiltCard = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Softer spring for a more premium, weighty feel
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(50px)" }} className="w-full h-full pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
};

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="relative w-full pt-32 pb-10 md:pt-40 md:pb-12 overflow-hidden bg-[#F8F9FB]">
        {/* Premium Background Gradients & Depth */}
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#2ED1B2]/10 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#0EA5A4]/5 blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left Column: Copywriting & CTAs */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 relative z-20"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] text-[#0F172A] text-xs font-semibold w-max shadow-[0_8px_30px_rgb(0,0,0,0.04)] uppercase tracking-widest">
                <Zap className="w-4 h-4 text-[#2ED1B2] fill-[#2ED1B2]/20" /> 
                Get Into Feed — Elite Growth
              </div>
            </motion.div>
            
            {/* Typography: Used blurFadeUp for an ultra-premium load effect */}
            <motion.h1
              variants={blurFadeUp}
              className="text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.2rem] font-bold leading-[1.05] tracking-tight text-[#0F172A]"
            >
              <span className="block whitespace-nowrap">Dominate the Feed.</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4]">
                Own the Market.
              </span>
            </motion.h1>
            
            {/* Swapped itemFadeUp with fadeUp */}
            <motion.p variants={fadeUp} className="text-[#475569] text-lg md:text-xl max-w-lg leading-relaxed font-medium">
              We engineer scalable marketing systems that drive high-intent lead generation and exponential sales growth. Stop competing—start dominating.
            </motion.p>

            {/* Swapped itemFadeUp with fadeUp */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
              {/* Primary CTA */}
              <motion.button 
                whileHover={{ y: -4, scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: premiumEase }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#2ED1B2] to-[#0EA5A4] text-white font-bold uppercase tracking-widest shadow-[0_15px_40px_-10px_rgba(46,209,178,0.4)] flex items-center gap-2 group text-sm relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Free Strategy Call
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Subtle sheen effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </motion.button>
              
              {/* Secondary CTA */}
              <motion.button 
                whileHover={{ y: -4, scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: premiumEase }}
                onClick={() => setIsVideoOpen(true)} 
                className="px-8 py-4 rounded-full bg-white border border-[#E5E7EB] text-[#0F172A] font-bold uppercase tracking-widest hover:border-[#2ED1B2]/30 hover:bg-[#F8F9FB] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-3 group text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-[#F8F9FB] flex items-center justify-center group-hover:bg-[#2ED1B2]/10 transition-colors">
                  <Play className="w-3.5 h-3.5 text-[#0F172A] ml-0.5" /> 
                </div>
                See How We Grow Brands
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column: Premium Interactive Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: premiumEase }}
            className="relative h-[550px] w-full hidden lg:block perspective-[1200px]"
          >
            {/* Ambient Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-[#E5E7EB] rounded-full animate-spin-slow opacity-60" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border border-[#2ED1B2]/20 rounded-full border-dashed animate-[spin_15s_linear_reverse] opacity-80" />

            {/* Top Right Card: Performance Metric */}
            <TiltCard className="absolute top-8 right-6 w-80 bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/80 rounded-3xl p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.06)] z-20 cursor-default">
              <div className="flex justify-between items-center mb-5 border-b border-[#F8F9FB] pb-4 pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2ED1B2]/20 to-[#0EA5A4]/10 flex items-center justify-center border border-[#2ED1B2]/20">
                    <BarChart3 className="w-5 h-5 text-[#0EA5A4]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-sm tracking-tight">Sales Growth</h4>
                    <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest mt-0.5">Q3 Performance</p>
                  </div>
                </div>
              </div>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#0F172A] tracking-tight">+342%</span>
                <span className="text-[10px] font-bold text-[#0EA5A4] bg-[#2ED1B2]/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-[#2ED1B2]/20">Target Exceeded</span>
              </div>
              {/* Gradient Bar Chart */}
              <div className="h-14 w-full flex items-end gap-1.5">
                {[30, 45, 35, 60, 50, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#F8F9FB] rounded-t-sm relative group overflow-hidden">
                    <div 
                      className={`absolute bottom-0 inset-x-0 rounded-t-sm transition-all duration-1000 group-hover:opacity-80 ${i === 6 ? 'bg-gradient-to-t from-[#0EA5A4] to-[#2ED1B2]' : 'bg-[#E2E8F0]'}`}
                      style={{ height: `${h}%` }} 
                    />
                  </div>
                ))}
              </div>
            </TiltCard>

            {/* Bottom Left Card: System Activity */}
            <TiltCard className="absolute bottom-12 left-4 w-64 bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/80 rounded-3xl p-5 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.06)] z-30 cursor-default">
               <h4 className="font-bold text-[#0F172A] text-xs mb-4 uppercase tracking-widest border-b border-[#F8F9FB] pb-3 pointer-events-auto flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#2ED1B2] animate-pulse" />
                 Live System Data
               </h4>
               <div className="space-y-4">
                 <div className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-[#F8F9FB] flex items-center justify-center group-hover:bg-[#2ED1B2]/10 transition-colors"><Target className="w-4 h-4 text-[#475569] group-hover:text-[#0EA5A4]" /></div>
                     <span className="text-xs font-medium text-[#475569]">Qualified Leads</span>
                   </div>
                   <span className="text-sm font-bold text-[#0F172A]">1,842</span>
                 </div>
                 <div className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-[#F8F9FB] flex items-center justify-center group-hover:bg-[#2ED1B2]/10 transition-colors"><Search className="w-4 h-4 text-[#475569] group-hover:text-[#0EA5A4]" /></div>
                     <span className="text-xs font-medium text-[#475569]">Conversion Rate</span>
                   </div>
                   <span className="text-sm font-bold text-[#0F172A]">+8.4%</span>
                 </div>
               </div>
            </TiltCard>

            {/* Central Core Element: z-40 so it stays above the other cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-44 h-44 bg-white border border-[#E5E7EB] rounded-full shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] p-2"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#F8F9FB] to-white border border-[#E5E7EB] flex flex-col items-center justify-center relative">
                <Zap className="w-8 h-8 text-[#0EA5A4] mb-2 fill-[#0EA5A4]/10" />
                <span className="font-bold text-[#0F172A] text-[10px] uppercase tracking-widest text-center px-4">Marketing<br/>System</span>
                
                {/* Floating Micro-Badges */}
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 -right-6 bg-white text-[#0F172A] px-3 py-1.5 rounded-full shadow-lg text-[9px] font-bold uppercase tracking-widest border border-[#E5E7EB] flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3 text-[#2ED1B2]" /> CPL -40%
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], y: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-3 -right-4 bg-[#0F172A] text-white px-3 py-1.5 rounded-full shadow-lg text-[9px] font-bold uppercase tracking-widest border border-[#0F172A] flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-[#2ED1B2] fill-[#2ED1B2]" /> LTV +65%
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal Component */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </>
  );
}