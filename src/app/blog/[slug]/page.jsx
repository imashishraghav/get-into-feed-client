import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import Newsletter from "@/components/blog/Newsletter";
import BlogCTA from "@/components/blog/BlogCTA";

// ============================================================================
// 🔌 SANITY CLIENT IMPORT (Uncomment when connecting Sanity)
// import { client } from "@/sanity/lib/client"; 
// import { PortableText } from "@portabletext/react";
// ============================================================================

// ============================================================================
// 🟢 1. DYNAMIC SEO METADATA
// ============================================================================
export async function generateMetadata({ params }) {
  // const query = `*[_type == "post" && slug.current == $slug][0]{ title, excerpt }`;
  // const post = await client.fetch(query, { slug: params.slug });
  
  return {
    title: `The 2026 Guide to Scaling Luxury Real Estate | Get Into Feed`, // Use post?.title in production
    description: "Discover the exact full-funnel strategy we use to generate highly qualified leads.", // Use post?.excerpt
  };
}

// ============================================================================
// 🟢 2. MAIN PAGE COMPONENT
// ============================================================================
export default async function SingleBlogPage({ params }) {
  // const slug = params.slug;

  // FETCH DATA FROM SANITY (Replace this block with actual fetch)
  // const query = `*[_type == "post" && slug.current == $slug][0]{
  //   title,
  //   "category": categories[0]->title,
  //   "imageUrl": mainImage.asset->url,
  //   readTime,
  //   publishedAt,
  //   body
  // }`;
  // const post = await client.fetch(query, { slug });

  // ----------------------------------------------------------------------
  // FALLBACK DATA (For visualization before Sanity is connected)
  // ----------------------------------------------------------------------
  const post = {
    title: "How We Scaled a Real Estate Brand to ₹5Cr+ Using Full-Funnel Systems",
    category: "Performance Marketing",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    readTime: "8 min read",
    publishedAt: "April 18, 2026",
    // We simulate body text here for testing
  };

  return (
    <main className="flex flex-col min-h-screen w-full bg-white overflow-hidden scroll-smooth">
      
      {/* ================= 1. ARTICLE HEADER ================= */}
      <article className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 max-w-4xl mx-auto w-full selection:bg-[#2ED1B2]/20 selection:text-[#0EA5A4]">
        
        {/* Back to Blog Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0F172A] transition-colors duration-300 font-['Inter',sans-serif] font-medium mb-10 group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to all insights
        </Link>

        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#0F172A] uppercase tracking-widest bg-slate-100 border border-slate-200 px-4 py-2 rounded-full">
            {post.category}
          </span>
          <div className="flex items-center gap-4 text-slate-500 font-['Inter',sans-serif] text-[15px] font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{post.publishedAt}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-[1.15] mb-12 tracking-tight">
          {post.title}
        </h1>

        {/* Hero Image */}
        <div className="w-full aspect-[16/9] md:aspect-[2/1] rounded-[2rem] overflow-hidden mb-16 bg-slate-100 border border-[#E5E7EB] shadow-sm">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* ================= 2. ARTICLE CONTENT (Reading Area) ================= */}
        {/* We use a narrower width (max-w-3xl) for optimal reading experience */}
        <div className="max-w-3xl mx-auto w-full">
          
          {/* 🔌 SANITY PORTABLE TEXT INTEGRATION
            In production, replace the dummy HTML below with:
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-['Plus_Jakarta_Sans'] prose-headings:font-bold prose-headings:text-[#0F172A] prose-p:font-['Inter'] prose-a:text-[#0EA5A4]">
              <PortableText value={post.body} />
            </div>
          */}

          <div className="font-['Inter',sans-serif] text-[19px] leading-relaxed text-[#475569] space-y-8">
            <p className="text-2xl text-[#0F172A] font-medium leading-snug">
              Stop relying on disjointed campaigns. Discover the exact step-by-step blueprint we use to connect high-converting landing pages with data-driven Meta ads.
            </p>
            
            <p>
              In the fast-paced world of digital marketing, relying on single-channel tactics is a surefire way to burn your budget. Most agencies focus on vanity metrics—likes, clicks, and impressions. But at Get Into Feed, we focus on what actually matters: <strong>predictable revenue and high-quality lead generation.</strong>
            </p>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#0F172A] mt-12 mb-6">
              The Problem with Standard Campaigns
            </h2>
            
            <p>
              When a luxury real estate developer approached us, they were spending heavily on Meta Ads but getting terrible conversion rates. The leads were cheap, but they were entirely unqualified. Their sales team was wasting hours calling people who had no real buying intent.
            </p>

            <ul className="list-disc pl-6 space-y-3 marker:text-[#2ED1B2]">
              <li>Low-intent lead forms directly on Facebook.</li>
              <li>No landing page to educate the buyer.</li>
              <li>Zero retargeting strategy for warm audiences.</li>
            </ul>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#0F172A] mt-12 mb-6">
              The Full-Funnel Solution
            </h2>

            <p>
              We overhauled their entire system. First, we shifted the primary branding colors from white to a sharp, professional black to immediately elevate the perceived value of the properties. Next, we built a custom Next.js landing page that filtered users based on their investment budget before they could even submit their details.
            </p>
          </div>

          {/* Share Article Bottom Bar */}
          <div className="flex items-center justify-between border-t border-b border-[#E5E7EB] py-6 mt-16">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#0F172A]">
              Share this article
            </span>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#0F172A] hover:text-white transition-all duration-300">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </article>

      {/* ================= 3. BOTTOM SECTIONS ================= */}
      {/* Reusing your high-converting components at the end of the post */}
      <Newsletter />
      <BlogCTA />

    </main>
  );
}