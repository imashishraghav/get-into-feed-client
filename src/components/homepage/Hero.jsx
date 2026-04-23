// @ts-nocheck
"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, ArrowRight, Play, Search, Target, Zap, BarChart3, ShieldCheck } from 'lucide-react';

// 🟢 Using clean path aliases configured in jsconfig.json
import { staggerContainer, fadeUp, blurFadeUp, premiumEase } from '@/utils/animations';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
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
      className={`gpu-accelerated ${className}`}
    >
      <div style={{ transform: "translateZ(50px)" }} className="w-full h-full pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
};

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // 1. Initialize Smooth Scroll Hook
  const { scrollY } = useSmoothScroll();

  // 2. Create Parallax Transforms
  const bgParallax = useTransform(scrollY, [0, 800], [0, 150]);
  const textParallaxY = useTransform(scrollY, [0, 600], [0, -100]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const visualsParallaxY = useTransform(scrollY, [0, 600], [0, -250]);

  return (
    <>
      <section className="relative w-full pt-32 pb-10 md:pt-40 md:pb-12 overflow-hidden bg-background">
        
        {/* Premium Background Gradients & Depth */}
        <motion.div style={{ y: bgParallax }} className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0 gpu-accelerated" />
        <motion.div style={{ y: bgParallax }} className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[100px] pointer-events-none z-0 gpu-accelerated" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* ================= Left Column: Copywriting & CTAs ================= */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            style={{ y: textParallaxY, opacity: textOpacity }}
            className="flex flex-col gap-6 md:gap-8 relative z-20 gpu-accelerated"
          >
            {/* Small Badge */}
            <motion.div variants={fadeUp}>
              <div className="font-sans inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-navy text-xs font-semibold w-max shadow-sm uppercase tracking-widest">
                <Zap className="w-4 h-4 text-primary fill-primary/20" /> 
                Get Into Feed — Growth System
              </div>
            </motion.div>
            
            {/* Headline */}
            <motion.h1
              variants={blurFadeUp}
              className="font-heading text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.2rem] font-extrabold leading-[1.05] tracking-tight text-navy text-balance"
            >
              <span className="block whitespace-nowrap">Dominate the Feed.</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Own the Market.
              </span>
            </motion.h1>
            
            {/* Subheadline (High Conversion Focus) */}
            <motion.p variants={fadeUp} className="font-sans text-slate-600 text-lg md:text-xl max-w-lg leading-relaxed font-medium text-balance">
              We build high-performing marketing systems that generate leads, scale revenue, and turn attention into customers.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <motion.button 
                whileHover={{ y: -4, scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: premiumEase }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-navy font-heading font-bold uppercase tracking-widest shadow-[0_15px_40px_-10px_rgba(46,209,178,0.4)] flex items-center gap-2 group text-sm relative overflow-hidden w-full sm:w-auto justify-center"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Your Free Growth Call
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </motion.button>
              
              <motion.button 
                whileHover={{ y: -4, scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: premiumEase }}
                onClick={() => setIsVideoOpen(true)} 
                className="px-8 py-4 rounded-full bg-white border border-border text-navy font-heading font-bold uppercase tracking-widest hover:border-primary/30 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-3 group text-sm w-full sm:w-auto justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Play className="w-3.5 h-3.5 text-navy ml-0.5" /> 
                </div>
                Watch How It Works
              </motion.button>
            </motion.div>

            {/* Micro Trust Line */}
            <motion.div variants={fadeUp} className="font-sans flex items-center gap-2 mt-2 text-sm font-semibold text-slate-500">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <p>Helping brands generate consistent leads & revenue</p>
            </motion.div>

          </motion.div>

          {/* ================= Right Column: Premium Interactive Visuals ================= */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: premiumEase }}
            style={{ y: visualsParallaxY }}
            // Hidden on mobile to keep CTA above the fold & simplify experience
            className="relative h-[550px] w-full hidden lg:block perspective-[1200px] gpu-accelerated"
          >
            {/* Ambient Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-border rounded-full animate-spin-slow opacity-60" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border border-primary/20 rounded-full border-dashed animate-[spin_15s_linear_reverse] opacity-80" />

            {/* Top Right Card: Performance Metric */}
            <TiltCard className="absolute top-8 right-6 w-80 bg-white/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-soft z-20 cursor-default">
              <div className="flex justify-between items-center mb-5 border-b border-background pb-4 pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center border border-primary/20">
                    <BarChart3 className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-navy text-sm tracking-tight">Sales Growth</h4>
                    <p className="font-sans text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Q3 Performance</p>
                  </div>
                </div>
              </div>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-navy tracking-tight">+342%</span>
                <span className="font-sans text-[10px] font-bold text-secondary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-primary/20">Target Exceeded</span>
              </div>
              {/* Gradient Bar Chart */}
              <div className="h-14 w-full flex items-end gap-1.5">
                {[30, 45, 35, 60, 50, 80, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-background rounded-t-sm relative group overflow-hidden">
                    <div 
                      className={`absolute bottom-0 inset-x-0 rounded-t-sm transition-all duration-1000 group-hover:opacity-80 ${i === 6 ? 'bg-gradient-to-t from-secondary to-primary' : 'bg-slate-200'}`}
                      style={{ height: `${h}%` }} 
                    />
                  </div>
                ))}
              </div>
            </TiltCard>

            {/* Bottom Left Card: System Activity */}
            <TiltCard className="absolute bottom-12 left-4 w-64 bg-white/80 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-soft z-30 cursor-default">
               <h4 className="font-heading font-bold text-navy text-xs mb-4 uppercase tracking-widest border-b border-background pb-3 pointer-events-auto flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 Live System Data
               </h4>
               <div className="space-y-4">
                 <div className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors"><Target className="w-4 h-4 text-slate-500 group-hover:text-secondary" /></div>
                     <span className="font-sans text-xs font-medium text-slate-600">Qualified Leads</span>
                   </div>
                   <span className="font-heading text-sm font-bold text-navy">1,842</span>
                 </div>
                 <div className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors"><Search className="w-4 h-4 text-slate-500 group-hover:text-secondary" /></div>
                     <span className="font-sans text-xs font-medium text-slate-600">Conversion Rate</span>
                   </div>
                   <span className="font-heading text-sm font-bold text-navy">+8.4%</span>
                 </div>
               </div>
            </TiltCard>

            {/* Central Core Element */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-44 h-44 bg-white border border-border rounded-full shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] p-2"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-background to-white border border-border flex flex-col items-center justify-center relative">
                <Zap className="w-8 h-8 text-secondary mb-2 fill-secondary/10" />
                <span className="font-heading font-bold text-navy text-[10px] uppercase tracking-widest text-center px-4">Marketing<br/>System</span>
                
                {/* Floating Micro-Badges */}
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 -right-6 bg-white text-navy px-3 py-1.5 rounded-full shadow-lg font-sans text-[9px] font-bold uppercase tracking-widest border border-border flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3 text-primary" /> CPL -40%
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], y: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-3 -right-4 bg-navy text-white px-3 py-1.5 rounded-full shadow-lg font-sans text-[9px] font-bold uppercase tracking-widest border border-navy flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-primary fill-primary" /> LTV +65%
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