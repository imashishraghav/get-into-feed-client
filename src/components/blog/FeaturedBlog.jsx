// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

/* // ============================================================================
// 🔌 SANITY CMS FETCH EXAMPLE (In your app/blog/page.jsx):
// ============================================================================
// const query = `*[_type == "post"] | order(_createdAt desc)[0]{
//   title,
//   "slug": slug.current,
//   excerpt,
//   "category": categories[0]->title,
//   "imageUrl": mainImage.asset->url,
//   readTime
// }`;
// const featuredPost = await client.fetch(query);
// ============================================================================ */

// ----------------------------------------------------------------------
// Fallback Data (If Sanity fetch is delayed or empty)
// ----------------------------------------------------------------------
const fallbackPost = {
  title: "How We Scaled a Real Estate Brand to ₹5Cr+ Using Full-Funnel Systems",
  slug: "scaled-real-estate-brand-full-funnel",
  excerpt: "Stop relying on disjointed campaigns. Discover the exact step-by-step blueprint we use to connect high-converting landing pages with data-driven Meta ads for premium market domination.",
  category: "Performance Marketing",
  imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", 
  readTime: "8 min read"
};

// ----------------------------------------------------------------------
// Framer Motion Variants
// ----------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

export default function FeaturedBlog({ post }) {
  const displayPost = post || fallbackPost;

  return (
    <section className="relative w-full bg-background pb-20 md:pb-28 selection:bg-primary/20 selection:text-secondary transform-gpu">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="transform-gpu"
        >
          {/* Featured Card Container 
            Uses group for nested hover effects (zoom and color shifts)
          */}
          <Link href={`/blog/${displayPost.slug}`} className="block group outline-none">
            <motion.article 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex flex-col lg:flex-row bg-white rounded-3xl border border-navy/10 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-navy/20 overflow-hidden transition-all duration-500 ease-out transform-gpu"
            >
              
              {/* ================= LEFT SIDE: IMAGE ================= */}
              <div className="relative w-full lg:w-1/2 aspect-[4/3] lg:aspect-[4/3.5] overflow-hidden bg-slate-100">
                <img 
                  src={displayPost.imageUrl} 
                  alt={displayPost.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[800ms] ease-[0.16,1,0.3,1] transform-gpu"
                />
                {/* Subtle dark overlay for premium contrast */}
                <div className="absolute inset-0 bg-navy/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* ================= RIGHT SIDE: CONTENT ================= */}
              <div className="w-full lg:w-1/2 p-8 md:p-10 lg:p-14 flex flex-col justify-center">
                
                {/* Meta Row: Category & Read Time */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-heading text-xs md:text-sm font-bold text-navy uppercase tracking-widest bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full">
                    {displayPost.category}
                  </span>
                  {displayPost.readTime && (
                    <div className="flex items-center gap-1.5 text-navy/50 font-sans text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      <span>{displayPost.readTime}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold text-navy leading-tight md:leading-[1.15] mb-5 transition-colors duration-300">
                  {displayPost.title}
                </h2>

                {/* Excerpt */}
                <p className="font-sans text-[17px] text-navy/70 font-medium leading-relaxed mb-10 line-clamp-3">
                  {displayPost.excerpt}
                </p>

                {/* Black Professional Branding CTA */}
                <div className="mt-auto flex items-center gap-3">
                  <span className="font-heading font-bold text-lg text-navy">
                    Read Article
                  </span>
                  <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center shadow-md group-hover:bg-primary group-hover:text-navy group-hover:shadow-lg transition-all duration-300 transform-gpu">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>

              </div>

            </motion.article>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}