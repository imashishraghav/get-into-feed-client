// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

/* // ============================================================================
// 🔌 SANITY CMS FETCH EXAMPLE (In your app/blog/page.jsx):
// ============================================================================
// const query = `*[_type == "post"] | order(_createdAt desc) {
//   title,
//   "slug": slug.current,
//   excerpt,
//   "category": categories[0]->title,
//   "imageUrl": mainImage.asset->url,
//   readTime
// }`;
// const allPosts = await client.fetch(query);
// ============================================================================ */

// ----------------------------------------------------------------------
// Fallback Data (If Sanity fetch is delayed or empty)
// ----------------------------------------------------------------------
const fallbackPosts = [
  {
    id: 1,
    title: "5 Proven Strategies to Lower CPA on Meta Ads in 2026",
    slug: "lower-cpa-meta-ads",
    excerpt: "Struggling with rising ad costs? Discover the exact creative and targeting tweaks we use to consistently lower Cost Per Acquisition for premium brands.",
    category: "Performance Marketing",
    imageUrl: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070&auto=format&fit=crop",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Why Your Luxury Real Estate Leads Aren't Converting",
    slug: "luxury-real-estate-leads-conversion",
    excerpt: "Generating leads is easy. Closing them is hard. Learn how to build a high-intent funnel that filters out junk and delivers qualified real estate buyers.",
    category: "Real Estate",
    imageUrl: "https://images.unsplash.com/photo-1560518884-ce5882228a4c?q=80&w=2070&auto=format&fit=crop",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "The Power of Clean UI in Landing Page Conversions",
    slug: "clean-ui-landing-page-conversions",
    excerpt: "Design isn't just about looking good; it's about reducing cognitive load. See how a minimalist, black-and-white UI approach increased our client's conversion rate by 40%.",
    category: "Design & CRO",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop",
    readTime: "4 min read"
  },
  {
    id: 4,
    title: "Building Predictable Growth Systems, Not Just Campaigns",
    slug: "predictable-growth-systems",
    excerpt: "Stop the launch-and-pray method. A true growth system integrates your ads, landing pages, and email automation into one seamless revenue engine.",
    category: "Growth Strategy",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    readTime: "6 min read"
  }
];

// ----------------------------------------------------------------------
// Framer Motion Variants
// ----------------------------------------------------------------------
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
};

export default function BlogGrid({ posts = [] }) {
  const displayPosts = posts.length > 0 ? posts : fallbackPosts;

  return (
    <section className="relative w-full bg-background py-12 md:py-20 selection:bg-primary/20 selection:text-secondary transform-gpu">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 transform-gpu"
        >
          {displayPosts.map((post, index) => (
            <BlogCard key={post.id || index} post={post} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Blog Card Component
// ----------------------------------------------------------------------
function BlogCard({ post }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full transform-gpu"
    >
      <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white rounded-3xl border border-navy/10 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-navy/20 overflow-hidden transition-all duration-500 ease-out outline-none">
        
        {/* ================= TOP: IMAGE ================= */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
          <img 
            src={post.imageUrl || post.image} // Handles standard or Sanity resolved URL
            alt={post.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[800ms] ease-[0.16,1,0.3,1] transform-gpu"
          />
          {/* Subtle overlay to enhance contrast */}
          <div className="absolute inset-0 bg-navy/[0.02] group-hover:bg-transparent transition-colors duration-500" />
        </div>

        {/* ================= BOTTOM: CONTENT ================= */}
        <div className="flex flex-col flex-grow p-6 md:p-8">
          
          {/* Meta Row: Category & Time */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="font-heading text-xs font-bold text-navy uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-md">
              {post.category}
            </span>
            {post.readTime && (
              <div className="flex items-center gap-1.5 text-navy/50 font-sans text-[13px] font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading text-xl md:text-2xl font-extrabold text-navy leading-tight mb-3 group-hover:text-secondary transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="font-sans text-navy/70 font-medium leading-relaxed mb-8 line-clamp-3 flex-grow">
            {post.excerpt}
          </p>

          {/* Premium CTA Row */}
          <div className="mt-auto flex items-center justify-between border-t border-navy/10 pt-5">
            <span className="font-heading font-bold text-navy text-[15px]">
              Read More
            </span>
            <div className="w-8 h-8 rounded-full bg-background text-navy flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}