"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from "next-sanity";
import Link from "next/link";
import { motion } from "framer-motion";
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
  MessageSquare,
  Layers,
  Target,
  Activity,
  Fingerprint,
  ArrowLeft,
  Zap
} from 'lucide-react';

// --- SANITY CONNECTION ---
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

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

// --- AWWWARDS-LEVEL ANIMATION CONFIG ---
const premiumEase = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

// --- CAPABILITIES DATA (Fallback/Mock Data) ---
const initialCapabilities = [
  {
    _id: 'social-media-marketing',
    slug: 'social-media-marketing',
    title: 'Social Media Marketing Agency in India',
    shortDescription: 'Creating compelling social strategies that captivate and drive your business growth!',
    icon: <Target size={24} strokeWidth={1.5} />,
  },
  {
    _id: 'data-science',
    slug: 'data-science',
    title: 'Data Science & Tracking Infrastructure',
    shortDescription: 'In a privacy-first world, standard pixels fail. We engineer custom server-side tracking infrastructure and predictive LTV models.',
    icon: <Activity size={24} strokeWidth={1.5} />,
  },
  {
    _id: 'creative-intelligence',
    slug: 'creative-intelligence',
    title: 'Creative Intelligence & Production',
    shortDescription: 'Beautiful creative is useless if it doesn\'t convert. We deploy a high-velocity creative testing framework iterating weekly.',
    icon: <Layers size={24} strokeWidth={1.5} />,
  },
  {
    _id: 'conversion-optimization',
    slug: 'conversion-optimization',
    title: 'Conversion Rate Architecture',
    shortDescription: 'Acquiring traffic is only half the equation. We ruthlessly audit and restructure your landing pages and checkout flows.',
    icon: <Fingerprint size={24} strokeWidth={1.5} />,
  },
  {
    _id: 'seo-dominance',
    slug: 'seo-dominance',
    title: 'Organic Search Dominance',
    shortDescription: 'Technical SEO and high-authority content ecosystems designed to capture intent-driven search traffic.',
    icon: <Search size={24} strokeWidth={1.5} />,
  },
  {
    _id: 'marketing-automation',
    slug: 'marketing-automation',
    title: 'Lifecycle & Automation',
    shortDescription: 'Engineering complex, multi-touchpoint email and SMS flows that dynamically respond to user behavior.',
    icon: <Zap size={24} strokeWidth={1.5} />,
  }
];

// --- EXTENDED TESTIMONIALS DATA (For Slider) ---
const testimonials = [
  {
    quote: "They didn't just run our media; they completely re-architected our acquisition funnel. The result was a 4.2x blended ROAS at unprecedented scale.",
    name: "Elena Rostova",
    role: "CMO, Global FinTech",
    metric: "+320%",
    metricLabel: "QoQ Revenue"
  },
  {
    quote: "Most agencies report on vanity metrics. This team operates like an internal growth squad, holding themselves accountable purely to hard revenue and CAC.",
    name: "Marcus Thorne",
    role: "VP Growth, Enterprise SaaS",
    metric: "-45%",
    metricLabel: "Blended CAC"
  },
  {
    quote: "We were stuck at a plateau for two years. Their proprietary tracking and creative testing frameworks unlocked international markets we thought were impossible to penetrate.",
    name: "Sarah Jenkins",
    role: "CEO, Luxury D2C",
    metric: "6.5x",
    metricLabel: "LTV:CAC Ratio"
  },
  {
    quote: "The speed at which they deploy, test, and iterate is terrifying to our competitors. They are the absolute tip of the spear in digital performance.",
    name: "David Chen",
    role: "Founder, Web3 Protocol",
    metric: "$120M",
    metricLabel: "Value Locked"
  }
];

export default function ServicesPage() {
  // 🚀 Sanity Data State
  const [servicesList, setServicesList] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // 🚀 Fetch Services from Sanity
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const query = `*[_type == "service"] | order(_createdAt asc) {
          _id,
          title,
          "slug": slug.current,
          "iconUrl": icon.asset->url,
          shortDescription
        }`;
        const data = await client.fetch(query);
        // If no data comes back from Sanity, fallback to the initialCapabilities mock data
        setServicesList(data && data.length > 0 ? data : initialCapabilities);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServicesList(initialCapabilities); // Fallback on error
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // 🚀 Gemini API Integration State
  const [topic, setTopic] = useState('');
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  // 🚀 Slider State & Logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(window.innerWidth < 768 ? 1 : 2);
    };
    
    // Initial check
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - cardsPerView);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000); // Advances every 4 seconds

    return () => clearInterval(timer);
  }, [maxIndex]);

  const scrollPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const scrollNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <>
      {/* --- PREMIUM TYPOGRAPHY INJECTION --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Plus+Jakarta+Sans:wght@700;800;900&family=Space+Mono:wght@400;700&display=swap');
        .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
      `}} />

      {/* Base: Premium Light Theme */}
      <main className="bg-[#F9FAFB] min-h-screen font-body text-[#0F172A] selection:bg-[#0F172A] selection:text-white relative overflow-hidden pb-0">
        
        {/* Subtle Grain Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

        {/* Blurred Gradient Orbs */}
        <div className="absolute top-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C9A227]/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-[30%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none z-0" />

        {/* =========================================
            SECTION 1: HERO
        ========================================= */}
        <section className="relative pt-40 pb-16 md:pt-48 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_24px_rgb(15,23,42,0.04)] mb-8">
              <div className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse"></div>
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#0F172A]">
                Capabilities
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-heading text-6xl md:text-7xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] text-[#0F172A] mb-8 uppercase">
              Engineered <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #0F172A' }}>Scale.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="font-body text-[#6B7280] text-lg md:text-xl leading-relaxed max-w-2xl">
              We don't offer generic services. We provide a fully integrated, mathematical infrastructure designed to capture market share and compound your revenue globally.
            </motion.p>
          </motion.div>
        </section>

        {/* =========================================
            SECTION 1.5: INDUSTRY LOGOS (TRUSTED BY)
        ========================================= */}
        <section className="border-y border-[#E5E7EB] bg-white relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <motion.span 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
              className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#9CA3AF] shrink-0 text-center md:text-left"
            >
              Trusted by global outliers
            </motion.span>
            
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center md:justify-end gap-10 md:gap-16 opacity-60 grayscale"
            >
              {['LUMINA', 'NEXUS', 'AETHER', 'VERTEX', 'OMNI'].map((logo, i) => (
                <motion.div 
                  key={i} variants={fadeUp} 
                  className="font-heading text-xl md:text-2xl font-black tracking-tighter text-[#0F172A] hover:text-[#C9A227] hover:grayscale-0 transition-all duration-500 cursor-default"
                >
                  {logo}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =========================================
            SECTION 2: SANITY CONNECTED PREMIUM GRID 
            (FIXED ASYNC ANIMATION BUG)
        ========================================= */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 py-24 md:py-32">
          
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <div className="mb-16 md:mb-20 text-left md:text-center">
              <motion.span variants={fadeUp} className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#8B733A] mb-4 block">
                The Arsenal
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#0F172A] mb-6">
                Core <span className="text-transparent" style={{ WebkitTextStroke: '2px #0F172A' }}>Expertise</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="font-body text-[#6B7280] text-lg leading-relaxed max-w-2xl md:mx-auto">
                Comprehensive digital solutions designed to scale your brand to the next level. Data-driven and brutally effective.
              </motion.p>
            </div>
            
            {/* FIX: Removed the reliance on the parent's stagger for the grid items.
              Now, when the array updates, each element manages its own entrance animation.
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-20">
              {isLoadingServices ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin w-10 h-10 mb-4 text-[#8B733A]" />
                  <p className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#6B7280]">Loading Architecture...</p>
                </motion.div>
              ) : servicesList.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24 border border-dashed border-[#E5E7EB] rounded-[2rem] bg-white/50">
                  <Layers className="w-12 h-12 mx-auto mb-4 text-[#9CA3AF] opacity-50" />
                  <p className="font-body text-[#6B7280]">No services found. Publish them in your Sanity Studio!</p>
                </motion.div>
              ) : (
                servicesList.map((service, index) => (
                  <motion.div
                    /* FIXED: Independent animation parameters */
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: premiumEase, delay: index * 0.15 }}
                    key={service._id || index}
                    className="group bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#F3E8D6] shadow-[0_8px_40px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 ease-out relative overflow-hidden flex flex-col h-full"
                  >
                    {/* Subtle hover glow (matched to the new aesthetic) */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8B733A]/5 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    {/* Dark Icon Box */}
                    <div className="w-14 h-14 bg-[#1E2330] rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-sm text-white">
                      {service.iconUrl ? (
                        <img src={service.iconUrl} alt={service.title} className="w-8 h-8 object-contain" />
                      ) : (
                        service.icon || <Sparkles size={24} strokeWidth={1.5} />
                      )}
                    </div>
                    
                    {/* Golden Title */}
                    <h3 className="font-heading text-2xl font-bold text-[#8B733A] leading-[1.2] mb-4 pr-4 relative z-10 tracking-tight">
                      {service.title}
                    </h3>
                    
                    {/* Description Text */}
                    <p className="font-body text-[#6B7280] text-sm leading-relaxed mb-8 relative z-10 pr-2 flex-grow">
                      {service.shortDescription}
                    </p>

                    <div className="mt-auto">
                      {/* Thin Divider Line */}
                      <div className="h-[1px] w-full bg-gradient-to-r from-gray-100 via-gray-200 to-transparent mb-6 relative z-10"></div>
                      
                      {/* CTA */}
                      <a href={`/services/${service.slug}`} className="inline-flex items-center font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#0F172A] group-hover:text-[#8B733A] transition-colors duration-300 relative z-10">
                        Explore Service
                        <ArrowRight className="w-4 h-4 ml-3 transform group-hover:translate-x-2 transition-transform duration-300 ease-[0.16,1,0.3,1]" />
                      </a>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </section>

        {/* =========================================
            SECTION 3: THE ECOSYSTEM (DARK CONTRAST)
        ========================================= */}
        
        <section className="bg-[#0F172A] text-[#F9FAFB] py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden my-12 rounded-[3rem] mx-4 sm:mx-6 max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-3rem)] lg:max-w-7xl lg:mx-auto">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-4xl mx-auto text-center relative z-10 mb-20">
            <motion.span variants={fadeUp} className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-6 block">
              The Growth Ecosystem
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-6xl font-black tracking-tighter text-white mb-8">
              Isolation fails. <br className="hidden md:block" /> Integration scales.
            </motion.h2>
            <motion.p variants={fadeUp} className="font-body text-[#9CA3AF] text-lg leading-relaxed max-w-2xl mx-auto">
              A brilliant creative ad fails if the landing page converts poorly. A great landing page fails if tracking is broken. We don't operate in silos; we manage the entire closed-loop ecosystem.
            </motion.p>
          </motion.div>

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 relative">
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-white/10 -translate-y-1/2 z-0"></div>
              {['Acquisition', 'Conversion', 'Retention'].map((phase, idx) => (
                <motion.div key={idx} variants={fadeUp} className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center relative z-10 hover:bg-white/[0.06] transition-colors duration-500">
                  <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#C9A227] mb-4">PHASE 0{idx + 1}</div>
                  <h4 className="font-heading text-2xl font-bold text-white mb-4">{phase}</h4>
                  <p className="font-body text-sm text-[#9CA3AF] leading-relaxed">
                    {idx === 0 && "Driving hyper-targeted traffic through data-backed media buying and creative hooks."}
                    {idx === 1 && "Eliminating friction and engineering high-velocity funnels that maximize immediate AOV."}
                    {idx === 2 && "Increasing predictive LTV through backend automation and post-purchase architecture."}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 3.5: CLIENT PROOF (FRAMER MOTION SLIDER)
        ========================================= */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 md:mb-20">
              <div>
                <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#8B733A] mb-4 block">The Verdict</span>
                <h2 className="font-heading text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-[#0F172A]">
                  Market <br /> Validation.
                </h2>
              </div>
              
              {/* Custom Navigation Controls */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={scrollPrev}
                  className="w-12 h-12 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft size={20} />
                </button>
                <button 
                  onClick={scrollNext}
                  className="w-12 h-12 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-colors duration-300"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Framer Motion Animated Slider Track */}
            <div className="overflow-hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pb-8 pt-4">
              <motion.div 
                className="flex"
                animate={{ x: `-${currentIndex * (100 / cardsPerView)}%` }}
                transition={{ ease: premiumEase, duration: 1 }}
              >
                {testimonials.map((test, idx) => (
                  <div 
                    key={idx}
                    className="w-full md:w-1/2 flex-shrink-0 px-4 sm:px-6 lg:px-8"
                  >
                    <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-[#E5E7EB] shadow-[0_8px_40px_rgb(15,23,42,0.03)] flex flex-col justify-between group hover:shadow-[0_20px_60px_rgb(15,23,42,0.08)] hover:-translate-y-2 transition-all duration-700 h-full min-h-[420px]">
                      <div className="mb-12 relative flex-grow">
                        <span className="text-[#E5E7EB] text-8xl font-heading font-black absolute -top-8 -left-6 opacity-50 pointer-events-none select-none group-hover:text-[#8B733A] transition-colors duration-500">"</span>
                        <p className="font-body text-[#0F172A] text-lg md:text-xl leading-relaxed font-medium relative z-10">
                          {test.quote}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-[#E5E7EB] mt-auto">
                        <div>
                          <h4 className="font-heading text-lg font-bold text-[#0F172A]">{test.name}</h4>
                          <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B7280] mt-1">{test.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading text-3xl md:text-4xl font-black text-[#8B733A] tracking-tighter">{test.metric}</p>
                          <p className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[#0F172A] mt-1">{test.metricLabel}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

          </motion.div>
        </section>

        {/* =========================================
            SECTION 4: FOOTER CTA (AUDIT INITIATION)
        ========================================= */}
        <section className="bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden z-10 border-t border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 md:gap-12"
            >
              
              <div className="lg:w-2/3 text-left">
                <motion.span variants={fadeUp} className="font-mono text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-[#8B733A] mb-3 block">
                  Next Steps
                </motion.span>
                
                <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[#0F172A] mb-4 leading-[1.1]">
                  Initiate the <br className="hidden md:block" /> Growth Audit.
                </motion.h2>

                <motion.p variants={fadeUp} className="font-body text-[#6B7280] text-lg leading-relaxed max-w-2xl">
                  Let our senior strategists analyze your current infrastructure, uncover hidden bottlenecks, and build a mathematical roadmap for aggressive scaling.
                </motion.p>
              </div>

              <div className="lg:w-1/3 flex justify-start lg:justify-end">
                <motion.a 
                  href="/contact"
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ ease: premiumEase, duration: 0.5 }}
                  className="group relative overflow-hidden bg-[#0F172A] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-heading font-bold text-lg tracking-tight uppercase flex items-center justify-center gap-4 w-fit shadow-[0_8px_20px_rgb(15,23,42,0.15)]"
                >
                  <div className="absolute inset-0 bg-[#8B733A] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500 whitespace-nowrap">Schedule Audit</span>
                  <div className="relative z-10 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white overflow-hidden shrink-0">
                     <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] delay-75">
                       <ArrowRight size={16} />
                     </div>
                     <div className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500 ease-[0.16,1,0.3,1]">
                       <ArrowRight size={16} />
                     </div>
                  </div>
                </motion.a>
              </div>

            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}