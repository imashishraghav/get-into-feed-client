"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from "next-sanity";
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Loader2 } from 'lucide-react';

// --- SANITY CONNECTION ---
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false, // Ensures fresh data
});

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

// Premium Arrow Component for Hover States
const HoverArrow = () => (
  <div className="relative w-10 h-10 rounded-full border border-current flex items-center justify-center overflow-hidden shrink-0">
    <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] delay-75">
      <ArrowUpRight size={18} />
    </div>
    <div className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500 ease-[0.16,1,0.3,1]">
      <ArrowUpRight size={18} />
    </div>
  </div>
);

export default function CaseStudiesPage() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const query = `*[_type == "caseStudies"] | order(_createdAt desc) {
          _id,
          title,
          client,
          "slug": slug.current,
          "imageUrl": coverImage.asset->url,
          category,
          summary,
          metrics
        }`;
        const data = await client.fetch(query);
        setStudies(data);
      } catch (error) {
        console.error("Error fetching case studies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, []);

  // Generate unique categories for the filter menu based on Sanity data
  const categories = ['ALL', ...new Set(studies.map(study => study.category).filter(Boolean))];

  // Filter studies based on selected category
  const filteredStudies = activeFilter === 'ALL' 
    ? studies 
    : studies.filter(study => study.category === activeFilter);

  // Split data: First item is Featured, rest go in the grid
  const featuredCaseStudy = filteredStudies.length > 0 ? filteredStudies[0] : null;
  const remainingStudies = filteredStudies.length > 1 ? filteredStudies.slice(1) : [];

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
        <div className="absolute top-[5%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C9A227]/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none z-0" />

        {/* =========================================
            SECTION 1: HERO & FILTERS
        ========================================= */}
        <section className="relative pt-40 pb-16 md:pt-48 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_24px_rgb(15,23,42,0.04)] mb-8">
              <div className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse"></div>
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#0F172A]">
                Case Studies
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-heading text-6xl md:text-7xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] text-[#0F172A] mb-8 uppercase">
              Proof, <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #0F172A' }}>Not Promises.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="font-body text-[#6B7280] text-lg md:text-xl leading-relaxed max-w-xl mb-12">
              We don't deal in hypothetical strategies. Dive into the raw data and discover exactly how we engineered compounding growth for elite global brands.
            </motion.p>

            {/* Category Filters */}
            {!loading && categories.length > 1 && (
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-6 py-2.5 rounded-full font-mono text-xs font-bold tracking-[0.15em] uppercase transition-all duration-500 ${
                      activeFilter === cat
                        ? 'bg-[#0F172A] text-white shadow-md'
                        : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#0F172A] hover:text-[#0F172A]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#C9A227] relative z-10">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
            <p className="font-mono tracking-widest uppercase text-sm text-[#0F172A]">Loading Case Studies...</p>
          </div>
        ) : filteredStudies.length === 0 ? (
          <div className="text-center py-32 relative z-10">
            <h3 className="font-heading text-3xl font-bold text-[#0F172A] mb-4">No Case Studies Found</h3>
            <p className="font-body text-[#6B7280]">We are currently updating our portfolio. Check back soon.</p>
          </div>
        ) : (
          <>
            {/* =========================================
                SECTION 2: FEATURED CASE STUDY (Dynamic)
            ========================================= */}
            {featuredCaseStudy && (
              <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 mb-16 md:mb-24">
                <Link 
                  href={`/work/${featuredCaseStudy.slug}`}
                  className="group block relative w-full rounded-[3rem] overflow-hidden bg-[#0F172A] text-white shadow-[0_16px_60px_rgb(15,23,42,0.15)]"
                >
                  <motion.div 
                    variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                  >
                    {/* Cinematic Background Image */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center opacity-40 group-hover:opacity-50 transition-all duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                        style={{ backgroundImage: `url(${featuredCaseStudy.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-16 lg:p-20 flex flex-col justify-end min-h-[600px] md:min-h-[700px]">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        
                        {/* Left Content */}
                        <div className="max-w-3xl">
                          <div className="flex items-center gap-4 mb-8">
                            <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase bg-[#C9A227] text-[#0F172A] px-3 py-1.5 rounded-full">Featured</span>
                            {featuredCaseStudy.category && (
                              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#F3F4F6]">{featuredCaseStudy.category}</span>
                            )}
                          </div>
                          
                          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] mb-6 group-hover:text-[#F3F4F6] transition-colors">
                            {featuredCaseStudy.title}
                          </h2>
                          
                          {featuredCaseStudy.summary && (
                            <p className="font-body text-[#9CA3AF] text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
                              {featuredCaseStudy.summary}
                            </p>
                          )}

                          {featuredCaseStudy.metrics && featuredCaseStudy.metrics.length > 0 && (
                            <div className="flex flex-wrap items-center gap-6 md:gap-12">
                              {featuredCaseStudy.metrics.map((metric, idx) => (
                                <div key={idx}>
                                  <p className="font-heading text-4xl md:text-5xl font-black text-[#C9A227] mb-2">{metric.value}</p>
                                  <p className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#9CA3AF]">{metric.label}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right Interactive Icon */}
                        <div className="hidden lg:flex text-white group-hover:text-[#C9A227] transition-colors duration-500">
                          <HoverArrow />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </section>
            )}

            {/* =========================================
                SECTION 3: ARCHIVE GRID (Dynamic)
            ========================================= */}
            {remainingStudies.length > 0 && (
              <section className="pb-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  {remainingStudies.map((study, idx) => (
                    <motion.div
                      key={study._id}
                      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: idx * 0.1, ease: premiumEase }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <Link
                        href={`/work/${study.slug}`}
                        className="group flex flex-col bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-[0_8px_40px_rgb(15,23,42,0.03)] hover:shadow-[0_24px_60px_rgb(15,23,42,0.08)] transition-all duration-700 ease-[0.16,1,0.3,1] hover:-translate-y-2 overflow-hidden h-full"
                      >
                        {/* Image Container with Parallax Zoom */}
                        <div className="w-full aspect-[4/3] overflow-hidden relative bg-[#F3F4F6]">
                          <div 
                            className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                            style={{ backgroundImage: `url(${study.imageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'})` }}
                          />
                          {/* Floating Client Tag */}
                          {study.client && (
                            <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md border border-white/50 px-4 py-2 rounded-full shadow-sm">
                              <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#0F172A]">{study.client}</span>
                            </div>
                          )}
                        </div>

                        {/* Content Area */}
                        <div className="p-8 md:p-10 flex flex-col flex-grow">
                          {study.category && (
                            <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A227] mb-4 block">
                              {study.category}
                            </span>
                          )}
                          
                          <h3 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A] mb-4 leading-[1.2] group-hover:text-[#C9A227] transition-colors duration-300">
                            {study.title}
                          </h3>
                          
                          {study.summary && (
                            <p className="font-body text-[#6B7280] text-sm md:text-base leading-relaxed mb-10 flex-grow">
                              {study.summary}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-8 border-t border-[#E5E7EB] mt-auto">
                            <div className="flex items-center gap-8">
                              {study.metrics && study.metrics.map((metric, i) => (
                                <div key={i}>
                                  <p className="font-heading text-2xl font-black text-[#0F172A] mb-1 leading-none">{metric.value}</p>
                                  <p className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[#9CA3AF]">{metric.label}</p>
                                </div>
                              ))}
                            </div>
                            <div className="text-[#0F172A]">
                              <HoverArrow />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* =========================================
            SECTION 4: FOOTER CTA (DARK INITIATION)
        ========================================= */}
        <section className="bg-[#0F172A] rounded-t-[3rem] py-20 md:py-28 px-4 sm:px-6 lg:px-12 relative overflow-hidden z-10">
          
          {/* Rotating background aura */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#C9A227] rounded-full blur-[180px] opacity-[0.15] pointer-events-none mix-blend-screen" 
          />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12"
            >
              {/* Left Side: Text Content */}
              <div className="md:w-2/3 lg:w-3/4 text-left">
                <motion.span variants={fadeUp} className="font-mono text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-[#C9A227] mb-3 block">
                  The Next Success Story
                </motion.span>
                
                <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white mb-4">
                  Ready to scale?
                </motion.h2>

                <motion.p variants={fadeUp} className="font-body text-[#9CA3AF] text-lg md:text-xl leading-relaxed max-w-2xl">
                  If your brand has the infrastructure to handle aggressive growth, we have the mathematical models and elite operators to make it happen. Let's initiate the audit.
                </motion.p>
              </div>

              {/* Right Side: Magnetic Button */}
              <div className="md:w-1/3 lg:w-1/4 flex justify-start md:justify-end">
                <Link 
                  href="/contact"
                  className="group relative overflow-hidden bg-white text-[#0F172A] px-8 md:px-10 py-4 md:py-5 rounded-full font-heading font-bold text-lg tracking-tight uppercase flex items-center justify-center gap-4 w-fit"
                >
                  <div className="absolute inset-0 bg-[#C9A227] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500 whitespace-nowrap">Partner With Us</span>
                  <div className="relative z-10 w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center text-white overflow-hidden shrink-0">
                     <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] delay-75">
                       <ArrowRight size={16} />
                     </div>
                     <div className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500 ease-[0.16,1,0.3,1]">
                       <ArrowRight size={16} />
                     </div>
                  </div>
                </Link>
              </div>

            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}