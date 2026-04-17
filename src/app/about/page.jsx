"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from 'framer-motion';
import { 
  ArrowRight, Globe, Target, Shield, Activity, 
  Users, Zap, LineChart, Layers, ArrowUpRight,
  Eye, Rocket, Crosshair, Fingerprint, 
  Workflow, Scaling, CheckCircle2
} from 'lucide-react';

// --- Premium Cinematic Easing (Shandar Easing) ---
const premiumEase = [0.16, 1, 0.3, 1];

// --- Framer Motion Variants (Motion Ke Prakar) ---
const staggerWrap = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: premiumEase }
  }
};

const itemFadeLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: premiumEase }
  }
};

const itemFadeRight = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: premiumEase }
  }
};

const itemScaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: premiumEase }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { 
      duration: 1, 
      ease: premiumEase 
    } 
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.98 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: premiumEase 
    },
  },
};

// --- Differentiators Data (Alag Banane Wale Tatva) ---
const differentiators = [
  {
    id: "01",
    title: "Precision-Engineered Acquisition",
    description:
      "We build data-backed acquisition models targeting high-LTV audiences. Moving past vanity metrics to deliver quantifiable revenue growth and advanced attribution.",
  },
  {
    id: "02",
    title: "Scalable Digital Ecosystems",
    description:
      "Leveraging enterprise-grade frameworks, we architect front-end experiences that convert. Systems built for long-term scalability, replacing fragile one-off campaigns.",
  },
  {
    id: "03",
    title: "Premium Brand Positioning",
    description:
      "Applying an international, minimalist design ethos to elevate your market authority. We craft digital aesthetics that establish immediate trust in high-value sectors.",
  },
  {
    id: "04",
    title: "Conversion-Obsessed Strategy",
    description:
      "From granular funnel analytics to frictionless user journeys, every structural decision and micro-interaction is aggressively optimized for maximum ROI.",
  },
];

// --- Team Members Data (Hamari Team Ka Data) ---
const teamMembers = [
  {
    name: 'Ashish Raghav',
    role: 'Founder & Digital Marketing Manager',
    description: 'Architecting high-leverage growth systems and strategic direction.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
  },
  {
    name: 'Saurabh Negi',
    role: 'Lead Creative Strategist',
    description: 'Translating brand DNA into high-converting visual narratives.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',
  },
  {
    name: 'Sumit Mishra',
    role: 'Performance Marketing Head',
    description: 'Engineering data-driven acquisition engines at scale.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
  }
];

// --- Stats Data (Parinam Ka Data) ---
const statsData = [
  { id: 1, prefix: "+", value: "300", suffix: "%", label: "ROAS Increase", desc: "Average return on ad spend across active campaigns." },
  { id: 2, prefix: "", value: "50", suffix: "K+", label: "Leads Generated", desc: "High-intent prospects captured and converted." },
  { id: 3, prefix: "", value: "120", suffix: "+", label: "Brands Scaled", desc: "Global partners who trust our data-driven expertise." },
  { id: 4, prefix: "", value: "7", suffix: "-Fig", label: "Revenue Driven", desc: "Trackable client growth generated this year alone." },
];

// --- Premium Arrow Icon (Premium Teer Icon) ---
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// --- Text Reveal Mask (Text Dikhane Ka Tarika) ---
const RevealText = ({ children, delay = 0 }) => (
  <div className="overflow-hidden inline-block w-full">
    <motion.div
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: premiumEase, delay }}
    >
      {children}
    </motion.div>
  </div>
);

// --- ANIMATED COUNTER COMPONENT (Number Animation Component) ---
function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, Number(value), {
        duration: 2,
        ease: premiumEase,
      });
      return controls.stop;
    }
  }, [count, inView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

// --- MAIN PAGE COMPONENT (Mukhya Page Component) ---
export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const yParallax = useTransform(smoothScroll, [0, 1], [0, -150]);
  const imgParallax = useTransform(smoothScroll, [0, 1], ["0%", "20%"]);

  return (
    <>
      {/* --- PREMIUM TYPOGRAPHY INJECTION (Font Ki Setting) --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Plus+Jakarta+Sans:wght@700;800;900&family=Space+Mono:wght@400;700&display=swap');
        .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

      {/* Base: Sophisticated Off-White (Editorial Feel) with Inter as default body font */}
      <main ref={containerRef} className="bg-[#F4F4F0] min-h-screen font-body text-[#0A0A0A] selection:bg-[#C9A227] selection:text-white relative">
        
        {/* Subtle Grain Overlay for Premium Texture (Premium Texture Ke Liye Grain Overlay) */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

        {/* =========================================
            SECTION 1: HERO (MASSIVE TYPOGRAPHY)
            Refinement: Brutalist, unapologetic, screen-filling typography.
        ========================================= */}
        <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-12 w-full min-h-[90vh] flex flex-col justify-end relative">
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-[2px] bg-[#0A0A0A]"></div>
              <span className="font-heading text-sm font-bold tracking-[0.2em] uppercase">The Agency</span>
            </div>
            
            <h1 className="font-heading text-[clamp(3.5rem,9vw,12rem)] font-black tracking-tighter leading-[0.85] uppercase mb-12">
              <RevealText delay={0.1}>We Dictate</RevealText>
              <br />
              <RevealText delay={0.2}>
                <span className="text-[#C9A227]">The Market.</span>
              </RevealText>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
  <div className="md:col-span-5 md:col-start-8">
    <motion.p 
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 1 }} 
      transition={{ delay: 0.5, duration: 1 }}
      className="font-body text-xl md:text-2xl font-light text-[#4A4A4A] leading-tight"
    >
      A global digital marketing collective built on <br />
      raw data, relentless execution, and an <br />
      obsession with scalable revenue growth.
    </motion.p>
  </div>
</div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] rotate-90 origin-bottom mb-8">Scroll</span>
            <div className="w-[1px] h-12 bg-[#0A0A0A]/20 overflow-hidden">
              <motion.div 
                animate={{ y: ["-100%", "100%"] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-full h-full bg-[#0A0A0A]"
              />
            </div>
          </motion.div>
        </section>

        {/* =========================================
            SECTION 2: WHO WE ARE (ASYMMETRICAL GRID)
            Refinement: Sharp borders, architectural layout, sticky heading
        ========================================= */}
        <section className="border-t border-[#0A0A0A]/20">
          <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Col: Sticky Header */}
            <div className="lg:col-span-4 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#0A0A0A]/20 relative">
              <div className="lg:sticky lg:top-32">
                <RevealText>
                  <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tighter uppercase">Who We Are</h2>
                </RevealText>
              </div>
            </div>

            {/* Right Col: Content & Image */}
          <div className="lg:col-span-8 p-8 lg:p-12 flex flex-col gap-12">
            <RevealText delay={0.2}>
              <p className="font-body text-2xl md:text-4xl font-medium leading-[1.2] tracking-tight">
                We are a collective of data scientists, creative strategists, and performance marketers. We strip away the fluff of traditional agencies to focus entirely on unit economics and bottom-line impact.
              </p>
            </RevealText>
            
            <motion.div 
              initial={{ filter: "grayscale(100%)", clipPath: "inset(100% 0 0 0)" }}
              whileInView={{ filter: "grayscale(0%)", clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.2, ease: premiumEase }}
              viewport={{ once: true }}
              className="w-full aspect-video bg-[#E5E5E0] relative overflow-hidden"
            >
              {/* Premium Image Placeholder with Parallax */}
              <motion.div 
                style={{ y: imgParallax, scale: 1.1 }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-multiply"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* =========================================
            SECTION 3: OUR STORY (DARK THEME INVERSION)
            Refinement: Awwwards sites use extreme contrast to reset the user's focus.
        ========================================= */}
        <section className="bg-[#0A0A0A] text-[#F4F4F0] py-32 md:py-48 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
          
          {/* Kinetic Background Typography (Awwwards Signature) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden whitespace-nowrap pointer-events-none flex opacity-[0.02] z-0 select-none">
            <motion.div 
              animate={{ x: [0, -1000] }} 
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="font-heading text-[15rem] md:text-[25rem] font-black leading-none uppercase tracking-tighter flex gap-8"
            >
              <span>The Origin</span>
              <span>•</span>
              <span>Est. 2018</span>
              <span>•</span>
              <span>The Origin</span>
              <span>•</span>
              <span>Est. 2018</span>
              <span>•</span>
            </motion.div>
          </div>

          <div className="max-w-[1400px] mx-auto w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0">
              
              {/* Left: Origin Header */}
              <div className="lg:col-span-4 lg:pr-12">
                <RevealText>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-[1px] bg-[#C9A227]"></div>
                    <span className="font-mono text-[#C9A227] tracking-[0.2em] uppercase text-sm">Origin</span>
                  </div>
                  <h2 className="font-heading text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
                    Our <br /> Story.
                  </h2>
                </RevealText>
              </div>
              
              {/* Right: Editorial Manifesto & Stats */}
              <div className="lg:col-span-8 lg:pl-16 lg:border-l border-[#F4F4F0]/10 flex flex-col gap-16">
                
                {/* Massive Editorial Statement */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: premiumEase }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-heading text-3xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-[#808080]">
                    Born from the frustration of vanity metrics, we started in 2018 with a simple, uncompromising premise: <br className="hidden md:block" />
                    <span className="text-[#F4F4F0] italic font-medium">marketing should be an investment, not an expense.</span>
                  </h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: premiumEase }}
                    viewport={{ once: true }}
                    className="font-body text-lg md:text-xl font-light leading-relaxed text-[#A0A0A0]"
                  >
                    We built proprietary tracking models that top-tier brands now rely on to scale globally. No guesswork. Just raw mathematics applied to human behavior and market dynamics.
                  </motion.p>
                  
                  {/* International Footprint Stats Grid */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: premiumEase }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 gap-6 border-t border-[#F4F4F0]/10 pt-6"
                  >
                    <div>
                      <p className="font-heading text-4xl font-black text-[#F4F4F0] mb-1">12+</p>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#C9A227]">Global Markets</p>
                    </div>
                    <div>
                      <p className="font-heading text-4xl font-black text-[#F4F4F0] mb-1">$2B+</p>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#C9A227]">Managed Ad Spend</p>
                    </div>
                    <div>
                      <p className="font-heading text-4xl font-black text-[#F4F4F0] mb-1">04</p>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#C9A227]">Intl. Offices</p>
                    </div>
                    <div>
                      <p className="font-heading text-4xl font-black text-[#F4F4F0] mb-1">24/7</p>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#C9A227]">Optimization</p>
                    </div>
                  </motion.div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 4: MISSION & VISION (ARCHITECTURAL SPLIT)
            Refinement: Interactive hover inversions, outlined typography, and cinematic transitions.
        ========================================= */}
        <section className="border-b border-[#0A0A0A]/20 relative">
          
          {/* Center Decorative Rotating Element (Awwwards Signature) */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full z-20 items-center justify-center mix-blend-difference pointer-events-none text-[#F4F4F0]">
            <motion.svg 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }} 
              width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5l-10 14M22 12H2M19 19L5 5" />
            </motion.svg>
          </div>

          <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 relative">
            
            {/* The Mission Panel */}
            <div className="p-12 md:p-20 lg:p-24 border-b md:border-b-0 md:border-r border-[#0A0A0A]/20 group cursor-crosshair hover:bg-[#0A0A0A] transition-colors duration-700 ease-out relative overflow-hidden flex flex-col justify-between min-h-[550px]">
              
              {/* Massive Background Number */}
              <div className="absolute -bottom-12 -right-12 font-heading text-[18rem] font-black text-[#0A0A0A]/[0.03] group-hover:text-[#F4F4F0]/5 transition-colors duration-700 pointer-events-none leading-none">
                01
              </div>

              <div className="relative z-10">
                <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-12 block">The Mission</span>
                <RevealText>
                  <h3 className="font-heading text-4xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-[#0A0A0A] group-hover:text-[#F4F4F0] transition-colors duration-700">
                    Engineer predictable, <br className="hidden lg:block"/>
                    <span className="text-transparent" style={{ WebkitTextStroke: '1.5px currentColor' }}>explosive growth</span> <br className="hidden lg:block"/>
                    through uncompromising data analysis.
                  </h3>
                </RevealText>
              </div>

              {/* Animated Hover Button */}
              <div className="relative z-10 mt-16 overflow-hidden w-16 h-16 rounded-full border border-[#0A0A0A]/20 group-hover:border-[#F4F4F0]/30 flex items-center justify-center text-[#0A0A0A] group-hover:text-[#F4F4F0] transition-colors duration-700">
                 <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] delay-75">
                   <ArrowRight />
                 </div>
                 <div className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500 ease-[0.16,1,0.3,1]">
                   <ArrowRight />
                 </div>
              </div>
            </div>

            {/* The Vision Panel */}
            <div className="p-12 md:p-20 lg:p-24 group cursor-crosshair hover:bg-[#0A0A0A] transition-colors duration-700 ease-out relative overflow-hidden flex flex-col justify-between min-h-[550px]">
              
              {/* Massive Background Number */}
              <div className="absolute -bottom-12 -right-12 font-heading text-[18rem] font-black text-[#0A0A0A]/[0.03] group-hover:text-[#F4F4F0]/5 transition-colors duration-700 pointer-events-none leading-none">
                02
              </div>

              <div className="relative z-10">
                <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-12 block">The Vision</span>
                <RevealText>
                  <h3 className="font-heading text-4xl lg:text-6xl font-black tracking-tighter leading-[1.05] text-[#707070] group-hover:text-[#F4F4F0] transition-colors duration-700">
                    Become the definitive <br className="hidden lg:block"/>
                    <span className="text-transparent" style={{ WebkitTextStroke: '1.5px currentColor' }}>standard for digital</span> <br className="hidden lg:block"/>
                    performance, reshaping global acquisition.
                  </h3>
                </RevealText>
              </div>

              {/* Animated Hover Button */}
              <div className="relative z-10 mt-16 overflow-hidden w-16 h-16 rounded-full border border-[#0A0A0A]/20 group-hover:border-[#F4F4F0]/30 flex items-center justify-center text-[#0A0A0A] group-hover:text-[#F4F4F0] transition-colors duration-700">
                 <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] delay-75">
                   <ArrowRight />
                 </div>
                 <div className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500 ease-[0.16,1,0.3,1]">
                   <ArrowRight />
                 </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            SECTION 5: CORE VALUES (INTERACTIVE LIST)
            Refinement: Strict blueprint grid, dynamic descriptions, cinematic hover.
        ========================================= */}
        <section className="py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <RevealText>
              <h2 className="font-heading text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter uppercase leading-[0.85]">
                Core <br className="hidden md:block" /> Values
              </h2>
            </RevealText>
            <motion.p 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
              className="font-body text-[#707070] max-w-sm text-lg"
            >
              The non-negotiable principles that drive our decision making, hiring, and campaign execution.
            </motion.p>
          </div>
          
          <div className="flex flex-col border-t border-[#0A0A0A]/40">
            {[
              { title: 'Truth in Data', desc: "We don't guess. We test, measure, and scale based purely on mathematical reality. No exceptions." },
              { title: 'Relentless Execution', desc: "Strategy without rapid deployment is just philosophy. We move at market speed to capture maximum alpha." },
              { title: 'Absolute Transparency', desc: "No black boxes. No vanity metrics. You see every dollar spent and its exact compounding return." },
              { title: 'Continuous Evolution', desc: "Algorithms change. Consumer behavior shifts. We adapt and rewrite the rules before the market reacts." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase, delay: idx * 0.1 } }
                }}
                className="group flex flex-col py-8 md:py-12 border-b border-[#0A0A0A]/20 cursor-pointer hover:px-6 md:hover:px-12 transition-all duration-700 ease-[0.16,1,0.3,1] relative overflow-hidden"
              >
                {/* FIXED: Changed -z-10 to z-0 so the black background doesn't hide behind the page */}
                <div className="absolute inset-0 bg-[#0A0A0A] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[0.16,1,0.3,1] z-0"></div>

                {/* FIXED: 'relative z-10' keeps text safely above the z-0 black background */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center w-full">
                  
                  {/* Number (Col 1-2) */}
                  <div className="md:col-span-2">
                    <span className="font-mono text-xl md:text-2xl text-[#C9A227] group-hover:text-[#C9A227] transition-colors duration-500">
                      (0{idx + 1})
                    </span>
                  </div>

                  {/* Title (Col 3-7) */}
                  <div className="md:col-span-6">
                    <h4 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#0A0A0A] group-hover:text-[#F4F4F0] transition-colors duration-500 group-hover:-skew-x-3 group-hover:scale-[1.02] transform origin-left">
                      {item.title}
                    </h4>
                  </div>

                  {/* Description (Col 8-11) */}
                  <div className="md:col-span-3">
                    <p className="font-body text-[#707070] group-hover:text-[#A0A0A0] transition-colors duration-500 text-sm md:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Icon (Col 12) */}
                  <div className="md:col-span-1 hidden md:flex justify-end overflow-hidden">
                     <div className="relative w-8 h-8 flex items-center justify-center text-[#F4F4F0]">
                       <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1] delay-100">
                         <ArrowRight />
                       </div>
                       <div className="absolute text-[#0A0A0A] transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-700 ease-[0.16,1,0.3,1]">
                         <ArrowRight />
                       </div>
                     </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 6: HOW WE WORK (BLUEPRINT GRID)
            Refinement: Awwwards-style Sticky Scroll Timeline with Vertical Wipes
        ========================================= */}
        <section className="bg-[#E5E5E0] py-24 md:py-32 px-4 sm:px-6 lg:px-12 border-t border-[#0A0A0A]/20 relative">
          <div className="max-w-[1400px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
              
              {/* LEFT: Sticky Header (Fixes the overflowing/cut-off text issue) */}
              <div className="lg:col-span-5 relative">
                <div className="lg:sticky lg:top-40 h-fit pr-0 lg:pr-8">
                  <RevealText>
                    <h2 className="font-heading text-[clamp(3.5rem,8vw,7rem)] font-black tracking-tighter uppercase leading-[0.85] mb-8 break-words">
                      Method<span className="hidden lg:inline">-</span><br className="hidden lg:block"/>ology.
                    </h2>
                  </RevealText>
                  
                  <motion.div 
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-6"
                  >
                    <div className="w-12 h-[2px] bg-[#0A0A0A]"></div>
                    <p className="font-body max-w-sm text-lg font-medium text-[#4A4A4A] leading-relaxed">
                      Our process is a proven algorithm. We onboard seamlessly, audit ruthlessly, and execute flawlessly. No guesswork, just pure execution.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* RIGHT: Vertical Scrolling Steps (Premium Interactive Cards) */}
              <div className="lg:col-span-7 flex flex-col border-t lg:border-t-0 border-[#0A0A0A]/20 lg:border-l lg:pl-12">
                {[
                  { title: 'Audit & Strategy', desc: 'Deep dive into historical data, uncovering hidden bottlenecks and immediate scale opportunities. We map the entire ecosystem before spending a single cent.' },
                  { title: 'Rapid Deployment', desc: 'Execution of tailored campaigns across high-leverage channels with elite creative assets. Velocity is our primary competitive advantage.' },
                  { title: 'Scale & Optimize', desc: 'Daily micro-adjustments using our proprietary algorithmic models to lower CPA and push ROAS to the absolute limit. We never stop testing.' }
                ].map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: premiumEase, delay: idx * 0.1 }}
                    className="group relative overflow-hidden border-b border-[#0A0A0A]/20 cursor-crosshair"
                  >
                    {/* Cinematic vertical wipe from bottom */}
                    <div className="absolute inset-0 bg-[#0A0A0A] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-[0.16,1,0.3,1] z-0"></div>

                    <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col justify-between min-h-[350px] md:min-h-[450px]">
                      
                      {/* Top Row: Number & Phase */}
                      <div className="flex justify-between items-start mb-12">
                        <span className="font-mono text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#0A0A0A] group-hover:text-[#C9A227] transition-colors duration-500">
                          Phase 0{idx + 1}
                        </span>
                        <div className="font-heading text-6xl md:text-[7rem] font-black text-[#0A0A0A]/10 group-hover:text-[#F4F4F0]/10 group-hover:scale-110 transition-all duration-700 ease-[0.16,1,0.3,1] leading-none origin-right">
                          0{idx + 1}
                        </div>
                      </div>

                      {/* Bottom Row: Content */}
                      <div className="transform group-hover:-translate-y-4 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                        <h4 className="font-heading text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tighter text-[#0A0A0A] group-hover:text-[#F4F4F0] transition-colors duration-500">
                          {step.title}
                        </h4>
                        <p className="font-body text-[#4A4A4A] group-hover:text-[#A0A0A0] transition-colors duration-500 text-sm md:text-lg leading-relaxed max-w-md">
                          {step.desc}
                        </p>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </section>

      {/* --- 7. RESULTS / PROOF (Stats Box) --- */}
      <section className="relative w-full py-24 md:py-32 bg-[#F9FAFB] flex justify-center items-center overflow-hidden border-t border-[#E5E7EB]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] opacity-[0.15] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A227] via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-[#C9A227]"></div>
                <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-[#C9A227]">Performance Metrics</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-[#0F172A] tracking-tighter leading-[1.1]">
                Built on Data.<br />
                <span className="text-[#374151]">Proven by Growth.</span>
              </h2>
            </div>
            <p className="text-[#6B7280] font-body md:max-w-sm text-sm md:text-base leading-relaxed">
              We don't rely on vanity metrics. We focus on scalable growth, predictable revenue, and absolute market dominance.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {statsData.map((stat) => (
              <motion.div
                key={stat.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden bg-white rounded-3xl p-8 md:p-10 border border-[#E5E7EB] shadow-[0_8px_30px_rgb(15,23,42,0.05)] hover:shadow-[0_20px_40px_rgb(15,23,42,0.08)] hover:border-[#D1D5DB] transition-all duration-300 flex flex-col justify-center group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-baseline tracking-tighter mb-4 font-display">
                  {stat.prefix && (
                    <span className="text-4xl md:text-5xl font-black text-[#0F172A] mr-1">
                      {stat.prefix}
                    </span>
                  )}
                  <h3 className="text-6xl md:text-7xl font-black text-[#0F172A]">
                    <AnimatedCounter value={stat.value} />
                  </h3>
                  {stat.suffix && (
                    <span className="text-4xl md:text-5xl font-black text-[#0F172A] ml-1">
                      {stat.suffix}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold font-display tracking-[0.2em] uppercase text-[#374151] mb-2">
                  {stat.label}
                </h4>

                <p className="text-sm font-body text-[#6B7280] leading-relaxed">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 8. CULTURE / TEAM (Mindset) --- */}
      <section className="relative w-full bg-[#F9FAFB] py-24 md:py-32 overflow-hidden selection:bg-[#C9A227]/20 selection:text-[#0F172A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="mb-20 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: premiumEase }}
            >
              <span className="inline-block font-display text-[#C9A227] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                The Mindset
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight mb-6">
                Core Operators
              </h2>
              <p className="font-body text-[#6B7280] text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                We operate as an extension of your business. No layers. Just direct execution and measurable growth.
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.4, ease: premiumEase }
                }}
                className="group bg-white border border-[#E5E7EB] rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(15,23,42,0.03)] hover:shadow-[0_20px_40px_rgb(15,23,42,0.08)] transition-shadow duration-500 relative flex flex-col h-full cursor-default"
              >
                <div className="absolute top-8 right-8 text-[#E5E7EB] group-hover:text-[#C9A227] transition-colors duration-300">
                  <ArrowUpRight strokeWidth={1.5} size={24} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>

                <div className="mb-8 relative inline-block">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-1 ring-[#0F172A]/5 ring-offset-4 ring-offset-white">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="font-display text-xl font-bold text-[#0F172A] tracking-tight mb-1">
                    {member.name}
                  </h3>
                  <p className="font-body text-[11px] font-semibold tracking-widest text-[#6B7280] uppercase mb-5">
                    {member.role}
                  </p>
                  
                  <div className="w-6 h-[1px] bg-[#E5E7EB] my-5 group-hover:bg-[#C9A227]/40 transition-colors duration-300"></div>

                  <p className="font-body text-sm text-[#6B7280] leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 9. WHY CHOOSE US (Differentiators) --- */}
      <section className="relative w-full py-24 md:py-32 overflow-hidden bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="mb-16 md:mb-24 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: premiumEase }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-[2px] w-8 bg-[#C9A227]" />
              <span className="text-sm font-display font-semibold tracking-wider text-[#C9A227] uppercase">
                The Differentiator
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 text-[#0F172A]"
            >
              Why Choose Us
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: premiumEase, delay: 0.2 }}
              className="text-lg md:text-xl font-body text-[#374151] leading-relaxed"
            >
              We bridge the gap between high-end aesthetic design and aggressive performance marketing to engineer undeniable market advantages.
            </motion.p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {differentiators.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.6, ease: premiumEase } 
                }}
                className="group relative flex flex-col p-10 md:p-12 rounded-3xl border border-[#E5E7EB] bg-white/80 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_32px_64px_rgba(201,162,39,0.08)] hover:border-[#C9A227]/30 transition-all duration-700 cursor-default overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[0.16,1,0.3,1]" />

                <span className="text-sm font-display font-bold text-[#C9A227]/60 group-hover:text-[#C9A227] transition-colors duration-500 mb-8 tracking-[0.2em] block uppercase">
                  {item.id} <span className="opacity-50">—</span>
                </span>
                
                <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-5 text-[#0F172A] group-hover:text-[#C9A227] transition-colors duration-500">
                  {item.title}
                </h3>
                
                <p className="text-[1.05rem] font-body text-[#6B7280] leading-relaxed group-hover:text-[#374151] transition-colors duration-500">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* --- 10. CTA SECTION (Action Section) --- */}
      <section className="py-10 md:py-12 px-6 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={staggerWrap}
            className="bg-[#0F172A] border border-[#1F2937] rounded-[2rem] px-8 py-10 md:px-16 md:py-12 relative overflow-hidden shadow-2xl shadow-[#0F172A]/10 flex flex-col md:flex-row items-center justify-between gap-10 group"
          >
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 blur-[100px] rounded-full -z-10 group-hover:bg-[#C9A227]/10 transition-colors duration-700" />
            
            {/* Left Content */}
            <div className="md:w-2/3 text-left">
              <motion.h2 variants={itemFadeUp} className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4 tracking-tight leading-[1.1]">
                Ready to redefine <br className="hidden md:block"/> your market share?
              </motion.h2>
              
              <motion.p variants={itemFadeUp} className="text-[#D1D5DB] font-body text-base md:text-lg max-w-xl mb-0">
                Stop accepting average returns. Partner with us to audit your current funnel and uncover the hidden revenue in your digital architecture.
              </motion.p>
            </div>

            {/* Right Content */}
            <div className="md:w-1/3 flex flex-col items-start md:items-end w-full">
              <motion.button 
                variants={itemFadeUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, ease: premiumEase }}
                className="px-8 py-4 rounded-full bg-white text-[#0F172A] font-display font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-white/10 hover:bg-[#F3F4F6] flex items-center gap-3 group/btn"
              >
                Start a Project <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.p variants={itemFadeUp} className="text-[#9CA3AF] font-display text-[10px] font-bold uppercase tracking-widest mt-5 text-left md:text-right">
                Global reach. 100% Confidential.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      </main>
    </>
  );
}