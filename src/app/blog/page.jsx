"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from "next-sanity";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Mail, Loader2 } from 'lucide-react';

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
const HoverArrow = ({ size = 18 }) => (
  <div className="relative w-10 h-10 rounded-full border border-current flex items-center justify-center overflow-hidden shrink-0">
    <div className="absolute transform -translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1] delay-75">
      <ArrowUpRight size={size} />
    </div>
    <div className="absolute transform translate-x-0 group-hover:translate-x-[150%] transition-transform duration-500 ease-[0.16,1,0.3,1]">
      <ArrowUpRight size={size} />
    </div>
  </div>
);

// Helper function to format dates to "OCT 24, 2023" style
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
};

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetching posts from Sanity with necessary fields
        const query = `*[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          "slug": slug.current,
          "imageUrl": mainImage.asset->url,
          category,
          excerpt,
          publishedAt,
          readTime
        }`;
        const data = await client.fetch(query);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Dynamically generate categories from Sanity data
  const categories = ['All', ...new Set(posts.map(post => post.category).filter(Boolean))];

  // Filter posts based on active category
  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  // Split the data
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const archivePosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <>
      {/* --- PREMIUM TYPOGRAPHY INJECTION --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Plus+Jakarta+Sans:wght@700;800;900&family=Space+Mono:wght@400;700&display=swap');
        .font-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 50px #0F172A inset !important;
          -webkit-text-fill-color: #F9FAFB !important;
        }
      `}} />

      {/* Base: Premium Light Theme */}
      <main className="bg-[#F9FAFB] min-h-screen font-body text-[#0F172A] selection:bg-[#0F172A] selection:text-white relative overflow-hidden pb-0">
        
        {/* Subtle Grain Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

        {/* Blurred Gradient Orbs */}
        <div className="absolute top-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C9A227]/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none z-0" />

        {/* =========================================
            SECTION 1: HERO
        ========================================= */}
        <section className="relative pt-40 pb-16 md:pt-48 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_24px_rgb(15,23,42,0.04)] mb-8">
              <div className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse"></div>
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#0F172A]">
                Intelligence
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-heading text-6xl md:text-7xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] text-[#0F172A] mb-8 uppercase">
              Market <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #0F172A' }}>Signals.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="font-body text-[#6B7280] text-lg md:text-xl leading-relaxed max-w-xl">
              Unfiltered perspectives, technical deep-dives, and mathematical frameworks from our senior strategists and data scientists.
            </motion.p>
          </motion.div>
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#C9A227] relative z-10">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
            <p className="font-mono tracking-widest uppercase text-sm text-[#0F172A]">Loading Intelligence...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-32 relative z-10">
            <h3 className="font-heading text-3xl font-bold text-[#0F172A] mb-4">No Articles Found</h3>
            <p className="font-body text-[#6B7280]">We are currently updating our editorial pipeline. Check back soon.</p>
          </div>
        ) : (
          <>
            {/* =========================================
                SECTION 2: FEATURED ARTICLE
            ========================================= */}
            {featuredPost && (
              <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 mb-16 md:mb-24">
                <Link 
                 href={`/intel/${featuredPost.slug}`}
                 className="group relative w-full rounded-[3rem] overflow-hidden bg-[#0F172A] text-white shadow-[0_16px_60px_rgb(15,23,42,0.15)] flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]"
                >
                  <motion.div 
                    variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col lg:flex-row w-full h-full"
                  >
                    {/* Left Content */}
                    <div className="lg:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-between relative z-10 order-2 lg:order-1">
                      <div>
                        <div className="flex items-center gap-4 mb-8">
                          <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase bg-[#C9A227] text-[#0F172A] px-3 py-1.5 rounded-full">Editorial</span>
                          {featuredPost.category && (
                            <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[#9CA3AF]">{featuredPost.category}</span>
                          )}
                        </div>
                        
                        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] mb-6 group-hover:text-[#F3F4F6] transition-colors">
                          {featuredPost.title}
                        </h2>
                        
                        {featuredPost.excerpt && (
                          <p className="font-body text-[#9CA3AF] text-base md:text-lg leading-relaxed max-w-xl mb-12 line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-white/10">
                        <div className="flex items-center gap-4 font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#9CA3AF]">
                          {featuredPost.publishedAt && <span>{formatDate(featuredPost.publishedAt)}</span>}
                          {featuredPost.readTime && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-[#C9A227]"></span>
                              <span>{featuredPost.readTime}</span>
                            </>
                          )}
                        </div>
                        <div className="text-white group-hover:text-[#C9A227] transition-colors duration-500">
                          <HoverArrow />
                        </div>
                      </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 relative overflow-hidden order-1 lg:order-2 min-h-[300px] lg:min-h-full">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105 opacity-80"
                        style={{ backgroundImage: `url(${featuredPost.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] to-transparent hidden lg:block"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent lg:hidden"></div>
                    </div>
                  </motion.div>
                </Link>
              </section>
            )}

            {/* =========================================
                SECTION 3: CATEGORY FILTERS
            ========================================= */}
            {categories.length > 1 && (
              <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: premiumEase }} viewport={{ once: true }}
                  className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-[#E5E7EB]"
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`font-mono text-xs font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-t-lg transition-all duration-300 whitespace-nowrap border-b-2 ${
                        activeCategory === category 
                          ? 'text-[#0F172A] border-[#0F172A]' 
                          : 'text-[#9CA3AF] border-transparent hover:text-[#0F172A]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </motion.div>
              </section>
            )}

            {/* =========================================
                SECTION 4: ARCHIVE GRID
            ========================================= */}
            {archivePosts.length > 0 && (
              <section className="pb-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {archivePosts.map((post, idx) => (
                      <motion.div
                        key={post._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.5, ease: premiumEase, delay: idx * 0.05 }}
                      >
                        <Link
                          href={`/intel/${post.slug}`}
                          className="group flex flex-col bg-white rounded-[2rem] border border-[#E5E7EB] shadow-[0_8px_40px_rgb(15,23,42,0.02)] hover:shadow-[0_20px_40px_rgb(15,23,42,0.08)] hover:border-[#D1D5DB] transition-all duration-700 ease-[0.16,1,0.3,1] hover:-translate-y-2 overflow-hidden h-full"
                        >
                          {/* Image Container */}
                          <div className="w-full aspect-[16/10] overflow-hidden relative bg-[#F3F4F6]">
                            <div 
                              className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105"
                              style={{ backgroundImage: `url(${post.imageUrl || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop'})` }}
                            />
                            {post.category && (
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[#0F172A]">{post.category}</span>
                              </div>
                            )}
                          </div>

                          {/* Content Area */}
                          <div className="p-6 md:p-8 flex flex-col flex-grow">
                            <h3 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-[#0F172A] mb-4 leading-[1.3] group-hover:text-[#C9A227] transition-colors duration-300 line-clamp-3">
                              {post.title}
                            </h3>
                            
                            {post.excerpt && (
                              <p className="font-body text-[#6B7280] text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                                {post.excerpt}
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB] mt-auto">
                              <div className="flex flex-col">
                                {post.publishedAt && <p className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1">{formatDate(post.publishedAt)}</p>}
                                {post.readTime && <p className="font-body text-xs font-medium text-[#0F172A]">{post.readTime}</p>}
                              </div>
                              <div className="text-[#0F172A] group-hover:text-[#C9A227] transition-colors duration-300">
                                <HoverArrow size={16} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>
            )}
          </>
        )}

        {/* =========================================
            SECTION 5: FOOTER CTA (NEWSLETTER INITIATION)
        ========================================= */}
        <section className="bg-[#0F172A] rounded-t-[3rem] py-12 md:py-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden z-10">
          
          {/* Rotating background aura */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#C9A227] rounded-full blur-[180px] opacity-[0.1] pointer-events-none mix-blend-screen" 
          />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12"
            >
              {/* Left Side: Content */}
              <div className="lg:w-1/2 text-left">
                <motion.div variants={fadeUp} className="w-16 h-16 rounded-full bg-[#1E293B] border border-white/10 flex items-center justify-center text-[#C9A227] mb-6">
                  <Mail size={24} />
                </motion.div>

                <motion.span variants={fadeUp} className="font-mono text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-[#C9A227] mb-3 block">
                  The Inner Circle
                </motion.span>
                
                <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-4 leading-[1.1]">
                  Get the raw data before <br className="hidden md:block" /> the market reacts.
                </motion.h2>

                <motion.p variants={fadeUp} className="font-body text-[#9CA3AF] text-lg leading-relaxed max-w-xl mb-8">
                  Join 25,000+ founders and elite marketers receiving our proprietary breakdowns, mathematical frameworks, and unreleased case studies every Tuesday.
                </motion.p>
              </div>

              {/* Right Side: Form */}
              <div className="lg:w-5/12 w-full flex justify-start lg:justify-end">
                <motion.form 
                  variants={fadeUp} 
                  onSubmit={(e) => e.preventDefault()}
                  className="w-full relative group flex items-center"
                >
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your work email"
                    className="w-full bg-transparent border-b-2 border-white/20 pb-4 text-xl font-heading font-medium text-white focus:outline-none focus:border-[#C9A227] transition-colors rounded-none placeholder:text-[#64748B]"
                  />
                  <button 
                    type="submit"
                    className="absolute right-0 bottom-4 text-white hover:text-[#C9A227] transition-colors duration-300"
                  >
                    <ArrowRight size={24} />
                  </button>
                </motion.form>
              </div>

            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}