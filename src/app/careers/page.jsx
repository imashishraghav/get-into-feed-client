"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe2, Zap, TrendingUp, Laptop, 
  ArrowRight, ArrowUpRight, MapPin, Clock, Loader2 
} from 'lucide-react';
import { createClient } from "next-sanity";
import Link from 'next/link';

// --- SANITY CONNECTION ---
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// --- AWWWARDS-LEVEL ANIMATION CONFIG ---
const premiumEase = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredJob, setHoveredJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const query = `*[_type == "job" && isActive == true] | order(_createdAt desc) {
          _id, role, type, location, department, description, applyLink
        }`;
        const data = await client.fetch(query);
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

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
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C9A227]/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none z-0" />

        {/* =========================================
            SECTION 1: HERO
        ========================================= */}
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_24px_rgb(15,23,42,0.04)] mb-8">
              <div className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse"></div>
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#0F172A]">
                Careers at Get Into Feed
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-heading text-6xl md:text-7xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] text-[#0F172A] mb-8 uppercase">
              Join the <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #0F172A' }}>Elite.</span>
            </motion.h1>

            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-[#E5E7EB]">
              <p className="font-body text-[#6B7280] text-lg md:text-xl leading-relaxed max-w-md">
                We are a high-performance collective of operators and growth strategists. We don't believe in average results. If you are top 1% talent, this is your new home.
              </p>
              <div className="flex flex-col justify-end items-start md:items-end">
                <a href="#open-roles" className="group relative overflow-hidden bg-[#0F172A] text-white px-8 py-4 rounded-full font-heading font-bold text-base tracking-tight flex items-center gap-3 shadow-[0_8px_20px_rgb(15,23,42,0.15)]">
                  <div className="absolute inset-0 bg-[#C9A227] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0"></div>
                  <span className="relative z-10 transition-colors duration-500">View Open Positions</span>
                  <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* =========================================
            SECTION 2: EDITORIAL MANIFESTO
        ========================================= */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="bg-white rounded-[3rem] p-8 md:p-16 border border-[#E5E7EB] shadow-[0_8px_40px_rgb(15,23,42,0.04)] relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <motion.div variants={fadeUp} className="order-2 lg:order-1">
                <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-6 block">The Mindset</span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-8 leading-[1.1]">
                  Perfection is the <br /> enemy of scale.
                </h2>
                <div className="space-y-6 font-body text-[#6B7280] text-lg leading-relaxed">
                  <p>
                    Our culture is built on a ruthless meritocracy. Titles mean nothing. Data wins every argument. We care purely about velocity, execution, and compounding returns.
                  </p>
                  <p>
                    If you prefer slow-moving corporate environments, endless meetings, or rigid hierarchies, we are not the agency for you. We operate at market speed.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="order-1 lg:order-2 w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-[#F3F4F6] rounded-[2rem] overflow-hidden relative">
                <motion.div 
                  initial={{ scale: 1.2, filter: "grayscale(100%)" }}
                  whileInView={{ scale: 1, filter: "grayscale(20%)" }}
                  transition={{ duration: 1.5, ease: premiumEase }}
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply opacity-90"
                ></motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent"></div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* =========================================
            SECTION 3: GLOBAL PERKS
        ========================================= */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 md:mb-24">
              <div>
                <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-4 block">The Arsenal</span>
                <h2 className="font-heading text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] text-[#0F172A]">
                  Unfair <br /> Advantages.
                </h2>
              </div>
              <p className="font-body text-[#6B7280] max-w-sm text-lg">
                We demand elite performance, and we provide an elite environment to support it. No standard pizza Fridays here.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Work Anywhere', desc: 'True global remote work. Bali, London, or New York—your location is irrelevant, only your output matters.', icon: <Globe2 className="w-6 h-6" /> },
                { title: 'Profit Sharing', desc: 'Skin in the game. Our top performers receive performance equity and quarterly profit-sharing bonuses.', icon: <TrendingUp className="w-6 h-6" /> },
                { title: 'Ultimate Stack', desc: 'No budget caps on tools. You get the highest-end hardware and access to enterprise-level software.', icon: <Laptop className="w-6 h-6" /> },
                { title: 'Global Retreats', desc: 'Twice a year, we fly the entire agency to a global hub for intense strategy sessions and high-end networking.', icon: <Zap className="w-6 h-6" /> }
              ].map((perk, idx) => (
                <motion.div 
                  key={idx} 
                  variants={fadeUp}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: premiumEase }}
                  className="bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-[0_4px_20px_rgb(15,23,42,0.02)] hover:shadow-[0_20px_40px_rgb(15,23,42,0.08)] hover:border-[#D1D5DB] flex flex-col justify-between min-h-[320px] group cursor-default"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#0F172A] group-hover:bg-[#0F172A] group-hover:text-white transition-colors duration-500 mb-8">
                    {perk.icon}
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold mb-4 text-[#0F172A]">{perk.title}</h4>
                    <p className="font-body text-[#6B7280] text-sm leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* =========================================
            SECTION 4: OPEN POSITIONS (SANITY LINKED)
        ========================================= */}
        <section id="open-roles" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <motion.div variants={fadeUp} className="mb-16">
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-4 block">Hiring Now</span>
              <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tighter uppercase text-[#0F172A]">
                Open Roles
              </h2>
            </motion.div>

            <div className="flex flex-col border-t border-[#E5E7EB]">
              {loading ? (
                 <div className="flex flex-col items-center justify-center py-20 text-[#C9A227]">
                   <Loader2 className="animate-spin w-10 h-10 mb-4" />
                   <p className="font-mono tracking-widest uppercase text-sm text-[#6B7280]">Loading Opportunities...</p>
                 </div>
              ) : jobs.length === 0 ? (
                 <div className="text-center py-20 border-b border-[#E5E7EB]">
                   <h3 className="font-heading text-2xl font-bold text-[#0F172A] mb-2">No Openings Right Now</h3>
                   <p className="font-body text-[#6B7280]">We are currently not hiring, but keep an eye on this page for future opportunities!</p>
                 </div>
              ) : (
                jobs.map((job) => (
                  <motion.div 
                    key={job._id}
                    variants={fadeUp}
                    onMouseEnter={() => setHoveredJob(job._id)}
                    onMouseLeave={() => setHoveredJob(null)}
                    className="group flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 border-b border-[#E5E7EB] hover:bg-white hover:px-6 lg:hover:px-10 transition-all duration-500 ease-[0.16,1,0.3,1] relative overflow-hidden rounded-xl"
                  >
                    <div className="flex flex-col md:w-5/12 mb-4 md:mb-0 relative z-10">
                      <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-2">
                        {job.department || 'Growth'}
                      </span>
                      <h4 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] group-hover:text-[#C9A227] transition-colors duration-300">
                        {job.role}
                      </h4>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:w-5/12 gap-4 md:gap-8 text-[#6B7280] font-body text-sm relative z-10">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {job.type}
                      </div>
                    </div>

                    <div className="hidden md:flex md:w-2/12 justify-end relative z-10">
                      {job.applyLink ? (
                        <Link href={job.applyLink} target="_blank" rel="noopener noreferrer" className={`relative w-12 h-12 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#0F172A] overflow-hidden transition-all duration-500 ${hoveredJob === job._id ? 'bg-[#0F172A] border-[#0F172A] text-white' : 'bg-white'}`}>
                          <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] delay-75">
                            <ArrowUpRight size={20} />
                          </div>
                          <div className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500 ease-[0.16,1,0.3,1]">
                            <ArrowUpRight size={20} />
                          </div>
                        </Link>
                      ) : (
                        <div className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">
                          Closed
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </section>

        {/* =========================================
            SECTION 5: FOOTER CTA (DARK INITIATION)
            Refinement: Reduced vertical spacing for a compact layout
        ========================================= */}
        <section className="mt-12 bg-[#0F172A] rounded-t-[3rem] py-12 md:py-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden z-10">
          
          {/* Rotating background aura inside dark section */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#C9A227] rounded-full blur-[180px] opacity-[0.15] pointer-events-none mix-blend-screen" 
          />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <motion.div 
              variants={staggerContainer} 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12"
            >
              
              {/* Left Side: Text Content (Tightened spacing) */}
              <div className="md:w-2/3 lg:w-3/4 text-left">
                <motion.span variants={fadeUp} className="font-mono text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-[#C9A227] mb-3 block">
                  Open Application
                </motion.span>
                
                <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white mb-4">
                  Don't see your role?
                </motion.h2>

                <motion.p variants={fadeUp} className="font-body text-[#9CA3AF] text-lg md:text-xl leading-relaxed max-w-2xl">
                  We are always looking for outlier talent. If you believe your skill set can drastically shift our needle, bypass the board and pitch us directly.
                </motion.p>
              </div>

              {/* Right Side: Button */}
              <div className="md:w-1/3 lg:w-1/4 flex justify-start md:justify-end">
                <motion.a 
                  href="mailto:talent@agency.global"
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ ease: premiumEase, duration: 0.5 }}
                  className="group relative overflow-hidden bg-white text-[#0F172A] px-8 md:px-10 py-4 md:py-5 rounded-full font-heading font-bold text-lg tracking-tight uppercase flex items-center justify-center gap-4 w-fit"
                >
                  <div className="absolute inset-0 bg-[#C9A227] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500 whitespace-nowrap">Pitch Your Role</span>
                  <div className="relative z-10 w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center text-white overflow-hidden shrink-0">
                     <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] delay-75">
                       <ArrowUpRight size={16} />
                     </div>
                     <div className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500 ease-[0.16,1,0.3,1]">
                       <ArrowUpRight size={16} />
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